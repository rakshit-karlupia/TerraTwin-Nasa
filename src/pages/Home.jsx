import React from 'react';
import { ArrowRight, Compass, Globe, Rocket, ShieldCheck, Database, Mountain, Activity, Layers } from 'lucide-react';
import PlanetaryScene from '../three/PlanetaryScene';
import { PLANETS } from '../data/planets';

export default function Home({ setView, setActivePlanet }) {
  return (
    <div className="relative min-h-screen bg-space-950 text-slate-100 select-none">
      {/* Hero Section with Interactive 3D Planet Background */}
      <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* 3D Earth Canvas as Background */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
          <PlanetaryScene
            activePlanet="earth"
            locations={[]}
            autoRotate={true}
          />
        </div>

        {/* Ambient Dark Gradient Vignette for Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-space-950 via-space-950/40 to-space-950/70 pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-space-900/90 border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-widest shadow-glow-cyan animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>NASA SPACE APPS CHALLENGE 2026 // GEOSPATIAL INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-none">
            EARTH IS OUR TESTING GROUND.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              SPACE IS OUR DESTINATION.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Discover Earth’s most extraordinary landscapes that resemble the environments of the Moon and Mars
            through planetary science, geospatial intelligence, and transparent environmental analysis.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setActivePlanet('earth');
                setView('explorer');
              }}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center space-x-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Planetary 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setView('analogs')}
              className="px-6 py-3.5 rounded-xl bg-space-900/90 hover:bg-space-800 text-cyan-300 border border-cyan-500/40 font-semibold text-sm flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Globe className="w-4 h-4" />
              <span>Discover Earth Analogs</span>
            </button>

            <button
              onClick={() => setView('lunar-missions')}
              className="px-6 py-3.5 rounded-xl bg-space-900/90 hover:bg-space-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Rocket className="w-4 h-4 text-mars-glow" />
              <span>Artemis III Landing Sites</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">3 Planetary Bodies</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">Earth, Moon, Mars</div>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">Artemis III Candidates</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">9 NASA Regions (Oct '24)</div>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">Earth Analogs Cataloged</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">11 Global Sites</div>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">Scoring Methodology</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">Weighted Normalized D</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Platform Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Architectural Overview</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Three Integrated Planetary Systems
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm">
            Bridging planetary remote sensing datasets with terrestrial field analogs for mission planning and robotics development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: 3D Planetary Explorer */}
          <div className="glass-panel-glow p-8 rounded-2xl border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-space-900 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-6 shadow-glow-cyan">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Immersive 3D Planetary Explorer
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                Full 3D rendering of Earth, Moon, and Mars powered by Three.js and custom GLSL atmospheric shaders.
                Interact with coordinates, inspect elevation, and transition smoothly from global orbit to local terrain.
              </p>
            </div>
            <button
              onClick={() => {
                setActivePlanet('moon');
                setView('explorer');
              }}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold pt-4 border-t border-slate-800/80"
            >
              <span>Launch 3D Explorer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Future Landing Site Intelligence */}
          <div className="glass-panel-glow p-8 rounded-2xl border border-mars-glow/40 flex flex-col justify-between hover:border-mars-glow transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-space-900 border border-mars-glow flex items-center justify-center text-mars-glow mb-6 shadow-glow-mars">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Future Landing Site Intelligence
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                Scientific analysis of NASA's 9 Artemis III candidate landing regions announced in October 2024,
                plus candidate Mars human exploration zones (Arcadia Planitia, Jezero, Utopia) using LRO LOLA and MOLA products.
              </p>
            </div>
            <button
              onClick={() => setView('lunar-missions')}
              className="flex items-center space-x-2 text-mars-glow hover:text-orange-400 font-mono text-xs font-bold pt-4 border-t border-slate-800/80"
            >
              <span>Inspect Landing Regions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Explainable Earth Analog Discovery */}
          <div className="glass-panel-glow p-8 rounded-2xl border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-space-900 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Earth Analog Discovery Engine
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                Transparent multi-variable distance algorithm ranking terrestrial environments against lunar and Martian targets.
                Complete with dynamic weight tuning, sensitivity analysis, and zero fabricated observations.
              </p>
            </div>
            <button
              onClick={() => setView('analogs')}
              className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold pt-4 border-t border-slate-800/80"
            >
              <span>Run Analog Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Scientific Methodology Introduction Banner */}
      <section className="py-16 bg-space-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Explainable Geospatial Formulation</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-display">
                Why Transparent Data Science Matters for Space Missions
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                Testing surface mobility rovers and EVA suits directly on the Moon or Mars is prohibitively expensive.
                However, an Earth landscape that superficially looks like Mars in photographs may differ drastically in slope,
                roughness, mineralogy, or thermal cycles.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                TerraTwin replaces guesswork with bounded mathematical formulation:
              </p>
              <div className="bg-space-950 p-4 rounded-xl border border-cyan-500/30 font-mono text-xs text-cyan-300 space-y-1">
                <div>D = Σ(wᵢ × dᵢ), where dᵢ = min(1, |xᵢ - tᵢ| / Rᵢ)</div>
                <div>Similarity = 100 × (1 - D)</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-start space-x-4">
                <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">3D DEM Terrain Elevation Engine</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Converts Digital Elevation Models into 3D meshes with dynamic vertex displacement, slope gradient shaders, and cross-section profiles.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-start space-x-4">
                <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Data Provenance & Coverage Disclosure</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Every score links back to its PDS / USGS product ID. Missing variables are explicitly reported rather than artificially smoothed.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-start space-x-4">
                <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Comparison Laboratory</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Side-by-side radar charts, 3D viewpoints, and parameter tables enabling rigorous comparison across Moon, Mars, and Earth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
