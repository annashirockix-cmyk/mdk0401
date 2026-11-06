"use strict";
(function(){
  var KEY="mdk.museumCurator.v1";
  function esc(v){return window.escapeHtml?window.escapeHtml(String(v==null?"":v)):String(v||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function isStaff(){var s=window.state&&window.state.staff;return !!s&&["teacher","admin"].includes(String(s.role||"").toLowerCase());}
  function courses(){var s=window.state.staff||{};return String(s.role).toLowerCase()==="admin"?null:(Array.isArray(s.courses)?s.courses.map(String):[]);}
  function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[];}catch(e){return [];}}
  function save(items){localStorage.setItem(KEY,JSON.stringify(items));}
  function readFile(file){return new Promise(function(resolve,reject){if(!file){resolve("");return;}if(!/^image\//i.test(file.type)){reject(Error("Пока можно прикрепить только изображение."));return;}if(file.size>400*1024){reject(Error("Изображение больше 400 КБ. Уменьшите файл и повторите."));return;}var r=new FileReader();r.onload=function(){resolve(String(r.result||""));};r.onerror=function(){reject(Error("Не удалось прочитать файл."));};r.readAsDataURL(file);});}
  window.renderMuseumCuratorPage=function(){
    var app=document.getElementById("app"),crumb=document.getElementById("crumbs");
    if(!app)return;if(crumb)crumb.textContent="Куратор музея";
    if(!isStaff()){app.innerHTML='<section class="module">⛔ Раздел доступен только преподавателю и администратору.</section>';return;}
    app.innerHTML='<a class="backlink" href="#/museum">← Вернуться в музей</a><section class="hero"><h1>🖼️ Куратор экспозиции</h1><p>Выбирайте подтверждённые учебные работы и формируйте подборку для будущей публикации.</p></section><section class="module"><b>Важно о сохранении</b><p style="color:var(--muted);margin:6px 0">Отбор и прикреплённые изображения сохраняются только в браузере этого устройства. Это локальный макет экспозиции: он не публикует материалы другим пользователям и не загружает файлы на сервер.</p><div id="curatorStatus">Загружаем проверенные работы…</div></section><div id="curatorList"></div><section class="module"><h2>📚 Моя подборка</h2><div id="curatorSaved"></div><button class="btn" id="curatorExport" type="button">Экспортировать подборку (JSON)</button></section>';
    var status=document.getElementById("curatorStatus"),list=document.getElementById("curatorList"),saved=document.getElementById("curatorSaved");
    var allowed=courses();
    window.API.getAssignments().then(function(res){
      if(!res||!res.success)throw Error(res&&res.error||"Не удалось загрузить задания");
      var rows=[];
      (res.assignments||[]).forEach(function(task){
        var cid=String(task.courseId||"");if(allowed&&allowed.indexOf(cid)<0)return;
        (task.submissions||[]).forEach(function(sub){
          if(String(sub.status||"").toLowerCase()!=="reviewed"||!Number.isFinite(Number(sub.grade))||Number(sub.grade)<3)return;
          rows.push({id:String(sub.id||sub.submissionId||task.id+"_"+(sub.studentEmail||sub.studentName||rows.length)),taskId:String(task.id||""),title:String(task.title||"Практическая работа"),course:cid,student:String(sub.studentName||sub.name||"Обучающийся"),group:String(sub.group||""),grade:Number(sub.grade),date:String(sub.reviewedAt||sub.submittedAt||""),topic:String(task.topic||"")});
        });
      });
      status.textContent="Найдено подтверждённых работ: "+rows.length+". Отбор доступен только по вашим дисциплинам.";
      var chosen=load();
      function renderSaved(){chosen=load();saved.innerHTML=chosen.length?'<div class="museum-curator-grid">'+chosen.map(function(x,i){return '<article class="module" style="padding:12px"><b>'+esc(x.title)+'</b><div class="museum-muted">'+esc(x.course)+' · '+esc(x.student)+' · оценка '+esc(x.grade)+'</div>'+(x.image?'<img alt="Иллюстрация экспоната" src="'+x.image+'" style="width:100%;max-height:150px;object-fit:contain;margin-top:8px;border-radius:8px">':'')+'<button class="btn ghost" data-remove="'+i+'" type="button">Убрать из подборки</button></article>';}).join("")+'</div>':'<p style="color:var(--muted)">Подборка пока пуста. Выберите работы выше.</p>';}
      list.innerHTML=rows.length?'<div class="museum-curator-grid">'+rows.map(function(x,i){var exists=chosen.some(function(c){return c.id===x.id;});return '<article class="module" style="padding:14px"><div class="museum-number">ПРОВЕРЕННАЯ РАБОТА · '+(i+1)+'</div><h3>'+esc(x.title)+'</h3><div class="museum-course">'+esc(x.course)+'</div><p class="museum-muted">'+esc(x.student)+' · '+esc(x.group||"Группа не указана")+' · оценка '+esc(x.grade)+'</p>'+(x.topic?'<p class="museum-muted">Тема: '+esc(x.topic)+'</p>':'')+'<label style="display:block;margin:10px 0">Подпись экспоната<input data-caption="'+i+'" type="text" maxlength="120" placeholder="Например: Точная траектория обработки" style="width:100%;margin-top:5px"></label><label style="display:block;margin:10px 0">Иллюстрация (JPG/PNG/WebP, до 400 КБ)<input data-image="'+i+'" type="file" accept="image/*" style="display:block;max-width:100%;margin-top:5px"></label><button class="btn" data-add="'+i+'" type="button" '+(exists?'disabled':'')+'>'+(exists?'Уже в подборке':'Добавить в подборку')+'</button></article>';}).join("")+'</div>':'<section class="module">Пока нет проверенных работ с оценкой от 3 в доступных дисциплинах.</section>';
      list.querySelectorAll("[data-add]").forEach(function(btn){btn.onclick=async function(){var x=rows[Number(btn.dataset.add)],caption=list.querySelector('[data-caption="'+btn.dataset.add+'"]').value.trim(),fileInput=list.querySelector('[data-image="'+btn.dataset.add+'"]'),image="";try{image=await readFile(fileInput.files&&fileInput.files[0]);var now=load();if(now.some(function(c){return c.id===x.id;}))return;now.push(Object.assign({},x,{caption:caption,image:image,curatedAt:new Date().toISOString()}));save(now);renderSaved();btn.disabled=true;btn.textContent="Добавлено";if(window.showToast)window.showToast("Работа добавлена в локальную подборку","success");}catch(e){alert(e.message);}};});
      saved.onclick=function(e){var b=e.target.closest("[data-remove]");if(!b)return;var arr=load();arr.splice(Number(b.dataset.remove),1);save(arr);renderSaved();};
      document.getElementById("curatorExport").onclick=function(){var data=JSON.stringify(load(),null,2),blob=new Blob([data],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="museum-exposition-draft.json";a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);};
      renderSaved();
    }).catch(function(err){status.textContent="Ошибка загрузки: "+esc(err.message);});
  };
  if(!document.getElementById("museumCuratorStyles")){var st=document.createElement("style");st.id="museumCuratorStyles";st.textContent='.museum-curator-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin:14px 0}.museum-curator-grid input[type=text]{box-sizing:border-box;padding:9px;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text)}';document.head.appendChild(st);}
})();