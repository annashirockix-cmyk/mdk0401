// --- app.js ---

const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3Ev3stuvLl36nxjmXU0q2zi4UsS5ViXwEj1x6q_JjlCccMJld36o6y1H__CvJn5KB/exec';

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
        return { ok: false, error: "Ошибка соединения" };
    }
}

function getCourseData() {
    return window.DATA_0401 || window.data0401 || null;
}

function navigateTo(hash) {
    window.location.hash = hash;
}

function handleRouting() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const route = parts[0];
    const param = parts[1];
    const container = document.getElementById('app') || document.body;

    updateNavUI(route);

    switch (route) {
        case 'home': renderHome(container); break;
        case 'topic': renderTopic(container, param); break;
        case 'journal': renderJournal(container); break;
        case 'links': renderLinks(container); break;
        default: container.innerHTML = '<h2>404 Страница не найдена</h2>';
    }
}

function renderHome(container) {
    const data = getCourseData();
    if (!data) {
        container.innerHTML = '<p>Ошибка загрузки данных курса.</p>';
        return;
    }
    let html = `<div class="page-header"><h1>${data.title || 'МДК 04.01'}</h1></div><div class="topics-grid">`;
    (data.topics || []).forEach(topic => {
        html += `<div class="topic-card" onclick="navigateTo('topic/${topic.id}')">
            <h3>${topic.title}</h3><p>${topic.description || ''}</p></div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

function renderTopic(container, themeId) {
    const data = getCourseData();
    let theme = data && data.topics ? data.topics.find(t => t.id === themeId) : null;
    if (!theme) {
        container.innerHTML = `<h2>Тема не найдена</h2>`;
        return;
    }
    let html = `
        <button class="btn btn-back" onclick="navigateTo('home')">← На главную</button>
        <div class="page-header"><h1>${theme.title}</h1></div>
        <div class="lecture-box">${theme.content || ''}</div>
    `;
    container.innerHTML = html;
}

// === ГЛАВНАЯ ФУНКЦИЯ ЖУРНАЛА ===
async function renderJournal(container) {
    // Рисуем UI
    let html = `
        <button class="btn btn-back" onclick="navigateTo('home')">← На главную</button>
        
        <div class="journal-controls">
            <div class="input-group">
                <input type="text" id="student-id" placeholder="ID (например: иванов иван|тм 4-3)">
                <input type="text" id="student-name" placeholder="ФИО">
                <select id="student-group" class="btn-warning">
                    <option value="ТМ 4-3">ТМ 4-3</option>
                    <option value="ТМ 4-4">ТМ 4-4</option>
                </select>
                <button class="btn btn-primary" onclick="addStudent()">Добавить</button>
            </div>
            <div class="action-buttons">
                <button class="btn btn-success" onclick="exportToExcel()">Экспорт в Excel</button>
                <button class="btn btn-primary" onclick="renderJournal(document.getElementById('app'))">Обновить</button>
            </div>
        </div>

        <div id="journal-list" class="journal-list">
            <div class="empty-state">Загрузка данных...</div>
        </div>
    `;
    container.innerHTML = html;

    // Запрашиваем данные
    const response = await fetchGAS('getJournal');
    const listContainer = document.getElementById('journal-list');

    if (!response || !response.ok) {
        listContainer.innerHTML = `<div class="empty-state" style="color: #ff6b35;">Ошибка: ${response ? response.error : 'Нет ответа'}</div>`;
        return;
    }

    const students = response.data;

    if (students.length === 0) {
        listContainer.innerHTML = `<div class="empty-state">Студентов пока нет.</div>`;
    } else {
        let tableHtml = `<table class="journal-table">
            <thead><tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Группа</th>
                <th>XP</th>
                <th>Последнее обновление</th>
            </tr></thead>
            <tbody>`;
            
        students.forEach(s => {
            // Пытаемся вытащить XP из Payload
            let xp = 0;
            try {
                const parsed = JSON.parse(s.payload);
                if (parsed && parsed.xp !== undefined) xp = parsed.xp;
            } catch (e) {}

            tableHtml += `<tr>
                <td style="font-size: 12px; color: #8b949e;">${s.id}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.group}</td>
                <td><span style="color: #ff6b35; font-weight: bold;">${xp} XP</span></td>
                <td style="font-size: 12px; color: #8b949e;">${s.lastUpdate}</td>
            </tr>`;
        });
        tableHtml += `</tbody></table>`;
        listContainer.innerHTML = tableHtml;
    }
}

async function addStudent() {
    const id = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value;
    const group = document.getElementById('student-group').value;

    if (!id || !name) {
        alert("Введите ID и ФИО!");
        return;
    }

    const response = await fetchGAS('addStudent', { id, name, group });
    
    if (response && response.ok) {
        document.getElementById('student-id').value = '';
        document.getElementById('student-name').value = '';
        renderJournal(document.getElementById('app'));
    } else {
        alert("Ошибка: " + (response ? response.error : 'Неизвестно'));
    }
}

function exportToExcel() {
    alert("Для экспорта откройте Google Таблицу и выберите Файл -> Скачать -> Excel.");
}

function renderLinks(container) {
    container.innerHTML = `<button class="btn btn-back" onclick="navigateTo('home')">← На главную</button>
    <div class="page-header"><h1>Полезные материалы</h1></div>`;
}

function updateNavUI(route) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[href="#${route}"]`);
    if (activeLink) activeLink.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
});