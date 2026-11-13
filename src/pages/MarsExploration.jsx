import React, { useState } from 'react';
import { Rocket, ShieldAlert, Thermometer, Wind, Compass, Mountain, Droplets, Eye, ArrowRight, Layers } from 'lucide-react';
import { MARS_REGIONS } from '../data/marsRegions';
import { formatCoordinates } from '../utils/coordinates';
import TerrainRenderer from '../three/TerrainRenderer';

export default function MarsExploration({ setView, setSelectedLocation, setTargetReference }) {
  const [activeRegion, setActiveRegion] = useState(MARS_REGIONS[0]);
  const [showTerrainModal, setShowTerrainModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { id: 'all', label: `All Exploration Zones (${MARS_REGIONS.length})` },
    { id: 'human', label: 'Potential Human Exploration Zones' },
    { id: 'robotic', label: 'Active Robotic & Astrobiology Sites' },
    { id: 'extreme', label: 'Extreme Planetary Benchmark Geology' }
  ];

  const displayedRegions = MARS_REGIONS.filter(r => {
    if (categoryFilter === 'human') return r.category.includes('Human') || r.category.includes('Glacier');
    if (categoryFilter === 'robotic') return r.category.includes('Robotic') || r.category.includes('Astrobiology');
    if (categoryFilter === 'extreme') return r.category.includes('Extreme');
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
            <div className="flex items-center space-x-2 text-mars-glow font-mono text-xs tracking-widest uppercase">
              <Rocket className="w-4 h-4 text-mars-glow" />
              <span>Mission Planning // Mars Human Exploration Zones</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Martian Exploration & Resource Intelligence
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Scientific investigation of candidate Martian human exploration zones, shallow ice extraction targets (Arcadia Planitia),
              and astrobiology sites (Jezero Crater), integrating MOLA, HiRISE, CRISM, and SHARAD radar observations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-lg bg-mars-dark border border-mars-rust text-xs font-mono text-mars-glow">
              Status: TerraTwin Research Candidates
            </span>
          </div>
        </div>

        {/* Boundary Notice Banner */}
        <div className="p-3.5 rounded-xl bg-space-900/90 border border-mars-rust/40 text-xs font-mono text-slate-300 flex items-center space-x-3">
          <ShieldAlert className="w-4 h-4 text-mars-glow shrink-0" />
          <span>
            <strong>Scientific Boundary:</strong> NASA has not officially selected final human landing sites on Mars.
            Locations shown are peer-reviewed research study candidates and robotic ground-truth anchors.
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                categoryFilter === c.id
                  ? 'bg-mars-glow text-white font-bold shadow-glow-mars'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sites Directory List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {displayedRegions.map((region) => {
              const isSelected = activeRegion.id === region.id;
              return (
                <div
                  key={region.id}
                  onClick={() => setActiveRegion(region)}
                  className={`p-4 rounded-xl cursor-pointer transition border text-left ${
                    isSelected
                      ? 'glass-panel-mars border-mars-glow shadow-glow-mars'
                      : 'bg-space-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-space-850'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-sm font-display">{region.name}</h3>
                      <div className="text-[11px] font-mono text-mars-glow mt-0.5">
                        {formatCoordinates(region.lat, region.lon)}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-space-950 border border-slate-700 text-slate-300">
                      {region.atmosphericPressurePa} Pa
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
                      <span className="text-slate-500 block">TIU</span>
                      <strong className="text-cyan-400">{region.thermalInertia || '300'}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Region Intelligence Detail (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-mars-glow font-bold">
                  {activeRegion.officialStatus}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-0.5">
                  {activeRegion.name}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Coordinates: <span className="text-mars-glow font-bold">{formatCoordinates(activeRegion.lat, activeRegion.lon)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTerrainModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-mars-glow hover:bg-orange-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-mars transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D DEM Mesh</span>
                </button>
                <button
                  onClick={() => handleLaunchAnalogs(activeRegion)}
                  className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition"
                >
                  <span>Find Earth Analogs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Assessment Metrics 4-Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Atmospheric Pressure</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {activeRegion.atmosphericPressurePa} Pa
                </div>
                <div className="text-[10px] text-slate-500">MOLA Aeroid Datum</div>
              </div>

              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Water-Ice Prospect</span>
                </div>
                <div className="text-xs font-bold font-mono text-cyan-300 mt-1 truncate">
                  {activeRegion.iceAvailability.includes('sheet') ? 'Shallow Sheet Ice' : 'Hydrated Minerals'}
                </div>
                <div className="text-[10px] text-slate-500">SHARAD & CRISM</div>
              </div>

              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thermal Inertia</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {activeRegion.thermalInertia} TIU
                </div>
                <div className="text-[10px] text-slate-500">THEMIS Thermal Map</div>
              </div>

              <div className="bg-space-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-mars-glow" />
                  <span>Terrain Slope</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {activeRegion.slopeDeg}°
                </div>
                <div className="text-[10px] text-slate-500">Max: {activeRegion.maxSlopeDeg}°</div>
              </div>
            </div>

            {/* Ice & Water Resource Evaluation */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>In-Situ Resource Utilization (ISRU) Water-Ice Assessment</span>
              </h4>
              <p className="text-xs text-cyan-200/90 leading-relaxed bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/30 font-sans">
                {activeRegion.iceAvailability}
              </p>
            </div>

            {/* Geological Analysis */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Geological Context & Astrobiology Target Profile
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-space-900/70 p-3 rounded-xl border border-slate-800/80 font-sans">
                {activeRegion.geology}
              </p>
            </div>

            {/* Operational Hazards */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Landing Hazards & Rover Mobility Constraints</span>
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

            {/* Scientific Sources */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1.5">Integrated Scientific Instruments:</div>
              <div className="flex flex-wrap gap-2">
                {activeRegion.dataSources.map((ds, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-space-900 text-mars-glow border border-mars-rust/50 text-[11px] font-mono">
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
            <div className="glass-panel-glow w-full max-w-4xl h-[70vh] rounded-2xl border border-mars-glow/40 p-4 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    3D HiRISE / MOLA DEM Elevation Mesh: {activeRegion.name}
                  </h3>
                  <div className="text-xs font-mono text-mars-glow">
                    Color Ramp: Hypsometric Topography • Shaded Relief
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
