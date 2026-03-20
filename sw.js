// Cache version — aggiornato automaticamente ad ogni deploy
const CACHE = 'budget-' + new Date().toISOString().slice(0,10) + '-' + Math.random().toString(36).slice(2,6);

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

// Installa: metti in cache le risorse principali
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting()) // attiva subito senza aspettare
  );
});

// Attiva: elimina tutte le cache vecchie
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // prendi controllo di tutti i tab aperti
  );
});

// Fetch: network-first per HTML (sempre aggiornato), cache-first per assets statici
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Per index.html usa sempre network-first così prende sempre la versione nuova
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request)) // fallback cache se offline
    );
    return;
  }

  // Per tutto il resto: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
