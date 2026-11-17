/* ============================================================
   CYBER ARENA — Service Worker (PWA móvil)
   Precache local y fallback de navegación a index.html.
   ============================================================ */
const CACHE = 'ciber-arena-pwa-v9';
const CACHE_PREFIX = 'ciber-arena-pwa-';

const ASSETS = [
  './index.html',
  './manifest.json',
  './estilos.css',
  './script.js',
  './shared/boot.js',
  './data/catalogo.js',
  '../assets/icon.svg',
  '../assets/placeholder.svg',
  './shared/base.css',
  './shared/core.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(ASSETS.map((url) => cache.add(url).catch(() => null)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE && key.indexOf(CACHE_PREFIX) === 0).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && new URL(request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => new Response('', { status: 408 }));
    })
  );
});
