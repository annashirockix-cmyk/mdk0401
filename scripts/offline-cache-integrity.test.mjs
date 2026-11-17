import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), "utf8");

test("every local script and stylesheet referenced by the portal is precached", () => {
  const html = read("index.html");
  const worker = read("service-worker.js");
  const precache = new Set([...worker.matchAll(/'(\\.\\/[^']+)'/g)].map((match) => match[1]));
  const localScripts = [...html.matchAll(/<script[^>]+src=["'](\\.\\/[^"']+)/g)]
    .map((match) => match[1].split("?")[0]);
  const localStyles = [...html.matchAll(/<link[^>]+href=["'](\\.\\/[^"']+\\.css)/g)]
    .map((match) => match[1].split("?")[0]);
  for (const asset of new Set([...localScripts, ...localStyles])) {
    assert.ok(precache.has(asset), asset + " must be precached for offline reading");
    assert.ok(fs.existsSync(new URL(asset, root)), asset + " must exist in the repository");
  }
});

test("all precached files exist and offline navigation falls back to the portal shell", () => {
  const worker = read("service-worker.js");
  const precache = [...worker.matchAll(/'(\\.\\/[^']+)'/g)].map((match) => match[1]);
  for (const asset of new Set(precache)) {
    assert.ok(fs.existsSync(new URL(asset, root)), asset + " is listed in precache but missing");
  }
  assert.match(worker, /cache\\.addAll\\(STATIC_ASSETS\\)/);
  assert.match(worker, /caches\\.match\\(request,\\s*\\{\\s*ignoreSearch:\\s*true\\s*\\}\\)/);
  assert.match(worker, /request\\.mode\\s*===\\s*'navigate'[\\s\\S]*?caches\\.match\\('\\.\\/index\\.html'\\)/);
  assert.match(worker, /request\\.method\\s*!==\\s*'GET'/);
  assert.match(worker, /script\\.google\\.com/);
});
