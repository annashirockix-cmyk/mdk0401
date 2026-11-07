"use strict";
(function(){
 function esc(v){return String(v==null?"":v).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
 function mount(){
  var app=document.getElementById("app");if(!app||app.querySelector("#metrologyAnalytics"))return;
  var staff=window.state&&window.state.staff;
  if(!staff||!["teacher","admin"].includes(staff.role))return;
  var box=document.createElement("section");box.id="metrologyAnalytics";box.className="card";box.style.cssText="padding:16px;margin-top:16px";
  box.innerHTML='<h2>Аналитика преподавателя: метрология</h2><p>Сводка по выполненным работам, оценкам и группам на основе результатов, сохранённых в общей базе.</p><div id="maStatus">Загрузка статистики…</div><div id="maContent"></div>';
  app.appendChild(box);
  if(!window.API||!window.API.getStudents||!window.API.getResults){box.querySelector("#maStatus").textContent="API аналитики недоступен.";return;}
  Promise.all([window.API.getStudents(),window.API.getResults({courseId:"MET"})]).then(function(res){
   var sr=res[0],rr=res[1];
   if(!sr||!(sr.ok||sr.success)||!Array.isArray(sr.students))throw new Error(sr&&sr.error||"Не удалось загрузить студентов.");
   if(!rr||!rr.success)throw new Error(rr&&rr.error||"Не удалось загрузить результаты.");
   var students=sr.students.filter(function(s){return String(s.role||"student").toLowerCase()==="student"&&(staff.role==="admin"||(s.courses||[]).includes("MET"));});
   var ids={};students.forEach(function(s){ids[String(s.email||"").toLowerCase()]=s;});
   var rows=(rr.results||[]).filter(function(r){return r.courseId==="MET"&&String(r.testId||"").indexOf("metrology_")===0&&ids[String(r.email||"").toLowerCase()];});
   // Официальные оценки преподавателя имеют ID metrology_<инструмент>_YYYYMMDD.
   // Тренажёры и адаптивные упражнения остаются диагностическими результатами.
   var officialRows=rows.filter(function(r){return /^metrology_(caliper|micrometer|depth|indicator|tolerance|protocol)_\\d{8}$/.test(String(r.testId||""));});
   function avg(a){return a.length?Math.round(a.reduce(function(x,y){return x+y;},0)/a.length*10)/10:0;}
   function gradeCount(a,g){return a.filter(function(x){return Number(x.grade)===g;}).length;}
   var groups={};students.forEach(function(s){var g=s.group||"Без группы";(groups[g]||(groups[g]=[])).push(s);});
   var groupRows=Object.keys(groups).sort().map(function(g){
    var emails=groups[g].map(function(s){return String(s.email||"").toLowerCase();}),gr=officialRows.filter(function(r){return emails.includes(String(r.email||"").toLowerCase());}),grades=gr.map(function(r){return Number(r.grade);}).filter(Number.isFinite);
    return {name:g,students:groups[g].length,works:gr.length,average:avg(grades),passed:grades.filter(function(x){return x>=3;}).length};
   });
   var workMap={};officialRows.forEach(function(r){var k=r.testTitle||r.testId;(workMap[k]||(workMap[k]=[])).push(Number(r.grade));});
   var workRows=Object.keys(workMap).map(function(k){var a=workMap[k].filter(Number.isFinite);return {name:k,count:a.length,average:avg(a)};}).sort(function(a,b){return b.count-a.count;});
   var studentRows=students.map(function(s){var a=officialRows.filter(function(r){return String(r.email||"").toLowerCase()===String(s.email||"").toLowerCase();}),grades=a.map(function(r){return Number(r.grade);}).filter(Number.isFinite);return {name:s.name||s.email,group:s.group||"Без группы",count:a.length,average:avg(grades),last:a.slice().sort(function(x,y){return String(y.date||y.finishedAt||"").localeCompare(String(x.date||x.finishedAt||""));})[0]};}).sort(function(a,b){return a.group.localeCompare(b.group)||a.name.localeCompare(b.name);});

   var topicDefs=[
    {id:"caliper",name:"Штангенциркуль",re:/штангенцирк|caliper/i,advice:"Повтори устройство штангенциркуля, цену деления и чтение основной шкалы с нониусом."},
    {id:"micrometer",name:"Микрометр",re:/микрометр|micrometer/i,advice:"Повтори устройство микрометра, трещотку, шкалу стебля и барабана."},
    {id:"depth",name:"Глубиномер",re:/глубиномер|глубин/i,advice:"Повтори установку глубиномера на базовую поверхность и считывание нониуса."},
    {id:"indicator",name:"Индикатор и биение",re:/индикатор|биени|runout|dial/i,advice:"Повтори установку индикатора, определение Min/Max и расчёт размаха R = Xmax − Xmin."},
    {id:"tolerance",name:"Допуски и посадки",re:/допуск|предельн|посадк|tolerance/i,advice:"Повтори ES, EI, предельные размеры, допуск и проверку фактического размера."},
    {id:"error",name:"Погрешности измерений",re:/погрешност|ошибк.*измер|точност|error/i,advice:"Повтори абсолютную и относительную погрешность, среднее значение и правила записи результата."}
   ];
   function topicsFor(list){
    var found={};list.forEach(function(r){var text=[r.testId,r.testTitle,r.feedback].join(" ");topicDefs.forEach(function(t){if(t.re.test(text))found[t.id]=t;});});
    return topicDefs.filter(function(t){return found[t.id];});
   }
   function weakTopics(list){
    return topicsFor(list).map(function(t){var subset=list.filter(function(r){return t.re.test([r.testId,r.testTitle,r.feedback].join(" "));}),grades=subset.map(function(r){return Number(r.grade);}).filter(Number.isFinite),mean=avg(grades),low=subset.filter(function(r){return Number(r.grade)<=3;}).length;return {id:t.id,topic:t.name,count:subset.length,average:mean,low:low,advice:t.advice,weak:mean<4||low>0};});
   }
   var topicStats=topicDefs.map(function(t){var subset=rows.filter(function(r){return t.re.test([r.testId,r.testTitle,r.feedback].join(" "));}),grades=subset.map(function(r){return Number(r.grade);}).filter(Number.isFinite);return {name:t.name,count:subset.length,average:avg(grades),low:subset.filter(function(r){return Number(r.grade)<=3;}).length,advice:t.advice};}).filter(function(t){return t.count>0;});
   var diagnosticStudents=students.map(function(st){var srRows=rows.filter(function(r){return String(r.email||"").toLowerCase()===String(st.email||"").toLowerCase();}),weak=weakTopics(srRows).filter(function(t){return t.weak;});return {name:st.name||st.email,group:st.group||"Без группы",email:st.email,weak:weak,workCount:srRows.length};}).filter(function(x){return x.weak.length;}).sort(function(a,b){return b.weak.length-a.weak.length||a.group.localeCompare(b.group);});
   var groupWeak={};diagnosticStudents.forEach(function(st){st.weak.forEach(function(t){var k=st.group+"|"+t.topic;groupWeak[k]=(groupWeak[k]||0)+1;});});
   var groupTopicRows=Object.keys(groupWeak).map(function(k){var p=k.split("|");return {group:p[0],topic:p[1],students:groupWeak[k]};}).sort(function(a,b){return b.students-a.students;});

   var allGrades=officialRows.map(function(r){return Number(r.grade);}).filter(Number.isFinite),participating=studentRows.filter(function(s){return s.count>0;}).length;
   box.querySelector("#maStatus").innerHTML='<p><b>Участников с оценками преподавателя:</b> '+participating+' из '+students.length+' · <b>оценённых работ:</b> '+officialRows.length+' · <b>средняя оценка:</b> '+(allGrades.length?avg(allGrades):"—")+'</p><p style="font-size:12px;color:var(--muted)">Самопроверки тренажёров и адаптивных упражнений учитываются отдельно — только для диагностики тем, не как официальные оценки.</p>';
   var html='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px;margin:12px 0">'+[["Студентов",students.length],["С оценками",participating],["Оценённых работ",officialRows.length],["Средний балл",allGrades.length?avg(allGrades):"—"],["Оценок 5",gradeCount(officialRows,5)],["Оценок 2",gradeCount(officialRows,2)]].map(function(x){return '<div class="card" style="padding:12px"><div style="font-size:12px;color:var(--muted)">'+x[0]+'</div><b style="font-size:23px">'+x[1]+'</b></div>';}).join("")+'</div>';
   html+='<h3>Сравнение групп по оценкам преподавателя</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Группа</th><th>Студентов</th><th>Работ</th><th>Средний балл</th><th>Успешно (3–5)</th></tr></thead><tbody>'+groupRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.name)+'</td><td>'+x.students+'</td><td>'+x.works+'</td><td><b>'+ (x.works?x.average:"—")+'</b></td><td>'+x.passed+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<h3>Результаты по оценённым лабораторным работам</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Работа</th><th>Попыток</th><th>Средняя оценка</th></tr></thead><tbody>'+workRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.name)+'</td><td>'+x.count+'</td><td>'+x.average+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<h3>Индивидуальная успеваемость</h3><div style="overflow:auto;max-height:420px"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Группа</th><th>Студент</th><th>Работ</th><th>Средний балл</th><th>Последняя оценка</th></tr></thead><tbody>'+studentRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.group)+'</td><td>'+esc(x.name)+'</td><td>'+x.count+'</td><td>'+(x.count?x.average:"—")+'</td><td>'+(x.last?esc(x.last.grade)+" ("+esc(x.last.date||"—")+")":"—")+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<h3>Диагностика по темам</h3><p style="color:var(--muted)">Темы определяются по названию сохранённой работы и её идентификатору. Это предварительная диагностика, а не анализ каждого ответа студента.</p><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Тема</th><th>Работ</th><th>Средний балл</th><th>Оценок 2–3</th><th>Рекомендация</th></tr></thead><tbody>'+topicStats.map(function(t){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(t.name)+'</td><td>'+t.count+'</td><td>'+(t.count?t.average:"—")+'</td><td>'+t.low+'</td><td>'+esc(t.advice)+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<h3>Студенты, которым полезно повторение</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Группа</th><th>Студент</th><th>Тема для повторения</th><th>Рекомендация</th></tr></thead><tbody>'+diagnosticStudents.map(function(st){return st.weak.map(function(t){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(st.group)+'</td><td>'+esc(st.name)+'</td><td>'+esc(t.topic)+' (ср. '+t.average+')</td><td>'+esc(t.advice)+'<br><button type="button" class="btn" data-ma-assign="'+esc(t.id)+'" data-ma-email="'+esc(st.email)+'" data-ma-name="'+esc(st.name)+'">Назначить повторение</button> <small data-ma-status="'+esc(t.id)+'-'+esc(st.email)+'"></small></td></tr>';}).join("");}).join("")+'</tbody></table>'+(diagnosticStudents.length?"":"<p>По имеющимся оценкам явные темы для повторения не выявлены. Недостаток данных не означает полного освоения материала.</p>")+'</div>';
   html+='<h3>Темы для повторения по группам</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Группа</th><th>Тема</th><th>Студентов с сигналом</th></tr></thead><tbody>'+groupTopicRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.group)+'</td><td>'+esc(x.topic)+'</td><td>'+x.students+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<p style="font-size:12px;color:var(--muted)">Важно: диагностика строится по названиям работ и итоговым оценкам. Точный анализ ошибок по отдельным вопросам потребует сохранять в API ответы и баллы по каждому навыку. Непройденная тема не считается ошибкой.</p><button class="btn btn-primary" id="maExport">Скачать аналитику CSV</button>';
   box.querySelector("#maContent").innerHTML=html;
   var assignmentTemplates={
    caliper:{title:"Штангенциркуль",instructions:"Повтори устройство штангенциркуля, основную шкалу, нониус и цену деления. Реши три измерительные задачи. Покажи ход считывания показаний и итог с единицей измерения.",criteria:"Правильное считывание шкалы — 2 балла; расчёты и единицы измерения — 2 балла; запись результата — 1 балл."},
    micrometer:{title:"Микрометр",instructions:"Повтори устройство микрометра, назначение трещотки, шкалу стебля и барабана. Реши три задачи на определение размера по показаниям.",criteria:"Чтение стебля — 2 балла; чтение барабана и расчёт — 2 балла; запись результата — 1 балл."},
    depth:{title:"Глубиномер",instructions:"Повтори назначение глубиномера и установку опорной поверхности на базовую плоскость. Реши три задачи на определение глубины по основной шкале и нониусу.",criteria:"Выбор базы — 1 балл; считывание показаний — 2 балла; расчёт и запись — 2 балла."},
    indicator:{title:"Индикатор и биение",instructions:"Повтори установку индикатора часового типа и определение наибольшего и наименьшего показаний. Для трёх наборов вычисли R = Xmax − Xmin и сравни с допуском.",criteria:"Определение Xmax и Xmin — 2 балла; расчёт размаха — 2 балла; обоснованный вывод — 1 балл."},
    tolerance:{title:"Допуски и предельные размеры",instructions:"Повтори номинальный размер, ES, EI, предельные размеры и допуск. Для трёх вариантов рассчитай Dmax, Dmin и T, затем проверь фактический размер.",criteria:"Расчёт Dmax и Dmin — 2 балла; расчёт T — 2 балла; решение о годности — 1 балл."},
    error:{title:"Погрешности измерений",instructions:"Повтори абсолютную и относительную погрешности. Для трёх наборов вычисли Δ = Xизм − Xэт и δ = |Δ| / Xэт × 100%. Укажи единицы и округление.",criteria:"Абсолютная погрешность — 2 балла; относительная — 2 балла; запись и округление — 1 балл."}
   };
   box.querySelectorAll("[data-ma-assign]").forEach(function(btn){
    btn.onclick=function(){
     var topic=assignmentTemplates[btn.getAttribute("data-ma-assign")],email=btn.getAttribute("data-ma-email"),name=btn.getAttribute("data-ma-name"),status=btn.parentNode.querySelector("[data-ma-status]");
     if(!topic||!email||!window.API||!window.API.createAssignment){if(status)status.textContent="Сервис назначения недоступен.";return;}
     btn.disabled=true;if(status)status.textContent="Создаём задание…";
     var due=new Date();due.setDate(due.getDate()+7);
     var dueAt=due.getFullYear()+"-"+String(due.getMonth()+1).padStart(2,"0")+"-"+String(due.getDate()).padStart(2,"0");
     window.API.createAssignment({courseId:"MET",targetType:"individual",targetValue:email,title:"Повторение: "+topic.title+" — "+name,topic:topic.title,level:"Индивидуальная коррекция",workType:"Повторение темы",dueAt:dueAt,instructions:topic.instructions,criteria:topic.criteria}).then(function(result){
      if(!result||!result.success)throw new Error(result&&result.error||"Не удалось назначить работу");
      if(status)status.textContent="Назначено до "+new Date(dueAt+"T00:00:00").toLocaleDateString("ru-RU");
      btn.textContent="Назначено";
     }).catch(function(error){btn.disabled=false;if(status)status.textContent="Ошибка: "+(error.message||error);});
    };
   });
   box.querySelector("#maExport").onclick=function(){
    var data=[["Группа","Студент","Количество работ","Средний балл","Последняя оценка","Дата последней оценки"]].concat(studentRows.map(function(x){return [x.group,x.name,x.count,x.count?x.average:"",x.last?x.last.grade:"",x.last?x.last.date||"":""];}),[[],["Диагностика слабых тем"],["Группа","Студент","Тема","Средний балл по теме","Рекомендация"]],diagnosticStudents.reduce(function(a,st){return a.concat(st.weak.map(function(t){return [st.group,st.name,t.topic,t.average,t.advice];}));},[]),[[],["Сводка по группам"],["Группа","Студентов","Работ","Средний балл","Успешно"]],groupRows.map(function(x){return [x.name,x.students,x.works,x.works?x.average:"",x.passed];}),[[],["Результаты по работам"],["Работа","Попыток","Средняя оценка"]],workRows.map(function(x){return [x.name,x.count,x.average];}));
    var csv="\uFEFF"+data.map(function(row){return row.map(function(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"';}).join(";");}).join("\r\n");
    var blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="analitika-metrologiya.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   };
  }).catch(function(e){box.querySelector("#maStatus").textContent="Ошибка загрузки аналитики: "+(e.message||e);});
 }
 var prior=window.renderMetrologyLabPlus;
 if(typeof prior==="function")window.renderMetrologyLabPlus=function(){prior();mount();};
 else window.addEventListener("load",mount);
})();