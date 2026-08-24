import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`;

    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      phone: formattedPhone,
      password,
    };

    const success = await register(payload);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-4 px-3 sm:px-4 max-w-lg mx-auto font-serif">
      {/* Top Header: Back Button */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Title Section */}
      <div className="space-y-1 mb-5">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] tracking-tight">
          Create Account
        </h1>
        <p className="text-slate-500 font-serif font-light text-sm">
          Sign up to explore & post listings easily
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: FULL NAME */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-serif">
              FULL NAME
            </label>
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3 focus-within:border-[#0d7a60] focus-within:bg-white transition-all">
              <User className="w-5 h-5 text-[#0d7a60] shrink-0" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-transparent font-serif text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-serif outline-none"
                required
              />
            </div>
          </div>

          {/* Field 2: EMAIL ADDRESS */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-serif">
              EMAIL ADDRESS
            </label>
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3 focus-within:border-[#0d7a60] focus-within:bg-white transition-all">
              <Mail className="w-5 h-5 text-[#0d7a60] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent font-serif text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-serif outline-none"
                required
              />
            </div>
          </div>

          {/* Field 3: PHONE NUMBER */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-serif">
              PHONE NUMBER
            </label>
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-2.5 focus-within:border-[#0d7a60] focus-within:bg-white transition-all">
              <Phone className="w-5 h-5 text-[#0d7a60] shrink-0" />
              <span className="font-serif font-bold text-sm text-slate-700 select-none pr-2 border-r border-slate-200">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full bg-transparent font-serif text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-serif outline-none"
                required
              />
            </div>
          </div>

          {/* Field 4: PASSWORD */}
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

          {/* Field 5: CONFIRM PASSWORD */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-serif">
              CONFIRM PASSWORD
            </label>
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3 focus-within:border-[#0d7a60] focus-within:bg-white transition-all relative">
              <Shield className="w-5 h-5 text-[#0d7a60] shrink-0" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent font-serif text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-serif outline-none pr-8"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0d7a60] hover:bg-[#0b6851] active:scale-[0.99] text-white font-serif font-bold text-base py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-[#0d7a60]/20 transition-all flex items-center justify-center cursor-pointer mt-5 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="text-center pt-6 pb-2 text-xs font-serif text-slate-500">
        <span>Already have an account? </span>
        <Link to="/login" className="font-bold text-[#0d7a60] hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};
