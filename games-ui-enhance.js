/**
 * Визуал и мобильная адаптация игровой комнаты.
 * Подключается после games.js / party-games*.js
 */
"use strict";
(function () {
  function ensureViewport() {
    var m = document.querySelector('meta[name="viewport"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "viewport";
      document.head.appendChild(m);
    }
    var content = m.getAttribute("content") || "";
    if (content.indexOf("width=device-width") === -1) {
      m.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
      );
    } else if (content.indexOf("viewport-fit") === -1) {
      m.setAttribute("content", content + ", viewport-fit=cover");
    }
  }

  function decorateArcadeCards() {
    var app = document.getElementById("app");
    if (!app) return;
    var grid = app.querySelector('div[style*="grid-template-columns"]');
    if (grid) grid.classList.add("gv-arcade-grid");
    app.querySelectorAll('.module[onclick*="startGame"], .module[data-net-party], .module[data-party-extra]').forEach(function (card, i) {
      card.classList.add("gv-game-card");
      card.style.animationDelay = (Math.min(i, 8) * 0.04) + "s";
    });
  }

  function decorateGameShell() {
    var box = document.getElementById("gameContainer");
    if (box) box.classList.add("gv-game-shell");
  }

  function patchArcade() {
    var prev = window.renderArcadePage;
    if (!prev || prev.__gvUi) return;
    window.renderArcadePage = function () {
      prev.apply(this, arguments);
      setTimeout(decorateArcadeCards, 30);
      setTimeout(decorateArcadeCards, 200);
    };
    window.renderArcadePage.__gvUi = true;
  }

  function patchStartGame() {
    var prev = window.startGame;
    if (!prev || prev.__gvUi) return;
    window.startGame = function (id) {
      var r = prev.apply(this, arguments);
      setTimeout(decorateGameShell, 40);
      setTimeout(function () {
        var box = document.getElementById("gameContainer") || document.querySelector(".netgame, .party-shell, .case-scene");
        if (box && window.matchMedia("(max-width: 720px)").matches) {
          try { box.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { box.scrollIntoView(true); }
        }
      }, 80);
      return r;
    };
    window.startGame.__gvUi = true;
  }

  function boot() {
    ensureViewport();
    patchArcade();
    patchStartGame();
    decorateArcadeCards();
    decorateGameShell();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1500);
  console.log("[games-ui-enhance] visual + mobile ready");
})();
