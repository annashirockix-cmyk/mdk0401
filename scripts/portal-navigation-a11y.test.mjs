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
