import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AdRejectModal } from '../components/ads/AdRejectModal';
import { CATEGORY_LIST } from '../constants/categories';
import { formatCurrency, timeAgo } from '../utils/formatters';
import { toast } from 'sonner';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';

export const PendingAds = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [rejectingAd, setRejectingAd] = useState(null);
  const [bulkApproveConfirmOpen, setBulkApproveConfirmOpen] = useState(false);

  const { data: pendingResult, isLoading } = useQuery({
    queryKey: ['pendingAds', category, search],
    queryFn: () => adsApi.getPendingAds({ category, search }),
  });

  const approveMutation = useMutation({
    mutationFn: adsApi.approveAd,
    onSuccess: () => {
      toast.success('Advertisement approved');
      queryClient.invalidateQueries(['pendingAds']);
      queryClient.invalidateQueries(['ads']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, notes }) => adsApi.rejectAd(id, reason, notes),
    onSuccess: () => {
      toast.success('Advertisement rejected');
      setRejectingAd(null);
      queryClient.invalidateQueries(['pendingAds']);
      queryClient.invalidateQueries(['ads']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const pendingList = pendingResult?.data || [];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(pendingList.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      await adsApi.approveAd(id);
    }
    toast.success(`${selectedIds.length} advertisements approved in bulk`);
    setSelectedIds([]);
    setBulkApproveConfirmOpen(false);
    queryClient.invalidateQueries(['pendingAds']);
    queryClient.invalidateQueries(['ads']);
    queryClient.invalidateQueries(['dashboardStats']);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Pending Approvals Queue</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              High priority moderation queue. Approve or reject newly submitted listings.
            </p>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
            <span className="text-xs font-bold text-blue-900">{selectedIds.length} selected</span>
            <Button size="sm" variant="success" onClick={() => setBulkApproveConfirmOpen(true)}>
              Approve Selected ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search pending ads by title, seller, phone..."
          className="w-full md:w-80"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-auto px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
        >
          <option value="ALL">All Categories</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* List / Cards */}
      {isLoading ? (
        <Card className="h-64 flex items-center justify-center">
          <p className="text-sm font-semibold text-slate-400">Loading pending moderation queue...</p>
        </Card>
      ) : pendingList.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All caught up!"
          description="There are currently no advertisements waiting for moderation approval."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-semibold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === pendingList.length && pendingList.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 rounded-md border-slate-300"
              />
              <span>Select all {pendingList.length} pending items</span>
            </label>
            <span>Showing {pendingList.length} listings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingList.map((ad) => (
              <Card key={ad.id} className="border-l-4 border-l-amber-500 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(ad.id)}
                        onChange={() => handleSelectOne(ad.id)}
                        className="w-4 h-4 text-blue-600 rounded-md border-slate-300"
                      />
                      <img
                        src={ad.imageUrls[0]}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            #{ad.id}
                          </span>
                          <span className="text-[11px] text-slate-400">{timeAgo(ad.postedAt)}</span>
                        </div>
                        <h4
                          onClick={() => navigate(`/ads/${ad.id}`)}
                          className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1 hover:text-blue-600 cursor-pointer"
                        >
                          {ad.title}
                        </h4>
                        <p className="text-xs font-black text-slate-900 mt-0.5">{formatCurrency(ad.price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600 mb-4">
                    <p className="flex justify-between">
                      <span className="font-semibold text-slate-700">Category:</span>
                      <Badge variant="teal" size="sm">{ad.category}</Badge>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-slate-700">Location:</span>
                      <span className="truncate max-w-[180px] text-slate-800">{ad.location}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-slate-700">Seller:</span>
                      <span className="text-slate-800 font-medium">{ad.posterName} ({ad.posterPhone})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/ads/${ad.id}`)}
                    className="flex-1"
                    icon={Eye}
                  >
                    Inspect
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setRejectingAd(ad)}
                    icon={XCircle}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => approveMutation.mutate(ad.id)}
                    isLoading={approveMutation.isPending}
                    icon={CheckCircle2}
                  >
                    Approve
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingAd && (
        <AdRejectModal
          isOpen={!!rejectingAd}
          onClose={() => setRejectingAd(null)}
          adTitle={rejectingAd.title}
          isLoading={rejectMutation.isPending}
          onConfirm={(reason, notes) =>
            rejectMutation.mutate({ id: rejectingAd.id, reason, notes })
          }
        />
      )}

      {/* Bulk Approve Dialog */}
      <ConfirmDialog
        isOpen={bulkApproveConfirmOpen}
        onClose={() => setBulkApproveConfirmOpen(false)}
        onConfirm={handleBulkApprove}
        title={`Approve ${selectedIds.length} Selected Advertisements?`}
        description="These listings will immediately become visible to all public marketplace users."
        confirmText="Approve All Selected"
        variant="primary"
      />
    </div>
  );
};
