import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Crown,
  FileText,
  Heart,
  Sparkles,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-black text-slate-900">Sign in to View Profile</h2>
        <p className="text-xs text-slate-500">Log in to manage your posted ads, saved favorites, and subscription membership</p>
        <Button onClick={() => navigate('/login')} size="lg" className="w-full">
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Profile Header Card */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl border-blue-900 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/40 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black">{user?.name}</h1>
              <Badge variant="success">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
              </Badge>
              {user?.isSubscribed && (
                <Badge variant="warning">
                  <Crown className="w-3 h-3 mr-0.5 fill-amber-500" /> SUBSCRIBER
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2 pt-1 font-medium">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> {user?.phone}
              <span>•</span>
              <Mail className="w-3.5 h-3.5 text-blue-400" /> {user?.email}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 bg-white/10 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Posted Ads</span>
            <span className="text-xl font-black text-white">{user?.postedAdsCount || 4}</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Favorites</span>
            <span className="text-xl font-black text-white">{user?.favoriteAdsIds?.length || 2}</span>
          </div>
        </div>
      </Card>

      {/* Menu Options */}
      <Card className="p-2 divide-y divide-slate-100 rounded-2xl">
        <button
          onClick={() => navigate('/my-ads')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">My Posted Advertisements</p>
              <p className="text-xs text-slate-500">Manage listings, view status & leads</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={() => navigate('/favorites')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Heart className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Saved Favorites</p>
              <p className="text-xs text-slate-500">Your bookmarked plots, flats & scooters</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={() => navigate('/subscription')}
          className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Crown className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="font-bold text-emerald-900 text-sm">₹100 Subscription Membership</p>
              <p className="text-xs text-emerald-700">10 Days ad-free access & exclusive facilities</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-600" />
        </button>

        <button
          onClick={() => navigate('/visitor-win')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Sparkles className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Visitor Win Event</p>
              <p className="text-xs text-slate-500">Register for promotional contest opportunities</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </Card>

      <div className="pt-2">
        <Button variant="danger" size="lg" className="w-full font-bold" onClick={logout} icon={LogOut}>
          Logout Account
        </Button>
      </div>
    </div>
  );
};
