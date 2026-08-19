import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AdRejectModal } from '../components/ads/AdRejectModal';
import { CATEGORY_LIST, AD_STATUS_BADGES } from '../constants/categories';
import { formatCurrency, formatDate, formatCompactViews } from '../utils/formatters';
import { toast } from 'sonner';
import {
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  Flame,
  MoreVertical,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Dropdown } from '../components/ui/Dropdown';

export const AdsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'ALL';
  const categoryFilter = searchParams.get('category') || 'ALL';
  const searchQuery = searchParams.get('search') || '';

  const [rejectingAd, setRejectingAd] = useState(null);
  const [deletingAdId, setDeletingAdId] = useState(null);

  const { data: adsResult, isLoading } = useQuery({
    queryKey: ['ads', currentTab, categoryFilter, searchQuery],
    queryFn: () =>
      adsApi.getAds({
        status: ['PENDING', 'APPROVED', 'REJECTED', 'UNPUBLISHED'].includes(currentTab) ? currentTab : 'ALL',
        isFeatured: currentTab === 'FEATURED',
        isHighDemand: currentTab === 'HIGH_DEMAND',
        category: categoryFilter,
        search: searchQuery,
      }),
  });

  const approveMutation = useMutation({
    mutationFn: adsApi.approveAd,
    onSuccess: () => {
      toast.success('Advertisement approved successfully');
      queryClient.invalidateQueries(['ads']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, notes }) => adsApi.rejectAd(id, reason, notes),
    onSuccess: () => {
      toast.success('Advertisement rejected successfully');
      setRejectingAd(null);
      queryClient.invalidateQueries(['ads']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const badgeMutation = useMutation({
    mutationFn: ({ id, badges }) => adsApi.updateBadges(id, badges),
    onSuccess: () => {
      toast.success('Badges updated');
      queryClient.invalidateQueries(['ads']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adsApi.deleteAd,
    onSuccess: () => {
      toast.success('Advertisement deleted');
      setDeletingAdId(null);
      queryClient.invalidateQueries(['ads']);
    },
  });

  const tabs = [
    { id: 'ALL', label: 'All Listings' },
    { id: 'PENDING', label: 'Pending', badge: '124' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'UNPUBLISHED', label: 'Unpublished' },
    { id: 'FEATURED', label: 'Featured' },
    { id: 'HIGH_DEMAND', label: 'High Demand' },
  ];

  const adsList = adsResult?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Marketplace Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, review, feature and moderate all marketplace listings across all categories.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              searchParams.set('tab', tab.id);
              setSearchParams(searchParams);
            }}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              currentTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(val) => {
            if (val) searchParams.set('search', val);
            else searchParams.delete('search');
            setSearchParams(searchParams);
          }}
          className="w-full md:w-80"
        />

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => {
              if (e.target.value !== 'ALL') searchParams.set('category', e.target.value);
              else searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Card>
          <TableSkeleton rows={6} cols={7} />
        </Card>
      ) : adsList.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No advertisements found"
          description="There are currently no listings matching the selected status or filters."
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Ad Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Seller Info</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {adsList.map((ad) => {
                    const statusBadge = AD_STATUS_BADGES[ad.status] || AD_STATUS_BADGES.PENDING;
                    return (
                      <tr key={ad.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={ad.imageUrls[0]}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                                #{ad.id}
                              </span>
                              <h4
                                onClick={() => navigate(`/ads/${ad.id}`)}
                                className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer max-w-xs"
                              >
                                {ad.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                {ad.isFeatured && (
                                  <Badge variant="purple" size="sm">
                                    <Star className="w-3 h-3 mr-1 fill-purple-600" /> Featured
                                  </Badge>
                                )}
                                {ad.isHighDemand && (
                                  <Badge variant="warning" size="sm">
                                    <Flame className="w-3 h-3 mr-1 text-amber-600 fill-amber-500" /> High Demand
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="teal">{ad.category}</Badge>
                          {ad.propertySubType && (
                            <p className="text-[10px] text-slate-500 mt-1">{ad.propertySubType}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {formatCurrency(ad.price)}
                          {ad.priceUnit !== '₹' && (
                            <span className="text-[10px] font-normal text-slate-500 ml-0.5">{ad.priceUnit}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{ad.posterName}</p>
                          <p className="text-[11px] text-slate-500">{ad.posterPhone}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{formatCompactViews(ad.viewsCount)}</td>
                        <td className="py-3 px-4 text-slate-500">{formatDate(ad.postedAt)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/ads/${ad.id}`)}
                              title="View Ad Detail"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </Button>

                            {ad.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => approveMutation.mutate(ad.id)}
                                  isLoading={approveMutation.isPending}
                                  title="Approve Listing"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setRejectingAd(ad)}
                                  title="Reject Listing"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}

                            <Dropdown
                              align="right"
                              items={[
                                {
                                  label: 'View Full Detail',
                                  icon: Eye,
                                  onClick: () => navigate(`/ads/${ad.id}`),
                                },
                                {
                                  label: ad.isFeatured ? 'Remove Featured' : 'Mark as Featured',
                                  icon: Star,
                                  onClick: () =>
                                    badgeMutation.mutate({
                                      id: ad.id,
                                      badges: { isFeatured: !ad.isFeatured },
                                    }),
                                },
                                {
                                  label: ad.isHighDemand ? 'Remove High Demand' : 'Mark High Demand',
                                  icon: Flame,
                                  onClick: () =>
                                    badgeMutation.mutate({
                                      id: ad.id,
                                      badges: { isHighDemand: !ad.isHighDemand },
                                    }),
                                },
                                { divider: true },
                                {
                                  label: 'Delete Listing',
                                  icon: Trash2,
                                  danger: true,
                                  onClick: () => setDeletingAdId(ad.id),
                                },
                              ]}
                              trigger={
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {adsList.map((ad) => {
              const statusBadge = AD_STATUS_BADGES[ad.status] || AD_STATUS_BADGES.PENDING;
              return (
                <Card key={ad.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={ad.imageUrls[0]}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-blue-600">#{ad.id}</span>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{ad.title}</h4>
                          <p className="text-xs font-bold text-slate-800 mt-0.5">{formatCurrency(ad.price)}</p>
                        </div>
                      </div>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2 my-2">
                      <p>
                        <span className="font-semibold text-slate-700">Category:</span> {ad.category}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Seller:</span> {ad.posterName} ({ad.posterPhone})
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Location:</span> {ad.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/ads/${ad.id}`)}
                      className="flex-1"
                    >
                      View Detail
                    </Button>
                    {ad.status === 'PENDING' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => approveMutation.mutate(ad.id)}
                        isLoading={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Reject Modal */}
      {rejectingAd && (
        <AdRejectModal
          isOpen={!!rejectingAd}
          onClose={() => setRejectingAd(null)}
          adTitle={rejectingAd.title}
          isLoading={rejectMutation.isPending}
          onConfirm={(reason, notes) =>
            rejectMutation.mutate({ id: rejectingAd.id, reason, notes })
          }
        />
      )}

      {/* Delete Confirmation */}
      {deletingAdId && (
        <ConfirmDialog
          isOpen={!!deletingAdId}
          onClose={() => setDeletingAdId(null)}
          onConfirm={() => deleteMutation.mutate(deletingAdId)}
          title="Delete Advertisement"
          description="Are you sure you want to delete this listing permanently? This action cannot be undone."
          confirmText="Delete Ad"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
