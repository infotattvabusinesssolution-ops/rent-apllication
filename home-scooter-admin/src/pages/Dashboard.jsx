import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { AdsTrendChart } from '../components/charts/AdsTrendChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { ViewsChart } from '../components/charts/ViewsChart';
import { LocationChart } from '../components/charts/LocationChart';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Layers,
  Clock,
  CreditCard,
  PhoneCall,
  ShieldAlert,
  ArrowUpRight,
  PlusCircle,
  FileCheck,
  Award,
  TrendingUp,
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Marketplace Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time analytics, pending ad moderation, subscription verification & safety stats.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => navigate('/ads/pending')} icon={FileCheck}>
            Review 124 Pending Ads
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Published Ads */}
        <Card hover onClick={() => navigate('/ads')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Ads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{formatNumber(stats?.totalPublishedAds)}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {stats?.publishedAdsTrend}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Layout {stats?.adsByCategory?.layoutSites} • Properties {stats?.adsByCategory?.properties}
            </p>
          </div>
        </Card>

        {/* KPI 2: Pending Approvals */}
        <Card hover onClick={() => navigate('/ads/pending')} className="border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Moderation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-900">{stats?.pendingApprovals}</span>
              <Badge variant="warning">{stats?.pendingApprovalsToday}</Badge>
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center">
              Requires review <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </Card>

        {/* KPI 3: Active Subscribers */}
        <Card hover onClick={() => navigate('/subscriptions')} className="border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">₹100 Subscribers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-900">{formatNumber(stats?.activeSubscribers)}</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              {formatCurrency(stats?.subscriptionRevenue)} Revenue
            </p>
          </div>
        </Card>

        {/* KPI 4: Callback Leads */}
        <Card hover onClick={() => navigate('/leads')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Callback Leads</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{formatNumber(stats?.callbackLeads)}</span>
              <span className="text-xs font-bold text-emerald-600">{stats?.callbackLeadsTrend}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Buyer call requests</p>
          </div>
        </Card>

        {/* KPI 5: Pending Reports */}
        <Card hover onClick={() => navigate('/reports')} className="border-red-200 bg-red-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Safety Reports</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-red-900">{stats?.pendingReports}</span>
              <Badge variant="danger">Action Required</Badge>
            </div>
            <p className="text-[11px] text-red-700 font-medium mt-1">User reported listings</p>
          </div>
        </Card>
      </div>

      {/* Quick Action Bar */}
      <Card className="bg-slate-900 text-white border-none shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-400" />
              Quick Operations Launchpad
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Direct shortcuts to critical marketplace admin flows</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate('/ads/pending')}>
              Review Pending Ads
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/subscriptions')}>
              Verify Subscription
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/banners/create')}>
              Create Banner
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/reports')}>
              View Reports
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/visitor-win')}>
              Export Visitor Win
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posting Trend */}
        <Card>
          <CardHeader
            title="Advertisement Posting Trend"
            subtitle="Monthly total listing submissions across all categories"
          />
          <CardBody>
            <AdsTrendChart data={stats?.monthlyPostings} />
          </CardBody>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader
            title="Category Distribution"
            subtitle="Breakdown of published ads by marketplace segment"
          />
          <CardBody>
            <CategoryChart data={stats?.categoryDistribution} />
          </CardBody>
        </Card>

        {/* Views Analytics */}
        <Card>
          <CardHeader
            title="Marketplace Traffic & Views"
            subtitle="Daily buyer views across web and Flutter mobile app"
          />
          <CardBody>
            <ViewsChart data={stats?.viewsAnalytics} />
          </CardBody>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader
            title="Top Active Locations"
            subtitle="High-density areas for plots, properties & electric scooters"
          />
          <CardBody>
            <LocationChart data={stats?.topLocations} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
