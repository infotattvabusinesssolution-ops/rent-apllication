import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { favoritesApi } from '../api/favoritesApi';
import { LocationSelectorModal } from '../components/marketplace/LocationSelectorModal';
import { toast } from 'sonner';
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
  Camera,
  Edit2,
  X,
  User as UserIcon,
  Phone,
  Mail,
  Upload,
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, selectedLocation, isAuthenticated, logout } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Edit Profile State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  const { data: favsResult } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoritesApi.getFavorites(user?.id || user?.userId || 'USR-3894'),
  });

  const favoritesCount = favsResult?.data?.length || 0;

  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'G';
  const userName = user?.name || 'Guest User';
  const userPhone = user?.phone || '+91 98765 43210';
  const userAvatar = user?.avatar || '';

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditEmail(user?.email || '');
    setEditAvatar(user?.avatar || '');
    setAvatarPreview(user?.avatar || '');
    setIsEditOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: (res) => {
      toast.success(res?.message || 'Profile & photo updated successfully!');
      setIsEditOpen(false);
      queryClient.invalidateQueries(['userProfile']);
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile');
    },
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      userId: user?.id || user?.userId,
      name: editName,
      phone: editPhone,
      email: editEmail,
      avatar: editAvatar,
    });
  };

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

      {/* User Info Card with Edit Profile Button */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 relative">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#eef2ff] border border-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center overflow-hidden shadow-xs select-none">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                initialLetter
              )}
            </div>
            <button
              onClick={openEditModal}
              className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-transform cursor-pointer"
              title="Upload Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-slate-900 text-xl truncate">{userName}</h2>
              <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600 text-white shrink-0" />
            </div>
            <p className="text-slate-500 text-xs font-light tracking-wide">{userPhone}</p>
          </div>
        </div>

        <button
          onClick={openEditModal}
          className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
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

      {/* Edit Profile & Photo Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Edit Profile & Account</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-blue-200 overflow-hidden shadow-md flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-blue-600">{initialLetter}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                    title="Change Photo"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Upload New Profile Picture
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

