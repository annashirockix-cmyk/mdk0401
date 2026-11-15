import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "Code.gs"), "utf8");
const vpr = fs.readFileSync(path.join(root, "EnglishVPR-Sheets.gs"), "utf8");
const setup = fs.readFileSync(path.join(root, "questions-setup.js"), "utf8");

function extract(source, name) {
  const marker = "function " + name + "(";
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, "missing function " + name);
  const open = source.indexOf("{", start);
  let depth = 0, quote = "", escaped = false, line = false, block = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i], n = source[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && n === "/") { block = false; i++; } continue; }
    if (quote) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === quote) quote = ""; continue; }
    if (c === "/" && n === "/") { line = true; i++; continue; }
    if (c === "/" && n === "*") { block = true; i++; continue; }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}

const shuffleServer = new Function(extract(code, "shuffledServer_") + "; return shuffledServer_;")();
const prepareVpr = new Function("shuffledServer_", extract(vpr, "englishVprPrepareAttempt_") + "; return englishVprPrepareAttempt_;")(shuffleServer);
const semesterOrder = new Function(extract(code, "englishSemesterOptionOrder_") + "; return englishSemesterOptionOrder_;")();

test("generic protected question-bank engine shuffles options and keeps a server mapping", () => {
  const safe = new Function("shuffledServer_", extract(code, "safeBuiltInQuestion_") + "; return safeBuiltInQuestion_;")(shuffleServer);
  const entry = {bankId:"bank",questionId:"q1",question:{type:"mc",q:"Question",options:["red","blue","green","black"],correct:2}};
  const maps = {};
  const result = safe(entry,maps);
  const displayed = result.question.options;
  const order = maps["0"];
  assert.equal(displayed.length,4);
  assert.deepEqual([...order].sort(),[0,1,2,3]);
  assert.equal(displayed[order.indexOf(2)],"green");
  assert.equal(Object.hasOwn(result.question,"correct"),false);
});

test("VPR shuffles choice, matching and gap options while remapping protected keys", () => {
  const source = {tasks:[
    {type:"choice",options:["one","two","three","four"],items:[["q",3],["local",2,["x","y","z","w"]]]},
    {type:"match",options:["east","west","north","south"],items:[["A","text",2]]},
    {type:"gap",options:["first","second","third","fourth"],answers:[4]},
    {type:"gap",itemOptions:[["a","b","c","d"]],answers:[2]}
  ]};
  const prepared = prepareVpr(source), display = prepared.exam, maps = prepared.optionMaps;
  const choiceOrder = maps["choice|0|0"];
  assert.equal(display.tasks[0].options[display.tasks[0].items[0][1]-1],"three");
  assert.equal(choiceOrder.indexOf(2)+1,display.tasks[0].items[0][1]);
  const localChoiceOrder = maps["choice|0|1"];
  assert.equal(display.tasks[0].items[1][2][display.tasks[0].items[1][1]-1],"y");
  assert.equal(localChoiceOrder.indexOf(1)+1,display.tasks[0].items[1][1]);
  const matchOrder = maps["match|1"];
  assert.equal(display.tasks[1].options[display.tasks[1].items[0][2]-1],"west");
  assert.equal(matchOrder.indexOf(1)+1,display.tasks[1].items[0][2]);
  const gapOrder = maps["gap|2"];
  assert.equal(display.tasks[2].options[display.tasks[2].answers[0]-1],"fourth");
  assert.equal(gapOrder.indexOf(3)+1,display.tasks[2].answers[0]);
  const itemOrder = maps["gap|3|0"];
  assert.equal(display.tasks[3].itemOptions[0][display.tasks[3].answers[0]-1],"b");
  assert.equal(itemOrder.indexOf(1)+1,display.tasks[3].answers[0]);
  assert.deepEqual(source.tasks[0].options,["one","two","three","four"],"source bank must remain unchanged");
});

test("semester shuffle is stable within one attempt and different across students and attempts", () => {
  const first = semesterOrder("a@example.test","b_sem1",1,0,4);
  assert.deepEqual(first,semesterOrder("a@example.test","b_sem1",1,0,4));
  assert.deepEqual([...first].sort(),[0,1,2,3]);
  assert.notDeepEqual(first,semesterOrder("a@example.test","b_sem1",2,0,4));
  assert.notDeepEqual(first,semesterOrder("b@example.test","b_sem1",1,0,4));
});

test("custom teacher-created tests require server-issued shuffled attempts", () => {
  assert.match(code,/case "getcustomtest": result = getCustomTest_\(data\); break;/);
  assert.match(extract(code,"getCustomTest_"),/customTestAttempt:/);
  assert.match(extract(code,"getCustomTest_"),/optionMaps/);
  assert.match(extract(code,"submitCustomTest_"),/canonicalAnswers/);
  assert.match(extract(code,"submitCustomTest_"),/attempt\.email !== user\.email/);
});

test("built-in and final exams keep answer keys server-side and remap submitted positions", () => {
  assert.match(extract(code,"safeBuiltInQuestion_"),/optionMaps/);
  assert.match(extract(code,"submitBuiltInTest_"),/canonicalAnswers/);
  const builtInSubmit = extract(code,"submitBuiltInTest_");
  assert.match(builtInSubmit,/lockedAttemptRaw=cache\\.get\\("builtInAttempt:"\\+attemptId\\)/);
  assert.match(builtInSubmit,/cache\\.remove\\("builtInAttempt:"\\+attemptId\\)/);
  assert.match(code,/function builtInScoringSnapshot_\\(question\\)/);
  assert.match(code,/builtInScoringSnapshot_\\(entry\\.question\\)/);
  assert.match(code,/\["type","correct","correctAnswer","answers","answer","options","tolerance","tol","correctOrder","items","pairs"\]/);
  assert.match(builtInSubmit,/Array\\.isArray\\(attempt\\.questions\\)\\?attempt\\.questions:\\[\\]/);
  assert.doesNotMatch(builtInSubmit,/const entries=builtInQuestions_\\(courseId,resolvedIds\\)/);
  const customSubmit = extract(code,"submitCustomTest_");
  assert.match(customSubmit,/lockedAttemptRaw = cache\\.get\\("customTestAttempt:" \\+ attemptId\\)/);
  assert.match(customSubmit,/cache\\.remove\\("customTestAttempt:" \\+ attemptId\\)/);
  assert.match(extract(code,"safeFinalExamQuestion_"),/optionMaps/);
  assert.match(extract(code,"submitFinalExam_"),/optionMaps/);
});

test("VPR requires the server-issued attempt token for submission", () => {
  assert.match(extract(vpr,"getEnglishVprExam_"),/englishVprAttempt:/);
  assert.match(extract(vpr,"submitEnglishVprExam_"),/data\.attemptId/);
  assert.match(extract(vpr,"submitEnglishVprExam_"),/attempt\.email !== user\.email/);
  assert.match(fs.readFileSync(path.join(root,"english-vpr-engine.js"),"utf8"),/attemptId:attemptId/);
});

test("local practice question helper reorders options and moves the answer key with them", () => {
  const sandbox = {window:{}};
  new Function("window",setup)(sandbox.window);
  const question = {options:["A","B","C","D"],correct:2};
  const originalCorrect = question.options[question.correct];
  sandbox.window._shuffleQuestionOptions(question);
  assert.deepEqual([...question.options].sort(),["A","B","C","D"]);
  assert.equal(question.options[question.correct],originalCorrect);
});

test("all course practice exam renderers invoke the shared option shuffle", () => {
  for (const file of ["exam_0201.js","exam_0202.js","exam_0401.js","exam_0701.js"]) {
    const source = fs.readFileSync(path.join(root,file),"utf8");
    assert.match(source,/window\._shuffleQuestionOptions\) questions\.forEach\(window\._shuffleQuestionOptions\)/,file+" must shuffle options");
    assert.match(source,/window\._shuffleQuestionOptions\) allQ\.forEach\(window\._shuffleQuestionOptions\)/,file+" standalone exam route must shuffle options");
  }
});


test("all server assessment renderers recursively strip private answer metadata aliases", () => {
  const sanitize = new Function(extract(code, "sanitizeAssessmentQuestionForStudent_") + "; return sanitizeAssessmentQuestionForStudent_;")();
  const input = {q:"Question",options:["A","B"],correctText:"A",answer_key:"A",expected_answer:"A",
    nested:{correctExplanation:"private",answerIndex:0,feedback:"teacher note",prompt:"keep this"}};
  const safe = sanitize(input);
  for (const key of ["correctText","answer_key","expected_answer"]) assert.equal(Object.hasOwn(safe,key),false,key);
  for (const key of ["correctExplanation","answerIndex","feedback"]) assert.equal(Object.hasOwn(safe.nested,key),false,key);
  assert.equal(safe.nested.prompt,"keep this");
  assert.match(extract(code,"safeBuiltInQuestion_"),/sanitizeAssessmentQuestionForStudent_/);
  assert.match(extract(code,"safeFinalExamQuestion_"),/sanitizeAssessmentQuestionForStudent_/);
  assert.match(extract(code,"getCustomTest_"),/sanitizeAssessmentQuestionForStudent_/);
});

test("English exam imports validate bounded durations and stored elapsed time cannot exceed the exam limit", () => {
  const semesterValidator = extract(code, "validateEnglishSemesterTests_");
  assert.match(semesterValidator,/duration < 1 \|\| duration > 180/);
  const semesterSubmit = extract(code, "submitEnglishSemesterTest_");
  assert.match(semesterSubmit,/Math\.min\(Math\.max\(0, Number\(data\.timeSpent\) \|\| 0\), Math\.max\(1, Number\(test\.time\) \|\| 45\) \* 60\)/);
  const vprValidator = extract(vpr, "validateEnglishVprExam_");
  assert.match(vprValidator,/duration < 1 \|\| duration > 180/);
  const vprSubmit = extract(vpr, "submitEnglishVprExam_");
  assert.match(vprSubmit,/Math\.min\(Math\.max\(0,Number\(data\.timeSpent\) \|\| 0\),Math\.max\(1,Number\(exam\.time\) \|\| 90\)\*60\)/);
});

test("VPR and semester student payloads use recursive answer-key sanitization and one-time token consumption", () => {
  const vprSanitizer = extract(vpr, "sanitizeEnglishVprExam_");
  assert.match(vprSanitizer,/sanitizeAssessmentQuestionForStudent_/);
  const vprSubmit = extract(vpr, "submitEnglishVprExam_");
  assert.match(vprSubmit,/attemptLock\.waitLock/);
  assert.match(vprSubmit,/lockedRaw = cache\.get\("englishVprAttempt:" \+ attemptId\)/);
  assert.match(vprSubmit,/cache\.remove\("englishVprAttempt:" \+ attemptId\)/);
  const semesterSanitizer = extract(code, "sanitizeEnglishSemesterTests_");
  assert.match(semesterSanitizer,/sanitizeAssessmentQuestionForStudent_\(test\)/);
  assert.match(semesterSanitizer,/sanitizeAssessmentQuestionForStudent_\(question\)/);
  const semesterSubmit = extract(code, "submitEnglishSemesterTest_");
  assert.match(semesterSubmit,/lock\.waitLock/);
  assert.match(semesterSubmit,/appendMappedRecord_/);
});

test("student-facing assessment sanitizers strip alternate answer-key field names", () => {
  const safeBuiltIn = new Function("shuffledServer_", extract(code, "safeBuiltInQuestion_") + "; return safeBuiltInQuestion_;")(shuffleServer);
  const privateFields = {
    type:"mc",q:"Question",options:["a","b","c","d"],correct:1,correctIndex:1,
    correctOption:"b",answerIndex:1,expectedAnswer:"b",acceptedAnswers:["b"],
    correctOrder:["a"],rationale:"teacher note",isCorrect:true
  };
  const output = safeBuiltIn({bankId:"bank",questionId:"q2",question:privateFields},{});
  for (const key of ["correct","correctIndex","correctOption","answerIndex","expectedAnswer","acceptedAnswers","correctOrder","rationale","isCorrect"]) {
    assert.equal(Object.hasOwn(output.question,key),false,key+" must not reach the browser");
  }
  assert.match(extract(code,"getCustomContent_"),/stripTestKeys_/);
  assert.match(extract(vpr,"sanitizeEnglishVprExam_"),/correctIndex\|correctOption/);
});


test("generic result endpoint cannot accept browser-forged assessment grades", () => {
  const save = extract(code,"saveResult_");
  assert.match(save,/Assessment namespaces are never accepted through the generic browser/);
  assert.match(save,/\^test_\/\.test\(testId\)/);
  assert.match(save,/\^__final__\/\.test\(testId\)/);
  assert.match(save,/\^english_\/\.test\(testId\)/);
  assert.match(save,/Встроенные тесты должны отправляться через защищённую серверную проверку/);
  assert.match(save,/Итоговый экзамен должен отправляться через защищённую серверную проверку/);
  assert.match(save,/Контрольные работы английского принимаются только через защищённую серверную проверку/);
  assert.match(save,/\^self_.+_\\d\+\$/);
  assert.match(save,/Самостоятельные тесты должны отправляться через защищённую серверную проверку/);
  assert.match(save,/written_self_/);
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const written = app.match(/window\.saveSelfAnswer\s*=\s*function\(code\)\s*\{[\s\S]*?\n\};/);
  assert.ok(written, "saveSelfAnswer handler must exist");
  assert.match(written[0],/testId: `written_self_\$\{code\}`/);
  assert.match(save,/written_self_/);
  assert.match(save,/Письменная работа принимается без оценки/);
  assert.match(save,/Результат студента должен отправляться через защищённый маршрут проверки/);
  assert.match(save,/serverVerifiedEnglishVpr !== true/);
  assert.match(code,/function isTrustedLegacyGrade_\\(record\\) \\{\\s*return false;/);
  assert.match(code,/safeStudentProgressResults_\\(savedPayload\\.results\\)/);
  assert.match(code,/record\\.grade != null \\|\\| record\\.score != null \\|\\| record\\.percent != null/);
  assert.match(app,/Grades are displayed only from server-authoritative result records/);
  assert.doesNotMatch(app,/localStorage\\.getItem\\('portal_grades'\\)/);
  const gradeWritten = extract(code,"gradeWrittenResult_");
  assert.match(gradeWritten,/\^\(prac_\|self_\|written_self_\)/);
  assert.match(gradeWritten,/Проверять письменные работы может только преподаватель/);
  const journal = fs.readFileSync(path.join(root, "journal.js"), "utf8");
  assert.match(journal,/API\.gradeWrittenResult/);
  assert.match(journal,/written_self_/);
  assert.match(journal,/Письменная работа проверена/);

});


test("English semester submissions require a server-issued timed attempt", () => {
  assert.match(extract(code, "englishSemesterAttemptCacheKey_"), /SHA_256/);
  const get = extract(code, "getEnglishSemesterTests_");
  assert.doesNotMatch(get, /startedAt:Date\.now\(\)/);
  const start = extract(code, "startEnglishSemesterTest_");
  assert.match(start, /englishSemesterAttemptCacheKey_/);
  assert.match(start, /startedAt:Date\.now\(\)/);
  assert.match(start, /data\.attemptNo/);
  const submit = extract(code, "submitEnglishSemesterTest_");
  assert.match(submit, /data\.attemptId/);
  assert.match(submit, /serverAttempt\.attemptId !== attemptId/);
  assert.match(submit, /elapsedSeconds > allowedSeconds \+ 300/);
  assert.match(submit, /TimeSpent:Math\.min\(elapsedSeconds, allowedSeconds\)/);
  assert.match(submit, /attemptCache\.remove\(attemptKey\)/);
  const client = fs.readFileSync(path.join(root, "english-vpr-engine.js"), "utf8");
  assert.match(client, /API\.startEnglishSemesterTest/);
  assert.match(client, /attemptNo:test\.attemptNo,attemptId:attemptId/);
  assert.match(fs.readFileSync(path.join(root, "api.js"), "utf8"), /startEnglishSemesterTest:function/);
});

test("English VPR duration is measured from the server attempt start", () => {
  const prepare = extract(vpr, "startEnglishVprExam_");
  assert.match(prepare, /startedAt:Date\.now\(\)/);
  const submit = extract(vpr, "submitEnglishVprExam_");
  assert.match(submit, /const startedAt = Number\(attempt\.startedAt\)/);
  assert.match(submit, /Date\.now\(\) - startedAt/);
  assert.match(submit, /timeSpent:Math\.min\(Math\.max\(0,Math\.floor\(\(Date\.now\(\)-startedAt\)\/1000\)\)/);
});


test("English VPR server timer starts only when the student launches the exam", () => {
  const get = extract(vpr, "getEnglishVprExam_");
  assert.doesNotMatch(get, /englishVprAttempt:/);
  const start = extract(vpr, "startEnglishVprExam_");
  assert.match(start, /startedAt:Date\.now\(\)/);
  assert.match(start, /englishVprPrepareAttempt_\(source\)/);
  assert.match(code, /case "startenglishvprexam": result = startEnglishVprExam_\(data\); break;/);
  const client = fs.readFileSync(path.join(root, "english-vpr-engine.js"), "utf8");
  assert.match(client, /API\.startEnglishVprExam\(track\)/);
  assert.match(client, /startExam\(started\.exam, key, panel, courseId, track, started\.attemptId\)/);
  assert.match(fs.readFileSync(path.join(root, "api.js"), "utf8"), /startEnglishVprExam:function/);
});


test("reopening an active English assessment preserves the original server start time", () => {
  const vprStart = extract(vpr, "startEnglishVprExam_");
  assert.match(vprStart, /englishVprAttemptCacheKey_/);
  assert.match(vprStart, /activeAttempt\.startedAt/);
  assert.match(vprStart, /activeAttempt\.displayExam/);
  const vprSubmit = extract(vpr, "submitEnglishVprExam_");
  assert.match(vprSubmit, /lockedAttempt\.stableKey/);
  const semesterStart = extract(code, "startEnglishSemesterTest_");
  assert.match(semesterStart, /attemptCacheKey|englishSemesterAttemptCacheKey_/);
  const client = fs.readFileSync(path.join(root, "english-vpr-engine.js"), "utf8");
  assert.match(client, /durationSeconds - Math\.floor\(Math\.max\(0, Date\.now\(\) - Number\(startedAt\)\) \/ 1000\)/);
  assert.match(client, /duration-Math\.floor\(Math\.max\(0,Date\.now\(\)-Number\(startedAt\)\)\/1000\)/);
});


test("English VPR start is serialized and enforces the server attempt limit", () => {
  const start = extract(vpr, "startEnglishVprExam_");
  assert.match(start, /LockService\.getScriptLock\(\)/);
  assert.match(start, /lock\.waitLock\(10000\)/);
  assert.match(start, /resultAttemptRows_\(\)/);
  assert.match(start, /settingValue_\("testAttempts:"/);
  assert.match(start, /prior >= limit/);
  assert.match(start, /finally\s*\{\s*lock\.releaseLock\(\)/);
});
