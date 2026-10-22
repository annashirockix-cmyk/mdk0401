"use strict";

function getAcademicYearDates() {
    var dates = [];
    var start = new Date(2026, 8, 1);
    var end = new Date(2027, 7, 1);
    var current = new Date(start);
    while (current <= end) {
        var d = String(current.getDate()).padStart(2, '0');
        var m = String(current.getMonth() + 1).padStart(2, '0');
        var y = String(current.getFullYear()).slice(-2);
        dates.push(d + '.' + m + '.' + y);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

var ACADEMIC_DATES = getAcademicYearDates();
var CURRENT_STUDENTS_CACHE = [];

window.renderJournalPage = function() {
  var app = document.getElementById("app"); 
  if (!app) return; 
  app.innerHTML = ""; 
  document.getElementById("crumbs").textContent = "Журнал";
  
  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));

  var isTeacher = window.state.staff && (window.state.staff.role === "teacher" || window.state.staff.role === "admin");
  if (!isTeacher) {
      app.innerHTML += '<div class="module" style="text-align:center; color:var(--err); font-size:18px; padding:40px;">⛔ Доступ к журналу имеет только преподаватель.</div>';
      return;
  }

  // Вкладки: успеваемость по МДК и ручные оценки
  app.innerHTML += `<div style="display:flex; gap:10px; margin-bottom:20px;">
    <button class="btn" id="tabAuto" style="flex:1;">📊 Успеваемость по МДК</button>
    <button class="btn ghost" id="tabManual" style="flex:1;">📝 Ручные оценки</button>
  </div>`;

  var contentWrap = el('<div id="journalContent"></div>');
  app.appendChild(contentWrap);

  function renderAuto() {
      contentWrap.innerHTML = '<div class="skeleton" style="height:200px;"></div>';
      var courseId = window.state.activeCourseId;
      var course = window.MDK_DATA[courseId];
      if (!course) {
          contentWrap.innerHTML = '<div class="module">Курс не найден.</div>';
          return;
      }

      // Собираем все работы для этого МДК
      var works = [];
      course.sections.forEach(s => {
          s.topics.forEach(t => {
              if (t.practicals) t.practicals.forEach((p, i) => works.push({ id: `prac_${t.id}_${i}`, title: `${t.code} ${p.code}`, type: 'prac' }));
              if (t.selfWork) t.selfWork.forEach((sw, i) => works.push({ id: `self_${t.id}_${i}`, title: `${t.code} ${sw.code || ''}`, type: 'self' }));
              if (t.test) works.push({ id: `inline_${t.id}`, title: `${t.code} Тест`, type: 'test' });
          });
      });

      window.API.getStudents().then(d => {
          contentWrap.innerHTML = "";
          if (!d || !d.ok || !d.students || !d.students.length) {
              contentWrap.innerHTML = "<div class='module'>Студентов пока нет.</div>";
              return;
          }

          var students = d.students;
          CURRENT_STUDENTS_CACHE = students;

          var table = document.createElement("table");
          table.className = "journal-table";
          table.style = "border-collapse:collapse; text-align:center; font-size:13px; min-width:max-content;";

          var thead = document.createElement("thead");
          var trHead = document.createElement("tr");
          
          var thName = document.createElement("th");
          thName.style = "border:1px solid var(--border); padding:8px; position:sticky; left:0; background:var(--card); z-index:2; text-align:left; min-width:180px;";
          thName.textContent = "ФИО студента / Группа";
          trHead.appendChild(thName);

          works.forEach(w => {
              var th = document.createElement("th");
              th.style = "border:1px solid var(--border); padding:4px; min-width:80px; font-size:11px; writing-mode:vertical-rl; transform:rotate(180deg); height:100px;";
              th.textContent = w.title;
              trHead.appendChild(th);
          });

          thead.appendChild(trHead);
          table.appendChild(thead);

          var tbody = document.createElement("tbody");

          students.forEach((s) => {
              var sKey = s.name.trim().toLowerCase() + "|" + s.group.trim().toLowerCase();
              var tr = document.createElement("tr");
              var p = {}; try { p = JSON.parse(s.payload || "{}"); } catch(e) {}
              var results = p.results || {};

              var tdName = document.createElement("td");
              tdName.style = "border:1px solid var(--border); padding:8px; text-align:left; font-weight:bold; position:sticky; left:0; background:var(--card); z-index:1;";
              tdName.innerHTML = window.escapeHtml(s.name) + "<br><span style='font-size:11px;color:var(--accent);font-weight:normal;'>гр. " + window.escapeHtml(s.group) + "</span>";
              tr.appendChild(tdName);

              works.forEach(w => {
                  var td = document.createElement("td");
                  td.style = "border:1px solid var(--border); padding:4px; text-align:center;";
                  var grade = results[w.id] ? results[w.id].grade : "—";
                  var color = grade >= 4 ? "var(--ok)" : (grade >= 3 ? "var(--gold)" : (grade === "—" ? "var(--muted)" : "var(--err)"));
                  td.innerHTML = `<b style="color:${color}; font-size:16px;">${grade}</b>`;
                  tr.appendChild(td);
              });

              tbody.appendChild(tr);
          });

          table.appendChild(tbody);
          var wrap = document.createElement("div");
          wrap.className = "module";
          wrap.style = "overflow-x:auto; padding:10px;";
          wrap.appendChild(table);
          contentWrap.appendChild(wrap);
      }).catch(err => {
          contentWrap.innerHTML = `<div class="module" style="color:var(--err);">Ошибка: ${err.message}</div>`;
      });
  }

  function renderManual() {
      contentWrap.innerHTML = '<div class="skeleton" style="height:200px;"></div>';
      window.API.getStudents().then(d => {
          contentWrap.innerHTML = "";
          if (!d || !d.ok || !d.students || !d.students.length) {
              contentWrap.innerHTML = "<div class='module'>Студентов пока нет.</div>";
              return;
          }
          var students = d.students;
          CURRENT_STUDENTS_CACHE = students;

          var table = document.createElement("table");
          table.className = "journal-table";
          table.style = "border-collapse:collapse; text-align:center; font-size:13px; min-width:max-content;";

          var thead = document.createElement("thead");
          var trHead = document.createElement("tr");
          
          var thName = document.createElement("th");
          thName.style = "border:1px solid var(--border); padding:8px; position:sticky; left:0; background:var(--card); z-index:2; text-align:left; min-width:180px;";
          thName.textContent = "ФИО студента / Группа";
          trHead.appendChild(thName);

          ACADEMIC_DATES.forEach(date => {
              var th = document.createElement("th");
              th.style = "border:1px solid var(--border); padding:4px; min-width:35px; font-size:11px; writing-mode:vertical-rl; transform:rotate(180deg); height:80px;";
              th.textContent = date;
              trHead.appendChild(th);
          });

          thead.appendChild(trHead);
          table.appendChild(thead);

          var tbody = document.createElement("tbody");

          students.forEach((s) => {
              var sKey = s.name.trim().toLowerCase() + "|" + s.group.trim().toLowerCase();
              var tr = document.createElement("tr");
              var p = {}; try { p = JSON.parse(s.payload || "{}"); } catch(e) {}
              var manualGrades = p.manualGrades || {};

              var tdName = document.createElement("td");
              tdName.style = "border:1px solid var(--border); padding:8px; text-align:left; font-weight:bold; position:sticky; left:0; background:var(--card); z-index:1;";
              tdName.innerHTML = window.escapeHtml(s.name) + "<br><span style='font-size:11px;color:var(--accent);font-weight:normal;'>гр. " + window.escapeHtml(s.group) + "</span>";
              tr.appendChild(tdName);

              ACADEMIC_DATES.forEach(date => {
                  var td = document.createElement("td");
                  td.style = "border:1px solid var(--border); padding:2px;";
                  var input = document.createElement("input");
                  input.type = "text"; input.maxLength = 3;
                  input.value = manualGrades[date] || "";
                  input.placeholder = "-";
                  input.style = "width:32px; height:32px; text-align:center; font-weight:bold; border:1px solid transparent; background:transparent; color:var(--text); border-radius:4px; font-size:14px;";

                  input.onchange = function() {
                      var val = this.value.trim();
                      var newPayload = { ...p };
                      if (!newPayload.manualGrades) newPayload.manualGrades = {};
                      if (val) newPayload.manualGrades[date] = val;
                      else delete newPayload.manualGrades[date];

                      this.style.background = "var(--accent-soft)";
                      window.API.saveStudent(sKey, s.name, s.group, JSON.stringify(newPayload)).then(res => {
                          if(res.ok) {
                              setTimeout(() => input.style.background = "transparent", 500);
                              p = newPayload;
                              renderManual();
                          }
                      });
                  };
                  input.onfocus = function() { this.style.borderColor = "var(--accent)"; this.style.background = "var(--card-soft)"; };
                  input.onblur = function() { this.style.borderColor = "transparent"; this.style.background = "transparent"; };

                  td.appendChild(input);
                  tr.appendChild(td);
              });

              tbody.appendChild(tr);
          });

          table.appendChild(tbody);
          var wrap = document.createElement("div");
          wrap.className = "module";
          wrap.style = "overflow-x:auto; padding:10px;";
          wrap.appendChild(table);
          contentWrap.appendChild(wrap);
      }).catch(err => {
          contentWrap.innerHTML = `<div class="module" style="color:var(--err);">Ошибка: ${err.message}</div>`;
      });
  }

  document.getElementById("tabAuto").onclick = function() {
      this.classList.remove("ghost");
      document.getElementById("tabManual").classList.add("ghost");
      renderAuto();
  };
  document.getElementById("tabManual").onclick = function() {
      this.classList.remove("ghost");
      document.getElementById("tabAuto").classList.add("ghost");
      renderManual();
  };

  // По умолчанию показываем успеваемость по МДК
  renderAuto();
};