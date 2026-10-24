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
        pumpkin: "Вырезайте лицо на тыкве, ведя курсором по разметке.",
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

    if (gameId === 'snake') {
        container.innerHTML = `<iframe src="cursor-snake.html" style="width:100%; height:80vh; border:none; display:block;"></iframe>`;
    } else if (gameId === 'pumpkin') {
        container.innerHTML = `<iframe src="carve-pumpkin.html" style="width:100%; height:80vh; border:none; display:block;"></iframe>`;
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