import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.stack || error.message));
try {
  const response = await page.goto(process.env.PORTAL_AUDIT_URL || "http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), "Portal did not load");
  await page.evaluate(() => {
    document.body.innerHTML = '<div id="crumbs"></div><main id="app"><section id="topicContent" data-proctor-assessment="1" data-test-id="test-audit-01"><h2>Контрольная попытка</h2><label><input type="radio" name="q1" value="a">Вариант А</label></section></main>';
    window.state = { student: { name: "Студент аудита", email: "student-audit@example.invalid", group: "ТМ 4-3" }, staff: null, activeCourseId: "07.01", activeTopicId: "topic-audit" };
    window._activeAssessmentCourseId = "07.01";
    window.__proctorEvents = [];
    window.API = {
      logProctorEvent: async data => {
        window.__proctorEvents.push(data);
        const count = window.__proctorEvents.length;
        return { success: true, action: count === 1 ? "warning" : "sanction", penaltyPoints: 10, reportSent: true };
      }
    };
  });
  await page.waitForFunction(() => document.getElementById("topicContent")?.classList.contains("notranslate"));
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await page.waitForFunction(() => window.__proctorEvents.some(x => x.eventType === "window_blur"));
  await page.waitForSelector(".proctor-dialog");
  assert.match(await page.locator(".proctor-dialog").innerText(), /Первое предупреждение/);
  await page.locator(".proctor-dialog button").click();
  await page.evaluate(() => document.dispatchEvent(new Event("copy", { bubbles: true })));
  await page.waitForFunction(() => window.__proctorEvents.some(x => x.eventType === "copy_attempt"));
  await page.waitForSelector(".proctor-dialog");
  assert.match(await page.locator(".proctor-dialog").innerText(), /штраф 10 процентных пунктов/);
  const events = await page.evaluate(() => window.__proctorEvents);
  assert.deepEqual(events.map(x => x.eventType), ["window_blur", "copy_attempt"]);
  assert.ok(events.every(x => x.courseId === "07.01" && x.testId === "test-audit-01"));
  await page.locator(".proctor-dialog button").click();
  assert.deepEqual(pageErrors, [], "Browser errors: " + pageErrors.join("\n"));
  console.log(JSON.stringify({ loggedEvents: events.map(x => x.eventType), warningShown: true, sanctionShown: true, courseId: events[0].courseId, testId: events[0].testId, pageErrors }, null, 2));
} finally {
  await browser.close();
}
