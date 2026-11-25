import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const dashboard = fs.readFileSync(new URL("../home-dashboard.js", import.meta.url), "utf8");
const browser = await chromium.launch({ headless: true });
async function render(state) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.setContent('<main id="app" tabindex="-1"><section class="hero"><h1>Учебный портал</h1></section></main>');
  await page.evaluate((value) => {
    window.state = value;
    window.MDK_DATA = { "07.01": { shortName: "МДК 07.01", sections: [{ topics: [{ id: "topic-1" }] }] } };
    window.renderHomePage = function () {
      document.getElementById("app").innerHTML = '<section class="hero"><h1>Учебный портал</h1></section>';
    };
  }, state);
  await page.addScriptTag({ content: dashboard });
  await page.evaluate(() => window.renderHomePage());
  return page;
}
try {
  const student = await render({ student: { role: "student" }, activeCourseId: "07.01" });
  const studentLinks = await student.locator("#homeDashboard a").evaluateAll(nodes => nodes.map(a => a.getAttribute("href")));
  assert.ok(studentLinks.includes("#/topic/07.01/topic-1"), "student should get a link to the current course topic");
  assert.ok(studentLinks.includes("#/grades") && studentLinks.includes("#/teacher-tasks") && studentLinks.includes("#/laboratory"));
  assert.ok(!studentLinks.includes("#/journal") && !studentLinks.includes("#/admin") && !studentLinks.includes("#/course-editor"));
  await student.close();

  const teacher = await render({ staff: { role: "teacher", courses: ["07.01"] }, activeCourseId: "07.01" });
  const teacherLinks = await teacher.locator("#homeDashboard a").evaluateAll(nodes => nodes.map(a => a.getAttribute("href")));
  assert.ok(teacherLinks.includes("#/teacher-dashboard") && teacherLinks.includes("#/journal") && teacherLinks.includes("#/course-editor"));
  assert.ok(teacherLinks.includes("#/question-bank"));
  assert.ok(!teacherLinks.includes("#/tutoring"), "Tutoring is now a home-screen card, not a dashboard route shortcut");
  assert.ok(!teacherLinks.includes("#/admin"), "teacher must not see admin shortcut");
  await teacher.close();

  const admin = await render({ staff: { role: "admin", courses: [] }, activeCourseId: "07.01" });
  const adminLinks = await admin.locator("#homeDashboard a").evaluateAll(nodes => nodes.map(a => a.getAttribute("href")));
  assert.ok(adminLinks.includes("#/admin"), "admin should see administration shortcut");
  assert.ok(adminLinks.includes("#/teacher-dashboard"));
  await admin.close();
  console.log("Home dashboard browser audit passed: student, teacher and admin action visibility.");
} finally {
  await browser.close();
}
