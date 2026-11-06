"use strict";
window.renderTeacherDashboard=function(){
const app=document.getElementById("app"),crumb=document.getElementById("crumbs"),staff=window.state.staff;
if(!app)return;crumb.textContent="Панель преподавателя";
if(!staff||!["teacher","admin"].includes(String(staff.role).toLowerCase())){app.innerHTML='<section class="module">⛔ Доступ только преподавателю.</section>';return;}
app.innerHTML='<div class="teacher-dashboard"><div class="td-head"><div><a href="#/">← На главную</a><h1>Панель преподавателя</h1><p>Сводка по заданиям, группам и результатам</p></div><button class="btn ghost" id="tdRefresh">↻ Обновить</button></div><p id="tdStatus">Загрузка…</p><div id="tdContent"></div></div>';
const E=v=>window.escapeHtml(String(v==null?"":v));
const courses={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
function load(){
document.getElementById("tdStatus").textContent="Обновляем…";
Promise.all([window.API.getStudents(),window.API.getResults({}),window.API.getAssignments()]).then(([u,r,a])=>{
if(!u||!(u.success||u.ok))throw Error(u&&u.error||"Не удалось получить студентов");
if(!r||!r.success)throw Error(r&&r.error||"Не удалось получить результаты");
if(!a||!a.success)throw Error(a&&a.error||"Не удалось получить задания");
const students=(u.students||[]).filter(x=>String(x.role||"student").toLowerCase()==="student"&&(staff.role==="admin"||(x.courses||[]).some(c=>(staff.courses||[]).includes(c))));
const results=(r.results||[]).filter(x=>staff.role==="admin"||!x.courseId||(staff.courses||[]).includes(x.courseId));
const tasks=(a.assignments||[]).filter(x=>staff.role==="admin"||(staff.courses||[]).includes(x.courseId));
const subs=tasks.flatMap(t=>(t.submissions||[]).map(s=>Object.assign({task:t.title,courseId:t.courseId,taskId:t.id},s)));
const wait=subs.filter(s=>s.status!=="reviewed"),done=subs.filter(s=>s.status==="reviewed");
const overdue=tasks.filter(t=>t.dueAt&&new Date(String(t.dueAt).slice(0,10)+"T23:59:59")<new Date()&&(!(t.submissions||[]).length||(t.submissions||[]).some(s=>s.status!=="reviewed")));
const marks=results.filter(x=>x.grade!==""&&x.grade!==null&&x.grade!==undefined);
const avg=marks.length?(marks.reduce((n,x)=>n+Number(x.grade),0)/marks.length).toFixed(2):"—";
const groups={};students.forEach(s=>{const g=s.group||"Без группы";(groups[g]||(groups[g]=[])).push(s);});
const stat=(n,l)=>'<article class="td-stat"><b>'+E(n)+'</b><span>'+E(l)+'</span></article>';
const courseIds=[...new Set(tasks.map(x=>x.courseId).concat(results.map(x=>x.courseId)).filter(Boolean))];
const courseHtml=courseIds.map(id=>{const ts=tasks.filter(t=>t.courseId===id),ss=ts.flatMap(t=>t.submissions||[]);return '<article class="td-course"><b>'+E(courses[id]||id)+'</b><p>Заданий: '+ts.length+' · Ответов: '+ss.length+' · На проверке: '+ss.filter(s=>s.status!=="reviewed").length+'</p></article>';}).join("")||"Нет данных";
const groupHtml=Object.keys(groups).sort().map(g=>{const ss=subs.filter(s=>String(s.group||"Без группы")===g);return '<tr><td>'+E(g)+'</td><td>'+groups[g].length+'</td><td>'+ss.length+'</td><td>'+ss.filter(s=>s.status!=="reviewed").length+'</td><td>'+ss.filter(s=>s.status==="reviewed").length+'</td></tr>';}).join("");
const recent=wait.slice().sort((x,y)=>String(y.submittedAt||"").localeCompare(String(x.submittedAt||""))).slice(0,10).map(s=>'<tr><td>'+E(s.studentName)+'</td><td>'+E(s.group)+'</td><td>'+E(s.task)+'</td><td>'+E(courses[s.courseId]||s.courseId)+'</td><td><a href="#/teacher-tasks/'+encodeURIComponent(s.taskId)+'">Проверить</a></td></tr>').join("");
const studentHtml=students.map(s=>{const em=String(s.email||"").toLowerCase(),rs=results.filter(x=>String(x.email||"").toLowerCase()===em),gs=rs.filter(x=>x.grade!==""&&x.grade!==null&&x.grade!==undefined),mean=gs.length?(gs.reduce((n,x)=>n+Number(x.grade),0)/gs.length).toFixed(2):"—";return '<tr><td>'+E(s.name)+'</td><td>'+E(s.group)+'</td><td>'+rs.length+'</td><td>'+mean+'</td></tr>';}).join("");
document.getElementById("tdStatus").textContent="Обновлено: "+new Date().toLocaleString("ru-RU")+".";
document.getElementById("tdContent").innerHTML='<div class="td-stats">'+stat(students.length,"Студентов")+stat(tasks.length,"Заданий")+stat(subs.length,"Ответов")+stat(wait.length,"На проверке")+stat(done.length,"Проверено")+stat(avg,"Средняя оценка")+stat(overdue.length,"Просрочено")+'</div><section class="module"><h2>📚 По дисциплинам</h2><div class="td-course-grid">'+courseHtml+'</div></section><section class="module"><h2>👥 Группы</h2><div class="td-table-wrap"><table class="journal-table"><thead><tr><th>Группа</th><th>Студентов</th><th>Ответов</th><th>На проверке</th><th>Проверено</th></tr></thead><tbody>'+groupHtml+'</tbody></table></div></section><section class="module"><h2>⏳ На проверку</h2><div class="td-table-wrap"><table class="journal-table"><thead><tr><th>Студент</th><th>Группа</th><th>Задание</th><th>Дисциплина</th><th></th></tr></thead><tbody>'+recent+'</tbody></table></div><a class="btn" href="#/teacher-tasks">Конструктор заданий</a></section><section class="module"><h2>🎓 Результаты студентов</h2><div class="td-table-wrap"><table class="journal-table"><thead><tr><th>Студент</th><th>Группа</th><th>Работ</th><th>Средняя оценка</th></tr></thead><tbody>'+studentHtml+'</tbody></table></div><a class="btn ghost" href="#/journal">Журнал</a> <a class="btn ghost" href="#/reports">Отчёты</a></section>';
}).catch(e=>document.getElementById("tdStatus").textContent="Ошибка загрузки: "+e.message);
}
document.getElementById("tdRefresh").onclick=load;load();
};