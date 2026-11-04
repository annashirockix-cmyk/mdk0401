"use strict";
(function () {
  if (window.GLOBAL_DATA) {
    window.GLOBAL_DATA.safety = [
      { title: "ИОТ для токаря", description: "Инструкция по охране труда", file: "./ohranatruda/" + encodeURIComponent("иот токаря.docx") },
      { title: "ИОТ для фрезеровщика", description: "Инструкция по охране труда", file: "./ohranatruda/" + encodeURIComponent("иот фрезер.docx") },
      { title: "ИОТ при работе на вертикально-протяжном станке", description: "Инструкция", file: "./ohranatruda/" + encodeURIComponent("иот при работе на вертикально-протяжных полуавтоматах.docx") },
      { title: "ИОТ для кранбалки", description: "Инструкция", file: "./ohranatruda/" + encodeURIComponent("иот кранбалки.docx") },
      { title: "Инструкция по охране труда (общая)", description: "Общие требования", file: "./ohranatruda/" + encodeURIComponent("Инструкция по охране труда.docx") }
    ];
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function norm(raw) {
    if (!raw) return null;
    var q = {
      type: raw.type || "mc",
      q: raw.q || "",
      options: raw.options ? raw.options.slice() : null,
      correct: raw.correct,
      answer: raw.answer,
      tol: raw.tol != null ? raw.tol : 0.01
    };
    if (q.type === "tf") {
      q.options = ["Верно", "Неверно"];
      q.correct = (raw.correct === true || raw.correct === 0) ? 0 : 1;
      q.type = "mc";
    }
    if (q.type === "mc" && q.options && typeof q.correct === "number") {
      var pairs = q.options.map(function (opt, i) {
        return { opt: opt, ok: i === q.correct };
      });
      pairs = shuffle(pairs);
      q.options = pairs.map(function (p) { return p.opt; });
      q.correct = pairs.findIndex(function (p) { return p.ok; });
    }
    return q;
  }

  function collect(topicId) {
    var list = [];
    var key = "self_" + topicId + "_0";
    if (window.EXTRA_TESTS && window.EXTRA_TESTS[key] && window.EXTRA_TESTS[key].questions) {
      list = list.concat(window.EXTRA_TESTS[key].questions);
    }
    if (window.MDK_DATA) {
      var cid = (window.state && window.state.activeCourseId) || "07.01";
      var course = window.MDK_DATA[cid];
      if (course) {
        course.sections.forEach(function (s) {
          s.topics.forEach(function (t) {
            if (t.id === topicId && t.test) list = list.concat(t.test);
          });
        });
      }
    }
    return list.map(norm).filter(Boolean);
  }

  function topicIdFromHash() {
    var p = (location.hash || "").replace(/^#/, "").split("/").filter(Boolean);
    return p[0] === "topic" ? p[2] : null;
  }

  function renderSelf() {
    var area = document.getElementById("topicContent");
    if (!area) return;
    var topicId = topicIdFromHash();
    if (!topicId) return;

    var m = location.hash.match(/topic\/([^/]+)/);
    var courseId = (m && m[1]) || (window.state && window.state.activeCourseId) || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[courseId];
    var topic = null;
    if (course) {
      course.sections.forEach(function (s) {
        s.topics.forEach(function (t) {
          if (t.id === topicId) topic = t;
        });
      });
    }
    if (!topic || !topic.selfWork || !topic.selfWork.length) return;

    var html = "";
    topic.selfWork.forEach(function (work) {
      var testId = "self_" + work.code;
      var done = window.state.results && window.state.results[testId];
      var n = collect(topicId).length;

      html += '<div class="module" style="margin-bottom:16px;padding:18px">';
      html += '<h3 style="color:var(--accent);margin-top:0">' + work.code + " " + work.title + "</h3>";
      html += "<p><b>Задание:</b> " + work.task + "</p>";
      if (work.questions && work.questions.length) {
        html += "<ul>";
        work.questions.forEach(function (q) { html += "<li>" + q + "</li>"; });
        html += "</ul>";
      }
      if (n > 0) {
        if (done) {
          html += '<div style="padding:14px;background:var(--card-soft);border-radius:8px;border:1px solid var(--ok);margin-top:12px">';
          html += '<b style="color:var(--ok)">Тест сдан</b> — оценка: <b>' + (done.grade || "—") + "</b><br>";
          html += '<button type="button" class="btn ghost btn-retry-self" data-topic="' + topicId + '" data-code="' + work.code + '" style="margin-top:10px">Пройти снова</button>';
          html += "</div>";
        } else {
          html += '<div style="text-align:center;padding:18px;background:var(--card-soft);border-radius:8px;margin-top:12px">';
          html += "<p>Проверка <b>тестом</b> · вопросов: <b>" + n + "</b></p>";
          html += '<p style="font-size:13px;color:var(--muted)">Оценка сохранится и уйдёт в журнал</p>';
          html += '<button type="button" class="btn btn-start-self" data-topic="' + topicId + '" data-code="' + work.code + '" style="padding:12px 28px;font-size:16px">Начать тест</button>';
          html += "</div>";
        }
      } else {
        html += '<p style="color:var(--muted);margin-top:12px">Банк вопросов для этой темы пока пуст.</p>';
      }
      html += "</div>";
    });
    area.innerHTML = html;

    area.querySelectorAll(".btn-start-self, .btn-retry-self").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.startInlineTest(btn.getAttribute("data-topic"), btn.getAttribute("data-code"));
      });
    });
  }

  window.startInlineTest = function (topicId, selfWorkCode) {
    var area = document.getElementById("topicContent");
    if (!area) return;
    var questions = collect(topicId);
    if (!questions.length) {
      area.innerHTML = '<p style="color:var(--err)">Вопросы не найдены. Обновите страницу (Ctrl+F5).</p>';
      return;
    }
    questions = shuffle(questions);
    if (questions.length > 12) questions = questions.slice(0, 12);

    var cur = 0;
    var correct = 0;

    function finish() {
      var pct = Math.round((correct / questions.length) * 100);
      var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
      var key = selfWorkCode ? "self_" + selfWorkCode : "test_" + topicId;
      if (!window.state.results) window.state.results = {};
      window.state.results[key] = { grade: grade, percent: pct, score: correct, max: questions.length };
      if (window.saveStudentData) window.saveStudentData();
      if (window.unlockAchievement) {
        window.unlockAchievement("first_test");
        window.unlockAchievement("hacker");
      }
      if (window.state.student && window.API && window.API.saveResult) {
        try {
          window.API.saveResult({
            email: window.state.student.email,
            name: window.state.student.name,
            group: window.state.student.group,
            testId: key,
            testTitle: selfWorkCode ? ("СР " + selfWorkCode) : ("Тест " + topicId),
            grade: grade,
            score: correct,
            maxScore: questions.length,
            percent: pct,
            timeSpent: 0
          });
        } catch (e) {
          console.warn("saveResult", e);
        }
      }

      var backTab = selfWorkCode ? "selfwork" : "test";
      area.innerHTML =
        '<div style="text-align:center;padding:30px;background:var(--card-soft);border-radius:12px">' +
        '<h2 style="color:var(--ok)">Тест завершён!</h2>' +
        "<p>Верных: <b>" + correct + "</b> из <b>" + questions.length + "</b> (" + pct + "%)</p>" +
        '<h1 style="font-size:48px;color:var(--accent)">Оценка: ' + grade + "</h1>" +
        '<p style="color:var(--muted);font-size:13px">Результат сохранён' +
        (window.state.student ? " и отправлен в журнал" : "") +
        "</p>" +
        '<button type="button" class="btn" id="btnBackAfterTest">Вернуться</button></div>';
      var b = document.getElementById("btnBackAfterTest");
      if (b) {
        b.onclick = function () {
          if (window.switchTopicTab) window.switchTopicTab(backTab);
        };
      }
    }

    function show() {
      if (cur >= questions.length) return finish();
      var q = questions[cur];
      var html =
        '<div style="display:flex;justify-content:space-between;margin-bottom:12px">' +
        "<b>Вопрос " + (cur + 1) + " из " + questions.length + "</b></div>" +
        '<div style="font-weight:bold;margin-bottom:16px;font-size:16px;line-height:1.4">' + q.q + "</div>";

      if (q.type === "num") {
        html +
          '<input id="numAns" class="self-input" type="number" step="any" placeholder="Введите число" style="max-width:220px">' +
          '<div style="margin-top:12px"><button type="button" class="btn" id="btnNumOk">Ответить</button></div>';
        area.innerHTML = html;
        document.getElementById("btnNumOk").onclick = function () {
          var v = parseFloat(document.getElementById("numAns").value);
          if (!isNaN(v) && Math.abs(v - q.answer) <= (q.tol || 0.01)) correct++;
          cur++;
          show();
        };
        return;
      }

      (q.options || []).forEach(function (opt, i) {
        html +=
          '<button type="button" class="btn ghost opt-btn" data-i="' + i +
          '" style="display:block;width:100%;text-align:left;margin-top:6px;padding:12px">' +
          opt + "</button>";
      });
      area.innerHTML = html;
      area.querySelectorAll(".opt-btn").forEach(function (btn) {
        btn.onclick = function () {
          if (parseInt(btn.getAttribute("data-i"), 10) === q.correct) correct++;
          cur++;
          show();
        };
      });
    }
    show();
  };

  function patchTopic() {
    if (!window.renderTopicPage) return;
    var orig = window.renderTopicPage;
    window.renderTopicPage = function () {
      orig.apply(this, arguments);
      if (typeof window.switchTopicTab === "function") {
        var st = window.switchTopicTab;
        window.switchTopicTab = function (tab) {
          st.apply(this, arguments);
          if (tab === "selfwork") setTimeout(renderSelf, 50);
        };
      }
    };
  }

  function linksPage() {
    var app = document.getElementById("app");
    if (!app) return;
    var html =
      '<a class="backlink" href="#/" style="color:var(--accent)">← На главную</a>' +
      '<section class="hero"><h1>🔗 Полезные ссылки</h1><p>Открываются в новой вкладке</p></section>';
    var items = [
      ["CNC Cookbook", "https://www.cnccookbook.com/", "База знаний по ЧПУ"],
      ["NYC CNC", "https://www.youtube.com/@NYCNC", "Практика ЧПУ"],
      ["Haas Tips", "https://www.haascnc.com/video/tip-of-the-day.html", "Советы Haas"],
      ["Mastercam", "https://www.mastercam.com/", "Официальный сайт"]
    ];
    items.forEach(function (it) {
      html +=
        '<a class="module" href="' + it[1] + '" target="_blank" rel="noopener" style="display:block;text-decoration:none;color:var(--text);margin-bottom:10px">' +
        '<b style="color:var(--accent)">' + it[0] + " ↗</b>" +
        '<div style="font-size:13px;color:var(--muted)">' + it[2] + "</div></a>";
    });
    app.innerHTML = html;
  }
  window.renderLinksPage = linksPage;

  window.renderCertificatePage = function () {
    var app = document.getElementById("app");
    if (!app) return;
    var who =
      (window.state && window.state.student) ||
      (window.state && window.state.staff && { name: window.state.staff.name, group: "Преподаватель" });
    var html = '<a class="backlink no-print" href="#/" style="color:var(--accent)">← На главную</a>';
    if (!who) {
      app.innerHTML = html + '<div class="module">Войдите, чтобы увидеть сертификат.</div>';
      return;
    }
    var course =
      (window.MDK_DATA &&
        window.MDK_DATA[window.state.activeCourseId] &&
        window.MDK_DATA[window.state.activeCourseId].title) ||
      "МДК";
    html +=
      '<div class="no-print" style="text-align:center;margin:20px 0">' +
      '<button type="button" class="btn" onclick="window.print()">Печать</button></div>';
    html +=
      '<div style="background:#fff;color:#000;padding:40px;max-width:900px;margin:0 auto;border:10px double #c14a2a;text-align:center;position:relative">';
    html += '<h1 style="font-size:40px;color:#c14a2a;margin:0">СЕРТИФИКАТ</h1>';
    html += '<p style="font-size:20px;margin:40px 0">подтверждает, что</p>';
    html +=
      '<h2 style="font-size:32px;border-bottom:2px solid #ccc;display:inline-block">' +
      who.name +
      "</h2>";
    html +=
      '<p style="font-size:18px;margin-top:40px">успешно прошёл(ла) обучение по программе</p>';
    html += '<h3 style="font-size:22px;color:#c14a2a">' + course + "</h3>";
    html +=
      '<div style="margin-top:60px;display:flex;justify-content:space-between">' +
      "<div>Дата: " +
      new Date().toLocaleDateString("ru-RU") +
      "</div><div>Подпись: _______________</div></div>";
    html +=
      '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:72px;font-weight:bold;color:rgba(255,0,0,.12);pointer-events:none">ОБРАЗЕЦ</div></div>';
    app.innerHTML = html;
  };

  window.renderRatingPage = function () {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML =
      '<a class="backlink" href="#/" style="color:var(--accent)">← На главную</a>' +
      '<section class="hero"><h1>Доска почета</h1></section>' +
      '<div class="module" id="ratingBox">Загрузка…</div>';
    var box = document.getElementById("ratingBox");
    if (!window.API || !window.API.getStudents) {
      box.textContent = "API недоступен";
      return;
    }
    window.API.getStudents()
      .then(function (d) {
        var students = (d && (d.students || (d.data && d.data.students))) || [];
        if (!(d && (d.ok || d.success)) || !students.length) {
          if (window.state && window.state.student) {
            students = [
              {
                name: window.state.student.name,
                group: window.state.student.group,
                xp: window.state.xp || 0
              }
            ];
          } else {
            box.innerHTML =
              "Нет данных. API: " +
              (d && d.error ? d.error : "пустой список") +
              ". Проверьте лист Users.";
            return;
          }
        }
        students = students
          .map(function (s) {
            return {
              name: s.name || s.email || "—",
              group: s.group || "",
              xp: +(s.xp || s.points || 0)
            };
          })
          .filter(function (s) {
            return (s.group + "").toLowerCase().indexOf("препод") === -1;
          })
          .sort(function (a, b) {
            return b.xp - a.xp;
          });
        var html = "";
        students.forEach(function (s, i) {
          html +=
            '<div style="display:flex;justify-content:space-between;padding:12px;margin:6px 0;background:var(--card-soft);border-radius:8px">' +
            "<div><b>" +
            (i + 1) +
            ". " +
            s.name +
            '</b> <span style="color:var(--muted);font-size:12px">(' +
            s.group +
            ")</span></div>" +
            '<div style="color:var(--gold)">' +
            s.xp +
            " XP</div></div>";
        });
        box.innerHTML = html || "Пусто";
      })
      .catch(function (e) {
        box.textContent = "Ошибка: " + (e.message || e);
      });
  };

  window.renderSafetyPage = function () {
    var app = document.getElementById("app");
    if (!app) return;
    var items = (window.GLOBAL_DATA && window.GLOBAL_DATA.safety) || [];
    var html =
      '<a class="backlink" href="#/" style="color:var(--accent)">← На главную</a>' +
      '<section class="hero"><h1>Охрана труда</h1></section>';
    items.forEach(function (it) {
      html +=
        '<div class="module" style="margin-bottom:12px">' +
        '<b style="color:var(--accent)">' +
        it.title +
        '</b><p style="font-size:14px;color:var(--muted)">' +
        it.description +
        '</p><a class="btn" href="' +
        it.file +
        '" target="_blank" rel="noopener">Открыть</a></div>';
    });
    app.innerHTML = html;
  };

  function patchRouter() {
    if (!window.router) return;
    var orig = window.router;
    window.router = function () {
      var parts = ((location.hash || "").slice(1) || "/")
        .split("/")
        .filter(Boolean);
      var page = parts[0] || "";
      if (page === "links") {
        if (!window.state || (!window.state.student && !window.state.staff)) {
          var o = document.getElementById("loginOverlay");
          if (o) o.style.display = "flex";
          return;
        }
        var o2 = document.getElementById("loginOverlay");
        if (o2) o2.style.display = "none";
        linksPage();
        return;
      }
      return orig.apply(this, arguments);
    };
  }

  function examMenu() {
    var nav = document.querySelector(".drawer-nav");
    if (!nav || nav.querySelector("[data-exam-v2]")) return;
    var a = document.createElement("a");
    a.href = "#/final/" + ((window.state && window.state.activeCourseId) || "07.01");
    a.className = "drawer-item";
    a.setAttribute("data-exam-v2", "1");
    a.textContent = "Экзамен";
    var t = nav.querySelector('a[href="#/training"]');
    if (t) t.parentNode.insertBefore(a, t.nextSibling);
    else nav.appendChild(a);
  }

  function boot() {
    patchTopic();
    patchRouter();
    examMenu();
  }
  boot();
  document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 500);
  setTimeout(boot, 2000);
  setTimeout(function () {
    patchTopic();
    patchRouter();
  }, 3500);
})();
