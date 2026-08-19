import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '../api/favoritesApi';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { EmptyState } from '../components/common/EmptyState';
import { Heart } from 'lucide-react';

export const Favorites = () => {
  const navigate = useNavigate();
  const { data: result, isLoading } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: favoritesApi.getFavorites,
  });

  const favorites = result?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Favorites</h1>
        <p className="text-xs text-slate-500 mt-0.5">Listings you have saved to compare or contact sellers later</p>
      </div>

      {!isLoading && favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorites Saved Yet"
          description="Click the heart icon on any plot, property, or EV scooter listing to save it here."
          actionText="Explore Marketplace"
          onAction={() => navigate('/')}
        />
      ) : (
        <ListingGrid listings={favorites} isLoading={isLoading} />
      )}
    </div>
  );
};
