'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Section } from '@/types';

const OPTIONS: { section: Section; hall: string; tone: string }[] = [
  { section: 'DS-1', hall: 'Seminar Hall No.1', tone: 'hover:border-cyan-400 hover:bg-cyan-500/10 focus-visible:outline-cyan-400' },
  { section: 'DS-2', hall: 'Seminar Hall No.2', tone: 'hover:border-violet-400 hover:bg-violet-500/10 focus-visible:outline-violet-400' },
];

export function SectionPicker() {
  const { user, setSection } = useAuth();
  const firstName = user?.full_name?.split(' ')[0];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="section-picker-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      <div className="modal-in relative w-full max-w-md rounded-2xl border border-[#223260] bg-[#0A1330] p-6 sm:p-8">
        <h2 id="section-picker-title" className="font-display text-2xl font-bold text-white">
          {firstName ? `Welcome, ${firstName}.` : 'Welcome.'} Which section are you in?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Your timetable, notes and notices follow your section. You can switch any time from the sidebar.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.section}
              type="button"
              onClick={() => setSection(opt.section)}
              className={`rounded-xl border border-[#223260] bg-[#0E1A3D] px-4 py-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${opt.tone}`}
            >
              <span className="block text-xl font-bold text-white">{opt.section}</span>
              <span className="mt-1 block text-xs text-slate-400">{opt.hall}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
