import React, { useState, useMemo } from 'react';
import { Database, Search, ExternalLink, ShieldCheck, Filter, CheckCircle2, AlertTriangle, Layers, FileCode } from 'lucide-react';
import { DATASETS } from '../data/datasets';

export default function DataExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);

  const filteredDatasets = useMemo(() => {
    return DATASETS.filter(d => {
      if (selectedPlanet !== 'all' && d.planet.toLowerCase() !== selectedPlanet.toLowerCase()) return false;
      if (selectedStatus !== 'all' && d.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.instrument.toLowerCase().includes(q) ||
          d.mission.toLowerCase().includes(q) ||
          d.sourceOrg.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedPlanet, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Scientific Data Architecture // Data Explorer</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Scientific Dataset Catalog & Provenance
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
              Comprehensive registry of remote sensing products across Earth, Moon, and Mars.
              Every physical variable used in TerraTwin maintains strict lineage back to its NASA PDS, USGS, or ESA archive.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-space-900 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Fabricated Data Integrity Standard</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Planet Filter */}
            <div className="flex items-center space-x-1 bg-space-900 p-0.5 rounded-lg border border-slate-800">
              {['all', 'Moon', 'Mars', 'Earth'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPlanet(p)}
                  className={`px-3 py-1 text-xs font-mono rounded capitalize transition ${
                    selectedPlanet.toLowerCase() === p.toLowerCase()
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-space-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Processing Statuses</option>
              <option value="Integrated and validated">Integrated & Validated</option>
              <option value="Partially integrated">Partially Integrated</option>
              <option value="Available but not processed">Available But Not Processed</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter by instrument, mission, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-space-900 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((ds) => {
            const isMoon = ds.planet === 'Moon';
            const isMars = ds.planet === 'Mars';
            const isEarth = ds.planet === 'Earth';

            return (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds)}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition flex flex-col justify-between hover:bg-space-850"
              >
                <div>
                  {/* Planet & Status Tags */}
                  <div className="flex justify-between items-center mb-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isMoon ? 'bg-slate-300 text-black' : isMars ? 'bg-mars-glow text-white' : 'bg-cyan-500 text-black'
                    }`}>
                      {ds.planet}
                    </span>

                    <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{ds.status}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mb-1">{ds.name}</h3>
                  <div className="text-xs font-mono text-cyan-300 mb-3">{ds.mission} • {ds.instrument}</div>

                  <div className="space-y-1.5 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
                    <div>Measurement: <strong className="text-slate-200">{ds.measurementType}</strong></div>
                    <div>Resolution: <strong className="text-slate-200">{ds.resolution}</strong></div>
                    <div>Units: <strong className="text-slate-200">{ds.units}</strong></div>
                    <div>Source: <span className="text-slate-300">{ds.sourceOrg}</span></div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                  <span className="text-[10px] text-slate-500">{ds.processingLevel}</span>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold"
                  >
                    <span>PDS Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dataset Detail Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="glass-panel-glow w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                    {selectedDataset.planet} Remote Sensing Registry
                  </div>
                  <h2 className="text-xl font-bold font-display text-white mt-0.5">{selectedDataset.name}</h2>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {selectedDataset.sourceOrg} • {selectedDataset.mission}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDataset(null)}
                  className="px-3 py-1 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 font-mono text-xs"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Instrument</span>
                  <strong className="text-white">{selectedDataset.instrument}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Processing Level</span>
                  <strong className="text-white">{selectedDataset.processingLevel}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Spatial Resolution</span>
                  <strong className="text-white">{selectedDataset.resolution}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Measurement Units</span>
                  <strong className="text-white">{selectedDataset.units}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Temporal Coverage</span>
                  <strong className="text-white">{selectedDataset.temporalCoverage}</strong>
                </div>
                <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Dataset Version</span>
                  <strong className="text-white">{selectedDataset.version}</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Integration Notes:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-space-900 p-3 rounded-lg border border-slate-800 font-sans">
                  {selectedDataset.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">License: {selectedDataset.license}</span>
                <a
                  href={selectedDataset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center space-x-1.5 shadow-glow-cyan transition"
                >
                  <span>Open NASA PDS Archive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
