/**
 * Учебный портал: Google Apps Script + Google Sheets.
 * Совместим с api.js в репозитории mdk0401.
 *
 * Первичная настройка:
 * 1) ID Google-таблицы уже указан ниже в CFG.SPREADSHEET_ID.
 * 2) Запустить setupPortal().
 * 3) Зарегистрировать учётную запись на сайте.
 * 4) Запустить promoteUserToAdmin("email@example.com").
 * 5) Развернуть новую версию веб-приложения.
 */

const CFG = {
  SPREADSHEET_ID: "1UEO0ynuLlbmtixSVTAmbqSnpvbna_PeQlDzu_ztKedk",
  USERS: "Users",
  RESULTS: "Results",
  CONTENT: "CourseContent",
  SCHEDULE: "Schedule",
  SESSION_PREFIX: "portal_session:",
  SESSION_TTL: 21600, // 6 часов
  LEGACY_SALT: "portal_spo_2026",
  COURSES: ["07.01", "04.01", "02.01", "02.02", "MCAM", "MAT", "OT"]
};

const HEADERS = {
  Users: ["Email", "PasswordHash", "Name", "Group", "Role", "UpdatedAt", "Courses", "Payload", "PasswordSalt"],
  Results: ["Email", "Name", "Group", "TestId", "TestTitle", "Grade", "Score", "MaxScore", "Percent", "TimeSpent", "Attempts", "FinishedAt", "CourseId"],
  CourseContent: ["Id", "CourseId", "TopicId", "Type", "Title", "Payload", "UpdatedBy", "UpdatedAt"],
  Schedule: ["Schedule"]
};

/* ---------- HTTP entry points ---------- */

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const data = {};
    if (e && e.postData && e.postData.contents) {
      const parsed = JSON.parse(e.postData.contents || "{}");
      Object.keys(parsed || {}).forEach(function (key) { data[key] = parsed[key]; });
    }
    if (e && e.parameter) {
      Object.keys(e.parameter).forEach(function (key) {
        if (data[key] === undefined) data[key] = e.parameter[key];
      });
    }

    const action = String(data.action || "").toLowerCase().replace(/[_-]/g, "");
    let result;

    switch (action) {
      case "login": result = login_(data); break;
      case "register": result = register_(data); break;
      case "savestudent": result = saveStudent_(data); break;
      case "getstudents": result = getStudents_(data); break;
      case "saveresult": result = saveResult_(data); break;
      case "getresults": result = getResults_(data); break;
      case "getcustomcontent": result = getCustomContent_(data); break;
      case "savecustomcontent": result = saveCustomContent_(data); break;
      case "deletecustomcontent": result = deleteCustomContent_(data); break;
      case "setteachercourses": result = setTeacherCourses_(data); break;
      case "setuserrole": result = setUserRole_(data); break;
      case "getschedule": result = getSchedule_(data); break;
      case "saveschedule": result = saveSchedule_(data); break;
      default:
        result = { success: false, error: "Неизвестное действие: " + action };
    }
    return json_(result);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return json_({ success: false, error: String(error && error.message ? error.message : error) });
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Spreadsheet and sheets ---------- */

function getSpreadsheet_() {
  const id = CFG.SPREADSHEET_ID || PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) {
    throw new Error("Не задан SPREADSHEET_ID. Укажите ID таблицы в CFG.SPREADSHEET_ID.");
  }
  return SpreadsheetApp.openById(id);
}

function ensureSheet_(name) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  const headers = HEADERS[name];
  if (!headers) throw new Error("Неизвестный лист: " + name);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return sheet;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
  headers.forEach(function (header) {
    if (existing.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      existing.push(header);
    }
  });
  return sheet;
}

function users_() { return ensureSheet_(CFG.USERS); }
function results_() { return ensureSheet_(CFG.RESULTS); }
function content_() { return ensureSheet_(CFG.CONTENT); }
function schedule_() { return ensureSheet_(CFG.SCHEDULE); }

/**
 * Запустите вручную один раз после добавления SPREADSHEET_ID.
 * Функция создаёт недостающие листы и заголовки, но не удаляет данные.
 */
function setupPortal() {
  [CFG.USERS, CFG.RESULTS, CFG.CONTENT, CFG.SCHEDULE].forEach(ensureSheet_);
  const ss = getSpreadsheet_();
  Logger.log("Портал настроен. Таблица: " + ss.getName());
  return "Готово. Созданы/проверены листы Users, Results, CourseContent, Schedule.";
}

/* ---------- Common helpers and authentication ---------- */

function email_(value) {
  return String(value || "").trim().toLowerCase();
}

function bytesToHex_(bytes) {
  return bytes.map(function (byte) {
    return ("0" + ((byte + 256) % 256).toString(16)).slice(-2);
  }).join("");
}

function passwordHash_(password, salt) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(salt) + "|" + String(password),
    Utilities.Charset.UTF_8
  );
  return bytesToHex_(digest);
}

function legacyPasswordHash_(password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    CFG.LEGACY_SALT + String(password || ""),
    Utilities.Charset.UTF_8
  );
  return bytesToHex_(digest);
}

function headerMap_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const map = {};
  headers.forEach(function (header, index) { map[header] = index; });
  return map;
}

function userByEmail_(email) {
  const sheet = users_();
  const values = sheet.getDataRange().getValues();
  if (!values.length) return null;

  const headers = values[0].map(String);
  const index = {};
  headers.forEach(function (header, i) { index[header] = i; });
  const target = email_(email);

  for (let row = 1; row < values.length; row++) {
    if (email_(values[row][index.Email]) === target) {
      return {
        row: row + 1,
        email: target,
        passwordHash: String(values[row][index.PasswordHash] || ""),
        passwordSalt: String(values[row][index.PasswordSalt] || ""),
        name: String(values[row][index.Name] || ""),
        group: String(values[row][index.Group] || ""),
        role: String(values[row][index.Role] || "student").toLowerCase(),
        courses: String(values[row][index.Courses] || ""),
        payload: String(values[row][index.Payload] || "")
      };
    }
  }
  return null;
}

function writeUserFields_(user, fields) {
  const sheet = users_();
  const map = headerMap_(sheet);
  const row = sheet.getRange(user.row, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(fields).forEach(function (key) {
    if (map[key] !== undefined) row[map[key]] = fields[key];
  });
  sheet.getRange(user.row, 1, 1, row.length).setValues([row]);
}

function createSession_(user) {
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put(CFG.SESSION_PREFIX + token, user.email, CFG.SESSION_TTL);
  return token;
}

function auth_(data) {
  const token = String(data.token || "");
  if (!token) throw new Error("Требуется авторизация. Войдите в портал заново.");

  const email = CacheService.getScriptCache().get(CFG.SESSION_PREFIX + token);
  if (!email) throw new Error("Сессия истекла. Войдите в портал заново.");

  const user = userByEmail_(email);
  if (!user) throw new Error("Пользователь не найден.");
  return user;
}

function admin_(data) {
  const user = auth_(data);
  if (user.role !== "admin") throw new Error("Операция доступна только администратору.");
  return user;
}

function hasCourseAccess_(user, courseId) {
  if (user.role === "admin") return true;
  if (user.role !== "teacher") return false;
  return user.courses.split(",").map(function (id) { return id.trim(); })
    .indexOf(String(courseId)) !== -1;
}

function editor_(data, courseId) {
  const user = auth_(data);
  if (user.role !== "admin" && !(user.role === "teacher" && hasCourseAccess_(user, courseId))) {
    throw new Error("У вас нет прав редактировать эту дисциплину.");
  }
  return user;
}

/* ---------- Registration and login ---------- */

function register_(data) {
  const email = email_(data.email);
  const password = String(data.password || "");
  if (!email || email.indexOf("@") < 1) return { success: false, error: "Укажите корректный email." };
  if (password.length < 8) return { success: false, error: "Пароль должен содержать не менее 8 символов." };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (userByEmail_(email)) return { success: false, error: "Пользователь с таким email уже зарегистрирован." };

    const salt = Utilities.getUuid() + Utilities.getUuid();
    const sheet = users_();
    const map = headerMap_(sheet);
    const row = new Array(sheet.getLastColumn()).fill("");
    const values = {
      Email: email,
      PasswordHash: passwordHash_(password, salt),
      Name: String(data.name || email),
      Group: String(data.group || ""),
      Role: "student",
      UpdatedAt: new Date().toISOString(),
      Courses: "",
      Payload: "",
      PasswordSalt: salt
    };
    Object.keys(values).forEach(function (key) {
      if (map[key] !== undefined) row[map[key]] = values[key];
    });
    sheet.appendRow(row);
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}

function login_(data) {
  const email = email_(data.email);
  const password = String(data.password || "");
  if (!email || !password) return { success: false, error: "Введите email и пароль." };

  const cache = CacheService.getScriptCache();
  const attemptKey = "login_attempts:" + bytesToHex_(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, email, Utilities.Charset.UTF_8
  ));
  const attempts = Number(cache.get(attemptKey) || 0);
  if (attempts >= 8) return { success: false, error: "Слишком много попыток. Подождите 15 минут и попробуйте снова." };

  const user = userByEmail_(email);
  let valid = false;
  if (user) {
    valid = user.passwordSalt
      ? user.passwordHash === passwordHash_(password, user.passwordSalt)
      : user.passwordHash === legacyPasswordHash_(password);

    // Перевод старых аккаунтов на индивидуальную соль при первом успешном входе.
    if (valid && !user.passwordSalt) {
      const salt = Utilities.getUuid() + Utilities.getUuid();
      writeUserFields_(user, {
        PasswordSalt: salt,
        PasswordHash: passwordHash_(password, salt),
        UpdatedAt: new Date().toISOString()
      });
    }
  }

  if (!valid) {
    cache.put(attemptKey, String(attempts + 1), 900);
    return { success: false, error: "Неверный email или пароль." };
  }

  cache.remove(attemptKey);
  return {
    success: true,
    email: user.email,
    name: user.name,
    group: user.group,
    role: user.role,
    courses: user.courses ? user.courses.split(",").filter(Boolean) : [],
    token: createSession_(user)
  };
}

/* ---------- Student profile and test results ---------- */

function saveStudent_(data) {
  const current = auth_(data);
  const targetEmail = email_(data.email || current.email);
  if (targetEmail !== current.email && current.role !== "admin") {
    throw new Error("Нельзя изменять данные другого пользователя.");
  }

  const target = userByEmail_(targetEmail);
  if (!target) throw new Error("Пользователь не найден.");

  const fields = { UpdatedAt: new Date().toISOString() };
  if (data.name !== undefined) fields.Name = String(data.name);
  if (data.group !== undefined) fields.Group = String(data.group);
  if (data.payload !== undefined) {
    fields.Payload = typeof data.payload === "string" ? data.payload : JSON.stringify(data.payload || {});
  }
  writeUserFields_(target, fields);
  return { success: true };
}

function getStudents_(data) {
  const user = auth_(data);
  if (user.role !== "admin" && user.role !== "teacher") throw new Error("Недостаточно прав.");

  const sheet = users_();
  const values = sheet.getDataRange().getValues();
  const map = headerMap_(sheet);
  const students = values.slice(1).filter(function (row) {
    if (!row[map.Email]) return false;
    // Администратору нужны все записи, включая преподавателей, для управления доступом.
    // Преподаватель получает только список обучающихся.
    return user.role === "admin" || String(row[map.Role]).toLowerCase() === "student";
  }).map(function (row) {
    return {
      email: row[map.Email],
      name: row[map.Name],
      group: row[map.Group],
      role: row[map.Role],
      courses: user.role === "admin" ? String(row[map.Courses] || "") : "",
      payload: user.role === "admin" ? String(row[map.Payload] || "") : "{}"
    };
  });
  return { success: true, students: students };
}

function saveResult_(data) {
  const user = auth_(data);
  const email = email_(data.email || user.email);
  if (email !== user.email && user.role !== "admin") {
    throw new Error("Нельзя отправлять результат за другого пользователя.");
  }

  const sheet = results_();
  const values = sheet.getDataRange().getValues();
  const testId = String(data.testId || "test");
  const attempts = values.slice(1).filter(function (row) {
    return email_(row[0]) === email && String(row[3]) === testId;
  }).length + 1;

  sheet.appendRow([
    email,
    String(data.name || user.name),
    String(data.group || user.group),
    testId,
    String(data.testTitle || testId),
    Number(data.grade) || 2,
    Number(data.score) || 0,
    Number(data.maxScore) || 0,
    Number(data.percent) || 0,
    Math.max(0, Number(data.timeSpent) || 0),
    attempts,
    new Date().toISOString(),
    String(data.courseId || "")
  ]);
  return { success: true, attempts: attempts };
}

function getResults_(data) {
  const user = auth_(data);
  if (user.role !== "admin" && user.role !== "teacher") throw new Error("Недостаточно прав.");

  const values = results_().getDataRange().getValues();
  let list = values.slice(1).filter(function (row) { return row[0]; }).map(function (row) {
    return {
      email: row[0], name: row[1], group: row[2], testId: row[3], testTitle: row[4],
      grade: row[5], score: row[6], maxScore: row[7], percent: row[8],
      timeSpent: row[9], attempts: row[10], finishedAt: row[11], courseId: row[12] || ""
    };
  });

  if (user.role === "teacher") list = list.filter(function (item) {
    return hasCourseAccess_(user, item.courseId);
  });
  if (data.courseId) list = list.filter(function (item) {
    return item.courseId === String(data.courseId);
  });

  list.sort(function (a, b) {
    return String(b.finishedAt).localeCompare(String(a.finishedAt));
  });
  return { success: true, results: list };
}

/* ---------- Teacher-created topics, lectures and tests ---------- */

function getCustomContent_(data) {
  const user = auth_(data);
  const values = content_().getDataRange().getValues();
  const list = [];

  values.slice(1).forEach(function (row) {
    if (!row[0]) return;
    const courseId = String(row[1] || "");
    if (user.role === "teacher" && !hasCourseAccess_(user, courseId)) return;

    let payload = {};
    try { payload = JSON.parse(row[5] || "{}"); } catch (error) { payload = {}; }

    list.push(Object.assign({
      id: String(row[0]),
      mdkId: courseId,
      courseId: courseId,
      topicId: String(row[2] || ""),
      type: String(row[3] || ""),
      title: String(row[4] || "")
    }, payload));
  });

  return { success: true, data: list };
}

function saveCustomContent_(data) {
  const courseId = String(data.mdkId || data.courseId || "");
  if (!courseId) throw new Error("Не указана дисциплина.");
  const user = editor_(data, courseId);
  const id = String(data.id || Utilities.getUuid());
  const type = String(data.type || "");
  if (["topic", "lecture", "test", "file"].indexOf(type) === -1) {
    throw new Error("Допустимые типы материалов: topic, lecture, test, file.");
  }

  const sheet = content_();
  const values = sheet.getDataRange().getValues();
  let targetRow = 0;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === id) {
      if (String(values[i][1]) !== courseId && user.role !== "admin") {
        throw new Error("Нельзя переносить материал между дисциплинами.");
      }
      targetRow = i + 1;
      break;
    }
  }

  const payload = Object.assign({}, data);
  ["token", "action", "id", "mdkId", "courseId", "topicId", "type", "title"].forEach(function (key) {
    delete payload[key];
  });

  const row = [
    id, courseId, String(data.topicId || ""), type, String(data.title || ""),
    JSON.stringify(payload), user.email, new Date().toISOString()
  ];

  if (targetRow) sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);

  return { success: true, id: id };
}

function deleteCustomContent_(data) {
  auth_(data);
  const sheet = content_();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(data.id || "")) {
      editor_(data, String(values[i][1] || ""));
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: "Материал не найден." };
}

/* ---------- Administrator: roles and course permissions ---------- */

function setTeacherCourses_(data) {
  admin_(data);
  const teacher = userByEmail_(data.email);
  if (!teacher) throw new Error("Пользователь не найден: " + email_(data.email));
  if (teacher.role !== "teacher") throw new Error("Дисциплины можно назначать только пользователю с ролью teacher.");

  const requested = Array.isArray(data.courses) ? data.courses : [];
  const courses = [];
  requested.forEach(function (id) {
    id = String(id);
    if (CFG.COURSES.indexOf(id) !== -1 && courses.indexOf(id) === -1) courses.push(id);
  });

  writeUserFields_(teacher, { Courses: courses.join(","), UpdatedAt: new Date().toISOString() });
  return { success: true, courses: courses };
}

function setUserRole_(data) {
  admin_(data);
  const target = userByEmail_(data.email);
  if (!target) throw new Error("Пользователь не найден: " + email_(data.email));

  const role = String(data.role || "").toLowerCase();
  if (["student", "teacher", "admin"].indexOf(role) === -1) {
    throw new Error("Роль должна быть student, teacher или admin.");
  }

  if (target.role === "admin" && role !== "admin") {
    const all = users_().getDataRange().getValues();
    const map = headerMap_(users_());
    const admins = all.slice(1).filter(function (row) {
      return String(row[map.Role]).toLowerCase() === "admin";
    });
    if (admins.length <= 1) throw new Error("Нельзя снять права с последнего администратора.");
  }

  writeUserFields_(target, {
    Role: role,
    Courses: role === "admin" ? "*" : (role === "student" ? "" : target.courses),
    UpdatedAt: new Date().toISOString()
  });
  return { success: true, role: role };
}

/**
 * Ручное назначение администратора из редактора Apps Script.
 * Не является HTTP-действием и не может быть вызван обычным пользователем сайта.
 */
function promoteUserToAdmin(email) {
  const normalizedEmail = email_(email);
  if (!normalizedEmail || normalizedEmail.indexOf("@") < 1) {
    throw new Error("Укажите корректный email зарегистрированной учётной записи.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const user = userByEmail_(normalizedEmail);
    if (!user) {
      throw new Error("Учётная запись не найдена. Сначала зарегистрируйтесь на сайте под этим email.");
    }
    writeUserFields_(user, {
      Role: "admin",
      Courses: "*",
      UpdatedAt: new Date().toISOString()
    });
    Logger.log("Пользователь " + normalizedEmail + " назначен администратором.");
    return "Права администратора назначены: " + normalizedEmail;
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Schedule ---------- */

function getSchedule_(data) {
  auth_(data);
  const sheet = schedule_();
  const output = [];
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().forEach(function (row) {
      try {
        const item = JSON.parse(row[0]);
        if (item) output.push(item);
      } catch (error) {
        // Пропускаем повреждённую строку, не ломая выдачу всего расписания.
      }
    });
  }
  return { success: true, schedule: output };
}

function saveSchedule_(data) {
  admin_(data);
  let schedule;
  try {
    schedule = typeof data.schedule === "string" ? JSON.parse(data.schedule || "[]") : (data.schedule || []);
  } catch (error) {
    throw new Error("Расписание передано в некорректном JSON.");
  }
  if (!Array.isArray(schedule)) throw new Error("Расписание должно быть массивом.");

  const sheet = schedule_();
  sheet.clearContents();
  sheet.getRange(1, 1).setValue("Schedule");
  if (schedule.length) {
    const rows = schedule.map(function (item) { return [JSON.stringify(item)]; });
    sheet.getRange(2, 1, rows.length, 1).setValues(rows);
  }
  return { success: true, count: schedule.length };
}
