// service-worker.js
const CACHE_NAME = 'portal-cache-v7'; // <--- ВЕРСИЯ ОБНОВЛЕНА ДО v5

const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './api.js',
  './style.css',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэширование ресурсов v7');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Удаление старого кэша:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Игнорируем Google API и не-GET запросы
  if (url.hostname.includes('script.google.com') || request.method !== 'GET') {
    return;
  }

  // Сначала пробуем загрузить из сети
  event.respondWith(
    fetch(request).then((networkResponse) => {
      // Если сеть вернула ошибку 503 (GitHub лежит), просто отдаем её
      if (!networkResponse.ok) return networkResponse;

      if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    }).catch(() => {
      // Если сети нет вообще, берем из кэша
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Нет сети', { status: 503 });
      });
    })
  );
});
