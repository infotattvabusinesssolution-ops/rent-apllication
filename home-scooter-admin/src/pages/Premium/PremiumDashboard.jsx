import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { premiumAdminApi } from '../../api/premiumAdminApi';
import {
  Users,
  Clock,
  UserX,
  ShieldAlert,
  FileText,
  Image as ImageIcon,
  Video,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const PremiumDashboard = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['premiumDashboardStats'],
    queryFn: () => premiumAdminApi.getDashboardStats(),
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentRequests = data?.recentRequests || [];
  const recentContent = data?.recentContent || [];
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
              <h1 className="text-2xl font-bold">Premium Control Center</h1>
            </div>
            <p className="text-amber-100 text-sm">
              Manage exclusive member accounts, published premium media, upgrade requests, and system analytics.
            </p>
          </div>
          <Link
            to="/premium/content"
            className="px-4 py-2 bg-white text-amber-700 font-bold text-sm rounded-xl shadow hover:bg-amber-50 transition-all flex items-center gap-2"
          >
            Manage Content
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Members</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.activeMembers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Requests</p>
            <p className="text-2xl font-extrabold text-amber-600">{stats.pendingRequests || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Expired Members</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.expiredMembers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Blocked Members</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.blockedMembers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Published Content</p>
            <p className="text-2xl font-extrabold text-blue-600">{stats.publishedContent || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Content Views</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {(stats.textViews || 0) + (stats.bannerViews || 0) + (stats.videoViews || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Content View Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Important Text Views</p>
              <p className="text-lg font-bold text-slate-800">{stats.textViews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Premium Banner Views</p>
              <p className="text-lg font-bold text-slate-800">{stats.bannerViews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Premium Video Views</p>
              <p className="text-lg font-bold text-slate-800">{stats.videoViews || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Pending Upgrade Requests & Published Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Upgrade Requests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Recent Upgrade Requests
            </h2>
            <Link to="/premium/upgrade-requests" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No pending upgrade requests</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div key={req.requestId} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">{req.userName}</p>
                    <p className="text-[11px] text-slate-500">{req.userPhone} • Plan: <span className="font-semibold text-blue-600">{req.plan}</span></p>
                    <p className="text-[10px] text-slate-400">Ref: {req.paymentReference}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">₹{req.amount}</span>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">Pending Approval</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Recently Added Content
            </h2>
            <Link to="/premium/content" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage Content
            </Link>
          </div>

          {recentContent.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No content created yet</p>
          ) : (
            <div className="space-y-3">
              {recentContent.map((item) => (
                <div key={item.contentId} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      item.contentType === 'VIDEO' ? 'bg-purple-100 text-purple-700' :
                      item.contentType === 'BANNER' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.contentType}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400">ID: {item.contentId}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Member Activities Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            Live Premium Member Activity Log
          </h2>
          <Link to="/premium/reports" className="text-xs font-semibold text-blue-600 hover:underline">
            Full Audit Logs
          </Link>
        </div>

        {recentActivities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No recent activities recorded</p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {recentActivities.map((act, index) => (
              <div key={index} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-700 font-bold">{act.memberId}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                    {act.activityType}
                  </span>
                  {act.contentId && <span className="text-slate-400">Content: {act.contentId}</span>}
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
