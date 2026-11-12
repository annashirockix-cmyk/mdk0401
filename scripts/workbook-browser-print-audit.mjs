import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseUrl = process.env.WORKBOOK_AUDIT_URL || "http://127.0.0.1:4173/";
const courseIds = ["07.01", "04.01", "02.01", "02.02", "MCAM", "SPRUT_TP", "MAT", "MET", "OT", "ENB", "ENT"];
const pdfCourses = new Set(courseIds);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 794, height: 1123 }, serviceWorkers: "block" });
const portal = await context.newPage();
const reports = [];
fs.mkdirSync("artifacts/workbooks", { recursive: true });

try {
  const response = await portal.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), `Portal did not load: ${response?.status()}`);
  await portal.waitForFunction(() =>
    typeof window.openWorkbook === "function" &&
    window.MDK_DATA &&
    Object.keys(window.MDK_DATA).length > 0,
    null,
    { timeout: 45000 }
  );
  const available = await portal.evaluate(() => Object.keys(window.MDK_DATA));
  console.log("Available workbook courses:", available.join(", "));

  for (const id of courseIds) {
    assert.ok(available.includes(id), `Course ${id} is missing from MDK_DATA`);
    const html = await portal.evaluate((courseId) => {
      let captured = "";
      const originalOpen = window.open;
      window.open = () => ({
        document: {
          open() {},
          write(value) { captured = String(value); },
          close() {}
        }
      });
      try { window.openWorkbook(courseId); }
      finally { window.open = originalOpen; }
      return captured;
    }, id);
    assert.ok(html && html.includes("<title>"), `Workbook ${id} did not generate standalone HTML`);
    if (id !== "ENB" && id !== "ENT") assert.doesNotMatch(html, /Письменная работа по теме/, `Workbook ${id} contains generic written-practice filler`);
    if (id === "ENB" || id === "ENT") {
      assert.doesNotMatch(html, /Дополнительный методический разбор|Составьте краткую технологическую карту по теме/);
      if (id === "ENB") { assert.match(html, /Language practice:/); assert.match(html, /Grammar Exercises: Pronouns(?: &amp;| &) Verbs/); assert.doesNotMatch(html, /Задание 1\. Анализ темы/); }
      if (id === "ENT") { assert.match(html, /ESP practice:/); assert.match(html, /Match words with definitions/); assert.doesNotMatch(html, /Задание 1\. Анализ темы/); }
    }
    if (id === "OT") {
      for (const phrase of ["Составьте карту санитарной оценки выбранного рабочего места", "не прикасайтесь к пострадавшему", "Разработайте карту предсменного осмотра станка с ЧПУ", "Карточка анализа происшествия"]) assert.ok(html.includes(phrase), `Safety workbook is missing topic-specific supplemental task: ${phrase}`);
    }
    if (id === "SPRUT_TP") {
      for (const title of ["Карта ролей технолога и СПРУТ-ТП","Сопоставление классификаций технологических процессов","Сравнение МК, ОК и КЭ","Структура проекта и справочной информации","Проверка исходных данных детали","Самостоятельное проектирование маршрутного ТП","Разработка фрагмента операционной карты","Согласование маршрутной и операционной карт","Выбор типового или группового процесса","Анализ и адаптация технологического аналога","Планирование механической обработки","Обоснование заготовительных и специальных операций","Структура времени и исходные данные для нормирования","Нормоконтроль комплекта технологических документов"]) assert.ok(html.includes(title), `SPRUT-TP workbook is missing source self-work title: ${title}`);
    }
    const workbook = await context.newPage();
    await workbook.setContent(html, { waitUntil: "load" });
    try {
      await workbook.emulateMedia({ media: "print" });
      await workbook.evaluate(async () => {
        await document.fonts.ready;
        const images = Array.from(document.images);
        await Promise.all(images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            const timer = setTimeout(resolve, 12000);
            img.addEventListener("load", () => { clearTimeout(timer); resolve(); }, { once: true });
            img.addEventListener("error", () => { clearTimeout(timer); resolve(); }, { once: true });
          });
        }));
      });

      const metrics = await workbook.evaluate(() => {
        const sheets = Array.from(document.querySelectorAll(".page,.sheet"));
        const overflows = [];
        for (const sheet of sheets) {
          const rect = sheet.getBoundingClientRect();
          if (sheet.scrollWidth > sheet.clientWidth + 2) {
            overflows.push({ kind: "sheet-scroll", className: sheet.className, scrollWidth: sheet.scrollWidth, clientWidth: sheet.clientWidth });
          }
          for (const el of sheet.querySelectorAll("img,table,pre,.wb-code")) {
            const r = el.getBoundingClientRect();
            if (r.width && (r.left < rect.left - 2 || r.right > rect.right + 2)) {
              overflows.push({ kind: el.tagName.toLowerCase(), className: el.className || "", left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), sheetLeft: Math.round(rect.left), sheetRight: Math.round(rect.right), parentTag: el.parentElement?.tagName, parentClass: el.parentElement?.className || "", parentLeft: Math.round(el.parentElement?.getBoundingClientRect().left || 0), parentRight: Math.round(el.parentElement?.getBoundingClientRect().right || 0), computedWidth: getComputedStyle(el).width, maxWidth: getComputedStyle(el).maxWidth, margin: getComputedStyle(el).margin, html: el.outerHTML.slice(0, 220) });
            }
          }
        }
        const images = Array.from(document.images).map((img) => ({
          src: img.currentSrc || img.src,
          loaded: img.complete && img.naturalWidth > 0
        }));
        return {
          sheets: sheets.length,
          tables: document.querySelectorAll("table").length,
          images,
          overflows
        };
      });

      assert.ok(metrics.sheets >= 1, `Workbook ${id} contains no pages`);
      assert.equal(metrics.overflows.length, 0, `Workbook ${id} has print overflow: ${JSON.stringify(metrics.overflows.slice(0, 30))}`);
      const broken = metrics.images.filter((img) => !img.loaded);
      if (broken.length) console.warn(`Workbook ${id}: ${broken.length} image(s) failed to load`, broken.map((img) => img.src));

      if (pdfCourses.has(id)) {
        const pdf = await workbook.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
        assert.ok(pdf.length > 5000, `Workbook ${id} generated an unexpectedly small PDF (${pdf.length} bytes)`);
        const pdfText = pdf.toString("latin1");
        assert.match(pdfText, /\/MediaBox\s*\[\s*0\s+0\s+\d+(?:\.\d+)?\s+\d+(?:\.\d+)?\s*\]/, `Workbook ${id} PDF has no page MediaBox`);
        fs.writeFileSync(`artifacts/workbooks/${id.replace(/[^a-z0-9_-]/gi, "_")}.pdf`, pdf);
      }
      reports.push({ id, sections: metrics.sheets, tables: metrics.tables, images: metrics.images.length, brokenImages: broken.length, overflowCount: metrics.overflows.length });
      console.log(`PASS ${id}: ${metrics.sheets} pages/sections, ${metrics.tables} tables, ${metrics.images.length} images, ${broken.length} broken images`);
    } finally {
      await workbook.close();
    }
  }
  fs.writeFileSync("artifacts/workbooks/report.json", JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports, null, 2));
} finally {
  await browser.close();
}
