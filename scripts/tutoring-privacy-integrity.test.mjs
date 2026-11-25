import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), "utf8");

test("tutoring links are private per teacher and removed from the shared drawer and editor", () => {
  const server = read("Code.gs");
  const start = server.indexOf("function tutoringSettingKey_");
  const end = server.indexOf("/* ---------- In-app notifications ---------- */", start);
  assert.ok(start >= 0 && end > start);
  const block = server.slice(start, end);
  assert.match(block, /tutoring:teacher:/);
  assert.match(block, /auth_\\(data\\)/);
  assert.match(block, /hasCourseAccess_\\(user,courseId\\)/);
  assert.match(block, /role===\"teacher\"\\|\\|user\\.role===\"admin\"/);
  assert.match(block, /audienceType===\"group\"/);
  assert.match(block, /audienceType===\"individual\"/);
  assert.match(block, /writeSetting_\\(tutoringSettingKey_\\(teacher\\.email\\)/);
  assert.match(block, /legacy\\.updatedBy===teacherEmail/);
  assert.doesNotMatch(block, /settingValue_\\(\"tutoring:\"\\+courseId/);
  const app = read("app.js");
  const controls = read("teacher-controls.js");
  const html = read("index.html");
  const worker = read("service-worker.js");
  const ui = read("tutoring.js");
  assert.doesNotMatch(app, /menuTutoring/);
  assert.doesNotMatch(controls, /editorTutoringPanel|renderTutoringPage|tutorUrl|saveTutorLink/);
  assert.doesNotMatch(html, /href=\"#\\/tutoring\"/);
  assert.match(html, /tutoring\\.js\\?v=3/);
  assert.match(worker, /portal-cache-v423/);
  assert.match(worker, /\\.\\/tutoring\\.js/);
  assert.match(ui, /tutoringHomeCard/);
  assert.match(ui, /Кому показывать ссылку/);
  assert.match(ui, /Только выбранной группе/);
  assert.match(ui, /Только одному студенту/);
  assert.match(ui, /rel=\"noopener noreferrer\"/);
});

test("server filters tutoring links by course, selected group and individual student", () => {
  const source=read("Code.gs");
  const start=source.indexOf("function getTutoringLink_(data) {");
  const end=source.indexOf("function saveTutoringLink_",start);
  assert.ok(start>=0&&end>start,"getTutoringLink_ must be available");
  const getTutoringLinkSource=source.slice(start,end);
  const headers=["Email","PasswordHash","Name","Group","Role","UpdatedAt","Courses"];
  const usersRows=[
    headers,
    ["teacher-a@example.invalid","","Преподаватель А","","teacher","","07.01"],
    ["teacher-b@example.invalid","","Преподаватель Б","","teacher","","07.01"]
  ];
  const settingsRows=[
    ["Key","Value","UpdatedAt","UpdatedBy"],
    ["tutoring:teacher:teacher-a@example.invalid",JSON.stringify({url:"https://example.invalid/group",title:"Группа 24-ТМ",visible:true,audienceType:"group",audienceValue:"24-ТМ"}),"","teacher-a@example.invalid"],
    ["tutoring:teacher:teacher-b@example.invalid",JSON.stringify({url:"https://example.invalid/individual",title:"Личная консультация",visible:true,audienceType:"individual",audienceValue:"student-one@example.invalid"}),"","teacher-b@example.invalid"]
  ];
  const makeSheet=rows=>({
    getLastRow:()=>rows.length,
    getRange:(row,column,rowCount,columnCount)=>({getValues:()=>rows.slice(row-1,row-1+rowCount).map(item=>item.slice(column-1,column-1+columnCount))}),
    getDataRange:()=>({getValues:()=>rows})
  });
  const usersSheet=makeSheet(usersRows),settingsSheet=makeSheet(settingsRows);
  const getMap=sheet=>Object.fromEntries(sheet.getDataRange().getValues()[0].map((key,index)=>[key,index]));
  let currentUser={role:"student",email:"student-two@example.invalid",group:"24-тм",courses:"07.01"};
  const getTutoringLink=new Function("auth_","users_","settings_","headerMap_","email_","hasCourseAccess_","tutoringSettingKey_","parseTutoringLink_","legacyTutoringLink_",getTutoringLinkSource+"; return getTutoringLink_;")(
    ()=>currentUser,
    ()=>usersSheet,
    ()=>settingsSheet,
    getMap,
    value=>String(value||"").trim().toLowerCase(),
    (user,course)=>String(user.courses||"").split(",").map(value=>value.trim()).includes(course),
    email=>"tutoring:teacher:"+String(email||"").trim().toLowerCase(),
    raw=>{let value={url:"",title:"Запись на дополнительные занятия",description:"",visible:false,audienceType:"all",audienceValue:""};try{value=Object.assign(value,JSON.parse(raw||"{}"));}catch{}return value;},
    ()=>({url:"",visible:false})
  );
  const groupResult=getTutoringLink({courseId:"07.01"});
  assert.deepEqual(groupResult.links.map(link=>link.teacherName),["Преподаватель А"]);
  currentUser={role:"student",email:"other-student@example.invalid",group:"25-ТМ",courses:"07.01"};
  assert.deepEqual(getTutoringLink({courseId:"07.01"}).links,[]);
  currentUser={role:"student",email:"STUDENT-ONE@example.invalid",group:"25-ТМ",courses:"07.01"};
  assert.deepEqual(getTutoringLink({courseId:"07.01"}).links.map(link=>link.teacherName),["Преподаватель Б"]);
});
