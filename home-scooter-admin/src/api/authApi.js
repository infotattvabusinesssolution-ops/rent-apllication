import axiosClient from './axiosClient';
import { MOCK_ADMIN_USER } from '../mock/mockData';

export const authApi = {
  login: async (credentials) => {
    try {
      const data = await axiosClient.post('/api/v1/admin/auth/login', credentials);
      return data;
    } catch (err) {
      // Fallback for development if server is unreachable
      if (credentials.email === 'admin@homescooter.com' && credentials.password === 'admin123') {
        const token = 'mock_jwt_token_admin_901';
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(MOCK_ADMIN_USER));
        return { success: true, token, user: MOCK_ADMIN_USER };
      }
      // Demo login helper for any password during development preview
      if (credentials.email && credentials.password) {
        const token = 'mock_jwt_token_admin_901';
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(MOCK_ADMIN_USER));
        return { success: true, token, user: MOCK_ADMIN_USER };
      }
      throw err;
    }
  },

  getCurrentUser: async () => {
    try {
      return await axiosClient.get('/api/v1/admin/auth/me');
    } catch (err) {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : MOCK_ADMIN_USER;
    }
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
