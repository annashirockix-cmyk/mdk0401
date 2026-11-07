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
    var x0=90,scale=16,zero=x0+q.tick*scale/10;
    var s='<svg viewBox="0 0 650 170" role="img" aria-label="Схема основной шкалы и нониуса штангенциркуля" style="width:100%;max-width:650px;background:#f8fafc;border-radius:10px">';
    s+='<rect x="24" y="48" width="602" height="42" rx="4" fill="#dbe4ec" stroke="#64748b"/><text x="28" y="35" font-size="13" fill="#334155">Основная шкала · 1 мм</text>';
    for(var i=0;i<=34;i++){var x=35+i*16;var major=i%5===0;s+='<line x1="'+x+'" y1="48" x2="'+x+'" y2="'+(major?70:61)+'" stroke="#334155" stroke-width="1.3"/>';if(major)s+='<text x="'+(x-4)+'" y="83" font-size="10" fill="#334155">'+(i/1)+'</text>';}
    s+='<rect x="24" y="105" width="602" height="38" rx="4" fill="#cbd5e1" stroke="#64748b"/><text x="28" y="100" font-size="13" fill="#334155">Нониус · 0,1 мм</text>';
    s+='<line x1="'+zero+'" y1="105" x2="'+zero+'" y2="143" stroke="#0f766e" stroke-width="3"/>';
    for(var j=0;j<=10;j++){var vx=zero+j*scale*0.9;s+='<line x1="'+vx+'" y1="105" x2="'+vx+'" y2="'+(j%5===0?130:119)+'" stroke="#334155" stroke-width="1.3"/>';if(j%5===0)s+='<text x="'+(vx-3)+'" y="138" font-size="10" fill="#334155">'+j+'</text>';}
    s+='<text x="475" y="160" font-size="11" fill="#475569">Учебная схема, не в масштабе</text></svg>';
    return s;
  }
  function micrometerSvg(q){
    var s='<svg viewBox="0 0 650 165" role="img" aria-label="Схема стебля и барабана микрометра" style="width:100%;max-width:650px;background:#f8fafc;border-radius:10px">';
    s+='<rect x="30" y="48" width="430" height="55" rx="8" fill="#dbe4ec" stroke="#64748b"/><text x="34" y="34" font-size="13" fill="#334155">Стебель · шкала 0,5 мм</text>';
    for(var i=0;i<40;i++){var x=42+i*10;var major=i%2===0;s+='<line x1="'+x+'" y1="'+(major?48:62)+'" x2="'+x+'" y2="81" stroke="#334155"/>';if(i%10===0)s+='<text x="'+(x-4)+'" y="95" font-size="10" fill="#334155">'+(i/2)+'</text>';}
    s+='<line x1="30" y1="75" x2="460" y2="75" stroke="#0f766e" stroke-width="2"/>';
    s+='<rect x="460" y="38" width="155" height="76" rx="18" fill="#cbd5e1" stroke="#475569"/><text x="475" y="28" font-size="13" fill="#334155">Барабан · 0,01 мм</text>';
    for(var j=0;j<50;j++){var y=44+j*1.25;if(j%5===0)s+='<line x1="460" y1="'+y+'" x2="477" y2="'+y+'" stroke="#334155" stroke-width="1.2"/>';}
    s+='<path d="M460 75 L482 75" stroke="#dc2626" stroke-width="3"/><text x="493" y="80" font-size="15" fill="#0f172a" font-weight="bold">'+q.drum+'</text>';
    s+='<text x="475" y="132" font-size="11" fill="#475569">Совмещённое деление барабана</text></svg>';
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