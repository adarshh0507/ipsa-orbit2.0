'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Coffee, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Section } from '@/types';
import {
  DAY_NAMES,
  LUNCH,
  formatMinutes,
  getDaySchedule,
  type ClassBlock,
  type DayName,
  type Period,
} from '@/lib/classSchedule';

// Re-read the clock every 15 seconds so the live class, the countdown and the day all stay current.
const TICK_MS = 15_000;

function subscribeToClock(onChange: () => void) {
  const id = window.setInterval(onChange, TICK_MS);
  return () => window.clearInterval(id);
}
const getClockSnapshot = () => Math.floor(Date.now() / TICK_MS);
const getServerClockSnapshot = () => 0;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

type BlockStatus = 'done' | 'live' | 'next' | 'upcoming';

const KIND_LABEL: Record<Period['kind'], string> = {
  lecture: 'Lecture',
  tutorial: 'Tutorial',
  lab: 'Lab',
  remedial: 'Remedial',
};

const KIND_STYLE: Record<Period['kind'], string> = {
  lecture: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  tutorial: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  lab: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  remedial: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
};

function SectionSwitch({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
  const options: Section[] = ['DS-1', 'DS-2'];
  return (
    <div role="group" aria-label="Choose section" className="inline-flex rounded-xl border border-white/10 bg-slate-900/70 p-1">
      {options.map((opt) => {
        const active = section === opt;
        const tone = opt === 'DS-1' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-violet-500/20 text-violet-200';
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
              active ? tone : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function BlockCard({
  block,
  status,
  minutes,
  isToday,
}: {
  block: ClassBlock;
  status: BlockStatus;
  minutes: number;
  isToday: boolean;
}) {
  const progress =
    status === 'live'
      ? Math.min(100, Math.max(0, ((minutes - block.startMin) / (block.endMin - block.startMin)) * 100))
      : 0;

  const frame =
    status === 'live'
      ? 'border-cyan-400/60 bg-cyan-500/5 shadow-[0_0_28px_rgba(6,182,212,0.18)]'
      : status === 'next'
        ? 'border-amber-400/40 bg-slate-900/60'
        : status === 'done'
          ? 'border-white/5 bg-slate-900/30 opacity-60'
          : 'border-white/10 bg-slate-900/60';

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-colors ${frame}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
        <div className="sm:w-36 shrink-0">
          <p className="text-[11px] font-semibold text-slate-400">{block.label}</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-white">
            {formatMinutes(block.startMin)} to {formatMinutes(block.endMin)}
          </p>
          <div className="mt-2 min-h-5">
            {status === 'live' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                Live now
              </span>
            )}
            {status === 'next' && isToday && (
              <span className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                Up next, in {formatDuration(block.startMin - minutes)}
              </span>
            )}
            {status === 'done' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Done
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {block.periods.map((period, i) => (
            <div key={`${period.title}-${i}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-white sm:text-base">{period.title}</h3>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${KIND_STYLE[period.kind]}`}>
                  {KIND_LABEL[period.kind]}
                </span>
              </div>
              {(period.faculty || period.room) && (
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  {period.faculty && <span>{period.faculty}</span>}
                  {period.room && (
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {period.room}
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {status === 'live' && (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Class progress">
            <div className="h-full rounded-full bg-cyan-400 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">Ends in {formatDuration(block.endMin - minutes)}</p>
        </div>
      )}
    </div>
  );
}

export function TodaySchedule() {
  const { section, setSection } = useAuth();
  const tick = useSyncExternalStore(subscribeToClock, getClockSnapshot, getServerClockSnapshot);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-cyan-400" aria-hidden="true" />
        <h2 className="text-base font-bold text-white">Today&apos;s classes</h2>
      </div>
      <SectionSwitch section={section} onChange={setSection} />
    </div>
  );

  // Before the browser clock is available (server render), show a quiet placeholder.
  if (tick === 0) {
    return (
      <div className="space-y-4">
        {header}
        <div className="h-40 animate-pulse rounded-2xl border border-white/5 bg-slate-900/40" />
      </div>
    );
  }

  const now = new Date(tick * TICK_MS);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const todayName = DAY_NAMES[now.getDay()];
  const isSunday = todayName === 'Sunday';
  const viewDay: DayName = isSunday ? 'Monday' : (todayName as DayName);
  const isToday = !isSunday;
  const schedule = getDaySchedule(section, viewDay);

  const statusOf = (block: ClassBlock): BlockStatus => {
    if (!isToday) return 'upcoming';
    if (minutes >= block.endMin) return 'done';
    if (minutes >= block.startMin) return 'live';
    return 'upcoming';
  };

  const statuses = schedule.blocks.map(statusOf);
  const firstUpcoming = statuses.indexOf('upcoming');
  if (isToday && firstUpcoming !== -1 && !statuses.includes('live')) {
    statuses[firstUpcoming] = 'next';
  }

  const lastBlock = schedule.blocks[schedule.blocks.length - 1];
  const allDone = isToday && minutes >= lastBlock.endMin;
  const onLunch = isToday && minutes >= LUNCH.startMin && minutes < LUNCH.endMin;
  const liveIndex = statuses.indexOf('live');

  let summary: string;
  if (isSunday) {
    summary = 'No classes on Sunday. Here is the plan for Monday.';
  } else if (liveIndex !== -1) {
    const b = schedule.blocks[liveIndex];
    summary = `${b.label[0].toUpperCase()}${b.label.slice(1)} is on now and ends at ${formatMinutes(b.endMin)}.`;
  } else if (onLunch) {
    summary = `Lunch break. The 3rd class starts at ${formatMinutes(schedule.blocks[2].startMin)}.`;
  } else if (allDone) {
    summary = 'All lectures are over for today.';
  } else if (firstUpcoming !== -1) {
    const b = schedule.blocks[firstUpcoming];
    summary = `Next: ${b.label} at ${formatMinutes(b.startMin)}, in ${formatDuration(b.startMin - minutes)}.`;
  } else {
    summary = '';
  }

  const dateLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-4">
      {header}

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-slate-300">{summary}</p>
        <p className="text-xs text-slate-500">
          {dateLabel} · {formatMinutes(minutes)} · Section {section}
        </p>
      </div>

      <div className="space-y-3">
        {schedule.blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            {block.id === 'third' && (
              <div
                className={`flex items-center gap-3 rounded-xl border border-dashed px-4 py-2.5 text-xs ${
                  onLunch ? 'border-amber-400/50 bg-amber-500/5 text-amber-200' : 'border-white/10 text-slate-500'
                }`}
              >
                <Coffee className="h-4 w-4" aria-hidden="true" />
                <span className="font-semibold">Lunch break</span>
                <span className="font-mono">
                  {formatMinutes(LUNCH.startMin)} to {formatMinutes(LUNCH.endMin)}
                </span>
                {onLunch && <span className="ml-auto font-bold">On now</span>}
              </div>
            )}
            <BlockCard block={block} status={statuses[i]} minutes={minutes} isToday={isToday} />
          </React.Fragment>
        ))}

        {schedule.activity && (
          <div
            className={`flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3.5 sm:px-5 ${
              allDone ? 'border-amber-400/40 bg-amber-500/5' : 'border-white/10 bg-slate-900/40'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Activity class, after the 3rd class</p>
              <p className="text-sm font-bold text-white">{schedule.activity}</p>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/student/timetable"
        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
      >
        <span>Full timetable</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
