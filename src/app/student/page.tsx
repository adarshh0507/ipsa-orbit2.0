'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TodaySchedule } from '@/components/student/TodaySchedule';
import { Popup } from '@/components/student/Popup';
import { orbitStore } from '@/lib/store';
import { TICK_MS, useClockTick } from '@/lib/useClock';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  SquareCheckBig,
  User,
  Users,
  Zap,
} from 'lucide-react';

type PopupKind = 'assignments' | 'notices' | 'quick';

const DAY_MS = 24 * 60 * 60 * 1000;

const QUICK_LINKS = [
  { label: 'Notes & Resources', href: '/student/notes', icon: BookOpen },
  { label: 'Timetable', href: '/student/timetable', icon: CalendarDays },
  { label: 'Assignments', href: '/student/assignments', icon: SquareCheckBig },
  { label: 'Announcements', href: '/student/announcements', icon: Bell },
  { label: 'Faculty & Labs', href: '/student/faculty', icon: Users },
  { label: 'My Profile', href: '/student/profile', icon: User },
];

export default function StudentDashboard() {
  const { user, section } = useAuth();
  const tick = useClockTick();
  const [, setStoreTick] = useState(0);
  const [openPopup, setOpenPopup] = useState<PopupKind | null>(null);
  const closePopup = useCallback(() => setOpenPopup(null), []);

  useEffect(() => {
    return orbitStore.subscribe(() => setStoreTick((t) => t + 1));
  }, []);

  const nowMs = tick * TICK_MS;
  const isRecent = (iso: string, days: number) => nowMs > 0 && nowMs - Date.parse(iso) < days * DAY_MS;

  const subjects = orbitStore.getSubjects();
  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.short_name || '';

  const assignments = orbitStore
    .getAssignments()
    .filter((a) => a.is_published && (a.section === 'Both' || a.section === section));

  const announcements = orbitStore
    .getAnnouncements()
    .filter((a) => a.target_section === 'Both' || a.target_section === section);

  // An urgent notice from the admin shows up at the top for 3 days. After that it lives in the Notices popup.
  const urgentNotices = announcements.filter((a) => a.priority === 'urgent' && isRecent(a.created_at, 3));
  const newNotices = announcements.filter((a) => isRecent(a.created_at, 7)).length;

  const actionButtons: { kind: PopupKind; label: string; hint: string; icon: React.ReactNode; badge?: number }[] = [
    { kind: 'quick', label: 'Quick Access', hint: 'Explore now', icon: <Zap className="h-6 w-6" aria-hidden="true" /> },
    {
      kind: 'assignments',
      label: `Pending Assignments (${assignments.length})`,
      hint: 'View details',
      icon: <SquareCheckBig className="h-6 w-6" aria-hidden="true" />,
    },
    {
      kind: 'notices',
      label: 'Latest Notices',
      hint: 'Check updates',
      icon: <Bell className="h-6 w-6" aria-hidden="true" />,
      badge: newNotices,
    },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-4 lg:space-y-5">
        {/* Hero with the IPS Academy building */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-line bg-panel-alt">
          <Image
            src="/hero/ips-building.jpg"
            alt="IPS Academy Institute of Engineering and Science building at sunset"
            width={669}
            height={377}
            priority
            className="absolute inset-y-0 right-0 -z-10 h-full w-auto max-w-none object-cover object-right opacity-60 sm:opacity-100"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--hero-fade)] via-[var(--hero-fade)]/85 to-transparent sm:via-[var(--hero-fade)]/60"
          />
          <div className="max-w-xl px-5 py-6 sm:px-9 sm:py-8">
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-4xl">
              Welcome back,
              <span className="block bg-gradient-to-r from-accent-strong to-accent-2 bg-clip-text pb-1 text-transparent">
                {user?.full_name || 'Student'} <span aria-hidden="true">👋</span>
              </span>
            </h1>
            <span aria-hidden="true" className="mt-2 block h-0.5 w-12 rounded-full bg-accent-strong" />
            <p className="mt-3 text-sm italic text-ink-soft sm:text-base">Keep learning. Keep growing. You&apos;ve got this!</p>
          </div>
        </section>

        {/* Only appears when the admin posts something urgent */}
        {urgentNotices.length > 0 && (
          <div className="space-y-2">
            {urgentNotices.map((notice) => (
              <button
                key={notice.id}
                type="button"
                onClick={() => setOpenPopup('notices')}
                className="flex w-full items-center gap-3 rounded-2xl border border-red-400/50 bg-red-500/10 px-5 py-3.5 text-left hover:bg-red-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block text-xs font-bold text-red-400">Urgent notice</span>
                  <span className="block text-base font-semibold text-ink">{notice.title}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        <TodaySchedule />

        <div className="grid gap-3 sm:grid-cols-3">
          {actionButtons.map((b) => (
            <button
              key={b.kind}
              type="button"
              onClick={() => setOpenPopup(b.kind)}
              className="relative flex items-center gap-3.5 rounded-2xl border border-line bg-panel px-4 py-3 text-left shadow-[var(--card-shadow)] transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">{b.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold leading-snug text-ink">{b.label}</span>
                <span className="mt-0.5 flex items-center gap-1 text-sm font-medium text-accent">
                  {b.hint}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
              {b.badge ? (
                <span className="absolute right-3 top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {b.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {openPopup === 'quick' && (
        <Popup title="Quick Access" onClose={closePopup}>
          <ul className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex h-full flex-col items-start gap-3 rounded-2xl border border-line bg-panel-alt p-4 hover:border-accent"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-ink">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Popup>
      )}

      {openPopup === 'assignments' && (
        <Popup title="Pending Assignments" onClose={closePopup} footerHref="/student/assignments" footerLabel="Open assignments page">
          {assignments.length === 0 ? (
            <p className="py-6 text-center text-base text-ink-soft">Nothing pending. You are all caught up.</p>
          ) : (
            <ul className="space-y-3">
              {assignments.map((a) => {
                const overdue = nowMs > 0 && Date.parse(a.due_date) < nowMs;
                return (
                  <li key={a.id} className="rounded-2xl bg-panel-alt p-4">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="rounded-md bg-line px-2 py-0.5 font-bold text-ink">{subjectName(a.subject_id)}</span>
                      {a.priority === 'urgent' && <span className="font-bold text-red-400">Urgent</span>}
                    </div>
                    <p className="mt-2 text-base font-semibold text-ink">{a.title}</p>
                    <p className={`mt-1 text-sm ${overdue ? 'text-red-400' : 'text-muted'}`}>
                      {overdue ? 'Was due' : 'Due'} {new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Popup>
      )}

      {openPopup === 'notices' && (
        <Popup title="Latest Notices" onClose={closePopup} footerHref="/student/announcements" footerLabel="Open notices page">
          {announcements.length === 0 ? (
            <p className="py-6 text-center text-base text-ink-soft">No notices right now.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.slice(0, 8).map((n) => (
                <li key={n.id} className={`rounded-2xl p-4 ${n.priority === 'urgent' ? 'bg-red-500/10' : 'bg-panel-alt'}`}>
                  <div className="flex items-center justify-between gap-2 text-xs text-muted">
                    <span className="font-semibold capitalize">{n.category.replace('_', ' ')}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-ink">
                    {n.priority === 'urgent' && <span className="mr-2 text-sm font-bold text-red-400">Urgent</span>}
                    {n.title}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{n.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Popup>
      )}
    </DashboardLayout>
  );
}
