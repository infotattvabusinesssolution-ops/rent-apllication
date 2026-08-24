import React from 'react';
import { ListingCard } from './ListingCard';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedCarousel = ({ listings = [] }) => {
  const featuredList = listings.filter((ad) => ad.isFeatured || ad.isHighDemand);
  const items = featuredList.length > 0 ? featuredList : listings.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Featured & High Demand</h2>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {items.map((ad) => (
          <div key={ad.id} className="min-w-[260px] sm:min-w-[300px] max-w-[320px] snap-start shrink-0">
            <ListingCard ad={ad} />
          </div>
        ))}
      </div>
    </div>
  );
};
