import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { LocationSelectorModal } from '../marketplace/LocationSelectorModal';
import {
  MapPin,
  Search,
  PlusCircle,
  Bell,
  User,
  Heart,
  FileText,
  Crown,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, selectedLocation, logout } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: '🎁 Lucky Draw', path: '/lucky-draw', highlight: true },
    { label: 'Sell', path: '/sell' },
    { label: 'Post Ad', path: '/post-ad' },
    { label: 'Categories', path: '/categories' },
    { label: 'Near Me', path: '/near-me' },
    { label: 'New Ads', path: '/new-ads' },
    { label: 'Visitor Win', path: '/visitor-win' },
  ];



  return (
    <>
      <header className="hidden lg:block sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Brand Logo & Location */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-lg">
                  H&S
                </div>
                <div className="hidden sm:block">
                  <span className="text-base font-black text-slate-900 tracking-tight block leading-tight">
                    Home & Scooter
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase block">
                    User Marketplace
                  </span>
                </div>
              </Link>

              {/* Location Picker */}
              <button
                onClick={() => setIsLocationOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[130px] truncate">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Middle: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    } ${link.highlight ? 'text-emerald-600 font-extrabold' : ''}`}
                  >
                    {link.highlight && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/search"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Post Ad Button */}
              <Button
                icon={PlusCircle}
                size="sm"
                onClick={() => navigate('/post-ad')}
                className="hidden sm:inline-flex"
              >
                Post Ad
              </Button>

              {/* Auth state: Profile / Login */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in-50 zoom-in-95"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.phone}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Profile
                      </Link>
                      <Link
                        to="/my-ads"
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <FileText className="w-4 h-4 text-slate-400" /> My Posted Ads
                      </Link>
                      <Link
                        to="/favorites"
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Heart className="w-4 h-4 text-slate-400" /> Favorites
                      </Link>
                      <Link
                        to="/subscription"
                        className="px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5"
                      >
                        <Crown className="w-4 h-4 text-emerald-600" /> ₹100 Subscription
                      </Link>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  );
};
