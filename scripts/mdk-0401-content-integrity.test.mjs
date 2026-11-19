import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-0401.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-0401.js" });
const course = sandbox.MDK_DATA["04.01"];
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("MDK 04.01 contains six structured learning topics", () => {
  assert.equal(topics.length, 6);
  const ids = new Set();
  const titles = new Set();

  for (const topic of topics) {
    assert.ok(topic.id && topic.code && topic.title, "topic has id, code and title");
    assert.ok(!ids.has(topic.id), topic.id + " is unique");
    ids.add(topic.id);
    assert.ok(!titles.has(topic.title), topic.title + " is unique");
    titles.add(topic.title);

    assert.ok(Array.isArray(topic.lectures) && topic.lectures.length >= 1, topic.id + " has a lecture");
    for (const lecture of topic.lectures) {
      assert.ok(lecture.title && lecture.content && lecture.content.length > 1200, topic.id + " lecture has expanded content");
      assert.match(lecture.content, /Учебный пример/, topic.id + " has a topic-specific learning example");
      assert.match(lecture.content, /Главное/, topic.id + " has a concise takeaway");
      assert.doesNotMatch(lecture.content, /lecture-expanded/, topic.id + " keeps its authored lecture instead of the legacy generic template");
    }

    assert.ok(Array.isArray(topic.practicals) && topic.practicals.length >= 1, topic.id + " has a practical assignment");
    assert.ok(topic.practicals.every(item => item.title && item.goal && item.task), topic.id + " practical has a title, goal and task");
    assert.ok(Array.isArray(topic.selfWork) && topic.selfWork.length >= 1, topic.id + " has independent work");
    assert.ok(topic.selfWork.every(item => item.title && item.task), topic.id + " independent work has a task");
    assert.ok(Array.isArray(topic.test) && topic.test.length >= 2, topic.id + " has topic test questions");
    assert.ok(topic.test.every(item => item.q && Array.isArray(item.options) && item.options.length >= 2), topic.id + " test questions have answer options");
  }
});

test("MDK 04.01 does not advertise unfinished placeholder materials", () => {
  assert.doesNotMatch(source, /Документ будет загружен позже|материал готовится|лекция не подготовлена|в разработке/i);
  assert.deepEqual(course.videos, [], "course does not expose non-working placeholder video links");
});

test("MDK 04.01 safety guidance requires stopping equipment before chip removal", () => {
  assert.ok(Array.isArray(course.safety) && course.safety.length >= 2);
  const general = course.safety[0].content;
  const emergency = course.safety[1].content;
  assert.match(general, /после остановки шпинделя и полного прекращения движения/);
  assert.match(general, /руками стружку не убирайте/);
  assert.match(emergency, /аварийный останов/);
  assert.match(emergency, /Не запускайте станок повторно/);
});
