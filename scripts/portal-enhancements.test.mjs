import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("four existing training tools are grouped under one laboratory hub", () => {
  const html = read("index.html");
  const hub = read("laboratory.js");
  for (const route of ["laboratory", "gcode-lab", "materials-lab", "metrology-trainer", "machining-lab"]) {
    assert.match(html, new RegExp('href="#/' + route + '"'));
  }
  for (const file of ["laboratory.js", "pdf-viewer.js"]) {
    assert.match(html, new RegExp('src="./' + file.replace(".", "\\.") + '\\?v='));
    assert.ok(read("service-worker.js").includes("./" + file));
  }
  assert.match(hub, /window\.renderLaboratoryHub/);
});

test("personal cabinet provides login, grades, portfolio and achievements", () => {
  const html = read("index.html");
  const hub = read("laboratory.js");
  for (const route of ["profile", "account", "grades", "portfolio", "achievements"]) {
    assert.ok(html.includes('href="#/' + route + '"'));
  }
  for (const route of ["account", "grades", "portfolio", "achievements"]) {
    assert.ok(hub.includes("#/" + route));
  }
  assert.match(html, /drawerCabinet/);
});

test("shop includes an expanded offline avatar and font collection", () => {
  const shop = read("shop.js");
  const avatarIds = [...shop.matchAll(/\{ id: "av\d+"/g)].length;
  const fontIds = [...shop.matchAll(/id: "font-/g)].length;
  assert.ok(avatarIds >= 16, "expected at least 16 avatar choices");
  assert.ok(fontIds >= 20, "expected at least 20 font choices");
  for (const theme of ["aurora", "ruby", "steel", "amber", "blueprint", "emerald"]) {
    assert.ok(shop.includes('id: "' + theme + '"'));
  }
  assert.match(shop, /data:image\/svg\+xml/);
});

test("workbook figures are selected by relevant topics and all referenced files exist", () => {
  const workbook = read("workbooks.js");
  assert.match(workbook, /editorial&&Array\.isArray\(editorial\.images\)/);
  assert.doesNotMatch(workbook, /meme-cat\.jpg/);
  const imageNames = [...workbook.matchAll(/add\("(fig-[^"]+\.png)"/g)].map((m) => m[1]);
  assert.ok(imageNames.length > 0);
  for (const image of imageNames) {
    assert.ok(fs.existsSync(path.join(root, "assets", "images", image)), "missing workbook image: " + image);
  }
});

test("local PDF resources have a same-site viewer and valid source files", () => {
  const workbook = read("workbooks.js");
  const viewer = read("pdf-viewer.js");
  const pdfPaths = [...workbook.matchAll(/href="(materials\/reference\/[^"]+\.pdf)"/g)].map((m) => m[1]);
  assert.ok(pdfPaths.length >= 5);
  for (const pdf of pdfPaths) {
    assert.ok(fs.existsSync(path.join(root, pdf)), "missing PDF resource: " + pdf);
  }
  assert.match(viewer, /new URL\(link\.href/);
  assert.match(viewer, /iframe/);
});

test("MDK 07.01 practicals match their topics and the method PDF link resolves", () => {
  const data = read("data-0701.js");
  const workbook = read("workbooks.js");
  for (const legacy of [
    "Разработка алгоритма сборки разъёмных соединений",
    "Проведение анализа сборочной единицы на технологичность",
    "Импорт комплекта документов в PDF и Excel",
    "Разработка моделей и УП для деталей, требующих пост-обработки"
  ]) assert.ok(!data.includes(legacy), "legacy or mismatched practical remains: " + legacy);
  assert.ok(!data.includes("МДК 02.01") && !data.includes("МДК 02.02"), "cross-module practical labels must be removed");
  for (const code of ["ПЗ 1.1","ПЗ 1.2","ПЗ 1.3","ПЗ 1.4","ПЗ 2.1","ПЗ 2.2","ПЗ 2.3","ПЗ 3.1","ПЗ 3.2","ПЗ 3.3","ПЗ 3.5","ПЗ 4.1","ПЗ 4.2","ПЗ 4.4","ПЗ 5.4"]) {
    assert.ok(data.includes('code: "' + code + '"') || data.includes('"code":"' + code + '"'), "missing local practical code " + code);
  }
  assert.match(data, /title: "Составление карты функций устройства ЧПУ"/);
  assert.ok(!data.includes("1.5 * Радиус"), "remove unsupported safety-distance multiplier");
  assert.match(data, /безопасное расстояние определяют по документации оборудования/);
  assert.match(data, /dсв = D − P/);
  assert.match(data, /тангенс половинного угла конуса/);
  assert.match(data, /траектории центра фрезы для обхода прямоугольного контура снаружи/);
  assert.match(data, /перевести полученный объём из мм³ в см³/i);
  assert.match(data, /расчётная длина хода без подхода и перебега/);
  assert.ok(!data.includes('href="./method.pdf"'), "obsolete root PDF path must be removed");
  assert.ok(data.includes('href="./materials/reference/method.pdf"'), "verified PDF path must be used");
  assert.ok(fs.existsSync(path.join(root, "materials/reference/method.pdf")));
  assert.match(workbook, /Учебный пример: цикл сверления/);
  assert.match(workbook, /Учебный пример: фрагмент УП для фрезерования/);
  assert.match(workbook, /контур.*детал|элемент.*контура/);
  assert.match(workbook, /траектор.*инструмент|элемент.*траектор/);
  assert.match(workbook, /String\(courseId\)==="07\.01"\?""/);
  assert.match(workbook, /String\(courseId\)==="07\.01"\?"":/);
  assert.ok(workbook.includes('String(courseId)==="07.01"?null:'), "generic memes must be disabled for this workbook");
});


test("MDK 07.01 quiz questions have valid, non-duplicated options and varied answer positions", () => {
  const source = read("data-0701.js");
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const moduleData = sandbox.window.MDK_DATA["07.01"];
  assert.ok(moduleData && Array.isArray(moduleData.sections), "MDK 07.01 data must load");
  const topics = moduleData.sections.flatMap((section) => section.topics || []);
  const questions = topics.flatMap((topic) => (topic.test || []).map((question) => ({ topic: topic.title, ...question })));
  assert.ok(questions.length >= 80, "expected the full topic quiz bank");
  const positions = new Set();
  for (const question of questions) {
    assert.equal(typeof question.q, "string");
    assert.ok(question.q.trim().length > 0, "question text must not be empty");
    assert.ok(Array.isArray(question.options) && question.options.length >= 3, question.q);
    assert.ok(question.options.every((option) => typeof option === "string" && option.trim()), question.q);
    assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < question.options.length, question.q);
    const normalized = question.options.map((option) => option.trim().toLocaleLowerCase("ru"));
    assert.equal(new Set(normalized).size, normalized.length, "duplicate options in: " + question.q);
    positions.add(question.correct);
  }
  assert.ok(positions.size >= 3, "correct answers should not always occupy the same position");
});


test("MDK 07.01 has a core quiz for every teaching topic", () => {
  const dataSandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(read("data-0701.js"), dataSandbox, { timeout: 1000 });
  const topics = dataSandbox.window.MDK_DATA["07.01"].sections
    .flatMap((section) => section.topics || [])
    .filter((topic) => /^t-[1-5]-/.test(topic.id));
  assert.equal(topics.length, 21, "expected all 21 teaching topics");
  for (const topic of topics) {
    assert.ok(Array.isArray(topic.test) && topic.test.length >= 5, topic.id + " must have at least five core questions");
  }
  const coreCount = topics.reduce((sum, topic) => sum + topic.test.length, 0);
  assert.equal(coreCount, 105, "core bank should contain 105 questions");
  const hardSandbox = { window: {} };
  vm.runInNewContext(read("hard-questions.js"), hardSandbox, { timeout: 1000 });
  const hardCount = Object.entries(hardSandbox.window.HARD_TESTS)
    .filter(([id]) => /^t-[1-5]-/.test(id))
    .reduce((sum, [, questions]) => sum + questions.length, 0);
  assert.equal(hardCount, 55, "advanced bank should contain 55 additional questions");
});

test("MDK 07.01 additional quiz bank has valid varied answer keys", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(read("hard-questions.js"), sandbox, { timeout: 1000 });
  const bank = sandbox.window.HARD_TESTS;
  const topicIds = new Set(["t-1-1","t-1-2","t-1-3","t-1-4","t-2-1","t-2-2","t-2-3","t-3-1","t-3-2","t-3-3","t-3-4","t-3-5","t-3-6","t-4-1","t-4-2","t-4-3","t-4-4","t-5-1","t-5-2","t-5-3","t-5-4"]);
  const positions = new Set();
  let count = 0;
  for (const [topicId, questions] of Object.entries(bank)) {
    if (!topicId.startsWith("t-")) continue;
    assert.ok(topicIds.has(topicId), "unknown MDK 07.01 topic: " + topicId);
    assert.ok(Array.isArray(questions));
    for (const question of questions) {
      count++;
      assert.ok(question.q && question.q.trim(), "empty hard question");
      assert.ok(Array.isArray(question.options) && question.options.length >= 3, question.q);
      assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < question.options.length, question.q);
      const normalized = question.options.map((option) => option.trim().toLocaleLowerCase("ru"));
      assert.equal(new Set(normalized).size, normalized.length, "duplicate options: " + question.q);
      positions.add(question.correct);
    }
  }
  assert.ok(count >= 50, "additional bank should contain at least 50 MDK 07.01 questions");
  assert.ok(positions.size >= 3, "additional correct answers should use varied positions");
  assert.doesNotMatch(read("hard-questions.js"), /Не менее 1 метра от вращающихся частей|16К20|6Р82/);
});

test("MDK 07.01 training and final exam include the additional bank only once", () => {
  const exam = read("exam_0701.js");
  assert.equal((exam.match(/baseQuestions = baseQuestions\.concat\(window\.HARD_TESTS\[t\.id\]\)/g) || []).length, 2);
  assert.match(exam, /function shuffle0701/);
  assert.doesNotMatch(exam, /\.sort\(function\(\)\{ return Math\.random\(\) - 0\.5; \}\)/);
});


test("MDK 07.01 topic tests avoid several known cross-topic repeats", () => {
  const data = read("data-0701.js");
  const hard = read("hard-questions.js");
  for (const repeated of ["Для длинных валов применяют", "Ключ в патроне", "Что такое WCS (Working Coordinate System)?", "Какой командой задается относительная система координат?", "Что такое эквидистанта в программировании ЧПУ?"]) {
    assert.ok(!data.includes(repeated) && !hard.includes(repeated), "replace repeated quiz prompt: " + repeated);
  }
  assert.match(data, /При обработке вала с двух установов базу выбирают так/);
  assert.match(hard, /При внешнем скруглении R детали = 8 мм/);
  assert.match(hard, /значение G98\/G99 нужно сверять/);
});

test("MDK 07.01 final exam samples different topics within every section", () => {
  const sandbox = { window: { MDK_DATA: {}, HARD_TESTS: {} } };
  vm.runInNewContext(read("data-0701.js"), sandbox, { timeout: 1000 });
  vm.runInNewContext(read("hard-questions.js"), sandbox, { timeout: 1000 });
  vm.runInNewContext(read("exam_0701.js"), sandbox, { timeout: 1000 });
  const moduleData = sandbox.window.MDK_DATA["07.01"];
  const selected = sandbox.selectBalancedExam0701(moduleData, 10);
  assert.equal(selected.length, 10);
  const activeSections = moduleData.sections.filter((section) => section.topics.some((topic) =>
    (topic.test || []).length || (sandbox.window.HARD_TESTS[topic.id] || []).length
  ));
  assert.equal(activeSections.length, 5);
  for (const section of activeSections) {
    const sectionQuestions = selected.filter((question) => section.topics.some((topic) =>
      (topic.test || []).includes(question) || (sandbox.window.HARD_TESTS[topic.id] || []).includes(question)
    ));
    assert.equal(sectionQuestions.length, 2, "each section must contribute two questions");
    const topicIds = section.topics.filter((topic) => sectionQuestions.some((question) =>
      (topic.test || []).includes(question) || (sandbox.window.HARD_TESTS[topic.id] || []).includes(question)
    )).map((topic) => topic.id);
    assert.equal(new Set(topicIds).size, 2, "questions in a section must come from different topics");
  }
});

test("MDK 07.01 topic 4.3 quiz tests program-development theory, not turning-cycle memorization", () => {
  const source = read("data-0701.js");
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const topic = sandbox.window.MDK_DATA["07.01"].sections.flatMap((section) => section.topics || []).find((item) => item.id === "t-4-3");
  assert.ok(topic && topic.test && topic.test.length >= 5);
  const joined = topic.test.map((question) => question.q).join(" ");
  assert.match(joined, /До составления УП/);
  assert.match(joined, /планировании траектории/);
  assert.match(joined, /режима резания/);
  assert.match(joined, /Серийный запуск/);
  assert.doesNotMatch(joined, /G96|G71|T0101|M03/);
});
