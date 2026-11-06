"use strict";
(function () {
  function loadFull() {
    var s = document.createElement("script");
    s.src = "./coop-detective.full.js?v=5";
    s.onerror = function () {
      console.warn("[coop-detective] full.js not found");
      window.startDetectiveCoop = window.startDetectiveCoop || function (box) {
        if (box) box.innerHTML = '<div class="netgame"><h2>\uD83D\uDD75\uFE0F \u0414\u0435\u0442\u0435\u043a\u0442\u0438\u0432 (\u043a\u043e\u043e\u043f)</h2><p class="net-muted">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 coop-detective.full.js \u0438\u0437 \u043f\u0430\u043f\u043a\u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u0430.</p><button class="btn" onclick="window.renderArcadePage&&window.renderArcadePage()">\u2190 \u041d\u0430\u0437\u0430\u0434</button></div>';
      };
      window.startDetectiveNetwork = window.startDetectiveCoop;
    };
    document.head.appendChild(s);
  }
  loadFull();
})();
