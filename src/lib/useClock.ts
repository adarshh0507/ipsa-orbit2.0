import { useSyncExternalStore } from 'react';

// A tiny shared clock. The number changes every 15 seconds, so anything that depends on
// "now" (live class, countdowns, "new this week") stays current without refreshing.
export const TICK_MS = 15_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, TICK_MS);
  return () => window.clearInterval(id);
}

const getSnapshot = () => Math.floor(Date.now() / TICK_MS);
// 0 means "browser clock not available yet" (server render).
const getServerSnapshot = () => 0;

export function useClockTick(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
