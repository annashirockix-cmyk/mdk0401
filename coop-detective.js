/**
 * Кооперативный детектив (как Nancy Drew): комнаты, поэтапные улики,
 * истинные / ложные / нейтральные сведения, чат, разные концовки.
 * Синхронизация через createGameRoom / join / poll / sendGameAction.
 */
"use strict";
(function () {
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function apiReady() {
    return window.API && window.API.createGameRoom && window.API.getGameRoom &&
      window.API.updateGameRoom && window.API.sendGameAction;
  }
  function account() {
    var s = window.state || {};
    var u = s.student || s.staff || {};
    return {
      email: String(u.email || "").toLowerCase(),
      name: u.name || u.email || "Игрок",
      id: String(u.email || u.name || "anon-" + Math.random().toString(36).slice(2, 7)).toLowerCase()
    };
  }
  function inviteUrl(code) {
    var base = (location.origin || "") + (location.pathname || "/").replace(/index\.html$/, "");
    return base + "#/games?join=" + encodeURIComponent(code) + "&g=detective";
  }

  /* ---------- Сюжет ---------- */
  var CASE = {
    title: "Смена, которой не было",
    blurb: "Утром в цехе ЧПУ не оказалось комплекта пластин и флешки с УП. Смена закрыта. Разберитесь, кто и зачем.",
    solution: { culprit: "naladchik", motive: "debt", method: "night" },
    endings: {
      perfect: { title: "Дело раскрыто", text: "Наладчик забрал пластины ночью, чтобы закрыть долг. Флешку подбросил оператору. Команда собрала цепочку улик без ошибок.", xp: 80 },
      good: { title: "Почти идеально", text: "Виновный найден, но часть ложных следов сбила с толку. Руководство всё же закрыло дело.", xp: 50 },
      wrong: { title: "Ошибка следствия", text: "Обвинили не того. Настоящий виновный ушёл. В журнале останется пометка о провале.", xp: 15 },
      partial: { title: "Дело на паузе", text: "Улик хватило только на версию. Нужна ещё одна смена расследования.", xp: 30 }
    },
    roles: [
      { id: "tracker", name: "Следопыт", desc: "Может осматривать комнату на 1 ход быстрее" },
      { id: "analyst", name: "Аналитик", desc: "Может пометить улику как «важно» или «сомнительно»" },
      { id: "talker", name: "Связной", desc: "Сообщения в чате видны ярче; может задать 1 вопрос NPC" },
      { id: "archivist", name: "Архивариус", desc: "Видит скрытую карточку досье один раз за игру" }
    ],
    rooms: [
      {
        id: "shop", name: "Цех ЧПУ", icon: "🏭", unlock: 0,
        objects: [
          { id: "machine", name: "Станок 16К20Ф3", look: "Пульт в режиме MDI. В журнале смены — странный кадр G00 в 02:14.", clue: { id: "c_night_mdi", text: "В 02:14 кто-то гонял станок в MDI", type: "true", tag: "время" } },
          { id: "chips", name: "Поддон стружки", look: "Свежая стружка цвета вчерашней партии. Кто-то работал после закрытия.", clue: { id: "c_chips", text: "Свежая стружка после закрытия смены", type: "true", tag: "факт" } },
          { id: "glove", name: "Перчатка у ограждения", look: "Размер меньше, чем у оператора. Похоже на перчатку наладчика.", clue: { id: "c_glove", text: "Перчатка малого размера у станка", type: "true", tag: "вещь" } },
          { id: "oil", name: "Пятно СОЖ", look: "Обычный разлив. Ничего особенного.", clue: { id: "c_oil", text: "Пятно СОЖ у прохода", type: "neutral", tag: "атмосфера" } }
        ]
      },
      {
        id: "locker", name: "Раздевалка", icon: "👕", unlock: 0,
        objects: [
          { id: "lock_op", name: "Шкафчик оператора", look: "Открыт. Внутри — чистая форма и флешка-пустышка с наклейкой «УП_v3».", clue: { id: "c_fake_usb", text: "В шкафчике оператора флешка-пустышка", type: "false", tag: "подстава" } },
          { id: "lock_nal", name: "Шкафчик наладчика", look: "Заперт. На двери свежий след смазки с цеха.", clue: { id: "c_nal_lock", text: "На шкафчике наладчика свежая смазка со станка", type: "true", tag: "связь" } },
          { id: "bench", name: "Скамейка", look: "Жвачка и квитанция с терминала. Сумма крупная.", clue: { id: "c_receipt", text: "Квитанция о крупном платеже на скамейке", type: "true", tag: "мотив" } },
          { id: "poster", name: "Плакат ОТ", look: "Старый плакат «Работай без перчаток на вращающихся узлах».", clue: { id: "c_poster", text: "Плакат по охране труда", type: "neutral", tag: "декор" } }
        ]
      },
      {
        id: "office", name: "Кабинет мастера", icon: "📋", unlock: 1,
        objects: [
          { id: "journal", name: "Журнал смен", look: "Мастер отметил: «Оператор сдал смену вовремя. Наладчик задерживался».", clue: { id: "c_journal", text: "Наладчик задерживался после смены", type: "true", tag: "алиби" } },
          { id: "pc", name: "ПК мастера", look: "Письмо от снабжения: пластины числятся списанными «по браку».", clue: { id: "c_writeoff", text: "Пластины списаны как брак без акта", type: "true", tag: "документ" } },
          { id: "photo", name: "Фото коллектива", look: "Все улыбаются у нового станка. Дата прошлого года.", clue: { id: "c_photo", text: "Коллективное фото у станка", type: "neutral", tag: "фон" } },
          { id: "note", name: "Записка на столе", look: "«Оператор опять косячит с припусками» — почерк мастера, раздражённый.", clue: { id: "c_blame_op", text: "Мастер винит оператора в браке", type: "false", tag: "слух" } }
        ]
      },
      {
        id: "warehouse", name: "Инструменталка", icon: "🔧", unlock: 1,
        objects: [
          { id: "box", name: "Ячейка пластин", look: "Пусто. Этикетка сорвана. На полу — обрывок с кодом партии NL-17.", clue: { id: "c_batch", text: "Обрывок этикетки партии NL-17", type: "true", tag: "партия" } },
          { id: "cam", name: "Камера (мигает)", look: "Карта памяти вынута. Кто-то знал, как отключить запись.", clue: { id: "c_cam", text: "Из камеры инструменталки вынули карту", type: "true", tag: "сокрытие" } },
          { id: "key", name: "Ключница", look: "Ключ от калитки на месте. Ключ от наладческой тумбы — нет.", clue: { id: "c_key", text: "Нет ключа от тумбы наладчика", type: "true", tag: "доступ" } },
          { id: "rag", name: "Ветошь", look: "Промасленная ветошь без следов чего-либо необычного.", clue: { id: "c_rag", text: "Промасленная ветошь", type: "neutral", tag: "фон" } }
        ]
      },
      {
        id: "gate", name: "Проходная", icon: "🚪", unlock: 2,
        objects: [
          { id: "log", name: "Журнал охраны", look: "В 02:05 отмечен проход наладчика «забыл ключи». Выход — 02:40.", clue: { id: "c_gate", text: "Наладчик был на территории 02:05–02:40", type: "true", tag: "алиби" } },
          { id: "bag", name: "Сумка у турникета", look: "Чужая. Внутри — сменка и пустой контейнер из-под еды.", clue: { id: "c_bag", text: "Брошенная сумка у турникета", type: "false", tag: "отвлечение" } },
          { id: "cam2", name: "Камера двора", look: "Запись есть: фигура с ящиком у калитки. Рост совпадает с наладчиком.", clue: { id: "c_yard", text: "На записи у калитки человек с ящиком", type: "true", tag: "видео" } }
        ]
      }
    ],
    npcs: [
      { id: "operator", name: "Оператор", line: "Я сдал смену и ушёл. Флешку в шкафчик не клал — это подбросили!" },
      { id: "naladchik", name: "Наладчик", line: "Задержался из-за вибрации шпинделя. В инструменталку не заходил." },
      { id: "master", name: "Мастер", line: "Оператор часто спешит. Но ночью цех должен быть пуст." },
      { id: "store", name: "Кладовщик", line: "Пластины по акту ещё вчера были на месте. Камеру я не трогал." }
    ]
  };

  function emptyState(host) {
    return {
      game: "detective-coop",
      phase: "lobby",
      players: [host],
      chat: [],
      found: {},
      marks: {},
      visited: {},
      roles: {},
      stage: 0,
      searchBusy: null,
      theories: {},
      votes: {},
      dossierUsed: {},
      log: ["Комната создана. Ждём игроков."],
      startedAt: null,
      ended: null
    };
  }

  function assignRoles(state) {
    var roles = CASE.roles.slice();
    var players = (state.players || []).slice();
    players.forEach(function (p, i) {
      state.roles[p.id] = roles[i % roles.length].id;
    });
  }

  function unlockedRooms(state) {
    var nFound = Object.keys(state.found || {}).length;
    var stage = 0;
    if (nFound >= 3) stage = 1;
    if (nFound >= 7) stage = 2;
    state.stage = stage;
    return CASE.rooms.filter(function (r) { return r.unlock <= stage; });
  }


  var VIS_META = {
  "shop": {
    "mood": "dim-industrial",
    "desc": "Тусклый свет ламп. Запах СОЖ. Гудение трансформатора.",
    "bg": "shop",
    "spots": [
      {
        "id": "machine",
        "x": 18,
        "y": 42,
        "w": 28,
        "h": 36,
        "icon": "⚙️"
      },
      {
        "id": "chips",
        "x": 52,
        "y": 62,
        "w": 18,
        "h": 18,
        "icon": "🔩"
      },
      {
        "id": "glove",
        "x": 72,
        "y": 48,
        "w": 14,
        "h": 14,
        "icon": "🧤"
      },
      {
        "id": "oil",
        "x": 40,
        "y": 78,
        "w": 16,
        "h": 12,
        "icon": "💧"
      }
    ]
  },
  "locker": {
    "mood": "locker",
    "desc": "Сырость, металлические дверцы, эхо шагов.",
    "bg": "locker",
    "spots": [
      {
        "id": "lock_op",
        "x": 12,
        "y": 30,
        "w": 20,
        "h": 40,
        "icon": "🔓"
      },
      {
        "id": "lock_nal",
        "x": 40,
        "y": 30,
        "w": 20,
        "h": 40,
        "icon": "🔒"
      },
      {
        "id": "bench",
        "x": 68,
        "y": 58,
        "w": 24,
        "h": 18,
        "icon": "🪑"
      },
      {
        "id": "poster",
        "x": 78,
        "y": 18,
        "w": 14,
        "h": 22,
        "icon": "📌"
      }
    ]
  },
  "office": {
    "mood": "office",
    "desc": "Стол завален журналами. Монитор мигает.",
    "bg": "office",
    "spots": [
      {
        "id": "journal",
        "x": 30,
        "y": 50,
        "w": 22,
        "h": 18,
        "icon": "📓"
      },
      {
        "id": "pc",
        "x": 58,
        "y": 38,
        "w": 20,
        "h": 24,
        "icon": "🖥️"
      },
      {
        "id": "photo",
        "x": 12,
        "y": 22,
        "w": 14,
        "h": 16,
        "icon": "🖼️"
      },
      {
        "id": "note",
        "x": 45,
        "y": 58,
        "w": 14,
        "h": 12,
        "icon": "📝"
      }
    ]
  },
  "warehouse": {
    "mood": "warehouse",
    "desc": "Стеллажи, пустые ячейки, мигающая камера.",
    "bg": "warehouse",
    "spots": [
      {
        "id": "box",
        "x": 22,
        "y": 40,
        "w": 20,
        "h": 28,
        "icon": "📦"
      },
      {
        "id": "cam",
        "x": 78,
        "y": 12,
        "w": 12,
        "h": 12,
        "icon": "📷"
      },
      {
        "id": "key",
        "x": 55,
        "y": 48,
        "w": 14,
        "h": 18,
        "icon": "🔑"
      },
      {
        "id": "rag",
        "x": 40,
        "y": 72,
        "w": 14,
        "h": 12,
        "icon": "🧹"
      }
    ]
  },
  "gate": {
    "mood": "gate",
    "desc": "Турникет, журнал охраны, холодный сквозняк.",
    "bg": "gate",
    "spots": [
      {
        "id": "log",
        "x": 28,
        "y": 40,
        "w": 22,
        "h": 24,
        "icon": "📋"
      },
      {
        "id": "bag",
        "x": 58,
        "y": 62,
        "w": 16,
        "h": 16,
        "icon": "🎒"
      },
      {
        "id": "cam2",
        "x": 80,
        "y": 18,
        "w": 12,
        "h": 12,
        "icon": "📹"
      }
    ]
  }
};
  function roomVisual(room) {
    return VIS_META[room.id] || { mood: "default", desc: "", bg: "default", spots: [] };
  }
  function progressBarHtml(state) {
    var n = Object.keys(state.found || {}).length;
    var max = 0;
    CASE.rooms.forEach(function (r) { max += (r.objects || []).length; });
    var pct = max ? Math.round((n / max) * 100) : 0;
    return (
      '<div class="rv-progress"><div class="rv-progress-bar" style="width:' + pct +
      '%"></div><span class="rv-progress-label">Улики: ' + n + " / " + max +
      " · этап " + ((state.stage || 0) + 1) + "</span></div>"
    );
  }
  function mapCardHtml(r, state) {
    var vis = roomVisual(r);
    var foundHere = (r.objects || []).filter(function (o) {
      return state.found && state.found[o.clue.id];
    }).length;
    var total = (r.objects || []).length;
    var done = foundHere >= total && total > 0;
    return (
      '<button type="button" class="rv-map-card btn-room' + (done ? " rv-done" : "") +
      '" data-room="' + esc(r.id) + '">' +
      '<div class="rv-map-art rv-bg-' + esc(vis.bg) + '"><span class="rv-map-icon">' +
      (r.icon || "🚪") + "</span>" +
      '<div class="rv-map-scan"></div></div>' +
      '<div class="rv-map-meta"><b>' + esc(r.name) + "</b>" +
      '<small>' + foundHere + "/" + total + " объектов</small>" +
      (done ? '<span class="rv-badge-done">✓ осмотрено</span>' : '<span class="rv-badge-new">исследовать</span>') +
      "</div></button>"
    );
  }
  function sceneHtml(room, state) {
    var vis = roomVisual(room);
    var spots = (vis.spots || []).map(function (s) {
      var obj = (room.objects || []).find(function (o) { return o.id === s.id; });
      if (!obj) return "";
      var taken = state.found && state.found[obj.clue.id];
      return (
        '<button type="button" class="rv-hotspot btn-obj' + (taken ? " rv-hotspot-done" : " rv-hotspot-pulse") +
        '" data-obj="' + esc(obj.id) + '" style="left:' + s.x + "%;top:" + s.y +
        "%;width:" + s.w + "%;height:" + s.h + '%"' + (taken ? " disabled" : "") +
        ' title="' + esc(obj.name) + '">' +
        '<span class="rv-hotspot-icon">' + (s.icon || "🔍") + "</span>" +
        '<span class="rv-hotspot-label">' + esc(obj.name) + "</span>" +
        (taken ? '<span class="rv-hotspot-check">✓</span>' : "") +
        "</button>"
      );
    }).join("");
    return (
      '<div class="rv-scene rv-bg-' + esc(vis.bg) + ' rv-mood-' + esc(vis.mood) + '">' +
      '<div class="rv-scene-overlay"></div>' +
      '<p class="rv-scene-desc">' + esc(vis.desc || "") + "</p>" +
      '<div class="rv-hotspots">' + spots + "</div>" +
      '<div class="rv-scene-vignette"></div></div>'
    );
  }

  function scoreEnding(state) {
    var sol = CASE.solution;
    var theories = state.theories || {};
    var ids = Object.keys(theories);
    if (!ids.length) return "partial";
    var ok = 0;
    ids.forEach(function (id) {
      var t = theories[id];
      if (t && t.culprit === sol.culprit && t.motive === sol.motive) ok++;
    });
    var ratio = ok / ids.length;
    if (ratio >= 0.99) return "perfect";
    if (ratio >= 0.5) return "good";
    if (ok > 0) return "partial";
    return "wrong";
  }

  /* ---------- UI / net ---------- */
  window.startDetectiveCoop = function (container) {
    if (!container) return;
    var self = account();
    var roomCode = "";
    var isHost = false;
    var state = null;
    var timer = null;
    var actionCursor = 0;
    var view = "lobby";
    var currentRoom = null;
    var busy = false;

    function stop() { if (timer) clearInterval(timer); timer = null; }
    window.stopCurrentGame = stop;

    function shell(html) {
      if (!container || !document.body.contains(container)) return;
      container.innerHTML = html;
      wire();
    }
    function notice(msg) {
      var n = container.querySelector("#netNotice");
      if (n) n.textContent = msg || "";
    }

    function pushLog(msg) {
      if (!state) return;
      state.log = (state.log || []).slice(-12);
      state.log.push(msg);
    }

    function chatHtml() {
      var lines = (state.chat || []).slice(-30).map(function (m) {
        return "<div class=\"coop-chat-line\"><b>" + esc(m.name) + ":</b> " + esc(m.text) + "</div>";
      }).join("");
      return (
        '<div class="coop-chat">' +
        '<div class="coop-chat-log" id="coopChatLog">' + (lines || '<span class="net-muted">Пока тихо. Напишите гипотезу коллегам.</span>') + "</div>" +
        '<div class="coop-chat-row"><input id="coopChatIn" maxlength="200" placeholder="Сообщение команде…">' +
        '<button type="button" class="btn" id="coopChatSend">➤</button></div></div>'
      );
    }

    function boardHtml() {
      var keys = Object.keys(state.found || {});
      if (!keys.length) return '<p class="net-muted">Улики появятся здесь, когда кто-то осмотрит объект.</p>';
      return keys.map(function (id) {
        var c = state.found[id];
        var mark = (state.marks || {})[id];
        var badge = mark === "important" ? "⭐" : mark === "doubt" ? "❓" : "•";
        var typeHint = isHost || (state.roles[self.id] === "analyst")
          ? '<span class="net-muted"> [' + esc(c.type) + "]</span>"
          : "";
        return (
          '<div class="coop-clue" data-clue="' + esc(id) + '">' +
          "<b>" + badge + " " + esc(c.text) + "</b>" + typeHint +
          '<div class="net-muted">нашёл: ' + esc(c.by) + " · " + esc(c.tag || "") + "</div>" +
          (state.roles[self.id] === "analyst"
            ? '<div class="coop-clue-acts">' +
              '<button type="button" class="btn ghost btn-mark" data-mark="important" data-id="' + esc(id) + '">⭐ Важно</button>' +
              '<button type="button" class="btn ghost btn-mark" data-mark="doubt" data-id="' + esc(id) + '">❓ Сомнительно</button></div>'
            : "") +
          "</div>"
        );
      }).join("");
    }

    function rosterHtml() {
      return '<ul class="net-roster">' + (state.players || []).map(function (p) {
        var role = CASE.roles.find(function (r) { return r.id === state.roles[p.id]; });
        var online = p.lastSeen && Date.now() - p.lastSeen < 15000;
        return (
          "<li><span class=\"net-avatar\">" + esc((p.name || "?")[0]) +
          (online ? '<span class="online-dot"></span>' : "") +
          "</span><span><b>" + esc(p.name) + "</b><br><span class=\"net-muted\">" +
          esc(role ? role.name : "—") + "</span></span></li>"
        );
      }).join("") + "</ul>";
    }

    function renderLobby() {
      shell(
        '<div class="netgame gv-enter"><div class="party-kicker">КООП · РАЗНЫЕ УСТРОЙСТВА</div>' +
        "<h2>🕵️ " + esc(CASE.title) + "</h2>" +
        "<p>" + esc(CASE.blurb) + "</p>" +
        "<p class=\"net-muted\">2–6 игроков. Улики открываются поэтапно. Есть ложные и нейтральные следы. Общайтесь в чате — в одиночку легко попасть на подставу.</p>" +
        '<div class="net-actions"><button class="btn" id="netCreate">✨ Создать комнату</button></div>' +
        '<div class="net-join"><input id="netCode" maxlength="6" placeholder="КОД"><button class="btn" id="netJoin">Войти</button></div>' +
        '<div id="netNotice" class="net-notice"></div></div>'
      );
    }

    function renderWaiting() {
      shell(
        '<div class="netgame"><div class="net-head"><h2>Комната <span class="net-code-badge">' + esc(roomCode) +
        '</span></h2></div>' +
        '<div class="net-invite-row"><button class="btn ghost" id="netCopy">📋 Код</button>' +
        '<button class="btn ghost" id="netInvite">🔗 Ссылка</button></div>' +
        rosterHtml() +
        (isHost
          ? '<button class="btn" id="netStart">Начать расследование (' + (state.players || []).length + ")</button>"
          : '<p class="net-muted">Ждём, пока ведущий начнёт…</p>') +
        chatHtml() +
        '<button class="btn ghost" id="netLeave">Выйти</button><div id="netNotice" class="net-notice"></div></div>'
      );
    }

    function renderPlay() {
      var rooms = unlockedRooms(state);
      var phaseLabel = state.phase === "theory" ? "Версии команды" : state.phase === "finale" ? "Итог" : "Расследование · этап " + (state.stage + 1);
      var roomPanel = "";
      if (state.phase === "investigate") {
        if (!currentRoom) {
          roomPanel =
            progressBarHtml(state) +
            '<div class="rv-map-title">Карта завода — выберите помещение</div>' +
            '<div class="rv-map coop-rooms">' +
            rooms.map(function (r) { return mapCardHtml(r, state); }).join("") +
            "</div>" +
            (state.searchBusy
              ? '<p class="net-muted rv-busy">Сейчас осматривает: <b>' + esc(state.searchBusy.name) + "</b>…</p>"
              : '<p class="net-muted">Нажмите на комнату, затем на подсвеченные объекты внутри.</p>') +
            (state.roles[self.id] === "archivist" && !state.dossierUsed[self.id]
              ? '<button class="btn ghost" id="btnDossier">📂 Секретное досье (1 раз)</button>'
              : "");
        } else {
          var room = CASE.rooms.find(function (r) { return r.id === currentRoom; });
          roomPanel =
            '<div class="rv-room-head"><button class="btn ghost" id="btnBackRooms">← Карта</button>' +
            "<h3>" + (room ? room.icon + " " + esc(room.name) : "") + "</h3></div>" +
            (room ? sceneHtml(room, state) : "") +
            '<div class="coop-objects rv-obj-list">' +
            (room ? room.objects : []).map(function (o) {
              var taken = state.found[o.clue.id];
              return (
                '<button type="button" class="coop-obj btn-obj' + (taken ? " rv-obj-done" : "") +
                '" data-obj="' + esc(o.id) + '"' + (taken ? " disabled" : "") + ">" +
                "<b>" + esc(o.name) + "</b><small>" +
                (taken ? "✓ осмотрено" : "🔍 осмотреть") +
                "</small></button>"
              );
            }).join("") +
            "</div>" +
            '<div id="rvModalMount"></div>';
        }
      } else if (state.phase === "theory") {
        roomPanel =
          '<div class="party-panel"><p>Соберите версию. Обсудите в чате — у каждого свой взгляд на улики.</p>' +
          '<label>Кто виновен?</label><select id="thCulprit">' +
          '<option value="operator">Оператор</option><option value="naladchik">Наладчик</option>' +
          '<option value="master">Мастер</option><option value="store">Кладовщик</option></select>' +
          '<label>Мотив</label><select id="thMotive">' +
          '<option value="debt">Долг / деньги</option><option value="revenge">Месть</option>' +
          '<option value="cover">Скрыть брак</option><option value="accident">Случайность</option></select>' +
          '<label>Как?</label><select id="thMethod">' +
          '<option value="night">Ночной проход</option><option value="shift">Во время смены</option>' +
          '<option value="frame">Подстава</option></select>' +
          '<button class="btn" id="btnTheory">Отправить версию</button></div>';
      } else if (state.phase === "finale" && state.ended) {
        var end = CASE.endings[state.ended] || CASE.endings.partial;
        roomPanel =
          '<div class="case-result gv-win"><div class="case-ending-stamp">' + esc(end.title) +
          "</div><p>" + esc(end.text) + "</p><p><b>+" + end.xp + " XP</b></p>" +
          '<button class="btn" id="netLeave">В меню игр</button></div>';
      }

      shell(
        '<div class="netgame coop-det">' +
        '<div class="net-head"><div><div class="party-kicker">' + esc(phaseLabel) +
        '</div><h2>' + esc(CASE.title) + ' · <span class="net-code-badge">' + esc(roomCode) +
        "</span></h2></div></div>" +
        '<div class="coop-layout">' +
        '<div class="coop-main">' + roomPanel +
        '<h4 class="case-section-title">Доска улик</h4><div class="coop-board">' + boardHtml() + "</div>" +
        (state.phase === "investigate" && isHost && Object.keys(state.found).length >= 5
          ? '<button class="btn" id="btnToTheory">Перейти к версиям команды</button>'
          : "") +
        (state.phase === "theory" && isHost
          ? '<button class="btn" id="btnFinale">Подвести итог</button>'
          : "") +
        "</div>" +
        '<aside class="coop-side">' +
        "<h4>Команда</h4>" + rosterHtml() +
        "<h4>Чат</h4>" + chatHtml() +
        '<div class="net-log">' + (state.log || []).slice(-6).map(function (l) {
          return "<p>" + esc(l) + "</p>";
        }).join("") + "</div></aside></div>" +
        '<div id="netNotice" class="net-notice"></div></div>'
      );
    }

    function render() {
      if (!state || state.phase === "lobby") return renderWaiting();
      if (state.phase === "lobby") return renderWaiting();
      renderPlay();
    }

    async function persist() {
      if (!isHost || !roomCode || !state) return;
      try { await window.API.updateGameRoom(roomCode, state); } catch (e) { notice(String(e.message || e)); }
    }

    async function act(type, payload) {
      if (!roomCode) return;
      try {
        await window.API.sendGameAction({ code: roomCode, type: type, payload: payload || {} });
      } catch (e) { notice(String(e.message || e)); }
    }

    function applyAction(a) {
      if (!state || !a) return;
      var p = a.payload || {};
      var who = a.name || a.email || "Игрок";
      if (a.type === "chat") {
        state.chat = state.chat || [];
        state.chat.push({ name: who, text: p.text || "", at: Date.now() });
      } else if (a.type === "search" && isHost) {
        handleSearch(p.roomId, p.objId, a.playerId || a.email, who);
      } else if (a.type === "mark" && isHost) {
        state.marks[p.clueId] = p.mark;
        pushLog(who + " пометил улику");
      } else if (a.type === "theory" && isHost) {
        state.theories[a.playerId || a.email] = p;
        pushLog(who + " отправил версию");
      } else if (a.type === "dossier" && isHost) {
        state.dossierUsed[a.playerId || a.email] = true;
        state.chat.push({ name: "Система", text: who + " открыл досье: наладчик недавно брал заём под залог.", at: Date.now() });
      }
    }

    function handleSearch(roomId, objId, playerId, who) {
      var room = CASE.rooms.find(function (r) { return r.id === roomId; });
      if (!room) return;
      var obj = (room.objects || []).find(function (o) { return o.id === objId; });
      if (!obj || state.found[obj.clue.id]) return;
      state.found[obj.clue.id] = {
        text: obj.clue.text,
        type: obj.clue.type,
        tag: obj.clue.tag,
        by: who,
        look: obj.look
      };
      state.visited[roomId] = true;
      pushLog(who + " → " + room.name + ": " + obj.name);
      state.searchBusy = null;
    }

    async function poll() {
      if (!roomCode || !apiReady()) return;
      try {
        var r = await window.API.getGameRoom(roomCode);
        if (r && r.success && r.state) {
          if (!isHost) state = r.state;
          else {
            // merge presence
            var me = self;
            (state.players || []).forEach(function (p) {
              if (p.id === me.id || p.email === me.email) p.lastSeen = Date.now();
            });
          }
        }
        if (isHost) {
          var acts = await window.API.getGameActions(roomCode, actionCursor);
          if (acts && acts.success && acts.actions) {
            acts.actions.forEach(function (a) {
              applyAction(a);
              actionCursor = Math.max(actionCursor, Number(a.id) || 0);
            });
          }
          await persist();
        }
        if (state && state.phase !== "lobby") renderPlay();
        else if (state) renderWaiting();
      } catch (e) { /* soft */ }
    }

    function beginPoll() {
      stop();
      timer = setInterval(poll, 1800);
      poll();
    }

    async function createRoom() {
      if (busy) return;
      busy = true;
      try {
        if (!apiReady()) throw new Error("Нужен вход в портал и сетевой API.");
        var r = await window.API.createGameRoom({});
        if (!r || !r.success) throw new Error((r && r.error) || "Не удалось создать комнату");
        roomCode = r.code;
        window.__lastRoomCode = roomCode;
        isHost = true;
        var host = { id: self.id, email: self.email, name: self.name, lastSeen: Date.now() };
        state = emptyState(host);
        await persist();
        beginPoll();
        renderWaiting();
      } catch (e) {
        notice(String(e.message || e));
      } finally {
        busy = false;
      }
    }

    async function joinRoom(code) {
      if (busy) return;
      busy = true;
      code = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      try {
        if (!apiReady()) throw new Error("Нужен вход в портал и сетевой API.");
        var r = await window.API.joinGameRoom({ code: code, name: self.name });
        if (!r || !r.success) throw new Error((r && r.error) || "Не войти в комнату");
        roomCode = code;
        window.__lastRoomCode = roomCode;
        isHost = false;
        state = r.state || {};
        // ensure we are listed
        var pl = state.players || [];
        if (!pl.some(function (p) { return p.id === self.id || p.email === self.email; })) {
          pl.push({ id: self.id, email: self.email, name: self.name, lastSeen: Date.now() });
          state.players = pl;
        }
        beginPoll();
        if (state.phase && state.phase !== "lobby") renderPlay();
        else renderWaiting();
      } catch (e) {
        notice(String(e.message || e));
      } finally {
        busy = false;
      }
    }

    async function startCase() {
      if (!isHost || !state) return;
      if ((state.players || []).length < 1) {
        notice("Нужен хотя бы 1 игрок");
        return;
      }
      assignRoles(state);
      state.phase = "investigate";
      state.startedAt = Date.now();
      pushLog("Расследование началось. Комнаты открываются по мере находок.");
      await persist();
      renderPlay();
    }

    function wire() {
      var c = container;
      if (!c) return;
      var create = c.querySelector("#netCreate");
      if (create) create.onclick = createRoom;
      var join = c.querySelector("#netJoin");
      if (join) join.onclick = function () {
        joinRoom((c.querySelector("#netCode") || {}).value);
      };
      var codeIn = c.querySelector("#netCode");
      if (codeIn) codeIn.addEventListener("input", function () {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      });
      var copy = c.querySelector("#netCopy");
      if (copy) copy.onclick = function () {
        if (navigator.clipboard) navigator.clipboard.writeText(roomCode);
        notice("Код " + roomCode + " скопирован");
      };
      var inv = c.querySelector("#netInvite");
      if (inv) inv.onclick = function () {
        var url = inviteUrl(roomCode);
        if (navigator.clipboard) navigator.clipboard.writeText(url);
        notice("Ссылка скопирована — откройте на другом устройстве");
      };
      var start = c.querySelector("#netStart");
      if (start) start.onclick = startCase;
      var leave = c.querySelector("#netLeave");
      if (leave) leave.onclick = function () {
        stop();
        if (roomCode && window.API.leaveGameRoom) window.API.leaveGameRoom(roomCode);
        if (window.renderArcadePage) window.renderArcadePage();
      };
      var chatSend = c.querySelector("#coopChatSend");
      if (chatSend) chatSend.onclick = async function () {
        var inp = c.querySelector("#coopChatIn");
        var text = (inp && inp.value || "").trim();
        if (!text) return;
        if (inp) inp.value = "";
        if (isHost) {
          state.chat.push({ name: self.name, text: text, at: Date.now() });
          await persist();
          render();
        } else await act("chat", { text: text });
      };
      c.querySelectorAll(".btn-room").forEach(function (btn) {
        btn.onclick = function () { currentRoom = btn.getAttribute("data-room"); renderPlay(); };
      });
      var back = c.querySelector("#btnBackRooms");
      if (back) back.onclick = function () { currentRoom = null; renderPlay(); };
      c.querySelectorAll(".btn-obj").forEach(function (btn) {
        btn.onclick = function () {
          var objId = btn.getAttribute("data-obj");
          var room = CASE.rooms.find(function (r) { return r.id === currentRoom; });
          var obj = room && (room.objects || []).find(function (o) { return o.id === objId; });
          if (!obj || (state.found && state.found[obj.clue.id])) return;
          var mount = c.querySelector("#rvModalMount") || c;
          var modal = document.createElement("div");
          modal.innerHTML =
            '<div class="rv-modal" id="rvExamine"><div class="rv-modal-card gv-enter">' +
            '<button type="button" class="rv-modal-close" id="rvClose">✕</button>' +
            '<div class="rv-modal-icon">🔍</div><h3>' + esc(obj.name) + "</h3>" +
            '<p class="rv-look">' + esc(obj.look || "") + "</p>" +
            '<div class="rv-clue-gain"><span class="case-flag-chip">находка</span> ' +
            esc(obj.clue.text) + "</div>" +
            '<button type="button" class="btn" id="rvConfirmSearch">Зафиксировать улику</button></div></div>';
          mount.appendChild(modal);
          modal.querySelector("#rvClose").onclick = function () { modal.remove(); };
          modal.querySelector("#rvExamine").onclick = function (e) {
            if (e.target.id === "rvExamine") modal.remove();
          };
          modal.querySelector("#rvConfirmSearch").onclick = async function () {
            modal.remove();
            if (isHost) {
              handleSearch(currentRoom, objId, self.id, self.name);
              await persist();
              renderPlay();
            } else {
              await act("search", { roomId: currentRoom, objId: objId });
              notice("Осмотр отправлен команде…");
            }
          };
        };
      });
      c.querySelectorAll(".btn-mark").forEach(function (btn) {
        btn.onclick = async function () {
          var id = btn.getAttribute("data-id");
          var mark = btn.getAttribute("data-mark");
          if (isHost) {
            state.marks[id] = mark;
            await persist();
            renderPlay();
          } else await act("mark", { clueId: id, mark: mark });
        };
      });
      var dossier = c.querySelector("#btnDossier");
      if (dossier) dossier.onclick = async function () {
        if (isHost) {
          state.dossierUsed[self.id] = true;
          state.chat.push({ name: "Система", text: self.name + " открыл досье: наладчик недавно брал заём.", at: Date.now() });
          await persist();
          renderPlay();
        } else await act("dossier", {});
      };
      var toTheory = c.querySelector("#btnToTheory");
      if (toTheory) toTheory.onclick = async function () {
        state.phase = "theory";
        pushLog("Фаза версий: обсудите в чате и отправьте обвинение");
        await persist();
        renderPlay();
      };
      var th = c.querySelector("#btnTheory");
      if (th) th.onclick = async function () {
        var payload = {
          culprit: (c.querySelector("#thCulprit") || {}).value,
          motive: (c.querySelector("#thMotive") || {}).value,
          method: (c.querySelector("#thMethod") || {}).value
        };
        if (isHost) {
          state.theories[self.id] = payload;
          pushLog(self.name + " отправил версию");
          await persist();
          renderPlay();
        } else await act("theory", payload);
        notice("Версия отправлена");
      };
      var fin = c.querySelector("#btnFinale");
      if (fin) fin.onclick = async function () {
        state.ended = scoreEnding(state);
        state.phase = "finale";
        var end = CASE.endings[state.ended];
        pushLog("Итог: " + end.title);
        if (window.state) {
          window.state.xp = (window.state.xp || 0) + (end.xp || 0);
          if (window.saveStudentData) window.saveStudentData();
        }
        await persist();
        renderPlay();
      };
    }

    // deep link
    try {
      var pend = JSON.parse(sessionStorage.getItem("mdk.pendingJoin") || "null");
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
