"use strict";
(function(){
  var themes=[["dark","🌌 Тёмная"],["light","☀️ Светлая"],["neon","💗 Неон"],["matrix","💚 Матрица"],["cyberpunk","⚡ Киберпанк"],["graphite","🪨 Графит"],["lavender","💜 Лаванда"],["ocean","🌊 Океан"]];
  function applyTheme(id){if(!themes.some(function(t){return t[0]===id;}))id="dark";document.documentElement.setAttribute("data-theme",id);try{localStorage.setItem("mdk.theme_active",id);}catch(e){}var s=window.state||{};s.activeTheme=id;}
  function mountTheme(){
    var xp=document.getElementById("xpCount");if(!xp||document.getElementById("themePalette"))return;
    var wrap=document.createElement("div");wrap.id="themePalette";wrap.style.cssText="position:relative;display:inline-flex;align-items:center;z-index:20";
    var trigger=document.createElement("button");trigger.type="button";trigger.textContent="🎨";trigger.title="Выбрать тему оформления";trigger.setAttribute("aria-label","Выбрать тему оформления");trigger.style.cssText="border:1px solid var(--border);background:var(--card);color:var(--text);border-radius:10px;padding:7px 9px;cursor:pointer;font-size:16px";
    var menu=document.createElement("div");menu.style.cssText="display:none;position:absolute;right:0;top:calc(100% + 8px);width:190px;padding:7px;background:var(--card);border:1px solid var(--border);border-radius:12px;box-shadow:0 12px 30px #0006";
    themes.forEach(function(t){var b=document.createElement("button");b.type="button";b.textContent=t[1];b.style.cssText="display:block;width:100%;text-align:left;padding:8px;border:0;border-radius:7px;background:transparent;color:var(--text);cursor:pointer";b.onclick=function(){applyTheme(t[0]);menu.style.display="none";};menu.appendChild(b);});
    trigger.onclick=function(){menu.style.display=menu.style.display==="block"?"none":"block";};wrap.appendChild(trigger);wrap.appendChild(menu);xp.insertAdjacentElement("afterend",wrap);
    document.addEventListener("click",function(e){if(!wrap.contains(e.target))menu.style.display="none";});
  }
  function mountHome(){
    var app=document.getElementById("app");if(!app||app.querySelector("#nextgenStartPanel"))return;
    var panel=document.createElement("section");panel.id="nextgenStartPanel";panel.className="module";
    panel.style.cssText="border-left:4px solid var(--accent);margin:18px 0;padding:18px";
    panel.innerHTML="<div style='display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center'><div><div style='font-size:11px;letter-spacing:1.5px;color:var(--accent);font-weight:800'>NEXT-GEN LEARNING HUB</div><h3 style='margin:6px 0'>Учись, пробуй, прокачивайся 🚀</h3><p style='margin:0;color:var(--muted)'>Короткий маршрут: лекция → практика → самопроверка → достижение.</p></div><div style='display:flex;gap:8px;flex-wrap:wrap'><a class='btn' href='./g_code_full.html?v=5'>G-Code Lab · 300 уровней</a><a class='btn ghost' href='#/training'>Тренировка</a><a class='btn ghost' href='#/rating'>Рейтинг</a></div></div>";
    var hero=app.querySelector(".hero");if(hero)hero.insertAdjacentElement("afterend",panel);else app.prepend(panel);
  }
  function start(){mountTheme();mountHome();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
  var oldHome=window.renderHomePage;
  if(oldHome)window.renderHomePage=function(){oldHome.apply(this,arguments);mountTheme();mountHome();};
  var oldChip=window.renderUserChip;
  if(oldChip)window.renderUserChip=function(){oldChip.apply(this,arguments);mountTheme();};
})();
