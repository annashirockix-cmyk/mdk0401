// app.js

// ВАША ССЫЛКА НА GOOGLE APPS SCRIPT
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3Ev3stuvLl36nxjmXU0q2zi4UsS5ViXwEj1x6q_JjlCccMJld36o6y1H__CvJn5KB/exec';

// === СОСТОЯНИЕ ===
const state = {
    user: JSON.parse(localStorage.getItem('portal_user')) || null, // { name, group, role, xp, results }
    currentPage: 'home',
    currentTopic: null,
    data: null
};

// === УТИЛИТЫ API ===
async function fetchGAS(action, payload = {}) {
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action, ...payload })
        });
        return await response.json();
    } catch (error) {
        console.error("Ошибка GAS:", error);
        return { ok: false, error: "Ошибка сети" };
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация данных курса (ожидаем, что data-0401.js загрузит глобальный объект)
    if (window.DATA_0401 || window.data0401) {
        state.data = window.DATA_0401 || window.data0401;
    } else {
        // Заглушка, если файл данных не подключен
        state.data = { title: "МДК 07.01 (ЧПУ)", topics: [] };
    }

    renderApp();
    window.addEventListener('hashchange', () => {
        parseHash();
        renderApp();
    });
});

function parseHash() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    state.currentPage = parts[0];
    state.currentTopic = parts[1] || null;
}

// === РЕНДЕРИНГ ===
function renderApp() {
    const root = document.getElementById('app') || document.body;
    
    // Если пользователь не авторизован — показываем экран входа
    if (!state.user) {
        root.innerHTML = renderLoginScreen();
        return;
    }

    // Если авторизован — показываем портал
    root.innerHTML = `
        <div id="app-container">
            ${renderSidebar()}
            <div class="main-content">
                ${renderHeader()}
                <div class="content-area">
                    ${renderPage()}
                </div>
                ${renderBottomNav()}
            </div>
        </div>
    `;
}

// --- ЭКРАН ВХОДА ---
function renderLoginScreen() {
    return `
        <div class="main-content" style="max-width: 800px; margin: 0 auto; width: 100%;">
            <div class="top-header">
                <p style="color: #888; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 10px;">ПОРТАЛ МДК</p>
                <h1>Оператор станков с ПУ</h1>
                <p>15.02.16 Технология машиностроения · ПМ.07</p>
            </div>
            
            <div class="content-area">
                <!-- Вход студента -->
                <div class="login-section">
                    <h2>Вход студента</h2>
                    <p>Укажите ФИО и группу.</p>
                    <div class="input-row">
                        <label>ФИО</label>
                        <input type="text" id="login-name" placeholder="Иванов Иван">
                    </div>
                    <div class="input-row">
                        <label>Группа</label>
                        <input type="text" id="login-group" placeholder="ТМ-4" value="ТМ-4">
                    </div>
                    <button class="btn btn-login" onclick="loginStudent()">Войти</button>
                </div>

                <hr style="border-color: #333; margin: 30px 0;">

                <!-- Вход преподавателя -->
                <div class="login-section">
                    <h2>Вход преподавателя</h2>
                    <p>Используйте <b>teacher / teacher</b></p>
                    <div class="input-row">
                        <label>Логин</label>
                        <input type="text" id="teacher-login" value="teacher">
                    </div>
                    <div class="input-row">
                        <label>Пароль</label>
                        <input type="password" id="teacher-pass" value="teacher">
                    </div>
                    <button class="btn btn-login" onclick="loginTeacher()">Войти в журнал</button>
                </div>
            </div>
        </div>
    `;
}

// --- САЙДБАР ---
function renderSidebar() {
    return `
        <div class="sidebar">
            <div class="sidebar-header">МДК Портал</div>
            <div class="sidebar-course">МДК 07.01 (ЧПУ) ⌄</div>
            <div style="padding: 0 20px; color: var(--accent-orange); font-weight: bold;">
                ★ ${state.user.xp || 0} XP
            </div>
            <div class="user-info">
                <div class="user-avatar">👨‍🏭</div>
                <div>
                    <div style="font-weight: bold;">${state.user.name}</div>
                    <div style="color: var(--text-muted); font-size: 0.8rem;">${state.user.group}</div>
                </div>
            </div>
            <button class="btn" style="margin: 20px; background: #333; color: #fff;" onclick="logout()">Выйти</button>
        </div>
    `;
}

// --- ШАПКА ---
function renderHeader() {
    if (state.currentPage === 'home') {
        return `
            <div class="top-header">
                <p style="color: #888; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem;">ПОРТАЛ МДК</p>
                <h1>${state.data.title || 'МДК 07.01 (ЧПУ)'}</h1>
                <p>15.02.16 Технология машиностроения · ПМ.07</p>
            </div>
        `;
    }
    return ``;
}

// --- КОНТЕНТ СТРАНИЦ ---
function renderPage() {
    if (state.currentPage === 'home') {
        return renderHome();
    } else if (state.currentPage === 'journal' && state.user.role === 'teacher') {
        return renderJournalHTML();
    } else if (state.currentPage === 'topic') {
        return renderTopicHTML();
    } else if (state.currentPage === 'links') {
        return `<h2>Полезные материалы</h2><p>Раздел в разработке.</p>`;
    }
    return `<h2>Страница не найдена</h2>`;
}

function renderHome() {
    let html = `<div class="topics-grid">`;
    if (state.data && state.data.topics && state.data.topics.length > 0) {
        state.data.topics.forEach(t => {
            html += `
                <div class="topic-card" onclick="navigateTo('topic/${t.id}')">
                    <h3>${t.title}</h3>
                    <p>${t.description || 'Перейти к изучению'}</p>
                </div>
            `;
        });
    } else {
        html += `<p>Темы пока не загружены (проверьте data-0401.js)</p>`;
    }
    html += `</div>`;
    return html;
}

function renderTopicHTML() {
    const theme = state.data.topics.find(t => t.id === state.currentTopic);
    if (!theme) return `<h2>Тема не найдена</h2>`;

    let html = `
        <button class="btn" style="width: auto; background: #333; color: #fff; margin-bottom: 20px;" onclick="navigateTo('home')">← Назад</button>
        <h2>${theme.title}</h2>
        <div class="lecture-content">${theme.content || 'Текст лекции...'}</div>
    `;

    const hasTests = (theme.test && theme.test.length > 0) || (theme.tests && theme.tests.length > 0);
    if (hasTests) {
        html += `
            <div style="margin-top: 20px; padding: 20px; background: #252525; border-radius: 8px;">
                <h3>Контрольный тест</h3>
                <button class="btn btn-primary" onclick="startTest('${theme.id}')">Пройти тест</button>
            </div>
        `;
    }
    return html;
}

// --- ЖУРНАЛ (ДЛЯ ПРЕПОДАВАТЕЛЯ) ---
function renderJournalHTML() {
    // Запускаем асинхронную загрузку данных
    loadJournalData();
    
    return `
        <h2>Журнал успеваемости</h2>
        <button class="btn btn-success" onclick="loadJournalData()" style="width: auto; margin-top: 10px;">Обновить</button>
        <div id="journal-data-container">
            <p style="margin-top: 20px; color: #888;">Загрузка данных...</p>
        </div>
    `;
}

async function loadJournalData() {
    const container = document.getElementById('journal-data-container');
    if (!container) return;

    const response = await fetchGAS('getJournal');
    
    if (!response || !response.ok) {
        container.innerHTML = `<p style="color: red;">Ошибка: ${response?.error}</p>`;
        return;
    }

    const students = response.data;
    if (students.length === 0) {
        container.innerHTML = `<p>Студентов пока нет.</p>`;
        return;
    }

    let html = `<table class="journal-table">
        <thead><tr><th>ФИО</th><th>Группа</th><th>XP</th><th>Обновлено</th></tr></thead>
        <tbody>`;
    
    students.forEach(s => {
        let xp = 0;
        try { xp = JSON.parse(s.payload).xp || 0; } catch(e) {}
        html += `<tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.group}</td>
            <td><span style="color: var(--accent-orange); font-weight: bold;">${xp}</span></td>
            <td style="font-size: 0.8rem; color: #888;">${s.lastUpdate}</td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    container.innerHTML = html;
}

// --- НИЖНЕЕ МЕНЮ ---
function renderBottomNav() {
    return `
        <div class="bottom-nav">
            <a href="#home">🏠 Главная</a>
            <a href="#">👤 Личный кабинет</a>
            <a href="#">📜 Мой сертификат</a>
            <a href="#">🏆 Достижения</a>
            <a href="#links">📚 Полезные материалы</a>
            ${state.user.role === 'teacher' ? '<a href="#journal">📓 Журнал (Оценки)</a>' : ''}
            <a href="#" onclick="logout()">🚪 Выйти</a>
        </div>
    `;
}

// === ЛОГИКА ===

function navigateTo(hash) {
    window.location.hash = hash;
}

async function loginStudent() {
    const name = document.getElementById('login-name').value.trim();
    const group = document.getElementById('login-group').value.trim();

    if (!name || !group) {
        alert("Заполните ФИО и группу!");
        return;
    }

    // Формируем ID для таблицы (например: "иванов иван|тм-4")
    const studentId = `${name.toLowerCase()}|${group.toLowerCase()}`;

    // Проверяем, есть ли такой студент в базе (опционально)
    // Для простоты просто логиним и отправляем данные при первом действии.
    // Но лучше сразу создать его в таблице.
    await fetchGAS('addStudent', { id: studentId, name: name, group: group });

    state.user = { name, group, role: 'student', xp: 0, results: {} };
    localStorage.setItem('portal_user', JSON.stringify(state.user));
    
    navigateTo('home');
    renderApp();
}

function loginTeacher() {
    const login = document.getElementById('teacher-login').value;
    const pass = document.getElementById('teacher-pass').value;

    if (login === 'teacher' && pass === 'teacher') {
        state.user = { name: 'Преподаватель', group: 'Администратор', role: 'teacher', xp: 0 };
        localStorage.setItem('portal_user', JSON.stringify(state.user));
        navigateTo('journal');
        renderApp();
    } else {
        alert("Неверный логин или пароль!");
    }
}

function logout() {
    localStorage.removeItem('portal_user');
    state.user = null;
    navigateTo('home');
    renderApp();
}

// Пример функции для теста (вызывается из лекции)
async function startTest(topicId) {
    if (state.user.role !== 'student') return;
    
    // Имитация прохождения теста
    const earnedXP = 10;
    alert(`Вы прошли тест на ${earnedXP} XP!`);
    
    state.user.xp += earnedXP;
    localStorage.setItem('portal_user', JSON.stringify(state.user));

    // Отправляем в Google Таблицу
    const studentId = `${state.user.name.toLowerCase()}|${state.user.group.toLowerCase()}`;
    const payload = JSON.stringify({ xp: state.user.xp, results: {} });
    
    await fetchGAS('updatePayload', { id: studentId, payload: payload });
    
    renderApp(); // Обновляем интерфейс (счетчик XP в сайдбаре)
}