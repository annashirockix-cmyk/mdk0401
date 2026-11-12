import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

const publicAssessmentSources = [
  "data-0701.js",
  "data-0401.js",
  "data-0201.js",
  "data-0202.js",
  "data-mastercam.js",
  "data-sprut-tp.js",
  "data-material.js",
  "data-safety.js",
  "data-metrology.js",
  "data-extra.js",
  "data-english-basic.js",
  "data-english-technical.js",
  "english-assessment-data.js",
  "tests-extra.js",
  "course-assessment-advanced.js",
  "hard-questions.js",
  "challenge-questions.js",
  "sprut-tp-question-bank.js",
  "exam_0401.js",
  "exam_0201.js",
  "exam_0202.js",
  "exam_0701.js",
  "english-vpr-exams.js",
  "final-exam-question-types.js"
];

test("public course and assessment data contain no embedded answer keys", () => {
  for (const file of publicAssessmentSources) {
    const source = read(file);
    assert.doesNotMatch(source, /\bcorrect\s*:/, file + " exposes correct:");
    assert.doesNotMatch(source, /\bexpectedAnswer\s*:/, file + " exposes expectedAnswer:");
    assert.doesNotMatch(source, /\bcorrectAnswer\s*:/, file + " exposes correctAnswer:");
    assert.doesNotMatch(source, /\bcorrectOrder\s*:/, file + " exposes correctOrder:");
    assert.doesNotMatch(source, /\banswer\s*:/, file + " exposes answer:");
    assert.doesNotMatch(source, /function\s+(?:tq|q)\s*\([^)]*\bcorrect\b/, file + " retains a key-bearing question helper");
  }
});

test("public question helper calls no longer carry a third answer argument", () => {
  for (const file of ["data-0401.js", "data-0201.js", "data-mastercam.js", "data-english-basic.js", "data-english-technical.js", "english-assessment-data.js", "data-metrology.js", "challenge-questions.js"]) {
    const source = read(file);
    assert.doesNotMatch(source, /\b(?:tq|q)\(\s*(?:"[^"]*"|'[^']*')\s*,\s*\[[^\]]*\]\s*,\s*-?\d+\s*\)/, file + " retains a public answer argument");
  }
});

test("English protected banks are not shipped as a public assessment source", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /english-assessment-data\.js/);
  const engine = read("english-vpr-engine.js");
  assert.match(engine, /window\.API\.getEnglishSemesterTests/);
  assert.match(engine, /window\.API\.getEnglishVprExam/);
});

test("students fail closed and staff previews never grade from client data", () => {
  const app = read("app.js");
  assert.match(app, /Fail closed: students must never fall back to client-side answer keys/);
  assert.match(app, /var previewOnly = true/);
  assert.match(app, /Предпросмотр завершён/);
  assert.match(app, /if \(!previewOnly && Number\(selected\) === Number\(questions\[currentQ\]\.correct\)\)/);
});

test("protected server question delivery strips answer fields before returning to students", () => {
  const server = read("Code.gs");
  const start = server.indexOf("function safeBuiltInQuestion_");
  const end = server.indexOf("\nfunction getBuiltInTest_", start);
  assert.ok(start >= 0 && end > start);
  const sanitizer = server.slice(start, end);
  for (const key of ["correct", "answer", "correctAnswer", "answers", "explanation", "solution", "key", "expectedAnswer", "acceptedAnswers", "correctOrder"]) {
    assert.ok(sanitizer.includes('delete q["' + key + '"]') || sanitizer.includes('delete q.' + key) || sanitizer.includes('delete q[k]'), "server sanitizer must remove " + key);
  }
  assert.match(server, /if\(user\.role!==\"student\"\|\|!courseId\|\|!testId/);
});
