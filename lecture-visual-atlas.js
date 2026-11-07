"use strict";
(function () {
  var courses = window.MDK_DATA || {};
  var SOURCES = {
    cnc: {
      file: "CNC_milling_machine.jpg",
      page: "https://commons.wikimedia.org/wiki/File:CNC_milling_machine.jpg",
      author: "Impressionmanufacturer",
      license: "CC BY-SA 4.0",
      caption: "Фрезерный обрабатывающий центр: пример реального оборудования для сопоставления CAM-траектории со станочной операцией."
    },
    lathe: {
      file: "Small_CNC_Turning_Center.jpg",
      page: "https://commons.wikimedia.org/wiki/File:Small_CNC_Turning_Center.jpg",
      author: "Nathaniel C. Sheetz / Spangineer",
      license: "CC BY-SA 3.0",
      caption: "Токарный обрабатывающий центр в лаборатории FAME Lab, Penn State."
    },
    metal: {
      file: "%D0%9C%D0%B8%D0%BA%D1%80%D0%BE%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0_%D1%81%D1%82%D0%B0%D0%BB%D0%B8_20%D0%A5.jpg",
      page: "https://commons.wikimedia.org/wiki/File:Микроструктура_стали_20Х.jpg",
      author: "Surface engineering",
      license: "CC BY-SA 4.0",
      caption: "Микроструктура стали 20Х: светлая ферритная матрица и тёмные перлитные участки. Изображение используется для учебного распознавания фаз."
    },
    metrology: {
      file: "Using_a_caliper.JPG",
      page: "https://commons.wikimedia.org/wiki/File:Using_a_caliper.JPG",
      author: "Mauro Cateb",
      license: "CC BY-SA 3.0",
      caption: "Измерение штангенциркулем. При чтении результата важно обеспечить правильный контакт измерительных поверхностей."
    },
    assembly: {
      file: "Gear_bearing_assembly.JPG",
      page: "https://commons.wikimedia.org/wiki/File:Gear_bearing_assembly.JPG",
      author: "Guillaume Jacquenot",
      license: "CC BY-SA 3.0",
      caption: "Зубчатая передача и подшипниковый узел: пример сборочной единицы и сопряжённых деталей."
    },
    automation: {
      file: "Robot_arm_operates_machine_in_factory_setting.jpg",
      page: "https://commons.wikimedia.org/wiki/File:Robot_arm_operates_machine_in_factory_setting.jpg",
      author: "Shixart1985",
      license: "CC BY 2.0",
      caption: "Промышленный робот выполняет операцию у оборудования. Фото иллюстрирует автоматизацию, но не заменяет схему конкретной ячейки."
    },
    safety: {
      file: "Machine_safety_guard.jpg",
      page: "https://commons.wikimedia.org/wiki/File:Machine_safety_guard.jpg",
      author: "Machine 1456",
      license: "CC0 1.0",
      caption: "Металлическое ограждение зоны оборудования. Конкретная конструкция защиты определяется оценкой риска и документацией станка."
    },
    workshop: {
      file: "Mechanical_Workshop.jpg",
      page: "https://commons.wikimedia.org/wiki/File:Mechanical_Workshop.jpg",
      author: "Anand T R",
      license: "CC BY-SA 3.0",
      caption: "Механическая мастерская: общий контекст производственного оборудования и организации рабочего пространства."
    }
  };

  function esc(value) {
    return String(value || "").replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  function photoFor(courseId, title) {
    var t = String(title || "").toLowerCase();
    if (courseId === "MAT") return SOURCES.metal;
    if (courseId === "MET") return SOURCES.metrology;
    if (courseId === "OT") return SOURCES.safety;
    if (courseId === "02.01" || /сборк|подшипник|зубчат|соединен/.test(t)) return SOURCES.assembly;
    if (courseId === "02.02" || /автомат|робот|датчик|контроллер/.test(t)) return SOURCES.automation;
    if (/токар|вал|точени|шпиндел/.test(t)) return SOURCES.lathe;
    if (["07.01", "MCAM", "SPRUT_TP", "04.01"].indexOf(courseId) >= 0) return SOURCES.cnc;
    return SOURCES.workshop;
  }

  function flowFor(courseId, title) {
    var t = String(title || "").toLowerCase();
    var steps;
    if (courseId === "SPRUT_TP") {
      steps = /нормир/.test(t) ? ["Исходные данные", "Состав времени", "Расчёт нормы", "Проверка", "Утверждение"] :
        /естд|документ|нормоконтрол/.test(t) ? ["Маршрутная карта", "Операционная карта", "Карта эскизов", "Сверка", "Выпуск"] :
        /типов|групп/.test(t) ? ["Классификация деталей", "Группирование", "Типовой маршрут", "Адаптация", "Контроль"] :
        ["Чертёж", "Анализ детали", "Заготовка и базы", "Операции", "Контроль и ТД"];
    } else if (courseId === "MCAM") {
      steps = /постпроцесс|симуляц/.test(t) ? ["Toolpath", "Backplot", "Verify", "Постпроцессор", "NC-код"] :
        /инструмент|заготовк/.test(t) ? ["Модель", "Заготовка", "Инструмент", "Режимы", "Проверка"] :
        ["Геометрия", "WCS / Cplane", "Цепочка", "Траектория", "Verify"];
    } else if (courseId === "07.01") {
      steps = /дуг|кругов/.test(t) ? ["Начальная точка", "Центр дуги", "Направление", "Конечная точка", "Проверка"] :
        /сверлен/.test(t) ? ["Ноль детали", "Позиция X/Y", "Подход", "Цикл сверления", "Отвод"] :
        ["Чертёж", "Координаты", "Кадры УП", "Симуляция", "Пробный запуск"];
    } else if (courseId === "02.01") {
      steps = ["Подготовка деталей", "Базирование", "Соединение", "Регулировка", "Контроль узла"];
    } else if (courseId === "02.02") {
      steps = ["Подача детали", "Датчик подтверждает", "Контроллер проверяет", "Исполнительный механизм", "Контроль результата"];
    } else if (courseId === "04.01") {
      steps = ["Признак неисправности", "Сбор данных", "Проверка гипотез", "Измерение", "Подтверждённая причина"];
    } else if (courseId === "MAT") {
      steps = ["Состав и структура", "Обработка", "Изменение свойств", "Испытание", "Выбор материала"];
    } else if (courseId === "MET") {
      steps = ["Требование чертежа", "Выбор СИ", "Подготовка", "Измерение", "Оценка допуска"];
    } else if (courseId === "OT") {
      steps = ["Выявить опасность", "Оценить риск", "Установить защиту", "Проверить", "Допустить работу"];
    } else {
      steps = ["Исходные данные", "Подготовка", "Выполнение", "Контроль", "Результат"];
    }
    return steps;
  }

  function flowSvg(steps, label) {
    var w = 900, gap = 12, boxW = (w - 40 - gap * (steps.length - 1)) / steps.length;
    var nodes = steps.map(function (s, i) {
      var x = 20 + i * (boxW + gap);
      var words = esc(s).split(" ");
      var lines = [];
      var line = "";
      words.forEach(function (word) {
        if ((line + " " + word).trim().length > 17) { lines.push(line); line = word; }
        else line = (line + " " + word).trim();
      });
      if (line) lines.push(line);
      var text = lines.slice(0, 3).map(function (ln, j) {
        return '<text x="' + (x + boxW / 2) + '" y="' + (87 + j * 19) + '" text-anchor="middle" class="lv-node-text">' + ln + '</text>';
      }).join("");
      return '<rect x="' + x + '" y="48" width="' + boxW + '" height="82" rx="12" class="lv-node"/>' +
        '<text x="' + (x + 14) + '" y="68" class="lv-step">' + (i + 1) + '</text>' + text +
        (i < steps.length - 1 ? '<path d="M' + (x + boxW + 2) + ' 89 h' + (gap - 4) + ' m-5 -5 l5 5 -5 5" class="lv-arrow"/>' : "");
    }).join("");
    return '<div class="lv-figure"><div class="lv-figure-title">' + esc(label) + '</div><svg viewBox="0 0 900 170" role="img" aria-label="' + esc(label) + '">' + nodes + '</svg><p class="lv-caption">Последовательность приведена как учебная схема; состав этапов уточняется по конкретной детали, оборудованию и документации.</p></div>';
  }

  function graphSvg(courseId, title) {
    var t = String(title || "").toLowerCase();
    var label = "Графическая модель темы";
    var path = "M70 190 C150 185 190 165 250 150 S370 105 440 90 S570 60 650 52";
    var yLabel = "Условный показатель";
    var xLabel = "Этап процесса";
    var marks = ["1", "2", "3", "4", "5"];
    if (courseId === "MAT") {
      label = "Качественная диаграмма растяжения"; yLabel = "Напряжение"; xLabel = "Относительное удлинение";
      path = "M70 190 L170 150 Q210 125 260 118 L390 95 Q470 82 520 95 Q570 115 610 145";
      marks = ["Упругая область", "Текучесть", "Упрочнение", "Максимум", "Разрушение"];
    } else if (courseId === "MET") {
      label = "Схема поля допуска"; yLabel = "Отклонение"; xLabel = "Размер";
      path = "M140 72 L660 72 L660 152 L140 152 Z";
      marks = ["Верхнее отклонение", "Нулевая линия", "Нижнее отклонение", "Поле допуска", "Размер"];
    } else if (courseId === "07.01" || courseId === "MCAM") {
      label = /дуг|круг|радиус/.test(t) ? "Траектория инструмента: прямолинейный и дуговой участок" : "Схематическая траектория инструмента";
      yLabel = "Y"; xLabel = "X";
      path = "M90 180 L260 180 L260 105 Q260 55 330 55 L520 55 L650 125";
      marks = ["Старт", "G01", "G02/G03", "Переход", "Финиш"];
    } else if (courseId === "SPRUT_TP") {
      label = "Сравнение уровней детализации ТП"; yLabel = "Детализация"; xLabel = "Содержание документа";
      path = "M100 170 L100 145 L310 145 L310 110 L520 110 L520 75 L720 75";
      marks = ["Маршрутный", "Маршрутно-операционный", "Операционный", "Переходы", "Оснастка"];
    } else if (courseId === "04.01") {
      label = "Логика диагностики: от признака к подтверждению"; yLabel = "Уровень подтверждения"; xLabel = "Шаг проверки";
      path = "M90 175 L210 160 L330 135 L450 105 L570 78 L690 48";
      marks = ["Симптом", "Осмотр", "Измерение", "Сравнение", "Причина"];
    } else if (courseId === "OT") {
      label = "Матрица оценки риска (учебный пример)"; yLabel = "Тяжесть последствий"; xLabel = "Вероятность";
      path = "M130 170 L260 140 L390 115 L520 85 L650 55";
      marks = ["Редко", "Возможно", "Повторяется", "Часто", "Высокая"];
    } else if (courseId === "02.01") {
      label = "Схема накопления размерной цепи"; yLabel = "Суммарное отклонение"; xLabel = "Звенья цепи";
      path = "M90 160 L220 140 L350 120 L480 100 L610 80";
      marks = ["A1", "A2", "A3", "A4", "Замыкающее"];
    } else if (courseId === "02.02") {
      label = "Цикл автоматизированной сборки"; yLabel = "Состояние"; xLabel = "Время цикла";
      path = "M80 170 L180 170 L180 115 L300 115 L300 70 L440 70 L440 130 L560 130 L560 55 L700 55";
      marks = ["Ожидание", "Подача", "Захват", "Сборка", "Контроль"];
    }
    var ticks = marks.map(function (m, i) {
      return '<text x="' + (90 + i * 145) + '" y="225" text-anchor="middle" class="lv-axis-label">' + esc(m) + '</text>';
    }).join("");
    var grid = [55, 95, 135, 175].map(function (y) { return '<line x1="70" y1="' + y + '" x2="720" y2="' + y + '" class="lv-grid"/>'; }).join("");
    var svg = '<svg viewBox="0 0 780 285" role="img" aria-label="' + esc(label) + '">' + grid +
      '<path d="M70 35 V190 H735" class="lv-axis"/><path d="' + path + '" class="lv-curve"/>' +
      '<text x="18" y="28" class="lv-axis-label">' + esc(yLabel) + '</text>' +
      '<text x="390" y="270" text-anchor="middle" class="lv-axis-label">' + esc(xLabel) + '</text>' + ticks + '</svg>';
    return '<div class="lv-figure"><div class="lv-figure-title">' + esc(label) + '</div>' + svg +
      '<p class="lv-caption">Иллюстративная схема, не нормативная зависимость и не результат измерения. Числовые значения не задаются: график показывает только логику взаимосвязей.</p></div>';
  }

  function visualSupplement(courseId, topic) {
    var title = topic.title || "";
    var photo = photoFor(courseId, title);
    var img = "https://commons.wikimedia.org/wiki/Special:FilePath/" + photo.file + "?width=1200";
    var flow = flowFor(courseId, title);
    var html = '<section class="lecture-visual-atlas">' +
      '<h3>Визуальный разбор темы</h3>' +
      '<p class="lv-intro">Фото помогает увидеть реальный объект, схема — проследить связи и последовательность, график — понять характер зависимости.</p>' +
      '<figure class="lv-photo"><a href="' + photo.page + '" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="' + img + '" alt="' + esc(photo.caption) + '"></a>' +
      '<figcaption>' + esc(photo.caption) + '<span class="lv-credit">Источник: Wikimedia Commons · ' + esc(photo.author) + ' · ' + esc(photo.license) + ' · <a href="' + photo.page + '" target="_blank" rel="noopener noreferrer">карточка и условия использования</a></span></figcaption></figure>' +
      flowSvg(flow, "Схема процесса по теме «" + title + "»") +
      graphSvg(courseId, title) +
      '<div class="lv-task"><b>Задание по визуальным материалам</b><ol><li>Подпишите на фотографии не менее трёх элементов, связанных с темой.</li><li>Перерисуйте схему в конспект и поясните назначение каждого этапа.</li><li>Объясните, что показывает график и какие данные потребовались бы для построения реального графика.</li></ol></div>' +
      '</section>';
    return html;
  }

  var count = 0;
  Object.keys(courses).forEach(function (courseId) {
    if (["basic", "technical"].indexOf(courseId) >= 0) return;
    var course = courses[courseId];
    if (!course || !Array.isArray(course.sections)) return;
    course.sections.forEach(function (section) {
      (section.topics || []).forEach(function (topic) {
        if (!Array.isArray(topic.lectures)) return;
        topic.lectures.forEach(function (lecture) {
          if (!lecture || typeof lecture.content !== "string" || lecture.__visualAtlasAdded) return;
          lecture.content += visualSupplement(courseId, topic);
          lecture.__visualAtlasAdded = true;
          count++;
        });
      });
    });
  });
  window.LECTURE_VISUAL_ATLAS_COUNT = count;
})();