'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { orbitStore } from '@/lib/store';
import { Resource, ResourceType } from '@/types';
import { ResourceTypeBadge, SectionBadge } from '@/components/brand/StatusBadge';
import { GlassCard } from '@/components/brand/GlassCard';
import { EmptyState } from '@/components/brand/EmptyState';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  X,
  FileCheck,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';

export default function NotesPage() {
  const { section } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return orbitStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>(section);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const subjects = orbitStore.getSubjects();
  const faculty = orbitStore.getFaculty();
  const allResources = orbitStore.getResources();

  // Filter resources
  const filteredResources = allResources.filter((r) => {
    if (!r.is_published) return false;

    // Section filter
    if (selectedSection !== 'all') {
      if (r.section !== 'Both' && r.section !== selectedSection) return false;
    }

    // Subject filter
    if (selectedSubject !== 'all' && r.subject_id !== selectedSubject) {
      return false;
    }

    // Type filter
    if (selectedType !== 'all' && r.resource_type !== selectedType) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sub = subjects.find((s) => s.id === r.subject_id);
      const fac = faculty.find((f) => f.id === r.faculty_id);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q) || false;
      const matchSub = sub?.name.toLowerCase().includes(q) || sub?.short_name.toLowerCase().includes(q) || false;
      const matchFac = fac?.name.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchSub || matchFac;
    }

    return true;
  });

  const resourceTypes: { label: string; value: ResourceType | 'all' }[] = [
    { label: 'All Formats', value: 'all' },
    { label: 'PDF Notes', value: 'pdf_notes' },
    { label: 'PPT Slides', value: 'ppt' },
    { label: 'PYQ Papers', value: 'pyq' },
    { label: 'Practical Files', value: 'practical_file' },
    { label: 'DOC / Excel', value: 'doc' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl font-black text-white">Notes & Resource Library</h1>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Search and download syllabus-verified materials, lecture slides, and previous year exam questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total in Orbit:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {filteredResources.length} Materials
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or faculty name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.short_name} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Sections (DS-1 & DS-2)</option>
              <option value="DS-1">Section DS-1 Only</option>
              <option value="DS-2">Section DS-2 Only</option>
            </select>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {resourceTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedType === t.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        {filteredResources.length === 0 ? (
          <EmptyState
            type="notes"
            title="No Resources Found"
            description="No academic materials matched your active filter settings. Try clearing your search query or selecting All Subjects."
            actionText="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSubject('all');
              setSelectedType('all');
              setSelectedSection('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => {
              const sub = subjects.find((s) => s.id === res.subject_id);
              const fac = faculty.find((f) => f.id === res.faculty_id);

              return (
                <GlassCard
                  key={res.id}
                  glow="cyan"
                  className="p-5 flex flex-col justify-between border border-white/5"
                >
                  <div>
                    {/* Top Row: Format & Section Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <ResourceTypeBadge type={res.resource_type} />
                      <SectionBadge section={res.section} />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug">
                      {res.title}
                    </h3>

                    {/* Description */}
                    {res.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {res.description}
                      </p>
                    )}

                    {/* Metadata Pill Box */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1 text-[11px] text-slate-300 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Subject:</span>
                        <span className="font-semibold text-cyan-300">{sub?.name} ({sub?.short_name})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Faculty:</span>
                        <span className="font-medium text-slate-300">{fac?.name || 'Academic Cell'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">File Size:</span>
                        <span className="font-mono text-slate-400">{res.file_size || '3.5 MB'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {res.download_count} downloads
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewResource(res)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          orbitStore.incrementDownload(res.id);
                          alert(`Initiated download for: ${res.file_name}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Document Preview Modal */}
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ResourceTypeBadge type={previewResource.resource_type} />
                  <h3 className="text-sm font-bold text-white truncate max-w-md">
                    {previewResource.file_name}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Reader Frame Simulation */}
              <div className="my-6 p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">{previewResource.title}</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {previewResource.description || 'Verified course document for IPS Academy First-Year B.Tech Data Science.'}
                </p>

                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300">
                  <span>Target: {previewResource.section}</span>
                  <span>•</span>
                  <span>Size: {previewResource.file_size || 'PDF'}</span>
                  <span>•</span>
                  <span>Status: Verified by Department</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                >
                  Close Viewer
                </button>
                <button
                  onClick={() => {
                    orbitStore.incrementDownload(previewResource.id);
                    alert(`Downloading: ${previewResource.file_name}`);
                    setPreviewResource(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
