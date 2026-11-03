'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Atom,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Code,
  Coffee,
  DraftingCompass,
  MapPin,
  Pi,
  Share2,
  Sparkles,
  Sun,
  User,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { scheduleToText, whatsappShareUrl } from '@/lib/share';
import { TICK_MS, useClockTick } from '@/lib/useClock';
import {
  DAY_NAMES,
  LUNCH,
  formatMinutes,
  formatRange,
  getDaySchedule,
  type ClassBlock,
  type DayName,
} from '@/lib/classSchedule';

const SUBJECT_ICON: Record<string, LucideIcon> = {
  'LA': Pi,
  'O & MP': Atom,
  'EG': DraftingCompass,
  'BCE': Building2,
  'B Elect.': Zap,
  'PPS': Code,
  'ECW': Wrench,
};

const WEEK: DayName[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

type BlockStatus = 'done' | 'live' | 'next' | 'upcoming';

function StatusPill({ status, block, minutes }: { status: BlockStatus; block: ClassBlock; minutes: number }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Going on now
      </span>
    );
  }
  if (status === 'next') {
    return (
      <span className="inline-flex rounded-full bg-accent-2/20 px-2.5 py-1 text-xs font-bold text-accent-2">
        Next, in {formatDuration(block.startMin - minutes)}
      </span>
    );
  }
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Finished
      </span>
    );
  }
  return null;
}

function LectureCard({ block, status, minutes }: { block: ClassBlock; status: BlockStatus; minutes: number }) {
  const first = block.periods[0];
  const Icon = (first?.code && SUBJECT_ICON[first.code]) || BookOpen;
  const progress =
    status === 'live'
      ? Math.min(100, Math.max(0, ((minutes - block.startMin) / (block.endMin - block.startMin)) * 100))
      : 0;

  const frame =
    status === 'live'
      ? 'border-emerald-400/60 bg-emerald-400/10'
      : status === 'next'
        ? 'border-accent-2/50 bg-panel-alt'
        : status === 'done'
          ? 'border-line bg-panel-alt opacity-70'
          : 'border-line bg-panel-alt';

  return (
    <div className={`flex min-h-[190px] flex-col rounded-2xl border p-5 ${frame}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-ink">{block.label}</p>
          <p className="mt-1 text-lg font-bold text-ink">{formatRange(block.startMin, block.endMin)}</p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-3">
        {block.periods.map((period, i) => (
          <div key={`${period.title}-${i}`}>
            <p className={`font-bold leading-snug text-ink ${i === 0 ? 'text-xl' : 'text-base'}`}>{period.title}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              {period.faculty && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  {period.faculty}
                </span>
              )}
              {period.room && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {period.room}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 min-h-6">
        <StatusPill status={status} block={block} minutes={minutes} />
        {status === 'live' && (
          <div className="mt-2.5">
            <div
              className="h-2 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Class progress"
            >
              <div className="h-full rounded-full bg-emerald-400 transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-muted">Ends in {formatDuration(block.endMin - minutes)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TodaySchedule() {
  const { section } = useAuth();
  const tick = useClockTick();
  const [picked, setPicked] = useState<DayName | null>(null);

  // Before the browser clock is available (server render), show a quiet placeholder.
  if (tick === 0) {
    return <div className="h-96 animate-pulse rounded-3xl border border-line bg-panel/60" />;
  }

  const now = new Date(tick * TICK_MS);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const todayName = DAY_NAMES[now.getDay()];
  const isSunday = todayName === 'Sunday';

  // Next calendar date (today or later) that falls on a given weekday
  const dateOf = (day: DayName): Date => {
    const target = DAY_NAMES.indexOf(day);
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setDate(d.getDate() + ((target - now.getDay() + 7) % 7));
    return d;
  };
  const dayLabel = (day: DayName) =>
    dateOf(day).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  const autoDay: DayName = isSunday ? 'Monday' : (todayName as DayName);
  const viewDay: DayName = picked ?? autoDay;
  const viewDate = dateOf(viewDay);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayDiff = Math.round((viewDate.getTime() - startOfToday) / 86_400_000);
  const isToday = dayDiff === 0;

  const heading = isToday ? "Today's Classes" : dayDiff === 1 ? "Tomorrow's Classes" : `${viewDay}'s Classes`;
  const schedule = getDaySchedule(section, viewDay);

  const statusOf = (block: ClassBlock): BlockStatus => {
    if (!isToday) return 'upcoming';
    if (minutes >= block.endMin) return 'done';
    if (minutes >= block.startMin) return 'live';
    return 'upcoming';
  };
  const statuses = schedule.blocks.map(statusOf);
  const firstUpcoming = statuses.indexOf('upcoming');
  if (isToday && firstUpcoming !== -1 && !statuses.includes('live')) statuses[firstUpcoming] = 'next';

  const lastBlock = schedule.blocks[schedule.blocks.length - 1];
  const allDone = isToday && minutes >= lastBlock.endMin;
  const onLunch = isToday && minutes >= LUNCH.startMin && minutes < LUNCH.endMin;
  const liveIndex = statuses.indexOf('live');

  let banner = '';
  if (isSunday && !picked) {
    banner = 'No Classes Today – Sunday Holiday';
  } else if (!isToday) {
    banner = `Plan for ${viewDay}, ${viewDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
  } else if (liveIndex !== -1) {
    const b = schedule.blocks[liveIndex];
    banner = `${b.label} is going on now. It ends at ${formatMinutes(b.endMin)}.`;
  } else if (onLunch) {
    banner = `Lunch break now. Lecture 3 starts at ${formatMinutes(schedule.blocks[2].startMin)}.`;
  } else if (allDone) {
    banner = 'All lectures are over for today.';
  } else if (firstUpcoming !== -1) {
    const b = schedule.blocks[firstUpcoming];
    banner = `${b.label} starts at ${formatMinutes(b.startMin)}, in ${formatDuration(b.startMin - minutes)}.`;
  }

  return (
    <section className="rounded-3xl border border-line bg-panel/80 p-5 shadow-[var(--card-shadow)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">{heading}</h2>
        </div>

        <label className="relative">
          <span className="sr-only">Choose a day</span>
          <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <select
            value={viewDay}
            onChange={(e) => setPicked(e.target.value as DayName)}
            className="cursor-pointer appearance-none rounded-full border border-line bg-panel py-2.5 pl-10 pr-10 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {WEEK.map((d) => (
              <option key={d} value={d}>
                {dayLabel(d)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p
        className={`mt-4 flex items-center gap-3 rounded-full px-5 py-2.5 text-base font-medium ${
          isSunday && !picked ? 'bg-accent-2/15 text-accent-2' : 'bg-panel-alt text-ink'
        }`}
      >
        {isSunday && !picked && <Sun className="h-5 w-5 shrink-0" aria-hidden="true" />}
        <span>{banner}</span>
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {schedule.blocks.map((block, i) => (
          <LectureCard key={block.id} block={block} status={statuses[i]} minutes={minutes} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        <span className={`inline-flex items-center gap-2 ${onLunch ? 'font-semibold text-accent-2' : ''}`}>
          <Coffee className="h-4 w-4" aria-hidden="true" />
          Lunch, {formatRange(LUNCH.startMin, LUNCH.endMin)}
        </span>
        {schedule.activity && (
          <span className={`inline-flex items-center gap-2 ${allDone ? 'font-semibold text-accent-2' : ''}`}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {schedule.activity}, after Lecture 3
          </span>
        )}
        <a
          href={whatsappShareUrl(
            scheduleToText(
              section,
              viewDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
              schedule
            )
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-semibold text-ink hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span>Share on WhatsApp</span>
        </a>
        <Link href="/student/timetable" className="inline-flex items-center gap-1 font-semibold text-accent hover:underline">
          <span>Full week timetable</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
