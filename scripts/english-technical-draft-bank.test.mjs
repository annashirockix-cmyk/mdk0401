import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = Array.from({ length: 10 }, (_, i) =>
  path.join(root, "docs", `english-technical-semester-bank-draft-v${i + 1}.md`)
);

function parseBatch(file, batchIndex) {
  const source = readFileSync(file, "utf8");
  const lines = source.split(/\r?\n/);
  const keyRows = [...source.matchAll(/^\|\s*(\d+)\s*\|\s*([A-D])\s*\|/gm)];
  const keys = new Map(keyRows.map((m) => [Number(m[1]), m[2]]));
  let currentQuestion = null;
  let currentOptions = [];
  const questions = [];

  const flush = () => {
    if (currentOptions.length) {
      questions.push({ number: currentQuestion, options: currentOptions });
      currentOptions = [];
    }
  };

  for (const line of lines) {
    const heading = line.match(/^###\s+(\d+)\./) || line.match(/^\*\*(\d+)\.\*\*/);
    if (heading) {
      flush();
      currentQuestion = Number(heading[1]);
    }
    const option = line.match(/^\s*(?:-\s*)?([A-D])\.\s+(.+)$/);
    if (option) currentOptions.push({ letter: option[1], text: option[2] });
    else flush();
  }
  flush();

  const expectedNumbers = Array.from({ length: 20 }, (_, i) => batchIndex * 20 + i + 1);
  assert.equal(questions.length, 20, `${path.basename(file)} must contain 20 four-option items`);
  assert.equal(keyRows.length, 20, `${path.basename(file)} must contain 20 teacher-key rows`);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    assert.equal(q.number, expectedNumbers[i], `Unexpected question order in ${path.basename(file)}`);
    assert.deepEqual(q.options.map((o) => o.letter), ["A", "B", "C", "D"]);
    assert.ok(keys.has(q.number), `Missing teacher key for question ${q.number}`);
    assert.ok(q.options.find((o) => o.letter === keys.get(q.number))?.text,
      `Teacher key does not point to an option for question ${q.number}`);
  }

  const distribution = Object.fromEntries(["A", "B", "C", "D"].map((letter) => [
    letter, [...keys.values()].filter((value) => value === letter).length
  ]));
  assert.deepEqual(distribution, { A: 5, B: 5, C: 5, D: 5 },
    `${path.basename(file)} must distribute correct positions evenly`);

  return { questions, keys };
}

const batches = files.map(parseBatch);
const allNumbers = batches.flatMap((batch) => batch.questions.map((q) => q.number));
test("Technical English draft pool contains 200 ordered four-option questions", () => {
  assert.deepEqual(allNumbers, Array.from({ length: 200 }, (_, i) => i + 1));
});
test("Each 20-question batch has five correct answers in each A/B/C/D position", () => {
  assert.equal(batches.length, 10);
});
test("No exact duplicate question stems occur in the pool", () => {
  const stems = [];
  for (let i = 0; i < files.length; i++) {
    const source = readFileSync(files[i], "utf8");
    const lines = source.split(/\r?\n/);
    for (let j = 0; j < lines.length; j++) {
      const modern = lines[j].match(/^\*\*(\d+)\.\*\*\s*(.+)$/);
      if (modern) { const stem = modern[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); if (stem.split(" ").length >= 6) stems.push(stem); }
      const legacy = lines[j].match(/^###\s+(\d+)\./);
      if (legacy) {
        const next = lines.slice(j + 1, j + 4).find((line) => /^\*\*.+\*\*$/.test(line.trim()));
        if (next) stems.push(next.trim().replace(/^\*\*|\*\*$/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
      }
    }
  }
  const duplicates = stems.filter((stem, index) => stems.indexOf(stem) !== index);
  assert.deepEqual(duplicates, []);
});
