// sw.js / service-worker.js
const CACHE_NAME = 'portal-cache-v51'; // <--- ВЕРСИЯ ИЗМЕНЕНА! Теперь браузер сбросит старый кэш.

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './style-bg-fix.css',
  './animations.css',
  './lecture-methodical.css',
  './api.js',
  './data-global.js',
  './data-0701.js',
  './data-0401.js',
  './data-0201.js',
  './data-0202.js',
  './data-mastercam.js',
  './mastercam-practicals.js',
  './g_code_full.html',
  './data-material.js',
  './data-pfi.js',
  './data-safety.js',
  './data-extra.js',
  './info.js',
  './links.js',
  './tests-extra.js',
  './course-assessment-advanced.js',
  './hard-questions.js',
  './challenge-questions.js',
  './questions-setup.js',
  './questions-mdk.js',
  './questions-anime.js',
  './questions-games.js',
  './questions-logic.js',
  './questions-extra.js',
  './app.js',
  './app-offline-login.js',
  './media-fix.js',
  './portal-fixes.js',
  './mdk-upgrade.js',
  './portal-v2.js',
  './stage2-portal.js',
  './assistant.js',
  './assistant-genz.js',
  './easter-eggs.js',
  './exam-engine.js',
  './exam_0701.js',
  './exam_0401.js',
  './exam_0201.js',
  './exam_0202.js',
  './final.js',
  './games.js',
  './network-detective.js',
  './party-games.js',
  './party-games-fix.js',
  './workbooks.js',
  './portal-genz.js',
  './certificate-supplement.js',
  './avatar-studio.js',
  './journal.js',
  './rating.js',
  './rating-subjects.js',
  './reports.js',
  './schedule.js',
  './shop.js',
  './admin.js',
  './extra.js',
  './portal-final.js',
  './course-admin.js',
  './course-announcements.js',
  './access.js',
  './account.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэширование статических ресурсов версии v46');
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

  if (url.hostname.includes('script.google.com') || request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request).then((networkResponse) => {
      // Сначала пробуем сеть (Network First), чтобы всегда получать свежие данные
      if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    }).catch(() => {
      // Если сети нет, берем из кэша
      return caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Нет сети', { status: 503 });
      });
    })
  );
});