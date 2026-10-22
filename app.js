"use strict";

// ============================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null,
    staff: null,
    xp: 0,
    activeCourseId: "07.01",
    results: {},
    avatar: null,
    nickname: null,
    purchasedThemes: [],
    purchasedFonts: [],
    font: "default",
    certBg: "bg1.jfif"
};

try {
    var savedState = localStorage.getItem("mdk.state");
    if (savedState) { Object.assign(window.state, JSON.parse(savedState)); }
} catch(e) { console.warn("Ошибка загрузки state", e); }

window.saveStudentData = function() {
    try { localStorage.setItem("mdk.state", JSON.stringify(window.state)); } catch(e) {}
};

window.studentKey = function() {
    if (!window.state.student) return "";
    return (window.state.student.name || "").trim().toLowerCase() + "|" + (window.state.student.group || "").trim().toLowerCase();
};

window.getLevel = function(xp) { return Math.floor((xp || 0) / 100) + 1; };

window.getLevelTitle = function(lvl) {
    if (lvl < 3) return "Новичок";
    if (lvl < 5) return "Ученик";
    if (lvl < 8) return "Практикант";
    if (lvl < 12) return "Мастер";
    return "Эксперт";
};

window.setCertBg = function(bg) {
    window.state.certBg = bg;
    window.saveStudentData();
    window.renderCertificatePage();
};

window.renderUserChip = function() {
    var nameEl = document.getElementById("userChipName");
    var groupEl = document.getElementById("userChipGroup");
    var avEl = document.getElementById("userChipAvatar");
    
    if (window.state.student) {
        if (nameEl) nameEl.textContent = window.state.nickname || window.state.student.name;
        if (groupEl) groupEl.textContent = "Гр. " + window.state.student.group;
        if (avEl) {
            if (window.state.avatar) avEl.innerHTML = `<img src="${window.state.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            else avEl.textContent = "👨‍🎓";
        }
    } else if (window.state.staff) {
        if (nameEl) nameEl.textContent = window.state.staff.name;
        if (groupEl) groupEl.textContent = window.state.staff.role;
        if (avEl) avEl.textContent = "👨‍🏫";
    }
    
    var xpEl = document.getElementById("xpCount");
    if (xpEl) xpEl.textContent = `🌟 ${window.state.xp} XP`;
};

// ============================================================
// 2. УТИЛИТЫ
// ============================================================
window.$ = window.$ || function(id) { return document.getElementById(id); };
window.el = window.el || function(html) {
    var div = document.createElement("div"); div.innerHTML = html.trim(); return div.firstChild;
};
window.escapeHtml = window.escapeHtml || function(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};
window.showToast = window.showToast || function(msg, type) {
    var container = document.querySelector(".toast-container");
    if (!container) { container = document.createElement("div"); container.className = "toast-container"; document.body.appendChild(container); }
    var t = document.createElement("div"); t.className = "toast " + (type || ""); t.textContent = msg;
    container.appendChild(t); setTimeout(function() { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
};

// ============================================================
// 3. ГЛАВНАЯ СТРАНИЦА (Добавлена!)
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Главная";

    var mdkId = window.state.activeCourseId || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!";
    var module = course ? course.module : "Выберите раздел в меню слева.";

    app.innerHTML = `
        <section class="hero" style="text-align: left; padding: 40px;">
            <span class="brand-badge" style="margin-bottom: 10px; display: inline-block;">${course ? course.shortName : "Портал"}</span>
            <h1 style="font-size: 2.2rem; margin-bottom: 10px;">${title}</h1>
            <p style="font-size: 1.1rem; color: var(--muted);">${module}</p>
        </section>
    `;

    if (course && course.sections) {
        var contentHtml = '<div class="steps-title">Учебный план</div>';
        course.sections.forEach(function(section) {
            contentHtml += `<div class="module" style="padding: 20px; margin-bottom: 15px;">
                <h3 style="color: var(--accent); margin-top: 0;">${section.title}</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">`;
            
            section.topics.forEach(function(topic) {
                contentHtml += `<a href="#/topic/${mdkId}/${topic.id}" class="topic" style="background: var(--card-soft); padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between; text-decoration: none; color: var(--text);">
                    <span><b>${topic.code}</b> ${topic.title}</span>
                    <span>→</span>
                </a>`;
            });
            contentHtml += `</div></div>`;
        });
        app.innerHTML += contentHtml;
    }
};

// ============================================================
// 4. ВКЛАДКИ (Тренировка, Экзамен, Игры, Оформление)
// ============================================================
window.renderFormattingPage = function() {
    var app = document.getElementById("app");
    if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Оформление работ";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    var data = window.GLOBAL_DATA && window.GLOBAL_DATA.formatting;
    if (data) {
        app.innerHTML += `<section class="hero"><h1>📝 ${data.title}</h1></section>`;
        app.innerHTML += `<div class="module" style="padding: 30px; line-height: 1.6;">${data.content}</div>`;
    } else {
        app.innerHTML += `<div class="module">Информация пока недоступна.</div>`;
    }
};

window.renderTrainingPage = function() {
    var app = document.getElementById("app");
    if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Тренировка";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));

    var mdkId = window.state.activeCourseId || "07.01";
    var suffix = mdkId.replace(".", ""); // 07.01 -> 0701
    
    // Пытаемся вызвать функцию из файлов exam_XXXX.js
    if (typeof window["renderTraining_" + suffix] === "function") {
        window["renderTraining_" + suffix](mdkId);
    } else {
        app.innerHTML += `<section class="hero"><h1>🎯 Тренировка</h1></section>`;
        app.innerHTML += `<div class="module" style="color:var(--err);">Тесты для этого МДК (${mdkId}) пока не добавлены или скрипт не загружен.</div>`;
    }
};

window.renderFinalExamPage = function(mdkId) {
    var app = document.getElementById("app");
    if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Экзамен";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));

    var cId = mdkId || window.state.activeCourseId || "07.01";
    var suffix = cId.replace(".", "");

    if (typeof window["renderFinal_" + suffix] === "function") {
        window["renderFinal_" + suffix](cId);
    } else if (typeof window.renderFinalExamPage === "function" && window.renderFinalExamPage !== arguments.callee) {
        // Fallback на final.js если есть
        window.renderFinalExamPage(cId);
    } else {
        app.innerHTML += `<section class="hero"><h1>📋 Итоговый экзамен</h1></section>`;
        app.innerHTML += `<div class="module" style="color:var(--err);">Экзамен для этого МДК (${cId}) пока не добавлен.</div>`;
    }
};

window.renderArcadePage = function() {
    var app = document.getElementById("app");
    if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Игровая комната";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.innerHTML += `<section class="hero"><h1>🎮 Игровая комната</h1><p>Выберите игру</p></section>`;
    
    // Если функции игр определены в games.js
    if (window.startGame) {
        app.innerHTML += `<div class="module">
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:15px;">
                <button class="btn" onclick="window.startGame('gcode')" style="padding:20px; font-size:16px;">📐 G-код</button>
                <button class="btn" onclick="window.startGame('minesweeper')" style="padding:20px; font-size:16px;">💣 Сапёр</button>
                <button class="btn" onclick="window.startGame('tictactoe')" style="padding:20px; font-size:16px;">❌⭕ Крестики-нолики</button>
            </div>
        </div>`;
    } else {
         app.innerHTML += `<div class="module" style="color:var(--err);">Игры временно недоступны (скрипт games.js не загружен).</div>`;
    }
};

// ============================================================
// 5. СЕРТИФИКАТ (С вкладышем оценок и 12 фонами)
// ============================================================
window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; 
    app.innerHTML = "";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    if (!window.state.student && !window.state.staff) return;

    var isTeacher = !!window.state.staff;
    var name = isTeacher ? window.state.staff.name : window.state.student.name;
    var courseName = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId] ? window.MDK_DATA[window.state.activeCourseId].title : "МДК";

    if (isTeacher) {
        app.innerHTML = `<div class="no-print" style="text-align:center; margin-bottom:20px;"><button class="btn" onclick="window.print()">🖨 Распечатать грамоту</button></div>
            <div id="printable-cert" style="background:#fff; color:#000; padding:40px; border-radius:12px; max-width:800px; margin:0 auto; text-align:center; border: 10px double #c14a2a; box-sizing:border-box;">
                <h1 style="font-size:40px; color:#c14a2a; text-transform:uppercase; margin-bottom:20px;">БЛАГОДАРНОСТЬ</h1>
                <p style="font-size:20px; margin:40px 0;">Настоящая грамота вручается</p>
                <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block; padding-bottom:10px; margin-bottom:20px;">${window.escapeHtml(name)}</h2>
                <p style="font-size:18px; margin-top:40px;">За активное участие в разработке и проведении учебного курса</p>
                <h3 style="font-size:24px; color:#000; margin:20px 0;">${window.escapeHtml(courseName)}</h3>
                <div style="display:flex; justify-content:space-between; margin-top:60px; font-size:16px;">
                    <div>Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
                    <div>Подпись: _______________</div>
                </div>
            </div>`;
        return;
    }

    var p = window.state.results || {};
    var isApproved = p.certificateApproved || false;
    var bgs = ["bg1.jfif", "bg2.jfif", "bg3.jfif", "bg4.jfif", "bg5.jfif", "bg6.jfif", "bg7.jpg", "bg8.jpg", "bg9.jpg", "bg10.jpg", "bg11.jpg", "bg12.jpg"];
    
    var certBgSelectorHtml = `<div class="no-print" style="margin-bottom:20px; text-align:center;">
        <h3 style="margin-bottom:10px;">Фон сертификата:</h3>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">`;
    bgs.forEach(bg => {
        // Если файла нет, будет красная рамка
        certBgSelectorHtml += `<img src="certificat/${bg}" class="cert-bg-option ${window.state.certBg === bg ? 'active' : ''}" onclick="window.setCertBg('${bg}')" style="width:80px; height:60px; object-fit:cover; border-radius:4px; cursor:pointer; border:3px solid ${window.state.certBg === bg ? 'var(--accent)' : 'transparent'}; transition:0.2s;" onerror="this.style.border='1px solid red'; this.title='Файл не найден';">`;
    });
    certBgSelectorHtml += `</div></div>`;

    var certHtml = `
        <div id="printable-cert" style="background-image: url('certificat/${window.state.certBg || bgs[0]}'); background-size: 100% 100%; background-color: #fff; color:#000; padding: 20px; border-radius: 12px; max-width:900px; margin:0 auto; position: relative; aspect-ratio: 1.414 / 1; display: flex; align-items: center; justify-content: center; -webkit-print-color-adjust: exact;">
            <div style="background: rgba(255, 255, 255, 0.85); width: 100%; height: 100%; padding: 30px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; border-radius: 8px;">
                <div>
                    <h1 style="font-size:32px; color:#c14a2a; text-transform:uppercase;">СЕРТИФИКАТ</h1>
                    <p style="font-size:16px;">подтверждает, что</p>
                    <h2 style="font-size:28px; margin:15px 0; color:#000; border-bottom: 2px solid #ccc; display: inline-block;">${window.escapeHtml(window.state.student.name)}</h2>
                    <p style="font-size:16px;">успешно прошел(ла) обучение по программе</p>
                    <h3 style="font-size:20px; margin:15px 0; color:#000;">${window.escapeHtml(courseName)}</h3>
                    <p style="font-size:14px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:14px; margin-top:20px;">
                    <div style="text-align:left;"><p>Дата выдачи:</p><p style="font-weight:bold;">${new Date().toLocaleDateString('ru-RU')}</p></div>
                    <div style="text-align:right;"><p>Подпись:</p><div style="border-bottom: 1px solid #000; width: 150px; height: 30px;"></div></div>
                </div>
            </div>
            ${!isApproved ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-30deg); font-size:80px; font-weight:bold; color:rgba(255,0,0,0.15); white-space:nowrap; pointer-events:none;">ОБРАЗЕЦ</div>` : ""}
        </div>
    `;

    // Вкладыш с оценками (добавлен!)
    var gradesList = Object.keys(p).filter(k => k.startsWith("__final__") || k.startsWith("prac_") || k.startsWith("self_"));
    var gradesRows = gradesList.map(k => {
        var title = k.replace("__final__", "Экзамен ");
        var grade = p[k].grade || p[k].correct || p[k];
        if (typeof grade === 'object') grade = grade.grade || '—';
        return `<tr><td style="border:1px solid #ccc; padding:8px;">${title}</td><td style="border:1px solid #ccc; padding:8px; text-align:center; font-weight:bold;">${grade}</td></tr>`;
    }).join("");

    var supplementHtml = `
        <div class="no-print" style="text-align:center; margin:20px 0;"><button class="btn" onclick="window.print()">🖨 Распечатать сертификат и вкладыш</button></div>
        <div id="printable-supplement" style="background:#fff; color:#000; padding:40px; max-width:900px; margin:20px auto; border:1px solid #ccc; border-radius:12px; page-break-before: always;">
            <h2 style="text-align:center; color:#c14a2a; margin-bottom:20px;">ВКЛАДЫШ ОЦЕНОК</h2>
            <p><b>Студент:</b> ${window.escapeHtml(window.state.student.name)}</p>
            <p><b>Группа:</b> ${window.escapeHtml(window.state.student.group)}</p>
            <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                <thead><tr style="background:#f0f0f0;"><th style="border:1px solid #ccc; padding:8px;">Работа</th><th style="border:1px solid #ccc; padding:8px;">Оценка</th></tr></thead>
                <tbody>${gradesRows || '<tr><td colspan="2" style="text-align:center; padding:10px;">Оценок пока нет</td></tr>'}</tbody>
            </table>
        </div>
    `;
    
    app.innerHTML += certBgSelectorHtml + certHtml + supplementHtml;
};

// ============================================================
// 6. ПРОФИЛЬ И ДОСТИЖЕНИЯ
// ============================================================
window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    var isTeacher = !!window.state.staff;
    var targetKey = route.split("/")[2] ? decodeURIComponent(route.split("/")[2]) : null;

    if (isTeacher && targetKey) {
        app.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
        window.API.getStudentData(targetKey).then(res => {
            app.innerHTML = '<a class="backlink" href="#/journal" style="color:var(--accent);">← Назад к журналу</a>';
            if (!res || !res.ok) { app.innerHTML += '<div class="module">Студент не найден.</div>'; return; }
            var p = {}; try { p = JSON.parse(res.payload || "{}"); } catch(e) {}
            var name = targetKey.split("|")[0];
            var group = targetKey.split("|")[1] || "—";
            var xp = p.xp || 0;
            var avHtml = p.avatar ? `<img src="${p.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
            app.innerHTML += `<section class="module" style="text-align:center; padding:40px;"><div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); display:flex; align-items:center; justify-content:center; font-size:60px; overflow:hidden;">${avHtml}</div><h2 style="margin:0 0 10px 0;">${window.escapeHtml(name)}</h2><p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.escapeHtml(group)}</p><div style="display:inline-block; background:var(--card-soft); padding:10px 20px; border-radius:20px;"><b style="color:var(--gold);">${xp} XP</b> · Уровень ${window.getLevel(xp)}</div></section>`;
        });
    } else if (window.state.student) {
        var lvl = window.getLevel(window.state.xp);
        var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;"><div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); display:flex; align-items:center; justify-content:center; font-size:60px; overflow:hidden;">${avHtml}</div><h2 style="margin:0 0 10px 0;">${window.escapeHtml(window.state.nickname || window.state.student.name)}</h2><p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.escapeHtml(window.state.student.group)}</p><div style="display:inline-block; background:var(--card-soft); padding:10px 20px; border-radius:20px; margin-bottom:20px;"><b style="color:var(--gold);">${window.state.xp} XP</b> · Уровень ${lvl} (${window.getLevelTitle(lvl)})</div><br><a href="#/shop" class="btn" style="margin-top:10px;">🛒 Магазин XP</a></section>`;
    } else {
        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;"><div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); display:flex; align-items:center; justify-content:center; font-size:60px; background:var(--card-soft);">👨‍🏫</div><h2 style="margin:0 0 10px 0;">${window.escapeHtml(window.state.staff.name)}</h2><p style="color:var(--muted);">Роль: ${window.state.staff.role}</p></section>`;
    }
};

window.renderAchievementsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Достижения";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.innerHTML += `<section class="hero"><h1>🏆 Достижения</h1><p>Твой прогресс на портале</p></section><div class="module"><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px;">`;
    var list = [{ title: "Первый шаг", desc: "Войти в систему", icon: "🚪" },{ title: "Книжный червь", desc: "Изучить лекцию", icon: "📖" },{ title: "Хакер", desc: "Пройти тест", icon: "💻" },{ title: "Геймер", desc: "Сыграть в игру", icon: "🎮" },{ title: "Опытный", desc: "Достичь 5 уровня", icon: "⭐" },{ title: "Богач", desc: "Накопить 1000 XP", icon: "💰" }];
    list.forEach(a => { app.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:12px; text-align:center; border:1px solid var(--border); opacity:0.5;"><div style="font-size:40px; margin-bottom:10px;">${a.icon}</div><div style="font-weight:bold; font-size:14px;">${a.title}</div><div style="font-size:12px; color:var(--muted); margin-top:5px;">${a.desc}</div></div>`; });
    app.innerHTML += `</div></div>`;
};

// ============================================================
// 7. МОДАЛЬНОЕ ОКНО ТЕМ И ПРОСТЫЕ СТРАНИЦЫ
// ============================================================
window.openThemeModal = function() {
    var modal = document.getElementById("themeModalOverlay");
    if (modal) { modal.classList.add("open"); return; }
    var themes = [{ id: "default", title: "Стандарт", bg: "#0e0e10", text: "#e8e6e1" },{ id: "ury-light", title: "Ury Light", bg: "#FFFFFF", text: "#252525" },{ id: "ury-dark", title: "Ury Dark", bg: "#2b2b2b", text: "#ebebeb" },{ id: "ury-sepia", title: "Ury Sepia", bg: "#f3f2ec", text: "#252525" },{ id: "neon", title: "Киберпанк", bg: "#09090b", text: "#ff00cc" },{ id: "matrix", title: "Матрица", bg: "#000000", text: "#00ff00" },{ id: "cyberpunk", title: "Cyberpunk", bg: "#0a0015", text: "#00ffff" }];
    
    if (!document.getElementById("themeModalStyles")) {
        var style = document.createElement("style"); style.id = "themeModalStyles";
        style.textContent = `.theme-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s; backdrop-filter: blur(4px); } .theme-modal-overlay.open { opacity: 1; pointer-events: auto; } .theme-modal { background: var(--card); padding: 24px; border-radius: 16px; width: 90%; max-width: 600px; border: 1px solid var(--border); max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5); } .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; margin-top: 20px; } .theme-card { border: 2px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; background: var(--card-soft); } .theme-card:hover { border-color: var(--accent); transform: translateY(-2px); } .theme-card.active { border-color: var(--accent); background: var(--accent-soft); } .theme-preview { width: 100%; height: 60px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.1); }`;
        document.head.appendChild(style);
    }
    var html = `<div class="theme-modal-overlay" id="themeModalOverlay" onclick="if(event.target===this) this.classList.remove('open')"><div class="theme-modal"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><h2 style="margin:0;">Выбор темы</h2><button class="btn ghost" onclick="document.getElementById('themeModalOverlay').classList.remove('open')">✕</button></div><div class="theme-grid">`;
    themes.forEach(t => { var active = localStorage.getItem("mdk.theme_active") === t.id || (t.id === "default" && !localStorage.getItem("mdk.theme_active")); html += `<div class="theme-card ${active ? 'active' : ''}" onclick="window.applyShopItem('theme', '${t.id}', '')"><div class="theme-preview" style="background:${t.bg}; color:${t.text};">Aa</div><div style="font-weight:bold; font-size:13px;">${t.title}</div></div>`; });
    html += `</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById("themeModalOverlay").classList.add("open"), 10);
};

window.renderSimplePage = function(title, items, icon) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = title;
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el(`<section class="hero"><h1>${icon} ${title}</h1></section>`));
    var list = el(`<div class="module"></div>`);
    if (!items || !items.length) { list.innerHTML = "<p>Материалы пока не добавлены.</p>"; } 
    else {
        items.forEach(item => {
            var isVideo = item.file && (item.file.toLowerCase().endsWith('.mp4') || item.file.toLowerCase().endsWith('.webm'));
            var isPdf = item.file && item.file.toLowerCase().endsWith('.pdf');
            var isDocx = item.file && item.file.toLowerCase().endsWith('.docx');
            var isYouTube = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
            var mediaHtml = "";
            
            if (isYouTube) {
                var vidId = item.url.includes('v=') ? item.url.split('v=')[1].split('&')[0] : item.url.split('/').pop();
                mediaHtml = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; margin-top:10px;"><iframe src="https://www.youtube.com/embed/${vidId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`;
            } else if (isVideo) {
                mediaHtml = `<video controls src="${item.file}" style="width:100%; max-height:400px; border-radius:8px; margin-top:10px; background:#000;"><source src="${item.file}" type="video/mp4">Ваш браузер не поддерживает видео.</video>`;
            } else if (isPdf) {
                mediaHtml = `<div style="width:100%; height:500px; border-radius:8px; margin-top:10px; border:1px solid var(--border); background:#fff;"><iframe src="${item.file}#toolbar=0" width="100%" height="100%" style="border:none;"></iframe></div>`;
            } else if (isDocx) {
                mediaHtml = `<p style="color:var(--muted); font-size:14px; margin-top:10px;">Документ Word (DOCX) не может быть открыт прямо в браузере. Скачайте его по кнопке ниже.</p>`;
            }

            list.innerHTML += `<div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:8px; background:var(--card-soft);">
                <b style="color:var(--accent); font-size:16px;">${item.title || 'Без названия'}</b><br>
                <span style="font-size:14px; color:var(--muted);">${item.description || item.content || ''}</span>
                ${mediaHtml}
                ${(item.file || item.url) && !isYouTube && !isVideo && !isPdf ? `<br><a href="${item.file || item.url}" target="_blank" class="btn" style="margin-top:10px; padding:8px 16px;">📥 Открыть / Скачать</a>` : ''}
            </div>`;
        });
    }
    app.appendChild(list);
};

// ============================================================
// 8. ИНИЦИАЛИЗАЦИЯ И РОУТЕР
// ============================================================
window.handleLogout = function() {
    window.state.student = null; window.state.staff = null;
    window.saveStudentData(); location.reload();
};

window.addEventListener("DOMContentLoaded", function() {
    window.renderUserChip();
    
    if (window.state.font && window.state.font !== "default") {
        var styleEl = document.getElementById("customFontStyle") || document.createElement("style"); styleEl.id = "customFontStyle";
        var fontsMap = { "atkinson": "'Atkinson Hyperlegible', sans-serif", "newsreader": "'Newsreader', serif", "spectral": "'Spectral', serif", "quattrocento": "'Quattrocento Sans', sans-serif", "orbitron": "'Orbitron', sans-serif", "sharetech": "'Share Tech Mono', monospace" };
        if (fontsMap[window.state.font]) { styleEl.textContent = "body, button, input, textarea, select { font-family: " + fontsMap[window.state.font] + " !important; }"; document.head.appendChild(styleEl); }
    }

    if ($("themeToggle")) $("themeToggle").onclick = window.openThemeModal; 

    if ($("burgerBtn")) {
        $("burgerBtn").onclick = function() { document.getElementById("drawer").classList.add("open"); document.getElementById("drawerOverlay").classList.add("open"); };
        document.getElementById("drawerClose").onclick = function() { document.getElementById("drawer").classList.remove("open"); document.getElementById("drawerOverlay").classList.remove("open"); };
        document.getElementById("drawerOverlay").onclick = function() { document.getElementById("drawer").classList.remove("open"); this.classList.remove("open"); };
    }

    document.querySelectorAll(".drawer-item[data-go]").forEach(link => {
        link.onclick = function(e) { e.preventDefault(); location.hash = this.getAttribute("data-go"); document.getElementById("drawer").classList.remove("open"); document.getElementById("drawerOverlay").classList.remove("open"); };
    });

    // Логика входа
    var loginOverlay = document.getElementById("loginOverlay");
    if (window.state.student || window.state.staff) { if (loginOverlay) loginOverlay.style.display = "none"; }

    var btnLoginStudent = document.getElementById("btnLoginStudent");
    if (btnLoginStudent) {
        btnLoginStudent.onclick = function() {
            var name = document.getElementById("loginName").value.trim();
            var group = document.getElementById("loginGroup").value.trim();
            if (!name || !group) return window.showToast("Введите ФИО и группу", "err");
            var key = name.toLowerCase() + "|" + group.toLowerCase();
            btnLoginStudent.textContent = "Вход..."; btnLoginStudent.disabled = true;

            window.API.getStudentData(key).then(res => {
                var payload = {}; if (res && res.ok && res.payload) { try { payload = JSON.parse(res.payload); } catch(e){} }
                window.state.student = { name: name, group: group };
                window.state.xp = payload.xp || 0;
                window.state.results = payload.results || {};
                window.state.avatar = payload.avatar || null;
                window.state.nickname = payload.nickname || null;
                window.state.purchasedThemes = payload.purchasedThemes || [];
                window.state.purchasedFonts = payload.purchasedFonts || [];
                window.state.font = payload.font || "default";
                window.state.certBg = payload.certBg || "bg1.jfif";
                
                window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти"; btnLoginStudent.disabled = false;
            }).catch(err => {
                window.state.student = { name: name, group: group };
                window.state.xp = 0; window.state.results = {};
                window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти"; btnLoginStudent.disabled = false;
            });
        };
    }

    var btnLoginTeacher = document.getElementById("btnLoginTeacher");
    if (btnLoginTeacher) {
        btnLoginTeacher.onclick = function() {
            var user = document.getElementById("teacherUser").value.trim();
            var pass = document.getElementById("teacherPass").value.trim();
            var errEl = document.getElementById("teacherLoginError");
            if (errEl) errEl.style.display = "none";
            if (!user || !pass) return window.showToast("Введите логин и пароль", "err");
            btnLoginTeacher.textContent = "Проверка..."; btnLoginTeacher.disabled = true;

            window.API.login(user, pass).then(res => {
                if (res && res.ok) {
                    window.state.staff = { name: res.name, role: res.role };
                    window.saveStudentData(); window.renderUserChip();
                    if (loginOverlay) loginOverlay.style.display = "none";
                    window.location.hash = "#/journal"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                } else {
                    if (errEl) { errEl.textContent = res.error || "Неверный логин или пароль"; errEl.style.display = "block"; }
                }
                btnLoginTeacher.textContent = "Войти в журнал"; btnLoginTeacher.disabled = false;
            }).catch(err => {
                if (errEl) { errEl.textContent = "Ошибка сервера"; errEl.style.display = "block"; }
                btnLoginTeacher.textContent = "Войти в журнал"; btnLoginTeacher.disabled = false;
            });
        };
    }

    function router() {
        var hash = location.hash.replace("#", "") || "/";
        var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";

        var loginOverlay = document.getElementById("loginOverlay");
        if (!window.state.student && !window.state.staff) { if (loginOverlay) loginOverlay.style.display = "flex"; } 
        else { if (loginOverlay) loginOverlay.style.display = "none"; }

        if (hash === "/" || hash === "") {
            if (window.renderHomePage) window.renderHomePage();
            else app.innerHTML = '<section class="hero"><h1>Добро пожаловать!</h1></section>';
        } else if (hash === "/videos") {
            window.renderSimplePage("Видеоуроки", window.GLOBAL_DATA.videos, "🎬");
        } else if (hash === "/passports") {
            window.renderSimplePage("Паспорта станков", window.GLOBAL_DATA.passports, "📄");
        } else if (hash === "/safety") {
            window.renderSimplePage("Охрана труда", window.GLOBAL_DATA.safety, "🦺");
        } else if (hash === "/formatting") {
            window.renderFormattingPage();
        } else if (hash === "/profile" || hash.startsWith("/profile/")) {
            window.renderProfilePage(hash);
        } else if (hash === "/certificate") {
            window.renderCertificatePage();
        } else if (hash === "/shop") {
            if (window.renderShopPage) window.renderShopPage();
        } else if (hash === "/achievements") {
            window.renderAchievementsPage();
        } else if (hash === "/links") {
            if (window.renderLinksPage) window.renderLinksPage();
        } else if (hash === "/training") {
            window.renderTrainingPage();
        } else if (hash === "/final") {
            window.renderFinalExamPage();
        } else if (hash === "/arcade") {
            window.renderArcadePage();
        } else if (hash === "/rating") {
            if (window.renderRatingPage) window.renderRatingPage();
        } else if (hash === "/journal") {
            if (window.renderJournalPage) window.renderJournalPage();
        } else if (hash === "/reports") {
            if (window.renderCourseReportsPage) window.renderCourseReportsPage();
        } else if (hash === "/schedule") {
            if (window.renderSchedulePage) window.renderSchedulePage();
        } else {
            app.innerHTML = '<section class="hero"><h1>404</h1><p>Страница не найдена</p></section>';
        }
    }

    window.addEventListener("hashchange", router);
    router();
});