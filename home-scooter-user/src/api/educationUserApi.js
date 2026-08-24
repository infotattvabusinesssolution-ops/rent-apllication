import axiosClient from './axiosClient';
import { educationAuthStorage } from '../utils/educationAuthStorage';

const getEducationHeaders = () => {
  const token = educationAuthStorage.getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const educationUserApi = {
  // Public Information & Auth
  getPublicInfo: () => axiosClient.get('/v1/education/public-info'),
  registerStudent: (data) => axiosClient.post('/v1/education/auth/register', data),
  loginStudent: (credentials) => axiosClient.post('/v1/education/auth/login', credentials),
  logoutStudent: () => axiosClient.post('/v1/education/auth/logout', {}, { headers: getEducationHeaders() }),

  // Student Profile
  getProfile: () => axiosClient.get('/v1/education/profile', { headers: getEducationHeaders() }),
  updateProfile: (data) => axiosClient.put('/v1/education/profile', data, { headers: getEducationHeaders() }),

  // Dashboard & Content Discovery
  getDashboard: () => axiosClient.get('/v1/education/dashboard', { headers: getEducationHeaders() }),
  getContentList: (params) => axiosClient.get('/v1/education/content', { params, headers: getEducationHeaders() }),
  getContentById: (id) => axiosClient.get(`/v1/education/content/${id}`, { headers: getEducationHeaders() }),

  // Notifications & Push Device Token
  getNotifications: () => axiosClient.get('/v1/education/notifications', { headers: getEducationHeaders() }),
  registerDeviceToken: (data) => axiosClient.post('/v1/education/device-token', data, { headers: getEducationHeaders() }),
};
