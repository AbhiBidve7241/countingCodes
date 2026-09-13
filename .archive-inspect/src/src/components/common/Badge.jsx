import React from 'react';

export const Badge = ({
  children,
  variant = 'brand', // 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'rarity-legendary'
  size = 'md', // 'sm' | 'md'
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    brand: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    info: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    neutral: 'bg-slate-800/80 text-slate-300 border-white/10',
    legendary: 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm shadow-amber-500/20',
    epic: 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-sm shadow-purple-500/20',
    rare: 'bg-sky-500/20 text-sky-300 border-sky-400/50',
    common: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-wide uppercase font-mono ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.brand} ${className}`}
    >
      {children}
    </span>
  );
};
