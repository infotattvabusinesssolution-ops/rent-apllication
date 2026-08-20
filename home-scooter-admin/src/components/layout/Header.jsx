import React, { useState } from 'react';
import { Menu, Search, User, Settings, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationDropdown } from './NotificationDropdown';
import { Dropdown } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const profileMenuItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => navigate('/settings'),
    },
    {
      label: 'Admin Settings',
      icon: Settings,
      onClick: () => navigate('/settings'),
    },
    {
      label: 'Security & Audit',
      icon: ShieldCheck,
      onClick: () => navigate('/settings'),
    },
    { divider: true },
    {
      label: 'Logout',
      icon: LogOut,
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/90">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global Quick Search */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ad ID, phone, seller..."
            className="w-56 xl:w-72 pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </form>

        {/* Notification Bell */}
        <NotificationDropdown />

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <Dropdown
          align="right"
          items={profileMenuItems}
          trigger={
            <button className="flex items-center gap-2.5 p-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user?.name || 'Admin'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {user?.name || 'Home & Scooter'}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>

                <span className="text-[10px] font-semibold text-emerald-600">
                  {user?.role || 'SUPER_ADMIN'}
                </span>
              </div>
            </button>
          }
        />
      </div>
    </header>
  );
};
