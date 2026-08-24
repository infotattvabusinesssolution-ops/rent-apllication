import axiosClient from './axiosClient';

export const premiumAdminApi = {
  // Dashboard Stats
  getDashboardStats: () => axiosClient.get('/api/v1/admin/premium/dashboard'),

  // Content Management
  getContentList: (params) => axiosClient.get('/api/v1/admin/premium/content', { params }),
  getContentById: (id) => axiosClient.get(`/api/v1/admin/premium/content/${id}`),
  createContent: (formData) =>
    axiosClient.post('/api/v1/admin/premium/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateContent: (id, formData) =>
    axiosClient.put(`/api/v1/admin/premium/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteContent: (id) => axiosClient.delete(`/api/v1/admin/premium/content/${id}`),
  publishContent: (id) => axiosClient.post(`/api/v1/admin/premium/content/${id}/publish`),
  unpublishContent: (id) => axiosClient.post(`/api/v1/admin/premium/content/${id}/unpublish`),

  // Member Management
  getMembers: (params) => axiosClient.get('/api/v1/admin/premium/members', { params }),
  getMemberById: (id) => axiosClient.get(`/api/v1/admin/premium/members/${id}`),
  createMember: (data) => axiosClient.post('/api/v1/admin/premium/members', data),
  updateMember: (id, data) => axiosClient.put(`/api/v1/admin/premium/members/${id}`, data),
  renewMember: (id, data) => axiosClient.post(`/api/v1/admin/premium/members/${id}/renew`, data),
  blockMember: (id, data) => axiosClient.post(`/api/v1/admin/premium/members/${id}/block`, data),
  unblockMember: (id) => axiosClient.post(`/api/v1/admin/premium/members/${id}/unblock`),
  changePassword: (id, data) => axiosClient.post(`/api/v1/admin/premium/members/${id}/change-password`, data),

  // Upgrade Requests
  getUpgradeRequests: (params) => axiosClient.get('/api/v1/admin/premium/upgrade-requests', { params }),
  approveUpgradeRequest: (id, data) => axiosClient.post(`/api/v1/admin/premium/upgrade-requests/${id}/approve`, data),
  rejectUpgradeRequest: (id, data) => axiosClient.post(`/api/v1/admin/premium/upgrade-requests/${id}/reject`, data),

  // Activity & Reports
  getReports: () => axiosClient.get('/api/v1/admin/premium/reports'),
};
