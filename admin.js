window.uploadFileToDrive = function() {
    var fileInput = document.getElementById('admin-file-input');
    var statusEl = document.getElementById('admin-file-status');
    var btn = document.getElementById('admin-file-btn');
    
    if (!fileInput.files.length) { alert("Выберите файл!"); return; }
    var file = fileInput.files[0];
    var mdkId = document.getElementById('admin-file-mdk').value;
    var topicId = document.getElementById('admin-file-topic-id').value.trim();
    var fileTitle = document.getElementById('admin-file-title').value.trim() || file.name;

    if (!topicId) { alert("Укажите ID темы (например: t-1-1)!"); return; }

    btn.disabled = true;
    btn.textContent = "Загрузка...";
    statusEl.textContent = "Чтение файла...";

    var reader = new FileReader();
    reader.onload = function(e) {
        var base64Data = e.target.result; // Полный DataURL (data:...;base64,...)
        statusEl.textContent = "Отправка на сервер...";

        window.API.uploadFile(file.name, file.type, base64Data).then(function(res) {
            btn.disabled = false;
            btn.textContent = "Загрузить";
            
            if (res && res.success) {
                statusEl.innerHTML = `<span style="color:var(--ok);">✅ Файл загружен! <a href="${res.downloadUrl}" target="_blank">Скачать</a></span>`;
                
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