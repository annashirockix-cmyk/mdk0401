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
  assert.ok(topic.practicals.every(item => item.goal && item.goal.trim().length > 20), "each practical has a learning goal");
  assert.ok(topic.practicals.every(item => item.task && item.task.trim().length > 250), "each practical has a step-by-step task");
  assert.ok(topic.practicals.every(item => Array.isArray(item.variants) && item.variants.length >= 2), "each practical has at least two variants");
  assert.match(topic.practicals[0].task, /момент затяжки/);
  assert.match(topic.practicals[1].task, /через тела качения/);
  assert.ok(topic.selfWork.length >= 3, "self-study tasks should remain available");
  assert.ok(topic.test.length >= 10, "topic test questions should remain available");
});


test("MDK 02.01 does not present equipment-specific limits as universal rules", () => {
  assert.doesNotMatch(source, /выше 120\s*°С\s*[—-]\s*разрушает термообработку/i);
  assert.doesNotMatch(source, /смазка 1\/3[–-]1\/2 объёма/i);
  assert.doesNotMatch(source, /опрессовкой давлением 1,25[–-]1,5 от номинального/i);
  assert.match(source, /по документации конкретного узла/i);
  assert.match(source, /не являются универсальной нормой/i);
  assert.match(source, /значение Z50 не гарантирует безопасный зазор/i);
  assert.match(source, /размерной цепи и допускам конкретной детали/i);
  assert.doesNotMatch(source, /погрешность будет равна допуску на длину/i);
  assert.doesNotMatch(source, /h_min > h_кр \(обычно 2–5 мкм\)/i);
  assert.doesNotMatch(source, /ψ = Δ\/d \(0,001 - 0,002\)/i);
  assert.doesNotMatch(source, /Твёрдость шеек 50–60 HRC/i);
  assert.doesNotMatch(source, /Зазор «поршень — цилиндр»: 0,03–0,09 мм/i);
  assert.doesNotMatch(source, /нагрев колеса до 80–120 °С/i);
  assert.doesNotMatch(source, /менее 10 мм\/мин/i);
  assert.doesNotMatch(source, /не более 0,02 – 0,03 мм/i);
  assert.doesNotMatch(source, /рабочее давление 0,4–0,8 МПа/i);
  assert.doesNotMatch(source, /до 3000 об\/мин/i);
  assert.doesNotMatch(source, /15 000 – 60 000 об\/мин/i);
  assert.doesNotMatch(source, /не более 0,01 мм на 1000 мм/i);
  assert.doesNotMatch(source, /не более 0,05 мм/i);
});
