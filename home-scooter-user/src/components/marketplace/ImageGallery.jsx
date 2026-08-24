import React, { useState } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const ImageGallery = ({ images = [] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIdx] || images[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group">
        <img
          src={currentImage}
          alt={`Listing media ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/90 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/90 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Trigger & Counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="bg-slate-900/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {activeIdx + 1} / {images.length}
          </span>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-lg bg-slate-900/70 text-white hover:bg-slate-900 backdrop-blur-xs transition-all cursor-pointer"
            title="Fullscreen Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 aspect-video rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                activeIdx === idx ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={currentImage} alt="Fullscreen preview" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};
