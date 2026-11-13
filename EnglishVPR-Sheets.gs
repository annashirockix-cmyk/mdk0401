/**
 * Защищённый банк экзаменов English VPR.
 * Добавляется как отдельный файл EnglishVPR-Sheets.gs в проект Apps Script.
 * Ключи ответов хранятся только в листе EnglishVPRBank.
 */

function englishVprBank_() { return ensureSheet_("EnglishVPRBank"); }

function validateEnglishVprExam_(track, exam) {
  const expectedTypes = ["choice","match","gap","gap","gap","transform","questionnaire"];
  const expectedCounts = [5,5,5,5,5,5,10];
  if (!exam || String(exam.track || "").toLowerCase() !== track ||
      String(exam.id || "") !== "english_vpr_" + track + "_2026" ||
      !Array.isArray(exam.tasks) || exam.tasks.length !== expectedTypes.length) {
    throw new Error("Структура экзамена не соответствует утверждённому варианту " + track.toUpperCase() + ".");
  }
  exam.tasks.forEach(function(task, index) {
    if (!task || task.type !== expectedTypes[index] || !Array.isArray(task.items) ||
        task.items.length !== expectedCounts[index]) {
      throw new Error("Неверная структура задания " + (index + 1) + " экзамена " + track.toUpperCase() + ".");
    }
    if (Number(task.points) !== (index === 6 ? 10 : 5)) {
      throw new Error("Неверное количество баллов в задании " + (index + 1) + ".");
    }
    if (task.type === "gap" && (!Array.isArray(task.answers) || task.answers.length !== 5)) {
      throw new Error("В задании " + (index + 1) + " должны быть пять ключей ответов.");
    }
    if (task.type === "transform" && task.items.some(function(item) {
      return !Array.isArray(item) || !Array.isArray(item[3]) || !item[3].length;
    })) throw new Error("В задании 6 отсутствуют допустимые варианты ответов.");
  });
  if (Number(exam.maxScore) !== 40) throw new Error("Максимальный балл экзамена должен быть равен 40.");
  return true;
}

function importEnglishVprBank_(data) {
  const actor = auth_(data);
  if (actor.role !== "admin" && actor.role !== "teacher") throw new Error("Импорт доступен только преподавателю.");
  const track = String(data.track || "").toLowerCase();
  const exam = data.exam;
  if (["basic", "technical"].indexOf(track) < 0 || !exam || typeof exam !== "object" || !Array.isArray(exam.tasks) || !exam.tasks.length) {
    throw new Error("Передайте корректный экзамен Basic или Technical.");
  }
  if (actor.role === "teacher" && !hasCourseAccess_(actor, track === "basic" ? "ENB" : "ENT") && !hasCourseAccess_(actor, "EN")) {
    throw new Error("Нет доступа к импорту этого экзамена.");
  }
  validateEnglishVprExam_(track, exam);
  const json = JSON.stringify(exam);
  if (json.length > 450000) throw new Error("Размер экзамена превышает 450 КБ.");
  const sh = englishVprBank_(), lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const values = sh.getDataRange().getValues(), map = headerMap_(sh);
    let rowNo = 0;
    for (let i = 1; i < values.length; i++) if (String(values[i][map.Track] || "") === track) { rowNo = i + 1; break; }
    const record = {Track:track, ExamJSON:json, Active:"TRUE", UpdatedAt:new Date().toISOString(), UpdatedBy:actor.email};
    if (rowNo) updateMappedRecord_(sh, rowNo, record); else appendMappedRecord_(sh, record);
    return {success:true, track:track, bytes:json.length, updatedAt:record.UpdatedAt};
  } finally { lock.releaseLock(); }
}

function sanitizeEnglishVprExam_(exam) {
  const safe = JSON.parse(JSON.stringify(exam));
  (safe.tasks || []).forEach(function(task) {
    if (task.type === "choice") (task.items || []).forEach(function(item) { if (Array.isArray(item)) item[1] = null; });
    if (task.type === "match") (task.items || []).forEach(function(item) { if (Array.isArray(item)) item.splice(2, 1); });
    if (task.type === "gap") delete task.answers;
    if (task.type === "transform") (task.items || []).forEach(function(item) { if (Array.isArray(item)) item.splice(3, 1); });
  });
  function stripPrivateFields(value) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { value.forEach(stripPrivateFields); return; }
    Object.keys(value).forEach(function(key) {
      if (/^(correct|correctAnswer|answer|answers|key|solution|explanation|acceptedAnswers)$/i.test(key)) delete value[key];
      else stripPrivateFields(value[key]);
    });
  }
  stripPrivateFields(safe);
  return safe;
}

function getEnglishVprExam_(data) {
  const user = auth_(data), track = String(data.track || "").toLowerCase();
  if (["student","teacher","admin"].indexOf(user.role) < 0 || ["basic","technical"].indexOf(track) < 0) throw new Error("Нет доступа к экзамену.");
  const courseId = track === "basic" ? "ENB" : "ENT";
  if (!hasCourseAccess_(user, courseId) && !hasCourseAccess_(user, "EN")) throw new Error("Эта дисциплина не назначена вашему аккаунту.");
  const sh = englishVprBank_(), values = sh.getDataRange().getValues(), map = headerMap_(sh);
  for (let i=1;i<values.length;i++) {
    if (String(values[i][map.Track]||"") !== track || String(values[i][map.Active]||"").toUpperCase() !== "TRUE") continue;
    const exam = JSON.parse(String(values[i][map.ExamJSON]||"{}"));
    validateEnglishVprExam_(track, exam);
    return {success:true,track:track,exam:sanitizeEnglishVprExam_(exam)};
  }
  return {success:false,error:"Экзамен ещё не импортирован преподавателем."};
}

function englishVprNormalize_(value) {
  return String(value == null ? "" : value).toLowerCase().replace(/\s+/g," ").trim();
}

function submitEnglishVprExam_(data) {
  const user = auth_(data), track = String(data.track||"").toLowerCase();
  if (user.role !== "student" || ["basic","technical"].indexOf(track)<0) throw new Error("Нет доступа к отправке экзамена.");
  const courseId = track === "basic" ? "ENB" : "ENT";
  if (!hasCourseAccess_(user,courseId) && !hasCourseAccess_(user,"EN")) throw new Error("Дисциплина не назначена.");
  const sh=englishVprBank_(), vals=sh.getDataRange().getValues(), m=headerMap_(sh);
  let exam=null;
  for(let i=1;i<vals.length;i++) if(String(vals[i][m.Track]||"")===track && String(vals[i][m.Active]||"").toUpperCase()==="TRUE") { exam=JSON.parse(String(vals[i][m.ExamJSON]||"{}")); validateEnglishVprExam_(track, exam); break; }
  if(!exam) throw new Error("Экзамен не найден на сервере.");
  const submitted=Array.isArray(data.answers)?data.answers:[];
  if(submitted.length!==(exam.tasks||[]).length) throw new Error("Не все задания отправлены.");
  let objective=0, maxObjective=0, written=[];
  (exam.tasks||[]).forEach(function(task,ti) {
    const ans=submitted[ti]||{};
    if(task.type==="choice") (task.items||[]).forEach(function(item,i){maxObjective++;if(Number(ans[i])===Number(item[1]))objective++;});
    else if(task.type==="match") (task.items||[]).forEach(function(item,i){maxObjective++;if(Number(ans[i])===Number(item[2]))objective++;});
    else if(task.type==="gap") (task.answers||[]).forEach(function(expected,i){maxObjective++;if(Number(ans[i])===Number(expected))objective++;});
    else if(task.type==="transform") (task.items||[]).forEach(function(item,i){maxObjective++;const accepted=Array.isArray(item[3])?item[3]:[];if(accepted.map(englishVprNormalize_).indexOf(englishVprNormalize_(ans[i]))>=0)objective++;});
    else if(task.type==="questionnaire") (task.items||[]).forEach(function(question,i){written.push({task:ti,question:question,answer:String(ans[i]||"").slice(0,500),maxPoints:1});});
  });
  const maxScore=maxObjective+written.length;
  const percent=maxObjective?Math.round(objective/maxObjective*100):0;
  const testId=String(exam.id||("english_vpr_"+track+"_2026"));
  const result=saveResult_({token:data.token,email:user.email,name:user.name,group:user.group,courseId:courseId,testId:testId,testTitle:String(exam.title||"English VPR")+" (письменная часть ожидает проверки)",grade:written.length?0:gradeFromPercent_(percent),score:objective,maxScore:maxObjective,percent:percent,timeSpent:Number(data.timeSpent)||0,payload:JSON.stringify({status:written.length?"pending_teacher_review":"checked",writtenAnswers:written}),finishedAt:new Date().toISOString()});
  if (written.length) {
    notifyCourseStaff_(courseId,"written_submission","Письменная часть английского ВПР ожидает проверки",
      user.name+" ("+user.group+") отправил(а) письменную часть экзамена "+String(exam.title||track)+". Откройте журнал результатов по дисциплине "+courseId+" для проверки ответов.",testId);
  }
  return {success:true,score:objective,maxScore:maxObjective,percent:percent,grade:written.length?"На проверке":gradeFromPercent_(percent),writtenCount:written.length};
}


/** Проверка письменной части Basic/Technical VPR преподавателем. */
function gradeEnglishVprWrittenPart_(data) {
  const teacher = auth_(data);
  if (teacher.role !== "teacher" && teacher.role !== "admin") throw new Error("Проверять экзамены может только преподаватель.");
  const studentEmail = email_(data.email), testId = String(data.testId || "").trim();
  const trackMatch = /^english_vpr_(basic|technical)_/.exec(testId);
  if (!studentEmail || !trackMatch) throw new Error("Не выбрана письменная часть экзамена ВПР.");
  const courseId = trackMatch[1] === "basic" ? "ENB" : "ENT";
  editor_(data, courseId);
  const student = userByEmail_(studentEmail);
  if (!student || student.role !== "student" || (!hasCourseAccess_(student, courseId) && !hasCourseAccess_(student, "EN"))) throw new Error("Студент не обучается по этой дисциплине.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let grade, writtenPoints, writtenMax;
  try {
    const sh = results_(), rows = sh.getDataRange().getValues(), map = headerMap_(sh);
    let rowNo = -1, row = null;
    for (let i = rows.length - 1; i >= 1; i--) {
      if (email_(rows[i][map.Email]) === studentEmail && String(rows[i][map.TestId] || "") === testId && sameCourseId_(rows[i][map.CourseId] || courseId, courseId)) {
        rowNo = i + 1; row = rows[i]; break;
      }
    }
    if (!row) throw new Error("Результат экзамена не найден.");
    let payload = {};
    try { payload = JSON.parse(String(row[map.Submission] || "{}")); } catch (e) {}
    const answers = Array.isArray(payload.writtenAnswers) ? payload.writtenAnswers : [];
    if (!answers.length || payload.status !== "pending_teacher_review") throw new Error("У этой попытки нет ожидающей проверки письменной части.");
    writtenMax = answers.reduce(function(sum, item) { return sum + Math.max(0, Number(item.maxPoints) || 1); }, 0);
    writtenPoints = Number(data.points);
    if (!isFinite(writtenPoints) || writtenPoints < 0 || writtenPoints > writtenMax) throw new Error("Баллы за письменную часть должны быть от 0 до " + writtenMax + ".");
    const objectiveScore = Math.max(0, Number(row[map.Score]) || 0);
    const objectiveMax = Math.max(0, Number(row[map.MaxScore]) || 0);
    const totalMax = objectiveMax + writtenMax, totalScore = objectiveScore + writtenPoints;
    const percent = totalMax ? Math.round(totalScore / totalMax * 100) : 0;
    grade = gradeFromPercent_(percent);
    const feedback = String(data.feedback || "").slice(0, 4000);
    payload.status = "graded"; payload.writtenPoints = writtenPoints; payload.writtenMaxPoints = writtenMax;
    payload.writtenFeedback = feedback; payload.reviewedAt = new Date().toISOString();
    updateMappedRecord_(sh, rowNo, {
      Score: totalScore, MaxScore: totalMax, Percent: percent, Grade: grade,
      TestTitle: String(row[map.TestTitle] || "English VPR").replace(/ \(письменная часть ожидает проверки\)$/, ""),
      Submission: JSON.stringify(payload)
    });
    appendAttemptAudit_({EventType:"english_vpr_written_graded",ActorEmail:teacher.email,StudentEmail:studentEmail,StudentName:student.name,Group:student.group,CourseId:courseId,TestId:testId,TestTitle:String(row[map.TestTitle]||"English VPR"),Grade:grade,Score:totalScore,MaxScore:totalMax,Percent:percent});
  } finally { lock.releaseLock(); }
  createNotification_(studentEmail,"grade","Письменная часть ВПР проверена","Итоговая оценка за экзамен: "+grade+"/5. Баллы за письменную часть: "+writtenPoints+"/"+writtenMax+".",courseId,testId);
  return {success:true,grade:grade,writtenPoints:writtenPoints,writtenMaxPoints:writtenMax};
}
