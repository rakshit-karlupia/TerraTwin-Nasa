import React from 'react';
import { X, Globe, Compass, Mountain, Thermometer, Droplets, ExternalLink, ShieldAlert, ArrowRight, Eye } from 'lucide-react';
import { formatCoordinates } from '../../utils/coordinates';

export default function LocationDetailPanel({
  location,
  onClose,
  onExploreTerrain,
  onFindAnalogs,
  onCompare,
  similarity = null
}) {
  if (!location) return null;

  const isEarth = location.country !== undefined;
  const isMoon = location.planetId === 'moon';
  const isMars = location.planetId === 'mars';

  return (
    <div className="absolute top-20 right-6 w-96 max-h-[85vh] glass-panel-glow rounded-xl p-5 overflow-y-auto z-40 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex justify-between items-start pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isEarth ? 'bg-emerald-400' : isMoon ? 'bg-slate-300' : 'bg-rose-500'}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              {isEarth ? `Earth Analog • ${location.country}` : `${location.planetId?.toUpperCase()} • ${location.category}`}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 font-display leading-tight">{location.name}</h2>
          <div className="text-xs font-mono text-cyan-300 mt-0.5">
            {formatCoordinates(location.lat, location.lon)}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Similarity Badge (if active) */}
      {similarity != null && (
        <div className="mt-4 p-3 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-cyan-300">Similarity Match</div>
            <div className="text-2xl font-bold font-mono text-white">{similarity}%</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400">Explainable Model</div>
            <div className="text-xs font-mono text-emerald-400 font-semibold">Weighted Distance D</div>
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {/* Elevation */}
        <div className="bg-space-900/80 p-2.5 rounded-lg border border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Mountain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elevation</span>
          </div>
          <div className="text-sm font-bold font-mono text-white mt-1">
            {location.elevationM !== undefined
              ? `${location.elevationM > 0 ? `+${location.elevationM}` : location.elevationM} m`
              : 'N/A'}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Relief: {location.reliefM ? `~${location.reliefM} m` : 'Documented'}
          </div>
        </div>

        {/* Slope & Roughness */}
        <div className="bg-space-900/80 p-2.5 rounded-lg border border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Slope / Roughness</span>
          </div>
          <div className="text-sm font-bold font-mono text-white mt-1">
            {location.slopeDeg ? `${location.slopeDeg}°` : 'Varies'}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            RMS: {location.roughness || '0.35'}
          </div>
        </div>

        {/* Temperature Range */}
        <div className="bg-space-900/80 p-2.5 rounded-lg border border-slate-800/80 col-span-2">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Thermal Environment</span>
          </div>
          <div className="text-xs font-mono text-slate-200 mt-1">
            {location.thermalRangeK || (location.thermalRangeK ? `${location.thermalRangeK} K diurnal` : 'See mission observations')}
          </div>
        </div>

        {/* Volatiles / Water Ice Indicator */}
        {(location.iceAvailability || location.psrDistanceKm !== undefined || location.volatilesIndex !== undefined) && (
          <div className="bg-space-900/80 p-2.5 rounded-lg border border-slate-800/80 col-span-2">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Water-Ice / Volatiles</span>
            </div>
            <div className="text-xs font-mono text-cyan-200 mt-1">
              {location.iceAvailability || 
               (location.psrDistanceKm !== undefined ? `Distance to Cold Trap: ${location.psrDistanceKm} km` : `Volatiles Index: ${location.volatilesIndex}`)}
            </div>
          </div>
        )}
      </div>

      {/* Geological Characteristics */}
      <div className="mt-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Geological Description</h4>
        <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-2.5 rounded border border-slate-800/60">
          {location.geology || location.summary}
        </p>
      </div>

      {/* Historical Testing / Operational Hazards */}
      {(location.historicalUsage || location.keyHazards) && (
        <div className="mt-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            {location.historicalUsage ? 'Analog Research & Testing Heritage' : 'Operational Hazards'}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-2.5 rounded border border-slate-800/60">
            {location.historicalUsage || (Array.isArray(location.keyHazards) ? location.keyHazards.join('; ') : location.keyHazards)}
          </p>
        </div>
      )}

      {/* Provenance & Scientific Data Sources */}
      <div className="mt-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Data Provenance</h4>
        <div className="flex flex-wrap gap-1.5">
          {(location.dataSources || ['NASA PDS', 'USGS Altimetry']).map((src, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-space-800 text-[10px] font-mono text-cyan-300 border border-cyan-800/40">
              {src}
            </span>
          ))}
        </div>
      </div>

      {/* Uncertainty Disclosures */}
      {location.uncertaintyNotes && (
        <div className="mt-3 p-2 rounded bg-amber-950/30 border border-amber-600/30 flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-200/90 leading-tight">
            <strong>Uncertainty / Caveat:</strong> {location.uncertaintyNotes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 space-y-2">
        {onExploreTerrain && (
          <button
            onClick={() => onExploreTerrain(location)}
            className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-glow-cyan transition"
          >
            <Eye className="w-4 h-4" />
            <span>Explore in 3D DEM Terrain</span>
          </button>
        )}

        {!isEarth && onFindAnalogs && (
          <button
            onClick={() => onFindAnalogs(location)}
            className="w-full py-2 px-3 rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 font-semibold text-xs border border-cyan-500/40 flex items-center justify-center space-x-2 transition"
          >
            <Globe className="w-4 h-4" />
            <span>Find Earth Analogs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {onCompare && (
          <button
            onClick={() => onCompare(location)}
            className="w-full py-2 px-3 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 font-medium text-xs border border-slate-700 flex items-center justify-center space-x-2 transition"
          >
            <span>Compare in Laboratory</span>
          </button>
        )}
      </div>
    </div>
  );
}
