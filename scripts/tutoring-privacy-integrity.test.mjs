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
  for (const phrase of ["tutoring:teacher:", "auth_(data)", "hasCourseAccess_(user,courseId)", 'role==="teacher"||user.role==="admin"', 'audienceType==="group"', 'audienceType==="individual"', "writeSetting_(tutoringSettingKey_(teacher.email)", "legacy.updatedBy===teacherEmail"]) {
    assert.ok(block.includes(phrase), "missing backend privacy contract: " + phrase);
  }
  assert.ok(!block.includes('settingValue_("tutoring:"+courseId'));
  const app = read("app.js");
  const controls = read("teacher-controls.js");
  const html = read("index.html");
  const worker = read("service-worker.js");
  const ui = read("tutoring.js");
  assert.ok(!app.includes("menuTutoring"));
  assert.ok(!/editorTutoringPanel|renderTutoringPage|tutorUrl|saveTutorLink/.test(controls));
  assert.ok(!html.includes('href="#/tutoring"'));
  assert.ok(html.includes("tutoring.js?v=3"));
  assert.match(worker, /portal-cache-v\d+/);
  assert.ok(worker.includes("./tutoring.js"));
  for (const phrase of ["tutoringHomeCard", "Кому показывать ссылку", "Только выбранной группе", "Только одному студенту", 'rel="noopener noreferrer"']) {
    assert.ok(ui.includes(phrase), "missing tutoring UI phrase: " + phrase);
  }
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


test("saving tutoring links enforces teacher role and validates the selected audience against the course", () => {
  const source=read("Code.gs");
  const start=source.indexOf("function saveTutoringLink_(data) {");
  const end=source.indexOf("/* ---------- In-app notifications ---------- */",start);
  assert.ok(start>=0&&end>start,"saveTutoringLink_ must be available");
  const fnSource=source.slice(start,end);
  const rows=[
    ["Email","PasswordHash","Name","Group","Role","UpdatedAt","Courses"],
    ["student@example.invalid","","Студент","24-ТМ","student","","07.01"],
    ["other-course@example.invalid","","Студент другой дисциплины","24-ТМ","student","","04.01"]
  ];
  const sheet={getDataRange:()=>({getValues:()=>rows})};
  const headerMap=()=>Object.fromEntries(rows[0].map((name,index)=>[name,index]));
  let actor={role:"teacher",email:"teacher@example.invalid"};
  let saved=null;
  const save=new Function("editor_","users_","headerMap_","hasCourseAccess_","email_","tutoringSettingKey_","writeSetting_",fnSource+"; return saveTutoringLink_;")(
    (_data,_course)=>actor,
    ()=>sheet,
    headerMap,
    (user,course)=>String(user.courses||"").split(",").map(value=>value.trim()).includes(course),
    value=>String(value||"").trim().toLowerCase(),
    email=>"tutoring:teacher:"+String(email||"").trim().toLowerCase(),
    (key,value,updatedBy)=>{saved={key,value:JSON.parse(value),updatedBy};}
  );

  assert.throws(()=>save({courseId:"07.01",url:"javascript:alert(1)",visible:true}),/Ссылка должна начинаться/);
  assert.throws(()=>save({courseId:"07.01",url:"https://example.invalid",audienceType:"group",audienceValue:"24-ТМ "}),/не найдена указанная учебная группа/);
  assert.throws(()=>save({courseId:"07.01",url:"https://example.invalid",audienceType:"individual",audienceValue:"other-course@example.invalid"}),/не найден среди обучающихся/);

  actor={role:"student",email:"student@example.invalid"};
  assert.throws(()=>save({courseId:"07.01",url:"https://example.invalid"}),/только преподаватель/);

  actor={role:"teacher",email:"teacher@example.invalid"};
  const result=save({courseId:"07.01",url:"https://example.invalid/book",title:"  Консультация  ",description:"  Время по договорённости  ",visible:true,audienceType:"individual",audienceValue:"STUDENT@example.invalid"});
  assert.equal(result.success,true);
  assert.equal(saved.key,"tutoring:teacher:teacher@example.invalid");
  assert.equal(saved.updatedBy,"teacher@example.invalid");
  assert.deepEqual(saved.value,{url:"https://example.invalid/book",title:"Консультация",description:"Время по договорённости",visible:true,audienceType:"individual",audienceValue:"STUDENT@example.invalid"});
});
