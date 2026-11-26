import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
test("custom lecture and test content has one student rendering path", () => {
 const app = read("app.js");
 const editor = read("course-admin.js");
 const html = read("index.html");
 const sw = read("service-worker.js"); const css = read("style.css"); const enrichment = read("lecture-enrichment.js");
 assert.ok(html.includes("course-admin.js?v=31"));
 assert.ok(app.includes("customTopicLectures"));
 assert.ok(app.includes("customTopicTests"));
 assert.ok(app.includes("window.startCustomInlineTest"));
 assert.ok(!editor.includes("window.renderTopicPage=function"));
 assert.ok(!editor.includes("function customRecords("));
 assert.ok(editor.includes("type:\"lecture\""));
 assert.ok(editor.includes("type:\"test\""));
 assert.match(sw, /portal-cache-v[0-9]+/); assert.ok(css.includes(".lec-content img"));
 assert.ok(enrichment.includes('["07.01","SPRUT_TP","basic","technical","EN","ENB","ENT"].indexOf(id)>=0'));
});
test("custom lecture sanitizer preserves safe images and figure captions", () => {
 const app = read("app.js");
 assert.ok(app.includes("\"FIGURE\",\"FIGCAPTION\",\"IMG\""));
 assert.ok(app.includes("node.tagName === \"IMG\" && name === \"src\""));
 assert.ok(app.includes("png|jpeg|gif|webp"));
 assert.ok(app.includes("\"alt\", \"width\", \"height\", \"loading\""));
});
test("real-browser constructor audit exercises student numeric, true-false and short-text questions", () => {
 const audit = read("scripts/course-constructor-browser-audit.mjs");
 assert.ok(audit.includes('type: "numeric"'));
 assert.ok(audit.includes('type: "true_false"'));
 assert.ok(audit.includes('type: "short_text"'));
 assert.ok(audit.includes("#customShortTextAnswer"));
 assert.ok(audit.includes("#customShortTextSubmit"));
 assert.ok(audit.includes("#customNumericAnswer"));
 assert.ok(audit.includes("#customNumericSubmit"));
 assert.ok(audit.includes('button[data-custom-answer="0"]'));
 assert.ok(audit.includes('button[data-custom-answer="1"]'));
 assert.ok(audit.includes('["12.5", 0, "Ньютон"]'));
});

test("lecture editor includes in-text find and replace controls", () => {
 const ux = read("course-editor-ux.js");
 assert.ok(ux.includes("ceFindText"));
 assert.ok(ux.includes("ceReplaceText"));
 assert.ok(ux.includes("ceFindNext"));
 assert.ok(ux.includes("ceReplaceAll"));
 assert.ok(ux.includes("Найти далее"));
 assert.ok(ux.includes("Заменить все"));
});

test("short text questions are rendered and scored on the server", () => {
 const app = read("app.js");
 const server = read("Code.gs");
 const ux = read("course-editor-ux.js");
 const editor = read("course-admin.js");
 assert.ok(ux.includes('<option value="short_text">Краткий текстовый ответ</option>'));
 assert.ok(editor.includes('shortText?String(meta.textAnswer||""):'));
 assert.ok(app.includes('questionType === "short_text"'));
 assert.ok(server.includes('type === "text" || type === "short_text"'));
 assert.ok(server.includes('toLocaleLowerCase("ru")'));
 assert.ok(server.includes("const textExpected=q.correctAnswer!==undefined?q.correctAnswer"));
 assert.ok(server.includes("normalize(answer)===normalize(textExpected)"));
});

test("protected exam banks use a visual question editor instead of a JSON textarea", () => {
 const editor=read("course-admin.js");
 assert.ok(editor.includes('id="visualExamBankEditor"'));
 assert.ok(editor.includes('id="examBankQuestionList"'));
 assert.ok(editor.includes('id="examQuestionText"'));
 assert.ok(editor.includes('id="examQuestionType"'));
 assert.ok(editor.includes('id="addExamQuestionBtn"'));
 assert.ok(editor.includes('id="saveExamQuestionBtn"'));
 assert.ok(editor.includes('id="previewExamQuestionBtn"'));
 assert.ok(editor.includes("function previewExamQuestion()"));
 assert.ok(editor.includes("Предпросмотр не показывает правильные ответы"));
 assert.ok(editor.includes("function collectExamQuestion()"));
 assert.ok(editor.includes("q.correctAnswers=indexes"));
 assert.ok(editor.includes("q.correctOrder=extra.slice()"));
 assert.ok(editor.includes("q.pairs=pairs"));
 assert.ok(editor.includes("window.API.saveQuestionBank(courseSel.value,examBankSel.value,examBankRows)"));
 assert.ok(editor.includes("q.correctAnswers=indexes"));
 assert.ok(editor.includes("q.correctOrder=extra.slice()"));
 assert.ok(editor.includes("q.pairs=pairs"));
 assert.ok(editor.includes('<option value="short_text">Краткий текстовый ответ</option>'));
 assert.ok(editor.includes('q.correctAnswer=raw;'));
 const server=read("Code.gs"),app=read("app.js");
 assert.ok(server.includes('"text","short_text"'));
 assert.ok(server.includes('В текстовом задании №'));
 assert.ok(app.includes('id="secureTextAnswer"'));
 assert.ok(app.includes('type==="text"||type==="short_text"'));
 assert.ok(server.includes('["type","correct","correctAnswers","correctAnswer","answers","answer","options","tolerance","tol","correctOrder","items","pairs"]'));
 assert.ok(!editor.includes('id="examBankJson"'));
});

test("short text scoring uses the explicit answer key and normalizes case and whitespace", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function scoreBuiltInQuestion_(q,answer) {");
 const end = server.indexOf("\nfunction ", start + 10);
 assert.ok(start >= 0 && end > start, "Server scoring function must be present");
 const source = server.slice(start, end);
 const score = vm.runInNewContext(source + "\nscoreBuiltInQuestion_", {
  sameAnswer_: (left, right) => JSON.stringify(left) === JSON.stringify(right)
 });
 const question = { type: "short_text", correct: 0, correctAnswers: [], correctAnswer: "Ньютон" };
 assert.equal(score(question, "  НЬЮТОН  "), true);
 assert.equal(score(question, "Джоуль"), false);
});

test("flashcard constructor saves and reopens saved sets", () => {
 const workflow = read(".github/workflows/portal-syntax.yml");
 const audit = read("scripts/course-constructor-browser-audit.mjs");
 assert.ok(workflow.includes("Run real-browser course constructor round-trip audit"));
 assert.ok(audit.includes("Содержимое тестовой лекции"));
 assert.ok(audit.includes("Карточки конструктора"));
 const cards = read("flashcard-editor.js");
 assert.ok(cards.includes("type:\"flashcards\""));
 assert.ok(cards.includes("function renderSaved("));
 assert.ok(cards.includes("function loadSet("));
});

test("global custom-content loads ignore stale responses after account changes", () => {
 const app = read("app.js");
 assert.ok(app.includes("window.invalidateGlobalCustomContentLoad = function(clearContent)"));
 assert.ok(app.includes("requestId === window._customContentLoadRequestId"));
 assert.ok(app.includes("currentToken === token"));
 assert.ok(app.includes("currentIdentity.email"));
 assert.ok(app.includes("window.invalidateGlobalCustomContentLoad(true)"));
});

test("custom content upserts serialize duplicate-ID checks and writes", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function saveCustomContent_(data)");
 const end = server.indexOf("\nfunction deleteCustomContent_(data)", start);
 assert.ok(start >= 0 && end > start);
 const save = server.slice(start, end);
 const lock = save.indexOf("LockService.getScriptLock()");
 const wait = save.indexOf("lock.waitLock(10000)");
 const authorization = save.indexOf("editor_(data, courseId)");
 const readIndex = save.indexOf("sheet.getDataRange().getValues()");
 const write = Math.max(save.indexOf("sheet.getRange(targetRow"), save.indexOf("sheet.appendRow(row)"));
 const release = save.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock, "acquire a script-wide lock before reading");
 assert.ok(authorization > wait && readIndex > authorization, "re-check current editor permissions inside the lock before reading or writing");
 assert.ok(write > readIndex, "keep duplicate lookup and write inside the lock");
 assert.ok(release > write && save.includes("finally {"), "release the lock even when a save fails");
});

test("custom content deletion shares the upsert lock", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function deleteCustomContent_(data)");
 const end = server.indexOf("\n/* ---------- Administrator", start);
 assert.ok(start >= 0 && end > start);
 const remove = server.slice(start, end);
 const lock = remove.indexOf("LockService.getScriptLock()");
 const wait = remove.indexOf("lock.waitLock(10000)");
 const readIndex = remove.indexOf("sheet.getDataRange().getValues()");
 const deletion = remove.indexOf("sheet.deleteRow(");
 const release = remove.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock && readIndex > wait && deletion > readIndex);
 assert.ok(release > deletion && remove.includes("finally {"), "delete must release the shared lock");
});

test("custom test attempts are counted within the selected course", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function submitCustomTest_(data)");
 const end = server.indexOf("\nfunction getGameAnswer_", start);
 assert.ok(start >= 0 && end > start);
 const submit = server.slice(start, end);
 const getStart = server.indexOf("function getCustomTest_(data)");
 const getEnd = server.indexOf("\nfunction submitCustomTest_", getStart);
 const get = server.slice(getStart, getEnd);
 assert.match(get, /email_\(row\[0\]\) === user\.email && String\(row\[3\]\) === attemptKey && sameCourseId_\(row\[12\] \|\| courseId, courseId\)/,
  "test launch attempt history must be scoped by student, test ID, and course ID");
 assert.match(submit, /email_\(row\[0\]\) === user\.email && String\(row\[3\]\) === attemptKey && sameCourseId_\(row\[12\] \|\| courseId, courseId\)/,
  "submission attempt history must be scoped by student, test ID, and course ID");
 const statusStart = server.indexOf("function getTestAttemptStatus_(data)");
 const statusEnd = server.indexOf("\nfunction requestTestAttempts_", statusStart);
 const status = server.slice(statusStart, statusEnd);
 assert.match(status, /sameCourseId_\(r\[12\]\|\|courseId,courseId\)/,
  "the displayed attempt status and submission check must use the same course scope");
});


test("custom test submissions resolve the test within the active course", () => {
 const server = read("Code.gs");
 const api = read("api.js");
 const app = read("app.js");
 const start = server.indexOf("function submitCustomTest_(data)");
 const end = server.indexOf("\nfunction getGameAnswer_", start);
 const getStart = server.indexOf("function getCustomTest_(data)");
 const getEnd = server.indexOf("\nfunction submitCustomTest_", getStart);
 const get = server.slice(getStart, getEnd);
 assert.match(get, /normalizeCourseId_\(data\.courseId \|\| data\.mdkId \|\| ""\)/);
 assert.match(get, /String\(row\[0\]\) === id && String\(row\[3\]\) === "test" && sameCourseId_\(row\[1\], courseId\)/);
 assert.match(api, /getCustomTest:function\(testId,courseId\)/);
 assert.match(api, /submitCustomTest:function\(data\)/);
 assert.match(app, /getCustomTest\(testId, courseId\)/);
 assert.match(app, /submitCustomTest\(\{[\s\S]*?attemptId: attempt\.attemptId/);
 assert.match(app, /submitCustomTest\(\{[\s\S]*?attemptId: attempt\.attemptId/);
});

test("custom content deletion is scoped to the requested course", () => {
 const server = read("Code.gs");
 const api = read("api.js");
 const editor = read("course-admin.js");
 const start = server.indexOf("function deleteCustomContent_(data)");
 const end = server.indexOf("\n/* ---------- Administrator", start);
 assert.ok(start >= 0 && end > start);
 const remove = server.slice(start, end);
 assert.match(remove, /courseId = String\(data\.courseId \|\| data\.mdkId \|\| ""\)/);
 assert.match(remove, /editor_\(data, courseId\)/);
 assert.match(remove, /String\(values\[i\]\[0\]\) === id && sameCourseId_\(values\[i\]\[1\], courseId\)/);
 assert.match(api, /deleteCustomContent:function\(id,courseId\)/);
 assert.equal((editor.match(/deleteCustomContent\(id,courseSel\.value\)/g) || []).length, 2);
});

test("settings upserts serialize lookup and writes", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function writeSetting_(key,value,actorEmail,lockAlreadyHeld)");
 const end = server.indexOf("\nfunction getTopicAccess_", start);
 assert.ok(start >= 0 && end > start);
 const write = server.slice(start, end);
 const lock = write.indexOf("LockService.getScriptLock()");
 const wait = write.indexOf("lock.waitLock(10000)");
 const lookup = write.indexOf("sh.getDataRange().getValues()");
 const update = Math.max(write.indexOf("sh.getRange(row"), write.indexOf("sh.appendRow(record)"));
 const release = write.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock && lookup > wait && update > lookup);
 assert.ok(release > update && write.includes("finally {"));
 const grantStart = server.indexOf("function grantTestAttempts_(data)");
 const grantEnd = server.indexOf("\n/* ---------- Teacher-created", grantStart);
 const grant = server.slice(grantStart, grantEnd);
 assert.match(grant, /lock\.waitLock\(10000\)/);
 assert.match(grant, /writeSetting_\("testAttempts:"\+studentEmail\+":"\+courseId\+":"\+testId,String\(extra\),teacher\.email,true\)/,
  "attempt grants must reuse the existing lock instead of acquiring it recursively");
 assert.ok(grant.indexOf("lock.waitLock(10000)") < grant.indexOf("teacher=editor_(data,courseId)"));
 assert.ok(grant.indexOf("lock.waitLock(10000)") < grant.indexOf("student=userByEmail_(studentEmail)"),
  "teacher permission and student enrollment must be rechecked inside the lock");
});


test("student custom-content delivery enforces publication switches and strips answer keys", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function getCustomContent_(data)");
 const end = server.indexOf("/* ---------- Private built-in question bank", start);
 assert.ok(start >= 0 && end > start);
 const delivery = server.slice(start, end);
 assert.match(delivery, /const user = auth_\(data\)/);
 assert.match(delivery, /user\.role !== "admin" && !hasCourseAccess_\(user, courseId\)/);
 assert.match(delivery, /user\.role === "student" && !customContentIsOpen_\(/);
 assert.match(delivery, /correct\|answer\|expected\|accepted\|solution\|explanation\|rationale\|grading\|rubric\|key\|iscorrect\|feedback/);
 assert.match(delivery, /imageRef/);
 assert.match(delivery, /return \{ success: true, data: list \}/);
});

test("custom test grading reads the protected answer key from Sheets, not the browser payload", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function submitCustomTest_(data)");
 const end = server.indexOf("\nfunction getGameAnswer_", start);
 assert.ok(start >= 0 && end > start);
 const submit = server.slice(start, end);
 const launchStart = server.indexOf("function getCustomTest_(data)");
 const launchEnd = server.indexOf("\nfunction submitCustomTest_", launchStart);
 const launch = server.slice(launchStart, launchEnd);
 assert.match(launch, /content_\(\)\.getDataRange\(\)\.getValues\(\)/);
 assert.match(launch, /payload:JSON\.parse\(row\[5\]\|\|"\{\}"\)/);
 assert.match(launch, /const questions = Array\.isArray\(record\.payload\.questions\)/);
 assert.match(launch, /questions:questions,optionMaps:optionMaps/);
 assert.match(launch, /customContentIsOpen_\(record\.courseId, record\.id, record\.topicId, "test"\)/);
 assert.match(submit, /raw = cache\.get\("customTestAttempt:" \+ attemptId\)/);
 assert.match(submit, /scoreBuiltInQuestion_\(question \|\| \{\}, canonicalAnswers\[index\]\)/);
 assert.doesNotMatch(submit, /data\.questions/);
 assert.match(submit, /LockService\.getScriptLock\(\)/);

});

test("teacher publication controls call server-backed topic and material access APIs", () => {
 const controls = read("teacher-controls.js");
 const api = read("api.js");
 const server = read("Code.gs");
 assert.match(controls, /API\.setTopicAccess\(cid,btn\.dataset\.topic,open\)/);
 assert.ok(controls.includes("t.mdkId===cid&&!t.sourceTopicId"));
 assert.match(controls, /API\.setCustomContentAccess\(cid,id,open\)/);
 assert.match(api, /setCustomContentAccess:function\(courseId,id,open\)/);
 assert.match(api, /setTopicAccess:function\(courseId,topicId,open\)/);
 assert.match(server, /function setCustomContentAccess_\(data\)/);
 assert.match(server, /function setTopicAccess_\(data\)/);
 assert.match(server, /function customContentIsOpen_\(courseId, contentId, topicId, contentType\)/);
});


test("teachers can revise built-in topics, lectures and protected exam banks with backups", () => {
 const server = read("Code.gs");
 const api = read("api.js");
 const editor = read("course-admin.js");
 const app = read("app.js");
 assert.match(server, /case "savequestionbank": result = saveQuestionBank_\(data\)/);
 assert.match(server, /function saveQuestionBank_\(data\)/);
 assert.match(server, /editor_\(data,courseId\)/);
 assert.match(server, /\["exam_primary","exam_extra","mdk_extra"\]/);
 assert.match(server, /QuestionBankBackup/);
 assert.match(server, /previousQuestionsBackedUp/);
 assert.match(server, /Неподдерживаемый тип задания/);
 assert.match(server, /В числовом задании/);
 assert.match(server, /правильный ответ/);
 assert.match(server, /protectedQuestionBankMap:v1/);
 assert.match(api, /saveQuestionBank:function\(courseId,bankId,questions\)/);
 assert.match(editor, /sourceTopicId:topic\.id/);
 assert.match(editor, /isBuiltInOverride=true/);
 assert.match(editor, /sourceLectureCode=base\.code/);
 assert.match(editor, /saveQuestionBank\(courseSel\.value,examBankSel\.value,examBankRows\)/);
 assert.match(app, /sourceTopicId/);
 assert.match(app, /isBuiltInOverride===true/);
});

test("teacher-created test questions support private image uploads and student display", () => {
 const server = read("Code.gs");
 const api = read("api.js");
 const editor = read("course-admin.js");
 const ux = read("course-editor-ux.js");
 const app = read("app.js");
 assert.match(server, /case "uploadtestimage": result = uploadTestImage_\(data\)/);
 assert.match(server, /function uploadTestImage_\(data\)/);
 assert.match(server, /editor_\(data, courseId\)/);
 assert.match(server, /TEST_QUESTION_IMAGE_FOLDER_ID/);
 assert.match(server, /folder\.createFile\(blob\)/);
 assert.match(server, /function hydrateTestQuestionImages_\(questions\)/);
 assert.match(server, /const displayQuestions = hydrateTestQuestionImages_\(questions\)/);
 assert.match(server, /questions:questions,optionMaps:optionMaps/,
  "only compact image references, not base64 image bytes, are stored in the attempt cache");
 assert.match(api, /uploadTestImage:function\(courseId,dataUrl,name\)/);
 assert.match(editor, /id="ceQuestionImagePanel"/);
 assert.match(editor, /imageRef:q\.imageRef\|\|""/);
 assert.match(ux, /id="ceQuestionImageFile"/);
 assert.match(ux, /window\.API\.uploadTestImage\(course,dataUrl/);
 assert.match(app, /q\.imageData && \/\^data:image/);
});


test("custom test editor preserves per-question metadata and test settings while editing", () => {
 const editor = read("course-admin.js");
 const ux = read("course-editor-ux.js");
 assert.match(editor, /window\.__ceEditingQuestionIndex=i/);
 assert.match(editor, /kind:q\.kind\|\|"single"/);
 assert.match(editor, /variantCount:\$\("ceVariantCount"\)/);
 assert.match(editor, /questionOrder:\$\("ceShuffleQuestions"\)/);
 assert.match(editor, /optionOrder:\$\("ceShuffleOptions"\)/);
 assert.match(ux, /const editing=Number\.isInteger\(window\.__ceEditingQuestionIndex\)/);
 assert.match(ux, /editing>=0\?editing:drafts\.querySelectorAll\('\.edit-q'\)\.length/);
});


test("custom multi-select questions render safely and are scored server-side", () => {
 const app = read("app.js");
 const server = read("Code.gs");
 const editorUx = read("course-editor-ux.js");
 assert.ok(app.includes('questionType === "multi"'));
 assert.ok(app.includes("customMultiSubmit"));
 assert.ok(app.includes('querySelectorAll("[data-custom-answer]:checked")'));
 assert.ok(server.includes("if (Array.isArray(value))"));
 assert.ok(server.includes("mapped.sort(function(a,b)"));
 assert.ok(server.includes("Array.isArray(q.correctAnswers)"));
 assert.ok(server.includes('const privateKey = /^(?:correct|answer|expected|accepted|solution|explanation|rationale|grading|rubric|key|iscorrect|feedback)/i'));
 assert.ok(server.includes('const type=String(q.type||q.kind||"mc").toLowerCase()'));
 assert.ok(editorUx.includes("Студент отметит все подходящие варианты"));
 assert.ok(editorUx.includes("проверка выполняется на сервере"));
});

test("custom matching questions hide right-side keys and score shuffled selections", () => {
 const app = read("app.js");
 const server = read("Code.gs");
 const editor = read("course-admin.js");
 const ux = read("course-editor-ux.js");
 assert.ok(app.includes('questionType === "matching"'));
 assert.ok(app.includes("customMatchSubmit"));
 assert.ok(app.includes("Каждую правую часть можно использовать только один раз"));
 assert.ok(editor.includes("pairs:matching?pairs:[]"));
 assert.ok(editor.includes("pair.left)+' → '+esc(pair.right)"));
 assert.ok(ux.includes("Введите пары построчно"));
 assert.ok(server.includes('type === "matching" || type === "match"'));
 assert.ok(server.includes("safe.pairs = pairs.map(function(pair){return {left:String(pair.left || \"\")};})"));
 assert.ok(server.includes("originalOptions[originalIndex]"));
 assert.ok(server.includes('String(answer[index])===String(pair.right)'));
});
test("custom ordering questions shuffle items and preserve student drag order for server scoring", () => {
 const app = read("app.js");
 const server = read("Code.gs");
 const editor = read("course-admin.js");
 const ux = read("course-editor-ux.js");
 assert.ok(app.includes('questionType === "order" || questionType === "ordering"'));
 assert.ok(app.includes("customOrderList"));
 assert.ok(app.includes("data-order-up"));
 assert.ok(editor.includes("correctOrder:ordering?items.slice():[]"));
 assert.ok(editor.includes("items:Array.isArray(q.items)?q.items.map(String):[]"));
 assert.ok(editor.includes("items:Array.isArray(q.items)?q.items.slice():[]"));
 assert.ok(editor.includes("ordering?'<ol>'"));
 assert.ok(ux.includes("Введите элементы в правильном порядке"));
 assert.ok(server.includes("safe.items = order.map(function(i) { return items[i]; })"));
 assert.ok(server.includes('type === "order" || type === "ordering"'));
 assert.ok(server.includes("return mapped.map(function(originalIndex){return originalItems[originalIndex] || \"\";});"));
});
test("custom numeric questions accept decimal input, validate tolerance and score on the server", () => {
 const app=read("app.js"),server=read("Code.gs"),editor=read("course-admin.js"),ux=read("course-editor-ux.js");
 assert.ok(app.includes('questionType === "numeric" || questionType === "num" || questionType === "number"'));
 assert.ok(app.includes('type="text" inputmode="decimal"'));
 assert.ok(editor.includes("numericAnswer=meta.numericAnswer"));
 assert.ok(editor.includes('correctAnswer:numeric?String(numericAnswer):shortText?String(meta.textAnswer||""):""'));
 assert.ok(editor.includes("tolerance:q.tolerance"));
 assert.ok(ux.includes('id="ceTolerance"'));
 assert.ok(ux.includes("Введите правильное число"));
 assert.ok(server.includes('type === "numeric" || type === "num" || type === "number"'));
 assert.ok(server.includes("return String(value == null ? \"\" : value).trim();"));
 assert.ok(server.includes("Math.abs(actual-target)<=tolerance"));
 assert.ok(server.includes("!Number.isFinite(tolerance)||tolerance<0"));
 assert.ok(server.includes("expected=q.correctAnswer!==undefined?q.correctAnswer"));
 assert.ok(server.includes("delete safe.extra; delete safe.tolerance;"));
 assert.ok(server.includes("actualText=String(answer==null?\"\":answer).trim().replace(\",\", \".\")"));
});

test("custom true/false questions use fixed labels and retain server-side answer isolation", () => {
 const app=read("app.js"),server=read("Code.gs"),editor=read("course-admin.js"),ux=read("course-editor-ux.js");
 assert.ok(ux.includes("trueFalse=kind==='true_false'||kind==='tf'"));
 assert.ok(ux.includes('<option value="0">Верно</option><option value="1">Неверно</option>'));
 assert.ok(ux.includes("correct:Number($('qCorrect').value)"));
 assert.ok(editor.includes('trueFalse?["Верно","Неверно"]'));
 assert.ok(editor.includes('kind==="true_false"||kind==="tf"'));
 assert.ok(app.includes("var questionType = String(q.type || q.kind || \"single\").toLowerCase()"));
 assert.ok(server.includes('if(type==="tf"||type==="true_false")'));
 assert.ok(server.includes("return Number(answer)===target;"));
 assert.ok(server.includes("optionMaps[String(entry.questionIndex)]=order;"));
});
