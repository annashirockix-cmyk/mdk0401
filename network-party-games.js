"use strict";
(function () {
  function loadFull() {
    var s = document.createElement("script");
    s.src = "./network-party-games.full.js?v=5";
    s.onerror = function () {
      console.warn("[network-party] full.js not found");
      window.startBredoNetwork = window.startBredoNetwork || function (box) {
        if (box) box.innerHTML = '<div class="netgame"><h2>\u0411\u0440\u0435\u0434\u043e\u0432\u0443\u0445\u0430 \u043e\u043d\u043b\u0430\u0439\u043d</h2><p class="net-muted">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 network-party-games.full.js. \u041b\u043e\u043a\u0430\u043b\u044c\u043d\u0430\u044f \u0432\u0435\u0447\u0435\u0440\u0438\u043d\u043a\u0430 \u0432 \u043c\u0435\u043d\u044e \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442.</p><button class="btn" onclick="window.renderArcadePage&&window.renderArcadePage()">\u2190 \u041d\u0430\u0437\u0430\u0434</button></div>';
      };
      window.startDurakNetwork = window.startDurakNetwork || function (box) {
        if (box) box.innerHTML = '<div class="netgame"><h2>\u0414\u0443\u0440\u0430\u043a \u043e\u043d\u043b\u0430\u0439\u043d</h2><p class="net-muted">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 network-party-games.full.js</p><button class="btn" onclick="window.renderArcadePage&&window.renderArcadePage()">\u2190</button></div>';
      };
    };
    document.head.appendChild(s);
  }
  loadFull();
})();
