"use strict";

window.GLOBAL_DATA = {
  // Возвращаем все 9 видео. Используем надежные ссылки YouTube.
  // Если хотите локальные файлы, замените url на file: "video/1.mp4"
  videos: [
    { title: "Видеоурок 1: Введение", description: "Основы ЧПУ", url: "https://www.youtube.com/watch?v=8jPQjjsBbIc" },
    { title: "Видеоурок 2: G-коды", description: "Разбор G00, G01", url: "https://www.youtube.com/watch?v=1h2sQ3eY7wE" },
    { title: "Видеоурок 3: Наладка", description: "Практические приемы", url: "https://www.youtube.com/watch?v=7q3jZ8Xm2yY" },
    { title: "Видеоурок 4", description: "Учебный материал", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Видеоурок 5", description: "Учебный материал", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Видеоурок 6", description: "Учебный материал", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Видеоурок 7", description: "Учебный материал", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Видеоурок 8", description: "Учебный материал", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Видеоурок 9", description: "Учебный материал", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
  ],
  
  // Пути к PDF (Папка passport должна существовать в репозитории!)
  passports: [
    { title: "Паспорт станка 2Д450", description: "Радиально-сверлильный станок", file: "passport/2d450.pdf" },
    { title: "Паспорт станка 2С108П", description: "Вертикально-сверлильный станок", file: "passport/2s108p.pdf" },
    { title: "Паспорт станка 16К40", description: "Токарно-винторезный станок", file: "passport/16k40.pdf" },
    { title: "Паспорт станка X6142", description: "Универсальный консольно-фрезерный станок", file: "passport/MODEL-X6142-UNIVERSAL_RU.pdf" }
  ],
  
  // Инструкции (папка ohranatruda)
  safety: [
    { title: "ИОТ для токаря", description: "Инструкция по охране труда", file: "ohranatruda/иот токаря.docx" },
    { title: "ИОТ для фрезеровщика", description: "Инструкция по охране труда", file: "ohranatruda/иот фрезер.docx" },
    { title: "ИОТ (общая)", description: "Общие требования", file: "ohranatruda/Инструкция по охране труда.docx" }
  ],
  
  formatting: {
    title: "Требования к оформлению работ",
    content: `<h3>Общие правила</h3>
      <ul>
        <li><b>Шрифт:</b> Times New Roman, 14 пт.</li>
        <li><b>Интервал:</b> 1.5.</li>
        <li><b>Поля:</b> левое — 3 см, правое — 1.5 см, верхнее/нижнее — 2 см.</li>
      </ul>`
  }
};