import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-0202.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-0202.js" });
const course = sandbox.MDK_DATA["02.02"];
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("MDK 02.02 contains seven populated learning topics", () => {
  assert.equal(topics.length, 7);
  for (const topic of topics) {
    assert.ok(topic.id && topic.title, "topic has stable id and title");
    assert.ok(Array.isArray(topic.lectures) && topic.lectures.length >= 1, topic.id + " has a lecture");
    assert.ok(topic.lectures.every(item => item.content && item.content.trim().length > 100), topic.id + " lecture has substantive content");
    assert.ok(topic.practical && topic.practical.title && topic.practical.task, topic.id + " has a practical assignment");
    assert.ok(Array.isArray(topic.selfWork) && topic.selfWork.length >= 1, topic.id + " has self-study");
    assert.ok(Array.isArray(topic.test) && topic.test.length >= 4, topic.id + " has at least four topic questions");
  }
});

test("MDK 02.02 practical assignments include goals and variants or detailed tasks", () => {
  for (const topic of topics) {
    assert.ok(topic.practical.goal && topic.practical.goal.trim().length > 10, topic.id + " practical has a goal");
    assert.ok(topic.practical.task.trim().length > 250, topic.id + " practical has a guided, step-by-step task");
    assert.ok(Array.isArray(topic.practical.variants) && topic.practical.variants.length >= 2, topic.id + " practical has at least two variants");
  }
});

test("MDK 02.02 does not advertise unavailable PDF materials", () => {
  assert.doesNotMatch(source, /Документ будет загружен позже|Методические указания к практическим работам \(ПДФ\)|в разработке/i);
});


test("MDK 02.02 safety-critical answers favor stopping and preserving safeguards", () => {
  const allQuestions = topics.flatMap(topic => topic.test || []);
  const interlock = allQuestions.find(item => /неисправной блокировке ограждения/i.test(item.q));
  const alarm = allQuestions.find(item => /неизвестной аварийной ошибке/i.test(item.q));
  assert.ok(interlock, "interlock-failure question exists");
  assert.match(interlock.options[0], /остановить работу/i);
  assert.ok(alarm, "unknown-alarm question exists");
  assert.match(alarm.options[0], /остановить работу/i);
  for (const topic of topics) {
    assert.doesNotMatch(topic.practical.task, /обойти блокировк|отключить защит|зафиксировать блокировку в обход/i);
  }
});

test("MDK 02.02 has no exact duplicate question stems", () => {
  const stems = topics.flatMap(topic => topic.test || []).map(item => item.q.trim().toLocaleLowerCase("ru-RU").replace(/\\s+/g, " "));
  assert.equal(new Set(stems).size, stems.length);
});
