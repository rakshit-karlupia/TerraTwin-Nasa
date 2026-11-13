import React, { useState, useMemo } from 'react';
import { Award, Download, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';
import { EARTH_CANDIDATES } from '../data/earthCandidates';
import { MARS_REGIONS } from '../data/marsRegions';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { DEFAULT_FEATURE_WEIGHTS, rankEarthCandidates } from '../utils/scoring';
import { formatCoordinates } from '../utils/coordinates';

export default function Rankings({ setView, setSelectedLocation, setTargetReference }) {
  const [selectedPlanet, setSelectedPlanet] = useState('mars');
  const [targetId, setTargetId] = useState(MARS_REGIONS[0].id);

  const targets = selectedPlanet === 'moon' ? LUNAR_REGIONS : MARS_REGIONS;
  const currentTarget = useMemo(() => targets.find(t => t.id === targetId) || targets[0], [targets, targetId]);

  const rankedData = useMemo(() => {
    return rankEarthCandidates(currentTarget, EARTH_CANDIDATES, DEFAULT_FEATURE_WEIGHTS);
  }, [currentTarget]);

  const handleExportCSV = () => {
    const headers = ["Rank", "Name", "Country", "Similarity_Score_Pct", "Total_Distance_D", "Coverage_Pct", "Primary_Driver", "Primary_Penalty"];
    const rows = rankedData.map(r => [
      r.rank,
      `"${r.name}"`,
      `"${r.country}"`,
      r.similarity,
      r.totalDistance,
      `${r.coveragePct}%`,
      `"${r.positiveDrivers[0]?.label || ''}"`,
      `"${r.penalizingFactors[0]?.label || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TerraTwin_Rankings_${currentTarget.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewCandidate = (candidateId) => {
    const raw = EARTH_CANDIDATES.find(c => c.id === candidateId);
    if (raw && setSelectedLocation) {
      setSelectedLocation(raw);
      if (setTargetReference) setTargetReference(currentTarget);
      setView('earth-map');
    }
  };

  const handleCompareCandidate = (candidateId) => {
    const raw = EARTH_CANDIDATES.find(c => c.id === candidateId);
    if (raw && setSelectedLocation) {
      setSelectedLocation(raw);
      if (setTargetReference) setTargetReference(currentTarget);
      setView('compare-lab');
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Scientific Leaderboard // Terrestrial Analog Rankings</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Global Earth Analog Rankings
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Complete leaderboard evaluating all 11 cataloged terrestrial environments against target planetary regions.
              Derived using the explainable weighted normalized distance formulation.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-space-900 hover:bg-space-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center space-x-2 transition shadow-glow-cyan"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>

        {/* Target Benchmark Controls */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-slate-400 uppercase">Benchmark Planet:</span>
            <div className="flex items-center space-x-1 bg-space-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setSelectedPlanet('moon');
                  setTargetId(LUNAR_REGIONS[0].id);
                }}
                className={`px-3 py-1 text-xs font-mono rounded transition ${
                  selectedPlanet === 'moon' ? 'bg-slate-200 text-black font-bold' : 'text-slate-400'
                }`}
              >
                Moon (Artemis III)
              </button>
              <button
                onClick={() => {
                  setSelectedPlanet('mars');
                  setTargetId(MARS_REGIONS[0].id);
                }}
                className={`px-3 py-1 text-xs font-mono rounded transition ${
                  selectedPlanet === 'mars' ? 'bg-mars-glow text-white font-bold' : 'text-slate-400'
                }`}
              >
                Mars (Exploration Zones)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Target Region:</span>
            <select
              value={currentTarget.id}
              onChange={(e) => setTargetId(e.target.value)}
              className="bg-space-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            >
              {targets.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({formatCoordinates(t.lat, t.lon)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-space-900/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 font-bold text-center w-16">Rank</th>
                  <th className="py-3.5 px-4 font-bold">Earth Analog Location</th>
                  <th className="py-3.5 px-4 font-bold">Country</th>
                  <th className="py-3.5 px-4 font-bold text-center">Similarity Score</th>
                  <th className="py-3.5 px-4 font-bold">Primary Driver (Closest Match)</th>
                  <th className="py-3.5 px-4 font-bold">Greatest Divergence</th>
                  <th className="py-3.5 px-4 font-bold text-center">Data Coverage</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rankedData.map((item) => {
                  const raw = EARTH_CANDIDATES.find(c => c.id === item.candidateId);
                  return (
                    <tr
                      key={item.candidateId}
                      className="hover:bg-space-850/80 transition"
                    >
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          item.rank === 1 ? 'bg-amber-400 text-black shadow-glow-cyan' :
                          item.rank === 2 ? 'bg-slate-300 text-black' :
                          item.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-space-800 text-slate-400'
                        }`}>
                          #{item.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                        {item.name}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {formatCoordinates(raw?.lat || 0, raw?.lon || 0)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {item.country}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-base font-extrabold ${
                          item.similarity >= 75 ? 'text-emerald-400' :
                          item.similarity >= 60 ? 'text-cyan-300' :
                          'text-amber-400'
                        }`}>
                          {item.similarity}%
                        </span>
                        <div className="text-[9px] text-slate-500">D = {item.totalDistance}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                          {item.positiveDrivers[0]?.label || 'Slope'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 text-[10px] font-bold">
                          {item.penalizingFactors[0]?.label || 'Volatiles'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-slate-300 font-bold">{item.coveragePct}%</span>
                        <div className="text-[9px] text-emerald-400 flex items-center justify-center space-x-1 mt-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Validated</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewCandidate(item.candidateId)}
                          className="px-2.5 py-1 rounded bg-space-900 hover:bg-space-800 text-cyan-300 border border-slate-700 text-[11px] transition"
                        >
                          3D Globe
                        </button>
                        <button
                          onClick={() => handleCompareCandidate(item.candidateId)}
                          className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] shadow-glow-cyan transition"
                        >
                          Compare
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
