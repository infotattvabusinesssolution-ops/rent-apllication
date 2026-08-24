import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { luckyDrawUserApi } from '../../api/luckyDrawUserApi';
import { Ticket, Trophy, Gift, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyLuckyDraws = () => {
  const { data: entriesData, isLoading: isEntriesLoading } = useQuery({
    queryKey: ['userMyLuckyDrawEntries'],
    queryFn: () => luckyDrawUserApi.getMyEntries(),
  });

  const { data: winnersData, isLoading: isWinnersLoading } = useQuery({
    queryKey: ['userMyLuckyDrawWinners'],
    queryFn: () => luckyDrawUserApi.getMyWinners(),
  });

  const entries = entriesData?.data || [];
  const winningEntries = winnersData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Ticket className="w-7 h-7 text-purple-600" /> My Lucky Draw Tickets
        </h1>
        <p className="text-xs text-slate-500 mt-1">Track all your purchased tickets, active draws, and winning status.</p>
      </div>

      {/* Winning Notification Banner if User Won Any Draw */}
      {winningEntries.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-slate-950" />
            <h2 className="font-black text-lg">🎉 Congratulations! You Have Won!</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {winningEntries.map((w) => (
              <div key={w._id} className="bg-white/90 p-4 rounded-xl shadow-xs">
                <span className="font-mono font-black text-purple-900 text-xs block">{w.ticketNumber}</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{w.prizeId ? w.prizeId.title : 'Lucky Draw Prize'}</p>
                <p className="text-xs text-slate-600">{w.luckyDrawId ? w.luckyDrawId.title : 'Campaign'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900">Purchased Tickets ({entries.length})</h2>
          <Link to="/lucky-draw" className="text-xs font-bold text-purple-600">
            + Buy More Tickets
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {isEntriesLoading ? (
            <div className="p-8 text-center text-slate-400">Loading your tickets...</div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Gift className="w-10 h-10 mx-auto text-slate-300" />
              <p>You have not purchased any lucky draw entries yet.</p>
              <Link
                to="/lucky-draw"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs"
              >
                Browse Active Lucky Draws
              </Link>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                    LD
                  </div>
                  <div>
                    <span className="font-mono font-bold text-purple-700 text-sm">{entry.ticketNumber}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                      {entry.luckyDrawId ? entry.luckyDrawId.title : 'Lucky Draw'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Purchased on: {new Date(entry.purchasedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.isWinner
                          ? 'bg-amber-100 text-amber-800'
                          : entry.status === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {entry.isWinner ? '🏆 WINNER' : entry.status}
                    </span>
                  </div>

                  {entry.luckyDrawId && (
                    <Link
                      to={`/lucky-draw/${entry.luckyDrawId._id}`}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 text-xs"
                    >
                      View Draw
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
