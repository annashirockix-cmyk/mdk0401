/**
 * Сетевые комнаты для Бредовухи и Дурака — по той же схеме, что Мафия:
 * createGameRoom / joinGameRoom / getGameRoom / updateGameRoom / sendGameAction / polling.
 * Ведущий (host) держит авторитетное состояние; остальные только шлют действия.
 */
"use strict";
(function () {
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function apiReady() {
    return window.API && window.API.createGameRoom && window.API.getGameRoom && window.API.updateGameRoom && window.API.sendGameAction;
  }
  function account() {
    var s = window.state || {};
    var u = s.student || s.staff || {};
    return {
      email: String(u.email || "").toLowerCase(),
      name: u.name || u.email || "Игрок",
      id: String(u.email || u.name || "anon").toLowerCase()
    };
  }

  function inviteUrl(game, code) {
    var base = (location.origin || "") + (location.pathname || "/").replace(/index\.html$/, "");
    return base + "#/games?join=" + encodeURIComponent(code) + "&g=" + encodeURIComponent(game || "");
  }
  function initials(name) {
    var p = String(name || "?").trim().split(/\s+/);
    return ((p[0] && p[0][0]) || "?") + ((p[1] && p[1][0]) || "");
  }
  function rosterHtml(players, scores) {
    return (players || []).map(function (p, i) {
      var sc = scores && scores[p.id] != null ? " · " + scores[p.id] + " очк." : "";
      var online = p.lastSeen && Date.now() - p.lastSeen < 12000;
      return (
        "<li class=\"gv-enter\" style=\"animation-delay:" + (i * 0.05) + "s\">" +
        "<span class=\"net-avatar\">" + esc(initials(p.name)) +
        (online ? "<span class=\"online-dot\" title=\"в сети\"></span>" : "") +
        "</span><span><b>" + esc(p.name) + "</b>" + esc(sc) + "</span></li>"
      );
    }).join("");
  }

  function noticeEl(container, msg) {
    var n = container.querySelector("#netNotice");
    if (n) n.textContent = msg || "";
  }
  function shell(container, html) {
    if (!container || !document.body.contains(container)) return;
    container.innerHTML = html;
  }

  /* ========== ОБЩИЙ ЛОББИ-ХЕЛПЕР ========== */
  function makeNetGame(opts) {
    var title = opts.title;
    var minPlayers = opts.minPlayers || 2;
    var maxPlayers = opts.maxPlayers || 8;
    var onHostTick = opts.onHostTick; // (state, actions) -> mutated state
    var renderHost = opts.renderHost;
    var renderPlayer = opts.renderPlayer;
    var initState = opts.initState; // () -> state object
    var onStart = opts.onStart; // (state) -> void

    return function (container) {
      var timer = null,
        roomCode = "",
        isHost = false,
        hostState = null,
        busy = false,
        pollBusy = false,
        actionCursor = 0,
        self = account();

      function stop() {
        if (timer) clearInterval(timer);
        timer = null;
      }
      window.stopCurrentGame = stop;

      function beginPolling() {
        stop();
        timer = setInterval(poll, 1600);
        poll();
      }

      function lobby() {
        shell(
          container,
          '<div class="netgame gv-enter"><div class="party-kicker">КООПЕРАТИВ · РАЗНЫЕ УСТРОЙСТВА</div><h2>' +
            esc(title) +
            '</h2><p>Как в Мафии: один создаёт комнату, остальные заходят <b>с телефона или другого ПК</b> по коду или ссылке. Нужен вход в портал.</p>' +
            '<div class="net-actions"><button class="btn" id="netCreate">✨ Создать комнату (ведущий)</button></div>' +
            '<div class="net-join"><input id="netCode" maxlength="6" placeholder="КОД" autocomplete="off">' +
            '<button class="btn" id="netJoin">Войти по коду</button></div>' +
            '<p class="net-muted">Игроков: ' +
            minPlayers +
            "–" +
            maxPlayers +
            ' · синхронизация ~1.5 с</p><div id="netNotice" class="net-notice"></div></div>'
        );
        container.querySelector("#netCreate").onclick = createRoom;
        container.querySelector("#netJoin").onclick = function () {
          joinRoom(container.querySelector("#netCode").value);
        };
        container.querySelector("#netCode").addEventListener("input", function () {
          this.value = this.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
        });
        if (!apiReady()) noticeEl(container, "Сетевой API недоступен. Проверьте развёртывание Code.gs.");
        else if (!sessionStorage.getItem("mdk.session") && !(window.state && (window.state.student || window.state.staff)))
          noticeEl(container, "Сначала войдите в учебный портал.");
      }

      async function createRoom() {
        if (busy) return;
        busy = true;
        try {
          if (!apiReady()) throw new Error("Сетевой API не подключён.");
          var r = await window.API.createGameRoom({ game: opts.gameId, maxPlayers: maxPlayers });
          if (!r || !r.success) throw new Error((r && r.error) || "Не удалось создать комнату.");
          roomCode = r.code; window.__lastRoomCode = roomCode;
          isHost = true;
          hostState = r.state || initState();
          if (!hostState.players) hostState.players = [];
          if (!hostState.phase) hostState.phase = "lobby";
          if (!hostState.game) hostState.game = opts.gameId;
          hostState.hostEmail = self.email;
          // ensure host in roster
          if (!hostState.players.some(function (p) { return p.id === self.id || p.email === self.email; })) {
            hostState.players.push({ id: self.id, email: self.email, name: self.name, alive: true });
          }
          actionCursor = 0;
          await window.API.updateGameRoom(roomCode, hostState);
          beginPolling();
          render();
        } catch (e) {
          noticeEl(container, e.message || String(e));
        }
        busy = false;
      }

      async function joinRoom(code) {
        if (busy) return;
        busy = true;
        code = String(code || "").trim().toUpperCase();
        try {
          if (!code) throw new Error("Введите код комнаты.");
          var r = await window.API.joinGameRoom({ code: code });
          if (!r || !r.success) throw new Error((r && r.error) || "Не удалось войти.");
          roomCode = code; window.__lastRoomCode = roomCode;
          isHost = !!r.isHost;
          if (r.selfId) self.id = String(r.selfId);
          if (r.lastActionId) actionCursor = Number(r.lastActionId) || 0;
          hostState = r.state || {};
          beginPolling();
          render();
        } catch (e) {
          noticeEl(container, e.message || String(e));
        }
        busy = false;
      }

      async function poll() {
        if (pollBusy || !roomCode) return;
        pollBusy = true;
        try {
          var r = await window.API.getGameRoom(roomCode);
          if (r && r.success && r.state) {
            hostState = r.state;
            if (r.selfId) self.id = String(r.selfId);
            // presence heartbeat
            var me = self;
            if (hostState.players) {
              hostState.players.forEach(function (p) {
                if (p.id === me.id || p.email === me.email) p.lastSeen = Date.now();
              });
            }
            if (isHost && onHostTick) {
              var acts = await window.API.getGameActions(roomCode, actionCursor);
              if (acts && acts.success && acts.actions && acts.actions.length) {
                acts.actions.forEach(function (a) {
                  onHostTick(hostState, a);
                  actionCursor = Math.max(actionCursor, Number(a.id) || 0);
                });
              }
              if (isHost) await window.API.updateGameRoom(roomCode, hostState);
            } else if (isHost) {
              await window.API.updateGameRoom(roomCode, hostState);
            }
            render();
          }
        } catch (e) {
          noticeEl(container, e.message || String(e));
        }
        pollBusy = false;
      }

      async function persist() {
        if (isHost && hostState && roomCode) {
          try {
            await window.API.updateGameRoom(roomCode, hostState);
          } catch (e) {
            noticeEl(container, "Сохранение: " + (e.message || e));
          }
        }
      }

      async function leave() {
        try {
          if (roomCode) await window.API.leaveGameRoom(roomCode);
        } catch (e) {}
        stop();
        roomCode = "";
        isHost = false;
        hostState = null;
        lobby();
      }

      function render() {
        if (!hostState) return lobby();
        if (isHost) renderHost(container, hostState, helpers);
        else renderPlayer(container, hostState, helpers);
      }

      var helpers = {
        roomCode: function () { return roomCode; },
        self: self,
        isHost: function () { return isHost; },
        persist: persist,
        leave: leave,
        notice: function (m) { noticeEl(container, m); },
        startGame: function () {
          if (!isHost) return;
          if ((hostState.players || []).length < minPlayers) {
            noticeEl(container, "Нужно минимум " + minPlayers + " игроков.");
            return;
          }
          if (onStart) onStart(hostState);
          persist().then(render);
        },
        send: async function (type, payload) {
          try {
            await window.API.sendGameAction({ code: roomCode, type: type, payload: payload || {} });
            noticeEl(container, "Отправлено.");
          } catch (e) {
            noticeEl(container, e.message || String(e));
          }
        },
        copyCode: function () {
          if (navigator.clipboard) navigator.clipboard.writeText(roomCode);
          noticeEl(container, "Код " + roomCode + " скопирован.");
        },
        copyInvite: function () {
          var url = inviteUrl(opts.gameId, roomCode);
          if (navigator.clipboard) navigator.clipboard.writeText(url);
          noticeEl(container, "Ссылка-приглашение скопирована — откройте с другого устройства.");
        }
      };

      lobby();
    };
  }

  /* ========== БРЕДОВУХА ОНЛАЙН ========== */
  var BREDO_PROMPTS = [
    "Почему в столовой исчезли все ложки?",
    "Зачем технолог принёс на смену аквариум?",
    "Почему станок с ЧПУ начал петь гимн?",
    "Откуда на чертеже появился кот?",
    "Почему охрана отказалась пускать группу ТМ-4-3?",
    "Зачем в паспорте станка написано «не кормить после полуночи»?",
    "Почему СОЖ внезапно стала розовой?",
    "Куда пропал ключ от патрона и почему он нашёлся в холодильнике?"
  ];

  function playerById(state, id) {
    return (state.players || []).find(function (p) {
      return p.id === id || p.email === id;
    });
  }

  window.startBredoNetwork = makeNetGame({
    title: "🤪 Бредовуха онлайн",
    gameId: "bredo",
    minPlayers: 3,
    maxPlayers: 8,
    initState: function () {
      return { game: "bredo", phase: "lobby", players: [], scores: {}, round: 0, prompt: "", answers: {}, votes: {}, log: [] };
    },
    onStart: function (st) {
      st.phase = "write";
      st.round = 1;
      st.scores = {};
      (st.players || []).forEach(function (p) {
        st.scores[p.id] = 0;
      });
      st.prompt = BREDO_PROMPTS[Math.floor(Math.random() * BREDO_PROMPTS.length)];
      st.answers = {};
      st.votes = {};
      st.log = ["Раунд 1. Придумайте объяснение."];
    },
    onHostTick: function (st, action) {
      var type = String(action.type || "");
      var email = String(action.email || "").toLowerCase();
      var payload = action.payload || {};
      var pl = playerById(st, email) || playerById(st, payload.playerId);
      if (!pl) return;
      if (st.phase === "write" && type === "bredo_answer") {
        var text = String(payload.text || "").trim().slice(0, 280);
        if (text) st.answers[pl.id] = text;
        var need = (st.players || []).length;
        if (Object.keys(st.answers).length >= need) {
          st.phase = "vote";
          st.votes = {};
          st.log.push("Все ответы сданы. Голосование!");
        }
      } else if (st.phase === "vote" && type === "bredo_vote") {
        var target = String(payload.target || "");
        if (target && target !== pl.id && st.answers[target]) st.votes[pl.id] = target;
        if (Object.keys(st.votes).length >= (st.players || []).length) {
          // tally
          var tally = {};
          Object.keys(st.votes).forEach(function (v) {
            var t = st.votes[v];
            tally[t] = (tally[t] || 0) + 1;
          });
          Object.keys(tally).forEach(function (t) {
            st.scores[t] = (st.scores[t] || 0) + tally[t];
          });
          st.phase = "result";
          st.lastTally = tally;
          st.log.push("Раунд " + st.round + " завершён.");
        }
      } else if (st.phase === "result" && type === "bredo_next" && email === String(st.hostEmail || "").toLowerCase()) {
        if (st.round >= 5) {
          st.phase = "ended";
          st.log.push("Игра окончена!");
        } else {
          st.round++;
          st.phase = "write";
          st.prompt = BREDO_PROMPTS[Math.floor(Math.random() * BREDO_PROMPTS.length)];
          st.answers = {};
          st.votes = {};
          st.lastTally = null;
          st.log.push("Раунд " + st.round);
        }
      }
    },
    renderHost: function (container, st, h) {
      var players = st.players || [];
      var roster = players
        .map(function (p) {
          return "<li>" + esc(p.name) + (st.scores && st.scores[p.id] != null ? " — " + st.scores[p.id] + " очк." : "") + "</li>";
        })
        .join("");
      var body = "";
      if (st.phase === "lobby") {
        body =
          "<h3>Участники (" +
          players.length +
          ")</h3><ul class=\"net-roster\">" +
          (roster || "<li>Пока никого</li>") +
          "</ul><button class=\"btn\" id=\"netStart\">Начать игру</button>";
      } else if (st.phase === "write") {
        body =
          "<div class=\"net-phase\">✍️ РАУНД " +
          st.round +
          "</div><p><b>Ситуация:</b> " +
          esc(st.prompt) +
          "</p><p>Ответов: " +
          Object.keys(st.answers || {}).length +
          " / " +
          players.length +
          "</p><p class=\"net-muted\">Ждём версии от всех игроков…</p>";
      } else if (st.phase === "vote") {
        body =
          "<div class=\"net-phase\">🗳️ ГОЛОСОВАНИЕ</div><p>Игроки выбирают самую смешную версию.</p><p>Голосов: " +
          Object.keys(st.votes || {}).length +
          " / " +
          players.length +
          "</p>";
      } else if (st.phase === "result") {
        var lines = Object.keys(st.answers || {})
          .map(function (id) {
            var p = playerById(st, id);
            var pts = (st.lastTally && st.lastTally[id]) || 0;
            return "<div class=\"case-clue\"><b>" + esc(p ? p.name : id) + " (+" + pts + ")</b><p>" + esc(st.answers[id]) + "</p></div>";
          })
          .join("");
        body =
          "<div class=\"net-phase\">📊 ИТОГ РАУНДА</div>" +
          lines +
          '<button class="btn" id="netNext">' +
          (st.round >= 5 ? "Завершить игру" : "Следующий раунд") +
          "</button>";
      } else {
        var ranking = players.slice().sort(function (a, b) {
          return (st.scores[b.id] || 0) - (st.scores[a.id] || 0);
        });
        body =
          "<h3>🏁 Финал</h3>" +
          ranking
            .map(function (p, i) {
              return "<p><b>" + (i + 1) + ". " + esc(p.name) + "</b> — " + (st.scores[p.id] || 0) + " очк.</p>";
            })
            .join("") +
          '<button class="btn ghost" id="netLeave2">В лобби</button>';
      }
      shell(
        container,
        '<div class="netgame"><div class="net-head"><div><h2>🤪 Бредовуха · ' +
          esc(h.roomCode()) +
          '</h2><span class="net-muted">Вы ведущий</span></div><div class="net-invite-row"><button class="btn ghost" id="netCopy">📋 Код</button><button class="btn ghost" id="netInvite">🔗 Ссылка</button></div></div>' +
          body +
          '<div class="net-log">' +
          (st.log || [])
            .slice(-4)
            .map(function (x) {
              return "<p>" + esc(x) + "</p>";
            })
            .join("") +
          '</div><button class="btn ghost" id="netLeave">Покинуть</button><div id="netNotice" class="net-notice"></div></div>'
      );
      var cp = container.querySelector("#netCopy");
      if (cp) cp.onclick = h.copyCode;
      var stBtn = container.querySelector("#netStart");
      if (stBtn) stBtn.onclick = h.startGame;
      var nx = container.querySelector("#netNext");
      if (nx)
        nx.onclick = function () {
          // The host is authoritative: persist the next phase directly. Do not enqueue a second action.
          if (st.round >= 5) {
            st.phase = "ended";
          } else {
            st.round++;
            st.phase = "write";
            st.prompt = BREDO_PROMPTS[Math.floor(Math.random() * BREDO_PROMPTS.length)];
            st.answers = {};
            st.votes = {};
            st.lastTally = null;
            st.log.push("Раунд " + st.round);
          }
          h.persist().then(function () {
            /* render via poll */
          });
        };
      var lv = container.querySelector("#netLeave") || container.querySelector("#netLeave2");
      if (lv) lv.onclick = h.leave;
    },
    renderPlayer: function (container, st, h) {
      var me = h.self;
      var myAns = (st.answers || {})[me.id];
      var body = "";
      if (st.phase === "lobby") {
        body = "<p>Ожидайте старта. Ведущий запустит игру.</p>";
      } else if (st.phase === "write") {
        body =
          "<div class=\"net-phase\">✍️ РАУНД " +
          st.round +
          '</div><p><b>Ситуация:</b> ' +
          esc(st.prompt) +
          "</p>";
        if (myAns) body += "<p class=\"net-muted\">Ваш ответ отправлен ✓</p><p>" + esc(myAns) + "</p>";
        else
          body +=
            '<textarea id="bredoText" rows="3" maxlength="280" placeholder="Ваша самая убедительная нелепость…"></textarea><button class="btn" id="bredoSend">Отправить</button>';
      } else if (st.phase === "vote") {
        if ((st.votes || {})[me.id]) body = "<p>Вы уже проголосовали ✓</p>";
        else {
          body =
            "<div class=\"net-phase\">🗳️ ГОЛОСОВАНИЕ</div><p>Выберите лучшую версию (не свою):</p>" +
            Object.keys(st.answers || {})
              .filter(function (id) {
                return id !== me.id;
              })
              .map(function (id) {
                var p = playerById(st, id);
                return (
                  '<button class="btn ghost net-target" data-target="' +
                  esc(id) +
                  '" style="display:block;width:100%;text-align:left;margin:6px 0"><b>' +
                  esc(p ? p.name : id) +
                  "</b><br>" +
                  esc(st.answers[id]) +
                  "</button>"
                );
              })
              .join("");
        }
      } else if (st.phase === "result" || st.phase === "ended") {
        body =
          "<h3>" +
          (st.phase === "ended" ? "🏁 Финал" : "📊 Итог раунда") +
          "</h3>" +
          Object.keys(st.answers || {})
            .map(function (id) {
              var p = playerById(st, id);
              return "<p><b>" + esc(p ? p.name : id) + "</b>: " + esc(st.answers[id]) + " — " + ((st.scores && st.scores[id]) || 0) + " очк.</p>";
            })
            .join("");
      }
      shell(
        container,
        '<div class="netgame"><div class="net-head"><div><h2>🤪 Бредовуха · ' +
          esc(h.roomCode()) +
          '</h2></div></div>' +
          body +
          '<button class="btn ghost" id="netLeave">Покинуть</button><div id="netNotice" class="net-notice"></div></div>'
      );
      var send = container.querySelector("#bredoSend");
      if (send)
        send.onclick = function () {
          var t = container.querySelector("#bredoText");
          h.send("bredo_answer", { text: t ? t.value : "", playerId: me.id });
        };
      container.querySelectorAll(".net-target").forEach(function (b) {
        b.onclick = function () {
          h.send("bredo_vote", { target: b.getAttribute("data-target"), playerId: me.id });
        };
      });
      var lv = container.querySelector("#netLeave");
      if (lv) lv.onclick = h.leave;
    }
  });

  /* ========== ДУРАК ОНЛАЙН (упрощённый подкидной, host-авторитет) ========== */
  var RANKS = ["6", "7", "8", "9", "10", "В", "Д", "К", "Т"];
  var SUITS = ["♣", "♦", "♥", "♠"];

  function newDeck() {
    var d = [];
    RANKS.forEach(function (r) {
      SUITS.forEach(function (s) {
        d.push({ r: r, s: s });
      });
    });
    for (var i = d.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = d[i];
      d[i] = d[j];
      d[j] = t;
    }
    return d;
  }
  function cardStr(c) {
    return c.r + c.s;
  }
  function beats(att, def, trump) {
    return (def.s === att.s && RANKS.indexOf(def.r) > RANKS.indexOf(att.r)) || (def.s === trump && att.s !== trump);
  }

  window.startDurakNetwork = makeNetGame({
    title: "🃏 Дурак онлайн",
    gameId: "durak",
    minPlayers: 2,
    maxPlayers: 4,
    initState: function () {
      return { game: "durak", phase: "lobby", players: [], deck: [], table: [], trump: "", attacker: 0, defender: 1, log: [], message: "" };
    },
    onStart: function (st) {
      var deck = newDeck();
      st.trump = deck[deck.length - 1].s;
      st.players.forEach(function (p) {
        p.hand = [];
        p.alive = true;
      });
      for (var i = 0; i < 6; i++) {
        st.players.forEach(function (p) {
          if (deck.length) p.hand.push(deck.shift());
        });
      }
      st.deck = deck;
      st.table = [];
      st.attacker = 0;
      st.defender = 1 % st.players.length;
      st.phase = "attack";
      st.message = "Козырь: " + st.trump + ". Ходит " + st.players[0].name;
      st.log = ["Раздача завершена. Козырь " + st.trump];
    },
    onHostTick: function (st, action) {
      if (st.phase === "lobby" || st.phase === "ended") return;
      var type = String(action.type || "");
      var email = String(action.email || "").toLowerCase();
      var payload = action.payload || {};
      var idx = (st.players || []).findIndex(function (p) {
        return p.id === email || p.email === email || p.id === payload.playerId;
      });
      if (idx < 0) return;
      var pl = st.players[idx];

      if (type === "durak_attack" && st.phase === "attack" && idx === st.attacker) {
        var ci = Number(payload.cardIndex);
        if (isNaN(ci) || ci < 0 || ci >= pl.hand.length) return;
        var card = pl.hand[ci];
        if (st.table.length) {
          var ranksOnTable = {};
          st.table.forEach(function (x) {
            ranksOnTable[x.attack.r] = 1;
            if (x.defense) ranksOnTable[x.defense.r] = 1;
          });
          if (!ranksOnTable[card.r]) return; // can only throw matching ranks
        }
        pl.hand.splice(ci, 1);
        st.table.push({ attack: card, defense: null });
        st.phase = "defend";
        st.message = st.players[st.defender].name + " отбивается";
      } else if (type === "durak_defend" && st.phase === "defend" && idx === st.defender) {
        var di = Number(payload.cardIndex);
        if (isNaN(di) || di < 0 || di >= pl.hand.length) return;
        var target = st.table.find(function (x) {
          return !x.defense;
        });
        if (!target) return;
        var dc = pl.hand[di];
        if (!beats(target.attack, dc, st.trump)) return;
        pl.hand.splice(di, 1);
        target.defense = dc;
        if (st.table.every(function (x) { return !!x.defense; })) {
          // all beaten — attacker may throw more or done
          st.phase = "attack";
          st.message = "Можно подкинуть или закончить атаку";
        }
      } else if (type === "durak_take" && st.phase === "defend" && idx === st.defender) {
        st.table.forEach(function (x) {
          pl.hand.push(x.attack);
          if (x.defense) pl.hand.push(x.defense);
        });
        st.table = [];
        // refill
        refillHands(st);
        st.attacker = st.defender;
        st.defender = nextWithCards(st, st.attacker);
        st.phase = "attack";
        st.message = pl.name + " забрал карты. Ходит " + st.players[st.attacker].name;
        checkDurakEnd(st);
      } else if (type === "durak_done" && st.phase === "attack" && idx === st.attacker) {
        if (st.table.some(function (x) { return !x.defense; })) return;
        if (!st.table.length) return;
        st.table = [];
        refillHands(st);
        var oldAtt = st.attacker;
        st.attacker = st.defender;
        st.defender = nextWithCards(st, st.attacker);
        st.phase = "attack";
        st.message = "Отбито. Ходит " + st.players[st.attacker].name;
        checkDurakEnd(st);
      }
    },
    renderHost: renderDurakView,
    renderPlayer: renderDurakView
  });

  function refillHands(st) {
    var order = [];
    for (var s = 0; s < st.players.length; s++) order.push((st.attacker + s) % st.players.length);
    order.forEach(function (i) {
      var p = st.players[i];
      while (p.hand.length < 6 && st.deck.length) p.hand.push(st.deck.shift());
    });
  }
  function nextWithCards(st, from) {
    for (var s = 1; s <= st.players.length; s++) {
      var i = (from + s) % st.players.length;
      if (st.players[i].hand.length) return i;
    }
    return from;
  }
  function checkDurakEnd(st) {
    var withCards = st.players.filter(function (p) {
      return p.hand.length > 0;
    });
    if (st.deck.length === 0 && withCards.length <= 1) {
      st.phase = "ended";
      st.winner = withCards.length ? withCards[0].name : null;
      st.message = st.winner ? "Дурак: " + st.winner : "Ничья";
      st.log.push(st.message);
    }
  }

  function renderDurakView(container, st, h) {
    var me = h.self;
    var myIdx = (st.players || []).findIndex(function (p) {
      return p.id === me.id || p.email === me.email;
    });
    var myHand = myIdx >= 0 ? st.players[myIdx].hand || [] : [];
    var isAtt = myIdx === st.attacker && st.phase === "attack";
    var isDef = myIdx === st.defender && st.phase === "defend";
    var tableHtml = (st.table || [])
      .map(function (x) {
        return (
          '<span class="durak-pair">' +
          cardStr(x.attack) +
          (x.defense ? " → " + cardStr(x.defense) : " → ?") +
          "</span>"
        );
      })
      .join(" ");
    var roster = (st.players || [])
      .map(function (p, i) {
        var tag = i === st.attacker ? " ⚔" : i === st.defender ? " 🛡" : "";
        return "<li>" + esc(p.name) + " (" + (p.hand ? p.hand.length : 0) + " карт)" + tag + "</li>";
      })
      .join("");

    var body = "";
    if (st.phase === "lobby") {
      body =
        "<h3>Игроки</h3><ul class=\"net-roster\">" +
        (roster || "<li>—</li>") +
        "</ul>" +
        (h.isHost() ? '<button class="btn" id="netStart">Раздать карты</button>' : "<p>Ждите старта…</p>");
    } else if (st.phase === "ended") {
      body = "<h3>🏁 " + esc(st.message || "Конец") + "</h3>";
    } else {
      body =
        '<div class="net-phase">Козырь: <b>' +
        esc(st.trump) +
        "</b> · колода: " +
        (st.deck ? st.deck.length : 0) +
        "</div><p>" +
        esc(st.message || "") +
        '</p><div class="durak-table">Стол: ' +
        (tableHtml || "пусто") +
        '</div><h4>Участники</h4><ul class="net-roster">' +
        roster +
        "</ul><h4>Ваши карты</h4><div class=\"durak-hand\">" +
        myHand
          .map(function (c, i) {
            return '<button class="btn ghost durak-card" data-i="' + i + '">' + cardStr(c) + "</button>";
          })
          .join("") +
        "</div>";
      if (isAtt)
        body +=
          '<div class="net-controls"><button class="btn" id="durakAttack" disabled>Положить</button><button class="btn ghost" id="durakDone">Закончить атаку</button></div>';
      if (isDef)
        body +=
          '<div class="net-controls"><button class="btn" id="durakDefend" disabled>Отбить</button><button class="btn ghost" id="durakTake">Забрать</button></div>';
    }

    shell(
      container,
      '<div class="netgame"><div class="net-head"><div><h2>🃏 Дурак · ' +
        esc(h.roomCode()) +
        "</h2><span class=\"net-muted\">" +
        (h.isHost() ? "Ведущий" : "Игрок") +
        '</span></div><div class="net-invite-row"><button class="btn ghost" id="netCopy">📋 Код</button><button class="btn ghost" id="netInvite">🔗 Ссылка</button></div></div>' +
        body +
        '<button class="btn ghost" id="netLeave">Покинуть</button><div id="netNotice" class="net-notice"></div></div>'
    );

    var selected = null;
    container.querySelectorAll(".durak-card").forEach(function (b) {
      b.onclick = function () {
        selected = Number(b.getAttribute("data-i"));
        container.querySelectorAll(".durak-card").forEach(function (x) {
          x.style.outline = "";
        });
        b.style.outline = "2px solid var(--accent)";
        var att = container.querySelector("#durakAttack");
        var def = container.querySelector("#durakDefend");
        if (att) att.disabled = false;
        if (def) def.disabled = false;
      };
    });
    var attB = container.querySelector("#durakAttack");
    if (attB)
      attB.onclick = function () {
        if (selected == null) return;
        h.send("durak_attack", { cardIndex: selected, playerId: me.id });
      };
    var defB = container.querySelector("#durakDefend");
    if (defB)
      defB.onclick = function () {
        if (selected == null) return;
        h.send("durak_defend", { cardIndex: selected, playerId: me.id });
      };
    var takeB = container.querySelector("#durakTake");
    if (takeB)
      takeB.onclick = function () {
        h.send("durak_take", { playerId: me.id });
      };
    var doneB = container.querySelector("#durakDone");
    if (doneB)
      doneB.onclick = function () {
        h.send("durak_done", { playerId: me.id });
      };
    var stBtn = container.querySelector("#netStart");
    if (stBtn) stBtn.onclick = h.startGame;
    var cp = container.querySelector("#netCopy");
    if (cp) cp.onclick = h.copyCode;
    var lv = container.querySelector("#netLeave");
    if (lv) lv.onclick = h.leave;
  }

  /* ========== МЕНЮ: кнопки онлайн ========== */
  function patchArcade() {
    var old = window.renderArcadePage;
    if (!old || old.__netParty) return;
    window.renderArcadePage = function () {
      old.apply(this, arguments);
      var app = document.getElementById("app");
      if (!app || app.querySelector("[data-net-party]")) return;
      var grid = app.querySelector("div[style*='grid-template-columns']");
      if (!grid) return;
      [
        ["bredo-net", "🤪 Бредовуха онлайн", "Комната с кодом, как в Мафии. Версии + голосование."],
        ["durak-net", "🃏 Дурак онлайн", "Подкидной дурак 2–4 игрока по сети."],
        ["detective-cases", "🕵️ Детектив: бюро дел", "Несколько дел, загадки, ветвления и разные концовки."]
      ].forEach(function (g) {
        var card = document.createElement("div");
        card.className = "module";
        card.setAttribute("data-net-party", "1");
        card.style.cssText = "cursor:pointer;display:flex;flex-direction:column;justify-content:space-between";
        card.classList.add("gv-game-card");
        card.innerHTML =
          '<div><h3 style="color:var(--accent);margin-top:0">' +
          g[1] +
          ' <span class="gv-badge-online">ONLINE</span></h3><p style="color:var(--muted);font-size:14px">' +
          g[2] +
          '</p></div><button class="btn ghost" style="width:100%">Запустить</button>';
        card.onclick = function () {
          window.startGame(g[0]);
        };
        grid.appendChild(card);
      });
    };
    window.renderArcadePage.__netParty = true;
  }

  var prevStart = window.startGame;
  window.startGame = function (id) {
    if (id === "bredo-net") {
      var app = document.getElementById("app");
      app.innerHTML = '<a class="backlink" href="javascript:void(0)" id="backGames">← К играм</a><div class="module" id="customGame" style="padding:16px"></div>';
      app.querySelector("#backGames").onclick = function () {
        window.renderArcadePage();
      };
      var box = app.querySelector("#customGame");
      window.startBredoNetwork(box);
      try {
        var pend = JSON.parse(sessionStorage.getItem("mdk.pendingJoin") || "null");
        if (pend && pend.code && (pend.game === "bredo-net" || pend.game === "bredo")) {
          sessionStorage.removeItem("mdk.pendingJoin");
          setTimeout(function () {
            var inp = box.querySelector("#netCode");
            if (inp) {
              inp.value = pend.code;
              var bj = box.querySelector("#netJoin");
              if (bj) bj.click();
            }
          }, 400);
        }
      } catch (e) {}
      return;
    }
    if (id === "durak-net") {
      var app2 = document.getElementById("app");
      app2.innerHTML = '<a class="backlink" href="javascript:void(0)" id="backGames">← К играм</a><div class="module" id="customGame" style="padding:16px"></div>';
      app2.querySelector("#backGames").onclick = function () {
        window.renderArcadePage();
      };
      var box2 = app2.querySelector("#customGame");
      window.startDurakNetwork(box2);
      try {
        var pend2 = JSON.parse(sessionStorage.getItem("mdk.pendingJoin") || "null");
        if (pend2 && pend2.code && (pend2.game === "durak-net" || pend2.game === "durak")) {
          sessionStorage.removeItem("mdk.pendingJoin");
          setTimeout(function () {
            var inp = box2.querySelector("#netCode");
            if (inp) {
              inp.value = pend2.code;
              var bj = box2.querySelector("#netJoin");
              if (bj) bj.click();
            }
          }, 400);
        }
      } catch (e) {}
      return;
    }
    if (id === "detective-cases" && window.startDetectiveBureau) {
      window.startDetectiveBureau();
      return;
    }
    if (prevStart) return prevStart.apply(this, arguments);
  };

  // deep-link: #/games?join=CODE&g=bredo
  function tryDeepJoin() {
    try {
      var q = (location.hash.split("?")[1] || "");
      var params = {};
      q.split("&").forEach(function (pair) {
        var kv = pair.split("=");
        if (kv[0]) params[kv[0]] = decodeURIComponent(kv[1] || "");
      });
      if (params.join && params.g) {
        var map = { bredo: "bredo-net", durak: "durak-net", mafia: "mafia", detective: "detective-coop" };
        var gid = map[params.g] || params.g;
        sessionStorage.setItem("mdk.pendingJoin", JSON.stringify({ code: params.join, game: gid }));
      }
    } catch (e) {}
  }
  tryDeepJoin();

  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || t.id !== "netInvite") return;
    var h2 = document.querySelector(".netgame .net-head h2");
    var code = window.__lastRoomCode || "";
    if (h2) {
      var m = h2.textContent.match(/[A-Z0-9]{6}/);
      if (m) code = m[0];
    }
    var g = "bredo";
    if (h2 && /Дурак/i.test(h2.textContent)) g = "durak";
    var url = inviteUrl(g, code || "");
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    var n = document.querySelector("#netNotice");
    if (n) n.textContent = "Ссылка скопирована — откройте на другом устройстве и войдите в портал.";
  });

  patchArcade();
  setTimeout(patchArcade, 800);
  console.log("[network-party-games] ready v2 visual+coop");
})();
