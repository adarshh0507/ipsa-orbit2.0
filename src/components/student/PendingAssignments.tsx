'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileCheck2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { useIsClient, useNowMs } from '@/lib/useNowMs';
import { Modal } from '@/components/ui/Modal';

const formatDue = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });

// A small row showing how many assignments are pending. The full list opens in a modal.
export function PendingAssignments() {
  const { user, section } = useAuth();
  const isClient = useIsClient();
  const nowMs = useNowMs();
  const [open, setOpen] = useState(false);
  const [, bump] = useState(0);

  // Keep the count current when the admin publishes an assignment or the student submits one.
  useEffect(() => orbitStore.subscribe(() => bump((n) => n + 1)), []);

  const studentId = user?.id || 'demo';
  const submittedIds = new Set(
    orbitStore
      .getStudentAssignments()
      .filter((sa) => sa.student_id === studentId && sa.status === 'submitted')
      .map((sa) => sa.assignment_id),
  );
  const subjects = orbitStore.getSubjects();

  // Same rule as the Assignments page: published, for this section, not yet submitted.
  const pending = isClient
    ? orbitStore
        .getAssignments()
        .filter((a) => a.is_published && (a.section === 'Both' || a.section === section) && !submittedIds.has(a.id))
        .sort((a, b) => a.due_date.localeCompare(b.due_date))
    : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-left transition-colors hover:border-emerald-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <FileCheck2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          Pending Assignments
        </span>
        <span
          className={`min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-bold ${
            pending.length > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
          }`}
          aria-label={isClient ? `${pending.length} pending` : 'Loading'}
        >
          {isClient ? pending.length : '–'}
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Pending Assignments">
        {pending.length === 0 ? (
          <p className="py-6 text-center text-sm font-semibold text-emerald-300">You&apos;re all caught up!</p>
        ) : (
          <ul className="space-y-2.5">
            {pending.map((a) => {
              const subject = subjects.find((s) => s.id === a.subject_id);
              const overdue = nowMs !== 0 && new Date(a.due_date).getTime() < nowMs;
              return (
                <li key={a.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="text-sm font-bold text-white">{a.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono font-bold text-slate-200">
                      {subject?.short_name ?? 'Subject'}
                    </span>
                    <span className="text-slate-400">Due {formatDue(a.due_date)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        overdue ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {overdue ? 'Overdue · Not submitted' : 'Not submitted'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href="/student/assignments"
          onClick={() => setOpen(false)}
          className="mt-4 inline-block text-xs font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Open Assignments to submit →
        </Link>
      </Modal>
    </>
  );
}
