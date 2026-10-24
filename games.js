"use strict";

// ================= ГЛАВНАЯ СТРАНИЦА ИГР =================
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
    app.appendChild(el('<section class="hero"><h1>🎮 Игровая комната</h1><p>Зарабатывай XP и развлекайся! Все игры доступны для любого МДК.</p></section>'));

    var allGames = [
        { id: "snake", title: "🐍 Cursor Snake", desc: "Управляйте змейкой курсором мыши или стрелками." },
        { id: "pumpkin", title: "🎃 Carve Pumpkin", desc: "Вырежи лицо на тыкве и получи код." },
        { id: "gcode", title: "📐 G-код Рисование", desc: "Изучи команды G00, G01, G02, G03 на практике." },
        { id: "minesweeper", title: "💣 Сапёр", desc: "Классический сапёр с флажками и уровнями сложности." },
        { id: "tictactoe", title: "❌ Крестики-нолики", desc: "От 3х3 до 8х8. Победи робота!" },
        { id: "sudoku", title: "🔢 Судоку", desc: "Разные уровни сложности. Тренируй логику!" },
        { id: "blackjack", title: "🃏 Очко (21)", desc: "Классический блэкджек. Набери 21 очко и обыграй дилера." },
        { id: "memory", title: "🧠 Найди пару", desc: "Тренируй память, открывая карточки с одинаковыми символами." },
        { id: "casino", title: "🎰 Казино", desc: "Испытай удачу на слотах." },
        { id: "roulette", title: "🎡 Рулетка", desc: "Красное или черное? Угадай число!" },
        { id: "spider", title: "🕷️ Солитёр Паук", desc: "Собирайте последовательности от Короля до Туза." },
        { id: "party", title: "☠️ Смертельная вечеринка", desc: "Викторина на выживание с таймером." },
        { id: "starfield", title: "✨ Звездный дождь", desc: "Красивая визуализация падающих звезд." },
        { id: "solar", title: "🪐 Солнечная система", desc: "Анимация орбит планет вокруг Солнца." }
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
            <button class="btn ghost" style="width:100%; margin-top:15px;">Запустить</button>
        </div>`));
    });
    
    app.appendChild(grid);
};

window.startGame = function(gameId) {
    var app = document.getElementById("app"); 
    if (!app) return;
    app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="javascript:void(0)" onclick="window.renderArcadePage()" style="color:var(--accent); cursor:pointer;">← В меню игр</a>'));

    if (window.unlockAchievement) window.unlockAchievement('gamer');

    var rules = {
        snake: "Управляйте змейкой курсором мыши или стрелками. Собирайте еду и не врезайтесь в себя.",
        pumpkin: "Вырезайте лицо на тыкве, ведя курсором по разметке. Получите код, когда лицо будет готово.",
        gcode: "Вводите команды в формате G01 X50 Y50. Используйте G02/G03 с параметрами I и J для рисования дуг.",
        minesweeper: "Клик открывает клетку. Кнопка 'Флажок' или правая кнопка мыши ставит флаг. Цифры показывают мины рядом.",
        tictactoe: "Соберите линию из N символов раньше робота.",
        sudoku: "Заполните поле цифрами так, чтобы они не повторялись в строках, столбцах и блоках.",
        blackjack: "Наберите сумму очков ближе к 21, чем у дилера, но не больше.",
        memory: "Открывайте по две карточки за ход. Если символы совпали — они остаются открытыми.",
        casino: "Сделайте ставку и крутите слоты. 3 одинаковых — джекпот.",
        roulette: "Угадайте число (х35) или чёт/нечет (х2).",
        spider: "Собирайте от Короля до Туза в одной масти.",
        party: "У вас 15 секунд на ответ и 3 жизни.",
        starfield: "Красивая анимация звездного неба. Просто наблюдайте.",
        solar: "Анимация движения планет. Просто наблюдайте."
    };

    app.appendChild(el(`<details style="margin-bottom:15px; background:var(--card-soft); padding:12px; border-radius:8px; border:1px solid var(--border);">
        <summary style="cursor:pointer; font-weight:bold; color:var(--accent);">❓ Как играть / управлять</summary>
        <p style="margin-top:10px; font-size:14px; color:var(--muted); line-height:1.4;">${rules[gameId] || "Правила не указаны."}</p>
    </details>`));

    var container = el('<div class="module" id="gameContainer" style="min-height:400px; padding:0; overflow:hidden;"></div>');
    app.appendChild(container);

    // Если игры лежат в отдельной папке, укажите путь, например: 'games/cursor-snake.html'
    if (gameId === 'snake') {
        container.innerHTML = `<iframe src="./cursor-snake.html" style="width:100%; height:80vh; border:none; display:block; border-radius:8px;"></iframe>`;
    } else if (gameId === 'pumpkin') {
        container.innerHTML = `<iframe src="./carve-pumpkin.html" style="width:100%; height:80vh; border:none; display:block; border-radius:8px;"></iframe>`;
    } else if (gameId === 'gcode') {
        startGcode(container);
    } else if (gameId === 'minesweeper') {
        startMinesweeper(container);
    } else if (gameId === 'tictactoe') {
        startTicTacToe(container);
    } else if (gameId === 'sudoku') {
        startSudoku(container);
    } else if (gameId === 'blackjack') {
        startBlackjack(container);
    } else if (gameId === 'memory') {
        startMemory(container);
    } else if (gameId === 'casino') {
        startCasino(container);
    } else if (gameId === 'roulette') {
        startRoulette(container);
    } else if (gameId === 'party') {
        startParty(container);
    } else if (gameId === 'spider') {
        startSpider(container);
    } else if (gameId === 'starfield') {
        startStarfield(container);
    } else if (gameId === 'solar') {
        startSolarSystem(container);
    }
};

// ================= 1. ЗВЕЗДНЫЙ ДОЖДЬ =================
function startStarfield(container) {
    container.innerHTML = `<canvas id="starfieldCanvas" style="width:100%; height:400px; background:#000; border-radius:8px; display:block;"></canvas>`;
    var canvas = document.getElementById("starfieldCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speed = Math.random() * 3 + 1;
        }
        update() {
            this.y += this.speed;
            if (this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    var stars = Array.from({ length: 200 }, () => new Star());
    
    function animate() {
        if (!document.getElementById("starfieldCanvas")) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ================= 2. СОЛНЕЧНАЯ СИСТЕМА =================
function startSolarSystem(container) {
    container.innerHTML = `<canvas id="solarCanvas" style="width:100%; height:400px; background:#000; border-radius:8px; display:block;"></canvas>`;
    var canvas = document.getElementById("solarCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 15 };
    var planets = [
        { r: 3, dist: 40, speed: 0.04, angle: 0, color: '#a9a9a9' }, // Меркурий
        { r: 5, dist: 70, speed: 0.03, angle: 0, color: '#ffd700' }, // Венера
        { r: 6, dist: 100, speed: 0.02, angle: 0, color: '#0000ff' }, // Земля
        { r: 4, dist: 130, speed: 0.015, angle: 0, color: '#ffa500' } // Марс
    ];

    function draw() {
        if (!document.getElementById("solarCanvas")) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Солнце
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();

        // Планеты
        planets.forEach(p => {
            p.angle += p.speed;
            var x = sun.x + p.dist * Math.cos(p.angle);
            var y = sun.y + p.dist * Math.sin(p.angle);
            
            // Орбита
            ctx.beginPath();
            ctx.arc(sun.x, sun.y, p.dist, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.stroke();

            // Планета
            ctx.beginPath();
            ctx.arc(x, y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ================= 3. G-КОД РИСОВАНИЕ (Упрощенная) =================
function startGcode(container) {
    container.innerHTML = `
        <div style="padding: 20px;">
            <h3 style="margin-top:0;">📐 G-код Рисование</h3>
            <p style="color:var(--muted); font-size:14px; margin-bottom:15px;">Введите команду и нажмите Enter. Примеры: <code>G01 X100 Y100</code>, <code>G02 X50 Y50 I25 J0</code></p>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <input type="text" id="gcodeInput" class="self-input" style="margin:0; flex:1;" placeholder="G01 X50 Y50">
                <button class="btn" onclick="window.runGcode()">Выполнить</button>
            </div>
            <canvas id="gcodeCanvas" width="400" height="400" style="background:#111; border:2px solid var(--border); border-radius:8px; display:block; margin: 0 auto;"></canvas>
        </div>
    `;
    var canvas = document.getElementById("gcodeCanvas");
    var ctx = canvas.getContext("2d");
    var curX = 200, curY = 200; // Начало в центре
    var lastX = 200, lastY = 200;

    ctx.beginPath();
    ctx.moveTo(curX, curY);

    window.runGcode = function() {
        var cmd = document.getElementById("gcodeInput").value.toUpperCase().trim();
        if (!cmd) return;
        document.getElementById("gcodeInput").value = "";
        var parts = cmd.split(" ");
        var g = parts[0];
        var params = {};
        parts.slice(1).forEach(p => { params[p[0]] = parseFloat(p.slice(1)); });

        ctx.strokeStyle = '#39E6FF';
        ctx.lineWidth = 2;

        if (g === "G00") {
            if (params.X !== undefined) curX = params.X;
            if (params.Y !== undefined) curY = params.Y;
            ctx.moveTo(curX, curY);
        } else if (g === "G01") {
            if (params.X !== undefined) curX = params.X;
            if (params.Y !== undefined) curY = params.Y;
            ctx.lineTo(curX, curY);
            ctx.stroke();
        } else if (g === "G02" || g === "G03") {
            var cx = curX + (params.I || 0);
            var cy = curY + (params.J || 0);
            var nx = params.X !== undefined ? params.X : curX;
            var ny = params.Y !== undefined ? params.Y : curY;
            var r = Math.sqrt((curX-cx)**2 + (curY-cy)**2);
            
            ctx.beginPath();
            // Для простоты рисуем полную окружность или дугу
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
            curX = nx; curY = ny;
            ctx.beginPath();
            ctx.moveTo(curX, curY);
        }
    };

    document.getElementById("gcodeInput").addEventListener("keydown", function(e) {
        if (e.key === "Enter") window.runGcode();
    });
}

// ================= ОСТАЛЬНЫЕ ИГРЫ (Заглушки для стабильности) =================
function startMinesweeper(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">💣 Сапёр в разработке (требуется подключение полного скрипта)</div>`; }
function startTicTacToe(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">❌ Крестики-нолики в разработке</div>`; }
function startSudoku(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">🔢 Судоку в разработке</div>`; }
function startBlackjack(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">🃏 Очко в разработке</div>`; }
function startMemory(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">🧠 Найди пару в разработке</div>`; }
function startCasino(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">🎰 Казино в разработке</div>`; }
function startRoulette(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">🎡 Рулетка в разработке</div>`; }
function startParty(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">☠️ Смертельная вечеринка в разработке</div>`; }
function startSpider(container) { container.innerHTML = `<div style="padding:40px; text-align:center;">🕷️ Пасьянс Паук в разработке</div>`; }