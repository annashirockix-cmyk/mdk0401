"use strict";

window.GLOBAL_DATA = {
  // Ссылки на YouTube (открываются прямо в iframe на сайте)
  videos: [
    { title: "Введение в ЧПУ", description: "Основы программирования станков", url: "https://www.youtube.com/watch?v=8jPQjjsBbIc" }, 
    { title: "Урок 2: G-коды", description: "Разбор G00, G01, G02, G03", url: "https://www.youtube.com/watch?v=1h2sQ3eY7wE" },
    { title: "Наладка токарного станка", description: "Практические приемы", url: "https://www.youtube.com/watch?v=7q3jZ8Xm2yY" }
  ],
  
  // Пути к локальным PDF файлам (открываются в iframe)
  passports: [
    { title: "Паспорт станка 16К20", description: "Токарно-винторезный", file: "passport/16k20.pdf" }, 
    { title: "Паспорт станка 6Р82", description: "Вертикально-фрезерный", file: "passport/6r82.pdf" }
  ],
  
  safety: [
    { title: "ИОТ для токаря", description: "Инструкция по охране труда", file: "ohranatruda/tokar.pdf" },
    { title: "ИОТ для фрезеровщика", description: "Инструкция по охране труда", file: "ohranatruda/frezer.pdf" }
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