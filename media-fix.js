"use strict";
(function () {
  function patch() {
    if (!window.renderVideosPage || window.__mediaFix) return;
    window.__mediaFix = true;

    window.renderVideosPage = function () {
      var app = document.getElementById("app"); if (!app) return;
      app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎬 Видеоуроки</h1><p style="opacity:.8;font-size:14px;">Если плеер пустой — загрузите mp4 в папку attachments/ на GitHub или укажите YouTube-ссылку в data-global.js.</p></section><div class="module" id="videosList"></div>';
      var list = document.getElementById("videosList");
      var vids = (window.GLOBAL_DATA && window.GLOBAL_DATA.videos) || [];
      if (!vids.length) { list.innerHTML = "<p>Видео пока нет.</p>"; return; }
      vids.forEach(function (v) {
        var src = v.external || v.file || "";
        var isHttp = /^https?:\/\//i.test(src);
        var block = document.createElement("div");
        block.style.cssText = "margin-bottom:20px;background:var(--card-soft);padding:15px;border-radius:8px;border:1px solid var(--border);";
        block.innerHTML = "<b style=\"color:var(--accent);font-size:16px;\">" + (v.title || "") + "</b><p style=\"font-size:14px;margin:5px 0;\">" + (v.description || "") + "</p>";
        if (isHttp && /youtube|youtu\.be/i.test(src)) {
          var id = (src.match(/(?:v=|youtu\.be\/)([\w-]{6,})/) || [])[1];
          if (id) block.innerHTML += '<iframe width="100%" height="360" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe>';
          else block.innerHTML += '<a class="btn" href="' + src + '" target="_blank" rel="noopener">Открыть видео</a>';
        } else if (isHttp) {
          block.innerHTML += '<a class="btn" href="' + src + '" target="_blank" rel="noopener">Открыть / скачать</a>';
        } else {
          block.innerHTML += '<video src="' + src + '" controls preload="metadata" playsinline style="width:100%;border-radius:8px;max-height:70vh;background:#000;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"></video>' +
            '<p style="display:none;color:var(--err);margin-top:8px;">Файл не найден (404). Загрузите <code>' + src + '</code> в репозиторий.</p>' +
            '<p style="margin-top:8px;"><a class="btn ghost" href="' + src + '" target="_blank" rel="noopener">Открыть файл</a></p>';
        }
        list.appendChild(block);
      });
    };

    window.renderSafetyPage = function () {
      var app = document.getElementById("app"); if (!app) return;
      app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🦺 Охрана труда</h1></section><div class="module" id="safetyList"></div>';
      var list = document.getElementById("safetyList");
      var items = (window.GLOBAL_DATA && window.GLOBAL_DATA.safety) || [];
      if (!items.length) { list.innerHTML = "<p>Материалы пока не добавлены.</p>"; return; }
      items.forEach(function (item) {
        list.innerHTML += '<div style="margin-bottom:15px;padding:15px;background:var(--card-soft);border-radius:8px;border:1px solid var(--border);"><b style="color:var(--accent);">' + item.title + '</b><p style="font-size:14px;margin:5px 0;">' + (item.description || "") + '</p><a class="btn" href="' + item.file + '" target="_blank" rel="noopener">📄 Открыть</a></div>';
      });
    };

    window.renderPassportsPage = function () {
      var app = document.getElementById("app"); if (!app) return;
      app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>📄 Паспорта станков</h1></section><div class="module" id="passList"></div>';
      var list = document.getElementById("passList");
      var items = (window.GLOBAL_DATA && window.GLOBAL_DATA.passports) || [];
      if (!items.length) { list.innerHTML = "<p>Материалы пока не добавлены.</p>"; return; }
      items.forEach(function (item) {
        list.innerHTML += '<div style="margin-bottom:15px;padding:15px;background:var(--card-soft);border-radius:8px;border:1px solid var(--border);"><b style="color:var(--accent);">' + item.title + '</b><p style="font-size:14px;margin:5px 0;">' + (item.description || "") + '</p><a class="btn" href="' + item.file + '" target="_blank" rel="noopener">📄 Открыть PDF</a></div>';
      });
    };
  }
  patch();
  document.addEventListener("DOMContentLoaded", patch);
  setTimeout(patch, 500);
  setTimeout(patch, 2000);
})();
