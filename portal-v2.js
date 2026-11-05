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
      context: raw.context || "",
      options: raw.options ? raw.options.slice() : null,
      correct: Array.isArray(raw.correct) ? raw.correct.slice() : raw.correct,
      answer: raw.answer,
      tol: raw.tol != null ? raw.tol : 0.01,
      unit: raw.unit || "",
      items: raw.items ? raw.items.slice() : null,
      correctOrder: raw.correctOrder ? raw.correctOrder.slice() : null,
      pairs: raw.pairs ? raw.pairs.map(function (pair) { return { left: pair.left, right: pair.right }; }) : null
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

  function collect(topicId, workIndex) {
    var list = [];
    if (workIndex !== null && workIndex !== undefined) {
      var key = "self_" + topicId + "_" + workIndex;
      var data = window.EXTRA_TESTS && window.EXTRA_TESTS[key];
      if (data && Array.isArray(data.questions)) list = list.concat(data.questions);
    }
    if (window.MDK_DATA) {
      var cid = (window.state && window.state.activeCourseId) || "07.01";
      var course = window.MDK_DATA[cid];
      if (course) {
        (course.sections || []).forEach(function (section) {
          (section.topics || []).forEach(function (topic) {
            if (topic.id === topicId && topic.test) list = list.concat(topic.test);
          });
        });
      }
    }
    if (workIndex === null || workIndex === undefined) {
      if (window.HARD_TESTS && window.HARD_TESTS[topicId]) list = list.concat(window.HARD_TESTS[topicId]);
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
    var m = location.hash.match(/topic\\/([^/]+)/);
    var courseId = (m && m[1]) || (window.state && window.state.activeCourseId) || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[courseId];
    var topic = null;
    if (course) (course.sections || []).forEach(function (section) {
      (section.topics || []).forEach(function (item) { if (item.id === topicId) topic = item; });
    });
    if (!topic || !topic.selfWork || !topic.selfWork.length) return;

    var html = "";
    topic.selfWork.forEach(function (work, index) {
      var displayCode = work.code || ("СР " + (index + 1));
      var resultKey = "self_" + topicId + "_" + index;
      var done = window.state.results && window.state.results[resultKey];
      var questions = collect(topicId, index);
      html += '<div class="module" style="margin-bottom:16px;padding:18px">';
      html += '<h3 style="color:var(--accent);margin-top:0">' + displayCode + " " + (work.title || "") + "</h3>";
      html += "<p><b>Задание:</b> " + (work.task || "Изучить материал и подготовить ответ.") + "</p>";
      if (work.questions && work.questions.length) {
        html += "<ul>";
        work.questions.forEach(function (question) { html += "<li>" + question + "</li>"; });
        html += "</ul>";
      }
      if (questions.length) {
        if (done) {
          html += '<div style="padding:14px;background:var(--card-soft);border-radius:8px;border:1px solid var(--ok);margin-top:12px">';
          html += '<b style="color:var(--ok)">Тест выполнен</b> — оценка: <b>' + (done.grade || "—") + "</b><br>";
          html += '<button type="button" class="btn ghost btn-retry-self" data-index="' + index + '" style="margin-top:10px">Пройти снова</button></div>';
        } else {
          html += '<div style="text-align:center;padding:18px;background:var(--card-soft);border-radius:8px;margin-top:12px">';
          html += "<p>Проверка тестом · вопросов: <b>" + questions.length + "</b></p>";
          html += '<button type="button" class="btn btn-start-self" data-index="' + index + '" style="padding:12px 28px;font-size:16px">Начать тест</button></div>';
        }
      } else {
        html += '<p style="color:var(--muted);margin-top:12px">Банк вопросов для этой самостоятельной работы пока не добавлен.</p>';
      }
      html += "</div>";
    });
    area.innerHTML = html;
    area.querySelectorAll(".btn-start-self, .btn-retry-self").forEach(function (button) {
      button.addEventListener("click", function () {
        window.startInlineTest(topicId, Number(button.getAttribute("data-index")));
      });
    });
  }

  window.startInlineTest = function (topicId, selfWorkRef) {
    var area = document.getElementById("topicContent");
    if (!area) return;
    var courseId = (location.hash.match(/topic\\/([^/]+)/) || [])[1] || (window.state && window.state.activeCourseId) || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[courseId];
    var topic = null;
    if (course) (course.sections || []).forEach(function (section) {
      (section.topics || []).forEach(function (item) { if (item.id === topicId) topic = item; });
    });
    var isSelf = selfWorkRef !== null && selfWorkRef !== undefined;
    var workIndex = null;
    if (isSelf) {
      workIndex = typeof selfWorkRef === "number" ? selfWorkRef :
        (topic ? (topic.selfWork || []).findIndex(function (work) { return work.code === selfWorkRef; }) : -1);
      if (workIndex < 0) workIndex = 0;
    }
    var questions = collect(topicId, workIndex);
    if (!questions.length) {
      area.innerHTML = '<p style="color:var(--err)">Вопросы для этой работы не найдены.</p>';
      return;
    }
    questions = shuffle(questions).slice(0, 15);
    var cur = 0, score = 0;

    function finish() {
      var pct = Math.round(score / questions.length * 100);
      var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
      var key = isSelf ? ("self_" + topicId + "_" + workIndex) : ("test_" + topicId);
      if (!window.state.results) window.state.results = {};
      window.state.results[key] = { grade: grade, percent: pct, score: score, max: questions.length };
      if (window.saveStudentData) window.saveStudentData();
      if (window.unlockAchievement) window.unlockAchievement("first_test");
      if (window.state.student && window.API && window.API.saveResult) {
        Promise.resolve(window.API.saveResult({
          email: window.state.student.email, name: window.state.student.name, group: window.state.student.group,
          testId: key, testTitle: isSelf ? ("Самостоятельная работа " + (workIndex + 1)) : ("Тест " + topicId),
          grade: grade, score: score, maxScore: questions.length, percent: pct, timeSpent: 0
        })).catch(function (error) { console.warn("Не удалось отправить результат теста", error); });
      }
      area.innerHTML = '<div style="text-align:center;padding:30px;background:var(--card-soft);border-radius:12px"><h2 style="color:var(--ok)">Проверка завершена</h2><p>Верных ответов: <b>' + score + '</b> из <b>' + questions.length + '</b> (' + pct + '%)</p><h1 style="font-size:48px;color:var(--accent)">Оценка: ' + grade + '</h1><button type="button" class="btn" id="btnBackAfterTest">Вернуться</button></div>';
      var back = document.getElementById("btnBackAfterTest");
      if (back) back.onclick = function () { if (window.switchTopicTab) window.switchTopicTab(isSelf ? "selfwork" : "test"); };
    }

    function show() {
      if (cur >= questions.length) return finish();
      var q = questions[cur];
      var html = '<div style="display:flex;justify-content:space-between;margin-bottom:12px"><b>Вопрос ' + (cur + 1) + ' из ' + questions.length + '</b></div><div style="font-weight:bold;margin-bottom:16px;line-height:1.45">' + q.q + '</div>';
      if (q.type === "num") {
        html += '<input id="inlineNum" class="self-input" type="number" step="any" placeholder="Введите число" style="max-width:240px"><button type="button" class="btn" id="inlineSubmit" style="display:block;margin-top:12px">Ответить</button>';
        area.innerHTML = html;
        document.getElementById("inlineSubmit").onclick = function () {
          var value = Number(document.getElementById("inlineNum").value);
          if (Number.isFinite(value) && Math.abs(value - Number(q.answer)) <= (q.tol || 0.01)) score++;
          cur++; show();
        };
        return;
      }
      if (q.type === "multi") {
        (q.options || []).forEach(function (option, index) {
          html += '<label style="display:block;padding:8px"><input type="checkbox" value="' + index + '"> ' + option + '</label>';
        });
        html += '<button type="button" class="btn" id="inlineSubmit" style="margin-top:12px">Проверить ответ</button>';
        area.innerHTML = html;
        document.getElementById("inlineSubmit").onclick = function () {
          var selected = Array.prototype.map.call(area.querySelectorAll('input[type="checkbox"]:checked'), function (el) { return Number(el.value); }).sort();
          var correct = (q.correct || []).slice().sort();
          if (selected.length === correct.length && selected.every(function (v, i) { return v === correct[i]; })) score++;
          cur++; show();
        };
        return;
      }
      if (q.type === "order") {
        var items = shuffle(q.items || []);
        items.forEach(function (item, index) {
          html += '<label style="display:flex;gap:8px;align-items:center;margin:8px 0"><span>' + item + '</span><select class="self-input order-pos" data-item="' + item.replace(/"/g, '&quot;') + '" style="max-width:90px"><option value="">№</option>' + Array.from({length:items.length}, function (_, i) { return '<option value="' + (i + 1) + '">' + (i + 1) + '</option>'; }).join("") + '</select></label>';
        });
        html += '<button type="button" class="btn" id="inlineSubmit">Проверить порядок</button>';
        area.innerHTML = html;
        document.getElementById("inlineSubmit").onclick = function () {
          var correctOrder = q.correctOrder || q.items || [];
          var fields = area.querySelectorAll(".order-pos");
          var right = 0;
          Array.prototype.forEach.call(fields, function (field) {
            if (Number(field.value) === correctOrder.indexOf(field.getAttribute("data-item")) + 1) right++;
          });
          if (fields.length && right === fields.length) score++;
          cur++; show();
        };
        return;
      }
      (q.options || []).forEach(function (option, index) {
        html += '<button type="button" class="btn ghost opt-btn" data-i="' + index + '" style="display:block;width:100%;text-align:left;margin-top:6px;padding:12px">' + option + '</button>';
      });
      area.innerHTML = html;
      area.querySelectorAll(".opt-btn").forEach(function (button) {
        button.onclick = function () {
          if (Number(button.getAttribute("data-i")) === q.correct) score++;
          cur++; show();
        };
      });
    }
    show();
  };

  function patchTopic() {
    if (window.__portalV2SwitchPatched || typeof window.switchTopicTab !== "function") return;
    window.__portalV2SwitchPatched = true;
    var originalSwitchTopicTab = window.switchTopicTab;
    window.switchTopicTab = function (tab) {
      var result = originalSwitchTopicTab.apply(this, arguments);
      if (tab === "selfwork") renderSelf();
      return result;
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
    if (window.__portalV2RouterPatched || !window.router) return;
    window.__portalV2RouterPatched = true;
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
