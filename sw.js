/* sw.js — версия кэша увеличена, чтобы браузер подхватил новые app.js, data-0401.js, exam_0401.js */

const CACHE = 'mdk0701-v206';

const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/data-0401.js',
  '/exam_0401.js',
  '/manifest.json'
  // Если у вас есть другие обязательные файлы (иконки, шрифты, доп. data-*.js),
  // добавьте их сюда.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Кэшируем только успешные ответы
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});