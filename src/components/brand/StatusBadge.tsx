'use client';

import React from 'react';
import { Section, Priority, ResourceType, SlotType } from '@/types';
import { 
  FileText, 
  Presentation, 
  FileSpreadsheet, 
  FileCheck, 
  Image as ImageIcon, 
  Link2, 
  HelpCircle,
  FlaskConical,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export const SectionBadge: React.FC<{ section: Section | 'Both'; className?: string }> = ({ section, className = '' }) => {
  if (section === 'DS-1') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        DS-1
      </span>
    );
  }
  if (section === 'DS-2') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-violet-950/80 text-violet-300 border border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.25)] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        DS-2
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
      DS-1 & DS-2
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority; className?: string }> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          Urgent
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)] ${className}`}>
          High Priority
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-slate-800/80 text-slate-400 border border-slate-700/50 ${className}`}>
          Normal
        </span>
      );
  }
};

export const ResourceTypeBadge: React.FC<{ type: ResourceType; className?: string }> = ({ type, className = '' }) => {
  switch (type) {
    case 'pdf_notes':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-950/50 text-red-300 border border-red-800/40 ${className}`}>
          <FileText className="w-3.5 h-3.5 text-red-400" />
          PDF Notes
        </span>
      );
    case 'ppt':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-950/50 text-amber-300 border border-amber-800/40 ${className}`}>
          <Presentation className="w-3.5 h-3.5 text-amber-400" />
          PPT Slides
        </span>
      );
    case 'doc':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-950/50 text-blue-300 border border-blue-800/40 ${className}`}>
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          DOC / Word
        </span>
      );
    case 'excel':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 ${className}`}>
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          Excel Sheet
        </span>
      );
    case 'pyq':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-purple-950/50 text-purple-300 border border-purple-800/40 ${className}`}>
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          PYQ Papers
        </span>
      );
    case 'practical_file':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-cyan-950/50 text-cyan-300 border border-cyan-800/40 ${className}`}>
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          Practical File
        </span>
      );
    case 'image':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-pink-950/50 text-pink-300 border border-pink-800/40 ${className}`}>
          <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
          Image
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
          <Link2 className="w-3.5 h-3.5 text-slate-400" />
          Reference
        </span>
      );
  }
};

export const SlotTypeBadge: React.FC<{ type: SlotType; className?: string }> = ({ type, className = '' }) => {
  switch (type) {
    case 'lab':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 ${className}`}>
          <FlaskConical className="w-3 h-3 text-emerald-400" />
          Lab Session
        </span>
      );
    case 'tutorial':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-amber-950/60 text-amber-400 border border-amber-500/30 ${className}`}>
          <GraduationCap className="w-3 h-3 text-amber-400" />
          Tutorial
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 ${className}`}>
          <BookOpen className="w-3 h-3 text-cyan-400" />
          Lecture
        </span>
      );
  }
};
