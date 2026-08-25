import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { adsApi } from '../../api/adsApi';
import { Gift, Search, MessageSquare, ExternalLink, CheckCircle2, Clock, Filter, Eye, PhoneCall, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const LuckyDrawEnquiries = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('ENQUIRIES'); // 'ENQUIRIES' | 'ADS_CONTROL'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [uploadingAdId, setUploadingAdId] = useState(null);

  // 1. Fetch Lucky Draw Enquiries
  const { data: enquiriesData, isLoading: isLoadingEnquiries } = useQuery({
    queryKey: ['adminLuckyDrawEnquiries', searchQuery, statusFilter, page],
    queryFn: () =>
      luckyDrawAdminApi.getEnquiries({
        search: searchQuery || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        limit: 20,
      }),
    refetchInterval: 5000,
  });

  // 2. Fetch Ads for Ads Control Tab
  const { data: adsResult, isLoading: isLoadingAds } = useQuery({
    queryKey: ['adminLuckyDrawAds', searchQuery],
    queryFn: () =>
      adsApi.getAds({
        search: searchQuery || undefined,
        limit: 50,
      }),
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, whatsAppSent }) =>
      luckyDrawAdminApi.updateEnquiryStatus(id, { status, whatsAppSent }),
    onSuccess: () => {
      toast.success('Enquiry updated successfully');
      queryClient.invalidateQueries(['adminLuckyDrawEnquiries']);
    },
  });

  const toggleLuckyDrawMutation = useMutation({
    mutationFn: ({ id, luckyDrawStatus, luckyDrawImage }) =>
      adsApi.toggleLuckyDrawStatus(id, luckyDrawStatus, luckyDrawImage),
    onSuccess: (res) => {
      toast.success(res.message || 'Lucky Draw status updated');
      queryClient.invalidateQueries(['adminLuckyDrawAds']);
      queryClient.invalidateQueries(['ads']);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }) => adsApi.uploadLuckyDrawImage(id, file),
    onMutate: ({ id }) => setUploadingAdId(id),
    onSuccess: (res) => {
      toast.success(res.message || 'Lucky Draw banner uploaded to Cloudinary CDN successfully!');
      setUploadingAdId(null);
      queryClient.invalidateQueries(['adminLuckyDrawAds']);
      queryClient.invalidateQueries(['ads']);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to upload image to Cloudinary');
      setUploadingAdId(null);
    },
  });

  const handleResendWhatsApp = (enquiry) => {
    const cleanPhone = (enquiry.visitorPhone || '').replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const waMessage =
      `🎁 *LUCKY DRAW ENQUIRY CONFIRMATION* 🎁\n` +
      `-----------------------------------\n` +
      `Hi ${enquiry.visitorName},\n` +
      `Thank you for expressing interest in our Lucky Draw listing:\n` +
      `📢 *${enquiry.adTitle}* (ID: #${enquiry.adId})\n\n` +
      `Our team will reach out to you shortly with full details.\n` +
      `Date: ${new Date(enquiry.createdAt).toLocaleString()}`;

    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;
    window.open(whatsappUrl, '_blank');

    updateStatusMutation.mutate({ id: enquiry._id || enquiry.enquiryId, whatsAppSent: true, status: 'CONTACTED' });
  };

  const enquiries = enquiriesData?.data || [];
  const adsList = adsResult?.data || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Gift className="w-5 h-5 text-amber-200" />
            </div>
            Ads → Lucky Draw Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control Apply / Not Apply settings per Ad and monitor visitor Lucky Draw enquiries with WhatsApp dispatch status.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ENQUIRIES')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ENQUIRIES'
              ? 'border-red-600 text-red-600 bg-red-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Visitor Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ADS_CONTROL')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ADS_CONTROL'
              ? 'border-red-600 text-red-600 bg-red-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Ads Lucky Draw Control (Apply / Not Apply)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'ENQUIRIES' ? 'Search visitor, phone, or ad title...' : 'Search ads by title or ID...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {activeTab === 'ENQUIRIES' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: VISITOR ENQUIRIES TABLE */}
      {activeTab === 'ENQUIRIES' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80 tracking-wider">
                  <th className="px-4 py-3">Enquiry ID</th>
                  <th className="px-4 py-3">Related Product / Service Ad</th>
                  <th className="px-4 py-3">Visitor Details</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">WhatsApp Notification</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingEnquiries ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-semibold">
                      Loading Lucky Draw enquiries...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-semibold">
                      No Lucky Draw enquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <tr key={enquiry._id || enquiry.enquiryId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-red-600">
                        {enquiry.enquiryId}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {enquiry.adImageUrl ? (
                            <img
                              src={enquiry.adImageUrl}
                              alt=""
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                              Ad
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs">
                            <span className="text-[10px] font-bold text-blue-600">#{enquiry.adId}</span>
                            <h4 className="font-bold text-slate-900 truncate">{enquiry.adTitle}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{enquiry.adCategory}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{enquiry.visitorName}</p>
                        <p className="text-slate-600 font-semibold">{enquiry.visitorPhone}</p>
                        {enquiry.visitorEmail && (
                          <p className="text-[10px] text-slate-400">{enquiry.visitorEmail}</p>
                        )}
                        {enquiry.visitorDetails && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-xs">
                            "{enquiry.visitorDetails}"
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(enquiry.createdAt).toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp Sent ✓</span>
                          </span>
                          <button
                            onClick={() => handleResendWhatsApp(enquiry)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-0.5 cursor-pointer"
                            title="Resend details via WhatsApp"
                          >
                            <span>Resend</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <select
                          value={enquiry.status}
                          onChange={(e) =>
                            updateStatusMutation.mutate({
                              id: enquiry._id || enquiry.enquiryId,
                              status: e.target.value,
                            })
                          }
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold focus:outline-none cursor-pointer border ${
                            enquiry.status === 'NEW'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : enquiry.status === 'CONTACTED'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleResendWhatsApp(enquiry)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADS LUCKY DRAW CONTROL TABLE */}
      {activeTab === 'ADS_CONTROL' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">Product / Service Ads Lucky Draw Setting</h3>
            <p className="text-xs text-slate-500">
              Only ads set to <strong>👉 Apply</strong> will display the Lucky Draw Banner & Form to visitors. Ads set to <strong>👉 Not Apply</strong> will hide it.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80 tracking-wider">
                  <th className="px-4 py-3">Ad Listing</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Lucky Draw Setting</th>
                  <th className="px-4 py-3">Lucky Draw Image Banner</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingAds ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-semibold">
                      Loading advertisements...
                    </td>
                  </tr>
                ) : adsList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-semibold">
                      No advertisements found.
                    </td>
                  </tr>
                ) : (
                  adsList.map((ad) => {
                    const isApply = ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible;
                    return (
                      <tr key={ad.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={ad.imageUrls && ad.imageUrls.length > 0 ? ad.imageUrls[0] : ''}
                              alt=""
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <span className="text-[10px] font-bold text-blue-600">#{ad.id}</span>
                              <h4 className="font-bold text-slate-900 truncate">{ad.title}</h4>
                              <p className="text-xs font-bold text-slate-800">
                                ₹{ad.price ? Number(ad.price).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-semibold text-slate-700">
                          {ad.category}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                              isApply
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            <span>{isApply ? '👉 APPLY' : '👉 NOT APPLY'}</span>
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          {isApply ? (
                            <div className="space-y-1.5 max-w-xs">
                              {ad.luckyDrawImage ? (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={ad.luckyDrawImage}
                                    alt="Lucky Draw Banner"
                                    className="w-12 h-8 rounded object-cover border border-amber-300 shrink-0"
                                  />
                                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
                                    Cloudinary Banner Active ✓
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-semibold block">
                                  Default Gift Banner Active
                                </span>
                              )}

                              <div className="flex items-center gap-1.5">
                                <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-xs transition-colors">
                                  <Upload className="w-3 h-3" />
                                  <span>{uploadingAdId === ad.id ? 'Uploading to Cloudinary...' : 'Upload Cloudinary Image'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingAdId === ad.id}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        uploadImageMutation.mutate({ id: ad.id, file });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Not Apply (Hidden)</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() =>
                              toggleLuckyDrawMutation.mutate({
                                id: ad.id,
                                luckyDrawStatus: isApply ? 'NOT_APPLY' : 'APPLY',
                              })
                            }
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                              isApply
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                            }`}
                          >
                            {isApply ? 'Set 👉 NOT APPLY' : 'Set 👉 APPLY'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
