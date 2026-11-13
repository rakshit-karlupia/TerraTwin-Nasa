export const PLANETS = {
  earth: {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial / Reference Anchor',
    subtitle: 'The Terrestrial Benchmark & Analog Testing Ground',
    radiusKm: 6371.0,
    surfaceGravity: '9.81 m/s² (1.00 g)',
    surfacePressure: '101.3 kPa (1.00 atm)',
    temperatureRange: '-89.2°C to +56.7°C (Mean: +15°C)',
    atmosphereComposition: '78% N₂, 21% O₂, 0.93% Ar, 0.04% CO₂',
    axialTilt: '23.44°',
    orbitalPeriod: '365.25 days',
    dayLength: '24.0 hours',
    colorHex: '#1e88e5',
    accentColor: '#00f2fe',
    description: 'Earth serves as the physical testing baseline. By evaluating Earth’s most extreme volcanic, hyper-arid, and permafrost landscapes against planetary remote sensing observations, TerraTwin identifies measurable field analogs for Moon base operations and Mars exploration.',
    keyFeatures: [
      'Active plate tectonics and hydrological erosion',
      'Abundant liquid water and oxygen-rich atmosphere',
      'Wide diversity of extreme analog testing environments',
      'Benchmark for remote sensing calibration (SRTM, Landsat, Sentinel)'
    ],
    datasetsAvailable: 24,
    analogSitesCount: 11
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    type: 'Natural Satellite / Airless Basaltic Body',
    subtitle: 'Artemis Exploration & South Pole Cold Trap Infrastructure',
    radiusKm: 1737.4,
    surfaceGravity: '1.62 m/s² (0.166 g)',
    surfacePressure: '~3 × 10⁻¹⁵ atm (Exosphere)',
    temperatureRange: '-246°C (PSR) to +121°C (Equatorial Noon)',
    atmosphereComposition: 'Trace He, Ne, H₂, Ar (Ultra-high vacuum)',
    axialTilt: '1.54°',
    orbitalPeriod: '27.32 days',
    dayLength: '708.7 hours (29.5 Earth days)',
    colorHex: '#a8b8d0',
    accentColor: '#90caf9',
    description: 'The Moon presents an airless, micrometeorite-bombarded regolith environment. The Artemis III campaign targets the rugged Lunar South Pole, where high rim peaks offer near-continuous solar illumination while deep permanently shadowed craters preserve cryogenic water-ice volatiles.',
    keyFeatures: [
      'Extreme thermal swings: cryogenic cold traps down to 25 K in PSRs',
      'NASA Artemis III 9 candidate landing regions at the South Pole',
      'Electrostatic regolith dust hazard and abrasive impact breccia',
      'LOLA topographic elevation models and Diviner thermal mapping'
    ],
    datasetsAvailable: 18,
    regionsCount: 10
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet / Cold Desert World',
    subtitle: 'Human Exploration Zones & Ancient Aqueous Geology',
    radiusKm: 3389.5,
    surfaceGravity: '3.72 m/s² (0.379 g)',
    surfacePressure: '0.6 to 1.0 kPa (0.006 atm)',
    temperatureRange: '-125°C (Polar Winter) to +20°C (Equatorial Noon)',
    atmosphereComposition: '95.3% CO₂, 2.6% N₂, 1.9% Ar, 0.16% O₂',
    axialTilt: '25.19°',
    orbitalPeriod: '687 Earth days',
    dayLength: '24 hours 37 minutes (1 Sol)',
    colorHex: '#ff5e3a',
    accentColor: '#ff8a65',
    description: 'Mars is a cold, hyper-arid desert with extensive evidence of ancient liquid water networks, volcanic shields, and subsurface water ice. Exploration zones focus on areas with shallow accessible ice sheets (Arcadia Planitia) and high astrobiological interest (Jezero Crater delta).',
    keyFeatures: [
      'Subsurface glacial ice sheets detected by SHARAD radar',
      'Active dust storm cycles and seasonal CO₂ frost condensation',
      'Ancient deltaic and phyllosilicate clay deposits (Perseverance / Curiosity)',
      'Solar system’s largest volcanic constructs (Olympus Mons) and rift canyons'
    ],
    datasetsAvailable: 22,
    regionsCount: 11
  }
};
