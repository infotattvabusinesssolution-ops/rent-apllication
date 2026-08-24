import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { educationUserApi } from '../../api/educationUserApi';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EducationNotifications = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['userEducationNotifications'],
    queryFn: () => educationUserApi.getNotifications(),
  });

  const notifications = data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">Push Notifications</h1>
              <p className="text-xs text-slate-500">Stay informed with real-time exam alerts and notices.</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
            {notifications.length} Messages
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Push Notifications</p>
            <p className="text-xs text-slate-400">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.notificationId}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {item.notificationType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.sentAt ? new Date(item.sentAt).toLocaleString() : ''}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                {item.contentId && (
                  <button
                    onClick={() => navigate(`/education/content/${item.contentId}`)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-1"
                  >
                    View Related Update <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
