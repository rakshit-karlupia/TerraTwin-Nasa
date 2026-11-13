import pytest
from backend.app.scoring import compute_similarity, normalize_weights, DEFAULT_WEIGHTS

def test_normalize_weights():
    w = {'slopeDeg': 2.0, 'roughness': 2.0}
    norm = normalize_weights(w)
    assert abs(sum(norm.values()) - 1.0) < 1e-6
    assert norm['slopeDeg'] == 0.5
    assert norm['roughness'] == 0.5

def test_identical_similarity():
    # If target and candidate are identical, D should be close to 0, similarity ~ 100
    target = {
        'id': 'test-1',
        'slopeDeg': 15.0,
        'roughness': 0.40,
        'reliefM': 1000.0,
        'geology': 'impact crater',
        'albedo': 0.20,
        'thermalRangeK': 30.0,
        'volatilesIndex': 0.10
    }
    candidate = {
        'id': 'cand-1',
        'name': 'Exact Match Test',
        'country': 'TestLab',
        'slopeDeg': 15.0,
        'roughness': 0.40,
        'reliefM': 1000.0,
        'morphologyType': 'Impact Crater Rim',
        'geology': 'impact crater',
        'albedo': 0.20,
        'thermalRangeK': 30.0,
        'volatilesIndex': 0.10
    }
    res = compute_similarity(target, candidate)
    assert res['similarity'] >= 90.0
    assert 0.0 <= res['totalDistance'] <= 1.0

def test_similarity_bounds():
    target = {'slopeDeg': 50.0, 'roughness': 1.0, 'reliefM': 5000.0}
    candidate = {'slopeDeg': 0.0, 'roughness': 0.0, 'reliefM': 0.0}
    res = compute_similarity(target, candidate)
    assert 0.0 <= res['similarity'] <= 100.0
    assert 0.0 <= res['totalDistance'] <= 1.0
