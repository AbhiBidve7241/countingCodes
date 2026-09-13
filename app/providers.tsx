'use client';

import React from 'react';
import { AuthProvider } from '../lib/store/authContext';
import { AuthModal } from '../components/auth/AuthModal';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
