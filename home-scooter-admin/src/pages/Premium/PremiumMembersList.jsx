import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { premiumAdminApi } from '../../api/premiumAdminApi';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Plus,
  Lock,
  RefreshCw,
  Ban,
  CheckCircle,
  Eye,
  X,
  ShieldAlert,
  Calendar,
  Key,
} from 'lucide-react';

export const PremiumMembersList = () => {
  const queryClient = useQueryClient();
  const [statusTab, setStatusTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Add Form State
  const [addFormData, setAddFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    plan: '1 Month',
    password: '',
  });

  // Renew Plan State
  const [renewPlan, setRenewPlan] = useState('1 Month');

  // Change Password State
  const [newPassword, setNewPassword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['premiumAdminMembers', statusTab, search],
    queryFn: () => premiumAdminApi.getMembers({ status: statusTab, search }),
  });

  const createMemberMutation = useMutation({
    mutationFn: (data) => premiumAdminApi.createMember(data),
    onSuccess: (res) => {
      toast.success(`Premium Member created! Password: ${res.data?.generatedPassword || 'Set'}`);
      setIsAddModalOpen(false);
      setAddFormData({ userName: '', userPhone: '', userEmail: '', plan: '1 Month', password: '' });
      queryClient.invalidateQueries(['premiumAdminMembers']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create member'),
  });

  const renewMutation = useMutation({
    mutationFn: ({ id, plan }) => premiumAdminApi.renewMember(id, { plan }),
    onSuccess: () => {
      toast.success('Membership plan renewed!');
      setIsRenewModalOpen(false);
      queryClient.invalidateQueries(['premiumAdminMembers']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to renew plan'),
  });

  const blockMutation = useMutation({
    mutationFn: (id) => premiumAdminApi.blockMember(id, { reason: 'Blocked by Admin' }),
    onSuccess: () => {
      toast.success('Member account blocked');
      queryClient.invalidateQueries(['premiumAdminMembers']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to block member'),
  });

  const unblockMutation = useMutation({
    mutationFn: (id) => premiumAdminApi.unblockMember(id),
    onSuccess: () => {
      toast.success('Member account unblocked');
      queryClient.invalidateQueries(['premiumAdminMembers']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to unblock member'),
  });

  const passwordMutation = useMutation({
    mutationFn: ({ id, newPassword }) => premiumAdminApi.changePassword(id, { newPassword }),
    onSuccess: () => {
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
      setNewPassword('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update password'),
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addFormData.userName || !addFormData.userPhone) {
      toast.error('Name and Phone number are required');
      return;
    }
    createMemberMutation.mutate(addFormData);
  };

  const members = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            ⭐ Premium Members Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authenticated Premium Member credentials, status, plans, renewals, and security blocks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          + Add Member
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'ACTIVE', 'PENDING', 'EXPIRED', 'BLOCKED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusTab === tab
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No Premium Members found</p>
            <p className="text-xs text-slate-400">Click "+ Add Member" to manually register a new member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Member Details</th>
                  <th className="px-4 py-3">Premium Member ID</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Start & Expiry Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {members.map((m) => (
                  <tr key={m.premiumMemberId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-slate-900">{m.userName}</p>
                        <p className="text-[11px] text-slate-500">{m.userPhone}</p>
                        {m.userEmail && <p className="text-[10px] text-slate-400">{m.userEmail}</p>}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-amber-600">{m.premiumMemberId}</td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md text-[10px]">
                        {m.plan}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      <div>Start: {new Date(m.startDate).toLocaleDateString()}</div>
                      <div>Expiry: <span className="font-semibold text-slate-800">{new Date(m.expiryDate).toLocaleDateString()}</span></div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'BLOCKED' ? 'bg-rose-100 text-rose-700' :
                        m.status === 'EXPIRED' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => {
                          setSelectedMember(m);
                          setRenewPlan(m.plan);
                          setIsRenewModalOpen(true);
                        }}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold"
                        title="Renew Plan"
                      >
                        Renew
                      </button>

                      <button
                        onClick={() => {
                          setSelectedMember(m);
                          setIsPasswordModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Change Password"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>

                      {m.status === 'BLOCKED' ? (
                        <button
                          onClick={() => unblockMutation.mutate(m.premiumMemberId)}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[10px] font-bold"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => blockMutation.mutate(m.premiumMemberId)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Block Member"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Premium Member */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">+ Add Premium Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={addFormData.userName}
                  onChange={(e) => setAddFormData({ ...addFormData, userName: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={addFormData.userPhone}
                  onChange={(e) => setAddFormData({ ...addFormData, userPhone: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={addFormData.userEmail}
                  onChange={(e) => setAddFormData({ ...addFormData, userEmail: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Membership Plan *</label>
                <select
                  value={addFormData.plan}
                  onChange={(e) => setAddFormData({ ...addFormData, plan: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                >
                  <option value="1 Month">1 Month (30 Days)</option>
                  <option value="3 Months">3 Months (90 Days)</option>
                  <option value="6 Months">6 Months (180 Days)</option>
                  <option value="12 Months">12 Months (365 Days)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Password (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty to auto-generate password"
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMemberMutation.isPending}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  {createMemberMutation.isPending ? 'Creating...' : 'Create & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Renew Membership */}
      {isRenewModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Renew Membership Plan</h3>
              <button onClick={() => setIsRenewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
              <p className="font-bold text-slate-900">{selectedMember.userName}</p>
              <p className="text-amber-600 font-mono font-bold">ID: {selectedMember.premiumMemberId}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Renewal Duration</label>
              <select
                value={renewPlan}
                onChange={(e) => setRenewPlan(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
              >
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  renewMutation.mutate({ id: selectedMember.premiumMemberId, plan: renewPlan })
                }
                disabled={renewMutation.isPending}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                {renewMutation.isPending ? 'Renewing...' : 'Confirm Renewal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {isPasswordModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Change Member Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type="text"
                required
                placeholder="Enter new password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  passwordMutation.mutate({ id: selectedMember.premiumMemberId, newPassword })
                }
                disabled={passwordMutation.isPending || !newPassword}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
