'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/brand/Logo';
import { AuthModal } from '@/components/auth/AuthModal';
import { Section } from '@/types';
import { 
  Menu, 
  X, 
  LogIn, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut, 
  GraduationCap, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, section, setSection, logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'student_login' | 'student_register' | 'admin_login'>('student_login');

  const openAuth = (tab: 'student_login' | 'student_register' | 'admin_login') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <Link href="/#features" className="hover:text-cyan-300 transition-colors">
              Platform
            </Link>
            <Link href="/student/notes" className="hover:text-cyan-300 transition-colors">
              Notes & Library
            </Link>
            <Link href="/student/timetable" className="hover:text-cyan-300 transition-colors">
              Timetable
            </Link>
            <Link href="/student/assignments" className="hover:text-cyan-300 transition-colors">
              Assignments
            </Link>
            <Link href="/student/faculty" className="hover:text-cyan-300 transition-colors">
              Faculty
            </Link>
            <Link href="/student/announcements" className="hover:text-cyan-300 transition-colors">
              Notices
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Section Switcher Pill */}
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-full p-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 pl-2.5 pr-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Orbit:
              </span>
              <button
                onClick={() => setSection('DS-1')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                  section === 'DS-1'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DS-1
              </button>
              <button
                onClick={() => setSection('DS-2')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                  section === 'DS-2'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DS-2
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href={isAdmin ? '/admin' : '/student'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Portal' : 'Student Orbit'}</span>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('student_login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-medium text-xs transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>

                <button
                  onClick={() => openAuth('admin_login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 font-medium text-xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Gateway</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => openAuth('student_login')}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl p-5 space-y-4 animate-slideDown">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs text-slate-400 font-medium">Select Active Section:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSection('DS-1')}
                  className={`px-3 py-1 rounded-md text-xs font-bold ${
                    section === 'DS-1' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'text-slate-400'
                  }`}
                >
                  DS-1
                </button>
                <button
                  onClick={() => setSection('DS-2')}
                  className={`px-3 py-1 rounded-md text-xs font-bold ${
                    section === 'DS-2' ? 'bg-violet-500/20 text-violet-300 border border-violet-500' : 'text-slate-400'
                  }`}
                >
                  DS-2
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-3 text-sm font-medium">
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                Student Dashboard
              </Link>
              <Link
                href="/student/notes"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400"
              >
                Notes & Resource Library
              </Link>
              <Link
                href="/student/timetable"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400"
              >
                Timetable ({section})
              </Link>
              <Link
                href="/student/assignments"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400"
              >
                Assignments
              </Link>
              <Link
                href="/student/faculty"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400"
              >
                Faculty Directory
              </Link>
              <Link
                href="/student/announcements"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400"
              >
                Academic Notices
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-2 pt-2 border-t border-white/5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Control Center
              </Link>
            </div>

            <div className="pt-3 border-t border-white/5 flex gap-2">
              <button
                onClick={() => openAuth('student_login')}
                className="flex-1 py-2 rounded-lg bg-cyan-600 text-white font-medium text-xs text-center"
              >
                Student Sign In
              </button>
              <button
                onClick={() => openAuth('admin_login')}
                className="flex-1 py-2 rounded-lg bg-amber-600 text-white font-medium text-xs text-center"
              >
                Admin Gateway
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </>
  );
};
