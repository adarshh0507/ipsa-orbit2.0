'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/brand/Starfield';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { 
  Compass, 
  BookOpen, 
  Calendar, 
  FileCheck2, 
  Bell, 
  Users, 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Cpu, 
  Layers, 
  GraduationCap, 
  Download,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const { section, setSection } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'student_login' | 'student_register' | 'admin_login'>('student_login');

  const openAuth = (tab: 'student_login' | 'student_register' | 'admin_login') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  const orbitalNodes = [
    { label: 'Notes & Slides', desc: 'Verified PDF & PPT repository', icon: BookOpen, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'Smart Timetable', desc: 'Zero WhatsApp confusion', icon: Calendar, color: 'text-violet-400', border: 'border-violet-500/30' },
    { label: 'Assignments', desc: 'Deadlines & submissions', icon: FileCheck2, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Faculty Directory', desc: 'Cabins & office hours', icon: Users, color: 'text-pink-400', border: 'border-pink-500/30' },
    { label: 'Official Notices', desc: 'Exams & department alerts', icon: Bell, color: 'text-sky-400', border: 'border-sky-500/30' }
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Cinematic Canvas */}
      <Starfield />

      {/* Top Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold mb-8 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Dedicated Academic Platform for First-Year B.Tech Data Science (DS-1 & DS-2)</span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6">
            <span className="block text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]">
              IPSA ORBIT
            </span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Your Campus. Your Universe.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
            Everything you need for your academic journey, in one orbit. Say goodbye to searching through endless WhatsApp groups for notes, schedules, and deadlines.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/student"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Orbit</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <button
              onClick={() => openAuth('student_login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Student Login</span>
            </button>

            <button
              onClick={() => openAuth('admin_login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Gateway</span>
            </button>
          </div>

          {/* Interactive 3D Orbital Universe Map Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-6 md:p-8 bg-slate-950/60 border border-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-950/40">
              {/* Inner ambient orbital ring */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              
              <div className="flex items-center justify-between pb-6 border-b border-white/5 flex-wrap gap-4">
                <div className="text-left">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                    Orbital Synchronization
                  </span>
                  <h3 className="text-lg font-bold text-white">Academic Constellation Map</h3>
                </div>
                {/* Active Section selector */}
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Current Target:</span>
                  <button
                    onClick={() => setSection('DS-1')}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                      section === 'DS-1' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    DS-1
                  </button>
                  <button
                    onClick={() => setSection('DS-2')}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                      section === 'DS-2' ? 'bg-violet-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    DS-2
                  </button>
                </div>
              </div>

              {/* Grid of Orbit Nodes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                {orbitalNodes.map((node, idx) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl bg-slate-900/40 border ${node.border} text-left transition-all duration-300 hover:bg-slate-900/80 hover:-translate-y-1 group`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className={`w-5 h-5 ${node.color}`} />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {node.label}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{node.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ONE PLATFORM. EVERYTHING CONNECTED. */}
      <section id="features" className="relative z-10 py-20 border-t border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">
              Unified Academic Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">
              One Platform. Everything Connected.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Designed specifically around the first-year syllabus of IPS Academy Indore. No scattered links, no lost PDF drives, and no outdated schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Notes & Resources */}
            <div className="rounded-2xl p-7 bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Notes & Resource Library
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Direct access to lecture notes, PPT slides, PYQs with solved answers, and practical files categorized by subject and faculty.
              </p>
              <Link
                href="/student/notes"
                className="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 gap-1"
              >
                <span>Browse Resource Hub</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Smart Timetable */}
            <div className="rounded-2xl p-7 bg-slate-900/40 border border-white/5 hover:border-violet-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center mb-6 text-violet-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                Dynamic Timetable System
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Clean weekly view with room numbers, lab allocations, and historical archives. Admin next-week continuity workflow eliminates manual rework.
              </p>
              <Link
                href="/student/timetable"
                className="inline-flex items-center text-xs font-semibold text-violet-400 hover:text-violet-300 gap-1"
              >
                <span>View Weekly Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>


          </div>
        </div>
      </section>

      {/* SECTION: BUILT FOR IPS ACADEMY DATA SCIENCE STUDENTS */}
      <section className="relative z-10 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Tailored Academic Curriculum
                </span>
                <h2 className="text-3xl font-black text-white mt-2 mb-4">
                  Built For First-Year B.Tech Data Science (DS-1 & DS-2)
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Pre-configured with official IPS Academy faculty mappings and laboratory locations:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span><strong>Linear Algebra (LA):</strong> Dr. Reena Joshi</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span><strong>Optics & Modern Physics (OMP):</strong> Dr. Kavita Soni (DS-1) & Dr. Shivendra Tiwari (DS-2)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span><strong>Engineering Graphics (EG):</strong> Mr. Amit Chandak</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span><strong>Basic Civil Engineering (BCE):</strong> Dr. Devaanshi Jagwani</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span><strong>Programming for Problem Solving (PPS):</strong> Mr. Amit Shrivastava</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      Laboratory Infrastructure
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">IPS Academy</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span>OMP Optics Lab:</span>
                      <span className="text-cyan-300 font-semibold">Science Block Lab 2</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span>EG CAD Center:</span>
                      <span className="text-cyan-300 font-semibold">CAD Center Lab 1</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span>PPS Computing Center:</span>
                      <span className="text-cyan-300 font-semibold">Turing Computer Lab 3</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span>BCE Survey Yard:</span>
                      <span className="text-cyan-300 font-semibold">Civil Survey Lab</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>EC Core Workshop:</span>
                      <span className="text-cyan-300 font-semibold">EC Workshop Block</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-cyan-300">Ready to enter your academic orbit?</p>
                    <p className="text-slate-400 text-[11px]">Instant access with your college credentials.</p>
                  </div>
                  <button
                    onClick={() => openAuth('student_login')}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Enter Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </div>
  );
}
