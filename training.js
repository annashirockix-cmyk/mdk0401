"use strict";

window.renderTrainingPage = function(mdkId) {
  var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
  
  // Если МДК не передан, берем текущий
  var currentMdk = mdkId || window.state.activeCourseId;
  var course = window.MDK_DATA[currentMdk];
  
  if (!course) {
      app.innerHTML += '<div class="module">Курс не найден.</div>'; return;
  }

  app.appendChild(el(`<section class="hero"><h1>🎯 Тренировка</h1><p>${course.shortName}: Выберите тему для проверки знаний</p></section>`));

  // Собираем все темы, в которых есть тесты
  var availableTopics = [];
  course.sections.forEach(sec => {
      sec.topics.forEach(t => {
          if ((t.test && t.test.length > 0) || (t.tests && t.tests.length > 0)) {
              availableTopics.push(t);
          }
      });
  });

  if (availableTopics.length === 0) {
      app.innerHTML += '<div class="module">В этом МДК пока нет вопросов для тренировки.</div>';
      return;
  }

  // Выпадающий список тем
  var selectorHtml = `<div class="module" style="text-align:center; padding:40px;">
      <h3 style="margin-top:0;">Выберите тему:</h3>
      <select id="trainingTopicSelect" class="self-input" style="max-width:400px; margin: 0 auto 20px; font-size:16px; padding:12px;">
          <option value="all">🌟 Все темы (Случайные вопросы)</option>`;
  
  availableTopics.forEach(t => {
      selectorHtml += `<option value="${t.id}">${t.code} ${t.title}</option>`;
  });
  
  selectorHtml += `</select>
      <br>
      <button class="btn" onclick="window.startTraining('${currentMdk}')" style="padding:15px 40px; font-size:18px;">Начать тренировку</button>
  </div>`;
  
  app.innerHTML += selectorHtml;
};

window.startTraining = function(mdkId) {
  var app = document.getElementById("app"); if (!app) return;
  var select = document.getElementById("trainingTopicSelect");
  if (!select) return;
  var selectedTopicId = select.value;
  
  var course = window.MDK_DATA[mdkId];
  var allQuestions = [];
  
  course.sections.forEach(sec => {
      sec.topics.forEach(t => {
          if (selectedTopicId === "all" || t.id === selectedTopicId) {
              if (t.test) allQuestions = allQuestions.concat(t.test);
              if (t.tests) allQuestions = allQuestions.concat(t.tests);
          }
      });
  });

  if (allQuestions.length === 0) {
      window.showToast("В этой теме нет вопросов.", "err");
      return;
  }

  // Перемешиваем вопросы
  var questions = allQuestions.sort(function(){ return Math.random() - 0.5; });
  var idx = 0, correct = 0, answered = 0;

  app.innerHTML = "";
  app.appendChild(el('<a class="backlink" href="javascript:void(0)" onclick="window.renderTrainingPage(\''+mdkId+'\')" style="color:var(--accent); cursor:pointer;">← Выбрать другую тему</a>'));
  app.appendChild(el(`<section class="hero"><h1>🎯 Тренировка (${selectedTopicId === "all" ? "Все темы" : "Выбранная тема"})</h1><p>Вопросов: ${questions.length}</p></section>`));
  
  var box = document.createElement("div"); box.className = "module"; app.appendChild(box);

  function renderQuestion() {
    if (idx >= questions.length) {
      box.innerHTML = '<div style="text-align:center; padding:20px;"><h2>Тренировка завершена!</h2><p>Верных ответов: <b style="color:var(--ok);">' + correct + '</b> из <b>' + answered + '</b></p><div style="display:flex; gap:10px; justify-content:center; margin-top:20px;"><button class="btn" onclick="window.startTraining(\''+mdkId+'\')">Еще раз</button><a class="btn ghost" href="#/final/'+mdkId+'">Перейти к экзамену</a></div></div>';
      return;
    }
    var q = questions[idx];
    var html = '<div style="font-weight:bold; margin-bottom:15px; font-size:18px;">' + (idx + 1) + '. ' + q.q + '</div>';
    q.options.forEach(function(opt, i){
      html += '<button class="tr-opt" data-i="' + i + '" style="display:block; width:100%; text-align:left; padding:12px; margin-bottom:8px; background:var(--card-soft); border:1px solid var(--border); border-radius:8px; color:var(--text); cursor:pointer; font-size:15px;">' + opt + '</button>';
    });
    html += '<div id="trFb" style="margin-top:15px; font-weight:bold; min-height:24px;"></div><div style="margin-top:20px;"><button class="btn ghost" id="trSkip">Пропустить →</button></div>';
    box.innerHTML = html;
    
    box.querySelectorAll(".tr-opt").forEach(function(btn){
      btn.onclick = function(){
        var selectedI = Number(btn.getAttribute("data-i"));
        var isCorrect = (selectedI === q.correct);
        if (isCorrect) correct++;
        answered++;
        box.querySelectorAll(".tr-opt").forEach(function(b){ b.disabled = true; b.style.opacity = 0.6; });
        btn.style.opacity = 1; btn.style.borderColor = isCorrect ? "var(--ok)" : "var(--err)";
        if (!isCorrect) box.querySelectorAll(".tr-opt").forEach(function(b){ if (Number(b.getAttribute("data-i")) === q.correct) b.style.borderColor = "var(--ok)"; });
        var fb = box.querySelector("#trFb");
        fb.textContent = isCorrect ? "✅ Верно!" : '❌ Правильно: ' + q.options[q.correct];
        fb.style.color = isCorrect ? "var(--ok)" : "var(--err)";
        setTimeout(function(){ idx++; renderQuestion(); }, 1200);
      };
    });
    box.querySelector("#trSkip").onclick = function(){ idx++; renderQuestion(); };
  }
  renderQuestion();
};