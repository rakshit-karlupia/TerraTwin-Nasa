import React from 'react';

/**
 * High-Precision Multi-Variable Radar (Spider) Chart
 * Visualizes 6-8 physical dimensions comparing planetary reference vs. Earth analog
 */
export default function RadarChart({
  target,
  candidate,
  width = 380,
  height = 340
}) {
  const size = Math.min(width, height);
  const center = size / 2;
  const radius = center - 50;

  // Normalized dimensions [0, 1]
  const axes = [
    { label: 'Slope Steepness', targetVal: (target?.slopeDeg || 10) / 35, candVal: (candidate?.slopeDeg || 10) / 35 },
    { label: 'Surface Roughness', targetVal: (target?.roughness || 0.4) / 0.8, candVal: (candidate?.roughness || 0.4) / 0.8 },
    { label: 'Relief Amplitude', targetVal: Math.min(1, (target?.reliefM || 1000) / 3500), candVal: Math.min(1, (candidate?.reliefM || 1000) / 3500) },
    { label: 'Albedo Index', targetVal: (target?.albedo || 0.15) / 0.35, candVal: (candidate?.albedo || 0.20) / 0.35 },
    { label: 'Thermal Flux', targetVal: 0.65, candVal: (candidate?.thermalRangeK || 30) / 60 },
    { label: 'Volatiles / Ice', targetVal: target?.psrDistanceKm ? 0.8 : (target?.iceAvailability?.includes('sheet') ? 0.75 : 0.2), candVal: (candidate?.volatilesIndex || 0.1) / 0.5 }
  ];

  const numAxes = axes.length;
  const angleStep = (2 * Math.PI) / numAxes;

  // Compute polygon points
  const getCoordinates = (value, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = Math.max(0.05, Math.min(1.0, value)) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const targetPoints = axes.map((a, i) => getCoordinates(a.targetVal, i)).map(p => `${p.x},${p.y}`).join(' ');
  const candidatePoints = axes.map((a, i) => getCoordinates(a.candVal, i)).map(p => `${p.x},${p.y}`).join(' ');

  // Radial grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible select-none">
        {/* Background Radial Webs */}
        {gridLevels.map((lvl, idx) => {
          const webPoints = axes.map((_, i) => getCoordinates(lvl, i)).map(p => `${p.x},${p.y}`).join(' ');
          return (
            <polygon
              key={idx}
              points={webPoints}
              fill={idx === gridLevels.length - 1 ? 'rgba(8, 17, 32, 0.4)' : 'none'}
              stroke="rgba(0, 242, 254, 0.15)"
              strokeWidth="1"
              strokeDasharray={idx < gridLevels.length - 1 ? '3,3' : 'none'}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((axis, i) => {
          const p = getCoordinates(1.0, i);
          const labelAngle = i * angleStep - Math.PI / 2;
          const labelR = radius + 22;
          const lx = center + labelR * Math.cos(labelAngle);
          const ly = center + labelR * Math.sin(labelAngle);

          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={p.x}
                y2={p.y}
                stroke="rgba(0, 242, 254, 0.25)"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-mono fill-slate-300 font-medium"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Planetary Target Polygon */}
        <polygon
          points={targetPoints}
          fill="rgba(255, 94, 58, 0.25)"
          stroke="#ff5e3a"
          strokeWidth="2"
        />

        {/* Earth Analog Polygon */}
        <polygon
          points={candidatePoints}
          fill="rgba(0, 242, 254, 0.3)"
          stroke="#00f2fe"
          strokeWidth="2.5"
        />

        {/* Target Points */}
        {axes.map((a, i) => {
          const p = getCoordinates(a.targetVal, i);
          return (
            <circle
              key={`target-${i}`}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#ff5e3a"
              stroke="#ffffff"
              strokeWidth="1"
            />
          );
        })}

        {/* Candidate Points */}
        {axes.map((a, i) => {
          const p = getCoordinates(a.candVal, i);
          return (
            <circle
              key={`cand-${i}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#00f2fe"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center space-x-6 text-xs font-mono mt-2">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-mars-glow inline-block" />
          <span className="text-slate-200">{target?.name || 'Target Reference'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-cyan-glow inline-block" />
          <span className="text-slate-200">{candidate?.name || 'Earth Analog'}</span>
        </div>
      </div>
    </div>
  );
}
