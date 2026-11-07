"use strict";
(function(){
  var EXTRA_ACHIEVEMENTS=[
    {id:"first_test",title:"Первый зачёт",desc:"Завершить первый тест с автоматической проверкой.",icon:"🧪"},
    {id:"five_tests",title:"Пять проверок",desc:"Завершить пять тестов и контрольных работ.",icon:"📚"},
    {id:"ten_tests",title:"На пути к мастерству",desc:"Завершить десять тестов и контрольных работ.",icon:"🎯"},
    {id:"perfect_test",title:"Без ошибок",desc:"Получить оценку 5 за тест или зачёт.",icon:"💎"},
    {id:"first_written",title:"Автор решения",desc:"Отправить первую письменную работу преподавателю.",icon:"✍️"},
    {id:"five_written",title:"Портфолио растёт",desc:"Отправить пять письменных работ.",icon:"📂"},
    {id:"xp_500",title:"Опытный пользователь",desc:"Набрать 500 XP.",icon:"⭐"},
    {id:"xp_1000",title:"Тысяча опыта",desc:"Набрать 1000 XP.",icon:"🏅"},
    {id:"xp_2000",title:"Легенда портала",desc:"Набрать 2000 XP.",icon:"👑"},
    {id:"reviewed_work",title:"Обратная связь",desc:"Получить первую оценку за письменную работу.",icon:"📬"}
  ];
  var BASE_ACHIEVEMENTS=[
    {id:"first_practical",title:"Первая практика",desc:"Сохранить первую практическую работу.",icon:"🛠️"},
    {id:"hacker",title:"Первый тест пройден",desc:"Успешно завершить первый тест.",icon:"💻"},
    {id:"mastercam_5",title:"Пять этапов Mastercam",desc:"Завершить пять практических этапов Mastercam.",icon:"📐"},
    {id:"xp_2500",title:"Большой запас опыта",desc:"Набрать 2500 XP.",icon:"👑"},
    {id:"reader",title:"Хранитель знаний",desc:"Изучить учебную лекцию.",icon:"📖"},
    {id:"gcode_pro",title:"Оператор ЧПУ",desc:"Освоить тренажёр G-кода.",icon:"⚙️"},
    {id:"season_gold",title:"Золотой сезон",desc:"Получить золотую сезонную медаль.",icon:"🥇"}
  ];
  if(!Array.isArray(window.ACHIEVEMENTS))window.ACHIEVEMENTS=[];
  BASE_ACHIEVEMENTS.concat(EXTRA_ACHIEVEMENTS).forEach(function(a){
    if(!window.ACHIEVEMENTS.some(function(x){return x.id===a.id;}))window.ACHIEVEMENTS.push(a);
  });
  function student(){return !!(window.state&&window.state.student);}
  function save(){if(window.saveStudentData&&student())window.saveStudentData();}
  function award(id){if(student()&&window.unlockAchievement&&(!Array.isArray(window.state.unlockedAchievements)||window.state.unlockedAchievements.indexOf(id)<0))window.unlockAchievement(id);}
  function stats(){var s=window.state||(window.state={});s.achievementStats=s.achievementStats||{tests:0,written:0};return s.achievementStats;}
  function recordTest(result){
    if(!student()||!result||!result.success)return;
    var st=stats();st.tests=Math.max(0,Number(st.tests)||0)+1;
    if(st.tests>=1){award("first_test");award("hacker");}
    if(st.tests>=5)award("five_tests");
    if(st.tests>=10)award("ten_tests");
    if(Number(result.grade)===5)award("perfect_test");
    save();
  }
  function recordWritten(result,key){
    if(!student()||!result||!result.success)return;
    var st=stats();st.writtenKeys=Array.isArray(st.writtenKeys)?st.writtenKeys:[];key=String(key||("written_"+Date.now()));if(st.writtenKeys.indexOf(key)>=0)return;st.writtenKeys.push(key);st.written=st.writtenKeys.length;
    if(st.written>=1)award("first_written");
    if(st.written>=5)award("five_written");
    save();
  }
  function wrapApi(name,handler){
    if(!window.API||typeof window.API[name]!=="function"||window.API[name]._portalUxWrapped)return;
    var original=window.API[name];
    var wrapped=function(){var args=Array.prototype.slice.call(arguments),out=original.apply(this,args);return out&&typeof out.then==="function"?out.then(function(r){try{handler(r,args);}catch(e){console.warn("[portal-ux achievements]",e);}return r;}):out;};
    wrapped._portalUxWrapped=true;window.API[name]=wrapped;
  }
  ["submitBuiltInTest","submitCustomTest","submitFinalExam"].forEach(function(name){wrapApi(name,function(r){recordTest(r);});});
  wrapApi("saveResult",function(r,args){
    var data=args&&args[0]||{};
    if(r&&r.success&&/^test_|^english_|^__final__/.test(String(data.testId||"")))recordTest({success:true,grade:r.grade});
    if(r&&r.success&&/^(prac_|self_)/.test(String(data.testId||""))&&String(data.payload||"").trim())recordWritten(r,String(data.courseId||"")+":"+String(data.testId||""));
  });
  wrapApi("submitAssignment",function(r,args){recordWritten(r,"assignment:"+String(args&&args[0]||""));});
  wrapApi("gradeWrittenResult",function(r){if(r&&r.success)award("reviewed_work");});
  function checkXp(){
    if(!student())return;
    var xp=Number(window.state.xp)||0;
    if(xp>=500)award("xp_500");
    if(xp>=1000)award("xp_1000");
    if(xp>=2000)award("xp_2000");
    if(xp>=2500)award("xp_2500");
  }
  var oldUnlock=window.unlockAchievement;
  if(oldUnlock&&!oldUnlock._portalUxWrapped){
    var wrappedUnlock=function(id){oldUnlock.apply(this,arguments);checkXp();};
    wrappedUnlock._portalUxWrapped=true;window.unlockAchievement=wrappedUnlock;
  }

  // Server-backed grades: the original page showed only local state.results.
  var oldGrades=window.renderStudentGradesPage;
  if(oldGrades&&!oldGrades._portalUxWrapped){
    var gradesPage=function(){
      oldGrades.apply(this,arguments);
      var app=document.getElementById("app");if(!app||!student())return;
      var card=document.createElement("section");card.className="module portal-server-grades";card.innerHTML='<div class="portal-ux-section-head"><div><h2>☁️ Оценки из журнала</h2><p>Результаты, сохранённые на сервере и доступные после входа с любого устройства.</p></div><span class="portal-ux-live">Синхронизация</span></div><div class="portal-ux-loading">Загружаем оценки…</div>';
      var hero=app.querySelector(".hero");if(hero)hero.insertAdjacentElement("afterend",card);else app.prepend(card);
      var host=card.querySelector(".portal-ux-loading");
      if(!window.API||!window.API.getMyCourseResults){host.textContent="Серверное хранилище оценок пока недоступно.";return;}
      window.API.getMyCourseResults("").then(function(r){
        if(!r||!r.success)throw Error(r&&r.error||"Сервер не вернул оценки");
        var rows=Array.isArray(r.results)?r.results:[];
        rows.sort(function(a,b){return String(b.finishedAt||"").localeCompare(String(a.finishedAt||""));});
        if(!rows.length){host.innerHTML='<div class="portal-ux-empty">Серверных результатов пока нет. После завершения теста или проверки письменной работы они появятся здесь.</div>';return;}
        var graded=rows.filter(function(x){return x.grade!==""&&x.grade!==null&&Number(x.grade)>0;});
        var avg=graded.length?(graded.reduce(function(n,x){return n+Number(x.grade);},0)/graded.length).toFixed(2):"—";
        var html='<div class="portal-ux-grade-summary"><div><b>'+rows.length+'</b><span>работ в журнале</span></div><div><b>'+graded.length+'</b><span>оценено</span></div><div><b>'+avg+'</b><span>средний балл</span></div></div><div class="portal-ux-table-wrap"><table class="journal-table"><thead><tr><th>Работа</th><th>Дисциплина</th><th>Дата</th><th>Результат</th></tr></thead><tbody>';
        rows.forEach(function(x){
          var id=String(x.testId||""),grade=x.grade,date=x.finishedAt?new Date(x.finishedAt):null,dateText=date&&!isNaN(date.getTime())?date.toLocaleString("ru-RU"):(x.finishedAt?String(x.finishedAt):"—");
          var pending=(grade===""||grade===null||(Number(grade)===0&&/^(prac_|self_)/.test(id)));
          var value=pending?'<span class="portal-ux-status pending">Ожидает проверки</span>':(x.manual?'<b class="portal-ux-grade">'+window.escapeHtml(String(grade))+'</b>':'<b class="portal-ux-grade">'+window.escapeHtml(String(grade))+'/5</b>');
          var title=window.escapeHtml(x.testTitle||id),course=window.escapeHtml((window.COURSE_LABELS&&window.COURSE_LABELS[x.courseId])||x.courseId||"—");
          html+='<tr><td>'+title+'</td><td>'+course+'</td><td>'+window.escapeHtml(dateText)+'</td><td>'+value+'</td></tr>';
        });
        html+='</tbody></table></div>';
        host.outerHTML=html;
      }).catch(function(e){host.innerHTML='<div class="portal-ux-error">Не удалось загрузить оценки: '+window.escapeHtml(e.message||String(e))+'</div>';});
    };
    gradesPage._portalUxWrapped=true;window.renderStudentGradesPage=gradesPage;
  }

  // Dedicated review inbox for written answers submitted from practical/self-study cards.
  window.renderWrittenReviewPage=function(){
    var app=document.getElementById("app");if(!app)return;
    var actor=window.state&&(window.state.staff||window.state.student);
    if(!actor||!["teacher","admin"].includes(String(actor.role||"").toLowerCase())){app.innerHTML='<section class="module">Раздел доступен только преподавателю.</section>';return;}
    app.innerHTML='<a class="backlink" href="#/teacher-tasks">← К заданиям и проверке</a><section class="hero"><h1>✍️ Письменные работы на проверку</h1><p>Ответы из практических и самостоятельных работ, отправленные из учебных тем.</p></section><section class="module" id="writtenReviewList"><div class="portal-ux-loading">Загружаем письменные работы…</div></section>';
    var box=document.getElementById("writtenReviewList");
    window.API.getResults({}).then(function(r){
      if(!r||!r.success)throw Error(r&&r.error||"Не удалось загрузить журнал");
      var rawRows=(r.results||[]).filter(function(x){return /^(prac_|self_)/.test(String(x.testId||""));}),latest={};
      rawRows.forEach(function(x){var key=String(x.email||"")+"|"+String(x.courseId||"")+"|"+String(x.testId||"");if(!latest[key]||String(x.finishedAt||"")>=String(latest[key].finishedAt||""))latest[key]=x;});
      var rows=Object.keys(latest).map(function(k){return latest[k];});
      rows.sort(function(a,b){return String(b.finishedAt||"").localeCompare(String(a.finishedAt||""));});
      if(!rows.length){box.innerHTML='<div class="portal-ux-empty">Письменных работ пока нет.</div>';return;}
      var pending=rows.filter(function(x){return x.grade===""||x.grade===null||Number(x.grade)===0;});
      var reviewed=rows.filter(function(x){return x.grade!==""&&x.grade!==null&&Number(x.grade)>0;});
      function renderRow(x,done){
        var date=x.finishedAt?new Date(x.finishedAt):null,dateText=date&&!isNaN(date.getTime())?date.toLocaleString("ru-RU"):"—";
        var submission=String(x.payload||"");
        return '<article class="portal-ux-review-card"><div class="portal-ux-review-meta"><div><b>'+window.escapeHtml(x.name||x.email)+'</b><small>'+window.escapeHtml(x.group||"Без группы")+' · '+window.escapeHtml(x.email||"")+'</small></div><span>'+window.escapeHtml((window.COURSE_LABELS&&window.COURSE_LABELS[x.courseId])||x.courseId||"")+'</span></div><h3>'+window.escapeHtml(x.testTitle||x.testId)+'</h3><time>'+window.escapeHtml(dateText)+'</time><details><summary>Открыть ответ студента</summary><pre>'+window.escapeHtml(submission||"Ответ не сохранён в поле Submission")+'</pre></details>'+(done?'<div class="portal-ux-reviewed">Оценка: <b>'+window.escapeHtml(x.grade)+'/5</b></div>':'<form class="portal-ux-grade-form" data-email="'+window.escapeHtml(x.email)+'" data-course="'+window.escapeHtml(x.courseId)+'" data-test="'+window.escapeHtml(x.testId)+'"><label>Оценка<select name="grade" required><option value="">Выберите</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label><label>Комментарий<textarea name="feedback" maxlength="4000" rows="2" placeholder="Комментарий студенту (необязательно)"></textarea></label><button class="btn" type="submit">Сохранить оценку</button><span aria-live="polite"></span></form>')+'</article>';
      }
      box.innerHTML='<div class="portal-ux-grade-summary"><div><b>'+pending.length+'</b><span>ожидают проверки</span></div><div><b>'+reviewed.length+'</b><span>проверено</span></div><div><b>'+rows.length+'</b><span>всего работ</span></div></div>'+(pending.length?'<h2>⏳ Ожидают проверки</h2>'+pending.map(function(x){return renderRow(x,false);}).join(""):'<div class="portal-ux-empty">Новых письменных работ на проверку нет.</div>')+(reviewed.length?'<details class="portal-ux-reviewed-list"><summary>Проверенные работы ('+reviewed.length+')</summary>'+reviewed.map(function(x){return renderRow(x,true);}).join("")+'</details>':'');
      box.querySelectorAll(".portal-ux-grade-form").forEach(function(form){form.onsubmit=function(ev){ev.preventDefault();var btn=form.querySelector("button"),status=form.querySelector("span");btn.disabled=true;status.textContent="Сохраняем…";window.API.gradeWrittenResult(form.dataset.email,form.dataset.course,form.dataset.test,form.elements.grade.value,form.elements.feedback.value).then(function(r){if(!r||!r.success)throw Error(r&&r.error||"Не удалось сохранить оценку");window.showToast("Оценка сохранена, студент получил уведомление.","ok");window.renderWrittenReviewPage();}).catch(function(e){status.textContent=e.message||String(e);btn.disabled=false;});};});
    }).catch(function(e){box.innerHTML='<div class="portal-ux-error">'+window.escapeHtml(e.message||String(e))+'</div>';});
  };

  // Notifications for written answers open the actual review inbox.
  var oldNotifications=window.renderNotificationItems;
  if(oldNotifications&&!oldNotifications._portalUxWrapped){
    var notifications=function(){
      oldNotifications.apply(this,arguments);
      var list=document.getElementById("notificationItems");if(!list)return;
      list.querySelectorAll("[data-notification-open]").forEach(function(btn){
        var item=(window.notificationCache||[]).find(function(n){return String(n.id)===String(btn.dataset.notificationOpen);});
        if(!item||item.type!=="written_submission")return;
        btn.onclick=function(){
          window.API.markNotificationRead(btn.dataset.notificationOpen).catch(function(){});
          var pop=document.getElementById("notificationPopover");if(pop)pop.hidden=true;
          var bell=document.getElementById("notificationBell");if(bell)bell.setAttribute("aria-expanded","false");
          location.hash="#/written-review";window.refreshNotificationCenter();
        };
      });
    };
    notifications._portalUxWrapped=true;window.renderNotificationItems=notifications;
  }

  // Quick link from the teacher's assignment page.
  var oldTasks=window.renderTeacherTasksPage;
  if(oldTasks&&!oldTasks._portalUxWrapped){
    var tasks=function(){oldTasks.apply(this,arguments);var app=document.getElementById("app"),staff=window.state&&window.state.staff;if(!app||!staff)return;var hero=app.querySelector(".hero");if(!hero||app.querySelector("#writtenReviewShortcut"))return;var a=document.createElement("a");a.id="writtenReviewShortcut";a.className="btn ghost";a.href="#/written-review";a.textContent="✍️ Письменные работы на проверку";a.style.margin="0 0 14px";hero.insertAdjacentElement("afterend",a);};
    tasks._portalUxWrapped=true;window.renderTeacherTasksPage=tasks;
  }
  var oldRouter=window.router;
  if(oldRouter&&!oldRouter._portalUxWrapped){
    var router=function(){var page=String(location.hash||"").replace(/^#\/?/,"").split("/")[0];if(page==="written-review"){window.renderWrittenReviewPage();return;}return oldRouter.apply(this,arguments);};
    router._portalUxWrapped=true;window.router=router;
  }

  // More color themes and subtle backgrounds are added to the existing palette.
  var themes=[
    ["aurora","🌌 Северное сияние"],["ruby","❤️ Рубин"],["steel","🩶 Сталь"],["amber","🟠 Янтарь"],
    ["blueprint","📐 Чертёж"],["emerald","💚 Изумруд"]
  ];
  var backgrounds=[
    ["none","Без фона"],["blueprint","Чертёжная сетка"],["aurora","Северное сияние"],
    ["galaxy","Космос"],["workshop","Мастерская"],["paper","Инженерная бумага"]
  ];
  function setTheme(id){
    document.documentElement.setAttribute("data-theme",id);
    try{localStorage.setItem("mdk.theme_active",id);}catch(e){}
    if(window.state)window.state.activeTheme=id;
    save();
  }
  function setBackground(id){
    if(document.body)document.body.setAttribute("data-portal-bg",id);
    try{localStorage.setItem("mdk.background_active",id);}catch(e){}
    if(window.state)window.state.activeBackground=id;
    save();
  }
  function mountPalette(){
    var palette=document.getElementById("themePalette"),menu=palette&&palette.querySelector("div");
    if(!menu||menu.dataset.portalUxReady)return;
    menu.dataset.portalUxReady="1";menu.style.maxHeight="min(72vh,560px)";menu.style.overflowY="auto";
    var baseThemeIds=["dark","light","neon","matrix","cyberpunk","graphite","lavender","ocean"];
    Array.prototype.forEach.call(menu.querySelectorAll("button"),function(btn,index){btn.addEventListener("click",function(){var id=baseThemeIds[index];if(id&&window.state){window.state.activeTheme=id;save();}});});
    var divider=document.createElement("div");divider.style.cssText="height:1px;background:var(--border);margin:7px 2px";menu.appendChild(divider);
    var th=document.createElement("div");th.textContent="Дополнительные темы";th.style.cssText="font-size:11px;color:var(--muted);padding:6px 8px;font-weight:700";menu.appendChild(th);
    themes.forEach(function(t){var b=document.createElement("button");b.type="button";b.textContent=t[1];b.style.cssText="display:block;width:100%;text-align:left;padding:8px;border:0;border-radius:7px;background:transparent;color:var(--text);cursor:pointer";b.onclick=function(){setTheme(t[0]);menu.style.display="none";};menu.appendChild(b);});
    var bgTitle=document.createElement("div");bgTitle.textContent="Фон кабинета";bgTitle.style.cssText="font-size:11px;color:var(--muted);padding:8px 8px 4px;font-weight:700";menu.appendChild(bgTitle);
    backgrounds.forEach(function(t){var b=document.createElement("button");b.type="button";b.textContent=t[0]==="none"?"◻️ "+t[1]:"🖼️ "+t[1];b.style.cssText="display:block;width:100%;text-align:left;padding:8px;border:0;border-radius:7px;background:transparent;color:var(--text);cursor:pointer";b.onclick=function(){setBackground(t[0]);menu.style.display="none";};menu.appendChild(b);});
  }
  function restoreTheme(){
    var id=(window.state&&window.state.activeTheme)||"";
    if(!id){try{id=localStorage.getItem("mdk.theme_active")||"dark";}catch(e){id="dark";}}
    document.documentElement.setAttribute("data-theme",id);
  }
  function restoreBackground(){
    var id=(window.state&&window.state.activeBackground)||"";
    if(!id){try{id=localStorage.getItem("mdk.background_active")||"none";}catch(e){id="none";}}
    if(document.body)document.body.setAttribute("data-portal-bg",id);
    if(window.state)window.state.activeBackground=id;
  }
  var oldChip=window.renderUserChip;
  if(oldChip&&!oldChip._portalUxWrapped){
    var chip=function(){oldChip.apply(this,arguments);mountPalette();restoreTheme();restoreBackground();checkXp();};
    chip._portalUxWrapped=true;window.renderUserChip=chip;
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){mountPalette();restoreTheme();restoreBackground();});
  else{mountPalette();restoreTheme();restoreBackground();}
  if(window.MutationObserver&&document.body){var observer=new MutationObserver(function(){mountPalette();});observer.observe(document.body,{childList:true,subtree:true});}
  console.log("[portal-ux] grades sync, written review, achievements and personalization ready");
})();