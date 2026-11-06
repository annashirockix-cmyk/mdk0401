      if (pend && pend.code && (pend.game === "detective" || pend.game === "detective-coop")) {
        sessionStorage.removeItem("mdk.pendingJoin");
        renderLobby();
        setTimeout(function () { joinRoom(pend.code); }, 200);
        return;
      }
    } catch (e) {}

    renderLobby();
  };

  // alias for games.js
  window.startDetectiveNetwork = function (container) {
    window.startDetectiveCoop(container);
  };

  // menu card
  function patchArcade() {
    var old = window.renderArcadePage;
    if (!old || old.__coopDet) return;
    window.renderArcadePage = function () {
      old.apply(this, arguments);
      var app = document.getElementById("app");
      if (!app || app.querySelector("[data-coop-det]")) return;
      var grid = app.querySelector("div[style*='grid-template-columns']");
      if (!grid) return;
      var card = document.createElement("div");
      card.className = "module gv-game-card";
      card.setAttribute("data-coop-det", "1");
      card.style.cssText = "cursor:pointer;display:flex;flex-direction:column;justify-content:space-between";
      card.innerHTML =
        '<div><h3 style="color:var(--accent);margin-top:0">🕵️ Детектив: кооператив <span class="gv-badge-online">ONLINE</span></h3>' +
        '<p style="color:var(--muted);font-size:14px">Комната по коду · поэтапные улики · ложные следы · чат · разные финалы</p></div>' +
        '<button class="btn ghost" style="width:100%">Запустить</button>';
      card.onclick = function () {
        var box = document.getElementById("app");
        box.innerHTML = '<a class="backlink" href="javascript:void(0)" id="backGames">← К играм</a><div class="module" id="gameContainer" style="padding:16px"></div>';
        box.querySelector("#backGames").onclick = function () { window.renderArcadePage(); };
        window.startDetectiveCoop(box.querySelector("#gameContainer"));
      };
      grid.appendChild(card);
    };
    window.renderArcadePage.__coopDet = true;
  }
  patchArcade();
  setTimeout(patchArcade, 800);
  console.log("[coop-detective] ready");
})();
