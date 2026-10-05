'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  type?: 'timetable' | 'notes' | 'assignments' | 'announcements' | 'search' | 'knowledge' | 'generic';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = ''
}) => {
  const configs = {
    timetable: {
      defaultTitle: 'No Timetable in Orbit Yet',
      defaultDesc: "Your department coordinator hasn't published this week's schedule yet. Check back soon or contact your class representative.",
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
      iconGlow: 'from-cyan-500/20 to-indigo-500/20',
      coreColor: '#38bdf8'
    },
    notes: {
      defaultTitle: 'No Resources in Orbit',
      defaultDesc: 'No academic notes or reference materials match your active filters or subject selection.',
      badgeColor: 'text-violet-400 bg-violet-950/40 border-violet-800/50',
      iconGlow: 'from-violet-500/20 to-fuchsia-500/20',
      coreColor: '#c084fc'
    },
    assignments: {
      defaultTitle: 'All Orbital Tasks Cleared',
      defaultDesc: 'Zero pending assignments in orbit for your section. Enjoy your study time or review previous lecture units.',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
      iconGlow: 'from-emerald-500/20 to-cyan-500/20',
      coreColor: '#34d399'
    },
    announcements: {
      defaultTitle: 'No New Announcements',
      defaultDesc: 'The orbital bulletin is quiet. Department notices, exam schedules, and circulars will appear here.',
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
      iconGlow: 'from-amber-500/20 to-orange-500/20',
      coreColor: '#fbbf24'
    },
    search: {
      defaultTitle: 'No Records Matched',
      defaultDesc: 'No academic records, faculty profiles, or notes matched your search query in this orbit.',
      badgeColor: 'text-sky-400 bg-sky-950/40 border-sky-800/50',
      iconGlow: 'from-sky-500/20 to-indigo-500/20',
      coreColor: '#38bdf8'
    },
    knowledge: {
      defaultTitle: 'Knowledge Base Empty',
      defaultDesc: 'No documents or extracted syllabus chunks uploaded to Orbit AI repository yet.',
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
      iconGlow: 'from-cyan-500/20 to-indigo-500/20',
      coreColor: '#06b6d4'
    },
    generic: {
      defaultTitle: 'Nothing in This Orbit',
      defaultDesc: 'This section currently holds no active academic records.',
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
      iconGlow: 'from-cyan-500/20 to-violet-500/20',
      coreColor: '#38bdf8'
    }
  };

  const cfg = configs[type];
  const finalTitle = title || cfg.defaultTitle;
  const finalDesc = description || cfg.defaultDesc;

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div
        className={`absolute w-72 h-72 rounded-full bg-gradient-to-tr ${cfg.iconGlow} blur-3xl opacity-40 pointer-events-none -top-10`}
      />

      {/* Futuristic Orbit & Planet Illustration */}
      <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
        <svg
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-all duration-700 hover:scale-105"
        >
          {/* Orbital Ellipse 1 */}
          <ellipse
            cx="70"
            cy="70"
            rx="62"
            ry="24"
            transform="rotate(-28 70 70)"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          {/* Orbital Ellipse 2 */}
          <ellipse
            cx="70"
            cy="70"
            rx="56"
            ry="20"
            transform="rotate(38 70 70)"
            stroke="rgba(192, 132, 252, 0.25)"
            strokeWidth="1.2"
          />

          {/* Satellite orbiter dots */}
          <circle cx="22" cy="50" r="3.5" fill="#38bdf8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="118" cy="85" r="3" fill="#c084fc">
            <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Central Planet */}
          <circle cx="70" cy="70" r="24" fill="#0b1329" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          <circle cx="70" cy="70" r="22" fill="url(#planet-glow)" />

          {/* Planet Rings & Atmospheric lines */}
          <path
            d="M52 64 C60 60, 80 60, 88 64"
            stroke={cfg.coreColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M50 72 C60 76, 80 76, 90 72"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <defs>
            <radialGradient id="planet-glow" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="60%" stopColor="#0a0f1d" />
              <stop offset="100%" stopColor="#040711" />
            </radialGradient>
          </defs>
        </svg>

        {/* Floating beacon star */}
        <div className="absolute top-2 right-6 w-2 h-2 rounded-full bg-cyan-300 blur-[1px] animate-ping" />
      </div>

      {/* Status Pill */}
      <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 border ${cfg.badgeColor}`}>
        Orbital Status: Clear
      </div>

      <h3 className="text-xl font-bold text-white tracking-wide mb-2">
        {finalTitle}
      </h3>
      <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-6">
        {finalDesc}
      </p>

      {/* Optional action */}
      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {actionText || 'Explore Next'}
        </Link>
      ) : onAction && actionText ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};
