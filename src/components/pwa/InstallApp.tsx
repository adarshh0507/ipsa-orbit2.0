'use client';

import React, { useSyncExternalStore } from 'react';
import { Download, Share } from 'lucide-react';
import { canInstall, promptInstall, subscribeInstall } from '@/lib/installPrompt';

const noopSubscribe = () => () => {};
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export function InstallApp() {
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  const standalone = useSyncExternalStore(noopSubscribe, isStandalone, () => false);
  const ios = useSyncExternalStore(noopSubscribe, isIos, () => false);

  // Already installed, or this browser cannot install: show nothing.
  if (standalone) return null;

  if (installable) {
    return (
      <button
        type="button"
        onClick={() => void promptInstall()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent-strong px-5 py-3 text-sm font-bold text-on-accent hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Install IPSA ORBIT on this device
      </button>
    );
  }

  if (ios) {
    return (
      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-panel-alt p-4 text-sm text-ink-soft">
        <Share className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>To install on iPhone: tap the Share button in Safari, then choose Add to Home Screen.</span>
      </p>
    );
  }

  return null;
}
