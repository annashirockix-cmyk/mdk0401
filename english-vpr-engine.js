"use strict";
(function () {
  var oldRender = window.renderEnglishTestsPage;
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function esc(s) {
    return window.escapeHtml ? window.escapeHtml(String(s == null ? "" : s)) :
      String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; });
  }
  function activeCourse() {
    var id = window.state && window.state.activeCourseId || "EN";
    return id === "ENB" ? "ENB" : id === "ENT" ? "ENT" : "EN";
  }
  function courseForTrack(track) {
    return track === "technical" ? "ENT" : "ENB";
  }
  function renderPage(mode) {
    var app = document.getElementById("app");
    if (!app) return;
    // Режим, переданный каталогом, имеет приоритет над текущим переключателем дисциплины.
    // Иначе выбранный семестровый вариант подменялся старым экзаменом активного курса.
    var track = mode === "final-technical" ? "technical" : "basic";
    var course = courseForTrack(track);
    var hasCourseAccess = !window.canAccessCourse ||
      window.canAccessCourse(course) || window.canAccessCourse("EN");
    if (!window.state || (!window.state.student && !window.state.staff) || !hasCourseAccess) {
      app.innerHTML = '<section class="module">Нет доступа к выбранному экзамену. Попросите преподавателя открыть дисциплину ' + course + '.</section>';
      return;
    }
    app.setAttribute("translate","no"); app.classList.add("notranslate"); app.dataset.proctorAssessment="1"; app.dataset.testId="english_"+track+"_exam"; window._activeAssessmentCourseId=course;
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a><section class="hero notranslate" translate="no"><h1>🇬🇧 Итоговый экзамен по английскому</h1><p>Формат ВПР СПО 2026 · 7 заданий · 90 минут · максимум 40 баллов</p></section><section class="module" id="englishVprLoading">Загружаем защищённый вариант экзамена…</section>';
    if (!window.API || !window.API.getEnglishVprExam) { document.getElementById("englishVprLoading").textContent="Сервер экзаменов недоступен. Обратитесь к преподавателю."; return; }
    window.API.getEnglishVprExam(track).then(function(response) {
      if (!response || !response.success || !response.exam) throw new Error(response && response.error || "Экзамен не найден на сервере.");
      renderLoadedExam(response.exam,track,course,app);
    }).catch(function(error) {
      var loading=document.getElementById("englishVprLoading");
      if(loading) loading.textContent="Не удалось загрузить экзамен с сервера: "+(error.message||error)+". Обратитесь к преподавателю.";
    });
    return;
  }
  function renderLoadedExam(exam,track,course,app) {
    var tabs = el("section", "module");
    tabs.style.cssText = "display:flex;gap:8px;flex-wrap:wrap";
    if(track!=="basic" && (!window.canAccessCourse || window.canAccessCourse("ENB") || window.canAccessCourse("EN"))) { var b=el("button","btn ghost","Basic English"); b.type="button"; b.onclick=function(){renderPage("final-basic");}; tabs.appendChild(b); }
    if(track!=="technical" && (!window.canAccessCourse || window.canAccessCourse("ENT") || window.canAccessCourse("EN"))) { var t=el("button","btn ghost","Technical English"); t.type="button"; t.onclick=function(){renderPage("final-technical");}; tabs.appendChild(t); }
    app.appendChild(tabs);
    var panel = el("section", "module");
    panel.appendChild(el("h2", "", exam.title));
    panel.appendChild(el("p", "", "В работе: аудирование, чтение, лексика, грамматика, словообразование и письменные ответы. Время выполнения — 90 минут."));
    panel.appendChild(el("p", "museum-muted", "Задания 1–6 проверяются автоматически. Пять кратких ответов в задании 7 передаются преподавателю на проверку."));
    var key = exam.id || ("english_" + track + "_vpr2026_v2");
    var existing = window.state && window.state.results && window.state.results[key];
    if (existing) {
      panel.appendChild(el("p", "", "Работа уже отправлена. Статус: " + (existing.grade || "на проверке") + "."));
    } else {
      var start = el("button", "btn", "Начать экзамен");
      start.type = "button"; start.style.cssText = "width:100%;padding:15px;font-size:17px";
      start.onclick = function () { startExam(exam, key, panel, course, track); };
      panel.appendChild(start);
    }
    app.appendChild(panel);
  }
  function startExam(exam, key, panel, courseId, track) {
    courseId = courseId || courseForTrack(exam.track);
    var student = window.state && window.state.student;
    if (student && window.API && window.API.getTestAttemptStatus && window._englishVprGate !== key) {
      panel.innerHTML = "<p>Проверяем доступ к экзамену…</p>";
      window.API.getTestAttemptStatus(courseId, key).then(function (status) {
        if (!status || status.allowed === false) {
          panel.textContent = "Попытка уже использована. Для повторного прохождения обратитесь к преподавателю.";
          return;
        }
        window._englishVprGate = key;
        startExam(exam, key, panel, courseId, track);
        window._englishVprGate = "";
      }).catch(function () { panel.textContent = "Не удалось проверить доступ. Обновите страницу и попробуйте ещё раз."; });
      return;
    }
    if (window.englishAssessmentTimer) { clearInterval(window.englishAssessmentTimer); window.englishAssessmentTimer = null; }
    var seconds = exam.time * 60, finished = false;
    panel.innerHTML = "";
    var timer = el("div", "exam-timer", "90:00");
    timer.style.cssText = "position:sticky;top:8px;z-index:3;padding:12px;text-align:center;font-size:24px;font-weight:800;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--accent)";
    panel.appendChild(timer);
    var form = el("form", "english-vpr-form notranslate"); form.setAttribute("translate","no");
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    var audio = el("section", "question");
    audio.style.cssText = "padding:16px;margin:14px 0;background:var(--card-soft);border:1px solid var(--border);border-radius:12px";
    audio.appendChild(el("h2", "", "Аудиозапись к заданию 1"));
    audio.appendChild(el("p", "", "Нажмите кнопку, чтобы прослушать диалог два раза. Не переходите к тексту аудирования во время выполнения экзамена."));
    var play = el("button", "btn", "▶ Прослушать диалог (2 раза)");
    play.type = "button";
    play.onclick = function () {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        transcript.hidden = false;
        transcript.textContent = "В этом браузере недоступно озвучивание. Текст аудирования показан ниже.";
        return;
      }
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(exam.audioText);
      utterance.lang = "en-GB"; utterance.rate = 0.88;
      utterance.onend = function () {
        if (play.dataset.played !== "1") {
          play.dataset.played = "1";
          window.setTimeout(function () {
            var second = new SpeechSynthesisUtterance(exam.audioText);
            second.lang = "en-GB"; second.rate = 0.88;
            window.speechSynthesis.speak(second);
          }, 900);
        } else { play.dataset.played = ""; }
      };
      play.dataset.played = "0";
      window.speechSynthesis.speak(utterance);
    };
    audio.appendChild(play);
    var transcript = el("details", "exam-audio-transcript");
    transcript.style.cssText = "margin-top:12px";
    transcript.appendChild(el("summary", "", "Техническая помощь: показать текст аудирования"));
    transcript.appendChild(el("p", "", exam.audioText));
    audio.appendChild(transcript);
    form.appendChild(audio);
    exam.tasks.forEach(function (task, ti) {
      var section = el("section", "question");
      section.style.cssText = "padding:16px;margin:14px 0;background:var(--card-soft);border:1px solid var(--border);border-radius:12px";
      section.appendChild(el("h2", "", task.title + " · " + task.points + " баллов"));
      section.appendChild(el("p", "", task.instruction));
      if (task.type === "choice") {
        task.items.forEach(function (item, i) {
          var row = el("div"); row.style.cssText = "padding:9px 0;border-bottom:1px solid var(--border)";
          row.appendChild(el("b", "", String.fromCharCode(65+i) + ". " + item[0]));
          (item[2] || task.options).forEach(function (opt, oi) {
            var label = el("label"); label.style.cssText = "display:inline-flex;gap:5px;align-items:center;margin:7px 14px 0 0";
            var input = el("input"); input.type = "radio"; input.name = "vpr_" + ti + "_" + i; input.value = String(oi+1);
            label.appendChild(input); label.appendChild(document.createTextNode((oi+1) + ") " + opt)); row.appendChild(label);
          });
          section.appendChild(row);
        });
      } else if (task.type === "match") {
        task.items.forEach(function (item, i) {
          var row = el("div"); row.style.cssText = "padding:10px 0;border-bottom:1px solid var(--border)";
          row.appendChild(el("b", "", item[0] + ". "));
          row.appendChild(el("span", "", item[1]));
          var select = el("select", "self-input"); select.name = "vpr_" + ti + "_" + i;
          select.appendChild(new Option("Выберите заголовок", ""));
          task.options.forEach(function (opt, oi) { select.appendChild(new Option((oi+1) + ". " + opt, String(oi+1))); });
          row.appendChild(select); section.appendChild(row);
        });
      } else if (task.type === "gap") {
        var text = task.text;
        var gaps = (text.match(/[A-F]_____/g) || []);
        var html = esc(text);
        gaps.forEach(function (gap, i) { html = html.replace(gap, '<select class="self-input" name="vpr_'+ti+'_'+i+'"><option value="">'+gap+'</option>'+(task.itemOptions && task.itemOptions[i] || task.options).map(function (o, oi) { return '<option value="'+(oi+1)+'">'+(oi+1)+'. '+esc(o)+'</option>'; }).join("")+'</select>'); });
        var textBox = el("div", "exam-reading-text"); textBox.style.cssText = "line-height:2.1"; textBox.innerHTML = html; section.appendChild(textBox);
      } else if (task.type === "transform") {
        task.items.forEach(function (item, i) {
          var row = el("div"); row.style.cssText = "padding:10px 0;border-bottom:1px solid var(--border);line-height:2";
          if (item.length === 4) {
            row.appendChild(document.createTextNode(item[0] + " "));
            var input = el("input", "self-input"); input.name = "vpr_" + ti + "_" + i; input.placeholder = item[2]; input.style.maxWidth = "210px"; row.appendChild(input);
            row.appendChild(document.createTextNode(" " + item[1]));
          } else {
            row.appendChild(document.createTextNode(item[0] + " "));
            var inp = el("input", "self-input"); inp.name = "vpr_" + ti + "_" + i; inp.placeholder = item[2]; inp.style.maxWidth = "210px"; row.appendChild(inp);
            row.appendChild(document.createTextNode(" " + item[1]));
          }
        section.appendChild(row);
        });
      } else if (task.type === "questionnaire") {
        section.appendChild(el("p", "", task.instruction));
        task.items.forEach(function (question, i) {
          var row = el("div"); row.style.cssText = "padding:9px 0;border-bottom:1px solid var(--border)";
          row.appendChild(el("b", "", (i+1) + ". " + question));
          var answer = el("input", "self-input");
          answer.type = "text"; answer.name = "vpr_" + ti + "_" + i;
          answer.maxLength = 100; answer.placeholder = "Answer in English (up to 5 words)";
          answer.style.cssText = "display:block;width:100%;margin:6px 0 10px";
          row.appendChild(answer);
          var count = el("small", "museum-muted", "0 words");
          answer.addEventListener("input", function () {
            var words = (answer.value.trim().match(/\S+/g) || []).length;
            count.textContent = words + " words" + (words > 5 ? " — no more than 5 words" : "");
            count.style.color = words > 5 ? "var(--danger)" : "";
          });
          row.appendChild(count); section.appendChild(row);
        });
      }
      form.appendChild(section);
    });
    var submit = el("button", "btn", "Завершить и отправить экзамен");
    submit.type = "button"; submit.style.cssText = "width:100%;padding:16px;font-size:17px;margin:12px 0";
    submit.onclick = function () {
      if (finished) return;
      var questionnaireError = false;
      exam.tasks.forEach(function (task, ti) {
        if (task.type === "questionnaire") task.items.forEach(function (q, i) {
          var field = form.querySelector('[name="vpr_'+ti+'_'+i+'"]');
          var count = field && field.value.trim() ? field.value.trim().split(/\s+/).length : 0;
          if (!field || !field.value.trim() || count > 5) questionnaireError = true;
        });
      });
      if (questionnaireError) { window.alert("Заполните все 10 пунктов задания 7. Каждый ответ должен содержать не более пяти слов."); return; }
      if (seconds > 0 && !window.confirm("Отправить ответы? После отправки изменить их будет нельзя.")) return;
      finished = true;
      if (window.englishAssessmentTimer) { clearInterval(window.englishAssessmentTimer); window.englishAssessmentTimer = null; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      var answers = exam.tasks.map(function(task,ti) {
        var row = {};
        var count = (task.items || []).length;
        if (task.type === "gap") count = (task.text.match(/[A-F]_____/g) || []).length;
        for (var i=0;i<count;i++) {
          var field = form.querySelector('[name="vpr_'+ti+'_'+i+'"]');
          row[i] = field ? (field.value || "").trim() : "";
        }
        return row;
      });
      var elapsed = Math.max(0, Number(exam.time || 90) * 60 - seconds);
      submit.disabled = true; submit.textContent = "Отправляем на сервер…";
      if (!window.API || !window.API.submitEnglishVprExam) {
        finished = false; submit.disabled = false; submit.textContent = "Завершить и отправить экзамен";
        window.alert("Серверная проверка недоступна. Ответы не отправлены; обратитесь к преподавателю.");
        return;
      }
      window.API.submitEnglishVprExam({track:track,answers:answers,timeSpent:elapsed}).then(function(result) {
        if (!result || !result.success) throw new Error(result && result.error || "Сервер не подтвердил отправку.");
        finished = true;
        if (window.englishAssessmentTimer) { clearInterval(window.englishAssessmentTimer); window.englishAssessmentTimer = null; }
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        var record = {grade:result.grade || "На проверке",score:result.score,max:result.maxScore,percent:result.percent,finishedAt:new Date().toISOString(),status:"pending_teacher_review"};
        window.state.results = window.state.results || {}; window.state.results[key] = record;
        app.dataset.proctorAssessment="0"; panel.dataset.proctorAssessment="0";
        panel.innerHTML = '<section class="module" style="text-align:center"><h2>Экзамен отправлен</h2><p>Автоматическая проверка: <b>'+result.score+' из '+result.maxScore+'</b> баллов ('+result.percent+'%).</p><h3>Статус: '+esc(result.grade || "На проверке")+'</h3><p>Письменные ответы переданы преподавателю, если они предусмотрены вариантом.</p></section>';
        if (window.saveStudentData) window.saveStudentData();
      }).catch(function(err) {
        finished = false; submit.disabled = false; submit.textContent = "Завершить и отправить экзамен";
        window.alert("Не удалось отправить экзамен: "+(err.message||err)+". Ответы не засчитаны; попробуйте ещё раз.");
      });
    };
    panel.setAttribute("translate","no"); panel.classList.add("notranslate"); panel.dataset.proctorAssessment="1"; panel.dataset.testId=key; window._activeAssessmentCourseId=courseId;
    panel.appendChild(form); panel.appendChild(submit);
    function tick() {
      if (finished) return;
      var m = Math.floor(seconds/60), s = seconds%60;
      timer.textContent = (m<10?"0":"")+m+":"+(s<10?"0":"")+s;
      if (seconds <= 0) { submit.click(); return; }
      seconds--;
    }
    tick(); window.englishAssessmentTimer = window.setInterval(tick,1000);
  }
  function renderChooser() {
    var app = document.getElementById("app");
    if (!app) return;
    var course = activeCourse();
    if (!window.state || (!window.state.student && !window.state.staff) || (window.canAccessCourse && !window.canAccessCourse(course))) {
      app.innerHTML = '<section class="module">Нет доступа к дисциплине «Английский язык». Попросите администратора назначить её вашему аккаунту.</section>';
      return;
    }
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🇬🇧 Экзамен по английскому языку</h1><p>Формат ВПР СПО 2026 · 90 минут · 7 заданий · 40 баллов</p></section><section class="module"><h2>Выберите вариант экзамена</h2><p>В портале оставлены только две итоговые работы. Старые семестровые и прежние итоговые экзамены больше не выводятся в этом разделе.</p><div id="englishVprChoices" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px"></div></section>';
    var choices = document.getElementById("englishVprChoices");
    if (window.state && window.state.staff && window.API && window.API.importEnglishVprBank && window.ENGLISH_VPR_EXAMS) {
      var migrate = el("button","btn ghost","Перенести экзамены в защищённую таблицу");
      migrate.type="button"; migrate.style.cssText="margin:0 0 14px;width:100%";
      migrate.onclick=function(){
        if(!window.confirm("Импортировать варианты Basic и Technical в закрытый лист EnglishVPRBank?")) return;
        migrate.disabled=true; migrate.textContent="Импортируем…";
        Promise.all(["basic","technical"].map(function(track){
          var exam=window.ENGLISH_VPR_EXAMS[track];
          if(!exam) throw new Error("Не найден вариант "+track);
          return window.API.importEnglishVprBank(track,exam);
        })).then(function(){migrate.textContent="Оба экзамена перенесены в таблицу";if(window.showToast)window.showToast("Импорт Basic и Technical завершён.","success");})
          .catch(function(err){migrate.disabled=false;migrate.textContent="Повторить импорт";window.alert("Ошибка импорта: "+(err.message||err));});
      };
      app.querySelector(".module").appendChild(migrate);
    }
    var tracks = course === "ENB" ? ["basic"] : course === "ENT" ? ["technical"] : ["basic", "technical"];
    tracks.forEach(function (track) {
      var exam = window.ENGLISH_VPR_EXAMS && window.ENGLISH_VPR_EXAMS[track];
      if (!exam) return;
      var card = el("article", "question");
      card.style.cssText = "padding:18px;border:1px solid var(--border);border-radius:12px;background:var(--card-soft)";
      card.appendChild(el("h3", "", track === "basic" ? "Basic English — базовый" : "Technical English — технический"));
      card.appendChild(el("p", "", "90 минут · 7 заданий · аудирование, чтение, лексика, грамматика и письменные ответы"));
      var button = el("button", "btn", "Открыть экзамен");
      button.type = "button";
      button.style.width = "100%";
      button.onclick = function () { renderPage(track === "basic" ? "final-basic" : "final-technical"); };
      card.appendChild(button);
      choices.appendChild(card);
    });
  }
  window.renderEnglishVprPage = function (mode) {
    if (mode === "final-basic" || mode === "final-technical") { renderPage(mode); return; }
    renderChooser();
  };
  window.renderEnglishTestsPage = function (mode) {
    if (mode === "final-basic" || mode === "final-technical") { renderPage(mode); return; }
    renderChooser();
  };
  console.info("[English VPR] Загружены только два итоговых экзамена: Basic и Technical.");
})();