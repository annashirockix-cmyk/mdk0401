import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const ui = readFileSync(new URL("../teacher-tasks.js", import.meta.url), "utf8");
const api = readFileSync(new URL("../api.js", import.meta.url), "utf8");
const serviceWorker = readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");

function makeSheet(headers) {
  const rows = [headers.slice()];
  return {
    rows,
    getLastRow() { return rows.length; },
    getLastColumn() { return rows[0].length; },
    getDataRange() { return { getValues: () => rows.map(row => row.slice()) }; },
    getRange(row, column, rowCount = 1, columnCount = 1) {
      return {
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
  const history = makeSheet(["Id","AssignmentId","SubmissionId","StudentEmail","StudentName","Group","Answer","SubmittedAt","AttemptNo","LegacyNote"]);
  users.appendRow(["teacher@example.test","","Преподаватель","","teacher","","07.01,EN","","","",""]);
  users.appendRow(["other.teacher@example.test","","Другой преподаватель","","teacher","","MAT","","","",""]);
  users.appendRow(["english.teacher@example.test","","Преподаватель английского","","teacher","","ENB","","","",""]);
  const payload = JSON.stringify({ xp: 135, manualGrades: { "07.01": 4 }, avatar: "gear", custom: { keep: true } });
  users.appendRow(["student@example.test","","Иван Иванов","ТО-21","student","","07.01",payload,"","",""]);
  users.appendRow(["other.student@example.test","","Пётр Петров","ТО-22","student","","07.01","{}","","",""]);
  users.appendRow(["legacy.english@example.test","","Анна Смирнова","АН-11","student","","EN","{}","","",""]);

  let uuid = 0;
  const notifications = [];
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
    legacyEnglishToken: "legacy.english@example.test"
  };
  sandbox.users_ = () => users;
  sandbox.assignments_ = () => assignments;
  sandbox.assignmentSubmissions_ = () => submissions;
  sandbox.assignmentSubmissionHistory_ = () => history;
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
      courses: String(row[map.Courses] || "")
    };
  };
  sandbox.hasCourseAccess_ = (user, courseId) => {
    if (user.role === "admin") return true;
    const courses = String(user.courses || "").split(",").map(value => value.trim());
    return courses.includes(courseId) || (["ENB","ENT"].includes(courseId) && courses.includes("EN"));
  };
  sandbox.editor_ = (data, courseId) => {
    const user = sandbox.auth_(data);
    if (user.role !== "admin" && !(user.role === "teacher" && sandbox.hasCourseAccess_(user, courseId))) {
      throw new Error("У вас нет прав редактировать эту дисциплину.");
    }
    return user;
  };
  sandbox.createNotification_ = (...args) => notifications.push(args);
  return { sandbox, users, assignments, submissions, history, notifications, originalPayload: payload };
}

test("group assignment workflow works before student onboarding and preserves student payload", async () => {
  const r = runtime();
  const { sandbox: api, users, submissions, history, notifications } = r;

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

  const afterGrade = api.getAssignments_({ token: "studentToken" }).assignments[0].submission;
  assert.equal(afterGrade.status, "reviewed");
  assert.equal(Number(afterGrade.grade), 5);
  assert.match(afterGrade.feedback, /Отличная работа/);
  assert.equal(afterGrade.answer, "Исправленная версия");
  assert.equal(notifications.length, 3);
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
  assert.match(ui, /window\.API\.gradeAssignment/);
  assert.match(api, /createAssignment\s*:/);
  assert.match(api, /getAssignments\s*:/);
  assert.match(api, /submitAssignment\s*:/);
  assert.match(api, /gradeAssignment\s*:/);
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
