'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, LoginPayload, RegisterPayload } from '../api';
import { defaultMockUser, UserProfile } from '../mockData';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUserXpAndStreak: (xpGained: number, streak?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem('countingcodes_token') || localStorage.getItem('learnforge_token');
      const storedUser =
        localStorage.getItem('countingcodes_user') || localStorage.getItem('learnforge_user');

      // Ignore legacy demo token
      if (storedToken && storedToken !== 'demo-token-alex-morgan' && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      console.warn('Failed to restore auth session:', e);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      setIsAuthModalOpen(true);
    };

    window.addEventListener('learnforge:auth_expired', handleAuthExpired);
    return () => window.removeEventListener('learnforge:auth_expired', handleAuthExpired);
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (payload: LoginPayload) => {
    try {
      const res: any = await authApi.login(payload);
      const data = res?.data || res;
      if (data?.accessToken) {
        const u: UserProfile = {
          id: data.user?.id || 1,
          username: data.user?.username || payload.email.split('@')[0],
          email: data.user?.email || payload.email,
          displayName: data.user?.displayName || payload.email.split('@')[0],
          role: data.user?.role || 'STUDENT',
          xp: data.user?.xp ?? 1240,
          level: data.user?.level ?? 4,
          avatarUrl: data.user?.avatarUrl || null,
          joinedDate: 'September 2025',
          streak: 7,
        };

        setToken(data.accessToken);
        setUser(u);
        localStorage.setItem('countingcodes_token', data.accessToken);
        localStorage.setItem('learnforge_token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('countingcodes_refresh_token', data.refreshToken);
          localStorage.setItem('learnforge_refresh_token', data.refreshToken);
        }
        localStorage.setItem('countingcodes_user', JSON.stringify(u));
        localStorage.setItem('learnforge_user', JSON.stringify(u));
        closeAuthModal();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res: any = await authApi.register(payload);
      const data = res?.data || res;
      if (data?.accessToken) {
        const u: UserProfile = {
          id: data.user?.id || 1,
          username: data.user?.username || payload.username || payload.email.split('@')[0],
          email: data.user?.email || payload.email,
          displayName: data.user?.displayName || payload.displayName || payload.email.split('@')[0],
          role: data.user?.role || 'STUDENT',
          xp: data.user?.xp ?? 0,
          level: data.user?.level ?? 1,
          avatarUrl: data.user?.avatarUrl || null,
          joinedDate: 'Just now',
          streak: 1,
        };

        setToken(data.accessToken);
        setUser(u);
        localStorage.setItem('countingcodes_token', data.accessToken);
        localStorage.setItem('learnforge_token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('countingcodes_refresh_token', data.refreshToken);
          localStorage.setItem('learnforge_refresh_token', data.refreshToken);
        }
        localStorage.setItem('countingcodes_user', JSON.stringify(u));
        localStorage.setItem('learnforge_user', JSON.stringify(u));
        closeAuthModal();
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('countingcodes_token');
    localStorage.removeItem('countingcodes_refresh_token');
    localStorage.removeItem('countingcodes_user');
    localStorage.removeItem('learnforge_token');
    localStorage.removeItem('learnforge_refresh_token');
    localStorage.removeItem('learnforge_user');
  };

  const updateUserXpAndStreak = (xpGained: number, streak?: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        xp: prev.xp + xpGained,
        streak: streak !== undefined ? streak : prev.streak,
        level: Math.max(prev.level, Math.floor((prev.xp + xpGained) / 300) + 1),
      };
      localStorage.setItem('countingcodes_user', JSON.stringify(updated));
      localStorage.setItem('learnforge_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateUserXpAndStreak,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
