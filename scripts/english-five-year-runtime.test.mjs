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

test("runtime loads before app.js and lecture rendering resolves explicit listening IDs", () => {
  const html = read("index.html");
  const app = read("app.js");
  assert.ok(html.indexOf("english-five-year-runtime.js") < html.indexOf("app.js"));
  assert.match(app, /lecture\.listeningId/);
  assert.match(read("english-listening-tts.js"), /speechSynthesis/);
  assert.match(read("english-listening-tts.js"), /SpeechSynthesisUtterance/);
  const serviceWorker = read("service-worker.js");
  assert.match(serviceWorker, /portal-cache-v366/);
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
