import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Building2, Bike, Wrench, Package, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';

export const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const config = {
    [CATEGORIES.LAYOUT_SITES]: {
      icon: Map,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600',
      desc: 'Plots, land layouts, DC converted & gated sites',
      route: '/categories/layout-sites',
    },
    [CATEGORIES.PROPERTIES]: {
      icon: Building2,
      color: 'from-teal-600 to-emerald-600',
      bgLight: 'bg-teal-50 text-teal-600',
      desc: 'Houses, apartments, shops, offices & PGs',
      route: '/categories/properties',
    },
    [CATEGORIES.ELECTRIC_SCOOTERS]: {
      icon: Bike,
      color: 'from-emerald-600 to-green-600',
      bgLight: 'bg-emerald-50 text-emerald-600',
      desc: 'EV rentals, high-speed scooters & monthly setups',
      route: '/categories/electric-scooters',
    },
    [CATEGORIES.SERVICES]: {
      icon: Wrench,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-600',
      desc: 'Interior design, maintenance, repairs & solar',
      route: '/categories/services',
    },
    [CATEGORIES.OTHERS]: {
      icon: Package,
      color: 'from-slate-600 to-slate-800',
      bgLight: 'bg-slate-100 text-slate-700',
      desc: 'Promotional listings & miscellaneous items',
      route: '/categories/others',
    },
  };

  const item = config[category] || config[CATEGORIES.OTHERS];
  const Icon = item.icon;

  return (
    <div
      onClick={() => navigate(item.route)}
      className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className={`w-12 h-12 rounded-2xl ${item.bgLight} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
          {category}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {item.desc}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs font-bold text-blue-600 mt-4 pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
        <span>Explore Category</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};
