import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { to: '/courses', label: 'Courses', icon: '📚' },
  { to: '/revision', label: 'Revision', icon: '🧠', dot: true },
  { to: '/progress', label: 'Progress', icon: '📊' },
];

export const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { soundEnabled, toggleSound } = useThemeStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const displayInitial = user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#080d1a]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Brand Logo ── */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="hidden sm:flex flex-col -space-y-0.5">
              <span className="font-display font-extrabold text-lg tracking-tight text-white leading-none">
                Learn<span className="text-indigo-400">Forge</span>
              </span>
              <span className="text-[9px] uppercase font-mono tracking-[0.15em] text-indigo-400/60 font-semibold">
                CS Mastery
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-0.5 ml-2">
              {NAV_LINKS.map(({ to, label, dot }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                  {dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                  )}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* XP + Level Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/25 text-xs">
                <span className="font-mono font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded text-[11px]">
                  LVL {user?.level || 1}
                </span>
                <span className="font-semibold text-amber-300 flex items-center gap-0.5">
                  ⚡ {user?.xp || 0}
                </span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>

              {/* Profile + Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/8">
                <Link
                  to="/profile"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-white text-xs ring-2 ring-indigo-500/30 hover:scale-105 hover:ring-indigo-500/50 transition-all shadow-md shadow-indigo-500/20"
                  title="My Profile"
                >
                  {displayInitial}
                </Link>
                <button
                  onClick={logout}
                  title="Log out"
                  className="hidden sm:block text-xs text-slate-500 hover:text-rose-400 font-medium px-2 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                title="Menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  {mobileOpen
                    ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Nav Drawer ── */}
      {isAuthenticated && mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#080d1a]/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-fade-in-up">
          {NAV_LINKS.map(({ to, label, icon, dot }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
              {dot && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-auto" />}
            </Link>
          ))}
          <div className="border-t border-white/8 pt-3 mt-2 flex items-center justify-between px-4">
            <span className="text-xs text-slate-400 font-mono">
              LVL {user?.level || 1} · ⚡ {user?.xp || 0} XP
            </span>
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="text-xs text-rose-400 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
