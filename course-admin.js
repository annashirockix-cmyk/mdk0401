"use strict";
(function(){
  const COURSE_LABELS={"07.01":"МДК 07.01 (ЧПУ)","04.01":"МДК 04.01 (Диагностика)","02.01":"МДК 02.01 (Сборка)","02.02":"МДК 02.02 (Программирование)","MCAM":"Mastercam","MAT":"Материаловедение","MET":"Метрология","OT":"Охрана труда","PFI":"ПФИ","ENB":"Английский — базовый","ENT":"Английский — технический"};
  const PLUGINS=["MAT","MET","OT","PFI","ENB","ENT"];
  const allIds=Object.keys(COURSE_LABELS);
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const me=()=>window.state.staff||window.state.student||{};
  const role=()=>String(me().role||(window.state.staff&&window.state.staff.role)||"student").toLowerCase();
  const isAdmin=()=>role()==="admin";
  const isTeacher=()=>role()==="teacher"||isAdmin();
  const canCourse=id=>!isTeacher()||isAdmin()||(me().courses||[]).indexOf(id)>=0||((id==="ENB"||id==="ENT")&&(me().courses||[]).indexOf("EN")>=0);
  const accessible=()=>isAdmin()?allIds:(isTeacher()?Array.from(new Set((me().courses||[]).reduce((out,id)=>{if(id==="EN"){out.push("ENB","ENT");}else out.push(id);return out;},[]))):allIds);
  const isPlugin=id=>PLUGINS.indexOf(id)>=0;
  window.isStandaloneCourse=isPlugin;

  function updateCourseChrome(){
    const id=window.state.activeCourseId||"07.01", plugin=isPlugin(id);
    document.querySelectorAll('.drawer-item[href="#/admin"]').forEach(x=>x.style.display=isAdmin()?"flex":"none");
    document.querySelectorAll('.drawer-item[href="#/journal"]').forEach(x=>x.style.display=isTeacher()?"flex":"none");
    const xp=document.getElementById("xpCount"); if(xp) xp.style.display=plugin?"none":"";
    document.querySelectorAll('.drawer-item[href="#/shop"],.drawer-item[href="#/achievements"],.drawer-item[href="#/rating"],.drawer-item[href="#/training"]').forEach(x=>x.style.display=plugin?"none":"");
    document.querySelectorAll('.drawer-item[href="#/games"]').forEach(x=>x.style.display=(window.canRoleAccessGames&&window.canRoleAccessGames())?"flex":"none");
    document.querySelectorAll(".plugin-course-label").forEach(x=>x.remove());
    document.body.classList.toggle("standalone-course",plugin);
  }
  function filterCoursePicker(){
    const sel=document.getElementById("mdkSelector"); if(!sel)return;
    Array.from(sel.options).forEach(o=>{if(o.value) o.hidden=!!o.value&&!canCourse(o.value);});
    if(isTeacher()&&!canCourse(window.state.activeCourseId)){
      const first=accessible()[0];
      if(first){window.state.activeCourseId=first;sel.value=first;}
    }
  }
  const originalHome=window.renderHomePage;
  if(originalHome) window.renderHomePage=function(){
    filterCoursePicker();
    if(isTeacher()&&!accessible().length){
      const app=document.getElementById("app"); if(app)app.innerHTML='<div class="module"><h2>Доступ пока не назначен</h2><p>Администратор должен открыть вам одну или несколько дисциплин.</p></div>';
      return;
    }
    originalHome.apply(this,arguments);
    filterCoursePicker();
    const app=document.getElementById("app"),hero=app&&app.querySelector(".hero");
    if(!app||!hero)return;
    const buttons=Array.from(hero.querySelectorAll("button"));
    const hiddenButtons=buttons.filter(b=>allIds.some(id=>!canCourse(id)&&b.textContent.trim()===(window.MDK_DATA[id]&&window.MDK_DATA[id].shortName)));
    hiddenButtons.forEach(b=>b.remove());
    const pluginButtons=buttons.filter(b=>PLUGINS.some(id=>b.textContent.trim()===(window.MDK_DATA[id]&&window.MDK_DATA[id].shortName)));
    pluginButtons.forEach(b=>b.remove());
    const availablePlugins=PLUGINS.filter(id=>canCourse(id));
    if(availablePlugins.length){
      const panel=document.createElement("section");panel.className="module";
      panel.innerHTML='<h3>Подключаемые учебные курсы</h3><p style="color:var(--muted)">Самостоятельные дисциплины без игровых механик.</p><div style="display:flex;gap:10px;flex-wrap:wrap"></div>';
      const wrap=panel.querySelector("div");
      availablePlugins.forEach(id=>{
        const b=document.createElement("button");b.className="btn ghost";b.textContent=id==="MET"?"📏 ":((id==="MAT"||id==="PFI")?"📐 ":id.indexOf("EN")===0?"🇬🇧 ":"🦺 ")+COURSE_LABELS[id];
        b.onclick=function(){window.state.activeCourseId=id;window.saveStudentData();window.renderHomePage();};wrap.appendChild(b);
      });
      hero.insertAdjacentElement("afterend",panel);
    }
    if(isTeacher()){
      const b=document.createElement("a");b.href="#/course-editor";b.className="btn";b.style.margin="0 0 16px";b.textContent="✍️ Редактор курса и объявлений";
      const first=app.querySelector(".module");if(first)first.insertAdjacentElement("beforebegin",b);else app.appendChild(b);
    }
    updateCourseChrome();
  };

  
  function renderTeacherJournal(){
    const app=document.getElementById("app");if(!app)return;
    if(!isTeacher()){app.innerHTML='<div class="module">Раздел доступен преподавателям.</div>';return;}
    app.innerHTML='<a href="#/" class="backlink">← На главную</a><section class="hero"><h1>Журнал преподавателя</h1><p>Только результаты дисциплин, назначенных администратором</p></section><div class="module" id="courseResults">Загрузка результатов…</div>';
    const box=document.getElementById("courseResults");
    window.API.getResults({}).then(r=>{
      if(!r.success)throw new Error(r.error||"Ошибка загрузки");
      const rows=r.results||[];
      if(!rows.length){box.innerHTML="<p>По назначенным дисциплинам пока нет результатов.</p>";return;}
      box.innerHTML='<div style="overflow-x:auto"><table class="journal-table"><thead><tr><th>Студент</th><th>Дисциплина</th><th>Работа</th><th>Оценка</th><th>Результат</th><th>Дата</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(COURSE_LABELS[x.courseId]||x.courseId||"—")+'</td><td>'+esc(x.testTitle)+'</td><td><b>'+esc(x.grade)+'</b></td><td>'+esc(x.score)+' / '+esc(x.maxScore)+' ('+esc(x.percent)+'%)</td><td>'+esc(x.finishedAt)+'</td></tr>').join("")+'</tbody></table></div>';
    }).catch(e=>{box.textContent="Ошибка: "+e.message;});
  }
  window.renderTeacherJournalPage=window.renderJournalPage || renderTeacherJournal;

  const originalRouter=window.router;
  if(originalRouter)window.router=function(){
    const p=(location.hash||"").replace(/^#/,"").split("/").filter(Boolean);
    const id=p[0]==="topic"?p[1]:(window.state.activeCourseId||"07.01");
    if(isTeacher()&&!["account","login-help","links","games","course-editor","flashcard-editor"].includes(p[0])&&!canCourse(id)){
      window.showToast("Доступ к этой дисциплине закрыт администратором.","err");
      location.hash="#/";return;
    }
    if(isPlugin(window.state.activeCourseId)&&["shop","achievements","rating","training"].indexOf(p[0])>=0){
      location.hash="#/";updateCourseChrome();return;
    }
    if(isTeacher()&&!isAdmin()&&p[0]==="journal"){(window.renderJournalPage||renderTeacherJournal)();return;}
    if(p[0]==="course-editor"){window.renderCourseEditorPage();return;}
    if(p[0]==="flashcard-editor"&&window.renderFlashcardEditorPage){window.renderFlashcardEditorPage();return;}
    if(p[0]==="admin"&&!isAdmin()){
      const app=document.getElementById("app");if(app)app.innerHTML='<div class="module">Панель администратора доступна только администратору.</div>';return;
    }
    originalRouter.apply(this,arguments);updateCourseChrome();
  };

  window.renderAdminPanel=function(){
    const app=document.getElementById("app");if(!app)return;
    if(!isAdmin()){app.innerHTML='<div class="module">Доступ только администратору.</div>';return;}
    app.innerHTML='<a href="#/" class="backlink">← На главную</a><section class="hero"><h1>Администрирование портала</h1><p>Создание, изменение ролей, назначение дисциплин и удаление учётных записей</p></section>'+
      '<div class="module"><h3>➕ Добавить пользователя</h3><p style="color:var(--muted)">Создайте учётную запись вручную и передайте временный пароль пользователю безопасным способом.</p>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">'+
      '<input id="newUserName" class="self-input" placeholder="ФИО пользователя"><input id="newUserEmail" class="self-input" type="email" placeholder="Email для входа">'+
      '<input id="newUserGroup" class="self-input" placeholder="Группа (для студента)"><input id="newUserPassword" class="self-input" type="password" minlength="8" placeholder="Временный пароль (от 8 символов)">'+
      '<select id="newUserRole" class="self-input"><option value="student">Студент</option><option value="teacher">Преподаватель</option><option value="admin">Администратор</option></select></div>'+
      '<button class="btn" id="createPortalUser" style="margin-top:12px">Создать пользователя</button> <span id="createUserStatus" aria-live="polite"></span></div>'+
      '<div class="module" id="adminUsers">Загрузка списка пользователей…</div>'+
      '<div class="module"><h3>Редактор материалов</h3><p>Создание лекций, тестов и тем для дисциплин.</p><a class="btn" href="#/course-editor">Открыть редактор</a></div>';
    const box=document.getElementById("adminUsers"),status=document.getElementById("createUserStatus");
    function loadUsers(){
      box.textContent="Загрузка списка пользователей…";
      return window.API.getStudents().then(res=>{
        if(!res.success)throw new Error(res.error||"Не удалось получить пользователей.");
        const users=res.students||[];
        if(!users.length){box.innerHTML="<h3>Пользователи портала</h3><p>Пока нет пользователей.</p>";return;}
        box.innerHTML='<h3>Пользователи портала ('+users.length+')</h3><p style="color:var(--muted)">Изменение роли применяется после повторного входа. Удаление закрывает доступ, но сохраняет историю результатов тестов.</p>'+
          users.map(u=>{
            const email=String(u.email||""),ur=String(u.role||"student").toLowerCase(),active=String(u.courses||"").split(",").filter(Boolean);
            const self=email.toLowerCase()===String(me().email||"").toLowerCase();
            return '<div class="module" style="margin:12px 0;padding:14px"><div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap"><div><b>'+esc(u.name||email)+'</b><div style="font-size:12px;color:var(--muted)">'+esc(email)+'</div><div style="font-size:12px;color:var(--muted)">Группа: '+esc(u.group||"—")+'</div></div>'+
              '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label>Роль <select class="self-input user-role-select" data-user="'+esc(email)+'" style="min-width:145px"><option value="student" '+(ur==="student"?"selected":"")+'>Студент</option><option value="teacher" '+(ur==="teacher"?"selected":"")+'>Преподаватель</option><option value="admin" '+(ur==="admin"?"selected":"")+'>Администратор</option></select></label><button class="btn ghost save-user-role" data-user="'+esc(email)+'">Сохранить роль</button><button class="btn ghost delete-portal-user" data-user="'+esc(email)+'" '+(self?"disabled title='Нельзя удалить собственную учётную запись'":"")+' style="border-color:#b44;color:#e77">Удалить</button></div></div>'+
              (ur==="teacher"?'<div style="margin-top:14px"><b>Доступные дисциплины</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin:10px 0">'+allIds.map(id=>'<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="teacher-course" data-user="'+esc(email)+'" value="'+id+'" '+(active.includes(id)?"checked":"")+'>'+esc(COURSE_LABELS[id])+'</label>').join("")+'</div><button class="btn save-teacher-courses" data-user="'+esc(email)+'">Сохранить доступ к дисциплинам</button><span class="save-status" style="margin-left:10px"></span></div>':'')+
              '</div>';
          }).join("");
        box.querySelectorAll(".save-user-role").forEach(btn=>btn.onclick=function(){
          const email=btn.dataset.user,sel=box.querySelector('.user-role-select[data-user="'+CSS.escape(email)+'"]');btn.disabled=true;
          window.API.setUserRole(email,sel.value).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");window.showToast("Роль обновлена.","ok");return loadUsers();})
          .catch(e=>window.showToast(e.message,"err")).finally(()=>btn.disabled=false);
        });
        box.querySelectorAll(".save-teacher-courses").forEach(btn=>btn.onclick=function(){
          const email=btn.dataset.user,selected=Array.from(box.querySelectorAll('.teacher-course[data-user="'+CSS.escape(email)+'"]:checked')).map(x=>x.value),s=btn.parentElement.querySelector(".save-status");
          btn.disabled=true;s.textContent="Сохранение…";window.API.setTeacherCourses(email,selected).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");s.textContent="Сохранено ✓";}).catch(e=>s.textContent=e.message).finally(()=>btn.disabled=false);
        });
        box.querySelectorAll(".delete-portal-user").forEach(btn=>btn.onclick=function(){
          const email=btn.dataset.user;if(!confirm("Удалить учётную запись "+email+"? История результатов тестов останется. Действие нельзя отменить."))return;
          btn.disabled=true;window.API.adminDeleteUser(email).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");window.showToast("Пользователь удалён.","ok");return loadUsers();}).catch(e=>{window.showToast(e.message,"err");btn.disabled=false;});
        });
      });
    }
    if(!window.API||!window.API.adminCreateUser||!window.API.adminDeleteUser){box.textContent="API не подключён: обновите api.js и Code.gs.";return;}
    document.getElementById("createPortalUser").onclick=function(){
      const data={name:document.getElementById("newUserName").value.trim(),email:document.getElementById("newUserEmail").value.trim(),group:document.getElementById("newUserGroup").value.trim(),password:document.getElementById("newUserPassword").value,role:document.getElementById("newUserRole").value};
      const btn=this;if(!data.name||!data.email||data.password.length<8){status.textContent="Заполните ФИО, корректный email и пароль от 8 символов.";return;}
      btn.disabled=true;status.textContent="Создание…";window.API.adminCreateUser(data).then(r=>{if(!r.success)throw new Error(r.error||"Не удалось создать пользователя.");status.textContent="Создан пользователь: "+r.email;["newUserName","newUserEmail","newUserGroup","newUserPassword"].forEach(id=>document.getElementById(id).value="");return loadUsers();}).catch(e=>status.textContent=e.message).finally(()=>btn.disabled=false);
    };
    loadUsers().catch(e=>{box.textContent="Ошибка: "+e.message;});
  };

  function getTopics(courseId){
    const result=[];
    const c=window.MDK_DATA[courseId];
    if(c)(c.sections||[]).forEach(s=>(s.topics||[]).forEach(t=>result.push({id:t.id,title:(t.code||"")+" "+(t.title||"")})));
    (window.customContent.topics||[]).filter(t=>t.mdkId===courseId&&!t.sourceTopicId).forEach(t=>result.push({id:t.id,title:t.title}));
    return result;
  }
  function getBuiltInTopics(courseId){
    const result=[],course=window.MDK_DATA[courseId];
    if(course)(course.sections||[]).forEach(section=>(section.topics||[]).forEach(topic=>result.push(topic)));
    return result;
  }
  window.renderCourseEditorPage=function(){
    const app=document.getElementById("app");if(!app)return;
    if(!isTeacher()){app.innerHTML='<div class="module">Редактор доступен только преподавателю.</div>';return;}
    const ids=accessible();if(!ids.length){app.innerHTML='<div class="module">Администратор пока не назначил вам дисциплины.</div>';return;}
    const selected=canCourse(window.state.activeCourseId)?window.state.activeCourseId:ids[0];
    app.innerHTML='<a href="#/" class="backlink">← На главную</a>'+
      '<section class="hero"><h1>Редактор учебного курса</h1><p>Создание, просмотр, изменение и удаление учебных материалов. Изменения доступны только в назначенных дисциплинах.</p></section>'+
      '<div class="module"><label>Дисциплина</label><select id="editorCourse" class="self-input">'+ids.map(id=>'<option value="'+id+'" '+(id===selected?"selected":"")+'>'+esc(COURSE_LABELS[id])+'</option>').join("")+'</select></div>'+
      '<div class="module"><h3>1. Создать новую тему</h3><input id="newTopicCode" class="self-input" placeholder="Код темы, например Тема 12" style="margin:8px 0"><input id="newTopicTitle" class="self-input" placeholder="Название темы" style="margin:8px 0"><button class="btn" id="createTopicBtn">Создать тему</button> <span id="topicStatus" aria-live="polite"></span></div>'+
      '<div class="module"><h3>1а. Изменить основную тему</h3><p style="color:var(--muted)">Изменение кода и названия существующей темы без удаления исходных учебных материалов.</p><select id="mainTopicExisting" class="self-input"></select><input id="mainTopicCode" class="self-input" placeholder="Код темы" style="margin:8px 0"><input id="mainTopicTitle" class="self-input" placeholder="Название темы" style="margin:8px 0"><button class="btn" id="saveMainTopicBtn" type="button">Сохранить название основной темы</button> <span id="mainTopicStatus" aria-live="polite"></span></div>'+
      '<div class="module"><h3>2. Лекции</h3><p style="color:var(--muted)">Выберите существующую лекцию для изменения или создайте новую. Текст поддерживает простую HTML-разметку.</p>'+
      '<label>Тема</label><select id="lectureTopic" class="self-input"></select><label style="display:block;margin-top:8px">Существующая лекция</label><select id="lectureExisting" class="self-input"><option value="">— Новая лекция —</option></select>'+
      '<input id="lectureTitle" class="self-input" placeholder="Название лекции" style="margin:8px 0"><textarea id="lectureBody" class="self-input" rows="12" placeholder="Текст лекции: заголовки, абзацы, таблицы, списки." style="margin:8px 0"></textarea>'+
      '<button class="btn" id="saveLectureBtn">Создать лекцию</button> <button class="btn ghost" id="resetLectureBtn" type="button">Очистить форму</button> <button class="btn ghost" id="deleteLectureBtn" type="button" disabled>Удалить выбранную</button> <span id="lectureStatus" aria-live="polite"></span></div>'+
      '<div class="module"><h3>3. Дополнительные тесты</h3><p style="color:var(--muted)">Можно создавать тесты, загружать ранее сохранённые тесты для изменения, просматривать формулировки всех заданий и правильные ответы.</p>'+
      '<label>Тема</label><select id="testTopic" class="self-input"></select><label style="display:block;margin-top:8px">Существующий тест</label><select id="testExisting" class="self-input"><option value="">— Новый тест —</option></select>'+
      '<input id="testTitle" class="self-input" placeholder="Название теста" style="margin:8px 0"><div id="questionDrafts"></div>'+
      '<div class="module" style="padding:12px;margin:12px 0"><h4>Добавить / изменить вопрос</h4><textarea id="qText" class="self-input" rows="2" placeholder="Текст вопроса"></textarea><div id="ceQuestionImagePanel"></div>'+
      '<input id="qA" class="self-input" placeholder="Вариант А" style="margin-top:6px"><input id="qB" class="self-input" placeholder="Вариант Б" style="margin-top:6px"><input id="qC" class="self-input" placeholder="Вариант В" style="margin-top:6px"><input id="qD" class="self-input" placeholder="Вариант Г" style="margin-top:6px">'+
      '<label>Правильный ответ</label><select id="qCorrect" class="self-input"><option value="0">А</option><option value="1">Б</option><option value="2">В</option><option value="3">Г</option></select>'+
      '<button class="btn ghost" id="addQuestionBtn" style="margin-top:10px">Добавить вопрос в тест</button> <button class="btn ghost" id="cancelQuestionEditBtn" type="button">Отмена изменения вопроса</button></div>'+
      '<button class="btn" id="saveTestBtn">Создать тест</button> <button class="btn ghost" id="resetTestBtn" type="button">Новый тест</button> <button class="btn ghost" id="deleteTestBtn" type="button" disabled>Удалить выбранный тест</button> <button class="btn ghost" id="previewTestBtn" type="button">Просмотреть задания и ответы</button> <span id="testStatus" aria-live="polite"></span><div id="testPreview" style="margin-top:12px"></div></div>'+
      '<div class="module"><h3>4. Редактирование основных экзаменов</h3><p style="color:var(--muted)">Здесь редактируются защищённые банки вопросов основного и дополнительного экзамена. Формат — JSON-массив объектов с questionId и question. Перед заменой сервер автоматически сохраняет резервную копию.</p><label>Банк вопросов</label><select id="examBankId" class="self-input"><option value="exam_primary">Основной экзамен · exam_primary</option><option value="exam_extra">Дополнительный экзамен · exam_extra</option><option value="mdk_extra">Дополнительный банк · mdk_extra</option></select><div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0"><button class="btn ghost" id="loadExamBankBtn" type="button">Загрузить текущий банк</button><button class="btn" id="saveExamBankBtn" type="button">Сохранить банк с резервной копией</button></div><textarea id="examBankJson" class="self-input" rows="14" spellcheck="false" placeholder="JSON-массив объектов с полями questionId и question" style="width:100%;font-family:monospace"></textarea><div id="examBankStatus" aria-live="polite"></div></div>'+
      '<div class="module"><h3>5. Сохранённые материалы темы</h3><p style="color:var(--muted)">Список обновляется после сохранения. Выберите тему выше, чтобы увидеть её лекции и тесты.</p><div id="savedMaterials">Загрузка материалов…</div></div>';
    const courseSel=document.getElementById("editorCourse"),topicSel=document.getElementById("lectureTopic"),testSel=document.getElementById("testTopic"),mainTopicSel=document.getElementById("mainTopicExisting"),examBankSel=document.getElementById("examBankId");
    let lectureId="",testId="",draft=[],editingQuestion=-1,builtInLectureIndex=null;
    const $=id=>document.getElementById(id);
    function refreshContent(done){
      const pageToken=$("editorCourse");
      if(window.loadGlobalCustomContent)window.loadGlobalCustomContent(function(){
        // Ignore a stale callback after route change or a newer editor instance.
        if(!pageToken||document.getElementById("editorCourse")!==pageToken)return;
        renderSaved();if(done)done();
      });else{renderSaved();if(done)done();}
    }
    function topics(){return getTopics(courseSel.value);}
    function records(type,topicId){const key=type==="lecture"?"lectures":"tests";return (window.customContent[key]||[]).filter(x=>x.mdkId===courseSel.value&&x.topicId===topicId);}
    function loadMainTopic(){
      const topic=getBuiltInTopics(courseSel.value).find(x=>String(x.id)===String(mainTopicSel.value));
      const override=(window.customContent.topics||[]).find(x=>x.mdkId===courseSel.value&&String(x.sourceTopicId||"")===String(mainTopicSel.value));
      $("mainTopicCode").value=override&&override.code||topic&&topic.code||"";
      $("mainTopicTitle").value=override&&override.title||topic&&topic.title||"";
    }
    function getBuiltInTopic(topicId){return getBuiltInTopics(courseSel.value).find(x=>String(x.id)===String(topicId));}
    function getBuiltInLectures(topic){return topic?(Array.isArray(topic.__originalLectures)?topic.__originalLectures:(topic.lectures||[])):[];}
    async function loadExamBank(){
      const status=$("examBankStatus"),btn=$("loadExamBankBtn");btn.disabled=true;status.textContent="Загрузка защищённого банка…";
      try{
        const result=await window.API.getQuestionBank(courseSel.value,examBankSel.value);
        if(!result||!result.success)throw new Error(result&&result.error||"Не удалось загрузить банк.");
        const rows=(result.questions||[]).map(x=>({questionId:x.questionId,question:x.question}));
        $("examBankJson").value=JSON.stringify(rows,null,2);
        status.textContent="Загружено заданий: "+rows.length+". Ключи ответов доступны только в этом редакторе преподавателя.";
      }catch(error){status.textContent=error.message||"Ошибка загрузки.";}
      finally{btn.disabled=false;}
    }
    async function saveExamBank(){
      const status=$("examBankStatus"),btn=$("saveExamBankBtn");let questions;
      try{questions=JSON.parse($("examBankJson").value);}catch(error){status.textContent="Проверьте JSON: "+error.message;return;}
      if(!Array.isArray(questions)){status.textContent="Нужен JSON-массив заданий.";return;}
      if(!confirm("Сохранить "+questions.length+" заданий в банке «"+examBankSel.value+"»? Перед заменой будет создана резервная копия."))return;
      btn.disabled=true;status.textContent="Сохранение и резервное копирование…";
      try{
        const result=await window.API.saveQuestionBank(courseSel.value,examBankSel.value,questions);
        if(!result||!result.success)throw new Error(result&&result.error||"Не удалось сохранить банк.");
        status.textContent="Сохранено: "+result.questionsSaved+". Резервная копия: "+result.backupId;
        await loadExamBank();
      }catch(error){status.textContent=error.message||"Ошибка сохранения.";}
      finally{btn.disabled=false;}
    }
    function fillTopics(){
      const opts=topics().map(t=>'<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>').join("");
      topicSel.innerHTML=opts;testSel.innerHTML=opts;
      mainTopicSel.innerHTML=getBuiltInTopics(courseSel.value).map(t=>'<option value="'+esc(t.id)+'">'+esc(t.code+" "+t.title)+'</option>').join("");
      loadMainTopic();
      renderSaved();
    }
    function renderSaved(){
      // The content request may finish after the teacher has navigated away.
      // Never update elements belonging to a page that is no longer mounted.
      const required=["lectureExisting","testExisting","savedMaterials","lectureTopic","testTopic"];
      if(document.getElementById("editorCourse")!==courseSel||required.some(id=>!$(id)))return;
      const lectureTopicId=topicSel.value,testTopicId=testSel.value;
      const ls=records("lecture",lectureTopicId),ts=records("test",testTopicId);
      const fs=(window.customContent.flashcards||[]).filter(x=>x.mdkId===courseSel.value&&x.topicId===lectureTopicId);
      const builtInTopic=getBuiltInTopic(lectureTopicId),builtInLectures=getBuiltInLectures(builtInTopic);
      const additionalLectures=ls.filter(x=>x.isBuiltInOverride!==true);
      $("lectureExisting").innerHTML='<option value="">— Новая дополнительная лекция —</option>'+builtInLectures.map((x,i)=>'<option value="builtin:'+i+'">Основная: '+esc(x.code||"")+' '+esc(x.title||"")+'</option>').join("")+additionalLectures.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title)+'</option>').join("");
      $("testExisting").innerHTML='<option value="">— Новый тест —</option>'+ts.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title)+' ('+((x.questions||[]).length)+' вопр.)</option>').join("");
      $("savedMaterials").innerHTML='<h4>Лекции ('+ls.length+')</h4>'+(ls.length?ls.map(x=>'<div style="padding:8px;border-bottom:1px solid var(--border)"><b>'+esc(x.title)+'</b> <button class="btn ghost pick-lecture" data-id="'+esc(x.id)+'">Открыть для изменения</button></div>').join(""):'<p>Лекций пока нет.</p>')+
        '<h4 style="margin-top:16px">Тесты ('+ts.length+')</h4>'+(ts.length?ts.map(x=>'<div style="padding:8px;border-bottom:1px solid var(--border)"><b>'+esc(x.title)+'</b> · '+((x.questions||[]).length)+' заданий <button class="btn ghost pick-test" data-id="'+esc(x.id)+'">Открыть / просмотреть</button></div>').join(""):'<p>Тестов пока нет.</p>')+
        '<h4 style="margin-top:16px">Карточки ('+fs.length+')</h4>'+(fs.length?fs.map(x=>'<div style="padding:8px;border-bottom:1px solid var(--border)"><b>'+esc(x.title)+'</b> · '+((x.cards||[]).length)+' карточек · '+esc(x.track||"all")+' <button class="btn ghost pick-flashcards" data-id="'+esc(x.id)+'">Открыть конструктор</button></div>').join(""):'<p>Наборов карточек пока нет.</p>');
      $("savedMaterials").querySelectorAll(".pick-lecture").forEach(b=>b.onclick=()=>{ $("lectureExisting").value=b.dataset.id;loadLecture();});
      $("savedMaterials").querySelectorAll(".pick-test").forEach(b=>b.onclick=()=>{ $("testExisting").value=b.dataset.id;loadTest();$("previewTestBtn").click();});
      $("savedMaterials").querySelectorAll(".pick-flashcards").forEach(b=>b.onclick=()=>{window.state.activeCourseId=courseSel.value;if(window.saveStudentData)window.saveStudentData();location.hash="#/flashcard-editor";});
    }
    function resetLecture(){
      lectureId="";builtInLectureIndex=null;$("lectureExisting").value="";$("lectureTitle").value="";$("lectureBody").value="";
      $("saveLectureBtn").textContent="Создать дополнительную лекцию";$("deleteLectureBtn").disabled=true;$("lectureStatus").textContent="";
    }
    function loadLecture(){
      const id=$("lectureExisting").value;if(!id){resetLecture();return;}
      if(id.indexOf("builtin:")===0){
        const index=Number(id.slice(8)),topic=getBuiltInTopic(topicSel.value),base=getBuiltInLectures(topic)[index];
        if(!base||!Number.isInteger(index)){resetLecture();return;}
        const override=records("lecture",topicSel.value).find(x=>x.isBuiltInOverride===true&&String(x.sourceLectureCode||"")===String(base.code||""));
        builtInLectureIndex=index;lectureId=override?override.id:"";
        $("lectureTitle").value=override&&override.title||base.title||"";
        $("lectureBody").value=override&&override.content||base.content||"";
        $("saveLectureBtn").textContent="Сохранить основную лекцию";
        $("deleteLectureBtn").disabled=!override;
        $("lectureStatus").textContent=override?"Загружена изменённая основная лекция.":"Открыта исходная лекция. Сохранение создаст её редакцию.";
        return;
      }
      builtInLectureIndex=null;
      const item=records("lecture",topicSel.value).find(x=>String(x.id)===id);if(!item)return;
      lectureId=item.id;$("lectureTitle").value=item.title||"";$("lectureBody").value=item.content||"";
      $("saveLectureBtn").textContent="Сохранить изменения лекции";$("deleteLectureBtn").disabled=false;$("lectureStatus").textContent="Загружена дополнительная лекция для изменения.";
    }
    function clearQuestionForm(){$("qText").value="";["qA","qB","qC","qD"].forEach(id=>$(id).value="");$("qCorrect").value="0";if($("ceQuestionType"))$("ceQuestionType").value="single";if($("ceCorrectSet"))$("ceCorrectSet").value="";if($("ceExtra"))$("ceExtra").value="";if($("ceFeedback"))$("ceFeedback").value="";editingQuestion=-1;window.__ceEditingQuestionIndex=null;window.__ceCurrentQuestionImage=null;if(window.__ceRenderQuestionImage)window.__ceRenderQuestionImage();$("addQuestionBtn").textContent="Добавить вопрос в тест";}
    function drawDraft(){
      $("questionDrafts").innerHTML='<h4>Задания теста ('+draft.length+')</h4>'+(draft.length?draft.map((q,i)=>{const matching=q.kind==="matching"||q.kind==="match",ordering=q.kind==="order"||q.kind==="ordering";const detail=matching?'<ul>'+(q.pairs||[]).map(pair=>'<li>'+esc(pair.left)+' → '+esc(pair.right)+'</li>').join("")+'</ul>':ordering?'<ol>'+(q.items||[]).map(item=>'<li>'+esc(item)+'</li>').join("")+'</ol>':'<ol type="A">'+(q.options||[]).map((o,j)=>'<li>'+esc(o)+(j===+q.correct?' <b>— правильный ответ</b>':'')+'</li>').join("")+'</ol>';return '<div class="module" style="padding:10px;margin:8px 0"><b>'+(i+1)+'. '+esc(q.q)+'</b>'+(q.imageData?'<img src="'+esc(q.imageData)+'" alt="Иллюстрация к вопросу" style="display:block;max-width:100%;max-height:220px;object-fit:contain;margin:8px 0;border-radius:8px">':'')+detail+'<button class="btn ghost edit-q" data-i="'+i+'">Изменить</button> <button class="btn ghost remove-q" data-i="'+i+'">Удалить</button></div>';}).join(""):'<p>Добавьте первый вопрос.</p>');
      $("questionDrafts").querySelectorAll(".edit-q").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,q=draft[i];window.__ceEditingQuestionIndex=i;$("qText").value=q.q;["qA","qB","qC","qD"].forEach((id,j)=>$(id).value=q.options[j]||"");$("qCorrect").value=String(q.correct);if($("ceQuestionType")){$("ceQuestionType").value=q.kind||q.type||"single";$("ceQuestionType").dispatchEvent(new Event("change"));}if($("ceCorrectSet"))$("ceCorrectSet").value=(q.correctAnswers||[]).map(n=>["A","B","C","D"][Number(n)]||"").filter(Boolean).join(", ");if($("ceExtra"))$("ceExtra").value=q.extra||"";if($("ceFeedback"))$("ceFeedback").value=q.feedback||"";window.__ceCurrentQuestionImage=q.imageRef?{imageRef:q.imageRef,imageData:q.imageData||""}:null;if(window.__ceRenderQuestionImage)window.__ceRenderQuestionImage();editingQuestion=i;$("addQuestionBtn").textContent="Сохранить вопрос";});
      $("questionDrafts").querySelectorAll(".remove-q").forEach(b=>b.onclick=()=>{draft.splice(+b.dataset.i,1);if(editingQuestion===+b.dataset.i)clearQuestionForm();drawDraft();});
    }
    function resetTest(){
      testId="";draft=[];editingQuestion=-1;$("testExisting").value="";$("testTitle").value="";$("testPreview").innerHTML="";
      $("saveTestBtn").textContent="Создать тест";$("deleteTestBtn").disabled=true;$("testStatus").textContent="";clearQuestionForm();drawDraft();
    }
    function loadTest(){
      const id=$("testExisting").value;if(!id){resetTest();return;}
      const item=records("test",testSel.value).find(x=>String(x.id)===id);if(!item)return;
      testId=item.id;draft=(item.questions||[]).map(q=>({q:q.q,options:(q.options||[]).slice(),items:Array.isArray(q.items)?q.items.map(String):[],correctOrder:Array.isArray(q.correctOrder)?q.correctOrder.map(String):[],pairs:Array.isArray(q.pairs)?q.pairs.map(pair=>({left:pair.left||"",right:pair.right||""})):[],correct:Number(q.correct)||0,imageRef:q.imageRef||"",imageData:q.imageData||"",kind:q.kind||q.type||"single",correctAnswers:Array.isArray(q.correctAnswers)?q.correctAnswers.slice():[],extra:q.extra||"",feedback:q.feedback||""}));window.__ceQuestionMeta=draft.map(q=>({kind:q.kind,correctAnswers:q.correctAnswers,pairs:q.pairs,items:q.items,extra:q.extra,feedback:q.feedback}));if($("ceVariantCount"))$("ceVariantCount").value=String(item.variantCount||1);if($("ceShuffleQuestions"))$("ceShuffleQuestions").value=item.questionOrder||"fixed";if($("ceShuffleOptions"))$("ceShuffleOptions").value=item.optionOrder||"fixed";
      $("testTitle").value=item.title||"";$("saveTestBtn").textContent="Сохранить изменения теста";$("deleteTestBtn").disabled=false;
      $("testStatus").textContent="Загружен тест. Можно изменять вопросы и варианты ответов.";drawDraft();
    }
    function previewTest(){
      const title=$("testTitle").value.trim()||"Предварительный просмотр теста";
      $("testPreview").innerHTML='<h3>'+esc(title)+' — просмотр заданий</h3>'+(draft.length?draft.map((q,i)=>{const matching=q.kind==="matching"||q.kind==="match",ordering=q.kind==="order"||q.kind==="ordering";const detail=matching?'<ul>'+(q.pairs||[]).map(pair=>'<li>'+esc(pair.left)+' → '+esc(pair.right)+'</li>').join("")+'</ul>':ordering?'<ol>'+(q.items||[]).map(item=>'<li>'+esc(item)+'</li>').join("")+'</ol>':'<ol type="A">'+(q.options||[]).map((o,j)=>'<li>'+esc(o)+(j===+q.correct?' <b style="color:var(--accent)">✓ Правильный ответ</b>':'')+'</li>').join("")+'</ol>';return '<div class="module" style="padding:12px;margin:8px 0"><b>Задание '+(i+1)+'. '+esc(q.q)+'</b>'+(q.imageData?'<img src="'+esc(q.imageData)+'" alt="Иллюстрация к вопросу" style="display:block;max-width:100%;max-height:280px;object-fit:contain;margin:10px 0;border-radius:8px">':'')+detail+'</div>';}).join(""):'<p>В тесте пока нет заданий.</p>');
    }
    fillTopics();
    courseSel.onchange=()=>{resetLecture();resetTest();fillTopics();loadExamBank();};
    mainTopicSel.onchange=loadMainTopic;
    $("saveMainTopicBtn").onclick=async function(){
      const topic=getBuiltInTopics(courseSel.value).find(x=>String(x.id)===String(mainTopicSel.value)),status=$("mainTopicStatus");
      const code=$("mainTopicCode").value.trim(),title=$("mainTopicTitle").value.trim();
      if(!topic||!code||!title){status.textContent="Выберите основную тему и заполните код и название.";return;}
      this.disabled=true;status.textContent="Сохранение…";
      try{
        const id="topic-override-"+courseSel.value+"-"+topic.id;
        const result=await window.API.saveCustomContent({id:id,mdkId:courseSel.value,type:"topic",sourceTopicId:topic.id,code:code,title:title,content:""});
        if(!result||!result.success)throw new Error(result&&result.error||"Не удалось сохранить тему.");
        await new Promise(resolve=>refreshContent(resolve));fillTopics();mainTopicSel.value=topic.id;loadMainTopic();status.textContent="Основная тема обновлена ✓";
      }catch(error){status.textContent=error.message||"Ошибка сохранения.";}
      finally{this.disabled=false;}
    };
    $("loadExamBankBtn").onclick=loadExamBank;
    $("saveExamBankBtn").onclick=saveExamBank;
    examBankSel.onchange=loadExamBank;
    topicSel.onchange=()=>{resetLecture();renderSaved();};
    testSel.onchange=()=>{resetTest();renderSaved();};
    $("lectureExisting").onchange=loadLecture;
    $("testExisting").onchange=loadTest;
    $("resetLectureBtn").onclick=resetLecture;
    $("resetTestBtn").onclick=resetTest;
    $("cancelQuestionEditBtn").onclick=clearQuestionForm;
    $("createTopicBtn").onclick=function(){
      const code=$("newTopicCode").value.trim(),title=$("newTopicTitle").value.trim(),status=$("topicStatus");
      if(!code||!title){status.textContent="Заполните код и название.";return;}
      const id="custom-"+Date.now();status.textContent="Сохранение…";
      window.API.saveCustomContent({id:id,mdkId:courseSel.value,type:"topic",title:code+" "+title,content:"",code:code}).then(r=>{
        if(!r.success)throw new Error(r.error||"Ошибка");return window.loadGlobalCustomContent?new Promise(resolve=>window.loadGlobalCustomContent(resolve)):null;
      }).then(()=>{fillTopics();topicSel.value=id;testSel.value=id;renderSaved();status.textContent="Тема создана ✓";$("newTopicCode").value="";$("newTopicTitle").value="";}).catch(e=>status.textContent=e.message);
    };
    $("saveLectureBtn").onclick=function(){
      const topicId=topicSel.value,title=$("lectureTitle").value.trim(),content=$("lectureBody").value.trim(),status=$("lectureStatus");
      if(!topicId||!title||!content){status.textContent="Выберите тему и заполните название и текст.";return;}
      const sourceIndex=builtInLectureIndex,base=sourceIndex!==null?getBuiltInLectures(getBuiltInTopic(topicId))[sourceIndex]:null;
      const slug=base?String(base.code||sourceIndex).replace(/[^A-Za-z0-9._-]/g,"-"):"";
      const id=lectureId||(base?("lec-override-"+courseSel.value+"-"+topicId+"-"+slug):("lec-"+Date.now()));
      const payload={id:id,mdkId:courseSel.value,topicId:topicId,type:"lecture",title:title,code:base?base.code:"Доп. лекция",content:content};
      if(base){payload.isBuiltInOverride=true;payload.sourceLectureCode=base.code;}
      status.textContent="Сохранение…";
      window.API.saveCustomContent(payload).then(r=>{
        if(!r.success)throw new Error(r.error||"Ошибка сохранения");
        lectureId=id;return new Promise(resolve=>refreshContent(resolve));
      }).then(()=>{
        $("lectureExisting").value=sourceIndex!==null?("builtin:"+sourceIndex):id;
        $("saveLectureBtn").textContent=sourceIndex!==null?"Сохранить основную лекцию":"Сохранить изменения лекции";
        $("deleteLectureBtn").disabled=false;status.textContent=sourceIndex!==null?"Основная лекция обновлена ✓":"Дополнительная лекция сохранена ✓";
      }).catch(e=>status.textContent=e.message);
    };
    $("deleteLectureBtn").onclick=function(){
      if(!lectureId||!confirm("Удалить выбранную лекцию?"))return;
      const id=lectureId;$("lectureStatus").textContent="Удаление…";
      window.API.deleteCustomContent(id,courseSel.value).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка удаления");resetLecture();return new Promise(resolve=>refreshContent(resolve));}).then(()=>$("lectureStatus").textContent="Лекция удалена.").catch(e=>$("lectureStatus").textContent=e.message);
    };
    $("addQuestionBtn").onclick=function(){
      const q=$("qText").value.trim(),enteredOptions=["qA","qB","qC","qD"].map(id=>$(id).value.trim()),correct=Number($("qCorrect").value);
      const image=window.__ceCurrentQuestionImage;const meta=window.__ceQuestionMeta&&window.__ceQuestionMeta[editingQuestion>=0?editingQuestion:draft.length]||{};const matching=meta.kind==="matching"||meta.kind==="match",ordering=meta.kind==="order"||meta.kind==="ordering";const pairs=Array.isArray(meta.pairs)?meta.pairs:[],items=Array.isArray(meta.items)?meta.items:[];const options=matching?pairs.map(pair=>pair.right):ordering?[]:enteredOptions;
      if(!q||(!matching&&!ordering&&options.some(x=>!x))||(matching&&(pairs.length<2||pairs.some(pair=>!pair.left||!pair.right)))||(ordering&&(items.length<2||items.some(x=>!x)||new Set(items).size!==items.length))){window.showToast(matching?"Для соответствия добавьте минимум две пары.":ordering?"Введите минимум два непустых разных элемента последовательности — каждый с новой строки.":"Заполните вопрос и все четыре варианта ответа.","err");return;}
      if((meta.kind==="multi"||meta.kind==="multiple"||meta.kind==="multiple_choice")&&(!Array.isArray(meta.correctAnswers)||meta.correctAnswers.length<2)){window.showToast("Для множественного выбора отметьте минимум два правильных варианта (например, А, В).","err");return;}const item={q:q,options:options,items:ordering?items:[],correctOrder:ordering?items.slice():[],correct:correct,pairs:matching?pairs:[],imageRef:image&&image.imageRef||"",imageData:image&&image.imageData||"",kind:meta.kind||"single",correctAnswers:meta.correctAnswers||[],extra:meta.extra||"",feedback:meta.feedback||""};
      if(editingQuestion>=0)draft[editingQuestion]=item;else draft.push(item);
      clearQuestionForm();drawDraft();
    };
    $("previewTestBtn").onclick=previewTest;
    $("saveTestBtn").onclick=function(){
      const topicId=testSel.value,title=$("testTitle").value.trim(),status=$("testStatus");
      if(!topicId||!title||!draft.length){status.textContent="Укажите тему, название и добавьте хотя бы один вопрос.";return;}
      const id=testId||("test-"+Date.now());status.textContent="Сохранение…";
      window.API.saveCustomContent({id:id,mdkId:courseSel.value,topicId:topicId,type:"test",title:title,questions:draft.map(q=>({q:q.q,options:(q.options||[]).slice(),items:Array.isArray(q.items)?q.items.slice():[],correctOrder:Array.isArray(q.correctOrder)?q.correctOrder.slice():[],pairs:Array.isArray(q.pairs)?q.pairs.map(pair=>({left:pair.left,right:pair.right})):[],correct:q.correct,imageRef:q.imageRef||"",kind:q.kind||"single",type:q.kind||"single",correctAnswers:q.correctAnswers||[],extra:q.extra||"",feedback:q.feedback||""})),variantCount:$("ceVariantCount")?Number($("ceVariantCount").value)||1:1,questionOrder:$("ceShuffleQuestions")?$("ceShuffleQuestions").value:"fixed",optionOrder:$("ceShuffleOptions")?$("ceShuffleOptions").value:"fixed"}).then(r=>{
        if(!r.success)throw new Error(r.error||"Ошибка сохранения");
        testId=id;return new Promise(resolve=>refreshContent(resolve));
      }).then(()=>{$("testExisting").value=id;$("saveTestBtn").textContent="Сохранить изменения теста";$("deleteTestBtn").disabled=false;status.textContent="Тест сохранён ✓ ("+draft.length+" заданий)";previewTest();}).catch(e=>status.textContent=e.message);
    };
    $("deleteTestBtn").onclick=function(){
      if(!testId||!confirm("Удалить выбранный тест? Результаты студентов в журнале сохранятся."))return;
      const id=testId;$("testStatus").textContent="Удаление…";
      window.API.deleteCustomContent(id,courseSel.value).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка удаления");resetTest();return new Promise(resolve=>refreshContent(resolve));}).then(()=>$("testStatus").textContent="Тест удалён.").catch(e=>$("testStatus").textContent=e.message);
    };
    drawDraft();
    refreshContent();
    loadExamBank();
  };

  document.addEventListener("DOMContentLoaded",function(){filterCoursePicker();updateCourseChrome();});
  console.log("[course-admin] modular courses, permissions and content editor loaded");
})();