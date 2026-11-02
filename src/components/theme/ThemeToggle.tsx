'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className={`relative flex h-10 w-[76px] shrink-0 items-center rounded-full border border-line bg-panel p-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 h-8 w-8 rounded-full bg-accent-strong transition-all duration-300 ${isDark ? 'left-[40px]' : 'left-1'}`}
      />
      <span className="relative z-10 flex h-8 w-8 items-center justify-center">
        <Sun className={`h-4 w-4 transition-colors ${isDark ? 'text-muted' : 'text-on-accent'}`} aria-hidden="true" />
      </span>
      <span className="relative z-10 flex h-8 w-8 items-center justify-center">
        <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-on-accent' : 'text-muted'}`} aria-hidden="true" />
      </span>
    </button>
  );
}
