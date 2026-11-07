"use strict";
(function(){
 var topics={
  caliper:{name:"Штангенциркуль",theory:"Показание складывается из целых миллиметров основной шкалы и совпавшего деления нониуса. Для учебного примера цена деления нониуса — 0,1 мм.",formula:"L = Lосн + n × 0,1 мм",example:"Основная шкала — 24 мм, совпало 7-е деление: 24 + 7 × 0,1 = 24,7 мм.",make:function(){var a=20+Math.floor(Math.random()*30),n=1+Math.floor(Math.random()*9);return {question:"Основная шкала показывает "+a+" мм, совпало "+n+"-е деление нониуса. Найди размер.",answer:a+n/10,unit:"мм",explain:a+" + "+n+" × 0,1 = "+fmt(a+n/10)+" мм",tol:.011};}},
  micrometer:{name:"Микрометр",theory:"В учебной модели показание микрометра складывается из значения на стебле и барабане. Цена деления барабана — 0,01 мм.",formula:"L = Lстебля + n × 0,01 мм",example:"Стебель — 8,5 мм, барабан — 23 деления: 8,5 + 0,23 = 8,73 мм.",make:function(){var a=5+Math.floor(Math.random()*15),half=Math.random()<.5?0:.5,n=1+Math.floor(Math.random()*49),base=a+half;return {question:"На стебле видно "+fmt(base)+" мм, барабан показывает "+n+" делений. Определи размер.",answer:base+n/100,unit:"мм",explain:fmt(base)+" + "+n+" × 0,01 = "+fmt(base+n/100)+" мм",tol:.0011};}},
  depth:{name:"Глубиномер",theory:"Глубиномер устанавливают опорной поверхностью на базовую плоскость. Глубину определяют по основной шкале и нониусу.",formula:"h = hосн + n × цена деления",example:"Основная шкала — 12 мм, нониус — 4 деления по 0,1 мм: h = 12,4 мм.",make:function(){var a=5+Math.floor(Math.random()*25),n=1+Math.floor(Math.random()*9);return {question:"Основная шкала глубиномера — "+a+" мм, совпало "+n+"-е деление нониуса (0,1 мм). Найди глубину.",answer:a+n/10,unit:"мм",explain:a+" + "+n+" × 0,1 = "+fmt(a+n/10)+" мм",tol:.011};}},
  indicator:{name:"Индикатор и биение",theory:"При контроле биения записывают наибольшее и наименьшее показания индикатора. Размах показаний равен разности максимума и минимума.",formula:"R = Xmax − Xmin",example:"Xmax = 0,08 мм, Xmin = 0,02 мм. R = 0,06 мм.",make:function(){var a=2+Math.floor(Math.random()*8),d=1+Math.floor(Math.random()*8);return {question:"Индикатор показал минимум "+fmt(a/100)+" мм и максимум "+fmt((a+d)/100)+" мм. Рассчитай размах R.",answer:d/100,unit:"мм",explain:fmt((a+d)/100)+" − "+fmt(a/100)+" = "+fmt(d/100)+" мм",tol:.00011};}},
  tolerance:{name:"Допуски и предельные размеры",theory:"Верхний предельный размер равен номиналу плюс верхнее отклонение. Нижний — номиналу плюс нижнее отклонение. Допуск — разность предельных размеров.",formula:"Dmax = D + ES; Dmin = D + EI; T = ES − EI",example:"D = 20 мм, ES = +0,03 мм, EI = −0,02 мм. T = 0,05 мм.",make:function(){var d=20+Math.floor(Math.random()*30),es=(1+Math.floor(Math.random()*5))/100,ei=-(1+Math.floor(Math.random()*5))/100;return {question:"Номинал "+d+" мм, ES = +"+fmt(es)+" мм, EI = "+fmt(ei)+" мм. Найди допуск T в миллиметрах.",answer:es-ei,unit:"мм",explain:"T = ES − EI = "+fmt(es)+" − ("+fmt(ei)+") = "+fmt(es-ei)+" мм",tol:.00011};}},
  error:{name:"Погрешности измерений",theory:"Абсолютная погрешность — разность измеренного и принятого за истинное значения. Относительная погрешность — модуль абсолютной погрешности, делённый на опорное значение, умноженный на 100%.",formula:"Δ = Xизм − Xэт; δ = |Δ| / Xэт × 100%",example:"Xэт = 50,00 мм, Xизм = 50,05 мм. |Δ| = 0,05 мм; δ = 0,1%.",make:function(){var ref=10+Math.floor(Math.random()*90),d=(1+Math.floor(Math.random()*9))/100,sign=Math.random()<.5?-1:1;return {question:"Эталонное значение "+fmt(ref)+" мм, измерено "+fmt(ref+sign*d)+" мм. Найди модуль абсолютной погрешности |Δ| в мм.",answer:d,unit:"мм",explain:"|Δ| = |"+fmt(ref+sign*d)+" − "+fmt(ref)+"| = "+fmt(d)+" мм",tol:.00011};}}
 };
 function fmt(n){return Number(n).toFixed(3).replace(".",",").replace(/,?0+$/,"");}
 function mount(){
  var app=document.getElementById("app");if(!app||app.querySelector("#metrologyAdaptive"))return;
  var box=document.createElement("section");box.id="metrologyAdaptive";box.className="card";box.style.cssText="padding:16px;margin-top:16px";
  box.innerHTML='<h2>Персональный тренажёр повторения</h2><p>Выбери тему, изучи короткое напоминание и реши новый индивидуальный пример. После проверки результат можно отправить в журнал.</p><div id="maChoose" style="display:flex;gap:8px;flex-wrap:wrap">'+Object.keys(topics).map(function(k){return '<button class="btn" data-topic="'+k+'">'+topics[k].name+'</button>';}).join("")+'</div><div id="maTask" style="margin-top:14px"></div>';
  app.appendChild(box);
  var chosen=null,task=null;
  var personalBox=document.createElement("div");personalBox.id="maPersonalAdvice";personalBox.style.cssText="border:1px solid var(--border);border-radius:10px;padding:12px;margin:12px 0";
  personalBox.innerHTML="<b>Мои рекомендации</b><p>Проверяем сохранённые результаты…</p>";
  box.insertBefore(personalBox,box.querySelector("#maChoose"));
  function loadPersonalAdvice(){
   var student=window.state&&window.state.student;
   if(!student||!student.email){personalBox.innerHTML="<b>Индивидуальные рекомендации</b><p>Они появятся после входа в аккаунт обучающегося и сохранения результатов по метрологии.</p>";return;}
   if(!window.API||!window.API.getMyCourseResults){personalBox.innerHTML="<b>Мои рекомендации</b><p>Сервис оценок временно недоступен.</p>";return;}
   window.API.getMyCourseResults("MET").then(function(res){
    if(!res||!res.success)throw new Error(res&&res.error||"Не удалось загрузить ваши результаты");
    var defs=[
     {id:"caliper",name:"Штангенциркуль",re:/штангенцирк|caliper/i,advice:"Повтори основную шкалу, нониус и цену деления."},
     {id:"micrometer",name:"Микрометр",re:/микрометр|micrometer/i,advice:"Повтори шкалу стебля, барабан и назначение трещотки."},
     {id:"depth",name:"Глубиномер",re:/глубиномер|глубин/i,advice:"Повтори установку на базовую плоскость и считывание глубины."},
     {id:"indicator",name:"Индикатор и биение",re:/индикатор|биени|runout|dial/i,advice:"Повтори определение Xmax, Xmin и расчёт R = Xmax − Xmin."},
     {id:"tolerance",name:"Допуски и предельные размеры",re:/допуск|предельн|посадк|tolerance/i,advice:"Повтори Dmax, Dmin, допуск и проверку годности."},
     {id:"error",name:"Погрешности измерений",re:/погрешност|ошибк.*измер|точност|error/i,advice:"Повтори абсолютную и относительную погрешность."}
    ];
    var rows=Array.isArray(res.results)?res.results:[];
    var advice=defs.map(function(def){
     var subset=rows.filter(function(r){return def.re.test([r.testId,r.testTitle,r.feedback||"",r.payload||""].join(" "));});
     var grades=subset.map(function(r){return Number(r.grade);}).filter(Number.isFinite);
     var low=grades.filter(function(g){return g<4;}).length;
     var mean=grades.length?grades.reduce(function(x,y){return x+y;},0)/grades.length:null;
     return {id:def.id,name:def.name,advice:def.advice,count:grades.length,low:low,mean:mean};
    }).filter(function(x){return x.count&& (x.low>0||x.mean<4);}).sort(function(x,y){return y.low-x.low||(x.mean||0)-(y.mean||0);}).slice(0,3);
    personalBox.innerHTML="<b>Мои рекомендации</b>"+(advice.length?"<p>По сохранённым оценкам стоит уделить внимание следующим темам:</p><ul>"+advice.map(function(x){return "<li><b>"+x.name+"</b> — "+x.advice+" <small>(средний балл "+x.mean.toFixed(1)+", результатов: "+x.count+")</small> <button type='button' class='btn' data-recommend-topic='"+x.id+"'>Потренироваться</button></li>";}).join("")+"</ul>":"<p>По распознанным и оценённым работам сейчас нет явных сигналов для дополнительного повторения. Если результатов мало, рекомендации могут быть неполными.</p>");
    personalBox.querySelectorAll("[data-recommend-topic]").forEach(function(btn){btn.onclick=function(){chosen=btn.getAttribute("data-recommend-topic");next();box.querySelector("#maTask").scrollIntoView({behavior:"smooth",block:"start"});};});
   }).catch(function(e){personalBox.innerHTML="<b>Мои рекомендации</b><p>Не удалось загрузить рекомендации: "+String(e.message||e).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];})+"</p>";});
  }
  loadPersonalAdvice();
  function next(){task=topics[chosen].make();var t=topics[chosen];box.querySelector("#maTask").innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:14px"><h3>'+t.name+'</h3><p><b>Краткая теория.</b> '+t.theory+'</p><p><b>Формула:</b> <code>'+t.formula+'</code></p><p><b>Пример:</b> '+t.example+'</p><hr><p><b>Задание.</b> '+task.question+'</p><label>Ответ ('+task.unit+')<input id="maAnswer" inputmode="decimal" placeholder="Введи число" style="display:block;width:100%;max-width:280px;padding:10px;margin-top:5px"></label><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn btn-primary" id="maCheck">Проверить</button><button class="btn" id="maNext">Другой вариант</button></div><div id="maFeedback" aria-live="polite" style="margin-top:12px"></div></div>';
   box.querySelector("#maCheck").onclick=check;box.querySelector("#maNext").onclick=next;
  }
  function check(){var raw=box.querySelector("#maAnswer").value.trim().replace(",",".");var val=raw===""?NaN:Number(raw);if(!Number.isFinite(val)){box.querySelector("#maFeedback").textContent="Введи числовой ответ.";return;}var ok=Math.abs(val-task.answer)<=task.tol,grade=ok?5:2,feedback=box.querySelector("#maFeedback");feedback.innerHTML='<p><b>'+(ok?"Верно!":"Пока неверно.")+'</b> Правильное решение: '+task.explain+'.</p><p>Предварительная оценка: '+grade+'. Для закрепления реши ещё один вариант.</p><p id="maSaveStatus">Сохранение результата…</p>';
   var st=window.state&&window.state.student;
   if(!st||!st.email||!window.API||!window.API.saveResult){feedback.querySelector("#maSaveStatus").textContent="Результат показан локально. Чтобы отправить его в журнал, войди в аккаунт студента.";return;}
   var date=new Date().toISOString().slice(0,10),id="metrology_adaptive_"+chosen+"_"+Date.now();
   window.API.saveResult({email:st.email,name:st.name||st.fullName||st.email,group:st.group||"",courseId:"MET",testId:id,testTitle:"Повторение: "+topics[chosen].name,grade:grade,score:ok?1:0,maxScore:1,percent:ok?100:0,feedback:"Адаптивное повторение. "+(ok?"Ответ верный. ":"Ответ неверный. ")+task.explain,payload:JSON.stringify({topic:chosen,question:task.question,answer:val,expected:task.answer,correct:ok,explanation:task.explain}),date:date}).then(function(r){if(!r||r.success===false)throw new Error(r&&r.error||"Сервер не подтвердил запись");var el=feedback.querySelector("#maSaveStatus");if(el)el.textContent="Результат сохранён в журнале преподавателя.";}).catch(function(e){var el=feedback.querySelector("#maSaveStatus");if(el)el.textContent="Не удалось сохранить: "+(e.message||e);});
  }
  box.querySelectorAll("[data-topic]").forEach(function(b){b.onclick=function(){chosen=b.getAttribute("data-topic");next();};});
 }
 var prior=window.renderMetrologyLabPlus;
 if(typeof prior==="function")window.renderMetrologyLabPlus=function(){prior();mount();};
 else window.addEventListener("load",mount);
})();