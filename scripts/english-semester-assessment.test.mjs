import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "Code.gs"), "utf8");

function extractFunction(name) {
  const marker = "function " + name + "(";
  const start = code.indexOf(marker);
  assert.notEqual(start, -1, `missing server function: ${name}`);
  const open = code.indexOf("{", start);
  let depth = 0, quote = "", escaped = false, lineComment = false, blockComment = false;
  for (let i = open; i < code.length; i++) {
    const c = code[i], n = code[i + 1];
    if (lineComment) { if (c === "\n") lineComment = false; continue; }
    if (blockComment) { if (c === "*" && n === "/") { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "/" && n === "/") { lineComment = true; i++; continue; }
    if (c === "/" && n === "*") { blockComment = true; i++; continue; }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return code.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}

const validateSource = extractFunction("validateEnglishSemesterTests_");
const sanitizeSource = extractFunction("sanitizeEnglishSemesterTests_");
const fingerprintSource = extractFunction("englishSemesterBankFingerprint_");
const validate = new Function(validateSource + "; return validateEnglishSemesterTests_;")();
const sanitize = new Function(sanitizeSource + "; return sanitizeEnglishSemesterTests_;")();
const fingerprint = new Function(fingerprintSource + "; return englishSemesterBankFingerprint_;")();
const optionOrderSource = extractFunction("englishSemesterOptionOrder_");
const optionOrder = new Function(optionOrderSource + "; return englishSemesterOptionOrder_;")();


function validBank(track) {
  const prefix = track === "basic" ? "b_" : "t_";
  return Array.from({ length: 10 }, (_, i) => ({
    id: prefix + "sem" + (i + 1),
    year: Math.floor(i / 2) + 1,
    semester: i % 2 + 1,
    time: 45,
    questions: Array.from({ length: 20 }, (_, q) => ({
      q: `Question ${i + 1}-${q + 1}`,
      options: ["A", "B", "C", "D"],
      correct: q % 4,
    })),
  }));
}

test("server accepts exactly ten correctly ordered semester tests with 20 keyed questions each", () => {
  assert.equal(validate(validBank("basic"), "basic"), 200);
  assert.equal(validate(validBank("technical"), "technical"), 200);
});

test("server rejects missing answer keys, duplicate IDs, wrong semester order and repeated questions", () => {
  const missingKey = validBank("basic"); delete missingKey[0].questions[0].correct;
  assert.throws(() => validate(missingKey, "basic"), /ключ ответа/);
  const duplicateId = validBank("basic"); duplicateId[1].id = duplicateId[0].id;
  assert.throws(() => validate(duplicateId, "basic"), /уникальным ID/);
  const wrongSemester = validBank("basic"); wrongSemester[0].semester = 2;
  assert.throws(() => validate(wrongSemester, "basic"), /курсу\/семестру/);
  const repeatedQuestion = validBank("basic"); repeatedQuestion[0].questions[1].q = repeatedQuestion[0].questions[0].q;
  assert.throws(() => validate(repeatedQuestion, "basic"), /Повторяющийся вопрос/);
});

test("server rejects duplicate options and track-mismatched identifiers", () => {
  const duplicateOptions = validBank("technical"); duplicateOptions[0].questions[0].options[2] = "A";
  assert.throws(() => validate(duplicateOptions, "technical"), /повторяющиеся варианты/);
  assert.throws(() => validate(validBank("basic"), "technical"), /уникальным ID/);
});

test("student-facing payload strips all answer-key and explanation fields", () => {
  const safe = sanitize([{ questions: [{ q: "Q", options: ["A", "B"], correct: 1, answer: "B", correctAnswer: "B", explanation: "key", rationale: "key", answerIndex: 1, solution: "hidden" }] }]);
  const question = safe[0].questions[0];
  for (const key of ["correct", "answer", "correctAnswer", "explanation", "rationale", "answerIndex", "solution"]) assert.equal(Object.hasOwn(question, key), false);
});

test("unreviewed legacy seed stays out of the production page", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const legacy = fs.readFileSync(path.join(root, "english-assessment-data.js"), "utf8");
  assert.equal(html.includes("english-assessment-data.js"), false);
  const sandbox = { window: {}, console: { log() {} } };
  new Function("window", "console", legacy)(sandbox.window, sandbox.console);
  const basic = sandbox.window.SEMESTER_TESTS.basic;
  const technical = sandbox.window.SEMESTER_TESTS.technical;
  assert.equal(basic.length, 10);
  assert.equal(technical.length, 10);
  assert.equal(basic.every((item) => item.questions.length === 20), true);
  assert.equal(technical.every((item) => item.questions.length === 20), true);
  assert.equal(basic.every((item) => item.questions.every((question) => Number.isInteger(question.correct))), false);
  assert.deepEqual(
    technical.map((item) => item.questions),
    basic.map((item) => item.questions),
    "Technical is still a direct copy of Basic and must not be imported",
  );
});

test("Basic and Technical banks must not be exact copies", () => {
  const basic = validBank("basic");
  const technicalClone = validBank("technical");
  const distinctTechnical = validBank("technical");
  distinctTechnical[0].questions[0].q = "Describe the purpose of a machine-tool safety interlock.";
  assert.equal(fingerprint(basic), fingerprint(technicalClone));
  assert.notEqual(fingerprint(basic), fingerprint(distinctTechnical));
});


test("semester answer options are shuffled deterministically per student and attempt", () => {
  const first = optionOrder("student@example.test", "b_sem1", 1, 0, 4);
  const repeated = optionOrder("student@example.test", "b_sem1", 1, 0, 4);
  const nextAttempt = optionOrder("student@example.test", "b_sem1", 2, 0, 4);
  const otherStudent = optionOrder("other@example.test", "b_sem1", 1, 0, 4);
  assert.deepEqual(first, repeated, "the same attempt must retain its order after reload");
  assert.deepEqual([...first].sort(), [0, 1, 2, 3], "every original option must appear once");
  assert.notDeepEqual(first, nextAttempt, "a new attempt should get a new order");
  assert.notDeepEqual(first, otherStudent, "different students should get independent orders");
});

test("shuffled display indices map back to the protected original answer key", () => {
  const originalOptions = ["alpha", "bravo", "charlie", "delta"];
  const correctOriginalIndex = 2;
  const order = optionOrder("student@example.test", "t_sem3", 4, 7, 4);
  const displayedOptions = order.map((index) => originalOptions[index]);
  const displayedCorrectIndex = displayedOptions.indexOf(originalOptions[correctOriginalIndex]);
  assert.equal(order[displayedCorrectIndex], correctOriginalIndex);
  assert.equal(displayedOptions[displayedCorrectIndex], "charlie");
});


test("semester shuffled options are bound to the server-verified attempt number and canonical indices", () => {
  const get = extractFunction("getEnglishSemesterTests_");
  const submit = extractFunction("submitEnglishSemesterTest_");
  assert.match(get, /safeTest\.attemptNo = attemptNo/);
  assert.match(submit, /requestedAttemptNo !== attemptNo/);
  assert.match(submit, /englishSemesterOptionOrder_\(user\.email, testId, attemptNo, index, optionCount\)/);
  assert.match(submit, /Submission:JSON\.stringify\(\{answers:canonicalAnswers\}\)/);
});
