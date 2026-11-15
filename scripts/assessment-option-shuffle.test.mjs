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
const sanitizeQuestion = new Function(extract(code, "sanitizeAssessmentQuestionForStudent_") + "; return sanitizeAssessmentQuestionForStudent_;")();
const prepareVpr = new Function("shuffledServer_", extract(vpr, "englishVprPrepareAttempt_") + "; return englishVprPrepareAttempt_;")(shuffleServer);
const semesterOrder = new Function(extract(code, "englishSemesterOptionOrder_") + "; return englishSemesterOptionOrder_;")();

const scoreBuiltIn = new Function("sameAnswer_", extract(code, "scoreBuiltInQuestion_") + "; return scoreBuiltInQuestion_;")(
  new Function(extract(code, "sameAnswer_") + "; return sameAnswer_;")()
);

test("server scorer handles multi-select, numeric, order, matching and true-false answers", () => {
  assert.equal(scoreBuiltIn({type:"multi",options:["A","B","C","D"],correct:[0,2]},[2,0]),true);
  assert.equal(scoreBuiltIn({type:"multi",options:["A","B","C","D"],correct:[0,2]},[0]),false);
  assert.equal(scoreBuiltIn({type:"numeric",answer:"12,5",tolerance:0.01},"12.504"),true);
  assert.equal(scoreBuiltIn({type:"numeric",answer:12.5,tolerance:0.01},"12.7"),false);
  assert.equal(scoreBuiltIn({type:"order",items:["cut","drill","finish"],correctOrder:["cut","drill","finish"]},["cut","drill","finish"]),true);
  assert.equal(scoreBuiltIn({type:"order",items:["cut","drill","finish"],correctOrder:["cut","drill","finish"]},["drill","cut","finish"]),false);
  assert.equal(scoreBuiltIn({type:"match",pairs:[{left:"A",right:"east"},{left:"B",right:"west"}]},["east","west"]),true);
  assert.equal(scoreBuiltIn({type:"match",pairs:[{left:"A",right:"east"},{left:"B",right:"west"}]},["west","east"]),false);
  assert.equal(scoreBuiltIn({type:"tf",correct:true,options:["Верно","Неверно"]},0),true);
  assert.equal(scoreBuiltIn({type:"tf",correct:false,options:["Верно","Неверно"]},0),false);
});

test("custom test scoring accepts both numeric keys and legacy option-text keys", () => {
  assert.match(extract(code,"submitCustomTest_"),/scoreBuiltInQuestion_\(question \|\| \{\}, canonicalAnswers\[index\]\)/);
  const question = {type:"mc",options:["North","South","East","West"],correct:"East"};
  const order = [2,0,3,1];
  const displayed = order.map(index => question.options[index]);
  const selectedDisplayedIndex = displayed.indexOf("East");
  const canonicalIndex = order[selectedDisplayedIndex];
  assert.equal(scoreBuiltIn(question,canonicalIndex),true);
  assert.equal(scoreBuiltIn({...question,correct:2},canonicalIndex),true);
  assert.equal(scoreBuiltIn(question,order.indexOf(1)),false);
});


test("generic protected question-bank engine shuffles options and keeps a server mapping", () => {
  const safe = new Function("shuffledServer_", "sanitizeAssessmentQuestionForStudent_", extract(code, "safeBuiltInQuestion_") + "; return safeBuiltInQuestion_;")(shuffleServer, sanitizeQuestion);
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


test("protected true-false questions create and shuffle default options before delivery", () => {
  const safe = new Function("shuffledServer_", "sanitizeAssessmentQuestionForStudent_", extract(code, "safeBuiltInQuestion_") + "; return safeBuiltInQuestion_;")(shuffleServer, sanitizeQuestion);
  const maps = {};
  const result = safe({bankId:"bank",questionId:"tf1",questionIndex:3,question:{type:"tf",q:"Statement",correct:true}},maps);
  assert.deepEqual([...result.question.options].sort(),["Верно","Неверно"]);
  assert.deepEqual(maps["3"].slice().sort(),[0,1]);
  assert.notDeepEqual(maps["3"],[0,1],"default true-false options must not retain a fixed order");
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
  const finalGet = extract(code,"getFinalExam_");
  const finalSubmit = extract(code,"submitFinalExam_");
  assert.match(finalSubmit,/optionMaps/);
  assert.match(finalGet,/startedAt:Date\.now\(\)/);
  assert.match(finalGet,/durationSeconds:60\*60/);
  const finalUi = fs.readFileSync(path.join(root,"final.js"),"utf8");
  assert.match(finalUi,/FINAL_EXAM_TIME\s*=\s*60\s*\*\s*60/,"client countdown and server timer must both use 60 minutes");
  assert.match(finalSubmit,/elapsedSeconds>Number\(exam\.durationSeconds\)\+300/);
  assert.match(finalSubmit,/TimeSpent:Math\.min\(elapsedSeconds,Number\(exam\.durationSeconds\)\)/);
  assert.doesNotMatch(finalSubmit,/TimeSpent:Math\.max\(0,Math\.min\(5400,Number\(data\.timeSpent\)/);
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
  assert.match(semesterSubmit,/TimeSpent:Math\.min\(elapsedSeconds,\s*allowedSeconds\)/);
  assert.doesNotMatch(semesterSubmit,/Number\(data\.timeSpent\)/);
  const vprValidator = extract(vpr, "validateEnglishVprExam_");
  assert.match(vprValidator,/duration < 1 \|\| duration > 180/);
  const vprSubmit = extract(vpr, "submitEnglishVprExam_");
  assert.match(vprSubmit,/const elapsedSeconds = startedAt \? Math\.max\(0, Math\.floor\(\(Date\.now\(\) - startedAt\) \/ 1000\)\) : 0/);
  assert.match(vprSubmit,/timeSpent:Math\.min\(elapsedSeconds,allowedSeconds\)/);
  assert.doesNotMatch(vprSubmit,/Number\(data\.timeSpent\)/);
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
  const safeBuiltIn = new Function("shuffledServer_", "sanitizeAssessmentQuestionForStudent_", extract(code, "safeBuiltInQuestion_") + "; return safeBuiltInQuestion_;")(shuffleServer, sanitizeQuestion);
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
  assert.match(gradeWritten,/isRegrade&&!\(teacher\.role==="admin"&&data\.regrade===true\)/);
  assert.match(gradeWritten,/written_regraded/);
  assert.match(gradeWritten,/answerOnly=previousSubmission\.replace/);
  const getResults = extract(code,"getResults_");
  assert.match(getResults,/feedbackMatch=submission\.match/);
  assert.match(getResults,/payload:submission\.replace/);
  const journal = fs.readFileSync(path.join(root, "journal.js"), "utf8");
  assert.match(journal,/API\.gradeWrittenResult/);
  assert.match(journal,/written_self_/);
  assert.match(journal,/Письменная работа проверена/);
  assert.match(journal,/Number\(record\.grade\)>=2\s*&&\s*Number\(record\.grade\)<=5/);
  assert.match(journal,/hasOwnProperty\.call\(resultIndex\[rec\.email\], rec\.testId\)/,
    "newest-first results must not be overwritten by older attempts");

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
  assert.match(start, /attemptNo:prior \+ 1/);
  assert.match(start, /finally\s*\{\s*lock\.releaseLock\(\)/);
});


test("English VPR attempt token is retained until the result write succeeds", () => {
  const submit = extract(vpr, "submitEnglishVprExam_");
  const saveAt = submit.indexOf("const result=saveResult_");
  const cleanupAt = submit.indexOf("const cleanupLock = LockService.getScriptLock()");
  assert.ok(saveAt >= 0 && cleanupAt > saveAt, "cleanup must happen after server result persistence");
  assert.match(submit.slice(0, saveAt), /attemptLock\.releaseLock\(\)/);
  assert.match(submit.slice(0, saveAt), /lockedAttempt\.processing === true/);
  assert.match(submit.slice(0, saveAt), /processingAttempt\.processingAt = Date\.now/);
  assert.match(submit.slice(0, saveAt), /savedAttempts >= Number\(lockedAttempt\.attemptNo\)/);
  assert.match(submit.slice(saveAt, cleanupAt), /catch \(saveError\)/);
  assert.match(submit.slice(saveAt, cleanupAt), /current\.processing = false/);
  assert.match(submit.slice(cleanupAt), /cache\.remove\("englishVprAttempt:" \+ attemptId\)/);
  assert.match(submit.slice(cleanupAt), /cache\.remove\(String\(finalAttempt\.stableKey\)\)/);
});


test("student cannot create duplicate pending written submissions", () => {
  const save = extract(code, "saveResult_");
  assert.match(save, /const matchingRows=values\.filter/);
  assert.match(save, /Number\(latest\[5\]\)===0/);
  assert.match(save, /Работа уже отправлена и ожидает проверки преподавателя/);
  assert.match(save, /matchingRows\.length\s*\)/);
});


test("English VPR Basic and Technical seed content remains track-specific", () => {
  const seeds = new Function(vpr + "; return englishVprSeedExams_();")();
  const validateVpr = new Function(extract(vpr, "validateEnglishVprExam_") + "; return validateEnglishVprExam_;")();
  assert.equal(validateVpr("basic", seeds.basic), true);
  assert.equal(validateVpr("technical", seeds.technical), true);
  assert.equal(seeds.basic.track, "basic");
  assert.equal(seeds.technical.track, "technical");
  const stems = (exam) => {
    const result = [];
    for (const task of exam.tasks) {
      if (task.type === "choice") for (const item of task.items || []) result.push(String(item[0]));
      if (task.type === "match") for (const item of task.items || []) result.push(String(item[1]));
      if (task.type === "gap" && task.text) result.push(String(task.text));
      if (task.type === "transform") for (const item of task.items || []) result.push(String(item[0]) + " " + String(item[1]));
    }
    return result.map((value) => value.toLowerCase().replace(/\s+/g, " ").trim());
  };
  const basic = new Set(stems(seeds.basic));
  const overlap = stems(seeds.technical).filter((stem) => basic.has(stem));
  assert.deepEqual(overlap, [], "Basic and Technical VPR prompts/passages must remain distinct");
});
