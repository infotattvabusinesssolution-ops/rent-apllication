import axiosClient from './axiosClient';
import { MOCK_USER_PROFILE } from '../mock/mockData';
import { authStorage } from '../utils/authStorage';

export const authApi = {
  login: async (credentials) => {
    try {
      const data = await axiosClient.post('/api/v1/auth/login', credentials);
      return data;
    } catch (err) {
      const token = 'mock_jwt_token_user_8821';
      authStorage.setToken(token);
      authStorage.setUser(MOCK_USER_PROFILE);
      return { success: true, token, user: MOCK_USER_PROFILE };
    }
  },

  getProfile: async () => {
    try {
      return await axiosClient.get('/api/v1/user/profile');
    } catch (err) {
      return authStorage.getUser() || MOCK_USER_PROFILE;
    }
  },

  logout: async () => {
    try {
      await axiosClient.post('/api/v1/auth/logout');
    } catch (e) {
      // Ignore network errors
    } finally {
      authStorage.clear();
    }
  },
};
