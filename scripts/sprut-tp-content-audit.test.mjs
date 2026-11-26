import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

test("СПРУТ-ТП содержит полный и согласованный учебный каркас", () => {
  const source = read("data-sprut-tp.js");
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(source, sandbox, { filename: "data-sprut-tp.js" });
  const course = sandbox.window.MDK_DATA.SPRUT_TP;
  assert.ok(course, "СПРУТ-ТП course data must load");
  assert.equal(course.sections.length, 6, "all six course sections must be present");

  const topics = course.sections.flatMap(section => section.topics || []);
  assert.equal(topics.length, 14, "all fourteen topics must be present");
  assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length, "topic IDs must be unique");

  for (const topic of topics) {
    assert.ok(topic.id && topic.title, "every topic needs a stable ID and title");
    assert.ok(Array.isArray(topic.lectures) && topic.lectures.length > 0, topic.title + ": lecture is required");
    const lecture = topic.lectures[0];
    assert.ok(lecture.code && lecture.title, topic.title + ": lecture metadata is required");
    const plainText = String(lecture.content || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
    assert.ok(plainText.trim().length >= 700, topic.title + ": lecture content is too short");
    for (const heading of ["Цель и результаты обучения", "Теоретические сведения", "Логика работы", "Самопроверка"]) {
      assert.ok(lecture.content.includes(heading), topic.title + ": missing lecture section " + heading);
    }

    assert.ok(Array.isArray(topic.practicals) && topic.practicals.length > 0, topic.title + ": practical work is required");
    assert.ok(topic.practicals.every(item => item.title && item.goal && item.task), topic.title + ": practical work needs a goal and task");
    assert.ok(Array.isArray(topic.selfWork) && topic.selfWork.length > 0, topic.title + ": self-study is required");
    assert.ok(topic.selfWork.every(item => item.title && item.task), topic.title + ": self-study task is incomplete");
    assert.ok(Array.isArray(topic.test) && topic.test.length >= 3, topic.title + ": at least three test questions are required");
    assert.ok(topic.test.every(question => question.q && Array.isArray(question.options) && question.options.length >= 3),
      topic.title + ": each test question needs a prompt and at least three options");
  }

  assert.ok(Array.isArray(course.resources) && course.resources.length >= 4, "official and reference resources must remain available");
});

test("СПРУТ-ТП lectures do not contain duplicated scheme text disguised as a reference table", () => {
  const source = read("data-sprut-tp.js");
  const malformedTables = source.match(/<h3>3\\. Справочная таблица<\\/h3><table>[\\s\\S]*?Сверьте этап[\\s\\S]*?<\\/table>/g) || [];
  assert.equal(malformedTables.length, 0, "replace generic one-row tables that merely repeat the scheme above");
  assert.equal((source.match(/<h3>3\\. Контрольный список этапов<\\/h3>/g) || []).length, 10,
    "ten duplicated tables should be replaced by a clear stage-checklist instruction");
});
