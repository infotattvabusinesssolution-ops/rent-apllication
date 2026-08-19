import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Card } from '../components/common/Card';
import { MapPin, Navigation, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NearMe = () => {
  const { selectedLocation } = useAuth();
  const [distanceKm, setDistanceKm] = useState(10);

  const { data: result, isLoading } = useQuery({
    queryKey: ['nearMeAds', distanceKm],
    queryFn: () => adsApi.getAds({ distanceKm }),
  });

  const listings = result?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Nearby Radar Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Explore Listings Near You</h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
          Showing plots, properties & scooters located within <strong className="text-emerald-400 font-extrabold">{distanceKm} km</strong> of {selectedLocation}.
        </p>

        {/* Range Slider */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2 max-w-xl">
          <div className="flex justify-between text-xs font-bold">
            <span>Distance Radius Filter</span>
            <span className="text-emerald-400 font-black">{distanceKm} KM Radius</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] text-blue-200 font-semibold">
            <span>1 km</span>
            <span>10 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>
      </div>

      {/* Map Radar Visual Abstraction */}
      <Card className="bg-slate-900 text-white p-6 rounded-3xl border-slate-800 relative overflow-hidden min-h-[220px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        
        {/* Animated Radar Circle */}
        <div className="absolute w-64 h-64 rounded-full border border-teal-500/30 animate-ping opacity-25 pointer-events-none" />
        <div className="absolute w-40 h-40 rounded-full border border-blue-500/40 pointer-events-none" />
        <div className="w-4 h-4 rounded-full bg-blue-500 ring-8 ring-blue-500/30 z-10 animate-bounce" />

        {/* Floating Pins */}
        <div className="absolute top-10 left-16 bg-slate-800/90 text-teal-400 border border-teal-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <MapPin className="w-3 h-3" /> 1.2 km • Hoskote Plot
        </div>
        <div className="absolute bottom-12 right-20 bg-slate-800/90 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <MapPin className="w-3 h-3" /> 2.5 km • Ather EV
        </div>
        <div className="absolute top-14 right-16 bg-slate-800/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <MapPin className="w-3 h-3" /> 4.8 km • 3 BHK Flat
        </div>

        <div className="relative z-10 text-center space-y-1 mt-20 sm:mt-0">
          <p className="text-xs font-bold text-slate-400">Interactive Location Radar</p>
          <p className="text-sm font-black text-white">{listings.length} Listings Found within {distanceKm} KM</p>
        </div>
      </Card>

      {/* Grid */}
      <ListingGrid listings={listings} isLoading={isLoading} emptyTitle={`No listings within ${distanceKm} km`} />
    </div>
  );
};
