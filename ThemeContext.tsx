'use client';

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'ipsa_orbit_theme';
const THEME_EVENT = 'ipsa-orbit-theme-change';

// Runs before the page paints (see layout.tsx) so there is no flash of the wrong theme.
// First-time visitors get the dark theme.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
const getServerSnapshot = (): Theme => 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Smooth colour fade for a moment, then back to normal
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', next);
    window.setTimeout(() => root.classList.remove('theme-switching'), 350);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode). The theme still switches for this visit.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
