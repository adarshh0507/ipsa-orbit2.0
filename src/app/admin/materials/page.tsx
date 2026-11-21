'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Dialog,
  EMPTY_FILTERS,
  FilterBar,
  MaterialCard,
  Notice,
  PreviewDialog,
  SkeletonGrid,
  applyFilters,
  filtersActive,
  type Filters,
} from '@/components/materials/shared';
import { MaterialFormDialog } from '@/components/materials/MaterialForm';
import { ApiError, deleteMaterial, downloadMaterial, fetchFileLink, fetchMaterials, setPublished } from '@/lib/materials/client';
import { formatBytes, type StudyMaterial } from '@/lib/materials/config';
import { Eye, EyeOff, FilePlus, Library, LoaderCircle, Pencil, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

type Load = { state: 'loading' } | { state: 'ready' } | { state: 'login' } | { state: 'setup' } | { state: 'error'; message: string };

export default function AdminMaterialsPage() {
  const [items, setItems] = useState<StudyMaterial[]>([]);
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [form, setForm] = useState<{ key: number; editing: StudyMaterial | null } | null>(null);
  const [preview, setPreview] = useState<StudyMaterial | null>(null);
  const [toDelete, setToDelete] = useState<StudyMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoad({ state: 'loading' });
    try {
      setItems(await fetchMaterials('all'));
      setLoad({ state: 'ready' });
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401 || err.status === 403) setLoad({ state: 'login' });
      else if (err.status === 503) setLoad({ state: 'setup' });
      else setLoad({ state: 'error', message: err.message });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);
  const knownSubjects = useMemo(() => Array.from(new Set(items.map((m) => m.subject))), [items]);
  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((m) => m.is_published).length,
      drafts: items.filter((m) => !m.is_published).length,
      size: items.reduce((n, m) => n + m.file_size, 0),
    }),
    [items]
  );

  const openForm = (editing: StudyMaterial | null) => setForm({ key: Date.now(), editing });

  const onSaved = (m: StudyMaterial, mode: 'created' | 'updated') => {
    setItems((all) => (mode === 'created' ? [m, ...all] : all.map((x) => (x.id === m.id ? m : x))));
    setForm(null);
    setToast(mode === 'created' ? 'Uploaded successfully.' : 'Changes saved.');
  };

  const togglePublish = async (m: StudyMaterial) => {
    setBusyId(m.id);
    try {
      const saved = await setPublished(m.id, !m.is_published);
      setItems((all) => all.map((x) => (x.id === m.id ? saved : x)));
      setToast(saved.is_published ? 'Published. Students can see it now.' : 'Moved to drafts.');
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMaterial(toDelete.id);
      setItems((all) => all.filter((x) => x.id !== toDelete.id));
      setToast('Deleted.');
      setToDelete(null);
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const download = useCallback(async (m: StudyMaterial) => {
    setBusyId(m.id);
    try {
      await downloadMaterial(m.id);
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }, []);
  const loadPreview = useCallback((id: string) => fetchFileLink(id, 'view'), []);

  const actionBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-ink disabled:opacity-50';

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Admin / Faculty
            </div>
            <div className="mt-1 flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Library className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Study Materials</h1>
            </div>
            <p className="mt-2 text-sm text-ink-soft">Upload, edit, replace and delete the files students see.</p>
          </div>
          {load.state === 'ready' && (
            <button
              type="button"
              onClick={() => openForm(null)}
              className="inline-flex items-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 text-sm font-bold text-on-accent shadow-[var(--card-shadow)] hover:opacity-90"
            >
              <FilePlus className="h-4 w-4" aria-hidden="true" />
              Upload material
            </button>
          )}
        </header>

        {load.state === 'loading' && <SkeletonGrid />}

        {load.state === 'login' && (
          <Notice title="Your admin session has ended">
            <p>Please sign in again to manage study materials.</p>
            <Link href="/admin-login?next=/admin/materials" className="mt-3 inline-block rounded-full bg-accent-strong px-5 py-2 text-sm font-bold text-on-accent">
              Admin sign in
            </Link>
          </Notice>
        )}

        {load.state === 'setup' && (
          <Notice title="Connect Supabase to start uploading">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Supabase dashboard → SQL Editor → run <code className="rounded bg-panel-alt px-1.5 py-0.5">supabase/study_materials.sql</code> from the project.</li>
              <li>In Vercel → Settings → Environment Variables add <code className="rounded bg-panel-alt px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> (Supabase → Project Settings → API → service_role). Keep it secret.</li>
              <li>Make sure <code className="rounded bg-panel-alt px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="rounded bg-panel-alt px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set, then redeploy.</li>
            </ol>
          </Notice>
        )}

        {load.state === 'error' && (
          <Notice tone="error" title="Could not load study materials">
            <p>{load.message}</p>
            <button type="button" onClick={() => void refresh()} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-ink hover:border-accent">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </Notice>
        )}

        {load.state === 'ready' && (
          <>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Total files', String(stats.total)],
                ['Published', String(stats.published)],
                ['Drafts', String(stats.drafts)],
                ['Storage used', formatBytes(stats.size)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line bg-panel px-4 py-3">
                  <dt className="text-xs font-semibold text-muted">{k}</dt>
                  <dd className="mt-0.5 font-display text-2xl font-extrabold text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line bg-panel px-6 py-14 text-center">
                <FilePlus className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-extrabold text-ink">Upload your first study material</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">PDF, PPT, DOC, Excel, ZIP and images are supported.</p>
                <button type="button" onClick={() => openForm(null)} className="mt-5 rounded-full bg-accent-strong px-6 py-2.5 text-sm font-bold text-on-accent hover:opacity-90">
                  Upload material
                </button>
              </div>
            ) : (
              <section className="space-y-4" aria-label="All study materials">
                <FilterBar items={items} filters={filters} onChange={setFilters} showStatus />
                <p className="text-sm text-muted" aria-live="polite">
                  {filtered.length} of {items.length} file{items.length === 1 ? '' : 's'}
                  {filtersActive(filters) && (
                    <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS, sort: filters.sort })} className="ml-3 font-semibold text-accent hover:underline">
                      Clear filters
                    </button>
                  )}
                </p>

                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-line bg-panel px-5 py-10 text-center text-sm text-ink-soft">No materials match.</div>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((m) => (
                      <li key={m.id}>
                        <MaterialCard
                          m={m}
                          onPreview={setPreview}
                          onDownload={download}
                          downloading={busyId === m.id}
                          extra={
                            <span className="ml-auto flex items-center gap-1.5">
                              <button type="button" className={actionBtn} aria-label={m.is_published ? 'Unpublish (make draft)' : 'Publish'} title={m.is_published ? 'Unpublish' : 'Publish'} disabled={busyId === m.id} onClick={() => void togglePublish(m)}>
                                {busyId === m.id ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : m.is_published ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                              </button>
                              <button type="button" className={actionBtn} aria-label={`Edit ${m.title}`} title="Edit or replace file" onClick={() => openForm(m)}>
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <button type="button" className={`${actionBtn} hover:!border-red-400 hover:!text-red-400`} aria-label={`Delete ${m.title}`} title="Delete" onClick={() => setToDelete(m)}>
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </span>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {form && (
        <MaterialFormDialog
          key={form.key}
          open
          editing={form.editing}
          knownSubjects={knownSubjects}
          defaults={{ semester: filters.semester === 'all' ? 1 : filters.semester, branch: filters.branch === 'all' ? 'Data Science' : filters.branch }}
          onClose={() => setForm(null)}
          onSaved={onSaved}
        />
      )}

      <PreviewDialog material={preview} onClose={() => setPreview(null)} load={loadPreview} onDownload={download} />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Delete this material?" locked={deleting}>
        <div className="space-y-4 px-5 py-4">
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">{toDelete?.title}</strong> and its file will be removed for good. Students will no longer be able to open it.
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setToDelete(null)} disabled={deleting} className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-soft hover:border-accent">
              Cancel
            </button>
            <button type="button" onClick={() => void confirmDelete()} disabled={deleting} className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60">
              {deleting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Delete
            </button>
          </div>
        </div>
      </Dialog>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-semibold text-ink shadow-[var(--card-shadow)]">
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
