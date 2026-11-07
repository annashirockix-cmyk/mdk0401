"use strict";
(function(){
 var original=window.renderStudentGradesPage;
 if(typeof original!=="function")return;
 var names={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","MET":"Метрология","OT":"Охрана труда","PFI":"ПФИ"};
 function esc(v){return window.escapeHtml(String(v==null?"":v));}
 function target(course){if(course==="MET")return "#/metrology-trainer";if(["07.01","04.01","02.01","02.02"].indexOf(course)>=0)return "#/training/"+encodeURIComponent(course);if(course==="MCAM")return "#/training/MCAM";return "#/grades";}
 window.renderStudentGradesPage=function(){
  original.apply(this,arguments);
  var app=document.getElementById("app");if(!app||app.querySelector("#studentLearningRecommendations"))return;
  var panel=document.createElement("section");panel.className="module";panel.id="studentLearningRecommendations";
  panel.innerHTML='<h2>🧭 Мой маршрут повторения</h2><p style="color:var(--muted)">Рекомендации формируются по сохранённым оценённым результатам всех доступных дисциплин. Они показывают, к каким работам стоит вернуться, но не определяют конкретную ошибку без анализа ответов.</p><div id="slrContent">Загружаем результаты…</div>';
  var host=app.querySelector(".hero");if(host)host.insertAdjacentElement("afterend",panel);else app.insertBefore(panel,app.firstChild);
  if(!window.API||!window.API.getMyCourseResults){panel.querySelector("#slrContent").textContent="Сервис личных результатов сейчас недоступен.";return;}
  window.API.getMyCourseResults("").then(function(r){
   if(!r||!r.success)throw Error(r&&r.error||"Не удалось загрузить результаты");
   var rows=(r.results||[]).filter(function(x){return x.grade!==""&&x.grade!==null&&x.grade!==undefined&&Number.isFinite(Number(x.grade));});
   var weak=rows.filter(function(x){return Number(x.grade)<4;}).sort(function(a,b){return Number(a.grade)-Number(b.grade)||String(b.finishedAt||"").localeCompare(String(a.finishedAt||""));});
   var groups={};
   weak.forEach(function(x){var id=String(x.courseId||"Без дисциплины"),key=id+"|"+String(x.testTitle||x.testId||"Работа");var item=groups[key]||(groups[key]={course:id,title:x.testTitle||x.testId||"Учебная работа",grade:Number(x.grade),date:x.finishedAt||"",count:0});item.count++;if(Number(x.grade)<item.grade)item.grade=Number(x.grade);});
   var list=Object.keys(groups).map(function(k){return groups[k];}).sort(function(a,b){return a.grade-b.grade;}).slice(0,12);
   var html=list.length?'<p>Есть темы и работы, которым полезно уделить дополнительное внимание:</p><div class="wb-resources">'+list.map(function(x){return '<article class="wb-resource"><b>'+esc(names[x.course]||x.course)+'</b><span>'+esc(x.title)+'</span><p>Низшая оценка: <b>'+esc(x.grade)+'</b>'+(x.count>1?' · результатов: '+x.count:'')+'</p><a class="btn ghost" href="'+target(x.course)+'">Перейти к повторению ↗</a></article>';}).join("")+'</div>':'<p>По имеющимся оценённым работам с баллом ниже 4 рекомендаций нет. Продолжай обучение и проверяй новые результаты.</p>';
   panel.querySelector("#slrContent").innerHTML=html;
  }).catch(function(e){panel.querySelector("#slrContent").textContent="Не удалось сформировать маршрут: "+(e.message||e);});
 };
})();
