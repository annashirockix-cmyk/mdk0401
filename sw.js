// sw.js
const CACHE = "mdk0701-v214"; // Версия обновлена для сброса старого кэша

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./animations.css",
  "./lecture-methodical.css",
  "./manifest.json",
  "./data-0701.js",
  "./data-0401.js",
  "./data-0201.js",
  "./data-0202.js",
  "./data-mastercam.js",
  "./data-extra.js",
  "./data-global.js",
  "./app.js",
  "./api.js",
  "./final.js",
  "./journal.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => {
        return cache.addAll(ASSETS).catch((err) => {
          console.warn("[SW] Ошибка кэширования статики:", err);
        });
      })
      .then(() => self.skipWaiting()) // Активируем новый SW сразу
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => {
          console.log("[SW] Удаление старого кэша:", key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // 1. Пропускаем всё, что не GET
  if (req.method !== "GET") return;

  // 2. КРИТИЧЕСКИ ВАЖНО: НЕ кэшируем видео, PDF, PPTX, DOCX и архивы
  // Иначе браузер пытается отдать обрезанный ответ (Range) и видео ломается
  if (/\.(mp4|webm|pdf|pptx|docx|zip)$/i.test(url.pathname)) return;
  
  // 3. Не перехватываем запросы с заголовком Range (загрузка потокового видео)
  if (req.headers.get("range")) return;

  // 4. Не кэшируем внешние API (Google Apps Script и т.д.)
  if (
    url.hostname.includes("script.google.com") ||
    url.hostname.includes("cdn.jsdelivr.net") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    return;
  }

  // 5. Для HTML-страниц используем Network-First (чтобы всегда подтягивать свежий код)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // 6. Для скриптов и стилей используем Stale-While-Revalidate
  e.respondWith(
    caches.match(req).then((hit) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res.ok && res.status === 200 && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => {
        return new Response("Network error", { status: 408, headers: { "Content-Type": "text/plain" } });
      });
      
      return hit || fetchPromise;
    })
  );
});