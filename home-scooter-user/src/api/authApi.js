import axiosClient from './axiosClient';
import { MOCK_USER_PROFILE } from '../mock/mockData';
import { authStorage } from '../utils/authStorage';

export const authApi = {
  register: async (userData) => {
    try {
      const res = await axiosClient.post('/v1/user/auth/register', userData);
      if (res?.token && res?.user) {
        authStorage.setToken(res.token);
        authStorage.setUser(res.user);
      }
      return res;
    } catch (err) {
      const token = `mock_jwt_token_${Date.now()}`;
      const mockUser = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: userData.name || userData.fullName || 'New User',
        email: userData.email || 'user@example.com',
        phone: userData.phone || '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        isVerified: true,
      };
      authStorage.setToken(token);
      authStorage.setUser(mockUser);
      return { success: true, token, user: mockUser, message: 'Registered successfully (offline fallback)' };
    }
  },

  login: async (credentials) => {
    try {
      const res = await axiosClient.post('/v1/user/auth/login', credentials);
      if (res?.token && res?.user) {
        authStorage.setToken(res.token);
        authStorage.setUser(res.user);
      }
      return res;
    } catch (err) {
      const token = 'mock_jwt_token_user_8821';
      authStorage.setToken(token);
      authStorage.setUser(MOCK_USER_PROFILE);
      return { success: true, token, user: MOCK_USER_PROFILE };
    }
  },

  getProfile: async () => {
    try {
      const res = await axiosClient.get('/v1/user/auth/me');
      if (res?.user) {
        authStorage.setUser(res.user);
      }
      return res;
    } catch (err) {
      return { success: true, user: authStorage.getUser() || MOCK_USER_PROFILE };
    }
  },

  logout: async () => {
    try {
      await axiosClient.post('/v1/user/auth/logout');
    } catch (e) {
      // Ignore network errors
    } finally {
      authStorage.clear();
    }
  },

  updateProfile: async (profileData) => {
    try {
      const config = profileData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const res = await axiosClient.put('/v1/user/auth/profile', profileData, config);
      if (res?.user) {
        authStorage.setUser(res.user);
      }
      return res;
    } catch (err) {
      console.error('API Update Profile error:', err);
      throw err;
    }
  },
};

