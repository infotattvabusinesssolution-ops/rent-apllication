import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter your email address / phone and password');
      return;
    }

    const success = await login({
      email: email.trim(),
      password,
    });

    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-between py-4 px-3 sm:px-4 max-w-lg mx-auto font-serif">
      <div className="pt-2" />

      {/* Main Title Section */}
      <div className="space-y-1 mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] tracking-tight">
          Welcome Back
        </h1>
        <p className="text-slate-500 font-serif font-light text-sm">
          Login to continue managing your rental listings
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: EMAIL ADDRESS */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-serif">
              EMAIL ADDRESS
            </label>
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3 focus-within:border-[#0d7a60] focus-within:bg-white transition-all">
              <Mail className="w-5 h-5 text-[#0d7a60] shrink-0" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent font-serif text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-serif outline-none"
                required
              />
            </div>
          </div>

          {/* Field 2: PASSWORD */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-serif">
              PASSWORD
            </label>
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3 focus-within:border-[#0d7a60] focus-within:bg-white transition-all relative">
              <Lock className="w-5 h-5 text-[#0d7a60] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent font-serif text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-serif outline-none pr-8"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0d7a60] hover:bg-[#0b6851] active:scale-[0.99] text-white font-serif font-bold text-base py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-[#0d7a60]/20 transition-all flex items-center justify-center cursor-pointer mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="text-center pt-8 pb-2 text-xs font-serif text-slate-500">
        <span>Don't have an account? </span>
        <Link to="/register" className="font-bold text-[#0d7a60] hover:underline">
          Register Now
        </Link>
      </div>
    </div>
  );
};
