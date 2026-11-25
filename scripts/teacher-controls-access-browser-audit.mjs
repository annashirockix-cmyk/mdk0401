import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1360, height: 950 } });
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.stack || error.message));
try {
  const response = await page.goto(process.env.PORTAL_AUDIT_URL || "http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), "Portal did not load");
  await page.evaluate(() => {
    document.body.innerHTML = '<div id="crumbs"></div><main id="app"></main>';
    window.state = { staff: { name: "Преподаватель аудита", email: "teacher-audit@example.invalid", role: "teacher", courses: ["07.01"] }, student: null, activeCourseId: "07.01" };
    window.MDK_DATA = { "07.01": { id: "07.01", title: "МДК 07.01", sections: [{ topics: [{ id: "topic-access-audit", code: "1.1", title: "Основы ЧПУ", test: [{ question: "Тест" }] }] }] } };
    window.customContent = { lectures: [], tests: [], flashcards: [], games: [], files: [], announcements: [] };
    window.loadGlobalCustomContent = callback => callback();
    window.__topicOpen = true;
    window.__accessCalls = [];
    window.API = {
      getTopicAccess: async () => ({ open: window.__topicOpen }),
      setTopicAccess: async (courseId, topicId, open) => {
        window.__accessCalls.push({ courseId, topicId, open });
        window.__topicOpen = open;
        return { success: true };
      },
      getStudents: async () => ({ success: true, students: [{ name: "Иван Иванов", email: "ivan@example.invalid", group: "ТМ 4-3", role: "student", courses: ["07.01"] }] }),
      getNotifications: async () => ({ success: true, notifications: [] })
    };
  });

  await page.evaluate(() => window.renderTeacherControlsPage());
  await page.waitForSelector(".topic-access-row");
  const row = page.locator(".topic-access-row");
  assert.match(await row.innerText(), /Доступна студентам/);
  await row.locator(".topic-close-action").click();
  await page.waitForFunction(() => document.querySelector(".topic-access-status")?.textContent === "Закрыта для студентов");
  assert.equal(await row.locator(".topic-close-action").isDisabled(), true);
  assert.equal(await row.locator(".topic-open-action").isDisabled(), false);
  await row.locator(".topic-open-action").click();
  await page.waitForFunction(() => document.querySelector(".topic-access-status")?.textContent === "Доступна студентам");
  assert.equal(await row.locator(".topic-open-action").isDisabled(), true);
  assert.equal(await row.locator(".topic-close-action").isDisabled(), false);

  const calls = await page.evaluate(() => window.__accessCalls);
  assert.deepEqual(calls, [
    { courseId: "07.01", topicId: "topic-access-audit", open: false },
    { courseId: "07.01", topicId: "topic-access-audit", open: true }
  ]);

  await page.evaluate(() => {
    window.state.staff = null;
    window.state.student = { name: "Иван Иванов", email: "ivan@example.invalid", role: "student", courses: ["07.01"] };
    window.renderTeacherControlsPage();
  });
  assert.match(await page.locator("#app").innerText(), /только преподавателям/);
  assert.deepEqual(pageErrors, [], "Browser errors: " + pageErrors.join("\n"));
  console.log(JSON.stringify({ topicClosedAndReopened: true, serverCalls: calls.length, studentRoleBlocked: true, pageErrors }, null, 2));
} finally {
  await browser.close();
}
