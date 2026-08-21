import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { luckyDrawUserApi } from '../../api/luckyDrawUserApi';
import { CountdownTimer } from '../../components/LuckyDraw/CountdownTimer';
import { Gift, Ticket, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';

export const LuckyDrawList = () => {
  const navigate = useNavigate();

  const { data: drawsData, isLoading } = useQuery({
    queryKey: ['userLuckyDrawsCatalog'],
    queryFn: () => luckyDrawUserApi.getDraws(),
  });

  const draws = drawsData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mb-2">
            <Gift className="w-4 h-4 text-purple-600" /> Official Platform Rewards
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Lucky Draw Campaigns</h1>
          <p className="text-xs text-slate-500 mt-1">
            Purchase entries to participate. Winners are automatically selected by system algorithm upon closing.
          </p>
        </div>

        <Link
          to="/my-lucky-draws"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Ticket className="w-4 h-4" /> My Tickets & Draws
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            Loading active campaigns...
          </div>
        ) : draws.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            No active lucky draws available right now. Check back soon!
          </div>
        ) : (
          draws.map((draw) => (
            <div
              key={draw._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100">
                {draw.bannerImage || draw.thumbnailImage ? (
                  <img
                    src={draw.bannerImage || draw.thumbnailImage}
                    alt={draw.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-800 to-indigo-600 text-white font-bold text-lg">
                    {draw.title}
                  </div>
                )}
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 shadow-xs">
                  ₹{draw.entryPrice} / Entry
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 bg-purple-900/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase">
                  {draw.status}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{draw.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {draw.shortDescription || 'Participate and get a chance to win amazing prizes.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Progress:</span>
                    <span className="font-bold text-purple-700">
                      {draw.totalEntries.toLocaleString()} / {draw.maxEntries.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round((draw.totalEntries / draw.maxEntries) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="pt-2">
                    <CountdownTimer targetDate={draw.endDate} />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/lucky-draw/${draw._id}`)}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-xs hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-500/10"
                >
                  BUY ENTRY NOW (₹{draw.entryPrice})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
