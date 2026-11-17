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



  await page.evaluate(() => {
    const audit = window.__englishExamAudit;
    window.state.staff = {role:"teacher",email:"teacher@example.invalid",courses:["ENB"]};
    audit.reviewCalls = 0;
    audit.graded = [];
    window.API.getStudents = () => Promise.resolve({success:true,students:[]});
    window.API.getResults = () => Promise.resolve({success:true,results:[]});
    window.API.getAssignments = () => Promise.resolve({success:true,assignments:[]});
    window.API.getActivityLog = () => Promise.resolve({success:true,events:[]});
    window.API.getEnglishFinalExamReviews = () => {
      audit.reviewCalls++;
      return Promise.resolve({success:true,items:[{
        attemptId:"review-attempt-1",studentName:"<img src=x onerror=alert(1)>",studentEmail:"student@example.invalid",
        group:"AUDIT",examId:"english_final_c1_s1",variantId:"EN-C1-S1-V01",submittedAt:"2026-11-16",
        tasks:[{id:"audit_written",prompt:"Write a short report.",points:8,rubric:"Clarity and technical accuracy"}],
        responses:{audit_written:"<script>window.__xss=1</script>Student answer"}
      }]});
    };
    window.API.gradeEnglishFinalExamWritten = (attemptId,grades) => {
      audit.graded.push({attemptId,grades:JSON.parse(JSON.stringify(grades))});
      return Promise.resolve({success:true,result:{grade:5,totalScore:16,totalMax:20}});
    };
    window.renderTeacherDashboard();
  });
  await page.getByRole("button", {name:/Письменные экзамены/}).click();
  await page.waitForSelector("#efReviewItems .ef-review-item", {timeout:15000});
  assert.equal(await page.locator("#efReviewItems img").count(),0,"untrusted student names must be rendered as text");
  assert.equal(await page.locator("#efReviewItems script").count(),0,"untrusted student responses must not create script elements");
  await page.locator("#efReviewItems .ef-review-score").fill("8");
  await page.locator("#efReviewItems .ef-review-feedback").fill("Clear and technically accurate.");
  await page.getByRole("button", {name:"Сохранить оценку"}).click();
  await page.getByText(/Итоговая оценка: 5/).waitFor({timeout:10000});
  const teacherReview = await page.evaluate(() => window.__englishExamAudit);
  assert.equal(teacherReview.reviewCalls,1,"teacher dashboard must load pending written exam reviews");
  assert.equal(teacherReview.graded.length,1,"teacher dashboard must submit the written grade");
  assert.equal(teacherReview.graded[0].attemptId,"review-attempt-1");
  assert.equal(teacherReview.graded[0].grades.audit_written.score,8);
  assert.equal(teacherReview.graded[0].grades.audit_written.feedback,"Clear and technically accurate.");

  console.log("English final-exam browser audit passed: student autosave/retake and teacher written-review workflow work.");
} finally {
  await browser.close();
}
