"use strict";
(function () {
  var BANK = {
    "t-1-1": [
      { type: "tf", q: "Ключ от патрона можно оставлять в патроне на время паузы в работе." },
      { type: "tf", q: "Стружку с вращающейся детали снимают крючком только после останова шпинделя." },
      { type: "mc", q: "Что проверяют в первую очередь перед пуском станка?", options: ["Цвет ограждения", "Исправность аварийного останова", "Марку ветоши", "Версию ПО"] },
      { type: "num", q: "Число типовых проверок ежесменного осмотра (3–7). Введите 5.", tol: 2 },
      { type: "mc", q: "Измерять деталь штангенциркулем можно:", options: ["При любых оборотах", "Только после полного останова", "При открытом ограждении на ходу", "Под струёй СОЖ"] }
    ],
    "t-1-2": [
      { type: "tf", q: "Станок с ЧПУ всегда дешевле универсального токарного." },
      { type: "mc", q: "Главное преимущество ЧПУ:", options: ["Меньше вес", "Повторяемость размеров", "Не нужна оснастка", "Нет стружки"] },
      { type: "mc", q: "Токарный станок с ЧПУ чаще всего:", options: ["1-осевой", "2-осевой (X, Z)", "5-осевой", "Только шпиндель"] },
      { type: "tf", q: "Оператору достаточно нажать «Пуск» и не контролировать процесс." }
    ],
    "t-1-3": [
      { type: "mc", q: "Суппорт служит для:", options: ["Крепления заготовки", "Перемещения резца", "Подачи СОЖ", "Измерения оборотов"] },
      { type: "tf", q: "Передняя бабка содержит шпиндель и привод." },
      { type: "mc", q: "Задняя бабка чаще нужна для:", options: ["Крепления резца", "Поддержки длинной заготовки / сверления", "Смены патрона", "Подачи СОЖ"] }
    ],
    "t-1-4": [
      { type: "tf", q: "Работать в перчатках на вращающемся токарном станке запрещено." },
      { type: "mc", q: "При возгорании масляной СОЖ нельзя:", options: ["Нажать аварийный стоп", "Тушить водой", "Сообщить мастеру", "Использовать CO2-огнетушитель"] },
      { type: "mc", q: "Спецодежда токаря должна быть:", options: ["Свободной со свисающими рукавами", "Застёгнутой, без свисающих концов", "Из лёгкой синтетики", "Без головного убора"] },
      { type: "tf", q: "Стружку с вращающейся детали можно снимать руками при малых оборотах." }
    ],
    "t-2-1": [
      { type: "mc", q: "База по оси Z в патроне чаще:", options: ["Ось шпинделя", "Торец заготовки", "Канавка", "Задняя бабка"] },
      { type: "num", q: "Припуск на сторону под чистовое точение (мм). Введите 0.3 (±0.25).", tol: 0.25 },
      { type: "tf", q: "Черновой проход делают с меньшей подачей, чем чистовой." },
      { type: "mc", q: "Канавку на валу точат:", options: ["Проходным упорным", "Канавочным (прорезным)", "Центровкой", "Метчиком"] }
    ],
    "t-2-2": [
      { type: "num", q: "Диаметр отверстия под M10×1.5 примерно (мм). Введите 8.5 (±0.5).", tol: 0.5 },
      { type: "mc", q: "Резьбу контролируют:", options: ["Только линейкой", "Калибром или шаблоном", "На глаз", "По цвету стружки"] },
      { type: "tf", q: "Шаг резьбы M16×2 равен 2 мм." },
      { type: "mc", q: "Для внутренней резьбы на токарном чаще:", options: ["Плашку", "Метчик или расточной резьбовой резец", "Фрезу концевую", "Сверло центровочное"] }
    ]
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function normalizeQuestion(raw) {
    if (!raw) return null;
    var q = {
      type: raw.type || "mc",
      q: raw.q || "",
      options: raw.options ? raw.options.slice() : null,
      tol: raw.tol != null ? raw.tol : 0.01
    };
    if (q.type === "tf") {
      q.options = ["Верно", "Неверно"];
      q.type = "mc";
    }
    return q;
  }

  function collectSelfQuestions(topicId, selfWorkCode) {
    var list = [];
    var key = "self_" + topicId + "_0";
    if (window.EXTRA_TESTS && window.EXTRA_TESTS[key] && window.EXTRA_TESTS[key].questions) {
      list = list.concat(window.EXTRA_TESTS[key].questions);
    }
    if (BANK[topicId]) list = list.concat(BANK[topicId]);
    if (selfWorkCode && window.EXTRA_TESTS) {
      var k2 = "self_" + String(selfWorkCode).replace(/\s+/g, "");
      if (window.EXTRA_TESTS[k2] && window.EXTRA_TESTS[k2].questions) {
        list = list.concat(window.EXTRA_TESTS[k2].questions);
      }
    }
    if (!list.length && window.MDK_DATA) {
      var course = window.MDK_DATA[window.state.activeCourseId || "07.01"];
      if (course) {
        course.sections.forEach(function (s) {
          s.topics.forEach(function (t) {
            if (t.id === topicId && t.test) list = list.concat(t.test);
          });
        });
      }
    }
    return list.map(normalizeQuestion).filter(Boolean);
  }

  function collectTopicTest(topicId) {
    var list = [];
    var course = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId || "07.01"];
    if (course) {
      course.sections.forEach(function (s) {
        s.topics.forEach(function (t) {
          if (t.id === topicId && t.test) list = list.concat(t.test);
        });
      });
    }
    if (window.HARD_TESTS && window.HARD_TESTS[topicId]) list = list.concat(window.HARD_TESTS[topicId]);
    if (BANK[topicId]) list = list.concat(BANK[topicId]);
    return list.map(normalizeQuestion).filter(Boolean);
  }

  // Legacy local assessment is disabled. The protected handler is installed by the current app.
  window.startInlineTest = function () {
    var contentArea = document.getElementById("topicContent");
    if (contentArea) contentArea.textContent = "Локальная проверка отключена. Тесты загружаются только из защищённого серверного банка.";
  };

  function patchSelfworkTab() {
    if (!window.switchTopicTab || window.__selfworkPatched) return;
    var orig = window.switchTopicTab;
    if (typeof orig !== 'function') return;
    window.__selfworkPatched = true;
    window.switchTopicTab = function (tabName) {
      orig.apply(this, arguments);
      if (tabName !== 'selfwork') return;
      var contentArea = document.getElementById('topicContent');
      if (!contentArea) return;
      var parts = (location.hash || '').replace(/^#/, '').split('/').filter(Boolean);
      var topicId = parts[0] === 'topic' ? parts[2] : null;
      if (!topicId) return;
      var courseId = parts[1] || (window.state && window.state.activeCourseId) || '07.01';
      var course = window.MDK_DATA && window.MDK_DATA[courseId];
      var topic = null;
      if (course) course.sections.forEach(function (s) { s.topics.forEach(function (t) { if (t.id === topicId) topic = t; }); });
      if (!topic || !topic.selfWork || !topic.selfWork.length) return;
      var html = '';
      topic.selfWork.forEach(function (work) {
        var testId = 'self_' + work.code;
        var isDone = window.state.results && window.state.results[testId];
        var qCount = collectSelfQuestions(topicId, work.code).length;
        html += '<div class="card module" style="margin-bottom:16px;padding:18px">' +
          '<h3 style="color:var(--accent);margin-top:0">' + work.code + ' ' + work.title + '</h3>' +
          (work.goal ? '<p><b>Цель:</b> ' + work.goal + '</p>' : '') +
          '<p><b>Задание:</b> ' + work.task + '</p>';
        if (work.questions && work.questions.length) {
          html += '<p><b>Контрольные вопросы:</b></p><ul>';
          work.questions.forEach(function (qq) { html += '<li>' + qq + '</li>'; });
          html += '</ul>';
        }
        if (qCount > 0) {
          if (isDone) {
            html += '<div style="padding:14px;background:var(--card-soft);border-radius:8px;border:1px solid var(--ok);margin-top:12px">' +
              '<b style="color:var(--ok)">✅ Тест выполнен</b> — оценка: <b>' + (isDone.grade || '—') + '</b><br>' +
              '<button class="btn ghost" style="margin-top:10px" onclick="window.startInlineTest(\'' + topicId + '\', \'' + work.code + '\')">Пройти заново</button></div>';
          } else {
            html += '<div style="text-align:center;padding:18px;background:var(--card-soft);border-radius:8px;margin-top:12px">' +
              '<p>Проверка в форме теста · вопросов: <b>' + qCount + '</b></p>' +
              '<button class="btn" style="padding:12px 28px;font-size:16px" onclick="window.startInlineTest(\'' + topicId + '\', \'' + work.code + '\')">📝 Начать тест по самостоятельной</button></div>';
          }
        }
        html += '</div>';
      });
      contentArea.innerHTML = html;
    };
  }

  function boot() { patchSelfworkTab(); }
  boot();
  document.addEventListener('DOMContentLoaded', boot);
  setTimeout(boot, 600);
  setTimeout(boot, 2000);
})();
