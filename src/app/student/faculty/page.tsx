'use client';

import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { INITIAL_LABS } from '@/lib/store';
import { getFacultyDirectory } from '@/lib/classSchedule';
import { GlassCard } from '@/components/brand/GlassCard';
import type { Section } from '@/types';
import {
  Users,
  BookOpen,
  FlaskConical,
  Search,
  Building,
} from 'lucide-react';

type Filter = 'all' | Section;

// Colour for each kind of section tag (works in dark and light theme)
function tone(sections: Section[]) {
  if (sections.length > 1) return { pill: 'bg-accent/15 text-accent', bar: 'bg-accent', label: 'Both DS-1 & DS-2' };
  if (sections[0] === 'DS-1') return { pill: 'bg-accent-2/20 text-accent-2', bar: 'bg-accent-2', label: 'DS-1' };
  return { pill: 'bg-emerald-500/15 text-emerald-400', bar: 'bg-emerald-400', label: 'DS-2' };
}

const sameSections = (a: Section[], b: Section[]) => a.length === b.length && a.every((s) => b.includes(s));

export default function StudentFacultyPage() {
  const [activeTab, setActiveTab] = useState<'faculty' | 'labs'>('faculty');
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const directory = useMemo(() => getFacultyDirectory(), []);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return directory
      .map((f) => ({
        ...f,
        subjects: f.subjects.filter((s) => filter === 'all' || s.sections.includes(filter)),
      }))
      .filter((f) => f.subjects.length > 0)
      .filter((f) => !q || f.name.toLowerCase().includes(q) || f.subjects.some((s) => s.title.toLowerCase().includes(q)));
  }, [directory, filter, searchQuery]);

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'DS-1', label: 'DS-1' },
    { id: 'DS-2', label: 'DS-2' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-5xl space-y-5 animate-fadeIn">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Faculty</h1>
          </div>
          <p className="mt-2 text-sm text-ink-soft">Who teaches which subject in DS-1 and DS-2.</p>
        </div>

        {/* Tabs */}
        <div className="flex w-full items-center gap-1 rounded-full border border-line bg-panel p-1 text-sm font-semibold sm:w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 transition-colors sm:flex-initial ${
              activeTab === 'faculty' ? 'bg-accent-strong text-on-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Faculty
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('labs')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 transition-colors sm:flex-initial ${
              activeTab === 'labs' ? 'bg-accent-strong text-on-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Labs
          </button>
        </div>

        {/* FACULTY TAB */}
        {activeTab === 'faculty' && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2" role="group" aria-label="Filter by section">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={filter === f.id}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                      filter === f.id
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-line bg-panel text-ink-soft hover:border-accent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search faculty or subject"
                  aria-label="Search faculty or subject"
                  className="w-full rounded-full border border-line bg-panel py-2 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="rounded-2xl border border-line bg-panel px-5 py-8 text-center text-sm text-ink-soft">
                No faculty found.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {visible.map((fac) => {
                  // Side bar colour: the section colour when all subjects share it, otherwise the main accent
                  const first = fac.subjects[0].sections;
                  const bar = fac.subjects.every((s) => sameSections(s.sections, first)) ? tone(first).bar : 'bg-accent';

                  return (
                    <li
                      key={fac.name}
                      className="relative overflow-hidden rounded-2xl border border-line bg-panel py-4 pl-6 pr-4 shadow-[var(--card-shadow)]"
                    >
                      <span className={`absolute inset-y-0 left-0 w-1.5 ${bar}`} aria-hidden="true" />
                      <h2 className="text-lg font-bold text-ink">{fac.name}</h2>

                      <ul className="mt-3 space-y-2.5">
                        {fac.subjects.map((s) => {
                          const t = tone(s.sections);
                          return (
                            <li key={s.code} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink-soft">
                                <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                {s.title}
                              </span>
                              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${t.pill}`}>{t.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {/* LABS TAB */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {INITIAL_LABS.map((lab, index) => (
              <GlassCard key={index} glow="violet" className="flex flex-col justify-between border border-white/5 p-6">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-950/80 text-violet-400">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{lab.name}</h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                      <span>
                        Venue: <strong className="text-white">{lab.location}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 flex-shrink-0 text-violet-400" />
                      <span>
                        Instructors: <span className="text-slate-300">{lab.faculty}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-400">
                  <span>Data Science First Year</span>
                  <span className="font-semibold text-emerald-400">Active Lab Unit</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
