import React from 'react';

export const XpBar = ({ xp = 0, level = 1, xpToNext = 200 }) => {
  const currentLevelBaseXp = (level - 1) * 200;
  const currentLevelProgress = Math.max(0, xp - currentLevelBaseXp);
  const percentage = Math.min(100, Math.round((currentLevelProgress / 200) * 100));

  return (
    <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center font-display font-extrabold text-white text-sm shadow-md shadow-indigo-500/30">
            {level}
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
              Level {level} Architect
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="text-amber-400">⚡</span> {xp} Total XP
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono">
            <strong className="text-white">{xpToNext} XP</strong> to Level {level + 1}
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="w-full bg-slate-900/80 rounded-full h-3 p-0.5 border border-white/10 relative overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
