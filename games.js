"use strict";

// ==========================================
// 1. ГЛАВНАЯ СТРАНИЦА ИГР
// ==========================================
window.saveScore = function(game, score) {
    var current = parseInt(localStorage.getItem('hs_' + game) || '0');
    if (score > current) {
        localStorage.setItem('hs_' + game, score);
        if(window.showToast) window.showToast("🏆 Новый рекорд!", "ok");
    }
};

window.renderArcadePage = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Игровая комната";
    
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el('<section class="hero"><h1>🎮 Игровая комната</h1><p>Зарабатывай XP и развлекайся!</p></section>'));

    var allGames = [
        { id: "quiz_mdk", title: "⚙️ Викторина: ЧПУ", desc: "Вопросы по МДК 07.01." },
        { id: "quiz_anime", title: "🍥 Викторина: Аниме", desc: "Проверь свои знания аниме!" },
        { id: "quiz_games", title: "🕹️ Викторина: Игры", desc: "Для настоящих геймеров." },
        { id: "quiz_logic", title: "🧠 Викторина: Логика", desc: "Математика и загадки." },
        { id: "minesweeper", title: "💣 Сапёр", desc: "Классическая логическая игра." },
        { id: "memory", title: "🧠 Найди пару", desc: "Тренируй зрительную память." },
        { id: "tictactoe", title: "❌ Крестики-нолики", desc: "Сыграй против робота." },
        { id: "gcode", title: "📐 G-код Рисование", desc: "Изучи команды ЧПУ." },
        { id: "snake", title: "🐍 Cursor Snake", desc: "Управляйте змейкой курсором мыши." },
        { id: "pumpkin", title: "🎃 Carve Pumpkin", desc: "Вырежи лицо на тыкве." },
        { id: "slime", title: "🟢 Желейный слайм", desc: "Интерактивный слайм." },
        { id: "dragon", title: "🐉 Пиксельный дракон", desc: "Анимация дракона." },
        { id: "starfield", title: "✨ Звездный дождь", desc: "Космическая анимация." }
    ];

    var grid = el('<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px;"></div>');
    
    allGames.forEach(g => {
        var best = localStorage.getItem('hs_' + g.id) || 0;
        var bestTxt = best > 0 ? `<div style="color:var(--gold); font-size:13px; font-weight:bold; margin-top:10px;">⭐ Рекорд: ${best}</div>` : '';
        
        grid.appendChild(el(`<div class="module" style="cursor:pointer; transition:0.2s; display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;" onclick="window.startGame('${g.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
            <div>
                <h3 style="margin-top:0; color:var(--accent);">${g.title}</h3>
                <p style="color:var(--muted); font-size:14px;">${g.desc}</p>
                ${bestTxt}
            </div>
            <button class="btn ghost" style="width:100%; margin-top:15px;">Запустить</button>
        </div>`));
    });
    app.appendChild(grid);
};

// ==========================================
// 2. РОУТЕР ИГР
// ==========================================
window.startGame = function(gameId) {
    var app = document.getElementById("app"); 
    if (!app) return;
    app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="javascript:void(0)" onclick="window.renderArcadePage()" style="color:var(--accent); cursor:pointer;">← В меню игр</a>'));

    if (window.unlockAchievement) window.unlockAchievement('gamer');

    var container = el('<div class="module" id="gameContainer" style="min-height:400px; padding:0; overflow-x:auto; overflow-y:hidden; position:relative; display:flex; flex-direction:column; align-items:center;"></div>');
    app.appendChild(container);

    // Внешние HTML игры (лежат в корне)
    var iframeGames = { 
        snake: 'snake.html', 
        pumpkin: 'carve_pumpkin.html', 
        slime: 'jelly_slime.html', 
        dragon: 'pixel_dragon.html' 
    };

    if (iframeGames[gameId]) {
        container.innerHTML = `<iframe src="./${iframeGames[gameId]}" style="width:100%; height:80vh; border:none; display:block; border-radius:8px;"></iframe>`;
    } 
    else if (gameId.startsWith("quiz_")) {
        var qType = gameId.replace("quiz_", "");
        startQuiz(container, qType);
    }
    else if (gameId === 'gcode') { startGcode(container); }
    else if (gameId === 'minesweeper') { startMinesweeper(container); }
    else if (gameId === 'tictactoe') { startTicTacToe(container); }
    else if (gameId === 'memory') { startMemory(container); }
    else if (gameId === 'starfield') { startStarfield(container); }
};

// ==========================================
// 3. ИГРА: ВИКТОРИНА (QUIZ)
// ==========================================
function startQuiz(container, type) {
    var questionsPool = (window._Q && window._Q[type]) ? window._Q[type] : [];
    if (questionsPool.length === 0) {
        container.innerHTML = '<div style="padding:20px;">Вопросы для этой викторины не найдены (проверьте файлы questions-*.js).</div>';
        return;
    }
    
    // Перемешиваем и берем 10 вопросов
    var questions = questionsPool.sort(() => Math.random() - 0.5).slice(0, 10);
    var idx = 0, score = 0;

    function renderQ() {
        if (idx >= questions.length) {
            var xpEarned = score * 10;
            container.innerHTML = `<div style="padding:40px; text-align:center; width:100%;">
                <h2 style="color:var(--ok);">Викторина завершена!</h2>
                <p style="font-size:20px;">Ваш результат: <b>${score}</b> из ${questions.length}</p>
                <p style="color:var(--gold); font-weight:bold; margin-top:10px;">Получено: +${xpEarned} XP</p>
                <button class="btn" onclick="window.renderArcadePage()" style="margin-top:20px;">В меню игр</button>
            </div>`;
            
            if (window.state) {
                window.state.xp += xpEarned;
                if (window.saveStudentData) window.saveStudentData();
                if (window.renderUserChip) window.renderUserChip();
            }
            window.saveScore('quiz_' + type, score);
            return;
        }

        var q = questions[idx];
        // Перемешиваем варианты ответа
        var opts = q[1].split('|').map((text, i) => ({ text: text, isCorrect: (i === q[2]) }));
        opts = opts.sort(() => Math.random() - 0.5);

        var html = `<div style="padding:30px; width:100%; max-width:600px;">
            <div style="font-size:14px; color:var(--muted); margin-bottom:10px;">Вопрос ${idx+1} из ${questions.length}</div>
            <h3 style="margin-top:0; margin-bottom:20px; font-size:20px;">${q[0]}</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
                ${opts.map(o => `<button class="btn ghost" style="text-align:left; padding:15px; font-size:16px;" onclick="window.quizAnswer(this, ${o.isCorrect})">${o.text}</button>`).join('')}
            </div>
        </div>`;
        container.innerHTML = html;

        window.quizAnswer = function(btn, isCorrect) {
            // Блокируем кнопки
            container.querySelectorAll('button').forEach(b => b.disabled = true);
            
            if (isCorrect) {
                score++;
                btn.style.borderColor = 'var(--ok)';
                btn.style.background = 'rgba(16, 185, 129, 0.2)';
            } else {
                btn.style.borderColor = 'var(--err)';
                btn.style.background = 'rgba(239, 68, 68, 0.2)';
            }
            
            setTimeout(() => { idx++; renderQ(); }, 1000);
        };
    }
    renderQ();
}

// ==========================================
// 4. ИГРА: САПЁР (MINESWEEPER)
// ==========================================
function startMinesweeper(container) {
    var ROWS = 10, COLS = 10, MINES = 15;
    var board = [], gameOver = false, flags = 0, revealed = 0;
    
    function init() {
        board = []; gameOver = false; flags = 0; revealed = 0;
        for (var r = 0; r < ROWS; r++) {
            board[r] = [];
            for (var c = 0; c < COLS; c++) {
                board[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
            }
        }
        var placed = 0;
        while (placed < MINES) {
            var r = Math.floor(Math.random() * ROWS);
            var c = Math.floor(Math.random() * COLS);
            if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
        }
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                if (board[r][c].mine) continue;
                var cnt = 0;
                for (var dr = -1; dr <= 1; dr++) {
                    for (var dc = -1; dc <= 1; dc++) {
                        if (r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS && board[r+dr][c+dc].mine) cnt++;
                    }
                }
                board[r][c].count = cnt;
            }
        }
    }

    function render() {
        var html = `<div style="padding:20px; text-align:center;">
            <h3>💣 Сапёр</h3>
            <div style="margin-bottom:15px; font-size:18px;">Флаги: <span style="color:var(--err);">${flags}</span>/${MINES}</div>
            <div style="display:inline-grid; grid-template-columns:repeat(${COLS}, 32px); gap:2px; background:var(--border); padding:5px; border-radius:8px;">`;
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                var cell = board[r][c], color = "var(--card-soft)", text = "";
                if (cell.revealed) {
                    color = "var(--card)";
                    if (cell.mine) { text = "💥"; color = "var(--err)"; }
                    else { text = cell.count > 0 ? cell.count : ""; }
                } else if (cell.flagged) {
                    text = "🚩";
                }
                var colorStyle = cell.count === 1 ? 'blue' : (cell.count === 2 ? 'green' : (cell.count === 3 ? 'red' : 'purple'));
                var textStyle = (cell.revealed && cell.count > 0 && !cell.mine) ? `color:${colorStyle}; font-weight:bold;` : '';
                
                html += `<div onclick="window.msClick(${r},${c})" oncontextmenu="window.msFlag(event,${r},${c})" style="width:32px; height:32px; background:${color}; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:4px; font-size:16px; ${textStyle}">${text}</div>`;
            }
        }
        html += `</div><div style="margin-top:15px;"><button class="btn" onclick="window.msRestart()">Заново</button></div></div>`;
        container.innerHTML = html;
    }

    function reveal(r, c) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
        var cell = board[r][c];
        if (cell.revealed || cell.flagged) return;
        cell.revealed = true; revealed++;
        if (cell.mine) { gameOver = true; return; }
        if (cell.count === 0) {
            for (var dr = -1; dr <= 1; dr++) {
                for (var dc = -1; dc <= 1; dc++) reveal(r+dr, c+dc);
            }
        }
    }

    window.msClick = function(r, c) {
        if (gameOver || board[r][c].flagged) return;
        reveal(r, c);
        if (gameOver) { 
            for (var i=0;i<ROWS;i++) for(var j=0;j<COLS;j++) board[i][j].revealed = true;
            render(); 
            setTimeout(()=>alert("💥 Вы подорвались! Игра окончена."), 100); 
            return; 
        }
        if (revealed === ROWS * COLS - MINES) {
            render(); 
            setTimeout(()=>alert("🏆 Победа! Вы обезвредили все мины!"), 100);
            if (window.state) { window.state.xp += 50; window.saveStudentData(); window.renderUserChip(); }
            return;
        }
        render();
    };

    window.msFlag = function(e, r, c) {
        e.preventDefault();
        if (gameOver || board[r][c].revealed) return;
        board[r][c].flagged = !board[r][c].flagged;
        flags += board[r][c].flagged ? 1 : -1;
        render();
    };

    window.msRestart = function() { init(); render(); };
    init(); render();
}

// ==========================================
// 5. ИГРА: ПАМЯТЬ (MEMORY)
// ==========================================
function startMemory(container) {
    var emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
    var cards = [], flipped = [], matched = 0, lock = false;

    function init() {
        cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
        flipped = []; matched = 0; lock = false;
        render();
    }

    function render() {
        var html = `<div style="padding:20px; text-align:center;">
            <h3>🧠 Найди пару</h3>
            <div style="margin-bottom:15px; font-size:18px;">Совпадений: ${matched}/8</div>
            <div style="display:inline-grid; grid-template-columns:repeat(4, 70px); gap:10px;">`;
        cards.forEach((c, i) => {
            var isFlipped = flipped.includes(i) || c === 'done';
            html += `<div onclick="window.memClick(${i})" style="width:70px; height:70px; background:${isFlipped ? 'var(--card)' : 'var(--accent)'}; display:flex; align-items:center; justify-content:center; font-size:32px; cursor:pointer; border-radius:8px; transition:0.3s; transform:${isFlipped ? 'rotateY(0)' : 'rotateY(180deg)'};">${isFlipped ? (c === 'done' ? '✅' : c) : ''}</div>`;
        });
        html += `</div><div style="margin-top:20px;"><button class="btn" onclick="window.memRestart()">Заново</button></div></div>`;
        container.innerHTML = html;
    }

    window.memClick = function(i) {
        if (lock || flipped.includes(i) || cards[i] === 'done') return;
        flipped.push(i); render();
        if (flipped.length === 2) {
            lock = true;
            if (cards[flipped[0]] === cards[flipped[1]]) {
                cards[flipped[0]] = 'done'; cards[flipped[1]] = 'done';
                matched++; flipped = []; lock = false; render();
                if (matched === 8) { 
                    setTimeout(()=>alert("🏆 Вы нашли все пары!"), 100); 
                    if (window.state) { window.state.xp += 50; window.saveStudentData(); window.renderUserChip(); }
                }
            } else {
                setTimeout(() => { flipped = []; lock = false; render(); }, 800);
            }
        }
    };
    window.memRestart = function() { init(); };
    init();
}

// ==========================================
// 6. ИГРА: КРЕСТИКИ-НОЛИКИ
// ==========================================
function startTicTacToe(container) {
    var board = Array(9).fill(null), turn = "X", gameOver = false;
    
    function render() {
        var html = `<div style="padding:20px; text-align:center;">
            <h3>❌ Крестики-нолики</h3>
            <div style="margin-bottom:15px; font-size:18px;">${gameOver ? 'Игра окончена' : 'Ваш ход (X)'}</div>
            <div style="display:inline-grid; grid-template-columns:repeat(3, 80px); gap:5px; background:var(--border); padding:5px; border-radius:8px;">`;
        for (var i = 0; i < 9; i++) {
            html += `<div onclick="window.tttClick(${i})" style="width:80px; height:80px; background:var(--card-soft); display:flex; align-items:center; justify-content:center; font-size:40px; cursor:pointer; font-weight:bold; color:${board[i] === 'X' ? 'var(--accent)' : 'var(--gold)'};">${board[i] || ''}</div>`;
        }
        html += `</div><div style="margin-top:15px;"><button class="btn" onclick="window.tttRestart()">Заново</button></div></div>`;
        container.innerHTML = html;
    }

    function checkWin() {
        var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (var i = 0; i < lines.length; i++) {
            var a = lines[i][0], b = lines[i][1], c = lines[i][2];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return board.includes(null) ? null : "Tie";
    }

    window.tttClick = function(i) {
        if (gameOver || board[i] || turn !== "X") return;
        board[i] = "X"; turn = "O"; render();
        
        var win = checkWin();
        if (win) { 
            gameOver = true; render(); 
            setTimeout(()=>alert(win === "Tie" ? "Ничья!" : "Вы победили!"), 100); 
            if (win === "X" && window.state) { window.state.xp += 20; window.saveStudentData(); window.renderUserChip(); }
            return; 
        }
        
        // AI (Робот)
        setTimeout(function() {
            var empty = []; for (var j = 0; j < 9; j++) if (!board[j]) empty.push(j);
            if (empty.length > 0) {
                board[empty[Math.floor(Math.random() * empty.length)]] = "O";
                turn = "X"; render();
                var win2 = checkWin();
                if (win2) { 
                    gameOver = true; render(); 
                    setTimeout(()=>alert(win2 === "Tie" ? "Ничья!" : "Робот победил!"), 100); 
                }
            }
        }, 300);
    };

    window.tttRestart = function() { board = Array(9).fill(null); turn = "X"; gameOver = false; render(); };
    render();
}

// ==========================================
// 7. ИГРА: G-КОД РИСОВАНИЕ
// ==========================================
function startGcode(container) {
    container.innerHTML = `<div style="padding: 20px; width:100%; max-width:600px;">
        <h3 style="margin-top:0; text-align:center;">📐 G-код Рисование</h3>
        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <input type="text" id="gcodeInput" class="self-input" style="margin:0; flex:1;" placeholder="Например: G01 X50 Y50">
            <button class="btn" onclick="window.runGcode()">Выполнить</button>
        </div>
        <canvas id="gcodeCanvas" width="500" height="400" style="background:#fff; border-radius:8px; display:block; margin:0 auto; border:1px solid var(--border);"></canvas>
    </div>`;
    var canvas=document.getElementById("gcodeCanvas"), ctx=canvas.getContext("2d"), curX=250, curY=200; 
    
    // Отрисовка сетки
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    for(let i=0; i<=500; i+=25) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,400); ctx.stroke(); }
    for(let j=0; j<=400; j+=25) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(500,j); ctx.stroke(); }
    ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(250,0); ctx.lineTo(250,400); ctx.moveTo(0,200); ctx.lineTo(500,200); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(curX, curY); ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2; 

    window.runGcode = function() { 
        var cmd=document.getElementById("gcodeInput").value.toUpperCase().trim(); 
        if(!cmd) return; 
        document.getElementById("gcodeInput").value=""; 
        var parts=cmd.split(" "), g=parts[0], params={}; 
        parts.slice(1).forEach(p=>{params[p[0]]=parseFloat(p.slice(1));}); 
        
        if(g==="G00"){ 
            if(params.X!==undefined)curX=250+params.X; 
            if(params.Y!==undefined)curY=200-params.Y; 
            ctx.beginPath(); ctx.moveTo(curX,curY);
        }
        else if(g==="G01"){ 
            if(params.X!==undefined)curX=250+params.X; 
            if(params.Y!==undefined)curY=200-params.Y; 
            ctx.lineTo(curX,curY); ctx.stroke();
        }
        else if(g==="G02" || g==="G03") {
            alert("Команды дуг (G02/G03) требуют указания центра (I, J). В этой мини-игре поддерживаются только G00 и G01.");
        }
    }; 
    document.getElementById("gcodeInput").addEventListener("keydown", function(e) { if(e.key==="Enter") window.runGcode(); });
}

// ==========================================
// 8. ИГРА: ЗВЕЗДНОЕ НЕБО
// ==========================================
function startStarfield(container) {
    container.innerHTML = `<h3 style="margin-top:0; text-align:center;">✨ Звездный дождь</h3>
        <canvas id="starfieldCanvas" style="width:100%; height:400px; background:#000; border-radius:8px; display:block;"></canvas>`;
    var canvas = document.getElementById("starfieldCanvas"), ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    
    class Star { 
        constructor() { this.reset(); } 
        reset() { 
            this.x = Math.random()*canvas.width; 
            this.y = Math.random()*canvas.height; 
            this.size = Math.random()*2; 
            this.speed = Math.random()*3+1; 
        } 
        update() { 
            this.y += this.speed; 
            if (this.y > canvas.height) this.reset(); 
        } 
        draw() { 
            ctx.fillStyle="white"; 
            ctx.beginPath(); 
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); 
            ctx.fill(); 
        } 
    }
    var stars = Array.from({ length: 200 }, () => new Star());
    
    function animate() { 
        if (!document.getElementById("starfieldCanvas")) return; 
        ctx.clearRect(0,0,canvas.width,canvas.height); 
        stars.forEach(s=>{s.update();s.draw();}); 
        requestAnimationFrame(animate); 
    }
    animate();
}