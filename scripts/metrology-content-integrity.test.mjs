import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-metrology.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-metrology.js" });
const course = sandbox.MDK_DATA.MET;
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("Metrology course has eight complete lessons and assessments", () => {
  assert.ok(course, "course is registered");
  assert.equal(topics.length, 8);
  for (const topic of topics) {
    assert.ok(topic.id && topic.title, "topic has id and title");
    assert.ok(topic.lectures?.length, topic.id + " has a lecture");
    assert.ok(topic.lectures.map(item => item.content || "").join(" ").length > 900, topic.id + " has substantive lesson text");
    assert.ok(topic.practicals?.length, topic.id + " has a practical");
    assert.ok(topic.practicals[0].goal && topic.practicals[0].task?.length > 80, topic.id + " practical has goal and task");
    assert.ok(topic.practicals[0].variants?.length >= 2, topic.id + " practical has variants");
    assert.ok(topic.selfWork?.length && topic.selfWork[0].task?.length > 50, topic.id + " has independent work");
    assert.ok(topic.test?.length >= 3, topic.id + " has at least three test questions");
  }
});

test("Indicator lesson distinguishes TIR from coaxiality and requires safe setup", () => {
  const lesson = topics.find(topic => topic.id === "met-7").lectures[0].content;
  assert.match(lesson, /не подтверждает соосность/i);
  assert.match(lesson, /исключён случайный пуск/i);
  assert.match(lesson, /не приравнивать TIR автоматически/i);
  assert.match(lesson, /чертеж/i);
});
