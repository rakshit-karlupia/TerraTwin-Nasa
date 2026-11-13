import React, { useState, useRef, useEffect } from 'react';
import { SplitSquareHorizontal, Columns, Image as ImageIcon, AlertCircle, ZoomIn, X, Compass, ExternalLink } from 'lucide-react';
import { formatCoordinates, getCRSByPlanet } from '../../utils/coordinates';

/**
 * ImageComparisonSlider
 * Provides interactive side-by-side and curtain-slider visual terrain comparison
 * between two planetary or terrestrial analog sites.
 */
export default function ImageComparisonSlider({
  siteA,
  siteB,
  className = ""
}) {
  const [mode, setMode] = useState('curtain'); // 'curtain' | 'side-by-side'
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState(null); // 'A' | 'B' | null
  const containerRef = useRef(null);

  // Extract primary image or fallback for site A
  const imgA = siteA?.images?.[0] || (siteA?.image ? { url: siteA.image, title: siteA.name, credit: 'NASA / Planetary Data System' } : null);
  // Extract primary image or fallback for site B
  const imgB = siteB?.images?.[0] || (siteB?.image ? { url: siteB.image, title: siteB.name, credit: 'NASA / USGS / Earth Observation' } : null);

  const [imgAError, setImgAError] = useState(false);
  const [imgBError, setImgBError] = useState(false);

  // Reset errors when sites change
  useEffect(() => {
    setImgAError(false);
    setImgBError(false);
  }, [siteA?.id, siteB?.id]);

  // Handle pointer dragging for curtain slider
  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX === undefined) return;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((offsetX / rect.width) * 100);
    setSliderPos(percent);
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', stopDragging);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  const crsA = getCRSByPlanet(siteA?.body?.toLowerCase() || 'mars');
  const crsB = getCRSByPlanet(siteB?.body?.toLowerCase() || 'earth');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-space-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
            <SplitSquareHorizontal className="w-4 h-4 text-cyan-400" />
            Visual Terrain Inspection
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            // Side-by-Side Surface & Orbital Resolution
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-space-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setMode('curtain')}
              className={`px-3 py-1 rounded transition flex items-center space-x-1.5 ${
                mode === 'curtain' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SplitSquareHorizontal className="w-3.5 h-3.5" />
              <span>Curtain Slider</span>
            </button>
            <button
              onClick={() => setMode('side-by-side')}
              className={`px-3 py-1 rounded transition flex items-center space-x-1.5 ${
                mode === 'side-by-side' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Dual View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Display: Curtain or Dual View */}
      {mode === 'curtain' ? (
        <div
          ref={containerRef}
          onPointerDown={() => setIsDragging(true)}
          className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-cyan-500/30 bg-space-950 select-none cursor-ew-resize group shadow-2xl"
        >
          {/* Background Layer: Site B (Right) */}
          <div className="absolute inset-0 w-full h-full">
            {imgB && !imgBError ? (
              <img
                src={imgB.url}
                alt={siteB?.name || 'Site B'}
                onError={() => setImgBError(true)}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-space-900/90 text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 text-cyan-400/70" />
                <span className="text-xs font-mono font-bold text-slate-300">
                  {siteB?.name} Orbital Footprint
                </span>
                <p className="text-[11px] text-slate-400 max-w-xs font-sans">
                  Targeted close-up orbital imagery cataloged in PDS archive. Inspect DEM terrain for topographic relief.
                </p>
              </div>
            )}
            {/* Site B Badge */}
            <div className="absolute bottom-3 right-3 bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-right pointer-events-none">
              <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase tracking-wider">
                Target B • {siteB?.body}
              </span>
              <span className="text-xs font-bold text-white block truncate max-w-[200px]">
                {siteB?.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block">
                {imgB?.instrument || imgB?.credit || 'Remote Sensing'}
              </span>
            </div>
          </div>

          {/* Foreground Clipped Layer: Site A (Left) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="relative w-full h-full" style={{ width: containerRef.current?.clientWidth || '100%' }}>
              {imgA && !imgAError ? (
                <img
                  src={imgA.url}
                  alt={siteA?.name || 'Site A'}
                  onError={() => setImgAError(true)}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-space-900/90 text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 text-mars-glow/70" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {siteA?.name} Orbital Footprint
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-xs font-sans">
                    Targeted close-up orbital imagery cataloged in PDS archive.
                  </p>
                </div>
              )}
            </div>
            {/* Site A Badge */}
            <div className="absolute bottom-3 left-3 bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-mars-glow/30 text-left pointer-events-none">
              <span className="text-[10px] font-mono text-mars-glow font-bold block uppercase tracking-wider">
                Target A • {siteA?.body}
              </span>
              <span className="text-xs font-bold text-white block truncate max-w-[200px]">
                {siteA?.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block">
                {imgA?.instrument || imgA?.credit || 'Remote Sensing'}
              </span>
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-white to-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.8)] pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-space-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl group-hover:scale-110 transition-transform">
              <SplitSquareHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Helper caption */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-space-950/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-300 pointer-events-none border border-slate-800">
            Drag divider to compare ({sliderPos}% A / {100 - sliderPos}% B)
          </div>
        </div>
      ) : (
        /* Dual Viewport Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site A Card */}
          <div className="relative rounded-2xl overflow-hidden border border-mars-glow/40 bg-space-950 group">
            <div className="relative aspect-video flex items-center justify-center bg-space-900">
              {imgA && !imgAError ? (
                <>
                  <img
                    src={imgA.url}
                    alt={siteA?.name}
                    onError={() => setImgAError(true)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setActiveLightbox('A')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-space-950/80 hover:bg-mars-glow text-slate-300 hover:text-white border border-slate-700 transition"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="p-6 text-center space-y-1">
                  <AlertCircle className="w-6 h-6 text-mars-glow mx-auto" />
                  <div className="text-xs font-mono text-slate-300">{siteA?.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">PDS orbital product</div>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2 bg-space-900/60 border-t border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-mars-glow uppercase font-bold">
                    Target A • {siteA?.body}
                  </span>
                  <h4 className="text-base font-bold text-white">{siteA?.name}</h4>
                </div>
                {imgA?.resolution && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-space-950 text-slate-300 border border-slate-800">
                    {imgA.resolution}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Coord: <strong className="text-slate-200">{formatCoordinates(siteA?.lat, siteA?.lon)}</strong>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                Product: {imgA?.instrument || 'Orbital Imager'} ({imgA?.credit || 'NASA'})
              </div>
            </div>
          </div>

          {/* Site B Card */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-space-950 group">
            <div className="relative aspect-video flex items-center justify-center bg-space-900">
              {imgB && !imgBError ? (
                <>
                  <img
                    src={imgB.url}
                    alt={siteB?.name}
                    onError={() => setImgBError(true)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setActiveLightbox('B')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-space-950/80 hover:bg-cyan-500 hover:text-black text-slate-300 border border-slate-700 transition"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="p-6 text-center space-y-1">
                  <AlertCircle className="w-6 h-6 text-cyan-400 mx-auto" />
                  <div className="text-xs font-mono text-slate-300">{siteB?.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">Regional product</div>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2 bg-space-900/60 border-t border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    Target B • {siteB?.body}
                  </span>
                  <h4 className="text-base font-bold text-white">{siteB?.name}</h4>
                </div>
                {imgB?.resolution && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-space-950 text-slate-300 border border-slate-800">
                    {imgB.resolution}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Coord: <strong className="text-slate-200">{formatCoordinates(siteB?.lat, siteB?.lon)}</strong>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                Product: {imgB?.instrument || 'Satellite Imager'} ({imgB?.credit || 'USGS/NASA'})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-950/95 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative max-w-4xl w-full bg-space-900 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  {activeLightbox === 'A' ? siteA?.name : siteB?.name}
                </h3>
                <div className="text-xs font-mono text-cyan-300">
                  {activeLightbox === 'A' ? siteA?.body : siteB?.body} • {activeLightbox === 'A' ? imgA?.title || imgA?.instrument : imgB?.title || imgB?.instrument}
                </div>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="p-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img
                src={activeLightbox === 'A' ? imgA?.url : imgB?.url}
                alt="Enlarged orbital view"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Credit: {activeLightbox === 'A' ? imgA?.credit : imgB?.credit}</span>
              <span>Resolution: {activeLightbox === 'A' ? imgA?.resolution : imgB?.resolution}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
