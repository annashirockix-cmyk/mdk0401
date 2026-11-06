"use strict";
(function(){
  var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
  var oldStart=window.startGame, oldRender=window.renderArcadePage;
  function frame(container,title,subtitle,body){
    container.innerHTML='<div class="party-shell"><div class="party-top"><div><div class="party-kicker">ИГРОВАЯ КОМНАТА / КОМАНДНЫЙ РЕЖИМ</div><h2>'+title+'</h2><p>'+subtitle+'</p></div><button class="btn ghost" id="partyBack">← К играм</button></div>'+body+'</div>';
    var back=container.querySelector("#partyBack");if(back)back.onclick=function(){window.stopCurrentGame&&window.stopCurrentGame();window.renderArcadePage();};
  }
  function startCase(container){
    var found={},visited={},notes=[],done=false;
    var locations=[
      {id:"office",name:"Кабинет технолога",icon:"🗄️",desc:"Рабочее место, где хранился оригинал чертежа.",clues:[["Журнал доступа","В 18:11 дверь открывали пропуском М.К. Других входов после 18:00 не зарегистрировано."],["Рабочий стол","Папка с чертежом лежит раскрытой. На внутренней стороне обложки — свежий след машинного масла."]]},
      {id:"cnc",name:"Участок ЧПУ",icon:"⚙️",desc:"Токарный участок, где в конце смены проверяли программу.",clues:[["Журнал стойки","В 18:08 с USB-накопителя выполнено копирование файла чертежа. Вход в систему был под учётной записью наладчика."],["Запись мастера","В 18:14 станок остановили для проверки корректора инструмента. Следы масла на перчатках соответствуют следу на папке."]]},
      {id:"locker",name:"Раздевалка",icon:"🧥",desc:"Шкафчики сотрудников и место хранения личных вещей.",clues:[["Шкафчик №7","В кармане куртки обнаружен USB-накопитель с копией чертежа. На корпусе есть маркировка «М.К.»."],["Записка","На обороте листка: «Если проверят размеры — придётся объяснять смещение нуля»."]]},
      {id:"hall",name:"Коридор и пост охраны",icon:"📹",desc:"Пост охраны, журнал посетителей и коридор к кабинету.",clues:[["Показания охранника","Ирина ушла в 17:55. Денис находился в аудитории до 18:20. Сергей сдавал ключи в 18:02."],["Камера","В 18:12 из кабинета вышел человек в спецовке участка ЧПУ. На рукаве видна светлая полоса от масла."]]}
    ];
    var suspects=[
      {id:"irina",name:"Ирина Волкова — технолог",role:"Подготовка чертежей",statement:"Я ушла до шести. Оригинал оставила в папке, потому что утром нужно было согласовать допуск."},
      {id:"maxim",name:"Максим Крылов — наладчик",role:"Настройка станка",statement:"После 18:00 я был на участке. USB? На моём брелоке действительно есть накопитель, но я не копировал чертёж."},
      {id:"sergey",name:"Сергей Орлов — кладовщик",role:"Выдача инструмента",statement:"Я вернул ключи охране в 18:02. В кабинет технолога после этого не заходил."},
      {id:"denis",name:"Денис Лебедев — студент",role:"Практика на участке",statement:"Я был в аудитории и сдавал отчёт. В коридор выходил только за журналом."}
    ];
    var cluesTotal=8;
    function addClue(id){if(found[id])return;found[id]=true;notes.push(id);}
    function render(){
      var opened=Object.keys(found).length;
      var body='<div class="case-banner"><div class="case-stamp">ДЕЛО № 014 / ВНУТРЕННЕЕ РАССЛЕДОВАНИЕ</div><h3>Исчезновение чертежа редуктора</h3><p>Учебная мастерская. 6 ноября. Между 18:00 и 18:20 из кабинета технолога пропал оригинал чертежа. Утром должна начаться обработка партии деталей. Найдите виновного, восстановите мотив и докажите версию уликами.</p><div class="case-stats"><span>🔎 Улик: '+opened+'/'+cluesTotal+'</span><span>👥 Подозреваемых: 4</span><span>🕒 Ориентир: 30–45 минут</span></div></div>';
      body+='<h3 class="case-section-title">Места расследования</h3><div class="case-location-grid">'+locations.map(function(l){return '<button class="case-location" data-loc="'+l.id+'"><span>'+l.icon+'</span><b>'+l.name+'</b><small>'+l.desc+'</small><em>'+l.clues.filter(function(x,i){return !!found[l.id+"-"+i];}).length+'/'+l.clues.length+' улик изучено</em></button>';}).join("")+'</div>';
      body+='<h3 class="case-section-title">Допросы</h3><div class="case-suspects">'+suspects.map(function(s){return '<button class="case-suspect" data-sus="'+s.id+'"><b>👤 '+s.name+'</b><small>'+s.role+'</small><span>'+(visited[s.id]?'Показания записаны ✓':'Провести допрос →')+'</span></button>';}).join("")+'</div>';
      body+='<div class="case-board"><div><h3>🧷 Доска улик</h3><p>Собирайте факты и сопоставляйте время, доступ и мотив.</p></div><div class="case-clue-list">'+(notes.length?notes.map(function(n){var parts=n.split("-");var loc=locations.find(function(x){return x.id===parts[0];});var clue=loc&&loc.clues[Number(parts[1])];return '<div class="case-clue"><b>'+esc(clue?clue[0]:"Улика")+'</b><p>'+esc(clue?clue[1]:"")+'</p></div>';}).join(""):'<p class="case-muted">Пока нет собранных улик. Осмотрите места расследования.</p>')+'</div></div>';
      body+='<div class="case-verdict"><h3>⚖️ Финальный вердикт</h3><p>Обвинение можно выдвинуть в любой момент. За полную версию с уликами начисляется больше очков.</p><label>Кто похитил чертёж?<select id="caseWho"><option value="">Выберите подозреваемого</option><option value="irina">Ирина Волкова</option><option value="maxim">Максим Крылов</option><option value="sergey">Сергей Орлов</option><option value="denis">Денис Лебедев</option></select></label><label>Мотив<select id="caseWhy"><option value="">Выберите мотив</option><option value="cover">Скрыть ошибку в настройке нуля и корректора</option><option value="sell">Продать чертёж конкурентам</option><option value="revenge">Сорвать экзамен студентам</option><option value="theft">Похитить инструмент</option></select></label><label>Главное доказательство<select id="caseProof"><option value="">Выберите доказательство</option><option value="access">Журнал доступа и USB-копирование</option><option value="oil">След масла на папке</option><option value="keys">Сдача ключей охране</option><option value="class">Присутствие в аудитории</option></select></label><button class="btn" id="caseSubmit">Вынести вердикт</button><div id="caseResult" aria-live="polite"></div></div>';
      frame(container,"Детектив: дело № 014","Расследуйте дело командой от 1 до 6 человек. Изучайте локации, допрашивайте свидетелей и связывайте улики.",body);
      container.querySelectorAll("[data-loc]").forEach(function(b){b.onclick=function(){var l=locations.find(function(x){return x.id===b.dataset.loc;});var html='<div class="case-modal"><h3>'+l.icon+' '+l.name+'</h3><p>'+l.desc+'</p>'+l.clues.map(function(cl,i){var id=l.id+"-"+i;return '<div class="case-clue"><b>'+cl[0]+'</b><p>'+cl[1]+'</p><button class="btn '+(found[id]?'ghost':'')+'" data-clue="'+id+'">'+(found[id]?'Улика изучена ✓':'Изучить улику')+'</button></div>';}).join("")+'<button class="btn ghost" id="caseClose">Закрыть</button></div>';var old=container.querySelector(".case-modal-wrap");if(old)old.remove();var wrap=document.createElement("div");wrap.className="case-modal-wrap";wrap.innerHTML=html;container.appendChild(wrap);wrap.querySelectorAll("[data-clue]").forEach(function(x){x.onclick=function(){addClue(x.dataset.clue);render();};});wrap.querySelector("#caseClose").onclick=function(){wrap.remove();};};});
      container.querySelectorAll("[data-sus]").forEach(function(b){b.onclick=function(){var s=suspects.find(function(x){return x.id===b.dataset.sus;});visited[s.id]=true;var wrap=document.createElement("div");wrap.className="case-modal-wrap";wrap.innerHTML='<div class="case-modal"><h3>Допрос: '+s.name+'</h3><p><b>Должность:</b> '+s.role+'</p><blockquote>'+s.statement+'</blockquote><p class="case-muted">Сопоставьте показания с временной шкалой и найденными уликами.</p><button class="btn" id="susClose">Записать показания</button></div>';container.appendChild(wrap);wrap.querySelector("#susClose").onclick=function(){wrap.remove();render();};};});
      container.querySelector("#caseSubmit").onclick=function(){
        var who=container.querySelector("#caseWho").value,why=container.querySelector("#caseWhy").value,proof=container.querySelector("#caseProof").value;
        if(!who||!why||!proof){container.querySelector("#caseResult").innerHTML='<p class="case-muted">Заполните все три пункта вердикта.</p>';return;}
        var score=(who==="maxim"?40:0)+(why==="cover"?30:0)+(proof==="access"?30:0);
        if(opened===cluesTotal)score=Math.min(100,score+5);
        done=true;
        var rank=score>=90?"Старший следователь":score>=70?"Детектив":score>=40?"Помощник следователя":"Стажёр";
        container.querySelector("#caseResult").innerHTML='<div class="case-result"><div class="case-score">'+score+'%</div><h3>'+rank+'</h3><p>'+(score>=70?'Расследование раскрыто.':'Версия частично верна. Проверьте хронологию и мотив.')+'</p><p><b>Правильная версия:</b> Максим Крылов скопировал чертёж, чтобы скрыть ошибку настройки нуля и корректора. Журнал доступа, копирование на USB и записка в шкафчике связывают мотив и действие.</p><button class="btn ghost" id="caseAgain">Начать расследование заново</button></div>';
        container.querySelector("#caseAgain").onclick=function(){found={};visited={};notes=[];done=false;render();};
      };
    }
    window.stopCurrentGame=function(){};
    render();
  }
  function startBredo(container){
    var names=[],round=0,answers=[],votes={},score={},promptIndex=0,phase="setup";
    var prompts=[
      "Почему станок с ЧПУ тайно включается по ночам? Объясните это так, чтобы комиссия поверила.",
      "Какой предмет в мастерской на самом деле управляет всем колледжем?",
      "Почему исчезла последняя гайка из набора? Кто и зачем её забрал?",
      "Что произошло бы, если бы G-коды начали спорить с оператором?",
      "Как оправдать появление детали, которой нет ни на одном чертеже?",
      "Зачем преподаватель спрятал красную кнопку под учебником?",
      "Почему токарный резец внезапно попросил отпуск?",
      "Какой секрет хранит самый старый штангенциркуль?"
    ];
    function draw(){
      if(phase==="setup"){frame(container,"Бредовуха","Компания придумывает самые убедительные и нелепые объяснения. Побеждает тот, чья версия соберёт больше голосов.",'<div class="party-panel"><h3>Кто играет?</h3><p>Введите имена через запятую (от 3 до 8 участников).</p><textarea id="bredoNames" rows="3" placeholder="Аня, Миша, Дима, Катя">Игрок 1, Игрок 2, Игрок 3, Игрок 4</textarea><button class="btn" id="bredoStart">Начать игру</button></div>');container.querySelector("#bredoStart").onclick=function(){names=container.querySelector("#bredoNames").value.split(",").map(function(x){return x.trim();}).filter(Boolean).slice(0,8);if(names.length<3){alert("Нужно минимум 3 игрока.");return;}score={};names.forEach(function(n){score[n]=0;});phase="write";round=0;answers=[];draw();};return;}
      if(round>=3){phase="end";draw();return;}
      if(phase==="write"){var p=prompts[(promptIndex+round)%prompts.length],player=names[answers.length];if(answers.length>=names.length){phase="vote";draw();return;}frame(container,"Раунд "+(round+1)+"/3 — версия игрока","Передайте устройство участнику: "+player,"<div class='party-panel'><div class='bredo-prompt'>"+esc(p)+"</div><label>Ваша версия</label><textarea id='bredoAnswer' rows='4' placeholder='Напишите короткую, но убедительную историю…'></textarea><button class='btn' id='bredoSend'>Скрыть ответ и передать ход</button><p class='party-muted'>Ответ увидят остальные только после того, как все участники закончат.</p></div>");container.querySelector("#bredoSend").onclick=function(){var a=container.querySelector("#bredoAnswer").value.trim();if(a.length<4){alert("Добавьте хотя бы несколько слов.");return;}answers.push({player:player,text:a});draw();};return;}
      if(phase==="vote"){var p2=prompts[(promptIndex+round)%prompts.length];frame(container,"Голосование — раунд "+(round+1),"Прочитайте версии и выберите самую смешную или убедительную. За себя голосовать нельзя.",'<div class="bredo-prompt">'+esc(p2)+'</div><div class="bredo-answers">'+answers.map(function(a,i){return '<div class="bredo-answer"><b>Версия '+(i+1)+'</b><p>'+esc(a.text)+'</p></div>';}).join("")+'</div><div class="party-panel"><label>Кто голосует сейчас?</label><select id="bredoVoter">'+names.map(function(n){return '<option>'+esc(n)+'</option>';}).join("")+'</select><label>Ваш голос</label><select id="bredoVote">'+answers.map(function(a,i){return '<option value="'+i+'">Версия '+(i+1)+(a.player?" — автор неизвестен":"")+'</option>';}).join("")+'</select><button class="btn" id="bredoVoteBtn">Отдать голос</button><p id="bredoVoteStatus" class="party-muted"></p></div>');var votesCast=Object.keys(votes).length;container.querySelector("#bredoVoteBtn").onclick=function(){var voter=container.querySelector("#bredoVoter").value,choice=Number(container.querySelector("#bredoVote").value);if(votes[voter]!==undefined){container.querySelector("#bredoVoteStatus").textContent="Этот участник уже проголосовал.";return;}if(answers[choice].player===voter){container.querySelector("#bredoVoteStatus").textContent="За свою версию голосовать нельзя.";return;}votes[voter]=choice;if(Object.keys(votes).length===names.length){var tally={};Object.keys(votes).forEach(function(n){tally[votes[n]]=(tally[votes[n]]||0)+1;});var max=Math.max.apply(null,Object.values(tally));Object.keys(tally).forEach(function(k){if(tally[k]===max)score[answers[Number(k)].player]+=2;});phase="reveal";draw();}else{draw();}};return;}
      if(phase==="reveal"){frame(container,"Итоги раунда "+(round+1),"Раскрываем авторов и начисляем по 2 очка за каждый голос.",'<div class="bredo-answers">'+answers.map(function(a,i){return '<div class="bredo-answer"><b>'+esc(a.player)+' — '+(votesCastFor(i))+' голос(ов)</b><p>'+esc(a.text)+'</p></div>';}).join("")+'</div><button class="btn" id="bredoNext">Следующий раунд</button>');container.querySelector("#bredoNext").onclick=function(){round++;answers=[];votes={};phase="write";draw();};return;}
      if(phase==="end"){var ranking=names.slice().sort(function(a,b){return score[b]-score[a];});frame(container,"Бредовуха завершена!","Лучшие генераторы убедительного абсурда.",'<div class="party-panel">'+ranking.map(function(n,i){return '<p class="bredo-rank"><b>'+(i+1)+'. '+esc(n)+'</b><span>'+score[n]+' очк.</span></p>';}).join("")+'<button class="btn" id="bredoRestart">Сыграть ещё раз</button></div>');container.querySelector("#bredoRestart").onclick=function(){phase="setup";draw();};}
      function votesCastFor(i){return Object.keys(votes).filter(function(n){return votes[n]===i;}).length;}
    }
    window.stopCurrentGame=function(){};draw();
  }
  function startDurak(container){
    var ranks=["6","7","8","9","10","В","Д","К","Т"],suits=["♣","♦","♥","♠"],players=[],deck=[],trump="",attacker=0,defender=1,table=[],selected=null,phase="setup",message="",finished=null;
    function cardText(c){return c.r+c.s;}
    function beats(a,d){return (a.s===d.s&&ranks.indexOf(a.r)>ranks.indexOf(d.r))||(d.s===trump&&a.s!==trump);}
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=a[i];a[i]=a[j];a[j]=x;}return a;}
    function next(i){return (i+1)%players.length;}
    function alive(i){return players[i]&&players[i].hand.length>0;}
    function deal(){for(var i=0;i<players.length;i++)while(players[i].hand.length<6&&deck.length)players[i].hand.push(deck.shift());}
    function chooseNextDef(){var i=next(defender),guard=0;while(i!==attacker&&!alive(i)&&guard++<players.length)i=next(i);return i===attacker?next(attacker):i;}
    function finishRound(take){
      if(take){players[defender].hand=players[defender].hand.concat(table.map(function(x){return x.attack;}).filter(Boolean),table.map(function(x){return x.defense;}).filter(Boolean));message=players[defender].name+" забирает карты со стола.";}
      else{table.forEach(function(x){if(x.attack){} });message="Атака отбита!";}
      table=[];selected=null;
      deal();
      var still=players.filter(function(p){return p.hand.length>0;});
      if(deck.length===0&&still.length<=1){finished=still.length?still[0].name:"Ничья";phase="end";render();return;}
      if(take){attacker=attacker;defender=chooseNextDef();}
      else{attacker=defender;defender=chooseNextDef();}
      if(defender===attacker)defender=next(attacker);
      phase="pass";render();
    }
    function render(){
      if(phase==="setup"){frame(container,"Дурак — компания","Классический подкидной дурак на 2–4 человека. Играйте по очереди на одном устройстве.",'<div class="party-panel"><label>Количество игроков</label><select id="durakCount"><option value="2">2 игрока</option><option value="3">3 игрока</option><option value="4">4 игрока</option></select><label>Имена через запятую</label><input id="durakNames" value="Игрок 1, Игрок 2, Игрок 3, Игрок 4"><button class="btn" id="durakStart">Раздать карты</button><p class="party-muted">Каждый игрок видит только свою руку после нажатия «Показать карты».</p></div>');container.querySelector("#durakStart").onclick=function(){var count=Number(container.querySelector("#durakCount").value),n=container.querySelector("#durakNames").value.split(",").map(function(x){return x.trim();}).filter(Boolean).slice(0,count);while(n.length<count)n.push("Игрок "+(n.length+1));players=n.map(function(x){return {name:x,hand:[]};});deck=shuffle(ranks.flatMap(function(r){return suits.map(function(s){return {r:r,s:s};});}));trump=deck[deck.length-1].s;deal();attacker=0;for(var i=0;i<players.length;i++){if(players[i].hand.some(function(c){return c.s===trump&&c.r==="6";})){attacker=i;break;}}defender=next(attacker);phase="pass";message="Козырь: "+trump;render();};return;}
      if(phase==="end"){frame(container,"Игра завершена","Колода закончилась.",'<div class="party-panel"><h3>Дурак — '+esc(finished||"Ничья")+'</h3><p>'+(finished?"Последний игрок с картами становится дураком.":"Все карты закончились одновременно.")+'</p><button class="btn" id="durakAgain">Новая партия</button></div>');container.querySelector("#durakAgain").onclick=function(){phase="setup";render();};return;}
      var current=phase==="pass"?attacker:(phase==="attack"?attacker:defender);
      if(phase==="pass"){frame(container,"Передача хода","Передайте устройство игроку, который должен ходить.",'<div class="party-panel"><div class="turn-card"><span>Сейчас ходит</span><h3>'+esc(players[current].name)+'</h3><p>'+esc(message)+'</p></div><button class="btn" id="durakReveal">Показать карты</button></div>');container.querySelector("#durakReveal").onclick=function(){phase=table.length?"defend":"attack";render();};return;}
      var hand=players[current].hand;
      var html='<div class="durak-status"><span>Козырь: <b>'+trump+'</b></span><span>Колода: <b>'+deck.length+'</b></span><span>Атакует: '+esc(players[attacker].name)+'</span><span>Защищается: '+esc(players[defender].name)+'</span></div>';
      html+='<div class="durak-table"><h3>На столе</h3>'+(table.length?table.map(function(x){return '<span class="durak-card">'+cardText(x.attack)+(x.defense?' / '+cardText(x.defense):'')+'</span>';}).join(" "):'<p>Стол пустой — положите первую карту.</p>')+'</div>';
      html+='<div class="durak-hand"><h3>Карты игрока: '+esc(players[current].name)+'</h3><div class="durak-cards">'+hand.map(function(c,i){return '<button class="durak-card '+(selected===i?'selected':'')+'" data-card="'+i+'">'+cardText(c)+'</button>';}).join("")+'</div></div>';
      if(phase==="attack")html+='<div class="party-panel"><button class="btn" id="durakAttack" '+(selected===null?'disabled':'')+'>Положить карту</button></div>';
      if(phase==="defend")html+='<div class="party-panel"><button class="btn" id="durakBeat" '+(selected===null?'disabled':'')+'>Отбить выбранную карту</button><button class="btn ghost" id="durakTake">Забрать карты</button><button class="btn ghost" id="durakDone">Закончить атаку</button></div>';
      html+='<p class="party-muted">'+esc(message)+'</p>';
      frame(container,phase==="attack"?"Атака":"Защита","Выберите карту и выполните действие. После действия устройство передаётся следующему игроку.",html);
      container.querySelectorAll("[data-card]").forEach(function(b){b.onclick=function(){selected=Number(b.dataset.card);render();};});
      if(phase==="attack"){container.querySelector("#durakAttack").onclick=function(){if(selected===null)return;var c=players[attacker].hand.splice(selected,1)[0];table.push({attack:c,defense:null});selected=null;phase="pass";message="Передайте карты защищающемуся игроку.";render();};}
      if(phase==="defend"){
        container.querySelector("#durakBeat").onclick=function(){if(selected===null)return;var c=players[defender].hand[selected],target=table.find(function(x){return !x.defense;});if(!target){message="Нет карты, которую можно побить.";render();return;}if(!beats(target.attack,c)){message="Эта карта не бьёт атакующую. Нужна старшая той же масти или козырь.";render();return;}players[defender].hand.splice(selected,1);target.defense=c;selected=null;phase="pass";message="Карта отбита. Передайте устройство атакующему.";render();};
        container.querySelector("#durakTake").onclick=function(){finishRound(true);};
        container.querySelector("#durakDone").onclick=function(){if(table.some(function(x){return !x.defense;})){message="Сначала отбейте все карты или заберите их.";render();return;}finishRound(false);};
      }
    }
    window.stopCurrentGame=function(){};render();
  }
  window.startGame=function(id){
    if(id==="detective"){var app=document.getElementById("app");app.innerHTML='<a class="backlink" href="javascript:void(0)" id="backGames">← В меню игр</a><div class="module" id="customGame" style="padding:16px"></div>';app.querySelector("#backGames").onclick=function(){window.renderArcadePage();};startCase(app.querySelector("#customGame"));return;}
    if(id==="bredo"){var app2=document.getElementById("app");app2.innerHTML='<a class="backlink" href="javascript:void(0)" id="backGames">← В меню игр</a><div class="module" id="customGame" style="padding:16px"></div>';app2.querySelector("#backGames").onclick=function(){window.renderArcadePage();};startBredo(app2.querySelector("#customGame"));return;}
    if(id==="durak"){var app3=document.getElementById("app");app3.innerHTML='<a class="backlink" href="javascript:void(0)" id="backGames">← В меню игр</a><div class="module" id="customGame" style="padding:16px"></div>';app3.querySelector("#backGames").onclick=function(){window.renderArcadePage();};startDurak(app3.querySelector("#customGame"));return;}
    if(id==="mafia"){oldStart("detective");return;}
    oldStart(id);
  };
  window.renderArcadePage=function(){
    oldRender();
    var app=document.getElementById("app");if(!app||app.querySelector("[data-party-extra]"))return;
    var grid=app.querySelector("div[style*='grid-template-columns']");if(!grid)return;
    var games=[
      ["bredo","🤪 Бредовуха","Придумывайте нелепые версии, голосуйте и набирайте очки."],
      ["durak","🃏 Дурак","Подкидной дурак для 2–4 игроков на одном устройстве."],
      ["mafia","🎭 Мафия онлайн","Сетевая игра с тайными ролями и голосованием."]
    ];
    games.forEach(function(g){var card=document.createElement("div");card.className="module";card.setAttribute("data-party-extra","1");card.style.cssText="cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;margin-bottom:0";card.innerHTML='<div><h3 style="color:var(--accent);margin-top:0">'+g[1]+'</h3><p style="color:var(--muted);font-size:14px">'+g[2]+'</p></div><button class="btn ghost" style="width:100%">Запустить</button>';card.onclick=function(){window.startGame(g[0]);};grid.appendChild(card);});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){}); 
})();