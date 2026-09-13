import { create } from 'zustand';
import { authApi } from '../api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('learnforge_user') || 'null'),
  token: localStorage.getItem('learnforge_token') || null,
  isAuthenticated: !!localStorage.getItem('learnforge_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      const data = res.data; // tokenResponse { accessToken, refreshToken, tokenType, user }
      const token = data.accessToken || data.token;
      localStorage.setItem('learnforge_token', token);
      localStorage.setItem('learnforge_user', JSON.stringify(data.user));
      set({
        token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      // Backend ApiResponse: { success, message, error } — err may be the response data
      const msg = err?.message || err?.error || (typeof err === 'string' ? err : 'Login failed. Please check your credentials.');
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  register: async (params, maybeEmail, maybePassword) => {
    set({ isLoading: true, error: null });
    try {
      let payload = {};
      if (typeof params === 'object') {
        payload = {
          username: params.username,
          displayName: params.fullName || params.displayName,
          email: params.email,
          password: params.password,
        };
      } else {
        payload = {
          displayName: params,
          email: maybeEmail,
          password: maybePassword,
        };
      }

      const res = await authApi.register(payload);
      const data = res.data;
      const token = data.accessToken || data.token;
      localStorage.setItem('learnforge_token', token);
      localStorage.setItem('learnforge_user', JSON.stringify(data.user));
      set({
        token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const msg = err?.message || err?.error || (typeof err === 'string' ? err : 'Registration failed. Please try again.');
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('learnforge_token');
    localStorage.removeItem('learnforge_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUserStats: (xp, level) => {
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, xp, level };
      localStorage.setItem('learnforge_user', JSON.stringify(updated));
      set({ user: updated });
    }
  }
}));
