const CACHE = 'budget-v6';
const ASSETS = [
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

// Installa: metti in cache solo gli asset statici (NON index.html)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting()) // attiva subito, non aspettare che le tab si chiudano
  );
});

// Attiva: elimina tutte le cache vecchie e prendi controllo immediato
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // forza aggiornamento su tutti i tab aperti
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // index.html — sempre network, fallback cache solo se offline
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname === '/budget-app/') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }) // no-store: ignora completamente la cache HTTP
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Asset statici — cache first
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
