import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const loadTest = readFileSync(new URL("./gas-read-load-test.mjs", import.meta.url), "utf8");
const server = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");

function extractFunction(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0, "missing function " + name);
  const open = source.indexOf("{", start);
  let depth = 0, quote = "", escaped = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}

test("registration requires surname, first name and a normalized study group on the server", () => {
  const fn = extractFunction(server, "register_");
  assert.match(fn, /if \(!surname \|\| !firstName\) return/);
  assert.match(fn, /if \(!group\) return \{ success: false, error: "Укажите учебную группу\." \}/);
  assert.match(fn, /const group = normalizeGroupName_\(data\.group\)/);
});

test("read-only load smoke test includes protected English VPR and semester reads", () => {
  assert.match(loadTest, /name: "getEnglishVprExam", params: \{ track: englishTrack \}/);
  assert.match(loadTest, /name: "getEnglishSemesterTests", params: \{ track: englishTrack \}/);
  assert.match(loadTest, /method: "GET"/);
  assert.match(loadTest, /Unique session tokens:/);
});

test("English semester retrieval used by load test is read-only", () => {
  const fn = extractFunction(server, "getEnglishSemesterTests_");
  assert.match(fn, /auth_\(data\)/);
  assert.match(fn, /hasCourseAccess_\(user, courseId\)/);
  assert.match(fn, /englishSemesterBank_\(\)/);
  assert.doesNotMatch(fn, /appendRow|deleteRow|setValue\(|setValues\(|CacheService\.getScriptCache\(\)\.put|PropertiesService\.getScriptProperties\(\)\.setProperty/,
    "load-test endpoint must not mutate sheets, caches or script properties");
});
