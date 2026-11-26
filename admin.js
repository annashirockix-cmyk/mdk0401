window.uploadFileToDrive = async function() {
    var fileInput = document.getElementById('admin-file-input'), statusEl = document.getElementById('admin-file-status'), btn = document.getElementById('admin-file-btn');
    if (!fileInput || !statusEl || !btn) return;
    if (!fileInput.files || !fileInput.files.length) { statusEl.textContent = "Выберите файл."; return; }
    var file = fileInput.files[0], courseId = document.getElementById('admin-file-mdk').value, topicId = document.getElementById('admin-file-topic-id').value.trim();
    var title = document.getElementById('admin-file-title').value.trim() || file.name;
    if (!topicId) { statusEl.textContent = "Укажите ID темы."; return; }
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) { statusEl.textContent = "Разрешены только PDF, DOC и DOCX."; return; }
    if (file.size > 3500000) { statusEl.textContent = "Файл больше 3,5 МБ."; return; }
    btn.disabled = true; btn.textContent = "Загрузка…"; statusEl.textContent = "Чтение файла…";
    try {
        var dataUrl = await new Promise(function(resolve, reject) { var reader = new FileReader(); reader.onload = function(e) { resolve(String(e.target.result || "")); }; reader.onerror = function() { reject(new Error("Не удалось прочитать файл.")); }; reader.readAsDataURL(file); });
        statusEl.textContent = "Отправка в защищённое хранилище портала…";
        var result = await window.API.uploadCourseFile(courseId, topicId, title, file.name, dataUrl, "");
        if (!result || !result.success) throw new Error(result && result.error || "Не удалось загрузить файл.");
        statusEl.textContent = "Файл загружен и привязан к теме ✓"; fileInput.value = ""; document.getElementById('admin-file-title').value = "";
        if (window.loadGlobalCustomContent) window.loadGlobalCustomContent();
    } catch (error) { statusEl.textContent = "Ошибка загрузки: " + (error.message || "повторите попытку"); }
    finally { btn.disabled = false; btn.textContent = "Загрузить"; }
};
