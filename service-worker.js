// ✅ Version bump here
const CACHE_NAME = 'adex-cache-v4';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/ADEXsign.html',
  '/ADEXlogin.html',
  '/V3ADEX.html',
  '/V3ADEX.css',
  '/V3ADEX.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ✅ Install: cache all required assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing new version...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// ✅ Activate: remove old caches immediately
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating and cleaning old caches...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  return self.clients.claim();
});

// ✅ Fetch: Offline-first approach
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cachedResponse);
      return cachedResponse || fetchPromise;
    })
  );
});
