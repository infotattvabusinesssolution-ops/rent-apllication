import axiosClient from './axiosClient';
import { MOCK_DASHBOARD_STATS } from '../mock/mockData';

export const dashboardApi = {
  getStats: async () => {
    try {
      const data = await axiosClient.get('/api/v1/admin/analytics/dashboard');
      return data;
    } catch (err) {
      return MOCK_DASHBOARD_STATS;
    }
  },
};
