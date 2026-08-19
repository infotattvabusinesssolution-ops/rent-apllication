import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Clock } from 'lucide-react';

export const NewAds = () => {
  const { data: result, isLoading } = useQuery({
    queryKey: ['newAdsFeed'],
    queryFn: () => adsApi.getAds({ sort: 'newest' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">New Advertisements Feed</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Fresh marketplace listings sorted chronologically in real-time</p>
        </div>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle="No fresh ads posted recently" />
    </div>
  );
};
