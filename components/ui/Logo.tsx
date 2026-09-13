import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconDimensions = {
    sm: { w: 26, h: 26, text: 'text-base' },
    md: { w: 34, h: 34, text: 'text-lg' },
    lg: { w: 42, h: 42, text: 'text-2xl' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted border border-border/80 p-1 shadow-sm flex items-center justify-center shrink-0"
        style={{ width: iconDimensions.w + 6, height: iconDimensions.h + 6 }}
      >
        <img
          src="/logo.png"
          alt="CountingCodes Emblem"
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <span className={`font-heading font-bold tracking-tight text-foreground ${iconDimensions.text}`}>
          Counting<span className="text-primary">Codes</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
