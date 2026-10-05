'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { 
  User, 
  Mail, 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, section, setSection } = useAuth();
  const subjects = orbitStore.getSubjects();
  const mappings = orbitStore.getFacultyMappings().filter((m) => m.section === section);
  const faculty = orbitStore.getFaculty();

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-black text-white">Student Academic Profile</h1>
            <SectionBadge section={section} />
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Official enrollment credentials and academic registration details at IPS Academy Indore.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-cyan-500/30 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-cyan-400/50 flex items-center justify-center text-3xl font-black text-cyan-300 shadow-xl shadow-cyan-500/20 flex-shrink-0">
              {user?.full_name ? user.full_name.charAt(0) : 'S'}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-white">{user?.full_name || 'Aarav Sharma'}</h2>
                <SectionBadge section={section} />
              </div>

              <p className="text-xs text-cyan-300 font-mono">
                Enrollment ID: {user?.enrollment_no || '0808DS251001'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  {user?.email || 'student@orbit.ipsacademy.ac.in'}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  B.Tech Data Science (1st Year)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Semester</p>
              <p className="text-base font-bold text-white mt-0.5">Semester 1</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Credits</p>
              <p className="text-base font-bold text-cyan-300 mt-0.5">{totalCredits} Credits</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Registered Courses</p>
              <p className="text-base font-bold text-white mt-0.5">{subjects.length} Courses</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Section Orbit</p>
              <p className="text-base font-bold text-violet-300 mt-0.5">{section}</p>
            </div>
          </div>
        </div>

        {/* Section Switcher & Attendance Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassCard glow="cyan" className="p-5 border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Switch Section View
            </h3>
            <p className="text-xs text-slate-400">
              Need to preview materials or lecture schedules for the other section? Switch your active orbit:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setSection('DS-1')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  section === 'DS-1'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Section DS-1
              </button>
              <button
                onClick={() => setSection('DS-2')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  section === 'DS-2'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Section DS-2
              </button>
            </div>
          </GlassCard>

          <GlassCard glow="none" className="p-5 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Academic Attendance Policy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Minimum <strong>75% attendance</strong> is compulsory in both theory lectures and laboratory sessions to qualify for mid-semester and end-semester university examinations.
            </p>
            <p className="text-[11px] text-slate-500">
              Office of First-Year Coordinator • IPS Academy Indore
            </p>
          </GlassCard>
        </div>

        {/* Registered Subjects List */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Registered Subjects & Assigned Faculty ({section})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {subjects.map((sub) => {
              const map = mappings.find((m) => m.subject_id === sub.id);
              const fac = map ? faculty.find((f) => f.id === map.faculty_id) : null;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block mb-0.5">{sub.name}</span>
                    <span className="text-slate-400">
                      Instructor: <strong className="text-cyan-300">{fac?.name || 'Assigned'}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-slate-300 font-bold block">{sub.code}</span>
                    <span className="text-slate-500">{sub.credits} Credits</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
