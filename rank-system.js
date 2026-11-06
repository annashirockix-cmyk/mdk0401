"use strict";
(function(){
  var RANKS=[
    {level:1,name:"Новичок",icon:"🌱",from:0,to:200,description:"Знакомство с учебным порталом и первыми темами"},
    {level:3,name:"Ученик",icon:"📘",from:200,to:400,description:"Уверенное освоение основ"},
    {level:5,name:"Практикант",icon:"🛠️",from:400,to:700,description:"Переход от теории к практике"},
    {level:8,name:"Мастер",icon:"⚙️",from:700,to:1100,description:"Стабильная работа с учебными задачами"},
    {level:12,name:"Эксперт",icon:"🎓",from:1100,to:1900,description:"Высокий уровень учебного мастерства"},
    {level:20,name:"Наставник",icon:"🧭",from:1900,to:2900,description:"Большой накопленный опыт и системная работа"},
    {level:30,name:"Легенда",icon:"🏆",from:2900,to:null,description:"Высшая ступень учебной траектории"}
  ];
  function xpValue(){var n=Number(window.state&&window.state.xp);return Number.isFinite(n)?Math.max(0,n):0;}
  function levelValue(){return window.getLevel?window.getLevel(xpValue()):Math.floor(xpValue()/100)+1;}
  function currentRank(level){var rank=RANKS[0];for(var i=0;i<RANKS.length;i++){if(level>=RANKS[i].level)rank=RANKS[i];else break;}return rank;}
  function escape(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function getProgress(){
    var xp=xpValue(),level=levelValue(),rank=currentRank(level),next=RANKS.find(function(r){return r.level>level;});
    var start=rank.from,end=next?next.from:null;
    return {xp:xp,level:level,rank:rank,next:next,progress:end===null?100:Math.max(0,Math.min(100,(xp-start)/(end-start)*100)),remaining:end===null?0:Math.max(0,end-xp)};
  }
  window.PORTAL_RANKS=RANKS;
  window.getPortalRank=function(){return getProgress().rank;};
  window.getPortalRankProgress=getProgress;
  window.getLevelTitle=function(level){return currentRank(Math.max(1,Number(level)||1)).name;};
  function rankCard(){
    var p=getProgress(),next=p.next;
    var nextText=next?"До звания «"+next.name+"» осталось "+p.remaining+" XP":"Максимальное звание достигнуто";
    var bar='<div style="height:12px;background:var(--card-soft);border-radius:20px;overflow:hidden;margin:10px 0"><div style="height:100%;width:'+p.progress.toFixed(1)+'%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:20px;transition:width .3s"></div></div>';
    return '<section class="module" id="portalRankCard" style="padding:20px;margin:18px 0"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div style="font-size:48px">'+p.rank.icon+'</div><div style="flex:1;min-width:180px"><div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em">Ваш учебный ранг</div><h2 style="margin:3px 0">'+escape(p.rank.name)+'</h2><div style="color:var(--muted);font-size:13px">'+escape(p.rank.description)+'</div></div><div style="text-align:right"><b style="font-size:22px;color:var(--gold)">'+p.xp+' XP</b><div style="font-size:12px;color:var(--muted)">Уровень '+p.level+'</div></div></div>'+bar+'<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:13px"><span>'+p.progress.toFixed(0)+'% до следующего ранга</span><b>'+escape(nextText)+'</b></div><div style="margin-top:16px;display:flex;gap:7px;flex-wrap:wrap">'+RANKS.map(function(r){var passed=p.level>=r.level;return '<span title="'+escape(r.description)+'" style="padding:6px 9px;border-radius:20px;background:'+(passed?'var(--card-soft)':'transparent')+';border:1px solid '+(passed?'var(--accent)':'var(--border)')+';opacity:'+(passed?1:.55)+';font-size:12px">'+r.icon+' '+escape(r.name)+'</span>';}).join("")+'</div></section>';
  }
  var oldProfile=window.renderProfilePage;
  if(oldProfile)window.renderProfilePage=function(){oldProfile.apply(this,arguments);if(!window.state||!window.state.student)return;var app=document.getElementById("app");if(!app)return;var old=document.getElementById("portalRankCard");if(old)old.remove();var holder=document.createElement("div");holder.innerHTML=rankCard();var card=holder.firstElementChild;var profile=app.querySelector(".module");if(profile&&profile.parentNode)profile.insertAdjacentElement("afterend",card);else app.appendChild(card);};
  var oldChip=window.renderUserChip;
  if(oldChip)window.renderUserChip=function(){oldChip.apply(this,arguments);if(!window.state||!window.state.student)return;var name=document.getElementById("userChipName");if(!name)return;var tag=document.createElement("span");var r=currentRank(levelValue());tag.textContent=" · "+r.icon+" "+r.name;tag.title="Учебный ранг · уровень "+levelValue();tag.style.cssText="font-size:11px;opacity:.85;white-space:nowrap";name.appendChild(tag);};
})();