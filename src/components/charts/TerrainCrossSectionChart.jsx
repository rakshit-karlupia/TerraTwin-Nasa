import React, { useState, useMemo } from 'react';
import { Mountain, Compass, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

/**
 * Interactive SVG Terrain Cross-Section Elevation Transect
 * With multi-directional slicing, interactive probes, and geotechnical telemetry.
 */
export default function TerrainCrossSectionChart({
  profile = [],
  width = 600,
  height = 200,
  title = "Terrain Elevation Cross-Section Transect",
  direction = 'WE',
  onDirectionChange = null
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!profile || profile.length === 0) {
    return <div className="text-slate-500 font-mono text-xs">No elevation profile data available.</div>;
  }

  const padding = { top: 25, right: 30, bottom: 35, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const elevations = profile.map(p => p.elevationM);
  const slopes = profile.map(p => p.slopeDeg || 0);

  const minElev = Math.min(...elevations);
  const maxElev = Math.max(...elevations);
  const elevRange = Math.max(10, maxElev - minElev);

  const meanSlope = (slopes.reduce((acc, s) => acc + s, 0) / slopes.length).toFixed(1);
  const maxSlope = Math.max(...slopes).toFixed(1);

  const maxDist = profile[profile.length - 1].distanceKm;

  // Coordinate mapping
  const getX = (dist) => padding.left + (dist / maxDist) * chartWidth;
  const getY = (elev) => padding.top + chartHeight - ((elev - minElev) / elevRange) * chartHeight;

  // Build SVG path
  const points = profile.map(p => `${getX(p.distanceKm)},${getY(p.elevationM)}`).join(' L ');
  const areaPath = `M ${getX(0)},${getY(minElev)} L ${points} L ${getX(maxDist)},${getY(minElev)} Z`;
  const linePath = `M ${points}`;

  const hoveredPoint = hoveredIndex !== null ? profile[hoveredIndex] : null;

  return (
    <div className="w-full flex flex-col space-y-2 select-none">
      {/* Transect Header & Direction Switcher */}
      <div className="w-full flex flex-wrap justify-between items-center px-1 gap-2">
        <div className="flex items-center space-x-2">
          <Mountain className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">{title}</span>
        </div>

        {onDirectionChange && (
          <div className="flex items-center space-x-1 bg-space-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
            {[
              { id: 'WE', label: 'West → East' },
              { id: 'NS', label: 'North → South' },
              { id: 'diagonal', label: 'NW → SE' },
              { id: 'radial', label: 'Radial' }
            ].map(dir => (
              <button
                key={dir.id}
                onClick={() => onDirectionChange(dir.id)}
                className={`px-2 py-0.5 rounded transition ${
                  direction === dir.id ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none overflow-visible"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#00f2fe" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
          const y = padding.top + chartHeight * ratio;
          const elevVal = Math.round(maxElev - ratio * elevRange);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="rgba(0, 242, 254, 0.1)"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400"
              >
                {elevVal > 0 ? `+${elevVal}` : elevVal}m
              </text>
            </g>
          );
        })}

        {/* Filled Elevation Area */}
        <path d={areaPath} fill="url(#elevGradient)" />

        {/* Elevation Profile Curve */}
        <path
          d={linePath}
          fill="none"
          stroke="#00f2fe"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Distance Axis Markers */}
        {[0, 5, 10, 15, 20, Math.floor(maxDist)].map((km, idx) => {
          if (km > maxDist) return null;
          const x = getX(km);
          return (
            <g key={idx}>
              <line
                x1={x}
                y1={padding.top + chartHeight}
                x2={x}
                y2={padding.top + chartHeight + 4}
                stroke="rgba(0, 242, 254, 0.4)"
              />
              <text
                x={x}
                y={padding.top + chartHeight + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400"
              >
                {km} km
              </text>
            </g>
          );
        })}

        {/* Interactive Hover Probes */}
        {profile.map((p, i) => {
          const cx = getX(p.distanceKm);
          const cy = getY(p.elevationM);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="7"
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          );
        })}

        {/* Active Probe Indicator */}
        {hoveredPoint && (
          <g>
            <line
              x1={getX(hoveredPoint.distanceKm)}
              y1={padding.top}
              x2={getX(hoveredPoint.distanceKm)}
              y2={padding.top + chartHeight}
              stroke="#00f2fe"
              strokeWidth="1.5"
              strokeDasharray="2,2"
            />
            <circle
              cx={getX(hoveredPoint.distanceKm)}
              cy={getY(hoveredPoint.elevationM)}
              r="5"
              fill={hoveredPoint.slopeDeg > 15 ? '#ef4444' : hoveredPoint.slopeDeg > 5 ? '#f59e0b' : '#10b981'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Tooltip Box */}
            <g transform={`translate(${Math.min(chartWidth, Math.max(75, getX(hoveredPoint.distanceKm)))}, ${padding.top + 20})`}>
              <rect
                x="-75"
                y="-30"
                width="150"
                height="42"
                rx="6"
                fill="#050b14"
                stroke={hoveredPoint.slopeDeg > 15 ? '#ef4444' : '#00f2fe'}
                strokeWidth="1"
                className="shadow-glow-cyan"
              />
              <text x="0" y="-12" textAnchor="middle" className="text-[11px] font-mono font-bold fill-white">
                Elev: {hoveredPoint.elevationM > 0 ? `+${hoveredPoint.elevationM}` : hoveredPoint.elevationM} m
              </text>
              <text x="0" y="3" textAnchor="middle" className="text-[9px] font-mono fill-cyan-300">
                Dist: {hoveredPoint.distanceKm} km | Slope: {hoveredPoint.slopeDeg}°
              </text>
              <text
                x="0"
                y="15"
                textAnchor="middle"
                className={`text-[8px] font-mono font-bold ${
                  hoveredPoint.slopeDeg > 15 ? 'fill-rose-400' : hoveredPoint.slopeDeg > 5 ? 'fill-amber-400' : 'fill-emerald-400'
                }`}
              >
                {hoveredPoint.slopeDeg > 15 ? 'CRATER SCARP / HAZARD' : hoveredPoint.slopeDeg > 5 ? 'MODERATE TERRAIN' : 'LEVEL LANDING BASIN'}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Geotechnical Telemetry Summary Bar */}
      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono bg-space-900/60 p-2 rounded-lg border border-slate-800">
        <div>
          <span className="text-slate-500 block">Baseline Relief</span>
          <strong className="text-white">{Math.round(elevRange)} m</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Min / Max Elev</span>
          <strong className="text-cyan-300">{minElev > 0 ? `+${minElev}` : minElev} / {maxElev > 0 ? `+${maxElev}` : maxElev} m</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Mean Slope</span>
          <strong className="text-white">{meanSlope}°</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Peak Scarp</span>
          <strong className={Number(maxSlope) > 15 ? 'text-rose-400' : 'text-emerald-400'}>{maxSlope}°</strong>
        </div>
      </div>
    </div>
  );
}
