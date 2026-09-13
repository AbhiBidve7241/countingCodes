import React from 'react';

export const ProgressBar = ({
  progress = 0, // 0 to 100
  label = '',
  height = 'h-2.5',
  color = 'indigo', // 'indigo' | 'amber' | 'emerald' | 'gradient'
  showPercentage = false,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colorStyles = {
    indigo: 'bg-indigo-500 shadow-sm shadow-indigo-500/50',
    amber: 'bg-amber-500 shadow-sm shadow-amber-500/50',
    emerald: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono">{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5 ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${colorStyles[color] || colorStyles.indigo}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
