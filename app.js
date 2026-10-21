// app.js

// ВАША ССЫЛКА НА GOOGLE APPS SCRIPT
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3Ev3stuvLl36nxjmXU0q2zi4UsS5ViXwEj1x6q_JjlCccMJld36o6y1H__CvJn5KB/exec';

const state = {
    user: JSON.parse(localStorage.getItem('portal_user')) || null,
    currentPage: 'home',
    currentTopic: null,
    data: window.DATA_0401 || window.data0401 || { title: "МДК 07.01 (ЧПУ)", topics: [] }
};

// --- API ---
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

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('hashchange', () => {
        parseHash();
        renderApp();
    });
    parseHash();
    renderApp();
});

function parseHash() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    state.currentPage = parts[0];
    state.currentTopic = parts[1] || null;
}

// --- ГЛАВНЫЙ РЕНДЕР ---
function renderApp() {
    const root = document.getElementById('app');
    
    if (!state.user) {
        root.innerHTML = renderLoginScreen();
        return;
    }

    root.innerHTML = `
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
        </div>
        <div class="main-wrapper">
            <div class="main-content">
                ${renderPage()}
            </div>
            ${renderBottomNav()}
        </div>
    `;
}

// --- ЭКРАН ВХОДА ---
function renderLoginScreen() {
    return `
        <div class="main-wrapper" style="align-items: center; justify-content: flex-start; padding-top: 50px;">
            <div class="top-header" style="border: none;">
                <p style="color: var(--accent-orange); text-transform: uppercase; letter-spacing: 2px;">ПОРТАЛ МДК</p>
                <h1>Оператор станков с ПУ</h1>
                <p>15.02.16 Технология машиностроения · ПМ.07</p>
            </div>
            
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
                <button class="btn btn-primary" onclick="loginStudent()">Войти</button>
            </div>

            <hr style="border-color: var(--border-color); width: 100%; max-width: 500px; margin: 0 auto;">

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
                <button class="btn btn-primary" onclick="loginTeacher()">Войти в журнал</button>
            </div>
        </div>
    `;
}

// --- КОНТЕНТ ---
function renderPage() {
    if (state.currentPage === 'home') {
        let html = `<h2>Доступные темы</h2><div class="topics-grid">`;
        if (state.data && state.data.topics && state.data.topics.length > 0) {
            state.data.topics.forEach(t => {
                html += `<div class="topic-card" onclick="navigateTo('topic/${t.id}')">
                    <h3>${t.title}</h3><p>${t.description || 'Перейти к изучению'}</p></div>`;
            });
        } else {
            html += `<p>Темы пока не загружены. Проверьте файл data-0401.js</p>`;
        }
        return html + `</div>`;
    } 
    
    if (state.currentPage === 'journal') {
        if (state.user.role !== 'teacher') return `<h2>Доступ только для преподавателя</h2>`;
        loadJournalData();
        return `<h2>Журнал успеваемости</h2><div id="journal-data-container">Загрузка...</div>`;
    }

    if (state.currentPage === 'topic') {
        const theme = state.data.topics.find(t => t.id === state.currentTopic);
        if (!theme) return `<h2>Тема не найдена</h2>`;
        return `
            <button class="btn btn-primary" style="width: auto; margin-bottom: 20px;" onclick="navigateTo('home')">← Назад</button>
            <h2>${theme.title}</h2>
            <div style="background: var(--bg-panel); padding: 30px; border-radius: 8px; margin-top: 20px; line-height: 1.6;">
                ${theme.content || 'Текст лекции...'}
            </div>
        `;
    }

    return `<h2>Страница не найдена</h2>`;
}

// --- НИЖНЕЕ МЕНЮ ---
function renderBottomNav() {
    return `
        <div class="bottom-nav">
            <a href="#home">🏠 Главная</a>
            <a href="#">👤 Личный кабинет</a>
            <a href="#">📜 Мой сертификат</a>
            <a href="#">🏆 Достижения</a>
            <a href="#">📚 Полезные материалы</a>
            ${state.user.role === 'teacher' ? '<a href="#journal">📓 Журнал (Оценки)</a>' : ''}
            <a href="#" onclick="logout(event)">🚪 Выйти</a>
        </div>
    `;
}

// --- ЛОГИКА ---
function navigateTo(hash) { window.location.hash = hash; }

async function loginStudent() {
    const name = document.getElementById('login-name').value.trim();
    const group = document.getElementById('login-group').value.trim();
    if (!name || !group) { alert("Заполните ФИО и группу!"); return; }

    const studentId = `${name.toLowerCase()}|${group.toLowerCase()}`;
    
    // Пытаемся сохранить в базу (если интернета нет, все равно пускаем)
    try { await fetchGAS('addStudent', { id: studentId, name: name, group: group }); } catch (e) {}

    state.user = { name, group, role: 'student', xp: 0, results: {} };
    localStorage.setItem('portal_user', JSON.stringify(state.user));
    window.location.hash = 'home'; // Переходим на главную
    renderApp();
}

function loginTeacher() {
    const login = document.getElementById('teacher-login').value;
    const pass = document.getElementById('teacher-pass').value;

    if (login === 'teacher' && pass === 'teacher') {
        state.user = { name: 'Преподаватель', group: 'Админ', role: 'teacher', xp: 0 };
        localStorage.setItem('portal_user', JSON.stringify(state.user));
        window.location.hash = 'journal';
        renderApp();
    } else {
        alert("Неверный логин или пароль! (teacher / teacher)");
    }
}

function logout(e) {
    if(e) e.preventDefault();
    localStorage.removeItem('portal_user');
    state.user = null;
    window.location.hash = 'home';
    renderApp();
}

// --- ЖУРНАЛ ---
async function loadJournalData() {
    const container = document.getElementById('journal-data-container');
    if (!container) return;

    const response = await fetchGAS('getJournal');
    if (!response || !response.ok) {
        container.innerHTML = `<p style="color: var(--accent-orange);">Ошибка: ${response?.error || 'Нет связи'}</p>`;
        return;
    }

    const students = response.data;
    if (students.length === 0) {
        container.innerHTML = `<p>Студентов пока нет.</p>`;
        return;
    }

    let html = `<table class="journal-table"><thead><tr><th>ФИО</th><th>Группа</th><th>XP</th><th>Обновлено</th></tr></thead><tbody>`;
    students.forEach(s => {
        let xp = 0;
        try { xp = JSON.parse(s.payload).xp || 0; } catch(e) {}
        html += `<tr><td><strong>${s.name}</strong></td><td>${s.group}</td><td style="color:var(--accent-orange);font-weight:bold;">${xp}</td><td style="font-size:0.8rem;color:#888;">${s.lastUpdate}</td></tr>`;
    });
    container.innerHTML = html + `</tbody></table>`;
}