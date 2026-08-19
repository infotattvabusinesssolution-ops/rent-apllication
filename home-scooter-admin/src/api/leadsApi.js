import axiosClient from './axiosClient';

export const leadsApi = {
  getLeads: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/leads', { params });
  },

  updateLeadStatus: async (id, status) => {
    return await axiosClient.patch(`/api/v1/admin/leads/${id}`, { status });
  },

  exportLeads: async () => {
    return await axiosClient.get('/api/v1/admin/leads/export', { responseType: 'blob' });
  },
};
