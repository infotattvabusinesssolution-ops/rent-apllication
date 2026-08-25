import axios from 'axios';
import { toast } from 'sonner';

const LIVE_API_URL = 'https://rentapi.infotattvabusinesssolutions.com';
const LOCAL_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5027';

/**
 * Dynamically determines the backend API URL:
 * - If running locally (localhost, 127.0.0.1, or local network IP), uses local server URL.
 * - Otherwise (deployed/live production environment), uses live server URL.
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
    return import.meta.env.VITE_LIVE_API_BASE_URL || LIVE_API_URL;
  }
  return import.meta.env.DEV ? LOCAL_API_URL : LIVE_API_URL;
};

const API_BASE_URL = getApiBaseUrl().replace(/\/+$/, '');


const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes default timeout for API requests
});

// Request Interceptor: Attach bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        if (window.location.pathname !== '/login') {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status >= 500) {
        toast.error('Server error occurred. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
