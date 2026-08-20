import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Drawer } from '../ui/Drawer';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboardApi';
import {
  LayoutDashboard,
  Layers,
  Clock,
  Image,
  CreditCard,
  Users,
  PhoneCall,
  ShieldAlert,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  Bike,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ads', label: 'All Ads', icon: Layers, badgeColor: 'bg-blue-600' },
  { path: '/ads/pending', label: 'Pending Approvals', icon: Clock, badgeColor: 'bg-amber-500' },
  { path: '/banners', label: 'Banner Ads', icon: Image },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard, badgeColor: 'bg-emerald-500' },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/leads', label: 'Callback Leads', icon: PhoneCall },
  { path: '/reports', label: 'Reported Ads', icon: ShieldAlert, badgeColor: 'bg-red-500' },
  { path: '/visitor-win', label: 'Visitor Win', icon: Award },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 3000,
  });

  const totalAdsCount = stats?.totalAdsCount !== undefined ? stats.totalAdsCount : stats?.totalPublishedAds || 0;
  const pendingCount = stats?.pendingApprovals !== undefined ? stats.pendingApprovals : 0;
  const subscribersCount = stats?.activeSubscribers !== undefined ? stats.activeSubscribers : 0;
  const reportsCount = stats?.pendingReports !== undefined ? stats.pendingReports : 0;

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  const getBadgeValue = (path) => {
    if (path === '/ads') return totalAdsCount;
    if (path === '/ads/pending') return pendingCount;
    if (path === '/subscriptions') return subscribersCount;
    if (path === '/reports') return reportsCount;
    return null;
  };


  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="left">
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 -mr-1" />
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Home & Scooter</h3>
            <p className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">Admin Portal</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const badgeVal = getBadgeValue(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badgeVal !== undefined && badgeVal !== null && (
                  <span
                    className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-500'}`}
                  >
                    {badgeVal}
                  </span>
                )}

              </NavLink>
            );
          })}
        </div>



        {/* Profile & Logout */}
        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name || 'Admin'}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">{user?.name || 'Home & Scooter'}</p>
              <p className="text-[10px] text-slate-500">{user?.role || 'SUPER_ADMIN'}</p>
            </div>

          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Drawer>
  );
};
