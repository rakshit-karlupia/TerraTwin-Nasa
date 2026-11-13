"""
TerraTwin FastAPI Backend Application
Geospatial intelligence & planetary analog analysis service
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from .catalog import PLANETS_METADATA, LUNAR_REGIONS, MARS_REGIONS, EARTH_CANDIDATES
from .scoring import compute_similarity, normalize_weights, DEFAULT_WEIGHTS
from .terrain import generate_dem, get_cross_section

app = FastAPI(
    title="TerraTwin Geospatial API",
    description="Scientific Decision-Support API for Lunar & Martian Earth Analog Discovery",
    version="1.0.0"
)

# Enable CORS for Vite frontend (localhost:3000 / localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RankRequest(BaseModel):
    targetId: str
    weights: Optional[Dict[str, float]] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "TerraTwin Geospatial Analytics API",
        "version": "1.0.0",
        "standard": "NASA Space Apps Challenge 2026"
    }

@app.get("/api/planets")
def get_planets():
    return PLANETS_METADATA

@app.get("/api/regions")
def get_regions(planet: Optional[str] = Query(None, description="earth, moon, or mars")):
    if planet == "moon":
        return LUNAR_REGIONS
    elif planet == "mars":
        return MARS_REGIONS
    elif planet == "earth":
        return EARTH_CANDIDATES
    return {
        "moon": LUNAR_REGIONS,
        "mars": MARS_REGIONS,
        "earth": EARTH_CANDIDATES
    }

@app.get("/api/regions/{region_id}")
def get_region_by_id(region_id: str):
    all_regions = LUNAR_REGIONS + MARS_REGIONS + EARTH_CANDIDATES
    match = next((r for r in all_regions if r["id"] == region_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Region not found")
    return match

@app.post("/api/analogs/rank")
def rank_analogs(payload: RankRequest):
    all_targets = LUNAR_REGIONS + MARS_REGIONS
    target = next((t for t in all_targets if t["id"] == payload.targetId), None)
    if not target:
        raise HTTPException(status_code=404, detail=f"Target region {payload.targetId} not found")

    weights = payload.weights or DEFAULT_WEIGHTS

    results = []
    for candidate in EARTH_CANDIDATES:
        res = compute_similarity(target, candidate, weights)
        results.append(res)

    results.sort(key=lambda x: x["similarity"], reverse=True)
    for idx, r in enumerate(results):
        r["rank"] = idx + 1

    return {
        "targetId": target["id"],
        "targetName": target["name"],
        "weightsUsed": normalize_weights(weights),
        "rankings": results
    }

@app.get("/api/terrain/{region_id}")
def get_terrain_dem(region_id: str):
    dem = generate_dem(region_id, grid_size=128)
    return dem

@app.get("/api/analogs/cross-section/{region_id}")
def get_transect_profile(region_id: str):
    profile = get_cross_section(region_id, samples=64)
    return {
        "regionId": region_id,
        "transectLengthKm": 24.5,
        "profile": profile
    }

@app.get("/api/export/report/{target_id}/{candidate_id}")
def export_evidence_report(target_id: str, candidate_id: str):
    all_targets = LUNAR_REGIONS + MARS_REGIONS
    target = next((t for t in all_targets if t["id"] == target_id), None)
    candidate = next((c for c in EARTH_CANDIDATES if c["id"] == candidate_id), None)

    if not target or not candidate:
        raise HTTPException(status_code=404, detail="Target or candidate not found")

    evaluation = compute_similarity(target, candidate)

    return {
        "report": "TerraTwin Evidence & Provenance Report",
        "target": target,
        "candidate": candidate,
        "evaluation": evaluation,
        "provenance": {
            "coordinateReferenceSystem": "IAU 2000 / WGS84 EGM96",
            "elevationDatums": "LOLA Polar stereographic / MOLA areoid / SRTM 1-arcsec",
            "integrityStandard": "Zero fabricated observations; unmeasured variables disclosed"
        }
    }
