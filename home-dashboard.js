(function () {
  "use strict";

  function addAction(list, title, description, href, symbol) {
    var link = document.createElement("a");
    link.className = "home-dashboard-action";
    link.href = href;
    link.setAttribute("aria-label", title + ". " + description);
    var icon = document.createElement("span");
    icon.className = "home-dashboard-action-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = symbol;
    var copy = document.createElement("span");
    copy.className = "home-dashboard-action-copy";
    var heading = document.createElement("strong");
    heading.textContent = title;
    var detail = document.createElement("small");
    detail.textContent = description;
    copy.appendChild(heading);
    copy.appendChild(detail);
    var arrow = document.createElement("span");
    arrow.className = "home-dashboard-action-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    link.append(icon, copy, arrow);
    list.appendChild(link);
  }

  function renderHomeDashboard() {
    var app = document.getElementById("app");
    var state = window.state || {};
    if (!app || app.querySelector("#homeDashboard")) return;
    var student = state.student || null;
    var staff = state.staff || state.teacher || state.admin || null;
    if (!student && !staff) return;

    var isAdmin = !!(state.admin || (staff && String(staff.role || "").toLowerCase() === "admin"));
    var isTeacher = !!staff || isAdmin;
    var courseId = String(state.activeCourseId || "");
    var course = window.MDK_DATA && window.MDK_DATA[courseId];
    var section = document.createElement("section");
    section.id = "homeDashboard";
    section.className = "home-dashboard";
    section.setAttribute("aria-labelledby", "homeDashboardTitle");

    var header = document.createElement("div");
    header.className = "home-dashboard-header";
    var intro = document.createElement("div");
    var eyebrow = document.createElement("span");
    eyebrow.className = "home-dashboard-eyebrow";
    eyebrow.textContent = isTeacher ? "РАБОЧЕЕ ПРОСТРАНСТВО" : "ВАШЕ ОБУЧЕНИЕ";
    var title = document.createElement("h2");
    title.id = "homeDashboardTitle";
    title.textContent = isTeacher ? "Быстрый доступ преподавателя" : "Продолжить обучение";
    var subtitle = document.createElement("p");
    subtitle.textContent = course ? "Текущая дисциплина: " + String(course.shortName || course.title || courseId) : "Выберите доступную дисциплину в верхней панели.";
    intro.append(eyebrow, title, subtitle);
    header.appendChild(intro);
    section.appendChild(header);

    var actions = document.createElement("div");
    actions.className = "home-dashboard-grid";
    if (isTeacher) {
      addAction(actions, "Панель преподавателя", "Обзор учебной работы и управления", "#/teacher-dashboard", "📊");
      addAction(actions, "Журнал", "Оценки и результаты студентов", "#/journal", "📋");
      addAction(actions, "Конструктор заданий", "Создание и проверка учебных работ", "#/teacher-tasks", "🧩");
      addAction(actions, "Редактор курсов", "Лекции, темы, тесты и материалы", "#/course-editor", "✍️");
      addAction(actions, "Банк вопросов", "Управление вопросами для контроля знаний", "#/question-bank", "🗂️");
      addAction(actions, "Дополнительные занятия", "Настройка консультаций и записи студентов", "#/tutoring", "🎓");
      if (isAdmin) addAction(actions, "Администрирование", "Системные настройки и управление доступом", "#/admin", "⚙️");
    } else {
      var firstTopic = null;
      if (course && Array.isArray(course.sections)) {
        for (var i = 0; i < course.sections.length && !firstTopic; i++) {
          var topics = course.sections[i] && course.sections[i].topics;
          if (Array.isArray(topics) && topics.length) firstTopic = topics[0];
        }
      }
      if (firstTopic && firstTopic.id) {
        addAction(actions, "Продолжить изучение тем", "Открыть материалы выбранной дисциплины", "#/topic/" + encodeURIComponent(courseId) + "/" + encodeURIComponent(firstTopic.id), "📚");
      } else {
        addAction(actions, "Учебные материалы", "Перейти к доступным материалам", "#/resources", "📚");
      }
      addAction(actions, "Мои оценки", "Результаты и успеваемость", "#/grades", "📈");
      addAction(actions, "Задания", "Учебные задания и отправка работ", "#/teacher-tasks", "📝");
      addAction(actions, "Лаборатории", "Практика и профессиональные тренажёры", "#/laboratory", "🔬");
      addAction(actions, "Личный кабинет", "Профиль и учебные достижения", "#/profile", "👤");
    }
    section.appendChild(actions);

    var hero = app.querySelector(".hero");
    if (hero && hero.parentNode === app) hero.insertAdjacentElement("afterend", section);
    else app.insertBefore(section, app.firstChild);
  }

  var original = window.renderHomePage;
  if (typeof original === "function") {
    window.renderHomePage = function () {
      var result = original.apply(this, arguments);
      renderHomeDashboard();
      return result;
    };
  }
  window.renderHomeDashboard = renderHomeDashboard;
})();