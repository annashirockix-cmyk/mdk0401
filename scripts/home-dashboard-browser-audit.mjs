import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const dashboard = fs.readFileSync(new URL("../home-dashboard.js", import.meta.url), "utf8");
const portalCss = fs.readFileSync(new URL("../portal-ux.css", import.meta.url), "utf8");
const browser = await chromium.launch({ headless: true });

async function render(state, width = 390) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  await page.setContent('<main id="app" tabindex="-1"><section class="hero"><h1>Учебный портал</h1></section></main>');
  await page.addStyleTag({ content: portalCss + "\nbody{margin:0}" });
  await page.evaluate(value => {
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
  assert.ok(studentLinks.includes("#/topic/07.01/topic-1"));
  assert.ok(studentLinks.includes("#/grades") && studentLinks.includes("#/teacher-tasks") && studentLinks.includes("#/laboratory"));
  assert.ok(!studentLinks.includes("#/journal") && !studentLinks.includes("#/admin") && !studentLinks.includes("#/course-editor"));
  await student.evaluate(() => window.renderHomePage());
  assert.equal(await student.locator("#homeDashboard").count(), 1, "dashboard must not duplicate after returning home");
  await student.close();

  const teacher = await render({ staff: { role: "teacher", courses: ["07.01"] }, activeCourseId: "07.01" });
  const teacherLinks = await teacher.locator("#homeDashboard a").evaluateAll(nodes => nodes.map(a => a.getAttribute("href")));
  assert.ok(teacherLinks.includes("#/teacher-dashboard") && teacherLinks.includes("#/journal") && teacherLinks.includes("#/course-editor"));
  assert.ok(teacherLinks.includes("#/question-bank"));
  assert.ok(!teacherLinks.includes("#/admin"), "teacher must not see admin shortcut");
  assert.ok(!teacherLinks.includes("#/tutoring"), "tutoring is a home-screen card, not a dashboard shortcut");
  await teacher.close();

  const admin = await render({ staff: { role: "admin", courses: [] }, activeCourseId: "07.01" });
  const adminLinks = await admin.locator("#homeDashboard a").evaluateAll(nodes => nodes.map(a => a.getAttribute("href")));
  assert.ok(adminLinks.includes("#/admin") && adminLinks.includes("#/teacher-dashboard"));
  await admin.close();

  for (const viewport of [
    { width: 320, columns: 1 },
    { width: 390, columns: 1 },
    { width: 600, columns: 2 },
    { width: 768, columns: 3 },
    { width: 1440, columns: 3 }
  ]) {
    const page = await render({ student: { role: "student" }, activeCourseId: "07.01" }, viewport.width);
    const layout = await page.locator("#homeDashboard").evaluate(root => {
      const grid = root.querySelector(".home-dashboard-grid");
      const rect = root.getBoundingClientRect();
      return {
        columns: getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length,
        left: rect.left,
        right: rect.right,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        actionsInside: Array.from(root.querySelectorAll(".home-dashboard-action")).every(node => {
          const item = node.getBoundingClientRect();
          return item.left >= -1 && item.right <= window.innerWidth + 1;
        })
      };
    });
    assert.equal(layout.columns, viewport.columns, "unexpected column count at " + viewport.width + "px");
    assert.ok(layout.left >= -1 && layout.right <= viewport.width + 1, "dashboard exceeds viewport at " + viewport.width + "px");
    assert.ok(layout.scrollWidth <= layout.viewportWidth + 1, "horizontal overflow at " + viewport.width + "px");
    assert.ok(layout.actionsInside, "dashboard action exceeds viewport at " + viewport.width + "px");
    await page.close();
  }
  console.log("Home dashboard browser audit passed: role visibility, duplicate prevention and 320/390/600/768/1440px layouts.");
} finally {
  await browser.close();
}
