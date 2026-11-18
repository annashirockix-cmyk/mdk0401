import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.ok(start >= 0, "missing source section: " + startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(end > start, "missing end marker for: " + startMarker);
  return source.slice(start, end);
}

test("course, assignment and exam attachments coexist in one Apps Script schema", () => {
  const code = read("Code.gs");
  assert.match(code, /CourseContent:\s*\["Id",\s*"CourseId",\s*"TopicId",\s*"Type",\s*"Title",\s*"Payload"/);
  assert.match(code, /AssignmentSubmissions:\s*\[[^\]]*"AttachmentsJSON"\]/);
  assert.match(code, /AssignmentSubmissionHistory:\s*\[[^\]]*"AttachmentsJSON"\]/);
  assert.match(code, /AssignmentFiles:\s*\[/);
  assert.match(code, /ExamFiles:\s*\[/);

  const setup = section(code, "function setupPortal()", "/* ---------- Common helpers");
  for (const sheet of ["AssignmentFiles", "ExamFiles"]) {
    assert.ok(setup.includes('"' + sheet + '"'), "setupPortal must create " + sheet);
  }
  assert.match(code, /function ensureSheet_\(name\)[\s\S]*?existing\.indexOf\(header\) === -1[\s\S]*?setValue\(header\)/,
    "schema updates must append missing headers without replacing existing rows");
});

test("all three attachment families have server routes and matching handlers", () => {
  const code = read("Code.gs");
  const routes = [
    ["uploadcoursefile", "uploadCourseFile_"],
    ["getcoursefile", "getCourseFile_"],
    ["uploadassignmentattachment", "uploadAssignmentAttachment_"],
    ["getassignmentattachment", "getAssignmentAttachment_"],
    ["uploadexamfile", "uploadExamFile_"],
    ["getexamfile", "getExamFile_"],
    ["deleteexamfile", "deleteExamFile_"]
  ];
  for (const [route, handler] of routes) {
    assert.ok(code.includes('case "' + route + '": result = ' + handler + '(data);'),
      "missing API route " + route);
    assert.ok(code.includes("function " + handler + "(data)"), "missing handler " + handler);
  }
});

test("uploaded course, assignment and exam files are stored in private Drive folders", () => {
  const code = read("Code.gs");
  for (const helper of ["courseFileFolder_", "assignmentFileFolder_", "examFileFolder_"]) {
    const match = code.match(new RegExp("function " + helper + "\\(\\) \\{[\\s\\S]*?\\n\\}"));
    assert.ok(match, "missing Drive folder helper " + helper);
    assert.match(match[0], /folder\.setSharing\(DriveApp\.Access\.PRIVATE,\s*DriveApp\.Permission\.NONE\)/,
      helper + " must enforce private Drive permissions for both new and reused folders");
  }
});

test("downloads retain role, course and publication checks for each attachment family", () => {
  const code = read("Code.gs");
  const course = section(code, "function getCourseFile_(data)", "function saveCustomContent_(data)");
  assert.match(course, /hasCourseAccess_\(\s*user\s*,\s*courseId\s*\)/);
  assert.match(course, /customContentIsOpen_\(courseId, itemId/);

  const assignment = section(code, "function getAssignmentAttachment_(data)", "function submitAssignment_(data)");
  assert.match(assignment, /record\[m\.Status\][^;]*attached/);
  assert.match(assignment, /email_\(record\[m\.StudentEmail\]\)\s*!==\s*user\.email/);
  assert.match(assignment, /hasCourseAccess_\(\s*user\s*,\s*courseId\s*\)/);
  assert.match(assignment, /editor_\(data\s*,\s*courseId\s*\)/);

  const exam = section(code, "function getExamFile_(data)", "function deleteExamFile_(data)");
  assert.match(exam, /hasCourseAccess_\(\s*user\s*,\s*courseId\s*\)/);
  assert.match(exam, /editor_\(data\s*,\s*courseId\s*\)/);
});


test("admin question-bank statistics report usable final-exam readiness, not raw row count", () => {
  const code = read("Code.gs");
  const stats = section(code, "function getQuestionBankStats_(data)", "/**\n * Импорт встроенного банка");
  assert.match(stats, /admin_\(data\)/, "question-bank diagnostics must remain admin-only");
  assert.match(stats, /allFinalExamEntries_\(id\)/, "readiness must use the same eligible-question filter as the exam");
  assert.match(stats, /CFG\.COURSES\.forEach/, "courses with empty banks must still appear as not ready");
  for (const field of ["requiredQuestions", "eligibleUniqueQuestions", "ready", "shortage", "byType", "byBank"]) {
    assert.ok(stats.includes(field), "missing final exam readiness field " + field);
  }
  assert.match(stats, /requiredQuestions:\s*45/);
  assert.match(stats, /eligible\.length\s*>=\s*45/);
  assert.match(stats, /Math\.max\(0,\s*45\s*-\s*eligible\.length\)/);
  assert.match(code, /function allFinalExamEntries_\(courseId\)[\s\S]*?finalQuestionHasAnswerKey_\(q\)/,
    "readiness must exclude questions without valid automatic keys");
});


test("protected question-bank imports back up prior rows and reject weaker exam replacements", () => {
  const code = read("Code.gs");
  const importer = section(code, "function importQuestionBanks_(data)", "function backupQuestionBanks_(data)");
  assert.match(importer, /finalQuestionHasAnswerKey_\(q\)/);
  assert.match(importer, /if\(incoming<previous\)throw new Error/);
  assert.match(importer, /bank-import-/);
  assert.match(importer, /ensureSheet_\("QuestionBankBackup"\)/);
  assert.match(importer, /JSON\.stringify\(row\)/);
  assert.ok(importer.indexOf("backup.getRange") < importer.indexOf("sh.clearContents()"),
    "all target banks must be backed up before any existing rows are cleared");
  assert.match(importer, /backupId:backupId/);
  assert.match(importer, /requestedBackupId=String\(data\.backupId\|\|""\)\.trim\(\)/);
  assert.match(read("api.js"), /importQuestionBanks:function\(banks,backupId\)/);
  const controls = read("teacher-controls.js");
  assert.match(controls, /qb-migration-/);
  assert.match(controls, /restoreQuestionBanks\(backupId\)/);
  assert.match(controls, /Автоматический откат/);

  assert.match(controls, /backupIds\.push\(batchBackupId\)/);
  assert.match(controls, /Резервные копии импортированных банков/);
});

test("final exam readiness rejects ambiguous ordering and matching answer keys", () => {
  const code = read("Code.gs");
  const validator = section(code, "function finalQuestionHasAnswerKey_(q)", "function finalQuestionType_(question)");
  assert.match(validator, /new Set\(items\)\.size!==items\.length/,
    "ordering items must be unique");
  assert.match(validator, /new Set\(expected\)\.size===expected\.length/,
    "the correct order must be an exact permutation without duplicates");
  assert.match(validator, /items\.indexOf\(value\)>=0/,
    "every expected ordering item must exist in the displayed item list");
  assert.match(validator, /new Set\(left\)\.size===left\.length/,
    "matching left labels must be unique");
  assert.match(validator, /new Set\(right\)\.size===right\.length/,
    "matching right labels must be unique");
  assert.match(code, /function scoreFinalAnswer_\(q,answer\)[\s\S]*?if\(type==="order"\)/);
  assert.match(code, /if\(type==="match"\)[\s\S]*?const pairs=q\.pairs\|\|\[\]/);
});


test("final exam scoring never awards points for blank answers, including zero-valued keys", () => {
  const code = read("Code.gs");
  const scorer = section(code, "function scoreFinalAnswer_(q,answer)", "function submitFinalExam_(data)");
  assert.match(scorer, /if\(answer===undefined\|\|answer===null\|\|\(typeof answer==="string"&&!answer\.trim\(\)\)\)return 0;/,
    "blank strings must be rejected before numeric coercion");
  assert.match(scorer, /if\(type==="num"\)/);
  assert.match(scorer, /if\(type==="tf"\)/);
  assert.match(scorer, /Number\(answer\)===Number\(expected\)/,
    "valid numeric zero and option index zero must remain scoreable");
});


test("final exam scoring accepts every answer-key field recognized by readiness validation", () => {
  const code = read("Code.gs");
  const scorer = section(code, "function scoreFinalAnswer_(q,answer)", "function submitFinalExam_(data)");
  assert.match(scorer, /type==="tf"[\s\S]*?q\.answers!==undefined\?q\.answers:q\.answer/,
    "true/false scoring must read the answers fallback");
  assert.match(scorer, /type==="num"[\s\S]*?q\.answers\)/,
    "numeric scoring must read the answers fallback");
  assert.match(scorer, /type==="multi"[\s\S]*?q\.answers!==undefined\?q\.answers:q\.answer/,
    "multiple-choice scoring must read the answers fallback");
  assert.match(scorer, /let expected=q\.correct!==undefined\?q\.correct:[\s\S]*?q\.answers!==undefined\?q\.answers:q\.answer/,
    "single-choice scoring must read the answers fallback");
});


test("numeric final-exam scoring follows the same answer-key precedence as readiness validation", () => {
  const code = read("Code.gs");
  const scorer = section(code, "function scoreFinalAnswer_(q,answer)", "function submitFinalExam_(data)");
  assert.match(scorer, /if\(type==="num"\)\{\s*let expected=q\.correct!==undefined\?q\.correct:\(q\.correctAnswer!==undefined\?q\.correctAnswer:\(q\.answers!==undefined\?q\.answers:q\.answer\)\)/,
    "numeric scoring must prefer correct, correctAnswer, answers, then answer");
});
