const CACHE = "mdk0701-v212";

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
          console.warn("[SW] Ошибка кэширования (пропускаем):", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => {
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  // Видео, PDF и презентации не кэшируем: Range/206 ломает воспроизведение
  if (/\.(mp4|webm|pdf|pptx|docx|zip)$/i.test(url.pathname)) return;
  if (req.headers.get("range")) return;

  if (
    url.hostname.includes("script.google.com") ||
    url.hostname.includes("cdn.jsdelivr.net") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    return;
  }

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      return hit || fetch(req).then((res) => {
        if (res.ok && res.status === 200 && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => {
        return new Response("Network error", { status: 408, headers: { "Content-Type": "text/plain" } });
      });
    })
  );
});
