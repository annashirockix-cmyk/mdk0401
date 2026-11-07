"use strict";
(function () {
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  window.renderLaboratoryHub = function () {
    var app = document.getElementById("app");
    var crumbs = document.getElementById("crumbs");
    if (!app) return;
    if (crumbs) crumbs.textContent = "Лаборатория";
    var tools = [
      { icon: "⚙️", title: "G-Code Lab", tag: "300 уровней", desc: "Редактор управляющей программы, разбор G- и M-команд, визуализация траектории и учебные задания.", href: "#/gcode-lab", color: "#4f9ee8" },
      { icon: "🔬", title: "Лаборатория материаловедения", tag: "Материалы и структуры", desc: "Кристаллические решётки ОЦК, ГЦК и ГПУ, учебная диаграмма Fe–Fe₃C и исследование состава сплавов.", href: "#/materials-lab", color: "#40b99a" },
      { icon: "📏", title: "Тренажёр метролога", tag: "Измерения и контроль", desc: "Штангенциркуль, микрометр, глубиномер, индикатор, допуски и оформление лабораторного протокола.", href: "#/metrology-trainer", color: "#b38ae8" },
      { icon: "🛠️", title: "Расчёт режимов резания", tag: "Точение и фрезерование", desc: "Расчёт частоты вращения шпинделя и минутной подачи с проверкой исходных данных и формул.", href: "#/machining-lab", color: "#d5a34e" }
    ];
    app.innerHTML = '<section class="lab-hub"><div class="lab-hub-head"><div><span class="lab-kicker">ПРАКТИКА · МОДЕЛИРОВАНИЕ · РАСЧЁТЫ</span><h1>🧪 Учебная лаборатория</h1><p>Выберите инструмент для практической работы. Прогресс и результаты тренажёров сохраняются в учебном портале, если вы вошли в аккаунт.</p></div><span class="lab-hub-mark">LAB</span></div><div class="lab-hub-grid">' +
      tools.map(function (tool, index) {
        return '<a class="lab-tool-card" href="' + tool.href + '" style="--lab-color:' + tool.color + '"><div class="lab-tool-top"><span class="lab-tool-icon">' + tool.icon + '</span><span class="lab-tool-number">0' + (index + 1) + '</span></div><span class="lab-tool-tag">' + esc(tool.tag) + '</span><h2>' + esc(tool.title) + '</h2><p>' + esc(tool.desc) + '</p><span class="lab-tool-open">Открыть лабораторию <b>→</b></span></a>';
      }).join("") +
      '</div><div class="lab-hub-note"><b>Перед началом:</b> выполняйте расчёты по данным задания и справочникам, соблюдайте требования охраны труда. Результаты тренажёров являются учебными и не заменяют проверку технологии и оборудования преподавателем.</div></section>';
  };

  var originalRouter = window.router;
  if (typeof originalRouter === "function" && !window.__laboratoryRouterBound) {
    window.__laboratoryRouterBound = true;
    window.router = function () {
      var page = ((location.hash || "").replace(/^#/, "").split("/").filter(Boolean)[0] || "");
      if (page === "laboratory") {
        window.renderLaboratoryHub();
        return;
      }
      return originalRouter.apply(this, arguments);
    };
  }

  var originalProfile = window.renderProfilePage;
  if (typeof originalProfile === "function" && !window.__cabinetShortcutsBound) {
    window.__cabinetShortcutsBound = true;
    window.renderProfilePage = function () {
      var result = originalProfile.apply(this, arguments);
      var app = document.getElementById("app");
      if (!app || app.querySelector(".cabinet-shortcuts")) return result;
      var isStaff = !!(window.state && window.state.staff);
      var links = isStaff ? [
        ["🔑", "Логин и пароль", "#/account", "Настройки доступа к учётной записи"],
        ["📁", "Портфолио обучающихся", "#/portfolio", "Учебные результаты и работы группы"],
        ["📊", "Панель преподавателя", "#/teacher-dashboard", "Контроль активности и успеваемости"],
        ["📋", "Журнал", "#/journal", "Оценки и результаты"]
      ] : [
        ["🔑", "Логин и пароль", "#/account", "Изменить логин или пароль"],
        ["📊", "Мои оценки", "#/grades", "Оценки, результаты и комментарии"],
        ["📁", "Электронное портфолио", "#/portfolio", "Работы, результаты и обратная связь"],
        ["🏆", "Достижения", "#/achievements", "Полученные награды и прогресс"]
      ];
      var panel = document.createElement("section");
      panel.className = "module cabinet-shortcuts";
      panel.innerHTML = '<div class="cabinet-shortcuts-head"><div><h3>Мой кабинет</h3><p>Основные разделы учётной записи</p></div><span>PROFILE</span></div><div class="cabinet-shortcuts-grid">' +
        links.map(function (item) {
          return '<a href="' + item[2] + '"><span>' + item[0] + '</span><div><b>' + esc(item[1]) + '</b><small>' + esc(item[3]) + '</small></div><i>→</i></a>';
        }).join("") + '</div>';
      var anchor = app.querySelector(".hero") || app.querySelector(".module");
      if (anchor) anchor.insertAdjacentElement("afterend", panel); else app.appendChild(panel);
      return result;
    };
  }

  if (!document.getElementById("laboratoryHubStyles")) {
    var style = document.createElement("style");
    style.id = "laboratoryHubStyles";
    style.textContent = [
      ".lab-hub{max-width:1180px;margin:0 auto}",
      ".lab-hub-head{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:clamp(22px,4vw,42px);border-radius:18px;background:linear-gradient(135deg,var(--card-soft),var(--card));border:1px solid var(--border);margin-bottom:18px}",
      ".lab-kicker{font-size:11px;letter-spacing:2px;font-weight:800;color:var(--accent)}",
      ".lab-hub-head h1{font-size:clamp(26px,4vw,38px);margin:8px 0}.lab-hub-head p{max-width:720px;color:var(--text-soft);margin:0}",
      ".lab-hub-mark{font-size:clamp(34px,6vw,64px);font-weight:900;letter-spacing:-5px;color:var(--accent);opacity:.65;border:2px solid var(--accent);border-radius:18px;padding:8px 14px;transform:rotate(-7deg)}",
      ".lab-hub-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}",
      ".lab-tool-card{display:flex;flex-direction:column;min-height:235px;padding:20px;border-radius:15px;border:1px solid var(--border);background:var(--card);color:var(--text);text-decoration:none;transition:transform .18s,border-color .18s,box-shadow .18s;box-shadow:0 6px 18px #00000012}",
      ".lab-tool-card:hover{transform:translateY(-3px);border-color:var(--lab-color);box-shadow:0 12px 26px #00000022}",
      ".lab-tool-top{display:flex;align-items:center;justify-content:space-between}.lab-tool-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:color-mix(in srgb,var(--lab-color) 18%,transparent);font-size:26px}.lab-tool-number{font-size:12px;font-weight:800;color:var(--muted)}",
      ".lab-tool-tag{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--lab-color);font-weight:800;margin-top:16px}.lab-tool-card h2{font-size:21px;margin:6px 0}.lab-tool-card p{font-size:14px;color:var(--muted);line-height:1.55;margin:0 0 18px}.lab-tool-open{margin-top:auto;color:var(--lab-color);font-weight:800;display:flex;justify-content:space-between;align-items:center}",
      ".lab-hub-note{margin-top:16px;padding:14px 16px;border-radius:12px;border:1px solid var(--border);background:var(--card-soft);color:var(--text-soft);font-size:13px;line-height:1.55}",
      ".cabinet-shortcuts{margin-top:16px}.cabinet-shortcuts-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.cabinet-shortcuts-head h3{margin:0}.cabinet-shortcuts-head p{margin:3px 0 0;color:var(--muted);font-size:13px}.cabinet-shortcuts-head>span{font-size:10px;letter-spacing:2px;color:var(--accent);font-weight:900}",
      ".cabinet-shortcuts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:14px}.cabinet-shortcuts-grid a{display:flex;align-items:center;gap:10px;padding:13px;border:1px solid var(--border);border-radius:11px;text-decoration:none;color:var(--text);background:var(--card-soft)}.cabinet-shortcuts-grid a>span{font-size:24px}.cabinet-shortcuts-grid a div{display:grid;gap:3px;min-width:0;flex:1}.cabinet-shortcuts-grid small{font-size:11px;color:var(--muted)}.cabinet-shortcuts-grid i{font-style:normal;color:var(--accent)}",
      ".drawer-group{border-bottom:1px solid var(--border);padding:2px 0}.drawer-group>summary{list-style:none;cursor:pointer;padding:13px 20px;color:var(--text);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:space-between}.drawer-group>summary::-webkit-details-marker{display:none}.drawer-group>summary:after{content:'+';color:var(--muted);font-size:18px}.drawer-group[open]>summary:after{content:'−'}.drawer-group .drawer-item{padding:9px 20px 9px 34px;font-size:13px;border-left:2px solid var(--border);margin-left:18px}.drawer-group .drawer-item:hover{border-left-color:var(--accent)}",
      "@media(max-width:620px){.lab-hub-grid{grid-template-columns:1fr}.lab-hub-head{align-items:flex-start}.lab-hub-mark{font-size:30px;padding:5px 9px}.lab-tool-card{min-height:205px}}"
    ].join("");
    document.head.appendChild(style);
  }
})();
