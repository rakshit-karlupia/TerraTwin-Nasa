import React, { useState } from 'react';
import { Rocket, ShieldAlert, Sun, Radio, Compass, Mountain, Droplets, Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { formatCoordinates } from '../utils/coordinates';
import TerrainRenderer from '../three/TerrainRenderer';

export default function LunarLandingSites({ setView, setSelectedLocation, setTargetReference }) {
  const [activeRegion, setActiveRegion] = useState(LUNAR_REGIONS[0]);
  const [showTerrainModal, setShowTerrainModal] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // all, artemis, study

  const displayedRegions = LUNAR_REGIONS.filter(r => {
    if (filterMode === 'artemis') return r.category.includes('Official Artemis');
    if (filterMode === 'study') return !r.category.includes('Official Artemis');
    return true;
  });

  const handleLaunchAnalogs = (region) => {
    if (setTargetReference) setTargetReference(region);
    setView('analogs');
  };

  const handleLaunchCompare = (region) => {
    if (setTargetReference) setTargetReference(region);
    setView('compare-lab');
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <Rocket className="w-4 h-4 text-lunar-glow" />
              <span>Mission Planning // Lunar Landing Site Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Artemis III Candidate Landing Regions
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Scientific evaluation of candidate lunar South Pole landing regions announced by NASA in October 2024,
              integrated with LRO LOLA topography, Diviner thermal mapping, and permanent shadow (PSR) distribution.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-lg bg-lunar-dark border border-slate-700 text-xs font-mono text-slate-300">
              Target Latitude: 84°S to 90°S
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Filter Sites:</span>
          {[
            { id: 'all', label: `All Sites (${LUNAR_REGIONS.length})` },
            { id: 'artemis', label: 'NASA Artemis III (9 Regions)' },
            { id: 'study', label: 'Historical & Baseline Anchors' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                filterMode === f.id
                  ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Region Selector Sidebar + Detailed Analysis Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sites List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {displayedRegions.map((region) => {
              const isSelected = activeRegion.id === region.id;
              return (
                <div
                  key={region.id}
                  onClick={() => setActiveRegion(region)}
                  className={`p-4 rounded-xl cursor-pointer transition border text-left ${
                    isSelected
                      ? 'glass-panel-glow border-cyan-400 shadow-glow-cyan'
                      : 'bg-space-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-space-850'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-sm font-display">{region.name}</h3>
                      <div className="text-[11px] font-mono text-cyan-300 mt-0.5">
                        {formatCoordinates(region.lat, region.lon)}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-space-950 border border-slate-700 text-slate-300">
                      {region.illuminationPct}% Sun
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block">Slope</span>
                      <strong className="text-slate-200">{region.slopeDeg}°</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Elev</span>
                      <strong className="text-slate-200">{region.elevationM > 0 ? `+${region.elevationM}` : region.elevationM}m</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PSR Dist</span>
                      <strong className="text-cyan-400">{region.psrDistanceKm} km</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Scientific Intelligence Inspector (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {activeRegion.officialStatus}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-0.5">
                  {activeRegion.name}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Coordinates: <span className="text-cyan-300 font-bold">{formatCoordinates(activeRegion.lat, activeRegion.lon)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTerrainModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-glow-cyan transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D DEM Mesh</span>
                </button>
                <button
                  onClick={() => handleLaunchAnalogs(activeRegion)}
                  className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition"
                >
                  <span>Find Analogs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Assessment Metrics 4-Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Illumination</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {activeRegion.illuminationPct}%
                </div>
                <div className="text-[10px] text-slate-500">Annual Average</div>
              </div>

              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PSR Cold Trap</span>
                </div>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                  {activeRegion.psrDistanceKm} km
                </div>
                <div className="text-[10px] text-slate-500">Distance to permanent shadow</div>
              </div>

              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Earth Direct Comm</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {activeRegion.earthCommVisibilityPct}%
                </div>
                <div className="text-[10px] text-slate-500">Line-of-sight visibility</div>
              </div>

              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Terrain Slope</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {activeRegion.slopeDeg}°
                </div>
                <div className="text-[10px] text-slate-500">Max: {activeRegion.maxSlopeDeg}°</div>
              </div>
            </div>

            {/* Geological Analysis */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Geological Characteristics & Landing Feasibility
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-space-900/70 p-3 rounded-xl border border-slate-800/80 font-sans">
                {activeRegion.geology}
              </p>
            </div>

            {/* Operational Hazards */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Documented Hazards & Operations Envelope</span>
              </h4>
              <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl space-y-1">
                {activeRegion.keyHazards.map((h, i) => (
                  <div key={i} className="text-xs text-amber-200/90 flex items-start space-x-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dataset Provenance */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1.5">Integrated Scientific Datasets:</div>
              <div className="flex flex-wrap gap-2">
                {activeRegion.dataSources.map((ds, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-space-900 text-cyan-300 border border-cyan-800/40 text-[11px] font-mono">
                    {ds}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: 3D DEM Terrain Mesh */}
        {showTerrainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="glass-panel-glow w-full max-w-4xl h-[70vh] rounded-2xl border border-cyan-500/40 p-4 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    3D LOLA DEM Elevation Mesh: {activeRegion.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-300">
                    Resolution: 30m/px • Color Ramp: Hypsometric Elevation
                  </div>
                </div>
                <button
                  onClick={() => setShowTerrainModal(false)}
                  className="px-3 py-1 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 font-mono text-xs"
                >
                  Close Viewer
                </button>
              </div>

              <div className="flex-1 w-full relative mt-3 rounded-xl overflow-hidden border border-slate-800">
                <TerrainRenderer
                  regionId={activeRegion.id}
                  renderMode="elevation"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
