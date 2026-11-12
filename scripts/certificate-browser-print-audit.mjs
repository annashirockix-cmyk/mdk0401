import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const baseUrl = process.env.CERTIFICATE_AUDIT_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
fs.mkdirSync("artifacts/certificate", { recursive: true });
try {
  const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), `Portal did not load: ${response?.status()}`);
  await page.evaluate(() => {
    document.body.innerHTML = '<main id="app"></main>';
    window.state = {
      student: { name: "Тестовый обучающийся", email: "certificate-audit@example.invalid" },
      activeCourseId: "07.01"
    };
    window.MDK_DATA = { "07.01": { id: "07.01", title: "МДК 07.01 — Технология обработки на станках с ЧПУ" } };
    window.API = {
      getMyCourseResults: async () => ({
        success: true,
        results: Array.from({ length: 24 }, (_, i) => ({
          grade: 4 + (i % 2), percent: 80 + (i % 20),
          testTitle: "Контрольный этап " + (i + 1) + " — проверка знаний по разделу обработки и наладки",
          finishedAt: "2026-10-" + String((i % 28) + 1).padStart(2, "0") + "T10:00:00Z"
        }))
      }),
      getAssignments: async () => ({
        success: true,
        assignments: Array.from({ length: 24 }, (_, i) => ({
          courseId: "07.01",
          title: "Практическая работа " + (i + 1) + " — подготовка, проверка и контроль технологической операции",
          submission: { status: "reviewed", grade: 4 + (i % 2), submittedAt: "2026-10-15T10:00:00Z" }
        }))
      })
    };
    window.renderCertificatePage = function () {
      const app = document.getElementById("app");
      app.innerHTML = '<div class="no-print"><button type="button">Распечатать сертификат</button></div>' +
        '<section id="printable-cert" style="border:3px double #9b3d32;padding:20px;text-align:center">' +
        '<p>УЧЕБНЫЙ ПОРТАЛ</p><h1>СЕРТИФИКАТ</h1>' +
        '<h2>Об освоении программы профессионального обучения</h2>' +
        '<p>Выдан: Тестовый обучающийся</p><p>Дисциплина: МДК 07.01</p>' +
        '<p>Дата: 12 ноября 2026 года</p></section>';
    };
  });
  await page.addScriptTag({ path: "certificate-supplement.js" });
  await page.evaluate(() => window.renderCertificatePage());
  await page.waitForFunction(() => {
    const button = document.querySelector("#app .no-print button");
    return button && !button.disabled && document.querySelector("#certificatePrintRoot .certificate-supplement table");
  }, null, { timeout: 20000 });

  const selections = await page.evaluate(async () => {
    const design = document.getElementById("certificateDesign");
    const background = document.getElementById("certificateBackground");
    const result = [];
    for (const d of Array.from(design.options).map(x => x.value)) {
      design.value = d;
      design.dispatchEvent(new Event("change", { bubbles: true }));
      result.push({ design: d, applied: document.getElementById("printable-cert").dataset.design === d });
    }
    for (const b of Array.from(background.options).map(x => x.value)) {
      background.value = b;
      background.dispatchEvent(new Event("change", { bubbles: true }));
      const image = document.querySelector("#printable-cert .cs-print-bg");
      if (b.startsWith("image")) {
        if (image && !image.complete) await new Promise(resolve => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
          setTimeout(resolve, 10000);
        });
        result.push({ background: b, applied: !!image && image.complete && image.naturalWidth > 0 });
      } else {
        result.push({ background: b, applied: document.getElementById("printable-cert").dataset.bg === b });
      }
    }
    design.value = "navy";
    background.value = "image1";
    design.dispatchEvent(new Event("change", { bubbles: true }));
    background.dispatchEvent(new Event("change", { bubbles: true }));
    return result;
  });
  assert.ok(selections.every(x => x.applied), "A certificate style or background failed: " + JSON.stringify(selections));
  await page.emulateMedia({ media: "print" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(img => img.complete ? Promise.resolve() :
      new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
        setTimeout(resolve, 10000);
      })));
  });
  const layout = await page.evaluate(() => {
    const root = document.getElementById("certificatePrintRoot");
    const cert = document.getElementById("printable-cert");
    const supplement = root.querySelector(".certificate-supplement");
    const table = supplement.querySelector("table");
    return {
      rootChildren: root.children.length,
      certWidth: cert.getBoundingClientRect().width,
      supplementWidth: supplement.getBoundingClientRect().width,
      tableWidth: table.getBoundingClientRect().width,
      rowCount: table.querySelectorAll("tbody tr").length,
      imageLoaded: !!cert.querySelector(".cs-print-bg")?.naturalWidth
    };
  });
  assert.equal(layout.rootChildren, 2, "Print root must contain only certificate and its supplement");
  assert.ok(layout.rowCount >= 40, "Audit fixture did not create a multi-page supplement");
  assert.ok(layout.tableWidth <= layout.supplementWidth + 2, "Certificate supplement table overflows its page");
  assert.ok(layout.imageLoaded, "Selected certificate background image did not load");

  const pdf = await page.pdf({ format: "A4", landscape: true, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  assert.ok(pdf.length > 5000, "Certificate PDF is unexpectedly small");
  const pdfText = pdf.toString("latin1");
  const media = pdfText.match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/);
  assert.ok(media, "Certificate PDF has no MediaBox");
  assert.ok(Number(media[1]) > Number(media[2]), "Certificate PDF is not landscape");
  const pages = (pdfText.match(/\/Type\s*\/Page\b/g) || []).length;
  assert.ok(pages >= 2, `Expected certificate plus multi-page supplement, got ${pages} PDF page(s)`);
  fs.writeFileSync("artifacts/certificate/certificate-a4-landscape.pdf", pdf);
  fs.writeFileSync("artifacts/certificate/report.json", JSON.stringify({ selections, layout, pages, bytes: pdf.length, mediaBox: media.slice(1).map(Number) }, null, 2));
  console.log(JSON.stringify({ selections, layout, pages, bytes: pdf.length, mediaBox: media.slice(1).map(Number) }, null, 2));
} finally {
  await browser.close();
}
