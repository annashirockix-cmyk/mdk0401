/* sw.js — Service Worker для кэширования учебного портала МДК */

// ВАЖНО: Версия обновлена до v211. Это заставит браузер скачать новые файлы.
const CACHE_NAME = 'mdk-portal-v211';

const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './api.js',
    './data-0401.js',
    './data-0701.js',
    './data-0201.js',
    './data-0202.js',
    './data-global.js'
    // Остальные скрипты (игры, магазин, журнал) закэшируются автоматически
    // при первом открытии соответствующих вкладок.
];

// Установка: кэшируем основные файлы
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Принудительно активируем новый SW
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Активация: удаляем старый кэш (v208, v209 и т.д.)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Удаление старого кэша:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
    // Работаем только с GET-запросами
    if (event.request.method !== 'GET') return;
    
    // НЕ КЭШИРУЕМ запросы к Google Apps Script (база данных)
    if (event.request.url.includes('script.google.com')) {
        return; // Пропускаем запрос напрямую в сеть
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Если файл есть в кэше, отдаем его
            if (cachedResponse) {
                // Параллельно в фоне проверяем обновления в сети (Stale-While-Revalidate)
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
                    }
                }).catch(() => { /* Игнорируем ошибки сети в фоне */ });
                
                return cachedResponse;
            }

            // Если файла нет в кэше — качаем из сети и сохраняем
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Если сеть упала и это запрос страницы — отдаем index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});