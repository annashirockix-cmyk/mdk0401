import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const baseUrl = process.env.CONSTRUCTOR_AUDIT_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", error => console.log("PAGE_ERROR", error.stack || error.message));
page.on("console", message => { if (message.type() === "error") console.log("PAGE_CONSOLE_ERROR", message.text()); });
try {
  const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), `Portal did not load: ${response?.status()}`);
  await page.waitForFunction(() => typeof window.renderCourseEditorPage === "function" &&
    typeof window.renderFlashcardEditorPage === "function" && window.MDK_DATA && window.MDK_DATA["07.01"]);
  await page.evaluate(() => {
    document.getElementById("loginOverlay")?.remove();
    window.state = { staff: { role: "teacher", courses: ["07.01"], email: "audit-teacher@example.invalid" },
      student: null, activeCourseId: "07.01", results: {}, xp: 0 };
    window.__constructorStore = [];
    window.customContent = { topics: [], lectures: [], tests: [], flashcards: [], files: [] };
    function sync() {
      const rows = window.__constructorStore;
      window.customContent.topics = rows.filter(x => x.type === "topic");
      window.customContent.lectures = rows.filter(x => x.type === "lecture");
      window.customContent.tests = rows.filter(x => x.type === "test");
      window.customContent.flashcards = rows.filter(x => x.type === "flashcards");
    }
    window.API = {
      getCustomContent: async () => ({ success: true, data: window.__constructorStore.map(x => ({ ...x })) }),
      saveCustomContent: async item => {
        const at = window.__constructorStore.findIndex(x => String(x.id) === String(item.id));
        if (at >= 0) window.__constructorStore[at] = { ...item };
        else window.__constructorStore.push({ ...item });
        sync();
        return { success: true, data: item };
      },
      deleteCustomContent: async id => {
        window.__constructorStore = window.__constructorStore.filter(x => String(x.id) !== String(id));
        sync();
        return { success: true };
      },
      getTopicAccess: async () => ({ open: true }),
      getTestAttemptStatus: async () => ({ allowed: true, used: 0, limit: 1 })
    };
    window.loadGlobalCustomContent = callback => { sync(); if (callback) callback(); };
    window.showToast = message => { window.__auditToast = String(message); };
    window.saveStudentData = () => {};
    window.unlockAchievement = () => {};
    window.confirm = () => true;
  });

  await page.evaluate(() => window.renderCourseEditorPage());
  await page.waitForSelector("#createTopicBtn");
  await page.locator("#newTopicCode").fill("AUDIT");
  await page.locator("#newTopicTitle").fill("Проверка конструктора");
  await page.locator("#createTopicBtn").click();
  await page.waitForFunction(() => document.getElementById("topicStatus")?.textContent.includes("Тема создана"));
  const topicId = await page.locator("#lectureTopic").inputValue();
  assert.ok(topicId.startsWith("custom-"), "New topic was not added to the editor selectors");

  await page.locator("#lectureTitle").fill("Тестовая лекция конструктора");
  await page.locator("#lectureBody").fill("<h3>Проверка отображения</h3><p>Содержимое тестовой лекции.</p>");
  await page.locator("#saveLectureBtn").click();
  await page.waitForFunction(() => document.getElementById("lectureStatus")?.textContent.includes("Лекция сохранена"));

  await page.locator("#testTitle").fill("Тест конструктора");
  await page.locator("#qText").fill("Какой вариант правильный?");
  await page.locator("#qA").fill("Неверно");
  await page.locator("#qB").fill("Верно");
  await page.locator("#qC").fill("Не подходит");
  await page.locator("#qD").fill("Нет ответа");
  await page.locator("#qCorrect").selectOption("1");
  await page.locator("#addQuestionBtn").click();
  await page.locator("#saveTestBtn").click();
  await page.waitForFunction(() => document.getElementById("testStatus")?.textContent.includes("Тест сохранён"));
  assert.ok((await page.locator("#savedMaterials").innerText()).includes("Тест конструктора"));
  assert.ok((await page.locator("#savedMaterials").innerText()).includes("Тестовая лекция конструктора"));

  await page.evaluate(() => window.renderFlashcardEditorPage());
  await page.waitForSelector("#fcTopic");
  await page.locator("#fcTopic").selectOption(topicId);
  await page.locator("#fcTitle").fill("Карточки конструктора");
  await page.locator("#fcFront").fill("Workpiece");
  await page.locator("#fcBack").fill("Заготовка");
  await page.locator("#fcAdd").click();
  await page.locator("#fcSave").click();
  await page.waitForFunction(() => document.getElementById("fcStatus")?.textContent.includes("Набор сохранён"));
  const setId = await page.locator("#fcExisting").inputValue();
  assert.ok(setId, "Saved flashcard set was not selected");
  await page.locator("#fcReset").click();
  await page.locator("#fcExisting").selectOption(setId);
  await page.waitForFunction(() => document.getElementById("fcDrafts")?.innerText.includes("Workpiece"));
  const savedCount = await page.evaluate(() => window.__constructorStore.length);

  await page.evaluate(() => {
    window.state.staff = null;
    window.state.student = { role: "student", courses: ["07.01"] };
    const topicId = document.getElementById("fcTopic").value;
    window.location.hash = "#/topic/" + window.state.activeCourseId + "/" + topicId + "/lectures";
    window.renderTopicPage(window.state.activeCourseId, topicId, "lectures");
  });
  await page.waitForFunction(() => Array.from(document.querySelectorAll("#topicContent .lec-content")).some(node => node.innerText.includes("Содержимое тестовой лекции")));
  const lectureVisible = await page.locator("#topicContent").innerText();
  assert.ok(lectureVisible.includes("Тестовая лекция конструктора"));

  await page.locator("#tab-test").click();
  await page.waitForSelector("#topicContent button");
  assert.ok((await page.locator("#topicContent").innerText()).includes("Тест конструктора"));
  await page.locator("#topicContent button").filter({ hasText: "Начать тест" }).click();
  await page.waitForFunction(() => document.getElementById("topicContent")?.innerText.includes("Какой вариант правильный?"));
  const testStarted = await page.locator("#topicContent").innerText();
  assert.ok(testStarted.includes("Какой вариант правильный?"));

  await page.locator("#tab-custom-flashcards").click();
  await page.locator("#topicContent button").filter({ hasText: "Начать повторение" }).click();
  await page.waitForFunction(() => document.getElementById("studentFlashcard")?.innerText === "Workpiece");
  await page.locator("#studentCardFlip").click();
  await page.waitForFunction(() => document.getElementById("studentFlashcard")?.innerText === "Заготовка");
  const report = { topicId, savedCount, lectureVisible: true, testStarted: true, flashcardFrontAndBack: true };
  fs.mkdirSync("artifacts/constructors", { recursive: true });
  fs.writeFileSync("artifacts/constructors/report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
