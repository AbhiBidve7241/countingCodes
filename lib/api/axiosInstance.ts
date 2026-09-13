import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && (window as any).__LEARNFORGE_API_URL__) ||
  'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Request Interceptor: inject Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('countingcodes_token') || localStorage.getItem('learnforge_token');
      if (token && token !== 'demo-token-alex-morgan') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: unwrap ApiResponse<T> & handle 401
axiosInstance.interceptors.response.use(
  (response) => {
    // If backend wrapped in { success: true, data: ..., message: ... }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle token refresh on 401 if refresh token is available
    if (status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const refreshToken =
        localStorage.getItem('countingcodes_refresh_token') ||
        localStorage.getItem('learnforge_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            { headers: { 'X-Refresh-Token': refreshToken } }
          );
          const newTokens = res.data?.data || res.data;
          if (newTokens?.accessToken) {
            localStorage.setItem('countingcodes_token', newTokens.accessToken);
            localStorage.setItem('learnforge_token', newTokens.accessToken);
            if (newTokens.refreshToken) {
              localStorage.setItem('countingcodes_refresh_token', newTokens.refreshToken);
              localStorage.setItem('learnforge_refresh_token', newTokens.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('countingcodes_token');
          localStorage.removeItem('countingcodes_refresh_token');
          localStorage.removeItem('countingcodes_user');
          localStorage.removeItem('learnforge_token');
          localStorage.removeItem('learnforge_refresh_token');
          localStorage.removeItem('learnforge_user');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('learnforge:auth_expired'));
          }
        }
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
