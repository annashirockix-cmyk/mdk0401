"use strict";
(function(){
  function node(tag,text,cls){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
  function moneylessNumber(v){return Number(v||0).toFixed(2).replace(/\.00$/,"");}
  var base=window.renderRatingPage;
  if(typeof base!=="function")return;
  window.renderRatingPage=function(){
    var app=document.getElementById("app");if(!app)return;
    if(window.state&&window.state.student&&!window.state.staff){
      app.innerHTML="";
      var crumbs=document.getElementById("crumbs");if(crumbs)crumbs.textContent="Доска почёта";
      var hero=node("section",null,"hero");hero.appendChild(node("h1","🏆 Доска почёта"));app.appendChild(hero);
      var lead=node("p","Предметные рейтинги показывают учебные результаты по дисциплинам. В таблицах не отображаются адреса электронной почты.");lead.style.color="var(--muted)";app.appendChild(lead);
    } else {
      base.apply(this,arguments);
    }
    var panel=node("section",null,"module");panel.id="subjectRatingPanel";panel.style.cssText="margin-top:18px;padding:18px;border-left:4px solid var(--accent)";
    var heading=node("h3","📚 Предметные рейтинги");panel.appendChild(heading);
    var intro=node("p","Отдельный рейтинг по каждой дисциплине рассчитывается по сохранённым оценкам: средний балл, процент выполнения и число завершённых работ.","");intro.style.color="var(--muted)";panel.appendChild(intro);
    var status=node("p","Загружаем предметную статистику…");panel.appendChild(status);
    app.appendChild(panel);
    if(!window.API||typeof API.getPublicSubjectRatings!=="function"){status.textContent="Предметная статистика появится после обновления серверного приложения.";return;}
    API.getPublicSubjectRatings().then(function(res){
      if(!res||!res.success){status.textContent="Не удалось получить предметные рейтинги. Проверьте обновление серверного приложения.";return;}
      status.remove();
      var subjects=res.subjects||[],ratings=res.ratings||{};
      if(!subjects.length){panel.appendChild(node("p","Пока нет оценённых работ. Выполненные задания появятся в рейтинге после сохранения результата."));return;}
      var summary=node("div");summary.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px;margin:12px 0";
      subjects.forEach(function(s,i){var card=node("div");card.style.cssText="padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--card-soft)";card.appendChild(node("b",(i+1)+". "+s.courseId));card.appendChild(node("div","Средний балл: "+moneylessNumber(s.averageGrade)));card.appendChild(node("small","Участников: "+s.participants));summary.appendChild(card);});
      panel.appendChild(node("h4","🏅 Общий рейтинг дисциплин"));panel.appendChild(summary);
      var select=node("select");select.style.cssText="width:100%;max-width:360px;padding:10px;border-radius:8px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin:8px 0 12px";
      subjects.forEach(function(s){var opt=node("option",s.courseId+" — средний балл "+moneylessNumber(s.averageGrade));opt.value=s.courseId;select.appendChild(opt);});
      panel.appendChild(node("h4","👥 Рейтинг обучающихся по дисциплине"));panel.appendChild(select);
      var tableWrap=node("div");panel.appendChild(tableWrap);
      function renderCourse(){
        tableWrap.innerHTML="";var list=ratings[select.value]||[];
        if(!list.length){tableWrap.appendChild(node("p","Пока нет сохранённых оценок по этой дисциплине."));return;}
        var table=node("table");table.style.cssText="width:100%;border-collapse:collapse;font-size:14px";
        var thead=node("thead"),tr=node("tr");["Место","Обучающийся","Группа","Средний балл","Выполнено","Средний %"].forEach(function(t){var th=node("th",t);th.style.cssText="text-align:left;padding:9px;border-bottom:1px solid var(--border)";tr.appendChild(th);});thead.appendChild(tr);table.appendChild(thead);
        var tbody=node("tbody");list.forEach(function(s,i){var row=node("tr");[String(i+1),s.name,s.group,moneylessNumber(s.averageGrade),String(s.completed),String(s.averagePercent)+"%"].forEach(function(v){var td=node("td",v);td.style.cssText="padding:9px;border-bottom:1px solid var(--border)";row.appendChild(td);});tbody.appendChild(row);});table.appendChild(tbody);tableWrap.appendChild(table);
      }
      select.addEventListener("change",renderCourse);renderCourse();
      var note=node("p","Важно: в таблице используются агрегированные учебные результаты; адреса электронной почты и личные данные из профилей не передаются.");note.style.cssText="font-size:12px;color:var(--muted);margin-top:12px";panel.appendChild(note);
    }).catch(function(err){console.warn("Subject ratings:",err);status.textContent="Предметная статистика временно недоступна. Повторите попытку позже.";});
  };
})();
