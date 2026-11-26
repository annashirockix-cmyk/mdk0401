import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

function createWindow(state) {
  const options = ["07.01", "04.01", "ENB", "ENT", "MAT"].map(value => ({
    value, hidden: false
  }));
  const selector = { options, value: "" };
  const sandbox = {
    window: { state },
    document: { getElementById: id => id === "mdkSelector" ? selector : null },
    Array, String
  };
  vm.createContext(sandbox);
  const start = source.indexOf("window.canAccessCourse = function(courseId)");
  const end = source.indexOf("// ==========================================", start);
  assert.ok(start >= 0 && end > start, "course access functions must exist");
  new vm.Script(source.slice(start, end)).runInContext(sandbox);
  return { window: sandbox.window, selector };
}

test("legacy string course lists are tokenized exactly, not matched as substrings", () => {
  const { window } = createWindow({ student: { courses: "ENB" }, staff: null });
  assert.equal(window.canAccessCourse("ENB"), true);
  assert.equal(window.canAccessCourse("ENT"), false);
  assert.equal(window.canAccessCourse("EN"), false);
  assert.equal(window.canAccessCourse("N"), false);
});

test("legacy general English enrollment grants both English tracks", () => {
  const { window } = createWindow({ student: { courses: "07.01, EN" }, staff: null });
  assert.equal(window.canAccessCourse("07.01"), true);
  assert.equal(window.canAccessCourse("ENB"), true);
  assert.equal(window.canAccessCourse("ENT"), true);
  assert.equal(window.canAccessCourse("MAT"), false);
});

test("array course lists preserve exact access and normalize whitespace and case", () => {
  const { window } = createWindow({ student: { courses: [" 07.01 ", "mat"] }, staff: null });
  assert.equal(window.canAccessCourse("07.01"), true);
  assert.equal(window.canAccessCourse("MAT"), true);
  assert.equal(window.canAccessCourse("MATX"), false);
  assert.equal(window.canAccessCourse("ENT"), false);
});

test("administrator bypass and guest denial remain unchanged", () => {
  const guest = createWindow({ student: null, staff: null });
  assert.equal(guest.window.canAccessCourse("07.01"), false);
  const admin = createWindow({ student: null, staff: { role: "admin", courses: [] } });
  assert.equal(admin.window.canAccessCourse("SPRUT_TP"), true);
});

test("course selector hides unauthorized tracks and selects the first permitted course", () => {
  const { window, selector } = createWindow({
    student: { courses: "ENB" }, staff: null, activeCourseId: "ENT"
  });
  window.syncCourseSelector();
  assert.equal(window.state.activeCourseId, "ENB");
  assert.equal(selector.value, "ENB");
  assert.equal(selector.options.find(option => option.value === "ENB").hidden, false);
  assert.equal(selector.options.find(option => option.value === "ENT").hidden, true);
  assert.equal(selector.options.find(option => option.value === "MAT").hidden, true);
});
