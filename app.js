// app.js — Главный роутер и управление состоянием
"use strict";

// === ГЛОБАЛЬНОЕ СОСТОЯНИЕ ===
window.state = {
    activeCourseId: localStorage.getItem("mdk.active") || "07.01",
    student: null, staff: null, xp: 0, results: {},
    purchasedThemes: [], unlockedAchievements: [], avatar: null, effect: null
};

try {
    var _s = JSON.parse(localStorage.getItem("mdk.student") || "null"); 
    if (_s && _s.name) window.state.student = _s;
    var _st = JSON.parse(localStorage.getItem("mdk.staff") || "null"); 
    if (_st && _st.name) window.state.staff = _st;
    window.state.xp = parseInt(localStorage.getItem("mdk.xp") || "0");
} catch (e) { console.warn("Ошибка чтения localStorage:", e); }

// === УТИЛИТЫ ===
window.$ = (id) => document.getElementById(id);
window.navigateTo = (hash) => { window.location.hash = hash; };

window.showToast = function(msg, type) {
    var t = document.createElement("div");
    t.style = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${type==='err'?'#ff4757':'#2ed573'};color:#fff;padding:12px 24px;border-radius:8px;z-index:99999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
};

window.getLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;
window.studentKey = () => window.state.student ? (window.state.student.name.trim().toLowerCase() + "|" + window.state.student.group.trim().toLowerCase()) : null;

window.saveStudentData = async function() {
    if (!window.state.student || !window.API) return;
    var payload = JSON.stringify({
        xp: window.state.xp, results: window.state.results,
        purchasedThemes: window.state.purchasedThemes, avatar: window.state.avatar
    });
    await window.API.saveStudent(window.studentKey(), window.state.student.name, window.state.student.group, payload);
};

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", router);
    router();
});

// === ОБНОВЛЕНИЕ UI ===
function updateUI() {
    var nameEl = $("user-name");
    var groupEl = $("user-group");
    var xpEl = $("xp-value");
    
    if (nameEl) nameEl.textContent = window.state.student ? window.state.student.name : (window.state.staff ? window.state.staff.name : 'Гость');
    if (groupEl) groupEl.textContent = window.state.student ? window.state.student.group : (window.state.staff ? 'Админ' : 'Не авторизован');
    if (xpEl) xpEl.textContent = window.state.xp;
}

// === РОУТИНГ ===
function router() {
    var hash = window.location.hash.slice(1) || "/";
    var app = $("app");
    var crumbs = $("crumbs");
    var loginScreen = $("login-screen");
    var layout = document.querySelector(".layout");

    // 1. Проверка авторизации
    if (!window.state.student && !window.state.staff) {
        if (loginScreen) loginScreen.style.display = "block";
        if (layout) layout.style.display = "none";
        return;
    } else {
        if (loginScreen) loginScreen.style.display = "none";
        if (layout) layout.style.display = "flex";
    }

    updateUI();

    // 2. Роутинг
    if (!app) return;

    if (hash === "/" || hash === "") {
        if (crumbs) crumbs.textContent = "Главная";
        renderHomePage(app);
    } 
    else if (hash === "/journal") {
        if (crumbs) crumbs.textContent = "Журнал";
        if (window.renderJournalPage) window.renderJournalPage();
        else app.innerHTML = "<h2>Ошибка: journal.js не загружен</h2>";
    }
    else if (hash === "/games") {
        if (crumbs) crumbs.textContent = "Игры";
        if (window.renderArcadePage) window.renderArcadePage();
    }
    else if (hash === "/shop") {
        if (crumbs) crumbs.textContent = "Магазин";
        if (window.renderShopPage) window.renderShopPage();
    }
    else if (hash === "/profile") {
        if (crumbs) crumbs.textContent = "Профиль";
        if (window.renderProfilePage) window.renderProfilePage();
    }
    else if (hash === "/rating") {
        if (crumbs) crumbs.textContent = "Доска почета";
        if (window.renderRatingPage) window.renderRatingPage();
    }
    else if (hash === "/training") {
        if (crumbs) crumbs.textContent = "Тренировка";
        if (window.renderTrainingPage) window.renderTrainingPage();
    }
    else if (hash === "/schedule") {
        if (crumbs) crumbs.textContent = "Расписание";
        if (window.renderSchedulePage) window.renderSchedulePage();
    }
    else if (hash === "/links") {
        if (crumbs) crumbs.textContent = "Полезное";
        if (window.renderLinksPage) window.renderLinksPage();
    }
    else {
        if (crumbs) crumbs.textContent = "404";
        app.innerHTML = "<h2>404 Страница не найдена</h2>";
    }
}

// === ЛОГИКА ВХОДА ===
window.loginStudent = async function() {
    const name = $("login-name").value.trim();
    const group = $("login-group").value.trim();
    if (!name || !group) return window.showToast("Заполните ФИО и группу!", "err");

    const studentId = `${name.toLowerCase()}|${group.toLowerCase()}`;
    try { 
        if (window.API) await window.API.saveStudent(studentId, name, group, '{"xp":0,"results":{}}'); 
    } catch (e) { console.warn("Ошибка сохранения в БД:", e); }

    window.state.student = { name, group };
    window.state.xp = 0;
    localStorage.setItem("mdk.student", JSON.stringify(window.state.student));
    window.navigateTo("/");
    router();
};

window.loginTeacher = function() {
    const login = $("teacher-login").value;
    const pass = $("teacher-pass").value;

    if (login === "teacher" && pass === "teacher") {
        window.state.staff = { name: "Преподаватель", role: "teacher" };
        localStorage.setItem("mdk.staff", JSON.stringify(window.state.staff));
        window.navigateTo("/journal");
        router();
    } else {
        window.showToast("Неверный логин или пароль!", "err");
    }
};

window.logout = function() {
    localStorage.removeItem("mdk.student");
    localStorage.removeItem("mdk.staff");
    window.state.student = null;
    window.state.staff = null;
    window.navigateTo("/");
    router();
};

// === ГЛАВНАЯ СТРАНИЦА ===
function renderHomePage(app) {
    var course = window.MDK_DATA ? window.MDK_DATA[window.state.activeCourseId] : null;
    if (!course) return app.innerHTML = "<p>Данные курса не загружены (проверьте data-07.01.js).</p>";

    var html = `<h2>Доступные темы</h2><div class="topics-grid">`;
    course.sections.forEach(sec => {
        sec.topics.forEach(t => {
            html += `<div class="module topic-card" onclick="window.navigateTo('/topic/${t.id}')" style="cursor:pointer; margin:0;">
                <h3 style="margin-top:0;">${t.title}</h3>
                <p style="color:var(--text-muted); font-size:14px;">${t.code || 'Перейти'}</p>
            </div>`;
        });
    });
    html += `</div>`;
    app.innerHTML = html;
}