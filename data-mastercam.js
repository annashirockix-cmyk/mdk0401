"use strict";

window.MDK_DATA = window.MDK_DATA || {};

(function () {
  // --- БАЗОВЫЕ ХЕЛПЕРЫ ---
  function goal(text) {
    return '<div style="border-left:3px solid #38bdf8;padding:8px 12px;margin:12px 0;background:#0f172a;"><b>Цель занятия.</b> ' + text + '</div>';
  }

  function terms(pairs) {
    var h = '<h3>Ключевые термины</h3><dl style="display:grid;grid-template-columns:auto 1fr;gap:6px 16px;">';
    for (var i = 0; i < pairs.length; i++) {
      h += '<dt style="font-weight:bold;color:#38bdf8;">' + pairs[i][0] + '</dt><dd style="margin:0;color:#94a3b8;">' + pairs[i][1] + '</dd>';
    }
    return h + '</dl>';
  }

  function selfcheck(items) {
    var h = '<h3>Вопросы для самопроверки</h3><ol>';
    for (var i = 0; i < items.length; i++) h += '<li style="margin:6px 0;">' + items[i] + '</li>';
    return h + '</ol>';
  }

  function testBlock() {
    return '<p style="color:#94a3b8;font-size:13px;margin-top:12px;">После изучения темы пройдите тест ниже.</p>';
  }

  function tq(q, options, correct) {
    return { q: q, options: options, correct: correct };
  }

  function lec(code, title, content) {
    return { code: code, title: title, content: content };
  }

  function topic(id, code, title, lecture, tests) {
    return {
      id: id, code: code, title: title,
      lectures: Array.isArray(lecture) ? lecture : [lecture],
      practicals: [], selfWork: [], test: tests || []
    };
  }

  function practical(steps) {
    var out = '<h3>Практическая работа</h3><ol>';
    for (var i = 0; i < steps.length; i++) out += "<li>" + steps[i] + "</li>";
    return out + "</ol>";
  }

  // --- ФУНКЦИЯ ЗАДАЧ ---
  function tasks(list) {
    var out = '<h3>Практические задачи для отработки</h3>';
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      out += '<div style="border-left:3px solid #f59e0b;padding:10px 14px;margin:12px 0;background:rgba(15,23,42,0.6);border-radius:0 6px 6px 0;">';
      out += '<b>Задача ' + (i + 1) + '. ' + t.t + '</b>';
      if (t.s) {
        out += '<ol style="margin:6px 0 6px 20px;padding:0;">';
        for (var j = 0; j < t.s.length; j++) out += '<li style="margin:4px 0;">' + t.s[j] + '</li>';
        out += '</ol>';
      }
      if (t.c) out += '<div style="color:#4ade80;font-size:13px;margin-top:6px;">&#10003; <b>Проверка:</b> ' + t.c + '</div>';
      out += '</div>';
    }
    return out;
  }

  // --- ВИЗУАЛИЗАТОР 1: СИМУЛЯТОР УП (МИЛЛИМЕТРОВКА) ---
  function simWindow(title, starterCode, description) {
    var CS = '</' + 'script>';
    var starterJs = JSON.stringify(starterCode).replace(/</g, '\\u003c');
    var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>';
    h += 'body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:12px}';
    h += 'textarea{width:100%;height:150px;font-family:Consolas,monospace;background:#1e293b;color:#f1f5f9;border:1px solid #475569;border-radius:6px;padding:8px;font-size:13px;resize:vertical}';
    h += 'button{background:#38bdf8;color:#0f172a;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin:8px 8px 8px 0}';
    h += 'canvas{display:block;background:#f8fafc;border:1px solid #475569;border-radius:6px;margin-top:8px;max-width:100%}';
    h += '.hint{color:#94a3b8;font-size:13px;}';
    h += '</style></head><body>';
    h += '<h4>' + title + '</h4><p class="hint">' + description + '</p>';
    h += '<textarea id="code"></textarea>';
    h += '<div><button id="run">&#9654; Отрисовать</button></div>';
    h += '<canvas id="c" width="600" height="400"></canvas>';
    h += '<script>';
    h += 'var STARTER=' + starterJs + ';';
    h += 'var cv=document.getElementById("c"),ctx=cv.getContext("2d");';
    h += 'var ta=document.getElementById("code");ta.value=STARTER;';
    h += 'function drawGrid(){';
    h += 'ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,cv.width,cv.height);';
    h += 'ctx.strokeStyle="#cbd5e1";ctx.lineWidth=1;ctx.beginPath();';
    h += 'for(var i=0;i<cv.width;i+=20){ctx.moveTo(i,0);ctx.lineTo(i,cv.height);}';
    h += 'for(var j=0;j<cv.height;j+=20){ctx.moveTo(0,j);ctx.lineTo(cv.width,j);}';
    h += 'ctx.stroke();';
    h += 'ctx.strokeStyle="#94a3b8";ctx.beginPath();';
    h += 'for(var i=0;i<cv.width;i+=100){ctx.moveTo(i,0);ctx.lineTo(i,cv.height);}';
    h += 'for(var j=0;j<cv.height;j+=100){ctx.moveTo(0,j);ctx.lineTo(cv.width,j);}';
    h += 'ctx.stroke();';
    h += 'ctx.strokeStyle="#ef4444";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,200);ctx.lineTo(600,200);ctx.stroke();';
    h += 'ctx.strokeStyle="#3b82f6";ctx.beginPath();ctx.moveTo(300,0);ctx.lineTo(300,400);ctx.stroke();';
    h += 'ctx.fillStyle="#475569";ctx.font="12px monospace";ctx.fillText("X+",580,195);ctx.fillText("Y+",305,15);';
    h += '}';
    h += 'function run(){';
    h += 'drawGrid();';
    h += 'var txt=ta.value.toUpperCase();var lines=txt.split(/\\n/);';
    h += 'var x=300,y=200,rapid=true;var paths=[];';
    h += 'for(var i=0;i<lines.length;i++){';
    h += 'var L=lines[i].split("(")[0].replace(/\\s+/g," ").trim();if(!L)continue;';
    h += 'if(L.indexOf("G0")>-1)rapid=true;if(L.indexOf("G1")>-1)rapid=false;';
    h += 'var xm=L.match(/X(-?[\\d.]+)/);var ym=L.match(/Y(-?[\\d.]+)/);';
    h += 'var nx=x,ny=y;';
    h += 'if(xm)nx=300+parseFloat(xm[1])*2;';
    h += 'if(ym)ny=200-parseFloat(ym[1])*2;';
    h += 'if(nx!==x||ny!==y){paths.push({x1:x,y1:y,x2:nx,y2:ny,r:rapid});x=nx;y=ny;}';
    h += '}';
    h += 'for(var k=0;k<paths.length;k++){';
    h += 'var p=paths[k];ctx.beginPath();ctx.moveTo(p.x1,p.y1);ctx.lineTo(p.x2,p.y2);';
    h += 'ctx.strokeStyle=p.r?"#ef4444":"#10b981";ctx.lineWidth=p.r?1:2;';
    h += 'if(p.r)ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);';
    h += '}';
    h += '}';
    h += 'document.getElementById("run").onclick=run;';
    h += 'drawGrid();run();';
    h += CS + '</body></html>';
    var escaped = h.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<iframe srcdoc="' + escaped + '" sandbox="allow-scripts" style="width:100%;max-width:620px;height:580px;border:1px solid #475569;border-radius:8px;background:#0f172a;display:block;margin:12px 0;"></iframe>';
  }

  // --- ВИЗУАЛИЗАТОР 2: ТОКАРНАЯ ОБРАБОТКА (КАРТА НАЛАДКИ) ---
  function turningVisualizer(title, description) {
    var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>';
    h += 'body{font-family:system-ui;background:#0f172a;color:#e2e8f0;margin:0;padding:12px}';
    h += 'canvas{background:#1e293b;border:1px solid #475569;border-radius:8px;display:block;margin:10px 0;max-width:100%}';
    h += 'button{background:#10b981;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:bold;margin-right:10px}';
    h += '</style></head><body>';
    h += '<h4>' + title + '</h4><p style="font-size:13px;color:#94a3b8">' + description + '</p>';
    h += '<button id="btn">&#9654; Выполнить проход</button>';
    h += '<canvas id="c" width="600" height="300"></canvas>';
    h += '<script>';
    h += 'var cv=document.getElementById("c"),ctx=cv.getContext("2d");';
    h += 'var stage=0;';
    h += 'function draw(){';
    h += 'ctx.clearRect(0,0,600,300);';
    h += 'ctx.fillStyle="#475569";ctx.fillRect(100,50,400,200);'; // Заготовка
    h += 'ctx.fillStyle="#94a3b8";ctx.fillRect(100,50,200,200);'; // Черновая
    h += 'ctx.fillStyle="#cbd5e1";ctx.fillRect(100,50,100,200);'; // Получистовая
    h += 'ctx.fillStyle="#38bdf8";ctx.fillRect(100,50,50,200);'; // Чистовая
    h += 'ctx.strokeStyle="#ef4444";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(50,150);ctx.lineTo(550,150);ctx.stroke();';
    h += 'ctx.fillStyle="#ef4444";ctx.fillText("Z",560,155);';
    h += 'ctx.strokeStyle="#3b82f6";ctx.beginPath();ctx.moveTo(100,30);ctx.lineTo(100,270);ctx.stroke();';
    h += 'ctx.fillStyle="#3b82f6";ctx.fillText("X",90,20);';
    h += 'if(stage===1){ h += "ctx.fillStyle=#f59e0b;ctx.fillRect(300,60,20,20);"; }';
    h += 'if(stage===2){ h += "ctx.fillStyle=#f59e0b;ctx.fillRect(200,60,20,20);"; }';
    h += 'if(stage===3){ h += "ctx.fillStyle=#f59e0b;ctx.fillRect(150,60,20,20);"; }';
    h += 'ctx.fillStyle="#f8fafc";ctx.font="14px sans-serif";';
    h += 'if(stage===0)ctx.fillText("Заготовка",120,40);';
    h += 'if(stage===1)ctx.fillText("Черновой проход (Rough)",300,40);';
    h += 'if(stage===2)ctx.fillText("Получистовой проход (Semi-Finish)",200,40);';
    h += 'if(stage===3)ctx.fillText("Чистовой проход (Finish)",150,40);';
    h += '}';
    h += 'document.getElementById("btn").onclick=function(){stage++; if(stage>3)stage=0; draw();};';
    h += 'draw();';
    h += '</script></body></html>';
    var escaped = h.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<iframe srcdoc="' + escaped + '" sandbox="allow-scripts" style="width:100%;max-width:620px;height:440px;border:1px solid #475569;border-radius:8px;background:#0f172a;display:block;margin:12px 0;"></iframe>';
  }

  // --- ВИЗУАЛИЗАТОР 3: БАЗА X0Y0Z0 ---
  function zeroPointVisualizer() {
    var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>';
    h += 'body{font-family:system-ui;background:#0f172a;color:#e2e8f0;margin:0;padding:12px}';
    h += 'canvas{background:#1e293b;border:1px solid #475569;border-radius:8px;display:block;margin:10px 0;max-width:100%}';
    h += '</style></head><body>';
    h += '<h4>База X0Y0Z0 (Ноль программы)</h4><p style="font-size:13px;color:#94a3b8">Верхний левый угол заготовки — это X0 Y0 Z0. Отсюда станок начинает отсчет.</p>';
    h += '<canvas id="c" width="500" height="300"></canvas>';
    h += '<script>';
    h += 'var cv=document.getElementById("c"),ctx=cv.getContext("2d");';
    h += 'ctx.fillStyle="#334155";ctx.fillRect(100,100,200,150);';
    h += 'ctx.strokeStyle="#cbd5e1";ctx.lineWidth=2;ctx.strokeRect(100,100,200,150);';
    h += 'ctx.fillStyle="#ef4444";ctx.beginPath();ctx.arc(100,100,6,0,Math.PI*2);ctx.fill();';
    h += 'ctx.fillStyle="#f8fafc";ctx.font="14px monospace";';
    h += 'ctx.fillText("X0 Y0 Z0",110,95);';
    h += 'ctx.strokeStyle="#ef4444";ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(180,100);ctx.stroke();';
    h += 'ctx.fillStyle="#ef4444";ctx.fillText("X+",185,105);';
    h += 'ctx.strokeStyle="#10b981";ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(100,40);ctx.stroke();';
    h += 'ctx.fillStyle="#10b981";ctx.fillText("Y+",80,40);';
    h += '</script></body></html>';
    var escaped = h.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<iframe srcdoc="' + escaped + '" sandbox="allow-scripts" style="width:100%;max-width:520px;height:400px;border:1px solid #475569;border-radius:8px;background:#0f172a;display:block;margin:12px 0;"></iframe>';
  }
  window.MDK_DATA["MCAM"] = {
    id: "MCAM",
    shortName: "Mastercam",
    title: "Mastercam — CAD/CAM",
    module: "Дополнительный курс по Mastercam",
    sections: [
      {
        code: "Раздел 1",
        title: "Знакомство с программой",
        topics: [
          topic(
            "mc-t11", "Урок 1.1", "Что такое Mastercam и зачем он нужен",
            lec("1.1.1", "История и назначение",
              goal("Понять, что делает CAM-система.") +
              "<p>Mastercam — это CAM-система. Она берет геометрию детали, добавляет заготовку, инструмент и выдаёт <b>управляющую программу</b> (G-код).</p>" +
              terms([["CAM", "Подготовка обработки на компьютере."], ["G-код", "Текст программы для станка."]]) +
              practical(["Запустите Mastercam.", "Создайте файл File → New.", "Выберите станок Mill."]) +
              selfcheck(["Чем CAM отличается от CAD?"]) + testBlock()
            ),
            [tq("Mastercam — это", ["CAM-система", "Текстовый редактор", "Станок"], 0)]
          ),
          topic(
            "mc-t12", "Урок 1.2", "Интерфейс и настройка",
            lec("1.2.1", "Рабочее место",
              goal("Настроить рабочее место.") +
              "<p>Лента сверху, менеджер операций слева, графическое окно в центре. Строка состояния снизу показывает активные плоскости.</p>" +
              practical(["Включите менеджер операций (Alt+O).", "Закрепите вкладки Toolpaths и Solids."]) +
              selfcheck(["Где смотрят активные плоскости?"]) + testBlock()
            ),
            [tq("Менеджер операций — это", ["Дерево наладки", "Список файлов", "Отчет"], 0)]
          )
        ]
      },
      {
        code: "Раздел 2",
        title: "Подготовка проекта",
        topics: [
          topic(
            "mc-t21", "Урок 2.1", "Системы координат",
            lec("2.1.1", "WCS, Cplane, Tplane",
              goal("Понять плоскости.") +
              "<p><b>WCS</b> — ноль программы. <b>Cplane</b> — плоскость рисования. <b>Tplane</b> — плоскость обработки.</p>" +
              zeroPointVisualizer() +
              selfcheck(["Чем Cplane отличается от Tplane?"]) + testBlock()
            ),
            [tq("Tplane — это", ["Плоскость траектории", "Имя поста", "Тип фрезы"], 0)]
          )
        ]
      },
      {
        code: "Раздел 3",
        title: "Токарная обработка",
        topics: [
          topic(
            "mc-t31", "Урок 3.1", "Черновое и чистовое точение",
            lec("3.1.1", "Face, Rough, Finish",
              goal("Научиться снимать припуск.") +
              "<p>Сначала черновая (Rough), затем чистовая (Finish).</p>" +
              turningVisualizer("Визуализация токарных проходов", "Нажимайте кнопку, чтобы увидеть, как резец снимает материал от чернового к чистовому.") +
              selfcheck(["Почему чистовой проход идет после чернового?"]) + testBlock()
            ),
            [tq("Черновой припуск снимают", ["Rough", "Finish", "Thread"], 0)]
          )
        ]
      },
      {
        code: "Раздел 4",
        title: "Фрезерование и сверление",
        topics: [
          topic(
            "mc-t41", "Урок 4.1", "2D-контур и карман",
            lec("4.1.1", "Contour, Pocket",
              goal("Строить 2D-траектории.") +
              "<p>Contour обходит контур, Pocket выбирает карман.</p>" +
              selfcheck(["Зачем замыкать цепочку?"]) + testBlock()
            ),
            [tq("Карман выбирают", ["Pocket", "Contour", "Drill"], 0)]
          )
        ]
      },
      {
        code: "Раздел 5",
        title: "Управляющая программа",
        topics: [
          topic(
            "mc-t51", "Урок 5.1", "Постпроцессирование",
            lec("5.1.1", "Backplot, Verify, G-код",
              goal("Получить G-код.") +
              "<p>Backplot показывает траекторию. Verify считает съем. Постпроцессор выдает G-код.</p>" +
              selfcheck(["Что проверяют в первых 20 кадрах?"]) + testBlock()
            ),
            [tq("Verify нужен, чтобы", ["Увидеть съем материала", "Заменить пост", "Включить шпиндель"], 0)]
          )
        ]
      },
      {
        code: "Дополнительная лекция",
        title: "Практические работы",
        topics: [
          topic(
            "mc-p1", "Практика 1", "CAD-геометрия и миллиметровка",
            lec("P.1.1", "Отрисовка эквидистанты и УП",
              goal("Научиться читать G-код и видеть траекторию на миллиметровке.") +
              "<p>Создание геометрии, чертежей и интерфейс (Темы 1, 2, 3, 9, 10).</p>" +
              tasks([
                { t: "Построение твердотельных тел", s: ["Создайте эскиз 80x50", "Выдавите на 20 мм", "Сделайте карман"], c: "Модель создана." },
                { t: "Отрисовка эквидистанты", s: ["Постройте Offset контура внутрь на 2 мм"], c: "Контур смещен." }
              ]) +
              simWindow(
                "Симулятор УП (Миллиметровка)",
                "G21 G90\nG0 X0 Y0\nG1 X60 Y0 F200\nG1 X80 Y20\nG1 X80 Y50\nG1 X0 Y50\nG1 X0 Y0",
                "Это контур 80x50. Нажмите «Отрисовать», чтобы увидеть движение инструмента на сетке. Красная линия — быстрый подвод (G0), зеленая — рабочая подача (G1)."
              ) +
              selfcheck(["Что означает G0?", "Что означает G1?"]) + testBlock()
            ),
            [tq("Эквидистанта — это", ["Смещенный контур", "Резьба", "Отверстие"], 0)]
          ),
          topic(
            "mc-p2", "Практика 2", "Токарная обработка (Карта наладки)",
            lec("P.2.1", "Черновая, получистовая, чистовая",
              goal("Понять стратегию точения.") +
              "<p>Оси X и Z, построение профиля, черновое и чистовое точение (Темы 7, 8, 24, 25, 30).</p>" +
              tasks([
                { t: "Построение профиля", s: ["Стройте половину профиля в ZX", "Задайте пруток", "Установите ноль на торце"], c: "Профиль непрерывный." },
                { t: "Выбор базы", s: ["Выберите торец как Z0", "Ось как X0"], c: "База доступна для индикатора." }
              ]) +
              turningVisualizer(
                "Карта наладки токарной обработки",
                "Нажмите кнопку, чтобы увидеть, как движется резец: черновая выборка, затем получистовая, затем чистовая."
              ) +
              selfcheck(["Почему профиль строят половиной?"]) + testBlock()
            ),
            [tq("X в диаметре означает", ["1 мм радиуса = 2 мм по X", "X не программируется", "X равен Z"], 0)]
          ),
          topic(
            "mc-p3", "Практика 3", "Фрезерование (УП по чертежу)",
            lec("P.3.1", "УП в АСК и ОСК",
              goal("Научиться писать УП по координатам.") +
              "<p>Контур, карман, торцевание, сверление (Темы 11-23, 38-42).</p>" +
              tasks([
                { t: "Создание контурной траектории", s: ["Toolpaths → Contour", "Выберите цепочку", "Задайте подвод по дуге"], c: "Фреза обходит контур." },
                { t: "Обработка с корректором", s: ["Compensation = Control", "Задайте D=1", "Проверьте G41"], c: "Код содержит G41." }
              ]) +
              simWindow(
                "Симулятор УП (ОСК / АСК)",
                "G21 G90 (Абсолютная)\nG0 X0 Y0\nG1 X50 Y0\nG1 X50 Y50\nG1 X0 Y50\nG1 X0 Y0\n\n(Попробуйте заменить G90 на G91 и использовать X50 Y50 как шаги)",
                "Здесь показан контур 50x50. Попробуйте изменить цифры в окне кода и нажать «Отрисовать», чтобы увидеть, как меняется путь."
              ) +
              selfcheck(["Что делает G41?"]) + testBlock()
            ),
            [tq("G41/G42 — это", ["Коррекция радиуса", "Смена инструмента", "Цикл сверления"], 0)]
          ),
          topic(
            "mc-p4", "Практика 4", "Сверление и резьба",
            lec("P.4.1", "Циклы и точки",
              goal("Отработать циклы сверления.") +
              "<p>Drill, Counterbore, метчик, прерывистое сверление, растачивание (Темы 26-29, 32, 44, 45).</p>" +
              tasks([
                { t: "Центровка, сверление, метчик", s: ["Создайте точки", "Drill Ø3", "Drill Ø6.8", "Tap M8"], c: "Порядок операций верный." },
                { t: "Прерывистое сверление", s: ["Выберите G83", "Задайте Peck = 4 мм"], c: "Стружка выводится." }
              ]) +
              selfcheck(["Какой цикл для глубоких отверстий?"]) + testBlock()
            ),
            [tq("Для глубоких отверстий", ["G83", "G81", "G82"], 0)]
          ),
          topic(
            "mc-p5", "Практика 5", "3D и ВСО (Высокоскоростная)",
            lec("P.5.1", "Поверхностная и динамическая обработка",
              goal("Освоить 3D-стратегии.") +
              "<p>Surface Rough/Finish, OptiRough, Raster, Scallop, Pencil, Stock model (Темы 43, 46-53, 58-61).</p>" +
              tasks([
                { t: "Динамика", s: ["Dynamic Mill", "ap = 20 мм", "ae = 1 мм"], c: "Нагрузка постоянная." },
                { t: "Дообработка", s: ["Rest material", "Фреза меньше Ø12"], c: "Остатков нет." }
              ]) +
              selfcheck(["Что такое Stock model?"]) + testBlock()
            ),
            [tq("Scallop — это", ["Постоянная высота гребешка", "Тип резьбы", "Вид фрезы"], 0)]
          ),
          topic(
            "mc-p6", "Практика 6", "Трансформация и постпроцессинг",
            lec("P.6.1", "Зеркало и вывод кода",
              goal("Научиться зеркалить и выводить УП.") +
              "<p>Transform, Mirror, Backplot, Verify, постпроцессор (Темы 31, 34-37).</p>" +
              tasks([
                { t: "Зеркальное отображение", s: ["Transform → Mirror", "Проверьте G41/G42"], c: "Зеркало совпадает." },
                { t: "Постпроцессирование", s: ["Post selected", "Проверьте G40 в конце"], c: "Программа открывается." }
              ]) +
              selfcheck(["Что проверяют в первых кадрах?"]) + testBlock()
            ),
            [tq("Пост выбирают", ["Под стойку станка", "Любой", "Только MPFAN"], 0)]
          )
        ]
      }
    ]
  };
})();