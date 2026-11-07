// sw.js / service-worker.js
const CACHE_NAME = 'portal-cache-v191'; // Добавлен контроль событий попыток, банк вопросов и запись на дополнительные занятия.

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './style-bg-fix.css',
  './animations.css',
  './lecture-methodical.css',
  './portal-ux.css',
  './api.js',
  './data-global.js',
  './data-0701.js',
  './gcode-reference.js',
  './data-0401.js',
  './data-0201.js',
  './data-0202.js',
  './data-mastercam.js',
  './mastercam-practicals.js',
  './g_code_full.html',
  './data-material.js',
  './data-english-basic.js',
  './data-english-technical.js',
  './english-data-global.js',
  './english-course.js',
  './english-assessment-data.js',
  './english-tools.js',
  './flashcard-editor.js',
  './teacher-game.js',
  './data-pfi.js',
  './data-safety.js',
  './safety-accident-lessons.js',
  './safety-document-workshop.js',
  './materials/safety/accident-documents-training.html',
  './data-metrology.js',
  './metrology-advanced.js',
  './metrology-practicals.js',
  './metrology-trainer.js',
  './metrology-virtual-lab.js',
  './metrology-lab-plus.js',
  './metrology-complex-work.js',
  './metrology-analytics.js',
  './materials/metrology/lab-measurement-protocol.html',
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
  './subject-tutor.js',
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
  './network-party-games.js',
  './coop-detective.js',
  './games-ui-enhance.js',
  './games-visual.css',
  './room-visual.css',
  './workbook-editorial.js',
  './workbooks.js',
  './portal-genz.js',
  './home-cleanup.js',
  './certificate-supplement.js',
  './avatar-studio.js',
  './reward-collection.js',
  './rank-system.js',
  './team-league.js',
  './learning-museum.js',
  './museum-curator.js',
  './portal-ux.js',
  './journal.js',
  './rating.js',
  './rating-subjects.js',
  './reports.js',
  './teacher-tasks.js',
  './teacher-dashboard.js',
  './student-progress.js',
  './learning-path.js',
  './learning-missions.js',
  './seasonal-events.js',
  './portfolio.js',
  './simulators.js',
  './materials-simulator.js',
  './machining-simulator.js',
  './schedule.js',
  './shop.js',
  './admin.js',
  './extra.js',
  './portal-final.js',
  './course-admin.js',
  './teacher-controls.js',
  './proctor-monitor.js',
  './course-announcements.js',
  './access.js',
  './account.js',
  './assets/certificates/backgrounds/1.png',
  './assets/certificates/backgrounds/2.png',
  './assets/certificates/backgrounds/3.png',
  './assets/certificates/backgrounds/4.png',
  './assets/certificates/backgrounds/5.png',
  './assets/certificates/backgrounds/6.png',
  './assets/fonts/ofont.ru_Another Danger.ttf',
  './assets/fonts/ofont.ru_Belepotan.otf',
  './assets/fonts/ofont.ru_Buira.ttf',
  './assets/fonts/ofont.ru_Jun.ttf',
  './assets/fonts/ofont.ru_Kumiko.ttf',
  './assets/fonts/ofont.ru_Minsk (1).ttf',
  './assets/fonts/ofont.ru_Monomakh Unicode.ttf',
  './assets/fonts/ofont.ru_Neoneon.ttf',
  './assets/fonts/ofont.ru_Peter Ivanowitsch.ttf',
  './assets/fonts/ofont.ru_ST-Cherty.ttf',
  './assets/fonts/ofont.ru_Sacramento.ttf',
  './assets/fonts/ofont.ru_Satyr SP.ttf',
  './assets/fonts/ofont.ru_Scumbria.ttf',
  './assets/fonts/ofont.ru_Smooz.ttf',
  './assets/fonts/ofont.ru_TagType.ttf',
  './assets/fonts/ofont.ru_Tiny5.ttf',
  './assets/images/backgrounds/Background 1.png',
  './assets/images/backgrounds/Background 10.png',
  './assets/images/backgrounds/Background 15.png',
  './assets/images/backgrounds/Background 2 (1).png',
  './assets/images/backgrounds/Background 2.png',
  './assets/images/backgrounds/Background 28.png',
  './assets/images/backgrounds/Background 3 (1).png',
  './assets/images/backgrounds/Background 3.png',
  './assets/images/backgrounds/Background 31.png',
  './assets/images/backgrounds/Background 33.png',
  './assets/images/backgrounds/Background 7.png',
  './assets/images/backgrounds/Background 9.png',
  './assets/images/bg-brutal.jpg',
  './assets/images/bg-hyper.jpg',
  './assets/images/bg-matrix-code.jpg',
  './assets/images/bg-space.jpg',
  './assets/images/fig-1-blocks.png',
  './assets/images/fig-10-uchpu.png',
  './assets/images/fig-11-zero-points.png',
  './assets/images/fig-12-w-tokar.png',
  './assets/images/fig-13-w-frez.png',
  './assets/images/fig-14-e-tokar.png',
  './assets/images/fig-15-e-frez.png',
  './assets/images/fig-16-machine.png',
  './assets/images/fig-17-w-mill.png',
  './assets/images/fig-18-zxy.png',
  './assets/images/fig-19-letter-a.png',
  './assets/images/fig-2-coords.png',
  './assets/images/fig-20-letter-mama.png',
  './assets/images/fig-21-flanets.png',
  './assets/images/fig-22-sprut-interface.png',
  './assets/images/fig-23-sprut-project.png',
  './assets/images/fig-24-sprut-tools.png',
  './assets/images/fig-3-3d.png',
  './assets/images/fig-4-right-hand.png',
  './assets/images/fig-5-milling.png',
  './assets/images/fig-6-lathe.png',
  './assets/images/fig-7-lathe-c.png',
  './assets/images/fig-8-ir500.png',
  './assets/images/fig-9-vsf.png',
  './assets/images/file (10).webp',
  './assets/images/icon-arrow.png',
  './assets/images/icon-bag.png',
  './assets/images/icon-cert.png',
  './assets/images/icon-doc.png',
  './assets/images/icon-hourglass.png',
  './assets/images/icon-shield.png',
  './assets/images/id-card-bg.jpg',
  './assets/images/meme-cat.jpg',
  './assets/images/meme-js.jpg',
  './assets/images/meme-python.jpg',
  './assets/images/meme-variables.jpg',
  './assets/images/ui-cyber.jpg',
  './assets/images/ui-frame.jpg',
  './assets/images/ui-hydra.jpg',
  './assets/images/ui-pixel.jpg',
  './assets/images/ui-quest.jpg',
  './assets/images/ui-reds.jpg',
  './assets/images/ui-retro.jpg',
  './assets/images/ui-status.jpg',
  './assets/images/ui-zen.jpg',
  './assets/images/warning-triangle.png'
,
  './assets/fonts/collections/atkinson-hyperlegible/atkinson-hyperlegible-400-italic.woff2',
  './assets/fonts/collections/atkinson-hyperlegible/atkinson-hyperlegible-400-normal.woff2',
  './assets/fonts/collections/atkinson-hyperlegible/atkinson-hyperlegible-700-italic.woff2',
  './assets/fonts/collections/atkinson-hyperlegible/atkinson-hyperlegible-700-normal.woff2',
  './assets/fonts/collections/bricolage-grotesque/bricolage-grotesque_normal_400.ttf',
  './assets/fonts/collections/bricolage-grotesque/bricolage-grotesque_normal_700.ttf',
  './assets/fonts/collections/cooper/cooper-400-italic.woff2',
  './assets/fonts/collections/cooper/cooper-400-normal.woff2',
  './assets/fonts/collections/cooper/cooper-700-italic.woff2',
  './assets/fonts/collections/cooper/cooper-700-normal.woff2',
  './assets/fonts/collections/fonts/inter_normal_400.ttf',
  './assets/fonts/collections/fonts/inter_normal_600.ttf',
  './assets/fonts/collections/fonts/manrope_normal_400.ttf',
  './assets/fonts/collections/fonts/manrope_normal_600.ttf',
  './assets/fonts/collections/libre-caslon-text/libre-caslon-text_italic_400.ttf',
  './assets/fonts/collections/libre-caslon-text/libre-caslon-text_normal_400.ttf',
  './assets/fonts/collections/libre-caslon-text/libre-caslon-text_normal_700.ttf',
  './assets/fonts/collections/libre-caslon/libre-caslon-condensed_normal_400.woff2',
  './assets/fonts/collections/libre-caslon/libre-caslon-condensed_normal_700.woff2',
  './assets/fonts/collections/newsreader/newsreader-400-italic.woff2',
  './assets/fonts/collections/newsreader/newsreader-400-normal.woff2',
  './assets/fonts/collections/newsreader/newsreader-700-italic.woff2',
  './assets/fonts/collections/newsreader/newsreader-700-normal.woff2',
  './assets/fonts/collections/open-sauce-sans/open-sauce-sans_italic_400.ttf',
  './assets/fonts/collections/open-sauce-sans/open-sauce-sans_italic_500.ttf',
  './assets/fonts/collections/open-sauce-sans/open-sauce-sans_normal_400.ttf',
  './assets/fonts/collections/open-sauce-sans/open-sauce-sans_normal_500.ttf',
  './assets/fonts/collections/overpass-mono/overpass-mono_normal_300.ttf',
  './assets/fonts/collections/overpass-mono/overpass-mono_normal_600.ttf',
  './assets/fonts/collections/playwrite-us/playwrite-us-400-italic.ttf',
  './assets/fonts/collections/playwrite-us/playwrite-us-400-normal.ttf',
  './assets/fonts/collections/quattrocento-sans/quattrocento-sans-400-italic.woff2',
  './assets/fonts/collections/quattrocento-sans/quattrocento-sans-400-normal.woff2',
  './assets/fonts/collections/quattrocento-sans/quattrocento-sans-700-italic.woff2',
  './assets/fonts/collections/quattrocento-sans/quattrocento-sans-700-normal.woff2',
  './assets/fonts/collections/sorts-mill-goudy/sorts-mill-goudy-400-italic.woff2',
  './assets/fonts/collections/sorts-mill-goudy/sorts-mill-goudy-400-normal.woff2',
  './assets/fonts/collections/spectral/spectral-400-italic.woff2',
  './assets/fonts/collections/spectral/spectral-400-normal.woff2',
  './assets/fonts/collections/spectral/spectral-600-italic.woff2',
  './assets/fonts/collections/spectral/spectral-600-normal.woff2',
  './assets/fonts/collections/spectral/spectral-700-italic.woff2',
  './assets/fonts/collections/spectral/spectral-700-normal.woff2',
  './assets/fonts/collections/wittgenstein/wittgenstein-400-italic.woff2',
  './assets/fonts/collections/wittgenstein/wittgenstein-400-normal.woff2',
  './assets/fonts/collections/wittgenstein/wittgenstein-700-italic.woff2',
  './assets/fonts/collections/wittgenstein/wittgenstein-700-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэширование статических ресурсов версии v190');
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