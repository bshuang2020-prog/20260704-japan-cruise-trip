const CACHE_NAME = 'kyushu-cruise-offline-v6';
const LOCAL_ASSETS = [
  './', './index.html','./guide/index.html','./guide/before-trip.html','./guide/embarkation.html','./guide/japan-disembark.html','./guide/return-home.html', './offline.js',
  './ship/index.html','./ship/day1.html','./ship/day2.html','./ship/day5.html','./ship/day6.html','./ship/free.html','./ship/family.html','./ship/paid.html',
  './ship/food.html','./ship/night.html','./ship/seaday.html','./ship/floors.html'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
      return response;
    }).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      return cached;
    }))
  );
});
