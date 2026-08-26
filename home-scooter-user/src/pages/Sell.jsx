import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { PlusCircle, ChevronRight } from 'lucide-react';

export const Sell = () => {
  const navigate = useNavigate();

  const { data: categoriesFromApi } = useQuery({
    queryKey: ['userCategories'],
    queryFn: () => categoryApi.getCategories(),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const categories = Array.isArray(categoriesFromApi) && categoriesFromApi.length > 0
    ? categoriesFromApi
        .filter((c) => {
          if (c.isActive === false) return false;
          if (!c.parent || c.parent === 'None (Main Category)' || c.parent === 'None' || c.parent.trim() === '') return true;
          if (Array.isArray(c.subCategories) && c.subCategories.length > 0) return true;
          const standardMains = ['properties', 'bikes', 'jobs', 'services', 'layout sites', 'electric scooters', 'others'];
          if (standardMains.includes(c.name.trim().toLowerCase())) return true;
          const isChildOfExisting = categoriesFromApi.some(
            (other) => other.name.trim().toLowerCase() === c.parent.trim().toLowerCase() && other.name.trim().toLowerCase() !== c.name.trim().toLowerCase()
          );
          return !isChildOfExisting;
        })
        .map((c) => ({
          title: c.name,
          desc: c.description || `Post listings and offers under ${c.name}`,
          icon: c.icon || '📦',
          bg: c.name.includes('Layout')
            ? 'bg-[#fffbeb]'
            : c.name.includes('Scooter')
            ? 'bg-[#fefce8]'
            : c.name.includes('Services')
            ? 'bg-[#faf5ff]'
            : c.name.includes('Properties')
            ? 'bg-[#f0f6ff]'
            : 'bg-[#f0fdf4]',
          arrowColor: c.name.includes('Layout')
            ? 'text-amber-700'
            : c.name.includes('Services')
            ? 'text-purple-600'
            : 'text-blue-600',
          categoryParam: c.name,
        }))
    : [
        {
          title: 'Sell Layout Site / Land',
          desc: 'Post plots, agricultural land & sites',
          icon: '🗺️',
          bg: 'bg-[#fffbeb]',
          arrowColor: 'text-amber-700',
          categoryParam: 'Layout Sites',
        },
        {
          title: 'Sell / Rent Properties',
          desc: 'Houses, flats, shops, offices, PGs & commercial properties',
          icon: '🏢',
          bg: 'bg-[#f0f6ff]',
          arrowColor: 'text-blue-600',
          categoryParam: 'Properties',
        },
        {
          title: 'Sell Bikes & Products',
          desc: 'Motorcycles, scooters, bicycles & spare parts',
          icon: '🏍️',
          bg: 'bg-[#f0fdf4]',
          arrowColor: 'text-emerald-600',
          categoryParam: 'Bikes',
        },
        {
          title: 'Post Jobs & Hiring',
          desc: 'Telecaller, Data Entry, Sales, Drivers & Delivery',
          icon: '💼',
          bg: 'bg-[#faf5ff]',
          arrowColor: 'text-purple-600',
          categoryParam: 'Jobs',
        },
        {
          title: 'Rent / Sell EV Scooter',
          desc: 'Electric scooters, bikes & rental fleets',
          icon: '🛵',
          bg: 'bg-[#fefce8]',
          arrowColor: 'text-amber-700',
          categoryParam: 'Electric Scooters',
        },
        {
          title: 'Offer Professional Service',
          desc: 'Interiors, architecture & maintenance',
          icon: '🛠️',
          bg: 'bg-[#faf5ff]',
          arrowColor: 'text-purple-600',
          categoryParam: 'Services',
        },
        {
          title: 'Other Products & Services',
          desc: 'General products & promotional ads',
          icon: '📦',
          bg: 'bg-[#f8fafc]',
          arrowColor: 'text-slate-600',
          categoryParam: 'Others',
        },
      ];


  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-1 sm:px-0">
      {/* Title Header */}
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-1">
        Sell & Advertise
      </h1>

      {/* Hero Promo Card */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-lg shadow-blue-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
            Reach 50,000+ Buyers
          </h2>
        </div>
        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-serif font-light">
          Post your property, scooter, or service ad and start receiving verified callback requests instantly.
        </p>
        <button
          onClick={() => navigate('/create-ad')}
          className="w-full bg-white hover:bg-blue-50 text-blue-600 font-serif font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <PlusCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span>+ Post New Ad Now</span>
        </button>
      </div>

      {/* Select Selling Category Section */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-slate-900 pt-2">
          Select Selling Category
        </h2>

        <div className="space-y-3.5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              onClick={() => navigate(`/create-ad?category=${encodeURIComponent(cat.categoryParam)}`)}
              className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all group"
            >

              {/* Left Icon */}
              <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl shrink-0 border border-slate-100/50`}>
                <span className="select-none">{cat.icon}</span>
              </div>

              {/* Middle Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-400 text-xs font-light mt-0.5 leading-normal">
                  {cat.desc}
                </p>
              </div>

              {/* Right Chevron */}
              <ChevronRight className={`w-5 h-5 ${cat.arrowColor} shrink-0`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
