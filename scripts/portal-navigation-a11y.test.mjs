import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("drawer navigation exposes an accessible open and close state", () => {
  assert.match(html, /aria-controls="drawer" aria-expanded="false"/);
  assert.match(app, /burgerBtn\.setAttribute\("aria-label", "Закрыть навигацию"\)/);
  assert.match(app, /burgerBtn\.setAttribute\("aria-label", "Открыть навигацию"\)/);
  assert.match(app, /drawer\.setAttribute\("aria-hidden", "false"\)/);
  assert.match(app, /drawer\.setAttribute\("aria-hidden", "true"\)/);
});

test("drawer locks background scrolling and keeps keyboard focus inside while open", () => {
  assert.match(app, /document\.body\.style\.overflow = "hidden"/);
  assert.match(app, /document\.body\.style\.overflow = previousBodyOverflow/);
  assert.match(app, /function keepFocusInside\(event\)/);
  assert.match(app, /keepFocusInside\(event\)/);
  assert.match(app, /event\.shiftKey.*first.*last/s);
});

test("drawer restores focus after overlay close and moves focus to content after navigation", () => {
  assert.match(app, /drawerOverlay\.onclick = function\(\) \{ closeDrawer\(true\); \}/);
  assert.match(app, /var main = document\.getElementById\("app"\);\s*if \(main\) main\.focus\(\)/);
  assert.match(app, /if \(event\.key === "Escape" && drawer\.classList\.contains\("open"\)\)/);
});

test("long lecture lists open compactly and provide accessible full-text search", () => {
  assert.match(app, /Поиск по лекциям темы/);
  assert.match(app, /Найти лекцию по названию или тексту/);
  assert.match(app, /card\.textContent[\s\S]*toLocaleLowerCase\("ru-RU"\)/);
  assert.match(app, /details\.open = lectureCards\.length === 0/);
  assert.match(app, /lectureSearchCount\.textContent = visible \+ " из " \+ lectureCards\.length/);
});

test("course navigation escapes dynamic labels and encodes topic route segments", () => {
  assert.match(app, /var escapeText = window\.escapeHtml/);
  assert.match(app, /escapeText\(section\.title\)/);
  assert.match(app, /escapeText\(topic\.title\)/);
  assert.match(app, /escapeText\(topic\.code\)/);
  assert.match(app, /encodeURIComponent\(mdkId\).*encodeURIComponent\(topic\.id\)/);
  assert.match(app, /data-course-id=/);
  assert.doesNotMatch(app, /onclick="window\.state\.activeCourseId=/);
});

test("topic headings render dynamic topic names as text nodes", () => {
  assert.match(app, /topicHeading\.textContent = String\(topic\.code/);
  assert.doesNotMatch(app, /neon-text">\$\{topic\.code\} \$\{topic\.title\}/);
});
