'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { orbitStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

interface Result {
  id: string;
  group: string;
  title: string;
  hint: string;
  href: string;
}

export function GlobalSearch({ role }: { role: 'student' | 'admin' }) {
  const { section } = useAuth();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const base = role === 'admin' ? '/admin' : '/student';

  // Ctrl+K (or Cmd+K) jumps to the search box
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close when clicking elsewhere
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const subjects = orbitStore.getSubjects();
    const subjectName = (id: string) => subjects.find((s) => s.id === id)?.short_name || '';
    const inSection = (s: string) => s === 'Both' || s === section;
    const out: Result[] = [];

    orbitStore
      .getResources()
      .filter((r) => r.is_published && inSection(r.section))
      .filter((r) => `${r.title} ${subjectName(r.subject_id)} ${r.unit_or_module || ''}`.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((r) => out.push({ id: `res-${r.id}`, group: 'Notes', title: r.title, hint: subjectName(r.subject_id), href: `${base}/notes` }));

    subjects
      .filter((s) => `${s.name} ${s.short_name} ${s.code}`.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((s) => out.push({ id: `sub-${s.id}`, group: 'Classes', title: s.name, hint: s.short_name, href: `${base}/timetable` }));

    orbitStore
      .getAssignments()
      .filter((a) => a.is_published && inSection(a.section))
      .filter((a) => a.title.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((a) => out.push({ id: `asg-${a.id}`, group: 'Assignments', title: a.title, hint: subjectName(a.subject_id), href: `${base}/assignments` }));

    orbitStore
      .getAnnouncements()
      .filter((a) => inSection(a.target_section))
      .filter((a) => `${a.title} ${a.description}`.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((a) => out.push({ id: `ann-${a.id}`, group: 'Notices', title: a.title, hint: a.date, href: `${base}/announcements` }));

    orbitStore
      .getFaculty()
      .filter((f) => f.name.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((f) => out.push({ id: `fac-${f.id}`, group: 'Faculty', title: f.name, hint: f.cabin, href: `${base}/faculty` }));

    return out;
  }, [query, section, base]);

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-full border border-line bg-panel px-4 py-2.5 focus-within:border-accent">
        <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search anything... (Notes, Classes, etc.)"
          aria-label="Search notes, classes, assignments and notices"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        <kbd className="hidden shrink-0 rounded-md border border-line px-2 py-0.5 text-xs text-muted lg:block">Ctrl + K</kbd>
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-line bg-panel p-2 shadow-[var(--card-shadow)]">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted">Nothing found for &quot;{query.trim()}&quot;.</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-panel-alt"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-xs text-muted">{r.hint}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">{r.group}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
