/* Adds a dedicated route without replacing the portal's existing router. */
(function () {
  "use strict";
  if (window._englishListeningRouteInstalled) return;

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

  // Capture-phase listener runs before the router's existing hashchange listener.
  // This prevents the generic fallback route from immediately replacing the lab page.
  window.addEventListener("hashchange", function (event) {
    if (!isListeningRoute()) return;
    if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
    renderListeningRoute();
  }, true);

  // Support opening the listening route directly in the address bar.
  if (isListeningRoute()) renderListeningRoute();

  window._englishListeningRouteInstalled = true;
})();
