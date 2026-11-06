"use strict";
(function(){
  var VIDEO_BASE="https://raw.githubusercontent.com/annashirockix-cmyk/-/main/";
  var ASSETS={
    video:VIDEO_BASE+"10558453058157.mp4",
    mechanics:VIDEO_BASE+"Flash_on_English_for_Mechanics_Electroni_5_-1.pdf",
    belova:VIDEO_BASE+"nchti_Belova-ENGLISH-dlya-SPO-2.pdf",
    newton:VIDEO_BASE+"Isaac_Newton_The_Force_of_Genius_-ex%20(1).pdf",
    newtonKeys:VIDEO_BASE+"Isaac_Newton_The_Force_of_Genius_-ex_keys.docx"
  };
  function $(id){return id.charAt(0)==="["?document.querySelector(id):document.getElementById(id);}
  function esc(v){return window.escapeHtml?window.escapeHtml(String(v==null?"":v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function appStart(title){var app=$("app");if(!app)return null;app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>'+title+'</h1><p>Английский язык · Basic English и Technical English</p></section>';var crumb=$("crumbs");if(crumb)crumb.textContent=title;return app;}
  function permitted(){return !!(window.state&&(window.state.student||window.state.staff))&&(!window.canAccessCourse||window.canAccessCourse("EN"));}
  function guard(){var app=$("app");if(permitted())return true;if(app)app.innerHTML='<section class="module">Нет доступа к дисциплине «Английский язык». Попросите администратора назначить её вашему аккаунту.</section>';return false;}
  function cardButton(text,hash){return '<a class="btn ghost" href="'+hash+'" style="display:inline-flex;margin:4px 6px 4px 0">'+text+'</a>';}
  window.renderEnglishTestsPage=function(track){
    if(!guard())return;var app=appStart("🎯 Тесты по английскому языку");if(!app)return;
    var data=window.MDK_DATA.EN,tracks=["basic","technical"],current=tracks.indexOf(track)>=0?track:"basic";
    var html='<div class="module"><div style="display:flex;gap:8px;flex-wrap:wrap">'+
      '<button class="btn '+(current==="basic"?"":"ghost")+'" data-track="basic">Basic English</button>'+
      '<button class="btn '+(current==="technical"?"":"ghost")+'" data-track="technical">Technical English</button></div>'+
      '<p class="museum-muted">Откройте тему и выберите вкладку «Тест». Содержание и исходные вопросы сохранены из прежнего английского портала.</p></div>';
    var sections=data.sections.filter(function(s){return s.sourceTrack===current;});
    sections.forEach(function(section){html+='<section class="module"><h2>'+esc(section.code)+' · '+esc(section.title)+'</h2>';
      (section.topics||[]).forEach(function(topic){var count=(topic.test||[]).length;if(!count)return;html+='<div style="padding:10px 0;border-top:1px solid var(--border)"><b>'+esc(topic.code)+' · '+esc(topic.title)+'</b><span class="museum-muted"> · '+count+' вопросов</span><div>'+cardButton("Открыть тест","#/topic/EN/"+encodeURIComponent(topic.id)+"/test")+'</div></div>';});
      html+='</section>';});
    app.insertAdjacentHTML("beforeend",html);
    app.querySelectorAll("[data-track]").forEach(function(b){b.onclick=function(){window.renderEnglishTestsPage(b.dataset.track);};});
  };
  window.renderEnglishCardsPage=function(track,mode){
    if(!guard())return;var app=appStart("🃏 Карточки и кроссворд");if(!app)return;
    var course=window.MDK_DATA.EN,tracks=["basic","technical"],current=tracks.indexOf(track)>=0?track:"basic";
    var cards=(course.flashcards[current]||[]).slice();
    (window.customContent.flashcards||[]).filter(function(x){return x.mdkId==="EN"&&(!x.track||x.track===current);}).forEach(function(set){(set.cards||[]).forEach(function(c){cards.push(c);});});
    var words=(course.flashcards.crossword&&course.flashcards.crossword[current]||[]).slice();
    app.insertAdjacentHTML("beforeend",'<section class="module"><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn '+(current==="basic"?"":"ghost")+'" data-track="basic">Базовый английский</button><button class="btn '+(current==="technical"?"":"ghost")+'" data-track="technical">Технический английский</button></div><p class="museum-muted">Карточки: '+cards.length+' · слова для кроссворда: '+words.length+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="startCards">🃏 Учить слова</button><button class="btn ghost" id="startCrossword">🔤 Решить кроссворд</button></div></section><div id="englishCardsWork"></div>');
    app.querySelectorAll("[data-track]").forEach(function(b){b.onclick=function(){window.renderEnglishCardsPage(b.dataset.track);};});
    $("startCards").onclick=function(){renderDeck(cards);};
    $("startCrossword").onclick=function(){renderCrossword(words);};
    if(mode==="crossword")renderCrossword(words);
    function renderDeck(deck){
      var box=$("englishCardsWork");if(!box)return;if(!deck.length){box.innerHTML='<div class="module">В этом наборе пока нет карточек.</div>';return;}
      var index=0,flipped=false,known=0,review=0;
      function draw(){var c=deck[index];box.innerHTML='<section class="module" style="text-align:center"><p class="museum-muted">Карточка '+(index+1)+' из '+deck.length+' · знаю: '+known+' · повторить: '+review+'</p><button id="engFlip" type="button" style="width:100%;min-height:190px;border:2px solid var(--accent);border-radius:14px;background:var(--card-soft);color:var(--text);padding:24px;cursor:pointer"><span style="display:block;font-size:30px;font-weight:700;color:var(--accent)">'+esc(flipped?(c.back||c.translation||""):c.front||c.word||"")+'</span><span style="display:block;margin-top:12px;color:var(--muted)">'+(flipped?esc(c.transcription||""):"Нажмите, чтобы перевернуть")+'</span></button><div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn ghost" id="engPrev" '+(index===0?"disabled":"")+' >← Назад</button><button class="btn" id="engFlip2">Перевернуть</button><button class="btn ghost" id="engNext" '+(index===deck.length-1?"disabled":"")+' >Далее →</button></div><div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn ghost" id="engKnow">Знаю</button><button class="btn ghost" id="engRepeat">Повторить</button></div></section>';
        $("engFlip").onclick=$("engFlip2").onclick=function(){flipped=!flipped;draw();};
        $("engPrev").onclick=function(){if(index>0){index--;flipped=false;draw();}};
        $("engNext").onclick=function(){if(index<deck.length-1){index++;flipped=false;draw();}};
        $("engKnow").onclick=function(){known++;next();};$("engRepeat").onclick=function(){review++;next();};
      }
      function next(){if(index<deck.length-1){index++;flipped=false;draw();}else{box.innerHTML='<section class="module" style="text-align:center"><h2>Набор завершён</h2><p>Знаю: '+known+' · Повторить: '+review+'</p><button class="btn" id="engAgain">Повторить набор</button></section>';$("engAgain").onclick=function(){index=0;known=0;review=0;flipped=false;draw();};}}
      draw();
    }
    function renderCrossword(source){
      var box=$("englishCardsWork");if(!box)return;if(!source.length){box.innerHTML='<div class="module">Для этого набора нет слов кроссворда.</div>';return;}
      var size=15,grid=Array.from({length:size},function(){return Array(size).fill("");}),placed=[];
      function tryPlace(word,dir){for(var a=0;a<500;a++){var r=Math.floor(Math.random()*size),c=Math.floor(Math.random()*size);if(dir==="H"&&c+word.length>size)continue;if(dir==="V"&&r+word.length>size)continue;var ok=true;for(var i=0;i<word.length;i++){var rr=dir==="H"?r:r+i,cc=dir==="H"?c+i:c;if(grid[rr][cc]&&grid[rr][cc]!==word[i]){ok=false;break;}}if(!ok)continue;for(var j=0;j<word.length;j++){var r2=dir==="H"?r:r+j,c2=dir==="H"?c+j:c;grid[r2][c2]=word[j];}placed.push({word:word,r:r,c:c,dir:dir});return true;}return false;}
      source.slice().sort(function(a,b){return b.word.length-a.word.length;}).forEach(function(w,i){var word=String(w.word||"").toUpperCase().replace(/[^A-Z]/g,"");if(word.length<2)return;var d=i%2===0?"H":"V";if(!tryPlace(word,d))tryPlace(word,d==="H"?"V":"H");});
      if(!placed.length){box.innerHTML='<div class="module">Не удалось построить сетку. Попробуйте ещё раз.</div>';return;}
      var html='<section class="module"><p class="museum-muted">Заполните клетки английскими буквами. Кроссворд строится заново при каждом открытии.</p><div style="overflow:auto"><table style="border-collapse:collapse;margin:auto"><tbody>';
      for(var r=0;r<size;r++){html+='<tr>';for(var c=0;c<size;c++){html+='<td style="padding:0;border:1px solid var(--border);width:30px;height:30px">'+(grid[r][c]?'<input maxlength="1" data-r="'+r+'" data-c="'+c+'" aria-label="Строка '+(r+1)+', столбец '+(c+1)+'" style="width:29px;height:29px;padding:0;text-align:center;text-transform:uppercase;border:0;background:white;color:#111;font-weight:bold">':'<span style="display:block;width:29px;height:29px;background:#101827"></span>')+'</td>';}html+='</tr>';}
      html+='</tbody></table></div><h3>Подсказки</h3><ol>'+placed.map(function(p){var w=source.find(function(x){return String(x.word).toUpperCase()===p.word;});return '<li>'+esc(w&&w.clue||"")+' ('+p.word.length+' букв, '+(p.dir==="H"?"по горизонтали":"по вертикали")+')</li>';}).join("")+'</ol><button class="btn" id="checkEnglishCrossword">Проверить</button><div id="englishCrosswordResult" aria-live="polite" style="margin-top:12px"></div></section>';
      box.innerHTML=html;
      $("checkEnglishCrossword").onclick=function(){var total=0,correct=0;box.querySelectorAll("input[data-r]").forEach(function(input){total++;var r=Number(input.dataset.r),c=Number(input.dataset.c),target=grid[r][c],val=(input.value||"").toUpperCase();if(val===target){correct++;input.style.background="#c8f2d6";}else input.style.background="#ffd6d6";});var pct=Math.round(correct/total*100);$("englishCrosswordResult").textContent="Совпадений: "+correct+" из "+total+" ("+pct+"%).";};
    }
  };
  window.renderEnglishMediaPage=function(lessonId){
    if(!guard())return;var app=appStart("🎬 Видео и презентации");if(!app)return;
    var global=window.ENGLISH_GLOBAL_DATA||{},lessons=window.ENGLISH_GLOBAL_LESSONS||{};
    if(lessonId==="newton"&&lessons.newton){renderNewton(lessons.newton);return;}
    if(lessonId==="britain"&&lessons.britain){renderBritain(lessons.britain);return;}
    app.insertAdjacentHTML("beforeend",'<section class="module"><h2>Видеоурок</h2><h3>Isaac Newton — The Force of Genius</h3><video controls preload="metadata" style="width:100%;max-height:460px;background:#000;border-radius:12px" src="'+ASSETS.video+'"></video><p>'+cardButton("Открыть задание к видео","#/english-media/newton")+'</p></section><section class="module"><h2>Интерактивная презентация / квиз</h2><h3>A Glimpse of Britain</h3><p>В исходном курсе к этой теме привязан квиз из 12 вопросов. Файл PPTX указан в исходном коде, но отсутствует в опубликованном наборе файлов; интерактивный квиз сохранён ниже.</p>'+cardButton("Открыть квиз","#/english-media/britain")+'</section><section class="module"><h2>Учебные материалы и презентационные источники</h2><p>Оригинальные файлы оставлены в исходном хранилище и открываются из портала без повторной загрузки больших бинарных файлов.</p><ul><li><a href="'+ASSETS.mechanics+'" target="_blank" rel="noopener">Flash on English for Mechanics, Electronics and Technical Assistance (PDF)</a></li><li><a href="'+ASSETS.belova+'" target="_blank" rel="noopener">English для СПО — Н. М. Белова (PDF)</a></li><li><a href="'+ASSETS.newton+'" target="_blank" rel="noopener">Isaac Newton — The Force of Genius: exercise (PDF)</a></li><li><a href="'+ASSETS.newtonKeys+'" target="_blank" rel="noopener">Isaac Newton — ключи к упражнению (DOCX)</a></li></ul></section><section class="module"><h2>Справочники</h2>'+(global.passports||[]).map(function(x){return '<details style="padding:10px;border-bottom:1px solid var(--border)"><summary><b>'+esc(x.title)+'</b><p class="museum-muted">'+esc(x.description)+'</p></summary><div class="lec-content">'+(x.content||"")+'</div></details>';}).join("")+'</section>');
    function renderNewton(lesson){
      app.insertAdjacentHTML("beforeend",'<section class="module"><h2>'+esc(lesson.title)+'</h2><video controls preload="metadata" style="width:100%;max-height:460px;background:#000;border-radius:12px" src="'+ASSETS.video+'"></video><h3>Complete the text</h3><p class="museum-muted">Посмотрите видео и выберите слова для пропусков.</p><div id="newtonGapText" style="line-height:2"></div><button class="btn" id="checkNewton">Проверить ответы</button><div id="newtonResult" aria-live="polite" style="margin-top:12px"></div></section>');
      var opts=lesson.options||[],text=String(lesson.text||""),parts=text.split(/\{(\d+)\}/),html="";
      parts.forEach(function(part){if(/^\d+$/.test(part)){var n=Number(part);html+='<select data-gap="'+n+'" class="self-input" style="display:inline-block;width:auto;min-width:130px;margin:3px"><option value="">— choose —</option>'+opts.map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>';}).join("")+'</select>';}else html+=esc(part).replace(/\n/g,"<br>");});
      $("newtonGapText").innerHTML=html;
      $("checkNewton").onclick=function(){var correct=0,total=Object.keys(lesson.answers||{}).length;Object.keys(lesson.answers||{}).forEach(function(n){var el=$('[data-gap="'+n+'"]'),ok=el&&el.value.toLowerCase()===String(lesson.answers[n]).toLowerCase();if(ok)correct++;if(el)el.style.borderColor=ok?"#2b9b62":"#c54d4d";});$("newtonResult").textContent="Правильно: "+correct+" из "+total+".";};
    }
    function renderBritain(lesson){
      var questions=lesson.questions||[];app.insertAdjacentHTML("beforeend",'<section class="module"><h2>'+esc(lesson.title)+'</h2><div id="britainQuiz"></div><button class="btn" id="submitBritain">Проверить квиз</button><div id="britainResult" aria-live="polite" style="margin-top:12px"></div></section>');
      $("britainQuiz").innerHTML=questions.map(function(q,i){return '<article style="padding:12px 0;border-bottom:1px solid var(--border)"><b>'+(i+1)+'. '+esc(q.q)+'</b><div style="display:grid;gap:6px;margin-top:8px">'+q.options.map(function(o,j){return '<label><input type="radio" name="britain-'+i+'" value="'+j+'"> '+esc(o)+'</label>';}).join("")+'</div></article>';}).join("");
      $("submitBritain").onclick=function(){var score=0,answered=0;questions.forEach(function(q,i){var selected=document.querySelector('input[name="britain-'+i+'"]:checked');if(selected){answered++;if(Number(selected.value)===Number(q.correct))score++;}});$("britainResult").textContent="Правильно: "+score+" из "+questions.length+" · отвечено: "+answered+".";};
    }
  };
})();