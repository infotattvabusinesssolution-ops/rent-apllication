import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { CATEGORY_LIST } from '../../constants/categories';
import { useAuth } from '../../context/AuthContext';

export const SearchBar = ({ onOpenLocation, onOpenFilter }) => {
  const navigate = useNavigate();
  const { selectedLocation } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim() && category === 'ALL') return;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'ALL') params.set('category', category);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full bg-white rounded-2xl p-2 shadow-lg border border-slate-200/80">
      <div className="flex flex-col md:flex-row items-center gap-2">
        {/* Input */}
        <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties, plots, EV scooters, services..."
            className="w-full text-sm font-medium text-slate-800 outline-none bg-transparent placeholder-slate-400"
          />
        </div>

        {/* Location Dropdown Pill */}
        <button
          type="button"
          onClick={onOpenLocation}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span className="max-w-[140px] truncate">{selectedLocation}</span>
        </button>

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="hidden lg:block text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl border-none outline-none cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Filter Drawer Trigger for Mobile */}
        {onOpenFilter && (
          <button
            type="button"
            onClick={onOpenFilter}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-blue-500/20 shadow-md cursor-pointer shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
};
