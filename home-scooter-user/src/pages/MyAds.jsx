import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatCompactViews, timeAgo } from '../utils/formatters';
import { FileText, PlusCircle, Eye, Trash2, Edit } from 'lucide-react';

export const MyAds = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('ALL');

  const { data: result, isLoading } = useQuery({
    queryKey: ['myAds', currentTab],
    queryFn: () => adsApi.getMyAds(currentTab),
  });

  const ads = result?.data || [];

  const tabs = [
    { id: 'ALL', label: 'All Posted' },
    { id: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { id: 'APPROVED', label: 'Live' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'UNPUBLISHED', label: 'Unpublished' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Posted Advertisements</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your active listings, view moderation statuses & stats</p>
        </div>

        <Button icon={PlusCircle} onClick={() => navigate('/post-ad')}>
          Post New Ad
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : ads.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Advertisements Found"
          description="You haven't posted any advertisements matching this filter yet."
          actionText="Post an Ad Now"
          onAction={() => navigate('/post-ad')}
        />
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={ad.imageUrls[0]}
                  alt={ad.title}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">#{ad.id}</span>
                    <Badge variant={ad.status === 'APPROVED' ? 'success' : ad.status === 'PENDING_APPROVAL' ? 'warning' : 'danger'}>
                      {ad.status === 'APPROVED' ? 'Live' : ad.status === 'PENDING_APPROVAL' ? 'Pending Approval' : ad.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{ad.title}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="text-blue-600 font-extrabold">{formatCurrency(ad.price)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatCompactViews(ad.viewsCount)}</span>
                    <span>•</span>
                    <span>{timeAgo(ad.postedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Button size="sm" variant="outline" onClick={() => navigate(`/ad/${ad.id}`)}>
                  View Listing
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
