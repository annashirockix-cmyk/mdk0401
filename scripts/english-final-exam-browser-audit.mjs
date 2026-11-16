import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const baseUrl = process.env.ENGLISH_EXAM_AUDIT_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", error => console.log("ENGLISH_EXAM_PAGE_ERROR", error.stack || error.message));

try {
  const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), `Portal did not load: ${response?.status()}`);
  await page.waitForFunction(() => typeof window.renderEnglishVprPage === "function", null, { timeout: 30000 });

  await page.evaluate(() => {
    document.getElementById("loginOverlay")?.remove();
    const tasks = [
      {id:"audit_listen",type:"single_choice",prompt:"Which day is the workshop visit?",audioText:"The workshop visit is scheduled for Thursday morning.",options:["Tuesday","Thursday","Friday"],points:1},
      {id:"audit_multi",type:"multiple_choice",prompt:"Choose two items.",options:["A drawing","A timetable","A component","A lunch menu"],points:2},
      {id:"audit_order",type:"ordering",prompt:"Put the steps in order.",options:["Check the record","Prepare the report"],points:2},
      {id:"audit_short",type:"short_text",prompt:"Type one technical word.",options:[],points:2},
      {id:"audit_written",type:"written",prompt:"Write a short report.",points:8}
    ];
    const audit = {starts:0,retakeAllowed:false,saved:[],submitted:[],requests:0};
    window.__englishExamAudit = audit;
    window.state = {
      activeCourseId:"ENB",
      student:{role:"student",email:"browser-audit@example.invalid",name:"Browser Audit",group:"AUDIT",courses:["ENB"]},
      results:{}
    };
    window.canAccessCourse = id => id==="ENB" || id==="EN";
    window.confirm = () => true;
    window.API = {
      getEnglishSemesterTests: () => Promise.resolve({success:false,error:"Not imported in browser audit"}),
      startEnglishFinalExam: () => {
        audit.starts++;
        if(audit.starts===2 && !audit.retakeAllowed) {
          return Promise.reject(new Error("Лимит попыток итогового экзамена исчерпан (1 из 1). Запросите дополнительную попытку у преподавателя."));
        }
        return Promise.resolve({
          success:true,attemptId:"browser-audit-attempt-"+audit.starts,
          examId:"english_final_c1_s1",variantId:"EN-C1-S1-V01",
          startedAt:new Date().toISOString(),deadlineAt:new Date(Date.now()+90*60000).toISOString(),
          tasks:tasks
        });
      },
      saveEnglishFinalExamResponses: (attemptId,responses) => {
        audit.saved.push({attemptId,responses:JSON.parse(JSON.stringify(responses))});
        return Promise.resolve({success:true,savedAt:new Date().toISOString()});
      },
      submitEnglishFinalExam: (attemptId,responses) => {
        audit.submitted.push({attemptId,responses:JSON.parse(JSON.stringify(responses))});
        return Promise.resolve({success:true,status:"pending_review",result:{objectiveScore:1,totalMax:20,percent:null}});
      },
      requestTestAttempts: () => {
        audit.requests++;
        audit.retakeAllowed=true;
        return Promise.resolve({success:true,alreadyRequested:false});
      }
    };
    window.renderEnglishVprPage();
  });

  await page.getByRole("button", {name:"Открыть итоговый экзамен"}).first().click();
  await page.waitForSelector(".english-final-persistent-form", {timeout:15000});
  await page.locator(".english-final-persistent-form input[type=text]").fill("latest short answer");
  await page.locator(".english-final-persistent-form textarea").fill("latest written answer before timeout");
  await page.getByRole("button", {name:"Завершить и отправить экзамен"}).click();
  await page.waitForFunction(() => window.__englishExamAudit && window.__englishExamAudit.submitted.length===1, null, {timeout:15000});
  const first = await page.evaluate(() => window.__englishExamAudit);
  assert.ok(first.saved.length>=1,"submit must flush the pending debounced save");
  const lastSaved=first.saved[first.saved.length-1].responses;
  assert.equal(lastSaved.audit_short,"latest short answer");
  assert.equal(lastSaved.audit_written,"latest written answer before timeout");
  assert.equal(first.submitted[0].responses.audit_short,"latest short answer");
  assert.equal(first.submitted[0].responses.audit_written,"latest written answer before timeout");

  await page.evaluate(() => window.renderEnglishVprPage());
  await page.getByRole("button", {name:"Открыть итоговый экзамен"}).first().click();
  await page.getByRole("button", {name:/Запросить дополнительную попытку/}).waitFor({timeout:10000});
  await page.getByRole("button", {name:/Запросить дополнительную попытку/}).click();
  await page.getByText(/Запрос отправлен преподавателю/).waitFor({timeout:10000});
  await page.getByRole("button", {name:/Проверить разрешение и начать/}).click();
  await page.waitForSelector(".english-final-persistent-form", {timeout:15000});
  const retake = await page.evaluate(() => window.__englishExamAudit);
  assert.equal(retake.requests,1,"the student must be able to request one extra attempt");
  assert.equal(retake.retakeAllowed,true,"the retry control must re-check the server after approval");
  assert.equal(retake.starts,3,"the approved retry must start a fresh server attempt");

  console.log("English final-exam browser audit passed: typed answers flush before submit; retake request and approved retry work.");
} finally {
  await browser.close();
}
