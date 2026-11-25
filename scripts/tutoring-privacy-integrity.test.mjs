import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const server = fs.readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const controls = fs.readFileSync(new URL("../teacher-controls.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");

test("tutoring settings are stored separately for each teacher and course", () => {
  assert.match(server, /const key="tutoring:"\+courseId\+":"\+teacher\.email/);
  assert.match(server, /const ownKey=prefix\+user\.email/);
  assert.match(server, /editor_\(data,courseId\)/);
});

test("students see only published links from teachers assigned to the selected course", () => {
  const start = server.indexOf("function getTutoringLink_(data)");
  const end = server.indexOf("function saveTutoringLink_", start);
  assert.ok(start >= 0 && end > start);
  const source = server.slice(start, end);
  assert.match(source, /teacher\.role!=="teacher"\|\|!hasCourseAccess_\(teacher,courseId\)/);
  assert.match(source, /if\(!link\.visible\|\|!link\.url\)continue/);
  assert.match(source, /links\.push\(/);
});

test("tutoring page renders multiple teacher offers and menu opens when at least one is published", () => {
  assert.match(controls, /const links=Array\.isArray\(r\.links\)\?r\.links:\[\]/);
  assert.match(controls, /teacherName/);
  assert.match(app, /links\.length>0/);
});

test("tutoring links reject unsafe protocols and render user-provided text as escaped HTML", () => {
  assert.match(server, /!\/^https\?:\\/\\//i\.test\(url\)/);
  assert.match(server, /url\.length>1000/);
  assert.match(controls, /esc\(l\.url\)/);
  assert.match(controls, /esc\(l\.title/);
  assert.match(controls, /esc\(l\.description/);
});
