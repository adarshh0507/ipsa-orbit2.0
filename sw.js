// IPSA ORBIT service worker: network first, so a new deploy is always picked up.
// If the network fails (no signal in class), the last copy of a page is shown instead.
const CACHE = 'ipsa-orbit-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch Supabase or Google requests
  if (url.search.includes('code=')) return; // sign-in return trips are never cached

  const cacheable =
    req.mode === 'navigate' ||
    url.pathname.startsWith('/_next/static') ||
    /\.(png|jpg|jpeg|svg|ico|webp|woff2?)$/.test(url.pathname);

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && cacheable) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('/')))
  );
});
