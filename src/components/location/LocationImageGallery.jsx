import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, ExternalLink, ShieldCheck, Layers, AlertCircle, X } from 'lucide-react';

/**
 * LocationImageGallery
 * Displays genuine NASA / ESA / USGS orbital and satellite imagery
 * with multi-product tabs, provenance disclosure, and zoom modal.
 */
export default function LocationImageGallery({ images = [], locationName = '', planetId = 'earth' }) {
  const [activeTab, setActiveTab] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // If no images provided, display an honest, scientific fallback
  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-space-900/90 rounded-xl border border-slate-800 p-4 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-space-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div className="text-xs font-mono font-bold text-slate-300">
          Regional Imagery Coverage Footprint
        </div>
        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          No targeted close-up orbital photograph cataloged for this precise coordinate.
          Global basemap observations are available in the 3D DEM Terrain module.
        </p>
        <div className="text-[10px] font-mono text-cyan-400 pt-1">
          PDS Archive Source: NASA {planetId === 'moon' ? 'LROC' : planetId === 'mars' ? 'MRO CTX' : 'Landsat 8'}
        </div>
      </div>
    );
  }

  const currentImage = images[activeTab] || images[0];

  return (
    <div className="space-y-2">
      {/* Product Tabs (if multiple images available) */}
      {images.length > 1 && (
        <div className="flex space-x-1 p-1 bg-space-900/90 rounded-lg border border-slate-800 overflow-x-auto text-[10px] font-mono">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setImgError(false);
              }}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-all ${
                activeTab === idx
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-space-800'
              }`}
            >
              {img.type || `Product ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative group rounded-xl overflow-hidden border border-cyan-500/30 bg-space-950 aspect-video flex items-center justify-center">
        {imgError ? (
          <div className="p-4 text-center space-y-1">
            <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="text-xs font-mono text-slate-300">Regional Product Offline</div>
            <div className="text-[10px] font-mono text-slate-500">
              Archival footprint: {currentImage.footprint || 'Regional footprint cataloged in PDS'}
            </div>
          </div>
        ) : (
          <>
            <img
              src={currentImage.url}
              alt={currentImage.title || locationName}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-space-950/90 via-transparent to-transparent pointer-events-none" />

            {/* Click to Zoom Action Button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-space-950/80 hover:bg-cyan-500 hover:text-black text-slate-300 backdrop-blur-md border border-cyan-500/30 transition shadow-lg"
              title="Expand Regional Image"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Bottom Attribution Bar */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-[10px] font-mono">
              <div className="truncate max-w-[80%]">
                <span className="text-white font-bold block truncate">
                  {currentImage.title || currentImage.instrument}
                </span>
                <span className="text-cyan-300 truncate block text-[9px]">
                  {currentImage.credit || 'NASA / PDS Archive'}
                </span>
              </div>
              {currentImage.resolution && (
                <span className="px-1.5 py-0.5 rounded bg-space-900/90 text-slate-300 border border-slate-700 text-[9px] shrink-0">
                  {currentImage.resolution}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-950/90 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative max-w-4xl w-full bg-space-900 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  {currentImage.title || locationName}
                </h3>
                <div className="text-xs font-mono text-cyan-300">
                  {locationName} • {currentImage.mission || 'Planetary Science Mission'} ({currentImage.instrument})
                </div>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img
                src={currentImage.url}
                alt={currentImage.title || locationName}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-mono text-slate-400">
              <div>
                Credit: <strong className="text-slate-200">{currentImage.credit || 'NASA / JPL / USGS'}</strong>
              </div>
              {currentImage.footprint && (
                <div>
                  Footprint: <span className="text-cyan-400">{currentImage.footprint}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
