import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "Code.gs"), "utf8");

function extractFunction(name) {
  const marker = "function " + name + "(";
  const start = code.indexOf(marker);
  assert.notEqual(start, -1, `missing server function: ${name}`);
  const open = code.indexOf("{", start);
  let depth = 0, quote = "", escaped = false, lineComment = false, blockComment = false;
  for (let i = open; i < code.length; i++) {
    const c = code[i], n = code[i + 1];
    if (lineComment) { if (c === "\n") lineComment = false; continue; }
    if (blockComment) { if (c === "*" && n === "/") { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "/" && n === "/") { lineComment = true; i++; continue; }
    if (c === "/" && n === "*") { blockComment = true; i++; continue; }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return code.slice(start, i + 1);
  }
  throw new Error("unterminated function " + name);
}


test("persistent final-exam tables have explicit private attempt and variant columns and are initialized by setupPortal", () => {
  const headersBlock = code.slice(code.indexOf("const HEADERS = {"), code.indexOf("/* ---------- HTTP entry points ---------- */"));
  assert.match(headersBlock, /EnglishExamVariantsBank:\s*\["ExamId", "CourseNo", "CourseId", "Track", "Semester", "VariantId", "BlueprintId", "VariantJSON", "Active", "UpdatedAt", "UpdatedBy"\]/);
  assert.match(headersBlock, /EnglishExamAttempts:\s*\["AttemptId", "StudentEmail", "StudentName", "Group", "CourseId", "ExamId", "VariantId", "Status", "StartedAt", "DeadlineAt", "SubmittedAt", "AttemptJSON", "ResponsesJSON", "ResultJSON", "UpdatedAt"\]/);
  const setup = extractFunction("setupPortal");
  assert.match(setup, /"EnglishExamVariantsBank"/);
  assert.match(setup, /"EnglishExamAttempts"/);
});

test("student-facing final exam sanitizer removes answer-key field families recursively", () => {
  const source = extractFunction("sanitizeEnglishFinalExamTask_");
  const sanitize = new Function(source + "; return sanitizeEnglishFinalExamTask_;")();
  const input = {
    id: "task_1", prompt: "Choose the correct answer",
    correctIndex: 2, correctAnswers: [1, 2], correct_index: 0,
    answer_key: "secret", expected_answer: "secret", modelAnswer: "secret",
    options: ["A", "B"],
    rubric: "private rubric",
    nested: [{ answerText: "secret", explanation: "private", responsePrompt: "visible" }]
  };
  assert.deepEqual(sanitize(input), {
    id: "task_1", prompt: "Choose the correct answer",
    options: ["A", "B"],
    nested: [{ responsePrompt: "visible" }]
  });
});

const registrySource = extractFunction("validateEnglishExamVariantRegistry_");
const validateRegistry = new Function(registrySource + "; return validateEnglishExamVariantRegistry_;")();

function validFinalVariantPayload() {
  return {title:"English final assessment",time:90,maxScore:10,tasks:Array.from({length:10},(_,i)=>({
    id:"task_"+(i+1),type:"single_choice",prompt:"Choose the correct form in context "+(i+1)+".",
    options:["works","work","working","worked"],correctIndex:0,points:1
  }))};
}

function validExamRegistry() {
  return Array.from({length:10}, (_, slot) => {
    const courseNo = Math.floor(slot / 2) + 1;
    const semester = slot % 2 + 1;
    return {
      courseNo, courseId:courseNo >= 3 ? "ENT" : "ENB",
      track:courseNo >= 3 ? "technical" : "basic",
      semester,
      variants:Array.from({length:15}, (_, variant) => ({
        variantId:"EN_C0" + courseNo + "_S" + semester + "_V" + String(variant + 1).padStart(2,"0"),
        blueprintId:"BP_C0" + courseNo + "_S" + semester,
        variantJSON:validFinalVariantPayload()
      }))
    };
  });
}

test("final exam import validates task types, private answer keys, scoring and duration before activation", () => {
  const source = extractFunction("validateEnglishFinalVariantPayload_");
  const validate = new Function(source + "; return validateEnglishFinalVariantPayload_;")();
  const good = validFinalVariantPayload();
  assert.deepEqual(validate(good,"V01"),{taskCount:10,maxScore:10,durationMinutes:90});
  const noKey = structuredClone(good); delete noKey.tasks[0].correctIndex;
  assert.throws(()=>validate(noKey,"NO_KEY"),/correctIndex/);
  const badType = structuredClone(good); badType.tasks[0].type="drag_drop";
  assert.throws(()=>validate(badType,"BAD_TYPE"),/неподдерживаемый тип/);
  const badScore = structuredClone(good); badScore.maxScore=40;
  assert.throws(()=>validate(badScore,"BAD_SCORE"),/maxScore/);
  const repeated = structuredClone(good); repeated.tasks[1].prompt=repeated.tasks[0].prompt;
  assert.throws(()=>validate(repeated,"DUPLICATE"),/повторяется формулировка/);
  assert.match(code,/validateEnglishFinalVariantPayload_\(payload, String\(variant\.variantId\)\)/);
});

test("fifteen authored Basic English final-exam pilots match the protected runtime schema", () => {
  const pilot1 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v01-pilot.json"),"utf8"));
  const pilot2 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v02-pilot.json"),"utf8"));
  const pilot3 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v03-pilot.json"),"utf8"));
  const pilot4 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v04-pilot.json"),"utf8"));
  const pilot5 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v05-pilot.json"),"utf8"));
  const pilot6 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v06-pilot.json"),"utf8"));
  const pilot7 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v07-pilot.json"),"utf8"));
  const pilot8 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v08-pilot.json"),"utf8"));
  const pilot9 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v09-pilot.json"),"utf8"));
  const pilot10 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v10-pilot.json"),"utf8"));
  const pilot11 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v11-pilot.json"),"utf8"));
  const pilot12 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v12-pilot.json"),"utf8"));
  const pilot13 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v13-pilot.json"),"utf8"));
  const pilot14 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v14-pilot.json"),"utf8"));
  const pilot15 = JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c01-s01-v15-pilot.json"),"utf8"));
  const source = extractFunction("validateEnglishFinalVariantPayload_");
  const validate = new Function(source + "; return validateEnglishFinalVariantPayload_;")();
  const pilots=[pilot1,pilot2,pilot3,pilot4,pilot5,pilot6,pilot7,pilot8,pilot9,pilot10,pilot11,pilot12,pilot13,pilot14,pilot15];
  pilots.forEach((pilot,index)=>{
    assert.equal(pilot.examId,"english_final_c1_s1");
    assert.equal(pilot.courseNo,1);
    assert.equal(pilot.track,"basic");
    assert.equal(pilot.tasks.length,10);
    assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1);
    assert.ok(pilot.tasks.some(task=>task.audioText));
    assert.deepEqual(validate(pilot,"C1-S1-V"+String(index+1).padStart(2,"0")),{taskCount:10,maxScore:20,durationMinutes:90});
  });
  pilots.forEach(pilot=>{
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{
      if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;
      if(task.type==="multiple_choice")task.correctIndices.forEach(index=>distribution["ABCD"[index]]++);
    });
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
  });
  for(let a=0;a<pilots.length;a++)for(let b=a+1;b<pilots.length;b++){
    const prompts=new Set(pilots[a].tasks.map(task=>task.prompt.trim().toLowerCase()));
    assert.equal(pilots[b].tasks.some(task=>prompts.has(task.prompt.trim().toLowerCase())),false);
    assert.notEqual(pilots[a].tasks.find(task=>task.audioText).audioText,pilots[b].tasks.find(task=>task.audioText).audioText);
  }
});

test("fifteen authored Basic English Course 1 Semester 2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c01-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    assert.equal(pilot.examId,"english_final_c1_s2"); assert.equal(pilot.courseNo,1); assert.equal(pilot.track,"basic"); assert.equal(pilot.semester,2);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C1-S2-V"+String(index+1).padStart(2,"0")),{taskCount:10,maxScore:20,durationMinutes:90});
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2}); assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks.find(t=>t.audioText).audioText)).size,15);
});


test("fifteen authored Basic English Course 2 Semester 1 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c02-s01-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c2_s1"); assert.equal(pilot.courseNo,2); assert.equal(pilot.track,"basic"); assert.equal(pilot.semester,1);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C2-S1-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c2s1v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/Could|Let\x27s|Would|Of course|Hand it in|Report it|Give a brief|Please find/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("fifteen authored Basic English Course 2 Semester 2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c02-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c2_s2"); assert.equal(pilot.courseNo,2); assert.equal(pilot.track,"basic"); assert.equal(pilot.semester,2);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C2-S2-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c2s2v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/I would like|I used this source|That is not quite|Do not follow|Our results suggest|Do you have a reliable|Would it be possible|Please check|Let's check|Could you tell me|Tree planting could|The data show|I am not qualified|Thank you for telling/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("fifteen authored Technical English Course 3 Semester 1 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c03-s01-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c3_s1"); assert.equal(pilot.courseNo,3); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,1);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C3-S1-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c3s1v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/Could you|I have noticed|Ask the supervisor|Let's compare|Check the approved|Record the actual|Which instrument|The Wednesday morning/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("fifteen authored Technical English Course 3 Semester 2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c03-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c3_s2"); assert.equal(pilot.courseNo,3); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,2);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C3-S2-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c3s2v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/Could you identify|Let's use the correct term|different roles in the sample|Would turning|Let's compare|Could you confirm which datum|I have noticed|Could we review the sequence|measured value is outside|Check the approved revision|material has not arrived|Could we check the document register|Check the approved reference|Could you explain how the programmed geometry|Could you add the sample period|Could we evaluate the proposal/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});


test("fifteen authored Technical English C4-S1 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c04-s01-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c4_s1"); assert.equal(pilot.courseNo,4); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,1);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C4-S1-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c4s1v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/Could you|I have noticed|Hand it in|We should use equal time periods|display became blank twice|rated voltage|Check its printed code|rating is unclear|indicator did not light|full model references|Could we check the cable|Could we compare their data sheets|Could you explain the contact|problem appears intermittently|Could we confirm the signal|Record the mismatch/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("fifteen authored Technical English C4-S2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c04-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c4_s2"); assert.equal(pilot.courseNo,4); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,2);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C4-S2-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c4s2v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/Could you identify|Let's use the correct term|sensor provides input|Could we check the input|This may be one possible|Could we confirm the exact protocol|I can provide the version|Could we check the address|Could we add the correct unit|I cannot share credentials|Check the device register|Could we update the model|Please check the measurement method|Could we confirm the unit's service status|cause has not yet been established/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("fifteen authored Technical English C5-S1 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c05-s01-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c5_s1"); assert.equal(pilot.courseNo,5); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,1);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C5-S1-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c5s1v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/Could we confirm the correct task|observed condition differs|separate the hypothesis|Could the documentation team|Check the document register|Could we confirm the correct task applicability|task remains open|evidence is recorded for review|Could we compare the operating conditions|Check the document register for the current approved version|cause remains under investigation|Could we check the serial number|State what is known|Could the technical team confirm|Could we review delivery data/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("fifteen authored Technical English C5-S2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c05-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const allPrompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c5_s2"); assert.equal(pilot.courseNo,5); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,2);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C5-S2-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c5s2v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{allPrompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
    const functional=pilot.tasks.find(task=>task.id.endsWith("_f01"));
    assert.match(functional.options[functional.correctIndex],/task remains open|Could we identify who is responsible|trends coincide|timing may be relevant|This copy is still a draft|Could we identify the record|Could you confirm which connector|result is encouraging|Raise the discrepancy|This action depends on the confirmed|references do not match|Could we identify the requirement|This interface remains open|How could we measure|sources differ on this value/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("first pilot variants use plausible same-category listening and reading distractors",()=>{
  const files=[
    "c02-s01","c02-s02","c03-s01","c03-s02","c04-s01","c04-s02","c05-s01","c05-s02"
  ];
  const placeholders=/^(At the college library|At the town centre|At the bus station|To borrow a laptop|To meet a relative|To buy a ticket|At the sports centre|In the computer room)$/i;
  const wrongTimeOptions=/^(On Friday|Next month|After the event)$/i;
  files.forEach(slot=>{
    const pilot=JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-${slot}-v01-pilot.json`),"utf8"));
    ["l01","l02","r01","r02"].forEach(suffix=>{
      const task=pilot.tasks.find(item=>item.id.endsWith("_"+suffix));
      assert.ok(task,`${slot} is missing ${suffix}`);
      assert.ok(Array.isArray(task.options)&&task.options.length===4);
      assert.ok(!task.options.some(option=>placeholders.test(option.trim())),`${task.id} still has generic distractors: ${task.options.join(" | ")}`);
    });
  });
  const secondRound=["c02-s02","c03-s02","c04-s02","c05-s02"];
  secondRound.forEach(slot=>{
    const pilot=JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-${slot}-v02-pilot.json`),"utf8"));
    ["l01","l02","r01","r02"].forEach(suffix=>{
      const task=pilot.tasks.find(item=>item.id.endsWith("_"+suffix));
      assert.ok(task,`${slot} V02 is missing ${suffix}`);
      assert.ok(!task.options.some(option=>placeholders.test(option.trim())),`${task.id} still has generic distractors: ${task.options.join(" | ")}`);
    });
  });
  const career=JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-c02-s01-v01-pilot.json"),"utf8"));
  const prep=career.tasks.find(task=>task.id==="c2s1v01_l02");
  assert.match(prep.prompt,/Which two things should students prepare/);
  assert.match(prep.options[prep.correctIndex],/short CV and two questions/);
});

test("Courses 1 and 2 have contextual distractors and valid keys in all 60 variants",()=>{
  const generic=/^(At the college library|At the town centre|At the bus station|To borrow a laptop|To meet a relative|To buy a ticket|At the sports centre|In the computer room)$/i;
  for(const course of ["c01","c02"]){
    for(const semester of ["s01","s02"]){
      for(let variant=1;variant<=15;variant++){
        const file=path.join(root,`docs/english-final-exam-${course}-${semester}-v${String(variant).padStart(2,"0")}-pilot.json`);
        const pilot=JSON.parse(fs.readFileSync(file,"utf8"));
        assert.equal(pilot.tasks.length,10,`${course}-${semester}-v${variant} must contain ten tasks`);
        assert.equal(pilot.tasks.reduce((sum,task)=>sum+Number(task.points||0),0),20,`${course}-${semester}-v${variant} must total 20 points`);
        for(const suffix of ["l01","l02","r01","r02"]){
          const task=pilot.tasks.find(item=>item.id.endsWith("_"+suffix));
          assert.ok(task,`${course}-${semester}-v${variant} is missing ${suffix}`);
          assert.ok(Array.isArray(task.options)&&task.options.length===4,`${task.id} must have four options`);
          assert.ok(Number.isInteger(task.correctIndex)&&task.correctIndex>=0&&task.correctIndex<task.options.length,`${task.id} has an invalid answer key`);
          task.options.forEach((option,index)=>{
            if(index!==task.correctIndex)assert.ok(!generic.test(option.trim()),`${task.id} retains a generic distractor: ${option}`);
          });
        }
      }
    }
  }
});

test("Course 5 reading answer keys follow the reviewed correct options in all 30 variants",()=>{
  const expected={1:{},2:{}};
  for(const semester of [1,2]){
    for(let variant=1;variant<=15;variant++){
      const file=path.join(root,`docs/english-final-exam-c05-s0${semester}-v${String(variant).padStart(2,"0")}-pilot.json`);
      const pilot=JSON.parse(fs.readFileSync(file,"utf8"));
      const reading=[pilot.tasks.find(task=>task.id.endsWith("_r01")),pilot.tasks.find(task=>task.id.endsWith("_r02"))];
      assert.ok(reading.every(Boolean),`C5-S${semester}-V${variant} is missing reading items`);
      const expectedKeys=expected[semester][variant]||[2,3];
      assert.deepEqual(reading.map(task=>task.correctIndex),expectedKeys,`C5-S${semester}-V${variant} reading keys`);
      reading.forEach(task=>assert.ok(task.correctIndex>=0&&task.correctIndex<task.options.length,`${task.id} key is out of range`));
    }
  }
});

test("all Course 5 listening items use same-category distractors and script-supported answer text",()=>{
  const placeholders=/^(At the college library|At the town centre|At the bus station|On Friday|Next month|After the event)$/i;
  for(const semester of [1,2]){
    for(let variant=1;variant<=15;variant++){
      const file=path.join(root,`docs/english-final-exam-c05-s0${semester}-v${String(variant).padStart(2,"0")}-pilot.json`);
      const pilot=JSON.parse(fs.readFileSync(file,"utf8"));
      for(const suffix of ["l01","l02"]){
        const task=pilot.tasks.find(item=>item.id.endsWith("_"+suffix));
        assert.ok(task, `C5-S${semester}-V${variant} is missing ${suffix}`);
        assert.ok(task.audioText&&task.audioText.length>0,`${task.id} is missing its listening script`);
        assert.ok(task.options.length===4&&!task.options.some(option=>placeholders.test(option.trim())),`${task.id} has a generic or wrong-category distractor`);
        assert.ok(task.correctIndex>=0&&task.correctIndex<task.options.length,`${task.id} has an invalid answer key`);
        const answerTokens=task.options[task.correctIndex].toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)*/g)||[];
        const script=task.audioText.toLowerCase();
        answerTokens.filter(token=>!["the","a","an","and","at","on","of","for","from","to"].includes(token)).forEach(token=>{
          assert.ok(script.includes(token),`${task.id} answer token "${token}" is absent from its script`);
        });
      }
    }
  }
});

test("Course 3 and 4 variants use same-category distractors in listening and reading tasks",()=>{
  const placeholders=/^(At the college library|At the town centre|At the bus station|To borrow a laptop|To meet a relative|To buy a ticket|At the sports centre|In the computer room)$/i;
  const wrongTimeOptions=/^(On Friday|Next month|After the event)$/i;
  const slots=[
    {course:"c03",semester:"s01",first:2},
    {course:"c03",semester:"s02",first:3},
    {course:"c04",semester:"s01",first:2},
    {course:"c04",semester:"s02",first:3}
  ];
  for(const slot of slots){
    for(let variant=slot.first;variant<=15;variant++){
      const file=path.join(root,`docs/english-final-exam-${slot.course}-${slot.semester}-v${String(variant).padStart(2,"0")}-pilot.json`);
      const pilot=JSON.parse(fs.readFileSync(file,"utf8"));
      for(const suffix of ["l01","l02","r01","r02"]){
        const task=pilot.tasks.find(item=>item.id.endsWith("_"+suffix));
        assert.ok(task,`${slot.course}-${slot.semester}-V${variant} is missing ${suffix}`);
        assert.ok(task.correctIndex>=0&&task.correctIndex<task.options.length,`${task.id} has an invalid answer key`);
        assert.ok(task.options.length===4&&!task.options.some(option=>placeholders.test(option.trim())),`${task.id} contains a generic distractor`);
        if(suffix==="l02")assert.ok(!task.options.some(option=>wrongTimeOptions.test(option.trim())),`${task.id} contains a wrong-category time distractor`);
      }
    }
  }
});

test("all 150 final exam variants have globally unique task IDs and prompts",()=>{
  const slots=[["c01","s01"],["c01","s02"],["c02","s01"],["c02","s02"],["c03","s01"],["c03","s02"],["c04","s01"],["c04","s02"],["c05","s01"],["c05","s02"]];
  const variants=slots.flatMap(([course,semester])=>Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-${course}-${semester}-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8"))));
  assert.equal(variants.length,150);
  variants.forEach((variant,index)=>assert.equal(variant.tasks.length,10,`variant ${index+1} (${variant.examId}) must contain ten tasks`));
  variants.forEach((variant,index)=>variant.tasks.forEach((task,taskIndex)=>assert.equal(typeof task.id,"string",`variant ${index+1} task ${taskIndex+1} must have a string ID`)));
  const taskIds=variants.flatMap(variant=>variant.tasks.map(task=>task.id));
  const prompts=variants.flatMap(variant=>variant.tasks.map(task=>task.prompt.trim().toLowerCase()));
  assert.equal(taskIds.length,1500);
  const duplicateTaskIds=taskIds.filter((id,index)=>taskIds.indexOf(id)!==index);
  assert.equal(new Set(taskIds).size,taskIds.length,`duplicate task IDs: ${[...new Set(duplicateTaskIds)].join(", ")}`);
  const duplicatePrompts=prompts.filter((prompt,index)=>prompts.indexOf(prompt)!==index);
  assert.equal(new Set(prompts).size,prompts.length,`duplicate prompts: ${[...new Set(duplicatePrompts)].join(" || ")}`);
});

test("fifteen authored Technical English Course 5 Semester 1 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c05-s01-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
  const source=extractFunction("validateEnglishFinalVariantPayload_");
  const validate=new Function(source+"; return validateEnglishFinalVariantPayload_;")();
  const prompts=[];
  pilots.forEach((pilot,index)=>{
    const variant=String(index+1).padStart(2,"0");
    assert.equal(pilot.examId,"english_final_c5_s1"); assert.equal(pilot.courseNo,5); assert.equal(pilot.track,"technical"); assert.equal(pilot.semester,1);
    assert.equal(pilot.tasks.length,10); assert.equal(pilot.tasks.filter(task=>task.type==="written").length,1); assert.equal(pilot.tasks.filter(task=>task.audioText).length,2);
    assert.deepEqual(validate(pilot,"C5-S1-V"+variant),{taskCount:10,maxScore:20,durationMinutes:90});
    assert.ok(pilot.tasks.every(task=>task.id.startsWith("c5s1v"+variant+"_")));
    const distribution={A:0,B:0,C:0,D:0};
    pilot.tasks.forEach(task=>{prompts.push(task.prompt.trim().toLowerCase());if(task.type==="single_choice")distribution["ABCD"[task.correctIndex]]++;if(task.type==="multiple_choice")task.correctIndices.forEach(i=>distribution["ABCD"[i]]++);});
    assert.deepEqual(distribution,{A:2,B:2,C:2,D:2});
    assert.deepEqual(pilot.tasks.find(task=>task.type==="multiple_choice").correctIndices,[2,3]);
  });
  assert.equal(new Set(prompts).size,150);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("combined 150-variant editorial pilot registry matches all ten slots and remains blocked from import", () => {
  const bundle=JSON.parse(fs.readFileSync(path.join(root,"docs/english-final-exam-registry-v1-pilot.json"),"utf8"));
  assert.equal(bundle.status,"pilot_for_editorial_review");
  assert.equal(bundle.exams.length,10);
  const registrySource=extractFunction("validateEnglishExamVariantRegistry_");
  const validateRegistry=new Function(registrySource+"; return validateEnglishExamVariantRegistry_;")();
  assert.deepEqual(validateRegistry(bundle.exams),{examCount:10,variantCount:150,basicSlots:4,technicalSlots:6});
  const payloadSource=extractFunction("validateEnglishFinalVariantPayload_");
  const validatePayload=new Function(payloadSource+"; return validateEnglishFinalVariantPayload_;")();
  let count=0; const ids=[];
  bundle.exams.forEach(exam=>{
    assert.equal(exam.variants.length,15);
    exam.variants.forEach(variant=>{
      count++;
      assert.equal(variant.variantJSON.sourceNotes.status,"pilot_for_editorial_review");
      assert.deepEqual(validatePayload(variant.variantJSON,variant.variantId),{taskCount:10,maxScore:20,durationMinutes:90});
      variant.variantJSON.tasks.forEach(task=>ids.push(task.id));
    });
  });
  assert.equal(count,150);
  assert.equal(new Set(ids).size,1500);
  const importer=extractFunction("importEnglishExamVariants_");
  assert.match(importer,/actor\.role !== "admin"/);
  assert.match(importer,/payload\.sourceNotes\.status !== "approved_for_import"/);
});
 
test("final exam start and resume persist attempts and bind them to the authenticated student", () => {
  const start = extractFunction("startEnglishFinalExam_");
  const resume = extractFunction("resumeEnglishFinalExam_");
  const sanitizeTask = extractFunction("sanitizeEnglishFinalExamTask_");
  assert.match(start, /auth_\(data\)/);
  assert.match(start, /hasCourseAccess_\(user, courseId\)/);
  assert.match(start, /LockService\.getScriptLock\(\)/);
  assert.match(start, /EnglishExamVariantsBank/);
  assert.match(start, /EnglishExamAttempts/);
  assert.match(start, /Status:"in_progress"/);
  assert.match(start, /AttemptJSON:JSON\.stringify\(privateSnapshot\)/);
  assert.match(start, /shuffleEnglishFinalExamTasks_\(tasks\)/);
  assert.match(start, /optionMaps:randomized\.optionMaps/);
  assert.match(start, /sanitizeEnglishFinalExamTask_\(randomized\.tasks\)/);
  assert.match(resume, /email_\(row\[m\.StudentEmail\]\)!==user\.email/);
  assert.match(resume, /row\[m\.Status\]\)!=="in_progress"/);
  assert.match(resume, /DeadlineAt/);
  assert.match(resume, /englishFinalExamDisplayTasks_\(snapshot\.tasks\|\|\[\],snapshot\.optionMaps\|\|\{\}\)/);
  assert.match(resume, /sanitizeEnglishFinalExamTask_\(englishFinalExamDisplayTasks_/);
  assert.match(sanitizeTask, /answer|correct|solution|rubric|grading/i);
  assert.match(code, /case "startenglishfinalexam": result = startEnglishFinalExam_\(data\); break;/);
  assert.match(code, /case "resumeenglishfinalexam": result = resumeEnglishFinalExam_\(data\); break;/);
});

test("final-exam options shuffle and map back correctly across all 150 course variants",()=>{
  const shuffleSource=extractFunction("shuffleEnglishFinalExamTasks_");
  const displaySource=extractFunction("englishFinalExamDisplayTasks_");
  const canonicalSource=extractFunction("englishFinalExamCanonicalOptionIndex_");
  const shuffle=new Function(shuffleSource+"; return shuffleEnglishFinalExamTasks_;")();
  const display=new Function(displaySource+"; return englishFinalExamDisplayTasks_;")();
  const canonical=new Function(canonicalSource+"; return englishFinalExamCanonicalOptionIndex_;")();
  const slots=[["c01","s01"],["c01","s02"],["c02","s01"],["c02","s02"],["c03","s01"],["c03","s02"],["c04","s01"],["c04","s02"],["c05","s01"],["c05","s02"]];
  const originalRandom=Math.random;
  let variantCount=0,optionTaskCount=0,changedOrderCount=0,gradedTaskCount=0,orderingTaskCount=0;
  Math.random=()=>0.999;
  try{
    for(const [course,semester] of slots){
      for(let variant=1;variant<=15;variant++){
        const file=path.join(root,`docs/english-final-exam-${course}-${semester}-v${String(variant).padStart(2,"0")}-pilot.json`);
        const pilot=JSON.parse(fs.readFileSync(file,"utf8"));
        const randomized=shuffle(pilot.tasks);
        const resumed=display(pilot.tasks,randomized.optionMaps);
        variantCount++;
        randomized.tasks.forEach((shown,index)=>{
          const original=pilot.tasks[index];
          const id=String(original.id||original.questionId||index);
          if(!Array.isArray(original.options)||original.options.length<2)return;
          optionTaskCount++;
          const map=randomized.optionMaps[id];
          assert.ok(Array.isArray(map),`${id} has no private option map`);
          assert.deepEqual([...map].sort((a,b)=>a-b),original.options.map((_,i)=>i),`${id} map must contain every original option once`);
          assert.deepEqual(shown.options,map.map(i=>original.options[i]),`${id} displayed options do not follow the map`);
          assert.deepEqual(resumed[index].options,shown.options,`${id} option order must survive resume`);
          if(shown.options.some((option,i)=>option!==original.options[i]))changedOrderCount++;
          if(original.type==="single_choice"||original.type==="multiple_choice"){
            gradedTaskCount++;
            const correct=original.type==="single_choice"?[original.correctIndex]:original.correctIndices;
            correct.forEach(originalIndex=>{
              const displayIndex=map.indexOf(originalIndex);
              assert.notEqual(displayIndex,-1,`${id} correct option is missing from the display map`);
              assert.equal(canonical({optionMaps:randomized.optionMaps},id,displayIndex),originalIndex,`${id} shuffled answer must map back to its protected key`);
            });
          }
          if(original.type==="ordering"){
            orderingTaskCount++;
            assert.deepEqual(shown.correctOrder,original.correctOrder,`${id} ordering key must remain canonical`);
          }
        });
      }
    }
  }finally{Math.random=originalRandom;}
  assert.equal(variantCount,150);
  assert.ok(optionTaskCount>0);
  assert.equal(changedOrderCount,optionTaskCount,'every option-bearing task must receive a changed order');
  assert.ok(gradedTaskCount>0&&orderingTaskCount>0);
});

test("final exam attempt limits count persisted attempts and honor teacher-granted retries", () => {
  const source=extractFunction("getTestAttemptStatus_");
  const statusFn=new Function(
    "auth_","hasCourseAccess_","editor_","email_","userByEmail_","settingValue_",
    "sameCourseId_","ensureSheet_","headerMap_","resultAttemptRows_",
    source+"; return getTestAttemptStatus_;"
  )(
    () => ({role:"student",email:"student@example.test"}),
    () => true,
    () => ({}),
    value => String(value||"").toLowerCase(),
    () => null,
    () => "1",
    (a,b) => a===b,
    () => ({
      getLastRow:() => 3,
      getLastColumn:() => 15,
      getRange:() => ({getValues:() => [
        ["attempt-1","student@example.test","","","","english_final_c1_s1","v01","submitted"],
        ["attempt-2","student@example.test","","","","english_final_c1_s1","v02","expired"]
      ]})
    }),
    () => ({StudentEmail:1,ExamId:5}),
    () => []
  );
  const status=statusFn({courseId:"ENB",testId:"english_final_c1_s1"});
  assert.equal(status.used,2);
  assert.equal(status.limit,2);
  assert.equal(status.remaining,0);
  assert.equal(status.allowed,false);

  const start=extractFunction("startEnglishFinalExam_");
  assert.match(start,/usedAttempts\+\+/);
  assert.match(start,/settingValue_\("testAttempts:"\+user\.email\+":"\+courseId\+":"\+examId\)/);
  assert.match(start,/if\(usedAttempts>=attemptLimit\)/);
  assert.ok(start.indexOf("if(usedAttempts>=attemptLimit)")<start.indexOf('const bank=ensureSheet_("EnglishExamVariantsBank")'));

  const controls=fs.readFileSync(path.join(root,"teacher-controls.js"),"utf8");
  assert.match(controls,/english_final_c/);
  assert.doesNotMatch(controls,/__final__/);
  const ui=fs.readFileSync(path.join(root,"english-vpr-engine.js"),"utf8");
  assert.match(ui,/requestTestAttempts\(courseId,testId\)/);
  assert.match(ui,/Запросить дополнительную попытку/);
  assert.match(ui,/Проверить разрешение и начать/);
});

test("student English final-exam UI starts persistent course/semester attempts and autosaves responses", () => {
  const ui = fs.readFileSync(path.join(root, "english-vpr-engine.js"), "utf8");
  assert.match(ui, /startEnglishFinalExam\(courseNo,semester\)/);
  assert.match(ui, /saveEnglishFinalExamResponses\(attempt\.attemptId,payload\)/);
  assert.match(ui, /submitEnglishFinalExam\(attempt\.attemptId,responses\)/);
  assert.match(ui, /deadlineAt/);
  assert.match(ui, /multiple_choice/);
  assert.match(ui, /short_text/);
  assert.match(ui, /Итоговые экзамены по курсам/);
  assert.match(ui, /attempt\.responses\|\|\{\}/);
  assert.match(ui, /input\.addEventListener\("input",function\(\)\{responses\[id\]=input\.value;queueSave\(\);\}\)/);
  assert.match(ui, /area\.addEventListener\("input",function\(\)\{responses\[id\]=area\.value;queueSave\(\);\}\)/);
  assert.match(ui, /window\.setTimeout\(function\(\)\{saveTimer=null;saveNow\(\);\},500\)/);
  assert.match(ui, /if\(saveTimer\)\{window\.clearTimeout\(saveTimer\);saveTimer=null;\}\s*saveNow\(true\);\s*saveQueue\.then/);
});

test("teacher dashboard exposes a written-exam review panel and submits explicit per-task grades", () => {
  const dashboard = fs.readFileSync(path.join(root, "teacher-dashboard.js"), "utf8");
  assert.match(dashboard, /efReviewRefresh/);
  assert.match(dashboard, /getEnglishFinalExamReviews/);
  assert.match(dashboard, /gradeEnglishFinalExamWritten/);
  assert.match(dashboard, /Укажите баллы за каждое письменное задание/);
  assert.match(dashboard, /ef-review-feedback/);
  assert.match(dashboard, /efVariantImportOpen/);
  assert.match(dashboard, /staff\.role!=="admin"/);
  assert.match(dashboard, /importEnglishExamVariants\(exams\)/);
  assert.match(dashboard, /count!==150/);
  assert.match(dashboard, /Текущая активная версия будет заменена/);
});

test("teacher review queue filters by assigned course and exposes written responses", () => {
  const list = extractFunction("getEnglishFinalExamReviews_");
  assert.match(list, /teacher\.role!=="admin" && teacher\.role!=="teacher"/);
  assert.match(list, /hasCourseAccess_\(teacher,courseId\)/);
  assert.match(list, /pending_review/);
  assert.match(list, /ResponsesJSON/);
  assert.match(code, /case "getenglishfinalexamreviews": result = getEnglishFinalExamReviews_\(data\); break;/);
});

test("completed English final exams are upserted into the common Results journal", () => {
  const publish = extractFunction("upsertEnglishFinalExamJournal_");
  assert.match(publish, /results_\(\)/);
  assert.match(publish, /TestId:testId/);
  assert.match(publish, /Grade:grade/);
  assert.match(publish, /Score:score/);
  assert.match(publish, /MaxScore:maxScore/);
  assert.match(publish, /result\.manualGrades/);
  assert.match(publish, /Feedback:/);
  assert.match(publish, /updateMappedRecord_\(sh,existing,record\)/);
  assert.match(code, /if\(status==="submitted"\) upsertEnglishFinalExamJournal_/);
  assert.match(code, /upsertEnglishFinalExamJournal_\(row,m,finalResult,teacher\.email\)/);
});

test("written grading validates teacher scope and per-task score bounds before finalizing", () => {
  const grade = extractFunction("gradeEnglishFinalExamWritten_");
  assert.match(grade, /hasCourseAccess_\(teacher,courseId\)/);
  assert.match(grade, /known\[id\]===undefined/);
  assert.match(grade, /score<0\|\|score>known\[id\]/);
  assert.match(grade, /gradeFromPercent_\(percent\)/);
  assert.match(grade, /Status:"submitted"/);
  assert.match(code, /case "gradeenglishfinalexamwritten": result = gradeEnglishFinalExamWritten_\(data\); break;/);
});

test("final exam submission grades objective tasks on the server and routes written work to review", () => {
  const submit = extractFunction("submitEnglishFinalExam_");
  assert.match(submit, /auth_\(data\)/);
  assert.match(submit, /email_\(row\[m\.StudentEmail\]\)!==user\.email/);
  assert.match(submit, /correctIndex/);
  assert.match(submit, /correctIndices/);
  assert.match(submit, /correctOrder/);
  assert.match(submit, /acceptedAnswers/);
  assert.match(submit, /pending_review/);
  assert.match(submit, /ResultJSON:JSON\.stringify\(result\)/);
  assert.match(submit, /Status:status/);
  assert.match(code, /case "submitenglishfinalexam": result = submitEnglishFinalExam_\(data\); break;/);
});

test("final exam sanitization removes exact grading fields but preserves legitimate technical vocabulary", () => {
  const source = extractFunction("sanitizeEnglishFinalExamTask_");
  const sanitize = new Function(source + "; return sanitizeEnglishFinalExamTask_;")();
  const safe = sanitize({prompt:"Explain the keyboard layout.", keyboard:"QWERTY", keyTerm:"spindle", correctOption:2, expectedAnswer:"M03", modelAnswer:"M03", teacherNotes:"private", correctOrder:[1,2]});
  assert.equal(safe.prompt,"Explain the keyboard layout.");
  assert.equal(safe.keyboard,"QWERTY");
  assert.equal(safe.keyTerm,"spindle");
  for (const key of ["correctOption","expectedAnswer","modelAnswer","teacherNotes","correctOrder"]) assert.equal(Object.hasOwn(safe,key),false);
});

test("final exam response autosave validates owner, attempt status, deadline and task IDs", () => {
  const save = extractFunction("saveEnglishFinalExamResponses_");
  assert.match(save, /auth_\(data\)/);
  assert.match(save, /email_\(row\[m\.StudentEmail\]\)!==user\.email/);
  assert.match(save, /in_progress/);
  assert.match(save, /DeadlineAt/);
  assert.match(save, /ResponsesJSON:serialized/);
  assert.match(save, /allowed\[id\]/);
  assert.match(save, /serialized\.length>45000/);
  assert.match(code, /case "saveenglishfinalexamresponses": result = saveEnglishFinalExamResponses_\(data\); break;/);
});

test("final exam variant importer stores one bounded private payload per variant and activates only after staging", () => {
  const importer = extractFunction("importEnglishExamVariants_");
  assert.match(importer, /auth_\(data\)/);
  assert.match(importer, /actor\.role !== "admin"/);
  assert.match(importer, /payload\.sourceNotes\.status !== "approved_for_import"/);
  assert.match(importer, /approvedBy:actor\.email/);
  assert.match(importer, /validateEnglishExamVariantRegistry_\(exams\)/);
  assert.match(importer, /variant\.variantJSON/);
  assert.match(importer, /variantJSON\.length > 45000/);
  assert.match(importer, /setValues\(matrix\)/);
  assert.match(importer, /Active:"FALSE"/);
  assert.ok(importer.indexOf('setValues(matrix)') < importer.indexOf('setValues(matrix.map(function() { return ["TRUE"]; }))'));
  assert.match(importer, /LockService\.getScriptLock\(\)/);
  assert.match(importer, /previousActive/);
  assert.match(importer, /rollbackError/);
  assert.match(code, /case "importenglishexamvariants": result = importEnglishExamVariants_\(data\); break;/);
});

test("final exam registry requires all ten course-semester slots and 150 unique variants", () => {
  assert.deepEqual(validateRegistry(validExamRegistry()), {examCount:10,variantCount:150,basicSlots:4,technicalSlots:6});
});

test("final exam registry rejects missing slots, wrong tracks, wrong variant counts and duplicate IDs", () => {
  const missingSlot=validExamRegistry().slice(0,9);
  assert.throws(()=>validateRegistry(missingSlot), /ровно 10/);
  const wrongTrack=validExamRegistry(); wrongTrack[4].track="basic";
  assert.throws(()=>validateRegistry(wrongTrack), /правильным направлением/);
  const shortVariants=validExamRegistry(); shortVariants[0].variants.pop();
  assert.throws(()=>validateRegistry(shortVariants), /ровно 15/);
  const duplicate=validExamRegistry(); duplicate[1].variants[0].variantId=duplicate[0].variants[0].variantId;
  assert.throws(()=>validateRegistry(duplicate), /уникальный ID/);
  const wrongPortalId=validExamRegistry(); wrongPortalId[0].courseId="EN";
  assert.throws(()=>validateRegistry(wrongPortalId), /действующим ID дисциплины/);
  const missingBlueprint=validExamRegistry(); missingBlueprint[0].variants[0].blueprintId="";
  assert.throws(()=>validateRegistry(missingBlueprint), /ссылку на blueprint/);
});

const validateSource = extractFunction("validateEnglishSemesterTests_");
const sanitizeSource = extractFunction("sanitizeEnglishSemesterTests_");
const fingerprintSource = extractFunction("englishSemesterBankFingerprint_");
const validate = new Function(validateSource + "; return validateEnglishSemesterTests_;")();
const sanitizeQuestionSource = extractFunction("sanitizeAssessmentQuestionForStudent_");
const sanitize = new Function(sanitizeQuestionSource + "\n" + sanitizeSource + "; return sanitizeEnglishSemesterTests_;")();
const fingerprint = new Function(fingerprintSource + "; return englishSemesterBankFingerprint_;")();
const optionOrderSource = extractFunction("englishSemesterOptionOrder_");
const optionOrder = new Function(optionOrderSource + "; return englishSemesterOptionOrder_;")();


function validBank(track) {
  const prefix = track === "basic" ? "b_" : "t_";
  const firstYear = track === "basic" ? 1 : 3;
  const count = track === "basic" ? 4 : 6;
  return Array.from({ length: count }, (_, i) => ({
    id: prefix + "sem" + (i + 1),
    year: firstYear + Math.floor(i / 2),
    semester: i % 2 + 1,
    time: 45,
    questions: Array.from({ length: 20 }, (_, q) => ({
      q: `Question ${i + 1}-${q + 1}`,
      options: ["A", "B", "C", "D"],
      correct: q % 4,
    })),
  }));
}

test("server accepts four Basic and six Technical semester tests in their five-year course slots", () => {
  assert.equal(validate(validBank("basic"), "basic"), 80);
  assert.equal(validate(validBank("technical"), "technical"), 120);
});

test("server rejects ten-per-track legacy layout and wrong course-year mapping", () => {
  const tooManyBasic = [...validBank("basic"), ...validBank("basic")].slice(0, 10);
  assert.throws(() => validate(tooManyBasic, "basic"), /ровно 4/);
  const tooFewTechnical = validBank("technical").slice(0, 4);
  assert.throws(() => validate(tooFewTechnical, "technical"), /ровно 6/);
  const wrongTechnicalYear = validBank("technical");
  wrongTechnicalYear[0].year = 1;
  assert.throws(() => validate(wrongTechnicalYear, "technical"), (error) => error.message.includes("курсу/семестру"));
});

test("server rejects missing answer keys, duplicate IDs, wrong semester order and repeated questions", () => {
  const missingKey = validBank("basic"); delete missingKey[0].questions[0].correct;
  assert.throws(() => validate(missingKey, "basic"), /ключ ответа/);
  const duplicateId = validBank("basic"); duplicateId[1].id = duplicateId[0].id;
  assert.throws(() => validate(duplicateId, "basic"), /уникальным ID/);
  const wrongSemester = validBank("basic"); wrongSemester[0].semester = 2;
  assert.throws(() => validate(wrongSemester, "basic"), /курсу\/семестру/);
  const repeatedQuestion = validBank("basic"); repeatedQuestion[0].questions[1].q = repeatedQuestion[0].questions[0].q;
  assert.throws(() => validate(repeatedQuestion, "basic"), /Повторяющийся вопрос/);
  const repeatedAcrossSemesters = validBank("basic"); repeatedAcrossSemesters[1].questions[0].q = repeatedAcrossSemesters[0].questions[0].q;
  assert.throws(() => validate(repeatedAcrossSemesters, "basic"), /Повторяющийся вопрос/);
  const repeatedWhitespace = validBank("basic"); repeatedWhitespace[1].questions[0].q = "  Question   1-1  ";
  assert.throws(() => validate(repeatedWhitespace, "basic"), /Повторяющийся вопрос/);
});

test("server rejects duplicate options and track-mismatched identifiers", () => {
  const duplicateOptions = validBank("technical"); duplicateOptions[0].questions[0].options[2] = "A";
  assert.throws(() => validate(duplicateOptions, "technical"), /повторяющиеся варианты/);
  const wrongTrackIds = validBank("technical"); wrongTrackIds[0].id = "b_sem1";
  assert.throws(() => validate(wrongTrackIds, "technical"), /уникальным ID/);
});

test("teacher semester-import UI requires the real four-Basic/six-Technical schema", () => {
  const ui=fs.readFileSync(path.join(root,"english-vpr-engine.js"),"utf8");
  assert.match(ui,/expectedTests=\{basic:4,technical:6\}/);
  assert.match(ui,/expectedQuestions=\{basic:80,technical:120\}/);
  assert.match(ui,/semesterReady=Array\.isArray\(source\.basic\)&&source\.basic\.length===expectedTests\.basic/);
  assert.match(ui,/Array\.isArray\(source\.technical\)&&source\.technical\.length===expectedTests\.technical/);
  assert.match(ui,/Импорт семестровых контрольных временно закрыт/);
  assert.doesNotMatch(ui,/10 контрольных Basic и 10 контрольных Technical/);
});

test("student-facing semester catalogue is allowlisted and never exposes teacher metadata", () => {
  const safe = sanitize([{
    id:"b_sem1", title:"Контрольная работа №1", subtitle:"1 курс, 1 семестр",
    year:1, semester:1, time:45,
    answerKey:"private", modelAnswer:"private", teacherNotes:"private",
    privateRubric:"private", explanation:"private", customMetadata:{secret:"private"},
    questions:[{q:"Q",options:["A","B"],correct:1,answer:"B",correctAnswer:"B",modelAnswer:"private",teacherNotes:"private",explanation:"key"}]
  }]);
  assert.deepEqual(Object.keys(safe[0]).sort(), ["id","title","subtitle","year","semester","time","questions"].sort());
  assert.deepEqual(safe[0].questions[0], {q:"Q",options:["A","B"]});
  assert.equal(safe[0].id,"b_sem1");
  assert.equal(safe[0].attemptNo,undefined,"attempt number is assigned from server-side result history");
});

test("unreviewed legacy seed stays out of the production page and cloned Technical tests are withheld", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const legacy = fs.readFileSync(path.join(root, "english-assessment-data.js"), "utf8");
  assert.equal(html.includes("english-assessment-data.js"), false);
  const sandbox = { window: {}, console: { log() {} } };
  new Function("window", "console", legacy)(sandbox.window, sandbox.console);
  const basic = sandbox.window.SEMESTER_TESTS.basic;
  const technical = sandbox.window.SEMESTER_TESTS.technical;
  assert.equal(basic.length, 10);
  assert.equal(technical.length, 0);
  assert.equal(basic.every((item) => item.questions.length === 20), true);
  assert.equal(basic.every((item) => item.questions.every((question) => Number.isInteger(question.correct))), false);
  assert.doesNotMatch(legacy, /window\.SEMESTER_TESTS\.basic\.map\s*\(/);
});

test("Basic and Technical banks reject identical substantive question stems", () => {
  const overlapSource = extractFunction("englishSemesterBankOverlap_");
  const importer = extractFunction("importEnglishSemesterTests_");
  const overlap = new Function(overlapSource + "; return englishSemesterBankOverlap_;")();
  assert.match(importer, /englishSemesterBankOverlap_\(tests, otherTests\)/);
  const basic = validBank("basic");
  const technicalClone = validBank("technical");
  const sharedStem = "Describe the purpose of a machine-tool safety interlock.";
  basic[0].questions[0].q = sharedStem;
  technicalClone[0].questions[0].q = sharedStem;
  const distinctTechnical = validBank("technical");
  distinctTechnical.forEach((item, index) => item.questions.forEach((question, q) => {
    question.q = "Technical assessment item " + index + " number " + q + " describes a separate engineering context.";
  }));
  assert.notEqual(fingerprint(basic), fingerprint(technicalClone), "course-year metadata remains part of the bank fingerprint");
  assert.ok(overlap(basic, technicalClone).length > 0);
  assert.equal(overlap(basic, distinctTechnical).length, 0);
  assert.equal(fingerprint([{year:3,semester:1,questions:[{q:"A   technical   question"}]}]), fingerprint([{year:3,semester:1,questions:[{q:"A technical question"}]}]));
});


test("semester answer options are shuffled deterministically per student and attempt", () => {
  const first = optionOrder("student@example.test", "b_sem1", 1, 0, 4);
  const repeated = optionOrder("student@example.test", "b_sem1", 1, 0, 4);
  const nextAttempt = optionOrder("student@example.test", "b_sem1", 2, 0, 4);
  const otherStudent = optionOrder("other@example.test", "b_sem1", 1, 0, 4);
  assert.deepEqual(first, repeated, "the same attempt must retain its order after reload");
  assert.deepEqual([...first].sort(), [0, 1, 2, 3], "every original option must appear once");
  assert.notDeepEqual(first, nextAttempt, "a new attempt should get a new order");
  assert.notDeepEqual(first, otherStudent, "different students should get independent orders");
});

test("shuffled display indices map back to the protected original answer key", () => {
  const originalOptions = ["alpha", "bravo", "charlie", "delta"];
  const correctOriginalIndex = 2;
  const order = optionOrder("student@example.test", "t_sem3", 4, 7, 4);
  const displayedOptions = order.map((index) => originalOptions[index]);
  const displayedCorrectIndex = displayedOptions.indexOf(originalOptions[correctOriginalIndex]);
  assert.equal(order[displayedCorrectIndex], correctOriginalIndex);
  assert.equal(displayedOptions[displayedCorrectIndex], "charlie");
});


test("teacher-granted extra attempts release only expired semester tokens", () => {
  const helperSource = extractFunction("clearExpiredEnglishSemesterAttemptForGrant_");
  const grantSource = extractFunction("grantTestAttempts_");
  const cacheValues = new Map();
  const removed = [];
  const cache = {
    get: (key) => cacheValues.get(key) || null,
    remove: (key) => { removed.push(key); cacheValues.delete(key); }
  };
  let now = 2_000_000_000_000;
  const fakeDate = { now: () => now };
  const helper = new Function(
    "englishSemesterBank_", "headerMap_", "resultAttemptRows_", "email_",
    "sameCourseId_", "englishSemesterAttemptCacheKey_", "CacheService", "Date",
    helperSource + "; return clearExpiredEnglishSemesterAttemptForGrant_;"
  )(
    () => ({getDataRange:() => ({getValues:() => [["Track","Active","TestsJSON"],["basic","TRUE",JSON.stringify([{id:"b_sem1",time:45}])]]})}),
    () => ({Track:0,Active:1,TestsJSON:2}),
    () => [],
    (value) => String(value || "").toLowerCase(),
    (a,b) => a === b,
    () => "attempt-key",
    {getScriptCache:() => cache},
    fakeDate
  );
  cacheValues.set("attempt-key", JSON.stringify({attemptId:"active",startedAt:now-60_000}));
  assert.equal(helper("student@example.test","ENB","english_semester_basic_b_sem1"),false);
  assert.equal(cacheValues.has("attempt-key"),true,"an active attempt and its timer must remain intact");
  cacheValues.set("attempt-key", JSON.stringify({attemptId:"expired",startedAt:now-3_000_000,status:"expired"}));
  assert.equal(helper("student@example.test","ENB","english_semester_basic_b_sem1"),true);
  assert.equal(cacheValues.has("attempt-key"),false,"an explicitly expired attempt is released after the teacher grants retries");
  cacheValues.set("attempt-key", JSON.stringify({attemptId:"timed-out",startedAt:now-3_060_000}));
  assert.equal(helper("student@example.test","ENB","english_semester_basic_b_sem1"),true);
  assert.equal(cacheValues.has("attempt-key"),false,"an attempt past its time limit and grace period is released even if submit was never called");
  assert.deepEqual(removed,["attempt-key","attempt-key"]);
  assert.match(grantSource,/extra > 0 \?\s*clearExpiredEnglishSemesterAttemptForGrant_/);
  assert.match(grantSource,/ExpiredSemesterAttemptReset:expiredSemesterAttemptReset/);
  assert.ok(grantSource.indexOf("clearExpiredEnglishSemesterAttemptForGrant_") < grantSource.indexOf("writeSetting_"),
    "the expired-token check must succeed before the extra-attempt grant is persisted");
});

test("semester shuffled options are bound to the server attempt and expired attempts cannot restart", () => {
  const get = extractFunction("getEnglishSemesterTests_");
  const start = extractFunction("startEnglishSemesterTest_");
  const submit = extractFunction("submitEnglishSemesterTest_");
  assert.match(get, /safeTest\.attemptNo = attemptNo/);
  assert.match(submit, /requestedAttemptNo !== attemptNo/);
  assert.match(submit, /englishSemesterOptionOrder_\(user\.email, testId, attemptNo, index, optionCount\)/);
  assert.match(submit, /Submission:JSON\.stringify\(\{answers:canonicalAnswers\}\)/);
  assert.match(start, /attempt\.status === "expired"/);
  assert.match(start, /attemptCache|cache\.put\(attemptKey, JSON\.stringify\(attempt\), 21600\)/);
  assert.match(submit, /serverAttempt\.status = "expired"/);
});


test("teacher dashboard exposes the English written-exam review workflow and safely renders submitted content", () => {
  const dashboard = fs.readFileSync(path.join(root, "teacher-dashboard.js"), "utf8");
  const api = fs.readFileSync(path.join(root, "api.js"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const studentEngine = fs.readFileSync(path.join(root, "english-vpr-engine.js"), "utf8");
  assert.match(dashboard, /id="efReviewRefresh"/);
  assert.match(dashboard, /id="efReviewPanel"/);
  assert.match(dashboard, /window\.API\.getEnglishFinalExamReviews\(\)/);
  assert.match(dashboard, /window\.API\.gradeEnglishFinalExamWritten\(/);
  assert.match(dashboard, /class="ef-review-score"/);
  assert.match(dashboard, /class="ef-review-feedback"/);
  assert.match(dashboard, /E\(item\.responses&&item\.responses\[task\.id\]/);
  assert.match(dashboard, /E\(task\.rubric\)/);
  assert.match(api, /getEnglishFinalExamReviews:function\(\)\{return fetchAPI\("getEnglishFinalExamReviews",\{\},"POST"/);
  assert.match(api, /gradeEnglishFinalExamWritten:function\(attemptId,grades\)\{return fetchAPI\("gradeEnglishFinalExamWritten"/);
  assert.match(html, /teacher-dashboard\.js/);
  assert.match(app, /renderTeacherDashboard\(\)/);
  assert.match(studentEngine, /Итоговая оценка появится после проверки письменных заданий\./);
});


test("teacher-graded English final-exam results are returned to the owning student with feedback and reviewer metadata", () => {
  const mine = extractFunction("getMyCourseResults_");
  const publish = extractFunction("upsertEnglishFinalExamJournal_");
  assert.match(mine, /auth_\(data\)/);
  assert.match(mine, /email_\(r\[0\]\)===email/);
  assert.match(mine, /feedback:String\(resultMap\.Feedback/);
  assert.match(mine, /reviewedBy:String\(resultMap\.ReviewedBy/);
  assert.match(mine, /reviewedAt:String\(resultMap\.ReviewedAt/);
  assert.match(mine, /sameCourseId_\(r\[12\],requestedCourse\)/);
  assert.match(publish, /ReviewedBy:reviewerEmail/);
  assert.match(publish, /ReviewedAt:reviewerEmail\?now/);
  assert.match(code, /case "getmycourseresults": result = getMyCourseResults_\(data\); break;/);
});


test("student assessment history displays teacher feedback and reviewer identity for graded final exams", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(app, /var reviewInfo=x\.reviewedAt/);
  assert.match(app, /window\.escapeHtml\(x\.reviewedBy\)/);
  assert.match(app, /var reviewFeedback=x\.feedback/);
  assert.match(app, /window\.escapeHtml\(x\.feedback\)/);
  assert.match(app, /Комментарий:/);
});


test("corrected pilot final-exam listening keys and short-answer prompts stay synchronized with the registry", () => {
  const registry = JSON.parse(fs.readFileSync(path.join(root, "docs/english-final-exam-registry-v1-pilot.json"), "utf8"));
  const cases = [
    ["EN-C1-S1-V13", "c1s1v13_l02", "docs/english-final-exam-c01-s01-v13-pilot.json", task => {
      assert.equal(task.correctIndex, 1);
      assert.match(task.audioText, /eight fifteen, so please arrive ten minutes earlier/i);
      assert.equal(task.options[1], "At eight oh five");
    }],
    ["EN-C1-S1-V14", "c1s1v14_l01", "docs/english-final-exam-c01-s01-v14-pilot.json", task => {
      assert.equal(task.correctIndex, 0);
      assert.match(task.audioText, /ask for Ms Patel/i);
      assert.equal(task.options[0], "Ms Patel");
    }],
    ["EN-C1-S1-V14", "c1s1v14_l02", "docs/english-final-exam-c01-s01-v14-pilot.json", task => {
      assert.equal(task.correctIndex, 1);
      assert.match(task.audioText, /telephone reception/i);
      assert.equal(task.options[1], "Telephone reception");
    }],
    ["EN-C2-S1-V15", "c2s1v15_l02", "docs/english-final-exam-c02-s01-v15-pilot.json", task => {
      assert.match(task.prompt, /document.*work-placement briefing/i);
      assert.equal(task.options[1], "A copy of the placement agreement");
      assert.equal(task.correctIndex, 1);
    }],
    ["EN-C3-S2-V15", "c3s2v15_v01", "docs/english-final-exam-c03-s02-v15-pilot.json", task => {
      assert.deepEqual(task.acceptedAnswers, ["proposal"]);
      assert.match(task.prompt, /suggested plan or solution/i);
    }],
    ["EN-C5-S2-V15", "c5s2v15_v01", "docs/english-final-exam-c05-s02-v15-pilot.json", task => {
      assert.deepEqual(task.acceptedAnswers, ["synthesis"]);
      assert.match(task.prompt, /combines key ideas from multiple sources/i);
    }]
  ];
  for (const [variantId, taskId, sourcePath, check] of cases) {
    const variant = registry.exams.flatMap(exam => exam.variants).find(item => item.variantId === variantId);
    assert.ok(variant, "registry variant exists: " + variantId);
    const registryTask = variant.variantJSON.tasks.find(task => task.id === taskId);
    const source = JSON.parse(fs.readFileSync(path.join(root, sourcePath), "utf8"));
    const sourceTask = source.tasks.find(task => task.id === taskId);
    assert.deepEqual(registryTask, sourceTask, "registry and source JSON stay synchronized: " + taskId);
    check(registryTask);
  }
  const v14 = registry.exams.flatMap(exam => exam.variants).find(item => item.variantId === "EN-C1-S1-V14");
  const order = v14.variantJSON.tasks.find(task => task.id === "c1s1v14_o01");
  assert.deepEqual(order.correctOrder, [
    "Report to reception",
    "Receive the supervisor's instructions",
    "Record the work in the daily log",
    "Review the tasks completed"
  ]);
  assert.equal(registry.status, "pilot_for_editorial_review", "editorial corrections do not approve the pilot for import");
});


test("all 150 final-exam source files match the combined registry and pass structural/key-balance checks", () => {
  const registry = JSON.parse(fs.readFileSync(path.join(root, "docs/english-final-exam-registry-v1-pilot.json"), "utf8"));
  assert.equal(registry.status, "pilot_for_editorial_review");
  assert.equal(registry.exams.length, 10);
  const variants = registry.exams.flatMap(exam => exam.variants);
  assert.equal(variants.length, 150);
  const variantIds = new Set();
  const taskIds = new Set();
  const typeTotals = { single_choice: 0, multiple_choice: 0, short_text: 0, ordering: 0, written: 0 };

  for (const variant of variants) {
    assert.ok(!variantIds.has(variant.variantId), "unique variant ID: " + variant.variantId);
    variantIds.add(variant.variantId);
    const match = variant.variantId.match(/^EN-C([1-5])-S([1-2])-V(\\d{2})$/);
    assert.ok(match, "well-formed variant ID: " + variant.variantId);
    const sourcePath = `docs/english-final-exam-c0${match[1]}-s0${match[2]}-v${match[3]}-pilot.json`;
    const source = JSON.parse(fs.readFileSync(path.join(root, sourcePath), "utf8"));
    assert.deepEqual(variant.variantJSON, source, "complete source/registry parity: " + variant.variantId);

    const tasks = variant.variantJSON.tasks;
    assert.equal(tasks.length, 10, "ten tasks per variant: " + variant.variantId);
    const counts = [0, 0, 0, 0];
    const byType = { single_choice: 0, multiple_choice: 0, short_text: 0, ordering: 0, written: 0 };
    for (const task of tasks) {
      assert.ok(!taskIds.has(task.id), "globally unique task ID: " + task.id);
      taskIds.add(task.id);
      assert.ok(Object.hasOwn(typeTotals, task.type), "supported task type: " + task.id);
      typeTotals[task.type]++;
      byType[task.type]++;
      if (task.type === "single_choice") {
        assert.ok(Array.isArray(task.options) && task.options.length === 4, "four single-choice options: " + task.id);
        assert.ok(Number.isInteger(task.correctIndex) && task.correctIndex >= 0 && task.correctIndex < 4, "valid single-choice key: " + task.id);
        counts[task.correctIndex]++;
      } else if (task.type === "multiple_choice") {
        assert.ok(Array.isArray(task.options) && task.options.length === 4, "four multiple-choice options: " + task.id);
        assert.ok(Array.isArray(task.correctIndices) && task.correctIndices.length === 2, "exactly two multiple-choice keys: " + task.id);
        assert.equal(new Set(task.correctIndices).size, 2, "distinct multiple-choice keys: " + task.id);
        assert.ok(task.correctIndices.every(index => Number.isInteger(index) && index >= 0 && index < 4), "valid multiple-choice indices: " + task.id);
      } else if (task.type === "short_text") {
        assert.ok(Array.isArray(task.acceptedAnswers) && task.acceptedAnswers.length > 0, "accepted short-text answer: " + task.id);
      } else if (task.type === "ordering") {
        assert.ok(Array.isArray(task.options) && task.options.length >= 3, "ordering options: " + task.id);
        assert.ok(Array.isArray(task.correctOrder) && task.correctOrder.length === task.options.length, "complete ordering key: " + task.id);
        assert.equal(new Set(task.correctOrder).size, task.options.length, "unique ordering key items: " + task.id);
        assert.deepEqual([...task.correctOrder].sort(), [...task.options].sort(), "ordering key is a permutation of options: " + task.id);
      } else if (task.type === "written") {
        assert.equal(task.points, 8, "written task has eight points: " + task.id);
        assert.ok(typeof task.rubric === "string" && task.rubric.length > 80, "written task has a substantive rubric: " + task.id);
      }
    }
    assert.deepEqual(byType, { single_choice: 6, multiple_choice: 1, short_text: 1, ordering: 1, written: 1 }, "expected task composition: " + variant.variantId);
    assert.deepEqual(counts, [2, 2, 1, 1], "balanced single-choice key positions: " + variant.variantId);
  }
  assert.deepEqual(typeTotals, { single_choice: 900, multiple_choice: 150, short_text: 150, ordering: 150, written: 150 });
});


test("C5-S1 reading answer keys point to passage-supported answers in all 15 variants", () => {
  const registry = JSON.parse(fs.readFileSync(path.join(root, "docs/english-final-exam-registry-v1-pilot.json"), "utf8"));
  const expected = {
    1: ["The task reference, responsible team, expected duration and required documents", "Coordinate work and record progress"],
    2: ["What was observed and the relevant acceptance criterion", "Actual value, unit and component reference"],
    3: ["Review relevant records and compare evidence with possible explanations", "It should identify confirmed facts separately from possible explanations"],
    4: ["Document identifier, applicability information and revision status", "Because models may have different components or requirements"],
    5: ["Document identifier, revision, issue date and approval status", "To prevent them from being mistaken for current information"],
    6: ["Aircraft or component identity, document reference and revision status", "Refer the issue through the authorised technical publications process"],
    7: ["Open tasks, completed checks, equipment status and restrictions", "The technical log or required sign-off"],
    8: ["A failure to meet a specified requirement", "The cause of the non-conformance"],
    9: ["A recurring issue", "Similar symptoms do not always have the same cause"],
    10: ["Document number, revision and issue status", "Because printed or downloaded copies may become outdated"],
    11: ["Affected item, requirement, observed condition and supporting evidence", "Only when the investigation supports it"],
    12: ["It may not show all differences between individual units", "The relevant configuration should be established"],
    13: ["The current status and relevant evidence", "So the audience can distinguish known information from unresolved matters"],
    14: ["Affected model range, applicability statement, issue date and referenced documents", "The responsible technical team should confirm whether it applies"],
    15: ["Delivery reliability, product conformity and responses to reported issues", "To assess performance over time rather than rely on one event"]
  };
  const variants = registry.exams.flatMap(exam => exam.variants);
  for (let n = 1; n <= 15; n++) {
    const id = `EN-C5-S1-V${String(n).padStart(2, "0")}`;
    const variant = variants.find(item => item.variantId === id);
    assert.ok(variant, "C5-S1 variant exists: " + id);
    for (const [suffix, expectedAnswer] of [["r01", expected[n][0]], ["r02", expected[n][1]]]) {
      const task = variant.variantJSON.tasks.find(item => item.id.endsWith("_" + suffix));
      assert.ok(task, "reading task exists: " + id + " " + suffix);
      assert.equal(task.options[task.correctIndex], expectedAnswer, "key matches passage: " + task.id);
      const sourcePath = `docs/english-final-exam-c05-s01-v${String(n).padStart(2, "0")}-pilot.json`;
      const source = JSON.parse(fs.readFileSync(path.join(root, sourcePath), "utf8"));
      assert.deepEqual(task, source.tasks.find(item => item.id === task.id), "source and registry match: " + task.id);
    }
  }
});
