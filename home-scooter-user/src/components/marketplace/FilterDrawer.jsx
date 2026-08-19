import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ChevronDown } from 'lucide-react';

export const FilterDrawer = ({ isOpen, onClose, filters, setFilters, onApply }) => {
  const { selectedLocation } = useAuth();
  const [radiusKm, setRadiusKm] = useState(filters?.distanceKm || 10);
  const [selectedCategories, setSelectedCategories] = useState(['ALL']);
  const [sortBy, setSortBy] = useState('New Ads');

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', name: 'All Categories' },
    { id: 'Layout Sites', name: 'Layout Sites' },
    { id: 'Properties', name: 'Properties' },
    { id: 'Electric Scooters', name: 'Electric Scooters' },
    { id: 'Services', name: 'Services' },
    { id: 'Others', name: 'Others' },
  ];

  const sortOptions = [
    'New Ads',
    'Top Viewed',
    'High Demand',
    'Price: Low to High',
  ];

  const toggleCategory = (catId) => {
    if (catId === 'ALL') {
      setSelectedCategories(['ALL']);
    } else {
      let updated = selectedCategories.filter((c) => c !== 'ALL');
      if (updated.includes(catId)) {
        updated = updated.filter((c) => c !== catId);
      } else {
        updated.push(catId);
      }
      if (updated.length === 0) updated = ['ALL'];
      setSelectedCategories(updated);
    }
  };

  const handleReset = () => {
    setRadiusKm(10);
    setSelectedCategories(['ALL']);
    setSortBy('New Ads');
  };

  const handleApplyClick = () => {
    if (setFilters) {
      setFilters((prev) => ({
        ...prev,
        distanceKm: radiusKm,
        category: selectedCategories.join(','),
        sort: sortBy === 'New Ads' ? 'newest' : sortBy === 'Top Viewed' ? 'views' : 'newest',
      }));
    }
    if (onApply) onApply();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 border-t border-slate-100 max-h-[90vh] overflow-y-auto z-10 space-y-5 animate-in slide-in-from-bottom duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-serif text-xl font-bold text-slate-900">Filters</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-blue-600 font-serif font-bold text-sm hover:underline cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <label className="font-serif font-bold text-slate-900 text-sm block">
            Location
          </label>
          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between font-serif font-bold text-slate-800 text-sm cursor-pointer hover:border-slate-300 transition-colors">
            <span>{selectedLocation || 'Bangalore, Karnataka'}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Radius Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-serif font-bold text-slate-900 text-sm">
            <span>Radius</span>
            <span>{radiusKm} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600 my-2"
          />
        </div>

        {/* Category Section */}
        <div className="space-y-3">
          <label className="font-serif font-bold text-slate-900 text-sm block">
            Category
          </label>
          <div className="space-y-3">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center transition-colors">
                    {isChecked ? (
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-400 group-hover:border-slate-600" />
                    )}
                  </div>
                  <span
                    className={`font-serif text-sm ${
                      isChecked ? 'font-bold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sort By Section */}
        <div className="space-y-3">
          <label className="font-serif font-bold text-slate-900 text-sm block">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-4">
            {sortOptions.map((opt) => {
              const isSelected = sortBy === opt;
              return (
                <div
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center p-0.5">
                        <div className="w-full h-full rounded-full bg-blue-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400" />
                    )}
                  </div>
                  <span
                    className={`font-serif text-xs sm:text-sm ${
                      isSelected ? 'font-bold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={handleApplyClick}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-serif font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer transition-all mt-6"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
