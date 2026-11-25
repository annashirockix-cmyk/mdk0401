import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.stack || error.message));
try {
  const response = await page.goto(process.env.PORTAL_AUDIT_URL || "http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), "Portal did not load");
  await page.evaluate(() => {
    document.body.innerHTML = '<div id="crumbs"></div><main id="app"></main>';
    window.state = { staff: { name: "Аудит преподавателя", email: "journal-audit@example.invalid", role: "teacher", courses: ["07.01"] }, student: null, activeCourseId: "07.01" };
    window.MDK_DATA = { "07.01": { id: "07.01", title: "МДК 07.01", sections: [{ topics: [{ id: "topic-audit-1", code: "1.1", title: "Основы ЧПУ", practicals: [{ code: "ПР-1" }], selfWork: [{ code: "СР-1" }], test: [{ question: "Тест" }] }] }] } };
    window.__savedGrades = [];
    window.__toasts = [];
    window.showToast = (message, type) => window.__toasts.push({ message, type });
    window.API = {
      getStudents: async () => ({ success: true, students: [
        { name: "Иван Иванов", email: "ivan@example.invalid", group: "ТМ 4-3", role: "student", courses: ["07.01"], payload: "{}" },
        { name: "Пётр Петров", email: "petr@example.invalid", group: "ТМ 4-3", role: "student", courses: ["07.01"], payload: "{}" },
        { name: "Служебная запись", email: "staff@example.invalid", group: "", role: "teacher", courses: ["07.01"], payload: "{}" }
      ] }),
      getResults: async () => ({ success: true, results: [
        { email: "ivan@example.invalid", name: "Иван Иванов", group: "ТМ 4-3", testId: "test_topic-audit-1", testTitle: "Контрольный тест 1", grade: 5, score: 9, maxScore: 10, percent: 90, attempts: 2, finishedAt: "2026-11-24T10:00:00.000Z", courseId: "07.01" },
        { email: "petr@example.invalid", name: "Пётр Петров", group: "ТМ 4-3", testId: "test_topic-audit-1", testTitle: "Контрольный тест 1", grade: 3, score: 6, maxScore: 10, percent: 60, attempts: 1, finishedAt: "2026-11-24T11:00:00.000Z", courseId: "07.01" },
        { email: "ivan@example.invalid", name: "Иван Иванов", group: "ТМ 4-3", testId: "manual_2026-11-24", testTitle: "Оценка за занятие", grade: 4, score: 4, maxScore: 5, percent: 80, attempts: 1, finishedAt: "2026-11-24T12:00:00.000Z", courseId: "07.01", feedback: "Активная работа" }
      ] }),
      getAssignments: async () => ({ success: true, assignments: [
        { id: "assignment-audit", courseId: "07.01", title: "Практическая работа: наладка", status: "active", targetType: "group", targetValue: "ТМ 4-3", submissions: [{ studentEmail: "ivan@example.invalid", status: "reviewed", grade: 5 }, { studentEmail: "petr@example.invalid", status: "submitted" }] }
      ] }),
      saveManualGrade: async data => { window.__savedGrades.push(data); return { success: true }; },
      getActivityLog: async () => ({ success: true, total: 2, events: [
        { createdAt: "2026-11-24T09:00:00.000Z", name: "Иван Иванов", email: "ivan@example.invalid", group: "ТМ 4-3", courseId: "07.01", eventType: "page_view", details: "Открыл тему", pageTitle: "Основы ЧПУ", route: "#/topic/07.01/topic-audit-1" },
        { createdAt: "2026-11-24T09:10:00.000Z", name: "Пётр Петров", email: "petr@example.invalid", group: "ТМ 4-3", courseId: "07.01", eventType: "session_start", details: "Вход в портал", pageTitle: "Главная", route: "#/" }
      ] })
    };
  });

  await page.evaluate(() => window.renderJournalPage());
  await page.waitForSelector("#journalContent table tbody tr");
  const journalText = await page.locator("#journalContent").innerText();
  assert.match(journalText, /Иван Иванов/);
  assert.match(journalText, /Пётр Петров/);
  assert.match(journalText, /ПР-1/);

  await page.locator("#tabManual").click();
  await page.locator("#manualDate").fill("2026-11-24");
  await page.locator("#loadManualBtn").click();
  await page.waitForSelector("#saveManualBtn");
  await page.locator("#manualGrade_0").fill("4");
  await page.locator("#manualFeedback_0").fill("Проверено в браузерном аудите");
  await page.locator("#saveManualBtn").click();
  await page.waitForFunction(() => window.__savedGrades.length === 2);
  const saved = await page.evaluate(() => window.__savedGrades);
  assert.equal(saved[0].courseId, "07.01");
  assert.equal(saved[0].grade, 4);
  assert.equal(saved[0].feedback, "Проверено в браузерном аудите");
  assert.equal(saved.length, 2);

  await page.evaluate(() => window.renderCourseReportsPage());
  await page.waitForFunction(() => document.querySelectorAll("#repTbody tr").length > 0 && document.querySelector("#activityLogList")?.innerText.includes("Открыл тему"));
  const reportText = await page.locator("#repTbody").innerText();
  assert.match(reportText, /Иван Иванов/);
  assert.match(reportText, /Контрольный тест 1/);
  assert.match(await page.locator("#activityLogList").innerText(), /Открыл тему/);
  await page.locator("#repFilterGroup").selectOption("ТМ 4-3");
  await page.waitForTimeout(100);
  assert.match(await page.locator("#repTbody").innerText(), /Пётр Петров/);

  const reportDownload = page.waitForEvent("download");
  await page.locator("#repExport").click();
  const reportFile = await reportDownload;
  assert.equal(reportFile.suggestedFilename(), "rezultaty-studentov.csv");
  const activityDownload = page.waitForEvent("download");
  await page.locator("#activityExport").click();
  const activityFile = await activityDownload;
  assert.equal(activityFile.suggestedFilename(), "istoriya-deistviy.csv");
  assert.deepEqual(pageErrors, [], "Browser errors: " + pageErrors.join("\n"));
  console.log(JSON.stringify({ journal: { studentRows: 2, manualGradeWrites: saved.length, feedbackPreserved: saved[0].feedback }, reports: { resultsVisible: true, activityEventsVisible: 2, exports: [reportFile.suggestedFilename(), activityFile.suggestedFilename()] }, pageErrors }, null, 2));
} finally {
  await browser.close();
}
