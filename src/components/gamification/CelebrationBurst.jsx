import React, { useEffect } from 'react';

export const CelebrationBurst = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate 25 floating confetti particles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 40 + 20,
    size: Math.random() * 8 + 6,
    color: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i % 6],
    rotation: Math.random() * 360,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            borderRadius: '3px',
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: '1.5s',
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
      <div className="text-center animate-pulse">
        <span className="text-5xl font-display font-extrabold gradient-text-gold drop-shadow-2xl">
          🔥 Streak On Fire! 🔥
        </span>
      </div>
    </div>
  );
};
