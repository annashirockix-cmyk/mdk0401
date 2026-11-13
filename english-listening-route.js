/* Adds a dedicated route without replacing the portal's existing router. */
(function () {
  "use strict";
  if (window._englishListeningRouteInstalled) return;
  if (typeof window.router !== "function") {
    console.error("[English Listening] Main router is not available.");
    return;
  }
  var originalRouter = window.router;
  window.router = function () {
    var route = String(location.hash || "").replace(/^#/, "");
    if (route === "/english-listening") {
      if (window.EnglishListeningCatalogue && window.EnglishListeningCatalogue.render) {
        window.EnglishListeningCatalogue.render();
      } else {
        var app = document.getElementById("app");
        if (app) app.textContent = "Модуль аудирования пока недоступен.";
      }
      return;
    }
    return originalRouter.apply(this, arguments);
  };
  window._englishListeningRouteInstalled = true;
})();
