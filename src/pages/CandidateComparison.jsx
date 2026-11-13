import React, { useState, useMemo } from 'react';
import { GitCompare, ArrowRight, ShieldCheck, Sun, Compass, Mountain, Droplets, Radio } from 'lucide-react';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { MARS_REGIONS } from '../data/marsRegions';
import { formatCoordinates } from '../utils/coordinates';
import RadarChart from '../components/charts/RadarChart';

export default function CandidateComparison({ setView, setTargetReference }) {
  const [selectedBody, setSelectedBody] = useState('moon');
  const sites = selectedBody === 'moon' ? LUNAR_REGIONS : MARS_REGIONS;

  const [site1Id, setSite1Id] = useState(sites[0].id);
  const [site2Id, setSite2Id] = useState(sites[1]?.id || sites[0].id);

  const site1 = useMemo(() => sites.find(s => s.id === site1Id) || sites[0], [sites, site1Id]);
  const site2 = useMemo(() => sites.find(s => s.id === site2Id) || sites[1] || sites[0], [sites, site2Id]);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Mission Planning // Candidate Landing Site Comparison</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Landing Site Intelligence Matrix
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Evaluate trade-offs between competing mission landing sites for solar power availability,
              terrain slope hazards, volatile access, and direct Earth communication line-of-sight.
            </p>
          </div>

          {/* Planet Switcher */}
          <div className="flex items-center space-x-2 bg-space-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setSelectedBody('moon');
                setSite1Id(LUNAR_REGIONS[0].id);
                setSite2Id(LUNAR_REGIONS[3].id);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                selectedBody === 'moon' ? 'bg-slate-200 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Moon (Artemis III)
            </button>
            <button
              onClick={() => {
                setSelectedBody('mars');
                setSite1Id(MARS_REGIONS[0].id);
                setSite2Id(MARS_REGIONS[1].id);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                selectedBody === 'mars' ? 'bg-mars-glow text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mars (Exploration Zones)
            </button>
          </div>
        </div>

        {/* Site Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-4 rounded-xl border border-mars-glow/40">
            <span className="text-[10px] font-mono text-mars-glow uppercase block mb-1">Candidate Region 1</span>
            <select
              value={site1Id}
              onChange={(e) => setSite1Id(e.target.value)}
              className="w-full bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-mars-glow"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-cyan-500/40">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">Candidate Region 2</span>
            <select
              value={site2Id}
              onChange={(e) => setSite2Id(e.target.value)}
              className="w-full bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Side-by-Side Trade-off Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Candidate 1 */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-mars-glow font-bold">{site1.officialStatus}</span>
                <h3 className="text-2xl font-bold font-display text-white mt-0.5">{site1.name}</h3>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Coordinates: <strong className="text-white">{formatCoordinates(site1.lat, site1.lon)}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Elevation</span>
                  <strong className="text-white">{site1.elevationM > 0 ? `+${site1.elevationM}` : site1.elevationM} m</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Mean Terrain Slope</span>
                  <strong className="text-white">{site1.slopeDeg}°</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Surface Roughness</span>
                  <strong className="text-white">{site1.roughness}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Local Relief</span>
                  <strong className="text-white">~{site1.reliefM} m</strong>
                </div>
                {selectedBody === 'moon' && (
                  <>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Solar Illumination</span>
                      <strong className="text-amber-400">{site1.illuminationPct}%</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Distance to PSR Cold Trap</span>
                      <strong className="text-cyan-300">{site1.psrDistanceKm} km</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Direct Earth Comm LOS</span>
                      <strong className="text-emerald-400">{site1.earthCommVisibilityPct}%</strong>
                    </div>
                  </>
                )}
                {selectedBody === 'mars' && (
                  <>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Atmospheric Pressure</span>
                      <strong className="text-cyan-300">{site1.atmosphericPressurePa} Pa</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Thermal Inertia</span>
                      <strong className="text-white">{site1.thermalInertia} TIU</strong>
                    </div>
                  </>
                )}
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Geological Assessment:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-lg border border-slate-800 font-sans">
                  {site1.geology}
                </p>
              </div>
            </div>

            {/* Candidate 2 */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">{site2.officialStatus}</span>
                <h3 className="text-2xl font-bold font-display text-white mt-0.5">{site2.name}</h3>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Coordinates: <strong className="text-white">{formatCoordinates(site2.lat, site2.lon)}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Elevation</span>
                  <strong className="text-white">{site2.elevationM > 0 ? `+${site2.elevationM}` : site2.elevationM} m</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Mean Terrain Slope</span>
                  <strong className="text-white">{site2.slopeDeg}°</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Surface Roughness</span>
                  <strong className="text-white">{site2.roughness}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Local Relief</span>
                  <strong className="text-white">~{site2.reliefM} m</strong>
                </div>
                {selectedBody === 'moon' && (
                  <>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Solar Illumination</span>
                      <strong className="text-amber-400">{site2.illuminationPct}%</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Distance to PSR Cold Trap</span>
                      <strong className="text-cyan-300">{site2.psrDistanceKm} km</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Direct Earth Comm LOS</span>
                      <strong className="text-emerald-400">{site2.earthCommVisibilityPct}%</strong>
                    </div>
                  </>
                )}
                {selectedBody === 'mars' && (
                  <>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Atmospheric Pressure</span>
                      <strong className="text-cyan-300">{site2.atmosphericPressurePa} Pa</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Thermal Inertia</span>
                      <strong className="text-white">{site2.thermalInertia} TIU</strong>
                    </div>
                  </>
                )}
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Geological Assessment:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-lg border border-slate-800 font-sans">
                  {site2.geology}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
