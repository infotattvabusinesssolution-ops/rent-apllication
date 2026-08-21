import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import {
  Gift,
  Ticket,
  IndianRupee,
  Trophy,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const LuckyDrawDashboard = () => {
  const navigate = useNavigate();

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['luckyDrawStatsOverview'],
    queryFn: () => luckyDrawAdminApi.getOverviewStats(),
  });

  const { data: drawsData, isLoading: isDrawsLoading } = useQuery({
    queryKey: ['luckyDrawsActiveList'],
    queryFn: () => luckyDrawAdminApi.getDraws({ limit: 10 }),
  });

  const stats = statsData?.data || {
    totalDraws: 0,
    activeDraws: 0,
    upcomingDraws: 0,
    completedDraws: 0,
    totalEntries: 0,
    totalRevenue: 0,
    totalWinners: 0,
    pendingVerificationWinners: 0,
  };

  const draws = drawsData?.data || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-7 h-7 text-purple-600" />
            Lucky Draw Box Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive oversight, automated winner selection, entries, and revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/lucky-draw/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Lucky Draw
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Lucky Draws</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalDraws}</h3>
            <p className="text-[11px] font-medium text-emerald-600 mt-1">{stats.activeDraws} Active Now</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Valid Entries</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalEntries.toLocaleString()}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Paid Tickets Generated</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Draw Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-[11px] font-medium text-emerald-600 mt-1">100% Server Verified</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Winners</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalWinners}</h3>
            <p className="text-[11px] font-medium text-amber-600 mt-1">
              {stats.pendingVerificationWinners} Pending Verification
            </p>
          </div>
        </div>
      </div>

      {/* Active Draws Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Lucky Draws</h2>
            <p className="text-xs text-slate-500">Manage campaign schedules, prizes, and draw executions.</p>
          </div>
          <Link to="/lucky-draw" className="text-xs font-bold text-purple-600 hover:text-purple-700">
            View All Draws →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-3">Draw Campaign</th>
                <th className="px-4 py-3">Entry Price</th>
                <th className="px-4 py-3">Entries Sold</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isDrawsLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    Loading draws...
                  </td>
                </tr>
              ) : draws.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    No active lucky draw campaigns found. Create your first draw!
                  </td>
                </tr>
              ) : (
                draws.map((draw) => (
                  <tr key={draw._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {draw.thumbnailImage || draw.bannerImage ? (
                          <img
                            src={draw.thumbnailImage || draw.bannerImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                            LD
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 truncate max-w-xs">{draw.title}</p>
                          <p className="text-[11px] text-slate-400">Max: {draw.maxEntries.toLocaleString()} entries</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800">
                      ₹{draw.entryPrice}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-purple-700">{draw.totalEntries}</span>
                      <span className="text-slate-400"> / {draw.maxEntries}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {new Date(draw.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          draw.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : draw.status === 'CLOSED'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : draw.status === 'WINNER_SELECTED' || draw.status === 'VERIFIED'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : draw.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {draw.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/lucky-draw/${draw._id}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
