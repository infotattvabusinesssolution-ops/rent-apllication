import axiosClient from './axiosClient';

export const usersApi = {
  getUsers: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/users', { params });
  },

  getUserById: async (id) => {
    return await axiosClient.get(`/api/v1/admin/users/${id}`);
  },

  banUser: async (id, reason = '') => {
    return await axiosClient.post(`/api/v1/admin/users/${id}/ban`, { reason });
  },

  unbanUser: async (id) => {
    return await axiosClient.post(`/api/v1/admin/users/${id}/unban`);
  },

  verifyUser: async (id) => {
    return await axiosClient.post(`/api/v1/admin/users/${id}/verify`);
  },

  toggleSubscriber: async (id) => {
    return await axiosClient.post(`/api/v1/admin/users/${id}/toggle-subscriber`);
  },
};
