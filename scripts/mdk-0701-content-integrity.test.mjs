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
const resourceTopicId = "t-6-1";

test("MDK 07.01 contains 22 topics, including its methodology resource section", () => {
  assert.equal(topics.length, 22);
  const resourceTopic = topics.find(topic => topic.id === resourceTopicId);
  assert.ok(resourceTopic, "methodology resource topic exists");
  assert.ok(
    resourceTopic.lectures?.some(item => /materials\/reference\/method\.pdf/.test(item.content || "")),
    "methodology section links to its PDF"
  );
  assert.ok(
    fs.existsSync(new URL("../materials/reference/method.pdf", import.meta.url)),
    "linked methodology PDF exists in the repository"
  );

  const learningTopics = topics.filter(topic => topic.id !== resourceTopicId);
  assert.equal(learningTopics.length, 21);
  for (const topic of learningTopics) {
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
  for (const key of ["videos", "passports", "safety"]) {
    assert.ok(Array.isArray(course[key]), key + " is an explicit list");
    assert.equal(course[key].length, 0, key + " does not expose title-only placeholder entries");
  }
});
