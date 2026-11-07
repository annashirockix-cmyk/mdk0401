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
 const cid=courseId(),label=(window.COURSE_LABELS&&window.COURSE_LABELS[cid])||cid;
 app.innerHTML='<a class="backlink" href="#/course-editor">← В редактор курса</a><section class="hero"><h1>Управление доступом и попытками</h1><p>'+esc(label)+' · настройки применяются на сервере</p></section>'+
 '<div class="module"><h3>📖 Открытие тем лекций</h3><p style="color:var(--muted)">Закрытая тема не открывается студентам. Новые темы по умолчанию доступны, пока преподаватель не закроет их.</p><div id="topicAccessList">Загрузка тем…</div></div>'+
 '<div class="module"><h3>🎯 Дополнительные попытки теста</h3><p style="color:var(--muted)">Выдайте конкретному студенту дополнительные попытки прохождения дополнительного теста, созданного в редакторе курса. Ноль означает, что дополнительные попытки не выданы.</p>'+
 '<label>Студент</label><select id="attemptStudent" class="self-input"><option value="">Загрузка списка…</option></select>'+
 '<label style="display:block;margin-top:10px">Тест</label><select id="attemptTest" class="self-input"><option value="">Загрузка тестов…</option></select>'+
 '<label style="display:block;margin-top:10px">Количество дополнительных попыток</label><input id="attemptCount" class="self-input" type="number" min="0" max="20" value="1" style="max-width:180px">'+
 '<button class="btn" id="grantAttemptsBtn" style="margin-top:12px">Выдать попытки</button> <span id="attemptStatus" aria-live="polite"></span></div>';
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
const oldRouter=window.router;
if(oldRouter)window.router=function(){const route=(location.hash||"").replace(/^#\/?/,"").split("/")[0];if(route==="teaching-controls"){window.renderTeacherControlsPage();return;}return oldRouter.apply(this,arguments);};
const oldEditor=window.renderCourseEditorPage;
if(oldEditor)window.renderCourseEditorPage=function(){oldEditor.apply(this,arguments);if(!staff())return;const app=document.getElementById("app");if(app&&!document.getElementById("teachingControlsLink")){const link=document.createElement("a");link.id="teachingControlsLink";link.href="#/teaching-controls";link.className="btn";link.textContent="🔐 Управление доступом и попытками";const hero=app.querySelector(".hero");if(hero)hero.insertAdjacentElement("afterend",link);else app.prepend(link);link.style.margin="0 0 14px";}};
const originalInline=window.startInlineTest;
if(originalInline)window.startInlineTest=function(topicId,selfWorkCode){
 const state=window.state||{},student=!!state.student;
 if(!student||!window.API||!window.API.getTestAttemptStatus)return originalInline.apply(this,arguments);
 const cid=String(state.activeCourseId||"07.01");
 const testId=selfWorkCode!==null&&selfWorkCode!==undefined?("self_"+topicId+"_"+(typeof selfWorkCode==="number"?selfWorkCode:0)):("test_"+topicId);
 const area=document.getElementById("topicContent");
 if(area)area.innerHTML='<p>Проверяем доступные попытки…</p>';
 window.API.getTestAttemptStatus(cid,testId).then(function(r){
   if(!r||r.allowed===false){if(area)area.innerHTML='<div class="module"><h3>Попытки закончились</h3><p>Использовано: '+esc(r&&r.used||0)+' из '+esc(r&&r.limit||1)+'. Обратитесь к преподавателю за дополнительной попыткой.</p></div>';return;}
   originalInline.apply(window,[topicId,selfWorkCode]);
 }).catch(function(e){if(area)area.innerHTML='<div class="module">Не удалось проверить доступ к тесту: '+esc(e.message||"ошибка сервера")+'. Повторите попытку позже.</div>';});
};
const oldTopic=window.renderTopicPage;
if(oldTopic)window.renderTopicPage=function(course,topic){const s=window.state||{},role=String((s.user&&s.user.role)||(s.student&&s.student.role)||"").toLowerCase();if(role!=="student"&&!s.student){return oldTopic.apply(this,arguments);}const app=document.getElementById("app");if(app)app.innerHTML='<div class="module">Проверка доступа к теме…</div>';const stamp=String(course)+":"+String(topic);window.API.getTopicAccess(course,topic).then(r=>{if(!app||!document.getElementById("app"))return;if(r&&r.open===false){app.innerHTML='<a class="backlink" href="#/">← Назад к плану</a><div class="module" style="text-align:center;padding:36px"><h2>🔒 Тема пока закрыта</h2><p>Преподаватель ещё не открыл доступ к этой теме. Попробуйте позже.</p></div>';return;}if((location.hash||"").indexOf(String(topic))>=0)oldTopic.apply(window,[course,topic]);}).catch(()=>{if(app)app.innerHTML='<div class="module">Не удалось проверить доступ к теме. Проверьте подключение и повторите попытку.</div>';});};
console.log("[teacher-controls] topic access and test attempt controls loaded");
})();