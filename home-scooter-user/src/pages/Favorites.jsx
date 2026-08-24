import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '../api/favoritesApi';
import { useAuth } from '../context/AuthContext';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { EmptyState } from '../components/common/EmptyState';
import { Heart, ArrowLeft } from 'lucide-react';

export const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentUserId = user?.id || user?.userId || 'USR-8821';

  // Fetch favorited ads live from MongoDB
  const { data: result, isLoading } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoritesApi.getFavorites(user?.id || user?.userId || 'USR-3894'),
  });

  const favorites = result?.data || [];

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-2 sm:px-0 font-serif">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Saved Favorites
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Listings you have saved to compare or contact sellers later
          </p>
        </div>
      </div>

      {/* Content */}
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
