"use strict";
(function(){
  function rnd(n){return Math.floor(Math.random()*n);}
  function round(v){return Number(v.toFixed(2));}
  function fmt(v){return Number(v).toFixed(2).replace(".",",");}
  function num(v){var raw=String(v==null?"":v).trim();return raw===""?NaN:Number(raw.replace(",","."));}
  function esc(v){return String(v==null?"":v).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function makeTask(){
    var d=round(24+rnd(30)/10),l=round(38+rnd(40)/10),h=round(5+rnd(30)/10);
    var dt=.10,lt=.20,ht=.10,rt=.05;
    function actual(nom,tol,forceOut){var delta=(rnd(17)-8)*.01;if(forceOut)return round(nom+tol/2+.08);return round(nom+delta);}
    var forceOut=rnd(2)===0;
    var diam=actual(d,dt,forceOut),len=actual(l,lt,false),depth=actual(h,ht,false);
    var min=round(.02+rnd(5)*.01),runout=round(.01+rnd(8)*.01),max=round(min+runout);
    return {part:"Ступенчатая контрольная деталь №"+(100+rnd(900)),d:d,l:l,h:h,dt:dt,lt:lt,ht:ht,rt:rt,diam:diam,len:len,depth:depth,min:min,max:max,forceOut:forceOut};
  }
  function within(v,nom,tol){return Number.isFinite(v)&&v>=nom-tol/2-1e-9&&v<=nom+tol/2+1e-9;}
  function mount(){
    var app=document.getElementById("app");if(!app||app.querySelector("#metrologyComplexWork"))return;
    var task=makeTask(),finished=false,answers=null;
    var section=document.createElement("section");section.id="metrologyComplexWork";section.className="card";section.style.cssText="padding:16px;margin-top:16px";
    app.appendChild(section);
    function render(){
      var t=task;
      section.innerHTML='<h2>Комплексная лабораторная работа: контроль детали</h2>'+
      '<p>Выполни контроль пяти параметров условной детали. Внеси показания измерений, рассчитай размах индикатора и вынеси заключение о годности.</p>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px">'+
      '<div class="card" style="padding:10px"><b>Деталь</b><div>'+esc(t.part)+'</div></div>'+
      '<div class="card" style="padding:10px"><b>Штангенциркуль</b><div>Длина '+fmt(t.l)+' ± '+fmt(t.lt/2)+' мм</div></div>'+
      '<div class="card" style="padding:10px"><b>Микрометр</b><div>Диаметр '+fmt(t.d)+' ± '+fmt(t.dt/2)+' мм</div></div>'+
      '<div class="card" style="padding:10px"><b>Глубиномер</b><div>Глубина '+fmt(t.h)+' ± '+fmt(t.ht/2)+' мм</div></div>'+
      '<div class="card" style="padding:10px"><b>Индикатор</b><div>Допустимый размах ≤ '+fmt(t.rt)+' мм</div></div></div>'+
      '<h3>Протокол измерений</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">'+
      '<label>Диаметр по микрометру, мм<input id="mcDiam" inputmode="decimal" style="display:block;width:100%;padding:10px" placeholder="Например, '+fmt(t.d)+'"></label>'+
      '<label>Длина по штангенциркулю, мм<input id="mcLen" inputmode="decimal" style="display:block;width:100%;padding:10px" placeholder="Например, '+fmt(t.l)+'"></label>'+
      '<label>Глубина, мм<input id="mcDepth" inputmode="decimal" style="display:block;width:100%;padding:10px" placeholder="Например, '+fmt(t.h)+'"></label>'+
      '<label>Min индикатора, мм<input id="mcMin" inputmode="decimal" style="display:block;width:100%;padding:10px" placeholder="Min"></label>'+
      '<label>Max индикатора, мм<input id="mcMax" inputmode="decimal" style="display:block;width:100%;padding:10px" placeholder="Max"></label></div>'+
      '<label style="display:block;margin-top:12px">Заключение студента<select id="mcDecision" style="display:block;padding:10px;width:100%;max-width:360px"><option value="">Выбери заключение</option><option value="ok">Деталь годна</option><option value="reject">Деталь не годна</option></select></label>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn btn-primary" id="mcCheck">Проверить работу</button><button class="btn" id="mcNew" disabled>Новый вариант</button><button class="btn" id="mcReport" disabled>Скачать отчёт</button></div><div id="mcFeedback" aria-live="polite"></div>'+
      '<details style="margin-top:14px"><summary>Инструкция по выполнению и безопасности</summary><ol><li>Осмотри деталь и измерительные средства; проверь нулевое положение.</li><li>Диаметр измеряй микрометром в нескольких сечениях без чрезмерного усилия.</li><li>Длину измеряй штангенциркулем, глубину — глубиномером.</li><li>Биение контролируй индикатором при отключённом приводе, поворачивая деталь вручную.</li><li>Запиши минимум и максимум, вычисли размах: R = Xmax − Xmin.</li><li>Сравни результаты с предельными значениями и оформи заключение.</li></ol><p style="color:var(--muted)">Это учебный расчётный вариант, а не реальные результаты измерения и не аттестация средства измерений.</p></details>';
      section.querySelector("#mcCheck").onclick=check;
      section.querySelector("#mcNew").onclick=function(){task=makeTask();finished=false;answers=null;render();};
      section.querySelector("#mcReport").onclick=downloadReport;
    }
    function check(){
      if(finished)return;
      var t=task,vals={diam:num(section.querySelector("#mcDiam").value),len:num(section.querySelector("#mcLen").value),depth:num(section.querySelector("#mcDepth").value),min:num(section.querySelector("#mcMin").value),max:num(section.querySelector("#mcMax").value)},decision=section.querySelector("#mcDecision").value;
      if(!Object.keys(vals).every(function(k){return Number.isFinite(vals[k]);})||!decision){section.querySelector("#mcFeedback").textContent="Заполни все пять измерений и выбери заключение.";return;}
      if(vals.max<vals.min){section.querySelector("#mcFeedback").textContent="Показание Max не может быть меньше Min.";return;}
      var run=round(vals.max-vals.min),checks=[
        {label:"Диаметр",ok:within(vals.diam,t.d,t.dt),expected:"от "+fmt(t.d-t.dt/2)+" до "+fmt(t.d+t.dt/2)+" мм"},
        {label:"Длина",ok:within(vals.len,t.l,t.lt),expected:"от "+fmt(t.l-t.lt/2)+" до "+fmt(t.l+t.lt/2)+" мм"},
        {label:"Глубина",ok:within(vals.depth,t.h,t.ht),expected:"от "+fmt(t.h-t.ht/2)+" до "+fmt(t.h+t.ht/2)+" мм"},
        {label:"Размах биения",ok:run<=t.rt+1e-9,expected:"R = "+fmt(run)+" мм; предел ≤ "+fmt(t.rt)+" мм"}
      ];
      var actualOK=checks.every(function(x){return x.ok;}),decisionOK=decision===(actualOK?"ok":"reject");
      var score=checks.filter(function(x){return x.ok;}).length+(decisionOK?1:0),grade=score===5?5:score===4?4:score>=2?3:2;
      answers={vals:vals,run:run,checks:checks,decision:decision,actualOK:actualOK,decisionOK:decisionOK,score:score,grade:grade};
      finished=true;
      section.querySelector("#mcFeedback").innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-top:12px"><h3>Результат: '+score+'/5 · предварительная оценка '+grade+'</h3><p>Фактическое заключение по заданным показаниям: <b>'+(actualOK?"деталь годна":"деталь не годна")+'</b>.</p><ul>'+checks.map(function(x){return '<li>'+esc(x.label)+': <b>'+(x.ok?"соответствует":"не соответствует")+'</b> — '+esc(x.expected)+'</li>';}).join("")+'<li>Итоговое решение: '+(decisionOK?"верно":"ошибка")+'</li></ul><p>Размах индикатора: '+fmt(vals.max)+' − '+fmt(vals.min)+' = '+fmt(run)+' мм.</p><p id="mcSaveStatus">Подготовка результата…</p></div>';
      section.querySelector("#mcCheck").disabled=true;section.querySelector("#mcNew").disabled=false;section.querySelector("#mcReport").disabled=false;
      var st=window.state&&window.state.student;
      if(st&&st.email&&window.API&&window.API.saveResult){
        window.API.saveResult({email:st.email,name:st.name||st.fullName||st.email,group:st.group||"",courseId:"MET",testId:"metrology_complex_inspection_"+Date.now(),testTitle:"Комплексная лабораторная работа: контроль детали",grade:grade,score:score,maxScore:5,percent:score*20,feedback:"Предварительная автооценка. "+checks.map(function(x){return x.label+": "+(x.ok?"норма":"отклонение");}).join("; "),payload:JSON.stringify({part:t.part,nominal:{diam:t.d,len:t.l,depth:t.h},answers:answers}),date:new Date().toISOString().slice(0,10)}).then(function(r){if(!r||r.success===false)throw new Error(r&&r.error||"Сервер не подтвердил запись");section.querySelector("#mcSaveStatus").textContent="Результат отправлен в журнал преподавателя. Итоговую оценку подтверждает преподаватель.";}).catch(function(e){section.querySelector("#mcSaveStatus").textContent="Не удалось сохранить на сервере: "+(e.message||e)+". Отчёт можно скачать локально.";});
      }else section.querySelector("#mcSaveStatus").textContent="Результат доступен локально. Для отправки в журнал войди в аккаунт студента.";
    }
    function downloadReport(){
      if(!answers)return;
      var t=task,a=answers,st=window.state&&window.state.student||{},lines=["ОТЧЁТ: КОМПЛЕКСНАЯ ЛАБОРАТОРНАЯ РАБОТА ПО МЕТРОЛОГИИ","Студент: "+(st.name||st.fullName||""),"Группа: "+(st.group||""),"Дата: "+new Date().toLocaleDateString("ru-RU"),"Деталь: "+t.part,"","Параметр;Номинал/предел;Показание;Результат","Диаметр;"+fmt(t.d)+" ± "+fmt(t.dt/2)+" мм;"+fmt(a.vals.diam)+" мм;"+(a.checks[0].ok?"соответствует":"не соответствует"),"Длина;"+fmt(t.l)+" ± "+fmt(t.lt/2)+" мм;"+fmt(a.vals.len)+" мм;"+(a.checks[1].ok?"соответствует":"не соответствует"),"Глубина;"+fmt(t.h)+" ± "+fmt(t.ht/2)+" мм;"+fmt(a.vals.depth)+" мм;"+(a.checks[2].ok?"соответствует":"не соответствует"),"Биение;≤ "+fmt(t.rt)+" мм;"+fmt(a.run)+" мм;"+(a.checks[3].ok?"соответствует":"не соответствует"),"","Заключение по показаниям: "+(a.actualOK?"деталь годна":"деталь не годна"),"Ответ студента: "+(a.decision==="ok"?"деталь годна":"деталь не годна"),"Баллы: "+a.score+"/5","Предварительная оценка: "+a.grade,"Примечание: учебный отчёт, не документ о фактическом контроле изделия."];
      var blob=new Blob(["\uFEFF"+lines.join("\r\n")],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="metrologiya-kompleksny-otchet.txt";document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
    }
    render();
  }
  var original=window.renderMetrologyLabPlus;
  if(typeof original==="function")window.renderMetrologyLabPlus=function(){original();mount();};
  else window.addEventListener("load",mount);
})();