/* ============================================================
   МДК 04.01 — extra.js (v2.0)
   ============================================================ */
"use strict";

window.renderProfilePage = function() {
  const app = document.getElementById("app"); app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Личный кабинет";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
  
  if (!state.student && !state.staff) return;
  var isStaff = !!state.staff;
  var name = isStaff ? state.staff.name : (state.nick || state.student.name);
  var group = isStaff ? "Сотрудник" : "Группа " + state.student.group;
  var role = isStaff ? "👨‍🏫" : ((state.shop.includes("golden") || state.staff) ? "👑" : "👨‍🎓");
  var sign = state.sign ? `<p style="color:var(--accent); font-style:italic; margin-top:10px;">"${state.sign}"</p>` : "";

  app.appendChild(el(`<div class="module" style="display:flex;gap:20px;align-items:center;padding:30px;">
    <div style="font-size:60px;background:var(--card-soft);width:100px;height:100px;display:flex;align-items:center;justify-content:center;border-radius:20px;">${role}</div>
    <div><h2 style="margin:0">${name}</h2><p style="color:var(--muted);margin:5px 0 0;">${group}</p>${sign}</div>
  </div>`));
  
  if (!isStaff) {
    app.appendChild(el(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <a href="#/dashboard" class="btn" style="text-align:center;padding:15px;">📊 Статистика и Достижения</a>
      <a href="#/portfolio" class="btn ghost" style="text-align:center;padding:15px;">🎓 Портфолио</a>
    </div>`));
  } else {
      app.appendChild(el(`<div class="module" style="background:var(--accent-soft); border-color:var(--accent);">
          <h3 style="margin-top:0; color:var(--accent);">Панель преподавателя</h3>
          <p>Вам доступны все премиум-функции (темы, ники, аватары) без затрат XP.</p>
      </div>`));
  }
};

window.renderDashboard = function(){
  var app = document.getElementById("app"); app.innerHTML = ""; document.getElementById("crumbs").textContent = "Статистика";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
  
  var isTeacher = state.staff && (state.staff.role === "teacher" || state.staff.role === "admin");
  if (isTeacher) {
    app.appendChild(el('<section class="module"><h2>📊 Панель преподавателя</h2><p>Данные доступны во вкладке "Журнал" и "Заявки".</p></section>'));
    return;
  }

  var jokes = [
      "Станок не прощает ошибок. Как и преподаватель.",
      "Если сомневаешься — измерь вибрацию. Но лучше не надо.",
      "Стружка в кармане — это не баг, это фича.",
      "Не работает? Проверь, включен ли станок в розетку."
  ];
  var randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  app.appendChild(el(`<div style="text-align:center; color:var(--muted); font-style:italic; margin-bottom:20px;">"${randomJoke}"</div>`));

  app.appendChild(el(`<section class="module" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
    <div>
        <h2 style="margin:0 0 10px 0;">📈 Мой прогресс</h2>
        <div style="font-size:18px; color:var(--text-soft);">🔥 Серия входов: <b style="color:var(--accent); font-size:22px;">${state.loginStreak || 0}</b> дн.</div>
        <div style="font-size:18px; color:var(--text-soft); margin-top:5px;">🌟 Всего XP: <b style="color:var(--accent); font-size:22px;">${state.xp}</b></div>
    </div>
    <div style="max-width:200px; width:100%;"><canvas id="studentChart"></canvas></div>
  </section>`));
  
  setTimeout(() => {
    new Chart(document.getElementById('studentChart').getContext('2d'), { type: 'doughnut', data: { labels: ['Пройдено', 'Осталось'], datasets: [{ data: [state.xp/10, 100 - (state.xp/10)], backgroundColor: ['#2d7a4f', '#e8e2d8'] }] }, options: { cutout: '70%' } });
  }, 100);

  var achList = [
    { id: "t1", icon: "🥉", title: "Новичок", desc: "Первый вход", check: () => state.xp >= 10 },
    { id: "t2", icon: "🎓", title: "Студент", desc: "Накопить 50 XP", check: () => state.xp >= 50 },
    { id: "t3", icon: "📚", title: "Книжный червь", desc: "Накопить 100 XP", check: () => state.xp >= 100 },
    { id: "t4", icon: "🧠", title: "Умник", desc: "Накопить 500 XP", check: () => state.xp >= 500 },
    { id: "t5", icon: "🏆", title: "Знаток", desc: "Накопить 1000 XP", check: () => state.xp >= 1000 },
    { id: "t6", icon: "🔥", title: "В ударе", desc: "Серия входов 3 дня", check: () => state.loginStreak >= 3 }
  ];

  app.appendChild(el(`<section class="module"><h2>🏆 Мои достижения (${achList.length})</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;" id="achGrid"></div></section>`));
  var grid = document.getElementById("achGrid");
  
  achList.forEach(a => {
    var isUnlocked = (state.achievements && state.achievements[a.id]) || a.check();
    if (isUnlocked && (!state.achievements || !state.achievements[a.id])) {
        if (!state.achievements) state.achievements = {};
        state.achievements[a.id] = true;
    }
    grid.appendChild(el(`<div style="background:var(--card-soft);border:1px solid ${isUnlocked ? 'var(--gold)' : 'var(--border)'};padding:16px;border-radius:12px;text-align:center;opacity:${isUnlocked ? '1' : '0.4'};"><div style="font-size:32px;margin-bottom:8px;">${isUnlocked ? a.icon : '🔒'}</div><div style="font-weight:bold;font-size:13px;">${a.title}</div><div style="font-size:11px;color:var(--muted);margin-top:4px;">${a.desc}</div></div>`));
  });
};

window.renderChatPage = function(){
  const app = document.getElementById("app"); app.innerHTML = ""; document.getElementById("crumbs").textContent = "Чат группы";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
  app.appendChild(el(`<section class="module"><h2>Чат группы ${state.student ? state.student.group : ""}</h2><div id="chatLog" style="height:400px;overflow-y:auto;background:var(--card-soft);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;"><div class="comment-empty">Загрузка сообщений...</div></div><form id="chatForm" style="display:flex;gap:10px;"><input type="text" id="chatInput" placeholder="Сообщение..." style="flex:1;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text)"><button type="submit" class="btn">Отправить</button></form></section>`));
  
  function loadChat() {
    var group = state.student ? state.student.group : "ALL";
    fetch(APPS_SCRIPT_URL + "?action=chatload&group=" + encodeURIComponent(group)).then(r=>r.json()).then(d=>{
      var log = document.getElementById("chatLog"); if(!log) return;
      log.innerHTML = "";
      if(d.ok && d.messages.length) {
        d.messages.forEach(m => {
          log.innerHTML += `<div style="margin-bottom:12px;background:var(--card);padding:8px 12px;border-radius:8px;border:1px solid var(--border);"><b style="color:var(--accent)">${m.name}</b> <span style="font-size:10px;color:var(--muted)">${new Date(m.date).toLocaleTimeString()}</span><br>${m.text}</div>`;
        });
        log.scrollTop = log.scrollHeight;
      } else {
        log.innerHTML = '<div class="comment-empty">Пока нет сообщений.</div>';
      }
    }).catch(()=>{ document.getElementById("chatLog").innerHTML = "Ошибка загрузки."; });
  }
  loadChat();

  document.getElementById("chatForm").onsubmit = (e)=>{
    e.preventDefault(); const t = document.getElementById("chatInput").value; if(!t) return;
    document.getElementById("chatInput").value = "";
    var p = new URLSearchParams();
    p.append("action", "chatsave"); p.append("group", state.student ? state.student.group : "ALL");
    p.append("key", studentKey()); p.append("name", state.student.name); p.append("avatar", "👨‍🎓"); p.append("text", t);
    fetch(APPS_SCRIPT_URL, { method: "POST", body: p }).then(()=>loadChat());
  };
};

window.renderCommentsPage = function(){
  const app = document.getElementById("app"); app.innerHTML = ""; document.getElementById("crumbs").textContent = "Отзывы";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
  app.appendChild(el(`<section class="module"><h2>Отзывы о курсе</h2><div id="commentsList" style="margin-bottom:20px;"><div class="comment-empty">Загрузка...</div></div><form id="commentForm"><textarea id="commentText" placeholder="Напишите ваш отзыв..." style="width:100%;height:80px;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);margin-bottom:10px;"></textarea><button type="submit" class="btn">Отправить</button></form></section>`));

  function loadComments() {
    fetch(APPS_SCRIPT_URL + "?action=loadcomments").then(r=>r.json()).then(d=>{
      var list = document.getElementById("commentsList"); list.innerHTML = "";
      if(d.ok && d.comments.length) {
        d.comments.reverse().forEach(c => {
          list.innerHTML += `<div style="margin-bottom:12px;padding:16px;background:var(--card-soft);border-radius:12px;border:1px solid var(--border);"><b>${c.name}</b> <span style="font-size:12px;color:var(--muted)">${c.group}</span><p style="margin:8px 0 0;">${c.text}</p></div>`;
        });
      } else {
        list.innerHTML = '<div class="comment-empty">Пока нет отзывов.</div>';
      }
    }).catch(()=>{ document.getElementById("commentsList").innerHTML = "Ошибка загрузки."; });
  }
  loadComments();

  document.getElementById("commentForm").onsubmit = (e)=>{
    e.preventDefault(); const t = document.getElementById("commentText").value; if(t.length < 5) return alert("Слишком короткий отзыв");
    document.getElementById("commentText").value = "";
    var p = new URLSearchParams();
    p.append("action", "savecomment"); p.append("name", state.student ? state.student.name : "Гость");
    p.append("group", state.student ? state.student.group : "—"); p.append("text", t);
    fetch(APPS_SCRIPT_URL, { method: "POST", body: p }).then(()=>loadComments());
  };
};

window.renderRequestsPage = function() {
    var app = document.getElementById("app"); app.innerHTML = ""; document.getElementById("crumbs").textContent = "Заявки";
    app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
    
    if (!state.staff) { app.appendChild(el('<div class="module">Доступно только преподавателям.</div>')); return; }
    
    app.appendChild(el('<section class="hero"><h1>Входящие заявки</h1><p>Проверка практических работ и выдача попыток.</p></section>'));
    var container = el('<section class="module"><div class="skeleton" style="height:100px;"></div></section>');
    app.appendChild(container);

    fetch(APPS_SCRIPT_URL + "?action=getstudents").then(r => r.json()).then(d => {
        container.innerHTML = "";
        if (!d.ok || !d.students.length) { container.innerHTML = "Студентов пока нет."; return; }
        
        var hasRequests = false;

        d.students.forEach(s => {
            try {
                var p = JSON.parse(s.payload || "{}");
                var sKey = (s.name + "|" + s.group).toLowerCase();
                
                if (p.practicalsDone) {
                    Object.keys(p.practicalsDone).forEach(topicId => {
                        Object.keys(p.practicalsDone[topicId]).forEach(code => {
                            if (p.practicalsDone[topicId][code] === "pending") {
                                hasRequests = true;
                                var topic = findTopic(topicId);
                                var tName = topic ? topic.topic.title : topicId;
                                
                                var reqCard = el(`<div class="module" style="border-left:4px solid var(--accent); padding:16px; margin-bottom:12px;" id="req_${topicId}_${code}">
                                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                                        <div>
                                            <b>${s.name}</b> (гр. ${s.group})<br>
                                            <span style="color:var(--muted); font-size:13px;">Сдал практическую: ${tName} (${code})</span>
                                        </div>
                                        <div style="display:flex; gap:10px; align-items:center;">
                                            <select id="grade_${topicId}_${code}" style="padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--bg); color:var(--text);">
                                                <option value="5">Оценка 5</option>
                                                <option value="4">Оценка 4</option>
                                                <option value="3">Оценка 3</option>
                                                <option value="2">Оценка 2</option>
                                            </select>
                                            <button class="btn" onclick="window.approvePractical('${sKey}', '${topicId}', '${code}', document.getElementById('grade_${topicId}_${code}').value)">Подтвердить</button>
                                        </div>
                                    </div>
                                </div>`);
                                container.appendChild(reqCard);
                            }
                        });
                    });
                }
            } catch(e) {}
        });

        if (!hasRequests) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--muted);"><h3>Заявок пока нет 🎉</h3><p>Все проверено!</p></div>';
        }
    }).catch(() => { container.innerHTML = "Ошибка загрузки."; });
};

window.renderNotificationsPage = function() {
    var app = document.getElementById("app"); app.innerHTML = ""; document.getElementById("crumbs").textContent = "Уведомления";
    app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
    app.appendChild(el('<section class="hero"><h1>Центр уведомлений</h1></section>'));

    if (state.notifications) {
        state.notifications.forEach(n => n.read = true);
        if (window.saveStudentData) saveStudentData();
        if (window.updateNotifBadge) updateNotifBadge();
    }

    var block = el('<section class="module"><div id="notifList" style="display:flex; flex-direction:column; gap:12px;"></div></section>');
    app.appendChild(block);
    var list = block.querySelector("#notifList");

    if (!state.notifications || state.notifications.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:40px; color:var(--muted);"><h3>Уведомлений пока нет</h3><p>Здесь будут появляться сообщения об оценках, изменениях в расписании и начислениях XP.</p></div>';
        return;
    }

    state.notifications.forEach(n => {
        var icon = "ℹ️";
        if (n.type === "ok") icon = "✅";
        if (n.type === "err") icon = "❌";
        if (n.text.includes("XP")) icon = "🌟";
        if (n.text.includes("оценка") || n.text.includes("Оценка")) icon = "📝";

        var dateObj = new Date(n.date);
        var dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();

        list.appendChild(el(`<div style="display:flex; gap:16px; background:var(--card-soft); border:1px solid var(--border); padding:16px; border-radius:12px; align-items:flex-start;">
            <div style="font-size:24px;">${icon}</div>
            <div style="flex:1;">
                <div style="font-size:15px; color:var(--text); margin-bottom:4px;">${n.text}</div>
                <div style="font-size:12px; color:var(--muted);">${dateStr}</div>
            </div>
        </div>`));
    });
};