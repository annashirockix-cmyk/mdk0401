/**
 * app.js — основной клиентский код Учебного портала
 * Vanilla JS, ES6+
 */

// ====================== КОНФИГУРАЦИЯ ======================
const CONFIG = {
  STORAGE_SESSION: 'portal_session',
  STORAGE_TEST_PROGRESS: 'portal_test_progress',
  STORAGE_VERSION: '2.0',
  AUTOSAVE_INTERVAL_MS: 10000 // 10 секунд
};

// Глобальное состояние
let currentUser = null;
let currentTestId = null;
let testAnswers = {};          // { questionId: answer }
let autosaveTimerId = null;

// ====================== УТИЛИТЫ ======================

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

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

// ====================== СЕССИЯ ======================

function saveSession(user) {
  const payload = {
    version: CONFIG.STORAGE_VERSION,
    savedAt: Date.now(),
    email: user.email,
    name: user.name,
    group: user.group || '',
    role: user.role || 'student'
  };
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
  } catch {
    localStorage.removeItem(CONFIG.STORAGE_SESSION);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(CONFIG.STORAGE_SESSION);
  currentUser = null;
}

// ====================== ПРОГРЕСС ТЕСТА (localStorage) ======================

/**
 * Сохранение промежуточных ответов теста
 */
function saveTestProgress() {
  if (!currentUser || !currentTestId) return;

  const key = CONFIG.STORAGE_TEST_PROGRESS;
  let allProgress = {};

  try {
    const raw = localStorage.getItem(key);
    if (raw) allProgress = JSON.parse(raw);
  } catch {
    allProgress = {};
  }

  const userKey = normalizeEmail(currentUser.email);
  if (!allProgress[userKey]) {
    allProgress[userKey] = {};
  }

  allProgress[userKey][currentTestId] = {
    answers: { ...testAnswers },
    savedAt: Date.now()
  };

  localStorage.setItem(key, JSON.stringify(allProgress));
}

/**
 * Загрузка прогресса теста
 * @param {string} testId
 * @returns {object|null} { answers, savedAt }
 */
function loadTestProgress(testId) {
  if (!currentUser) return null;

  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_TEST_PROGRESS);
    if (!raw) return null;

    const allProgress = JSON.parse(raw);
    const userKey = normalizeEmail(currentUser.email);
    const userProgress = allProgress[userKey];

    if (!userProgress || !userProgress[testId]) return null;
    return userProgress[testId];
  } catch {
    return null;
  }
}

/**
 * Очистка прогресса конкретного теста (после успешной сдачи)
 */
function clearTestProgress(testId) {
  if (!currentUser) return;

  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_TEST_PROGRESS);
    if (!raw) return;

    const allProgress = JSON.parse(raw);
    const userKey = normalizeEmail(currentUser.email);

    if (allProgress[userKey] && allProgress[userKey][testId]) {
      delete allProgress[userKey][testId];
      localStorage.setItem(CONFIG.STORAGE_TEST_PROGRESS, JSON.stringify(allProgress));
    }
  } catch {
    // игнорируем
  }
}

/**
 * Запуск автосохранения каждые 10 секунд
 */
function startAutosave() {
  stopAutosave();
  autosaveTimerId = setInterval(() => {
    if (currentTestId && Object.keys(testAnswers).length > 0) {
      saveTestProgress();
      console.log('[Autosave] Прогресс теста сохранён');
    }
  }, CONFIG.AUTOSAVE_INTERVAL_MS);
}

/**
 * Остановка автосохранения
 */
function stopAutosave() {
  if (autosaveTimerId) {
    clearInterval(autosaveTimerId);
    autosaveTimerId = null;
  }
}

// ====================== АВТОРИЗАЦИЯ ======================

/**
 * Вход студента (Email + Пароль)
 */
async function doStudentLogin(email, password) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new Error('Заполните email и пароль');
  }

  // Вызов API
  const user = await API.login(normalizedEmail, password);

  // Сохраняем сессию
  saveSession(user);

  // Применяем к интерфейсу
  applyUserSession(user);

  return user;
}

/**
 * Загрузка данных студента (из сессии или с сервера)
 */
async function loadStudentData() {
  const session = loadSession();
  if (!session) return null;

  currentUser = session;

  // Можно дополнительно обновить данные с сервера
  try {
    const fresh = await API.getStudent(session.email);
    if (fresh && fresh.success !== false) {
      const updated = {
        email: fresh.email,
        name: fresh.name || session.name,
        group: fresh.group || session.group,
        role: fresh.role || session.role
      };
      saveSession(updated);
      return updated;
    }
  } catch (err) {
    console.warn('Не удалось обновить данные студента с сервера:', err.message);
  }

  return session;
}

/**
 * Сохранение данных студента (имя, группа и т.д.)
 * При совпадении email — обновляет существующую запись
 */
async function saveStudentData(studentData) {
  if (!studentData.email) {
    throw new Error('Email обязателен');
  }

  const result = await API.saveStudent({
    email: normalizeEmail(studentData.email),
    name: studentData.name || '',
    group: studentData.group || '',
    role: studentData.role || 'student',
    password: studentData.password // только если меняем пароль
  });

  // Обновляем локальную сессию
  if (currentUser && normalizeEmail(currentUser.email) === normalizeEmail(studentData.email)) {
    saveSession({
      ...currentUser,
      name: result.name || currentUser.name,
      group: result.group || currentUser.group,
      role: result.role || currentUser.role
    });
  }

  return result;
}

/**
 * Применение данных пользователя к UI
 */
function applyUserSession(user) {
  currentUser = user;

  const nameEl = document.getElementById('user-name');
  const welcomeEl = document.getElementById('welcome-text');

  if (nameEl) {
    nameEl.textContent = user.name || user.email;
  }
  if (welcomeEl) {
    const roleText = user.role === 'teacher' ? 'преподаватель' : 'студент';
    welcomeEl.textContent = `Вы вошли как ${roleText}: ${user.name || user.email}`;
  }

  // Скрываем элементы преподавателя от студентов
  document.querySelectorAll('[data-role="teacher"]').forEach((el) => {
    el.style.display = user.role === 'teacher' ? '' : 'none';
  });

  showScreen('main-screen');
}

/**
 * Выход
 */
function logout() {
  stopAutosave();
  clearSession();
  currentTestId = null;
  testAnswers = {};
  showScreen('auth-screen');
  document.getElementById('login-form')?.reset();
  hideError('auth-error');
}

// ====================== РАБОТА С ТЕСТОМ (пример) ======================

/**
 * Начало / продолжение теста
 * Восстанавливает промежуточные ответы из localStorage
 */
function startTest(testId) {
  currentTestId = testId;
  testAnswers = {};

  // Восстанавливаем прогресс
  const saved = loadTestProgress(testId);
  if (saved && saved.answers) {
    testAnswers = { ...saved.answers };
    console.log('[Test] Восстановлен прогресс:', Object.keys(testAnswers).length, 'ответов');
    // Здесь можно вызвать функцию отрисовки сохранённых ответов в UI
    // restoreAnswersToUI(testAnswers);
  }

  startAutosave();
}

/**
 * Сохранение ответа на вопрос (вызывается при выборе варианта)
 */
function saveAnswer(questionId, answer) {
  if (!currentTestId) return;
  testAnswers[questionId] = answer;
  // Можно сразу сохранять, или ждать автосохранения
  // saveTestProgress();
}

/**
 * Завершение теста (очищаем прогресс)
 */
function finishTest() {
  stopAutosave();
  if (currentTestId) {
    clearTestProgress(currentTestId);
  }
  currentTestId = null;
  testAnswers = {};
}

// ====================== ИНИЦИАЛИЗАЦИЯ ======================

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    console.log('[PWA] Service Worker зарегистрирован');
  } catch (err) {
    console.warn('[PWA] Ошибка SW:', err);
  }
}

async function init() {
  registerServiceWorker();

  // Пытаемся восстановить сессию
  const session = await loadStudentData();
  if (session) {
    applyUserSession(session);
  } else {
    showScreen('auth-screen');
  }

  // Форма входа
  const form = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError('auth-error');

      const email = document.getElementById('email')?.value || '';
      const password = document.getElementById('password')?.value || '';

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Вход...';
      }

      try {
        await doStudentLogin(email, password);
      } catch (err) {
        showError('auth-error', err.message || 'Ошибка входа');
      } finally {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Войти';
        }
      }
    });
  }

  // Кнопка выхода
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // При закрытии вкладки / обновлении — сохраняем прогресс
  window.addEventListener('beforeunload', () => {
    if (currentTestId && Object.keys(testAnswers).length > 0) {
      saveTestProgress();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);