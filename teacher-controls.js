(function(){
"use strict";
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function staff(){const s=window.state||{};return !!(s.staff||s.teacher||s.admin||s.user&&["teacher","admin"].includes(String(s.user.role).toLowerCase())||s.student&&["teacher","admin"].includes(String(s.student.role).toLowerCase()));}
function courseId(){return String((window.state&&window.state.activeCourseId)||"07.01");}
function topics(cid){
 const out=[],c=window.MDK_DATA&&window.MDK_DATA[cid];
 if(c)(c.sections||[]).forEach(sec=>(sec.topics||[]).forEach(t=>out.push({id:String(t.id),title:[t.code,t.title].filter(Boolean).join(" ")})));
 (window.customContent&&window.customContent.topics||[]).filter(t=>t.mdkId===cid).forEach(t=>{if(!out.some(x=>x.id===String(t.id)))out.push({id:String(t.id),title:t.title||t.id});});
 return out;
}
window.renderTeacherControlsPage=function(){
 const app=document.getElementById("app");if(!app)return;
 if(!staff()){app.innerHTML='<div class="module">Панель доступна только преподавателям.</div>';return;}
 const cid=courseId(),label=(window.COURSE_LABELS&&window.COURSE_LABELS[cid])||cid;const bankNav=document.getElementById("menuQuestionBank");if(bankNav)bankNav.style.display="";
 app.innerHTML='<a class="backlink" href="#/course-editor">← В редактор курса</a><section class="hero"><h1>Управление доступом и попытками</h1><p>'+esc(label)+' · настройки применяются на сервере</p></section>'+
 '<div class="module"><h3>📖 Открытие тем лекций</h3><p style="color:var(--muted)">Закрытая тема не открывается студентам. Новые темы по умолчанию доступны, пока преподаватель не закроет их.</p><div id="topicAccessList">Загрузка тем…</div></div>'+
 '<div class="module"><h3>🎯 Дополнительные попытки теста</h3><p style="color:var(--muted)">Выдайте конкретному студенту дополнительные попытки прохождения дополнительного теста, созданного в редакторе курса. Ноль означает, что дополнительные попытки не выданы.</p>'+
 '<label>Студент</label><select id="attemptStudent" class="self-input"><option value="">Загрузка списка…</option></select>'+
 '<label style="display:block;margin-top:10px">Тест</label><select id="attemptTest" class="self-input"><option value="">Загрузка тестов…</option></select>'+
 '<label style="display:block;margin-top:10px">Идентификатор теста (можно выбрать выше или указать вручную)</label><input id="attemptTestId" class="self-input" placeholder="например: test_topic01" style="max-width:100%"><label style="display:block;margin-top:10px">Количество дополнительных попыток</label><input id="attemptCount" class="self-input" type="number" min="0" max="20" value="1" style="max-width:180px">'+
 '<button class="btn" id="grantAttemptsBtn" style="margin-top:12px">Выдать попытки</button> <span id="attemptStatus" aria-live="polite"></span></div>'+
 '<div class="module"><h3>🧩 Банк вопросов</h3><p style="color:var(--muted)">Просмотр вопросов, вариантов и ключей ответов по выбранной дисциплине. Доступен только преподавателям.</p><a class="btn" href="#/question-bank">Открыть банк вопросов</a><span id="bankMigrationArea"></span></div>'+
 '<div class="module"><h3>🛡️ Контроль самостоятельности</h3><p style="color:var(--muted)">Фиксируются скрытие вкладки, потеря фокуса окна и попытки копирования/вставки. Скриншоты и запуск ИИ в другой вкладке браузер достоверно не раскрывает.</p><button class="btn ghost" id="refreshProctorEvents">Обновить журнал событий</button><div id="proctorEventList">Нажмите «Обновить журнал событий».</div><hr style="border-color:var(--border);margin:14px 0"><h4>История попыток и выданных разрешений</h4><button class="btn ghost" id="refreshAttemptAudit">Обновить историю</button><div id="attemptAuditList">Нажмите «Обновить историю».</div></div>'+
 '<div class="module"><h3>🎓 Запись на репетиторство</h3><p style="color:var(--muted)">Добавьте ссылку на сервис записи/оплаты дополнительных занятий. Она будет показана студентам этой дисциплины.</p><label>Ссылка сервиса</label><input id="tutorUrl" class="self-input" type="url" placeholder="https://…"><label style="display:block;margin-top:8px">Заголовок</label><input id="tutorTitle" class="self-input" maxlength="120" value="Запись на дополнительные занятия"><label style="display:block;margin-top:8px">Пояснение для студентов</label><textarea id="tutorDescription" class="self-input" maxlength="500" rows="3" style="width:100%"></textarea><label style="display:flex;align-items:center;gap:9px;margin-top:12px"><input type="checkbox" id="tutorVisible" checked> Показывать вкладку студентам</label><p style="font-size:12px;color:var(--muted)">Если снять флажок, вкладка исчезнет из меню студентов этой дисциплины. Ссылка и настройки сохранятся.</p><button class="btn" id="saveTutorLink" style="margin-top:10px">Сохранить ссылку</button> <span id="tutorStatus" aria-live="polite"></span></div>';

 window.API.getTutoringLink(cid).then(r=>{const l=r.link||{};const u=document.getElementById("tutorUrl"),t=document.getElementById("tutorTitle"),d=document.getElementById("tutorDescription"),v=document.getElementById("tutorVisible");if(u)u.value=l.url||"";if(t)t.value=l.title||"Запись на дополнительные занятия";if(d)d.value=l.description||"";if(v)v.checked=l.visible!==false;}).catch(()=>{});
 document.getElementById("saveTutorLink").onclick=function(){const btn=this,st=document.getElementById("tutorStatus");btn.disabled=true;st.textContent="Сохранение…";window.API.saveTutoringLink(cid,{url:document.getElementById("tutorUrl").value,title:document.getElementById("tutorTitle").value,description:document.getElementById("tutorDescription").value,visible:document.getElementById("tutorVisible").checked}).then(r=>{if(!r.success)throw Error(r.error||"Не удалось сохранить");st.textContent="Настройки сохранены.";window.updateMenuVisibility&&window.updateMenuVisibility();}).catch(e=>st.textContent=e.message).finally(()=>btn.disabled=false);};


 const currentUser=(window.state&&(window.state.user||window.state.student))||{};
 const isAdmin=!!((window.state&&window.state.admin)||String(currentUser.role||"").toLowerCase()==="admin");
 if(isAdmin){
  const area=document.getElementById("bankMigrationArea");
  if(area){
   area.innerHTML='<button class="btn ghost" id="migrateQuestionBanks" style="margin-top:10px">🔐 Скопировать встроенные банки в закрытое хранилище</button><p style="font-size:12px;color:var(--muted)">Только администратор. Создаст серверную копию ключей ответов; пока не переключает тесты на серверную проверку.</p><span id="bankMigrationStatus" aria-live="polite"></span>';
   document.getElementById("migrateQuestionBanks").onclick=async function(){
    const btn=this,status=document.getElementById("bankMigrationStatus");btn.disabled=true;status.textContent="Подготовка банков…";
    try{
     const topicCourse={},banks=[],seen={};
     Object.keys(window.MDK_DATA||{}).forEach(cid=>{
      const course=window.MDK_DATA[cid];
      (course.sections||[]).forEach(sec=>(sec.topics||[]).forEach(topic=>{
       topicCourse[String(topic.id)]=cid;
       if(Array.isArray(topic.test)&&topic.test.length)banks.push({courseId:cid,bankId:"topic_"+topic.id,questions:topic.test});
      }));
     });
     function add(cid,id,questions){
      if(!cid||!Array.isArray(questions)||!questions.length)return;
      const key=cid+"|"+id;if(seen[key])return;seen[key]=1;
      banks.push({courseId:cid,bankId:id,questions:questions});
     }
     Object.keys(window.HARD_TESTS||{}).forEach(id=>add(topicCourse[id],"hard_"+id,window.HARD_TESTS[id]));
     Object.keys(window.EXTRA_TESTS||{}).forEach(id=>{
      const m=id.match(/^self_(.+)_\d+$/),topic=m&&m[1],entry=window.EXTRA_TESTS[id];
      if(topic&&topicCourse[topic]&&entry&&Array.isArray(entry.questions))add(topicCourse[topic],id,entry.questions);
     });
     ["07.01","04.01","02.01","02.02","MCAM","MAT","OT","PFI","EN","ENB","ENT"].forEach(cid=>{
      add(cid,"exam_primary",window["EXAM_BANK_"+cid.replace(".","")]);
      add(cid,"exam_extra",window.EXTRA_EXAM_BANKS&&window.EXTRA_EXAM_BANKS[cid]);
      add(cid,"mdk_extra",window.MDK_EXTRA_QUESTIONS&&window.MDK_EXTRA_QUESTIONS[cid]);
     });
     if(!banks.length)throw Error("Не найдены встроенные банки. Проверьте загрузку файлов данных.");
     const totalExpected=banks.reduce((n,b)=>n+b.questions.length,0);let total=0;
     for(let i=0;i<banks.length;i+=4){
      const result=await window.API.importQuestionBanks(banks.slice(i,i+4));
      if(!result||!result.success)throw Error(result&&result.error||"Ошибка импорта блока "+(i+1));
      total+=Number(result.questionsImported)||0;
      status.textContent="Импортировано вопросов: "+total+" из "+totalExpected;
     }
     status.textContent="Готово: "+banks.length+" банков, "+total+" вопросов сохранены в закрытом листе QuestionBank. Тесты пока продолжают работать по старой схеме.";
    }catch(error){status.textContent="Импорт прерван: "+(error.message||error);}
    finally{btn.disabled=false;}
   };
  }
 }
 document.getElementById("refreshAttemptAudit").onclick=function(){const box=document.getElementById("attemptAuditList");box.textContent="Загрузка…";window.API.getAttemptAudit(cid).then(r=>{const events=r.events||[];box.innerHTML=events.length?'<div style="overflow:auto"><table class="data-table" style="width:100%"><thead><tr><th>Дата</th><th>Студент</th><th>Событие</th><th>Тест</th><th>Детали</th></tr></thead><tbody>'+events.map(e=>'<tr><td>'+esc(e.createdAt)+'</td><td>'+esc(e.name)+' · '+esc(e.group)+'</td><td>'+esc(e.eventType==="attempts_granted"?"Выданы дополнительные попытки":e.eventType==="proctor_sanction"?"Штраф за нарушение правил":"Попытка завершена")+'</td><td>'+esc(e.testTitle||e.testId)+'</td><td>'+(e.eventType==="attempts_granted"?"Дополнительно: "+esc(e.extraAttempts):e.eventType==="proctor_sanction"?"Нарушение №"+esc(e.attemptNo)+" · штраф "+esc(e.percent)+" п.п.":"Попытка №"+esc(e.attemptNo)+" · "+esc(e.score)+"/"+esc(e.maxScore)+" · "+esc(e.percent)+"% · оценка "+esc(e.grade))+'</td></tr>').join("")+'</tbody></table></div>':'Записей пока нет.';}).catch(e=>box.textContent=e.message);};
 document.getElementById("refreshProctorEvents").onclick=function(){const box=document.getElementById("proctorEventList");box.textContent="Загрузка…";window.API.getProctorEvents(cid).then(r=>{const events=r.events||[];box.innerHTML=events.length?'<div style="overflow:auto"><table class="data-table" style="width:100%"><thead><tr><th>Время сервера</th><th>Студент</th><th>Событие</th><th>Тест</th></tr></thead><tbody>'+events.map(e=>'<tr><td>'+esc(e.serverTime)+'</td><td>'+esc(e.name)+' · '+esc(e.group)+'</td><td>'+esc(({visibility_hidden:"Вкладка скрыта / свёрнуто окно",window_blur:"Потеря фокуса окна",fullscreen_exit:"Выход из полного экрана",copy_attempt:"Попытка копирования",paste_attempt:"Попытка вставки",contextmenu_attempt:"Контекстное меню",screenshot_shortcut:"Нажата клавиша PrintScreen (снимок не подтверждён)",devtools_shortcut:"Комбинация инструментов разработчика",external_link:"Переход по внешней ссылке"}[e.eventType]||e.eventType))+(e.action==="sanction"?" · ШТРАФ -"+esc(e.penaltyPoints)+" п.п.":" · предупреждение")+(e.violationNo?" · нарушение №"+esc(e.violationNo):"")+'</td><td>'+esc(e.testId)+'</td></tr>').join("")+'</tbody></table></div>':'Событий пока нет.';}).catch(e=>box.textContent=e.message);};
 const topicBox=document.getElementById("topicAccessList");
 const list=topics(cid);
 if(!list.length)topicBox.textContent="В этой дисциплине не найдены темы.";
 else Promise.all(list.map(t=>window.API.getTopicAccess(cid,t.id).then(r=>({topic:t,open:!r||r.open!==false})).catch(()=>({topic:t,open:true,error:true})))).then(items=>{
   if(!document.getElementById("topicAccessList"))return;
   topicBox.innerHTML=items.map((x,i)=>'<div class="module" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;margin:8px 0"><div><b>'+esc(x.topic.title)+'</b><div style="font-size:12px;color:var(--muted)">'+(x.error?"Не удалось прочитать настройку — сохраните новое значение":(x.open?"Доступна студентам":"Закрыта для студентов"))+'</div></div><label style="display:flex;align-items:center;gap:8px;white-space:nowrap"><input type="checkbox" class="topic-open-toggle" data-topic="'+esc(x.topic.id)+'" '+(x.open?"checked":"")+'> Открыта</label></div>').join("");
   topicBox.querySelectorAll(".topic-open-toggle").forEach(ch=>ch.onchange=()=>{
     ch.disabled=true;const status=ch.closest(".module").querySelector("div div");
     window.API.setTopicAccess(cid,ch.dataset.topic,ch.checked).then(r=>{if(!r.success)throw new Error(r.error||"Не удалось сохранить");status.textContent=ch.checked?"Доступна студентам":"Закрыта для студентов";}).catch(e=>{ch.checked=!ch.checked;status.textContent=e.message;}).finally(()=>ch.disabled=false);
   });
 });
 const studentSel=document.getElementById("attemptStudent"),testSel=document.getElementById("attemptTest"),testIdInput=document.getElementById("attemptTestId");
 testSel.onchange=function(){testIdInput.value=this.value;};
 Promise.all([window.API.getStudents(),window.loadGlobalCustomContent?new Promise(resolve=>window.loadGlobalCustomContent(resolve)):Promise.resolve()]).then(([res])=>{
   const students=(res.students||[]).filter(s=>String(s.role).toLowerCase()==="student"&&(s.courses||[]).includes(cid));
   studentSel.innerHTML='<option value="">— Выберите студента —</option>'+students.map(s=>'<option value="'+esc(s.email)+'">'+esc(s.name||s.email)+' · '+esc(s.group||"без группы")+'</option>').join("");
   const tests=(window.customContent&&window.customContent.tests||[]).filter(t=>t.mdkId===cid).map(t=>({id:t.id,title:"Дополнительный тест · "+(t.title||t.id)}));
   const course=window.MDK_DATA&&window.MDK_DATA[cid],built=[];
   (course&&course.sections||[]).forEach(sec=>(sec.topics||[]).forEach(topic=>{
     if(topic.test&&topic.test.length)built.push({id:"test_"+topic.id,title:"Тест · "+(topic.code||"")+" "+(topic.title||topic.id)});
     (topic.selfWork||[]).forEach((w,i)=>{const k="self_"+topic.id+"_"+i;if(window.EXTRA_TESTS&&window.EXTRA_TESTS[k]&&window.EXTRA_TESTS[k].questions)built.push({id:k,title:"Самостоятельный тест · "+(w.title||k)});});
   }));
   built.push({id:"__final__"+cid,title:"Итоговый экзамен · "+cid});
   const all=tests.concat(built);
   testSel.innerHTML='<option value="">— Выберите тест —</option>'+all.map(t=>'<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>').join("");
 }).catch(e=>{studentSel.innerHTML='<option value="">Ошибка загрузки студентов</option>';testSel.innerHTML='<option value="">Ошибка загрузки тестов</option>';document.getElementById("attemptStatus").textContent=e.message;});
 document.getElementById("grantAttemptsBtn").onclick=function(){
   const email=studentSel.value,testId=String(testIdInput.value||testSel.value).trim(),n=Math.max(0,Math.min(20,Number(document.getElementById("attemptCount").value)||0)),status=document.getElementById("attemptStatus");
   if(!email||!testId){status.textContent="Выберите студента и тест.";return;}
   this.disabled=true;status.textContent="Сохранение…";
   window.API.grantTestAttempts(cid,testId,email,n).then(r=>{if(!r.success)throw new Error(r.error||"Ошибка");status.textContent="Сохранено: дополнительных попыток — "+r.extraAttempts+".";}).catch(e=>status.textContent=e.message).finally(()=>{this.disabled=false;});
 };
};

window.renderQuestionBankPage=function(){
 const app=document.getElementById("app");if(!app)return;
 if(!staff()){app.innerHTML='<div class="module">Банк вопросов доступен только преподавателям.</div>';return;}
 const cid=courseId(),course=window.MDK_DATA&&window.MDK_DATA[cid],session=window.state||{},role=String((session.user&&session.user.role)||(session.staff&&session.staff.role)||(session.teacher&&session.teacher.role)||(session.student&&session.student.role)||"").toLowerCase(),isAdmin=role==="admin"||session.admin===true;
 app.innerHTML='<a class="backlink" href="#/teaching-controls">← К управлению</a><section class="hero"><h1>Банк вопросов</h1><p>'+esc((window.COURSE_LABELS&&window.COURSE_LABELS[cid])||cid)+' · защищённое хранилище</p></section><div class="module"><div id="bankStatus">Загружаем банк с сервера…</div>'+(isAdmin?'<button id="bankImportBtn" class="btn" style="margin:12px 0">⬆ Импортировать банк этого предмета на сервер</button><p style="font-size:12px;color:var(--muted)">Импорт доступен администратору. Он переносит ключи ответов в закрытый лист Google Sheets.</p>':'')+'<input id="bankSearch" class="self-input" placeholder="Поиск по вопросу, теме, ответу" style="width:100%;margin-top:10px"><select id="bankSource" class="self-input" style="margin-top:8px;width:100%"><option value="">Все источники</option><option value="Тематический тест">Тематический тест</option><option value="Усложнённый банк">Усложнённый банк</option><option value="Экзаменационный банк">Экзаменационный банк</option><option value="Самостоятельная работа">Самостоятельная работа</option></select><div id="bankQuestions" style="margin-top:14px"></div></div>';
 const labelFor=id=>{if(id.indexOf("topic_")===0||id.indexOf("hard_")===0){const tid=id.replace(/^(topic_|hard_)/,"");let found=null;(course&&course.sections||[]).forEach(sec=>(sec.topics||[]).forEach(tp=>{if(String(tp.id)===tid)found=tp;}));return found?[found.code,found.title].filter(Boolean).join(" "):tid;}if(id.indexOf("self_")===0)return "Самостоятельная работа · "+id.slice(5);if(id.indexOf("exam_")===0||id==="mdk_extra")return "Итоговый экзамен";return id;};
 const sourceFor=id=>id.indexOf("topic_")===0?"Тематический тест":id.indexOf("hard_")===0?"Усложнённый банк":id.indexOf("self_")===0?"Самостоятельная работа":"Экзаменационный банк";
 function render(rows){
  const term=(document.getElementById("bankSearch").value||"").toLowerCase(),source=document.getElementById("bankSource").value;
  const list=rows.filter(x=>{const q=x.question||{},opts=q.options||q.answers||[];return(!source||sourceFor(x.bankId)===source)&&[q.q,q.question,q.context,q.correct,q.answer,q.explanation,labelFor(x.bankId)].concat(opts,q.items||[],q.pairs||[]).join(" ").toLowerCase().includes(term);});
  document.getElementById("bankQuestions").innerHTML=list.length?list.map((x,i)=>{const q=x.question||{},options=q.options||q.answers||[],answer=q.correct!==undefined?q.correct:q.correctAnswer!==undefined?q.correctAnswer:q.answer,correct=Array.isArray(answer)?answer.map(Number):[Number(answer)];return '<article class="module" style="margin:10px 0"><b>'+esc(i+1)+'. '+esc(q.q||q.question||"Без формулировки")+'</b><div style="font-size:12px;color:var(--muted);margin:5px 0">'+esc(sourceFor(x.bankId))+' · '+esc(labelFor(x.bankId))+' · '+esc(q.type||"mc")+'</div>'+(q.context?'<p>'+esc(q.context)+'</p>':'')+(options.length?'<ol type="A">'+options.map((o,j)=>'<li style="'+(correct.indexOf(j)>=0?"font-weight:700;color:var(--success)":"")+'">'+esc(o)+(correct.indexOf(j)>=0?" ✓":"")+'</li>').join("")+'</ol>':'')+(q.items?'<p><b>Элементы:</b> '+esc(q.items.join(" · "))+'</p>':'')+(q.pairs?'<p><b>Пары:</b> '+esc(JSON.stringify(q.pairs))+'</p>':'')+(answer!==undefined?'<p><b>Правильный ответ:</b> '+esc(Array.isArray(answer)?answer.join(", "):typeof answer==="object"?JSON.stringify(answer):answer)+'</p>':'')+(q.correctOrder?'<p><b>Правильная последовательность:</b> '+esc(q.correctOrder.join(" → "))+'</p>':'')+(q.explanation||q.solution?'<p><b>Пояснение:</b> '+esc(q.explanation||q.solution)+'</p>':'')+'</article>';}).join(""):'Вопросы не найдены по заданному фильтру.';
 }
 let bankRows=[];
 function load(){
  document.getElementById("bankStatus").textContent="Загружаем банк из закрытого хранилища…";
  window.API.getQuestionBank(cid,"").then(r=>{if(!r||!r.success)throw new Error(r&&r.error||"Не удалось получить банк.");
   bankRows=r.questions||[];
   document.getElementById("bankStatus").textContent=bankRows.length?"Загружено вопросов: "+bankRows.length+" · банков: "+new Set(bankRows.map(x=>x.bankId)).size:"В закрытом хранилище пока нет вопросов. Администратор может выполнить импорт ниже.";
   render(bankRows);
  }).catch(e=>{document.getElementById("bankStatus").textContent="Ошибка загрузки: "+e.message;});
 }
 const collect=()=>{
  const out=[],seen={};
  function add(bankId,arr){if(!Array.isArray(arr)||!arr.length)return;const qs=arr.filter(q=>q&&typeof q==="object");if(!qs.length)return;const k=cid+"|"+bankId;if(seen[k])return;seen[k]=1;out.push({courseId:cid,bankId:bankId,questions:qs});}
  (course&&course.sections||[]).forEach(sec=>(sec.topics||[]).forEach(tp=>{add("topic_"+tp.id,tp.test||[]);add("hard_"+tp.id,window.HARD_TESTS&&window.HARD_TESTS[tp.id]||[]);}));
  const key=String(cid).replace(".","");
  add("exam_primary",window.EXTRA_EXAM_BANKS&&window.EXTRA_EXAM_BANKS[cid]||window["EXAM_BANK_"+key]||[]);
  add("exam_extra",window["EXAM_BANK_EXTRA_"+key]||[]);
  add("mdk_extra",window.MDK_EXTRA_QUESTIONS&&window.MDK_EXTRA_QUESTIONS[cid]||[]);
  const extras=window.EXTRA_TESTS||{},topicIds=[];(course&&course.sections||[]).forEach(sec=>(sec.topics||[]).forEach(tp=>topicIds.push(String(tp.id))));
  Object.keys(extras).forEach(k=>{if(k.indexOf("self_")===0&&topicIds.some(id=>k.indexOf("self_"+id+"_")===0))add(k,extras[k]&&extras[k].questions||[]);});
  return out;
 };
 const importBtn=document.getElementById("bankImportBtn");
 if(importBtn)importBtn.onclick=async function(){
  this.disabled=true;const status=document.getElementById("bankStatus");
  try{
   const banks=collect();if(!banks.length)throw new Error("В файлах этого предмета не найдено вопросов для импорта.");
   let count=0,questions=0;
   for(let i=0;i<banks.length;i+=5){const part=banks.slice(i,i+5),r=await window.API.importQuestionBanks(part);if(!r||!r.success)throw new Error(r&&r.error||"Ошибка импорта части "+(Math.floor(i/5)+1));count+=r.banksImported||part.length;questions+=r.questionsImported||0;status.textContent="Импортировано банков: "+count+" из "+banks.length+"; вопросов: "+questions;}
   status.textContent="Импорт завершён: "+count+" банков, "+questions+" вопросов. Загружаем закрытую копию…";load();
  }catch(e){status.textContent="Импорт остановлен: "+e.message+" Пожалуйста, повторите после проверки сообщения.";}
  finally{this.disabled=false;}
 };
 document.getElementById("bankSearch").oninput=()=>render(bankRows);document.getElementById("bankSource").onchange=()=>render(bankRows);
 load();
};
window.renderTutoringPage=function(){
 const app=document.getElementById("app");if(!app)return;const cid=courseId();
 app.innerHTML='<section class="hero"><h1>🎓 Дополнительные занятия</h1><p>Запись на индивидуальные консультации и репетиторство</p></section><div class="module" id="tutoringContent">Загрузка информации…</div>';
 window.API.getTutoringLink(cid).then(r=>{const l=r.link||{},box=document.getElementById("tutoringContent");if(!box)return;if(l.visible===false&&!staff()){box.textContent="Преподаватель временно скрыл запись на дополнительные занятия.";return;}if(l.url){box.innerHTML='<h3>'+esc(l.title||"Запись на дополнительные занятия")+'</h3><p>'+esc(l.description||"Вы можете записаться на дополнительное занятие по ссылке ниже.")+'</p><a class="btn" href="'+esc(l.url)+'" target="_blank" rel="noopener noreferrer">Перейти к записи и оплате</a>';}else{box.textContent="Преподаватель пока не добавил ссылку для записи на дополнительные занятия.";}}).catch(e=>{const box=document.getElementById("tutoringContent");if(box)box.textContent=e.message;});
};

const oldRouter=window.router;
if(oldRouter)window.router=function(){const route=(location.hash||"").replace(/^#\/?/,"").split("/")[0];if(route==="teaching-controls"){window.renderTeacherControlsPage();return;}if(route==="question-bank"){window.renderQuestionBankPage();return;}if(route==="tutoring"){window.renderTutoringPage();return;}return oldRouter.apply(this,arguments);};
const oldEditor=window.renderCourseEditorPage;
if(oldEditor)window.renderCourseEditorPage=function(){oldEditor.apply(this,arguments);if(!staff())return;const app=document.getElementById("app");if(app&&!document.getElementById("teachingControlsLink")){const link=document.createElement("a");link.id="teachingControlsLink";link.href="#/teaching-controls";link.className="btn";link.textContent="🔐 Управление доступом и попытками";const hero=app.querySelector(".hero");if(hero)hero.insertAdjacentElement("afterend",link);else app.prepend(link);link.style.margin="0 0 14px";}};
const originalInline=window.startInlineTest;
if(originalInline)window.startInlineTest=function(topicId,selfWorkCode){
 const state=window.state||{},student=!!state.student;
 if(!student||!window.API||!window.API.getTestAttemptStatus)return originalInline.apply(this,arguments);
 const cid=String(state.activeCourseId||"07.01");
 const testId=selfWorkCode!==null&&selfWorkCode!==undefined?("self_"+topicId+"_"+(typeof selfWorkCode==="number"?selfWorkCode:0)):("test_"+topicId);
 const area=document.getElementById("topicContent");if(area){area.dataset.testId=testId;area.dataset.proctorAssessment="0";}
 if(area)area.innerHTML='<p>Проверяем доступные попытки…</p>';
 window.API.getTestAttemptStatus(cid,testId).then(function(r){
   if(!r||r.allowed===false){if(area){area.dataset.proctorAssessment="0";area.innerHTML='<div class="module"><h3>Попытки закончились</h3><p>Использовано: '+esc(r&&r.used||0)+' из '+esc(r&&r.limit||1)+'. Обратитесь к преподавателю за дополнительной попыткой.</p></div>';}return;}
   if(area)area.dataset.proctorAssessment="1";originalInline.apply(window,[topicId,selfWorkCode]);
 }).catch(function(e){if(area)area.innerHTML='<div class="module">Не удалось проверить доступ к тесту: '+esc(e.message||"ошибка сервера")+'. Повторите попытку позже.</div>';});
};
const oldTopic=window.renderTopicPage;
if(oldTopic)window.renderTopicPage=function(course,topic){const s=window.state||{},role=String((s.user&&s.user.role)||(s.student&&s.student.role)||"").toLowerCase();if(role!=="student"&&!s.student){return oldTopic.apply(this,arguments);}const app=document.getElementById("app");if(app)app.innerHTML='<div class="module">Проверка доступа к теме…</div>';const stamp=String(course)+":"+String(topic);window.API.getTopicAccess(course,topic).then(r=>{if(!app||!document.getElementById("app"))return;if(r&&r.open===false){app.innerHTML='<a class="backlink" href="#/">← Назад к плану</a><div class="module" style="text-align:center;padding:36px"><h2>🔒 Тема пока закрыта</h2><p>Преподаватель ещё не открыл доступ к этой теме. Попробуйте позже.</p></div>';return;}if((location.hash||"").indexOf(String(topic))>=0)oldTopic.apply(window,[course,topic]);}).catch(()=>{if(app)app.innerHTML='<div class="module">Не удалось проверить доступ к теме. Проверьте подключение и повторите попытку.</div>';});};
console.log("[teacher-controls] topic access, question bank, proctor log and tutoring controls loaded");
})();