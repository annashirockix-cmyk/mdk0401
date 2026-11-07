"use strict";
/**
 * portal-final.js — финальные патчи портала МДК
 * - Банк вопросов для самостоятельных/тестов (t-1-1 …)
 * - Письменные ответы (written_*) → payload → журнал/отчёты
 * - Рейтинг / отчёты / админка поверх getStudents + payload
 * - Дедуп вкладки «Экзамен»
 * Загружать ПОСЛЕДНИМ после app.js, rating.js, reports.js, admin.js, journal.js
 */
(function () {
  var B = {
    "t-1-1": [
      { q: "Перед началом смены проверяют:", options: ["Ограждения и аварийный останов", "Цвет станины", "Марку ветоши", "Версию ПО"], correct: 0 },
      { q: "Стружку удаляют:", options: ["Крючком после останова", "Руками на ходу", "Струёй воздуха в лицо", "Ветошью на ходу"], correct: 0 },
      { q: "Ключ в патроне:", options: ["Запрещено оставлять", "Можно при паузе", "Кладут на станину", "Держат в кармане"], correct: 0 },
      { q: "Измерять деталь можно:", options: ["Только после полного останова", "На ходу шпинделя", "При открытом ограждении", "Под СОЖ"], correct: 0 },
      { q: "Ключ от патрона можно оставлять в патроне на время паузы.", options: ["Верно", "Неверно"], correct: 1 }
    ],
    "t-1-2": [
      { q: "Главное преимущество ЧПУ:", options: ["Повторяемость размеров", "Меньший вес", "Дешевизна", "Нет стружки"], correct: 0 },
      { q: "Токарный ЧПУ чаще:", options: ["2-осевой (X, Z)", "1-осевой", "Только шпиндель", "Без осей"], correct: 0 },
      { q: "Станок с ЧПУ всегда дешевле универсального.", options: ["Верно", "Неверно"], correct: 1 }
    ],
    "t-1-3": [
      { q: "Суппорт служит для:", options: ["Перемещения резца", "Крепления детали", "Подачи СОЖ", "Счёта оборотов"], correct: 0 },
      { q: "Передняя бабка содержит шпиндель.", options: ["Верно", "Неверно"], correct: 0 },
      { q: "Задняя бабка чаще нужна для:", options: ["Поддержки длинной заготовки", "Крепления резца", "Смены патрона", "Подачи СОЖ"], correct: 0 }
    ],
    "t-1-4": [
      { q: "При возгорании масляной СОЖ нельзя:", options: ["Тушить водой", "Нажать стоп", "Сообщить мастеру", "Использовать CO₂"], correct: 0 },
      { q: "Перчатки на вращающемся токарном станке запрещены.", options: ["Верно", "Неверно"], correct: 0 },
      { q: "Стружку с вращающейся детали снимают руками.", options: ["Верно", "Неверно"], correct: 1 }
    ],
    "t-2-1": [
      { q: "База по Z в патроне чаще:", options: ["Торец заготовки", "Ось шпинделя", "Канавка", "Задняя бабка"], correct: 0 },
      { q: "Черновой проход — с меньшей подачей, чем чистовой.", options: ["Верно", "Неверно"], correct: 1 },
      { q: "Канавку на валу точат:", options: ["Канавочным резцом", "Проходным упорным", "Метчиком", "Центровкой"], correct: 0 }
    ],
    "t-2-2": [
      { q: "Резьбу контролируют:", options: ["Калибром / шаблоном", "Линейкой", "На глаз", "По цвету стружки"], correct: 0 },
      { q: "Шаг резьбы M16×2 равен 2 мм.", options: ["Верно", "Неверно"], correct: 0 },
      { q: "Диаметр отверстия под M10×1.5 примерно:", options: ["8.5 мм", "10 мм", "6 мм", "12 мм"], correct: 0 }
    ],
    "t-2-3": [
      { q: "Конус на токарном с ЧПУ чаще получают:", options: ["Интерполяцией по X и Z", "Только напильником", "Только задней бабкой", "Без программы"], correct: 0 },
      { q: "Для конуса достаточно одной оси подачи.", options: ["Верно", "Неверно"], correct: 1 }
    ],
    "t-3-1": [
      { q: "Первый этап подготовки УП:", options: ["Анализ чертежа и технология", "Постпроцессирование", "Запись на флешку", "Покраска"], correct: 0 },
      { q: "УП можно писать без выбора инструмента.", options: ["Верно", "Неверно"], correct: 1 },
      { q: "CAM-система нужна для:", options: ["Построения траекторий и УП", "Только учёта кадров", "Сварки", "Сборки"], correct: 0 }
    ],
    "t-3-2": [
      { q: "Операционная карта содержит:", options: ["Переходы, инструмент, режимы", "Только ФИО", "Только цену", "Рецепт СОЖ"], correct: 0 },
      { q: "Технологическая документация для ЧПУ не нужна.", options: ["Верно", "Неверно"], correct: 1 }
    ],
    "t-3-3": [
      { q: "Система координат детали (СКД) привязана к:", options: ["Базам на детали/заготовке", "Полу цеха", "Окну Windows", "Цвету станка"], correct: 0 },
      { q: "Ось Z на токарном обычно вдоль оси шпинделя.", options: ["Верно", "Неверно"], correct: 0 },
      { q: "WCS в CAM — это:", options: ["Рабочая система координат", "Цвет фона", "Тип СОЖ", "Номер смены"], correct: 0 }
    ],
    "t-3-4": [
      { q: "Элементы контура — это:", options: ["Прямые, дуги, точки перехода", "Только отверстия", "Только резьба", "Только канавки"], correct: 0 }
    ],
    "t-3-5": [
      { q: "Эквидистанта — это:", options: ["Траектория центра инструмента со смещением на радиус", "Линия подачи СОЖ", "Ось шпинделя", "Кадр M30"], correct: 0 },
      { q: "G41/G42 относятся к:", options: ["Коррекции радиуса инструмента", "Оборотам", "Смене патрона", "Останову"], correct: 0 },
      { q: "При коррекции радиуса фрезы траектория смещается.", options: ["Верно", "Неверно"], correct: 0 }
    ],
    "t-3-6": [
      { q: "Постпроцессор переводит траектории в:", options: ["Коды конкретного станка (G/M)", "Чертёж", "Прайс", "Фото"], correct: 0 }
    ],
    "t-4-1": [
      { q: "G00 — это:", options: ["Быстрый ход (позиционирование)", "Линейная интерполяция", "Круговая", "Смена инструмента"], correct: 0 },
      { q: "G01 — линейная интерполяция с рабочей подачей.", options: ["Верно", "Неверно"], correct: 0 }
    ],
    "t-4-2": [
      { q: "G02/G03 — круговая интерполяция.", options: ["Верно", "Неверно"], correct: 0 }
    ],
    "t-5-1": [
      { q: "Перед запуском УП обязательно:", options: ["Проверка нулей, инструмента, ограждений", "Выключить СОЖ", "Открыть дверь", "Снять патрон"], correct: 0 }
    ],
    "t-5-2": [
      { q: "Корректор длины инструмента хранится в:", options: ["Таблице смещений (offsets)", "Тексте программы как комментарий", "Паспорте станка только", "Нигде"], correct: 0 }
    ],
    "t-5-3": [
      { q: "3-осевой фрезер управляет осями:", options: ["X, Y, Z", "Только X", "Только C", "A и B"], correct: 0 }
    ]
  };

  function sh(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function nm(raw) {
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
      var pairs = q.options.map(function (opt, i) { return { opt: opt, ok: i === q.correct }; });
      pairs = sh(pairs);
      q.options = pairs.map(function (p) { return p.opt; });
      q.correct = pairs.findIndex(function (p) { return p.ok; });
    }
    return q;
  }

  function col(id, workIndex) {
    var L = [];
    var seen = {};
    function add(list) {
      (list || []).forEach(function (q) {
        var key = String(q && (q.q || q.question || q.text) || JSON.stringify(q));
        if (!seen[key]) { seen[key] = true; L.push(q); }
      });
    }
    if (B[id]) add(B[id]);
    try {
      var courseId = cid();
      var course = window.MDK_DATA && window.MDK_DATA[courseId];
      if (course) {
        (course.sections || []).forEach(function (section) {
          (section.topics || []).forEach(function (topic) {
            if (topic.id !== id) return;
            // Main topic test bank.
            add(topic.test || topic.tests || []);
            // Each independent-work bank uses its topic ID and work index.
            (topic.selfWork || []).forEach(function (work, index) {
              if (workIndex != null && Number(workIndex) !== index) return;
              var key = "self_" + id + "_" + index;
              var extra = window.EXTRA_TESTS && window.EXTRA_TESTS[key];
              if (extra && extra.questions) add(extra.questions);
            });
          });
        });
      }
    } catch (e) {}
    return L.map(nm).filter(Boolean);
  }

  function tid() {
    var p = (location.hash || "").replace(/^#/, "").split("/").filter(Boolean);
    return p[0] === "topic" ? p[2] : null;
  }
  function cid() {
    var p = (location.hash || "").replace(/^#/, "").split("/").filter(Boolean);
    return p[0] === "topic" ? p[1] : ((window.state && window.state.activeCourseId) || "07.01");
  }

  window.startInlineTest = function (topicId, selfWorkCode, selfIdx) {
    var area = document.getElementById("topicContent");
    if (!area) return;
    topicId = topicId || tid();
    selfIdx = typeof selfIdx === "number" ? selfIdx : 0;
    var student = window.state && window.state.student;
    if (!student || String(student.role || "student").toLowerCase() !== "student") {
      area.textContent = "Пройти тест можно под учётной записью обучающегося.";
      return;
    }
    if (!window.API || !window.API.getBuiltInTest || !window.API.submitBuiltInTest) {
      area.textContent = "Серверная проверка тестов пока недоступна. Обратитесь к администратору.";
      return;
    }
    var courseId = cid();
    var testId = selfWorkCode ? ("self_" + topicId + "_" + selfIdx) : ("test_" + topicId);
    var bankIds = selfWorkCode ? [("self_" + topicId + "_" + selfIdx), ("topic_" + topicId)] : [("topic_" + topicId), ("hard_" + topicId)];
    var testTitle = selfWorkCode ? ("Самостоятельная работа " + selfWorkCode) : ("Тест " + topicId);
    var startedAt = Date.now();
    area.textContent = "Проверяем доступ и загружаем вопросы из защищённого банка…";
    function fail(message) {
      area.innerHTML = "";
      var box = document.createElement("div"); box.className = "module"; box.style.padding = "20px";
      box.textContent = message || "Не удалось загрузить тест."; area.appendChild(box);
    }
    function node(tag, text) {
      var el = document.createElement(tag); if (text !== undefined && text !== null) el.textContent = String(text); return el;
    }
    function typeOf(q) {
      var t = String(q.type || "mc").toLowerCase();
      if (t === "multiple" || t === "multiple_choice") return "multi";
      if (t === "true_false") return "tf";
      if (t === "numeric" || t === "number") return "num";
      if (t === "ordering") return "order";
      if (t === "matching") return "match";
      return t;
    }
    var access = window.API.getTestAttemptStatus ? window.API.getTestAttemptStatus(courseId, testId) : Promise.resolve({ success: true, allowed: true });
    access.then(function (status) {
      if (status && status.allowed === false) throw new Error("Попытки закончились. Обратитесь к преподавателю за дополнительной попыткой.");
      return window.API.getBuiltInTest(courseId, testId, bankIds);
    }).then(function (response) {
      if (!response || !response.success || !Array.isArray(response.questions) || !response.questions.length) {
        throw new Error("Для этой темы не найден импортированный банк вопросов. Попросите администратора повторно импортировать банк.");
      }
      var questions = response.questions.map(function (entry) { return entry.question || {}; });
      area.innerHTML = "";
      var form = document.createElement("form");
      var note = node("p", "Ответьте на все задания. Проверка и сохранение результата выполняются на сервере.");
      note.style.color = "var(--muted)"; form.appendChild(note);
      questions.forEach(function (q, index) {
        var type = typeOf(q), card = document.createElement("section");
        card.className = "question";
        card.style.cssText = "margin:12px 0;padding:16px;background:var(--card-soft);border:1px solid var(--border);border-radius:10px;";
        var title = node("div", (index + 1) + ". " + (q.q || q.question || q.text || "Вопрос"));
        title.style.cssText = "font-weight:700;line-height:1.5;margin-bottom:12px;"; card.appendChild(title);
        if (q.context) { var context = node("div", q.context); context.style.cssText = "margin:8px 0 12px;color:var(--muted);"; card.appendChild(context); }
        if (type === "num") {
          var numeric = node("input"); numeric.type = "number"; numeric.step = "any"; numeric.name = "q" + index;
          numeric.required = true; numeric.className = "self-input"; numeric.style.maxWidth = "260px";
          numeric.placeholder = q.unit ? ("Ответ, " + q.unit) : "Введите числовой ответ"; card.appendChild(numeric);
          if (q.unit) card.appendChild(node("span", " " + q.unit));
        } else if (type === "order") {
          var items = q.items || [];
          items.forEach(function (item, itemIndex) {
            var row = document.createElement("div"); row.style.cssText = "display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0;";
            row.appendChild(node("span", item));
            var select = document.createElement("select"); select.className = "self-input"; select.name = "q" + index + "_order_" + itemIndex;
            select.dataset.item = String(item); select.required = true; select.appendChild(new Option("Позиция", ""));
            for (var pos = 1; pos <= items.length; pos++) select.appendChild(new Option(String(pos), String(pos)));
            row.appendChild(select); card.appendChild(row);
          });
        } else if (type === "match") {
          var pairs = q.pairs || [], options = q.options || [];
          pairs.forEach(function (pair, pairIndex) {
            var row = document.createElement("div"); row.style.cssText = "display:grid;grid-template-columns:minmax(120px,1fr) minmax(150px,1.2fr);gap:10px;align-items:center;margin:8px 0;";
            row.appendChild(node("span", pair.left));
            var select = document.createElement("select"); select.className = "self-input"; select.name = "q" + index + "_match_" + pairIndex; select.required = true;
            select.appendChild(new Option("Выберите соответствие", ""));
            options.forEach(function (option) { select.appendChild(new Option(String(option), String(option))); });
            row.appendChild(select); card.appendChild(row);
          });
        } else {
          var options = q.options || (type === "tf" ? ["Верно", "Неверно"] : []);
          options.forEach(function (option, optionIndex) {
            var label = document.createElement("label"); label.style.cssText = "display:flex;align-items:flex-start;gap:9px;padding:9px;margin:5px 0;cursor:pointer;border-radius:7px;background:var(--card);";
            var input = document.createElement("input"); input.type = type === "multi" ? "checkbox" : "radio";
            input.name = "q" + index; input.value = String(optionIndex); label.appendChild(input); label.appendChild(node("span", option)); card.appendChild(label);
          });
        }
        form.appendChild(card);
      });
      var error = node("p", ""); error.style.color = "var(--err)"; error.setAttribute("role", "alert"); form.appendChild(error);
      var submit = node("button", "Отправить ответы на проверку"); submit.type = "submit"; submit.className = "btn";
      submit.style.cssText = "width:100%;margin-top:16px;padding:14px;"; form.appendChild(submit); area.appendChild(form);
      form.addEventListener("submit", function (event) {
        event.preventDefault(); if (submit.disabled) return;
        var answers = [], validation = "";
        questions.forEach(function (q, index) {
          if (validation) return;
          var type = typeOf(q), answer;
          if (type === "num") {
            var field = form.querySelector('[name="q' + index + '"]'); answer = field ? field.value.trim() : "";
            if (!answer) validation = "Заполните числовой ответ в задании " + (index + 1) + ".";
          } else if (type === "multi") {
            answer = Array.prototype.map.call(form.querySelectorAll('input[name="q' + index + '"]:checked'), function (el) { return Number(el.value); }).sort(function (a,b) { return a-b; });
            if (!answer.length) validation = "Выберите варианты в задании " + (index + 1) + ".";
          } else if (type === "order") {
            var fields = Array.prototype.slice.call(form.querySelectorAll('[name^="q' + index + '_order_"]'));
            var arranged = fields.map(function (field) { return { item: field.dataset.item, pos: Number(field.value) }; });
            if (!arranged.length || arranged.some(function (x) { return !x.pos; }) || new Set(arranged.map(function (x) { return x.pos; })).size !== arranged.length) validation = "Расставьте все элементы в задании " + (index + 1) + " без повторения позиций.";
            answer = arranged.sort(function (a,b) { return a.pos-b.pos; }).map(function (x) { return x.item; });
          } else if (type === "match") {
            var matchFields = Array.prototype.slice.call(form.querySelectorAll('[name^="q' + index + '_match_"]'));
            answer = matchFields.map(function (field) { return field.value; });
            if (!answer.length || answer.some(function (value) { return !value; })) validation = "Установите все соответствия в задании " + (index + 1) + ".";
          } else if (type === "tf" || type === "mc") {
            var selected = form.querySelector('input[name="q' + index + '"]:checked'); answer = selected ? Number(selected.value) : -1;
            if (answer < 0) validation = "Выберите ответ в задании " + (index + 1) + ".";
          } else {
            answer = Array.prototype.map.call(form.querySelectorAll('input[name="q' + index + '"]:checked'), function (el) { return Number(el.value); });
            if (!answer.length) validation = "Выберите ответ в задании " + (index + 1) + ".";
          }
          answers.push(answer);
        });
        if (validation) { error.textContent = validation; return; }
        submit.disabled = true; error.textContent = "Отправляем ответы на сервер…";
        window.API.submitBuiltInTest({ courseId: courseId, testId: testId, bankIds: bankIds, attemptId: response.attemptId, answers: answers, testTitle: testTitle, timeSpent: Math.max(0, Math.round((Date.now()-startedAt)/1000)) }).then(function (result) {
          if (!result || !result.success) throw new Error(result && result.error || "Сервер не подтвердил результат.");
          var rec = { grade: result.grade, percent: result.percent, score: result.score, max: result.maxScore, attempts: result.attempts, courseId: courseId, testTitle: testTitle, finishedAt: new Date().toISOString() };
          if (!window.state.results) window.state.results = {};
          window.state.results[testId] = rec;
          if (selfWorkCode) window.state.results["self_" + selfWorkCode] = rec;
          if (!(window.isStandaloneCourse && window.isStandaloneCourse(courseId))) window.state.xp = (window.state.xp || 0) + (Number(result.grade) || 0) * 10;
          if (window.saveStudentData) window.saveStudentData();
          if (window.renderUserChip) window.renderUserChip();
          area.innerHTML = "";
          var resultBox = document.createElement("div"); resultBox.className = "module"; resultBox.style.cssText = "text-align:center;padding:28px;";
          resultBox.appendChild(node("h2", "Тест завершён"));
          resultBox.appendChild(node("p", "Верных баллов: " + result.score + " / " + result.maxScore + " (" + result.percent + "%)"));
          var grade = node("h1", "Оценка: " + result.grade); grade.style.cssText = "font-size:44px;color:var(--accent);"; resultBox.appendChild(grade);
          if (Number(result.penaltyPoints) > 0) resultBox.appendChild(node("p", "С учётом нарушений снято " + result.penaltyPoints + " процентных пунктов."));
          var back = node("button", "Вернуться"); back.type = "button"; back.className = "btn";
          back.onclick = function () { if (window.switchTopicTab) window.switchTopicTab(selfWorkCode ? "selfwork" : "test"); };
          resultBox.appendChild(back); area.appendChild(resultBox);
        }).catch(function (error) { submit.disabled = false; error.textContent = error.message || "Не удалось отправить ответы."; });
      });
    }).catch(function (error) { fail(error.message || "Не удалось загрузить тест."); });
  };

  function renderSelf() {
    var area = document.getElementById("topicContent");
    if (!area) return;
    var topicId = tid();
    if (!topicId) return;
    var course = window.MDK_DATA && window.MDK_DATA[cid()];
    var topic = null;
    if (course) {
      (course.sections || []).forEach(function (s) {
        (s.topics || []).forEach(function (t) {
          if (t.id === topicId) topic = t;
        });
      });
    }
    if (!topic || !topic.selfWork || !topic.selfWork.length) {
      area.innerHTML = "<p>Нет самостоятельных работ по этой теме.</p>";
      return;
    }
    var html = "";
    topic.selfWork.forEach(function (work, idx) {
      var n = col(topicId, idx).length;
      var jKey = "self_" + topicId + "_" + idx;
      var leg = "self_" + work.code;
      var done = (window.state.results && (window.state.results[jKey] || window.state.results[leg])) || null;
      var written = (window.state.results && window.state.results["written_" + topicId + "_" + idx]) || "";
      var wtext = typeof written === "string" ? written : (written && written.text) || "";
      html +=
        '<div class="module" style="margin-bottom:18px;padding:18px">' +
        '<h3 style="color:var(--accent);margin-top:0">' + work.code + " " + work.title + "</h3>" +
        "<p><b>Задание:</b> " + (work.task || "") + "</p>";
      if (work.goal) html += "<p><b>Цель:</b> " + work.goal + "</p>";
      if (work.questions && work.questions.length) {
        html += "<p><b>Контрольные вопросы:</b></p><ul>";
        work.questions.forEach(function (qq) { html += "<li>" + qq + "</li>"; });
        html += "</ul>";
      }
      html +=
        '<div style="margin-top:14px"><label style="font-weight:600">Письменный ответ преподавателю:</label>' +
        '<textarea class="self-input wa" data-i="' + idx + '" rows="4" style="width:100%;margin-top:8px;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text)">' +
        wtext +
        "</textarea>" +
        '<button type="button" class="btn ghost btn-w" data-i="' + idx + '" style="margin-top:8px">Сохранить и отправить</button></div>';
      if (n > 0) {
        if (done && done.grade != null) {
          html +=
            '<div style="margin-top:12px;padding:12px;background:var(--card-soft);border-radius:8px;border:1px solid var(--ok)">' +
            '<b style="color:var(--ok)">Тест сдан</b> — оценка: <b>' + done.grade + "</b>" +
            (done.percent != null ? " (" + done.percent + "%)" : "") +
            '<br><button type="button" class="btn ghost btn-s" data-t="' + topicId + '" data-c="' + work.code +
            '" data-i="' + idx + '" style="margin-top:8px">Пройти снова</button></div>';
        } else {
          html +=
            '<div style="text-align:center;margin-top:12px;padding:16px;background:var(--card-soft);border-radius:8px">' +
            "<p>Тест · вопросов: <b>" + n + "</b></p>" +
            '<p style="font-size:13px;color:var(--muted)">Результат сохранится в журнал</p>' +
            '<button type="button" class="btn btn-s" data-t="' + topicId + '" data-c="' + work.code +
            '" data-i="' + idx + '" style="padding:12px 24px">Начать тест</button></div>';
        }
      } else {
        html += '<p style="color:var(--muted);margin-top:12px">Тестовый банк для этой самостоятельной работы не добавлен. Ответьте на контрольные вопросы выше письменно.</p>';
      }
      html += "</div>";
    });
    area.innerHTML = html;
    area.querySelectorAll(".btn-s").forEach(function (b) {
      b.onclick = function () {
        window.startInlineTest(b.getAttribute("data-t"), b.getAttribute("data-c"), +b.getAttribute("data-i"));
      };
    });
    area.querySelectorAll(".btn-w").forEach(function (b) {
      b.onclick = function () {
        var i = b.getAttribute("data-i");
        var ta = area.querySelector('.wa[data-i="' + i + '"]');
        var text = ta ? ta.value.trim() : "";
        if (!window.state.results) window.state.results = {};
        window.state.results["written_" + topicId + "_" + i] = {
          text: text,
          submittedAt: new Date().toISOString(),
          topicId: topicId,
          workIdx: i
        };
        if (window.saveStudentData) window.saveStudentData();
        b.textContent = "Отправлено ✓";
        b.disabled = true;
        if (window.showToast) window.showToast("Ответ сохранён и отправлен преподавателю", "ok");
      };
    });
  }

  function patchTopic() {
    if (!window.switchTopicTab) return;
    var orig = window.switchTopicTab;
    window.switchTopicTab = function (tab) {
      orig.apply(this, arguments);
      if (tab === "selfwork") setTimeout(renderSelf, 50);
      if (tab === "test") {
        setTimeout(function () {
          var area = document.getElementById("topicContent");
          if (!area) return;
          var id = tid();
          area.querySelectorAll("button").forEach(function (btn) {
            var t = (btn.textContent || "").toLowerCase();
            if (t.indexOf("начать") !== -1 || t.indexOf("пройти") !== -1) {
              btn.onclick = function () { window.startInlineTest(id, null, 0); };
            }
          });
        }, 80);
      }
    };
  }

  window.saveStudentData = function () {
    try {
      var st = window.state || {};
      var student = st.student || st.staff;
      if (!student || !student.email) return;
      var payload = {
        results: st.results || {},
        xp: st.xp || 0,
        achievements: st.achievements || [],
        progress: st.progress || {},
        activeCourseId: st.activeCourseId || "07.01",
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem("mdk.payload." + student.email.toLowerCase(), JSON.stringify(payload));
      localStorage.setItem("mdk.state", JSON.stringify({
        email: student.email,
        name: student.name,
        group: student.group,
        role: student.role,
        results: st.results,
        xp: st.xp
      }));
      if (window.API && window.API.saveStudent) {
        window.API.saveStudent(student.email, student.name, student.group, JSON.stringify(payload)).catch(function () {});
      }
    } catch (e) {
      console.warn("[portal-final] saveStudentData", e);
    }
  };

  window.renderRatingPage = function () {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML =
      '<a class="backlink" href="#/" style="color:var(--accent)">← На главную</a>' +
      '<section class="hero"><h1>Доска почёта</h1></section>' +
      '<div class="module" id="rb">Загрузка…</div>';
    var box = document.getElementById("rb");
    function paint(list) {
      if (!list.length) {
        box.innerHTML = '<p style="color:var(--muted)">Пока нет данных для рейтинга. Пройдите тесты — XP появится здесь.</p>';
        return;
      }
      var h = "";
      list.forEach(function (s, i) {
        h +=
          '<div style="display:flex;justify-content:space-between;padding:12px;margin:6px 0;background:var(--card-soft);border-radius:8px">' +
          "<div><b>" + (i + 1) + ". " + s.name + '</b> <span style="color:var(--muted);font-size:12px">(' + s.group + ")</span></div>" +
          '<div style="color:var(--gold)">' + s.xp + " XP</div></div>";
      });
      box.innerHTML = h;
    }
    if (!window.API || !window.API.getStudents) {
      paint([]);
      return;
    }
    window.API.getStudents()
      .then(function (d) {
        var st = (d && d.students) || [];
        if (!(d && (d.success || d.ok))) {
          box.innerHTML = "Нет данных. Обновите Code.gs (getStudents + payload).";
          return;
        }
        var list = st
          .map(function (s) {
            var p = {};
            try { p = JSON.parse(s.payload || "{}"); } catch (e) {}
            return {
              name: s.name || s.email || "—",
              group: s.group || "",
              role: (s.role || "student") + "",
              xp: +(p.xp || 0)
            };
          })
          .filter(function (s) { return (s.role + "").toLowerCase().indexOf("teacher") === -1; })
          .sort(function (a, b) { return b.xp - a.xp; });
        paint(list);
      })
      .catch(function (e) {
        box.textContent = String(e.message || e);
      });
  };


  window.renderAdminPanel = function () {
    var app = document.getElementById("app");
    if (!app) return;
    var ok =
      (window.state.staff && (window.state.staff.role === "teacher" || window.state.staff.role === "admin")) ||
      (window.state.student && (window.state.student.role === "teacher" || window.state.student.role === "admin"));
    if (!ok) {
      app.innerHTML = '<div class="module" style="text-align:center;padding:40px;color:var(--err)">Только для преподавателя</div>';
      return;
    }
    app.innerHTML =
      '<a class="backlink" href="#/" style="color:var(--accent)">← На главную</a>' +
      '<section class="hero"><h1>Админка</h1></section>' +
      '<div class="module"><h3>Студенты</h3><div id="ad">Загрузка…</div></div>' +
      '<div class="module" style="margin-top:12px">' +
      '<a class="btn ghost" href="#/journal">Журнал</a> ' +
      '<a class="btn ghost" href="#/reports">Отчёты</a> ' +
      '<a class="btn ghost" href="#/rating">Рейтинг</a></div>';
    var box = document.getElementById("ad");
    if (!window.API || !window.API.getStudents) {
      box.textContent = "API недоступен";
      return;
    }
    window.API.getStudents()
      .then(function (d) {
        var st = (d && d.students) || [];
        if (!(d && (d.success || d.ok))) {
          box.innerHTML = "Ошибка. Проверьте Code.gs → getStudents.";
          return;
        }
        var h =
          "<p>Всего: <b>" + st.length + "</b></p>" +
          '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">' +
          '<tr><th style="padding:6px;border:1px solid var(--border)">Email</th>' +
          '<th style="padding:6px;border:1px solid var(--border)">ФИО</th>' +
          '<th style="padding:6px;border:1px solid var(--border)">Группа</th>' +
          '<th style="padding:6px;border:1px solid var(--border)">Роль</th>' +
          '<th style="padding:6px;border:1px solid var(--border)">XP</th>' +
          '<th style="padding:6px;border:1px solid var(--border)">Работ</th></tr>';
        st.forEach(function (s) {
          var p = {};
          try { p = JSON.parse(s.payload || "{}"); } catch (e) {}
          var nRes = Object.keys(p.results || {}).length;
          h +=
            "<tr><td style=\"padding:6px;border:1px solid var(--border)\">" + (s.email || "") + "</td>" +
            "<td style=\"padding:6px;border:1px solid var(--border)\">" + (s.name || "") + "</td>" +
            "<td style=\"padding:6px;border:1px solid var(--border)\">" + (s.group || "") + "</td>" +
            "<td style=\"padding:6px;border:1px solid var(--border)\">" + (s.role || "") + "</td>" +
            "<td style=\"padding:6px;border:1px solid var(--border)\">" + (p.xp || 0) + "</td>" +
            "<td style=\"padding:6px;border:1px solid var(--border)\">" + nRes + "</td></tr>";
        });
        h += "</table></div>";
        box.innerHTML = h;
      })
      .catch(function (e) {
        box.textContent = String(e.message || e);
      });
  };

  function fixExam() {
    var nav = document.querySelector(".drawer-nav");
    if (!nav) return;
    var exams = nav.querySelectorAll('a[href*="#/final"], a[data-exam-v2], a[href*="exam"]');
    var seen = {};
    for (var i = 0; i < exams.length; i++) {
      var a = exams[i];
      var key = (a.getAttribute("href") || a.textContent || "").trim();
      if (seen[key]) {
        if (a.parentNode) a.parentNode.removeChild(a);
      } else {
        seen[key] = true;
      }
    }
  }

  function patchRouter() {
    if (!window.router) return;
    var o = window.router;
    window.router = function () {
      var p = ((location.hash || "").slice(1) || "/").split("/").filter(Boolean);
      var page = p[0] || "";
      if (page === "admin") { window.renderAdminPanel(); return; }
      if (page === "reports") { window.renderCourseReportsPage(); return; }
      if (page === "rating") { window.renderRatingPage(); return; }
      return o.apply(this, arguments);
    };
  }

  function boot() {
    patchTopic();
    patchRouter();
    fixExam();
  }
  boot();
  document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 400);
  setTimeout(boot, 1500);
  setTimeout(function () { patchTopic(); patchRouter(); fixExam(); }, 3000);
  console.log("[portal-final] ready v16");
})();
