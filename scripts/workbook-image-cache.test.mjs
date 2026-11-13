import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serviceWorker = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
const workbooks = fs.readFileSync(path.join(root, "workbooks.js"), "utf8");

test("Wikimedia workbook photos are cached after first successful online load", () => {
  assert.match(serviceWorker, /portal-cache-v342/);
  assert.match(serviceWorker, /url\.hostname === 'commons\.wikimedia\.org'/);
  assert.match(serviceWorker, /url\.pathname\.includes\('\/wiki\/Special:FilePath\/'\)/);
  assert.match(serviceWorker, /networkResponse\.status === 200 \|\| networkResponse\.type === 'opaque'/);
  assert.match(serviceWorker, /event\.waitUntil\(caches\.open\(CACHE_NAME\)\.then\(\(cache\) => cache\.put\(request, responseToCache\)\)\)/);
  assert.match(serviceWorker, /caches\.match\(request, \{ ignoreSearch: true \}\)/);
});

test("only the dedicated Wikimedia file endpoint is eligible for external photo caching", () => {
  assert.doesNotMatch(serviceWorker, /url\.hostname\.includes\('wikimedia\.org'\)/);
  assert.match(workbooks, /commons\.wikimedia\.org\/wiki\/Special:FilePath\//);
  assert.match(workbooks, /Источник и лицензия/);
});
