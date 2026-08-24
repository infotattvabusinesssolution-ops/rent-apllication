import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { CATEGORIES } from '../constants/categories';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Wrench } from 'lucide-react';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';

export const Services = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: CATEGORIES.SERVICES, distanceKm: 50, sort: 'newest' });

  const { data: result, isLoading } = useQuery({
    queryKey: ['servicesPage', filters],
    queryFn: () => adsApi.getAds(filters),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Professional Services</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Interior design, rooftop solar panel setup, home maintenance, repairs, and architectural services.
          </p>
        </div>

        <Button icon={SlidersHorizontal} variant="outline" onClick={() => setIsFilterOpen(true)}>
          Filter Services
        </Button>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle="No services found" />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
