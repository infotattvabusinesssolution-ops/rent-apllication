import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { Trophy } from 'lucide-react';

export const LuckyDrawWinners = () => {
  const { data: winnersData, isLoading } = useQuery({
    queryKey: ['adminLuckyDrawWinners'],
    queryFn: () => luckyDrawAdminApi.getWinners(),
  });

  const winners = winnersData?.data || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-500" />
          Lucky Draw Winners Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">Official system winners list and prize fulfillment overview.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <th className="px-6 py-3">Winning Ticket</th>
                <th className="px-4 py-3">Prize Title</th>
                <th className="px-4 py-3">Draw Campaign</th>
                <th className="px-4 py-3">Selected Date</th>
                <th className="px-4 py-3">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Loading winners...
                  </td>
                </tr>
              ) : winners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No winners selected yet.
                  </td>
                </tr>
              ) : (
                winners.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-bold text-amber-600">{w.ticketNumber}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">
                      {w.prizeId ? w.prizeId.title : 'First Prize'}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {w.luckyDrawId ? w.luckyDrawId.title : 'Draw'}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {w.winnerSelectedAt ? new Date(w.winnerSelectedAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        VERIFIED / PROCESSING
                      </span>
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
