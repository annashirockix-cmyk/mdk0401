"use strict";
(function(){
  var NAMES={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
  function esc(v){return window.escapeHtml(String(v==null?"":v));}
  function date(v){if(!v)return "—";var d=new Date(v);return isNaN(d.getTime())?esc(v):d.toLocaleString("ru-RU");}
  function avg(rows){var a=rows.filter(function(x){return x.grade!==""&&x.grade!=null&&Number.isFinite(Number(x.grade))&&Number(x.grade)>0;});return a.length?(a.reduce(function(s,x){return s+Number(x.grade);},0)/a.length).toFixed(2):"—";}
  function rowsFor(email,results,assignments){
    var rs=results.filter(function(x){return String(x.email||"").toLowerCase()===String(email).toLowerCase();});
    var subs=[];
    assignments.forEach(function(t){(t.submissions||[]).forEach(function(s){if(String(s.studentEmail||"").toLowerCase()===String(email).toLowerCase())subs.push(Object.assign({taskTitle:t.title,courseId:t.courseId,topic:t.topic},s));});});
    return {results:rs,submissions:subs};
  }
  function printButton(){return '<button type="button" class="btn no-print" onclick="window.print()">🖨 Печать / сохранить в PDF</button>';}
  function resultTable(rows){
    if(!rows.length)return '<p class="pf-muted">Сохранённых результатов пока нет.</p>';
    return '<div class="pf-scroll"><table class="pf-table"><thead><tr><th>Дисциплина</th><th>Работа</th><th>Оценка</th><th>Результат</th><th>Дата</th><th>Комментарий</th></tr></thead><tbody>'+rows.slice().sort(function(a,b){return String(b.finishedAt||"").localeCompare(String(a.finishedAt||""));}).map(function(x){return '<tr><td>'+esc(NAMES[x.courseId]||x.courseId||"—")+'</td><td>'+esc(x.testTitle||x.testId||"Работа")+'</td><td>'+esc(x.grade==null||x.grade===""?"—":x.grade)+'</td><td>'+esc(x.percent==null?"—":x.percent+"%")+'</td><td>'+date(x.finishedAt)+'</td><td>'+esc(x.feedback||"—")+'</td></tr>';}).join("")+'</tbody></table></div>';
  }
  function submissionTable(rows){
    if(!rows.length)return '<p class="pf-muted">Отправленных практических работ пока нет.</p>';
    return '<div class="pf-scroll"><table class="pf-table"><thead><tr><th>Дисциплина</th><th>Задание</th><th>Статус</th><th>Оценка</th><th>Отправлено</th><th>Комментарий</th></tr></thead><tbody>'+rows.map(function(x){return '<tr><td>'+esc(NAMES[x.courseId]||x.courseId||"—")+'</td><td>'+esc(x.taskTitle||"Задание")+'</td><td>'+esc(x.status==="reviewed"?"Проверено":"На проверке")+'</td><td>'+esc(x.grade==null||x.grade===""?"—":x.grade)+'</td><td>'+date(x.submittedAt)+'</td><td>'+esc(x.feedback||"—")+'</td></tr>';}).join("")+'</tbody></table></div>';
  }
  function renderStudent(app,student,results,assignments,teacherView){
    var data=rowsFor(student.email,results,assignments),graded=data.results.filter(function(x){return x.grade!==""&&x.grade!=null&&Number(x.grade)>0;});
    var reviewed=data.submissions.filter(function(x){return x.status==="reviewed"&&x.grade!==""&&x.grade!=null;});
    var achievements=teacherView?[]:(window.state.unlockedAchievements||[]).map(function(id){return (window.ACHIEVEMENTS||[]).find(function(a){return a.id===id;});}).filter(Boolean);
    var cert=teacherView?null:!!(window.state.results&&window.state.results.certificateApproved);
    app.innerHTML='<div class="pf-page"><div class="pf-head"><div><a class="backlink no-print" href="#/portfolio">← К списку портфолио</a><h1>📁 Электронное портфолио</h1><p class="pf-muted">'+(teacherView?'Просмотр преподавателя':'Личные учебные результаты')+'</p></div>'+printButton()+'</div><section class="module pf-profile"><h2>'+esc(student.name||"Обучающийся")+'</h2><p>Группа: '+esc(student.group||"—")+' · '+esc(student.email||"")+'</p></section><div class="pf-stats"><article><b>'+data.results.length+'</b><span>Результатов</span></article><article><b>'+graded.length+'</b><span>Оценённых работ</span></article><article><b>'+avg(data.results)+'</b><span>Средний балл</span></article><article><b>'+reviewed.length+'</b><span>Проверенных практических</span></article></div><section class="module"><h2>📚 Учебные результаты</h2>'+resultTable(data.results)+'</section><section class="module"><h2>🛠️ Практические задания и обратная связь</h2>'+submissionTable(data.submissions)+'</section>'+(teacherView?'':'<section class="module"><h2>🏆 Достижения</h2>'+(achievements.length?'<div class="pf-ach">'+achievements.map(function(a){return '<article><b>'+esc(a.icon||"🏅")+' '+esc(a.title)+'</b><p>'+esc(a.desc||"")+'</p></article>';}).join("")+'</div>':'<p class="pf-muted">Пока нет открытых достижений. Они появятся здесь после получения в портале.</p>')+'</section><section class="module"><h2>📜 Сертификат</h2><p>'+(cert?'<b class="pf-ok">Разрешение на сертификат отмечено в профиле.</b>':'Сертификат пока не подтверждён. Текущая страница сертификата может показывать образец.')+'</p><a class="btn ghost no-print" href="#/certificate">Открыть страницу сертификата</a></section>')+'<p class="pf-muted pf-foot">Сформировано '+date(new Date().toISOString())+'. В портфолио включены только данные, полученные из учебного портала.</p></div>';
  }
  window.renderPortfolioPage=function(){
    var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),student=window.state&&window.state.student,staff=window.state&&window.state.staff;
    if(!app)return;if(crumb)crumb.textContent="Электронное портфолио";
    if(!student&&!staff){app.innerHTML='<section class="module">Войдите в учебный аккаунт.</section>';return;}
    var target=location.hash.split("/")[2]||"";
    app.innerHTML='<section class="module"><p>Загружаем данные портфолио…</p></section>';
    if(staff){
      if(staff.role!=="teacher"&&staff.role!=="admin"){app.textContent="Недостаточно прав.";return;}
      Promise.all([API.getStudents(),API.getResults({}),API.getAssignments()]).then(function(v){
        if(!v[0]||!(v[0].success||v[0].ok)||!v[1]||!v[1].success||!v[2]||!v[2].success)throw Error("Не удалось загрузить данные преподавателя.");
        var allowed=(v[0].students||[]).filter(function(s){return String(s.role||"student").toLowerCase()==="student"&&(staff.role==="admin"||(s.courses||[]).some(function(c){return (staff.courses||[]).includes(c);}));});
        var results=(v[1].results||[]).filter(function(x){return staff.role==="admin"||!x.courseId||(staff.courses||[]).includes(x.courseId);});
        var tasks=(v[2].assignments||[]).filter(function(t){return staff.role==="admin"||(staff.courses||[]).includes(t.courseId);});
        if(target){
          var selected=allowed.find(function(s){return String(s.email||"").toLowerCase()===decodeURIComponent(target).toLowerCase();});
          if(!selected){app.innerHTML='<section class="module">Обучающийся не найден или нет доступа к его данным.</section>';return;}
          var courses=selected.courses||[];var rr=results.filter(function(x){return String(x.email||"").toLowerCase()===String(selected.email).toLowerCase()&&(!x.courseId||courses.includes(x.courseId));});
          var tt=tasks.map(function(t){return Object.assign({},t,{submissions:(t.submissions||[]).filter(function(s){return String(s.studentEmail||"").toLowerCase()===String(selected.email).toLowerCase();})});}).filter(function(t){return t.submissions.length;});
          renderStudent(app,selected,rr,tt,true);return;
        }
        app.innerHTML='<div class="pf-page"><div class="pf-head"><div><h1>📁 Портфолио группы</h1><p class="pf-muted">Доступ преподавателя · список ограничен назначенными дисциплинами</p></div></div><section class="module"><div class="pf-scroll"><table class="pf-table"><thead><tr><th>Обучающийся</th><th>Группа</th><th>Работ</th><th>Средний балл</th><th></th></tr></thead><tbody>'+allowed.map(function(s){var rr=results.filter(function(x){return String(x.email||"").toLowerCase()===String(s.email||"").toLowerCase()&&(!x.courseId||(s.courses||[]).includes(x.courseId));});return '<tr><td>'+esc(s.name||s.email)+'</td><td>'+esc(s.group||"—")+'</td><td>'+rr.length+'</td><td>'+avg(rr)+'</td><td><button class="btn ghost pf-open" type="button" data-email="'+esc(s.email)+'">Открыть</button></td></tr>';}).join("")+'</tbody></table></div></section></div>';
        app.querySelectorAll(".pf-open").forEach(function(b){b.onclick=function(){location.hash="#/portfolio/"+encodeURIComponent(b.dataset.email);};});
      }).catch(function(e){app.innerHTML='<section class="module"><h2>Не удалось загрузить портфолио</h2><p>'+esc(e.message)+'</p><button class="btn" onclick="window.renderPortfolioPage()">Повторить</button></section>';});
      return;
    }
    if(target){app.innerHTML='<section class="module">У вас нет доступа к чужому портфолио.</section>';return;}
    Promise.all([API.getMyCourseResults(""),API.getAssignments()]).then(function(v){
      if(!v[0]||!v[0].success||!v[1]||!v[1].success)throw Error("Не удалось получить личные результаты.");
      var r=(v[0].results||[]),a=(v[1].assignments||[]);
      renderStudent(app,student,r,a,false);
    }).catch(function(e){app.innerHTML='<section class="module"><h2>Не удалось загрузить портфолио</h2><p>'+esc(e.message)+'</p><button class="btn" onclick="window.renderPortfolioPage()">Повторить</button></section>';});
  };
  if(!document.getElementById("portfolioStyles")){var s=document.createElement("style");s.id="portfolioStyles";s.textContent='.pf-page{max-width:1150px;margin:0 auto}.pf-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.pf-head h1{margin:12px 0}.pf-muted{color:var(--muted);font-size:.9em}.pf-profile{margin:16px 0}.pf-profile h2{margin:0}.pf-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px;margin:14px 0}.pf-stats article,.pf-ach article{background:var(--card-soft);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:5px}.pf-stats b{font-size:1.6rem;color:var(--accent)}.pf-stats span{font-size:.85em;color:var(--muted)}.pf-scroll{overflow-x:auto}.pf-table{width:100%;border-collapse:collapse;font-size:13px}.pf-table th,.pf-table td{padding:9px;border-bottom:1px solid var(--border);text-align:left;vertical-align:top}.pf-ach{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.pf-ach p{margin:4px 0 0;color:var(--muted);font-size:.9em}.pf-ok{color:var(--ok)}.pf-foot{margin:14px 0}@media print{body{background:#fff!important;color:#111!important}.pf-page{max-width:none}.pf-page .module,.pf-stats article,.pf-ach article{background:#fff!important;color:#111!important;box-shadow:none!important;break-inside:avoid}.pf-muted{color:#444!important}.no-print,.backlink{display:none!important}.pf-table{font-size:10pt}.pf-table th,.pf-table td{border-bottom:1px solid #bbb!important}}';document.head.appendChild(s);}
})();