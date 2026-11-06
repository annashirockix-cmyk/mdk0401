"use strict";

/**
 * Интеграция учебных симуляторов в оболочку МДК Портала.
 * G-Code Lab — отдельное приложение в iframe: это сохраняет его собственное
 * хранилище прогресса и не вмешивается в основную маршрутизацию/уведомления.
 */
window.renderGCodeLabPortal = function () {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = [
        '<section class="card" style="padding:clamp(12px,2vw,22px);">',
        '  <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;">',
        '    <div><h1 style="margin:0 0 5px;">⚙️ G-Code Lab</h1>',
        '    <p style="margin:0;color:var(--muted);">Интерактивная лаборатория: 300 уровней, редактор управляющей программы и визуализация траектории.</p></div>',
        '    <a class="btn" href="./g_code_full.html" target="_blank" rel="noopener noreferrer">Открыть отдельно ↗</a>',
        '  </div>',
        '  <div style="margin:14px 0;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--card-soft);">',
        '    <strong>Важно:</strong> это учебная визуализация. Проверка в тренажёре не подтверждает безопасность программы для реального станка. Перед практической работой обязательны проверка УП, наладка и соблюдение инструкции конкретного оборудования.',
        '  </div>',
        '  <iframe title="G-Code Lab — учебный тренажёр" src="./g_code_full.html" loading="lazy" style="display:block;width:100%;height: min(82vh, 1050px);min-height:720px;border:1px solid var(--border);border-radius:12px;background:#0b1220;"></iframe>',
        '</section>'
    ].join("");
};
