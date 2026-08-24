import axiosClient from './axiosClient';

export const educationAdminApi = {
  // Dashboard KPI & Analytics Charts
  getDashboardStats: () => axiosClient.get('/api/v1/admin/education/dashboard'),

  // Student Directory Management
  getStudents: (params) => axiosClient.get('/api/v1/admin/education/students', { params }),
  getStudentById: (id) => axiosClient.get(`/api/v1/admin/education/students/${id}`),
  updateStudent: (id, data) => axiosClient.put(`/api/v1/admin/education/students/${id}`, data),
  blockStudent: (id, data) => axiosClient.post(`/api/v1/admin/education/students/${id}/block`, data),
  unblockStudent: (id) => axiosClient.post(`/api/v1/admin/education/students/${id}/unblock`),

  // Content Management (Text, Banner, Video, PDF Document, Link)
  getContentList: (params) => axiosClient.get('/api/v1/admin/education/content', { params }),
  getContentById: (id) => axiosClient.get(`/api/v1/admin/education/content/${id}`),
  createContent: (formData) =>
    axiosClient.post('/api/v1/admin/education/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateContent: (id, formData) =>
    axiosClient.put(`/api/v1/admin/education/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteContent: (id) => axiosClient.delete(`/api/v1/admin/education/content/${id}`),
  publishContent: (id) => axiosClient.post(`/api/v1/admin/education/content/${id}/publish`),
  unpublishContent: (id) => axiosClient.post(`/api/v1/admin/education/content/${id}/unpublish`),

  // Notifications Management
  getNotifications: () => axiosClient.get('/api/v1/admin/education/notifications'),
  createNotification: (formData) =>
    axiosClient.post('/api/v1/admin/education/notifications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Engagement Reports & Audit Logs
  getReports: () => axiosClient.get('/api/v1/admin/education/reports'),
};
