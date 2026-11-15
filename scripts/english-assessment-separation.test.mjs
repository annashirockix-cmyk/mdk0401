import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacy = readFileSync(path.join(root, "english-assessment-data.js"), "utf8");

test("legacy Technical semester tests are not cloned from Basic", () => {
  assert.match(legacy, /window\.SEMESTER_TESTS\.technical\s*=\s*\[\]\s*;/);
  assert.doesNotMatch(legacy, /window\.SEMESTER_TESTS\.basic\.map\s*\(/);
});

test("Basic legacy tests remain present and unchanged as a separate dataset", () => {
  assert.match(legacy, /window\.SEMESTER_TESTS\.basic\s*=\s*\[/);
  assert.match(legacy, /b_sem10/);
});
