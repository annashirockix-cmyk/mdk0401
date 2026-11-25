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
    window.__gradeCalls = [];
    window.__assignments = [{
      id: "assignment-audit-1", courseId: "07.01", title: "Проверка программы ЧПУ", topic: "Линейная интерполяция",
      level: "Средний", workType: "Практическое задание", instructions: "Составить безопасный фрагмент УП.",
      criteria: "Корректность — 5 баллов", targetType: "group", targetValue: "ТМ 4-3",
      status: "active", createdAt: "2026-11-20T10:00:00.000Z", dueAt: "2026-11-30",
      submissions: [
        { id: "submission-retry", studentName: "Иван Иванов", studentEmail: "ivan@example.invalid", group: "ТМ 4-3", answer: "G01 X20 Z-10 F0.2", submittedAt: "2026-11-24T10:00:00.000Z", status: "submitted", grade: null, feedback: "", attempts: 1, history: [] },
        { id: "submission-pass", studentName: "Пётр Петров", studentEmail: "petr@example.invalid", group: "ТМ 4-3", answer: "G01 X30 Z-15 F0.25", submittedAt: "2026-11-24T11:00:00.000Z", status: "submitted", grade: null, feedback: "", attempts: 1, history: [] }
      ]
    }];
    window.API = {
      getStudents: async () => ({ success: true, students: [
        { name: "Иван Иванов", email: "ivan@example.invalid", group: "ТМ 4-3", role: "student", courses: ["07.01"] },
        { name: "Пётр Петров", email: "petr@example.invalid", group: "ТМ 4-3", role: "student", courses: ["07.01"] }
      ] }),
      getAssignments: async () => ({ success: true, assignments: JSON.parse(JSON.stringify(window.__assignments)) }),
      gradeAssignment: async (id, grade, feedback, regrade) => {
        window.__gradeCalls.push({ id, grade: Number(grade), feedback, regrade });
        const submission = window.__assignments[0].submissions.find(x => x.id === id);
        if (!submission) return { success: false, error: "Ответ не найден" };
        submission.status = "reviewed";
        submission.grade = Number(grade);
        submission.feedback = feedback;
        return { success: true, retrySuggested: Number(grade) <= 2 };
      }
    };
  });

  await page.evaluate(() => window.renderTeacherTasksPage());
  await page.waitForFunction(() => document.querySelectorAll("#taList form.taGrade").length === 2);
  const forms = page.locator("#taList form.taGrade");
  await forms.nth(0).locator('select[name="grade"]').selectOption("2");
  await forms.nth(0).locator('input[name="feedback"]').fill("Нужно исправить подачу и проверить безопасность.");
  await forms.nth(1).locator('select[name="grade"]').selectOption("5");
  await forms.nth(1).locator('input[name="feedback"]').fill("Программа выполнена корректно.");
  await forms.nth(0).locator('button[type="submit"]').click();
  await page.waitForFunction(() => window.__gradeCalls.length === 1);
  await page.waitForFunction(() => document.querySelectorAll("#taList form.taGrade").length === 2);
  await forms.nth(0).locator('button[type="submit"]').click();
  await page.waitForFunction(() => window.__gradeCalls.length === 2);
  await page.waitForFunction(() => document.querySelectorAll("#taList form.taGrade").length === 0);

  const summary = await page.locator("#taList").innerText();
  assert.match(summary, /Иван Иванов/);
  assert.match(summary, /Пётр Петров/);
  assert.match(summary, /Требуется доработка/);
  assert.match(summary, /Проверено/);
  const calls = await page.evaluate(() => window.__gradeCalls);
  assert.deepEqual(calls.map(x => [x.id, x.grade]), [["submission-retry", 2], ["submission-pass", 5]]);
  assert.equal(calls[0].feedback, "Нужно исправить подачу и проверить безопасность.");
  assert.equal(calls[1].feedback, "Программа выполнена корректно.");
  assert.deepEqual(pageErrors, [], "Browser errors: " + pageErrors.join("\n"));
  console.log(JSON.stringify({ reviewedSubmissions: calls.length, retryGrade: calls[0].grade, acceptedGrade: calls[1].grade, feedbackPreserved: calls.every(x => !!x.feedback), pageErrors }, null, 2));
} finally {
  await browser.close();
}
