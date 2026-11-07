"use strict";
(function(){
  var KEY="mdk.metrologyTrainer.plus.v1";
  function esc(v){return String(v||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){return {};}}
  function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));}catch(e){}}
  function rnd(n){return Math.floor(Math.random()*n);}
  function n(v){return Number(String(v||"").trim().replace(",","."));}
  function f(v){return Number(v).toFixed(2).replace(".",",");}
  window.renderMetrologyLabPlus=function(){
    if(!window.renderMetrologyTrainer)return;
    window.renderMetrologyTrainer();
    var app=document.getElementById("app");if(!app)return;
    var data=read(),mode="depth",task=make(mode),practiceTask=makePractice(),done=false;
    var host=document.createElement("section");
    host.className="card";host.style.cssText="padding:16px;margin-top:16px";
    app.appendChild(host);
    function make(k){
      if(k==="depth"){var a=4+rnd(16),b=1+rnd(9);return {answer:a+b*.1,main:a,vernier:b,ex:"Основная шкала "+a+" мм; нониус "+b+" × 0,1 мм. Глубина = "+f(a+b*.1)+" мм."};}
      var lo=(rnd(5)+1)*.01,hi=lo+(rnd(6)+3)*.01;return {answer:hi-lo,min:lo,max:hi,ex:"Размах = max − min = "+f(hi)+" − "+f(lo)+" = "+f(hi-lo)+" мм. Измерение выполняют при отключённом приводе, вручную вращая закреплённую деталь."};
    }
    function diagram(){
      if(mode==="depth")return '<svg viewBox="0 0 620 145" role="img" aria-label="Схема измерения глубины" style="width:100%;background:#f8fafc;border-radius:8px"><rect x="90" y="35" width="440" height="90" rx="8" fill="#dbe4ec" stroke="#64748b"/><rect x="180" y="67" width="260" height="58" fill="#fff" stroke="#94a3b8"/><rect x="298" y="12" width="24" height="76" fill="#0f766e"/><line x1="310" y1="12" x2="310" y2="126" stroke="#0f766e" stroke-width="2"/><text x="20" y="20" fill="#334155" font-size="13">Глубиномер: опорная база должна прилегать к детали</text><text x="330" y="53" fill="#0f766e" font-size="12">измерительный стержень</text></svg>';
      return '<svg viewBox="0 0 620 145" role="img" aria-label="Индикатор часового типа" style="width:100%;background:#f8fafc;border-radius:8px"><circle cx="310" cy="77" r="54" fill="#fff" stroke="#475569" stroke-width="4"/>'+Array.from({length:9},(_,i)=>{var a=(-140+i*35)*Math.PI/180;return '<line x1="'+(310+Math.cos(a)*43)+'" y1="'+(77+Math.sin(a)*43)+'" x2="'+(310+Math.cos(a)*51)+'" y2="'+(77+Math.sin(a)*51)+'" stroke="#334155" stroke-width="2"/>';}).join("")+'<line x1="310" y1="77" x2="350" y2="48" stroke="#dc2626" stroke-width="3"/><circle cx="310" cy="77" r="5" fill="#334155"/><text x="20" y="20" fill="#334155" font-size="13">Индикатор: фиксируй min и max за полный оборот</text><text x="20" y="139" fill="#334155" font-size="12">Min: '+f(task.min)+' мм · Max: '+f(task.max)+' мм</text></svg>';
    }
    function tabButton(id,label){return '<button class="btn" data-plus-tab="'+id+'">'+label+'</button>';}
    function render(){
      var body="";
      if(mode==="depth"||mode==="indicator"){
        body='<p style="color:var(--muted)">'+(mode==="depth"?"Определи глубину по условным отсчётам основной шкалы и нониуса.":"Рассчитай размах показаний индикатора за полный оборот.")+'</p>'+diagram()+
        '<p><b>Дано:</b> '+(mode==="depth"?"основная шкала — "+task.main+" мм; совпавшее деление нониуса — "+task.vernier+"; цена деления — 0,1 мм.":"минимум — "+f(task.min)+" мм; максимум — "+f(task.max)+" мм.")+'</p><label>Ответ, мм <input id="plusAnswer" inputmode="decimal" placeholder="Например, 12,4" style="padding:10px;max-width:220px"></label> <button class="btn btn-primary" id="plusCheck">Проверить</button> <button class="btn" id="plusNext" disabled>Новое задание</button><div id="plusFeedback" aria-live="polite"></div>';
      }else if(mode==="tolerance"){
        body='<p>Введи номинал, верхнее и нижнее отклонения (со знаком), а также фактический размер.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px">'+[['Номинал','tolNom','20'],['Верхнее отклонение','tolES','0.1'],['Нижнее отклонение','tolEI','-0.1'],['Фактический размер','tolFact','20.04']].map(x=>'<label>'+x[0]+'<input id="'+x[1]+'" type="number" step="0.001" value="'+x[2]+'" style="display:block;width:100%;padding:10px"></label>').join("")+'</div><button class="btn btn-primary" id="plusTol" style="margin-top:12px">Рассчитать</button><div id="plusTolResult" aria-live="polite"></div><p style="font-size:13px;color:var(--muted)">Учебная оценка по предельным размерам. В реальном контроле учитываются неопределённость и установленное правило принятия решения.</p>';
      }else if(mode==="practice"){
        body=practiceMarkup();
      }else if(mode==="assessment"){
        var qs=assessmentQuestions();
        body='<p>Ответь на 5 вопросов по основам метрологии. За каждый правильный ответ начисляется 1 балл. После проверки система рассчитает предварительную оценку.</p><div id="mtaQuestions">'+qs.map(function(q,i){return '<fieldset style="border:1px solid var(--border);border-radius:10px;padding:12px;margin:10px 0"><legend><b>'+ (i+1)+'. '+esc(q.q)+'</b></legend>'+q.a.map(function(v,j){return '<label style="display:block;padding:5px"><input type="radio" name="mtaQ'+i+'" value="'+j+'"> '+esc(v)+'</label>';}).join("")+'</fieldset>';}).join("")+'</div><button class="btn btn-primary" id="mtaSubmit">Проверить ответы</button><div id="mtaResult" aria-live="polite"></div><p style="font-size:13px;color:var(--muted)">Автооценка является предварительной. Преподаватель может проверить результат и подтвердить итоговую оценку.</p>';
      }else if(mode==="journal"){
        body='<p style="color:var(--muted)">Выставление оценки за лабораторную работу с сохранением результата в общей базе портала. Доступно преподавателю и администратору.</p><div id="mtjAccess" aria-live="polite">Проверка доступа и загрузка списка студентов…</div><div id="mtjForm" style="display:none"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px"><label>Группа<select id="mtjGroup" style="display:block;width:100%;padding:10px"></select></label><label>Студент<select id="mtjStudent" style="display:block;width:100%;padding:10px"></select></label><label>Лабораторная работа<select id="mtjWork" style="display:block;width:100%;padding:10px"><option value="caliper">Измерение штангенциркулем</option><option value="micrometer">Измерение микрометром</option><option value="depth">Измерение глубиномером</option><option value="indicator">Контроль биения индикатором</option><option value="tolerance">Расчёт и контроль допуска</option><option value="protocol">Оформление протокола измерений</option></select></label><label>Дата выполнения<input id="mtjDate" type="date" value="'+new Date().toISOString().slice(0,10)+'" style="display:block;width:100%;padding:10px"></label><label>Оценка<select id="mtjGrade" style="display:block;width:100%;padding:10px"><option value="5">5 — отлично</option><option value="4">4 — хорошо</option><option value="3">3 — удовлетворительно</option><option value="2">2 — неудовлетворительно</option></select></label></div><label style="display:block;margin-top:10px">Комментарий преподавателя<textarea id="mtjFeedback" rows="3" placeholder="Что выполнено правильно, что исправить…" style="display:block;width:100%;padding:10px"></textarea></label><button class="btn btn-primary" id="mtjSave" style="margin-top:12px">Сохранить оценку в журнал</button><div id="mtjStatus" aria-live="polite" style="margin-top:10px"></div></div><h3 style="margin-top:22px">Последние оценки по метрологии</h3><div id="mtjResults">Результаты загрузятся после проверки доступа.</div>';
      }else{
        var r=data.report||{};
        body='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">'+[['ФИО','rpName',r.name],['Группа','rpGroup',r.group],['Дата','rpDate',r.date||new Date().toISOString().slice(0,10)],['Деталь','rpPart',r.part]].map(x=>'<label>'+x[0]+'<input id="'+x[1]+'" value="'+esc(x[2])+'" style="display:block;width:100%;padding:10px"></label>').join("")+'</div><h3>Измеренные параметры</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><tr><th>Параметр</th><th>Требование</th><th>Средство</th><th>Результат</th></tr>'+[0,1,2,3].map(i=>'<tr>'+['p','req','tool','val'].map(k=>'<td style="padding:3px"><input data-ri="'+i+'" data-rk="'+k+'" value="'+esc((r.rows||[])[i]?.[k])+'" style="min-width:90px;width:100%;padding:8px"></td>').join("")+'</tr>').join("")+'</table></div><label>Заключение<textarea id="rpConclusion" rows="3" style="display:block;width:100%;padding:10px">'+esc(r.conclusion)+'</textarea></label><button class="btn btn-primary" id="plusSave">Сохранить протокол</button> <button class="btn" id="plusCsv">Скачать CSV</button> <button class="btn" id="plusPrint">Печать / PDF</button><div id="plusMsg" aria-live="polite"></div><p style="font-size:13px;color:var(--muted)">Записывай только фактически полученные измерения. Учебные данные не выдавай за результаты контроля.</p>';
      }
      host.innerHTML='<h2 style="margin:0 0 6px">Дополнительная лаборатория</h2><p style="margin:0;color:var(--muted)">Глубиномер · индикатор биения · допуски · оформление протокола</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0">'+tabButton("assessment","Самопроверка")+tabButton("practice","Практикум: допуски")+tabButton("depth","Глубиномер")+tabButton("indicator","Биение")+tabButton("tolerance","Допуски")+tabButton("report","Протокол")+tabButton("journal","Журнал преподавателя")+'</div><div class="card" style="padding:14px">'+body+'</div>';
      host.querySelectorAll("[data-plus-tab]").forEach(b=>b.onclick=function(){mode=b.dataset.plusTab;task=make(mode);practiceTask=makePractice();done=false;render();});
      if(mode==="depth"||mode==="indicator"){
        host.querySelector("#plusCheck").onclick=check;
        host.querySelector("#plusNext").onclick=function(){task=make(mode);done=false;render();};
      }
      if(mode==="tolerance")host.querySelector("#plusTol").onclick=calc;
      if(mode==="report"){host.querySelector("#plusSave").onclick=saveReport;host.querySelector("#plusCsv").onclick=csv;host.querySelector("#plusPrint").onclick=function(){window.print();};}
      if(mode==="journal")loadTeacherJournal();
      if(mode==="assessment")host.querySelector("#mtaSubmit").onclick=submitAssessment;
      if(mode==="practice"){host.querySelector("#mtpCheck").onclick=checkPractice;host.querySelector("#mtpNew").onclick=function(){practiceTask=makePractice();render();};}
    }
    function check(){
      if(done)return;var raw=host.querySelector("#plusAnswer").value,v=n(raw),ok=raw!==""&&Number.isFinite(v)&&Math.abs(v-task.answer)<.005;done=true;
      host.querySelector("#plusFeedback").innerHTML='<p style="padding:10px;border:1px solid '+(ok?'#16a34a':'#d97706')+';border-radius:8px"><b>'+(ok?"Верно!":"Есть ошибка в расчёте.")+'</b><br>'+esc(task.ex)+'<br>Ответ: <b>'+f(task.answer)+' мм</b></p>';
      host.querySelector("#plusCheck").disabled=true;host.querySelector("#plusNext").disabled=false;
    }
    function calc(){
      var nom=n(host.querySelector("#tolNom").value),es=n(host.querySelector("#tolES").value),ei=n(host.querySelector("#tolEI").value),fact=n(host.querySelector("#tolFact").value),out=host.querySelector("#plusTolResult");
      if(![nom,es,ei,fact].every(Number.isFinite)||es<ei){out.textContent="Проверь числа: верхнее отклонение должно быть не меньше нижнего.";return;}
      var max=nom+es,min=nom+ei,ok=fact>=min&&fact<=max;
      out.innerHTML='<div style="padding:12px;margin-top:12px;border:1px solid '+(ok?'#16a34a':'#d97706')+';border-radius:8px">Dmax = <b>'+f(max)+' мм</b><br>Dmin = <b>'+f(min)+' мм</b><br>T = <b>'+f(max-min)+' мм</b><br>Фактический размер '+f(fact)+' мм: <b>'+(ok?"в пределах допуска":"вне поля допуска")+'</b>.</div>';
    }
    function collect(){
      return {name:host.querySelector("#rpName").value,group:host.querySelector("#rpGroup").value,date:host.querySelector("#rpDate").value,part:host.querySelector("#rpPart").value,rows:[0,1,2,3].map(i=>{var o={};["p","req","tool","val"].forEach(k=>o[k]=host.querySelector('[data-ri="'+i+'"][data-rk="'+k+'"]').value);return o;}),conclusion:host.querySelector("#rpConclusion").value};
    }
    function saveReport(){data.report=collect();write(data);host.querySelector("#plusMsg").textContent="Протокол сохранён локально на этом устройстве.";}
    function csv(){
      var r=collect(),rows=[["Протокол лабораторной работы"],["ФИО",r.name],["Группа",r.group],["Дата",r.date],["Деталь",r.part],[],["Параметр","Требование","Средство","Результат"]].concat(r.rows.map(x=>[x.p,x.req,x.tool,x.val]),[[],["Заключение",r.conclusion]]);
      var text="\uFEFF"+rows.map(row=>row.map(v=>'"'+String(v||"").replace(/"/g,'""')+'"').join(";")).join("\r\n"),blob=new Blob([text],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="protokol-metrologiya.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    }



    function makePractice(){
      var nominal=(12+rnd(39))+(rnd(10)/10),ei=-(1+rnd(8))*.01,es=(1+rnd(8))*.01;
      var min=Number((nominal+ei).toFixed(2)),max=Number((nominal+es).toFixed(2)),tol=Number((es-ei).toFixed(2));
      var accepted=rnd(2)===0,actual=accepted?Number((min+(max-min)*(.2+rnd(60)/100)).toFixed(2)):Number((rnd(2)===0?min-(1+rnd(5))*.01:max+(1+rnd(5))*.01).toFixed(2));
      return {nominal:Number(nominal.toFixed(2)),ei:ei,es:es,min:min,max:max,tol:tol,actual:actual,accepted:accepted};
    }
    function practiceMarkup(){
      var p=practiceTask;
      return '<p>Индивидуальный вариант: рассчитай предельные размеры и допуск, затем оцени фактический размер детали. За каждый верный этап — 1 балл.</p><div style="border:1px solid var(--border);border-radius:10px;padding:14px"><p><b>Исходные данные</b></p><p>Номинальный размер: <b>'+f(p.nominal)+' мм</b></p><p>Верхнее отклонение ES: <b>+'+f(p.es)+' мм</b></p><p>Нижнее отклонение EI: <b>'+f(p.ei)+' мм</b></p><p>Фактический размер: <b>'+f(p.actual)+' мм</b></p></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:12px">'+[['Верхний предельный размер, мм','mtpMax'],['Нижний предельный размер, мм','mtpMin'],['Допуск, мм','mtpTol']].map(function(x){return '<label>'+x[0]+'<input id="'+x[1]+'" inputmode="decimal" placeholder="Ответ" style="display:block;width:100%;padding:10px"></label>';}).join("")+'</div><fieldset style="margin:12px 0;padding:10px;border:1px solid var(--border);border-radius:8px"><legend>Оценка фактического размера</legend><label style="display:block;padding:5px"><input type="radio" name="mtpDecision" value="yes"> Размер соответствует допуску</label><label style="display:block;padding:5px"><input type="radio" name="mtpDecision" value="no"> Размер не соответствует допуску</label></fieldset><button class="btn btn-primary" id="mtpCheck">Проверить решение</button> <button class="btn" id="mtpNew">Получить новый вариант</button><div id="mtpFeedback" aria-live="polite"></div>';
    }
    function checkPractice(){
      var p=practiceTask,vals=[n(host.querySelector("#mtpMax").value),n(host.querySelector("#mtpMin").value),n(host.querySelector("#mtpTol").value)],expected=[p.max,p.min,p.tol],labels=["Верхний предельный размер","Нижний предельный размер","Допуск"],score=0,lines=[];
      vals.forEach(function(v,i){var ok=Number.isFinite(v)&&Math.abs(v-expected[i])<=.005;if(ok)score++;lines.push(labels[i]+": "+(ok?"верно":"ошибка; правильное значение "+f(expected[i])+" мм"));});
      var choice=host.querySelector('input[name="mtpDecision"]:checked'),decision=choice?choice.value:"",decisionOK=decision===(p.accepted?"yes":"no");
      if(decisionOK)score++;
      lines.push("Оценка фактического размера: "+(decisionOK?"верно":"неверно; "+(p.accepted?"размер находится в пределах допуска":"размер выходит за пределы допуска")));
      var grade=score===4?5:score===3?4:score===2?3:2,percent=Math.round(score/4*100),box=host.querySelector("#mtpFeedback");
      box.innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-top:12px"><h3>Результат: '+score+' из 4 · предварительная оценка '+grade+'</h3><p>Предельные размеры: '+f(p.min)+'–'+f(p.max)+' мм. Допуск T = ES − EI = '+f(p.es)+' − ('+f(p.ei)+') = '+f(p.tol)+' мм.</p><ul>'+lines.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul><p id="mtpSaveStatus">Отправка результата…</p></div>';
      host.querySelector("#mtpCheck").disabled=true;
      var st=window.state&&window.state.student;
      if(!st||!st.email||!window.API||!window.API.saveResult){host.querySelector("#mtpSaveStatus").textContent="Результат рассчитан локально. Для записи в журнал войдите в аккаунт студента.";return;}
      var date=new Date().toISOString().slice(0,10),payload={variant:p,answers:vals,decision:decision,criteria:lines};
      window.API.saveResult({email:st.email,name:st.name||st.fullName||st.email,group:st.group||"",courseId:"MET",testId:"metrology_tolerance_practice_"+Date.now(),testTitle:"Практикум: предельные размеры и допуск",grade:grade,score:score,maxScore:4,percent:percent,feedback:"Автоматическая предварительная оценка. "+lines.join("; "),payload:JSON.stringify(payload),date:date}).then(function(r){if(!r||r.success===false)throw new Error(r&&r.error||"Сервер не подтвердил запись.");host.querySelector("#mtpSaveStatus").textContent="Результат отправлен в журнал преподавателя. Оценка предварительная.";}).catch(function(e){host.querySelector("#mtpSaveStatus").textContent="Не удалось сохранить результат: "+(e.message||e);});
    }

    function assessmentQuestions(){
      return [
        {q:"Что изучает метрология?",a:["Методы и средства измерений, единство измерений","Только устройство станков","Только химический состав металлов"],c:0,why:"Метрология изучает измерения, методы и средства обеспечения их единства и требуемой точности."},
        {q:"Как определить абсолютную погрешность измерения?",a:["Измеренное значение разделить на номинал","Измеренное значение минус действительное (принятое опорное) значение","Сложить все показания"],c:1,why:"Абсолютная погрешность — разность результата измерения и опорного значения с учётом принятого знака."},
        {q:"Какой инструмент обычно применяют для измерения наружного диаметра с точностью до 0,01 мм?",a:["Линейка","Микрометр","Угольник"],c:1,why:"Микрометр предназначен для точных линейных измерений; конкретная цена деления зависит от модели."},
        {q:"Номинальный размер детали 20 мм, верхнее отклонение +0,1 мм, нижнее −0,1 мм. Каковы предельные размеры?",a:["19,9–20,1 мм","19,0–21,0 мм","20,0–20,1 мм"],c:0,why:"Dmax = 20 + 0,1 = 20,1 мм; Dmin = 20 − 0,1 = 19,9 мм."},
        {q:"Что показывает размах показаний индикатора при контроле биения?",a:["Среднее арифметическое показаний","Разность максимального и минимального показаний","Диаметр детали"],c:1,why:"Размах показаний рассчитывается как Xmax − Xmin."}
      ];
    }
    function submitAssessment(){
      var btn=host.querySelector("#mtaSubmit"),qs=assessmentQuestions(),score=0,details=[];
      qs.forEach(function(q,i){
        var picked=host.querySelector('input[name="mtaQ'+i+'"]:checked'),answer=picked?Number(picked.value):-1,ok=answer===q.c;
        if(ok)score++;
        details.push((i+1)+". "+(ok?"Верно":"Неверно")+". "+q.why);
      });
      var percent=Math.round(score/qs.length*100),grade=percent>=90?5:percent>=75?4:percent>=60?3:2;
      var box=host.querySelector("#mtaResult");
      box.innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:14px;margin-top:12px"><h3>Результат: '+score+' из '+qs.length+' ('+percent+'%)</h3><p>Предварительная оценка: <b>'+grade+'</b></p><ol>'+details.map(function(x){return '<li style="margin:6px 0">'+esc(x)+'</li>';}).join("")+'</ol><p id="mtaSaveStatus">Сохранение результата…</p></div>';
      btn.disabled=true;btn.textContent="Попытка завершена";
      var st=window.state&&window.state.student;
      if(!st||!st.email||!window.API||!window.API.saveResult){host.querySelector("#mtaSaveStatus").textContent="Результат рассчитан на экране, но не отправлен в журнал: войдите в аккаунт студента и повторите попытку.";return;}
      var date=new Date().toISOString().slice(0,10),id="metrology_auto_assessment_"+Date.now();
      window.API.saveResult({email:st.email,name:st.name||st.fullName||st.email,group:st.group||"",testId:id,testTitle:"Метрология: автоматическая самопроверка",courseId:"MET",grade:grade,score:score,maxScore:qs.length,percent:percent,feedback:"Предварительная автооценка. "+details.join(" "),payload:JSON.stringify({answers:details,score:score,maxScore:qs.length}),date:date}).then(function(r){
        if(!r||r.success===false)throw new Error(r&&r.error||"Сервер не подтвердил сохранение.");
        host.querySelector("#mtaSaveStatus").textContent="Результат отправлен в журнал преподавателя. Итоговую оценку подтверждает преподаватель.";
      }).catch(function(e){host.querySelector("#mtaSaveStatus").textContent="Не удалось отправить результат: "+(e.message||e)+". Запишите результат и сообщите преподавателю.";});
    }

    function loadTeacherJournal(){
      var actor=window.state&&window.state.staff,access=host.querySelector("#mtjAccess"),form=host.querySelector("#mtjForm"),resultsBox=host.querySelector("#mtjResults");
      if(!actor||!["teacher","admin"].includes(actor.role)){access.textContent="Доступ закрыт: журнал доступен только преподавателю или администратору.";return;}
      if(!window.API||!window.API.getStudents||!window.API.getResults||!window.API.saveResult){access.textContent="API журнала недоступен. Проверь подключение к порталу.";return;}
      Promise.all([window.API.getStudents(),window.API.getResults({courseId:"MET"})]).then(function(pair){
        var sr=pair[0],rr=pair[1];
        if(!sr||!(sr.ok||sr.success)||!Array.isArray(sr.students))throw new Error(sr&&sr.error||"Не удалось получить список студентов.");
        if(!rr||!rr.success)throw new Error(rr&&rr.error||"Не удалось получить результаты метрологии.");
        var students=sr.students.filter(function(s){return String(s.role||"student").toLowerCase()==="student"&&(actor.role==="admin"||(s.courses||[]).includes("MET"));});
        if(!students.length){access.textContent="Студенты курса «Метрология» пока не назначены. Проверьте назначение курса в настройках доступа.";return;}
        form.style.display="block";access.textContent="Загружено студентов: "+students.length+". Оценки сохраняются в общей базе портала.";
        var groups=Array.from(new Set(students.map(function(s){return s.group||"Без группы";}))).sort();
        var groupSel=host.querySelector("#mtjGroup"),studentSel=host.querySelector("#mtjStudent");
        groupSel.innerHTML=groups.map(function(g){return '<option value="'+esc(g)+'">'+esc(g)+'</option>';}).join("");
        function fillStudents(){
          var group=groupSel.value,list=students.filter(function(s){return (s.group||"Без группы")===group;});
          studentSel.innerHTML=list.map(function(s){return '<option value="'+esc(s.email)+'">'+esc(s.name)+' — '+esc(s.email)+'</option>';}).join("");
        }
        groupSel.onchange=fillStudents;fillStudents();
        var rows=(rr.results||[]).filter(function(x){return x.courseId==="MET"&&String(x.testId||"").indexOf("metrology_")===0;});
        function renderRows(){
          var selected=groupSel.value,filtered=rows.filter(function(x){var st=students.find(function(z){return z.email===x.email;});return !st||!selected||st.group===selected;});
          if(!filtered.length){resultsBox.innerHTML='<p style="color:var(--muted)">Оценок пока нет.</p>';return;}
          function resultType(x){return /^metrology_(caliper|micrometer|depth|indicator|tolerance|protocol)_\d{8}$/.test(String(x.testId||""))?"Оценка преподавателя":"Самопроверка / предварительный результат";}
          resultsBox.innerHTML='<button class="btn" id="mtjCsv" style="margin:0 0 10px">Скачать ведомость CSV</button><div style="overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;padding:7px">Дата</th><th style="text-align:left;padding:7px">Студент</th><th style="text-align:left;padding:7px">Работа</th><th style="text-align:left;padding:7px">Тип результата</th><th style="padding:7px">Оценка</th><th style="text-align:left;padding:7px">Комментарий</th></tr></thead><tbody>'+filtered.slice().sort(function(a,b){return String(b.date||b.finishedAt||"").localeCompare(String(a.date||a.finishedAt||""));}).map(function(x){return '<tr style="border-top:1px solid var(--border)"><td style="padding:7px">'+esc(x.date||"—")+'</td><td style="padding:7px">'+esc(x.name||x.email)+'</td><td style="padding:7px">'+esc(x.testTitle||x.testId)+'</td><td style="padding:7px">'+esc(resultType(x))+'</td><td style="padding:7px;text-align:center"><b>'+esc(x.grade)+'</b></td><td style="padding:7px">'+esc(x.feedback||x.payload||"")+'</td></tr>';}).join("")+'</tbody></table></div>';
          var exportButton=resultsBox.querySelector("#mtjCsv");
          if(exportButton)exportButton.onclick=function(){
            var csvRows=[["Дата","Группа","ФИО","Email","Работа","Тип результата","Оценка","Комментарий"]].concat(filtered.map(function(x){return [x.date||x.finishedAt||"",x.group||"",x.name||"",x.email||"",x.testTitle||x.testId||"",resultType(x),x.grade||"",x.feedback||x.payload||""];}));
            var csv="\uFEFF"+csvRows.map(function(row){return row.map(function(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"';}).join(";");}).join("\r\n");
            var blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
            a.href=url;a.download="vedomost-metrologiya.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
          };
        }
        renderRows();groupSel.addEventListener("change",renderRows);
        host.querySelector("#mtjSave").onclick=function(){
          var student=students.find(function(s){return s.email===studentSel.value;}),date=host.querySelector("#mtjDate").value,work=host.querySelector("#mtjWork"),grade=Number(host.querySelector("#mtjGrade").value),feedback=host.querySelector("#mtjFeedback").value.trim();
          if(!student||!date){host.querySelector("#mtjStatus").textContent="Выберите студента и дату.";return;}
          var title=work.options[work.selectedIndex].text,testId="metrology_"+work.value+"_"+date.replace(/-/g,"");
          var btn=this;btn.disabled=true;btn.textContent="Сохранение…";
          window.API.saveTeacherResult({email:student.email,name:student.name,group:student.group,testId:testId,testTitle:title+" ("+date+")",grade:grade,score:grade,maxScore:5,percent:grade*20,courseId:"MET",payload:"Лабораторная работа: "+title+"; дата: "+date,feedback:feedback,date:date}).then(function(saved){
            if(!saved||saved.success===false)throw new Error(saved&&saved.error||"Сервер не подтвердил сохранение.");
            var rec={email:student.email,name:student.name,group:student.group,testId:testId,testTitle:title+" ("+date+")",grade:grade,feedback:feedback,date:date,courseId:"MET"};
            rows=rows.filter(function(x){return !(x.email===student.email&&x.testId===testId);});rows.push(rec);renderRows();
            host.querySelector("#mtjStatus").textContent="Оценка "+grade+" сохранена в общей базе портала.";
            host.querySelector("#mtjFeedback").value="";
          }).catch(function(err){host.querySelector("#mtjStatus").textContent="Не удалось сохранить: "+(err.message||err);}).finally(function(){btn.disabled=false;btn.textContent="Сохранить оценку в журнал";});
        };
      }).catch(function(err){access.textContent="Ошибка загрузки журнала: "+(err.message||err);});
    }

    render();
  };
})();