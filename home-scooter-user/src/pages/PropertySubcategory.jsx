import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { CATEGORIES } from '../constants/categories';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Button } from '../components/common/Button';
import { SlidersHorizontal } from 'lucide-react';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';

export const PropertySubcategory = () => {
  const { subcategory } = useParams();
  const decodedSub = decodeURIComponent(subcategory || '');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: CATEGORIES.PROPERTIES,
    propertySubType: decodedSub,
    distanceKm: 50,
    sort: 'newest',
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ['propertySubcategory', decodedSub, filters],
    queryFn: () => adsApi.getAds({ ...filters, propertySubType: decodedSub }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Properties & Real Estate</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">{decodedSub}</h1>
          <p className="text-xs text-slate-500 mt-1">Verified property listings matching {decodedSub}</p>
        </div>

        <Button icon={SlidersHorizontal} variant="outline" onClick={() => setIsFilterOpen(true)}>
          Filters
        </Button>
      </div>

      <ListingGrid listings={result?.data || []} isLoading={isLoading} emptyTitle={`No listings found in ${decodedSub}`} />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};
