import React from 'react';
import { ListingCard } from './ListingCard';
import { ListingCardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

export const ListingGrid = ({
  listings = [],
  isLoading = false,
  emptyTitle = 'No listings found',
  emptyDescription = 'Try changing your location or filters to find active listings.',
  columns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  onFavoriteToggle,
}) => {
  if (isLoading) {
    return (
      <div className={`grid ${columns} gap-4 sm:gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={`grid ${columns} gap-4 sm:gap-6`}>
      {listings.map((ad) => (
        <ListingCard key={ad.id} ad={ad} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
};
