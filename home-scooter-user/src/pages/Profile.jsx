import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { favoritesApi } from '../api/favoritesApi';
import { LocationSelectorModal } from '../components/marketplace/LocationSelectorModal';
import {
  ArrowLeft,
  Heart,
  Award,
  MapPin,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, selectedLocation, isAuthenticated, logout } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const { data: favsResult } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoritesApi.getFavorites(user?.id || user?.userId || 'USR-3894'),
  });

  const favoritesCount = favsResult?.data?.length || 0;

  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'G';
  const userName = user?.name || 'Guest User';
  const userPhone = user?.phone || '+91 98765 43210';

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-2 sm:px-0 font-serif">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Profile & Account
        </h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#eef2ff] border border-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center shrink-0 shadow-xs select-none">
          {initialLetter}
        </div>
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-bold text-slate-900 text-xl truncate">{userName}</h2>
            <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600 text-white shrink-0" />
          </div>
          <p className="text-slate-500 text-xs font-light tracking-wide">{userPhone}</p>
        </div>
      </div>

      {/* Subscription Model Banner (Vibrant Blue Card) */}
      <div className="bg-blue-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-md shadow-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Subscription Model</h3>
            <p className="text-blue-100 text-xs font-light">Become a Subscriber for Just ₹100/-</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/subscription')}
          className="bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
        >
          Subscribe
        </button>
      </div>

      {/* Menu Cards List */}
      <div className="space-y-3 pt-1">
        {/* Menu Item 1: My Favorites */}
        <div
          onClick={() => navigate('/favorites')}
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                My Favorites
              </h4>
              <p className="text-slate-400 text-xs font-light">
                {favoritesCount} {favoritesCount === 1 ? 'saved listing' : 'saved listings'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* Menu Item 2: Subscription Model */}
        <div
          onClick={() => navigate('/subscription')}
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                Subscription Model
              </h4>
              <p className="text-slate-400 text-xs font-light">
                Exclusive benefits & ad-free access (₹100)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* Menu Item 3: My Selected Location */}
        <div
          onClick={() => setIsLocationOpen(true)}
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                My Selected Location
              </h4>
              <p className="text-slate-400 text-xs font-light">
                {selectedLocation || 'Bangalore, Karnataka'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* Menu Item 4: Call Back Requests Received */}
        <div
          onClick={() => navigate('/notifications')}
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                Call Back Requests Received
              </h4>
              <p className="text-slate-400 text-xs font-light">1 notifications</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* Menu Item 5: Privacy & Safety Guidelines */}
        <div
          onClick={() => navigate('/privacy-safety')}
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                Privacy & Safety Guidelines
              </h4>
              <p className="text-slate-400 text-xs font-light">Verified listing rules</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {/* Log Out Button */}
      <div className="pt-3">
        <button
          onClick={logout}
          className="w-full bg-[#fdf2f2] border border-red-200/80 text-red-600 font-bold text-base py-4 rounded-3xl flex items-center justify-center gap-2 hover:bg-red-100/60 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </div>
  );
};
