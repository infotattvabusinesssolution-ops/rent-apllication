import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Heart, MapPin, Eye, Star, Flame, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency, formatCompactViews, timeAgo } from '../../utils/formatters';
import { favoritesApi } from '../../api/favoritesApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export const ListingCard = ({ ad, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(ad.isFavorite || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setIsSaving(true);
    try {
      const targetId = ad.id || ad.adId || ad._id;
      const res = await favoritesApi.toggleFavorite(targetId, user?.id || user?.userId || 'USR-3894');
      setIsFavorite(res.isFavorite);
      queryClient.invalidateQueries(['myFavorites']);
      toast.success(res.isFavorite ? 'Saved to Favorites' : 'Removed from Favorites');
      if (onFavoriteToggle) onFavoriteToggle(targetId, res.isFavorite);
    } catch (err) {
      toast.error('Unable to update favorite');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/ad/${ad.id}`)}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={ad.imageUrls[0]}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Top Overlays */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {ad.rank && (
              <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                #{ad.rank}
              </span>
            )}
            {ad.isFeatured && (
              <Badge variant="purple" size="sm" className="shadow-md">
                <Star className="w-2.5 h-2.5 mr-0.5 fill-purple-600" /> Featured
              </Badge>
            )}
            {ad.isHighDemand && (
              <Badge variant="warning" size="sm" className="shadow-md">
                <Flame className="w-2.5 h-2.5 mr-0.5 text-amber-600 fill-amber-500" /> High Demand
              </Badge>
            )}
            {(ad.luckyDrawStatus === 'APPLY' || ad.isLuckyDrawEligible) && (
              <Badge variant="danger" size="sm" className="shadow-md animate-pulse">
                🎁 Lucky Draw
              </Badge>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            disabled={isSaving}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Save Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Bottom Distance Pill if present */}
          {ad.distanceKm && (
            <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-teal-400" />
              <span>{ad.distanceKm} km away</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-3.5 space-y-2">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-slate-900 leading-tight">
              {formatCurrency(ad.price)}
              {ad.priceUnit !== '₹' && (
                <span className="text-xs font-semibold text-slate-500 ml-1">{ad.priceUnit}</span>
              )}
            </span>
            <Badge variant="teal" size="sm">{ad.category}</Badge>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h3>

          {/* Location */}
          <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{ad.location}</span>
          </p>

          {/* Category Specific Attributes */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 pt-1">
            {ad.dimensions && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md truncate">{ad.dimensions}</span>
            )}
            {ad.bhk && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">{ad.bhk}</span>
            )}
            {ad.batteryRangeKm && (
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md truncate">🔋 {ad.batteryRangeKm}</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="px-3.5 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-slate-400" />
          {formatCompactViews(ad.viewsCount)}
        </span>
        <span>{timeAgo(ad.postedAt)}</span>
      </div>
    </div>
  );
};
