import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response unwrapping & 401 handling
axiosInstance.interceptors.response.use(
  (response) => {
    // If backend uses ApiResponse wrapper { success, data, message }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('learnforge_token');
      localStorage.removeItem('learnforge_user');
      // If we are not already on the login page, redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
