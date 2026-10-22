// Code.gs — Бэкенд (Google Apps Script)
const SPREAD_ID = "1WjmKFwl4uuU_4-vxoTBp776LPeF2MsfbOei4q5HPlJs";
const SHEET_STUDENTS = "Students", SHEET_CHAT = "Chat", SHEET_LOGINS = "Logins", SHEET_SCHEDULE = "Schedule";

function getHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function doOptions(e) {
  return ContentService.createTextOutput("").setHeaders(getHeaders());
}

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var p = Object.assign({}, (e && e.parameter) || {});
    try { if (e && e.postData && e.postData.contents) Object.assign(p, JSON.parse(e.postData.contents)); } catch (x) {}
    
    var action = String(p.action || "").toLowerCase();
    var r = { ok: false, error: "Unknown action" };

    if (action === "login") r = loginUser(p.username, p.password);
    else if (action === "getstudents") r = getStudents();
    else if (action === "save") r = saveStudent(p.key, p.name, p.group, p.payload);
    else if (action === "grantxp") r = grantXP(p.key, p.amount);
    else if (action === "chatload") r = loadChat(p.group);
    else if (action === "chatsave") r = saveChat(p.group, p.key, p.name, p.text);
    else if (action === "getschedule") r = getSchedule();
    else if (action === "saveschedule") r = saveSchedule(p.data);

    return ContentService.createTextOutput(JSON.stringify(r))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(getHeaders());
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(getHeaders());
  } finally { 
    lock.releaseLock(); 
  }
}

function getSheet(name) {
  var ss = SpreadsheetApp.openById(SPREAD_ID), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (name === SHEET_STUDENTS) sh.appendRow(["ID", "Name", "Group", "Payload", "LastUpdate"]);
    if (name === SHEET_CHAT) sh.appendRow(["Timestamp", "Group", "Key", "Name", "Text"]);
    if (name === SHEET_LOGINS) sh.appendRow(["Login", "Password", "Role", "Name"]);
    if (name === SHEET_SCHEDULE) sh.appendRow(["Data"]);
  }
  return sh;
}

function loginUser(u, pw) {
  var d = getSheet(SHEET_LOGINS).getDataRange().getValues();
  for (var i = 1; i < d.length; i++)
    if (String(d[i][0]) === String(u) && String(d[i][1]) === String(pw))
      return { ok: true, role: d[i][2] || "teacher", name: d[i][3] || u };
  return { ok: false, error: "Неверный логин или пароль" };
}
function getStudents() {
  var d = getSheet(SHEET_STUDENTS).getDataRange().getValues(), a = [];
  for (var i = 1; i < d.length; i++) if (d[i][0]) a.push({ key: d[i][0], name: d[i][1], group: d[i][2], payload: d[i][3] });
  return { ok: true, students: a };
}
function saveStudent(key, name, group, payload) {
  var sh = getSheet(SHEET_STUDENTS), d = sh.getDataRange().getValues(), now = new Date();
  for (var i = 1; i < d.length; i++) if (d[i][0] === key) {
    sh.getRange(i + 1, 2, 1, 4).setValues([[name, group, payload, now]]);
    return { ok: true };
  }
  sh.appendRow([key, name, group, payload, now]);
  return { ok: true };
}
function grantXP(key, amount) {
  var sh = getSheet(SHEET_STUDENTS), d = sh.getDataRange().getValues();
  for (var i = 1; i < d.length; i++) if (d[i][0] === key) {
    var p = {}; try { p = JSON.parse(d[i][3] || "{}"); } catch (e) {}
    p.xp = Math.max(0, (p.xp || 0) + parseInt(amount, 10));
    sh.getRange(i + 1, 4).setValue(JSON.stringify(p));
    return { ok: true, newXp: p.xp };
  }
  return { ok: false, error: "Student not found" };
}
function loadChat(group) {
  var d = getSheet(SHEET_CHAT).getDataRange().getValues(), m = [];
  for (var i = 1; i < d.length; i++) if (d[i][1] === group) m.push({ time: d[i][0], name: d[i][3], text: d[i][4] });
  return { ok: true, messages: m.slice(-50) };
}
function saveChat(group, key, name, text) { getSheet(SHEET_CHAT).appendRow([new Date(), group, key, name, text]); return { ok: true }; }
function getSchedule() {
  var sh = getSheet(SHEET_SCHEDULE), v = sh.getRange(2, 1).getValue();
  return { ok: true, schedule: v || "{}" };
}
function saveSchedule(data) { getSheet(SHEET_SCHEDULE).getRange(2, 1).setValue(data); return { ok: true }; }