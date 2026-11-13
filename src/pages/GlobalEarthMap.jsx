import React, { useState, useMemo } from 'react';
import { Globe, Filter, Search, ArrowRight, Eye, ShieldCheck, Compass, Mountain, CheckCircle2 } from 'lucide-react';
import PlanetaryScene from '../three/PlanetaryScene';
import LocationDetailPanel from '../components/panels/LocationDetailPanel';
import { EARTH_CANDIDATES } from '../data/earthCandidates';
import { MARS_REGIONS } from '../data/marsRegions';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { rankEarthCandidates } from '../utils/scoring';
import { formatCoordinates } from '../utils/coordinates';

export default function GlobalEarthMap({
  selectedLocation,
  setSelectedLocation,
  targetReference,
  setTargetReference,
  setView
}) {
  const [activePlanetRef, setActivePlanetRef] = useState(targetReference?.planetId || 'mars');
  const [terrainFilter, setTerrainFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Default target reference for scoring
  const target = useMemo(() => {
    if (targetReference && targetReference.planetId === activePlanetRef) return targetReference;
    return activePlanetRef === 'moon' ? LUNAR_REGIONS[0] : MARS_REGIONS[0];
  }, [targetReference, activePlanetRef]);

  // Compute similarities for all Earth candidates
  const rankedAnalogs = useMemo(() => {
    return rankEarthCandidates(target, EARTH_CANDIDATES);
  }, [target]);

  // Map of candidateId -> similarity score
  const analogScoreMap = useMemo(() => {
    const map = {};
    rankedAnalogs.forEach(r => {
      map[r.candidateId] = r.similarity;
    });
    return map;
  }, [rankedAnalogs]);

  const filteredCandidates = useMemo(() => {
    return EARTH_CANDIDATES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (terrainFilter === 'volcanic') return c.category.toLowerCase().includes('volcan');
      if (terrainFilter === 'arid') return c.category.toLowerCase().includes('arid') || c.category.toLowerCase().includes('desert');
      if (terrainFilter === 'polar') return c.category.toLowerCase().includes('polar') || c.category.toLowerCase().includes('permafrost');
      if (terrainFilter === 'crater') return c.category.toLowerCase().includes('crater');
      return true;
    });
  }, [searchQuery, terrainFilter]);

  const handleSelectMarker = (loc) => {
    setSelectedLocation(loc);
  };

  const handleCompare = (loc) => {
    if (setTargetReference) setTargetReference(target);
    if (setSelectedLocation) setSelectedLocation(loc);
    setView('compare-lab');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-space-950 overflow-hidden select-none">
      {/* 3D Earth Globe with Ranked Analog Pins */}
      <div className="absolute inset-0 z-0">
        <PlanetaryScene
          activePlanet="earth"
          locations={filteredCandidates}
          selectedLocation={selectedLocation}
          onLocationSelect={handleSelectMarker}
          analogScores={analogScoreMap}
          autoRotate={false}
        />
      </div>

      {/* Top Left HUD: Global Earth Analytics Filter */}
      <div className="absolute top-6 left-6 z-30 max-w-sm space-y-3 pointer-events-auto">
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Global Earth Analog Explorer
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{EARTH_CANDIDATES.length} SITES ACTIVE</span>
            </span>
          </div>

          <h2 className="text-xl font-bold font-display text-white mt-1">
            Terrestrial Analogs
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
            Comparing Earth against <strong className="text-white">{target.name}</strong> ({target.planetId?.toUpperCase()})
          </p>

          {/* Reference Switcher */}
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">Benchmark:</span>
            <button
              onClick={() => setActivePlanetRef('moon')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition ${
                activePlanetRef === 'moon' ? 'bg-slate-200 text-black font-bold' : 'bg-space-900 text-slate-400'
              }`}
            >
              Moon
            </button>
            <button
              onClick={() => setActivePlanetRef('mars')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition ${
                activePlanetRef === 'mars' ? 'bg-mars-glow text-white font-bold' : 'bg-space-900 text-slate-400'
              }`}
            >
              Mars
            </button>
          </div>

          {/* Terrain Category Filter */}
          <div className="mt-3 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Terrain Classification</div>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Terrains' },
                { id: 'arid', label: 'Hyper-Arid' },
                { id: 'volcanic', label: 'Basaltic Lava' },
                { id: 'polar', label: 'Polar / Permafrost' },
                { id: 'crater', label: 'Impact Structures' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTerrainFilter(f.id)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition ${
                    terrainFilter === f.id
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-space-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Legend HUD */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">≥75% (High Match)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">60-74% (Moderate)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">&lt;60% (Divergent)</span>
          </div>
        </div>
      </div>

      {/* Top Right: Search & Ranked Sites Directory */}
      {!selectedLocation && (
        <div className="absolute top-6 right-6 z-30 w-80 max-h-[75vh] glass-panel rounded-xl p-4 overflow-y-auto pointer-events-auto border border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-200">
              Ranked Candidates
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {filteredCandidates.length} Shown
            </span>
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search analog by name or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-space-900 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="space-y-1.5">
            {filteredCandidates.map((loc) => {
              const score = analogScoreMap[loc.id];
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectMarker(loc)}
                  className="p-2.5 rounded-lg bg-space-900/60 hover:bg-space-800/90 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-white block">{loc.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{loc.country}</span>
                    </div>
                    {score !== undefined && (
                      <span className={`text-xs font-mono font-bold ${
                        score >= 75 ? 'text-emerald-400' : score >= 60 ? 'text-cyan-300' : 'text-amber-400'
                      }`}>
                        {score}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Location Detail Panel */}
      {selectedLocation && (
        <LocationDetailPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onCompare={handleCompare}
          similarity={analogScoreMap[selectedLocation.id]}
        />
      )}
    </div>
  );
}
