"use strict";
(function(){
var providers=[
 {id:"google",name:"Google Drive",icon:"🟦",description:"Папка приложения в Google Drive. Доступ только к файлам, созданным порталом."},
 {id:"yandex",name:"Яндекс Диск",icon:"🔴",description:"Отдельная папка приложения в Яндекс Диске."},
 {id:"onedrive",name:"OneDrive",icon:"☁️",description:"Папка приложения в личном OneDrive."},
 {id:"dropbox",name:"Dropbox",icon:"📦",description:"Папка приложения Dropbox с ограниченными правами."}
];
window.renderTeacherStoragePage=function(){
 var app=document.getElementById("app"),crumb=document.getElementById("crumbs"),staff=window.state&&window.state.staff;
 if(crumb)crumb.textContent="Мои хранилища";
 if(!app)return;
 if(!staff||!["teacher","admin"].includes(String(staff.role||"").toLowerCase())){app.innerHTML='<section class="module">⛔ Раздел доступен только преподавателям.</section>';return;}
 app.innerHTML='<section class="teacher-storage-page"><header class="teacher-storage-head"><div><a href="#/teacher-dashboard">← Панель преподавателя</a><h1>☁️ Мои хранилища</h1><p>Подключите личные облака, чтобы хранить учебные файлы и резервные копии авторских материалов.</p></div><button class="btn ghost" id="teacherStorageRefresh">↻ Обновить</button></header><div class="teacher-storage-notice"><b>Как это будет работать</b><p>Подключённый диск можно выбрать при загрузке файла к теме или лекции. Создавайте резервные копии авторских лекций, тестов, карточек и других материалов. В копию не попадают оценки, попытки и личные данные студентов. Бинарные вложения остаются в исходном хранилище и отдельно не копируются.</p></div><div id="teacherStorageCards" class="teacher-storage-grid"><p>Загружаем подключённые хранилища…</p></div><p id="teacherStorageStatus" role="status" aria-live="polite"></p><details class="teacher-storage-security"><summary>О безопасности и доступах</summary><p>Портал запрашивает только доступ к папке приложения, где это поддерживает провайдер. Токены хранятся на серверной стороне Apps Script и не передаются ученикам или браузерному коду. Владельцы и редакторы проекта Apps Script имеют административный доступ к свойствам проекта — ограничьте список редакторов проекта доверенными администраторами.</p></details></section>';
 var status=document.getElementById("teacherStorageStatus"),cards=document.getElementById("teacherStorageCards");
 function message(s,isError){if(status){status.textContent=s||"";status.className=isError?"is-error":"is-ok";}}\n function esc(value){return String(value==null?"":value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\x27/g,"&#39;");}
 function render(data){
  cards.innerHTML=providers.map(function(p){
   var v=(data.providers||{})[p.id]||{},connected=!!v.connected,configured=!!v.configured;
   var latest=(data.backups||[]).filter(function(b){return b.provider===p.id;})[0];
   var backupInfo=latest?'<p class="teacher-storage-backup-info">Последняя копия: '+esc(latest.fileName)+'<br>'+esc(latest.itemCount)+' материалов · '+esc(latest.courseCount)+' дисциплин</p>':'<p class="teacher-storage-backup-info">Резервная копия ещё не создавалась</p>';
   var action=connected?'<button class="btn" data-backup="'+p.id+'">Создать резервную копию</button><button class="btn ghost" data-disconnect="'+p.id+'">Отключить</button>':configured?'<button class="btn" data-connect="'+p.id+'">Подключить</button>':'<button class="btn ghost" disabled>Ожидает настройки администратором</button>';
   return '<article class="teacher-storage-card"><div class="teacher-storage-card-top"><span class="teacher-storage-icon">'+p.icon+'</span><span class="teacher-storage-state '+(connected?'is-connected':'')+'">'+(connected?'Подключено':configured?'Не подключено':'Не настроено')+'</span></div><h2>'+p.name+'</h2><p>'+p.description+'</p>'+(connected?backupInfo:'')+'<div class="teacher-storage-card-actions">'+action+'</div></article>';
  }).join("");
  cards.querySelectorAll("[data-connect]").forEach(function(btn){btn.addEventListener("click",function(){
   var provider=btn.getAttribute("data-connect"),popup=window.open("about:blank","teacherCloudOAuth","width=620,height=760");
   btn.disabled=true;message("Подготавливаем безопасное подключение…");
   window.API.beginTeacherCloudOAuth(provider).then(function(r){if(!r||!r.success||!r.url)throw Error(r&&r.error||"Не удалось начать подключение");if(popup&&!popup.closed)popup.location.href=r.url;else window.location.href=r.url;message("Завершите вход в открывшемся окне. Затем обновите список хранилищ.");}).catch(function(e){if(popup&&!popup.closed)popup.close();message(e.message,true);btn.disabled=false;});
  });});
  cards.querySelectorAll("[data-backup]").forEach(function(btn){btn.addEventListener("click",function(){
   var provider=btn.getAttribute("data-backup");
   btn.disabled=true;message("Создаём резервную копию авторских материалов… Не закрывайте страницу.");
   window.API.backupTeacherMaterials(provider).then(function(r){
    if(!r||!r.success)throw Error(r&&r.error||"Не удалось создать резервную копию");
    message("Копия сохранена: "+r.fileName+" · "+r.itemCount+" материалов · "+r.courseCount+" дисциплин.");
    load();
   }).catch(function(e){message(e.message,true);btn.disabled=false;});
  });});
  cards.querySelectorAll("[data-disconnect]").forEach(function(btn){btn.addEventListener("click",function(){
   var provider=btn.getAttribute("data-disconnect");if(!window.confirm("Отключить это облачное хранилище? Уже сохранённые в нём файлы не удалятся."))return;
   btn.disabled=true;window.API.disconnectTeacherCloudStorage(provider).then(function(r){if(!r||!r.success)throw Error(r&&r.error||"Не удалось отключить хранилище");message("Хранилище отключено.");load();}).catch(function(e){message(e.message,true);btn.disabled=false;});
  });});
 }
 function load(){cards.innerHTML="<p>Загружаем…</p>";window.API.getTeacherCloudStorage().then(function(r){if(!r||!r.success)throw Error(r&&r.error||"Не удалось получить список хранилищ");render(r);}).catch(function(e){cards.innerHTML="";message(e.message,true);});}
 document.getElementById("teacherStorageRefresh").addEventListener("click",load);load();
};
})();
