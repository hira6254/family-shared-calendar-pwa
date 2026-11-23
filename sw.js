var CACHE_NAME = 'family-calendar-pwa-v3.4.0';
var ASSETS = [
  '/family-shared-calendar-pwa/',
  '/family-shared-calendar-pwa/index.html',
  '/family-shared-calendar-pwa/manifest.json',
  '/family-shared-calendar-pwa/icon-192.png',
  '/family-shared-calendar-pwa/icon-512.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(k) {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(function(res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
        });
        return res;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
