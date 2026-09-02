import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Calendar,
  IndianRupee,
  Layers,
  X,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { premiumAdminApi } from '../../api/premiumAdminApi';

export const PremiumPlansList = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    durationInDays: '',
    popular: false,
    description: '',
    displayOrder: 0,
    isActive: true,
  });

  const { data: plansData, isLoading, refetch } = useQuery({
    queryKey: ['premiumAdminPlans'],
    queryFn: () => premiumAdminApi.getPlans(),
  });

  const plans = plansData?.data?.data || [];

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data) => premiumAdminApi.createPlan(data),
    onSuccess: () => {
      toast.success('Membership plan created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
      queryClient.invalidateQueries(['premiumAdminPlans']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create plan'),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => premiumAdminApi.updatePlan(id, data),
    onSuccess: () => {
      toast.success('Membership plan updated!');
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      resetForm();
      queryClient.invalidateQueries(['premiumAdminPlans']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update plan'),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => premiumAdminApi.deletePlan(id),
    onSuccess: () => {
      toast.success('Plan deleted successfully');
      queryClient.invalidateQueries(['premiumAdminPlans']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete plan'),
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: '',
      durationInDays: '',
      popular: false,
      description: '',
      displayOrder: 0,
      isActive: true,
    });
  };

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      durationInDays: plan.durationInDays || '',
      popular: Boolean(plan.popular),
      description: plan.description || '',
      displayOrder: plan.displayOrder || 0,
      isActive: plan.isActive !== undefined ? plan.isActive : true,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) {
      toast.error('Name, price, and duration are required');
      return;
    }
    createMutation.mutate({
      ...formData,
      price: Number(formData.price),
      durationInDays: Number(formData.durationInDays) || (formData.name.match(/\d+/) ? parseInt(formData.name.match(/\d+/)[0], 10) : 30),
      displayOrder: Number(formData.displayOrder) || 0,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) {
      toast.error('Name, price, and duration are required');
      return;
    }
    updateMutation.mutate({
      id: selectedPlan.planId || selectedPlan._id,
      data: {
        ...formData,
        price: Number(formData.price),
        durationInDays: Number(formData.durationInDays) || (formData.name.match(/\d+/) ? parseInt(formData.name.match(/\d+/)[0], 10) : 30),
        displayOrder: Number(formData.displayOrder) || 0,
      },
    });
  };

  const handleDelete = (plan) => {
    if (window.confirm(`Are you sure you want to delete the "${plan.name}" plan (₹${plan.price})?`)) {
      deleteMutation.mutate(plan.planId || plan._id);
    }
  };

  const handleToggleStatus = (plan) => {
    updateMutation.mutate({
      id: plan.planId || plan._id,
      data: { isActive: !plan.isActive },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">⭐ Membership Plans</h1>
            <p className="text-xs text-slate-500">
              Customise pricing, duration, and popular tags. Changes reflect instantly in the mobile app.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            title="Refresh plans"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plan</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading membership plans...</div>
      ) : plans.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3 shadow-xs">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-semibold text-sm">No plans found</p>
          <p className="text-slate-400 text-xs">Create your first customized membership plan for your users.</p>
          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold"
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id || plan.planId}
              className={`bg-white rounded-2xl border transition-all relative overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                plan.popular
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-slate-100'
              } ${!plan.isActive ? 'opacity-60 bg-slate-50/50' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1 tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{plan.planId || 'PLAN'}</span>
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(plan)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      plan.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {plan.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Price Display */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.duration}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Duration: <strong className="text-slate-800">{plan.durationInDays || plan.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Display Order: <strong className="text-slate-800">{plan.displayOrder ?? 0}</strong></span>
                  </div>
                  {plan.description && (
                    <p className="text-slate-500 pt-1 text-[11px] leading-relaxed italic border-t border-slate-100">
                      "{plan.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Plan
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Plan */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Membership Plan</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g. 3 Days, 10 Days, 30 Days"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price in ₹ (INR) *</label>
                  <input
                    type="number"
                    placeholder="39"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-bold text-slate-800"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration Text *</label>
                  <input
                    type="text"
                    placeholder="3 Days"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exact Days (Numeric) *</label>
                  <input
                    type="number"
                    placeholder="3"
                    value={formData.durationInDays}
                    onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Standard short-term pass"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-slate-700">⭐ Mark as Most Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-xs font-bold text-slate-700">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md shadow-amber-500/20"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Plan */}
      {isEditModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Edit Plan: {selectedPlan.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Display Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price in ₹ (INR) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-bold text-slate-800"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration Text *</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exact Days (Numeric) *</label>
                  <input
                    type="number"
                    value={formData.durationInDays}
                    onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-slate-700">⭐ Mark as Most Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-xs font-bold text-slate-700">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
