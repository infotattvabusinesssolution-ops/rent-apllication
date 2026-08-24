import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { educationUserApi } from '../../api/educationUserApi';
import { educationAuthStorage } from '../../utils/educationAuthStorage';
import { toast } from 'sonner';
import {
  GraduationCap,
  CheckCircle,
  Copy,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
} from 'lucide-react';

export const EducationRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    educationLevel: '12TH',
    classStandard: '',
    course: '',
    place: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile) {
      toast.error('Full Name and Mobile Number are required');
      return;
    }

    setLoading(true);
    try {
      const res = await educationUserApi.registerStudent(formData);
      if (res.success) {
        educationAuthStorage.setToken(res.token);
        educationAuthStorage.setStudent(res.data);
        setRegisteredData({
          educationStudentId: res.educationStudentId,
          generatedPassword: res.generatedPassword,
          student: res.data,
        });
        toast.success('Registration successful! Welcome to Education Desk.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (registeredData?.educationStudentId) {
      navigator.clipboard.writeText(registeredData.educationStudentId);
      toast.success('Education Desk ID copied to clipboard!');
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
          <h2 className="text-2xl font-black text-slate-900">Student Registration</h2>
          <p className="text-xs text-slate-500 font-medium">
            Join Education Desk to get your official Student Pass Card (EDU-2026-XXXXX).
          </p>
        </div>

        {/* Digital Pass Card View upon success */}
        {registeredData ? (
          <div className="space-y-6">
            {/* Digital Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl space-y-5 border border-indigo-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-300 font-extrabold text-xs tracking-widest uppercase">
                    STUDENT DIGITAL PASS
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EDUCATION DESK ID</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-black font-mono text-indigo-300 tracking-wider">
                    {registeredData.educationStudentId}
                  </p>
                  <button
                    onClick={handleCopyId}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1"
                    title="Copy Education ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">STUDENT NAME</p>
                  <p className="font-bold text-white mt-0.5">{registeredData.student?.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">QUALIFICATION LEVEL</p>
                  <p className="font-bold text-indigo-300 mt-0.5">{registeredData.student?.educationLevel}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/education/dashboard')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              Continue to Student Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahamad Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Place / City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={formData.place}
                      onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course / Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Science / CSE / Mechanical"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Set account password (min 6 chars)"
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
                {loading ? 'Generating Education ID...' : 'Register & Generate Student ID'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already registered?{' '}
              <Link to="/education/login" className="font-bold text-indigo-600 hover:underline">
                Log In here
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
