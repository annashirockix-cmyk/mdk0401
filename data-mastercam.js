"use strict";

window.MDK_DATA = window.MDK_DATA || {};

(function () {
  // --- БАЗОВЫЕ ХЕЛПЕРЫ ---
  function goal(text) {
    return '<div style="border-left:3px solid #38bdf8;padding:8px 12px;margin:12px 0;background:#0f172a;border-radius:0 4px 4px 0;"><b>🎯 Цель занятия.</b> ' + text + '</div>';
  }

  function terms(pairs) {
    var h = '<h3>Ключевые термины</h3><dl style="display:grid;grid-template-columns:auto 1fr;gap:6px 16px;background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;">';
    for (var i = 0; i < pairs.length; i++) {
      h += '<dt style="font-weight:bold;color:#38bdf8;">' + pairs[i][0] + '</dt><dd style="margin:0;color:#94a3b8;">' + pairs[i][1] + '</dd>';
    }
    return h + '</dl>';
  }

  function selfcheck(items) {
    var h = '<h3>Вопросы для самопроверки</h3><ol style="padding-left:20px;">';
    for (var i = 0; i < items.length; i++) h += '<li style="margin:8px 0;color:#cbd5e1;">' + items[i] + '</li>';
    return h + '</ol>';
  }

  function testBlock() {
    return '<p style="color:#94a3b8;font-size:13px;margin-top:20px;border-top:1px solid #334155;padding-top:10px;">После изучения теории пройдите тест для закрепления материала.</p>';
  }

  function tq(q, options, correct) {
    return { q: q, options: options, correct: correct };
  }

  function lec(code, title, content) {
    return { code: code, title: title, content: content };
  }

  function topic(id, code, title, lecture, tests) {
    return { id: id, code: code, title: title, lectures: [lecture], practicals: [], selfWork: [], test: tests || [] };
  }

  function practical(steps) {
    var out = '<h3>Практическая работа (Выполните в Mastercam)</h3><ol style="padding-left:20px;line-height:1.6;">';
    for (var i = 0; i < steps.length; i++) out += "<li style='margin-bottom:6px;'>" + steps[i] + "</li>";
    return out + "</ol>";
  }

  function tasks(list) {
    var out = '<h3>Практические задачи для отработки</h3>';
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      out += '<div style="border-left:3px solid #f59e0b;padding:10px 14px;margin:12px 0;background:rgba(15,23,42,0.6);border-radius:0 6px 6px 0;">';
      out += '<b>Задача ' + (i + 1) + '. ' + t.t + '</b>';
      if (t.s) {
        out += '<ol style="margin:6px 0 6px 20px;padding:0;">';
        for (var j = 0; j < t.s.length; j++) out += '<li style="margin:4px 0;color:#cbd5e1;">' + t.s[j] + '</li>';
        out += '</ol>';
      }
      if (t.c) out += '<div style="color:#4ade80;font-size:13px;margin-top:6px;">&#10003; <b>Критерий проверки:</b> ' + t.c + '</div>';
      out += '</div>';
    }
    return out;
  }

  // --- ИНТЕРАКТИВНЫЕ ВИЗУАЛИЗАТОРЫ (ИСПРАВЛЕНЫ) ---

  function simGcode(title, starterCode, description) {
    var CS = '</' + 'script>';
    var starterJs = JSON.stringify(starterCode).replace(/</g, '\\u003c');
    var html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:12px}
      textarea{width:100%;height:150px;font-family:Consolas,monospace;background:#1e293b;color:#f1f5f9;border:1px solid #475569;border-radius:6px;padding:8px;font-size:13px;resize:vertical}
      button{background:#38bdf8;color:#0f172a;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin:8px 8px 8px 0}
      canvas{display:block;background:#f8fafc;border:1px solid #475569;border-radius:6px;margin-top:8px;max-width:100%}
      .hint{color:#94a3b8;font-size:13px;}
    </style></head><body>
    <h4>${title}</h4><p class="hint">${description}</p>
    <textarea id="code"></textarea>
    <div><button id="run">&#9654; Отрисовать</button></div>
    <canvas id="c" width="600" height="400"></canvas>
    <script>
      var STARTER=${starterJs};
      var cv=document.getElementById("c"),ctx=cv.getContext("2d");
      var ta=document.getElementById("code");ta.value=STARTER;
      
      function drawGrid(){
        ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,cv.width,cv.height);
        ctx.strokeStyle="#cbd5e1";ctx.lineWidth=1;ctx.beginPath();
        for(var i=0;i<cv.width;i+=20){ctx.moveTo(i,0);ctx.lineTo(i,cv.height);}
        for(var j=0;j<cv.height;j+=20){ctx.moveTo(0,j);ctx.lineTo(cv.width,j);}
        ctx.stroke();
        ctx.strokeStyle="#94a3b8";ctx.beginPath();
        for(var i=0;i<cv.width;i+=100){ctx.moveTo(i,0);ctx.lineTo(i,cv.height);}
        for(var j=0;j<cv.height;j+=100){ctx.moveTo(0,j);ctx.lineTo(cv.width,j);}
        ctx.stroke();
        ctx.strokeStyle="#ef4444";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,200);ctx.lineTo(600,200);ctx.stroke();
        ctx.strokeStyle="#3b82f6";ctx.beginPath();ctx.moveTo(300,0);ctx.lineTo(300,400);ctx.stroke();
        ctx.fillStyle="#475569";ctx.font="12px monospace";ctx.fillText("X+",580,195);ctx.fillText("Y+",305,15);
      }

      function run(){
        drawGrid();
        var txt=ta.value.toUpperCase();var lines=txt.split(/\\n/);
        var x=300,y=200,rapid=true;var paths=[];
        for(var i=0;i<lines.length;i++){
          var L=lines[i].split("(")[0].replace(/\\s+/g," ").trim();if(!L)continue;
          if(L.indexOf("G0")>-1)rapid=true;if(L.indexOf("G1")>-1)rapid=false;
          var xm=L.match(/X(-?[\\d.]+)/);var ym=L.match(/Y(-?[\\d.]+)/);
          var nx=x,ny=y;
          if(xm)nx=300+parseFloat(xm[1])*2;
          if(ym)ny=200-parseFloat(ym[1])*2;
          if(nx!==x||ny!==y){paths.push({x1:x,y1:y,x2:nx,y2:ny,r:rapid});x=nx;y=ny;}
        }
        for(var k=0;k<paths.length;k++){
          var p=paths[k];ctx.beginPath();ctx.moveTo(p.x1,p.y1);ctx.lineTo(p.x2,p.y2);
          ctx.strokeStyle=p.r?"#ef4444":"#10b981";ctx.lineWidth=p.r?1:2;
          if(p.r)ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
        }
      }
      document.getElementById("run").onclick=run;
      drawGrid();run();
    ${CS}</body></html>`;
    var escaped = html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<iframe srcdoc="' + escaped + '" sandbox="allow-scripts" style="width:100%;max-width:620px;height:580px;border:1px solid #475569;border-radius:8px;background:#0f172a;display:block;margin:12px 0;"></iframe>';
  }

  function turningVisualizer(title, description) {
    var html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:system-ui;background:#0f172a;color:#e2e8f0;margin:0;padding:12px}
      canvas{background:#1e293b;border:1px solid #475569;border-radius:8px;display:block;margin:10px 0;max-width:100%}
      button{background:#10b981;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:bold;margin-right:10px}
    </style></head><body>
    <h4>${title}</h4><p style="font-size:13px;color:#94a3b8">${description}</p>
    <button id="btn">&#9654; Выполнить проход</button>
    <canvas id="c" width="600" height="300"></canvas>
    <script>
      var cv=document.getElementById("c"),ctx=cv.getContext("2d");
      var stage=0;
      function draw(){
        ctx.clearRect(0,0,600,300);
        ctx.fillStyle="#475569";ctx.fillRect(100,50,400,200);
        ctx.fillStyle="#94a3b8";ctx.fillRect(100,50,200,200);
        ctx.fillStyle="#cbd5e1";ctx.fillRect(100,50,100,200);
        ctx.fillStyle="#38bdf8";ctx.fillRect(100,50,50,200);
        ctx.strokeStyle="#ef4444";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(50,150);ctx.lineTo(550,150);ctx.stroke();
        ctx.fillStyle="#ef4444";ctx.fillText("Z",560,155);
        ctx.strokeStyle="#3b82f6";ctx.beginPath();ctx.moveTo(100,30);ctx.lineTo(100,270);ctx.stroke();
        ctx.fillStyle="#3b82f6";ctx.fillText("X",90,20);
        
        if(stage===1){ ctx.fillStyle="#f59e0b";ctx.fillRect(300,60,20,20); }
        if(stage===2){ ctx.fillStyle="#f59e0b";ctx.fillRect(200,60,20,20); }
        if(stage===3){ ctx.fillStyle="#f59e0b";ctx.fillRect(150,60,20,20); }
        
        ctx.fillStyle="#f8fafc";ctx.font="14px sans-serif";
        if(stage===0)ctx.fillText("Заготовка",120,40);
        if(stage===1)ctx.fillText("Черновой проход (Rough)",300,40);
        if(stage===2)ctx.fillText("Получистовой проход (Semi-Finish)",200,40);
        if(stage===3)ctx.fillText("Чистовой проход (Finish)",150,40);
      }
      document.getElementById("btn").onclick=function(){stage++; if(stage>3)stage=0; draw();};
      draw();
    ${CS}</body></html>`;
    var escaped = html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<iframe srcdoc="' + escaped + '" sandbox="allow-scripts" style="width:100%;max-width:620px;height:440px;border:1px solid #475569;border-radius:8px;background:#0f172a;display:block;margin:12px 0;"></iframe>';
  }

  function zeroPointVisualizer() {
    var html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:system-ui;background:#0f172a;color:#e2e8f0;margin:0;padding:12px}
      canvas{background:#1e293b;border:1px solid #475569;border-radius:8px;display:block;margin:10px 0;max-width:100%}
    </style></head><body>
    <h4>База X0Y0Z0 (Ноль программы)</h4><p style="font-size:13px;color:#94a3b8">Верхний левый угол заготовки — это X0 Y0 Z0. Отсюда станок начинает отсчет.</p>
    <canvas id="c" width="500" height="300"></canvas>
    <script>
      var cv=document.getElementById("c"),ctx=cv.getContext("2d");
      ctx.fillStyle="#334155";ctx.fillRect(100,100,200,150);
      ctx.strokeStyle="#cbd5e1";ctx.lineWidth=2;ctx.strokeRect(100,100,200,150);
      ctx.fillStyle="#ef4444";ctx.beginPath();ctx.arc(100,100,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#f8fafc";ctx.font="14px monospace";
      ctx.fillText("X0 Y0 Z0",110,95);
      ctx.strokeStyle="#ef4444";ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(180,100);ctx.stroke();
      ctx.fillStyle="#ef4444";ctx.fillText("X+",185,105);
      ctx.strokeStyle="#10b981";ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(100,40);ctx.stroke();
      ctx.fillStyle="#10b981";ctx.fillText("Y+",80,40);
    ${CS}</body></html>`;
    var escaped = html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<iframe srcdoc="' + escaped + '" sandbox="allow-scripts" style="width:100%;max-width:520px;height:400px;border:1px solid #475569;border-radius:8px;background:#0f172a;display:block;margin:12px 0;"></iframe>';
  }

  // --- НАЧАЛО СОДЕРЖИМОГО КУРСА ---
  window.MDK_DATA["MCAM"] = {
    id: "MCAM", shortName: "Mastercam", title: "Mastercam — Полный курс", module: "Углубленный курс по системе Mastercam: от интерфейса до постпроцессирования",
    sections: [
      {
        code: "Раздел 1", title: "Обзор интерфейса и настройка",
        topics: [
          topic(
            "mc-t11", "Урок 1.1", "Ленточный интерфейс и менеджеры",
            lec("1.1.1", "Изучение структуры окна Mastercam",
              goal("Освоить расположение инструментов и научиться настраивать рабочее пространство.") +
              "<p>Ленточный интерфейс Mastercam использует стандартные элементы управления Windows. Вкладки на ленте команд упорядочены слева направо в последовательности этапов подготовки программы обработки.</p>" +
              "<h3>Основные элементы интерфейса</h3>" +
              "<ul>" +
              "<li><b>Панель быстрого доступа (Quick Access Toolbar):</b> настраиваемый набор наиболее используемых функций (Сохранить, Открыть, Отменить). Может располагаться сверху или снизу ленты.</li>" +
              "<li><b>Лента (Ribbon):</b> вкладки File, Home, Wireframe, Surfaces, Solids, Model Prep, Drafting, Transform, Machine, View, Toolpaths. Порядок соответствует этапам работы.</li>" +
              "<li><b>Панель выбора:</b> объединяет опции автокурсора и инструменты выбора объектов (Стандартный выбор и Твердотельный выбор).</li>" +
              "<li><b>Быстрые маски:</b> специальный инструмент для выбора только объектов определенного типа (линии, дуги, точки). Оформлены в виде разделенных пополам кнопок.</li>" +
              "<li><b>Строка состояния (внизу):</b> отображает координаты курсора, активные планы (Cplane, Tplane, WCS), глубину Z и режимы отображения (каркас, закраска).</li>" +
              "<li><b>Менеджеры (слева):</b> панели для работы с деревьями: <i>Toolpaths</i> (Траектории), <i>Solids</i> (Тела), <i>Planes</i> (Планы), <i>Levels</i> (Слои).</li>" +
              "</ul>" +
              terms([
                ["Cplane (Construction Plane)", "Плоскость конструирования. В ней создаются 2D-элементы (X, Y)."],
                ["Tplane (Tool Plane)", "Плоскость инструмента. Определяет, с какой стороны детали подходит ось Z (шпиндель)."],
                ["WCS (Working Coordinate System)", "Рабочая система координат. Глобальный ноль детали (G54)."]
              ]) +
              practical([
                "Запустите Mastercam 2022.",
                "Нажмите File -> New (Создать). Выберите Mill -> Default (Фрезерный станок).",
                "Раскройте выпадающее меню Настроить панель быстрого доступа (Customize Quick Access Toolbar) и выберите 'Показать под лентой' (Show Below the Ribbon).",
                "Закрепите вкладки Toolpaths и Solids на ленте рядом.",
                "Разверните менеджер Траектории (Toolpaths) слева, потянув за его заголовок.",
                "В строке состояния (внизу) убедитесь, что активны: CPLANE: TOP, TPLANE: TOP, WCS: TOP.",
                "Нажмите F9, чтобы отобразить гномон (оси) в центре экрана."
              ]) +
              selfcheck([
                "Где в Mastercam отображается текущая глубина по оси Z?",
                "Чем отличается менеджер Слои (Levels) от менеджера Планы (Planes)?",
                "Как включить отображение осей координат в графическом окне?"
              ]) +
              testBlock()
            ),
            [
              tq("Где настраивается расположение Панели быстрого доступа?", ["В выпадающем меню настройки панели", "В менеджере слоев", "В файле post", "В свойствах заготовки"], 0),
              tq("Какая клавиша включает отображение осей (Гномон)?", ["F9", "F1", "Alt+F9", "End"], 0),
              tq("Что отображается в строке состояния?", ["Координаты курсора и активные планы", "Список инструментов", "Траектории", "Настройки постпроцессора"], 0)
            ]
          ),
          topic(
            "mc-t12", "Урок 1.2", "Функционал вкладки Файл (File) и Zip2Go",
            lec("1.2.1", "Управление проектами и сохранение",
              goal("Научиться открывать, сохранять проекты и передавать их вместе со всеми настройками.") +
              "<p>Меню <b>Файл (File)</b> представляет собой страницу с вкладками для управления проектом и настройками системы.</p>" +
              "<ul>" +
              "<li><b>Info (Инфо):</b> Свойства проекта, включая дату создания и размер.</li>" +
              "<li><b>New (Новый):</b> Создание пустого файла.</li>" +
              "<li><b>Open (Открыть):</b> Загрузка файлов Mastercam (.mcam) и сторонних форматов (STEP, IGES, SLDPRT).</li>" +
              "<li><b>Save Some (Сохранить часть):</b> Сохранение только выбранных объектов в новый файл.</li>" +
              "<li><b>Zip2Go:</b> <b>Важнейшая функция!</b> Создает архив (.Z2G или .ZIP), в который упаковывает сам файл детали, а также <i>все связанные с ним библиотеки инструментов, материалы, постпроцессоры и настройки станка</i>. Это нужно для передачи проекта на другой компьютер, где этих библиотек может не быть.</li>" +
              "<li><b>Convert (Конвертация):</b> Мастер миграции (Migration Wizard) для обновления старых файлов.</li>" +
              "</ul>" +
              practical([
                "Нажмите File -> Open. Выберите файл BRACE.mcam из папки Samples (Образцы).",
                "Откройте File -> Save As. Сохраните файл под новым именем (например, My_Brace.mcam).",
                "Выберите несколько поверхностей на детали.",
                "Зайдите в File -> Save Some. Убедитесь, что сохраняются только выбранные объекты.",
                "Нажмите File -> Zip2Go. Изучите список файлов, которые будут упакованы в архив.",
                "Нажмите Create File, чтобы создать архив .Z2G."
              ]) +
              selfcheck([
                "Зачем нужна утилита Zip2Go?",
                "Как сохранить только часть геометрии в отдельный файл?"
              ]) + testBlock()
            ),
            [
              tq("Что делает Zip2Go?", ["Упаковывает файл детали вместе с библиотеками и постами", "Удаляет лишние операции", "Создает G-код"], 0),
              tq("Что позволяет сделать Save Some?", ["Сохранить только выбранные объекты", "Сохранить файл в формате PDF", "Отправить файл на печать"], 0)
            ]
          ),
          topic(
            "mc-t13", "Урок 1.3", "Отображение детали и Навигация",
            lec("1.3.1", "Виды, масштабирование и анализ геометрии",
              goal("Научиться быстро ориентироваться в 3D-пространстве и измерять элементы детали.") +
              "<p>Для эффективной работы с 3D-моделями необходимо освоить манипуляции мышью и инструменты масштабирования.</p>" +
              "<h3>Управление视图ом</h3>" +
              "<ul>" +
              "<li><b>Вращение (Dynamic Rotation):</b> Зажмите среднюю кнопку мыши (колесо) и двигайте мышью. Вращение происходит вокруг точки, где был курсор.</li>" +
              "<li><b>Панорамирование (Pan):</b> Зажмите [Shift] + среднюю кнопку мыши.</li>" +
              "<li><b>Масштабирование (Zoom):</b> Крутите колесико мыши. Или используйте кнопку <b>Window</b> (рамкой) и <b>Fit</b> (В размер окна - Alt+F1).</li>" +
              "</ul>" +
              "<h3>Инструменты анализа (Analyze)</h3>" +
              "<p>Находятся на вкладке Home. Позволяют измерить:</p>" +
              "<ul>" +
              "<li><b>Analyze Distance:</b> расстояние между двумя точками.</li>" +
              "<li><b>Analyze Entity:</b> свойства конкретного элемента (длина, радиус, координаты центра, цвет, слой).</li>" +
              "<li><b>Analyze Angle:</b> угол между линиями.</li>" +
              "<li><b>Dynamic Analysis:</b> наведите курсор на грань, и Mastercam покажет её площадь, нормаль и т.д.</li>" +
              "</ul>" +
              practical([
                "Откройте деталь BRACE.mcam.",
                "Нажмите Alt+F1 (Fit), чтобы деталь вписалась в окно.",
                "Вращайте деталь средней кнопкой мыши.",
                "Нажмите и удерживайте Shift, затем перемещайте мышь средней кнопкой, чтобы сдвинуть деталь в сторону.",
                "На вкладке Home выберите Analyze -> Analyze Distance. Укажите на два верхних ребра детали, чтобы измерить расстояние между ними.",
                "Выберите Analyze -> Analyze Entity. Кликните на скругление, чтобы узнать его радиус.",
                "Включите режим отображения 'Закраска с внешними границами' (Outline Shaded) в строке состояния."
              ]) +
              selfcheck([
                "Как измерить радиус конкретной дуги?",
                "Какая комбинация клавиш позволяет вернуть деталь в размер экрана?"
              ]) + testBlock()
            ),
            [
              tq("Какая комбинация клавиш масштабирует деталь по размеру окна?", ["Alt+F1", "Ctrl+S", "F9", "Shift+Delete"], 0),
              tq("Что делает инструмент Analyze Entity?", ["Показывает свойства элемента (длину, радиус)", "Удаляет элемент", "Меняет цвет"], 0)
            ]
          )
        ]
      },
      {
        code: "Раздел 2", title: "Подготовка проекта",
        topics: [
          topic(
            "mc-t21", "Урок 2.1", "Работа со слоями (Levels)",
            lec("2.1.1", "Организация геометрии",
              goal("Научиться разделять 2D и 3D геометрию по слоям для удобной работы.") +
              "<p>В проекте Mastercam можно распределить по слоям каркасные элементы, твердотельные объекты, поверхности, элементы оформления. Это позволяет управлять видимостью объектов и защищает их от случайного редактирования.</p>" +
              "<h3>Менеджер Слои (Levels)</h3>" +
              "<ul>" +
              "<li><b>Зеленая галочка (Number):</b> обозначает <i>активный слой</i>. Вся новая геометрия создается на нем.</li>" +
              "<li><b>Колонка Visible:</b> если стоит крестик (X), слой виден. Клик по пустой ячейке скрывает слой.</li>" +
              "<li><b>Колонка Name:</b> позволяет задать осмысленное имя слою (например, 'Solid', 'Fixtures', 'Holes').</li>" +
              "<li><b>Колонка Entities:</b> показывает количество объектов на слое.</li>" +
              "<li><b>Опции отображения (Display options):</b> позволяют скрыть пустые слои (Used) или показывать все (Used or named). Также есть опция 'Активный слой всегда виден'.</li>" +
              "</ul>" +
              "<p>Перемещение объектов между слоями: выделите объект, нажмите <b>Change Level</b> на вкладке Home, выберите 'Move' (Переместить) или 'Copy' (Копировать) и укажите номер целевого слоя.</p>" +
              practical([
                "Откройте файл LEVELS_PART.mcam.",
                "Разверните менеджер Слои (Levels). Обратите внимание, что деталь разбита на слои (Wireframe, Solid и т.д.).",
                "Кликните в колонке Visible напротив слоя 'Solid', чтобы скрыть твердое тело. Останется только каркас.",
                "Создайте новый слой: нажмите кнопку с плюсом (Add new level). Введите номер 10 и имя 'MyGeometry'.",
                "Сделайте слой 1 активным (клик по колонке Number).",
                "Выделите верхнюю окружность на детали.",
                "Нажмите Change Level на вкладке Home. Выберите 'Move' и введите номер 10. Окружность перейдет на новый слой.",
                "Проверьте менеджер уровней: на слое 10 должно быть 1 Entity."
              ]) +
              selfcheck([
                "Как сделать слой невидимым?",
                "Что произойдет с новыми объектами, если активен слой 5?",
                "Как перенести объект с одного слоя на другой?"
              ]) + testBlock()
            ),
            [
              tq("Какой слой является активным?", ["Тот, где стоит зеленая галочка", "Тот, где больше всего объектов", "Первый в списке"], 0),
              tq("Что делает опция 'Active level is always visible'?", ["Запрещает скрывать активный слой", "Удаляет слой", "Меняет цвет слоя"], 0),
              tq("Какая кнопка позволяет перенести объект на другой слой?", ["Change Level", "Analyze Entity", "Trim"], 0)
            ]
          ),
          topic(
            "mc-t22", "Урок 2.2", "Виды и системы координат (Planes)",
            lec("2.2.1", "WCS, Cplane, Tplane и Динамический гномон",
              goal("Понять, как Mastercam использует плоскости для рисования и обработки.") +
              "<p>В Mastercam одновременно используются три системы координат. Понимание разницы между ними критически важно для 3D-обработки.</p>" +
              "<h3>Три системы координат</h3>" +
              "<ul>" +
              "<li><b>WCS (Working Coordinate System):</b> Глобальная система координат детали. Это та самая точка G54, которую выставляют на станке. Если вы создаете новую WCS, Mastercam поворачивает весь мир относительно детали.</li>" +
              "<li><b>Cplane (Construction plane):</b> Плоскость, в которой вы рисуете 2D-геометрию. По умолчанию это Top (вид сверху). Если переключить Cplane на Front, то нарисованная окружность будет лежать в вертикальной плоскости.</li>" +
              "<li><b>Tplane (Tool plane):</b> Плоскость, перпендикулярная оси шпинделя. Используется <i>только</i> в траекториях. Она определяет, с какой стороны инструмент будет подходить к детали.</li>" +
              "</ul>" +
              zeroPointVisualizer() +
              "<h3>Создание нового плана по грани (From solid face)</h3>" +
              "<p>Очень часто нужно обработать наклонную грань. Для этого в менеджере Planes нажмите кнопку <b>Create a new plane</b> и выберите <b>From solid face</b>. Кликните на грань. Mastercam предложит 8 вариантов ориентации осей (можно переключать стрелками). Выберите ту, где ось Z направлена от детали вверх, и нажмите OK.</p>" +
              practical([
                "Откройте файл ANGLEBLOCK-MM.mcam.",
                "В менеджере Planes посмотрите на таблицу. В строке Top стоят буквы W (WCS), C (Cplane), T (Tplane).",
                "Нажмите F9, чтобы увидеть оси.",
                "Выберите Create -> From solid face. Кликните на наклонную плоскость детали.",
                "В диалоге 'Select plane' понажимайте стрелки влево/вправо, чтобы увидеть, как вращается система координат.",
                "Выберите вариант, где ось Z смотрит перпендикулярно вверх от наклонной грани. Нажмите зеленую галочку.",
                "Введите имя плана 'Face 1'. Поставьте галочки WCS, Cplane, Tplane.",
                "Теперь, если вы нарисуете прямоугольник, он ляжет ровно на наклонную грань."
              ]) +
              selfcheck([
                "Какая плоскость определяет, где рисуется геометрия?",
                "Какая плоскость определяет ориентацию инструмента?",
                "Как создать систему координат на наклонной грани?"
              ]) + testBlock()
            ),
            [
              tq("Что такое Tplane?", ["Плоскость инструмента", "Плоскость конструирования", "Глобальный ноль"], 0),
              tq("Какая кнопка создает плоскость по грани?", ["From solid face", "From geometry", "Relative to WCS"], 0),
              tq("Сколько осей (вариантов поворота) предлагает Mastercam при создании плана по грани?", ["8", "4", "2", "1"], 0)
            ]
          ),
          topic(
            "mc-t23", "Урок 2.3", "Выбор цепочек (Chaining)",
            lec("2.3.1", "Каркасные и твердотельные цепочки",
              goal("Освоить выбор контуров для траекторий, управление ветвлениями и направлением.") +
              "<p>Для создания 2D-траектории необходимо указать <b>Цепочку (Chain)</b>. Цепочка — это набор соединенных линий и дуг. Важно не просто выбрать контур, но и задать правильное <b>направление обхода</b> (для попутного или встречного фрезерования).</p>" +
              "<h3>Режимы выбора</h3>" +
              "<ul>" +
              "<li><b>Wireframe (Каркасный):</b> выбор по отдельным линиям и дугам.</li>" +
              "<li><b>Solid (Твердотельный):</b> выбор по граням 3D-модели. Очень удобно для извлечения контуров отверстий или карманов.</li>" +
              "</ul>" +
              "<h3>Управление ветвлениями (Branches)</h3>" +
              "<p>Если геометрия имеет разветвления, Mastercam остановится и спросит, куда идти. На экране появятся стрелки:</p>" +
              "<ul>" +
              "<li><b>Зеленая стрелка:</b> начало и направление цепочки.</li>" +
              "<li><b>Красная стрелка:</b> путь по умолчанию.</li>" +
              "<li><b>Синяя стрелка:</b> альтернативный путь.</li>" +
              "</ul>" +
              "<p>С помощью кнопок <b>Next (Следующий)</b>, <b>Previous (Предыдущий)</b> и <b>End here (Закончить здесь)</b> можно управлять обходом. Кнопка <b>Reverse (Реверс)</b> меняет направление всей цепочки.</p>" +
              practical([
                "Откройте SOLID CHAINS.mcam.",
                "Выберите Toolpaths -> Contour (2D).",
                "В диалоге выбора активируйте иконку 'Solid Chaining' (кубик). Включите режим 3D.",
                "Кликните по верхней грани детали. Появится зеленая стрелка и красная/синяя на углу.",
                "Нажмите кнопку 'Reverse' в диалоге, чтобы зеленая стрелка пошла в обратном направлении.",
                "Зажмите [Ctrl] и кликните по всем 4 отверстиям. Mastercam автоматически выберет их как отдельные цепочки.",
                "Нажмите Enter (End Selection). Убедитесь, что в менеджере цепочек отображается 5 цепочек (1 контур + 4 отверстия)."
              ]) +
              selfcheck([
                "Зачем нужно менять направление цепочки?",
                "Что означает красная стрелка при выборе цепочки?",
                "Как выбрать несколько отверстий одновременно?"
              ]) + testBlock()
            ),
            [
              tq("Что делает кнопка Reverse?", ["Меняет направление обхода", "Удаляет цепочку", "Меняет плоскость"], 0),
              tq("Как выбрать несколько одинаковых отверстий?", ["Зажать Ctrl и кликнуть по ним", "Кликнуть правой кнопкой", "Нажать F9"], 0),
              tq("Какой режим выбора использует грани 3D-модели?", ["Solid Chaining", "Wireframe Chaining", "Point Selection"], 0)
            ]
          )
        ]
      },
      {
        code: "Раздел 3", title: "Инструмент и Заготовка",
        topics: [
          topic(
            "mc-t31", "Урок 3.1", "Менеджер инструмента (Tool Manager)",
            lec("3.1.1", "Создание фрез, патронов и сборок",
              goal("Научиться создавать собственный инструмент с правильной геометрией и патроном.") +
              "<p>В Mastercam есть отдельное приложение <b>Tool Manager</b>, а также встроенный менеджер. Инструмент состоит из режущей части и патрона (Holder). Без правильно заданного патрона симуляция Verify не покажет столкновения.</p>" +
              "<h3>Создание нового инструмента (Create new tool)</h3>" +
              "<ol>" +
              "<li><b>Тип инструмента:</b> Endmill (Концевая), Ball (Сферическая), Bull-Nose (С радиусом), Face Mill (Торцевая).</li>" +
              "<li><b>Геометрия (Define Tool Geometry):</b> Диаметр (Cutting diameter), Общая длина (Overall length), Длина режущей части (Cutting length). Для фасок/радиусов задается Tip/Corner treatment.</li>" +
              "<li><b>Хвостовик (Shank):</b> Диаметр хвостовика (Shank diameter). Если фреза зажата в цанге, хвостовик обычно равен диаметру фрезы.</li>" +
              "<li><b>Параметры (Finalize Properties):</b> Номер инструмента (Tool number) и корректоры (Length offset, Diameter offset).</li>" +
              "</ol>" +
              "<h3>Создание патрона (Holder)</h3>" +
              "<p>Вкладка Holder. Нажмите 'New Holder'. Задайте тип соединения (CAT, BT, HSK), размер (например, 40) и геометрию ступеней патрона (верхний и нижний диаметр). <b>Патрон обязательно нужно сохранить в библиотеку</b> (Save library).</p>" +
              practical([
                "В менеджере Toolpaths создайте операцию Contour.",
                "В диалоге операции перейдите на вкладку Tool. Нажмите правой кнопкой -> Create new tool.",
                "Выберите Bull-Nosed Endmill (Скругленная фреза).",
                "Задайте: Диаметр 10, Радиус угла 1, Длина резания 25, Общая длина 75.",
                "Нажмите Next. Задайте Номер инструмента: 1, Корректор на длину: 1, Корректор на диаметр: 1.",
                "Перейдите на вкладку Holder. Выберите Open library (Открыть библиотеку).",
                "Выберите стандартный патрон (например, CAT 40). Нажмите OK.",
                "Сохраните сборку в библиотеку. Нажмите OK в операции."
              ]) +
              selfcheck([
                "Почему важно задавать патрон?",
                "Где задается номер корректора на длину инструмента?",
                "Что произойдет, если диаметр хвостовика больше диаметра режущей части?"
              ]) + testBlock()
            ),
            [
              tq("Зачем нужен патрон в наладке?", ["Чтобы проверять столкновения в симуляции", "Для красоты", "Для расчета стоимости"], 0),
              tq("Где задается номер инструмента?", ["В Finalize Properties", "В Geometry", "В параметрах заготовки"], 0),
              tq("Какой инструмент имеет сферический кончик?", ["Ball Endmill", "Flat Endmill", "Bull-Nose"], 0)
            ]
          ),
          topic(
            "mc-t32", "Урок 3.2", "Настройка заготовки (Stock Setup)",
            lec("3.2.1", "Определение границ материала",
              goal("Правильно задавать заготовку для симуляции съема материала.") +
              "<p>Заготовка — это необработанный материал, из которого получается готовая деталь. Если заготовка не задана, симуляция Verify не покажет процесс резания.</p>" +
              "<p>Настройка находится в менеджере <b>Toolpaths</b> -> разверните <b>Properties - Mill Default</b> -> <b>Stock setup</b>.</p>" +
              "<ul>" +
              "<li><b>Shape (Форма):</b> Rectangular (Прямоугольник), Cylindrical (Цилиндр), Solid (По 3D-модели).</li>" +
              "<li><b>Bounding box (Ограничивающий контур):</b> Нажмите эту кнопку, выберите деталь, и Mastercam создаст параллелепипед по ее габаритам. Здесь же можно добавить припуск по осям X, Y, Z (например, +2 мм).</li>" +
              "<li><b>Stock Origin (Начало координат заготовки):</b> Указывает, где находится ноль заготовки (обычно совпадает с WCS).</li>" +
              "<li><b>Display (Отображение):</b> Включите Wireframe (каркас) или Solid (сплошная), чтобы видеть заготовку в окне.</li>" +
              "</ul>" +
              practical([
                "Откройте деталь, созданную в уроке 2.3 (SOLID CHAINS).",
                "В менеджере Toolpaths выберите Properties -> Stock setup.",
                "Нажмите кнопку Bounding box.",
                "Выберите деталь в окне и нажмите End Selection.",
                "В поле Size задайте припуск: X = 2.0, Y = 2.0, Z = 1.0.",
                "Нажмите OK. В графическом окне вокруг детали появится красный каркас заготовки."
              ]) +
              selfcheck([
                "Где находится настройка заготовки?",
                "Как добавить припуск на обработку в заготовку?"
              ]) + testBlock()
            ),
            [
              tq("Что такое Bounding box?", ["Создание заготовки по габаритам детали", "Удаление детали", "Создание патрона"], 0),
              tq("Где настраивается заготовка?", ["В свойствах станочной группы (Properties)", "В меню File", "В настройках экрана"], 0)
            ]
          )
        ]
      },
      {
        code: "Раздел 4", title: "2D Траектории",
        topics: [
          topic(
            "mc-t41", "Урок 4.1", "Контурная обработка (Contour)",
            lec("4.1.1", "Параметры резания и подводы",
              goal("Освоить создание контурной фрезерной операции с правильными подводами и глубиной.") +
              "<p>Операция <b>Contour (Контур)</b> используется для обхода внешних или внутренних контуров детали.</p>" +
              "<h3>Основные настройки</h3>" +
              "<ul>" +
              "<li><b>Toolpath Type (Тип):</b> выбор контура.</li>" +
              "<li><b>Tool (Инструмент):</b> выбор фрезы.</li>" +
              "<li><b>Cut Parameters (Параметры резания):</b> Здесь задается <b>Compensation type (Тип компенсации)</b>. Если <i>Computer</i> — Mastercam сам сместит траекторию на радиус фрезы. Если <i>Control</i> — в G-код добавится G41/G42, и смещение произойдет на стойке станка.</li>" +
              "<li><b>Depth cuts (Проходы по глубине):</b> Если нужно снять 10 мм, а фреза может взять только 3 мм, включите эту опцию и задайте Max rough step = 3.</li>" +
              "<li><b>Lead In/Out (Подвод/Отвод):</b> <b>Критически важно!</b> Никогда не врезайтесь вертикально в деталь. Включите подвод по дуге (Arc) или по касательной (Tangent) с радиусом, равным хотя бы 50% диаметра фрезы.</li>" +
              "<li><b>Linking Parameters (Переходы):</b> Задаются высоты безопасности: Clearance (безопасная высота), Retract (высота отвода между проходами).</li>" +
              "</ul>" +
              practical([
                "Создайте новый файл Mill.",
                "Нарисуйте прямоугольник 100x80 (Cplane = Top).",
                "Выберите Toolpaths -> Contour.",
                "Укажите цепочку по прямоугольнику (направление по часовой стрелке).",
                "Выберите фрезу Ø12 мм.",
                "На вкладке Cut Parameters установите Compensation = Computer.",
                "Перейдите в Depth cuts. Включите опцию. Задайте Max rough step = 4.0. (Общая глубина будет задана ниже).",
                "Перейдите в Linking Parameters. Установите Depth = -10 (обработать на глубину 10 мм).",
                "Перейдите в Lead In/Out. Включите Arc (Дуга), радиус 6 мм.",
                "Нажмите OK. Сгенерируйте траекторию. Запустите Backplot и посмотрите, как фреза плавно входит в материал."
              ]) +
              selfcheck([
                "В чем разница между Compensation = Computer и Control?",
                "Зачем нужны Depth cuts?",
                "Что произойдет, если отключить Lead In/Out?"
              ]) + testBlock()
            ),
            [
              tq("Что такое Depth cuts?", ["Проходы по глубине", "Смена фрезы", "Коррекция на радиус"], 0),
              tq("Где задается безопасная высота (Clearance)?", ["В Linking Parameters", "В Tool", "В Lead In/Out"], 0),
              tq("Зачем нужен подвод по дуге (Arc)?", ["Для плавного входа в материал без удара", "Для красоты", "Для смены инструмента"], 0)
            ]
          ),
          topic(
            "mc-t42", "Урок 4.2", "Обработка кармана (Pocket)",
            lec("4.2.1", "Стратегии выборки материала",
              goal("Научиться выбирать карманы с оптимальными перекрытиями проходов.") +
              "<p>Операция <b>Pocket (Карман)</b> предназначена для выборки материала внутри замкнутого контура.</p>" +
              "<h3>Стратегии</h3>" +
              "<ul>" +
              "<li><b>Zigzag (Зигзаг):</b> Фреза ходит туда-сюда параллельными линиями. Эффективно для прямоугольных карманов.</li>" +
              "<li><b>Constant Overlap Spiral (Спираль):</b> Фреза идет от центра к краям. Хорошо для круглых карманов.</li>" +
              "<li><b>Parallel Spiral (Параллельная спираль):</b> Комбинация.</li>" +
              "</ul>" +
              "<h3>Важные параметры</h3>" +
              "<ul>" +
              "<li><b>Stepover (Перекрытие):</b> Расстояние между соседними проходами. Задается в % от диаметра фрезы. Обычно 40-70%. Если сделать 10%, останутся «гребешки» из необработанного материала.</li>" +
              "<li><b>Entry (Врезание):</b> Вкладка в параметрах. Для карманов <b>запрещено</b> вертикальное врезание. Используйте <i>Helix (Спираль)</i> или <i>Ramp (Наклон)</i>.</li>" +
              "<li><b>Islands (Острова):</b> Позволяет выбрать внутри кармана дополнительные контуры (бобышки), которые фреза должна обходить.</li>" +
              "</ul>" +
              practical([
                "Нарисуйте прямоугольник 100x80 и внутри него еще один прямоугольник 60x40.",
                "Выберите Toolpaths -> Pocket.",
                "В качестве границы кармана выберите внешний прямоугольник.",
                "Перейдите на вкладку Islands (Острова) и выберите внутренний прямоугольник.",
                "Выберите фрезу Ø10.",
                "В параметрах резания (Cut Parameters) установите Stepover = 50%.",
                "В настройках врезания (Entry-ramp) выберите Helix с радиусом 5 мм.",
                "В Depth cuts задайте глубину шага 3 мм.",
                "Нажмите OK. Обратите внимание, как фреза обходит внутренний прямоугольник (остров), не задевая его."
              ]) +
              selfcheck([
                "Что такое Stepover?",
                "Почему нельзя врезаться в карман вертикально?",
                "Как защитить бобышку внутри кармана от обработки?"
              ]) + testBlock()
            ),
            [
              tq("Какая стратегия входа в материал безопасна для кармана?", ["Helix (Спираль)", "Вертикальное врезание", "G0 по Z"], 0),
              tq("Что такое Stepover?", ["Перекрытие проходов", "Смена инструмента", "Глубина резания"], 0),
              tq("Зачем нужны острова (Islands)?", ["Чтобы оставить материал внутри кармана", "Чтобы сменить фрезу", "Чтобы измерить деталь"], 0)
            ]
          )
        ]
      },
      {
        code: "Раздел 5", title: "Проверка и Вывод УП",
        topics: [
          topic(
            "mc-t51", "Урок 5.1", "Бэкплот, Верификация и Постпроцессирование",
            lec("5.1.1", "Симуляция и создание G-кода",
              goal("Научиться проверять траектории и получать готовую программу.") +
              "<h3>Бэкплот (Backplot)</h3>" +
              "<p>Быстрый просмотр движения инструмента по кадрам. Не рассчитывает материал. Показывает быстрые перемещения (красные пунктирные линии) и рабочие подачи (синие/зеленые линии). Полезен для проверки подводов и отводов.</p>" +
              "<h3>Верификация (Verify)</h3>" +
              "<p>Полноценная симуляция со съемом материала. Позволяет включить отображение патрона (Holder), зажимов (Fixtures) и заготовки (Stock). Выявляет зарезы (Gouges) и столкновения (Collisions).</p>" +
              "<h3>Постпроцессирование (Post Processing)</h3>" +
              "<p>Перевод внутренней траектории Mastercam в машинный код (G-код).</p>" +
              "<ol>" +
              "<li>Выберите все операции в менеджере Toolpaths.</li>" +
              "<li>Нажмите кнопку <b>G1 (Post selected operations)</b>.</li>" +
              "<li>Выберите постпроцессор, соответствующий вашей стойке ЧПУ (например, MPFAN для Fanuc).</li>" +
              "<li>Нажмите Save. Откроется окно <b>Code Expert</b> с текстом программы.</li>" +
              "</ol>" +
              "<h3>Структура G-кода</h3>" +
              "<p>Внимательно проверьте начало и конец программы:</p>" +
              "<ul>" +
              "<li><b>Шапка:</b> G21 (метрика), G90 (абсолютные), вызов инструмента (T1 M6), обороты (S2500 M3), коррекция (G43 H1).</li>" +
              "<li><b>Тело:</b> Перемещения G0/G1, коррекция радиуса G41/G42.</li>" +
              "<li><b>Конец:</b> Отмена коррекции G40, отвод, M05 (стоп шпинделя), M30 (конец программы).</li>" +
              "</ul>" +
              simGcode(
                "Симулятор G-кода",
                "G21 G90 (Метрика, Абсолютные)\nG0 X0 Y0 (Быстрый подвод)\nG1 Z-2 F150 (Врезание)\nG1 X60 Y0 F300 (Рез)\nG1 X60 Y60\nG1 X0 Y60\nG1 X0 Y0\nG0 Z50\nM30",
                "Это простейшая программа обработки квадрата. Нажмите Отрисовать. Красная линия — быстрый ход, зеленая — резание."
              ) +
              practical([
                "Создайте операцию Contour или Pocket по любой детали.",
                "В менеджере Toolpaths выделите операцию.",
                "Нажмите кнопку 'Verify selected operations'. Включите патрон и заготовку. Запустите симуляцию.",
                "Убедитесь, что фреза не задевает зажимы.",
                "Нажмите 'G1' (Post selected operations).",
                "Выберите постпроцессор MPFAN. Сохраните программу.",
                "В окне Code Expert найдите кадры G43 (коррекция на длину) и M30 (конец программы)."
              ]) +
              selfcheck([
                "В чем разница между Backplot и Verify?",
                "Что означает код M30 в конце программы?",
                "Зачем нужна коррекция G43?"
              ]) + testBlock()
            ),
            [
              tq("Что делает Verify?", ["Симулирует съем материала", "Создает G-код", "Меняет инструмент"], 0),
              tq("Что означает M30?", ["Конец программы и возврат в начало", "Включение шпинделя", "Смена инструмента"], 0),
              tq("Какая кнопка создает G-код?", ["G1 (Post selected)", "G0", "Backplot"], 0)
            ]
          ),
          topic(
            "mc-p1", "Практикум", "Полный цикл: от модели до G-кода",
            lec("P.1.1", "Итоговая практическая работа",
              goal("Закрепить все полученные навыки.") +
              tasks([
                {
                  t: "Создание геометрии и слоев",
                  s: [
                    "Создайте новую деталь Mill.",
                    "Нарисуйте плиту 120x80 мм.",
                    "Выдавите ее на 20 мм (Solids -> Extrude).",
                    "Создайте на верхней грани карман 60x40 мм глубиной 8 мм.",
                    "Разместите 4 отверстия Ø8 мм по углам кармана.",
                    "Разбейте объекты по слоям: 'Solid' (тело), 'Holes' (точки отверстий)."
                  ],
                  c: "Модель создана, слои организованы."
                },
                {
                  t: "Настройка наладки",
                  s: [
                    "Выберите станок Mill Default.",
                    "В Stock setup создайте Bounding box с припуском 2 мм по всем сторонам.",
                    "Создайте фрезу Ø10 Flat Endmill с патроном.",
                    "Создайте сверло Ø8."
                  ],
                  c: "Заготовка и инструменты готовы."
                },
                {
                  t: "Траектории",
                  s: [
                    "Создайте 2D Contour по внешнему контуру детали (фреза Ø10). Включите Depth cuts по 3 мм, общая глубина -21.",
                    "Создайте 2D Pocket для кармана (фреза Ø10). Включите Helix entry. Глубина -8.",
                    "Создайте операцию Drill для 4 отверстий (сверло Ø8). Глубина -22.",
                    "Проверьте порядок операций (Сначала контур, потом карман, потом сверление)."
                  ],
                  c: "Траектории созданы без ошибок."
                },
                {
                  t: "Симуляция и УП",
                  s: [
                    "Запустите Verify. Проверьте, что все элементы обработаны, зажимы не задеты.",
                    "Выведите G-код через постпроцессор MPFAN.",
                    "В коде проверьте: смену инструментов (T1, T2), коррекции (G43) и конец программы (M30)."
                  ],
                  c: "Программа готова к запуску на станке."
                }
              ]) +
              selfcheck(["С какими трудностями вы столкнулись?", "Какой этап занял больше всего времени?"]) + testBlock()
            ),
            [
              tq("В каком порядке лучше обрабатывать карман и внешний контур?", ["Сначала контур, потом карман", "Сначала карман, потом контур", "Без разницы"], 1),
              tq("Какая стратегия входа нужна для кармана?", ["Helix/Ramp", "Вертикально", "G0"], 0)
            ]
          )
        ]
      }
    ]
  };
})();