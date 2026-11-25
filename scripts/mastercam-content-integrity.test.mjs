import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../data-mastercam.js", import.meta.url), "utf8");
const sandbox = { console };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox, { filename: "data-mastercam.js" });
const course = sandbox.MDK_DATA.MCAM;
const topics = (course.sections || []).flatMap(section => section.topics || []);

test("Mastercam course contains eleven substantive lessons and topic checks", () => {
  assert.ok(course, "Mastercam course is registered");
  assert.equal(topics.length, 11);
  for (const topic of topics) {
    assert.ok(topic.id && topic.title, "topic has stable id and title");
    assert.ok(topic.lectures?.length >= 1, topic.id + " has a lecture");
    const html = topic.lectures.map(item => item.content || "").join(" ");
    assert.ok(html.length > 700, topic.id + " has substantive lesson content");
    assert.match(html, /Практическая работа/i, topic.id + " includes a guided practical");
    assert.match(html, /Вопросы для самопроверки/i, topic.id + " includes self-check questions");
    assert.ok(topic.test?.length >= 2, topic.id + " has at least two test questions");
  }
});

test("Mastercam materials distinguish illustrative parameters from production settings", () => {
  assert.match(source, /не является готовым режимом резания/i);
  assert.match(source, /не является универсальной безопасной высотой/i);
  assert.match(source, /подберите перекрытие по данным инструмента и материала/i);
  assert.match(source, /соответствующий модели стойки и конфигурации станка/i);
  assert.doesNotMatch(source, /Обычно 40-70%/i);
  assert.doesNotMatch(source, /для карманов <b>запрещено<\/b> вертикальное врезание/i);
});
