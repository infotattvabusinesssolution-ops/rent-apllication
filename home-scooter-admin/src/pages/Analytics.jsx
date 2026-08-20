import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analyticsApi';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { AdsTrendChart } from '../components/charts/AdsTrendChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { ViewsChart } from '../components/charts/ViewsChart';
import { LocationChart } from '../components/charts/LocationChart';
import { formatNumber } from '../utils/formatters';
import { BarChart3, Eye, Heart, PhoneCall, MessageSquare, TrendingUp, Calendar } from 'lucide-react';

export const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analyticsData', dateRange],
    queryFn: () => analyticsApi.getAnalytics(dateRange),
    refetchInterval: 3000,
  });


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Date Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Marketplace Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comprehensive platform performance, engagement trends, top locations and listing metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          {['today', '7d', '30d', '3m', '12m'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer uppercase ${
                dateRange === range
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Engagement KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatNumber(analytics?.totalViews || 14820)}</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2% vs previous period
          </span>
        </Card>


        <Card>
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Favorites Saved</span>
          </div>
          <p className="text-2xl font-black text-slate-900">24,120</p>
          <span className="text-[11px] text-slate-500 mt-1">High buyer intent</span>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-teal-600 mb-1">
            <PhoneCall className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Callback Requests</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatNumber(analytics?.callbackLeads)}</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> {analytics?.callbackLeadsTrend}
          </span>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Seller Chats</span>
          </div>
          <p className="text-2xl font-black text-slate-900">12,850</p>
          <span className="text-[11px] text-slate-500 mt-1">Active conversations</span>
        </Card>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Listing Submissions Growth" subtitle="Ads posted over chosen timeframe" />
          <CardBody>
            <AdsTrendChart data={analytics?.monthlyPostings} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Marketplace Category Share" subtitle="Distribution of published listings" />
          <CardBody>
            <CategoryChart data={analytics?.categoryDistribution} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Daily Pageviews & Impressions" subtitle="Mobile & Web buyer views trend" />
          <CardBody>
            <ViewsChart data={analytics?.viewsAnalytics} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Listing Geographies" subtitle="Top demand locations across Hoskote, Whitefield, etc." />
          <CardBody>
            <LocationChart data={analytics?.topLocations} />
          </CardBody>
        </Card>
      </div>

      {/* Top Performing Ads Table */}
      <Card>
        <CardHeader title="Top Performing Advertisements" subtitle="Listings with highest buyer engagement and inquiry rates" />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Advertisement Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Total Views</th>
                  <th className="py-3 px-4">Direct Inquiries</th>
                  <th className="py-3 px-4">Performance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(analytics?.topAds || []).map((ad, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{ad.title}</td>
                    <td className="py-3 px-4"><Badge variant="teal">{ad.category}</Badge></td>
                    <td className="py-3 px-4 font-bold text-slate-800">{ad.views} views</td>
                    <td className="py-3 px-4 font-bold text-blue-600">{ad.inquiries}</td>
                    <td className="py-3 px-4">
                      <Badge variant={ad.performanceScore >= 80 ? 'success' : ad.performanceScore >= 65 ? 'purple' : 'neutral'}>
                        {ad.performanceScore || 85} / 100
                      </Badge>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
