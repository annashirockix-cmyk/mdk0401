const CACHE_NAME = 'mdk-portal-v222';
const ASSETS = [
    './', './index.html', './style.css', './app.js', './api.js', './core.js',
    './data-0701.js', './data-0401.js', './journal.js', './games.js', './shop.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cache) => {
                if (cache !== CACHE_NAME) return caches.delete(cache);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('script.google.com')) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((res) => {
                if (!res || res.status !== 200) return res;
                const clone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return res;
            }).catch(() => {
                if (event.request.mode === 'navigate') return caches.match('./index.html');
            });
        })
    );
});