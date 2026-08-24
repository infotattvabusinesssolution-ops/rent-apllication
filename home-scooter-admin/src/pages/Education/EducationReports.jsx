import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { educationAdminApi } from '../../api/educationAdminApi';
import { toast } from 'sonner';
import {
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  Video,
  FileText,
  Clock,
  BookOpen,
} from 'lucide-react';

export const EducationReports = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['educationReports'],
    queryFn: () => educationAdminApi.getReports(),
  });

  const reports = data?.data || {};
  const activities = reports.activities || [];
  const topViewedContent = reports.topViewedContent || [];

  const handleExportCsv = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Student ID,Activity Type,Content ID,IP Address,User Agent,Timestamp\n';

      activities.forEach((a) => {
        csvContent += `"${a.studentId}","${a.activityType}","${a.contentId || ''}","${a.ipAddress || ''}","${(a.userAgent || '').replace(/"/g, '""')}","${new Date(a.createdAt).toLocaleString()}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `education_audit_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Activity audit report exported successfully!');
    } catch (err) {
      toast.error('Failed to export report CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Education Engagement Reports & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time student activity audit trail, top engaged educational content, video view metrics, and CSV exporter.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Audit Report CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Viewed Content */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Top 10 Most Viewed Content
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Content Title</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Format</th>
                  <th className="px-3 py-2 text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topViewedContent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400 italic">
                      No content view metrics recorded yet.
                    </td>
                  </tr>
                ) : (
                  topViewedContent.map((item) => (
                    <tr key={item.contentId}>
                      <td className="px-3 py-2 font-bold text-slate-900 line-clamp-1">{item.title}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600 font-semibold">{item.contentType}</td>
                      <td className="px-3 py-2 text-right font-black text-indigo-600">{item.viewsCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Student Audit Trail */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Recent Student Activity Audit Trail
          </h2>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No activity logs recorded yet</p>
            ) : (
              activities.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">Student ID: {act.studentId}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {act.contentId ? `Content ID: ${act.contentId}` : ''} {act.ipAddress ? `• IP: ${act.ipAddress}` : ''}
                    </p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {act.activityType}
                    </span>
                    <p className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
