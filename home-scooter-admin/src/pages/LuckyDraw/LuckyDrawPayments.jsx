import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { Receipt, Search } from 'lucide-react';

export const LuckyDrawPayments = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['adminLuckyDrawPayments', search, page],
    queryFn: () =>
      luckyDrawAdminApi.getPayments({
        search: search || undefined,
        page,
        limit: 20,
      }),
  });

  const orders = paymentsData?.data || [];
  const pagination = paymentsData?.pagination || { total: 0, pages: 1 };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="w-7 h-7 text-emerald-600" />
          Lucky Draw Orders & Payments
        </h1>
        <p className="text-xs text-slate-500 mt-1">Transaction logs and server verified payment records.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order Number or Gateway Payment ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
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
                <th className="px-6 py-3">Order Number</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Gateway Payment ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                    Loading payments...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900">{o.userName}</p>
                      <p className="text-[10px] text-slate-400">{o.userPhone}</p>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {o.luckyDrawId ? o.luckyDrawId.title : 'Draw'}
                    </td>
                    <td className="px-4 py-4 font-bold text-purple-700">{o.quantity}</td>
                    <td className="px-4 py-4 font-black text-slate-900">₹{o.amount}</td>
                    <td className="px-4 py-4 font-mono text-slate-500">{o.gatewayPaymentId || '-'}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.paymentStatus === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {new Date(o.createdAt).toLocaleString()}
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
