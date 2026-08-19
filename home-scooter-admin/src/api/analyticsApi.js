import axiosClient from './axiosClient';

export const analyticsApi = {
  getAnalytics: async (range = '30d') => {
    return await axiosClient.get('/api/v1/admin/analytics', { params: { range } });
  },
};
