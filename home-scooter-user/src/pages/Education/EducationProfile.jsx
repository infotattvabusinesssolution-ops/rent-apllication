import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationUserApi } from '../../api/educationUserApi';
import { educationAuthStorage } from '../../utils/educationAuthStorage';
import { toast } from 'sonner';
import {
  GraduationCap,
  User,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Copy,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const EducationProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cachedStudent = educationAuthStorage.getStudent();

  const { data, isLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => educationUserApi.getProfile(),
  });

  const student = data?.data || cachedStudent;

  const [formData, setFormData] = useState({
    fullName: student?.fullName || '',
    email: student?.email || '',
    educationLevel: student?.educationLevel || '12TH',
    classStandard: student?.classStandard || '',
    course: student?.course || '',
    place: student?.place || '',
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => educationUserApi.updateProfile(payload),
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      educationAuthStorage.setStudent(res.data);
      queryClient.invalidateQueries(['studentProfile']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });

  const handleLogout = () => {
    educationUserApi.logoutStudent().finally(() => {
      educationAuthStorage.clear();
      toast.success('Logged out successfully');
      navigate('/education/login');
    });
  };

  const handleCopyId = () => {
    if (student?.educationStudentId) {
      navigator.clipboard.writeText(student.educationStudentId);
      toast.success('Education ID copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Digital Pass Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-indigo-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              <span className="text-indigo-300 font-extrabold text-xs tracking-widest uppercase">
                STUDENT DIGITAL PASS
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EDUCATION DESK ID</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl sm:text-3xl font-black font-mono text-indigo-300 tracking-wider">
                {student?.educationStudentId || 'EDU-2026-00001'}
              </p>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                title="Copy Education ID"
              >
                <Copy className="w-4 h-4" /> Copy ID
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">FULL NAME</p>
              <p className="font-bold text-white text-sm mt-0.5">{student?.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">REGISTERED MOBILE</p>
              <p className="font-bold text-white text-sm mt-0.5">{student?.mobile || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Profile Editor Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-indigo-600" />
            Edit Student Details
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate(formData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                >
                  <option value="10TH">10th Standard</option>
                  <option value="11TH">11th Standard</option>
                  <option value="12TH">12th Standard</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                  <option value="JOB_SEEKER">Job Seeker</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course / Stream</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Place / City</label>
                <input
                  type="text"
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
