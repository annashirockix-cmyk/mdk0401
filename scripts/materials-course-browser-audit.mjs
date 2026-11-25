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
  const courseAudit = await page.evaluate(() => {
    const topics = window.MDK_DATA.MAT.sections.flatMap(section => section.topics || []);
    const rewritten = topics.filter(topic => topic.lectures && topic.lectures[0] && topic.lectures[0].content.includes("Словарь простыми словами"));
    const hasPractice = topics.every(topic => Array.isArray(topic.practicals) && topic.practicals.length > 0);
    const hasSelfWork = topics.every(topic => Array.isArray(topic.selfWork) && topic.selfWork.length > 0);
    const hasTests = topics.every(topic => Array.isArray(topic.test) && topic.test.length > 0);
    return { total: topics.length, rewritten: rewritten.length, hasPractice, hasSelfWork, hasTests };
  });
  assert.equal(courseAudit.total, 11, "all 11 course topics must be present");
  assert.equal(courseAudit.rewritten, 11, "all 11 lectures must use the simplified version");
  assert.ok(courseAudit.hasPractice, "practical work must remain available");
  assert.ok(courseAudit.hasSelfWork, "self-study work must remain available");
  assert.ok(courseAudit.hasTests, "topic tests must remain available");

  // Exercise the actual student topic renderer instead of injecting lecture HTML into the page.
  const rendered = await page.evaluate(() => {
    window.state = { results: {} };
    window.unlockAchievement = () => {};
    window.renderTopicPage("MAT", "mat-t1", "lectures");
    const article = document.querySelector("#topicContent .mat-easy-lecture");
    const lectureText = article ? article.innerText : "";
    const tabs = {
      lectures: !!document.querySelector("#tab-lectures"),
      practicals: !!document.querySelector("#tab-practicals"),
      selfwork: !!document.querySelector("#tab-selfwork"),
      test: !!document.querySelector("#tab-test")
    };
    const headings = ["После изучения темы вы сможете", "Главная схема темы", "Словарь простыми словами", "Проверьте себя"];
    const headingChecks = Object.fromEntries(headings.map(label => [label, lectureText.includes(label)]));
    return { articleFound: !!article, lectureText, tabs, headingChecks };
  });
  assert.ok(rendered.articleFound, "student topic renderer must display the rewritten lecture");
  for (const [heading, found] of Object.entries(rendered.headingChecks)) assert.ok(found, "rendered lecture is missing: " + heading);
  assert.ok(rendered.tabs.lectures && rendered.tabs.practicals && rendered.tabs.selfwork && rendered.tabs.test,
    "student topic page must expose lecture, practical, self-study and test tabs");

  for (const tab of ["practicals", "selfwork", "test"]) {
    const tabResult = await page.evaluate(name => {
      window.switchTopicTab(name);
      const content = document.getElementById("topicContent");
      return { text: content ? content.innerText.trim() : "", hasContent: !!(content && content.children.length) };
    }, tab);
    assert.ok(tabResult.hasContent && tabResult.text.length > 0, "student " + tab + " tab must render content");
  }
  await page.evaluate(() => window.switchTopicTab("lectures"));

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.locator("#topicContent .mat-easy-lecture").evaluate(root => ({
      viewportWidth: document.documentElement.clientWidth,
      articleWidth: root.getBoundingClientRect().width,
      articleScrollWidth: root.scrollWidth,
      articleClientWidth: root.clientWidth,
      fontSize: parseFloat(getComputedStyle(root).fontSize),
      tableScrollWidth: root.querySelector("table") ? root.querySelector("table").scrollWidth : 0,
      tableClientWidth: root.querySelector("table") ? root.querySelector("table").clientWidth : 0
    }));
    assert.ok(layout.articleWidth <= width + 1, "rendered lecture exceeds viewport at " + width + "px");
    assert.ok(layout.articleScrollWidth <= layout.articleClientWidth + 1, "rendered lecture has horizontal overflow at " + width + "px");
    assert.ok(layout.tableScrollWidth <= layout.tableClientWidth + 1, "glossary table has horizontal overflow at " + width + "px");
    assert.ok(layout.fontSize >= 16, "lecture text should remain comfortably readable");
  }
  console.log("Materials science student browser audit passed: 11/11 rewritten lectures, real topic renderer, all four learning tabs, 320–1440px layout.");
  await page.close();
} finally { await browser.close(); }
