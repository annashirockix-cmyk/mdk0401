"use strict";
(function () {
  var esc = function (value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var currentUser = function () { return window.state && (window.state.staff || window.state.student) || {}; };
  var isTeacher = function () { var r = String(currentUser().role || "").toLowerCase(); return r === "teacher" || r === "admin"; };
  var announcements = function (courseId) {
    return (window.customContent.announcements || []).filter(function (x) { return x.mdkId === courseId; })
      .sort(function (a, b) { return String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")); });
  };
  var dateLabel = function (value) {
    var d = value ? new Date(value) : null;
    return d && !isNaN(d.getTime()) ? d.toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" }) : "";
  };

  var originalHome = window.renderHomePage;
  if (originalHome) window.renderHomePage = function () {
    originalHome.apply(this, arguments);
    var app = document.getElementById("app");
    var courseId = window.state && window.state.activeCourseId;
    if (!app || !courseId) return;
    var items = announcements(courseId);
    if (!items.length) return;
    var panel = document.createElement("section");
    panel.className = "module course-announcements";
    panel.innerHTML = "<div class='announcement-heading'><div><div class='announcement-kicker'>ВАЖНАЯ ИНФОРМАЦИЯ</div><h2>📢 Объявления преподавателя</h2></div><span class='announcement-count'>" + items.length + "</span></div>" +
      items.map(function (item) {
        return "<article class='announcement-card'><div class='announcement-card-head'><h3>" + esc(item.title || "Объявление") + "</h3><time>" + esc(dateLabel(item.publishedAt)) + "</time></div><div class='announcement-body'>" + esc(item.content || "").replace(/\r?\n/g, "<br>") + "</div></article>";
      }).join("");
    var hero = app.querySelector(".hero");
    if (hero) hero.insertAdjacentElement("afterend", panel);
    else app.insertBefore(panel, app.firstChild);
  };

  var originalEditor = window.renderCourseEditorPage;
  if (originalEditor) window.renderCourseEditorPage = function () {
    originalEditor.apply(this, arguments);
    if (!isTeacher()) return;
    var app = document.getElementById("app");
    var courseSelect = document.getElementById("editorCourse");
    if (!app || !courseSelect) return;

    var panel = document.createElement("section");
    panel.className = "module announcement-editor";
    panel.innerHTML = "<div class='announcement-heading'><div><div class='announcement-kicker'>СВЯЗЬ СО СТУДЕНТАМИ</div><h2>📢 Объявления по дисциплине</h2></div></div>" +
      "<p class='announcement-help'>Опубликуйте сообщение для студентов выбранного предмета. Объявление увидят только пользователи, которым назначена эта дисциплина.</p>" +
      "<label for='announcementTitle'>Заголовок</label><input id='announcementTitle' class='self-input' maxlength='120' placeholder='Например: Перенос практического занятия'>" +
      "<label for='announcementBody'>Текст объявления</label><textarea id='announcementBody' class='self-input' rows='5' maxlength='5000' placeholder='Напишите сообщение для студентов…'></textarea>" +
      "<div class='announcement-actions'><button class='btn' id='saveAnnouncement'>Опубликовать объявление</button><button class='btn ghost' id='cancelAnnouncement' type='button'>Очистить</button><span id='announcementStatus' aria-live='polite'></span></div>" +
      "<div class='announcement-existing'><h3>Опубликованные объявления</h3><div id='announcementList'>Загрузка…</div></div>";
    app.appendChild(panel);

    var $ = function (id) { return document.getElementById(id); };
    var editId = "";
    function clearForm() {
      editId = "";
      $("announcementTitle").value = "";
      $("announcementBody").value = "";
      $("saveAnnouncement").textContent = "Опубликовать объявление";
      $("announcementStatus").textContent = "";
    }
    function renderList() {
      if (!document.getElementById("announcementList")) return;
      var items = announcements(courseSelect.value);
      $("announcementList").innerHTML = items.length ? items.map(function (item) {
        return "<article class='announcement-manage-item'><div><b>" + esc(item.title || "Объявление") + "</b><time>" + esc(dateLabel(item.publishedAt)) + "</time><p>" + esc(item.content || "").replace(/\r?\n/g, "<br>") + "</p></div><div class='announcement-manage-actions'><button class='btn ghost edit-announcement' data-id='" + esc(item.id) + "'>Изменить</button><button class='btn ghost delete-announcement' data-id='" + esc(item.id) + "'>Удалить</button></div></article>";
      }).join("") : "<p class='announcement-empty'>Для этой дисциплины объявлений пока нет.</p>";
      $("announcementList").querySelectorAll(".edit-announcement").forEach(function (button) {
        button.onclick = function () {
          var item = items.find(function (x) { return x.id === button.dataset.id; });
          if (!item) return;
          editId = item.id;
          $("announcementTitle").value = item.title || "";
          $("announcementBody").value = item.content || "";
          $("saveAnnouncement").textContent = "Сохранить изменения";
          $("announcementStatus").textContent = "Вы редактируете опубликованное объявление.";
          $("announcementTitle").focus();
        };
      });
      $("announcementList").querySelectorAll(".delete-announcement").forEach(function (button) {
        button.onclick = function () {
          var item = items.find(function (x) { return x.id === button.dataset.id; });
          if (!item || !window.confirm("Удалить объявление «" + item.title + "»?")) return;
          button.disabled = true;
          window.API.deleteCustomContent(item.id).then(function (result) {
            if (!result.success) throw new Error(result.error || "Не удалось удалить объявление.");
            return new Promise(function (resolve) { window.loadGlobalCustomContent(resolve); });
          }).then(function () { if (editId === item.id) clearForm(); renderList(); })
            .catch(function (error) { $("announcementStatus").textContent = error.message; button.disabled = false; });
        };
      });
    }
    function reload() {
      $("announcementList").textContent = "Загрузка…";
      if (window.loadGlobalCustomContent) window.loadGlobalCustomContent(renderList);
      else renderList();
    }
    $("saveAnnouncement").onclick = function () {
      var title = $("announcementTitle").value.trim(), body = $("announcementBody").value.trim();
      if (!title || !body) { $("announcementStatus").textContent = "Заполните заголовок и текст объявления."; return; }
      var button = $("saveAnnouncement");
      button.disabled = true;
      $("announcementStatus").textContent = "Сохранение…";
      window.API.saveCustomContent({
        id: editId || ("announcement-" + Date.now()),
        mdkId: courseSelect.value,
        type: "announcement",
        title: title,
        content: body,
        publishedAt: new Date().toISOString()
      }).then(function (result) {
        if (!result.success) throw new Error(result.error || "Не удалось сохранить объявление.");
        clearForm();
        return new Promise(function (resolve) { window.loadGlobalCustomContent(resolve); });
      }).then(function () {
        $("announcementStatus").textContent = "Объявление опубликовано ✓";
        renderList();
      }).catch(function (error) { $("announcementStatus").textContent = error.message; })
        .finally(function () { button.disabled = false; });
    };
    $("cancelAnnouncement").onclick = clearForm;
    courseSelect.addEventListener("change", function () { clearForm(); reload(); });
    reload();
  };
})();