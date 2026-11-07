"use strict";

window.renderNewExam = function(courseId) {
    var app = document.getElementById("app");
    var data = window.MDK_DATA && window.MDK_DATA[courseId];
    var title = data && data.title ? data.title : courseId;
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>' +
      '<section class="hero"><h1>📋 Итоговый экзамен</h1><p>' + window.escapeHtml(title) + '</p><p>До 30 вопросов из банка дисциплины · 2 письменных задания · 45 минут</p></section>' +
      '<div class="module" id="examBox"><button class="btn" id="startCourseExam" style="width:100%;padding:20px;font-size:18px;">Начать экзамен</button></div>';
    var start = document.getElementById("startCourseExam");
    if (start) start.onclick = function () { window.startExam(courseId); };
};

window.startExam = function(courseId) {
    var data = window.MDK_DATA && window.MDK_DATA[courseId];
    var baseQuestions = [];
    var seen = Object.create(null);
    if (data && Array.isArray(data.sections)) {
        data.sections.forEach(function(section) {
            (section.topics || []).forEach(function(topic) {
                var candidates = (topic.test || []).slice();
                if (window.HARD_TESTS && Array.isArray(window.HARD_TESTS[topic.id])) candidates = candidates.concat(window.HARD_TESTS[topic.id]);
                candidates.forEach(function(q) {
                    if (!q || typeof q.q !== "string" || !Array.isArray(q.options) ||
                        !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length || q.options.length < 2) return;
                    var key = q.q.trim().toLocaleLowerCase("ru");
                    if (!key || seen[key]) return;
                    seen[key] = true;
                    baseQuestions.push({ q: q.q, options: q.options.slice(), correct: q.correct });
                });
            });
        });
    }
    if (!baseQuestions.length) {
        document.getElementById("examBox").innerHTML = '<p>В этой дисциплине пока нет подготовленного банка экзаменационных вопросов. Заглушки не подставляются.</p>';
        return;
    }
    function shuffle(list) {
        var copy = list.slice();
        for (var i = copy.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
        }
        return copy;
    }
    var examQuestions = shuffle(baseQuestions).slice(0, 30);
    var writtenPrompts = courseId === "SPRUT_TP" ? [
        "Составьте алгоритм разработки технологического процесса по исходному чертежу: укажите необходимые исходные данные, выбор заготовки и баз, последовательность операций и контроль.",
        "Сравните маршрутный, операционный и маршрутно-операционный варианты документации. Объясните, какие сведения должны быть проверены перед выпуском комплекта ТД."
    ] : courseId === "MCAM" ? [
        "Опишите подготовку проекта обработки в Mastercam: модель, WCS/Cplane/Tplane, заготовка, инструмент и проверка траектории.",
        "Объясните назначение постпроцессора и перечислите проверки NC-программы до передачи на станок."
    ] : [
        "Опишите алгоритм выполнения ключевой производственной задачи по изученной дисциплине, указав исходные данные, этапы и контрольные точки.",
        "Приведите пример возможной ошибки, объясните её последствия и предложите способ проверки результата."
    ];
    var formHtml = '<div id="exTimer" style="font-size:24px;font-weight:bold;color:var(--err);text-align:center;margin-bottom:20px;">45:00</div>' +
      '<p>Вопросов в варианте: <b>' + examQuestions.length + '</b>. Каждый вопрос оценивается в один балл.</p><form id="examForm">';
    examQuestions.forEach(function(q, i) {
        formHtml += '<div style="margin-bottom:15px;padding:15px;background:var(--card-soft);border-radius:8px;border:1px solid var(--border);"><b>' +
          (i + 1) + '. ' + window.escapeHtml(q.q) + '</b>';
        q.options.forEach(function(opt, j) {
            formHtml += '<label style="display:block;margin-top:7px;cursor:pointer;"><input type="radio" name="q' + i + '" value="' + j + '" style="margin-right:8px;"> ' +
              window.escapeHtml(opt) + '</label>';
        });
        formHtml += '</div>';
    });
    formHtml += '<h3 style="margin-top:30px;color:var(--accent);">✍️ Письменные задания (на проверку преподавателю)</h3>';
    writtenPrompts.forEach(function(prompt, i) {
        formHtml += '<div style="margin-bottom:15px;padding:15px;background:var(--card-soft);border-radius:8px;border:1px solid var(--border);"><b>' +
          (examQuestions.length + i + 1) + '. ' + window.escapeHtml(prompt) + '</b><textarea name="written' + (i + 1) +
          '" class="self-input" rows="4" style="margin-top:10px;" placeholder="Ваш ответ..."></textarea></div>';
    });
    formHtml += '<button type="button" class="btn" id="finishCourseExam" style="width:100%;padding:15px;background:var(--ok);color:#000;">Завершить экзамен</button></form>';
    document.getElementById("examBox").innerHTML = formHtml;
    window._currentExamQuestions = examQuestions;
    window._currentExamCourseId = courseId;
    var timeLeft = 45 * 60;
    var timerEl = document.getElementById("exTimer");
    if (window._examTimer) clearInterval(window._examTimer);
    document.getElementById("finishCourseExam").onclick = window.finishExam;
    window._examTimer = setInterval(function() {
        timeLeft--;
        if (timerEl) timerEl.textContent = Math.floor(timeLeft / 60) + ":" + String(timeLeft % 60).padStart(2, "0");
        if (timeLeft <= 0) window.finishExam();
    }, 1000);
};

window.finishExam = function() {
    if (window._examTimer) clearInterval(window._examTimer);
    var form = document.getElementById("examForm");
    if (!form || !Array.isArray(window._currentExamQuestions)) return;
    var correct = 0;
    window._currentExamQuestions.forEach(function(q, i) {
        var answer = form.querySelector('input[name="q' + i + '"]:checked');
        if (answer && Number(answer.value) === q.correct) correct++;
    });
    var total = window._currentExamQuestions.length;
    var pct = Math.round((correct / total) * 100);
    var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
    var written1 = (form.querySelector('textarea[name="written1"]') || {}).value || "";
    var written2 = (form.querySelector('textarea[name="written2"]') || {}).value || "";
    if (!window.state.results) window.state.results = {};
    window.state.results["__final__"] = { grade: grade, total: correct, max: total, courseId: window._currentExamCourseId };
    if (!window.state.examSubmissions) window.state.examSubmissions = [];
    window.state.examSubmissions.push({
        date: new Date().toLocaleString(),
        courseId: window._currentExamCourseId,
        student: window.state.student ? window.state.student.name : "Неизвестный",
        group: window.state.student ? window.state.student.group : "",
        testScore: correct, maxTest: total, written1: written1, written2: written2,
        status: "На проверке", teacherGrade: null
    });
    if (window.saveStudentData) window.saveStudentData();
    var passed = grade >= 3;
    document.getElementById("examBox").innerHTML =
      '<div style="text-align:center;padding:40px;"><h1 style="color:' + (passed ? "var(--ok)" : "var(--err)") + ';">' +
      (passed ? "Экзамен сдан!" : "Экзамен не сдан") + '</h1><p style="font-size:20px;">Тестовых ответов: <b>' +
      correct + ' из ' + total + '</b></p><h1 style="font-size:60px;margin:20px 0;color:var(--accent);">Оценка: ' +
      grade + '</h1><p>Письменные задания отправлены преподавателю на проверку.</p><a href="#/" class="btn" style="margin-top:20px;">На главную</a></div>';
};