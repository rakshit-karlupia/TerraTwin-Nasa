import React from 'react';
import { FEATURE_METADATA } from '../../utils/scoring';

/**
 * Feature-by-Feature Differential & Contribution Breakdown Bar Chart
 */
export default function FeatureDifferenceChart({ featureDistances = {} }) {
  const entries = Object.entries(featureDistances);

  if (entries.length === 0) {
    return <div className="text-slate-500 font-mono text-xs">No feature distance calculations available.</div>;
  }

  return (
    <div className="space-y-3.5 w-full">
      {entries.map(([key, item]) => {
        const meta = FEATURE_METADATA[key] || { label: key, unit: '', source: 'Remote Sensing' };
        // similarity for this feature is (1 - d_i) * 100
        const featureSim = Math.round((1 - item.d) * 100);
        const weightPct = Math.round(item.weight * 100);

        let statusColor = "bg-emerald-500 text-emerald-400";
        let statusLabel = "High Match";
        if (item.d > 0.45) {
          statusColor = "bg-rose-500 text-rose-400";
          statusLabel = "Divergent";
        } else if (item.d > 0.22) {
          statusColor = "bg-amber-500 text-amber-400";
          statusLabel = "Moderate";
        }

        return (
          <div key={key} className="bg-space-900/60 p-2.5 rounded border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-200">{meta.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">({meta.unit})</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="text-slate-400">Weight: {weightPct}%</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.d > 0.45 ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40' : item.d > 0.22 ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'}`}>
                  {featureSim}% match
                </span>
              </div>
            </div>

            {/* Values comparison row */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>Target: <strong className="text-mars-glow font-bold">{item.targetVal}</strong></span>
              <span>Earth Analog: <strong className="text-cyan-glow font-bold">{item.candidateVal}</strong></span>
              <span>Source: <em className="text-slate-500 not-italic">{meta.source}</em></span>
            </div>

            {/* Progress bar visualizing normalized similarity */}
            <div className="w-full bg-space-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${item.d > 0.45 ? 'bg-rose-500' : item.d > 0.22 ? 'bg-amber-500' : 'bg-cyan-400'}`}
                style={{ width: `${featureSim}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
