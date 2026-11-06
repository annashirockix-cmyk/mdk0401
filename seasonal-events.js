"use strict";
(function(){
  var SEASONS=[
    {id:"winter",name:"Зимняя смена",icon:"❄️",months:[11,0,1],subtitle:"Точность, надёжность и подготовка оборудования"},
    {id:"spring",name:"Весенний запуск",icon:"🌱",months:[2,3,4],subtitle:"Новые навыки и уверенный старт"},
    {id:"summer",name:"Летняя мастерская",icon:"☀️",months:[5,6,7],subtitle:"Практика, расчёты и самостоятельная работа"},
    {id:"autumn",name:"Осенний техконтроль",icon:"🍂",months:[8,9,10],subtitle:"Диагностика, контроль качества и безопасность"}
  ];
  var current=(function(){var d=new Date(),m=d.getMonth();return SEASONS.find(function(s){return s.months.indexOf(m)>=0;})||SEASONS[0];})();
  var year=new Date().getFullYear(),period=current.id+"_"+year;
  var badgeDefs=[
    {tier:"bronze",icon:"🥉",title:"Бронза сезона",desc:"Успешно пройти хотя бы один тест в текущем сезоне.",needTests:1,needCourses:1,needPractical:0},
    {tier:"silver",icon:"🥈",title:"Серебро сезона",desc:"Успешно пройти три теста по двум дисциплинам.",needTests:3,needCourses:2,needPractical:0},
    {tier:"gold",icon:"🥇",title:"Золото сезона",desc:"Успешно пройти пять тестов по двум дисциплинам и сдать практическую работу.",needTests:5,needCourses:2,needPractical:1}
  ];
  function E(v){return window.escapeHtml?window.escapeHtml(String(v==null?"":v)):String(v==null?"":v);}
  function getBadges(){
    return badgeDefs.map(function(b){return Object.assign({},b,{id:"season_"+period+"_"+b.tier});});
  }
  function ensureAchievementDefinitions(){
    if(!Array.isArray(window.ACHIEVEMENTS))window.ACHIEVEMENTS=[];
    var unlocked=(window.state&&window.state.unlockedAchievements)||[];
    var ids=getBadges().concat(unlocked.filter(function(id){return /^season_[a-z]+_\d{4}_(bronze|silver|gold)$/.test(id);}).map(function(id){
      var p=id.split("_"),tier=p.pop(),yr=p.pop(),season=p.slice(1).join("_"),s=SEASONS.find(function(x){return x.id===season;});
      var def=badgeDefs.find(function(x){return x.tier===tier;});
      return {id:id,icon:def?def.icon:"🏅",title:(s?s.name:"Сезон")+" · "+(def?def.title:"Награда"),desc:def?def.desc:"Награда за сезонное учебное испытание."};
    }));
    ids.forEach(function(b){if(!window.ACHIEVEMENTS.some(function(x){return x.id===b.id;}))window.ACHIEVEMENTS.push({id:b.id,icon:b.icon,title:b.title+" · "+(b.id.match(/_\d{4}_/)||[""])[0].replace(/_/g,""),desc:b.desc});});
  }
  ensureAchievementDefinitions();
  function compute(results,assignments){
    var passed=results.filter(function(r){return /^test_/.test(String(r.testId||""))&&Number(r.grade)>=3;});
    var unique={},courses={};passed.forEach(function(r){unique[String(r.courseId||"")+":"+String(r.testId)]=true;if(r.courseId)courses[r.courseId]=true;});
    var count=Object.keys(unique).length,courseCount=Object.keys(courses).length;
    var practicals=assignments.filter(function(a){var s=a.submission||{};return s.status==="reviewed"&&Number(s.grade)>=3;}).length;
    return {tests:count,courses:courseCount,practicals:practicals};
  }
  function badgeProgress(stats,b){
    var checks=[stats.tests>=b.needTests,stats.courses>=b.needCourses,stats.practicals>=b.needPractical];
    return {done:checks.every(Boolean),checks:checks};
  }
  function unlock(b){
    var id="season_"+period+"_"+b.tier;
    if(!window.state.unlockedAchievements)window.state.unlockedAchievements=[];
    if(window.state.unlockedAchievements.indexOf(id)>=0)return false;
    window.state.unlockedAchievements.push(id);
    if(window.saveStudentData)window.saveStudentData();
    if(window.showToast)window.showToast(b.icon+" Получена сезонная награда: "+b.title,"ok");
    return true;
  }
  window.renderSeasonalEventsPage=function(){
    var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),student=window.state&&window.state.student;
    if(!app)return;if(crumb)crumb.textContent="Сезонные события";
    if(!student||!student.email){app.innerHTML='<section class="module"><h2>🔐 Войдите как обучающийся</h2><p>Сезонные испытания доступны после входа в учебный аккаунт.</p><a class="btn" href="#/account">Войти</a></section>';return;}
    app.innerHTML='<div class="module" style="padding:22px"><a href="#/">← На главную</a><section class="hero" style="margin-top:14px"><h1>'+current.icon+' '+current.name+'</h1><p>'+current.subtitle+'</p><small>Сезонный этап · '+year+'</small></section><p id="seasonStatus" aria-live="polite">Загружаем подтверждённые результаты…</p><div id="seasonContent"></div></div>';
    var status=document.getElementById("seasonStatus"),content=document.getElementById("seasonContent");
    Promise.all([window.API.getMyCourseResults(""),window.API.getAssignments()]).then(function(data){
      if(!data[0]||!data[0].success)throw Error(data[0]&&data[0].error||"Не удалось загрузить результаты");
      if(!data[1]||!data[1].success)throw Error(data[1]&&data[1].error||"Не удалось загрузить задания");
      var results=Array.isArray(data[0].results)?data[0].results:[],assignments=Array.isArray(data[1].assignments)?data[1].assignments:[];
      var stats=compute(results,assignments),unlocked=0;
      badgeDefs.forEach(function(b){var p=badgeProgress(stats,b);if(p.done&&unlock(b))unlocked++;});
      ensureAchievementDefinitions();
      status.textContent="Прогресс рассчитан по сохранённым результатам и проверенным преподавателем работам.";
      var summary=document.createElement("div");summary.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:15px 0";
      [["Успешные тесты",stats.tests],["Дисциплины",stats.courses],["Проверенные практики",stats.practicals]].forEach(function(x){var c=document.createElement("div");c.className="module";c.style.padding="14px";var n=document.createElement("h2");n.textContent=x[1];var l=document.createElement("small");l.textContent=x[0];c.appendChild(n);c.appendChild(l);summary.appendChild(c);});
      content.appendChild(summary);
      if(unlocked&&window.showToast)window.showToast("Поздравляем! Открыто сезонных наград: "+unlocked,"ok");
      var heading=document.createElement("h2");heading.textContent="🏅 Медали сезона";content.appendChild(heading);
      badgeDefs.forEach(function(b){
        var p=badgeProgress(stats,b),id="season_"+period+"_"+b.tier,has=window.state.unlockedAchievements.indexOf(id)>=0;
        var card=document.createElement("article");card.className="module";card.style.cssText="display:flex;gap:14px;align-items:center;padding:16px;margin:10px 0;opacity:"+(has?"1":".82");
        var icon=document.createElement("div");icon.style.fontSize="38px";icon.textContent=has?b.icon:"🔒";
        var info=document.createElement("div");info.style.flex="1";
        var title=document.createElement("b");title.textContent=b.title+(has?" · Получено":"");
        var desc=document.createElement("p");desc.textContent=b.desc;desc.style.cssText="font-size:13px;color:var(--muted);margin:5px 0";
        var progress=document.createElement("small");progress.textContent="Тесты "+Math.min(stats.tests,b.needTests)+"/"+b.needTests+" · дисциплины "+Math.min(stats.courses,b.needCourses)+"/"+b.needCourses+" · практики "+Math.min(stats.practicals,b.needPractical)+"/"+b.needPractical;
        info.appendChild(title);info.appendChild(desc);info.appendChild(progress);card.appendChild(icon);card.appendChild(info);content.appendChild(card);
      });
      var note=document.createElement("p");note.style.cssText="font-size:12px;color:var(--muted);margin-top:16px";note.textContent="Медали не дают дополнительных XP: награды за сами учебные миссии начисляются отдельно. Испытания обновляются с началом нового календарного сезона. Данные берутся только из результатов текущего обучающегося.";content.appendChild(note);
    }).catch(function(err){status.textContent="Не удалось загрузить испытания: "+(err.message||"Проверьте соединение.");});
  };
})();