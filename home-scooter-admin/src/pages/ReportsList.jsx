import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../api/reportsApi';
import { usersApi } from '../api/usersApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatDateTime } from '../utils/formatters';
import { toast } from 'sonner';
import { ShieldAlert, Eye, CheckCircle2, Trash2, Ban, AlertOctagon } from 'lucide-react';

export const ReportsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [inspectingReport, setInspectingReport] = useState(null);
  const [takedownConfirmOpen, setTakedownConfirmOpen] = useState(false);

  const { data: result, isLoading } = useQuery({
    queryKey: ['reports', search],
    queryFn: () => reportsApi.getReports({ search }),
  });

  const dismissMutation = useMutation({
    mutationFn: reportsApi.dismissReport,
    onSuccess: () => {
      toast.success('Report dismissed');
      setInspectingReport(null);
      queryClient.invalidateQueries(['reports']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const takedownMutation = useMutation({
    mutationFn: reportsApi.takeDownAdFromReport,
    onSuccess: () => {
      toast.success('Advertisement taken down and report resolved');
      setTakedownConfirmOpen(false);
      setInspectingReport(null);
      queryClient.invalidateQueries(['reports']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const reports = result?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Reported Advertisements Queue</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Investigate safety reports submitted by marketplace buyers for fraudulent or spam listings.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Pending Reports</span>
          <p className="text-2xl font-black text-red-900 mt-1">24 Active</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Under Review</span>
          <p className="text-2xl font-black text-slate-900 mt-1">8</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taken Down</span>
          <p className="text-2xl font-black text-slate-900 mt-1">42</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dismissed Reports</span>
          <p className="text-2xl font-black text-slate-900 mt-1">118</p>
        </Card>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search by ad title, seller, reporter..." className="max-w-md" />

      {/* Table */}
      {isLoading ? (
        <Card>
          <p className="text-xs text-slate-400 p-4">Loading safety reports...</p>
        </Card>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No active reports"
          description="Your moderation queue is completely clear. No reported ads require action."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Reported Ad</th>
                  <th className="py-3 px-4">Seller Info</th>
                  <th className="py-3 px-4">Reporter Info</th>
                  <th className="py-3 px-4">Report Reason</th>
                  <th className="py-3 px-4">Reported Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-[10px] font-bold text-red-600">#{rep.adId}</span>
                      <p
                        onClick={() => navigate(`/ads/${rep.adId}`)}
                        className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                      >
                        {rep.adTitle}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{rep.sellerName}</p>
                      <p className="text-[11px] text-slate-500">{rep.sellerPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{rep.reporterName}</p>
                      <p className="text-[11px] text-slate-500">{rep.reporterPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="danger">{rep.reportReason}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDateTime(rep.reportedDate)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={rep.status === 'Taken Down' ? 'danger' : rep.status === 'Dismissed' ? 'neutral' : 'warning'}>
                        {rep.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setInspectingReport(rep)}>
                        Review Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Report Modal */}
      {inspectingReport && (
        <Modal
          isOpen={!!inspectingReport}
          onClose={() => setInspectingReport(null)}
          title="Safety Report Moderation"
          subtitle={`Report ID: ${inspectingReport.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Reason: {inspectingReport.reportReason}</p>
                <p className="text-red-700 mt-1 italic">"{inspectingReport.comment}"</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Reported Listing:</span>
                <span
                  onClick={() => navigate(`/ads/${inspectingReport.adId}`)}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {inspectingReport.adTitle} (#{inspectingReport.adId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seller Name:</span>
                <span className="font-semibold text-slate-800">{inspectingReport.sellerName} ({inspectingReport.sellerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reporter:</span>
                <span className="font-semibold text-slate-800">{inspectingReport.reporterName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => dismissMutation.mutate(inspectingReport.id)}
                isLoading={dismissMutation.isPending}
              >
                Dismiss Report
              </Button>
              <Button
                variant="danger"
                className="flex-1 font-bold"
                onClick={() => setTakedownConfirmOpen(true)}
              >
                Take Down Ad
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Take Down Dialog */}
      {takedownConfirmOpen && (
        <ConfirmDialog
          isOpen={takedownConfirmOpen}
          onClose={() => setTakedownConfirmOpen(false)}
          onConfirm={() => takedownMutation.mutate(inspectingReport?.id)}
          title="Take Down Advertisement?"
          description="This listing will be unpublished immediately from public feeds due to safety violations."
          confirmText="Confirm Take Down"
          variant="danger"
          isLoading={takedownMutation.isPending}
        />
      )}
    </div>
  );
};
