'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { GlassCard } from '@/components/brand/GlassCard';
import { SectionBadge } from '@/components/brand/StatusBadge';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  BookOpen, 
  FileCheck2, 
  Bell, 
  Brain, 
  Bot, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, section } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const resources = orbitStore.getResources();
  const timetableWeeks = orbitStore.getTimetableWeeks();
  const assignments = orbitStore.getAssignments();
  const announcements = orbitStore.getAnnouncements();
  const knowledgeDocs = orbitStore.getKnowledgeDocs();
  const chatbotLogs = orbitStore.getChatbotLogs();

  const ds1Weeks = timetableWeeks.filter((w) => w.section === 'DS-1');
  const ds2Weeks = timetableWeeks.filter((w) => w.section === 'DS-2');
  const publishedNotes = resources.filter((r) => r.is_published);
  const activeAssignments = assignments.filter((a) => a.is_published);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 animate-fadeIn">
        {/* Admin Header */}
        <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-amber-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Department Academic Operations Center
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                  Coordinator Level
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                IPSA ORBIT Control Center
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
                Manage weekly academic schedules with next-week cloning workflows, upload verified course notes, issue official announcements, and verify ORBIT AI knowledge documents.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/timetable"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Manage Timetables</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Operational Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <GlassCard glow="cyan" className="p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Total Enrolled</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">128</p>
            <p className="text-[11px] text-slate-500 mt-1">64 in DS-1 • 64 in DS-2</p>
          </GlassCard>

          <GlassCard glow="amber" className="p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Published Notes</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{publishedNotes.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Across 7 B.Tech subjects</p>
          </GlassCard>

          <GlassCard glow="violet" className="p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Timetable Weeks</span>
              <Calendar className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-2xl font-black text-white">{timetableWeeks.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">{ds1Weeks.length} DS-1 • {ds2Weeks.length} DS-2</p>
          </GlassCard>


        </div>

        {/* Quick Management Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Administrative Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Timetable Management Card */}
            <Link href="/admin/timetable" className="group">
              <GlassCard glow="violet" className="p-5 border border-white/5 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-3 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-violet-300">
                    Timetable Builder & Next-Week Engine
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Create new week schedules, copy previous week's plan with one click, or repeat across subsequent weeks without overwriting records.
                  </p>
                </div>
                <div className="text-xs font-semibold text-violet-400 flex items-center gap-1">
                  <span>Open Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlassCard>
            </Link>

            {/* Notes & Resources Card */}
            <Link href="/admin/notes" className="group">
              <GlassCard glow="cyan" className="p-5 border border-white/5 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300">
                    Notes & Resource Manager
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Upload syllabus PDF notes, lecture presentations, lab files, and question banks. Control publication status for DS-1 & DS-2.
                  </p>
                </div>
                <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  <span>Manage Resources</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlassCard>
            </Link>


          </div>
        </div>

        {/* Secondary Row: Faculty & Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Subjects & Faculty */}
          <GlassCard glow="none" className="p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Subjects & Faculty Directory</h3>
              </div>
              <Link href="/admin/faculty" className="text-xs text-cyan-400 hover:underline font-semibold">
                Manage →
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Initial faculty mappings for DS-1 & DS-2 are fully editable. Update cabin locations, consultation hours, and lab in-charges.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-300">Linear Algebra (LA):</span>
                <span className="font-semibold text-cyan-300">Dr. Reena Joshi</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-300">Optics & Modern Physics:</span>
                <span className="font-semibold text-cyan-300">Dr. Kavita Soni (DS-1) / Dr. Shivendra Tiwari (DS-2)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-300">Programming for Problem Solving:</span>
                <span className="font-semibold text-cyan-300">Mr. Amit Shrivastava</span>
              </div>
            </div>
          </GlassCard>

          {/* Active Assignments & Notices */}
          <GlassCard glow="none" className="p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Broadcast Alerts & Tasks</h3>
              </div>
              <Link href="/admin/announcements" className="text-xs text-amber-400 hover:underline font-semibold">
                Broadcast →
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Publish urgent academic circulars or create coursework assignments with attached problem sheets.
            </p>
            <div className="space-y-2 text-xs">
              {announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="p-2 rounded bg-slate-950 flex justify-between items-center">
                  <span className="text-slate-300 truncate max-w-[280px]">{a.title}</span>
                  <span className="text-[10px] text-amber-400 uppercase font-mono">{a.priority}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
