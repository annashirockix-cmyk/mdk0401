import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
test("custom lecture and test content has one student rendering path", () => {
 const app = read("app.js");
 const editor = read("course-admin.js");
 const html = read("index.html");
 const sw = read("service-worker.js"); const css = read("style.css"); const enrichment = read("lecture-enrichment.js");
 assert.ok(html.includes("course-admin.js?v=19"));
 assert.ok(app.includes("customTopicLectures"));
 assert.ok(app.includes("customTopicTests"));
 assert.ok(app.includes("window.startCustomInlineTest"));
 assert.ok(!editor.includes("window.renderTopicPage=function"));
 assert.ok(!editor.includes("function customRecords("));
 assert.ok(editor.includes("type:\"lecture\""));
 assert.ok(editor.includes("type:\"test\""));
 assert.match(sw, /portal-cache-v[0-9]+/); assert.ok(css.includes(".lec-content img"));
 assert.ok(enrichment.includes('["07.01","SPRUT_TP","basic","technical","EN","ENB","ENT"].indexOf(id)>=0'));
});
test("custom lecture sanitizer preserves safe images and figure captions", () => {
 const app = read("app.js");
 assert.ok(app.includes("\"FIGURE\",\"FIGCAPTION\",\"IMG\""));
 assert.ok(app.includes("node.tagName === \"IMG\" && name === \"src\""));
 assert.ok(app.includes("png|jpeg|gif|webp"));
 assert.ok(app.includes("\"alt\", \"width\", \"height\", \"loading\""));
});
test("flashcard constructor saves and reopens saved sets", () => {
 const workflow = read(".github/workflows/portal-syntax.yml");
 const audit = read("scripts/course-constructor-browser-audit.mjs");
 assert.ok(workflow.includes("Run real-browser course constructor round-trip audit"));
 assert.ok(audit.includes("Содержимое тестовой лекции"));
 assert.ok(audit.includes("Карточки конструктора"));
 const cards = read("flashcard-editor.js");
 assert.ok(cards.includes("type:\"flashcards\""));
 assert.ok(cards.includes("function renderSaved("));
 assert.ok(cards.includes("function loadSet("));
});

test("global custom-content loads ignore stale responses after account changes", () => {
 const app = read("app.js");
 assert.ok(app.includes("window.invalidateGlobalCustomContentLoad = function(clearContent)"));
 assert.ok(app.includes("requestId === window._customContentLoadRequestId"));
 assert.ok(app.includes("currentToken === token"));
 assert.ok(app.includes("currentIdentity.email"));
 assert.ok(app.includes("window.invalidateGlobalCustomContentLoad(true)"));
});

test("custom content upserts serialize duplicate-ID checks and writes", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function saveCustomContent_(data)");
 const end = server.indexOf("\nfunction deleteCustomContent_(data)", start);
 assert.ok(start >= 0 && end > start);
 const save = server.slice(start, end);
 const lock = save.indexOf("LockService.getScriptLock()");
 const wait = save.indexOf("lock.waitLock(10000)");
 const readIndex = save.indexOf("sheet.getDataRange().getValues()");
 const write = Math.max(save.indexOf("sheet.getRange(targetRow"), save.indexOf("sheet.appendRow(row)"));
 const release = save.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock, "acquire a script-wide lock before reading");
 assert.ok(readIndex > wait && write > readIndex, "keep duplicate lookup and write inside the lock");
 assert.ok(release > write && save.includes("finally {"), "release the lock even when a save fails");
});

test("custom content deletion shares the upsert lock", () => {
 const server = read("Code.gs");
 const start = server.indexOf("function deleteCustomContent_(data)");
 const end = server.indexOf("\n/* ---------- Administrator", start);
 assert.ok(start >= 0 && end > start);
 const remove = server.slice(start, end);
 const lock = remove.indexOf("LockService.getScriptLock()");
 const wait = remove.indexOf("lock.waitLock(10000)");
 const readIndex = remove.indexOf("sheet.getDataRange().getValues()");
 const deletion = remove.indexOf("sheet.deleteRow(");
 const release = remove.indexOf("lock.releaseLock()");
 assert.ok(lock >= 0 && wait > lock && readIndex > wait && deletion > readIndex);
 assert.ok(release > deletion && remove.includes("finally {"), "delete must release the shared lock");
});
