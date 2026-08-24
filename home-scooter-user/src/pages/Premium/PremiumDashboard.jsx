import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { premiumUserApi } from '../../api/premiumUserApi';
import { premiumAuthStorage } from '../../utils/premiumAuthStorage';
import { toast } from 'sonner';
import {
  Crown,
  FileText,
  Image as ImageIcon,
  Video,
  LogOut,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const PremiumDashboard = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('ALL');

  const token = premiumAuthStorage.getToken();
  const member = premiumAuthStorage.getMember();

  // Guard check
  if (!token) {
    navigate('/premium/login', { replace: true });
  }

  // Fetch Member Profile & Membership Status
  const { data: membershipData } = useQuery({
    queryKey: ['premiumUserMembership'],
    queryFn: () => premiumUserApi.getMembership(),
    onError: (err) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error(err.response?.data?.message || 'Premium session expired or invalid');
        premiumAuthStorage.clear();
        navigate('/premium/login');
      }
    },
  });

  // Fetch Protected Content
  const { data: contentData, isLoading } = useQuery({
    queryKey: ['premiumUserContent', selectedType],
    queryFn: () => premiumUserApi.getPremiumContent({ contentType: selectedType }),
    enabled: Boolean(token),
  });

  const handleLogout = async () => {
    try {
      await premiumUserApi.logout();
    } catch (e) {}
    premiumAuthStorage.clear();
    toast.success('Logged out from Premium Access');
    navigate('/premium');
  };

  const membershipInfo = membershipData?.data || {};
  const contentItems = contentData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-200" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-yellow-100 bg-amber-400/30 px-2.5 py-0.5 rounded-full">
                  ACTIVE PREMIUM MEMBER
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black">
                Welcome, {member?.userName || membershipInfo.userName || 'Premium Member'}
              </h1>

              <p className="text-amber-100 text-xs sm:text-sm font-mono">
                Premium ID: <span className="font-bold text-white bg-amber-700/50 px-2 py-0.5 rounded-md">{member?.premiumMemberId || membershipInfo.premiumMemberId}</span>
              </p>
            </div>

            {/* Quick Actions & Expiry Counter */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right space-y-1">
              <div className="flex items-center gap-1.5 justify-end text-xs text-amber-100 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                Days Remaining: <span className="font-black text-white text-base">{membershipInfo.daysRemaining || 0}</span>
              </div>
              <p className="text-[10px] text-amber-200">
                Expires: {membershipInfo.expiryDate ? new Date(membershipInfo.expiryDate).toLocaleDateString() : 'N/A'}
              </p>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Link
                  to="/premium/renew"
                  className="px-3 py-1.5 bg-white text-amber-800 font-extrabold text-[11px] rounded-xl hover:bg-amber-50 transition-all"
                >
                  Renew Plan
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section Filter Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedType === 'ALL'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" /> All Content
            </button>

            <button
              onClick={() => setSelectedType('TEXT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedType === 'TEXT'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" /> 📝 Important Text
            </button>

            <button
              onClick={() => setSelectedType('BANNER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedType === 'BANNER'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> 🖼️ Premium Banners
            </button>

            <button
              onClick={() => setSelectedType('VIDEO')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedType === 'VIDEO'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Video className="w-4 h-4" /> 🎥 Premium Videos
            </button>
          </div>

          <Link
            to="/premium/membership"
            className="text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
          >
            View My Membership Details →
          </Link>
        </div>

        {/* Content Feed Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
            <p className="text-base font-bold text-slate-800">No Premium Content in this category</p>
            <p className="text-xs text-slate-400">Admin has not published any items for this section yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <div
                key={item.contentId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                        item.contentType === 'VIDEO'
                          ? 'bg-purple-100 text-purple-700'
                          : item.contentType === 'BANNER'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.contentType}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {item.contentType !== 'TEXT' && item.mediaUrl && (
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                      {item.contentType === 'VIDEO' ? (
                        <video
                          src={item.mediaUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{item.description}</p>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  <Link
                    to={`/premium/content/${item.contentId}`}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Premium Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
