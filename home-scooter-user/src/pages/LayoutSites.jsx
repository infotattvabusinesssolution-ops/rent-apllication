import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { CATEGORIES } from '../constants/categories';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Map } from 'lucide-react';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';

export const LayoutSites = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: CATEGORIES.LAYOUT_SITES, distanceKm: 50, sort: 'newest' });

  const { data: result, isLoading } = useQuery({
    queryKey: ['layoutSites', filters],
    queryFn: () => adsApi.getAds(filters),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Layout Sites & Plots</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore verified residential plots, BDA approved layout sites, DC converted land, and gated community plots.
          </p>
        </div>

        <Button icon={SlidersHorizontal} variant="outline" onClick={() => setIsFilterOpen(true)}>
          Filter Plots
        </Button>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle="No layout sites found" />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
