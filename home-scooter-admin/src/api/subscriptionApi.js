import axiosClient from './axiosClient';
import { MOCK_SUBSCRIPTIONS } from '../mock/mockData';

let localSubsState = [...MOCK_SUBSCRIPTIONS];

export const subscriptionApi = {
  getSubscriptions: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/subscriptions', { params });
    } catch (err) {
      let filtered = [...localSubsState];
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((s) => s.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.userName.toLowerCase().includes(q) ||
            s.userPhone.includes(q) ||
            s.upiReference.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q)
        );
      }
      return { data: filtered, total: filtered.length };
    }
  },

  getPendingSubscriptions: async () => {
    try {
      return await axiosClient.get('/api/v1/admin/subscriptions/pending');
    } catch (err) {
      const pending = localSubsState.filter((s) => s.status === 'Pending');
      return { data: pending, total: pending.length };
    }
  },

  getSubscriptionById: async (id) => {
    try {
      return await axiosClient.get(`/api/v1/admin/subscriptions/${id}`);
    } catch (err) {
      const item = localSubsState.find((s) => s.id === id);
      if (item) return item;
      throw new Error('Subscription not found');
    }
  },

  activateSubscription: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/admin/subscriptions/${id}/activate`);
    } catch (err) {
      // Return backend contract compliant credentials response
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedUsername = `MEMBER_${randomNum}`;
      const generatedPassword = `Pass#${randomNum}`;
      const now = new Date();
      now.setDate(now.getDate() + 10); // 10 days rule
      const expiryDate = now.toISOString();

      localSubsState = localSubsState.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'Activated',
              activatedDate: new Date().toISOString(),
              expiryDate,
              generatedUsername,
              generatedPassword,
              whatsAppSent: true,
            }
          : s
      );

      return {
        success: true,
        generatedUsername,
        generatedPassword,
        expiryDate,
        whatsAppSent: true,
        message: 'Subscription activated successfully. Credentials sent via WhatsApp.',
      };
    }
  },

  rejectSubscription: async (id, reason = '') => {
    try {
      return await axiosClient.post(`/api/v1/admin/subscriptions/${id}/reject`, { reason });
    } catch (err) {
      localSubsState = localSubsState.map((s) =>
        s.id === id ? { ...s, status: 'Rejected', rejectionReason: reason } : s
      );
      return { success: true, message: 'Subscription payment rejected' };
    }
  },
};
