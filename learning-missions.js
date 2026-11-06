"use strict";
(function(){
  var NAMES={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда","PFI":"ПФИ"};
  function E(v){return window.escapeHtml(String(v==null?"":v));}
  function safeDate(v){if(!v)return "—";var d=new Date(v);return isNaN(d.getTime())?"—":d.toLocaleDateString("ru-RU");}
  function flatten(course){var out=[];(course&&course.sections||[]).forEach(function(section){(section.topics||[]).forEach(function(topic){out.push(topic);});});return out;}
  function render(app,student,results,assignments){
    var courseIds=Array.isArray(student.courses)?student.courses.slice():[];
    results.forEach(function(r){if(r.courseId&&courseIds.indexOf(r.courseId)<0)courseIds.push(r.courseId);});
    assignments.forEach(function(t){if(t.courseId&&courseIds.indexOf(t.courseId)<0)courseIds.push(t.courseId);});
    if(!courseIds.length)courseIds=Object.keys(window.MDK_DATA||{}).filter(function(id){return !window.canAccessCourse||window.canAccessCourse(id);});
    courseIds=courseIds.filter(function(id){return window.MDK_DATA&&window.MDK_DATA[id]&&(!window.canAccessCourse||window.canAccessCourse(id));});
    var topics=[];
    courseIds.forEach(function(id){flatten(window.MDK_DATA[id]).forEach(function(t){topics.push({courseId:id,topic:t});});});
    var quizMissions=topics.filter(function(x){return Array.isArray(x.topic.test)&&x.topic.test.length;}).map(function(x){
      var testId="test_"+x.topic.id;
      var result=results.filter(function(r){return String(r.courseId||"")===String(x.courseId)&&String(r.testId||"")===testId;}).sort(function(a,b){return String(b.finishedAt||"").localeCompare(String(a.finishedAt||""));})[0];
      if(!result&&window.state.results&&window.state.results[testId])result=Object.assign({courseId:x.courseId,testId:testId},window.state.results[testId]);
      var done=!!(result&&Number(result.grade)>=3);
      return {id:"quiz:"+x.courseId+":"+x.topic.id,courseId:x.courseId,title:"Контроль знаний: "+(x.topic.title||x.topic.code),topic:x.topic,done:done,result:result,kind:"quiz",reward:15};
    });
    var taskMissions=assignments.map(function(t){
      var sub=t.submission||null,done=!!(sub&&sub.status==="reviewed"&&Number(sub.grade)>=3);
      return {id:"task:"+t.id,courseId:t.courseId,title:"Практика: "+(t.title||"Задание"),done:done,kind:"task",reward:20,submission:sub,task:t};
    });
    var missions=quizMissions.concat(taskMissions);
    var claimed=Array.isArray(window.state.missionRewardsClaimed)?window.state.missionRewardsClaimed:[];
    var earned=0,added=0;
    missions.forEach(function(m){if(m.done&&claimed.indexOf(m.id)<0){claimed.push(m.id);window.state.xp=(Number(window.state.xp)||0)+m.reward;earned+=m.reward;added++;}});
    if(added){window.state.missionRewardsClaimed=claimed;if(window.saveStudentData)window.saveStudentData();if(window.renderUserChip)window.renderUserChip();if(window.showToast)window.showToast("🎯 За завершённые учебные этапы начислено +"+earned+" XP","ok");}
    var doneCount=missions.filter(function(m){return m.done;}).length,total=quizMissions.length+taskMissions.length,pct=total?Math.round(doneCount/total*100):0;
    var level=window.getLevel?window.getLevel(window.state.xp):Math.floor((Number(window.state.xp)||0)/100)+1;
    var title=window.getLevelTitle?window.getLevelTitle(level):"Уровень "+level;
    app.innerHTML='<div class="module" style="padding:22px"><a class="backlink" href="#/">← На главную</a><div style="display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap"><div><h1>🎯 Учебные миссии</h1><p style="color:var(--muted)">Учись, проходи проверки и открывай новые уровни.</p></div><button class="btn ghost" id="missionsRefresh" type="button">↻ Обновить</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0"><div class="module"><small>Твой уровень</small><h2 style="margin:5px 0">'+E(level)+'</h2><b>'+E(title)+'</b></div><div class="module"><small>Опыт</small><h2 style="margin:5px 0">'+E(window.state.xp||0)+' XP</h2><small>100 XP на уровень</small></div><div class="module"><small>Этапы</small><h2 style="margin:5px 0">'+doneCount+' / '+total+'</h2><small>подтверждено порталом</small></div></div><div style="height:12px;background:var(--card-soft);border-radius:20px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--accent);transition:width .3s"></div></div><p style="font-size:12px;color:var(--muted)">'+pct+'% подтверждённых учебных миссий</p><div id="missionList"></div><p style="font-size:12px;color:var(--muted);margin-top:18px">XP за учебные миссии начисляется один раз за подтверждённый этап в этом аккаунте и хранится в профиле портала. XP — игровая мотивация, она не заменяет оценку преподавателя. Для синхронизации нужен вход в аккаунт и соединение с сервером.</p></div>';
    var list=document.getElementById("missionList");
    var pending=quizMissions.filter(function(m){return !m.done;});
    if(pending.length){
      var byCourse={};pending.forEach(function(m){(byCourse[m.courseId]||(byCourse[m.courseId]=[])).push(m);});
      Object.keys(byCourse).forEach(function(id){
        var section=document.createElement("section");section.style.marginTop="22px";
        var h=document.createElement("h2");h.textContent=NAMES[id]||id;section.appendChild(h);
        byCourse[id].forEach(function(m){
          var card=document.createElement("article");card.className="module";card.style.cssText="margin:10px 0;padding:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap";
          var info=document.createElement("div"),title=document.createElement("b"),desc=document.createElement("p");title.textContent=m.title;desc.textContent="Откройте тему, изучите материал и выполните контрольный тест. Награда: +15 XP.";desc.style.cssText="font-size:13px;color:var(--muted);margin:6px 0 0";info.appendChild(title);info.appendChild(desc);
          var link=document.createElement("a");link.className="btn";link.href="#/topic/"+encodeURIComponent(id)+"/"+encodeURIComponent(m.topic.id);link.textContent="Перейти к теме";
          card.appendChild(info);card.appendChild(link);section.appendChild(card);
        });
        list.appendChild(section);
      });
    }else if(!quizMissions.length){var empty=document.createElement("p");empty.textContent="Для доступных дисциплин пока не найдены темы с контрольными тестами.";list.appendChild(empty);}
    var pendingTasks=taskMissions.filter(function(m){return !m.done;});
    if(pendingTasks.length){
      var practicalSection=document.createElement("section");practicalSection.style.marginTop="22px";
      var ph=document.createElement("h2");ph.textContent="🛠 Практические миссии";practicalSection.appendChild(ph);
      pendingTasks.forEach(function(m){
        var card=document.createElement("article");card.className="module";card.style.cssText="margin:10px 0;padding:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap";
        var info=document.createElement("div"),name=document.createElement("b"),desc=document.createElement("p");name.textContent=m.title;desc.textContent=(m.submission?(m.submission.status==="reviewed"?"Работа проверена, но для награды нужна оценка не ниже 3.":"Работа отправлена и ожидает проверки."):"Выполните задание и отправьте преподавателю на проверку.")+" Награда после успешной проверки: +20 XP.";desc.style.cssText="font-size:13px;color:var(--muted);margin:6px 0 0";info.appendChild(name);info.appendChild(desc);
        var link=document.createElement("a");link.className="btn ghost";link.href="#/learning-path";link.textContent="Открыть задания";
        card.appendChild(info);card.appendChild(link);practicalSection.appendChild(card);
      });
      list.appendChild(practicalSection);
    }
    var completed=missions.filter(function(m){return m.done;});
    var doneSection=document.createElement("section");doneSection.style.marginTop="22px";var dh=document.createElement("h2");dh.textContent="🏅 Завершённые миссии";doneSection.appendChild(dh);
    if(!completed.length){var none=document.createElement("p");none.style.color="var(--muted)";none.textContent="Здесь появятся успешно пройденные тесты и проверенные практические работы.";doneSection.appendChild(none);}
    completed.forEach(function(m){var row=document.createElement("article");row.className="module";row.style.cssText="padding:13px;margin:8px 0";var name=document.createElement("b");name.textContent="✓ "+m.title;var meta=document.createElement("p");meta.style.cssText="margin:5px 0 0;color:var(--muted);font-size:12px";meta.textContent=(NAMES[m.courseId]||m.courseId)+" · "+(m.kind==="quiz"?"Оценка: "+m.result.grade:"Оценка: "+m.submission.grade)+" · +"+m.reward+" XP";row.appendChild(name);row.appendChild(meta);doneSection.appendChild(row);});
    list.appendChild(doneSection);
    var refresh=document.getElementById("missionsRefresh");if(refresh)refresh.onclick=function(){window.renderLearningMissionsPage();};
  }
  window.renderLearningMissionsPage=function(){
    var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),student=window.state&&window.state.student;
    if(!app)return;if(crumb)crumb.textContent="Учебные миссии";
    if(!student||!student.email){app.innerHTML='<section class="module"><h2>🔐 Войдите как обучающийся</h2><p>Учебные миссии доступны после входа в учебный аккаунт.</p></section>';return;}
    app.innerHTML='<section class="module"><p>Загружаем ваши учебные миссии…</p></section>';
    Promise.all([window.API.getMyCourseResults(""),window.API.getAssignments()]).then(function(v){
      if(!v[0]||!v[0].success)throw Error(v[0]&&v[0].error||"Не удалось загрузить результаты");
      if(!v[1]||!v[1].success)throw Error(v[1]&&v[1].error||"Не удалось загрузить задания");
      render(app,student,Array.isArray(v[0].results)?v[0].results:[],Array.isArray(v[1].assignments)?v[1].assignments:[]);
    }).catch(function(err){app.innerHTML='<section class="module"><h2>Не удалось загрузить миссии</h2><p>'+E(err.message||"Проверьте подключение к серверу.")+'</p><button class="btn" onclick="window.renderLearningMissionsPage()">Повторить</button></section>';});
  };
})();