import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { CATEGORIES } from '../constants/categories';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Bike } from 'lucide-react';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';

export const ElectricScooters = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: CATEGORIES.ELECTRIC_SCOOTERS, distanceKm: 50, sort: 'newest' });

  const { data: result, isLoading } = useQuery({
    queryKey: ['scootersPage', filters],
    queryFn: () => adsApi.getAds(filters),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <Bike className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Electric Scooters (EV Marketplace)</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse Ather, Ola, TVS iQube, Hero Vida electric scooters for sale, daily & monthly rentals.
          </p>
        </div>

        <Button icon={SlidersHorizontal} variant="outline" onClick={() => setIsFilterOpen(true)}>
          Filter EVs
        </Button>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle="No EV scooters found" />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
