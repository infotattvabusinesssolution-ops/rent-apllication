import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { premiumUserApi } from '../../api/premiumUserApi';
import { premiumAuthStorage } from '../../utils/premiumAuthStorage';
import { Crown, ArrowLeft, Calendar, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export const PremiumMembership = () => {
  const navigate = useNavigate();
  const token = premiumAuthStorage.getToken();

  if (!token) {
    navigate('/premium/login', { replace: true });
  }

  const { data, isLoading } = useQuery({
    queryKey: ['premiumUserMembership'],
    queryFn: () => premiumUserApi.getMembership(),
  });

  const info = data?.data || {};

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/premium/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">⭐ My Premium Membership</h1>
                <p className="text-xs text-slate-500">Verified membership plan & session details</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">PREMIUM MEMBER ID</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/30">
                  {info.status || 'ACTIVE'}
                </span>
              </div>

              <p className="text-2xl font-mono font-black text-amber-400">{info.premiumMemberId}</p>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700 text-xs">
                <div>
                  <p className="text-slate-400">Member Name</p>
                  <p className="font-bold text-white mt-0.5">{info.userName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="font-bold text-white mt-0.5">{info.userPhone}</p>
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Active Plan</span>
                <span className="font-bold text-amber-600">{info.plan}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Start Date</span>
                <span className="font-bold text-slate-800">
                  {info.startDate ? new Date(info.startDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Expiry Date</span>
                <span className="font-bold text-slate-800">
                  {info.expiryDate ? new Date(info.expiryDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Days Remaining</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  {info.daysRemaining || 0} Days
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/premium/renew"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Renew / Extend Membership Plan
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
