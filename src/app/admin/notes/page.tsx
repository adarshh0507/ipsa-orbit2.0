'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { orbitStore } from '@/lib/store';
import { Resource, ResourceType, Section } from '@/types';
import { ResourceTypeBadge, SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  X, 
  UploadCloud, 
  FileText, 
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminNotesManager() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const allResources = orbitStore.getResources();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || 'sub-la');
  const [formFacultyId, setFormFacultyId] = useState(faculty[0]?.id || 'fac-reena-joshi');
  const [formSection, setFormSection] = useState<Section | 'Both'>('Both');
  const [formType, setFormType] = useState<ResourceType>('pdf_notes');
  const [formFileName, setFormFileName] = useState('');
  const [formFileSize, setFormFileSize] = useState('3.8 MB');
  const [formUnit, setFormUnit] = useState('Unit 1');
  const [formIsPublished, setFormIsPublished] = useState(true);

  const openAddModal = () => {
    setEditingResource(null);
    setFormTitle('');
    setFormDescription('');
    setFormSubjectId(subjects[0]?.id || 'sub-la');
    setFormFacultyId(faculty[0]?.id || 'fac-reena-joshi');
    setFormSection('Both');
    setFormType('pdf_notes');
    setFormFileName('');
    setFormFileSize('3.5 MB');
    setFormUnit('Unit 1');
    setFormIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setFormTitle(res.title);
    setFormDescription(res.description || '');
    setFormSubjectId(res.subject_id);
    setFormFacultyId(res.faculty_id);
    setFormSection(res.section);
    setFormType(res.resource_type);
    setFormFileName(res.file_name);
    setFormFileSize(res.file_size || '3.5 MB');
    setFormUnit(res.unit_or_module || 'Unit 1');
    setFormIsPublished(res.is_published);
    setModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFileName = formFileName.trim() || `${formTitle.replace(/\s+/g, '_').slice(0, 24)}.${formType === 'ppt' ? 'pptx' : 'pdf'}`;

    if (editingResource) {
      orbitStore.updateResource({
        ...editingResource,
        title: formTitle,
        description: formDescription,
        subject_id: formSubjectId,
        faculty_id: formFacultyId,
        section: formSection,
        resource_type: formType,
        file_name: finalFileName,
        file_size: formFileSize,
        unit_or_module: formUnit,
        is_published: formIsPublished
      });
    } else {
      orbitStore.addResource({
        title: formTitle,
        description: formDescription,
        subject_id: formSubjectId,
        faculty_id: formFacultyId,
        section: formSection,
        resource_type: formType,
        file_url: '#',
        file_name: finalFileName,
        file_size: formFileSize,
        file_ext: formType === 'ppt' ? 'pptx' : 'pdf',
        is_published: formIsPublished,
        unit_or_module: formUnit
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this resource permanently from Orbit?')) {
      orbitStore.deleteResource(id);
    }
  };

  const togglePublish = (res: Resource) => {
    orbitStore.updateResource({
      ...res,
      is_published: !res.is_published
    });
  };

  const filteredResources = allResources.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.file_name.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl font-black text-white">Notes & Resource Manager</h1>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Upload, edit, and publish lecture notes, PPT decks, and question banks for DS-1 and DS-2.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Resource</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search uploaded materials by title or filename..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Resources Table */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-4">Title & File</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Target Section</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredResources.map((res) => {
                  const sub = subjects.find((s) => s.id === res.subject_id);
                  const fac = faculty.find((f) => f.id === res.faculty_id);

                  return (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-start gap-2.5">
                          <ResourceTypeBadge type={res.resource_type} />
                          <div>
                            <p className="font-bold text-white max-w-sm truncate">{res.title}</p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{res.file_name} ({res.file_size})</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-cyan-300">
                        {sub?.short_name || 'Subject'}
                      </td>
                      <td className="p-4 text-slate-300">
                        {fac?.name || 'Faculty'}
                      </td>
                      <td className="p-4">
                        <SectionBadge section={res.section} />
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublish(res)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 transition-colors ${
                            res.is_published
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                          }`}
                        >
                          {res.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{res.is_published ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(res)}
                            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(res.id)}
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

        {/* Resource Upload / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  {editingResource ? 'Edit Academic Resource' : 'Upload Syllabus Resource'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveResource} className="space-y-4 my-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. PPS Unit 2: Pointers and Memory Architecture"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={formSubjectId}
                      onChange={(e) => setFormSubjectId(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.short_name} — {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Faculty Author
                    </label>
                    <select
                      value={formFacultyId}
                      onChange={(e) => setFormFacultyId(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Section
                    </label>
                    <select
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value as Section | 'Both')}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Both">Both (DS-1 & DS-2)</option>
                      <option value="DS-1">Section DS-1 Only</option>
                      <option value="DS-2">Section DS-2 Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Resource Format
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as ResourceType)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="pdf_notes">PDF Lecture Notes</option>
                      <option value="ppt">PPT Slides Deck</option>
                      <option value="pyq">Previous Year Questions (PYQ)</option>
                      <option value="practical_file">Practical / Drawing File</option>
                      <option value="doc">Word / DOCX Document</option>
                      <option value="excel">Excel Sheet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Module / Unit Reference
                    </label>
                    <input
                      type="text"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      placeholder="e.g. Unit 2"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      File Size
                    </label>
                    <input
                      type="text"
                      value={formFileSize}
                      onChange={(e) => setFormFileSize(e.target.value)}
                      placeholder="e.g. 4.2 MB"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Filename
                  </label>
                  <input
                    type="text"
                    value={formFileName}
                    onChange={(e) => setFormFileName(e.target.value)}
                    placeholder="PPS_Unit2_Pointers.pdf"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description & Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detailed topics covered in this material..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pubCheck"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                  />
                  <label htmlFor="pubCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Publish immediately to student library
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Resource</span>
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
