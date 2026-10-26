/**
 * app.js — основной клиентский код Учебного портала
 * Vanilla JS, ES6+
 * Авторизация Email, сессия, тесты (text/single/multiple),
 * прогресс-бар, анти-чит, автосохранение, toast, PDF, уведомления
 */

// ====================== КОНФИГУРАЦИЯ ======================
const CONFIG = {
  STORAGE_SESSION: 'portal_session',
  STORAGE_TEST_PROGRESS: 'portal_test_progress',
  STORAGE_VERSION: '3.0',
  AUTOSAVE_INTERVAL_MS: 10000
};

// Глобальное состояние
let currentUser = null;
let currentTestId = null;
let currentTest = null;
let testAnswers = {};
let autosaveTimerId = null;
let testTimerId = null;
let isStrictMode = false;
let visibilityWarnings = 0;
let testStartTimestamp = null;

// ====================== УТИЛИТЫ ======================

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeTextAnswer(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
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

/**
 * Toast-уведомление
 */
window.showToast = function (message, type = 'info') {
  const old = document.getElementById('portal-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'portal-toast';
  toast.className = `portal-toast portal-toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('portal-toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('portal-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

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

// ====================== ПРОГРЕСС ТЕСТА ======================

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
  if (!allProgress[userKey]) allProgress[userKey] = {};

  allProgress[userKey][currentTestId] = {
    answers: { ...testAnswers },
    savedAt: Date.now()
  };

  localStorage.setItem(key, JSON.stringify(allProgress));
}

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
    // ignore
  }
}

function startAutosave() {
  stopAutosave();
  autosaveTimerId = setInterval(() => {
    if (currentTestId && Object.keys(testAnswers).length > 0) {
      saveTestProgress();
    }
  }, CONFIG.AUTOSAVE_INTERVAL_MS);
}

function stopAutosave() {
  if (autosaveTimerId) {
    clearInterval(autosaveTimerId);
    autosaveTimerId = null;
  }
}

// ====================== АВТОРИЗАЦИЯ ======================

async function doStudentLogin(email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw new Error('Заполните email и пароль');
  }

  const user = await API.login(normalizedEmail, password);
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
    console.warn('Не удалось обновить данные студента:', err.message);
  }

  return session;
}

async function saveStudentData(studentData) {
  if (!studentData.email) {
    throw new Error('Email обязателен');
  }

  const result = await API.saveStudent({
    email: normalizeEmail(studentData.email),
    name: studentData.name || '',
    group: studentData.group || '',
    role: studentData.role || 'student',
    password: studentData.password
  });

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

function applyUserSession(user) {
  currentUser = user;

  const nameEl = document.getElementById('user-name');
  const welcomeEl = document.getElementById('welcome-text');

  if (nameEl) nameEl.textContent = user.name || user.email;
  if (welcomeEl) {
    const roleText = user.role === 'teacher' ? 'преподаватель' : 'студент';
    welcomeEl.textContent = `Вы вошли как ${roleText}: ${user.name || user.email}`;
  }

  document.querySelectorAll('[data-role="teacher"]').forEach((el) => {
    el.style.display = user.role === 'teacher' ? '' : 'none';
  });

  showScreen('main-screen');
}

function logout() {
  stopAutosave();
  stopTestTimer();
  disableAntiCheat();
  clearSession();
  currentTestId = null;
  currentTest = null;
  testAnswers = {};
  testStartTimestamp = null;
  visibilityWarnings = 0;
  showScreen('auth-screen');
  document.getElementById('login-form')?.reset();
  hideError('auth-error');
}

// ====================== PDF ======================

window.openTextbook = function (filename) {
  if (!filename) {
    alert('Файл не указан');
    return;
  }

  const oldModal = document.getElementById('pdf-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.id = 'pdf-modal';
  modal.className = 'pdf-modal';
  modal.innerHTML = `
    <div class="pdf-modal-overlay"></div>
    <div class="pdf-modal-content">
      <div class="pdf-modal-header">
        <span class="pdf-modal-title">Учебник</span>
        <button type="button" class="pdf-modal-close" aria-label="Закрыть">&times;</button>
      </div>
      <div class="pdf-modal-body">
        <iframe src="${filename}" class="pdf-iframe" title="Просмотр учебника" allowfullscreen></iframe>
      </div>
      <div class="pdf-modal-footer">
        <a href="${filename}" download class="btn btn-primary pdf-download-btn">⬇️ Скачать PDF</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.remove();
    document.body.style.overflow = '';
  };

  modal.querySelector('.pdf-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.pdf-modal-overlay').addEventListener('click', closeModal);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  };
  document.addEventListener('keydown', onKeyDown);
};

// ====================== ПОСТРОЕНИЕ ТЕСТА ======================

function buildTestBlock(question, index, savedAnswer = null) {
  const block = document.createElement('div');
  block.className = 'test-question';
  block.dataset.qid = question.id || index;
  block.dataset.type = question.type || 'single';

  const qId = question.id || `q${index}`;

  const title = document.createElement('div');
  title.className = 'question-title';
  title.innerHTML = `<span class="q-num">${index + 1}.</span> ${question.q || question.text || ''}`;
  block.appendChild(title);

  if (question.type === 'text') {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-answer-input';
    input.placeholder = 'Введите ответ...';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.dataset.qid = qId;

    if (savedAnswer !== null && savedAnswer !== undefined) {
      input.value = savedAnswer;
    }

    input.addEventListener('input', () => {
      saveAnswer(qId, input.value);
      updateProgressBar();
    });

    block.appendChild(input);
    return block;
  }

  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'options-list';

  const isMultiple = question.type === 'multiple';
  const options = question.options || question.answers || [];

  options.forEach((opt, optIdx) => {
    const label = document.createElement('label');
    label.className = 'option-item';

    const input = document.createElement('input');
    input.type = isMultiple ? 'checkbox' : 'radio';
    input.name = isMultiple ? `q_${qId}_${optIdx}` : `q_${qId}`;
    input.value = typeof opt === 'object' ? (opt.value ?? optIdx) : opt;
    input.dataset.qid = qId;

    if (savedAnswer !== null && savedAnswer !== undefined) {
      if (isMultiple && Array.isArray(savedAnswer)) {
        if (savedAnswer.includes(input.value) || savedAnswer.includes(String(optIdx))) {
          input.checked = true;
        }
      } else if (!isMultiple) {
        if (String(savedAnswer) === String(input.value) || String(savedAnswer) === String(optIdx)) {
          input.checked = true;
        }
      }
    }

    input.addEventListener('change', () => {
      if (isMultiple) {
        const checked = Array.from(
          block.querySelectorAll(`input[data-qid="${qId}"]:checked`)
        ).map((el) => el.value);
        saveAnswer(qId, checked);
      } else {
        saveAnswer(qId, input.value);
      }
      updateProgressBar();
    });

    const span = document.createElement('span');
    span.textContent = typeof opt === 'object' ? (opt.text || opt.label || opt.value) : opt;

    label.appendChild(input);
    label.appendChild(span);
    optionsWrap.appendChild(label);
  });

  block.appendChild(optionsWrap);
  return block;
}

function updateProgressBar() {
  const bar = document.getElementById('test-progress-bar');
  const text = document.getElementById('test-progress-text');
  if (!bar || !currentTest) return;

  const total = (currentTest.questions || []).length;
  const answered = Object.keys(testAnswers).filter((k) => {
    const val = testAnswers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined && String(val).trim() !== '';
  }).length;

  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  bar.style.width = percent + '%';
  if (text) text.textContent = `${answered} из ${total}`;
}

// ====================== ПРОВЕРКА ТЕСТА ======================

function gradeTest(test, answers) {
  const questions = test.questions || [];
  let correctCount = 0;
  const details = [];

  questions.forEach((q, index) => {
    const qId = q.id || `q${index}`;
    const userAnswer = answers[qId];
    let isCorrect = false;

    if (q.type === 'text') {
      const normalizedUser = normalizeTextAnswer(userAnswer);
      const normalizedCorrect = normalizeTextAnswer(q.answer || q.correct || '');
      isCorrect = normalizedUser === normalizedCorrect && normalizedUser !== '';
    } else if (q.type === 'multiple') {
      const correctSet = new Set((q.correct || q.answer || []).map(String));
      const userSet = new Set((Array.isArray(userAnswer) ? userAnswer : []).map(String));
      isCorrect =
        correctSet.size === userSet.size &&
        [...correctSet].every((v) => userSet.has(v));
    } else {
      const correct = String(q.correct ?? q.answer ?? '');
      isCorrect = String(userAnswer) === correct;
    }

    if (isCorrect) correctCount++;

    details.push({
      id: qId,
      question: q.q || q.text,
      userAnswer,
      correctAnswer: q.answer ?? q.correct,
      isCorrect
    });
  });

  const maxScore = questions.length;
  const percent = maxScore > 0 ? Math.round((correctCount / maxScore) * 100) : 0;

  let grade = 2;
  if (percent >= 85) grade = 5;
  else if (percent >= 70) grade = 4;
  else if (percent >= 50) grade = 3;

  return { score: correctCount, maxScore, percent, grade, details };
}

// ====================== АНТИ-ЧИТ ======================

function enableAntiCheat() {
  isStrictMode = true;
  visibilityWarnings = 0;
  document.body.classList.add('anti-cheat-mode');
  document.addEventListener('contextmenu', preventDefaultHandler, true);
  document.addEventListener('copy', preventDefaultHandler, true);
  document.addEventListener('cut', preventDefaultHandler, true);
  document.addEventListener('selectstart', preventDefaultHandler, true);
  document.addEventListener('visibilitychange', onVisibilityChange);
}

function disableAntiCheat() {
  isStrictMode = false;
  visibilityWarnings = 0;
  document.body.classList.remove('anti-cheat-mode');
  document.removeEventListener('contextmenu', preventDefaultHandler, true);
  document.removeEventListener('copy', preventDefaultHandler, true);
  document.removeEventListener('cut', preventDefaultHandler, true);
  document.removeEventListener('selectstart', preventDefaultHandler, true);
  document.removeEventListener('visibilitychange', onVisibilityChange);
}

function preventDefaultHandler(e) {
  if (!isStrictMode) return;
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function onVisibilityChange() {
  if (!isStrictMode || !currentTestId) return;

  if (document.hidden) {
    visibilityWarnings++;
    if (visibilityWarnings === 1) {
      sessionStorage.setItem('portal_visibility_warning', '1');
    } else if (visibilityWarnings >= 2) {
      forceFinishTestWithFail('Тест автоматически завершён: повторное переключение вкладки во время экзамена.');
    }
  } else {
    if (sessionStorage.getItem('portal_visibility_warning') === '1') {
      sessionStorage.removeItem('portal_visibility_warning');
      alert('Внимание! Переключение вкладки во время экзамена запрещено.\nПри повторном сворачивании тест будет автоматически завершён с оценкой 2.');
    }
  }
}

// ====================== ТАЙМЕР ======================

function startTestTimer(seconds) {
  stopTestTimer();
  if (!seconds || seconds <= 0) return;

  let remaining = seconds;
  const timerEl = document.getElementById('test-timer');

  const tick = () => {
    if (timerEl) {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    if (remaining <= 0) {
      stopTestTimer();
      finishTest(true);
      return;
    }
    remaining--;
  };

  tick();
  testTimerId = setInterval(tick, 1000);
}

function stopTestTimer() {
  if (testTimerId) {
    clearInterval(testTimerId);
    testTimerId = null;
  }
}

// ====================== УПРАВЛЕНИЕ ТЕСТОМ ======================

function saveAnswer(questionId, answer) {
  if (!currentTestId) return;
  testAnswers[questionId] = answer;
}

async function saveTestResult(result, test, timeSpentSec) {
  if (!currentUser || !test) return null;

  try {
    const payload = {
      action: 'save_result',
      email: normalizeEmail(currentUser.email),
      name: currentUser.name || '',
      group: currentUser.group || '',
      testId: test.id || currentTestId || 'unknown',
      testTitle: test.title || test.id || 'Тест',
      grade: result.grade,
      score: result.score,
      maxScore: result.maxScore,
      percent: result.percent,
      timeSpent: Math.max(0, Math.round(timeSpentSec || 0))
    };

    const response = await API.safeFetch(API.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!response || !response.success) {
      throw new Error(response?.error || 'Не удалось сохранить результат');
    }

    console.log('[Result] Сохранено. Попытка №', response.attempts);
    return response;
  } catch (err) {
    console.error('Ошибка сохранения результата:', err.message);
    return null;
  }
}

function startTest(test) {
  if (!test || !test.questions || !test.questions.length) {
    alert('Тест не содержит вопросов');
    return;
  }

  currentTest = test;
  currentTestId = test.id || 'default';
  testAnswers = {};
  visibilityWarnings = 0;
  testStartTimestamp = Date.now();

  const saved = loadTestProgress(currentTestId);
  if (saved && saved.answers) {
    testAnswers = { ...saved.answers };
  }

  const container = document.getElementById('test-container');
  if (!container) {
    console.error('Элемент #test-container не найден');
    return;
  }

  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'test-header';
  header.innerHTML = `
    <h2 class="test-title">${test.title || 'Тест'}</h2>
    <div class="test-meta">
      <div class="progress-wrap">
        <div class="progress-track">
          <div id="test-progress-bar" class="progress-bar" style="width:0%"></div>
        </div>
        <span id="test-progress-text" class="progress-text">0 из ${test.questions.length}</span>
      </div>
      <div id="test-timer" class="test-timer"></div>
    </div>
  `;
  container.appendChild(header);

  const questionsWrap = document.createElement('div');
  questionsWrap.className = 'questions-wrap';

  test.questions.forEach((q, idx) => {
    const qId = q.id || `q${idx}`;
    const block = buildTestBlock(q, idx, testAnswers[qId]);
    questionsWrap.appendChild(block);
  });

  container.appendChild(questionsWrap);

  const actions = document.createElement('div');
  actions.className = 'test-actions';
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = 'Сдать тест';
  submitBtn.addEventListener('click', () => finishTest(false));
  actions.appendChild(submitBtn);
  container.appendChild(actions);

  updateProgressBar();

  if (test.isExam || test.strict) {
    enableAntiCheat();
  } else {
    disableAntiCheat();
  }

  if (test.timeLimit && test.timeLimit > 0) {
    startTestTimer(test.timeLimit);
  }

  startAutosave();
  showScreen('test-screen');
}

async function finishTest(auto = false) {
  if (!currentTest) return;

  stopAutosave();
  stopTestTimer();
  disableAntiCheat();

  let timeSpent = 0;
  if (testStartTimestamp) {
    timeSpent = Math.round((Date.now() - testStartTimestamp) / 1000);
  }

  const result = gradeTest(currentTest, testAnswers);
  await saveTestResult(result, currentTest, timeSpent);

  if (currentTestId) clearTestProgress(currentTestId);

  showTestResult(result, auto);

  currentTestId = null;
  currentTest = null;
  testAnswers = {};
  testStartTimestamp = null;
  visibilityWarnings = 0;
}

async function forceFinishTestWithFail(reason) {
  stopAutosave();
  stopTestTimer();
  disableAntiCheat();

  let timeSpent = 0;
  if (testStartTimestamp) {
    timeSpent = Math.round((Date.now() - testStartTimestamp) / 1000);
  }

  const result = {
    score: 0,
    maxScore: (currentTest?.questions || []).length,
    percent: 0,
    grade: 2,
    details: [],
    forced: true,
    reason: reason || 'Нарушение правил экзамена'
  };

  if (currentTest) {
    await saveTestResult(result, currentTest, timeSpent);
  }

  if (currentTestId) clearTestProgress(currentTestId);

  showTestResult(result);

  currentTestId = null;
  currentTest = null;
  testAnswers = {};
  testStartTimestamp = null;
  visibilityWarnings = 0;
}

function showTestResult(result, auto = false) {
  const container = document.getElementById('test-result-container');
  if (!container) {
    alert(
      (auto ? 'Время вышло!\n\n' : '') +
      `Результат: ${result.score} из ${result.maxScore} (${result.percent}%)\nОценка: ${result.grade}` +
      (result.forced ? `\n\n${result.reason}` : '')
    );
    showScreen('main-screen');
    return;
  }

  container.innerHTML = `
    <div class="result-card">
      <h2>Результат теста</h2>
      ${result.forced ? `<p class="result-warning">${result.reason}</p>` : ''}
      ${auto ? '<p class="result-info">Время выполнения истекло</p>' : ''}
      <div class="result-score">
        <span class="score-value">${result.score}</span>
        <span class="score-max">/ ${result.maxScore}</span>
      </div>
      <p class="result-percent">${result.percent}%</p>
      <p class="result-grade">Оценка: <strong>${result.grade}</strong></p>
      <button class="btn btn-primary" id="back-to-main-btn">Вернуться</button>
    </div>
  `;

  showScreen('test-result-screen');

  document.getElementById('back-to-main-btn')?.addEventListener('click', () => {
    showScreen('main-screen');
  });
}

// ====================== УВЕДОМЛЕНИЯ ======================

function initLocalNotifications() {
  if (!('Notification' in window)) {
    console.log('[Notifications] API не поддерживается');
    return;
  }

  if (Notification.permission === 'denied') {
    console.log('[Notifications] Разрешение запрещено');
    return;
  }

  const showLocalNotification = () => {
    if (Notification.permission !== 'granted') return;
    try {
      const notification = new Notification('Напоминание', {
        body: 'Не забудьте пройти семестровую контрольную!',
        // ИСПРАВЛЕНО: относительный путь без слеша в начале
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        tag: 'portal-reminder',
        requireInteraction: false
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (err) {
      console.warn('[Notifications] Ошибка:', err);
    }
  };

  const startNotificationInterval = () => {
    if (window.__notificationIntervalId) return;
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    setTimeout(showLocalNotification, 10000);
    window.__notificationIntervalId = setInterval(showLocalNotification, TWO_HOURS);
    console.log('[Notifications] Напоминания запущены (раз в 2 часа)');
  };

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') startNotificationInterval();
    });
  } else if (Notification.permission === 'granted') {
    startNotificationInterval();
  }
}

// ====================== ИНИЦИАЛИЗАЦИЯ ======================

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    // ИСПРАВЛЕНО: относительный путь и относительный scope для GitHub Pages
    await navigator.serviceWorker.register('service-worker.js', { scope: './' });
    console.log('[PWA] Service Worker зарегистрирован');
  } catch (err) {
    console.warn('[PWA] Ошибка SW:', err);
  }
}

async function init() {
  registerServiceWorker();

  const session = await loadStudentData();
  if (session) {
    applyUserSession(session);
  } else {
    showScreen('auth-screen');
  }

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

  document.getElementById('logout-btn')?.addEventListener('click', logout);

  document.getElementById('open-reports-btn')?.addEventListener('click', () => {
    showScreen('reports-screen');
    if (typeof Reports !== 'undefined' && Reports.init) {
      Reports.init();
    }
  });

  document.getElementById('back-to-main-from-reports')?.addEventListener('click', () => {
    showScreen('main-screen');
  });

  window.addEventListener('beforeunload', () => {
    if (currentTestId && Object.keys(testAnswers).length > 0) {
      saveTestProgress();
    }
  });

  initLocalNotifications();
}

document.addEventListener('DOMContentLoaded', init);