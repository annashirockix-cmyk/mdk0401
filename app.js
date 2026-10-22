"use strict";

// ... (оставляем базовые утилиты $, escapeHtml, el, showToast, state без изменений) ...
// СКОПИРУЙТЕ ИХ ИЗ ПРЕДЫДУЩЕГО app.js

// --- ДОБАВЛЯЕМ МОДАЛЬНОЕ ОКНО ТЕМ ---
window.openThemeModal = function() {
    var modal = document.getElementById("themeModalOverlay");
    if (modal) { modal.classList.add("open"); return; }
    
    var themes = [
        { id: "default", title: "Стандарт", bg: "#0e0e10", text: "#e8e6e1" },
        { id: "ury-light", title: "Ury Light", bg: "#FFFFFF", text: "#252525" },
        { id: "ury-dark", title: "Ury Dark", bg: "#2b2b2b", text: "#ebebeb" },
        { id: "ury-sepia", title: "Ury Sepia", bg: "#f3f2ec", text: "#252525" },
        { id: "neon", title: "Киберпанк", bg: "#09090b", text: "#ff00cc" }
    ];

    var html = `<div class="theme-modal-overlay" id="themeModalOverlay" onclick="if(event.target===this) this.classList.remove('open')">
        <div class="theme-modal">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0;">Выбор темы</h2>
                <button class="btn ghost" onclick="document.getElementById('themeModalOverlay').classList.remove('open')">✕</button>
            </div>
            <div class="theme-grid">`;
    
    themes.forEach(t => {
        var active = localStorage.getItem("mdk.theme_active") === t.id || (t.id === "default" && !localStorage.getItem("mdk.theme_active"));
        html += `<div class="theme-card ${active ? 'active' : ''}" onclick="window.applyShopItem('theme', '${t.id}', '')">
            <div class="theme-preview" style="background:${t.bg}; color:${t.text}; display:flex; align-items:center; justify-content:center;">Aa</div>
            <div style="font-weight:bold; font-size:14px;">${t.title}</div>
        </div>`;
    });
    html += `</div></div></div>`;
    
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById("themeModalOverlay").classList.add("open"), 10);
};

// --- ИСПРАВЛЕННЫЙ ПРОСМОТР PDF И ВИДЕО ---
window.renderSimplePage = function(title, items, icon) {
    var app = document.getElementById("app"); app.innerHTML = "";
    document.getElementById("crumbs").textContent = title;
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    app.appendChild(el(`<section class="hero"><h1>${icon} ${title}</h1></section>`));
    var list = el(`<div class="module"></div>`);
    
    if (!items || !items.length) {
        list.innerHTML = "<p>Материалы пока не добавлены.</p>";
    } else {
        items.forEach(item => {
            var isYouTube = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
            var isPdf = item.file && item.file.toLowerCase().endsWith('.pdf');
            var isVideo = item.file && (item.file.toLowerCase().endsWith('.mp4') || item.file.toLowerCase().endsWith('.webm'));
            var link = item.url || item.file;
            
            var mediaHtml = "";
            if (isYouTube) {
                var vidId = item.url.includes('v=') ? item.url.split('v=')[1].split('&')[0] : item.url.split('/').pop();
                mediaHtml = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; margin-top:10px;"><iframe src="https://www.youtube.com/embed/${vidId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`;
            } else if (isVideo) {
                mediaHtml = `<video controls src="${item.file}" style="width:100%; max-height:400px; border-radius:8px; margin-top:10px;"></video>`;
            } else if (isPdf) {
                // Встроенный просмотрщик PDF
                mediaHtml = `<div style="width:100%; height:500px; border-radius:8px; margin-top:10px; border:1px solid var(--border);"><iframe src="${item.file}#toolbar=0" width="100%" height="100%" style="border:none;"></iframe></div>`;
            }

            list.innerHTML += `<div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:8px; background:var(--card-soft);">
                <b style="color:var(--accent); font-size:16px;">${item.title || 'Без названия'}</b><br>
                <span style="font-size:14px; color:var(--muted);">${item.description || item.content || ''}</span>
                ${mediaHtml}
                ${link && !isYouTube && !isVideo && !isPdf ? `<br><a href="${link}" target="_blank" class="btn" style="margin-top:10px; padding:8px 16px;">📥 Открыть ссылку</a>` : ''}
            </div>`;
        });
    }
    app.appendChild(list);
};

// --- ИСПРАВЛЕННЫЙ СЕРТИФИКАТ (С фонами jfif) ---
window.renderCertificatePage = function() {
    var app = $("app"); if (!app) return; app.innerHTML = "";
    app.appendChild(el('<a class="backlink no-print" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    if (!window.state.student && !window.state.staff) return;

    var isTeacher = !!window.state.staff;
    var name = isTeacher ? window.state.staff.name : window.state.student.name;
    var courseName = window.COURSE ? window.COURSE.title : "МДК";

    if (isTeacher) {
        var teacherCert = `
            <div id="printable-cert" style="background:#fff; color:#000; padding:40px; border-radius:12px; max-width:800px; margin:0 auto; text-align:center; border: 10px double #c14a2a; box-sizing:border-box;">
                <h1 style="font-size:40px; color:#c14a2a; text-transform:uppercase; margin-bottom:20px;">БЛАГОДАРНОСТЬ</h1>
                <p style="font-size:20px; margin:40px 0;">Настоящая грамота вручается</p>
                <h2 style="font-size:36px; border-bottom:2px solid #ccc; display:inline-block; padding-bottom:10px; margin-bottom:20px;">${window.escapeHtml(name)}</h2>
                <p style="font-size:18px; margin-top:40px;">За активное участие в разработке и проведении учебного курса</p>
                <h3 style="font-size:24px; color:#000; margin:20px 0;">${window.escapeHtml(courseName)}</h3>
                <div style="display:flex; justify-content:space-between; margin-top:60px; font-size:16px;">
                    <div>Дата: ${new Date().toLocaleDateString('ru-RU')}</div>
                    <div>Подпись: _______________</div>
                </div>
            </div>
        `;
        app.innerHTML = `<div class="no-print" style="text-align:center; margin-bottom:20px;"><button class="btn" onclick="window.print()">🖨 Распечатать грамоту</button></div>` + teacherCert;
        return;
    }

    // Студент
    var p = {}; try { p = JSON.parse(localStorage.getItem("mdk.results." + encodeURIComponent(window.studentKey()))) || {}; } catch(e) {}
    var isApproved = p.certificateApproved || false;
    var bgs = ["bg1.jfif", "bg2.jfif", "bg3.jfif", "bg4.jfif", "bg5.jfif", "bg6.jfif"];
    
    var certBgSelectorHtml = `<div class="no-print" style="margin-bottom:20px; text-align:center;"><h3 style="margin-bottom:10px;">Фон сертификата:</h3><div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">`;
    bgs.forEach(bg => {
        certBgSelectorHtml += `<img src="certificat/${bg}" class="cert-bg-option ${window.state.certBg === bg ? 'active' : ''}" onclick="window.setCertBg('${bg}')">`;
    });
    certBgSelectorHtml += `</div></div>`;

    var certHtml = `
        <div id="printable-cert" style="background-image: url('certificat/${window.state.certBg}'); background-size: 100% 100%; background-color: #fff; color:#000; padding: 20px; border-radius: 12px; max-width:900px; margin:0 auto; position: relative; aspect-ratio: 1.414 / 1; display: flex; align-items: center; justify-content: center; -webkit-print-color-adjust: exact;">
            <div style="background: rgba(255, 255, 255, 0.85); width: 100%; height: 100%; padding: 30px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; border-radius: 8px;">
                <div>
                    <h1 style="font-size:32px; color:#c14a2a; text-transform:uppercase;">СЕРТИФИКАТ</h1>
                    <p style="font-size:16px;">подтверждает, что</p>
                    <h2 style="font-size:28px; margin:15px 0; color:#000; border-bottom: 2px solid #ccc; display: inline-block;">${window.escapeHtml(window.state.student.name)}</h2>
                    <p style="font-size:16px;">успешно прошел(ла) обучение по программе</p>
                    <h3 style="font-size:20px; margin:15px 0; color:#000;">${window.escapeHtml(courseName)}</h3>
                    <p style="font-size:14px;">Группа: ${window.escapeHtml(window.state.student.group)}</p>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:14px; margin-top:20px;">
                    <div style="text-align:left;"><p>Дата выдачи:</p><p style="font-weight:bold;">${new Date().toLocaleDateString('ru-RU')}</p></div>
                    <div style="text-align:right;"><p>Подпись:</p><div style="border-bottom: 1px solid #000; width: 150px; height: 30px;"></div></div>
                </div>
            </div>
            ${!isApproved ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-30deg); font-size:80px; font-weight:bold; color:rgba(255,0,0,0.15); white-space:nowrap;">ОБРАЗЕЦ</div>` : ""}
        </div>
    `;
    
    app.innerHTML += certBgSelectorHtml + certHtml;
};

// --- ИСПРАВЛЕННЫЙ ПРОФИЛЬ (Для всех) ---
window.renderProfilePage = function() {
  var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
  
  if (window.state.staff) { 
      app.innerHTML += `<section class="module"><h1>Профиль преподавателя</h1><p>${window.escapeHtml(window.state.staff.name)}</p><p>Роль: ${window.state.staff.role}</p></section>`; 
      return; 
  }
  if (!window.state.student) {
      app.innerHTML += `<div class="module">Вы не авторизованы.</div>`;
      return;
  }

  var lvl = window.getLevel(window.state.xp);
  var avHtml = window.state.avatar ? `<img src="${window.state.avatar}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">` : "👨‍🎓";

  app.innerHTML += `<section class="module" style="text-align:center; padding:40px;">
      <div style="width:120px; height:120px; margin:0 auto 20px; border-radius:50%; border:4px solid var(--accent); display:flex; align-items:center; justify-content:center; font-size:60px;">
          ${avHtml}
      </div>
      <h2 style="margin:0 0 10px 0;">${window.state.nickname || window.state.student.name}</h2>
      <p style="color:var(--muted); margin-bottom:15px;">Группа: ${window.state.student.group}</p>
      <div style="display:inline-block; background:var(--card-soft); padding:10px 20px; border-radius:20px;">
          <b style="color:var(--gold);">${window.state.xp} XP</b> · Уровень ${lvl}
      </div>
  </section>`;
};

// --- ИНИЦИАЛИЗАЦИЯ (Заменяем кнопку смены темы) ---
window.addEventListener("DOMContentLoaded", function() {
  // ... (остальной код инициализации без изменений) ...
  
  if ($("themeToggle")) {
      $("themeToggle").onclick = window.openThemeModal; // Открываем модалку!
  }
  
  // ...
});