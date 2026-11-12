"use strict";
(function () {
  var courses = window.MDK_DATA || {};
  var COMMONS = {
    cncMill: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/CNC_milling_machine.jpg?width=1200", page:"https://commons.wikimedia.org/wiki/File:CNC_milling_machine.jpg", alt:"Фрезерный обрабатывающий центр", caption:"Фрезерный обрабатывающий центр — пример оборудования для фрезерной обработки.", author:"Impressionmanufacturer", license:"CC BY-SA 4.0" },
    lathe: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/Small_CNC_Turning_Center.jpg?width=1200", page:"https://commons.wikimedia.org/wiki/File:Small_CNC_Turning_Center.jpg", alt:"Токарный обрабатывающий центр", caption:"Токарный обрабатывающий центр — оборудование для обработки поверхностей вращения.", author:"Nathaniel C. Sheetz / Spangineer", license:"CC BY-SA 3.0" },
    metal: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/%D0%9C%D0%B8%D0%BA%D1%80%D0%BE%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0_%D1%81%D1%82%D0%B0%D0%BB%D0%B8_20%D0%A5.jpg?width=1200", page:"https://commons.wikimedia.org/wiki/File:Микроструктура_стали_20Х.jpg", alt:"Микроструктура стали 20Х", caption:"Микроструктура стали 20Х — пример изображения для обсуждения структуры материала; идентификацию фаз выполняют по подтверждённым данным.", author:"Surface engineering", license:"CC BY-SA 4.0" },
    caliper: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/Using_a_caliper.JPG?width=1200", page:"https://commons.wikimedia.org/wiki/File:Using_a_caliper.JPG", alt:"Измерение штангенциркулем", caption:"Измерение штангенциркулем — пример контроля линейного размера.", author:"Mauro Cateb", license:"CC BY-SA 3.0" },
    assembly: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/Gear_bearing_assembly.JPG?width=1200", page:"https://commons.wikimedia.org/wiki/File:Gear_bearing_assembly.JPG", alt:"Зубчатая передача и подшипниковый узел", caption:"Зубчатая передача и подшипниковый узел — пример сборочной единицы.", author:"Guillaume Jacquenot", license:"CC BY-SA 3.0" },
    robot: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/Robot_arm_operates_machine_in_factory_setting.jpg?width=1200", page:"https://commons.wikimedia.org/wiki/File:Robot_arm_operates_machine_in_factory_setting.jpg", alt:"Промышленный робот у оборудования", caption:"Промышленный робот у оборудования — пример автоматизированной производственной ячейки.", author:"Shixart1985", license:"CC BY 2.0" },
    guard: { src:"https://commons.wikimedia.org/wiki/Special:FilePath/Machine_safety_guard.jpg?width=1200", page:"https://commons.wikimedia.org/wiki/File:Machine_safety_guard.jpg", alt:"Защитное ограждение станка", caption:"Защитное ограждение оборудования — пример инженерной меры снижения риска.", author:"Machine 1456", license:"CC0 1.0" }
  };
  var LOCAL = {
    coords:{src:"./assets/images/fig-2-coords.png",alt:"Схема координат",caption:"Схема координатных осей и ориентации детали."},
    lathe:{src:"./assets/images/fig-12-w-tokar.png",alt:"Токарная обработка",caption:"Пример токарной обработки."},
    mill:{src:"./assets/images/fig-13-w-frez.png",alt:"Фрезерная обработка",caption:"Пример фрезерной обработки."},
    machine:{src:"./assets/images/fig-16-machine.png",alt:"Металлорежущий станок",caption:"Металлорежущий станок — пример оборудования, параметры которого проверяют при выборе операции."},
    flange:{src:"./assets/images/fig-21-flanets.png",alt:"Фланцевое соединение",caption:"Фланцевое соединение — пример сборочной единицы."}
  };
  function esc(v){return String(v||"").replace(/[&<>"]/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c];});}
  function photoFor(id, topic) {
    var t=(topic.title||"").toLowerCase();
    if(id==="SPRUT_TP")return null;
    if(id==="MAT" && /сталь|структур|термообработ|свойств|микроструктур/.test(t))return COMMONS.metal;
    if(id==="MET" && /измер|штанген|микрометр|контрол|средств/.test(t))return COMMONS.caliper;
    if(id==="OT" && /опас|ограж|стан|защит|безопас|риск/.test(t))return COMMONS.guard;
    if(id==="02.01" && /сбор|подшип|зубчат|фланц|соедин|узел/.test(t))return /фланц/.test(t)?LOCAL.flange:COMMONS.assembly;
    if(id==="02.02" && /автомат|робот|датчик|контроллер|механизм|систем/.test(t))return COMMONS.robot;
    if((id==="07.01"||id==="MCAM"||id==="SPRUT_TP") && /токар|вал|точени|шпиндел/.test(t))return id==="SPRUT_TP"?LOCAL.lathe:COMMONS.lathe;
    if((id==="07.01"||id==="MCAM") && /фрез|карман|паз|контур/.test(t))return LOCAL.mill;
    if((id==="07.01"||id==="MCAM") && /координат|ноль|траектор|управляющ|постпроцесс/.test(t))return id==="07.01"?LOCAL.coords:COMMONS.cncMill;
    if(id==="04.01" && /диагност|неисправ|налад|стан|оборуд/.test(t))return LOCAL.machine;
    return null;
  }
  var SPRUT_STEPS = {
    "Введение в СПРУТ-ТП":["Исходная КД","Технологический анализ","Проектирование ТП","Документы","Проверка"],
    "Виды технологических процессов":["Область применения","Единичный / типовой / групповой","Степень детализации","Маршрут / операции","Выбор комплекта"],
    "ЕСТД и комплект технологических документов":["МК: весь маршрут","ОК: содержание операции","КЭ: установка и поверхности","Сверка ссылок","Выпуск комплекта"],
    "Интерфейс, проект и справочники":["Открыть проект","Проверить изделие","Выбрать НСИ","Заполнить ТП","Проверить результат"],
    "Исходные данные для разработки ТП":["Чертёж и спецификация","Материал","Программа выпуска","Требования и допуски","Карта исходных данных"],
    "Разработка маршрутного ТП":["Анализ детали","Выбор заготовки","Выбор баз","Последовательность операций","Контроль"],
    "Разработка операционного ТП":["Операция","Установ","Позиция (если есть)","Переход","Контроль"],
    "Маршрутно-операционный ТП":["Общий маршрут","Выбор ответственных операций","Подробные ОК","Связь с КЭ","Проверка комплекта"],
    "Типовые и групповые ТП":["Сравнение чертежей","Общие признаки","Группирование","Базовый процесс","Адаптация под деталь"],
    "Аналоги, шаблоны и база технологических знаний":["Поиск аналога","Проверка применимости","Адаптация данных","Контроль ресурсов","Новый процесс"],
    "ТП механической обработки":["Поверхность и требование","Метод обработки","Станок и оснастка","Инструмент и режим","Контроль"],
    "Заготовительные и специальные операции":["Заготовка","Специальная операция","Учёт деформаций / слоя","Последующая обработка","Контроль"],
    "Нормирование технологических процессов":["Исходные нормативы","Основное и вспомогательное время","Обслуживание и перерывы","Подготовительно-заключительное","Проверка нормы"],
    "Нормоконтроль и выпуск технологической документации":["Проверка комплекта","Нормоконтроль","Согласование","Утверждение","Актуальная редакция"]
  };
  function stepsFor(id,topic){
    if(id==="SPRUT_TP")return SPRUT_STEPS[topic.title]||null;
    var t=(topic.title||"").toLowerCase();
    if(id==="07.01"||id==="MCAM"){
      if(/дуг|круг|радиус/.test(t))return ["Начальная точка","Центр дуги","Направление","Конечная точка","Проверка"];
      if(/сверлен|отверст/.test(t))return ["Ноль детали","Позиция X/Y","Подход","Цикл обработки","Отвод"];
      if(/координат|ноль/.test(t))return ["Система координат","Ноль детали","Оси и знак","Положение инструмента","Проверка"];
      if(/постпроцесс|симуляц|провер/.test(t))return ["Геометрия","Траектория","Симуляция","Постпроцессор","Контроль NC-кода"];
      if(/токар|вал|точени/.test(t))return ["Заготовка","Закрепление","Черновая обработка","Чистовая обработка","Контроль"];
      if(/фрез|карман|паз|контур/.test(t))return ["Геометрия","Базирование","Выбор инструмента","Траектория","Проверка"];
    }
    if(id==="02.01" && /сбор|соедин|подшип|фланц/.test(t))return ["Подготовка деталей","Базирование","Соединение","Регулировка","Контроль узла"];
    if(id==="02.02" && /автомат|датчик|робот|контроллер/.test(t))return ["Сигнал датчика","Проверка условия","Команда контроллера","Действие механизма","Подтверждение результата"];
    if(id==="04.01" && /диагност|неисправ|налад|контрол/.test(t))return ["Признак","Сбор данных","Гипотеза","Измерение","Подтверждение причины"];
    if(id==="MAT" && /структур|свойств|испытан|термообработ/.test(t))return ["Состав и структура","Обработка","Изменение свойств","Испытание","Выбор материала"];
    if(id==="MET" && /измер|допуск|калибр|контрол/.test(t))return ["Требование чертежа","Выбор средства","Подготовка","Измерение","Оценка результата"];
    if(id==="OT" && /опас|риск|ограж|безопас/.test(t))return ["Выявить опасность","Оценить риск","Выбрать защиту","Проверить меры","Допустить работу"];
    return null;
  }
  function flowSvg(steps,label){
    var w=900,gap=12,bw=(w-40-gap*(steps.length-1))/steps.length;
    var nodes=steps.map(function(s,i){var x=20+i*(bw+gap);var words=esc(s).split(" "),lines=[],line="";
      words.forEach(function(word){if((line+" "+word).trim().length>17){lines.push(line);line=word;}else line=(line+" "+word).trim();});if(line)lines.push(line);
      return '<rect x="'+x+'" y="45" width="'+bw+'" height="88" rx="12" class="lv-node"/><text x="'+(x+12)+'" y="66" class="lv-step">'+(i+1)+'</text>'+
        lines.slice(0,3).map(function(z,j){return '<text x="'+(x+bw/2)+'" y="'+(88+j*18)+'" text-anchor="middle" class="lv-node-text">'+z+'</text>';}).join("")+
        (i<steps.length-1?'<path d="M'+(x+bw+2)+' 89 h'+(gap-4)+' m-5 -5 l5 5 -5 5" class="lv-arrow"/>':"");
    }).join("");
    return '<figure class="lv-figure"><figcaption class="lv-figure-title">'+esc(label)+'</figcaption><svg viewBox="0 0 900 170" role="img" aria-label="'+esc(label)+'">'+nodes+'</svg></figure>';
  }
  function specialSprutFigure(topic){
    var id=topic.title;
    if(id==="Виды технологических процессов")return '<div class="lv-figure"><div class="lv-figure-title">Две независимые оси классификации ТП</div><div class="lv-class-grid"><div><b>Область применения</b><span>Единичный</span><span>Типовой</span><span>Групповой</span></div><div><b>Степень детализации</b><span>Маршрутный</span><span>Маршрутно-операционный</span><span>Операционный</span></div></div><p class="lv-caption">Выбираются отдельно: один признак не определяет другой.</p></div>';
    if(id==="ЕСТД и комплект технологических документов")return '<div class="lv-figure"><div class="lv-figure-title">Связь технологических документов</div><div class="lv-doc-stack"><span><b>МК</b> — маршрут и операции</span><span><b>ОК</b> — установки и переходы выбранной операции</span><span><b>КЭ</b> — базирование, поверхности и эскиз</span></div><p class="lv-caption">Номера операций, обозначения и контрольные требования должны быть согласованы.</p></div>';
    if(id==="Разработка операционного ТП")return '<div class="lv-figure"><div class="lv-figure-title">Структура операционного описания</div><div class="lv-doc-stack"><span>Операция — рабочее место</span><span>Установ — неизменное закрепление</span><span>Позиция — положение в операции (если применимо)</span><span>Переход — конкретное действие обработки</span></div></div>';
    if(id==="Нормирование технологических процессов")return '<div class="lv-figure"><div class="lv-figure-title">Состав нормирования времени</div><div class="lv-class-grid"><div><b>На единицу</b><span>Основное</span><span>Вспомогательное</span><span>Обслуживание и регламентированные перерывы</span></div><div><b>На партию</b><span>Подготовительно-заключительное</span><span>Распределение по принятой методике</span><span>Проверка исходных нормативов</span></div></div></div>';
    return "";
  }
  function graphSvg(id,topic){
    var t=(topic.title||"").toLowerCase(),label="",xLabel="",yLabel="",path="";
    if(id==="MAT" && /прочност|растяж|механическ|деформац/.test(t)){
      label="Качественная диаграмма растяжения";xLabel="Относительное удлинение";yLabel="Напряжение";
      path="M70 205 L145 150 Q190 118 255 118 L390 95 Q485 78 535 96 Q590 120 645 166";
    }else if((id==="07.01"||id==="MCAM") && /координат|траектор|дуг|круг|контур|фрез/.test(t)){
      label="Схематическая траектория инструмента в координатной плоскости";xLabel="X";yLabel="Y";
      path="M90 190 L250 190 L250 115 Q250 55 330 55 L520 55 L650 130";
    }else return "";
    return '<figure class="lv-figure"><figcaption class="lv-figure-title">'+esc(label)+'</figcaption><svg viewBox="0 0 760 270" role="img" aria-label="'+esc(label)+'"><path d="M65 28 V210 H720" class="lv-axis"/><path d="M65 65 H720 M65 110 H720 M65 155 H720" class="lv-grid"/><path d="'+path+'" class="lv-curve"/><text x="18" y="24" class="lv-axis-label">'+esc(yLabel)+'</text><text x="390" y="255" text-anchor="middle" class="lv-axis-label">'+esc(xLabel)+'</text></svg><p class="lv-caption">Качественная иллюстрация формы зависимости/траектории, не числовые экспериментальные данные и не готовая управляющая программа.</p></figure>';
  }
  function photoHtml(photo){
    if(!photo)return "";
    var credit=photo.author?'<span class="lv-credit">Источник: Wikimedia Commons · '+esc(photo.author)+' · '+esc(photo.license)+' · <a href="'+photo.page+'" target="_blank" rel="noopener noreferrer">карточка и лицензия</a></span>':"";
    return '<figure class="lv-photo"><img loading="lazy" decoding="async" src="'+photo.src+'" alt="'+esc(photo.alt)+'" onerror="this.closest(\'figure\').classList.add(\'lv-image-missing\');this.remove();"><figcaption>'+esc(photo.caption)+credit+'</figcaption></figure>';
  }
  var usedPhotoSources = Object.create(null);
  function visualSupplement(id,topic){
    var photo=photoFor(id,topic),steps=stepsFor(id,topic),special=id==="SPRUT_TP"?specialSprutFigure(topic):"",graph=graphSvg(id,topic);
    if(photo && usedPhotoSources[photo.src]) photo=null;
    else if(photo) usedPhotoSources[photo.src]=true;
    if(!photo&&!steps&&!special&&!graph)return "";
    var html='<section class="lecture-visual-atlas"><h3>Визуальные материалы по теме</h3>';
    html+=photoHtml(photo);
    if(special)html+=special;
    if(steps)html+=flowSvg(steps,"Схема по теме «"+(topic.title||"")+"»");
    if(graph)html+=graph;
    if(photo||special||steps||graph)html+='<div class="lv-task"><b>Задание по иллюстрации</b><ol><li>Назовите элементы, непосредственно связанные с изучаемой темой.</li><li>Объясните последовательность или взаимосвязь, показанную на схеме.</li><li>Укажите, какие исходные данные нужны для проверки решения на реальном производстве.</li></ol></div>';
    return html+'</section>';
  }
  var count=0;
  Object.keys(courses).forEach(function(id){
    if(["basic","technical"].indexOf(id)>=0)return;
    var course=courses[id];if(!course||!Array.isArray(course.sections))return;
    course.sections.forEach(function(section){(section.topics||[]).forEach(function(topic){
      if(!Array.isArray(topic.lectures)||topic.lectures.some(function(item){return item&&item.__visualAtlasAdded;}))return;
      var lecture=topic.lectures.find(function(item){return item&&typeof item.content==="string";});
      if(!lecture)return;
      var html=visualSupplement(id,topic);
      if(html){lecture.content+=html;lecture.__visualAtlasAdded=true;count++;}
    });});
  });
  window.LECTURE_VISUAL_ATLAS_COUNT=count;
})();