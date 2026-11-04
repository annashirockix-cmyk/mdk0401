"use strict";
(function () {
  function fixVideos() {
    if (!window.GLOBAL_DATA) window.GLOBAL_DATA = {};
    var titles = {
      1: ["Видеоурок 1: Введение", "Основы ЧПУ"],
      2: ["Видеоурок 2: G-коды", "Разбор команд"],
      3: ["Видеоурок 3: Наладка", "Практические приемы"],
      4: ["Видеоурок 4", "Учебный материал"],
      5: ["Видеоурок 5", "Учебный материал"],
      6: ["Видеоурок 6", "Учебный материал"],
      7: ["Видеоурок 7", "Учебный материал"],
      8: ["Видеоурок 8", "Учебный материал"],
      9: ["Видеоурок 9", "Учебный материал"]
    };
    window.GLOBAL_DATA.videos = [1,2,3,4,5,6,7,8,9].map(function (n) {
      var t = titles[n] || ["Видеоурок " + n, ""];
      return { title: t[0], description: t[1], file: "./video/" + n + ".mp4", external: "" };
    });
  }

  window.ACHIEVEMENTS = [
    { id: "first_login", icon: "🚪", title: "Первый шаг", desc: "Войти в систему" },
    { id: "first_lecture", icon: "📖", title: "Книжный червь", desc: "Изучить лекцию" },
    { id: "first_test", icon: "🧠", title: "Хакер", desc: "Пройти тест" },
    { id: "first_game", icon: "🎮", title: "Геймер", desc: "Сыграть в игру" },
    { id: "gcode_level", icon: "📐", title: "G-кодер", desc: "Пройти уровень в тренажере G-кода" },
    { id: "level_5", icon: "⭐", title: "Опытный", desc: "Достичь 5 уровня" },
    { id: "xp_1000", icon: "💰", title: "Богач", desc: "Накопить 1000 XP" },
    { id: "all_tests_0701", icon: "🏅", title: "Мастер ЧПУ", desc: "Пройти все тесты МДК 07.01" },
    { id: "certificate", icon: "📜", title: "Сертифицирован", desc: "Получить сертификат" },
    { id: "shop_buy", icon: "🛒", title: "Шопоголик", desc: "Купить товар в магазине" },
    { id: "perfect_test", icon: "💯", title: "Отличник", desc: "Сдать тест на 100%" },
    { id: "daily_3", icon: "🔥", title: "Серия", desc: "Заниматься 3 дня подряд" }
  ];

  window.renderAchievementsPage = function () {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = "";
    var crumbs = document.getElementById("crumbs");
    if (crumbs) crumbs.textContent = "Достижения";
    var unlocked = (window.state && window.state.unlockedAchievements) || [];
    var html = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>';
    html += '<section class="hero"><h1>🏆 Достижения</h1>';
    html += '<p style="opacity:.9;">Открыто: <b>' + unlocked.length + '</b> из <b>' + window.ACHIEVEMENTS.length + '</b></p></section>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">';
    window.ACHIEVEMENTS.forEach(function (ach) {
      var isOn = unlocked.indexOf(ach.id) !== -1;
      if (isOn) {
        html += '<div class="module" style="padding:20px;text-align:center;border:1px solid var(--ok);box-shadow:0 0 12px rgba(16,185,129,.25);">';
        html += '<div style="font-size:48px;margin-bottom:10px;">' + ach.icon + '</div>';
        html += '<h4 style="margin:0 0 5px;color:var(--ok);">' + ach.title + '</h4>';
        html += '<p style="font-size:13px;color:var(--muted);margin:0;">' + ach.desc + '</p>';
        html += '<div style="margin-top:10px;font-size:12px;color:var(--ok);">✓ Получено</div></div>';
      } else {
        html += '<div class="module" style="padding:20px;text-align:center;opacity:0.85;filter:grayscale(0.3);position:relative;">';
        html += '<div style="font-size:48px;margin-bottom:10px;position:relative;">' + ach.icon;
        html += '<span style="position:absolute;right:-4px;bottom:-4px;font-size:22px;">🔒</span></div>';
        html += '<h4 style="margin:0 0 5px;color:var(--text);">' + ach.title + '</h4>';
        html += '<p style="font-size:13px;color:var(--muted);margin:0;">' + ach.desc + '</p>';
        html += '<div style="margin-top:10px;font-size:12px;color:var(--muted);">Ещё не получено</div></div>';
      }
    });
    html += "</div>";
    app.innerHTML = html;
  };

  var _origUnlock = window.unlockAchievement;
  window.unlockAchievement = function (id) {
    if (typeof _origUnlock === "function") return _origUnlock(id);
    if (!window.state) return;
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (window.state.unlockedAchievements.indexOf(id) === -1) {
      window.state.unlockedAchievements.push(id);
      if (window.saveStudentData) window.saveStudentData();
      if (window.showToast) window.showToast("🏆 Достижение: " + id, "ok");
    }
  };

  function patchRouter() {
    if (!window.router || window.__routerLinksPatched) return;
    window.__routerLinksPatched = true;
    var orig = window.router;
    window.router = function () {
      var hash = (location.hash || "").slice(1) || "/";
      var parts = hash.split("/").filter(function (p) { return p; });
      var page = parts[0] || "";
      if (page === "links") {
        if (!window.state || (!window.state.student && !window.state.staff)) {
          var overlay = document.getElementById("loginOverlay");
          if (overlay) overlay.style.display = "flex";
          return;
        }
        var overlay2 = document.getElementById("loginOverlay");
        if (overlay2) overlay2.style.display = "none";
        if (typeof window.renderLinksPage === "function") {
          window.renderLinksPage();
        } else {
          renderLinksFallback();
        }
        return;
      }
      return orig.apply(this, arguments);
    };
  }

  function renderLinksFallback() {
    var app = document.getElementById("app");
    if (!app) return;
    var crumbs = document.getElementById("crumbs");
    if (crumbs) crumbs.textContent = "Полезные ссылки";
    var groups = [
      {
        title: "ЧПУ и программирование",
        items: [
          { title: "CNC Cookbook", url: "https://www.cnccookbook.com/", desc: "База знаний по ЧПУ, G-кодам, наладке" },
          { title: "NYC CNC (YouTube)", url: "https://www.youtube.com/@NYCNC", desc: "Практические уроки по ЧПУ и CAM" },
          { title: "Haas Tip of the Day", url: "https://www.haascnc.com/video/tip-of-the-day.html", desc: "Короткие советы по станкам Haas" },
          { title: "Mastercam Learning", url: "https://www.mastercam.com/", desc: "Официальные материалы Mastercam" }
        ]
      },
      {
        title: "Нормативные и учебные",
        items: [
          { title: "ЕСКД / ГОСТ (консультант)", url: "https://www.consultant.ru/", desc: "Поиск стандартов и норм" },
          { title: "ПЛАНЕТА ЧПУ", url: "https://www.youtube.com/results?search_query=%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%D0%B0+%D1%87%D0%BF%D1%83", desc: "Видеокурс по станкам с ЧПУ" }
        ]
      },
      {
        title: "Диагностика и сборка",
        items: [
          { title: "Вибродиагностика подшипников", url: "https://www.youtube.com/results?search_query=%D0%B2%D0%B8%D0%B1%D1%80%D0%BE%D0%B4%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D0%BA%D0%B0+%D0%BF%D0%BE%D0%B4%D1%88%D0%B8%D0%BF%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2", desc: "Практика диагностики" },
          { title: "Сборка подшипникового узла", url: "https://www.youtube.com/results?search_query=%D1%81%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%D0%BF%D0%BE%D0%B4%D1%88%D0%B8%D0%BF%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE+%D1%83%D0%B7%D0%BB%D0%B0", desc: "Наглядный пример сборки" }
        ]
      }
    ];
    var html = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>';
    html += '<section class="hero"><h1>🔗 Полезные ссылки</h1><p>Откроются в новой вкладке</p></section>';
    groups.forEach(function (g) {
      html += '<section class="module"><h3 style="margin-top:0;color:var(--accent);">' + g.title + '</h3>';
      g.items.forEach(function (it) {
        html += '<a href="' + it.url + '" target="_blank" rel="noopener noreferrer" style="display:block;padding:14px;margin:10px 0;background:var(--card-soft);border-radius:8px;text-decoration:none;color:var(--text);border:1px solid var(--border);">';
        html += '<div style="font-weight:bold;color:var(--accent);">' + it.title + ' ↗</div>';
        html += '<div style="font-size:13px;color:var(--muted);margin-top:4px;">' + it.desc + '</div></a>';
      });
      html += "</section>";
    });
    app.innerHTML = html;
  }

  function ensureLinksWork() {
    if (typeof window.renderLinksPage !== "function") {
      window.renderLinksPage = renderLinksFallback;
    }
  }

  function boot() {
    fixVideos();
    ensureLinksWork();
    patchRouter();
    if (window.state && (window.state.student || window.state.staff)) {
      window.unlockAchievement("first_login");
    }
  }

  boot();
  document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 400);
  setTimeout(boot, 1500);
  setTimeout(function () {
    window.__routerLinksPatched = false;
    patchRouter();
    ensureLinksWork();
  }, 2500);
})();
