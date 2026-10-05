'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { orbitStore } from '@/lib/store';
import { Assignment, Priority, Section } from '@/types';
import { PriorityBadge, SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { 
  FileCheck2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  X, 
  Calendar, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function AdminAssignmentsManager() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const allAssignments = orbitStore.getAssignments();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub-pps');
  const [facultyId, setFacultyId] = useState(faculty[0]?.id || 'fac-amit-shrivastava');
  const [section, setSection] = useState<Section | 'Both'>('Both');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [maxMarks, setMaxMarks] = useState(20);
  const [attachmentName, setAttachmentName] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const openAddModal = () => {
    setEditingAssignment(null);
    setTitle('');
    setDescription('');
    setSubjectId(subjects[0]?.id || 'sub-pps');
    setFacultyId(faculty[0]?.id || 'fac-amit-shrivastava');
    setSection('Both');
    const future = new Date();
    future.setDate(future.getDate() + 7);
    setDueDate(future.toISOString().slice(0, 16));
    setPriority('normal');
    setMaxMarks(20);
    setAttachmentName('');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (asg: Assignment) => {
    setEditingAssignment(asg);
    setTitle(asg.title);
    setDescription(asg.description);
    setSubjectId(asg.subject_id);
    setFacultyId(asg.faculty_id);
    setSection(asg.section);
    setDueDate(new Date(asg.due_date).toISOString().slice(0, 16));
    setPriority(asg.priority);
    setMaxMarks(asg.max_marks || 20);
    setAttachmentName(asg.attachment_name || '');
    setIsPublished(asg.is_published);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isoDueDate = new Date(dueDate).toISOString();

    if (editingAssignment) {
      orbitStore.updateAssignment({
        ...editingAssignment,
        title,
        description,
        subject_id: subjectId,
        faculty_id: facultyId,
        section,
        due_date: isoDueDate,
        priority,
        max_marks: Number(maxMarks),
        attachment_name: attachmentName.trim() || undefined,
        is_published: isPublished
      });
    } else {
      orbitStore.addAssignment({
        title,
        description,
        subject_id: subjectId,
        faculty_id: facultyId,
        section,
        due_date: isoDueDate,
        priority,
        max_marks: Number(maxMarks),
        attachment_name: attachmentName.trim() || undefined,
        is_published: isPublished
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this assignment permanently?')) {
      orbitStore.deleteAssignment(id);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-black text-white">Assignments Control</h1>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Issue problem sets, practical sheets, coding tasks, and track submission deadlines across sections.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        </div>

        {/* Assignments Table */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-4">Title & Details</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Target Section</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allAssignments.map((asg) => {
                  const sub = subjects.find((s) => s.id === asg.subject_id);
                  const fac = faculty.find((f) => f.id === asg.faculty_id);

                  return (
                    <tr key={asg.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white max-w-sm truncate">{asg.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{asg.description}</p>
                      </td>
                      <td className="p-4 font-semibold text-cyan-300">
                        {sub?.short_name}
                      </td>
                      <td className="p-4">
                        <SectionBadge section={asg.section} />
                      </td>
                      <td className="p-4">
                        <PriorityBadge priority={asg.priority} />
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-300">
                        {new Date(asg.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(asg)}
                            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(asg.id)}
                            className="p-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/40 text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  {editingAssignment ? 'Edit Course Assignment' : 'Create New Assignment'}
                </h3>
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
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. PPS Assignment 3: Structs and File Handling in C"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.short_name} — {s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Instructor
                    </label>
                    <select
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Section
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value as Section | 'Both')}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Both">Both (DS-1 & DS-2)</option>
                      <option value="DS-1">DS-1 Only</option>
                      <option value="DS-2">DS-2 Only</option>
                    </select>
                  </div>

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
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Submission Due Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Attached Problem Sheet
                    </label>
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="e.g. PPS_Problem_Sheet_3.pdf"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assignment Description & Criteria
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instructions, problem statement, and code formatting rules..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Assignment</span>
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
