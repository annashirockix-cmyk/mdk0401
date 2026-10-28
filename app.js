"use strict";

// ============================================================
// 1. СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, signature: null, purchasedThemes: [],
    purchasedFonts: [], font: "default", certBg: "cert-bg-1", examSubmissions: [],
    unlockedAchievements: [], purchasedTextEffects: [], activeTextEffect: "none",
    purchasedBgEffects: [], activeBgEffect: "none", purchasedCardEffects: [], activeCardEffect: "none"
};
try { var savedState = localStorage.getItem("mdk.state"); if (savedState) Object.assign(window.state, JSON.parse(savedState)); } catch (e) {}

// ============================================================
// 2. УТИЛИТЫ
// ============================================================
window.clearCache = function() {
    if (confirm("Это очистит локальные данные, сбросит кэш браузера и обновит страницу. Продолжить?")) {
        localStorage.clear(); sessionStorage.clear();
        if ('serviceWorker' in navigator) { navigator.serviceWorker.getRegistrations().then(function(registrations) { for (let registration of registrations) registration.unregister(); location.reload(true); }); } else location.reload(true);
    }
};
window.isVIP = function() { if (window.state.staff) return true; if (!window.state.student) return false; var name = window.state.student.name.toLowerCase(); return name.includes("новиков арсений") || name.includes("кулиш денис"); };
window.saveStudentData = function() {
    try { 
        localStorage.setItem("mdk.state", JSON.stringify(window.state)); 
        if (window.state.student && window.API && window.studentKey()) { 
            window.API.saveStudent(window.studentKey(), window.state.student.name, window.state.student.group, JSON.stringify(window.state)).catch(err => console.warn("Ошибка синхронизации")); 
        } 
    } catch (e) {}
};
window.studentKey = function() { if (!window.state.student) return ""; return (window.state.student.name || "").trim().toLowerCase() + "|" + (window.state.student.group || "").trim().toLowerCase(); };
window.getLevel = function(xp) { return Math.floor((xp || 0) / 100) + 1; };
window.getLevelTitle = function(lvl) { if (lvl < 3) return "Новичок"; if (lvl < 5) return "Ученик"; if (lvl < 8) return "Практикант"; if (lvl < 12) return "Мастер"; return "Эксперт"; };
window.$ = window.$ || function(id) { return document.getElementById(id); };
window.el = window.el || function(html) { var div = document.createElement("div"); div.innerHTML = html.trim(); return div.firstChild; };
window.escapeHtml = window.escapeHtml || function(text) { if (!text) return ""; return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
window.showToast = window.showToast || function(msg, type) {
    var container = document.querySelector(".toast-container"); if (!container) { container = document.createElement("div"); container.className = "toast-container"; document.body.appendChild(container); }
    var t = document.createElement("div"); t.className = "toast " + (type || ""); t.textContent = msg; container.appendChild(t);
    setTimeout(function() { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
};

window.applyGlobalEffects = function() {
    var textFx = window.state.activeTextEffect || "none"; var logo = document.getElementById("mainLogo"); var userName = document.getElementById("userChipName");
    if (logo && userName) {
        logo.className = "brand-badge"; userName.className = "";
        if (textFx !== "none") { logo.classList.add(textFx); userName.classList.add(textFx); if (textFx === 'fx-glitch-text') { logo.setAttribute('data-text', logo.textContent); userName.setAttribute('data-text', userName.textContent); } } else logo.classList.add("rainbow-text");
    }
    var cardFx = window.state.activeCardEffect || "none";
    document.querySelectorAll(".topic").forEach(function(el) { el.classList.remove("fx-holo-card", "fx-3d-card"); if (cardFx !== "none") el.classList.add(cardFx); });
    var bgFx = window.state.activeBgEffect || "none";
    document.querySelectorAll(".hero").forEach(function(el) { el.classList.remove("fx-aurora-bg", "fx-matrix-bg", "fx-starfield-bg", "bg-underwater", "bg-foggy-forest", "bg-stone-alley", "bg-cats-yarn", "bg-pumpkins", "bg-spooky-room", "bg-halloween", "bg-red-forest", "bg-lanterns", "bg-dark-table", "bg-graveyard", "bg-cats-notebook"); if (bgFx !== "none") el.classList.add(bgFx); else el.classList.add("fx-aurora-bg"); });
};

window.renderUserChip = function() {
    var nameEl = document.getElementById("userChipName"), groupEl = document.getElementById("userChipGroup"), avEl = document.getElementById("userChipAvatar");
    if (window.state.student) {
        var isVIP = window.isVIP(); var crown = isVIP ? ' <span title="VIP" style="color:var(--gold); font-size:16px;">👑</span>' : '';
        if (nameEl) nameEl.innerHTML = (window.state.nickname || window.state.student.name) + crown;
        if (groupEl) groupEl.textContent = "Гр. " + window.state.student.group;
        if (avEl) avEl.innerHTML = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : "👨‍🎓";
    } else if (window.state.staff) {
        if (nameEl) nameEl.textContent = window.state.staff.name; if (groupEl) groupEl.textContent = window.state.staff.role; if (avEl) avEl.textContent = "👨‍🏫";
    }
    var xpEl = document.getElementById("xpCount"); if (xpEl) xpEl.textContent = `🌟 ${window.state.xp} XP`;
    window.applyGlobalEffects();
};

window.getAverageGrade = function() {
    var results = window.state.results || {}; var sum = 0, count = 0;
    for (var key in results) { if (key.startsWith("topic_") || key === "certificateApproved") continue; var grade = results[key].grade; if (typeof grade === 'number' && !isNaN(grade) && grade >= 2) { sum += grade; count++; } }
    return count > 0 ? (sum / count).toFixed(2) : "—";
};

window.getReadableResultName = function(key) {
    if (key === "__final__") return "Итоговый экзамен"; var isTest = key.startsWith("test_") || key.startsWith("inline_"); var isPrac = key.startsWith("prac_"); var isSelf = key.startsWith("self_"); var parts = key.split("_"); var rawId = parts[1] || parts[0]; var index = parts.length > 2 ? parseInt(parts[2]) + 1 : ""; var course = window.MDK_DATA[window.state.activeCourseId]; var topicTitle = rawId.toUpperCase();
    if (course && course.sections) course.sections.forEach(s => s.topics.forEach(t => { if (t.id === rawId) topicTitle = t.title; }));
    if (isTest) return `Тест: ${topicTitle}`; if (isPrac) return `Практика ${index ? '№'+index : ''}: ${topicTitle}`; if (isSelf) return `Самостоятельная ${index ? '№'+index : ''}: ${topicTitle}`; return topicTitle;
};

window.unlockAchievement = function(id) {
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (!window.state.unlockedAchievements.includes(id)) { window.state.unlockedAchievements.push(id); window.saveStudentData(); window.showToast("🏆 Получена ачивка!", "ok"); }
};

// ============================================================
// 3. СПИСКИ ТРЕНИРОВОК, ЭКЗАМЕНОВ, ВИДЕО И ОХРАНЫ ТРУДА
// ============================================================
window.renderTrainingListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎯 Тренировка</h1><p>Выберите предмет или тренажер для практики</p></section>';
    var grid = document.createElement("div"); grid.style = "display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px;";
    
    var gcodeCard = document.createElement("a"); 
    gcodeCard.href = "#/training/gcode"; 
    gcodeCard.className = "module";
    gcodeCard.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:2px solid var(--accent); border-radius:12px;";
    gcodeCard.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">📐 Тренажер G-кода</h3><p>Интерактивный симулятор станка. Напишите программу по картинке и проверьте себя.</p>`;
    grid.appendChild(gcodeCard);

    Object.values(window.MDK_DATA || {}).forEach(p => {
        var card = document.createElement("a"); card.href = "#/training/" + p.id; card.className = "module";
        card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">${p.shortName}</h3><p>${p.title}</p>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
};

window.renderGcodeTrainer = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = `
        <a class="backlink" href="#/training" style="color:var(--accent);">← Назад к тренировкам</a>
        <section class="hero" style="padding: 20px; margin-bottom: 10px;">
            <h1>📐 Тренажер G-кода PRO</h1>
            <p>Напишите программу для фрезеровки детали. Справа отображается целевая фигура.</p>
        </section>
        <div class="module" style="padding: 0; overflow: hidden; height: 80vh; border-radius: 12px;">
            <iframe src="./gcode_trainer_advanced.html" style="width: 100%; height: 100%; border: none; background: #0a0e14;"></iframe>
        </div>
    `;
};

window.renderVideosPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎬 Видеоуроки</h1></section><div class="module" id="videosList"></div>';
    var list = document.getElementById("videosList");
    var vids = window.GLOBAL_DATA && window.GLOBAL_DATA.videos ? window.GLOBAL_DATA.videos : [];
    if (!vids.length) { list.innerHTML = "<p>Видео пока нет. Убедитесь, что папка video/ загружена в репозиторий.</p>"; return; }
    vids.forEach(v => {
        list.innerHTML += `<div style="margin-bottom:20px; background:var(--card-soft); padding:15px; border-radius:8px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${v.title}</b><p style="font-size:14px; margin:5px 0;">${v.description||''}</p><video src="${v.file}" controls preload="metadata" playsinline style="width:100%; border-radius:8px; max-height:70vh; background:#000;"></video><p style="margin-top:8px;"><a class="btn ghost" href="${v.file}" target="_blank" rel="noopener">Открыть файл</a></p></div>`;
    });
};

window.renderSafetyPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🛡️ Охрана труда</h1></section><div class="module" id="safetyList"></div>';
    var list = document.getElementById("safetyList");
    var items = window.GLOBAL_DATA && window.GLOBAL_DATA.safety ? window.GLOBAL_DATA.safety : [];
    if (!items.length) { list.innerHTML = "<p>Инструкций пока нет.</p>"; return; }
    items.forEach(s => {
        list.innerHTML += `<div class="safety-card" style="margin-bottom:15px; background:var(--card-soft); padding:15px; border-radius:8px; border:1px solid var(--border);"><b style="color:var(--err); font-size:16px;">${s.title}</b><p style="font-size:14px; margin:5px 0;">${s.description||''}</p>${s.content ? `<p>${s.content}</p>` : `<a href="${s.file}" target="_blank" class="btn" style="margin-top:10px; display:inline-block;">📥 Скачать</a>`}</div>`;
    });
};

// ============================================================
// 4. СТРАНИЦЫ
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Главная";
    var mdkId = window.state.activeCourseId || "07.01"; var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!"; var module = course ? course.module : "Выберите раздел.";
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
    var course = window.MDK_DATA[courseId]; if (!course) { app.innerHTML = '<div class="module">Курс не найден</div>'; return; }
    var topic = null; course.sections.forEach(s => { s.topics.forEach(t => { if (t.id === topicId) topic = t; }); });
    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена</div>'; return; }
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = topic.code + " " + topic.title;
    app.appendChild(el(`<a class="backlink" href="#/" style="color:var(--accent);">← Назад к плану</a>`));
    app.appendChild(el(`<section class="hero"><h1 class="neon-text">${topic.code} ${topic.title}</h1></section>`));
    
    var customCards = (window.CUSTOM_DATA && window.CUSTOM_DATA.flashcards || []).filter(fc => fc.mdkId === courseId && fc.topicId === topic.id);
    var customLecs = (window.CUSTOM_DATA && window.CUSTOM_DATA.customLectures || []).filter(l => l.mdkId === courseId && l.topicId === topic.id);

    var tabsHtml = `<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
        <button class="btn tab active" id="tab-lectures" onclick="window.switchTopicTab('lectures')">📖 Лекции</button>
        ${customCards.length > 0 ? `<button class="btn tab ghost" id="tab-flashcards" onclick="window.switchTopicTab('flashcards')">📇 Карточки</button>` : ''}
        ${(topic.presentations && topic.presentations.length) ? `<button class="btn tab ghost" id="tab-presentations" onclick="window.switchTopicTab('presentations')">📊 Презентации</button>` : ''}
        ${(topic.practicals && topic.practicals.length) ? `<button class="btn tab ghost" id="tab-practicals" onclick="window.switchTopicTab('practicals')">🛠️ Практика</button>` : ''}
        ${(topic.selfWork && topic.selfWork.length) ? `<button class="btn tab ghost" id="tab-selfwork" onclick="window.switchTopicTab('selfwork')">📝 Самостоятельная</button>` : ''}
        ${(topic.test && topic.test.length) ? `<button class="btn tab ghost" id="tab-test" onclick="window.switchTopicTab('test')">🎯 Тест</button>` : ''}
    </div><div id="topicContent" class="module"></div>`;
    app.innerHTML += tabsHtml;

    window.switchTopicTab = function(tabName) {
        document.querySelectorAll(".tab").forEach(btn => { btn.classList.remove("active"); btn.classList.add("ghost"); });
        var activeBtn = document.getElementById(`tab-${tabName}`); if (activeBtn) { activeBtn.classList.add("active"); activeBtn.classList.remove("ghost"); }
        var contentArea = document.getElementById("topicContent"); contentArea.innerHTML = "";

        if (tabName === 'lectures') {
            if ((!topic.lectures || !topic.lectures.length) && customLecs.length === 0) { contentArea.innerHTML = "<p>Лекций нет.</p>"; return; }
            if (topic.lectures) {
                topic.lectures.forEach(lec => {
                    contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div></details>`;
                });
            }
            customLecs.forEach(l => {
                contentArea.innerHTML += `<details class="lec-accordion" style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">📄 ${l.title} (Загружено преподавателем)</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border);"><object data="${l.dataUrl}" type="application/pdf" width="100%" height="600px" style="border:none; border-radius:8px;"><p style="text-align:center; color:var(--muted);">Ваш браузер блокирует встроенный просмотр. <a href="${l.dataUrl}" download="${l.title}.pdf" class="btn" style="margin-top:10px;">📥 Скачать PDF</a></p></object></div></details>`;
            });
            window.unlockAchievement('reader');
        }
        else if (tabName === 'flashcards') {
            contentArea.innerHTML = '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:15px;" id="fcGrid"></div>';
            var grid = contentArea.querySelector("#fcGrid");
            customCards.forEach((fc) => {
                grid.innerHTML += `<div class="fc-card" onclick="this.classList.toggle('flipped')" style="perspective:1000px; cursor:pointer; height:150px;"><div class="fc-inner" style="position:relative; width:100%; height:100%; transition:transform 0.6s; transform-style:preserve-3d;"><div class="fc-front" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:var(--card); border:2px solid var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; padding:15px; text-align:center; font-weight:bold; font-size:16px;">${fc.term}</div><div class="fc-back" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:var(--card-soft); border:2px solid var(--ok); border-radius:12px; display:flex; align-items:center; justify-content:center; padding:15px; text-align:center; transform:rotateY(180deg); font-size:14px;">${fc.definition}</div></div></div>`;
            });
            if (!document.getElementById('fcStyles')) { var style = document.createElement('style'); style.id = 'fcStyles'; style.textContent = `.fc-card.flipped .fc-inner { transform: rotateY(180deg); }`; document.head.appendChild(style); }
        }
        else if (tabName === 'presentations') {
            if (!topic.presentations || !topic.presentations.length) { contentArea.innerHTML = "<p>Презентаций нет.</p>"; return; }
            topic.presentations.forEach(p => {
                var f = p.file || "";
                if (f && f.indexOf("/") < 0) f = "presentations/" + f;
                var base = window.location.origin + window.location.pathname.replace(/\/?$/, "/");
                var fileUrl = base + f;
                var viewer = /\.pdf$/i.test(f)
                    ? `<object data="${fileUrl}" type="application/pdf" width="100%" height="70vh" style="min-height:420px;border:1px solid var(--border);border-radius:8px;background:#111;"><p>PDF не открылся во встроенном окне.</p></object>`
                    : `<p style="color:var(--muted); margin-bottom:15px; font-size:13px;">Презентацию PPTX браузер не показывает внутри страницы. Скачайте файл.</p>`;
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:16px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${p.code}: ${p.title}</b><p style="font-size:14px; margin-top:10px; color:var(--text-soft);">${p.description || ''}</p><div style="margin-top:15px;">${viewer}<p style="margin-top:12px;"><a href="${fileUrl}" target="_blank" class="btn">Открыть / скачать</a></p></div></div>`;
            });
        }
        else if (tabName === 'practicals') {
            if (!topic.practicals) { contentArea.innerHTML = "<p>Практик нет.</p>"; return; }
            topic.practicals.forEach((p, idx) => {
                var testId = `prac_${topic.id}_${idx}`; var isDone = window.state.results && window.state.results[testId];
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${p.code}: ${p.title}</b><p style="font-size:14px; margin-top:10px; line-height:1.5;">${p.task}</p>${isDone ? `<div style="color:var(--ok); font-weight:bold; margin-top:10px;">✅ Выполнено (Оценка: ${isDone.grade})</div>` : `<div style="display:flex; gap:10px; margin-top:15px;"><input type="text" id="inp_${testId}" class="self-input" placeholder="Введите ответ..." style="margin:0;"><button class="btn" onclick="window.checkPractical('${testId}')">Проверить</button></div>`}</div>`;
            });
        }
        else if (tabName === 'selfwork') {
            if (!topic.selfWork || !Array.isArray(topic.selfWork)) { contentArea.innerHTML = "<p>Самостоятельных работ нет.</p>"; return; }
            topic.selfWork.forEach((sw, idx) => {
                var testId = `self_${topic.id}_${idx}`; var isDone = window.state.results && window.state.results[testId];
                var questions = null;
                if (window.EXTRA_TESTS && window.EXTRA_TESTS[testId] && window.EXTRA_TESTS[testId].questions) questions = window.EXTRA_TESTS[testId].questions;
                else if (sw.questions && typeof sw.questions === 'object' && sw.questions.length > 0 && sw.questions[0].options) questions = sw.questions;
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><b style="color:var(--gold); font-size:16px;">${sw.code || 'СР'}: ${sw.title}</b><p style="font-size:14px; margin-top:10px; line-height:1.5;">${sw.task || ''}</p>`;
                if (isDone) contentArea.innerHTML += `<div style="color:var(--ok); font-weight:bold; margin-top:15px; text-align:center;">✅ Работа сдана (Оценка: ${isDone.grade})</div>`;
                else if (questions && questions.length > 0) contentArea.innerHTML += `<div style="margin-top:15px;"><button class="btn" onclick="window.startSelfWorkTest('${topic.id}', ${idx})" style="width:100%; padding:12px; font-size:16px;">📝 Начать тест (${questions.length} вопросов)</button></div>`;
                else contentArea.innerHTML += `<div style="color:var(--muted); margin-top:15px; text-align:center;">Вопросы для теста не добавлены</div>`;
                contentArea.innerHTML += `</div>`;
            });
        }
        else if (tabName === 'test') {
            if (!topic.test || !Array.isArray(topic.test) || topic.test.length === 0) { contentArea.innerHTML = "<p>Вопросов для этого теста пока нет.</p>"; return; }
            var testId = `test_${topic.id}`; var isDone = window.state.results && window.state.results[testId];
            if (isDone) contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;"><h3 style="color:var(--ok);">✅ Тест уже пройден!</h3><p>Оценка: <b>${isDone.grade}</b></p><button class="btn" onclick="window.startInlineTest('${topic.id}', true)">Пройти заново</button></div>`;
            else contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;"><h3>🎯 Тест по теме</h3><p>Вопросов: ${topic.test.length}</p><button class="btn" onclick="window.startInlineTest('${topic.id}', false)" style="padding:15px 30px; font-size:16px;">Начать тест (10 минут)</button></div>`;
        }
    };

    window.startSelfWorkTest = function(topicId, selfWorkIndex) {
        var contentArea = document.getElementById("topicContent"); var sw = topic.selfWork[selfWorkIndex]; var testId = `self_${topicId}_${selfWorkIndex}`; var questions = null;
        if (window.EXTRA_TESTS && window.EXTRA_TESTS[testId] && window.EXTRA_TESTS[testId].questions) questions = window.EXTRA_TESTS[testId].questions;
        else if (sw.questions && typeof sw.questions === 'object' && sw.questions.length > 0 && sw.questions[0].options) questions = sw.questions;
        if (!questions || questions.length === 0) { window.showToast("Вопросы не найдены", "err"); return; }
        var currentQ = 0, correct = 0, timeLeft = 600, timerId;
        function renderQ() {
            if (currentQ >= questions.length) {
                clearInterval(timerId); var pct = Math.round((correct / questions.length) * 100); var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                window.state.results[testId] = { grade: grade, total: correct, max: questions.length }; window.saveStudentData(); window.unlockAchievement('hacker');
                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;"><h2 style="color:var(--ok);">Тест завершен!</h2><p>Верных: <b>${correct}</b> из <b>${questions.length}</b></p><h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1><button class="btn" onclick="window.switchTopicTab('selfwork')">Вернуться</button></div>`; return;
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
        var contentArea = document.getElementById("topicContent"); var questions = [...topic.test];
        if (questions.length < 5) {
            var allCourseQuestions = []; course.sections.forEach(s => s.topics.forEach(t => { if (t.test && t.id !== topicId) allCourseQuestions = allCourseQuestions.concat(t.test); }));
            allCourseQuestions = allCourseQuestions.sort(() => Math.random() - 0.5);
            while (questions.length < 5 && allCourseQuestions.length > 0) questions.push(allCourseQuestions.pop());
        }
        var currentQ = 0, correct = 0, timeLeft = 600, timerId;
        function renderQ() {
            if (currentQ >= questions.length) {
                clearInterval(timerId); var pct = Math.round((correct / questions.length) * 100); var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                window.state.results[`test_${topicId}`] = { grade: grade, total: correct, max: questions.length }; window.saveStudentData(); window.unlockAchievement('hacker');
                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;"><h2 style="color:var(--ok);">Тест завершен!</h2><p>Верных: <b>${correct}</b> из <b>${questions.length}</b></p><h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1><button class="btn" onclick="window.switchTopicTab('test')">Вернуться</button></div>`; return;
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
        var val = document.getElementById(`inp_${testId}`).value.trim(); var expected = window.EXTRA_TESTS && window.EXTRA_TESTS[testId] ? window.EXTRA_TESTS[testId].expectedAnswer : "";
        if (expected && val === expected) {
            window.showToast("✅ Верно! +20 XP", "ok"); if (!window.state.results) window.state.results = {}; window.state.results[testId] = { grade: 5, max: 5, type: "auto" }; if (window.addXP) window.addXP(20);
            window.saveStudentData(); window.renderTopicPage(courseId, topicId); window.switchTopicTab('practicals');
        } else window.showToast("❌ Неверный ответ", "err");
    };
    window.switchTopicTab('lectures');
};
window._getSessionEmail = function() {
    if (window.state.staff && window.state.staff.email) return window.state.staff.email;
    if (window.state.student && window.state.student.email) return window.state.student.email;
    return "";
};

window._showAccMsg = function(text, ok) {
    var el = document.getElementById("accMsg");
    if (!el) return;
    el.style.display = "block";
    el.textContent = text;
    el.style.color = ok ? "var(--ok,#10b981)" : "var(--err,#ef4444)";
};

window.bindAccountSettings = function() {
    var email = window._getSessionEmail();
    var emailLabel = document.getElementById("accEmailLabel");
    if (emailLabel) emailLabel.textContent = email || "(не указан — войдите заново через email)";

    var nameInput = document.getElementById("accName");
    if (nameInput) {
        var cur = (window.state.staff && window.state.staff.name) || (window.state.student && window.state.student.name) || "";
        nameInput.value = cur;
    }

    var btnName = document.getElementById("btnSaveName");
    if (btnName) {
        btnName.onclick = function() {
            var newName = (document.getElementById("accName").value || "").trim();
            var pass = (document.getElementById("accNamePass").value || "");
            if (!newName || newName.length < 2) return window._showAccMsg("Укажите имя (минимум 2 символа)", false);
            if (!email) return window._showAccMsg("Нет email в сессии. Выйдите и войдите снова по email.", false);
            if (!pass) return window._showAccMsg("Введите текущий пароль", false);

            btnName.disabled = true; btnName.textContent = "Сохранение...";
            window.API.changeName(email, pass, newName).then(function(res) {
                btnName.disabled = false; btnName.textContent = "💾 Сохранить имя";
                if (res && (res.ok || res.success)) {
                    if (window.state.staff) window.state.staff.name = newName;
                    if (window.state.student) window.state.student.name = newName;
                    if (window.saveStudentData) window.saveStudentData();
                    if (window.renderUserChip) window.renderUserChip();
                    document.getElementById("accNamePass").value = "";
                    window._showAccMsg("Имя обновлено", true);
                    if (window.showToast) window.showToast("Имя сохранено", "ok");
                } else {
                    window._showAccMsg((res && res.error) || "Не удалось сохранить имя", false);
                }
            }).catch(function(err) {
                btnName.disabled = false; btnName.textContent = "💾 Сохранить имя";
                window._showAccMsg(err.message || "Ошибка сети", false);
            });
        };
    }

    var btnPass = document.getElementById("btnSavePass");
    if (btnPass) {
        btnPass.onclick = function() {
            var oldP = (document.getElementById("accOldPass").value || "");
            var newP = (document.getElementById("accNewPass").value || "");
            var newP2 = (document.getElementById("accNewPass2").value || "");
            if (!email) return window._showAccMsg("Нет email в сессии. Выйдите и войдите снова по email.", false);
            if (!oldP || !newP) return window._showAccMsg("Заполните текущий и новый пароль", false);
            if (newP.length < 4) return window._showAccMsg("Новый пароль слишком короткий (мин. 4)", false);
            if (newP !== newP2) return window._showAccMsg("Пароли не совпадают", false);

            btnPass.disabled = true; btnPass.textContent = "Сохранение...";
            window.API.changePassword(email, oldP, newP).then(function(res) {
                btnPass.disabled = false; btnPass.textContent = "🔑 Сменить пароль";
                if (res && (res.ok || res.success)) {
                    document.getElementById("accOldPass").value = "";
                    document.getElementById("accNewPass").value = "";
                    document.getElementById("accNewPass2").value = "";
                    window._showAccMsg("Пароль изменён", true);
                    if (window.showToast) window.showToast("Пароль успешно изменён", "ok");
                } else {
                    window._showAccMsg((res && res.error) || "Не удалось сменить пароль", false);
                }
            }).catch(function(err) {
                btnPass.disabled = false; btnPass.textContent = "🔑 Сменить пароль";
                window._showAccMsg(err.message || "Ошибка сети", false);
            });
        };
    }
};


window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    if (!window.state.student && !window.state.staff) { location.hash = "#/"; return; }
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Личный кабинет";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var isTeacher = !!window.state.staff;
    var targetKey = route && route.split("/")[2] ? decodeURIComponent(route.split("/")[2]) : null;

    if (isTeacher && !targetKey) {
        app.innerHTML += `<section class="hero" style="text-align:center; padding:40px;"><div style="font-size:60px; margin-bottom:10px;">👨‍🏫</div><h2>${window.escapeHtml(window.state.staff.name)}</h2><p>Личный кабинет преподавателя</p></section>
        <div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:15px;">
            <a href="#/journal" class="btn" style="padding:20px; background:var(--accent); color:#fff;">📒 Журнал</a>
            <a href="#/reports" class="btn" style="padding:20px; background:var(--gold); color:#000;">📊 Отчеты</a>
            <a href="#/admin" class="btn" style="padding:20px; background:var(--ok); color:#000;">⚙️ Админка</a>
        </div>` + `
            <div class="module" id="accountSettings" style="max-width:480px; margin:20px auto; text-align:left;">
                <h3 style="margin-top:0;">⚙️ Аккаунт</h3>
                <p style="font-size:13px; color:var(--muted); margin-top:0;">Email: <b id="accEmailLabel"></b></p>
                <form onsubmit="event.preventDefault();">
                    <div style="margin-bottom:18px; padding-bottom:18px; border-bottom:1px solid var(--border);">
                        <label style="font-size:13px; font-weight:bold; display:block; margin-bottom:4px;">Отображаемое имя</label>
                        <input type="text" id="accName" class="self-input" placeholder="ФИО">
                        <label style="font-size:13px; font-weight:bold; display:block; margin:10px 0 4px;">Текущий пароль (для подтверждения)</label>
                        <input type="password" id="accNamePass" class="self-input" placeholder="••••••••" autocomplete="current-password">
                        <button type="button" class="btn" id="btnSaveName" style="width:100%; margin-top:10px;">💾 Сохранить имя</button>
                    </div>
                    <div>
                        <label style="font-size:13px; font-weight:bold; display:block; margin-bottom:4px;">Текущий пароль</label>
                        <input type="password" id="accOldPass" class="self-input" placeholder="Текущий пароль" autocomplete="current-password">
                        <label style="font-size:13px; font-weight:bold; display:block; margin:10px 0 4px;">Новый пароль</label>
                        <input type="password" id="accNewPass" class="self-input" placeholder="Минимум 4 символа" autocomplete="new-password">
                        <label style="font-size:13px; font-weight:bold; display:block; margin:10px 0 4px;">Повтор нового пароля</label>
                        <input type="password" id="accNewPass2" class="self-input" placeholder="Повторите пароль" autocomplete="new-password">
                        <button type="button" class="btn" id="btnSavePass" style="width:100%; margin-top:10px; background:var(--gold); color:#000;">🔑 Сменить пароль</button>
                    </div>
                </form>
                <p id="accMsg" style="display:none; margin-top:12px; text-align:center; font-weight:bold;"></p>
            </div>
`;
        window.applyGlobalEffects();
        window.bindAccountSettings();
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
            window.applyGlobalEffects();
        });
    } else if (window.state.student) {
        var lvl = window.getLevel(window.state.xp); var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
        var isVIP = window.isVIP(); var crown = isVIP ? ' <span title="Тестировщик" style="color:var(--gold); font-size:24px;">👑</span>' : '';
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
        </section>` + `
            <div class="module" id="accountSettings" style="max-width:480px; margin:20px auto; text-align:left;">
                <h3 style="margin-top:0;">⚙️ Аккаунт</h3>
                <p style="font-size:13px; color:var(--muted); margin-top:0;">Email: <b id="accEmailLabel"></b></p>
                <form onsubmit="event.preventDefault();">
                    <div style="margin-bottom:18px; padding-bottom:18px; border-bottom:1px solid var(--border);">
                        <label style="font-size:13px; font-weight:bold; display:block; margin-bottom:4px;">Отображаемое имя</label>
                        <input type="text" id="accName" class="self-input" placeholder="ФИО">
                        <label style="font-size:13px; font-weight:bold; display:block; margin:10px 0 4px;">Текущий пароль (для подтверждения)</label>
                        <input type="password" id="accNamePass" class="self-input" placeholder="••••••••" autocomplete="current-password">
                        <button type="button" class="btn" id="btnSaveName" style="width:100%; margin-top:10px;">💾 Сохранить имя</button>
                    </div>
                    <div>
                        <label style="font-size:13px; font-weight:bold; display:block; margin-bottom:4px;">Текущий пароль</label>
                        <input type="password" id="accOldPass" class="self-input" placeholder="Текущий пароль" autocomplete="current-password">
                        <label style="font-size:13px; font-weight:bold; display:block; margin:10px 0 4px;">Новый пароль</label>
                        <input type="password" id="accNewPass" class="self-input" placeholder="Минимум 4 символа" autocomplete="new-password">
                        <label style="font-size:13px; font-weight:bold; display:block; margin:10px 0 4px;">Повтор нового пароля</label>
                        <input type="password" id="accNewPass2" class="self-input" placeholder="Повторите пароль" autocomplete="new-password">
                        <button type="button" class="btn" id="btnSavePass" style="width:100%; margin-top:10px; background:var(--gold); color:#000;">🔑 Сменить пароль</button>
                    </div>
                </form>
                <p id="accMsg" style="display:none; margin-top:12px; text-align:center; font-weight:bold;"></p>
            </div>
`;
        window.saveProfileChanges = function() {
            window.state.nickname = document.getElementById("profNick").value.trim(); window.state.signature = document.getElementById("profBio").value.trim();
            window.saveStudentData(); window.renderUserChip(); window.showToast("Сохранено!", "ok"); window.renderProfilePage(route);
        };
        window.bindAccountSettings();
    }
    window.applyGlobalEffects();
};

window.renderAchievementsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Достижения";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var isVIP = window.isVIP(); var unlocked = window.state.unlockedAchievements || [];
    var achs = [
        { id: "welcome", title: "Первый шаг", desc: "Войти в систему", icon: "🚪", unlocked: true },
        { id: "reader", title: "Книжный червь", desc: "Изучить лекцию", icon: "📖", unlocked: unlocked.includes('reader') },
        { id: "hacker", title: "Хакер", desc: "Пройти тест", icon: "💻", unlocked: unlocked.includes('hacker') },
        { id: "gamer", title: "Геймер", desc: "Сыграть в любую игру", icon: "🎮", unlocked: unlocked.includes('gamer') },
        { id: "gcode_pro", title: "G-кодер", desc: "Пройти уровень в тренажере G-кода", icon: "📐", unlocked: unlocked.includes('gcode_pro') },
        { id: "party_win", title: "Выживший", desc: "Победить в Смертельной вечеринке", icon: "🏆", unlocked: unlocked.includes('party_win') },
        { id: "minesweeper_win", title: "Сапёр", desc: "Победить в Сапёре", icon: "💣", unlocked: unlocked.includes('minesweeper_win') },
        { id: "spider_win", title: "Паук", desc: "Собрать пасьянс", icon: "🕷️", unlocked: unlocked.includes('spider_win') },
        { id: "snake_win", title: "Змейка", desc: "Набрать 20 очков в Змейке", icon: "🐍", unlocked: unlocked.includes('snake_win') },
        { id: "pumpkin_carve", title: "Тыквовед", desc: "Вырезать лицо на тыкве", icon: "🎃", unlocked: unlocked.includes('pumpkin_carve') },
        { id: "vip", title: "Тестировщик", desc: "Участие в закрытом тесте", icon: "🧪", unlocked: isVIP }
    ];
    app.innerHTML += `<section class="hero"><h1>🏆 Достижения</h1></section><div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px;">`;
    achs.forEach(a => {
        var style = a.unlocked ? "opacity:1; border-color:var(--ok);" : "opacity:0.4; filter:grayscale(1);";
        var badge = a.unlocked ? `<div style="color:var(--ok); font-size:12px; margin-top:5px;">✅ Получено</div>` : `<div style="color:var(--muted); font-size:12px; margin-top:5px;">🔒 Закрыто</div>`;
        app.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:12px; text-align:center; border:1px solid var(--border); ${style}"><div style="font-size:40px; margin-bottom:10px;">${a.icon}</div><div style="font-weight:bold;">${a.title}</div><div style="font-size:12px; color:var(--muted);">${a.desc}</div>${badge}</div>`;
    });
    app.innerHTML += `</div>`;
    window.applyGlobalEffects();
};

window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Сертификат";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    if (window.state.staff) {
        app.innerHTML = `<div class="no-print" style="text-align:center; margin-bottom:20px;"><button class="btn" onclick="window.print()">🖨 Распечатать</button></div>
            <div id="printable-cert" class="cert-bg-1" style="color:#000; padding:40px; max-width:800px; margin:0 auto; text-align:center; border:10px double #c14a2a;">
                <div style="background:rgba(255,255,255,0.85); padding:20px; border-radius:8px;">
                    <h1 style="font-size:40px; color:#c14a2a; font-family:'Monomakh', serif;">БЛАГОДАРСТВЕННОЕ ПИСЬМО</h1>
                    <p style="font-size:20px; margin:40px 0;">Вручается</p>
                    <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block;">${window.escapeHtml(window.state.staff.name)}</h2>
                    <p style="font-size:18px; margin-top:40px;">За вклад в развитие портала</p>
                    <div style="margin-top:60px;">Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
                </div>
            </div>`;
        return;
    }
    if (!window.state.student) return;
    
    var bgs = [
        { id: "cert-bg-1", name: "Классический синий" },
        { id: "cert-bg-2", name: "С гербом" },
        { id: "cert-bg-3", name: "Винтажный" },
        { id: "cert-bg-4", name: "Гильош" },
        { id: "cert-bg-5", name: "Крафт" },
        { id: "cert-bg-6", name: "Имперский" }
    ];
    var currentBg = bgs.find(b => b.id === window.state.certBg) || bgs[0];
    var courseName = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId] ? window.MDK_DATA[window.state.activeCourseId].title : "МДК";
    var isApproved = window.state.results && window.state.results.certificateApproved;
    var avg = window.getAverageGrade();
    var finalGrade = avg === "—" ? "—" : (parseFloat(avg) >= 4.5 ? "Отлично" : (parseFloat(avg) >= 3.5 ? "Хорошо" : (parseFloat(avg) >= 2.5 ? "Удовлетворительно" : "Неудовлетворительно")));
    
    var certBgSelectorHtml = `<div class="no-print" style="margin-bottom:20px; text-align:center;"><h3>Выберите стиль:</h3><div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">`;
    bgs.forEach(bg => {
        certBgSelectorHtml += `<div onclick="window.setCertBg('${bg.id}')" title="${bg.name}" class="${bg.id}" style="width:60px; height:60px; border-radius:8px; cursor:pointer; border:3px solid ${window.state.certBg === bg.id ? 'var(--accent)' : 'transparent'}; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`;
    });
    certBgSelectorHtml += `</div></div>`;
    
    var certHtml = `<div id="printable-cert" class="${currentBg.id}" style="color:#000; padding: 12px; border-radius: 12px; max-width:900px; margin:0 auto; position: relative; aspect-ratio: 1.414 / 1; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc;">
        <div class="cert-inner" style="background: rgba(255,255,255,0.75); width:100%; height:100%; padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; border-radius:8px; backdrop-filter: blur(2px);">
            <div>
                <h1 style="font-size:32px; color:#c14a2a; text-transform:uppercase; letter-spacing: 1px; margin:0; font-family:'Monomakh', serif;">СЕРТИФИКАТ</h1>
                <p style="font-size:16px; margin-top:10px; color:#555;">подтверждает, что</p>
                <h2 style="font-size:28px; margin:12px 0; font-weight:bold; border-bottom:2px solid #ccc; display:inline-block; padding-bottom:5px; color:#000; font-family:'Sacramento', cursive;">${window.escapeHtml(window.state.student.name)}</h2>
                <p style="font-size:16px; color:#555;">успешно прошел(ла) обучение по программе</p>
                <h3 style="font-size:18px; margin-top:10px; color:#c14a2a;">${window.escapeHtml(courseName)}</h3>
                <div style="margin-top: 12px; font-size: 16px; background: rgba(255, 255, 255, 0.6); display: inline-block; padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(193, 74, 42, 0.3);"><b>Итоговая оценка:</b> ${finalGrade} (Ср. балл: ${avg})</div>
            </div>
            <div class="cert-foot" style="display:flex; justify-content:space-between; font-size:14px; margin-top:16px; padding: 0 8px; gap:12px;">
                <div style="text-align:left;"><p>Дата выдачи:</p><p style="font-weight:bold;">${new Date().toLocaleDateString('ru-RU')}</p></div>
                <div style="text-align:right;"><p>Подпись руководителя:</p><div style="border-bottom:1px solid #000; width:160px; height:24px;"></div></div>
            </div>
        </div>
        ${!isApproved ? `<div class="cert-stamp" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); font-size:72px; font-weight:bold; color:rgba(255,0,0,0.15); pointer-events:none; white-space:nowrap; z-index:10;">ОБРАЗЕЦ</div>` : ""}
    </div>`;
    
    var gradesList = Object.keys(window.state.results || {}).filter(k => !k.startsWith("topic_") && k !== "certificateApproved");
    gradesList.sort((a, b) => a.localeCompare(b));
    var gradesRows = gradesList.map(k => {
        var readableName = window.getReadableResultName(k);
        var gradeData = window.state.results[k];
        var grade = gradeData.grade || gradeData.correct || gradeData;
        if (typeof grade === 'object') grade = grade.grade || '—';
        var color = grade >= 4 ? '#2e7d32' : (grade >= 3 ? '#f57c00' : '#d32f2f');
        return `<tr><td style="border:1px solid #ddd; padding:10px; font-size:15px;">${window.escapeHtml(readableName)}</td><td style="border:1px solid #ddd; padding:10px; text-align:center; font-weight:bold; color:${color}; font-size:18px;">${grade}</td></tr>`;
    }).join("");
    
    var supplementHtml = `<div class="no-print" style="text-align:center; margin:20px 0;"><button class="btn" onclick="window.print()" style="padding: 12px 24px; font-size: 16px;">🖨 Распечатать сертификат и вкладыш</button></div>
        <div id="printable-supplement" class="${currentBg.id}" style="padding: 30px; border-radius: 12px; max-width:900px; margin:20px auto; border:1px solid #ccc;">
            <div style="background: rgba(255,255,255,0.85); padding: 20px; border-radius: 8px; color:#000;">
                <h2 style="text-align:center; color:#c14a2a; text-transform:uppercase; letter-spacing:1px;">Вкладыш оценок</h2>
                <hr style="border:0; border-top:1px solid #ccc; margin:20px 0;">
                <div style="display:flex; justify-content:space-between; font-size:16px; margin-bottom:20px;"><div><b>Студент:</b> ${window.escapeHtml(window.state.student.name)}</div><div><b>Группа:</b> ${window.escapeHtml(window.state.student.group)}</div></div>
                <table style="width:100%; border-collapse:collapse; margin-top:10px;"><thead><tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:12px; text-align:left; width: 70%;">Изученный материал</th><th style="border:1px solid #ddd; padding:12px; text-align:center; width: 30%;">Оценка</th></tr></thead><tbody>${gradesRows || '<tr><td colspan="2" style="text-align:center; padding:20px; color:#888;">Оценок пока нет</td></tr>'}</tbody></table>
                <div style="margin-top: 40px; text-align: right; font-size:16px;"><p>Итоговый средний балл: <b>${avg}</b></p></div>
            </div>
        </div>`;
    app.innerHTML += certBgSelectorHtml + certHtml + supplementHtml;
    window.applyGlobalEffects();
};
window.setCertBg = function(bgId) { window.state.certBg = bgId; window.saveStudentData(); window.renderCertificatePage(); };

window.renderStudentGradesPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Мои оценки";
    app.appendChild(el('<a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в профиль</a>'));
    var avg = window.getAverageGrade();
    app.innerHTML += `<section class="hero"><h1>📊 Мои оценки</h1><p>Средний балл: <b style="color:var(--gold); font-size:24px;">${avg}</b></p></section><div class="module" id="gradesContent"></div>`;
    var gradesList = Object.keys(window.state.results || {}).filter(k => !k.startsWith("topic_") && k !== "certificateApproved");
    var gradesRows = gradesList.map(k => {
        var title = window.getReadableResultName(k);
        var gradeData = window.state.results[k];
        var grade = gradeData.grade || gradeData.correct || gradeData;
        if (typeof grade === 'object') grade = grade.grade || '—';
        var color = grade >= 4 ? "var(--ok)" : (grade >= 3 ? "var(--gold)" : "var(--err)");
        return `<tr><td style="padding:10px; border:1px solid var(--border);">${title}</td><td style="padding:10px; border:1px solid var(--border); text-align:center; font-weight:bold; color:${color}; font-size:18px;">${grade}</td></tr>`;
    }).join("");
    document.getElementById("gradesContent").innerHTML = `<table style="width:100%; border-collapse:collapse; font-size:14px;"><thead><tr style="background:var(--card-soft);"><th style="padding:10px; border:1px solid var(--border);">Работа</th><th style="padding:10px; border:1px solid var(--border);">Оценка</th></tr></thead><tbody>${gradesRows || '<tr><td colspan="2" style="text-align:center; padding:20px; color:var(--muted);">У вас пока нет оценок.</td></tr>'}</tbody></table>`;
    window.applyGlobalEffects();
};

window.renderSimplePage = function(title, content) {
    var app = document.getElementById("app"); if (!app) return;
    app.innerHTML = `<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>${title}</h1></section><div class="module">${content}</div>`;
    if (window.applyGlobalEffects) window.applyGlobalEffects();
};

// ============================================================
// 5. ЛОГИН / ЛОГАУТ
// ============================================================
window.handleLogout = function() {
    window.state.student = null; window.state.staff = null;
    localStorage.removeItem("mdk.state"); window.renderUserChip();
    document.getElementById("loginOverlay").style.display = "flex"; location.hash = "#/";
};

function setupLogin() {
    var overlay = document.getElementById("loginOverlay"); if (!overlay) return;

    function showLoginError(msg) {
        var el = document.getElementById("loginError");
        if (el) { el.style.display = "block"; el.textContent = msg; }
        if (window.showToast) window.showToast(msg, "err");
    }
    function hideLoginError() {
        var el = document.getElementById("loginError");
        if (el) { el.style.display = "none"; el.textContent = ""; }
    }

    function applyAuthSession(res, email) {
        var role = (res.role || "student").toLowerCase();
        var name = res.name || email;
        var group = res.group || "";

        if (role === "teacher" || role === "admin") {
            window.state.staff = { name: name, role: role, email: res.email || email };
            window.state.student = null;
        } else {
            window.state.student = { name: name, group: group, email: res.email || email };
            window.state.staff = null;
        }

        if (window.saveStudentData) window.saveStudentData();
        if (window.renderUserChip) window.renderUserChip();
        overlay.style.display = "none";
        if (window.unlockAchievement) window.unlockAchievement("welcome");
        location.hash = "#/";
        if (window.showToast) window.showToast("Добро пожаловать, " + name + "!", "ok");
        if (window.router) window.router();
    }

    function doUnifiedLogin() {
        hideLoginError();
        var emailEl = document.getElementById("loginEmail") || document.getElementById("teacherUser");
        var passEl = document.getElementById("loginPassword") || document.getElementById("teacherPass");
        var btn = document.getElementById("btnLoginUnified") || document.getElementById("btnLoginTeacher");
        if (!emailEl || !passEl) {
            showLoginError("Форма входа не найдена. Обновите index.html или сбросьте кэш.");
            return;
        }

        var email = emailEl.value.trim();
        var pass = passEl.value;
        if (!email || !pass) {
            showLoginError("Введите email и пароль");
            return;
        }

        var btnDefaultText = btn && btn.id === "btnLoginTeacher" ? "Войти в журнал" : "Войти";
        if (btn) { btn.disabled = true; btn.textContent = "Вход..."; }

        function done() {
            if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
        }

        function tryLocalFallback() {
            if (email === "admin@portal.ru" && pass === "admin123") {
                applyAuthSession({ name: "Главный Администратор", role: "admin", email: email, group: "Администрация" }, email);
                return true;
            }
            if (email === "admin" && pass === "admin") {
                applyAuthSession({ name: "Администратор", role: "admin", email: "admin@portal.ru", group: "Администрация" }, email);
                return true;
            }
            if (email === "anna.sh@portal.ru" && pass === "teacher123") {
                applyAuthSession({ name: "Широких Анна Анатольевна", role: "teacher", email: email, group: "Преподаватели" }, email);
                return true;
            }
            return false;
        }

        if (window.API && window.API.login) {
            window.API.login(email, pass).then(function (res) {
                done();
                if (res && (res.ok || res.success)) {
                    applyAuthSession(res, email);
                } else {
                    if (!tryLocalFallback()) {
                        showLoginError((res && res.error) || "Неверный email или пароль");
                    }
                }
            }).catch(function (err) {
                done();
                console.warn("login error", err);
                if (!tryLocalFallback()) {
                    showLoginError("Ошибка сети. Проверьте интернет или нажмите «Сбросить кэш».");
                }
            });
        } else {
            done();
            if (!tryLocalFallback()) {
                showLoginError("Сервер недоступен");
            }
        }
    }

    var btn = document.getElementById("btnLoginUnified");
    if (btn) btn.onclick = doUnifiedLogin;

    var form = document.getElementById("unifiedLoginForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            doUnifiedLogin();
        });
    }

    var btnStudent = document.getElementById("btnLoginStudent");
    if (btnStudent) {
        btnStudent.onclick = function () {
            var tu = document.getElementById("teacherUser");
            var tp = document.getElementById("teacherPass");
            if (tu && tp && tu.value.trim() && tp.value) {
                doUnifiedLogin();
                return;
            }
            if (window.showToast) {
                window.showToast("Войдите справа: email и пароль (например anna.sh@portal.ru)", "err");
            }
        };
    }
    var btnTeacher = document.getElementById("btnLoginTeacher");
    if (btnTeacher) {
        btnTeacher.onclick = doUnifiedLogin;
    }
    ["teacherUser", "teacherPass"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("keydown", function(e) {
                if (e.key === "Enter") { e.preventDefault(); doUnifiedLogin(); }
            });
        }
    });
}

// ============================================================
// 6. РОУТЕР
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
    if (page === "videos") { window.renderVideosPage(); return; }
    if (page === "safety") { window.renderSafetyPage(); return; }
    if (page === "shop") { if (window.renderShopPage) window.renderShopPage(); else window.renderSimplePage("Магазин", "В разработке"); return; }
    if (page === "links") { if (window.renderLinksPage) window.renderLinksPage(); else window.renderSimplePage("Материалы", "В разработке"); return; }
    
    if (page === "training") {
        if (parts.length >= 2) { 
            if (parts[1] === "gcode") {
                window.renderGcodeTrainer();
            } else {
                var fn = window["renderTraining_" + parts[1].replace(".", "")]; 
                if (typeof fn === "function") fn(parts[1]); 
                else window.renderTrainingListPage(); 
            }
        } else {
            window.renderTrainingListPage();
        }
        return;
    }
    if (page === "final") {
        if (window.renderFinalExamPage) {
            window.renderFinalExamPage(parts.length >= 2 ? parts[1] : null);
        } else {
            window.renderSimplePage("Экзамен", "Движок экзамена не загружен");
        }
        return;
    }
    
    if (page === "arcade") { if (window.renderArcadePage) window.renderArcadePage(); else window.renderSimplePage("Игры", "В разработке"); return; }
    if (page === "rating") { if (window.renderRatingPage) window.renderRatingPage(); else window.renderSimplePage("Рейтинг", "В разработке"); return; }
    if (page === "schedule") { if (window.renderSchedulePage) window.renderSchedulePage(); else window.renderSimplePage("Расписание", "В разработке"); return; }
    if (page === "journal") { if (window.renderJournalPage) window.renderJournalPage(); else window.renderSimplePage("Журнал", "В разработке"); return; }
    if (page === "reports") { if (window.renderCourseReportsPage) window.renderCourseReportsPage(); else window.renderSimplePage("Отчеты", "В разработке"); return; }
    if (page === "admin") { if (window.renderAdminPanel) window.renderAdminPanel(); else window.renderSimplePage("Админка", "В разработке"); return; }
    window.renderSimplePage("404", "<p>Страница не найдена. Вернитесь на главную.</p>");
}

// ============================================================
// 7. МЕНЮ (ШТОРКА)
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
// 8. ИНИЦИАЛИЗАЦИЯ
// ============================================================
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", function() {
    setupLogin(); setupDrawer();
    var theme = localStorage.getItem("mdk.theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    router(); window.renderUserChip();
});

window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'GCODE_SUCCESS') {
        window.unlockAchievement('gcode_pro');
        window.showToast("Отличная работа! Вы написали правильный G-код.", "ok");
    }
});
