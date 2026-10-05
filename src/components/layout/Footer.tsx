'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { 
  Compass, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/90 text-slate-400">
      {/* Top subtle glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              A centralized academic orbit where B.Tech Data Science students access notes, assignments, announcements, faculty profiles, and dynamic weekly timetables without searching scattered WhatsApp chats.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Data Science Section DS-1
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-500/30">
                Data Science Section DS-2
              </span>
            </div>
          </div>

          {/* Quick Academic Orbits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Academic Orbit
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/student" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/student/notes" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Notes & Resources
                </Link>
              </li>
              <li>
                <Link href="/student/timetable" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Smart Timetable
                </Link>
              </li>
              <li>
                <Link href="/student/assignments" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Pending Assignments
                </Link>
              </li>
              <li>
                <Link href="/student/faculty" className="hover:text-cyan-400 transition-colors">
                  Faculty Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Department & Campus */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Campus Info
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  IPS Academy, Knowledge Village, Rajendra Nagar, A.B. Road, Indore, MP 452012
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>ds.firstyear@ipsacademy.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+91 731 4014600</span>
              </div>
            </div>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Admin Control Center
                </Link>
              </li>
              <li>
                <Link href="/admin/timetable" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Weekly Timetable Builder
                </Link>
              </li>
              <li>
                <Link href="/admin/knowledge" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Knowledge Manager (OCR)
                </Link>
              </li>
              <li>
                <Link href="/admin/ai-testing" className="text-slate-300 hover:text-amber-400 transition-colors">
                  ORBIT AI Playground
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IPSA ORBIT. Designed for First-Year B.Tech Data Science, IPS Academy Indore.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-cyan-400/80">
              <Sparkles className="w-3.5 h-3.5" />
              Local Grounded AI System v2.6
            </span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
