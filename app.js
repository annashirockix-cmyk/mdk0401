// app.js — Главный роутер и управление состоянием
"use strict";

// --- ГЛОБАЛЬНОЕ СОСТОЯНИЕ ---
window.state = {
    activeCourseId: localStorage.getItem("mdk.active") || "07.01",
    student: null, staff: null, xp: 0, results: {},
    purchasedThemes: [], unlockedAchievements: [], avatar: null, effect: null,
    certBg: "1.jpg", suppBg: "1.jpg"
};

try {
    var _s = JSON.parse(localStorage.getItem("mdk.student") || "null"); 
    if (_s && _s.name) window.state.student = _s;
    var _st = JSON.parse(localStorage.getItem("mdk.staff") || "null"); 
    if (_st && _st.name) window.state.staff = _st;
    window.state.xp = parseInt(localStorage.getItem("mdk.xp") || "0");
    window.state.certBg = localStorage.getItem("mdk.certBg") || "1.jpg";
    window.state.suppBg = localStorage.getItem("mdk.suppBg") || "1.jpg";
} catch (e) { console.warn("LocalStorage error", e); }

// Утилиты
window.$ = (id) => document.getElementById(id);
window.el = (html) => { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };
window.escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
window.navigateTo = (hash) => { window.location.hash = hash; };

window.showToast = function(msg, type) {
    var t = el(`<div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${type==='err'?'#ff4757':'#2ed573'};color:#fff;padding:12px 24px;border-radius:8px;z-index:99999;font-weight:bold;">${msg}</div>`);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
};

window.getLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;
window.studentKey = () => window.state.student ? (window.state.student.name.trim().toLowerCase() + "|" + window.state.student.group.trim().toLowerCase()) : null;

window.saveStudentData = async function() {
    if (!window.state.student) return;
    var key = window.studentKey();
    var payload = JSON.stringify({
        xp: window.state.xp, results: window.state.results,
        purchasedThemes: window.state.purchasedThemes, unlockedAchievements: window.state.unlockedAchievements,
        avatar: window.state.avatar, effect: window.state.effect
    });
    await window.API.saveStudent(key, window.state.student.name, window.state.student.group, payload);
};

window.addXP = async function(amount) {
    window.state.xp += amount;
    localStorage.setItem("mdk.xp", window.state.xp);
    await window.saveStudentData();
    window.renderUserChip();
};

// --- ИНИЦИАЛИЗАЦИЯ И РОУТИНГ ---
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", router);
    router();
});

function router() {
    const hash = window.location.hash.slice(1) || "/";
    const app = window.$("app");
    if (!app) return;
    
    // Очищаем контейнер
    app.innerHTML = "";
    
    // Если не авторизован — показываем экран входа
    if (!window.state.student && !window.state.staff) {
        renderLoginScreen();
        return;
    }

    // Рендерим каркас (Сайдбар + Шапка + Контент)
    app.appendChild(el(`
        <div id="sidebar" class="sidebar">
            <div class="sidebar-header">МДК Портал</div>
            <div class="sidebar-course">МДК 07.01 (ЧПУ) ⌄</div>
            <div id="xpCount" style="padding: 0 20px; color: var(--accent); font-weight: bold; cursor:pointer;" onclick="navigateTo('/shop')">★ ${window.state.xp} XP</div>
            <div id="userChip" class="user-info" style="cursor:pointer;" onclick="navigateTo('/profile')">
                <div class="user-avatar">👨‍🏭</div>
                <div>
                    <div style="font-weight: bold;">${window.state.student ? window.state.student.name : (window.state.staff ? window.state.staff.name : 'Гость')}</div>
                    <div style="color: var(--text-muted); font-size: 0.8rem;">${window.state.student ? window.state.student.group : 'Админ'}</div>
                </div>
            </div>
        </div>
    `));

    var mainWrap = el(`<div class="main-wrapper"></div>`);
    mainWrap.appendChild(el(`<header id="header" style="padding:20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:bold; color:var(--text-muted);"><span id="crumbs">Главная</span></div>
        <div style="display:flex; gap:10px;">
            <button class="btn ghost" onclick="window.renderUserChip()">Профиль</button>
            <button class="btn ghost" onclick="logout()">Выйти</button>
        </div>
    </header>`));
    
    var content = el(`<div id="content" class="main-content"></div>`);
    mainWrap.appendChild(content);
    
    // Нижнее меню (как было в оригинале)
    mainWrap.appendChild(el(`
        <div class="bottom-nav">
            <a href="#/">🏠 Главная</a>
            <a href="#/journal">📓 Журнал</a>
            <a href="#/training">🎯 Тренировка</a>
            <a href="#/final">📋 Экзамены</a>
            <a href="#/games">🎮 Игры</a>
            <a href="#/shop">🛒 Магазин</a>
            <a href="#/rating">🏆 Доска почета</a>
            <a href="#/schedule">📅 Расписание</a>
            <a href="#/links">📚 Полезное</a>
        </div>
    `));

    app.appendChild(mainWrap);

    // Маршрутизация к модулям
    if (hash === "/" || hash === "") {
        window.$("crumbs").textContent = "Главная";
        if (window.renderHomePage) window.renderHomePage(); 
        else content.innerHTML = "<h1>Главная</h1><p>Модуль главной страницы не загружен.</p>";
    } 
    else if (hash.startsWith("/topic/")) {
        var tId = hash.split("/")[2];
        if (window.renderTopicPage) window.renderTopicPage(tId);
    }
    else if (hash === "/journal") {
        window.$("crumbs").textContent = "Журнал";
        if (window.renderJournalPage) window.renderJournalPage();
    }
    else if (hash === "/games") {
        window.$("crumbs").textContent = "Игровая комната";
        if (window.renderArcadePage) window.renderArcadePage();
    }
    else if (hash === "/shop") {
        window.$("crumbs").textContent = "Магазин";
        if (window.renderShopPage) window.renderShopPage();
    }
    else if (hash === "/profile") {
        window.$("crumbs").textContent = "Профиль";
        if (window.renderProfilePage) window.renderProfilePage();
    }
    else if (hash === "/rating") {
        window.$("crumbs").textContent = "Доска почета";
        if (window.renderRatingPage) window.renderRatingPage();
    }
    else if (hash === "/schedule") {
        window.$("crumbs").textContent = "Расписание";
        if (window.renderSchedulePage) window.renderSchedulePage();
    }
    else if (hash === "/training") {
        window.$("crumbs").textContent = "Тренировка";
        if (window.renderTrainingPage) window.renderTrainingPage();
    }
    else if (hash === "/final") {
        window.$("crumbs").textContent = "Экзамены";
        if (window.renderFinalExamPage) window.renderFinalExamPage();
    }
    else if (hash === "/links") {
        window.$("crumbs").textContent = "Полезные материалы";
        if (window.renderLinksPage) window.renderLinksPage();
    }
    else {
        content.innerHTML = `<h2>404 Страница не найдена</h2>`;
    }
}

// --- ЭКРАН ВХОДА ---
function renderLoginScreen() {
    const app = window.$("app");
    app.innerHTML = `
        <div class="main-wrapper" style="align-items: center; justify-content: flex-start; padding-top: 50px;">
            <div class="top-header" style="border: none;">
                <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 2px;">ПОРТАЛ МДК</p>
                <h1>Оператор станков с ПУ</h1>
                <p>15.02.16 Технология машиностроения · ПМ.07</p>
            </div>
            
            <div class="login-section">
                <h2>Вход студента</h2>
                <p>Укажите ФИО и группу.</p>
                <div class="input-row">
                    <label>ФИО</label>
                    <input type="text" id="login-name" placeholder="Иванов Иван">
                </div>
                <div class="input-row">
                    <label>Группа</label>
                    <input type="text" id="login-group" placeholder="ТМ-4" value="ТМ-4-3">
                </div>
                <button class="btn" onclick="loginStudent()" style="background:var(--accent);color:#fff;">Войти</button>
            </div>

            <hr style="border-color: var(--border); width: 100%; max-width: 500px; margin: 0 auto;">

            <div class="login-section">
                <h2>Вход преподавателя</h2>
                <p>Используйте <b>teacher / teacher</b></p>
                <div class="input-row">
                    <label>Логин</label>
                    <input type="text" id="teacher-login" value="teacher">
                </div>
                <div class="input-row">
                    <label>Пароль</label>
                    <input type="password" id="teacher-pass" value="teacher">
                </div>
                <button class="btn" onclick="loginTeacher()" style="background:var(--accent);color:#fff;">Войти в журнал</button>
            </div>
        </div>
    `;
}

async function loginStudent() {
    const name = window.$("login-name").value.trim();
    const group = window.$("login-group").value.trim();
    if (!name || !group) return window.showToast("Заполните ФИО и группу!", "err");

    const studentId = `${name.toLowerCase()}|${group.toLowerCase()}`;
    
    // Регистрируем/проверяем в Google Таблице
    await window.API.saveStudent(studentId, name, group, '{}');

    window.state.student = { name, group };
    localStorage.setItem("mdk.student", JSON.stringify(window.state.student));
    window.navigateTo("/");
}

function loginTeacher() {
    const login = window.$("teacher-login").value;
    const pass = window.$("teacher-pass").value;

    if (login === "teacher" && pass === "teacher") {
        window.state.staff = { name: "Преподаватель", role: "teacher" };
        localStorage.setItem("mdk.staff", JSON.stringify(window.state.staff));
        window.navigateTo("/journal");
    } else {
        window.showToast("Неверный логин или пароль! (teacher / teacher)", "err");
    }
}

function logout() {
    localStorage.removeItem("mdk.student");
    localStorage.removeItem("mdk.staff");
    window.state.student = null;
    window.state.staff = null;
    window.navigateTo("/");
    location.reload();
}

// Заглушка для Главной, если нет отдельного файла
window.renderHomePage = function() {
    var c = window.$("content");
    var course = window.MDK_DATA[window.state.activeCourseId] || { topics: [] };
    var html = `<h2>Доступные темы</h2><div class="topics-grid">`;
    course.topics.forEach(t => {
        html += `<div class="module topic-card" onclick="navigateTo('/topic/${t.id}')" style="cursor:pointer; margin:0;">
            <h3 style="margin-top:0;">${t.title}</h3>
            <p style="color:var(--text-muted); font-size:14px;">${t.description || 'Перейти к изучению'}</p>
        </div>`;
    });
    html += `</div>`;
    c.innerHTML = html;
};