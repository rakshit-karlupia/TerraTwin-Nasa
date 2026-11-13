/**
 * TerraTwin Explainable Similarity Scoring Engine
 * Implements the mathematical weighted normalized distance formulation:
 * D = SUM(w_i * d_i)
 * Similarity = 100 * (1 - D)
 * Where d_i = min(1, |x_i - t_i| / R_i)
 */

export const DEFAULT_FEATURE_WEIGHTS = {
  slopeDeg: 0.25,        // Terrain steepness
  roughness: 0.20,       // Surface texture & microtopography
  reliefM: 0.15,         // Elevation range in 5km window
  morphology: 0.15,      // Landform structure (crater, delta, volcanic)
  albedo: 0.10,          // Reflectance & solar absorption
  thermalRange: 0.10,    // Diurnal & seasonal thermal flux
  volatiles: 0.05        // Moisture / ice proxy
};

export const FEATURE_NORMALIZERS = {
  slopeDeg: 35.0,        // Max normalizer range: 35 degrees
  roughness: 0.80,       // Max normalizer range: 0.80 index
  reliefM: 3500.0,       // Max normalizer range: 3500 meters
  albedo: 0.35,          // Max normalizer range: 0.35 reflectance
  thermalRange: 60.0,    // Max normalizer range: 60 Kelvin
  volatiles: 0.60        // Max normalizer range: 0.60 index
};

export const FEATURE_METADATA = {
  slopeDeg: { label: 'Terrain Slope', unit: 'degrees (°)', source: 'LOLA / MOLA / SRTM' },
  roughness: { label: 'Surface Roughness', unit: 'RMS index', source: 'LOLA / HiRISE / 3DEP' },
  reliefM: { label: 'Relative Relief', unit: 'meters (m)', source: 'Elevation Window 5km' },
  morphology: { label: 'Landform Morphology', unit: 'Classification', source: 'Geomorphic mapping' },
  albedo: { label: 'Surface Albedo', unit: 'I/F factor', source: 'LROC / CTX / Sentinel-2' },
  thermalRange: { label: 'Thermal Variance', unit: 'Kelvin (K)', source: 'Diviner / THEMIS / MODIS' },
  volatiles: { label: 'Volatile / Hydration Proxy', unit: 'Relative index', source: 'LEND / SHARAD / CRISM' }
};

/**
 * Normalizes user weights so their sum is strictly 1.0
 */
export function normalizeWeights(weights) {
  const sum = Object.values(weights).reduce((acc, val) => acc + (Number(val) || 0), 0);
  if (sum === 0) return { ...DEFAULT_FEATURE_WEIGHTS };
  
  const normalized = {};
  for (const [key, val] of Object.entries(weights)) {
    normalized[key] = (Number(val) || 0) / sum;
  }
  return normalized;
}

/**
 * Computes categorical distance between geological morphology descriptions.
 */
function computeMorphologyDistance(target, candidate) {
  const t = (target.geology + ' ' + (target.category || '')).toLowerCase();
  const c = (candidate.morphologyType + ' ' + candidate.geology).toLowerCase();

  if (t.includes('crater') && c.includes('crater')) return 0.05;
  if (t.includes('delta') && (c.includes('alluvial') || c.includes('delta') || c.includes('river'))) return 0.08;
  if (t.includes('volcan') && c.includes('volcan')) return 0.06;
  if ((t.includes('ice') || t.includes('cryogenic') || t.includes('psr')) && (c.includes('permafrost') || c.includes('polar'))) return 0.10;
  if (t.includes('plateau') && (c.includes('desert') || c.includes('playa'))) return 0.25;

  return 0.50; // default moderate distance
}

/**
 * Computes the explainable similarity score between a planetary target and an Earth analog.
 */
export function evaluateCandidateSimilarity(target, candidate, rawWeights = DEFAULT_FEATURE_WEIGHTS) {
  const weights = normalizeWeights(rawWeights);
  const featureDistances = {};
  let totalDistance = 0;
  let featuresEvaluated = 0;
  const totalFeatures = Object.keys(weights).length;

  // 1. Slope Difference
  const targetSlope = target.slopeDeg ?? 10.0;
  const candSlope = candidate.slopeDeg ?? 10.0;
  const dSlope = Math.min(1.0, Math.abs(candSlope - targetSlope) / FEATURE_NORMALIZERS.slopeDeg);
  featureDistances.slopeDeg = {
    targetVal: targetSlope,
    candidateVal: candSlope,
    unit: '°',
    diff: Math.abs(candSlope - targetSlope),
    d: dSlope,
    weight: weights.slopeDeg,
    weightedD: weights.slopeDeg * dSlope
  };
  totalDistance += featureDistances.slopeDeg.weightedD;
  featuresEvaluated++;

  // 2. Surface Roughness
  const targetRough = target.roughness ?? 0.40;
  const candRough = candidate.roughness ?? 0.40;
  const dRough = Math.min(1.0, Math.abs(candRough - targetRough) / FEATURE_NORMALIZERS.roughness);
  featureDistances.roughness = {
    targetVal: targetRough,
    candidateVal: candRough,
    unit: 'RMS',
    diff: Math.abs(candRough - targetRough),
    d: dRough,
    weight: weights.roughness,
    weightedD: weights.roughness * dRough
  };
  totalDistance += featureDistances.roughness.weightedD;
  featuresEvaluated++;

  // 3. Relative Relief
  const targetRelief = target.reliefM ?? 1500;
  const candRelief = candidate.reliefM ?? 500;
  const dRelief = Math.min(1.0, Math.abs(candRelief - targetRelief) / FEATURE_NORMALIZERS.reliefM);
  featureDistances.reliefM = {
    targetVal: targetRelief,
    candidateVal: candRelief,
    unit: 'm',
    diff: Math.abs(candRelief - targetRelief),
    d: dRelief,
    weight: weights.reliefM,
    weightedD: weights.reliefM * dRelief
  };
  totalDistance += featureDistances.reliefM.weightedD;
  featuresEvaluated++;

  // 4. Landform Morphology
  const dMorph = computeMorphologyDistance(target, candidate);
  featureDistances.morphology = {
    targetVal: target.category || 'Highland Impact',
    candidateVal: candidate.morphologyType || 'Alluvial Terrain',
    unit: 'Type',
    diff: dMorph > 0.2 ? 'Divergent' : 'Analogous',
    d: dMorph,
    weight: weights.morphology,
    weightedD: weights.morphology * dMorph
  };
  totalDistance += featureDistances.morphology.weightedD;
  featuresEvaluated++;

  // 5. Albedo
  const targetAlbedo = target.albedo ?? 0.15;
  const candAlbedo = candidate.albedo ?? 0.20;
  const dAlbedo = Math.min(1.0, Math.abs(candAlbedo - targetAlbedo) / FEATURE_NORMALIZERS.albedo);
  featureDistances.albedo = {
    targetVal: targetAlbedo,
    candidateVal: candAlbedo,
    unit: 'I/F',
    diff: Math.abs(candAlbedo - targetAlbedo),
    d: dAlbedo,
    weight: weights.albedo,
    weightedD: weights.albedo * dAlbedo
  };
  totalDistance += featureDistances.albedo.weightedD;
  featuresEvaluated++;

  // 6. Thermal Range (Kelvin)
  const targetThermal = target.planetId === 'moon' ? 55.0 : 40.0; // Typical day-night or seasonal flux window
  const candThermal = candidate.thermalRangeK ?? 30.0;
  const dThermal = Math.min(1.0, Math.abs(candThermal - targetThermal) / FEATURE_NORMALIZERS.thermalRange);
  featureDistances.thermalRange = {
    targetVal: targetThermal,
    candidateVal: candThermal,
    unit: 'K',
    diff: Math.abs(candThermal - targetThermal),
    d: dThermal,
    weight: weights.thermalRange,
    weightedD: weights.thermalRange * dThermal
  };
  totalDistance += featureDistances.thermalRange.weightedD;
  featuresEvaluated++;

  // 7. Volatiles / Hydration Proxy
  let targetVolatile = 0.10;
  if (target.psrDistanceKm && target.psrDistanceKm < 1.0) targetVolatile = 0.40;
  if (target.iceAvailability && target.iceAvailability.includes('shallow sheet ice')) targetVolatile = 0.50;
  const candVolatile = candidate.volatilesIndex ?? 0.10;
  const dVolatiles = Math.min(1.0, Math.abs(candVolatile - targetVolatile) / FEATURE_NORMALIZERS.volatiles);
  featureDistances.volatiles = {
    targetVal: targetVolatile,
    candidateVal: candVolatile,
    unit: 'index',
    diff: Math.abs(candVolatile - targetVolatile),
    d: dVolatiles,
    weight: weights.volatiles,
    weightedD: weights.volatiles * dVolatiles
  };
  totalDistance += featureDistances.volatiles.weightedD;
  featuresEvaluated++;

  // Bounded total distance in [0, 1]
  totalDistance = Math.min(1.0, Math.max(0.0, totalDistance));
  const similarityScore = Number((100 * (1 - totalDistance)).toFixed(1));

  // Determine positive drivers and penalizing factors
  const entries = Object.entries(featureDistances).map(([k, v]) => ({
    key: k,
    label: FEATURE_METADATA[k]?.label || k,
    d: v.d,
    weightedD: v.weightedD
  }));

  const positiveDrivers = [...entries].sort((a, b) => a.d - b.d).slice(0, 2);
  const penalizingFactors = [...entries].sort((a, b) => b.d - a.d).slice(0, 2);

  const coveragePct = Math.round((featuresEvaluated / totalFeatures) * 100);

  return {
    candidateId: candidate.id,
    name: candidate.name,
    country: candidate.country,
    category: candidate.category,
    similarity: similarityScore,
    totalDistance: Number(totalDistance.toFixed(4)),
    featureDistances,
    positiveDrivers,
    penalizingFactors,
    coveragePct,
    hasLowCoverage: coveragePct < 60,
    uncertaintyNotes: candidate.uncertaintyNotes,
    historicalUsage: candidate.historicalUsage
  };
}

/**
 * Evaluates and ranks all Earth candidates for a specified planetary reference region.
 */
export function rankEarthCandidates(target, candidates, weights = DEFAULT_FEATURE_WEIGHTS) {
  if (!target || !candidates || candidates.length === 0) return [];

  const results = candidates.map(candidate => evaluateCandidateSimilarity(target, candidate, weights));
  
  // Sort descending by similarity score
  results.sort((a, b) => b.similarity - a.similarity);

  // Calculate ranking sensitivity
  return results.map((result, index) => ({
    ...result,
    rank: index + 1
  }));
}
