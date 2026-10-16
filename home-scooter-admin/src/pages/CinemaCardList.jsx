import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { AdRejectModal } from '../components/ads/AdRejectModal';
import { formatDateTime } from '../utils/formatters';
import { toast } from 'sonner';
import {
  Clapperboard,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Phone,
  MapPin,
  Users,
  Search,
  ExternalLink,
  Calendar,
  Sparkles,
  UploadCloud,
  ImageIcon,
} from 'lucide-react';

export const CinemaCardList = () => {
  const queryClient = useQueryClient();

  const [statusTab, setStatusTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectingApp, setRejectingApp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Fetch all Cinema Card applications for stats & listing
  const { data: result, isLoading } = useQuery({
    queryKey: ['cinemaCardAds', statusTab, searchQuery],
    queryFn: () =>
      adsApi.getAds({
        category: 'CINEMA CARD',
        status: statusTab !== 'ALL' ? statusTab : undefined,
        search: searchQuery || undefined,
        limit: 100,
      }),
    refetchInterval: 5000,
  });

  // Fetch all for global stats count
  const { data: allStatsResult } = useQuery({
    queryKey: ['cinemaCardAllStats'],
    queryFn: () =>
      adsApi.getAds({
        category: 'CINEMA CARD',
        limit: 1000,
      }),
    refetchInterval: 10000,
  });

  const allItems = Array.isArray(allStatsResult?.data)
    ? allStatsResult.data
    : Array.isArray(allStatsResult?.data?.data)
    ? allStatsResult.data.data
    : [];

  const totalCount = allItems.length;
  const pendingCount = allItems.filter(
    (a) => a.status === 'PENDING' || a.status === 'PENDING_APPROVAL'
  ).length;
  const approvedCount = allItems.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = allItems.filter((a) => a.status === 'REJECTED').length;

  const applications = Array.isArray(result?.data)
    ? result.data
    : Array.isArray(result?.data?.data)
    ? result.data.data
    : [];

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id) => adsApi.approveAd(id),
    onSuccess: () => {
      toast.success('Cinema Card application approved successfully! 🎉');
      queryClient.invalidateQueries(['cinemaCardAds']);
      queryClient.invalidateQueries(['cinemaCardAllStats']);
      queryClient.invalidateQueries(['ads']);
      if (selectedApp) setSelectedApp((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to approve application');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, notes }) => adsApi.rejectAd(id, reason, notes),
    onSuccess: () => {
      toast.success('Cinema Card application rejected');
      setRejectingApp(null);
      queryClient.invalidateQueries(['cinemaCardAds']);
      queryClient.invalidateQueries(['cinemaCardAllStats']);
      queryClient.invalidateQueries(['ads']);
      if (selectedApp) setSelectedApp((prev) => (prev ? { ...prev, status: 'REJECTED' } : null));
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to reject application');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adsApi.deleteAd(id),
    onSuccess: () => {
      toast.success('Cinema Card application deleted');
      setDeletingId(null);
      if (selectedApp && (selectedApp.id === deletingId || selectedApp.adId === deletingId)) {
        setSelectedApp(null);
      }
      queryClient.invalidateQueries(['cinemaCardAds']);
      queryClient.invalidateQueries(['cinemaCardAllStats']);
      queryClient.invalidateQueries(['ads']);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to delete application');
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }) => adsApi.uploadCinemaCardImage(id, file),
    onSuccess: (res) => {
      toast.success('Cinema Card official image uploaded & approved! Live in all app listings. 🎉');
      queryClient.invalidateQueries(['cinemaCardAds']);
      queryClient.invalidateQueries(['cinemaCardAllStats']);
      queryClient.invalidateQueries(['ads']);
      if (selectedApp) {
        setSelectedApp((prev) => (prev ? {
          ...prev,
          imageUrls: [res.imageUrl, ...(prev.imageUrls || []).filter((u) => u !== res.imageUrl)],
          status: 'APPROVED',
        } : null));
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to upload Cinema Card image');
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'PENDING':
      case 'PENDING_APPROVAL':
      default:
        return <Badge variant="warning">Pending Review</Badge>;
    }
  };

  const getWhatsAppLink = (phone) => {
    if (!phone) return '#';
    const clean = String(phone).replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <Clapperboard className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cinema Card Applications
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review user membership submissions, verify photos & WhatsApp numbers, and approve Cinema Cards.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Applications
            </span>
            <Clapperboard className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Pending Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{pendingCount}</p>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Approved
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{approvedCount}</p>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Rejected
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">{rejectedCount}</p>
        </Card>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Applications', count: totalCount },
            { id: 'PENDING', label: 'Pending Review', count: pendingCount, color: 'bg-amber-500' },
            { id: 'APPROVED', label: 'Approved', count: approvedCount, color: 'bg-emerald-500' },
            { id: 'REJECTED', label: 'Rejected', count: rejectedCount, color: 'bg-rose-500' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                statusTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  statusTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="Search name, phone, place..."
          />
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <Card className="p-8 text-center text-slate-400">Loading Cinema Card applications...</Card>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
            🎬
          </div>
          <h3 className="text-base font-bold text-slate-800">No Cinema Card applications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No registrations matching "${searchQuery}"`
              : 'There are currently no Cinema Card registrations under this filter.'}
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">Applicant Name</th>
                  <th className="py-3.5 px-4">WhatsApp Number</th>
                  <th className="py-3.5 px-4">Place</th>
                  <th className="py-3.5 px-4">Referred By</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => {
                  const applicantName =
                    app.applicantName ||
                    app.posterName ||
                    app.title?.replace('Cinema Card - ', '') ||
                    'Applicant';
                  const whatsapp = app.whatsappNumber || app.posterPhone || '';
                  const place = app.place || app.location || 'N/A';
                  const referredBy = app.referredBy || 'Direct';
                  const photo =
                    app.imageUrls && app.imageUrls.length > 0
                      ? app.imageUrls[0]
                      : null;
                  const isPending =
                    app.status === 'PENDING' || app.status === 'PENDING_APPROVAL';

                  return (
                    <tr
                      key={app.id || app.adId || app._id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        {photo ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage(photo);
                            }}
                            className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 cursor-zoom-in relative group"
                          >
                            <img
                              src={photo}
                              alt={applicantName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">
                              Zoom
                            </div>
                          </div>
                        ) : (
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 h-12 rounded-lg bg-amber-50 border border-dashed border-amber-300 flex flex-col items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                            title="Upload Official Cinema Card Image"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadImageMutation.isPending}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  uploadImageMutation.mutate({ id: app.id || app.adId, file });
                                }
                              }}
                            />
                            <UploadCloud className="w-4 h-4 text-amber-600" />
                            <span className="text-[8px] font-bold mt-0.5">Upload</span>
                          </label>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{applicantName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {app.adId || app.id}
                        </span>
                      </td>

                      {/* WhatsApp */}
                      <td className="py-3 px-4">
                        {whatsapp ? (
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="font-semibold text-slate-800">{whatsapp}</span>
                            <a
                              href={getWhatsAppLink(whatsapp)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Place */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{place}</span>
                        </div>
                      </td>

                      {/* Referred By */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {referredBy}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDateTime(app.createdAt || app.postedAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">{getStatusBadge(app.status)}</td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Upload Official Card Image */}
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Upload / Change Official Card Image"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadImageMutation.isPending}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  uploadImageMutation.mutate({ id: app.id || app.adId, file });
                                }
                              }}
                            />
                            <UploadCloud className="w-4 h-4" />
                          </label>

                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isPending && (
                            <button
                              onClick={() => approveMutation.mutate(app.id || app.adId)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Approve Application"
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {isPending && (
                            <button
                              onClick={() => setRejectingApp(app)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setDeletingId(app.id || app.adId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title="Cinema Card Application Details"
          subtitle={`Application ID: ${selectedApp.adId || selectedApp.id}`}
        >
          <div className="space-y-4">
            {/* Header / Applicant Summary */}
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {selectedApp.applicantName || selectedApp.posterName || selectedApp.title}
                  </h3>
                  <p className="text-[11px] text-amber-800 font-semibold">
                    Cinema Card Registration
                  </p>
                </div>
              </div>
              <div>{getStatusBadge(selectedApp.status)}</div>
            </div>

            {/* Official Cinema Card Image (Set by Admin) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Official Cinema Card Image (Admin Managed)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Users register text details only. Admin uploads the official card image to publish it to all mobile app listings.
                  </p>
                </div>
                {selectedApp.imageUrls && selectedApp.imageUrls.length > 0 && selectedApp.status === 'APPROVED' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Live in App
                  </span>
                )}
              </div>

              {selectedApp.imageUrls && selectedApp.imageUrls.length > 0 ? (
                <div className="space-y-2">
                  <div
                    onClick={() => setLightboxImage(selectedApp.imageUrls[0])}
                    className="w-full h-52 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in relative group"
                  >
                    <img
                      src={selectedApp.imageUrls[0]}
                      alt="Cinema Card Photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                      Click to view full image
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Image uploaded and live in app listings.
                    </span>
                    <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadImageMutation.isPending}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadImageMutation.mutate({
                              id: selectedApp.id || selectedApp.adId,
                              file,
                            });
                          }
                        }}
                      />
                      <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                      <span>{uploadImageMutation.isPending ? 'Uploading...' : 'Replace Image'}</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-amber-300 bg-amber-50/60 rounded-xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      No Cinema Card image uploaded yet
                    </h5>
                    <p className="text-[11px] text-slate-600 max-w-sm mx-auto mt-0.5">
                      Upload the official card banner or ID card photo for this applicant. Once uploaded, it will automatically approve and appear in all mobile app listings.
                    </p>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadImageMutation.isPending}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadImageMutation.mutate({
                              id: selectedApp.id || selectedApp.adId,
                              file,
                            });
                          }
                        }}
                      />
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadImageMutation.isPending ? 'Uploading to CDN...' : 'Upload Official Card Image'}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Full Name
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedApp.applicantName || selectedApp.posterName || 'N/A'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    WhatsApp Number
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedApp.whatsappNumber || selectedApp.posterPhone || 'N/A'}
                  </p>
                </div>
                {(selectedApp.whatsappNumber || selectedApp.posterPhone) && (
                  <a
                    href={getWhatsAppLink(selectedApp.whatsappNumber || selectedApp.posterPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </a>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Place / Location
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedApp.place || selectedApp.location || 'N/A'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Referred By
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedApp.referredBy || 'Direct (None)'}
                </p>
              </div>
            </div>

            {/* Submission Time */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">Registered At:</span>
              <span className="font-mono">{formatDateTime(selectedApp.createdAt || selectedApp.postedAt)}</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>

              {selectedApp.status !== 'APPROVED' && (
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  onClick={() => approveMutation.mutate(selectedApp.id || selectedApp.adId)}
                  isLoading={approveMutation.isPending}
                >
                  Approve Application
                </Button>
              )}

              {selectedApp.status !== 'REJECTED' && (
                <Button
                  variant="danger"
                  className="font-bold"
                  onClick={() => {
                    setRejectingApp(selectedApp);
                  }}
                >
                  Reject
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectingApp && (
        <AdRejectModal
          isOpen={!!rejectingApp}
          onClose={() => setRejectingApp(null)}
          onConfirm={(reason, notes) => {
            rejectMutation.mutate({
              id: rejectingApp.id || rejectingApp.adId,
              reason,
              notes,
            });
          }}
          adTitle={
            rejectingApp.applicantName ||
            rejectingApp.posterName ||
            rejectingApp.title ||
            'Cinema Card'
          }
          isLoading={rejectMutation.isPending}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteMutation.mutate(deletingId)}
          title="Delete Cinema Card Application?"
          description="Are you sure you want to delete this Cinema Card registration? This cannot be undone."
          confirmText="Delete Application"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}

      {/* Full Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          imageUrl={lightboxImage}
        />
      )}
    </div>
  );
};
