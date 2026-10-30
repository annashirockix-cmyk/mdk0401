"use strict";

window.renderAdminPanel = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = "";
    
    // Проверка прав
    if (!window.state.staff) {
        app.innerHTML = "<div class='module' style='color:var(--err);'>Доступ запрещен. Требуются права преподавателя.</div>";
        return;
    }

    document.getElementById("crumbs").textContent = "Панель управления";

    var html = `
        <a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в кабинет</a>
        <section class="hero"><h1>⚙️ Панель управления</h1></section>

        <div class="module">
            <h3>📢 Добавить уведомление на главную</h3>
            <input type="text" id="admin-notif-text" class="self-input" placeholder="Текст уведомления (например: В пятницу экзамен!)" style="margin-bottom:10px;">
            <button class="btn" onclick="window.addNotification()">Добавить</button>
        </div>

        <div class="module">
            <h3>📚 Добавить новую тему в МДК</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <select id="admin-mdk-select" class="self-input">
                    <option value="07.01">МДК 07.01</option>
                    <option value="04.01">МДК 04.01</option>
                    <option value="02.01">МДК 02.01</option>
                    <option value="02.02">МДК 02.02</option>
                    <option value="MCAM">Mastercam</option>
                </select>
                <input type="text" id="admin-topic-code" class="self-input" placeholder="Код темы (например: Тема 1.1 или ПЗ №1)">
                <input type="text" id="admin-topic-title" class="self-input" placeholder="Название темы">
                <textarea id="admin-topic-content" class="self-input" rows="5" placeholder="Содержание лекции или задания (можно использовать HTML теги: <b>жирный</b>, <br> перенос строки)"></textarea>
                <button class="btn btn-primary" onclick="window.addCustomTopic()">Создать тему</button>
            </div>
        </div>

        <div class="module">
            <h3>📄 Загрузить PDF в лекции</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <select id="admin-pdf-mdk" class="self-input">
                    <option value="07.01">МДК 07.01</option>
                    <option value="04.01">МДК 04.01</option>
                    <option value="02.01">МДК 02.01</option>
                    <option value="02.02">МДК 02.02</option>
                </select>
                <input type="text" id="admin-pdf-topic-id" class="self-input" placeholder="ID темы (например: t-1-1 или m0201-t11)">
                <input type="text" id="admin-pdf-title" class="self-input" placeholder="Название PDF документа">
                <button class="btn" onclick="window.uploadPdf()">Загрузить (симуляция)</button>
                <p style="font-size:12px; color:var(--muted); margin:0;">* Загрузка файлов на GitHub Pages невозможна напрямую. Файл нужно положить в папку <code>attachments</code> вручную через Git.</p>
            </div>
        </div>
    `;

    app.innerHTML = html;
};

// ФУНКЦИЯ СОЗДАНИЯ ТЕМЫ
window.addCustomTopic = function() {
    var mdkId = document.getElementById('admin-mdk-select').value;
    var code = document.getElementById('admin-topic-code').value.trim();
    var title = document.getElementById('admin-topic-title').value.trim();
    var content = document.getElementById('admin-topic-content').value.trim();

    if (!code || !title) {
        alert("Заполните код и название темы!");
        return;
    }

    // Получаем существующие кастомные темы
    var customTopics = JSON.parse(localStorage.getItem('mdk_custom_topics') || '{}');
    if (!customTopics[mdkId]) customTopics[mdkId] = [];

    // Создаем объект новой темы
    var newTopic = {
        id: 'custom_' + Date.now(), // Уникальный ID
        code: code,
        title: title,
        lectures: [{ 
            code: "Лекция", 
            title: title, 
            content: content.replace(/\n/g, '<br>') // Превращаем переносы строк в HTML
        }],
        practicals: [],
        selfWork: [],
        test: []
    };

    // Сохраняем
    customTopics[mdkId].push(newTopic);
    localStorage.setItem('mdk_custom_topics', JSON.stringify(customTopics));

    alert("Тема успешно создана! Она появится в учебном плане.");
    window.renderAdminPanel(); // Очищаем поля
};

window.addNotification = function() {
    var text = document.getElementById('admin-notif-text').value.trim();
    if (!text) return alert("Введите текст уведомления");
    
    localStorage.setItem('mdk_global_notification', text);
    alert("Уведомление добавлено на главную!");
    document.getElementById('admin-notif-text').value = "";
};

window.uploadPdf = function() {
    alert("Для добавления PDF файла загрузите его в папку attachments репозитория на GitHub, а затем укажите путь к нему в коде темы.");
};