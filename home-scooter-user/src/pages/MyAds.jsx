import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adsApi } from '../api/adsApi';
import { formatCurrency, formatCompactViews } from '../utils/formatters';
import { toast } from 'sonner';
import {
  FilePlus,
  PlusCircle,
  PackageOpen,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
} from 'lucide-react';

export const MyAds = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingAd, setEditingAd] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const { data: result, isLoading } = useQuery({
    queryKey: ['myAds', statusFilter],
    queryFn: () => adsApi.getMyAds(statusFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: adsApi.deleteAd,
    onSuccess: () => {
      toast.success('Ad deleted successfully!');
      setDeletingId(null);
      queryClient.invalidateQueries(['myAds']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adsApi.updateAd(id, data),
    onSuccess: () => {
      toast.success('Ad updated successfully!');
      setEditingAd(null);
      queryClient.invalidateQueries(['myAds']);
    },
  });

  const handleOpenEdit = (ad) => {
    setEditingAd(ad);
    setEditTitle(ad.title);
    setEditPrice(ad.price);
    setEditLocation(ad.location);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitle || !editPrice) {
      toast.error('Please fill in title and price');
      return;
    }
    updateMutation.mutate({
      id: editingAd.id,
      data: { title: editTitle, price: Number(editPrice), location: editLocation },
    });
  };

  const ads = result?.data || [];

  return (
    <div className="space-y-5 pb-24 max-w-lg mx-auto px-1 sm:px-0">
      {/* Title Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Posted Ads
          </h1>
          <p className="text-xs text-slate-500 font-serif">Manage, view, edit & update status of your listings</p>
        </div>

        <span className="bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1 rounded-full">
          {ads.length} Ads
        </span>
      </div>

      {/* Info Banner Box */}
      <div className="bg-[#f0f6ff] border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <FilePlus className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="space-y-0.5">
          <h2 className="font-serif font-bold text-blue-900 text-base">
            Want to Sell or Rent More?
          </h2>
          <p className="text-slate-500 text-xs font-serif font-light leading-relaxed">
            Post layout sites, properties, or EV scooters to reach thousands of local buyers.
          </p>
        </div>
      </div>

      {/* Post New Ad Primary Button */}
      <button
        onClick={() => navigate('/create-ad')}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-serif font-bold text-base py-3.5 px-4 rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
      >
        <PlusCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        <span>+ Post New Ad</span>
      </button>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {[
          { key: 'ALL', label: 'All Ads' },
          { key: 'APPROVED', label: 'Approved / Active' },
          { key: 'PENDING_APPROVAL', label: 'Pending' },
          { key: 'UNPUBLISHED', label: 'Unpublished' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-full font-serif font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="space-y-3 pt-2">
          <div className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      ) : ads.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white rounded-3xl border border-slate-100 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200/60">
            <PackageOpen className="w-10 h-10 text-slate-400 stroke-[1.5]" />
          </div>
          <h3 className="font-serif font-bold text-slate-800 text-lg">No Listings Found</h3>
          <p className="text-slate-400 text-xs font-serif mt-1 max-w-xs leading-relaxed">
            You haven't posted any advertisements in this filter yet.
          </p>
          <button
            onClick={() => navigate('/create-ad')}
            className="mt-5 bg-blue-600 text-white font-serif font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
          >
            Create First Ad
          </button>
        </div>
      ) : (
        /* Ads List Cards */
        <div className="space-y-3.5">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs space-y-3 hover:shadow-md transition-all"
            >
              {/* Card Header: Category & Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span>{ad.category === 'Layout Sites' ? '🗺️' : ad.category === 'Electric Scooters' ? '🛵' : '🏢'}</span>
                  <span>{ad.category}</span>
                </span>

                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 ${
                    ad.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : ad.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ad.status === 'APPROVED' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                    </>
                  ) : ad.status === 'PENDING_APPROVAL' ? (
                    <>
                      <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                    </>
                  ) : (
                    'Unpublished'
                  )}
                </span>
              </div>

              {/* Card Middle: Image & Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                  {ad.imageUrls?.[0] ? (
                    <img src={ad.imageUrls[0]} alt={ad.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif font-bold text-slate-900 text-sm truncate">{ad.title}</h3>
                  <p className="text-blue-600 font-black text-base font-serif">{formatCurrency(ad.price)}</p>
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-serif">
                    <span className="truncate">{ad.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {formatCompactViews(ad.viewsCount || 1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-serif">
                <button
                  onClick={() => navigate(`/ads/${ad.id}`)}
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> View Ad
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(ad)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => setDeletingId(ad.id)}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Ad Modal */}
      {editingAd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Edit Listing Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs font-serif">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ad Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Delete Listing?</h3>
            <p className="text-slate-500 text-xs font-serif">
              Are you sure you want to delete this listing permanently from your posted ads?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
