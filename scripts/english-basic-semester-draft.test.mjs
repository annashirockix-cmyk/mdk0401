import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "docs/english-basic-semester-bank-draft-v1.md",
  "docs/english-basic-semester-bank-draft-v2.md",
  "docs/english-basic-semester-bank-draft-v3.md",
  "docs/english-basic-semester-bank-draft-v4.md",
  "docs/english-basic-semester-bank-draft-v5.md",
  "docs/english-basic-semester-bank-draft-v6.md",
  "docs/english-basic-semester-bank-draft-v7.md"
];

function parseDraft(source) {
  const questions = [];
  let current = null;
  for (const line of source.split(/\r?\n/)) {
    const heading = line.match(/^\*\*(\d+)\.\*\*\s*(.*)$/);
    if (heading) {
      current = { number: Number(heading[1]), stem: heading[2].trim(), options: [] };
      questions.push(current);
      continue;
    }
    const option = line.match(/^- ([A-D])\.\s+(.+)$/);
    if (option && current) current.options.push(option[1]);
  }
  const keys = new Map([...source.matchAll(/^\|\s*(\d+)\s*\|\s*([A-D])\s*\|/gm)]
    .map((match) => [Number(match[1]), match[2]]));
  return { questions, keys };
}

test("Basic semester drafts 1–140 have four options and one valid teacher key per item", () => {
  const drafts = files.map((file) => parseDraft(readFileSync(path.join(root, file), "utf8")));
  const questions = drafts.flatMap((draft) => draft.questions);
  assert.equal(questions.length, 140);
  assert.deepEqual(questions.map((question) => question.number), Array.from({ length: 140 }, (_, i) => i + 1));
  for (const draft of drafts) {
    assert.equal(draft.questions.length, 20);
    assert.equal(draft.keys.size, 20);
    for (const question of draft.questions) {
      assert.equal(question.options.length, 4, "Question " + question.number + " must have four options");
      assert.equal(new Set(question.options).size, 4, "Question " + question.number + " repeats an option label");
      assert.ok(draft.keys.has(question.number), "Question " + question.number + " has no teacher key");
      assert.ok(question.options.includes(draft.keys.get(question.number)), "Question " + question.number + " key is not one of its options");
    }
  }
});

test("Basic semester drafts 1–120 contain no repeated question stems", () => {
  const questions = files.flatMap((file) => parseDraft(readFileSync(path.join(root, file), "utf8")).questions);
  const normalized = questions.map((question) => question.stem.toLowerCase().replace(/\s+/g, " ").trim());
  assert.equal(new Set(normalized).size, normalized.length);
});

test("legacy Basic seed cannot pass the protected bank validator without server answer keys", () => {
  const source = readFileSync(path.join(root, "english-assessment-data.js"), "utf8");
  const start = source.indexOf("window.SEMESTER_TESTS.basic = [");
  const end = source.indexOf("window.SEMESTER_TESTS.technical =", start);
  assert.ok(start >= 0 && end > start);
  const legacyBasic = source.slice(start, end);
  assert.match(legacyBasic, /tq\(/);
  assert.doesNotMatch(legacyBasic, /correct\s*:/);
});
