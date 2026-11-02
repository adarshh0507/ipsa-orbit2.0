'use client';

import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FilePickFieldProps {
  label?: string;
  fileName: string;
  fileSize?: string;
  onPick: (file: File | null) => void;
  accept?: string;
}

// File chooser used in the admin forms.
// Until Supabase Storage is connected only the file name and size are saved (the file itself is not stored).
export function FilePickField({
  label = 'Attach a file',
  fileName,
  fileSize,
  onPick,
  accept = '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,.zip,.png,.jpg,.jpeg',
}: FilePickFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-300">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900 px-3 py-3 text-left hover:border-amber-500"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">{fileName || 'Tap to choose a file'}</span>
          <span className="block text-[11px] text-slate-400">
            {fileName ? fileSize || 'Tap to choose a different file' : 'PDF, PPT, DOC, Excel, ZIP or image'}
          </span>
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      {!isSupabaseConfigured && (
        <p className="mt-1.5 text-[11px] leading-snug text-amber-400">
          Storage is not connected yet, so only the file name and size are saved for now. The real file will upload once
          Supabase Storage is connected.
        </p>
      )}
    </div>
  );
}
