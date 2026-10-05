'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/brand/Logo';
import { Starfield } from '@/components/brand/Starfield';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  FileCheck2, 
  Bell, 
  Users, 
  Bot, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  ChevronRight, 
  Sparkles,
  Search,
  BookMarked,
  Brain,
  SlidersHorizontal,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: 'student' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role = 'student' }) => {
  const pathname = usePathname();
  const { user, section, setSection, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentNavItems = [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'Notes & Resources', href: '/student/notes', icon: BookOpen },
    { label: 'Timetable', href: '/student/timetable', icon: Calendar },
    { label: 'Assignments', href: '/student/assignments', icon: FileCheck2 },
    { label: 'Announcements', href: '/student/announcements', icon: Bell },
    { label: 'Faculty & Labs', href: '/student/faculty', icon: Users },
    { label: 'My Profile', href: '/student/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Timetable Manager', href: '/admin/timetable', icon: Calendar },
    { label: 'Notes & Resources', href: '/admin/notes', icon: BookOpen },
    { label: 'Assignments', href: '/admin/assignments', icon: FileCheck2 },
    { label: 'Announcements', href: '/admin/announcements', icon: Bell },
    { label: 'Subjects & Faculty', href: '/admin/faculty', icon: Users },
    { label: 'Students', href: '/admin/students', icon: User },
  ];

  const currentNav = role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row">
      <Starfield className="opacity-30" showOrbits={false} />

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          {/* Section indicator */}
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            section === 'DS-1' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-violet-950 text-violet-300 border border-violet-500/40'
          }`}>
            {section}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/90 backdrop-blur-2xl border-r border-white/5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <Logo size="sm" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Indicator & Switcher */}
          <div className="px-5 py-3.5 bg-slate-900/40 border-b border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Active Orbit:
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">B.Tech 1st Yr</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSection('DS-1')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  section === 'DS-1'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Section DS-1
              </button>
              <button
                onClick={() => setSection('DS-2')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  section === 'DS-2'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                    : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Section DS-2
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all group ${
                    isActive
                      ? role === 'admin'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? role === 'admin'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        role === 'admin' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Role switcher / user info */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {/* Switch Portal Button */}
          {role === 'student' ? (
            <Link
              href="/admin"
              className="w-full py-2 px-3 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch to Admin Panel</span>
            </Link>
          ) : (
            <Link
              href="/student"
              className="w-full py-2 px-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Back to Student Orbit</span>
            </Link>
          )}

          {/* User Profile Tile */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-xs">
                {user?.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.full_name || (role === 'admin' ? 'Coordinator' : 'Student')}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {role === 'admin' ? 'Department Admin' : `${section} • 1st Year`}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Top Desktop Bar */}
        <div className="hidden md:flex h-16 px-8 items-center justify-between border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal Home</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-white capitalize">
              {pathname.split('/')[2] || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Indian Standard Time indication */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Semester 1 • Academic Orbit Live</span>
            </div>

            {/* Quick Section Badge */}
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">Viewing:</span>
              <span className={`font-bold ${section === 'DS-1' ? 'text-cyan-400' : 'text-violet-400'}`}>
                {section}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};
