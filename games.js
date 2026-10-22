"use strict";

window.saveScore = function(game, score) {
    var current = parseInt(localStorage.getItem('hs_' + game) || '0');
    if (score > current) {
        localStorage.setItem('hs_' + game, score);
        if(window.showToast) window.showToast("🏆 Новый рекорд!", "ok");
    }
};

window.renderArcadePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Игровая комната";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el('<section class="hero"><h1>🎮 Игровая комната</h1><p>Зарабатывай XP и развлекайся!</p></section>'));

    // Все игры доступны без привязки к МДК
    var allGames = [
        { id: "gcode", title: "📐 G-код Рисование", desc: "Пиши код и смотри траекторию инструмента." },
        { id: "diagnostics", title: "🔧 Диагностика станка", desc: "Найди неисправность по симптому." },
        { id: "minesweeper", title: "💣 Сапёр", desc: "Классическая логическая игра." },
        { id: "tictactoe", title: "❌ Крестики-нолики", desc: "Победи умного робота." },
        { id: "sudoku", title: "🔢 Судоку", desc: "Тренируй логику и внимание." },
        { id: "party", title: "☠️ Викторина", desc: "Ответь на вопросы, пока не кончились жизни." },
        { id: "casino", title: "🎰 Казино", desc: "Испытай удачу на слотах." },
        { id: "spider", title: "🕷️ Солитёр Паук", desc: "Собирайте масти от Короля до Туза." }
    ];

    var grid = el('<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px;"></div>');
    
    allGames.forEach(g => {
        var best = localStorage.getItem('hs_' + g.id) || 0;
        var bestTxt = best > 0 ? `<div style="color:var(--gold); font-size:13px; font-weight:bold; margin-top:10px;">⭐ Рекорд: ${best}</div>` : '';
        
        grid.appendChild(el(`<div class="module" style="cursor:pointer; transition:0.2s; display:flex; flex-direction:column; justify-content:space-between;" onclick="window.startGame('${g.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
            <div>
                <h3 style="margin-top:0; color:var(--accent);">${g.title}</h3>
                <p style="color:var(--muted); font-size:14px;">${g.desc}</p>
                ${bestTxt}
            </div>
            <button class="btn ghost" style="width:100%; margin-top:15px;">Играть</button>
        </div>`));
    });
    app.appendChild(grid);
};

window.startGame = function(gameId) {
    var app = document.getElementById("app"); app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="javascript:void(0)" onclick="window.renderArcadePage()" style="color:var(--accent); cursor:pointer;">← В меню игр</a>'));

    var rules = {
        gcode: "Вводите команды (например: G01 X50 Y50). G00 — холостой ход (пунктир), G01 — рабочий ход (линия).",
        diagnostics: "Выберите наиболее вероятную причину поломки из предложенных вариантов.",
        minesweeper: "Клик открывает клетку. Долгое нажатие (или правая кнопка) ставит флажок.",
        tictactoe: "Соберите линию из N символов раньше робота.",
        sudoku: "Заполните поле цифрами от 1 до N без повторений в строках и столбцах.",
        party: "У вас 15 секунд на ответ. Ошибка отнимает жизнь.",
        casino: "Сделайте ставку и крутите слоты.",
        spider: "Кликните по карте, чтобы взять её, и по колонке, чтобы положить. Собирайте от Короля до Туза."
    };

    app.appendChild(el(`<details style="margin-bottom:15px; background:var(--card-soft); padding:12px; border-radius:8px; border:1px solid var(--border);">
        <summary style="cursor:pointer; font-weight:bold; color:var(--accent);">❓ Как играть</summary>
        <p style="margin-top:10px; font-size:14px; color:var(--muted); line-height:1.4;">${rules[gameId]}</p>
    </details>`));

    var container = el('<div class="module" id="gameContainer" style="min-height:400px;"></div>');
    app.appendChild(container);

    if (gameId === 'gcode') startGcode(container);
    else if (gameId === 'diagnostics') startDiagnostics(container);
    else if (gameId === 'minesweeper') startMinesweeper(container);
    else if (gameId === 'tictactoe') startTicTacToe(container);
    else if (gameId === 'sudoku') startSudoku(container);
    else if (gameId === 'casino') startCasino(container);
    else if (gameId === 'party') startParty(container);
    else if (gameId === 'spider') startSpider(container);
};

// --- 1. G-КОД РИСОВАНИЕ ---
function startGcode(container) {
    container.innerHTML = `<div style="text-align:center;">
        <h3>📐 G-код Рисование</h3>
        <p style="font-size:14px; color:var(--muted); margin-bottom:10px;">Центр — это (0,0). Вводите: G01 X50 Y50</p>
        <div style="overflow-x:auto;">
            <canvas id="gcodeCanvas" width="300" height="300" class="gcode-canvas" style="max-width:100%;"></canvas>
        </div>
        <div style="margin-top:15px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <input type="text" id="gcodeInput" class="self-input" placeholder="G01 X50 Y-50" style="max-width:200px; margin:0;">
            <button class="btn" onclick="window._execGcode()">Выполнить</button>
            <button class="btn ghost" onclick="window.startGame('gcode')">Сброс</button>
        </div>
        <div id="gcodeLog" style="margin-top:10px; font-size:12px; color:var(--err); height:20px;"></div>
    </div>`;

    var canvas = document.getElementById("gcodeCanvas");
    var ctx = canvas.getContext("2d");
    var currentX = 150, currentY = 150;

    function drawGrid() {
        ctx.clearRect(0,0,300,300);
        ctx.strokeStyle = "var(--border)"; ctx.lineWidth = 1;
        for (var i = 0; i <= 300; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 300); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(300, i); ctx.stroke();
        }
        ctx.strokeStyle = "var(--muted)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(150, 300); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(300, 150); ctx.stroke();
        
        // Отрисовка текущей позиции
        ctx.fillStyle = "var(--accent)";
        ctx.beginPath(); ctx.arc(currentX, currentY, 4, 0, Math.PI * 2); ctx.fill();
    }
    drawGrid();

    window._execGcode = function() {
        var input = document.getElementById("gcodeInput").value.toUpperCase().trim();
        var log = document.getElementById("gcodeLog");
        log.textContent = "";

        if (!input) return;

        var match = input.match(/^(G0[0-3])\s*(?:X(-?\d+(?:\.\d+)?))?\s*(?:Y(-?\d+(?:\.\d+)?))?/);
        if (!match) { log.textContent = "Ошибка. Пример: G01 X50 Y50"; return; }

        var cmd = match[1];
        var targetX = match[2] !== undefined ? parseFloat(match[2]) : null;
        var targetY = match[3] !== undefined ? parseFloat(match[3]) : null;

        var newX = targetX !== null ? 150 + targetX : currentX;
        var newY = targetY !== null ? 150 - targetY : currentY;

        if (cmd === "G00") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.setLineDash([5, 5]); // Пунктир для быстрого хода
        } else if (cmd === "G01") {
            ctx.strokeStyle = "var(--accent)";
            ctx.setLineDash([]);
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        currentX = newX;
        currentY = newY;
        drawGrid();
        document.getElementById("gcodeInput").value = "";
    };
}

// --- 2. ДИАГНОСТИКА СТАНКА ---
function startDiagnostics(container) {
    var scenarios = [
        { symptom: "Станок не включается, панель не светится.", options: ["Перегорел предохранитель/нет питания", "Сломалась фреза", "Кончилась СОЖ", "Неправильный G-код"], correct: 0 },
        { symptom: "При обработке слышен сильный скрежет и вибрация.", options: ["Неправильно подобран режим резания", "Нет электричества", "Сломалась кнопка СТОП", "Забыли включить свет"], correct: 0 },
        { symptom: "Станок выдает ошибку 'Нет готовности шпинделя'.", options: ["Не закрыта дверь ограждения", "Сломалась револьверная головка", "Закончился диск", "Нет интернета"], correct: 0 },
        { symptom: "Размер детали не совпадает с чертежом на 2 мм.", options: ["Неверно задана коррекция инструмента", "Перегрелся двигатель", "Забыли нажать кнопку Пуск", "Станок завис"], correct: 0 },
        { symptom: "Из гидростанции идет течь масла.", options: ["Износился сальник/уплотнение", "Перепутаны фазы", "Сбилась программа", "Забыли поставить заготовку"], correct: 0 }
    ];

    var current = 0;
    var score = 0;

    function render() {
        if (current >= scenarios.length) {
            container.innerHTML = `<div style="text-align:center; padding:20px;">
                <h3 style="color:var(--ok);">Диагностика завершена!</h3>
                <p>Правильных ответов: ${score} из ${scenarios.length}</p>
                <button class="btn" onclick="window.startGame('diagnostics')">Пройти заново</button>
            </div>`;
            if (score === scenarios.length) { if(window.addXP) window.addXP(100); window.saveScore('diagnostics', 100); }
            return;
        }

        var s = scenarios[current];
        var html = `<div style="text-align:center; margin-bottom:20px;">
            <h3>🔧 Ситуация ${current+1}/${scenarios.length}</h3>
            <div style="background:var(--err); color:#fff; padding:15px; border-radius:8px; font-weight:bold; margin-bottom:20px;">
                ⚠️ ${s.symptom}
            </div>
            <p>Выберите наиболее вероятную причину:</p>
            <div style="display:flex; flex-direction:column; gap:10px; max-width:400px; margin:0 auto;">`;

        s.options.forEach((opt, i) => {
            html += `<button class="btn ghost" onclick="window._diagAns(${i}, ${s.correct})" style="text-align:left; padding:12px;">${opt}</button>`;
        });
        html += `</div></div>`;
        container.innerHTML = html;
    }

    window._diagAns = function(selected, correct) {
        if (selected === correct) {
            window.showToast("✅ Верно! Причина найдена.", "ok");
            score++;
            current++;
            setTimeout(render, 800);
        } else {
            window.showToast("❌ Неверно. Подумайте еще.", "err");
        }
    };
    render();
}

// --- 3. САПЁР (Адаптирован под тач) ---
function startMinesweeper(container) {
    var SIZE = 8, MINES = 10, flags = 0, revealed = 0, gameOver = false;
    var grid = [], cells = [];

    function init() {
        grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
        cells = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
        flags = 0; revealed = 0; gameOver = false;

        var placed = 0;
        while (placed < MINES) {
            var r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
            if (grid[r][c] !== 'M') { grid[r][c] = 'M'; placed++; }
        }
        for (var r = 0; r < SIZE; r++) {
            for (var c = 0; c < SIZE; c++) {
                if (grid[r][c] !== 'M') {
                    var mines = 0;
                    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
                        var nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] === 'M') mines++;
                    }
                    grid[r][c] = mines;
                }
            }
        }
        render();
    }

    function reveal(r, c) {
        if (gameOver || cells[r][c] || grid[r][c] === 'F') return;
        cells[r][c] = true; revealed++;
        if (grid[r][c] === 'M') { gameOver = true; return; }
        if (grid[r][c] === 0) {
            for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
                var nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) reveal(nr, nc);
            }
        }
    }

    function render() {
        container.innerHTML = `<div style="text-align:center; margin-bottom:15px;">
            <div style="font-weight:bold; color:var(--accent); margin-bottom:10px;">Мин: ${MINES - flags} | Открыто: ${revealed}/${SIZE*SIZE-MINES}</div>
            <p style="font-size:12px; color:var(--muted);">Нажмите, чтобы открыть. Долгое нажатие — флажок.</p>
        </div>`;
        
        var gridEl = document.createElement("div"); 
        gridEl.style = `display:grid; grid-template-columns:repeat(${SIZE},1fr); gap:2px; max-width:300px; margin:0 auto;`;
        
        for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
            var btn = document.createElement("button");
            btn.style = `aspect-ratio:1; font-weight:bold; font-size:16px; border-radius:4px; border:1px solid var(--border); cursor:pointer; padding:0;`;
            if (cells[r][c]) {
                btn.style.background = "var(--card-soft)";
                if (grid[r][c] === 'M') { btn.textContent = "💥"; btn.style.background = "var(--err)"; }
                else { btn.textContent = grid[r][c] || ""; btn.style.color = "var(--accent)"; }
            } else {
                btn.style.background = "var(--card)";
                if (grid[r][c] === 'F') btn.textContent = "🚩";
            }
            
            var touchTimer = null;
            var isLongPress = false;

            btn.oncontextmenu = function(e) { e.preventDefault(); toggleFlag(r,c); };
            
            btn.ontouchstart = function(e) {
                isLongPress = false;
                touchTimer = setTimeout(function() { isLongPress = true; toggleFlag(r,c); }, 500);
            };
            btn.ontouchend = function(e) {
                clearTimeout(touchTimer);
                if (!isLongPress) {
                    if (gameOver) return;
                    reveal(r, c); 
                    if(gameOver) showWin(); else render();
                }
            };
            btn.onclick = function(e) {
                // Для десктопа (если touchend не сработал)
                if (e.pointerType === 'mouse') {
                    if (gameOver) return;
                    reveal(r, c); 
                    if(gameOver) showWin(); else render();
                }
            };
            gridEl.appendChild(btn);
        }
        container.appendChild(gridEl);
    }

    function toggleFlag(r,c) {
        if (gameOver || cells[r][c]) return;
        if (grid[r][c] === 'F') { grid[r][c] = 0; flags--; }
        else { grid[r][c] = 'F'; flags++; }
        render();
    }

    function showWin() {
        setTimeout(() => {
            if (confirm("💥 БУМ! Вы подорвались. Начать заново?")) startMinesweeper(container);
            else window.renderArcadePage();
        }, 100);
    }
    init();
}

// --- 4. КРЕСТИКИ-НОЛИКИ ---
function startTicTacToe(container) {
    container.innerHTML = `<div style="text-align:center;">
        <h3>Выберите размер поля:</h3>
        <button class="btn" onclick="window._initTTT(3)">3x3</button>
        <div id="tttBoard" style="margin-top:20px; display:flex; justify-content:center;"></div>
    </div>`;
    
    window._initTTT = function(size) {
        var board = Array(size*size).fill(null); var gameOver = false;
        var boardEl = document.getElementById("tttBoard");
        boardEl.style = `display:grid; grid-template-columns:repeat(${size},50px); gap:5px; justify-content:center;`;

        function checkWin() {
            var winLength = 3;
            for (var r = 0; r < size; r++) for (var c = 0; c <= size - winLength; c++) {
                var first = board[r*size+c]; if (!first) continue;
                var win = true; for (var i = 1; i < winLength; i++) if (board[r*size+c+i] !== first) { win = false; break; }
                if (win) return first;
            }
            for (var c = 0; c < size; c++) for (var r = 0; r <= size - winLength; r++) {
                var first = board[r*size+c]; if (!first) continue;
                var win = true; for (var i = 1; i < winLength; i++) if (board[(r+i)*size+c] !== first) { win = false; break; }
                if (win) return first;
            }
            for (var r = 0; r <= size - winLength; r++) for (var c = 0; c <= size - winLength; c++) {
                var first = board[r*size+c]; if (!first) continue;
                var win = true; for (var i = 1; i < winLength; i++) if (board[(r+i)*size+c+i] !== first) { win = false; break; }
                if (win) return first;
            }
            return board.includes(null) ? null : "draw";
        }

        function render() {
            boardEl.innerHTML = "";
            board.forEach((val, i) => {
                var btn = document.createElement("button");
                btn.className = "btn ghost"; btn.style = "width:50px; height:50px; font-size:24px; font-weight:bold;";
                btn.textContent = val || "";
                btn.onclick = () => {
                    if (board[i] || gameOver) return;
                    board[i] = "❌"; render();
                    var w = checkWin(); if (w) return end(w);
                    var empty = board.map((v, idx) => v === null ? idx : null).filter(v => v !== null);
                    if (empty.length) {
                        var move = empty[Math.floor(Math.random() * empty.length)];
                        board[move] = "⭕"; render();
                        w = checkWin(); if (w) return end(w);
                    }
                };
                boardEl.appendChild(btn);
            });
        }

        function end(w) {
            gameOver = true;
            if (w === "draw") alert("Ничья!");
            else if (w === "❌") { alert("Вы победили! +50 XP"); if(window.addXP) window.addXP(50); window.saveScore('tictactoe', 50); }
            else alert("Победил робот!");
            setTimeout(() => window._initTTT(size), 1000);
        }
        render();
    };
    window._initTTT(3);
}

// --- 5. СУДОКУ (Упрощенный) ---
function startSudoku(container) {
    container.innerHTML = `<div style="text-align:center;">
        <h3>Судоку 4x4</h3>
        <p style="font-size:14px; margin-bottom:10px;">Заполните пустые клетки цифрами 1-4.</p>
        <div id="sudokuGrid" style="display:grid; grid-template-columns:repeat(4, 40px); gap:2px; justify-content:center; margin:0 auto;"></div>
    </div>`;
    var solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
    var puzzle = [[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]];
    var gridEl = document.getElementById("sudokuGrid");
    
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
        var input = document.createElement("input");
        input.type = "number"; input.min = 1; input.max = 4;
        input.value = puzzle[r][c] || "";
        input.style = `width:40px; height:40px; text-align:center; font-size:18px; font-weight:bold; border:1px solid var(--border); background:${puzzle[r][c] ? 'var(--accent-soft)' : 'var(--card)'}; color:var(--text); border-radius:4px;`;
        if (puzzle[r][c]) input.disabled = true;
        input.oninput = function(e) {
            var v = parseInt(e.target.value);
            if (v < 1 || v > 4) e.target.value = "";
        };
        gridEl.appendChild(input);
    }
}

// --- 6. КАЗИНО ---
function startCasino(container) {
    container.innerHTML = `<div style="text-align:center;">
        <h3>🎰 Слоты</h3>
        <div style="display:flex; justify-content:center; gap:10px; margin:20px 0;">
            <div id="reel1" class="reel" style="font-size:40px; width:60px; height:80px; border:2px solid var(--border); border-radius:8px; display:flex; align-items:center; justify-content:center; background:var(--card-soft);">❓</div>
            <div id="reel2" class="reel" style="font-size:40px; width:60px; height:80px; border:2px solid var(--border); border-radius:8px; display:flex; align-items:center; justify-content:center; background:var(--card-soft);">❓</div>
            <div id="reel3" class="reel" style="font-size:40px; width:60px; height:80px; border:2px solid var(--border); border-radius:8px; display:flex; align-items:center; justify-content:center; background:var(--card-soft);">❓</div>
        </div>
        <button class="btn" id="spinBtn" style="width:100%; padding:15px; background:var(--gold); color:#000;">КРУТИТЬ (50 XP)</button>
        <div id="casinoResult" style="margin-top:15px; font-weight:bold; font-size:20px;"></div>
    </div>`;

    document.getElementById("spinBtn").onclick = function() {
        if (!window.state.staff && window.state.xp < 50) return window.showToast("Мало XP", "err");
        if (!window.state.staff) window.addXP(-50);
        this.disabled = true;
        var symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
        var r1 = document.getElementById("reel1"), r2 = document.getElementById("reel2"), r3 = document.getElementById("reel3");
        
        var spin = setInterval(() => {
            r1.textContent = symbols[Math.floor(Math.random()*symbols.length)];
            r2.textContent = symbols[Math.floor(Math.random()*symbols.length)];
            r3.textContent = symbols[Math.floor(Math.random()*symbols.length)];
        }, 50);

        setTimeout(() => {
            clearInterval(spin);
            this.disabled = false;
            var s1 = symbols[Math.floor(Math.random()*symbols.length)], s2 = symbols[Math.floor(Math.random()*symbols.length)], s3 = symbols[Math.floor(Math.random()*symbols.length)];
            if (Math.random() < 0.15) s2 = s1; 
            if (Math.random() < 0.1) s3 = s2;
            r1.textContent = s1; r2.textContent = s2; r3.textContent = s3;
            
            var win = 0; var resEl = document.getElementById("casinoResult");
            if (s1 === s2 && s2 === s3) { win = 250; resEl.textContent = "🎉 ДЖЕКПОТ! +250"; resEl.style.color = "var(--ok)"; window.saveScore('casino', win); }
            else if (s1 === s2 || s2 === s3 || s1 === s3) { win = 100; resEl.textContent = "✨ Выигрыш! +100"; resEl.style.color = "var(--ok)"; }
            else { resEl.textContent = "💸 Проигрыш..."; resEl.style.color = "var(--err)"; }
            if (win > 0 && !window.state.staff) window.addXP(win);
        }, 1500);
    };
}

// --- 7. ВИКТОРИНА ---
function startParty(container) {
    if (!window._Q) { container.innerHTML = "Нет вопросов!"; return; }
    var allQ = [].concat(_Q.mdk, _Q.anime, _Q.games, _Q.logic);
    var pool = _shuffle(allQ);
    var lives = 3, score = 0;
    
    function nextQ() {
        if (lives <= 0) {
            container.innerHTML = `<div style="text-align:center;padding:30px;">
                <h2 style="color:var(--err);">💀 Вы проиграли</h2>
                <p>Счет: ${score}</p>
                <button class="btn" onclick="window.startGame('party')">Реванш</button></div>`;
            return;
        }
        if (pool.length === 0) pool = _shuffle(allQ);
        var q = pool.pop();
        var correctText = q[1].split("|")[q[2]];
        var opts = _shuffle(q[1].split("|"));
        var correctIdx = opts.indexOf(correctText);

        container.innerHTML = `<div style="text-align:center;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:bold; color:var(--err);">
                <span>${'❤️'.repeat(lives)}</span>
                <span>Счет: ${score}</span>
            </div>
            <h3 style="margin-bottom:20px;">${q[0]}</h3>
            <div id="partyOpts" style="display:flex; flex-direction:column; gap:10px; max-width:400px; margin:0 auto;">
                ${opts.map((opt, i) => `<button class="btn ghost" style="padding:12px;" onclick="window._partyAns(this, ${i}, ${correctIdx})">${opt}</button>`).join('')}
            </div>
        </div>`;
    }

    window._partyAns = function(btn, selected, correct) {
        var btns = document.querySelectorAll("#partyOpts button");
        btns.forEach(b => { b.disabled = true; b.style.opacity = 0.6; });
        btn.style.opacity = 1;
        btn.style.borderColor = (selected === correct) ? "var(--ok)" : "var(--err)";

        if (selected === correct) { 
            score++; 
            window.showToast("✅ Верно!", "ok"); 
        } else { 
            lives--; 
            window.showToast("❌ Ошибка!", "err"); 
            btns.forEach(b => {
                if (b.getAttribute("onclick").includes(` ${correct})`)) {
                    b.style.borderColor = "var(--ok)";
                }
            });
        }
        setTimeout(nextQ, 1200);
    };
    nextQ();
}

// --- 8. ПАУК (Упрощенный) ---
function startSpider(container) {
    container.innerHTML = `<div style="text-align:center; padding:20px;">
        <h3>🕷️ Солитёр Паук</h3>
        <p style="color:var(--muted);">Игра находится в разработке (требует много кода).</p>
        <button class="btn" onclick="window.renderArcadePage()">Назад</button>
    </div>`;
}