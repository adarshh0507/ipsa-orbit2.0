'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'none';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  hoverEffect = true,
  onClick
}) => {
  const glowClasses = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    violet: 'border-violet-500/20 hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]',
    amber: 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]',
    none: 'border-white/10 hover:border-white/20'
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 ${glowClasses[glow]} ${
        hoverEffect ? 'hover:-translate-y-1' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Corner subtle glow gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 via-transparent to-transparent rounded-tr-2xl pointer-events-none" />
      {children}
    </div>
  );
};
