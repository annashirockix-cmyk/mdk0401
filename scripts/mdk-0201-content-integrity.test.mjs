import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-0201.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-0201.js" });
const course = sandbox.MDK_DATA["02.01"];
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("MDK 02.01 does not advertise a PDF that is not actually available", () => {
  assert.doesNotMatch(source, /Документ будет загружен позже|Методические указания к практическим работам \(ПДФ\)/);
  assert.equal(topics.length, 1);
  assert.deepEqual(Array.from(topics[0].pdfPracticals || []), []);
});

test("MDK 02.01 keeps its real lecture, practical, self-study and test materials", () => {
  const topic = topics[0];
  assert.ok(topic.lectures.length >= 15, "lecture set should remain available");
  assert.ok(topic.lectures.every(item => item.content && item.content.trim().length > 100), "each lecture should contain substantive material");
  assert.ok(topic.practicals.length >= 2, "both practical assignments should remain available");
  assert.ok(topic.selfWork.length >= 3, "self-study tasks should remain available");
  assert.ok(topic.test.length >= 10, "topic test questions should remain available");
});
