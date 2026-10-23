"use strict";

// ============================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ============================================================
window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, signature: null, purchasedThemes: [], purchasedFonts: [], font: "default", certBg: "bg1.jfif", examSubmissions: []
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

// ============================================================
// 2. ГЛАВНАЯ И ЛЕКЦИИ (С ВОССТАНОВЛЕННЫМИ ВКЛАДКАМИ)
// ============================================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Главная";
    var mdkId = window.state.activeCourseId || "07.01";
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!";
    var module = course ? course.module : "Выберите раздел в меню слева.";

    var notifHtml = "";
    if (window.CUSTOM_DATA && window.CUSTOM_DATA.notifications.length > 0) {
        notifHtml = `<div style="background:var(--accent-soft); padding:15px; border-radius:8px; border-left:4px solid var(--accent); margin-bottom:20px;">
            <b>📢 Объявления:</b><br>${window.CUSTOM_DATA.notifications.map(n => `<div>• ${n}</div>`).join('')}
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

    // ВОССТАНОВЛЕНИЕ ВКЛАДОК
    var tabsHtml = `<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
        <button class="btn tab active" id="tab-lectures" onclick="window.switchTopicTab('lectures')">📖 Лекции</button>
        ${(topic.practicals && topic.practicals.length) ? `<button class="btn tab ghost" id="tab-practicals" onclick="window.switchTopicTab('practicals')">🛠️ Практика</button>` : ''}
        ${(topic.selfWork && topic.selfWork.length) ? `<button class="btn tab ghost" id="tab-selfwork" onclick="window.switchTopicTab('selfwork')">📝 Самостоятельная</button>` : ''}
        ${(topic.test && topic.test.length) ? `<button class="btn tab ghost" id="tab-test" onclick="window.switchTopicTab('test')">🎯 Тест</button>` : ''}
        ${(topic.presentations && topic.presentations.length) ? `<button class="btn tab ghost" id="tab-presentations" onclick="window.switchTopicTab('presentations')">📊 Презентации</button>` : ''}
    </div>
    <div id="topicContent"></div>`;
    app.innerHTML += tabsHtml;

    window.switchTopicTab = function(tabName) {
        // Меняем активный класс у кнопок
        document.querySelectorAll(".tab").forEach(btn => { btn.classList.remove("active"); btn.classList.add("ghost"); });
        var activeBtn = document.getElementById(`tab-${tabName}`);
        if (activeBtn) { activeBtn.classList.add("active"); activeBtn.classList.remove("ghost"); }
        
        var contentArea = document.getElementById("topicContent");
        contentArea.innerHTML = "";

        if (tabName === 'lectures' && topic.lectures) {
            topic.lectures.forEach(lec => {
                contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;">
                    <summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary>
                    <div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div>
                </details>`;
            });
        } 
        else if (tabName === 'practicals' && topic.practicals) {
            topic.practicals.forEach(p => {
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:15px; border-radius:8px; margin-bottom:10px; border:1px solid var(--border);">
                    <b style="color:var(--accent);">${p.code}: ${p.title}</b>
                    <p style="font-size:14px; margin-top:5px;">Задание: ${p.task}</p>
                    <button class="btn" style="margin-top:10px; font-size:12px;" onclick="window.showToast('Работа отправлена', 'ok')">Сдать работу</button>
                </div>`;
            });
        }
        else if (tabName === 'selfwork' && topic.selfWork) {
            topic.selfWork.forEach(sw => {
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:15px; border-radius:8px; margin-bottom:10px; border:1px solid var(--border);">
                    <b style="color:var(--gold);">${sw.code}: ${sw.title}</b>
                    <p style="font-size:14px; margin-top:5px;">${sw.task}</p>
                </div>`;
            });
        }
        else if (tabName === 'test' && topic.test) {
            var testHtml = "";
            topic.test.forEach((q, i) => {
                testHtml += `<div id="q${i}" style="margin-bottom:20px; padding:15px; background:var(--card-soft); border-radius:8px;">
                    <b>${i+1}. ${q.q}</b><br>`;
                q.options.forEach((opt, j) => {
                    testHtml += `<button class="btn ghost" style="display:block; width:100%; text-align:left; margin-top:5px; padding:10px;" onclick="window.answerTest(${i}, ${j}, ${q.correct})">${opt}</button>`;
                });
                testHtml += `</div>`;
            });
            contentArea.innerHTML = testHtml;
        }
        else if (tabName === 'presentations' && topic.presentations) {
            topic.presentations.forEach(p => {
                contentArea.innerHTML += `<div style="background:var(--card-soft); padding:15px; border-radius:8px; margin-bottom:10px; border:1px solid var(--border);">
                    <b style="color:var(--accent);">${p.code}: ${p.title}</b><br>
                    <span style="font-size:13px; color:var(--muted);">${p.description || ''} (Слайдов: ${p.slides || '?'})</span><br>
                    <a href="${p.file}" target="_blank" class="btn" style="margin-top:10px; font-size:12px;">📥 Скачать презентацию</a>
                </div>`;
            });
        }
    };

    // Логика ответа на тест
    window.answerTest = function(qIndex, selectedJ, correctJ) {
        var qDiv = document.getElementById(`q${qIndex}`);
        if (qDiv.classList.contains("answered")) return;
        qDiv.classList.add("answered");
        
        var btns = qDiv.querySelectorAll("button");
        btns.forEach(b => { b.disabled = true; b.style.opacity = "0.6"; });
        
        btns[selectedJ].style.opacity = "1";
        if (selectedJ === correctJ) {
            btns[selectedJ].style.borderColor = "var(--ok)";
            btns[selectedJ].style.background = "rgba(88, 201, 138, 0.2)";
            if(window.addXP) window.addXP(5);
        } else {
            btns[selectedJ].style.borderColor = "var(--err)";
            btns[selectedJ].style.background = "rgba(255, 110, 94, 0.2)";
            btns[correctJ].style.borderColor = "var(--ok)";
            btns[correctJ].style.background = "rgba(88, 201, 138, 0.2)";
        }
    };

    // По умолчанию открываем Лекции
    window.switchTopicTab('lectures');
};

// ============================================================
// 3. ПРОСТЫЕ СТРАНИЦЫ (ВИДЕО И PDF)
// ============================================================
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
        var isDocx = item.file && item.file.toLowerCase().endsWith('.docx');
        var isYouTube = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
        
        var mediaHtml = "";
        if (isYouTube) {
            var vidId = "";
            if (item.url.includes('v=')) vidId = item.url.split('v=')[1].split('&')[0];
            else if (item.url.includes('youtu.be/')) vidId = item.url.split('youtu.be/')[1].split('?')[0];
            
            if (vidId) {
                mediaHtml = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; margin-top:10px;"><iframe src="https://www.youtube.com/embed/${vidId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`;
            } else {
                mediaHtml = `<p style="color:var(--err); font-size:14px;">Ошибка ссылки YouTube</p>`;
            }
        } else if (isVideo) {
            mediaHtml = `<video controls src="${item.file}" style="width:100%; max-height:400px; border-radius:8px; margin-top:10px; background:#000;"></video>`;
        } else if (isPdf) {
            // Вставляем PDF через iframe. Если браузер блокирует, будет кнопка скачивания.
            mediaHtml = `<div style="width:100%; height:600px; border-radius:8px; margin-top:10px; border:1px solid var(--border); background:#fff; position:relative;">
                <iframe src="${item.file}#toolbar=0" width="100%" height="100%" style="border:none;"></iframe>
            </div>`;
        } else if (isDocx) {
            var docUrl = window.location.origin + window.location.pathname + item.file;
            mediaHtml = `<div style="width:100%; height:600px; border-radius:8px; margin-top:10px; border:1px solid var(--border); background:#fff; position:relative;">
                <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(docUrl)}&embedded=true" width="100%" height="100%" style="border:none;"></iframe>
            </div>`;
        }

        list.innerHTML += `<div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:8px; background:var(--card-soft);">
            <b style="color:var(--accent); font-size:16px;">${item.title || 'Без названия'}</b><br>
            <span style="font-size:14px; color:var(--muted);">${item.description || ''}</span>
            ${mediaHtml}
            ${(item.file || item.url) ? `<br><a href="${item.file || item.url}" target="_blank" class="btn" style="margin-top:10px;">📥 Открыть в новой вкладке / Скачать</a>` : ''}
        </div>`;
    });
};

// ============================================================
// 4. ЛИЧНЫЙ КАБИНЕТ И ДОСТИЖЕНИЯ
// ============================================================
window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var isTeacher = !!window.state.staff;
    var targetKey = route.split("/")[2] ? decodeURIComponent(route.split("/")[2]) : null;

    if (isTeacher && !targetKey) {
        app.innerHTML += `<section class="hero" style="text-align:center; padding:40px;"><div style="font-size:60px; margin-bottom:10px;">👨‍🏫</div><h2>${window.escapeHtml(window.state.staff.name)}</h2><p>Личный кабинет преподавателя</p></section>
        <div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:15px;">
            <a href="#/journal" class="btn" style="padding:20px; background:var(--accent); color:#fff;">📒 Журнал оценок</a>
            <a href="#/reports" class="btn" style="padding:20px; background:var(--gold); color:#000;">📊 Отчеты</a>
            <a href="#/admin" class="btn" style="padding:20px; background:var(--ok); color:#000;">⚙️ Панель управления</a>
        </div>`;
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
            app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
                <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div>
                <h2>${window.escapeHtml(targetKey.split("|")[0])}${crown}</h2>
                <p>Группа: ${window.escapeHtml(targetKey.split("|")[1] || "—")}</p>
                <p style="font-style:italic; color:var(--muted);">"${window.escapeHtml(p.signature || 'Без подписи')}"</p>
            </section>`;
        });
    } else if (window.state.student) {
        var lvl = window.getLevel(window.state.xp);
        var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
        var isVIP = window.isVIP();
        var crown = isVIP ? ' <span title="Тестировщик" style="color:var(--gold); font-size:24px;">👑</span>' : '';

        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
            <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div>
            <h2 style="margin-bottom:10px;">${window.escapeHtml(window.state.nickname || window.state.student.name)}${crown}</h2>
            <p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
            <div style="display:inline-block; background:var(--card-soft); padding:10px 20px; border-radius:20px; margin-bottom:20px;"><b style="color:var(--gold);">${window.state.xp} XP</b> · Уровень ${lvl}</div>
            
            <div style="max-width:400px; margin: 20px auto; text-align:left; background:var(--card-soft); padding:20px; border-radius:12px;">
                <label style="font-size:13px; font-weight:bold;">Никнейм</label>
                <input type="text" id="profNick" class="self-input" value="${window.escapeHtml(window.state.nickname || '')}">
                <label style="font-size:13px; font-weight:bold;">Подпись (статус)</label>
                <input type="text" id="profBio" class="self-input" value="${window.escapeHtml(window.state.signature || '')}">
                <button class="btn" onclick="window.saveProfileChanges()" style="width:100%;">💾 Сохранить</button>
            </div>
            <a href="#/shop" class="btn">🛒 Магазин XP</a>
        </section>`;

        window.saveProfileChanges = function() {
            window.state.nickname = document.getElementById("profNick").value.trim();
            window.state.signature = document.getElementById("profBio").value.trim();
            window.saveStudentData(); window.renderUserChip(); window.showToast("Сохранено!", "ok"); window.renderProfilePage(route);
        };
    }
};

window.renderAchievementsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Достижения";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.innerHTML += `<section class="hero"><h1>🏆 Достижения</h1></section><div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px;">`;
    var isVIP = window.isVIP();
    var achs = [
        { title: "Первый шаг", desc: "Войти в систему", icon: "🚪", unlocked: true },
        { title: "Первый тестировщик", desc: "Участие в закрытом тесте", icon: "🧪", unlocked: isVIP },
        { title: "Книжный червь", desc: "Изучить 5 лекций", icon: "📖", unlocked: window.state.xp > 50 },
        { title: "Хакер", desc: "Пройти тест", icon: "💻", unlocked: window.state.xp > 100 },
        { title: "Геймер", desc: "Сыграть в игру", icon: "🎮", unlocked: window.state.xp > 150 },
        { title: "Опытный", desc: "Достичь 5 уровня", icon: "⭐", unlocked: window.getLevel(window.state.xp) >= 5 },
        { title: "Богач", desc: "Накопить 1000 XP", icon: "💰", unlocked: window.state.xp >= 1000 }
    ];
    achs.forEach(a => {
        var style = a.unlocked ? "opacity:1; border-color:var(--ok);" : "opacity:0.4; filter:grayscale(1);";
        var badge = a.unlocked ? `<div style="color:var(--ok); font-size:12px; margin-top:5px;">✅ Получено</div>` : `<div style="color:var(--muted); font-size:12px; margin-top:5px;">🔒 Закрыто</div>`;
        app.innerHTML += `<div style="background:var(--card-soft); padding:20px; border-radius:12px; text-align:center; border:1px solid var(--border); ${style}">
            <div style="font-size:40px; margin-bottom:10px;">${a.icon}</div><div style="font-weight:bold;">${a.title}</div><div style="font-size:12px; color:var(--muted);">${a.desc}</div>${badge}
        </div>`;
    });
    app.innerHTML += `</div>`;
};

// ============================================================
// 5. РОУТЕР И ИНИЦИАЛИЗАЦИЯ (ПОЧИНЕНЫ ТРЕНИРОВКИ)
// ============================================================
window.handleLogout = function() { window.state.student = null; window.state.staff = null; window.saveStudentData(); location.reload(); };

window.addEventListener("DOMContentLoaded", function() {
    window.renderUserChip();
    if ($("themeToggle")) $("themeToggle").onclick = window.openThemeModal; 

    var mdkSelector = document.getElementById("mdkSelector");
    if (mdkSelector) {
        mdkSelector.value = window.state.activeCourseId || "07.01";
        mdkSelector.addEventListener("change", function() {
            window.state.activeCourseId = this.value;
            window.saveStudentData();
            window.dispatchEvent(new HashChangeEvent("hashchange"));
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

    // ВХОД
    var btnLoginStudent = document.getElementById("btnLoginStudent");
    if (btnLoginStudent) {
        btnLoginStudent.onclick = function() {
            var name = document.getElementById("loginName").value.trim();
            var group = document.getElementById("loginGroup").value.trim();
            if (!name || !group) return window.showToast("Введите ФИО и группу", "err");
            var key = name.toLowerCase() + "|" + group.toLowerCase();
            btnLoginStudent.textContent = "Вход...";
            window.API.getStudentData(key).then(res => {
                var payload = {}; if (res && res.ok && res.payload) { try { payload = JSON.parse(res.payload); } catch(e){} }
                window.state.student = { name: name, group: group };
                window.state.xp = payload.xp || 0; window.state.results = payload.results || {}; window.state.avatar = payload.avatar || null;
                window.state.nickname = payload.nickname || null; window.state.signature = payload.signature || null;
                window.state.purchasedThemes = payload.purchasedThemes || []; 
                var n = name.toLowerCase();
                if (n.includes("новиков арсений") || n.includes("кулиш денис")) {
                    if (!window.state.nickname) window.state.nickname = n.includes("новиков") ? "Marazm" : "Barbos";
                    if (!window.state.purchasedThemes.includes("vip_theme")) window.state.purchasedThemes.push("vip_theme");
                }
                window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти";
            }).catch(() => {
                window.state.student = { name: name, group: group }; window.state.xp = 0; window.state.results = {};
                window.saveStudentData(); window.renderUserChip();
                if (loginOverlay) loginOverlay.style.display = "none";
                window.location.hash = "#/"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                btnLoginStudent.textContent = "Войти";
            });
        };
    }

    var btnLoginTeacher = document.getElementById("btnLoginTeacher");
    if (btnLoginTeacher) {
        btnLoginTeacher.onclick = function() {
            var user = document.getElementById("teacherUser").value.trim();
            var pass = document.getElementById("teacherPass").value.trim();
            btnLoginTeacher.textContent = "Проверка...";
            window.API.login(user, pass).then(res => {
                if (res && res.ok) {
                    window.state.staff = { name: res.name, role: res.role }; window.saveStudentData(); window.renderUserChip();
                    if (loginOverlay) loginOverlay.style.display = "none";
                    window.location.hash = "#/profile"; window.dispatchEvent(new HashChangeEvent("hashchange"));
                } else { window.showToast("Неверный логин/пароль", "err"); }
                btnLoginTeacher.textContent = "Войти в журнал";
            }).catch(() => { window.showToast("Ошибка сервера", "err"); btnLoginTeacher.textContent = "Войти в журнал"; });
        };
    }

    function router() {
        var hash = location.hash.replace("#", "") || "/";
        var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
        var mdkSel = document.getElementById("mdkSelector");
        if (mdkSel) mdkSel.value = window.state.activeCourseId || "07.01";
        var loginOverlay = document.getElementById("loginOverlay");
        if (!window.state.student && !window.state.staff) { if (loginOverlay) loginOverlay.style.display = "flex"; } else { if (loginOverlay) loginOverlay.style.display = "none"; }

        if (hash === "/" || hash === "") { window.renderHomePage(); } 
        else if (hash.startsWith("/topic/")) { var parts = hash.split("/"); window.renderTopicPage(parts[2], parts[3]); }
        else if (hash === "/videos") { window.renderSimplePage("Видеоуроки", window.GLOBAL_DATA.videos, "🎬"); } 
        else if (hash === "/passports") { window.renderSimplePage("Паспорта станков", window.GLOBAL_DATA.passports, "📄"); } 
        else if (hash === "/safety") { window.renderSimplePage("Охрана труда", window.GLOBAL_DATA.safety, "🦺"); } 
        else if (hash === "/formatting") { 
            app.innerHTML = `<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>Оформление</h1></section><div class="module">${window.GLOBAL_DATA.formatting.content}</div>`;
        } 
        else if (hash === "/profile" || hash.startsWith("/profile/")) { window.renderProfilePage(hash); } 
        else if (hash === "/shop") { if (window.renderShopPage) window.renderShopPage(); } 
        else if (hash === "/achievements") { window.renderAchievementsPage(); } 
        else if (hash === "/links") { if (window.renderLinksPage) window.renderLinksPage(); } 
        else if (hash === "/training") {
            // ПОЧИНЕНО: Вызов правильной тренировки
            var mdkId = window.state.activeCourseId || "07.01";
            var suffix = mdkId.replace(".", "");
            if (typeof window["renderTraining_" + suffix] === "function") {
                window["renderTraining_" + suffix](mdkId);
            } else {
                app.innerHTML = `<section class="hero"><h1>🎯 Тренировка</h1></section><div class="module" style="color:var(--err);">Тесты для этого МДК (${mdkId}) пока не добавлены.</div>`;
            }
        } 
        else if (hash === "/final") {
            var mdkId = window.state.activeCourseId || "07.01";
            var suffix = mdkId.replace(".", "");
            if (typeof window["renderFinal_" + suffix] === "function") {
                window["renderFinal_" + suffix](mdkId);
            } else if (window.renderNewExam) {
                window.renderNewExam(mdkId);
            } else {
                app.innerHTML = `<section class="hero"><h1>📋 Экзамен</h1></section><div class="module" style="color:var(--err);">Экзамен не добавлен.</div>`;
            }
        } 
        else if (hash === "/arcade") { if (window.renderArcadePage) window.renderArcadePage(); } 
        else if (hash === "/rating") { if (window.renderRatingPage) window.renderRatingPage(); } 
        else if (hash === "/journal") { if (window.renderJournalPage) window.renderJournalPage(); } 
        else if (hash === "/reports") { if (window.renderCourseReportsPage) window.renderCourseReportsPage(); } 
        else if (hash === "/admin") { if (window.renderAdminPanel) window.renderAdminPanel(); } 
        else if (hash === "/schedule") { if (window.renderSchedulePage) window.renderSchedulePage(); } 
        else { app.innerHTML = '<section class="hero"><h1>404</h1><p>Страница не найдена</p></section>'; }
    }
    window.addEventListener("hashchange", router);
    router();
});