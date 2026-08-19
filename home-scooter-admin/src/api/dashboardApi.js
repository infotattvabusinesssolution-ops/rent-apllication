import axiosClient from './axiosClient';

export const dashboardApi = {
  getStats: async () => {
    return await axiosClient.get('/api/v1/admin/analytics/dashboard');
  },
};
