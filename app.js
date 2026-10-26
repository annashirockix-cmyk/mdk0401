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

  // Показываем кнопки для teacher и admin
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

// ====================== ТЕСТЫ ======================
function saveTestProgress() {
  if (!currentUser || !currentTestId) return;
  const key = CONFIG.STORAGE_TEST_PROGRESS;
  let allProgress = {};
  try { const raw = localStorage.getItem(key); if (raw) allProgress = JSON.parse(raw); } catch { allProgress = {}; }
  const userKey = normalizeEmail(currentUser.email);
  if (!allProgress[userKey]) allProgress[userKey] = {};
  allProgress[userKey][currentTestId] = { answers: { ...testAnswers }, savedAt: Date.now() };
  localStorage.setItem(key, JSON.stringify(allProgress));
}

function loadTestProgress(testId) {
  if (!currentUser) return null;
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_TEST_PROGRESS);
    if (!raw) return null;
    const allProgress = JSON.parse(raw);
    const userKey = normalizeEmail(currentUser.email);
    return (allProgress[userKey] && allProgress[userKey][testId]) ? allProgress[userKey][testId] : null;
  } catch { return null; }
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
  } catch { }
}

function startAutosave() { stopAutosave(); autosaveTimerId = setInterval(() => { if (currentTestId && Object.keys(testAnswers).length > 0) saveTestProgress(); }, CONFIG.AUTOSAVE_INTERVAL_MS); }
function stopAutosave() { if (autosaveTimerId) { clearInterval(autosaveTimerId); autosaveTimerId = null; } }

function buildTestBlock(question, index, savedAnswer = null) {
  const block = document.createElement('div'); block.className = 'test-question';
  const qId = question.id || `q${index}`;
  block.innerHTML = `<div class="question-title"><span class="q-num">${index + 1}.</span> ${question.q || question.text || ''}</div>`;

  if (question.type === 'text') {
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'text-answer-input'; input.placeholder = 'Введите ответ...'; input.dataset.qid = qId;
    if (savedAnswer) input.value = savedAnswer;
    input.addEventListener('input', () => { saveAnswer(qId, input.value); updateProgressBar(); });
    block.appendChild(input); return block;
  }

  const optionsWrap = document.createElement('div'); optionsWrap.className = 'options-list';
  const isMultiple = question.type === 'multiple';
  const options = question.options || question.answers || [];

  options.forEach((opt, optIdx) => {
    const label = document.createElement('label'); label.className = 'option-item';
    const input = document.createElement('input');
    input.type = isMultiple ? 'checkbox' : 'radio';
    input.name = isMultiple ? `q_${qId}_${optIdx}` : `q_${qId}`;
    input.value = typeof opt === 'object' ? (opt.value ?? optIdx) : opt;
    input.dataset.qid = qId;
    if (savedAnswer) {
      if (isMultiple && Array.isArray(savedAnswer) && (savedAnswer.includes(input.value) || savedAnswer.includes(String(optIdx)))) input.checked = true;
      else if (!isMultiple && (String(savedAnswer) === String(input.value) || String(savedAnswer) === String(optIdx))) input.checked = true;
    }
    input.addEventListener('change', () => {
      if (isMultiple) saveAnswer(qId, Array.from(block.querySelectorAll(`input[data-qid="${qId}"]:checked`)).map(el => el.value));
      else saveAnswer(qId, input.value);
      updateProgressBar();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(typeof opt === 'object' ? (opt.text || opt.label || opt.value) : opt));
    optionsWrap.appendChild(label);
  });
  block.appendChild(optionsWrap); return block;
}

function updateProgressBar() {
  const bar = document.getElementById('test-progress-bar'); const text = document.getElementById('test-progress-text');
  if (!bar || !currentTest) return;
  const total = (currentTest.questions || []).length;
  const answered = Object.keys(testAnswers).filter(k => Array.isArray(testAnswers[k]) ? testAnswers[k].length > 0 : String(testAnswers[k]).trim() !== '').length;
  bar.style.width = (total > 0 ? Math.round((answered / total) * 100) : 0) + '%';
  if (text) text.textContent = `${answered} из ${total}`;
}

function gradeTest(test, answers) {
  let correctCount = 0; const details = [];
  (test.questions || []).forEach((q, index) => {
    const qId = q.id || `q${index}`; const userAnswer = answers[qId]; let isCorrect = false;
    if (q.type === 'text') isCorrect = normalizeTextAnswer(userAnswer) === normalizeTextAnswer(q.answer || q.correct) && normalizeTextAnswer(userAnswer) !== '';
    else if (q.type === 'multiple') {
      const cSet = new Set((q.correct || q.answer || []).map(String)); const uSet = new Set((Array.isArray(userAnswer) ? userAnswer : []).map(String));
      isCorrect = cSet.size === uSet.size && [...cSet].every(v => uSet.has(v));
    } else isCorrect = String(userAnswer) === String(q.correct ?? q.answer ?? '');
    if (isCorrect) correctCount++;
    details.push({ id: qId, question: q.q || q.text, userAnswer, correctAnswer: q.answer ?? q.correct, isCorrect });
  });
  const maxScore = (test.questions || []).length;
  const percent = maxScore > 0 ? Math.round((correctCount / maxScore) * 100) : 0;
  let grade = 2; if (percent >= 85) grade = 5; else if (percent >= 70) grade = 4; else if (percent >= 50) grade = 3;
  return { score: correctCount, maxScore, percent, grade, details };
}

function enableAntiCheat() {
  isStrictMode = true; visibilityWarnings = 0; document.body.classList.add('anti-cheat-mode');
  ['contextmenu', 'copy', 'cut', 'selectstart'].forEach(ev => document.addEventListener(ev, preventDefaultHandler, true));
  document.addEventListener('visibilitychange', onVisibilityChange);
}
function disableAntiCheat() {
  isStrictMode = false; visibilityWarnings = 0; document.body.classList.remove('anti-cheat-mode');
  ['contextmenu', 'copy', 'cut', 'selectstart'].forEach(ev => document.removeEventListener(ev, preventDefaultHandler, true));
  document.removeEventListener('visibilitychange', onVisibilityChange);
}
function preventDefaultHandler(e) { if (isStrictMode) { e.preventDefault(); e.stopPropagation(); return false; } }
function onVisibilityChange() {
  if (!isStrictMode || !currentTestId) return;
  if (document.hidden) {
    visibilityWarnings++;
    if (visibilityWarnings === 1) sessionStorage.setItem('portal_visibility_warning', '1');
    else if (visibilityWarnings >= 2) forceFinishTestWithFail('Тест завершён: переключение вкладок.');
  } else if (sessionStorage.getItem('portal_visibility_warning') === '1') {
    sessionStorage.removeItem('portal_visibility_warning');
    alert('Внимание! Переключение вкладок запрещено.\nПри повторном переключении тест будет завершён с оценкой 2.');
  }
}

function startTestTimer(seconds) {
  stopTestTimer(); if (!seconds || seconds <= 0) return;
  let remaining = seconds; const timerEl = document.getElementById('test-timer');
  const tick = () => {
    if (timerEl) timerEl.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    if (remaining <= 0) { stopTestTimer(); finishTest(true); return; }
    remaining--;
  };
  tick(); testTimerId = setInterval(tick, 1000);
}
function stopTestTimer() { if (testTimerId) { clearInterval(testTimerId); testTimerId = null; } }
function saveAnswer(questionId, answer) { if (currentTestId) testAnswers[questionId] = answer; }

async function saveTestResult(result, test, timeSpentSec) {
  if (!currentUser || !test) return null;
  try {
    const payload = { action: 'save_result', email: normalizeEmail(currentUser.email), name: currentUser.name || '', group: currentUser.group || '', testId: test.id || currentTestId || 'unknown', testTitle: test.title || test.id || 'Тест', grade: result.grade, score: result.score, maxScore: result.maxScore, percent: result.percent, timeSpent: Math.max(0, Math.round(timeSpentSec || 0)) };
    const response = await API.safeFetch(API.BASE_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    if (!response || !response.success) throw new Error(response?.error || 'Ошибка сохранения');
    return response;
  } catch (err) { console.error(err); return null; }
}

function startTest(test) {
  if (!test || !test.questions || !test.questions.length) return alert('Тест не содержит вопросов');
  currentTest = test; currentTestId = test.id || 'default'; testAnswers = {}; visibilityWarnings = 0; testStartTimestamp = Date.now();
  const saved = loadTestProgress(currentTestId); if (saved && saved.answers) testAnswers = { ...saved.answers };

  const container = document.getElementById('test-container'); if (!container) return; container.innerHTML = '';
  container.innerHTML = `<div class="test-header"><h2 class="test-title">${test.title || 'Тест'}</h2><div class="test-meta"><div class="progress-wrap"><div class="progress-track"><div id="test-progress-bar" class="progress-bar" style="width:0%"></div></div><span id="test-progress-text" class="progress-text">0 из ${test.questions.length}</span></div><div id="test-timer" class="test-timer"></div></div></div>`;

  const questionsWrap = document.createElement('div'); questionsWrap.className = 'questions-wrap';
  test.questions.forEach((q, idx) => { questionsWrap.appendChild(buildTestBlock(q, idx, testAnswers[q.id || `q${idx}`])); });
  container.appendChild(questionsWrap);

  const actions = document.createElement('div'); actions.className = 'test-actions';
  const submitBtn = document.createElement('button'); submitBtn.className = 'btn btn-primary'; submitBtn.textContent = 'Сдать тест';
  submitBtn.addEventListener('click', () => finishTest(false)); actions.appendChild(submitBtn); container.appendChild(actions);

  updateProgressBar();
  if (test.isExam || test.strict) enableAntiCheat(); else disableAntiCheat();
  if (test.timeLimit && test.timeLimit > 0) startTestTimer(test.timeLimit);
  startAutosave(); showScreen('test-screen');
}

async function finishTest(auto = false) {
  if (!currentTest) return;
  stopAutosave(); stopTestTimer(); disableAntiCheat();
  const timeSpent = testStartTimestamp ? Math.round((Date.now() - testStartTimestamp) / 1000) : 0;
  const result = gradeTest(currentTest, testAnswers);
  await saveTestResult(result, currentTest, timeSpent);
  if (currentTestId) clearTestProgress(currentTestId);
  showTestResult(result, auto);
  currentTestId = null; currentTest = null; testAnswers = {}; testStartTimestamp = null; visibilityWarnings = 0;
}

async function forceFinishTestWithFail(reason) {
  stopAutosave(); stopTestTimer(); disableAntiCheat();
  const timeSpent = testStartTimestamp ? Math.round((Date.now() - testStartTimestamp) / 1000) : 0;
  const result = { score: 0, maxScore: (currentTest?.questions || []).length, percent: 0, grade: 2, details: [], forced: true, reason: reason || 'Нарушение правил' };
  if (currentTest) await saveTestResult(result, currentTest, timeSpent);
  if (currentTestId) clearTestProgress(currentTestId);
  showTestResult(result);
  currentTestId = null; currentTest = null; testAnswers = {}; testStartTimestamp = null; visibilityWarnings = 0;
}

function showTestResult(result, auto = false) {
  const container = document.getElementById('test-result-container');
  if (!container) return alert(`Оценка: ${result.grade}`);
  container.innerHTML = `<div class="result-card"><h2>Результат теста</h2>${result.forced ? `<p class="result-warning">${result.reason}</p>` : ''}${auto ? '<p class="result-info">Время истекло</p>' : ''}<div class="result-score"><span class="score-value">${result.score}</span><span class="score-max">/ ${result.maxScore}</span></div><p class="result-percent">${result.percent}%</p><p class="result-grade">Оценка: <strong>${result.grade}</strong></p><button class="btn btn-primary" id="back-to-main-btn">Вернуться</button></div>`;
  showScreen('test-result-screen');
  document.getElementById('back-to-main-btn')?.addEventListener('click', () => showScreen('main-screen'));
}

// ====================== ИНИЦИАЛИЗАЦИЯ ======================
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('service-worker.js', { scope: './' }); } catch (e) { console.warn(e); }
  }
}

async function init() {
  registerServiceWorker();

  // Переключение форм
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

  // Обработка регистрации
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

  // Проверка сессии
  const session = await loadStudentData();
  if (session) applyUserSession(session); else showScreen('auth-screen');

  // Обработка входа
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
    if (typeof Reports !== 'undefined' && Reports.init) Reports.init();
  });
  document.getElementById('back-to-main-from-reports')?.addEventListener('click', () => showScreen('main-screen'));

  window.addEventListener('beforeunload', () => {
    if (currentTestId && Object.keys(testAnswers).length > 0) saveTestProgress();
  });

  // Уведомления
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

document.addEventListener('DOMContentLoaded', init);