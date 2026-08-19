import axiosClient from './axiosClient';
import { MOCK_REPORTS } from '../mock/mockData';

let localReportsState = [...MOCK_REPORTS];

export const reportsApi = {
  getReports: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/reports', { params });
    } catch (err) {
      let filtered = [...localReportsState];
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((r) => r.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.adTitle.toLowerCase().includes(q) ||
            r.sellerName.toLowerCase().includes(q) ||
            r.reporterName.toLowerCase().includes(q) ||
            r.reportReason.toLowerCase().includes(q)
        );
      }
      return { data: filtered, total: filtered.length };
    }
  },

  getReportById: async (id) => {
    try {
      return await axiosClient.get(`/api/v1/admin/reports/${id}`);
    } catch (err) {
      const item = localReportsState.find((r) => r.id === id);
      if (item) return item;
      throw new Error('Report not found');
    }
  },

  dismissReport: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/admin/reports/${id}/dismiss`);
    } catch (err) {
      localReportsState = localReportsState.map((r) =>
        r.id === id ? { ...r, status: 'Dismissed' } : r
      );
      return { success: true, message: 'Report dismissed successfully' };
    }
  },

  takeDownAdFromReport: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/admin/reports/${id}/takedown`);
    } catch (err) {
      localReportsState = localReportsState.map((r) =>
        r.id === id ? { ...r, status: 'Taken Down' } : r
      );
      return { success: true, message: 'Advertisement taken down and report resolved' };
    }
  },
};
