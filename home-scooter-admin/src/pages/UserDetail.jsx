import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate, formatDateTime } from '../utils/formatters';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  CreditCard,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['userDetail', id],
    queryFn: () => usersApi.getUserById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">User Not Found</h2>
        <Button onClick={() => navigate('/users')} className="mt-4">
          Back to Users List
        </Button>
      </div>
    );
  }

  const mockTimeline = [
    { date: '18 Aug 2026 09:30 AM', text: 'Posted new advertisement #AD1024 (30x40 Hoskote Corner Plot)', type: 'ad' },
    { date: '18 Aug 2026 10:15 AM', text: 'Submitted ₹100 UPI payment screenshot for 10-day subscription', type: 'payment' },
    { date: '17 Aug 2026 02:45 PM', text: 'Subscription activated by Admin Home & Scooter (MEMBER_8901)', type: 'system' },

    { date: '15 Jan 2026 11:00 AM', text: 'Registered account on Home & Scooter Marketplace App', type: 'user' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/users')}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">User Profile #{user.id}</span>
            <Badge variant={user.status === 'Banned' ? 'danger' : 'success'}>{user.status}</Badge>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-0.5">{user.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Summary & Stats */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
              <img
                src={user.avatar}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md mb-3"
              />
              <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
              <p className="text-xs text-slate-500 font-mono">ID: {user.id}</p>

              <div className="flex items-center gap-2 mt-3">
                {user.isVerified ? (
                  <Badge variant="success">Verified Seller ✓</Badge>
                ) : (
                  <Badge variant="neutral">Unverified</Badge>
                )}
                {user.isSubscribed && <Badge variant="purple">₹100 Subscribed</Badge>}
              </div>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</span>
                <span className="font-semibold text-slate-800">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                <span className="font-semibold text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined Date</span>
                <span className="font-semibold text-slate-800">{formatDate(user.joinedDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Subscription Expiry</span>
                <span className="font-semibold text-slate-800">
                  {user.subscriptionExpiry ? formatDate(user.subscriptionExpiry) : 'None'}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Metrics */}
          <Card className="bg-slate-900 text-white">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Ad Postings Summary</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Total Ads</span>
                <p className="text-xl font-bold text-white mt-1">{user.postedAdsCount}</p>
              </div>
              <div className="p-2 bg-slate-800 rounded-xl">
                <span className="text-xs text-emerald-400">Approved</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{user.approvedAdsCount}</p>
              </div>
              <div className="p-2 bg-slate-800 rounded-xl">
                <span className="text-xs text-red-400">Rejected</span>
                <p className="text-xl font-bold text-red-400 mt-1">{user.rejectedAdsCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Account Activity Timeline" subtitle="Chronological log of user actions & moderation history" />
            <CardBody>
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
                {mockTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                    <span className="text-[11px] font-bold text-slate-400">{item.date}</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
