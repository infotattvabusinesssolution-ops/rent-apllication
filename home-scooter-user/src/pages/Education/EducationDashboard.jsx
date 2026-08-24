import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { educationUserApi } from '../../api/educationUserApi';
import { educationAuthStorage } from '../../utils/educationAuthStorage';
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Bell,
  Search,
  ChevronRight,
  Eye,
  Video,
  FileDown,
  ExternalLink,
  User,
} from 'lucide-react';

const CATEGORY_BUTTONS = [
  { key: 'ALL', label: 'All Updates', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { key: 'EDUCATION_UPDATE', label: '📚 Education', icon: BookOpen, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { key: 'COURSE', label: '🎓 Courses', icon: GraduationCap, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { key: 'CAREER', label: '💼 Career', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { key: 'EXAM', label: '📝 Exams', icon: FileText, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { key: 'SCHOLARSHIP', label: '💰 Scholarships', icon: Award, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  { key: 'ANNOUNCEMENT', label: '📢 Notices', icon: Bell, color: 'bg-teal-50 text-teal-600 border-teal-200' },
];

export const EducationDashboard = () => {
  const navigate = useNavigate();
  const student = educationAuthStorage.getStudent();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeType, setActiveType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: dashboardData } = useQuery({
    queryKey: ['educationDashboardFeed'],
    queryFn: () => educationUserApi.getDashboard(),
  });

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['educationContentUser', activeCategory, activeType, search, page],
    queryFn: () =>
      educationUserApi.getContentList({
        category: activeCategory,
        contentType: activeType,
        search,
        page,
        limit: 8,
      }),
  });

  const feedItems = contentData?.data || [];
  const pagination = contentData?.pagination || {};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 👋';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Student Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-500/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              Education Desk Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {getGreeting()}, {student?.fullName || 'Student'}!
            </h1>
            <p className="text-xs text-slate-300">
              Welcome back to your personalized educational updates & career opportunities dashboard.
            </p>
          </div>

          {student?.educationStudentId && (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">EDUCATION DESK ID</p>
                <p className="text-sm font-black font-mono text-white tracking-wider">
                  {student.educationStudentId}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 6 Category Quick Access Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORY_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            const isSelected = activeCategory === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => {
                  setActiveCategory(btn.key);
                  setPage(1);
                }}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-105'
                    : `${btn.color} hover:shadow-xs`
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="line-clamp-1">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'TEXT', 'BANNER', 'VIDEO', 'DOCUMENT', 'LINK'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveType(type);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeType === type ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search updates..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Content Feed Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : feedItems.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No Educational Updates Found</p>
              <p className="text-xs text-slate-400">Try switching your category filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {feedItems.map((item) => (
                <div
                  key={item.contentId}
                  onClick={() => navigate(`/education/content/${item.contentId}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {item.category?.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>

                    {item.shortDescription && (
                      <p className="text-xs text-slate-500 line-clamp-2">{item.shortDescription}</p>
                    )}
                  </div>

                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      {item.contentType === 'VIDEO' && <Video className="w-3.5 h-3.5 text-purple-600" />}
                      {item.contentType === 'DOCUMENT' && <FileDown className="w-3.5 h-3.5 text-amber-600" />}
                      {item.contentType === 'LINK' && <ExternalLink className="w-3.5 h-3.5 text-blue-600" />}
                      {item.contentType === 'TEXT' && <FileText className="w-3.5 h-3.5 text-indigo-600" />}
                      {item.contentType}
                    </span>

                    <span className="flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                      Read More <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-600">
                Page {page} of {pagination.pages}
              </span>
              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
