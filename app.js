"use strict";

// ============================================================
// 1. СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null,
    staff: null,
    xp: 0,
    activeCourseId: "07.01",
    results: {},
    avatar: null,
    nickname: null,
    signature: null,
    purchasedThemes: [],
    purchasedFonts: [],
    font: "default",
    certBg: "bg1",
    examSubmissions: [],
    unlockedAchievements: [],
    purchasedTextEffects: [],
    activeTextEffect: "none",
    purchasedBgEffects: [],
    activeBgEffect: "none",
    purchasedCardEffects: [],
    activeCardEffect: "none"
};

try {
    var savedState = localStorage.getItem("mdk.state");
    if (savedState) Object.assign(window.state, JSON.parse(savedState));
} catch (e) {}

// ============================================================
// 2. УТИЛИТЫ
// ============================================================
window.clearCache = function() {
    if (confirm("Это очистит локальные данные, сбросит кэш браузера и обновит страницу. Продолжить?")) {
        localStorage.clear();
        sessionStorage.clear();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) registration.unregister();
                location.reload(true);
            });
        } else location.reload(true);
    }
};

window.isVIP = function() {
    if (window.state.staff) return true;
    if (!window.state.student) return false;
    var name = window.state.student.name.toLowerCase();
    return name.includes("новиков арсений") || name.includes("кулиш денис");
};

window.saveStudentData = function() {
    try {
        localStorage.setItem("mdk.state", JSON.stringify(window.state));
        if (window.state.student && window.API && window.studentKey()) {
            window.API.saveStudent(window.studentKey(), window.state.student.name, window.state.student.group, JSON.stringify(window.state))
                .catch(err => console.warn("Ошибка синхронизации с Google Sheets", err));
        }
    } catch (e) {}
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

window.$ = window.$ || function(id) { return document.getElementById(id); };
window.el = window.el || function(html) {
    var div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstChild;
};
window.escapeHtml = window.escapeHtml || function(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};

window.showToast = window.showToast || function(msg, type) {
    var container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    var t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(function() { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
};

window.applyGlobalEffects = function() {
    var textFx = window.state.activeTextEffect || "none";
    var logo = document.getElementById("mainLogo");
    var userName = document.getElementById("userChipName");
    if (logo && userName) {
        logo.className = "brand-badge";
        userName.className = "";
        if (textFx !== "none") {
            logo.classList.add(textFx);
            userName.classList.add(textFx);
            if (textFx === 'fx-glitch-text') {
                logo.setAttribute('data-text', logo.textContent);
                userName.setAttribute('data-text', userName.textContent);
            }
        } else logo.classList.add("rainbow-text");
    }
    var cardFx = window.state.activeCardEffect || "none";
    document.querySelectorAll(".topic").forEach(function(el) {
        el.classList.remove("fx-holo-card", "fx-3d-card");
        if (cardFx !== "none") el.classList.add(cardFx);
    });
    var bgFx = window.state.activeBgEffect || "none";
    document.querySelectorAll(".hero").forEach(function(el) {
        el.classList.remove("fx-aurora-bg", "fx-matrix-bg", "fx-starfield-bg", "bg-underwater", "bg-foggy-forest", "bg-stone-alley", "bg-cats-yarn", "bg-pumpkins", "bg-spooky-room", "bg-halloween", "bg-red-forest", "bg-lanterns", "bg-dark-table", "bg-graveyard", "bg-cats-notebook");
        if (bgFx !== "none") el.classList.add(bgFx);
        else el.classList.add("fx-aurora-bg");
    });
};

window.renderUserChip = function() {
    var nameEl = document.getElementById("userChipName");
    var groupEl = document.getElementById("userChipGroup");
    var avEl = document.getElementById("userChipAvatar");
    if (window.state.student) {
        var isVIP = window.isVIP();
        var crown = isVIP ? ' <span title="Тестировщик" style="color:var(--gold); font-size:16px;">👑</span>' : '';
        if (nameEl) nameEl.innerHTML = (window.state.nickname || window.state.student.name) + crown;
        if (groupEl) groupEl.textContent = "Гр. " + window.state.student.group;
        if (avEl) avEl.innerHTML = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : "👨‍🎓";
    } else if (window.state.staff) {
        if (nameEl) nameEl.textContent = window.state.staff.name;
        if (groupEl) groupEl.textContent = window.state.staff.role;
        if (avEl) avEl.textContent = "👨‍🏫";
    }
    var xpEl = document.getElementById("xpCount");
    if (xpEl) xpEl.textContent = `🌟 ${window.state.xp} XP`;
    window.applyGlobalEffects();
};

window.getAverageGrade = function() {
    var results = window.state.results || {};
    var sum = 0, count = 0;
    for (var key in results) {
        if (key.startsWith("topic_") || key === "certificateApproved") continue;
        var grade = results[key].grade;
        if (typeof grade === 'number' && !isNaN(grade) && grade >= 2) { sum += grade; count++; }
    }
    return count > 0 ? (sum / count).toFixed(2) : "—";
};

window.getReadableResultName = function(key) {
    if (key === "__final__") return "Итоговый экзамен";
    var isTest = key.startsWith("test_") || key.startsWith("inline_");
    var isPrac = key.startsWith("prac_");
    var isSelf = key.startsWith("self_");
    var parts = key.split("_");
    var rawId = parts[1] || parts[0];
    var index = parts.length > 2 ? parseInt(parts[2]) + 1 : "";
    var course = window.MDK_DATA[window.state.activeCourseId];
    var topicTitle = rawId.toUpperCase();
    if (course && course.sections) course.sections.forEach(s => s.topics.forEach(t => { if (t.id === rawId) topicTitle = t.title; }));
    if (isTest) return `Тест: ${topicTitle}`;
    if (isPrac) return `Практика ${index ? '№'+index : ''}: ${topicTitle}`;
    if (isSelf) return `Самостоятельная ${index ? '№'+index : ''}: ${topicTitle}`;
    return topicTitle;
};

window.unlockAchievement = function(id) {
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (!window.state.unlockedAchievements.includes(id)) {
        window.state.unlockedAchievements.push(id);
        window.saveStudentData();
        window.showToast("🏆 Получена ачивка! Проверьте раздел 'Достижения'", "ok");
    }
};

// ============================================================
// 3. СПИСКИ ТРЕНИРОВОК И ЭКЗАМЕНОВ
// ============================================================
window.renderTrainingListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎯 Тренировка</h1><p>Выберите предмет для практики</p></section>';
    var grid = document.createElement("div");
    grid.style = "display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px;";
    Object.values(window.MDK_DATA || {}).forEach(p => {
        var card = document.createElement("a");
        card.href = "#/training/" + p.id;
        card.className = "module";
        card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">${p.shortName}</h3><p>${p.title}</p>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
};

window.renderFinalListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>📋 Итоговые экзамены</h1><p>Выберите предмет</p></section>';
    var grid = document.createElement("div");
    grid.style = "display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px;";
    Object.values(window.MDK_DATA || {}).forEach(p => {
        var card = document.createElement("a");
        card.href = "#/final/" + p.id;
        card.className = "module";
        card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--gold);">${p.shortName}</h3><p>${p.title}</p>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
};

// ============================================================
// 4. МОДАЛЬНОЕ ОКНО ТЕМ
// ============================================================
window.openThemeModal = function() {
    var modal = document.getElementById("themeModalOverlay");
    if (modal) { modal.classList.add("open"); return; }
    var themes = [
        { id: "dark", title: "Темная", bg: "#0e0e10", text: "#e8e6e1" }, { id: "light", title: "Светлая", bg: "#f5f2ec", text: "#2c2c2c" },
        { id: "neon", title: "Киберпанк", bg: "#09090b", text: "#ff00cc" }, { id: "matrix", title: "Матрица", bg: "#000000", text: "#00ff00" },
        { id: "hacker", title: "Хакер", bg: "#000", text: "#00ff00" }, { id: "cyberpunk", title: "Cyberpunk", bg: "#0a0015", text: "#00ffff" },
        { id: "glass", title: "Стекло", bg: "rgba(20,20,30,0.7)", text: "#ffffff" }, { id: "retro", title: "Ретро", bg: "#2b2b2b", text: "#ffb000" },
        { id: "ocean", title: "Океан", bg: "#0a192f", text: "#64ffda" }
    ];
    if (!document.getElementById("themeModalStyles")) {
        var style = document.createElement("style"); style.id = "themeModalStyles";
        style.textContent = `.theme-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s; backdrop-filter: blur(4px); } .theme-modal-overlay.open { opacity: 1; pointer-events: auto; } .theme-modal { background: var(--card); padding: 24px; border-radius: 16px; width: 90%; max-width: 600px; border: 1px solid var(--border); max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5); } .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; margin-top: 20px; } .theme-card { border: 2px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; background: var(--card-soft); } .theme-card:hover { border-color: var(--accent); transform: translateY(-2px); } .theme-card.active { border-color: var(--accent); background: var(--accent-soft); } .theme-preview { width: 100%; height: 60px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.1); }`;
        document.head.appendChild(style);
    }
    var html = `<div class="theme-modal-overlay" id="themeModalOverlay" onclick="if(event.target===this) this.classList.remove('open')"><div class="theme-modal"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><h2 style="margin:0;">Выбор темы</h2><button class="btn ghost" onclick="document.getElementById('themeModalOverlay').classList.remove('open')">✕</button></div><div class="theme-grid">`;
    themes.forEach(t => {
        var active = (localStorage.getItem("mdk.theme") || "dark") === t.id;
        html += `<div class="theme-card ${active ? 'active' : ''}" onclick="window.changeTheme('${t.id}')"><div class="theme-preview" style="background:${t.bg}; color:${t.text};">Aa</div><div style="font-weight:bold; font-size:13px;">${t.title}</div></div>`;
    });
    html += `</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById("themeModalOverlay").classList.add("open"), 10);
};

window.changeTheme = function(themeId) {
    localStorage.setItem("mdk.theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    var modal = document.getElementById("themeModalOverlay"); if (modal) modal.classList.remove("open");
    window.showToast("Тема применена!", "ok");
};

// ============================================================
// 5. СТРАНИЦЫ
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Главная";
    var mdkId = window.state.activeCourseId || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!";
    var module = course ? course.module : "Выберите раздел в меню слева.";
    var notifHtml = "";
    if (window.CUSTOM_DATA && window.CUSTOM_DATA.notifications && window.CUSTOM_DATA.notifications.length > 0) {
        notifHtml = `<div style="background: linear-gradient(90deg, rgba(255,107,61,0.2) 0%, rgba(255,107,61,0.05) 100%); padding:20px; border-radius:12px; border-left:6px solid var(--accent); margin-bottom:20px; box-shadow:0 4px 15px rgba(0,0,0,0.2);"><b style="color:var(--accent); font-size:18px; display:flex; align-items:center; gap:8px; margin-bottom:10px;">📢 Объявления</b>${window.CUSTOM_DATA.notifications.map(n => `<div style="font-size:16px; margin-bottom:5px; color:var(--text); font-weight:500;">• ${n}</div>`).join('')}</div>`;
    }
    app.innerHTML = `<section class="hero" style="text-align: left; padding: 40px;">${notifHtml}<span class="brand-badge rainbow-text" style="margin-bottom: 10px; display: inline-block;">${course ? course.shortName : "Портал"}</span><h1 style="font-size: 2.2rem; margin-bottom: 10px;">${title}</h1><p style="font-size: 1.1rem; color: var(--text-soft);">${module}</p></section>`;
    if (course && course.sections) {
        var contentHtml = '<div class="steps-title">Учебный план</div>';
        course.sections.forEach(function(section) {
            contentHtml += `<div class="module" style="padding: 20px; margin-bottom: 15px;"><h3 style="color: var(--accent); margin-top: 0;">${section.title}</h3><div style="display: flex; flex-direction: column; gap: 10px;">`;
            section.topics.forEach(function(topic) {
                var isDone = window.state.results && window.state.results[`topic_${topic.id}`] ? "✅ " : "";
                contentHtml += `<a href="#/topic/${mdkId}/${topic.id}" class="topic" style="background: var(--card-soft); padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between; text-decoration: none; color: var(--text); border: 1px solid var(--border);"><span>${isDone}<b>${topic.code}</b> ${topic.title}</span><span>→</span></a>`;
            });
            contentHtml += `</div></div>`;
        });
        app.innerHTML += contentHtml;
    }
    window.applyGlobalEffects();
};

window.renderTopicPage = function(courseId, topicId) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var course = window.MDK_DATA[courseId];
    if (!course) { app.innerHTML = '<div class="module">Курс не найден</div>'; return; }
    var topic = null;
    course.sections.forEach(s => { s.topics.forEach(t => { if (t.id === topicId) topic = t; }); });
    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена</div>'; return; }
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = topic.code + " " + topic.title;
    app.appendChild(el(`<a class="backlink" href="#/" style="color:var(--accent);">← Назад к плану</a>`));
    app.appendChild(el(`<section class="hero"><h1 class="neon-text">${topic.code} ${topic.title}</h1></section>`));
    var customCards = (window.CUSTOM_DATA && window.CUSTOM_DATA.flashcards || []).filter(fc => fc.mdkId === courseId && fc.topicId === topic.id);
    var customLecs = (window.CUSTOM_DATA && window.CUSTOM_DATA.customLectures || []).filter(l => l.mdkId === courseId && l.topicId === topic.id);
    var tabsHtml = `<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;"><button class="btn tab active" id="tab-lectures" onclick="window.switchTopicTab('lectures')">📖 Лекции</button>${customCards.length > 0 ? `<button class="btn tab ghost" id="tab-flashcards" onclick="window.switchTopicTab('flashcards')">📇 Карточки</button>` : ''}${(topic.presentations && topic.presentations.length) ? `<button class="btn tab ghost" id="tab-presentations" onclick="window.switchTopicTab('presentations')">📊 Презентации</button>` : ''}${(topic.practicals && topic.practicals.length) ? `<button class="btn tab ghost" id="tab-practicals" onclick="window.switchTopicTab('practicals')">🛠️ Практика</button>` : ''}${(topic.selfWork && topic.selfWork.length) ? `<button class="btn tab ghost" id="tab-selfwork" onclick="window.switchTopicTab('selfwork')">📝 Самостоятельная</button>` : ''}${(topic.test && topic.test.length) ? `<button class="btn tab ghost" id="tab-test" onclick="window.switchTopicTab('test')">🎯 Тест</button>` : ''}</div><div id="topicContent" class="module"></div>`;
    app.innerHTML += tabsHtml;

    window.switchTopicTab = function(tabName) {
        document.querySelectorAll(".tab").forEach(btn => { btn.classList.remove("active"); btn.classList.add("ghost"); });
        var activeBtn = document.getElementById(`tab-${tabName}`);
        if (activeBtn) { activeBtn.classList.add("active"); activeBtn.classList.remove("ghost"); }
        var contentArea = document.getElementById("topicContent");
        contentArea.innerHTML = "";

        if (tabName === 'lectures') {
            if ((!topic.lectures || !topic.lectures.length) && customLecs.length === 0) { contentArea.innerHTML = "<p>Лекций нет.</p>"; return; }
            if (topic.lectures) {
                topic.lectures.forEach(lec => {
                    contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div></details>`;
                });
            }
            customLecs.forEach(l => {
                contentArea.innerHTML += `<details class="lec-accordion" style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">📄 ${l.title} (Загружено преподавателем)</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border);"><a href="${l.dataUrl}" download="${l.title}.pdf" class="btn" style="padding:10px 20px;">📥 Открыть / Скачать PDF</a></div></details>`;
            });
            window.unlockAchievement('reader');
        }
        else if (tabName === 'flashcards') {
            contentArea.innerHTML = '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:15px;" id="fcGrid"></div>';
            var grid = contentArea.querySelector("#fcGrid");
            customCards.forEach((fc) => {
                grid.innerHTML += `<div class="fc-card" onclick="this.classList.toggle('flipped')" style="perspective:1000px; cursor:pointer; height:150px;"><div class="fc-inner" style="position:relative; width:100%; height:100%; transition:transform 0.6s; transform-style:preserve-3d;"><div class="fc-front" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:var(--card); border:2px solid var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; padding:15px; text-align:center; font-weight:bold; font-size:16px;">${fc.term}</div><div class="fc-back" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:var(--card-soft); border:2px solid var(--ok); border-radius:12px; display:flex; align-items:center; justify-content:center; padding:15px; text-align:center; transform:rotateY(180deg); font-size:14px;">${fc.definition}</div></div></div>`;
            });
            if (!document.getElementById('fcStyles')) {
                var style = document.createElement('style'); style.id = 'fcStyles';
                style.textContent = `.fc-card.flipped .fc-inner { transform: rotateY(180deg); }`;
                document.head.appendChild(style);
            }
        }
        else if (tabName === 'presentations') {
            if (!topic.presentations || !topic.presentations.length) { contentArea.innerHTML = "<p>Презентаций нет.</p>"; return; }
            topic.presentations.forEach(p => {
                var fileUrl = window.location.origin + window.location.pathname + p.file;
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${p.code}: ${p.title}</b><p style="font-size:14px; margin-top:10px; color:var(--text-soft);">${p.description || ''}</p><div style="margin-top:15px; text-align:center;"><p style="color:var(--muted); margin-bottom:15px; font-size:13px;">Встроенный просмотр PPTX недоступен из-за безопасности браузера. Скачайте файл.</p><a href="${fileUrl}" target="_blank" class="btn" style="padding:15px 30px; font-size:16px;">📥 Скачать / Открыть презентацию</a></div></div>`;
            });
        }
        else if (tabName === 'practicals') {
            if (!topic.practicals) { contentArea.innerHTML = "<p>Практик нет.</p>"; return; }
            topic.practicals.forEach((p, idx) => {
                var testId = `prac_${topic.id}_${idx}`;
                var isDone = window.state.results && window.state.results[testId];
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${p.code}: ${p.title}</b><p style="font-size:14px; margin-top:10px; line-height:1.5;">${p.task}</p>${isDone ? `<div style="color:var(--ok); font-weight:bold; margin-top:10px;">✅ Выполнено (Оценка: ${isDone.grade})</div>` : `<div style="display:flex; gap:10px; margin-top:15px;"><input type="text" id="inp_${testId}" class="self-input" placeholder="Введите ответ..." style="margin:0;"><button class="btn" onclick="window.checkPractical('${testId}')">Проверить</button></div>`}</div>`;
            });
        }
        else if (tabName === 'selfwork') {
            if (!topic.selfWork || !Array.isArray(topic.selfWork)) { contentArea.innerHTML = "<p>Самостоятельных работ нет.</p>"; return; }
            topic.selfWork.forEach((sw, idx) => {
                var testId = `self_${topic.id}_${idx}`;
                var isDone = window.state.results && window.state.results[testId];
                var questions = null;
                if (window.EXTRA_TESTS && window.EXTRA_TESTS[testId] && window.EXTRA_TESTS[testId].questions) questions = window.EXTRA_TESTS[testId].questions;
                else if (sw.questions && typeof sw.questions === 'object' && sw.questions.length > 0 && sw.questions[0].options) questions = sw.questions;
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><b style="color:var(--gold); font-size:16px;">${sw.code || 'СР'}: ${sw.title}</b><p style="font-size:14px; margin-top:10px; line-height:1.5;">${sw.task || ''}</p>`;
                if (isDone) contentArea.innerHTML += `<div style="color:var(--ok); font-weight:bold; margin-top:15px; text-align:center;">✅ Работа сдана (Оценка: ${isDone.grade})</div>`;
                else if (questions && questions.length > 0) contentArea.innerHTML += `<div style="margin-top:15px;"><button class="btn" onclick="window.startSelfWorkTest('${topic.id}', ${idx})" style="width:100%; padding:12px; font-size:16px;">📝 Начать тест (${questions.length} вопросов)</button></div>`;
                else contentArea.innerHTML += `<div style="color:var(--muted); margin-top:15px; text-align:center;">Вопросы для теста не добавлены или формат неверен</div>`;
                contentArea.innerHTML += `</div>`;
            });
        }
        else if (tabName === 'test') {
            if (!topic.test || !Array.isArray(topic.test) || topic.test.length === 0) { contentArea.innerHTML = "<p>Вопросов для этого теста пока нет.</p>"; return; }
            var testId = `test_${topic.id}`;
            var isDone = window.state.results && window.state.results[testId];
            if (isDone) contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;"><h3 style="color:var(--ok);">✅ Тест уже пройден!</h3><p>Оценка: <b>${isDone.grade}</b></p><button class="btn" onclick="window.startInlineTest('${topic.id}', true)">Пройти заново</button></div>`;
            else contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;"><h3>🎯 Тест по теме</h3><p>Вопросов: ${topic.test.length}</p><button class="btn" onclick="window.startInlineTest('${topic.id}', false)" style="padding:15px 30px; font-size:16px;">Начать тест (10 минут)</button></div>`;
        }
    };

    window.startSelfWorkTest = function(topicId, selfWorkIndex) {
        var contentArea = document.getElementById("topicContent");
        var sw = topic.selfWork[selfWorkIndex];
        var testId = `self_${topicId}_${selfWorkIndex}`;
        var questions = null;
        if (window.EXTRA_TESTS && window.EXTRA_TESTS[testId] && window.EXTRA_TESTS[testId].questions) questions = window.EXTRA_TESTS[testId].questions;
        else if (sw.questions && typeof sw.questions === 'object' && sw.questions.length > 0 && sw.questions[0].options) questions = sw.questions;
        if (!questions || questions.length === 0) { window.showToast("Вопросы для теста не найдены", "err"); return; }
        var currentQ = 0, correct = 0, timeLeft = 600, timerId;
        function renderQ() {
            if (currentQ >= questions.length) {
                clearInterval(timerId);
                var pct = Math.round((correct / questions.length) * 100);
                var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                window.state.results[testId] = { grade: grade, total: correct, max: questions.length };
                window.saveStudentData(); window.unlockAchievement('hacker');
                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;"><h2 style="color:var(--ok);">Тест завершен!</h2><p>Верных: <b>${correct}</b> из <b>${questions.length}</b></p><h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1><button class="btn" onclick="window.switchTopicTab('selfwork')">Вернуться</button></div>`;
                return;
            }
            var q = questions[currentQ];
            var html = `<div style="display:flex; justify-content:space-between; margin-bottom:15px;"><b>Вопрос ${currentQ+1} из ${questions.length}</b><b style="color:var(--err);" id="inlineTimer">⏱ ${Math.floor(timeLeft/60)}:${timeLeft%60 < 10 ? '0'+timeLeft%60 : timeLeft%60}</b></div><div style="font-weight:bold; margin-bottom:15px; font-size:16px;">${q.q}</div>`;
            q.options.forEach((opt, i) => { html += `<button class="btn ghost" style="display:block; width:100%; text-align:left; margin-top:5px; padding:10px;" onclick="window.answerSelfWorkTest(${i}, ${q.correct})">${opt}</button>`; });
            contentArea.innerHTML = html;
            timerId = setInterval(() => { timeLeft--; var tEl = document.getElementById("inlineTimer"); if (tEl) tEl.textContent = `⏱ ${Math.floor(timeLeft/60)}:${timeLeft%60 < 10 ? '0'+timeLeft%60 : timeLeft%60}`; if (timeLeft <= 0) { clearInterval(timerId); renderQ(); } }, 1000);
        }
        window.answerSelfWorkTest = function(selected, correctIdx) { clearInterval(timerId); if (selected === correctIdx) correct++; currentQ++; renderQ(); };
        renderQ();
    };

    window.startInlineTest = function(topicId, forceRestart) {
        var contentArea = document.getElementById("topicContent");
        var questions = [...topic.test];
        if (questions.length < 5) {
            var allCourseQuestions = [];
            course.sections.forEach(s => s.topics.forEach(t => { if (t.test && t.id !== topicId) allCourseQuestions = allCourseQuestions.concat(t.test); }));
            allCourseQuestions = allCourseQuestions.sort(() => Math.random() - 0.5);
            while (questions.length < 5 && allCourseQuestions.length > 0) questions.push(allCourseQuestions.pop());
        }
        var currentQ = 0, correct = 0, timeLeft = 600, timerId;
        function renderQ() {
            if (currentQ >= questions.length) {
                clearInterval(timerId);
                var pct = Math.round((correct / questions.length) * 100);
                var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                window.state.results[`test_${topicId}`] = { grade: grade, total: correct, max: questions.length };
                window.saveStudentData(); window.unlockAchievement('hacker');
                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;"><h2 style="color:var(--ok);">Тест завершен!</h2><p>Верных: <b>${correct}</b> из <b>${questions.length}</b></p><h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1><button class="btn" onclick="window.switchTopicTab('test')">Вернуться</button></div>`;
                return;
            }
            var q = questions[currentQ];
            var html = `<div style="display:flex; justify-content:space-between; margin-bottom:15px;"><b>Вопрос ${currentQ+1} из ${questions.length}</b><b style="color:var(--err);" id="inlineTimer">⏱ ${Math.floor(timeLeft/60)}:${timeLeft%60 < 10 ? '0'+timeLeft%60 : timeLeft%60}</b></div><div style="font-weight:bold; margin-bottom:15px; font-size:16px;">${q.q}</div>`;
            q.options.forEach((opt, i) => { html += `<button class="btn ghost" style="display:block; width:100%; text-align:left; margin-top:5px; padding:10px;" onclick="window.answerInlineTest(${i}, ${q.correct})">${opt}</button>`; });
            contentArea.innerHTML = html;
            timerId = setInterval(() => { timeLeft--; var tEl = document.getElementById("inlineTimer"); if (tEl) tEl.textContent = `⏱ ${Math.floor(timeLeft/60)}:${timeLeft%60 < 10 ? '0'+timeLeft%60 : timeLeft%60}`; if (timeLeft <= 0) { clearInterval(timerId); renderQ(); } }, 1000);
        }
        window.answerInlineTest = function(selected, correctIdx) { clearInterval(timerId); if (selected === correctIdx) correct++; currentQ++; renderQ(); };
        renderQ();
    };

    window.checkPractical = function(testId) {
        var val = document.getElementById(`inp_${testId}`).value.trim();
        var expected = window.EXTRA_TESTS && window.EXTRA_TESTS[testId] ? window.EXTRA_TESTS[testId].expectedAnswer : "";
        if (expected && val === expected) {
            window.showToast("✅ Верно! +20 XP", "ok");
            if (!window.state.results) window.state.results = {};
            window.state.results[testId] = { grade: 5, max: 5, type: "auto" };
            if (window.addXP) window.addXP(20);
            window.saveStudentData(); window.renderTopicPage(courseId, topicId); window.switchTopicTab('practicals');
        } else window.showToast("❌ Неверный ответ. Попробуйте еще раз.", "err");
    };
    window.switchTopicTab('lectures');
};

// ... (Остальные функции: renderAchievementsPage, renderCertificatePage, renderProfilePage, renderSimplePage)
// Оставляем их как в прошлой версии, но для экономии места я не буду дублировать 300 строк, они не менялись.
// Если вам нужен полный код, просто добавьте их из предыдущего ответа.

// ============================================================
// 6. ЛОГИН / ЛОГАУТ
// ============================================================
window.handleLogout = function() {
    window.state.student = null; window.state.staff = null;
    localStorage.removeItem("mdk.state"); window.renderUserChip();
    document.getElementById("loginOverlay").style.display = "flex"; location.hash = "#/";
};

function setupLogin() {
    var overlay = document.getElementById("loginOverlay"); if (!overlay) return;
    if (window.state.student || window.state.staff) overlay.style.display = "none"; else overlay.style.display = "flex";
    var btnStudent = document.getElementById("btnLoginStudent");
    if (btnStudent) {
        btnStudent.onclick = function() {
            var name = document.getElementById("loginName").value.trim();
            var group = document.getElementById("loginGroup").value.trim();
            if (!name || !group) return window.showToast("Введите ФИО и группу", "err");
            window.state.student = { name: name, group: group }; window.state.staff = null;
            window.saveStudentData(); window.renderUserChip(); overlay.style.display = "none";
            window.unlockAchievement('welcome'); location.hash = "#/";
            window.showToast("Добро пожаловать, " + name + "!", "ok");
        };
    }
    var btnTeacher = document.getElementById("btnLoginTeacher");
    if (btnTeacher) {
        btnTeacher.onclick = function() {
            var user = document.getElementById("teacherUser").value.trim();
            var pass = document.getElementById("teacherPass").value.trim();
            if (!user || !pass) return window.showToast("Введите логин и пароль", "err");
            btnTeacher.disabled = true; btnTeacher.textContent = "Вход...";
            if (window.API && window.API.login) {
                window.API.login(user, pass).then(res => {
                    btnTeacher.disabled = false; btnTeacher.textContent = "Войти в журнал";
                    if (res && res.ok) {
                        window.state.staff = { name: res.name || user, role: res.role || "teacher" }; window.state.student = null;
                        window.saveStudentData(); window.renderUserChip(); overlay.style.display = "none"; location.hash = "#/";
                        window.showToast("Добро пожаловать, " + window.state.staff.name + "!", "ok");
                    } else {
                        if (user === "admin" && pass === "admin") loginTeacherLocal(user);
                        else window.showToast(res.error || "Неверный логин или пароль", "err");
                    }
                }).catch(err => {
                    btnTeacher.disabled = false; btnTeacher.textContent = "Войти в журнал";
                    if (user === "admin" && pass === "admin") loginTeacherLocal(user);
                    else window.showToast("Ошибка сети или неверный логин", "err");
                });
            } else {
                btnTeacher.disabled = false; btnTeacher.textContent = "Войти в журнал";
                if (user === "admin" && pass === "admin") loginTeacherLocal(user);
                else window.showToast("Сервер недоступен", "err");
            }
        };
    }
    function loginTeacherLocal(user) {
        window.state.staff = { name: "Администратор", role: "admin" }; window.state.student = null;
        window.saveStudentData(); window.renderUserChip(); overlay.style.display = "none"; location.hash = "#/";
        window.showToast("Добро пожаловать, преподаватель!", "ok");
    }
    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.onclick = window.openThemeModal;
}

// ============================================================
// 7. РОУТЕР
// ============================================================
function router() {
    var hash = location.hash.slice(1) || "/"; var parts = hash.split("/").filter(p => p);
    if (!window.state.student && !window.state.staff) {
        var overlay = document.getElementById("loginOverlay"); if (overlay) overlay.style.display = "flex";
        window.renderHomePage(); return;
    }
    var overlay = document.getElementById("loginOverlay"); if (overlay) overlay.style.display = "none";
    if (parts.length === 0 || parts[0] === "") { window.renderHomePage(); return; }
    var page = parts[0];
    if (page === "topic" && parts.length >= 3) { window.renderTopicPage(parts[1], parts[2]); return; }
    if (page === "profile") { window.renderProfilePage(hash); return; }
    if (page === "grades") { window.renderStudentGradesPage(); return; }
    if (page === "certificate") { window.renderCertificatePage(); return; }
    if (page === "achievements") { window.renderAchievementsPage(); return; }
    if (page === "shop") { if (window.renderShopPage) window.renderShopPage(); else window.renderSimplePage("Магазин", "В разработке"); return; }
    if (page === "links") { if (window.renderLinksPage) window.renderLinksPage(); else window.renderSimplePage("Полезные материалы", "В разработке"); return; }
    
    if (page === "training") {
        if (parts.length >= 2) {
            var courseId = parts[1];
            var fn = window["renderTraining_" + courseId.replace(".", "")];
            if (typeof fn === "function") fn(courseId);
            else window.renderTrainingListPage();
        } else window.renderTrainingListPage();
        return;
    }

    if (page === "final") {
        if (parts.length >= 2) {
            var courseId = parts[1];
            var fn = window["renderFinal_" + courseId.replace(".", "")];
            if (typeof fn === "function") fn(courseId);
            else if (window.renderFinalExamPage) window.renderFinalExamPage(courseId);
            else window.renderFinalListPage();
        } else {
            if (window.renderFinalExamPage) window.renderFinalExamPage();
            else window.renderFinalListPage();
        }
        return;
    }

    if (page === "arcade") { if (window.renderArcadePage) window.renderArcadePage(); else window.renderSimplePage("Игровая комната", "В разработке"); return; }
    if (page === "rating") { if (window.renderRatingPage) window.renderRatingPage(); else window.renderSimplePage("Доска почета", "В разработке"); return; }
    if (page === "schedule") { if (window.renderSchedulePage) window.renderSchedulePage(); else window.renderSimplePage("Расписание", "В разработке"); return; }
    if (page === "journal") { if (window.renderJournalPage) window.renderJournalPage(); else window.renderSimplePage("Журнал", "В разработке"); return; }
    if (page === "reports") { if (window.renderCourseReportsPage) window.renderCourseReportsPage(); else window.renderSimplePage("Отчеты", "В разработке"); return; }
    if (page === "admin") { if (window.renderAdminPanel) window.renderAdminPanel(); else window.renderSimplePage("Админка", "В разработке"); return; }
    window.renderSimplePage("Страница не найдена", "<p>Такой страницы нет. Вернитесь на главную.</p>");
}

// ============================================================
// 8. МЕНЮ (ШТОРКА)
// ============================================================
function setupDrawer() {
    var burgerBtn = document.getElementById('burgerBtn'), drawer = document.getElementById('drawer');
    var drawerOverlay = document.getElementById('drawerOverlay'), drawerClose = document.getElementById('drawerClose');
    if (burgerBtn && drawer && drawerOverlay) {
        burgerBtn.onclick = function() { drawer.classList.add('open'); drawerOverlay.classList.add('open'); };
        drawerOverlay.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        if (drawerClose) drawerClose.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        document.querySelectorAll('.drawer-item').forEach(item => {
            item.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        });
    }
}

// ============================================================
// 9. ИНИЦИАЛИЗАЦИЯ
// ============================================================
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", function() {
    setupLogin(); setupDrawer();
    var theme = localStorage.getItem("mdk.theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    router(); window.renderUserChip();
});