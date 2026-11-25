import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");

function extractFunction(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.notEqual(start, -1, "missing function " + name);
  const open = source.indexOf("{", start);
  let depth = 0, quote = "", escaped = false, line = false, block = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i], next = source[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && next === "/") { block = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "/" && next === "/") { line = true; i++; continue; }
    if (c === "/" && next === "*") { block = true; i++; continue; }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}

function makeReader(role) {
  const rows = [
    ["Id","CourseId","TopicId","Type","Title","Payload"],
    ["teacher-lesson","ENB","unit-1","lecture","Teacher companion",
      JSON.stringify({teacherOnly:true,teacherContent:"Private recording script",answerKey:"private"})],
    ["public-lesson","ENB","unit-1","lecture","Student lesson",
      JSON.stringify({body:"Public lesson",teacherNotes:"private note",suggestedAnswers:["private"],markingGuide:"private"})],
    ["public-test","ENB","unit-1","test","Student test",
      JSON.stringify({questions:[{q:"Question",options:["A","B"],correct:1,explanation:"private",nested:{answerKey:"private",prompt:"keep"}}]})]
  ];
  const sheet = {getDataRange:()=>({getValues:()=>rows.map(row=>row.slice())})};
  const users = {
    student:{role:"student",email:"student@example.test",courses:"ENB"},
    teacher:{role:"teacher",email:"teacher@example.test",courses:"ENB"}
  };
  const fn = new Function(
    "auth_", "content_", "normalizeCourseId_", "hasCourseAccess_", "customContentIsOpen_", "hydrateTestQuestionImages_",
    extractFunction(backend,"getCustomContent_") + "; return getCustomContent_;"
  )(
    () => users[role], () => sheet, value => String(value || ""),
    (user, courseId) => String(user.courses || "").split(",").includes(courseId),
    () => true, questions => questions
  );
  return fn({});
}

test("student content API omits teacher-only records and strips private companion fields", () => {
  const response = makeReader("student");
  assert.equal(response.success, true);
  assert.equal(response.data.some(item => item.id === "teacher-lesson"), false,
    "teacherOnly record must not be returned at all");
  const lesson = response.data.find(item => item.id === "public-lesson");
  assert.ok(lesson);
  assert.equal(lesson.body, "Public lesson");
  for (const key of ["teacherNotes","teacherKey","answerKey","recordingScript","transcriptReveal","suggestedAnswers","markingGuide"]) {
    assert.equal(Object.hasOwn(lesson,key), false, key + " must not reach student browser");
  }
  const exam = response.data.find(item => item.id === "public-test");
  assert.equal(exam.questions[0].correct, undefined);
  assert.equal(exam.questions[0].explanation, undefined);
  assert.equal(exam.questions[0].nested.answerKey, undefined);
  assert.equal(exam.questions[0].nested.prompt, "keep");
});

test("teacher content API returns authorized teacher-only companion records", () => {
  const response = makeReader("teacher");
  const privateLesson = response.data.find(item => item.id === "teacher-lesson");
  assert.ok(privateLesson, "authorized teacher must receive teacher-only companion record");
  assert.equal(privateLesson.teacherContent, "Private recording script");
  assert.equal(privateLesson.answerKey, "private");
});

test("content API applies course access checks before returning any audience content", () => {
  const fn = new Function(
    "auth_", "content_", "normalizeCourseId_", "hasCourseAccess_", "customContentIsOpen_", "hydrateTestQuestionImages_",
    extractFunction(backend,"getCustomContent_") + "; return getCustomContent_;"
  )(
    () => ({role:"teacher",courses:"MAT"}), () => ({getDataRange:()=>({getValues:()=>[
      ["Id","CourseId","TopicId","Type","Title","Payload"],
      ["english-private","ENB","unit-1","lecture","English","{}"]
    ]})}), value=>String(value||""),
    (user,courseId)=>String(user.courses||"").split(",").includes(courseId),
    ()=>true, questions=>questions
  );
  assert.deepEqual(fn({}).data, [], "teacher assigned to another course must not receive English content");
});
