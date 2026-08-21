import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { Ticket, Search, Filter } from 'lucide-react';

export const LuckyDrawEntries = () => {
  const [ticketSearch, setTicketSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['adminLuckyDrawEntries', ticketSearch, page],
    queryFn: () =>
      luckyDrawAdminApi.getEntries({
        ticketNumber: ticketSearch || undefined,
        page,
        limit: 20,
      }),
  });

  const entries = entriesData?.data || [];
  const pagination = entriesData?.pagination || { total: 0, pages: 1 };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Ticket className="w-7 h-7 text-purple-600" />
          Lucky Draw Entry Tickets
        </h1>
        <p className="text-xs text-slate-500 mt-1">Audit valid participant tickets and order links.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Ticket Number (e.g. LD-2026-000001)..."
            value={ticketSearch}
            onChange={(e) => {
              setTicketSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <th className="px-6 py-3">Ticket Number</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Draw Campaign</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Purchased At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    Loading entries...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-bold text-purple-700">{entry.ticketNumber}</td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900">{entry.userName}</p>
                      <p className="text-[10px] text-slate-400">{entry.userPhone}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-medium">
                      {entry.luckyDrawId ? entry.luckyDrawId.title : 'Draw'}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800">₹{entry.amount}</td>
                    <td className="px-4 py-4 text-slate-500">
                      {new Date(entry.purchasedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {entry.isWinner ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          🏆 WINNER
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Entries: {pagination.total}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-slate-100 rounded-md disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {pagination.pages}
            </span>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-slate-100 rounded-md disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
