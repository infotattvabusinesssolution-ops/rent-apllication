import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { formatCurrency, timeAgo } from '../utils/formatters';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';
import { ChevronLeft, SlidersHorizontal, Clock } from 'lucide-react';

export const NewAds = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: 'ALL', distanceKm: 50, sort: 'newest' });

  const { data: result, isLoading } = useQuery({
    queryKey: ['newAdsFeed'],
    queryFn: () => adsApi.getAds({ sort: 'newest' }),
  });

  const ads = (result?.data || []).filter((ad) => ad.status === 'APPROVED');


  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-1 sm:px-0">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-serif text-xl font-bold text-slate-900">New Ads</h1>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          aria-label="Filter options"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Ads Vertical List */}
      <div className="space-y-3.5 pt-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
          ))
        ) : ads.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
            <p className="font-serif text-slate-600 font-medium">No fresh ads posted recently.</p>
          </div>
        ) : (
          ads.map((ad) => (
            <div
              key={ad.id}
              onClick={() => navigate(`/ads/${ad.id}`)}
              className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-xs flex items-center gap-3.5 cursor-pointer hover:shadow-md transition-all group"
            >
              {/* Left Image Box */}
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

              {/* Right Details Box */}
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
                <div className="flex items-center gap-1 text-slate-400 text-[11px] font-light pt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{timeAgo(ad.postedAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => setIsFilterOpen(false)}
      />
    </div>
  );
};
