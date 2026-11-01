'use client';

import { useSyncExternalStore } from 'react';

const TICK_MS = 1000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, TICK_MS);
  // Timers slow down in background tabs, so re-check straight away when the student comes back.
  const onVisible = () => {
    if (document.visibilityState === 'visible') onChange();
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    window.clearInterval(id);
    document.removeEventListener('visibilitychange', onVisible);
  };
}

const getSnapshot = () => Math.floor(Date.now() / TICK_MS) * TICK_MS;
const getServerSnapshot = () => 0;

// The current time in milliseconds, refreshed every second. It is 0 on the server and during the
// first client render, so callers show a quiet placeholder until the real clock is available.
export function useNowMs(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const subscribeNever = () => () => {};

// false while rendering on the server, true in the browser. Use it before reading localStorage-backed
// data so the first client render matches the server render.
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}
