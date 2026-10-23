"use strict";

window.GLOBAL_DATA = {
  // Ссылки на YouTube (гарантированно работают) или локальные файлы
  videos: [
    { title: "Видеоурок 1: Введение в ЧПУ", description: "Основы программирования станков", url: "https://www.youtube.com/watch?v=8jPQjjsBbIc" },
    { title: "Видеоурок 2: Разбор G-кодов", description: "G00, G01, G02, G03", url: "https://www.youtube.com/watch?v=1h2sQ3eY7wE" },
    { title: "Видеоурок 3: Наладка станка", description: "Практические приемы", url: "https://www.youtube.com/watch?v=7q3jZ8Xm2yY" },
    // Если хотите использовать локальные файлы, раскомментируйте строки ниже (и загрузите их в папку video)
    // { title: "Видеоурок 4 (Локальный)", description: "Файл с сервера", file: "video/4.mp4" }
  ],
  
  // Пути к локальным PDF файлам (папка passport)
  passports: [
    { title: "Паспорт станка 2Д450", description: "Радиально-сверлильный станок", file: "passport/2d450.pdf" },
    { title: "Паспорт станка 2С108П", description: "Вертикально-сверлильный станок", file: "passport/2s108p.pdf" },
    { title: "Паспорт станка 16К40", description: "Токарно-винторезный станок", file: "passport/16k40.pdf" },
    { title: "Паспорт станка X6142", description: "Универсальный консольно-фрезерный станок", file: "passport/MODEL-X6142-UNIVERSAL_RU.pdf" }
  ],
  
  // Охрана труда (файлы .docx из папки ohranatruda)
  // Скрипт app.js автоматически откроет их через Google Docs Viewer
  safety: [
    { title: "ИОТ для токаря", description: "Инструкция по охране труда", file: "ohranatruda/иот токаря.docx" },
    { title: "ИОТ для фрезеровщика", description: "Инструкция по охране труда", file: "ohranatruda/иот фрезер.docx" },
    { title: "ИОТ при работе на вертикально-протяжном станке", description: "Инструкция", file: "ohranatruda/иот при работе на вертикально-протяжном.docx" },
    { title: "ИОТ для карабашки", description: "Инструкция", file: "ohranatruda/иот карабашки.docx" },
    { title: "Инструкция по охране труда (общая)", description: "Общие требования", file: "ohranatruda/Инструкция по охране труда.docx" }
  ],
  
  formatting: {
    title: "Требования к оформлению работ",
    content: `<h3>Общие правила</h3>
      <ul>
        <li><b>Шрифт:</b> Times New Roman, 14 пт.</li>
        <li><b>Интервал:</b> 1.5.</li>
        <li><b>Поля:</b> левое — 3 см, правое — 1.5 см, верхнее/нижнее — 2 см.</li>
        <li><b>Абзацный отступ:</b> 1.25 см.</li>
      </ul>
      <h3>Структура отчета</h3>
      <ol>
        <li>Титульный лист (по образцу).</li>
        <li>Цель работы.</li>
        <li>Исходные данные (задание, чертеж).</li>
        <li>Ход работы (расчеты, таблицы, рисунки).</li>
        <li>Выводы.</li>
      </ol>
      <h3>Рисунки и таблицы</h3>
      <p>Рисунки подписываются снизу (Рисунок 1 – Название), таблицы — сверху (Таблица 1 – Название). В тексте обязательны ссылки на них.</p>`
  }
};