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
} from 'lucide-react';

export const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [banConfirmOpen, setBanConfirmOpen] = useState(false);

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
                {ad.category === CATEGORIES.PROPERTIES && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-700 uppercase">BHK Layout</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.bhk || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-700 uppercase">Furnishing</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.furnishing || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-700 uppercase">Built-up Area</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.dimensions || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {/* Electric Scooter Specifics */}
                {ad.category === CATEGORIES.ELECTRIC_SCOOTERS && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Brand & Model</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.brandModel || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Battery Range</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.batteryRangeKm || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Top Speed</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ad.maxSpeed || 'N/A'}</p>
                    </div>
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
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Promotional Badges</span>
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
