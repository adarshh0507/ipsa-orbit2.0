'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import {
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
import { ApiError, downloadMaterial, fetchFileLink, fetchMaterials } from '@/lib/materials/client';
import type { StudyMaterial } from '@/lib/materials/config';
import { Clock, GraduationCap, Library, LogIn, RefreshCw } from 'lucide-react';

type Load = { state: 'loading' } | { state: 'ready' } | { state: 'signin' } | { state: 'setup' } | { state: 'error'; message: string };

export default function StudyMaterialsPage() {
  const { loginWithGoogle, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<StudyMaterial[]>([]);
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [view, setView] = useState<'browse' | 'latest'>('browse');
  const [preview, setPreview] = useState<StudyMaterial | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoad({ state: 'loading' });
    try {
      setItems(await fetchMaterials('published'));
      setLoad({ state: 'ready' });
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401) setLoad({ state: 'signin' });
      else if (err.status === 503) setLoad({ state: 'setup' });
      else setLoad({ state: 'error', message: err.message });
    }
  }, []);

  // Wait for the saved login to be restored, then load.
  useEffect(() => {
    if (!authLoading) void refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const download = useCallback(async (m: StudyMaterial) => {
    setDownloadingId(m.id);
    try {
      await downloadMaterial(m.id);
      setItems((all) => all.map((x) => (x.id === m.id ? { ...x, download_count: x.download_count + 1 } : x)));
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const loadPreview = useCallback((id: string) => fetchFileLink(id, 'view'), []);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);
  const recent = useMemo(
    () => [...items].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 6),
    [items]
  );

  // Browse view: Semester > Branch > Subject
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; semester: number; branch: string; subject: string; rows: StudyMaterial[] }>();
    for (const m of filtered) {
      const key = `${m.semester}|${m.branch}|${m.subject}`;
      const g = map.get(key) ?? { key, semester: m.semester, branch: m.branch, subject: m.subject, rows: [] };
      g.rows.push(m);
      map.set(key, g);
    }
    return Array.from(map.values()).sort(
      (a, b) => a.semester - b.semester || a.branch.localeCompare(b.branch) || a.subject.localeCompare(b.subject)
    );
  }, [filtered]);

  const cardProps = (m: StudyMaterial) => ({
    m,
    onPreview: setPreview,
    onDownload: download,
    downloading: downloadingId === m.id,
  });

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Library className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Study Materials</h1>
            </div>
            <p className="mt-2 text-sm text-ink-soft">Notes, slides and papers from your faculty, sorted by semester, branch and subject.</p>
          </div>
          {load.state === 'ready' && (
            <span className="rounded-full border border-line bg-panel px-3.5 py-1.5 text-sm font-semibold text-ink-soft">
              {items.length} file{items.length === 1 ? '' : 's'}
            </span>
          )}
        </header>

        {load.state === 'loading' && <SkeletonGrid />}

        {load.state === 'signin' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-panel px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <GraduationCap className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold text-ink">Sign in to see study materials</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
                Study materials are only for signed-in IPSA students. Sign in with your Google account to browse and download them.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loginWithGoogle().catch((e: Error) => setToast(e.message))}
              className="inline-flex items-center gap-2 rounded-full bg-accent-strong px-6 py-2.5 text-sm font-bold text-on-accent hover:opacity-90"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign in with Google
            </button>
          </div>
        )}

        {load.state === 'setup' && (
          <Notice title="Study materials are not switched on yet">
            The admin needs to connect Supabase storage first. After that, every file the faculty uploads will show up here.
          </Notice>
        )}

        {load.state === 'error' && (
          <Notice tone="error" title="Could not load study materials">
            <p>{load.message}</p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-ink hover:border-accent"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </Notice>
        )}

        {load.state === 'ready' && (
          <>
            {items.length === 0 ? (
              <div className="rounded-3xl border border-line bg-panel px-6 py-14 text-center">
                <Library className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-extrabold text-ink">Nothing uploaded yet</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">When faculty publish notes or slides, you will find them here.</p>
              </div>
            ) : (
              <>
                {!filtersActive(filters) && recent.length > 0 && (
                  <section aria-labelledby="recent-h">
                    <h2 id="recent-h" className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                      <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                      Recently uploaded
                    </h2>
                    <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                      {recent.map((m) => (
                        <li key={m.id} className="w-[17rem] shrink-0 snap-start sm:w-72">
                          <MaterialCard {...cardProps(m)} compact />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section aria-label="Browse study materials" className="space-y-4">
                  <FilterBar items={items} filters={filters} onChange={setFilters} />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted" aria-live="polite">
                      {filtered.length} result{filtered.length === 1 ? '' : 's'}
                      {filtersActive(filters) && (
                        <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS, sort: filters.sort })} className="ml-3 font-semibold text-accent hover:underline">
                          Clear filters
                        </button>
                      )}
                    </p>
                    <div className="flex items-center gap-1 rounded-full border border-line bg-panel p-1 text-sm font-semibold" role="group" aria-label="View">
                      {(['browse', 'latest'] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={view === v}
                          onClick={() => setView(v)}
                          className={`rounded-full px-4 py-1 ${view === v ? 'bg-accent-strong text-on-accent' : 'text-ink-soft hover:text-ink'}`}
                        >
                          {v === 'browse' ? 'By subject' : 'List'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-line bg-panel px-5 py-10 text-center">
                      <p className="font-bold text-ink">No materials match.</p>
                      <p className="mt-1 text-sm text-ink-soft">Try a different word or clear the filters.</p>
                    </div>
                  ) : view === 'latest' ? (
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filtered.map((m) => (
                        <li key={m.id}>
                          <MaterialCard {...cardProps(m)} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-7">
                      {groups.map((g) => (
                        <section key={g.key} aria-label={`${g.subject}, semester ${g.semester}`}>
                          <h3 className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-accent-strong px-3 py-1 text-xs font-extrabold text-on-accent">Sem {g.semester}</span>
                            <span className="text-xs font-semibold text-muted">{g.branch}</span>
                            <span className="font-display text-lg font-extrabold text-ink">{g.subject}</span>
                            <span className="text-xs text-muted">({g.rows.length})</span>
                          </h3>
                          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {g.rows.map((m) => (
                              <li key={m.id}>
                                <MaterialCard {...cardProps(m)} />
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>

      <PreviewDialog material={preview} onClose={() => setPreview(null)} load={loadPreview} onDownload={download} />

      {toast && (
        <div role="status" className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-semibold text-ink shadow-[var(--card-shadow)] lg:bottom-8">
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
