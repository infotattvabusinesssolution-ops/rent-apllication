import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PROPERTY_SUBCATEGORY_LIST } from '../constants/categories';
import { Building2, Home, ShoppingBag, Building, BedDouble, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';

export const Properties = () => {
  const navigate = useNavigate();

  const icons = {
    'Rent: House & Apartments': Home,
    'Rent: Shop & Offices': ShoppingBag,
    'Sale: House & Apartments': Building2,
    'Sale: Shop & Offices': Building,
    'PG & Guest House': BedDouble,
  };

  const descriptions = {
    'Rent: House & Apartments': 'Rental flats, independent houses, gated villas & apartments',
    'Rent: Shop & Offices': 'Commercial office spaces, retail shops, showrooms & warehouses for rent',
    'Sale: House & Apartments': 'Properties for sale, luxury flats, penthouses & independent houses',
    'Sale: Shop & Offices': 'Commercial real estate, office units & retail spaces for sale',
    'PG & Guest House': 'Paying guest accommodations, hostels, co-living spaces & guest houses',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Property Marketplace</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a property subcategory to browse residential and commercial listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPERTY_SUBCATEGORY_LIST.map((sub) => {
          const Icon = icons[sub] || Building2;
          return (
            <Card
              key={sub}
              hover
              onClick={() => navigate(`/properties/${encodeURIComponent(sub)}`)}
              className="p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sub}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {descriptions[sub]}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 mt-6 pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                <span>View Listings</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
