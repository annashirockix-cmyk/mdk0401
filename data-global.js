"use strict";

window.GLOBAL_DATA = {
  // Видеофайлы >50 МБ нельзя стабильно хранить на GitHub Pages.
  // Загрузите 1.mp4…9.mp4 в папку attachments/ репозитория или укажите YouTube в external.
  videos: [
    { title: "Видеоурок 1: Введение", description: "Основы ЧПУ. Если плеер пустой — файл не загружен на хостинг.", file: "./attachments/1.mp4", external: "" },
    { title: "Видеоурок 2: G-коды", description: "Разбор команд", file: "./attachments/2.mp4", external: "" },
    { title: "Видеоурок 3: Наладка", description: "Практические приемы", file: "./attachments/3.mp4", external: "" },
    { title: "Видеоурок 4", description: "Учебный материал", file: "./attachments/4.mp4", external: "" },
    { title: "Видеоурок 5", description: "Учебный материал", file: "./attachments/5.mp4", external: "" },
    { title: "Видеоурок 6", description: "Учебный материал", file: "./attachments/6.mp4", external: "" },
    { title: "Видеоурок 8", description: "Учебный материал", file: "./attachments/8.mp4", external: "" },
    { title: "Видеоурок 9", description: "Учебный материал", file: "./attachments/9.mp4", external: "" }
  ],

  passports: [
    { title: "Паспорт станка 2Д450", description: "Радиально-сверлильный станок", file: "https://drive.google.com/file/d/1Huq1g6I8H5mJsL4C-LDWmhND0dcI7sty/view" },
    { title: "Паспорт станка 2С108П", description: "Вертикально-сверлильный станок", file: "https://drive.google.com/file/d/1FNm889YEavDTpVvOwjlpMgLqJyVrCmml/view" },
    { title: "Паспорт станка 16К40", description: "Токарно-винторезный станок", file: "https://drive.google.com/file/d/1BaGozq0SiGSUHBNH0hMVjeMmYT9OMt9b/view" },
    { title: "Паспорт станка X6142", description: "Универсальный консольно-фрезерный станок", file: "https://drive.google.com/file/d/1E3TVcfxBlosPpREDmRCNGbTpjvLjl8z8/view" }
  ],

  safety: [
    { title: "ИОТ для токаря", description: "Инструкция по охране труда", file: "https://drive.google.com/file/d/1GqSbWhlKScLW2ync6xzimLXEeaVkH0HP/view" },
    { title: "ИОТ для фрезеровщика", description: "Инструкция по охране труда", file: "https://drive.google.com/file/d/1i5dG6GCFzuW29cAESFXsqyjmR6JRPVTq/view" },
    { title: "ИОТ при работе на вертикально-протяжном станке", description: "Инструкция", file: "https://drive.google.com/file/d/1xYvR0RhfpoMrLuYcfbtkpQ1x854jn1SX/view" },
    { title: "ИОТ для кранбалки", description: "Инструкция", file: "https://drive.google.com/file/d/1sJF9DO12ytPPrQaHM-k7pQnCS4TmIxUW/view" },
    { title: "Инструкция по охране труда (общая)", description: "Общие требования", file: "https://drive.google.com/file/d/176Td3NoCwAezr3QgkSAYJxczz-UpLxw8/view" }
  ],

  presentations: []
};
