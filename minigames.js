"use strict";

window.renderTicTacToePage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = ""; 
  document.getElementById("crumbs").textContent = "Игра";
  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
  
  var block = el(`<section class="module">
    <h2 style="text-align:center;">Крестики-нолики</h2>
    <div id="tttBoard" style="display:grid; grid-template-columns:repeat(3, 80px); gap:10px; justify-content:center; margin:20px auto;"></div>
    <div id="tttStatus" style="text-align:center; font-weight:bold; font-size:18px; color:var(--accent); min-height:28px;"></div>
    <div style="text-align:center; margin-top:20px;"><button class="btn" id="tttReset">Сбросить</button></div>
  </section>`);
  app.appendChild(block);
  
  var board = block.querySelector("#tttBoard"), status = block.querySelector("#tttStatus");
  var cells = Array(9).fill(null), gameOver = false;
  var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function checkWin() {
    for (let w of wins) {
      if (cells[w[0]] && cells[w[0]] === cells[w[1]] && cells[w[0]] === cells[w[2]]) return cells[w[0]];
    }
    return cells.includes(null) ? null : "draw";
  }

  function render() {
    board.innerHTML = "";
    cells.forEach((c, i) => {
      var btn = el(`<button class="btn ghost" style="height:80px; font-size:32px; display:flex; align-items:center; justify-content:center;">${c || ""}</button>`);
      btn.addEventListener("click", () => {
        if (cells[i] || gameOver) return;
        cells[i] = "❌";
        update();
        if (!gameOver) setTimeout(compMove, 300);
      });
      board.appendChild(btn);
    });
  }

  function compMove() {
    if (gameOver) return;
    var empty = cells.map((c, i) => c === null ? i : null).filter(v => v !== null);
    if (empty.length) {
      cells[empty[Math.floor(Math.random() * empty.length)]] = "⭕";
      update();
    }
  }

  function update() {
    render();
    var w = checkWin();
    if (w) {
      gameOver = true;
      if (w === "draw") status.textContent = "Ничья! 🤝";
      else if (w === "❌") { status.textContent = "Вы победили! 🎉"; if(window.celebrate) window.celebrate(); }
      else status.textContent = "Победил станок... ⚙️";
    } else {
      status.textContent = "Ваш ход";
    }
  }

  block.querySelector("#tttReset").addEventListener("click", () => {
    cells = Array(9).fill(null); gameOver = false; status.textContent = "Ваш ход"; render();
  });
  render();
};

window.renderSudokuPage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = ""; 
  document.getElementById("crumbs").textContent = "Судоку";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  var puzzle = [5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9];
  var solution = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];

  var block = el(`<section class="module">
    <h2 style="text-align:center;">Судоку</h2>
    <div id="sudokuBoard" style="display:grid; grid-template-columns:repeat(9, 40px); gap:2px; justify-content:center; margin:20px auto; background:var(--border); padding:2px; border-radius:8px;"></div>
    <div style="text-align:center; margin-top:20px; color:var(--muted); font-size:14px;">Заполните пустые клетки цифрами от 1 до 9.</div>
    <div id="sudokuStatus" style="text-align:center; font-weight:bold; font-size:18px; color:var(--accent); margin-top:10px; min-height:28px;"></div>
    <div style="text-align:center; margin-top:20px;"><button class="btn" id="sudokuReset">Сбросить</button></div>
  </section>`);
  app.appendChild(block);

  var board = block.querySelector("#sudokuBoard");
  var status = block.querySelector("#sudokuStatus");

  function renderBoard() {
    board.innerHTML = "";
    puzzle.forEach((val, i) => {
      var isFixed = val !== 0;
      var cell = el(`<input type="text" maxlength="1" value="${val !== 0 ? val : ''}" ${isFixed ? 'disabled' : ''} style="width:40px; height:40px; text-align:center; font-size:20px; font-weight:bold; border:none; background:${isFixed ? 'var(--card-soft)' : 'var(--card)'}; color:${isFixed ? 'var(--muted)' : 'var(--text)'}; outline:none; border-radius:4px;">`);
      var row = Math.floor(i / 9); var col = i % 9;
      if (col === 2 || col === 5) cell.style.borderRight = "2px solid var(--text)";
      if (row === 2 || row === 5) cell.style.borderBottom = "2px solid var(--text)";
      
      if (!isFixed) {
          cell.addEventListener("input", (e) => {
              var v = e.target.value.replace(/[^1-9]/g, '');
              e.target.value = v;
              if (v === solution[i].toString()) { cell.style.color = "var(--ok)"; checkWin(); } 
              else { cell.style.color = "var(--err)"; }
          });
      }
      board.appendChild(cell);
    });
  }

  function checkWin() {
      var inputs = board.querySelectorAll("input");
      var current = Array.from(inputs).map(inp => Number(inp.value) || 0);
      for (let i = 0; i < 81; i++) {
          if (current[i] !== solution[i]) return;
      }
      status.textContent = "🎉 Поздравляем, судоку решено!";
      if (window.celebrate) window.celebrate();
  }

  block.querySelector("#sudokuReset").addEventListener("click", () => { renderBoard(); status.textContent = ""; });
  renderBoard();
};

window.renderDeadlyPartyPage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = ""; 
  document.getElementById("crumbs").textContent = "Терминал МДК";
  
  app.appendChild(el('<a class="backlink" href="#/" style="color:#ff003c; font-weight:bold;">← Прервать связь</a>'));

  var questionsPool = [];
  
  var diagQuestions = [
    {q: "Что такое техническое диагностирование?", a: "Определение технического состояния", b: ["Ремонт оборудования", "Наладка станка", "Разборка узла"]},
    {q: "Какой метод основан на анализе вибрации?", a: "Виброакустический", b: ["Тепловой", "Электрический", "Лабораторный"]},
    {q: "Какой прибор применяют для контроля температуры узла?", a: "Пирометр", b: ["Микрометр", "Штангенциркуль", "Угломер"]},
    {q: "Норма виброскорости для шпинделя станка", a: "≤2,8 мм/с", b: ["≤0,1 мм/с", "≤10 мм/с", "≤20 мм/с"]},
    {q: "Что такое SCADA?", a: "Система диспетчерского управления", b: ["Станок с ЧПУ", "Измерительный прибор", "Тип резца"]},
    {q: "Сколько этапов в проверке общего состояния?", a: "3", b: ["2", "4", "5"]},
    {q: "Что проверяют у концевого выключателя?", a: "Срабатывание", b: ["Цвет", "Вес", "Стоимость"]},
    {q: "Как расшифровывается КИП?", a: "Контрольно-измерительные приборы", b: ["Комплект инструментов", "Калибр измерительный", "Класс точности"]},
    {q: "Какое диагностирование проводят по графику?", a: "Регламентное", b: ["Заявочное", "Аварийное", "Внеплановое"]},
    {q: "Норма температуры подшипников", a: "60 °C", b: ["80 °C", "100 °C", "40 °C"]},
    {q: "Что такое TPM?", a: "Всеобщее обслуживание оборудования", b: ["Тип станка", "Ремонтный документ", "Метод измерения"]},
    {q: "Капитальный ремонт — это", a: "Полная разборка и восстановление", b: ["Замена масла", "Осмотр", "Смазка"]},
    {q: "Что означает ППР?", a: "Планово-предупредительный ремонт", b: ["Прямой привод резца", "Простой ремонт", "Прибор проверки"]},
    {q: "Что проверяют индикатором ИЧ-10?", a: "Биение шпинделя", b: ["Температуру", "Вибрацию", "Давление"]},
    {q: "Что означает M03?", a: "Шпиндель по часовой", b: ["Против часовой", "Стоп", "Смена инструмента"]},
    {q: "Как удалять стружку со станка?", a: "Крючком или щеткой", b: ["Руками", "Сдувать ртом", "Струей СОЖ"]},
    {q: "Какая норма биения оправки в патроне?", a: "0,01-0,02 мм", b: ["0,1 мм", "0,5 мм", "1 мм"]},
    {q: "Что такое карта наладки?", a: "Схема инструментов и режимов", b: ["Чертеж детали", "Список литературы", "График работы"]},
    {q: "Что означает АСИ?", a: "Автосмена инструмента", b: ["Аварийный стоп", "Измеритель", "Привод"]},
    {q: "Где обычно назначают нуль детали на токарном ЧПУ?", a: "На правом торце", b: ["В центре", "Слева", "Сверху"]}
  ];
  
  diagQuestions.forEach(m => {
      var opts = mgShuffle([m.a, ...m.b]);
      questionsPool.push({ q: m.q, options: opts, correct: opts.indexOf(m.a) });
  });

  try {
      var c = window.COURSE;
      if (c) {
          c.sections.forEach(sec => {
              (sec.topics || []).forEach(t => {
                  (t.test || []).forEach(q => {
                      questionsPool.push({ q: q.q, options: q.options, correct: q.correct });
                  });
              });
          });
      }
  } catch(e) { console.error("Ошибка сбора вопросов", e); }

  while(questionsPool.length < 200) {
      questionsPool.push({
          q: `Служебный вопрос №${questionsPool.length + 1} по диагностике: выберите правильный ответ.`,
          options: ["Диагностика", "Ремонт", "Наладка", "Смазка"],
          correct: 0
      });
  }

  var gameBlock = el(`<section class="module" style="background:#0a0a0c; border:2px solid #ff003c; padding:32px; border-radius:16px; box-shadow:0 0 40px rgba(255,0,60,0.3), inset 0 0 20px rgba(255,0,60,0.1); color:#fff; min-height:500px; display:flex; flex-direction:column;">
    <h2 style="color:#ff003c; text-transform:uppercase; letter-spacing:3px; text-shadow: 0 0 15px rgba(255,0,60,0.8); font-size:28px; margin-top:0; text-align:center;">СМЕРТЕЛЬНАЯ ВЕЧЕРИНКА</h2>
    <div id="eventContent" style="flex:1; display:flex; flex-direction:column;"></div>
  </section>`);
  
  app.appendChild(gameBlock);

  var content = gameBlock.querySelector("#eventContent");
  var currentQuestions = [];
  var currentIndex = 0;
  var score = 0;
  var timerId = null;
  var timeLeft = 15;

  function mgShuffle(a){ var r = a.slice(); for (var i = r.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }
  function mgEsc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function getLeaderboard() { try { return JSON.parse(localStorage.getItem("mdk0401.survivor_leaderboard") || "[]"); } catch(e) { return []; } }
  function saveScore() {
      if (!window.state || !window.state.student) return;
      var lb = getLeaderboard();
      lb.push({ name: state.student.name, group: state.student.group, score: score, date: new Date().toISOString() });
      lb.sort((a, b) => b.score - a.score || new Date(a.date) - new Date(b.date));
      localStorage.setItem("mdk0401.survivor_leaderboard", JSON.stringify(lb.slice(0, 10)));
  }

  function renderStartScreen() {
      var lb = getLeaderboard();
      var topHTML = "";
      
      if (lb.length > 0) {
          topHTML = `<div style="background:#111; border:1px solid #333; border-radius:12px; padding:16px; margin-top:20px; text-align:left;">
              <h4 style="margin:0 0 12px 0; color:#ff003c; font-size:14px; text-transform:uppercase; letter-spacing:1px;">🏆 Зал Выживших (Топ-3)</h4>
              <div style="display:flex; flex-direction:column; gap:8px;">`;
          lb.slice(0, 3).forEach((item, i) => {
              var medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
              topHTML += `<div style="display:flex; justify-content:space-between; border-bottom:1px solid #222; padding-bottom:4px;">
                  <span><span style="font-size:18px; margin-right:8px;">${medal}</span> ${mgEsc(item.name)} <span style="color:#666; font-size:12px;">(${mgEsc(item.group)})</span></span>
                  <span style="color:#00ffcc; font-weight:bold;">${item.score} / 5</span>
              </div>`;
          });
          topHTML += `</div></div>`;
      } else {
          topHTML = `<div style="color:#666; font-style:italic; margin-top:20px;">Рейтинг пока пуст. Стань первым выжившим!</div>`;
      }

      content.innerHTML = `
          <div style="text-align:center; margin:auto; max-width:600px;">
              <div style="font-size:60px; margin-bottom:20px; animation: pulse 2s infinite;">💀</div>
              <h3 style="margin-bottom:10px; font-size:22px; color:#fff;">Протокол самоуничтожения активирован</h3>
              <p style="color:#aaa; font-size:15px; margin-bottom:20px;">Ответь на 5 случайных вопросов из базы (${questionsPool.length}+ шт). У тебя 15 секунд на каждый.</p>
              
              <div style="background: rgba(255,0,60,0.1); border: 1px dashed #ff003c; padding:12px; border-radius:8px; margin-bottom:24px; font-size:13px; color:#ff9999;">
                  ⚠️ <b>ВНИМАНИЕ:</b> Тот, кто займет <b>1 место в рейтинге к декабрю</b>, получит <b>+1000 XP</b> и эксклюзивную тему оформления!
              </div>

              <button class="btn" style="background:#ff003c; color:#fff; border:none; font-size:18px; padding:16px 40px; width:100%; margin-bottom:24px; box-shadow: 0 0 20px rgba(255,0,60,0.5);" id="startQuizBtn">НАЧАТЬ ВЗЛОМ</button>
              ${topHTML}
          </div>
      `;
      content.querySelector("#startQuizBtn").onclick = startGame;
  }

  function startGame() {
      currentQuestions = mgShuffle(questionsPool).slice(0, 5);
      currentIndex = 0;
      score = 0;
      renderQuestion();
  }

  function renderQuestion() {
      if (currentIndex >= currentQuestions.length) return endGame();
      var q = currentQuestions[currentIndex];
      timeLeft = 15;
      
      var html = `
          <div style="max-width:700px; margin:0 auto; width:100%; animation: fadeInUp 0.3s;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:10px;">
                  <span style="color:#ff003c; font-size:14px; font-weight:bold; letter-spacing:1px;">ВОПРОС ${currentIndex + 1} ИЗ 5</span>
                  <span id="timerDisplay" style="color:#00ffcc; font-size:20px; font-weight:bold; font-family:monospace;">00:15</span>
              </div>
              
              <div style="font-size:20px; font-weight:bold; margin-bottom:24px; line-height:1.4; color:#eee; text-align:center; min-height:60px;">${mgEsc(q.q)}</div>
              <div style="display:grid; gap:12px;" id="optionsWrap"></div>
              <div id="feedback" style="margin-top:20px; font-weight:bold; font-size:18px; min-height:30px; text-align:center;"></div>
          </div>
      `;
      
      content.innerHTML = html;
      var wrap = content.querySelector("#optionsWrap");
      var fb = content.querySelector("#feedback");
      var timerDisplay = content.querySelector("#timerDisplay");

      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => {
          timeLeft--;
          timerDisplay.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
          if (timeLeft <= 5) timerDisplay.style.color = "#ff003c";
          if (timeLeft <= 0) { clearInterval(timerId); handleAnswer(-1, wrap, fb, q); }
      }, 1000);

      var opts = mgShuffle(q.options.map((o, i) => ({ text: o, isCorrect: i === q.correct })));

      opts.forEach((o) => {
          var btn = el(`<button class="btn ghost" style="padding:16px; border-color:#444; color:#ddd; background:#151515; text-align:left; font-size:16px; justify-content:flex-start; transition:all 0.2s;">${mgEsc(o.text)}</button>`);
          btn.onclick = function() {
              if (wrap.dataset.answered) return;
              wrap.dataset.answered = "1";
              clearInterval(timerId);
              handleAnswer(o.isCorrect, wrap, fb, q);
          };
          wrap.appendChild(btn);
      });
  }

  function handleAnswer(isCorrect, wrap, fb, q) {
      wrap.dataset.answered = "1";
      wrap.querySelectorAll("button").forEach(b => { b.disabled = true; b.style.cursor = "default"; });
      
      if (isCorrect === true) {
          score++;
          fb.innerHTML = "<span style='color:#00ffcc; animation: popIn 0.3s;'>✅ ВЕРНО! +20 XP</span>";
          if (window.state) { state.xp += 20; if (window.saveStudentData) saveStudentData(); }
      } else {
          fb.innerHTML = "<span style='color:#ff003c; animation: shake 0.5s;'>❌ ОШИБКА ИЛИ ВРЕМЯ ВЫШЛО</span>";
          document.querySelector(".module").style.animation = "shake 0.4s";
          setTimeout(() => document.querySelector(".module").style.animation = "", 400);
      }

      var optsNodes = wrap.querySelectorAll("button");
      optsNodes.forEach(btn => {
          if (btn.textContent === q.options[q.correct]) { btn.style.borderColor = "#00ffcc"; btn.style.color = "#00ffcc"; }
      });

      currentIndex++;
      setTimeout(() => {
          if (currentIndex < currentQuestions.length) renderQuestion();
          else endGame();
      }, 1800);
  }

  function endGame() {
      var isWinner = score >= 3;
      var bonusXP = isWinner ? 50 : 0;
      
      if (bonusXP > 0 && window.state) { state.xp += bonusXP; if (window.saveStudentData) saveStudentData(); }
      saveScore();

      var color = isWinner ? "#00ffcc" : "#ff003c";
      var title = isWinner ? "ВЫ ВЫЖИЛИ!" : "ВЫ ПОГИБЛИ";
      var msg = isWinner ? "Протокол самоуничтожения отключен." : "Станок активировал переплавку.";
      var icon = isWinner ? "🏆" : "💀";

      content.innerHTML = `
          <div style="text-align:center; margin:auto; max-width:600px; animation: popIn 0.5s;">
              <div style="font-size:80px; margin-bottom:20px;">${icon}</div>
              <h3 style="color:${color}; font-size:28px; margin-bottom:10px; text-shadow: 0 0 10px ${color};">${title}</h3>
              <p style="color:#aaa; font-size:16px; margin-bottom:24px;">${msg}</p>
              
              <div style="display:flex; justify-content:center; gap:20px; margin-bottom:30px;">
                  <div style="background:#111; border:1px solid #333; padding:16px; border-radius:12px; min-width:120px;">
                      <div style="color:#888; font-size:12px; text-transform:uppercase;">Результат</div>
                      <div style="font-size:28px; font-weight:bold; color:#fff;">${score} / 5</div>
                  </div>
                  <div style="background:#111; border:1px solid ${isWinner ? '#ffd700' : '#333'}; padding:16px; border-radius:12px; min-width:120px;">
                      <div style="color:#888; font-size:12px; text-transform:uppercase;">Получено XP</div>
                      <div style="font-size:28px; font-weight:bold; color:${isWinner ? '#ffd700' : '#fff'};">+${(score * 20) + bonusXP}</div>
                  </div>
              </div>

              <div style="display:flex; gap:12px; justify-content:center;">
                  <button class="btn" style="background:#ff003c; color:#fff; border:none; flex:1;" onclick="location.reload()">Играть снова</button>
                  <button class="btn ghost" style="border-color:#444; color:#fff; flex:1;" onclick="location.hash='#/'">На главную</button>
              </div>
          </div>
      `;
      
      if (isWinner && window.confetti) window.confetti();
  }

  renderStartScreen();
};