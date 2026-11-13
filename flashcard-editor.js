"use strict";
(function(){
  function esc(v){return window.escapeHtml?window.escapeHtml(String(v==null?"":v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function staff(){var s=window.state&&window.state.staff;return !!s&&["teacher","admin"].indexOf(String(s.role||"").toLowerCase())>=0;}
  function admin(){return !!(window.state&&window.state.staff&&String(window.state.staff.role).toLowerCase()==="admin");}
  function courses(){return admin()?Object.keys(window.MDK_DATA||{}).filter(function(id){return id!=="basic"&&id!=="technical";}):((window.state.staff&&window.state.staff.courses)||[]).filter(function(id){return !!(window.MDK_DATA&&window.MDK_DATA[id]);});}
  function topics(courseId){var out=[],c=window.MDK_DATA&&window.MDK_DATA[courseId];(c&&c.sections||[]).forEach(function(section){(section.topics||[]).forEach(function(t){out.push({id:t.id,title:(t.code||"")+" "+(t.title||"")});});});((window.customContent&&window.customContent.topics)||[]).filter(function(t){return String(t.mdkId)===String(courseId);}).forEach(function(t){out.push({id:t.id,title:t.title});});return out;}
  function byId(id){return document.getElementById(id);}
  function render(){var app=byId("app"),crumb=byId("crumbs");if(!app)return;if(crumb)crumb.textContent="Конструктор карточек";if(!staff()){app.innerHTML='<section class="module">⛔ Создание карточек доступно только преподавателю и администратору.</section>';return;}
    var ids=courses();if(!ids.length){app.innerHTML='<section class="module">Администратор пока не назначил вам дисциплины.</section>';return;}
    var current=ids.indexOf(window.state.activeCourseId)>=0?window.state.activeCourseId:ids[0];
    app.innerHTML='<a class="backlink" href="#/course-editor">← К редактору курса</a><section class="hero"><h1>🃏 Конструктор карточек</h1><p>Создавайте наборы терминов, определений, переводов и вопросов для повторения. Карточки сохраняются в выбранной дисциплине и теме.</p></section><div class="module"><label>Дисциплина</label><select id="fcCourse" class="self-input">'+ids.map(function(id){return '<option value="'+esc(id)+'" '+(id===current?'selected':'')+'>'+esc((window.MDK_DATA[id]&&window.MDK_DATA[id].shortName)||id)+'</option>';}).join("")+'</select><label style="display:block;margin-top:10px">Тема</label><select id="fcTopic" class="self-input"></select><label style="display:block;margin-top:10px">Существующий набор</label><select id="fcExisting" class="self-input"><option value="">— Новый набор —</option></select><input id="fcTitle" class="self-input" placeholder="Название набора карточек" style="margin:10px 0"><label>Раздел английского языка</label><select id="fcTrack" class="self-input"><option value="all">Общий набор</option><option value="basic">Базовый английский</option><option value="technical">Технический английский</option></select></div><section class="module"><h3>Добавить карточку</h3><input id="fcFront" class="self-input" placeholder="Лицевая сторона: слово или вопрос"><input id="fcBack" class="self-input" placeholder="Обратная сторона: перевод или ответ" style="margin-top:8px"><input id="fcTrans" class="self-input" placeholder="Транскрипция / пояснение (необязательно)" style="margin-top:8px"><button class="btn" id="fcAdd" style="margin-top:10px">Добавить карточку</button> <button class="btn ghost" id="fcLoadExample" type="button">✨ Загрузить пример по G-коду</button> <button class="btn ghost" id="fcCancel" type="button">Отмена изменения</button><div id="fcDrafts" style="margin-top:14px"></div><button class="btn" id="fcSave">Сохранить набор</button> <button class="btn ghost" id="fcReset" type="button">Новый набор</button> <button class="btn ghost" id="fcDelete" type="button" disabled>Удалить набор</button><span id="fcStatus" aria-live="polite" style="margin-left:8px"></span></section><section class="module"><h3>Сохранённые наборы</h3><div id="fcSaved">Загрузка…</div></section>';
    var course=byId("fcCourse"),topic=byId("fcTopic"),existing=byId("fcExisting"),drafts=[],setId="",edit=-1,all=[];
    function loadData(){return window.API.getCustomContent().then(function(res){if(!res||!res.success)throw Error(res&&res.error||"Не удалось загрузить материалы");all=(res.data||[]).filter(function(x){return x.type==="flashcards"&&ids.indexOf(x.mdkId)>=0;});window.customContent.flashcards=all;fillTopics();});}
    function fillTopics(){var selected=topic.value,list=topics(course.value);topic.innerHTML=list.map(function(t){return '<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>';}).join("");if(list.some(function(t){return String(t.id)===String(selected);}))topic.value=selected;fillSets();}
    function fillSets(){var arr=all.filter(function(x){return x.mdkId===course.value&&x.topicId===topic.value;});existing.innerHTML='<option value="">— Новый набор —</option>'+arr.map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.title)+' ('+((x.cards||[]).length)+')</option>';}).join("");renderSaved();}
    function draw(){byId("fcDrafts").innerHTML='<h4>Карточки в наборе ('+drafts.length+')</h4>'+(drafts.length?drafts.map(function(c,i){return '<article class="module" style="padding:10px;margin:8px 0"><b>'+esc(c.front)+'</b><div>'+esc(c.back)+'</div>'+(c.transcription?'<small>'+esc(c.transcription)+'</small>':'')+'<div style="margin-top:8px"><button class="btn ghost" data-edit="'+i+'">Изменить</button> <button class="btn ghost" data-remove="'+i+'">Удалить</button></div></article>';}).join(""):'<p>Добавьте первую карточку.</p>');byId("fcDrafts").querySelectorAll("[data-edit]").forEach(function(b){b.onclick=function(){var c=drafts[Number(b.dataset.edit)];byId("fcFront").value=c.front;byId("fcBack").value=c.back;byId("fcTrans").value=c.transcription||"";edit=Number(b.dataset.edit);byId("fcAdd").textContent="Сохранить карточку";};});byId("fcDrafts").querySelectorAll("[data-remove]").forEach(function(b){b.onclick=function(){drafts.splice(Number(b.dataset.remove),1);clearForm();draw();};});}
    function clearForm(){byId("fcFront").value="";byId("fcBack").value="";byId("fcTrans").value="";edit=-1;byId("fcAdd").textContent="Добавить карточку";}
    function reset(){setId="";drafts=[];existing.value="";byId("fcTitle").value="";byId("fcTrack").value="all";byId("fcSave").textContent="Сохранить набор";byId("fcDelete").disabled=true;byId("fcStatus").textContent="";clearForm();draw();}
    function loadSet(){var item=all.find(function(x){return String(x.id)===existing.value;});if(!item){reset();return;}setId=item.id;drafts=(item.cards||[]).map(function(c){return {front:c.front||"",back:c.back||"",transcription:c.transcription||""};});byId("fcTitle").value=item.title||"";byId("fcTrack").value=item.track||"all";byId("fcSave").textContent="Сохранить изменения";byId("fcDelete").disabled=false;byId("fcStatus").textContent="Набор загружен для изменения.";draw();}
    function renderSaved(){var list=byId("fcSaved");if(!list)return;var arr=all.filter(function(x){return x.mdkId===course.value&&x.topicId===topic.value;});list.innerHTML=arr.length?arr.map(function(x){return '<div style="padding:9px 0;border-bottom:1px solid var(--border)"><b>'+esc(x.title)+'</b> · '+((x.cards||[]).length)+' карточек <button class="btn ghost" data-open="'+esc(x.id)+'">Открыть</button></div>';}).join(""):'<p>Для выбранной темы наборов пока нет.</p>';list.querySelectorAll("[data-open]").forEach(function(b){b.onclick=function(){existing.value=b.dataset.open;loadSet();};});}
    course.onchange=function(){reset();fillTopics();};topic.onchange=function(){reset();fillSets();};existing.onchange=loadSet;byId("fcReset").onclick=reset;byId("fcCancel").onclick=clearForm;
    byId("fcLoadExample").onclick=function(){drafts=[
      {front:"G00 — быстрое перемещение",back:"Перемещение инструмента в заданную точку на быстром ходу без рабочей подачи.",transcription:"Проверяйте безопасную высоту и траекторию."},
      {front:"G01 — линейная интерполяция",back:"Перемещение по прямой с заданной рабочей подачей F.",transcription:"Пример: G01 X50 Y-20 F120."},
      {front:"G02 — круговая интерполяция",back:"Движение по дуге по часовой стрелке (в плоскости, выбранной командой G17/G18/G19).",transcription:"Направление и формат дуги сверяйте со стойкой."},
      {front:"G03 — круговая интерполяция",back:"Движение по дуге против часовой стрелки.",transcription:"Могут применяться параметры I, J, K или R."},
      {front:"M03 — шпиндель",back:"Включение вращения шпинделя по часовой стрелке.",transcription:"Частота обычно задаётся адресом S."},
      {front:"M05 — останов шпинделя",back:"Останавливает вращение шпинделя.",transcription:"Перед сменой инструмента убедитесь в полной остановке."},
      {front:"F — подача",back:"Задаёт скорость рабочей подачи инструмента; единицы зависят от режима программирования.",transcription:"Не путайте с частотой вращения S."},
      {front:"G54 — рабочая система координат",back:"Выбирает рабочую систему координат детали (типично первая из нескольких).",transcription:"Конкретное поведение зависит от стойки ЧПУ."}
    ];setId="";existing.value="";byId("fcTitle").value="Карточки: основы G-кода";byId("fcTrack").value="all";byId("fcSave").textContent="Сохранить набор";byId("fcDelete").disabled=true;byId("fcStatus").textContent="Пример загружен. Выберите тему, проверьте карточки и сохраните набор.";clearForm();draw();};
    byId("fcAdd").onclick=function(){var front=byId("fcFront").value.trim(),back=byId("fcBack").value.trim(),trans=byId("fcTrans").value.trim();if(!front||!back){window.showToast("Заполните обе стороны карточки.","err");return;}var item={front:front,back:back,transcription:trans};if(edit>=0)drafts[edit]=item;else drafts.push(item);clearForm();draw();};
    byId("fcSave").onclick=function(){var title=byId("fcTitle").value.trim();if(!topic.value||!title||!drafts.length){byId("fcStatus").textContent="Выберите тему, укажите название и добавьте карточки.";return;}var id=setId||("cards-"+Date.now());byId("fcStatus").textContent="Сохранение…";window.API.saveCustomContent({id:id,mdkId:course.value,topicId:topic.value,type:"flashcards",title:title,track:byId("fcTrack").value,cards:drafts.map(function(c){return Object.assign({},c);})}).then(function(res){if(!res||!res.success)throw Error(res&&res.error||"Не удалось сохранить набор");setId=id;return loadData();}).then(function(){existing.value=id;byId("fcSave").textContent="Сохранить изменения";byId("fcDelete").disabled=false;byId("fcStatus").textContent="Набор сохранён ✓";}).catch(function(e){byId("fcStatus").textContent=e.message;});};
    byId("fcDelete").onclick=function(){if(!setId||!confirm("Удалить выбранный набор карточек?"))return;window.API.deleteCustomContent(setId).then(function(res){if(!res||!res.success)throw Error(res&&res.error||"Не удалось удалить набор");reset();return loadData();}).then(function(){byId("fcStatus").textContent="Набор удалён.";}).catch(function(e){byId("fcStatus").textContent=e.message;});};
    fillTopics();
    loadData().catch(function(e){byId("fcSaved").textContent="Ошибка загрузки: "+e.message;});
  }
  window.renderFlashcardEditorPage=render;
  var originalEditor=window.renderCourseEditorPage;
  if(originalEditor)window.renderCourseEditorPage=function(){originalEditor.apply(this,arguments);var app=byId("app"),hero=app&&app.querySelector(".hero");if(hero&&!app.querySelector("#openFlashcardEditor")){var a=document.createElement("a");a.id="openFlashcardEditor";a.href="#/flashcard-editor";a.className="btn ghost";a.textContent="🃏 Открыть конструктор карточек";hero.insertAdjacentElement("afterend",a);}};
  var flashcardContext=null;
  function enhanceTopicFlashcards(courseId,topicId,activeTab){
    var track="",courseData=window.MDK_DATA&&window.MDK_DATA[courseId];
    (courseData&&courseData.sections||[]).forEach(function(section){(section.topics||[]).forEach(function(t){if(String(t.id)===String(topicId))track=t.sourceTrack||"";});});
    var sets=(window.customContent.flashcards||[]).filter(function(x){return String(x.mdkId)===String(courseId)&&String(x.topicId)===String(topicId)&&(!track||!x.track||x.track==="all"||x.track===track);});
    var bar=byId("tab-lectures")&&byId("tab-lectures").parentElement;
    flashcardContext=sets.length&&bar&&byId("topicContent")?{sets:sets,courseId:courseId,topicId:topicId}:null;
    if(!flashcardContext)return;
    var button=byId("tab-custom-flashcards");
    if(!button){button=document.createElement("button");button.id="tab-custom-flashcards";button.className="btn tab ghost";button.textContent="🃏 Карточки";bar.appendChild(button);}
    button.onclick=function(){window.switchTopicTab("custom-flashcards");};
    var oldSwitch=window.switchTopicTab;
    if(!oldSwitch||oldSwitch.__flashcardWrapped){if(activeTab==="custom-flashcards")window.switchTopicTab("custom-flashcards");return;}
    var wrapped=function(tab){
      if(tab!=="custom-flashcards")return oldSwitch.apply(this,arguments);
      var context=flashcardContext;if(!context)return;
      document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("active");x.classList.add("ghost");});
      var active=byId("tab-custom-flashcards");if(active){active.classList.add("active");active.classList.remove("ghost");}
      var area=byId("topicContent");if(!area)return;
      area.innerHTML=context.sets.map(function(set,i){return '<section class="module"><h3>'+esc(set.title)+'</h3><p>Карточек: '+((set.cards||[]).length)+'</p><button class="btn" data-start="'+i+'">Начать повторение</button></section>';}).join("");
      area.querySelectorAll("[data-start]").forEach(function(btn){btn.onclick=function(){
        var cards=context.sets[Number(btn.dataset.start)].cards||[],idx=0,flip=false;
        function draw(){if(!cards.length){area.textContent="В наборе нет карточек.";return;}var item=cards[idx];
          area.innerHTML='<section class="module" style="text-align:center"><p>'+(idx+1)+' / '+cards.length+'</p><button id="studentFlashcard" class="btn ghost" style="display:block;width:100%;min-height:160px;white-space:normal;font-size:24px">'+esc(flip?item.back:item.front)+'</button><p class="museum-muted">'+esc(flip?(item.transcription||""):"Нажмите, чтобы перевернуть")+'</p><button id="studentCardPrev" class="btn ghost" '+(idx===0?"disabled":"")+'>← Назад</button> <button id="studentCardFlip" class="btn">Перевернуть</button> <button id="studentCardNext" class="btn ghost" '+(idx===cards.length-1?"disabled":"")+'>Далее →</button></section>';
          byId("studentFlashcard").onclick=byId("studentCardFlip").onclick=function(){flip=!flip;draw();};
          byId("studentCardPrev").onclick=function(){idx=Math.max(0,idx-1);flip=false;draw();};
          byId("studentCardNext").onclick=function(){idx=Math.min(cards.length-1,idx+1);flip=false;draw();};
        }draw();
      };});
    };
    wrapped.__flashcardWrapped=true;window.switchTopicTab=wrapped;
    if(activeTab==="custom-flashcards")window.switchTopicTab("custom-flashcards");
  }
  window.enhanceTopicFlashcards=enhanceTopicFlashcards;
  var originalTopic=window.renderTopicPage;
  if(originalTopic)window.renderTopicPage=function(courseId,topicId,activeTab){
    originalTopic.apply(this,arguments);
    enhanceTopicFlashcards(courseId,topicId,activeTab);
  };
})();