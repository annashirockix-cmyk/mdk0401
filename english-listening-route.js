/* Adds a dedicated route without replacing the portal's existing router. */
(function () {
  "use strict";
  if (window._englishListeningRouteInstalled) return;
  if (typeof window.router !== "function") {
    console.error("[English Listening] Main router is not available.");
    return;
  }
  var originalRouter = window.router;
  function isListeningRoute() {
    return String(location.hash || "").replace(/^#/, "") === "/english-listening";
  }
  function renderListeningRoute() {
    if (window.EnglishListeningCatalogue && window.EnglishListeningCatalogue.render) {
      window.EnglishListeningCatalogue.render();
    } else {
      var app = document.getElementById("app");
      if (app) app.textContent = "Модуль аудирования пока недоступен.";
    }
  }
  window.router = function () {
    if (isListeningRoute()) { renderListeningRoute(); return; }
    return originalRouter.apply(this, arguments);
  };
  // Existing hashchange listeners may hold the old router function reference.
  // Capture phase intercepts this one route before the old generic fallback runs.
  window.addEventListener("hashchange", function (event) {
    if (!isListeningRoute()) return;
    if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
    renderListeningRoute();
  }, true);
  window._englishListeningRouteInstalled = true;
})();
