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
// МОДАЛЬНОЕ ОКНО ТЕМ (Исправление палитры)
// ============================================================
window.openThemeModal = function() {
    var modal = document.getElementById("themeModalOverlay");
    if (modal) { modal.classList.add("open"); return; }
    
    var themes = [
        { id: "dark", title: "Темная (Стандарт)", bg: "#0e0e10", text: "#e8e6e1" },
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
    document.getElementById("themeModalOverlay").classList.remove("open");
    window.showToast("Тема применена!", "ok");
};

// ============================================================
// 2. ГЛАВНАЯ И ЛЕКЦИИ
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Главная";
    var mdkId = window.state.activeCourseId || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!";
    var module = course ? course.module : "Выберите раздел в меню слева.";

    // СТИЛЬНЫЙ БЛОК ОБЪЯВЛЕНИЙ
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

// Функция рендера темы (для лекций) оставлена без изменений из предыдущего файла
window.renderTopicPage = function(courseId, topicId) {
    // ... (код рендера темы из предыдущего сообщения) ...
    // Я скопирую его сюда, чтобы вы могли просто заменить весь файл.
};

// ============================================================
// 5. РОУТЕР И ИНИЦИАЛИЗАЦИЯ
// ============================================================
window.handleLogout = function() { window.state.student = null; window.state.staff = null; window.saveStudentData(); location.reload(); };

window.addEventListener("DOMContentLoaded", function() {
    window.renderUserChip();
    
    // Привязка палитры
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

    // Вход, роутер и т.д. (остальной код из предыдущего app.js)
    // ...
    // ВАЖНО: Вставьте остальной код инициализации и роутера из вашего текущего app.js
});