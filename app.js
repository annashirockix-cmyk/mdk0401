"use strict";

// ============================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, signature: null, purchasedThemes: [], purchasedFonts: [], font: "default", certBg: "bg1.jfif"
};

try {
    var savedState = localStorage.getItem("mdk.state");
    if (savedState) { Object.assign(window.state, JSON.parse(savedState)); }
} catch(e) {}

window.saveStudentData = function() {
    try { localStorage.setItem("mdk.state", JSON.stringify(window.state)); } catch(e) {}
};

window.studentKey = function() {
    if (!window.state.student) return "";
    return (window.state.student.name || "").trim().toLowerCase() + "|" + (window.state.student.group || "").trim().toLowerCase();
};

window.getLevel = function(xp) { return Math.floor((xp || 0) / 100) + 1; };
window.getLevelTitle = function(lvl) {
    if (lvl < 3) return "Новичок"; if (lvl < 5) return "Ученик"; if (lvl < 8) return "Практикант"; if (lvl < 12) return "Мастер"; return "Эксперт";
};

window.setCertBg = function(bg) {
    window.state.certBg = bg; window.saveStudentData(); window.renderCertificatePage();
};

window.renderUserChip = function() {
    var nameEl = document.getElementById("userChipName");
    var groupEl = document.getElementById("userChipGroup");
    var avEl = document.getElementById("userChipAvatar");
    if (window.state.student) {
        if (nameEl) nameEl.textContent = window.state.nickname || window.state.student.name;
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

window.$ = window.$ || function(id) { return document.getElementById(id); };
window.el = window.el || function(html) { var div = document.createElement("div"); div.innerHTML = html.trim(); return div.firstChild; };
window.escapeHtml = window.escapeHtml || function(text) { if (!text) return ""; return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
window.showToast = window.showToast || function(msg, type) {
    var container = document.querySelector(".toast-container");
    if (!container) { container = document.createElement("div"); container.className = "toast-container"; document.body.appendChild(container); }
    var t = document.createElement("div"); t.className = "toast " + (type || ""); t.textContent = msg;
    container.appendChild(t); setTimeout(function() { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
};

// ============================================================
// 2. РЕНДЕР ГЛАВНОЙ И ЛЕКЦИЙ
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Главная";
    var mdkId = window.state.activeCourseId || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!";
    var module = course ? course.module : "Выберите раздел в меню слева.";

    app.innerHTML = `<section class="hero" style="text-align: left; padding: 40px;">
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
                contentHtml += `<a href="#/topic/${mdkId}/${topic.id}" class="topic" style="background: var(--card-soft); padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between; text-decoration: none; color: var(--text);">
                    <span><b>${topic.code}</b> ${topic.title}</span><span>→</span>
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

    if (topic.lectures && topic.lectures.length) {
        var lecHtml = '<div class="module"><h2>📖 Лекции</h2>';
        topic.lectures.forEach((lec) => {
            lecHtml += `<details class="lec-accordion" style="margin-bottom:10px; background:var(--card-soft); border:1px solid var(--border); border-radius:8px;">
                <summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary>
                <div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6;">${lec.content || "<p>Текст лекции в разработке...</p>"}</div>
            </details>`;
        });
        lecHtml += '</div>';
        app.innerHTML += lecHtml;
    }
};

// ============================================================
// 3. ПРОФИЛЬ (С РЕДАКТИРОВАНИЕМ НИКА И ПОДПИСИ)
// ============================================================
window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    var isTeacher = !!window.state.staff;
    var targetKey = route.split("/")[2] ? decodeURIComponent(route.split("/")[2]) : null;

    if (isTeacher && targetKey) {
        // Просмотр профиля студента преподавателем
        app.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
        window.API.getStudentData(targetKey).then(res => {
            app.innerHTML = '<a class="backlink" href="#/journal" style="color:var(--accent);">← Назад</a>';
            if (!res || !res.ok) { app.innerHTML += '<div class="module">Студент не найден.</div>'; return; }
            var p = {}; try { p = JSON.parse(res.payload || "{}"); } catch(e) {}
            var avHtml = p.avatar ? `<img src="${p.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
            app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
                <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div>
                <h2>${window.escapeHtml(targetKey.split("|")[0])}</h2>
                <p>Группа: ${window.escapeHtml(targetKey.split("|")[1] || "—")}</p>
                <div style="display:inline-block; background:var(--card-soft); padding:10px 20px; border-radius:20px;"><b style="color:var(--gold);">${p.xp || 0} XP</b></div>
                <p style="margin-top:20px; font-style:italic; color:var(--muted);">"${window.escapeHtml(p.signature || 'Без подписи')}"</p>
            </section>`;
        });
    } else if (window.state.student) {
        // Свой профиль (с возможностью редактирования)
        var lvl = window.getLevel(window.state.xp);
        var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";

        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
            <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div>
            <h2 style="margin-bottom:10px;">${window.escapeHtml(window.state.nickname || window.state.student.name)}</h2>
            <p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
            <div style="display:inline-block; background:var(--card-soft); padding:10px 20px; border-radius:20px; margin-bottom:20px;"><b style="color:var(--gold);">${window.state.xp} XP</b> · Уровень ${lvl} (${window.getLevelTitle(lvl)})</div>
            
            <div style="max-width:400px; margin: 20px auto; text-align:left; background:var(--card-soft); padding:20px; border-radius:12px; border:1px solid var(--border);">
                <h3 style="margin-top:0; color:var(--accent);">Редактировать профиль</h3>
                <label style="font-size:13px; font-weight:bold;">Никнейм</label>
                <input type="text" id="profNick" class="self-input" value="${window.escapeHtml(window.state.nickname || '')}" placeholder="Ваш ник" maxlength="20">
                <label style="font-size:13px; font-weight:bold;">Подпись (статус)</label>
                <input type="text" id="profBio" class="self-input" value="${window.escapeHtml(window.state.signature || '')}" placeholder="Коротко о себе" maxlength="50">
                <button class="btn" onclick="window.saveProfileChanges()" style="width:100%; margin-top:10px;">💾 Сохранить</button>
            </div>
            <br>
            <a href="#/shop" class="btn">🛒 Магазин XP</a>
        </section>`;

        window.saveProfileChanges = function() {
            window.state.nickname = document.getElementById("profNick").value.trim();
            window.state.signature = document.getElementById("profBio").value.trim();
            window.saveStudentData();
            window.renderUserChip();
            window.showToast("Профиль сохранен!", "ok");
            window.renderProfilePage(route); // Перерисовываем
        };
    } else {
        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;"><div style="font-size:60px; margin-bottom:20px;">👨‍🏫</div><h2>${window.escapeHtml(window.state.staff.name)}</h2><p>Роль: ${window.state.staff.role}</p></section>`;
    }
};

// ============================================================
// 4. МОДАЛЬНОЕ ОКНО ТЕМ
// ============================================================
window.openThemeModal = function() {
    var modal = document.getElementById("themeModalOverlay");
    if (modal) { modal.classList.add("open"); return; }
    var themes = [
        { id: "default", title: "Стандарт", bg: "#0e0e10", text: "#e8e6e1" },
        { id: "ury-light", title: "Ury Light", bg: "#FFFFFF", text: "#252525" },
        { id: "ury-dark", title: "Ury Dark", bg: "#2b2b2b", text: "#ebebeb" },
        { id: "neon", title: "Киберпанк", bg: "#09090b", text: "#ff00cc" },
        { id: "matrix", title: "Матрица", bg: "#000000", text: "#00ff00" },
        { id: "cyberpunk", title: "Cyberpunk", bg: "#0a0015", text: "#00ffff" },
        { id: "rgb", title: "RGB", bg: "#111", text: "#ff0055" },
        { id: "hacker", title: "Хакер", bg: "#000", text: "#00ff00" },
        { id: "cs", title: "CS", bg: "#1a1a1a", text: "#f39c12" },
        { id: "genshin", title: "Genshin", bg: "#0f172a", text: "#38bdf8" }
    ];
    
    if (!document.getElementById("themeModalStyles")) {
        var style = document.createElement("style"); style.id = "themeModalStyles";
        style.textContent = `.theme-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s; backdrop-filter: blur(4px); } .theme-modal-overlay.open { opacity: 1; pointer-events: auto; } .theme-modal { background: var(--card); padding: 24px; border-radius: 16px; width: 90%; max-width: 600px; border: 1px solid var(--border); max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5); } .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; margin-top: 20px; } .theme-card { border: 2px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; background: var(--card-soft); } .theme-card:hover { border-color: var(--accent); transform: translateY(-2px); } .theme-card.active { border-color: var(--accent); background: var(--accent-soft); } .theme-preview { width: 100%; height: 60px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.1); }`;
        document.head.appendChild(style);
    }
    var html = `<div class="theme-modal-overlay" id="themeModalOverlay" onclick="if(event.target===this) this.classList.remove('open')"><div class="theme-modal"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><h2 style="margin:0;">Выбор темы</h2><button class="btn ghost" onclick="document.getElementById('themeModalOverlay').classList.remove('open')">✕</button></div><div class="theme-grid">`;
    themes.forEach(t => { var active = localStorage.getItem("mdk.theme_active") === t.id || (t.id === "default" && !localStorage.getItem("mdk.theme_active")); html += `<div class="theme-card ${active ? 'active' : ''}" onclick="window.applyShopItem('theme', '${t.id}', '')"><div class="theme-preview" style="background:${t.bg}; color:${t.text};">Aa</div><div style="font-weight:bold; font-size:13px;">${t.title}</div></div>`; });
    html += `</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById("themeModalOverlay").classList.add("open"), 10);
};

// ============================================================
// 5. ОСТАЛЬНЫЕ ФУНКЦИИ (СЕРТИФИКАТ, ЭКЗАМЕНЫ, ИГРЫ, ИНИЦИАЛИЗАЦИЯ)
// ============================================================
window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    if (!window.state.student && !window.state.staff) return;

    var isTeacher = !!window.state.staff;
    var name = isTeacher ? window.state.staff.name : window.state.student.name;
    var courseName = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId] ? window.MDK_DATA[window.state.activeCourseId].title : "МДК";
    
    // (Здесь код сертификата из предыдущего ответа, я его сократил для читаемости, 
    // но вы должны оставить свой полный код сертификата из предыдущего шага)
    app.innerHTML += `<div id="printable-cert" style="background:#fff; color:#000; padding:40px; max-width:800px; margin:0 auto; text-align:center; border:10px double #c14a2a;">
        <h1 style="font-size:40px; color:#c14a2a;">СЕРТИФИКАТ</h1>
        <p style="font-size:20px; margin:40px 0;">выдан</p>
        <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block;">${window.escapeHtml(name)}</h2>
        <p style="font-size:18px; margin-top:40px;">за прохождение курса</p>
        <h3 style="font-size:24px;">${window.escapeHtml(courseName)}</h3>
        <div style="margin-top:60px;">Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
    </div>`;
};

window.renderFormattingPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Оформление работ";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var data = window.GLOBAL_DATA && window.GLOBAL_DATA.formatting;
    if (data) { app.innerHTML += `<section class="hero"><h1>📝 ${data.title}</h1></section><div class="module" style="padding:30px; line-height:1.6;">${data.content}</div>`; } 
    else { app.innerHTML += `<div class="module">Информация пока недоступна.</div>`; }
};

window.renderTrainingPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Тренировка";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var mdkId = window.state.activeCourseId || "07.01";
    var suffix = mdkId.replace(".", ""); 
    if (typeof window["renderTraining_" + suffix] === "function") { window["renderTraining_" + suffix](mdkId); } 
    else { app.innerHTML += `<div class="module" style="color:var(--err);">Тесты не найдены.</div>`; }
};

window.renderFinalExamPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Экзамен";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var cId = window.state.activeCourseId || "07.01";
    var suffix = cId.replace(".", "");
    if (typeof window["renderFinal_" + suffix] === "function") { window["renderFinal_" + suffix](cId); } 
    else { app.innerHTML += `<div class="module" style="color:var(--err);">Экзамен не добавлен.</div>`; }
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
        var isYouTube = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
        var mediaHtml = "";
        
        if (isYouTube) {
            var vidId = item.url.includes('v=') ? item.url.split('v=')[1].split('&')[0] : item.url.split('/').pop();
            mediaHtml = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; margin-top:10px;"><iframe src="https://www.youtube.com/embed/${vidId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`;
        } else if (isVideo) {
            mediaHtml = `<video controls src="${item.file}" style="width:100%; max-height:400px; border-radius:8px; margin-top:10px; background:#000;"><source src="${item.file}" type="video/mp4"></video>`;
        } else if (isPdf) {
            mediaHtml = `<div style="width:100%; height:500px; border-radius:8px; margin-top:10px; border:1px solid var(--border); background:#fff;"><iframe src="${item.file}#toolbar=0" width="100%" height="100%" style="border:none;"></iframe></div>`;
        }

        list.innerHTML += `<div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:8px; background:var(--card-soft);">
            <b style="color:var(--accent); font-size:16px;">${item.title || 'Без названия'}</b><br>
            <span style="font-size:14px; color:var(--muted);">${item.description || ''}</span>
            ${mediaHtml}
            ${(item.file || item.url) && !isYouTube && !isVideo && !isPdf ? `<br><a href="${item.file || item.url}" target="_blank" class="btn" style="margin-top:10px;">📥 Скачать</a>` : ''}
        </div>`;
    });
};

window.handleLogout = function() { window.state.student = null; window.state.staff = null; window.saveStudentData(); location.reload(); };

window.addEventListener("DOMContentLoaded", function() {
    window.renderUserChip();
    
    if ($("themeToggle")) $("themeToggle").onclick = window.openThemeModal; 

    // ИСПРАВЛЕНИЕ: Переключение МДК
    var mdkSelector = document.getElementById("mdkSelector");
    if (mdkSelector) {
        mdkSelector.value = window.state.activeCourseId || "07.01";
        mdkSelector.addEventListener("change", function() {
            window.state.activeCourseId = this.value;
            window.saveStudentData();
            window.dispatchEvent(new HashChangeEvent("hashchange")); // Перезапуск роутера
            window.showToast("Предмет изменен: " + this.options[this.selectedIndex].text, "ok");
        });
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

    // Логика входа
    var btnLoginStudent = document.getElementById("btnLoginStudent");
    if (btnLoginStudent) {
        btnLoginStudent.onclick = function() {
            var name = document.getElementById("loginName").value.trim();
            var group = document.getElementById("loginGroup").value.trim();
            if (!name || !group) return window.showToast("Введите ФИО и группу", "err");
            var key = name.toLowerCase() + "|" + group.toLowerCase();
            btnLoginStudent.textContent = "Вход..."; btnLoginStudent.disabled = true;

            window.API.getStudentData(key).then(res => {
                var payload = {}; if (res && res.ok && res.payload) { try { payload = JSON.parse(res.payload); } catch(e){} }
                window.state.student = { name: name, group: group };
                window.state.xp = payload.xp || 0; window.state.results = payload.results || {}; window.state.avatar = payload.avatar || null;
                window.state.nickname = payload.nickname || null; window.state.signature = payload.signature || null;
                window.state.purchasedThemes = payload.purchasedThemes || []; window.state.purchasedFonts = payload.purchasedFonts || []; window.state.font = payload.font || "default"; window.state.certBg = payload.certBg || "bg1.jfif";
                
                window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти"; btnLoginStudent.disabled = false;
            }).catch(err => {
                window.state.student = { name: name, group: group };
                window.state.xp = 0; window.state.results = {}; window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти"; btnLoginStudent.disabled = false;
            });
        };
    }

    var btnLoginTeacher = document.getElementById("btnLoginTeacher");
    if (btnLoginTeacher) {
        btnLoginTeacher.onclick = function() {
            var user = document.getElementById("teacherUser").value.trim();
            var pass = document.getElementById("teacherPass").value.trim();
            var errEl = document.getElementById("teacherLoginError");
            if (errEl) errEl.style.display = "none";
            if (!user || !pass) return window.showToast("Введите логин и пароль", "err");
            btnLoginTeacher.textContent = "Проверка..."; btnLoginTeacher.disabled = true;
            window.API.login(user, pass).then(res => {
                if (res && res.ok) {
                    window.state.staff = { name: res.name, role: res.role }; window.saveStudentData(); window.renderUserChip();
                    if (loginOverlay) loginOverlay.style.display = "none";
                    window.location.hash = "#/journal"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                } else { if (errEl) { errEl.textContent = res.error || "Неверный логин или пароль"; errEl.style.display = "block"; } }
                btnLoginTeacher.textContent = "Войти в журнал"; btnLoginTeacher.disabled = false;
            }).catch(err => {
                if (errEl) { errEl.textContent = "Ошибка сервера"; errEl.style.display = "block"; }
                btnLoginTeacher.textContent = "Войти в журнал"; btnLoginTeacher.disabled = false;
            });
        };
    }

    function router() {
        var hash = location.hash.replace("#", "") || "/";
        var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
        
        // Обновляем селектор МДК при смене страницы
        var mdkSel = document.getElementById("mdkSelector");
        if (mdkSel) mdkSel.value = window.state.activeCourseId || "07.01";

        var loginOverlay = document.getElementById("loginOverlay");
        if (!window.state.student && !window.state.staff) { if (loginOverlay) loginOverlay.style.display = "flex"; } 
        else { if (loginOverlay) loginOverlay.style.display = "none"; }

        if (hash === "/" || hash === "") { window.renderHomePage(); } 
        else if (hash.startsWith("/topic/")) { var parts = hash.split("/"); window.renderTopicPage(parts[2], parts[3]); }
        else if (hash === "/videos") { window.renderSimplePage("Видеоуроки", window.GLOBAL_DATA.videos, "🎬"); } 
        else if (hash === "/passports") { window.renderSimplePage("Паспорта станков", window.GLOBAL_DATA.passports, "📄"); } 
        else if (hash === "/safety") { window.renderSimplePage("Охрана труда", window.GLOBAL_DATA.safety, "🦺"); } 
        else if (hash === "/formatting") { window.renderFormattingPage(); } 
        else if (hash === "/profile" || hash.startsWith("/profile/")) { window.renderProfilePage(hash); } 
        else if (hash === "/certificate") { window.renderCertificatePage(); } 
        else if (hash === "/shop") { if (window.renderShopPage) window.renderShopPage(); } 
        else if (hash === "/achievements") { if (window.renderAchievementsPage) window.renderAchievementsPage(); } 
        else if (hash === "/links") { if (window.renderLinksPage) window.renderLinksPage(); } 
        else if (hash === "/training") { window.renderTrainingPage(); } 
        else if (hash === "/final") { window.renderFinalExamPage(); } 
        else if (hash === "/arcade") { if (window.renderArcadePage) window.renderArcadePage(); } 
        else if (hash === "/rating") { if (window.renderRatingPage) window.renderRatingPage(); } 
        else if (hash === "/journal") { if (window.renderJournalPage) window.renderJournalPage(); } 
        else if (hash === "/reports") { if (window.renderCourseReportsPage) window.renderCourseReportsPage(); } 
        else if (hash === "/schedule") { if (window.renderSchedulePage) window.renderSchedulePage(); } 
        else { app.innerHTML = '<section class="hero"><h1>404</h1><p>Страница не найдена</p></section>'; }
    }
    window.addEventListener("hashchange", router);
    router();
});