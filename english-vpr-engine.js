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
  function hasStaffAccess() {
    var s = window.state || {};
    var role = String((s.user && s.user.role) || (s.student && s.student.role) || s.role || "").toLowerCase();
    return !!(s.staff || s.teacher || s.admin || role === "teacher" || role === "admin");
  }
  function activeCourse() {
    var id = window.state && window.state.activeCourseId || "";
    if (id === "ENB" && (!window.canAccessCourse || window.canAccessCourse("ENB") || window.canAccessCourse("EN"))) return "ENB";
    if (id === "ENT" && (!window.canAccessCourse || window.canAccessCourse("ENT") || window.canAccessCourse("EN"))) return "ENT";
    if (!window.canAccessCourse) return "EN";
    var basic = window.canAccessCourse("ENB") || window.canAccessCourse("EN");
    var technical = window.canAccessCourse("ENT") || window.canAccessCourse("EN");
    if (basic && technical) return "EN";
    if (basic) return "ENB";
    if (technical) return "ENT";
    return "EN";
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
    if (!window.state || (!window.state.student && !hasStaffAccess()) || !hasCourseAccess) {
      app.innerHTML = '<section class="module">Нет доступа к выбранному экзамену. Попросите преподавателя открыть дисциплину ' + course + '.</section>';
      return;
    }
    app.setAttribute("translate","no"); app.classList.add("notranslate"); app.dataset.proctorAssessment="1"; app.dataset.testId="english_"+track+"_exam"; window._activeAssessmentCourseId=course;
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a><section class="hero notranslate" translate="no"><h1>🇬🇧 Итоговый экзамен по английскому</h1><p>Формат ВПР СПО 2026 · 7 заданий · 90 минут · максимум 40 баллов</p></section><section class="module" id="englishVprLoading">Загружаем защищённый вариант экзамена…</section>';
    if (!window.API || !window.API.getEnglishVprExam) { document.getElementById("englishVprLoading").textContent="Сервер экзаменов недоступен. Обратитесь к преподавателю."; return; }
    window.API.getEnglishVprExam(track).then(function(response) {
      if (!response || !response.success || !response.exam) throw new Error(response && response.error || "Экзамен не найден на сервере.");
      renderLoadedExam(response.exam,track,course,app,response.attemptId);
    }).catch(function(error) {
      var loading=document.getElementById("englishVprLoading");
      if(loading) loading.textContent="Не удалось загрузить экзамен с сервера: "+(error.message||error)+". Обратитесь к преподавателю.";
    });
    return;
  }
  function renderLoadedExam(exam,track,course,app,attemptId) {
    var tabs = el("section", "module");
    tabs.style.cssText = "display:flex;gap:8px;flex-wrap:wrap";
    if(track!=="basic" && (!window.canAccessCourse || window.canAccessCourse("ENB") || window.canAccessCourse("EN"))) { var b=el("button","btn ghost","Basic English"); b.type="button"; b.onclick=function(){renderPage("final-basic");}; tabs.appendChild(b); }
    if(track!=="technical" && (!window.canAccessCourse || window.canAccessCourse("ENT") || window.canAccessCourse("EN"))) { var t=el("button","btn ghost","Technical English"); t.type="button"; t.onclick=function(){renderPage("final-technical");}; tabs.appendChild(t); }
    app.appendChild(tabs);
    var panel = el("section", "module");
    panel.appendChild(el("h2", "", exam.title));
    panel.appendChild(el("p", "", "В работе: аудирование, чтение, лексика, грамматика, словообразование и письменные ответы. Время выполнения — 90 минут."));
    panel.appendChild(el("p", "museum-muted", "Задания 1–6 проверяются автоматически. Десять кратких ответов в задании 7 передаются преподавателю на проверку."));
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
  function startExam(exam, key, panel, courseId, track, attemptId, startedAt) {
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
        startExam(exam, key, panel, courseId, track, attemptId, startedAt);
        window._englishVprGate = "";
      }).catch(function () { panel.textContent = "Не удалось проверить доступ. Обновите страницу и попробуйте ещё раз."; });
      return;
    }
    if (!attemptId) {
      if (!window.API || !window.API.startEnglishVprExam) {
        panel.textContent = "Сервер запуска экзамена недоступен. Обратитесь к преподавателю.";
        return;
      }
      panel.innerHTML = "<p>Запускаем экзамен и фиксируем время начала…</p>";
      window.API.startEnglishVprExam(track).then(function(started) {
        if (!started || started.success !== true || !started.attemptId || !started.exam) {
          throw new Error(started && started.error || "Сервер не выдал вариант экзамена.");
        }
        startExam(started.exam, key, panel, courseId, track, started.attemptId, started.startedAt);
      }).catch(function(error) {
        panel.textContent = "Не удалось запустить экзамен: " + (error.message || error);
      });
      return;
    }
    exam = exam || {};
    if (window.englishAssessmentTimer) { clearInterval(window.englishAssessmentTimer); window.englishAssessmentTimer = null; }
    var durationSeconds = Math.max(1, Number(exam.time) || 90) * 60;
    var seconds = Number(startedAt) > 0 ?
      Math.max(0, durationSeconds - Math.floor(Math.max(0, Date.now() - Number(startedAt)) / 1000)) :
      durationSeconds;
    var finished = false;
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
        gaps.forEach(function (gap, i) { html = html.replace(gap, '<select class="self-input" name="vpr_'+ti+'_'+i+'"><option value="">'+gap+'</option>'+((task.itemOptions && task.itemOptions[i]) || task.options || []).map(function (o, oi) { return '<option value="'+(oi+1)+'">'+(oi+1)+'. '+esc(o)+'</option>'; }).join("")+'</select>'); });
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
          var selector = task.type === "choice" ? 'input[name="vpr_'+ti+'_'+i+'"]:checked' : '[name="vpr_'+ti+'_'+i+'"]';
          var field = form.querySelector(selector);
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
      window.API.submitEnglishVprExam({track:track,attemptId:attemptId,answers:answers,timeSpent:elapsed}).then(function(result) {
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

  function renderSemesterTests(track, course, choices) {
    if (!window.API || !window.API.getEnglishSemesterTests) return;
    var section=el("section","module");
    section.style.marginTop="18px";
    section.appendChild(el("h2","","Семестровые контрольные"));
    section.appendChild(el("p","museum-muted","10 работ · 20 вопросов в каждой · автоматическая проверка по серверному ключу"));
    var list=el("div");
    list.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px";
    list.appendChild(el("p","museum-muted","Загружаем контрольные…"));
    section.appendChild(list); choices.parentNode.parentNode.appendChild(section);
    window.API.getEnglishSemesterTests(track).then(function(response){
      list.innerHTML="";
      if(!response||!response.success||!Array.isArray(response.tests)){
        list.appendChild(el("p","museum-muted",response&&response.error||"Семестровые контрольные пока не загружены преподавателем."));
        return;
      }
      response.tests.forEach(function(test,index){
        var key="english_semester_"+track+"_"+test.id;
        var card=el("article","question");
        card.style.cssText="padding:14px;border:1px solid var(--border);border-radius:12px;background:var(--card-soft)";
        card.appendChild(el("h3","",test.title||("Контрольная работа №"+(index+1))));
        card.appendChild(el("p","museum-muted",test.subtitle||"Семестровая контрольная"));
        card.appendChild(el("p","","20 вопросов · "+(Number(test.time)||45)+" минут"));
        var button=el("button","btn","Открыть контрольную"); button.type="button"; button.style.width="100%";
        var localResult=window.state&&window.state.results&&window.state.results[key];
        if(localResult){button.disabled=true;button.textContent="Работа уже отправлена";}
        button.onclick=function(){startSemesterTest(test,track,course,card);};
        card.appendChild(button); list.appendChild(card);
        if(window.API.getTestAttemptStatus){
          window.API.getTestAttemptStatus(course,key).then(function(status){
            if(status&&status.allowed===false){button.disabled=true;button.textContent="Попытка использована";}
          }).catch(function(){});
        }
      });
    }).catch(function(error){
      list.innerHTML=""; list.appendChild(el("p","museum-muted","Не удалось загрузить контрольные: "+(error.message||error)));
    });
  }
  function startSemesterTest(test,track,course,card) {
    var testKey="english_semester_"+track+"_"+test.id;
    if(window.API&&window.API.getTestAttemptStatus){
      card.innerHTML="<p>Проверяем доступ к контрольной…</p>";
      window.API.getTestAttemptStatus(course,testKey).then(function(status){
        if(!status||status.allowed===false){card.textContent="Попытка уже использована. Для повторного прохождения обратитесь к преподавателю.";return;}
        beginSemesterAttempt(test,track,course,card);
      }).catch(function(error){card.textContent="Не удалось проверить попытку: "+(error.message||error);});
      return;
    }
    beginSemesterAttempt(test,track,course,card);
  }
  function beginSemesterAttempt(test,track,course,card) {
    if(!window.API || !window.API.startEnglishSemesterTest) {
      card.textContent="Сервер запуска контрольной недоступен. Обратитесь к преподавателю.";
      return;
    }
    card.innerHTML="<p>Запускаем контрольную и фиксируем время начала…</p>";
    window.API.startEnglishSemesterTest({track:track,testId:test.id,attemptNo:test.attemptNo}).then(function(started){
      if(!started || started.success!==true || !started.attemptId) throw new Error(started&&started.error||"Сервер не выдал идентификатор попытки.");
      renderSemesterAttempt(test,track,course,card,started.attemptId,started.startedAt);
    }).catch(function(error){
      card.textContent="Не удалось запустить контрольную: "+(error.message||error);
    });
  }
  function renderSemesterAttempt(test,track,course,card,attemptId,startedAt) {
    if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}
    var duration=Math.max(1,Number(test.time)||45)*60;
    var seconds=Number(startedAt)>0?Math.max(0,duration-Math.floor(Math.max(0,Date.now()-Number(startedAt))/1000)):duration;
    var finished=false;
    card.innerHTML="";
    var heading=el("h2","",test.title||"Семестровая контрольная");
    card.appendChild(heading); card.appendChild(el("p","museum-muted",test.subtitle||""));
    var timer=el("div","exam-timer","45:00");
    timer.style.cssText="position:sticky;top:8px;z-index:3;padding:10px;text-align:center;font-size:22px;font-weight:800;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--accent)";
    card.appendChild(timer);
    var form=el("form","english-semester-form notranslate"); form.setAttribute("translate","no");
    test.questions.forEach(function(question,index){
      var block=el("section","question");
      block.style.cssText="padding:14px;margin:12px 0;background:var(--card-soft);border:1px solid var(--border);border-radius:10px";
      block.appendChild(el("h3","","Вопрос "+(index+1)));
      block.appendChild(el("p","",question.q));
      (question.options||[]).forEach(function(option,oi){
        var label=el("label"); label.style.cssText="display:flex;gap:8px;align-items:flex-start;padding:7px 0";
        var input=el("input"); input.type="radio"; input.name="semester_"+index; input.value=String(oi); input.required=true;
        label.appendChild(input); label.appendChild(document.createTextNode(option)); block.appendChild(label);
      });
      form.appendChild(block);
    });
    card.appendChild(form);
    var submit=el("button","btn","Завершить и отправить"); submit.type="button"; submit.style.cssText="width:100%;padding:14px";
    submit.onclick=function(){
      if(finished)return;
      var answers=[];
      for(var i=0;i<test.questions.length;i++){
        var chosen=form.querySelector('input[name="semester_'+i+'"]:checked');
        if(!chosen){
          if(seconds>0){window.alert("Ответьте на все 20 вопросов. Не заполнен вопрос №"+(i+1)+".");return;}
          answers.push(-1);
        } else answers.push(Number(chosen.value));
      }
      if(seconds>0&&!window.confirm("Отправить контрольную на проверку? После отправки изменить ответы будет нельзя."))return;
      finished=true; submit.disabled=true; submit.textContent="Проверяем на сервере…";
      if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}
      window.API.submitEnglishSemesterTest({track:track,testId:test.id,attemptNo:test.attemptNo,attemptId:attemptId,answers:answers,timeSpent:duration-seconds}).then(function(result){
        if(!result||result.success!==true)throw new Error(result&&result.error||"Сервер не подтвердил отправку.");
        var key="english_semester_"+track+"_"+test.id;
        window.state.results=window.state.results||{};
        window.state.results[key]={grade:result.grade,score:result.score,max:result.maxScore,percent:result.percent,finishedAt:new Date().toISOString()};
        if(window.saveStudentData)window.saveStudentData();
        card.innerHTML="";
        var done=el("section","module"); done.style.textAlign="center";
        done.appendChild(el("h2","","Контрольная отправлена"));
        done.appendChild(el("p","","Результат: "+result.score+" из "+result.maxScore+" ("+result.percent+"%)."));
        done.appendChild(el("h3","","Оценка: "+result.grade));
        done.appendChild(el("p","museum-muted","Ответы проверены сервером. Правильные ответы не передавались в браузер."));
        card.appendChild(done);
      }).catch(function(error){
        finished=false; submit.disabled=false; submit.textContent="Повторить отправку";
        window.alert("Не удалось отправить контрольную: "+(error.message||error));
      });
    };
    card.appendChild(submit);
    function tick(){
      if(finished)return;
      var m=Math.floor(seconds/60),s=seconds%60;
      timer.textContent=(m<10?"0":"")+m+":"+(s<10?"0":"")+s;
      if(seconds<=0){submit.click();return;} seconds--;
    }
    tick(); window.englishAssessmentTimer=window.setInterval(tick,1000);
  }


  function renderPersistentFinalExam(courseNo, semester, card) {
    if (!window.API || !window.API.startEnglishFinalExam) { card.textContent="Сервер итоговых экзаменов недоступен."; return; }
    card.innerHTML="<p>Получаем персональный вариант и проверяем сохранённую попытку…</p>";
    window.API.startEnglishFinalExam(courseNo,semester).then(function(started){
      if(!started||started.success!==true||!started.attemptId||!Array.isArray(started.tasks)) throw new Error(started&&started.error||"Сервер не выдал экзаменационный вариант.");
      renderPersistentAttempt(started,card,courseNo,semester);
    }).catch(function(error){
      var message=String(error&&error.message||error||"Не удалось открыть итоговый экзамен.");
      card.innerHTML="";
      card.appendChild(el("p","", "Не удалось открыть итоговый экзамен: "+message));
      if(/лимит попыток|попыток итогового экзамена исчерпан/i.test(message)&&window.API&&window.API.requestTestAttempts){
        var request=el("button","btn","📨 Запросить дополнительную попытку");
        var status=el("p","museum-muted","");
        request.type="button";
        request.onclick=function(){
          request.disabled=true;status.textContent="Отправляем запрос преподавателю…";
          var courseId=Number(courseNo)<=2?"ENB":"ENT",testId="english_final_c"+courseNo+"_s"+semester;
          window.API.requestTestAttempts(courseId,testId).then(function(result){
            if(!result||result.success!==true)throw new Error(result&&result.error||"Не удалось отправить запрос.");
            status.textContent=result.alreadyRequested?"Запрос уже отправлен. Дождитесь решения преподавателя.":"Запрос отправлен преподавателю. После разрешения можно будет начать новую попытку.";
          }).catch(function(requestError){status.textContent=requestError.message||String(requestError);request.disabled=false;});
        };
        card.appendChild(request);card.appendChild(status);
      }
    });
  }
  function renderPersistentAttempt(attempt, card, courseNo, semester) {
    if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}
    var tasks=attempt.tasks||[],responses=Object.assign({},attempt.responses||{}),finished=false;
    if(!tasks.length){card.textContent="Вариант экзамена пока не содержит заданий.";return;}
    card.innerHTML="";
    card.appendChild(el("h2","","Итоговый экзамен · курс "+courseNo+", семестр "+semester));
    card.appendChild(el("p","museum-muted","Вариант "+(attempt.variantId||"")+" · ответы автоматически сохраняются на сервере."));
    var timer=el("div","exam-timer","Оставшееся время");
    timer.style.cssText="position:sticky;top:8px;z-index:3;padding:12px;text-align:center;font-size:23px;font-weight:800;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--accent)";
    card.appendChild(timer);
    var saveStatus=el("p","museum-muted","Ответы ещё не изменялись.");
    card.appendChild(saveStatus);
    var form=el("form","english-final-persistent-form notranslate");form.setAttribute("translate","no");
    form.addEventListener("submit",function(e){e.preventDefault();});
    var saveQueue=Promise.resolve(),saveTimer=null;
    function taskId(task,index){return String(task.id||task.questionId||index);}
    function optionText(option){return typeof option==="object"&&option!==null?String(option.text||option.label||option.value||""):String(option);}
    function saveNow(force){
      if(finished&&!force)return saveQueue;
      var payload=JSON.parse(JSON.stringify(responses));
      saveQueue=saveQueue.then(function(){return window.API.saveEnglishFinalExamResponses(attempt.attemptId,payload);}).then(function(result){
        if(!result||result.success!==true)throw new Error(result&&result.error||"Сервер не подтвердил сохранение.");
        saveStatus.textContent="Сохранено на сервере · "+new Date(result.savedAt||Date.now()).toLocaleTimeString();
      }).catch(function(error){saveStatus.textContent="Ошибка автосохранения: "+(error.message||error);});
      return saveQueue;
    }
    function queueSave(){
      if(saveTimer)window.clearTimeout(saveTimer);
      saveTimer=window.setTimeout(function(){saveTimer=null;saveNow();},500);
    }
    tasks.forEach(function(task,index){
      var id=taskId(task,index),type=String(task.type||task.taskType||"single_choice").toLowerCase();
      var block=el("section","question");block.style.cssText="padding:15px;margin:14px 0;background:var(--card-soft);border:1px solid var(--border);border-radius:12px";
      block.appendChild(el("h3","","Задание "+(index+1)));
      block.appendChild(el("p","",task.prompt||task.question||task.q||task.text||""));
      if(task.audioText&&("speechSynthesis" in window)){
        var audio=el("button","btn ghost","🔊 Прослушать текст");audio.type="button";audio.onclick=function(){window.speechSynthesis.cancel();var utterance=new SpeechSynthesisUtterance(String(task.audioText));utterance.lang="en-GB";window.speechSynthesis.speak(utterance);};block.appendChild(audio);
      }
      var options=Array.isArray(task.options)?task.options:(Array.isArray(task.items)?task.items:[]);
      if(type==="single_choice"||type==="single-choice"||type==="choice"){
        options.forEach(function(option,oi){
          var label=el("label");label.style.cssText="display:flex;gap:9px;align-items:flex-start;padding:7px 0";
          var input=el("input");input.type="radio";input.name="ef_"+id;input.value=String(oi);input.checked=Number(responses[id])===oi;
          input.addEventListener("change",function(){responses[id]=oi;saveNow();});
          label.appendChild(input);label.appendChild(document.createTextNode(optionText(option)));block.appendChild(label);
        });
      }else if(type==="multiple_choice"||type==="multiple-choice"){
        var selected=Array.isArray(responses[id])?responses[id].map(Number):[];
        options.forEach(function(option,oi){
          var label=el("label");label.style.cssText="display:flex;gap:9px;align-items:flex-start;padding:7px 0";
          var input=el("input");input.type="checkbox";input.value=String(oi);input.checked=selected.indexOf(oi)!==-1;
          input.addEventListener("change",function(){responses[id]=Array.from(block.querySelectorAll('input[type="checkbox"]:checked')).map(function(x){return Number(x.value);});saveNow();});
          label.appendChild(input);label.appendChild(document.createTextNode(optionText(option)));block.appendChild(label);
        });
      }else if(type==="ordering"||type==="order"){
        var orderValues=options.map(optionText),orderBox=el("div");
        orderValues.forEach(function(value,oi){
          var line=el("label");line.style.cssText="display:flex;gap:10px;align-items:center;padding:6px 0";
          line.appendChild(el("span","",value));
          var select=el("select");select.className="ef-order-position";
          for(var pos=1;pos<=orderValues.length;pos++){var opt=el("option","",String(pos));opt.value=String(pos);select.appendChild(opt);}
          var current=Array.isArray(responses[id])?responses[id].indexOf(value):-1;
          if(current>=0)select.value=String(current+1);
          select.addEventListener("change",function(){var pairs=Array.from(orderBox.querySelectorAll(".ef-order-position")).map(function(x,i){return {pos:Number(x.value),value:orderValues[i]};}).sort(function(a,b){return a.pos-b.pos;});responses[id]=pairs.map(function(x){return x.value;});saveNow();});
          line.appendChild(select);orderBox.appendChild(line);
        });block.appendChild(orderBox);
      }else if(type==="short_text"||type==="short-text"){
        var input=el("input");input.type="text";input.style.width="100%";input.value=String(responses[id]||"");
        input.addEventListener("input",function(){responses[id]=input.value;queueSave();});block.appendChild(input);
      }else if(type==="written"||type==="writing"||type==="essay"||type==="free_response"){
        var area=el("textarea");area.rows=6;area.style.width="100%";area.value=String(responses[id]||"");area.placeholder="Введите развёрнутый ответ…";
        area.addEventListener("input",function(){responses[id]=area.value;queueSave();});block.appendChild(area);
      }else{
        block.appendChild(el("p","museum-muted","Тип задания пока не поддерживается интерфейсом: "+type+". Сообщите преподавателю."));
      }
      form.appendChild(block);
    });
    card.appendChild(form);
    var submit=el("button","btn","Завершить и отправить экзамен");submit.type="button";submit.style.cssText="width:100%;padding:15px";
    function submitExam(auto){
      if(finished)return;
      if(!auto&&!window.confirm("Отправить итоговый экзамен? После отправки изменить ответы будет нельзя."))return;
      finished=true;submit.disabled=true;submit.textContent="Сохраняем и проверяем…";
      if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}
      if(saveTimer){window.clearTimeout(saveTimer);saveTimer=null;}
      saveNow(true);
      saveQueue.then(function(){return window.API.submitEnglishFinalExam(attempt.attemptId,responses);}).then(function(result){
        if(!result||result.success!==true)throw new Error(result&&result.error||"Сервер не подтвердил отправку.");
        card.innerHTML="";
        card.appendChild(el("h2","",result.status==="pending_review"?"Экзамен отправлен на проверку":"Экзамен проверен"));
        if(result.result&&result.result.percent!==null&&result.result.percent!==undefined)card.appendChild(el("p","","Результат: "+result.result.objectiveScore+" из "+result.result.totalMax+" · "+result.result.percent+"%."));
        else card.appendChild(el("p","","Автоматическая часть проверена. Письменные ответы переданы преподавателю."));
        card.appendChild(el("p","museum-muted",result.status==="pending_review"?"Итоговая оценка появится после проверки письменных заданий.":"Итоговый результат сохранён на сервере."));
      }).catch(function(error){finished=false;submit.disabled=false;submit.textContent="Повторить отправку";saveStatus.textContent="Ошибка отправки: "+(error.message||error);});
    }
    submit.onclick=function(){submitExam(false);};card.appendChild(submit);
    function tick(){
      if(finished)return;
      var left=Math.max(0,new Date(attempt.deadlineAt).getTime()-Date.now());
      var seconds=Math.ceil(left/1000),minutes=Math.floor(seconds/60),rest=seconds%60;
      timer.textContent=minutes+":"+String(rest).padStart(2,"0");
      if(left<=0)submitExam(true);
    }
    tick();window.englishAssessmentTimer=window.setInterval(tick,1000);
  }

  function renderChooser() {
    var app = document.getElementById("app");
    if (!app) return;
    var course = activeCourse();
    var hasEnglishAccess = !window.canAccessCourse || ["EN","ENB","ENT"].some(function(id){return window.canAccessCourse(id);});
    if (!window.state || (!window.state.student && !hasStaffAccess()) || (!hasEnglishAccess && !hasStaffAccess())) {
      app.innerHTML = '<section class="module">Нет доступа к дисциплине «Английский язык». Попросите администратора назначить её вашему аккаунту.</section>';
      return;
    }
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🇬🇧 Экзамен по английскому языку</h1><p>Формат ВПР СПО 2026 · 90 минут · 7 заданий · 40 баллов</p></section><section class="module"><h2>Выберите вариант экзамена</h2><p>Выберите итоговый экзамен ВПР или одну из семестровых контрольных Basic / Technical ниже.</p><div id="englishVprChoices" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px"></div></section>';
    var choices = document.getElementById("englishVprChoices");
    if (hasStaffAccess() && window.API && window.API.importEnglishSemesterTests && window.SEMESTER_TESTS) {
      var semesterImport = el("button","btn ghost","Перенести 20 семестровых контрольных");
      semesterImport.type="button";
      semesterImport.style.cssText="margin:0 0 14px;width:100%";
      semesterImport.onclick=function(){
        var source=window.SEMESTER_TESTS;
        if(!source.basic || !source.technical) { window.alert("Исходные наборы Basic/Technical не загружены."); return; }
        if(!window.confirm("Записать 10 контрольных Basic и 10 контрольных Technical (по 20 вопросов) в закрытый лист EnglishSemesterBank?")) return;
        semesterImport.disabled=true; semesterImport.textContent="Переносим и проверяем…";
        (async function(){
          var report=[];
          for(var i=0;i<2;i++){
            var track=["basic","technical"][i], tests=source[track];
            var saved=await window.API.importEnglishSemesterTests(track,tests);
            if(!saved || saved.success!==true) throw new Error("Сервер не подтвердил "+track+": "+(saved&&saved.error||"нет ответа"));
            var check=await window.API.getEnglishSemesterTests(track);
            if(!check || check.success!==true || !Array.isArray(check.tests) || check.tests.length!==10) throw new Error("Контрольное чтение "+track+" не прошло.");
            var total=check.tests.reduce(function(n,t){return n+(t.questions||[]).length;},0);
            if(total!==200 || check.questionCount!==200) throw new Error(track+": ожидалось 200 вопросов, получено "+total+".");
            if(check.tests.some(function(t){return (t.questions||[]).some(function(q){return Object.prototype.hasOwnProperty.call(q,"correct");});})) throw new Error(track+": ключ ответа обнаружен в клиентской выдаче.");
            report.push({track:track,tests:check.tests.length,questions:total});
          }
          return report;
        })().then(function(report){
          semesterImport.textContent="20 контрольных подтверждены сервером";
          var details=report.map(function(x){return x.track.toUpperCase()+": "+x.tests+" работ / "+x.questions+" вопросов";}).join("; ");
          if(window.showToast) window.showToast("Семестровые контрольные записаны и проверены: "+details,"success");
          else window.alert("Семестровые контрольные записаны и проверены: "+details);
        }).catch(function(err){
          semesterImport.disabled=false; semesterImport.textContent="Повторить перенос семестровых контрольных";
          window.alert("Перенос не завершён: "+(err.message||err));
        });
      };
      app.querySelector(".module").appendChild(semesterImport);
    }
    if (hasStaffAccess() && window.API && window.API.importEnglishVprBank) {
      var migrate = el("button","btn ghost","Перенести экзамены в защищённую таблицу");
      migrate.type="button"; migrate.style.cssText="margin:0 0 14px;width:100%";
      migrate.onclick=function(){
        if(!window.confirm("Импортировать варианты Basic и Technical в закрытый лист EnglishVPRBank?")) return;
        migrate.disabled=true; migrate.textContent="Импортируем и проверяем…";
        Promise.all(["basic","technical"].map(function(track){
          return window.API.importEnglishVprBank(track).then(function(result){
            if(!result || result.success !== true) throw new Error("Сервер не подтвердил импорт "+track+": "+(result && result.error || "пустой ответ"));
            return window.API.getEnglishVprExam(track).then(function(check){
              if(!check || check.success !== true || !check.exam || !Array.isArray(check.exam.tasks) || !check.exam.tasks.length) {
                throw new Error("Импорт "+track+" не прошёл контрольное чтение: "+(check && check.error || "вариант не найден или пуст"));
              }
              return {track:track, tasks:check.exam.tasks.length, title:check.exam.title || track};
            });
          });
        })).then(function(results){
          migrate.textContent="Basic и Technical подтверждены сервером";
          migrate.disabled=true;
          var details=results.map(function(item){return item.track.toUpperCase()+": "+item.tasks+" заданий";}).join("; ");
          if(window.showToast)window.showToast("Импорт и чтение с сервера подтверждены: "+details,"success");
          else window.alert("Импорт и контрольное чтение подтверждены: "+details);
        }).catch(function(err){
          migrate.disabled=false; migrate.textContent="Повторить импорт и проверку";
          window.alert("Импорт/проверка не завершены: "+(err.message||err)+". Ни один вариант не считается готовым без подтверждения чтением с сервера.");
        });
      };
      app.querySelector(".module").appendChild(migrate);
    }
    var tracks = course === "ENB" ? ["basic"] : course === "ENT" ? ["technical"] : ["basic", "technical"];
    tracks.forEach(function (track) {
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
      renderSemesterTests(track, course, choices);
    });
    if(window.state&&window.state.student&&window.API&&window.API.startEnglishFinalExam){
      var courseNumbers=course==="ENB"?[1,2]:course==="ENT"?[3,4,5]:[1,2,3,4,5];
      var finalSection=el("section","module");finalSection.style.marginTop="20px";
      finalSection.appendChild(el("h2","","Итоговые экзамены по курсам"));
      finalSection.appendChild(el("p","museum-muted","Выберите свой курс и семестр. Вариант назначается сервером, а начатая попытка восстанавливается после повторного входа."));
      var finalGrid=el("div");finalGrid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px";
      courseNumbers.forEach(function(courseNo){[1,2].forEach(function(semester){
        var card=el("article","question");card.style.cssText="padding:14px;border:1px solid var(--border);border-radius:12px;background:var(--card-soft)";
        card.appendChild(el("h3","","Курс "+courseNo+" · семестр "+semester));
        var button=el("button","btn","Открыть итоговый экзамен");button.type="button";button.style.width="100%";
        button.onclick=function(){renderPersistentFinalExam(courseNo,semester,card);};card.appendChild(button);finalGrid.appendChild(card);
      });});
      finalSection.appendChild(finalGrid);choices.parentNode.appendChild(finalSection);
    }
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