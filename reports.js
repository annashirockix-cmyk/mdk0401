"use strict";

window.renderCourseReportsPage = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = "";
    
    var crumbs = document.getElementById("crumbs"); 
    if (crumbs) crumbs.textContent = "Отчеты (Преподаватель)";

    app.innerHTML = `
        <a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>
        <section class="hero"><h1>📊 Отчеты по тестам</h1></section>
        <div class="module" style="padding: 20px;">
            <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; align-items:center;">
                <select id="repFilterGroup" class="self-input" style="margin:0; width:200px;">
                    <option value="">Все группы</option>
                </select>
                <select id="repFilterTest" class="self-input" style="margin:0; width:300px;">
                    <option value="">Все тесты</option>
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
                            <th style="padding:10px; border:1px solid var(--border);">Тест</th>
                            <th style="padding:10px; border:1px solid var(--border);">Оценка</th>
                            <th style="padding:10px; border:1px solid var(--border);">Время</th>
                            <th style="padding:10px; border:1px solid var(--border);">Попытки</th>
                            <th style="padding:10px; border:1px solid var(--border);">Дата</th>
                        </tr>
                    </thead>
                    <tbody id="repTbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px;">Загрузка...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    var results = [];

    function loadResults() {
        document.getElementById('repTbody').innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Загрузка...</td></tr>';
        document.getElementById('repStatus').textContent = 'Загрузка данных...';
        
        if (window.API && window.API.getStudents) {
            // Пытаемся получить данные студентов из API и вытащить результаты
            window.API.getStudents().then(d => {
                if (d && d.ok && d.students) {
                    results = [];
                    d.students.forEach(s => {
                        var p = {}; try { p = JSON.parse(s.payload || "{}"); } catch(e) {}
                        var res = p.results || {};
                        for (var key in res) {
                            if (key.startsWith("test_") || key.startsWith("__final__")) {
                                results.push({
                                    name: s.name,
                                    group: s.group,
                                    testTitle: key === "__final__" ? "Итоговый экзамен" : "Тест: " + key.replace("test_", ""),
                                    grade: res[key].grade,
                                    timeSpent: res[key].timeSpent || 0,
                                    attempts: res[key].attempts || 1,
                                    finishedAt: res[key].finishedAt || new Date().toISOString()
                                });
                            }
                        }
                    });
                    updateFilters();
                    renderTable();
                    document.getElementById('repStatus').textContent = `Всего записей: ${results.length}`;
                } else {
                    showDemoData("API вернул пустые данные");
                }
            }).catch(err => {
                showDemoData("Ошибка сети. Показаны демо-данные.");
            });
        } else {
            showDemoData("API не подключен. Показаны демо-данные.");
        }
    }

    function showDemoData(msg) {
        results = [
            { name: "Иванов Иван", group: "ТМ 2-5", testTitle: "Тест: Основы ЧПУ", grade: 5, timeSpent: 450, attempts: 1, finishedAt: new Date().toISOString() },
            { name: "Петров Петр", group: "ТМ 2-5", testTitle: "Тест: Основы ЧПУ", grade: 3, timeSpent: 600, attempts: 2, finishedAt: new Date().toISOString() },
            { name: "Сидоров Алексей", group: "ТМ 3-4", testTitle: "Тест: Материаловедение", grade: 4, timeSpent: 520, attempts: 1, finishedAt: new Date().toISOString() }
        ];
        updateFilters();
        renderTable();
        document.getElementById('repStatus').textContent = msg;
    }

    function updateFilters() {
        var groupSel = document.getElementById('repFilterGroup');
        var testSel = document.getElementById('repFilterTest');
        
        var groups = [...new Set(results.map(r => r.group).filter(Boolean))];
        groupSel.innerHTML = '<option value="">Все группы</option>' + groups.map(g => `<option value="${g}">${g}</option>`).join('');
        
        var tests = [...new Set(results.map(r => r.testTitle).filter(Boolean))];
        testSel.innerHTML = '<option value="">Все тесты</option>' + tests.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    function renderTable() {
        var gFilter = document.getElementById('repFilterGroup').value;
        var tFilter = document.getElementById('repFilterTest').value;
        var tbody = document.getElementById('repTbody');
        
        var filtered = results.filter(r => {
            if (gFilter && r.group !== gFilter) return false;
            if (tFilter && r.testTitle !== tFilter) return false;
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Нет данных</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(r => {
            var color = r.grade >= 4 ? 'var(--ok)' : (r.grade >= 3 ? 'var(--gold)' : 'var(--err)');
            var m = Math.floor(r.timeSpent / 60), s = r.timeSpent % 60;
            var d = new Date(r.finishedAt).toLocaleString('ru-RU');
            return `<tr>
                <td style="padding:8px; border:1px solid var(--border);">${window.escapeHtml(r.name)}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center;">${window.escapeHtml(r.group)}</td>
                <td style="padding:8px; border:1px solid var(--border);">${window.escapeHtml(r.testTitle)}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center; font-weight:bold; color:${color};">${r.grade}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center;">${m}:${s < 10 ? '0'+s : s}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center;">${r.attempts}</td>
                <td style="padding:8px; border:1px solid var(--border); text-align:center;">${d}</td>
            </tr>`;
        }).join('');
    }

    document.getElementById('repRefresh').onclick = loadResults;
    document.getElementById('repFilterGroup').onchange = renderTable;
    document.getElementById('repFilterTest').onchange = renderTable;
    document.getElementById('repExport').onclick = function() {
        window.showToast("Функция экспорта в CSV в разработке", "info");
    };

    loadResults();
};
