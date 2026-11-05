"use strict";
(function () {
  const DEFAULT_GAMES = { student: true, teacher: false, admin: true };
  const $ = id => document.getElementById(id);
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const currentUser = () => window.state && (window.state.staff || window.state.student) || null;
  const currentRole = () => String((currentUser() || {}).role || "student").toLowerCase();

  window.portalSettings = window.portalSettings || { gamesByRole: Object.assign({}, DEFAULT_GAMES) };
  window.canRoleAccessGames = function () {
    const settings = window.portalSettings && window.portalSettings.gamesByRole || DEFAULT_GAMES;
    return settings[currentRole()] === true;
  };

  function applyMenu() {
    const nav = document.querySelector(".drawer-nav");
    if (!nav) return;
    let games = nav.querySelector('a[href="#/games"]');
    if (!games) {
      games = document.createElement("a");
      games.href = "#/games";
      games.className = "drawer-item";
      games.textContent = "🎮 Игры";
      const training = nav.querySelector('a[href="#/training"]');
      if (training) training.insertAdjacentElement("beforebegin", games); else nav.appendChild(games);
    }
    games.style.display = window.canRoleAccessGames() ? "flex" : "none";
    let account = nav.querySelector('a[href="#/account"]');
    if (!account) {
      account = document.createElement("a");
      account.href = "#/account";
      account.className = "drawer-item";
      account.textContent = "🔑 Логин и пароль";
      const profile = nav.querySelector('a[href="#/profile"]');
      if (profile) profile.insertAdjacentElement("afterend", account); else nav.appendChild(account);
    }
  }

  window.refreshPortalSettings = function () {
    if (!window.API || !window.API.getPortalSettings) return Promise.resolve(null);
    return window.API.getPortalSettings().then(r => {
      if (r && r.success) {
        window.portalSettings = { gamesByRole: Object.assign({}, DEFAULT_GAMES, r.gamesByRole || {}) };
        applyMenu();
      }
      return r;
    }).catch(err => { console.warn("Настройки портала не загружены", err); return null; });
  };

  if (window.API && window.API.login) {
    const originalLogin = window.API.login;
    window.API.login = function () {
      return originalLogin.apply(this, arguments).then(res => {
        if (res && res.success) window.refreshPortalSettings();
        return res;
      });
    };
  }

  function renderAccountPage() {
    const app = $("app");
    if (!app) return;
    const user = currentUser();
    if (!user) { app.innerHTML = '<div class="module">Сначала войдите в портал.</div>'; return; }
    app.innerHTML =
      '<a href="#/" class="backlink">← На главную</a>' +
      '<section class="hero"><h1>🔐 Безопасность учётной записи</h1><p>Логин и пароль можно менять не чаще одного раза в 30 дней каждый.</p></section>' +
      '<div class="module"><p><b>Текущий логин:</b> ' + esc(user.email) + '</p>' +
      '<form id="credentialForm"><label>Текущий пароль</label><input id="credentialOld" class="self-input" type="password" autocomplete="current-password" required>' +
      '<label style="display:block;margin-top:12px">Новый логин (email), если требуется</label><input id="credentialEmail" class="self-input" type="email" placeholder="Оставьте пустым, если не меняете">' +
      '<label style="display:block;margin-top:12px">Новый пароль, если требуется</label><input id="credentialNew" class="self-input" type="password" minlength="8" autocomplete="new-password" placeholder="Не менее 8 символов">' +
      '<label style="display:block;margin-top:12px">Повторите новый пароль</label><input id="credentialConfirm" class="self-input" type="password" minlength="8" autocomplete="new-password">' +
      '<button class="btn" style="margin-top:16px" type="submit">Сохранить изменения</button><p id="credentialStatus" aria-live="polite"></p></form></div>' +
      '<div class="module"><h3>Забыли пароль?</h3><p>Отправьте запрос администратору. После проверки он выдаст временный пароль.</p><a class="btn ghost" href="#/login-help">Создать запрос на восстановление</a></div>';
    $("credentialForm").onsubmit = function (e) {
      e.preventDefault();
      const oldPassword = $("credentialOld").value;
      const newEmail = $("credentialEmail").value.trim();
      const newPassword = $("credentialNew").value;
      const confirm = $("credentialConfirm").value;
      const status = $("credentialStatus");
      if (!newEmail && !newPassword) { status.textContent = "Введите новый логин или новый пароль."; return; }
      if (newPassword && newPassword !== confirm) { status.textContent = "Новые пароли не совпадают."; return; }
      status.textContent = "Сохранение…";
      window.API.changeCredentials({ oldPassword, newEmail: newEmail || user.email, newPassword }).then(r => {
        if (!r || !r.success) throw new Error(r && r.error || "Не удалось обновить учётную запись.");
        user.email = r.email || user.email;
        if (window.state.student) window.state.student.email = user.email;
        if (window.state.staff) window.state.staff.email = user.email;
        localStorage.setItem("mdk.state", JSON.stringify(window.state));
        status.textContent = "Изменения сохранены. Новый логин: " + user.email;
        $("credentialForm").reset();
        renderAccountPage();
        window.showToast("Данные учётной записи обновлены", "ok");
      }).catch(err => { status.textContent = err.message; });
    };
  }
  window.renderAccountPage = renderAccountPage;

  function renderLoginHelp() {
    const overlay = $("loginOverlay"); if (overlay) overlay.style.display = "none";
    const app = $("app");
    if (!app) return;
    app.innerHTML = '<a href="#/" class="backlink">← На главную</a><section class="hero"><h1>Восстановление доступа</h1><p>Запрос поступит администратору портала.</p></section>' +
      '<div class="module"><form id="resetRequestForm"><label>Email учётной записи</label><input id="resetRequestEmail" class="self-input" type="email" required placeholder="name@example.com">' +
      '<label style="display:block;margin-top:12px">Комментарий (необязательно)</label><textarea id="resetRequestNote" class="self-input" rows="3" maxlength="500" placeholder="Например, забыл пароль"></textarea>' +
      '<button class="btn" style="margin-top:14px">Отправить запрос</button><p id="resetRequestStatus" aria-live="polite"></p></form></div>';
    $("resetRequestForm").onsubmit = function (e) {
      e.preventDefault();
      const status = $("resetRequestStatus");
      status.textContent = "Отправка…";
      window.API.requestPasswordReset($("resetRequestEmail").value.trim(), $("resetRequestNote").value.trim()).then(r => {
        if (!r || !r.success) throw new Error(r && r.error || "Не удалось отправить запрос.");
        status.textContent = r.message || "Запрос отправлен администратору.";
        $("resetRequestForm").reset();
      }).catch(err => status.textContent = err.message);
    };
  }

  function appendAdminControls() {
    const app = $("app");
    if (!app || currentRole() !== "admin" || $("accountAdminTools")) return;
    const block = document.createElement("section");
    block.className = "module";
    block.id = "accountAdminTools";
    block.innerHTML = '<h3>🎮 Доступ к играм по ролям</h3><p style="color:var(--muted)">Включайте или скрывайте вкладку игр отдельно для студентов, преподавателей и администраторов.</p>' +
      '<div id="gameRoleChecks" style="display:grid;gap:8px"></div><button class="btn" id="saveGameRoleChecks" style="margin-top:12px">Сохранить настройки игр</button><span id="gameRoleStatus" style="margin-left:10px"></span>' +
      '<hr style="border-color:var(--border);margin:22px 0"><h3>🔑 Запросы на восстановление пароля</h3><div id="passwordRequestsBox">Загрузка запросов…</div>';
    app.appendChild(block);
    const box = $("gameRoleChecks");
    const labels = { student: "Студенты", teacher: "Преподаватели", admin: "Администраторы" };
    const settings = window.portalSettings.gamesByRole || DEFAULT_GAMES;
    box.innerHTML = Object.keys(labels).map(role => '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-role="' + role + '" ' + (settings[role] ? "checked" : "") + '> Показывать игры: ' + labels[role] + '</label>').join("");
    window.refreshPortalSettings().then(() => { box.querySelectorAll("input[data-role]").forEach(input => input.checked = !!(window.portalSettings.gamesByRole || DEFAULT_GAMES)[input.dataset.role]); });
    $("saveGameRoleChecks").onclick = function () {
      const gamesByRole = {};
      box.querySelectorAll("input[data-role]").forEach(input => gamesByRole[input.dataset.role] = input.checked);
      $("gameRoleStatus").textContent = "Сохранение…";
      window.API.setGamesAccess(gamesByRole).then(r => {
        if (!r || !r.success) throw new Error(r && r.error || "Ошибка сохранения");
        window.portalSettings.gamesByRole = r.gamesByRole;
        applyMenu();
        $("gameRoleStatus").textContent = "Настройки сохранены ✓";
      }).catch(err => $("gameRoleStatus").textContent = err.message);
    };
    loadPasswordRequests();
  }

  function loadPasswordRequests() {
    const box = $("passwordRequestsBox");
    if (!box) return;
    window.API.getPasswordRequests().then(r => {
      if (!r || !r.success) throw new Error(r && r.error || "Не удалось загрузить запросы.");
      const rows = r.requests || [];
      if (!rows.length) { box.innerHTML = '<p style="color:var(--muted)">Новых запросов нет.</p>'; return; }
      box.innerHTML = rows.map(x => '<div class="module" style="padding:12px;margin:8px 0"><b>' + esc(x.email) + '</b><div style="font-size:12px;color:var(--muted)">' + esc(x.requestedAt) + '</div><p>' + esc(x.note) + '</p><input class="self-input reset-temp-password" data-id="' + esc(x.id) + '" type="password" minlength="8" placeholder="Временный пароль (от 8 символов)"><button class="btn resolve-reset" data-id="' + esc(x.id) + '" style="margin-top:8px">Выдать временный пароль</button></div>').join("");
      box.querySelectorAll(".resolve-reset").forEach(btn => btn.onclick = function () {
        const input = box.querySelector('.reset-temp-password[data-id="' + btn.dataset.id + '"]');
        const password = input && input.value;
        if (!password || password.length < 8) { window.showToast("Введите временный пароль от 8 символов.", "err"); return; }
        btn.disabled = true; btn.textContent = "Обработка…";
        window.API.resolvePasswordReset(btn.dataset.id, password).then(res => {
          if (!res || !res.success) throw new Error(res && res.error || "Не удалось сбросить пароль.");
          window.showToast("Пароль сброшен. Передайте временный пароль пользователю безопасным способом.", "ok");
          loadPasswordRequests();
        }).catch(err => { window.showToast(err.message, "err"); btn.disabled = false; btn.textContent = "Выдать временный пароль"; });
      });
    }).catch(err => { box.textContent = "Ошибка загрузки запросов: " + err.message; });
  }

  if (window.renderAdminPanel) {
    const originalAdmin = window.renderAdminPanel;
    window.renderAdminPanel = function () {
      originalAdmin.apply(this, arguments);
      setTimeout(appendAdminControls, 0);
    };
  }

  if (window.router) {
    const originalRouter = window.router;
    window.router = function () {
      const page = ((location.hash || "").replace(/^#/, "").split("/").filter(Boolean)[0] || "");
      if (page === "account") { renderAccountPage(); applyMenu(); return; }
      if (page === "login-help") { renderLoginHelp(); return; }
      if (page === "links" && window.renderLinksPage) { window.renderLinksPage(); return; }
      if (page === "games" && !window.canRoleAccessGames()) {
        window.showToast("Вкладка игр отключена администратором для вашей роли.", "err");
        location.hash = "#/";
        return;
      }
      const result = originalRouter.apply(this, arguments); applyMenu(); return result;
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyMenu();
    if (currentUser()) window.refreshPortalSettings();
    const loginForm = $("unifiedLoginForm");
    if (loginForm && !$("forgotPasswordLink")) {
      const link = document.createElement("button");
      link.type = "button"; link.id = "forgotPasswordLink"; link.className = "btn ghost";
      link.style = "width:100%;margin-top:8px";
      link.textContent = "Забыли пароль? Запросить восстановление";
      link.onclick = function () { location.hash = "#/login-help"; };
      loginForm.insertAdjacentElement("afterend", link);
    }
  });
  setTimeout(function () { applyMenu(); if (currentUser()) window.refreshPortalSettings(); }, 800);
})();
