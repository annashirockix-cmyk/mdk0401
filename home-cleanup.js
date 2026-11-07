"use strict";
(function () {
  function cleanHome() {
    var app = document.getElementById("app");
    if (!app) return;

    // Убираем повторяющиеся панели: выбор дисциплины уже есть в верхней панели.
    ["nextgenStartPanel", "workbookPanel"].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) node.remove();
    });

    Array.from(app.querySelectorAll(".module")).forEach(function (panel) {
      var heading = panel.querySelector("h2,h3,h4");
      var title = heading ? heading.textContent.trim().toLowerCase() : "";
      if (title.indexOf("подключаемые учебные курсы") === 0) panel.remove();
    });

    Array.from(app.querySelectorAll("a,button")).forEach(function (node) {
      var label = (node.textContent || "").trim().toLowerCase();
      if (label.indexOf("редактор курса и объявлений") >= 0) node.remove();
    });

    var hero = app.querySelector(".hero");
    if (!hero) return;

    // Удаляем дублирующую горизонтальную панель предметов из заголовка.
    Array.from(hero.querySelectorAll("button")).forEach(function (button) {
      if ((button.getAttribute("onclick") || "").indexOf("activeCourseId") >= 0) {
        var parent = button.parentElement;
        button.remove();
        if (parent && parent !== hero && !parent.textContent.trim() && !parent.children.length) parent.remove();
      }
    });

    var oldAction = hero.querySelector("#activeCourseWorkbook");
    if (oldAction) oldAction.remove();

    var courseId = String((window.state && window.state.activeCourseId) || "");
    if (courseId && window.MDK_DATA && window.MDK_DATA[courseId] && typeof window.openWorkbook === "function") {
      var action = document.createElement("div");
      action.id = "activeCourseWorkbook";
      action.style.cssText = "margin-top:18px;display:flex;align-items:center;gap:10px;flex-wrap:wrap";
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn ghost";
      button.textContent = "📘 Рабочая тетрадь по выбранному предмету";
      button.style.cssText = "padding:9px 14px;font-size:13px";
      button.addEventListener("click", function () {
        window.openWorkbook(courseId);
      });
      var hint = document.createElement("span");
      hint.textContent = "PDF или HTML";
      hint.style.cssText = "font-size:12px;opacity:.75";
      action.appendChild(button);
      action.appendChild(hint);
      hero.appendChild(action);
    }
  }

  var original = window.renderHomePage;
  if (typeof original === "function") {
    window.renderHomePage = function () {
      var result = original.apply(this, arguments);
      cleanHome();
      return result;
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanHome);
  } else {
    cleanHome();
  }
  window.addEventListener("hashchange", function () {
    if ((location.hash || "#/") === "#/" || location.hash === "") {
      window.setTimeout ? window.setTimeout(cleanHome, 0) : cleanHome();
    }
  });
})();