'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore, INITIAL_LABS } from '@/lib/store';
import { SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { 
  Users, 
  MapPin, 
  Mail, 
  Clock, 
  BookOpen, 
  FlaskConical, 
  Search,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function StudentFacultyPage() {
  const { section, setSection } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const [activeTab, setActiveTab] = useState<'faculty' | 'labs'>('faculty');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const mappings = orbitStore.getFacultyMappings().filter((m) => m.section === section);

  // Group faculty with their taught subjects for this section
  const sectionFacultyList = faculty.map((f) => {
    const taughtSubjectIds = mappings.filter((m) => m.faculty_id === f.id).map((m) => m.subject_id);
    const taughtSubjects = subjects.filter((s) => taughtSubjectIds.includes(s.id));
    return {
      ...f,
      taughtSubjects
    };
  }).filter((f) => f.taughtSubjects.length > 0 || !mappings.some(m => m.section === section));

  const filteredFaculty = sectionFacultyList.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = f.name.toLowerCase().includes(q);
    const deptMatch = f.department.toLowerCase().includes(q);
    const subMatch = f.taughtSubjects.some((s) => s.name.toLowerCase().includes(q) || s.short_name.toLowerCase().includes(q));
    return nameMatch || deptMatch || subMatch;
  });

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl font-black text-white">Faculty & Laboratory Directory</h1>
              <SectionBadge section={section} />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Connect with professors, find office cabin numbers, consultation hours, and research laboratory venues.
            </p>
          </div>

          {/* Section Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">View Faculty For:</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setSection('DS-1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  section === 'DS-1' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400'
                }`}
              >
                DS-1
              </button>
              <button
                onClick={() => setSection('DS-2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  section === 'DS-2' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50' : 'text-slate-400'
                }`}
              >
                DS-2
              </button>
            </div>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'faculty'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teaching Faculty ({filteredFaculty.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('labs')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'labs'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Department Laboratories ({INITIAL_LABS.length})</span>
            </button>
          </div>

          {activeTab === 'faculty' && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search faculty or subject..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}
        </div>

        {/* FACULTY TAB */}
        {activeTab === 'faculty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFaculty.map((fac) => (
              <GlassCard
                key={fac.id}
                glow="cyan"
                className="p-5 flex flex-col justify-between border border-white/5"
              >
                <div>
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-13 h-13 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 flex-shrink-0">
                      <img
                        src={fac.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={fac.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{fac.name}</h3>
                      <p className="text-xs text-cyan-300 font-medium">{fac.title}</p>
                      <p className="text-[11px] text-slate-400">{fac.department}</p>
                    </div>
                  </div>

                  {/* Teaching Subjects in this section */}
                  <div className="mb-4">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Teaching in {section}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.taughtSubjects.length > 0 ? (
                        fac.taughtSubjects.map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-cyan-300 border border-slate-700"
                          >
                            {s.short_name} — {s.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">First Year Course Mentor</span>
                      )}
                    </div>
                  </div>

                  {/* Location & Hours Box */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">Cabin: <strong>{fac.cabin}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span className="truncate">Hours: {fac.office_hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-mono text-[11px] text-slate-400 truncate">{fac.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>IPS Academy Indore</span>
                  <span className="text-cyan-400 font-medium">Verified Faculty</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* LABS TAB */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INITIAL_LABS.map((lab, index) => (
              <GlassCard
                key={index}
                glow="violet"
                className="p-6 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{lab.name}</h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Venue: <strong className="text-white">{lab.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-violet-400 flex-shrink-0" />
                      <span>Instructors: <span className="text-slate-300">{lab.faculty}</span></span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Data Science First Year</span>
                  <span className="text-emerald-400 font-semibold">Active Lab Unit</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
