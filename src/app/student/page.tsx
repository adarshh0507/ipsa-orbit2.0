'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { orbitStore } from '@/lib/store';
import { SectionBadge, PriorityBadge, ResourceTypeBadge, SlotTypeBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { EmptyState } from '@/components/brand/EmptyState';
import { 
  BookOpen, 
  Calendar, 
  FileCheck2, 
  Bell, 
  Users, 
  Bot, 
  Download, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, section } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const resources = orbitStore
    .getResources()
    .filter((r) => r.is_published && (r.section === 'Both' || r.section === section))
    .slice(0, 4);

  const timetableWeeks = orbitStore
    .getTimetableWeeks()
    .filter((w) => w.section === section && w.status === 'published');

  const activeWeek = timetableWeeks[timetableWeeks.length - 1];
  const allSlots = activeWeek
    ? orbitStore.getTimetableSlots().filter((s) => s.week_id === activeWeek.id)
    : [];

  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const todayDay = days[new Date().getDay()];
  const todaySlots = allSlots
    .filter((s) => s.day_of_week === (todayDay === 'Sunday' ? 'Monday' : todayDay))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const assignments = orbitStore
    .getAssignments()
    .filter((a) => a.is_published && (a.section === 'Both' || a.section === section))
    .slice(0, 3);

  const announcements = orbitStore
    .getAnnouncements()
    .filter((a) => a.target_section === 'Both' || a.target_section === section)
    .slice(0, 3);

  return (
    <DashboardLayout role="student">
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/20 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-cyan-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  First Year Academic Orbit
                </span>
                <SectionBadge section={section} />
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Welcome back, {user?.full_name || 'Scholar'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
                Here is your live academic flight plan for <strong>Section {section}</strong>. Timetable, notes, and pending assignments are synchronized.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/student/timetable"
                className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Weekly Schedule</span>
              </Link>
              <Link
                href="/student/notes"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resource Library</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/student/notes" className="group">
            <GlassCard glow="cyan" className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Library</p>
                <p className="text-sm font-bold text-white group-hover:text-cyan-300">Notes & PYQs</p>
              </div>
            </GlassCard>
          </Link>

          <Link href="/student/timetable" className="group">
            <GlassCard glow="violet" className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Schedule</p>
                <p className="text-sm font-bold text-white group-hover:text-violet-300">Timetable</p>
              </div>
            </GlassCard>
          </Link>

          <Link href="/student/assignments" className="group">
            <GlassCard glow="emerald" className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Tasks</p>
                <p className="text-sm font-bold text-white group-hover:text-emerald-300">Assignments</p>
              </div>
            </GlassCard>
          </Link>

          <Link href="/student/faculty" className="group">
            <GlassCard glow="amber" className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Directory</p>
                <p className="text-sm font-bold text-white group-hover:text-amber-300">Faculty & Labs</p>
              </div>
            </GlassCard>
          </Link>
        </div>

        {/* Two-Column Primary Row: Today's Schedule & Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Timetable Widget (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white">
                  Today's Schedule ({todayDay === 'Sunday' ? 'Monday Preview' : todayDay})
                </h2>
              </div>
              <Link
                href="/student/timetable"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {todaySlots.length === 0 ? (
              <EmptyState
                type="timetable"
                title="No Timetable Published Yet"
                description={`Department admin has not released the schedule for ${section}. Timetable starts blank until published by coordinator.`}
                actionText="Check Timetable Archive"
                actionHref="/student/timetable"
              />
            ) : (
              <div className="space-y-3">
                {todaySlots.map((slot) => {
                  const sub = subjects.find((s) => s.id === slot.subject_id);
                  const fac = faculty.find((f) => f.id === slot.faculty_id);
                  return (
                    <GlassCard
                      key={slot.id}
                      glow="none"
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/5 hover:border-cyan-500/30"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center flex-shrink-0 text-center">
                          <Clock className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">
                            {slot.start_time}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{sub?.name || 'Class'}</span>
                            <SlotTypeBadge type={slot.slot_type} />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {fac?.name} • <span className="text-slate-300 font-medium">📍 {slot.room}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-400">
                        <span className="font-mono text-[11px] text-slate-300">{slot.start_time} - {slot.end_time}</span>
                        <span className="text-[10px] text-slate-500 capitalize">{slot.slot_type}</span>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}

            {/* Recently Uploaded Notes Section */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-base font-bold text-white">Recently Uploaded Notes</h2>
                </div>
                <Link
                  href="/student/notes"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>View All Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {resources.map((res) => {
                  const sub = subjects.find((s) => s.id === res.subject_id);
                  return (
                    <GlassCard
                      key={res.id}
                      glow="none"
                      className="p-4 flex flex-col justify-between border border-white/5 hover:border-cyan-500/30"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <ResourceTypeBadge type={res.resource_type} />
                          <span className="text-[11px] font-mono text-slate-500">{res.file_size || 'PDF'}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 mb-1">
                          {res.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {sub?.short_name} • {res.unit_or_module || 'General'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500">
                          {new Date(res.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => {
                            orbitStore.incrementDownload(res.id);
                            alert(`Downloading verified material: ${res.file_name}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Get</span>
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Pending Assignments & Announcements */}
          <div className="space-y-6">
            {/* Pending Assignments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Pending Assignments</h3>
                </div>
                <Link
                  href="/student/assignments"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  View All
                </Link>
              </div>

              {assignments.length === 0 ? (
                <EmptyState
                  type="assignments"
                  title="No Pending Tasks"
                  description="All clear! No assignments due right now."
                />
              ) : (
                <div className="space-y-2.5">
                  {assignments.map((asg) => {
                    const sub = subjects.find((s) => s.id === asg.subject_id);
                    return (
                      <GlassCard
                        key={asg.id}
                        glow="none"
                        className="p-3.5 border border-white/5 hover:border-emerald-500/30"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {sub?.short_name}
                          </span>
                          <PriorityBadge priority={asg.priority} />
                        </div>
                        <h4 className="text-xs font-bold text-white mb-1">{asg.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                          {asg.description}
                        </p>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Due: {new Date(asg.due_date).toLocaleDateString()}</span>
                          <Link
                            href="/student/assignments"
                            className="text-emerald-400 hover:underline font-semibold"
                          >
                            Submit →
                          </Link>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Latest Announcements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Latest Notices</h3>
                </div>
                <Link
                  href="/student/announcements"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  All Notices
                </Link>
              </div>

              <div className="space-y-2.5">
                {announcements.map((ann) => (
                  <GlassCard
                    key={ann.id}
                    glow="none"
                    className="p-3.5 border border-white/5 hover:border-amber-500/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {ann.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">{ann.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{ann.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {ann.description}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
