'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/store/authContext';
import { X, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when modal opens
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({
          username: username.trim() || undefined,
          email: email.trim(),
          password,
          displayName: displayName.trim() || undefined,
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const message =
        err?.message ||
        err?.response?.data?.message ||
        'Authentication failed. Verify your credentials or backend status.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <Logo size="md" />

        <div className="mt-5">
          <h2 className="font-heading text-2xl font-bold">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Sign in to pick up where you left off.'
              : 'Join CountingCodes and build your engineering edge today.'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="mt-6 flex rounded-xl bg-muted p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 transition ${
              mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 transition ${
              mode === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-pink/30 bg-pink/10 p-3.5 text-xs font-semibold text-pink-foreground">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Display Name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-muted-foreground focus-within:border-primary">
                  <User size={17} />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Username
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-muted-foreground focus-within:border-primary">
                  <span className="text-xs font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alex_m"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-muted-foreground focus-within:border-primary">
              <Mail size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@countingcodes.com"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-muted-foreground focus-within:border-primary">
              <Lock size={17} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary w-full py-3.5 text-center mt-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : mode === 'login' ? (
              <>
                Sign In <ArrowRight size={17} />
              </>
            ) : (
              <>
                Create Free Account <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
