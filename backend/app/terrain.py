"""
TerraTwin DEM Processor & Terrain Utilities
Computes elevation models, slope matrices, and transect slices.
"""

import numpy as np
from typing import Dict, Any, List

def generate_dem(region_id: str, grid_size: int = 128) -> Dict[str, Any]:
    elevations = np.zeros((grid_size, grid_size), dtype=np.float32)
    half = grid_size / 2.0

    if 'shackleton' in region_id:
        min_elev, max_elev = -4200.0, 1350.0
        for y in range(grid_size):
            for x in range(grid_size):
                dx = (x - half) / half
                dy = (y - half) / half
                r = np.sqrt(dx * dx + dy * dy)
                if r < 0.65:
                    h = -4200.0 + (r / 0.65) ** 2.2 * 5100.0
                elif r < 0.85:
                    rim_t = (r - 0.65) / 0.20
                    h = 900.0 + np.sin(rim_t * np.pi) * 450.0
                else:
                    h = 900.0 / (1.0 + (r - 0.85) * 3.5)
                elevations[y, x] = h
    elif 'jezero' in region_id:
        min_elev, max_elev = -2650.0, -1400.0
        for y in range(grid_size):
            for x in range(grid_size):
                dx = (x - half) / half
                dy = (y - half) / half
                h = -2500.0 - (dx * 180.0 + dy * 220.0)
                fan_dist = np.sqrt((dx + 0.35) ** 2 + dy ** 2)
                fan_ang = np.arctan2(dy, dx + 0.35)
                if fan_dist < 0.7 and abs(fan_ang) < 0.85:
                    h += np.cos(fan_dist * np.pi) * 160.0 + (1.0 - fan_dist) * 110.0
                elevations[y, x] = h
    else:
        min_elev, max_elev = 200.0, 2400.0
        for y in range(grid_size):
            for x in range(grid_size):
                elevations[y, x] = 1000.0 + np.sin(x / 20.0) * 500.0 + np.cos(y / 20.0) * 400.0

    return {
        'regionId': region_id,
        'gridSize': grid_size,
        'minElev': float(min_elev),
        'maxElev': float(max_elev),
        'elevations': elevations.tolist()
    }

def get_cross_section(region_id: str, samples: int = 64) -> List[Dict[str, Any]]:
    dem = generate_dem(region_id, 128)
    elevations = np.array(dem['elevations'])
    grid_size = dem['gridSize']
    min_elev, max_elev = dem['minElev'], dem['maxElev']

    profile = []
    for i in range(samples):
        t = i / (samples - 1)
        x = int(15 + t * (grid_size - 30))
        y = int(15 + t * (grid_size - 30))
        elev = float(elevations[y, x])
        dist_km = round(t * 24.5, 2)
        slope = round(abs(elev - min_elev) / (max_elev - min_elev) * 25.0, 1)

        profile.append({
            'distanceKm': dist_km,
            'elevationM': round(elev),
            'slopeDeg': slope
        })
    return profile
