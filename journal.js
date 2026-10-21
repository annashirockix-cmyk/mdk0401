"use strict";

window.renderJournalPage = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = ""; 
    
    // Безопасная проверка заголовка
    var crumbs = document.getElementById("crumbs");
    if (crumbs) crumbs.textContent = "Журнал";
    
    app.appendChild(window.el ? window.el('<a class="backlink" href="#/">← На главную</a>') : document.createTextNode(""));

    var isTeacher = window.state.staff && (window.state.staff.role === "teacher" || window.state.staff.role === "admin");
    if (!isTeacher) {
        app.innerHTML += '<div class="module" style="text-align:center; color:var(--err); font-size:18px; padding:40px;">⛔ Доступ только для преподавателя.</div>';
        return;
    }

    app.innerHTML += '<div id="journalData" class="module"><p>Загрузка данных...</p></div>';

    if (!window.API || !window.API.getStudents) {
        document.getElementById("journalData").innerHTML = "<p style='color:red;'>API не загружено!</p>";
        return;
    }

    window.API.getStudents().then(res => {
        var container = document.getElementById("journalData");
        if (!res || !res.ok || !res.students) {
            container.innerHTML = `<p style="color:red;">Ошибка загрузки: ${res ? res.error : 'Нет ответа'}</p>`;
            return;
        }

        var students = res.students;
        if (students.length === 0) {
            container.innerHTML = "<p>Студентов пока нет.</p>";
            return;
        }

        var html = `<h3>Список студентов</h3>
        <table class="journal-table">
            <thead><tr><th>ФИО</th><th>Группа</th><th>XP</th><th>Действия</th></tr></thead>
            <tbody>`;

        students.forEach(s => {
            var xp = 0;
            try { xp = JSON.parse(s.payload).xp || 0; } catch(e) {}
            
            html += `<tr>
                <td><b>${s.name}</b></td>
                <td>${s.group}</td>
                <td style="color:var(--accent); font-weight:bold;">${xp} XP</td>
                <td>
                    <button class="btn ghost" style="padding:4px 8px; font-size:12px;" onclick="window.grantXP('${s.key}')">+ XP</button>
                </td>
            </tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }).catch(err => {
        document.getElementById("journalData").innerHTML = `<p style="color:red;">Ошибка сети: ${err.message}</p>`;
    });
};

window.grantXP = function(key) {
    var amount = prompt("Сколько XP начислить?", "50"); 
    if (!amount || isNaN(amount)) return;
    
    if (window.API && window.API.grantXP) {
        window.API.grantXP(key, parseInt(amount)).then(() => { 
            if(window.showToast) window.showToast("Начислено +" + amount + " XP", "ok"); 
            window.renderJournalPage(); 
        }).catch(() => {
            if(window.showToast) window.showToast("Ошибка", "err");
        });
    }
};