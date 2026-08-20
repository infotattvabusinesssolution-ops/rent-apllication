import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, FileCheck, CreditCard, AlertTriangle, PhoneCall, CheckCircle2, X, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifData } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      const res = await axiosClient.get('/api/v1/admin/notifications');
      return res.data?.notifications || [];
    },
    refetchInterval: 3000,
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      return await axiosClient.put('/api/v1/admin/notifications/mark-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminNotifications']);
    },
  });

  const notifications = notifData || [];
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    markReadMutation.mutate();
  };

  const icons = {
    ad: <FileCheck className="w-4 h-4 text-amber-600 bg-amber-50 p-1 rounded-md" />,
    payment: <CreditCard className="w-4 h-4 text-emerald-600 bg-emerald-50 p-1 rounded-md" />,
    report: <AlertTriangle className="w-4 h-4 text-red-600 bg-red-50 p-1 rounded-md" />,
    lead: <PhoneCall className="w-4 h-4 text-blue-600 bg-blue-50 p-1 rounded-md" />,
    status: <ShieldAlert className="w-4 h-4 text-purple-600 bg-purple-50 p-1 rounded-md" />,
    system: <Bell className="w-4 h-4 text-slate-600 bg-slate-100 p-1 rounded-md" />,
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="sm:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Container */}
          <div className="fixed left-1/2 -translate-x-1/2 top-16 w-[calc(100vw-2rem)] max-w-sm sm:absolute sm:left-auto sm:right-0 sm:translate-x-0 sm:top-full sm:w-96 sm:mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in-50 zoom-in-95">
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close notifications"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(item.path);
                  }}
                  className={`p-3.5 hover:bg-slate-50 flex items-start gap-3 cursor-pointer transition-colors ${
                    item.unread ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{icons[item.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-slate-100 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/ads/pending');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View Moderation Queue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
