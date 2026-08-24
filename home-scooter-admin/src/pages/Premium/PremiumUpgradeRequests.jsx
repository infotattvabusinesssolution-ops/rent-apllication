import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { premiumAdminApi } from '../../api/premiumAdminApi';
import { toast } from 'sonner';
import {
  Ticket,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const PremiumUpgradeRequests = () => {
  const queryClient = useQueryClient();
  const [requestStatus, setRequestStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [customPassword, setCustomPassword] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Payment verification failed');

  const { data, isLoading } = useQuery({
    queryKey: ['premiumAdminUpgradeRequests', requestStatus, search],
    queryFn: () => premiumAdminApi.getUpgradeRequests({ requestStatus, search }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, customPassword }) =>
      premiumAdminApi.approveUpgradeRequest(id, { customPassword }),
    onSuccess: (res) => {
      toast.success(
        `Upgrade Request Approved! Member ID: ${res.premiumMemberId} | Password: ${res.generatedPassword}`
      );
      setIsApproveModalOpen(false);
      setCustomPassword('');
      queryClient.invalidateQueries(['premiumAdminUpgradeRequests']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve request'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      premiumAdminApi.rejectUpgradeRequest(id, { reason }),
    onSuccess: () => {
      toast.success('Upgrade request rejected');
      setIsRejectModalOpen(false);
      queryClient.invalidateQueries(['premiumAdminUpgradeRequests']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reject request'),
  });

  const requests = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            ⭐ Premium Upgrade Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review user upgrade applications, verify payment proofs, and approve Premium Member accounts.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setRequestStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                requestStatus === status
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No upgrade requests found</p>
            <p className="text-xs text-slate-400">Incoming requests from normal users will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Applicant Details</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Reference & Proof</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-slate-900">{req.userName}</p>
                        <p className="text-[11px] text-slate-500">{req.userPhone}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Req ID: {req.requestId}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-md text-[10px]">
                        {req.plan}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-bold text-emerald-600">₹{req.amount}</td>

                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-mono text-slate-800 font-bold text-[11px]">{req.paymentReference}</p>
                        {req.paymentScreenshot && (
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsPreviewOpen(true);
                            }}
                            className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View Proof Screenshot
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.requestStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        req.requestStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.requestStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      {req.requestStatus === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsApproveModalOpen(true);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsRejectModalOpen(true);
                            }}
                            className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[11px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Processed by {req.approvedBy || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Payment Screenshot */}
      {isPreviewOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Payment Screenshot Proof</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-auto rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center">
              <img
                src={selectedRequest.paymentScreenshot}
                alt="Payment Proof"
                className="max-w-full max-h-80 object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Approve Request */}
      {isApproveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Approve Premium Upgrade
              </h3>
              <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
              <p className="font-bold text-slate-900">Applicant: {selectedRequest.userName}</p>
              <p className="text-slate-600">Phone: {selectedRequest.userPhone}</p>
              <p className="text-slate-600">Selected Plan: <span className="font-bold text-amber-600">{selectedRequest.plan}</span></p>
              <p className="text-slate-600">Amount Paid: <span className="font-bold text-emerald-600">₹{selectedRequest.amount}</span></p>
              <p className="text-slate-600">UPI Ref: <span className="font-mono">{selectedRequest.paymentReference}</span></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Set Password (Optional)</label>
              <input
                type="text"
                placeholder="Leave blank to auto-generate (Pass#XXXX)"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                The backend will generate a unique Premium Member ID (PREM-2026-XXXXX) and calculate the expiry date.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  approveMutation.mutate({ id: selectedRequest.requestId, customPassword })
                }
                disabled={approveMutation.isPending}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
              >
                {approveMutation.isPending ? 'Activating...' : 'Approve & Activate Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reject Request */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-rose-700">Reject Upgrade Request</h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rejection Reason</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  rejectMutation.mutate({ id: selectedRequest.requestId, reason: rejectionReason })
                }
                disabled={rejectMutation.isPending}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
