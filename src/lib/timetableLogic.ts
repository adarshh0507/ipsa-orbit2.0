import {
  BLOCK_TIMES,
  DAY_NAMES,
  LUNCH,
  getDaySchedule,
  type ClassBlock,
  type DayName,
  type DaySchedule,
} from './classSchedule';
import type { Holiday, Section } from '../types';

// Everything here is calculated in Indian Standard Time (UTC+05:30, no daylight saving),
// whatever time zone the student's device is set to.

const IST_OFFSET_MS = 330 * 60_000;

// After this time (6:00 PM IST) the dashboard switches from "today" to the next working day.
export const SWITCH_TO_NEXT_MIN = 18 * 60;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number) => String(n).padStart(2, '0');

export interface IstMoment {
  dateKey: string; // YYYY-MM-DD, the calendar date in IST
  dayIndex: number; // 0 = Sunday ... 6 = Saturday
  minutes: number; // minutes since IST midnight, with seconds as a fraction
}

export function toIst(ms: number): IstMoment {
  const d = new Date(ms + IST_OFFSET_MS);
  return {
    dateKey: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    dayIndex: d.getUTCDay(),
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60,
  };
}

function keyToUtc(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDaysToKey(key: string, days: number): string {
  const d = keyToUtc(key);
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const dayIndexOfKey = (key: string) => keyToUtc(key).getUTCDay();
export const dayNameOfKey = (key: string) => DAY_NAMES[dayIndexOfKey(key)];

// "Monday, 3 Nov"
export function formatDateKey(key: string): string {
  const d = keyToUtc(key);
  return `${dayNameOfKey(key)}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function formatIstClock(minutes: number): string {
  const whole = Math.floor(minutes);
  const h24 = Math.floor(whole / 60);
  const m = whole % 60;
  const s = Math.floor((minutes - whole) * 60 + 1e-6);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(m)}:${pad(s)} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

export type OffReason = { kind: 'sunday' } | { kind: 'holiday'; reason: string };

// Sunday is always a holiday. Other holidays come from the admin.
export function getOffReason(key: string, holidays: Holiday[]): OffReason | null {
  if (dayIndexOfKey(key) === 0) return { kind: 'sunday' };
  const holiday = holidays.find((h) => h.date === key);
  if (holiday) return { kind: 'holiday', reason: holiday.reason.trim() || 'Holiday' };
  return null;
}

const offLabel = (off: OffReason) => (off.kind === 'sunday' ? 'Sunday Holiday' : off.reason);

export function nextWorkingDay(fromKey: string, holidays: Holiday[]): string | null {
  for (let i = 1; i <= 21; i++) {
    const key = addDaysToKey(fromKey, i);
    if (!getOffReason(key, holidays)) return key;
  }
  return null;
}

function loadSchedule(section: Section, key: string): DaySchedule | null {
  const idx = dayIndexOfKey(key);
  if (idx === 0) return null;
  try {
    const schedule = getDaySchedule(section, DAY_NAMES[idx] as DayName);
    return schedule.blocks.some((b) => b.periods.length > 0) ? schedule : null;
  } catch {
    return null;
  }
}

export interface TimetableView {
  // true when the lectures shown belong to the current IST day, so live status applies
  isToday: boolean;
  heading: string; // "Today's Classes", "Tomorrow's Classes" or "Next Classes · Monday"
  notices: string[]; // e.g. "No Classes Today – Sunday Holiday"
  targetKey: string | null;
  targetLabel: string; // "Monday, 3 Nov"
  schedule: DaySchedule | null; // null means there is no timetable to show
  now: IstMoment;
}

export function resolveView(nowMs: number, section: Section, holidays: Holiday[]): TimetableView {
  const now = toIst(nowMs);
  const todayOff = getOffReason(now.dateKey, holidays);

  // Rule A: a working day before 6 PM shows today.
  if (!todayOff && now.minutes < SWITCH_TO_NEXT_MIN) {
    return {
      isToday: true,
      heading: "Today's Classes",
      notices: [],
      targetKey: now.dateKey,
      targetLabel: formatDateKey(now.dateKey),
      schedule: loadSchedule(section, now.dateKey),
      now,
    };
  }

  // Rules B, D and E: after 6 PM, on Sunday, or on an admin holiday, look ahead.
  const notices: string[] = [];
  if (todayOff) notices.push(`No Classes Today – ${offLabel(todayOff)}`);

  const tomorrow = addDaysToKey(now.dateKey, 1);
  const tomorrowOff = getOffReason(tomorrow, holidays);
  // On a working evening, tell the student if tomorrow is off. On a day off, tomorrow only
  // needs a notice when it is off too (for example Sunday followed by a Monday holiday).
  if (tomorrowOff) notices.push(`No Classes Tomorrow – ${offLabel(tomorrowOff)}`);

  const targetKey = tomorrowOff ? nextWorkingDay(tomorrow, holidays) : tomorrow;
  if (!targetKey) {
    return {
      isToday: false,
      heading: 'Upcoming Classes',
      notices,
      targetKey: null,
      targetLabel: '',
      schedule: null,
      now,
    };
  }

  const isTomorrow = targetKey === tomorrow;
  return {
    isToday: false,
    heading: isTomorrow ? "Tomorrow's Classes" : `Next Classes · ${dayNameOfKey(targetKey)}`,
    notices,
    targetKey,
    targetLabel: formatDateKey(targetKey),
    schedule: loadSchedule(section, targetKey),
    now,
  };
}

export type BlockStatus = 'upcoming' | 'live' | 'completed';

export function blockStatus(block: ClassBlock, minutes: number, isToday: boolean): BlockStatus {
  // Never mark a future day's lectures as live or completed.
  if (!isToday) return 'upcoming';
  if (minutes >= block.endMin) return 'completed';
  if (minutes >= block.startMin) return 'live';
  return 'upcoming';
}

export function formatCountdown(minutes: number): string {
  const total = Math.max(1, Math.ceil(minutes - 1e-9));
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export interface LiveInfo {
  statuses: BlockStatus[];
  liveIndex: number; // -1 when nothing is running
  nextIndex: number; // first upcoming lecture, -1 when none is left
  onLunch: boolean;
  onShortBreak: boolean;
  headline: string; // one line such as "Class ends in 20 min"
}

export function getLiveInfo(blocks: ClassBlock[], minutes: number, isToday: boolean): LiveInfo {
  const statuses = blocks.map((b) => blockStatus(b, minutes, isToday));
  const liveIndex = statuses.indexOf('live');
  const nextIndex = statuses.indexOf('upcoming');
  const onLunch = isToday && minutes >= LUNCH.startMin && minutes < LUNCH.endMin;
  const onShortBreak =
    isToday && minutes >= BLOCK_TIMES.first.endMin && minutes < BLOCK_TIMES.second.startMin;

  let headline = '';
  if (!isToday) {
    headline = '';
  } else if (liveIndex !== -1) {
    headline = `Class ends in ${formatCountdown(blocks[liveIndex].endMin - minutes)}`;
  } else if (nextIndex === -1) {
    headline = 'All lectures are over for today';
  } else if (onLunch) {
    headline = `Lunch break. Next class starts in ${formatCountdown(blocks[nextIndex].startMin - minutes)}`;
  } else if (nextIndex === 0) {
    headline = `Class starts in ${formatCountdown(blocks[nextIndex].startMin - minutes)}`;
  } else {
    headline = `Next class starts in ${formatCountdown(blocks[nextIndex].startMin - minutes)}`;
  }

  return { statuses, liveIndex, nextIndex, onLunch, onShortBreak, headline };
}
