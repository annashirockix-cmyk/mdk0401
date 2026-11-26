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
  const tableBlocks = source.split("<h3>3. Справочная таблица</h3>").slice(1).map(part => part.split("</table>")[0]);
  const malformedTables = tableBlocks.filter(block => block.includes("<table>") && block.includes("Сверьте этап"));
  assert.equal(malformedTables.length, 0, "replace generic one-row tables that merely repeat the scheme above");
  assert.equal(source.split("<h3>3. Контрольный список этапов</h3>").length - 1, 10,
    "ten duplicated tables should be replaced by a clear stage-checklist instruction");
});

test("СПРУТ-ТП runtime question bank maps every topic to a non-empty assessment bank", () => {
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(read("data-sprut-tp.js"), sandbox, { filename: "data-sprut-tp.js" });
  vm.runInNewContext(read("sprut-tp-question-bank.js"), sandbox, { filename: "sprut-tp-question-bank.js" });

  const course = sandbox.window.MDK_DATA.SPRUT_TP;
  const topics = course.sections.flatMap(section => section.topics || []);
  assert.equal(sandbox.window.SPRUT_TP_QUESTION_TOPICS, 14, "question bank must cover all fourteen topics");
  assert.equal(sandbox.window.SPRUT_TP_QUESTION_COUNT, 57, "all fifty-seven authored questions must be registered");
  assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length, "runtime topic IDs must remain unique");

  const allQuestions = [];
  for (const topic of topics) {
    const questions = topic.test || [];
    assert.ok(questions.length >= 4, topic.title + ": runtime question bank is incomplete");
    assert.ok(questions.every(question => question.q && Array.isArray(question.options) && question.options.length === 4),
      topic.title + ": each runtime question must have four answer options");
    assert.deepEqual(sandbox.window.HARD_TESTS[topic.id].map(question => question.q), questions.map(question => question.q),
      topic.title + ": protected hard-test lookup must use the same topic bank");
    allQuestions.push(...questions.map(question => question.q));
  }
  assert.equal(new Set(allQuestions).size, allQuestions.length, "question prompts must be unique across the course");
});
