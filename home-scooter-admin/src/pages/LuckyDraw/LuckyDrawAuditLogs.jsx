import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { History, Eye, X, Code } from 'lucide-react';

export const LuckyDrawAuditLogs = () => {
  const [selectedLog, setSelectedLog] = useState(null);

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['adminLuckyDrawAuditLogs'],
    queryFn: () => luckyDrawAdminApi.getAuditLogs({ limit: 50 }),
  });

  const logs = logsData?.data || [];

  const renderMetadataSummary = (metadata) => {
    if (!metadata || typeof metadata !== 'object' || Object.keys(metadata).length === 0) {
      return <span className="text-slate-400 font-sans italic">No metadata payload</span>;
    }

    const entries = Object.entries(metadata);

    return (
      <div className="flex flex-wrap items-center gap-1.5 font-sans py-1">
        {entries.slice(0, 4).map(([key, val]) => {
          let displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          if (displayVal.length > 22) displayVal = displayVal.slice(0, 20) + '...';

          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 leading-none"
            >
              <span className="font-semibold text-slate-500">{key}:</span>
              <span className="font-bold text-purple-700">{displayVal}</span>
            </span>
          );
        })}

        {entries.length > 4 && (
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200/80 leading-none">
            +{entries.length - 4} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-7 h-7 text-indigo-600" />
          Lucky Draw Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable audit record of lucky draw creations, payment events, ticket creations, and winner selection algorithms.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <th className="px-6 py-4 w-44 whitespace-nowrap">Timestamp</th>
                <th className="px-4 py-4 w-56 whitespace-nowrap">Action Event</th>
                <th className="px-4 py-4 w-36 whitespace-nowrap">Performed By</th>
                <th className="px-6 py-4 min-w-[320px]">Metadata Details</th>
                <th className="px-6 py-4 w-20 text-right whitespace-nowrap">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Loading audit log records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No audit log records recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors align-middle">
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px] whitespace-nowrap align-middle">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span className="inline-block font-bold text-purple-700 font-mono text-[11px] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/80 whitespace-nowrap">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-semibold whitespace-nowrap align-middle">
                      {log.performedBy}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {renderMetadataSummary(log.metadata)}
                    </td>
                    <td className="px-6 py-4 text-right align-middle whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Inspect full JSON payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Audit Event Metadata Payload</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Action Event:</span>
                  <span className="font-mono font-bold text-purple-700">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp:</span>
                  <span className="font-mono text-slate-700">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Full Formatted Metadata JSON:</span>
                <pre className="bg-slate-900 text-purple-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
