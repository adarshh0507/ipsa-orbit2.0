'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { useIsClient } from '@/lib/useNowMs';
import { Modal } from '@/components/ui/Modal';
import type { Announcement } from '@/types';

const isUrgent = (a: Announcement) => a.priority === 'urgent' || a.category === 'urgent';

function readSeen(key: string): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

// A bell-style row. A dot shows when there are notices the student has not opened yet (red when any
// of them is urgent). The notices themselves only open in a modal on click.
export function LatestNotices() {
  const { user, section } = useAuth();
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const [freshIds, setFreshIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [, bump] = useState(0);

  // A notice the admin publishes while the dashboard is open appears straight away.
  useEffect(() => orbitStore.subscribe(() => bump((n) => n + 1)), []);

  const seenKey = `ipsa_orbit_seen_notices:${user?.id || 'guest'}`;

  const notices = isClient
    ? orbitStore
        .getAnnouncements()
        .filter((a) => a.target_section === 'Both' || a.target_section === section)
        .sort((a, b) => Number(isUrgent(b)) - Number(isUrgent(a)) || b.created_at.localeCompare(a.created_at))
    : [];

  // The first time this student opens the dashboard we note the time. Notices that already existed
  // then (the old demo ones) never light the dot. Only notices the admin publishes afterwards do.
  const baselineKey = `ipsa_orbit_notices_baseline:${user?.id || 'guest'}`;
  useEffect(() => {
    try {
      if (!localStorage.getItem(baselineKey)) localStorage.setItem(baselineKey, new Date().toISOString());
    } catch {
      // Storage can be blocked in private windows. Then no dot is shown, which is the safe default.
    }
  }, [baselineKey]);

  let baseline = '9999';
  if (isClient) {
    try {
      baseline = localStorage.getItem(baselineKey) || '9999';
    } catch {
      baseline = '9999';
    }
  }

  const seen = isClient ? readSeen(seenKey) : [];
  const unseen = notices.filter((a) => a.created_at > baseline && !seen.includes(a.id));
  const unseenUrgent = unseen.filter(isUrgent);

  const openNotices = () => {
    setFreshIds(unseen.map((a) => a.id));
    setExpandedId(null);
    setOpen(true);
    try {
      localStorage.setItem(seenKey, JSON.stringify(Array.from(new Set([...seen, ...notices.map((a) => a.id)]))));
    } catch {
      // Storage can be blocked in private windows. The indicator just stays until the next visit.
    }
    bump((n) => n + 1);
  };

  const indicatorLabel =
    unseenUrgent.length > 0
      ? `${unseenUrgent.length} new urgent notice${unseenUrgent.length > 1 ? 's' : ''}`
      : unseen.length > 0
        ? `${unseen.length} new notice${unseen.length > 1 ? 's' : ''}`
        : '';

  return (
    <>
      <button
        type="button"
        onClick={openNotices}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-left transition-colors hover:border-amber-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <span className="relative">
            <Bell className="h-4 w-4 text-amber-400" aria-hidden="true" />
            {unseen.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-2 w-2">
                {unseenUrgent.length > 0 && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    unseenUrgent.length > 0 ? 'bg-rose-500' : 'bg-amber-400'
                  }`}
                />
              </span>
            )}
          </span>
          Latest Notices
        </span>
        {indicatorLabel && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              unseenUrgent.length > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {indicatorLabel}
          </span>
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Latest Notices">
        {notices.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-300">No notices right now.</p>
        ) : (
          <ul className="space-y-2.5">
            {notices.map((a) => {
              const urgent = isUrgent(a);
              const expanded = expandedId === a.id;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : a.id)}
                    aria-expanded={expanded}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      urgent
                        ? 'border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/15'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                    }`}
                  >
                    <span className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                      {urgent && <span className="rounded bg-rose-500 px-1.5 py-0.5 text-white">Urgent</span>}
                      {freshIds.includes(a.id) && (
                        <span className="rounded bg-amber-400 px-1.5 py-0.5 text-slate-900">New</span>
                      )}
                      <span className="text-slate-400">{a.category.replace('_', ' ')}</span>
                      <span className="ml-auto font-medium normal-case tracking-normal text-slate-500">{a.date}</span>
                    </span>
                    <span className="mt-1.5 block text-sm font-bold text-white">{a.title}</span>
                    <span className={`mt-1 block text-xs leading-relaxed text-slate-300 ${expanded ? '' : 'line-clamp-2'}`}>
                      {a.description}
                    </span>
                    {expanded && a.attachment_name && (
                      <span className="mt-2 block text-[11px] text-cyan-300">Attachment: {a.attachment_name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href="/student/announcements"
          onClick={() => setOpen(false)}
          className="mt-4 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300"
        >
          All notices →
        </Link>
      </Modal>
    </>
  );
}
