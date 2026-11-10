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
  assert.match(shop, /savedCustomAvatar/);
  assert.match(shop, /Добавить собственный аватар/);
  assert.doesNotMatch(shop, /api\.dicebear\.com/);
  assert.ok((shop.match(/desc: "/g) || []).length >= 16, "each avatar must have a description matching its visual");
  for (const label of ["Инженер-наладчик", "Робот-наладчик", "Технолог", "Оператор токарного станка", "Контролёр ОТК"]) assert.ok(shop.includes(label));
});

test("online party games use supported server actions and stable player identity", () => {
  const server = read("Code.gs");
  const network = read("network-party-games.js");
  const shop = read("shop.js");
  const html = read("index.html");
  assert.match(html, /shop\.js\?v=4/);
  assert.match(html, /network-party-games\.js\?v=8/);
  assert.match(html, /network-detective\.js\?v=10/);
  assert.match(html, /coop-detective\.js\?v=9/);
  for (const action of ["bredo_answer", "bredo_vote", "bredo_next", "durak_attack", "durak_defend", "durak_take", "durak_done", "chat", "search", "mark", "theory", "dossier"]) {
    assert.ok(server.includes('"' + action + '"'), "server must accept " + action);
  }
  assert.match(server, /publicGameState_\(state,user\.email\)/);
  assert.match(server, /state:publicGameState_\(state,user\.email\),selfId:joined\.id/);
  assert.doesNotMatch(server, /state:publicGameState_\(state\),selfId:joined\.id/);
  assert.match(server, /if\(owner!==viewer\) delete p\.hand/);
  assert.match(server, /Number\(state\.maxPlayers\)\|\|12/);
  assert.match(network, /createGameRoom\(\{ game: opts\.gameId, maxPlayers: maxPlayers \}\)/);
  assert.match(network, /if \(r\.selfId\) self\.id = String\(r\.selfId\);/);
  assert.doesNotMatch(network, /h\.send\("bredo_next"/);
  const coop = read("coop-detective.js");
  assert.match(coop, /createGameRoom\(\{ game: "detective-coop", maxPlayers: 8 \}\)/);
  assert.match(coop, /maxPlayers: 8/);
  assert.match(coop, /if \(r\.selfId\) self\.id = String\(r\.selfId\);/);
  assert.match(server, /String\(state\.game\|\|""\)!=="detective-coop"/);
  assert.match(server, /if\(game==="bredo"\)/);
  assert.match(server, /safe\.votes\[id\]=true/);
  const fnStart = server.indexOf("function publicGameState_");
  const fnEnd = server.indexOf("\nfunction joinGameRoom_", fnStart);
  assert.ok(fnStart >= 0 && fnEnd > fnStart);
  const sandbox = { email_: value => String(value || "").toLowerCase() };
  vm.runInNewContext(server.slice(fnStart, fnEnd) + ";this.publicGameState_=publicGameState_;", sandbox);
  const gameState = { game:"bredo", phase:"write", players:[{id:"p1",email:"one@test",hand:["A"],role:"x"},{id:"p2",email:"two@test",hand:["B"],role:"y"}], answers:{p1:"secret 1",p2:"secret 2"}, votes:{p1:"p2"} };
  const playerView = sandbox.publicGameState_(gameState,"two@test");
  assert.deepEqual(Array.from(playerView.players[1].hand), ["B"]);
  assert.equal(playerView.players[0].hand, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(playerView.answers)), {p2:"secret 2"});
  assert.equal(playerView.votes.p1, true);
  const voteView = sandbox.publicGameState_(Object.assign({},gameState,{phase:"vote"}),"two@test");
  assert.deepEqual(JSON.parse(JSON.stringify(voteView.answers)), {p1:"secret 1",p2:"secret 2"});
});

test("workbook figures are selected by relevant topics and all referenced files exist", () => {
  const workbook = read("workbooks.js");
  const html = read("index.html");
  assert.match(html, /workbooks\.js\?v=39/);
  assert.match(workbook, /editorial&&Array\.isArray\(editorial\.images\)/);
  assert.match(workbook, /function diagram\(/);
  for (const courseBranch of [/String\(courseId\)==="MET"/, /String\(courseId\)==="OT"/, /String\(courseId\)==="04\.01"/, /\["02\.01","02\.02","MCAM"\]/]) assert.match(workbook, courseBranch);
  assert.match(workbook, /else if\(String\(courseId\)==="SPRUT_TP"\)/);
  for (const caption of ["Микрометр: измерительные поверхности и отсчёт", "Штангенциркуль: губки, штанга и нониус", "Контроль безопасности перед началом работы", "Последовательность диагностики и восстановления оборудования", "Цифровой маршрут подготовки управляющей программы", "Связь состава, структуры и свойств материала", "Рабочий цикл технолога в СПРУТ-ТП", "Две независимые классификации ТП", "Состав и связи комплекта технологических документов", "Логика рабочего пространства СПРУТ-ТП", "Источники исходных данных для разработки ТП", "Маршрутная карта: последовательность операций", "Операционная карта: что раскрывается в операции", "Маршрутно-операционный процесс: маршрут плюс детализация", "Типовой и групповой технологические процессы", "Использование аналога и шаблона без слепого копирования", "Типовая последовательность механической обработки", "Заготовительные и специальные операции", "Состав нормы штучно-калькуляционного времени", "Проверка и выпуск технологической документации", "Профиль наружной и внутренней резьбы", "Коническая поверхность", "Связь технологических документов", "Принцип сверления", "Послойное формирование детали", "Порядок выполнения и сдачи практической работы", "Интерфейс СПРУТ-ТП: рабочая область и панели", "Проект СПРУТ-ТП: структура технологического проекта", "СПРУТ-ТП: справочники и технологические ресурсы"]) assert.ok(workbook.includes(caption), "missing topic-specific workbook diagram: " + caption);
  for (const meme of ["meme-cat.jpg", "meme-js.jpg", "meme-python.jpg", "meme-variables.jpg"]) {
    assert.ok(workbook.includes(meme), "missing topic meme " + meme);
    assert.ok(fs.existsSync(path.join(root, "assets", "images", meme)), "missing meme image file " + meme);
  }
  const imageNames = [...workbook.matchAll(/add\("(fig-[^"]+\.png)"/g)].map((m) => m[1]);
  imageNames.push(...[...workbook.matchAll(/\["(fig-[^"]+\.png|warning-triangle\.png)"/g)].map((m) => m[1]));
  assert.ok(imageNames.length > 0);
  for (const image of imageNames) {
    assert.ok(fs.existsSync(path.join(root, "assets", "images", image)), "missing workbook image: " + image);
  }
});

test("teacher-created lectures are rendered in their assigned topics and sanitized", () => {
  const app = read("app.js");
  const editor = read("course-admin.js");
  assert.match(editor, /type:"lecture",title:title,code:"Доп\. лекция",content:content/);
  assert.match(app, /window\.customContent\.lectures/);
  assert.match(app, /customTopicLectures\.map/);
  assert.match(app, /safeCustomLectureHtml/);
  assert.match(app, /topic\.lectures = \(topic\.lectures \|\| \[\]\)\.concat/);
});

test("custom course materials normalize spreadsheet date-coerced course IDs", () => {
  const server = read("Code.gs");
  assert.match(server, /const courseId = normalizeCourseId_\(row\[1\] \|\| ""\);/);
  assert.match(server, /sameCourseId_\(rows\[i\]\[1\], courseId\)/);
  assert.match(server, /sameCourseId_\(values\[i\]\[1\], courseId\)/);
  assert.match(server, /courseId: normalizeCourseId_\(row\[1\] \|\| ""\), topicId:/);
  assert.match(server, /courseId:normalizeCourseId_\(row\[1\]\|\|""\),topicId:/);
  assert.match(server, /editor_\(data, normalizeCourseId_\(values\[i\]\[1\] \|\| ""\)\)/);
});

test("teacher-created materials have individual server-side visibility switches", () => {
  const server = read("Code.gs");
  const api = read("api.js");
  const controls = read("teacher-controls.js");
  assert.match(server, /case "getcustomcontentaccess": result = getCustomContentAccess_\(data\)/);
  assert.match(server, /case "setcustomcontentaccess": result = setCustomContentAccess_\(data\)/);
  assert.match(server, /function customContentIsOpen_\(/);
  assert.match(server, /contentAccess:/);
  assert.match(server, /function getCustomContentAccess_\(/);
  assert.match(server, /function setCustomContentAccess_\(/);
  assert.match(server, /if \(!customContentIsOpen_\(record\.courseId, record\.id, record\.topicId, record\.type\)\) throw new Error\("Этот тест закрыт преподавателем\."/);
  assert.match(server, /if \(!customContentIsOpen_\(record\.courseId, record\.id, record\.topicId, record\.type\)\) throw new Error\("Эта игра закрыта преподавателем\."/);
  assert.match(api, /getCustomContentAccess:function/);
  assert.match(api, /setCustomContentAccess:function/);
  assert.match(controls, /customContentAccessList/);
  assert.match(controls, /Открыть студентам/);
  assert.match(controls, /Закрыть/);
});

test("server visibility helper closes an item or its parent topic", () => {
  const server = read("Code.gs");
  const start = server.indexOf("function customContentIsOpen_");
  const end = server.indexOf("\nfunction customContentRecord_", start);
  assert.ok(start >= 0 && end > start);
  const settings = new Map();
  const sandbox = { settingValue_: (key) => settings.get(key) || "" };
  vm.runInNewContext(server.slice(start, end) + ";this.customContentIsOpen_=customContentIsOpen_;", sandbox);
  assert.equal(sandbox.customContentIsOpen_("07.01", "lec-1", "topic-1", "lecture"), true);
  settings.set("contentAccess:07.01:lec-1", JSON.stringify({open:false}));
  assert.equal(sandbox.customContentIsOpen_("07.01", "lec-1", "topic-1", "lecture"), false);
  settings.delete("contentAccess:07.01:lec-1");
  settings.set("topicAccess:07.01:topic-1", JSON.stringify({open:false}));
  assert.equal(sandbox.customContentIsOpen_("07.01", "lec-1", "topic-1", "lecture"), false);
  assert.equal(sandbox.customContentIsOpen_("07.01", "topic-1", "", "topic"), false);
});

test("exam drawer removes duplicate links added after initial page load", () => {
  const source = read("portal-final.js");
  assert.match(source, /function fixExam\(\)/);
  assert.match(source, /function watchExamDrawer\(\)/);
  assert.match(source, /new MutationObserver\(function \(\) \{ fixExam\(\); \}\)/);
});

test("workbook images cannot exceed the printable page content box", () => {
  const workbook = read("workbooks.js");
  assert.match(workbook, /max-width:100%!important;max-height:220mm/);
  assert.match(workbook, /overflow-x:hidden/);
  assert.match(workbook, /\.page figure,\.sheet figure/);
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

test("workbooks include translation, written practice, notes and only curated external photos", () => {
  const source = read("workbooks.js");
  assert.match(source, /Письменный перевод текста/);
  assert.match(source, /function writtenPractice/);
  assert.match(source, /Мои заметки/);
  assert.match(source, /Источник и лицензия/);
  assert.match(source, /data-wb="ENT"/);
  assert.match(source, /data-wb="ENB"/);
  assert.match(source, /editorial&&Array\.isArray\(editorial\.photos\)/);
  assert.doesNotMatch(source, /Special:FilePath/);
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
  assert.match(workbook, /cncWorkbookVisuals/);
  assert.match(workbook, /if\(String\(courseId\)==="07\.01"\)\{/);
  assert.doesNotMatch(workbook, /var meme=String\(courseId\)==="07\.01"\?\{file:""/);
  assert.match(workbook, /meme-js\.jpg/);
  assert.match(workbook, /meme-variables\.jpg/);
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


test("SPRUT-TP has a topic-specific assessment bank with stable unique topic ids", () => {
  const sandbox = { window: { MDK_DATA: {}, HARD_TESTS: {} } };
  vm.runInNewContext(read("data-sprut-tp.js"), sandbox, { timeout: 1000 });
  vm.runInNewContext(read("sprut-tp-question-bank.js"), sandbox, { timeout: 1000 });
  const course = sandbox.window.MDK_DATA.SPRUT_TP;
  const topics = course.sections.flatMap(section => section.topics || []);
  assert.equal(topics.length, 14);
  assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length, "topic ids must not collide");
  assert.equal(sandbox.window.SPRUT_TP_QUESTION_TOPICS, 14);
  assert.ok(sandbox.window.SPRUT_TP_QUESTION_COUNT >= 50);
  const questions = topics.flatMap(topic => topic.test || []);
  const answerPositions = new Set();
  const questionTexts = new Set();
  for (const question of questions) {
    assert.ok(question.q && question.q.trim().length > 10);
    assert.equal(question.options.length, 4);
    assert.ok(question.correct >= 0 && question.correct < question.options.length);
    assert.equal(new Set(question.options.map(x => x.toLocaleLowerCase("ru"))).size, 4);
    assert.ok(!questionTexts.has(question.q), "question text must be unique: " + question.q);
    questionTexts.add(question.q);
    answerPositions.add(question.correct);
  }
  assert.ok(answerPositions.size >= 3, "correct answer positions should vary");
});

test("course selector and exam engine use the new course bank without duplicate or placeholder questions", () => {
  const html = read("index.html");
  const sw = read("service-worker.js");
  const exam = read("exam-engine.js");
  assert.match(html, /<option value="SPRUT_TP">СПРУТ-ТП<\/option>/);
  assert.match(html, /sprut-tp-question-bank\.js\?v=1/);
  assert.ok(sw.includes("./sprut-tp-question-bank.js"));
  assert.match(sw, /portal-cache-v[0-9]+/);
  assert.doesNotMatch(exam, /Дополнительный вопрос по МДК/);
  assert.match(exam, /seen\[key\]/);
  assert.match(exam, /slice\(0, 30\)/);
  assert.match(exam, /correct \/ total/);
  assert.match(exam, /courseId === "SPRUT_TP"/);
});


test("lecture atlas uses topic-matched photos and diagrams instead of generic repeated graphics", () => {
  const html = read("index.html");
  const sw = read("service-worker.js");
  const visual = read("lecture-visual-atlas.js");
  const css = read("lecture-visual-atlas.css");
  assert.match(html, /lecture-visual-atlas\.js\?v=4/);
  assert.match(html, /sprut-tp-lecture-upgrade\.js\?v=6/);
  assert.match(html, /sprut-tp-document-examples\.js\?v=3/);
  assert.match(html, /lecture-visual-atlas\.css\?v=4/);
  assert.ok(sw.includes("./sprut-tp-document-examples.js"));
  assert.ok(sw.includes("./sprut-tp-lecture-upgrade.js"));
  assert.ok(sw.includes("./lecture-visual-atlas.js"));
  assert.ok(sw.includes("./lecture-visual-atlas.css"));
  for (const term of ["commons.wikimedia.org/wiki/Special:FilePath", "CC BY-SA 4.0", "CC BY 2.0", "CC0 1.0", "flowSvg", "graphSvg", "SPRUT_STEPS", "specialSprutFigure", "LECTURE_VISUAL_ATLAS_COUNT"]) {
    assert.ok(visual.includes(term), "visual atlas missing " + term);
  }
  assert.match(css, /\.lecture-visual-atlas/);
  const sandbox = { window: { MDK_DATA: {} } };
  for (const file of ["data-0701.js", "data-0401.js", "data-0201.js", "data-0202.js", "data-mastercam.js", "data-sprut-tp.js", "data-material.js", "data-metrology.js", "data-safety.js"]) {
    vm.runInNewContext(read(file), sandbox, { timeout: 2000 });
  }
  vm.runInNewContext(visual, sandbox, { timeout: 2000 });
  assert.ok(sandbox.window.LECTURE_VISUAL_ATLAS_COUNT >= 30, "expected topic-matched visuals in the course collection");
  const atlasImageSources = Object.values(sandbox.window.MDK_DATA).flatMap(course => course.sections || []).flatMap(section => section.topics || []).flatMap(topic => topic.lectures || []).flatMap(lecture => [...String(lecture.content || "").matchAll(/<section class="lecture-visual-atlas">([\s\S]*?)<\/section>/g)].flatMap(block => [...block[1].matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1])));
  assert.equal(new Set(atlasImageSources).size, atlasImageSources.length, "the same photo must not be repeated across lecture visual supplements");
  for (const id of ["07.01", "04.01", "02.01", "02.02", "MCAM", "SPRUT_TP", "MAT", "MET", "OT"]) {
    const course = sandbox.window.MDK_DATA[id];
    assert.ok(course && course.sections.length, "course missing: " + id);
    const lectures = course.sections.flatMap(section => section.topics || []).flatMap(topic => topic.lectures || []);
    assert.ok(lectures.length > 0, "no lectures in " + id);
    assert.ok(lectures.some(lecture => lecture.content && lecture.content.includes("lecture-visual-atlas")), "visual atlas missing in " + id);
  }
});

test("SPRUT-TP theory and practical assignments are expanded with topic-specific material", () => {
  const source=read("data-sprut-tp.js");
  const upgrade=read("sprut-tp-lecture-upgrade.js");
  const sandbox={window:{MDK_DATA:{}}};
  vm.runInNewContext(source,sandbox,{timeout:2000});
  vm.runInNewContext(upgrade,sandbox,{timeout:2000});
  const topics=sandbox.window.MDK_DATA.SPRUT_TP.sections.flatMap(section=>section.topics||[]);
  assert.equal(sandbox.window.SPRUT_TP_EXPANSION.theory,14);
  assert.equal(sandbox.window.SPRUT_TP_EXPANSION.practical,14);
  for(const topic of topics){
    const theory=topic.lectures.find(lecture=>lecture.__sprutTheoryExpanded);
    const practical=topic.practicals.find(practical=>practical.__sprutPracticeExpanded);
    assert.ok(theory, "expanded theory missing for "+topic.id);
    assert.ok(theory.content.length>3000, "theory remains too short for "+topic.id);
    assert.ok(practical, "expanded practical missing for "+topic.id);
    assert.match(practical.task,/Критерии оценивания/);
    assert.match(practical.task,/Вопросы для защиты/);
  }
});

test("SPRUT-TP includes filled examples for every listed document and practical cases for all topics", () => {
  const sandbox={window:{MDK_DATA:{}}};
  vm.runInNewContext(read("data-sprut-tp.js"),sandbox,{timeout:2000});
  vm.runInNewContext(read("sprut-tp-document-examples.js"),sandbox,{timeout:2000});
  const course=sandbox.window.MDK_DATA.SPRUT_TP;
  const topics=course.sections.flatMap(section=>section.topics||[]);
  assert.equal(sandbox.window.SPRUT_TP_DOCUMENT_EXAMPLES.documents,10);
  assert.equal(sandbox.window.SPRUT_TP_DOCUMENT_EXAMPLES.practiceCases,14);
  assert.equal(sandbox.window.SPRUT_TP_DOCUMENT_EXAMPLES.formattingGuide,true);
  assert.equal(sandbox.window.SPRUT_TP_DOCUMENT_EXAMPLES.machiningExample,true);
  const docs=topics.find(topic=>topic.title==="ЕСТД и комплект технологических документов");
  const pack=docs.lectures.find(lecture=>lecture.code==="1.3.2");
  const guide=docs.lectures.find(lecture=>lecture.code==="1.3.3");
  const machining=docs.lectures.find(lecture=>lecture.code==="1.3.4");
  assert.ok(guide, "step-by-step TP formatting guide must be added");
  assert.ok(machining, "complete stepped-shaft machining TP must be added");
  for(const term of ["маршрутной карты (МК)","операционной карты (ОК 020)","Контрольный лист перед выпуском","СПРУТ-ТП","Практическое задание"]) assert.ok(guide.content.includes(term), "TP guide missing "+term);
  for(const term of ["Вал ступенчатый","МК) — заполненный учебный фрагмент","ОК 010","ОК 015","ОК 020","Ø30 h9","Ø24 h9","Ø20 h9","Ra 3,2","Не переносить в реальное производство"]) assert.ok(machining.content.includes(term), "machining TP example missing "+term);
  for(const label of ["Карта эскизов","Технологическая инструкция","Маршрутная карта","Карта технологического процесса","Операционная карта","Комплектовочная карта","Ведомость оснастки и оборудования","Ведомость сборки изделия","Карта типового (группового) ТП","Карта типовой (групповой) операции"]) {
    assert.ok(pack.content.includes(label), "missing filled document example: "+label);
  }
  for(const topic of topics) {
    assert.ok(topic.practicals[0].task.includes("Производственная ситуация"), "practical case missing: "+topic.title);
    assert.ok(topic.practicals[0].variants.length>=3, "practical variants missing: "+topic.title);
  }
});


test("final exam catalogue hides duplicate English source and combined course records", () => {
  const finalPage = read("final.js");
  assert.match(finalPage, /course[.]id !== "basic" && course[.]id !== "technical" && course[.]id !== "EN"/);
});

test("English exam entry disables legacy semester/final catalogue and exposes only the two VPR tracks", () => {
  const html = read("index.html");
  const tools = read("english-tools.js");
  const engine = read("english-vpr-engine.js");
  const app = read("app.js");
  assert.match(app, /id !== "EN"/);
  assert.match(app, /var englishCourse = window\.state\.activeCourseId \|\| "EN"/);
  assert.match(html, /app\.js\?v=49/);
  assert.match(html, /english-tools\.js\?v=9/);
  assert.match(html, /english-vpr-engine\.js\?v=21/);
  assert.match(html, /english-proficiency-lab\.js\?v=4/);
  assert.match(tools, /Legacy semester\/final exam catalogue intentionally disabled/);
  assert.doesNotMatch(tools, /Семестровые · базовый|Итоговые · базовый|Семестровые · технический|Итоговые · технический/);
  assert.match(engine, /Basic English — базовый/);
  assert.match(engine, /Technical English — технический/);
  assert.match(engine, /window\.renderEnglishTestsPage = function/);
});


test("English course exam catalogue and CEFR laboratory expose the requested structure", () => {
  const html = read("index.html");
  const engine = read("english-vpr-engine.js");
  const lab = read("english-proficiency-lab.js");
  const sw = read("service-worker.js");
  assert.match(html, /english-proficiency-lab\.js\?v=4/);
  assert.ok(sw.includes("./english-proficiency-lab.js"));
  assert.match(html, /drawerExams/);
  assert.ok(html.includes('href="#/english-tests"'));
  assert.ok(html.includes('href="#/laboratory/english"'));
  assert.ok(!html.includes('href="#/english-tests/lab"'));
  assert.ok(!html.includes('href="#/english-tests/c1c2" class="drawer-item'));
  assert.match(engine, /var key = exam\.id \|\|/);
  assert.match(lab, /for \(var year = 1; year <= 5; year\+\+\)/);
  assert.match(lab, /semester = 1; semester <= 2/);
  assert.match(lab, /v <= 15/);
  assert.match(lab, /year <= 2 \? "basic" : "technical"/);
  assert.match(lab, /A1–A2/);
  assert.match(lab, /C1–C2/);
  assert.match(lab, /function advancedExam\(variant\)/);
  assert.match(lab, /english_cefr_c1c2_variant_/);
  assert.match(lab, /Лаборатория английского языка/);
  assert.ok(read("laboratory.js").includes('href: "#/laboratory/english"'));
  assert.ok(read("laboratory.js").includes('renderEnglishTestsPage("lab")'));
  assert.ok(read("workbooks.js").includes(".sheet img,.lecture-content img"));
  assert.ok(read("flashcard-editor.js").includes("window.enhanceTopicFlashcards"));
  assert.match(read("teacher-controls.js"), /Открыть студентам/);
  assert.match(read("teacher-controls.js"), /Закрыть/);
  assert.match(read("app.js"), /Fail closed: students must never fall back to client-side answer keys/);
  assert.ok(read("proctor-monitor.js").includes("_activeAssessmentCourseId"));
  assert.ok(read("Code.gs").includes('customContentIsOpen_(courseId, String(row[0] || ""), String(row[2] || ""), String(row[3] || ""))'));
  assert.ok(read("app.js").includes("hasEnglishAccess"));
});


test("English VPR answer keys stay server-side and the client uses protected exam endpoints", () => {
  const server = read("Code.gs");
  const bank = read("EnglishVPR-Sheets.gs");
  const engine = read("english-vpr-engine.js");
  const api = read("api.js");
  const html = read("index.html");
  assert.match(server, /case "getenglishvprexam": result = getEnglishVprExam_\(data\)/);
  assert.match(server, /case "submitenglishvprexam": result = submitEnglishVprExam_\(data\)/);
  assert.match(bank, /function sanitizeEnglishVprExam_/);
  assert.match(bank, /function submitEnglishVprExam_/);
  assert.match(bank, /EnglishVPRBank/);
  assert.match(api, /getEnglishVprExam:function/);
  assert.match(api, /submitEnglishVprExam:function/);
  assert.match(engine, /window\.API\.getEnglishVprExam\(track\)/);
  assert.match(engine, /app\.setAttribute\("translate","no"\)/);
  assert.match(engine, /app\.classList\.add\("notranslate"\)/);
  assert.match(engine, /window\.API\.submitEnglishVprExam/);
  assert.doesNotMatch(engine, /item\[1\]\+1/);
  assert.match(engine, /Перенести экзамены в защищённую таблицу/);
  assert.match(engine, /function hasStaffAccess\(\)/);
  assert.match(engine, /role === "teacher" \|\| role === "admin"/);
  assert.match(engine, /if \(hasStaffAccess\(\) && window\.API && window\.API\.importEnglishVprBank/);
  assert.match(html, /api\.js\?v=41/);
  assert.match(html, /english-vpr-engine\.js\?v=21/);
});


test("English VPR grades numbered choices correctly and renders per-gap option lists", () => {
  const server = read("EnglishVPR-Sheets.gs");
  const engine = read("english-vpr-engine.js");
  assert.match(server, /Number\(ans\[i\]\)===Number\(item\[1\]\)/);
  assert.doesNotMatch(server, /Number\(ans\[i\]\)===Number\(item\[1\]\)\+1/);
  assert.match(engine, /\(\(task\.itemOptions && task\.itemOptions\[i\]\) \|\| task\.options \|\| \[\]\)\.map/);
  assert.match(engine, /Десять кратких ответов в задании 7/);
});


test("admin role is recognized for teacher navigation and tutoring is shown only when configured", () => {
  const app = read("app.js");
  assert.match(app, /currentState\.user && currentState\.user\.role/);
  assert.match(app, /currentRole === "teacher" \|\| currentRole === "admin"/);
  assert.match(app, /tutoringLink\.style\.display=isTeacher\?"flex":"none"/);
  assert.match(app, /link\.visible!==false&&String\(link\.url\|\|""\)\.trim\(\)/);
});


test("English VPR chooser grants admin role access and verifies both server imports by reading them back", () => {
  const engine = read("english-vpr-engine.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.ok(engine.includes("!window.state.student && !hasStaffAccess()"));
  assert.ok(engine.includes("!window.canAccessCourse(course) && !hasStaffAccess()"));
  assert.ok(engine.includes("result.success !== true"));
  assert.ok(engine.includes("window.API.getEnglishVprExam(track)"));
  assert.ok(engine.includes("check.success !== true"));
  assert.ok(engine.includes("контрольное чтение"));
  assert.ok(html.includes("english-vpr-engine.js?v=21"));
  assert.ok(sw.includes("portal-cache-v290"));
});


test("non-English final exams contain 45 auto-graded questions and no written-response fields", () => {
  const finalPage = read("final.js");
  const server = read("Code.gs");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(finalPage, /FINAL_EXAM_TEST_SIZE = 45/);
  assert.match(finalPage, /picked\.length!==45/);
  assert.match(finalPage, /Все 45 заданий проверены сервером автоматически/);
  assert.doesNotMatch(finalPage, /writtenPrompts|previewWritten|textarea\[name\^="written"\]|Письменная и ситуационная часть/);
  assert.match(finalPage, /course\.id === "ENB" \|\| course\.id === "ENT"/);
  assert.match(finalPage, /#\/english-tests/);
  assert.match(server, /const target=45/);
  assert.match(server, /\["multi",10\],\["order",7\],\["match",7\],\["num",5\],\["tf",2\]/);
  assert.match(server, /hard_\|self_/);
  assert.match(server, /q\.type=type/);
  assert.match(server, /const writtenSubmission=""/);
  assert.match(html, /final\.js\?v=25/);
  assert.match(sw, /portal-cache-v290/);
});

test("server builds 45-question advanced non-English exams with protected answer keys", () => {
  const server = read("Code.gs");
  const start = server.indexOf("function finalQuestionType_");
  const end = server.indexOf("\nfunction scoreFinalAnswer_", start);
  assert.ok(start >= 0 && end > start);
  const bank = [];
  let id = 0;
  for (const type of ["multi","order","match","num","tf"]) {
    const count = {multi:13,order:10,match:10,num:8,tf:4}[type];
    for (let i=0;i<count;i++) {
      id++;
      const question = {type,q:"Сложный вопрос "+id,options:["A","B","C"],correct:type==="multi"?[0,2]:type==="num"?12:type==="tf"?1:0};
      if(type==="order"){question.items=["шаг 1","шаг 2","шаг 3"];question.correctOrder=question.items.slice();}
      if(type==="match"){question.pairs=[{left:"L1",right:"R1"},{left:"L2",right:"R2"}];}
      bank.push({bankId:"exam_primary",questionId:"Q"+id,question});
    }
  }
  for (let i=0;i<16;i++) bank.push({bankId:"hard_topic",questionId:"H"+i,question:{type:"mc",q:"Задача повышенной сложности "+i,options:["A","B","C"],correct:1}});
  const sandbox = {
    auth_:()=>({role:"student",email:"student@test"}),
    hasCourseAccess_:()=>true,
    results_:()=>({getDataRange:()=>({getValues:()=>[["Email"]]})}),
    email_:value=>String(value||"").toLowerCase(),
    sameCourseId_:()=>true,
    settingValue_:()=>""
    ,allFinalExamEntries_:()=>bank
    ,shuffledServer_:items=>items.slice()
    ,Utilities:{getUuid:()=>"exam-test"}
    ,CacheService:{getScriptCache:()=>({put:(key,value)=>{sandbox.cached=JSON.parse(value);}})}
  };
  vm.runInNewContext(server.slice(start,end)+";this.getFinalExam_=getFinalExam_;",sandbox,{timeout:1000});
  const result=sandbox.getFinalExam_({courseId:"07.01"});
  assert.equal(result.questions.length,45);
  assert.equal(sandbox.cached.questions.length,45);
  assert.equal(result.questions.filter(entry=>entry.question.type==="multi").length,10);
  assert.equal(result.questions.filter(entry=>entry.question.type==="order").length,7);
  assert.equal(result.questions.filter(entry=>entry.question.type==="match").length,7);
  assert.equal(result.questions.filter(entry=>entry.question.type==="num").length,5);
  assert.equal(result.questions.filter(entry=>entry.question.type==="tf").length,2);
  assert.ok(result.questions.every(entry=>!Object.prototype.hasOwnProperty.call(entry.question,"correct")));
  assert.equal(result.questions.filter(entry=>entry.questionId.startsWith("H")).length,14);
  assert.ok(result.questions.every(entry=>entry.questionId.startsWith("Q") || entry.questionId.startsWith("H")));
});


test("semester tests are student-visible and scored only by the protected server bank", async () => {
  const engine = await read("english-vpr-engine.js");
  const api = await read("api.js");
  const server = await read("Code.gs");
  assert.match(engine, /function renderSemesterTests/);
  assert.match(engine, /renderSemesterTests\(track, course, choices\)/);
  assert.match(engine, /window\.API\.getEnglishSemesterTests\(track\)/);
  assert.match(engine, /function startSemesterTest/);
  assert.match(engine, /submitEnglishSemesterTest/);
  assert.match(api, /submitEnglishSemesterTest:function/);
  assert.match(server, /case "submitenglishsemestertest": result = submitEnglishSemesterTest_\(data\); break;/);
  assert.match(server, /function submitEnglishSemesterTest_\(data\)/);
  assert.match(server, /question\.correct/);
  assert.ok(server.includes("Number.isInteger(answer) && answer === correct"));
  assert.match(server, /english_semester_/);
  assert.match(server, /Submission:JSON\.stringify\(\{answers:answers\}\)/);
});


test("English semester source bank is loaded before the student assessment engine", () => {
  const html = read("index.html");
  const source = read("english-assessment-data.js");
  assert.match(html, /english-assessment-data\.js\?v=1/);
  assert.ok(html.indexOf("english-assessment-data.js") < html.indexOf("english-vpr-engine.js"));
  assert.match(source, /window\.SEMESTER_TESTS\.basic/);
  assert.match(source, /window\.SEMESTER_TESTS\.technical/);
});


test("semester assessment auto-submits unanswered questions when the timer expires", async () => {
  const engine = await read("english-vpr-engine.js");
  assert.match(engine, /if\(seconds>0\)\{window\.alert\("Ответьте на все 20 вопросов/);
  assert.match(engine, /answers\.push\(-1\)/);
  assert.match(engine, /if\(seconds>0&&!window\.confirm/);
});


test("game room is curated to three educational activities without duplicate menu injection", async () => {
  const games = await read("games.js");
  const network = await read("network-party-games.js");
  const detective = await read("coop-detective.js");
  assert.match(games, /id: "gcode"/);
  assert.match(games, /id: "party".*Блиц по ЧПУ/);
  assert.match(games, /id: "detective"/);
  assert.doesNotMatch(games, /id: "(casino|roulette|minesweeper|memory|tictactoe|snake|pumpkin|slime|dragon|starfield)"/);
  assert.match(network, /Онлайн-режимы доступны по приглашению, но не засоряют основной каталог/);
  assert.match(detective, /Не добавляем вторую карточку поверх меню/);
});

test("assessment anti-cheating monitoring remains enabled for browser-visible violations", async () => {
  const html = await read("index.html");
  const monitor = await read("proctor-monitor.js");
  const server = await read("Code.gs");
  assert.match(html, /proctor-monitor\.js/);
  for (const event of ["visibility_hidden", "window_blur", "fullscreen_exit", "copy_attempt", "paste_attempt", "contextmenu_attempt"]) {
    assert.ok(monitor.includes('"'+event+'"'), "missing proctor event: " + event);
  }
  assert.match(monitor, /window\.API\.logProctorEvent/);
  assert.match(server, /function logProctorEvent_/);
});


test("party mini-games no longer inject extra cards into the main educational game room", () => {
  const party = read("party-games.js");
  const games = read("games.js");
  assert.match(games, /id: "gcode"/);
  assert.match(games, /id: "party".*Блиц по ЧПУ/);
  assert.match(games, /id: "detective"/);
  assert.doesNotMatch(party, /data-party-extra/);
  assert.doesNotMatch(party, /var games=\[\s*\[\s*"bredo"/);
});

test("certificate print output uses a dedicated A4 landscape print root and image-backed backgrounds", () => {
  const cert = read("certificate-supplement.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(cert, /certificatePrintRoot/);
  assert.match(cert, /@page\{size:A4 landscape;margin:10mm\}/);
  assert.match(cert, /function ensurePrintBackground/);
  assert.match(cert, /cs-print-bg/);
  assert.match(cert, /break-after:page/);
  assert.match(cert, /break-before:auto;page-break-before:auto/);
  assert.match(html, /certificate-supplement\.js\?v=11/);
  assert.match(sw, /portal-cache-v290/);
});


test("workbooks include differentiated supplemental professional learning blocks", () => {
  const workbooks = read("workbooks.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(workbooks, /function supplementalStudyBlock/);
  assert.match(workbooks, /Дополнительный материал · уровень углубления/);
  for (const course of ["07.01", "04.01", "MET", "OT", "MCAM", "ENB", "ENT"]) {
    assert.ok(workbooks.includes('id==="' + course + '"'), "missing supplemental track: " + course);
  }
  assert.match(workbooks, /supplementalHtml\+checkHtml/);
  assert.match(html, /workbooks\.js\?v=40/);
  assert.match(sw, /portal-cache-v291/);
});
