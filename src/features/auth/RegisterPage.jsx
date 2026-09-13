import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ username, fullName, email, password });
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { level: 1, label: 'Weak', color: 'bg-rose-500' };
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    return { level: 3, label: 'Strong', color: 'bg-emerald-500' };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">

      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-fuchsia-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-fuchsia-500/15 shadow-2xl shadow-fuchsia-500/6 relative overflow-hidden">

          {/* Top shimmer line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-600 mx-auto flex items-center justify-center shadow-xl shadow-fuchsia-500/25 float-anim">
              <span className="text-3xl">🚀</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Join LearnForge
              </h1>
              <p className="text-xs text-slate-400 mt-1.5">
                Gamified learning · AI evaluation · Interview prep
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/12 border border-rose-500/25 flex items-center gap-2.5 text-rose-300 text-xs font-medium animate-scale-in">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username + FullName side by side on wide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="reg-username" className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, ''))}
                  placeholder="adalovelace"
                  className="w-full px-3.5 py-3 rounded-xl glass-input text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reg-fullname" className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                  Display Name
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full px-3.5 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars + uppercase + number"
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
              {/* Password strength bar */}
              {strength && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((l) => (
                      <div
                        key={l}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          l <= strength.level ? strength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-mono font-semibold ${
                    strength.level === 1 ? 'text-rose-400' :
                    strength.level === 2 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <Button
              id="register-submit"
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-display mt-2"
            >
              Create My Account 🚀
            </Button>

            <p className="text-[10px] text-slate-500 text-center">
              By creating an account you agree to our Terms of Service.
            </p>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
