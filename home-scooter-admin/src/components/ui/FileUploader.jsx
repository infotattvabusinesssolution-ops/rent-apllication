import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export const FileUploader = ({
  onFileSelect,
  accept = 'image/png, image/jpeg, image/webp',
  maxSizeMb = 5,
  previewUrl,
  onRemove,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(previewUrl || null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMb}MB limit.`);
      return;
    }
    const url = URL.createObjectURL(file);
    setSelectedPreview(url);
    if (onFileSelect) onFileSelect(file, url);
  };

  const handleClear = () => {
    setSelectedPreview(null);
    if (onRemove) onRemove();
  };

  return (
    <div className="w-full">
      {selectedPreview ? (
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedPreview}
              alt="Uploaded preview"
              className="w-16 h-16 object-cover rounded-lg border border-slate-200"
            />
            <div>
              <p className="text-xs font-semibold text-slate-800">Media Asset Selected</p>
              <p className="text-[11px] text-slate-500">Ready for banner campaign</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP (MAX. {maxSizeMb}MB)</p>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
