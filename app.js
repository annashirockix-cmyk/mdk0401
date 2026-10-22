"use strict";

// ================= БАЗОВЫЕ УТИЛИТЫ =================
window.$ = (id) => document.getElementById(id);
window.escapeHtml = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
window.el = (html) => { var div = document.createElement("div"); div.innerHTML = html.trim(); return div.firstChild; };
window.studentKey = (s) => { s = s || window.state.student; return s ? (s.name.trim().toLowerCase() + "|" + s.group.trim().toLowerCase()) : null; };

window.showToast = function(msg, type) {
  var container = document.querySelector(".toast-container");
  if (!container) { container = document.createElement("div"); container.className = "toast-container"; document.body.appendChild(container); }
  var toast = document.createElement("div");
  toast.className = "toast " + (type || "");
  toast.innerHTML = (type === "ok" ? "✅ " : type === "err" ? "❌ " : "ℹ️ ") + window.escapeHtml(msg);
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add("out"); setTimeout(() => toast.remove(), 300); }, 3000);
};

// ================= СОСТОЯНИЕ =================
window.state = {
  activeCourseId: "07.01",
  student: null, staff: null, xp: 0, results: {},
  purchasedThemes: [], unlockedAchievements: [], avatar: null, effect: null,
  nickname: null, signature: null, font: "default",
  purchasedFonts: [], purchasedSignatures: [],
  certBg: "1.jpg", suppBg: "1.jpg"
};

try {
  window.state.activeCourseId = localStorage.getItem("mdk.active") || "07.01";
  var _s = JSON.parse(localStorage.getItem("mdk.student") || "null"); if (_s && _s.name) window.state.student = _s;
  var _st = JSON.parse(localStorage.getItem("mdk.staff") || "null"); if (_st && _st.name) window.state.staff = _st;
  window.state.certBg = localStorage.getItem("mdk.certBg") || "1.jpg";
  window.state.suppBg = localStorage.getItem("mdk.suppBg") || "1.jpg";
  window.state.nickname = localStorage.getItem("mdk.nickname") || null;
  window.state.signature = localStorage.getItem("mdk.signature") || null;
  window.state.font = localStorage.getItem("mdk.font") || "default";
} catch (e) { console.warn("LocalStorage недоступен"); }

if (!window.MDK_DATA || !window.MDK_DATA[window.state.activeCourseId]) window.state.activeCourseId = "07.01";
window.COURSE = (window.MDK_DATA && window.MDK_DATA[window.state.activeCourseId]) || null;

// ================= XP И СОХРАНЕНИЕ =================
window.getLevel = (xp) => !xp || xp <= 0 ? 1 : Math.min(Math.floor(Math.sqrt(xp / 100)) + 1, 100);

window.updateXpDisplay = function() {
  var el = window.$("xpCount"); if (!el) return;
  if (window.state.staff) {
      el.textContent = "👨‍🏫 Преподаватель";
  } else {
      el.textContent = "🌟 " + window.state.xp + " XP · Lv." + window.getLevel(window.state.xp);
  }
};

window.addXP = function(amount) {
  if (window.state.staff) return;
  window.state.xp += amount;
  window.saveStudentData();
  window.showToast((amount > 0 ? "+" : "") + amount + " XP", amount > 0 ? "ok" : "err");
  if (window.checkAchievements) window.checkAchievements();
};

window.saveStudentData = function() {
  if (window.state.staff) return; // Преподавателю не сохраняем XP
  var k = window.studentKey(); if (!k) return;
  var ek = encodeURIComponent(k);
  
  var payload = {
      xp: window.state.xp, results: window.state.results,
      purchasedThemes: window.state.purchasedThemes || [],
      unlockedAchievements: window.state.unlockedAchievements || [],
      avatar: window.state.avatar || null, effect: window.state.effect || null,
      nickname: window.state.nickname || null,
      signature: window.state.signature || null,
      font: window.state.font || "default",
      purchasedFonts: window.state.purchasedFonts || []
  };

  try {
    localStorage.setItem("mdk.xp." + ek, window.state.xp);
    localStorage.setItem("mdk.results." + ek, JSON.stringify(window.state.results || {}));
    localStorage.setItem("mdk.shop." + ek, JSON.stringify(payload));
    localStorage.setItem("mdk.nickname", window.state.nickname || "");
    localStorage.setItem("mdk.signature", window.state.signature || "");
    localStorage.setItem("mdk.font", window.state.font || "default");
  } catch (e) {}
  
  window.updateXpDisplay();
  if (window.API && window.API.saveStudent) {
    window.API.saveStudent(k, window.state.student.name, window.state.student.group, JSON.stringify(payload)).catch(() => {});
  }
};

window.loadStudentData = function() {
  var k = window.studentKey(); if (!k) return;
  var ek = encodeURIComponent(k);
  try {
    window.state.xp = parseInt(localStorage.getItem("mdk.xp." + ek) || "0", 10);
    var r = localStorage.getItem("mdk.results." + ek);
    window.state.results = r ? JSON.parse(r) : {};
    var s = localStorage.getItem("mdk.shop." + ek);
    if(s) {
        var sh = JSON.parse(s);
        window.state.purchasedThemes = sh.purchasedThemes || [];
        window.state.unlockedAchievements = sh.unlockedAchievements || [];
        window.state.avatar = sh.avatar || null; window.state.effect = sh.effect || null;
        window.state.nickname = sh.nickname || null;
        window.state.signature = sh.signature || null;
        window.state.font = sh.font || "default";
        window.state.purchasedFonts = sh.purchasedFonts || [];
    }
  } catch (e) {}
  window.updateXpDisplay();
  window.renderUserChip();
};

// ================= АВТОРИЗАЦИЯ =================
window.doStudentLogin = function() {
  var n = $("loginName").value.trim(); var g = $("loginGroup").value.trim();
  if (!n || !g) { window.showToast("Введите ФИО и Группу!", "err"); return; }
  window.state.student = { name: n, group: g.toUpperCase() }; window.state.staff = null;
  try { localStorage.setItem("mdk.student", JSON.stringify(window.state.student)); localStorage.removeItem("mdk.staff"); } catch(e){}
  window.renderUserChip(); window.loadStudentData(); window.route();
};

window.doTeacherLogin = function() {
  var u = $("teacherUser").value.trim(); var p = $("teacherPass").value.trim();
  var errEl = $("teacherLoginError");
  if (!u || !p) { errEl.textContent = "Введите логин и пароль"; errEl.style.display = "block"; return; }
  
  if ((u === "admin" && p === "admin") || (u === "teacher" && p === "teacher")) {
      window.state.staff = { name: u === "admin" ? "Администратор" : "Анна Анатольевна", role: u === "admin" ? "admin" : "teacher" };
      window.state.student = null;
      window.state.xp = 999999;
      try { localStorage.setItem("mdk.staff", JSON.stringify(window.state.staff)); localStorage.removeItem("mdk.student"); } catch(e){}
      window.renderUserChip(); window.updateXpDisplay(); window.route();
  } else { errEl.textContent = "Неверный логин или пароль"; errEl.style.display = "block"; }
};

window.handleLogout = function() {
  if (!confirm("Выйти из системы?")) return;
  window.state.student = null; window.state.staff = null; window.state.xp = 0;
  try { localStorage.removeItem("mdk.student"); localStorage.removeItem("mdk.staff"); } catch(e){}
  if ($("loginName")) $("loginName").value = "";
  if ($("loginGroup")) $("loginGroup").value = "";
  window.closeDrawer(); window.route();
};

window.switchCourse = function(id) {
    window.state.activeCourseId = id; window.COURSE = window.MDK_DATA[id] || null; window.route();
};

window.closeDrawer = function() {
    if ($("drawer")) $("drawer").classList.remove("open");
    if ($("drawerOverlay")) $("drawerOverlay").classList.remove("open");
};

window.renderUserChip = function() {
  if (!$("userChipName")) return;
  if (window.state.staff) {
      $("userChipName").textContent = window.state.staff.name;
      $("userChipGroup").textContent = "Преподаватель";
      $("userChipAvatar").innerHTML = "👨‍🏫";
      return;
  }
  if (!window.state.student) return;
  $("userChipName").textContent = window.state.nickname || window.state.student.name;
  $("userChipGroup").textContent = "Гр. " + window.state.student.group;
  $("userChipAvatar").innerHTML = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : "👨‍🎓";
};

// ================= РОУТЕР =================
window.route = function() {
  window.closeDrawer();
  var overlay = $("loginOverlay");
  var fab = document.getElementById("asFab");
  var isLoggedIn = !!(window.state.student || window.state.staff);

  if (!isLoggedIn) {
      if (overlay) overlay.style.display = "block";
      if (fab) fab.style.display = "none";
      if ($("app")) $("app").innerHTML = "";
      return;
  }

  if (overlay) overlay.style.display = "none";
  if (fab) fab.style.display = "flex";

  var hash = location.hash.replace(/^#/, "") || "/";
  var parts = hash.split("/").filter(Boolean);
  var app = $("app"); if (!app) return;

  try {
    var page = parts[0] || "/";
    
    if (page === "topic") window.renderTopic(parts[1], parts[2]);
    else if (page === "certificate") window.renderCertificatePage();
    else if (page === "profile" && window.renderProfilePage) window.renderProfilePage();
    else if (page === "videos") window.renderSimplePage("Видеоуроки", window.GLOBAL_DATA?.videos, "🎬");
    else if (page === "passports") window.renderSimplePage("Паспорта станков", window.GLOBAL_DATA?.passports, "📄");
    else if (page === "safety") window.renderSimplePage("Охрана труда", window.GLOBAL_DATA?.safety, "🦺");
    else if (page === "formatting") window.renderSimplePage("Оформление работ", [{title: window.GLOBAL_DATA?.formatting?.title || "Требования", content: window.GLOBAL_DATA?.formatting?.content || ""}], "📝");
    else if (page === "links" && window.renderLinksPage) window.renderLinksPage();
    else if (page === "training") {
        if (window.state.activeCourseId === "02.01" && window.renderTraining_0201) window.renderTraining_0201(parts[1]);
        else if (window.state.activeCourseId === "02.02" && window.renderTraining_0202) window.renderTraining_0202(parts[1]);
        else if (window.state.activeCourseId === "04.01" && window.renderTraining_0401) window.renderTraining_0401(parts[1]);
        else if (window.state.activeCourseId === "07.01" && window.renderTraining_0701) window.renderTraining_0701(parts[1]);
    }
    else if (page === "final") {
        if (window.state.activeCourseId === "02.01" && window.renderFinal_0201) window.renderFinal_0201(parts[1]);
        else if (window.state.activeCourseId === "02.02" && window.renderFinal_0202) window.renderFinal_0202(parts[1]);
        else if (window.state.activeCourseId === "04.01" && window.renderFinal_0401) window.renderFinal_0401(parts[1]);
        else if (window.state.activeCourseId === "07.01" && window.renderFinal_0701) window.renderFinal_0701(parts[1]);
    }
    else if (page === "arcade" && window.renderArcadePage) window.renderArcadePage();
    else if (page === "shop" && window.renderShopPage) window.renderShopPage();
    else if (page === "rating" && window.renderRatingPage) window.renderRatingPage();
    else if (page === "journal" && window.renderJournalPage) window.renderJournalPage();
    else if (page === "reports" && window.renderCourseReportsPage) window.renderCourseReportsPage();
    else if (page === "schedule" && window.renderSchedulePage) window.renderSchedulePage();
    else if (page === "achievements") window.renderAchievementsPage();
    else renderHome();
  } catch (err) {
      app.innerHTML = '<div class="module" style="color:var(--err);">Ошибка: ' + window.escapeHtml(err.message) + '</div>';
  }
  window.scrollTo(0, 0);
};

// ================= УНИВЕРСАЛЬНЫЙ ГЕНЕРАТОР ТЕСТОВ =================
window.buildTestBlock = function(prefix, uniqueId, questions) {
    if (!questions || questions.length === 0) return "";
    var safeQuestions = encodeURIComponent(JSON.stringify(questions));
    var html = `<div style="margin-top:20px; padding-top:20px; border-top:1px dashed var(--border);"><p style="font-weight:bold; margin-bottom:15px; font-size:16px;">🎯 Проверочный тест:</p>`;
    
    questions.forEach((q, qi) => {
        html += `<div style="margin-bottom:15px; padding:15px; background:var(--bg); border-radius:8px; border: 1px solid var(--border);">
            <b>${qi + 1}. ${q.q}</b><div style="margin-top:10px;">`;
        q.options.forEach((opt, oi) => {
            html += `<label id="opt_${prefix}_${uniqueId}_${qi}_${oi}" style="display:flex; align-items:center; gap:8px; margin-bottom:6px; cursor:pointer; padding:6px; border-radius:6px; transition: background 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='var(--card-soft)'" onmouseout="if(!this.classList.contains('checked')) this.style.background='transparent'">
                <input type="radio" name="${prefix}_q_${uniqueId}_${qi}" value="${oi}" style="transform:scale(1.2);">
                <span style="font-size:15px;">${opt}</span>
            </label>`;
        });
        html += `</div></div>`;
    });
    html += `<button class="btn" id="btn_${prefix}_${uniqueId}" style="width:100%; padding:12px; font-size:16px; margin-top:10px;" onclick="window.gradeTest('${prefix}', '${uniqueId}', '${safeQuestions}')">Проверить результат</button>
    <div id="fb_${prefix}_${uniqueId}" style="margin-top:15px; font-weight:bold; font-size:18px; text-align:center;"></div></div>`;
    return html;
};

// ================= РЕНДЕР ТЕМЫ =================
window.renderTopic = function(topicId, activeTab) {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    var topic = null;
    var foundCourseId = null;
    
    if (window.COURSE && window.COURSE.sections) {
        window.COURSE.sections.forEach(s => s.topics.forEach(t => { if (t.id === topicId) topic = t; }));
    }
    if (!topic && window.MDK_DATA) {
        for (var cid in window.MDK_DATA) {
            if (window.MDK_DATA[cid].sections) {
                window.MDK_DATA[cid].sections.forEach(s => s.topics.forEach(t => { if (t.id === topicId) { topic = t; foundCourseId = cid; } }));
            }
        }
    }
    if (!topic) { app.innerHTML = '<div class="module">Тема не найдена.</div>'; return; }
    
    if (foundCourseId && window.state.activeCourseId !== foundCourseId) {
        window.state.activeCourseId = foundCourseId;
        window.COURSE = window.MDK_DATA[foundCourseId];
        var selector = document.getElementById("mdkSelector");
        if (selector) selector.value = foundCourseId;
    }

    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el(`<section class="hero"><span class="brand-badge">${topic.code}</span><h1>${topic.title}</h1></section>`));
    
    var tabs = [];
    if (topic.lectures && topic.lectures.length) tabs.push({ id: 'lectures', label: '📖 Лекции' });
    if (topic.practicals && topic.practicals.length) tabs.push({ id: 'practicals', label: '🛠 Практика' });
    if (topic.selfWork && topic.selfWork.length) tabs.push({ id: 'selfWork', label: '✍️ Самостоятельная' });
    if ((topic.test && topic.test.length) || (topic.tests && topic.tests.length)) tabs.push({ id: 'test', label: '📝 Тест' });
    if (topic.presentations && topic.presentations.length) tabs.push({ id: 'presentations', label: '📊 Презентации' });

    if (!activeTab || activeTab === 'lecture') activeTab = 'lectures';
    if (activeTab === 'practical') activeTab = 'practicals';

    var tabHtml = '<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">';
    tabs.forEach(t => {
        tabHtml += `<button class="tab ${(t.id === activeTab) ? 'active' : ''}" onclick="window.renderTopic('${topicId}', '${t.id}')">${t.label}</button>`;
    });
    tabHtml += '</div>';
    app.appendChild(el(tabHtml));

    var contentBox = el('<div class="module"></div>');
    app.appendChild(contentBox);
    var baseQuestions = topic.test || topic.tests || [];

    if (activeTab === 'lectures' && topic.lectures) {
        var accordionHtml = "";
        topic.lectures.forEach((lec, i) => {
            accordionHtml += `<details class="lec-accordion" ${i === 0 ? "open" : ""}><summary><span class="lec-code">${lec.code}</span> ${lec.title}</summary><div class="lec-content">${lec.content}</div></details>`;
        });
        contentBox.innerHTML = accordionHtml;
        if(window.addXP) window.addXP(5);
    } 
    else if (activeTab === 'practicals' && topic.practicals) {
        topic.practicals.forEach((p, index) => {
            var uniqueId = `prac_${topicId}_${index}`;
            var isDone = window.state.results[uniqueId] ? "background: rgba(88, 201, 138, 0.1); border-color: var(--ok);" : "";
            var extraData = window.EXTRA_TESTS && window.EXTRA_TESTS[uniqueId];
            var expectedAnswer = p.expectedAnswer || (extraData && extraData.expectedAnswer);
            
            var html = `<div style="margin-bottom:20px; padding:20px; background:var(--card-soft); border-radius:12px; border:1px solid var(--border); ${isDone}">
                <h4 style="margin-top:0; color:var(--accent); font-size:18px;">${p.code} ${p.title}</h4>
                <p><b>Цель:</b> ${p.goal}</p><p><b>Задание:</b> ${p.task}</p>
                ${p.variants ? '<p><b>Варианты:</b></p><ul style="margin-bottom:15px;">' + p.variants.map(v => `<li>${v}</li>`).join('') + '</ul>' : ''}`;
                
            if (expectedAnswer) {
                html += `<div style="margin-top:15px; padding-top:15px; border-top:1px dashed var(--border);">
                    <label style="font-weight:bold; display:block; margin-bottom:8px;">Введите ваш ответ:</label>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <input type="text" id="ans_${uniqueId}" class="self-input" style="max-width:250px; margin:0; flex:1;" placeholder="Ваш ответ...">
                        <button class="btn" id="btn_${uniqueId}" onclick="window.checkPracticalAnswer('${uniqueId}', '${expectedAnswer}')">Проверить</button>
                    </div>
                    <div id="fb_${uniqueId}" style="margin-top:15px; font-weight:bold; font-size:16px;"></div>
                </div>`;
            } else if (extraData && extraData.questions) {
                html += window.buildTestBlock("prac", uniqueId, extraData.questions);
            } else if (baseQuestions.length > 0) {
                html += window.buildTestBlock("prac", uniqueId, baseQuestions);
            }
            html += `</div>`;
            contentBox.innerHTML += html;
        });
    }
    else if (activeTab === 'selfWork' && topic.selfWork) {
        topic.selfWork.forEach((sw, index) => {
            var uniqueId = `self_${topicId}_${index}`;
            var extraData = window.EXTRA_TESTS && window.EXTRA_TESTS[uniqueId];
            var isDone = window.state.results[uniqueId] ? "background: rgba(88, 201, 138, 0.1); border-color: var(--ok);" : "";
            var html = `<div style="margin-bottom:20px; padding:20px; background:var(--card-soft); border-radius:12px; border:1px solid var(--border); ${isDone}">
                <h4 style="margin-top:0; color:var(--accent); font-size:18px;">${sw.code || ''} ${sw.title}</h4>
                <p><b>Задание:</b> ${sw.task}</p>`;
            if (extraData && extraData.questions) {
                html += window.buildTestBlock("self", uniqueId, extraData.questions);
            } else if (baseQuestions.length > 0) {
                html += window.buildTestBlock("self", uniqueId, baseQuestions);
            }
            html += `</div>`;
            contentBox.innerHTML += html;
        });
    }
    else if (activeTab === 'test' && baseQuestions.length > 0) {
        contentBox.innerHTML = `<h3>📝 Контрольный тест по теме</h3>${window.buildTestBlock("inline", topicId, baseQuestions)}`;
    }
    else if (activeTab === 'presentations' && topic.presentations) {
        topic.presentations.forEach(p => {
            var isPdf = p.file.toLowerCase().endsWith('.pdf');
            contentBox.innerHTML += `<div style="margin-bottom:15px; padding:15px; background:var(--card-soft); border-radius:8px;">
                <h4 style="margin-top:0;">${p.code} ${p.title}</h4><p>${p.description}</p>
                ${isPdf ? `<div style="width: 100%; height: 500px; margin-top: 15px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border);"><iframe src="${p.file}" width="100%" height="100%" style="border: none;"></iframe></div>` : `<p style="color:var(--err); font-size:12px; margin-top:10px;">* Просмотр доступен только для PDF.</p>`}
                <a href="${p.file}" download class="btn ghost" style="margin-top:10px; font-size:12px; display:inline-block;">📥 Скачать файл</a>
            </div>`;
        });
    }
};

// ================= ПРОВЕРКА ЗАДАНИЙ =================
window.checkPracticalAnswer = function(id, expected) {
    var input = document.getElementById("ans_" + id);
    var fb = document.getElementById("fb_" + id);
    if (!input || !fb) return;
    
    var val = input.value.trim().replace(',', '.');
    var exp = String(expected).trim().replace(',', '.');
    
    if (val === exp) {
        fb.innerHTML = `<span style="color:var(--ok); font-size:20px;">✅ Верно! +10 XP</span>`;
        input.disabled = true;
        if (document.getElementById("btn_" + id)) document.getElementById("btn_" + id).style.display = "none";
        if (!window.state.results[id] && !window.state.staff) {
            window.state.results[id] = { grade: 5 };
            if (window.addXP) window.addXP(10);
            window.saveStudentData();
        }
    } else {
        fb.innerHTML = `<span style="color:var(--err); font-size:18px;">❌ Неверно. Попробуйте еще раз.</span>`;
        input.style.borderColor = "var(--err)";
        setTimeout(() => { input.style.borderColor = "var(--border)"; }, 1500);
    }
};

window.gradeTest = function(prefix, uniqueId, encodedQuestions) {
    var questions = JSON.parse(decodeURIComponent(encodedQuestions));
    var correct = 0;
    
    document.querySelectorAll(`[id^="opt_${prefix}_${uniqueId}_"]`).forEach(el => {
        el.style.background = "transparent"; el.style.borderColor = "transparent";
        el.innerHTML = el.innerHTML.replace(/<span style="color:.*?">.*?<\/span>/g, "");
        var radio = el.querySelector('input'); if(radio) radio.disabled = true;
    });

    questions.forEach((q, qi) => {
        var selected = document.querySelector(`input[name="${prefix}_q_${uniqueId}_${qi}"]:checked`);
        var selectedVal = selected ? Number(selected.value) : null;
        if (selectedVal === q.correct) correct++;

        for (var oi = 0; oi < q.options.length; oi++) {
            var optLabel = document.getElementById(`opt_${prefix}_${uniqueId}_${qi}_${oi}`);
            if (!optLabel) continue;
            if (oi === q.correct) {
                optLabel.style.background = "rgba(88, 201, 138, 0.15)"; optLabel.style.borderColor = "var(--ok)";
                optLabel.innerHTML += " <span style='color:var(--ok); font-weight:bold;'>✅</span>";
            } else if (oi === selectedVal) {
                optLabel.style.background = "rgba(255, 110, 94, 0.15)"; optLabel.style.borderColor = "var(--err)";
                optLabel.innerHTML += " <span style='color:var(--err); font-weight:bold;'>❌</span>";
            }
        }
    });
    
    var pct = Math.round((correct / questions.length) * 100);
    var grade = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : 2;
    var fb = document.getElementById("fb_" + prefix + "_" + uniqueId);
    var btn = document.getElementById("btn_" + prefix + "_" + uniqueId);
    
    if (grade >= 3) {
        fb.innerHTML = `<span style="color:var(--ok); font-size:24px;">Оценка: ${grade}</span><br>+15 XP`;
        if (btn) btn.style.display = "none";
        if (!window.state.results[uniqueId] && !window.state.staff) {
            window.state.results[uniqueId] = { grade: grade };
            if (window.addXP) window.addXP(15);
            window.saveStudentData();
        }
    } else {
        fb.innerHTML = `<span style="color:var(--err); font-size:24px;">Оценка: ${grade}</span><br><button class="btn ghost" style="margin-top:10px;" onclick="window.location.reload()">Повторить</button>`;
        if (btn) btn.style.display = "none";
    }
};

// ================= СЕРТИФИКАТ =================
window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    if (!window.state.student && !window.state.staff) return;

    var isTeacher = !!window.state.staff;
    var name = isTeacher ? window.state.staff.name : window.state.student.name;
    var courseName = window.COURSE ? window.COURSE.title : "МДК";

    // --- ГРАМОТА ПРЕПОДАВАТЕЛЯ ---
    if (isTeacher) {
        var teacherCert = `
            <div id="printable-cert" style="background:#fff; color:#000; padding:40px; border-radius:12px; max-width:800px; margin:0 auto; text-align:center; border: 10px double #c14a2a; position:relative; box-sizing:border-box;">
                <h1 style="font-size:40px; color:#c14a2a; text-transform:uppercase; margin-bottom:20px;">БЛАГОДАРНОСТЬ</h1>
                <p style="font-size:20px; margin:40px 0;">Настоящая грамота вручается</p>
                <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block; padding-bottom:10px; margin-bottom:20px;">${window.escapeHtml(name)}</h2>
                <p style="font-size:18px; margin-top:40px;">За активное участие в разработке и проведении учебного курса</p>
                <h3 style="font-size:24px; color:#000; margin:20px 0;">${window.escapeHtml(courseName)}</h3>
                <div style="display:flex; justify-content:space-between; margin-top:60px; font-size:16px;">
                    <div>Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
                    <div>Подпись: _______________</div>
                </div>
            </div>
        `;
        app.innerHTML = `<div class="no-print" style="text-align:center; margin-bottom:20px;"><button class="btn" onclick="window.print()">🖨 Распечатать грамоту</button></div>` + teacherCert;
        return;
    }

    // --- СЕРТИФИКАТ СТУДЕНТА ---
    var p = {}; try { p = JSON.parse(localStorage.getItem("mdk.results." + encodeURIComponent(window.studentKey()))) || {}; } catch(e) {}
    var isApproved = p.certificateApproved || false;
    var bgs = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];
    
    var certBgSelectorHtml = `<div class="no-print" style="margin-bottom:20px; text-align:center;"><h3 style="margin-bottom:10px;">Фон сертификата:</h3><div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">`;
    bgs.forEach(bg => {
        certBgSelectorHtml += `<img src="certificat/${bg}" style="width:60px; height:80px; object-fit:cover; cursor:pointer; border-radius:6px; border: 3px solid ${window.state.certBg === bg ? 'var(--accent)' : 'transparent'};" onclick="window.setCertBg('${bg}')">`;
    });
    certBgSelectorHtml += `</div></div>`;

    var suppBgSelectorHtml = `<div class="no-print" style="margin-bottom:20px; text-align:center;"><h3 style="margin-bottom:10px;">Фон вкладыша:</h3><div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">`;
    bgs.forEach(bg => {
        suppBgSelectorHtml += `<img src="certificat/${bg}" style="width:60px; height:80px; object-fit:cover; cursor:pointer; border-radius:6px; border: 3px solid ${window.state.suppBg === bg ? 'var(--accent)' : 'transparent'};" onclick="window.setSuppBg('${bg}')">`;
    });
    suppBgSelectorHtml += `</div><button class="btn" onclick="window.requestCertificate()" style="margin-top:20px; padding:12px 24px; font-size:16px; background:var(--gold); color:#000;">📜 Запросить / Распечатать</button></div>`;

    var certHtml = `
        <div id="printable-cert" style="background-image: url('certificat/${window.state.certBg}'); background-size: 100% 100%; background-color: #fff; color:#000; padding: 20px; border-radius: 12px; max-width:900px; margin:0 auto; position: relative; aspect-ratio: 1.414 / 1; display: flex; align-items: center; justify-content: center; -webkit-print-color-adjust: exact;">
            <div style="background: rgba(255, 255, 255, 0.85); width: 100%; height: 100%; padding: 30px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; border-radius: 8px;">
                <div>
                    <h1 style="font-size:32px; color:#c14a2a; text-transform:uppercase;">СЕРТИФИКАТ</h1>
                    <p style="font-size:16px;">подтверждает, что</p>
                    <h2 style="font-size:28px; margin:15px 0; color:#000; border-bottom: 2px solid #ccc; display: inline-block;">${window.escapeHtml(window.state.student.name)}</h2>
                    <p style="font-size:16px;">успешно прошел(ла) обучение по программе</p>
                    <h3 style="font-size:20px; margin:15px 0; color:#000;">${window.escapeHtml(courseName)}</h3>
                    <p style="font-size:14px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:14px; margin-top:20px;">
                    <div style="text-align:left;"><p>Дата выдачи:</p><p style="font-weight:bold;">${new Date().toLocaleDateString('ru-RU')}</p></div>
                    <div style="text-align:right;"><p>Подпись:</p><div style="border-bottom: 1px solid #000; width: 150px; height: 30px;"></div></div>
                </div>
            </div>
            ${!isApproved ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-30deg); font-size:80px; font-weight:bold; color:rgba(255,0,0,0.15); white-space:nowrap;">ОБРАЗЕЦ</div>` : ""}
        </div>
    `;
    
    app.innerHTML += certBgSelectorHtml + suppBgSelectorHtml + certHtml;
};

window.setCertBg = function(bgName) { window.state.certBg = bgName; try { localStorage.setItem("mdk.certBg", bgName); } catch(e){} window.renderCertificatePage(); };
window.setSuppBg = function(bgName) { window.state.suppBg = bgName; try { localStorage.setItem("mdk.suppBg", bgName); } catch(e){} window.renderCertificatePage(); };
window.requestCertificate = function() {
    var k = window.studentKey(); if (!k) return;
    var p = {}; try { p = JSON.parse(localStorage.getItem("mdk.results." + encodeURIComponent(k))) || {}; } catch(e) {}
    if (!p.certificateRequested) {
        p.certificateRequested = true;
        window.API.saveStudent(k, window.state.student.name, window.state.student.group, JSON.stringify(p)).then(() => {
            window.showToast("Запрос отправлен!", "ok");
            setTimeout(() => window.print(), 500);
        });
    } else { window.print(); }
};

// ================= ДОСТИЖЕНИЯ И ПРОСТЫЕ СТРАНИЦЫ =================
window.renderAchievementsPage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el('<section class="hero"><h1>🏆 Достижения</h1></section>'));
    var box = el('<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:16px;"></div>');
    
    var ACH_LIST = [
        { id: "welcome", title: "Первый шаг", icon: "🚪" },
        { id: "reader", title: "Книжный червь", icon: "📖" },
        { id: "hacker", title: "Хакер", icon: "💻" },
        { id: "gamer", title: "Геймер", icon: "🎮" },
        { id: "level_5", title: "Опытный", icon: "⭐" },
        { id: "rich", title: "Богач", icon: "💰" },
        { id: "perfect", title: "Отличник", icon: "🏅" },
        { id: "coder", title: "Кодер", icon: "⌨️" }
    ];
    
    var unlocked = window.state.unlockedAchievements || [];
    ACH_LIST.forEach(a => {
        var isUnlocked = unlocked.includes(a.id) || (a.id === "welcome" && window.state.student);
        var opacity = isUnlocked ? "1" : "0.4";
        var filter = isUnlocked ? "none" : "grayscale(100%)";
        box.appendChild(el(`<div class="module" style="text-align:center; padding:15px; opacity:${opacity};">
            <div style="font-size:30px; margin-bottom:10px; filter:${filter};">${a.icon}</div>
            <h3 style="margin:0; font-size:14px;">${a.title}</h3>
        </div>`));
    });
    app.appendChild(box);
};

window.renderSimplePage = function(title, items, icon) {
    var app = document.getElementById("app"); app.innerHTML = "";
    document.getElementById("crumbs").textContent = title;
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el(`<section class="hero"><h1>${icon} ${title}</h1></section>`));
    var list = el(`<div class="module"></div>`);
    
    if (!items || !items.length) {
        list.innerHTML = "<p>Материалы пока не добавлены.</p>";
    } else {
        items.forEach(item => {
            var isYouTube = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
            var isPdf = item.file && item.file.toLowerCase().endsWith('.pdf');
            var isVideo = item.file && (item.file.toLowerCase().endsWith('.mp4') || item.file.toLowerCase().endsWith('.webm'));
            var link = item.url || item.file;

            var mediaHtml = "";
            if (isYouTube) {
                var vidId = item.url.includes('v=') ? item.url.split('v=')[1].split('&')[0] : item.url.split('/').pop();
                mediaHtml = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; margin-top:10px;"><iframe src="https://www.youtube.com/embed/${vidId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`;
            } else if (isVideo) {
                mediaHtml = `<video controls src="${item.file}" style="width:100%; max-height:400px; border-radius:8px; margin-top:10px;"></video>`;
            } else if (isPdf) {
                mediaHtml = `<div style="width:100%; height:400px; border-radius:8px; margin-top:10px; border:1px solid var(--border);"><iframe src="${item.file}" width="100%" height="100%" style="border:none;"></iframe></div>`;
            }

            list.innerHTML += `<div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:8px; background:var(--card-soft);">
                <b style="color:var(--accent); font-size:16px;">${item.title || 'Без названия'}</b><br>
                <span style="font-size:14px; color:var(--muted);">${item.description || item.content || ''}</span>
                ${mediaHtml}
                ${link && !isYouTube && !isVideo && !isPdf ? `<br><a href="${link}" target="_blank" class="btn" style="margin-top:10px; padding:8px 16px;">📥 Открыть ссылку</a>` : ''}
            </div>`;
        });
    }
    app.appendChild(list);
};

// ================= ГЛАВНАЯ =================
function renderHome() {
  var app = $("app"); app.innerHTML = "";
  var c = window.COURSE;
  if (!c) { app.innerHTML = "<div class='module'>Ошибка загрузки курса.</div>"; return; }
  
  var html = '<section class="hero"><h1>' + window.escapeHtml(c.title) + '</h1><p>' + window.escapeHtml(c.module || "") + '</p></section>';
  html += '<div class="steps-title">Учебный план</div>';
  
  (c.sections || []).forEach(sec => {
    html += '<div style="font-weight:bold; margin:20px 0 10px; color:var(--accent); text-transform:uppercase; font-size:12px;">' + window.escapeHtml(sec.title) + '</div>';
    (sec.topics || []).forEach(t => {
      var badges = [];
      if (t.lectures) badges.push("📖");
      if (t.practicals) badges.push("🛠");
      if (t.test || t.tests) badges.push("📝");
      
      html += `<div class="topic" onclick="location.hash='#/topic/${t.id}/lecture'">
        <div style="flex:1;">
            <div style="font-size:12px; color:var(--muted);">${t.code}</div>
            <div style="font-weight:bold;">${t.title}</div>
            <div style="font-size:13px; margin-top:4px; color:var(--muted);">${badges.join(" ")}</div>
        </div>
      </div>`;
    });
  });
  app.innerHTML = html;
}

// ================= ИНИЦИАЛИЗАЦИЯ =================
window.addEventListener("DOMContentLoaded", function() {
  var savedTheme = "dark";
  try { savedTheme = localStorage.getItem("mdk.theme") || "dark"; } catch(e){}
  document.documentElement.setAttribute("data-theme", savedTheme);

  if ($("btnLoginStudent")) $("btnLoginStudent").onclick = window.doStudentLogin;
  if ($("btnLoginTeacher")) $("btnLoginTeacher").onclick = window.doTeacherLogin;
  
  if ($("themeToggle")) {
      $("themeToggle").onclick = () => { location.hash = "#/shop"; };
  }
  
  if ($("burgerBtn")) $("burgerBtn").onclick = () => { $("drawer").classList.toggle("open"); $("drawerOverlay").classList.toggle("open"); };
  if ($("drawerClose")) $("drawerClose").onclick = window.closeDrawer;
  if ($("drawerOverlay")) $("drawerOverlay").onclick = window.closeDrawer;
  
  if ($("mdkSelector")) {
      $("mdkSelector").value = window.state.activeCourseId;
      $("mdkSelector").onchange = (e) => window.switchCourse(e.target.value);
  }
  
  document.querySelectorAll("[data-go]").forEach(item => {
      item.onclick = (e) => {
          e.preventDefault();
          var target = item.getAttribute("data-go");
          if(location.hash === target) { window.route(); } else { location.hash = target; }
          window.closeDrawer();
      };
  });

  window.renderUserChip();
  if (window.state.student) window.loadStudentData();
  window.route();
});

window.addEventListener("hashchange", window.route);