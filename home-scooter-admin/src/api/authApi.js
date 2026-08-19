import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    const data = await axiosClient.post('/api/v1/admin/auth/login', credentials);
    if (data?.token) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    }
    return data;
  },

  getCurrentUser: async () => {
    return await axiosClient.get('/api/v1/admin/auth/me');
  },

  logout: async () => {
    try {
      await axiosClient.post('/api/v1/admin/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },
};
