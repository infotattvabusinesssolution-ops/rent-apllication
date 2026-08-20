import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { SearchBar } from '../components/marketplace/SearchBar';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Search } from 'lucide-react';
import { LocationSelectorModal } from '../components/marketplace/LocationSelectorModal';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'ALL';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: query,
    category: categoryParam,
    distanceKm: 50,
    sort: 'newest',
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ['searchResults', query, categoryParam, filters],
    queryFn: () => adsApi.getAds({ ...filters, search: query, category: categoryParam }),
  });

  const listings = (result?.data || []).filter((ad) => ad.status === 'APPROVED');


  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Search Results</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {query ? `"${query}"` : 'All Search Listings'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{listings.length} listings found</p>
          </div>

          <Button icon={SlidersHorizontal} variant="outline" onClick={() => setIsFilterOpen(true)}>
            Filters
          </Button>
        </div>

        <SearchBar
          onOpenLocation={() => setIsLocationOpen(true)}
          onOpenFilter={() => setIsFilterOpen(true)}
        />
      </div>

      <ListingGrid listings={listings} isLoading={isLoading} emptyTitle="No results match your search" />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </div>
  );
};
