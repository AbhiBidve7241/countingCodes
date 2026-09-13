import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">

      {/* Ambient BG glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-indigo-500/18 shadow-2xl shadow-indigo-500/8 relative overflow-hidden">

          {/* Subtle inner glow top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-fuchsia-600 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/30 float-anim">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Welcome back
              </h1>
              <p className="text-xs text-slate-400 mt-1.5">
                Continue your CS mastery streak
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/12 border border-rose-500/25 flex items-center gap-2.5 text-rose-300 text-xs font-medium animate-scale-in">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@domain.com"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl glass-input text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-display mt-2"
            >
              Sign In to LearnForge
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* Footer link */}
          <div className="text-center text-xs text-slate-400">
            New to LearnForge?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors">
              Create a free account
            </Link>
          </div>

        </div>

        {/* Outside card note */}
        <p className="text-center text-[11px] text-slate-600 mt-5 font-mono">
          No demo account? <Link to="/register" className="text-indigo-500/80 hover:text-indigo-400 underline">Register in 10 seconds →</Link>
        </p>
      </div>
    </div>
  );
};
