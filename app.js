"use strict";

window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, purchasedThemes: [],
    purchasedTextEffects: [], activeTextEffect: "none",
    purchasedBgEffects: [], activeBgEffect: "none", purchasedCardEffects: [], activeCardEffect: "none",
    unlockedAchievements: []
};

try { 
    var savedState = localStorage.getItem("mdk.state"); 
    if (savedState) Object.assign(window.state, JSON.parse(savedState)); 
} catch (e) {}

// Инициализация темы при загрузке
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

// ФУНКЦИЯ ДЛЯ СКРЫТИЯ/ПОКАЗА МЕНЮ ПРЕПОДАВАТЕЛЯ
window.updateMenuVisibility = function() {
    var isTeacher = window.state.staff && (window.state.staff.role === "teacher" || window.state.staff.role === "admin");
    
    var menuJournal = document.getElementById("menuJournal");
    var menuReports = document.getElementById("menuReports");
    var menuSchedule = document.getElementById("menuSchedule");
    var menuAdmin = document.getElementById("menuAdmin");
    
    var displayStyle = isTeacher ? "flex" : "none";
    
    if (menuJournal) menuJournal.style.display = displayStyle;
    if (menuReports) menuReports.style.display = displayStyle;
    if (menuSchedule) menuSchedule.style.display = displayStyle;
    if (menuAdmin) menuAdmin.style.display = displayStyle;
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
    if (bgFx !== "none") {
        document.body.classList.add(bgFx);
    }
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
    window.updateMenuVisibility(); // Обновляем меню при смене пользователя
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
// 2. СОХРАНЕНИЕ ОТВЕТОВ
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
// 3. РЕНДЕР СТРАНИЦ
// ==========================================
// (Функции renderVideosPage, renderTrainingListPage, renderGcodeTrainerPage, renderSafetyPage, renderPassportsPage, renderStudentGradesPage, renderTeacherJournalPage, addGrade, renderCertificatePage, renderProfilePage, renderAchievementsPage остаются без изменений, как в предыдущем ответе)

// ... [вставьте сюда код renderVideosPage и других функций из предыдущего ответа] ...
// Для краткости я не дублирую их здесь, они остаются точно такими же.

// ==========================================
// 4. СТРАНИЦА ТЕМЫ (С ВКЛАДКАМИ)
// ==========================================
window.renderTopicPage = function(courseId, topicId) {
    // ... (код функции renderTopicPage остается без изменений)
};

window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var mdkId = window.state.activeCourseId || "07.01"; 
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
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
// 5. РОУТИНГ И ВХОД
// ==========================================
function setupLogin() {
    var overlay = document.getElementById("loginOverlay"); if (!overlay) return;
    function applyAuthSession(res, email) {
        var role = (res.role || "student").toLowerCase();
        if (role === "teacher" || role === "admin") {
            window.state.staff = { name: res.name || email, role: role, email: email };
            window.state.student = null;
        } else {
            window.state.student = { name: res.name || email, group: res.group || "", email: email };
            window.state.staff = null;
        }
        window.saveStudentData(); window.renderUserChip();
        overlay.style.display = "none";
        window.unlockAchievement("welcome");
        location.hash = "#/"; window.router();
    }

    function doUnifiedLogin() {
        var email = document.getElementById("loginEmail").value.trim(); 
        var pass = document.getElementById("loginPassword").value;
        var btn = document.getElementById("btnLoginUnified");
        if (!email || !pass) { alert("Введите email и пароль"); return; }
        if (btn) { btn.disabled = true; btn.textContent = "Вход..."; }

        setTimeout(() => {
            if (btn) { btn.disabled = false; btn.textContent = "Войти"; }
            if (email === "anna.sh@portal.ru" && pass === "teacher123") {
                applyAuthSession({ name: "Широких Анна Анатольевна", role: "teacher" }, email);
            } else if (email === "student_n@portal.ru" && pass === "123456") {
                applyAuthSession({ name: "Студент Новиков", group: "Группа 1", role: "student" }, email);
            } else {
                applyAuthSession({ name: email.split('@')[0], group: "Группа 1", role: "student" }, email);
            }
        }, 500);
    }

    var btn = document.getElementById("btnLoginUnified"); 
    if (btn) btn.onclick = function(e) { e.preventDefault(); doUnifiedLogin(); };
    var form = document.getElementById("unifiedLoginForm"); 
    if (form) form.onsubmit = function(e) { e.preventDefault(); doUnifiedLogin(); };
}

window.handleLogout = function() {
    window.state.student = null; window.state.staff = null;
    localStorage.removeItem("mdk.state"); window.renderUserChip();
    document.getElementById("loginOverlay").style.display = "flex"; 
    location.hash = "#/"; window.renderHomePage();
};

window.router = function() {
    var hash = location.hash.slice(1) || "/"; 
    var parts = hash.split("/").filter(p => p);
    var overlay = document.getElementById("loginOverlay");

    if (!window.state.student && !window.state.staff) {
        if (overlay) overlay.style.display = "flex"; 
        return;
    }
    if (overlay) overlay.style.display = "none";

    var app = document.getElementById("app");
    if(!app) return;

    if (parts.length === 0 || parts[0] === "") { window.renderHomePage(); return; }
    var page = parts[0];
    
    if (page === "topic" && parts.length >= 3) { window.renderTopicPage(parts[1], parts[2]); return; }
    if (page === "videos") { window.renderVideosPage(); return; }
    if (page === "safety") { window.renderSafetyPage(); return; }
    if (page === "passports") { window.renderPassportsPage(); return; }
    if (page === "gcode-trainer") { window.renderGcodeTrainerPage(); return; }
    
    if (page === "training") { 
        if (parts.length > 1) {
            var mdkId = parts[1];
            if (mdkId === "07.01" && window.renderTraining_0701) window.renderTraining_0701(mdkId);
            else if (mdkId === "04.01" && window.renderTraining_0401) window.renderTraining_0401(mdkId);
            else if (mdkId === "02.01" && window.renderTraining_0201) window.renderTraining_0201(mdkId);
            else if (mdkId === "02.02" && window.renderTraining_0202) window.renderTraining_0202(mdkId);
            else window.renderTrainingListPage();
        } else {
            window.renderTrainingListPage(); 
        }
        return; 
    }
    
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

function setupDrawer() {
    var burgerBtn = document.getElementById('burgerBtn');
    var drawer = document.getElementById('drawer');
    var drawerOverlay = document.getElementById('drawerOverlay');
    var drawerClose = document.getElementById('drawerClose');
    if (burgerBtn && drawer && drawerOverlay) {
        burgerBtn.onclick = function() { drawer.classList.add('open'); drawerOverlay.classList.add('open'); };
        drawerOverlay.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        if (drawerClose) drawerClose.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        document.querySelectorAll('.drawer-item').forEach(item => {
            item.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        });
    }
}

window.addEventListener("hashchange", window.router);
window.addEventListener("DOMContentLoaded", function() {
    setupLogin(); 
    setupDrawer(); 
    window.renderUserChip();
    window.updateMenuVisibility(); // Вызываем при загрузке
    window.router();
});