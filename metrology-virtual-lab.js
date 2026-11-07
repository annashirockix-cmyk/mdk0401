"use strict";
(function(){
  var KEY="mdk.metrologyVirtualDial.v1";
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){return {};}}
  function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));}catch(e){}}
  function esc(v){return String(v==null?"":v).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function dialSvg(value){
    var angle=-135+Number(value||0)*2.7;
    var s='<svg viewBox="0 0 560 260" role="img" aria-label="Циферблат индикатора часового типа" style="display:block;width:100%;max-width:560px;background:#f8fafc;border-radius:12px">';
    s+='<circle cx="280" cy="126" r="104" fill="#fff" stroke="#475569" stroke-width="5"/>';
    for(var i=0;i<=100;i+=2){
      var a=(-135+i*2.7)*Math.PI/180,major=i%10===0,r1=major?83:93,r2=102;
      var x1=280+Math.cos(a)*r1,y1=126+Math.sin(a)*r1,x2=280+Math.cos(a)*r2,y2=126+Math.sin(a)*r2;
      s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#334155" stroke-width="'+(major?2.4:1)+'"/>';
      if(major){var tx=280+Math.cos(a)*69,ty=130+Math.sin(a)*69;s+='<text x="'+tx+'" y="'+ty+'" text-anchor="middle" font-size="12" fill="#334155">'+(i/100).toFixed(1)+'</text>';}
    }
    s+='<line id="mvdNeedle" x1="280" y1="126" x2="280" y2="36" stroke="#dc2626" stroke-width="4" stroke-linecap="round" transform="rotate('+angle+' 280 126)"/><circle cx="280" cy="126" r="8" fill="#334155"/><text x="280" y="250" text-anchor="middle" font-size="13" fill="#334155">Учебная шкала 0–1,00 мм · цена деления 0,01 мм</text></svg>';
    return s;
  }
  function mount(){
    var app=document.getElementById("app");if(!app||app.querySelector("#metrologyVirtualDial"))return;
    var stats=read();stats.done=Number(stats.done||0);stats.correct=Number(stats.correct||0);
    var target=5+Math.floor(Math.random()*91),locked=false;
    var section=document.createElement("section");section.id="metrologyVirtualDial";section.className="card";section.style.cssText="padding:16px;margin-top:16px";
    app.appendChild(section);
    function render(){
      section.innerHTML='<h2 style="margin:0 0 6px">Виртуальная лаборатория: индикатор</h2><p style="margin:0 0 12px;color:var(--muted)">Установи измерительное показание, перемещая шток. Следи за стрелкой и текущим значением.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px"><div class="card" style="padding:10px"><small>Попыток</small><b style="display:block;font-size:22px">'+stats.done+'</b></div><div class="card" style="padding:10px"><small>Верно</small><b style="display:block;font-size:22px">'+stats.correct+'</b></div><div class="card" style="padding:10px"><small>Точность</small><b style="display:block;font-size:22px">'+(stats.done?Math.round(stats.correct/stats.done*100):0)+'%</b></div></div><div style="border:1px solid var(--border);border-radius:12px;padding:12px"><p><b>Задание:</b> установи показание <b>'+ (target/100).toFixed(2).replace(".",",") +' мм</b>.</p>'+dialSvg(0)+'<label for="mvdSlider" style="display:block;font-weight:700;margin:12px 0 4px">Перемещение измерительного штока</label><input id="mvdSlider" type="range" min="0" max="100" step="1" value="0" style="width:100%"><p style="margin:6px 0">Текущее показание: <b id="mvdValue">0,00 мм</b></p><button id="mvdCheck" class="btn btn-primary">Проверить установку</button> <button id="mvdNext" class="btn" disabled>Новое задание</button><div id="mvdFeedback" aria-live="polite" style="margin-top:10px"></div></div><details style="margin-top:12px"><summary style="cursor:pointer;font-weight:700">Порядок работы и безопасность</summary><ol><li>Проверь крепление индикатора и исправность стойки.</li><li>Подведи измерительный наконечник без удара и чрезмерного усилия.</li><li>Сними предварительный натяг по инструкции к конкретному прибору.</li><li>Для контроля биения вращай деталь только вручную и при отключённом приводе.</li><li>Зафиксируй максимальное и минимальное показания; размах равен max − min.</li></ol><p style="color:var(--muted)">Модель схематическая и учебная. Она имитирует перемещение штока, но не является поверенным средством измерений.</p></details>';
      var slider=section.querySelector("#mvdSlider");
      slider.oninput=function(){var v=Number(this.value);section.querySelector("#mvdNeedle").setAttribute("transform","rotate("+(-135+v*2.7)+" 280 126)");section.querySelector("#mvdValue").textContent=(v/100).toFixed(2).replace(".",",")+" мм";};
      section.querySelector("#mvdCheck").onclick=check;
      section.querySelector("#mvdNext").onclick=function(){target=5+Math.floor(Math.random()*91);locked=false;render();};
    }
    function check(){
      if(locked)return;locked=true;
      var value=Number(section.querySelector("#mvdSlider").value),ok=value===target;
      stats.done++;if(ok)stats.correct++;write(stats);
      section.querySelector("#mvdFeedback").innerHTML='<div style="border:1px solid '+(ok?'#16a34a':'#d97706')+';border-radius:9px;padding:12px"><b>'+(ok?'Верно! Стрелка установлена точно.':'Показание отличается от заданного.')+'</b><p>Задано: '+(target/100).toFixed(2).replace(".",",")+' мм. Установлено: '+(value/100).toFixed(2).replace(".",",")+' мм.</p><p>'+(ok?'Хорошая работа.':'Попробуй ещё раз в следующем варианте. Цена деления — 0,01 мм.')+'</p><small>Точность тренажёра: '+Math.round(stats.correct/stats.done*100)+'% ('+stats.correct+'/'+stats.done+')</small></div>';
      section.querySelector("#mvdCheck").disabled=true;section.querySelector("#mvdSlider").disabled=true;section.querySelector("#mvdNext").disabled=false;
      var student=window.state&&window.state.student;
      if(student&&student.email&&window.API&&window.API.saveResult){
        window.API.saveResult({email:student.email,name:student.name||student.fullName||student.email,group:student.group||"",courseId:"MET",testId:"metrology_virtual_dial_"+Date.now(),testTitle:"Виртуальная лаборатория: индикатор часового типа",grade:ok?5:2,score:ok?1:0,maxScore:1,percent:ok?100:0,feedback:ok?"Показание установлено точно.":"Ошибка установки показания.",payload:JSON.stringify({target:(target/100).toFixed(2),value:(value/100).toFixed(2)}),date:new Date().toISOString().slice(0,10)}).catch(function(){});
      }
    }
    render();
  }
  var original=window.renderMetrologyTrainer;
  if(typeof original==="function"){
    window.renderMetrologyTrainer=function(){original();mount();};
  }else{
    window.addEventListener("load",mount);
  }
})();