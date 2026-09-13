import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const { soundEnabled, toggleSound, backgroundEffect, setBackgroundEffect } = useThemeStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/30">
          {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
        </div>
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl font-display font-bold text-white">{user?.displayName || user?.username || 'Engineer'}</h1>
            <Badge variant="brand" size="sm">{user?.role || 'STUDENT'}</Badge>
          </div>
          <p className="text-xs font-mono text-slate-400">@{user?.username} · {user?.email}</p>
        </div>

        <Button variant="danger" size="md" onClick={logout}>
          Log Out
        </Button>
      </div>

      {/* Preferences & Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-white">
          App Preferences & Audio
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="flex items-center justify-between border-white/10">
            <div>
              <h4 className="font-semibold text-white text-sm">Synthesized Audio</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant Web Audio chimes for quizzes & level ups</p>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                soundEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </Card>

          <Card className="flex items-center justify-between border-white/10">
            <div>
              <h4 className="font-semibold text-white text-sm">Background Canvas</h4>
              <p className="text-xs text-slate-400 mt-0.5">Constellation particle effects</p>
            </div>
            <select
              value={backgroundEffect}
              onChange={(e) => setBackgroundEffect(e.target.value)}
              className="bg-slate-900 border border-white/10 text-xs rounded-lg px-2.5 py-1.5 text-slate-200"
            >
              <option value="particles">Particles</option>
              <option value="minimal">Minimal</option>
            </select>
          </Card>
        </div>
      </div>

    </div>
  );
};
