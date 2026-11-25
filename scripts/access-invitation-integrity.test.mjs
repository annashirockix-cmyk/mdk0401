import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const access = fs.readFileSync(new URL("../access.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("invitation interface describes only the link it actually generates", () => {
  assert.match(access, /Пригласительная ссылка создаёт учётную запись/);
  assert.match(access, /Создать приглашение/);
  assert.doesNotMatch(access, /Создать ссылку и QR-код|Ссылка и QR-код создают/);
  assert.match(html, /access\.js\?v=9/);
});

test("student course access is restricted to the acting teacher's assigned courses", () => {
  const start = server.indexOf("function setStudentCourses_(data)");
  const end = server.indexOf("\nfunction ", start + 10);
  assert.ok(start >= 0 && end > start);
  const source = server.slice(start, end);
  assert.match(source, /actor\.role==='admin'\?CFG\.COURSES:actor\.courses\.split\(', '\)/);
  assert.match(source, /Нельзя назначить дисциплину вне ваших полномочий/);
  assert.match(source, /other=target\.courses\.split\(', '\)/);
});

test("teachers can view only students with at least one assigned course", () => {
  const start = server.indexOf("function getStudents_(data)");
  const end = server.indexOf("\nfunction ", start + 10);
  assert.ok(start >= 0 && end > start);
  const source = server.slice(start, end);
  assert.match(source, /user\.role === "admin" \|\| hasCourseAccess_\(user,id\)/);
  assert.match(source, /user\.role === "admin" \|\| student\.courses\.length > 0/);
});
