import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Eye, Flame } from 'lucide-react';

export const TopViewed = () => {
  const { data: result, isLoading } = useQuery({
    queryKey: ['topViewedAds'],
    queryFn: () => adsApi.getAds({ sort: 'views' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-6 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Most Viewed Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Top performing marketplace ads ranked by total buyer impressions and views</p>
        </div>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle="No top viewed listings found" />
    </div>
  );
};
