import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { CategoryCard } from '../components/marketplace/CategoryCard';
import { CATEGORIES } from '../constants/categories';

export const Categories = () => {
  const { data: categories } = useQuery({
    queryKey: ['userCategories'],
    queryFn: () => categoryApi.getCategories(),
  });

  const categoriesList = Array.isArray(categories) && categories.length > 0
    ? categories.map((c) => c.name)
    : Object.values(CATEGORIES);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Marketplace Directory</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a category to discover active listings and verified offers around you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categoriesList.map((cat) => (
          <CategoryCard key={cat} category={cat} />
        ))}
      </div>
    </div>
  );
};

