import axios from 'axios';
import { toast } from 'sonner';
import { authStorage } from '../utils/authStorage';

const LIVE_API_URL = 'https://rentapi.infotattvabusinesssolutions.com/api';
const LOCAL_API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5027').replace(/\/+$/, '') + '/api';

/**
 * Dynamically determines the backend API URL:
 * - If running locally (localhost, 127.0.0.1, or local IP), uses local server URL on port 5027 with /api prefix.
 * - Otherwise (deployed/live production environment), uses live server URL with /api prefix.
 */
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local');

    if (isLocalhost) {
      return LOCAL_API_URL;
    }
    return (import.meta.env.VITE_LIVE_API_BASE_URL || LIVE_API_URL).replace(/\/+$/, '') + '/api';
  }
  return import.meta.env.DEV ? LOCAL_API_URL : LIVE_API_URL;
};

const API_BASE_URL = getApiBaseUrl();

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        authStorage.clear();
      } else if (status >= 500) {
        toast.error('Server error occurred. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
