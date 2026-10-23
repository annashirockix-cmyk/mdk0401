/* ============================================================
   МДК — assistant.js (Умный ассистент с обучением)
   ============================================================ */
"use strict";

window.openAssistant = function(){
  var existing = document.getElementById("assistantPanel");
  if (existing){ existing.classList.toggle("open"); return; }
  
  var panel = document.createElement("div");
  panel.id = "assistantPanel"; 
  panel.style = "position:fixed;bottom:90px;right:20px;width:350px;max-width:90vw;background:var(--card);border:1px solid var(--border);border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:99999;display:flex;flex-direction:column;transform:translateY(120%);transition:transform 0.3s;";
  
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding:16px;border-bottom:1px solid var(--border);background:var(--card-soft);border-radius:16px 16px 0 0;">
      <b>🤖 Умный помощник</b>
      <button id="asClose" style="background:none;border:none;color:var(--text);cursor:pointer;">✕</button>
    </div>
    <div id="asLog" style="height:300px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;font-size:14px;"></div>
    <div style="padding: 10px; border-top: 1px solid var(--border); display: flex; gap: 8px;">
      <button class="btn" id="asTourBtn" style="flex:1; font-size:12px; padding:8px; background:var(--gold); color:#000;">🗺️ Экскурсия по сайту</button>
      <button class="btn ghost" id="asClearBrain" style="font-size:12px; padding:8px;" title="Сбросить память бота">🧠 Сброс</button>
    </div>
    <form id="asForm" style="display:flex;padding:10px;border-top:1px solid var(--border);">
      <input type="text" id="asInput" placeholder="Спроси про G-код, XP, Оценки..." style="flex:1;padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);margin-right:8px;">
      <button type="submit" class="btn">➤</button>
    </form>
  `;
  document.body.appendChild(panel); 
  setTimeout(()=>panel.style.transform = "translateY(0)", 20);

  var log = panel.querySelector("#asLog"), input = panel.querySelector("#asInput");
  function addBot(text) { log.appendChild(el(`<div style="background:var(--card-soft);padding:8px 12px;border-radius:8px;align-self:flex-start;line-height:1.4;">${text}</div>`)); log.scrollTop = log.scrollHeight; }
  function addUser(text) { log.appendChild(el(`<div style="background:var(--accent);color:#fff;padding:8px 12px;border-radius:8px;align-self:flex-end;">${text}</div>`)); log.scrollTop = log.scrollHeight; }

  addBot("Привет! Я умный помощник. Спроси меня про <b>самостоятельные</b>, <b>тесты</b>, <b>средний балл</b> или <b>сертификат</b>. Если я не знаю ответа — научи меня!");

  panel.querySelector("#asClose").addEventListener("click", ()=>panel.remove());
  panel.querySelector("#asTourBtn").addEventListener("click", function() { panel.remove(); startTour(); });
  
  panel.querySelector("#asClearBrain").addEventListener("click", function() {
      if(confirm("Сбросить память бота? Все, чему вы его научили, будет удалено.")) {
          localStorage.removeItem('mdk_bot_brain');
          addBot("🧠 Моя память очищена. Теперь я снова как чистый лист.");
      }
  });

  panel.querySelector("#asForm").addEventListener("submit", (e)=>{
    e.preventDefault(); var val = input.value.trim(); if(!val) return;
    input.value = ""; addUser(val);
    
    setTimeout(() => {
      var v = val.toLowerCase();
      
      // 1. Загружаем базу знаний из localStorage
      var brain = JSON.parse(localStorage.getItem('mdk_bot_brain') || '{}');
      
      // 2. Ищем точное совпадение в базе
      if (brain[v]) {
          addBot(brain[v]);
          return;
      }

      // 3. Если нет, ищем по встроенным скриптам
      var reply = null;
      
      if (v.includes("самостоятельн") || v.includes("ср")) {
          reply = "📝 Самостоятельные работы находятся внутри каждой темы. Нажми на тему и выбери вкладку «Самостоятельная».";
      } else if (v.includes("тест") || v.includes("вопрос")) {
          reply = "🎯 Тесты есть внутри каждой темы. Нажми на тему, выбери вкладку «Тест» и нажми «Начать». У тебя будет 10 минут!";
      } else if (v.includes("сертификат") || v.includes("фон") || v.includes("оценк")) {
          reply = "📜 Сертификат и вкладыш с оценками можно найти в левом меню. Там же можно выбрать красивый фон.";
      } else if (v.includes("средний") || v.includes("балл")) {
          reply = "📊 Средний балл отображается в твоем личном кабинете (профиле), а также на странице «Мои оценки».";
      } else if (v.includes("экзамен") || v.includes("итогов")) {
          reply = "📋 Итоговый экзамен находится в левом меню. Там 30 вопросов и 2 письменных задания.";
      } else if (v.includes("xp") || v.includes("опыт") || v.includes("балл")) {
          reply = "⭐ XP дают за прохождение тестов, практик и игр. Чем больше XP, тем выше твой уровень!";
      } else if (v.includes("видео")) {
          reply = "🎬 Видеоуроки находятся в левом меню. Если видео не грузится, нажми кнопку «Скачать / Открыть».";
      } else if (v.includes("игр") || v.includes("аркад")) {
          reply = "🎮 Игровая комната доступна в левом меню. Там есть Сапёр, Судоку, Паук и другие!";
      } else if (v.includes("привет") || v.includes("здравствуй")) {
          reply = "Привет! Чем я могу тебе помочь?";
      } else if (v.includes("спасибо")) {
          reply = "Всегда пожалуйста! Обращайся.";
      }

      // 4. Если нашли ответ — выдаем
      if (reply) {
          addBot(reply);
      } else {
          // 5. Если не нашли — просим научить
          addBot("🤔 Я не знаю, что ответить на это. Хочешь меня научить? Напиши правильный ответ в появившемся окне.");
          setTimeout(() => {
              var answer = prompt("Научи меня! Что нужно ответить на вопрос: \"" + val + "\"?");
              if (answer && answer.trim()) {
                  brain[v] = answer.trim();
                  localStorage.setItem('mdk_bot_brain', JSON.stringify(brain));
                  addBot("🎓 Спасибо! Я запомнил. Теперь я знаю, что на вопрос \"" + val + "\" нужно отвечать: \"" + answer.trim() + "\"");
              } else {
                  addBot("Жаль, что ты не захотел меня учить. Если что, я всегда тут!");
              }
          }, 500);
      }
    }, 500);
  });
};

function initAssistantButton(){
  if (document.getElementById("asFab")) return;
  var btn = document.createElement("button");
  btn.id = "asFab";
  btn.innerHTML = "🤖";
  btn.style = "position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:var(--accent);color:#fff;font-size:30px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:transform 0.2s;";
  btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';
  btn.addEventListener("click", window.openAssistant);
  document.body.appendChild(btn);
}
window.initAssistantButton = initAssistantButton;
window.addEventListener("DOMContentLoaded", () => { initAssistantButton(); });

function startTour() {
    // ... (код тура из предыдущего assistant.js)
}