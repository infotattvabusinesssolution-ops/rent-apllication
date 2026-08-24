import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { educationUserApi } from '../../api/educationUserApi';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  FileText,
  Building,
  Bell,
  ArrowRight,
  CheckCircle,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const EducationLanding = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['educationPublicInfo'],
    queryFn: () => educationUserApi.getPublicInfo(),
  });

  const info = data?.data || {};

  return (
    <div className="min-h-screen bg-slate-50 space-y-12 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold uppercase tracking-widest">
            <GraduationCap className="w-4 h-4" />
            Official Student Desk Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            EDUCATION DESK
          </h1>

          <p className="text-xl sm:text-2xl font-black text-indigo-300 tracking-wide">
            Learn • Stay Updated • Move Forward.
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Your single destination for verified educational updates, board exam schedules, college admissions, competitive exams, scholarship alerts, and career opportunities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/education/register')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
            >
              Join Education Desk
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/education/login')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
            >
              Student Login (EDU ID)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Eligibility Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">Who Can Join Education Desk?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              '10th Standard',
              '11th Standard',
              '12th Standard',
              'Diploma Students',
              'Undergraduate (UG)',
              'Postgraduate (PG)',
              'Job Seekers',
              'Competitive Aspirants',
            ].map((level) => (
              <div key={level} className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60 text-xs font-bold text-indigo-900">
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Explore Educational Resources</h2>
            <p className="text-xs text-slate-500">Access exclusive updates tailored specifically for your qualification level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Education Updates</h3>
              <p className="text-xs text-slate-500">Stay informed on board exam timetables, syllabus changes, and education department notices.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Featured Courses & Admissions</h3>
              <p className="text-xs text-slate-500">Discover verified diploma, engineering, medical, management, and skill certification courses.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Career & Scholarships</h3>
              <p className="text-xs text-slate-500">Find job openings for freshers, government recruitment notices, and merit scholarship schemes.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Ready to accelerate your educational journey?</h3>
            <p className="text-xs text-indigo-100">Register in under 1 minute to receive your digital Education Desk ID card.</p>
          </div>
          <button
            onClick={() => navigate('/education/register')}
            className="px-6 py-3 bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-md shrink-0 transition-all"
          >
            Get Student ID Now
          </button>
        </div>
      </div>
    </div>
  );
};
