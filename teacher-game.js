"use strict";
(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>window.escapeHtml?window.escapeHtml(String(s==null?"":s)):String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const course=()=>window.state.activeCourseId||"07.01";
  const role=()=>String((window.state.staff||window.state.student||{}).role||"student").toLowerCase();
  const teacher=()=>!!window.state.staff&&(role()==="teacher"||role()==="admin");
  const games=()=>((window.customContent&&window.customContent.games)||[]).filter(g=>g.mdkId===course());
  function shell(title){const app=$("app");if(!app)return null;app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🎲 '+title+'</h1><p>Игровая викторина по выбранной дисциплине</p></section>';const c=$("crumbs");if(c)c.textContent=title;return app;}
  window.renderOwnGames=function(){
    const app=shell("Своя игра");if(!app)return;
    const list=games();
    app.insertAdjacentHTML("beforeend",'<section class="module"><p>Выберите игровое поле и отвечайте на вопросы по категориям и стоимости.</p>'+(teacher()?'<a class="btn" href="#/own-game/edit">＋ Создать «Свою игру»</a>':'')+'</section>');
    if(!list.length){app.insertAdjacentHTML("beforeend",'<section class="module">В этой дисциплине пока нет опубликованных игр.</section>');return;}
    list.forEach(g=>{const card=document.createElement("section");card.className="module";card.innerHTML='<h2>'+esc(g.title)+'</h2><p class="museum-muted">'+(g.categories||[]).length+' категорий · '+(g.categories||[]).reduce((n,c)=>n+(c.questions||[]).length,0)+' вопросов</p><button class="btn" data-game="'+esc(g.id)+'">Играть</button>'+(teacher()?'<button class="btn ghost" data-edit="'+esc(g.id)+'">Изменить</button> <button class="btn ghost" data-delete="'+esc(g.id)+'">Удалить</button>':'');app.appendChild(card);});
    app.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>play(b.dataset.game));
    app.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{location.hash="#/own-game/edit/"+encodeURIComponent(b.dataset.edit);});
    app.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(!confirm("Удалить это игровое поле? Действие нельзя отменить."))return;try{const r=await window.API.deleteCustomContent(b.dataset.delete);if(!r||!r.success)throw Error(r&&r.error||"Не удалось удалить игру");await new Promise(resolve=>window.loadGlobalCustomContent(resolve));window.renderOwnGames();}catch(e){window.showToast?window.showToast(e.message,"err"):alert(e.message);}});
  };
  window.renderOwnGameEditor=function(id){
    const app=shell("Конструктор «Своей игры»");if(!app)return;
    if(!teacher()||(window.canAccessCourse&&!window.canAccessCourse(course()))){app.insertAdjacentHTML("beforeend",'<section class="module">Создавать игры могут только преподаватели, которым назначена выбранная дисциплина.</section>');return;}
    const old=games().find(g=>g.id===id);
    const model={title:old?old.title:"Своя игра",categories:old?JSON.parse(JSON.stringify(old.categories||[])):[{title:"Новая категория",questions:[{points:100,q:"",a:""}]}]};
    app.insertAdjacentHTML("beforeend",'<section class="module"><label for="ownGameTitle">Название игры</label><input class="self-input" id="ownGameTitle" placeholder="Например: Знатоки материаловедения"><p class="museum-muted">Добавляйте категории и вопросы. Ответы видны студентам только после отдельного запроса к серверу.</p><div id="ownGameCategories"></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0"><button class="btn ghost" id="ownGameLoadExample" type="button">✨ Загрузить пример по G-коду</button><button class="btn ghost" id="ownGameAddCategory" type="button">＋ Добавить категорию</button><button class="btn" id="ownGameSave" type="button">Сохранить игру</button><a class="btn ghost" href="#/own-game">К списку игр</a></div><details class="module" style="margin-top:12px"><summary>Дополнительно: импорт / экспорт JSON</summary><p class="museum-muted">Можно вставить подготовленные категории в формате JSON или скопировать текущую структуру.</p><textarea class="self-input" id="ownGameJson" rows="12" spellcheck="false"></textarea><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn ghost" id="ownGameImport" type="button">Загрузить JSON в редактор</button><button class="btn ghost" id="ownGameExport" type="button">Обновить JSON из редактора</button></div></details><section class="module"><h3>Предпросмотр игрового поля</h3><div id="ownGamePreviewBox"></div></section><p id="ownGameStatus" aria-live="polite"></p></section>');
    $("ownGameTitle").value=model.title;
    const status=message=>{ $("ownGameStatus").textContent=message; };
    function syncJson(){ $("ownGameJson").value=JSON.stringify(model.categories,null,2); }
    function draw(){
      const host=$("ownGameCategories");
      host.innerHTML=model.categories.map((cat,ci)=>'<article class="module" style="margin:12px 0;border:1px solid var(--border)"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label style="flex:1;min-width:220px">Категория '+(ci+1)+'<input class="self-input" data-cat-title="'+ci+'" value="'+esc(cat.title||"")+'" placeholder="Название категории"></label><button type="button" class="btn ghost" data-remove-cat="'+ci+'">Удалить категорию</button></div><div>'+cat.questions.map((q,qi)=>'<div style="padding:12px 0;border-top:1px solid var(--border);margin-top:10px"><div style="display:flex;gap:8px;align-items:center;justify-content:space-between"><b>Вопрос '+(qi+1)+'</b><button type="button" class="btn ghost" data-remove-q="'+ci+':'+qi+'">Удалить</button></div><label>Стоимость, баллы<input class="self-input" type="number" min="1" max="10000" step="50" data-q-points="'+ci+':'+qi+'" value="'+esc(q.points||((qi+1)*100))+'"></label><label>Текст вопроса<textarea class="self-input" rows="2" data-q-text="'+ci+':'+qi+'" placeholder="Введите вопрос">'+esc(q.q||"")+'</textarea></label><label>Правильный ответ<textarea class="self-input" rows="2" data-q-answer="'+ci+':'+qi+'" placeholder="Введите ответ">'+esc(q.a||"")+'</textarea></label></div>').join("")+'<button type="button" class="btn ghost" data-add-q="'+ci+'">＋ Добавить вопрос</button></div></article>').join("");
      syncJson();drawPreview();
    }
    function drawPreview(){ $("ownGamePreviewBox").innerHTML=boardHtml(model); }
    hostEvents();
    function hostEvents(){
      const host=$("ownGameCategories");
      host.addEventListener("input",e=>{
        const t=e.target;
        if(t.dataset.catTitle!==undefined)model.categories[Number(t.dataset.catTitle)].title=t.value;
        if(t.dataset.qPoints){const [c,q]=t.dataset.qPoints.split(":").map(Number);model.categories[c].questions[q].points=Number(t.value);}
        if(t.dataset.qText){const [c,q]=t.dataset.qText.split(":").map(Number);model.categories[c].questions[q].q=t.value;}
        if(t.dataset.qAnswer){const [c,q]=t.dataset.qAnswer.split(":").map(Number);model.categories[c].questions[q].a=t.value;}
        syncJson();
      });
      host.addEventListener("click",e=>{
        const b=e.target.closest("button");if(!b)return;
        if(b.dataset.addQ!==undefined){model.categories[Number(b.dataset.addQ)].questions.push({points:(model.categories[Number(b.dataset.addQ)].questions.length+1)*100,q:"",a:""});draw();}
        if(b.dataset.removeCat!==undefined){model.categories.splice(Number(b.dataset.removeCat),1);draw();}
        if(b.dataset.removeQ){const [c,q]=b.dataset.removeQ.split(":").map(Number);model.categories[c].questions.splice(q,1);draw();}
      });
    }
    $("ownGameLoadExample").onclick=()=>{model.title="Своя игра: основы G-кода";$("ownGameTitle").value=model.title;model.categories=[
      {title:"Команды перемещения",questions:[
        {points:100,q:"Какая команда задаёт быстрое позиционирование инструмента без обработки?",a:"G00 — быстрое перемещение."},
        {points:200,q:"Чем отличается G01 от G00?",a:"G01 выполняет линейное перемещение с заданной рабочей подачей; G00 — быстрое позиционирование."},
        {points:300,q:"В программе задано G01 X50 Y-20 F120. Что означают X, Y и F?",a:"X50 и Y-20 — координаты конечной точки; F120 — заданная подача (единицы зависят от режима и системы ЧПУ)."}
      ]},
      {title:"Шпиндель и инструмент",questions:[
        {points:100,q:"Какая команда обычно включает вращение шпинделя по часовой стрелке?",a:"M03 (M3)."},
        {points:200,q:"Для чего используется команда M05?",a:"Для остановки шпинделя."},
        {points:300,q:"Что необходимо проверить перед запуском команды M03 S1200?",a:"Допустимую частоту вращения, закрепление заготовки и инструмента, закрытие ограждений и соответствие режимов карте наладки."}
      ]},
      {title:"Координаты и безопасность",questions:[
        {points:100,q:"Как называется точка, от которой отсчитываются координаты детали в выбранной системе?",a:"Ноль детали (рабочий ноль)."},
        {points:200,q:"Что задаёт G54 в распространённых системах ЧПУ?",a:"Первую рабочую систему координат детали; точная реализация зависит от стойки."},
        {points:300,q:"Почему нельзя переносить программу на другой станок без проверки?",a:"Могут отличаться стойка, кинематика, нули, коррекции, формат циклов и M-коды; программу нужно проверить по документации и безопасно отработать."}
      ]}
    ];draw();status("Пример загружен. Проверьте формулировки и сохраните игру, когда будете готовы.");};
    $("ownGameAddCategory").onclick=()=>{model.categories.push({title:"Новая категория",questions:[{points:100,q:"",a:""}]});draw();};
    $("ownGameImport").onclick=()=>{try{const parsed=JSON.parse($("ownGameJson").value);validate(parsed);model.categories=parsed;draw();status("JSON загружен в визуальный редактор.");}catch(e){status(e.message);}};
    $("ownGameExport").onclick=()=>{syncJson();status("JSON обновлён.");};
    $("ownGameSave").onclick=async()=>{try{model.title=$("ownGameTitle").value.trim();validate(model.categories);if(!model.title)throw Error("Введите название игры.");status("Сохранение…");const res=await window.API.saveCustomContent({id:id||("own-game-"+Date.now()),mdkId:course(),type:"game",title:model.title,categories:model.categories});if(!res||!res.success)throw Error(res&&res.error||"Не удалось сохранить игру.");await new Promise(resolve=>window.loadGlobalCustomContent(resolve));status("Игра сохранена.");location.hash="#/own-game";}catch(e){status(e.message);}};
    draw();
  };
  function validate(cats){if(!Array.isArray(cats)||!cats.length)throw Error("Добавьте хотя бы одну категорию.");cats.forEach((c,i)=>{if(!String(c.title||"").trim()||!Array.isArray(c.questions)||!c.questions.length)throw Error("Категория "+(i+1)+": укажите название и хотя бы один вопрос.");c.questions.forEach((q,j)=>{if(!String(q.q||"").trim()||!String(q.a||"").trim())throw Error("Категория "+(i+1)+", вопрос "+(j+1)+": заполните вопрос и ответ.");q.points=Number(q.points)||((j+1)*100);if(q.points<1||q.points>10000)throw Error("Стоимость вопроса должна быть от 1 до 10000 баллов.");});});}
  function boardHtml(g){
    const categories=g.categories||[],rows=Math.max(0,...categories.map(c=>(c.questions||[]).length));
    return '<h3>'+esc(g.title||"Игровое поле")+'</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse;text-align:center"><thead><tr><th style="padding:8px">Стоимость</th>'+categories.map(c=>'<th style="padding:8px">'+esc(c.title)+'</th>').join("")+'</tr></thead><tbody>'+Array.from({length:rows},(_,row)=>'<tr><th style="padding:8px">'+((row+1)*100)+'</th>'+categories.map((c,col)=>{const q=(c.questions||[])[row];return '<td style="padding:8px;border:1px solid var(--border)">'+(q?'<button class="btn ghost" data-q="'+col+':'+row+'">'+esc(q.points||((row+1)*100))+'</button>':'—')+'</td>';}).join("")+'</tr>').join("")+'</tbody></table></div>';
  }
  function play(id){const app=shell("Своя игра");const g=games().find(x=>x.id===id);if(!g){app.insertAdjacentHTML("beforeend",'<section class="module">Игра не найдена.</section>');return;}app.insertAdjacentHTML("beforeend",'<section class="module" id="ownGameBoard">'+boardHtml(g)+'</section><section class="module" id="ownGameQuestion" hidden></section>');app.querySelectorAll("#ownGameBoard [data-q]").forEach(b=>b.onclick=()=>{const parts=b.dataset.q.split(":").map(Number),q=g.categories[parts[0]].questions[parts[1]],box=$("ownGameQuestion");box.hidden=false;box.innerHTML='<p class="museum-muted">'+esc(g.categories[parts[0]].title)+' · '+esc(q.points)+' баллов</p><h2>'+esc(q.q)+'</h2><button class="btn" id="ownGameReveal">Показать ответ</button><div id="ownGameAnswer" hidden style="margin-top:12px;font-size:20px;font-weight:bold;color:var(--ok)"></div><button class="btn ghost" id="ownGameClose" style="margin-left:8px">Закрыть вопрос</button>';$("ownGameReveal").onclick=async()=>{const btn=$("ownGameReveal");btn.disabled=true;btn.textContent="Загружаем ответ…";try{const res=await window.API.getGameAnswer(g.id,parts[0],parts[1]);if(!res||!res.success)throw Error(res&&res.error||"Ответ недоступен");$("ownGameAnswer").textContent=res.answer||"Ответ не задан";$("ownGameAnswer").hidden=false;btn.textContent="Ответ показан";}catch(e){btn.disabled=false;btn.textContent="Показать ответ";window.showToast?window.showToast(e.message,"err"):alert(e.message);}};$("ownGameClose").onclick=()=>{box.hidden=true;};box.scrollIntoView({behavior:"smooth",block:"center"});});}
  const prior=window.router;if(prior)window.router=function(){const p=(location.hash||"").replace(/^#/,"").split("/").filter(Boolean);if(p[0]==="own-game"){if(p[1]==="edit")window.renderOwnGameEditor(p[2]?decodeURIComponent(p[2]):"");else window.renderOwnGames();return;}prior.apply(this,arguments);};
})();