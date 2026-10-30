"use strict";

window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {},
    avatar: null, nickname: null, purchasedThemes: [],
    purchasedTextEffects: [], activeTextEffect: "none",
    purchasedBgEffects: [], activeBgEffect: "none", purchasedCardEffects: [], activeCardEffect: "none"
};
try { 
    var savedState = localStorage.getItem("mdk.state"); 
    if (savedState) Object.assign(window.state, JSON.parse(savedState)); 
} catch (e) {}

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
    } catch (e) {}
};

window.getLevel = function(xp) { return Math.floor((xp || 0) / 100) + 1; };
window.getLevelTitle = function(lvl) { if (lvl < 3) return "Новичок"; if (lvl < 5) return "Ученик"; if (lvl < 8) return "Практикант"; if (lvl < 12) return "Мастер"; return "Эксперт"; };

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
};

window.unlockAchievement = function(id) {
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (!window.state.unlockedAchievements.includes(id)) { window.state.unlockedAchievements.push(id); window.saveStudentData(); window.showToast("🏆 Получена ачивка!", "ok"); }
};

// ==========================================
// 2. РЕНДЕР СТРАНИЦ
// ==========================================
window.renderVideosPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎬 Видеоуроки</h1></section><div class="module" id="videosList"></div>';
    var list = document.getElementById("videosList");
    var vids = window.GLOBAL_DATA && window.GLOBAL_DATA.videos ? window.GLOBAL_DATA.videos : [];
    if (!vids.length) { list.innerHTML = "<p>Видео пока нет.</p>"; return; }
    vids.forEach(v => {
        list.innerHTML += `<div style="margin-bottom:20px; background:var(--card-soft); padding:15px; border-radius:8px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${v.title}</b><p style="font-size:14px; margin:5px 0;">${v.description||''}</p><video src="${v.file}" controls preload="metadata" playsinline style="width:100%; border-radius:8px; max-height:70vh; background:#000;"></video><p style="margin-top:8px;"><a class="btn ghost" href="${v.file}" target="_blank" rel="noopener">Открыть файл</a></p></div>`;
    });
};

window.renderTrainingListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎯 Тренировка</h1></section>';
    
    var gcodeCard = document.createElement("a"); 
    gcodeCard.href = "#/training/gcode"; gcodeCard.className = "module";
    gcodeCard.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:2px solid var(--accent); border-radius:12px; margin-bottom:15px;";
    gcodeCard.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">📐 Тренажер G-кода</h3><p>Интерактивный симулятор станка.</p>`;
    app.appendChild(gcodeCard);
};

window.renderStudentGradesPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Мои оценки";
    app.appendChild(el('<a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в профиль</a>'));
    
    var autoGradesList = Object.keys(window.state.results || {}).filter(k => !k.startsWith("topic_") && k !== "certificateApproved");
    var autoRows = autoGradesList.map(k => {
        var title = k; 
        if(k.startsWith("test_")) title = "Тест по курсу " + k.split("_")[1];
        if(k.startsWith("__final__")) title = "Итоговый экзамен";
        var gradeData = window.state.results[k];
        var grade = typeof gradeData === 'object' ? gradeData.grade : gradeData;
        var color = grade >= 4 ? "var(--ok)" : (grade >= 3 ? "var(--gold)" : "var(--err)");
        return `<tr><td style="padding:10px; border:1px solid var(--border);">${title}</td><td style="padding:10px; border:1px solid var(--border); text-align:center; font-weight:bold; color:${color}; font-size:18px;">${grade}</td></tr>`;
    }).join("");

    var manualGrades = JSON.parse(localStorage.getItem('portal_grades') || '[]');
    var myManualGrades = manualGrades.filter(g => g.student.toLowerCase() === (window.state.student.email || '').toLowerCase());
    var manualRows = myManualGrades.map(g => {
        return `<tr><td style="padding:10px; border:1px solid var(--border);">${g.date}</td><td style="padding:10px; border:1px solid var(--border);">${g.subject}</td><td style="padding:10px; border:1px solid var(--border); text-align:center; font-weight:bold; color:var(--ok); font-size:18px;">${g.value}</td></tr>`;
    }).join("");

    app.innerHTML += `
        <section class="hero"><h1>📊 Мои оценки</h1></section>
        <div class="module">
            <h3>Оценки от преподавателя</h3>
            <div class="journal-wrap">
                <table class="journal-table">
                    <thead><tr><th>Дата</th><th>Предмет</th><th>Оценка</th></tr></thead>
                    <tbody>${manualRows || '<tr><td colspan="3" style="text-align:center; color:var(--muted);">Пока нет оценок</td></tr>'}</tbody>
                </table>
            </div>
        </div>
        <div class="module">
            <h3>Автоматические тесты</h3>
            <div class="journal-wrap">
                <table class="journal-table">
                    <thead><tr><th>Работа</th><th>Оценка</th></tr></thead>
                    <tbody>${autoRows || '<tr><td colspan="2" style="text-align:center; color:var(--muted);">Вы еще не проходили тесты</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
};

window.renderTeacherJournalPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    if (!window.state.staff) { app.innerHTML = "<h2>Доступ запрещен</h2>"; return; }
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Журнал (Преподаватель)";
    
    var grades = JSON.parse(localStorage.getItem('portal_grades') || '[]');
    
    app.innerHTML = `
        <a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>
        <section class="hero"><h1>📓 Журнал группы</h1></section>
        <div class="module">
            <h3>Выставить оценку</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <select id="grade-group" class="self-input" style="flex:1;">
                    <option value="Группа 1">Группа 1</option>
                    <option value="Группа 2">Группа 2</option>
                </select>
                <input type="text" id="grade-student" placeholder="Email студента" class="self-input" style="flex:2;">
                <input type="text" id="grade-subject" placeholder="Предмет" class="self-input" style="flex:1;">
                <input type="number" id="grade-value" placeholder="Оценка" class="self-input" style="width:100px;" min="2" max="5">
            </div>
            <button class="btn btn-primary" onclick="window.addGrade()" style="margin-top:10px;">Сохранить оценку</button>
        </div>
        <div class="module">
            <h3>Все оценки</h3>
            <div class="journal-wrap">
                <table class="journal-table">
                    <thead><tr><th>Дата</th><th>Группа</th><th>Студент</th><th>Предмет</th><th>Оценка</th></tr></thead>
                    <tbody id="grades-table-body">
                        ${grades.map(g => `<tr><td>${g.date}</td><td>${g.group}</td><td>${g.student}</td><td>${g.subject}</td><td><b style="color:var(--ok); font-size:16px;">${g.value}</b></td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

window.addGrade = function() {
    const group = document.getElementById('grade-group').value;
    const student = document.getElementById('grade-student').value.trim();
    const subject = document.getElementById('grade-subject').value.trim();
    const value = document.getElementById('grade-value').value;

    if (!student || !subject || !value) { alert("Заполните все поля!"); return; }

    const grades = JSON.parse(localStorage.getItem('portal_grades') || '[]');
    grades.push({ date: new Date().toLocaleDateString(), group, student, subject, value });
    localStorage.setItem('portal_grades', JSON.stringify(grades));
    
    alert("Оценка выставлена!");
    window.renderTeacherJournalPage(); 
};

window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Сертификат";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    if (!window.state.student) return;
    
    var courseName = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId] ? window.MDK_DATA[window.state.activeCourseId].title : "МДК";
    var isApproved = window.state.results && window.state.results.certificateApproved;
    
    app.innerHTML += `<div class="no-print" style="text-align:center; margin:20px 0;"><button class="btn" onclick="window.print()">🖨 Распечатать сертификат</button></div>
    <div id="printable-cert" style="background:#fff; color:#000; padding:40px; max-width:900px; margin:0 auto; border:10px double #c14a2a; text-align:center;">
        <h1 style="font-size:40px; color:#c14a2a; font-family:'Monomakh', serif;">СЕРТИФИКАТ</h1>
        <p style="font-size:20px; margin:40px 0;">подтверждает, что</p>
        <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block; padding-bottom:5px;">${window.escapeHtml(window.state.student.name)}</h2>
        <p style="font-size:18px; margin-top:40px;">успешно прошел(ла) обучение по программе</p>
        <h3 style="font-size:24px; color:#c14a2a; margin-top:10px;">${window.escapeHtml(courseName)}</h3>
        <div style="margin-top:60px; display:flex; justify-content:space-between;">
            <div style="text-align:left;">Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
            <div style="text-align:right;">Подпись: _______________</div>
        </div>
        ${!isApproved ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); font-size:80px; font-weight:bold; color:rgba(255,0,0,0.1); pointer-events:none;">ОБРАЗЕЦ</div>` : ""}
    </div>`;
};

window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    if (!window.state.student && !window.state.staff) { location.hash = "#/"; return; }
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Личный кабинет";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    var isTeacher = !!window.state.staff;

    if (isTeacher) {
        app.innerHTML += `<section class="hero" style="text-align:center; padding:40px;"><div style="font-size:60px; margin-bottom:10px;">👨‍🏫</div><h2>${window.escapeHtml(window.state.staff.name)}</h2><p>Личный кабинет преподавателя</p></section>
        <div class="module" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:15px;">
            <a href="#/journal" class="btn" style="padding:20px; background:var(--accent); color:#fff;">📒 Журнал</a>
            <a href="#/reports" class="btn" style="padding:20px; background:var(--gold); color:#000;">📊 Отчеты</a>
            <a href="#/admin" class="btn" style="padding:20px; background:var(--ok); color:#000;">⚙️ Админка</a>
        </div>`;
        return;
    }

    if (window.state.student) {
        var lvl = window.getLevel(window.state.xp); 
        var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; object-fit:cover;">` : "👨‍🎓";
        app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
            <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px;">${avHtml}</div>
            <h2 style="margin-bottom:10px;">${window.escapeHtml(window.state.nickname || window.state.student.name)}</h2>
            <p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
            <div style="display:flex; justify-content:center; gap:15px; margin-bottom:20px;">
                <div style="background:var(--card-soft); padding:10px 20px; border-radius:20px;"><b style="color:var(--gold);">${window.state.xp} XP</b> · Ур. ${lvl}</div>
            </div>
            <div style="display:flex; gap:10px; justify-content:center;">
                <a href="#/grades" class="btn" style="background:var(--ok); color:#fff;">📊 Мои оценки</a>
                <a href="#/shop" class="btn">🛒 Магазин XP</a>
            </div>
        </section>`;
    }
};

window.renderAchievementsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = "Достижения";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.innerHTML += `<section class="hero"><h1>🏆 Достижения</h1></section><div class="module">Ваши ачивки тут.</div>`;
};

// ==========================================
// 3. СТРАНИЦА ТЕМЫ (С ВКЛАДКАМИ ПРАКТИКА И САМОСТОЯТЕЛЬНАЯ)
// ==========================================
window.renderTopicPage = function(courseId, topicId) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var course = window.MDK_DATA[courseId]; if (!course) { app.innerHTML = '<div class="module">Курс не найден</div>'; return; }
    var topic = null; course.sections.forEach(s => { s.topics.forEach(t => { if (t.id === topicId) topic = t; }); });
    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена</div>'; return; }
    
    var crumbs = document.getElementById("crumbs"); if (crumbs) crumbs.textContent = topic.code + " " + topic.title;
    app.appendChild(el(`<a class="backlink" href="#/" style="color:var(--accent);">← Назад к плану</a>`));
    app.appendChild(el(`<section class="hero"><h1 class="neon-text">${topic.code} ${topic.title}</h1></section>`));
    
    // Вкладки: Лекции, Практика, Самостоятельная, Тест
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
            if (!topic.lectures || !topic.lectures.length) { contentArea.innerHTML = "<p>Лекций нет.</p>"; return; }
            topic.lectures.forEach(lec => {
                contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div></details>`;
            });
            window.unlockAchievement('reader');
        }
        else if (tabName === 'practicals') {
            if (!topic.practicals || !topic.practicals.length) { contentArea.innerHTML = "<p>Практических работ нет.</p>"; return; }
            topic.practicals.forEach(prac => {
                contentArea.innerHTML += `<div class="card" style="margin-bottom:15px;">
                    <h3 style="color:var(--accent); margin-top:0;">${prac.code} ${prac.title}</h3>
                    <p><b>Цель:</b> ${prac.goal}</p>
                    <p><b>Задание:</b> ${prac.task}</p>
                    ${(prac.variants && prac.variants.length) ? `<p><b>Варианты:</b> ${prac.variants.join(', ')}</p>` : ''}
                </div>`;
            });
        }
        else if (tabName === 'selfwork') {
            if (!topic.selfWork || !topic.selfWork.length) { contentArea.innerHTML = "<p>Самостоятельных работ нет.</p>"; return; }
            topic.selfWork.forEach(work => {
                contentArea.innerHTML += `<div class="card" style="margin-bottom:15px;">
                    <h3 style="color:var(--accent); margin-top:0;">${work.code} ${work.title}</h3>
                    <p><b>Задание:</b> ${work.task}</p>
                    ${(work.questions && work.questions.length) ? `<p><b>Вопросы:</b></p><ul>${work.questions.map(q => `<li>${q}</li>`).join('')}</ul>` : ''}
                </div>`;
            });
        }
        else if (tabName === 'test') {
            if (!topic.test || !topic.test.length) { contentArea.innerHTML = "<p>Вопросов нет.</p>"; return; }
            var testId = `test_${topic.id}`; var isDone = window.state.results && window.state.results[testId];
            if (isDone) contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;"><h3 style="color:var(--ok);">✅ Тест уже пройден!</h3><p>Оценка: <b>${isDone.grade}</b></p><button class="btn" onclick="window.startInlineTest('${topic.id}')">Пройти заново</button></div>`;
            else contentArea.innerHTML = `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px;"><h3>🎯 Тест по теме</h3><p>Вопросов: ${topic.test.length}</p><button class="btn" onclick="window.startInlineTest('${topic.id}')" style="padding:15px 30px; font-size:16px;">Начать тест</button></div>`;
        }
    };

    window.startInlineTest = function(topicId) {
        var contentArea = document.getElementById("topicContent"); var questions = [...topic.test];
        var currentQ = 0, correct = 0;
        function renderQ() {
            if (currentQ >= questions.length) {
                var pct = Math.round((correct / questions.length) * 100); var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                window.state.results[`test_${topicId}`] = { grade: grade }; window.saveStudentData(); window.unlockAchievement('hacker');
                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;"><h2 style="color:var(--ok);">Тест завершен!</h2><p>Верных: <b>${correct}</b> из <b>${questions.length}</b></p><h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1><button class="btn" onclick="window.switchTopicTab('test')">Вернуться</button></div>`; return;
            }
            var q = questions[currentQ];
            var html = `<div style="display:flex; justify-content:space-between; margin-bottom:15px;"><b>Вопрос ${currentQ+1} из ${questions.length}</b></div><div style="font-weight:bold; margin-bottom:15px; font-size:16px;">${q.q}</div>`;
            q.options.forEach((opt, i) => { html += `<button class="btn ghost" style="display:block; width:100%; text-align:left; margin-top:5px; padding:10px;" onclick="window.answerInlineTest(${i}, ${q.correct})">${opt}</button>`; });
            contentArea.innerHTML = html;
        }
        window.answerInlineTest = function(selected, correctIdx) { if (selected === correctIdx) correct++; currentQ++; renderQ(); };
        renderQ();
    };
    window.switchTopicTab('lectures');
};

window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var mdkId = window.state.activeCourseId || "07.01"; 
    var course = window.MDK_DATA && window.MDK_DATA[mdkId];
    var title = course ? course.title : "Добро пожаловать!"; 
    var module = course ? course.module : "Выберите раздел.";
    
    app.innerHTML = `<section class="hero" style="text-align: left; padding: 40px;">
        <span class="brand-badge" style="margin-bottom: 10px; display: inline-block;">${course ? course.shortName : "Портал"}</span>
        <h1 style="font-size: 2.2rem; margin-bottom: 10px;">${title}</h1>
        <p style="font-size: 1.1rem; color: var(--text-soft);">${module}</p>
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
// 4. РОУТИНГ И ВХОД
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
    if (page === "training") { window.renderTrainingListPage(); return; }
    if (page === "grades") { window.renderStudentGradesPage(); return; }
    if (page === "journal") { window.renderTeacherJournalPage(); return; }
    if (page === "certificate") { window.renderCertificatePage(); return; }
    if (page === "profile") { window.renderProfilePage(hash); return; }
    if (page === "achievements") { window.renderAchievementsPage(); return; }
    if (page === "shop") { window.renderShopPage(); return; }
    if (page === "games") { window.renderArcadePage(); return; }
    if (page === "final") { window.renderFinalExamPage(parts[1]); return; }
    if (page === "reports") { window.renderCourseReportsPage(); return; }
    if (page === "schedule") { window.renderSchedulePage(); return; }
    if (page === "rating") { window.renderRatingPage(); return; }
    if (page === "admin") { window.renderAdminPanel(); return; }
    
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
    window.router();
});