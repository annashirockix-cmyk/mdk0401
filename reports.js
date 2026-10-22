"use strict";

window.renderCourseReportsPage = function() {
  var app = document.getElementById("app"); 
  if (!app) return; 
  app.innerHTML = ""; 
  document.getElementById("crumbs").textContent = "Отчеты по курсам";
  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));

  if (!window.state.staff) { app.innerHTML += '<div class="module" style="color:var(--err); padding:40px; text-align:center;">⛔ Доступ только для преподавателя.</div>'; return; }

  var topPanel = el(`<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; align-items:center;">
      <h2 style="margin:0; font-size:20px;">📊 Отчеты</h2>
      <div style="margin-left:auto; display:flex; gap:10px;">
          <button class="btn" id="btnExportExcel" style="padding:10px 20px; background:var(--ok); color:#000;">📥 Экспорт в Excel</button>
          <button class="btn" id="btnRefreshReports" style="padding:10px 20px;">🔄 Обновить</button>
      </div>
  </div>`);
  app.appendChild(topPanel);
  var contentWrap = el('<div id="reportsContent"></div>'); app.appendChild(contentWrap);

  var cachedStudents = [];

  function renderTable() {
      contentWrap.innerHTML = '<div class="skeleton" style="height:200px;"></div>';
      
      window.API.getStudents().then(d => {
          contentWrap.innerHTML = "";
          if (!d || !d.ok || !d.students || !d.students.length) { 
              contentWrap.innerHTML = "<div class='module'>Нет студентов.</div>"; 
              return; 
          }
          
          cachedStudents = d.students;
          var table = document.createElement("table"); 
          table.className = "journal-table"; 
          table.style = "width:100%; border-collapse:collapse; text-align:left; font-size:14px;";
          table.innerHTML = `<thead><tr style="background:var(--card-soft);">
              <th style="padding:10px; border:1px solid var(--border);">Студент</th>
              <th style="padding:10px; border:1px solid var(--border); text-align:center;">XP</th>
              <th style="padding:10px; border:1px solid var(--border); text-align:center;">Сдано работ</th>
              <th style="padding:10px; border:1px solid var(--border); text-align:center;">Действия</th>
          </tr></thead>`;

          var tbody = document.createElement("tbody");

          cachedStudents.forEach((s, idx) => {
              var p = {}; try { p = JSON.parse(s.payload || "{}"); } catch(e) {}
              var xp = p.xp || 0; 
              var results = p.results || {};
              var sKey = s.name.trim().toLowerCase() + "|" + s.group.trim().toLowerCase();
              var passedWorks = Object.keys(results).length;

              var tr = document.createElement("tr"); tr.style = "border-bottom:1px solid var(--border);";
              tr.innerHTML += `<td style="padding:10px; border:1px solid var(--border);"><b>${window.escapeHtml(s.name)}</b><br><span style="font-size:12px; color:var(--muted);">гр. ${window.escapeHtml(s.group)}</span></td>`;
              tr.innerHTML += `<td style="padding:10px; border:1px solid var(--border); text-align:center;"><span style="color:var(--gold); font-weight:bold;">${xp}</span></td>`;
              tr.innerHTML += `<td style="padding:10px; border:1px solid var(--border); text-align:center;"><span style="color:var(--ok); font-weight:bold;">${passedWorks}</span></td>`;
              
              tr.innerHTML += `<td style="padding:10px; border:1px solid var(--border); text-align:center;">
                  <button class="btn" style="padding:4px 8px; font-size:12px; background:var(--gold); color:#000;" onclick="window.grantXP('${sKey}')">+ XP</button>
                  <button class="btn ghost" style="padding:4px 8px; font-size:12px; border-color:var(--err); color:var(--err);" onclick="window.deleteStudent('${sKey}', '${s.name}')">🗑</button>
              </td>`;
              
              tbody.appendChild(tr);
          });
          table.appendChild(tbody); 
          var wrap = document.createElement("div"); 
          wrap.className = "module"; 
          wrap.style = "overflow-x:auto; padding:10px;"; 
          wrap.appendChild(table); 
          contentWrap.appendChild(wrap);
      }).catch(err => { contentWrap.innerHTML = `<div class="module" style="color:var(--err);">Ошибка: ${err.message}</div>`; });
  }
  
  document.getElementById("btnRefreshReports").onclick = renderTable;
  
  // ЭКСПОРТ В EXCEL
  document.getElementById("btnExportExcel").onclick = function() {
      if (!cachedStudents.length) return window.showToast("Нет данных", "err");
      
      var csv = "\uFEFF"; // BOM для Excel
      csv += "ФИО;Группа;XP;Сдано работ;Оценки\n";
      
      cachedStudents.forEach(s => {
          var p = {}; try { p = JSON.parse(s.payload || "{}"); } catch(e) {}
          var grades = Object.keys(p.results || {}).map(k => `${k}: ${p.results[k].grade}`).join(", ");
          csv += `"${s.name}";"${s.group}";${p.xp || 0};${Object.keys(p.results || {}).length};"${grades}"\n`;
      });
      
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Отчет_Студенты_${new Date().toLocaleDateString('ru-RU')}.csv`;
      link.click();
  };

  renderTable();
};

// (Функции grantXP, deleteStudent оставляем как были)