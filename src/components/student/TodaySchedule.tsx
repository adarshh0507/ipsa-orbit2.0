'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Coffee, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { useNowMs } from '@/lib/useNowMs';
import { LUNCH, formatMinutes, type ClassBlock, type Period } from '@/lib/classSchedule';
import {
  formatCountdown,
  formatDateKey,
  formatIstClock,
  getLiveInfo,
  resolveView,
  type BlockStatus,
} from '@/lib/timetableLogic';

// The Excel timetable sheets list the activity's name for each day but not a time for it.
const ACTIVITY_TIME_FALLBACK = 'TBA';

const KIND_LABEL: Record<Period['kind'], string | null> = {
  lecture: null,
  tutorial: 'Tutorial',
  lab: 'Lab',
  remedial: 'Remedial',
};

function StatusChip({ status }: { status: BlockStatus }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[11px] font-bold text-cyan-300">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </span>
        Live now
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        Completed
      </span>
    );
  }
  return <span className="text-[11px] font-semibold text-slate-400">Upcoming</span>;
}

interface LectureCardProps {
  number: number;
  block: ClassBlock;
  status: BlockStatus;
  showStatus: boolean;
  minutes: number;
  footer: string | null;
}

function LectureCard({ number, block, status, showStatus, minutes, footer }: LectureCardProps) {
  const progress =
    status === 'live'
      ? Math.min(100, Math.max(0, ((minutes - block.startMin) / (block.endMin - block.startMin)) * 100))
      : 0;

  const frame =
    status === 'live'
      ? 'border-cyan-400/60 bg-cyan-500/[0.07]'
      : status === 'completed'
        ? 'border-white/5 bg-slate-900/30 opacity-60'
        : 'border-white/10 bg-slate-900/60';

  return (
    <div className={`flex h-full flex-col rounded-xl border p-3 transition-colors sm:p-4 ${frame}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-400">Lecture {number}</p>
        {showStatus && <StatusChip status={status} />}
      </div>

      <p className="mt-1 font-mono text-xs font-bold text-white sm:text-sm">
        {formatMinutes(block.startMin)} – {formatMinutes(block.endMin)}
      </p>

      <div className="mt-2 flex-1 space-y-1.5">
        {block.periods.map((period, i) => {
          const kind = KIND_LABEL[period.kind];
          return (
            <div key={`${period.title}-${i}`}>
              <p className="text-sm font-bold leading-snug text-white">
                {period.title}
                {kind && (
                  <span className="ml-2 rounded border border-white/15 px-1.5 py-px align-middle text-[10px] font-semibold text-slate-300">
                    {kind}
                  </span>
                )}
              </p>
              {(period.faculty || period.room) && (
                <p className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400">
                  {period.faculty && <span>{period.faculty}</span>}
                  {period.room && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {period.room}
                    </span>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {status === 'live' && (
        <div
          className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Lecture ${number} progress`}
        >
          <div className="h-full rounded-full bg-cyan-400" style={{ width: `${progress}%` }} />
        </div>
      )}
      {footer && <p className="mt-1.5 text-[11px] font-semibold text-amber-300">{footer}</p>}
    </div>
  );
}

export function TodaySchedule() {
  const { section } = useAuth();
  const nowMs = useNowMs();
  const [, bump] = useState(0);

  // Redraw when the admin adds or removes a holiday while this page is open.
  useEffect(() => orbitStore.subscribe(() => bump((n) => n + 1)), []);

  // Before the browser clock is ready (server render), show a quiet placeholder.
  if (nowMs === 0) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-800/60" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-white/5 bg-slate-900/40" />
          ))}
        </div>
      </div>
    );
  }

  const view = resolveView(nowMs, section, orbitStore.getHolidays());
  const { now, schedule } = view;
  const live = schedule ? getLiveInfo(schedule.blocks, now.minutes, view.isToday) : null;

  return (
    <section className="space-y-3" aria-label={view.heading}>
      <p className="text-xs text-slate-400">
        {formatDateKey(now.dateKey)} · <span className="font-mono text-slate-200">{formatIstClock(now.minutes)}</span> IST
      </p>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Calendar className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          {view.heading}
        </h2>
        {view.targetKey && <p className="text-xs text-slate-400">{view.targetLabel} · Section {section}</p>}
      </div>

      {view.notices.map((notice) => (
        <p
          key={notice}
          className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-200"
        >
          {notice}
        </p>
      ))}

      {live && live.headline && <p className="text-sm font-semibold text-cyan-200">{live.headline}</p>}

      {!schedule || !live ? (
        <p className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-6 text-center text-sm text-slate-300">
          No Timetable Available
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-3">
            {schedule.blocks.map((block, i) => {
              const status = live.statuses[i];
              let footer: string | null = null;
              if (view.isToday) {
                if (status === 'live') {
                  footer = `Ends in ${formatCountdown(block.endMin - now.minutes)}`;
                } else if (status === 'upcoming' && i === live.nextIndex) {
                  footer =
                    live.liveIndex === -1
                      ? `Starts in ${formatCountdown(block.startMin - now.minutes)}`
                      : 'Up next';
                }
              }
              return (
                <LectureCard
                  key={block.id}
                  number={i + 1}
                  block={block}
                  status={status}
                  showStatus={view.isToday}
                  minutes={now.minutes}
                  footer={footer}
                />
              );
            })}
          </div>

          <p
            className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] ${
              live.onLunch || live.onShortBreak ? 'font-semibold text-amber-300' : 'text-slate-500'
            }`}
          >
            <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
            <span>5-minute break between lectures 1 and 2</span>
            <span aria-hidden="true">·</span>
            <span>
              Lunch {formatMinutes(LUNCH.startMin)} – {formatMinutes(LUNCH.endMin)}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-400">Activity</span>
            {schedule.activity ? (
              <>
                <span className="text-sm font-bold text-white">{schedule.activity}</span>
                <span className="font-mono text-xs text-slate-400">{ACTIVITY_TIME_FALLBACK}</span>
              </>
            ) : (
              <span className="text-sm text-slate-400">No Activity Scheduled</span>
            )}
          </div>
        </>
      )}

      <Link
        href="/student/timetable"
        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
      >
        <span>Full timetable</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}
