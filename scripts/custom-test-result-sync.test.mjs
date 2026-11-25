import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const worker = readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");

test("a server-verified custom-test result is synchronized into the active student state", () => {
  const start = app.indexOf("window.startCustomInlineTest = async function(testId)");
  const end = app.indexOf("\n    window.", start + 10);
  assert.ok(start >= 0, "custom test renderer must exist");
  const source = app.slice(start, end > start ? end : start + 12000);
  assert.match(source, /if \(!result \|\| !result\.success\)/);
  assert.match(source, /window\.state\.results\["custom_" \+ testId\] = \{grade:result\.grade,percent:result\.percent,score:result\.score,maxScore:result\.maxScore,attempts:result\.attempts\}/);
  assert.match(source, /if \(window\.saveStudentData\) window\.saveStudentData\(\)/);
  assert.ok(source.indexOf("window.state.results[\"custom_\" + testId]") < source.indexOf("area.innerHTML = '<div"),
    "the verified result must be stored before the completion view is rendered");
});

test("the service worker cache is invalidated for the custom-test result sync fix", () => {
  assert.match(worker, /portal-cache-v428/);
});
