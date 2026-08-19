import axiosClient from './axiosClient';

export const subscriptionApi = {
  getSubscriptions: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/subscriptions', { params });
  },

  getPendingSubscriptions: async () => {
    return await axiosClient.get('/api/v1/admin/subscriptions/pending');
  },

  getSubscriptionById: async (id) => {
    return await axiosClient.get(`/api/v1/admin/subscriptions/${id}`);
  },

  activateSubscription: async (id) => {
    return await axiosClient.post(`/api/v1/admin/subscriptions/${id}/activate`);
  },

  rejectSubscription: async (id, reason = '') => {
    return await axiosClient.post(`/api/v1/admin/subscriptions/${id}/reject`, { reason });
  },
};
