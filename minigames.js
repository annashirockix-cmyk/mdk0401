/* ============================================================
   МДК 04.01 — minigames.js (v1.0 — DIAGNOSTICS ARCADE)
   ============================================================ */
"use strict";

/* ============================================================
   1. КРЕСТИКИ-НОЛИКИ 4×4
   ============================================================ */
window.renderTicTacToePage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Крестики-нолики 4×4";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  var block = el(`<section class="module" style="text-align:center;">
    <h2>Крестики-нолики 4×4</h2>
    <p class="sub" style="margin-bottom:15px;">Соберите 4 в ряд. Сможете обыграть неисправность?</p>
    <div style="margin-bottom:20px;">
      <select id="tttDiff" class="self-input" style="width:auto;display:inline-block;">
        <option value="easy">Легкий</option>
        <option value="medium">Средний</option>
        <option value="hard">Невозможный</option>
      </select>
    </div>
    <div id="tttBoard" style="display:grid;grid-template-columns:repeat(4,70px);gap:8px;justify-content:center;margin:20px auto;"></div>
    <div id="tttStatus" style="font-weight:bold;font-size:18px;color:var(--accent);min-height:28px;"></div>
    <div style="margin-top:20px;"><button class="btn ghost" id="tttReset">Сбросить</button></div>
  </section>`);
  app.appendChild(block);

  var boardEl = block.querySelector("#tttBoard"), status = block.querySelector("#tttStatus");
  var cells = Array(16).fill(null), gameOver = false;

  var LINES = [
    [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
    [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],
    [0,5,10,15], [3,6,9,12]
  ];

  function checkWin(board) {
    for (var i = 0; i < LINES.length; i++) {
      var l = LINES[i];
      if (board[l[0]] && board[l[0]] === board[l[1]] && board[l[0]] === board[l[2]] && board[l[0]] === board[l[3]]) return board[l[0]];
    }
    return board.indexOf(null) === -1 ? "draw" : null;
  }

  function render() {
    boardEl.innerHTML = "";
    cells.forEach(function(c, i){
      var btn = el(`<button class="btn ghost" style="height:70px;font-size:28px;display:flex;align-items:center;justify-content:center;">${c || ""}</button>`);
      btn.onclick = function(){ playerMove(i); };
      boardEl.appendChild(btn);
    });
  }

  function playerMove(i) {
    if (cells[i] || gameOver) return;
    cells[i] = "🔧"; render(); // Меняем крестик на гаечный ключ
    var w = checkWin(cells);
    if (w) return endGame(w);
    status.textContent = "Ход неисправности...";
    setTimeout(function() { aiMove(); }, 100);
  }

  function evaluateBoard(board) {
    var score = 0;
    for (var i = 0; i < LINES.length; i++) {
      var oCount = 0, xCount = 0;
      var l = LINES[i];
      for (var j = 0; j < 4; j++) {
        if (board[l[j]] === "⚙️") oCount++; // Меняем нолик на шестеренку
        if (board[l[j]] === "🔧") xCount++;
      }
      if (oCount > 0 && xCount === 0) score += Math.pow(10, oCount);
      if (xCount > 0 && oCount === 0) score -= Math.pow(10, xCount);
    }
    return score;
  }

  function minimax(board, depth, isMax, alpha, beta) {
    var result = checkWin(board);
    if (result === "⚙️") return 100000;
    if (result === "🔧") return -100000;
    if (result === "draw") return 0;
    if (depth === 0) return evaluateBoard(board);

    if (isMax) {
      var maxEval = -Infinity;
      for (var i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "⚙️";
          var evalScore = minimax(board, depth - 1, false, alpha, beta);
          board[i] = null;
          maxEval = Math.max(maxEval, evalScore);
          alpha = Math.max(alpha, evalScore);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      var minEval = Infinity;
      for (var j = 0; j < board.length; j++) {
        if (board[j] === null) {
          board[j] = "🔧";
          var evalScore2 = minimax(board, depth - 1, true, alpha, beta);
          board[j] = null;
          minEval = Math.min(minEval, evalScore2);
          beta = Math.min(beta, evalScore2);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  }

  function getBestMove(board, depth) {
    var bestScore = -Infinity, move = -1;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "⚙️";
        var score = minimax(board, depth - 1, false, -Infinity, Infinity);
        board[i] = null;
        if (score > bestScore) { bestScore = score; move = i; }
      }
    }
    return move === -1 ? board.indexOf(null) : move;
  }

  function aiMove() {
    var diff = block.querySelector("#tttDiff").value;
    var empty = cells.map(function(c, i){ return c === null ? i : null; }).filter(function(v){ return v !== null; });
    if (!empty.length) return;

    var move;
    if (diff === "easy") move = empty[Math.floor(Math.random() * empty.length)];
    else if (diff === "medium") move = getBestMove(cells, 2);
    else {
      var d = cells.filter(function(c){ return c === null; }).length > 10 ? 4 : 6;
      move = getBestMove(cells, d);
    }

    if (move === undefined || move === -1) move = empty[Math.floor(Math.random() * empty.length)];

    cells[move] = "⚙️"; render();
    var w = checkWin(cells);
    if (w) return endGame(w);
    status.textContent = "Ваш ход";
  }

  function endGame(w) {
    gameOver = true;
    if (w === "draw") status.textContent = "Ничья! 🤝";
    else if (w === "🔧") {
      status.textContent = "Вы победили! 🎉";
      var diff = block.querySelector("#tttDiff").value;
      var xp = diff === "easy" ? 20 : (diff === "medium" ? 50 : 150);
      if (window.addXP) window.addXP(xp);
    } else status.textContent = "Победила неисправность... ⚙️";
  }

  block.querySelector("#tttReset").onclick = function(){
    cells = Array(16).fill(null); gameOver = false; status.textContent = "Ваш ход"; render();
  };
  render();
};

/* ============================================================
   2. СУДОКУ 4×4
   ============================================================ */
window.renderSudokuPage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Судоку 4×4";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  var solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
  var puzzle = [[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]];
  var grid = puzzle.map(function(row){ return row.slice(); });

  var block = el('<section class="module" style="text-align:center;"><h2>Судоку 4×4</h2><p class="sub">Заполните пустые клетки цифрами 1–4.</p><div id="sudokuGrid" style="display:inline-grid;grid-template-columns:repeat(4,60px);gap:2px;margin:20px auto;"></div><div id="sudokuStatus" style="font-weight:bold;min-height:28px;color:var(--accent);"></div><div style="margin-top:20px;"><button class="btn ghost" id="sudokuReset">Сбросить</button></div></section>');
  app.appendChild(block);

  function render() {
    var gridEl = block.querySelector("#sudokuGrid");
    gridEl.innerHTML = "";
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var val = grid[r][c], isFixed = puzzle[r][c] !== 0;
        var cell = el('<input type="number" min="1" max="4" value="' + (val || "") + '" style="width:60px;height:60px;font-size:24px;text-align:center;font-weight:bold;border:1px solid var(--border);background:' + (isFixed ? 'var(--accent-soft)' : 'var(--card)') + ';color:var(--text);border-radius:8px;" ' + (isFixed ? "disabled" : "") + ' data-r="' + r + '" data-c="' + c + '">');
        cell.oninput = (function(r,c){ return function(e){
            var v = parseInt(e.target.value, 10) || 0;
            if (v < 1 || v > 4) { e.target.value = ""; grid[r][c] = 0; return; }
            grid[r][c] = v; checkWin();
        }; })(r, c);
        gridEl.appendChild(cell);
      }
    }
  }

  function checkWin() {
    var status = block.querySelector("#sudokuStatus");
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        if (grid[r][c] !== solution[r][c]) { status.textContent = ""; return; }
      }
    }
    status.textContent = "🎉 Решено! +50 XP"; status.style.color = "var(--ok)";
    if (window.addXP) window.addXP(50);
  }

  block.querySelector("#sudokuReset").onclick = function(){
    grid = puzzle.map(function(row){ return row.slice(); });
    block.querySelector("#sudokuStatus").textContent = "";
    render();
  };
  render();
};

/* ============================================================
   3. САПЁР
   ============================================================ */
window.renderMinesweeperPage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Сапёр";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  var SIZE = 8, MINES = 10;
  var mines = [], revealed = [], flagged = [], gameOver = false, flagMode = false;

  function init() {
    mines = []; revealed = []; flagged = []; gameOver = false; flagMode = false;
    for (var r = 0; r < SIZE; r++) {
      mines.push(Array(SIZE).fill(false));
      revealed.push(Array(SIZE).fill(false));
      flagged.push(Array(SIZE).fill(false));
    }
    var placed = 0;
    while (placed < MINES) {
      var r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
      if (!mines[r][c]) { mines[r][c] = true; placed++; }
    }
  }

  function countNear(r, c) {
    var n = 0;
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      var nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && mines[nr][nc]) n++;
    }
    return n;
  }

  function reveal(r, c) {
    if (gameOver || revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true;
    if (mines[r][c]) { gameOver = true; return; }
    if (countNear(r, c) === 0) {
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !revealed[nr][nc]) reveal(nr, nc);
      }
    }
  }

  var block = el('<section class="module" style="text-align:center;"><h2>💣 Сапёр 8×8</h2>' +
    '<div style="margin-bottom:16px;"><button class="btn ' + (flagMode ? '' : 'ghost') + '" id="msFlagBtn">🚩 Режим флажка: ВЫКЛ</button></div>' +
    '<div id="msGrid" style="display:inline-grid;grid-template-columns:repeat(8,40px);gap:2px;margin:20px auto;"></div>' +
    '<div id="msStatus" style="font-weight:bold;min-height:28px;color:var(--accent);"></div>' +
    '<div style="margin-top:20px;"><button class="btn ghost" id="msReset">Заново</button></div></section>');
  app.appendChild(block);

  var flagBtn = block.querySelector("#msFlagBtn");

  function render() {
    var gridEl = block.querySelector("#msGrid"); gridEl.innerHTML = "";
    var won = true;
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var isRev = revealed[r][c], isMine = mines[r][c], isFlag = flagged[r][c];
        var near = isRev ? countNear(r, c) : 0;
        var label = "";
        var bg = 'var(--card)';
        
        if (isRev) {
          bg = 'var(--card-soft)';
          if (isMine) { label = "💥"; won = false; }
          else if (near > 0) label = String(near);
        } else if (isFlag) {
          label = "🚩";
        } else if (!isMine) { won = false; }

        var cell = el('<button style="width:40px;height:40px;font-size:16px;font-weight:bold;border:1px solid var(--border);border-radius:6px;background:' + bg + ';color:var(--text);cursor:pointer;user-select:none;">' + label + '</button>');
        
        cell.onclick = (function(r, c){ return function(e){
            if (gameOver || revealed[r][c]) return;
            if (flagMode) { flagged[r][c] = !flagged[r][c]; render(); } 
            else {
                if (flagged[r][c]) return;
                reveal(r, c);
                if (mines[r][c]) { gameOver = true; for (var rr = 0; rr < SIZE; rr++) for (var cc = 0; cc < SIZE; cc++) if (mines[rr][cc]) revealed[rr][cc] = true; }
                render();
            }
        }; })(r, c);

        cell.oncontextmenu = (function(r, c){ return function(e){
            e.preventDefault();
            if (gameOver || revealed[r][c]) return;
            flagged[r][c] = !flagged[r][c]; render();
        }; })(r, c);

        gridEl.appendChild(cell);
      }
    }
    var status = block.querySelector("#msStatus");
    if (gameOver) { status.textContent = "💥 Вы подорвались!"; status.style.color = "var(--err)"; }
    else if (won) { status.textContent = "🎉 Победа! +100 XP"; status.style.color = "var(--ok)"; if (window.addXP) window.addXP(100); }
    else { status.textContent = ""; }
  }

  flagBtn.onclick = function() {
    flagMode = !flagMode;
    flagBtn.textContent = "🚩 Режим флажка: " + (flagMode ? "ВКЛ" : "ВЫКЛ");
    flagBtn.className = "btn " + (flagMode ? "" : "ghost");
  };

  block.querySelector("#msReset").onclick = function(){ init(); render(); flagBtn.textContent = "🚩 Режим флажка: ВЫКЛ"; flagBtn.className = "btn ghost"; };
  init(); render();
};

/* ============================================================
   4. КАЗИНО (СЛОТЫ)
   ============================================================ */
window.renderCasinoPage = function() {
  var app = document.getElementById("app"); if(!app) return; app.innerHTML = "";
  document.getElementById("crumbs").textContent = "🎰 Казино";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  if (!state.student) { app.appendChild(el('<div class="module">Войдите как студент, чтобы испытать удачу.</div>')); return; }

  var block = el('<section class="module" style="text-align:center;">' +
    '<h2>🎰 Испытай удачу</h2>' +
    '<p class="sub">Собери 3 одинаковых символа и сорви куш!</p>' +
    '<div style="display:flex; justify-content:center; gap:15px; margin:40px 0; flex-wrap:wrap;">' +
      '<div id="reel1" style="font-size:64px; width:100px; height:120px; background:var(--card-soft); border:2px solid var(--border); border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow: inset 0 0 15px rgba(0,0,0,0.1);">❓</div>' +
      '<div id="reel2" style="font-size:64px; width:100px; height:120px; background:var(--card-soft); border:2px solid var(--border); border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow: inset 0 0 15px rgba(0,0,0,0.1);">❓</div>' +
      '<div id="reel3" style="font-size:64px; width:100px; height:120px; background:var(--card-soft); border:2px solid var(--border); border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow: inset 0 0 15px rgba(0,0,0,0.1);">❓</div>' +
    '</div>' +
    '<div style="margin-bottom:20px;">' +
      '<label style="font-weight:bold; margin-right:10px;">Ставка:</label>' +
      '<select id="casinoBet" class="self-input" style="width:auto; font-weight:bold; padding:8px;">' +
        '<option value="10">10 XP</option><option value="50" selected>50 XP</option><option value="100">100 XP</option><option value="500">500 XP</option>' +
      '</select>' +
    '</div>' +
    '<button class="btn" id="spinBtn" style="font-size:20px; padding:15px 40px; width:100%; max-width:300px; background:linear-gradient(45deg, #f1c40f, #e67e22); color:#000;">🎰 Крутить!</button>' +
    '<div id="casinoResult" style="margin-top:20px; font-size:24px; font-weight:bold; min-height:40px;"></div>' +
  '</section>');
  app.appendChild(block);

  var btn = block.querySelector("#spinBtn"), betSelect = block.querySelector("#casinoBet");
  var r1 = block.querySelector("#reel1"), r2 = block.querySelector("#reel2"), r3 = block.querySelector("#reel3");
  var resDiv = block.querySelector("#casinoResult");
  var symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];

  btn.onclick = function() {
    var bet = parseInt(betSelect.value, 10);
    if (state.xp < bet) { window.showToast("Недостаточно XP!", "err"); return; }

    state.xp -= bet; window.saveStudentData(); if (window.updateXpDisplay) window.updateXpDisplay();
    btn.disabled = true; betSelect.disabled = true; resDiv.textContent = "";
    
    var spinning = setInterval(function() {
      r1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      r2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      r3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 50);

    setTimeout(function() {
      clearInterval(spinning);
      var res1, res2, res3;
      var roll = Math.random();

      if (roll < 0.01) { res1 = res2 = res3 = "7️⃣"; } 
      else if (roll < 0.05) { res1 = res2 = res3 = symbols[Math.floor(Math.random() * 4)]; } 
      else if (roll < 0.10) { res1 = res2 = "7️⃣"; res3 = symbols[Math.floor(Math.random() * 4)]; } 
      else {
          res1 = symbols[Math.floor(Math.random() * symbols.length)];
          res2 = symbols[Math.floor(Math.random() * symbols.length)];
          res3 = symbols[Math.floor(Math.random() * symbols.length)];
          if (res1 === res2 && res2 === res3) res3 = symbols[(symbols.indexOf(res3) + 1) % symbols.length];
          if (res1 === res2 || res2 === res3 || res1 === res3) {
             res3 = symbols[(symbols.indexOf(res1) + 1) % symbols.length];
             if (res2 === res3) res3 = symbols[(symbols.indexOf(res2) + 1) % symbols.length];
          }
      }

      r1.textContent = res1; r2.textContent = res2; r3.textContent = res3;
      var winAmount = 0, message = "";

      if (res1 === res2 && res2 === res3) {
          if (res1 === "7️⃣") { winAmount = bet * 5; message = "🎉 ДЖЕКПОТ! x5"; }
          else { winAmount = bet * 2; message = "🔥 Выигрыш! x2"; }
      } else if ((res1 === "7️⃣" && res2 === "7️⃣") || (res2 === "7️⃣" && res3 === "7️⃣")) {
          winAmount = bet; message = "✨ Возврат ставки.";
      } else { winAmount = 0; message = "💸 Вы проиграли."; }

      if (winAmount > 0) {
          state.xp += winAmount; window.saveStudentData(); if (window.updateXpDisplay) window.updateXpDisplay();
          resDiv.style.color = "var(--ok)"; resDiv.textContent = message + " +" + winAmount + " XP";
          window.showToast("Выигрыш: +" + winAmount + " XP", "ok");
          if (res1 === "7️⃣" && typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      } else {
          resDiv.style.color = "var(--err)"; resDiv.textContent = message + " (-" + bet + " XP)";
      }
      btn.disabled = false; betSelect.disabled = false;
    }, 2000);
  };
};

/* ============================================================
   5. ТЕСТ ДИАГНОСТА (Замена теста G-кода)
   ============================================================ */
window.renderGCodeTestPage = function() {
    var app = document.getElementById("app"); app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Тест диагноста";
    app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
    
    app.appendChild(el('<section class="hero"><h1>🛠️ Интерактивный тест</h1><p>Определите неисправность по описанию и выберите правильный метод устранения.</p></section>'));

    var block = el(`<div class="module">
        <h3 style="margin-top:0;">Ситуация:</h3>
        <p style="font-size:16px; background:var(--card-soft); padding:15px; border-radius:8px; border-left:4px solid var(--accent);">
            При работе токарного станка с ЧПУ появился повышенный шум в районе передней бабки. При измерении вибрации виброметром получено значение <b>6,5 мм/с</b> (норма ≤ 2,8 мм/с). Температура подшипников в норме.
        </p>
        
        <div style="display:flex; gap:10px; flex-direction:column; margin-top:20px;">
            <button class="btn ghost" onclick="window.checkDiagAnswer(0)">A) Заменить резец</button>
            <button class="btn ghost" onclick="window.checkDiagAnswer(1)">B) Проверить и заменить подшипники шпинделя</button>
            <button class="btn ghost" onclick="window.checkDiagAnswer(2)">C) Увеличить подачу СОЖ</button>
            <button class="btn ghost" onclick="window.checkDiagAnswer(3)">D) Продолжать работу, это нормально</button>
        </div>
        
        <div id="gcodeResult" style="margin-top:20px; font-weight:bold; font-size:18px;"></div>
    </div>`);
    app.appendChild(block);
};

window.checkDiagAnswer = function(idx) {
    var resDiv = document.getElementById("gcodeResult");
    if (idx === 1) {
        resDiv.innerHTML = "🎉 <span style='color:var(--ok)'>Отлично! Вибрация 6,5 мм/с при нормальной температуре — признак износа или дефекта подшипников качения. +50 XP</span>";
        if(window.addXP) window.addXP(50);
        if(window.addNotification) window.addNotification("Сдан тест диагноста", "ok");
    } else {
        resDiv.innerHTML = "❌ <span style='color:var(--err)'>Неверно. Шум и вибрация указывают на механическую проблему. Проверьте подшипники.</span>";
    }
};

/* ============================================================
   6. СМЕРТЕЛЬНАЯ ВЕЧЕРИНКА (ДИАГНОСТИКА)
   ============================================================ */
window.renderDeadlyPartyPage = function(){
  var app = document.getElementById("app"); app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Смертельная вечеринка";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  var allQuestions = [
    { q: "Что такое техническое диагностирование?", options: ["Ремонт оборудования", "Определение технического состояния", "Наладка станка", "Разборка узла"], correct: 1 },
    { q: "Какой метод основан на анализе вибрации?", options: ["Тепловой", "Виброакустический", "Электрический", "Лабораторный"], correct: 1 },
    { q: "Какой прибор применяют для контроля температуры узла?", options: ["Микрометр", "Пирометр", "Штангенциркуль", "Угломер"], correct: 1 },
    { q: "Норма виброскорости для шпинделя станка", options: ["≤0,1 мм/с", "≤2,8 мм/с", "≤10 мм/с", "≤20 мм/с"], correct: 1 },
    { q: "Что такое SCADA?", options: ["Станок с ЧПУ", "Система диспетчерского управления", "Измерительный прибор", "Тип резца"], correct: 1 },
    { q: "Сколько этапов в проверке общего состояния?", options: ["2", "3", "4", "5"], correct: 1 },
    { q: "Что проверяют у концевого выключателя?", options: ["Цвет", "Срабатывание", "Вес", "Стоимость"], correct: 1 },
    { q: "Какое диагностирование проводят по графику?", options: ["Заявочное", "Регламентное", "Аварийное", "Внеплановое"], correct: 1 },
    { q: "Норма температуры подшипников", options: ["40 °C", "60 °C", "80 °C", "100 °C"], correct: 1 },
    { q: "Что такое TPM?", options: ["Тип станка", "Всеобщее обслуживание оборудования", "Ремонтный документ", "Метод измерения"], correct: 1 },
    { q: "Какой ремонт включает полную разборку?", options: ["Текущий", "Капитальный", "Аварийный", "Средний"], correct: 1 },
    { q: "Что такое ППР?", options: ["Прибор проверки", "Планово-предупредительный ремонт", "Простой ремонт", "Прямой привод"], correct: 1 },
    { q: "Каким прибором измеряют биение шпинделя?", options: ["Микрометром", "Индикатором ИЧ-10", "Пирометром", "Манометром"], correct: 1 },
    { q: "Что проверяют индикатором?", options: ["Температуру", "Вибрацию", "Биение", "Давление"], correct: 2 },
    { q: "КИП — это", options: ["Инструмент", "Контрольно-измерительные приборы", "Оснастка", "Приспособление"], correct: 1 }
  ];

  var questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
  var currentQ = 0, lives = 3;

  function renderQ(){
    app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
    app.appendChild(el('<section class="module" style="background:#0a0c10;border:2px solid #1e5a8a;color:#fff; padding:20px; box-shadow: 0 0 20px rgba(30,90,138,0.5);"><div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:14px; color:#8fc4e6;"><span>Вопрос ' + (currentQ + 1) + ' / ' + questions.length + '</span><span>❤️ '.repeat(lives) + '🤍 '.repeat(3 - lives) + '</span></div><h2 style="margin:0 0 20px 0;color:#4a9cd4; font-size:20px; line-height:1.4;">' + escapeHtml(questions[currentQ].q) + '</h2><div id="qOptions"></div></section>'));
    var qo = document.getElementById("qOptions");
    questions[currentQ].options.forEach(function(opt, idx){
      var b = el('<button class="btn" style="width:100%;margin-bottom:8px;text-align:left;background:#131a26;border:1px solid #1e5a8a;color:#fff;font-size:14px; padding:12px;">' + escapeHtml(opt) + '</button>');
      b.onclick = function(){
        if (idx === questions[currentQ].correct) {
          currentQ++;
          if (currentQ >= questions.length) {
            app.innerHTML = ""; app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
            app.appendChild(el('<section class="module" style="text-align:center;background:#0a1a0a;border:2px solid #00ff00;color:#fff;padding:50px;"><h1 style="color:#00ff00;">Вы выжили!</h1><button class="btn" style="margin-top:20px;" onclick="if(window.addXP) window.addXP(100);location.hash=\'#/\'">+100 XP и на главную</button></section>'));
          } else renderQ();
        } else {
          lives--;
          if (lives <= 0) {
            app.innerHTML = ""; app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
            app.appendChild(el('<section class="module" style="text-align:center;background:#1a0a0a;border:2px solid #ff003c;color:#fff;padding:50px;"><h1 style="color:#ff003c;">Оборудование вышло из строя</h1><button class="btn" style="margin-top:20px;" onclick="window.renderDeadlyPartyPage()">Попробовать снова</button></section>'));
          } else {
             window.showToast("❌ Неверно! Осталось жизней: " + lives, "err");
          }
        }
      };
      qo.appendChild(b);
    });
  }
  renderQ();
};