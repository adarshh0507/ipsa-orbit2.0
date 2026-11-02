'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/brand/Logo';
import { SectionPicker } from '@/components/auth/SectionPicker';
import { GlobalSearch } from '@/components/layout/GlobalSearch';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { orbitStore } from '@/lib/store';
import { TICK_MS, useClockTick } from '@/lib/useClock';
import type { Section } from '@/types';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  House,
  LogOut,
  Menu,
  ShieldCheck,
  SquareCheckBig,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: 'student' | 'admin';
}

const studentNavItems = [
  { label: 'Dashboard', href: '/student', icon: House },
  { label: 'Notes & Resources', href: '/student/notes', icon: BookOpen },
  { label: 'Timetable', href: '/student/timetable', icon: CalendarDays },
  { label: 'Assignments', href: '/student/assignments', icon: SquareCheckBig },
  { label: 'Announcements', href: '/student/announcements', icon: Bell },
  { label: 'Faculty & Labs', href: '/student/faculty', icon: Users },
  { label: 'My Profile', href: '/student/profile', icon: User },
];

// Bottom tab bar on phones (student side only)
const mobileTabs = [
  { label: 'Home', href: '/student', icon: House },
  { label: 'Notes', href: '/student/notes', icon: BookOpen },
  { label: 'Classes', href: '/student/timetable', icon: CalendarDays },
  { label: 'Tasks', href: '/student/assignments', icon: SquareCheckBig },
  { label: 'Profile', href: '/student/profile', icon: User },
];

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: House },
  { label: 'Notes & Resources', href: '/admin/notes', icon: BookOpen },
  { label: 'Notices', href: '/admin/announcements', icon: Bell },
  { label: 'Assignments', href: '/admin/assignments', icon: SquareCheckBig },
  { label: 'Timetable', href: '/admin/timetable', icon: CalendarDays },
  { label: 'Holidays', href: '/admin/holidays', icon: Sun },
];

function SectionDropdown({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const options: Section[] = ['DS-1', 'DS-2'];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
        <span className="whitespace-nowrap">
          <span>Semester 1 - </span>
          {section}
        </span>
        <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
      </button>

      {open && (
        <ul role="listbox" aria-label="Choose section" className="absolute right-0 top-full z-40 mt-2 w-44 rounded-2xl border border-line bg-panel p-1.5 shadow-[var(--card-shadow)]">
          {options.map((opt) => (
            <li key={opt} role="option" aria-selected={section === opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-panel-alt"
              >
                <span>Section {opt}</span>
                {section === opt && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role = 'student' }) => {
  const pathname = usePathname();
  const { user, section, setSection, logout, needsSectionChoice } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setStoreTick] = useState(0);
  const tick = useClockTick();
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    return orbitStore.subscribe(() => setStoreTick((t) => t + 1));
  }, []);

  const currentNav = role === 'admin' ? adminNavItems : studentNavItems;
  const nowMs = tick * TICK_MS;

  // Notices from the last 7 days drive the bell badge and the dot next to Announcements.
  const recentNotices =
    nowMs === 0
      ? 0
      : orbitStore
          .getAnnouncements()
          .filter((a) => a.target_section === 'Both' || a.target_section === section)
          .filter((a) => nowMs - Date.parse(a.created_at) < 7 * 24 * 60 * 60 * 1000).length;

  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';
  const base = role === 'admin' ? '/admin' : '/student';

  return (
    <div className="relative flex min-h-screen flex-col bg-page text-ink md:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-line bg-sidebar transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-start justify-between px-5 pb-4 pt-6">
            <Logo size="md" />
            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Close menu"
              className="rounded-lg p-1 text-muted hover:text-ink md:hidden"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Main" className="space-y-1.5 px-4 pt-6">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === base ? pathname === base : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3.5 rounded-full px-4 py-3 text-[15px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-strong to-accent-2 text-on-accent shadow-[var(--card-shadow)]'
                      : 'text-ink-soft hover:bg-panel hover:text-ink'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Announcements' && recentNotices > 0 && (
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-label="New notices" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 p-4">
          <Link
            href={role === 'student' ? '/admin' : '/student'}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink-soft hover:border-accent hover:text-accent"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{role === 'student' ? 'Switch to Admin Panel' : 'Back to Student Orbit'}</span>
          </Link>

          <div className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-panel p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-strong to-accent-2 text-base font-bold text-on-accent">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{user?.full_name || (role === 'admin' ? 'Coordinator' : 'Student')}</p>
                <p className="truncate text-xs text-muted">{role === 'admin' ? 'Department Admin' : `${section} • 1st Year`}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              aria-label="Log out"
              className="shrink-0 rounded-lg p-2 text-muted hover:bg-panel-alt hover:text-red-500"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={closeSidebar} aria-hidden="true" />}

      {/* Main */}
      <main
        className={`relative z-10 flex min-h-screen flex-1 flex-col md:pl-64 ${role === 'student' ? 'pb-20 md:pb-0' : ''}`}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-line bg-page/90 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4 py-2.5 sm:px-6 md:gap-3 md:py-3 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="-ml-1.5 rounded-lg p-2 text-ink hover:bg-panel md:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Phone: logo in the top bar (the sidebar is hidden there) */}
            <div className="md:hidden">
              <Logo size="sm" showTagline={false} />
            </div>

            <div className="hidden min-w-0 flex-1 md:block">
              <GlobalSearch role={role} />
            </div>
            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block">
                <SectionDropdown section={section} onChange={setSection} />
              </div>
              <ThemeToggle />
              <Link
                href={`${base}/announcements`}
                aria-label={recentNotices > 0 ? `Notices, ${recentNotices} new` : 'Notices'}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink hover:border-accent md:h-11 md:w-11"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {recentNotices > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                    {recentNotices}
                  </span>
                )}
              </Link>
              <Link
                href={role === 'admin' ? '/admin' : `${base}/profile`}
                aria-label={role === 'admin' ? 'Admin home' : 'My profile'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-base font-bold text-ink hover:border-accent md:h-11 md:w-11"
              >
                {initial}
              </Link>
            </div>
          </div>

          {/* Phone: search and semester chip sit under the logo row */}
          <div className="space-y-2.5 px-4 pb-3 md:hidden">
            <GlobalSearch role={role} />
            <div className="flex justify-center">
              <SectionDropdown section={section} onChange={setSection} />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:px-8 lg:py-6">{children}</div>
      </main>

      {/* Phone only: bottom tab bar for students */}
      {role === 'student' && (
        <nav
          aria-label="Quick tabs"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-sidebar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        >
          <ul className="grid grid-cols-5">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                      isActive ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                        isActive ? 'bg-accent/15' : ''
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {role === 'student' && needsSectionChoice && <SectionPicker />}
    </div>
  );
};
