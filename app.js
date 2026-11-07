"use strict";

window.state = window.state || {
    student: null, staff: null, xp: 0, activeCourseId: "07.01", results: {}, gcodeProgress: null,
    avatar: null, nickname: null, purchasedThemes: [],
    purchasedTextEffects: [], activeTextEffect: "none",
    purchasedBgEffects: [], activeBgEffect: "none", purchasedCardEffects: [], activeCardEffect: "none",
    unlockedAchievements: []
};

window.customContent = { topics: [], files: [], lectures: [], tests: [], flashcards: [], games: [], announcements: [] };

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
        // Не затираем более свежий прогресс G-Code Lab, сохранённый отдельной страницей портала.
        var cachedState = JSON.parse(localStorage.getItem("mdk.state") || "{}");
        var sameAccount = cachedState.student && window.state.student && String(cachedState.student.email || "").toLowerCase() === String(window.state.student.email || "").toLowerCase();
        if (sameAccount && cachedState.gcodeProgress && Number(cachedState.gcodeProgress.updatedAt) > Number((window.state.gcodeProgress || {}).updatedAt || 0)) window.state.gcodeProgress = cachedState.gcodeProgress;
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
    ['menuJournal', 'menuReports', 'menuSchedule'].forEach(id => {
        var el = document.getElementById(id);
        if (el) el.style.display = displayStyle;
    });
    var adminLink = document.querySelector('.drawer-item[href="#/admin"]');
    if (adminLink) adminLink.style.display = window.state.staff && window.state.staff.role === "admin" ? "flex" : "none";
    var accessLink=document.querySelector('.drawer-item[href="#/access"]'); if(accessLink) accessLink.style.display=isTeacher?"flex":"none";
    var taskLink=document.querySelector('.drawer-item[href="#/teacher-tasks"]'); var dashLink=document.getElementById("menuTeacherDashboard"); if(dashLink)dashLink.style.display=isTeacher?"flex":"none"; if(taskLink) taskLink.style.display=(isTeacher || !!window.state.student)?"flex":"none";
    var learningPathLink=document.querySelector('.drawer-item[href="#/learning-path"]'); if(learningPathLink) learningPathLink.style.display=window.state.student?"flex":"none";
    var missionsLink=document.querySelector('.drawer-item[href="#/missions"]'); if(missionsLink) missionsLink.style.display=window.state.student?"flex":"none";
    var seasonalLink=document.querySelector('.drawer-item[href="#/seasonal"]'); if(seasonalLink) seasonalLink.style.display=window.state.student?"flex":"none";
    var teamsLink=document.querySelector('.drawer-item[href="#/teams"]'); if(teamsLink) teamsLink.style.display=(window.state.student||isTeacher)?"flex":"none";
    var museumLink=document.querySelector('.drawer-item[href="#/museum"]'); if(museumLink) museumLink.style.display=(window.state.student||isTeacher)?"flex":"none";
    var editorLink=document.getElementById('menuCourseEditor'); if(editorLink)editorLink.style.display=isTeacher?'flex':'none';
    var flashcardEditorLink=document.getElementById('menuFlashcardEditor'); if(flashcardEditorLink)flashcardEditorLink.style.display=isTeacher?'flex':'none';
    var englishLinks=document.querySelectorAll('.english-drawer-item'); Array.prototype.forEach.call(englishLinks,function(link){link.style.display=['EN','ENB','ENT'].indexOf(window.state.activeCourseId)>=0?'flex':'none';});
    var portfolioLink=document.querySelector('.drawer-item[href="#/portfolio"]'); if(portfolioLink) portfolioLink.style.display=(window.state.student||isTeacher)?"flex":"none";
    var tutoringLink=document.getElementById("menuTutoring"); if(tutoringLink){tutoringLink.style.display=isTeacher?"flex":"none";if(window.state.student&&window.API&&window.API.getTutoringLink){var tutoringCourse=String(window.state.activeCourseId||"07.01");window.API.getTutoringLink(tutoringCourse).then(function(r){if(String(window.state.activeCourseId||"07.01")!==tutoringCourse)return;tutoringLink.style.display=(r&&r.link&&r.link.visible!==false)?"flex":"none";}).catch(function(){tutoringLink.style.display="none";});}}
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
    document.querySelectorAll(".module, .card").forEach(function(el) {
        el.classList.remove("fx-holo-card", "fx-3d-card", "fx-glass-card", "fx-pulse-card", "fx-blueprint-card");
        if (cardFx !== "none") el.classList.add(cardFx);
    });
    var fontSize = { small: "0.92", normal: "1", large: "1.12", xlarge: "1.25" }[window.state.activeFontSize || "normal"] || "1";
    document.documentElement.style.setProperty("--portal-font-scale", fontSize);
    var fontChoice = { "font-default": "'Segoe UI', sans-serif", "font-mono": "'Courier New', monospace", "font-serif": "'Times New Roman', serif", "font-monomakh": "'Monomakh', serif", "font-sacramento": "'Sacramento', cursive" }[window.state.activeFont || "font-default"];
    if (fontChoice) document.body.style.fontFamily = fontChoice;
    
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
    if (window.refreshNotificationCenter) window.refreshNotificationCenter();
};


/* Global notification center */
window.notificationCache=[];window.notificationPrefs={hiddenCourses:[]};window.notificationStatusFilter="all";window.notificationCourseFilter="all";
window.notificationPrefsKey=function(){var u=window.state&&(window.state.student||window.state.staff),email=u&&u.email?String(u.email).toLowerCase():"guest";return "mdk.notificationPrefs.v1."+email;};
window.loadNotificationPrefs=function(){var key=window.notificationPrefsKey();try{var x=JSON.parse(localStorage.getItem(key)||"{}");window.notificationPrefs={hiddenCourses:Array.isArray(x.hiddenCourses)?x.hiddenCourses.map(String):[]};}catch(e){window.notificationPrefs={hiddenCourses:[]};}window.notificationPrefsOwnerKey=key;};
window.saveNotificationPrefs=function(){try{localStorage.setItem(window.notificationPrefsKey(),JSON.stringify(window.notificationPrefs));}catch(e){}};
window.notificationCourseName=function(id){var names={"07.01":"МДК 07.01 — ЧПУ","04.01":"МДК 04.01 — Диагностика","02.01":"МДК 02.01 — Сборка","02.02":"МДК 02.02 — Программирование","MCAM":"Mastercam","MAT":"Материаловедение","MET":"Метрология","OT":"Охрана труда","PFI":"ПФИ"};return names[id]||(window.MDK_DATA&&window.MDK_DATA[id]&&window.MDK_DATA[id].title)||id||"Без дисциплины";};
window.renderNotificationControls=function(){var c=document.getElementById("notificationCourseFilter"),p=document.getElementById("notificationPrefsList");if(!c||!p)return;var ids=[...new Set((window.notificationCache||[]).map(function(n){return String(n.courseId||"");}))].sort(),selected=window.notificationCourseFilter;c.innerHTML='<option value="all">Все дисциплины</option>'+ids.map(function(id){return '<option value="'+window.escapeHtml(id)+'">'+window.escapeHtml(window.notificationCourseName(id))+'</option>';}).join("");c.value=ids.indexOf(selected)>=0?selected:"all";window.notificationCourseFilter=c.value;p.innerHTML=ids.map(function(id){var checked=window.notificationPrefs.hiddenCourses.indexOf(id)<0;return '<label class="notification-pref-row"><input type="checkbox" data-notification-course="'+window.escapeHtml(id)+'" '+(checked?'checked':'')+'> <span>'+window.escapeHtml(window.notificationCourseName(id))+'</span></label>';}).join("")||'<small>Дисциплины появятся после получения уведомлений.</small>';p.querySelectorAll("[data-notification-course]").forEach(function(input){input.onchange=function(){var id=input.dataset.notificationCourse,h=window.notificationPrefs.hiddenCourses;window.notificationPrefs.hiddenCourses=input.checked?h.filter(function(x){return x!==id;}):(h.indexOf(id)<0?h.concat([id]):h);window.saveNotificationPrefs();window.renderNotificationItems();};});};
window.renderNotificationItems=function(){var list=document.getElementById("notificationItems");if(!list)return;var items=(window.notificationCache||[]).filter(function(n){if(window.notificationStatusFilter==="unread"&&n.readAt)return false;var cid=String(n.courseId||"");if(window.notificationCourseFilter!=="all"&&cid!==window.notificationCourseFilter)return false;if(window.notificationPrefs.hiddenCourses.indexOf(cid)>=0)return false;return true;});if(!items.length){list.innerHTML='<p class="notification-empty">'+((window.notificationCache||[]).length?'По выбранным фильтрам уведомлений нет.':'Пока уведомлений нет.')+'</p>';return;}list.innerHTML=items.map(function(n){var date=n.createdAt?new Date(n.createdAt).toLocaleString("ru-RU"):"";return '<article class="notification-item '+(n.readAt?'is-read':'is-unread')+'"><div class="notification-item-title">'+window.escapeHtml(n.title)+'</div><div class="notification-course-label">'+window.escapeHtml(window.notificationCourseName(n.courseId))+'</div><time>'+window.escapeHtml(date)+'</time><p>'+window.escapeHtml(n.message)+'</p><div class="notification-item-actions">'+(!n.readAt?'<button type="button" class="btn ghost" data-notification-read="'+window.escapeHtml(n.id)+'">Прочитано</button>':'')+'<button type="button" class="btn" data-notification-open="'+window.escapeHtml(n.id)+'" data-assignment="'+window.escapeHtml(n.relatedId||'')+'">Открыть</button></div></article>';}).join("");list.querySelectorAll("[data-notification-read]").forEach(function(b){b.onclick=function(){b.disabled=true;window.API.markNotificationRead(b.dataset.notificationRead).then(window.refreshNotificationCenter).catch(function(e){b.disabled=false;window.showToast(e.message,"error");});};});list.querySelectorAll("[data-notification-open]").forEach(function(b){b.onclick=function(){var id=b.dataset.notificationOpen,assignment=b.dataset.assignment;window.API.markNotificationRead(id).catch(function(){});var target="#/teacher-tasks"+(assignment?"/"+encodeURIComponent(assignment):"");document.getElementById("notificationPopover").hidden=true;document.getElementById("notificationBell").setAttribute("aria-expanded","false");if(location.hash===target)window.renderTeacherTasksPage(assignment);else location.hash=target;window.refreshNotificationCenter();};});};
window.refreshNotificationCenter=function(){if(!window.API||!window.API.getNotifications)return Promise.resolve();if(!window.state.student&&!window.state.staff){window.notificationCache=[];var emptyBadge=document.getElementById("notificationBadge");if(emptyBadge)emptyBadge.hidden=true;var signedOutStatus=document.getElementById("notificationSyncStatus");if(signedOutStatus)signedOutStatus.textContent="Войдите, чтобы получать уведомления.";return Promise.resolve();}if(window.notificationPrefsOwnerKey!==window.notificationPrefsKey())window.loadNotificationPrefs();var requestId=window._notificationRequestId=(window._notificationRequestId||0)+1;var status=document.getElementById("notificationSyncStatus");if(status){status.textContent="Обновляем уведомления…";status.dataset.state="loading";}return window.API.getNotifications().then(function(r){if(requestId!==window._notificationRequestId)return;if(!r||!r.success)throw Error(r&&r.error||"Сервер не подтвердил загрузку уведомлений");window.notificationCache=Array.isArray(r.notifications)?r.notifications:[];var badge=document.getElementById("notificationBadge");if(badge){var count=Number(r.unread||0);badge.textContent=count>99?"99+":String(count);badge.hidden=count<1;}window.renderNotificationControls();var pop=document.getElementById("notificationPopover");if(pop&&!pop.hidden)window.renderNotificationItems();if(status){status.textContent="Обновлено: "+new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});status.dataset.state="ok";}}).catch(function(e){if(requestId!==window._notificationRequestId)return;if(status){status.textContent=(window.notificationCache||[]).length?"Нет связи с сервером. Показаны последние загруженные уведомления.":"Не удалось загрузить уведомления. Проверьте подключение и нажмите ↻.";status.dataset.state="error";}var pop=document.getElementById("notificationPopover");if(pop&&!pop.hidden)window.renderNotificationItems();console.warn("[Уведомления]",e&&e.message||e);});};
window.setupNotificationCenter=function(){var bell=document.getElementById("notificationBell"),pop=document.getElementById("notificationPopover");if(!bell||!pop||bell.dataset.ready)return;bell.dataset.ready="1";var syncStatus=document.getElementById("notificationSyncStatus");if(!syncStatus){syncStatus=document.createElement("div");syncStatus.id="notificationSyncStatus";syncStatus.setAttribute("role","status");syncStatus.setAttribute("aria-live","polite");syncStatus.style.cssText="padding:6px 12px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--border)";var head=pop.querySelector(".notification-popover-head");if(head&&head.parentNode)head.parentNode.insertBefore(syncStatus,head.nextSibling);else pop.insertBefore(syncStatus,pop.firstChild);}window.loadNotificationPrefs();var close=function(){pop.hidden=true;bell.setAttribute("aria-expanded","false");};bell.onclick=function(){var open=pop.hidden;pop.hidden=!open;bell.setAttribute("aria-expanded",String(open));if(open){window.renderNotificationControls();window.renderNotificationItems();window.refreshNotificationCenter();}};document.getElementById("notificationClose").onclick=close;document.getElementById("notificationRefresh").onclick=function(){window.refreshNotificationCenter();};document.getElementById("notificationStatusFilter").onchange=function(e){window.notificationStatusFilter=e.target.value;window.renderNotificationItems();};document.getElementById("notificationCourseFilter").onchange=function(e){window.notificationCourseFilter=e.target.value;window.renderNotificationItems();};var pb=document.getElementById("notificationPrefsBtn"),pp=document.getElementById("notificationPrefs");pb.onclick=function(){pp.hidden=!pp.hidden;pb.setAttribute("aria-expanded",String(!pp.hidden));};document.getElementById("notificationMarkAll").onclick=function(){var btn=this;btn.disabled=true;window.API.markAllNotificationsRead().then(function(r){if(!r||!r.success)throw Error(r&&r.error||"Не удалось отметить уведомления");return window.refreshNotificationCenter();}).then(function(){window.showToast("Все уведомления отмечены прочитанными","ok");}).catch(function(e){window.showToast(e.message,"error");}).finally(function(){btn.disabled=false;});};document.addEventListener("click",function(e){if(!e.target.closest("#notificationWrap"))close();});window.refreshNotificationCenter();if(!window._notificationPoll)window._notificationPoll=setInterval(function(){if(document.visibilityState!=="hidden")window.refreshNotificationCenter();},60000);if(!window._notificationVisibilityBound){window._notificationVisibilityBound=true;document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&(window.state.student||window.state.staff))window.refreshNotificationCenter();});}};

window.unlockAchievement = function(id) {
    if (!window.state.unlockedAchievements) window.state.unlockedAchievements = [];
    if (window.isStandaloneCourse && window.isStandaloneCourse(window.state.activeCourseId)) return;
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
    var hasSession = false; try { hasSession = !!sessionStorage.getItem("mdk.session"); } catch (e) {}
    if (!window.API || !window.API.getCustomContent || (!window.state.student && !window.state.staff) || !hasSession) {
        if (callback) callback();
        return;
    }
    return window.API.getCustomContent().then(res => {
        if (res && res.success) {
            window.customContent.topics = res.data.filter(d => d.type === 'topic');
            window.customContent.files = res.data.filter(d => d.type === 'file');
            window.customContent.lectures = res.data.filter(d => d.type === 'lecture');
            window.customContent.tests = res.data.filter(d => d.type === 'test');
            window.customContent.flashcards = res.data.filter(d => d.type === 'flashcards');
            window.customContent.games = res.data.filter(d => d.type === 'game');
            window.customContent.announcements = res.data.filter(d => d.type === 'announcement');
        } else if (res && res.error) {
            // API возвращает ошибки авторизации JSON-ответом, а не исключением.
            var tokenAfterResponse = false;
            try { tokenAfterResponse = !!sessionStorage.getItem("mdk.session"); } catch (e) {}
            if (!tokenAfterResponse && window.state && (window.state.student || window.state.staff)) {
                window.state.student = null;
                window.state.staff = null;
                try { localStorage.setItem("mdk.state", JSON.stringify(window.state)); } catch (e) {}
                var login = document.getElementById("loginOverlay");
                if (login) login.style.display = "flex";
                if (window.renderUserChip) window.renderUserChip();
                if (window.updateMenuVisibility) window.updateMenuVisibility();
            }
        }
        if (callback) callback();
    }).catch(err => {
        console.error("Ошибка загрузки кастомного контента", err);
        // Если сервер явно отклонил токен, убираем только авторизацию,
        // сохраняя локальный учебный прогресс. При обычном сбое сети вход не сбрасываем.
        var tokenStillPresent = false;
        try { tokenStillPresent = !!sessionStorage.getItem("mdk.session"); } catch (e) {}
        if (!tokenStillPresent && window.state && (window.state.student || window.state.staff)) {
            window.state.student = null;
            window.state.staff = null;
            try { localStorage.setItem("mdk.state", JSON.stringify(window.state)); } catch (e) {}
            var login = document.getElementById("loginOverlay");
            if (login) login.style.display = "flex";
            if (window.renderUserChip) window.renderUserChip();
            if (window.updateMenuVisibility) window.updateMenuVisibility();
        }
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
    if (val.trim()) window.unlockAchievement('first_practical');
    var mcDone = ['ПР-MC-01','ПР-MC-02','ПР-MC-03','ПР-MC-04','ПР-MC-05'].filter(function(k){return !!(window.state.results['prac_'+k] || '').trim();});
    if (mcDone.length === 5) window.unlockAchievement('mastercam_5');
    
    if (window.state.student && window.API) {
        window.API.saveResult({
            email: window.state.student.email, name: window.state.student.name, group: window.state.student.group,
            testId: `prac_${code}`, testTitle: "Практика: " + code, grade: 0, payload: val
        }).then(() => window.showToast("Ответ отправлен преподавателю!", "ok")).catch(() => window.showToast("Ошибка отправки", "err"));
    }
};

window.saveSelfAnswer = function(code) {
    var val = document.getElementById(`self_input_${code}`).value;
    if (!window.state.results) window.state.results = {};
    window.state.results[`self_${code}`] = val;
    window.saveStudentData();
    
    if (window.state.student && window.API) {
        window.API.saveResult({
            email: window.state.student.email, name: window.state.student.name, group: window.state.student.group,
            testId: `self_${code}`, testTitle: "Самостоятельная: " + code, grade: 0, payload: val
        }).then(() => window.showToast("Ответ отправлен преподавателю!", "ok")).catch(() => window.showToast("Ошибка отправки", "err"));
    }
};

// ==========================================
// 4. РЕНДЕР СТРАНИЦ
// ==========================================
window.renderVideosPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎬 Видеоуроки</h1></section><div class="module" id="videosList"></div>';
    var list = document.getElementById("videosList");
    var vids = window.GLOBAL_DATA && window.GLOBAL_DATA.videos ? window.GLOBAL_DATA.videos : [];
    if (!vids.length) { list.innerHTML = "<p>Видео пока нет.</p>"; return; }
    vids.forEach(v => {
        list.innerHTML += `<div style="margin-bottom:20px; background:var(--card-soft); padding:15px; border-radius:8px; border:1px solid var(--border);"><b style="color:var(--accent); font-size:16px;">${v.title}</b><p style="font-size:14px; margin:5px 0;">${v.description||''}</p><video src="${v.file}" controls preload="metadata" playsinline style="width:100%; border-radius:8px; max-height:70vh; background:#000;"><source src="${v.file}" type="video/mp4">Ваш браузер не поддерживает видео.</video><p style="margin-top:8px;"><a class="btn ghost" href="${v.file}" target="_blank" rel="noopener">Открыть файл</a></p></div>`;
    });
};

window.renderTrainingListPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🎯 Тренировка</h1></section>';
    var grid = document.createElement("div"); grid.style.cssText = "display:flex; flex-direction:column; gap:12px;";
    var gcodeCard = document.createElement("a"); gcodeCard.href = "#/gcode-trainer"; gcodeCard.className = "module"; gcodeCard.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--accent); border-radius:12px;";
    gcodeCard.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">📐 Тренажер G-кода</h3><p>Интерактивный симулятор.</p>`;
    grid.appendChild(gcodeCard);
    var mdkList = [{ id: "07.01", title: "МДК 07.01" }, { id: "04.01", title: "МДК 04.01" }, { id: "02.01", title: "МДК 02.01" }, { id: "02.02", title: "МДК 02.02" }];
    mdkList.forEach(mdk => {
        var card = document.createElement("a"); card.href = "#/training/" + mdk.id; card.className = "module"; card.style = "display:block; padding:20px; text-decoration:none; color:var(--text); background:var(--card-soft); border:1px solid var(--border); border-radius:12px;";
        card.innerHTML = `<h3 style="margin-top:0; color:var(--accent);">${mdk.title}</h3>`;
        grid.appendChild(card);
    });
    app.appendChild(grid);
};

window.renderGcodeTrainerPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/training" style="color:var(--accent);">← Назад</a><section class="hero"><h1>📐 Тренажер G-кода</h1></section>';
    var iframe = document.createElement("iframe"); iframe.src = "./gcode_trainer_advanced.html"; iframe.style = "width:100%; height:80vh; border:none; border-radius:12px; background:#0d1117;"; iframe.setAttribute("allow", "fullscreen"); app.appendChild(iframe);
};

window.renderSafetyPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>🦺 Охрана труда</h1></section><div class="module" id="safetyList"></div>';
    var list = document.getElementById("safetyList");
    var items = window.GLOBAL_DATA && window.GLOBAL_DATA.safety ? window.GLOBAL_DATA.safety : [];
    if (!items.length) { list.innerHTML = "<p>Материалы пока не добавлены.</p>"; return; }
    items.forEach(item => {
        list.innerHTML += `<div style="margin-bottom:15px; padding:15px; background:var(--card-soft); border-radius:8px; border:1px solid var(--border);"><b style="color:var(--accent);">${item.title}</b><p style="font-size:14px; margin:5px 0;">${item.description||''}</p><a class="btn ghost" href="${item.file}" target="_blank" download>📥 Скачать</a></div>`;
    });
};

window.renderPassportsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    app.innerHTML = '<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a><section class="hero"><h1>📄 Паспорта станков</h1></section><div class="module" id="passList"></div>';
    var list = document.getElementById("passList");
    var items = window.GLOBAL_DATA && window.GLOBAL_DATA.passports ? window.GLOBAL_DATA.passports : [];
    if (!items.length) { list.innerHTML = "<p>Материалы пока не добавлены.</p>"; return; }
    items.forEach(item => {
        list.innerHTML += `<div style="margin-bottom:15px; padding:15px; background:var(--card-soft); border-radius:8px; border:1px solid var(--border);"><b style="color:var(--accent);">${item.title}</b><p style="font-size:14px; margin:5px 0;">${item.description||''}</p><a class="btn ghost" href="${item.file}" target="_blank" download>📥 Скачать</a></div>`;
    });
};

window.renderStudentGradesPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Мои оценки";
    app.appendChild(el('<a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в профиль</a>'));
    
    var autoGradesList = Object.keys(window.state.results || {}).filter(k => !k.startsWith("topic_") && k !== "certificateApproved" && k !== "certificate");
    var autoRows = autoGradesList.map(k => {
        var title = k; 
        if(k.startsWith("test_")) title = "Тест по курсу " + k.split("_")[1];
        if(k.startsWith("__final__")) title = "Итоговый экзамен";
        if(k.startsWith("prac_")) title = "Практика: " + k.replace("prac_", "");
        var gradeData = window.state.results[k];
        var grade = typeof gradeData === 'object' ? gradeData.grade : (typeof gradeData === 'string' ? "Сдано" : "—");
        var color = grade >= 4 ? "var(--ok)" : (grade >= 3 ? "var(--gold)" : (grade === "Сдано" ? "var(--accent)" : "var(--err)"));
        return `<tr><td style="padding:10px; border:1px solid var(--border);">${title}</td><td style="padding:10px; border:1px solid var(--border); text-align:center; font-weight:bold; color:${color}; font-size:18px;">${grade}</td></tr>`;
    }).join("");

    var manualGrades = JSON.parse(localStorage.getItem('portal_grades') || '[]');
    var myManualGrades = manualGrades.filter(g => g.student.toLowerCase() === (window.state.student.email || '').toLowerCase());
    var manualRows = myManualGrades.map(g => {
        return `<tr><td style="padding:10px; border:1px solid var(--border);">${g.date}</td><td style="padding:10px; border:1px solid var(--border);">${g.subject}</td><td style="padding:10px; border:1px solid var(--border); text-align:center; font-weight:bold; color:var(--ok); font-size:18px;">${g.value}</td></tr>`;
    }).join("");

    app.innerHTML += `
        <section class="hero"><h1>📊 Мои оценки</h1></section>
        <div class="module"><h3>Оценки от преподавателя</h3><div class="journal-wrap"><table class="journal-table"><thead><tr><th>Дата</th><th>Предмет</th><th>Оценка</th></tr></thead><tbody>${manualRows || '<tr><td colspan="3" style="text-align:center; color:var(--muted);">Пока нет оценок</td></tr>'}</tbody></table></div></div>
        <div class="module"><h3>Автоматические тесты и практики</h3><div class="journal-wrap"><table class="journal-table"><thead><tr><th>Работа</th><th>Результат</th></tr></thead><tbody>${autoRows || '<tr><td colspan="2" style="text-align:center; color:var(--muted);">Вы еще не проходили тесты</td></tr>'}</tbody></table></div></div>
        <div class="module"><h3>Задания преподавателя</h3><div id="serverAssignmentGrades" style="padding:10px;color:var(--muted)">Загрузка…</div></div>
    `;
    var remoteHost=document.getElementById("serverAssignmentGrades");
    if(remoteHost&&window.API&&window.API.getMyCourseResults){window.API.getMyCourseResults("").then(function(r){if(!r||!r.success)throw new Error(r&&r.error||"Не удалось загрузить оценки");var rows=(r.results||[]).filter(function(x){return String(x.testId||"").indexOf("assignment_")===0;});remoteHost.innerHTML=rows.length?'<div class="journal-wrap"><table class="journal-table"><thead><tr><th>Задание</th><th>Дата отправки</th><th>Оценка</th><th>Комментарий</th></tr></thead><tbody>'+rows.map(function(x){return "<tr><td>"+window.escapeHtml(x.testTitle)+"</td><td>"+window.escapeHtml(x.finishedAt?new Date(x.finishedAt).toLocaleString("ru-RU"):"—")+"</td><td style='text-align:center;font-weight:bold'>"+(x.grade!==""&&x.grade!=null?window.escapeHtml(x.grade):"На проверке")+"</td><td style='white-space:pre-wrap'>"+window.escapeHtml(x.feedback||"—")+"</td></tr>";}).join("")+"</tbody></table></div>":"Пока нет отправленных заданий.";}).catch(function(e){remoteHost.textContent="Не удалось загрузить оценки за задания: "+e.message;});}
};

window.renderTeacherJournalPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    if (!window.state.staff) { app.innerHTML = "<h2>Доступ запрещен</h2>"; return; }
    document.getElementById("crumbs").textContent = "Журнал (Преподаватель)";
    
    var grades = JSON.parse(localStorage.getItem('portal_grades') || '[]');
    app.innerHTML = `
        <a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>
        <section class="hero"><h1>📓 Журнал группы</h1></section>
        <div class="module">
            <h3>Выставить оценку</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <select id="grade-group" class="self-input" style="flex:1;"><option value="Группа 1">Группа 1</option><option value="Группа 2">Группа 2</option></select>
                <input type="text" id="grade-student" placeholder="Email студента" class="self-input" style="flex:2;">
                <input type="text" id="grade-subject" placeholder="Предмет" class="self-input" style="flex:1;">
                <input type="number" id="grade-value" placeholder="Оценка" class="self-input" style="width:100px;" min="2" max="5">
            </div>
            <button class="btn btn-primary" onclick="window.addGrade()" style="margin-top:10px;">Сохранить оценку</button>
        </div>
        <div class="module">
            <h3>Все оценки</h3>
            <div class="journal-wrap"><table class="journal-table"><thead><tr><th>Дата</th><th>Группа</th><th>Студент</th><th>Предмет</th><th>Оценка</th></tr></thead><tbody id="grades-table-body">
                ${grades.map(g => `<tr><td>${g.date}</td><td>${g.group}</td><td>${g.student}</td><td>${g.subject}</td><td><b style="color:var(--ok); font-size:16px;">${g.value}</b></td></tr>`).join('')}
            </tbody></table></div>
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
    document.getElementById("crumbs").textContent = "Сертификат";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    if (!window.state.student) return;
    var courseName = window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId] ? window.MDK_DATA[window.state.activeCourseId].title : "МДК";
    var isApproved = window.state.results && window.state.results.certificateApproved;
    
    app.innerHTML += `<div class="no-print" style="text-align:center; margin:20px 0;"><button class="btn" onclick="window.print()">🖨 Распечатать сертификат</button></div>
    <div id="printable-cert" style="background:#fff; color:#000; padding:40px; max-width:900px; margin:0 auto; border:10px double #c14a2a; text-align:center; position:relative;">
        <h1 style="font-size:40px; color:#c14a2a; font-family:'Monomakh', serif;">СЕРТИФИКАТ</h1>
        <p style="font-size:20px; margin:40px 0;">подтверждает, что</p>
        <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block; padding-bottom:5px;">${window.escapeHtml(window.state.student.name)}</h2>
        <p style="font-size:18px; margin-top:40px;">успешно прошел(ла) обучение по программе</p>
        <h3 style="font-size:24px; color:#c14a2a; margin-top:10px;">${window.escapeHtml(courseName)}</h3>
        <div style="margin-top:60px; display:flex; justify-content:space-between;"><div style="text-align:left;">Дата: ${new Date().toLocaleDateString('ru-RU')}</div><div style="text-align:right;">Подпись: _______________</div></div>
        ${!isApproved ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); font-size:80px; font-weight:bold; color:rgba(255,0,0,0.1); pointer-events:none;">ОБРАЗЕЦ</div>` : ""}
    </div>`;
};

window.renderProfilePage = function(route) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    if (!window.state.student && !window.state.staff) { location.hash = "#/"; return; }
    document.getElementById("crumbs").textContent = "Личный кабинет";
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
            <div style="display:flex; justify-content:center; gap:15px; margin-bottom:20px;"><div style="background:var(--card-soft); padding:10px 20px; border-radius:20px;"><b style="color:var(--gold);">${window.state.xp} XP</b> · Ур. ${lvl}</div></div>
            <div style="display:flex; gap:10px; justify-content:center;"><a href="#/grades" class="btn" style="background:var(--ok); color:#fff;">📊 Мои оценки</a><a href="#/shop" class="btn">🛒 Магазин XP</a></div>
        </section>`;
    }
};

window.renderAchievementsPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Достижения";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.innerHTML += `<section class="hero"><h1>🏆 Достижения</h1></section>`;
    var allAch = window.ACHIEVEMENTS || [];
    var unlocked = window.state.unlockedAchievements || [];
    var html = `<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px;">`;
    allAch.forEach(ach => {
        var isUnlocked = unlocked.includes(ach.id);
        var opacity = isUnlocked ? "1" : "0.4";
        var icon = isUnlocked ? ach.icon : "🔒";
        html += `<div class="module" style="padding:20px; text-align:center; opacity:${opacity};"><div style="font-size:48px; margin-bottom:10px;">${icon}</div><h4 style="margin:0 0 5px 0; color:var(--accent);">${ach.title}</h4><p style="font-size:13px; color:var(--muted); margin:0;">${ach.desc}</p></div>`;
    });
    html += `</div>`;
    app.innerHTML += html;
};

// ==========================================
// 5. СТРАНИЦА ТЕМЫ
// ==========================================
window.renderTopicPage = function(courseId, topicId, activeTab) {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var course = window.MDK_DATA[courseId]; if (!course) { app.innerHTML = '<div class="module">Курс не найден</div>'; return; }
    var topic = null; 
    
    course.sections.forEach(s => { s.topics.forEach(t => { if (t.id === topicId) topic = t; }); });
    if (!topic && window.customContent.topics) {
        var ct = window.customContent.topics.find(t => t.id === topicId);
        if (ct) {
            topic = { id: ct.id, code: ct.title.split(' ')[0], title: ct.title.split(' ').slice(1).join(' '), lectures: [{ code: "Лекция", title: ct.title, content: ct.content }], practicals: [], selfWork: [], test: [] };
        }
    }
    var customTopicTests = (window.customContent.tests || []).filter(function (t) { return t.mdkId === courseId && t.topicId === topicId; });
    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена</div>'; return; }
    
    document.getElementById("crumbs").textContent = topic.code + " " + topic.title;
    app.appendChild(el(`<a class="backlink" href="#/" style="color:var(--accent);">← Назад к плану</a>`));
    app.appendChild(el(`<section class="hero"><h1 class="neon-text">${topic.code} ${topic.title}</h1></section>`));
    
    var tabsHtml = `<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
        <button class="btn tab active" id="tab-lectures" onclick="window.switchTopicTab('lectures')">📖 Лекции</button>
        ${(topic.practicals && topic.practicals.length) ? `<button class="btn tab ghost" id="tab-practicals" onclick="window.switchTopicTab('practicals')">🛠️ Практика</button>` : ''}
        ${(topic.selfWork && topic.selfWork.length) ? `<button class="btn tab ghost" id="tab-selfwork" onclick="window.switchTopicTab('selfwork')">📝 Самостоятельная</button>` : ''}
        ${((topic.test && topic.test.length) || customTopicTests.length) ? `<button class="btn tab ghost" id="tab-test" onclick="window.switchTopicTab('test')">🎯 Тест</button>` : ''}
    </div><div id="topicContent" class="module"></div>`;
    app.innerHTML += tabsHtml;

    window.switchTopicTab = function(tabName) {
        document.querySelectorAll(".tab").forEach(btn => { btn.classList.remove("active"); btn.classList.add("ghost"); });
        var activeBtn = document.getElementById(`tab-${tabName}`); if (activeBtn) { activeBtn.classList.add("active"); activeBtn.classList.remove("ghost"); }
        var contentArea = document.getElementById("topicContent"); if (!contentArea) return; contentArea.innerHTML = "";

        if (tabName === 'lectures') {
            if (topic.lectures && topic.lectures.length) {
                topic.lectures.forEach(lec => {
                    contentArea.innerHTML += `<details class="lec-accordion" open style="margin-bottom:10px; background:var(--card); border:1px solid var(--border); border-radius:8px;"><summary style="padding:15px; font-weight:bold; cursor:pointer;">${lec.code} ${lec.title}</summary><div class="lec-content" style="padding:20px; border-top:1px solid var(--border); line-height:1.6; font-size:15px;">${lec.content}</div></details>`;
                });
            } else {
                contentArea.innerHTML += "<p>Текстовых лекций нет.</p>";
            }

            var files = window.customContent.files ? window.customContent.files.filter(f => f.mdkId === courseId && f.topicId === topicId) : [];
            if (files.length > 0) {
                var filesHtml = `<div style="margin-top:20px; padding-top:15px; border-top:2px solid var(--border);"><h3 style="color:var(--accent); margin-bottom:10px;">📎 Прикрепленные материалы:</h3><div style="display:flex; flex-direction:column; gap:8px;">`;
                files.forEach(f => { filesHtml += `<a href="${f.fileUrl}" target="_blank" class="btn ghost" style="justify-content:flex-start; padding:12px 15px; text-align:left;"><span style="font-size:20px;">📄</span> <b>${f.title}</b></a>`; });
                filesHtml += `</div></div>`;
                contentArea.innerHTML += filesHtml;
            }
            window.unlockAchievement('reader');
        }
        else if (tabName === 'practicals') {
            if (topic.practicals && topic.practicals.some(function(p){return p.code === 'ПР-MC-01';})) window.unlockAchievement('mastercam_1');
            if (!topic.practicals || !topic.practicals.length) { contentArea.innerHTML = "<p>Практических работ нет.</p>"; return; }
            topic.practicals.forEach(prac => {
                var savedAns = window.state.results[`prac_${prac.code}`] || '';
                var resourcesHtml = (prac.resources || []).map(function(resource) {
                    return '<a class="btn ghost" href="' + window.escapeHtml(resource.url) + '" target="_blank" rel="noopener noreferrer" style="margin:6px 8px 6px 0;">' + window.escapeHtml(resource.icon || '📁') + ' ' + window.escapeHtml(resource.title) + ' ↗</a>';
                }).join('');
                contentArea.innerHTML += `<div class="card" style="margin-bottom:15px;"><h3 style="color:var(--accent); margin-top:0;">${prac.code} ${prac.title}</h3><p><b>Цель:</b> ${prac.goal}</p><p><b>Задание:</b> ${prac.task}</p>${resourcesHtml ? '<div class="prac-resources"><b>Материалы к уроку:</b><div>' + resourcesHtml + '</div></div>' : ''}${prac.notice ? '<p class="prac-notice">' + window.escapeHtml(prac.notice) + '</p>' : ''}${(prac.variants && prac.variants.length) ? `<p><b>Варианты:</b> ${prac.variants.join(', ')}</p>` : ''}<div style="margin-top:20px; padding-top:15px; border-top:1px dashed var(--border);"><label style="font-size:14px; font-weight:bold; color:var(--text-soft);">Ваш письменный ответ / Решение:</label><textarea class="self-input" id="prac_input_${prac.code}" rows="5" style="margin-top:8px; font-family:monospace;" placeholder="Введите здесь ваше решение...">${savedAns}</textarea><button class="btn" onclick="window.savePracAnswer('${prac.code}')" style="margin-top:10px;">💾 Сохранить ответ</button></div></div>`;
            });
        }
        else if (tabName === 'selfwork') {
            if (!topic.selfWork || !topic.selfWork.length) { contentArea.innerHTML = "<p>Самостоятельных работ нет.</p>"; return; }
            topic.selfWork.forEach((work, workIndex) => {
                var workCode = work.code || (topic.id + "_СР" + (workIndex + 1));
                var testKey = "self_" + topic.id + "_" + workIndex;
                var testData = window.EXTRA_TESTS && window.EXTRA_TESTS[testKey];
                if (!testData && window.EXTRA_TESTS && work.code) {
                    testData = window.EXTRA_TESTS["self_" + String(work.code).replace(/\\s+/g, "")];
                }
                var isDone = window.state.results && window.state.results[testKey];
                contentArea.innerHTML += `<div class="card" style="margin-bottom:15px;"><h3 style="color:var(--accent); margin-top:0;">${window.escapeHtml(workCode)} ${window.escapeHtml(work.title || "")}</h3><p><b>Задание:</b> ${window.escapeHtml(work.task || "Изучить материал и подготовить ответ.")}</p>${(work.questions && work.questions.length) ? `<p><b>Вопросы:</b></p><ul>${work.questions.map(q => `<li>${window.escapeHtml(q)}</li>`).join('')}</ul>` : ''}</div>`;
                if (testData && Array.isArray(testData.questions) && testData.questions.length) {
                    contentArea.innerHTML += `<div style="text-align:center; padding:20px; background:var(--card-soft); border-radius:8px; margin-bottom:15px; border:1px solid var(--border);"><h3>🎯 Тест самоконтроля</h3><p style="font-size:14px; color:var(--muted);">Вопросов: ${testData.questions.length}</p>${isDone ? `<p>Последняя оценка: <b>${isDone.grade || "—"}</b></p>` : ""}<button class="btn" onclick="window.startInlineTest('${topic.id}', ${workIndex})" style="padding:10px 20px;">${isDone ? "Пройти заново" : "Начать тест"}</button></div>`;
                } else {
                    var savedAns = window.state.results["self_" + workCode] || "";
                    contentArea.innerHTML += `<div style="margin-top:15px; padding-top:15px; border-top:1px dashed var(--border);"><label style="font-size:14px; font-weight:bold; color:var(--text-soft);">Ваш ответ:</label><textarea class="self-input" id="self_input_${workCode}" rows="4" style="margin-top:8px;" placeholder="Введите ответ...">${window.escapeHtml(savedAns)}</textarea><button class="btn" onclick="window.saveSelfAnswer('${workCode}')" style="margin-top:10px;">💾 Сохранить ответ</button></div>`;
                }
            });
        }
        else if (tabName === 'test') {
            var customHtml = customTopicTests.map(function (test) {
                return '<div class="card" style="padding:16px;margin:10px 0"><h3>'+window.escapeHtml(test.title)+'</h3><p>Вопросов: '+((test.questions||[]).length)+'</p><button class="btn" onclick="window.startCustomInlineTest(\''+window.escapeHtml(test.id)+'\')">Начать тест</button></div>';
            }).join("");
            if (customHtml) contentArea.innerHTML = '<h3>Тесты преподавателя</h3>'+customHtml;
            if (topic.test && topic.test.length) {
                var testId = "test_" + topic.id; var isDone = window.state.results && window.state.results[testId];
                contentArea.innerHTML += isDone ? '<div style="text-align:center;padding:20px;background:var(--card-soft);border-radius:8px"><h3>Тест уже пройден</h3><p>Оценка: <b>'+isDone.grade+'</b></p><button class="btn" onclick="window.startInlineTest(\''+topic.id+'\',null)">Пройти заново</button></div>' : '<div style="text-align:center;padding:20px;background:var(--card-soft);border-radius:8px"><h3>Тест по теме</h3><p>Вопросов: '+topic.test.length+'</p><button class="btn" onclick="window.startInlineTest(\''+topic.id+'\',null)">Начать тест</button></div>';
            }
            if (!customHtml && !(topic.test && topic.test.length)) contentArea.innerHTML = "<p>Вопросов нет.</p>";
        }
    };

    window.startCustomInlineTest = async function(testId) {
        var test = (window.customContent.tests || []).find(function (t) { return String(t.id) === String(testId); });
        var area = document.getElementById("topicContent");
        if (!test || !area) { if (area) area.textContent = "Тест не найден."; return; }
        area.dataset.testId="custom_"+testId;area.dataset.proctorAssessment="1";
        var questions = test.questions || [], answers = [], index = 0, started = Date.now();
        if (!questions.length) { area.textContent = "В тесте пока нет вопросов."; return; }
        function draw() {
            if (index >= questions.length) {
                area.innerHTML = "<p>Проверяем ответы на сервере…</p>";
                window.API.submitCustomTest(testId, answers, Math.round((Date.now()-started)/1000)).then(function (result) {
                    if (!result || !result.success) throw new Error(result && result.error || "Не удалось проверить тест.");
                    area.dataset.proctorAssessment="0";
                    area.innerHTML = '<div style="text-align:center;padding:28px;background:var(--card-soft);border-radius:12px"><h2>Тест завершён</h2><p>Верных ответов: <b>'+result.score+' из '+result.maxScore+'</b></p><p>Результат: <b>'+result.percent+'%</b></p><h1 style="font-size:48px;color:var(--accent)">Оценка: '+result.grade+'</h1><button class="btn" onclick="window.switchTopicTab(\'test\')">Вернуться к тестам</button></div>';
                }).catch(function (error) { area.textContent = error.message || "Ошибка проверки теста."; });
                return;
            }
            var q = questions[index], html = '<div class="museum-muted">Вопрос '+(index+1)+' из '+questions.length+'</div><h3>'+window.escapeHtml(q.q||"")+'</h3>';
            (q.options||[]).forEach(function (option,i) { html += '<button class="btn ghost" data-custom-answer="'+i+'" style="display:block;width:100%;text-align:left;margin:7px 0">'+window.escapeHtml(option)+'</button>'; });
            area.innerHTML = html;
            area.querySelectorAll("[data-custom-answer]").forEach(function (button) { button.onclick = function () { answers[index] = Number(button.dataset.customAnswer); index++; draw(); }; });
        }
        draw();
    };

    window.startInlineTest = function(topicId, selfWorkCode) {
        var contentArea = document.getElementById("topicContent"); 
        var questions = [];
        
        var routeParts = (location.hash || "").replace(/^#/, "").split("/").filter(Boolean);
        var courseId = routeParts[0] === "topic" ? routeParts[1] : (window.state && window.state.activeCourseId);
        var course = window.MDK_DATA && window.MDK_DATA[courseId];
        var topic = null;
        if (course) (course.sections || []).forEach(s => (s.topics || []).forEach(t => { if (t.id === topicId) topic = t; }));
        if (selfWorkCode !== null && selfWorkCode !== undefined) {
            var workIndex = typeof selfWorkCode === "number" ? selfWorkCode : (topic ? (topic.selfWork || []).findIndex(w => w.code === selfWorkCode) : -1);
            if (workIndex < 0) workIndex = 0;
            var testData = window.EXTRA_TESTS && window.EXTRA_TESTS[`self_${topicId}_${workIndex}`];
            if (!testData && window.EXTRA_TESTS) {
                var legacyKey = Object.keys(window.EXTRA_TESTS).find(k => k.indexOf("self_" + topicId + "_") === 0 && window.EXTRA_TESTS[k] && window.EXTRA_TESTS[k].questions);
                if (legacyKey) testData = window.EXTRA_TESTS[legacyKey];
            }
            if (testData && testData.questions) questions = [...testData.questions];
            if (!questions.length && topic && topic.test) questions = [...topic.test];
        } else {
            if (topic && topic.test) questions = [...topic.test];
            if (window.HARD_TESTS && window.HARD_TESTS[topicId]) questions = questions.concat(window.HARD_TESTS[topicId]);
        }
        

        // Защищённая выдача: студент получает формулировки без ключей, проверка выполняется на сервере.
        if (window.state && window.state.student && window.API && window.API.getBuiltInTest && window.API.submitBuiltInTest) {
            var serverWorkIndex = selfWorkCode !== null && selfWorkCode !== undefined ? (typeof selfWorkCode === "number" ? selfWorkCode : (topic ? (topic.selfWork || []).findIndex(w => w.code === selfWorkCode) : 0)) : -1;
            if (serverWorkIndex < 0) serverWorkIndex = 0;
            var serverTestId = selfWorkCode !== null && selfWorkCode !== undefined ? "self_" + topicId + "_" + serverWorkIndex : "test_" + topicId;
            var serverBankIds = selfWorkCode !== null && selfWorkCode !== undefined ? ["self_" + topicId + "_" + serverWorkIndex, "topic_" + topicId] : ["topic_" + topicId, "hard_" + topicId];
            contentArea.innerHTML = "<p>Загружаем вопросы из защищённого банка…</p>";
            window.API.getBuiltInTest(courseId, serverTestId, serverBankIds).then(function(serverBank) {
                if (!serverBank || !serverBank.success || !serverBank.questions || !serverBank.questions.length) {
                    var serverReason = serverBank && serverBank.error ? String(serverBank.error) :
                        (serverBank && serverBank.notImported ? "В хранилище не найдены запрошенные банки." : "Сервер не вернул вопросы.");
                    var bankDiagnostics = "";
                    if (serverBank && serverBank.notImported) {
                        bankDiagnostics = '<p style="font-size:12px;color:var(--muted)"><b>Запрошено:</b> ' + safeText((serverBank.requestedBankIds || serverBankIds).join(", ")) +
                            '<br><b>Проверено:</b> ' + safeText((serverBank.resolvedBankIds || []).join(", ")) +
                            '<br><b>Есть в QuestionBank для этой дисциплины:</b> ' + safeText((serverBank.availableBankIds || []).join(", ") || "нет записей") + '</p>';
                    }
                    contentArea.innerHTML = '<div class="module"><h3>Не удалось загрузить защищённый тест</h3><p>Проверьте наличие банка вопросов для дисциплины МДК 07.01.</p><p><b>Ответ сервера:</b> ' + safeText(serverReason) + '</p><p style="font-size:12px;color:var(--muted)">Дисциплина: ' + safeText(courseId) + '<br>Тест: ' + safeText(serverTestId) + '<br>Банки: ' + safeText(serverBankIds.join(", ")) + '</p>' + bankDiagnostics + '<p>Перед повторным импортом сравните список банков выше с идентификаторами в закрытом листе QuestionBank.</p></div>';
                    return;
                }
                var secureQuestions = serverBank.questions, secureAnswers = [], secureIndex = 0, selectedMulti = {};
                contentArea.dataset.proctorAssessment = "1";
                function safeText(value) { return window.escapeHtml ? window.escapeHtml(String(value == null ? "" : value)) : String(value == null ? "" : value).replace(/[&<>"]/g, function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
                function drawSecureQuestion() {
                    if (secureIndex >= secureQuestions.length) {
                        contentArea.innerHTML = "<p>Проверяем ответы на сервере…</p>";
                        window.API.submitBuiltInTest({courseId:courseId,testId:serverTestId,bankIds:serverBankIds,attemptId:serverBank.attemptId,answers:secureAnswers,timeSpent:0,testTitle:topic ? topic.title : serverTestId}).then(function(result) {
                            if (!result || !result.success) throw new Error(result && result.error || "Сервер не смог проверить ответы.");
                            contentArea.dataset.proctorAssessment = "0";
                            var penaltyText = Number(result.penaltyPoints) > 0 ? "<p>Штраф за повторные нарушения: -" + result.penaltyPoints + " п.п.</p>" : "";
                            if (!window.state.results) window.state.results = {};
                            window.state.results[serverTestId] = {grade:result.grade,percent:result.percent,penaltyPoints:result.penaltyPoints||0};
                            if (window.saveStudentData) window.saveStudentData();
                            if (window.unlockAchievement) window.unlockAchievement("hacker");
                            contentArea.innerHTML = '<div style="text-align:center;padding:28px;background:var(--card-soft);border-radius:12px"><h2>Тест завершён</h2><p>Верных ответов: <b>'+result.score+' из '+result.maxScore+'</b></p><p>Результат: <b>'+result.percent+'%</b></p><h1 style="font-size:48px;color:var(--accent)">Оценка: '+result.grade+'</h1>'+penaltyText+'<button class="btn" id="secureTestReturn">Вернуться</button></div>';
                            var back=document.getElementById("secureTestReturn");if(back)back.onclick=function(){window.switchTopicTab(selfWorkCode!==null&&selfWorkCode!==undefined?"selfwork":"test");};
                        }).catch(function(error) {
                            contentArea.dataset.proctorAssessment="0";
                            contentArea.textContent="Ошибка проверки: "+(error.message||error);
                        });
                        return;
                    }
                    var entry=secureQuestions[secureIndex], q=entry.question||{}, type=String(q.type||"mc").toLowerCase();
                    var html='<div class="museum-muted">Вопрос '+(secureIndex+1)+' из '+secureQuestions.length+'</div><h3>'+safeText(q.q||q.question||"")+'</h3>';
                    if(type==="num"||type==="numeric"||type==="number") {
                        html+='<input id="secureAnswerInput" class="self-input" type="text" inputmode="decimal" placeholder="Введите числовой ответ"><button class="btn" id="secureNext">Ответить</button>';
                    } else if(type==="multi"||type==="multiple"||type==="multiple_choice") {
                        html+='<p>Выберите все подходящие варианты</p>'+(q.options||[]).map(function(opt,i){return '<button class="btn ghost" data-secure-multi="'+i+'" style="display:block;width:100%;text-align:left;margin:6px 0">'+safeText(opt)+'</button>';}).join("")+'<button class="btn" id="secureNext">Ответить</button>';
                    } else if(type==="order"||type==="ordering") {
                        var orderItems=q.items||[];
                        html+='<p>Расположите элементы в правильной последовательности</p>'+orderItems.map(function(item,i){return '<label style="display:flex;gap:10px;align-items:center;margin:8px 0"><span style="flex:1">'+safeText(item)+'</span><select class="self-input secure-order-position" data-secure-order="'+i+'" style="max-width:100px"><option value="">Позиция</option>'+orderItems.map(function(_,n){return '<option value="'+(n+1)+'">'+(n+1)+'</option>';}).join("")+'</select></label>';}).join("")+'<button class="btn" id="secureNext">Ответить</button>';
                    } else if(type==="match"||type==="matching") {
                        var matchPairs=q.pairs||[],matchOptions=q.options||[];
                        html+='<p>Сопоставьте элементы левого и правого столбцов</p>'+matchPairs.map(function(pair,i){return '<label style="display:flex;gap:10px;align-items:center;margin:8px 0"><span style="flex:1">'+safeText(pair.left||"")+'</span><select class="self-input secure-match-option" data-secure-match="'+i+'" style="flex:1"><option value="">Выберите соответствие</option>'+matchOptions.map(function(option,n){return '<option value="'+n+'">'+safeText(option)+'</option>';}).join("")+'</select></label>';}).join("")+'<button class="btn" id="secureNext">Ответить</button>';
                    } else {
                        html+=(q.options||[]).map(function(opt,i){return '<button class="btn ghost" data-secure-choice="'+i+'" style="display:block;width:100%;text-align:left;margin:6px 0">'+safeText(opt)+'</button>';}).join("");
                    }
                    contentArea.innerHTML=html;
                    if(type==="multi"||type==="multiple"||type==="multiple_choice") {
                        selectedMulti={};
                        contentArea.querySelectorAll("[data-secure-multi]").forEach(function(btn){btn.onclick=function(){var n=Number(btn.getAttribute("data-secure-multi"));selectedMulti[n]=!selectedMulti[n];btn.classList.toggle("active",!!selectedMulti[n]);};});
                        var next=contentArea.querySelector("#secureNext");if(next)next.onclick=function(){secureAnswers.push(Object.keys(selectedMulti).filter(function(k){return selectedMulti[k];}).map(Number).sort(function(a,b){return a-b;}));secureIndex++;drawSecureQuestion();};
                    } else if(type==="num"||type==="numeric"||type==="number") {
                        var numNext=contentArea.querySelector("#secureNext");if(numNext)numNext.onclick=function(){var input=contentArea.querySelector("#secureAnswerInput");if(!input||!String(input.value).trim()){input&&input.focus();return;}secureAnswers.push(input.value);secureIndex++;drawSecureQuestion();};
                    } else if(type==="order"||type==="ordering") {
                        var orderNext=contentArea.querySelector("#secureNext");if(orderNext)orderNext.onclick=function(){
                            var fields=Array.prototype.slice.call(contentArea.querySelectorAll(".secure-order-position")),positions=fields.map(function(field){return Number(field.value)||0;});
                            if(positions.some(function(n){return n<1;})||new Set(positions).size!==positions.length){window.showToast&&window.showToast("Укажите каждую позицию один раз.","err");return;}
                            var answer=new Array(fields.length);fields.forEach(function(field,i){answer[Number(field.value)-1]=(q.items||[])[i];});
                            secureAnswers.push(answer);secureIndex++;drawSecureQuestion();
                        };
                    } else if(type==="match"||type==="matching") {
                        var matchNext=contentArea.querySelector("#secureNext");if(matchNext)matchNext.onclick=function(){
                            var fields=Array.prototype.slice.call(contentArea.querySelectorAll(".secure-match-option")),answer=fields.map(function(field){return field.value===""?"":(q.options||[])[Number(field.value)];});
                            if(answer.some(function(value){return !value;})){window.showToast&&window.showToast("Выберите соответствие для каждой строки.","err");return;}
                            secureAnswers.push(answer);secureIndex++;drawSecureQuestion();
                        };
                    } else {
                        contentArea.querySelectorAll("[data-secure-choice]").forEach(function(btn){btn.onclick=function(){secureAnswers.push(Number(btn.getAttribute("data-secure-choice")));secureIndex++;drawSecureQuestion();};});
                    }
                }
                drawSecureQuestion();
            }).catch(function(error) {
                contentArea.textContent="Не удалось загрузить защищённый тест: "+(error.message||error)+". Обратитесь к преподавателю.";
            });
            return;
        }
        if (!questions.length) { contentArea.innerHTML = "<p>Вопросы не найдены.</p>"; return; }
        questions = questions.sort(() => Math.random() - 0.5);
        
        var currentQ = 0, correct = 0;
        function renderQ() {
            if (currentQ >= questions.length) {
                contentArea.dataset.proctorAssessment="0";
                var pct = Math.round((correct / questions.length) * 100); 
                var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
                var resKey = selfWorkCode !== null && selfWorkCode !== undefined ? `self_${topicId}_${typeof selfWorkCode === "number" ? selfWorkCode : 0}` : `test_${topicId}`;
                window.state.results[resKey] = { grade: grade }; 
                window.saveStudentData(); 
                window.unlockAchievement('hacker');
                
                if (window.state.student && window.API) {
                    window.API.saveResult({
                        email: window.state.student.email, name: window.state.student.name, group: window.state.student.group,
                        testId: resKey, testTitle: topic.title, grade: grade, score: correct, maxScore: questions.length, percent: pct, timeSpent: 0, courseId: courseId
                    }).then(function(saved){
                        if(saved&&Number(saved.penaltyPoints)>0){
                            window.state.results[resKey]={grade:saved.grade,percent:saved.percent,penaltyPoints:saved.penaltyPoints};
                            window.saveStudentData();
                            var gradeHeading=contentArea.querySelector("h1");if(gradeHeading)gradeHeading.textContent="Оценка с учётом штрафа: "+saved.grade;
                            var penaltyNote=document.createElement("p");penaltyNote.textContent="Штраф за повторное нарушение правил: -"+saved.penaltyPoints+" процентных пунктов. Отчёт преподавателю отправлен.";
                            var resultCard=contentArea.querySelector("div");if(resultCard)resultCard.appendChild(penaltyNote);
                        }
                    }).catch(function(error){window.showToast("Не удалось сохранить результат: "+(error.message||"ошибка"),"err");});
                }

                contentArea.innerHTML = `<div style="text-align:center; padding:30px; background:var(--card-soft); border-radius:12px;"><h2 style="color:var(--ok);">Тест завершен!</h2><p>Верных: <b>${correct}</b> из <b>${questions.length}</b></p><h1 style="font-size:48px; color:var(--accent);">Оценка: ${grade}</h1><button class="btn" onclick="window.switchTopicTab('${selfWorkCode ? 'selfwork' : 'test'}')">Вернуться</button></div>`; 
                return;
            }
            var q = questions[currentQ];
            var html = `<div style="display:flex; justify-content:space-between; margin-bottom:15px;"><b>Вопрос ${currentQ+1} из ${questions.length}</b></div><div style="font-weight:bold; margin-bottom:15px; font-size:16px;">${q.q}</div>`;
            q.options.forEach((opt, i) => { html += `<button class="btn ghost" style="display:block; width:100%; text-align:left; margin-top:5px; padding:10px;" onclick="window.answerInlineTest(${i})">${opt}</button>`; });
            contentArea.innerHTML = html;
        }
        window.answerInlineTest = function(selected) { if (Number(selected) === Number(questions[currentQ].correct)) correct++; currentQ++; renderQ(); };
        renderQ();
    };
    window.switchTopicTab(activeTab || 'lectures');
};

window.canAccessCourse = function(courseId) {
    if (!window.state.student && !window.state.staff) return false;
    if (window.state.staff && window.state.staff.role === "admin") return true;
    var courses = window.state.student ? (window.state.student.courses || []) : (window.state.staff.courses || []);
    return courses.indexOf(String(courseId)) !== -1 || (courseId === "MET" && courses.length > 0) || ((courseId === "ENB" || courseId === "ENT") && courses.indexOf("EN") !== -1);
};
window.syncCourseSelector = function() {
    var sel=document.getElementById("mdkSelector"); if(!sel)return;
    if(window.state&&window.state.activeCourseId==="EN")window.state.activeCourseId="ENB";
    Array.prototype.forEach.call(sel.options,function(opt){opt.hidden=!!opt.value&&!(window.canAccessCourse&&window.canAccessCourse(opt.value));});
    if(window.state.student||window.state.staff){var allowed=Array.prototype.filter.call(sel.options,opt=>!!opt.value&&window.canAccessCourse(opt.value));if(allowed.length){if(!window.canAccessCourse(window.state.activeCourseId))window.state.activeCourseId=allowed[0].value;sel.value=window.state.activeCourseId;}else sel.value="";}
};

// ==========================================
// 6. ГЛАВНАЯ СТРАНИЦА
// ==========================================
window.renderHomePage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    var mdkId = window.state.activeCourseId || "07.01";
    if (window.canAccessCourse && !window.canAccessCourse(mdkId)) {
        var permitted = Object.keys(window.MDK_DATA || {}).filter(id => id !== "basic" && id !== "technical" && window.canAccessCourse(id));
        mdkId = permitted[0] || "";
        if (mdkId) { window.state.activeCourseId = mdkId; window.saveStudentData(); }
    }
    var course = mdkId && window.MDK_DATA && window.MDK_DATA[mdkId] ? JSON.parse(JSON.stringify(window.MDK_DATA[mdkId])) : null;
    if (!course && window.state.student) {
        app.innerHTML = '<section class="hero"><h1>Доступ к дисциплинам пока не выдан</h1><p>Попросите преподавателя прислать ссылку-приглашение или назначить вам дисциплину.</p></section>';
        return;
    }

    if (course) {
        var customTopics = window.customContent.topics ? window.customContent.topics.filter(t => t.mdkId === mdkId) : [];
        if (customTopics.length > 0) {
            if (course.sections.length > 0) {
                customTopics.forEach(ct => { course.sections[0].topics.push({ id: ct.id, code: ct.title.split(' ')[0], title: ct.title.split(' ').slice(1).join(' ') }); });
            } else {
                course.sections.push({ title: "Добавленные темы", topics: customTopics.map(ct => ({ id: ct.id, code: ct.title.split(' ')[0], title: ct.title.split(' ').slice(1).join(' ') })) });
            }
        }
    }

    var title = course ? course.title : "Добро пожаловать!"; 
    var module = course ? course.module : "Выберите раздел.";
    var paletteHtml = `<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">`;
    Object.keys(window.MDK_DATA || {}).filter(id => id !== "basic" && id !== "technical" && (window.canAccessCourse ? window.canAccessCourse(id) : true)).forEach(id => {
        var c = window.MDK_DATA[id]; var isActive = id === mdkId;
        paletteHtml += `<button class="btn ${isActive ? '' : 'ghost'}" onclick="window.state.activeCourseId='${id}'; window.saveStudentData(); window.renderHomePage();" style="padding:10px 20px;">${c.shortName}</button>`;
    });
    paletteHtml += `</div>`;

    app.innerHTML = `<section class="hero" style="text-align: left; padding: 40px;"><span class="brand-badge" style="margin-bottom: 10px; display: inline-block;">${course ? course.shortName : "Портал"}</span><h1 style="font-size: 2.2rem; margin-bottom: 10px;">${title}</h1><p style="font-size: 1.1rem; color: var(--text-soft);">${module}</p>${paletteHtml}</section>`;
    
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
// 7. РОУТИНГ И АВТОРИЗАЦИЯ
// ==========================================
function setupLogin() {
    var overlay = document.getElementById("loginOverlay"); 
    if (!overlay) return;

    // Восстанавливаем интерфейс авторизованного пользователя после F5.
    // sessionStorage сохраняется при обновлении вкладки, а mdk.state содержит профиль.
    var hasSessionToken = false;
    try { hasSessionToken = !!sessionStorage.getItem("mdk.session"); } catch (e) {}
    var hasCachedIdentity = !!(window.state && (window.state.student || window.state.staff));
    if (hasSessionToken && hasCachedIdentity) {
        overlay.style.display = "none";
    } else {
        if (!hasSessionToken && window.state) {
            window.state.student = null;
            window.state.staff = null;
        }
        overlay.style.display = "flex";
    }
    
    function applyAuthSession(res, email) {
        var role = (res.role || "student").toLowerCase();
        if (role === "teacher" || role === "admin") {
            window.state.staff = { name: res.name || email, role: role, email: email, courses: res.courses || [] };
            window.state.student = null;
        } else {
            window.state.student = { name: res.name || email, group: res.group || "", email: email, role: role, courses: res.courses || [] };
            window.state.staff = null;
        }
        // Восстанавливаем прогресс именно текущего аккаунта, не смешивая данные разных пользователей на одном устройстве.
        var profile = res.profile || {};
        var isStudent = role === "student";
        window.state.xp = isStudent ? (Number(profile.xp) || 0) : 0;
        window.state.results = isStudent && profile.results && typeof profile.results === "object" ? profile.results : {};
        window.state.unlockedAchievements = isStudent && Array.isArray(profile.unlockedAchievements) ? profile.unlockedAchievements : [];
        window.state.gcodeProgress = isStudent && profile.gcodeProgress && typeof profile.gcodeProgress === "object" ? profile.gcodeProgress : null;
        window.state.activeCourseId = isStudent && (res.courses || []).indexOf(profile.activeCourseId) >= 0 ? profile.activeCourseId : ((res.courses || [])[0] || "07.01");
        window.state.avatar = isStudent ? (profile.avatar || null) : null;
        window.state.avatarEmoji = isStudent ? (profile.avatarEmoji || "👩‍🔧") : "👨‍🏫";
        window.state.avatarEffect = isStudent ? (profile.avatarEffect || "plain") : "plain";
        window.state.nickname = isStudent ? (profile.nickname || null) : null;
        window.state.purchasedThemes = isStudent && Array.isArray(profile.purchasedThemes) ? profile.purchasedThemes : [];
        window.state.purchasedTextEffects = isStudent && Array.isArray(profile.purchasedTextEffects) ? profile.purchasedTextEffects : [];
        window.state.activeTextEffect = isStudent ? (profile.activeTextEffect || "none") : "none";
        window.state.purchasedBgEffects = isStudent && Array.isArray(profile.purchasedBgEffects) ? profile.purchasedBgEffects : [];
        window.state.activeBgEffect = isStudent ? (profile.activeBgEffect || "none") : "none";
        window.state.purchasedCardEffects = isStudent && Array.isArray(profile.purchasedCardEffects) ? profile.purchasedCardEffects : [];
        window.state.activeCardEffect = isStudent ? (profile.activeCardEffect || "none") : "none";
        window.saveStudentData(); 
        window.renderUserChip();
        if (window.syncCourseSelector) window.syncCourseSelector();
        overlay.style.display = "none";
        window.unlockAchievement("welcome");
        location.hash = "#/";
        if (isStudent && window.API && window.API.logActivity) {
            window.API.logActivity({
                eventType: "session_start",
                details: "Успешный вход в портал",
                route: "/",
                pageTitle: "Начало сессии",
                courseId: String(window.state.activeCourseId || ""),
                clientAt: new Date().toISOString()
            }).catch(function(error) { console.warn("Не удалось записать начало сессии", error); });
        }
        if (window.loadGlobalCustomContent) window.loadGlobalCustomContent(function(){ window.router(); });
        else window.router();
    }

    function doUnifiedLogin() {
        var email = document.getElementById("loginEmail").value.trim(); 
        var pass = document.getElementById("loginPassword").value;
        var btn = document.getElementById("btnLoginUnified");
        
        if (!email || !pass) { alert("Введите email и пароль"); return; }
        
        btn.disabled = true; 
        btn.textContent = "1. Отправка..."; 
        
        if (typeof window.API === "undefined") {
            alert("Критическая ошибка: API не загружен. Файл api.js не подключен или содержит ошибку.");
            btn.disabled = false; btn.textContent = "Войти"; return;
        }

        setTimeout(() => { if(btn) btn.textContent = "2. Ожидание Google (до 15 сек)..."; }, 1000);
        console.log("Попытка входа...", email);

        window.API.login(email, pass).then(function(res) {
            console.log("Ответ сервера:", res);
            if (res && res.success) {
                btn.textContent = "Успех!";
                applyAuthSession(res, email);
            } else {
                alert("Ошибка сервера: " + (res && res.error ? res.error : "Сервер не вернул success=true. Проверьте логику Code.gs"));
                btn.disabled = false; btn.textContent = "Войти";
            }
        }).catch(function(err) {
            console.error("Ошибка запроса:", err);
            alert("СБОЙ СЕТИ или CORS!\n\n" + err.message + "\n\nПроверьте:\n1. Опубликована ли НОВАЯ ВЕРСИЯ скрипта?\n2. Выбран ли доступ 'Все' (Anyone)?");
            btn.disabled = false; btn.textContent = "Войти";
        });
    }

    var btn = document.getElementById("btnLoginUnified"); 
    if (btn) btn.onclick = function(e) { e.preventDefault(); doUnifiedLogin(); };
    var form = document.getElementById("unifiedLoginForm"); 
    if (form) form.onsubmit = function(e) { e.preventDefault(); doUnifiedLogin(); };
    var showReg=document.getElementById("showRegisterBtn"),regForm=document.getElementById("portalRegisterForm");
    var inviteFromUrl="";try{inviteFromUrl=new URLSearchParams(location.search).get("invite")||"";}catch(e){}
    if(document.getElementById("regInvite")&&inviteFromUrl)document.getElementById("regInvite").value=inviteFromUrl;
    if(showReg)showReg.onclick=function(){if(regForm)regForm.style.display="block";form.style.display="none";};
    var hideReg=document.getElementById("hideRegisterBtn");if(hideReg)hideReg.onclick=function(){regForm.style.display="none";form.style.display="block";};
    if(regForm)regForm.onsubmit=function(e){
      e.preventDefault();var btn=document.getElementById("btnRegister");
      var name=document.getElementById("regName").value.trim(),group=document.getElementById("regGroup").value.trim(),email=document.getElementById("regEmail").value.trim(),pass=document.getElementById("regPassword").value,invite=document.getElementById("regInvite").value.trim();
      if(!invite){alert("Введите код приглашения.");return;}if(pass.length<8){alert("Пароль должен содержать не менее 8 символов.");return;}
      btn.disabled=true;btn.textContent="Регистрация…";
      window.API.register(email,pass,name,group,invite).then(function(res){
        if(!res||!res.success)throw new Error(res&&res.error||"Не удалось зарегистрироваться.");
        return window.API.login(email,pass);
      }).then(function(res){if(!res||!res.success)throw new Error(res&&res.error||"Регистрация выполнена. Теперь войдите.");applyAuthSession(res,email);})
      .catch(function(err){alert(err.message);btn.disabled=false;btn.textContent="Зарегистрироваться";});
    };
}

window.handleLogout = function() {
    // Событие отправляется до удаления токена: fetchAPI успевает приложить действующую сессию.
    if (window.state && window.state.student && window.API && window.API.logActivity) {
        try {
            window.API.logActivity({
                eventType: "session_end",
                details: "Выход из портала",
                route: location.hash.slice(1) || "/",
                pageTitle: "Завершение сессии",
                courseId: String(window.state.activeCourseId || ""),
                clientAt: new Date().toISOString()
            }).catch(function(error) { console.warn("Не удалось записать завершение сессии", error); });
        } catch (error) { console.warn("Не удалось отправить событие завершения сессии", error); }
    }
    if (window.API && window.API.logout) window.API.logout();
    window.state.student = null; window.state.staff = null;
    localStorage.removeItem("mdk.state"); window.renderUserChip();
    var overlay = document.getElementById("loginOverlay");
    if (overlay) overlay.style.display = "flex";
    location.hash = "#/"; window.renderHomePage();
};

window.installStudentActivityCapture = window.installStudentActivityCapture || function() {
    if (window._studentActivityCaptureInstalled || !document || !document.addEventListener) return;
    window._studentActivityCaptureInstalled = true;
    document.addEventListener("click", function(event) {
        if (!window.state || !window.state.student || !window.API || !window.API.logActivity) return;
        var target = event.target && event.target.closest ? event.target.closest('a[href^="#/"],[role="tab"],.tab-btn,.nav-tab,[data-tab],[data-activity-label],button,[role="button"]') : null;
        if (!target || target.closest("[data-no-activity],input,textarea,select,.answer-option,.question-option,[data-answer]")) return;
        var isTab = target.getAttribute("role") === "tab" || target.classList.contains("tab-btn") || target.classList.contains("nav-tab") || target.hasAttribute("data-tab");
        var label = target.getAttribute("data-activity-label") || target.getAttribute("aria-label") || target.getAttribute("title") || target.textContent || target.getAttribute("href") || "Элемент интерфейса";
        label = String(label).replace(/\s+/g, " ").trim().slice(0, 120);
        if (!label) return;
        var isNavigation = target.matches('a[href^="#/"],[role="tab"],.tab-btn,.nav-tab,[data-tab],[data-activity-label]');
        if (!isNavigation && !/(начать|открыть|перейти|смотреть|запустить|продолжить|отправить|сдать|проверить|завершить|сохранить|показать|скачать|загрузить|войти|выйти|обновить|создать|добавить|удалить|редактировать|следующий|назад|пройти|выполнить)/i.test(label)) return;
        var route = location.hash.slice(1) || "/";
        var parts = route.split("/").filter(Boolean);
        var course = parts[0] === "topic" && parts[1] ? String(parts[1]) : String(window.state.activeCourseId || "");
        window.API.logActivity({
            eventType: isTab ? "tab_switch" : "click",
            details: label,
            route: route,
            pageTitle: (document.querySelector("#app h1") || document.querySelector("#app h2"))?.textContent || document.title || "",
            courseId: course,
            clientAt: new Date().toISOString()
        }).catch(function(error) { console.warn("Не удалось записать действие в журнал активности", error); });
    }, true);
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
    if (window.state.student) window.installStudentActivityCapture();
    if (window.state.student && window.API && window.API.logActivity) {
        var activityRoute = location.hash.slice(1) || "/";
        var activityParts = activityRoute.split("/").filter(Boolean);
        var activityCourse = activityParts[0] === "topic" && activityParts[1] ? String(activityParts[1]) : String(window.state.activeCourseId || "");
        var activityKey = activityRoute + "|" + activityCourse;
        if (window._lastActivityRouteKey !== activityKey) {
            window._lastActivityRouteKey = activityKey;
            window.API.logActivity({eventType: "page_view", route: activityRoute, pageTitle: activityRoute, courseId: activityCourse, clientAt: new Date().toISOString()})
                .catch(function (error) { console.warn("Не удалось записать переход в журнал активности", error); });
        }
    }

    var app = document.getElementById("app"); if(!app) return;

    if (parts.length === 0 || parts[0] === "") { window.renderHomePage(); return; }
    var page = parts[0];
    
    if (page === "topic" && parts.length >= 3) { if(window.canAccessCourse&&!window.canAccessCourse(parts[1])){window.renderHomePage();return;} window.renderTopicPage(parts[1], parts[2], parts[3] || "lectures"); return; }
    if (page === "english-media" && window.renderEnglishMediaPage) { if(window.canAccessCourse&&!window.canAccessCourse(window.state.activeCourseId||"EN")){window.renderHomePage();return;} window.renderEnglishMediaPage(parts[1] || ""); return; }
    if (page === "english-cards" && window.renderEnglishCardsPage) { if(window.canAccessCourse&&!window.canAccessCourse("EN")){window.renderHomePage();return;} window.renderEnglishCardsPage(parts[1] || ""); return; }
    if (page === "english-tests" && window.renderEnglishTestsPage) { if(window.canAccessCourse&&!window.canAccessCourse("EN")){window.renderHomePage();return;} window.renderEnglishTestsPage(parts[1] || ""); return; }
    if (page === "videos") { window.renderVideosPage(); return; }
    if (page === "safety") { window.renderSafetyPage(); return; }
    if (page === "passports") { window.renderPassportsPage(); return; }
    if (page === "gcode-trainer") { window.renderGcodeTrainerPage(); return; }
    if (page === "training") {
        if (parts.length > 1 && window.canAccessCourse && !window.canAccessCourse(parts[1])) { window.renderHomePage(); return; }
        if (parts.length > 1) {
            var mdkId = parts[1];
            if (mdkId === "07.01" && window.renderTraining_0701) window.renderTraining_0701(mdkId);
            else if (mdkId === "04.01" && window.renderTraining_0401) window.renderTraining_0401(mdkId);
            else if (mdkId === "02.01" && window.renderTraining_0201) window.renderTraining_0201(mdkId);
            else if (mdkId === "02.02" && window.renderTraining_0202) window.renderTraining_0202(mdkId);
            else window.renderTrainingListPage();
        } else { window.renderTrainingListPage(); }
        return; 
    }
    if (page === "grades") { window.renderStudentGradesPage(); return; }
    if (page === "journal") { window.renderTeacherJournalPage(); return; }
    if (page === "teacher-dashboard" && window.renderTeacherDashboard) { window.renderTeacherDashboard(); return; }
    if (page === "student-progress" && window.renderStudentProgressPage) { window.renderStudentProgressPage(parts[1] || ""); return; }
    if (page === "learning-path" && window.renderLearningPathPage) { window.renderLearningPathPage(); return; }
    if (page === "missions" && window.renderLearningMissionsPage) { window.renderLearningMissionsPage(); return; }
    if (page === "seasonal" && window.renderSeasonalEventsPage) { window.renderSeasonalEventsPage(); return; }
    if (page === "portfolio" && window.renderPortfolioPage) { window.renderPortfolioPage(); return; }
    if (page === "subject-tutor" && window.renderSubjectTutor) { window.renderSubjectTutor(); return; }
    if (page === "gcode-lab" && window.renderGCodeLabPortal) { window.renderGCodeLabPortal(); return; }
    if (page === "materials-lab" && window.renderMaterialsLab) { window.renderMaterialsLab(); return; }
    if (page === "machining-lab" && window.renderMachiningLab) { window.renderMachiningLab(); return; }
    if (page === "metrology-trainer" && window.renderMetrologyLabPlus) { window.renderMetrologyLabPlus(); return; }
    if (page === "certificate") { window.renderCertificatePage(); return; }
    if (page === "profile") { window.renderProfilePage(hash); return; }
    if (page === "achievements") { window.renderAchievementsPage(); return; }
    if (page === "shop" && window.renderShopPage) { window.renderShopPage(); return; }
    if (page === "games" && window.renderArcadePage) { window.renderArcadePage(); return; }
    if (page === "final" && window.renderFinalExamPage) { window.renderFinalExamPage(parts[1]); return; }
    if (page === "reports" && window.renderCourseReportsPage) { window.renderCourseReportsPage(); return; }
    if (page === "teacher-tasks" && window.renderTeacherTasksPage) { window.renderTeacherTasksPage(parts[1] ? decodeURIComponent(parts[1]) : ""); return; }
    if (page === "schedule" && window.renderSchedulePage) { window.renderSchedulePage(); return; }
    if (page === "rating" && window.renderRatingPage) { window.renderRatingPage(); return; }
    if (page === "teams" && window.renderTeamLeaguePage) { window.renderTeamLeaguePage(); return; }
    if (page === "museum" && window.renderLearningMuseumPage) { window.renderLearningMuseumPage(); return; }
    if (page === "museum-curator" && window.renderMuseumCuratorPage) { window.renderMuseumCuratorPage(); return; }
    if (page === "admin" && window.renderAdminPanel) { window.renderAdminPanel(); return; }
    if (page === "access" && window.renderAccessPage) { window.renderAccessPage(); return; }
    window.renderHomePage();
};

function setupDrawer() {
    var burgerBtn = document.getElementById('burgerBtn'), drawer = document.getElementById('drawer'), drawerOverlay = document.getElementById('drawerOverlay'), drawerClose = document.getElementById('drawerClose');
    if (burgerBtn && drawer && drawerOverlay) {
        burgerBtn.onclick = function() { drawer.classList.add('open'); drawerOverlay.classList.add('open'); };
        drawerOverlay.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        if (drawerClose) drawerClose.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); };
        document.querySelectorAll('.drawer-item').forEach(item => { item.onclick = function() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }; });
    }
}

window.addEventListener("hashchange", function () { window.router(); });
window.addEventListener("DOMContentLoaded", function() {
    setupLogin(); 
    setupDrawer(); 
    window.setupNotificationCenter();
    window.renderUserChip();
    window.updateMenuVisibility();
    window.loadGlobalCustomContent(() => { window.router(); });
});
