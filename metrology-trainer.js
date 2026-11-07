"use strict";
(function(){
  var KEY="mdk.metrologyTrainer.v1";
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){return {};}}
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
  function rnd(n){return Math.floor(Math.random()*n);}
  function makeQuestion(kind){
    if(kind==="caliper"){
      var whole=12+rnd(30), tick=1+rnd(9), price=0.1;
      return {kind:kind,whole:whole,tick:tick,price:price,answer:(whole+tick*price).toFixed(2),unit:"мм",
        explain:"Основная шкала: "+whole+" мм. Совпавшая риска нониуса: "+tick+". Цена деления: 0,1 мм. Показание = "+whole+" + "+tick+" × 0,1 = "+(whole+tick*price).toFixed(2)+" мм."};
    }
    var base=5+rnd(20),half=rnd(2),drum=1+rnd(49),sleeve=base+half*0.5;
    return {kind:kind,sleeve:sleeve,drum:drum,price:0.01,answer:(sleeve+drum*0.01).toFixed(2),unit:"мм",
      explain:"Стебель: "+sleeve.toFixed(1)+" мм. Барабан: "+drum+" делений × 0,01 мм = "+(drum*0.01).toFixed(2)+" мм. Показание = "+(sleeve+drum*0.01).toFixed(2)+" мм."};
  }
  function caliperSvg(q){
    var x0=110,step=26,zero=x0+8*step+q.tick*2.6;
    var s='<svg viewBox="0 0 650 178" role="img" aria-label="Шкала штангенциркуля с основной шкалой и нониусом" style="width:100%;max-width:650px;background:#f8fafc;border-radius:10px">';
    s+='<text x="18" y="22" font-size="13" fill="#334155">Основная шкала · деление 1 мм</text><line x1="20" y1="75" x2="630" y2="75" stroke="#64748b" stroke-width="2"/>';
    for(var i=0;i<21;i++){var x=x0+i*step;s+='<line x1="'+x+'" y1="43" x2="'+x+'" y2="'+(i%5===0?75:61)+'" stroke="#334155" stroke-width="1.4"/>';if(i%2===0)s+='<text x="'+(x-4)+'" y="91" font-size="10" fill="#334155">'+i+'</text>';}
    s+='<text x="18" y="119" font-size="13" fill="#334155">Нониус · деление 0,1 мм</text><line x1="20" y1="151" x2="630" y2="151" stroke="#64748b" stroke-width="2"/>';
    s+='<line x1="'+zero+'" y1="121" x2="'+zero+'" y2="158" stroke="#0f766e" stroke-width="3"/><text x="'+(zero-4)+'" y="174" font-size="10" fill="#0f766e">0</text>';
    for(var j=1;j<=10;j++){var vx=zero+j*step*0.9;var match=j===q.tick;s+='<line x1="'+vx+'" y1="129" x2="'+vx+'" y2="'+(match?160:143)+'" stroke="'+(match?'#dc2626':'#334155')+'" stroke-width="'+(match?3:1.3)+'"/>';s+='<text x="'+(vx-3)+'" y="174" font-size="10" fill="'+(match?'#dc2626':'#334155')+'">'+j+'</text>';}
    s+='<text x="430" y="22" font-size="11" fill="#475569">Найди совпавшую риску</text></svg>';
    return s;
  }
  function micrometerSvg(q){
    var s='<svg viewBox="0 0 650 180" role="img" aria-label="Шкала стебля и барабана микрометра" style="width:100%;max-width:650px;background:#f8fafc;border-radius:10px">';
    s+='<text x="20" y="23" font-size="13" fill="#334155">Стебель · основная шкала 0,5 мм</text><rect x="20" y="45" width="430" height="70" rx="8" fill="#dbe4ec" stroke="#64748b"/>';
    for(var i=0;i<32;i++){var x=35+i*12;var major=i%2===0;s+='<line x1="'+x+'" y1="'+(major?54:68)+'" x2="'+x+'" y2="91" stroke="#334155" stroke-width="1.2"/>';if(i%4===0)s+='<text x="'+(x-4)+'" y="107" font-size="10" fill="#334155">'+(i/2)+'</text>';}
    s+='<line x1="20" y1="77" x2="450" y2="77" stroke="#0f766e" stroke-width="2"/><text x="20" y="139" font-size="12" fill="#334155">Барабан · 50 делений, цена деления 0,01 мм</text>';
    s+='<rect x="20" y="146" width="610" height="24" rx="5" fill="#cbd5e1" stroke="#64748b"/>';
    for(var j=0;j<50;j++){var tx=28+j*12;var selected=j===q.drum;s+='<line x1="'+tx+'" y1="'+(selected?142:151)+'" x2="'+tx+'" y2="166" stroke="'+(selected?'#dc2626':'#334155')+'" stroke-width="'+(selected?3:1)+'"/>';if(j%10===0)s+='<text x="'+(tx-3)+'" y="139" font-size="10" fill="#334155">'+j+'</text>';}
    s+='<text x="475" y="62" font-size="12" fill="#475569">Совмести отсчёт</text><text x="475" y="84" font-size="19" font-weight="bold" fill="#0f766e">по индексу</text></svg>';
    return s;
  }
  window.renderMetrologyTrainer=function(){
    var app=document.getElementById("app");if(!app)return;
    var state=load();state.done=state.done||0;state.correct=state.correct||0;state.byKind=state.byKind||{caliper:0,micrometer:0};
    var kind="caliper",q=makeQuestion(kind),answered=false;
    function render(){
      var title=kind==="caliper"?"Штангенциркуль":"Микрометр";
      app.innerHTML='<section class="card" style="padding:clamp(14px,2vw,24px)">'+
      '<div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap"><div><h1 style="margin:0 0 5px">🔬 Тренажёр метролога</h1><p style="margin:0;color:var(--muted)">Считывай показания виртуальных измерительных приборов и проверяй себя</p></div><a class="btn" href="#/">← На главную</a></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0"><button class="btn" id="mtCal" type="button">Штангенциркуль</button><button class="btn" id="mtMic" type="button">Микрометр</button></div>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:14px">'+
      '<div class="card" style="padding:10px"><small>Всего ответов</small><div style="font-size:24px;font-weight:700">'+state.done+'</div></div>'+
      '<div class="card" style="padding:10px"><small>Верных ответов</small><div style="font-size:24px;font-weight:700">'+state.correct+'</div></div>'+
      '<div class="card" style="padding:10px"><small>Точность</small><div style="font-size:24px;font-weight:700">'+(state.done?Math.round(state.correct/state.done*100):0)+'%</div></div>'+
      '<div class="card" style="padding:10px"><small>Режим</small><div style="font-size:18px;font-weight:700">'+title+'</div></div></div>'+
      '<div class="card" style="padding:14px;margin-bottom:12px"><h2 style="margin:0 0 8px;font-size:20px">Задание: определи показание</h2><p style="margin:0 0 12px;color:var(--muted)">'+(kind==="caliper"?"Цена деления нониуса — 0,1 мм. Найди целое значение основной шкалы и совпавшую риску нониуса.":"Цена деления барабана — 0,01 мм. Сложи показание стебля и барабана.")+'</p>'+
      (kind==="caliper"?caliperSvg(q):micrometerSvg(q))+
      '<label for="mtAnswer" style="display:block;font-weight:700;margin:14px 0 6px">Твоё показание, мм</label><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="mtAnswer" inputmode="decimal" placeholder="Например, 24,7" style="max-width:220px;padding:11px;border:1px solid var(--border);border-radius:9px;background:var(--card);color:var(--text)"><button id="mtCheck" class="btn btn-primary" type="button">Проверить</button><button id="mtNext" class="btn" type="button" disabled>Следующее задание →</button></div>'+
      '<div id="mtFeedback" aria-live="polite" style="margin-top:12px"></div></div>'+
      '<details class="card" style="padding:12px"><summary style="cursor:pointer;font-weight:700">Памятка: как выполнять отсчёт</summary><ol><li>Проверь чистоту измерительных поверхностей и нулевое показание.</li><li>Установи прибор без перекоса и чрезмерного усилия.</li><li>Сначала считай основную шкалу, затем добавь долю по нониусу или барабану.</li><li>Запиши результат с единицей измерения.</li></ol><p style="color:var(--muted)">Это учебная визуализация, а не поверенный прибор. Результат тренажёра не заменяет измерение реальной детали.</p></details></section>';
      document.getElementById("mtCal").onclick=function(){kind="caliper";q=makeQuestion(kind);answered=false;render();};
      document.getElementById("mtMic").onclick=function(){kind="micrometer";q=makeQuestion(kind);answered=false;render();};
      document.getElementById("mtCheck").onclick=check;
      document.getElementById("mtAnswer").addEventListener("keydown",function(e){if(e.key==="Enter")check();});
      document.getElementById("mtNext").onclick=function(){q=makeQuestion(kind);answered=false;render();};
    }
    function check(){
      if(answered)return;
      var field=document.getElementById("mtAnswer"),raw=field.value.trim().replace(",",".");
      var val=Number(raw),ok=raw!==""&&Number.isFinite(val)&&Math.abs(val-Number(q.answer))<0.005;
      state.done++;state.byKind[kind]=(state.byKind[kind]||0)+1;if(ok)state.correct++;save(state);answered=true;
      var fb=document.getElementById("mtFeedback");
      fb.innerHTML='<div style="padding:12px;border-radius:9px;border:1px solid '+(ok?'#16a34a':'#d97706')+';background:var(--card-soft)"><strong>'+(ok?'✓ Верно!':'Нужно проверить расчёт.')+'</strong><p style="margin:6px 0">'+esc(q.explain)+'</p><small>Правильный ответ: <b>'+q.answer+' мм</b>. '+(ok?'Отличная работа.':'Повтори порядок отсчёта и попробуй следующее задание.')+'</small></div>';
      document.getElementById("mtCheck").disabled=true;document.getElementById("mtNext").disabled=false;
      var stat=app.querySelectorAll(".card[style*='padding:10px']");if(stat.length>=3){stat[0].querySelector("div").textContent=state.done;stat[1].querySelector("div").textContent=state.correct;stat[2].querySelector("div").textContent=(state.done?Math.round(state.correct/state.done*100):0)+"%";}
    }
    render();
  };
})();