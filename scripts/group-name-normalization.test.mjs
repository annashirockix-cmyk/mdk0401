import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const start = source.indexOf("function normalizeGroupName_(value)");
const end = source.indexOf("\n}", start);
assert.ok(start >= 0 && end > start, "normalizeGroupName_ must exist");
const sandbox = {};
vm.createContext(sandbox);
new vm.Script(source.slice(start, end + 2)).runInContext(sandbox);
const normalize = sandbox.normalizeGroupName_;

test("group names match when spaces surround ASCII or Unicode dashes", () => {
  const canonical = normalize("24-ТМ");
  for (const value of ["24 - ТМ", "24 – ТМ", "24—ТМ", " 24   ‒   ТМ "]) {
    assert.equal(normalize(value), canonical, value);
  }
});

test("group normalization keeps case and compatibility normalization consistent", () => {
  assert.equal(normalize("２４–ｔｍ"), "24-TM");
  assert.equal(normalize("  то   21  "), "ТО 21");
  assert.equal(normalize("то-21"), "ТО-21");
});

test("empty and null group values stay empty", () => {
  assert.equal(normalize(""), "");
  assert.equal(normalize("   "), "");
  assert.equal(normalize(null), "");
  assert.equal(normalize(undefined), "");
});
