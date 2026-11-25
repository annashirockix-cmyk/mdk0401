import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-sprut-tp.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-sprut-tp.js" });
const course = sandbox.MDK_DATA.SPRUT_TP;
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("SPRUT-TP contains fourteen substantive learning topics", () => {
  assert.ok(course, "SPRUT-TP course is registered");
  assert.equal(topics.length, 14);
  for (const topic of topics) {
    assert.ok(topic.id && topic.title, "topic has a stable id and title");
    assert.ok(Array.isArray(topic.lectures) && topic.lectures.length >= 1, topic.id + " has a lecture");
    assert.ok(topic.lectures.every(item => item.content && item.content.trim().length > 500), topic.id + " lecture has substantive content");
    assert.ok(Array.isArray(topic.selfWork) && topic.selfWork.length >= 1, topic.id + " has self-study");
    assert.ok(Array.isArray(topic.test) && topic.test.length >= 3, topic.id + " has at least three test questions");
  }
});

test("SPRUT-TP practical assignments have goals, detailed tasks and alternatives", () => {
  for (const topic of topics) {
    const practical = topic.practicals?.[0];
    assert.ok(practical?.title && practical?.goal, topic.id + " practical has a title and goal");
    assert.ok(practical.task && practical.task.trim().length > 100, topic.id + " practical has an actionable task");
    assert.ok(Array.isArray(practical.variants) && practical.variants.length >= 2, topic.id + " practical has at least two variants");
    assert.ok(topic.selfWork[0].task && topic.selfWork[0].task.trim().length > 50, topic.id + " self-study has an instruction");
  }
});

test("SPRUT-TP does not advertise placeholder resources", () => {
  assert.doesNotMatch(source, /Видео 1|Паспорт"|Инструкция"|будет загружен позже|Lorem ipsum/i);
});
