import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const js = readFileSync(new URL("../lecture-word-ribbon.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../lecture-word-ribbon.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const sw = readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");

test("lecture editor adds Word-like Home, Insert and Layout ribbon tabs", () => {
  for (const tab of ["Главная", "Вставка", "Макет и правка"]) assert.ok(js.includes(tab));
  for (const command of ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList", "justifyFull", "createLink", "insertHorizontalRule"]) assert.ok(js.includes(command));
});

test("lecture editor supports font, color, tables, images and headings", () => {
  for (const feature of ["lerFont", "lerSize", "lerColor", "lerHighlight", "insertTable", "insertImage", "insertVideo", "recordVideo", "MediaRecorder", "youtube-nocookie.com", "lecture-content-table", "formatBlock"]) assert.ok(js.includes(feature));
});

test("the editor preserves the existing lectureBody value contract for loading and saving", () => {
  assert.match(js, /Object\.defineProperty\(editor,"value"/);
  assert.match(js, /Object\.defineProperty\(source,"value"/);
  assert.match(js, /source\.value=editor\.innerHTML/);
  assert.match(js, /editor\.innerHTML=String\(v\|\|""\)/);
});

test("ribbon assets are loaded and included in offline cache", () => {
  assert.match(html, /lecture-word-ribbon\.css/);
  assert.match(html, /lecture-word-ribbon\.js/);
  assert.match(sw, /'\.\/lecture-word-ribbon\.js'/);
  assert.match(sw, /'\.\/lecture-word-ribbon\.css'/);
});

test("Word-like document page has readable paper layout and responsive styles", () => {
  assert.match(css, /\.lecture-word-page/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /overflow-wrap:anywhere/);
  assert.match(css, /\.lecture-video/);
  assert.match(css, /\.ler-recorder/);
});

test("student lecture rendering preserves safe Word formatting but strips unsafe styles", () => {
  assert.match(app, /function safeLectureHtml|function safeCustomLectureHtml/);
  assert.match(app, /function safeLectureStyle/);
  assert.match(app, /font-size/);
  assert.match(app, /font-family/);
  assert.match(app, /background-color/);
  assert.match(app, /text-align/);
  assert.match(app, /node\.removeAttribute\(attr\.name\)/);
  assert.match(app, /noopener noreferrer/);
  assert.ok(app.includes("youtube-nocookie") && app.includes("embed"));
  assert.match(app, /node\.tagName === "VIDEO"/);
  assert.match(app, /node\.tagName === "IFRAME"/);
  assert.match(app, /sandbox.*allow-scripts allow-same-origin allow-presentation/);
});
