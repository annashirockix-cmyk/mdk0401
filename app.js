"use strict";

window.renderCourseReportsPage = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = "";
    
    var crumbs = document.getElementById("crumbs"); 
    if (crumbs) crumbs.textContent = "Отчеты (Преподаватель)";

    app.innerHTML = `
        <a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>
        <section class="hero"><h1>📊 Отчеты по тестам и ответам</h1></section>
        <div class="module" style="padding: 20px;">
            <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; align-items:center;">
                <select id="repFilterGroup" class="self-input" style="margin:0; width:200px;">
                    <option value="">Все группы</option>
                </select>
                <select id="repFilterType" class="self-input" style="margin:0; width:200px;">
                    <option value="">Все работы</option>
                    <option value="test">Только тесты</option>
                    <option value="written">Только письменные</option>
                </select>
                <button class="btn" id="repRefresh">🔄 Обновить</button>
                <button class="btn ghost" id="repExport" style="border-color:var(--gold); color:var(--gold);">📥 Экспорт в CSV</button>
                <span id="repStatus" style="margin-left:auto; color:var(--muted);"></span>
            </div>
            <div style="overflow-x:auto;">
                <table class="reports-table" style="width:100%; border-collapse:collapse; font-size:14px;">
                    <thead>
                        <tr style="background:var(--card-soft);">
                            <th style="padding:10px; border:1px solid var(--border); text-align:left;">ФИО</th>
                            <th style="padding:10px; border:1px solid var(--border);">Группа</th>
                            <th style="padding:10px; border:1px solid var(--border);">Работа</th>
                            <th style="padding:10px; border:1px solid var(--border);">Оценка/Балл</th>
                            <th style="padding:10px; border:1px solid var(--border);">Ответ студента (если есть)</th>
                            <th style="padding:10px; border:1px solid var(--border);">Дата</th>
                        </tr>
                    </thead>
                    <tbody id="repTbody">
                        <tr><td colspan="6" style="text-align:center; padding:20px;">Загрузка...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    var results = [];

    function loadResults() {
        document.getElementById('repTbody').innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">Загрузка...</td></tr>';
        document.getElementById('repStatus').textContent = 'Загрузка данных с сервера...';
        
        if (window.API && window.API.getResults) {
            window.API.getResults({}).then(d => {
                if (d && d.success) {
                    results = d.results || [];
                    updateFilters();
                    renderTable();
                    document.getElementById('repStatus').textContent = `Всего записей: ${results.length}`;
                } else {
                    document.getElementById('repTbody').innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--err);">Ошибка загрузки данных</td></tr>';
                }
            }).catch(err => {
                document.getElementById('repTbody').innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--err);">Ошибка сети: ${err.message}</td></tr>`;
            });
        } else {
            document.getElementById('repTbody').innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--err);">API не подключен</td></tr>';
        }
    }

    function updateFilters() {
        var groupSel = document.getElementById('repFilterGroup');
        var groups = [...new Set(results.map(r => r.group).filter(Boolean))];
        groupSel.innerHTML = '<option value="">Все группы</option>' + groups.map(g => `<option value="${g}">${g}</option>`).join('');
    }

    function renderTable() {
        var gFilter = document.getElementById('repFilterGroup').value;
        var tFilter = document.getElementById('repFilterType').value;
        var tbody = document.getElementById('repTbody');
        
        var filtered = results.filter(r => {
            if (gFilter && r.group !== gFilter) return false;
            if (tFilter === 'test' && (r.testId.startsWith('prac_') || r.testId.startsWith('self_'))) return false;
            if (tFilter === 'written' && !r.testId.startsWith('prac_') && !r.testId.startsWith('self_')) return false;
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">Нет данных</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(r => {
            var color = r.grade >= 4 ? 'var(--ok)' : (r.grade >= 3 ? 'var(--gold)' : (r.grade > 0 ? 'var(--err)' : 'var(--muted)'));
            var gradeText = r.grade > 0 ? r.grade : "Ожидает проверки";
            var d = new Date(r.finishedAt).toLocaleString('ru-RU');
            
            var payloadHtml = r.payload ? `<div style="max-height:100px; overflow-y:auto; font-size:12px; background:var(--bg); padding:5px; border-radius:4px;">${window.escapeHtml(r.payload)}</div>` : '<span style="color:var(--muted);">—</span>';

            return `<tr>
                <td style="padding:8px; border:1px solid var(--border);">${window.escapeHtml(r.name)}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center;">${window.escapeHtml(r.group)}</td>
                <td style="padding:8px; border:1px solid var(--border);">${window.escapeHtml(r.testTitle)}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center; font-weight:bold; color:${color};">${gradeText}</td>
                <td style="padding:8px; border:1px solid var(--border);">${payloadHtml}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center; font-size:12px;">${d}</td>
            </tr>`;
        }).join('');
    }

    document.getElementById('repRefresh').onclick = loadResults;
    document.getElementById('repFilterGroup').onchange = renderTable;
    document.getElementById('repFilterType').onchange = renderTable;
    document.getElementById('repExport').onclick = function() {
        window.showToast("Функция экспорта в CSV в разработке", "info");
    };

    loadResults();
};