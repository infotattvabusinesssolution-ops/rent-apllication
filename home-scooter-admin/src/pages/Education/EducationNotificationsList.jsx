import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationAdminApi } from '../../api/educationAdminApi';
import { toast } from 'sonner';
import {
  Bell,
  Send,
  Plus,
  Clock,
  CheckCircle,
  Users,
  X,
  FileText,
} from 'lucide-react';

export const EducationNotificationsList = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notificationType: 'GENERAL',
    targetAudience: 'ALL',
    scheduledAt: '',
    sendNow: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['educationNotifications'],
    queryFn: () => educationAdminApi.getNotifications(),
  });

  const sendMutation = useMutation({
    mutationFn: (payload) => educationAdminApi.createNotification(payload),
    onSuccess: () => {
      toast.success('Notification broadcasted successfully!');
      queryClient.invalidateQueries(['educationNotifications']);
      setIsModalOpen(false);
      setFormData({
        title: '',
        message: '',
        notificationType: 'GENERAL',
        targetAudience: 'ALL',
        scheduledAt: '',
        sendNow: true,
      });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send notification'),
  });

  const notifications = data?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    sendMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Education Push Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast instant updates, exam alerts, and scholarship notices directly to student mobile devices & web app.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Send Push Notification
        </button>
      </div>

      {/* Notification History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No Notifications Sent Yet</p>
            <p className="text-xs text-slate-400">Click "Send Push Notification" to broadcast your first message.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID / Type</th>
                  <th className="px-4 py-3">Title & Message</th>
                  <th className="px-4 py-3">Audience</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {notifications.map((n) => (
                  <tr key={n.notificationId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-mono font-bold text-indigo-600">{n.notificationId}</p>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700 mt-0.5 inline-block">
                        {n.notificationType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{n.message}</p>
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-600">{n.targetAudience}</td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        n.status === 'SENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {n.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {n.sentAt ? new Date(n.sentAt).toLocaleString() : 'Not sent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create & Broadcast Notification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                New Push Notification
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Scholarship Alert: Apply before 30th Sept"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Body *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter message details for push notification..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.notificationType}
                    onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  >
                    <option value="GENERAL">General Notice</option>
                    <option value="COURSE">Course Update</option>
                    <option value="CAREER">Career Job Alert</option>
                    <option value="EXAM">Exam Schedule</option>
                    <option value="SCHOLARSHIP">Scholarship Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  >
                    <option value="ALL">All Registered Students</option>
                    <option value="10TH">10th Standard</option>
                    <option value="12TH">12th Standard</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="JOB_SEEKER">Job Seekers</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sendMutation.isPending ? 'Broadcasting...' : 'Broadcast Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
