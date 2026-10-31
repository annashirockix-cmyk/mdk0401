"use strict";

window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, purchasedThemes: [],
    purchasedTextEffects: [], activeTextEffect: "none",
    purchasedBgEffects: [], activeBgEffect: "none", purchasedCardEffects: [], activeCardEffect: "none",
    unlockedAchievements: []
};

window.customContent = { topics: [], files: [] };

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
    
    if (window.state.student && window.API) {
        window.API.saveResult({
            email: window.state.student.email,
            name: window.state.student.name,
            group: window.state.student.group,
            testId: `prac_${code}`,
            testTitle: "Практика: " + code,
            grade: 0,
            payload: val
        }).then(() => window.showToast("Ответ отправлен преподавателю!", "ok"))
          .catch(() => window.showToast("Ошибка отправки", "err"));
    } else {
        window.showToast("Ответ сохранен локально", "warn");
    }
};

window.saveSelfAnswer = function(code) {
    var val = document.getElementById(`self_input_${code}`).value;
    if (!window.state.results) window.state.results = {};
    window.state.results[`self_${code}`] = val;
    window.saveStudentData();
    
    if (window.state.student && window.API) {
        window.API.saveResult({
            email: window.state.student.email,
            name: window.state.student.name,
            group: window.state.student.group,
            testId: `self_${code}`,
            testTitle: "Самостоятельная: " + code,
            grade: 0,
            payload: val
        }).then(() => window.showToast("Ответ отправлен преподавателю!", "ok"))
          .catch(() => window.showToast("Ошибка отправки", "err"));
    } else {
        window.showToast("Ответ сохранен локально", "warn");
    }
};

// ==========================================
// 4. РЕНДЕР СТРАНИЦ
// ==========================================
// (Функции рендера страниц остаются без изменений)
// ... [Вставьте сюда функции renderVideosPage, renderTrainingListPage, и т.д. из предыдущего ответа, они не менялись] ...

// ==========================================
// 5. РОУТИНГ И ВХОД
// ==========================================
function setupLogin() {
    var overlay = document.getElementById("loginOverlay"); 
    if (!overlay) return;
    
    function applyAuthSession(res, email) {
        var role = (res.role || "student").toLowerCase();
        if (role === "teacher" || role === "admin") {
            window.state.staff = { name: res.name || email, role: role, email: email };
            window.state.student = null;
        } else {
            window.state.student = { name: res.name || email, group: res.group || "", email: email };
            window.state.staff = null;
        }
        window.saveStudentData(); 
        window.renderUserChip();
        overlay.style.display = "none";
        window.unlockAchievement("welcome");
        location.hash = "#/"; 
        window.router();
    }

    function doUnifiedLogin() {
        var email = document.getElementById("loginEmail").value.trim(); 
        var pass = document.getElementById("loginPassword").value;
        var btn = document.getElementById("btnLoginUnified");
        
        if (!email || !pass) { 
            alert("Введите email и пароль"); 
            return; 
        }
        
        btn.disabled = true; 
        btn.textContent = "Вход...";
        console.log("Попытка входа...", email);

        if (typeof window.API === "undefined") {
            alert("Критическая ошибка: API не загружен (файл api.js).");
            btn.disabled = false; 
            btn.textContent = "Войти";
            return;
        }

        window.API.login(email, pass).then(function(res) {
            console.log("Ответ от сервера:", res);
            if (res && res.success) {
                applyAuthSession(res, email);
            } else {
                alert("Ошибка входа: " + (res && res.error ? res.error : "Неизвестная ошибка"));
                btn.disabled = false; 
                btn.textContent = "Войти";
            }
        }).catch(function(err) {
            console.error("Ошибка при запросе логина:", err);
            alert("Ошибка сети или CORS. Проверьте, что вы переопубликовали Google Script (Новая версия) и обновили страницу с очисткой кэша.");
            btn.disabled = false; 
            btn.textContent = "Войти";
        });
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
    window.updateMenuVisibility();
    window.loadGlobalCustomContent(() => {
        window.router();
    });
});