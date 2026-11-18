(function (root) {
  "use strict";
  var panel, toggle, list, status, total, refreshButton, removeButton, resetButton, closeButton;
  function currentUser() {
    return root.state && (root.state.student || root.state.staff) || null;
  }
  function formatBytes(value) {
    var bytes = Number(value) || 0;
    if (bytes < 1024) return bytes + " Б";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " КБ";
    return (bytes / (1024 * 1024)).toFixed(2) + " МБ";
  }
  function make(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function draw(data) {
    if (!list || !total || !status) return;
    list.textContent = "";
    var items = data && Array.isArray(data.items) ? data.items : [];
    total.textContent = items.length + " материалов · " + formatBytes(data && data.bytes);
    if (!items.length) {
      list.appendChild(make("p", "offline-library-empty", "Сохранённых материалов пока нет. Подключитесь к интернету и обновите список."));
    } else {
      items.forEach(function (item, index) {
        var label = make("label", "offline-library-item");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item.key;
        checkbox.setAttribute("aria-label", "Выбрать " + item.title);
        var copy = make("span", "offline-library-item-copy");
        copy.appendChild(make("strong", "", item.title));
        var typeName = item.type === "lecture" ? "Лекция" : item.type === "file" ? "Файл" : "Тема";
        copy.appendChild(make("small", "", typeName));
        label.appendChild(checkbox);
        label.appendChild(copy);
        list.appendChild(label);
      });
    }
    if (data && data.savedAt) {
      var date = new Date(data.savedAt);
      status.textContent = "Обновлено: " + date.toLocaleString() + ". Срок хранения — до 24 часов.";
    } else status.textContent = "Материалы ещё не сохранены.";
    removeButton.disabled = !items.length;
  }
  function refreshSummary() {
    var user = currentUser();
    if (!user || !root.OfflineMaterialsCache) {
      if (panel) panel.hidden = true;
      if (toggle) toggle.hidden = true;
      return Promise.resolve();
    }
    if (toggle) toggle.hidden = false;
    return root.OfflineMaterialsCache.summary(user).then(draw).catch(function (error) {
      status.textContent = "Не удалось прочитать хранилище: " + (error.message || "ошибка");
    });
  }
  function init() {
    if (document.getElementById("offlineMaterialsToggle")) return;
    toggle = make("button", "offline-library-toggle", "Офлайн-материалы");
    toggle.id = "offlineMaterialsToggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "offlineMaterialsPanel");
    panel = make("section", "offline-library-panel");
    panel.id = "offlineMaterialsPanel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Управление сохранёнными материалами");
    var head = make("div", "offline-library-head");
    var title = make("strong", "", "Материалы на устройстве");
    closeButton = make("button", "offline-library-close", "Свернуть");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Свернуть управление офлайн-материалами");
    head.appendChild(title);
    head.appendChild(closeButton);
    total = make("div", "offline-library-total", "Загрузка…");
    status = make("p", "offline-library-status", "");
    list = make("div", "offline-library-list");
    var actions = make("div", "offline-library-actions");
    refreshButton = make("button", "btn", "Обновить материалы");
    refreshButton.type = "button";
    removeButton = make("button", "btn ghost", "Удалить выбранные");
    removeButton.type = "button";
    resetButton = make("button", "btn ghost", "Сбросить и загрузить всё");
    resetButton.type = "button";
    actions.appendChild(refreshButton);
    actions.appendChild(removeButton);
    actions.appendChild(resetButton);
    panel.appendChild(head);
    panel.appendChild(total);
    panel.appendChild(status);
    panel.appendChild(list);
    panel.appendChild(actions);
    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    toggle.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
      if (!panel.hidden) refreshSummary();
    });
    closeButton.addEventListener("click", function () {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });
    refreshButton.addEventListener("click", function () {
      var user = currentUser();
      if (!user || !root.loadGlobalCustomContent) return;
      refreshButton.disabled = true;
      refreshButton.textContent = "Обновление…";
      root.loadGlobalCustomContent(function () {
        refreshButton.disabled = false;
        refreshButton.textContent = "Обновить материалы";
        refreshSummary();
      });
    });
    resetButton.addEventListener("click", function () {
      var user = currentUser();
      if (!user || !root.OfflineMaterialsCache || !root.loadGlobalCustomContent) return;
      resetButton.disabled = true;
      resetButton.textContent = "Сброс…";
      root.OfflineMaterialsCache.clear(user).then(function () {
        root.loadGlobalCustomContent(function () {
          resetButton.disabled = false;
          resetButton.textContent = "Сбросить и загрузить всё";
          if (root.showToast) root.showToast("Список очищен. Доступные материалы загружены заново.", "success");
          refreshSummary();
        });
      }).catch(function (error) {
        resetButton.disabled = false;
        resetButton.textContent = "Сбросить и загрузить всё";
        if (root.showToast) root.showToast("Не удалось сбросить хранилище: " + (error.message || "ошибка"), "error");
      });
    });
    removeButton.addEventListener("click", function () {
      var user = currentUser();
      if (!user || !root.OfflineMaterialsCache) return;
      var selected = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]:checked'))
        .map(function (input) { return input.value; });
      if (!selected.length) {
        if (root.showToast) root.showToast("Сначала выберите материалы для удаления.", "info");
        return;
      }
      removeButton.disabled = true;
      root.OfflineMaterialsCache.remove(user, selected).then(function () {
        if (root.showToast) root.showToast("Выбранные материалы удалены с этого устройства.", "success");
        return refreshSummary();
      }).catch(function (error) {
        if (root.showToast) root.showToast("Не удалось удалить материалы: " + (error.message || "ошибка"), "error");
      }).then(function () { removeButton.disabled = false; });
    });
    refreshSummary();
  }
  root.OfflineMaterialsUI = { init: init, refresh: refreshSummary };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
