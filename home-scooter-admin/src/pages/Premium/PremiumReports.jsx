import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { premiumAdminApi } from '../../api/premiumAdminApi';
import { BarChart3, Eye, ShieldCheck, Activity } from 'lucide-react';

export const PremiumReports = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['premiumAdminReports'],
    queryFn: () => premiumAdminApi.getReports(),
  });

  const activities = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            ⭐ Premium Activity & Audit Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track member login events, content view activities, and security session logs in real time.
          </p>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Audit Log Feed ({activities.length} entries)
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-12">No activity logs recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Member ID</th>
                  <th className="px-4 py-3">Activity Type</th>
                  <th className="px-4 py-3">Content ID</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {activities.map((act, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{act.memberId}</td>

                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        act.activityType === 'LOGIN' ? 'bg-emerald-100 text-emerald-700' :
                        act.activityType === 'LOGOUT' ? 'bg-slate-100 text-slate-600' :
                        act.activityType === 'VIDEO_VIEW' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {act.activityType}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-500">{act.contentId || '—'}</td>

                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{act.ipAddress || 'Client'}</td>

                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {new Date(act.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
