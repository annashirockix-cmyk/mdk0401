function englishVprSeedExams_() {
  return {
    basic: {
      id:"english_vpr_basic_2026", track:"basic", title:"Basic English — итоговая проверочная работа", time:90, maxScore:40,
      audioText:"Hello, Kate. Are you ready for the college open day? Almost. I have prepared the presentation about our college library. I visited it last week to collect some information. What about you, Mark? I am going to show the new sports centre. I have never been inside it before, so I asked our teacher to give me a short tour yesterday. Are you taking part in the English quiz? Yes, but I am a little worried because the quiz starts at ten and my bus arrives at ten past nine. That should be enough time. I hope so. I usually travel by bus, but tomorrow my father will drive me because he has a day off. Are your parents coming too? My mother is coming, but my father is working on Saturday. We both want to visit the science exhibition after the presentations. That sounds interesting. I would like to see it too. Let's meet near the main entrance at half past nine.",
      tasks:[
        {title:"1. Аудирование",type:"choice",points:5,instruction:"Прослушайте диалог два раза. Выберите: 1 — Kate, 2 — Mark, 3 — оба, 4 — никто из них.",options:["Kate","Mark","Both speakers","Neither speaker"],items:[
          ["Who prepared a presentation about the college library?",1],["Who has not visited the sports centre before?",2],["Who is worried about arriving on time?",2],["Whose father will drive them to college?",2],["Who wants to visit the science exhibition?",3]
        ]},
        {title:"2. Чтение: установление соответствия",type:"match",points:5,instruction:"Соотнесите тексты A–E с заголовками 1–6. Один заголовок лишний.",options:["A place to study together","Learning through travel","Keeping fit every day","A useful way to save money","Helping the local community","A new hobby for a rainy day"],items:[
          ["A","Our college has a modern library with computers and quiet rooms. Students can borrow books, use the Internet and work on group projects. The library is open until seven in the evening.",1],
          ["B","Last month our group visited a historical town. We walked around the old streets, listened to a guide and learned how people lived many years ago.",2],
          ["C","I cycle to college every morning. At weekends I play volleyball with my friends. Regular activity helps me feel energetic and sleep better.",3],
          ["D","I started making simple models from paper. I watch online lessons and try new designs. It is an inexpensive hobby I can do at home.",6],
          ["E","Our students organised a clean-up day in the park. We collected rubbish, planted flowers and put up signs asking visitors to keep the area clean.",5]
        ]},
        {title:"3. Чтение: восстановление текста",type:"gap",points:5,instruction:"Заполните пропуски A–E частями предложений 1–6. Одна часть лишняя.",text:"Many students have a part-time job while they are studying. A_____. Some work in cafés or shops, while others help younger pupils. A part-time job can teach students to be responsible. B_____. It is also important to plan your time carefully. C_____. Students should remember that education comes first. D_____. A good employer understands that young people need time for classes and homework. E_____.",options:["They choose different kinds of work.","They learn how to communicate with other people.","If they work too many hours, they may become tired.","Some students prefer spending all their time online.","That is why a flexible work schedule is useful.","They can also earn money for personal needs."],answers:[1,6,3,5,2]},
        {title:"4. Лексика: заполнение пропусков",type:"gap",points:5,instruction:"Прочитайте текст. Заполните пропуски A–E подходящими словами из списка. Два слова лишние.",text:"College life helps young people prepare for their future. Students can gain useful A_____ by taking part in practical activities. Teachers encourage B_____ because it develops communication skills. A well-equipped workshop gives students an opportunity to work C_____ with modern tools. Students should always follow safety D_____ and use equipment E_____.",options:["experience","teamwork","safely","rules","carefully","danger","develop"],answers:[1,2,3,4,5]},
        {title:"5. Словообразование в контексте",type:"gap",points:5,instruction:"Прочитайте текст. Для каждого пропуска выберите правильное однокоренное слово из трёх вариантов.",text:"A_____ a car, a motorcycle has only two wheels. Large, B_____ motorcycles are often used for sports. Two German C_____ designed the first motorcycle with an internal combustion engine. The first D_____ motorcycle in the United States appeared in the nineteenth century. It was popular and E_____.",itemOptions:[["Unlike","Dislike","Likely"],["powerfully","powerful","powerless"],["inventors","invent","inventions"],["produced","production","product"],["unreliable","reliable","rely"]],answers:[1,2,1,1,2]},
        {title:"6. Грамматические преобразования",type:"transform",points:5,instruction:"Прочитайте текст. Преобразуйте слова, напечатанные заглавными буквами, так, чтобы они грамматически соответствовали содержанию текста.",items:[
          ["Our college", "popular with local students many years ago.", "BECOME", ["became"]],
          ["Several new workshops", "last year.", "BUILD", ["were built"]],
          ["It is one of the", "colleges in the region.", "GOOD", ["best"]],
          ["Students develop", "professional skills during practical classes.", "THEY", ["their"]],
          ["Our graduates are often the", "to find a job.", "ONE", ["first"]]
        ]},
        {title:"7. Анкета",type:"questionnaire",points:10,instruction:"Вы хотите стать участником международного студенческого клуба. Заполните анкету на английском языке. Каждый ответ — не более 5 слов.",items:["First name","Home country","Hometown","Favourite subject","Future profession","Can you speak any foreign languages?","What do you do in your free time?","Where do you usually study?","Have you taken part in a college event?","Why would you like to join the club?"]}
      ]
    },
    technical: {
      id:"english_vpr_technical_2026", track:"technical", title:"Technical English — итоговая проверочная работа", time:90, maxScore:40,
      audioText:"Good morning, Alex. Are you ready for the workshop demonstration? I think so. I checked the machine instructions yesterday, but I still need to prepare the workpiece. Have you checked the cutting tool? Yes. I inspected it this morning and replaced the worn insert. What about the measuring instruments? The teacher asked me to bring a calliper and a micrometer. They are in the tool cabinet. Remember to wear your safety glasses before the machine starts. Of course. I also checked that the guard is closed. Are we using the CNC lathe today? Yes, we are going to demonstrate a simple turning operation. First, we will set the workpiece in the chuck. Then we will check the tool position and run the programme in simulation mode. Will the spindle start automatically? Only after the operator confirms the setup and presses the cycle start button. Good. I will record the measurements after the operation.",
      tasks:[
        {title:"1. Аудирование",type:"choice",points:5,instruction:"Прослушайте диалог два раза. Выберите: 1 — Alex, 2 — второй студент, 3 — оба, 4 — никто.",options:["Alex","The other student","Both speakers","Neither speaker"],items:[
          ["Who checked the machine instructions yesterday?",1],["Who replaced the worn cutting insert?",1],["Who must bring measuring instruments?",1],["Who mentions checking the safety guard?",1],["Who will record the measurements after machining?",2]
        ]},
        {title:"2. Чтение: установление соответствия",type:"match",points:5,instruction:"Соотнесите тексты A–E с заголовками 1–6. Один заголовок лишний.",options:["Measuring a workpiece accurately","Why machine guards are important","A tool for making round holes","Removing metal with a rotating cutter","Holding a workpiece during turning","Checking a finished surface"],items:[
          ["A","A calliper is a common measuring instrument. It can measure outside dimensions, inside dimensions and depth. The operator should check it before use.",1],
          ["B","A guard protects the operator from moving parts and flying chips. It must be in place before the machine is started.",2],
          ["C","A drill is used to make holes in different materials. Its cutting edges remove material as the tool rotates.",3],
          ["D","During milling, a rotating cutter removes material from a workpiece. Different cutters produce slots and flat surfaces.",4],
          ["E","A chuck is fitted to the spindle of a lathe. It holds the workpiece securely while it rotates.",5]
        ]},
        {title:"3. Чтение: восстановление текста",type:"gap",points:5,instruction:"Заполните пропуски A–E частями предложений 1–6. Одна часть лишняя.",text:"Computer numerical control is widely used in modern manufacturing. A_____. The programme contains instructions for the machine tool. Before machining begins, the operator checks the drawing and the workpiece. B_____. The correct tool must be installed in the tool holder. C_____. The operator should also check the work offset and tool length. D_____. After the setup has been verified, the programme can be tested in simulation mode. E_____.",options:["It allows machines to perform operations automatically and accurately.","The workpiece must be fixed securely in the chuck or vice.","A damaged tool should never be used.","These checks help prevent collisions and incorrect machining.","The machine should be left unattended during the first run.","The operator starts the cycle only after confirming that the area is safe."],answers:[1,2,3,4,6]},
        {title:"4. Лексика: заполнение пропусков",type:"gap",points:5,instruction:"Прочитайте текст. Заполните пропуски A–E подходящими словами из списка. Два слова лишние.",text:"Before machining, the operator must check the A_____ and the technical drawing. The workpiece is fixed securely in a B_____ or vice. A cutting C_____ removes material from the surface. Coolant reduces heat and D_____ during machining. After the operation, the part is checked with a measuring E_____.",options:["workpiece","chuck","tool","friction","instrument","ladder","uniform"],answers:[1,2,3,4,5]},
        {title:"5. Словообразование в контексте",type:"gap",points:5,instruction:"Прочитайте текст. Для каждого пропуска выберите правильное однокоренное слово из трёх вариантов.",text:"A_____ a manual machine, a CNC machine is controlled by a computer. Modern machines can work very B_____. The operator enters a C_____ into the controller. Before machining, all D_____ devices must be checked. Accurate measurement is E_____ for quality control.",itemOptions:[["Unlike","Dislike","Likely"],["precise","precision","precisely"],["programme","programming","programmer"],["protect","protective","protection"],["importance","important","importantly"]],answers:[1,3,1,2,2]},
        {title:"6. Грамматические преобразования",type:"transform",points:5,instruction:"Прочитайте текст. Преобразуйте слова, напечатанные заглавными буквами, так, чтобы они грамматически соответствовали содержанию текста.",items:[
          ["The CNC lathe", "in our workshop last year.", "INSTALL", ["was installed"]],
          ["The operator", "the programme before each cycle.", "CHECK", ["checks"]],
          ["This is one of the", "measuring instruments in the laboratory.", "ACCURATE", ["most accurate"]],
          ["The cutting tool must be returned to", "holder after use.", "IT", ["its"]],
          ["The finished parts", "before delivery to the customer.", "INSPECT", ["are inspected"]]
        ]},
        {title:"7. Анкета",type:"questionnaire",points:10,instruction:"Вы хотите пройти производственную практику в международной компании. Заполните анкету на английском языке. Каждый ответ — не более 5 слов.",items:["First name","Home country","Hometown","What profession are you studying for?","Which machine can you operate?","Which measuring instrument have you used?","Can you read technical drawings?","What safety equipment do you use?","Where would you like to do your work placement?","Why are you interested in this company?"]}
      ]
    }
  };
}

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
    const count = task && task.type === "gap"
      ? (Array.isArray(task.answers) ? task.answers.length : 0)
      : (task && Array.isArray(task.items) ? task.items.length : 0);
    if (!task || task.type !== expectedTypes[index] || count !== expectedCounts[index]) {
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
  if (["basic", "technical"].indexOf(track) < 0) {
    throw new Error("Укажите вариант Basic или Technical.");
  }
  const seeds = englishVprSeedExams_();
  const exam = seeds[track];
  if (!exam || typeof exam !== "object" || !Array.isArray(exam.tasks) || !exam.tasks.length) {
    throw new Error("Серверный вариант экзамена не найден: " + track + ".");
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

function validateEnglishVprWrittenAnswers_(task, answers, taskIndex) {
  if (!task || task.type !== "questionnaire" || !Array.isArray(task.items) || !task.items.length) {
    throw new Error("Структура письменного задания ВПР повреждена.");
  }
  return task.items.map(function(question, index) {
    const raw = answers && answers[index];
    if (typeof raw !== "string") {
      throw new Error("Ответ " + (index + 1) + " письменного задания должен быть текстом.");
    }
    const answer = raw.trim();
    const words = answer ? answer.split(/\s+/).length : 0;
    if (!answer || answer.length > 100 || words > 5) {
      throw new Error("В письменном задании каждый ответ должен содержать от 1 до 5 слов и не более 100 символов.");
    }
    return {task:taskIndex,question:String(question),answer:answer,maxPoints:1};
  });
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
    else if(task.type==="questionnaire") written=written.concat(validateEnglishVprWrittenAnswers_(task,ans,ti));
  });
  const maxScore=maxObjective+written.length;
  const percent=maxObjective?Math.round(objective/maxObjective*100):0;
  const testId=String(exam.id||("english_vpr_"+track+"_2026"));
  const result=saveResult_({token:data.token,email:user.email,name:user.name,group:user.group,courseId:courseId,testId:testId,testTitle:String(exam.title||"English VPR")+" (письменная часть ожидает проверки)",grade:written.length?0:gradeFromPercent_(percent),score:objective,maxScore:maxObjective,percent:percent,timeSpent:Number(data.timeSpent)||0,payload:JSON.stringify({status:written.length?"pending_teacher_review":"checked",writtenAnswers:written}),finishedAt:new Date().toISOString()}, true);
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
      if (email_(rows[i][map.Email]) === studentEmail && String(rows[i][map.TestId] || "") === testId && sameCourseId_(rows[i][map.CourseId] || courseId, courseId) && (!Number(data.attempts) || Number(rows[i][map.Attempts] || 0) === Number(data.attempts))) {
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
