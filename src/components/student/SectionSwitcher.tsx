'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Section } from '@/types';

const OPTIONS: { section: Section; active: string }[] = [
  { section: 'DS-1', active: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50' },
  { section: 'DS-2', active: 'bg-violet-500/20 text-violet-200 border-violet-400/50' },
];

// Switch between DS-1 and DS-2 without signing out. The choice is saved by AuthContext, so it
// survives navigation and page refreshes.
export function SectionSwitcher() {
  const { section, setSection } = useAuth();

  return (
    <div role="group" aria-label="Choose your section" className="inline-flex gap-1 rounded-xl border border-white/10 bg-slate-900/70 p-1">
      {OPTIONS.map((opt) => {
        const isActive = section === opt.section;
        return (
          <button
            key={opt.section}
            type="button"
            aria-pressed={isActive}
            onClick={() => setSection(opt.section)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-bold transition-colors ${
              isActive ? opt.active : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt.section}
          </button>
        );
      })}
    </div>
  );
}
