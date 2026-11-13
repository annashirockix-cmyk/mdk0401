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
    {type:"choice",options:["one","two","three","four"],items:[["q",3]]},
    {type:"match",options:["east","west","north","south"],items:[["A","text",2]]},
    {type:"gap",options:["first","second","third","fourth"],answers:[4]},
    {type:"gap",itemOptions:[["a","b","c","d"]],answers:[2]}
  ]};
  const prepared = prepareVpr(source), display = prepared.exam, maps = prepared.optionMaps;
  const choiceOrder = maps["choice|0|0"];
  assert.equal(display.tasks[0].options[display.tasks[0].items[0][1]-1],"three");
  assert.equal(choiceOrder.indexOf(2)+1,display.tasks[0].items[0][1]);
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
  }
});
