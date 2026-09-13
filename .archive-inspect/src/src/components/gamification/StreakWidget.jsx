import React from 'react';

export const StreakWidget = ({ currentStreak = 0, longestStreak = 0 }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-orange-500/20 relative overflow-hidden flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 animate-pulse">
          🔥
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-orange-300 font-semibold">
            Daily Streak
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {currentStreak} <span className="text-sm font-normal text-slate-300">Days</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-slate-400 font-mono">Personal Best</div>
        <div className="text-sm font-bold text-amber-300">🏆 {longestStreak} Days</div>
      </div>
    </div>
  );
};
