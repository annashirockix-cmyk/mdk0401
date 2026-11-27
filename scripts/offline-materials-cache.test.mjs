import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), "utf8");

test("offline material cache is account- and role-scoped with a short expiry", () => {
  const cache = read("offline-materials-cache.js");
  assert.match(cache, /role \+ ":" \+ email/);
  assert.match(cache, /24 \* 60 \* 60 \* 1000/);
  assert.match(cache, /now - record\.savedAt > MAX_AGE_MS/);
  assert.match(cache, /record\.email !== String\(user\.email\)\.trim\(\)\.toLowerCase\(\)/);
  assert.match(cache, /record\.role !== String\(user\.role\)\.toLowerCase\(\)/);
  assert.match(cache, /clearOtherUsers/);
  assert.match(cache, /indexedDB\.open/);
});

test("only server-authorized reading materials are stored, never assessments or answer banks", () => {
  const cache = read("offline-materials-cache.js");
  assert.match(cache, /ALLOWED_TYPES = \{ lecture: true, file: true, topic: true \}/);
  assert.doesNotMatch(cache, /test:\s*true|game:\s*true|announcement:\s*true|flashcards:\s*true/);
  assert.match(cache, /MAX_BYTES = 8 \* 1024 \* 1024/);
  assert.match(cache, /serialized\.length \* 2 > MAX_BYTES/);
});

test("offline fallback requires the still-present session and clears data on logout or auth expiry", () => {
  const app = read("app.js");
  assert.match(app, /if \(tokenStillPresent && identity && window\.OfflineMaterialsCache\)/);
  assert.match(app, /OfflineMaterialsCache\.load\(identity\)/);
  assert.match(app, /OfflineMaterialsCache\.clear\(logoutUser\)/);
  assert.match(app, /OfflineMaterialsCache\.clear\(expiredUser\)/);
  assert.match(app, /OfflineMaterialsCache\.clearOtherUsers/);
  assert.match(app, /\["tests", "flashcards", "games", "announcements"\]\.forEach/);
  assert.match(app, /window\.customContent\[key\] = \[\]/);
});

test("offline helper is loaded before app logic and is precached", () => {
  const html = read("index.html");
  const worker = read("service-worker.js");
  assert.ok(html.indexOf("offline-materials-cache.js") < html.indexOf('src="./app.js'));
  assert.match(worker, /portal-cache-v\d+/);
  assert.match(worker, /'\.\/offline-materials-cache\.js'/);
  assert.match(html, /service-worker\.js\?v=448/);
});


test("offline materials manager exposes inventory, refresh and selective removal", () => {
  const ui = read("offline-materials-ui.js");
  const html = read("index.html");
  const worker = read("service-worker.js");
  assert.match(ui, /Обновить материалы/);
  assert.match(ui, /Удалить выбранные/);
  assert.match(ui, /Сбросить и загрузить всё/);
  assert.match(ui, /OfflineMaterialsCache\.summary/);
  assert.match(ui, /OfflineMaterialsCache\.remove/);
  assert.match(html, /offline-materials-ui\.js/);
  assert.match(worker, /portal-cache-v\d+/);
  assert.match(worker, /'\.\/offline-materials-ui\.js'/);
  assert.match(html, /service-worker\.js\?v=448/);
});


test("selective deletion persists as an exclusion until the user explicitly resets the snapshot", () => {
  const cache = read("offline-materials-cache.js");
  const ui = read("offline-materials-ui.js");
  assert.match(cache, /excluded: excluded/);
  assert.match(cache, /!excludedMap\[itemKey\(row\)\]/);
  assert.match(cache, /function remove\(user, keys\)/);
  assert.match(cache, /record\.excluded = excluded/);
  assert.match(ui, /OfflineMaterialsCache\.clear\(user\)/);
  assert.match(ui, /Сбросить и загрузить всё/);
});


test("offline materials refresh reports actual server outcome and blocks offline reset", () => {
  const ui = read("offline-materials-ui.js");
  const app = read("app.js");
  assert.match(app, /function finish\(success\).*callback\(success === true\)/);
  assert.match(app, /finish\(!!\(res && res\.success\)\)/);
  assert.match(app, /finish\(false\)/);
  assert.match(ui, /navigator\.onLine === false/);
  assert.match(ui, /Материалы обновлены с сервера/);
  assert.match(ui, /загрузить материалы не удалось/);
});
