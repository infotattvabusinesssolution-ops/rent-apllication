import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { premiumUserApi } from '../../api/premiumUserApi';
import { premiumAuthStorage } from '../../utils/premiumAuthStorage';
import { toast } from 'sonner';
import { Lock, Crown, ArrowLeft, LogIn, AlertCircle } from 'lucide-react';

export const PremiumLogin = () => {
  const navigate = useNavigate();
  const [premiumMemberId, setPremiumMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!premiumMemberId.trim() || !password) {
      toast.error('Please enter your Premium Member ID and Password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await premiumUserApi.login({
        premiumMemberId: premiumMemberId.trim(),
        password,
      });

      if (res.success && res.token) {
        premiumAuthStorage.setToken(res.token);
        premiumAuthStorage.setMember(res.member);
        toast.success(res.message || 'Logged in to Premium Access!');
        navigate('/premium/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid Premium Member ID or Password';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">⭐ Premium Login</h1>
          <p className="text-xs text-slate-500">
            Enter your assigned Premium Member ID and password to access protected content.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Premium Member ID / Mobile *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PREM-2026-00001"
              value={premiumMemberId}
              onChange={(e) => setPremiumMemberId(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="w-4 h-4" /> LOGIN TO PREMIUM DASHBOARD
              </>
            )}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs space-y-2">
          <p className="text-slate-500">
            Don't have a Premium account yet?{' '}
            <Link to="/premium/renew" className="font-bold text-amber-600 hover:underline">
              Upgrade Now
            </Link>
          </p>

          <Link to="/premium" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-[11px]">
            <ArrowLeft className="w-3 h-3" /> Back to Premium Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
