"use strict";

window.GLOBAL_DATA = {
  // Видео лежат в attachments/ (папка video/ на GitHub пуста)
  videos: [
    { title: "Видеоурок 1: Введение", description: "Основы ЧПУ", file: "attachments/1.mp4" },
    { title: "Видеоурок 2: G-коды", description: "Разбор команд", file: "attachments/2.mp4" },
    { title: "Видеоурок 3: Наладка", description: "Практические приемы", file: "attachments/3.mp4" },
    { title: "Видеоурок 4", description: "Учебный материал", file: "attachments/4.mp4" },
    { title: "Видеоурок 5", description: "Учебный материал", file: "attachments/5.mp4" },
    { title: "Видеоурок 6", description: "Учебный материал", file: "attachments/6.mp4" },
    { title: "Видеоурок 8", description: "Учебный материал", file: "attachments/8.mp4" },
    { title: "Видеоурок 9", description: "Учебный материал", file: "attachments/9.mp4" }
  ],

  passports: [
    { title: "Паспорт станка 2Д450", description: "Радиально-сверлильный станок", file: "attachments/2d450.pdf" },
    { title: "Паспорт станка 2С108П", description: "Вертикально-сверлильный станок", file: "attachments/2s108p.pdf" },
    { title: "Паспорт станка 16К40", description: "Токарно-винторезный станок", file: "attachments/16k40.pdf" },
    { title: "Паспорт станка X6142", description: "Универсальный консольно-фрезерный станок", file: "attachments/MODEL-X6142-UNIVERSAL_RU.pdf" }
  ],

  safety: [
    { title: "ИОТ для токаря", description: "Инструкция по охране труда", file: "attachments/иот токаря.docx" },
    { title: "ИОТ для фрезеровщика", description: "Инструкция по охране труда", file: "attachments/иот фрезер.docx" },
    { title: "ИОТ при работе на вертикально-протяжном станке", description: "Инструкция", file: "attachments/иот при работе на вертикально-протяжных полуавтоматах.docx" },
    { title: "ИОТ для кранбалки", description: "Инструкция", file: "attachments/иот кранбалки.docx" },
    { title: "Инструкция по охране труда (общая)", description: "Общие требования", file: "attachments/Инструкция по охране труда.docx" }
  ],

  presentations: [
    { title: "Лекция 1", description: "Презентация", file: "presentations/лекция1.pptx" },
    { title: "Лекция 2", description: "Презентация", file: "presentations/лекция2.pptx" },
    { title: "Лекция 3", description: "Презентация", file: "presentations/Лекция 3.pptx" },
    { title: "Общие основы работы на токарных станках", description: "Презентация", file: "presentations/Obshie-osnovy-raboty-na-tokarnyh-stankah.pptx" },
    { title: "Презентация 4", description: "Презентация", file: "presentations/4.pptx" }
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
      <h3>Структура отчёта</h3>
      <ol>
        <li>Титульный лист</li>
        <li>Цель работы</li>
        <li>Ход работы / расчёты</li>
        <li>Вывод</li>
      </ol>`
  }
};
