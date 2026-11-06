"use strict";
(function(){
  var SEASONS=[
    {id:"winter",months:[11,0,1]},{id:"spring",months:[2,3,4]},
    {id:"summer",months:[5,6,7]},{id:"autumn",months:[8,9,10]}
  ];
  function seasonKey(){var d=new Date(),s=SEASONS.find(function(x){return x.months.indexOf(d.getMonth())>=0;})||SEASONS[0];return s.id+"_"+d.getFullYear();}
  function esc(v){return window.escapeHtml?window.escapeHtml(String(v==null?"":v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function parsePayload(v){if(v&&typeof v==="object")return v;try{return JSON.parse(v||"{}");}catch(e){return {};}}
  function groupKey(v){return String(v||"Без группы").trim().replace(/\s+/g," ").toLocaleLowerCase("ru-RU");}
  function collect(students){
    var groups=new Map(),season=seasonKey(),prefix="season_"+season+"_";
    (students||[]).forEach(function(s){
      if(String(s.role||"student").toLowerCase()!=="student")return;
      var group=String(s.group||"Без группы").trim()||"Без группы",key=groupKey(group),p=parsePayload(s.payload),xp=Math.max(0,Number(p.xp)||0);
      if(!groups.has(key))groups.set(key,{name:group,total:0,count:0,contributors:0,medals:0,students:0});
      var g=groups.get(key);g.total+=xp;g.count++;g.students++;if(xp>0)g.contributors++;
      var badges=Array.isArray(p.unlockedAchievements)?p.unlockedAchievements:[];
      g.medals+=badges.filter(function(id){return typeof id==="string"&&id.indexOf(prefix)===0&&/(bronze|silver|gold)$/.test(id);}).length;
    });
    return Array.from(groups.values()).map(function(g){g.average=g.count?g.total/g.count:0;return g;}).sort(function(a,b){return b.average-a.average||b.total-a.total||a.name.localeCompare(b.name,"ru");});
  }
  function podiumIcon(i){return ["🥇","🥈","🥉"][i]||"🏅";}
  window.renderTeamLeaguePage=function(){
    var app=document.getElementById("app");if(!app)return;
    var state=window.state||{};
    if(!state.student&&!state.staff){location.hash="#/";return;}
    document.getElementById("crumbs").textContent="Командная лига групп";
    app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>🏅 Командная лига групп</h1><p>Соревнование учебных групп по накопленному учебному опыту</p></section><section class="module" style="padding:16px;margin-bottom:16px"><b>Как считается рейтинг</b><p style="color:var(--muted);margin:6px 0 0">Основной показатель — средний XP на одного обучающегося в группе. Это помогает сравнивать группы разного размера. Дополнительно показаны общий XP, число участников с опытом и сезонные медали. Индивидуальные данные и имена здесь не публикуются.</p></section><div id="teamLeagueStatus" class="module">Загружаем результаты групп…</div><div id="teamLeagueContent"></div>';
    var status=document.getElementById("teamLeagueStatus"),content=document.getElementById("teamLeagueContent");
    window.API.getStudents().then(function(res){
      if(!res||!(res.ok||res.success)||!Array.isArray(res.students))throw Error(res&&res.error||"Список обучающихся недоступен");
      var rows=collect(res.students),myGroup=state.student&&groupKey(state.student.group);
      status.textContent="В рейтинге участвуют "+rows.length+" учебных групп · сезонные медали учитываются за текущий сезон";
      if(!rows.length){content.innerHTML='<section class="module">Пока недостаточно данных для командного рейтинга.</section>';return;}
      var mine=myGroup?rows.find(function(g){return groupKey(g.name)===myGroup;}):null;
      if(mine){var pos=rows.indexOf(mine)+1;content.innerHTML='<section class="module" style="padding:18px;margin-bottom:16px"><div style="font-size:12px;color:var(--muted)">ВАША КОМАНДА</div><h2 style="margin:5px 0">'+podiumIcon(pos-1)+' '+esc(mine.name)+' · '+pos+' место</h2><div style="display:flex;gap:16px;flex-wrap:wrap"><b>'+mine.total.toLocaleString("ru-RU")+' XP всего</b><b>'+mine.average.toFixed(1)+' XP в среднем</b><span>'+mine.contributors+' из '+mine.count+' с XP</span><span>🏅 '+mine.medals+' сезонных медалей</span></div></section>';}
      var cards=rows.map(function(g,i){var pct=rows[0].average?Math.max(4,g.average/rows[0].average*100):4;var own=myGroup&&groupKey(g.name)===myGroup;return '<article class="module" style="padding:16px;border:'+(own?'2px solid var(--accent)':'1px solid var(--border)')+'"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:25px">'+podiumIcon(i)+'</div><div style="flex:1"><b>'+esc(g.name)+'</b><div style="font-size:12px;color:var(--muted)">'+(i+1)+' место · '+g.count+' обучающихся</div></div><b style="color:var(--gold)">'+g.average.toFixed(1)+' XP</b></div><div style="height:9px;background:var(--card-soft);border-radius:20px;overflow:hidden;margin:12px 0 8px"><div style="height:100%;width:'+pct.toFixed(1)+'%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:20px"></div></div><div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--muted)"><span>Всего: '+g.total.toLocaleString("ru-RU")+' XP</span><span>Участвуют: '+g.contributors+'/'+g.count+'</span><span>🏅 Медали: '+g.medals+'</span></div></article>';}).join("");
      content.innerHTML+='<section><h2>🏆 Рейтинг групп</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">'+cards+'</div></section><p style="font-size:12px;color:var(--muted);margin-top:14px">Рейтинг обновляется при повторном открытии страницы. XP — показатель активности в портале, а не учебная оценка.</p>';
    }).catch(function(err){console.error("Team league:",err);status.textContent="Не удалось загрузить командный рейтинг. Проверьте соединение и попробуйте открыть страницу ещё раз.";});
  };
})();