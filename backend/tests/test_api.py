import pytest
from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "TerraTwin" in data["service"]

def test_api_planets():
    response = client.get("/api/planets")
    assert response.status_code == 200
    data = response.json()
    assert "earth" in data
    assert "moon" in data
    assert "mars" in data

def test_api_regions():
    response = client.get("/api/regions?planet=moon")
    assert response.status_code == 200
    regions = response.json()
    assert len(regions) >= 1
    assert any("shackleton" in r["id"] for r in regions)

def test_api_analogs_rank():
    payload = {
        "targetId": "mars-jezero",
        "weights": {
            "slopeDeg": 0.3,
            "roughness": 0.2,
            "reliefM": 0.2,
            "morphology": 0.1,
            "albedo": 0.1,
            "thermalRange": 0.05,
            "volatiles": 0.05
        }
    }
    response = client.post("/api/analogs/rank", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "rankings" in data
    assert len(data["rankings"]) > 0
    # Top rank should have rank = 1 and highest similarity
    assert data["rankings"][0]["rank"] == 1
    assert data["rankings"][0]["similarity"] >= data["rankings"][-1]["similarity"]

def test_api_terrain():
    response = client.get("/api/terrain/lunar-shackleton")
    assert response.status_code == 200
    dem = response.json()
    assert dem["regionId"] == "lunar-shackleton"
    assert "elevations" in dem
    assert len(dem["elevations"]) == 128
