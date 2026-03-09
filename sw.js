const CACHE = 'upbit-trader-v2';
const BASE = '/Ap1';
const FILES = [BASE + '/', BASE + '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('upbit.com') ||
      e.request.url.includes('allorigins') ||
      e.request.url.includes('corsproxy') ||
      e.request.url.includes('googleapis.com')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match(BASE + '/index.html')))
  );
});
