import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { categoryApi } from '../api/categoryApi';
import { useAuth } from '../context/AuthContext';

import { LocationSelectorModal } from '../components/marketplace/LocationSelectorModal';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';
import { formatCurrency } from '../utils/formatters';
import {
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Search,
  Star,
  Heart,
  Flame,
  Clock,
  Sparkles,
  Sliders,
  Target,
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: 'ALL', distanceKm: 50, sort: 'newest' });

  const { data: adsResult, isLoading } = useQuery({
    queryKey: ['homeAds'],
    queryFn: () => adsApi.getAds(),
  });

  const { data: categoryResult } = useQuery({
    queryKey: ['userCategories'],
    queryFn: () => categoryApi.getCategories(),
  });

  const allAds = adsResult?.data || [];
  const featuredAds = allAds.filter((ad) => ad.isFeatured || ad.status === 'APPROVED').slice(0, 5);
  
  // Filtered explore listings
  const exploreListings = activeCategory === 'ALL'
    ? allAds
    : allAds.filter((ad) => ad.category === activeCategory);


  const toggleFavorite = (e, adId) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [adId]: !prev[adId] }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Category avatar config
  const categoriesList = [
    {
      id: 'ALL',
      name: 'All',
      borderClass: 'bg-blue-600 text-amber-300 shadow-md shadow-blue-500/30',
      isStar: true,
      icon: null,
    },
    {
      id: 'Layout Sites',
      name: 'Layout Sites',
      borderClass: 'border-2 border-amber-300 bg-amber-50/40 text-amber-600',
      icon: '🗺️',
      path: '/categories/layout-sites',
    },
    {
      id: 'Properties',
      name: 'Properties',
      borderClass: 'border-2 border-blue-300 bg-blue-50/40 text-blue-600',
      icon: '🏢',
      path: '/categories/properties',
    },
    {
      id: 'Electric Scooters',
      name: 'Electric Scooters',
      borderClass: 'border-2 border-yellow-400 bg-yellow-50/40 text-yellow-600',
      icon: '🛵',
      path: '/categories/electric-scooters',
    },
    {
      id: 'Services',
      name: 'Services',
      borderClass: 'border-2 border-purple-300 bg-purple-50/40 text-purple-600',
      icon: '🛠️',
      path: '/categories/services',
    },
    {
      id: 'Others',
      name: 'Others',
      borderClass: 'border-2 border-slate-300 bg-slate-50/40 text-slate-600',
      icon: '📦',
      path: '/categories/others',
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto px-1 sm:px-0">
      {/* Location Bar & Filter Header */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div
          onClick={() => setIsLocationOpen(true)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <MapPin className="w-5 h-5 text-blue-600 fill-blue-600 shrink-0" />
          <span className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            {selectedLocation || 'Bangalore, Karnataka'}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200/80 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shrink-0"
          aria-label="Filter options"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative rounded-full border border-slate-200/90 bg-white py-3 px-4 shadow-xs flex items-center gap-3 w-full hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for properties, scooters, services..."
            className="w-full bg-transparent font-serif text-slate-800 placeholder:text-slate-400 text-sm font-light focus:outline-none"
          />
        </div>
      </form>

      {/* Category Avatar Circular Icons Row */}
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
        {categoriesList.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  cat.isStar
                    ? cat.borderClass
                    : `${cat.borderClass} ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-105' : 'group-hover:scale-105'}`
                }`}
              >
                {cat.isStar ? (
                  <Star className="w-8 h-8 fill-amber-300 text-amber-300" />
                ) : (
                  <span className="text-2xl select-none">{cat.icon}</span>
                )}
              </div>
              <span
                className={`text-xs font-semibold mt-1.5 whitespace-nowrap ${
                  isSelected ? 'text-blue-600 font-bold' : 'text-slate-700'
                }`}
              >
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Featured Ads Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-slate-900">Featured Ads</h2>
          <button
            onClick={() => navigate('/search?tab=featured')}
            className="text-blue-600 font-bold text-sm hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-60 h-64 rounded-3xl bg-slate-100 animate-pulse shrink-0" />
              ))
            : featuredAds.map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => navigate(`/ads/${ad.id}`)}
                  className="w-60 sm:w-64 shrink-0 bg-white rounded-3xl border border-slate-100/90 shadow-xs overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="h-44 bg-slate-100 rounded-t-3xl relative overflow-hidden flex items-center justify-center">
                    {ad.imageUrls?.[0] ? (
                      <img
                        src={ad.imageUrls[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-4xl">
                        {ad.category === 'Layout Sites' ? '🗺️' : ad.category === 'Electric Scooters' ? '🛵' : '🏢'}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white space-y-1">
                    <h3 className="font-serif font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-blue-600 font-black text-base font-serif">
                      {formatCurrency(ad.price)}
                    </p>
                    <p className="text-slate-400 text-xs font-light truncate">
                      {ad.location}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Top Categories Section (Soft Tinted Cards Grid) */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-slate-900">Top Categories</h2>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Near Me Card */}
          <div
            onClick={() => navigate('/near-me')}
            className="bg-[#f0f6ff] border border-blue-100/80 rounded-2xl p-4 cursor-pointer hover:bg-blue-100/60 transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎯</span>
              <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                Near Me
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-1 font-light">
              Radar view around 10km
            </p>
          </div>

          {/* New Ads Card */}
          <div
            onClick={() => navigate('/new-ads')}
            className="bg-[#f0fdf4] border border-emerald-100/80 rounded-2xl p-4 cursor-pointer hover:bg-emerald-100/60 transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">🆕</span>
              <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                New Ads
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-1 font-light">
              Freshly posted listings
            </p>
          </div>

          {/* Top Viewed Card */}
          <div
            onClick={() => navigate('/top-viewed')}
            className="bg-[#fffbeb] border border-amber-100/80 rounded-2xl p-4 cursor-pointer hover:bg-amber-100/60 transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔥</span>
              <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                Top Viewed
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-1 font-light">
              High traffic popular ads
            </p>
          </div>

          {/* Filters Card */}
          <div
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#faf5ff] border border-purple-100/80 rounded-2xl p-4 cursor-pointer hover:bg-purple-100/60 transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">⚙️</span>
              <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                Filters
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-1 font-light">
              Customize search & radius
            </p>
          </div>
        </div>
      </div>

      {/* Explore Listings Section */}
      <div className="space-y-3.5">
        <div className="flex items-center">
          <h2 className="font-serif text-xl font-bold text-slate-900">Explore Listings</h2>
          <span className="ml-2.5 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
            {exploreListings.length}
          </span>
        </div>

        <div className="space-y-3.5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
            ))
          ) : exploreListings.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
              <p className="font-serif text-slate-600 font-medium">No listings found in this category.</p>
            </div>
          ) : (
            exploreListings.map((ad) => (
              <div
                key={ad.id}
                onClick={() => navigate(`/ads/${ad.id}`)}
                className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:shadow-md transition-all group"
              >
                {/* Left Thumbnail Box */}
                <div className="w-24 h-24 rounded-2xl bg-slate-100/80 shrink-0 overflow-hidden flex items-center justify-center relative border border-slate-100">
                  {ad.imageUrls?.[0] ? (
                    <img
                      src={ad.imageUrls[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-3xl select-none">
                      {ad.category === 'Layout Sites' ? '🗺️' : ad.category === 'Electric Scooters' ? '🛵' : '🏢'}
                    </span>
                  )}
                </div>

                {/* Middle Details Box */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="font-serif font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-blue-600 font-black text-base font-serif">
                    {formatCurrency(ad.price)}
                  </p>
                  <p className="text-slate-400 text-xs font-light truncate">
                    {ad.location}
                  </p>
                </div>

                {/* Right Heart Favorite Icon */}
                <button
                  onClick={(e) => toggleFavorite(e, ad.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites[ad.id] ? 'fill-red-500 text-red-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Location & Filter Modals */}
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => navigate(`/search?category=${filters.category}&distance=${filters.distanceKm}`)}
      />
    </div>
  );
};
