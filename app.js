"use strict";

// ============================================================
// 1. СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, signature: null, purchasedThemes: [],
    purchasedFonts: [], font: "default", certBg: "bg1", examSubmissions: [],
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
    try { localStorage.setItem("mdk.state", JSON.stringify(window.state)); if (window.state.student && window.API && window.studentKey()) { window.API.saveStudent(window.studentKey(), window.state.student.name, window.state.student.group, JSON.stringify(window.state)).catch(err => console.warn("Ошибка синхронизации")); } } catch (e) {}
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
// 3. СПИСКИ ТРЕНИРОВОК И ЭКЗАМЕНОВ
// ============================================================
window.renderTrainingListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎯 Тренировка</h1><p>Выберите предмет</p></section>';
    var grid = document.createElement("div"); grid.style = "display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px;";
    Object.values(window.MDK_DATA || {}).forEach(p => {
        var card = document.createElement("a"); card.href = "#/training/" + p.id; card.className = "module";
        card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">${p.shortName}</h3><p>${p.title}</p>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
};

window.renderFinalListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>📋 Итоговые экзамены</h1><p>Выберите предмет</p></section>';
    var grid = document.createElement("div"); grid.style = "display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px;";
    Object.values(window.MDK_DATA || {}).forEach(p => {
        var card = document.createElement("a"); card.href = "#/final/" + p.id; card.className = "module";
        card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--gold);">${p.shortName}</h3><p>${p.title}</p>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
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

window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    // ЗАЩИТА ОТ ПУСТОГО ЭКРАНА: если не залогинен - на главную
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
        </div>`;
        window.applyGlobalEffects(); return;
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
        </section>`;

        window.saveProfileChanges = function() {
            window.state.nickname = document.getElementById("profNick").value.trim();
            window.state.signature = document.getElementById("profBio").value.trim();
            window.saveStudentData(); window.renderUserChip(); window.showToast("Сохранено!", "ok"); window.renderProfilePage(route);
        };
    }
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
    if (window.state.student || window.state.staff) overlay.style.display = "none"; else overlay.style.display = "flex";
    
    var btnStudent = document.getElementById("btnLoginStudent");
    if (btnStudent) {
        btnStudent.onclick = function() {
            var name = document.getElementById("loginName").value.trim(); var group = document.getElementById("loginGroup").value.trim();
            if (!name || !group) return window.showToast("Введите ФИО и группу", "err");
            window.state.student = { name: name, group: group }; window.state.staff = null;
            window.saveStudentData(); window.renderUserChip(); overlay.style.display = "none";
            window.unlockAchievement('welcome'); location.hash = "#/"; window.showToast("Добро пожаловать, " + name + "!", "ok");
        };
    }
    var btnTeacher = document.getElementById("btnLoginTeacher");
    if (btnTeacher) {
        btnTeacher.onclick = function() {
            var user = document.getElementById("teacherUser").value.trim(); var pass = document.getElementById("teacherPass").value.trim();
            if (!user || !pass) return window.showToast("Введите логин и пароль", "err");
            btnTeacher.disabled = true; btnTeacher.textContent = "Вход...";
            if (window.API && window.API.login) {
                window.API.login(user, pass).then(res => {
                    btnTeacher.disabled = false; btnTeacher.textContent = "Войти в журнал";
                    if (res && res.ok) {
                        window.state.staff = { name: res.name || user, role: res.role || "teacher" }; window.state.student = null;
                        window.saveStudentData(); window.renderUserChip(); overlay.style.display = "none"; location.hash = "#/"; window.showToast("Добро пожаловать, " + window.state.staff.name + "!", "ok");
                    } else {
                        if (user === "admin" && pass === "admin") loginTeacherLocal(user); else window.showToast(res.error || "Неверный логин или пароль", "err");
                    }
                }).catch(err => {
                    btnTeacher.disabled = false; btnTeacher.textContent = "Войти в журнал";
                    if (user === "admin" && pass === "admin") loginTeacherLocal(user); else window.showToast("Ошибка сети", "err");
                });
            } else {
                btnTeacher.disabled = false; btnTeacher.textContent = "Войти в журнал";
                if (user === "admin" && pass === "admin") loginTeacherLocal(user); else window.showToast("Сервер недоступен", "err");
            }
        };
    }
    function loginTeacherLocal(user) {
        window.state.staff = { name: "Администратор", role: "admin" }; window.state.student = null;
        window.saveStudentData(); window.renderUserChip(); overlay.style.display = "none"; location.hash = "#/"; window.showToast("Добро пожаловать!", "ok");
    }
}

// ============================================================
// 6. РОУТЕР
// ============================================================
function router() {
    var hash = location.hash.slice(1) || "/"; var parts = hash.split("/").filter(p => p);
    
    // Если пользователь не авторизован, принудительно показываем логин
    if (!window.state.student && !window.state.staff) {
        var overlay = document.getElementById("loginOverlay"); if (overlay) overlay.style.display = "flex";
        window.renderHomePage(); return;
    }
    
    var overlay = document.getElementById("loginOverlay"); if (overlay) overlay.style.display = "none";
    if (parts.length === 0 || parts[0] === "") { window.renderHomePage(); return; }
    
    var page = parts[0];
    if (page === "topic" && parts.length >= 3) { window.renderTopicPage(parts[1], parts[2]); return; }
    if (page === "profile") { window.renderProfilePage(hash); return; }
    if (page === "grades") { if(window.renderStudentGradesPage) window.renderStudentGradesPage(); else window.renderSimplePage("Оценки", "В разработке"); return; }
    if (page === "certificate") { if(window.renderCertificatePage) window.renderCertificatePage(); else window.renderSimplePage("Сертификат", "В разработке"); return; }
    if (page === "achievements") { if(window.renderAchievementsPage) window.renderAchievementsPage(); else window.renderSimplePage("Достижения", "В разработке"); return; }
    if (page === "shop") { if (window.renderShopPage) window.renderShopPage(); else window.renderSimplePage("Магазин", "В разработке"); return; }
    if (page === "links") { if (window.renderLinksPage) window.renderLinksPage(); else window.renderSimplePage("Материалы", "В разработке"); return; }
    if (page === "training") {
        if (parts.length >= 2) { var fn = window["renderTraining_" + parts[1].replace(".", "")]; if (typeof fn === "function") fn(parts[1]); else window.renderTrainingListPage(); } else window.renderTrainingListPage();
        return;
    }
    if (page === "final") {
        if (parts.length >= 2) { var fn = window["renderFinal_" + parts[1].replace(".", "")]; if (typeof fn === "function") fn(parts[1]); else if (window.renderFinalExamPage) window.renderFinalExamPage(parts[1]); else window.renderFinalListPage(); } 
        else { if (window.renderFinalExamPage) window.renderFinalExamPage(); else window.renderFinalListPage(); }
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