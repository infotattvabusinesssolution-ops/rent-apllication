import axiosClient from './axiosClient';

export const luckyDrawAdminApi = {
  getOverviewStats: async () => {
    return await axiosClient.get('/api/v1/admin/lucky-draws/stats/overview');
  },

  getDraws: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/lucky-draws', { params });
  },

  getDrawById: async (id) => {
    return await axiosClient.get(`/api/v1/admin/lucky-draws/${id}`);
  },

  createDraw: async (data) => {
    return await axiosClient.post('/api/v1/admin/lucky-draws', data);
  },

  updateDraw: async (id, data) => {
    return await axiosClient.put(`/api/v1/admin/lucky-draws/${id}`, data);
  },

  publishDraw: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/publish`);
  },

  unpublishDraw: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/unpublish`);
  },

  closeDraw: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/close`);
  },

  cancelDraw: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/cancel`);
  },

  // Prizes
  getPrizes: async (id) => {
    return await axiosClient.get(`/api/v1/admin/lucky-draws/${id}/prizes`);
  },

  createPrize: async (id, data) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/prizes`, data);
  },

  updatePrize: async (id, prizeId, data) => {
    return await axiosClient.put(`/api/v1/admin/lucky-draws/${id}/prizes/${prizeId}`, data);
  },

  deletePrize: async (id, prizeId) => {
    return await axiosClient.delete(`/api/v1/admin/lucky-draws/${id}/prizes/${prizeId}`);
  },

  // Entries & Payments
  getEntries: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/lucky-draws/entries', { params });
  },

  getDrawEntries: async (id, params = {}) => {
    return await axiosClient.get(`/api/v1/admin/lucky-draws/${id}/entries`, { params });
  },

  getPayments: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/lucky-draws/payments', { params });
  },

  // Winner Engine
  runSystemDraw: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/run-draw`);
  },

  getDrawResult: async (id) => {
    return await axiosClient.get(`/api/v1/admin/lucky-draws/${id}/result`);
  },

  verifyResult: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/verify-result`);
  },

  publishResult: async (id) => {
    return await axiosClient.post(`/api/v1/admin/lucky-draws/${id}/publish-result`);
  },

  getWinners: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/lucky-draws/winners', { params });
  },

  getAuditLogs: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/lucky-draws/audit-logs', { params });
  },
};
