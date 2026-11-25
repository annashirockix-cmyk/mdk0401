import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-safety.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-safety.js" });
const course = sandbox.MDK_DATA.OT;
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("Occupational safety course has twelve complete lessons and assessments", () => {
  assert.ok(course, "course is registered");
  assert.equal(topics.length, 12);
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

test("Safety lessons retain critical stop-work and protective-device rules", () => {
  assert.match(source, /не отключать блокировки и ограждения/i);
  assert.match(source, /необходимо прекратить операцию безопасным способом/i);
  assert.match(source, /не открывать электрические шкафы/i);
  assert.match(source, /не заменяют инженерную защиту/i);
});
