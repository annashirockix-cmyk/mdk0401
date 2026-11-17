"use strict";
(function () {
  function esc(value) {
    return String(value == null ? "" : value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function currentCourse() {
    return String((window.state && window.state.activeCourseId) || "07.01");
  }
  function mount() {
    var app=document.getElementById("app"),state=window.state||{};
    if(!app || (location.hash && location.hash!=="#/" && location.hash!=="#/"))return;
    if(!state.student&&!state.staff)return;
    if(document.getElementById("tutoringHomeCard"))return;
    var isStudent=!!state.student;
    var staff=state.staff||{};
    var isTeacher=!isStudent&&(String(staff.role||"").toLowerCase()==="teacher"||String(staff.role||"").toLowerCase()==="admin");
    if(!isStudent&&!isTeacher)return;
    var courseId=currentCourse(),identity=state.student||state.staff;
    var card=document.createElement("section");
    card.id="tutoringHomeCard";
    card.className="module";
    card.style.cssText="margin:18px 0;padding:20px;border:1px solid var(--border);border-radius:18px;background:var(--card);";
    card.innerHTML='<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:10px"><div style="font-size:28px">🎓</div><div style="flex:1;min-width:180px"><h2 style="margin:0 0 4px">Дополнительные занятия</h2><div style="color:var(--muted);font-size:13px">Индивидуальные консультации и репетиторство</div></div><span style="font-size:12px;color:var(--muted)">Главный экран</span></div><div id="tutoringHomeContent"><p style="color:var(--muted);margin:8px 0">Загружаем настройки записи…</p></div>';
    var hero=app.querySelector(".hero");
    if(hero)hero.insertAdjacentElement("afterend",card);else app.prepend(card);
    var content=card.querySelector("#tutoringHomeContent");
    if(!window.API||!window.API.getTutoringLink){content.textContent="Сервис записи временно недоступен.";return;}
    window.API.getTutoringLink(courseId).then(function(result){
      if(!card.isConnected||String(currentCourse())!==courseId)return;
      if(isTeacher){
        var link=result&&result.link||{};
        content.innerHTML='<form id="tutoringTeacherForm" style="display:grid;gap:10px;max-width:760px"><label style="display:grid;gap:5px;font-size:13px">Ваша личная ссылка для записи<input name="url" type="url" maxlength="1000" placeholder="https://…" value="'+esc(link.url||"")+'" style="width:100%;box-sizing:border-box;padding:11px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text)"></label><label style="display:grid;gap:5px;font-size:13px">Название для студентов<input name="title" maxlength="120" value="'+esc(link.title||"Запись на дополнительные занятия")+'" style="width:100%;box-sizing:border-box;padding:11px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text)"></label><label style="display:grid;gap:5px;font-size:13px">Пояснение (необязательно)<textarea name="description" maxlength="500" rows="2" placeholder="Например: индивидуальные консультации по понедельникам" style="width:100%;box-sizing:border-box;padding:11px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text)">'+esc(link.description||"")+'</textarea></label><label style="display:flex;gap:9px;align-items:center;font-size:13px"><input type="checkbox" name="visible" '+(link.visible===true&&!!link.url?"checked":"")+'> Показывать мою ссылку студентам моих дисциплин</label><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn" type="submit">Сохранить настройки</button><span id="tutoringSaveStatus" style="font-size:13px;color:var(--muted)"></span></div></form><p style="font-size:12px;color:var(--muted);margin:12px 0 0">Настройки личные: другие преподаватели не видят и не могут изменить вашу ссылку.</p>';
        var form=content.querySelector("#tutoringTeacherForm");
        form.addEventListener("submit",function(event){
          event.preventDefault();
          var button=form.querySelector('button[type="submit"]'),status=form.querySelector("#tutoringSaveStatus"),data=new FormData(form);
          button.disabled=true;status.textContent="Сохраняем…";
          window.API.saveTutoringLink(courseId,{url:String(data.get("url")||"").trim(),title:String(data.get("title")||"").trim(),description:String(data.get("description")||"").trim(),visible:form.elements.visible.checked}).then(function(saved){
            status.textContent=saved&&saved.success?"Настройки сохранены.":"Не удалось подтвердить сохранение.";
            status.style.color=saved&&saved.success?"var(--success)":"var(--err)";
          }).catch(function(error){status.textContent=error.message||"Ошибка сохранения.";status.style.color="var(--err)";}).finally(function(){button.disabled=false;});
        });
      } else {
        var links=result&&Array.isArray(result.links)?result.links:[];
        if(!links.length){content.innerHTML='<p style="margin:8px 0;color:var(--muted)">Преподаватели пока не открыли запись на дополнительные занятия.</p>';return;}
        content.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px">'+links.map(function(link){
          return '<article style="padding:14px;border:1px solid var(--border);border-radius:12px;min-width:0"><h3 style="margin:0 0 6px;font-size:16px">'+esc(link.teacherName||"Преподаватель")+'</h3><div style="font-weight:600;margin-bottom:6px">'+esc(link.title||"Запись на дополнительные занятия")+'</div>'+(link.description?'<p style="margin:0 0 10px;color:var(--muted);font-size:13px">'+esc(link.description)+'</p>':'')+'<a class="btn" href="'+esc(link.url)+'" target="_blank" rel="noopener noreferrer" style="display:inline-flex;text-decoration:none">Записаться</a></article>';
        }).join("")+'</div>';
      }
    }).catch(function(error){
      if(card.isConnected)content.innerHTML='<p style="color:var(--err);margin:8px 0">Не удалось загрузить запись: '+esc(error.message||"ошибка сервера")+'</p>';
    });
  }
  var original=window.renderHomePage;
  if(typeof original==="function"){
    window.renderHomePage=function(){var result=original.apply(this,arguments);mount();return result;};
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);
  else mount();
  window.addEventListener("hashchange",function(){if(!location.hash||location.hash==="#/"||location.hash==="#")mount();});
  window.mountTutoringHomeCard=mount;
})();