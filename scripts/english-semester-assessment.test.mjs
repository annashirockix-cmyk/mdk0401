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


const registrySource = extractFunction("validateEnglishExamVariantRegistry_");
const validateRegistry = new Function(registrySource + "; return validateEnglishExamVariantRegistry_;")();

function validExamRegistry() {
  return Array.from({length:10}, (_, slot) => {
    const courseNo = Math.floor(slot / 2) + 1;
    const semester = slot % 2 + 1;
    return {
      courseNo, courseId:courseNo >= 3 ? "ENT" : "ENB",
      track:courseNo >= 3 ? "technical" : "basic",
      semester,
      variants:Array.from({length:15}, (_, variant) => ({
        variantId:"EN_C0" + courseNo + "_S" + semester + "_V" + String(variant + 1).padStart(2,"0"),
        blueprintId:"BP_C0" + courseNo + "_S" + semester
      }))
    };
  });
}

test("final exam registry requires all ten course-semester slots and 150 unique variants", () => {
  assert.deepEqual(validateRegistry(validExamRegistry()), {examCount:10,variantCount:150,basicSlots:4,technicalSlots:6});
});

test("final exam registry rejects missing slots, wrong tracks, wrong variant counts and duplicate IDs", () => {
  const missingSlot=validExamRegistry().slice(0,9);
  assert.throws(()=>validateRegistry(missingSlot), /ровно 10/);
  const wrongTrack=validExamRegistry(); wrongTrack[4].track="basic";
  assert.throws(()=>validateRegistry(wrongTrack), /правильным направлением/);
  const shortVariants=validExamRegistry(); shortVariants[0].variants.pop();
  assert.throws(()=>validateRegistry(shortVariants), /ровно 15/);
  const duplicate=validExamRegistry(); duplicate[1].variants[0].variantId=duplicate[0].variants[0].variantId;
  assert.throws(()=>validateRegistry(duplicate), /уникальный ID/);
  const wrongPortalId=validExamRegistry(); wrongPortalId[0].courseId="EN";
  assert.throws(()=>validateRegistry(wrongPortalId), /действующим ID дисциплины/);
  const missingBlueprint=validExamRegistry(); missingBlueprint[0].variants[0].blueprintId="";
  assert.throws(()=>validateRegistry(missingBlueprint), /ссылку на blueprint/);
});

const validateSource = extractFunction("validateEnglishSemesterTests_");
const sanitizeSource = extractFunction("sanitizeEnglishSemesterTests_");
const fingerprintSource = extractFunction("englishSemesterBankFingerprint_");
const validate = new Function(validateSource + "; return validateEnglishSemesterTests_;")();
const sanitizeQuestionSource = extractFunction("sanitizeAssessmentQuestionForStudent_");
const sanitize = new Function(sanitizeQuestionSource + "\n" + sanitizeSource + "; return sanitizeEnglishSemesterTests_;")();
const fingerprint = new Function(fingerprintSource + "; return englishSemesterBankFingerprint_;")();
const optionOrderSource = extractFunction("englishSemesterOptionOrder_");
const optionOrder = new Function(optionOrderSource + "; return englishSemesterOptionOrder_;")();


function validBank(track) {
  const prefix = track === "basic" ? "b_" : "t_";
  const firstYear = track === "basic" ? 1 : 3;
  const count = track === "basic" ? 4 : 6;
  return Array.from({ length: count }, (_, i) => ({
    id: prefix + "sem" + (i + 1),
    year: firstYear + Math.floor(i / 2),
    semester: i % 2 + 1,
    time: 45,
    questions: Array.from({ length: 20 }, (_, q) => ({
      q: `Question ${i + 1}-${q + 1}`,
      options: ["A", "B", "C", "D"],
      correct: q % 4,
    })),
  }));
}

test("server accepts four Basic and six Technical semester tests in their five-year course slots", () => {
  assert.equal(validate(validBank("basic"), "basic"), 80);
  assert.equal(validate(validBank("technical"), "technical"), 120);
});

test("server rejects ten-per-track legacy layout and wrong course-year mapping", () => {
  const tooManyBasic = [...validBank("basic"), ...validBank("basic")].slice(0, 10);
  assert.throws(() => validate(tooManyBasic, "basic"), /ровно 4/);
  const tooFewTechnical = validBank("technical").slice(0, 4);
  assert.throws(() => validate(tooFewTechnical, "technical"), /ровно 6/);
  const wrongTechnicalYear = validBank("technical");
  wrongTechnicalYear[0].year = 1;
  assert.throws(() => validate(wrongTechnicalYear, "technical"), (error) => error.message.includes("курсу/семестру"));
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
  const repeatedAcrossSemesters = validBank("basic"); repeatedAcrossSemesters[1].questions[0].q = repeatedAcrossSemesters[0].questions[0].q;
  assert.throws(() => validate(repeatedAcrossSemesters, "basic"), /Повторяющийся вопрос/);
  const repeatedWhitespace = validBank("basic"); repeatedWhitespace[1].questions[0].q = "  Question   1-1  ";
  assert.throws(() => validate(repeatedWhitespace, "basic"), /Повторяющийся вопрос/);
});

test("server rejects duplicate options and track-mismatched identifiers", () => {
  const duplicateOptions = validBank("technical"); duplicateOptions[0].questions[0].options[2] = "A";
  assert.throws(() => validate(duplicateOptions, "technical"), /повторяющиеся варианты/);
  const wrongTrackIds = validBank("technical"); wrongTrackIds[0].id = "b_sem1";
  assert.throws(() => validate(wrongTrackIds, "technical"), /уникальным ID/);
});

test("student-facing payload strips all answer-key and explanation fields", () => {
  const safe = sanitize([{ questions: [{ q: "Q", options: ["A", "B"], correct: 1, answer: "B", correctAnswer: "B", explanation: "key", rationale: "key", answerIndex: 1, solution: "hidden" }] }]);
  const question = safe[0].questions[0];
  for (const key of ["correct", "answer", "correctAnswer", "explanation", "rationale", "answerIndex", "solution"]) assert.equal(Object.hasOwn(question, key), false);
});

test("unreviewed legacy seed stays out of the production page and cloned Technical tests are withheld", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const legacy = fs.readFileSync(path.join(root, "english-assessment-data.js"), "utf8");
  assert.equal(html.includes("english-assessment-data.js"), false);
  const sandbox = { window: {}, console: { log() {} } };
  new Function("window", "console", legacy)(sandbox.window, sandbox.console);
  const basic = sandbox.window.SEMESTER_TESTS.basic;
  const technical = sandbox.window.SEMESTER_TESTS.technical;
  assert.equal(basic.length, 10);
  assert.equal(technical.length, 0);
  assert.equal(basic.every((item) => item.questions.length === 20), true);
  assert.equal(basic.every((item) => item.questions.every((question) => Number.isInteger(question.correct))), false);
  assert.doesNotMatch(legacy, /window\.SEMESTER_TESTS\.basic\.map\s*\(/);
});

test("Basic and Technical banks reject identical substantive question stems", () => {
  const overlapSource = extractFunction("englishSemesterBankOverlap_");
  const importer = extractFunction("importEnglishSemesterTests_");
  const overlap = new Function(overlapSource + "; return englishSemesterBankOverlap_;")();
  assert.match(importer, /englishSemesterBankOverlap_\(tests, otherTests\)/);
  const basic = validBank("basic");
  const technicalClone = validBank("technical");
  const sharedStem = "Describe the purpose of a machine-tool safety interlock.";
  basic[0].questions[0].q = sharedStem;
  technicalClone[0].questions[0].q = sharedStem;
  const distinctTechnical = validBank("technical");
  distinctTechnical.forEach((item, index) => item.questions.forEach((question, q) => {
    question.q = "Technical assessment item " + index + " number " + q + " describes a separate engineering context.";
  }));
  assert.notEqual(fingerprint(basic), fingerprint(technicalClone), "course-year metadata remains part of the bank fingerprint");
  assert.ok(overlap(basic, technicalClone).length > 0);
  assert.equal(overlap(basic, distinctTechnical).length, 0);
  assert.equal(fingerprint([{year:3,semester:1,questions:[{q:"A   technical   question"}]}]), fingerprint([{year:3,semester:1,questions:[{q:"A technical question"}]}]));
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
