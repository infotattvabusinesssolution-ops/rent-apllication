import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { usersApi } from '../api/usersApi';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { AdRejectModal } from '../components/ads/AdRejectModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AD_STATUS_BADGES, CATEGORIES } from '../constants/categories';
import { formatCurrency, formatDateTime, formatCompactViews } from '../utils/formatters';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  Star,
  Flame,
  User,
  MapPin,
  Calendar,
  Eye,
  ShieldCheck,
  Ban,
  Maximize2,
  Building,
  Zap,
  Tag,
  ArrowLeft,
  Gift,
  Upload,
} from 'lucide-react';

export const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [banConfirmOpen, setBanConfirmOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: ad, isLoading, isError } = useQuery({
    queryKey: ['adDetail', id],
    queryFn: () => adsApi.getAdById(id),
  });

  const approveMutation = useMutation({
    mutationFn: () => adsApi.approveAd(id),
    onSuccess: () => {
      toast.success('Advertisement approved successfully');
      queryClient.invalidateQueries(['adDetail', id]);
      queryClient.invalidateQueries(['ads']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ reason, notes }) => adsApi.rejectAd(id, reason, notes),
    onSuccess: () => {
      toast.success('Advertisement rejected');
      setRejectModalOpen(false);
      queryClient.invalidateQueries(['adDetail', id]);
      queryClient.invalidateQueries(['ads']);
    },
  });

  const badgeMutation = useMutation({
    mutationFn: (badges) => adsApi.updateBadges(id, badges),
    onSuccess: () => {
      toast.success('Badges updated');
      queryClient.invalidateQueries(['adDetail', id]);
    },
  });

  const luckyDrawMutation = useMutation({
    mutationFn: ({ luckyDrawStatus, luckyDrawImage }) =>
      adsApi.toggleLuckyDrawStatus(id, luckyDrawStatus, luckyDrawImage),
    onSuccess: (res) => {
      toast.success(res.message || 'Lucky Draw setting updated');
      queryClient.invalidateQueries(['adDetail', id]);
      queryClient.invalidateQueries(['ads']);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file) => adsApi.uploadLuckyDrawImage(id, file),
    onMutate: () => setIsUploadingImage(true),
    onSuccess: (res) => {
      toast.success(res.message || 'Lucky Draw banner uploaded to Cloudinary CDN successfully!');
      setIsUploadingImage(false);
      queryClient.invalidateQueries(['adDetail', id]);
      queryClient.invalidateQueries(['ads']);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to upload image to Cloudinary');
      setIsUploadingImage(false);
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: () => adsApi.unpublishAd(id),
    onSuccess: () => {
      toast.success('Advertisement unpublished');
      queryClient.invalidateQueries(['adDetail', id]);
    },
  });

  const banUserMutation = useMutation({
    mutationFn: () => usersApi.banUser(ad?.posterId, 'Violated advertisement terms from ad inspection'),
    onSuccess: () => {
      toast.success('Seller banned successfully');
      setBanConfirmOpen(false);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Advertisement Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested ad ID "#{id}" does not exist.</p>
        <Button onClick={() => navigate('/ads')}>Back to All Ads</Button>
      </div>
    );
  }

  const statusBadge = AD_STATUS_BADGES[ad.status] || AD_STATUS_BADGES.PENDING;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Ad #{ad.id}</span>
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5 line-clamp-1">{ad.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gallery & Listing Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Card */}
          <Card>
            <div className="relative group rounded-xl overflow-hidden bg-slate-900 aspect-video mb-3">
              <img
                src={ad.imageUrls[selectedImageIdx] || ad.imageUrls[0]}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-xl backdrop-blur-xs flex items-center gap-1 text-xs font-semibold transition-all opacity-90 hover:opacity-100 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen View</span>
              </button>
            </div>

            {/* Thumbnail Navigation */}
            {ad.imageUrls.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {ad.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt=""
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      idx === selectedImageIdx
                        ? 'border-blue-600 scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Core Ad Details */}
          <Card>
            <CardHeader title="Listing Overview & Specifications" />
            <CardBody className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Listing Price</span>
                  <p className="text-3xl font-black text-slate-900 mt-0.5">
                    {formatCurrency(ad.price)}
                    {ad.priceUnit !== '₹' && <span className="text-sm font-normal text-slate-500 ml-1">{ad.priceUnit}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="teal" size="lg">{ad.category}</Badge>
                  {ad.propertySubType && <Badge variant="neutral" size="lg">{ad.propertySubType}</Badge>}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {ad.description}
                </p>
              </div>

              {/* Category Specific Specifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Category Attributes</h4>
                
                {/* Layout Category Specifics */}
                {ad.category === CATEGORIES.LAYOUT_SITES && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Plot Dimensions</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.dimensions || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Plot Number</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.plotNumber || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Facing Direction</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.facing || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {/* Property Category Specifics */}
                {(ad.category === CATEGORIES.PROPERTIES || ad.propertySubType?.includes('House') || ad.propertySubType?.includes('Apartment') || ad.propertySubType?.includes('Shop') || ad.propertySubType?.includes('Office') || ad.propertySubType?.includes('Lands') || ad.propertySubType?.includes('Plot')) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ad.bhk && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">BHK Layout</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.bhk}</p>
                      </div>
                    )}
                    {ad.bathrooms && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Bathrooms</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.bathrooms}</p>
                      </div>
                    )}
                    {ad.washrooms && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Washrooms</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.washrooms}</p>
                      </div>
                    )}
                    {ad.furnishing && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Furnishing</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.furnishing}</p>
                      </div>
                    )}
                    {ad.projectStatus && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Project Status</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.projectStatus}</p>
                      </div>
                    )}
                    {ad.listedBy && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Listed By</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.listedBy}</p>
                      </div>
                    )}
                    {ad.superBuiltupArea && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Super Builtup Area</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.superBuiltupArea} sq.ft</p>
                      </div>
                    )}
                    {ad.carpetArea && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Carpet Area</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.carpetArea} sq.ft</p>
                      </div>
                    )}
                    {ad.maintenanceMonthly && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Monthly Maint.</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">₹{ad.maintenanceMonthly}</p>
                      </div>
                    )}
                    {ad.carParking && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Car Parking</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.carParking}</p>
                      </div>
                    )}
                    {ad.plotArea && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Plot Area</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.plotArea} sq.ft</p>
                      </div>
                    )}
                    {ad.facing && (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">Facing</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.facing}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bike & Vehicle Specifics */}
                {(ad.category === CATEGORIES.BIKES || ad.category === CATEGORIES.ELECTRIC_SCOOTERS || ad.brand || ad.year || ad.kmDriven) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ad.brand && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">Brand</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.brand}</p>
                      </div>
                    )}
                    {ad.year && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">Registration Year</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.year}</p>
                      </div>
                    )}
                    {ad.fuel && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">Fuel Type</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.fuel}</p>
                      </div>
                    )}
                    {ad.kmDriven && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">KM Driven</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.kmDriven} km</p>
                      </div>
                    )}
                    {ad.brandModel && !ad.brand && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">Brand & Model</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.brandModel}</p>
                      </div>
                    )}
                    {ad.batteryRangeKm && (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Battery Range</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.batteryRangeKm} km</p>
                      </div>
                    )}
                    {ad.maxSpeed && (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Top Speed</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.maxSpeed}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Job Specifics */}
                {(ad.category === 'Jobs' || ad.positionType || ad.salaryFrom || ad.salaryPeriod) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ad.positionType && (
                      <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                        <span className="text-[10px] font-bold text-purple-700 uppercase">Position Type</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.positionType}</p>
                      </div>
                    )}
                    {(ad.salaryFrom || ad.salaryTo) && (
                      <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                        <span className="text-[10px] font-bold text-purple-700 uppercase">Salary Range</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          ₹{ad.salaryFrom || '0'} - ₹{ad.salaryTo || '0'}
                        </p>
                      </div>
                    )}
                    {ad.salaryPeriod && (
                      <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                        <span className="text-[10px] font-bold text-purple-700 uppercase">Salary Period</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.salaryPeriod}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Service Specifics */}
                {(ad.category === 'Services' || ad.serviceType || ad.propertySubType?.includes('Repair') || ad.propertySubType?.includes('Services')) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase">Service Category</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.propertySubType || ad.category || 'Services'}</p>
                    </div>
                    {(ad.serviceType || ad.type) && (
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase">Service Type</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{ad.serviceType || ad.type}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Amenities pills */}
                {ad.amenities && ad.amenities.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-slate-500">Key Features & Amenities:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ad.amenities.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats & Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </span>
                  <p className="font-semibold text-slate-800 mt-1">{ad.location}</p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Total Views
                  </span>
                  <p className="font-semibold text-slate-800 mt-1">{formatCompactViews(ad.viewsCount)}</p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Submission Date
                  </span>
                  <p className="font-semibold text-slate-800 mt-1">{formatDateTime(ad.postedAt)}</p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Promo Tag
                  </span>
                  <p className="font-semibold text-slate-800 mt-1">{ad.promoTag || 'Standard Listing'}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Seller Profile & Moderation Action Panel */}
        <div className="space-y-6">
          {/* Moderation Controls Panel */}
          <Card className="border-2 border-blue-100 bg-gradient-to-b from-blue-50/30 to-white">
            <CardHeader title="Moderation Action Panel" />
            <CardBody className="space-y-4">
              {ad.status === 'PENDING' ? (
                <div className="space-y-3">
                  <Button
                    variant="success"
                    className="w-full py-2.5 font-bold"
                    onClick={() => approveMutation.mutate()}
                    isLoading={approveMutation.isPending}
                    icon={CheckCircle2}
                  >
                    Approve Listing
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full py-2.5 font-bold"
                    onClick={() => setRejectModalOpen(true)}
                    icon={XCircle}
                  >
                    Reject Listing
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">Current Moderation Status:</p>
                  <Badge variant={statusBadge.variant} size="lg" className="w-full justify-center py-1.5">
                    {statusBadge.label}
                  </Badge>

                  {ad.status === 'APPROVED' && (
                    <Button
                      variant="outline"
                      className="w-full mt-3 text-xs"
                      onClick={() => unpublishMutation.mutate()}
                      isLoading={unpublishMutation.isPending}
                    >
                      Unpublish Listing
                    </Button>
                  )}
                </div>
              )}

              <hr className="border-slate-200 my-4" />

              {/* Promotional Badges Control */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Promotional Badges & Settings</span>
                
                {/* Lucky Draw Setting (Apply / Not Apply) */}
                <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-red-600" /> Lucky Draw Setting
                    </span>
                    <button
                      onClick={() =>
                        luckyDrawMutation.mutate({
                          luckyDrawStatus: (ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) ? 'NOT_APPLY' : 'APPLY',
                        })
                      }
                      className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer transition-all border ${
                        (ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible)
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {(ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) ? '👉 APPLY' : '👉 NOT APPLY'}
                    </button>
                  </div>

                  {(ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) && (
                    <div className="pt-2 border-t border-red-200/80 space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Lucky Draw Banner Image (Cloudinary CDN)
                      </label>

                      {ad.luckyDrawImage ? (
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                          <img
                            src={ad.luckyDrawImage}
                            alt="Lucky Draw Banner"
                            className="w-16 h-10 rounded object-cover border border-amber-300 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-emerald-700 font-bold block truncate">
                              Cloudinary Banner Active ✓
                            </span>
                            <button
                              onClick={() =>
                                luckyDrawMutation.mutate({
                                  luckyDrawStatus: 'APPLY',
                                  luckyDrawImage: null,
                                })
                              }
                              className="text-[10px] text-red-600 hover:underline font-semibold"
                            >
                              Remove Custom Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic block">
                          Default built-in gift banner is currently active.
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image to Cloudinary'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingImage}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                uploadImageMutation.mutate(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-purple-600" /> Featured Badge
                  </span>
                  <input
                    type="checkbox"
                    checked={ad.isFeatured}
                    onChange={(e) => badgeMutation.mutate({ isFeatured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded-md"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" /> High Demand Badge
                  </span>
                  <input
                    type="checkbox"
                    checked={ad.isHighDemand}
                    onChange={(e) => badgeMutation.mutate({ isHighDemand: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded-md"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Seller Profile Card */}
          <Card>
            <CardHeader title="Seller Profile & Verification" />
            <CardBody className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {ad.posterName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{ad.posterName}</h4>
                  <p className="text-slate-500 font-mono">ID: {ad.posterId}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-800">{ad.posterPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800">{ad.posterEmail || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Poster Verification:</span>
                  <Badge variant="success" size="sm">Verified Seller</Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/users/${ad.posterId}`)}
                >
                  View Full Seller Profile
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  title="Ban Seller Account"
                  onClick={() => setBanConfirmOpen(true)}
                >
                  <Ban className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Customer Verified Slip (CVS) Inspector Card */}
          <Card className="border border-blue-200 overflow-hidden shadow-xs">
            <div className="bg-[#1e293b] text-white p-3.5 text-center">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block">Verification Slip</span>
              <h4 className="font-serif font-black text-sm text-white tracking-wide">CUSTOMER VERIFIED SLIP (CVS)</h4>
            </div>

            <CardBody className="p-4 space-y-3 text-xs font-serif">
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>1. Customer Name:</span>
                  <span className="font-bold text-slate-900">{ad.posterName}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>2. Contact No:</span>
                  <span className="font-bold text-blue-600">{ad.posterPhone}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>3. Area / Location:</span>
                  <span className="font-bold text-slate-900">{ad.location}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>4. Requirement:</span>
                  <span className="font-bold text-slate-900">{ad.title}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>5. Verification Status:</span>
                  <span className="font-bold text-emerald-600">✓ VERIFIED SLIP</span>
                </div>
              </div>

              <div className="text-center py-0.5">
                <span className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                  SENT TO DEALER
                </span>
              </div>

              <div className="space-y-1.5 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>6. Dealer Name:</span>
                  <span className="font-bold text-slate-900">Infotattva Verified Partner</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>7. Business Name:</span>
                  <span className="font-bold text-slate-900">Home Scooter Solutions</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>8. WhatsApp Contact:</span>
                  <span className="font-mono font-bold text-emerald-600">{ad.posterPhone}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/91${ad.posterPhone}?text=${encodeURIComponent(`Hello, admin inquiring about CVS for listing #${ad.id}: ${ad.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer block text-center"
              >
                <span>SEND TO WHATSAPP</span>
              </a>
            </CardBody>
          </Card>
        </div>
      </div>


      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={ad.imageUrls}
        initialIndex={selectedImageIdx}
      />

      {/* Reject Modal */}
      {rejectModalOpen && (
        <AdRejectModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          adTitle={ad.title}
          isLoading={rejectMutation.isPending}
          onConfirm={(reason, notes) => rejectMutation.mutate({ reason, notes })}
        />
      )}

      {/* Ban Confirm */}
      {banConfirmOpen && (
        <ConfirmDialog
          isOpen={banConfirmOpen}
          onClose={() => setBanConfirmOpen(false)}
          onConfirm={() => banUserMutation.mutate()}
          title={`Ban Seller "${ad.posterName}"?`}
          description="This action will suspend the seller's account and unpublish all their current advertisements."
          confirmText="Ban Seller"
          variant="danger"
          isLoading={banUserMutation.isPending}
        />
      )}
    </div>
  );
};
