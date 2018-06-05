var dataCacheName = 'checkpointdata-v1';
var cacheName = ' checkpoint-cache1';
var filesToCache = [
  
  './index.html',
  './ellastyle.css',
  // './jq.js',
   './app.js',
   './map.html',
   './styles.css',
  './weather.png',
  './settings.png',
  './profile.png',
  './mytrip.png',
	'./mapicon.png',
  './checkin.png' 


];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});



self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});