/**
 * DEM (Digital Elevation Model) Processor & Terrain Geometry Generator
 * Computes elevation arrays, slopes, roughness, normal vectors, and cross-section profiles.
 */

// Generate realistic synthetic Digital Elevation Model matrices based on geological profile
export function generateRegionDEM(regionId, gridSize = 128) {
  const elevations = new Float32Array(gridSize * gridSize);
  let minElev = 0;
  let maxElev = 1000;
  let label = 'Terrain Elevation Model';

  const half = gridSize / 2;

  if (regionId.includes('shackleton')) {
    // Deep impact crater structure with elevated rim
    label = 'LOLA LOLA_DEM_128PPD_SHACKLETON';
    minElev = -4200;
    maxElev = 1350;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const dx = (x - half) / half;
        const dy = (y - half) / half;
        const r = Math.sqrt(dx * dx + dy * dy);

        let h = 0;
        if (r < 0.65) {
          // Inner crater bowl
          const bowl = Math.pow(r / 0.65, 2.2);
          h = -4200 + bowl * 5100;
        } else if (r < 0.85) {
          // Rim crest
          const rimT = (r - 0.65) / 0.20;
          h = 900 + Math.sin(rimT * Math.PI) * 450;
        } else {
          // Distant ejecta blanket
          const falloff = (r - 0.85) / 0.4;
          h = 900 / (1 + falloff * 3.5);
        }

        // Add micro-roughness & small impact pits
        const micro = (Math.sin(x * 0.4) * Math.cos(y * 0.4) + Math.sin(x * 1.2 + y * 1.2) * 0.4) * 80;
        elevations[y * gridSize + x] = h + micro;
      }
    }
  } else if (regionId.includes('jezero')) {
    // Jezero Crater with river delta fan
    label = 'HiRISE/CTX DTM_JEZERO_DELTA_5M';
    minElev = -2650;
    maxElev = -1400;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const dx = (x - half) / half;
        const dy = (y - half) / half;

        // Base slope down to the southeast
        let h = -2500 - (dx * 180 + dy * 220);

        // Delta fan shape emanating from western channel (dx < -0.4, dy ~ 0)
        const fanDist = Math.sqrt(Math.pow(dx + 0.35, 2) + Math.pow(dy, 2));
        const fanAngle = Math.atan2(dy, dx + 0.35);

        if (fanDist < 0.7 && Math.abs(fanAngle) < 0.85) {
          // Elevated fan lobes
          const lobeH = Math.cos(fanDist * 3.14) * 160 + (1 - fanDist) * 110;
          h += lobeH;
        }

        // Channel incision
        if (dx < -0.3 && Math.abs(dy) < 0.12) {
          h -= 180;
        }

        const micro = (Math.sin(x * 0.35) * Math.cos(y * 0.5) + Math.sin(y * 0.9) * 0.5) * 45;
        elevations[y * gridSize + x] = h + micro;
      }
    }
  } else if (regionId.includes('malapert') || regionId.includes('mouton')) {
    // Highland massif peak
    label = 'LOLA Polar Massif High Topography';
    minElev = 1200;
    maxElev = 5800;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const dx = (x - half) / half;
        const dy = (y - half) / half;
        const r = Math.sqrt(dx * dx + dy * dy);

        const peak = Math.max(0, 1 - r * 1.2);
        let h = 1200 + Math.pow(peak, 1.8) * 4200;

        const ridge = Math.cos(dx * 4.5 + dy * 2.0) * 280;
        elevations[y * gridSize + x] = h + ridge;
      }
    }
  } else {
    // Generic complex geological terrain (Earth analog, Arcadia, etc.)
    label = 'SRTM/MOLA Standard Elevation Field';
    minElev = 200;
    maxElev = 2600;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const nx = x / 25;
        const ny = y / 25;
        let h = 1000 + Math.sin(nx) * 600 + Math.cos(ny * 1.5) * 500 + Math.sin(nx * 2 + ny * 2) * 200;
        elevations[y * gridSize + x] = h;
      }
    }
  }

  return {
    regionId,
    label,
    gridSize,
    minElev,
    maxElev,
    elevations
  };
}

/**
 * Derives Slope Map (in degrees) from elevation grid
 */
export function computeSlopeGrid(demData, cellSizeMeters = 30) {
  const { gridSize, elevations } = demData;
  const slopeArray = new Float32Array(gridSize * gridSize);

  for (let y = 1; y < gridSize - 1; y++) {
    for (let x = 1; x < gridSize - 1; x++) {
      const zWest = elevations[y * gridSize + (x - 1)];
      const zEast = elevations[y * gridSize + (x + 1)];
      const zNorth = elevations[(y - 1) * gridSize + x];
      const zSouth = elevations[(y + 1) * gridSize + x];

      const dzdx = (zEast - zWest) / (2 * cellSizeMeters);
      const dzdy = (zSouth - zNorth) / (2 * cellSizeMeters);

      const riseRun = Math.sqrt(dzdx * dzdx + dzdy * dzdy);
      const slopeDeg = Math.atan(riseRun) * (180 / Math.PI);

      slopeArray[y * gridSize + x] = Math.min(60, slopeDeg);
    }
  }

  return slopeArray;
}

/**
 * Extracts a terrain elevation cross-section line profile across the DEM
 * Supports directions: 'WE' (West-East), 'NS' (North-South), 'diagonal' (NW-SE), 'radial'
 */
export function extractCrossSectionProfile(demData, samplesCount = 64, direction = 'WE') {
  const { gridSize, elevations, minElev, maxElev } = demData;
  const profile = [];
  const transectLengthKm = 25.0; // 25 km standard transect window
  const half = Math.floor(gridSize / 2);

  let prevElev = null;

  for (let i = 0; i < samplesCount; i++) {
    const t = i / (samplesCount - 1);
    let x, y;

    if (direction === 'WE') {
      // West to East across center
      x = Math.floor(10 + t * (gridSize - 20));
      y = half;
    } else if (direction === 'NS') {
      // North to South across center
      x = half;
      y = Math.floor(10 + t * (gridSize - 20));
    } else if (direction === 'radial') {
      // Center outwards (0 km at center, 25 km at periphery)
      const angle = 0.785; // 45 deg
      const radius = t * (half - 15);
      x = Math.floor(half + Math.cos(angle) * radius);
      y = Math.floor(half + Math.sin(angle) * radius);
    } else {
      // NW to SE diagonal
      x = Math.floor(12 + t * (gridSize - 24));
      y = Math.floor(12 + t * (gridSize - 24));
    }

    x = Math.max(0, Math.min(gridSize - 1, x));
    y = Math.max(0, Math.min(gridSize - 1, y));

    const elev = elevations[y * gridSize + x] !== undefined ? elevations[y * gridSize + x] : minElev;
    const distanceKm = Number((t * transectLengthKm).toFixed(2));

    // Calculate slope relative to previous step
    let localSlope = 2.5;
    if (prevElev !== null) {
      const stepDistMeters = (transectLengthKm * 1000) / (samplesCount - 1);
      const dElev = Math.abs(elev - prevElev);
      localSlope = Number((Math.atan(dElev / stepDistMeters) * (180 / Math.PI)).toFixed(1));
    }
    prevElev = elev;

    profile.push({
      distanceKm,
      elevationM: Math.round(elev),
      slopeDeg: Math.min(55, localSlope)
    });
  }

  return profile;
}
