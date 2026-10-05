'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { Section, DayOfWeek, SlotType, TimetableWeek, TimetableSlot } from '@/types';
import { SectionBadge, SlotTypeBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { EmptyState } from '@/components/brand/EmptyState';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Archive, 
  X, 
  ArrowRight,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function AdminTimetableManager() {
  const { section: initialSection } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const mappings = orbitStore.getFacultyMappings().filter((m) => m.section === activeSection);
  const allWeeks = orbitStore.getTimetableWeeks().filter((w) => w.section === activeSection);

  // Selected week ID
  const [selectedWeekId, setSelectedWeekId] = useState<string>('');

  useEffect(() => {
    if (allWeeks.length > 0 && (!selectedWeekId || !allWeeks.some(w => w.id === selectedWeekId))) {
      setSelectedWeekId(allWeeks[allWeeks.length - 1].id);
    }
  }, [allWeeks, selectedWeekId]);

  const activeWeek = allWeeks.find((w) => w.id === selectedWeekId);
  const activeSlots = activeWeek
    ? orbitStore.getTimetableSlots().filter((s) => s.week_id === activeWeek.id)
    : [];

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

  // Next Week Workflow Modal state
  const [nextWeekModalOpen, setNextWeekModalOpen] = useState(false);
  const [nextWeekAction, setNextWeekAction] = useState<'copy' | 'edit' | 'blank'>('copy');

  // Slot Editor Modal state
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [slotDay, setSlotDay] = useState<DayOfWeek>('Monday');
  const [slotStartTime, setSlotStartTime] = useState('09:30');
  const [slotEndTime, setSlotEndTime] = useState('10:30');
  const [slotSubjectId, setSlotSubjectId] = useState(subjects[0]?.id || 'sub-la');
  const [slotFacultyId, setSlotFacultyId] = useState(faculty[0]?.id || 'fac-reena-joshi');
  const [slotRoom, setSlotRoom] = useState('Room 204');
  const [slotType, setSlotType] = useState<SlotType>('lecture');

  // Automatically update suggested faculty when subject changes
  const handleSubjectChange = (newSubjectId: string) => {
    setSlotSubjectId(newSubjectId);
    const map = mappings.find((m) => m.subject_id === newSubjectId);
    if (map) {
      setSlotFacultyId(map.faculty_id);
    }
  };

  const openAddSlotModal = (day: DayOfWeek) => {
    setEditingSlot(null);
    setSlotDay(day);
    setSlotStartTime('09:30');
    setSlotEndTime('10:30');
    setSlotSubjectId(subjects[0]?.id || 'sub-la');
    const defaultFac = mappings.find((m) => m.subject_id === subjects[0]?.id)?.faculty_id || faculty[0]?.id;
    setSlotFacultyId(defaultFac);
    setSlotRoom('Room 204');
    setSlotType('lecture');
    setSlotModalOpen(true);
  };

  const openEditSlotModal = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setSlotDay(slot.day_of_week);
    setSlotStartTime(slot.start_time);
    setSlotEndTime(slot.end_time);
    setSlotSubjectId(slot.subject_id);
    setSlotFacultyId(slot.faculty_id);
    setSlotRoom(slot.room);
    setSlotType(slot.slot_type);
    setSlotModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWeek) return;

    if (editingSlot) {
      orbitStore.updateTimetableSlot({
        ...editingSlot,
        day_of_week: slotDay,
        start_time: slotStartTime,
        end_time: slotEndTime,
        subject_id: slotSubjectId,
        faculty_id: slotFacultyId,
        room: slotRoom,
        slot_type: slotType
      });
    } else {
      orbitStore.addTimetableSlot({
        week_id: activeWeek.id,
        section: activeSection,
        day_of_week: slotDay,
        start_time: slotStartTime,
        end_time: slotEndTime,
        subject_id: slotSubjectId,
        faculty_id: slotFacultyId,
        room: slotRoom,
        slot_type: slotType
      });
    }

    setSlotModalOpen(false);
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm('Are you sure you want to delete this class slot?')) {
      orbitStore.deleteTimetableSlot(id);
    }
  };

  const handlePublishWeek = () => {
    if (!activeWeek) return;
    orbitStore.publishTimetableWeek(activeWeek.id);
    alert(`Week ${activeWeek.week_number} timetable officially published! Students can now see this schedule in their dashboard.`);
  };

  // NEXT WEEK WORKFLOW: 3 Distinct Options
  const handleExecuteNextWeekWorkflow = () => {
    const lastWeekNumber = allWeeks.length > 0 ? Math.max(...allWeeks.map(w => w.week_number)) : 0;
    const targetWeekNumber = lastWeekNumber + 1;

    // Calculate dates
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
    const nextSaturday = new Date(nextMonday);
    nextSaturday.setDate(nextMonday.getDate() + 5);

    const startDate = nextMonday.toISOString().split('T')[0];
    const endDate = nextSaturday.toISOString().split('T')[0];

    if (nextWeekAction === 'copy' || nextWeekAction === 'edit') {
      if (!activeWeek) {
        alert('No active week found to copy from. Creating blank week instead.');
        const newW = orbitStore.createTimetableWeek(activeSection, targetWeekNumber, startDate, endDate, 'draft');
        setSelectedWeekId(newW.id);
      } else {
        const newWeek = orbitStore.copyTimetableToNextWeek(activeWeek.id, targetWeekNumber, startDate, endDate);
        setSelectedWeekId(newWeek.id);
        alert(`Cloned Week ${activeWeek.week_number} into Week ${targetWeekNumber} as a draft. Historical records preserved.`);
      }
    } else {
      // Option 3: Create completely blank weekly plan
      const newWeek = orbitStore.createTimetableWeek(activeSection, targetWeekNumber, startDate, endDate, 'draft');
      setSelectedWeekId(newWeek.id);
      alert(`Created blank Week ${targetWeekNumber} schedule.`);
    }

    setNextWeekModalOpen(false);
  };

  // One-click quick action: Repeat this timetable next week
  const handleRepeatNextWeek = () => {
    if (!activeWeek) return;
    const targetWeekNumber = activeWeek.week_number + 1;
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
    const nextSaturday = new Date(nextMonday);
    nextSaturday.setDate(nextMonday.getDate() + 5);

    const newWeek = orbitStore.copyTimetableToNextWeek(
      activeWeek.id,
      targetWeekNumber,
      nextMonday.toISOString().split('T')[0],
      nextSaturday.toISOString().split('T')[0]
    );
    setSelectedWeekId(newWeek.id);
    alert(`Week ${activeWeek.week_number} timetable successfully repeated into Week ${targetWeekNumber} (Draft)!`);
  };

  // Seed sample timetable for quick evaluation
  const handleSeedSample = () => {
    const week = orbitStore.seedSampleTimetable(activeSection);
    setSelectedWeekId(week.id);
    alert(`Generated realistic First-Year B.Tech Data Science schedule for Section ${activeSection}!`);
  };

  const daySlots = activeSlots
    .filter((s) => s.day_of_week === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl font-black text-white">Dynamic Timetable System</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                Admin Builder
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Build weekly lecture and laboratory schedules. Use the 3-option Next Week Workflow to duplicate or evolve timetables without overwriting history.
            </p>
          </div>

          {/* Section Switcher & Next Week Trigger */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveSection('DS-1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeSection === 'DS-1' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400'
                }`}
              >
                DS-1
              </button>
              <button
                onClick={() => setActiveSection('DS-2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeSection === 'DS-2' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50' : 'text-slate-400'
                }`}
              >
                DS-2
              </button>
            </div>

            <button
              onClick={() => setNextWeekModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Next Week Workflow</span>
            </button>
          </div>
        </div>

        {/* Status / History Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/70 border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Timetable Records ({activeSection}):</span>
            {allWeeks.length > 0 ? (
              <select
                value={selectedWeekId}
                onChange={(e) => setSelectedWeekId(e.target.value)}
                className="py-1.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {allWeeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    Week {w.week_number} ({w.start_date} to {w.end_date}) — [{w.status.toUpperCase()}]
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-semibold text-rose-400">No schedules recorded</span>
            )}
          </div>

          {activeWeek && (
            <div className="flex items-center gap-2">
              {activeWeek.status === 'draft' ? (
                <button
                  onClick={handlePublishWeek}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Publish Schedule</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Status: Published to Students</span>
                </span>
              )}

              <button
                onClick={handleRepeatNextWeek}
                title="Repeat this timetable into next week with 1 click"
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Repeat Next Week</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State when no timetable created yet */}
        {allWeeks.length === 0 ? (
          <div className="p-8 md:p-12 text-center rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
            <EmptyState
              type="timetable"
              title="No Timetable Published Yet"
              description={`No timetable has been created for Section ${activeSection} yet. Timetables start blank as required.`}
            />
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setNextWeekModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-lg shadow-amber-500/20"
              >
                Create Blank Week 1
              </button>
              <button
                onClick={handleSeedSample}
                className="px-5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Realistic Schedule for Testing</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Day Selector Tabs with Add Slot Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                {days.map((day) => {
                  const count = activeSlots.filter((s) => s.day_of_week === day).length;
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                        activeDay === day
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
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

              <button
                onClick={() => openAddSlotModal(activeDay)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center gap-1.5 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class to {activeDay}</span>
              </button>
            </div>

            {/* Slots for Active Day */}
            {daySlots.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-white/5 bg-slate-950/40">
                <p className="text-slate-400 text-sm mb-3">
                  No lecture or laboratory sessions added for <strong>{activeDay}</strong> yet.
                </p>
                <button
                  onClick={() => openAddSlotModal(activeDay)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Class Slot</span>
                </button>
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
                      className="p-5 border border-white/5 hover:border-amber-500/30 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                          <SlotTypeBadge type={slot.slot_type} />
                        </div>

                        <h3 className="text-base font-bold text-white mb-1">
                          {sub?.name || 'Class Subject'}
                        </h3>
                        <p className="text-xs text-slate-400 mb-3">
                          {sub?.short_name} • Instructor: <strong className="text-slate-200">{fac?.name}</strong>
                        </p>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300">
                          <span>Venue: <strong>{slot.room}</strong></span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditSlotModal(slot)}
                          className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
                          title="Edit Slot"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1.5 rounded-lg border border-rose-900/50 text-rose-400 hover:bg-rose-950/40 text-xs"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NEXT WEEK WORKFLOW MODAL (PROMPT SECTION 8) */}
        {nextWeekModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-amber-500/30 shadow-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Next Week Timetable Workflow</h3>
                </div>
                <button
                  onClick={() => setNextWeekModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 my-4">
                Choose how you want to prepare the schedule for <strong>Section {activeSection}</strong>. Previous weeks are always maintained in historical records and never overwritten.
              </p>

              {/* Three Options */}
              <div className="space-y-3 mb-6">
                <label
                  onClick={() => setNextWeekAction('copy')}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    nextWeekAction === 'copy'
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="nextWeekOption"
                    checked={nextWeekAction === 'copy'}
                    onChange={() => setNextWeekAction('copy')}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">1. Keep Same Timetable</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Copy the previous week's complete schedule into a brand new week record. Perfect for regular lecture continuity.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setNextWeekAction('edit')}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    nextWeekAction === 'edit'
                      ? 'border-violet-400 bg-violet-950/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="nextWeekOption"
                    checked={nextWeekAction === 'edit'}
                    onChange={() => setNextWeekAction('edit')}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">2. Edit Existing Timetable</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Copy the previous schedule as a draft and allow adjusting selected classes or lab sessions without affecting past records.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setNextWeekAction('blank')}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    nextWeekAction === 'blank'
                      ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="nextWeekOption"
                    checked={nextWeekAction === 'blank'}
                    onChange={() => setNextWeekAction('blank')}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">3. Create New Timetable</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Start with a completely blank weekly plan. All slots start empty for custom scheduling.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setNextWeekModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteNextWeekWorkflow}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
                >
                  <span>Proceed with Option</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLOT CREATION / EDITING MODAL */}
        {slotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  {editingSlot ? 'Edit Class Slot' : 'Add New Class Slot'} ({activeDay})
                </h3>
                <button
                  onClick={() => setSlotModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSlot} className="space-y-4 my-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Day of Week
                    </label>
                    <select
                      value={slotDay}
                      onChange={(e) => setSlotDay(e.target.value as DayOfWeek)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Slot Type
                    </label>
                    <select
                      value={slotType}
                      onChange={(e) => setSlotType(e.target.value as SlotType)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="lecture">Lecture</option>
                      <option value="lab">Laboratory (Practical)</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      required
                      value={slotStartTime}
                      onChange={(e) => setSlotStartTime(e.target.value)}
                      placeholder="09:30"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      required
                      value={slotEndTime}
                      onChange={(e) => setSlotEndTime(e.target.value)}
                      placeholder="10:30"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={slotSubjectId}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.short_name} — {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Faculty Instructor
                  </label>
                  <select
                    value={slotFacultyId}
                    onChange={(e) => setSlotFacultyId(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {faculty.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Room / Laboratory Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    placeholder="Room 204 or Turing Lab 3"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSlotModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Slot</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
