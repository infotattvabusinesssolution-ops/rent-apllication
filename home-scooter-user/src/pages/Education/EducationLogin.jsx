import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { educationUserApi } from '../../api/educationUserApi';
import { educationAuthStorage } from '../../utils/educationAuthStorage';
import { toast } from 'sonner';
import { GraduationCap, Lock, Phone, UserCheck } from 'lucide-react';

export const EducationLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error('Education Desk ID or Mobile Number and Password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await educationUserApi.loginStudent(formData);
      if (res.success) {
        educationAuthStorage.setToken(res.token);
        educationAuthStorage.setStudent(res.data);
        toast.success(`Welcome back, ${res.data?.fullName}!`);
        navigate('/education/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Student Login</h2>
          <p className="text-xs text-slate-500 font-medium">
            Log in with your Education Desk ID (EDU-2026-XXXXX) or registered Mobile Number.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education Desk ID or Mobile *</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. EDU-2026-00001 or 9876543210"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex justify-center"
            >
              {loading ? 'Logging in...' : 'Sign In to Student Desk'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an Education ID?{' '}
            <Link to="/education/register" className="font-bold text-indigo-600 hover:underline">
              Register Student Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
