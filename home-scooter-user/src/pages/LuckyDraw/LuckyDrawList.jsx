import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../../api/adsApi';
import { ListingCard } from '../../components/marketplace/ListingCard';
import { Gift, Sparkles, Layers } from 'lucide-react';

export const LuckyDrawList = () => {
  const navigate = useNavigate();

  const { data: adsData, isLoading } = useQuery({
    queryKey: ['luckyDrawEligibleAds'],
    queryFn: () => adsApi.getAds({ limit: 50 }),
  });

  const allAds = adsData?.data || adsData || [];
  const luckyDrawAds = allAds.filter(
    (ad) => ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-500/10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 fill-slate-950" /> Admin Approved Offers
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide leading-tight">
            Lucky Draw Product & Service Ads 🎁
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-serif leading-relaxed">
            Browse all verified listings participating in our exclusive Lucky Draw program. Tap on any ad to express interest and connect directly with Admin on WhatsApp!
          </p>
        </div>
      </div>

      {/* Grid of Lucky Draw Ads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-5 h-5 text-red-600" />
            Active Lucky Draw Listings ({luckyDrawAds.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : luckyDrawAds.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-base">No Active Lucky Draw Ads</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Currently there are no marketplace listings set to Lucky Draw by Admin. Check back soon!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-serif font-bold hover:bg-slate-800 transition-colors"
            >
              Browse All Marketplace Listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {luckyDrawAds.map((ad) => (
              <ListingCard key={ad.id || ad._id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

