/* core.js — Ядро, утилиты, страница темы */
"use strict";

window.escapeHtml = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

window.el = function (html) {
  var t = document.createElement("template");
  t.innerHTML = String(html).trim();
  var c = t.content;
  if (c.children.length === 1 && c.childNodes.length === 1) return c.firstElementChild;
  return c;
};

window.shuffle = function (arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
};

window.prepQuestion = function (q) {
  var idx = window.shuffle(q.options.map(function (_, i) { return i; }));
  return { q: q.q, options: idx.map(function (i) { return q.options[i]; }), correct: idx.indexOf(q.correct) };
};

window.getLevelTitle = function (l) { return l >= 10 ? "Мастер" : l >= 5 ? "Наладчик" : l >= 3 ? "Оператор" : "Ученик"; };

/* --- XP --- */
var _saveTimer;
window.addXP = function (n) {
  var s = window.state; if (!s) return;
  s.xp = Math.max(0, (s.xp || 0) + n);
  localStorage.setItem("mdk.xp", s.xp);
  window.renderUserChip();
  if (!s.student) return;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(function () { window.saveStudentData && window.saveStudentData(); }, 1500);
};

window.renderUserChip = function () {
  var s = window.state; if (!s) return;
  var lvl = window.getLevel ? window.getLevel(s.xp) : 1;
  var x = document.getElementById("xp-value"); if (x) x.textContent = s.xp;
  var l = document.getElementById("xp-level"); if (l) l.textContent = "Ур. " + lvl;
  var a = document.querySelector(".user-avatar");
  if (a) {
    a.className = "user-avatar" + (s.effect && s.effect !== "none" ? " av-fx-" + s.effect : "");
    a.innerHTML = s.avatar ? '<img src="' + escapeHtml(s.avatar) + '" alt="">' : "👨‍🏭";
  }
};

/* --- Курсы --- */
window.syncPrograms = function () {
  var d = window.MDK_DATA || {};
  window.PROGRAMS = Object.keys(d).map(function (k) { return d[k]; });
  if (!d[window.state.activeCourseId]) window.state.activeCourseId = Object.keys(d)[0];
  window.COURSE = d[window.state.activeCourseId];
};

window.buildCourseSelector = function () {
  var sel = document.getElementById("mdkSelector"); if (!sel) return;
  sel.innerHTML = Object.keys(window.MDK_DATA).map(function (k) {
    var c = window.MDK_DATA[k];
    return '<option value="' + k + '">' + escapeHtml(c.shortName) + "</option>";
  }).join("");
  sel.value = window.state.activeCourseId;
  sel.onchange = function () {
    window.state.activeCourseId = sel.value;
    localStorage.setItem("mdk.active", sel.value);
    window.syncPrograms();
    location.hash = "#/";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
};

/* --- Тесты --- */
window.saveResult = function (key, g, ok, xpPer) {
  var r = window.state.results, first = !r[key];
  if (!first && r[key].grade >= g) { window.saveStudentData(); return; }
  r[key] = { grade: g, total: ok };
  if (first) window.addXP(g * xpPer); else { window.saveStudentData(); }
};

/* --- Страница темы --- */
window.renderTopicPage = function (id) {
  var app = document.getElementById("app"), course = window.MDK_DATA[window.state.activeCourseId], topic = null;
  course.sections.forEach(function (s) { s.topics.forEach(function (t) { if (t.id === id) topic = t; }); });
  
  if (!topic) { app.innerHTML = '<a class="backlink" href="#/">← На главную</a><div class="module">Тема не найдена.</div>'; return; }
  app.innerHTML = '<a class="backlink" href="#/">← К темам</a>';
  app.appendChild(el('<section class="hero"><span class="brand-badge">' + escapeHtml(topic.code || "") + "</span><h1>" + escapeHtml(topic.title) + "</h1></section>"));

  // Лекции
  var lecs = topic.lectures || [];
  lecs.forEach(function (l, i) {
    var body = '<div class="lecture-body">' + l.content + "</div>";
    app.appendChild(lecs.length > 1
      ? el('<details class="module"' + (i === 0 ? " open" : "") + '><summary style="cursor:pointer;font-weight:bold;color:var(--accent)">' + escapeHtml(l.code + " " + l.title) + "</summary>" + body + "</details>")
      : el('<section class="module"><h2 style="color:var(--accent)">' + escapeHtml(l.code + " " + l.title) + "</h2>" + body + "</section>"));
  });

  // Тест по теме
  if (topic.test && topic.test.length) {
    var tkey = topic.id + "_test", tb = el('<section class="module"><h3>✅ Тест по теме</h3><p style="color:var(--muted);margin-bottom:10px">' + topic.test.length + " вопросов</p><button class=\"btn\" data-a=\"s\">Начать тест</button></section>");
    tb.querySelector("button").onclick = function start() {
      window.runQuiz(tb, topic.test, { title: "Тест: " + topic.title, onFinish: function (ok, t, g) { window.saveResult(tkey, g, ok, 10); window.quizResult(tb, ok, t, g, start); } });
    };
    app.appendChild(tb);
  }
};

/* --- PWA --- */
var _installEvt;
window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault(); _installEvt = e;
  if (document.getElementById("installBtn")) return;
  var b = el('<button id="installBtn" class="btn" style="background:var(--accent);color:#fff;padding:8px 12px">📲 Установить</button>');
  b.onclick = function () { _installEvt.prompt(); _installEvt.userChoice.finally(function () { b.remove(); }); };
  var h = document.querySelector(".top-header > div:last-child"); if (h) h.prepend(b);
});

window.applyTheme = function (id) {
  if (!id || id === "default") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", id);
};
window.applyTheme(localStorage.getItem("mdk.theme_active"));