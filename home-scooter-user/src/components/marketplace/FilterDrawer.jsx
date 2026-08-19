import React from 'react';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { CATEGORY_LIST } from '../../constants/categories';

export const FilterDrawer = ({ isOpen, onClose, filters, setFilters, onApply }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Filter & Sort Listings" position="bottom">
      <div className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleChange('category', 'ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filters.category === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => handleChange('category', cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filters.category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Range */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <span>Distance Radius</span>
            <span className="text-blue-600 font-extrabold">{filters.distanceKm || 50} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.distanceKm || 50}
            onChange={(e) => handleChange('distanceKm', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Sort By
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Apply CTA */}
        <div className="pt-3 border-t border-slate-100 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setFilters({ category: 'ALL', distanceKm: 50, sort: 'newest' });
            }}
          >
            Reset
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (onApply) onApply();
              onClose();
            }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
