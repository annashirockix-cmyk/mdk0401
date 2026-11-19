import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-0701.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-0701.js" });
const course = sandbox.MDK_DATA["07.01"];
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("MDK 07.01 contains 22 populated topics", () => {
  assert.equal(topics.length, 22);
  for (const topic of topics) {
    assert.ok(topic.id && topic.code && topic.title, "topic has id, code and title");
    assert.ok(Array.isArray(topic.lectures) && topic.lectures.length >= 1, topic.id + " has a lecture");
    assert.ok(topic.lectures.every(item => item.content && item.content.trim().length > 100), topic.id + " lecture has substantive content");
    assert.ok(Array.isArray(topic.practicals) && topic.practicals.length >= 1, topic.id + " has practical work");
    assert.ok(topic.practicals.every(item => item.title && item.goal && item.task), topic.id + " practical has goal and task");
    assert.ok(Array.isArray(topic.selfWork) && topic.selfWork.length >= 1, topic.id + " has self-study");
    assert.ok(Array.isArray(topic.test) && topic.test.length >= 3, topic.id + " has topic test questions");
    assert.ok(topic.test.every(item => item.q && Array.isArray(item.options) && item.options.length >= 2), topic.id + " test questions have answer options");
  }
});

test("MDK 07.01 learning materials include no unfinished placeholder notices", () => {
  assert.doesNotMatch(source, /Документ будет загружен позже|материал готовится|лекция не подготовлена|в разработке/i);
});
