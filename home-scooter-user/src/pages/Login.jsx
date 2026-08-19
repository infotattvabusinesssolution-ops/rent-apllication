import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [phone, setPhone] = useState('9876543210');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    const success = await login({ phone: `+91 ${phone}` });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Left Branding */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl mb-6">
              H&S
            </div>
            <h2 className="text-3xl font-black leading-tight">Welcome to Home & Scooter Marketplace</h2>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Sign in to post advertisements, save your favorite listings, chat with verified sellers, and manage your ₹100 ad-free membership.
            </p>
          </div>

          <div className="space-y-2 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Seller Callbacks
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Post Plots, Houses & EVs
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ₹100 Ad-Free Membership
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Sign In to Continue</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your mobile number to receive OTP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition-all">
                <span className="px-3 text-xs font-bold text-slate-500 border-r border-slate-200">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full p-3 text-sm font-bold text-slate-900 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold" isLoading={isLoading}>
              Continue with OTP <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="relative text-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">Or</span>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleSubmit}
            className="w-full text-xs font-bold"
          >
            Continue with Google
          </Button>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
            >
              Skip Now & Browse as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
