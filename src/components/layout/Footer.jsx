import React from 'react';
import { ShieldCheck, Database, FileText, AlertTriangle } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="w-full bg-space-950 border-t border-slate-800/80 text-slate-400 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scientific Boundary Notice Alert */}
        <div className="mb-6 p-4 rounded-xl bg-space-900/80 border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200">Scientific Integrity & Operational Boundary: </span>
              <span className="text-slate-300">
                TerraTwin is an explainable decision-support research prototype created for the NASA Space Apps Challenge 2026.
                Similarity scores reflect normalized differences across documented remote sensing products (LOLA, MOLA, SRTM).
                A high similarity score is an environmental research indicator and does not certify landing safety or astronaut survival.
              </span>
            </div>
          </div>
          <button
            onClick={() => setView('about')}
            className="shrink-0 px-3 py-1.5 rounded bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 font-bold transition text-[11px]"
          >
            Scientific Methodology
          </button>
        </div>

        {/* Links & Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800/60">
          <div>
            <div className="text-white font-bold font-display uppercase tracking-wider mb-2">TERRATWIN</div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Planetary exploration, future landing site intelligence, and explainable Earth analog discovery platform.
            </p>
          </div>

          <div>
            <div className="text-white font-bold font-display uppercase tracking-wider mb-2">Planetary Portals</div>
            <ul className="space-y-1 text-[11px]">
              <li><a href="https://science.nasa.gov/mission/lro/" target="_blank" rel="noreferrer" className="hover:text-cyan-300">NASA LRO Science Portal</a></li>
              <li><a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer" className="hover:text-cyan-300">NASA Planetary Data System (PDS)</a></li>
              <li><a href="https://science.nasa.gov/mars/" target="_blank" rel="noreferrer" className="hover:text-cyan-300">NASA Mars Exploration</a></li>
              <li><a href="https://www.earthdata.nasa.gov/" target="_blank" rel="noreferrer" className="hover:text-cyan-300">NASA Earthdata Discovery</a></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-bold font-display uppercase tracking-wider mb-2">Landing Sites</div>
            <ul className="space-y-1 text-[11px]">
              <li><button onClick={() => setView('lunar-missions')} className="hover:text-cyan-300">9 Artemis III Candidate Regions</button></li>
              <li><button onClick={() => setView('mars-missions')} className="hover:text-cyan-300">Mars Human Exploration Zones</button></li>
              <li><button onClick={() => setView('compare-lab')} className="hover:text-cyan-300">Comparison Laboratory</button></li>
              <li><button onClick={() => setView('data-explorer')} className="hover:text-cyan-300">Dataset Provenance Catalog</button></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-bold font-display uppercase tracking-wider mb-2">Data Integrity</div>
            <div className="text-[11px] text-slate-400 space-y-1 font-sans">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Fabricated Data Policy</span>
              </div>
              <p>Missing measurements are explicitly flagged rather than interpolated or assumed.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <div>© 2026 TerraTwin Project. Built for NASA Space Apps Challenge 2026.</div>
          <div className="mt-2 sm:mt-0 font-mono">
            CRS: Standard Sphere (Moon IAU 2000 / Mars Areoid 2000 / WGS84 EGM96)
          </div>
        </div>
      </div>
    </footer>
  );
}
