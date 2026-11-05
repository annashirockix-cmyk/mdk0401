"use strict";
(function(){
 const ALL=[["07.01","МДК 07.01 — ЧПУ"],["04.01","МДК 04.01 — Диагностика"],["02.01","МДК 02.01 — Сборка"],["02.02","МДК 02.02 — Программирование"],["MCAM","Mastercam"],["MAT","Материаловедение"],["OT","Охрана труда"]];
 const esc=s=>window.escapeHtml?window.escapeHtml(String(s==null?"":s)):String(s||"");
 window.renderAccessPage=function(){
  const app=document.getElementById("app");if(!app)return;
  const actor=window.state.staff;if(!actor||!["teacher","admin"].includes(actor.role)){app.innerHTML='<div class="module">Раздел доступен преподавателям и администраторам.</div>';return;}
  const allowed=actor.role==="admin"?ALL:ALL.filter(c=>(actor.courses||[]).includes(c[0]));
  app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🔐 Доступ к дисциплинам и приглашения</h1><p>Назначайте студентам доступ к МДК и создавайте ссылки/QR-коды для регистрации.</p></section>'+
   '<div class="module"><h3>Доступ студентов к дисциплинам</h3><p style="color:var(--muted)">Отмечайте дисциплины для каждого студента. Преподаватель управляет только своими дисциплинами, администратор — всеми.</p><div id="accessStudents">Загрузка списка…</div></div>'+
   '<div class="module"><h3>Приглашение новых студентов</h3><p>Ссылка и QR-код создают учётную запись студента и сразу выдают доступ к выбранным дисциплинам.</p><div id="inviteCourseList" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px"></div>'+
   '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px"><label>Срок действия, дней <input id="inviteDays" class="self-input" type="number" min="1" max="90" value="30" style="width:110px"></label><label>Регистраций <input id="inviteUses" class="self-input" type="number" min="1" max="500" value="30" style="width:110px"></label><button class="btn" id="makeInvite">Создать ссылку и QR-код</button></div><div id="inviteOutput" style="margin-top:16px"></div></div>'+
   '<div class="module"><h3>Созданные приглашения</h3><div id="inviteList">Загрузка…</div></div>';
  const courseBox=document.getElementById("inviteCourseList");
  courseBox.innerHTML=allowed.map(c=>'<label style="padding:8px;background:var(--card-soft);border-radius:8px"><input type="checkbox" class="inviteCourse" value="'+c[0]+'"> '+c[1]+'</label>').join("")||"<p>Вам не назначены дисциплины.</p>";
  function loadStudents(){
   const box=document.getElementById("accessStudents");box.textContent="Загрузка списка…";
   window.API.getStudents().then(r=>{
    if(!r||!r.success)throw new Error(r&&r.error||"Не удалось загрузить студентов.");
    const students=(r.students||[]).filter(st=>String(st.role).toLowerCase()==='student');if(!students.length){box.innerHTML="<p>Пока нет зарегистрированных студентов.</p>";return;}
    box.innerHTML=students.map((st,i)=>'<div class="module" style="padding:12px;margin:10px 0"><div><b>'+esc(st.name)+'</b> · '+esc(st.group)+' <span style="color:var(--muted)">('+esc(st.email)+')</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin:10px 0">'+allowed.map(c=>'<label><input type="checkbox" class="studentCourse" data-row="'+i+'" value="'+c[0]+'" '+((st.courses||[]).includes(c[0])?'checked':'')+'> '+c[1]+'</label>').join("")+'</div><button class="btn saveStudentAccess" data-row="'+i+'">Сохранить доступ</button> <span class="accessStatus" data-row="'+i+'"></span></div>').join("");
    box.querySelectorAll(".saveStudentAccess").forEach(btn=>btn.onclick=()=>{
     const i=+btn.dataset.row,st=students[i],courses=Array.from(box.querySelectorAll('.studentCourse[data-row="'+i+'"]:checked')).map(x=>x.value),status=box.querySelector('.accessStatus[data-row="'+i+'"]');
     btn.disabled=true;status.textContent="Сохранение…";
     window.API.setStudentCourses(st.email,courses).then(x=>{if(!x.success)throw new Error(x.error||"Ошибка");st.courses=x.courses||courses;status.textContent="Сохранено ✓";}).catch(e=>status.textContent=e.message).finally(()=>btn.disabled=false);
    });
   }).catch(e=>box.textContent=e.message);
  }
  function loadInvites(){
   const box=document.getElementById("inviteList");
   window.API.getInvites().then(r=>{
    if(!r.success)throw new Error(r.error||"Ошибка");
    if(!r.invites.length){box.innerHTML="<p>Приглашений пока нет.</p>";return;}
    box.innerHTML=r.invites.map(inv=>'<div style="padding:10px;border-bottom:1px solid var(--border)"><b>'+esc(inv.courses)+'</b> · использовано '+inv.uses+'/'+inv.maxUses+' · до '+new Date(inv.expiresAt).toLocaleDateString("ru-RU")+' · '+(inv.active?'активно':'отключено')+' '+(inv.active?'<button class="btn ghost deactivateInvite" data-code="'+esc(inv.code)+'">Отключить</button>':'')+'</div>').join("");
    box.querySelectorAll(".deactivateInvite").forEach(b=>b.onclick=()=>{if(!confirm("Отключить это приглашение?"))return;window.API.deactivateInvite(b.dataset.code).then(()=>loadInvites()).catch(e=>alert(e.message));});
   }).catch(e=>box.textContent=e.message);
  }
  document.getElementById("makeInvite").onclick=function(){
   const courses=Array.from(document.querySelectorAll(".inviteCourse:checked")).map(x=>x.value);
   if(!courses.length){alert("Выберите хотя бы одну дисциплину.");return;}
   const btn=this;btn.disabled=true;btn.textContent="Создание…";
   window.API.createInvite({courses:courses,days:Number(document.getElementById("inviteDays").value),maxUses:Number(document.getElementById("inviteUses").value)}).then(r=>{
    if(!r.success)throw new Error(r.error||"Не удалось создать приглашение.");
    const url=location.origin+location.pathname+"?invite="+encodeURIComponent(r.code);
    document.getElementById("inviteOutput").innerHTML='<div class="module" style="display:flex;gap:18px;flex-wrap:wrap;align-items:center"><div><b>Ссылка для регистрации</b><p><a href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(url)+'</a></p><button class="btn ghost" id="copyInvite">Скопировать ссылку</button><p style="color:var(--muted)">Дисциплины: '+esc(courses.join(", "))+'<br>Регистраций: '+r.maxUses+'<br>Истекает: '+new Date(r.expiresAt).toLocaleDateString("ru-RU")+'</p></div><img alt="QR-код приглашения" width="210" height="210" src="https://api.qrserver.com/v1/create-qr-code/?size=210x210&data='+encodeURIComponent(url)+'"></div>';
    document.getElementById("copyInvite").onclick=()=>{if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>window.showToast("Ссылка скопирована","ok"));else prompt("Скопируйте ссылку",url);};
    loadInvites();
   }).catch(e=>alert(e.message)).finally(()=>{btn.disabled=false;btn.textContent="Создать ссылку и QR-код";});
  };
  loadStudents();loadInvites();
 };
})();