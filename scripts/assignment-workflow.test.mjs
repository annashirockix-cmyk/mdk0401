import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const ui = readFileSync(new URL("../teacher-tasks.js", import.meta.url), "utf8");
const journal = readFileSync(new URL("../journal.js", import.meta.url), "utf8");
const api = readFileSync(new URL("../api.js", import.meta.url), "utf8");
const serviceWorker = readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
const studentProgress = readFileSync(new URL("../student-progress.js", import.meta.url), "utf8");
const reports = readFileSync(new URL("../reports.js", import.meta.url), "utf8");

function extractFunction(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.notEqual(start, -1, "missing function " + name);
  const open = source.indexOf("{", start);
  let depth = 0, quote = "", escaped = false, line = false, block = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i], next = source[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && next === "/") { block = false; i++; } continue; }
    if (quote) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === quote) quote = ""; continue; }
    if (c === "/" && next === "/") { line = true; i++; continue; }
    if (c === "/" && next === "*") { block = true; i++; continue; }
    if (c === String.fromCharCode(39) || c === String.fromCharCode(34) || c === String.fromCharCode(96)) { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}

function makeSheet(headers) {
  const rows = [headers.slice()];
  return {
    rows,
    getDataRangeCalls: 0,
    getLastRow() { return rows.length; },
    getLastColumn() { return rows[0].length; },
    getDataRange() { this.getDataRangeCalls++; return { getValues: () => rows.map(row => row.slice()) }; },
    getRange(row, column, rowCount = 1, columnCount = 1) {
      return {
        createTextFinder(value) {
          return {
            matchEntireCell() { return this; },
            matchCase() { return this; },
            findAll() {
              const target = String(value).toLowerCase();
              const found = [];
              for (let r = row; r < row + rowCount; r++) {
                if (String((rows[r - 1] || [])[column - 1] || "").toLowerCase() === target) {
                  found.push({ getRow: () => r });
                }
              }
              return found;
            }
          };
        },
        getValues() {
          const result = [];
          for (let r = 0; r < rowCount; r++) {
            const source = rows[row - 1 + r] || [];
            result.push(Array.from({ length: columnCount }, (_, c) => source[column - 1 + c] ?? ""));
          }
          return result;
        },
        setValues(values) {
          values.forEach((valuesRow, r) => {
            const targetIndex = row - 1 + r;
            while (rows.length <= targetIndex) rows.push(new Array(rows[0].length).fill(""));
            valuesRow.forEach((value, c) => { rows[targetIndex][column - 1 + c] = value; });
          });
        },
        setValue(value) {
          while (rows.length < row) rows.push(new Array(rows[0].length).fill(""));
          rows[row - 1][column - 1] = value;
        }
      };
    },
    appendRow(values) {
      const row = new Array(rows[0].length).fill("");
      values.forEach((value, index) => { row[index] = value; });
      rows.push(row);
    }
  };
}

function runtime() {
  const users = makeSheet(["Email","PasswordHash","Name","Group","Role","UpdatedAt","Courses","Payload","PasswordSalt","LoginChangedAt","PasswordChangedAt"]);
  const assignments = makeSheet(["Id","CourseId","Title","Topic","Level","WorkType","DueAt","TargetType","TargetValue","Instructions","Criteria","CreatedBy","CreatedAt","Status","LegacyNote"]);
  const submissions = makeSheet(["Id","AssignmentId","StudentEmail","StudentName","Group","Answer","SubmittedAt","Status","Grade","Feedback","ReviewedBy","ReviewedAt","LegacyNote"]);
  const history = makeSheet(["Id","AssignmentId","SubmissionId","StudentEmail","StudentName","Group","Answer","SubmittedAt","AttemptNo","Grade","Feedback","ReviewedBy","ReviewedAt","Status","LegacyNote"]);
  const results = makeSheet(["Email","Name","Group","TestId","TestTitle","Grade","Score","MaxScore","Percent","TimeSpent","Attempts","FinishedAt","CourseId","Submission","PenaltyPoints","ViolationCount","Feedback","ReviewedBy","ReviewedAt"]);
  users.appendRow(["teacher@example.test","","Преподаватель","","teacher","","07.01,EN","","","",""]);
  users.appendRow(["other.teacher@example.test","","Другой преподаватель","","teacher","","MAT","","","",""]);
  users.appendRow(["english.teacher@example.test","","Преподаватель английского","","teacher","","ENB","","","",""]);
  const payload = JSON.stringify({ xp: 135, manualGrades: { "07.01": 4 }, avatar: "gear", custom: { keep: true } });
  users.appendRow(["student@example.test","","Иван Иванов","ТО-21","student","","07.01",payload,"","",""]);
  users.appendRow(["other.student@example.test","","Пётр Петров","ТО-22","student","","07.01","{}","","",""]);
  users.appendRow(["legacy.english@example.test","","Анна Смирнова","АН-11","student","","EN","{}","","",""]);
  users.appendRow(["admin@example.test","","Администратор","","admin","","","","","",""]);

  let uuid = 0;
  const notifications = [], audit = [];
  const sandbox = {
    console,
    Utilities: { getUuid: () => "test-uuid-" + (++uuid) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  };
  vm.createContext(sandbox);
  new vm.Script(backend, { filename: "Code.gs" }).runInContext(sandbox);

  const tokenUsers = {
    teacherToken: "teacher@example.test",
    otherTeacherToken: "other.teacher@example.test",
    englishTeacherToken: "english.teacher@example.test",
    studentToken: "student@example.test",
    otherStudentToken: "other.student@example.test",
    legacyEnglishToken: "legacy.english@example.test",
    adminToken: "admin@example.test"
  };
  sandbox.users_ = () => users;
  sandbox.assignments_ = () => assignments;
  sandbox.assignmentSubmissions_ = () => submissions;
  sandbox.assignmentSubmissionHistory_ = () => history;
  sandbox.results_ = () => results;
  sandbox.protectedQuestionBankMap_ = () => ({});
  sandbox.isProtectedAssessment_ = () => false;
  sandbox.auth_ = data => {
    const email = tokenUsers[data && data.token];
    if (!email) throw new Error("Требуется авторизация.");
    const map = sandbox.headerMap_(users);
    const row = users.rows.slice(1).find(item => String(item[map.Email]).toLowerCase() === email);
    if (!row) throw new Error("Пользователь не найден.");
    return {
      email,
      name: String(row[map.Name] || ""),
      group: String(row[map.Group] || ""),
      role: String(row[map.Role] || "student"),
      courses: String(row[map.Courses] || ""),
      payload: String(row[map.Payload] || "{}")
    };
  };
  sandbox.editor_ = (data, courseId) => {
    const user = sandbox.auth_(data);
    if (user.role !== "admin" && !(user.role === "teacher" && sandbox.hasCourseAccess_(user, courseId))) {
      throw new Error("У вас нет прав редактировать эту дисциплину.");
    }
    return user;
  };
  sandbox.createNotification_ = (...args) => notifications.push(args);
  sandbox.appendAttemptAudit_ = record => audit.push(record);
  return { sandbox, users, assignments, submissions, history, results, notifications, audit, originalPayload: payload };
}

test("general English enrollment grants both tracks consistently in server access and journal", () => {
  const access = new Function(extractFunction(backend, "hasCourseAccess_") + "; return hasCourseAccess_;")();
  const legacyStudent = { role: "student", courses: "EN" };
  const legacyTeacher = { role: "teacher", courses: "EN" };
  const basicOnlyStudent = { role: "student", courses: "ENB" };
  assert.equal(access(legacyStudent, "ENB"), true);
  assert.equal(access(legacyStudent, "ENT"), true);
  assert.equal(access(legacyTeacher, "ENB"), true);
  assert.equal(access(legacyTeacher, "ENT"), true);
  assert.equal(access(basicOnlyStudent, "ENT"), false,
    "a student enrolled only in Basic English must not gain Technical English access");
  assert.match(journal, /\(courseId === "ENB" \|\| courseId === "ENT"\).*includes\("EN"\)/);
});

test("teacher student directory is restricted to assigned disciplines", () => {
  const { sandbox: api } = runtime();
  const mechanical = api.getStudents_({ token: "teacherToken" }).students;
  const english = api.getStudents_({ token: "englishTeacherToken" }).students;
  assert.equal(mechanical.some(student => student.email === "legacy.english@example.test"), false,
    "a 07.01 teacher must not receive unrelated English student records");
  assert.equal(english.some(student => student.email === "legacy.english@example.test"), true,
    "an ENB teacher must see a student with legacy general EN enrollment");
  assert.equal(english.some(student => student.email === "student@example.test"), false,
    "an English teacher must not receive unrelated 07.01 student records");
});

test("legacy EN students can receive and submit ENB/ENT assignments without cross-track access", () => {
  const { sandbox: api } = runtime();
  const created = api.createAssignment_({
    token: "englishTeacherToken",
    courseId: "ENB",
    targetType: "individual",
    targetValue: "legacy.english@example.test",
    title: "Basic English assignment",
    instructions: "Write a short technical introduction."
  });
  assert.equal(created.success, true);
  const visible = api.getAssignments_({ token: "legacyEnglishToken" });
  assert.equal(visible.assignments.length, 1);
  const submitted = api.submitAssignment_({
    token: "legacyEnglishToken",
    assignmentId: created.id,
    answer: "I study technical English."
  });
  assert.equal(submitted.success, true);
  assert.equal(submitted.attempt, 1);
  assert.equal(
    api.getAssignments_({ token: "studentToken" }).assignments.some(item => item.courseId === "ENB"),
    false,
    "students enrolled only in 07.01 must not see English assignments"
  );
});

test("assignment resubmission is allowed after a grade of 2 but not after acceptance", () => {
  const { sandbox: api } = runtime();
  const created = api.createAssignment_({
    token: "teacherToken",
    courseId: "07.01",
    targetType: "group",
    targetValue: "ТО-21",
    title: "Повторная работа",
    instructions: "Исправьте программу."
  });
  const first = api.submitAssignment_({ token: "studentToken", assignmentId: created.id, answer: "Первая версия" });
  api.gradeAssignment_({ token: "teacherToken", submissionId: first.submissionId, grade: 2, feedback: "Нужна доработка." });
  const retry = api.submitAssignment_({ token: "studentToken", assignmentId: created.id, answer: "Исправленная версия" });
  assert.equal(retry.attempt, 2);
  const afterRetry = api.getAssignments_({ token: "studentToken" }).assignments[0].submission;
  assert.equal(afterRetry.status, "submitted");
  assert.equal(afterRetry.history[0].grade, 2);
  assert.match(afterRetry.history[0].feedback, /Нужна доработка/);
  assert.equal(afterRetry.history[0].status, "reviewed");
});

test("reviewed assignments are included in public subject averages", () => {
  const { sandbox: api } = runtime();
  const created = api.createAssignment_({
    token: "teacherToken",
    courseId: "07.01",
    targetType: "group",
    targetValue: "ТО-21",
    title: "Оценочная практическая работа",
    instructions: "Выполните задание."
  });
  const submitted = api.submitAssignment_({
    token: "studentToken",
    assignmentId: created.id,
    answer: "Выполненная работа"
  });
  api.gradeAssignment_({
    token: "teacherToken",
    submissionId: submitted.submissionId,
    grade: 4,
    feedback: "Верно."
  });

  const response = api.getPublicSubjectRatings_({ token: "studentToken" });
  const student = response.ratings["07.01"].find(item => item.name === "Иван Иванов");
  assert.ok(student, "the student's course rating should be returned");
  assert.equal(student.averageGrade, 4);
  assert.equal(student.completed, 1);

  const zeroAssignment = api.createAssignment_({
    token: "teacherToken", courseId: "07.01", targetType: "group",
    targetValue: "ТО-21", title: "Работа с нулевой оценкой",
    instructions: "Проверка корректного учёта оценки 0."
  });
  const zeroSubmission = api.submitAssignment_({
    token: "studentToken", assignmentId: zeroAssignment.id, answer: "Ответ"
  });
  api.gradeAssignment_({
    token: "teacherToken", submissionId: zeroSubmission.submissionId,
    grade: 0, feedback: "Работа не выполнена."
  });
  const zeroPublic = api.getPublicSubjectRatings_({ token: "studentToken" });
  const zeroStudent = zeroPublic.ratings["07.01"].find(item => item.name === "Иван Иванов");
  assert.equal(zeroStudent.averageGrade, 2, "a reviewed zero must count alongside the earlier grade 4");
  assert.equal(zeroStudent.completed, 2, "a reviewed zero is a completed, graded assignment");
  const zeroSummary = api.getMyCourseResults_({ token: "studentToken", courseId: "07.01" }).summary;
  assert.equal(zeroSummary.graded, 2);
  assert.equal(zeroSummary.averageGrade, 2);
});

test("manual and written grades expose feedback separately in student course results", () => {
  const { sandbox: api, results } = runtime();

  api.saveManualGrade_({
    token: "teacherToken",
    email: "student@example.test",
    courseId: "07.01",
    testTitle: "Ручная оценка",
    grade: 4,
    date: "2026-11-15",
    feedback: "Исправьте оформление чертежа."
  });
  const manualView = api.getMyCourseResults_({ token: "studentToken", courseId: "07.01" });
  const manual = manualView.results.find(item => item.testTitle === "Ручная оценка");
  assert.ok(manual);
  assert.equal(manual.grade, 4);
  assert.equal(manual.payload, "");
  assert.equal(manual.feedback, "Исправьте оформление чертежа.");
  assert.equal(manual.reviewedBy, "teacher@example.test");
  assert.ok(manual.reviewedAt);
  const savedManualAgain = api.saveManualGrade_({
    token:"teacherToken",email:"student@example.test",courseId:"07.01",
    testTitle:"Ручная оценка",grade:5,date:"2026-11-15",feedback:"Уточнённый комментарий."
  });
  assert.equal(savedManualAgain.testId, manual.testId);
  const updatedManualView = api.getMyCourseResults_({token:"studentToken",courseId:"07.01"});
  assert.equal(updatedManualView.results.filter(item=>item.testId===manual.testId).length,1);
  assert.equal(updatedManualView.results.find(item=>item.testId===manual.testId).grade,5);
  assert.equal(updatedManualView.results.find(item=>item.testId===manual.testId).feedback,"Уточнённый комментарий.");
  assert.ok(reports.includes("((x.payload||x.feedback)?"), "reports must display a comment even when the submission text is empty");
  assert.ok(studentProgress.includes('feedback:x.feedback||""'), "student timeline must include written and manual grade feedback");
  assert.ok(studentProgress.includes('grade:h.grade!==undefined&&h.grade!==null&&h.grade!==""?h.grade:(latest?x.grade:null)'), "student timeline must retain grades from earlier reviewed attempts");
  assert.ok(studentProgress.includes('feedback:h.feedback||(latest?x.feedback:"")'), "student timeline must retain teacher feedback from earlier attempts");

  results.appendRow([
    "student@example.test", "Иван Иванов", "ТО-21", "prac_demo", "Письменная работа",
    0, 0, 5, 0, 0, 1, "2026-11-14T10:00:00.000Z", "07.01",
    "Ответ студента", 0, 0, "", "", ""
  ]);
  api.gradeWrittenResult_({
    token: "teacherToken",
    email: "student@example.test",
    courseId: "07.01",
    testId: "prac_demo",
    grade: 5,
    feedback: "Отличное решение."
  });
  const writtenView = api.getMyCourseResults_({ token: "studentToken", courseId: "07.01" });
  const written = writtenView.results.find(item => item.testId === "prac_demo");
  assert.ok(written);
  assert.equal(written.payload, "Ответ студента");
  assert.equal(written.feedback, "Отличное решение.");
  assert.equal(written.reviewedBy, "teacher@example.test");
  assert.ok(written.reviewedAt);
});

test("group assignment workflow works before student onboarding and preserves student payload", async () => {
  const r = runtime();
  const { sandbox: api, users, submissions, history, notifications, audit } = r;

  const created = api.createAssignment_({
    token: "teacherToken",
    courseId: "07.01",
    targetType: "group",
    targetValue: "ТО-21",
    title: "Подготовить фрагмент УП",
    topic: "G-код",
    level: "Средний",
    workType: "Практическое задание",
    dueAt: "2026-12-01",
    instructions: "Составьте безопасный фрагмент программы.",
    criteria: "Корректность — 5 баллов"
  });
  assert.equal(created.success, true);
  assert.equal(created.recipients, 1);

  const studentView = api.getAssignments_({ token: "studentToken" });
  assert.equal(studentView.assignments.length, 1);
  assert.equal(studentView.assignments[0].submission, null);
  assert.equal(api.getAssignments_({ token: "otherStudentToken" }).assignments.length, 0);

  assert.throws(
    () => api.submitAssignment_({ token: "otherStudentToken", assignmentId: created.id, answer: "чужой ответ" }),
    /доступ/
  );

  const first = api.submitAssignment_({ token: "studentToken", assignmentId: created.id, answer: "Первая версия" });
  assert.equal(first.attempt, 1);
  submissions.rows[1][submissions.rows[0].indexOf("LegacyNote")] = "не перезаписывать";
  await new Promise(resolve => setTimeout(resolve, 5));
  const second = api.submitAssignment_({ token: "studentToken", assignmentId: created.id, answer: "Исправленная версия" });
  assert.equal(second.attempt, 2);
  assert.equal(submissions.rows[1][submissions.rows[0].indexOf("LegacyNote")], "не перезаписывать");
  assert.equal(history.rows.length, 3);
  assert.deepEqual(history.rows.slice(1).map(row => row[history.rows[0].indexOf("AttemptNo")]), [1, 2]);

  const teacherView = api.getAssignments_({ token: "teacherToken" });
  assert.equal(teacherView.assignments[0].submissions.length, 1);
  assert.equal(teacherView.assignments[0].submissions[0].attempts, 2);

  assert.throws(
    () => api.gradeAssignment_({ token: "otherTeacherToken", submissionId: second.submissionId, grade: 5 }),
    /прав/
  );
  const graded = api.gradeAssignment_({
    token: "teacherToken",
    submissionId: second.submissionId,
    grade: 5,
    feedback: "Отличная работа. Последовательность команд корректна."
  });
  assert.equal(graded.success, true);
  assert.throws(
    () => api.gradeAssignment_({ token: "teacherToken", submissionId: second.submissionId, grade: 4, feedback: "Повторная оценка" }),
    /только администратору/
  );
  assert.equal(submissions.rows[1][submissions.rows[0].indexOf("Grade")], 5,
    "a teacher must not overwrite a reviewed assignment grade");
  assert.equal(audit.filter(item => item.EventType === "assignment_graded").length, 1);
  assert.throws(
    () => api.gradeAssignment_({ token: "adminToken", submissionId: second.submissionId, grade: 4 }),
    /только администратору/
  );
  const regraded = api.gradeAssignment_({ token: "adminToken", submissionId: second.submissionId, grade: 4, feedback: "Административная корректировка", regrade: true });
  assert.equal(regraded.success, true);
  assert.equal(submissions.rows[1][submissions.rows[0].indexOf("Grade")], 4);
  assert.equal(audit.filter(item => item.EventType === "assignment_regraded").length, 1);
  assert.throws(
    () => api.submitAssignment_({ token: "studentToken", assignmentId: created.id, answer: "Попытка после зачёта" }),
    /уже проверена и зачтена/
  );

  const submissionReadsBeforeStudentView = submissions.getDataRangeCalls;
  const historyReadsBeforeStudentView = history.getDataRangeCalls;
  const afterGrade = api.getAssignments_({ token: "studentToken" }).assignments[0].submission;
  assert.equal(submissions.getDataRangeCalls, submissionReadsBeforeStudentView,
    "student view must not load every student's submission rows");
  assert.equal(history.getDataRangeCalls, historyReadsBeforeStudentView,
    "student view must not load every student's attempt history");
  assert.equal(afterGrade.status, "reviewed");
  assert.equal(Number(afterGrade.grade), 4);
  assert.match(afterGrade.feedback, /Административная корректировка/);
  assert.equal(afterGrade.answer, "Исправленная версия");
  // Уведомление о назначении студенту, два уведомления преподавателю
  // (первая отправка и пересдача), первоначальная оценка и административная корректировка.
  assert.equal(notifications.length, 5);
  assert.deepEqual(notifications.map(item => item[1]), ["assignment","submission","submission","grade","grade"]);
  assert.equal(notifications.filter(item => item[0] === "student@example.test").length, 3);
  assert.equal(notifications.filter(item => item[0] === "teacher@example.test").length, 2);
  const unchangedStudentRow = users.rows.find(row => row[0] === "student@example.test");
  assert.equal(unchangedStudentRow[7], r.originalPayload);
});

test("group assignments may be prepared without any connected students", () => {
  const r = runtime();
  const { sandbox: api, users } = r;
  users.rows.splice(3);
  const created = api.createAssignment_({
    token: "teacherToken",
    courseId: "07.01",
    targetType: "group",
    targetValue: "НОВАЯ-ГРУППА",
    title: "Задание до регистрации",
    instructions: "Текст задания"
  });
  assert.equal(created.success, true);
  assert.equal(created.recipients, 0);
  assert.equal(api.getAssignments_({ token: "teacherToken" }).assignments.length, 1);
  assert.throws(
    () => api.createAssignment_({ token: "teacherToken", courseId: "07.01", targetType: "individual", targetValue: "missing@example.test", title: "Индивидуальное", instructions: "Текст" }),
    /не найден/
  );
  assert.throws(
    () => api.createAssignment_({ token: "teacherToken", courseId: "07.01", targetType: "group", targetValue: "НОВАЯ-ГРУППА", dueAt: "2026-02-31", title: "Некорректный срок", instructions: "Текст" }),
    /некорректная дата/
  );
  users.appendRow(["student@example.test","","Новый студент","НОВАЯ-ГРУППА","student","","07.01","{}","","",""]);
  const newlyConnectedStudent = api.getAssignments_({ token: "studentToken" });
  assert.equal(newlyConnectedStudent.assignments.length, 1);
  assert.equal(newlyConnectedStudent.assignments[0].submission, null);
});

test("legacy EN course access is respected for ENB individual assignments", () => {
  const r = runtime();
  const created = r.sandbox.createAssignment_({
    token: "teacherToken",
    courseId: "ENB",
    targetType: "individual",
    targetValue: "legacy.english@example.test",
    title: "Technical vocabulary",
    instructions: "Translate the terms."
  });
  assert.equal(created.success, true);
  assert.equal(created.recipients, 1);
  const visible = r.sandbox.getAssignments_({ token: "legacyEnglishToken" });
  assert.equal(visible.assignments.length, 1);
  const englishTeacherStudents = r.sandbox.getStudents_({ token: "englishTeacherToken" });
  const legacyStudent = englishTeacherStudents.students.find(student => student.email === "legacy.english@example.test");
  assert.ok(legacyStudent.courses.includes("EN"));
});

test("assignment UI, API wiring and offline cache stay connected", () => {
  new vm.Script(ui, { filename: "teacher-tasks.js" });
  new vm.Script(api, { filename: "api.js" });
  new vm.Script(serviceWorker, { filename: "service-worker.js" });
  assert.match(ui, /Групповое задание можно назначить и до подключения всех обучающихся/);
  assert.match(ui, /Опубликовано для группы/);
  assert.match(ui, /Ожидают отправки/);
  assert.match(ui, /ENB":"Английский язык — базовый/);
  assert.match(ui, /ENT":"Английский язык — технический/);
  assert.match(ui, /window\.API\.createAssignment/);
  assert.match(ui, /window\.API\.submitAssignment/);
  assert.match(ui, /Работа проверена и зачтена\. Повторная отправка не требуется/);
  assert.match(ui, /Отправить исправленную работу/);
  assert.match(ui, /Комментарий преподавателя:/);
  assert.match(journal, /window\.API\.saveManualGrade\(/);
  assert.match(journal, /window\.API\.getResults\(\{courseId:window\.state\.activeCourseId\}\)/);
  assert.match(journal, /manualByStudent\[String\(s\.email\|\|""\)\.toLowerCase\(\)\+"\|"+dateInput\]/);
  assert.match(journal, /escapeHtml\(currentFeedback\)/);
  assert.doesNotMatch(journal.slice(journal.indexOf("function renderManual"), journal.indexOf('document.getElementById("tabAuto")')), /window\.API\.saveStudent/);
  assert.match(backend, /AssignmentSubmissionHistory: \[[^\]]*"Grade"[^\]]*"Feedback"/);
  assert.match(ui, /window\.API\.gradeAssignment/);
  assert.match(ui, /Подтверждаю повторное выставление оценки/);
  assert.match(ui, /actor\.role==="admin"/);
  assert.match(api, /regrade:regrade===true/);
  assert.match(api, /createAssignment\s*:/);
  assert.match(api, /getAssignments\s*:/);
  assert.match(api, /submitAssignment\s*:/);
  assert.match(api, /gradeAssignment\s*:/);
  assert.ok(studentProgress.includes('&&!/^assignment_/.test(String(x.testId||""))'), "assignment grades must be counted from submission history only, not twice from getResults and getAssignments");
  assert.match(serviceWorker, /portal-cache-v\d+/);
  assert.match(serviceWorker, /\.\/teacher-tasks\.js/);
});

test("Apps Script assignment functions do not write into Users.Payload", () => {
  new vm.Script(backend, { filename: "Code.gs" });
  const start = backend.indexOf("function createAssignment_(data)");
  const end = backend.indexOf("/* ---------- Teacher controls", start);
  const assignmentModule = backend.slice(start, end);
  assert.doesNotMatch(assignmentModule, /Payload|payload/);
  assert.match(backend, /function appendMappedRecord_\(sheet, record\)/);
  assert.match(backend, /function updateMappedRecord_\(sheet, rowNumber, record\)/);
});
