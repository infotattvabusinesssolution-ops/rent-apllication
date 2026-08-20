import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../api/usersApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/formatters';
import { toast } from 'sonner';
import { Users, ShieldCheck, Ban, CheckCircle, Eye, MoreVertical, Star } from 'lucide-react';
import { Dropdown } from '../components/ui/Dropdown';

export const UsersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filterTab, setFilterTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [banningUser, setBanningUser] = useState(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ['users', filterTab, search],
    queryFn: () => usersApi.getUsers({ filter: filterTab, search }),
    refetchInterval: 3000,
  });


  const banMutation = useMutation({
    mutationFn: ({ id, reason }) => usersApi.banUser(id, reason),
    onSuccess: (res) => {
      toast.success(res?.message || 'User account banned & listings unpublished');
      setBanningUser(null);
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['userDetail']);
      queryClient.invalidateQueries(['ads']);
      queryClient.invalidateQueries(['pendingAds']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to ban user account');
    },
  });

  const unbanMutation = useMutation({
    mutationFn: (id) => usersApi.unbanUser(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'User account restored to Active');
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['userDetail']);
      queryClient.invalidateQueries(['ads']);
      queryClient.invalidateQueries(['pendingAds']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to unban user account');
    },
  });


  const verifyMutation = useMutation({
    mutationFn: usersApi.verifyUser,
    onSuccess: () => {
      toast.success('User verified');
      queryClient.invalidateQueries(['users']);
    },
  });

  const toggleSubMutation = useMutation({
    mutationFn: usersApi.toggleSubscriber,
    onSuccess: () => {
      toast.success('Subscriber status updated');
      queryClient.invalidateQueries(['users']);
    },
  });

  const users = result?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Marketplace User Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage buyers, verified sellers, ₹100 subscriber accounts, and safety bans.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Users' },
          { id: 'VERIFIED', label: 'Verified Posters' },
          { id: 'SUBSCRIBED', label: 'Subscribed Members' },
          { id: 'BANNED', label: 'Banned Users' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              filterTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search user name, phone, email, ID..." className="max-w-md" />

      {/* Table */}
      {isLoading ? (
        <Card>
          <Skeleton className="h-64" />
        </Card>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="There are no user accounts matching your filter parameters."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Subscriber</th>
                  <th className="py-3 px-4">Ads Posted</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p
                            onClick={() => navigate(`/users/${user.id}`)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {user.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">#{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{user.phone}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <Badge variant="success">Verified ✓</Badge>
                      ) : (
                        <Badge variant="neutral">Unverified</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.isSubscribed ? (
                        <Badge variant="purple">₹100 Active</Badge>
                      ) : (
                        <Badge variant="neutral">Free User</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{user.postedAdsCount} Ads</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(user.joinedDate)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'Banned' ? 'danger' : 'success'}>{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}`)}
                          icon={Eye}
                        >
                          Profile
                        </Button>
                        <Dropdown
                          align="right"
                          items={[
                            {
                              label: 'View User Profile & Timeline',
                              icon: Eye,
                              onClick: () => navigate(`/users/${user.id}`),
                            },
                            {
                              label: user.isVerified ? 'Mark Unverified' : 'Verify Seller',
                              icon: ShieldCheck,
                              onClick: () => verifyMutation.mutate(user.id),
                            },
                            {
                              label: user.isSubscribed ? 'Revoke Subscription' : 'Grant Subscription',
                              icon: Star,
                              onClick: () => toggleSubMutation.mutate(user.id),
                            },
                            { divider: true },
                            user.status === 'Banned'
                              ? {
                                  label: 'Unban User',
                                  icon: CheckCircle,
                                  onClick: () => unbanMutation.mutate(user.id),
                                }
                              : {
                                  label: 'Ban Account',
                                  icon: Ban,
                                  danger: true,
                                  onClick: () => setBanningUser(user),
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ban Dialog */}
      {banningUser && (
        <ConfirmDialog
          isOpen={!!banningUser}
          onClose={() => setBanningUser(null)}
          onConfirm={() => banMutation.mutate({ id: banningUser.id, reason: 'Manual admin safety ban' })}
          title={`Ban Account "${banningUser.name}"?`}
          description="Banning this user will immediately unpublish all their live advertisements and block future logins."
          confirmText="Ban User"
          variant="danger"
          isLoading={banMutation.isPending}
        />
      )}
    </div>
  );
};
