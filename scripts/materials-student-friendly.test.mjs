import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const dataSource = fs.readFileSync(new URL("../data-material.js", import.meta.url), "utf8");
const easySource = fs.readFileSync(new URL("../data-material-easy.js", import.meta.url), "utf8");
const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(dataSource, sandbox, { filename: "data-material.js" });
const course = sandbox.MDK_DATA.MAT;
const topics = course.sections.flatMap(section => section.topics || []);
const before = topics.map(topic => ({
  id: topic.id,
  practicals: (topic.practicals || []).length,
  selfWork: (topic.selfWork || []).length,
  tests: (topic.test || []).length
}));
vm.runInNewContext(easySource, sandbox, { filename: "data-material-easy.js" });

test("all 11 materials science lectures receive a student-friendly rewrite", () => {
  assert.equal(topics.length, 11);
  for (const topic of topics) {
    assert.ok(topic.lectures?.[0]?.content, topic.id + " has lecture content");
    assert.match(topic.lectures[0].content, /Главная схема темы/);
    assert.match(topic.lectures[0].content, /Словарь простыми словами/);
    assert.match(topic.lectures[0].content, /Проверьте себя/);
    assert.equal(topic.lectures[0].studentFriendlyVersion, 1);
  }
  assert.equal(course.studentFriendlyVersion, 1);
});

test("rewrite preserves the existing practice work, self-study and tests", () => {
  for (const old of before) {
    const topic = topics.find(item => item.id === old.id);
    assert.equal((topic.practicals || []).length, old.practicals, old.id + " practicals");
    assert.equal((topic.selfWork || []).length, old.selfWork, old.id + " self work");
    assert.equal((topic.test || []).length, old.tests, old.id + " tests");
  }
});

test("student-friendly script is loaded after the original materials course data", () => {
  const originalAt = index.indexOf('src="./data-material.js');
  const easyAt = index.indexOf('src="./data-material-easy.js');
  assert.ok(originalAt >= 0 && easyAt > originalAt);
  assert.match(index, /materials-student-friendly\.css/);
});
