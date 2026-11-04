// Holds the browser's "install this app" offer. The browser sends it once, early,
// so it is captured here (always mounted) and used later by the Install button.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let started = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function startInstallCapture() {
  if (started || typeof window === 'undefined') return;
  started = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export function subscribeInstall(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export const canInstall = () => deferred !== null;

export async function promptInstall() {
  if (!deferred) return;
  await deferred.prompt();
  await deferred.userChoice;
  deferred = null;
  notify();
}
