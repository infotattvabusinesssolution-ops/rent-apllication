import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { callbackApi } from '../api/callbackApi';
import { ImageGallery } from '../components/marketplace/ImageGallery';
import { ReportAdModal } from '../components/marketplace/ReportAdModal';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { formatCurrency, formatCompactViews, timeAgo } from '../utils/formatters';
import { toast } from 'sonner';
import {
  MapPin,
  Eye,
  Heart,
  PhoneCall,
  MessageSquare,
  Phone,
  ShieldCheck,
  Flag,
  Share2,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: ad, isLoading, isError } = useQuery({
    queryKey: ['adDetail', id],
    queryFn: async () => {
      const data = await adsApi.getAdById(id);
      setIsFavorite(data.isFavorite || false);
      return data;
    },
  });

  const { data: similarResult } = useQuery({
    queryKey: ['similarAds', ad?.category],
    queryFn: () => adsApi.getAds({ category: ad?.category }),
    enabled: !!ad,
  });

  const callbackMutation = useMutation({
    mutationFn: () => callbackApi.requestCallback(id),
    onSuccess: (res) => {
      toast.success(res.message);
    },
  });

  const handleFavoriteClick = async () => {
    try {
      const res = await adsApi.toggleFavorite(id);
      setIsFavorite(res.isFavorite);
      toast.success(res.isFavorite ? 'Saved to Favorites' : 'Removed from Favorites');
    } catch (e) {
      toast.error('Failed to update favorite');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: ad?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Listing link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Listing Not Found</h2>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
    );
  }

  const similarListings = (similarResult?.data || []).filter((a) => a.id !== ad.id).slice(0, 4);

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate(`/categories/${ad.category.toLowerCase().replace(/ /g, '-')}`)}>{ad.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{ad.title}</span>
      </div>

      {/* Main Grid: Left Gallery & Info, Right Seller Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <ImageGallery images={ad.imageUrls} />

          {/* Listing Title & Badges Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Verified Listing
              </Badge>
              {ad.isFeatured && <Badge variant="purple">Featured Listing</Badge>}
              {ad.isHighDemand && <Badge variant="warning">High Demand</Badge>}
              <Badge variant="teal">{ad.category}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {ad.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Asking Price</span>
                <span className="text-3xl font-black text-slate-900">
                  {formatCurrency(ad.price)}
                  {ad.priceUnit !== '₹' && <span className="text-sm font-semibold text-slate-500 ml-1">{ad.priceUnit}</span>}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {ad.location}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-400" />
                  {formatCompactViews(ad.viewsCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {timeAgo(ad.postedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Specific Technical Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Listing Details & Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider">Ad ID</span>
                <span className="font-mono font-bold text-slate-800">#{ad.id}</span>
              </div>
              {ad.dimensions && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Dimensions / Area</span>
                  <span className="font-bold text-slate-800">{ad.dimensions}</span>
                </div>
              )}
              {ad.plotNumber && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Plot Number</span>
                  <span className="font-bold text-slate-800">{ad.plotNumber}</span>
                </div>
              )}
              {ad.facing && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Facing Direction</span>
                  <span className="font-bold text-slate-800">{ad.facing}</span>
                </div>
              )}
              {ad.bhk && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">BHK Type</span>
                  <span className="font-bold text-slate-800">{ad.bhk}</span>
                </div>
              )}
              {ad.furnishing && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Furnishing State</span>
                  <span className="font-bold text-slate-800">{ad.furnishing}</span>
                </div>
              )}
              {ad.batteryRangeKm && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">EV Battery Range</span>
                  <span className="font-bold text-emerald-700">🔋 {ad.batteryRangeKm}</span>
                </div>
              )}
              {ad.maxSpeed && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Max Speed</span>
                  <span className="font-bold text-slate-800">⚡ {ad.maxSpeed}</span>
                </div>
              )}
              {ad.brandModel && (
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider">Brand & Model</span>
                  <span className="font-bold text-slate-800">{ad.brandModel}</span>
                </div>
              )}
            </div>

            {/* Amenities list if available */}
            {ad.amenities && ad.amenities.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amenities & Features</span>
                <div className="flex flex-wrap gap-2">
                  {ad.amenities.map((item) => (
                    <span key={item} className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seller Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {ad.description}
            </p>
          </div>
        </div>

        {/* Right Sidebar: Seller Card & Quick Actions */}
        <div className="space-y-6">
          {/* Seller Card */}
          <Card className="p-6 space-y-5 sticky top-20">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-lg">
                {ad.posterName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900">{ad.posterName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <span className="text-xs font-semibold text-emerald-700">✓ Verified Marketplace Seller</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="success"
                size="lg"
                className="w-full font-bold"
                onClick={() => callbackMutation.mutate()}
                isLoading={callbackMutation.isPending}
                icon={PhoneCall}
              >
                Request Callback
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold"
                onClick={() => navigate('/chats')}
                icon={MessageSquare}
              >
                Chat with Seller
              </Button>

              <a
                href={`tel:${ad.posterPhone}`}
                className="w-full flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call {ad.posterPhone}</span>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleFavoriteClick}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  isFavorite ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile View */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavoriteClick}
          className="shrink-0 p-2.5"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
        </Button>

        <Button
          variant="success"
          size="sm"
          className="flex-1 font-bold text-xs"
          onClick={() => callbackMutation.mutate()}
          isLoading={callbackMutation.isPending}
        >
          Request Call
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="flex-1 font-bold text-xs"
          onClick={() => navigate('/chats')}
        >
          Chat
        </Button>
      </div>

      {/* Similar Listings Section */}
      {similarListings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-black text-slate-900">Similar Listings You May Like</h2>
          <ListingGrid listings={similarListings} />
        </div>
      )}

      {/* Report Modal */}
      <ReportAdModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        adId={ad.id}
        adTitle={ad.title}
      />
    </div>
  );
};
