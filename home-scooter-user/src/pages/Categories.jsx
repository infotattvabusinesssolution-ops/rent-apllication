import React from 'react';
import { CategoryCard } from '../components/marketplace/CategoryCard';
import { CATEGORIES } from '../constants/categories';

export const Categories = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Marketplace Directory</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a category to discover active listings and verified offers around you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Object.values(CATEGORIES).map((cat) => (
          <CategoryCard key={cat} category={cat} />
        ))}
      </div>
    </div>
  );
};
