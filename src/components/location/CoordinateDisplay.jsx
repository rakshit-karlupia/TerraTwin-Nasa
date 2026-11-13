import React from 'react';
import { Compass, Globe, MapPin } from 'lucide-react';
import { formatCoordinates } from '../../utils/coordinates';

export default function CoordinateDisplay({
  lat,
  lon,
  elevationM,
  planetId = 'mars',
  footprint = null,
  compact = false
}) {
  const isEarth = planetId === 'earth';
  const isMoon = planetId === 'moon';
  const isMars = planetId === 'mars';

  const crsDatum = isMoon
    ? 'IAU 2000 Moon (Mean Radius 1737.4 km)'
    : isMars
    ? 'IAU 2000 Mars (MOLA Areoid Zero Datum)'
    : 'WGS84 Ellipsoid (EGM96 Geoid Datum)';

  if (compact) {
    return (
      <div className="flex items-center space-x-2 text-xs font-mono">
        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="text-cyan-300 font-bold">{formatCoordinates(lat, lon)}</span>
        {elevationM !== undefined && (
          <span className="text-slate-400">
            ({elevationM > 0 ? `+${elevationM}` : elevationM}m)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-space-900/85 p-3 rounded-xl border border-cyan-500/25 space-y-2">
      <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400">
        <span className="flex items-center space-x-1">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Geodetic Coordinates</span>
        </span>
        <span className="text-cyan-400 font-bold">{planetId?.toUpperCase()}</span>
      </div>

      <div className="text-base font-bold font-mono text-cyan-300 tracking-wide">
        {formatCoordinates(lat, lon)}
      </div>

      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
        <div>
          <span className="text-slate-500 block text-[10px]">Elevation Datum</span>
          <strong className="text-slate-200">
            {elevationM !== undefined ? `${elevationM > 0 ? `+${elevationM}` : elevationM} m` : 'N/A'}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Coverage Radius</span>
          <strong className="text-slate-200">
            {footprint ? footprint : 'Regional (10-25 km)'}
          </strong>
        </div>
        <div className="col-span-2 text-[10px] text-slate-500 truncate">
          CRS: <span className="text-slate-400">{crsDatum}</span>
        </div>
      </div>
    </div>
  );
}
