/**
 * app.js — основной клиентский код Учебного портала
 */

const CONFIG = {
  STORAGE_SESSION: 'portal_session',
  STORAGE_TEST_PROGRESS: 'portal_test_progress',
  STORAGE_VERSION: '3.0',
  AUTOSAVE_INTERVAL_MS: 10000
};

let currentUser = null;
let currentTestId = null;
let currentTest = null;
let testAnswers = {};
let autosaveTimerId = null;
let testTimerId = null;
let isStrictMode = false;
let visibilityWarnings = 0;
let testStartTimestamp = null;

function normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }
function normalizeTextAnswer(text) { return String(text || '').trim().toLowerCase().replace(/\s+/g, ' '); }

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.hidden = true;
}

window.showToast = function (message, type = 'info') {
  const old = document.getElementById('portal-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'portal-toast';
  toast.className = `portal-toast portal-toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('portal-toast--visible'));
  setTimeout(() => {
    toast.classList.remove('portal-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// ====================== СЕССИЯ ======================
function saveSession(user) {
  const payload = { version: CONFIG.STORAGE_VERSION, savedAt: Date.now(), email: user.email, name: user.name, group: user.group || '', role: user.role || 'student' };
  localStorage.setItem(CONFIG.STORAGE_SESSION, JSON.stringify(payload));
  currentUser = payload;
}

function loadSession() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_SESSION);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== CONFIG.STORAGE_VERSION) {
      localStorage.removeItem(CONFIG.STORAGE_SESSION);
      return null;
    }
    return data;
  } catch { return null; }
}

function clearSession() {
  localStorage.removeItem(CONFIG.STORAGE_SESSION);
  currentUser = null;
}

// ====================== АВТОРИЗАЦИЯ ======================
async function doStudentLogin(email, password) {
  const user = await API.login(normalizeEmail(email), password);
  saveSession(user);
  applyUserSession(user);
  return user;
}

async function loadStudentData() {
  const session = loadSession();
  if (!session) return null;
  currentUser = session;
  try {
    const fresh = await API.getStudent(session.email);
    if (fresh && fresh.success !== false) {
      const updated = { email: fresh.email, name: fresh.name || session.name, group: fresh.group || session.group, role: fresh.role || session.role };
      saveSession(updated);
      return updated;
    }
  } catch (err) { console.warn('Не удалось обновить данные:', err.message); }
  return session;
}

function applyUserSession(user) {
  currentUser = user;
  const nameEl = document.getElementById('user-name');
  const welcomeEl = document.getElementById('welcome-text');

  if (nameEl) nameEl.textContent = user.name || user.email;
  if (welcomeEl) welcomeEl.textContent = `Вы вошли как ${user.role === 'student' ? 'студент' : 'преподаватель'}: ${user.name || user.email}`;

  document.querySelectorAll('[data-role="teacher"]').forEach((el) => {
    el.style.display = (user.role === 'teacher' || user.role === 'admin') ? '' : 'none';
  });

  showScreen('main-screen');
}

function logout() {
  stopAutosave(); stopTestTimer(); disableAntiCheat(); clearSession();
  currentTestId = null; currentTest = null; testAnswers = {}; testStartTimestamp = null; visibilityWarnings = 0;
  showScreen('auth-screen');
  document.getElementById('login-form')?.reset();
  hideError('auth-error');
}

// ... (Настройки профиля, инициализация и т.д. оставлены без изменений) ...

// ====================== НАСТРОЙКИ ПРОФИЛЯ ======================
window.openSettingsModal = function() {
  const oldModal = document.getElementById('settings-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.id = 'settings-modal';
  modal.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.8); z-index:99999; display:flex; justify-content:center; align-items:center; padding:20px;";
  
  modal.innerHTML = `
    <div style="background:var(--card); border-radius:12px; width:100%; max-width:500px; padding:25px; box-shadow:0 10px 30px rgba(0,0,0,0.5); max-height: 90vh; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="margin:0; font-size:20px;">⚙️ Настройки профиля</h2>
        <button class="btn ghost" onclick="document.getElementById('settings-modal').remove()">✕</button>
      </div>

      <!-- Смена Email -->
      <div style="margin-bottom:25px; padding-bottom:20px; border-bottom:1px solid var(--border);">
        <h3 style="margin-top:0; font-size:16px; color:var(--accent);">Смена Логина (Email)</h3>
        <div class="form-group">
          <label>Новый Email</label>
          <input type="email" id="new-email-input" class="self-input" placeholder="new@example.com">
        </div>
        <div class="form-group">
          <label>Пароль для подтверждения</label>
          <input type="password" id="email-confirm-pass" class="self-input">
        </div>
        <button class="btn" style="width:100%;" onclick="window.submitEmailChange()">Изменить Email</button>
      </div>

      <!-- Смена Пароля -->
      <div>
        <h3 style="margin-top:0; font-size:16px; color:var(--accent);">Смена Пароля</h3>
        <div class="form-group">
          <label>Текущий пароль</label>
          <input type="password" id="old-pass-input" class="self-input">
        </div>
        <div class="form-group">
          <label>Новый пароль</label>
          <input type="password" id="new-pass-input" class="self-input">
        </div>
        <button class="btn" style="width:100%;" onclick="window.submitPasswordChange()">Изменить Пароль</button>
      </div>
      
      <p id="settings-msg" style="text-align:center; font-weight:bold; margin-top:15px; display:none;"></p>
    </div>
  `;
  document.body.appendChild(modal);
};

window.submitEmailChange = async function() {
  const newEmail = document.getElementById('new-email-input').value.trim();
  const pass = document.getElementById('email-confirm-pass').value;
  const msg = document.getElementById('settings-msg');

  if (!newEmail || !pass) { msg.textContent = "Заполните все поля"; msg.style.color = "var(--err)"; msg.style.display = "block"; return; }
  
  try {
    msg.textContent = "Загрузка..."; msg.style.color = "var(--text)"; msg.style.display = "block";
    const res = await API.changeEmail(currentUser.email, newEmail, pass);
    if (res.success) {
      msg.textContent = "Email успешно изменен! Войдите заново.";
      msg.style.color = "var(--ok)";
      setTimeout(() => {
        document.getElementById('settings-modal').remove();
        logout();
      }, 2000);
    }
  } catch (err) {
    msg.textContent = err.message; msg.style.color = "var(--err)";
  }
};

window.submitPasswordChange = async function() {
  const oldPass = document.getElementById('old-pass-input').value;
  const newPass = document.getElementById('new-pass-input').value;
  const msg = document.getElementById('settings-msg');

  if (!oldPass || !newPass) { msg.textContent = "Заполните все поля"; msg.style.color = "var(--err)"; msg.style.display = "block"; return; }

  try {
    msg.textContent = "Загрузка..."; msg.style.color = "var(--text)"; msg.style.display = "block";
    const res = await API.changePassword(currentUser.email, oldPass, newPass);
    if (res.success) {
      msg.textContent = "Пароль успешно изменен!";
      msg.style.color = "var(--ok)";
      document.getElementById('old-pass-input').value = '';
      document.getElementById('new-pass-input').value = '';
    }
  } catch (err) {
    msg.textContent = err.message; msg.style.color = "var(--err)";
  }
};

// ====================== ИНИЦИАЛИЗАЦИЯ ======================
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('service-worker.js', { scope: './' }); } catch (e) { console.warn(e); }
  }
}

async function init() {
  registerServiceWorker();

  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault(); loginContainer.style.display = 'none'; registerContainer.style.display = 'block'; hideError('auth-error');
  });
  document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault(); registerContainer.style.display = 'none'; loginContainer.style.display = 'block'; hideError('auth-error');
  });

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); hideError('auth-error');
      const name = document.getElementById('reg-name').value.trim();
      const group = document.getElementById('reg-group').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value.trim();
      const btn = document.getElementById('register-btn');
      btn.disabled = true; btn.textContent = 'Создание...';
      try {
        const response = await API.register(email, password, name, group);
        if (response.success) {
          window.showToast("Аккаунт создан! Вход...", "ok");
          await doStudentLogin(email, password);
        } else showError('auth-error', response.error);
      } catch (err) { showError('auth-error', err.message); }
      finally { btn.disabled = false; btn.textContent = 'Создать аккаунт'; }
    });
  }

  const session = await loadStudentData();
  if (session) applyUserSession(session); else showScreen('auth-screen');

  const loginBtn = document.getElementById('login-btn');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); hideError('auth-error');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      loginBtn.disabled = true; loginBtn.textContent = 'Вход...';
      try { await doStudentLogin(email, password); }
      catch (err) { showError('auth-error', err.message); }
      finally { loginBtn.disabled = false; loginBtn.textContent = 'Войти'; }
    });
  }

  document.getElementById('logout-btn')?.addEventListener('click', logout);
  
  document.getElementById('open-reports-btn')?.addEventListener('click', () => {
    showScreen('reports-screen');
    // Если отчеты не инициализируются, выводим сообщение
    if (typeof Reports !== 'undefined' && Reports.init) {
        Reports.init();
    } else {
        document.getElementById('reports-content').innerHTML = '<div class="module" style="color:var(--err);">Ошибка: Модуль отчетов не загружен. Проверьте reports.js</div>';
    }
  });
  
  document.getElementById('back-to-main-from-reports')?.addEventListener('click', () => showScreen('main-screen'));

  window.addEventListener('beforeunload', () => {
    if (currentTestId && Object.keys(testAnswers).length > 0) saveTestProgress();
  });
}

document.addEventListener('DOMContentLoaded', init);