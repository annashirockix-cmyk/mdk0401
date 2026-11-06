"use strict";
(function(){
  var REWARDS=[
    {id:"frame_copper",kind:"frame",name:"Медная окантовка",icon:"🟤",description:"За первую сохранённую практическую работу",requires:["first_practical"],css:"linear-gradient(135deg,#b87333,#f2c078,#7c3f16)",shadow:"0 0 0 3px rgba(184,115,51,.25)"},
    {id:"frame_neon",kind:"frame",name:"Неоновый контур",icon:"💠",description:"За первый успешно пройденный тест",requires:["hacker"],css:"linear-gradient(135deg,#00e5ff,#b000ff,#00e5ff)",shadow:"0 0 15px rgba(0,229,255,.65)"},
    {id:"frame_blueprint",kind:"frame",name:"Инженерный чертёж",icon:"📐",description:"За пять практических этапов Mastercam",requires:["mastercam_5"],css:"linear-gradient(135deg,#2563eb,#67e8f9,#1e3a8a)",shadow:"0 0 0 3px rgba(37,99,235,.25)"},
    {id:"frame_gold",kind:"frame",name:"Золотой венец",icon:"👑",description:"За запас опыта 2500 XP",requires:["xp_2500"],css:"linear-gradient(135deg,#8a6415,#ffe58a,#b8860b)",shadow:"0 0 16px rgba(255,215,0,.5)"},
    {id:"title_reader",kind:"title",name:"Хранитель знаний",icon:"📚",description:"За изучение лекции",requires:["reader"]},
    {id:"title_gcode",kind:"title",name:"Оператор ЧПУ",icon:"⚙️",description:"За освоение тренажёра G-кода",requires:["gcode_pro"]},
    {id:"title_master",kind:"title",name:"Мастер траектории",icon:"🏅",description:"За пять практических этапов Mastercam",requires:["mastercam_5"]},
    {id:"title_season",kind:"title",name:"Мастер сезона",icon:"🌟",description:"За золотую сезонную медаль",requires:["season_gold"]}
  ];
  function state(){return window.state||(window.state={});}
  function unlocked(){var s=state();return Array.isArray(s.unlockedAchievements)?s.unlockedAchievements:[];}
  function owns(r){
    var ids=unlocked();
    return r.requires.some(function(id){if(id==="season_gold")return ids.some(function(x){return /^season_[a-z]+_\d{4}_gold$/.test(x);});return ids.indexOf(id)>=0;});
  }
  function inventory(){return REWARDS.filter(owns);}
  function getReward(id){return REWARDS.find(function(r){return r.id===id;});}
  function persist(){if(window.saveStudentData)window.saveStudentData();}
  function frameStyle(id){var r=getReward(id);return r&&r.kind==="frame"?r:null;}
  function applyFrame(el){
    if(!el)return;var f=frameStyle(state().equippedFrame);
    if(!f){el.style.border="";el.style.boxShadow="";return;}
    el.style.border="4px solid transparent";el.style.backgroundImage="linear-gradient(var(--card-soft),var(--card-soft)),"+f.css;el.style.backgroundOrigin="border-box";el.style.backgroundClip="padding-box,border-box";el.style.boxShadow=f.shadow;
  }
  function safeText(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  window.getRewardCollection=function(){return inventory().slice();};
  window.renderRewardCollection=function(){
    var app=document.getElementById("app");if(!app)return;
    var existing=document.getElementById("rewardCollection");if(existing)existing.remove();
    var owned=inventory(),frames=owned.filter(function(r){return r.kind==="frame";}),titles=owned.filter(function(r){return r.kind==="title";});
    var wrap=document.createElement("section");wrap.className="module";wrap.id="rewardCollection";wrap.style.cssText="padding:20px;margin:18px 0";
    var h=document.createElement("h2");h.textContent="🎁 Коллекция наград";wrap.appendChild(h);
    var p=document.createElement("p");p.style.color="var(--muted)";p.textContent="Косметические предметы открываются за учебные достижения. Они не влияют на оценки и не дают игровых преимуществ.";wrap.appendChild(p);
    var count=document.createElement("p");count.innerHTML="<b>"+owned.length+"</b> из "+REWARDS.length+" наград открыто";wrap.appendChild(count);
    function addSection(label,items,kind){
      var title=document.createElement("h3");title.textContent=label;wrap.appendChild(title);
      var grid=document.createElement("div");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px";
      REWARDS.filter(function(r){return r.kind===kind;}).forEach(function(r){
        var has=items.some(function(x){return x.id===r.id;}),active=state()[kind==="frame"?"equippedFrame":"equippedTitle"]===r.id;
        var card=document.createElement("article");card.className="module";card.style.cssText="padding:13px;opacity:"+(has?1:.55);
        var icon=document.createElement("div");icon.style.fontSize="30px";icon.textContent=has?r.icon:"🔒";
        var name=document.createElement("b");name.textContent=r.name;
        var desc=document.createElement("p");desc.style.cssText="font-size:12px;color:var(--muted);min-height:34px";desc.textContent=r.description;
        card.appendChild(icon);card.appendChild(name);card.appendChild(desc);
        var btn=document.createElement("button");btn.type="button";btn.className="btn "+(active?"ghost":"");btn.disabled=!has||active;btn.textContent=!has?"Ещё не открыто":active?"Используется":"Применить";
        btn.addEventListener("click",function(){state()[kind==="frame"?"equippedFrame":"equippedTitle"]=r.id;persist();window.renderRewardCollection();if(window.renderUserChip)window.renderUserChip();if(window.renderProfilePage&&location.hash.indexOf("#/profile")===0)window.renderProfilePage();});
        card.appendChild(btn);grid.appendChild(card);
      });wrap.appendChild(grid);
    }
    addSection("🖼️ Рамки аватара",frames,"frame");addSection("🏷️ Титулы",titles,"title");
    var clear=document.createElement("button");clear.type="button";clear.className="btn ghost";clear.textContent="Снять рамку и титул";
    clear.addEventListener("click",function(){state().equippedFrame=null;state().equippedTitle=null;persist();window.renderRewardCollection();if(window.renderUserChip)window.renderUserChip();if(window.renderProfilePage&&location.hash.indexOf("#/profile")===0)window.renderProfilePage();});wrap.appendChild(clear);
    app.appendChild(wrap);
  };
  var oldAchievements=window.renderAchievementsPage;
  if(oldAchievements)window.renderAchievementsPage=function(){oldAchievements.apply(this,arguments);window.renderRewardCollection();};
  var oldProfile=window.renderProfilePage;
  if(oldProfile)window.renderProfilePage=function(){
    oldProfile.apply(this,arguments);
    if(!state().student)return;
    var app=document.getElementById("app");if(!app)return;
    var avatar=app.querySelector('section.module div[style*="width:120px"]');applyFrame(avatar);
    var name=app.querySelector("section.module h2");if(name&&state().equippedTitle){var reward=getReward(state().equippedTitle);if(reward){var tag=document.createElement("div");tag.textContent=reward.icon+" "+reward.name;tag.style.cssText="color:var(--gold);font-weight:600;margin:-4px 0 12px";name.insertAdjacentElement("afterend",tag);}}
    window.renderRewardCollection();
  };
  var oldChip=window.renderUserChip;
  if(oldChip)window.renderUserChip=function(){oldChip.apply(this,arguments);var avatar=document.getElementById("userChipAvatar");applyFrame(avatar);};
  var oldUnlock=window.unlockAchievement;
  if(oldUnlock)window.unlockAchievement=function(id){var before=inventory().map(function(r){return r.id;});oldUnlock.apply(this,arguments);if(window.state&&window.state.student){var after=inventory(),fresh=after.filter(function(r){return before.indexOf(r.id)<0;});if(fresh.length&&window.showToast)window.showToast("🎁 Открыта награда: "+fresh.map(function(r){return r.name;}).join(", "),"ok");}};
  document.addEventListener("DOMContentLoaded",function(){if(window.renderUserChip)window.renderUserChip();});
})();