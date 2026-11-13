"""
Scientific Dataset and Location Catalog for TerraTwin Backend
"""

PLANETS_METADATA = {
    'earth': {'name': 'Earth', 'radiusKm': 6371.0, 'gravity': '9.81 m/s²'},
    'moon': {'name': 'Moon', 'radiusKm': 1737.4, 'gravity': '1.62 m/s²'},
    'mars': {'name': 'Mars', 'radiusKm': 3389.5, 'gravity': '3.72 m/s²'}
}

LUNAR_REGIONS = [
    {
        'id': 'lunar-shackleton',
        'name': 'Shackleton Crater Rim',
        'planetId': 'moon',
        'lat': -89.9,
        'lon': 0.0,
        'elevationM': 1350,
        'reliefM': 4200,
        'slopeDeg': 14.5,
        'roughness': 0.58,
        'albedo': 0.14,
        'illuminationPct': 86.4,
        'psrDistanceKm': 0.2,
        'geology': 'Impact crater rim crest with shock-melt breccia; interior permanently shadowed cold trap.'
    },
    {
        'id': 'lunar-cabeus-b',
        'name': 'Peak near Cabeus B',
        'planetId': 'moon',
        'lat': -84.9,
        'lon': -37.2,
        'elevationM': -1200,
        'reliefM': 1450,
        'slopeDeg': 11.4,
        'roughness': 0.42,
        'albedo': 0.16,
        'illuminationPct': 78.2,
        'psrDistanceKm': 1.8,
        'geology': 'Highland rolling terrain composed of Cabeus and Malapert distal ejecta blanket.'
    },
    {
        'id': 'lunar-malapert',
        'name': 'Malapert Massif',
        'planetId': 'moon',
        'lat': -86.0,
        'lon': 2.7,
        'elevationM': 4900,
        'reliefM': 3200,
        'slopeDeg': 8.5,
        'roughness': 0.35,
        'albedo': 0.18,
        'illuminationPct': 91.2,
        'psrDistanceKm': 4.2,
        'geology': 'Ancient South Pole-Aitken (SPA) basin structural uplift.'
    }
]

MARS_REGIONS = [
    {
        'id': 'mars-jezero',
        'name': 'Jezero Crater Delta',
        'planetId': 'mars',
        'lat': 18.38,
        'lon': 77.58,
        'elevationM': -2500,
        'reliefM': 1200,
        'slopeDeg': 4.8,
        'roughness': 0.36,
        'albedo': 0.16,
        'thermalInertia': 320,
        'atmosphericPressurePa': 610,
        'geology': 'Ancient river delta rich in smectite clay, olivine, and preserved lacustrine mudstones.'
    },
    {
        'id': 'mars-arcadia',
        'name': 'Arcadia Planitia',
        'planetId': 'mars',
        'lat': 39.3,
        'lon': 189.7,
        'elevationM': -3900,
        'reliefM': 350,
        'slopeDeg': 1.8,
        'roughness': 0.18,
        'albedo': 0.22,
        'thermalInertia': 210,
        'atmosphericPressurePa': 780,
        'geology': 'Smooth volcanic flood plains with widespread subsurface cryogenic water-ice sheets.'
    },
    {
        'id': 'mars-gale',
        'name': 'Gale Crater (Mount Sharp)',
        'planetId': 'mars',
        'lat': -5.4,
        'lon': 137.8,
        'elevationM': -4500,
        'reliefM': 5500,
        'slopeDeg': 6.5,
        'roughness': 0.42,
        'albedo': 0.19,
        'thermalInertia': 340,
        'atmosphericPressurePa': 840,
        'geology': 'Layered central sedimentary mound recording ancient lake history.'
    }
]

EARTH_CANDIDATES = [
    {
        'id': 'earth-atacama',
        'name': 'Atacama Desert (Yungay Basin)',
        'country': 'Chile',
        'lat': -24.08,
        'lon': -69.87,
        'elevationM': 2450,
        'reliefM': 450,
        'slopeDeg': 3.2,
        'roughness': 0.24,
        'albedo': 0.28,
        'thermalRangeK': 35.0,
        'morphologyType': 'Arid Salt Playa & Desert Pavement',
        'volatilesIndex': 0.05,
        'geology': 'Hyper-arid desert rich in perchlorates, nitrates, and sulfate evaporites.'
    },
    {
        'id': 'earth-haughton',
        'name': 'Haughton Impact Crater',
        'country': 'Canada (Nunavut)',
        'lat': 75.38,
        'lon': -89.68,
        'elevationM': 220,
        'reliefM': 280,
        'slopeDeg': 14.5,
        'roughness': 0.58,
        'albedo': 0.19,
        'thermalRangeK': 45.0,
        'morphologyType': 'Meteorite Impact Crater & Patterned Ground',
        'volatilesIndex': 0.28,
        'geology': 'Impact crater in polar desert with shatter cones and permafrost gullies.'
    },
    {
        'id': 'earth-death-valley',
        'name': 'Death Valley (Badwater & Mars Hill)',
        'country': 'United States',
        'lat': 36.53,
        'lon': -116.93,
        'elevationM': -86,
        'reliefM': 850,
        'slopeDeg': 12.1,
        'roughness': 0.46,
        'albedo': 0.26,
        'thermalRangeK': 52.0,
        'morphologyType': 'Alluvial Fans & Playas',
        'volatilesIndex': 0.12,
        'geology': 'Deep basin with expansive alluvial gravel fans and polygon salt crusts.'
    }
]
