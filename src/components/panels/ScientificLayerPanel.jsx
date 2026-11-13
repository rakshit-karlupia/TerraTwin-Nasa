import React, { useState } from 'react';
import { Layers, Mountain, Compass, Thermometer, Droplets, Activity, Eye, Sliders, ChevronDown, ChevronUp, Info } from 'lucide-react';

export const SCIENTIFIC_LAYERS = [
  {
    id: 'natural',
    name: 'Natural Visible',
    shortName: 'Visible',
    description: 'Calibrated true-color orbital surface reflectance',
    instrument: 'Orbital Optical Cameras (LROC WAC / CTX / MODIS)',
    unit: 'Reflectance (I/F)',
    gradient: null,
    minVal: '0.0',
    maxVal: '1.0'
  },
  {
    id: 'elevation',
    name: 'Topographic Altimetry',
    shortName: 'Elevation',
    description: 'Hypsometric elevation relative to planetary datum',
    instrument: 'Laser / Radar Altimeter (LOLA / MOLA / SRTM)',
    unit: 'meters (m)',
    gradient: 'linear-gradient(to right, #2c004d, #001f99, #0099ff, #00e676, #ffea00, #ff1744, #ffffff)',
    minVal: '-8,200m',
    maxVal: '+12,400m'
  },
  {
    id: 'slope',
    name: 'Geotechnical Slope',
    shortName: 'Slope',
    description: 'Terrain steepness gradient and landing hazard classification',
    instrument: 'DEM Spatial Derivatives (Δz / Δx)',
    unit: 'degrees (°)',
    gradient: 'linear-gradient(to right, #00e676, #aeea00, #ffd600, #ff6d00, #dd2c00)',
    minVal: '0° (Flat)',
    maxVal: '> 30° (Scarp)'
  },
  {
    id: 'thermal',
    name: 'Thermal Inertia',
    shortName: 'Thermal',
    description: 'Diurnal heat retention and regolith grain compactness',
    instrument: 'Infrared Radiometer (Diviner / THEMIS)',
    unit: 'TIU (J·m⁻²·K⁻¹·s⁻¹/²)',
    gradient: 'linear-gradient(to right, #1a0033, #4a0e4e, #c2185b, #f57c00, #ffeb3b)',
    minVal: '40 TIU',
    maxVal: '650 TIU'
  },
  {
    id: 'waterIce',
    name: 'Volatile / Water-Ice Proxy',
    shortName: 'Water-Ice',
    description: 'Permanently Shadowed Regions (PSR) and radar dielectric anomalies',
    instrument: 'Bistatic Radar & Epithermal Neutrons (Mini-RF / LEND / CRISM)',
    unit: 'Relative Proxy [0-1]',
    gradient: 'linear-gradient(to right, #030712, #083344, #0891b2, #06b6d4, #67e8f9, #ffffff)',
    minVal: '0.0 (Dry)',
    maxVal: '1.0 (Cold Trap)'
  },
  {
    id: 'roughness',
    name: 'Surface Roughness Index',
    shortName: 'Roughness',
    description: 'Sub-pixel decimeter boulder frequency and RMS slope scatter',
    instrument: 'Circular Polarization Ratio (CPR) & MOLA RMS',
    unit: 'Hurst Index [0-1]',
    gradient: 'linear-gradient(to right, #0f172a, #334155, #b45309, #f59e0b, #fef08a)',
    minVal: '0.05 (Smooth)',
    maxVal: '0.85 (Blocky)'
  }
];

export default function ScientificLayerPanel({
  activeLayer = 'natural',
  onSelectLayer,
  layerOpacity = 0.85,
  onChangeOpacity,
  planetId = 'mars',
  className = ""
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedLayerMeta = SCIENTIFIC_LAYERS.find(l => l.id === activeLayer) || SCIENTIFIC_LAYERS[0];

  return (
    <div className={`glass-panel rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl backdrop-blur-xl ${className}`}>
      {/* Header Bar with Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2.5 bg-space-900/90 flex items-center justify-between cursor-pointer border-b border-slate-800/80 hover:bg-space-800/80 transition"
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Scientific Datasets & Layers
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 text-cyan-300 border border-cyan-500/30">
            {selectedLayerMeta.shortName}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3.5 space-y-3">
          {/* Layer Selector Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {SCIENTIFIC_LAYERS.map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => onSelectLayer && onSelectLayer(layer.id)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono text-center transition border ${
                    isSelected
                      ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-glow-cyan'
                      : 'bg-space-900/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                  title={layer.description}
                >
                  {layer.shortName}
                </button>
              );
            })}
          </div>

          {/* Active Layer Description & Provenance */}
          <div className="p-2.5 rounded-lg bg-space-900/60 border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200">{selectedLayerMeta.name}</span>
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">
                {planetId.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-tight">
              {selectedLayerMeta.description}
            </p>
            <div className="text-[9px] font-mono text-slate-500 pt-0.5">
              Source: <span className="text-slate-300">{selectedLayerMeta.instrument}</span>
            </div>
          </div>

          {/* Dynamic Scientific Colormap Legend (if not natural) */}
          {selectedLayerMeta.gradient && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>Min: {selectedLayerMeta.minVal}</span>
                <span className="text-cyan-400 font-bold">{selectedLayerMeta.unit}</span>
                <span>Max: {selectedLayerMeta.maxVal}</span>
              </div>
              <div
                className="w-full h-3 rounded-full border border-slate-700 shadow-inner"
                style={{ background: selectedLayerMeta.gradient }}
              />
            </div>
          )}

          {/* Overlay Opacity Slider (enabled when a scientific layer is active) */}
          {activeLayer !== 'natural' && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>Layer Blend Opacity</span>
                </span>
                <span className="text-white font-bold">{Math.round(layerOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layerOpacity}
                onChange={(e) => onChangeOpacity && onChangeOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
