// app.js — Главный роутер
"use strict";

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
} catch (e) {}

window.navigateTo = (hash) => { window.location.hash = hash; };
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

document.addEventListener("DOMContentLoaded", () => {
    window.syncPrograms();
    window.buildCourseSelector();
    window.addEventListener("hashchange", router);
    router();
});

function router() {
    var hash = window.location.hash.slice(1) || "/";
    var app = document.getElementById("app");
    var crumbs = document.getElementById("crumbs");
    var loginScreen = document.getElementById("login-screen");
    var layout = document.getElementById("main-layout");

    // Авторизация
    if (!window.state.student && !window.state.staff) {
        if (loginScreen) loginScreen.style.display = "block";
        if (layout) layout.style.display = "none";
        return;
    } else {
        if (loginScreen) loginScreen.style.display = "none";
        if (layout) layout.style.display = "flex";
    }

    if (window.renderUserChip) window.renderUserChip();
    if (!app) return;

    // Роутинг
    if (hash === "/" || hash === "") {
        if (crumbs) crumbs.textContent = "Главная";
        renderHomePage(app);
    } 
    else if (hash === "/journal") {
        if (crumbs) crumbs.textContent = "Журнал";
        if (window.renderJournalPage) window.renderJournalPage();
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
    else if (hash.indexOf("/topic/") === 0) {
        if (crumbs) crumbs.textContent = "Тема";
        window.renderTopicPage(hash.split("/")[2]);
    }
    else if (hash === "/final" || hash.indexOf("/final/") === 0) {
        if (crumbs) crumbs.textContent = "Экзамены";
        if (window.renderFinalExamPage) window.renderFinalExamPage(hash.split("/")[2]);
    }
    else if (hash.indexOf("/training/") === 0) {
        if (crumbs) crumbs.textContent = "Тренировка";
        if (window.renderTrainingPage) window.renderTrainingPage(hash.split("/")[2]);
    }
    else {
        if (crumbs) crumbs.textContent = "404";
        app.innerHTML = "<h2>404 Страница не найдена</h2>";
    }
}

// === ВХОД ===
window.loginStudent = async function() {
    const name = document.getElementById("login-name").value.trim();
    const group = document.getElementById("login-group").value.trim();
    if (!name || !group) return alert("Заполните ФИО и группу!");

    const studentId = `${name.toLowerCase()}|${group.toLowerCase()}`;
    try { 
        if (window.API) await window.API.saveStudent(studentId, name, group, '{"xp":0,"results":{}}'); 
    } catch (e) { console.warn(e); }

    window.state.student = { name, group };
    window.state.xp = 0;
    localStorage.setItem("mdk.student", JSON.stringify(window.state.student));
    window.navigateTo("/");
    router();
};

window.loginTeacher = function() {
    const login = document.getElementById("teacher-login").value;
    const pass = document.getElementById("teacher-pass").value;

    if (login === "teacher" && pass === "teacher") {
        window.state.staff = { name: "Преподаватель", role: "teacher" };
        localStorage.setItem("mdk.staff", JSON.stringify(window.state.staff));
        window.navigateTo("/journal");
        router();
    } else {
        alert("Неверный логин или пароль!");
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

// === ГЛАВНАЯ ===
function renderHomePage(app) {
    var course = window.MDK_DATA ? window.MDK_DATA[window.state.activeCourseId] : null;
    if (!course) return app.innerHTML = "<p>Данные курса не загружены.</p>";

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