'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TodaySchedule } from '@/components/student/TodaySchedule';
import { Popup } from '@/components/student/Popup';
import { orbitStore } from '@/lib/store';
import { TICK_MS, useClockTick } from '@/lib/useClock';
import { AlertTriangle, BookOpen, Bell, FileCheck2, ChevronRight } from 'lucide-react';

type PopupKind = 'assignments' | 'notices' | 'notes';

const DAY_MS = 24 * 60 * 60 * 1000;

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

  const resources = orbitStore
    .getResources()
    .filter((r) => r.is_published && (r.section === 'Both' || r.section === section));

  // An urgent notice from the admin shows up at the top for 3 days. After that it lives in the Notices popup.
  const urgentNotices = announcements.filter((a) => a.priority === 'urgent' && isRecent(a.created_at, 3));
  const newNotices = announcements.filter((a) => isRecent(a.created_at, 7)).length;
  const newNotes = resources.filter((r) => isRecent(r.created_at, 7)).length;

  const buttons: {
    kind: PopupKind;
    label: string;
    hint: string;
    icon: React.ReactNode;
    tone: string;
  }[] = [
    {
      kind: 'assignments',
      label: 'Assignments',
      hint: assignments.length === 0 ? 'Nothing pending' : `${assignments.length} to do`,
      icon: <FileCheck2 className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-emerald-400/15 text-emerald-200',
    },
    {
      kind: 'notices',
      label: 'Notices',
      hint: newNotices === 0 ? 'Nothing new' : `${newNotices} new this week`,
      icon: <Bell className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-amber-400/15 text-amber-200',
    },
    {
      kind: 'notes',
      label: 'Notes',
      hint: newNotes === 0 ? 'Open the library' : `${newNotes} new this week`,
      icon: <BookOpen className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-sky-400/15 text-sky-200',
    },
  ];

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Hello, {user?.full_name || 'there'}</h1>

        {/* Only appears when the admin posts something urgent */}
        {urgentNotices.length > 0 && (
          <div className="space-y-2">
            {urgentNotices.map((notice) => (
              <button
                key={notice.id}
                type="button"
                onClick={() => setOpenPopup('notices')}
                className="flex w-full items-center gap-3 rounded-xl border border-rose-400/50 bg-rose-400/10 px-4 py-3 text-left hover:bg-rose-400/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block text-xs font-bold text-rose-200">Urgent notice</span>
                  <span className="block text-base font-semibold text-white">{notice.title}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-rose-200" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        <TodaySchedule />

        <div className="grid gap-3 sm:grid-cols-3">
          {buttons.map((b) => (
            <button
              key={b.kind}
              type="button"
              onClick={() => setOpenPopup(b.kind)}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-800/50 p-4 text-left transition-colors hover:border-white/25 hover:bg-slate-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${b.tone}`}>{b.icon}</span>
              <span>
                <span className="block text-base font-bold text-white">{b.label}</span>
                <span className="block text-sm text-slate-400">{b.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {openPopup === 'assignments' && (
        <Popup title="Assignments" onClose={closePopup} footerHref="/student/assignments" footerLabel="Open assignments page">
          {assignments.length === 0 ? (
            <p className="py-6 text-center text-base text-slate-300">Nothing pending. You are all caught up.</p>
          ) : (
            <ul className="space-y-3">
              {assignments.map((a) => {
                const overdue = nowMs > 0 && Date.parse(a.due_date) < nowMs;
                return (
                  <li key={a.id} className="rounded-xl bg-slate-800/60 p-4">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="rounded-md bg-slate-700 px-2 py-0.5 font-bold text-slate-100">{subjectName(a.subject_id)}</span>
                      {a.priority === 'urgent' && <span className="font-bold text-rose-300">Urgent</span>}
                    </div>
                    <p className="mt-2 text-base font-semibold text-white">{a.title}</p>
                    <p className={`mt-1 text-sm ${overdue ? 'text-rose-300' : 'text-slate-400'}`}>
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
        <Popup title="Notices" onClose={closePopup} footerHref="/student/announcements" footerLabel="Open notices page">
          {announcements.length === 0 ? (
            <p className="py-6 text-center text-base text-slate-300">No notices right now.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.slice(0, 8).map((n) => (
                <li key={n.id} className={`rounded-xl p-4 ${n.priority === 'urgent' ? 'bg-rose-400/10' : 'bg-slate-800/60'}`}>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="font-semibold capitalize">{n.category.replace('_', ' ')}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-white">
                    {n.priority === 'urgent' && <span className="mr-2 text-sm font-bold text-rose-300">Urgent</span>}
                    {n.title}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-slate-300">{n.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Popup>
      )}

      {openPopup === 'notes' && (
        <Popup title="Latest notes" onClose={closePopup} footerHref="/student/notes" footerLabel="Open the notes library">
          {resources.length === 0 ? (
            <p className="py-6 text-center text-base text-slate-300">No notes uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {resources.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-xl bg-slate-800/60 p-4">
                  <p className="text-xs font-bold text-slate-300">
                    {subjectName(r.subject_id)}
                    {r.unit_or_module ? `, ${r.unit_or_module}` : ''}
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">{r.title}</p>
                </li>
              ))}
            </ul>
          )}
        </Popup>
      )}
    </DashboardLayout>
  );
}
