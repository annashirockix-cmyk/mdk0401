import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = fs.readFileSync(new URL("../home-dashboard.js", import.meta.url), "utf8");
const worker = fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");

test("home dashboard is loaded after existing home composition and cached offline", () => {
  assert.match(html, /home-dashboard\.js\?v=1/);
  assert.match(worker, /\.\/home-dashboard\.js/);
  assert.match(worker, /portal-cache-v425/);
  assert.match(html, /service-worker\.js\?v=426/);
});

test("dashboard uses existing role state and only shows teacher actions to staff", () => {
  assert.match(script, /var student = state\.student/);
  assert.match(script, /var staff = state\.staff \|\| state\.teacher \|\| state\.admin/);
  assert.match(script, /if \(isTeacher\)/);
  assert.ok(!script.includes("Дополнительные занятия") && !script.includes("#/tutoring"));
  assert.match(script, /if \(isAdmin\).*Администрирование/s);
});

test("student dashboard links to existing learning routes without changing course permissions", () => {
  ["#/grades", "#/teacher-tasks", "#/laboratory", "#/profile", "#/resources"].forEach(route => {
    assert.ok(script.includes(route), "missing route " + route);
  });
  assert.match(script, /encodeURIComponent\(courseId\)/);
  assert.match(script, /textContent = title/);
  assert.doesNotMatch(script, /innerHTML/);
});

test("dashboard is idempotent and augments rather than replaces the existing curriculum", () => {
  assert.match(script, /app\.querySelector\("#homeDashboard"\)/);
  assert.match(script, /hero\.insertAdjacentElement\("afterend", section\)/);
  assert.match(script, /original\.apply\(this, arguments\)/);
});


test("every dashboard shortcut resolves through an installed portal route", () => {
  const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const teacherControls = fs.readFileSync(new URL("../teacher-controls.js", import.meta.url), "utf8");
  const courseAdmin = fs.readFileSync(new URL("../course-admin.js", import.meta.url), "utf8");
  const laboratory = fs.readFileSync(new URL("../laboratory.js", import.meta.url), "utf8");
  const routeOwners = [app, teacherControls, courseAdmin, laboratory].join("\n");
  [
    "#/teacher-dashboard", "#/journal", "#/teacher-tasks", "#/course-editor",
    "#/question-bank", "#/admin", "#/grades", "#/resources",
    "#/laboratory", "#/profile"
  ].forEach(route => {
    assert.ok(script.includes(route), "dashboard shortcut missing: " + route);
    const page = route.replace(/^#\//, "").split("/")[0];
    assert.ok(
      routeOwners.includes('route==="' + page + '"') ||
      routeOwners.includes('page === "' + page + '"') ||
      routeOwners.includes('page==="' + page + '"') ||
      routeOwners.includes('p[0]==="' + page + '"'),
      "no route handler found for dashboard shortcut: " + route
    );
  });
});
