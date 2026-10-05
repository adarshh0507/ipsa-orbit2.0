'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { PriorityBadge, SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { EmptyState } from '@/components/brand/EmptyState';
import { AnnouncementCategory } from '@/types';
import { 
  Bell, 
  Search, 
  Calendar, 
  Pin, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Download 
} from 'lucide-react';

export default function StudentAnnouncementsPage() {
  const { section } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allAnnouncements = orbitStore
    .getAnnouncements()
    .filter((a) => a.target_section === 'Both' || a.target_section === section);

  const categories: { label: string; value: AnnouncementCategory | 'all' }[] = [
    { label: 'All Notices', value: 'all' },
    { label: 'Exam Schedules', value: 'exam' },
    { label: 'Class Updates', value: 'class_update' },
    { label: 'Academic Alerts', value: 'urgent' },
    { label: 'General Notices', value: 'general' },
  ];

  const filteredAnnouncements = allAnnouncements.filter((a) => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl font-black text-white">Academic Bulletins & Notices</h1>
              <SectionBadge section={section} />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Official circulars, exam notifications, laboratory schedules, and departmental advisories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Notices in Orbit:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
              {filteredAnnouncements.length} Published
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars by keyword..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  selectedCategory === c.value
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Stream */}
        {filteredAnnouncements.length === 0 ? (
          <EmptyState
            type="announcements"
            title="No Notices Found"
            description="No announcements matched your search or category filter. Check back later for official department circulars."
          />
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((ann) => (
              <GlassCard
                key={ann.id}
                glow={ann.priority === 'urgent' ? 'amber' : 'none'}
                className="p-5 border border-white/5 hover:border-amber-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ann.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Pin className="w-3 h-3" />
                        Pinned Notice
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider font-mono">
                      {ann.category.replace('_', ' ')}
                    </span>
                    <PriorityBadge priority={ann.priority} />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ann.date}</span>
                    <SectionBadge section={ann.target_section} />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{ann.title}</h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                  {ann.description}
                </p>

                {/* Optional Attachment */}
                {ann.attachment_name && (
                  <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Attachment: <strong>{ann.attachment_name}</strong></span>
                    <button
                      onClick={() => alert(`Downloading attachment: ${ann.attachment_name}`)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-2 font-semibold"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
