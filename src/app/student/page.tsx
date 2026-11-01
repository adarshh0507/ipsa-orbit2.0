'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, FileCheck2, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SectionSwitcher } from '@/components/student/SectionSwitcher';
import { TodaySchedule } from '@/components/student/TodaySchedule';
import { PendingAssignments } from '@/components/student/PendingAssignments';
import { LatestNotices } from '@/components/student/LatestNotices';

const SHORTCUTS = [
  { href: '/student/notes', label: 'Notes & PYQs', icon: BookOpen },
  { href: '/student/timetable', label: 'Weekly timetable', icon: Calendar },
  { href: '/student/assignments', label: 'Assignments', icon: FileCheck2 },
  { href: '/student/faculty', label: 'Faculty & Labs', icon: Users },
];

export default function StudentDashboard() {
  const { user, section } = useAuth();

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-5xl space-y-5 animate-fadeIn">
        {/* 1 and 2: welcome and section switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">Welcome back, {user?.full_name || 'Scholar'}</h1>
            <p className="text-xs text-slate-400">Section {section}</p>
          </div>
          <SectionSwitcher />
        </div>

        {/* 3 to 6: date and clock, heading, three lectures, activity */}
        <TodaySchedule />

        {/* 7 and 8: compact assignments and notices, details open in a modal */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PendingAssignments />
          <LatestNotices />
        </div>

        <nav aria-label="Shortcuts" className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/5 pt-4">
          {SHORTCUTS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </DashboardLayout>
  );
}
