"use strict";

window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, purchasedThemes: [],
    purchasedTextEffects: [], activeTextEffect: "none",
    purchasedBgEffects: [], activeBgEffect: "none", purchasedCardEffects: [], activeCardEffect: "none",
    unlockedAchievements: []
};

window.customContent = { topics: [], files: [] }; // Глобальное хранилище кастомного контента

try { 
    var savedState = localStorage.getItem("mdk.state"); 
    if (savedState) Object.assign(window.state, JSON.parse(savedState)); 
} catch (e) {}

var savedTheme = localStorage.getItem("mdk.theme_active") || "default";
document.documentElement.setAttribute("data-theme", savedTheme === "default" ? "dark" : savedTheme);

// ==========================================
// 1. УТИЛИТЫ И ЭФФЕКТЫ
// ==========================================
window.$ = function(id) { return document.getElementById(id); };
window.el = function(html) { var div = document.createElement("div"); div.innerHTML = html.trim(); return div.firstChild; };
window.escapeHtml = function(text) { if (!text) return ""; return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
window.showToast = function(msg, type) {
    var container = document.querySelector(".toast-container"); 
    if (!container) { 
        container = document.createElement("div"); 
        container.className = "toast-container"; 
        container.style = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:99999; display:flex; flex-direction:column; gap:10px;"; 
        document.body.appendChild(container); 
    }
    var t = document.createElement("div"); 
    t.className = "toast " + (type || ""); 
    t.style = "background:var(--card); color:var(--text); padding:10px 20px; border-radius:8px; border:1px solid var(--border); box-shadow:0 4px 12px rgba(0,0,0,0.5);"; 
    t.textContent = msg; 
    container.appendChild(t);
    setTimeout(function() { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
};

window.saveStudentData = function() {
    try { 
        localStorage.setItem("mdk.state", JSON.stringify(window.state)); 
        if (window.state.student && window.API) { 
            var key = (window.state.student.name || "").trim().toLowerCase() + "|" + (window.state.student.group || "").trim().toLowerCase();
            window.API.saveStudent(key, window.state.student.name, window.state.student.group, JSON.stringify(window.state)).catch(err => console.warn("Sync error")); 
        } 
    } catch (e) { console.error("Save error", e); }
};

window.getLevel = function(xp) { return Math.floor((xp || 0) / 100) + 1; };
window.getLevelTitle = function(lvl) { if (lvl < 3) return "Новичок"; if (lvl < 5) return "Ученик"; if (lvl < 8) return "Практикант"; if (lvl < 12) return "Мастер"; return "Эксперт"; };

window.updateMenuVisibility = function() {
    var isTeacher = window.state.staff && (window.state.staff.role === "teacher" || window.state.staff.role === "admin");
    var displayStyle = isTeacher ? "flex" : "none";
    ['menuJournal', 'menuReports', 'menuSchedule', 'menuAdmin'].forEach(id => {
        var el = document.getElementById(id);
        if (el) el.style.display = displayStyle;
    });
};

window.applyGlobalEffects = function() {
    var textFx = window.state.activeTextEffect || "none"; 
    var logo = document.getElementById("mainLogo"); 
    var userName = document.getElementById("userChipName");
    if (logo && userName) {
        logo.className = "brand-badge"; userName.className = "";
        if (textFx !== "none") { 
            logo.classList.add(textFx); userName.classList.add(textFx); 
            if (textFx === 'fx-glitch-text') { logo.setAttribute('data-text', logo.textContent); userName.setAttribute('data-text', userName.textContent); } 
        } else {
            logo.classList.add("rainbow-text");
        }
    }
    var cardFx = window.state.activeCardEffect || "none";
    document.querySelectorAll(".module").forEach(function(el) { el.classList.remove("fx-holo-card", "fx-3d-card"); if (cardFx !== "none") el.classList.add(cardFx); });
    
    document.body.className = ""; 
    var bgFx = window.state.activeBgEffect || "none";
    if (bgFx !== "none") document.body.classList.add(bgFx);
};

window.renderUserChip = function() {
    var nameEl = document.getElementById("userChipName"), groupEl = document.getElementById("userChipGroup"), avEl = document.getElementById("userChipAvatar");
    if (window.state.student) {
        var isVIP = window.isVIP ? window.isVIP() : false; 
        var crown = isVIP ? ' <span title="VIP" style="color:var(--gold); font-size:16px;">👑</span>' : '';
        if (nameEl) nameEl.innerHTML = (window.state.nickname || window.state.student.name) + crown;
        if (groupEl) groupEl.textContent = "Гр. " + window.state.student.group;
        if (avEl) avEl.innerHTML = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : "👨‍🎓";
    } else if (window.state.staff) {
        if (nameEl) nameEl.textContent = window.state.staff.name; 
        if (groupEl) groupEl.textContent = window.state.staff.role; 
        if (avEl) avEl.textContent = "👨‍🏫";
    } else {
        if (nameEl) nameEl.textContent = "Гость"; 
        if (groupEl) groupEl.textContent = "—"; 
        if (avEl) avEl.textContent = "👤";
    }
    var xpEl = document.getElementById("xpCount"); if (xpEl) xpEl.textContent = `🌟 ${window.state.xp} XP`;
    window.applyGlobalEffects();
    window.updateMenuVisibility();
};

window.unlockAchievement = function(id) {
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (!window.state.unlockedAchievements.includes(id)) { 
        window.state.unlockedAchievements.push(id); 
        window.saveStudentData(); 
        window.showToast("🏆 Получена ачивка!", "ok"); 
    }
};

// ==========================================
// 2. ЗАГРУЗКА КАСТОМНОГО КОНТЕНТА
// ==========================================
window.loadGlobalCustomContent = function(callback) {
    if (!window.API || !window.API.getCustomContent) {
        if (callback) callback();
        return;
    }
    window.API.getCustomContent().then(res => {
        if (res && res.success) {
            window.customContent.topics = res.data.filter(d => d.type === 'topic');
            window.customContent.files = res.data.filter(d => d.type === 'file');
        }
        if (callback) callback();
    }).catch(err => {
        console.error("Ошибка загрузки кастомного контента", err);
        if (callback) callback();
    });
};

// ==========================================
// 3. СОХРАНЕНИЕ ОТВЕТОВ
// ==========================================
window.savePracAnswer = function(code) {
    var val = document.getElementById(`prac_input_${code}`).value;
    if (!window.state.results) window.state.results = {};
    window.state.results[`prac_${code}`] = val;
    window.saveStudentData();
    window.showToast("Ответ сохранен!", "ok");
};

window.saveSelfAnswer = function(code) {
    var val = document.getElementById(`self_input_${code}`).value;
    if (!window.state.results) window.state.results = {};
    window.state.results[`self_${code}`] = val;
    window.saveStudentData();
    window.showToast("Ответ сохранен!", "ok");
};

// ==========================================
// 4. РЕНДЕР СТРАНИЦ
// ==========================================
window.renderVideosPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎬 Видеоуроки</h1></section><div class="module" id="videosList"></div>';
    var list = document.getElementById("videosList");
    var vids = window.GLOBAL_DATA && window.GLOBAL_DATA.videos ? window.GLOBAL_DATA.videos : [];
    if (!vids.length) { list.innerHTML = "<p>Видео пока нет.</p>"; return; }
    vids.forEach(v => {
        list.innerHTML += `<div style="margin-bottom:20px; background:var(--card-soft); padding:15px; border-radius:8px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${v.title}</b><p style="font-size:14px; margin:5px 0;">${v.description||''}</p><video src="${v.file}" controls preload="metadata" playsinline style="width:100%; border-radius:8px; max-height:70vh; background:#000;"><source src="${v.file}" type="video/mp4">Ваш браузер не поддерживает видео.</video><p style="margin-top:8px;"><a class="btn ghost" href="${v.file}" target="_blank" rel="noopener">Открыть файл</a></p></div>`;
    });
};

window.renderTrainingListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎯 Тренировка</h1><p>Выберите предмет или тренажер</p></section>';
    var grid = document.createElement("div"); grid.style.cssText = "display:flex; flex-direction:column; gap:12px;";
    var gcodeCard = document.createElement("a"); gcodeCard.href = "#/gcode-trainer"; gcodeCard.className = "module"; gcodeCard.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--accent); border-radius:12px;";
    gcodeCard.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">📐 Тренажер G-кода</h3><p>Интерактивный симулятор.</p>`;
    grid.appendChild(gcodeCard);
    var mdkList = [{ id: "07.01", title: "МДК 07.01" }, { id: "04.01", title: "МДК 04.01" }, { id: "02.01", title: "МДК 02.01" }, { id: "02.02", title: "МДК 02.02" }];
    mdkList.forEach(mdk => {
        var card = document.createElement("a"); card.href = "#/training/" + mdk.id; card.className = "module"; card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">${mdk.title}</h3>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
};

window.renderGcodeTrainerPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/training" style="color:var(--accent);">← Назад</a><section class="hero"><h1>📐 Тренажер G-кода</h1></section>';
    var iframe = document.createElement("iframe"); iframe.src = "./gcode_trainer_advanced.html"; iframe.style = "width:100%; height:80vh; border:none; border-radius:12px; background:#0d1117;"; iframe.setAttribute("allow", "fullscreen"); app.appendChild(iframe);
};

window.renderSafetyPage = function() { /* ... код из предыдущего ответа ... */ };
window.renderPassportsPage = function() { /* ... код из предыдущего ответа ... */ };
window.renderStudentGradesPage = function() { /* ... код из предыдущего ответа ... */ };
window.renderTeacherJournalPage = function() { /* ... код из предыдущего ответа ... */ };
window.addGrade = function() { /* ... код из предыдущего ответа ... */ };
window.renderCertificatePage = function() { /* ... код из предыдущего ответа ... */ };
window.renderProfilePage = function() { /* ... код из предыдущего ответа ... */ };
window.renderAchievementsPage = function() { /* ... код из предыдущего ответа ... */ };

// ==========================================
// 5. СТРАНИЦА ТЕМЫ
// ==========================================
window.renderTopicPage = function(courseId, topicId) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var course = window.MDK_DATA[courseId]; if (!course) { app.innerHTML = '<div class="module">Курс не найден</div>'; return; }
    var topic = null; 
    
    // Ищем в статических
    course.sections.forEach(s => { s.topics.forEach(t => { if (t.id === topicId) topic = t; }); });
    
    // Ищем в кастомных (если не нашли)
    if (!topic && window.customContent.topics) {
        var ct = window.customContent.topics.find(t => t.id === topicId);
        if (ct) {
            topic = {
                id: ct.id, code: ct.title.split(' ')[0], title: ct.title.split(' ').slice(1).join(' '),
                lectures: [{ code: "Лекция", title: ct.title, content: ct.content }],
                practicals: [], selfWork: [], test: []
            };
        }
    }

    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена</div>'; return; }
    
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = topic.code + " " + topic.title;
    app.appendChild(el(`<a class="backlink" href="#/" style="color:var(--accent);">← Назад к плану</a>`));
    app.appendChild(el(`<section class="hero"><h1 class="neon-text">${topic.code} ${topic.title}</h1></section>`));
    
    var tabsHtml = `<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
        <button class="btn tab active" id="tab-lectures" onclick="window.switchTopicTab('lectures')">📖 Лекции</button>
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
            if (topic.lectures && topic.lectures.length) {
                topic.lectures.forEach(lec => {
                    contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div></details>`;
                });
            } else {
                contentArea.innerHTML += "<p>Текстовых лекций нет.</p>";
            }

            // Прикрепленные файлы
            var files = window.customContent.files ? window.customContent.files.filter(f => f.mdkId === courseId && f.topicId === topicId) : [];
            if (files.length > 0) {
                var filesHtml = `<div style="margin-top:20px; padding-top:15px; border-top:2px solid var(--border);">
                    <h3 style="color:var(--accent); margin-bottom:10px;">📎 Прикрепленные материалы:</h3>
                    <div style="display:flex; flex-direction:column; gap:8px;">`;
                files.forEach(f => {
                    filesHtml += `<a href="${f.fileUrl}" target="_blank" class="btn ghost" style="justify-content:flex-start; padding:12px 15px; text-align:left;">
                        <span style="font-size:20px;">📄</span> <b>${f.title}</b>
                    </a>`;
                });
                filesHtml += `</div></div>`;
                contentArea.innerHTML += filesHtml;
            }

            window.unlockAchievement('reader');
        }
        // ... остальные вкладки (practicals, selfwork, test) остаются без изменений ...
    };

    window.startInlineTest = function(topicId, selfWorkCode) {
        // ... логика теста из предыдущего ответа ...
    };
    window.switchTopicTab('lectures');
};

window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var mdkId = window.state.activeCourseId || "07.01"; 
    
    // Клонируем структуру
    var course = window.MDK_DATA && window.MDK_DATA[mdkId] ? JSON.parse(JSON.stringify(window.MDK_DATA[mdkId])) : null;

    // Добавляем кастомные темы
    if (course) {
        var customTopics = window.customContent.topics ? window.customContent.topics.filter(t => t.mdkId === mdkId) : [];
        if (customTopics.length > 0) {
            if (course.sections.length > 0) {
                customTopics.forEach(ct => {
                    course.sections[0].topics.push({
                        id: ct.id, code: ct.title.split(' ')[0], title: ct.title.split(' ').slice(1).join(' ')
                    });
                });
            } else {
                course.sections.push({ title: "Добавленные темы", topics: customTopics.map(ct => ({ id: ct.id, code: ct.title.split(' ')[0], title: ct.title.split(' ').slice(1).join(' ') })) });
            }
        }
    }

    var title = course ? course.title : "Добро пожаловать!"; 
    var module = course ? course.module : "Выберите раздел.";
    
    var paletteHtml = `<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">`;
    Object.keys(window.MDK_DATA || {}).forEach(id => {
        var c = window.MDK_DATA[id];
        var isActive = id === mdkId;
        paletteHtml += `<button class="btn ${isActive ? '' : 'ghost'}" onclick="window.state.activeCourseId='${id}'; window.saveStudentData(); window.renderHomePage();" style="padding:10px 20px;">${c.shortName}</button>`;
    });
    paletteHtml += `</div>`;

    app.innerHTML = `<section class="hero" style="text-align: left; padding: 40px;">
        <span class="brand-badge" style="margin-bottom: 10px; display: inline-block;">${course ? course.shortName : "Портал"}</span>
        <h1 style="font-size: 2.2rem; margin-bottom: 10px;">${title}</h1>
        <p style="font-size: 1.1rem; color: var(--text-soft);">${module}</p>
        ${paletteHtml}
    </section>`;
    
    if (course && course.sections) {
        var contentHtml = '<div class="steps-title" style="font-size:20px; font-weight:bold; margin:20px 0 10px;">Учебный план</div>';
        course.sections.forEach(function(section) {
            contentHtml += `<div class="module" style="padding: 20px; margin-bottom: 15px;"><h3 style="color: var(--accent); margin-top: 0;">${section.title}</h3><div style="display: flex; flex-direction: column; gap: 10px;">`;
            section.topics.forEach(function(topic) {
                var isDone = window.state.results && window.state.results[`topic_${topic.id}`] ? "✅ " : "";
                contentHtml += `<a href="#/topic/${mdkId}/${topic.id}" class="topic" style="background: var(--card-soft); padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between; text-decoration: none; color: var(--text); border: 1px solid var(--border); transition: 0.2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'"><span>${isDone}<b>${topic.code}</b> ${topic.title}</span><span>→</span></a>`;
            });
            contentHtml += `</div></div>`;
        });
        app.innerHTML += contentHtml;
    }
    window.applyGlobalEffects();
};

// ==========================================
// 6. РОУТИНГ И ВХОД
// ==========================================
function setupLogin() { /* ... логика из предыдущего ответа ... */ }
window.handleLogout = function() { /* ... */ };

window.router = function() {
    var hash = location.hash.slice(1) || "/"; 
    var parts = hash.split("/").filter(p => p);
    var overlay = document.getElementById("loginOverlay");

    if (!window.state.student && !window.state.staff) {
        if (overlay) overlay.style.display = "flex"; 
        return;
    }
    if (overlay) overlay.style.display = "none";

    var app = document.getElementById("app"); if(!app) return;

    if (parts.length === 0 || parts[0] === "") { window.renderHomePage(); return; }
    var page = parts[0];
    
    if (page === "topic" && parts.length >= 3) { window.renderTopicPage(parts[1], parts[2]); return; }
    if (page === "videos") { window.renderVideosPage(); return; }
    if (page === "safety") { window.renderSafetyPage(); return; }
    if (page === "passports") { window.renderPassportsPage(); return; }
    if (page === "gcode-trainer") { window.renderGcodeTrainerPage(); return; }
    if (page === "training") { /* ... */ return; }
    if (page === "grades") { window.renderStudentGradesPage(); return; }
    if (page === "journal") { window.renderTeacherJournalPage(); return; }
    if (page === "certificate") { window.renderCertificatePage(); return; }
    if (page === "profile") { window.renderProfilePage(hash); return; }
    if (page === "achievements") { window.renderAchievementsPage(); return; }
    if (page === "shop" && window.renderShopPage) { window.renderShopPage(); return; }
    if (page === "games" && window.renderArcadePage) { window.renderArcadePage(); return; }
    if (page === "final" && window.renderFinalExamPage) { window.renderFinalExamPage(parts[1]); return; }
    if (page === "reports" && window.renderCourseReportsPage) { window.renderCourseReportsPage(); return; }
    if (page === "schedule" && window.renderSchedulePage) { window.renderSchedulePage(); return; }
    if (page === "rating" && window.renderRatingPage) { window.renderRatingPage(); return; }
    if (page === "admin" && window.renderAdminPanel) { window.renderAdminPanel(); return; }
    
    window.renderHomePage();
};

function setupDrawer() { /* ... */ }

window.addEventListener("hashchange", window.router);
window.addEventListener("DOMContentLoaded", function() {
    setupLogin(); 
    setupDrawer(); 
    window.renderUserChip();
    window.updateMenuVisibility();
    
    // Загружаем кастомный контент перед стартом
    window.loadGlobalCustomContent(() => {
        window.router();
    });
});