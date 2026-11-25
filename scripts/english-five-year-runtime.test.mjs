import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const quietConsole = { log() {}, info() {}, warn() {}, error() {} };

function loadEnglishRuntime() {
  const window = { MDK_DATA: {} };
  const context = vm.createContext({ window, console: quietConsole });
  for (const file of [
    "data-english-basic.js",
    "data-english-technical.js",
    "english-course.js",
    "english-five-year-runtime.js",
    "english-listening-catalog.js",
    "english-listening-lesson.js",
  ]) {
    vm.runInContext(read(file), context, { filename: file });
  }
  return window;
}

function lectureCount(track) {
  return track.sections.reduce(
    (total, section) =>
      total +
      section.topics.reduce(
        (sectionTotal, topic) => sectionTotal + (topic.lectures || []).length,
        0,
      ),
    0,
  );
}

test("five-year runtime preserves the original 45 lectures and adds all 75 mapped lessons", () => {
  const window = loadEnglishRuntime();
  const basic = window.MDK_DATA.ENB;
  const technical = window.MDK_DATA.ENT;

  assert.equal(lectureCount(basic) + lectureCount(technical), 120);
  assert.equal(lectureCount(basic), 48);
  assert.equal(lectureCount(technical), 72);

  const additions = [basic, technical].flatMap((track) =>
    track.sections.flatMap((section) =>
      section.topics.flatMap((topic) =>
        (topic.lectures || []).filter((lecture) => lecture.listeningId),
      ),
    ),
  );
  assert.equal(additions.length, 75);
  assert.equal(new Set(additions.map((lecture) => lecture.listeningId)).size, 75);
});

test("all 75 new lecture IDs are in the five-year map and have browser listening activities", () => {
  const window = loadEnglishRuntime();
  const mapIds = [
    ...new Set(read("docs/english-five-year-120-lecture-map-v1.md").match(/en-c\d{2}-s\d{2}-l\d{2}/g)),
  ];
  const additions = [window.MDK_DATA.ENB, window.MDK_DATA.ENT].flatMap((track) =>
    track.sections.flatMap((section) =>
      section.topics.flatMap((topic) =>
        (topic.lectures || []).filter((lecture) => lecture.listeningId),
      ),
    ),
  );
  const runtimeIds = new Set(additions.map((lecture) => lecture.listeningId));

  assert.equal(mapIds.length, 75);
  assert.deepEqual(mapIds.filter((id) => !runtimeIds.has(id)), []);
  assert.equal(window.EnglishListeningCatalogue.count, 120);
  for (const id of mapIds) {
    assert.ok(window.EnglishListeningCatalogue.getById(id), `missing listening activity: ${id}`);
  }
});

test("all 120 existing and new lessons have usable listening activities", () => {
  const window = loadEnglishRuntime();
  const newLessonIds = [
    ...new Set(read("docs/english-five-year-120-lecture-map-v1.md").match(/en-c\d{2}-s\d{2}-l\d{2}/g)),
  ];
  const legacySlots = [[1,1,3],[1,2,3],[2,1,3],[2,2,7],[3,1,5],[3,2,5],[4,1,9],[4,2,8],[5,1,2]];
  const legacyIds = legacySlots.flatMap(([course, semester, count]) =>
    Array.from({length:count}, (_, index) =>
      "en-c" + String(course).padStart(2,"0") + "-s" + String(semester).padStart(2,"0") + "-l" + String(index + 1).padStart(2,"0")
    )
  );
  const allIds = [...legacyIds, ...newLessonIds];

  assert.equal(newLessonIds.length, 75);
  assert.equal(legacyIds.length, 45);
  assert.equal(allIds.length, 120);
  assert.equal(new Set(allIds).size, 120);
  assert.equal(window.EnglishListeningCatalogue.count, 120);
  const missing = allIds.filter((id) => !window.EnglishListeningCatalogue.getById(id));
  assert.deepEqual(missing, [], `missing active listening activities: ${missing.join(", ")}`);

  for (const id of allIds) {
    const activity = window.EnglishListeningCatalogue.getById(id);
    assert.ok(activity.title && activity.title.trim().length >= 12, `missing title: ${id}`);
    assert.ok(activity.script && activity.script.trim().length >= 80, `listening script is too short: ${id}`);
    assert.ok(Array.isArray(activity.questions) && activity.questions.length >= 3, `not enough questions: ${id}`);

    for (const [index, question] of activity.questions.entries()) {
      assert.ok(question.prompt && question.prompt.trim(), `missing prompt: ${id} question ${index + 1}`);
      assert.ok(Array.isArray(question.options) && question.options.length >= 2, `missing options: ${id} question ${index + 1}`);
      assert.ok(Number.isInteger(question.answerIndex), `missing answer key: ${id} question ${index + 1}`);
      assert.ok(question.answerIndex >= 0 && question.answerIndex < question.options.length, `answer key out of range: ${id} question ${index + 1}`);
      assert.ok(question.explanation && question.explanation.trim(), `missing practice explanation: ${id} question ${index + 1}`);
    }
  }
});

test("teacher companion migration is admin-only, server-backed, and attached only to staff lessons", () => {
  const runtime = read("english-five-year-runtime.js");
  const app = read("app.js");
  const api = read("api.js");
  const server = read("Code.gs");
  assert.doesNotMatch(runtime, /splitTeacherMaterial|teacherContent\s*:/);
  assert.match(app, /migrateEnglishTeacherMaterialsToServer/);
  assert.match(app, /role[^;]*admin/);
  assert.match(app, /teacherMaterials = rows\.filter/);
  assert.match(app, /window\.state && window\.state\.staff && teacherHtml/);
  assert.match(api, /importEnglishTeacherMaterials/);
  assert.match(server, /case "importenglishteachermaterials"/);
  assert.match(server, /const user = admin_\(data\)/);
  assert.match(server, /payload\.teacherOnly === true\) return/);
});

test("English teacher scripts and answer keys are absent from every public runtime lesson", () => {
  const runtime = read("english-five-year-runtime.js");
  const window = loadEnglishRuntime();
  const additions = [window.MDK_DATA.ENB, window.MDK_DATA.ENT].flatMap((track) =>
    track.sections.flatMap((section) =>
      section.topics.flatMap((topic) => (topic.lectures || []).filter((lecture) => lecture.listeningId)),
    ),
  );
  assert.equal(additions.length, 75);
  assert.doesNotMatch(runtime, /function splitTeacherMaterial|teacherContent\s*:/);
  assert.doesNotMatch(runtime, /\*\*Recording script|\*\*Transcript reveal|\*\*Teacher key|\*\*Suggested answers|\*\*Listening script for teacher recording/i);
  for (const lecture of additions) {
    assert.equal(Object.prototype.hasOwnProperty.call(lecture, "teacherContent"), false,
      "private teacher material must not be attached to public lesson " + lecture.listeningId);
    assert.doesNotMatch(String(lecture.content || ""), /Recording script|Transcript reveal|Teacher key|Answer key|Suggested answers|Listening script for teacher recording/i,
      "teacher-only section leaked into student lesson " + lecture.listeningId);
  }
  const app = read("app.js");
  const server = read("Code.gs");
  assert.match(app, /customContent\.teacherMaterials/);
  assert.match(server, /payload\.teacherOnly === true\) return/);
});

test("runtime loads before app.js and lecture rendering resolves explicit listening IDs", () => {
  const html = read("index.html");
  const app = read("app.js");
  assert.ok(html.indexOf("english-five-year-runtime.js") < html.indexOf("app.js"));
  assert.match(app, /lecture\.listeningId/);
  assert.match(read("english-listening-tts.js"), /speechSynthesis/);
  assert.match(read("english-listening-tts.js"), /SpeechSynthesisUtterance/);
  const serviceWorker = read("service-worker.js");
  assert.match(serviceWorker, /const CACHE_NAME = 'portal-cache-v\d+'/);
  for (const file of ["english-five-year-runtime.js", "english-listening-tts.js", "english-listening-lesson.js", "english-listening-catalog.js", "english-listening-route.js"]) {
    assert.ok(serviceWorker.includes("./" + file), `service worker must precache ${file}`);
  }
});

test("English listening lab has a visible navigation entry for users with English course access", () => {
  const html = read("index.html");
  const app = read("app.js");
  assert.ok(html.includes('href="#/english-listening"'), "English Listening route must be reachable from the portal menu");
  assert.ok(app.includes('href==="#/english-listening"'), "menu visibility must include the listening route in English-access checks");
  assert.ok(html.indexOf('english-listening-route.js') > html.indexOf('app.js'), "listening route wrapper must install after the main router exists");
});

test("listening practice shuffles every option set and remaps the correct answer without mutating source data", () => {
  const window = loadEnglishRuntime();
  const source = [
    { prompt: "Select the correct term.", options: ["alpha", "bravo", "charlie", "delta"], answerIndex: 0, explanation: "alpha is correct" },
    { prompt: "Select the second term.", options: ["east", "west"], answerIndex: 1 },
  ];
  const before = JSON.stringify(source);
  const prepared = window.EnglishListeningLesson.prepareQuestionsForDisplay(source, () => 0);
  assert.notDeepEqual(prepared[0].options, source[0].options);
  assert.notDeepEqual(prepared[1].options, source[1].options);
  assert.equal(prepared[0].options[prepared[0].answerIndex], "alpha");
  assert.equal(prepared[1].options[prepared[1].answerIndex], "west");
  assert.equal(JSON.stringify(source), before, "source catalogue must remain unchanged");
});


test("admin migration uploads every teacher companion in idempotent batches of at most 50", async () => {
  const app = read("app.js");
  const start = app.indexOf("window.migrateEnglishTeacherMaterialsToServer = async function () {");
  const end = app.indexOf("\n\nwindow.loadGlobalCustomContent", start);
  assert.ok(start >= 0 && end > start, "admin migration function must be present in app.js");
  const calls = [];
  const makeLectures = (prefix, count, courseNumber) =>
    Array.from({ length: count }, (_, index) => ({
      code: prefix + "." + (index + 1),
      title: "Teacher companion " + (index + 1),
      listeningId: prefix + "-l" + String(index + 1).padStart(2, "0"),
      courseNumber,
      teacherContent: "<p>Private teacher note " + (index + 1) + "</p>",
    }));
  const window = {
    state: { staff: { role: "admin" } },
    MDK_DATA: {
      ENB: { sections: [{ topics: [{ id: "basic-topic", lectures: makeLectures("basic", 50, 2) }] }] },
      ENT: { sections: [{ topics: [{ id: "technical-topic", lectures: makeLectures("technical", 1, 4) }] }] },
    },
    API: {
      importEnglishTeacherMaterials: async (batch) => {
        calls.push(batch);
        return { success: true, received: batch.length, inserted: batch.length, updated: 0 };
      },
    },
  };
  vm.runInNewContext(app.slice(start, end), { window });
  const result = await window.migrateEnglishTeacherMaterialsToServer();

  assert.equal(result.success, true);
  assert.equal(result.total, 51);
  assert.equal(result.inserted, 51);
  assert.equal(result.updated, 0);
  assert.equal(result.batches, 2);
  assert.deepEqual(calls.map((batch) => batch.length), [50, 1]);
  const all = calls.flat();
  assert.equal(new Set(all.map((item) => item.id)).size, 51);
  for (const item of all) {
    assert.match(item.id, /^eng-teacher-(ENB|ENT):[A-Za-z0-9._:-]+$/);
    assert.ok(item.topicId && item.courseId && item.teacherContent);
    assert.ok(item.courseNumber >= 0 && item.courseNumber <= 5);
  }
});

test("admin migration refuses non-admin users and reports a missing Apps Script endpoint", async () => {
  const app = read("app.js");
  const start = app.indexOf("window.migrateEnglishTeacherMaterialsToServer = async function () {");
  const end = app.indexOf("\n\nwindow.loadGlobalCustomContent", start);
  const window = { state: { staff: { role: "teacher" } }, MDK_DATA: {}, API: {} };
  vm.runInNewContext(app.slice(start, end), { window });
  await assert.rejects(window.migrateEnglishTeacherMaterialsToServer(), /только администратору/);
  window.state.staff.role = "admin";
  await assert.rejects(window.migrateEnglishTeacherMaterialsToServer(), /поддержкой миграции/);
});

test("teacher-only companion records are excluded from the ordinary custom lecture collection", () => {
  const app = read("app.js");
  assert.match(app, /window\.customContent\.lectures = rows\.filter\(function\(d\) \{ return d\.type === "lecture" && d\.teacherOnly !== true; \}\);/);
});
