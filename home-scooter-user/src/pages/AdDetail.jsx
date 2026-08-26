import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { callbackApi } from '../api/callbackApi';
import { chatApi } from '../api/chatApi';
import { favoritesApi } from '../api/favoritesApi';
import { ReportAdModal } from '../components/marketplace/ReportAdModal';
import { CustomerVerifiedSlipModal } from '../components/marketplace/CustomerVerifiedSlipModal';
import { LuckyDrawInterestModal } from '../components/LuckyDraw/LuckyDrawInterestModal';
import { formatCurrency, formatCompactViews, timeAgo } from '../utils/formatters';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Eye,
  Ruler,
  Hash,
  Compass,
  ThumbsUp,
  Flag,
  ShieldCheck,
  MessageSquare,
  Gift,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCvsOpen, setIsCvsOpen] = useState(false);
  const [isLuckyDrawModalOpen, setIsLuckyDrawModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);


  const { data: ad, isLoading, isError } = useQuery({
    queryKey: ['adDetail', id],
    queryFn: async () => {
      const data = await adsApi.getAdById(id);
      setIsFavorite(data.isFavorite || false);
      return data;
    },
  });

  const callbackMutation = useMutation({
    mutationFn: () => callbackApi.requestCallback(id),
    onSuccess: (res) => {
      toast.success(res.message || 'Interest registered! Seller will call you back.');
    },
  });

  const handleStartChat = async () => {
    try {
      const res = await chatApi.startChat({
        adId: ad?.id || ad?.adId || id,
        buyerId: user?.id || user?.userId || 'USR-8821',
        buyerName: user?.name || 'Buyer',
        buyerPhone: user?.phone || '',
      });
      if (res?.success && res?.chat) {
        navigate(`/chats/${res.chat.id || res.chat.chatId}`);
      } else {
        toast.error('Unable to start chat with seller');
      }
    } catch (e) {
      toast.error('Failed to start chat');
    }
  };

  const handleFavoriteClick = async () => {
    try {
      const targetId = ad?.id || ad?.adId || id;
      const res = await favoritesApi.toggleFavorite(targetId, user?.id || user?.userId || 'USR-8821');
      setIsFavorite(res.isFavorite);
      queryClient.invalidateQueries(['myFavorites']);
      toast.success(res.isFavorite ? 'Saved to Favorites' : 'Removed from Favorites');
    } catch (e) {
      setIsFavorite(!isFavorite);
      toast.success(!isFavorite ? 'Saved to Favorites' : 'Removed from Favorites');
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
      <div className="max-w-lg mx-auto space-y-4 py-4 animate-pulse">
        <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate-800">Listing Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-serif font-bold text-sm"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const galleryImages = ad.imageUrls && ad.imageUrls.length > 0
    ? ad.imageUrls
    : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'];

  return (
    <div className="space-y-5 pb-28 max-w-lg mx-auto px-1 sm:px-0">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="font-serif text-lg font-bold text-slate-900 truncate max-w-[200px]">
          {ad.category || 'Layout Sites'}
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            className="p-2 text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Image Carousel / Main Display with Badges */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-xs border border-slate-100">
        <div className="aspect-[4/3] w-full relative">
          <img
            src={galleryImages[activeImageIdx] || galleryImages[0]}
            alt={ad.title}
            className="w-full h-full object-cover"
          />

          {/* Floating Category Badge (Top Left) */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold text-slate-900 z-10">
            <span>{ad.category === 'Layout Sites' ? '🗺️' : ad.category === 'Electric Scooters' ? '🛵' : '🏢'}</span>
            <span>{ad.category}</span>
          </div>

          {/* Floating Lucky Draw Badge / Image Thumbnail (Top Right Corner) */}
          {(ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsLuckyDrawModalOpen(true);
              }}
              className="absolute top-3 right-3 z-20 bg-gradient-to-r from-red-600 to-amber-500 text-white p-1.5 pl-2.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all animate-pulse"
              title="Lucky Draw Active - Click to express interest!"
            >
              {ad.luckyDrawImage ? (
                <img
                  src={ad.luckyDrawImage}
                  alt="Lucky Draw Offer"
                  className="w-8 h-8 rounded-full object-cover border border-white shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
                  🎁
                </div>
              )}
              <span className="text-[10px] font-black uppercase tracking-wider pr-1.5">
                Lucky Draw
              </span>
            </div>
          )}

          {/* Floating High Demand / Featured Badge (Below Top Right) */}
          {(ad.isHighDemand || ad.isFeatured) && !(ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-full shadow-md text-[10px] font-black tracking-wider uppercase flex items-center gap-1 z-10">
              <span>📈 HIGH DEMAND</span>
            </div>
          )}
        </div>
      </div>

      {/* Ad Title & Price / Views Header */}
      <div className="space-y-2">
        <h2 className="font-serif font-bold text-slate-900 text-xl sm:text-2xl leading-snug">
          {ad.title}
        </h2>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-blue-600 font-serif text-2xl sm:text-3xl font-black">
              {formatCurrency(ad.price)}
            </span>
            <span className="text-slate-400 font-light text-xs font-serif">
              {ad.priceUnit && ad.priceUnit !== '₹' ? ad.priceUnit : '/sq.ft'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-light">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{formatCompactViews(ad.viewsCount || 16400)} views</span>
          </div>
        </div>
      </div>

      {/* Lucky Draw Banner (Only displayed if marked APPLY by Admin) */}
      {(ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) && (
        <div
          onClick={() => setIsLuckyDrawModalOpen(true)}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 p-5 text-white shadow-xl shadow-red-500/20 cursor-pointer transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-2 border-amber-300/50 group"
        >
          {ad.luckyDrawImage ? (
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3 fill-slate-950" /> Lucky Draw Active
                </span>
                <span className="text-[10px] text-amber-200 font-bold tracking-wide uppercase bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  Tap Image to Participate
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-amber-300/40 shadow-lg aspect-[21/9]">
                <img
                  src={ad.luckyDrawImage}
                  alt="Lucky Draw Offer Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-serif font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30">
                <span>I am Interested to Know More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Background Decorative Graphic Light Gradients & Glow */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-red-400/30 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg shrink-0 group-hover:rotate-6 transition-transform">
                    <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center text-amber-300">
                      <Gift className="w-7 h-7 text-amber-300 animate-bounce" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                        <Sparkles className="w-3 h-3 fill-slate-950" /> Lucky Draw Active
                      </span>
                      <span className="text-[10px] text-amber-200 font-bold tracking-wide uppercase bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Admin Approved
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-base sm:text-lg leading-tight text-white tracking-wide truncate">
                      ENTER TO WIN EXCITING PRIZES 🎁
                    </h3>
                    <p className="text-[11px] sm:text-xs text-amber-100 font-serif font-medium truncate mt-0.5">
                      Click here to register interest & details to Admin WhatsApp
                    </p>
                  </div>
                </div>

                <button className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-serif font-black text-xs px-3.5 py-2.5 rounded-2xl shrink-0 flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all group-hover:translate-x-1">
                  <span>I'm Interested</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Location Box */}
      <div className="bg-[#f8fafc] border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <MapPin className="w-5 h-5 text-blue-600 fill-blue-600/10 shrink-0" />
          <span className="font-serif font-bold text-slate-800 text-xs sm:text-sm truncate">
            {ad.location || 'Ilavala & Bannur Road, Mysore, Mysore'}
          </span>
        </div>
        <span className="bg-white border border-blue-200 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
          2.1 km away
        </span>
      </div>

      {/* Item Overview & Specifications */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-slate-900 text-lg">
          {ad.category === 'Bikes' || ad.brand ? 'Vehicle Specifications' : ad.category === 'Jobs' || ad.positionType ? 'Job Details & Salary' : 'Item Overview & Specifications'}
        </h3>

        {/* Job Specifications Grid */}
        {(ad.category === 'Jobs' || ad.positionType || ad.salaryFrom || ad.salaryPeriod) ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px] font-light font-serif block">Position Type</span>
              <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {ad.positionType || 'Full-time'}
              </span>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px] font-light font-serif block">Salary Range</span>
              <span className="font-serif font-bold text-emerald-600 text-xs sm:text-sm block truncate">
                ₹{ad.salaryFrom || '0'} - ₹{ad.salaryTo || '0'}
              </span>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px] font-light font-serif block">Salary Period</span>
              <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {ad.salaryPeriod || 'Monthly'}
              </span>
            </div>
          </div>
        ) : (ad.category === 'Services' || ad.serviceType || ad.propertySubType?.includes('Repair') || ad.propertySubType?.includes('Services')) ? (
          /* Service Specifications Grid */
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px] font-light font-serif block">Service Category</span>
              <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {ad.propertySubType || ad.category || 'Services'}
              </span>
            </div>
            {(ad.serviceType || ad.type) && (
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
                <span className="text-slate-400 text-[11px] font-light font-serif block">Service Type</span>
                <span className="font-serif font-bold text-blue-700 text-xs sm:text-sm block truncate">
                  {ad.serviceType || ad.type}
                </span>
              </div>
            )}
          </div>
        ) : (ad.category === 'Bikes' || ad.brand || ad.year || ad.kmDriven) ? (
          /* Bike / Vehicle Specifications Grid */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ad.brand && (
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 space-y-1">
                <span className="text-slate-400 text-[11px] font-light block">Brand</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{ad.brand}</span>
              </div>
            )}
            {ad.year && (
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 space-y-1">
                <span className="text-slate-400 text-[11px] font-light block">Model Year</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{ad.year}</span>
              </div>
            )}
            {ad.fuel && (
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 space-y-1">
                <span className="text-slate-400 text-[11px] font-light block">Fuel Type</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{ad.fuel}</span>
              </div>
            )}
            {ad.kmDriven && (
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 space-y-1">
                <span className="text-slate-400 text-[11px] font-light block">KM Driven</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{ad.kmDriven} km</span>
              </div>
            )}
          </div>
        ) : (
          /* Property Specifications Grid */
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <Ruler className="w-5 h-5 text-blue-600 stroke-[1.8]" />
              <span className="text-slate-400 text-[11px] font-light font-serif block">
                {ad.bhk ? 'BHK / Area' : 'Dimensions'}
              </span>
              <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {ad.bhk || ad.dimensions || ad.superBuiltupArea || ad.plotArea || 'N/A'}
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <Hash className="w-5 h-5 text-blue-600 stroke-[1.8]" />
              <span className="text-slate-400 text-[11px] font-light font-serif block">
                {ad.furnishing ? 'Furnishing' : 'Listed By'}
              </span>
              <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {ad.furnishing || ad.listedBy || ad.plotNumber || 'Owner'}
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <Compass className="w-5 h-5 text-blue-600 stroke-[1.8]" />
              <span className="text-slate-400 text-[11px] font-light font-serif block">Facing</span>
              <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {ad.facing || 'East'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="font-serif font-bold text-slate-900 text-lg">Description</h3>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-serif font-light whitespace-pre-line">
          {ad.description ||
            'MUDA Approved Layout Sites in Mysore. Group site booking starting at Ilavala ₹1,799/sq.ft, Bannur Road ₹2,999/sq.ft, Jattihundi ₹2,999/sq.ft. 24-hour pure drinking water, 60 month easy advance payment plans. Down payment starts from ₹3 Lakhs only. Plot sizes: 20x40 (Total ₹24 Lakhs, EMI ₹5,000/mo), 30x40 (Total ₹36 Lakhs), 30x50 (Total ₹45 Lakhs), 40x60 (Total ₹72 Lakhs). Bank loan available.'}
        </p>
      </div>

      {/* Photo Gallery Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-slate-900 text-lg">Photo Gallery</h3>
          <span className="text-slate-400 text-xs font-light font-serif">
            {galleryImages.length} Photos
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImageIdx(idx)}
              className={`w-28 h-28 rounded-2xl overflow-hidden shrink-0 cursor-pointer transition-all ${
                activeImageIdx === idx
                  ? 'border-2 border-blue-600 ring-2 ring-blue-500/20'
                  : 'border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Ad Info & Verified Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
          <span className="font-serif font-bold text-slate-900">
            Ad ID: #{ad.id}
          </span>
          <span className="text-slate-400 font-light font-serif">
            Posted: {timeAgo(ad.postedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Verified Listing</span>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="text-red-500 border border-red-200 bg-red-50/50 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-red-500" />
            <span>Report Ad</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons ("Chat Seller" & "I'm Interested") */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto flex items-center gap-2">
        <button
          onClick={handleStartChat}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Chat Seller</span>
        </button>

        <button
          onClick={() => setIsCvsOpen(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-serif font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <ThumbsUp className="w-4 h-4 fill-white/20 text-white" />
          <span>I'm Interested</span>
        </button>
      </div>

      {/* Customer Verified Slip (CVS) Modal */}
      <CustomerVerifiedSlipModal
        isOpen={isCvsOpen}
        onClose={() => setIsCvsOpen(false)}
        ad={ad}
      />

      {/* Report Modal */}
      <ReportAdModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        adId={ad.id}
        adTitle={ad.title}
      />

      {/* Lucky Draw Interest Modal */}
      <LuckyDrawInterestModal
        isOpen={isLuckyDrawModalOpen}
        onClose={() => setIsLuckyDrawModalOpen(false)}
        ad={ad}
      />
    </div>
  );
};
