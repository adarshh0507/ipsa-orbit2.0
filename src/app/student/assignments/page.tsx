'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { Assignment } from '@/types';
import { PriorityBadge, SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { EmptyState } from '@/components/brand/EmptyState';
import { 
  FileCheck2, 
  Clock, 
  Calendar, 
  Download, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  X,
  FileText
} from 'lucide-react';

export default function StudentAssignmentsPage() {
  const { user, section } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const [activeTab, setActiveTab] = useState<'pending' | 'due_soon' | 'completed' | 'all'>('pending');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [submissionModalAssignment, setSubmissionModalAssignment] = useState<Assignment | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionFile, setSubmissionFile] = useState<string | null>(null);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const studentSubmissions = orbitStore.getStudentAssignments().filter((sa) => sa.student_id === (user?.id || 'demo'));

  const allAssignments = orbitStore
    .getAssignments()
    .filter((a) => a.is_published && (a.section === 'Both' || a.section === section));

  // Determine submission status for each assignment
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const filteredAssignments = allAssignments.filter((a) => {
    if (selectedSubject !== 'all' && a.subject_id !== selectedSubject) return false;

    const isSubmitted = studentSubmissions.some((s) => s.assignment_id === a.id && s.status === 'submitted');
    const dueDate = new Date(a.due_date);

    if (activeTab === 'completed') {
      return isSubmitted;
    }
    if (activeTab === 'due_soon') {
      return !isSubmitted && dueDate > now && dueDate <= in48Hours;
    }
    if (activeTab === 'pending') {
      return !isSubmitted;
    }
    return true; // 'all'
  });

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalAssignment) return;

    orbitStore.submitAssignment(
      submissionModalAssignment.id,
      user?.id || 'usr-student-ds1-01',
      submissionNotes,
      submissionFile || 'student_solution.pdf'
    );

    alert(`Successfully submitted assignment: ${submissionModalAssignment.title}!`);
    setSubmissionModalAssignment(null);
    setSubmissionNotes('');
    setSubmissionFile(null);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-black text-white">Assignments & Submissions</h1>
              <SectionBadge section={section} />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Track course problem sets, practical drawing sheets, and code submissions with automatic deadline alerts.
            </p>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.short_name} — {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'pending'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Tasks ({allAssignments.filter((a) => !studentSubmissions.some((s) => s.assignment_id === a.id)).length})
          </button>
          <button
            onClick={() => setActiveTab('due_soon')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'due_soon'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Due Soon (Next 48h)</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed ({studentSubmissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Orbit Tasks
          </button>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          <EmptyState
            type="assignments"
            title="No Assignments in Orbit"
            description="You have no tasks matching this filter criteria. Everything is currently up to date."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAssignments.map((asg) => {
              const sub = subjects.find((s) => s.id === asg.subject_id);
              const fac = faculty.find((f) => f.id === asg.faculty_id);
              const isSubmitted = studentSubmissions.some((s) => s.assignment_id === asg.id && s.status === 'submitted');
              const dueDateObj = new Date(asg.due_date);
              const isOverdue = dueDateObj < now && !isSubmitted;

              return (
                <GlassCard
                  key={asg.id}
                  glow={isSubmitted ? 'emerald' : isOverdue ? 'none' : 'cyan'}
                  className="p-5 flex flex-col justify-between border border-white/5"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                          {sub?.short_name}
                        </span>
                        <PriorityBadge priority={asg.priority} />
                      </div>
                      <SectionBadge section={asg.section} />
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {asg.description}
                    </p>

                    {/* Metadata Box */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5 text-xs text-slate-400 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Faculty Instructor:</span>
                        <span className="font-semibold text-slate-200">{fac?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Max Evaluation Marks:</span>
                        <span className="font-mono text-cyan-300">{asg.max_marks || 20} Marks</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Submission Deadline:</span>
                        <span className={`font-semibold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                          {dueDateObj.toLocaleDateString()} at {dueDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Attachment preview if provided */}
                    {asg.attachment_name && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs mb-4">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="truncate text-slate-300">{asg.attachment_name}</span>
                        </div>
                        <button
                          onClick={() => alert(`Downloading problem sheet: ${asg.attachment_name}`)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold ml-2 flex-shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submission Action */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Submitted</span>
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>Deadline Past</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Awaiting Submission</span>
                      )}
                    </div>

                    <button
                      onClick={() => setSubmissionModalAssignment(asg)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSubmitted
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isSubmitted ? 'Resubmit Solution' : 'Submit Assignment'}</span>
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Submission Modal */}
        {submissionModalAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white truncate max-w-md">
                    Submit: {submissionModalAssignment.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSubmissionModalAssignment(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAssignment} className="space-y-4 my-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Upload Solution File (PDF, DOCX, Code, or ZIP)
                  </label>
                  <div className="p-6 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/60 hover:border-emerald-500/50 text-center transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-semibold">
                      {submissionFile ? submissionFile : 'Drag & drop solution file or click to browse'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepted: .pdf, .c, .py, .docx, .zip (Max 25MB)</p>
                    <input
                      type="file"
                      className="hidden"
                      id="asg-file-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSubmissionFile(file.name);
                      }}
                    />
                    <label
                      htmlFor="asg-file-input"
                      className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-cyan-300 font-semibold cursor-pointer hover:bg-slate-700"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Submission Comments / Github Link / Text Solution
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Enter any notes for faculty, execution steps, or Github repository link..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSubmissionModalAssignment(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Submit</span>
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
