const CACHE = 'budget-v7';
const STATIC_ASSETS = [
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

// Installa: metti in cache solo gli asset statici
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Attiva: elimina cache vecchie e prendi controllo immediato
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // ── MAI intercettare chiamate API ──────────────────────────
  // Supabase, fetch di dati, POST/PATCH/DELETE → sempre network diretto
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('supabase.in') ||
    e.request.method !== 'GET'
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // ── index.html → network-first, fallback cache offline ─────
  if (
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('/budget-app/')
  ) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(resp => {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // ── Asset statici (Chart.js, manifest) → cache-first ───────
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        return resp;
      });
    })
  );
});
