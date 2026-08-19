import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />;
};

export const ListingCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden space-y-3 p-3">
      <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
};
