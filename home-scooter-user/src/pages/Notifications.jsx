import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Card } from '../components/common/Card';
import { Bell, CheckCircle2, ShieldAlert, Sparkles, FileText, Check } from 'lucide-react';

export const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifData } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const res = await axiosClient.get('/api/v1/user/notifications');
      return res.data?.notifications || [];
    },
    refetchInterval: 3000,
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      return await axiosClient.put('/api/v1/user/notifications/mark-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userNotifications']);
    },
  });

  const notifications = notifData || [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated on listing approvals, rejections, and account updates</p>
        </div>

        {notifications.some((n) => n.unread) && (
          <button
            onClick={() => markReadMutation.mutate()}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No notifications yet</p>
            <p className="text-xs text-slate-500 mt-1">Updates on your posted ads will appear here</p>
          </Card>
        ) : (
          notifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => item.path && navigate(item.path)}
              className={`p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-blue-200 ${
                item.unread ? 'bg-blue-50/40 border-blue-100' : ''
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${item.type === 'status' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {item.type === 'status' ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{item.title}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

