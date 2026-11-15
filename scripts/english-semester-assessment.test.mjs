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

test("ten authored Technical English Course 3 Semester 2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:10},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c03-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
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
    assert.match(functional.options[functional.correctIndex],/Could you|different roles|Would turning|Let's compare|I have noticed|Could we review|measured value is outside|Check the approved|material has not arrived/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,10);
});

test("fifteen authored Technical English Course 4 Semester 1 pilots match the protected runtime schema",()=>{
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
    assert.match(functional.options[functional.correctIndex],/Could you|Check its printed|We should use equal|The display became blank|The rating is unclear|The indicator did not light|Check the full model|Could we check|Could we compare|Could you explain|problem appears intermittently|Could we confirm|Record the mismatch/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("five authored Technical English Course 4 Semester 2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:5},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c04-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
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
    assert.match(functional.options[functional.correctIndex],/Could you identify|Let's use the correct term|sensor provides input|Could we check the input|This may be one possible/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,5);
});

test("fifteen authored Technical English Course 4 Semester 2 pilots match the protected runtime schema",()=>{
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
    assert.match(functional.options[functional.correctIndex],/Could you identify|Let's use the correct term|sensor provides input|Could we check the input|This may be one possible|Could we confirm the exact|I can provide the version|Could we check the address|Could we add the correct unit|I cannot share credentials|Check the device register|Could we update the model|Please check the measurement method|digital representation may be out of date|check the measurement method|Could we confirm the unit's service status|cause has not yet been established/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,15);
});

test("five authored Technical English Course 5 Semester 1 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:5},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c05-s01-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
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
    assert.match(functional.options[functional.correctIndex],/Could we confirm the correct task|observed condition differs|separate the hypothesis|Could the documentation team|Check the document register/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,5);
});

test("five authored Technical English Course 5 Semester 2 pilots match the protected runtime schema",()=>{
  const pilots=Array.from({length:5},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-c05-s02-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8")));
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
    assert.match(functional.options[functional.correctIndex],/task remains open|Could we identify who is responsible|trends coincide|timing may be relevant|This copy is still a draft/i);
  });
  assert.equal(new Set(allPrompts).size,allPrompts.length);
  assert.equal(new Set(pilots.map(p=>p.tasks[0].audioText)).size,5);
});

test("fifteen authored Technical English Course 5 Semester 2 pilots match the protected runtime schema",()=>{
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

test("all 150 final exam variants have globally unique task IDs and prompts",()=>{
  const slots=[["c01","s01"],["c01","s02"],["c02","s01"],["c02","s02"],["c03","s01"],["c03","s02"],["c04","s01"],["c04","s02"],["c05","s01"],["c05","s02"]];
  const variants=slots.flatMap(([course,semester])=>Array.from({length:15},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`docs/english-final-exam-${course}-${semester}-v${String(i+1).padStart(2,"0")}-pilot.json`),"utf8"))));
  assert.equal(variants.length,150);
  const taskIds=variants.flatMap(variant=>variant.tasks.map(task=>task.id));
  const prompts=variants.flatMap(variant=>variant.tasks.map(task=>task.prompt.trim().toLowerCase()));
  assert.equal(taskIds.length,1500);
  assert.equal(new Set(taskIds).size,taskIds.length);
  assert.equal(new Set(prompts).size,prompts.length);
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
  assert.match(start, /sanitizeEnglishFinalExamTask_\(tasks\)/);
  assert.match(resume, /email_\(row\[m\.StudentEmail\]\)!==user\.email/);
  assert.match(resume, /row\[m\.Status\]\)!=="in_progress"/);
  assert.match(resume, /DeadlineAt/);
  assert.match(resume, /sanitizeEnglishFinalExamTask_\(snapshot\.tasks\|\|\[\]\)/);
  assert.match(sanitizeTask, /answer|correct|solution|rubric|grading/i);
  assert.match(code, /case "startenglishfinalexam": result = startEnglishFinalExam_\(data\); break;/);
  assert.match(code, /case "resumeenglishfinalexam": result = resumeEnglishFinalExam_\(data\); break;/);
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
  assert.match(importer, /validateEnglishExamVariantRegistry_\(exams\)/);
  assert.match(importer, /variant\.variantJSON/);
  assert.match(importer, /variantJSON\.length > 45000/);
  assert.match(importer, /setValues\(matrix\)/);
  assert.match(importer, /Active:"FALSE"/);
  assert.ok(importer.indexOf('setValues(matrix)') < importer.indexOf('setValues(matrix.map(function() { return ["TRUE"]; }))'));
  assert.match(importer, /LockService\.getScriptLock\(\)/);
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

test("student-facing payload strips all answer-key and explanation fields", () => {
  const safe = sanitize([{ questions: [{ q: "Q", options: ["A", "B"], correct: 1, answer: "B", correctAnswer: "B", explanation: "key", rationale: "key", answerIndex: 1, solution: "hidden" }] }]);
  const question = safe[0].questions[0];
  for (const key of ["correct", "answer", "correctAnswer", "explanation", "rationale", "answerIndex", "solution"]) assert.equal(Object.hasOwn(question, key), false);
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


test("semester shuffled options are bound to the server-verified attempt number and canonical indices", () => {
  const get = extractFunction("getEnglishSemesterTests_");
  const submit = extractFunction("submitEnglishSemesterTest_");
  assert.match(get, /safeTest\.attemptNo = attemptNo/);
  assert.match(submit, /requestedAttemptNo !== attemptNo/);
  assert.match(submit, /englishSemesterOptionOrder_\(user\.email, testId, attemptNo, index, optionCount\)/);
  assert.match(submit, /Submission:JSON\.stringify\(\{answers:canonicalAnswers\}\)/);
});
