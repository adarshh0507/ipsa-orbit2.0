'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { SectionBadge, SlotTypeBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { EmptyState } from '@/components/brand/EmptyState';
import { DayOfWeek } from '@/types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Archive, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function StudentTimetablePage() {
  const { section, setSection } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const publishedWeeks = orbitStore
    .getTimetableWeeks()
    .filter((w) => w.section === section && w.status === 'published');

  // Currently selected week id
  const [selectedWeekId, setSelectedWeekId] = useState<string>('');

  useEffect(() => {
    if (publishedWeeks.length > 0 && (!selectedWeekId || !publishedWeeks.some(w => w.id === selectedWeekId))) {
      setSelectedWeekId(publishedWeeks[publishedWeeks.length - 1].id);
    }
  }, [publishedWeeks, selectedWeekId]);

  const activeWeek = publishedWeeks.find((w) => w.id === selectedWeekId);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

  const allSlots = activeWeek
    ? orbitStore.getTimetableSlots().filter((s) => s.week_id === activeWeek.id)
    : [];

  const daySlots = allSlots
    .filter((s) => s.day_of_week === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl font-black text-white">Dynamic Weekly Timetable</h1>
              <SectionBadge section={section} />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Official lecture and laboratory schedule for First-Year B.Tech Data Science.
            </p>
          </div>

          {/* Section & Week selector */}
          <div className="flex items-center gap-2 flex-wrap">
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

            {/* Historical Week Selector */}
            {publishedWeeks.length > 0 && (
              <select
                value={selectedWeekId}
                onChange={(e) => setSelectedWeekId(e.target.value)}
                className="py-1.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {publishedWeeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    Week {w.week_number} ({w.start_date} to {w.end_date})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Empty State when no timetable published yet */}
        {publishedWeeks.length === 0 ? (
          <EmptyState
            type="timetable"
            title="No Timetable Published Yet"
            description={`Your department coordinator hasn't published the schedule for ${section} yet. Timetables are released weekly by admin and will appear here in real-time.`}
            actionText="Switch to Admin to Build Schedule"
            actionHref="/admin/timetable"
          />
        ) : (
          <div className="space-y-6">
            {/* Active Week Metadata Banner */}
            {activeWeek && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold">
                    Active Flight Plan: Week {activeWeek.week_number}
                  </span>
                  <span className="text-slate-400">
                    ({activeWeek.start_date} to {activeWeek.end_date})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Officially Approved & Published</span>
                </div>
              </div>
            )}

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {days.map((day) => {
                const count = allSlots.filter((s) => s.day_of_week === day).length;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                      activeDay === day
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{day}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Day Slots Grid */}
            {daySlots.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-white/5 bg-slate-950/40">
                <p className="text-slate-400 text-sm">
                  No scheduled sessions for <strong>{activeDay}</strong> in Week {activeWeek?.week_number}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {daySlots.map((slot) => {
                  const sub = subjects.find((s) => s.id === slot.subject_id);
                  const fac = faculty.find((f) => f.id === slot.faculty_id);

                  return (
                    <GlassCard
                      key={slot.id}
                      glow="none"
                      className="p-5 border border-white/5 hover:border-cyan-500/40 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Timing & Slot Type */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                          <SlotTypeBadge type={slot.slot_type} />
                        </div>

                        {/* Subject Title */}
                        <h3 className="text-base font-bold text-white mb-1">
                          {sub?.name || 'Class Subject'}
                        </h3>
                        <p className="text-xs text-cyan-300 font-semibold mb-3">
                          {sub?.code} • {sub?.short_name}
                        </p>

                        {/* Faculty & Room details */}
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{fac?.name || 'Faculty Assigned'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span className="font-semibold text-slate-200">{slot.room}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                        <span>IPS Academy Indore</span>
                        <span className="capitalize">{slot.slot_type}</span>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
