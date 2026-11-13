import React from 'react';
import { Sliders, RotateCcw, Sparkles } from 'lucide-react';
import { DEFAULT_FEATURE_WEIGHTS, normalizeWeights } from '../../utils/scoring';

export default function WeightSlidersPanel({ weights, onChange, onReset }) {
  const norm = normalizeWeights(weights);

  const presets = [
    {
      label: 'Balanced',
      weights: { ...DEFAULT_FEATURE_WEIGHTS }
    },
    {
      label: 'Rover Mobility & Landing Safety',
      weights: { slopeDeg: 0.35, roughness: 0.30, reliefM: 0.20, morphology: 0.05, albedo: 0.05, thermalRange: 0.03, volatiles: 0.02 }
    },
    {
      label: 'Astrobiology & Soil Chemistry',
      weights: { slopeDeg: 0.08, roughness: 0.07, reliefM: 0.10, morphology: 0.30, albedo: 0.20, thermalRange: 0.10, volatiles: 0.15 }
    },
    {
      label: 'Cryogenic Volatiles & ISRU Ice',
      weights: { slopeDeg: 0.15, roughness: 0.10, reliefM: 0.10, morphology: 0.10, albedo: 0.10, thermalRange: 0.20, volatiles: 0.25 }
    }
  ];

  const handleSliderChange = (key, value) => {
    const updated = { ...weights, [key]: parseFloat(value) };
    onChange(updated);
  };

  const featureLabels = {
    slopeDeg: { label: 'Terrain Slope Steepness', desc: 'Landing and transit hazard limit' },
    roughness: { label: 'Surface Roughness', desc: 'Decameter obstacle distribution' },
    reliefM: { label: 'Relative Relief Amplitude', desc: '5km window elevation variance' },
    morphology: { label: 'Landform Morphology', desc: 'Crater, delta, volcanic structure' },
    albedo: { label: 'Surface Albedo / Reflectance', desc: 'Solar absorption & brightness' },
    thermalRange: { label: 'Thermal Variance Flux', desc: 'Diurnal and seasonal swing' },
    volatiles: { label: 'Volatile / Hydration Proxy', desc: 'Subsurface water-ice signature' }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
      {/* Title & Reset */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-100">
            Explainable Weight Formulation
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Weights</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Adjust feature weights <span className="font-mono text-cyan-300">wᵢ</span> to test sensitivity.
        Weights automatically normalize to <span className="font-mono text-cyan-300">Σwᵢ = 1.0</span>.
      </p>

      {/* Preset Pills */}
      <div>
        <div className="text-[10px] uppercase font-mono text-slate-400 mb-1.5 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Research Objective Presets</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => onChange(p.weights)}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-space-900 hover:bg-space-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-3 pt-2">
        {Object.entries(featureLabels).map(([key, info]) => {
          const val = weights[key] !== undefined ? weights[key] : DEFAULT_FEATURE_WEIGHTS[key];
          const normalizedPct = Math.round((norm[key] || 0) * 100);

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-200">{info.label}</span>
                <span className="font-mono font-bold text-cyan-400">{normalizedPct}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="1.0"
                step="0.01"
                value={val}
                onChange={(e) => handleSliderChange(key, e.target.value)}
                className="w-full h-1.5 bg-space-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="text-[10px] text-slate-500">{info.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
