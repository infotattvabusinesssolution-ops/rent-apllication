import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { SearchBar } from '../components/marketplace/SearchBar';
import { FeaturedCarousel } from '../components/marketplace/FeaturedCarousel';
import { CategoryCard } from '../components/marketplace/CategoryCard';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { LocationSelectorModal } from '../components/marketplace/LocationSelectorModal';
import { FilterDrawer } from '../components/marketplace/FilterDrawer';
import { CATEGORIES, PROPERTY_SUBCATEGORY_LIST } from '../constants/categories';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Sparkles, MapPin, ArrowRight, ShieldCheck, Crown, Flame, Clock } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: 'ALL', distanceKm: 50, sort: 'newest' });

  const { data: adsResult, isLoading } = useQuery({
    queryKey: ['homeAds'],
    queryFn: () => adsApi.getAds(),
  });

  const ads = adsResult?.data || [];
  const layoutSites = ads.filter((a) => a.category === CATEGORIES.LAYOUT_SITES).slice(0, 4);
  const scooters = ads.filter((a) => a.category === CATEGORIES.ELECTRIC_SCOOTERS).slice(0, 4);

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-6 sm:p-10 md:p-12 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Bangalore's #1 Property & EV Scooter Marketplace</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Find Your Perfect Place, Property or EV Scooter
          </h1>

          <p className="text-xs sm:text-base text-blue-100/90 font-medium leading-relaxed max-w-2xl">
            Discover verified plots, rental homes, electric scooters & local services around you. Buy, rent, sell and connect with trusted sellers directly.
          </p>

          <div className="pt-2">
            <SearchBar
              onOpenLocation={() => setIsLocationOpen(true)}
              onOpenFilter={() => setIsFilterOpen(true)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-100 pt-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Sellers</span>
            <span className="flex items-center gap-1.5"><Crown className="w-4 h-4 text-amber-300" /> ₹100 Ad-Free Membership</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-300" /> Near Me Radius Filter</span>
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      <section>
        <FeaturedCarousel listings={ads} />
      </section>

      {/* Top Level Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">Browse verified marketplace listings by category</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/categories')}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.values(CATEGORIES).map((cat) => (
            <CategoryCard key={cat} category={cat} />
          ))}
        </div>
      </section>

      {/* Property Subcategories Bar */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-6 rounded-2xl border border-blue-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Popular Property Types</h3>
            <p className="text-xs text-slate-500">Rentals, sales, shops, offices and PG listings</p>
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {PROPERTY_SUBCATEGORY_LIST.map((sub) => (
            <button
              key={sub}
              onClick={() => navigate(`/properties/${encodeURIComponent(sub)}`)}
              className="px-4 py-2.5 bg-white hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200/80 shadow-xs transition-all shrink-0 cursor-pointer"
            >
              {sub}
            </button>
          ))}
        </div>
      </section>

      {/* Layout Sites Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Featured Layout Sites & Plots</h2>
            <p className="text-xs text-slate-500">Gated community plots, DC converted land & sites</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/categories/layout-sites')}>
            See All Plots
          </Button>
        </div>

        <ListingGrid listings={layoutSites} isLoading={isLoading} />
      </section>

      {/* Electric Scooters Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Electric Scooters (EV Rentals & Sales)</h2>
            <p className="text-xs text-slate-500">Ather, Ola, TVS iQube & high speed rentals</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/categories/electric-scooters')}>
            See All EVs
          </Button>
        </div>

        <ListingGrid listings={scooters} isLoading={isLoading} />
      </section>

      {/* Visitor Win Promotional Banner */}
      <section>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <Badge variant="warning">Special Promo</Badge>
            <h3 className="text-xl sm:text-2xl font-black">Visitor Win Event 2026</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Register now for your opportunity to participate in our exclusive visitor contest and win special prizes!
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/visitor-win')}
            className="shrink-0 bg-white text-emerald-800 hover:bg-emerald-50 font-black"
          >
            Register Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* ₹100 Subscription Membership Card */}
      <section>
        <Card className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-400/30">
              <Crown className="w-4 h-4" /> Subscriber Exclusive
            </div>
            <h3 className="text-2xl font-black">Become a Member for Just ₹100/-</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Unlock 10 Days (3 + 7 Days) of 100% Advertisement-Free marketplace browsing, direct WhatsApp updates, personal credentials, and priority callback access.
            </p>
          </div>
          <Button
            size="lg"
            variant="success"
            onClick={() => navigate('/subscription')}
            className="shrink-0 font-black"
          >
            Subscribe for ₹100
          </Button>
        </Card>
      </section>

      {/* Location & Filter Modals */}
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => navigate(`/search?category=${filters.category}&distance=${filters.distanceKm}`)}
      />
    </div>
  );
};
