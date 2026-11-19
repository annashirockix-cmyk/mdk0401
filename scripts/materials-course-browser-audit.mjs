import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const baseUrl = process.env.MATERIALS_AUDIT_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), "Portal did not load: " + (response && response.status()));
  await page.waitForFunction(() => window.MDK_DATA && window.MDK_DATA.MAT && window.MDK_DATA.MAT.studentFriendlyVersion === 1);
  const result = await page.evaluate(() => {
    const topics = window.MDK_DATA.MAT.sections.flatMap(section => section.topics || []);
    const rewritten = topics.filter(topic => topic.lectures && topic.lectures[0] && topic.lectures[0].content.includes("Словарь простыми словами"));
    return { total: topics.length, rewritten: rewritten.length, hasPractice: topics.every(topic => Array.isArray(topic.practicals) && topic.practicals.length > 0), hasTests: topics.every(topic => Array.isArray(topic.test) && topic.test.length > 0), sample: rewritten[0] && rewritten[0].lectures[0].content };
  });
  assert.equal(result.total, 11, "all 11 course topics must be present");
  assert.equal(result.rewritten, 11, "all 11 lectures must use the simplified version");
  assert.ok(result.hasPractice, "practical work must remain available");
  assert.ok(result.hasTests, "topic tests must remain available");
  await page.locator("#app").evaluate((app, html) => { app.innerHTML = '<div id="materialsPreview">' + html + "</div>"; }, result.sample);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.locator("#materialsPreview").evaluate(root => ({ contentWidth: root.getBoundingClientRect().width, contentScrollWidth: root.scrollWidth, contentClientWidth: root.clientWidth, fontSize: parseFloat(getComputedStyle(root.querySelector(".mat-easy-lecture")).fontSize) }));
    assert.ok(layout.contentWidth <= width + 1, "materials content exceeds viewport at " + width + "px");
    assert.ok(layout.contentScrollWidth <= layout.contentClientWidth + 1, "materials content has internal horizontal overflow at " + width + "px");
    assert.ok(layout.fontSize >= 16, "lecture text should remain comfortably readable");
  }
  await page.close();
  console.log("Materials science student-friendly browser audit passed: 11/11 lectures, practice and tests retained, 320–1440px layout.");
} finally { await browser.close(); }
