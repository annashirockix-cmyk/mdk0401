// Regression coverage for portal workbook content and print layout.
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


test("student grades refresh from server and show the latest retake", () => {
  const app = read("app.js");
  const server = read("Code.gs");
  assert.match(app, /id="serverAssessmentGrades"/);
  assert.match(app, /getMyCourseResults\(""/);
  assert.match(app, /var grouped=Object\.create\(null\)/);
  assert.match(app, /attempts\[attempts\.length-1\]/);
  assert.match(app, /Попыток:/);
  assert.match(app, /indexOf\("assignment_"\)!==0/);
  assert.match(app, /indexOf\("metrology_"\)!==0/);
  assert.match(server, /function getMyCourseResults_\(data\)/);
  assert.match(server, /finishedAt:String\(r\[11\]\|\|""\)/);
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

test("MDK 02.02 contains expanded assembly automation lectures and assessments", () => {
  const source = read("data-0202.js");
  const html = read("index.html");
  assert.match(html, /data-0202\.js\?v=3/);
  assert.equal((source.match(/"id": "m0202-t/g) || []).length, 7);
  assert.equal((source.match(/"q":/g) || []).length, 28);
  assert.equal((source.match(/"practical": \{/g) || []).length, 7);
  assert.equal((source.match(/"selfWork": \[/g) || []).length, 7);
  assert.match(source, /конечный автомат/);
  assert.match(source, /обратная связь/);
  assert.match(source, /постпроцессор/);
  assert.match(source, /анизотропия/);
  assert.match(source, /покадровый режим/);
  assert.match(source, /безопасное состояние/);
  assert.doesNotMatch(source, /Первый этап сборки —|Размерная база в программе задаёт/);
});

test("automated assembly workbook topics have distinct automation profiles", () => {
  const editorial = read("workbook-editorial.js");
  const course = editorial.slice(editorial.indexOf('"02.02": {'), editorial.indexOf('"MAT": {'));
  for (const id of ["m0202-t11","m0202-t12","m0202-t13","m0202-t21","m0202-t22","m0202-t23","m0202-t24"]) assert.ok(course.includes(JSON.stringify(id)), "missing assembly automation profile: "+id);
  for (const phrase of ["конечный автомат","датчики","подпрограмму","ПЛК","сухой прогон","постпроцессор","слайсере"]) assert.ok(course.includes(phrase), "missing automation-specific content: "+phrase);
});

test("materials science and metrology workbook topics have distinct profiles", () => {
  const editorial = read("workbook-editorial.js");
  const mat = editorial.slice(editorial.indexOf('"MAT": {'), editorial.indexOf('"MET": {'));
  const met = editorial.slice(editorial.indexOf('"MET": {'), editorial.indexOf('"OT": {'));
  for (const id of ["mat-t1","mat-t2","mat-t3","mat-t4","mat-t5","mat-t6","mat-t7","mat-t8","mat-t9","mat-t10","mat-t11"]) assert.ok(mat.includes(JSON.stringify(id)), "missing materials profile: "+id);
  for (const id of ["met-1","met-2","met-3","met-4","met-5","met-6","met-7","met-8"]) assert.ok(met.includes(JSON.stringify(id)), "missing metrology profile: "+id);
  for (const phrase of ["Диаграмма железо–цементит","Термическая обработка","Коррозия","композитная панель","Система SI","погрешность","Допуск","микрометр","радиальное биение","Поверка"]) assert.ok(editorial.includes(phrase), "missing topic-specific content: "+phrase);
});

test("occupational safety workbook topics have distinct hazard-specific profiles", () => {
  const editorial = read("workbook-editorial.js");
  const course = editorial.slice(editorial.indexOf('"OT": {'), editorial.indexOf('"MCAM": {'));
  for (const id of ["ot-1","ot-2","ot-3","ot-4","ot-5","ot-6","ot-7","ot-8","ot-9","ot-10","ot-11","ot-12"]) assert.ok(course.includes(JSON.stringify(id)), "missing safety profile: "+id);
  for (const phrase of ["Электробезопасность","Пожарная безопасность","Средства коллективной защиты","металлорежущем оборудовании","Слесарно-сборочные","Термические, химические и композитные","электрической опасности","Расследование несчастных случаев"]) assert.ok(course.includes(phrase), "missing topic-specific safety content: "+phrase);
  assert.doesNotMatch(course, /Допустим, нужно выполнить производственную задачу/);
});

test("lecture enrichment supplies topic-specific written practice for technical courses", () => {
  const source = read("lecture-enrichment.js");
  assert.match(source, /function writtenPractice\(id,title\)/);
  assert.ok(source.includes("if(/карта опасностей|анализ.*риска|производствен.*риск|фактор риска/.test(t))"));
  assert.ok(source.includes("if(/уров|levels|организац.*проект|слоя|плоскост/.test(t))"));
  for (const phrase of ["Практика: безопасная работа с электрооборудованием","Практика: действия при пожаре","Практика: выбор средств защиты","Практика: предсменный осмотр станка","Практика: контроль специального процесса","Практика: анализ культуры безопасности"]) assert.ok(source.includes(phrase), "missing focused safety practice: "+phrase);
  assert.doesNotMatch(source, /Составьте краткую технологическую карту по теме/);
  for (const phrase of ["санитарная оценка рабочего места","контроль специального процесса","чек-лист допуска","дерево поиска неисправности","протокол измерений","диаграммы Fe–C","статус средства измерений","Карта оборудования и сигналов"]) assert.ok(source.toLowerCase().includes(phrase.toLowerCase()), "missing topic-specific task: "+phrase);
  for (const phrase of ["Проверка геометрии","Контроль цепочки","Stock Setup","Verify и постпроцессирование","Карта оценки риска","Безопасная работа с электрооборудованием","действия при пожаре","предсменный осмотр станка","протокол измерений","диагностическая карта","алгоритм автоматизированного цикла"]) assert.ok(source.toLowerCase().includes(phrase.toLowerCase()), "missing topic-specific lecture practice: "+phrase);
});

test("Mastercam workbook topics have distinct CAM-specific editorial profiles", () => {
  const editorial = read("workbook-editorial.js");
  const course = editorial.slice(editorial.indexOf('"MCAM": {'), editorial.indexOf('"SPRUT_TP": {'));
  for (const id of ["mc-t11","mc-t12","mc-t13","mc-t21","mc-t22","mc-t23","mc-t31","mc-t32","mc-t41","mc-t42","mc-t51"]) assert.ok(course.includes(JSON.stringify(id)), "missing Mastercam profile: "+id);
  for (const phrase of ["Рабочее пространство Mastercam","Zip2Go","Levels","WCS","Chaining","Tool Manager","Stock Setup","Contour","Pocket","постпроцессор"]) assert.ok(course.includes(phrase), "missing CAM-specific content: "+phrase);
  assert.doesNotMatch(course, /Допустим, нужно выполнить производственную задачу/);
});

test("SPRUT-TP topic assessments and reference tables are specific to each topic", () => {
  const source = read("data-sprut-tp.js");
  const topicIds = [...source.matchAll(/"id":"([^"]+)","code":"Тема [1-6][.][1-3]"/g)].map(match => match[1]);
  assert.equal(topicIds.length, 14);
  assert.equal(new Set(topicIds).size, 14, "SPRUT-TP topic IDs must be unique across all six sections");
  assert.equal((source.match(/"test":\[\{/g) || []).length, 14);
  assert.doesNotMatch(source, /"title":"Самостоятельная работа"/);
  assert.doesNotMatch(source, /"goal":"Закрепить тему и применить её при разработке технологической документации\."/);
  for (const title of ["Карта ролей технолога и СПРУТ-ТП","Сопоставление классификаций технологических процессов","Сравнение МК, ОК и КЭ","Структура проекта и справочной информации","Проверка исходных данных детали","Самостоятельное проектирование маршрутного ТП","Разработка фрагмента операционной карты","Согласование маршрутной и операционной карт","Выбор типового или группового процесса","Анализ и адаптация технологического аналога","Планирование механической обработки","Обоснование заготовительных и специальных операций","Структура времени и исходные данные для нормирования","Нормоконтроль комплекта технологических документов"]) assert.ok(source.includes('"title":"'+title+'"'), "missing topic-specific self-work title: "+title);
  assert.equal((source.match(/"q":/g) || []).length, 42);
  assert.doesNotMatch(source, /Какое утверждение верно по теме|Как следует поступить при недостатке исходных данных|Что обязательно после автоматизированного формирования документа/);
  const genericGoal = "После изучения темы обучающийся должен знать основные понятия, определять исходные данные, применять правила проектирования ТП и проверять полученный результат.";
  const genericNote = "Комментарий технолога:</b> программа ускоряет оформление, но не исправляет неверный чертёж, ошибочно выбранную базу или неподходящий станок. Сначала инженерная логика — затем автоматизация.";
  assert.equal((source.match(/После изучения темы обучающийся должен /g) || []).length, 14);
  assert.doesNotMatch(source, /знать основные понятия, определять исходные данные, применять правила проектирования ТП/);
  assert.doesNotMatch(source, /программа ускоряет оформление, но не исправляет неверный чертёж/);
  for (const phrase of ["объяснять назначение СПРУТ-ТП","раздельно классифицировать ТП","различать назначение МК, ОК и КЭ","находить в установленной конфигурации проект","фиксировать пробелы и формулировать запросы","обосновывать заготовку и базы","разрабатывать структуру операции","распределять сведения между маршрутной","выявлять технологическую общность деталей","сравнивать новую деталь с аналогом","сопоставлять поверхности и требования чертежа","обосновывать включение заготовительных","определять состав нормы времени","выполнять нормоконтроль комплекта ТД"]) assert.ok(source.includes(phrase), "missing topic-specific learning outcome: "+phrase);
  assert.doesNotMatch(source, /Подготовьте письменный ответ по теме|Проверить полноту, последовательность и соответствие исходным требованиям/);
  assert.equal((source.match(/"correct":/g) || []).length, 0, "public SPRUT-TP questions must not contain answer keys");
  assert.match(source, /Маршрутная карта показывает последовательность операций/);
  assert.match(source, /Нормоконтроль и выпуск технологической документации/);
});

test("workbook figures are selected by relevant topics and all referenced files exist", () => {
  const workbook = read("workbooks.js");
  const html = read("index.html");
  assert.match(html, /workbooks\.js\?v=[0-9]+/);
  assert.match(html, /workbook-editorial\.js\?v=6/);
  assert.match(workbook, /editorial&&Array\.isArray\(editorial\.images\)/);
  assert.match(workbook, /function diagram\(/);
  for (const courseBranch of [/String\(courseId\)==="MET"/, /String\(courseId\)==="OT"/, /String\(courseId\)==="04\.01"/, /\["02\.01","02\.02","MCAM"\]/]) assert.match(workbook, courseBranch);
  assert.match(workbook, /else if\(String\(courseId\)==="SPRUT_TP"\)/);
  assert.match(workbook, /courseEditorial\[String\(topic\.code\)\]\|\|courseEditorial\[String\(topic\.id\)\]/);
  const editorial = read("workbook-editorial.js");
  for (const code of ["Тема 1.1","Тема 1.2","Тема 1.3","Тема 2.1","Тема 2.2","Тема 3.1","Тема 3.2","Тема 3.3","Тема 4.1","Тема 4.2","Тема 5.1","Тема 5.2","Тема 6.1","Тема 6.2"]) assert.ok(editorial.includes(JSON.stringify(code)), "missing section-specific SPRUT editorial: "+code);

  for (const caption of ["Микрометр: измерительные поверхности и отсчёт", "Штангенциркуль: губки, штанга и нониус", "Контроль безопасности перед началом работы", "Последовательность диагностики и восстановления оборудования", "Цифровой маршрут подготовки управляющей программы", "Связь состава, структуры и свойств материала", "Рабочий цикл технолога в СПРУТ-ТП", "Две независимые классификации ТП", "Состав и связи комплекта технологических документов", "Логика рабочего пространства СПРУТ-ТП", "Источники исходных данных для разработки ТП", "Маршрутная карта: последовательность операций", "Операционная карта: что раскрывается в операции", "Маршрутно-операционный процесс: маршрут плюс детализация", "Типовой и групповой технологические процессы", "Использование аналога и шаблона без слепого копирования", "Типовая последовательность механической обработки", "Заготовительные и специальные операции", "Состав нормы штучно-калькуляционного времени", "Проверка и выпуск технологической документации", "Профиль наружной и внутренней резьбы", "Коническая поверхность", "Связь технологических документов", "Принцип сверления", "Послойное формирование детали", "Порядок выполнения и сдачи практической работы", "Логика рабочего пространства СПРУТ-ТП"]) assert.ok(workbook.includes(caption), "missing topic-specific workbook diagram: " + caption);
  assert.doesNotMatch(workbook, /meme-(cat|js|python|variables)\\.jpg/, "decorative meme images must not appear in study sheets");
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
  assert.match(server, /editor_\(data, courseId\)/);
  assert.match(server, /sameCourseId_\(values\[i\]\[1\], courseId\)/);
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
  assert.match(source, /Special:FilePath/);
  assert.match(source, /CC BY-SA 4.0/);
  assert.match(source, /CC BY 2.0/);
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
  assert.doesNotMatch(workbook, /meme-(cat|js|python|variables)\.jpg/);
  
  assert.ok(workbook.includes("Справочный блок: документы технологического процесса"), "workbook must include production document references");
});


test("SPRUT-TP is registered as a complete course with all major process types", () => {
 const source=read("data-sprut-tp.js"),sandbox={window:{MDK_DATA:{}}};
 const html=read("index.html");
 assert.match(html,/data-sprut-tp\.js\?v=6/);
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
test("lecture atlas uses topic-matched photos and diagrams instead of generic repeated graphics", () => {
  const html = read("index.html");
  const sw = read("service-worker.js");
  const visual = read("lecture-visual-atlas.js");
  const css = read("lecture-visual-atlas.css");
  assert.match(html, /lecture-visual-atlas\.js\?v=5/);
  assert.match(html, /sprut-tp-lecture-upgrade\.js\?v=7/);
  assert.match(html, /sprut-tp-document-examples\.js\?v=3/);
  assert.match(html, /lecture-visual-atlas\.css\?v=6/);
  assert.ok(sw.includes("./sprut-tp-document-examples.js"));
  assert.ok(sw.includes("./sprut-tp-lecture-upgrade.js"));
  assert.ok(sw.includes("./lecture-visual-atlas.js"));
  assert.ok(sw.includes("./lecture-visual-atlas.css"));
  assert.ok(visual.includes('if(id==="SPRUT_TP")return null'));
  assert.ok(!visual.includes("LOCAL.sprutInterface") && !visual.includes("LOCAL.sprutProject") && !visual.includes("LOCAL.sprutTools"));
  assert.ok(visual.includes("Расположение нулевой точки фрезерной заготовки"));
  assert.ok(visual.includes("return COMMONS.cncMill"), "milling operation topics should use an equipment photo, not a zero-point diagram");
  for (const term of ["commons.wikimedia.org/wiki/Special:FilePath", "CC BY-SA 4.0", "CC BY 2.0", "CC0 1.0", "flowHtml", "SPRUT_STEPS", "specialSprutFigure", "LECTURE_VISUAL_ATLAS_COUNT"]) {
    assert.ok(visual.includes(term), "visual atlas missing " + term);
  }
  assert.match(css, /\.lecture-visual-atlas/);
  assert.match(css, /\.lv-flow\{/);
  assert.match(css, /\.lv-flow-node\{/);
  assert.doesNotMatch(visual, /<svg|<path|<rect|graphSvg|flowSvg/);
  const sandbox = { window: { MDK_DATA: {} } };
  for (const file of ["data-0701.js", "data-0401.js", "data-0201.js", "data-0202.js", "data-mastercam.js", "data-sprut-tp.js", "data-material.js", "data-metrology.js", "data-safety.js"]) {
    vm.runInNewContext(read(file), sandbox, { timeout: 2000 });
  }
  vm.runInNewContext(visual, sandbox, { timeout: 2000 });
  assert.ok(sandbox.window.LECTURE_VISUAL_ATLAS_COUNT >= 30, "expected topic-matched visuals in the course collection");
  for (const course of Object.values(sandbox.window.MDK_DATA)) {
    for (const topic of (course.sections || []).flatMap(section => section.topics || [])) {
      assert.ok((topic.lectures || []).filter(lecture => lecture && lecture.__visualAtlasAdded).length <= 1, "visual supplement duplicated within topic " + topic.title);
    }
  }
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


test("MDK 07.01 quiz prompts and options remain available without client answer keys", () => {
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
  for (const question of questions) {
    assert.equal(typeof question.q, "string");
    assert.ok(question.q.trim().length > 0, "question text must not be empty");
    assert.ok(Array.isArray(question.options) && question.options.length >= 3, question.q);
    assert.ok(question.options.every((option) => typeof option === "string" && option.trim()), question.q);
    assert.equal(Object.prototype.hasOwnProperty.call(question, "correct"), false, "answer keys must not be in the public course object");
    const normalized = question.options.map((option) => option.trim().toLocaleLowerCase("ru"));
    assert.equal(new Set(normalized).size, normalized.length, "duplicate options in: " + question.q);
  }
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

test("MDK 07.01 additional quiz bank keeps questions but no public answer keys", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(read("hard-questions.js"), sandbox, { timeout: 1000 });
  const bank = sandbox.window.HARD_TESTS;
  const topicIds = new Set(["t-1-1","t-1-2","t-1-3","t-1-4","t-2-1","t-2-2","t-2-3","t-3-1","t-3-2","t-3-3","t-3-4","t-3-5","t-3-6","t-4-1","t-4-2","t-4-3","t-4-4","t-5-1","t-5-2","t-5-3","t-5-4"]);
  let count = 0;
  for (const [topicId, questions] of Object.entries(bank)) {
    if (!topicId.startsWith("t-")) continue;
    assert.ok(topicIds.has(topicId), "unknown MDK 07.01 topic: " + topicId);
    assert.ok(Array.isArray(questions));
    for (const question of questions) {
      count++;
      assert.ok(question.q && question.q.trim(), "empty hard question");
      assert.ok(Array.isArray(question.options) && question.options.length >= 3, question.q);
      assert.equal(Object.prototype.hasOwnProperty.call(question, "correct"), false, "answer keys must not be public");
      const normalized = question.options.map((option) => option.trim().toLocaleLowerCase("ru"));
      assert.equal(new Set(normalized).size, normalized.length, "duplicate options: " + question.q);
    }
  }
  assert.ok(count >= 50, "additional bank should contain at least 50 MDK 07.01 questions");
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

test("MDK 07.01 numeric practical prompts do not expose expected answers in public data", () => {
  const sandbox = { window: { MDK_DATA: {} } };
  vm.runInNewContext(read("data-0701.js"), sandbox, { timeout: 1000 });
  const practicals = sandbox.window.MDK_DATA["07.01"].sections.flatMap((section) => section.topics || []).flatMap((topic) => topic.practicals || []);
  const byCode = new Map(practicals.map((item) => [item.code, item]));
  for (const code of ["ПЗ 1.1","ПЗ 1.2","ПЗ 2.1","ПЗ 2.2","ПЗ 2.3","ПЗ 3.1","ПЗ 3.2","ПЗ 3.3","ПЗ 3.5","ПЗ 4.4"]) {
    assert.ok(byCode.has(code), "missing practical " + code);
    assert.equal(byCode.get(code).expectedAnswer, undefined, code + " must not expose its expected answer");
  }
  assert.equal(byCode.get("ПЗ 1.3")?.expectedAnswer, undefined, "PZ 1.3 is a structural practical");
  assert.equal(byCode.get("ПЗ 5.4")?.expectedAnswer, undefined, "PZ 5.4 is a slicer setup practical");
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


test("SPRUT-TP has topic-specific assessment prompts without public answer keys", () => {
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
  const questionTexts = new Set();
  for (const question of questions) {
    assert.ok(question.q && question.q.trim().length > 10);
    assert.equal(question.options.length, 4);
    assert.equal(Object.prototype.hasOwnProperty.call(question, "correct"), false, "answer keys must not be public");
    assert.equal(new Set(question.options.map(x => x.toLocaleLowerCase("ru"))).size, 4);
    assert.ok(!questionTexts.has(question.q), "question text must be unique: " + question.q);
    questionTexts.add(question.q);
  }
});

test("course training routes open topic tests through the protected server workflow", () => {
  const app = read("app.js");
  assert.match(app, /window\.renderSecureTrainingPage\(mdkId\)/);
  assert.match(app, /window\.renderTopicPage\(courseId, topic\.id, "test"\)/);
  assert.match(app, /window\.API\.getBuiltInTest/);
  assert.match(app, /window\.API\.submitBuiltInTest/);
});

test("course selector and active final exam use the protected course bank", () => {
  const html = read("index.html");
  const sw = read("service-worker.js");
  const finalExam = read("final.js");
  const server = read("Code.gs");
  assert.ok(html.includes('<option value="SPRUT_TP">СПРУТ-ТП</option>'));
  assert.ok(html.includes("sprut-tp-question-bank.js?v=2"));
  assert.ok(sw.includes("./sprut-tp-question-bank.js"));
  assert.ok(!html.includes("exam-engine.js"));
  assert.ok(!sw.includes("exam-engine.js"));
  assert.ok(finalExam.includes("FINAL_EXAM_TEST_SIZE = 45"));
  assert.ok(finalExam.includes("getFinalExam"));
  assert.ok(finalExam.includes("submitFinalExam"));
  assert.ok(server.includes("function getFinalExam_"));
  assert.ok(server.includes("function submitFinalExam_"));
});


test("lecture atlas uses topic-matched photos and diagrams instead of generic repeated graphics", () => {
  const html = read("index.html");
  const sw = read("service-worker.js");
  const visual = read("lecture-visual-atlas.js");
  const css = read("lecture-visual-atlas.css");
  assert.match(html, /lecture-visual-atlas\.js\?v=5/);
  assert.match(html, /sprut-tp-lecture-upgrade\.js\?v=7/);
  assert.match(html, /sprut-tp-document-examples\.js\?v=3/);
  assert.match(html, /lecture-visual-atlas\.css\?v=6/);
  assert.ok(sw.includes("./sprut-tp-document-examples.js"));
  assert.ok(sw.includes("./sprut-tp-lecture-upgrade.js"));
  assert.ok(sw.includes("./lecture-visual-atlas.js"));
  assert.ok(sw.includes("./lecture-visual-atlas.css"));
  assert.ok(visual.includes('if(id==="SPRUT_TP")return null'));
  assert.ok(!visual.includes("LOCAL.sprutInterface") && !visual.includes("LOCAL.sprutProject") && !visual.includes("LOCAL.sprutTools"));
  assert.ok(visual.includes("Расположение нулевой точки фрезерной заготовки"));
  assert.ok(visual.includes("return COMMONS.cncMill"), "milling operation topics should use an equipment photo, not a zero-point diagram");
  for (const term of ["commons.wikimedia.org/wiki/Special:FilePath", "CC BY-SA 4.0", "CC BY 2.0", "CC0 1.0", "flowHtml", "SPRUT_STEPS", "specialSprutFigure", "LECTURE_VISUAL_ATLAS_COUNT"]) {
    assert.ok(visual.includes(term), "visual atlas missing " + term);
  }
  assert.match(css, /\.lecture-visual-atlas/);
  assert.match(css, /\.lv-flow\{/);
  assert.match(css, /\.lv-flow-node\{/);
  assert.doesNotMatch(visual, /<svg|<path|<rect|graphSvg|flowSvg/);
  const sandbox = { window: { MDK_DATA: {} } };
  for (const file of ["data-0701.js", "data-0401.js", "data-0201.js", "data-0202.js", "data-mastercam.js", "data-sprut-tp.js", "data-material.js", "data-metrology.js", "data-safety.js"]) {
    vm.runInNewContext(read(file), sandbox, { timeout: 2000 });
  }
  vm.runInNewContext(visual, sandbox, { timeout: 2000 });
  assert.ok(sandbox.window.LECTURE_VISUAL_ATLAS_COUNT >= 30, "expected topic-matched visuals in the course collection");
  for (const course of Object.values(sandbox.window.MDK_DATA)) {
    for (const topic of (course.sections || []).flatMap(section => section.topics || [])) {
      assert.ok((topic.lectures || []).filter(lecture => lecture && lecture.__visualAtlasAdded).length <= 1, "visual supplement duplicated within topic " + topic.title);
    }
  }
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
  assert.match(app, /var hasEnglishAccess = !window\.canAccessCourse \|\| \["EN","ENB","ENT"\]\.some/);
  assert.match(html, /app\.js\?v=\d+/);
  assert.match(html, /english-tools\.js\?v=9/);
  assert.match(html, /english-vpr-engine\.js\?v=\d+/);
  assert.match(html, /english-proficiency-lab\.js\?v=5/);
  assert.match(tools, /Legacy semester\/final exam catalogue intentionally disabled/);
  assert.doesNotMatch(tools, /Семестровые · базовый|Итоговые · базовый|Семестровые · технический|Итоговые · технический/);
  assert.match(engine, /var basic = window\.canAccessCourse\("ENB"\) \|\| window\.canAccessCourse\("EN"\)/);
  assert.match(engine, /var hasEnglishAccess = !window\.canAccessCourse \|\| \["EN","ENB","ENT"\]\.some/);
  assert.match(engine, /Basic English — базовый/);
  assert.match(engine, /Technical English — технический/);
  assert.match(engine, /window\.renderEnglishTestsPage = function/);
});


test("English course exam catalogue and CEFR laboratory expose the requested structure", () => {
  const html = read("index.html");
  const engine = read("english-vpr-engine.js");
  const lab = read("english-proficiency-lab.js");
  const sw = read("service-worker.js");
  assert.match(html, /english-proficiency-lab\.js\?v=5/);
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
  assert.match(engine, /if \(hasStaffAccess\(\) && window\.API && window\.API\.importEnglishVprBank\)/);
  assert.doesNotMatch(engine, /window\.ENGLISH_VPR_EXAMS/);
  assert.match(bank, /const exam = seeds\[track\]/);
  assert.match(html, /api\.js\?v=\d+/);
  assert.match(html, /english-vpr-engine\.js\?v=22/);
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
  const controls = read("teacher-controls.js");
  assert.match(controls, /editorTutoringPanel/);
  assert.match(controls, /editorCourse/);
  assert.match(controls, /getTutoringLink\(cid\)/);
  assert.match(controls, /saveTutoringLink\(cid/);
  assert.match(controls, /Показывать вкладку студентам/);
  assert.match(app, /link\.visible!==false&&String\(link\.url\|\|""\)\.trim\(\)/);
});


test("English VPR chooser grants admin role access and verifies both server imports by reading them back", () => {
  const engine = read("english-vpr-engine.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.ok(engine.includes("!window.state.student && !hasStaffAccess()"));
  assert.ok(engine.includes("!hasEnglishAccess && !hasStaffAccess()"));
  assert.ok(engine.includes("result.success !== true"));
  assert.ok(engine.includes("window.API.getEnglishVprExam(track)"));
  assert.ok(engine.includes("check.success !== true"));
  assert.ok(engine.includes("контрольное чтение"));
  assert.ok(html.includes("english-vpr-engine.js?v=22"));
  assert.match(sw, /portal-cache-v[0-9]+/);
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
  assert.match(sw, /portal-cache-v[0-9]+/);
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


test("English semester and VPR answer data are not loaded into the public student page", () => {
  const html = read("index.html");
  const source = read("english-assessment-data.js");
  assert.doesNotMatch(html, /english-assessment-data\.js/);
  assert.doesNotMatch(source, /\bcorrect\s*:/);
  assert.match(read("english-vpr-engine.js"), /window\.API\.getEnglishSemesterTests/);
  assert.match(read("english-vpr-engine.js"), /window\.API\.getEnglishVprExam/);
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
  assert.match(sw, /portal-cache-v[0-9]+/);
});


test("English workbook renderer preserves source writing tasks instead of generic fallback assignments", () => {
  const workbooks = read("workbooks.js");
  assert.match(workbooks, /writing=Array\.isArray\(t\.writing\)\?t\.writing:\[\]/);
  assert.match(workbooks, /wb-source-writing-task/);
  const basicEnglish = read("data-english-basic.js");
  const technicalEnglish = read("data-english-technical.js");
  assert.match(basicEnglish, /Grammar Exercises: Pronouns & Verbs/);
  assert.match(technicalEnglish, /Match words with definitions/);
  assert.match(workbooks, /isEnglishCourse/);
});

test("workbooks include differentiated supplemental professional learning blocks", () => {
  const workbooks = read("workbooks.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(workbooks, /function supplementalStudyBlock/);
  assert.match(workbooks, /Коротко о главном/);
  assert.doesNotMatch(workbooks, /Зумерский перевод без душноты/);
  for (const topicId of ["ot-1","ot-2","ot-3","ot-4","ot-5","ot-6","ot-7","ot-8","ot-9","ot-10","ot-11","ot-12"]) assert.match(workbooks, new RegExp('"'+topicId+'":\\{intro:'));
  assert.match(workbooks, /не прикасайтесь к пострадавшему/i);
  assert.match(workbooks, /Составьте карту санитарной оценки выбранного рабочего места/);
  assert.match(workbooks, /Карта осмотра с критериями/);
  assert.match(workbooks, /Дополнительный материал · уровень углубления/i);
  for (const course of ["07.01", "04.01", "MET", "OT", "MCAM", "ENB", "ENT"]) {
    assert.ok(workbooks.includes('id==="' + course + '"'), "missing supplemental track: " + course);
  }
  assert.match(workbooks, /supplementalHtml\+checkHtml/);
  assert.match(html, /workbooks\.js\?v=[0-9]+/);
  assert.match(sw, /portal-cache-v[0-9]+/);
});


test("Basic and Technical English writing practice is specific to all seventeen units", () => {
  const workbooks = read("workbooks.js");
  for (const id of ["b-unit1","b-unit2","b-unit3","b-unit4","b-unit6","t-unit1","t-unit2","t-unit3","t-unit4","t-unit5","t-unit6","t-unit7","t-unit8","t-unit9","t-unit10","t-unit11","t-unit12"]) {
    assert.match(workbooks, new RegExp('"' + id + '":\\{title:'));
  }
  for (const phrase of ["Introducing myself and my future profession","My town: Nizhnekamsk","Tatarstan: region and culture","Ecology and everyday action","Additional reading: summary and opinion","Materials selection note","Technical drawing interpretation","Machine tool operation brief","Electric circuit fault report","Energy production comparison","Electronic components explanation","Technical communication at work","Computer systems and CAD/CAM workflow","Automation cycle description","Maintenance log and diagnosis","Workshop safety and near-miss report"]) {
    assert.ok(workbooks.includes(phrase), "missing unit-specific English practice: " + phrase);
  }
  assert.doesNotMatch(workbooks, /Составьте краткое письменное резюме темы на английском языке/);
});
 
test("workbook editorial coverage generates subject-specific cases for every populated course track", () => {
  const workbooks = read("workbooks.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(workbooks, /function generatedTopicEditorial\(courseId,topic\)/);
  assert.match(workbooks, /if\(!editorial\)editorial=generatedTopicEditorial\(courseId,topic\)/);
  for (const course of ["02.01", "02.02", "MCAM", "SPRUT_TP", "MET", "OT", "MAT", "EN", "ENB", "ENT", "04.01"]) {
    assert.ok(workbooks.includes('id==="' + course + '"'), "missing editorial coverage: " + course);
  }
  for (const field of ["explanation:", "caseTitle:", "caseText:", "mistakes:", "route:"]) {
    assert.ok(workbooks.includes(field), "generated editorial is missing " + field);
  }
  assert.match(workbooks, /Сборочный чертёж и спецификация/);
  assert.match(workbooks, /Входные и выходные сигналы/);
  assert.match(workbooks, /Модель и заготовка/);
  assert.match(workbooks, /Исходные данные и требования/);
  assert.match(workbooks, /Параметр и допуск/);
  assert.match(workbooks, /Операция и источник опасности/);
  assert.match(workbooks, /Состав и структура/);
  assert.match(workbooks, /basicProfiles/);
  assert.match(workbooks, /technicalProfiles/);
  assert.match(html, /workbooks\.js\?v=[0-9]+/);
  assert.match(sw, /portal-cache-v[0-9]+/);
});


test("workbooks use curated photo, table and chart packs instead of generic meme filler", () => {
  const workbooks = read("workbooks.js");
  const html = read("index.html");
  const css = read("style.css");
  const sw = read("service-worker.js");
  assert.match(workbooks, /function visualTable\(/);
  assert.match(workbooks, /function visualChart\(/);
  assert.match(workbooks, /Worker%20assembles%20metal%20parts/);
  assert.match(workbooks, /Vernier%20Caliper/);
  assert.match(workbooks, /Machine%20guarding/);
  assert.match(workbooks, /Первая помощь: безопасная последовательность действий/);
  assert.match(workbooks, /металлорежущ\|станок/);
  assert.doesNotMatch(workbooks, /опас\|защит\|безопас\|станок\|инструмент\|рабоч\|риск/);
  assert.ok(workbooks.includes("%D0%9C%D0%B8%D0%BA%D1%80%D0%BE%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0"));
  assert.match(workbooks, /CNC%20milling%20machine/);
  assert.match(workbooks, /String\(courseId\)==="MCAM"&&\/траектор\|фрез\|обработ\|станок\//);
  assert.doesNotMatch(workbooks, /String\(courseId\)==="MCAM"&&\/cam\|траектор\|фрез\|обработ\|операц\|инструмент\|заготов\//);
  assert.match(workbooks, /не скриншот интерфейса Mastercam/);
  assert.match(workbooks, /visualBlocks\+cncSourceStudy\+cncReference/);
  assert.doesNotMatch(workbooks, /var meme=String\(courseId\)/);
  assert.doesNotMatch(workbooks, /meme-cat\.jpg/);
  assert.match(css, /\.wb-visual-table/);
  assert.match(css, /\.wb-visual-chart/);
  assert.match(html, /workbooks\.js\?v=[0-9]+/);
  assert.match(html, /style\.css\?v=24/);
  assert.match(sw, /portal-cache-v[0-9]+/);
});

test("MDK 07.01 includes topic-matched, attributed real photos for lathe and milling topics", () => {
  const workbooks = read("workbooks.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(workbooks, /var cncWorkbookPhotos=\{/);
  assert.match(workbooks, /"t-1-1":\[\["https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/Wasino%20CNC%20lathe\.jpg\?width=1200"/);
  assert.match(workbooks, /"t-1-2":\[\["https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/Lathe%20machinist\.jpg\?width=1200"/);
  assert.match(workbooks, /"t-1-3":\[\["https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/MoriSeikiLathe\.jpg\?width=1200"/);
  assert.match(workbooks, /"t-1-4":\[\["https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/Control%20panel%20shows%20buttons%20and%20knobs%20in%20a%20machine%20workshop\.jpg\?width=1200"/);
  assert.match(workbooks, /"t-3-1":\[\["https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/Man%20working%20at%20programmable%20cnc%20machine%20clseup\.jpg\?width=1200"/);
  assert.match(workbooks, /"t-5-3":\[\["https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/CNC%20milling%20machine\.jpg\?width=1200"/);
  assert.match(workbooks, /Mitch Barrie · CC BY-SA 2\.0/);
  assert.match(workbooks, /Shadychiri · CC BY-SA 4\.0/);
  assert.match(workbooks, /Impressionmanufacturer · CC BY-SA 4\.0/);
  assert.match(workbooks, /Glenn McKechnie · CC BY-SA 3\.0/);
  assert.match(workbooks, /Shixart1985 · CC BY 2\.0/);
  assert.match(workbooks, /cncWorkbookPhotos\[String\(topic\.id\)\]/);
  assert.match(html, /workbooks\.js\?v=[0-9]+/);
  assert.match(sw, /portal-cache-v[0-9]+/);
});

test("MDK 07.01 adds topic-specific tables and a clearly qualified machining example chart", () => {
  const workbooks = read("workbooks.js");
  assert.match(workbooks, /Основные узлы типового токарного станка с ЧПУ/);
  assert.match(workbooks, /Маршрут разработки техпроцесса для вала/);
  assert.match(workbooks, /Системы координат при подготовке обработки/);
  assert.match(workbooks, /Адреса и команды в учебном фрагменте управляющей программы/);
  assert.match(workbooks, /Ориентиры при программировании токарной обработки/);
  assert.match(workbooks, /Проверка программы фрезерной обработки/);
  assert.match(workbooks, /Изменение наружного диаметра в учебном примере/);
  assert.match(workbooks, /не режим резания и не рекомендация по глубине прохода/);
  assert.match(workbooks, /if\(String\(courseId\)==="07\.01"\)/);
});

test("CNC workbook image captions describe the actual diagrams rather than guessed subjects", () => {
  const workbooks = read("workbooks.js");
  assert.match(workbooks, /Основные и вспомогательные движения станка/);
  assert.match(workbooks, /Системы координат токарного станка с горизонтальным и вертикальным расположением шпинделя/);
  assert.match(workbooks, /Примеры установки нулевой точки заготовки по осям Z, X и Y/);
  assert.match(workbooks, /Обработка контура буквы А: траектория инструмента на координатной сетке/);
  assert.match(workbooks, /Расположение нулевой точки заготовки на фрезерном станке с ЧПУ/);
  assert.doesNotMatch(workbooks, /fig-1-blocks\.png","(?:Основные блоки системы ЧПУ|Структурная схема системы ЧПУ|Структурная схема системы программного управления|Функциональные блоки системы управления)/);
  assert.doesNotMatch(workbooks, /fig-6-lathe\.png","(?:Токарный станок: общий вид|Токарно-винторезный станок|Токарный станок для обработки ступенчатого вала|Токарный станок с ЧПУ)/);
});

test("material-science and SPRUT-TP visuals are limited to topics that match the pictured subject", () => {
  const workbooks = read("workbooks.js");
  assert.match(workbooks, /String\(courseId\)==="MAT"&&\/структур\|железоуглерод\|сталь\|термическ\|легирован\//);
  assert.doesNotMatch(workbooks, /String\(courseId\)==="MAT"&&\/структур\|сталь\|металл\|сплав\|термо\|прочност\|свойств\|материал\//);
  assert.match(workbooks, /String\(courseId\)==="SPRUT_TP"&&\/механическ\|токар\|фрезер\|сверл\|шлиф\//);
  assert.doesNotMatch(workbooks, /String\(courseId\)==="SPRUT_TP"&&\/механическ\|заготовительн\|специальн\//);
  assert.doesNotMatch(workbooks, /String\(courseId\)==="SPRUT_TP"&&\/маршрут\|операц\|технолог\|исходн\|ресурс\|документ\|процесс\|проект\//);
  assert.match(workbooks, /Микроструктура стали 20Х/);
  assert.match(workbooks, /Пример производственного оборудования, для которого разрабатывают технологический маршрут/);
});

test("student average uses only the latest attempt per course and assessment", () => {
  const server = read("Code.gs");
  const start = server.indexOf("function getMyCourseResults_(data)");
  const end = server.indexOf("\n/* ---------- Assignments and student submissions ---------- */", start);
  assert.ok(start >= 0 && end > start);
  const fn = server.slice(start, end);
  assert.ok(fn.includes("const latestByAssessment=Object.create(null)"));
  assert.ok(fn.includes('JSON.stringify([normalizeCourseId_(x.courseId),String(x.testId||"")])'));
  assert.ok(fn.includes('if(!previous||String(x.finishedAt||"")>=String(previous.finishedAt||""))latestByAssessment[key]=x'));
  assert.ok(fn.includes("const latestResults=Object.keys(latestByAssessment)"));
  assert.ok(fn.includes("const graded=latestResults.filter"));
  assert.ok(fn.includes("completed:latestResults.length"));
  assert.ok(fn.includes("results:list,summary"));
});


test("teacher journal loads server results and saves grades to the shared Results sheet", () => {
  const server = read("Code.gs");
  const api = read("api.js");
  const app = read("app.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.match(server, /case "savemanualgrade": result = saveManualGrade_\(data\); break;/);
  const start = server.indexOf("function saveManualGrade_(data)");
  const end = server.indexOf("function gradeWrittenResult_", start);
  assert.ok(start >= 0 && end > start);
  const save = server.slice(start, end);
  assert.match(save, /editor_\(data,courseId\)/);
  assert.match(save, /hasCourseAccess_\(currentStudent,courseId\)/);
  assert.match(save, /LockService\.getScriptLock\(\)/);
  assert.match(save, /appendMappedRecord_\(results_\(\)/);
  assert.match(save, /appendAttemptAudit_/);
  assert.match(api, /saveManualGrade:function\(data\)/);
  assert.match(app, /window\.API\.getStudents\(\)/);
  assert.match(app, /window\.API\.getResults\(\{\}\)/);
  assert.match(app, /window\.API\.saveManualGrade\(payload\)/);
  assert.doesNotMatch(app.slice(app.indexOf("window.renderTeacherJournalPage = function()"), app.indexOf("window.renderCertificatePage = function()")), /localStorage\.setItem\(['"]portal_grades/);
  assert.match(html, /api\.js\?v=45/);
  assert.match(html, /app\.js\?v=54/);
  assert.match(sw, /portal-cache-v\d+/);
});

test("manual teacher grades appear in the teacher-grade section, not the automatic-tests section", () => {
  const app = read("app.js");
  const start = app.indexOf("window.renderStudentGradesPage = function()");
  const end = app.indexOf("window.renderTeacherJournalPage = function()", start);
  assert.ok(start >= 0 && end > start);
  const page = app.slice(start, end);
  assert.match(page, /id="serverManualGrades"/);
  assert.match(page, /indexOf\("manual_"\)===0/);
  assert.match(page, /indexOf\("manual_"\)!==0/);
  assert.match(page, /id="serverAssessmentGrades"/);
});


test("all custom-content delete callers send the owning course ID", () => {
  const flashcards = read("flashcard-editor.js");
  const games = read("teacher-game.js");
  const announcements = read("course-announcements.js");
  const admin = read("course-admin.js");
  assert.match(flashcards, /deleteCustomContent\(setId,course\.value\)/);
  assert.match(games, /deleteCustomContent\(b\.dataset\.delete,course\(\)\)/);
  assert.match(announcements, /deleteCustomContent\(item\.id,courseSelect\.value\)/);
  assert.match(admin, /deleteCustomContent\(id,courseSel\.value\)/);
  for (const source of [flashcards, games, announcements, admin]) {
    assert.doesNotMatch(source, /deleteCustomContent\((?:setId|b\.dataset\.delete|item\.id|id)\s*\)/);
  }
});


test("English exam tab shows only the two final tracks while CEFR lab stays separate", () => {
  const lab = read("english-proficiency-lab.js");
  const start = lab.indexOf("window.renderEnglishTestsPage=function(mode){");
  const end = lab.indexOf("console.info(\"[English] В экзаменах доступны только два итоговых варианта", start);
  assert.ok(start >= 0 && end > start);
  const route = lab.slice(start, end);
  assert.match(route, /mode==="lab"\)\{renderLab\(\);return;\}/);
  assert.match(route, /baseRenderer\(mode==="final-basic"\|\|mode==="final-technical"\?mode:""\)/);
  assert.doesNotMatch(route, /renderC1C2|variant-|renderHome/);
  assert.match(read("EnglishVPR-Sheets.gs"), /function englishVprSeedExams_\(\)/);
  assert.match(read("EnglishVPR-Sheets.gs"), /basic:\s*\{/);
  assert.match(read("EnglishVPR-Sheets.gs"), /technical:\s*\{/);
  assert.match(read("laboratory.js"), /renderEnglishTestsPage\("lab"\)/);
  assert.match(read("index.html"), /english-proficiency-lab\.js\?v=5/);
  assert.match(read("service-worker.js"), /portal-cache-v\d+/);
});


test("teacher course and role permission changes share the content lock", () => {
 const server = read("Code.gs");
 [
  ["setTeacherCourses_", "setUserRole_"],
  ["setUserRole_", "promoteUserToAdmin"]
 ].forEach(([name, next]) => {
  const start = server.indexOf("function " + name + "(data)");
  const end = server.indexOf("\nfunction " + next + "(data)", start) >= 0
   ? server.indexOf("\nfunction " + next + "(data)", start)
   : server.indexOf("\n/**", start);
  assert.ok(start >= 0 && end > start, name + " function boundaries must exist");
  const fn = server.slice(start, end);
  const lock = fn.indexOf("LockService.getScriptLock()");
  const wait = fn.indexOf("lock.waitLock(10000)");
  const authorization = fn.indexOf("admin_(data)");
  const write = fn.indexOf("writeUserFields_(");
  const release = fn.indexOf("lock.releaseLock()");
  assert.ok(lock >= 0 && wait > lock && authorization > wait, name + " must re-check admin access under the shared lock");
  assert.ok(write > authorization, name + " must update permissions while holding the lock");
  assert.ok(release > write && fn.includes("finally {"), name + " must release the lock on success or error");
 });
});


test("English VPR written answers can be graded from the teacher journal and update the final score", () => {
  const bank = read("EnglishVPR-Sheets.gs");
  const server = read("Code.gs");
  const api = read("api.js");
  const app = read("app.js");
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.ok(server.includes('case "gradeenglishvprwrittenpart": result = gradeEnglishVprWrittenPart_(data); break;'));
  assert.ok(bank.includes("function gradeEnglishVprWrittenPart_(data)"));
  assert.ok(bank.includes("function validateEnglishVprExam_(track, exam)"));
  assert.ok(bank.includes("expectedTypes = [\"choice\",\"match\",\"gap\",\"gap\",\"gap\",\"transform\",\"questionnaire\"]"));
  assert.ok(bank.includes("pending_teacher_review"));
  assert.ok(bank.includes("objectiveScore + writtenPoints"));
  assert.ok(bank.includes('notifyCourseStaff_(courseId,"written_submission","Письменная часть английского ВПР ожидает проверки"'));
  assert.ok(bank.includes("writtenMaxPoints"));
  assert.ok(bank.includes("Number(rows[i][map.Attempts] || 0) === Number(data.attempts)"));
  assert.ok(app.includes("attempts:Number(button.dataset.attempts)"));
  assert.ok(bank.includes("row[map.Submission]") && bank.includes("Submission: JSON.stringify(payload)"));
  assert.ok(bank.includes("editor_(data, courseId)"));
  assert.ok(api.includes("gradeEnglishVprWrittenPart:function(data)"));
  assert.ok(app.includes("english-vpr-pending"));
  assert.ok(app.includes("Ответ студента:"));
  assert.ok(app.includes("window.API.gradeEnglishVprWrittenPart"));
  assert.ok(app.includes('pendingWritten?"На проверке"'));
  assert.ok(html.includes("api.js?v=45"));
  assert.ok(html.includes("app.js?v=54"));
  assert.ok(/portal-cache-v\d+/.test(sw));
});


test("English VPR bank accepts only the approved 7-task, 40-point Basic/Technical shape", () => {
  const bank = read("EnglishVPR-Sheets.gs");
  const start = bank.indexOf("function validateEnglishVprExam_");
  const end = bank.indexOf("\nfunction importEnglishVprBank_", start);
  assert.ok(start >= 0 && end > start);
  const sandbox = {};
  vm.runInNewContext(bank.slice(start, end) + ";this.validateEnglishVprExam_=validateEnglishVprExam_;", sandbox);
  const exam = (track) => ({
    id: "english_vpr_" + track + "_2026", track, maxScore: 40,
    tasks: [
      {type:"choice",points:5,items:Array(5).fill(["q",1])},
      {type:"match",points:5,items:Array(5).fill(["A","text",1])},
      {type:"gap",points:5,answers:Array(5).fill(1)},
      {type:"gap",points:5,answers:Array(5).fill(1)},
      {type:"gap",points:5,answers:Array(5).fill(1)},
      {type:"transform",points:5,items:Array(5).fill(["a","b","c",["answer"]])},
      {type:"questionnaire",points:10,items:Array(10).fill("Question")}
    ]
  });
  assert.equal(sandbox.validateEnglishVprExam_("basic", exam("basic")), true);
  assert.equal(sandbox.validateEnglishVprExam_("technical", exam("technical")), true);
  const seedStart = bank.indexOf("function englishVprSeedExams_");
  const seedEnd = bank.indexOf("\nfunction englishVprBank_", seedStart);
  assert.ok(seedStart >= 0 && seedEnd > seedStart);
  vm.runInNewContext(bank.slice(seedStart, seedEnd) + ";this.englishVprSeedExams_=englishVprSeedExams_;", sandbox);
  const seeds = sandbox.englishVprSeedExams_();
  assert.equal(sandbox.validateEnglishVprExam_("basic", seeds.basic), true);
  assert.equal(sandbox.validateEnglishVprExam_("technical", seeds.technical), true);
  assert.doesNotMatch(read("index.html"), /english-vpr-exams\.js/);
  assert.doesNotMatch(read("service-worker.js"), /english-vpr-exams\.js/);
  const invalid = exam("basic"); invalid.tasks.pop();
  assert.throws(() => sandbox.validateEnglishVprExam_("basic", invalid), /структура экзамена/i);
});


test("English VPR and semester grades cannot be forged through the generic saveResult endpoint", () => {
  const server = read("Code.gs");
  const bank = read("EnglishVPR-Sheets.gs");
  const start = server.indexOf("function saveResult_(data, serverVerifiedEnglishVpr)");
  const end = server.indexOf("function saveTeacherResult_", start + 20);
  assert.ok(start >= 0 && end > start);
  const save = server.slice(start, end);
  assert.ok(save.includes("/^english_vpr_/.test(testId)"));
  assert.ok(save.includes("serverVerifiedEnglishVpr !== true"));
  assert.ok(save.includes("/^english_semester_/.test(testId)"));
  assert.ok(server.includes('case "saveresult": result = saveResult_(data); break;'));
  assert.ok(bank.includes('finishedAt:new Date().toISOString()}, true);'),
    "only the server-verified VPR submission may pass the internal trust flag");
  assert.ok(!bank.includes("data.serverVerifiedEnglishVpr"));
});


test("legacy student payloads cannot restore protected English exam grades", () => {
  const server = read("Code.gs");
  const start = server.indexOf("function isProtectedAssessment_(testId,courseId,bankMap)");
  const end = server.indexOf("function saveStudent_(data)", start + 20);
  assert.ok(start >= 0 && end > start);
  const guard = server.slice(start, end);
  assert.ok(guard.includes("/^english_vpr_/.test(id)"));
  assert.ok(guard.includes("/^english_semester_/.test(id)"));
  const saveStart = server.indexOf("function saveStudent_(data)");
  const saveEnd = server.indexOf("function getStudents_(data)", saveStart + 20);
  const save = server.slice(saveStart, saveEnd);
  assert.ok(save.includes("isProtectedAssessment_(testId"));
  const studentResults = server.slice(server.indexOf("function getMyCourseResults_(data)"));
  assert.ok(studentResults.includes("isProtectedAssessment_(testId,courseId,protectedQuestionBankMap_())"));
});


test("legacy non-English written exam engine is no longer shipped or cached", () => {
  const html = read("index.html");
  const sw = read("service-worker.js");
  assert.doesNotMatch(html, /exam-engine\\.js/);
  assert.doesNotMatch(sw, /exam-engine\\.js/);
  assert.match(sw, /portal-cache-v354/);
  assert.doesNotMatch(read("final.js"), /writtenPrompts|textarea\\[name\\^="written"\\]/);
});


test("attempt-count reads only the compact Results index, not full submissions", () => {
  const server = read("Code.gs");
  assert.match(server, /function resultAttemptRows_\(\)/);
  assert.match(server, /getRange\(2,1,lastRow-1,13\)\.getValues\(\)/);
  const saveStart = server.indexOf("function saveResult_(data, serverVerifiedEnglishVpr)");
  const saveEnd = server.indexOf("function saveTeacherResult_", saveStart + 20);
  const save = server.slice(saveStart, saveEnd);
  assert.ok(save.includes("resultAttemptRows_()"));
  assert.doesNotMatch(save, /sheet\.getDataRange\(\)\.getValues\(\)/);
  const statusStart = server.indexOf("function getTestAttemptStatus_(data)");
  const statusEnd = server.indexOf("function requestTestAttempts_(data)", statusStart + 20);
  assert.ok(server.slice(statusStart, statusEnd).includes("resultAttemptRows_()"));
  const semesterStart = server.indexOf("function submitEnglishSemesterTest_(data)");
  assert.ok(server.slice(semesterStart).includes("resultAttemptRows_()"));
});


test("login session and nested role state persist across a page refresh", () => {
  const api = read("api.js");
  const server = read("Code.gs");
  const app = read("app.js");
  const final = read("portal-final.js");
  assert.ok(api.includes('localStorage.getItem("mdk.session")'));
  assert.ok(api.includes('localStorage.setItem("mdk.session", String(token || ""))'));
  assert.ok(api.includes('sessionStorage.getItem("mdk.session")'));
  assert.ok(api.includes('if(r&&r.success&&r.token)setStoredSessionToken(r.token)'));
  assert.ok(server.includes('PropertiesService.getScriptProperties().setProperty(key, JSON.stringify({'));
  assert.ok(server.includes("function auth_(data)"));
  assert.ok(server.includes("properties.getProperty(key)"));
  assert.ok(app.includes('var savedState = localStorage.getItem("mdk.state")'));
  assert.ok(app.includes("Object.assign(window.state, JSON.parse(savedState))"));
  assert.ok(final.includes('localStorage.setItem("mdk.state", JSON.stringify(st))'));
  assert.ok(final.includes("st.student && window.API && window.API.saveStudent"));
  assert.ok(final.includes("Keep the complete state shape"));
});


test("main games catalogue stays limited to three educational formats", () => {
  const games = read("games.js");
  const start = games.indexOf("var allGames = [");
  const end = games.indexOf("];", start);
  assert.ok(start >= 0 && end > start, "main educational games catalogue must exist");
  const catalogue = games.slice(start, end);
  const ids = Array.from(catalogue.matchAll(/id: "([^"]+)"/g)).map(item => item[1]);
  assert.deepEqual(ids, ["gcode", "party", "detective"]);
  assert.ok(read("teacher-game.js").includes("window.renderOwnGames"));
  assert.ok(read("flashcard-editor.js").includes("window.renderFlashcardEditorPage"));
});


test("custom materials reload for the current student identity after a staff session changes", () => {
  const app = read("app.js");
  const server = read("Code.gs");
  const start = app.indexOf("window.loadGlobalCustomContent = function(callback)");
  const end = app.indexOf("window.savePracAnswer = function(code)", start + 20);
  assert.ok(start >= 0 && end > start);
  const loader = app.slice(start, end);
  assert.ok(loader.includes("requestId === window._customContentLoadRequestId"));
  assert.ok(loader.includes("currentToken === token"));
  assert.ok(loader.includes("String(currentIdentity && currentIdentity.email"));
  assert.ok(loader.includes("String(currentIdentity && currentIdentity.role"));
  assert.ok(loader.includes("if (!isCurrentRequest()) return;"));
  const deliveryStart = server.indexOf("function getCustomContent_(data)");
  const deliveryEnd = server.indexOf("function questionBank_()", deliveryStart + 20);
  const delivery = server.slice(deliveryStart, deliveryEnd);
  assert.ok(delivery.includes('user.role === "student" && !customContentIsOpen_('));
  assert.ok(delivery.includes("hasCourseAccess_(user, courseId)"));
});


test("English VPR enforces the five-word written-answer limit on the server", () => {
  const bank = read("EnglishVPR-Sheets.gs");
  const helperStart = bank.indexOf("function validateEnglishVprWrittenAnswers_");
  const helperEnd = bank.indexOf("\nfunction submitEnglishVprExam_", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart);
  const sandbox = {};
  vm.runInNewContext(
    bank.slice(helperStart, helperEnd) + ";this.validateEnglishVprWrittenAnswers_=validateEnglishVprWrittenAnswers_;",
    sandbox
  );
  const task = {type:"questionnaire",items:["Name","Profession"]};
  const accepted = sandbox.validateEnglishVprWrittenAnswers_(task,{0:"Alex",1:"I want to be a mechanic"},6);
  assert.equal(accepted.length,2);
  assert.equal(accepted[1].answer,"I want to be a mechanic");
  assert.equal(accepted[0].task,6);
  assert.throws(
    () => sandbox.validateEnglishVprWrittenAnswers_(task,{0:"Alex has been studying at college for many years",1:"Mechanic"},6),
    /от 1 до 5 слов/
  );
  assert.throws(
    () => sandbox.validateEnglishVprWrittenAnswers_(task,{0:"",1:"Mechanic"},6),
    /от 1 до 5 слов/
  );
  assert.throws(
    () => sandbox.validateEnglishVprWrittenAnswers_(task,{0:"x".repeat(101),1:"Mechanic"},6),
    /100 символов/
  );
  const submitStart = bank.indexOf("function submitEnglishVprExam_(data)");
  const submitEnd = bank.indexOf("function gradeEnglishVprWrittenPart_(data)", submitStart);
  assert.ok(bank.slice(submitStart, submitEnd).includes("validateEnglishVprWrittenAnswers_(task,ans,ti)"));
});
