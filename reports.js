"use strict";
window.renderCourseReportsPage=function(){
 const app=document.getElementById("app");if(!app)return;app.innerHTML="";
 const actor=window.state.staff;if(!actor||!["teacher","admin"].includes(actor.role)){app.innerHTML='<div class="module">Отчёты доступны только преподавателям и администраторам.</div>';return;}
 const crumbs=document.getElementById("crumbs");if(crumbs)crumbs.textContent="Отчеты преподавателя";
 app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>📊 Результаты студентов</h1><p>Загрузка реальных попыток из Google Sheets и старых результатов из профилей.</p></section><div class="module" style="padding:20px"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px"><select id="repFilterGroup" class="self-input" style="width:200px"><option value="">Все группы</option></select><select id="repFilterTest" class="self-input" style="width:280px"><option value="">Все тесты</option></select><select id="repFilterCourse" class="self-input" style="width:220px"><option value="">Все дисциплины</option></select><button class="btn" id="repRefresh">Обновить</button><button class="btn ghost" id="repExport">Экспорт CSV</button><span id="repStatus" style="color:var(--muted)"></span></div><div id="repAnalytics"></div><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th>Студент</th><th>Группа</th><th>Дисциплина</th><th>Работа</th><th>Оценка</th><th>Баллы</th><th>Ответ / работа</th><th>Попытки</th><th>Дата</th></tr></thead><tbody id="repTbody"><tr><td colspan="9">Загрузка…</td></tr></tbody></table></div></div>';
 let results=[];
 const labels={"07.01":"МДК 07.01","04.01":"МДК 04.01","02.01":"МДК 02.01","02.02":"МДК 02.02","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
 const esc=x=>window.escapeHtml(String(x==null?"":x));
 function updateFilters(){
  const fill=(id,values,caption)=>{const el=document.getElementById(id),old=el.value;el.innerHTML='<option value="">'+caption+'</option>'+Array.from(new Set(values.filter(Boolean))).sort().map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");if(values.includes(old))el.value=old;};
  fill("repFilterGroup",results.map(x=>x.group),"Все группы");fill("repFilterTest",results.map(x=>x.testTitle),"Все тесты");fill("repFilterCourse",results.map(x=>x.courseId),"Все дисциплины");
 }
 function render(){
  const g=document.getElementById("repFilterGroup").value,t=document.getElementById("repFilterTest").value,c=document.getElementById("repFilterCourse").value;
  const list=results.filter(x=>(!g||x.group===g)&&(!t||x.testTitle===t)&&(!c||x.courseId===c));
  renderAnalytics(list);
  document.getElementById("repTbody").innerHTML=list.length?list.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.group)+'</td><td>'+esc(labels[x.courseId]||x.courseId||"—")+'</td><td>'+esc(x.testTitle)+'</td><td style="font-weight:bold">'+esc(x.grade)+'</td><td>'+esc(x.score||0)+' / '+esc(x.maxScore||0)+' ('+esc(x.percent||0)+'%)</td><td>'+(x.payload?'<details><summary>Показать ответ</summary><div style="white-space:pre-wrap;max-width:360px;overflow-wrap:anywhere;padding:8px">'+esc(x.payload)+'</div></details>':'—')+'</td><td>'+esc(x.attempts||1)+'</td><td>'+esc(x.finishedAt?new Date(x.finishedAt).toLocaleString("ru-RU"):"—")+'</td></tr>').join(""):'<tr><td colspan="9" style="text-align:center;padding:20px">Нет результатов по выбранным фильтрам.</td></tr>';
  document.getElementById("repStatus").textContent="Записей: "+list.length+" / "+results.length;
 }
 function renderAnalytics(list){
  const host=document.getElementById("repAnalytics");if(!host)return;
  const students=new Map(),groups=new Map(),dist={5:0,4:0,3:0,2:0,1:0,0:0};
  let graded=0,total=0;
  list.forEach(x=>{
   const grade=Number(x.grade)||0;total++;
   if(grade>0){graded++;dist[Math.max(1,Math.min(5,Math.round(grade)))]++;}else dist[0]++;
   const key=String(x.email||"")+ "|" +String(x.name||"")+"|"+String(x.group||"");
   if(!students.has(key))students.set(key,{name:x.name||"Без имени",group:x.group||"—",grades:[],records:[],latest:null});
   const s=students.get(key);s.records.push(x);if(grade>0)s.grades.push(grade);
   const d=Date.parse(x.finishedAt||"");if(!s.latest||(!isNaN(d)&&d>s.latest.time))s.latest={grade:grade,time:isNaN(d)?0:d};
   const g=String(x.group||"—");if(!groups.has(g))groups.set(g,{count:0,students:new Set(),grades:[]});
   const gr=groups.get(g);gr.count++;gr.students.add(key);if(grade>0)gr.grades.push(grade);
  });
  const vals=Array.from(students.values()),avg=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
  const allGrades=list.map(x=>Number(x.grade)||0).filter(x=>x>0),average=avg(allGrades);
  const atRisk=vals.map(s=>({...s,average:avg(s.grades)})).filter(s=>s.grades.length&&(s.average<3|| (s.latest&&s.latest.grade>0&&s.latest.grade<3))).sort((a,b)=>a.average-b.average);
  const card=(label,value,note)=>'<div class="module" style="padding:14px;min-width:145px;flex:1;margin:0"><div style="font-size:12px;color:var(--muted)">'+label+'</div><div style="font-size:28px;font-weight:800;margin:5px 0">'+value+'</div><div style="font-size:11px;color:var(--muted)">'+note+'</div></div>';
  const groupRows=Array.from(groups.entries()).sort((a,b)=>a[0].localeCompare(b[0],"ru")).map(([name,g])=>'<tr><td>'+esc(name)+'</td><td>'+g.students.size+'</td><td>'+g.count+'</td><td>'+(g.grades.length?avg(g.grades).toFixed(2).replace(".",","):"—")+'</td></tr>').join("");
  const riskRows=atRisk.slice(0,12).map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+esc(s.group)+'</td><td>'+s.average.toFixed(2).replace(".",",")+'</td><td>'+esc(s.latest?s.latest.grade:"—")+'</td><td>'+s.records.length+'</td></tr>').join("");
  const colors=[5,4,3,2,1,0].map(n=>{const pct=graded?Math.round(dist[n]/Math.max(1,total)*100):0;return '<div style="display:flex;align-items:center;gap:8px;margin:5px 0"><span style="width:24px;font-weight:700">'+(n||"—")+'</span><div style="height:10px;flex:1;background:var(--surface-2,#e8e8e8);border-radius:8px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+(n>=4?"var(--ok)":n===3?"var(--gold)":"var(--err)")+'"></div></div><span style="width:42px;text-align:right;font-size:12px">'+dist[n]+'</span></div>';}).join("");
  host.innerHTML='<div style="display:flex;gap:10px;flex-wrap:wrap;margin:0 0 14px">'+card("Попыток",total,"по выбранным фильтрам")+card("Обучающихся",vals.length,"есть хотя бы одна запись")+card("Оценено",graded,"из "+total+" попыток")+card("Средний балл",graded?average.toFixed(2).replace(".",","):"—","без неоценённых работ")+'</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:14px"><section class="module" style="padding:14px;margin:0"><h3 style="margin-top:0">Распределение оценок</h3>'+colors+'</section><section class="module" style="padding:14px;margin:0"><h3 style="margin-top:0">Показатели по группам</h3><div style="overflow-x:auto"><table style="width:100%;font-size:13px"><thead><tr><th>Группа</th><th>Студ.</th><th>Попытки</th><th>Средний</th></tr></thead><tbody>'+(groupRows||'<tr><td colspan="4">Нет данных</td></tr>')+'</tbody></table></div></section></div><section class="module" style="padding:14px;margin:0 0 16px"><h3 style="margin-top:0">Требуют внимания</h3><p style="font-size:12px;color:var(--muted)">Критерий: средний балл ниже 3 или последняя оценённая работа ниже 3. Это ориентир для преподавателя, а не автоматическое решение об успеваемости.</p><div style="overflow-x:auto"><table style="width:100%;font-size:13px"><thead><tr><th>Обучающийся</th><th>Группа</th><th>Средний балл</th><th>Последняя оценка</th><th>Попыток</th></tr></thead><tbody>'+(riskRows||'<tr><td colspan="5">По выбранным фильтрам таких записей нет.</td></tr>')+'</tbody></table></div></section>';
 }
 function load(){
  document.getElementById("repTbody").innerHTML='<tr><td colspan="9">Загрузка результатов…</td></tr>';
  document.getElementById("repStatus").textContent="Подключение к серверу…";
  window.API.getResults({}).then(r=>{if(!r||!r.success)throw new Error(r&&r.error||"Сервер не вернул результаты.");results=r.results||[];updateFilters();render();}).catch(e=>{document.getElementById("repTbody").innerHTML='<tr><td colspan="8" style="color:var(--err)">Не удалось загрузить результаты: '+esc(e.message)+'</td></tr>';document.getElementById("repStatus").textContent="Проверьте соединение и публикацию Apps Script.";});
 }
 ["repFilterGroup","repFilterTest","repFilterCourse"].forEach(id=>document.getElementById(id).onchange=render);
 document.getElementById("repRefresh").onclick=load;
 document.getElementById("repExport").onclick=function(){
  const g=document.getElementById("repFilterGroup").value,t=document.getElementById("repFilterTest").value,c=document.getElementById("repFilterCourse").value;
  const rows=results.filter(x=>(!g||x.group===g)&&(!t||x.testTitle===t)&&(!c||x.courseId===c));
  const cell=v=>{let s=String(v==null?"":v);if(/^[=+\-@\t\r]/.test(s))s="\'"+s;return '"' + s.replace(/"/g,'""') + '"' ;};
  const csv=[["ФИО","Группа","Дисциплина","Работа","Оценка","Баллы","Максимум","Процент","Ответ / работа","Попытки","Дата"].map(cell).join(";")].concat(rows.map(x=>[x.name,x.group,labels[x.courseId]||x.courseId,x.testTitle,x.grade,x.score,x.maxScore,x.percent,x.payload,x.attempts,x.finishedAt].map(cell).join(";")));
  const blob=new Blob(["\uFEFF"+csv.join("\r\n")],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="rezultaty-studentov.csv";a.click();URL.revokeObjectURL(url);
 };
 load();
};