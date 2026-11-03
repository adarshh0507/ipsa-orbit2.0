'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

interface PopupProps {
  title: string;
  onClose: () => void;
  footerHref?: string;
  footerLabel?: string;
  children: React.ReactNode;
}

export function Popup({ title, onClose, footerHref, footerLabel, children }: PopupProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="modal-in relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-panel">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footerHref && (
          <div className="border-t border-white/10 px-5 py-3">
            <Link href={footerHref} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:text-sky-200">
              <span>{footerLabel || 'See all'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
