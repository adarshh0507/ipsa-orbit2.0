'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Popup } from '@/components/student/Popup';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import {
  CATEGORIES,
  EXAMS,
  SUBJECT_TINTS,
  categoryLabel,
  categoryOf,
  examLabel,
} from '@/lib/libraryStructure';
import type { ExamType, Resource, ResourceCategory, Subject } from '@/types';
import {
  Atom,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Download,
  Eye,
  FolderOpen,
  GraduationCap,
  History,
  Lightbulb,
  PencilRuler,
  Search,
  Sigma,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  LA: Sigma,
  OMP: Atom,
  EG: PencilRuler,
  BCE: Building2,
  'Basic Electronics': Zap,
  PPS: Code2,
  'Design Thinking': Lightbulb,
};

const CATEGORY_ICONS: Record<ResourceCategory, LucideIcon> = {
  notes: BookOpen,
  assignment: ClipboardCheck,
  pyq: History,
};

const EXAM_ICONS: Record<ExamType, LucideIcon> = {
  mst1: ClipboardList,
  mst2: ClipboardCheck,
  final: GraduationCap,
};

// "other" holds old papers that were uploaded before the MST 1 / MST 2 / Final choice existed.
type ExamChoice = ExamType | 'other';

type Tint = (typeof SUBJECT_TINTS)[number];

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-panel/50 px-6 py-14 text-center">
      <FolderOpen className="h-10 w-10 text-accent" aria-hidden="true" />
      <p className="mt-3 text-base font-semibold text-ink">{text}</p>
      <p className="mt-1 text-sm text-ink-soft">New material shows up here as soon as your faculty uploads it.</p>
    </div>
  );
}

function FileRow({
  r,
  tint,
  where,
  onPreview,
  onDownload,
}: {
  r: Resource;
  tint: Tint;
  where?: string;
  onPreview: (r: Resource) => void;
  onDownload: (r: Resource) => void;
}) {
  return (
    <li className="flex flex-col gap-4 rounded-3xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:p-5">
      <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-xs font-black uppercase ${tint.soft} ${tint.text}`}>
        {(r.file_ext || 'pdf').slice(0, 4)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold leading-snug text-ink">{r.title}</p>
        {r.description && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{r.description}</p>}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          {r.unit_or_module && <span className={`rounded-full px-2.5 py-0.5 font-semibold ${tint.soft} ${tint.text}`}>{r.unit_or_module}</span>}
          {r.file_size && <span>{r.file_size}</span>}
          <span>{r.download_count} downloads</span>
          {where && <span className="font-semibold">{where}</span>}
        </p>
      </div>
      <div className="flex gap-2 sm:flex-col">
        <button
          type="button"
          onClick={() => onPreview(r)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Eye className="h-4 w-4" aria-hidden="true" /> Preview
        </button>
        <button
          type="button"
          onClick={() => onDownload(r)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent-strong px-4 py-2 text-sm font-bold text-on-accent hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Download
        </button>
      </div>
    </li>
  );
}

export default function NotesPage() {
  const { section } = useAuth();
  const [, setTick] = useState(0);
  const [query, setQuery] = useState('');
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [category, setCategory] = useState<ResourceCategory | null>(null);
  const [exam, setExam] = useState<ExamChoice | null>(null);
  const [preview, setPreview] = useState<Resource | null>(null);

  useEffect(() => orbitStore.subscribe(() => setTick((t) => t + 1)), []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const visible = orbitStore
    .getResources()
    .filter((r) => r.is_published && (r.section === 'Both' || r.section === section));
  const tasks = orbitStore
    .getAssignments()
    .filter((a) => a.is_published && (a.section === 'Both' || a.section === section));

  const subject = subjects.find((s) => s.id === subjectId) ?? null;
  const tintOf = (s: Subject) => SUBJECT_TINTS[Math.max(0, subjects.indexOf(s)) % SUBJECT_TINTS.length];
  const facultyName = (id: string) => faculty.find((f) => f.id === id)?.name;

  const inSubject = (s: Subject) => visible.filter((r) => r.subject_id === s.id);
  const countIn = (s: Subject, c: ResourceCategory) =>
    inSubject(s).filter((r) => categoryOf(r) === c).length +
    (c === 'assignment' ? tasks.filter((a) => a.subject_id === s.id).length : 0);

  const goHome = () => {
    setSubjectId(null);
    setCategory(null);
    setExam(null);
  };
  const goSubject = () => {
    setCategory(null);
    setExam(null);
  };

  const download = (r: Resource) => {
    orbitStore.incrementDownload(r.id);
    if (r.file_url && r.file_url !== '#') window.open(r.file_url, '_blank', 'noopener,noreferrer');
    else alert(`Download started: ${r.file_name}`);
  };

  const searching = query.trim().length > 0;
  const results = searching
    ? visible.filter((r) => {
        const q = query.toLowerCase();
        const sub = subjects.find((s) => s.id === r.subject_id);
        return (
          r.title.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (sub?.name || '').toLowerCase().includes(q) ||
          (sub?.short_name || '').toLowerCase().includes(q)
        );
      })
    : [];

  // --- the files shown at the last step ---
  let files: Resource[] = [];
  if (subject && category) {
    files = inSubject(subject).filter((r) => categoryOf(r) === category);
    if (category === 'pyq' && exam) {
      files = files.filter((r) => (exam === 'other' ? !r.exam_type : r.exam_type === exam));
    }
  }
  const showFiles = !!subject && !!category && (category !== 'pyq' || exam !== null);

  const crumbs: { label: string; onClick?: () => void }[] = [{ label: 'All subjects', onClick: subject ? goHome : undefined }];
  if (subject) crumbs.push({ label: subject.short_name, onClick: category ? goSubject : undefined });
  if (subject && category) crumbs.push({ label: categoryLabel(category), onClick: exam ? () => setExam(null) : undefined });
  if (subject && category === 'pyq' && exam) crumbs.push({ label: exam === 'other' ? 'Other papers' : examLabel(exam) });

  const back = () => {
    if (exam) setExam(null);
    else if (category) setCategory(null);
    else goHome();
  };

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Notes & Resources</h1>
          <p className="mt-1 text-sm text-ink-soft">Pick a subject, then find its notes, assignments and previous year papers. Showing {section}.</p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Looking for something? Search by topic or subject"
            aria-label="Search notes and resources"
            className="w-full rounded-full border border-line bg-panel py-3 pl-12 pr-4 text-base text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none"
          />
        </div>

        {searching ? (
          <section className="space-y-3">
            <p className="text-sm font-semibold text-ink-soft">{results.length} result{results.length === 1 ? '' : 's'}</p>
            {results.length === 0 ? <Empty text="Nothing matches your search." /> : <ul className="space-y-3">{results.map((r) => {
                  const sub = subjects.find((x) => x.id === r.subject_id);
                  return (
                    <FileRow
                      key={r.id}
                      r={r}
                      tint={sub ? tintOf(sub) : SUBJECT_TINTS[0]}
                      where={sub ? `${sub.short_name} · ${categoryLabel(categoryOf(r))}` : undefined}
                      onPreview={setPreview}
                      onDownload={download}
                    />
                  );
                })}</ul>}
          </section>
        ) : (
          <>
            {subject && (
              <nav aria-label="You are here" className="flex flex-wrap items-center gap-1 text-sm">
                <button type="button" onClick={back} className="mr-2 inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:border-accent hover:text-accent">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
                </button>
                {crumbs.map((c, i) => (
                  <React.Fragment key={c.label}>
                    {i > 0 && <ChevronRight className="h-4 w-4 text-ink-soft" aria-hidden="true" />}
                    {c.onClick ? (
                      <button type="button" onClick={c.onClick} className="font-semibold text-accent hover:underline">{c.label}</button>
                    ) : (
                      <span className="font-bold text-ink">{c.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* Step 1: subjects */}
            {!subject && (
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((s) => {
                  const tint = tintOf(s);
                  const Icon = SUBJECT_ICONS[s.short_name] || BookOpen;
                  const fac = visible.find((r) => r.subject_id === s.id)?.faculty_id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSubjectId(s.id)}
                      className="group relative overflow-hidden rounded-3xl border border-line bg-panel p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--card-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span aria-hidden="true" className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${tint.soft}`} />
                      <span aria-hidden="true" className={`absolute -bottom-10 -left-6 h-24 w-24 rounded-full opacity-60 ${tint.soft}`} />
                      <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${tint.soft} ${tint.text}`}>
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <h2 className="relative mt-4 text-lg font-bold leading-snug text-ink">{s.name}</h2>
                      <p className="relative mt-0.5 text-sm text-ink-soft">{fac ? facultyName(fac) : s.short_name}</p>
                      <div className="relative mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                        {CATEGORIES.map((c) => (
                          <span key={c.id} className={`rounded-full px-2.5 py-1 ${tint.soft} ${tint.text}`}>
                            {countIn(s, c.id)} {c.short}
                          </span>
                        ))}
                      </div>
                      <ChevronRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft transition group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
                    </button>
                  );
                })}
              </section>
            )}

            {/* Step 2: Notes / Assignments / Previous Year Questions */}
            {subject && !category && (
              <section className="space-y-4">
                <div className={`flex items-center gap-4 rounded-3xl border p-5 ${tintOf(subject).ring} ${tintOf(subject).soft}`}>
                  {(() => {
                    const Icon = SUBJECT_ICONS[subject.short_name] || BookOpen;
                    return <Icon className={`h-9 w-9 shrink-0 ${tintOf(subject).text}`} aria-hidden="true" />;
                  })()}
                  <div>
                    <h2 className="text-xl font-bold text-ink">{subject.name}</h2>
                    <p className="text-sm text-ink-soft">What are you looking for?</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {CATEGORIES.map((c) => {
                    const Icon = CATEGORY_ICONS[c.id];
                    const tint = tintOf(subject);
                    const n = countIn(subject, c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className="group relative overflow-hidden rounded-3xl border border-line bg-panel p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--card-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <span aria-hidden="true" className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${tint.soft}`} />
                        <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${tint.soft} ${tint.text}`}>
                          <Icon className="h-7 w-7" aria-hidden="true" />
                        </span>
                        <h3 className="relative mt-4 text-lg font-bold text-ink">{c.label}</h3>
                        <p className="relative mt-1 text-sm text-ink-soft">{c.blurb}</p>
                        <p className={`relative mt-4 text-sm font-bold ${tint.text}`}>{n} {n === 1 ? 'item' : 'items'}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Step 3 for papers: MST 1 / MST 2 / Final Sem Exam */}
            {subject && category === 'pyq' && !exam && (
              <section className="grid gap-4 sm:grid-cols-3">
                {(() => {
                  const papers = inSubject(subject).filter((r) => categoryOf(r) === 'pyq');
                  const tint = tintOf(subject);
                  const boxes: { id: ExamChoice; label: string; icon: LucideIcon; n: number }[] = EXAMS.map((e) => ({
                    id: e.id,
                    label: e.label,
                    icon: EXAM_ICONS[e.id],
                    n: papers.filter((p) => p.exam_type === e.id).length,
                  }));
                  const other = papers.filter((p) => !p.exam_type).length;
                  if (other > 0) boxes.push({ id: 'other', label: 'Other papers', icon: FolderOpen, n: other });
                  return boxes.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setExam(b.id)}
                      className="group relative overflow-hidden rounded-3xl border border-line bg-panel p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--card-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span aria-hidden="true" className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${tint.soft}`} />
                      <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${tint.soft} ${tint.text}`}>
                        <b.icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <h3 className="relative mt-4 text-xl font-bold text-ink">{b.label}</h3>
                      <p className={`relative mt-2 text-sm font-bold ${tint.text}`}>{b.n} {b.n === 1 ? 'paper' : 'papers'}</p>
                    </button>
                  ));
                })()}
              </section>
            )}

            {/* Final step: the files */}
            {showFiles && subject && (
              <section className="space-y-4">
                {category === 'assignment' && tasks.filter((a) => a.subject_id === subject.id).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-ink">Tasks from your faculty</h3>
                    <ul className="space-y-3">
                      {tasks
                        .filter((a) => a.subject_id === subject.id)
                        .map((a) => (
                          <li key={a.id}>
                            <Link href="/student/assignments" className="flex items-center justify-between gap-3 rounded-3xl border border-line bg-panel p-4 hover:border-accent sm:p-5">
                              <span>
                                <span className="block text-base font-bold text-ink">{a.title}</span>
                                <span className="mt-1 block text-sm text-ink-soft">
                                  Due {new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </span>
                              <ChevronRight className="h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                    </ul>
                    {files.length > 0 && <h3 className="pt-2 text-base font-bold text-ink">Files</h3>}
                  </div>
                )}
                {files.length === 0 ? (
                  category === 'assignment' && tasks.some((a) => a.subject_id === subject.id) ? null : (
                    <Empty text="Nothing here yet." />
                  )
                ) : (
                  <ul className="space-y-3">{files.map((r) => <FileRow key={r.id} r={r} tint={tintOf(subject)} onPreview={setPreview} onDownload={download} />)}</ul>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {preview && (
        <Popup title={preview.title} onClose={() => setPreview(null)}>
          <div className="space-y-4">
            <p className="text-sm text-ink-soft">{preview.description || 'Course material for first-year B.Tech Data Science.'}</p>
            <p className="rounded-2xl bg-panel-alt p-4 text-sm text-ink-soft">
              {preview.file_name}
              {preview.file_size ? ` · ${preview.file_size}` : ''}
            </p>
            <button
              type="button"
              onClick={() => {
                download(preview);
                setPreview(null);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-strong px-5 py-3 text-sm font-bold text-on-accent hover:opacity-90"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Download
            </button>
          </div>
        </Popup>
      )}
    </DashboardLayout>
  );
}
