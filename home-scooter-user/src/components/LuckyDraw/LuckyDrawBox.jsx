import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { luckyDrawUserApi } from '../../api/luckyDrawUserApi';
import { CountdownTimer } from './CountdownTimer';
import { Gift, Sparkles, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';

export const LuckyDrawBox = () => {
  const navigate = useNavigate();

  const { data: drawsData, isLoading } = useQuery({
    queryKey: ['userHomepageLuckyDraws'],
    queryFn: () => luckyDrawUserApi.getDraws({ limit: 1 }),
  });

  const draws = drawsData?.data || [];
  const draw = draws.length > 0 ? draws[0] : null;

  if (isLoading || !draw) {
    return null; // Silent fallback if no active draws exist
  }

  return (
    <section className="my-8 px-4 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white p-6 md:p-8 shadow-2xl border border-purple-500/20">
        {/* Subtle Background Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4 text-amber-400" />
              Official Lucky Draw Box
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {draw.title}
            </h2>

            <p className="text-xs sm:text-sm text-purple-200 line-clamp-2 max-w-xl">
              {draw.shortDescription || 'Participate now in our official system lucky draw and win big rewards!'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div>
                <span className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold block">Entry Price</span>
                <span className="text-xl font-black text-amber-400">₹{draw.entryPrice}</span>
              </div>

              <div className="h-8 w-px bg-purple-800/60 hidden sm:block" />

              <div>
                <span className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold block">Entries Issued</span>
                <span className="text-sm font-bold text-white">
                  {draw.totalEntries.toLocaleString()} <span className="text-purple-400 text-xs">/ {draw.maxEntries.toLocaleString()}</span>
                </span>
              </div>

              <div className="h-8 w-px bg-purple-800/60 hidden sm:block" />

              <div>
                <span className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold block">Ends In</span>
                <CountdownTimer targetDate={draw.endDate} />
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={() => navigate(`/lucky-draw/${draw._id}`)}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              >
                <Ticket className="w-4 h-4" />
                ENTER DRAW NOW (₹{draw.entryPrice})
              </button>

              <Link
                to="/lucky-draw"
                className="px-4 py-3 text-xs font-bold text-purple-200 hover:text-white flex items-center gap-1.5"
              >
                View All Draws <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Banner Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-800 aspect-video lg:aspect-4/3">
              {draw.bannerImage || draw.thumbnailImage ? (
                <img
                  src={draw.bannerImage || draw.thumbnailImage}
                  alt={draw.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-900 text-white font-bold">
                  Lucky Draw
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] font-semibold text-purple-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Automated Winner Selection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
