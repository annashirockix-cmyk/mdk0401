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
    var data=read(),mode="depth",task=make(mode),done=false;
    var host=document.createElement("section");
    host.className="card";host.style.cssText="padding:16px;margin-top:16px";
    app.appendChild(host);
    function make(k){
      if(k==="depth"){var a=4+rnd(16),b=1+rnd(9);return {answer:a+b*.1,ex:"Основная шкала "+a+" мм; нониус "+b+" × 0,1 мм. Глубина = "+f(a+b*.1)+" мм."};}
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
        '<p><b>Дано:</b> '+(mode==="depth"?"основная шкала — "+Math.floor(task.answer*10)/10+" мм; отсчёт нониуса учитывается в ответе.":"минимум — "+f(task.min)+" мм; максимум — "+f(task.max)+" мм.")+'</p><label>Ответ, мм <input id="plusAnswer" inputmode="decimal" placeholder="Например, 12,4" style="padding:10px;max-width:220px"></label> <button class="btn btn-primary" id="plusCheck">Проверить</button> <button class="btn" id="plusNext" disabled>Новое задание</button><div id="plusFeedback" aria-live="polite"></div>';
      }else if(mode==="tolerance"){
        body='<p>Введи номинал, верхнее и нижнее отклонения (со знаком), а также фактический размер.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px">'+[['Номинал','tolNom','20'],['Верхнее отклонение','tolES','0.1'],['Нижнее отклонение','tolEI','-0.1'],['Фактический размер','tolFact','20.04']].map(x=>'<label>'+x[0]+'<input id="'+x[1]+'" type="number" step="0.001" value="'+x[2]+'" style="display:block;width:100%;padding:10px"></label>').join("")+'</div><button class="btn btn-primary" id="plusTol" style="margin-top:12px">Рассчитать</button><div id="plusTolResult" aria-live="polite"></div><p style="font-size:13px;color:var(--muted)">Учебная оценка по предельным размерам. В реальном контроле учитываются неопределённость и установленное правило принятия решения.</p>';
      }else{
        var r=data.report||{};
        body='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">'+[['ФИО','rpName',r.name],['Группа','rpGroup',r.group],['Дата','rpDate',r.date||new Date().toISOString().slice(0,10)],['Деталь','rpPart',r.part]].map(x=>'<label>'+x[0]+'<input id="'+x[1]+'" value="'+esc(x[2])+'" style="display:block;width:100%;padding:10px"></label>').join("")+'</div><h3>Измеренные параметры</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><tr><th>Параметр</th><th>Требование</th><th>Средство</th><th>Результат</th></tr>'+[0,1,2,3].map(i=>'<tr>'+['p','req','tool','val'].map(k=>'<td style="padding:3px"><input data-ri="'+i+'" data-rk="'+k+'" value="'+esc((r.rows||[])[i]?.[k])+'" style="min-width:90px;width:100%;padding:8px"></td>').join("")+'</tr>').join("")+'</table></div><label>Заключение<textarea id="rpConclusion" rows="3" style="display:block;width:100%;padding:10px">'+esc(r.conclusion)+'</textarea></label><button class="btn btn-primary" id="plusSave">Сохранить протокол</button> <button class="btn" id="plusCsv">Скачать CSV</button> <button class="btn" id="plusPrint">Печать / PDF</button><div id="plusMsg" aria-live="polite"></div><p style="font-size:13px;color:var(--muted)">Записывай только фактически полученные измерения. Учебные данные не выдавай за результаты контроля.</p>';
      }
      host.innerHTML='<h2 style="margin:0 0 6px">Дополнительная лаборатория</h2><p style="margin:0;color:var(--muted)">Глубиномер · индикатор биения · допуски · оформление протокола</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0">'+tabButton("depth","Глубиномер")+tabButton("indicator","Биение")+tabButton("tolerance","Допуски")+tabButton("report","Протокол")+'</div><div class="card" style="padding:14px">'+body+'</div>';
      host.querySelectorAll("[data-plus-tab]").forEach(b=>b.onclick=function(){mode=b.dataset.plusTab;task=make(mode);done=false;render();});
      if(mode==="depth"||mode==="indicator"){
        host.querySelector("#plusCheck").onclick=check;
        host.querySelector("#plusNext").onclick=function(){task=make(mode);done=false;render();};
      }
      if(mode==="tolerance")host.querySelector("#plusTol").onclick=calc;
      if(mode==="report"){host.querySelector("#plusSave").onclick=saveReport;host.querySelector("#plusCsv").onclick=csv;host.querySelector("#plusPrint").onclick=function(){window.print();};}
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
    render();
  };
})();