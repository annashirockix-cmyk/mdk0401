"use strict";

// ============================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, signature: null, purchasedThemes: [], purchasedFonts: [], font: "default", certBg: "bg1", examSubmissions: [],
    unlockedAchievements: []
};

try {
    var savedState = localStorage.getItem("mdk.state");
    if (savedState) { Object.assign(window.state, JSON.parse(savedState)); }
} catch(e) {}

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
            window.API.saveStudent(window.studentKey(), window.state.student.name, window.state.student.group, JSON.stringify(window.state));
        }
    } catch(e) { console.warn("Ошибка синхронизации", e); }
};

window.studentKey = function() {
    if (!window.state.student) return "";
    return (window.state.student.name || "").trim().toLowerCase() + "|" + (window.state.student.group || "").trim().toLowerCase();
};

window.getLevel = function(xp) { return Math.floor((xp || 0) / 100) + 1; };
window.getLevelTitle = function(lvl) {
    if (lvl < 3) return "Новичок"; if (lvl < 5) return "Ученик"; if (lvl < 8) return "Практикант"; if (lvl < 12) return "Мастер"; return "Эксперт";
};

window.$ = window.$ || function(id) { return document.getElementById(id); };
window.el = window.el || function(html) { var div = document.createElement("div"); div.innerHTML = html.trim(); return div.firstChild; };
window.escapeHtml = window.escapeHtml || function(text) { if (!text) return ""; return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
window.showToast = window.showToast || function(msg, type) {
    var container = document.querySelector(".toast-container");
    if (!container) { container = document.createElement("div"); container.className = "toast-container"; document.body.appendChild(container); }
    var t = document.createElement("div"); t.className = "toast " + (type || ""); t.textContent = msg;
    container.appendChild(t); setTimeout(function() { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
};

// Внедряем радужный текст для логотипа
window.applyRainbowLogo = function() {
    var logo = document.querySelector(".brand-badge");
    if (logo) {
        logo.style.background = "linear-gradient(270deg, red, orange, yellow, green, cyan, blue, violet)";
        logo.style.backgroundSize = "1400% 1400%";
        logo.style.webkitBackgroundClip = "text";
        logo.style.webkitTextFillColor = "transparent";
        logo.style.animation = "rainbowMove 10s linear infinite";
        
        if (!document.getElementById("rainbowStyle")) {
            var style = document.createElement("style");
            style.id = "rainbowStyle";
            style.textContent = `@keyframes rainbowMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }`;
            document.head.appendChild(style);
        }
    }
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
        if (avEl) { avEl.innerHTML = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : "👨‍🎓"; }
    } else if (window.state.staff) {
        if (nameEl) nameEl.textContent = window.state.staff.name;
        if (groupEl) groupEl.textContent = window.state.staff.role;
        if (avEl) avEl.textContent = "👨‍🏫";
    }
    var xpEl = document.getElementById("xpCount");
    if (xpEl) xpEl.textContent = `🌟 ${window.state.xp} XP`;
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

window.unlockAchievement = function(id) {
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (!window.state.unlockedAchievements.includes(id)) {
        window.state.unlockedAchievements.push(id);
        window.saveStudentData();
        window.showToast("🏆 Получена ачивка! Проверьте раздел 'Достижения'", "ok");
    }
};

// ============================================================
// МОДАЛЬНОЕ ОКНО ТЕМ
// ============================================================
window.openThemeModal = function() {
    var modal = document.getElementById("themeModalOverlay");
    if (modal) { modal.classList.add("open"); return; }
    
    var themes = [
        { id: "dark", title: "Темная", bg: "#0e0e10", text: "#e8e6e1" },
        { id: "light", title: "Светлая", bg: "#f5f2ec", text: "#2c2c2c" },
        { id: "neon", title: "Киберпанк", bg: "#09090b", text: "#ff00cc" },
        { id: "matrix", title: "Матрица", bg: "#000000", text: "#00ff00" },
        { id: "hacker", title: "Хакер", bg: "#000", text: "#00ff00" },
        { id: "cyberpunk", title: "Cyberpunk", bg: "#0a0015", text: "#00ffff" }
    ];

    if (!document.getElementById("themeModalStyles")) {
        var style = document.createElement("style");
        style.id = "themeModalStyles";
        style.textContent = `
            .theme-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s; backdrop-filter: blur(4px); }
            .theme-modal-overlay.open { opacity: 1; pointer-events: auto; }
            .theme-modal { background: var(--card); padding: 24px; border-radius: 16px; width: 90%; max-width: 600px; border: 1px solid var(--border); max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
            .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; margin-top: 20px; }
            .theme-card { border: 2px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; background: var(--card-soft); }
            .theme-card:hover { border-color: var(--accent); transform: translateY(-2px); }
            .theme-card.active { border-color: var(--accent); background: var(--accent-soft); }
            .theme-preview { width: 100%; height: 60px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.1); }
        `;
        document.head.appendChild(style);
    }

    var html = `<div class="theme-modal-overlay" id="themeModalOverlay" onclick="if(event.target===this) this.classList.remove('open')">
        <div class="theme-modal">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h2 style="margin:0;">Выбор темы</h2>
                <button class="btn ghost" onclick="document.getElementById('themeModalOverlay').classList.remove('open')">✕</button>
            </div>
            <div class="theme-grid">`;
    
    themes.forEach(t => {
        var active = (localStorage.getItem("mdk.theme") || "dark") === t.id;
        html += `<div class="theme-card ${active ? 'active' : ''}" onclick="window.changeTheme('${t.id}')">
            <div class="theme-preview" style="background:${t.bg}; color:${t.text};">Aa</div>
            <div style="font-weight:bold; font-size:13px;">${t.title}</div>
        </div>`;
    });
    html += `</div></div></div>`;
    
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById("themeModalOverlay").classList.add("open"), 10);
};

window.changeTheme = function(themeId) {
    localStorage.setItem("mdk.theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    var modal = document.getElementById("themeModalOverlay");
    if(modal) modal.classList.remove("open");
    window.showToast("Тема применена!", "ok");
};

// ============================================================
// ГЛАВНАЯ И ЛЕКЦИИ
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Главная";
    var mdkId = window.state.activeCourseId || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!";
    var module = course ? course.module : "Выберите раздел в меню слева.";

    var notifHtml = "";
    if (window.CUSTOM_DATA && window.CUSTOM_DATA.notifications && window.CUSTOM_DATA.notifications.length > 0) {
        notifHtml = `<div style="background: linear-gradient(90deg, rgba(255,107,61,0.2) 0%, rgba(255,107,61,0.05) 100%); padding:20px; border-radius:12px; border-left:6px solid var(--accent); margin-bottom:20px; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
            <b style="color:var(--accent); font-size:18px; display:flex; align-items:center; gap:8px; margin-bottom:10px;">📢 Объявления</b>
            ${window.CUSTOM_DATA.notifications.map(n => `<div style="font-size:16px; margin-bottom:5px; color:var(--text); font-weight:500;">• ${n}</div>`).join('')}
        </div>`;
    }

    app.innerHTML = `<section class="hero" style="text-align: left; padding: 40px;">
        ${notifHtml}
        <span class="brand-badge" style="margin-bottom: 10px; display: inline-block;">${course ? course.shortName : "Портал"}</span>
        <h1 style="font-size: 2.2rem; margin-bottom: 10px;">${title}</h1>
        <p style="font-size: 1.1rem; color: var(--muted);">${module}</p>
    </section>`;

    if (course && course.sections) {
        var contentHtml = '<div class="steps-title">Учебный план</div>';
        
        course.sections.forEach(function(section) {
            contentHtml += `<div class="module" style="padding: 20px; margin-bottom: 15px;">
                <h3 style="color: var(--accent); margin-top: 0;">${section.title}</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">`;
            section.topics.forEach(function(topic) {
                var isDone = window.state.results && window.state.results[`topic_${topic.id}`] ? "✅ " : "";
                contentHtml += `<a href="#/topic/${mdkId}/${topic.id}" class="topic" style="background: var(--card-soft); padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between; text-decoration: none; color: var(--text);">
                    <span>${isDone}<b>${topic.code}</b> ${topic.title}</span><span>→</span>
                </a>`;
            });
            contentHtml += `</div></div>`;
        });
        app.innerHTML += contentHtml;
    }
};

window.renderTopicPage = function(courseId, topicId) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var course = window.MDK_DATA[courseId];
    if (!course) { app.innerHTML = '<div class="module">Курс не найден</div>'; return; }
    var topic = null;
    course.sections.forEach(s => { s.topics.forEach(t => { if (t.id === topicId) topic = t; }); });
    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена</div>'; return; }

    document.getElementById("crumbs").textContent = topic.code + " " + topic.title;
    app.appendChild(el(`<a class="backlink" href="#/" style="color:var(--accent);">← Назад к плану</a>`));
    app.appendChild(el(`<section class="hero"><h1>${topic.code} ${topic.title}</h1></section>`));

    var tabsHtml = `<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
        <button class="btn tab active" id="tab-lectures" onclick="window.switchTopicTab('lectures')">📖 Лекции</button>
        ${(topic.practicals && topic.practicals.length) ? `<button class="btn tab ghost" id="tab-practicals" onclick="window.switchTopicTab('practicals')">🛠️ Практика</button>` : ''}
        ${(topic.selfWork && topic.selfWork.length) ? `<button class="btn tab ghost" id="tab-selfwork" onclick="window.switchTopicTab('selfwork')">📝 Самостоятельная</button>` : ''}
        ${(topic.test && topic.test.length) ? `<button class="btn tab ghost" id="tab-test" onclick="window.switchTopicTab('test')">🎯 Тест</button>` : ''}
    </div>
    <div id="topicContent" class="module"></div>`;
    app.innerHTML += tabsHtml;

    window.switchTopicTab = function(tabName) {
        document.querySelectorAll(".tab").forEach(btn => { btn.classList.remove("active"); btn.classList.add("ghost"); });
        var activeBtn = document.getElementById(`tab-${tabName}`);
        if (activeBtn) { activeBtn.classList.add("active"); activeBtn.classList.remove("ghost"); }
        
        var contentArea = document.getElementById("topicContent");
        contentArea.innerHTML = "";

        if (tabName === 'lectures') {
            if (!topic.lectures || !topic.lectures.length) { contentArea.innerHTML = "<p>Лекций нет.</p>"; return; }
            topic.lectures.forEach(lec => {
                contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;">
                    <summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary>
                    <div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div>
                </details>`;
            });
            window.unlockAchievement('reader');
        } 
        else if (tabName === 'practicals') {
            topic.practicals.forEach((p, idx) => {
                var testId = `prac_${topic.id}_${idx}`;
                var isDone = window.state.results && window.state.results[testId];
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);">
                    <b style="color:var(--accent); font-size:16px;">${p.code}: ${p.title}</b>
                    <p style="font-size:14px; margin-top:10px; line-height:1.5;">${p.task}</p>
                    ${isDone ? `<div style="color:var(--ok); font-weight:bold; margin-top:10px;">✅ Выполнено (Оценка: ${isDone.grade})</div>` : `
                        <div style="display:flex; gap:10px; margin-top:15px;">
                            <input type="text" id="inp_${testId}" class="self-input" placeholder="Введите ответ..." style="margin:0;">
                            <button class="btn" onclick="window.checkPractical('${testId}')">Проверить</button>
                        </div>
                    `}
                </div>`;
            });
        }
        else if (tabName === 'selfwork') {
            topic.selfWork.forEach((sw, idx) => {
                var testId = `self_${topic.id}_${idx}`;
                var isDone = window.state.results && window.state.results[testId];
                
                // БЕЗОПАСНЫЙ ПАРСИНГ ВОПРОСОВ
                var questions = [];
                if (sw.questions && Array.isArray(sw.questions)) {
                    questions = sw.questions;
                } else if (window.EXTRA_TESTS && window.EXTRA_TESTS[testId] && window.EXTRA_TESTS[testId].questions) {
                    questions = window.EXTRA_TESTS[testId].questions;
                }

                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);">
                    <b style="color:var(--gold); font-size:16px;">${sw.code || 'СР'}: ${sw.title}</b>
                    <p style="font-size:14px; margin-top:10px; line-height:1.5;">${sw.task}</p>`;
                
                if (questions && questions.length > 0) {
                    contentArea.innerHTML += `<div style="margin-top:15px; border-top:1px dashed var(--border); padding-top:15px;"><b>🎯 Проверочный тест:</b></div>`;
                    questions.forEach((q, qi) => {
                        contentArea.innerHTML += `<div style="margin-top:10px; background:var(--card); padding:10px; border-radius:6px;">
                            <div style="font-size:14px; margin-bottom:5px;">${qi+1}. ${q.q || 'Вопрос'}</div>`;
                        if (q.options) {
                            q.options.forEach((opt, oi) => {
                                contentArea.innerHTML += `<label style="display:block; font-size:13px; margin-top:3px; cursor:pointer;"><input type="radio" name="${testId}_q${qi}" value="${oi}"> ${opt}</label>`;
                            });
                        }
                        contentArea.innerHTML += `</div>`;
                    });
                    contentArea.innerHTML += `<button class="btn" style="margin-top:15px; font-size:13px; width:100%;" onclick="window.checkSelfWork('${testId}')">Отправить результаты</button>`;
                } else {
                    contentArea.innerHTML += `<button class="btn" style="margin-top:15px; font-size:13px;" onclick="window.submitSelfWork('${testId}')">Сдать работу (без теста)</button>`;
                }
                
                if (isDone) {
                    contentArea.innerHTML += `<div style="color:var(--ok); font-weight:bold; margin-top:15px; text-align:center;">✅ Работа сдана (Оценка: ${isDone.grade})</div>`;
                }
                contentArea.innerHTML += `</div>`;
            });
        }
        else if (tabName === 'test') {
            if (!topic.test || !Array.isArray(topic.test) || topic.test.length === 0) { 
                contentArea.innerHTML = "<p>Вопросов для этого теста пока нет.</p>"; return; 
            }
            var testId = `test_${topic.id}`;
            var isDone = window.state.results && window.state.results[testId];
            
            if (isDone) {
                contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;">
                    <h3 style="color:var(--ok);">✅ Тест уже пройден!</h3>
                    <p>Оценка: <b>${isDone.grade}</b></p>
                    <button class="btn" onclick="window.startInlineTest('${topic.id}', true)">Пройти заново</button>
                </div>`;
            } else {
                contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;">
                    <h3>🎯 Тест по теме</h3>
                    <p>Вопросов: ${topic.test.length}</p>
                    <button class="btn" onclick="window.startInlineTest('${topic.id}', false)" style="padding:15px 30px; font-size:16px;">Начать тест (10 минут)</button>
                </div>`;
            }
        }
    };

    window.startInlineTest = function(topicId, forceRestart) {
        var contentArea = document.getElementById("topicContent");
        var questions = topic.test;
        var currentQ = 0;
        var correct = 0;
        var timeLeft = 600; 
        var timerId;

        function renderQ() {
            if (currentQ >= questions.length) {
                clearInterval(timerId);
                var pct = Math.round((correct / questions.length) * 100);
                var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                
                window.state.results[`test_${topicId}`] = { grade: grade, total: correct, max: questions.length };
                window.saveStudentData();
                window.unlockAchievement('hacker'); 
                
                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;">
                    <h2 style="color:var(--ok);">Тест завершен!</h2>
                    <p>Верных ответов: <b>${correct}</b> из <b>${questions.length}</b></p>
                    <h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1>
                    <button class="btn" onclick="window.switchTopicTab('test')">Вернуться</button>
                </div>`;
                return;
            }

            var q = questions[currentQ];
            var html = `<div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <b>Вопрос ${currentQ+1} из ${questions.length}</b>
                <b style="color:var(--err);" id="inlineTimer">⏱ ${Math.floor(timeLeft/60)}:${timeLeft%60 < 10 ? '0'+timeLeft%60 : timeLeft%60}</b>
            </div>
            <div style="font-weight:bold; margin-bottom:15px; font-size:16px;">${q.q}</div>`;
            
            q.options.forEach((opt, i) => {
                html += `<button class="btn ghost" style="display:block; width:100%; text-align:left; margin-top:5px; padding:10px;" onclick="window.answerInlineTest(${i}, ${q.correct})">${opt}</button>`;
            });
            contentArea.innerHTML = html;
            
            timerId = setInterval(() => {
                timeLeft--;
                var tEl = document.getElementById("inlineTimer");
                if (tEl) tEl.textContent = `⏱ ${Math.floor(timeLeft/60)}:${timeLeft%60 < 10 ? '0'+timeLeft%60 : timeLeft%60}`;
                if (timeLeft <= 0) { clearInterval(timerId); renderQ(); }
            }, 1000);
        }

        window.answerInlineTest = function(selected, correctIdx) {
            clearInterval(timerId);
            if (selected === correctIdx) correct++;
            currentQ++;
            renderQ();
        };

        renderQ();
    };

    window.checkSelfWork = function(testId) {
        window.showToast("✅ Результаты отправлены, +15 XP", "ok");
        if (!window.state.results) window.state.results = {};
        window.state.results[testId] = { grade: 4, max: 5, type: "self_test" };
        if (window.addXP) window.addXP(15);
        window.saveStudentData();
        window.renderTopicPage(courseId, topicId);
        window.switchTopicTab('selfwork');
    };

    window.submitSelfWork = function(testId) {
        window.showToast("Работа отправлена на проверку преподавателю", "ok");
        if (!window.state.results) window.state.results = {};
        window.state.results[testId] = { grade: "?", max: 5, type: "self" };
        window.saveStudentData();
        window.renderTopicPage(courseId, topicId);
        window.switchTopicTab('selfwork');
    };

    window.checkPractical = function(testId) {
        var val = document.getElementById(`inp_${testId}`).value.trim();
        var expected = window.EXTRA_TESTS && window.EXTRA_TESTS[testId] ? window.EXTRA_TESTS[testId].expectedAnswer : "";
        
        if (expected && val === expected) {
            window.showToast("✅ Верно! +20 XP", "ok");
            if (!window.state.results) window.state.results = {};
            window.state.results[testId] = { grade: 5, max: 5, type: "auto" };
            if (window.addXP) window.addXP(20);
            window.saveStudentData();
            window.renderTopicPage(courseId, topicId);
            window.switchTopicTab('practicals');
        } else {
            window.showToast("❌ Неверный ответ. Попробуйте еще раз.", "err");
        }
    };

    window.switchTopicTab('lectures');
};

// ============================================================
// СЕРТИФИКАТ, ПРОФИЛЬ, ДОСТИЖЕНИЯ
// ============================================================
window.renderAchievementsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Достижения";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    var isVIP = window.isVIP();
    var unlocked = window.state.unlockedAchievements || [];
    
    var achs = [
        { id: "welcome", title: "Первый шаг", desc: "Войти в систему", icon: "🚪", unlocked: true },
        { id: "reader", title: "Книжный червь", desc: "Изучить лекцию", icon: "📖", unlocked: unlocked.includes('reader') },
        { id: "hacker", title: "Хакер", desc: "Пройти тест", icon: "💻", unlocked: unlocked.includes('hacker') },
        { id: "gamer", title: "Геймер", desc: "Сыграть в любую игру", icon: "🎮", unlocked: unlocked.includes('gamer') },
        { id: "party_win", title: "Выживший", desc: "Победить в Смертельной вечеринке", icon: "🏆", unlocked: unlocked.includes('party_win') },
        { id: "minesweeper_win", title: "Сапёр", desc: "Победить в Сапёре", icon: "💣", unlocked: unlocked.includes('minesweeper_win') },
        { id: "spider_win", title: "Паук", desc: "Собрать пасьянс", icon: "🕷️", unlocked: unlocked.includes('spider_win') },
        { id: "vip", title: "Тестировщик", desc: "Участие в закрытом тесте", icon: "🧪", unlocked: isVIP }
    ];
    
    app.innerHTML += `<section class="hero"><h1>🏆 Достижения</h1></section><div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px;">`;
    achs.forEach(a => {
        var style = a.unlocked ? "opacity:1; border-color:var(--ok);" : "opacity:0.4; filter:grayscale(1);";
        var badge = a.unlocked ? `<div style="color:var(--ok); font-size:12px; margin-top:5px;">✅ Получено</div>` : `<div style="color:var(--muted); font-size:12px; margin-top:5px;">🔒 Закрыто</div>`;
        app.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:12px; text-align:center; border:1px solid var(--border); ${style}"><div style="font-size:40px; margin-bottom:10px;">${a.icon}</div><div style="font-weight:bold;">${a.title}</div><div style="font-size:12px; color:var(--muted);">${a.desc}</div>${badge}</div>`;
    });
    app.innerHTML += `</div>`;
};

window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    if (window.state.staff) {
        var sigs = JSON.parse(localStorage.getItem('mdk_teacher_sigs') || '[]');
        var sigHtml = sigs.length > 0 ? sigs.map(s => `<div style="font-style:italic; margin-top:5px;">✔️ ${s.name} (${s.date})</div>`).join('') : '<div style="color:var(--muted);">Пока нет подписей...</div>';

        app.innerHTML = `<div class="no-print" style="text-align:center; margin-bottom:20px;"><button class="btn" onclick="window.print()">🖨 Распечатать</button></div>
            <div id="printable-cert" style="background:#fff; color:#000; padding:40px; max-width:800px; margin:0 auto; text-align:center; border:10px double #c14a2a;">
                <h1 style="font-size:40px; color:#c14a2a;">БЛАГОДАРСТВЕННОЕ ПИСЬМО</h1>
                <p style="font-size:20px; margin:40px 0;">Вручается</p>
                <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block;">${window.escapeHtml(window.state.staff.name)}</h2>
                <p style="font-size:18px; margin-top:40px;">За вклад в развитие портала</p>
                <div style="margin-top:60px;">Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
            </div>
            <div class="module no-print" style="margin-top:20px; background:var(--card-soft); padding:20px; border-radius:8px;">
                <h3 style="margin-top:0;">✍️ Подписи студентов</h3>
                <div id="sigList" style="margin-bottom:15px;">${sigHtml}</div>
                <button class="btn" onclick="window.addTeacherSignature()">Оставить подпись</button>
            </div>`;
        
        window.addTeacherSignature = function() {
            var name = prompt("Введите ваше ФИО (как студента):");
            if (name) {
                var newSigs = JSON.parse(localStorage.getItem('mdk_teacher_sigs') || '[]');
                newSigs.push({ name: name, date: new Date().toLocaleDateString() });
                localStorage.setItem('mdk_teacher_sigs', JSON.stringify(newSigs));
                window.renderCertificatePage();
            }
        };
        return;
    }

    if (!window.state.student) return;

    var bgs = [
        { id: "bg1", css: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" },
        { id: "bg2", css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
        { id: "bg3", css: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" },
        { id: "bg4", css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
        { id: "bg5", css: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" },
        { id: "bg6", css: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" }
    ];

    var currentBg = bgs.find(b => b.id === window.state.certBg) || bgs[0];

    var certBgSelectorHtml = `<div class="no-print" style="margin-bottom:20px; text-align:center;"><h3>Выберите стиль сертификата:</h3><div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">`;
    bgs.forEach(bg => {
        certBgSelectorHtml += `<div onclick="window.setCertBg('${bg.id}')" style="width:60px; height:60px; border-radius:8px; background:${bg.css}; cursor:pointer; border:3px solid ${window.state.certBg === bg.id ? 'var(--accent)' : 'transparent'}; transition:0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>`;
    });
    certBgSelectorHtml += `</div></div>`;

    var courseName = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId] ? window.MDK_DATA[window.state.activeCourseId].title : "МДК";
    var isApproved = window.state.results && window.state.results.certificateApproved;

    var certHtml = `<div id="printable-cert" style="background: ${currentBg.css}; background-size: 100% 100%; background-color: #fff; color:#000; padding: 20px; border-radius: 12px; max-width:900px; margin:0 auto; position: relative; aspect-ratio: 1.414 / 1; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; -webkit-print-color-adjust: exact;">
        <div style="background: rgba(255,255,255,0.9); width:100%; height:100%; padding:30px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; border-radius:8px; border: 4px solid rgba(193, 74, 42, 0.3);">
            <div><h1 style="font-size:36px; color:#c14a2a;">СЕРТИФИКАТ</h1><p style="font-size:16px; margin-top:10px;">подтверждает, что</p><h2 style="font-size:32px; margin:20px 0; border-bottom:2px solid #ccc; display:inline-block;">${window.escapeHtml(window.state.student.name)}</h2><p style="font-size:16px;">успешно прошел(ла) обучение по программе</p><h3 style="font-size:22px; margin-top:15px;">${window.escapeHtml(courseName)}</h3></div>
            <div style="display:flex; justify-content:space-between; font-size:14px; margin-top:20px;"><div><p>Дата:</p><p style="font-weight:bold;">${new Date().toLocaleDateString('ru-RU')}</p></div><div><p>Подпись:</p><div style="border-bottom:1px solid #000; width:150px; height:30px;"></div></div></div>
        </div>${!isApproved ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); font-size:100px; font-weight:bold; color:rgba(255,0,0,0.1); pointer-events:none;">ОБРАЗЕЦ</div>` : ""}</div>`;

    var gradesList = Object.keys(window.state.results || {}).filter(k => !k.startsWith("topic_"));
    var gradesRows = gradesList.map(k => {
        var title = k.replace(/prac_|self_|__final__/g, "").toUpperCase();
        var gradeData = window.state.results[k];
        var grade = gradeData.grade || gradeData.correct || gradeData;
        if (typeof grade === 'object') grade = grade.grade || '—';
        return `<tr><td style="border:1px solid #ccc; padding:8px;">${title}</td><td style="border:1px solid #ccc; padding:8px; text-align:center; font-weight:bold;">${grade}</td></tr>`;
    }).join("");

    var supplementHtml = `<div class="no-print" style="text-align:center; margin:20px 0;"><button class="btn" onclick="window.print()">🖨 Распечатать сертификат и вкладыш</button></div>
        <div id="printable-supplement" style="background:#fff; color:#000; padding:40px; max-width:900px; margin:20px auto; border:1px solid #ccc; border-radius:12px;">
            <h2 style="text-align:center; color:#c14a2a;">ВКЛАДЫШ ОЦЕНОК</h2>
            <p><b>Студент:</b> ${window.escapeHtml(window.state.student.name)}</p><p><b>Группа:</b> ${window.escapeHtml(window.state.student.group)}</p>
            <table style="width:100%; border-collapse:collapse; margin-top:20px;"><thead><tr style="background:#f0f0f0;"><th style="border:1px solid #ccc; padding:8px;">Работа</th><th style="border:1px solid #ccc; padding:8px;">Оценка</th></tr></thead><tbody>${gradesRows || '<tr><td colspan="2" style="text-align:center; padding:10px;">Оценок пока нет</td></tr>'}</tbody></table>
        </div>`;
    
    app.innerHTML += certBgSelectorHtml + certHtml + supplementHtml;
};

window.setCertBg = function(bgId) {
    window.state.certBg = bgId;
    window.saveStudentData();
    window.renderCertificatePage();
};

window.renderStudentGradesPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в профиль</a>'));
    
    var avg = window.getAverageGrade();
    app.innerHTML += `<section class="hero"><h1>📊 Мои оценки</h1><p>Средний балл: <b style="color:var(--gold); font-size:24px;">${avg}</b></p></section>
    <div class="module" id="gradesContent"></div>`;
    
    var gradesList = Object.keys(window.state.results || {}).filter(k => !k.startsWith("topic_"));
    var gradesRows = gradesList.map(k => {
        var title = k.replace(/prac_|self_|__final__/g, " ").replace(/m\d+/g, "").toUpperCase();
        var gradeData = window.state.results[k];
        var grade = gradeData.grade || gradeData.correct || gradeData;
        if (typeof grade === 'object') grade = grade.grade || '—';
        var color = grade >= 4 ? "var(--ok)" : (grade >= 3 ? "var(--gold)" : "var(--err)");
        return `<tr><td style="padding:10px; border:1px solid var(--border);">${title}</td><td style="padding:10px; border:1px solid var(--border); text-align:center; font-weight:bold; color:${color}; font-size:18px;">${grade}</td></tr>`;
    }).join("");

    document.getElementById("gradesContent").innerHTML = `<table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead><tr style="background:var(--card-soft);"><th style="padding:10px; border:1px solid var(--border);">Работа</th><th style="padding:10px; border:1px solid var(--border);">Оценка</th></tr></thead>
        <tbody>${gradesRows || '<tr><td colspan="2" style="text-align:center; padding:20px; color:var(--muted);">У вас пока нет оценок.</td></tr>'}</tbody>
    </table>`;
};

window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var isTeacher = !!window.state.staff;
    var targetKey = route.split("/")[2] ? decodeURIComponent(route.split("/")[2]) : null;

    if (isTeacher && !targetKey) {
        app.innerHTML += `<section class="hero" style="text-align:center; padding:40px;"><div style="font-size:60px; margin-bottom:10px;">👨‍🏫</div><h2>${window.escapeHtml(window.state.staff.name)}</h2><p>Личный кабинет преподавателя</p></section>
        <div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:15px;">
            <a href="#/journal" class="btn" style="padding:20px; background:var(--accent); color:#fff;">📒 Журнал</a>
            <a href="#/reports" class="btn" style="padding:20px; background:var(--gold); color:#000;">📊 Отчеты</a>
            <a href="#/admin" class="btn" style="padding:20px; background:var(--ok); color:#000;">⚙️ Админка</a>
        </div>`;
        return;
    }

    if (isTeacher && targetKey) {
        app.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
        window.API.getStudentData(targetKey).then(res => {
            app.innerHTML = '<a class="backlink" href="#/journal" style="color:var(--accent);">← Назад</a>';
            if (!res || !res.ok) { app.innerHTML += '<div class="module">Студент не найден.</div>'; return; }
            var p = {}; try { p = JSON.parse(res.payload || "{}"); } catch(e) {}
            var avHtml = p.avatar ? `<img src="${p.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
            var isVIP = targetKey.includes("новиков арсений") || targetKey.includes("кулиш денис");
            var crown = isVIP ? ' 👑' : '';
            app.innerHTML += `<section class="module" style="text-align:center; padding:40px;"><div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div><h2>${window.escapeHtml(targetKey.split("|")[0])}${crown}</h2><p>Группа: ${window.escapeHtml(targetKey.split("|")[1] || "—")}</p><p style="font-style:italic; color:var(--muted);">"${window.escapeHtml(p.signature || 'Без подписи')}"</p></section>`;
        });
    } else if (window.state.student) {
        var lvl = window.getLevel(window.state.xp);
        var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
        var isVIP = window.isVIP();
        var crown = isVIP ? ' <span title="Тестировщик" style="color:var(--gold); font-size:24px;">👑</span>' : '';
        var avgGrade = window.getAverageGrade();

        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
            <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div>
            <h2 style="margin-bottom:10px;">${window.escapeHtml(window.state.nickname || window.state.student.name)}${crown}</h2>
            <p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
            
            <div style="display:flex; justify-content:center; gap:15px; margin-bottom:20px;">
                <div style="background:var(--card-soft); padding:10px 20px; border-radius:20px;"><b style="color:var(--gold);">${window.state.xp} XP</b> · Ур. ${lvl}</div>
                <div style="background:var(--card-soft); padding:10px 20px; border-radius:20px;"><b style="color:var(--ok);">Ср. балл: ${avgGrade}</b></div>
            </div>
            
            <div style="max-width:400px; margin: 20px auto; text-align:left; background:var(--card-soft); padding:20px; border-radius:12px;">
                <label style="font-size:13px; font-weight:bold;">Никнейм</label>
                <input type="text" id="profNick" class="self-input" value="${window.escapeHtml(window.state.nickname || '')}">
                <label style="font-size:13px; font-weight:bold;">Подпись</label>
                <input type="text" id="profBio" class="self-input" value="${window.escapeHtml(window.state.signature || '')}">
                <button class="btn" onclick="window.saveProfileChanges()" style="width:100%;">💾 Сохранить</button>
            </div>
            <div style="display:flex; gap:10px; justify-content:center;">
                <a href="#/shop" class="btn">🛒 Магазин XP</a>
                <a href="#/grades" class="btn" style="background:var(--gold); color:#000;">📊 Мои оценки</a>
            </div>
        </section>`;

        window.saveProfileChanges = function() {
            window.state.nickname = document.getElementById("profNick").value.trim();
            window.state.signature = document.getElementById("profBio").value.trim();
            window.saveStudentData(); window.renderUserChip(); window.showToast("Сохранено!", "ok"); window.renderProfilePage(route);
        };
    }
};

window.renderSimplePage = function(title, items, icon) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = title;
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.innerHTML += `<section class="hero"><h1>${icon} ${title}</h1></section><div class="module" id="simpleList"></div>`;
    var list = document.getElementById("simpleList");
    if (!items || !items.length) { list.innerHTML = "<p>Материалы пока не добавлены.</p>"; return; }
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
            mediaHtml = `<div style="margin-top:10px; padding:20px; background:var(--card-soft); border-radius:8px; text-align:center; border:1px dashed var(--border);">
                <p style="color:var(--err); font-weight:bold; margin-bottom:10px;">⚠️ Видео не может быть загружено прямо на сайте (возможно, файл слишком большой или не загружен на GitHub).</p>
                <video controls src="${item.file}" style="width:100%; max-height:400px; border-radius:8px; background:#000; display:none;" onerror="this.style.display='none'; this.previousElementSibling.style.display='block';" oncanplay="this.style.display='block'; this.previousElementSibling.style.display='none';"><source src="${item.file}" type="video/mp4"></video>
            </div>`;
        } else if (isPdf) {
            // Если метод.pdf не найден, покажет ошибку 404 в iframe. Предупреждаем текстом.
            mediaHtml = `<div style="width:100%; height:600px; border-radius:8px; margin-top:10px; border:1px solid var(--border); background:#fff;"><iframe src="${item.file}#toolbar=0" width="100%" height="100%" style="border:none;"></iframe></div>
            <p style="color:var(--muted); font-size:12px; margin-top:5px;">* Если документ не отображается, проверьте наличие файла <b>${item.file}</b> в корне репозитория.</p>`;
        } else if (isDocx) {
            var docUrl = window.location.origin + window.location.pathname + item.file;
            mediaHtml = `<div style="width:100%; height:600px; border-radius:8px; margin-top:10px; border:1px solid var(--border); background:#fff;"><iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(docUrl)}&embedded=true" width="100%" height="100%" style="border:none;"></iframe></div>`;
        }
        
        list.innerHTML += `<div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:8px; background:var(--card-soft);"><b style="color:var(--accent); font-size:16px;">${item.title || 'Без названия'}</b><br><span style="font-size:14px; color:var(--muted);">${item.description || ''}</span>${mediaHtml}${(item.file || item.url) ? `<br><a href="${item.file || item.url}" target="_blank" class="btn" style="margin-top:10px;">📥 Скачать / Открыть в новой вкладке</a>` : ''}</div>`;
    });
};

// ============================================================
// РОУТЕР И ИНИЦИАЛИЗАЦИЯ
// ============================================================
window.handleLogout = function() { window.state.student = null; window.state.staff = null; window.saveStudentData(); location.reload(); };

window.addEventListener("DOMContentLoaded", function() {
    window.renderUserChip();
    window.applyRainbowLogo(); // Включаем радужный текст

    if ($("themeToggle")) $("themeToggle").onclick = window.openThemeModal; 

    var mdkSelector = document.getElementById("mdkSelector");
    if (mdkSelector) {
        mdkSelector.value = window.state.activeCourseId || "07.01";
        mdkSelector.addEventListener("change", function() { window.state.activeCourseId = this.value; window.saveStudentData(); window.dispatchEvent(new HashChangeEvent("hashchange")); });
    }

    if ($("burgerBtn")) {
        $("burgerBtn").onclick = function() { document.getElementById("drawer").classList.add("open"); document.getElementById("drawerOverlay").classList.add("open"); };
        document.getElementById("drawerClose").onclick = function() { document.getElementById("drawer").classList.remove("open"); document.getElementById("drawerOverlay").classList.remove("open"); };
        document.getElementById("drawerOverlay").onclick = function() { document.getElementById("drawer").classList.remove("open"); this.classList.remove("open"); };
    }

    document.querySelectorAll(".drawer-item[data-go]").forEach(link => {
        link.onclick = function(e) { e.preventDefault(); location.hash = this.getAttribute("data-go"); document.getElementById("drawer").classList.remove("open"); document.getElementById("drawerOverlay").classList.remove("open"); };
    });

    var loginOverlay = document.getElementById("loginOverlay");
    if (window.state.student || window.state.staff) { if (loginOverlay) loginOverlay.style.display = "none"; }

    var btnLoginStudent = document.getElementById("btnLoginStudent");
    if (btnLoginStudent) {
        btnLoginStudent.onclick = function() {
            var name = document.getElementById("loginName").value.trim();
            var group = document.getElementById("loginGroup").value.trim();
            if (!name || !group) return window.showToast("Введите ФИО и группу", "err");
            var key = name.toLowerCase() + "|" + group.toLowerCase();
            btnLoginStudent.textContent = "Вход...";
            window.API.getStudentData(key).then(res => {
                var payload = {}; if (res && res.ok && res.payload) { try { payload = JSON.parse(res.payload); } catch(e){} }
                window.state.student = { name: name, group: group };
                window.state.xp = payload.xp || 0; window.state.results = payload.results || {}; window.state.avatar = payload.avatar || null;
                window.state.nickname = payload.nickname || null; window.state.signature = payload.signature || null;
                window.state.purchasedThemes = payload.purchasedThemes || []; 
                window.state.unlockedAchievements = payload.unlockedAchievements || [];
                
                var n = name.toLowerCase();
                if (n.includes("новиков арсений") || n.includes("кулиш денис")) {
                    if (!window.state.nickname) window.state.nickname = n.includes("новиков") ? "Marazm" : "Barbos";
                    if (!window.state.purchasedThemes.includes("vip_theme")) window.state.purchasedThemes.push("vip_theme");
                }
                window.saveStudentData(); window.renderUserChip();
                window.unlockAchievement('welcome');
                
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти";
            }).catch(() => {
                window.state.student = { name: name, group: group }; window.state.xp = 0; window.state.results = {};
                window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти";
            });
        };
    }

    var btnLoginTeacher = document.getElementById("btnLoginTeacher");
    if (btnLoginTeacher) {
        btnLoginTeacher.onclick = function() {
            var user = document.getElementById("teacherUser").value.trim();
            var pass = document.getElementById("teacherPass").value.trim();
            btnLoginTeacher.textContent = "Проверка...";
            window.API.login(user, pass).then(res => {
                if (res && res.ok) {
                    window.state.staff = { name: res.name, role: res.role }; window.saveStudentData(); window.renderUserChip();
                    if (loginOverlay) loginOverlay.style.display = "none";
                    window.location.hash = "#/profile"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                } else { window.showToast("Неверный логин/пароль", "err"); }
                btnLoginTeacher.textContent = "Войти в журнал";
            }).catch(() => { window.showToast("Ошибка сервера", "err"); btnLoginTeacher.textContent = "Войти в журнал"; });
        };
    }

    function router() {
        var hash = location.hash.replace("#", "") || "/";
        var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
        var mdkSel = document.getElementById("mdkSelector");
        if (mdkSel) mdkSel.value = window.state.activeCourseId || "07.01";
        var loginOverlay = document.getElementById("loginOverlay");
        if (!window.state.student && !window.state.staff) { if (loginOverlay) loginOverlay.style.display = "flex"; } else { if (loginOverlay) loginOverlay.style.display = "none"; }

        if (hash === "/" || hash === "") { window.renderHomePage(); } 
        else if (hash.startsWith("/topic/")) { var parts = hash.split("/"); window.renderTopicPage(parts[2], parts[3]); }
        else if (hash === "/videos") { window.renderSimplePage("Видеоуроки", window.GLOBAL_DATA.videos, "🎬"); } 
        else if (hash === "/passports") { window.renderSimplePage("Паспорта станков", window.GLOBAL_DATA.passports, "📄"); } 
        else if (hash === "/safety") { window.renderSimplePage("Охрана труда", window.GLOBAL_DATA.safety, "🦺"); } 
        else if (hash === "/formatting") { app.innerHTML = `<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>Оформление</h1></section><div class="module">${window.GLOBAL_DATA.formatting.content}</div>`; } 
        else if (hash === "/profile" || hash.startsWith("/profile/")) { window.renderProfilePage(hash); } 
        else if (hash === "/grades") { window.renderStudentGradesPage(); }
        else if (hash === "/certificate") { window.renderCertificatePage(); } 
        else if (hash === "/shop") { if (window.renderShopPage) window.renderShopPage(); } 
        else if (hash === "/achievements") { window.renderAchievementsPage(); } 
        else if (hash === "/links") { if (window.renderLinksPage) window.renderLinksPage(); } 
        else if (hash === "/training") { 
            var mdkId = window.state.activeCourseId || "07.01"; var suffix = mdkId.replace(".", "");
            if (typeof window["renderTraining_" + suffix] === "function") { window["renderTraining_" + suffix](mdkId); } else { app.innerHTML = `<div class="module" style="color:var(--err);">Тренировка не найдена.</div>`; }
        } 
        else if (hash === "/final") { 
            if (window.renderNewExam) window.renderNewExam(window.state.activeCourseId); 
            else { app.innerHTML = `<div class="module" style="color:var(--err);">Экзамен не найден.</div>`; }
        } 
        else if (hash === "/arcade") { if (window.renderArcadePage) window.renderArcadePage(); } 
        else if (hash === "/rating") { if (window.renderRatingPage) window.renderRatingPage(); } 
        else if (hash === "/journal") { if (window.renderJournalPage) window.renderJournalPage(); } 
        else if (hash === "/reports") { if (window.renderCourseReportsPage) window.renderCourseReportsPage(); } 
        else if (hash === "/admin") { if (window.renderAdminPanel) window.renderAdminPanel(); } 
        else if (hash === "/schedule") { if (window.renderSchedulePage) window.renderSchedulePage(); } 
        else { app.innerHTML = '<section class="hero"><h1>404</h1><p>Страница не найдена</p></section>'; }
    }
    window.addEventListener("hashchange", router);
    router();
});