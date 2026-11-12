const CACHE_NAME = 'cyber-arena-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './estilos.css',
  './script.js',
  './manifest.json',
  './data/catalogo.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});