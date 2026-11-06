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
  SESSION_TTL: 21600, // 6 часов
  LEGACY_SALT: "portal_spo_2026",
  COURSES: ["07.01", "04.01", "02.01", "02.02", "MCAM", "MAT", "OT", "PFI", "EN", "ENB", "ENT"]
};

const HEADERS = {
  Users: ["Email", "PasswordHash", "Name", "Group", "Role", "UpdatedAt", "Courses", "Payload", "PasswordSalt", "LoginChangedAt", "PasswordChangedAt"],
  Results: ["Email", "Name", "Group", "TestId", "TestTitle", "Grade", "Score", "MaxScore", "Percent", "TimeSpent", "Attempts", "FinishedAt", "CourseId", "Submission"],
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
  Notifications: ["Id", "RecipientEmail", "Type", "Title", "Message", "CourseId", "RelatedId", "CreatedAt", "ReadAt"]
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
      case "getresults": result = getResults_(data); break;
      case "getpublicsubjectratings": result = getPublicSubjectRatings_(data); break;
      case "getmycourseresults": result = getMyCourseResults_(data); break;
      case "savegcodeprogress": result = saveGCodeProgress_(data); break;
      case "getcustomcontent": result = getCustomContent_(data); break;
      case "uploadbookpdf": result = uploadBookPdf_(data); break;
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

/**
 * Запустите вручную один раз после добавления SPREADSHEET_ID.
 * Функция создаёт недостающие листы и заголовки, но не удаляет данные.
 */
function setupPortal() {
  [CFG.USERS, CFG.RESULTS, CFG.CONTENT, CFG.SCHEDULE, CFG.INVITES, CFG.PASSWORD_REQUESTS, CFG.SETTINGS, CFG.GAME_ROOMS, CFG.GAME_ACTIONS, "Assignments", "AssignmentSubmissions", "AssignmentSubmissionHistory", "Notifications"].forEach(ensureSheet_);
  const ss = getSpreadsheet_();
  Logger.log("Портал настроен. Таблица: " + ss.getName());
  return "Готово. Созданы/проверены листы Users, Results, CourseContent, Schedule, Invites, PasswordRequests, PortalSettings, Assignments, AssignmentSubmissions, AssignmentSubmissionHistory, Notifications.";
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
      courses: String(row[map.Courses] || "").split(",").filter(function(id){ return user.role === "admin" || hasCourseAccess_(user,id); }),
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
    data.grade === undefined || data.grade === null || data.grade === "" ? 0 : Math.max(0, Math.min(5, Number(data.grade) || 0)),
    Number(data.score) || 0,
    Number(data.maxScore) || 0,
    Number(data.percent) || 0,
    Math.max(0, Number(data.timeSpent) || 0),
    attempts,
    new Date().toISOString(),
    String(data.courseId || ""),
    String(data.payload || "").slice(0, 10000)
  ]);
  return { success: true, attempts: attempts };
}


/* ---------- In-app notifications ---------- */
function createNotification_(recipientEmail, type, title, message, courseId, relatedId) {
  const recipient=email_(recipientEmail); if(!recipient)return;
  notifications_().appendRow([Utilities.getUuid(),recipient,String(type||"info").slice(0,40),String(title||"Уведомление").slice(0,180),String(message||"").slice(0,500),String(courseId||""),String(relatedId||""),new Date().toISOString(),""]);
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
    return {email:email_(r[sh.StudentEmail]),name:String(r[sh.StudentName]||""),group:String(r[sh.Group]||""),testId:"assignment_"+String(a[ah.Id]),testTitle:"Задание: "+String(a[ah.Title]||""),grade:grade,score:grade===""?0:grade,maxScore:5,percent:grade===""?0:grade*20,timeSpent:0,attempts:Math.max(1,attemptCounts[String(r[sh.Id])]||1),finishedAt:String(r[sh.SubmittedAt]||""),courseId:String(a[ah.CourseId]||""),payload:String(r[sh.Answer]||""),assignmentStatus:String(r[sh.Status]||"submitted"),feedback:String(r[sh.Feedback]||""),assignmentId:String(a[ah.Id])};
  }).filter(Boolean);
}

function getResults_(data) {
  const user=auth_(data); if(user.role!=='admin'&&user.role!=='teacher') throw new Error('Недостаточно прав.');
  let list=results_().getDataRange().getValues().slice(1).filter(r=>r[0]).map(r=>({email:r[0],name:r[1],group:r[2],testId:r[3],testTitle:r[4],grade:r[5],score:r[6],maxScore:r[7],percent:r[8],timeSpent:r[9],attempts:r[10],finishedAt:r[11],courseId:r[12]||'',payload:String(r[13]||'')}));
  const sh=users_(),vals=sh.getDataRange().getValues(),m=headerMap_(sh);
  vals.slice(1).forEach(row=>{if(String(row[m.Role]||'').toLowerCase()!=='student')return;let p={};try{p=JSON.parse(row[m.Payload]||'{}')}catch(e){};const rs=p.results||{};Object.keys(rs).forEach(key=>{const rec=rs[key];if(!rec||typeof rec!=='object'||rec.grade==null)return;const email=email_(row[m.Email]);if(list.some(x=>email_(x.email)===email&&String(x.testId)===key))return;let cid=String(rec.courseId||'');if(!cid){const matches=CFG.COURSES.filter(id=>key.indexOf(id)>=0);if(matches.length===1)cid=matches[0];else{const enrolled=String(row[m.Courses]||'').split(',').filter(Boolean);if(enrolled.length===1)cid=enrolled[0];}}list.push({email:email,name:row[m.Name],group:row[m.Group],testId:key,testTitle:rec.testTitle||key,grade:rec.grade,score:rec.score||0,maxScore:rec.max||rec.maxScore||0,percent:rec.percent||0,timeSpent:rec.timeSpent||0,attempts:rec.attempts||1,finishedAt:rec.finishedAt||'',courseId:cid});});});
  assignmentResultRecords_().forEach(function(x){if(!list.some(function(r){return email_(r.email)===x.email&&String(r.testId)===x.testId;}))list.push(x);});
  if(user.role==='teacher')list=list.filter(x=>hasCourseAccess_(user,x.courseId));
  if(data.courseId)list=list.filter(x=>x.courseId===String(data.courseId));
  list.sort((a,b)=>String(b.finishedAt).localeCompare(String(a.finishedAt)));return {success:true,results:list};
}

function getPublicSubjectRatings_(data) {
  // Публичная таблица содержит только ФИО, группу и агрегированные учебные показатели.
  // Email и исходные payload обучающихся не возвращаются.
  const user = auth_(data);
  const rows = results_().getDataRange().getValues().slice(1).filter(function (r) { return !!r[0]; });
  // Совместимость со старой схемой: часть результатов может храниться в students.payload.
  const userSheet = users_(), userValues = userSheet.getDataRange().getValues(), userMap = headerMap_(userSheet);
  userValues.slice(1).forEach(function (row) {
    if (String(row[userMap.Role] || "").toLowerCase() !== "student" || !row[userMap.Email]) return;
    let payload = {};
    try { payload = JSON.parse(row[userMap.Payload] || "{}"); } catch (e) {}
    const legacy = payload.results || {};
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
      if (!courseId) return;
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
  const user = auth_(data), email = email_(user.email), requestedCourse = String(data.courseId || "");
  const list = results_().getDataRange().getValues().slice(1).filter(function (r) {
    return r[0] && email_(r[0]) === email && (!requestedCourse || String(r[12] || "") === requestedCourse);
  }).map(function (r) {
    return { testId: String(r[3] || ""), testTitle: String(r[4] || r[3] || ""),
      grade: Number(r[5]) || 0, score: Number(r[6]) || 0, maxScore: Number(r[7]) || 0,
      percent: Number(r[8]) || 0, timeSpent: Number(r[9]) || 0,
      finishedAt: String(r[11] || ""), courseId: String(r[12] || "") };
  });
  const sheet = users_(), values = sheet.getDataRange().getValues(), map = headerMap_(sheet);
  const row = values.slice(1).find(function (r) { return email_(r[map.Email]) === email; });
  if (row) {
    let payload = {};
    try { payload = JSON.parse(row[map.Payload] || "{}"); } catch (e) {}
    const legacy = payload.results || {};
    Object.keys(legacy).forEach(function (testId) {
      const rec = legacy[testId];
      if (!rec || typeof rec !== "object" || rec.grade == null) return;
      let courseId = String(rec.courseId || "");
      if (!courseId) {
        const matches = CFG.COURSES.filter(function (id) { return testId.indexOf(id) >= 0; });
        if (matches.length === 1) courseId = matches[0];
        else {
          const enrolled = String(row[map.Courses] || "").split(",").filter(Boolean);
          if (enrolled.length === 1) courseId = enrolled[0];
        }
      }
      if (requestedCourse && courseId !== requestedCourse) return;
      if (list.some(function (x) { return x.testId === String(testId); })) return;
      list.push({ testId: String(testId), testTitle: String(rec.testTitle || testId),
        grade: Number(rec.grade) || 0, score: Number(rec.score) || 0,
        maxScore: Number(rec.max || rec.maxScore) || 0, percent: Number(rec.percent) || 0,
        timeSpent: Number(rec.timeSpent) || 0, finishedAt: String(rec.finishedAt || ""), courseId: courseId });
    });
  }
  assignmentResultRecords_(email).forEach(function(x){if(!requestedCourse||x.courseId===requestedCourse){if(!list.some(function(r){return r.testId===x.testId;}))list.push({testId:x.testId,testTitle:x.testTitle,grade:x.grade,score:x.score,maxScore:x.maxScore,percent:x.percent,timeSpent:0,finishedAt:x.finishedAt,courseId:x.courseId,payload:x.payload,assignmentStatus:x.assignmentStatus,feedback:x.feedback,assignmentId:x.assignmentId});}});
  list.sort(function (a, b) { return String(a.finishedAt).localeCompare(String(b.finishedAt)); });
  const graded = list.filter(function (x) { return x.grade !== "" && x.grade !== null && Number(x.grade) > 0; });
  const averageGrade = graded.length ? Math.round(graded.reduce(function (n, x) { return n + x.grade; }, 0) / graded.length * 100) / 100 : 0;
  const averagePercent = graded.length ? Math.round(graded.reduce(function (n, x) { return n + x.percent; }, 0) / graded.length) : 0;
  return { success: true, results: list, summary: { completed: list.length, graded: graded.length, averageGrade: averageGrade, averagePercent: averagePercent } };
}

/* ---------- Assignments and student submissions ---------- */
function createAssignment_(data) {
  const courseId = String(data.courseId || "");
  if (!courseId || CFG.COURSES.indexOf(courseId) < 0) throw new Error("Укажите корректную дисциплину.");
  const teacher = editor_(data, courseId);
  const title = String(data.title || "").trim().slice(0,180);
  const instructions = String(data.instructions || "").trim().slice(0,10000);
  const targetType = String(data.targetType || ""), targetValue = String(data.targetValue || "").trim();
  if (!title || !instructions) throw new Error("Заполните название и условие задания.");
  if (["group","individual"].indexOf(targetType) < 0 || !targetValue) throw new Error("Выберите адресата.");
  const us = users_(), rows = us.getDataRange().getValues(), um = headerMap_(us);
  const matches = rows.slice(1).filter(function(r){
    if (String(r[um.Role] || "").toLowerCase() !== "student") return false;
    if (String(r[um.Courses] || "").split(",").map(function(x){return x.trim();}).indexOf(courseId) < 0) return false;
    return targetType === "individual" ? email_(r[um.Email]) === email_(targetValue) : String(r[um.Group] || "").trim().toLowerCase() === targetValue.toLowerCase();
  });
  if (targetType === "individual" && !matches.length) throw new Error("Обучающийся не найден или у него нет доступа к дисциплине.");
  const id = Utilities.getUuid(), now = new Date().toISOString();
  assignments_().appendRow([id,courseId,title,String(data.topic||"").slice(0,180),String(data.level||"Средний"),String(data.workType||"Практическое задание"),String(data.dueAt||""),targetType,targetType==="individual"?email_(targetValue):targetValue,instructions,String(data.criteria||"").slice(0,4000),teacher.email,now,"active"]);
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
      if(typ==="individual"&&email_(val)!==user.email)return;
      if(typ==="group"&&val.toLowerCase()!==String(user.group||"").trim().toLowerCase())return;
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
  const student=auth_(data); if(student.role!=="student") throw new Error("Отправлять ответы может только обучающийся.");
  const id=String(data.assignmentId||""),answer=String(data.answer||"").trim().slice(0,12000); if(!id||!answer)throw new Error("Введите ответ.");
  const sh=assignments_(),rows=sh.getDataRange().getValues(),h=headerMap_(sh),a=rows.slice(1).find(function(r){return String(r[h.Id])===id;});
  if(!a)throw new Error("Задание не найдено.");
  const cid=String(a[h.CourseId]||""),typ=String(a[h.TargetType]||""),val=String(a[h.TargetValue]||"");
  if(!hasCourseAccess_(student,cid)||(typ==="individual"&&email_(val)!==student.email)||(typ==="group"&&val.toLowerCase()!==String(student.group||"").trim().toLowerCase())||String(a[h.Status]||"active")!=="active")throw new Error("Это задание вам недоступно.");
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    const sub=assignmentSubmissions_(),v=sub.getDataRange().getValues(),m=headerMap_(sub);
    const i=v.slice(1).findIndex(function(r){return String(r[m.AssignmentId])===id&&email_(r[m.StudentEmail])===student.email;});
    const now=new Date().toISOString(),submissionId=i>=0?String(v[i+1][m.Id]):Utilities.getUuid();
    const hist=assignmentSubmissionHistory_(),hv=hist.getDataRange().getValues(),hm=headerMap_(hist);
    const saved=hv.slice(1).filter(function(r){return String(r[hm.SubmissionId]||"")===submissionId;});
    let attempt=saved.length+1;
    if(i>=0&&!saved.length){
      const previous=v[i+1],previousAt=String(previous[m.SubmittedAt]||now);
      hist.appendRow([Utilities.getUuid(),id,submissionId,student.email,String(previous[m.StudentName]||student.name),String(previous[m.Group]||student.group),String(previous[m.Answer]||""),previousAt,1]);
      attempt=2;
    }
    hist.appendRow([Utilities.getUuid(),id,submissionId,student.email,student.name,student.group,answer,now,attempt]);
    const row=[submissionId,id,student.email,student.name,student.group,answer,now,"submitted","","","",""];
    if(i>=0)sub.getRange(i+2,1,1,row.length).setValues([row]);else sub.appendRow(row);
    createNotification_(String(a[h.CreatedBy]||""),"submission",attempt>1?"Повторная отправка задания":"Новый ответ на задание",student.name+" ("+student.group+") отправил(а) работу: "+String(a[h.Title]||""),cid,id);
    return {success:true,submittedAt:now,attempt:attempt,submissionId:submissionId};
  }finally{lock.releaseLock();}
}
function gradeAssignment_(data) {
  const actor=auth_(data); if (actor.role !== "teacher" && actor.role !== "admin") throw new Error("Проверять ответы могут только преподаватели.");
  if(data.grade===undefined||data.grade===null||String(data.grade).trim()==="") throw new Error("Выберите оценку.");
  const grade=Number(data.grade); if(!isFinite(grade)||grade<0||grade>5) throw new Error("Оценка должна быть от 0 до 5.");
  const id=String(data.submissionId||""), sh=assignmentSubmissions_(), vals=sh.getDataRange().getValues(), m=headerMap_(sh), i=vals.slice(1).findIndex(function(r){return String(r[m.Id])===id;});
  if(i<0) throw new Error("Ответ не найден.");
  const row=vals[i+1], aid=String(row[m.AssignmentId]||""), as=assignments_(), av=as.getDataRange().getValues(), ah=headerMap_(as), a=av.slice(1).find(function(r){return String(r[ah.Id])===aid;});
  if(!a) throw new Error("Назначение не найдено.");
  const teacher=editor_(data,String(a[ah.CourseId]||""));
  const feedback=String(data.feedback||"").slice(0,4000);
  sh.getRange(i+2,m.Status+1).setValue("reviewed"); sh.getRange(i+2,m.Grade+1).setValue(grade); sh.getRange(i+2,m.Feedback+1).setValue(feedback); sh.getRange(i+2,m.ReviewedBy+1).setValue(teacher.email); sh.getRange(i+2,m.ReviewedAt+1).setValue(new Date().toISOString());
  createNotification_(String(row[m.StudentEmail]||""),"grade","Работа проверена","По заданию «"+String(a[ah.Title]||"")+"» выставлена оценка: "+grade+"/5."+(feedback?" Есть комментарий преподавателя.":""),String(a[ah.CourseId]||""),aid);
  return {success:true};
}

/* ---------- Teacher PDF upload to Drive ---------- */
function uploadBookPdf_(data) {
  const courseId = String(data.courseId || "MAT");
  if (courseId !== "MAT") throw new Error("Загрузка учебников разрешена только в библиотеку Материаловедения.");
  const user = editor_(data, courseId);
  const name = String(data.name || "Учебный материал.pdf").replace(/[\\\\/:*?"<>|]/g, "_").slice(0, 180);
  const mime = String(data.mimeType || "");
  const base64 = String(data.base64 || "");
  if (mime !== "application/pdf" || !base64) throw new Error("Разрешены только PDF-файлы.");
  if (base64.length > 11200000) throw new Error("Файл слишком большой. Максимальный размер — 8 МБ.");
  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > 8 * 1024 * 1024) throw new Error("Файл превышает ограничение 8 МБ.");
  if (bytes.length < 4 || bytes[0] !== 37 || bytes[1] !== 80 || bytes[2] !== 68 || bytes[3] !== 70) throw new Error("Файл не похож на корректный PDF.");
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty("MATERIALS_PDF_FOLDER_ID");
  let folder;
  if (folderId) {
    try { folder = DriveApp.getFolderById(folderId); } catch (e) { folder = null; }
  }
  if (!folder) {
    folder = DriveApp.createFolder("МДК Портал — библиотека PDF");
    props.setProperty("MATERIALS_PDF_FOLDER_ID", folder.getId());
  }
  const file = folder.createFile(Utilities.newBlob(bytes, mime, name));
  const publicLink = data.shareByLink === true || String(data.shareByLink) === "true";
  if (publicLink) file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    success: true,
    fileId: file.getId(),
    name: file.getName(),
    url: "https://drive.google.com/file/d/" + file.getId() + "/view",
    publicLink: publicLink
  };
}

/* ---------- Teacher-created topics, lectures and tests ---------- */

function getCustomContent_(data) {
  const user = auth_(data);
  const values = content_().getDataRange().getValues();
  const list = [];

  values.slice(1).forEach(function (row) {
    if (!row[0]) return;
    const courseId = String(row[1] || "");
    if (user.role !== "admin" && !hasCourseAccess_(user, courseId)) return;

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
  if (["topic", "lecture", "test", "flashcards", "file", "announcement", "game"].indexOf(type) === -1) {
    throw new Error("Допустимые типы материалов: topic, lecture, test, flashcards, file, announcement, game.");
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
    const state={phase:"lobby",round:0,players:[],pendingNight:{},votes:{},privateMessages:{},log:[],winner:"",updatedAt:now.toISOString()};
    sh.appendRow([code,user.email,JSON.stringify(state),now.toISOString(),expires.toISOString(),"open"]);
    return {success:true,code:code,state:state,isHost:true};
  } finally { lock.releaseLock(); }
}
function publicGameState_(state) { const safe=JSON.parse(JSON.stringify(state)); (safe.players||[]).forEach(p=>{delete p.role;delete p.roleLabel;delete p.email;}); delete safe.privateMessages; delete safe.pendingNight; delete safe.votes; return safe; }
function joinGameRoom_(data) {
  const user=auth_(data), code=String(data.code||"").trim().toUpperCase(), lock=LockService.getScriptLock();
  if(!/^[A-Z2-9]{6}$/.test(code)) throw new Error("Код комнаты должен содержать 6 символов.");
  lock.waitLock(10000);
  try { const room=gameRoomRow_(code); if(!room||room.status!=="open"||new Date(room.expiresAt).getTime()<Date.now()) throw new Error("Комната не найдена или истекла.");
    const state=parseGameState_(room.state); if(user.email===room.hostEmail) return {success:true,code:code,state:state,isHost:true};
    state.players=state.players||[]; const existing=state.players.find(p=>email_(p.email)===user.email);
    if(existing){if(!existing.id)existing.id=Utilities.getUuid();room.sheet.getRange(room.row,3).setValue(JSON.stringify(state));return {success:true,code:code,state:publicGameState_(state),isHost:false,selfId:existing.id,privateRole:existing.role||"",privateMessage:(state.privateMessages||{})[user.email]||""};}
    if(state.phase!=="lobby") throw new Error("Игра уже началась. Новые участники больше не принимаются.");
    if(state.players.length>=12) throw new Error("Комната заполнена (максимум 12 игроков).");
    if(!existing) state.players.push({id:Utilities.getUuid(),email:user.email,name:String(user.name||data.name||"Игрок").slice(0,40),group:String(user.group||""),alive:true,joinedAt:new Date().toISOString()});
    room.sheet.getRange(room.row,3).setValue(JSON.stringify(state)); const joined=(state.players||[]).find(p=>email_(p.email)===user.email); return {success:true,code:code,state:publicGameState_(state),selfId:joined.id,privateRole:joined.role||"",privateMessage:(state.privateMessages||{})[user.email]||""};
  } finally { lock.releaseLock(); }
}
function getGameRoom_(data) {
  const user=auth_(data), room=gameRoomRow_(String(data.code||"").trim().toUpperCase());
  if(!room||new Date(room.expiresAt).getTime()<Date.now()) throw new Error("Комната не найдена или истекла.");
  const state=parseGameState_(room.state), isHost=user.email===room.hostEmail, player=(state.players||[]).find(p=>email_(p.email)===user.email);
  if(!isHost&&!player) throw new Error("Вы не состоите в этой комнате.");
  if(isHost) return {success:true,code:room.code,isHost:true,state:state};
  return {success:true,code:room.code,isHost:false,state:publicGameState_(state),selfId:player.id||"",privateRole:player.role||"",privateMessage:(state.privateMessages||{})[user.email]||""};
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
  const type=String(data.type||""); if(["night_kill","night_check","night_save","vote"].indexOf(type)<0) throw new Error("Неизвестное игровое действие.");
  const payload=data.payload||{}, target=String(payload.target||""); if(target&&!(state.players||[]).some(p=>(String(p.id||"")===target||email_(p.email)===email_(target))&&p.alive!==false)) throw new Error("Выбранная цель недоступна.");
  const lock=LockService.getScriptLock(); lock.waitLock(10000); try { const sh=gameActions_(), id=sh.getLastRow(); sh.appendRow([id,code,user.email,type,JSON.stringify(payload),new Date().toISOString()]); return {success:true,id:id}; } finally { lock.releaseLock(); }
}
function getGameActions_(data) {
  const user=auth_(data), code=String(data.code||"").trim().toUpperCase(), room=gameRoomRow_(code); if(!room) throw new Error("Комната не найдена.");
  const state=parseGameState_(room.state), isHost=user.email===room.hostEmail; if(!isHost) throw new Error("Историю действий видит только ведущий.");
  const after=Math.max(0,Number(data.after)||0), values=gameActions_().getDataRange().getValues(), out=[];
  for(let i=1;i<values.length;i++){const row=values[i],id=Number(row[0])||i;if(String(row[1]).toUpperCase()===code&&id>after){let payload={};try{payload=JSON.parse(row[4]||"{}");}catch(e){}out.push({id:id,email:email_(row[2]),type:String(row[3]),payload:payload,createdAt:row[5]});}}
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
  const m = s.match(/-?\\d+(?:\\.\\d+)?/);
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
