/* core.js — подключить ПЕРВЫМ после api.js. Общие утилиты + страница темы + PWA */
"use strict";

window.escapeHtml = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};
window.el = function (html) {
  var t = document.createElement("template");
  t.innerHTML = String(html).trim();
  return t.content.firstElementChild || document.createTextNode("");
};
window.getLevelTitle = function (l) {
  return l >= 10 ? "Мастер" : l >= 5 ? "Наладчик" : l >= 3 ? "Оператор" : "Ученик";
};

// ---- XP ----
var _saveTimer;
window.addXP = function (n) {
  var s = window.state; if (!s) return;
  s.xp = Math.max(0, (s.xp || 0) + n);
  localStorage.setItem("mdk.xp", s.xp);
  var x = document.getElementById("xp-value"); if (x) x.textContent = s.xp;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(function () { if (window.saveStudentData) window.saveStudentData(); }, 1500);
  if (window.checkAchievements) window.checkAchievements();
};
window.renderUserChip = function () {
  var s = window.state, a = document.querySelector(".user-avatar"), x = document.getElementById("xp-value");
  if (x) x.textContent = s.xp;
  if (a) a.innerHTML = s.avatar ? '<img src="' + escapeHtml(s.avatar) + '">' : "👨‍🏭";
};

// ---- Курсы для final.js ----
function syncPrograms() {
  var d = window.MDK_DATA || {};
  window.PROGRAMS = Object.keys(d).map(function (k) { return d[k]; });
  window.COURSE = d[window.state.activeCourseId] || window.PROGRAMS[0];
}

// ---- Выбор МДК (клик по .sidebar-course) ----
document.addEventListener("click", function (e) {
  if (!e.target.closest(".sidebar-course")) return;
  var ids = Object.keys(window.MDK_DATA || {});
  var cur = ids.indexOf(window.state.activeCourseId);
  window.state.activeCourseId = ids[(cur + 1) % ids.length];
  localStorage.setItem("mdk.active", window.state.activeCourseId);
  syncPrograms();
  var c = window.MDK_DATA[window.state.activeCourseId];
  e.target.closest(".sidebar-course").textContent = c.shortName + " ⌄";
  location.hash = "#/";
  window.dispatchEvent(new HashChangeEvent("hashchange"));
});

// ---- Подсветка пункта меню ----
window.addEventListener("hashchange", function () {
  document.querySelectorAll(".sidebar-nav a").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === location.hash || (a.getAttribute("href") === "#/" && !location.hash));
  });
  var m = document.querySelector(".main-wrapper"); if (m) m.scrollTop = 0;
});

// ---- Страница темы ----
window.renderTopicPage = function (id) {
  var app = document.getElementById("app"), course = window.MDK_DATA[window.state.activeCourseId], topic = null;
  course.sections.forEach(function (s) { s.topics.forEach(function (t) { if (t.id === id) topic = t; }); });
  if (!topic) { app.innerHTML = "<h2>Тема не найдена</h2>"; return; }
  document.getElementById("crumbs").textContent = topic.code + " · " + topic.title;
  app.innerHTML = '<a class="backlink" href="#/">← К темам</a><section class="hero"><h1>' + escapeHtml(topic.title) + "</h1><p>" + escapeHtml(topic.code) + "</p></section>";

  (topic.lectures || []).forEach(function (l) {
    app.appendChild(el('<section class="module lecture-body"><h2>' + escapeHtml(l.code + " " + l.title) + "</h2>" + l.content + "</section>"));
  });

  (topic.presentations || []).forEach(function (p) {
    app.appendChild(el('<section class="module"><h3>📊 ' + escapeHtml(p.title) + '</h3><p style="color:var(--muted)">' + escapeHtml(p.description || "") + '</p><a class="btn" href="./' + encodeURI(p.file) + '" target="_blank">Открыть презентацию</a></section>'));
  });

  (topic.practicals || []).forEach(function (p, i) {
    var key = "prac_" + topic.id + "_" + i, done = window.state.results[key];
    var box = el('<section class="module"><h3>🛠 ' + escapeHtml(p.code + " " + p.title) + '</h3><p><b>Цель:</b> ' + escapeHtml(p.goal) + '</p><p>' + escapeHtml(p.task) + '</p><p style="color:var(--muted);margin-top:8px">' + escapeHtml(p.commonVariant || "") + '</p>' +
      (p.expectedAnswer ? '<div style="display:flex;gap:8px;margin-top:12px"><input class="self-input" placeholder="Ответ на расчётную часть"><button class="btn">Проверить</button></div><div class="fb" style="margin-top:8px;font-weight:bold">' + (done ? "✅ Уже сдано" : "") + "</div>" : "") + "</section>");
    var btn = box.querySelector("button");
    if (btn) btn.onclick = function () {
      var v = box.querySelector("input").value.trim().replace(",", "."), fb = box.querySelector(".fb");
      if (v.toLowerCase() === String(p.expectedAnswer).toLowerCase()) {
        fb.textContent = "✅ Верно!"; fb.style.color = "var(--ok)";
        if (!window.state.results[key]) { window.state.results[key] = { grade: 5 }; window.addXP(30); }
      } else { fb.textContent = "❌ Неверно, проверьте расчёт"; fb.style.color = "var(--err)"; }
    };
    app.appendChild(box);
  });

  (topic.selfWork || []).forEach(function (w) {
    app.appendChild(el('<section class="module"><h3>📝 ' + escapeHtml(w.code + " " + w.title) + "</h3><p>" + escapeHtml(w.task || "") + "</p>" +
      ((w.questions || []).length ? '<ul style="margin:10px 0 0 20px;color:var(--muted)">' + w.questions.map(function (q) { return "<li>" + escapeHtml(q) + "</li>"; }).join("") + "</ul>" : "") + "</section>"));
  });

  if (topic.test && topic.test.length) {
    var tbox = el('<section class="module"><h3>✅ Тест по теме</h3><button class="btn" id="tStart">Пройти тест (' + topic.test.length + " вопр.)</button></section>");
    tbox.querySelector("#tStart").onclick = function () {
      tbox.innerHTML = "<h3>✅ Тест по теме</h3>";
      var form = document.createElement("form");
      topic.test.forEach(function (q, qi) {
        var d = el('<div class="question"><div class="q-text">' + (qi + 1) + ". " + escapeHtml(q.q) + "</div></div>");
        q.options.forEach(function (o, oi) { d.appendChild(el('<label class="option"><input type="radio" name="q' + qi + '" value="' + oi + '"><span>' + escapeHtml(o) + "</span></label>")); });
        form.appendChild(d);
      });
      var fin = el('<button type="button" class="btn" style="width:100%">Завершить</button>');
      form.appendChild(fin); tbox.appendChild(form);
      fin.onclick = function () {
        var ok = 0;
        topic.test.forEach(function (q, qi) { var c = form.querySelector('input[name="q' + qi + '"]:checked'); if (c && +c.value === q.correct) ok++; });
        var pct = ok / topic.test.length * 100, g = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
        var k = topic.id + "_test", first = !window.state.results[k];
        window.state.results[k] = { grade: g, total: ok };
        if (first) window.addXP(g * 10); else window.saveStudentData();
        tbox.innerHTML = '<div class="exam-result"><h3>Верно: ' + ok + " из " + topic.test.length + '</h3><div class="exam-grade" style="color:' + (g >= 3 ? "var(--ok)" : "var(--err)") + '">' + g + '</div><a class="btn" href="#/topic/' + topic.id + '">Пересдать</a></div>';
      };
    };
    app.appendChild(tbox);
  }
};

// ---- PWA ----
var _installEvt;
window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault(); _installEvt = e;
  if (document.getElementById("installBtn")) return;
  var b = document.createElement("button");
  b.id = "installBtn"; b.className = "btn"; b.textContent = "📲 Установить";
  b.style.cssText = "background:var(--accent);color:#fff;padding:8px 12px";
  b.onclick = function () { _installEvt.prompt(); _installEvt.userChoice.finally(function () { b.remove(); }); };
  var h = document.querySelector(".top-header > div:last-child"); if (h) h.prepend(b);
});
if ("serviceWorker" in navigator) window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js").catch(function () {}); });

// ---- Тема из localStorage ----
(function () {
  var t = localStorage.getItem("mdk.theme_active");
  if (t && t !== "default") document.documentElement.setAttribute("data-theme", t);
})();
document.addEventListener("DOMContentLoaded", function () { syncPrograms(); window.renderUserChip(); window.dispatchEvent(new HashChangeEvent("hashchange")); });
