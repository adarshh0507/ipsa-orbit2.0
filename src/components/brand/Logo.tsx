'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'icon' | 'sidebar' | 'login';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

const sizeMap = {
  sm: { icon: 40, text: 'text-lg', tag: 'text-[10px]' },
  md: { icon: 48, text: 'text-xl', tag: 'text-xs' },
  lg: { icon: 60, text: 'text-2xl', tag: 'text-sm' },
  xl: { icon: 76, text: 'text-3xl', tag: 'text-base' },
};

// A planet circled by a tilted ring, with a small spark. Colours follow the theme.
function Emblem({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="logo-planet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent-2)" />
          <stop offset="100%" stopColor="var(--accent-strong)" />
        </linearGradient>
      </defs>
      {/* ring, back half */}
      <ellipse cx="50" cy="52" rx="44" ry="15" transform="rotate(-28 50 52)" stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="3" />
      {/* planet */}
      <circle cx="50" cy="52" r="22" fill="url(#logo-planet)" />
      <path d="M31 46c8 6 22 7 37 0" stroke="var(--on-accent)" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
      {/* ring, front half */}
      <path d="M8 66C26 74 62 64 90 38" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      {/* spark */}
      <path d="M82 12l2.6 6.4L91 21l-6.4 2.6L82 30l-2.6-6.4L73 21l6.4-2.6z" fill="var(--ink)" />
    </svg>
  );
}

export const Logo: React.FC<LogoProps> = ({ variant = 'horizontal', className = '', size = 'md', showTagline = true }) => {
  const { icon, text, tag } = sizeMap[size];

  if (variant === 'icon') {
    return (
      <Link href="/" aria-label="IPSA ORBIT home" className={`inline-flex items-center ${className}`}>
        <Emblem size={icon} />
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="IPSA ORBIT home" className={`inline-flex items-center gap-3 ${className}`}>
      <Emblem size={icon} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-extrabold tracking-wide text-ink ${text}`}>IPSA</span>
        <span className={`font-display font-extrabold tracking-wide text-accent ${text}`}>ORBIT</span>
        {showTagline && <span className={`mt-1.5 font-medium tracking-wide text-muted ${tag}`}>Learn · Connect · Grow</span>}
      </span>
    </Link>
  );
};
