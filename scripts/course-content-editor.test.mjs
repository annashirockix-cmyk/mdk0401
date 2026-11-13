import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
test("custom lecture and test content has one student rendering path", () => {
 const app = read("app.js");
 const editor = read("course-admin.js");
 const html = read("index.html");
 const sw = read("service-worker.js"); const css = read("style.css"); const enrichment = read("lecture-enrichment.js");
 assert.ok(html.includes("course-admin.js?v=19"));
 assert.ok(app.includes("customTopicLectures"));
 assert.ok(app.includes("customTopicTests"));
 assert.ok(app.includes("window.startCustomInlineTest"));
 assert.ok(!editor.includes("window.renderTopicPage=function"));
 assert.ok(!editor.includes("function customRecords("));
 assert.ok(editor.includes("type:\"lecture\""));
 assert.ok(editor.includes("type:\"test\""));
 assert.match(sw, /portal-cache-v[0-9]+/); assert.ok(css.includes(".lec-content img"));
 assert.ok(enrichment.includes('["07.01","SPRUT_TP","basic","technical","EN","ENB","ENT"].indexOf(id)>=0'));
});
test("custom lecture sanitizer preserves safe images and figure captions", () => {
 const app = read("app.js");
 assert.ok(app.includes("\"FIGURE\",\"FIGCAPTION\",\"IMG\""));
 assert.ok(app.includes("node.tagName === \"IMG\" && name === \"src\""));
 assert.ok(app.includes("png|jpeg|gif|webp"));
 assert.ok(app.includes("\"alt\", \"width\", \"height\", \"loading\""));
});
test("flashcard constructor saves and reopens saved sets", () => {
 const workflow = read(".github/workflows/portal-syntax.yml");
 const audit = read("scripts/course-constructor-browser-audit.mjs");
 assert.ok(workflow.includes("Run real-browser course constructor round-trip audit"));
 assert.ok(audit.includes("Содержимое тестовой лекции"));
 assert.ok(audit.includes("Карточки конструктора"));
 const cards = read("flashcard-editor.js");
 assert.ok(cards.includes("type:\"flashcards\""));
 assert.ok(cards.includes("function renderSaved("));
 assert.ok(cards.includes("function loadSet("));
});

test("global custom-content loads ignore stale responses after account changes", () => {
 const app = read("app.js");
 assert.ok(app.includes("window.invalidateGlobalCustomContentLoad = function(clearContent)"));
 assert.ok(app.includes("requestId === window._customContentLoadRequestId"));
 assert.ok(app.includes("currentToken === token"));
 assert.ok(app.includes("currentIdentity.email"));
 assert.ok(app.includes("window.invalidateGlobalCustomContentLoad(true)"));
});

test("custom content upserts serialize duplicate-ID checks and writes", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function saveCustomContent_(data)");
 const end = server.indexOf("\nfunction deleteCustomContent_(data)", start);
 assert.ok(start >= 0 && end > start);
 const save = server.slice(start, end);
 const lock = save.indexOf("LockService.getScriptLock()");
 const wait = save.indexOf("lock.waitLock(10000)");
 const authorization = save.indexOf("editor_(data, courseId)");
 const readIndex = save.indexOf("sheet.getDataRange().getValues()");
 const write = Math.max(save.indexOf("sheet.getRange(targetRow"), save.indexOf("sheet.appendRow(row)"));
 const release = save.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock, "acquire a script-wide lock before reading");
 assert.ok(authorization > wait && readIndex > authorization, "re-check current editor permissions inside the lock before reading or writing");
 assert.ok(write > readIndex, "keep duplicate lookup and write inside the lock");
 assert.ok(release > write && save.includes("finally {"), "release the lock even when a save fails");
});

test("custom content deletion shares the upsert lock", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function deleteCustomContent_(data)");
 const end = server.indexOf("\n/* ---------- Administrator", start);
 assert.ok(start >= 0 && end > start);
 const remove = server.slice(start, end);
 const lock = remove.indexOf("LockService.getScriptLock()");
 const wait = remove.indexOf("lock.waitLock(10000)");
 const readIndex = remove.indexOf("sheet.getDataRange().getValues()");
 const deletion = remove.indexOf("sheet.deleteRow(");
 const release = remove.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock && readIndex > wait && deletion > readIndex);
 assert.ok(release > deletion && remove.includes("finally {"), "delete must release the shared lock");
});

test("custom test attempts are counted within the selected course", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function submitCustomTest_(data)");
 const end = server.indexOf("\nfunction getGameAnswer_", start);
 assert.ok(start >= 0 && end > start);
 const submit = server.slice(start, end);
 assert.match(submit, /email_\(r\[0\]\)===user\.email&&String\(r\[3\]\)===attemptKey&&sameCourseId_\(r\[12\]\|\|record\.courseId,record\.courseId\)/,
  "attempt history must be scoped by student, test ID, and course ID");
 const statusStart = server.indexOf("function getTestAttemptStatus_(data)");
 const statusEnd = server.indexOf("\nfunction requestTestAttempts_", statusStart);
 const status = server.slice(statusStart, statusEnd);
 assert.match(status, /sameCourseId_\(r\[12\]\|\|courseId,courseId\)/,
  "the displayed attempt status and submission check must use the same course scope");
});


test("custom test submissions resolve the test within the active course", () => {
 const server = read("Code.gs");
 const api = read("api.js");
 const app = read("app.js");
 const start = server.indexOf("function submitCustomTest_(data)");
 const end = server.indexOf("\nfunction getGameAnswer_", start);
 const submit = server.slice(start, end);
 assert.match(submit, /requestedCourseId = String\(data\.courseId \|\| data\.mdkId \|\| ""\)/);
 assert.match(submit, /String\(row\[0\]\) === id && String\(row\[3\]\) === "test" && sameCourseId_\(row\[1\], requestedCourseId\)/);
 assert.match(api, /submitCustomTest:function\(testId,answers,timeSpent,courseId\)/);
 assert.match(app, /submitCustomTest\(testId, answers, Math\.round\(\(Date\.now\(\)-started\)\/1000\), test\.courseId \|\| test\.mdkId\)/);
});

test("custom content deletion is scoped to the requested course", () => {
 const server = read("Code.gs");
 const api = read("api.js");
 const editor = read("course-admin.js");
 const start = server.indexOf("function deleteCustomContent_(data)");
 const end = server.indexOf("\n/* ---------- Administrator", start);
 assert.ok(start >= 0 && end > start);
 const remove = server.slice(start, end);
 assert.match(remove, /courseId = String\(data\.courseId \|\| data\.mdkId \|\| ""\)/);
 assert.match(remove, /editor_\(data, courseId\)/);
 assert.match(remove, /String\(values\[i\]\[0\]\) === id && sameCourseId_\(values\[i\]\[1\], courseId\)/);
 assert.match(api, /deleteCustomContent:function\(id,courseId\)/);
 assert.equal((editor.match(/deleteCustomContent\(id,courseSel\.value\)/g) || []).length, 2);
});

test("settings upserts serialize lookup and writes", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function writeSetting_(key,value,actorEmail,lockAlreadyHeld)");
 const end = server.indexOf("\nfunction getTopicAccess_", start);
 assert.ok(start >= 0 && end > start);
 const write = server.slice(start, end);
 const lock = write.indexOf("LockService.getScriptLock()");
 const wait = write.indexOf("lock.waitLock(10000)");
 const lookup = write.indexOf("sh.getDataRange().getValues()");
 const update = Math.max(write.indexOf("sh.getRange(row"), write.indexOf("sh.appendRow(record)"));
 const release = write.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock && lookup > wait && update > lookup);
 assert.ok(release > update && write.includes("finally {"));
 const grantStart = server.indexOf("function grantTestAttempts_(data)");
 const grantEnd = server.indexOf("\n/* ---------- Teacher-created", grantStart);
 const grant = server.slice(grantStart, grantEnd);
 assert.match(grant, /lock\.waitLock\(10000\)/);
 assert.match(grant, /writeSetting_\("testAttempts:"\+studentEmail\+":"\+courseId\+":"\+testId,String\(extra\),teacher\.email,true\)/,
  "attempt grants must reuse the existing lock instead of acquiring it recursively");
 assert.ok(grant.indexOf("lock.waitLock(10000)") < grant.indexOf("teacher=editor_(data,courseId)"));
 assert.ok(grant.indexOf("lock.waitLock(10000)") < grant.indexOf("student=userByEmail_(studentEmail)"),
  "teacher permission and student enrollment must be rechecked inside the lock");
});


test("student custom-content delivery enforces publication switches and strips answer keys", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function getCustomContent_(data)");
 const end = server.indexOf("/* ---------- Private built-in question bank", start);
 assert.ok(start >= 0 && end > start);
 const delivery = server.slice(start, end);
 assert.match(delivery, /const user = auth_\(data\)/);
 assert.match(delivery, /user\.role !== "admin" && !hasCourseAccess_\(user, courseId\)/);
 assert.match(delivery, /user\.role === "student" && !customContentIsOpen_\(/);
 for (const key of ["correct", "answer", "correctAnswer", "answers", "explanation", "solution", "key"]) {
  assert.ok(delivery.includes('"'+key+'"'), "student delivery must remove "+key);
 }
 assert.match(delivery, /return \{ success: true, data: list \}/);
});

test("custom test grading reads the protected answer key from Sheets, not the browser payload", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function submitCustomTest_(data)");
 const end = server.indexOf("\\nfunction getGameAnswer_", start);
 assert.ok(start >= 0 && end > start);
 const submit = server.slice(start, end);
 assert.match(submit, /const values = content_\(\)\.getDataRange\(\)\.getValues\(\)/);
 assert.match(submit, /payload: JSON\.parse\(row\[5\] \|\| "\{\}"\)/);
 assert.match(submit, /const questions = Array\.isArray\(record\.payload\.questions\)/);
 assert.match(submit, /selected === Number\(q\.correct\)/);
 assert.match(submit, /customContentIsOpen_\(record\.courseId, record\.id, record\.topicId, record\.type\)/);
 assert.doesNotMatch(submit, /data\.questions/);
 assert.match(submit, /LockService\.getScriptLock\(\)/);
});

test("teacher publication controls call server-backed topic and material access APIs", () => {
 const controls = read("teacher-controls.js");
 const api = read("api.js");
 const server = read("Code.gs");
 assert.match(controls, /API\.setTopicAccess\(cid,btn\.dataset\.topic,open\)/);
 assert.match(controls, /API\.setCustomContentAccess\(cid,id,open\)/);
 assert.match(api, /setCustomContentAccess:function\(courseId,id,open\)/);
 assert.match(api, /setTopicAccess:function\(courseId,topicId,open\)/);
 assert.match(server, /function setCustomContentAccess_\(data\)/);
 assert.match(server, /function setTopicAccess_\(data\)/);
 assert.match(server, /function customContentIsOpen_\(courseId, contentId, topicId, contentType\)/);
});
