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
  INVITES: "Invites",
  PASSWORD_REQUESTS: "PasswordRequests",
  SETTINGS: "PortalSettings",
  GAME_ROOMS: "GameRooms",
  GAME_ACTIONS: "GameActions",
  SESSION_PREFIX: "portal_session:",
  SESSION_TTL: 604800, // 7 дней; серверное хранилище сессий не зависит от вытесняемого CacheService
  LEGACY_SALT: "portal_spo_2026",
  COURSES: ["07.01", "04.01", "02.01", "02.02", "MCAM", "MAT", "MET", "OT", "PFI", "EN", "ENB", "ENT"]
};

const HEADERS = {
  Users: ["Email", "PasswordHash", "Name", "Group", "Role", "UpdatedAt", "Courses", "Payload", "PasswordSalt", "LoginChangedAt", "PasswordChangedAt"],
  Results: ["Email", "Name", "Group", "TestId", "TestTitle", "Grade", "Score", "MaxScore", "Percent", "TimeSpent", "Attempts", "FinishedAt", "CourseId", "Submission", "PenaltyPoints", "ViolationCount"],
  CourseContent: ["Id", "CourseId", "TopicId", "Type", "Title", "Payload", "UpdatedBy", "UpdatedAt"],
  Schedule: ["Schedule"],
  Invites: ["Code", "Courses", "CreatedBy", "CreatedAt", "ExpiresAt", "MaxUses", "Uses", "Active"],
  PasswordRequests: ["Id", "Email", "RequestedAt", "Status", "Note", "ResolvedAt", "ResolvedBy"],
  PortalSettings: ["Key", "Value", "UpdatedAt", "UpdatedBy"],
  GameRooms: ["Code", "HostEmail", "State", "CreatedAt", "ExpiresAt", "Status"],
  GameActions: ["Id", "RoomCode", "Email", "Type", "Payload", "CreatedAt"],
  Assignments: ["Id", "CourseId", "Title", "Topic", "Level", "WorkType", "DueAt", "TargetType", "TargetValue", "Instructions", "Criteria", "CreatedBy", "CreatedAt", "Status"],
  AssignmentSubmissions: ["Id", "AssignmentId", "StudentEmail", "StudentName", "Group", "Answer", "SubmittedAt", "Status", "Grade", "Feedback", "ReviewedBy", "ReviewedAt"],
  AssignmentSubmissionHistory: ["Id", "AssignmentId", "SubmissionId", "StudentEmail", "StudentName", "Group", "Answer", "SubmittedAt", "AttemptNo"],
  Notifications: ["Id", "RecipientEmail", "Type", "Title", "Message", "CourseId", "RelatedId", "CreatedAt", "ReadAt"],
  ProctorEvents: ["Id", "StudentEmail", "StudentName", "Group", "CourseId", "TestId", "AttemptNo", "EventType", "Page", "ClientTime", "ServerTime", "Details", "ViolationNo", "Action", "PenaltyPoints"],
  AttemptAudit: ["Id", "EventType", "ActorEmail", "StudentEmail", "StudentName", "Group", "CourseId", "TestId", "TestTitle", "ExtraAttempts", "AttemptNo", "Grade", "Score", "MaxScore", "Percent", "CreatedAt"],
  QuestionBank: ["CourseId", "BankId", "QuestionId", "QuestionJSON", "UpdatedAt", "UpdatedBy"],
  QuestionBankBackup: ["BackupId", "CourseId", "BankId", "RowJSON", "BackedUpAt", "BackedUpBy"],
  EnglishVPRBank: ["Track", "ExamJSON", "Active", "UpdatedAt", "UpdatedBy"],
  EnglishSemesterBank: ["Track", "TestsJSON", "Active", "UpdatedAt", "UpdatedBy"],
  ActivityLog: ["Id", "Email", "Name", "Group", "Role", "CourseId", "Route", "PageTitle", "CreatedAt", "ClientAt", "EventType", "Details"]
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
      case "changecredentials": result = changeCredentials_(data); break;
      case "requestpasswordreset": result = requestPasswordReset_(data); break;
      case "getpasswordrequests": result = getPasswordRequests_(data); break;
      case "resolvepasswordreset": result = resolvePasswordReset_(data); break;
      case "getportalsettings": result = getPortalSettings_(data); break;
      case "setgamesaccess": result = setGamesAccess_(data); break;
      case "register": result = register_(data); break;
      case "savestudent": result = saveStudent_(data); break;
      case "getstudents": result = getStudents_(data); break;
      case "saveresult": result = saveResult_(data); break;
      case "saveteacherresult": result = saveTeacherResult_(data); break;
      case "getresults": result = getResults_(data); break;
      case "getpublicsubjectratings": result = getPublicSubjectRatings_(data); break;
      case "getmycourseresults": result = getMyCourseResults_(data); break;
      case "savegcodeprogress": result = saveGCodeProgress_(data); break;
      case "getcustomcontent": result = getCustomContent_(data); break;
      case "getcustomcontentaccess": result = getCustomContentAccess_(data); break;
      case "setcustomcontentaccess": result = setCustomContentAccess_(data); break;
      case "gettopicaccess": result = getTopicAccess_(data); break;
      case "settopicaccess": result = setTopicAccess_(data); break;
      case "granttestattempts": result = grantTestAttempts_(data); break;
      case "requesttestattempts": result = requestTestAttempts_(data); break;
      case "gettestattemptstatus": result = getTestAttemptStatus_(data); break;
      case "logproctorevent": result = logProctorEvent_(data); break;
      case "getproctorevents": result = getProctorEvents_(data); break;
      case "getattemptaudit": result = getAttemptAudit_(data); break;
      case "logactivity": result = logActivity_(data); break;
      case "getactivitylog": result = getActivityLog_(data); break;
      case "gettutoringlink": result = getTutoringLink_(data); break;
      case "savetutoringlink": result = saveTutoringLink_(data); break;
      case "submitcustomtest": result = submitCustomTest_(data); break;
      case "backupquestionbanks": result = backupQuestionBanks_(data); break;
      case "restorequestionbanks": result = restoreQuestionBanks_(data); break;
      case "importquestionbanks": result = importQuestionBanks_(data); break;
      case "getquestionbank": result = getQuestionBank_(data); break;
      case "getquestionbankstats": result = getQuestionBankStats_(data); break;
      case "importenglishvprbank": result = importEnglishVprBank_(data); break;
      case "getenglishvprexam": result = getEnglishVprExam_(data); break;
      case "importenglishsemestertests": result = importEnglishSemesterTests_(data); break;
      case "getenglishsemestertests": result = getEnglishSemesterTests_(data); break;
      case "submitenglishsemestertest": result = submitEnglishSemesterTest_(data); break;
      case "submitenglishvprexam": result = submitEnglishVprExam_(data); break;
      case "getbuilttest":
      case "getbuiltintest": result = getBuiltInTest_(data); break;
      case "submitbuilttest":
      case "submitbuiltintest": result = submitBuiltInTest_(data); break;
      case "getfinalexam": result = getFinalExam_(data); break;
      case "submitfinalexam": result = submitFinalExam_(data); break;
      case "getgameanswer": result = getGameAnswer_(data); break;
      case "savecustomcontent": result = saveCustomContent_(data); break;
      case "deletecustomcontent": result = deleteCustomContent_(data); break;
      case "setteachercourses": result = setTeacherCourses_(data); break;
      case "setuserrole": result = setUserRole_(data); break;
      case "admincreateuser": result = adminCreateUser_(data); break;
      case "admindeleteuser": result = adminDeleteUser_(data); break;
      case "setstudentcourses": result = setStudentCourses_(data); break;
      case "createinvite": result = createInvite_(data); break;
      case "getinvites": result = getInvites_(data); break;
      case "deactivateinvite": result = deactivateInvite_(data); break;
      case "getschedule": result = getSchedule_(data); break;
      case "saveschedule": result = saveSchedule_(data); break;
      case "creategameroom": result = createGameRoom_(data); break;
      case "joingameroom": result = joinGameRoom_(data); break;
      case "getgameroom": result = getGameRoom_(data); break;
      case "updategameroom": result = updateGameRoom_(data); break;
      case "sendgameaction": result = sendGameAction_(data); break;
      case "getgameactions": result = getGameActions_(data); break;
      case "createassignment": result = createAssignment_(data); break;
      case "getassignments": result = getAssignments_(data); break;
      case "submitassignment": result = submitAssignment_(data); break;
      case "gradeassignment": result = gradeAssignment_(data); break;
      case "gradewrittenresult": result = gradeWrittenResult_(data); break;
      case "getnotifications": result = getNotifications_(data); break;
      case "marknotificationread": result = markNotificationRead_(data); break;
      case "markallnotificationsread": result = markAllNotificationsRead_(data); break;
      case "leavegameroom": result = leaveGameRoom_(data); break;
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
function invites_() { return ensureSheet_(CFG.INVITES); }
function passwordRequests_() { return ensureSheet_(CFG.PASSWORD_REQUESTS); }
function settings_() { return ensureSheet_(CFG.SETTINGS); }
function assignments_() { return ensureSheet_("Assignments"); }
function assignmentSubmissions_() { return ensureSheet_("AssignmentSubmissions"); }
function assignmentSubmissionHistory_() { return ensureSheet_("AssignmentSubmissionHistory"); }
function notifications_() { return ensureSheet_("Notifications"); }
function proctorEvents_() { return ensureSheet_("ProctorEvents"); }
function attemptAudit_() { return ensureSheet_("AttemptAudit"); }
function activityLog_() { return ensureSheet_("ActivityLog"); }
function appendAttemptAudit_(record) { const sh=attemptAudit_();sh.appendRow([Utilities.getUuid(),record.EventType||"",record.ActorEmail||"",record.StudentEmail||"",record.StudentName||"",record.Group||"",record.CourseId||"",record.TestId||"",record.TestTitle||"",record.ExtraAttempts===undefined?"":record.ExtraAttempts,record.AttemptNo===undefined?"":record.AttemptNo,record.Grade===undefined?"":record.Grade,record.Score===undefined?"":record.Score,record.MaxScore===undefined?"":record.MaxScore,record.Percent===undefined?"":record.Percent,new Date().toISOString()]); }

function proctorPenalty_(studentEmail,courseId,testId,attemptNo) {
  const sh=proctorEvents_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  let penalty=0,count=0;
  vals.slice(1).forEach(function(row){
    if(email_(row[m.StudentEmail])===email_(studentEmail)&&String(row[m.CourseId]||"")===String(courseId)&&String(row[m.TestId]||"")===String(testId)&&(!attemptNo||Number(row[m.AttemptNo]||1)===Number(attemptNo))){
      count=Math.max(count,Number(row[m.ViolationNo])||0);
      penalty=Math.max(penalty,Number(row[m.PenaltyPoints])||0);
    }
  });
  return {penaltyPoints:Math.min(30,penalty),violationCount:count};
}
function gradeFromPercent_(percent) { return percent>=90?5:percent>=75?4:percent>=60?3:2; }
function notifyProctorSanction_(student,courseId,testId,attemptNo,violationNo,penaltyPoints,eventType) {
  let sent=0;const sh=users_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh),message="Студент: "+student.name+" ("+student.email+"), группа "+student.group+". Тест: "+testId+", попытка №"+attemptNo+". Зафиксировано нарушений: "+violationNo+". Штраф: -"+penaltyPoints+" процентных пунктов. Последнее событие: "+eventType+". Время отчёта: "+new Date().toISOString()+".";
  vals.slice(1).forEach(function(row){
    const role=String(row[m.Role]||"").toLowerCase(),mail=email_(row[m.Email]);
    if(!mail)return;
    const assigned={email:mail,role:role,courses:String(row[m.Courses]||"")};
    if(role==="admin"||(role==="teacher"&&hasCourseAccess_(assigned,courseId))){
      appendMappedRecord_(notifications_(),{Id:Utilities.getUuid(),RecipientEmail:mail,Type:"warning",Title:"Нарушение правил тестирования",Message:message,CourseId:courseId,RelatedId:testId,CreatedAt:new Date().toISOString()});sent++;
    }
  });
  return sent;
}


/**
 * Запустите вручную один раз после добавления SPREADSHEET_ID.
 * Функция создаёт недостающие листы и заголовки, но не удаляет данные.
 */
function setupPortal() {
  [CFG.USERS, CFG.RESULTS, CFG.CONTENT, CFG.SCHEDULE, CFG.INVITES, CFG.PASSWORD_REQUESTS, CFG.SETTINGS, CFG.GAME_ROOMS, CFG.GAME_ACTIONS, "Assignments", "AssignmentSubmissions", "AssignmentSubmissionHistory", "Notifications", "ProctorEvents", "AttemptAudit", "QuestionBank", "EnglishVPRBank", "ActivityLog"].forEach(ensureSheet_);
  const ss = getSpreadsheet_();
  Logger.log("Портал настроен. Таблица: " + ss.getName());
  return "Готово. Созданы/проверены листы Users, Results, CourseContent, Schedule, Invites, PasswordRequests, PortalSettings, Assignments, AssignmentSubmissions, AssignmentSubmissionHistory, Notifications, ProctorEvents, AttemptAudit, QuestionBank, ActivityLog.";
}

/* ---------- Common helpers and authentication ---------- */

function email_(value) {
  return String(value || "").trim().toLowerCase();
}

// Сопоставляет текстовый код курса с числовым значением из Google Sheets,
// не меняя остальные текстовые идентификаторы.
var COURSE_ID_TIME_ZONE_CACHE_ = "";

function sameCourseId_(a, b) {
  const right = String(b === null || b === undefined ? "" : b).trim();

  // Google Sheets may silently convert a course code such as 07.01
  // into a Date object (7 January). Compare it in the spreadsheet timezone.
  if (a instanceof Date && !isNaN(a.getTime()) && /^\d{1,2}\.\d{1,2}$/.test(right)) {
    if (!COURSE_ID_TIME_ZONE_CACHE_) {
      COURSE_ID_TIME_ZONE_CACHE_ = getSpreadsheet_().getSpreadsheetTimeZone();
    }
    if (Utilities.formatDate(a, COURSE_ID_TIME_ZONE_CACHE_, "dd.MM") === right) return true;
  }

  const left = String(a === null || a === undefined ? "" : a).trim();
  if (left === right) return true;
  if (typeof a === "number" && right !== "" && isFinite(Number(right))) return a === Number(right);
  if (typeof b === "number" && left !== "" && isFinite(Number(left))) return Number(left) === b;
  return false;
}

function normalizeCourseId_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    if (!COURSE_ID_TIME_ZONE_CACHE_) {
      COURSE_ID_TIME_ZONE_CACHE_ = getSpreadsheet_().getSpreadsheetTimeZone();
    }
    return Utilities.formatDate(value, COURSE_ID_TIME_ZONE_CACHE_, "dd.MM");
  }
  return String(value === null || value === undefined ? "" : value).trim();
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

function appendMappedRecord_(sheet, record) {
  const map = headerMap_(sheet), width = sheet.getLastColumn();
  const row = new Array(width).fill("");
  Object.keys(record || {}).forEach(function (key) {
    if (map[key] !== undefined) row[map[key]] = record[key];
  });
  sheet.appendRow(row);
}

function updateMappedRecord_(sheet, rowNumber, record) {
  const map = headerMap_(sheet), width = sheet.getLastColumn();
  const row = sheet.getRange(rowNumber, 1, 1, width).getValues()[0];
  Object.keys(record || {}).forEach(function (key) {
    if (map[key] !== undefined) row[map[key]] = record[key];
  });
  sheet.getRange(rowNumber, 1, 1, width).setValues([row]);
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
        loginChangedAt: index.LoginChangedAt !== undefined ? String(values[row][index.LoginChangedAt] || "") : "",
        passwordChangedAt: index.PasswordChangedAt !== undefined ? String(values[row][index.PasswordChangedAt] || "") : "",
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
  const key = CFG.SESSION_PREFIX + token;
  const expiresAt = Date.now() + CFG.SESSION_TTL * 1000;
  // ScriptProperties сохраняет сессию надёжнее CacheService: кэш Google может
  // вытеснять записи раньше установленного TTL, из-за чего пользователей выбрасывало.
  PropertiesService.getScriptProperties().setProperty(key, JSON.stringify({
    email: email_(user.email),
    expiresAt: expiresAt
  }));
  // Удаляем просроченные сессии при новом входе, чтобы свойства не накапливались бесконечно.
  const props = PropertiesService.getScriptProperties().getProperties();
  Object.keys(props).forEach(function (propertyKey) {
    if (propertyKey.indexOf(CFG.SESSION_PREFIX) !== 0 || propertyKey === key) return;
    try {
      const saved = JSON.parse(props[propertyKey]);
      if (!saved.expiresAt || Number(saved.expiresAt) <= Date.now()) {
        PropertiesService.getScriptProperties().deleteProperty(propertyKey);
      }
    } catch (e) {
      // Старые/повреждённые значения удаляем только если это не активный ключ.
      PropertiesService.getScriptProperties().deleteProperty(propertyKey);
    }
  });
  return token;
}

function auth_(data) {
  const token = String(data.token || "");
  if (!token) throw new Error("Требуется авторизация. Войдите в портал заново.");

  const key = CFG.SESSION_PREFIX + token;
  const properties = PropertiesService.getScriptProperties();
  const raw = properties.getProperty(key);
  let email = "";
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      if (saved && saved.email && Number(saved.expiresAt) > Date.now()) {
        email = email_(saved.email);
      } else {
        properties.deleteProperty(key);
      }
    } catch (e) {
      // Поддерживаем сессии, созданные старой версией скрипта, до их истечения.
      email = email_(raw);
    }
  }
  // Совместимость с токенами, выданными до обновления Code.gs.
  if (!email) email = email_(CacheService.getScriptCache().get(key) || "");
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
  if (user.role !== "teacher" && user.role !== "student") return false;
  const assigned = user.courses.split(",").map(function (id) { return id.trim(); });
  if ((courseId === "ENB" || courseId === "ENT") && assigned.indexOf("EN") !== -1) return true;
  return assigned.indexOf(String(courseId)) !== -1;
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
  const inviteCode = String(data.invite || data.inviteCode || "").trim();
  if (!email || email.indexOf("@") < 1) return { success: false, error: "Укажите корректный email." };
  if (password.length < 8) return { success: false, error: "Пароль должен содержать не менее 8 символов." };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (userByEmail_(email)) return { success: false, error: "Пользователь с таким email уже зарегистрирован." };
    const invite = inviteCode ? findInvite_(inviteCode) : null;
    if (inviteCode && (!invite || !invite.active || invite.uses >= invite.maxUses || new Date(invite.expiresAt).getTime() < Date.now())) return { success:false, error:"Приглашение недействительно, истекло или уже использовано." };
    if (!inviteCode) {
      const all=users_().getDataRange().getValues(), um=headerMap_(users_());
      const adminExists=all.slice(1).some(function(row){return String(row[um.Role]||"").toLowerCase()==="admin";});
      if(adminExists)return {success:false,error:"Для регистрации необходима ссылка или код приглашения преподавателя."};
    }
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
      Courses: invite ? invite.courses.join(",") : "",
      Payload: "",
      PasswordSalt: salt
    };
    Object.keys(values).forEach(function (key) {
      if (map[key] !== undefined) row[map[key]] = values[key];
    });
    sheet.appendRow(row);
    if(invite) invites_().getRange(invite.row, 7).setValue(invite.uses + 1);
    return { success: true, courses: invite ? invite.courses : [] };
  } finally { lock.releaseLock(); }
}

function findInvite_(code) {
  const sh=invites_(), vals=sh.getDataRange().getValues(), m=headerMap_(sh);
  for(let i=1;i<vals.length;i++) if(String(vals[i][m.Code]||"")===String(code)) return {row:i+1,courses:String(vals[i][m.Courses]||"").split(",").filter(Boolean),expiresAt:vals[i][m.ExpiresAt],maxUses:Number(vals[i][m.MaxUses])||1,uses:Number(vals[i][m.Uses])||0,active:String(vals[i][m.Active]).toLowerCase()!=="false"};
  return null;
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
  // Возвращаем только безопасные поля оформления из собственного payload пользователя.
  let savedPayload = {};
  try { savedPayload = JSON.parse(user.payload || "{}"); } catch (e) {}
  const profile = {
    gcodeProgress: savedPayload.gcodeProgress && typeof savedPayload.gcodeProgress === "object" ? savedPayload.gcodeProgress : null,
    xp: Number(savedPayload.xp) || 0,
    activeCourseId: String(savedPayload.activeCourseId || ""),
    results: savedPayload.results && typeof savedPayload.results === "object" ? savedPayload.results : {},
    unlockedAchievements: Array.isArray(savedPayload.unlockedAchievements) ? savedPayload.unlockedAchievements : [],
    avatar: savedPayload.avatar || null,
    avatarEmoji: savedPayload.avatarEmoji || null,
    avatarEffect: savedPayload.avatarEffect || null,
    nickname: savedPayload.nickname || null,
    purchasedThemes: Array.isArray(savedPayload.purchasedThemes) ? savedPayload.purchasedThemes : [],
    purchasedTextEffects: Array.isArray(savedPayload.purchasedTextEffects) ? savedPayload.purchasedTextEffects : [],
    activeTextEffect: savedPayload.activeTextEffect || "none",
    purchasedBgEffects: Array.isArray(savedPayload.purchasedBgEffects) ? savedPayload.purchasedBgEffects : [],
    activeBgEffect: savedPayload.activeBgEffect || "none",
    purchasedCardEffects: Array.isArray(savedPayload.purchasedCardEffects) ? savedPayload.purchasedCardEffects : [],
    activeCardEffect: savedPayload.activeCardEffect || "none"
  };
  return {
    success: true,
    email: user.email,
    name: user.name,
    group: user.group,
    role: user.role,
    courses: user.courses ? user.courses.split(",").filter(Boolean) : [],
    profile: profile,
    token: createSession_(user)
  };
}

/* ---------- Student profile and test results ---------- */

function protectedQuestionBankMap_() {
  const cache=CacheService.getScriptCache(),cacheKey="protectedQuestionBankMap:v1",cached=cache.get(cacheKey);
  if(cached){try{return JSON.parse(cached);}catch(e){}}
  const sh=questionBank_(),values=sh.getDataRange().getValues(),m=headerMap_(sh),map={};
  values.slice(1).forEach(function(row){
    const courseId=String(row[m.CourseId]||""),bankId=String(row[m.BankId]||"");
    if(!courseId||!bankId)return;
    if(!map[courseId])map[courseId]={};
    map[courseId][bankId]=true;
  });
  try{cache.put(cacheKey,JSON.stringify(map),600);}catch(e){}
  return map;
}
function isProtectedAssessment_(testId,courseId,bankMap) {
  const id=String(testId||""),map=bankMap||{};
  if(id.indexOf("__final__")===0||id.indexOf("custom_")===0)return true;
  function protectedFor(cid) {
    const banks=map[cid]||{};
    if(id.indexOf("test_")===0){
      const topic=id.slice(5);
      return !!(banks["topic_"+topic]||banks["hard_"+topic]);
    }
    const self=id.match(/^self_(.+)_\d+$/);
    if(self)return !!(banks[id]||banks["topic_"+self[1]]);
    return false;
  }
  if(courseId)return protectedFor(String(courseId));
  return Object.keys(map).some(protectedFor);
}
function saveStudent_(data) {
  const current = auth_(data);
  const targetEmail = email_(data.email || current.email);
  if (targetEmail !== current.email) {
    const targetCheck = userByEmail_(targetEmail);
    if (current.role !== "admin" && !(current.role === "teacher" && targetCheck && targetCheck.role === "student" && targetCheck.courses.split(",").some(function(id){ return hasCourseAccess_(current,id); }))) throw new Error("Нельзя изменять данные этого пользователя.");
  }

  const target = userByEmail_(targetEmail);
  if (!target) throw new Error("Пользователь не найден.");

  const fields = { UpdatedAt: new Date().toISOString() };
  if (data.name !== undefined) fields.Name = String(data.name);
  if (data.group !== undefined) fields.Group = String(data.group);
  if (data.payload !== undefined) {
    const incoming = typeof data.payload === "string" ? (function(){try{return JSON.parse(data.payload||"{}");}catch(e){return {};}})() : (data.payload || {});
    if (current.role === "teacher") {
      let existing = {};
      try { existing = JSON.parse(target.payload || "{}"); } catch (e) { existing = {}; }
      existing.manualGrades = incoming.manualGrades || existing.manualGrades || {};
      fields.Payload = JSON.stringify(existing);
    } else if (current.role === "student") {
      const payload = incoming && typeof incoming === "object" ? incoming : {};
      // Оценки из журнала — серверные данные преподавателя. Синхронизация
      // локального состояния студента не должна их затирать или подменять.
      let existingPayload={};
      try { existingPayload=JSON.parse(target.payload||"{}"); } catch(e) {}
      if(existingPayload.manualGrades && typeof existingPayload.manualGrades==="object") payload.manualGrades=existingPayload.manualGrades;
      else delete payload.manualGrades;
      if (payload.results && typeof payload.results === "object" && !Array.isArray(payload.results)) {
        const bankMap=protectedQuestionBankMap_();
        Object.keys(payload.results).forEach(function(testId){
          if(isProtectedAssessment_(testId,String(payload.results[testId]&&payload.results[testId].courseId||""),bankMap))delete payload.results[testId];
        });
      }
      fields.Payload = JSON.stringify(payload);
    } else {
      fields.Payload = typeof data.payload === "string" ? data.payload : JSON.stringify(data.payload || {});
    }
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
      courses: String(row[map.Courses] || "").split(",").map(function(id){ return id.trim(); }).filter(function(id){ return user.role === "admin" || hasCourseAccess_(user,id) || (id === "EN" && (hasCourseAccess_(user,"ENB") || hasCourseAccess_(user,"ENT"))); }),
      payload: (function(){ let p={}; try{p=JSON.parse(row[map.Payload]||"{}");}catch(e){} if(user.role==="admin") return String(row[map.Payload]||""); return JSON.stringify({manualGrades:p.manualGrades||{},xp:Number(p.xp)||0,avatar:p.avatar||null,avatarEmoji:p.avatarEmoji||null,avatarEffect:p.avatarEffect||null}); })()
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

  const courseId = String(data.courseId || "");
  if (user.role === "student" && (!courseId || !hasCourseAccess_(user,courseId))) throw new Error("У вас нет доступа к этой дисциплине.");
  const testId = String(data.testId || "test");
  if (user.role === "student" && testId.indexOf("custom_") === 0) throw new Error("Результаты дополнительных тестов принимаются только через серверную проверку.");
  const assessment=user.role==="student"&&(/^test_/.test(testId)||/^__final__/.test(testId)||/^self_.+_\d+$/.test(testId)||/^english_/.test(testId));
  if(user.role==="student"&&/^__final__/.test(testId))throw new Error("Итоговый экзамен должен отправляться через защищённую серверную проверку.");
  if(user.role==="student"&&(testId.indexOf("test_")===0||/^self_.+_\d+$/.test(testId))){
    const topicId=testId.indexOf("test_")===0?testId.slice(5):testId.replace(/^self_(.+)_\d+$/,"$1");
    const ids=testId.indexOf("test_")===0?["topic_"+topicId,"hard_"+topicId]:[testId,"topic_"+topicId];
    const resolved=resolvedBuiltInBankIds_(courseId,ids);
    if(builtInQuestions_(courseId,resolved).length)throw new Error("Встроенные тесты должны отправляться через защищённую серверную проверку.");
  }
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const sheet=results_(),values=sheet.getDataRange().getValues();
    const prior=values.slice(1).filter(function(row){return email_(row[0])===email&&String(row[3])===testId&&sameCourseId_(row[12]||courseId,courseId);}).length;
    if(assessment){
      const raw=settingValue_("testAttempts:"+email+":"+courseId+":"+testId);
      const limit=raw===""?1:1+Math.max(0,Number(raw)||0);
      if(prior>=limit)throw new Error("Работа уже завершена ("+prior+" из "+limit+"). Повторное прохождение закрыто. Если нужна дополнительная попытка, обратитесь к преподавателю.");
    }
    const attempts=prior+1;
    const rawGrade=data.grade===undefined||data.grade===null||data.grade===""?0:Math.max(0,Math.min(5,Number(data.grade)||0));
    const rawScore=Number(data.score)||0,maxScore=Number(data.maxScore)||0,rawPercent=Math.max(0,Math.min(100,Number(data.percent)||0)),title=String(data.testTitle||testId);
    const policy=assessment?proctorPenalty_(email,courseId,testId,attempts):{penaltyPoints:0,violationCount:0};
    const percent=Math.max(0,rawPercent-policy.penaltyPoints),grade=assessment?gradeFromPercent_(percent):rawGrade,score=maxScore?Math.round(maxScore*percent)/100:Math.max(0,rawScore);
    appendMappedRecord_(sheet,{Email:email,Name:String(data.name||user.name),Group:String(data.group||user.group),TestId:testId,TestTitle:title,Grade:grade,Score:score,MaxScore:maxScore,Percent:percent,TimeSpent:Math.max(0,Number(data.timeSpent)||0),Attempts:attempts,FinishedAt:new Date().toISOString(),CourseId:courseId,Submission:String(data.payload||"").slice(0,10000),PenaltyPoints:policy.penaltyPoints,ViolationCount:policy.violationCount});
    appendAttemptAudit_({EventType:"attempt_submitted",ActorEmail:user.email,StudentEmail:email,StudentName:user.name,Group:user.group,CourseId:courseId,TestId:testId,TestTitle:title,AttemptNo:attempts,Grade:grade,Score:score,MaxScore:maxScore,Percent:percent});
    if(user.role==="student" && /^(prac_|self_)/.test(testId) && String(data.payload||"").trim()) {
      notifyCourseStaff_(courseId,"written_submission","Новая письменная работа на проверку",
        user.name+" ("+user.group+") отправил(а) письменную работу: "+title+". Откройте журнал результатов по дисциплине для проверки.",testId);
    }
    return {success:true,attempts:attempts,grade:grade,percent:percent,penaltyPoints:policy.penaltyPoints,violationCount:policy.violationCount};
  } finally {lock.releaseLock();}
}




/**
 * Преподавательская запись оценки за лабораторную работу.
 * Разрешена только для MET и только студенту, которому назначен этот курс.
 */
function saveTeacherResult_(data) {
  const teacher=auth_(data);
  if(teacher.role!=="teacher"&&teacher.role!=="admin") throw new Error("Выставлять оценки может только преподаватель.");
  const courseId=String(data.courseId||"").trim();
  if(courseId!=="MET") throw new Error("Этот метод предназначен для журнала метрологии.");
  editor_(data,courseId);
  const studentEmail=email_(data.email),student=userByEmail_(studentEmail);
  if(!student||student.role!=="student"||!hasCourseAccess_(student,courseId)) throw new Error("Студент не обучается по дисциплине «Метрология».");
  const grade=Number(data.grade),date=String(data.date||"").trim(),testId=String(data.testId||"").trim();
  const title=String(data.testTitle||"Лабораторная работа").trim().slice(0,180);
  const feedback=String(data.feedback||"").trim().slice(0,3000);
  if(!isFinite(grade)||grade<2||grade>5) throw new Error("Оценка должна быть от 2 до 5.");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Укажите корректную дату работы.");
  const dateParts=date.split("-").map(Number),checkDate=new Date(Date.UTC(dateParts[0],dateParts[1]-1,dateParts[2]));
  if(checkDate.getUTCFullYear()!==dateParts[0]||checkDate.getUTCMonth()!==dateParts[1]-1||checkDate.getUTCDate()!==dateParts[2]) throw new Error("Указана некорректная дата работы.");
  if(!/^metrology_[A-Za-z0-9_-]{1,120}$/.test(testId)) throw new Error("Некорректный идентификатор лабораторной работы.");
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const now=new Date().toISOString(),submission="Лабораторная работа: "+title+"; дата: "+date+(feedback?"\nКомментарий преподавателя: "+feedback:"");
    const sheet=results_(),values=sheet.getDataRange().getValues();
    let existingRow=-1;
    for(let i=values.length-1;i>=1;i--){
      if(email_(values[i][0])===student.email&&String(values[i][3]||"")===testId&&sameCourseId_(values[i][12]||courseId,courseId)){existingRow=i+1;break;}
    }
    const record={Email:student.email,Name:student.name,Group:student.group,TestId:testId,TestTitle:title+" ("+date+")",Grade:grade,Score:grade,MaxScore:5,Percent:grade*20,Attempts:1,FinishedAt:now,CourseId:courseId,Submission:submission};
    if(existingRow>0)updateMappedRecord_(sheet,existingRow,record);else appendMappedRecord_(sheet,record);
    appendAttemptAudit_({EventType:"teacher_grade_entered",ActorEmail:teacher.email,StudentEmail:student.email,StudentName:student.name,Group:student.group,CourseId:courseId,TestId:testId,TestTitle:title,Grade:grade,Score:grade,MaxScore:5,Percent:grade*20});
  } finally {lock.releaseLock();}
  createNotification_(student.email,"grade","Оценка за лабораторную работу","Преподаватель выставил оценку "+grade+"/5 за работу «"+title+"»."+(feedback?" Добавлен комментарий.":""),courseId,testId);
  return {success:true,grade:grade};
}


function gradeWrittenResult_(data) {
  const teacher=auth_(data);
  if(teacher.role!=="teacher"&&teacher.role!=="admin") throw new Error("Проверять письменные работы может только преподаватель.");
  const studentEmail=email_(data.email),courseId=String(data.courseId||""),testId=String(data.testId||"");
  const grade=Number(data.grade),feedback=String(data.feedback||"").slice(0,4000);
  if(!studentEmail||!courseId||!testId||!/^(prac_|self_)/.test(testId)) throw new Error("Не выбрана письменная работа.");
  if(!isFinite(grade)||grade<2||grade>5) throw new Error("Оценка должна быть от 2 до 5.");
  const student=userByEmail_(studentEmail);
  if(!student||student.role!=="student"||!hasCourseAccess_(student,courseId)) throw new Error("Студент не обучается по этой дисциплине.");
  editor_(data,courseId);
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const sh=results_(),rows=sh.getDataRange().getValues();
    let rowIndex=-1;
    for(let i=rows.length-1;i>=1;i--) {
      if(email_(rows[i][0])===studentEmail&&String(rows[i][3]||"")===testId&&sameCourseId_(rows[i][12]||courseId,courseId)){rowIndex=i+1;break;}
    }
    if(rowIndex<0) throw new Error("Отправленная работа не найдена.");
    updateMappedRecord_(sh,rowIndex,{Grade:grade,Percent:grade*20,Submission:(String(rows[rowIndex-1][13]||"")+(feedback?"\n\nКомментарий преподавателя: "+feedback:"")).slice(0,10000)});
    appendAttemptAudit_({EventType:"written_graded",ActorEmail:teacher.email,StudentEmail:studentEmail,StudentName:student.name,Group:student.group,CourseId:courseId,TestId:testId,TestTitle:String(rows[rowIndex-1][4]||testId),Grade:grade,Percent:grade*20});
  } finally {lock.releaseLock();}
  createNotification_(studentEmail,"grade","Письменная работа проверена","По работе «"+testId+"» выставлена оценка: "+grade+"/5."+(feedback?" Комментарий преподавателя добавлен.":""),courseId,testId);
  return {success:true,grade:grade};
}

/* ---------- Exam integrity events and tutoring links ---------- */
function logProctorEvent_(data) {
  const user=auth_(data);
  if(user.role!=="student") throw new Error("Фиксировать события попытки может только студентская сессия.");
  const courseId=String(data.courseId||""),testId=String(data.testId||"");
  const allowed=["visibility_hidden","window_blur","fullscreen_exit","copy_attempt","paste_attempt","contextmenu_attempt","screenshot_shortcut","devtools_shortcut","external_link"];
  const eventType=String(data.eventType||"");
  if(!courseId||!testId||allowed.indexOf(eventType)===-1||!hasCourseAccess_(user,courseId)) throw new Error("Некорректное событие контроля.");
  const eventGroup=(eventType==="visibility_hidden"||eventType==="window_blur"||eventType==="fullscreen_exit")?"focus_loss":eventType;
  const cache=CacheService.getScriptCache(),key="proctor:"+user.email+":"+courseId+":"+testId+":"+eventGroup;
  const now=Date.now(),last=Number(cache.get(key)||0);
  if(now-last<1000)return {success:true,throttled:true,action:"throttled",eventGroup:eventGroup};
  const page=String(data.page||"").slice(0,180),details=String(data.details||"").slice(0,240),clientTime=String(data.clientTime||"").slice(0,40);
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const sh=proctorEvents_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
    const resultRows=results_().getDataRange().getValues();
    const attemptNo=resultRows.slice(1).filter(function(row){return email_(row[0])===user.email&&String(row[3])===testId&&sameCourseId_(row[12]||courseId,courseId);}).length+1;
    let previous=0;
    vals.slice(1).forEach(function(row){
      // Счётчик нарушений ведётся по всему тесту и не сбрасывается при новой попытке.
      if(email_(row[m.StudentEmail])===user.email&&String(row[m.CourseId]||"")===courseId&&String(row[m.TestId]||"")===testId)previous=Math.max(previous,Number(row[m.ViolationNo])||0);
    });
    const violationNo=previous+1,action=violationNo===1?"warning":"sanction";
    const penaltyPoints=Math.min(30,Math.max(0,violationNo-1)*10);
    appendMappedRecord_(sh,{Id:Utilities.getUuid(),StudentEmail:user.email,StudentName:user.name,Group:user.group,CourseId:courseId,TestId:testId,AttemptNo:attemptNo,EventType:eventType,Page:page,ClientTime:clientTime,ServerTime:new Date().toISOString(),Details:details,ViolationNo:violationNo,Action:action,PenaltyPoints:penaltyPoints});
    cache.put(key,String(now),30);
    let reportSent=false;
    if(action==="sanction"&&penaltyPoints>0){
      appendAttemptAudit_({EventType:"proctor_sanction",ActorEmail:user.email,StudentEmail:user.email,StudentName:user.name,Group:user.group,CourseId:courseId,TestId:testId,TestTitle:testId,AttemptNo:attemptNo,Percent:penaltyPoints});
      try{reportSent=notifyProctorSanction_(user,courseId,testId,attemptNo,violationNo,penaltyPoints,eventType)>0;}catch(reportError){console.error("Не удалось отправить отчёт преподавателю",reportError);}
    }
    return {success:true,violationNo:violationNo,attemptNo:attemptNo,action:action,penaltyPoints:penaltyPoints,reportSent:reportSent};
  } finally {lock.releaseLock();}
}

function logActivity_(data) {
  const user=auth_(data);
  if(user.role!=="student")return {success:true,ignored:true};
  const courseId=String(data.courseId||"");
  if(courseId&&!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к дисциплине.");
  const route=String(data.route||"/").replace(/[\r\n]/g," ").slice(0,240);
  const pageTitle=String(data.pageTitle||"").replace(/[<>\r\n]/g," ").slice(0,120);
  const allowedTypes=["page_view","click","tab_switch","session_start","session_end"];
  const requestedType=String(data.eventType||"page_view");
  const eventType=allowedTypes.indexOf(requestedType)>=0?requestedType:"page_view";
  const details=String(data.details||"").replace(/[<>\r\n\u0000-\u001f]/g," ").replace(/\s+/g," ").trim().slice(0,180);
  if(!route||route.indexOf("javascript:")===0)throw new Error("Некорректный маршрут.");
  const now=new Date().toISOString();
  appendMappedRecord_(activityLog_(),{Id:Utilities.getUuid(),Email:user.email,Name:user.name,Group:user.group,Role:user.role,CourseId:courseId,Route:route,PageTitle:pageTitle,CreatedAt:now,ClientAt:String(data.clientAt||"").slice(0,40),EventType:eventType,Details:details});
  return {success:true,createdAt:now};
}
function getActivityLog_(data) {
  const user=auth_(data);
  if(user.role!=="admin"&&user.role!=="teacher")throw new Error("Журнал активности доступен только преподавателям и администраторам.");
  const courseId=String(data.courseId||""),wanted=email_(data.email||""),group=String(data.group||"");
  if(user.role==="teacher"&&courseId&&!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к этой дисциплине.");
  const sh=activityLog_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  const rows=vals.slice(1).filter(function(row){
    const cid=String(row[m.CourseId]||"");
    return (!courseId||cid===courseId)&&(!wanted||email_(row[m.Email])===wanted)&&(!group||String(row[m.Group]||"")===group)&&(user.role==="admin"||!!cid&&hasCourseAccess_(user,cid));
  }).map(function(row){return {email:String(row[m.Email]||""),name:String(row[m.Name]||""),group:String(row[m.Group]||""),courseId:String(row[m.CourseId]||""),route:String(row[m.Route]||""),pageTitle:String(row[m.PageTitle]||""),createdAt:String(row[m.CreatedAt]||""),clientAt:String(row[m.ClientAt]||""),eventType:m.EventType===undefined?"page_view":String(row[m.EventType]||"page_view"),details:m.Details===undefined?"":String(row[m.Details]||"")};});
  rows.sort(function(x,y){return String(y.createdAt).localeCompare(String(x.createdAt));});
  const offset=Math.max(0,Math.floor(Number(data.offset)||0));
  const limit=Math.min(500,Math.max(1,Math.floor(Number(data.limit)||250)));
  const events=rows.slice(offset,offset+limit);
  return {success:true,events:events,total:rows.length,offset:offset,limit:limit,hasMore:offset+events.length<rows.length};
}

function getAttemptAudit_(data) {
  const courseId=String(data.courseId||""),teacher=editor_(data,courseId),wanted=email_(data.email||""),testId=String(data.testId||"");
  const sh=attemptAudit_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  const rows=vals.slice(1).filter(function(r){return String(r[m.CourseId]||"")===courseId&&(!wanted||email_(r[m.StudentEmail])===wanted)&&(!testId||String(r[m.TestId]||"")===testId);}).map(function(r){return {eventType:String(r[m.EventType]||""),actorEmail:String(r[m.ActorEmail]||""),email:String(r[m.StudentEmail]||""),name:String(r[m.StudentName]||""),group:String(r[m.Group]||""),courseId:String(r[m.CourseId]||""),testId:String(r[m.TestId]||""),testTitle:String(r[m.TestTitle]||""),extraAttempts:r[m.ExtraAttempts],attemptNo:r[m.AttemptNo],grade:r[m.Grade],score:r[m.Score],maxScore:r[m.MaxScore],percent:r[m.Percent],createdAt:String(r[m.CreatedAt]||"")};});
  rows.sort(function(a,b){return String(b.createdAt).localeCompare(String(a.createdAt));});
  return {success:true,events:rows.slice(0,200)};
}

function getProctorEvents_(data) {
  const courseId=String(data.courseId||""),teacher=editor_(data,courseId),wanted=email_(data.email||"");
  const testId=String(data.testId||""),sh=proctorEvents_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  const rows=vals.slice(1).filter(function(r){
    return String(r[m.CourseId]||"")===courseId&&(!wanted||email_(r[m.StudentEmail])===wanted)&&(!testId||String(r[m.TestId])===testId);
  }).map(function(r){return {email:String(r[m.StudentEmail]||""),name:String(r[m.StudentName]||""),group:String(r[m.Group]||""),courseId:String(r[m.CourseId]||""),testId:String(r[m.TestId]||""),eventType:String(r[m.EventType]||""),attemptNo:Number(r[m.AttemptNo]||1),violationNo:Number(r[m.ViolationNo]||0),action:String(r[m.Action]||""),penaltyPoints:Number(r[m.PenaltyPoints]||0),page:String(r[m.Page]||""),clientTime:String(r[m.ClientTime]||""),serverTime:String(r[m.ServerTime]||""),details:String(r[m.Details]||"")};});
  rows.sort(function(a,b){return String(b.serverTime).localeCompare(String(a.serverTime));});
  return {success:true,events:rows.slice(0,200)};
}
function getTutoringLink_(data) {
  const user=auth_(data),courseId=String(data.courseId||"");
  if(!courseId||!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к дисциплине.");
  const raw=settingValue_("tutoring:"+courseId);
  let value={url:"",title:"Запись на дополнительные занятия",description:"",visible:true};
  if(raw){try{value=Object.assign(value,JSON.parse(raw)||{});}catch(e){}}
  return {success:true,link:value};
}
function saveTutoringLink_(data) {
  const courseId=String(data.courseId||""),teacher=editor_(data,courseId);
  const url=String(data.url||"").trim(),title=String(data.title||"Запись на дополнительные занятия").trim().slice(0,120);
  const description=String(data.description||"").trim().slice(0,500),visible=data.visible!==false;
  if(url&&!/^https?:\/\//i.test(url))throw new Error("Ссылка должна начинаться с https:// или http://.");
  if(url.length>1000)throw new Error("Слишком длинная ссылка.");
  writeSetting_("tutoring:"+courseId,JSON.stringify({url:url,title:title||"Запись на дополнительные занятия",description:description,visible:visible}),teacher.email);
  return {success:true,link:{url:url,title:title,description:description,visible:visible}};
}

/* ---------- In-app notifications ---------- */
function createNotification_(recipientEmail, type, title, message, courseId, relatedId) {
  const recipient=email_(recipientEmail); if(!recipient)return;
  notifications_().appendRow([Utilities.getUuid(),recipient,String(type||"info").slice(0,40),String(title||"Уведомление").slice(0,180),String(message||"").slice(0,500),String(courseId||""),String(relatedId||""),new Date().toISOString(),""]);
}

// Рассылает уведомление всем преподавателям, имеющим доступ к дисциплине,
// и администратору. Это надёжнее, чем уведомлять только автора задания.
function notifyCourseStaff_(courseId, type, title, message, relatedId) {
  const sh=users_(), values=sh.getDataRange().getValues(), m=headerMap_(sh), sent={};
  values.slice(1).forEach(function(row) {
    const role=String(row[m.Role]||"").toLowerCase(), mail=email_(row[m.Email]);
    if(!mail || sent[mail]) return;
    const recipient={email:mail,role:role,courses:String(row[m.Courses]||"")};
    if(role==="admin" || (role==="teacher" && hasCourseAccess_(recipient,courseId))) {
      createNotification_(mail,type,title,message,courseId,relatedId);
      sent[mail]=true;
    }
  });
  return Object.keys(sent).length;
}
function getNotifications_(data) {
  const user=auth_(data),sh=notifications_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  const items=vals.slice(1).map(function(r,i){
    if(email_(r[m.RecipientEmail])!==user.email)return null;
    return {id:String(r[m.Id]||""),type:String(r[m.Type]||"info"),title:String(r[m.Title]||""),message:String(r[m.Message]||""),courseId:String(r[m.CourseId]||""),relatedId:String(r[m.RelatedId]||""),createdAt:String(r[m.CreatedAt]||""),readAt:String(r[m.ReadAt]||""),row:i+2};
  }).filter(Boolean).sort(function(a,b){return String(b.createdAt).localeCompare(String(a.createdAt));}).slice(0,60);
  return {success:true,notifications:items,unread:items.filter(function(x){return !x.readAt;}).length};
}
function markNotificationRead_(data) {
  const user=auth_(data),id=String(data.id||"");if(!id)throw new Error("Не указано уведомление.");
  const sh=notifications_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  for(let i=1;i<vals.length;i++)if(String(vals[i][m.Id]||"")===id){
    if(email_(vals[i][m.RecipientEmail])!==user.email)throw new Error("Нет доступа к этому уведомлению.");
    if(!vals[i][m.ReadAt])sh.getRange(i+1,m.ReadAt+1).setValue(new Date().toISOString());
    return {success:true};
  }
  throw new Error("Уведомление не найдено.");
}
function markAllNotificationsRead_(data) {
  const user=auth_(data),lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const sh=notifications_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh),now=new Date().toISOString();let count=0;
    for(let i=1;i<vals.length;i++)if(email_(vals[i][m.RecipientEmail])===user.email&&!vals[i][m.ReadAt]){sh.getRange(i+1,m.ReadAt+1).setValue(now);count++;}
    return {success:true,updated:count};
  } finally {lock.releaseLock();}
}

function assignmentResultRecords_(emailFilter) {
  const as=assignments_(), av=as.getDataRange().getValues(), ah=headerMap_(as);
  const ss=assignmentSubmissions_(), sv=ss.getDataRange().getValues(), sh=headerMap_(ss), byId={};
  const hs=assignmentSubmissionHistory_(), hv=hs.getDataRange().getValues(), hm=headerMap_(hs), attemptCounts={};
  hv.slice(1).forEach(function(r){const sid=String(r[hm.SubmissionId]||"");if(sid)attemptCounts[sid]=(attemptCounts[sid]||0)+1;});
  av.slice(1).forEach(function(r){if(r[ah.Id])byId[String(r[ah.Id])]=r;});
  const wanted=emailFilter?email_(emailFilter):"";
  return sv.slice(1).filter(function(r){return r[sh.Id]&&(!wanted||email_(r[sh.StudentEmail])===wanted);}).map(function(r){
    const a=byId[String(r[sh.AssignmentId])];if(!a)return null;
    const grade=r[sh.Grade]===""||r[sh.Grade]===null?"":Number(r[sh.Grade]);
    return {email:email_(r[sh.StudentEmail]),name:String(r[sh.StudentName]||""),group:String(r[sh.Group]||""),testId:"assignment_"+String(a[ah.Id]),testTitle:"Задание: "+String(a[ah.Title]||""),grade:grade,score:grade===""?0:grade,maxScore:5,percent:grade===""?0:grade*20,timeSpent:0,attempts:Math.max(1,attemptCounts[String(r[sh.Id])]||1),finishedAt:String(r[sh.SubmittedAt]||""),courseId:normalizeCourseId_(a[ah.CourseId]),payload:String(r[sh.Answer]||""),assignmentStatus:String(r[sh.Status]||"submitted"),feedback:String(r[sh.Feedback]||""),assignmentId:String(a[ah.Id])};
  }).filter(Boolean);
}

function getResults_(data) {
  const user=auth_(data);
  if(user.role!=="admin"&&user.role!=="teacher")throw new Error("Недостаточно прав.");
  let list=results_().getDataRange().getValues().slice(1).filter(function(r){return !!r[0];}).map(function(r){
    return {email:r[0],name:r[1],group:r[2],testId:r[3],testTitle:r[4],grade:r[5],score:r[6],maxScore:r[7],percent:r[8],timeSpent:r[9],attempts:r[10],finishedAt:r[11],date:String(r[11]||"").slice(0,10),courseId:normalizeCourseId_(r[12]),payload:String(r[13]||"")};
  });
  const sh=users_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh),protectedBanks=protectedQuestionBankMap_();
  // Индексируем уже загруженные результаты один раз: без этого каждый legacy-результат
  // сравнивался со всем массивом и отчёт резко замедлялся по мере роста журнала.
  function resultCourseKey_(value){const v=normalizeCourseId_(value);return /^-?\\d+(?:\\.\\d+)?$/.test(v)?String(Number(v)):v;}
  const resultKeys=new Set(list.map(function(x){return JSON.stringify([email_(x.email),String(x.testId),resultCourseKey_(x.courseId)]);}));
  const assignmentKeys=new Set(list.map(function(x){return JSON.stringify([email_(x.email),String(x.testId)]);}));
  vals.slice(1).forEach(function(row){
    if(String(row[m.Role]||"").toLowerCase()!=="student")return;
    let p={};try{p=JSON.parse(row[m.Payload]||"{}");}catch(e){}
    const rs=p.results||{};
    Object.keys(rs).forEach(function(key){
      const rec=rs[key];if(!rec||typeof rec!=="object"||rec.grade==null)return;
      const email=email_(row[m.Email]);
      let cid=normalizeCourseId_(rec.courseId||"");
      if(!cid){
        const matches=CFG.COURSES.filter(function(id){return key.indexOf(id)>=0;});
        if(matches.length===1)cid=matches[0];
        else{const enrolled=String(row[m.Courses]||"").split(",").filter(Boolean);if(enrolled.length===1)cid=enrolled[0];}
      }
      const resultKey=JSON.stringify([email,String(key),resultCourseKey_(cid)]);
      if(resultKeys.has(resultKey))return;
      if(isProtectedAssessment_(key,cid,protectedBanks))return;
      resultKeys.add(resultKey);
      assignmentKeys.add(JSON.stringify([email,String(key)]));
      list.push({email:email,name:row[m.Name],group:row[m.Group],testId:key,testTitle:rec.testTitle||key,grade:rec.grade,score:rec.score||0,maxScore:rec.max||rec.maxScore||0,percent:rec.percent||0,timeSpent:rec.timeSpent||0,attempts:rec.attempts||1,finishedAt:rec.finishedAt||"",courseId:cid});
    });
  });
  assignmentResultRecords_().forEach(function(x){
    const key=JSON.stringify([x.email,String(x.testId)]);
    if(!assignmentKeys.has(key)){assignmentKeys.add(key);list.push(x);}
  });
  if(user.role==="teacher")list=list.filter(function(x){return hasCourseAccess_(user,x.courseId);});
  if(data.courseId)list=list.filter(function(x){return sameCourseId_(x.courseId,data.courseId);});
  list.sort(function(a,b){return String(b.finishedAt).localeCompare(String(a.finishedAt));});
  return {success:true,results:list};
}

function getPublicSubjectRatings_(data) {
  // Публичная таблица содержит только ФИО, группу и агрегированные учебные показатели.
  // Email и исходные payload обучающихся не возвращаются.
  const user = auth_(data);
  const rows = results_().getDataRange().getValues().slice(1).filter(function (r) { return !!r[0]; });
  // Совместимость со старой схемой: часть результатов может храниться в students.payload.
  const userSheet = users_(), userValues = userSheet.getDataRange().getValues(), userMap = headerMap_(userSheet), protectedBanks=protectedQuestionBankMap_();
  userValues.slice(1).forEach(function (row) {
    if (String(row[userMap.Role] || "").toLowerCase() !== "student" || !row[userMap.Email]) return;
    let payload = {};
    try { payload = JSON.parse(row[userMap.Payload] || "{}"); } catch (e) {}
    const legacy = payload.results || {}, protectedBanks=protectedQuestionBankMap_();
    Object.keys(legacy).forEach(function (testId) {
      const rec = legacy[testId];
      if (!rec || typeof rec !== "object" || rec.grade == null) return;
      let courseId = String(rec.courseId || "");
      if (!courseId) {
        const matches = CFG.COURSES.filter(function (id) { return testId.indexOf(id) >= 0; });
        if (matches.length === 1) courseId = matches[0];
        else {
          const enrolled = String(row[userMap.Courses] || "").split(",").filter(Boolean);
          if (enrolled.length === 1) courseId = enrolled[0];
        }
      }
      if (!courseId || isProtectedAssessment_(testId,courseId,protectedBanks)) return;
      const email = email_(row[userMap.Email]);
      if (rows.some(function (r) { return email_(r[0]) === email && String(r[3]) === String(testId) && String(r[12] || "") === courseId; })) return;
      rows.push([
        email, row[userMap.Name], row[userMap.Group], testId, rec.testTitle || testId,
        rec.grade, rec.score || 0, rec.max || rec.maxScore || 0, rec.percent || 0,
        rec.timeSpent || 0, rec.attempts || 1, rec.finishedAt || "", courseId
      ]);
    });
  });
  const latest = {};
  rows.forEach(function (r) {
    const email = email_(r[0]), courseId = String(r[12] || "");
    if (!courseId || ((user.role === "student" || user.role === "teacher") && !hasCourseAccess_(user, courseId))) return;
    const testId = String(r[3] || ""), stamp = String(r[11] || "");
    const key = email + "|" + courseId + "|" + testId;
    if (!latest[key] || stamp >= String(latest[key][11] || "")) latest[key] = r;
  });
  const grouped = {};
  Object.keys(latest).forEach(function (key) {
    const r = latest[key], courseId = String(r[12] || ""), studentKey = email_(r[0]);
    if (!grouped[courseId]) grouped[courseId] = {};
    if (!grouped[courseId][studentKey]) grouped[courseId][studentKey] = {
      name: String(r[1] || "Обучающийся"), group: String(r[2] || ""), gradeSum: 0, percentSum: 0, completed: 0
    };
    const st = grouped[courseId][studentKey], grade = Number(r[5]) || 0;
    if (grade > 0) { st.gradeSum += grade; st.percentSum += Number(r[8]) || 0; st.completed += 1; }
  });
  const ratings = {};
  Object.keys(grouped).forEach(function (courseId) {
    ratings[courseId] = Object.keys(grouped[courseId]).map(function (key) {
      const st = grouped[courseId][key];
      return { name: st.name, group: st.group,
        averageGrade: st.completed ? Math.round(st.gradeSum / st.completed * 100) / 100 : 0,
        averagePercent: st.completed ? Math.round(st.percentSum / st.completed) : 0,
        completed: st.completed };
    }).sort(function (a, b) {
      return b.averageGrade - a.averageGrade || b.averagePercent - a.averagePercent || b.completed - a.completed;
    });
  });
  const subjectSummary = Object.keys(ratings).map(function (courseId) {
    const list = ratings[courseId], participants = list.length;
    const avg = participants ? list.reduce(function (sum, x) { return sum + x.averageGrade; }, 0) / participants : 0;
    return { courseId: courseId, participants: participants, averageGrade: Math.round(avg * 100) / 100 };
  }).sort(function (a, b) { return b.averageGrade - a.averageGrade || b.participants - a.participants; });
  return { success: true, ratings: ratings, subjects: subjectSummary };
}

function saveGCodeProgress_(data) {
  const user = auth_(data);
  if (user.role !== "student") throw new Error("Прогресс G-Code Lab доступен только обучающемуся.");
  const incoming = data.progress && typeof data.progress === "object" ? data.progress : {};
  const done = Array.isArray(incoming.done) ? Array.from(new Set(incoming.done.map(Number).filter(function(n){return Number.isInteger(n)&&n>=1&&n<=300;}))).slice(0,300) : [];
  const known = ["Первый запуск","Азбука G/M","Командир траектории","Геометр","Архитектор контуров","Буквенный мастер","Мастер алфавита","Словесный программист","Автор инструкций","Легенда ЧПУ"];
  const achievements = Array.isArray(incoming.achievements) ? incoming.achievements.filter(function(x){return known.indexOf(String(x))>=0;}) : [];
  const progress = { level: Math.max(1,Math.min(300,Math.floor(Number(incoming.level)||1))), xp: Math.max(0,Math.min(3000,Math.floor(Number(incoming.xp)||0))), done: done, achievements: achievements, streak: Math.max(0,Math.min(300,Math.floor(Number(incoming.streak)||0))), updatedAt: Number(incoming.updatedAt)||Date.now() };
  let payload = {};
  try { payload = JSON.parse(user.payload || "{}"); } catch (e) {}
  payload.gcodeProgress = progress;
  writeUserFields_(user, { Payload: JSON.stringify(payload), UpdatedAt: new Date().toISOString() });
  return { success: true, progress: progress };
}
function getMyCourseResults_(data) {
  const user=auth_(data),email=email_(user.email),requestedCourse=String(data.courseId||"");
  const list=results_().getDataRange().getValues().slice(1).filter(function(r){
    return r[0]&&email_(r[0])===email&&(!requestedCourse||sameCourseId_(r[12],requestedCourse));
  }).map(function(r){
    return {testId:String(r[3]||""),testTitle:String(r[4]||r[3]||""),grade:r[5]===""||r[5]===null?"":Number(r[5])||0,score:Number(r[6])||0,maxScore:Number(r[7])||0,percent:Number(r[8])||0,timeSpent:Number(r[9])||0,finishedAt:String(r[11]||""),courseId:normalizeCourseId_(r[12]),payload:String(r[13]||"")};
  });
  const sheet=users_(),values=sheet.getDataRange().getValues(),map=headerMap_(sheet);
  const row=values.slice(1).find(function(r){return email_(r[map.Email])===email;});
  if(row){
    let payload={};try{payload=JSON.parse(row[map.Payload]||"{}");}catch(e){}
    const legacy=payload.results||{};
    Object.keys(legacy).forEach(function(testId){
      const rec=legacy[testId];if(!rec||typeof rec!=="object"||rec.grade==null)return;
      let courseId=normalizeCourseId_(rec.courseId||"");
      if(!courseId){
        const matches=CFG.COURSES.filter(function(id){return testId.indexOf(id)>=0;});
        if(matches.length===1)courseId=matches[0];
        else{const enrolled=String(row[map.Courses]||"").split(",").filter(Boolean);if(enrolled.length===1)courseId=enrolled[0];}
      }
      if(requestedCourse&&!sameCourseId_(courseId,requestedCourse))return;
      if(isProtectedAssessment_(testId,courseId,protectedQuestionBankMap_()))return;
      if(list.some(function(x){return x.testId===String(testId)&&sameCourseId_(x.courseId,courseId);}))return;
      list.push({testId:String(testId),testTitle:String(rec.testTitle||testId),grade:Number(rec.grade)||0,score:Number(rec.score)||0,maxScore:Number(rec.max||rec.maxScore)||0,percent:Number(rec.percent)||0,timeSpent:Number(rec.timeSpent)||0,finishedAt:String(rec.finishedAt||""),courseId:courseId});
    });
    // Оценки из журнала преподавателя хранятся в payload.manualGrades по дате.
    // У старого формата нет поля дисциплины, поэтому показываем их в общем журнале,
    // не приписывая произвольный курс.
    if(!requestedCourse){
      const manual=payload.manualGrades||{};
      Object.keys(manual).forEach(function(date){
        const value=manual[date];if(value===undefined||value===null||String(value).trim()==="")return;
        const id="manual_"+String(date);
        if(list.some(function(x){return x.testId===id;}))return;
        const numeric=Number(value);
        list.push({testId:id,testTitle:"Оценка преподавателя",grade:String(value),score:isFinite(numeric)?numeric:0,maxScore:5,percent:isFinite(numeric)?numeric*20:0,timeSpent:0,finishedAt:String(date),courseId:"",manual:true});
      });
    }
  }
  assignmentResultRecords_(email).forEach(function(x){
    if((!requestedCourse||sameCourseId_(x.courseId,requestedCourse))&&!list.some(function(r){return r.testId===x.testId;})){
      list.push({testId:x.testId,testTitle:x.testTitle,grade:x.grade,score:x.score,maxScore:x.maxScore,percent:x.percent,timeSpent:0,finishedAt:x.finishedAt,courseId:x.courseId,payload:x.payload,assignmentStatus:x.assignmentStatus,feedback:x.feedback,assignmentId:x.assignmentId});
    }
  });
  list.sort(function(a,b){return String(a.finishedAt).localeCompare(String(b.finishedAt));});
  const graded=list.filter(function(x){return x.grade!==""&&x.grade!==null&&Number(x.grade)>0;});
  const averageGrade=graded.length?Math.round(graded.reduce(function(n,x){return n+Number(x.grade||0);},0)/graded.length*100)/100:0;
  const averagePercent=graded.length?Math.round(graded.reduce(function(n,x){return n+Number(x.percent||0);},0)/graded.length):0;
  return {success:true,results:list,summary:{completed:list.length,graded:graded.length,averageGrade:averageGrade,averagePercent:averagePercent}};
}

/* ---------- Assignments and student submissions ---------- */
function createAssignment_(data) {
  const courseId = String(data.courseId || "").trim();
  if (!courseId || CFG.COURSES.indexOf(courseId) < 0) throw new Error("Укажите корректную дисциплину.");
  const teacher = editor_(data, courseId);
  const title = String(data.title || "").trim().slice(0,180);
  const instructions = String(data.instructions || "").trim().slice(0,10000);
  const targetType = String(data.targetType || "");
  const rawTarget = String(data.targetValue || "").trim().slice(0,120);
  const targetValue = targetType === "individual" ? email_(rawTarget) : rawTarget;
  const dueAt = String(data.dueAt || "").trim();
  if (!title || !instructions) throw new Error("Заполните название и условие задания.");
  if (["group","individual"].indexOf(targetType) < 0 || !targetValue) throw new Error("Выберите адресата.");
  if (dueAt) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueAt)) throw new Error("Срок должен быть указан в формате даты.");
    const parts = dueAt.split("-").map(Number);
    const parsed = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    if (parsed.getUTCFullYear() !== parts[0] || parsed.getUTCMonth() !== parts[1] - 1 || parsed.getUTCDate() !== parts[2]) throw new Error("Указана некорректная дата срока.");
  }
  if (targetType === "individual" && targetValue.indexOf("@") < 1) throw new Error("Укажите корректный email обучающегося.");
  const us = users_(), rows = us.getDataRange().getValues(), um = headerMap_(us);
  const matches = rows.slice(1).filter(function(r) {
    if (String(r[um.Role] || "").toLowerCase() !== "student") return false;
    if (!hasCourseAccess_({role:"student",courses:String(r[um.Courses] || "")}, courseId)) return false;
    if (targetType === "individual") return email_(r[um.Email]) === targetValue;
    return String(r[um.Group] || "").trim().toLowerCase() === targetValue.toLowerCase();
  });
  // Групповое назначение разрешено публиковать до регистрации обучающихся.
  if (targetType === "individual" && !matches.length) throw new Error("Обучающийся не найден или у него нет доступа к дисциплине.");
  const id = Utilities.getUuid(), now = new Date().toISOString();
  appendMappedRecord_(assignments_(), {
    Id:id, CourseId:courseId, Title:title,
    Topic:String(data.topic || "").trim().slice(0,180),
    Level:String(data.level || "Средний").slice(0,60),
    WorkType:String(data.workType || "Практическое задание").slice(0,80),
    DueAt:dueAt, TargetType:targetType, TargetValue:targetValue,
    Instructions:instructions, Criteria:String(data.criteria || "").slice(0,4000),
    CreatedBy:teacher.email, CreatedAt:now, Status:"active"
  });
  matches.forEach(function(row){
    const mail=email_(row[um.Email]);
    createNotification_(mail,"assignment","Новое учебное задание",
      "Вам назначена работа: «"+title+"»."+(dueAt?" Срок выполнения: "+dueAt+".":"")+
      " Откройте раздел «Назначенные мне работы».",courseId,id);
  });
  return {success:true,id:id,recipients:matches.length};
}
function getAssignments_(data) {
  const user = auth_(data);
  if (["student","teacher","admin"].indexOf(user.role) < 0) throw new Error("Недостаточно прав.");
  const sh = assignments_(), rows = sh.getDataRange().getValues(), h = headerMap_(sh);
  const ss = assignmentSubmissions_(), subs = ss.getDataRange().getValues(), m = headerMap_(ss);
  const hs = assignmentSubmissionHistory_(), historyRows = hs.getDataRange().getValues(), hm = headerMap_(hs), list = [];
  function historyFor(submission) {
    const sid = String(submission[m.Id] || "");
    const saved = historyRows.slice(1).filter(function(x){return String(x[hm.SubmissionId]||"")===sid;})
      .map(function(x){return {attempt:Number(x[hm.AttemptNo])||1,answer:String(x[hm.Answer]||""),submittedAt:String(x[hm.SubmittedAt]||"")};})
      .sort(function(x,y){return x.attempt-y.attempt;});
    return saved.length?saved:[{attempt:1,answer:String(submission[m.Answer]||""),submittedAt:String(submission[m.SubmittedAt]||"")}];
  }
  rows.slice(1).forEach(function(r){
    if (!r[h.Id]) return;
    const cid=String(r[h.CourseId]||""); if(!hasCourseAccess_(user,cid)) return;
    if(user.role==="student"){
      const typ=String(r[h.TargetType]||""),val=String(r[h.TargetValue]||"");
      if(typ!=="individual"&&typ!=="group")return;
      if(typ==="individual"&&email_(val)!==user.email)return;
      if(typ==="group"&&String(val||"").trim().toLowerCase()!==String(user.group||"").trim().toLowerCase())return;
      if(String(r[h.Status]||"active")!=="active")return;
    }
    const item={id:String(r[h.Id]),courseId:cid,title:String(r[h.Title]||""),topic:String(r[h.Topic]||""),level:String(r[h.Level]||""),workType:String(r[h.WorkType]||""),dueAt:String(r[h.DueAt]||""),targetType:String(r[h.TargetType]||""),targetValue:String(r[h.TargetValue]||""),instructions:String(r[h.Instructions]||""),criteria:String(r[h.Criteria]||""),createdAt:String(r[h.CreatedAt]||""),status:String(r[h.Status]||"active")};
    const own=subs.slice(1).filter(function(x){return String(x[m.AssignmentId])===item.id;});
    if(user.role==="student"){
      const ownStudent=own.filter(function(x){return email_(x[m.StudentEmail])===user.email;}).sort(function(x,y){return String(y[m.SubmittedAt]).localeCompare(String(x[m.SubmittedAt]));})[0];
      item.submission=ownStudent?{answer:String(ownStudent[m.Answer]||""),submittedAt:String(ownStudent[m.SubmittedAt]||""),status:String(ownStudent[m.Status]||"submitted"),grade:ownStudent[m.Grade]===""?null:ownStudent[m.Grade],feedback:String(ownStudent[m.Feedback]||""),attempts:historyFor(ownStudent).length,history:historyFor(ownStudent)}:null;
    } else {
      item.submissions=own.map(function(x){const hist=historyFor(x);return {id:String(x[m.Id]),studentEmail:email_(x[m.StudentEmail]),studentName:String(x[m.StudentName]),group:String(x[m.Group]),answer:String(x[m.Answer]||""),submittedAt:String(x[m.SubmittedAt]||""),status:String(x[m.Status]||"submitted"),grade:x[m.Grade]===""?null:x[m.Grade],feedback:String(x[m.Feedback]||""),attempts:hist.length,history:hist};});
    }
    list.push(item);
  });
  list.sort(function(x,y){return String(y.createdAt).localeCompare(String(x.createdAt));});
  return {success:true,assignments:list};
}
function submitAssignment_(data) {
  const student = auth_(data);
  if (student.role !== "student") throw new Error("Отправлять ответы может только обучающийся.");
  const id = String(data.assignmentId || "");
  const answer = String(data.answer || "").trim().slice(0,12000);
  if (!id || !answer) throw new Error("Введите ответ.");
  const sh = assignments_(), rows = sh.getDataRange().getValues(), h = headerMap_(sh);
  const a = rows.slice(1).find(function(r){ return String(r[h.Id]) === id; });
  if (!a) throw new Error("Задание не найдено.");
  const cid = String(a[h.CourseId] || ""), typ = String(a[h.TargetType] || ""), val = String(a[h.TargetValue] || "");
  const eligible = (typ === "individual" && email_(val) === student.email) || (typ === "group" && String(val || "").trim().toLowerCase() === String(student.group || "").trim().toLowerCase());
  if (!hasCourseAccess_(student,cid) || !eligible || String(a[h.Status] || "active") !== "active") throw new Error("Это задание вам недоступно.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sub = assignmentSubmissions_(), v = sub.getDataRange().getValues(), m = headerMap_(sub);
    const i = v.slice(1).findIndex(function(r){ return String(r[m.AssignmentId]) === id && email_(r[m.StudentEmail]) === student.email; });
    const now = new Date().toISOString();
    const submissionId = i >= 0 ? String(v[i+1][m.Id]) : Utilities.getUuid();
    const hist = assignmentSubmissionHistory_(), hv = hist.getDataRange().getValues(), hm = headerMap_(hist);
    const saved = hv.slice(1).filter(function(r){ return String(r[hm.SubmissionId] || "") === submissionId; });
    let attempt = saved.length + 1;
    if (i >= 0 && !saved.length) {
      const previous = v[i+1], previousAt = String(previous[m.SubmittedAt] || now);
      appendMappedRecord_(hist, {Id:Utilities.getUuid(),AssignmentId:id,SubmissionId:submissionId,StudentEmail:student.email,StudentName:String(previous[m.StudentName] || student.name),Group:String(previous[m.Group] || student.group),Answer:String(previous[m.Answer] || ""),SubmittedAt:previousAt,AttemptNo:1});
      attempt = 2;
    }
    appendMappedRecord_(hist, {Id:Utilities.getUuid(),AssignmentId:id,SubmissionId:submissionId,StudentEmail:student.email,StudentName:student.name,Group:student.group,Answer:answer,SubmittedAt:now,AttemptNo:attempt});
    const record = {Id:submissionId,AssignmentId:id,StudentEmail:student.email,StudentName:student.name,Group:student.group,Answer:answer,SubmittedAt:now,Status:"submitted",Grade:"",Feedback:"",ReviewedBy:"",ReviewedAt:""};
    if (i >= 0) updateMappedRecord_(sub, i + 2, record); else appendMappedRecord_(sub, record);
    notifyCourseStaff_(cid,"submission",attempt > 1 ? "Повторная отправка задания" : "Новый ответ на задание",
      student.name + " (" + student.group + ") отправил(а) работу: " + String(a[h.Title] || "") + ". Откройте раздел «Задания и проверка работ».",id);
    return {success:true,submittedAt:now,attempt:attempt,submissionId:submissionId};
  } finally { lock.releaseLock(); }
}
function gradeAssignment_(data) {
  const actor = auth_(data);
  if (actor.role !== "teacher" && actor.role !== "admin") throw new Error("Проверять ответы могут только преподаватели.");
  if (data.grade === undefined || data.grade === null || String(data.grade).trim() === "") throw new Error("Выберите оценку.");
  const grade = Number(data.grade);
  if (!isFinite(grade) || grade < 0 || grade > 5) throw new Error("Оценка должна быть от 0 до 5.");
  const id = String(data.submissionId || "");
  if (!id) throw new Error("Не указан ответ для проверки.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = assignmentSubmissions_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
    const i = vals.slice(1).findIndex(function(r){ return String(r[m.Id]) === id; });
    if (i < 0) throw new Error("Ответ не найден.");
    const row = vals[i+1], aid = String(row[m.AssignmentId] || "");
    const as = assignments_(), av = as.getDataRange().getValues(), ah = headerMap_(as);
    const a = av.slice(1).find(function(r){ return String(r[ah.Id]) === aid; });
    if (!a) throw new Error("Назначение не найдено.");
    const courseId = String(a[ah.CourseId] || "");
    const teacher = editor_(data, courseId);
    const feedback = String(data.feedback || "").slice(0,4000);
    updateMappedRecord_(sh, i + 2, {Status:"reviewed",Grade:grade,Feedback:feedback,ReviewedBy:teacher.email,ReviewedAt:new Date().toISOString()});
    const retryNeeded=grade<=2;
    createNotification_(String(row[m.StudentEmail] || ""),retryNeeded?"assignment_retry":"grade",
      retryNeeded?"Работу нужно доработать":"Работа проверена",
      "По заданию «" + String(a[ah.Title] || "") + "» выставлена оценка: " + grade + "/5." +
      (feedback ? " Комментарий преподавателя: "+feedback : "") +
      (retryNeeded?" Исправь ошибки и отправь ответ повторно в разделе «Назначенные мне работы».":""),
      courseId,aid);
    return {success:true,retrySuggested:retryNeeded};
  } finally { lock.releaseLock(); }
}

/* ---------- Assignment due reminders ---------- */
// Устанавливается один раз вручную из редактора Google Apps Script.
// Запускает ежедневную проверку в часовом поясе проекта, ориентировочно в 09:00.
function installAssignmentReminderTrigger() {
  const existing=ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==="sendAssignmentDueReminders_";});
  existing.forEach(function(t){ScriptApp.deleteTrigger(t);});
  ScriptApp.newTrigger("sendAssignmentDueReminders_").timeBased().everyDays(1).atHour(9).create();
  return "Ежедневное напоминание о сроках заданий включено (около 09:00, часовой пояс проекта).";
}

function sendAssignmentDueReminders_() {
  const now=new Date(),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  const dueKey=Utilities.formatDate(tomorrow,Session.getScriptTimeZone(),"yyyy-MM-dd");
  const as=assignments_(),av=as.getDataRange().getValues(),ah=headerMap_(as);
  const us=users_(),uv=us.getDataRange().getValues(),um=headerMap_(us);
  const ss=assignmentSubmissions_(),sv=ss.getDataRange().getValues(),sm=headerMap_(ss);
  const ns=notifications_(),nv=ns.getDataRange().getValues(),nm=headerMap_(ns);
  const already={};
  nv.slice(1).forEach(function(r){
    if(String(r[nm.Type]||"")!=="assignment_due")return;
    already[String(r[nm.RelatedId]||"")]=true;
  });
  let sent=0;
  av.slice(1).forEach(function(a){
    const id=String(a[ah.Id]||""),course=String(a[ah.CourseId]||""),due=String(a[ah.DueAt]||"");
    if(!id||due!==dueKey||String(a[ah.Status]||"active")!=="active")return;
    const type=String(a[ah.TargetType]||""),target=String(a[ah.TargetValue]||"").trim().toLowerCase();
    if(type!=="group"&&type!=="individual")return;
    const submitted={};
    sv.slice(1).forEach(function(sub){
      if(String(sub[sm.AssignmentId]||"")===id)submitted[email_(sub[sm.StudentEmail])]=true;
    });
    uv.slice(1).forEach(function(userRow){
      if(String(userRow[um.Role]||"").toLowerCase()!=="student")return;
      const mail=email_(userRow[um.Email]),group=String(userRow[um.Group]||"").trim().toLowerCase();
      const recipient={role:"student",courses:String(userRow[um.Courses]||"")};
      if(!mail||!hasCourseAccess_(recipient,course)||submitted[mail])return;
      if(type==="individual"&&mail!==email_(target))return;
      if(type==="group"&&group!==target)return;
      const dedupe=id+"|"+mail+"|"+dueKey;
      if(already[dedupe])return;
      createNotification_(mail,"assignment_due","Завтра срок сдачи работы",
        "Напоминаем: завтра истекает срок выполнения задания «"+String(a[ah.Title]||"")+"». Если работа ещё не отправлена, откройте «Назначенные мне работы» и отправьте ответ.",
        course,dedupe);
      already[dedupe]=true;sent++;
    });
  });
  return {success:true,remindersSent:sent,dueDate:dueKey};
}

/* ---------- Teacher controls: topic access and test attempts ---------- */
function settingValue_(key) {
  const sh=settings_(), vals=sh.getDataRange().getValues(), m=headerMap_(sh);
  for(let i=1;i<vals.length;i++) if(String(vals[i][m.Key]||"")===key) return String(vals[i][m.Value]||"");
  return "";
}
function writeSetting_(key,value,actorEmail) {
  const sh=settings_(), vals=sh.getDataRange().getValues(), m=headerMap_(sh), now=new Date().toISOString();
  let row=0;
  for(let i=1;i<vals.length;i++) if(String(vals[i][m.Key]||"")===key){row=i+1;break;}
  const record=[key,String(value),now,String(actorEmail||"")];
  if(row) sh.getRange(row,1,1,record.length).setValues([record]); else sh.appendRow(record);
}
function getTopicAccess_(data) {
  const user=auth_(data), courseId=String(data.courseId||""), topicId=String(data.topicId||"");
  if(!courseId||!topicId||!hasCourseAccess_(user,courseId)) throw new Error("Нет доступа к теме.");
  const raw=settingValue_("topicAccess:"+courseId+":"+topicId);
  let policy={open:true}; try{if(raw)policy=JSON.parse(raw)||policy;}catch(e){}
  return {success:true,open:policy.open!==false};
}
function setTopicAccess_(data) {
  const courseId=String(data.courseId||""), topicId=String(data.topicId||"");
  if(!courseId||!topicId) throw new Error("Не указана дисциплина или тема.");
  const teacher=editor_(data,courseId);
  writeSetting_("topicAccess:"+courseId+":"+topicId,JSON.stringify({open:data.open===true}),teacher.email);
  return {success:true,open:data.open===true};
}
function getTestAttemptStatus_(data) {
  const actor=auth_(data),courseId=String(data.courseId||""),testId=String(data.testId||"");
  if(!courseId||!testId) throw new Error("Укажите дисциплину и тест.");
  let targetEmail=actor.email;
  if(actor.role==="teacher"||actor.role==="admin") {
    editor_(data,courseId);
    targetEmail=email_(data.email);
    if(!targetEmail) throw new Error("Выберите студента для проверки попыток.");
    const target=userByEmail_(targetEmail);
    if(!target||target.role!=="student"||!hasCourseAccess_(target,courseId)) throw new Error("Студент не обучается по этой дисциплине.");
  } else if(actor.role!=="student"||!hasCourseAccess_(actor,courseId)) {
    throw new Error("Нет доступа к тесту.");
  }
  const isCustom=testId.indexOf("custom_")===0;
  const baseId=isCustom?testId.slice(7):testId;
  const keys=isCustom?[baseId,testId]:[testId];
  let raw="";
  for(let i=0;i<keys.length;i++) {
    raw=settingValue_("testAttempts:"+targetEmail+":"+courseId+":"+keys[i]);
    if(raw!=="") break;
  }
  const limit=raw===""?1:1+Math.max(0,Number(raw)||0);
  const acceptedIds=isCustom?[testId,baseId]:[testId,"custom_"+testId];
  const used=results_().getDataRange().getValues().slice(1).filter(function(r){
    return email_(r[0])===targetEmail&&acceptedIds.indexOf(String(r[3]||""))>=0&&sameCourseId_(r[12]||courseId,courseId);
  }).length;
  return {success:true,email:targetEmail,testId:testId,used:used,limit:limit,remaining:Math.max(0,limit-used),extraAttempts:Math.max(0,limit-1),unlimited:false,allowed:used<limit};
}
function requestTestAttempts_(data) {
  const student=auth_(data);
  if(student.role!=="student") throw new Error("Запросить дополнительную попытку может только обучающийся.");
  const courseId=String(data.courseId||""),testId=String(data.testId||"").trim();
  if(!courseId||!testId||!hasCourseAccess_(student,courseId)) throw new Error("Нет доступа к выбранному тесту.");
  const status=getTestAttemptStatus_(data);
  if(status.allowed) throw new Error("У вас ещё есть доступные попытки ("+status.used+" из "+status.limit+").");
  const cache=CacheService.getScriptCache(),requestKey="attempt_request:"+student.email+":"+courseId+":"+testId.slice(0,120);
  if(cache.get(requestKey)) return {success:true,alreadyRequested:true,notified:0};
  const relatedId=JSON.stringify({email:student.email,testId:testId});
  const notified=notifyCourseStaff_(courseId,"attempt_request","Запрос дополнительной попытки",
    "Студент: "+student.name+" · "+student.group+" · "+student.email+". Тест: "+testId+". Использовано: "+status.used+" из "+status.limit+". Просит разрешить ещё одну попытку.",relatedId);
  if(!notified) throw new Error("Не найден преподаватель с доступом к этой дисциплине. Обратитесь к администратору.");
  appendAttemptAudit_({EventType:"attempts_requested",ActorEmail:student.email,StudentEmail:student.email,StudentName:student.name,Group:student.group,CourseId:courseId,TestId:testId,TestTitle:testId,ExtraAttempts:1});
  cache.put(requestKey,"1",600);
  return {success:true,alreadyRequested:false,notified:notified,used:status.used,limit:status.limit};
}

function resolveAttemptRequestNotifications_(studentEmail,courseId,testId) {
  const sh=notifications_(),rows=sh.getDataRange().getValues(),m=headerMap_(sh),stamp=new Date().toISOString();
  rows.slice(1).forEach(function(row,i){
    if(String(row[m.Type]||"")!=="attempt_request"||String(row[m.ReadAt]||""))return;
    if(!sameCourseId_(row[m.CourseId],courseId))return;
    let ref={};try{ref=JSON.parse(String(row[m.RelatedId]||"{}"));}catch(e){}
    if(email_(ref.email)===email_(studentEmail)&&String(ref.testId||"")===String(testId))updateMappedRecord_(sh,i+2,{ReadAt:stamp,Type:"attempt_request_resolved"});
  });
}

function grantTestAttempts_(data) {
  const courseId=String(data.courseId||""), testId=String(data.testId||""), studentEmail=email_(data.email);
  const teacher=editor_(data,courseId);
  if(!testId||!studentEmail) throw new Error("Выберите тест и студента.");
  const student=userByEmail_(studentEmail);
  if(!student||student.role!=="student"||!hasCourseAccess_(student,courseId)) throw new Error("Студент не обучается по этой дисциплине.");
  const extra=Math.max(0,Math.min(20,Math.floor(Number(data.extraAttempts)||0)));
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    writeSetting_("testAttempts:"+studentEmail+":"+courseId+":"+testId,String(extra),teacher.email);
    appendAttemptAudit_({EventType:"attempts_granted",ActorEmail:teacher.email,StudentEmail:student.email,StudentName:student.name,Group:student.group,CourseId:courseId,TestId:testId,ExtraAttempts:extra});
    resolveAttemptRequestNotifications_(studentEmail,courseId,testId);
    CacheService.getScriptCache().remove("attempt_request:"+studentEmail+":"+courseId+":"+testId.slice(0,120));
  } finally {lock.releaseLock();}
  createNotification_(student.email,"attempts","Выданы дополнительные попытки",
    "Преподаватель разрешил дополнительные попытки: "+extra+". Дисциплина: "+courseId+". Тест: "+testId+".",courseId,testId);
  return {success:true,extraAttempts:extra};
}

/* ---------- Teacher-created topics, lectures and tests ---------- */

function customContentIsOpen_(courseId, contentId, topicId, contentType) {
  function isOpen(key) {
    const raw = settingValue_(key);
    if (!raw) return true;
    try { return JSON.parse(raw).open !== false; } catch (e) { return true; }
  }
  if (contentType === "topic") return isOpen("topicAccess:" + courseId + ":" + contentId);
  if (!isOpen("contentAccess:" + courseId + ":" + contentId)) return false;
  if (topicId && !isOpen("topicAccess:" + courseId + ":" + topicId)) return false;
  return true;
}
function customContentRecord_(data) {
  const courseId = String(data.courseId || data.mdkId || ""), id = String(data.id || data.contentId || "");
  if (!courseId || !id) throw new Error("Не указана дисциплина или материал.");
  const actor = editor_(data, courseId);
  const rows = content_().getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === id && sameCourseId_(rows[i][1], courseId)) {
      return { actor: actor, id: id, courseId: courseId, topicId: String(rows[i][2] || ""), type: String(rows[i][3] || "") };
    }
  }
  throw new Error("Материал не найден в выбранной дисциплине.");
}
function getCustomContentAccess_(data) {
  const item = customContentRecord_(data);
  if (item.type === "topic") return { success: true, open: customContentIsOpen_(item.courseId, item.id, "", "topic"), topicOpen: true };
  const raw = settingValue_("contentAccess:" + item.courseId + ":" + item.id);
  let open = true;
  if (raw) { try { open = JSON.parse(raw).open !== false; } catch (e) {} }
  let topicOpen = true;
  if (item.topicId) {
    const topicRaw = settingValue_("topicAccess:" + item.courseId + ":" + item.topicId);
    if (topicRaw) { try { topicOpen = JSON.parse(topicRaw).open !== false; } catch (e) {} }
  }
  return { success: true, open: open, topicOpen: topicOpen, effectiveOpen: open && topicOpen };
}
function setCustomContentAccess_(data) {
  const item = customContentRecord_(data);
  if (item.type === "topic") throw new Error("Для тем используйте управление доступом к темам.");
  const open = data.open === true;
  writeSetting_("contentAccess:" + item.courseId + ":" + item.id, JSON.stringify({ open: open }), item.actor.email);
  return { success: true, open: open, id: item.id };
}

function getCustomContent_(data) {
  const user = auth_(data);
  const values = content_().getDataRange().getValues();
  const list = [];

  values.slice(1).forEach(function (row) {
    if (!row[0]) return;
    const courseId = normalizeCourseId_(row[1] || "");
    if (user.role !== "admin" && !hasCourseAccess_(user, courseId)) return;
    // Students receive only materials whose individual switch and parent-topic switch are open.
    if (user.role === "student" && !customContentIsOpen_(courseId, String(row[0] || ""), String(row[2] || ""), String(row[3] || ""))) return;

    let payload = {};
    try { payload = JSON.parse(row[5] || "{}"); } catch (error) { payload = {}; }

    // Student sessions receive test prompts and options only. Answer keys remain server-side.
    if (user.role === "student" && String(row[3] || "") === "test" && Array.isArray(payload.questions)) {
      payload.questions = payload.questions.map(function (question) {
        const safe = Object.assign({}, question || {});
        ["correct", "answer", "correctAnswer", "answers", "explanation", "solution", "key"].forEach(function (key) { delete safe[key]; });
        return safe;
      });
    }
    if (user.role === "student" && String(row[3] || "") === "game" && Array.isArray(payload.categories)) {
      payload.categories = payload.categories.map(function (category) {
        const safeCategory = Object.assign({}, category || {});
        safeCategory.questions = (Array.isArray(category.questions) ? category.questions : []).map(function (question) {
          const safeQuestion = Object.assign({}, question || {});
          ["a", "answer", "correct", "solution", "explanation", "key"].forEach(function (key) { delete safeQuestion[key]; });
          return safeQuestion;
        });
        return safeCategory;
      });
    }
    list.push(Object.assign({
      id: String(row[0]), mdkId: courseId, courseId: courseId,
      topicId: String(row[2] || ""), type: String(row[3] || ""), title: String(row[4] || "")
    }, payload));
  });

  return { success: true, data: list };
}



/* ---------- Private built-in question bank ---------- */
function questionBank_() { return ensureSheet_("QuestionBank"); }
/** Read-only inventory of the protected question bank. Admin only. */
function getQuestionBankStats_(data) {
  admin_(data);
  const sh = questionBank_(), values = sh.getDataRange().getValues(), m = headerMap_(sh);
  const courses = {}, bankKeys = {}; let totalRows = 0, invalidJson = 0, emptyQuestionIds = 0;
  for (let i = 1; i < values.length; i++) {
    const row = values[i], courseId = normalizeCourseId_(row[m.CourseId]), bankId = String(row[m.BankId] || "").trim();
    if (!courseId && !bankId && !row[m.QuestionJSON]) continue;
    const key = courseId + "|" + bankId;
    if (!courses[courseId]) courses[courseId] = { courseId: courseId, banks: 0, rows: 0, uniqueQuestions: 0, duplicateQuestionIds: 0, invalidJson: 0, emptyQuestionIds: 0 };
    if (!bankKeys[key]) { bankKeys[key] = { courseId: courseId, bankId: bankId, questions: 0, uniqueQuestions: 0, duplicateQuestionIds: 0, invalidJson: 0, seen: {} }; courses[courseId].banks++; }
    const course = courses[courseId], bank = bankKeys[key], questionId = String(row[m.QuestionId] || "");
    course.rows++; bank.questions++; totalRows++;
    if (!questionId) { course.emptyQuestionIds++; emptyQuestionIds++; }
    if (bank.seen[questionId]) { course.duplicateQuestionIds++; bank.duplicateQuestionIds++; }
    else { bank.seen[questionId] = true; course.uniqueQuestions++; bank.uniqueQuestions++; }
    try { const parsed = JSON.parse(String(row[m.QuestionJSON] || "")); if (!parsed || typeof parsed !== "object") throw new Error("invalid"); }
    catch (e) { course.invalidJson++; bank.invalidJson++; invalidJson++; }
  }
  const courseList = Object.keys(courses).sort().map(function(id) { return courses[id]; });
  const bankList = Object.keys(bankKeys).sort().map(function(key) { const b = bankKeys[key]; return { courseId: b.courseId, bankId: b.bankId, questions: b.questions, uniqueQuestions: b.uniqueQuestions, duplicateQuestionIds: b.duplicateQuestionIds, invalidJson: b.invalidJson }; });
  return { success: true, totals: { courses: courseList.length, banks: bankList.length, rows: totalRows, uniqueQuestions: courseList.reduce(function(n, c) { return n + c.uniqueQuestions; }, 0), duplicateQuestionIds: courseList.reduce(function(n, c) { return n + c.duplicateQuestionIds; }, 0), invalidJson: invalidJson, emptyQuestionIds: emptyQuestionIds }, courses: courseList, banks: bankList };
}

/**
 * Импорт встроенного банка выполняет только администратор.
 * Один объект banks: {courseId, bankId, title, questions:[...]}.
 * Повторный импорт того же courseId + bankId заменяет только этот банк.
 */
function importQuestionBanks_(data) {
  const actor = admin_(data);
  const banks = Array.isArray(data.banks) ? data.banks : [];
  if (!banks.length || banks.length > 100) throw new Error("Передайте от 1 до 100 банков за один импорт.");
  const allowed = CFG.COURSES, prepared = [], seen = {};
  let total = 0;
  banks.forEach(function(bank) {
    const courseId = String(bank.courseId || ""), bankId = String(bank.bankId || "").slice(0,180);
    const questions = Array.isArray(bank.questions) ? bank.questions : [];
    const key=courseId+"|"+bankId;
    if (allowed.indexOf(courseId)<0) throw new Error("Неизвестная дисциплина в банке «"+bankId+"»: «"+courseId+"». Допустимые дисциплины: "+allowed.join(", ")+".");
    if (!bankId) throw new Error("У банка не указан идентификатор (дисциплина «"+courseId+"»).");
    if (seen[key]) throw new Error("Повторяющийся идентификатор банка «"+bankId+"» для дисциплины «"+courseId+"».");
    seen[key]=true;
    if (!questions.length || questions.length>1000) throw new Error("Банк "+bankId+": допустимо от 1 до 1000 вопросов.");
    const out=questions.map(function(q,index){
      if(!q||typeof q!=="object")throw new Error("Некорректный вопрос в банке "+bankId+".");
      const json=JSON.stringify(q);
      if(json.length>45000)throw new Error("Вопрос "+(index+1)+" банка "+bankId+" превышает лимит 45 КБ.");
      return [courseId,bankId,String(q.id||(bankId+":"+index)).slice(0,220),json,new Date().toISOString(),actor.email];
    });
    total+=out.length;prepared.push({courseId:courseId,bankId:bankId,rows:out});
  });
  if(total>2500)throw new Error("Разбейте импорт на части: не более 2500 вопросов за запрос.");
  const sh=questionBank_(),lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const map=headerMap_(sh),targets={};
    prepared.forEach(function(bank){targets[bank.courseId+"|"+bank.bankId]=true;});
    const current=sh.getDataRange().getValues(),header=current.length?current[0]:HEADERS.QuestionBank;
    // Rebuild once: repeated row deletion and per-bank writes were timing out in Apps Script.
    const retained=current.slice(1).filter(function(row){
      const key=normalizeCourseId_(row[map.CourseId])+"|"+String(row[map.BankId]);
      return !targets[key];
    });
    const incoming=[];
    prepared.forEach(function(bank){Array.prototype.push.apply(incoming,bank.rows);});
    const output=[header].concat(retained,incoming);
    sh.clearContents();
    sh.getRange(1,1,output.length,6).setValues(output);
    CacheService.getScriptCache().remove("protectedQuestionBankMap:v1");
    return {success:true,banksImported:prepared.length,questionsImported:total};
  } finally {lock.releaseLock();}
}

function backupQuestionBanks_(data) {
 const actor=admin_(data),backupId=String(data.backupId||"").slice(0,120),banks=Array.isArray(data.banks)?data.banks:[];
 if(!backupId)throw new Error("Не указан идентификатор резервной копии.");
 if(!banks.length||banks.length>100)throw new Error("Передайте от 1 до 100 банков.");
 const keys={},prepared=[];
 banks.forEach(function(b){const courseId=String(b.courseId||""),bankId=String(b.bankId||"").slice(0,180),key=courseId+"|"+bankId;if(CFG.COURSES.indexOf(courseId)<0||!bankId)throw new Error("Некорректный банк: "+key);if(!keys[key]){keys[key]=true;prepared.push({courseId:courseId,bankId:bankId});}});
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
  const backup=ensureSheet_("QuestionBankBackup"),old=backup.getDataRange().getValues(),bm=headerMap_(backup),done={};
  for(let i=1;i<old.length;i++)if(String(old[i][bm.BackupId])===backupId)done[String(old[i][bm.CourseId])+"|"+String(old[i][bm.BankId])]=true;
  const sh=questionBank_(),values=sh.getDataRange().getValues(),m=headerMap_(sh),now=new Date().toISOString(),records=[];
  prepared.forEach(function(b){const key=b.courseId+"|"+b.bankId;if(done[key])return;let found=0;for(let i=1;i<values.length;i++)if(sameCourseId_(values[i][m.CourseId],b.courseId)&&String(values[i][m.BankId])===b.bankId){records.push([backupId,b.courseId,b.bankId,JSON.stringify(values[i]),now,actor.email]);found++;}if(!found)records.push([backupId,b.courseId,b.bankId,"",now,actor.email]);});
  if(records.length)backup.getRange(backup.getLastRow()+1,1,records.length,6).setValues(records);
  return {success:true,backupId:backupId,banksBackedUp:prepared.length,backupRows:records.length};
 }finally{lock.releaseLock();}
}
function restoreQuestionBanks_(data) {
 admin_(data);const backupId=String(data.backupId||"").slice(0,120);if(!backupId)throw new Error("Не указан идентификатор резервной копии.");
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
  const backup=ensureSheet_("QuestionBankBackup"),bv=backup.getDataRange().getValues(),bm=headerMap_(backup),groups={},order=[];
  for(let i=1;i<bv.length;i++)if(String(bv[i][bm.BackupId])===backupId){const courseId=String(bv[i][bm.CourseId]),bankId=String(bv[i][bm.BankId]),key=courseId+"|"+bankId;if(!groups[key]){groups[key]={courseId:courseId,bankId:bankId,rows:[]};order.push(key);}if(String(bv[i][bm.RowJSON]||""))groups[key].rows.push(JSON.parse(String(bv[i][bm.RowJSON])));}
  if(!order.length)throw new Error("Резервная копия не найдена: "+backupId);
  const sh=questionBank_(),values=sh.getDataRange().getValues(),m=headerMap_(sh),remove=[];
  for(let i=1;i<values.length;i++){for(let k=0;k<order.length;k++){const b=groups[order[k]];if(sameCourseId_(values[i][m.CourseId],b.courseId)&&String(values[i][m.BankId])===b.bankId){remove.push(i+1);break;}}}
  for(let end=remove.length-1;end>=0;){let start=end;while(start>0&&remove[start-1]===remove[start]-1)start--;sh.deleteRows(remove[start],end-start+1);end=start-1;}
  order.forEach(function(key){const rows=groups[key].rows;if(rows.length){rows.forEach(function(row){row[m.CourseId]=groups[key].courseId;});sh.getRange(sh.getLastRow()+1,1,rows.length,6).setValues(rows);}});
  CacheService.getScriptCache().remove("protectedQuestionBankMap:v1");return {success:true,banksRestored:order.length};
 }finally{lock.releaseLock();}
}

/** Полный ключ доступен только преподавателю своей дисциплины или администратору. */
function getQuestionBank_(data) {
  const courseId = String(data.courseId || ""), teacher = editor_(data, courseId);
  const bankId = String(data.bankId || ""), sh = questionBank_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
  const rows = vals.slice(1).filter(function(row) {
    return sameCourseId_(row[m.CourseId], courseId) && (!bankId || String(row[m.BankId]) === bankId);
  }).map(function(row) {
    let question = {};
    try { question = JSON.parse(String(row[m.QuestionJSON] || "{}")); } catch (e) {}
    return {bankId:String(row[m.BankId]||""),questionId:String(row[m.QuestionId]||""),question:question,updatedAt:String(row[m.UpdatedAt]||""),updatedBy:String(row[m.UpdatedBy]||"")};
  });
  return {success:true,courseId:courseId,questions:rows};
}


/* ---------- Server-delivered built-in tests ---------- */
function resolvedBuiltInBankIds_(courseId, bankIds) {
  if(bankIds.length && String(bankIds[0]).indexOf("self_")===0) {
    const first=builtInQuestions_(courseId,[bankIds[0]]);
    return first.length?[bankIds[0]]:bankIds.slice(1,2);
  }
  return bankIds;
}
function builtInQuestions_(courseId, bankIds) {
  const sh=questionBank_(), vals=sh.getDataRange().getValues(), m=headerMap_(sh), out=[], seen={};
  const wanted=(bankIds||[]).map(function(id){return String(id||"").trim();});
  const wantedCourse=String(courseId||"").trim();
  vals.slice(1).forEach(function(row) {
    const cid=String(row[m.CourseId]||"").trim(), bid=String(row[m.BankId]||"").trim();
    if(!sameCourseId_(row[m.CourseId], courseId)||wanted.indexOf(bid)===-1)return;
    let q={};try{q=JSON.parse(String(row[m.QuestionJSON]||"{}"));}catch(e){return;}
    const signature=String(q.type||"mc")+"|"+String(q.q||q.question||"");
    if(seen[signature])return;seen[signature]=true;
    out.push({bankId:bid,questionId:String(row[m.QuestionId]||""),questionIndex:out.length,question:q});
  });
  return out;
}
function safeBuiltInQuestion_(entry, optionMaps) {
  const q=Object.assign({},entry.question||{}),type=String(q.type||"mc").toLowerCase();
  ["correct","answer","correctAnswer","answers","explanation","solution","key","expectedAnswer","acceptedAnswers","correctOrder"].forEach(function(k){delete q[k];});
  if((type==="mc"||type==="single"||type==="single_select"||type==="choice"||type==="multi"||type==="multiple"||type==="multiple_choice"||type==="tf"||type==="true_false")&&Array.isArray(q.options)&&q.options.length>1){
    const order=shuffledServer_(q.options.map(function(_,i){return i;}));
    q.options=order.map(function(i){return q.options[i];});
    optionMaps[String(entry.questionIndex)]=order;
  }
  if(type==="order"||type==="ordering")q.items=shuffledServer_(q.items||[]);
  if(type==="match"||type==="matching"){
    const pairs=q.pairs||[],right=shuffledServer_(pairs.map(function(pair){return pair.right;}));
    q.options=right;q.pairs=pairs.map(function(pair){return {left:pair.left};});
  }
  if((type==="tf"||type==="true_false")&&!Array.isArray(q.options))q.options=["Верно","Неверно"];
  return {bankId:entry.bankId,questionId:entry.questionId,questionIndex:entry.questionIndex,question:q};
}

function getBuiltInTest_(data) {
  const user=auth_(data),courseId=String(data.courseId||""),testId=String(data.testId||"");
  const bankIds=Array.isArray(data.bankIds)?data.bankIds.map(String).slice(0,10):[];
  if(user.role!=="student"||!courseId||!testId||!bankIds.length||!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к тесту.");
  const policy=settingValue_("testAttempts:"+user.email+":"+courseId+":"+testId);
  const limit=policy===""?1:1+Math.max(0,Number(policy)||0);
  const used=results_().getDataRange().getValues().slice(1).filter(function(row){return email_(row[0])===user.email&&String(row[3])===testId&&sameCourseId_(row[12]||courseId,courseId);}).length;
  if(used>=limit)throw new Error("Работа уже завершена ("+used+" из "+limit+"). Повторное прохождение закрыто. Если нужна дополнительная попытка, обратитесь к преподавателю.");
  const resolvedIds=resolvedBuiltInBankIds_(courseId,bankIds),entries=builtInQuestions_(courseId,resolvedIds);
  if(!entries.length){
    const sh=questionBank_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh),available=[];
    vals.slice(1).forEach(function(row){
      if(sameCourseId_(row[m.CourseId],courseId)){
        const id=String(row[m.BankId]||"").trim();if(id&&available.indexOf(id)<0)available.push(id);
      }
    });
    return {success:false,notImported:true,courseId:courseId,testId:testId,requestedBankIds:bankIds,resolvedBankIds:resolvedIds,availableBankIds:available.slice(0,150),questions:[]};
  }
  const attemptId=Utilities.getUuid().replace(/-/g,""),optionMaps={};
  const questions=entries.map(function(entry){return safeBuiltInQuestion_(entry,optionMaps);});
  CacheService.getScriptCache().put("builtInAttempt:"+attemptId,JSON.stringify({email:user.email,courseId:courseId,testId:testId,bankIds:resolvedIds,optionMaps:optionMaps}),3600);
  return {success:true,courseId:courseId,testId:testId,bankIds:resolvedIds,attemptId:attemptId,questions:questions};
}

function sameAnswer_(a,b) { return JSON.stringify(a)===JSON.stringify(b); }
function scoreBuiltInQuestion_(q,answer) {
  const type=String(q.type||"mc").toLowerCase();
  let expected=q.correct!==undefined?q.correct:(q.correctAnswer!==undefined?q.correctAnswer:(q.answers!==undefined?q.answers:q.answer));
  if(type==="tf"||type==="true_false"){
    if(expected===undefined||expected===null)return false;
    let target;
    if(typeof expected==="boolean")target=expected?0:1;
    else if(typeof expected==="string"&&Array.isArray(q.options)&&q.options.indexOf(expected)>=0)target=q.options.indexOf(expected);
    else target=Number(expected);
    return Number(answer)===target;
  }
  if(type==="multi"||type==="multiple"||type==="multiple_choice"||Array.isArray(expected)){
    if(!Array.isArray(answer)||!Array.isArray(expected))return false;
    if(expected.length&&typeof expected[0]==="string"&&q.options)expected=expected.map(function(value){const index=q.options.indexOf(value);return index<0?value:index;});
    return sameAnswer_(answer.map(String).sort(),expected.map(String).sort());
  }
  if(type==="num"||type==="numeric"||type==="number"){
    if(expected===undefined||expected===null)return false;
    const actual=Number(String(answer).replace(",", ".")),target=Number(String(expected).replace(",", "."));
    if(!isFinite(actual)||!isFinite(target))return false;
    const tolerance=Math.max(0,Number(q.tolerance!==undefined?q.tolerance:q.tol)||0.01);
    return Math.abs(actual-target)<=tolerance;
  }
  if(type==="order"||type==="ordering"){
    expected=q.correctOrder||q.correct||q.answer||q.items||[];
    return Array.isArray(answer)&&Array.isArray(expected)&&expected.length===answer.length&&sameAnswer_(answer.map(String),expected.map(String));
  }
  if(type==="match"||type==="matching"){
    if(Array.isArray(q.pairs)&&q.pairs.length&&Array.isArray(answer))return answer.length===q.pairs.length&&q.pairs.every(function(pair,index){return String(answer[index])===String(pair.right);});
    return Array.isArray(answer)&&Array.isArray(expected)&&sameAnswer_(answer.map(String),expected.map(String));
  }
  if(expected===undefined||expected===null)return false;
  if(typeof expected==="string"&&Array.isArray(q.options)&&q.options.indexOf(expected)>=0)return Number(answer)===q.options.indexOf(expected);
  return String(answer)===String(expected);
}
function submitBuiltInTest_(data) {
  const user=auth_(data),courseId=String(data.courseId||""),testId=String(data.testId||"");
  const bankIds=Array.isArray(data.bankIds)?data.bankIds.map(String).slice(0,10):[];
  const answers=Array.isArray(data.answers)?data.answers:[];
  const attemptId=String(data.attemptId||"").trim();
  if(user.role!=="student"||!courseId||!testId||!bankIds.length||!attemptId||!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к тесту или обновите страницу и начните попытку заново.");
  const cache=CacheService.getScriptCache(),attemptRaw=cache.get("builtInAttempt:"+attemptId);
  if(!attemptRaw)throw new Error("Попытка тестирования истекла. Обновите страницу и начните тест заново.");
  const attempt=JSON.parse(attemptRaw);
  if(attempt.email!==user.email||attempt.courseId!==courseId||attempt.testId!==testId)throw new Error("Попытка не принадлежит этой учётной записи или тесту.");
  const resolvedIds=resolvedBuiltInBankIds_(courseId,bankIds);
  if(JSON.stringify(attempt.bankIds)!==JSON.stringify(resolvedIds))throw new Error("Состав банка изменился. Обновите страницу и начните тест заново.");
  const entries=builtInQuestions_(courseId,resolvedIds);
  if(!entries.length)throw new Error("Серверный банк не найден. Обратитесь к преподавателю.");
  if(answers.length!==entries.length)throw new Error("Количество ответов не совпадает с количеством вопросов.");
  const rawScore=entries.reduce(function(total,entry,index){
    const order=attempt.optionMaps&&attempt.optionMaps[String(index)];
    let answer=answers[index];
    if(Array.isArray(order)){
      if(Array.isArray(answer))answer=answer.map(function(value){const pos=Number(value);return Number.isInteger(pos)&&pos>=0&&pos<order.length?order[pos]:value;});
      else{const pos=Number(answer);if(Number.isInteger(pos)&&pos>=0&&pos<order.length)answer=order[pos];}
    }
    return total+(scoreBuiltInQuestion_(entry.question,answer)?1:0);
  },0);
  const rawPercent=Math.round(rawScore/entries.length*100),lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    const sh=results_(),rows=sh.getDataRange().getValues();
    const prior=rows.slice(1).filter(function(row){return email_(row[0])===user.email&&String(row[3])===testId&&sameCourseId_(row[12]||courseId,courseId);}).length;
    const raw=settingValue_("testAttempts:"+user.email+":"+courseId+":"+testId);
    const limit=raw===""?1:1+Math.max(0,Number(raw)||0);
    if(prior>=limit)throw new Error("Работа уже завершена ("+prior+" из "+limit+"). Повторное прохождение закрыто. Если нужна дополнительная попытка, обратитесь к преподавателю.");
    const attemptNo=prior+1,policy=proctorPenalty_(user.email,courseId,testId,attemptNo);
    const percent=Math.max(0,rawPercent-policy.penaltyPoints),grade=gradeFromPercent_(percent),score=rawScore; // Показываем фактически верные ответы; штраф влияет на процент и оценку, но не меняет счётчик правильных ответов.
    appendMappedRecord_(sh,{Email:user.email,Name:user.name,Group:user.group,TestId:testId,TestTitle:String(data.testTitle||testId),Grade:grade,Score:score,MaxScore:entries.length,Percent:percent,TimeSpent:Math.max(0,Number(data.timeSpent)||0),Attempts:attemptNo,FinishedAt:new Date().toISOString(),CourseId:courseId,Submission:JSON.stringify({answers:answers}).slice(0,10000),PenaltyPoints:policy.penaltyPoints,ViolationCount:policy.violationCount});
    appendAttemptAudit_({EventType:"attempt_submitted",ActorEmail:user.email,StudentEmail:user.email,StudentName:user.name,Group:user.group,CourseId:courseId,TestId:testId,TestTitle:String(data.testTitle||testId),AttemptNo:attemptNo,Grade:grade,Score:score,MaxScore:entries.length,Percent:percent});
    cache.remove("builtInAttempt:"+attemptId);
    return {success:true,score:score,rawScore:rawScore,maxScore:entries.length,percent:percent,rawPercent:rawPercent,grade:grade,attempts:attemptNo,penaltyPoints:policy.penaltyPoints,violationCount:policy.violationCount};
  }finally{lock.releaseLock();}
}

function shuffledServer_(items) {
  const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;
}
function allFinalExamEntries_(courseId) {
  const sh=questionBank_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh),out=[],seen={};
  vals.slice(1).forEach(function(row){
    if(!sameCourseId_(row[m.CourseId], courseId))return;
    const bid=String(row[m.BankId]||"").trim();
    if(!/^exam_(primary|extra)$/.test(bid)&&bid!=="mdk_extra"&&!/^topic_|^hard_|^self_/.test(bid))return;
    let q={};try{q=JSON.parse(String(row[m.QuestionJSON]||"{}"));}catch(e){return;}
    // Встроенные тесты допускают оба поля формулировки: q и question.
    // Итоговый экзамен должен читать те же записи, иначе банк есть, но экзамен считает его пустым.
    const prompt=String(q&&(q.q||q.question)||"").trim();
    if(!q||!prompt)return;
    if(!q.q)q.q=prompt;
    const sig=String(q.type||"mc")+"|"+prompt;if(seen[sig])return;seen[sig]=true;
    out.push({bankId:bid,questionId:String(row[m.QuestionId]||""),question:q});
  });return out;
}
function finalQuestionType_(question) {
  const type=String(question&&question.type||"mc").toLowerCase();
  if(type==="multi"||type==="multiple"||type==="multiple_choice")return "multi";
  if(type==="num"||type==="numeric"||type==="number")return "num";
  if(type==="order"||type==="ordering")return "order";
  if(type==="match"||type==="matching")return "match";
  if(type==="tf"||type==="true_false")return "tf";
  return "mc";
}
function safeFinalExamQuestion_(entry,index,optionMaps) {
  const q=Object.assign({},entry.question||{}),type=finalQuestionType_(q);
  q.type=type;
  ["correct","answer","correctAnswer","answers","explanation","solution","key","expectedAnswer","acceptedAnswers","correctOrder"].forEach(function(k){delete q[k];});
  if(type==="order")q.items=shuffledServer_(q.items||[]);
  if(type==="tf"&&!Array.isArray(q.options))q.options=["Верно","Неверно"];
  if((type==="mc"||type==="multi"||type==="tf")&&Array.isArray(q.options)&&q.options.length>1){
    const order=shuffledServer_(q.options.map(function(_,i){return i;}));
    q.options=order.map(function(i){return q.options[i];});
    optionMaps[String(index)]=order;
  }
  if(type==="match"){const pairs=q.pairs||[],right=shuffledServer_(pairs.map(function(p){return p.right;}));q.options=right;q.pairs=pairs.map(function(p){return {left:p.left};});}
  return {questionId:entry.questionId,questionIndex:index,question:q};
}
function getFinalExam_(data) {
  const user=auth_(data),courseId=String(data.courseId||""),testId="__final__"+courseId;
  if(user.role!=="student"||!courseId||!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к экзамену.");
  const rows=results_().getDataRange().getValues(),prior=rows.slice(1).filter(function(row){return email_(row[0])===user.email&&String(row[3])===testId&&sameCourseId_(row[12]||courseId,courseId);}).length;
  const raw=settingValue_("testAttempts:"+user.email+":"+courseId+":"+testId);
  const attemptLimit=raw===""?1:1+Math.max(0,Number(raw)||0);
  if(prior>=attemptLimit)throw new Error("Экзамен уже завершён. Повторное прохождение закрыто. Для дополнительной попытки обратитесь к преподавателю.");
  const bank=allFinalExamEntries_(courseId);if(!bank.length){
    const sh=questionBank_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh),available=[];
    vals.slice(1).forEach(function(row){
      if(sameCourseId_(row[m.CourseId], courseId)){
        const id=String(row[m.BankId]||"").trim();if(id&&available.indexOf(id)<0)available.push(id);
      }
    });
    return {success:false,notImported:true,courseId:courseId,availableBankIds:available.slice(0,150),questions:[]};
  }
  const target=45;
  if(bank.length<target)throw new Error("Для экзамена требуется 45 уникальных заданий с автоматической проверкой; в защищённом банке найдено "+bank.length+".");
  let selected=[];
  [["multi",10],["order",7],["match",7],["num",5],["tf",2]].forEach(function(rule){
    selected=selected.concat(shuffledServer_(bank.filter(function(e){return finalQuestionType_(e.question)===rule[0]&&selected.indexOf(e)===-1;})).slice(0,rule[1]));
  });
  // Усложнённый состав: после заданий разных форматов добавляем материалы из hard_/self_ банков.
  const advanced=shuffledServer_(bank.filter(function(e){return /^(hard_|self_)/i.test(String(e.bankId||""))&&selected.indexOf(e)===-1;}));
  selected=selected.concat(advanced.slice(0,Math.max(0,target-selected.length)));
  const rest=shuffledServer_(bank.filter(function(e){return selected.indexOf(e)===-1;}));
  selected=shuffledServer_(selected.concat(rest.slice(0,Math.max(0,target-selected.length))));
  if(selected.length!==target)throw new Error("Не удалось сформировать полный вариант из 45 уникальных заданий.");
  const optionMaps={},examId=Utilities.getUuid(),safeQuestions=selected.map(function(entry,index){return safeFinalExamQuestion_(entry,index,optionMaps);});
  CacheService.getScriptCache().put("finalExam:"+examId,JSON.stringify({email:user.email,courseId:courseId,questions:selected.map(function(e){return e.question;}),optionMaps:optionMaps}),7200);
  return {success:true,examId:examId,questions:safeQuestions};
}
function scoreFinalAnswer_(q,answer) {
  const type=finalQuestionType_(q||{});
  if(type==="tf"){
    const expected=q.correct!==undefined?q.correct:(q.correctAnswer!==undefined?q.correctAnswer:q.answer);
    if(expected===undefined||expected===null)return 0;
    let target;
    if(typeof expected==="boolean")target=expected?0:1;
    else if(typeof expected==="string"&&Array.isArray(q.options)&&q.options.indexOf(expected)>=0)target=q.options.indexOf(expected);
    else target=Number(expected);
    return Number(answer)===target?1:0;
  }
  if(type==="num"){
    const expected=q.answer!==undefined?q.answer:(q.correct!==undefined?q.correct:q.correctAnswer);
    const a=Number(String(answer).replace(",", ".")),b=Number(String(expected).replace(",", "."));
    const tolerance=Math.max(0,Number(q.tol!==undefined?q.tol:q.tolerance)||0.01);
    return isFinite(a)&&isFinite(b)&&Math.abs(a-b)<=tolerance?1:0;
  }
  if(type==="multi"){
    let expected=q.correct!==undefined?q.correct:(q.correctAnswer!==undefined?q.correctAnswer:(q.answers!==undefined?q.answers:q.answer));
    if(!Array.isArray(answer)||!Array.isArray(expected))return 0;
    if(expected.length&&typeof expected[0]==="string"&&q.options&&q.options.length)expected=expected.map(function(value){const index=q.options.indexOf(value);return index<0?value:index;});
    const a=answer.map(String).sort(),b=expected.map(String).sort();
    return a.length===b.length&&a.every(function(value,index){return value===b[index];})?1:0;
  }
  if(type==="order"){
    const expected=q.correctOrder||q.correct||q.answer||q.items||[];
    if(!Array.isArray(answer)||!Array.isArray(expected)||!expected.length)return 0;
    const right=answer.filter(function(value,index){return String(value)===String(expected[index]);}).length;
    return right/expected.length;
  }
  if(type==="match"){
    const pairs=q.pairs||[];
    if(Array.isArray(answer)&&pairs.length)return pairs.filter(function(pair,index){return String(answer[index])===String(pair.right);}).length/pairs.length;
    const expected=q.correct!==undefined?q.correct:(q.correctAnswer!==undefined?q.correctAnswer:q.answer);
    if(!Array.isArray(answer)||!Array.isArray(expected)||!expected.length)return 0;
    return answer.filter(function(value,index){return String(value)===String(expected[index]);}).length/expected.length;
  }
  const expected=q.correct!==undefined?q.correct:(q.correctAnswer!==undefined?q.correctAnswer:q.answer);
  if(typeof expected==="string"&&q.options&&q.options.indexOf(expected)>=0)return Number(answer)===q.options.indexOf(expected)?1:0;
  return Number(answer)===Number(expected)?1:0;
}
function submitFinalExam_(data) {
  const user=auth_(data),examId=String(data.examId||""),courseId=String(data.courseId||"");
  if(user.role!=="student"||!examId||!courseId||!hasCourseAccess_(user,courseId))throw new Error("Нет доступа к отправке экзамена.");
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const cache=CacheService.getScriptCache(),cacheKey="finalExam:"+examId,raw=cache.get(cacheKey);
    if(!raw)throw new Error("Время экзамена истекло или экзамен уже отправлен. Начните попытку заново.");
    const exam=JSON.parse(raw);
    if(exam.email!==user.email||exam.courseId!==courseId)throw new Error("Экзамен не принадлежит этой учётной записи.");
    if(!Array.isArray(exam.questions)||!exam.questions.length)throw new Error("Экзаменационный вариант повреждён. Начните попытку заново.");
    const answers=Array.isArray(data.answers)?data.answers:[];
    if(answers.length!==exam.questions.length)throw new Error("Количество ответов не совпадает с количеством вопросов.");
    let points=0;
    exam.questions.forEach(function(q,i){
      let answer=answers[i];const order=exam.optionMaps&&exam.optionMaps[String(i)];
      if(Array.isArray(order)){
        if(Array.isArray(answer))answer=answer.map(function(value){const pos=Number(value);return Number.isInteger(pos)&&pos>=0&&pos<order.length?order[pos]:value;});
        else{const pos=Number(answer);if(Number.isInteger(pos)&&pos>=0&&pos<order.length)answer=order[pos];}
      }
      points+=scoreFinalAnswer_(q,answer);
    });
    const max=exam.questions.length,pct=Math.round(points/max*100),testId="__final__"+courseId,sh=results_(),rows=sh.getDataRange().getValues();
    const prior=rows.slice(1).filter(function(row){return email_(row[0])===user.email&&String(row[3])===testId&&sameCourseId_(row[12]||courseId,courseId);}).length;
    const limitRaw=settingValue_("testAttempts:"+user.email+":"+courseId+":"+testId);
    const attemptLimit=limitRaw===""?1:1+Math.max(0,Number(limitRaw)||0);
    if(prior>=attemptLimit)throw new Error("Экзамен уже завершён. Повторное прохождение закрыто. Для дополнительной попытки обратитесь к преподавателю.");
    const attemptNo=prior+1,policy=proctorPenalty_(user.email,courseId,testId,attemptNo),adjusted=Math.max(0,pct-policy.penaltyPoints),grade=gradeFromPercent_(adjusted);
    const writtenSubmission="";
    appendMappedRecord_(sh,{Email:user.email,Name:user.name,Group:user.group,TestId:testId,TestTitle:"Итоговый экзамен "+courseId,Grade:grade,Score:Math.round(points*100)/100,MaxScore:max,Percent:adjusted,TimeSpent:Math.max(0,Math.min(5400,Number(data.timeSpent)||0)),Attempts:attemptNo,FinishedAt:new Date().toISOString(),CourseId:courseId,Submission:writtenSubmission.slice(0,25000),PenaltyPoints:policy.penaltyPoints,ViolationCount:policy.violationCount});
    appendAttemptAudit_({EventType:"final_exam_submitted",ActorEmail:user.email,StudentEmail:user.email,StudentName:user.name,Group:user.group,CourseId:courseId,TestId:testId,TestTitle:"Итоговый экзамен "+courseId,AttemptNo:attemptNo,Grade:grade,Score:Math.round(points*100)/100,MaxScore:max,Percent:adjusted});
    cache.remove(cacheKey);
    return {success:true,score:Math.round(points*100)/100,maxScore:max,rawPercent:pct,percent:adjusted,grade:grade,penaltyPoints:policy.penaltyPoints,attempts:attemptNo};
  } finally { lock.releaseLock(); }
}

function submitCustomTest_(data) {
  const user = auth_(data);
  if (user.role !== "student") throw new Error("Отправлять ответы могут только студенты.");
  const id = String(data.testId || data.id || "");
  if (!id) throw new Error("Не указан тест.");
  const values = content_().getDataRange().getValues();
  let record = null;
  values.slice(1).forEach(function (row) {
    if (String(row[0]) === id && String(row[3]) === "test") record = {
      id: id, courseId: normalizeCourseId_(row[1] || ""), topicId: String(row[2] || ""), type: "test",
      title: String(row[4] || ""), payload: JSON.parse(row[5] || "{}")
    };
  });
  if (!record) throw new Error("Тест не найден.");
  if (!hasCourseAccess_(user, record.courseId)) throw new Error("Нет доступа к этой дисциплине.");
  if (!customContentIsOpen_(record.courseId, record.id, record.topicId, record.type)) throw new Error("Этот тест закрыт преподавателем.");
  const attemptKey="custom_"+id;
  const questions = Array.isArray(record.payload.questions) ? record.payload.questions : [];
  const answers = Array.isArray(data.answers) ? data.answers : [];
  if (!questions.length || answers.length !== questions.length) throw new Error("Ответьте на все вопросы теста.");
  let score = 0;
  questions.forEach(function (q, i) {
    const selected = Number(answers[i]);
    if (Number.isInteger(selected) && selected === Number(q.correct)) score++;
  });
  const percent = Math.round(score / questions.length * 100);
  const grade = percent >= 90 ? 5 : percent >= 75 ? 4 : percent >= 60 ? 3 : 2;
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  let attemptNo=0;
  try {
    const resultSheet=results_(), resultRows=resultSheet.getDataRange().getValues();
    const prior=resultRows.slice(1).filter(function(r){return email_(r[0])===user.email&&String(r[3])===attemptKey;}).length;
    const scopedExtra=settingValue_("testAttempts:"+user.email+":"+record.courseId+":"+id);
    const extra=Number(scopedExtra!==""?scopedExtra:settingValue_("testAttempts:"+user.email+":"+id))||0;
    const limit=1+Math.max(0,extra);
    if(prior>=limit) throw new Error("Попытки закончились ("+prior+" из "+limit+"). Обратитесь к преподавателю за дополнительной попыткой.");
    attemptNo=prior+1;
    const policy=proctorPenalty_(user.email,record.courseId,attemptKey,attemptNo),finalPercent=Math.max(0,percent-policy.penaltyPoints),finalGrade=gradeFromPercent_(finalPercent),finalScore=Math.round(questions.length*finalPercent)/100;
    appendMappedRecord_(resultSheet,{Email:user.email,Name:user.name,Group:user.group,TestId:attemptKey,TestTitle:record.title,Grade:finalGrade,Score:finalScore,MaxScore:questions.length,Percent:finalPercent,TimeSpent:Math.max(0,Number(data.timeSpent)||0),Attempts:attemptNo,FinishedAt:new Date().toISOString(),CourseId:record.courseId,Submission:JSON.stringify({answers:answers.map(function(v){return Number(v);})}),PenaltyPoints:policy.penaltyPoints,ViolationCount:policy.violationCount});
    appendAttemptAudit_({EventType:"attempt_submitted",ActorEmail:user.email,StudentEmail:user.email,StudentName:user.name,Group:user.group,CourseId:record.courseId,TestId:attemptKey,TestTitle:record.title,AttemptNo:attemptNo,Grade:finalGrade,Score:finalScore,MaxScore:questions.length,Percent:finalPercent});
  } finally { lock.releaseLock(); }
  const finalPolicy=proctorPenalty_(user.email,record.courseId,attemptKey,attemptNo),finalPercent=Math.max(0,percent-finalPolicy.penaltyPoints),finalGrade=gradeFromPercent_(finalPercent),finalScore=Math.round(questions.length*finalPercent)/100;
  return { success: true, score: finalScore, rawScore:score, maxScore: questions.length, percent: finalPercent, rawPercent:percent, grade: finalGrade, attempts: attemptNo, penaltyPoints:finalPolicy.penaltyPoints, violationCount:finalPolicy.violationCount };
}

function getGameAnswer_(data) {
  const user = auth_(data);
  const id = String(data.gameId || data.id || "");
  const ci = Number(data.categoryIndex), qi = Number(data.questionIndex);
  if (!id || !Number.isInteger(ci) || !Number.isInteger(qi) || ci < 0 || qi < 0) throw new Error("Некорректный запрос ответа.");
  const values = content_().getDataRange().getValues();
  let record = null;
  values.slice(1).forEach(function(row) { if (String(row[0]) === id && String(row[3]) === "game") record = {id:id,courseId:normalizeCourseId_(row[1]||""),topicId:String(row[2]||""),type:"game",payload:JSON.parse(row[5]||"{}")}; });
  if (!record) throw new Error("Игра не найдена.");
  if (!hasCourseAccess_(user, record.courseId)) throw new Error("Нет доступа к этой дисциплине.");
  if (!customContentIsOpen_(record.courseId, record.id, record.topicId, record.type)) throw new Error("Эта игра закрыта преподавателем.");
  const cats = Array.isArray(record.payload.categories) ? record.payload.categories : [];
  const cat = cats[ci], q = cat && Array.isArray(cat.questions) ? cat.questions[qi] : null;
  if (!q) throw new Error("Вопрос не найден.");
  return {success:true, answer:String(q.a || q.answer || "")};
}
function saveCustomContent_(data) {
  const courseId = String(data.mdkId || data.courseId || "");
  if (!courseId) throw new Error("Не указана дисциплина.");
  const id = String(data.id || Utilities.getUuid());
  const type = String(data.type || "");
  if (["topic", "lecture", "test", "flashcards", "file", "announcement", "game"].indexOf(type) === -1) {
    throw new Error("Допустимые типы материалов: topic, lecture, test, flashcards, file, announcement, game.");
  }

  // Serialize the read/modify/write sequence: simultaneous saves with the same
  // ID must update one row rather than append duplicate records.
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // Re-check the caller's current role and course permissions after acquiring
    // the lock, immediately before touching the content sheet.
    const user = editor_(data, courseId);
    const sheet = content_();
    const values = sheet.getDataRange().getValues();
    let targetRow = 0;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === id) {
        if (!sameCourseId_(values[i][1], courseId) && user.role !== "admin") {
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
  } finally {
    lock.releaseLock();
  }
}

function deleteCustomContent_(data) {
  auth_(data);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = content_();
    const values = sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(data.id || "")) {
        editor_(data, normalizeCourseId_(values[i][1] || ""));
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: "Материал не найден." };
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Administrator: roles and course permissions ---------- */

function setTeacherCourses_(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // Serialize permission changes with custom-content writes. Re-check the
    // administrator session after acquiring the same script-wide lock.
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
  } finally {
    lock.releaseLock();
  }
}

function setUserRole_(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // Role changes must use the same lock as content writes so a permission
    // update cannot race the editor authorization check.
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
  } finally {
    lock.releaseLock();
  }
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


/* ---------- Administrator: create and delete portal accounts ---------- */
function adminCreateUser_(data) {
  admin_(data);
  const email = email_(data.email), password = String(data.password || "");
  const name = String(data.name || "").trim(), group = String(data.group || "").trim();
  const role = String(data.role || "student").toLowerCase();
  if (!email || email.indexOf("@") < 1) throw new Error("Укажите корректный email.");
  if (password.length < 8) throw new Error("Временный пароль должен содержать не менее 8 символов.");
  if (!name) throw new Error("Укажите имя пользователя.");
  if (["student", "teacher", "admin"].indexOf(role) === -1) throw new Error("Недопустимая роль.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (userByEmail_(email)) throw new Error("Пользователь с таким email уже существует.");
    const salt = Utilities.getUuid() + Utilities.getUuid(), sheet = users_(), map = headerMap_(sheet);
    const row = new Array(sheet.getLastColumn()).fill("");
    const values = {Email:email,PasswordHash:passwordHash_(password,salt),Name:name,Group:group,Role:role,
      UpdatedAt:new Date().toISOString(),Courses:role==="admin"?"*":"",Payload:"",PasswordSalt:salt};
    Object.keys(values).forEach(function(key){if(map[key]!==undefined)row[map[key]]=values[key];});
    sheet.appendRow(row);
    return {success:true,email:email,role:role};
  } finally { lock.releaseLock(); }
}

function adminDeleteUser_(data) {
  const actor = admin_(data), targetEmail = email_(data.email);
  if (!targetEmail) throw new Error("Не указан email пользователя.");
  if (targetEmail === actor.email) throw new Error("Нельзя удалить собственную учётную запись администратора.");
  const target = userByEmail_(targetEmail);
  if (!target) throw new Error("Пользователь не найден.");
  if (target.role === "admin") {
    const sheet=users_(), values=sheet.getDataRange().getValues(), map=headerMap_(sheet);
    const count=values.slice(1).filter(function(row){return email_(row[map.Email])&&String(row[map.Role]).toLowerCase()==="admin";}).length;
    if(count<=1)throw new Error("Нельзя удалить последнего администратора.");
  }
  // История тестов не удаляется: удаляется только учётная запись из Users.
  users_().deleteRow(target.row);
  return {success:true,email:targetEmail,historyPreserved:true};
}

/* ---------- Student course access and teacher invitations ---------- */
function setStudentCourses_(data){const actor=auth_(data),target=userByEmail_(data.email);if(!target||target.role!=='student')throw new Error('Учащийся не найден.');if(actor.role!=='admin'&&actor.role!=='teacher')throw new Error('Недостаточно прав.');const requested=Array.isArray(data.courses)?data.courses.map(String):[];const allowed=actor.role==='admin'?CFG.COURSES:actor.courses.split(',').filter(Boolean);requested.forEach(id=>{if(allowed.indexOf(id)<0)throw new Error('Нельзя назначить дисциплину вне ваших полномочий: '+id);});let finalCourses=requested;if(actor.role==='teacher'){const other=target.courses.split(',').filter(Boolean).filter(id=>allowed.indexOf(id)<0);finalCourses=other.concat(requested.filter(id=>other.indexOf(id)<0));}writeUserFields_(target,{Courses:finalCourses.join(','),UpdatedAt:new Date().toISOString()});return {success:true,courses:finalCourses};}
function createInvite_(data){const actor=auth_(data);if(actor.role!=='admin'&&actor.role!=='teacher')throw new Error('Создавать приглашения могут только преподаватели и администраторы.');const requested=Array.isArray(data.courses)?data.courses.map(String):[];const allowed=actor.role==='admin'?CFG.COURSES:actor.courses.split(',').filter(Boolean);const courses=requested.filter((id,i)=>allowed.indexOf(id)>=0&&requested.indexOf(id)===i);if(!courses.length||courses.length!==requested.length)throw new Error('Выберите дисциплины только из доступных вам.');const days=Math.min(90,Math.max(1,Number(data.days)||30)),maxUses=Math.min(500,Math.max(1,Number(data.maxUses)||50)),code=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');const now=new Date(),expires=new Date(now.getTime()+days*86400000);invites_().appendRow([code,courses.join(','),actor.email,now.toISOString(),expires.toISOString(),maxUses,0,true]);return {success:true,code:code,courses:courses,expiresAt:expires.toISOString(),maxUses:maxUses};}
function getInvites_(data){const actor=auth_(data);if(actor.role!=='admin'&&actor.role!=='teacher')throw new Error('Недостаточно прав.');const sh=invites_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);const invites=vals.slice(1).filter(r=>actor.role==='admin'||email_(r[m.CreatedBy])===actor.email).map(r=>({code:String(r[m.Code]),courses:String(r[m.Courses]),createdAt:r[m.CreatedAt],expiresAt:r[m.ExpiresAt],maxUses:Number(r[m.MaxUses]),uses:Number(r[m.Uses]),active:String(r[m.Active]).toLowerCase()!=='false'}));return {success:true,invites:invites};}
function deactivateInvite_(data){const actor=auth_(data);if(actor.role!=='admin'&&actor.role!=='teacher')throw new Error('Недостаточно прав.');const sh=invites_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);for(let i=1;i<vals.length;i++)if(String(vals[i][m.Code])===String(data.code||'')){if(actor.role!=='admin'&&email_(vals[i][m.CreatedBy])!==actor.email)throw new Error('Это приглашение создано другим преподавателем.');sh.getRange(i+1,m.Active+1).setValue(false);return {success:true};}throw new Error('Приглашение не найдено.');}

/* ---------- Account security: monthly credential changes and admin recovery ---------- */
function verifyPassword_(user, password) {
  return user.passwordSalt
    ? user.passwordHash === passwordHash_(password, user.passwordSalt)
    : user.passwordHash === legacyPasswordHash_(password);
}
function changeCredentials_(data) {
  const user = auth_(data), oldPassword = String(data.oldPassword || "");
  if (!verifyPassword_(user, oldPassword)) throw new Error("Текущий пароль указан неверно.");
  const newEmail = data.newEmail !== undefined ? email_(data.newEmail) : user.email;
  const newPassword = String(data.newPassword || "");
  const now = new Date(), lock = LockService.getScriptLock();
  if (newEmail && newEmail !== user.email && newEmail.indexOf("@") < 1) throw new Error("Укажите корректный новый логин (email).");
  if (newPassword && newPassword.length < 8) throw new Error("Новый пароль должен содержать не менее 8 символов.");
  if (newEmail === user.email && !newPassword) throw new Error("Укажите новый логин или новый пароль.");
  lock.waitLock(10000);
  try {
    const fresh = userByEmail_(user.email);
    if (newEmail !== user.email) {
      if (userByEmail_(newEmail)) throw new Error("Этот логин уже занят.");
      const lastLogin = fresh.loginChangedAt ? new Date(fresh.loginChangedAt).getTime() : 0;
      if (lastLogin && now.getTime() - lastLogin < 30 * 86400000) {
        const left = Math.ceil((30 * 86400000 - (now.getTime() - lastLogin)) / 86400000);
        throw new Error("Логин можно менять один раз в 30 дней. Осталось дней: " + left + ".");
      }
    }
    if (newPassword) {
      const lastPassword = fresh.passwordChangedAt ? new Date(fresh.passwordChangedAt).getTime() : 0;
      if (lastPassword && now.getTime() - lastPassword < 30 * 86400000) {
        const left = Math.ceil((30 * 86400000 - (now.getTime() - lastPassword)) / 86400000);
        throw new Error("Пароль можно менять один раз в 30 дней. Осталось дней: " + left + ".");
      }
    }
    const fields = {};
    if (newEmail !== user.email) fields.Email = newEmail;
    if (newEmail !== user.email) fields.LoginChangedAt = now.toISOString();
    if (newPassword) {
      const salt = Utilities.getUuid() + Utilities.getUuid();
      fields.PasswordSalt = salt;
      fields.PasswordHash = passwordHash_(newPassword, salt);
      fields.PasswordChangedAt = now.toISOString();
    }
    fields.UpdatedAt = now.toISOString();
    writeUserFields_(fresh, fields);
    if (newEmail !== user.email) {
      const sh = results_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
      for (let i = 1; i < vals.length; i++) if (email_(vals[i][m.Email]) === user.email) sh.getRange(i + 1, m.Email + 1).setValue(newEmail);
      if (data.token) CacheService.getScriptCache().put(CFG.SESSION_PREFIX + String(data.token), newEmail, CFG.SESSION_TTL);
    }
    return { success: true, email: newEmail, loginChangedAt: fields.LoginChangedAt || fresh.loginChangedAt || "", passwordChangedAt: fields.PasswordChangedAt || fresh.passwordChangedAt || "" };
  } finally { lock.releaseLock(); }
}
function requestPasswordReset_(data) {
  const email = email_(data.email), note = String(data.note || "").slice(0, 500);
  if (!email || email.indexOf("@") < 1) throw new Error("Укажите email, указанный при регистрации.");
  const user = userByEmail_(email);
  // Не раскрываем наличие аккаунта: ответ одинаковый для существующего и неизвестного адреса.
  if (user) {
    const sh = passwordRequests_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
    const recent = vals.slice(1).some(r => email_(r[m.Email]) === email && new Date(r[m.RequestedAt]).getTime() > Date.now() - 86400000 && String(r[m.Status]).toLowerCase() === "pending");
    if (!recent) sh.appendRow([Utilities.getUuid(), email, new Date().toISOString(), "pending", note, "", ""]);
  }
  return { success: true, message: "Если учётная запись существует, запрос отправлен администратору." };
}
function getPasswordRequests_(data) {
  admin_(data);
  const sh = passwordRequests_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
  const requests = vals.slice(1).filter(r => String(r[m.Status]).toLowerCase() === "pending").map(r => ({
    id: String(r[m.Id]), email: String(r[m.Email]), requestedAt: r[m.RequestedAt], note: String(r[m.Note] || "")
  }));
  return { success: true, requests: requests };
}
function resolvePasswordReset_(data) {
  const actor = admin_(data), id = String(data.id || ""), password = String(data.temporaryPassword || "");
  if (password.length < 8) throw new Error("Временный пароль должен содержать не менее 8 символов.");
  const sh = passwordRequests_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
  for (let i = 1; i < vals.length; i++) {
    if (String(vals[i][m.Id]) !== id || String(vals[i][m.Status]).toLowerCase() !== "pending") continue;
    const user = userByEmail_(vals[i][m.Email]);
    if (!user) throw new Error("Пользователь с таким email больше не существует.");
    const salt = Utilities.getUuid() + Utilities.getUuid(), now = new Date().toISOString();
    writeUserFields_(user, { PasswordSalt: salt, PasswordHash: passwordHash_(password, salt), UpdatedAt: now });
    sh.getRange(i + 1, m.Status + 1).setValue("resolved");
    sh.getRange(i + 1, m.ResolvedAt + 1).setValue(now);
    sh.getRange(i + 1, m.ResolvedBy + 1).setValue(actor.email);
    return { success: true, email: user.email };
  }
  throw new Error("Запрос уже обработан или не найден.");
}

/* ---------- Role-based games visibility ---------- */
function getPortalSettings_(data) {
  auth_(data);
  const sh = settings_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh);
  let gamesByRole = { student: true, teacher: false, admin: true };
  for (let i = 1; i < vals.length; i++) if (String(vals[i][m.Key]) === "gamesByRole") {
    try { gamesByRole = Object.assign(gamesByRole, JSON.parse(vals[i][m.Value] || "{}")); } catch (e) {}
  }
  return { success: true, gamesByRole: gamesByRole };
}
function setGamesAccess_(data) {
  const actor = admin_(data), incoming = data.gamesByRole || {};
  const value = {
    student: incoming.student === true,
    teacher: incoming.teacher === true,
    admin: incoming.admin === true
  };
  const sh = settings_(), vals = sh.getDataRange().getValues(), m = headerMap_(sh), now = new Date().toISOString();
  let row = 0;
  for (let i = 1; i < vals.length; i++) if (String(vals[i][m.Key]) === "gamesByRole") { row = i + 1; break; }
  const dataRow = ["gamesByRole", JSON.stringify(value), now, actor.email];
  if (row) sh.getRange(row, 1, 1, dataRow.length).setValues([dataRow]); else sh.appendRow(dataRow);
  return { success: true, gamesByRole: value };
}


/* ---------- Multiplayer Detective / Mafia rooms ---------- */
function gameRooms_() { return ensureSheet_(CFG.GAME_ROOMS); }
function gameActions_() { return ensureSheet_(CFG.GAME_ACTIONS); }
function gameRoomRow_(code) {
  const sh=gameRooms_(), values=sh.getDataRange().getValues(), target=String(code||"").trim().toUpperCase();
  for(let i=1;i<values.length;i++) if(String(values[i][0]||"").toUpperCase()===target) return {sheet:sh,row:i+1,code:target,hostEmail:email_(values[i][1]),state:values[i][2],expiresAt:values[i][4],status:values[i][5]};
  return null;
}
function parseGameState_(raw) { try { return typeof raw==="string" ? JSON.parse(raw||"{}") : (raw||{}); } catch(e) { throw new Error("Повреждено состояние игровой комнаты."); } }
function createGameRoom_(data) {
  const user=auth_(data), lock=LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh=gameRooms_(); let code="";
    for(let n=0;n<20;n++){ code=Array.from({length:6},()=> "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random()*32))).join(""); if(!gameRoomRow_(code)) break; code=""; }
    if(!code) throw new Error("Не удалось создать код комнаты.");
    const now=new Date(), expires=new Date(now.getTime()+4*60*60*1000);
    const state={game:String(data.game||"mafia"),maxPlayers:Math.max(2,Math.min(12,Number(data.maxPlayers)||12)),phase:"lobby",round:0,players:[],pendingNight:{},votes:{},privateMessages:{},log:[],winner:"",updatedAt:now.toISOString()};
    sh.appendRow([code,user.email,JSON.stringify(state),now.toISOString(),expires.toISOString(),"open"]);
    return {success:true,code:code,state:state,isHost:true};
  } finally { lock.releaseLock(); }
}
function publicGameState_(state, viewerEmail) { const safe=JSON.parse(JSON.stringify(state)); const viewer=email_(viewerEmail); const game=String(safe.game||""); const viewerPlayer=(safe.players||[]).find(p=>email_(p.email)===viewer); const viewerId=viewerPlayer?String(viewerPlayer.id||""):""; (safe.players||[]).forEach(p=>{const owner=email_(p.email); if(owner!==viewer) delete p.hand; delete p.role; delete p.roleLabel; delete p.email;}); delete safe.privateMessages; delete safe.pendingNight; if(game==="mafia") delete safe.votes; if(game==="bredo"){ const answers=safe.answers||{}; if(["vote","result","ended"].indexOf(String(safe.phase||""))===-1){ safe.answers={}; if(viewerId&&Object.prototype.hasOwnProperty.call(answers,viewerId)) safe.answers[viewerId]=answers[viewerId]; } const votes=safe.votes||{}; safe.votes={}; Object.keys(votes).forEach(id=>{safe.votes[id]=true;}); } return safe; }
function joinGameRoom_(data) {
  const user=auth_(data), code=String(data.code||"").trim().toUpperCase(), lock=LockService.getScriptLock();
  if(!/^[A-Z2-9]{6}$/.test(code)) throw new Error("Код комнаты должен содержать 6 символов.");
  lock.waitLock(10000);
  try { const room=gameRoomRow_(code); if(!room||room.status!=="open"||new Date(room.expiresAt).getTime()<Date.now()) throw new Error("Комната не найдена или истекла.");
    const state=parseGameState_(room.state); if(user.email===room.hostEmail) return {success:true,code:code,state:state,isHost:true,lastActionId:Math.max(0,gameActions_().getLastRow()-1)};
    state.players=state.players||[]; const existing=state.players.find(p=>email_(p.email)===user.email);
    if(existing){if(!existing.id)existing.id=Utilities.getUuid();room.sheet.getRange(room.row,3).setValue(JSON.stringify(state));return {success:true,code:code,state:publicGameState_(state,user.email),isHost:false,selfId:existing.id,privateRole:existing.role||"",privateMessage:(state.privateMessages||{})[user.email]||""};}
    if(state.phase!=="lobby") throw new Error("Игра уже началась. Новые участники больше не принимаются.");
    if(state.players.length>=Math.min(12,Number(state.maxPlayers)||12)) throw new Error("Комната заполнена (максимум "+Math.min(12,Number(state.maxPlayers)||12)+" игроков).");
    if(!existing) state.players.push({id:Utilities.getUuid(),email:user.email,name:String(user.name||data.name||"Игрок").slice(0,40),group:String(user.group||""),alive:true,joinedAt:new Date().toISOString()});
    room.sheet.getRange(room.row,3).setValue(JSON.stringify(state)); const joined=(state.players||[]).find(p=>email_(p.email)===user.email); return {success:true,code:code,state:publicGameState_(state,user.email),selfId:joined.id,privateRole:joined.role||"",privateMessage:(state.privateMessages||{})[user.email]||""};
  } finally { lock.releaseLock(); }
}
function getGameRoom_(data) {
  const user=auth_(data), room=gameRoomRow_(String(data.code||"").trim().toUpperCase());
  if(!room||new Date(room.expiresAt).getTime()<Date.now()) throw new Error("Комната не найдена или истекла.");
  const state=parseGameState_(room.state), isHost=user.email===room.hostEmail, player=(state.players||[]).find(p=>email_(p.email)===user.email);
  if(!isHost&&!player) throw new Error("Вы не состоите в этой комнате.");
  if(isHost) return {success:true,code:room.code,isHost:true,state:state};
  return {success:true,code:room.code,isHost:false,state:publicGameState_(state,user.email),selfId:player.id||"",privateRole:player.role||"",privateMessage:(state.privateMessages||{})[user.email]||""};
}
function updateGameRoom_(data) {
  const user=auth_(data), room=gameRoomRow_(String(data.code||"").trim().toUpperCase()); if(!room) throw new Error("Комната не найдена.");
  if(user.email!==room.hostEmail) throw new Error("Только ведущий может менять состояние игры.");
  const state=parseGameState_(data.state); if(JSON.stringify(state).length>45000) throw new Error("Состояние комнаты слишком большое.");
  state.updatedAt=new Date().toISOString(); room.sheet.getRange(room.row,3).setValue(JSON.stringify(state)); room.sheet.getRange(room.row,6).setValue(state.phase==="ended"?"closed":"open");
  return {success:true,updatedAt:state.updatedAt};
}
function sendGameAction_(data) {
  const user=auth_(data), code=String(data.code||"").trim().toUpperCase(), room=gameRoomRow_(code); if(!room||room.status!=="open") throw new Error("Комната закрыта или не найдена.");
  const state=parseGameState_(room.state), player=(state.players||[]).find(p=>email_(p.email)===user.email); if(!player||!player.alive) throw new Error("Вы не можете отправлять действия.");
  const type=String(data.type||""); const allowed=["night_kill","night_check","night_save","vote","bredo_answer","bredo_vote","bredo_next","durak_attack","durak_defend","durak_take","durak_done","chat","search","mark","theory","dossier"]; if(allowed.indexOf(type)<0) throw new Error("Неизвестное игровое действие."); if(type.indexOf("bredo_")===0&&String(state.game||"")!=="bredo") throw new Error("Действие не соответствует игре в комнате."); if(type.indexOf("durak_")===0&&String(state.game||"")!=="durak") throw new Error("Действие не соответствует игре в комнате."); if(["chat","search","mark","theory","dossier"].indexOf(type)>=0&&String(state.game||"")!=="detective-coop") throw new Error("Действие не соответствует игре в комнате.");
  const payload=data.payload||{}, target=String(payload.target||""); if(target&&!(state.players||[]).some(p=>(String(p.id||"")===target||email_(p.email)===email_(target))&&p.alive!==false)) throw new Error("Выбранная цель недоступна.");
  const lock=LockService.getScriptLock(); lock.waitLock(10000); try { const sh=gameActions_(), id=sh.getLastRow(); sh.appendRow([id,code,user.email,type,JSON.stringify(payload),new Date().toISOString()]); return {success:true,id:id}; } finally { lock.releaseLock(); }
}
function getGameActions_(data) {
  const user=auth_(data), code=String(data.code||"").trim().toUpperCase(), room=gameRoomRow_(code); if(!room) throw new Error("Комната не найдена.");
  const state=parseGameState_(room.state), isHost=user.email===room.hostEmail; if(!isHost) throw new Error("Историю действий видит только ведущий.");
  const after=Math.max(0,Number(data.after)||0), sheet=gameActions_(), last=sheet.getLastRow(), out=[];
  // Не перечитываем всю историю действий при каждом цикле опроса комнаты.
  // ID действия равен номеру строки, поэтому достаточно хвоста таблицы.
  if(last<2)return {success:true,actions:[]};
  const first=Math.max(2,last-499), values=sheet.getRange(first,1,last-first+1,6).getValues();
  for(let i=0;i<values.length;i++){const row=values[i],id=Number(row[0])||first+i;if(String(row[1]).toUpperCase()===code&&id>after){let payload={};try{payload=JSON.parse(row[4]||"{}");}catch(e){}out.push({id:id,email:email_(row[2]),type:String(row[3]),payload:payload,createdAt:row[5]});}}
  return {success:true,actions:out.slice(-100)};
}
function leaveGameRoom_(data) {
  const user=auth_(data), room=gameRoomRow_(String(data.code||"").trim().toUpperCase()); if(!room) return {success:true};
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try {const state=parseGameState_(room.state);if(user.email===room.hostEmail){state.phase="ended";state.winner="Комната закрыта ведущим";room.sheet.getRange(room.row,6).setValue("closed");}else{state.players=(state.players||[]).filter(p=>email_(p.email)!==user.email);}room.sheet.getRange(room.row,3).setValue(JSON.stringify(state));return {success:true};}finally{lock.releaseLock();}
}
/* ---------- One-time import from the previous student-results spreadsheet ---------- */
const LEGACY_RESULTS_SOURCE_ID = "1lpNmnxr8TCaG-3-FpqUMU1wMAHQmk82jNlnSRDGASDQ";
const LEGACY_RESULTS_SOURCE_GID = 0;
function legacyNorm_(v) { return String(v == null ? "" : v).toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9]+/g,""); }
function legacyNumber_(v) {
  if (typeof v === "number") return v;
  const s = String(v == null ? "" : v).replace(/\\s/g,"").replace(",",".").replace("%","");
  const m = s.match(/-?\d+(?:\\.\d+)?/);
  return m ? Number(m[0]) : 0;
}
function legacyColumn_(headers, aliases) {
  const normalized = headers.map(legacyNorm_);
  const keys = aliases.map(legacyNorm_);
  for (let i = 0; i < keys.length; i++) {
    const at = normalized.indexOf(keys[i]);
    if (at >= 0) return at;
  }
  for (let i = 0; i < normalized.length; i++) {
    if (keys.some(key => key.length >= 4 && normalized[i].indexOf(key) >= 0)) return i;
  }
  return -1;
}
function legacyCourseId_(value, testId) {
  const s = legacyNorm_(value) + " " + legacyNorm_(testId);
  if (s.indexOf("материаловед") >= 0 || s.indexOf("mat") >= 0) return "MAT";
  if (s.indexOf("охрана") >= 0 || s.indexOf("безопасноститруда") >= 0) return "OT";
  if (s.indexOf("0701") >= 0 || s.indexOf("чпу") >= 0) return "07.01";
  if (s.indexOf("0401") >= 0 || s.indexOf("диагност") >= 0) return "04.01";
  if (s.indexOf("0201") >= 0 || s.indexOf("сборк") >= 0) return "02.01";
  if (s.indexOf("0202") >= 0 || s.indexOf("программирован") >= 0) return "02.02";
  if (s.indexOf("mastercam") >= 0 || s.indexOf("mcam") >= 0) return "MCAM";
  return "";
}
/**
 * Диагностика старой таблицы: показывает вкладки, gid и размеры,
 * не выводя персональные данные обучающихся.
 * Запустите вручную listLegacyResultsSheets().
 */
function listLegacyResultsSheets() {
  const ss = SpreadsheetApp.openById(LEGACY_RESULTS_SOURCE_ID);
  const report = ss.getSheets().map(function(sh) {
    return {
      name: sh.getName(),
      gid: sh.getSheetId(),
      lastRow: sh.getLastRow(),
      lastColumn: sh.getLastColumn()
    };
  });
  Logger.log(JSON.stringify({
    spreadsheet: ss.getName(),
    spreadsheetId: LEGACY_RESULTS_SOURCE_ID,
    sheets: report
  }, null, 2));
  return report;
}

function legacySourceSheet_() {
  const ss = SpreadsheetApp.openById(LEGACY_RESULTS_SOURCE_ID);
  const sh = ss.getSheets().filter(s => Number(s.getSheetId()) === LEGACY_RESULTS_SOURCE_GID)[0];
  if (!sh) throw new Error("Не найден лист старой таблицы с gid=" + LEGACY_RESULTS_SOURCE_GID + ". Проверьте ссылку и доступ Apps Script к таблице.");
  return sh;
}
function previewLegacyResultsImport() {
  const sh = legacySourceSheet_(), values = sh.getDataRange().getValues();
  const headerRow = values.slice(0, 10).findIndex(row => {
    const h = row.map(legacyNorm_);
    return h.some(x => ["email","почта","логин","фио","студент","группа","пользователь","обучающийся","учащийся","имя"].some(k => x.indexOf(k) >= 0)) &&
      h.some(x => ["оценка","grade","результат","балл","процент","тест","работа","задание","правильн"].some(k => x.indexOf(k) >= 0));
  });
  const report = {
    spreadsheetId: LEGACY_RESULTS_SOURCE_ID,
    sheet: sh.getName(),
    gid: sh.getSheetId(),
    headerRow: headerRow >= 0 ? headerRow + 1 : null,
    headers: headerRow >= 0 ? values[headerRow].map(String) : [],
    sampleRows: headerRow >= 0 ? values.slice(headerRow + 1, headerRow + 8) : values.slice(0, 12),
    detected: headerRow >= 0,
    hint: headerRow >= 0 ? "Проверьте заголовки и примеры, затем можно запускать импорт." : "Заголовки автоматически не распознаны. Пришлите сюда эти первые строки — сопоставлю столбцы."
  };
  Logger.log(JSON.stringify(report, null, 2));
  return report;
}
function importLegacyResultsFromSpreadsheet() {
  const sh = legacySourceSheet_(), values = sh.getDataRange().getValues();
  const headerRow = values.slice(0, 10).findIndex(row => {
    const h = row.map(legacyNorm_);
    return h.some(x => ["email","почта","логин","фио","студент","группа","пользователь","обучающийся","учащийся","имя"].some(k => x.indexOf(k) >= 0)) &&
      h.some(x => ["оценка","grade","результат","балл","процент","тест","работа","задание","правильн"].some(k => x.indexOf(k) >= 0));
  });
  if (headerRow < 0) throw new Error("Не найдены заголовки результатов. Сначала выполните previewLegacyResultsImport().");
  const h = values[headerRow];
  const col = {
    email: legacyColumn_(h, ["email","e-mail","электронная почта","адрес почты","почта","логин","email студента","почта студента"]),
    name: legacyColumn_(h, ["фио","фио студента","фио обучающегося","фамилия имя отчество","студент","учащийся","обучающийся","пользователь","имя пользователя","name"]),
    group: legacyColumn_(h, ["группа","group"]),
    testId: legacyColumn_(h, ["testid","id теста","код работы","id работы"]),
    title: legacyColumn_(h, ["название теста","название работы","тест","работа","наименование","testtitle"]),
    grade: legacyColumn_(h, ["оценка","оценка за тест","оценка за работу","итоговая оценка","результат","grade"]),
    score: legacyColumn_(h, ["баллы","набрано баллов","верных ответов","правильных ответов","количество баллов","score"]),
    max: legacyColumn_(h, ["максимум","всего вопросов","maxscore","максимальный балл"]),
    percent: legacyColumn_(h, ["процент","результат процентов","результат в процентах","успеваемость","percent"]),
    time: legacyColumn_(h, ["время","времявыполнения","timespent"]),
    attempts: legacyColumn_(h, ["попытки","количествопопыток","attempts"]),
    date: legacyColumn_(h, ["дата","датазавершения","завершено","finishedat","времяпрохождения"]),
    course: legacyColumn_(h, ["дисциплина","мдк","курс","courseid","предмет"])
  };
  if (col.email < 0 && col.name < 0) throw new Error("В таблице нет столбца с email или ФИО студента.");
  if (col.grade < 0 && col.score < 0 && col.percent < 0) throw new Error("В таблице не найден столбец с оценкой, баллами или процентом.");
  const users = users_().getDataRange().getValues(), um = headerMap_(users_());
  const studentRows = users.slice(1).filter(r => String(r[um.Role] || "").toLowerCase() === "student");
  const existing = results_().getDataRange().getValues();
  const seen = {};
  existing.slice(1).forEach(r => { seen[email_(r[0]) + "|" + String(r[3]) + "|" + String(r[11])] = true; });
  const rows = [], skipped = [];
  for (let i = headerRow + 1; i < values.length; i++) {
    const src = values[i];
    if (!src.some(v => String(v == null ? "" : v).trim())) continue;
    let email = col.email >= 0 ? email_(src[col.email]) : "";
    const name = col.name >= 0 ? String(src[col.name] || "").trim() : "";
    const group = col.group >= 0 ? String(src[col.group] || "").trim() : "";
    let matched = null;
    if (email) matched = studentRows.find(r => email_(r[um.Email]) === email) || null;
    if (!matched && name) {
      const candidates = studentRows.filter(r => legacyNorm_(r[um.Name]) === legacyNorm_(name) && (!group || legacyNorm_(r[um.Group]) === legacyNorm_(group)));
      if (candidates.length === 1) matched = candidates[0];
    }
    if (matched) email = email_(matched[um.Email]);
    if (!email) { skipped.push("Строка " + (i + 1) + ": студент не сопоставлен по email/ФИО."); continue; }
    const title = col.title >= 0 ? String(src[col.title] || "").trim() : "";
    const originalId = col.testId >= 0 ? String(src[col.testId] || "").trim() : "";
    const testTitle = title || originalId || "Импортированный результат";
    const testId = originalId || ("legacy_" + legacyNorm_(testTitle) + "_" + (i + 1));
    const gradeRaw = col.grade >= 0 ? String(src[col.grade] || "").replace(",", ".") : "";
    const score = col.score >= 0 ? legacyNumber_(src[col.score]) : 0;
    const maxScore = col.max >= 0 ? legacyNumber_(src[col.max]) : 0;
    let grade = legacyNumber_(gradeRaw);
    let percent = col.percent >= 0 ? legacyNumber_(src[col.percent]) : (maxScore > 0 ? Math.round(score / maxScore * 100) : 0);
    // A single "Результат" column may contain either a grade (4/5) or a percent (82%).
    if (!percent && grade > 5 && grade <= 100) { percent = grade; grade = 0; }
    if (!percent && /%/.test(gradeRaw)) percent = legacyNumber_(gradeRaw);
    if (!grade || grade < 2 || grade > 5) grade = percent >= 90 ? 5 : percent >= 75 ? 4 : percent >= 60 ? 3 : 2;
    let finishedAt = "";
    if (col.date >= 0 && src[col.date]) {
      const d = src[col.date] instanceof Date ? src[col.date] : new Date(src[col.date]);
      finishedAt = isNaN(d.getTime()) ? String(src[col.date]) : d.toISOString();
    }
    const courseValue = col.course >= 0 ? src[col.course] : "";
    let courseId = legacyCourseId_(courseValue, originalId + " " + testTitle);
    if (!courseId && matched) {
      const enrolled = String(matched[um.Courses] || "").split(",").filter(Boolean);
      if (enrolled.length === 1) courseId = enrolled[0];
    }
    if (!courseId) courseId = "LEGACY";
    const key = email + "|" + testId + "|" + finishedAt;
    if (seen[key]) continue;
    seen[key] = true;
    rows.push([
      email, name || (matched ? matched[um.Name] : email), group || (matched ? matched[um.Group] : ""),
      testId, testTitle, grade, score, maxScore, percent,
      col.time >= 0 ? legacyNumber_(src[col.time]) : 0,
      col.attempts >= 0 ? (legacyNumber_(src[col.attempts]) || 1) : 1,
      finishedAt, courseId
    ]);
  }
  if (rows.length) results_().getRange(results_().getLastRow() + 1, 1, rows.length, HEADERS.Results.length).setValues(rows);
  const summary = { imported: rows.length, skipped: skipped.length, unknownCourse: rows.filter(r => r[12] === "LEGACY").length, skippedDetails: skipped.slice(0, 30) };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
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


/**
 * Защищённое хранилище семестровых контрольных по английскому языку.
 * Ключи ответов остаются на сервере; клиент получает только вопросы и варианты.
 */
function englishSemesterBank_() { return ensureSheet_("EnglishSemesterBank"); }

function validateEnglishSemesterTests_(tests) {
  if (!Array.isArray(tests) || tests.length !== 10) {
    throw new Error("Для каждого направления требуется ровно 10 семестровых контрольных.");
  }
  let questionCount = 0;
  tests.forEach(function(test, index) {
    if (!test || !test.id || !Array.isArray(test.questions) || test.questions.length !== 20) {
      throw new Error("Контрольная №" + (index + 1) + " должна содержать ровно 20 вопросов.");
    }
    test.questions.forEach(function(q, qi) {
      if (!q || !String(q.q || "").trim() || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error("Некорректный вопрос " + (qi + 1) + " в контрольной №" + (index + 1) + ".");
      }
      const correct = Number(q.correct);
      if (!Number.isInteger(correct) || correct < 0 || correct >= q.options.length) {
        throw new Error("Некорректный ключ ответа в контрольной №" + (index + 1) + ", вопрос " + (qi + 1) + ".");
      }
      questionCount++;
    });
  });
  return questionCount;
}

function importEnglishSemesterTests_(data) {
  const actor = auth_(data);
  if (actor.role !== "admin" && actor.role !== "teacher") throw new Error("Импорт доступен только преподавателю.");
  const track = String(data.track || "").toLowerCase();
  if (["basic", "technical"].indexOf(track) < 0) throw new Error("Неизвестное направление английского языка.");
  if (actor.role === "teacher" && !hasCourseAccess_(actor, track === "basic" ? "ENB" : "ENT") && !hasCourseAccess_(actor, "EN")) {
    throw new Error("Нет доступа к импорту этого направления.");
  }
  const tests = data.tests;
  const questionCount = validateEnglishSemesterTests_(tests);
  const json = JSON.stringify(tests);
  if (json.length > 450000) throw new Error("Размер набора превышает 450 КБ.");
  const sh = englishSemesterBank_(), lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const values = sh.getDataRange().getValues(), map = headerMap_(sh);
    let rowNo = 0;
    for (let i = 1; i < values.length; i++) if (String(values[i][map.Track] || "") === track) { rowNo = i + 1; break; }
    const record = {Track:track, TestsJSON:json, Active:"TRUE", UpdatedAt:new Date().toISOString(), UpdatedBy:actor.email};
    if (rowNo) updateMappedRecord_(sh, rowNo, record); else appendMappedRecord_(sh, record);
    return {success:true, track:track, tests:tests.length, questions:questionCount, bytes:json.length, updatedAt:record.UpdatedAt};
  } finally { lock.releaseLock(); }
}

function sanitizeEnglishSemesterTests_(tests) {
  return (tests || []).map(function(test) {
    const safe = JSON.parse(JSON.stringify(test));
    (safe.questions || []).forEach(function(question) { delete question.correct; });
    return safe;
  });
}

function getEnglishSemesterTests_(data) {
  const user = auth_(data), track = String(data.track || "").toLowerCase();
  if (["student","teacher","admin"].indexOf(user.role) < 0 || ["basic","technical"].indexOf(track) < 0) {
    throw new Error("Нет доступа к семестровым контрольным.");
  }
  const courseId = track === "basic" ? "ENB" : "ENT";
  if (!hasCourseAccess_(user, courseId) && !hasCourseAccess_(user, "EN")) {
    throw new Error("Эта дисциплина не назначена вашему аккаунту.");
  }
  const sh = englishSemesterBank_(), values = sh.getDataRange().getValues(), map = headerMap_(sh);
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][map.Track] || "") !== track || String(values[i][map.Active] || "").toUpperCase() !== "TRUE") continue;
    const tests = JSON.parse(String(values[i][map.TestsJSON] || "[]"));
    const questionCount = (tests || []).reduce(function(sum, test) { return sum + ((test.questions || []).length); }, 0);
    return {success:true, track:track, tests:sanitizeEnglishSemesterTests_(tests), testCount:tests.length, questionCount:questionCount};
  }
  return {success:false, error:"Семестровые контрольные ещё не импортированы преподавателем."};
}


/**
 * Серверная проверка семестровой контрольной. Правильные ответы читаются
 * только из закрытого EnglishSemesterBank; клиент передаёт лишь индексы ответов.
 */
function submitEnglishSemesterTest_(data) {
  const user = auth_(data);
  const track = String(data.track || "").toLowerCase();
  const testId = String(data.testId || "").trim();
  const answers = Array.isArray(data.answers) ? data.answers : [];
  if (user.role !== "student" || ["basic", "technical"].indexOf(track) < 0 || !testId) {
    throw new Error("Нет доступа к семестровой контрольной.");
  }
  const courseId = track === "basic" ? "ENB" : "ENT";
  if (!hasCourseAccess_(user, courseId) && !hasCourseAccess_(user, "EN")) {
    throw new Error("Эта дисциплина не назначена вашему аккаунту.");
  }
  const sh = englishSemesterBank_(), values = sh.getDataRange().getValues(), map = headerMap_(sh);
  let tests = null;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][map.Track] || "") === track &&
        String(values[i][map.Active] || "").toUpperCase() === "TRUE") {
      tests = JSON.parse(String(values[i][map.TestsJSON] || "[]"));
      break;
    }
  }
  if (!tests) throw new Error("Семестровые контрольные ещё не импортированы.");
  const test = tests.filter(function(item) { return String(item.id || "") === testId; })[0];
  if (!test || !Array.isArray(test.questions) || test.questions.length !== 20) {
    throw new Error("Контрольная не найдена или имеет неверный формат.");
  }
  if (answers.length !== test.questions.length) {
    throw new Error("Количество ответов не совпадает с количеством вопросов.");
  }
  const score = test.questions.reduce(function(total, question, index) {
    const correct = Number(question.correct);
    const answer = answers[index];
    return total + (Number.isInteger(answer) && answer === correct ? 1 : 0);
  }, 0);
  const testKey = "english_semester_" + track + "_" + testId;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const results = results_(), rows = results.getDataRange().getValues();
    const prior = rows.slice(1).filter(function(row) {
      return email_(row[0]) === user.email && String(row[3] || "") === testKey &&
        sameCourseId_(row[12] || courseId, courseId);
    }).length;
    const raw = settingValue_("testAttempts:" + user.email + ":" + courseId + ":" + testKey);
    const limit = raw === "" ? 1 : 1 + Math.max(0, Number(raw) || 0);
    if (prior >= limit) {
      throw new Error("Контрольная уже завершена. Для повторного прохождения обратитесь к преподавателю.");
    }
    const attemptNo = prior + 1;
    const policy = proctorPenalty_(user.email, courseId, testKey, attemptNo);
    const rawPercent = Math.round(score / test.questions.length * 100);
    const percent = Math.max(0, rawPercent - policy.penaltyPoints);
    const grade = gradeFromPercent_(percent);
    const title = String(test.title || "Контрольная работа") + " — " + String(test.subtitle || track.toUpperCase());
    appendMappedRecord_(results, {
      Email:user.email, Name:user.name, Group:user.group, TestId:testKey, TestTitle:title,
      Grade:grade, Score:score, MaxScore:test.questions.length, Percent:percent,
      TimeSpent:Math.max(0, Number(data.timeSpent) || 0), Attempts:attemptNo,
      FinishedAt:new Date().toISOString(), CourseId:courseId,
      Submission:JSON.stringify({answers:answers}).slice(0,10000),
      PenaltyPoints:policy.penaltyPoints, ViolationCount:policy.violationCount
    });
    appendAttemptAudit_({
      EventType:"attempt_submitted", ActorEmail:user.email, StudentEmail:user.email,
      StudentName:user.name, Group:user.group, CourseId:courseId, TestId:testKey,
      TestTitle:title, AttemptNo:attemptNo, Grade:grade, Score:score,
      MaxScore:test.questions.length, Percent:percent
    });
    return {
      success:true, testId:testKey, score:score, maxScore:test.questions.length,
      percent:percent, rawPercent:rawPercent, grade:grade, attempts:attemptNo,
      penaltyPoints:policy.penaltyPoints, violationCount:policy.violationCount
    };
  } finally {
    lock.releaseLock();
  }
}
