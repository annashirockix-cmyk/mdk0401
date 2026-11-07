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
   function avg(a){return a.length?Math.round(a.reduce(function(x,y){return x+y;},0)/a.length*10)/10:0;}
   function gradeCount(a,g){return a.filter(function(x){return Number(x.grade)===g;}).length;}
   var groups={};students.forEach(function(s){var g=s.group||"Без группы";(groups[g]||(groups[g]=[])).push(s);});
   var groupRows=Object.keys(groups).sort().map(function(g){
    var emails=groups[g].map(function(s){return String(s.email||"").toLowerCase();}),gr=rows.filter(function(r){return emails.includes(String(r.email||"").toLowerCase());}),grades=gr.map(function(r){return Number(r.grade);}).filter(Number.isFinite);
    return {name:g,students:groups[g].length,works:gr.length,average:avg(grades),passed:grades.filter(function(x){return x>=3;}).length};
   });
   var workMap={};rows.forEach(function(r){var k=r.testTitle||r.testId;(workMap[k]||(workMap[k]=[])).push(Number(r.grade));});
   var workRows=Object.keys(workMap).map(function(k){var a=workMap[k].filter(Number.isFinite);return {name:k,count:a.length,average:avg(a)};}).sort(function(a,b){return b.count-a.count;});
   var studentRows=students.map(function(s){var a=rows.filter(function(r){return String(r.email||"").toLowerCase()===String(s.email||"").toLowerCase();}),grades=a.map(function(r){return Number(r.grade);}).filter(Number.isFinite);return {name:s.name||s.email,group:s.group||"Без группы",count:a.length,average:avg(grades),last:a.slice().sort(function(x,y){return String(y.date||y.finishedAt||"").localeCompare(String(x.date||x.finishedAt||""));})[0]};}).sort(function(a,b){return a.group.localeCompare(b.group)||a.name.localeCompare(b.name);});
   var allGrades=rows.map(function(r){return Number(r.grade);}).filter(Number.isFinite),participating=studentRows.filter(function(s){return s.count>0;}).length;
   box.querySelector("#maStatus").innerHTML='<p><b>Участников с результатами:</b> '+participating+' из '+students.length+' · <b>работ выполнено:</b> '+rows.length+' · <b>средняя оценка:</b> '+(allGrades.length?avg(allGrades):"—")+'</p>';
   var html='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px;margin:12px 0">'+[["Студентов",students.length],["С результатами",participating],["Работ",rows.length],["Средний балл",allGrades.length?avg(allGrades):"—"],["Оценок 5",gradeCount(rows,5)],["Оценок 2",gradeCount(rows,2)]].map(function(x){return '<div class="card" style="padding:12px"><div style="font-size:12px;color:var(--muted)">'+x[0]+'</div><b style="font-size:23px">'+x[1]+'</b></div>';}).join("")+'</div>';
   html+='<h3>Сравнение групп</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Группа</th><th>Студентов</th><th>Работ</th><th>Средний балл</th><th>Успешно (3–5)</th></tr></thead><tbody>'+groupRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.name)+'</td><td>'+x.students+'</td><td>'+x.works+'</td><td><b>'+ (x.works?x.average:"—")+'</b></td><td>'+x.passed+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<h3>Результаты по лабораторным работам</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Работа</th><th>Попыток</th><th>Средняя оценка</th></tr></thead><tbody>'+workRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.name)+'</td><td>'+x.count+'</td><td>'+x.average+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<h3>Индивидуальная успеваемость</h3><div style="overflow:auto;max-height:420px"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Группа</th><th>Студент</th><th>Работ</th><th>Средний балл</th><th>Последняя оценка</th></tr></thead><tbody>'+studentRows.map(function(x){return '<tr style="border-top:1px solid var(--border)"><td>'+esc(x.group)+'</td><td>'+esc(x.name)+'</td><td>'+x.count+'</td><td>'+(x.count?x.average:"—")+'</td><td>'+(x.last?esc(x.last.grade)+" ("+esc(x.last.date||"—")+")":"—")+'</td></tr>';}).join("")+'</tbody></table></div>';
   html+='<p style="font-size:12px;color:var(--muted)">Важно: статистика строится только по сохранённым результатам с testId, начинающимся на metrology_. Пустые результаты не трактуются как неудовлетворительная оценка. Средний балл — арифметическое среднее имеющихся оценок.</p><button class="btn btn-primary" id="maExport">Скачать аналитику CSV</button>';
   box.querySelector("#maContent").innerHTML=html;
   box.querySelector("#maExport").onclick=function(){
    var data=[["Группа","Студент","Количество работ","Средний балл","Последняя оценка","Дата последней оценки"]].concat(studentRows.map(function(x){return [x.group,x.name,x.count,x.count?x.average:"",x.last?x.last.grade:"",x.last?x.last.date||"":""];}),[[],["Сводка по группам"],["Группа","Студентов","Работ","Средний балл","Успешно"]],groupRows.map(function(x){return [x.name,x.students,x.works,x.works?x.average:"",x.passed];}),[[],["Результаты по работам"],["Работа","Попыток","Средняя оценка"]],workRows.map(function(x){return [x.name,x.count,x.average];}));
    var csv="\uFEFF"+data.map(function(row){return row.map(function(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"';}).join(";");}).join("\r\n");
    var blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="analitika-metrologiya.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   };
  }).catch(function(e){box.querySelector("#maStatus").textContent="Ошибка загрузки аналитики: "+(e.message||e);});
 }
 var prior=window.renderMetrologyLabPlus;
 if(typeof prior==="function")window.renderMetrologyLabPlus=function(){prior();mount();};
 else window.addEventListener("load",mount);
})();