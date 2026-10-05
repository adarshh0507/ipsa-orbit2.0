'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { orbitStore } from '@/lib/store';
import { Announcement, AnnouncementCategory, Priority, Section } from '@/types';
import { PriorityBadge, SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Pin, 
  CheckCircle2, 
  X, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function AdminAnnouncementsManager() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const allAnnouncements = orbitStore.getAnnouncements();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('general');
  const [targetSection, setTargetSection] = useState<Section | 'Both'>('Both');
  const [priority, setPriority] = useState<Priority>('normal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attachmentName, setAttachmentName] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const openAddModal = () => {
    setEditingAnnouncement(null);
    setTitle('');
    setDescription('');
    setCategory('general');
    setTargetSection('Both');
    setPriority('normal');
    setDate(new Date().toISOString().split('T')[0]);
    setAttachmentName('');
    setIsPinned(false);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnouncement) {
      orbitStore.deleteAnnouncement(editingAnnouncement.id);
    }

    orbitStore.addAnnouncement({
      title,
      description,
      category,
      target_section: targetSection,
      priority,
      date,
      attachment_name: attachmentName.trim() || undefined,
      is_pinned: isPinned
    });

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      orbitStore.deleteAnnouncement(id);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl font-black text-white">Announcements & Bulletins</h1>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Broadcast official academic notices, exam circulars, and urgent classroom advisories to DS-1 & DS-2.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Notice</span>
          </button>
        </div>

        {/* Notices Table */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-4">Title & Content</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Target Section</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        {ann.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-bold text-white max-w-sm truncate">{ann.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ann.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono uppercase text-amber-400">
                      {ann.category.replace('_', ' ')}
                    </td>
                    <td className="p-4">
                      <SectionBadge section={ann.target_section} />
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={ann.priority} />
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-300">
                      {ann.date}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="p-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/40 text-rose-400"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-amber-500/30 shadow-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Broadcast New Notice</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 my-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Schedule for Mid-Semester Exam"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Notice Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="general">General Notice</option>
                      <option value="class_update">Class Update</option>
                      <option value="exam">Exam Schedule</option>
                      <option value="urgent">Urgent Alert</option>
                      <option value="assignment_reminder">Assignment Reminder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value as Section | 'Both')}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Both">Both (DS-1 & DS-2)</option>
                      <option value="DS-1">Section DS-1 Only</option>
                      <option value="DS-2">Section DS-2 Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Date of Circular
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notice Description & Content *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Full circular text, guidelines, dates, and instructions..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinCheck"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500"
                  />
                  <label htmlFor="pinCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Pin notice to top of student dashboard
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Broadcast Notice</span>
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
