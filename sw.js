/* Dream Tour PWA service worker — safe static-shell caching.
   Dynamic Firebase/auth/payment/API requests are never cached. */
const VERSION = 'thor-tour-main-v3';
const SHELL = [
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];
const CACHE_PREFIX = 'thor-tour-main-';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept Firebase, auth, payment, or backend endpoints.
  if (/\/(api|auth|payment|payments|deposit|withdraw|firebase)(\/|$)/i.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(VERSION).then(cache => cache.put('./index.html', copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache only known static files; do not cache arbitrary data endpoints.
  if (/\.(?:css|js|mjs|png|jpg|jpeg|webp|svg|ico|woff2?|ttf|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
