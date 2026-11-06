"use strict";
(function(){
  var COURSES={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
  function E(v){return window.escapeHtml?window.escapeHtml(String(v==null?"":v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function date(v){if(!v)return "Дата не указана";var d=new Date(v);return isNaN(d.getTime())?E(v):d.toLocaleDateString("ru-RU");}
  function getExhibits(assignments,student,staff){
    var out=[],isTeacher=!!staff;
    (assignments||[]).forEach(function(task){
      var course=String(task.courseId||""),submissions=[];
      if(isTeacher){
        (task.submissions||[]).forEach(function(s){submissions.push(s);});
      }else if(task.submission){submissions.push(Object.assign({studentName:student.name,studentEmail:student.email,group:student.group},task.submission));}
      submissions.forEach(function(s){
        if(String(s.status||"").toLowerCase()!=="reviewed"||!Number.isFinite(Number(s.grade))||Number(s.grade)<3)return;
        if(isTeacher&&staff.role!=="admin"&&staff.courses&&staff.courses.length&&!staff.courses.includes(course))return;
        var answer=String(s.answer||s.text||s.response||"").trim();
        out.push({title:String(task.title||"Практическая работа"),course:COURSES[course]||course||"Дисциплина не указана",courseId:course,topic:String(task.topic||""),student:String(s.studentName||s.name||""),group:String(s.group||""),grade:Number(s.grade),date:s.reviewedAt||s.submittedAt||s.updatedAt||"",feedback:String(s.feedback||""),answer:answer});
      });
    });
    return out.sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
  }
  window.renderLearningMuseumPage=function(){
    var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),state=window.state||{},student=state.student,staff=state.staff;
    if(!app)return;if(crumb)crumb.textContent="Музей учебных работ";
    if(!student&&!staff){app.innerHTML='<section class="module">Войдите в учебный аккаунт, чтобы открыть музей.</section>';return;}
    if(staff&&!["teacher","admin"].includes(String(staff.role||"").toLowerCase())){app.innerHTML='<section class="module">⛔ Доступ ограничен.</section>';return;}
    app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🏛️ Музей учебных работ</h1><p>Здесь остаются результаты, которые прошли проверку и получили положительную оценку.</p></section><section class="module" style="padding:15px"><b>Правило музея</b><p style="margin:6px 0 0;color:var(--muted)">В экспозицию попадают только проверенные преподавателем практические работы с оценкой не ниже 3. Черновики, непроверенные отправки и неудовлетворительные результаты не показываются. Музей не публикует работы других обучающихся в личном кабинете студента.</p></section><div id="museumStatus" class="module">Собираем экспозицию…</div><div id="museumContent"></div>';
    var status=document.getElementById("museumStatus"),content=document.getElementById("museumContent");
    window.API.getAssignments().then(function(res){
      if(!res||!res.success)throw Error(res&&res.error||"Не удалось получить практические работы");
      var exhibits=getExhibits(res.assignments||[],student,staff);
      status.textContent=staff?"Экспозиция преподавателя · подтверждённых работ: "+exhibits.length:"Ваша личная экспозиция · подтверждённых работ: "+exhibits.length;
      if(!exhibits.length){content.innerHTML='<section class="module" style="text-align:center;padding:30px"><div style="font-size:42px">🖼️</div><h2>Первая работа ещё впереди</h2><p style="color:var(--muted)">После проверки практической работы и получения оценки от 3 она появится здесь. Каждая настоящая работа — это вклад в вашу профессиональную историю.</p><a class="btn" href="#/learning-path">Открыть траекторию обучения</a></section>';return;}
      content.innerHTML='<div class="museum-grid">'+exhibits.map(function(x,i){
        var text=x.answer?'<details class="museum-answer"><summary>Посмотреть содержание работы</summary><div>'+E(x.answer)+'</div></details>':'<p class="museum-muted">Текст ответа не предоставлен в данных задания.</p>';
        return '<article class="module museum-card"><div class="museum-number">ЭКСПОНАТ №'+(i+1)+'</div><div class="museum-art">'+(["⚙️","📐","🔬","💻","🛠️"][i%5])+'</div><h2>'+E(x.title)+'</h2><div class="museum-course">'+E(x.course)+'</div><div class="museum-meta"><span>⭐ Оценка: <b>'+E(x.grade)+'</b></span><span>📅 '+date(x.date)+'</span></div>'+(staff?'<div class="museum-author">👤 '+E(x.student||"Обучающийся")+' · '+E(x.group||"Группа не указана")+'</div>':'')+(x.topic?'<p class="museum-muted">Тема: '+E(x.topic)+'</p>':'')+text+(x.feedback?'<blockquote class="museum-feedback">Комментарий преподавателя: '+E(x.feedback)+'</blockquote>':'')+'</article>';
      }).join("")+'</div><p class="museum-muted" style="margin-top:14px">Экспозиция формируется автоматически из проверенных заданий. Исходные учебные записи не изменяются.</p>';
    }).catch(function(err){console.error("Learning museum:",err);status.textContent="Не удалось загрузить музей. "+E(err.message);});
  };
  if(!document.getElementById("learningMuseumStyles")){var style=document.createElement("style");style.id="learningMuseumStyles";style.textContent='.museum-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px;margin-top:14px}.museum-card{padding:18px;min-width:0}.museum-number{font-size:10px;letter-spacing:1.4px;color:var(--muted);font-weight:700}.museum-art{height:92px;display:grid;place-items:center;font-size:48px;margin:10px 0;background:linear-gradient(135deg,var(--card-soft),var(--bg));border:1px dashed var(--border);border-radius:12px}.museum-card h2{font-size:18px;margin:8px 0}.museum-course{color:var(--accent);font-size:13px;font-weight:600}.museum-meta{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;margin-top:12px}.museum-author{font-size:12px;margin-top:9px}.museum-muted{font-size:12px;color:var(--muted)}.museum-answer{margin-top:12px;border:1px solid var(--border);border-radius:9px;padding:10px}.museum-answer summary{cursor:pointer;font-weight:600}.museum-answer div{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;margin-top:10px;max-height:300px;overflow:auto}.museum-feedback{font-size:13px;margin:12px 0 0;padding:10px;border-left:3px solid var(--accent);background:var(--card-soft)}@media print{.museum-grid{display:block}.museum-card{break-inside:avoid;margin:10px 0}}';document.head.appendChild(style);}
})();