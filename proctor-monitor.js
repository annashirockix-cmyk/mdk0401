(function(){
"use strict";
var active=false,lastEvent=0,currentTest="",noticeOpen=false,noticeQueue=[];
function isAssessment(){var app=document.getElementById("app"),area=document.getElementById("topicContent");var root=area||app;if(!root)return false;return !!root.querySelector('input[type="radio"],input[type="checkbox"],input[type="number"][name^="q"],.question,.exam-question');}
function getTestId(){var hash=String(location.hash||"");var m=hash.match(/final\/([^/?#]+)/);if(m)return "__final__"+m[1];var root=document.getElementById("topicContent");if(root&&root.dataset&&root.dataset.testId)return root.dataset.testId;var s=window.state||{};return "test_"+String(s.activeTopicId||hash.split("/").pop()||"unknown");}

function showProctorNotice(kind,data){
 if(noticeOpen){noticeQueue.push([kind,data]);return;}noticeOpen=true;
 var overlay=document.createElement("div");overlay.className="proctor-dialog";
 overlay.style.cssText="position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,.76);display:flex;align-items:center;justify-content:center;padding:18px";
 var card=document.createElement("section");card.style.cssText="max-width:520px;width:100%;padding:24px;background:var(--card,#171b25);color:var(--text,#fff);border:2px solid "+(kind==="warning"?"#d99b26":"#d9534f")+";border-radius:14px;box-shadow:0 20px 70px rgba(0,0,0,.45)";
 var h=document.createElement("h2");h.textContent=kind==="warning"?"⚠️ Первое предупреждение":"⛔ Применена штрафная санкция";
 var p=document.createElement("p");p.style.cssText="line-height:1.55";p.textContent=kind==="warning"?"Система зафиксировала действие, которое может нарушать правила самостоятельного выполнения теста. Не переключайте вкладки и не используйте постороннюю помощь. Повторное нарушение приведёт к снижению результата на 10 процентных пунктов.":"Повторное нарушение зафиксировано. К результату теста применён штраф "+Number(data.penaltyPoints||10)+" процентных пунктов. "+(data.reportSent?"Отчёт отправлен преподавателю.":"Отчёт пока не удалось отправить преподавателю.")+" Продолжение теста означает, что вы ознакомлены с санкцией.";
 var b=document.createElement("button");b.type="button";b.className="btn";b.textContent=kind==="warning"?"Понятно, продолжить тест":"Продолжить тест";b.style.cssText="width:100%;margin-top:12px";
 b.addEventListener("click",function(){overlay.remove();noticeOpen=false;if(noticeQueue.length){var next=noticeQueue.shift();showProctorNotice(next[0],next[1]);}});
 card.appendChild(h);card.appendChild(p);card.appendChild(b);overlay.appendChild(card);document.body.appendChild(overlay);b.focus();
}

function send(type,details){var s=window.state||{},student=s.student||{},cid=String(s.activeCourseId||"");if(!active||!window.API||!window.API.logProctorEvent||!cid)return;var now=Date.now();if(now-lastEvent<1800)return;lastEvent=now;window.API.logProctorEvent({courseId:cid,testId:currentTest,eventType:type,page:location.hash,clientTime:new Date().toISOString(),details:details||""}).then(function(r){if(!r||!r.success||r.throttled)return;if(r.action==="warning")showProctorNotice("warning",r);else if(r.action==="sanction")showProctorNotice("sanction",r);}).catch(function(e){console.warn("[proctor]",e.message||e);});}
function sync(){var next=isAssessment();if(next&&!active){active=true;currentTest=getTestId();var root=document.getElementById("topicContent")||document.getElementById("app");if(root&&!root.querySelector(".proctor-notice")){var note=document.createElement("div");note.className="proctor-notice";note.textContent="Контроль попытки: первое нарушение вызывает предупреждение. Повторное нарушение снижает результат на 10 процентных пунктов (максимум 30) и отправляет отчёт преподавателю. Браузер не может достоверно определить создание скриншота внешней программой или использование ИИ на другом устройстве.";note.style.cssText="padding:9px 12px;margin:8px 0 14px;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:8px;font-size:12px;color:var(--muted)";root.insertBefore(note,root.firstChild);}}else if(!next&&active){active=false;currentTest="";}}
document.addEventListener("visibilitychange",function(){sync();if(active&&document.visibilityState==="hidden")send("visibility_hidden","Документ стал невидимым: переключение вкладки или сворачивание браузера.");});
window.addEventListener("blur",function(){sync();if(active)send("window_blur","Окно браузера потеряло фокус.");});
document.addEventListener("fullscreenchange",function(){if(active&&!document.fullscreenElement)send("fullscreen_exit","Выход из полноэкранного режима.");});
document.addEventListener("copy",function(e){sync();if(active)send("copy_attempt","Событие копирования в области страницы.");},true);
document.addEventListener("paste",function(e){sync();if(active)send("paste_attempt","Событие вставки в области страницы.");},true);
document.addEventListener("contextmenu",function(e){sync();if(active)send("contextmenu_attempt","Вызов контекстного меню.");},true);
document.addEventListener("keydown",function(e){sync();if(!active)return;if(e.key==="PrintScreen")send("screenshot_shortcut","Браузер получил клавишу PrintScreen; фактическое создание снимка не подтверждается.");if((e.ctrlKey||e.metaKey)&&e.shiftKey&&String(e.key).toLowerCase()==="i")send("devtools_shortcut","Комбинация открытия инструментов разработчика.");},true);
document.addEventListener("click",function(e){sync();if(!active)return;var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(a){try{var u=new URL(a.href,location.href);if(u.origin!==location.origin)send("external_link","Переход по внешней ссылке: "+u.hostname);}catch(ignore){}}},true);
var observer=new MutationObserver(sync);observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("hashchange",function(){setTimeout(sync,0);});
document.addEventListener("DOMContentLoaded",sync);setInterval(sync,1500);
console.log("[proctor-monitor] basic browser-visible exam events enabled");
})();