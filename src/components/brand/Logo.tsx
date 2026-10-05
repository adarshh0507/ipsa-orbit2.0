'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'icon' | 'sidebar' | 'login';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md',
  showTagline = true
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', tag: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', tag: 'text-[11px]' },
    lg: { icon: 50, text: 'text-2xl', tag: 'text-xs' },
    xl: { icon: 68, text: 'text-3xl', tag: 'text-sm' }
  };

  const { icon, text, tag } = sizeMap[size];

  // The custom IPSA ORBIT Emblem: Orbital Rings, Core Planet, Starlight & Node Beacons
  const Emblem = (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: icon, height: icon }}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse pointer-events-none" />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-500 hover:rotate-45"
      >
        <defs>
          <linearGradient id="orbit-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="orbit-core" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#080d1a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit Ring 1 (Tilted -35 deg) */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="17"
          transform="rotate(-35 50 50)"
          stroke="url(#orbit-grad-cyan)"
          strokeWidth="2.5"
          strokeDasharray="6 3"
          className="opacity-90 animate-spin-slow origin-center"
        />

        {/* Orbit Ring 2 (Tilted +45 deg) */}
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="15"
          transform="rotate(45 50 50)"
          stroke="#818cf8"
          strokeWidth="1.8"
          className="opacity-70"
        />

        {/* Orbit Satellite Nodes */}
        <circle cx="82" cy="30" r="3.5" fill="#38bdf8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="72" r="3" fill="#c084fc">
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Central Core Planet with Glow */}
        <circle cx="50" cy="50" r="14" fill="url(#orbit-core)" />
        <circle cx="50" cy="50" r="14" fill="url(#star-glow)" />

        {/* Core Star Highlight */}
        <path
          d="M50 42 L52 48 L58 50 L52 52 L50 58 L48 52 L42 50 L48 48 Z"
          fill="#ffffff"
          className="drop-shadow-[0_0_6px_#ffffff]"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        {Emblem}
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {Emblem}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-wider ${text} bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-violet-300 transition-all`}>
            IPSA
          </span>
          <span className={`font-extrabold tracking-widest ${text} text-cyan-400 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]`}>
            ORBIT
          </span>
        </div>
        {showTagline && (
          <span className={`${tag} tracking-[0.2em] font-medium text-slate-400 uppercase -mt-0.5 group-hover:text-cyan-200/80 transition-colors`}>
            Your Campus. Your Universe.
          </span>
        )}
      </div>
    </Link>
  );
};
