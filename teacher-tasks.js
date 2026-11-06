"use strict";
(function(){
const C={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
const E=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const D=v=>v?new Date(v).toLocaleString("ru-RU"):"—";
const historyHtml=h=>{h=Array.isArray(h)?h:[];return h.length?'<details style="margin:8px 0"><summary>История отправок: '+h.length+'</summary>'+h.map(x=>'<article style="padding:8px;margin:6px 0;background:var(--bg);border-radius:7px"><b>Попытка №'+E(x.attempt)+'</b> · '+E(D(x.submittedAt))+'<p style="white-space:pre-wrap;margin:6px 0 0">'+E(x.answer)+'</p></article>').join("")+'</details>':"";};
const isStaff=()=>window.state&&window.state.staff&&["teacher","admin"].includes(String(window.state.staff.role||"").toLowerCase());
window.renderTeacherTasksPage=function(focusAssignmentId){
const app=document.getElementById("app");if(!app)return;
const staff=isStaff(),actor=staff?window.state.staff:window.state.student;
if(!actor){app.innerHTML='<section class="module">Войдите в портал, чтобы открыть задания.</section>';return;}
const allowed=staff?(actor.role==="admin"?Object.keys(C):(actor.courses||[]).filter(x=>C[x])):(actor.courses||[]).filter(x=>C[x]);
if(!allowed.length){app.innerHTML='<section class="module">Нет доступных дисциплин.</section>';return;}
app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🧩 '+(staff?'Задания и проверка работ':'Мои задания')+'</h1><p>'+(staff?'Назначайте работы, принимайте ответы и выставляйте оценки.':'Просматривайте задания, отправляйте ответы и получайте обратную связь.')+'</p></section><div id="taHost"><section class="module">Загрузка…</section></div>';
const host=document.getElementById("taHost");let assignments=[],students=[];

const options=()=>allowed.map(x=>'<option value="'+E(x)+'">'+E(C[x])+'</option>').join("");
function renderLegacy(){const host=document.getElementById("taLegacy");if(!host)return;let old=[];try{const raw=JSON.parse(localStorage.getItem("mdk.teacherTasks.v1")||"[]");if(Array.isArray(raw))old=raw;}catch(e){}host.innerHTML=old.length?old.map(x=>'<article style="padding:10px 0;border-bottom:1px solid var(--border)"><b>'+E(x.topic||x.title||"Черновик без названия")+'</b><div style="font-size:12px;color:var(--muted)">'+E(C[x.courseId]||x.courseId)+' · Адресат: '+E(x.target||"не указан")+' · '+E(x.level||"")+'</div><details><summary>Показать содержание</summary><p style="white-space:pre-wrap">'+E(x.body||"")+'</p><p style="white-space:pre-wrap"><b>Критерии:</b> '+E(x.criteria||"")+'</p></details></article>').join(""):'<p style="color:var(--muted)">Старых локальных черновиков не найдено.</p>';}
function teacherUI(){
host.innerHTML='<section class="module" style="padding:18px"><h2>Новое задание</h2><form id="taForm"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px"><label>Дисциплина<select id="taCourse" class="self-input" style="width:100%">'+options()+'</select></label><label>Тип адресата<select id="taKind" class="self-input" style="width:100%"><option value="group">Группа</option><option value="individual">Обучающийся</option></select></label><label id="taRecipientLabel">Группа<input id="taRecipient" class="self-input" maxlength="120" required placeholder="Например, ТО-21" style="width:100%"></label><label>Название<input id="taTitle" class="self-input" maxlength="180" required style="width:100%"></label><label>Тема<input id="taTopic" class="self-input" maxlength="180" style="width:100%"></label><label>Сложность<select id="taLevel" class="self-input" style="width:100%"><option>Базовый</option><option selected>Средний</option><option>Повышенный</option></select></label><label>Тип работы<select id="taType" class="self-input" style="width:100%"><option>Практическое задание</option><option>Закрепление теории</option><option>Разбор ошибок</option><option>Мини-проект</option><option>Контрольная работа</option></select></label><label>Срок<input id="taDue" type="date" class="self-input" style="width:100%"></label></div><label style="display:block;margin-top:12px">Условие<textarea id="taInstructions" class="self-input" required maxlength="10000" style="width:100%;min-height:120px"></textarea></label><label style="display:block;margin-top:12px">Критерии оценивания<textarea id="taCriteria" class="self-input" maxlength="4000" style="width:100%;min-height:80px">Понимание темы — 2 балла\nПравильность выполнения — 2 балла\nОбоснование результата — 1 балл</textarea></label><button class="btn" type="submit" style="margin-top:12px">Опубликовать задание</button> <span id="taStatus" aria-live="polite" style="font-size:12px;color:var(--muted)"></span></form></section><section class="module" style="padding:18px"><h2>Назначенные задания <button class="btn ghost" id="taRefresh">Обновить</button></h2><div id="taFilters" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:12px 0"><label>Дисциплина<select id="taFilterCourse" class="self-input" style="width:100%"><option value="">Все дисциплины</option></select></label><label>Группа<select id="taFilterGroup" class="self-input" style="width:100%"><option value="">Все группы</option></select></label><label>Состояние<select id="taFilterStatus" class="self-input" style="width:100%"><option value="all">Все задания</option><option value="pending">Есть ответы на проверку</option><option value="reviewed">Проверено</option><option value="empty">Нет ответов</option><option value="overdue">Просрочено</option></select></label><label>Поиск<input id="taFilterSearch" class="self-input" style="width:100%" placeholder="Название или тема"></label></div><div id="taFilterSummary" style="font-size:12px;color:var(--muted);margin-bottom:8px" aria-live="polite"></div><div id="taList"></div></section><section class="module" style="padding:14px"><details><summary>Архив локальных черновиков прежней версии</summary><div id="taLegacy" style="margin-top:10px"></div></details></section>';
const $=id=>document.getElementById(id),course=$("taCourse"),kind=$("taKind"),rec=$("taRecipient");
function fill(){const cid=course.value;if(kind.value==="group"){let a=[...new Set(students.filter(s=>(s.courses||[]).includes(cid)).map(s=>String(s.group||"").trim()).filter(Boolean))];$("taRecipientLabel").innerHTML='Группа<input id="taRecipient" class="self-input" maxlength="120" required list="taGroupList" placeholder="Например, ТО-21" style="width:100%"><datalist id="taGroupList">'+a.map(x=>'<option value="'+E(x)+'">').join("")+'</datalist>';}else{let a=students.filter(s=>(s.courses||[]).includes(cid));$("taRecipientLabel").innerHTML='Обучающийся<select id="taRecipient" class="self-input" required style="width:100%">'+a.map(s=>'<option value="'+E(s.email)+'">'+E(s.name)+' — '+E(s.group)+'</option>').join("")+'</select>';}}
course.onchange=fill;kind.onchange=fill;fill();
$("taForm").onsubmit=e=>{e.preventDefault();let btn=e.currentTarget.querySelector('button[type="submit"]'),st=$("taStatus");btn.disabled=true;st.textContent="Публикация…";window.API.createAssignment({courseId:course.value,targetType:kind.value,targetValue:document.getElementById("taRecipient").value.trim(),title:$("taTitle").value.trim(),topic:$("taTopic").value.trim(),level:$("taLevel").value,workType:$("taType").value,dueAt:$("taDue").value,instructions:$("taInstructions").value.trim(),criteria:$("taCriteria").value.trim()}).then(r=>{if(!r||!r.success)throw Error(r&&r.error||"Ошибка публикации");st.textContent="Опубликовано. Получателей: "+r.recipients;e.currentTarget.reset();fill();load();}).catch(x=>st.textContent=x.message).finally(()=>btn.disabled=false);};
$("taRefresh").onclick=load;["taFilterCourse","taFilterGroup","taFilterStatus","taFilterSearch"].forEach(id=>{const el=$(id);if(el){el.addEventListener("change",render);el.addEventListener("input",render);}});renderLegacy();
}
function studentUI(){host.innerHTML='<section class="module" style="padding:18px"><h2>Назначенные мне работы <button class="btn ghost" id="taRefresh">Обновить</button></h2><div id="taList"></div></section>';$("taRefresh").onclick=load;}
function filteredAssignments(){
if(!staff)return assignments;
const course=(document.getElementById("taFilterCourse")||{}).value||"";
const group=(document.getElementById("taFilterGroup")||{}).value||"";
const status=(document.getElementById("taFilterStatus")||{}).value||"all";
const search=String((document.getElementById("taFilterSearch")||{}).value||"").trim().toLocaleLowerCase("ru");
const today=new Date();today.setHours(0,0,0,0);
return assignments.filter(a=>{
const subs=a.submissions||[];
const groups=[String(a.targetType==="group"?a.targetValue:"")].concat(subs.map(x=>String(x.group||"")));
const pending=subs.some(x=>x.status!=="reviewed");
const reviewed=subs.length>0&&!pending;
const noAnswers=subs.length===0;
const due=String(a.dueAt||"").slice(0,10);
const overdue=!!due&&new Date(due+"T00:00:00").getTime()<today.getTime()&&(noAnswers||pending);
if(course&&a.courseId!==course)return false;
if(group&&!groups.some(x=>x.trim().toLocaleLowerCase("ru")===group.toLocaleLowerCase("ru")))return false;
if(status==="pending"&&!pending)return false;
if(status==="reviewed"&&!reviewed)return false;
if(status==="empty"&&!noAnswers)return false;
if(status==="overdue"&&!overdue)return false;
if(search&&!(String(a.title||"")+" "+String(a.topic||"")).toLocaleLowerCase("ru").includes(search))return false;
return true;
});
}
function renderFilterOptions(){
const course=document.getElementById("taFilterCourse"),group=document.getElementById("taFilterGroup");
if(!course||!group)return;
const cv=course.value,gv=group.value;
const courses=[...new Set(assignments.map(a=>a.courseId).filter(Boolean))];
course.innerHTML='<option value="">Все дисциплины</option>'+courses.map(x=>'<option value="'+E(x)+'">'+E(C[x]||x)+'</option>').join("");
course.value=courses.includes(cv)?cv:"";
const groups=[...new Set(assignments.flatMap(a=>[a.targetType==="group"?String(a.targetValue||""):""].concat((a.submissions||[]).map(x=>String(x.group||"")))).map(x=>x.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru"));
group.innerHTML='<option value="">Все группы</option>'+groups.map(x=>'<option value="'+E(x)+'">'+E(x)+'</option>').join("");
group.value=groups.includes(gv)?gv:"";
}
function render(){
const list=document.getElementById("taList");if(!list)return;
if(staff)renderFilterOptions();
const visible=filteredAssignments();
const summary=document.getElementById("taFilterSummary");
if(summary)summary.textContent=staff?"Показано: "+visible.length+" из "+assignments.length+" · На проверке: "+assignments.reduce((n,a)=>n+(a.submissions||[]).filter(x=>x.status!=="reviewed").length,0)+" · Без ответов: "+assignments.filter(a=>!(a.submissions||[]).length).length:"";
if(!visible.length){list.innerHTML='<p style="color:var(--muted)">'+(assignments.length?'По выбранным фильтрам ничего не найдено.':'Назначенных заданий пока нет.')+'</p>';return;}
list.innerHTML=visible.map(a=>{
const meta='<div style="font-size:12px;color:var(--muted);margin:6px 0 12px">'+E(C[a.courseId]||a.courseId)+' · '+E(a.workType)+' · '+E(a.level)+' · Срок: '+E(a.dueAt||"не указан")+' · '+E(D(a.createdAt))+'</div>';
if(!staff){let s=a.submission,reviewed=s&&s.status==="reviewed";return '<article id="assignment-'+E(a.id)+'" style="padding:14px 0;border-bottom:1px solid var(--border)"><h3>'+E(a.title)+'</h3>'+meta+(a.topic?'<b>Тема:</b> '+E(a.topic):'')+'<p style="white-space:pre-wrap">'+E(a.instructions)+'</p>'+(a.criteria?'<details><summary>Критерии</summary><p style="white-space:pre-wrap">'+E(a.criteria)+'</p></details>':'')+'<form class="taSubmit" data-id="'+E(a.id)+'"><label>Ваш ответ<textarea class="self-input" name="answer" required maxlength="12000" style="width:100%;min-height:110px">'+E(s?s.answer:"")+'</textarea></label><button class="btn" type="submit">'+(s?'Отправить повторно':'Отправить ответ')+'</button> <span class="taMsg" aria-live="polite"></span></form>'+(s?'<div class="module" style="padding:10px"><b>'+ (reviewed?'Проверено':'Ожидает проверки')+'</b> · Отправлено: '+E(D(s.submittedAt))+' · Попыток: '+E(s.attempts||1)+historyHtml(s.history)+(reviewed?'<p><b>Оценка: '+E(s.grade)+'</b></p><p style="white-space:pre-wrap">'+E(s.feedback||"Комментарий не добавлен")+'</p>':'')+'</div>':'')+'</article>';}
const subs=a.submissions||[],rows=subs.length?subs.map(s=>'<article style="border:1px solid var(--border);border-radius:9px;padding:10px;margin:8px 0"><b>'+E(s.studentName)+'</b> <small>'+E(s.group)+' · '+E(D(s.submittedAt))+'</small><p style="white-space:pre-wrap">'+E(s.answer)+'</p><small>Попыток: '+E(s.attempts||1)+'</small>'+historyHtml(s.history)+'<form class="taGrade" data-id="'+E(s.id)+'" style="display:grid;grid-template-columns:90px minmax(150px,1fr) auto;gap:8px;align-items:end"><label>Оценка<select name="grade" class="self-input" required style="width:100%">'+'<option value="" disabled selected>—</option>'+[0,1,2,3,4,5].map(n=>'<option value="'+n+'" '+(String(s.grade)===String(n)?'selected':'')+'>'+n+'</option>').join("")+'</select></label><label>Комментарий<input name="feedback" class="self-input" maxlength="4000" style="width:100%" value="'+E(s.feedback||"")+'"></label><button class="btn" type="submit">Сохранить</button></form></article>').join(""):'<p style="color:var(--muted)">Ответов пока нет.</p>';
return '<article id="assignment-'+E(a.id)+'" style="padding:14px 0;border-bottom:1px solid var(--border)"><h3>'+E(a.title)+'</h3>'+meta+'<p style="white-space:pre-wrap">'+E(a.instructions)+'</p><small>Адресат: '+E(a.targetType==="group"?"группа ":"обучающийся ")+E(a.targetValue)+'</small><h4>Ответы: '+subs.length+'</h4>'+rows+'</article>';
}).join("");
if(!staff)list.querySelectorAll(".taSubmit").forEach(form=>form.onsubmit=e=>{e.preventDefault();let b=form.querySelector("button"),m=form.querySelector(".taMsg");b.disabled=true;m.textContent="Отправка…";window.API.submitAssignment(form.dataset.id,form.elements.answer.value).then(r=>{if(!r||!r.success)throw Error(r&&r.error||"Ошибка отправки");m.textContent="Ответ отправлен.";load();}).catch(x=>m.textContent=x.message).finally(()=>b.disabled=false);});
else list.querySelectorAll(".taGrade").forEach(form=>form.onsubmit=e=>{e.preventDefault();let b=form.querySelector("button");b.disabled=true;window.API.gradeAssignment(form.dataset.id,form.elements.grade.value,form.elements.feedback.value).then(r=>{if(!r||!r.success)throw Error(r&&r.error||"Ошибка сохранения");load();}).catch(x=>{b.disabled=false;b.textContent=x.message;});});
}
function load(){let el=document.getElementById("taList");if(el)el.textContent="Загрузка…";window.API.getAssignments().then(r=>{if(!r||!r.success)throw Error(r&&r.error||"Не удалось загрузить задания");assignments=r.assignments||[];render();if(focusAssignmentId){setTimeout(function(){var target=document.getElementById("assignment-"+focusAssignmentId);if(target){target.scrollIntoView({behavior:"smooth",block:"start"});target.style.outline="2px solid var(--accent)";target.style.borderRadius="10px";}},80);}}).catch(x=>{if(el)el.textContent="Ошибка: "+x.message;});}
if(staff){teacherUI();window.API.getStudents().then(r=>{if(!r||!r.success)throw Error(r&&r.error||"Не удалось загрузить список");students=(r.students||[]).filter(s=>String(s.role||"").toLowerCase()==="student");let c=document.getElementById("taCourse");if(c)c.dispatchEvent(new Event("change"));}).catch(x=>{let s=document.getElementById("taStatus");if(s)s.textContent="Список получателей не загружен: "+x.message;});}else studentUI();
load();
};
})();