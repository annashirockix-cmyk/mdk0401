"use strict";
window.renderStudentProgressPage=function(encodedEmail){
var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),staff=window.state&&window.state.staff;
if(!app)return;
crumb.textContent="Карта успеваемости";
if(!staff||!["teacher","admin"].includes(String(staff.role||"").toLowerCase())){app.innerHTML='<section class="module">⛔ Карта успеваемости доступна только преподавателю.</section>';return;}
var email="";
try{email=decodeURIComponent(String(encodedEmail||""));}catch(e){email=String(encodedEmail||"");}
var E=function(v){return window.escapeHtml(String(v==null?"":v));};
var courseNames={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","MET":"Метрология","OT":"Охрана труда","PFI":"ПФИ"};
app.innerHTML='<div class="student-progress"><a href="#/teacher-dashboard">← К панели преподавателя</a><h1>Индивидуальная карта успеваемости</h1><p id="spStatus">Загрузка данных…</p><div id="spContent"></div></div>';
Promise.all([window.API.getStudents(),window.API.getResults({}),window.API.getAssignments()]).then(function(data){
var u=data[0],r=data[1],a=data[2];
if(!u||!(u.success||u.ok))throw Error(u&&u.error||"Не удалось получить список студентов");
if(!r||!r.success)throw Error(r&&r.error||"Не удалось получить оценки");
if(!a||!a.success)throw Error(a&&a.error||"Не удалось получить задания");
var student=(u.students||[]).find(function(s){return String(s.email||"").trim().toLowerCase()===email.trim().toLowerCase()&&String(s.role||"student").toLowerCase()==="student";});
if(!student){document.getElementById("spStatus").textContent="Студент не найден или у вас нет доступа к его данным.";return;}
var courseSet=new Set(student.courses||[]);
var assignableCourses=(String(staff.role||"").toLowerCase()==="admin"?(student.courses||[]):(student.courses||[]).filter(function(id){return (staff.courses||[]).includes(id);}));
var suggestedCourse=assignableCourses[0]||"";
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
var assignCourseOptions=assignableCourses.map(function(id){return '<option value="'+E(id)+'" '+(id===suggestedCourse?'selected':'')+'>'+E(courseNames[id]||id)+'</option>';}).join("");
var lowResultDrafts=low.filter(function(x){return assignableCourses.indexOf(x.courseId)>=0;});
var lowResultOptions=lowResultDrafts.map(function(x,i){return '<option value="'+i+'">'+E(courseNames[x.courseId]||x.courseId)+' — '+E(x.testTitle||x.testId||"Учебная работа")+' (оценка '+E(x.grade)+')</option>';}).join("");
var lowHtml=low.map(function(x){return '<li>'+E(x.testTitle||x.testId)+' — оценка '+E(x.grade)+'</li>';}).join("");
var chronological=graded.slice().filter(function(x){return x.finishedAt&&!isNaN(new Date(x.finishedAt).getTime());}).sort(function(x,y){return new Date(x.finishedAt)-new Date(y.finishedAt);});
var trendPoints=chronological.map(function(x){return {date:new Date(x.finishedAt),grade:Number(x.grade),title:x.testTitle||x.testId||"Работа"};});
var chartHtml="";
if(trendPoints.length>=2){
 var W=620,H=190,L=38,R=18,T=18,B=35,innerW=W-L-R,innerH=H-T-B;
 var coords=trendPoints.map(function(x,i){return {x:L+i*innerW/(trendPoints.length-1),y:T+(5-x.grade)/5*innerH};});
 var poly=coords.map(function(x){return x.x.toFixed(1)+","+x.y.toFixed(1);}).join(" ");
 var dots=coords.map(function(x,i){return '<circle cx="'+x.x.toFixed(1)+'" cy="'+x.y.toFixed(1)+'" r="4" fill="var(--accent)"><title>'+E(trendPoints[i].title)+': '+E(trendPoints[i].grade)+'</title></circle>';}).join("");
 var guides=[1,2,3,4,5].map(function(n){var y=T+(5-n)/5*innerH;return '<line x1="'+L+'" y1="'+y+'" x2="'+(W-R)+'" y2="'+y+'" stroke="var(--border)" stroke-dasharray="3 4"/><text x="'+(L-10)+'" y="'+(y+4)+'" text-anchor="end" fill="var(--muted)" font-size="11">'+n+'</text>';}).join("");
 chartHtml='<section class="module"><h2>📈 Динамика оценок</h2><p class="sp-muted">По результатам тестов и практических работ с указанной датой. Каждая точка — отдельный результат.</p><div class="sp-chart-wrap"><svg class="sp-chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="График оценок по времени">'+guides+'<polyline points="'+poly+'" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+dots+'<text x="'+L+'" y="'+(H-8)+'" fill="var(--muted)" font-size="10">'+E(trendPoints[0].date.toLocaleDateString("ru-RU"))+'</text><text x="'+(W-R)+'" y="'+(H-8)+'" text-anchor="end" fill="var(--muted)" font-size="10">'+E(trendPoints[trendPoints.length-1].date.toLocaleDateString("ru-RU"))+'</text></svg></div></section>';
}else{chartHtml='<section class="module"><h2>📈 Динамика оценок</h2><p>Для построения графика нужны минимум два оценённых результата с датами.</p></section>';}
var trendText="Пока недостаточно датированных оценок для сравнения периодов.";
if(trendPoints.length>=4){
 var cut=Math.floor(trendPoints.length/2),first=trendPoints.slice(0,cut),last=trendPoints.slice(cut);
 var meanFirst=first.reduce(function(n,x){return n+x.grade;},0)/first.length,meanLast=last.reduce(function(n,x){return n+x.grade;},0)/last.length,diff=meanLast-meanFirst;
 trendText="Средняя оценка в ранней половине истории: "+meanFirst.toFixed(2)+". В поздней половине: "+meanLast.toFixed(2)+". "+(diff>0.15?"Наблюдается рост на "+diff.toFixed(2)+".":diff< -0.15?"Наблюдается снижение на "+Math.abs(diff).toFixed(2)+".":"Средний результат примерно стабилен.")+" Сравнение описательное: число работ в периодах может различаться.";
}
var recommendations=[];
if(low.length)recommendations.push("Разобрать повторно "+low.length+" работу(ы) с оценкой ниже 3; начать с: "+low.slice(0,3).map(function(x){return x.testTitle||x.testId;}).join(", ")+".");
if(pending)recommendations.push("Проверить "+pending+" сданную(ые) работу(ы), ожидающую(ие) оценки: обратная связь поможет точнее определить пробелы.");
if(trendPoints.length>=4&&meanLast<meanFirst-0.15)recommendations.push("Проверить последние темы и условия выполнения работ: средняя оценка в поздней половине истории ниже ранней.");
else if(trendPoints.length>=4&&meanLast>meanFirst+0.15)recommendations.push("Закрепить положительную динамику: предложить задания повышенной сложности после проверки устойчивости результата.");
if(!recommendations.length)recommendations.push("Недостаточно признаков для адресных рекомендаций. Продолжать сбор оценённых результатов и фиксировать темы заданий.");
var recommendationHtml='<ul>'+recommendations.map(function(x){return '<li>'+E(x)+'</li>';}).join("")+'</ul>';
var individualTaskHtml=assignableCourses.length?'<section class="module sp-create-task"><details><summary><b>＋ Назначить индивидуальное задание</b></summary><p class="sp-muted">Задание будет адресовано только этому обучающемуся. Черновик можно подготовить по работе с низкой оценкой или заполнить вручную.</p><div class="sp-draft-tools">'+(lowResultDrafts.length?'<label>Основа для дополнительного задания<select id="spDraftSource" class="self-input" style="width:100%;margin:5px 0 8px">'+lowResultOptions+'</select></label><button class="btn ghost" type="button" id="spMakeDraft">Подготовить черновик по выбранной работе</button>':'<p class="sp-muted">Оценок ниже 3 с доступной дисциплиной пока нет. Можно создать задание вручную.</p>')+'</div><form id="spIndividualTaskForm"><label>Дисциплина<select name="courseId" class="self-input" required style="width:100%;margin:5px 0 10px">'+assignCourseOptions+'</select></label><label>Название задания<input name="title" class="self-input" maxlength="180" required placeholder="Например: Повторение координатного программирования" style="width:100%;margin:5px 0 10px"></label><label>Тема<input name="topic" class="self-input" maxlength="180" placeholder="Тема или конкретный учебный пробел" style="width:100%;margin:5px 0 10px"></label><div class="sp-form-grid"><label>Уровень<select name="level" class="self-input" style="width:100%"><option selected>Базовый</option><option>Средний</option><option>Повышенный</option></select></label><label>Срок выполнения<input name="dueAt" type="date" class="self-input" style="width:100%"></label></div><label>Условие задания<textarea name="instructions" class="self-input" maxlength="10000" required placeholder="Опишите, что нужно повторить и выполнить, в каком порядке и что представить на проверку." style="width:100%;min-height:120px;margin:5px 0 10px"></textarea></label><label>Критерии оценивания<textarea name="criteria" class="self-input" maxlength="4000" style="width:100%;min-height:75px;margin:5px 0 10px">Понимание темы — 2 балла\nПравильность выполнения — 2 балла\nОбоснование результата — 1 балл</textarea></label><button class="btn" type="submit">Опубликовать для этого студента</button> <span id="spTaskStatus" class="sp-muted" aria-live="polite"></span></form></details></section>':'<section class="module"><p>Нет общей дисциплины с доступом преподавателя для назначения задания.</p></section>';


var taskRows=submissions.map(function(x){var date=x.submittedAt?new Date(x.submittedAt).toLocaleString("ru-RU"):"—";return '<tr><td>'+E(x.taskTitle)+'</td><td>'+E(courseNames[x.courseId]||x.courseId)+'</td><td>'+E(date)+'</td><td>'+E(x.status==="reviewed"?"Проверено":"На проверке")+'</td><td>'+E(x.grade==null?"—":x.grade)+'</td><td>'+E(x.attempts||1)+'</td></tr>';}).join("");
document.getElementById("spStatus").textContent="Данные обновлены: "+new Date().toLocaleString("ru-RU")+". Показаны только дисциплины, доступные преподавателю.";
document.getElementById("spContent").innerHTML='<section class="module sp-person"><h2>'+E(student.name)+'</h2><p>Группа: <b>'+E(student.group||"не указана")+'</b> · '+E(student.email)+'</p></section><div class="sp-stats"><article><b>'+(avg===null?"—":avg.toFixed(2))+'</b><span>Средняя оценка по журналу</span></article><article><b>'+graded.length+'</b><span>Оценённых результатов</span></article><article><b>'+submissions.length+'</b><span>Сданных работ</span></article><article><b>'+pending+'</b><span>Ожидают проверки</span></article><article><b>'+overdue+'</b><span>Просроченных работ</span></article><article><b>'+(assignAvg===null?"—":assignAvg.toFixed(2))+'</b><span>Средняя оценка за задания</span></article></div><section class="module"><h2>📚 Результаты по дисциплинам</h2><div class="sp-courses">'+courseHtml+'</div></section>'+chartHtml+'<section class="module"><h2>📊 Сравнение периодов</h2><p>'+E(trendText)+'</p></section><section class="module"><h2>🧭 Рекомендации преподавателю</h2>'+recommendationHtml+'</section>'+individualTaskHtml+'<section class="module"><h2>🧭 Зоны внимания</h2>'+(low.length?'<p>Работы с оценкой ниже 3 — темы, к которым стоит вернуться:</p><ul>'+lowHtml+'</ul>':'<p>В доступных результатах нет оценок ниже 3. Это не заменяет оценку освоения отдельных тем.</p>')+'</section><section class="module"><h2>📝 Сданные задания и попытки</h2><div class="td-table-wrap"><table class="journal-table"><thead><tr><th>Задание</th><th>Дисциплина</th><th>Дата сдачи</th><th>Статус</th><th>Оценка</th><th>Попыток</th></tr></thead><tbody>'+(taskRows||'<tr><td colspan="6">Сданных заданий пока нет.</td></tr>')+'</tbody></table></div></section><section class="module"><h2>🕓 История учебной активности</h2><div class="sp-timeline">'+timelineHtml+'</div></section>';


var draftButton=document.getElementById("spMakeDraft");
if(draftButton)draftButton.addEventListener("click",function(){
 var sourceSelect=document.getElementById("spDraftSource"),index=sourceSelect?Number(sourceSelect.value):-1,source=lowResultDrafts[index];
 if(!source||!individualTaskForm)return;
 var fields=individualTaskForm.elements;
 fields.courseId.value=source.courseId;
 var sourceTitle=String(source.testTitle||source.testId||"учебной работы").trim();
 fields.title.value="Дополнительная работа: "+sourceTitle;
 fields.topic.value=sourceTitle;
 fields.instructions.value="Цель: повторить и закрепить материал, проверявшийся в работе «"+sourceTitle+"».\n\n1. Повторите соответствующий раздел учебных материалов и выпишите основные понятия, правила или последовательность действий.\n2. Выполните аналогичное учебное задание по этой теме, подробно показывая ход решения или выполнения.\n3. Проверьте результат и укажите, какие ошибки удалось исправить.\n4. Кратко объясните, почему выбранный способ решения или выполнения является правильным.\n\nПеред публикацией преподавателю следует уточнить конкретный вариант задания и исходные данные.";
 fields.criteria.value="Понимание основных положений темы — 2 балла\nПравильность выполнения и результата — 2 балла\nОбоснование и самопроверка — 1 балл";
 var status=document.getElementById("spTaskStatus");if(status)status.textContent="Черновик подготовлен. Проверьте и уточните условие перед публикацией.";
});
var individualTaskForm=document.getElementById("spIndividualTaskForm");
if(individualTaskForm)individualTaskForm.addEventListener("submit",function(ev){
 ev.preventDefault();
 var form=ev.currentTarget,button=form.querySelector('button[type="submit"]'),status=document.getElementById("spTaskStatus");
 var payload={courseId:form.elements.courseId.value,targetType:"individual",targetValue:email,title:form.elements.title.value.trim(),topic:form.elements.topic.value.trim(),level:form.elements.level.value,workType:"Разбор ошибок",dueAt:form.elements.dueAt.value,instructions:form.elements.instructions.value.trim(),criteria:form.elements.criteria.value.trim()};
 if(!payload.title||!payload.instructions){status.textContent="Заполните название и условие задания.";return;}
 button.disabled=true;status.textContent="Публикация…";
 window.API.createAssignment(payload).then(function(result){
  if(!result||!result.success)throw Error(result&&result.error||"Не удалось опубликовать задание.");
  status.textContent="Задание опубликовано и адресовано одному обучающемуся.";
  form.reset();
  setTimeout(function(){window.renderStudentProgressPage(encodeURIComponent(email));},900);
 }).catch(function(error){status.textContent=error.message;}).finally(function(){button.disabled=false;});
});
}).catch(function(e){document.getElementById("spStatus").textContent="Ошибка загрузки: "+e.message;});
};
