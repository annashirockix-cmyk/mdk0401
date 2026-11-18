import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const baseUrl = process.env.CONSTRUCTOR_AUDIT_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
page.on("pageerror", error => console.log("PAGE_ERROR", error.stack || error.message));
page.on("console", message => { if (message.type() === "error" || /FLASHCARD_/.test(message.text())) console.log("BROWSER_CONSOLE", message.type(), JSON.stringify(message.location()), message.text()); });
page.on("requestfailed", request => console.log("REQUEST_FAILED", request.url(), request.failure()?.errorText));
page.on("console", message => { if (message.type() === "error") console.log("PAGE_CONSOLE_ERROR", message.text()); });
try {
  const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), `Portal did not load: ${response?.status()}`);
  await page.waitForFunction(() => typeof window.renderCourseEditorPage === "function" &&
    typeof window.renderFlashcardEditorPage === "function" && window.MDK_DATA && window.MDK_DATA["07.01"]);
  await page.evaluate(async () => {
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
      window.customContent.files = rows.filter(x => x.type === "file");
      window.customContent.games = rows.filter(x => x.type === "game");
    }
    window.__tutoringSettings = {};
    window.API = {
      getTutoringLink: async courseId => ({ success: true, link: { ...(window.__tutoringSettings[courseId] || {}) } }),
      saveTutoringLink: async (courseId, data) => {
        window.__tutoringSettings[courseId] = { ...data };
        return { success: true };
      },
      getTopicAccess: async () => ({ open: true }),
      getCustomContent: async () => ({ success: true, data: window.__constructorStore.map(x => ({ ...x })) }),
      uploadTestImage: async (courseId, dataUrl, name) => ({ success: true, imageRef: "drive:audit-image-reference", name, size: 12000 }),
      uploadCourseFile: async (courseId, topicId, title, fileName, dataUrl) => {
        const item = { id: "audit-course-file-12345", mdkId: courseId, topicId, type: "file", title,
          fileRef: "coursefile:audit-course-file-12345", fileName, mimeType: "application/pdf", size: 12 };
        window.__constructorStore.push(item); sync();
        return { success: true, ...item };
      },
      getCourseFile: async (itemId, fileRef) => ({
        success: itemId === "audit-course-file-12345" && fileRef === "coursefile:audit-course-file-12345",
        fileName: "methodical-guide.pdf", mimeType: "application/pdf", data: "JVBERi0xLjQK", size: 9
      }),
      getQuestionBank: async (courseId, bankId) => ({ success: true, courseId, questions: (window.__examBankRows || []).map(row => ({ ...row })) }),
      saveQuestionBank: async (courseId, bankId, questions) => {
        window.__examBankRows = questions.map(row => ({ questionId: row.questionId, question: { ...row.question } }));
        return { success: true, questionsSaved: questions.length, backupId: "audit-backup-id" };
      },
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
      getTestAttemptStatus: async () => ({ allowed: true, used: 0, limit: 1 }),
      getCustomTest: async testId => ({
        success: true, attemptId: "audit-custom-attempt-" + String(testId),
        questions: [
          { q: "Вычислите результат: 25 ÷ 2.", type: "numeric" },
          { q: "Утверждение: 2 × 3 = 6.", type: "true_false", options: ["Верно", "Неверно"] },
          { q: "Назовите единицу измерения силы.", type: "short_text" }
        ]
      }),
      submitCustomTest: async payload => {
        window.__submittedCustomAnswers = (payload && payload.answers || []).slice();
        return { success: true, score: 3, maxScore: 3, percent: 100, grade: 5 };
      }
    };
    // Reproduce an admin request finishing after a student has signed in.
    // The late admin response must not overwrite the student's role-filtered list.
    const originalGetCustomContent = window.API.getCustomContent;
    window.customContent = { topics: [], files: [], lectures: [], tests: [], flashcards: [], games: [], announcements: [] };
    window.state.staff = { role: "admin", courses: ["07.01"], email: "audit-admin@example.invalid" };
    window.state.student = null;
    localStorage.setItem("mdk.session", "audit-admin-token");
    let resolveAdminContent, resolveStudentContent, contentRequestNo = 0;
    window.API.getCustomContent = () => new Promise(resolve => {
      contentRequestNo += 1;
      if (contentRequestNo === 1) resolveAdminContent = resolve;
      else resolveStudentContent = resolve;
    });
    const adminContentLoad = window.loadGlobalCustomContent();
    window.state.staff = null;
    window.state.student = { role: "student", courses: ["07.01"], email: "audit-student@example.invalid" };
    localStorage.setItem("mdk.session", "audit-student-token");
    const studentContentLoad = window.loadGlobalCustomContent();
    resolveStudentContent({ success: true, data: [{ id: "student-only", type: "lecture", title: "Материал студента" }] });
    await studentContentLoad;
    resolveAdminContent({ success: true, data: [{ id: "admin-only", type: "lecture", title: "Скрытый материал преподавателя" }] });
    await adminContentLoad;
    if (!window.customContent.lectures.some(item => item.id === "student-only") ||
        window.customContent.lectures.some(item => item.id === "admin-only")) {
      throw new Error("A stale admin content response overwrote the active student's materials");
    }
    window.__accountRaceAudit = {
      pass: true,
      activeRole: "student",
      activeEmail: window.state.student.email,
      studentMaterialPresent: true,
      staleAdminMaterialRejected: true
    };
    window.API.getCustomContent = originalGetCustomContent;
    window.state.staff = { role: "teacher", courses: ["07.01"], email: "audit-teacher@example.invalid" };
    window.state.student = null;
    localStorage.setItem("mdk.session", "audit-teacher-token");
    window.customContent = { topics: [], lectures: [], tests: [], flashcards: [], files: [], games: [], announcements: [] };
    window.loadGlobalCustomContent = callback => { sync(); if (callback) callback(); };
    window.showToast = message => { window.__auditToast = String(message); };
    window.saveStudentData = () => {};
    window.unlockAchievement = () => {};
    window.confirm = () => true;
  });

  await page.evaluate(() => window.updateMenuVisibility());
  await page.locator("#burgerBtn").click();
  assert.equal(await page.locator("#drawer").getAttribute("aria-hidden"), "false");
  await page.locator("#drawerSearch").fill("Тренажёр метролога");
  assert.ok(await page.locator('a[href="#/metrology-trainer"]').isVisible(), "navigation search must find the laboratory trainer");
  assert.ok(await page.locator("#drawerLaboratory").evaluate(node => node.open), "search must expand the matching navigation group");
  await page.locator("#drawerSearchClear").click();
  await page.locator("#drawerSearch").fill("Конструктор карточек");
  assert.ok(await page.locator("#menuFlashcardEditor").isVisible(), "teacher must find the flashcard editor");
  await page.evaluate(() => {
    window.state.staff = null;
    window.state.student = { role: "student", courses: ["07.01"], email: "audit-student@example.invalid" };
    window.updateMenuVisibility();
  });
  assert.equal(await page.locator("#drawerSearch").inputValue(), "", "role changes must reset filtered navigation");
  await page.locator("#drawerSearch").fill("Конструктор карточек");
  assert.equal(await page.locator("#menuFlashcardEditor").evaluate(node => getComputedStyle(node).display), "none", "search must not reveal teacher-only links to students");
  assert.ok((await page.locator("#drawerSearchResults").innerText()).includes("Ничего не найдено"));
  await page.evaluate(() => {
    window.state.student = null;
    window.state.staff = { role: "teacher", courses: ["07.01"], email: "audit-teacher@example.invalid" };
    window.updateMenuVisibility();
  });
  await page.locator("#drawerClose").click();
  assert.equal(await page.locator("#drawer").getAttribute("aria-hidden"), "true");
  await page.keyboard.press("/");
  assert.equal(await page.locator("#burgerBtn").getAttribute("aria-expanded"), "true", "slash shortcut must open navigation");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#burgerBtn").getAttribute("aria-expanded"), "false", "Escape must close navigation");
  await page.evaluate(() => { location.hash = "#/resources"; });
  await page.waitForFunction(() => location.hash === "#/resources");
  await page.evaluate(() => { location.hash = "#/videos"; });
  await page.waitForFunction(() => location.hash === "#/videos");
  assert.ok(await page.locator("#crumbs .crumb-back").isVisible(), "breadcrumb back link must appear after an in-portal transition");
  await page.locator("#crumbs .crumb-back").click();
  await page.waitForFunction(() => location.hash === "#/resources", null, { timeout: 5000 });
  await page.evaluate(() => window.renderCourseEditorPage());
  await page.waitForSelector("#createTopicBtn");
  // Exercise the protected exam-bank visual editor end-to-end with a mocked server API.
  await page.locator("#loadExamBankBtn").click();
  await page.waitForFunction(() => document.getElementById("examBankStatus")?.textContent.includes("Загружено заданий"));
  await page.locator("#examQuestionText").fill("Какие операции относятся к подготовке станка?");
  await page.locator("#examQuestionType").selectOption("multi");
  await page.locator("#examQuestionOptions").fill("Проверка инструмента\nПроверка крепления\nСлучайный запуск\nПроверка программы");
  await page.locator("#examQuestionCorrect").fill("1, 2, 4");
  await page.locator("#previewExamQuestionBtn").click();
  assert.ok((await page.locator("#examQuestionPreview").innerText()).includes("Предпросмотр студенческого задания"));
  assert.ok(!(await page.locator("#examQuestionPreview").innerText()).includes("Правильный ответ"));
  await page.locator("#saveExamQuestionBtn").click();
  assert.ok((await page.locator("#examBankQuestionList").innerText()).includes("Какие операции относятся к подготовке станка?"));
  await page.locator("#saveExamBankBtn").click();
  await page.waitForFunction(() => document.getElementById("examBankStatus")?.textContent.includes("audit-backup-id"));
  const visualBankSaved = await page.evaluate(() => window.__examBankRows);
  assert.equal(visualBankSaved.length, 1, "Visual exam bank editor must save the new question");
  assert.deepEqual(visualBankSaved[0].question.correct, [0, 1, 3], "Multiple-answer keys must be stored as zero-based indices");
  assert.deepEqual(visualBankSaved[0].question.options, ["Проверка инструмента", "Проверка крепления", "Случайный запуск", "Проверка программы"]);
  await page.locator("#addExamQuestionBtn").click();
  await page.locator("#examQuestionText").fill("Назовите физическую величину, измеряемую в ньютонах.");
  await page.locator("#examQuestionType").selectOption("short_text");
  await page.locator("#examQuestionCorrect").fill("Ньютон");
  await page.locator("#previewExamQuestionBtn").click();
  const shortPreview = await page.locator("#examQuestionPreview").innerText();
  assert.equal(await page.locator("#examQuestionPreview textarea").getAttribute("placeholder"), "Введите краткий ответ");
  assert.ok(!shortPreview.includes("Ньютон"), "Short text answer key must stay hidden in student preview");
  await page.locator("#saveExamQuestionBtn").click();
  await page.locator("#saveExamBankBtn").click();
  await page.waitForFunction(() => document.getElementById("examBankStatus")?.textContent.includes("audit-backup-id"));
  const visualBankWithText = await page.evaluate(() => window.__examBankRows);
  assert.equal(visualBankWithText.length, 2, "Visual exam bank editor must retain both question types");
  assert.equal(visualBankWithText[1].question.type, "short_text");
  assert.equal(visualBankWithText[1].question.correctAnswer, "Ньютон");
  // Tutoring controls are tested in their dedicated home-screen workflow.
  await page.locator("#newTopicCode").fill("AUDIT");
  await page.locator("#newTopicTitle").fill("Проверка конструктора");
  await page.locator("#createTopicBtn").click();
  await page.waitForFunction(() => document.getElementById("topicStatus")?.textContent.includes("Тема создана"));
  const topicId = await page.locator("#lectureTopic").inputValue();
  assert.ok(topicId.startsWith("custom-"), "New topic was not added to the editor selectors");

  await page.locator("#lectureTitle").fill("Тестовая лекция конструктора");
  await page.locator("#lectureBody").fill('<h3>Проверка отображения</h3><p>Содержимое тестовой лекции.</p><img src="https://example.invalid/diagram.png" alt="Схема" onerror="window.__previewXss=1">');
  await page.locator("#ceLecturePreviewToggle").click();
  const lecturePreview = await page.locator("#ceLecturePreviewFrame").getAttribute("srcdoc");
  assert.ok(lecturePreview.includes("Тестовая лекция конструктора"), "Lecture preview must include the current title");
  assert.ok(lecturePreview.includes("Содержимое тестовой лекции."), "Lecture preview must render the current body");
  assert.ok(lecturePreview.includes("https://example.invalid/diagram.png"), "Lecture preview must preserve safe image sources");
  assert.ok(!lecturePreview.includes("onerror"), "Lecture preview must strip executable image handlers");
  assert.equal(await page.locator("#ceLecturePreviewFrame").getAttribute("sandbox"), "", "Lecture preview must run in a fully sandboxed iframe");
  assert.equal(await page.locator("#ceLecturePreviewFrame").evaluate(el => getComputedStyle(el).display), "block");
  await page.locator("#saveLectureBtn").click();
  await page.waitForFunction(() => document.getElementById("lectureStatus")?.textContent.includes("лекция сохранена"));
  await page.locator("#courseFileTopic").selectOption(topicId);
  await page.locator("#courseFileTitle").fill("Методическое пособие к теме");
  await page.locator("#courseFileInput").setInputFiles({
    name: "methodical-guide.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\\nAudit document")
  });
  await page.locator("#uploadCourseFileBtn").click();
  await page.waitForFunction(() => document.getElementById("courseFileStatus")?.textContent.includes("Файл прикреплён к теме"));
  assert.equal(await page.evaluate(() => window.__constructorStore.find(x => x.type === "file")?.fileRef),
    "coursefile:audit-course-file-12345", "Uploaded course document must be stored as a private file reference");

  await page.locator("#testTitle").fill("Тест конструктора");
  await page.locator("#qText").fill("Какой вариант правильный?");
  await page.locator("#qA").fill("Неверно");
  await page.locator("#qB").fill("Верно");
  await page.locator("#qC").fill("Не подходит");
  await page.locator("#qD").fill("Нет ответа");
  await page.locator("#qCorrect").selectOption("1");
  await page.locator("#ceQuestionImageFile").setInputFiles({
    name: "question-diagram.png",
    mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==", "base64")
  });
  await page.waitForFunction(() => {
    const status = document.getElementById("ceQuestionImageStatus")?.textContent || "";
    return status.includes("Изображение загружено") || status.includes("Выберите PNG") ||
      status.includes("больше 8 МБ") || status.includes("больше 700 КБ") ||
      status.includes("не удалось") || status.includes("Не удалось") || status.includes("Ошибка");
  }, undefined, { timeout: 15000 });
  const imageUploadStatus = await page.locator("#ceQuestionImageStatus").innerText();
  console.log("QUESTION_IMAGE_UPLOAD_STATUS", imageUploadStatus);
  assert.ok(imageUploadStatus.includes("Изображение загружено"), "Question image upload failed: " + imageUploadStatus);
  assert.equal(await page.locator("#ceQuestionImagePreview img").count(), 1, "Question image preview should be visible");
  await page.locator("#addQuestionBtn").click();
  await page.locator("#saveTestBtn").click();
  await page.waitForFunction(() => document.getElementById("testStatus")?.textContent.includes("Тест сохранён"));
  assert.equal(await page.evaluate(() => window.__constructorStore.find(x => x.type === "test")?.questions?.[0]?.imageRef), "drive:audit-image-reference", "Question image reference must be saved with the test");
  assert.ok((await page.locator("#savedMaterials").innerText()).includes("Тест конструктора"));
  assert.ok((await page.locator("#savedMaterials").innerText()).includes("Тестовая лекция конструктора"));

  await page.evaluate(() => window.renderOwnGameEditor());
  await page.waitForSelector("#ownGameLoadExample");
  await page.locator("#ownGameLoadExample").click();
  await page.waitForFunction(() => document.getElementById("ownGamePreviewBox")?.innerText.includes("Команды перемещения"));
  assert.equal(await page.locator("#ownGameCategories article.module").count(), 3, "Sample own-game board must contain three categories");
  assert.equal(await page.locator("#ownGameCategories [data-q-text]").count(), 9, "Sample own-game board must contain nine questions");
  await page.locator("#ownGameSave").click();
  await page.waitForFunction(() => window.__constructorStore.some(x => x.type === "game" && x.title === "Своя игра: основы G-кода"));
  assert.equal(await page.evaluate(() => window.__constructorStore.find(x => x.type === "game")?.categories.reduce((n,c)=>n+c.questions.length,0)), 9,
    "Sample own-game board must be saved with all nine questions");

  await page.evaluate(() => {
    window.state = { staff: { role: "teacher", courses: ["07.01"], email: "audit-teacher@example.invalid" },
      student: null, activeCourseId: "07.01", results: {}, xp: 0 };
    window.customContent = window.customContent || { topics: [], lectures: [], tests: [], flashcards: [], files: [] };
    const appNode = document.getElementById("app");
    const originalAppNode = appNode;
    const documentObserver = new MutationObserver(() => {
      const currentApp = document.getElementById("app");
      const topic = document.getElementById("fcTopic");
      if (!topic || currentApp !== originalAppNode) {
        console.log("FLASHCARD_DOCUMENT_MUTATION", JSON.stringify({
          hash: location.hash,
          appStillConnected: originalAppNode?.isConnected,
          appReplaced: currentApp !== originalAppNode,
          currentAppText: (currentApp?.innerText || "").slice(0, 500),
          currentAppHtml: (currentApp?.innerHTML || "").slice(0, 900),
          stackHint: new Error().stack
        }));
        documentObserver.disconnect();
      }
    });
    documentObserver.observe(document.documentElement, { childList: true, subtree: true });
    const innerHtmlDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (appNode && innerHtmlDescriptor && innerHtmlDescriptor.set) {
      Object.defineProperty(appNode, "innerHTML", {
        configurable: true,
        get() { return innerHtmlDescriptor.get.call(this); },
        set(value) {
          if (document.getElementById("fcTopic") && !String(value).includes('id="fcTopic"')) {
            console.log("FLASHCARD_APP_REPLACED", JSON.stringify({ hash: location.hash, nextHtml: String(value).slice(0, 500), stack: new Error().stack }));
          }
          return innerHtmlDescriptor.set.call(this, value);
        }
      });
    }
    if (appNode) {
      const observer = new MutationObserver(() => {
        if (window.__flashcardTopicWasMounted && !document.getElementById("fcTopic")) {
          console.log("FLASHCARD_TOPIC_REMOVED", JSON.stringify({ hash: location.hash, appText: (appNode.innerText || "").slice(0, 500) }));
          observer.disconnect();
        }
        if (document.getElementById("fcTopic")) window.__flashcardTopicWasMounted = true;
      });
      observer.observe(appNode, { childList: true, subtree: true });
    }
    window.addEventListener("hashchange", () => console.log("FLASHCARD_HASH_CHANGE", location.hash));
    location.hash = "#/flashcard-editor";
  });
  await page.waitForSelector("#fcTopic", { state: "attached", timeout: 10000 });
  await page.waitForFunction(() => document.getElementById("fcTopic")?.options.length > 0);
  const flashcardDiagnostics = await page.evaluate(() => ({
    staff: window.state && window.state.staff,
    courseKeys: Object.keys(window.MDK_DATA || {}),
    activeCourseId: window.state && window.state.activeCourseId,
    courseSections: (window.MDK_DATA && window.MDK_DATA["07.01"] && window.MDK_DATA["07.01"].sections || []).length,
    builtInTopics: (window.MDK_DATA && window.MDK_DATA["07.01"] && window.MDK_DATA["07.01"].sections || []).reduce((n, s) => n + (s.topics || []).length, 0),
    customTopics: (window.customContent && window.customContent.topics || []).map(t => ({id:t.id,mdkId:t.mdkId,title:t.title})),
    selectedCourse: document.getElementById("fcCourse")?.value,
    topicOptionCount: document.getElementById("fcTopic")?.options.length,
    appText: (document.getElementById("app")?.innerText || "").slice(0, 1200),
    appHtml: (document.getElementById("app")?.innerHTML || "").slice(0, 1800)
  }));
  console.log("FLASHCARD_AUDIT_DIAGNOSTICS", JSON.stringify(flashcardDiagnostics));
  await page.locator("#fcLoadExample").click();
  await page.waitForFunction(() => document.getElementById("fcDrafts")?.innerText.includes("G00"));
  assert.equal(await page.locator("#fcDrafts article.module").count(), 8, "Sample G-code flashcard set must contain eight cards");
  await page.locator("#fcReset").click();
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
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (url, options) => {
      if (String(url).includes("action=getTopicAccess")) return new Response(JSON.stringify({ success: true, open: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      return originalFetch(url, options);
    };
    window.API = window.API || {};
    window.API.getTopicAccess = async () => ({ success: true, open: true });
    window.API.getTestAttemptStatus = async () => ({ allowed: true, used: 0, limit: 1 });
    window.API.requestTestAttempts = async () => ({ success: true });
    window.renderTopicPage(window.state.activeCourseId, topicId, "lectures");
  });
  await page.waitForFunction(() => Array.from(document.querySelectorAll("#topicContent .lec-content")).some(node => node.innerText.includes("Содержимое тестовой лекции")));
  const lectureVisible = await page.locator("#topicContent").innerText();
  assert.ok(lectureVisible.includes("Тестовая лекция конструктора"));
  assert.ok(lectureVisible.includes("Методическое пособие к теме"), "Student lecture view must list the attached course document");
  await page.evaluate(() => {
    window.__courseFileDownloadAudit = { apiCalls: 0, fileName: "", mimeType: "", anchorClicks: [] };
    const originalGetCourseFile = window.API.getCourseFile;
    window.API.getCourseFile = async function(itemId, fileRef) {
      window.__courseFileDownloadAudit.apiCalls++;
      const result = await originalGetCourseFile(itemId, fileRef);
      window.__courseFileDownloadAudit.fileName = result && result.fileName || "";
      window.__courseFileDownloadAudit.mimeType = result && result.mimeType || "";
      return result;
    };
    const originalCreateObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = function(blob) {
      window.__courseFileDownloadAudit.blobType = blob && blob.type || "";
      window.__courseFileDownloadAudit.blobSize = blob && blob.size || 0;
      return originalCreateObjectURL(blob);
    };
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
      if (this.download) window.__courseFileDownloadAudit.anchorClicks.push({ fileName: this.download, href: this.href });
      return originalAnchorClick.call(this);
    };
  });
  await page.locator("#topicContent button").filter({ hasText: "Методическое пособие к теме" }).evaluate(button => button.click());
  await page.waitForFunction(() => {
    const audit = window.__courseFileDownloadAudit;
    return audit && audit.apiCalls === 1 && audit.anchorClicks.length === 1;
  });
  const courseFileDownload = await page.evaluate(() => window.__courseFileDownloadAudit);
  assert.equal(courseFileDownload.fileName, "methodical-guide.pdf");
  assert.equal(courseFileDownload.mimeType, "application/pdf");
  assert.equal(courseFileDownload.blobType, "application/pdf");
  assert.ok(courseFileDownload.blobSize > 0, "Student download must create a non-empty PDF blob");
  assert.equal(courseFileDownload.anchorClicks[0].fileName, "methodical-guide.pdf",
    "Student must initiate a download with the attached document filename");

  await page.locator("#tab-test").click();
  await page.waitForSelector("#topicContent button");
  assert.ok((await page.locator("#topicContent").innerText()).includes("Тест конструктора"));
  await page.locator("#topicContent button").filter({ hasText: "Начать тест" }).click();
  await page.waitForFunction(() => document.getElementById("topicContent")?.innerText.includes("Вычислите результат: 25 ÷ 2."));
  assert.ok((await page.locator("#topicContent").innerText()).includes("Введите числовой ответ"),
    "Numeric question must render a decimal-answer input");
  await page.locator("#customNumericAnswer").fill("12,5");
  await page.locator("#customNumericSubmit").click();
  await page.waitForFunction(() => document.getElementById("topicContent")?.innerText.includes("Утверждение: 2 × 3 = 6."));
  assert.equal(await page.locator('#topicContent button[data-custom-answer="0"]').count(), 1,
    "True/false question must render the fixed True option");
  assert.equal(await page.locator('#topicContent button[data-custom-answer="1"]').count(), 1,
    "True/false question must render the fixed False option");
  await page.locator('#topicContent button[data-custom-answer="0"]').click();
  await page.waitForFunction(() => document.getElementById("customShortTextAnswer"));
  await page.locator("#customShortTextAnswer").fill("Ньютон");
  await page.locator("#customShortTextSubmit").click();
  await page.waitForFunction(() => document.getElementById("topicContent")?.innerText.includes("Тест завершён"));
  const submittedAnswers = await page.evaluate(() => window.__submittedCustomAnswers);
  assert.deepEqual(submittedAnswers, ["12.5", 0, "Ньютон"],
    "Student answers must preserve normalized numeric input and selected true/false value");
  const testStarted = { numeric: true, trueFalse: true, shortText: true, submittedAnswers };

  await page.locator("#tab-custom-flashcards").click();
  await page.locator("#topicContent button").filter({ hasText: "Начать повторение" }).click();
  await page.waitForFunction(() => document.getElementById("studentFlashcard")?.innerText === "Workpiece");
  await page.locator("#studentCardFlip").click();
  await page.waitForFunction(() => document.getElementById("studentFlashcard")?.innerText === "Заготовка");
  const sprutTopics = await page.evaluate(() => window.MDK_DATA.SPRUT_TP.sections.flatMap(section =>
    section.topics.map(topic => ({ id: topic.id, code: topic.code, title: topic.title }))));
  const sprutNavigation = { sectionCount: await page.evaluate(() => window.MDK_DATA.SPRUT_TP.sections.length),
    topicCount: sprutTopics.length, uniqueIds: new Set(sprutTopics.map(topic => topic.id)).size, results: [] };
  assert.equal(sprutNavigation.sectionCount, 6, "All six SPRUT-TP sections must be present");
  assert.equal(sprutNavigation.topicCount, 14, "All 14 SPRUT-TP topics must be reachable");
  assert.equal(sprutNavigation.uniqueIds, 14, "Every SPRUT-TP topic must have a unique route ID");
  for (const topic of sprutTopics) {
    await page.evaluate(({ id }) => {
      window.state.student = { role: "student", courses: ["07.01", "SPRUT_TP"] };
      window.state.activeCourseId = "SPRUT_TP";
      window.location.hash = "#/topic/SPRUT_TP/" + id + "/lectures";
      window.renderTopicPage("SPRUT_TP", id, "lectures");
    }, topic);
    await page.waitForFunction(title => document.querySelector("#app h1")?.innerText.includes(title), topic.title);
    const renderedTitle = await page.locator("#app h1").innerText();
    const visible = renderedTitle.includes(topic.title);
    const result = { ...topic, renderedTitle, visible };
    sprutNavigation.results.push(result);
    assert.ok(visible, "Student view opened the wrong SPRUT-TP topic: " + JSON.stringify(result));
  }
  const accountRaceAudit = await page.evaluate(() => window.__accountRaceAudit || null);
  assert.ok(accountRaceAudit && accountRaceAudit.pass && accountRaceAudit.staleAdminMaterialRejected,
    "Account-switch race audit did not produce a passing result");
  const report = { topicId, savedCount, accountRaceAudit, lectureVisible: true, testStarted, flashcardFrontAndBack: true, sprutNavigation };
  fs.mkdirSync("artifacts/constructors", { recursive: true });
  fs.writeFileSync("artifacts/constructors/report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
