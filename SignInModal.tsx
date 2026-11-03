'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SignInPanel } from '@/components/landing/SignInPanel';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onOtherOptions: () => void;
}

export function SignInModal({ open, onClose, onOtherOptions }: SignInModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to IPSA ORBIT"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="modal-in relative w-full max-w-md rounded-2xl bg-panel-alt">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close sign in"
          className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel text-ink hover:bg-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <SignInPanel onOtherOptions={onOtherOptions} />
      </div>
    </div>
  );
}
