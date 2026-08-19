import axiosClient from './axiosClient';

export const reportsApi = {
  getReports: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/reports', { params });
  },

  getReportById: async (id) => {
    return await axiosClient.get(`/api/v1/admin/reports/${id}`);
  },

  dismissReport: async (id) => {
    return await axiosClient.post(`/api/v1/admin/reports/${id}/dismiss`);
  },

  takeDownAdFromReport: async (id) => {
    return await axiosClient.post(`/api/v1/admin/reports/${id}/takedown`);
  },
};
