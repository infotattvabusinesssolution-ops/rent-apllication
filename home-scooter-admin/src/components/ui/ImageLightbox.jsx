import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export const ImageLightbox = ({ isOpen, onClose, images = [], initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images]);

  if (!isOpen || !images.length) return null;

  const currentImage = typeof images[currentIndex] === 'string' ? images[currentIndex] : images[currentIndex]?.url;

  const handlePrev = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between text-white z-10">
        <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoom((z) => (z > 1 ? z - 0.5 : 1))}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setZoom((z) => (z < 3 ? z + 0.5 : 3))}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImage}
          alt={`Preview ${currentIndex + 1}`}
          style={{ transform: `scale(${zoom})` }}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg transition-transform duration-200"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails Footer */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
          {images.map((img, idx) => {
            const url = typeof img === 'string' ? img : img.url;
            return (
              <img
                key={idx}
                src={url}
                alt=""
                onClick={() => {
                  setZoom(1);
                  setCurrentIndex(idx);
                }}
                className={`w-14 h-14 object-cover rounded-lg cursor-pointer transition-all ${
                  idx === currentIndex
                    ? 'ring-2 ring-blue-500 scale-105 opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
