'use client';

import React, { useEffect, useRef } from 'react';

interface StarfieldProps {
  className?: string;
  showOrbits?: boolean;
}

export const Starfield: React.FC<StarfieldProps> = ({ className = '', showOrbits = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle definition
    interface Star {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      speed: number;
      hue: number;
      twinkleSpeed: number;
    }

    const starCount = Math.floor(Math.min(width, 1600) / 10);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.2,
        alpha: Math.random(),
        speed: (Math.random() - 0.5) * 0.15,
        hue: Math.random() > 0.6 ? 190 : Math.random() > 0.3 ? 260 : 210, // Cyan, violet, soft blue
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let angle = 0;

    const render = () => {
      angle += 0.0015;
      ctx.clearRect(0, 0, width, height);

      // Deep Midnight Space Gradient
      const spaceGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.3, 50,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.8
      );
      spaceGrad.addColorStop(0, '#081226'); // Ambient deep navy
      spaceGrad.addColorStop(0.4, '#040916'); // Midnight dark
      spaceGrad.addColorStop(1, '#02040a'); // Near-black cosmic edge
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Nebulae Glows (Cyan & Violet)
      const cyanGlow = ctx.createRadialGradient(
        width * 0.2, height * 0.25, 0,
        width * 0.2, height * 0.25, 450
      );
      cyanGlow.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      cyanGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, width, height);

      const violetGlow = ctx.createRadialGradient(
        width * 0.8, height * 0.65, 0,
        width * 0.8, height * 0.65, 550
      );
      violetGlow.addColorStop(0, 'rgba(139, 92, 246, 0.09)');
      violetGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = violetGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw faint orbital rings if enabled
      if (showOrbits) {
        ctx.save();
        ctx.translate(width * 0.5, height * 0.42);
        
        // Ring 1
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.38, height * 0.22, -0.25, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Ring 2
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.52, height * 0.32, 0.35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.035)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      // Draw Stars
      for (const s of stars) {
        s.alpha += s.twinkleSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.alpha) * 0.3;
        s.y += s.speed;

        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${Math.max(0.1, Math.min(1, currentAlpha))})`;
        ctx.fill();

        // Halo for brighter stars
        if (s.size > 1.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, 70%, ${currentAlpha * 0.2})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showOrbits]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
