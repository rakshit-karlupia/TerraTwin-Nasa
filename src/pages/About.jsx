import React from 'react';
import { ShieldCheck, BookOpen, ExternalLink, Award, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Title Header */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <span>NASA SPACE APPS CHALLENGE 2026 // CONCEPT & IMPLEMENTATION</span>
          </div>
          <h1 className="text-4xl font-extrabold font-display text-white">
            About TerraTwin
          </h1>
          <p className="text-lg text-slate-300 font-sans leading-relaxed">
            Identifying Earth Locations Analogous to Permanent Moon Base Sites and Mars.
          </p>
        </div>

        {/* The Idea In One Sentence */}
        <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 space-y-2">
          <div className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-widest">
            The Core Value In One Sentence
          </div>
          <p className="text-base text-white font-sans leading-relaxed">
            TerraTwin turns planetary and Earth observation data into a repeatable, explainable workflow for exploring candidate analog environments — instead of merely plotting already-known sites.
          </p>
        </div>

        {/* Problem Statement */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-display text-white">
            Problem Statement & Context
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            Testing every operational rover procedure, habitat structure, and EVA protocol directly on the Moon or Mars is prohibitively costly and risky. Terrestrial analog environments can support critical field trials, but an Earth site that looks visually similar in photographs may differ drastically in slope, roughness, lithology, thermal cycles, or atmospheric pressure.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            The scientific challenge is therefore not only to find visually dramatic landscapes, but to compare documented physical measurements and transparently characterize where the analog is useful and where its limits lie.
          </p>
        </div>

        {/* Scientific Methodology & Mathematical Scoring */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-display text-white">
            Explainable Similarity Formulation
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            TerraTwin avoids "black box" deep learning models in favor of an explainable, bounded weighted normalized distance model:
          </p>

          <div className="bg-space-900 p-5 rounded-xl border border-cyan-500/30 font-mono text-xs text-cyan-300 space-y-2">
            <div className="text-white font-bold text-sm">D = Σ (wᵢ × dᵢ)</div>
            <div className="text-white font-bold text-sm">Similarity = 100 × (1 - D)</div>
            <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-800">
              Where <span className="text-cyan-300">dᵢ = min(1, |xᵢ - tᵢ| / Rᵢ)</span> is the feature-specific difference normalized across documented range <span className="text-cyan-300">Rᵢ</span>, and <span className="text-cyan-300">wᵢ</span> is the importance weight such that <span className="text-cyan-300">Σwᵢ = 1.0</span>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div className="bg-space-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">Feature Normalizer Limits (Rᵢ)</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• Terrain Slope: R = 35° (derived from LOLA/MOLA/SRTM)</li>
                <li>• Surface Roughness: R = 0.80 RMS index</li>
                <li>• Relative Relief: R = 3500 m (5km elevation window)</li>
                <li>• Surface Albedo: R = 0.35 reflectance factor</li>
                <li>• Thermal Range: R = 60 K diurnal/seasonal flux</li>
                <li>• Volatiles Index: R = 0.60 ground ice proxy</li>
              </ul>
            </div>

            <div className="bg-space-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">Data Quality & Coverage Rules</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• Only documented, comparable feature pairs are evaluated</li>
                <li>• Coverage index reported alongside every score</li>
                <li>• Minimum coverage threshold required for definitive ranking</li>
                <li>• Relative relief analyzed rather than raw absolute datums</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scope Boundaries */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs font-mono text-amber-200/90 space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Strict Operational Boundaries & Caveats</span>
          </div>
          <p className="leading-relaxed font-sans">
            Earth cannot reproduce every lunar or Martian condition, including microgravity, high radiation flux, vacuum/near-vacuum pressures, electrostatic dust levitation, and cryogenic thermal sinks down to 25 K.
          </p>
          <p className="leading-relaxed font-sans">
            <strong>A similarity score is not a safety rating, base-site approval, or prediction of astronaut survival.</strong> TerraTwin is a geospatial decision-support research prototype designed for scientific inquiry and field trial planning.
          </p>
        </div>

        {/* References & Official Resources */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-2xl font-bold font-display text-white">
            References & Official Resources
          </h2>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="p-3 bg-space-900/70 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <strong>[1] NASA Space Apps Challenge 2026:</strong> Terrestrial Analogs for Permanent Moon Base & Mars
              </div>
              <a href="https://www.spaceappschallenge.org" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 bg-space-900/70 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <strong>[2] NASA LRO / LOLA Science Team:</strong> Lunar Orbiter Laser Altimeter GDR & Topography Products
              </div>
              <a href="https://science.nasa.gov/mission/lro/lola/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 bg-space-900/70 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <strong>[3] NASA Planetary Data System (PDS):</strong> Geoscience and Imaging Science Archives
              </div>
              <a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 bg-space-900/70 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <strong>[4] MRO HiRISE & CTX Archives:</strong> Sub-Meter Digital Terrain Models of Mars Exploration Sites
              </div>
              <a href="https://data.nasa.gov" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 bg-space-900/70 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <strong>[5] NASA Earthdata & USGS 3DEP:</strong> SRTM 30m Global Topography and Lidar Models
              </div>
              <a href="https://www.earthdata.nasa.gov" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
