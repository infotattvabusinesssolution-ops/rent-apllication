import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { CATEGORIES } from '../constants/categories';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Package } from 'lucide-react';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';

export const Others = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: CATEGORIES.OTHERS, distanceKm: 50, sort: 'newest' });

  const { data: result, isLoading } = useQuery({
    queryKey: ['othersPage', filters],
    queryFn: () => adsApi.getAds(filters),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-slate-700" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Miscellaneous & Promotional Listings</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Other sponsored offers and local community listings</p>
        </div>

        <Button icon={SlidersHorizontal} variant="outline" onClick={() => setIsFilterOpen(true)}>
          Filters
        </Button>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle="No listings found in Others" />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
