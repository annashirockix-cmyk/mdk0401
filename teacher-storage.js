"use strict";
(function(){
  const providers=[
    {id:"google",name:"Google Drive",hint:"Папка приложения для учебных материалов"},
    {id:"yandex",name:"Яндекс Диск",hint:"Отдельная папка приложения"},
    {id:"onedrive",name:"OneDrive",hint:"Папка приложения в вашем OneDrive"},
    {id:"dropbox",name:"Dropbox",hint:"Папка приложения с ограниченным доступом"}
  ];
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function isTeacher(){const u=window.state&&(window.state.staff||window.state.student)||{};return ["teacher","admin"].includes(String(u.role||"").toLowerCase());}
  window.renderTeacherStoragePage=function(){
    const app=document.getElementById("app");if(!app)return;
    if(!isTeacher()){app.innerHTML='<section class="module"><h2>Раздел доступен преподавателям</h2></section>';return;}
    app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>☁️ Мои хранилища</h1><p>Подключите личные облачные диски. Подключение принадлежит вашей учётной записи преподавателя и не открывает ваши личные файлы студентам.</p></section><div class="module"><p><b>Как это будет работать</b></p><p>На первом этапе подключаются аккаунты. Следующим этапом материалы лекций и файлы редактора будут сохраняться в выбранное хранилище, а ссылки для студентов будут выдаваться через защищённый портал.</p><p style="color:var(--muted)">Подключение пока не переносит старые файлы и не меняет место хранения существующих материалов.</p></div><div id="teacherStorageList" class="module">Загрузка подключений…</div><div class="module"><b>Безопасность</b><p>Портал запрашивает доступ только к папке приложения, где это поддерживает провайдер. Не передавайте пароль от облачного аккаунта порталу — авторизация проходит на стороне самого сервиса.</p></div>';
    const box=document.getElementById("teacherStorageList");
    function load(){
      box.textContent="Загрузка подключений…";
      return window.API.getCloudStorageStatus().then(r=>{
        if(!r.success)throw new Error(r.error||"Не удалось получить состояние хранилищ.");
        box.innerHTML='<h3>Подключение облачных дисков</h3><div style="display:grid;gap:12px">'+providers.map(p=>{
          const s=r.providers&&r.providers[p.id]||{},connected=!!s.connected;
          return '<article style="border:1px solid var(--border);border-radius:12px;padding:14px"><div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><b>'+esc(p.name)+'</b><div style="font-size:13px;color:var(--muted)">'+esc(p.hint)+'</div><div style="font-size:13px;margin-top:5px">'+(connected?'<span style="color:#218653">● Подключено</span>':'<span style="color:var(--muted)">○ Не подключено</span>')+(s.isDefault?' · <b>Хранилище по умолчанию</b>':'')+'</div></div><div style="display:flex;gap:8px;flex-wrap:wrap">'+(connected?'<button class="btn ghost" data-default="'+p.id+'" '+(s.isDefault?'disabled':'')+'>Использовать по умолчанию</button><button class="btn ghost" data-disconnect="'+p.id+'">Отключить</button>':'<button class="btn" data-connect="'+p.id+'">Подключить</button>')+'</div></div></article>';
        }).join("")+'</div>';
        box.querySelectorAll("[data-connect]").forEach(b=>b.onclick=function(){b.disabled=true;b.textContent="Переход…";window.API.beginCloudStorageConnection(b.dataset.connect).then(x=>{if(!x.success||!x.authorizationUrl)throw new Error(x.error||"Не удалось начать подключение.");location.href=x.authorizationUrl;}).catch(e=>{b.disabled=false;b.textContent="Подключить";window.showToast(e.message,"err");});});
        box.querySelectorAll("[data-default]").forEach(b=>b.onclick=function(){b.disabled=true;window.API.setDefaultCloudStorage(b.dataset.default).then(x=>{if(!x.success)throw new Error(x.error||"Не удалось изменить хранилище.");return load();}).catch(e=>{b.disabled=false;window.showToast(e.message,"err");});});
        box.querySelectorAll("[data-disconnect]").forEach(b=>b.onclick=function(){const id=b.dataset.disconnect;if(!confirm("Отключить "+(providers.find(p=>p.id===id)||{}).name+"? Файлы в облаке не удаляются."))return;b.disabled=true;window.API.disconnectCloudStorage(id).then(x=>{if(!x.success)throw new Error(x.error||"Не удалось отключить хранилище.");return load();}).catch(e=>{b.disabled=false;window.showToast(e.message,"err");});});
      });
    }
    load().catch(e=>{box.textContent="Ошибка: "+e.message;});
  };
  const previous=window.router;
  if(previous)window.router=function(){const route=(location.hash||"").replace(/^#/,"").split("/").filter(Boolean);if(route[0]==="teacher-storage"){window.renderTeacherStoragePage();return;}return previous.apply(this,arguments);};
})();
