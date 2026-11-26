import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const loadTest = readFileSync(new URL("./gas-read-load-test.mjs", import.meta.url), "utf8");
const adminPanel = readFileSync(new URL("../course-admin.js", import.meta.url), "utf8");
const server = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");

function extractFunction(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0, "missing function " + name);
  const open = source.indexOf("{", start);
  let depth = 0, quote = "", escaped = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}

test("registration requires surname, first name and a normalized study group on the server", () => {
  const fn = extractFunction(server, "register_");
  assert.match(fn, /if \(!surname \|\| !firstName\) return/);
  assert.match(fn, /if \(!group\) return \{ success: false, error: "Укажите учебную группу\." \}/);
  assert.match(fn, /const group = normalizeGroupName_\(data\.group\)/);
});

test("manual student account creation requires a normalized study group", () => {
  const fn = extractFunction(server, "adminCreateUser_");
  assert.match(fn, /const name = String\(data\.name \|\| ""\)\.trim\(\), group = normalizeGroupName_\(data\.group\)/);
  assert.match(fn, /if \(role === "student" && !group\) throw new Error\("Укажите учебную группу студенту\."\)/);
  assert.match(adminPanel, /data\.role==="student"&&!data\.group/);
});

test("changing a user role to student requires an existing normalized group", () => {
  const fn = extractFunction(server, "setUserRole_");
  assert.match(fn, /role === "student" && !normalizeGroupName_\(target\.group\)/);
  assert.match(fn, /Перед назначением роли student укажите учебную группу в таблице пользователей/);
});

test("profile sync cannot change or clear a student's study group", () => {
  const fn = extractFunction(server, "saveStudent_");
  assert.match(fn, /const requestedGroup = normalizeGroupName_\(data\.group\)/);
  assert.match(fn, /const existingGroup = normalizeGroupName_\(target\.group\)/);
  assert.match(fn, /current\.role !== "admin" && requestedGroup !== existingGroup/);
  assert.match(fn, /Изменять учебную группу может только администратор/);
  assert.match(fn, /current\.role === "admin" && target\.role === "student" && !requestedGroup/);
  assert.match(fn, /Для студента учебная группа обязательна/);
});

test("saveStudent_ enforces study-group changes at runtime", () => {
  const normalize = new Function(extractFunction(server, "normalizeGroupName_") + "; return normalizeGroupName_;")();
  function harness(role, targetRole, targetGroup) {
    let written = null;
    const save = new Function(
      "auth_", "email_", "userByEmail_", "normalizeGroupName_", "writeUserFields_",
      extractFunction(server, "saveStudent_") + "; return saveStudent_;"
    )(
      () => ({ email: "student@example.test", role }),
      value => String(value || "").trim().toLowerCase(),
      () => ({ email: "student@example.test", role: targetRole, group: targetGroup, courses: "", payload: "" }),
      normalize,
      (_target, fields) => { written = fields; }
    );
    return { save, getWritten: () => written };
  }

  const student = harness("student", "student", "МДК-01");
  assert.throws(() => student.save({ token: "session", group: "МДК-02" }), /Изменять учебную группу может только администратор/);
  assert.equal(student.getWritten(), null, "rejected student change must not write user fields");

  const sameGroup = harness("student", "student", "мдк–01");
  assert.equal(sameGroup.save({ token: "session", group: "МДК-01" }).success, true);
  assert.equal(sameGroup.getWritten().Group, "МДК-01", "equivalent normalized group remains valid for profile sync");

  const adminClear = harness("admin", "student", "МДК-01");
  assert.throws(() => adminClear.save({ token: "admin-session", group: "" }), /Для студента учебная группа обязательна/);
  assert.equal(adminClear.getWritten(), null, "rejected empty group must not write user fields");

  const adminChange = harness("admin", "student", "МДК-01");
  assert.equal(adminChange.save({ token: "admin-session", group: "МДК-02" }).success, true);
  assert.equal(adminChange.getWritten().Group, "МДК-02", "administrator can deliberately reassign a student");
});

test("read-only load smoke test includes protected English VPR and semester reads", () => {
  assert.match(loadTest, /name: "getEnglishVprExam", params: \{ track: englishTrack \}/);
  assert.match(loadTest, /name: "getEnglishSemesterTests", params: \{ track: englishTrack \}/);
  assert.match(loadTest, /method: "GET"/);
  assert.match(loadTest, /Unique session tokens:/);
});

test("English semester retrieval used by load test is read-only", () => {
  const fn = extractFunction(server, "getEnglishSemesterTests_");
  assert.match(fn, /auth_\(data\)/);
  assert.match(fn, /hasCourseAccess_\(user, courseId\)/);
  assert.match(fn, /englishSemesterBank_\(\)/);
  assert.doesNotMatch(fn, /appendRow|deleteRow|setValue\(|setValues\(|CacheService\.getScriptCache\(\)\.put|PropertiesService\.getScriptProperties\(\)\.setProperty/,
    "load-test endpoint must not mutate sheets, caches or script properties");
});
