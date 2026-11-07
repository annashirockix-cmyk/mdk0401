"use strict";
(function(){
 var original=window.renderStudentGradesPage;
 if(typeof original!=="function")return;
 var names={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","MET":"Метрология","OT":"Охрана труда","PFI":"ПФИ"};
 function esc(v){return window.escapeHtml(String(v==null?"":v));}
 function route(course,topic){return topic?"#/topic/"+encodeURIComponent(course)+"/"+encodeURIComponent(topic.id):course==="MET"?"#/metrology-trainer":["07.01","04.01","02.01","02.02"].indexOf(course)>=0?"#/training/"+encodeURIComponent(course):course==="MCAM"?"#/training/MCAM":"#/grades";}
 function plain(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9]+/g," ").trim();}
 function tokens(v){return plain(v).split(/\s+/).filter(function(w){return w.length>2&&!/^(тема|лекция|работа|практическая|практикум|задание|контроль|повторение|тест|пз|пр|ср|мдк)$/.test(w);});}
 function findTopic(courseId,rows){
  var course=window.MDK_DATA&&window.MDK_DATA[courseId];if(!course||!Array.isArray(course.sections))return null;
  var all=[];course.sections.forEach(function(s){(s.topics||[]).forEach(function(t){all.push(t);});});
  var hints=rows.map(function(x){return String(x.testTitle||"")+" "+String(x.testId||"")+" "+String(x.topic||"")+" "+String(x.feedback||"");}).join(" ");
  if(courseId==="MET"){
   var id="";
   if(/adaptive.*caliper|штангенцирк|штангенинструмент/i.test(hints))id="met-5";
   else if(/adaptive.*micrometer|микрометр/i.test(hints))id="met-6";
   else if(/adaptive.*depth|глубиномер|глубин/i.test(hints))id="met-5";
   else if(/adaptive.*indicator|индикатор|биени/i.test(hints))id="met-7";
   else if(/adaptive.*tolerance|допуск|посадк/i.test(hints))id="met-4";
   else if(/adaptive.*error|погрешност|ошибк измер/i.test(hints))id="met-3";
   if(id){var fixed=all.find(function(t){return t.id===id;});if(fixed)return fixed;}
  }
  var query=tokens(hints);if(!query.length)return null;
  var best=null,bestScore=0;
  all.forEach(function(t){
   var fields=[t.title,t.code].concat((t.lectures||[]).map(function(l){return l.title;}),(t.practicals||[]).map(function(p){return p.title+" "+p.code;}),(t.selfWork||[]).map(function(w){return w.title+" "+w.code;}));
   var hay=plain(fields.join(" ")),score=0;
   query.forEach(function(w){if(hay.indexOf(w)>=0)score+=w.length>6?2:1;});
   var topicWords=tokens(t.title);if(topicWords.length&&topicWords.every(function(w){return plain(hints).indexOf(w)>=0;}))score+=4;
   if(score>bestScore){bestScore=score;best=t;}
  });
  return bestScore>=2?best:null;
 }
 function renderDetails(item){
  var t=item.topic;if(!t)return '<p class="slr-muted">Не удалось однозначно сопоставить результат с конкретной темой. Откройте дисциплину и выберите соответствующий раздел; система не будет угадывать содержание ошибки.</p>';
  var html='<div class="slr-detail"><p><b>Тема для повторения:</b> '+esc(t.code||"")+' '+esc(t.title)+'</p><a class="btn ghost" href="'+esc(route(item.course,t))+'">📖 Открыть лекцию и материалы темы ↗</a>';
  var presentations=t.presentations||[];
  if(presentations.length){html+='<p><b>Презентации по теме:</b></p><ul>'+presentations.map(function(p){var file=String(p.file||"").split("/").map(encodeURIComponent).join("/");return '<li>'+esc(p.title||p.code||"Презентация")+(file?' — <a href="materials/presentations/'+file+'" target="_blank" rel="noopener">открыть файл ↗</a>':'')+(p.slides?' · '+esc(p.slides)+' слайдов':'')+'</li>';}).join("")+'</ul>';}
  var practicals=(t.practicals||[]).slice(0,2);
  if(practicals.length){html+='<p><b>Практика для закрепления:</b></p>'+practicals.map(function(p){return '<div class="slr-task"><b>'+esc(p.code||"Практическая работа")+' · '+esc(p.title||"")+'</b>'+(p.goal?'<p><b>Цель:</b> '+esc(p.goal)+'</p>':'')+(p.task?'<p><b>Задание:</b> '+esc(p.task)+'</p>':'')+(p.variants&&p.variants.length?'<p><b>Варианты:</b> '+esc(p.variants.slice(0,3).join("; "))+'</p>':'')+'</div>';}).join("");}
  var questions=[];(t.selfWork||[]).forEach(function(w){(w.questions||[]).forEach(function(q){if(questions.indexOf(q)<0&&questions.length<5)questions.push(q);});});
  (t.test||[]).forEach(function(q){if(q&&q.q&&questions.indexOf(q.q)<0&&questions.length<5)questions.push(q.q);});
  if(questions.length)html+='<p><b>Контрольные вопросы:</b></p><ol>'+questions.map(function(q){return '<li>'+esc(q)+'</li>';}).join("")+'</ol>';
  else html+='<p class="slr-muted">В карточке темы нет отдельного списка контрольных вопросов. Используйте задания и самопроверку внутри лекции.</p>';
  html+='</div>';return html;
 }
 window.renderStudentGradesPage=function(){
  original.apply(this,arguments);
  var app=document.getElementById("app");if(!app||app.querySelector("#studentLearningRecommendations"))return;
  var panel=document.createElement("section");panel.className="module";panel.id="studentLearningRecommendations";
  panel.innerHTML='<h2>🧭 Мой маршрут повторения</h2><p class="slr-muted">Маршрут строится по сохранённым оценённым результатам. Конкретная тема показывается только при достаточно надёжном совпадении с названием работы или данными результата; оценка сама по себе не раскрывает ошибку.</p><div id="slrContent">Загружаем результаты…</div>';
  var host=app.querySelector(".hero");if(host)host.insertAdjacentElement("afterend",panel);else app.insertBefore(panel,app.firstChild);
  if(!window.API||!window.API.getMyCourseResults){panel.querySelector("#slrContent").textContent="Сервис личных результатов сейчас недоступен.";return;}
  window.API.getMyCourseResults("").then(function(r){
   if(!r||!r.success)throw Error(r&&r.error||"Не удалось загрузить результаты");
   var rows=(r.results||[]).filter(function(x){return x.grade!==""&&x.grade!==null&&x.grade!==undefined&&Number.isFinite(Number(x.grade));});
   var weak=rows.filter(function(x){return Number(x.grade)<4;}).sort(function(a,b){return Number(a.grade)-Number(b.grade)||String(b.finishedAt||"").localeCompare(String(a.finishedAt||""));});
   var groups={};
   weak.forEach(function(x){var course=String(x.courseId||"Без дисциплины"),key=course+"|"+String(x.testTitle||x.testId||"Работа");var item=groups[key]||(groups[key]={course:course,title:x.testTitle||x.testId||"Учебная работа",grade:Number(x.grade),date:x.finishedAt||"",count:0,rows:[]});item.count++;item.rows.push(x);if(Number(x.grade)<item.grade)item.grade=Number(x.grade);});
   var list=Object.keys(groups).map(function(k){return groups[k];}).sort(function(a,b){return a.grade-b.grade;}).slice(0,12);
   list.forEach(function(item){item.topic=findTopic(item.course,item.rows);});
   var html=list.length?'<p>По этим работам стоит повторить материал и выполнить практику:</p><div class="slr-list">'+list.map(function(x,i){return '<article class="slr-card"><div><b>'+esc(names[x.course]||x.course)+'</b><span>'+esc(x.title)+'</span><p>Низшая оценка: <b>'+esc(x.grade)+'</b>'+(x.count>1?' · результатов: '+x.count:'')+'</p></div>'+renderDetails(x)+'</article>';}).join("")+'</div>':'<p>По имеющимся оценённым работам с баллом ниже 4 рекомендаций нет. Продолжай обучение и проверяй новые результаты.</p>';
   panel.querySelector("#slrContent").innerHTML=html;
  }).catch(function(e){panel.querySelector("#slrContent").textContent="Не удалось сформировать маршрут: "+(e.message||e);});
 };
 var style=document.createElement("style");style.textContent="#studentLearningRecommendations .slr-muted{color:var(--muted);font-size:.92em}#studentLearningRecommendations .slr-list{display:grid;gap:14px}#studentLearningRecommendations .slr-card{padding:15px;border:1px solid var(--border);border-radius:12px;background:var(--card-soft)}#studentLearningRecommendations .slr-card>div:first-child{display:flex;flex-direction:column;gap:5px}#studentLearningRecommendations .slr-detail{margin-top:12px;padding-top:12px;border-top:1px dashed var(--border)}#studentLearningRecommendations .slr-task{margin:9px 0;padding:11px;border-left:3px solid var(--accent);background:var(--card);border-radius:7px}#studentLearningRecommendations .slr-detail li{margin:5px 0}";document.head.appendChild(style);
})();