"use strict";

window.renderSchedulePage = function(){
  var app = document.getElementById("app"); 
  if (!app) return; 
  app.innerHTML = ""; 
  var crumbs = document.getElementById("crumbs");
  if (crumbs) crumbs.textContent = "Расписание";
  
  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
  
  var isTeacher = window.state.staff && (window.state.staff.role === "teacher" || window.state.staff.role === "admin");
  
  app.appendChild(el(`<section class="hero"><h1>Расписание занятий (1 семестр)</h1><p>${isTeacher ? 'Режим редактирования. Нажмите "Сохранить" после изменений.' : 'Расписание на семестр'}</p></section>`));

  var groups = ["ТМ 2-5", "ТМ 2-6", "ТМ 3-4", "ТМ 4-3"];

  var scheduleStructure = [
    { name: "ПОНЕДЕЛЬНИК", times: [{ t: "8.00-8.45", label: "0 пара" }, { t: "8.50-10.25", label: "1 пара" }, { t: "10.35-12.10", label: "2 пара" }, { t: "12.30-14.05", label: "3 пара" }, { t: "14.15-15.50", label: "4 пара" }] },
    { name: "ВТОРНИК", times: [{ t: "8.00-9.35", label: "1 пара" }, { t: "9.45-11.20", label: "2 пара" }, { t: "11.40-13.15", label: "3 пара" }, { t: "13.25-15.00", label: "4 пара" }, { t: "15.10-16.45", label: "5 пара" }, { t: "16.55-18.30", label: "6 пара" }] },
    { name: "СРЕДА", times: [{ t: "8.00-9.35", label: "1 пара" }, { t: "9.45-11.20", label: "2 пара" }, { t: "11.40-13.15", label: "3 пара" }, { t: "13.25-15.00", label: "4 пара" }, { t: "15.10-16.45", label: "5 пара" }, { t: "16.55-18.30", label: "6 пара" }] },
    { name: "ЧЕТВЕРГ", times: [{ t: "8.00-9.35", label: "1 пара" }, { t: "9.45-11.20", label: "2 пара" }, { t: "11.40-13.15", label: "3 пара" }, { t: "13.25-15.00", label: "4 пара" }, { t: "15.10-16.45", label: "5 пара" }, { t: "16.55-18.30", label: "6 пара" }] },
    { name: "ПЯТНИЦА", times: [{ t: "8.00-9.35", label: "1 пара" }, { t: "9.45-11.20", label: "2 пара" }, { t: "11.40-13.15", label: "3 пара" }, { t: "13.25-15.00", label: "4 пара" }, { t: "15.10-16.45", label: "5 пара" }, { t: "16.55-18.30", label: "6 пара" }] },
    { name: "СУББОТА", times: [{ t: "8.00-9.35", label: "1 пара" }, { t: "9.45-11.20", label: "2 пара" }, { t: "11.40-13.15", label: "3 пара" }, { t: "13.25-15.00", label: "4 пара" }] }
  ];

  var scheduleData = JSON.parse(localStorage.getItem('mdk_schedule') || '{}');

  window.API.getSchedule().then(res => {
      if (res && res.success && res.schedule && Object.keys(res.schedule).length > 0) {
          scheduleData = res.schedule;
      }
      buildTable();
  }).catch(err => {
      console.error("Ошибка загрузки расписания", err);
      buildTable(); // Строим таблицу с локальными данными
  });

  function buildTable() {
    var tableHtml = `<div class="module" style="overflow-x:auto; padding:10px;">
      <table class="schedule-table" style="width:100%; border-collapse:collapse; text-align:center; font-size:12px; min-width:800px;">
        <thead>
          <tr style="background:var(--card-soft);">
            <th style="border:1px solid var(--border); padding:8px; width:120px;">День</th>
            <th style="border:1px solid var(--border); padding:8px; width:100px;">Время</th>`;
            
    groups.forEach(g => { tableHtml += `<th style="border:1px solid var(--border); padding:8px;">${g}</th>`; });
    tableHtml += `</tr></thead><tbody>`;

    scheduleStructure.forEach(dayObj => {
      var day = dayObj.name;
      dayObj.times.forEach((timeObj, timeIdx) => {
        tableHtml += `<tr>`;
        if (timeIdx === 0) {
          tableHtml += `<td rowspan="${dayObj.times.length}" style="border:1px solid var(--border); font-weight:bold; background:var(--card-soft); vertical-align:middle; writing-mode:vertical-rl; transform:rotate(180deg);">${day}</td>`;
        }
        tableHtml += `<td style="border:1px solid var(--border); padding:4px; font-size:12px;"><b>${timeObj.t}</b><br><span style="font-size:10px; color:var(--muted);">${timeObj.label}</span></td>`;

        groups.forEach(group => {
          var cellKey = `${day}_${timeObj.t}_${group}`;
          var cellData = scheduleData[cellKey] || { sub1: "", sub2: "" };

          if (isTeacher) {
            tableHtml += `<td style="border:1px solid var(--border); padding:4px; vertical-align:top;">
              <textarea class="sched-input" data-key="${cellKey}" data-sub="sub1" style="width:100%; border:none; background:transparent; color:var(--text); resize:vertical; font-size:11px; min-height:40px;" placeholder="...">${cellData.sub1 || ''}</textarea>
              <div style="border-top:1px dashed var(--border); margin:2px 0;"></div>
              <textarea class="sched-input" data-key="${cellKey}" data-sub="sub2" style="width:100%; border:none; background:transparent; color:var(--text); resize:vertical; font-size:11px; min-height:40px;" placeholder="...">${cellData.sub2 || ''}</textarea>
            </td>`;
          } else {
            var sub1Html = cellData.sub1 ? `<div style="font-weight:bold; color:var(--text); margin-bottom:4px; white-space:pre-wrap;">${cellData.sub1}</div>` : '';
            var sub2Html = cellData.sub2 ? `<div style="border-top:1px dashed var(--border); padding-top:4px; color:var(--text-soft); white-space:pre-wrap;">${cellData.sub2}</div>` : '';
            var emptyHtml = (!cellData.sub1 && !cellData.sub2) ? '<span style="color:var(--border);">—</span>' : '';
            tableHtml += `<td style="border:1px solid var(--border); padding:6px; vertical-align:top; text-align:left; line-height:1.3;">${sub1Html}${sub2Html}${emptyHtml}</td>`;
          }
        });
        tableHtml += `</tr>`;
      });
      if (day !== "СУББОТА") tableHtml += `<tr><td colspan="${groups.length + 2}" style="height:10px; background:var(--bg); border:none;"></td></tr>`;
    });
    tableHtml += `</tbody></table></div>`;
    
    // БЛОК С КНОПКАМИ ДЛЯ ПРЕПОДАВАТЕЛЯ
    if (isTeacher) {
      tableHtml += `<div style="margin-top:20px; display:flex; justify-content:center; gap:15px;">
        <button class="btn" id="saveScheduleBtn" style="padding:12px 30px; font-size:16px;">💾 Сохранить</button>
        <button class="btn btn-danger" id="clearScheduleBtn" style="padding:12px 30px; font-size:16px;">🗑 Очистить</button>
      </div>`;
    }

    app.innerHTML += tableHtml;

    if (isTeacher) {
      var saveBtn = document.getElementById("saveScheduleBtn");
      if (saveBtn) {
          saveBtn.onclick = function() {
            document.querySelectorAll(".sched-input").forEach(input => {
              var key = input.getAttribute("data-key"), sub = input.getAttribute("data-sub"), val = input.value.trim();
              if (!scheduleData[key]) scheduleData[key] = { sub1: "", sub2: "" };
              scheduleData[key][sub] = val;
            });
            localStorage.setItem('mdk_schedule', JSON.stringify(scheduleData));
            window.API.saveSchedule(scheduleData);
            window.showToast("Расписание сохранено!", "ok");
          };
      }
      
      var clearBtn = document.getElementById("clearScheduleBtn");
      if (clearBtn) {
          clearBtn.onclick = function() {
            if (confirm("Вы уверены, что хотите полностью очистить расписание?")) {
              scheduleData = {};
              localStorage.removeItem('mdk_schedule');
              window.API.saveSchedule({});
              window.showToast("Расписание очищено", "info");
              window.renderSchedulePage();
            }
          };
      }
    }
  }
};