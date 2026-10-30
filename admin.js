"use strict";

window.renderAdminPanel = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = "";
    
    if (!window.state.staff) {
        app.innerHTML = "<div class='module' style='color:var(--err);'>Доступ запрещен.</div>";
        return;
    }

    document.getElementById("crumbs").textContent = "Панель управления";

    app.innerHTML = `
        <a class="backlink" href="#/profile" style="color:var(--accent);">← Назад в кабинет</a>
        <section class="hero"><h1>⚙️ Панель управления</h1></section>

        <div class="module">
            <h3>📢 Добавить уведомление на главную</h3>
            <input type="text" id="admin-notif-text" class="self-input" placeholder="Текст уведомления" style="margin-bottom:10px;">
            <button class="btn" onclick="window.addNotification()">Добавить</button>
        </div>

        <div class="module" id="admin-content-block">
            <h3>📚 Управление лекциями и материалами</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <select id="admin-mdk-select" class="self-input">
                    <option value="07.01">МДК 07.01</option>
                    <option value="04.01">МДК 04.01</option>
                    <option value="02.01">МДК 02.01</option>
                    <option value="02.02">МДК 02.02</option>
                    <option value="MCAM">Mastercam</option>
                </select>
                <input type="text" id="admin-topic-code" class="self-input" placeholder="Код (например: Тема 1.1)">
                <input type="text" id="admin-topic-title" class="self-input" placeholder="Название лекции/темы">
                <textarea id="admin-topic-content" class="self-input" rows="5" placeholder="Текст лекции (можно HTML теги)"></textarea>
                <input type="hidden" id="admin-edit-id" value="">
                <button class="btn btn-primary" onclick="window.saveTopicAdmin()">💾 Сохранить лекцию</button>
                <button class="btn ghost" onclick="window.resetAdminForm()" id="btn-cancel-edit" style="display:none;">Отмена</button>
            </div>
        </div>

        <div class="module">
            <h3>📄 Загрузить файл (PDF, DOCX, PPTX и др.)</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <select id="admin-file-mdk" class="self-input">
                    <option value="07.01">МДК 07.01</option>
                    <option value="04.01">МДК 04.01</option>
                    <option value="02.01">МДК 02.01</option>
                    <option value="02.02">МДК 02.02</option>
                </select>
                <input type="text" id="admin-file-topic-id" class="self-input" placeholder="ID темы (например: t-1-1 или custom_... )">
                <input type="text" id="admin-file-title" class="self-input" placeholder="Название файла (например: Методичка)">
                <input type="file" id="admin-file-input" class="self-input" style="padding:8px;">
                <button class="btn" id="admin-file-btn" onclick="window.uploadFileToDrive()">Загрузить</button>
                <p id="admin-file-status" style="font-size:14px; color:var(--muted); margin:0;"></p>
            </div>
        </div>

        <div class="module">
            <h3>📋 Список загруженных лекций</h3>
            <div id="admin-custom-list"><p>Загрузка...</p></div>
        </div>
    `;

    window.loadAdminCustomContent();

    // При смене МДК подгружаем список тем для удобства
    document.getElementById('admin-mdk-select').onchange = function() {
        var mdkId = this.value;
        var course = window.MDK_DATA[mdkId];
        var datalist = document.getElementById('topics-list');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'topics-list';
            document.body.appendChild(datalist);
        }
        datalist.innerHTML = '';
        if (course && course.sections) {
            course.sections.forEach(s => s.topics.forEach(t => {
                datalist.innerHTML += `<option value="${t.id}">${t.code} ${t.title}</option>`;
            }));
        }
        document.getElementById('admin-file-topic-id').setAttribute('list', 'topics-list');
    };
};

window.loadAdminCustomContent = function() {
    var list = document.getElementById("admin-custom-list");
    if (!list) return;
    
    window.API.getCustomContent().then(res => {
        if (!res || !res.success) { list.innerHTML = "Ошибка загрузки"; return; }
        
        var topics = res.data.filter(d => d.type === 'topic');
        var files = res.data.filter(d => d.type === 'file');

        if (topics.length === 0) {
            list.innerHTML = "<p>Кастомных лекций пока нет.</p>";
        } else {
            var html = '<table class="journal-table" style="width:100%;"><thead><tr><th>МДК</th><th>Код</th><th>Название</th><th>Действия</th></tr></thead><tbody>';
            topics.forEach(t => {
                html += `<tr>
                    <td>${t.mdkId}</td>
                    <td>${t.title.split(' ')[0] || t.id}</td>
                    <td>${t.title}</td>
                    <td>
                        <button class="btn ghost" onclick="window.editTopicAdmin('${t.id}')" style="padding:4px 8px; font-size:12px; margin-bottom:4px;">✏️ Редакт.</button>
                        <button class="btn ghost" onclick="window.deleteTopicAdmin('${t.id}')" style="padding:4px 8px; font-size:12px; color:var(--err); border-color:var(--err);">🗑 Удалить</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            list.innerHTML = html;
        }
    }).catch(err => {
        list.innerHTML = "Ошибка сети: " + err.message;
    });
};

window.saveTopicAdmin = function() {
    var mdkId = document.getElementById('admin-mdk-select').value;
    var code = document.getElementById('admin-topic-code').value.trim();
    var title = document.getElementById('admin-topic-title').value.trim();
    var content = document.getElementById('admin-topic-content').value.trim();
    var editId = document.getElementById('admin-edit-id').value;

    if (!code || !title) { alert("Заполните код и название!"); return; }

    var data = {
        id: editId || 'custom_' + Date.now(),
        type: 'topic',
        mdkId: mdkId,
        title: code + ' ' + title, // Сохраняем вместе для удобства
        content: content.replace(/\n/g, '<br>')
    };

    window.API.saveCustomContent(data).then(res => {
        if (res && res.success) {
            alert("Сохранено!");
            window.resetAdminForm();
            window.loadAdminCustomContent();
            if (window.loadGlobalCustomContent) window.loadGlobalCustomContent(); // Обновляем данные на сайте
        } else {
            alert("Ошибка: " + (res ? res.error : 'Нет ответа'));
        }
    });
};

window.editTopicAdmin = function(id) {
    window.API.getCustomContent().then(res => {
        var topic = res.data.find(d => d.id === id && d.type === 'topic');
        if (!topic) return;
        
        var parts = topic.title.split(' ');
        var code = parts[0];
        var title = parts.slice(1).join(' ');

        document.getElementById('admin-mdk-select').value = topic.mdkId;
        document.getElementById('admin-topic-code').value = code;
        document.getElementById('admin-topic-title').value = title;
        document.getElementById('admin-topic-content').value = topic.content.replace(/<br>/g, '\n');
        document.getElementById('admin-edit-id').value = topic.id;
        
        document.getElementById('btn-cancel-edit').style.display = 'inline-block';
        window.scrollTo(0, document.getElementById('admin-content-block').offsetTop);
    });
};

window.deleteTopicAdmin = function(id) {
    if (!confirm("Удалить эту лекцию?")) return;
    window.API.deleteCustomContent(id).then(res => {
        if (res && res.success) {
            window.loadAdminCustomContent();
            if (window.loadGlobalCustomContent) window.loadGlobalCustomContent();
        } else {
            alert("Ошибка удаления");
        }
    });
};

window.resetAdminForm = function() {
    document.getElementById('admin-topic-code').value = '';
    document.getElementById('admin-topic-title').value = '';
    document.getElementById('admin-topic-content').value = '';
    document.getElementById('admin-edit-id').value = '';
    document.getElementById('btn-cancel-edit').style.display = 'none';
};

window.uploadFileToDrive = function() {
    var fileInput = document.getElementById('admin-file-input');
    var statusEl = document.getElementById('admin-file-status');
    var btn = document.getElementById('admin-file-btn');
    
    if (!fileInput.files.length) { alert("Выберите файл!"); return; }
    var file = fileInput.files[0];
    var mdkId = document.getElementById('admin-file-mdk').value;
    var topicId = document.getElementById('admin-file-topic-id').value.trim();
    var fileTitle = document.getElementById('admin-file-title').value.trim() || file.name;

    if (!topicId) { alert("Укажите ID темы!"); return; }

    btn.disabled = true;
    btn.textContent = "Загрузка...";
    statusEl.textContent = "Чтение файла...";

    var reader = new FileReader();
    reader.onload = function(e) {
        statusEl.textContent = "Отправка на сервер (это может занять время)...";
        window.API.uploadFile(file.name, file.type, e.target.result).then(function(res) {
            btn.disabled = false;
            btn.textContent = "Загрузить";
            if (res && res.success) {
                statusEl.innerHTML = `<span style="color:var(--ok);">✅ Успешно! <a href="${res.downloadUrl}" target="_blank">Скачать</a></span>`;
                
                // Сохраняем метаданные файла в базу
                window.API.saveCustomContent({
                    id: 'file_' + Date.now(),
                    type: 'file',
                    mdkId: mdkId,
                    topicId: topicId,
                    title: fileTitle,
                    fileUrl: res.downloadUrl,
                    fileName: file.name
                }).then(() => {
                    if (window.loadGlobalCustomContent) window.loadGlobalCustomContent();
                });
                
                fileInput.value = '';
                document.getElementById('admin-file-title').value = '';
            } else {
                statusEl.innerHTML = `<span style="color:var(--err);">❌ Ошибка: ${res ? res.error : 'Нет ответа'}</span>`;
            }
        }).catch(function(err) {
            btn.disabled = false;
            btn.textContent = "Загрузить";
            statusEl.innerHTML = `<span style="color:var(--err);">❌ Сеть: ${err.message}</span>`;
        });
    };
    reader.readAsDataURL(file);
};

window.addNotification = function() {
    var text = document.getElementById('admin-notif-text').value.trim();
    if (!text) return alert("Введите текст");
    localStorage.setItem('mdk_global_notification', text);
    alert("Уведомление добавлено!");
    document.getElementById('admin-notif-text').value = "";
};