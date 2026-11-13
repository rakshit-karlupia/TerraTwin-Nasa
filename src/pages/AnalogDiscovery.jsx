import React, { useState, useMemo } from 'react';
import { Globe, Sliders, ArrowRight, ShieldCheck, Activity, Award, Eye, Compass, Info, CheckCircle2, AlertCircle, Map } from 'lucide-react';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { MARS_REGIONS } from '../data/marsRegions';
import { EARTH_CANDIDATES } from '../data/earthCandidates';
import { DEFAULT_FEATURE_WEIGHTS, rankEarthCandidates } from '../utils/scoring';
import { formatCoordinates } from '../utils/coordinates';
import WeightSlidersPanel from '../components/panels/WeightSlidersPanel';
import FeatureDifferenceChart from '../components/charts/FeatureDifferenceChart';
import RadarChart from '../components/charts/RadarChart';
import LocationImageGallery from '../components/location/LocationImageGallery';

export default function AnalogDiscovery({
  targetReference,
  setTargetReference,
  setView,
  setSelectedLocation
}) {
  const [selectedPlanet, setSelectedPlanet] = useState(targetReference?.planetId || 'mars');
  const [weights, setWeights] = useState({ ...DEFAULT_FEATURE_WEIGHTS });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Available reference regions for chosen planet
  const targetRegions = selectedPlanet === 'moon' ? LUNAR_REGIONS : MARS_REGIONS;

  // Active target reference
  const currentTarget = useMemo(() => {
    if (targetReference && targetReference.planetId === selectedPlanet) {
      return targetReference;
    }
    return targetRegions[0];
  }, [targetReference, selectedPlanet, targetRegions]);

  // Ranked candidates derived from mathematical weighted normalized distance
  const rankedResults = useMemo(() => {
    return rankEarthCandidates(currentTarget, EARTH_CANDIDATES, weights);
  }, [currentTarget, weights]);

  // Currently focused candidate for inspection (default top match)
  const activeCandidateResult = useMemo(() => {
    if (selectedCandidate) {
      const match = rankedResults.find(r => r.candidateId === selectedCandidate.id);
      if (match) return { ...match, raw: selectedCandidate };
    }
    const top = rankedResults[0];
    const raw = EARTH_CANDIDATES.find(c => c.id === top?.candidateId);
    return { ...top, raw };
  }, [rankedResults, selectedCandidate]);

  const handleSelectTarget = (target) => {
    if (setTargetReference) setTargetReference(target);
    setSelectedCandidate(null);
  };

  const handleInspectOnEarth = (candidateRaw) => {
    if (setSelectedLocation) setSelectedLocation(candidateRaw);
    setView('earth-map');
  };

  const handleInspectOnEarthGlobe = (candidateRaw) => {
    if (setSelectedLocation) setSelectedLocation(candidateRaw);
    setView('explorer');
  };

  const handleOpenComparisonLab = (candidateRaw) => {
    if (setTargetReference) setTargetReference(currentTarget);
    if (setSelectedLocation) setSelectedLocation(candidateRaw);
    setView('compare-lab');
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Core Geospatial AI // Earth Analog Discovery Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Data-Driven Terrestrial Analog Ranking
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Identifies Earth environments that share measurable physical, geological, and topographic characteristics
              with selected lunar and Martian landing regions using explainable weighted normalized distance.
            </p>
          </div>

          {/* Mathematical Formula Pill */}
          <div className="px-4 py-2 rounded-xl bg-space-900 border border-cyan-500/30 font-mono text-xs text-cyan-300">
            <span className="text-slate-400">Model: </span>
            <span>Similarity = 100 × (1 - Σ wᵢ·dᵢ)</span>
          </div>
        </div>

        {/* Step 1: Select Target Planetary Body & Reference Site */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Step 1: Reference World:</span>
              <div className="flex items-center space-x-2 bg-space-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setSelectedPlanet('moon');
                    handleSelectTarget(LUNAR_REGIONS[0]);
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono transition ${
                    selectedPlanet === 'moon' ? 'bg-slate-200 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Moon (Artemis III)
                </button>
                <button
                  onClick={() => {
                    setSelectedPlanet('mars');
                    handleSelectTarget(MARS_REGIONS[0]);
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono transition ${
                    selectedPlanet === 'mars' ? 'bg-mars-glow text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mars (Exploration Zones)
                </button>
              </div>
            </div>

            {/* Target Selector Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Target Region:</span>
              <select
                value={currentTarget?.id}
                onChange={(e) => {
                  const found = targetRegions.find(r => r.id === e.target.value);
                  if (found) handleSelectTarget(found);
                }}
                className="bg-space-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                {targetRegions.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({formatCoordinates(r.lat, r.lon)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Target Summary Strip */}
          <div className="p-3.5 rounded-xl bg-space-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">Active Reference:</span>
              <strong className="text-white text-sm">{currentTarget.name}</strong>
              <span className="text-cyan-300 font-bold">{formatCoordinates(currentTarget.lat, currentTarget.lon)}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>Slope: <strong className="text-slate-200">{currentTarget.slopeDeg}°</strong></span>
              <span>Roughness: <strong className="text-slate-200">{currentTarget.roughness}</strong></span>
              <span>Relief: <strong className="text-slate-200">{currentTarget.reliefM}m</strong></span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Data Validated</span>
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 & 3: Weight Tuning & Ranked Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Weight Sliders Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <WeightSlidersPanel
              weights={weights}
              onChange={setWeights}
              onReset={() => setWeights({ ...DEFAULT_FEATURE_WEIGHTS })}
            />

            {/* Scientific Caveat */}
            <div className="p-3.5 rounded-xl bg-space-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
              <strong className="text-slate-300 block mb-1 font-mono uppercase">Reproducibility Rule:</strong>
              Scores are fully deterministic. Given the same weights, any team member or reviewer will compute identical rankings.
            </div>
          </div>

          {/* Center Column: Ranked Earth Candidates Leaderboard (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-200">
                Ranked Earth Analogs ({rankedResults.length})
              </h3>
              <span className="text-xs font-mono text-cyan-400">Descending Similarity</span>
            </div>

            <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
              {rankedResults.map((result) => {
                const isSelected = activeCandidateResult?.candidateId === result.candidateId;
                const raw = EARTH_CANDIDATES.find(c => c.id === result.candidateId);

                return (
                  <div
                    key={result.candidateId}
                    onClick={() => setSelectedCandidate(raw)}
                    className={`p-3.5 rounded-xl cursor-pointer transition border text-left ${
                      isSelected
                        ? 'glass-panel-glow border-cyan-400 shadow-glow-cyan'
                        : 'bg-space-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-space-850'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                            result.rank === 1 ? 'bg-amber-400 text-black' : result.rank === 2 ? 'bg-slate-300 text-black' : result.rank === 3 ? 'bg-amber-700 text-white' : 'bg-space-800 text-slate-400'
                          }`}>
                            #{result.rank}
                          </span>
                          <h4 className="font-bold text-white text-xs">{result.name}</h4>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          {result.country}
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className={`text-base font-bold font-mono ${
                          result.similarity >= 75 ? 'text-emerald-400' : result.similarity >= 60 ? 'text-cyan-300' : 'text-amber-400'
                        }`}>
                          {result.similarity}%
                        </div>
                        <div className="text-[9px] font-mono text-slate-500">
                          Match Score
                        </div>
                      </div>
                    </div>

                    {/* Positive Driver & Coverage */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400 truncate max-w-[170px]">
                        Driver: <strong className="text-emerald-400 font-semibold">{result.positiveDrivers[0]?.label}</strong>
                      </span>
                      <span className="text-slate-500">
                        Coverage: {result.coveragePct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Candidate Breakdown & Radar Chart (4 cols) */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            {activeCandidateResult ? (
              <>
                <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      Rank #{activeCandidateResult.rank} Candidate Profile
                    </span>
                    <h3 className="text-lg font-bold font-display text-white mt-0.5">
                      {activeCandidateResult.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400">
                      {activeCandidateResult.country} • {formatCoordinates(activeCandidateResult.raw?.lat || 0, activeCandidateResult.raw?.lon || 0)}
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-cyan-300">
                    {activeCandidateResult.similarity}%
                  </div>
                </div>

                {/* Genuine Regional Satellite / Aerial Imagery */}
                <LocationImageGallery
                  images={activeCandidateResult.raw?.images || []}
                  locationName={activeCandidateResult.name}
                  planetId="earth"
                />

                {/* Radar Comparison Chart */}
                <div className="py-1 flex justify-center">
                  <RadarChart
                    target={currentTarget}
                    candidate={activeCandidateResult.raw}
                    width={320}
                    height={280}
                  />
                </div>

                {/* Feature Contributions Breakdown */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
                    Explainable Feature Matching
                  </div>
                  <FeatureDifferenceChart
                    featureDistances={activeCandidateResult.featureDistances}
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handleOpenComparisonLab(activeCandidateResult.raw)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-glow-cyan transition"
                  >
                    <span>Inspect in Comparison Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleInspectOnEarthGlobe(activeCandidateResult.raw)}
                      className="py-2 px-2 rounded-xl bg-space-900 hover:bg-space-800 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center space-x-1.5 transition"
                    >
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>3D Globe</span>
                    </button>

                    <button
                      onClick={() => handleInspectOnEarth(activeCandidateResult.raw)}
                      className="py-2 px-2 rounded-xl bg-space-900 hover:bg-space-800 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center space-x-1.5 transition"
                    >
                      <Map className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Global Map</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-slate-500 font-mono text-xs">Select a candidate to inspect breakdown.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
