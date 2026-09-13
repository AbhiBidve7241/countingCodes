import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick = null,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hover ? 'glass-card-hover cursor-pointer' : ''
      } ${glow ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
