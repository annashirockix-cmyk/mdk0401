import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 800 }, acceptDownloads: true });
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=", "base64");
const attachment = { id: "att-image-1", fileName: "detail.png", mimeType: "image/png", size: png.length };
const data = png.toString("base64");
let uploads = [], submissions = [];
let mode = "student";
const assignment = {
  id: "assignment-1", courseId: "07.01", title: "Проверка чертежа", topic: "Эскиз",
  workType: "Практика", level: "Базовый", dueAt: "", createdAt: "2026-11-18T09:00:00Z",
  instructions: "Приложите фото результата.", criteria: "", targetType: "group", targetValue: "ТО-21",
  submission: null, submissions: []
};
await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>body{font:16px Arial} .module{padding:12px}</style></head><body><main id="app"></main></body></html>');
await page.addScriptTag({ content: `
window.state = {student:{role:"student",courses:["07.01"],email:"student@example.test",name:"Иван",group:"ТО-21"},staff:null};
window.__uploads=[];window.__submissions=[];
window.API = {
 getAssignments: async()=>({success:true,assignments:window.__mode==="student"?[window.__assignment]:[{...window.__assignment,submissions:window.__teacherSubmissions}]}),
 getStudents: async()=>({success:true,students:[{role:"student",courses:["07.01"],email:"student@example.test",name:"Иван",group:"ТО-21"}]}),
 uploadAssignmentAttachment: async(id,name,dataUrl)=>{window.__uploads.push({id,name,dataUrl});return {success:true,id:"att-image-1",fileName:name,size:80};},
 submitAssignment: async(id,answer,ids)=>{window.__submissions.push({id,answer,ids});window.__assignment.submission={status:"submitted",answer,submittedAt:"2026-11-18T10:00:00Z",attempts:1,attachments:[{id:ids[0],fileName:"detail.png",size:80}],history:[]};return {success:true};},
 getAssignmentAttachment: async(id)=>({success:true,fileName:"detail.png",mimeType:"image/png",data:"${data}",size:80}),
 createAssignment: async()=>({success:true}), gradeAssignment: async()=>({success:true})
};
window.__mode="student";
window.__assignment=${JSON.stringify(assignment)};
window.__teacherSubmissions=[{id:"submission-1",studentName:"Иван",studentEmail:"student@example.test",group:"ТО-21",answer:"Готово",submittedAt:"2026-11-18T10:00:00Z",status:"submitted",attempts:1,attachments:[{id:"att-image-1",fileName:"detail.png",size:80}],history:[]}];
` });
const source = await readFile(new URL("../teacher-tasks.js", import.meta.url), "utf8");
await page.addScriptTag({ content: source });
try {
  await page.evaluate(() => window.renderTeacherTasksPage());
  const fileInput = page.locator('input[name="attachments"]');
  await fileInput.setInputFiles({ name: "detail.png", mimeType: "image/png", buffer: png });
  assert.equal(await page.locator('textarea[name="answer"]').inputValue(), "", "file-only submission should not require a text answer");
  await page.locator(".taSubmit button[type=submit]").click();
  await page.waitForFunction(() => window.__uploads.length === 1 && window.__submissions.length === 1);
  assert.equal(await page.locator(".taAttachment").count(), 1, "student should see their submitted attachment");
  assert.equal(await page.evaluate(() => window.__submissions[0].ids[0]), "att-image-1");

  await page.evaluate(() => {
    window.__mode = "teacher";
    window.state = {staff:{role:"teacher",courses:["07.01"],email:"teacher@example.test"},student:null};
    window.renderTeacherTasksPage();
  });
  await page.waitForSelector(".taAttachment");
  await page.locator(".taAttachment").click();
  await page.waitForSelector("dialog[open] img");
  assert.equal(await page.locator("dialog[open] img").getAttribute("alt"), "detail.png");
  assert.match(await page.locator("dialog[open] img").getAttribute("src"), /^blob:/);
  await page.locator("dialog[open] button").click();
  await page.waitForSelector("dialog", { state: "detached" });
  console.log("Assignment attachment browser audit passed: student upload, submission, teacher image preview and dialog cleanup.");
} finally {
  await browser.close();
}
