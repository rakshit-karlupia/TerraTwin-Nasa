import * as THREE from 'three';

/**
 * Procedural Planetary Canvas Texture Generator
 * Generates high-definition (2048x1024) realistic planetary maps
 * to ensure 100% offline capability, zero CORS dependency, and instant loading.
 */

// Simple pseudo-random hash generator for deterministic procedural terrain
function pseudoNoise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x, y) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;

  // Cubic Hermite interpolation
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);

  const s00 = pseudoNoise(i, j);
  const s10 = pseudoNoise(i + 1, j);
  const s01 = pseudoNoise(i, j + 1);
  const s11 = pseudoNoise(i + 1, j + 1);

  return (s00 * (1 - u) + s10 * u) * (1 - v) + (s01 * (1 - u) + s11 * u) * v;
}

function fbm(x, y, octaves = 5) {
  let val = 0;
  let freq = 1;
  let amp = 0.5;
  let max = 0;
  for (let o = 0; o < octaves; o++) {
    val += smoothNoise(x * freq, y * freq) * amp;
    max += amp;
    freq *= 2.1;
    amp *= 0.5;
  }
  return val / max;
}

/**
 * Creates high-fidelity Earth Day texture
 */
export function createEarthDayTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI; // +pi/2 to -pi/2
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 2 * Math.PI;
      const idx = (y * width + x) * 4;

      // Spherical coordinates projection for noise
      const nx = Math.cos(lon) * cosLat * 2.5;
      const ny = Math.sin(lat) * 2.5;
      const nz = Math.sin(lon) * cosLat * 2.5;

      const elevation = fbm(nx + 10, ny + nz + 10, 6);

      // Polar ice caps
      const isPolar = Math.abs(lat) > 1.25;

      if (isPolar) {
        data[idx] = 230;     // R
        data[idx + 1] = 240; // G
        data[idx + 2] = 250; // B
        data[idx + 3] = 255;
      } else if (elevation < 0.48) {
        // Ocean - deep blue with shallow shelf
        const depth = elevation / 0.48;
        data[idx] = Math.floor(10 + depth * 15);
        data[idx + 1] = Math.floor(40 + depth * 55);
        data[idx + 2] = Math.floor(95 + depth * 75);
        data[idx + 3] = 255;
      } else {
        // Landmass - green to desert brown to mountain peaks
        const landH = (elevation - 0.48) / 0.52;
        if (landH < 0.25) {
          // Lush coastal & lowlands
          data[idx] = 34 + landH * 40;
          data[idx + 1] = 95 + landH * 60;
          data[idx + 2] = 42 + landH * 20;
        } else if (landH < 0.65) {
          // Arid desert & scrubland
          data[idx] = 160 + landH * 40;
          data[idx + 1] = 135 + landH * 30;
          data[idx + 2] = 85;
        } else {
          // Rocky high mountains / snow
          data[idx] = 130 + landH * 80;
          data[idx + 1] = 130 + landH * 80;
          data[idx + 2] = 140 + landH * 90;
        }
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Earth Night City Lights texture
 */
export function createEarthNightTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#010308';
  ctx.fillRect(0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI;
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 2 * Math.PI;
      const idx = (y * width + x) * 4;

      const nx = Math.cos(lon) * cosLat * 2.5;
      const ny = Math.sin(lat) * 2.5;
      const nz = Math.sin(lon) * cosLat * 2.5;

      const elevation = fbm(nx + 10, ny + nz + 10, 5);

      // City lights only on land, concentrated near coasts
      if (elevation >= 0.48 && Math.abs(lat) < 1.1) {
        const landH = (elevation - 0.48) / 0.52;
        const popDensity = Math.pow(smoothNoise(nx * 8 + 3, ny * 8 + nz * 8), 4);
        if (popDensity > 0.4 && landH < 0.5) {
          const intensity = Math.min(255, Math.floor(popDensity * 400));
          data[idx] = intensity;                   // Warm golden city light
          data[idx + 1] = Math.floor(intensity * 0.82);
          data[idx + 2] = Math.floor(intensity * 0.45);
          data[idx + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Earth Atmospheric Clouds texture with alpha
 */
export function createEarthCloudsTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI;
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 2 * Math.PI;
      const idx = (y * width + x) * 4;

      const nx = Math.cos(lon) * cosLat * 3.0;
      const ny = Math.sin(lat) * 3.0;
      const nz = Math.sin(lon) * cosLat * 3.0;

      const cloudNoise = fbm(nx + 50, ny + nz + 50, 5);

      if (cloudNoise > 0.46) {
        const density = Math.min(1.0, (cloudNoise - 0.46) / 0.35);
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = Math.floor(density * 220);
      } else {
        data[idx + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Lunar Surface texture (Highland anorthosite + Basaltic Maria + Crater rings)
 */
export function createMoonTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI;
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 2 * Math.PI;
      const idx = (y * width + x) * 4;

      const nx = Math.cos(lon) * cosLat * 3.5;
      const ny = Math.sin(lat) * 3.5;
      const nz = Math.sin(lon) * cosLat * 3.5;

      const baseRegolith = fbm(nx, ny + nz, 6);
      const mariaNoise = fbm(nx * 0.8 + 20, ny * 0.8 + nz * 0.8 + 20, 4);

      // Craters simulation via sharp high frequency perturbation
      const craterNoise = smoothNoise(nx * 18, ny * 18 + nz * 18);
      const isCraterRim = Math.abs(craterNoise - 0.5) < 0.04;

      let tone;
      if (mariaNoise < 0.42 && Math.abs(lat) < 0.9) {
        // Lunar Mare (Dark basaltic lava plain)
        tone = Math.floor(75 + baseRegolith * 40);
      } else {
        // Lunar Highlands (Lighter anorthositic crust)
        tone = Math.floor(135 + baseRegolith * 60);
      }

      if (isCraterRim) {
        tone = Math.min(240, tone + 45); // Bright reflective crater ejecta
      }

      // Polar cold traps (very deep shadows near poles)
      if (Math.abs(lat) > 1.45 && baseRegolith < 0.35) {
        tone = Math.floor(tone * 0.35); // Permanently shadowed region
      }

      data[idx] = tone;
      data[idx + 1] = tone + 2;
      data[idx + 2] = tone + 6; // Slight cool lunar tint
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Mars Surface texture (Rust iron oxide + dark basaltic highlands + ice caps + Valles Marineris)
 */
export function createMarsTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI;
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 2 * Math.PI;
      const idx = (y * width + x) * 4;

      const nx = Math.cos(lon) * cosLat * 3.0;
      const ny = Math.sin(lat) * 3.0;
      const nz = Math.sin(lon) * cosLat * 3.0;

      const elevation = fbm(nx, ny + nz, 6);
      const darkAlbedo = fbm(nx * 1.2 + 15, ny * 1.2 + nz * 1.2 + 15, 4);

      // Polar Ice Caps (North & South)
      const isNorthCap = lat > 1.35;
      const isSouthCap = lat < -1.40;

      if (isNorthCap || isSouthCap) {
        data[idx] = 240;
        data[idx + 1] = 245;
        data[idx + 2] = 250;
        data[idx + 3] = 255;
      } else {
        // Martian Red/Ochre basemap
        let r = 185 + elevation * 50;
        let g = 85 + elevation * 35;
        let b = 45 + elevation * 25;

        // Dark albedo regions (Syrtis Major, Acidalia Planitia)
        if (darkAlbedo < 0.40) {
          r = Math.floor(r * 0.65);
          g = Math.floor(g * 0.60);
          b = Math.floor(b * 0.65);
        }

        // Valles Marineris linear canyon feature near equator
        const isCanyonLat = Math.abs(lat - (-0.24)) < 0.08;
        const isCanyonLon = lon > 4.8 && lon < 5.8;
        if (isCanyonLat && isCanyonLon) {
          r = Math.floor(r * 0.45);
          g = Math.floor(g * 0.40);
          b = Math.floor(b * 0.45);
        }

        data[idx] = Math.min(255, Math.floor(r));
        data[idx + 1] = Math.min(255, Math.floor(g));
        data[idx + 2] = Math.min(255, Math.floor(b));
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates High-Frequency Elevation Bump Map
 */
export function createBumpTexture(width = 1024, height = 512, octaves = 5) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const val = Math.floor(fbm(x / 40, y / 40, octaves) * 255);
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Scientific Thematic Overlay Textures
 * Supports: 'elevation', 'slope', 'thermal', 'waterIce', 'roughness'
 */
export function createScientificLayerTexture(planetId = 'mars', layerType = 'elevation', width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const isMoon = planetId === 'moon';
  const isMars = planetId === 'mars';

  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI;
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 2 * Math.PI;
      const idx = (y * width + x) * 4;

      const scale = isMoon ? 3.5 : 3.0;
      const nx = Math.cos(lon) * cosLat * scale;
      const ny = Math.sin(lat) * scale;
      const nz = Math.sin(lon) * cosLat * scale;

      const elev = fbm(nx + (isMoon ? 20 : 10), ny + nz + (isMoon ? 20 : 10), 6);

      if (layerType === 'elevation') {
        // MOLA / LOLA Rainbow Hypsometric Tint
        // Blue -> Cyan -> Green -> Yellow -> Red -> White
        if (elev < 0.25) {
          const t = elev / 0.25;
          data[idx] = Math.floor(40 * (1 - t));
          data[idx + 1] = Math.floor(30 + t * 120);
          data[idx + 2] = Math.floor(150 + t * 105);
        } else if (elev < 0.5) {
          const t = (elev - 0.25) / 0.25;
          data[idx] = Math.floor(t * 50);
          data[idx + 1] = Math.floor(150 + t * 105);
          data[idx + 2] = Math.floor(255 * (1 - t));
        } else if (elev < 0.75) {
          const t = (elev - 0.5) / 0.25;
          data[idx] = Math.floor(50 + t * 205);
          data[idx + 1] = 255;
          data[idx + 2] = 0;
        } else {
          const t = (elev - 0.75) / 0.25;
          data[idx] = 255;
          data[idx + 1] = Math.floor(255 * (1 - t * 0.8));
          data[idx + 2] = Math.floor(t * 240);
        }
        data[idx + 3] = 255;

      } else if (layerType === 'slope') {
        // Geotechnical Slope Hazard Map
        const nElev = fbm(nx * 1.05, ny * 1.05 + nz * 1.05, 5);
        const grad = Math.min(1.0, Math.abs(elev - nElev) * 6.5);

        if (grad < 0.25) {
          data[idx] = 0;
          data[idx + 1] = 230;
          data[idx + 2] = 118;
        } else if (grad < 0.6) {
          data[idx] = 255;
          data[idx + 1] = 214;
          data[idx + 2] = 0;
        } else {
          data[idx] = 221;
          data[idx + 1] = 44;
          data[idx + 2] = 0;
        }
        data[idx + 3] = 255;

      } else if (layerType === 'thermal') {
        // Thermal Inertia false color map (Diviner / THEMIS)
        const latEffect = Math.cos(lat);
        const ti = Math.min(1.0, (elev * 0.4 + latEffect * 0.6));

        data[idx] = Math.floor(Math.min(255, 30 + ti * 225));
        data[idx + 1] = Math.floor(Math.min(255, ti > 0.4 ? (ti - 0.4) * 350 : 10));
        data[idx + 2] = Math.floor(Math.min(255, ti < 0.5 ? 180 - ti * 200 : ti * 100));
        data[idx + 3] = 255;

      } else if (layerType === 'waterIce') {
        // Volatile / PSR Water-Ice proxy
        const isPole = Math.abs(lat) > 1.35;
        const coldTrap = isMoon
          ? (isPole && elev < 0.42 ? 0.95 : isPole ? 0.45 : 0.05)
          : (isPole ? 0.90 : (lat > 0.6 && elev < 0.38 ? 0.65 : 0.05));

        if (coldTrap > 0.5) {
          const t = (coldTrap - 0.5) / 0.5;
          data[idx] = Math.floor(6 + t * 200);
          data[idx + 1] = Math.floor(182 + t * 73);
          data[idx + 2] = Math.floor(212 + t * 43);
          data[idx + 3] = 240;
        } else {
          data[idx] = 5;
          data[idx + 1] = 15;
          data[idx + 2] = 25;
          data[idx + 3] = 220;
        }

      } else if (layerType === 'roughness') {
        // Surface Roughness / Boulder density index
        const roughNoise = smoothNoise(nx * 14, ny * 14 + nz * 14);
        const rIndex = (roughNoise + elev * 0.3) / 1.3;

        data[idx] = Math.floor(20 + rIndex * 220);
        data[idx + 1] = Math.floor(20 + rIndex * 140);
        data[idx + 2] = Math.floor(20 + rIndex * 40);
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
