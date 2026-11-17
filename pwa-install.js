(function () {
  "use strict";
  var card = document.getElementById("pwaInstallCard");
  if (!card) return;
  var button = document.getElementById("pwaInstallButton");
  var close = document.getElementById("pwaInstallClose");
  var help = document.getElementById("pwaInstallHelp");
  var status = document.getElementById("pwaInstallStatus");
  var deferredPrompt = null;
  var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;
  if (standalone) return;

  var isAppleMobile = /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  function showHelp() {
    if (isAppleMobile) {
      help.textContent = "На iPhone или iPad нажмите «Поделиться» в Safari, затем «На экран Домой».";
    } else {
      help.textContent = "Если установка не предлагается автоматически, откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран».";
    }
    status.textContent = "Портал можно открыть отдельно от вкладок браузера.";
  }
  function hideCard() { card.hidden = true; }
  button.addEventListener("click", function () {
    if (!deferredPrompt) { showHelp(); return; }
    var promptEvent = deferredPrompt;
    deferredPrompt = null;
    promptEvent.prompt().then(function () {
      return promptEvent.userChoice;
    }).then(function (choice) {
      if (choice && choice.outcome === "accepted") hideCard();
      else status.textContent = "Установка не выполнена. Вы можете повторить её позже из меню браузера.";
    }).catch(function () {
      showHelp();
    });
  });
  close.addEventListener("click", hideCard);
  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    button.textContent = "Установить приложение";
    help.textContent = "Добавьте учебный портал на главный экран или в меню приложений.";
    card.hidden = false;
  });
  window.addEventListener("appinstalled", function () {
    status.textContent = "Учебный портал установлен.";
    hideCard();
  });
  window.addEventListener("load", function () {
    if (!card.hidden || standalone) return;
    if (!deferredPrompt) showHelp();
    card.hidden = false;
  });
})();