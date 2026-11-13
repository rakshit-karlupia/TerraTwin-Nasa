"""
TerraTwin Geospatial Scoring Engine
Mathematical implementation of explainable weighted normalized distance:
D = SUM(w_i * d_i)
Similarity = 100 * (1 - D)
Where d_i = min(1, |x_i - t_i| / R_i)
"""

import numpy as np
from typing import Dict, Any, List

FEATURE_NORMALIZERS = {
    'slopeDeg': 35.0,
    'roughness': 0.80,
    'reliefM': 3500.0,
    'albedo': 0.35,
    'thermalRange': 60.0,
    'volatiles': 0.60
}

DEFAULT_WEIGHTS = {
    'slopeDeg': 0.25,
    'roughness': 0.20,
    'reliefM': 0.15,
    'morphology': 0.15,
    'albedo': 0.10,
    'thermalRange': 0.10,
    'volatiles': 0.05
}

def normalize_weights(weights: Dict[str, float]) -> Dict[str, float]:
    total = sum(weights.values())
    if total <= 0:
        return {k: v for k, v in DEFAULT_WEIGHTS.items()}
    return {k: v / total for k, v in weights.items()}

def compute_similarity(target: Dict[str, Any], candidate: Dict[str, Any], raw_weights: Dict[str, float] = None) -> Dict[str, Any]:
    weights = normalize_weights(raw_weights or DEFAULT_WEIGHTS)
    feature_d = {}
    total_d = 0.0

    # 1. Slope
    t_slope = float(target.get('slopeDeg', 10.0))
    c_slope = float(candidate.get('slopeDeg', 10.0))
    d_slope = min(1.0, abs(c_slope - t_slope) / FEATURE_NORMALIZERS['slopeDeg'])
    w_slope = weights.get('slopeDeg', 0.25)
    total_d += w_slope * d_slope
    feature_d['slopeDeg'] = {'d': d_slope, 'weighted': w_slope * d_slope}

    # 2. Roughness
    t_rough = float(target.get('roughness', 0.40))
    c_rough = float(candidate.get('roughness', 0.40))
    d_rough = min(1.0, abs(c_rough - t_rough) / FEATURE_NORMALIZERS['roughness'])
    w_rough = weights.get('roughness', 0.20)
    total_d += w_rough * d_rough
    feature_d['roughness'] = {'d': d_rough, 'weighted': w_rough * d_rough}

    # 3. Relief
    t_relief = float(target.get('reliefM', 1000.0))
    c_relief = float(candidate.get('reliefM', 1000.0))
    d_relief = min(1.0, abs(c_relief - t_relief) / FEATURE_NORMALIZERS['reliefM'])
    w_relief = weights.get('reliefM', 0.15)
    total_d += w_relief * d_relief
    feature_d['reliefM'] = {'d': d_relief, 'weighted': w_relief * d_relief}

    # 4. Morphology
    t_geo = str(target.get('geology', '')).lower()
    c_morph = str(candidate.get('morphologyType', '')).lower()
    if 'crater' in t_geo and 'crater' in c_morph:
        d_morph = 0.05
    elif 'delta' in t_geo and ('alluvial' in c_morph or 'delta' in c_morph):
        d_morph = 0.08
    elif 'volcan' in t_geo and 'volcan' in c_morph:
        d_morph = 0.06
    else:
        d_morph = 0.45
    w_morph = weights.get('morphology', 0.15)
    total_d += w_morph * d_morph
    feature_d['morphology'] = {'d': d_morph, 'weighted': w_morph * d_morph}

    # 5. Albedo
    t_alb = float(target.get('albedo', 0.15))
    c_alb = float(candidate.get('albedo', 0.20))
    d_alb = min(1.0, abs(c_alb - t_alb) / FEATURE_NORMALIZERS['albedo'])
    w_alb = weights.get('albedo', 0.10)
    total_d += w_alb * d_alb
    feature_d['albedo'] = {'d': d_alb, 'weighted': w_alb * d_alb}

    # 6. Thermal
    t_therm = 55.0 if target.get('planetId') == 'moon' else 40.0
    c_therm = float(candidate.get('thermalRangeK', 30.0))
    d_therm = min(1.0, abs(c_therm - t_therm) / FEATURE_NORMALIZERS['thermalRange'])
    w_therm = weights.get('thermalRange', 0.10)
    total_d += w_therm * d_therm
    feature_d['thermalRange'] = {'d': d_therm, 'weighted': w_therm * d_therm}

    # 7. Volatiles
    t_vol = 0.40 if target.get('psrDistanceKm') is not None else 0.10
    c_vol = float(candidate.get('volatilesIndex', 0.10))
    d_vol = min(1.0, abs(c_vol - t_vol) / FEATURE_NORMALIZERS['volatiles'])
    w_vol = weights.get('volatiles', 0.05)
    total_d += w_vol * d_vol
    feature_d['volatiles'] = {'d': d_vol, 'weighted': w_vol * d_vol}

    total_d = max(0.0, min(1.0, total_d))
    similarity = round(100.0 * (1.0 - total_d), 1)

    return {
        'candidateId': candidate.get('id'),
        'candidateName': candidate.get('name'),
        'country': candidate.get('country'),
        'similarity': similarity,
        'totalDistance': round(total_d, 4),
        'featureDistances': feature_d,
        'coveragePct': 100
    }
