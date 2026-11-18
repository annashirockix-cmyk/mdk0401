import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, acceptDownloads: true });
const pdf = Buffer.from("%PDF-1.4\nExam reference document\n%%EOF").toString("base64");
try {
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body><main id="app"></main></body></html>');
  await page.addScriptTag({content:`
    window.state={student:{role:"student",courses:["07.01"],name:"Student",group:"ТО-21"},results:{}};
    window.MDK_DATA={"07.01":{id:"07.01",shortName:"МДК 07.01",title:"ЧПУ",sections:[]}};
    window.__examFileRequests=[];
    window.API={
      getFinalExam:async()=>({success:true,examId:"exam-browser-audit",questions:Array.from({length:45},(_,i)=>({question:{type:"mc",q:"Контрольный вопрос "+(i+1),options:["Вариант А","Вариант Б"],correct:0}})),attachments:[{id:"exam-file-1",fileName:"exam-guide.pdf",mimeType:"application/pdf",size:48,bankId:"exam_primary"}]}),
      getExamFile:async(id)=>{window.__examFileRequests.push(id);return {success:true,fileName:"exam-guide.pdf",mimeType:"application/pdf",data:"${pdf}",size:48};}
    };
  `});
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(new URL("../final.js", import.meta.url), "utf8");
  await page.addScriptTag({content:source});
  await page.evaluate(()=>window.renderFinalExamPage("07.01"));
  await page.getByRole("button",{name:"Начать экзамен"}).click();
  await page.getByRole("button",{name:/exam-guide\.pdf/}).waitFor();
  assert.equal(await page.locator(".question").count(),45,"the protected exam must still render all 45 questions");
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:/exam-guide\.pdf/}).click();
  const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),"exam-guide.pdf");
  assert.deepEqual(await page.evaluate(()=>window.__examFileRequests),["exam-file-1"]);
  console.log("Final exam attachment browser audit passed: protected exam resource is visible and downloads through the authenticated API.");
} finally {
  await browser.close();
}
