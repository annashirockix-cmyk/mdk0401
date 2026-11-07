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

test("workbooks include translation, written practice, notes and attributed external photos", () => {
  const source = read("workbooks.js");
  assert.match(source, /Письменный перевод текста/);
  assert.match(source, /function writtenPractice/);
  assert.match(source, /Мои заметки/);
  assert.match(source, /Источник и лицензия/);
  assert.match(source, /data-wb="ENT"/);
  assert.match(source, /data-wb="ENB"/);
  assert.match(source, /Special:FilePath/);
  assert.match(source, /lectureStudySummary/);
  assert.match(source, /wb-summary/);
  assert.match(source, /latin\/\(latin\+cyr/);
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
  assert.match(data, /title: "Сравнение систем программного управления"/);
  assert.ok(!data.includes("Сравнение стоек Fanuc \/ Siemens \/ Heidenhain"), "self-study must match the lecture content");
  assert.ok(!data.includes("1.5 * Радиус"), "remove unsupported safety-distance multiplier");
  assert.match(data, /безопасное расстояние определяют по документации оборудования/);
  assert.match(data, /dсв = D − P/);
  assert.match(data, /тангенс половинного угла конуса/);
  assert.match(data, /внешний прямоугольный контур 80×40 мм/);
  assert.match(data, /Подготовка модели и параметров печати на аддитивном оборудовании/);
  assert.match(data, /поддержки предусмотрены там, где они необходимы/);
  assert.match(data, /Проанализируйте один возможный дефект/);
  for (const rubric of [
    /полнота последовательности 4 б\./,
    /корректность сравнения систем 4 б\./,
    /логика и полнота маршрута 4 б\./,
    /координаты отверстий 3 б\./,
    /последовательность переходов 4 б\./,
    /обоснование компенсации радиуса 2 б\./
  ]) assert.match(data, rubric, "foundational practical must have a 10-point rubric");
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
  assert.ok(workbook.includes('var meme=String(courseId)==="07.01"?{file:"",caption:'), "MDK 07.01 uses topic-specific workshop humour rather than unrelated generic memes");
  assert.ok(workbook.includes("Справочный блок: документы технологического процесса"), "workbook must include production document references");
});


test("SPRUT-TP is registered as a complete course with all major process types", () => {
 const source=read("data-sprut-tp.js"),sandbox={window:{MDK_DATA:{}}};
 vm.runInNewContext(source,sandbox,{timeout:1000});
 const course=sandbox.window.MDK_DATA.SPRUT_TP;
 assert.ok(course&&course.sections.length>=5);
 const topics=course.sections.flatMap(s=>s.topics||[]);
 assert.ok(topics.length>=13);
 for(const t of topics){assert.ok(t.lectures[0].content.length>700);assert.ok(t.practicals.length);assert.ok(t.test.length);}
 const all=topics.map(t=>t.title+" "+t.lectures[0].content).join(" ").toLowerCase();
 for(const term of ["маршрутный","операционный","типовой","групповой","маршрутно-операционный","нормоконтроль"])assert.ok(all.includes(term));
});
test("lecture enrichment includes targeted Mastercam and MDK learning supports",()=>{
 const source=read("lecture-enrichment.js");
 for(const id of ["MCAM","02.01","02.02","04.01","MAT","MET","OT"])assert.ok(source.includes('id==="'+id+'"'));
 assert.ok(source.includes("lecture-notes-lines"));
});
test("MDK 07.01 quiz questions have valid, non-duplicated options and varied answer positions", () => {
  const source = read("data-0701.js");
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const moduleData = sandbox.window.MDK_DATA["07.01"];
  assert.ok(moduleData && Array.isArray(moduleData.sections), "MDK 07.01 data must load");
  assert.ok(moduleData.sections[0].topics[0].lectures[0].content.includes("Исторический очерк: от механизации к ЧПУ"), "first lecture must include expanded CNC history");
  assert.ok(moduleData.sections[0].topics[1].lectures[0].content.includes("lecture-visual-supplement"), "topic lectures must include visual and reference supplements");
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
  assert.equal(hardCount, 56, "advanced bank should contain 56 additional questions");
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


test("MDK 07.01 topic 4.1 checks are grounded in the setup lecture", () => {
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(read("data-0701.js"), sandbox, { timeout: 1000 });
  const topic = sandbox.window.MDK_DATA["07.01"].sections.flatMap((section) => section.topics || []).find((item) => item.id === "t-4-1");
  const prompts = topic.test.map((question) => question.q + " " + question.options.join(" ")).join(" ");
  assert.match(prompts, /резервную копию/);
  assert.match(prompts, /активную систему координат/);
  assert.match(prompts, /Карта наладки фиксирует/);
  assert.match(prompts, /заданное и фактическое положение/);
  assert.doesNotMatch(prompts, /износ/);
});

test("MDK 07.01 topic 4.2 quiz follows its lecture rather than unsupported controller trivia", () => {
  const source = read("data-0701.js");
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const topic = sandbox.window.MDK_DATA["07.01"].sections.flatMap((section) => section.topics || []).find((item) => item.id === "t-4-2");
  const prompts = topic.test.map((question) => question.q).join(" ");
  assert.match(prompts, /обратной связи/);
  assert.match(prompts, /интерполяция/);
  assert.match(prompts, /незнакомой команды/);
  assert.doesNotMatch(prompts, /DNC|Fanuc|Heidenhain/);
});

test("MDK 07.01 topic tests avoid several known cross-topic repeats", () => {
  const dataSandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(read("data-0701.js"), dataSandbox, { timeout: 1000 });
  const corePrompts = dataSandbox.window.MDK_DATA["07.01"].sections
    .flatMap((section) => section.topics || [])
    .flatMap((topic) => (topic.test || []).map((question) => question.q));
  const hardSandbox = { window: {} };
  vm.runInNewContext(read("hard-questions.js"), hardSandbox, { timeout: 1000 });
  const hardPrompts = Object.values(hardSandbox.window.HARD_TESTS)
    .flatMap((questions) => questions.map((question) => question.q));
  const prompts = corePrompts.concat(hardPrompts).join(" ");
  for (const repeated of ["Для длинных валов применяют", "Ключ в патроне", "Что такое WCS (Working Coordinate System)?", "Какой командой задается относительная система координат?", "Что такое эквидистанта в программировании ЧПУ?"]) {
    assert.ok(prompts.split(repeated).length - 1 <= 1, "remove duplicate quiz prompt: " + repeated);
  }
  assert.ok(corePrompts.some((prompt) => prompt.includes("При обработке вала с двух установов базу выбирают так")));
  assert.ok(hardPrompts.some((prompt) => prompt.includes("При внешнем скруглении R детали = 8 мм")));
  assert.ok(hardPrompts.some((prompt) => prompt.includes("значение G98/G99 нужно сверять")));
});

test("MDK 07.01 numeric practical answer keys match their stated data", () => {
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(read("data-0701.js"), sandbox, { timeout: 1000 });
  const practicals = sandbox.window.MDK_DATA["07.01"].sections.flatMap((section) => section.topics || []).flatMap((topic) => topic.practicals || []);
  const byCode = new Map(practicals.map((item) => [item.code, item]));
  const expected = { "ПЗ 1.1": "955", "ПЗ 1.2": "1.46", "ПЗ 2.1": "2.5", "ПЗ 2.2": "14.5", "ПЗ 2.3": "0.1", "ПЗ 3.1": "0.4", "ПЗ 3.2": "5", "ПЗ 3.3": "40", "ПЗ 3.5": "280", "ПЗ 4.4": "480" };
  for (const [code, answer] of Object.entries(expected)) assert.equal(byCode.get(code)?.expectedAnswer, answer, code);
  assert.equal(byCode.get("ПЗ 1.3")?.expectedAnswer, undefined, "PZ 1.3 is a structural practical, not an unsupported gear-ratio calculation");
  assert.equal(byCode.get("ПЗ 5.4")?.expectedAnswer, undefined, "PZ 5.4 is a slicer setup practical, not unrelated arithmetic");
  assert.match(byCode.get("ПЗ 5.4").title, /параметров печати/);
  assert.match(byCode.get("ПЗ 5.4").task, /подготовьте задание для слайсера/);
  assert.match(byCode.get("ПЗ 5.4").task, /высота слоя, ширина линии, число периметров, заполнение/);
  assert.match(byCode.get("ПЗ 5.4").task, /предварительном просмотре проверьте/);
  assert.match(byCode.get("ПЗ 5.4").task, /Критерии: проверка модели и области построения/);
  assert.match(byCode.get("ПЗ 3.4-А").task, /Для своего варианта/);
  assert.match(byCode.get("ПЗ 3.4-А").variants[1], /начало координат \(10;5\)/);
  assert.match(byCode.get("ПЗ 3.4-Б").task, /Для своего варианта/);
  assert.match(byCode.get("ПЗ 3.5").task, /единый контрольный расчёт, не зависящий от варианта/);
  assert.match(byCode.get("ПЗ 3.5").variants[0], /58×38 мм/);
  assert.match(byCode.get("ПЗ 5.1-А").task, /Для своего варианта/);
  assert.match(byCode.get("ПЗ 5.1-А").variants[1], /радиусом 20 мм с центром \(40;30\)/);
  assert.match(byCode.get("ПЗ 5.2-А").task, /Для своего варианта/);
  assert.match(byCode.get("ПЗ 5.3-А").task, /Для своего варианта/);
  assert.match(byCode.get("ПЗ 5.3-Б").task, /Для своего варианта/);
  assert.match(byCode.get("ПЗ 4.2").task, /разомкнутой и замкнутой систем управления/);
  assert.doesNotMatch(byCode.get("ПЗ 4.2").task, /Fanuc|Siemens|Heidenhain/);
  for (const code of ["ПЗ 1.1","ПЗ 1.2","ПЗ 2.1","ПЗ 2.2","ПЗ 2.3","ПЗ 3.1","ПЗ 3.2","ПЗ 3.3","ПЗ 4.4"]) {
    assert.match(byCode.get(code).task, /контрольный расчёт, одинаковый для всех вариантов|отдельный контрольный расчёт, одинаковый для всех вариантов/i);
  }
  assert.match(byCode.get("ПЗ 3.6-Б").task, /G03 X40 Y10 I0 J10/);
  assert.match(byCode.get("ПЗ 3.6-Б").task, /G03 — дуга против часовой стрелки/);
});

test("MDK 07.01 G43 question is assigned to milling, not setup functions", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(read("hard-questions.js"), sandbox, { timeout: 1000 });
  const bank = sandbox.window.HARD_TESTS;
  assert.ok(!bank["t-4-1"].some((question) => question.q.includes("G43")));
  assert.ok(bank["t-5-3"].some((question) => question.q.includes("G43")));
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
