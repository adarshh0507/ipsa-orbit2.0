'use client';

import { useEffect } from 'react';
import { startInstallCapture } from '@/lib/installPrompt';

export function PwaRegister() {
  useEffect(() => {
    startInstallCapture();

    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // The app still works normally without the service worker.
      });
    }
  }, []);

  return null;
}
