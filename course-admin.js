"use strict";
(function(){
  const COURSE_LABELS={"07.01":"МДК 07.01 (ЧПУ)","04.01":"МДК 04.01 (Диагностика)","02.01":"МДК 02.01 (Сборка)","02.02":"МДК 02.02 (Программирование)","MCAM":"Mastercam","MAT":"Материаловедение","OT":"Охрана труда"};
  const PLUGINS=["MAT","OT"];
  const allIds=Object.keys(COURSE_LABELS);
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const me=()=>window.state.staff||window.state.student||{};
  const role=()=>String(me().role||(window.state.staff&&window.state.staff.role)||"student").toLowerCase();
  const isAdmin=()=>role()==="admin";
  const isTeacher=()=>role()==="teacher"||isAdmin();
  const canCourse=id=>!isTeacher()||isAdmin()||(me().courses||[]).indexOf(id)>=0;
  const accessible=()=>isAdmin()?allIds:(isTeacher()?(me().courses||[]):allIds);
  const isPlugin=id=>PLUGINS.indexOf(id)>=0;
  window.isStandaloneCourse=isPlugin;

  function updateCourseChrome(){
    const id=window.state.activeCourseId||"07.01", plugin=isPlugin(id);
    const xp=document.getElementById("xpCount"); if(xp) xp.style.display=plugin?"none":"";
    document.querySelectorAll('.drawer-item[href="#/shop"],.drawer-item[href="#/achievements"],.drawer-item[href="#/rating"],.drawer-item[href="#/training"]').forEach(x=>x.style.display=plugin?"none":"");
    document.querySelectorAll('.drawer-item[href="#/games"]').forEach(x=>x.style.display="none");
    document.querySelectorAll(".plugin-course-label").forEach(x=>x.remove());
    document.body.classList.toggle("standalone-course",plugin);
  }
  function filterCoursePicker(){
    const sel=document.getElementById("mdkSelector"); if(!sel)return;
    Array.from(sel.options).forEach(o=>{if(o.value) o.hidden=!canCourse(o.value);});
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
        const b=document.createElement("button");b.className="btn ghost";b.textContent=(id==="MAT"?"📐 ":"🦺 ")+COURSE_LABELS[id];
        b.onclick=function(){window.state.activeCourseId=id;window.saveStudentData();window.renderHomePage();};wrap.appendChild(b);
      });
      hero.insertAdjacentElement("afterend",panel);
    }
    if(isTeacher()){
      const b=document.createElement("a");b.href="#/course-editor";b.className="btn";b.style.margin="0 0 16px";b.textContent="✍️ Редактор лекций и тестов";
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
  window.renderTeacherJournalPage=renderTeacherJournal;
  window.renderCourseReportsPage=renderTeacherJournal;

  const originalRouter=window.router;
  if(originalRouter)window.router=function(){
    const p=(location.hash||"").replace(/^#/,"").split("/").filter(Boolean);
    const id=p[0]==="topic"?p[1]:(window.state.activeCourseId||"07.01");
    if(isTeacher()&&!canCourse(id)){
      window.showToast("Доступ к этой дисциплине закрыт администратором.","err");
      location.hash="#/";return;
    }
    if(isPlugin(window.state.activeCourseId)&&["games","shop","achievements","rating","training"].indexOf(p[0])>=0){
      location.hash="#/";updateCourseChrome();return;
    }
    if(isTeacher()&&!isAdmin()&&(p[0]==="journal"||p[0]==="reports")){renderTeacherJournal();return;}
    if(p[0]==="course-editor"){window.renderCourseEditorPage();return;}
    if(p[0]==="admin"&&!isAdmin()){
      const app=document.getElementById("app");if(app)app.innerHTML='<div class="module">Панель администратора доступна только администратору.</div>';return;
    }
    originalRouter.apply(this,arguments);updateCourseChrome();
  };

  window.renderAdminPanel=function(){
    const app=document.getElementById("app");if(!app)return;
    if(!isAdmin()){app.innerHTML='<div class="module">Доступ только администратору.</div>';return;}
    app.innerHTML='<a href="#/" class="backlink">← На главную</a><section class="hero"><h1>Управление доступом</h1><p>Назначение дисциплин преподавателям</p></section><div class="module" id="adminTeachers">Загрузка списка пользователей…</div><div class="module"><h3>Редактор материалов</h3><p>Создание лекций, тестов и тем для назначенных дисциплин.</p><a class="btn" href="#/course-editor">Открыть редактор</a></div>';
    const box=document.getElementById("adminTeachers");
    if(!window.API||!window.API.getStudents){box.textContent="API не подключён.";return;}
    window.API.getStudents().then(res=>{
      if(!res.success)throw new Error(res.error||"Не удалось получить пользователей.");
      const teachers=(res.students||[]).filter(u=>String(u.role).toLowerCase()==="teacher");
      if(!teachers.length){box.innerHTML="<p>Учётные записи преподавателей не найдены.</p>";return;}
      box.innerHTML='<h3>Доступ преподавателей к предметам</h3><p style="color:var(--muted)">Снимите отметку, чтобы закрыть преподавателю доступ к дисциплине. Изменения применяются после повторного входа.</p>'+teachers.map((u,i)=>{
        const active=String(u.courses||"").split(",").filter(Boolean);
        return '<div class="module" style="margin:12px 0;padding:14px"><b>'+esc(u.name||u.email)+'</b><div style="font-size:12px;color:var(--muted)">'+esc(u.email)+'</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin:12px 0">'+allIds.map(id=>'<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="teacher-course" data-user="'+esc(u.email)+'" value="'+id+'" '+(active.includes(id)?"checked":"")+'>'+esc(COURSE_LABELS[id])+'</label>').join("")+'</div><button class="btn save-teacher-courses" data-user="'+esc(u.email)+'">Сохранить доступ</button><span class="save-status" style="margin-left:10px"></span></div>';
      }).join("");
      box.querySelectorAll(".save-teacher-courses").forEach(btn=>btn.onclick=function(){
        const email=btn.dataset.user, selected=Array.from(box.querySelectorAll('.teacher-course[data-user="'+CSS.escape(email)+'"]:checked')).map(x=>x.value);
        const status=btn.parentElement.querySelector(".save-status");btn.disabled=true;status.textContent="Сохранение…";
        window.API.setTeacherCourses(email,selected).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");status.textContent="Сохранено ✓";}).catch(e=>{status.textContent=e.message;}).finally(()=>btn.disabled=false);
      });
    }).catch(e=>{box.textContent="Ошибка: "+e.message;});
  };

  function getTopics(courseId){
    const result=[];
    const c=window.MDK_DATA[courseId];
    if(c)(c.sections||[]).forEach(s=>(s.topics||[]).forEach(t=>result.push({id:t.id,title:(t.code||"")+" "+(t.title||"")})));
    (window.customContent.topics||[]).filter(t=>t.mdkId===courseId).forEach(t=>result.push({id:t.id,title:t.title}));
    return result;
  }
  window.renderCourseEditorPage=function(){
    const app=document.getElementById("app");if(!app)return;
    if(!isTeacher()){app.innerHTML='<div class="module">Редактор доступен только преподавателю.</div>';return;}
    const ids=accessible();if(!ids.length){app.innerHTML='<div class="module">Администратор пока не назначил вам дисциплины.</div>';return;}
    const selected=canCourse(window.state.activeCourseId)?window.state.activeCourseId:ids[0];
    app.innerHTML='<a href="#/" class="backlink">← На главную</a><section class="hero"><h1>Редактор учебного курса</h1><p>Создавайте темы, лекции и проверочные тесты</p></section><div class="module"><label>Дисциплина</label><select id="editorCourse" class="self-input">'+ids.map(id=>'<option value="'+id+'" '+(id===selected?"selected":"")+'>'+esc(COURSE_LABELS[id])+'</option>').join("")+'</select></div><div class="module"><h3>1. Создать новую тему</h3><input id="newTopicCode" class="self-input" placeholder="Код темы, например Тема 13" style="margin:8px 0"><input id="newTopicTitle" class="self-input" placeholder="Название темы" style="margin:8px 0"><button class="btn" id="createTopicBtn">Создать тему</button><span id="topicStatus" style="margin-left:10px"></span></div><div class="module"><h3>2. Добавить лекцию</h3><select id="lectureTopic" class="self-input"></select><input id="lectureTitle" class="self-input" placeholder="Название лекции" style="margin:8px 0"><textarea id="lectureBody" class="self-input" rows="9" placeholder="Текст лекции. Можно использовать простую HTML-разметку: заголовки, списки, таблицы." style="margin:8px 0"></textarea><button class="btn" id="saveLectureBtn">Сохранить лекцию</button><span id="lectureStatus" style="margin-left:10px"></span></div><div class="module"><h3>3. Создать тест</h3><select id="testTopic" class="self-input"></select><input id="testTitle" class="self-input" placeholder="Название теста" style="margin:8px 0"><div id="questionDrafts"></div><div class="module" style="margin:12px 0"><input id="qText" class="self-input" placeholder="Текст вопроса"><input id="qA" class="self-input" placeholder="Вариант А" style="margin-top:6px"><input id="qB" class="self-input" placeholder="Вариант Б" style="margin-top:6px"><input id="qC" class="self-input" placeholder="Вариант В" style="margin-top:6px"><input id="qD" class="self-input" placeholder="Вариант Г" style="margin-top:6px"><label>Правильный ответ</label><select id="qCorrect" class="self-input"><option value="0">А</option><option value="1">Б</option><option value="2">В</option><option value="3">Г</option></select><button class="btn ghost" id="addQuestionBtn" style="margin-top:10px">Добавить вопрос в тест</button></div><button class="btn" id="saveTestBtn">Сохранить тест</button><span id="testStatus" style="margin-left:10px"></span></div>';
    const courseSel=document.getElementById("editorCourse"), topicSel=document.getElementById("lectureTopic"), testSel=document.getElementById("testTopic");
    function fillTopics(){const list=getTopics(courseSel.value);const opts=list.map(t=>'<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>').join("");topicSel.innerHTML=opts;testSel.innerHTML=opts;}
    fillTopics();courseSel.onchange=fillTopics;
    document.getElementById("createTopicBtn").onclick=function(){
      const code=document.getElementById("newTopicCode").value.trim(),title=document.getElementById("newTopicTitle").value.trim(),status=document.getElementById("topicStatus");
      if(!code||!title){status.textContent="Заполните код и название.";return;}
      const id="custom-"+Date.now(),full=code+" "+title;status.textContent="Сохранение…";
      window.API.saveCustomContent({id:id,mdkId:courseSel.value,type:"topic",title:full,content:"",code:code}).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");return window.loadGlobalCustomContent();}).then(()=>{fillTopics();topicSel.value=id;testSel.value=id;status.textContent="Тема создана ✓";document.getElementById("newTopicCode").value="";document.getElementById("newTopicTitle").value="";}).catch(e=>status.textContent=e.message);
    };
    document.getElementById("saveLectureBtn").onclick=function(){
      const topicId=topicSel.value,title=document.getElementById("lectureTitle").value.trim(),content=document.getElementById("lectureBody").value.trim(),status=document.getElementById("lectureStatus");
      if(!topicId||!title||!content){status.textContent="Выберите тему и заполните название и текст.";return;}
      status.textContent="Сохранение…";
      window.API.saveCustomContent({id:"lec-"+Date.now(),mdkId:courseSel.value,topicId:topicId,type:"lecture",title:title,code:"Доп. лекция",content:content}).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");status.textContent="Лекция сохранена ✓";document.getElementById("lectureTitle").value="";document.getElementById("lectureBody").value="";}).catch(e=>status.textContent=e.message);
    };
    let draft=[];
    function drawDraft(){document.getElementById("questionDrafts").innerHTML=draft.map((q,i)=>'<div class="module" style="padding:10px;margin:8px 0"><b>'+(i+1)+'. '+esc(q.q)+'</b><div style="font-size:12px;color:var(--muted)">Правильный ответ: '+esc(q.options[q.correct])+'</div><button class="btn ghost remove-q" data-i="'+i+'">Удалить</button></div>').join("");document.querySelectorAll(".remove-q").forEach(b=>b.onclick=()=>{draft.splice(+b.dataset.i,1);drawDraft();});}
    document.getElementById("addQuestionBtn").onclick=function(){
      const q=document.getElementById("qText").value.trim(),options=["qA","qB","qC","qD"].map(id=>document.getElementById(id).value.trim()),correct=+document.getElementById("qCorrect").value;
      if(!q||options.some(x=>!x)){window.showToast("Заполните вопрос и все четыре варианта.","err");return;}
      draft.push({q:q,options:options,correct:correct});["qText","qA","qB","qC","qD"].forEach(id=>document.getElementById(id).value="");drawDraft();
    };
    document.getElementById("saveTestBtn").onclick=function(){
      const topicId=testSel.value,title=document.getElementById("testTitle").value.trim(),status=document.getElementById("testStatus");
      if(!topicId||!title||!draft.length){status.textContent="Укажите тему, название и добавьте хотя бы один вопрос.";return;}
      status.textContent="Сохранение…";
      window.API.saveCustomContent({id:"test-"+Date.now(),mdkId:courseSel.value,topicId:topicId,type:"test",title:title,questions:draft.slice()}).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");status.textContent="Тест сохранён ✓ ("+draft.length+" вопросов)";draft=[];drawDraft();document.getElementById("testTitle").value="";}).catch(e=>status.textContent=e.message);
    };
  };

  function customRecords(courseId,topicId,type){return (window.customContent[type==="lecture"?"lectures":"tests"]||[]).filter(x=>x.mdkId===courseId&&x.topicId===topicId);}
  function runTest(test,courseId,topicId){
    const area=document.getElementById("topicContent"),questions=test.questions||[];if(!questions.length){area.textContent="В тесте пока нет вопросов.";return;}
    let i=0,score=0;
    function show(){
      if(i>=questions.length){
        const pct=Math.round(score/questions.length*100),grade=pct>=90?5:pct>=75?4:pct>=60?3:2,key="test_"+topicId+"_custom_"+test.id;
        window.state.results=window.state.results||{};window.state.results[key]={grade:grade,percent:pct,score:score,max:questions.length,finishedAt:new Date().toISOString()};
        if(window.saveStudentData)window.saveStudentData();
        if(window.API&&window.API.saveResult&&window.state.student)window.API.saveResult({email:window.state.student.email,name:window.state.student.name,group:window.state.student.group,testId:key,testTitle:test.title,grade:grade,score:score,maxScore:questions.length,percent:pct,courseId:courseId});
        area.innerHTML='<div class="module" style="text-align:center"><h2>Тест завершён</h2><p>Правильных ответов: '+score+' из '+questions.length+'</p><h2>Оценка: '+grade+'</h2><button class="btn" id="retryCustomTest">Пройти снова</button></div>';
        document.getElementById("retryCustomTest").onclick=()=>runTest(test,courseId,topicId);return;
      }
      const q=questions[i];area.innerHTML='<p><b>Вопрос '+(i+1)+' из '+questions.length+'</b></p><h3>'+esc(q.q)+'</h3>'+(q.options||[]).map((o,j)=>'<button class="btn ghost custom-answer" data-i="'+j+'" style="display:block;width:100%;text-align:left;margin:6px 0">'+esc(o)+'</button>').join("");
      area.querySelectorAll(".custom-answer").forEach(b=>b.onclick=function(){if(+b.dataset.i===+q.correct)score++;i++;show();});
    }
    show();
  }
  const originalTopic=window.renderTopicPage;
  if(originalTopic)window.renderTopicPage=function(courseId,topicId){
    if(!canCourse(courseId)){const app=document.getElementById("app");if(app)app.innerHTML="<div class='module'>Доступ к дисциплине закрыт.</div>";return;}
    originalTopic.apply(this,arguments);
    const lectures=customRecords(courseId,topicId,"lecture"),tests=customRecords(courseId,topicId,"test");
    if(!lectures.length&&!tests.length)return;
    const tabs=document.querySelector("#app > div[style*='display: flex']")||document.querySelector("#app .tab")?.parentElement;
    if(tests.length&&!document.getElementById("tab-custom-test")){
      const bar=document.getElementById("tab-lectures")?.parentElement;
      if(bar){const b=document.createElement("button");b.className="btn tab ghost";b.id="tab-custom-test";b.textContent="🧪 Дополнительный тест";bar.appendChild(b);b.onclick=()=>window.switchTopicTab("custom-test");}
    }
    const originalSwitch=window.switchTopicTab;
    window.switchTopicTab=function(tab){
      if(tab==="custom-test"){document.querySelectorAll(".tab").forEach(b=>{b.classList.remove("active");b.classList.add("ghost");});const b=document.getElementById("tab-custom-test");if(b){b.classList.add("active");b.classList.remove("ghost");}const area=document.getElementById("topicContent");area.innerHTML=tests.map((t,i)=>'<div class="module"><h3>'+esc(t.title)+'</h3><p>Вопросов: '+(t.questions||[]).length+'</p><button class="btn start-custom-test" data-i="'+i+'">Начать тест</button></div>').join("");area.querySelectorAll(".start-custom-test").forEach(b=>b.onclick=()=>runTest(tests[+b.dataset.i],courseId,topicId));return;}
      originalSwitch.apply(this,arguments);
      if(tab==="lectures"&&lectures.length){const area=document.getElementById("topicContent");lectures.forEach(l=>{const d=document.createElement("details");d.className="lec-accordion";d.open=true;const s=document.createElement("summary");s.textContent=(l.code||"Дополнительная лекция")+" · "+l.title;s.style="padding:14px;font-weight:bold;cursor:pointer";const body=document.createElement("div");body.className="lec-content";body.style="padding:18px;border-top:1px solid var(--border);line-height:1.6";body.innerHTML=l.content||"";d.appendChild(s);d.appendChild(body);area.appendChild(d);});}
    };
    window.switchTopicTab("lectures");
  };

  document.addEventListener("DOMContentLoaded",function(){filterCoursePicker();updateCourseChrome();});
  console.log("[course-admin] modular courses, permissions and content editor loaded");
})();