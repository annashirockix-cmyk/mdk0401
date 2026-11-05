"use strict";
window.renderCourseReportsPage=function(){
 const app=document.getElementById("app");if(!app)return;app.innerHTML="";
 const crumbs=document.getElementById("crumbs");if(crumbs)crumbs.textContent="Отчеты преподавателя";
 app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>📊 Результаты студентов</h1><p>Загрузка реальных попыток из Google Sheets и старых результатов из профилей.</p></section><div class="module" style="padding:20px"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px"><select id="repFilterGroup" class="self-input" style="width:200px"><option value="">Все группы</option></select><select id="repFilterTest" class="self-input" style="width:280px"><option value="">Все тесты</option></select><select id="repFilterCourse" class="self-input" style="width:220px"><option value="">Все дисциплины</option></select><button class="btn" id="repRefresh">Обновить</button><button class="btn ghost" id="repExport">Экспорт CSV</button><span id="repStatus" style="color:var(--muted)"></span></div><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th>Студент</th><th>Группа</th><th>Дисциплина</th><th>Работа</th><th>Оценка</th><th>Баллы</th><th>Попытки</th><th>Дата</th></tr></thead><tbody id="repTbody"><tr><td colspan="8">Загрузка…</td></tr></tbody></table></div></div>';
 let results=[];
 const labels={"07.01":"МДК 07.01","04.01":"МДК 04.01","02.01":"МДК 02.01","02.02":"МДК 02.02","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда"};
 const esc=x=>window.escapeHtml(String(x==null?"":x));
 function updateFilters(){
  const fill=(id,values,caption)=>{const el=document.getElementById(id),old=el.value;el.innerHTML='<option value="">'+caption+'</option>'+Array.from(new Set(values.filter(Boolean))).sort().map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");if(values.includes(old))el.value=old;};
  fill("repFilterGroup",results.map(x=>x.group),"Все группы");fill("repFilterTest",results.map(x=>x.testTitle),"Все тесты");fill("repFilterCourse",results.map(x=>x.courseId),"Все дисциплины");
 }
 function render(){
  const g=document.getElementById("repFilterGroup").value,t=document.getElementById("repFilterTest").value,c=document.getElementById("repFilterCourse").value;
  const list=results.filter(x=>(!g||x.group===g)&&(!t||x.testTitle===t)&&(!c||x.courseId===c));
  document.getElementById("repTbody").innerHTML=list.length?list.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.group)+'</td><td>'+esc(labels[x.courseId]||x.courseId||"—")+'</td><td>'+esc(x.testTitle)+'</td><td style="font-weight:bold">'+esc(x.grade)+'</td><td>'+esc(x.score||0)+' / '+esc(x.maxScore||0)+' ('+esc(x.percent||0)+'%)</td><td>'+esc(x.attempts||1)+'</td><td>'+esc(x.finishedAt?new Date(x.finishedAt).toLocaleString("ru-RU"):"—")+'</td></tr>').join(""):'<tr><td colspan="8" style="text-align:center;padding:20px">Нет результатов по выбранным фильтрам.</td></tr>';
  document.getElementById("repStatus").textContent="Записей: "+list.length+" / "+results.length;
 }
 function load(){
  document.getElementById("repTbody").innerHTML='<tr><td colspan="8">Загрузка результатов…</td></tr>';
  document.getElementById("repStatus").textContent="Подключение к серверу…";
  window.API.getResults({}).then(r=>{if(!r||!r.success)throw new Error(r&&r.error||"Сервер не вернул результаты.");results=r.results||[];updateFilters();render();}).catch(e=>{document.getElementById("repTbody").innerHTML='<tr><td colspan="8" style="color:var(--err)">Не удалось загрузить результаты: '+esc(e.message)+'</td></tr>';document.getElementById("repStatus").textContent="Проверьте соединение и публикацию Apps Script.";});
 }
 ["repFilterGroup","repFilterTest","repFilterCourse"].forEach(id=>document.getElementById(id).onchange=render);
 document.getElementById("repRefresh").onclick=load;
 document.getElementById("repExport").onclick=function(){
  const g=document.getElementById("repFilterGroup").value,t=document.getElementById("repFilterTest").value,c=document.getElementById("repFilterCourse").value;
  const rows=results.filter(x=>(!g||x.group===g)&&(!t||x.testTitle===t)&&(!c||x.courseId===c));
  const cell=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const csv=[["Email","ФИО","Группа","Дисциплина","Работа","Оценка","Баллы","Максимум","Процент","Попытки","Дата"].map(cell).join(";")].concat(rows.map(x=>[x.email,x.name,x.group,labels[x.courseId]||x.courseId,x.testTitle,x.grade,x.score,x.maxScore,x.percent,x.attempts,x.finishedAt].map(cell).join(";")));
  const blob=new Blob(["\uFEFF"+csv.join("\r\n")],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="rezultaty-studentov.csv";a.click();URL.revokeObjectURL(url);
 };
 load();
};