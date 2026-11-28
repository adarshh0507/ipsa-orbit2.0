import type { ExamType, Resource, ResourceCategory } from '@/types';

// The library is organised as: Subject > Category > (Previous Year Questions only) Exam.
// The student Notes page and the admin upload form both read from this one file.

export const CATEGORIES: { id: ResourceCategory; label: string; short: string; blurb: string }[] = [
  { id: 'notes', label: 'Notes', short: 'notes', blurb: 'Lecture notes, slides and practical files' },
  { id: 'assignment', label: 'Assignments', short: 'assignments', blurb: 'Tasks from your faculty and solved sheets' },
  { id: 'pyq', label: 'Previous Year Questions', short: 'papers', blurb: 'Old question papers, sorted by exam' },
];

export const EXAMS: { id: ExamType; label: string }[] = [
  { id: 'mst1', label: 'MST 1' },
  { id: 'mst2', label: 'MST 2' },
  { id: 'final', label: 'Final Sem Exam' },
];

export const categoryLabel = (id: ResourceCategory) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const examLabel = (id: ExamType) => EXAMS.find((e) => e.id === id)?.label ?? id;

// Old uploads have no category. A PYQ file is a paper; everything else counts as notes.
export function categoryOf(r: Resource): ResourceCategory {
  return r.category ?? (r.resource_type === 'pyq' ? 'pyq' : 'notes');
}

// Subject colours, written out in full so Tailwind keeps the classes. They follow the light and dark theme.
export const SUBJECT_TINTS = [
  { soft: 'bg-orange-400/15', text: 'text-orange-300', ring: 'border-orange-400/40', bar: 'bg-orange-400' },
  { soft: 'bg-sky-400/15', text: 'text-sky-300', ring: 'border-sky-400/40', bar: 'bg-sky-400' },
  { soft: 'bg-emerald-400/15', text: 'text-emerald-300', ring: 'border-emerald-400/40', bar: 'bg-emerald-400' },
  { soft: 'bg-rose-400/15', text: 'text-rose-300', ring: 'border-rose-400/40', bar: 'bg-rose-400' },
  { soft: 'bg-amber-400/15', text: 'text-amber-300', ring: 'border-amber-400/40', bar: 'bg-amber-400' },
  { soft: 'bg-violet-400/15', text: 'text-violet-300', ring: 'border-violet-400/40', bar: 'bg-violet-400' },
  { soft: 'bg-teal-400/15', text: 'text-teal-300', ring: 'border-teal-400/40', bar: 'bg-teal-400' },
] as const;
