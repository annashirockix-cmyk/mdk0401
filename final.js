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
  var title = (number + 1) + ". " + (question.q || question.question || "Вопрос без формулировки");
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
    var rightOptions = examShuffle(question.options || (question.pairs || []).map(function (pair) { return pair.right; }));
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

    if (window.state && window.state.student && window.API && window.API.getFinalExam && window.API.submitFinalExam) {
      start.disabled=true;mount.innerHTML="<p>Загружаем экзаменационный вариант с сервера…</p>";
      window.API.getFinalExam(course.id).then(function(serverExam){
        if(!serverExam||!serverExam.success||!serverExam.questions||!serverExam.questions.length){
          var available=serverExam&&serverExam.availableBankIds;
          throw new Error("Защищённый банк экзамена не найден для дисциплины "+course.id+". Банки в QuestionBank: "+(Array.isArray(available)&&available.length?available.join(", "):"нет записей")+". Проверьте импорт и публикацию Google Apps Script.");
        }
        var picked=serverExam.questions.map(function(entry){return entry.question;});
        mount.innerHTML="";
        var timerBox=examNode("div","exam-timer",duration+":00");timerBox.style.cssText="font-size:24px;font-weight:700;text-align:center;margin-bottom:18px;color:var(--accent);";mount.appendChild(timerBox);
        var form=examNode("form");form.addEventListener("submit",function(e){e.preventDefault();});
        picked.forEach(function(question,index){form.appendChild(renderExamQuestion(question,index));});
        var writtenTitle=examNode("h3","","✍️ Письменная и ситуационная часть");writtenTitle.style.color="var(--accent)";form.appendChild(writtenTitle);
        var writtenPrompts=mdkId==="04.01"?[
          "Составьте последовательность диагностирования станка при росте вибрации шпиндельного узла. Укажите исходные данные, приборы, контрольные точки, критерии остановки и форму фиксации результатов.",
          "По результатам диагностики выявлены повышенная температура опоры, рост вибрации и металлические частицы в масле. Предложите дерево возможных причин, укажите, какие проверки помогут их разделить, и обоснуйте решение: продолжить работу, выполнить регулировку или вывести узел в ремонт."
        ]:[
          "Опишите алгоритм подготовки оборудования к выполнению технологической операции с указанием контрольных точек.",
          "Разберите ситуацию отклонения параметров оборудования от нормы: установите возможные причины, способ проверки и корректирующие действия."
        ];
        writtenPrompts.forEach(function(prompt,index){var wrap=examNode("div");wrap.style.cssText="margin:12px 0;padding:15px;background:var(--card-soft);border:1px solid var(--border);border-radius:8px;";wrap.appendChild(examNode("b","",(picked.length+index+1)+". "+prompt));var area=examNode("textarea","self-input");area.name="written"+(index+1);area.rows=5;area.placeholder="Разверните решение, укажите ход рассуждений и вывод...";area.style.marginTop="10px";wrap.appendChild(area);form.appendChild(wrap);});
        var submit=examNode("button","btn","Завершить экзамен");submit.type="button";submit.style.cssText="width:100%;margin-top:18px;padding:15px;font-size:16px;";form.appendChild(submit);mount.appendChild(form);
        var timeLeft=duration*60,submitted=false;
        var timer=setInterval(function(){if(!document.body.contains(timerBox)){clearInterval(timer);return;}timeLeft--;timerBox.textContent=String(Math.floor(timeLeft/60)).padStart(2,"0")+":"+String(timeLeft%60).padStart(2,"0");if(timeLeft<=60)timerBox.style.color="var(--err)";if(timeLeft<=0)submit.click();},1000);
        function collectSecureAnswers(){
          return picked.map(function(q,index){
            var type=q.type||"mc";
            if(type==="num"){var n=form.querySelector('[name="q'+index+'"]');return n?n.value:"";}
            if(type==="multi")return Array.prototype.map.call(form.querySelectorAll('input[name="q'+index+'"]:checked'),function(el){return Number(el.value);}).sort(function(a,b){return a-b;});
            if(type==="order"){
              var fields=Array.prototype.slice.call(form.querySelectorAll('[name^="q'+index+'_order_"]'));
              return fields.map(function(field){return {item:field.dataset.item,pos:Number(field.value)};}).filter(function(x){return x.pos>0;}).sort(function(a,b){return a.pos-b.pos;}).map(function(x){return x.item;});
            }
            if(type==="match")return (q.pairs||[]).map(function(pair,i){var field=form.querySelector('[name="q'+index+'_match_'+i+'"]');return field?field.value:"";});
            var checked=form.querySelector('input[name="q'+index+'"]:checked');return checked?Number(checked.value):-1;
          });
        }
        submit.addEventListener("click",function(){
          if(submitted)return;submitted=true;clearInterval(timer);submit.disabled=true;
          mount.innerHTML="<p>Передаём ответы на серверную проверку…</p>";
          window.API.submitFinalExam({examId:serverExam.examId,courseId:course.id,answers:collectSecureAnswers(),written1:(form.querySelector('[name="written1"]')||{}).value||"",written2:(form.querySelector('[name="written2"]')||{}).value||"",timeSpent:duration*60-timeLeft}).then(function(result){
            if(!result||!result.success)throw new Error(result&&result.error||"Сервер не смог проверить экзамен.");
            if(!window.state.results)window.state.results={};
            window.state.results["__final__"+course.id]={grade:result.grade,total:result.score,max:result.maxScore,percent:result.percent,penaltyPoints:result.penaltyPoints||0};
            if(!window.state.examSubmissions)window.state.examSubmissions=[];
            window.state.examSubmissions.push({date:new Date().toLocaleString("ru-RU"),courseId:course.id,student:window.state.student.name,group:window.state.student.group,testScore:result.score,maxTest:result.maxScore,written1:(form.querySelector('[name="written1"]')||{}).value||"",written2:(form.querySelector('[name="written2"]')||{}).value||"",status:"На проверке",teacherGrade:null,finalGrade:null});
            if(window.saveStudentData)window.saveStudentData();
            mount.innerHTML="";var resultBox=examNode("div","exam-result");resultBox.style.cssText="text-align:center;padding:30px;";resultBox.appendChild(examNode("h2","",course.shortName+" · экзамен завершён"));resultBox.appendChild(examNode("p","","Баллы за тестовую часть: "+result.score+" из "+result.maxScore+" ("+result.percent+"%)"));var gradeNode=examNode("h1","exam-grade","Оценка: "+result.grade);gradeNode.style.cssText="font-size:42px;margin:20px 0;color:"+(result.grade>=3?"var(--ok)":"var(--err)");resultBox.appendChild(gradeNode);resultBox.appendChild(examNode("p","","Письменные задания переданы преподавателю на проверку."));if(result.penaltyPoints)resultBox.appendChild(examNode("p","","Штраф за повторные нарушения: -"+result.penaltyPoints+" п.п. Отчёт отправлен преподавателю."));var home=examNode("a","btn","К списку экзаменов");home.href="#/final";resultBox.appendChild(home);mount.appendChild(resultBox);
          }).catch(function(error){mount.textContent="Не удалось отправить экзамен: "+(error.message||error)+". Обратитесь к преподавателю.";});
        });
      }).catch(function(error){mount.textContent=error.message||"Не удалось загрузить экзамен.";});
      return;
    }
    mount.innerHTML = "";
    mount.appendChild(examNode("h3", "", "Экзамен временно недоступен"));
    mount.appendChild(examNode("p", "", "Для проведения итогового экзамена требуется защищённый банк вопросов на сервере. Обратитесь к преподавателю или администратору."));
  });
};
