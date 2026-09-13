import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';

export const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const backgroundEffect = useThemeStore((state) => state.backgroundEffect);

  useEffect(() => {
    if (backgroundEffect !== 'particles') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 24), 45);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.6 ? 'rgba(99, 102, 241, 0.4)' : Math.random() > 0.3 ? 'rgba(217, 70, 239, 0.3)' : 'rgba(6, 182, 212, 0.3)',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundEffect]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic ambient gradients — always visible */}
      <div className="absolute -top-48 -left-24 w-[600px] h-[500px] bg-indigo-600/12 rounded-full blur-3xl" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[400px] bg-fuchsia-600/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 left-1/3 w-[600px] h-[500px] bg-cyan-600/8 rounded-full blur-3xl" />
      <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] bg-purple-600/6 rounded-full blur-3xl" />

      {backgroundEffect === 'particles' && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />
      )}
    </div>
  );
};
