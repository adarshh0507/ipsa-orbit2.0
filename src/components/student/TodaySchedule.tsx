'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Coffee, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TICK_MS, useClockTick } from '@/lib/useClock';
import type { Section } from '@/types';
import {
  DAY_NAMES,
  LUNCH,
  formatMinutes,
  formatRange,
  getDaySchedule,
  type ClassBlock,
  type DayName,
  type Period,
} from '@/lib/classSchedule';

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
  lecture: 'bg-sky-400/15 text-sky-200',
  tutorial: 'bg-violet-400/15 text-violet-200',
  lab: 'bg-amber-400/15 text-amber-200',
  remedial: 'bg-slate-400/15 text-slate-200',
};

function SectionSwitch({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
  const options: Section[] = ['DS-1', 'DS-2'];
  return (
    <div role="group" aria-label="Choose section" className="inline-flex rounded-xl bg-slate-800/80 p-1">
      {options.map((opt) => {
        const active = section === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
              active ? 'bg-sky-400 text-slate-900' : 'text-slate-300 hover:text-white'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function StatusPill({ status, block, minutes, isToday }: { status: BlockStatus; block: ClassBlock; minutes: number; isToday: boolean }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
        </span>
        Going on now
      </span>
    );
  }
  if (status === 'next' && isToday) {
    return (
      <span className="inline-flex rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
        Next, in {formatDuration(block.startMin - minutes)}
      </span>
    );
  }
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Finished
      </span>
    );
  }
  return null;
}

function BlockCard({ block, status, minutes, isToday }: { block: ClassBlock; status: BlockStatus; minutes: number; isToday: boolean }) {
  const progress =
    status === 'live'
      ? Math.min(100, Math.max(0, ((minutes - block.startMin) / (block.endMin - block.startMin)) * 100))
      : 0;

  const frame =
    status === 'live'
      ? 'border-emerald-400/60 bg-emerald-400/10'
      : status === 'next'
        ? 'border-amber-300/40 bg-slate-800/60'
        : status === 'done'
          ? 'border-white/5 bg-slate-800/30 opacity-70'
          : 'border-white/10 bg-slate-800/50';

  return (
    <div className={`flex min-h-[200px] flex-col rounded-2xl border p-4 sm:p-5 ${frame}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-300">{block.label}</p>
          <p className="mt-0.5 text-sm font-bold text-white">{formatRange(block.startMin, block.endMin)}</p>
        </div>
        <StatusPill status={status} block={block} minutes={minutes} isToday={isToday} />
      </div>

      <div className="mt-4 flex-1 space-y-3">
        {block.periods.map((period, i) => (
          <div key={`${period.title}-${i}`}>
            <p className={`font-bold text-white ${i === 0 ? 'text-lg leading-snug' : 'text-base leading-snug'}`}>{period.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${KIND_STYLE[period.kind]}`}>{KIND_LABEL[period.kind]}</span>
              {period.faculty && <span>{period.faculty}</span>}
              {period.room && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {period.room}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {status === 'live' && (
        <div className="mt-4">
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-700"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Class progress"
          >
            <div className="h-full rounded-full bg-emerald-300 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-slate-300">Ends in {formatDuration(block.endMin - minutes)}</p>
        </div>
      )}
    </div>
  );
}

export function TodaySchedule() {
  const { section, setSection } = useAuth();
  const tick = useClockTick();

  const title = (
    <h2 className="text-xl font-bold text-white">Today&apos;s classes</h2>
  );

  // Before the browser clock is available (server render), show a quiet placeholder.
  if (tick === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          {title}
          <SectionSwitch section={section} onChange={setSection} />
        </div>
        <div className="h-52 animate-pulse rounded-2xl bg-slate-800/40" />
      </section>
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

  let summary = '';
  if (isSunday) {
    summary = 'No classes on Sunday. Here is the plan for Monday.';
  } else if (liveIndex !== -1) {
    const b = schedule.blocks[liveIndex];
    summary = `Your ${b.label} is going on now. It ends at ${formatMinutes(b.endMin)}.`;
  } else if (onLunch) {
    summary = `Lunch break now. The 3rd class starts at ${formatMinutes(schedule.blocks[2].startMin)}.`;
  } else if (allDone) {
    summary = 'All classes are over for today.';
  } else if (firstUpcoming !== -1) {
    const b = schedule.blocks[firstUpcoming];
    summary = `Your ${b.label} starts at ${formatMinutes(b.startMin)}, in ${formatDuration(b.startMin - minutes)}.`;
  }

  const dateLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {title}
          <p className="mt-0.5 text-sm text-slate-400">
            {dateLabel} · {formatMinutes(minutes)}
          </p>
        </div>
        <SectionSwitch section={section} onChange={setSection} />
      </div>

      <p className="rounded-xl bg-slate-800/60 px-4 py-3 text-base font-medium text-white">{summary}</p>

      <div className="grid gap-3 md:grid-cols-3">
        {schedule.blocks.map((block, i) => (
          <BlockCard key={block.id} block={block} status={statuses[i]} minutes={minutes} isToday={isToday} />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            onLunch ? 'border-amber-300/50 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-slate-800/30 text-slate-300'
          }`}
        >
          <Coffee className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">Lunch</span>, {formatRange(LUNCH.startMin, LUNCH.endMin)}
          </span>
        </div>

        {schedule.activity && (
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              allDone ? 'border-amber-300/50 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-slate-800/30 text-slate-300'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
            <span>
              <span className="font-semibold text-white">{schedule.activity}</span>, after the 3rd class
            </span>
          </div>
        )}
      </div>

      <Link href="/student/timetable" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:text-sky-200">
        <span>Full week timetable</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
