"use strict";
(function(){
  var previousStart=window.startGame;
  function durak(container){
    var ranks=["6","7","8","9","10","В","Д","К","Т"],suits=["♣","♦","♥","♠"],players=[],deck=[],trump="",attacker=0,defender=1,phase="setup",passTo=0,nextPhase="attack",table=[],selected=null,message="",winner=null;
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
    function cardName(c){return c.r+c.s;}
    function beat(a,d){return (a.s===d.s&&ranks.indexOf(d.r)>ranks.indexOf(a.r))||(d.s===trump&&a.s!==trump);}
    function nextAlive(from){for(var step=1;step<=players.length;step++){var i=(from+step)%players.length;if(players[i].hand.length)return i;}return from;}
    function drawCards(){for(var step=0;step<players.length;step++){var p=players[(attacker+step)%players.length];while(p.hand.length<6&&deck.length)p.hand.push(deck.shift());}}
    function checkEnd(){var active=players.map(function(p,i){return {p:p,i:i};}).filter(function(x){return x.p.hand.length>0;});if(deck.length===0&&active.length<=1){winner=active.length?active[0].p.name:null;phase="end";return true;}return false;}
    function roundEnd(take){
      if(take){table.forEach(function(x){players[defender].hand.push(x.attack);if(x.defense)players[defender].hand.push(x.defense);});message=players[defender].name+" забирает карты.";}
      else{message="Отбито! Карты уходят в отбой.";}
      table=[];selected=null;drawCards();if(checkEnd()){render();return;}
      if(take){defender=nextAlive(attacker);}
      else{attacker=defender;defender=nextAlive(attacker);}
      if(defender===attacker)defender=nextAlive(attacker);
      passTo=attacker;nextPhase="attack";phase="pass";render();
    }
    function setup(){
      var count=Number(container.querySelector("#durakCount").value),names=container.querySelector("#durakNames").value.split(",").map(function(x){return x.trim();}).filter(Boolean).slice(0,count);
      while(names.length<count)names.push("Игрок "+(names.length+1));
      players=names.map(function(n){return {name:n,hand:[]};});
      deck=shuffle(ranks.flatMap(function(r){return suits.map(function(s){return {r:r,s:s};});}));
      trump=deck[deck.length-1].s;
      for(var i=0;i<players.length;i++)while(players[i].hand.length<6)players[i].hand.push(deck.shift());
      attacker=0;for(var j=0;j<players.length;j++){if(players[j].hand.some(function(c){return c.s===trump&&c.r==="6";})){attacker=j;break;}}
      defender=nextAlive(attacker);passTo=attacker;nextPhase="attack";phase="pass";message="Козырь — "+trump+". Начинает "+players[attacker].name+".";render();
    }
    function shell(title,desc,html){
      container.innerHTML='<div class="party-shell"><div class="party-top"><div><div class="party-kicker">КАРТОЧНАЯ ИГРА / 2–4 ИГРОКА</div><h2>'+title+'</h2><p>'+desc+'</p></div><button class="btn ghost" id="durakBack">← К играм</button></div>'+html+'</div>';
      container.querySelector("#durakBack").onclick=function(){window.renderArcadePage();};
    }
    function render(){
      if(phase==="setup"){shell("Дурак","Подкидной дурак. Играйте по очереди на одном устройстве, скрывая карты при передаче хода.",'<div class="party-panel"><label>Количество игроков</label><select id="durakCount"><option value="2">2 игрока</option><option value="3">3 игрока</option><option value="4" selected>4 игрока</option></select><label>Имена игроков через запятую</label><input id="durakNames" value="Игрок 1, Игрок 2, Игрок 3, Игрок 4"><button class="btn" id="durakStart">Раздать карты</button><p class="party-muted">После каждого действия экран скрывает карты и просит передать устройство следующему игроку.</p></div>');container.querySelector("#durakStart").onclick=setup;return;}
      if(phase==="end"){shell("Партия завершена","Колода закончилась.",'<div class="party-panel"><h3>'+(winner?"Дурак — "+winner:"Ничья")+'</h3><p>'+(winner?winner+" остался с картами и проиграл.":"Все игроки избавились от карт.")+'</p><button class="btn" id="durakAgain">Новая партия</button></div>');container.querySelector("#durakAgain").onclick=function(){phase="setup";render();};return;}
      if(phase==="pass"){shell("Передача хода","Не показывайте карты соперникам. Передайте устройство игроку, который ходит следующим.",'<div class="party-panel turn-card"><span>Сейчас ходит</span><h3>'+players[passTo].name+'</h3><p>'+message+'</p><button class="btn" id="durakShow">Показать карты</button></div>');container.querySelector("#durakShow").onclick=function(){phase=nextPhase;selected=null;render();};return;}
      var current=phase==="attack"?attacker:defender,hand=players[current].hand;
      var html='<div class="durak-status"><span>Козырь <b>'+trump+'</b></span><span>Колода <b>'+deck.length+'</b></span><span>Атака <b>'+players[attacker].name+'</b></span><span>Защита <b>'+players[defender].name+'</b></span></div>';
      html+='<div class="durak-table"><b>Стол</b><div>'+table.map(function(x){return '<span class="durak-pair"><span class="durak-card">'+cardName(x.attack)+'</span>'+(x.defense?'<span class="durak-card beaten">'+cardName(x.defense)+'</span>':'<span class="durak-card empty">?</span>')+'</span>';}).join(" ")+'</div></div>';
      html+='<div class="durak-hand"><h3>Карты: '+players[current].name+'</h3><div class="durak-cards">'+hand.map(function(c,i){return '<button class="durak-card '+(selected===i?"selected":"")+'" data-card="'+i+'">'+cardName(c)+'</button>';}).join("")+'</div></div>';
      if(phase==="attack"){html+='<div class="party-panel"><button class="btn" id="durakAttack" '+(selected===null?"disabled":"")+'>'+(table.length?"Подкинуть карту":"Атаковать")+'</button>'+(table.length?'<button class="btn ghost" id="durakFinish">Закончить атаку</button>':"")+'</div>';}
      else{html+='<div class="party-panel"><button class="btn" id="durakBeat" '+(selected===null?"disabled":"")+' >Отбить карту</button><button class="btn ghost" id="durakTake">Забрать карты</button></div>';}
      html+='<p class="party-muted">'+message+'</p>';
      shell(phase==="attack"?"Ход атакующего":"Ход защищающегося","Выберите карту. После каждого действия передайте устройство следующему игроку.",html);
      container.querySelectorAll("[data-card]").forEach(function(b){b.onclick=function(){selected=Number(b.dataset.card);render();};});
      if(phase==="attack"){
        container.querySelector("#durakAttack").onclick=function(){
          if(selected===null)return;var c=hand[selected];
          if(table.length&&!table.some(function(x){return x.attack.r===c.r||(x.defense&&x.defense.r===c.r);})){message="Подкинуть можно только карту достоинства, уже присутствующего на столе.";render();return;}
          if(table.length>=6||table.length>=players[defender].hand.length){message="Больше карт подкинуть нельзя.";render();return;}
          hand.splice(selected,1);table.push({attack:c,defense:null});selected=null;passTo=defender;nextPhase="defend";phase="pass";message="Передайте устройство защищающемуся игроку.";render();
        };
        var finish=container.querySelector("#durakFinish");if(finish)finish.onclick=function(){if(table.some(function(x){return !x.defense;})){message="Сначала нужно отбить все карты или забрать их.";render();return;}roundEnd(false);};
      }else{
        container.querySelector("#durakBeat").onclick=function(){
          if(selected===null)return;var c=hand[selected],target=table.find(function(x){return !x.defense;});
          if(!target){message="Все карты уже отбиты. Передайте ход атакующему.";render();return;}
          if(!beat(target.attack,c)){message="Карта не подходит: нужна старшая той же масти или козырь.";render();return;}
          hand.splice(selected,1);target.defense=c;selected=null;
          if(table.some(function(x){return !x.defense;})){phase="defend";message="Нужно отбить следующую карту.";render();return;}else{passTo=attacker;nextPhase="attack";}
          phase="pass";message="Все карты отбиты. Атакующий может подкинуть или завершить раунд.";render();
        };
        container.querySelector("#durakTake").onclick=function(){roundEnd(true);};
      }
    }
    window.stopCurrentGame=function(){};render();
  }
  window.startGame=function(id){
    if(id==="durak"){
      var app=document.getElementById("app");app.innerHTML='<a class="backlink" href="javascript:void(0)" id="durakMenu">← В меню игр</a><div class="module" id="durakContainer" style="padding:16px"></div>';
      app.querySelector("#durakMenu").onclick=function(){window.renderArcadePage();};durak(app.querySelector("#durakContainer"));return;
    }
    previousStart(id);
  };
})();