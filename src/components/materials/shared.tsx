'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Archive,
  Download,
  Eye,
  File as FileIcon,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Presentation,
  Search,
  X,
} from 'lucide-react';
import { SEMESTERS, formatBytes, kindOf, type FileKind, type StudyMaterial } from '@/lib/materials/config';

// ---------- file type look ----------
const LOOK: Record<FileKind['group'] | 'other', { icon: React.ElementType; tile: string }> = {
  pdf: { icon: FileText, tile: 'bg-red-500/15 text-red-400' },
  slides: { icon: Presentation, tile: 'bg-accent/15 text-accent' },
  doc: { icon: FileText, tile: 'bg-sky-500/15 text-sky-400' },
  sheet: { icon: FileSpreadsheet, tile: 'bg-emerald-500/15 text-emerald-400' },
  image: { icon: ImageIcon, tile: 'bg-pink-500/15 text-pink-400' },
  archive: { icon: Archive, tile: 'bg-accent-2/20 text-accent-2' },
  text: { icon: FileText, tile: 'bg-line text-ink-soft' },
  other: { icon: FileIcon, tile: 'bg-line text-ink-soft' },
};

export function FileTile({ ext, size = 'md' }: { ext: string; size?: 'md' | 'lg' }) {
  const kind = kindOf(ext);
  const look = LOOK[kind?.group ?? 'other'];
  const Icon = look.icon;
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl';
  return (
    <span className={`flex shrink-0 flex-col items-center justify-center ${box} ${look.tile}`} aria-hidden="true">
      <Icon className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
      <span className="mt-0.5 text-[9px] font-extrabold uppercase leading-none">{ext.slice(0, 4)}</span>
    </span>
  );
}

export const fileTypeLabel = (ext: string) => kindOf(ext)?.label ?? ext.toUpperCase();

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const isNew = (iso: string) => Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000;

// ---------- dialog (uses the app's theme colours) ----------
export function Dialog({
  open,
  onClose,
  title,
  children,
  wide = false,
  locked = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  locked?: boolean; // true while saving: Escape / outside click do nothing
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !locked) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, locked]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !locked && onClose()} aria-hidden="true" />
      <div
        className={`modal-in relative flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-line bg-panel shadow-2xl sm:rounded-3xl ${
          wide ? 'sm:max-w-4xl sm:h-[88vh]' : 'sm:max-w-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 id={titleId} className="min-w-0 truncate font-display text-lg font-extrabold text-ink">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={locked}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-panel-alt hover:text-ink disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------- filters ----------
export type SortKey = 'newest' | 'oldest' | 'title' | 'popular';

export interface Filters {
  q: string;
  semester: number | 'all';
  branch: string;
  subject: string;
  type: string;
  sort: SortKey;
  status: 'all' | 'published' | 'draft';
}

export const EMPTY_FILTERS: Filters = { q: '', semester: 'all', branch: 'all', subject: 'all', type: 'all', sort: 'newest', status: 'all' };

export function filtersActive(f: Filters) {
  return Boolean(f.q.trim()) || f.semester !== 'all' || f.branch !== 'all' || f.subject !== 'all' || f.type !== 'all' || f.status !== 'all';
}

export function applyFilters(items: StudyMaterial[], f: Filters): StudyMaterial[] {
  const q = f.q.trim().toLowerCase();
  const out = items.filter((m) => {
    if (f.semester !== 'all' && m.semester !== f.semester) return false;
    if (f.branch !== 'all' && m.branch !== f.branch) return false;
    if (f.subject !== 'all' && m.subject !== f.subject) return false;
    if (f.type !== 'all' && (kindOf(m.file_ext)?.group ?? 'other') !== f.type) return false;
    if (f.status === 'published' && !m.is_published) return false;
    if (f.status === 'draft' && m.is_published) return false;
    if (q) {
      const hay = `${m.title} ${m.description ?? ''} ${m.subject} ${m.branch} ${m.file_name} ${m.uploaded_by ?? ''} semester ${m.semester}`.toLowerCase();
      return q.split(/\s+/).every((word) => hay.includes(word));
    }
    return true;
  });

  const by: Record<SortKey, (a: StudyMaterial, b: StudyMaterial) => number> = {
    newest: (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    oldest: (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
    title: (a, b) => a.title.localeCompare(b.title),
    popular: (a, b) => b.download_count - a.download_count,
  };
  return out.sort(by[f.sort]);
}

const selectCls =
  'w-full rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none';

export function FilterBar({
  items,
  filters,
  onChange,
  showStatus = false,
}: {
  items: StudyMaterial[];
  filters: Filters;
  onChange: (f: Filters) => void;
  showStatus?: boolean;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const branches = useMemo(() => Array.from(new Set(items.map((m) => m.branch))).sort(), [items]);
  const subjects = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((m) => (filters.semester === 'all' || m.semester === filters.semester) && (filters.branch === 'all' || m.branch === filters.branch))
            .map((m) => m.subject)
        )
      ).sort(),
    [items, filters.semester, filters.branch]
  );
  const semestersWithFiles = useMemo(() => new Set(items.map((m) => m.semester)), [items]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={filters.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Search by title, subject, topic or faculty"
          aria-label="Search study materials"
          className="w-full rounded-full border border-line bg-panel py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Semester chips (scroll sideways on phones) */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by semester">
        <div className="flex w-max items-center gap-2">
          {(['all', ...SEMESTERS] as const).map((s) => {
            const active = filters.semester === s;
            const has = s === 'all' || semestersWithFiles.has(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => set({ semester: s, subject: 'all' })}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-accent bg-accent-strong text-on-accent'
                    : has
                      ? 'border-line bg-panel text-ink-soft hover:border-accent'
                      : 'border-line bg-panel text-muted/60 hover:border-accent'
                }`}
              >
                {s === 'all' ? 'All semesters' : `Sem ${s}`}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-2 ${showStatus ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <select aria-label="Branch" className={selectCls} value={filters.branch} onChange={(e) => set({ branch: e.target.value, subject: 'all' })}>
          <option value="all">All branches</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select aria-label="Subject" className={selectCls} value={filters.subject} onChange={(e) => set({ subject: e.target.value })}>
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select aria-label="File type" className={selectCls} value={filters.type} onChange={(e) => set({ type: e.target.value })}>
          <option value="all">All file types</option>
          <option value="pdf">PDF</option>
          <option value="slides">Slides (PPT)</option>
          <option value="doc">Documents</option>
          <option value="sheet">Spreadsheets</option>
          <option value="image">Images</option>
          <option value="archive">ZIP</option>
          <option value="text">Text</option>
        </select>
        {showStatus && (
          <select aria-label="Status" className={selectCls} value={filters.status} onChange={(e) => set({ status: e.target.value as Filters['status'] })}>
            <option value="all">Published + drafts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        )}
        <select aria-label="Sort" className={selectCls} value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A to Z</option>
          <option value="popular">Most downloaded</option>
        </select>
      </div>
    </div>
  );
}

// ---------- preview ----------
export function PreviewDialog({
  material,
  onClose,
  load,
  onDownload,
}: {
  material: StudyMaterial | null;
  onClose: () => void;
  load: (id: string) => Promise<{ url: string; preview: 'pdf' | 'image' | null }>;
  onDownload: (m: StudyMaterial) => Promise<void>;
}) {
  const [state, setState] = useState<{ id: string; url?: string; kind?: 'pdf' | 'image' | null; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!material) return;
    let cancelled = false;
    load(material.id)
      .then((r) => !cancelled && setState({ id: material.id, url: r.url, kind: r.preview }))
      .catch((e: Error) => !cancelled && setState({ id: material.id, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [material, load]);

  const current = material && state?.id === material.id ? state : null;

  return (
    <Dialog open={Boolean(material)} onClose={onClose} title={material?.title ?? 'Preview'} wide>
      {material && (
        <>
          <div className="relative min-h-0 flex-1 bg-panel-alt">
            {!current && (
              <div className="flex h-full min-h-[40vh] items-center justify-center text-sm text-muted">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-accent" aria-hidden="true" />
                Opening file
              </div>
            )}
            {current?.error && <p className="p-8 text-center text-sm text-red-400">{current.error}</p>}
            {current?.url && current.kind === 'pdf' && (
              <iframe title={material.title} src={current.url} className="h-full min-h-[60vh] w-full border-0 bg-white" />
            )}
            {current?.url && current.kind === 'image' && (
              <div className="flex h-full min-h-[40vh] items-center justify-center overflow-auto p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current.url} alt={material.title} className="max-h-full max-w-full rounded-xl object-contain" />
              </div>
            )}
            {current?.url && !current.kind && (
              <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-3 p-8 text-center">
                <FileTile ext={material.file_ext} size="lg" />
                <p className="text-sm font-semibold text-ink">Preview is not available for {fileTypeLabel(material.file_ext)} files.</p>
                <p className="text-sm text-muted">Download it to open it on your device.</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
            <p className="min-w-0 truncate text-xs text-muted">
              {material.file_name} · {formatBytes(material.file_size)}
            </p>
            <div className="flex items-center gap-2">
              {current?.url && current.kind === 'pdf' && (
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-accent"
                >
                  Open in new tab
                </a>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await onDownload(material);
                  } finally {
                    setBusy(false);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent-strong px-5 py-2 text-sm font-bold text-on-accent hover:opacity-90 disabled:opacity-60"
              >
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                Download
              </button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}

// ---------- card ----------
export function MaterialCard({
  m,
  onPreview,
  onDownload,
  downloading,
  extra,
  compact = false,
}: {
  m: StudyMaterial;
  onPreview: (m: StudyMaterial) => void;
  onDownload: (m: StudyMaterial) => void;
  downloading?: boolean;
  extra?: React.ReactNode;
  compact?: boolean;
}) {
  const previewable = Boolean(kindOf(m.file_ext)?.previewable);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-panel p-4 shadow-[var(--card-shadow)] transition-colors hover:border-accent">
      <div className="flex items-start gap-3">
        <FileTile ext={m.file_ext} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink">{m.title}</h3>
          <p className="mt-0.5 truncate text-xs text-muted">{m.subject}</p>
        </div>
        {isNew(m.created_at) && m.is_published && (
          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-accent">New</span>
        )}
        {!m.is_published && (
          <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-muted">Draft</span>
        )}
      </div>

      {!compact && m.description && <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{m.description}</p>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">Sem {m.semester}</span>
        <span className="rounded-full bg-panel-alt px-2.5 py-0.5 text-xs font-semibold text-ink-soft">{m.branch}</span>
        <span className="rounded-full bg-panel-alt px-2.5 py-0.5 text-xs font-semibold text-muted">
          {fileTypeLabel(m.file_ext)} · {formatBytes(m.file_size)}
        </span>
      </div>

      <p className="mt-3 text-xs text-muted">
        {formatDate(m.created_at)}
        {m.uploaded_by ? ` · ${m.uploaded_by}` : ''}
        {m.download_count > 0 ? ` · ${m.download_count} download${m.download_count === 1 ? '' : 's'}` : ''}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {previewable && (
          <button
            type="button"
            onClick={() => onPreview(m)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview
          </button>
        )}
        <button
          type="button"
          onClick={() => onDownload(m)}
          disabled={downloading}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent-strong px-4 py-2 text-sm font-bold text-on-accent hover:opacity-90 disabled:opacity-60 sm:flex-initial"
        >
          {downloading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
          Download
        </button>
        {extra}
      </div>
    </article>
  );
}

export function Notice({ tone = 'info', title, children }: { tone?: 'info' | 'error'; title: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === 'error' ? 'border-red-500/30 bg-red-500/10' : 'border-line bg-panel'}`}>
      <p className="font-bold text-ink">{title}</p>
      {children && <div className="mt-1.5 text-sm text-ink-soft">{children}</div>}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl border border-line bg-panel" />
      ))}
    </div>
  );
}
