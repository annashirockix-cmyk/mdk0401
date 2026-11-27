(function(){
"use strict";
const $=id=>document.getElementById(id);
const courses=[["07.01","МДК 07.01"],["04.01","МДК 04.01"],["02.01","МДК 02.01"],["02.02","МДК 02.02"],["MCAM","Mastercam"],["ENB","English Basic"],["ENT","Technical English"],["MAT","Материаловедение"],["MET","Метрология"]];
const esc=v=>window.escapeHtml?window.escapeHtml(String(v??"")):String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const me=()=>window.state&&(window.state.staff||window.state.student);
const isStaff=()=>!!(window.state&&window.state.staff);
let api=null,current=null,refreshTimer=null;
function dateLabel(v){const d=new Date(v);return isNaN(d)?"Дата не указана":d.toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"});}
function statusLabel(w){if(w.status==="cancelled")return "Отменён";if(w.status==="completed")return "Завершён";if(w.status==="live")return "Идёт сейчас";if(w.status==="draft")return "Черновик";if(new Date(w.startsAt).getTime()<Date.now())return "Завершён";return "Запланирован";}
function courseOptions(selected){return courses.map(c=>'<option value="'+c[0]+'" '+(selected===c[0]?"selected":"")+'>'+c[1]+'</option>').join("");}
function renderCard(w){
 const canJoin=w.status==="published"||w.status==="live";
 const controls=w.status==="draft"?'<button class="btn ghost" data-status="published" data-webinar="'+esc(w.id)+'">Опубликовать</button>':w.status==="published"?'<button class="btn ghost" data-status="live" data-webinar="'+esc(w.id)+'">Начать</button>':w.status==="live"?'<button class="btn ghost" data-status="completed" data-webinar="'+esc(w.id)+'">Завершить</button>':"";
 const cancel=["draft","published","live"].includes(w.status)?'<button class="btn ghost webinar-cancel" data-status="cancelled" data-webinar="'+esc(w.id)+'">Отменить</button>':"";
 return '<article class="webinar-card"><div class="webinar-card-head"><span class="webinar-status">'+esc(statusLabel(w))+'</span><small>'+esc(courses.find(c=>c[0]===w.courseId)?.[1]||w.courseId)+'</small></div><h3>'+esc(w.title)+'</h3><p>'+esc(w.description||"Без описания")+'</p><div class="webinar-meta"><span>🗓 '+esc(dateLabel(w.startsAt))+'</span><span>👥 '+Number(w.participants||0)+' участников</span></div><div class="webinar-actions">'+(canJoin?'<button class="btn primary" data-join="'+esc(w.id)+'">Войти в вебинар</button>':"")+(isStaff()?'<button class="btn ghost" data-copy="'+esc(w.id)+'">Скопировать приглашение</button>'+controls+cancel:"")+'</div></article>';
}
async function load(){
 const host=$("webinarList");if(!host)return;
 host.innerHTML='<div class="webinar-empty">Загружаем вебинары…</div>';
 try{const r=await API.getWebinars();if(!r||!r.success)throw new Error(r?.error||"Не удалось загрузить список");
 const list=Array.isArray(r.data)?r.data:[];
 host.innerHTML=list.length?list.map(renderCard).join(""):'<div class="webinar-empty">Пока нет вебинаров. Преподаватель может создать первый.</div>';
 host.querySelectorAll("[data-join]").forEach(b=>b.onclick=()=>join(b.dataset.join));
 host.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>copyInvite(b.dataset.copy,list));
 host.querySelectorAll("[data-status]").forEach(b=>b.onclick=()=>changeStatus(b.dataset.webinar,b.dataset.status));
 }catch(e){host.innerHTML='<div class="webinar-error">'+esc(e.message)+'</div>';}
}
async function copyInvite(id,list){const w=list.find(x=>x.id===id);if(!w)return;const url=location.origin+location.pathname+"#/webinars?join="+encodeURIComponent(id);try{await navigator.clipboard.writeText(url);window.showToast&&showToast("Ссылка-приглашение скопирована");}catch(e){prompt("Скопируйте ссылку",url);}}
async function changeStatus(id,status){
 const labels={published:"опубликовать",live:"начать вебинар",completed:"завершить вебинар",cancelled:"отменить вебинар"};
 if(!confirm("Вы действительно хотите "+(labels[status]||"изменить состояние")+"?"))return;
 try{const r=await API.updateWebinarStatus(id,status);if(!r||!r.success)throw new Error(r?.error||"Не удалось изменить состояние вебинара");await load();window.showToast&&showToast("Состояние вебинара обновлено");}
 catch(e){window.showToast?showToast(e.message):alert(e.message);}
}
async function create(e){
 e.preventDefault();const status=$("webinarCreateStatus"),btn=$("webinarCreateBtn");btn.disabled=true;status.textContent="Сохраняем вебинар…";
 const data={title:$("webinarTitle").value.trim(),courseId:$("webinarCourse").value,startsAt:$("webinarDate").value,description:$("webinarDescription").value.trim(),status:$("webinarPublish").checked?"published":"draft"};
 try{const r=await API.createWebinar(data);if(!r||!r.success)throw new Error(r?.error||"Не удалось создать вебинар");status.textContent="Вебинар сохранён";$("webinarTitle").value="";$("webinarDescription").value="";await load();}
 catch(err){status.textContent=err.message;}finally{btn.disabled=false;}
}
function loadJitsi(domain){
 return new Promise((resolve,reject)=>{
  if(window.JitsiMeetExternalAPI)return resolve();
  const script=document.createElement("script");script.src="https://"+domain+"/external_api.js";script.async=true;
  script.onload=()=>window.JitsiMeetExternalAPI?resolve():reject(new Error("Не удалось загрузить интерфейс видеосвязи"));
  script.onerror=()=>reject(new Error("Не удалось подключиться к серверу видеосвязи"));
  document.head.appendChild(script);
 });
}
async function join(id){
 const host=$("webinarRoom");host.hidden=false;host.innerHTML='<div class="webinar-loading">Подготавливаем комнату…</div>';host.scrollIntoView({behavior:"smooth",block:"start"});
 try{
  const r=await API.joinWebinar(id);if(!r||!r.success)throw new Error(r?.error||"Не удалось войти");
  current=r;
  await loadJitsi(r.domain);
  host.innerHTML='<div class="webinar-room-head"><div><strong>'+esc(r.title)+'</strong><span id="webinarRoomState">Подключаемся…</span></div><button id="webinarClose" class="btn ghost">Выйти из комнаты</button></div><div id="jitsiMeetFrame" class="webinar-meet"></div><div class="webinar-room-foot"><span id="webinarParticipantCount">Участники подключаются…</span><span>'+(r.secure?"Защищённая комната":"Демонстрационный режим — не используйте для закрытых занятий")+'</span></div>';
  $("webinarClose").onclick=()=>leave(true);
  const options={roomName:r.roomName,parentNode:$("jitsiMeetFrame"),width:"100%",height:"100%",lang:"ru",jwt:r.jwt||undefined,userInfo:{displayName:r.displayName||"Участник"},configOverwrite:{prejoinConfig:{enabled:true},startWithAudioMuted:!r.isHost,startWithVideoMuted:!r.isHost,disableDeepLinking:true,toolbarButtons:["microphone","camera","desktop","chat","raisehand","tileview","participants-pane","hangup","settings","videoquality","fullscreen"]},interfaceConfigOverwrite:{MOBILE_APP_PROMO:false,SHOW_JITSI_WATERMARK:true}};
  api=new JitsiMeetExternalAPI(r.domain,options);
  api.addEventListener("videoConferenceJoined",async ev=>{const state=$("webinarRoomState");if(state)state.textContent="Вы в вебинаре";try{await API.webinarAttendance(id,"join");}catch(e){}updateCount();});
  api.addEventListener("videoConferenceLeft",async()=>{try{await API.webinarAttendance(id,"leave");}catch(e){}api=null;});
  api.addEventListener("participantJoined",updateCount);api.addEventListener("participantLeft",updateCount);
  api.addEventListener("readyToClose",()=>leave(false));
  if(r.isHost){
   const toolbar=$("webinarRoomState");
   toolbar.title="Вы ведущий вебинара";
   const foot=$("webinarParticipantCount");if(foot)foot.insertAdjacentHTML("afterend",' <span class="webinar-record-note">Запись пока недоступна: требуется настройка сервера записи (Jibri или поддерживаемый сервис)</span>');
  }
 }catch(e){host.innerHTML='<div class="webinar-error">'+esc(e.message)+'</div><button class="btn ghost" id="webinarCloseError">Закрыть</button>';const closeError=$("webinarCloseError");if(closeError)closeError.onclick=()=>{host.hidden=true;};}
}
function updateCount(){if(!api)return;const el=$("webinarParticipantCount");if(el){try{el.textContent="Участников: "+api.getNumberOfParticipants();}catch(e){}}}
async function leave(hangup){if(api&&hangup){try{api.executeCommand("hangup");}catch(e){}}api=null;current=null;const host=$("webinarRoom");if(host){host.hidden=true;host.innerHTML="";} }
function render(){
 const app=$("app");if(!app||!location.hash.startsWith("#/webinars"))return;
 const user=me();if(!user){app.innerHTML='<section class="module"><h2>Вебинары</h2><p>Войдите в портал, чтобы участвовать в вебинарах.</p></section>';return;}
 app.innerHTML='<section class="module webinar-page"><div class="webinar-heading"><div><h2>🎥 Вебинары</h2><p>Онлайн-занятия с камерой, микрофоном, демонстрацией экрана и чатом.</p></div><button id="webinarRefresh" class="btn ghost">↻ Обновить</button></div>'+(isStaff()?'<details class="webinar-create" open><summary>＋ Создать вебинар</summary><form id="webinarForm"><div class="webinar-form-grid"><label>Название<input id="webinarTitle" required maxlength="120" placeholder="Например, Разбор практической работы"></label><label>Дисциплина<select id="webinarCourse">'+courseOptions(window.state.activeCourseId||"07.01")+'</select></label><label>Дата и время<input id="webinarDate" type="datetime-local" required></label><label class="webinar-wide">Описание<textarea id="webinarDescription" rows="2" maxlength="1000" placeholder="Тема, план и материалы вебинара"></textarea></label></div><label class="webinar-publish"><input id="webinarPublish" type="checkbox" checked> Опубликовать для студентов</label><button id="webinarCreateBtn" class="btn primary" type="submit">Создать вебинар</button><span id="webinarCreateStatus" class="webinar-status-text"></span></form></details>':'')+'<div id="webinarList" class="webinar-list"></div><section id="webinarRoom" class="webinar-room" hidden></section></section>';
 $("webinarRefresh").onclick=load;
 if(isStaff())$("webinarForm").onsubmit=create;
 const dt=$("webinarDate");if(dt){const d=new Date(Date.now()+3600000);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());dt.value=d.toISOString().slice(0,16);}
 load();
 const params=new URLSearchParams(location.hash.split("?")[1]||"");const joinId=params.get("join");if(joinId)setTimeout(()=>join(joinId),350);
}
window.renderWebinars=render;
window.addEventListener("hashchange",()=>{if(location.hash.startsWith("#/webinars"))render();else if(api)leave(true);});
document.addEventListener("DOMContentLoaded",()=>{if(location.hash.startsWith("#/webinars"))render();});
})();