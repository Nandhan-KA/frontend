import axios from 'axios';

// Get the API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8080';

// Log environment information in development mode
if (import.meta.env.DEV) {
  console.log('Environment:', import.meta.env.MODE);
  console.log('API URL:', API_URL);
  console.log('Frontend URL:', FRONTEND_URL);
}

// Create an axios instance with base URL
export const api = axios.create({
  baseURL: API_URL
});

// Student API - Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentToken');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      // Clear invalid tokens
      localStorage.removeItem('studentToken');
      // Redirect to login
      window.location.href = '/student/login';
    }
    return Promise.reject(error);
  }
);

// Admin API
export const adminApi = axios.create({
  baseURL: API_URL
});

// Add request interceptor for admin token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for admin authentication errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Admin authentication error:', error.response.data);
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Public API (no auth required)
export const publicApi = axios.create({
  baseURL: API_URL
}); 