'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { saveAdminSection, useAdminSection } from '@/lib/useAdminSection';
import type { Section } from '@/types';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  GraduationCap,
  ShieldCheck,
  SquareCheckBig,
  Sun,
} from 'lucide-react';

const SECTIONS: { id: Section; caption: string }[] = [
  { id: 'DS-1', caption: 'Semester 1 · Data Science' },
  { id: 'DS-2', caption: 'Semester 1 · Data Science' },
];

export default function AdminHubPage() {
  const section = useAdminSection();
  const { setSection } = useAuth();
  // null = still asking which section to manage
  const [picked, setPicked] = useState<Section | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => orbitStore.subscribe(() => setTick((t) => t + 1)), []);

  const choose = (s: Section) => {
    setSection(s);
    saveAdminSection(s);
    setPicked(s);
  };

  const active: Section = picked ?? section;
  const forActive = (target: Section | 'Both') => target === 'Both' || target === active;

  const notes = orbitStore.getResources().filter((r) => forActive(r.section));
  const announcements = orbitStore.getAnnouncements().filter((a) => forActive(a.target_section));
  const importantCount = announcements.filter((a) => a.priority === 'urgent').length;
  const noticeCount = announcements.length - importantCount;
  const assignments = orbitStore.getAssignments().filter((a) => forActive(a.section));
  const weeks = orbitStore.getTimetableWeeks().filter((w) => w.section === active);
  const holidays = orbitStore.getHolidays();

  const modules = [
    {
      title: 'Notes & Resources',
      hint: `${notes.length} uploaded`,
      action: 'Upload notes',
      href: '/admin/notes',
      icon: BookOpen,
      tile: 'bg-accent/15 text-accent',
    },
    {
      title: 'Notices',
      hint: `${noticeCount} posted`,
      action: 'Post a notice',
      href: '/admin/announcements',
      icon: Bell,
      tile: 'bg-accent-2/15 text-accent-2',
    },
    {
      title: 'Important Notice',
      hint: `${importantCount} active`,
      action: 'Post important notice',
      href: '/admin/announcements?type=important',
      icon: AlertTriangle,
      tile: 'bg-red-500/15 text-red-400',
    },
    {
      title: 'Assignments',
      hint: `${assignments.length} created`,
      action: 'Create assignment',
      href: '/admin/assignments',
      icon: SquareCheckBig,
      tile: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      title: 'Timetable',
      hint: `${weeks.length} week${weeks.length === 1 ? '' : 's'} planned`,
      action: 'Edit timetable',
      href: '/admin/timetable',
      icon: CalendarDays,
      tile: 'bg-pink-500/15 text-pink-400',
    },
    {
      title: 'Holidays',
      hint: `${holidays.length} marked`,
      action: 'Add a holiday',
      href: '/admin/holidays',
      icon: Sun,
      tile: 'bg-line text-ink-soft',
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-5xl space-y-5 animate-fadeIn">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Admin panel
        </div>

        {picked === null ? (
          /* Step 1: which section? */
          <section aria-labelledby="pick-section">
            <h1 id="pick-section" className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Which section do you want to manage?
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Pick one. Notes, notices, assignments and the timetable you add next will be for that section.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => choose(s.id)}
                  className="group flex items-center gap-4 rounded-3xl border border-line bg-panel p-5 text-left shadow-[var(--card-shadow)] transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <GraduationCap className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-3xl font-extrabold text-ink">{s.id}</span>
                    <span className="block text-sm text-muted">{s.caption}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        ) : (
          /* Step 2: what to manage? */
          <section aria-labelledby="pick-module">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 id="pick-module" className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                  Managing <span className="text-accent">{picked}</span>
                </h1>
                <p className="mt-1 text-sm text-ink-soft">What do you want to add or update?</p>
              </div>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-ink hover:border-accent"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Change section
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.title}
                    href={m.href}
                    className="group flex flex-col gap-4 rounded-2xl border border-line bg-panel p-4 shadow-[var(--card-shadow)] transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.tile}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-panel-alt px-2.5 py-1 text-xs font-semibold text-muted">{m.hint}</span>
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-ink">{m.title}</span>
                      <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-accent">
                        {m.action}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
