import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { educationAdminApi } from '../../api/educationAdminApi';
import {
  GraduationCap,
  Users,
  BookOpen,
  Bell,
  CheckCircle,
  Clock,
  ShieldAlert,
  TrendingUp,
  FileText,
  Video,
  Award,
} from 'lucide-react';

export const EducationDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['educationAdminDashboardStats'],
    queryFn: () => educationAdminApi.getDashboardStats(),
    refetchInterval: 5000,
  });

  const stats = data?.stats || {};
  const categoryPopularity = data?.categoryPopularity || [];
  const recentStudents = data?.recentStudents || [];
  const recentContent = data?.recentContent || [];
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <GraduationCap className="w-4 h-4" />
            Education Desk SaaS Platform
          </div>
          <h1 className="text-2xl font-black mt-1">Education Desk Admin Console</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Learn • Stay Updated • Move Forward. Monitor student registrations, manage course content, broadcast notifications, and view real-time engagement.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalStudents || 0}</p>
          <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />+{stats.todayJoinedStudents || 0} registered today
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Students</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.activeStudents || 0}</p>
          <p className="text-[10px] text-slate-400 font-semibold">{stats.blockedStudents || 0} accounts blocked</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Published Content</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.publishedContent || 0}</p>
          <p className="text-[10px] text-slate-400 font-semibold">{stats.draftContent || 0} drafts pending</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today Content Views</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.todayContentViews || 0}</p>
          <p className="text-[10px] font-semibold text-purple-600">{stats.todayVideoViews || 0} video streams</p>
        </div>
      </div>

      {/* Second Row: Category Engagement Breakdown & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Category Popularity
          </h2>
          <div className="space-y-3">
            {categoryPopularity.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No content views recorded yet</p>
            ) : (
              categoryPopularity.map((cat) => (
                <div key={cat._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{cat._id?.replace('_', ' ')}</span>
                    <span className="text-indigo-600 font-black">{cat.totalViews} views ({cat.count} items)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (cat.totalViews / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Registered Students */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Recent Student Registrations
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Student Name</th>
                  <th className="px-3 py-2">Mobile</th>
                  <th className="px-3 py-2">Level / Course</th>
                  <th className="px-3 py-2">Place</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((s) => (
                  <tr key={s.educationStudentId}>
                    <td className="px-3 py-2 font-mono font-bold text-indigo-600">{s.educationStudentId}</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{s.fullName}</td>
                    <td className="px-3 py-2 text-slate-600">{s.mobile}</td>
                    <td className="px-3 py-2 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-[10px]">
                        {s.educationLevel} {s.course ? `(${s.course})` : ''}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-500">{s.place || 'N/A'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
