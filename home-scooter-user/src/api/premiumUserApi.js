import axiosClient from './axiosClient';
import { premiumAuthStorage } from '../utils/premiumAuthStorage';

const getPremiumHeaders = () => {
  const token = premiumAuthStorage.getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const premiumUserApi = {
  // Public Info & Auth
  getPublicInfo: () => axiosClient.get('/v1/premium/public-info'),
  login: (credentials) => axiosClient.post('/v1/premium/auth/login', credentials),
  logout: () => axiosClient.post('/v1/premium/auth/logout', {}, { headers: getPremiumHeaders() }),

  // Member Profile & Status
  getProfile: () => axiosClient.get('/v1/premium/profile', { headers: getPremiumHeaders() }),
  getMembership: () => axiosClient.get('/v1/premium/membership', { headers: getPremiumHeaders() }),

  // Protected Content
  getPremiumContent: (params) =>
    axiosClient.get('/v1/premium/content', { params, headers: getPremiumHeaders() }),
  getPremiumContentById: (id) =>
    axiosClient.get(`/v1/premium/content/${id}`, { headers: getPremiumHeaders() }),

  // Submit Upgrade Request
  submitUpgradeRequest: (formData) =>
    axiosClient.post('/v1/premium/upgrade-request', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
