import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { premiumUserApi } from '../../api/premiumUserApi';
import { premiumAuthStorage } from '../../utils/premiumAuthStorage';
import {
  Sparkles,
  FileText,
  Image as ImageIcon,
  Video,
  ShieldCheck,
  ArrowRight,
  LogIn,
  Crown,
  CheckCircle2,
} from 'lucide-react';

export const PremiumIntro = () => {
  const navigate = useNavigate();
  const token = premiumAuthStorage.getToken();

  // If already logged in as a Premium Member, redirect to dashboard
  if (token) {
    navigate('/premium/dashboard', { replace: true });
  }

  const { data } = useQuery({
    queryKey: ['premiumPublicInfo'],
    queryFn: () => premiumUserApi.getPublicInfo(),
  });

  const plans = data?.plans || [
    { name: '1 Month', price: 299, duration: '30 Days', popular: false },
    { name: '3 Months', price: 799, duration: '90 Days', popular: true },
    { name: '6 Months', price: 1499, duration: '180 Days', popular: false },
    { name: '12 Months', price: 2499, duration: '365 Days', popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-amber-500/20 text-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Crown className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/30 border border-amber-300/30 rounded-full text-xs font-bold text-yellow-100 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              Exclusive Access Portal
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ⭐ Home Scooter Premium Membership
            </h1>

            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Unlock verified market intelligence, priority scooter & property banner showcases, and exclusive video walkthroughs reserved strictly for active Premium Members.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/premium/login"
                className="w-full sm:w-auto px-6 py-3 bg-white text-amber-700 font-extrabold text-sm rounded-2xl shadow-lg hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                LOGIN TO PREMIUM
              </Link>

              <Link
                to="/premium/renew"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                UPGRADE TO PREMIUM
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">📝 Important Text</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get official market analysis, verified rental price guides, and instant alert advisories directly from market experts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">🖼️ Premium Banners</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse high-resolution promotional banners highlighting top electric scooters and prime real estate offerings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">🎥 Premium Videos</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Watch high-definition video reviews, vehicle test drives, and full virtual property tours before making decisions.
            </p>
          </div>
        </div>

        {/* Membership Plans Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Choose Your Membership Plan</h2>
            <p className="text-xs text-slate-500">
              Select a plan duration below to submit your upgrade request and obtain instant Premium Member credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  plan.popular
                    ? 'border-amber-500 bg-amber-50/40 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow">
                    Most Popular
                  </span>
                )}

                <div className="space-y-3 text-center">
                  <h3 className="text-sm font-extrabold text-slate-900">{plan.name}</h3>
                  <div>
                    <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                    <span className="text-[11px] text-slate-400"> / {plan.duration}</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 space-y-2 text-left pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Full Access to Text Posts
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> HD Media & Banner Views
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Full Video Streaming
                    </li>
                  </ul>
                </div>

                <Link
                  to={`/premium/renew?plan=${encodeURIComponent(plan.name)}`}
                  className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
                    plan.popular
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Select {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
