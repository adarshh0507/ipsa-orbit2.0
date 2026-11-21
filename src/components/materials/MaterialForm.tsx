'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, LoaderCircle, UploadCloud } from 'lucide-react';
import {
  ACCEPT_ATTR,
  BRANCHES,
  MAX_FILE_BYTES,
  SEMESTERS,
  SUGGESTED_SUBJECTS,
  formatBytes,
  validateFileMeta,
  type StudyMaterial,
} from '@/lib/materials/config';
import { createMaterial, updateMaterial, type MaterialFields } from '@/lib/materials/client';
import { Dialog, FileTile } from '@/components/materials/shared';

const input =
  'w-full rounded-xl border border-line bg-panel-alt px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none';
const label = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-soft';

export function MaterialFormDialog({
  open,
  editing,
  knownSubjects,
  defaults,
  onClose,
  onSaved,
}: {
  open: boolean;
  editing: StudyMaterial | null; // null = new upload
  knownSubjects: string[];
  defaults: { semester: number; branch: string };
  onClose: () => void;
  onSaved: (m: StudyMaterial, mode: 'created' | 'updated') => void;
}) {
  // The parent mounts this with a new `key` each time it opens, so the fields always start fresh.
  const [fields, setFields] = useState<MaterialFields>(() => ({
    title: editing?.title ?? '',
    description: editing?.description ?? '',
    subject: editing?.subject ?? '',
    semester: editing?.semester ?? defaults.semester,
    branch: editing?.branch ?? defaults.branch,
    is_published: editing?.is_published ?? true,
    uploaded_by: editing?.uploaded_by ?? '',
  }));
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const subjects = useMemo(() => Array.from(new Set([...SUGGESTED_SUBJECTS, ...knownSubjects])).sort(), [knownSubjects]);
  const set = (patch: Partial<MaterialFields>) => setFields((f) => ({ ...f, ...patch }));

  const pick = (f: File | null) => {
    if (!f) return;
    const check = validateFileMeta(f.name, f.size);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError(null);
    setFile(f);
    // Handy default: use the file name as the title when the title is still empty
    if (!fields.title.trim()) set({ title: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!editing && !file) {
      setError('Please choose a file to upload.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = editing ? await updateMaterial(editing.id, fields, file) : await createMaterial(fields, file as File);
      onSaved(saved, editing ? 'updated' : 'created');
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const shownName = file?.name ?? editing?.file_name;
  const shownSize = file ? file.size : editing?.file_size;
  const shownExt = (file?.name ?? editing?.file_name ?? '').split('.').pop() ?? '';

  return (
    <Dialog open={open} onClose={onClose} title={editing ? 'Edit study material' : 'Upload study material'} locked={saving}>
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="space-y-4 overflow-y-auto px-5 py-4">
          {/* File */}
          <div>
            <span className={label}>{editing ? 'File (leave as it is, or replace)' : 'File'}</span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                pick(e.dataTransfer.files?.[0] ?? null);
              }}
              className={`flex items-center gap-3 rounded-2xl border border-dashed p-3 transition-colors ${
                drag ? 'border-accent bg-accent/10' : 'border-line bg-panel-alt'
              }`}
            >
              {shownName ? (
                <FileTile ext={shownExt} />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent" aria-hidden="true">
                  <UploadCloud className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{shownName || 'Drop a file here or choose one'}</p>
                <p className="text-xs text-muted">
                  {shownName && shownSize ? `${formatBytes(shownSize)}${file && editing ? ' · will replace the current file' : ''}` : `PDF, PPT, DOC, Excel, CSV, TXT, ZIP or image · up to ${formatBytes(MAX_FILE_BYTES)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent"
              >
                {shownName ? 'Change' : 'Choose'}
              </button>
              <input ref={inputRef} type="file" accept={ACCEPT_ATTR} className="hidden" onChange={(e) => { pick(e.target.files?.[0] ?? null); e.target.value = ''; }} aria-label="Choose a file" />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="mf-title">Title</label>
            <input id="mf-title" className={input} value={fields.title} maxLength={200} required onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Unit 2 - Matrices and Determinants" />
          </div>

          <div>
            <label className={label} htmlFor="mf-desc">Description <span className="font-medium normal-case text-muted">(optional)</span></label>
            <textarea id="mf-desc" className={`${input} min-h-20 resize-y`} value={fields.description} maxLength={2000} onChange={(e) => set({ description: e.target.value })} placeholder="What is in this file?" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="mf-sem">Semester</label>
              <select id="mf-sem" className={input} value={fields.semester} onChange={(e) => set({ semester: Number(e.target.value) })}>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="mf-branch">Branch</label>
              <select id="mf-branch" className={input} value={fields.branch} onChange={(e) => set({ branch: e.target.value })}>
                {Array.from(new Set<string>([...BRANCHES, fields.branch])).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="mf-subject">Subject</label>
              <input id="mf-subject" list="mf-subjects" className={input} value={fields.subject} maxLength={120} required onChange={(e) => set({ subject: e.target.value })} placeholder="Choose or type a subject" />
              <datalist id="mf-subjects">
                {subjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={label} htmlFor="mf-by">Uploaded by <span className="font-medium normal-case text-muted">(optional)</span></label>
              <input id="mf-by" className={input} value={fields.uploaded_by} maxLength={80} onChange={(e) => set({ uploaded_by: e.target.value })} placeholder="Faculty name" />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-panel-alt p-3">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--accent-strong)]" checked={fields.is_published} onChange={(e) => set({ is_published: e.target.checked })} />
            <span>
              <span className="block text-sm font-bold text-ink">Published</span>
              <span className="block text-xs text-muted">Students can see and download it. Untick to keep it as a draft only you can see.</span>
            </span>
          </label>

          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-soft hover:border-accent disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-accent-strong px-6 py-2 text-sm font-bold text-on-accent hover:opacity-90 disabled:opacity-60">
            {saving && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? (file ? 'Uploading' : 'Saving') : editing ? 'Save changes' : 'Upload'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
