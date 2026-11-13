import React, { useState, useMemo } from 'react';
import { GitCompare, Download, Layers, ShieldCheck, Mountain, Compass, Thermometer, Droplets, Info, ArrowRightLeft } from 'lucide-react';
import { LUNAR_REGIONS } from '../data/lunarRegions';
import { MARS_REGIONS } from '../data/marsRegions';
import { EARTH_CANDIDATES } from '../data/earthCandidates';
import { formatCoordinates, getCRSByPlanet } from '../utils/coordinates';
import { evaluateCandidateSimilarity, DEFAULT_FEATURE_WEIGHTS } from '../utils/scoring';
import { generateRegionDEM, extractCrossSectionProfile } from '../utils/demProcessor';
import RadarChart from '../components/charts/RadarChart';
import TerrainCrossSectionChart from '../components/charts/TerrainCrossSectionChart';
import TerrainRenderer from '../three/TerrainRenderer';
import ImageComparisonSlider from '../components/location/ImageComparisonSlider';

export default function ComparisonLab({
  targetReference,
  selectedLocation
}) {
  // Pool of all sites across bodies
  const allSites = useMemo(() => [
    ...LUNAR_REGIONS.map(r => ({ ...r, body: 'Moon' })),
    ...MARS_REGIONS.map(r => ({ ...r, body: 'Mars' })),
    ...EARTH_CANDIDATES.map(r => ({ ...r, body: 'Earth' }))
  ], []);

  // Primary site (Left)
  const [siteAId, setSiteAId] = useState(
    targetReference?.id || 'mars-jezero'
  );

  // Secondary site (Right)
  const [siteBId, setSiteBId] = useState(
    selectedLocation?.id || 'earth-atacama'
  );

  const [activeTerrainMode, setActiveTerrainMode] = useState('profile'); // 'profile' or '3d'
  const [activeDemTarget, setActiveDemTarget] = useState('A'); // 'A' or 'B'

  const siteA = useMemo(() => allSites.find(s => s.id === siteAId) || allSites[0], [allSites, siteAId]);
  const siteB = useMemo(() => allSites.find(s => s.id === siteBId) || allSites[1], [allSites, siteBId]);

  // Compute scientific similarity if one is planetary and one is Earth (or general)
  const similarityEvaluation = useMemo(() => {
    return evaluateCandidateSimilarity(siteA, siteB, DEFAULT_FEATURE_WEIGHTS);
  }, [siteA, siteB]);

  // Elevation Cross-Section profiles for both sites
  const profileA = useMemo(() => {
    const dem = generateRegionDEM(siteA.id, 128);
    return extractCrossSectionProfile(dem, 64);
  }, [siteA]);

  const profileB = useMemo(() => {
    const dem = generateRegionDEM(siteB.id, 128);
    return extractCrossSectionProfile(dem, 64);
  }, [siteB]);

  // Downloadable report handler (JSON research artifact)
  const handleExportReport = () => {
    const reportData = {
      title: "TerraTwin Planetary Comparison Report",
      generatedAt: new Date().toISOString(),
      primarySite: siteA,
      secondarySite: siteB,
      similarityEvaluation,
      scientificDisclaimers: [
        "TerraTwin is an explainable decision-support platform for the NASA Space Apps Challenge 2026.",
        "Measurements derive from LOLA, MOLA, and SRTM remote sensing products.",
        "Scores do not guarantee engineering landing safety or human survivability."
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TerraTwin_${siteA.name.replace(/\s+/g, '_')}_vs_${siteB.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const crsA = getCRSByPlanet(siteA.body.toLowerCase());
  const crsB = getCRSByPlanet(siteB.body.toLowerCase());

  // Calculate parameter deltas
  const elevDelta = Math.abs((siteA.elevationM ?? 0) - (siteB.elevationM ?? 0));
  const slopeDelta = Math.abs((siteA.slopeDeg ?? 0) - (siteB.slopeDeg ?? 0)).toFixed(1);
  const roughnessDelta = Math.abs((siteA.roughness ?? 0.35) - (siteB.roughness ?? 0.35)).toFixed(2);
  const reliefDelta = Math.abs((siteA.reliefM ?? 500) - (siteB.reliefM ?? 500));

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Scientific Diagnostics // Comparison Laboratory</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Multi-Body Environmental Comparison
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Perform rigorous side-by-side scientific evaluations across Moon vs Moon, Mars vs Mars, and Planetary vs Earth analog locations with synchronized imagery and telemetry.
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl bg-space-900 hover:bg-space-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center space-x-2 transition shadow-glow-cyan"
          >
            <Download className="w-4 h-4" />
            <span>Export Evidence Report</span>
          </button>
        </div>

        {/* Site Selectors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site A Selector */}
          <div className="glass-panel p-4 rounded-xl border border-mars-glow/40">
            <span className="text-[10px] font-mono text-mars-glow uppercase tracking-wider block mb-1">
              Primary Reference Location (Target A)
            </span>
            <select
              value={siteAId}
              onChange={(e) => setSiteAId(e.target.value)}
              className="w-full bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-mars-glow"
            >
              {allSites.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.body}] {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Site B Selector */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/40">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              Secondary Location (Target B)
            </span>
            <select
              value={siteBId}
              onChange={(e) => setSiteBId(e.target.value)}
              className="w-full bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            >
              {allSites.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.body}] {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FEATURE 8: Interactive Side-by-Side Image Comparison & Curtain Slider */}
        <ImageComparisonSlider siteA={siteA} siteB={siteB} />

        {/* Parameter Delta Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-space-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Elevation Delta (Δh)</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">{elevDelta} m</span>
            <span className="text-[10px] font-mono text-cyan-400">Datum: {crsA.verticalDatum} vs {crsB.verticalDatum}</span>
          </div>
          <div className="bg-space-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Slope Delta (Δθ)</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">{slopeDelta}°</span>
            <span className="text-[10px] font-mono text-emerald-400">{slopeDelta < 3 ? 'Close Match (<3°)' : 'Distinct Gradient'}</span>
          </div>
          <div className="bg-space-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Roughness Delta (ΔR)</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">{roughnessDelta}</span>
            <span className="text-[10px] font-mono text-slate-400">Dimensionless index</span>
          </div>
          <div className="bg-space-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Relief Delta (ΔΔz)</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">~{reliefDelta} m</span>
            <span className="text-[10px] font-mono text-slate-400">Across 5km window</span>
          </div>
        </div>

        {/* Side-by-Side Parameter Matrix */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Site A Profile */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-mars-glow uppercase font-bold">
                    {siteA.body} • {siteA.category || 'Highland Field'}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-0.5">{siteA.name}</h3>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {formatCoordinates(siteA.lat, siteA.lon)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Elevation Datum</span>
                  <strong className="text-white text-sm">
                    {siteA.elevationM !== undefined ? `${siteA.elevationM > 0 ? `+${siteA.elevationM}` : siteA.elevationM} m` : 'N/A'}
                  </strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Mean Slope</span>
                  <strong className="text-white text-sm">{siteA.slopeDeg || 'N/A'}°</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Roughness Index</span>
                  <strong className="text-white text-sm">{siteA.roughness || '0.35'}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Relief (5km)</span>
                  <strong className="text-white text-sm">~{siteA.reliefM || '500'} m</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Geological Lithology:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-lg border border-slate-800 font-sans">
                  {siteA.geology || siteA.summary}
                </p>
              </div>
            </div>

            {/* Site B Profile */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                    {siteB.body} • {siteB.category || 'Terrestrial Analog'}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-0.5">{siteB.name}</h3>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {formatCoordinates(siteB.lat, siteB.lon)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Elevation Datum</span>
                  <strong className="text-white text-sm">
                    {siteB.elevationM !== undefined ? `${siteB.elevationM > 0 ? `+${siteB.elevationM}` : siteB.elevationM} m` : 'N/A'}
                  </strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Mean Slope</span>
                  <strong className="text-white text-sm">{siteB.slopeDeg || 'N/A'}°</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Roughness Index</span>
                  <strong className="text-white text-sm">{siteB.roughness || '0.35'}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Relief (5km)</span>
                  <strong className="text-white text-sm">~{siteB.reliefM || '500'} m</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Geological Lithology:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-lg border border-slate-800 font-sans">
                  {siteB.geology || siteB.summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Diagnostics: Radar Comparison & Cross-Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Spider Comparison (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between items-center">
            <div className="w-full flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-300">
                Multi-Variable Parameter Radar
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Match: <strong>{similarityEvaluation.similarity}%</strong>
              </span>
            </div>

            <div className="my-auto py-2">
              <RadarChart
                target={siteA}
                candidate={siteB}
                width={360}
                height={320}
              />
            </div>

            <div className="w-full text-center text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              Normalized axes: Slope, Roughness, Relief, Albedo, Thermal, Volatiles
            </div>
          </div>

          {/* Elevation Transect Cross-Sections (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-300">
                Topographic Elevation Cross-Sections (25 km Transects)
              </span>
              <div className="flex items-center space-x-1 bg-space-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTerrainMode('profile')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition ${
                    activeTerrainMode === 'profile' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                  }`}
                >
                  2D Sliced Profile
                </button>
                <button
                  onClick={() => setActiveTerrainMode('3d')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition ${
                    activeTerrainMode === '3d' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                  }`}
                >
                  3D DEM View
                </button>
              </div>
            </div>

            {activeTerrainMode === 'profile' ? (
              <div className="space-y-4">
                <div className="p-3 bg-space-900/60 rounded-xl border border-slate-800">
                  <TerrainCrossSectionChart
                    profile={profileA}
                    title={`${siteA.name} (${siteA.body}) Transect`}
                    height={160}
                  />
                </div>
                <div className="p-3 bg-space-900/60 rounded-xl border border-slate-800">
                  <TerrainCrossSectionChart
                    profile={profileB}
                    title={`${siteB.name} (${siteB.body}) Transect`}
                    height={160}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setActiveDemTarget('A')}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded border transition ${
                      activeDemTarget === 'A'
                        ? 'bg-mars-glow text-white font-bold border-mars-glow'
                        : 'bg-space-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Target A: {siteA.name}
                  </button>
                  <button
                    onClick={() => setActiveDemTarget('B')}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded border transition ${
                      activeDemTarget === 'B'
                        ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                        : 'bg-space-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Target B: {siteB.name}
                  </button>
                </div>
                <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-800 relative">
                  <TerrainRenderer
                    regionId={activeDemTarget === 'A' ? siteA.id : siteB.id}
                    renderMode="elevation"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
