import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  ChevronLeft,
  ChevronRight,
  Building2,
  Bike,
  FolderTree,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ads', label: 'All Ads', icon: Layers },
  { path: '/ads/pending', label: 'Pending Approvals', icon: Clock, badge: '124', badgeColor: 'bg-amber-500' },
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/banners', label: 'Banner Ads', icon: Image },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard, badge: '2', badgeColor: 'bg-emerald-500' },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/leads', label: 'Callback Leads', icon: PhoneCall },
  { path: '/reports', label: 'Reported Ads', icon: ShieldAlert, badge: '24', badgeColor: 'bg-red-500' },
  { path: '/visitor-win', label: 'Visitor Win', icon: Award },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];


export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 h-full transition-all duration-300 relative z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 -mr-1" />
              <Bike className="w-4 h-4" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 leading-tight truncate">Home & Scooter</span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">Admin Portal</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name || 'Admin Avatar'}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Rahul Sharma'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.role || 'SUPER_ADMIN'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
