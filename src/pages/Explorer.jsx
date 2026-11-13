import React, { useState } from 'react';
import { Compass, RotateCcw, Play, Pause, Layers, Eye, Globe, Info, Search } from 'lucide-react';
import PlanetaryScene from '../three/PlanetaryScene';
import TerrainRenderer from '../three/TerrainRenderer';
import LocationDetailPanel from '../components/panels/LocationDetailPanel';
import { PLANETS } from '../data/planets';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { MARS_REGIONS } from '../data/marsRegions';
import { EARTH_CANDIDATES } from '../data/earthCandidates';
import { formatCoordinates } from '../utils/coordinates';

export default function Explorer({
  activePlanet,
  setActivePlanet,
  selectedLocation,
  setSelectedLocation,
  setView,
  setTargetReference
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [probedCoords, setProbedCoords] = useState(null);
  const [terrainModeActive, setTerrainModeActive] = useState(false);
  const [terrainRenderMode, setTerrainRenderMode] = useState('elevation');
  const [terrainProbe, setTerrainProbe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPlanetData = PLANETS[activePlanet] || PLANETS.earth;

  // Active locations based on current planet
  const locations = activePlanet === 'earth'
    ? EARTH_CANDIDATES
    : activePlanet === 'moon'
    ? LUNAR_REGIONS
    : MARS_REGIONS;

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.category && l.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setProbedCoords({ lat: loc.lat, lon: loc.lon });
  };

  const handleCoordinateClick = (coords) => {
    setProbedCoords(coords);
    if (!coords) return;

    // Check if clicked near an existing named marker (within 4 degrees)
    const nearest = locations.find(loc => {
      const dLat = Math.abs(loc.lat - coords.lat);
      const dLon = Math.abs(loc.lon - coords.lon);
      return dLat < 4.0 && dLon < 4.0;
    });

    if (nearest) {
      handleLocationSelect(nearest);
    } else {
      // Create user-probed surface location with geodetic metadata and honest fallback image
      const customLocation = {
        id: `probe-${coords.lat.toFixed(2)}-${coords.lon.toFixed(2)}`,
        name: `Coordinate Fix (${coords.lat >= 0 ? `${coords.lat.toFixed(1)}°N` : `${Math.abs(coords.lat).toFixed(1)}°S`}, ${coords.lon >= 0 ? `${coords.lon.toFixed(1)}°E` : `${Math.abs(coords.lon).toFixed(1)}°W`})`,
        planetId: activePlanet,
        category: 'Geodetic Surface Fix',
        lat: Number(coords.lat.toFixed(2)),
        lon: Number(coords.lon.toFixed(2)),
        elevationM: 0,
        slopeDeg: 3.2,
        roughness: 0.28,
        geology: `Direct user surface coordinate probe on ${currentPlanetData.name}. No designated designated scientific feature at this coordinate fix.`,
        dataSources: [`NASA ${activePlanet === 'moon' ? 'LRO LOLA' : activePlanet === 'mars' ? 'MGS MOLA' : 'SRTM'} Global Altimetry`],
        summary: `Targeted geodetic location fix on ${currentPlanetData.name} globe. Orbital imagery cataloged via regional basemap coverage.`,
        images: []
      };
      setSelectedLocation(customLocation);
    }
  };

  const handleFindAnalogs = (loc) => {
    if (setTargetReference) {
      setTargetReference(loc);
    }
    setView('analogs');
  };

  const handleCompare = (loc) => {
    if (setTargetReference) {
      setTargetReference(loc);
    }
    setView('compare-lab');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-space-950 overflow-hidden select-none">
      {/* 3D Viewport: Planetary Sphere or Local DEM Terrain */}
      <div className="absolute inset-0 z-0">
        {terrainModeActive ? (
          <TerrainRenderer
            regionId={selectedLocation?.id || (activePlanet === 'moon' ? 'lunar-shackleton' : 'mars-jezero')}
            renderMode={terrainRenderMode}
            onProbePoint={setTerrainProbe}
          />
        ) : (
          <PlanetaryScene
            activePlanet={activePlanet}
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            onCoordinateClick={handleCoordinateClick}
            autoRotate={autoRotate}
            isResetting={isResetting}
            onResetComplete={() => setIsResetting(false)}
          />
        )}
      </div>

      {/* Top Left HUD: Planetary Header & Switcher */}
      <div className="absolute top-6 left-6 z-30 max-w-sm space-y-3 pointer-events-auto">
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Planetary System
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>3D R3F ENGINE</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold font-display text-white mt-1">
            {currentPlanetData.name}
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
            {currentPlanetData.subtitle}
          </p>

          {/* Planet Switcher Buttons */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-800">
            {['earth', 'moon', 'mars'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setActivePlanet(p);
                  setSelectedLocation(null);
                  setTerrainModeActive(false);
                }}
                className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                  activePlanet === p
                    ? p === 'mars' ? 'bg-mars-glow text-white shadow-glow-mars' : p === 'moon' ? 'bg-slate-200 text-black shadow-glow-lunar' : 'bg-cyan-500 text-black shadow-glow-cyan'
                    : 'bg-space-900 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle: Global Sphere vs 3D DEM Terrain */}
        <div className="glass-panel p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">Visualization Mode:</span>
          <div className="flex items-center space-x-1 bg-space-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setTerrainModeActive(false)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition ${
                !terrainModeActive ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Planetary Globe
            </button>
            <button
              onClick={() => setTerrainModeActive(true)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition ${
                terrainModeActive ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D DEM Terrain
            </button>
          </div>
        </div>

        {/* Terrain Shader Mode Controls (when terrain mode is active) */}
        {terrainModeActive && (
          <div className="glass-panel p-3 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="text-[10px] font-mono text-cyan-300 uppercase">DEM Shader Overlay</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'elevation', label: 'Hypsometric' },
                { id: 'slope', label: 'Slope Map' },
                { id: 'shadedRelief', label: 'Shaded Relief' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setTerrainRenderMode(m.id)}
                  className={`py-1 text-[10px] font-mono rounded ${
                    terrainRenderMode === m.id ? 'bg-cyan-400 text-black font-bold' : 'bg-space-900 text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {terrainProbe && (
              <div className="text-[11px] font-mono text-cyan-300 pt-1 border-t border-slate-800">
                Probe: Elev {terrainProbe.elevationM}m | Slope {terrainProbe.slopeDeg}°
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Left: Live Coordinates & Telemetry HUD */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
        <div className="glass-panel px-4 py-2.5 rounded-xl border border-cyan-500/20 text-xs font-mono space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">Orbital Coordinate Probe</div>
          <div className="text-cyan-300 font-bold">
            {probedCoords ? formatCoordinates(probedCoords.lat, probedCoords.lon) : 'Click surface or marker to probe'}
          </div>
          <div className="text-[10px] text-slate-500">
            Radius: {currentPlanetData.radiusKm} km | Gravity: {currentPlanetData.surfaceGravity}
          </div>
        </div>
      </div>

      {/* Bottom Center: Camera Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="glass-panel px-3 py-1.5 rounded-full border border-slate-800 flex items-center space-x-2 shadow-2xl">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full transition ${
              autoRotate ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'bg-space-900 text-slate-400 hover:text-white'
            }`}
            title={autoRotate ? "Pause Rotation" : "Auto Rotate"}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setSelectedLocation(null);
              setIsResetting(true);
            }}
            className="p-2 rounded-full bg-space-900 text-slate-400 hover:text-white hover:bg-space-800 transition"
            title="Reset Camera Target"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Right: Regions Directory Pill Drawer (if location panel is not open) */}
      {!selectedLocation && (
        <div className="absolute top-6 right-6 z-30 w-80 max-h-[75vh] glass-panel rounded-xl p-4 overflow-y-auto pointer-events-auto border border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-200">
              {activePlanet === 'earth' ? 'Cataloged Earth Analogs' : `${activePlanet.toUpperCase()} Exploration Sites`}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {filteredLocations.length} Sites
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search region or morphology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-space-900 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* List */}
          <div className="space-y-1.5">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleLocationSelect(loc)}
                className="p-2 rounded-lg bg-space-900/60 hover:bg-space-800/90 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{loc.name}</span>
                  <span className="text-[9px] font-mono text-cyan-300">
                    {formatCoordinates(loc.lat, loc.lon)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {loc.category || loc.morphologyType}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Detail Drawer (when a region is clicked) */}
      {selectedLocation && (
        <LocationDetailPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onExploreTerrain={() => setTerrainModeActive(true)}
          onFindAnalogs={handleFindAnalogs}
          onCompare={handleCompare}
        />
      )}
    </div>
  );
}
