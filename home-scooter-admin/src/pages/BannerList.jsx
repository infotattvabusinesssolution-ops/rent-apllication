import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bannerApi } from '../api/bannerApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { BANNER_STATUS_BADGES, REJECTION_REASONS } from '../constants/categories';
import { formatNumber } from '../utils/formatters';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  Phone,
  Clock,
  Maximize2,
  AlertTriangle,
} from 'lucide-react';

export const BannerList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentTab, setCurrentTab] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);
  const [rejectingBanner, setRejectingBanner] = useState(null);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [lightboxImage, setLightboxImage] = useState(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ['banners', currentTab],
    queryFn: () => bannerApi.getBanners({ status: currentTab }),
  });

  const approveMutation = useMutation({
    mutationFn: bannerApi.approveBanner,
    onSuccess: () => {
      toast.success('Banner campaign approved and activated!');
      queryClient.invalidateQueries(['banners']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => bannerApi.rejectBanner(id, reason),
    onSuccess: () => {
      toast.success('Banner campaign rejected');
      setRejectingBanner(null);
      queryClient.invalidateQueries(['banners']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bannerApi.deleteBanner,
    onSuccess: () => {
      toast.success('Banner campaign deleted');
      setDeletingId(null);
      queryClient.invalidateQueries(['banners']);
    },
  });

  const banners = result?.data || [];
  const pendingBannersCount = banners.filter((b) => b.status === 'Pending').length;
  const activeCount = banners.filter((b) => b.status === 'Active').length;
  const totalImpressions = banners.reduce((acc, b) => acc + (b.impressions || 0), 0);

  const tabs = [
    { id: 'ALL', label: 'All Campaigns' },
    { id: 'Pending', label: 'Pending Approval', badge: pendingBannersCount > 0 ? `${pendingBannersCount}` : null },
    { id: 'Active', label: 'Active' },
    { id: 'Rejected', label: 'Rejected' },
    { id: 'Expired', label: 'Expired' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Banner Ads & Moderation</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Approve sponsored banner campaigns, manage placement carousels, and review submitted media assets.
          </p>
        </div>

        <Button icon={Plus} onClick={() => navigate('/banners/create')}>
          Create Banner Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Approvals</span>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-black text-amber-900">{pendingBannersCount}</p>
            {pendingBannersCount > 0 && <Badge variant="warning">Requires Review</Badge>}
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Active Campaigns</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeCount}</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Impressions</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(totalImpressions)}</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg CTR</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">7.4%</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              currentTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Banner Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : banners.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Banner Campaigns Found"
          description="There are currently no promotional banners matching the selected filter."
          actionText="Create Banner"
          onAction={() => navigate('/banners/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => {
            const statusConfig = BANNER_STATUS_BADGES[banner.status] || BANNER_STATUS_BADGES.Pending;
            const isPending = banner.status === 'Pending';

            return (
              <Card
                key={banner.id}
                className={`flex flex-col justify-between overflow-hidden transition-all ${
                  isPending ? 'border-2 border-amber-300 shadow-md bg-amber-50/20' : ''
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-slate-200 bg-slate-900 group">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200';
                      }}
                    />
                    <button
                      onClick={() => setLightboxImage(banner.imageUrl)}
                      className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                    >
                      <Maximize2 className="w-4 h-4 mr-1" /> Zoom Image
                    </button>
                    <Badge variant="purple" className="absolute top-2 left-2 shadow-md">
                      {banner.targetScreen}
                    </Badge>
                    <Badge variant={statusConfig.variant} className="absolute top-2 right-2 shadow-md">
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span>#{banner.id}</span>
                    {banner.sponsorName && <span className="font-semibold text-slate-700">Sponsor: {banner.sponsorName}</span>}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{banner.title}</h3>

                  <div className="space-y-1 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Dates:</span>
                      <span className="font-medium text-slate-800">{banner.startDate} to {banner.expiryDate}</span>
                    </div>
                    {banner.phoneNumber && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:</span>
                        <span className="font-medium text-slate-800">{banner.phoneNumber}</span>
                      </div>
                    )}
                    {banner.rejectionReason && (
                      <div className="p-2 bg-red-50 text-red-700 rounded-lg text-[11px] font-semibold mt-2">
                        Reason: {banner.rejectionReason}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span>Impressions: <strong className="text-slate-900">{formatNumber(banner.impressions)}</strong></span>
                      <span>Clicks: <strong className="text-slate-900">{formatNumber(banner.clicks)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Moderation Controls / Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => setRejectingBanner(banner)}
                        icon={XCircle}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-1 font-bold"
                        onClick={() => approveMutation.mutate(banner.id)}
                        isLoading={approveMutation.isPending}
                        icon={CheckCircle2}
                      >
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {banner.destinationUrl ? (
                        <a
                          href={banner.destinationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <span>Target URL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(banner.id)}
                        className="text-red-600 hover:bg-red-50"
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reject Banner Modal */}
      {rejectingBanner && (
        <Modal
          isOpen={!!rejectingBanner}
          onClose={() => setRejectingBanner(null)}
          title="Reject Banner Campaign"
        >
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-red-900">Confirm Banner Rejection</p>
                <p className="text-red-700 mt-0.5">
                  Campaign: <span className="font-semibold">"{rejectingBanner.title}"</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Rejection Reason <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REJECTION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      rejectReason === reason
                        ? 'border-red-500 bg-red-50/50 text-red-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bannerRejectReason"
                      value={reason}
                      checked={rejectReason === reason}
                      onChange={() => setRejectReason(reason)}
                      className="w-4 h-4 text-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setRejectingBanner(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isLoading={rejectMutation.isPending}
                onClick={() =>
                  rejectMutation.mutate({ id: rejectingBanner.id, reason: rejectReason })
                }
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        images={lightboxImage ? [lightboxImage] : []}
      />

      {/* Delete Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteMutation.mutate(deletingId)}
          title="Delete Banner Campaign?"
          description="Are you sure you want to remove this promotional banner from active display?"
          confirmText="Delete Campaign"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
