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
  function runEnglishAssessment(title,questions,minutes,resultKey){
    var app=$("app");if(!app)return;if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}
    var timeLeft=Math.max(1,Number(minutes)||45)*60;
    app.innerHTML='<a class="backlink" href="#/english-tests">← К списку тестов</a><section class="hero"><h1>'+esc(title)+'</h1><p>'+questions.length+' вопросов · отведённое время: '+minutes+' мин.</p><div id="englishAssessmentTimer" style="font-size:22px;font-weight:bold;color:var(--accent)"></div></section><section class="module"><div id="englishAssessmentQuestions"></div><button class="btn" id="englishAssessmentFinish">Завершить работу</button></section>';
    var area=$("englishAssessmentQuestions");
    area.innerHTML=questions.map(function(q,i){return '<article style="padding:12px 0;border-bottom:1px solid var(--border)"><b>'+(i+1)+'. '+esc(q.q||q.question||"")+'</b><div style="display:grid;gap:7px;margin-top:8px">'+(q.options||[]).map(function(o,j){return '<label style="display:flex;gap:8px;align-items:flex-start"><input type="radio" name="english-assessment-'+i+'" value="'+j+'"><span>'+esc(o)+'</span></label>';}).join("")+'</div></article>';}).join("");
    var finished=false;
    function finish(){
      if(finished)return;finished=true;if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}
      var correct=0,answered=0;questions.forEach(function(q,i){var choice=area.querySelector('input[name="english-assessment-'+i+'"]:checked');if(choice){answered++;if(Number(choice.value)===Number(q.correct))correct++;}});
      var percent=Math.round(correct/questions.length*100),grade=percent>=90?5:percent>=75?4:percent>=60?3:2,now=new Date().toISOString();
      window.state.results=window.state.results||{};window.state.results[resultKey]={grade:grade,score:correct,max:questions.length,percent:percent,finishedAt:now};
      if(window.saveStudentData)window.saveStudentData();
      app.innerHTML='<a class="backlink" href="#/english-tests">← К списку тестов</a><section class="module" style="text-align:center"><h2>Работа завершена</h2><p>Правильных ответов: <b>'+correct+'</b> из '+questions.length+'</p><p>Отвечено: '+answered+' из '+questions.length+'</p><h1 style="font-size:48px;color:var(--accent)">Оценка: '+grade+'</h1><p>'+percent+'%</p><button class="btn" id="englishAssessmentRetry">Пройти ещё раз</button></section>';
      $("englishAssessmentRetry").onclick=function(){runEnglishAssessment(title,questions,minutes,resultKey);};
      if(window.state.student&&window.API&&window.API.saveResult){window.API.saveResult({email:window.state.student.email,name:window.state.student.name,group:window.state.student.group,courseId:"EN",testId:resultKey,testTitle:title,grade:grade,score:correct,maxScore:questions.length,percent:percent,finishedAt:now}).catch(function(err){console.warn("English assessment sync failed",err);});}
    }
    $("englishAssessmentFinish").onclick=finish;
    function tick(){var el=$("englishAssessmentTimer");if(!el)return;var m=Math.floor(timeLeft/60),sec=timeLeft%60;el.textContent=(m<10?"0":"")+m+":"+(sec<10?"0":"")+sec;if(timeLeft<=0){finish();return;}timeLeft--;}
    tick();window.englishAssessmentTimer=setInterval(tick,1000);
    window.addEventListener("hashchange",function(){if(window.englishAssessmentTimer){clearInterval(window.englishAssessmentTimer);window.englishAssessmentTimer=null;}},{once:true});
  }
  window.renderEnglishTestsPage=function(mode){
    if(!guard())return;var app=appStart("🎯 Тесты по английскому языку");if(!app)return;
    var allowed=["basic","technical","semester-basic","semester-technical","final-basic","final-technical"];
    mode=allowed.indexOf(mode)>=0?mode:"basic";
    var track=mode.indexOf("technical")>=0?"technical":"basic";
    var labels=[["basic","Basic English"],["technical","Technical English"],["semester-basic","Семестровые · базовый"],["semester-technical","Семестровые · технический"],["final-basic","Итоговые · базовый"],["final-technical","Итоговые · технический"]];
    var html='<section class="module"><div style="display:flex;gap:8px;flex-wrap:wrap">'+labels.map(function(x){return '<button class="btn '+(mode===x[0]?"":"ghost")+'" data-mode="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div></section>';
    if(mode==="basic"||mode==="technical"){
      html+='<div class="module"><p class="museum-muted">Тематические тесты исходного курса. Откройте тему и выберите вкладку «Тест».</p></div>';
      (window.MDK_DATA.EN.sections||[]).filter(function(section){return section.sourceTrack===track;}).forEach(function(section){html+='<section class="module"><h2>'+esc(section.code)+' · '+esc(section.title)+'</h2>';(section.topics||[]).forEach(function(topic){var count=(topic.test||[]).length;if(!count)return;html+='<div style="padding:10px 0;border-top:1px solid var(--border)"><b>'+esc(topic.code)+' · '+esc(topic.title)+'</b><span class="museum-muted"> · '+count+' вопросов</span><div>'+cardButton("Открыть тест","#/topic/EN/"+encodeURIComponent(topic.id)+"/test")+'</div></div>';});html+='</section>';});
    }else if(mode.indexOf("semester-")===0){
      var sem=(window.SEMESTER_TESTS&&window.SEMESTER_TESTS[track])||[];
      html+='<section class="module"><h2>Семестровые контрольные</h2><p class="museum-muted">'+sem.length+' контрольных работ · 5 курсов · 45 минут на работу</p>';
      sem.forEach(function(test){var key="english_"+track+"_"+test.id,done=window.state.results&&window.state.results[key];html+='<article style="padding:10px 0;border-top:1px solid var(--border)"><b>'+esc(test.title)+'</b><div class="museum-muted">'+esc(test.subtitle||"")+' · '+test.questions.length+' вопросов · '+test.time+' мин'+(done?' · последняя оценка: '+esc(done.grade):'')+'</div><button class="btn" data-sem="'+esc(test.id)+'">Начать контрольную</button></article>';});html+='</section>';
    }else{
      var exams=(window.FINAL_EXAMS&&window.FINAL_EXAMS[track])||[];
      html+='<section class="module"><h2>Итоговые экзамены</h2><p class="museum-muted">'+exams.length+' экзаменов · по два варианта · 60 минут</p>';
      exams.forEach(function(exam){html+='<article style="padding:12px 0;border-top:1px solid var(--border)"><b>'+esc(exam.title)+'</b><div class="museum-muted">'+exam.time+' мин</div><div style="display:flex;gap:8px;flex-wrap:wrap">'+(exam.variants||[]).map(function(v,i){var key="english_"+track+"_"+exam.id+"_v"+(i+1),done=window.state.results&&window.state.results[key];return '<button class="btn '+(i?"ghost":"")+'" data-final="'+esc(exam.id)+'" data-variant="'+(i+1)+'">Вариант '+(i+1)+(done?' · '+esc(done.grade):'')+'</button>';}).join("")+'</div></article>';});html+='</section>';
    }
    app.insertAdjacentHTML("beforeend",html);
    app.querySelectorAll("[data-mode]").forEach(function(b){b.onclick=function(){window.renderEnglishTestsPage(b.dataset.mode);};});
    app.querySelectorAll("[data-sem]").forEach(function(b){b.onclick=function(){var test=(window.SEMESTER_TESTS[track]||[]).find(function(x){return x.id===b.dataset.sem;});if(test)runEnglishAssessment(test.title+" · "+(test.subtitle||""),test.questions,test.time,"english_"+track+"_"+test.id);};});
    app.querySelectorAll("[data-final]").forEach(function(b){b.onclick=function(){var exam=(window.FINAL_EXAMS[track]||[]).find(function(x){return x.id===b.dataset.final;});var v=exam&&exam.variants[Number(b.dataset.variant)-1];if(v)runEnglishAssessment(exam.title+" · вариант "+b.dataset.variant,v.questions,exam.time,"english_"+track+"_"+exam.id+"_v"+b.dataset.variant);};});
  };
  window.renderEnglishCardsPage=function(track,mode){
    if(!guard())return;var app=appStart("🃏 Карточки и кроссворд");if(!app)return;
    var course=window.MDK_DATA.EN,tracks=["basic","technical"],current=tracks.indexOf(track)>=0?track:"basic";
    var cards=(course.flashcards[current]||[]).slice();
    (window.customContent.flashcards||[]).filter(function(x){return x.mdkId==="EN"&&(!x.track||x.track==="all"||x.track===current);}).forEach(function(set){(set.cards||[]).forEach(function(c){cards.push(c);});});
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
      function tryPlace(word,dir){for(var a=0;a<800;a++){var r=Math.floor(Math.random()*size),c=Math.floor(Math.random()*size);if(dir==="H"&&c+word.length>size)continue;if(dir==="V"&&r+word.length>size)continue;var ok=true;for(var i=0;i<word.length;i++){var rr=dir==="H"?r:r+i,cc=dir==="H"?c+i:c;if(grid[rr][cc]&&grid[rr][cc]!==word[i]){ok=false;break;}}if(!ok)continue;for(var j=0;j<word.length;j++){var r2=dir==="H"?r:r+j,c2=dir==="H"?c+j:c;grid[r2][c2]=word[j];}placed.push({word:word,r:r,c:c,dir:dir});return true;}return false;}
      source.slice().sort(function(a,b){return String(b.word||"").length-String(a.word||"").length;}).forEach(function(w,i){var word=String(w.word||"").toUpperCase().replace(/[^A-Z]/g,"");if(word.length<2)return;var d=i%2===0?"H":"V";if(!tryPlace(word,d))tryPlace(word,d==="H"?"V":"H");});
      if(!placed.length){box.innerHTML='<div class="module">Не удалось построить сетку. Попробуйте ещё раз.</div>';return;}
      placed.sort(function(a,b){return a.r-b.r||a.c-b.c;});
      placed.forEach(function(p,i){p.number=i+1;});
      var starts={};placed.forEach(function(p){starts[p.r+":"+p.c]=p.number;});
      var html='<section class="module"><p class="museum-muted">Число в углу клетки — номер слова в списке. Начинайте ввод с клетки с таким же номером. Нажмите на подсказку, чтобы перейти к начальной клетке.</p><div style="overflow:auto"><table style="border-collapse:collapse;margin:auto"><tbody>';
      for(var r=0;r<size;r++){html+='<tr>';for(var c=0;c<size;c++){if(grid[r][c]){var n=starts[r+":"+c];html+='<td style="padding:0;border:1px solid var(--border);width:32px;height:32px;position:relative;background:#fff"><input maxlength="1" data-r="'+r+'" data-c="'+c+'" aria-label="Строка '+(r+1)+', столбец '+(c+1)+(n?', номер '+n:'')+'" style="width:31px;height:31px;padding:5px 0 0;text-align:center;text-transform:uppercase;border:0;background:transparent;color:#111;font-weight:bold">'+(n?'<span style="position:absolute;top:0;left:2px;font-size:9px;line-height:10px;color:#111;font-weight:700;pointer-events:none">'+n+'</span>':'')+'</td>';}else html+='<td style="padding:0;border:1px solid var(--border);width:32px;height:32px"><span style="display:block;width:31px;height:31px;background:#101827"></span></td>';}html+='</tr>';}
      html+='</tbody></table></div><h3>Подсказки</h3><ol>'+placed.map(function(p){var w=source.find(function(x){return String(x.word||"").toUpperCase().replace(/[^A-Z]/g,"")===p.word;});return '<li><button type="button" class="btn ghost" data-clue="'+p.number+'" style="padding:3px 8px">'+p.number+'</button> '+esc(w&&w.clue||"")+' ('+p.word.length+' букв, '+(p.dir==="H"?"по горизонтали":"по вертикали") +')</li>';}).join("")+'</ol><button class="btn" id="checkEnglishCrossword">Проверить</button><button class="btn ghost" id="resetEnglishCrossword">Очистить</button><div id="englishCrosswordResult" aria-live="polite" style="margin-top:12px"></div></section>';
      box.innerHTML=html;
      box.querySelectorAll("[data-clue]").forEach(function(b){b.onclick=function(){var p=placed.find(function(x){return x.number===Number(b.dataset.clue);});var input=box.querySelector('input[data-r="'+p.r+'"][data-c="'+p.c+'"]');if(input){input.focus();input.scrollIntoView({behavior:"smooth",block:"center",inline:"center"});}};});
      $("resetEnglishCrossword").onclick=function(){box.querySelectorAll("input[data-r]").forEach(function(i){i.value="";i.style.background="white";});$("englishCrosswordResult").textContent="";};
      $("checkEnglishCrossword").onclick=function(){var total=0,correct=0;placed.forEach(function(p){for(var i=0;i<p.word.length;i++){var r=p.dir==="H"?p.r:p.r+i,c=p.dir==="H"?p.c+i:p.c,input=box.querySelector('input[data-r="'+r+'"][data-c="'+c+'"]');if(!input)continue;total++;var ok=String(input.value||"").toUpperCase()===p.word[i];if(ok)correct++;input.style.background=ok?"#d1fae5":"#ffd6d6";}});$("englishCrosswordResult").textContent="Совпадений: "+correct+" из "+total+" ("+Math.round(correct/Math.max(1,total)*100)+"%).";};
    }
  };
  var originalEnglishHome=window.renderHomePage;
  if(originalEnglishHome)window.renderHomePage=function(){
    originalEnglishHome.apply(this,arguments);
    if(!window.state||window.state.activeCourseId!=="EN")return;
    var app=$("app"),hero=app&&app.querySelector(".hero");if(!app||!hero)return;
    var quick=document.createElement("section");quick.className="module";quick.innerHTML='<h2>🇬🇧 Быстрый доступ к английскому</h2><p class="museum-muted">Выберите нужный формат занятия.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="#/english-tests">🎯 Тесты и контрольные</a><a class="btn ghost" href="#/english-media">🎬 Видео и презентации</a><a class="btn ghost" href="#/english-cards">🃏 Карточки и кроссворд</a></div>';
    hero.insertAdjacentElement("afterend",quick);
  };
  window.renderEnglishMediaPage=function(lessonId){
    if(!guard())return;var app=appStart("🎬 Видео и презентации");if(!app)return;
    var global=window.ENGLISH_GLOBAL_DATA||{},lessons=window.ENGLISH_GLOBAL_LESSONS||{};
    if(lessonId==="newton"&&lessons.newton){renderNewton(lessons.newton);return;}
    if(lessonId==="britain"&&lessons.britain){renderBritain(lessons.britain);return;}
    if(lessonId==="slides-newton"&&lessons.newton){renderSlides(lessons.newton.title,String(lessons.newton.text||"").split(/\n+/).filter(Boolean));return;}
    if(lessonId==="slides-britain"&&lessons.britain){renderSlides(lessons.britain.title,(lessons.britain.questions||[]).map(function(q){return q.q+"\n\n"+(q.explanation||"");}));return;}
    app.insertAdjacentHTML("beforeend",'<section class="module"><h2>Видеоурок</h2><h3>Isaac Newton — The Force of Genius</h3><video controls preload="metadata" style="width:100%;max-height:460px;background:#000;border-radius:12px" src="'+ASSETS.video+'"></video><p>'+cardButton("Открыть задание к видео","#/english-media/newton")+cardButton("Презентационный режим","#/english-media/slides-newton")+'</p></section><section class="module"><h2>Интерактивная презентация / квиз</h2><h3>A Glimpse of Britain</h3><p>В исходном курсе к этой теме привязан квиз из 12 вопросов. Файл PPTX указан в исходном коде, но отсутствует в опубликованном наборе файлов; интерактивный квиз сохранён ниже.</p>'+cardButton("Открыть квиз","#/english-media/britain")+cardButton("Презентационный режим","#/english-media/slides-britain")+'</section><section class="module"><h2>Учебные материалы и презентационные источники</h2><p>Оригинальные файлы оставлены в исходном хранилище и открываются из портала без повторной загрузки больших бинарных файлов.</p><ul><li><a href="'+ASSETS.mechanics+'" target="_blank" rel="noopener">Flash on English for Mechanics, Electronics and Technical Assistance (PDF)</a></li><li><a href="'+ASSETS.belova+'" target="_blank" rel="noopener">English для СПО — Н. М. Белова (PDF)</a></li><li><a href="'+ASSETS.newton+'" target="_blank" rel="noopener">Isaac Newton — The Force of Genius: exercise (PDF)</a></li><li><a href="'+ASSETS.newtonKeys+'" target="_blank" rel="noopener">Isaac Newton — ключи к упражнению (DOCX)</a></li></ul></section><section class="module"><h2>Справочники</h2>'+(global.passports||[]).map(function(x){return '<details style="padding:10px;border-bottom:1px solid var(--border)"><summary><b>'+esc(x.title)+'</b><p class="museum-muted">'+esc(x.description)+'</p></summary><div class="lec-content">'+(x.content||"")+'</div></details>';}).join("")+'</section>');
    function renderSlides(title,slides){
      app.insertAdjacentHTML("beforeend",'<section class="module" id="englishSlideDeck" style="text-align:center"><div class="museum-number">ПРЕЗЕНТАЦИОННЫЙ РЕЖИМ</div><h2>'+esc(title)+'</h2><div id="englishSlideCounter" class="museum-muted"></div><article id="englishSlide" style="min-height:230px;display:flex;align-items:center;justify-content:center;text-align:left;white-space:pre-line;padding:24px;margin:14px 0;border:1px solid var(--border);border-radius:12px;background:var(--card-soft);font-size:18px;line-height:1.7"></article><button class="btn ghost" id="slidePrev">← Назад</button> <button class="btn" id="slideNext">Далее →</button></section>');
      var index=0;function draw(){$("englishSlideCounter").textContent="Слайд "+(index+1)+" из "+slides.length;$("englishSlide").textContent=slides[index]||"";$("slidePrev").disabled=index===0;$("slideNext").textContent=index===slides.length-1?"Сначала":"Далее →";}
      $("slidePrev").onclick=function(){if(index>0){index--;draw();}};$("slideNext").onclick=function(){index=index===slides.length-1?0:index+1;draw();};draw();
    }
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