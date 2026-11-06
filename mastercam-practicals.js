"use strict";
(function () {
  var folders = {
    1: "https://drive.google.com/drive/folders/1znoQchNkgHlI5ptiinenOkPwyaR9622o?usp=drive_link",
    2: "https://drive.google.com/drive/folders/18d54j3Z167WnJR3CDx9fQiA7F_odItIf?usp=drive_link",
    3: "https://drive.google.com/drive/folders/12riOtqcBUCHb8SMg8f3JuOcDy0tzzwo2?usp=drive_link",
    4: "https://drive.google.com/drive/folders/1MVpItB7XA0iWGCfUYzKfzcrie5NnauIJ?usp=drive_link",
    5: "https://drive.google.com/drive/folders/12Frc6ARRm89-8OMAKP2T3Rz9Au9SUgzD?usp=drive_link"
  };
  var course = window.MDK_DATA && window.MDK_DATA.MCAM;
  if (!course || !Array.isArray(course.sections)) return;
  var lessonByTopic = { "mc-t11": 1, "mc-t21": 2, "mc-t31": 3, "mc-t41": 4, "mc-t51": 5 };
  course.sections.forEach(function (section) {
    (section.topics || []).forEach(function (topic) {
      var lesson = lessonByTopic[topic.id];
      if (!lesson) return;
      topic.practicals = [{
        code: "ПР-MC-" + String(lesson).padStart(2, "0"),
        title: "Практический урок " + lesson + ". Материалы и выполнение",
        goal: "Изучить материалы соответствующего урока Mastercam и выполнить практическую часть по приложенным учебным файлам.",
        task: "Откройте папку урока на Google Диске. Последовательно изучите размещённые в ней материалы (лекцию, видео, чертёж и другие файлы, если они есть). Выполните практическое задание по чертежу в Mastercam, сохраните результат и опишите выполненные действия в поле ниже.",
        resources: [{ title: "Открыть папку урока " + lesson + " на Google Диске", url: folders[lesson], icon: "📂" }],
        notice: lesson === 5 ? "Видео к уроку 5 ещё загружается на Google Диск. Папка уже подключена; видео станет доступно по той же ссылке после загрузки." : ""
      }];
    });
  });
})();