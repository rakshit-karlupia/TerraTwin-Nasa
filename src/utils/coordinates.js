import * as THREE from 'three';

/**
 * Converts Geographic Latitude and Longitude to 3D Cartesian Vector on a Sphere of radius R.
 * Aligns with standard Three.js UV sphere texture coordinates where:
 * - Latitude 0, Longitude 0 lies on the front (+Z or calibrated meridian)
 * - Equirectangular texture map spans lon [-180, +180] from left to right,
 *   and lat [+90, -90] from top to bottom.
 */
export function latLonToVector3(lat, lon, radius = 2.5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Converts 3D Cartesian point on a sphere back to Latitude and Longitude (degrees).
 */
export function vector3ToLatLon(vec, radius = 2.5) {
  const normVec = vec.clone().normalize();
  const lat = 90 - (Math.acos(normVec.y) * 180 / Math.PI);
  let lon = (Math.atan2(normVec.z, -normVec.x) * 180 / Math.PI) - 180;
  
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;

  return {
    lat: Number(lat.toFixed(4)),
    lon: Number(lon.toFixed(4))
  };
}

/**
 * Formats decimal latitude and longitude into human-readable scientific strings.
 * e.g., lat: -84.9, lon: -37.2 -> "84.90° S, 37.20° W"
 */
export function formatCoordinates(lat, lon) {
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

/**
 * Calculates Great Circle Distance between two coordinates on a planetary sphere (km).
 */
export function calculateSurfaceDistanceKm(lat1, lon1, lat2, lon2, planetRadiusKm = 6371) {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return planetRadiusKm * c;
}

/**
 * Returns Coordinate Reference System (CRS) and vertical datum metadata for a planetary body.
 */
export function getCRSByPlanet(planetId = 'mars') {
  const p = (planetId || '').toLowerCase();
  if (p === 'moon') {
    return {
      name: 'IAU 2000 Moon',
      datum: 'IAU 2000 Moon Spherical Coordinate System',
      ellipsoid: 'Mean Moon Sphere (R = 1,737.4 km)',
      verticalDatum: 'LOLA Lunar Topography Model Zero-Datum'
    };
  }
  if (p === 'mars') {
    return {
      name: 'IAU 2000 Mars',
      datum: 'IAU 2000 Mars Planetocentric',
      ellipsoid: 'MOLA Reference Areoid (a = 3,396.19 km, b = 3,376.20 km)',
      verticalDatum: 'MOLA Topographic Areoid Datum (0m = 610.5 Pa)'
    };
  }
  return {
    name: 'WGS 84 (EPSG:4326)',
    datum: 'World Geodetic System 1984',
    ellipsoid: 'WGS 84 Reference Ellipsoid',
    verticalDatum: 'EGM96 Earth Geoid (Mean Sea Level)'
  };
}
