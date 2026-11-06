"use strict";
window.renderStudentProgressPage=function(encodedEmail){
var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),staff=window.state&&window.state.staff;
if(!app)return;
crumb.textContent="Карта успеваемости";
if(!staff||!["teacher","admin"].includes(String(staff.role||"").toLowerCase())){app.innerHTML='<section class="module">⛔ Карта успеваемости доступна только преподавателю.</section>';return;}
var email="";
try{email=decodeURIComponent(String(encodedEmail||""));}catch(e){email=String(encodedEmail||"");}
var E=function(v){return window.escapeHtml(String(v==null?"":v));};
var courseNames={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
app.innerHTML='<div class="student-progress"><a href="#/teacher-dashboard">← К панели преподавателя</a><h1>Индивидуальная карта успеваемости</h1><p id="spStatus">Загрузка данных…</p><div id="spContent"></div></div>';
Promise.all([window.API.getStudents(),window.API.getResults({}),window.API.getAssignments()]).then(function(data){
var u=data[0],r=data[1],a=data[2];
if(!u||!(u.success||u.ok))throw Error(u&&u.error||"Не удалось получить список студентов");
if(!r||!r.success)throw Error(r&&r.error||"Не удалось получить оценки");
if(!a||!a.success)throw Error(a&&a.error||"Не удалось получить задания");
var student=(u.students||[]).find(function(s){return String(s.email||"").trim().toLowerCase()===email.trim().toLowerCase()&&String(s.role||"student").toLowerCase()==="student";});
if(!student){document.getElementById("spStatus").textContent="Студент не найден или у вас нет доступа к его данным.";return;}
var courseSet=new Set(student.courses||[]);
var results=(r.results||[]).filter(function(x){return String(x.email||"").toLowerCase()===email.toLowerCase()&&(!x.courseId||courseSet.has(x.courseId));});
var tasks=(a.assignments||[]).filter(function(t){return courseSet.has(t.courseId)&&((t.targetType==="individual"&&String(t.targetValue||"").toLowerCase()===email.toLowerCase())||(t.targetType==="group"&&String(t.targetValue||"").trim().toLowerCase()===String(student.group||"").trim().toLowerCase()));});
var submissions=tasks.flatMap(function(t){return (t.submissions||[]).filter(function(s){return String(s.studentEmail||"").toLowerCase()===email.toLowerCase();}).map(function(s){return Object.assign({taskTitle:t.title,topic:t.topic,courseId:t.courseId,dueAt:t.dueAt,taskId:t.id},s);});});
var graded=results.filter(function(x){return x.grade!==""&&x.grade!==null&&x.grade!==undefined&&Number.isFinite(Number(x.grade));});
var avg=graded.length?(graded.reduce(function(n,x){return n+Number(x.grade);},0)/graded.length):null;
var reviewed=submissions.filter(function(x){return x.status==="reviewed"&&x.grade!==null&&x.grade!=="";});
var assignAvg=reviewed.length?(reviewed.reduce(function(n,x){return n+Number(x.grade);},0)/reviewed.length):null;
var byCourse={};
results.forEach(function(x){var id=x.courseId||"Без дисциплины";(byCourse[id]||(byCourse[id]=[])).push(x);});
submissions.forEach(function(x){var id=x.courseId||"Без дисциплины";(byCourse[id]||(byCourse[id]=[])).push({grade:x.grade,finishedAt:x.submittedAt,testTitle:x.taskTitle,assignment:true,status:x.status});});
var courseHtml=Object.keys(byCourse).sort().map(function(id){var list=byCourse[id],marks=list.filter(function(x){return x.grade!==""&&x.grade!==null&&x.grade!==undefined&&Number.isFinite(Number(x.grade));}),mean=marks.length?(marks.reduce(function(n,x){return n+Number(x.grade);},0)/marks.length).toFixed(2):"—";return '<article class="sp-course"><b>'+E(courseNames[id]||id)+'</b><span>'+marks.length+' оценок</span><strong>'+E(mean)+'</strong></article>';}).join("")||'<p>Пока нет результатов по дисциплинам.</p>';
var timeline=[];
results.forEach(function(x){timeline.push({date:x.finishedAt,title:x.testTitle||x.testId||"Учебная работа",course:x.courseId,grade:x.grade,detail:"Результат теста или практической работы",kind:"result"});});
submissions.forEach(function(x){var history=Array.isArray(x.history)&&x.history.length?x.history:[{attempt:1,answer:x.answer,submittedAt:x.submittedAt}];history.forEach(function(h){timeline.push({date:h.submittedAt,title:x.taskTitle,course:x.courseId,grade:h.attempt===history.length?x.grade:null,detail:"Попытка №"+(h.attempt||1)+(x.status==="reviewed"&&h.attempt===history.length?" · проверено":""),kind:"assignment",feedback:h.attempt===history.length?x.feedback:""});});});
timeline.sort(function(x,y){return String(y.date||"").localeCompare(String(x.date||""));});
var timelineHtml=timeline.map(function(x){var d=x.date?new Date(x.date):null,date=d&&!isNaN(d.getTime())?d.toLocaleString("ru-RU"):"Дата не указана",grade=x.grade!==null&&x.grade!==undefined&&x.grade!==""?'<b class="sp-grade">'+E(x.grade)+'</b>':'<span class="sp-muted">Оценка не выставлена</span>';return '<article class="sp-event"><div><b>'+E(x.title)+'</b><small>'+E(courseNames[x.course]||x.course||"")+' · '+E(date)+'</small><p>'+E(x.detail)+'</p>'+(x.feedback?'<p class="sp-feedback">Комментарий: '+E(x.feedback)+'</p>':'')+'</div>'+grade+'</article>';}).join("")||'<p>История пока пуста.</p>';
var pending=submissions.filter(function(x){return x.status!=="reviewed";}).length;
var overdue=submissions.filter(function(x){return x.dueAt&&new Date(String(x.dueAt).slice(0,10)+"T23:59:59")<new Date()&&x.status!=="reviewed";}).length;
var low=graded.filter(function(x){return Number(x.grade)<3;});
var lowHtml=low.map(function(x){return '<li>'+E(x.testTitle||x.testId)+' — оценка '+E(x.grade)+'</li>';}).join("");
var taskRows=submissions.map(function(x){var date=x.submittedAt?new Date(x.submittedAt).toLocaleString("ru-RU"):"—";return '<tr><td>'+E(x.taskTitle)+'</td><td>'+E(courseNames[x.courseId]||x.courseId)+'</td><td>'+E(date)+'</td><td>'+E(x.status==="reviewed"?"Проверено":"На проверке")+'</td><td>'+E(x.grade==null?"—":x.grade)+'</td><td>'+E(x.attempts||1)+'</td></tr>';}).join("");
document.getElementById("spStatus").textContent="Данные обновлены: "+new Date().toLocaleString("ru-RU")+". Показаны только дисциплины, доступные преподавателю.";
document.getElementById("spContent").innerHTML='<section class="module sp-person"><h2>'+E(student.name)+'</h2><p>Группа: <b>'+E(student.group||"не указана")+'</b> · '+E(student.email)+'</p></section><div class="sp-stats"><article><b>'+(avg===null?"—":avg.toFixed(2))+'</b><span>Средняя оценка по журналу</span></article><article><b>'+graded.length+'</b><span>Оценённых результатов</span></article><article><b>'+submissions.length+'</b><span>Сданных работ</span></article><article><b>'+pending+'</b><span>Ожидают проверки</span></article><article><b>'+overdue+'</b><span>Просроченных работ</span></article><article><b>'+(assignAvg===null?"—":assignAvg.toFixed(2))+'</b><span>Средняя оценка за задания</span></article></div><section class="module"><h2>📚 Результаты по дисциплинам</h2><div class="sp-courses">'+courseHtml+'</div></section><section class="module"><h2>🧭 Зоны внимания</h2>'+(low.length?'<p>Работы с оценкой ниже 3 — темы, к которым стоит вернуться:</p><ul>'+lowHtml+'</ul>':'<p>В доступных результатах нет оценок ниже 3. Это не заменяет оценку освоения отдельных тем.</p>')+'</section><section class="module"><h2>📝 Сданные задания и попытки</h2><div class="td-table-wrap"><table class="journal-table"><thead><tr><th>Задание</th><th>Дисциплина</th><th>Дата сдачи</th><th>Статус</th><th>Оценка</th><th>Попыток</th></tr></thead><tbody>'+(taskRows||'<tr><td colspan="6">Сданных заданий пока нет.</td></tr>')+'</tbody></table></div></section><section class="module"><h2>🕓 История учебной активности</h2><div class="sp-timeline">'+timelineHtml+'</div></section>';
}).catch(function(e){document.getElementById("spStatus").textContent="Ошибка загрузки: "+e.message;});
};
