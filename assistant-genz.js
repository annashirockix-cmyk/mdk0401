"use strict";
(function(){
  var KEY="mdk_bot_brain_v2";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function norm(s){return String(s||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9]+/gi," ").trim();}
  function searchTopics(q){
    var terms=norm(q).split(/\s+/).filter(Boolean), found=[];
    var db=window.MDK_DATA||{};
    Object.keys(db).forEach(function(cid){
      var course=db[cid]||{};
      (course.sections||[]).forEach(function(section){
        (section.topics||[]).forEach(function(topic){
          var hay=norm([course.title,section.title,topic.code,topic.title].concat((topic.lectures||[]).map(function(l){return l.title+" "+(l.content||"").replace(/<[^>]*>/g," ");})).join(" "));
          var score=terms.reduce(function(n,t){return n+(hay.indexOf(t)>=0?1:0);},0);
          if(score>0)found.push({cid:cid,id:topic.id,title:topic.title,code:topic.code,section:section.title,score:score});
        });
      });
    });
    return found.sort(function(a,b){return b.score-a.score;}).slice(0,6);
  }
  function addText(parent,tag,txt,cls){var n=document.createElement(tag);if(cls)n.className=cls;n.textContent=txt;parent.appendChild(n);return n;}
  window.openAssistant=function(){
    var old=document.getElementById("assistantPanel");
    if(old){old.remove();return;}
    var panel=document.createElement("section");panel.id="assistantPanel";
    panel.style.cssText="position:fixed;right:18px;bottom:86px;width:min(390px,calc(100vw - 28px));max-height:76vh;z-index:100000;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:16px;box-shadow:0 18px 60px #0008;display:flex;flex-direction:column;overflow:hidden";
    var head=document.createElement("header");head.style.cssText="padding:13px 15px;display:flex;justify-content:space-between;align-items:center;background:var(--card-soft);border-bottom:1px solid var(--border)";
    addText(head,"b","🤖 Навигатор портала");
    var close=document.createElement("button");close.type="button";close.textContent="✕";close.setAttribute("aria-label","Закрыть помощника");close.style.cssText="border:0;background:transparent;color:var(--text);font-size:18px;cursor:pointer";close.onclick=function(){panel.remove();};head.appendChild(close);panel.appendChild(head);
    var log=document.createElement("div");log.style.cssText="padding:14px;overflow:auto;min-height:180px;max-height:48vh;display:flex;flex-direction:column;gap:9px;font-size:14px;line-height:1.45";panel.appendChild(log);
    function bubble(txt,who){var b=document.createElement("div");b.style.cssText="max-width:92%;align-self:"+(who?"flex-end":"flex-start")+";padding:9px 12px;border-radius:12px;background:"+(who?"var(--accent)":"var(--card-soft)")+";color:"+(who?"#fff":"var(--text)");b.textContent=txt;log.appendChild(b);log.scrollTop=log.scrollHeight;}
    bubble("Привет! Я помогу освоиться: найду лекцию, объясню разделы, подскажу, где практика, XP и сертификат. Можно писать обычным языком — без секретных команд 🙂",false);
    var quick=document.createElement("div");quick.style.cssText="display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px";
    [["🧭 Как устроен портал","как устроен портал"],["📚 Найти лекцию","найти лекцию"],["⭐ За что дают XP","за что дают xp"],["🛠 Практика","где практические работы"]].forEach(function(pair){var b=document.createElement("button");b.type="button";b.textContent=pair[0];b.style.cssText="border:1px solid var(--border);border-radius:20px;padding:6px 9px;background:var(--card-soft);color:var(--text);cursor:pointer;font-size:12px";b.onclick=function(){answer(pair[1]);};quick.appendChild(b);});panel.appendChild(quick);
    var form=document.createElement("form");form.style.cssText="display:flex;gap:7px;padding:10px;border-top:1px solid var(--border)";
    var input=document.createElement("input");input.type="text";input.placeholder="Например: найди тему про G-код";input.required=true;input.style.cssText="min-width:0;flex:1;padding:10px;border-radius:9px;border:1px solid var(--border);background:var(--bg);color:var(--text)";
    var send=document.createElement("button");send.type="submit";send.textContent="➤";send.className="btn";form.appendChild(input);form.appendChild(send);panel.appendChild(form);document.body.appendChild(panel);
    function answer(raw){
      var q=String(raw||"").trim();if(!q)return;bubble(q,true);var v=norm(q),reply="";
      var brain={};try{brain=JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){}
      if(brain[v])reply=brain[v];
      else if(/научи|запомни|учить/.test(v)&&q.indexOf("=>")>=0){var parts=q.split("=>");var question=norm(parts[0].replace(/научи|запомни|учить/gi,""));var val=parts.slice(1).join("=>").trim();if(question&&val){brain[question]=val;localStorage.setItem(KEY,JSON.stringify(brain));reply="Запомнил локально на этом устройстве. Теперь смогу повторить этот ответ.";}}
      else if(/экскурс|как устроен портал|с чего начать/.test(v)){reply="Маршрут новичка: 1) выбери дисциплину сверху; 2) открой нужный раздел и тему; 3) изучи лекцию; 4) выполни практику или самостоятельную; 5) пройди самопроверку/тест; 6) смотри XP, достижения и оценки в личном кабинете. Начни с одной темы — не нужно проходить всё сразу.";}
      else if(/xp|опыт|уровен/.test(v)){reply="XP — очки активности. Они начисляются за предусмотренные порталом учебные действия и игровые активности. Текущий баланс находится в верхней панели; достижения и рейтинг — в левом меню. Если XP не изменились, обнови страницу и проверь, сохранился ли результат.";}
      else if(/практик|урок 1|урок 2|урок 3|урок 4|урок 5/.test(v)){reply="Практические уроки находятся отдельным блоком курса Mastercam: открой переключатель дисциплины → Mastercam → раздел «Практические уроки 1–5». В каждом уроке есть цель, папка материалов, порядок выполнения и список того, что сдать.";}
      else if(/сертификат|вкладыш/.test(v)){reply="Раздел «Сертификат» находится в левом меню. Перед печатью проверь ФИО, группу и результаты в журнале. Итоговый вкладыш должен опираться только на сохранённые оценки.";}
      else if(/аватар|фото профил/.test(v)){reply="Открой «Личный кабинет». Там отображается профиль и доступные настройки внешнего вида. Для аватара используй изображение без персональных данных и слишком большой файл.";}
      else if(/g ?код|gcode|чпу|g00|g01|m03|m05/.test(v)){reply="Быстрая шпаргалка: G00 — быстрое позиционирование; G01 — линейное перемещение с рабочей подачей; G02/G03 — круговая интерполяция; G90/G91 — абсолютные/относительные координаты; M03/M04 — вращение шпинделя; M05 — останов шпинделя; M30 — завершение программы. Перед реальным запуском УП обязательны проверка траектории, нулей, инструмента и защит.";}
      else {
        var results=searchTopics(q);
        if(results.length){reply="Нашёл подходящие темы. Выбери результат ниже.";results.forEach(function(r){var b=document.createElement("button");b.type="button";b.textContent=r.cid+" · "+r.code+" · "+r.title;b.style.cssText="text-align:left;padding:8px;border:1px solid var(--border);border-radius:8px;background:var(--card-soft);color:var(--text);cursor:pointer";b.onclick=function(){location.hash="#/topic/"+encodeURIComponent(r.cid)+"/"+encodeURIComponent(r.id);panel.remove();};log.appendChild(b);});}
        else reply="Пока не нашёл точного ответа. Попробуй назвать дисциплину, тему или код команды. Можно обучить меня на этом устройстве в формате: «Научи: вопрос => ответ».";
      }
      if(reply)bubble(reply,false);log.scrollTop=log.scrollHeight;
    }
    form.onsubmit=function(e){e.preventDefault();var val=input.value;input.value="";answer(val);};
    input.focus();
  };
  if(!document.getElementById("assistantGenzFab")){
    var fab=document.createElement("button");fab.id="assistantGenzFab";fab.type="button";fab.textContent="🤖";fab.title="Открыть помощника";fab.style.cssText="position:fixed;right:20px;bottom:20px;width:54px;height:54px;border:0;border-radius:50%;background:var(--accent);color:#fff;font-size:25px;box-shadow:0 5px 20px #0006;cursor:pointer;z-index:99998";fab.onclick=function(){window.openAssistant();};document.body.appendChild(fab);
  }
  // Удаляем старую кнопку из assistant.js: остаётся один новый навигатор.
  document.addEventListener("DOMContentLoaded",function(){var legacy=document.getElementById("asFab");if(legacy)legacy.remove();});
})();
