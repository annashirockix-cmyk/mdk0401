"use strict";

var FINAL_EXAM_SIZE = 30;
var FINAL_EXAM_TIME = 60 * 60;

window.EXTRA_EXAM_BANKS = window.EXTRA_EXAM_BANKS || {};

function programById(id) {
  return window.MDK_DATA && window.MDK_DATA[id] ? window.MDK_DATA[id] : null;
}

function collectCourseQuestions(courseId) {
  var all = [];
  var course = programById(courseId);
  if (course && Array.isArray(course.sections)) {
    course.sections.forEach(function (section) {
      (section.topics || []).forEach(function (topic) {
        (topic.test || []).forEach(function (question) { all.push(question); });
      });
    });
  }
  var bankKey = String(courseId).replace(".", "");
  var primaryBank = window["EXAM_BANK_" + bankKey];
  var extensionBank = window.EXTRA_EXAM_BANKS[courseId];
  if (Array.isArray(primaryBank)) primaryBank.forEach(function (question) { all.push(question); });
  if (Array.isArray(extensionBank)) extensionBank.forEach(function (question) { all.push(question); });
  if (window.MDK_EXTRA_QUESTIONS && Array.isArray(window.MDK_EXTRA_QUESTIONS[courseId])) {
    window.MDK_EXTRA_QUESTIONS[courseId].forEach(function (question) { all.push(question); });
  }
  var seen = {};
  return all.filter(function (q) {
    if (!q || !q.q) return false;
    var signature = String(q.type || "mc") + "|" + q.q;
    if (seen[signature]) return false;
    seen[signature] = true;
    return true;
  });
}

function questionCount(course) {
  return course ? collectCourseQuestions(course.id).length : 0;
}

function examShuffle(items) {
  var copy = items.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i]; copy[i] = copy[j]; copy[j] = temp;
  }
  return copy;
}

function examNode(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function examLabel(text, input) {
  var label = examNode("label", "option");
  label.style.cssText = "display:flex;align-items:flex-start;gap:9px;padding:9px;margin:5px 0;cursor:pointer;border-radius:7px;background:var(--card-soft);";
  label.appendChild(input);
  label.appendChild(examNode("span", "", text));
  return label;
}

function renderExamQuestion(question, number) {
  var card = examNode("section", "question");
  card.style.cssText = "margin-bottom:16px;padding:16px;background:var(--card-soft);border:1px solid var(--border);border-radius:10px;";
  var type = question.type || "mc";
  var title = (number + 1) + ". " + question.q;
  card.appendChild(examNode("div", "q-text", title)).style.cssText = "font-weight:700;line-height:1.5;margin-bottom:12px;";
  if (question.context) {
    var context = examNode("div", "exam-context", question.context);
    context.style.cssText = "padding:10px 12px;margin:8px 0 12px;background:var(--card);border-left:3px solid var(--accent);border-radius:6px;line-height:1.5;";
    card.appendChild(context);
  }

  if (type === "multi") {
    var multiHint = examNode("div", "multi-hint", "Выберите все правильные варианты ответа.");
    multiHint.style.cssText = "font-size:13px;color:var(--accent);margin:-4px 0 10px;";
    card.appendChild(multiHint);
    (question.options || []).forEach(function (option, index) {
      var input = examNode("input"); input.type = "checkbox"; input.value = String(index); input.name = "q" + number;
      card.appendChild(examLabel(option, input));
    });
  } else if (type === "num") {
    var numeric = examNode("input", "self-input"); numeric.type = "number"; numeric.step = "any"; numeric.name = "q" + number;
    numeric.placeholder = question.unit ? "Ответ, " + question.unit : "Введите числовой ответ";
    numeric.style.maxWidth = "260px";
    card.appendChild(numeric);
    if (question.unit) card.appendChild(examNode("span", "", " " + question.unit));
  } else if (type === "order") {
    var items = examShuffle(question.items || []);
    items.forEach(function (item, index) {
      var row = examNode("div");
      row.style.cssText = "display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap;";
      row.appendChild(examNode("span", "", item));
      var select = examNode("select", "self-input");
      select.name = "q" + number + "_order_" + index;
      select.style.maxWidth = "100px";
      select.appendChild(examNode("option", "", "№"));
      for (var pos = 1; pos <= items.length; pos++) select.appendChild(new Option(String(pos), String(pos)));
      select.dataset.item = item;
      row.appendChild(select);
      card.appendChild(row);
    });
  } else if (type === "match") {
    var rightOptions = examShuffle((question.pairs || []).map(function (pair) { return pair.right; }));
    (question.pairs || []).forEach(function (pair, index) {
      var row = examNode("div");
      row.style.cssText = "display:grid;grid-template-columns:minmax(130px,1fr) minmax(150px,1.2fr);gap:10px;align-items:center;margin:8px 0;";
      row.appendChild(examNode("span", "", pair.left));
      var select = examNode("select", "self-input");
      select.name = "q" + number + "_match_" + index;
      select.appendChild(examNode("option", "", "Выберите соответствие"));
      rightOptions.forEach(function (option) { select.appendChild(new Option(option, option)); });
      row.appendChild(select); card.appendChild(row);
    });
  } else {
    (question.options || []).forEach(function (option, index) {
      var input = examNode("input"); input.type = "radio"; input.name = "q" + number; input.value = String(index);
      card.appendChild(examLabel(option, input));
    });
  }
  return card;
}

function scoreExamQuestion(question, form, number) {
  var type = question.type || "mc";
  if (type === "num") {
    var field = form.querySelector('[name="q' + number + '"]');
    if (!field || field.value.trim() === "") return 0;
    var value = Number(field.value);
    return Number.isFinite(value) && Math.abs(value - Number(question.answer)) <= (question.tol || 0.01) ? 1 : 0;
  }
  if (type === "multi") {
    var selected = Array.prototype.map.call(form.querySelectorAll('input[name="q' + number + '"]:checked'), function (el) { return Number(el.value); }).sort();
    var expected = (question.correct || []).slice().sort(function (a, b) { return a - b; });
    return selected.length === expected.length && selected.every(function (v, i) { return v === expected[i]; }) ? 1 : 0;
  }
  if (type === "order") {
    var correctOrder = question.correctOrder || question.items || [];
    var fields = form.querySelectorAll('[name^="q' + number + '_order_"]');
    var right = 0;
    Array.prototype.forEach.call(fields, function (field) {
      var expectedPosition = correctOrder.indexOf(field.dataset.item) + 1;
      if (expectedPosition > 0 && Number(field.value) === expectedPosition) right++;
    });
    return fields.length ? right / fields.length : 0;
  }
  if (type === "match") {
    var pairs = question.pairs || [];
    var rightMatches = 0;
    pairs.forEach(function (pair, index) {
      var field = form.querySelector('[name="q' + number + '_match_' + index + '"]');
      if (field && field.value === pair.right) rightMatches++;
    });
    return pairs.length ? rightMatches / pairs.length : 0;
  }
  var checked = form.querySelector('input[name="q' + number + '"]:checked');
  return checked && Number(checked.value) === question.correct ? 1 : 0;
}

window.renderFinalExamPage = function (mdkId) {
  var app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = "";

  if (!mdkId) {
    app.appendChild(examNode("a", "backlink", "← На главную")).href = "#/";
    app.appendChild(examNode("section", "hero", "Итоговые экзамены"));
    var intro = examNode("p", "", "Экзамены по дисциплинам: тестовые задания разных типов, практические ситуации и письменная часть.");
    app.querySelector(".hero").appendChild(intro);
    var grid = examNode("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;";
    Object.values(window.MDK_DATA || {}).forEach(function (course) {
      var count = questionCount(course);
      var card = examNode("a", "module");
      card.href = "#/final/" + course.id;
      card.style.cssText = "display:block;padding:20px;text-decoration:none;color:var(--text);background:var(--card-soft);border:1px solid var(--border);border-radius:12px;";
      card.appendChild(examNode("b", "brand-badge", course.shortName));
      card.appendChild(examNode("h3", "", course.title));
      card.appendChild(examNode("p", "", "В банке " + count + " вопросов и заданий"));
      grid.appendChild(card);
    });
    app.appendChild(grid);
    return;
  }

  var course = programById(mdkId);
  if (!course) { location.hash = "#/final"; return; }
  var back = examNode("a", "backlink", "← К списку экзаменов"); back.href = "#/final"; app.appendChild(back);
  var hero = examNode("section", "hero");
  hero.appendChild(examNode("span", "brand-badge", course.shortName));
  hero.appendChild(examNode("h1", "", "Итоговый экзамен"));
  var duration = Math.round(FINAL_EXAM_TIME / 60);
  hero.appendChild(examNode("p", "", "30 заданий разных форматов + 2 письменных задания · " + duration + " минут"));
  app.appendChild(hero);

  var mount = examNode("div", "module");
  var start = examNode("button", "btn", "Начать экзамен"); start.type = "button"; start.style.cssText = "width:100%;padding:16px;font-size:17px;";
  mount.appendChild(start); app.appendChild(mount);

  start.addEventListener("click", function () {
    if (!start.dataset.attemptChecked && window.state && window.state.student && window.API && window.API.getTestAttemptStatus) {
      start.disabled=true;
      window.API.getTestAttemptStatus(course.id,"__final__"+course.id).then(function(status){
        if(!status||status.allowed===false){mount.innerHTML="<h3>Попытки экзамена закончились</h3><p>Обратитесь к преподавателю за дополнительной попыткой.</p>";return;}
        start.dataset.attemptChecked="1";start.disabled=false;start.click();
      }).catch(function(error){mount.textContent="Не удалось проверить доступ к экзамену: "+(error.message||"ошибка сервера");});
      return;
    }
    var bank = collectCourseQuestions(mdkId);
    if (!bank.length) { mount.textContent = "Банк экзаменационных вопросов пока пуст."; return; }
    var examLimit = Math.min(FINAL_EXAM_SIZE, bank.length);
    var selected = [];
    // Для всех курсов гарантируем смешанный вариант, если в банке есть задания нужного типа.
    {
      [["multi", 5], ["order", 2], ["match", 2], ["num", 1]].forEach(function (rule) {
        var candidates = examShuffle(bank.filter(function (question) {
          return (question.type || "mc") === rule[0] && selected.indexOf(question) === -1;
        }));
        selected = selected.concat(candidates.slice(0, rule[1]));
      });
    }
    var remaining = examShuffle(bank.filter(function (question) { return selected.indexOf(question) === -1; }));
    var picked = examShuffle(selected.concat(remaining.slice(0, Math.max(0, examLimit - selected.length))));
    mount.innerHTML = "";
    var timerBox = examNode("div", "exam-timer", duration + ":00");
    timerBox.style.cssText = "font-size:24px;font-weight:700;text-align:center;margin-bottom:18px;color:var(--accent);";
    mount.appendChild(timerBox);
    var form = examNode("form");
    form.addEventListener("submit", function (event) { event.preventDefault(); });
    picked.forEach(function (question, index) { form.appendChild(renderExamQuestion(question, index)); });

    var writtenTitle = examNode("h3", "", "✍️ Письменная и ситуационная часть");
    writtenTitle.style.color = "var(--accent)"; form.appendChild(writtenTitle);
    var writtenPrompts = mdkId === "04.01" ? [
      "Составьте последовательность диагностирования станка при росте вибрации шпиндельного узла. Укажите исходные данные, приборы, контрольные точки, критерии остановки и форму фиксации результатов.",
      "По результатам диагностики выявлены повышенная температура опоры, рост вибрации и металлические частицы в масле. Предложите дерево возможных причин, укажите, какие проверки помогут их разделить, и обоснуйте решение: продолжить работу, выполнить регулировку или вывести узел в ремонт."
    ] : [
      "Опишите алгоритм подготовки оборудования к выполнению технологической операции с указанием контрольных точек.",
      "Разберите ситуацию отклонения параметров оборудования от нормы: установите возможные причины, способ проверки и корректирующие действия."
    ];
    writtenPrompts.forEach(function (prompt, index) {
      var wrap = examNode("div");
      wrap.style.cssText = "margin:12px 0;padding:15px;background:var(--card-soft);border:1px solid var(--border);border-radius:8px;";
      wrap.appendChild(examNode("b", "", (picked.length + index + 1) + ". " + prompt));
      var area = examNode("textarea", "self-input"); area.name = "written" + (index + 1); area.rows = 5;
      area.placeholder = "Разверните решение, укажите ход рассуждений и вывод...";
      area.style.marginTop = "10px"; wrap.appendChild(area); form.appendChild(wrap);
    });

    var submit = examNode("button", "btn", "Завершить экзамен"); submit.type = "button";
    submit.style.cssText = "width:100%;margin-top:18px;padding:15px;font-size:16px;";
    form.appendChild(submit); mount.appendChild(form);

    var timeLeft = duration * 60;
    var timer = setInterval(function () {
      if (!document.body.contains(timerBox)) { clearInterval(timer); return; }
      timeLeft--;
      timerBox.textContent = String(Math.floor(timeLeft / 60)).padStart(2, "0") + ":" + String(timeLeft % 60).padStart(2, "0");
      if (timeLeft <= 60) timerBox.style.color = "var(--err)";
      if (timeLeft <= 0) submit.click();
    }, 1000);

    var submitted = false;
    submit.addEventListener("click", function () {
      if (submitted) return;
      submitted = true; clearInterval(timer); submit.disabled = true;
      var points = 0;
      picked.forEach(function (question, index) { points += scoreExamQuestion(question, form, index); });
      var pct = Math.round(points / picked.length * 100);
      var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
      var written1 = form.querySelector('[name="written1"]').value;
      var written2 = form.querySelector('[name="written2"]').value;
      if (!window.state.results) window.state.results = {};
      if (!window.state.examSubmissions) window.state.examSubmissions = [];
      window.state.results["__final__" + course.id] = { grade: grade, total: Math.round(points * 100) / 100, max: picked.length, percent: pct };
      window.state.examSubmissions.push({
        date: new Date().toLocaleString("ru-RU"), courseId: course.id,
        student: window.state.student ? window.state.student.name : "Неизвестный",
        group: window.state.student ? window.state.student.group : "",
        testScore: Math.round(points * 100) / 100, maxTest: picked.length,
        written1: written1, written2: written2, status: "На проверке",
        teacherGrade: null, finalGrade: null
      });
      if (window.saveStudentData) window.saveStudentData();
      if (window.state.student && window.API && window.API.saveResult) {
        Promise.resolve(window.API.saveResult({
          email: window.state.student.email, name: window.state.student.name, group: window.state.student.group,
          testId: "__final__" + course.id, testTitle: "Итоговый экзамен " + course.shortName,
          grade: grade, score: points, maxScore: picked.length, percent: pct, timeSpent: duration * 60 - timeLeft, courseId: course.id
        })).catch(function (error) { console.warn("Не удалось отправить результат экзамена", error); });
      }
      mount.innerHTML = "";
      var result = examNode("div", "exam-result");
      result.style.cssText = "text-align:center;padding:30px;";
      result.appendChild(examNode("h2", "", course.shortName + " · экзамен завершён"));
      result.appendChild(examNode("p", "", "Баллы за тестовую часть: " + Math.round(points * 100) / 100 + " из " + picked.length + " (" + pct + "%)"));
      var gradeNode = examNode("h1", "exam-grade", "Предварительная оценка: " + grade);
      gradeNode.style.cssText = "font-size:42px;margin:20px 0;color:" + (grade >= 3 ? "var(--ok)" : "var(--err)");
      result.appendChild(gradeNode);
      result.appendChild(examNode("p", "", "Письменные задания переданы на проверку преподавателю. Итоговая оценка может быть скорректирована после их проверки."));
      var home = examNode("a", "btn", "К списку экзаменов"); home.href = "#/final"; result.appendChild(home);
      mount.appendChild(result);
    });
  });
};
