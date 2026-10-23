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
        { id: "snake", title: "🐍 Змейка", desc: "Классическая аркада. Управление стрелками." },
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
        snake: "Управляйте змейкой стрелками на клавиатуре. Собирайте еду и не врезайтесь в стены.",
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

    var container = el('<div class="module" id="gameContainer" style="min-height:400px;"></div>');
    app.appendChild(container);

    if (gameId === 'snake') startSnake(container);
    else if (gameId === 'gcode') startGcode(container);
    else if (gameId === 'minesweeper') startMinesweeper(container);
    else if (gameId === 'tictactoe') startTicTacToe(container);
    else if (gameId === 'sudoku') startSudoku(container);
    else if (gameId === 'blackjack') startBlackjack(container);
    else if (gameId === 'memory') startMemory(container);
    else if (gameId === 'casino') startCasino(container);
    else if (gameId === 'roulette') startRoulette(container);
    else if (gameId === 'party') startParty(container);
    else if (gameId === 'spider') startSpider(container);
    else if (gameId === 'starfield') startStarfield(container);
    else if (gameId === 'solar') startSolarSystem(container);
};

// ================= 1. ЗМЕЙКА =================
function startSnake(container) {
    container.innerHTML = `<div style="text-align:center;">
        <h3>🐍 Змейка</h3>
        <p id="snakeScore" style="font-weight:bold; color:var(--accent);">Очки: 0</p>
        <canvas id="snakeCanvas" width="400" height="400" style="background:#111; border:2px solid var(--border); border-radius:8px; touch-action:none;"></canvas>
        <div style="margin-top:10px;">
            <button class="btn" onclick="window.restartSnake()">Перезагрузить</button>
        </div>
        <p style="font-size:12px; color:var(--muted); margin-top:10px;">Управление: Стрелки на клавиатуре</p>
    </div>`;

    var canvas = document.getElementById("snakeCanvas");
    var ctx = canvas.getContext("2d");
    var tileSize = 20;
    var tileCount = canvas.width / tileSize;

    var snake = [];
    var food = { x: 0, y: 0 };
    var dx = 1, dy = 0;
    var score = 0;
    var speed = 150;
    var gameLoop;

    function createFood() {
        food.x = Math.floor(Math.random() * tileCount) * tileSize;
        food.y = Math.floor(Math.random() * tileCount) * tileSize;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем змейку
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? 'purple' : 'green';
            ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
        });

        // Рисуем еду
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, tileSize, tileSize);
        
        document.getElementById("snakeScore").innerText = "Очки: " + score;
    }

    function update() {
        var head = { x: snake[0].x + dx * tileSize, y: snake[0].y + dy * tileSize };
        
        // Проверка столкновения со стенами
        if (head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0) {
            clearInterval(gameLoop);
            window.saveScore('snake', score);
            setTimeout(() => alert("Игра окончена! Очки: " + score), 100);
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            createFood();
        } else {
            snake.pop();
        }
        
        draw();
    }

    window.restartSnake = function() {
        snake = [{ x: 10 * tileSize, y: 10 * tileSize }];
        dx = 1; dy = 0; score = 0;
        clearInterval(gameLoop);
        createFood();
        gameLoop = setInterval(update, speed);
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        else if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        else if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    });

    window.restartSnake();
}

// ================= 2. ЗВЕЗДНЫЙ ДОЖДЬ =================
function startStarfield(container) {
    container.innerHTML = `<canvas id="starfieldCanvas" style="width:100%; height:400px; background:#000; border-radius:8px;"></canvas>`;
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
        if (!document.getElementById("starfieldCanvas")) return; // Остановка если ушли со страницы
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ================= 3. СОЛНЕЧНАЯ СИСТЕМА =================
function startSolarSystem(container) {
    container.innerHTML = `<canvas id="solarCanvas" style="width:100%; height:400px; background:#000; border-radius:8px;"></canvas>`;
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

// ================= ОСТАЛЬНЫЕ ИГРЫ =================
// (G-код, Сапёр, Крестики-нолики, Судоку, Блэкджек, Память, Казино, Рулетка, Пати, Паук)
// Код для них остается таким же, как в предыдущем сообщении. 
// Вставьте функции startGcode, startMinesweeper и т.д. ниже, 
// так как они не менялись.