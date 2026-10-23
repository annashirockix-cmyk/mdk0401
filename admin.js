"use strict";

// Инициализация локальной базы для добавленных материалов
window.CUSTOM_DATA = JSON.parse(localStorage.getItem('mdk_custom_data')) || {
    notifications: [],
    customTopics: []
};

window.saveCustomData = function() {
    localStorage.setItem('mdk_custom_data', JSON.stringify(window.CUSTOM_DATA));
};

// Панель администратора (вызывается из личного кабинета препода)
window.renderAdminPanel = function() {
    var app = document.getElementById("app");
    app.innerHTML = `<a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в кабинет</a>
    <section class="hero"><h1>⚙️ Панель управления</h1></section>
    <div class="module">
        <h3>📢 Добавить уведомление на главную</h3>
        <input type="text" id="admNotifText" class="self-input" placeholder="Текст уведомления (например: В пятницу экзамен!)">
        <button class="btn" onclick="window.addNotification()">Добавить</button>
        
        <h3 style="margin-top:30px;">📚 Добавить новую тему в МДК</h3>
        <select id="admTopicMdk" class="self-input">
            <option value="07.01">МДК 07.01</option>
            <option value="04.01">МДК 04.01</option>
            <option value="02.01">МДК 02.01</option>
        </select>
        <input type="text" id="admTopicName" class="self-input" placeholder="Название темы">
        <textarea id="admTopicContent" class="self-input" rows="5" placeholder="Текст лекции (HTML поддерживается)"></textarea>
        <button class="btn" onclick="window.addCustomTopic()">Создать тему</button>
    </div>`;
};

window.addNotification = function() {
    var text = document.getElementById("admNotifText").value;
    if(!text) return;
    window.CUSTOM_DATA.notifications.push(text);
    window.saveCustomData();
    window.showToast("Уведомление добавлено!", "ok");
    document.getElementById("admNotifText").value = "";
};

window.addCustomTopic = function() {
    var mdkId = document.getElementById("admTopicMdk").value;
    var name = document.getElementById("admTopicName").value;
    var content = document.getElementById("admTopicContent").value;
    if(!name || !content) return;
    
    window.CUSTOM_DATA.customTopics.push({
        mdkId: mdkId,
        id: "custom_" + Date.now(),
        code: "Доп. тема",
        title: name,
        content: content
    });
    window.saveCustomData();
    window.showToast("Тема создана!", "ok");
    document.getElementById("admTopicName").value = "";
    document.getElementById("admTopicContent").value = "";
};