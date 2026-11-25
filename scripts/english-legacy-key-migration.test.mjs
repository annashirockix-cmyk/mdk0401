import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (name) => fs.readFileSync(new URL("../" + name, import.meta.url), "utf8");
const quietConsole = { log() {}, info() {}, warn() {}, error() {} };

function loadTrack(trackId) {
  const window = { MDK_DATA: {} };
  for (const file of ["data-english-basic.js", "data-english-technical.js"]) {
    vm.runInNewContext(read(file), { window, console: quietConsole }, { filename: file });
  }
  vm.runInNewContext(read("english-course.js"), { window, console: quietConsole }, { filename: "english-course.js" });
  return window.MDK_DATA[trackId];
}

test("legacy Basic English answer keys are separated while student self-check prompts remain", () => {
  const track = loadTrack("ENB");
  const lectures = track.sections.flatMap(section => (section.topics || []).flatMap(topic => topic.lectures || []));
  assert.doesNotMatch(read("data-english-basic.js"), /ключ преподавателя|teacherContent/i);
  assert.ok(lectures.length > 0);
  const lesson = lectures.find(lecture => lecture.code === "1.1");
  assert.ok(lesson, "expected the first Basic English lecture");
  assert.match(lesson.content, /Сколько букв в английском алфавите/);
  assert.doesNotMatch(lesson.content, /ключ преподавателя|—\s*26\./i);
  assert.equal(Object.prototype.hasOwnProperty.call(lesson, "teacherContent"), false);
});

test("legacy Technical English answer keys are separated from student lecture HTML", () => {
  const track = loadTrack("ENT");
  const lectures = track.sections.flatMap(section => (section.topics || []).flatMap(topic => topic.lectures || []));
  assert.doesNotMatch(read("data-english-technical.js"), /ключ преподавателя|teacherContent/i);
  assert.ok(lectures.length > 0);
  for (const lecture of lectures) {
    assert.equal(Object.prototype.hasOwnProperty.call(lecture, "teacherContent"), false);
    assert.doesNotMatch(lecture.content || "", /ключ преподавателя|teacher key|answer key/i);
  }
});

test("admin migration includes legacy teacher keys even when a lesson has no course-year metadata", async () => {
  const app = read("app.js");
  const start = app.indexOf("window.migrateEnglishTeacherMaterialsToServer = async function () {");
  const end = app.indexOf("\n\nwindow.loadGlobalCustomContent", start);
  assert.ok(start >= 0 && end > start);
  const sent = [];
  const window = {
    state: { staff: { role: "admin", email: "admin@example.invalid" } },
    MDK_DATA: {
      ENB: { sections: [{ topics: [{ id: "legacy-basic-topic", lectures: [
        { code: "1.1", title: "Legacy lesson", teacherContent: "<p>Private answer key</p>" }
      ] }] }] },
      ENT: { sections: [] }
    },
    API: { importEnglishTeacherMaterials: async batch => {
      sent.push(...batch);
      return { success: true, received: batch.length, inserted: batch.length, updated: 0 };
    } }
  };
  vm.runInNewContext(app.slice(start, end), { window });
  const result = await window.migrateEnglishTeacherMaterialsToServer();
  assert.equal(result.total, 1);
  assert.equal(sent[0].courseNumber, 0);
  assert.equal(sent[0].topicId, "legacy-basic-topic");
  assert.equal(sent[0].teacherContent, "<p>Private answer key</p>");
});

test("Apps Script importer accepts legacy records with an explicit zero course-year marker", () => {
  const server = read("Code.gs");
  assert.match(server, /const validCourse = Number\.isInteger\(courseNumber\) && courseNumber >= 0 && courseNumber <= 5/);
});
