import axiosClient from './axiosClient';

export const visitorWinApi = {
  getRegistrations: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/visitor-win', { params });
  },

  deleteRegistration: async (id) => {
    return await axiosClient.delete(`/api/v1/admin/visitor-win/${id}`);
  },

  exportVisitorWin: async () => {
    return await axiosClient.get('/api/v1/admin/visitor-win/export', { responseType: 'blob' });
  },
};
