import type { Section } from '@/types';

// Class timetable for B.Tech 1st year, Jul-Dec 2026-27 (W.E.F. 24/08/2026).
// The cells below are copied from the DS-1 and DS-2 Excel sheets. To change a class,
// edit the text in RAW_SCHEDULE. To change a timing, edit BLOCK_TIMES.

export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type PeriodKind = 'lecture' | 'tutorial' | 'lab' | 'remedial';
export type BlockId = 'first' | 'second' | 'third';

export interface Period {
  code?: string;
  title: string;
  kind: PeriodKind;
  faculty?: string;
  room?: string;
}

export interface ClassBlock {
  id: BlockId;
  label: string;
  startMin: number;
  endMin: number;
  periods: Period[];
}

export interface DaySchedule {
  day: DayName;
  blocks: ClassBlock[];
  activity: string | null;
}

const toMin = (h: number, m: number) => h * 60 + m;

export const BLOCK_TIMES: Record<BlockId, { label: string; startMin: number; endMin: number }> = {
  first: { label: 'Lecture 1', startMin: toMin(9, 45), endMin: toMin(11, 25) },
  second: { label: 'Lecture 2', startMin: toMin(11, 30), endMin: toMin(13, 10) },
  third: { label: 'Lecture 3', startMin: toMin(13, 40), endMin: toMin(15, 20) },
};

export const LUNCH = { startMin: toMin(13, 10), endMin: toMin(13, 40) };

export const DAY_NAMES: (DayName | 'Sunday')[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export function formatMinutes(total: number): string {
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatRange(startMin: number, endMin: number): string {
  const a = formatMinutes(startMin);
  const b = formatMinutes(endMin);
  const [aTime, aSuffix] = a.split(' ');
  const [, bSuffix] = b.split(' ');
  // "9:45 to 11:25 AM" when both are in the same half of the day
  return aSuffix === bSuffix ? `${aTime} to ${b}` : `${a} to ${b}`;
}

type RawDay = { first: string[]; second: string[]; third: string[]; activity: string | null };

const RAW_SCHEDULE: Record<Section, Record<DayName, RawDay>> = {
  "DS-1": {
    "Monday": {
      "first": [
        "LA (RU)"
      ],
      "second": [
        "O & MP (KS)",
        "O & MP Tut (KS)"
      ],
      "third": [
        "EG (AC)"
      ],
      "activity": "Training"
    },
    "Tuesday": {
      "first": [
        "B Elect. (SR)"
      ],
      "second": [
        "ECW LAB (DS)"
      ],
      "third": [
        "LA (RU)",
        "LA Tut (RU)"
      ],
      "activity": "Tutorial Class"
    },
    "Wednesday": {
      "first": [
        "EG (AC)"
      ],
      "second": [
        "BCE (DJ)"
      ],
      "third": [
        "O & MP LAB (KS)"
      ],
      "activity": "LLC"
    },
    "Thursday": {
      "first": [
        "O & MP (KS)"
      ],
      "second": [
        "EG LAB (AC)"
      ],
      "third": [
        "PPS (AS)"
      ],
      "activity": "Expert Lecture"
    },
    "Friday": {
      "first": [
        "PPS (AS)"
      ],
      "second": [
        "PPS LAB (AS)"
      ],
      "third": [
        "BCE LAB (DJ)"
      ],
      "activity": "Designing Thinking"
    },
    "Saturday": {
      "first": [
        "Remedial Classes"
      ],
      "second": [
        "Remedial Classes"
      ],
      "third": [
        "Remedial Classes"
      ],
      "activity": "Remedial Classes"
    }
  },
  "DS-2": {
    "Monday": {
      "first": [
        "BCE (DJ)"
      ],
      "second": [
        "O & MP (ST)",
        "O & MP Tut (ST)"
      ],
      "third": [
        "LA (RJ)",
        "LA Tut (RJ)"
      ],
      "activity": "Tutorial Class"
    },
    "Tuesday": {
      "first": [
        "PPS (AS)"
      ],
      "second": [
        "EG LAB (AC)"
      ],
      "third": [
        "PPS LAB (AS)"
      ],
      "activity": "Expert Lecture"
    },
    "Wednesday": {
      "first": [
        "LA (RJ)"
      ],
      "second": [
        "B Elect. (SR)"
      ],
      "third": [
        "EG (AC)"
      ],
      "activity": "LLC"
    },
    "Thursday": {
      "first": [
        "ECW LAB (DS)"
      ],
      "second": [
        "BCE LAB (DJ)"
      ],
      "third": [
        "O & MP (ST)"
      ],
      "activity": "Designing Thinking"
    },
    "Friday": {
      "first": [
        "O & MP LAB (ST)"
      ],
      "second": [
        "EG (AC)"
      ],
      "third": [
        "PPS (AS)"
      ],
      "activity": "Training"
    },
    "Saturday": {
      "first": [
        "Remedial Classes"
      ],
      "second": [
        "Remedial Classes"
      ],
      "third": [
        "Remedial Classes"
      ],
      "activity": "Remedial Classes"
    }
  }
};

const SUBJECTS: Record<string, { title: string; labTitle?: string; labRoom?: string }> = {
  'LA': { title: 'Linear Algebra' },
  'O & MP': { title: 'Optics & Modern Physics', labTitle: 'Optics & Modern Physics Lab', labRoom: 'O-406' },
  'EG': { title: 'Engineering Graphics', labTitle: 'Engineering Graphics Lab', labRoom: 'Basement Drawing Hall' },
  'BCE': { title: 'Basic Civil Engineering', labTitle: 'Basic Civil Engineering Lab', labRoom: 'NB-008' },
  'B Elect.': { title: 'Basic Electronics Engineering' },
  'PPS': { title: 'Programming for Problem Solving', labTitle: 'PPS Lab', labRoom: 'O-203' },
  'ECW': { title: 'Electronics & Computer Workshop', labTitle: 'Electronics & Computer Workshop', labRoom: 'O-315' },
};

const FACULTY: Record<Section, Record<string, string>> = {
  'DS-1': {
    'LA': 'Dr. Reena Joshi',
    'O & MP': 'Dr. Kavita Soni',
    'EG': 'Mr. Amit Chandak',
    'BCE': 'Dr. Devaanshi Jagwani',
    'B Elect.': 'Dr. Sandeep Rangi',
    'PPS': 'Mr. Amit Shrivastava',
    'ECW': 'Mr. Devendra Shinde',
  },
  'DS-2': {
    'LA': 'Dr. Reena Joshi',
    'O & MP': 'Dr. Shivendra Tiwari',
    'EG': 'Mr. Amit Chandak',
    'BCE': 'Dr. Devaanshi Jagwani',
    'B Elect.': 'Dr. Sandeep Rangi',
    'PPS': 'Mr. Amit Shrivastava',
    'ECW': 'Mr. Devendra Shinde',
  },
};

const LECTURE_HALL: Record<Section, string> = {
  'DS-1': 'Seminar Hall No.1',
  'DS-2': 'Seminar Hall No.2',
};

function parseCell(cell: string, section: Section): Period {
  if (/remedial/i.test(cell)) {
    return { title: 'Remedial Classes', kind: 'remedial' };
  }

  // "O & MP Tut (KS)" -> name "O & MP Tut", ignore the faculty initials in brackets
  const name = cell.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const isLab = /\bLAB$/i.test(name);
  const isTutorial = /\bTut$/i.test(name);
  const code = name.replace(/\s*(LAB|Tut)$/i, '').trim();
  const subject = SUBJECTS[code];

  if (!subject) {
    return { title: name, kind: 'lecture' };
  }

  if (isLab) {
    return {
      code,
      title: subject.labTitle || `${subject.title} Lab`,
      kind: 'lab',
      faculty: FACULTY[section][code],
      room: subject.labRoom,
    };
  }

  return {
    code,
    title: isTutorial ? `${subject.title} Tutorial` : subject.title,
    kind: isTutorial ? 'tutorial' : 'lecture',
    faculty: FACULTY[section][code],
    room: LECTURE_HALL[section],
  };
}

export function getDaySchedule(section: Section, day: DayName): DaySchedule {
  const raw = RAW_SCHEDULE[section][day];
  const ids: BlockId[] = ['first', 'second', 'third'];

  return {
    day,
    activity: raw.activity,
    blocks: ids.map((id) => ({
      id,
      ...BLOCK_TIMES[id],
      periods: raw[id].map((cell) => parseCell(cell, section)),
    })),
  };
}
