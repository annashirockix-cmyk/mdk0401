import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../course-editor-ux.js", import.meta.url), "utf8");

test("lecture editor provides an isolated, live preview", () => {
  assert.match(source, /function lecturePreview\(\)/);
  assert.match(source, /frame\.setAttribute\('sandbox',''\)/);
  assert.doesNotMatch(source, /setAttribute\('sandbox',[^)]*(?:allow-scripts|allow-same-origin)/);
  assert.match(source, /frame\.srcdoc=/);
  assert.match(source, /Content-Security-Policy/);
  assert.match(source, /script-src \\'none\\'/);
  assert.match(source, /area\.addEventListener\('input'/);
  assert.match(source, /lecturePreview\(\);tests\(\)/);
});
