/**
 * Защищённое хранилище семестровых контрольных по английскому языку.
 * Ключи ответов остаются на сервере; клиент получает только вопросы и варианты.
 */
function englishSemesterBank_() { return ensureSheet_("EnglishSemesterBank"); }

function validateEnglishSemesterTests_(tests) {
  if (!Array.isArray(tests) || tests.length !== 10) {
    throw new Error("Для каждого направления требуется ровно 10 семестровых контрольных.");
  }
  let questionCount = 0;
  tests.forEach(function(test, index) {
    if (!test || !test.id || !Array.isArray(test.questions) || test.questions.length !== 20) {
      throw new Error("Контрольная №" + (index + 1) + " должна содержать ровно 20 вопросов.");
    }
    test.questions.forEach(function(q, qi) {
      if (!q || !String(q.q || "").trim() || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error("Некорректный вопрос " + (qi + 1) + " в контрольной №" + (index + 1) + ".");
      }
      const correct = Number(q.correct);
      if (!Number.isInteger(correct) || correct < 0 || correct >= q.options.length) {
        throw new Error("Некорректный ключ ответа в контрольной №" + (index + 1) + ", вопрос " + (qi + 1) + ".");
      }
      questionCount++;
    });
  });
  return questionCount;
}

function importEnglishSemesterTests_(data) {
  const actor = auth_(data);
  if (actor.role !== "admin" && actor.role !== "teacher") throw new Error("Импорт доступен только преподавателю.");
  const track = String(data.track || "").toLowerCase();
  if (["basic", "technical"].indexOf(track) < 0) throw new Error("Неизвестное направление английского языка.");
  if (actor.role === "teacher" && !hasCourseAccess_(actor, track === "basic" ? "ENB" : "ENT") && !hasCourseAccess_(actor, "EN")) {
    throw new Error("Нет доступа к импорту этого направления.");
  }
  const tests = data.tests;
  const questionCount = validateEnglishSemesterTests_(tests);
  const json = JSON.stringify(tests);
  if (json.length > 450000) throw new Error("Размер набора превышает 450 КБ.");
  const sh = englishSemesterBank_(), lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const values = sh.getDataRange().getValues(), map = headerMap_(sh);
    let rowNo = 0;
    for (let i = 1; i < values.length; i++) if (String(values[i][map.Track] || "") === track) { rowNo = i + 1; break; }
    const record = {Track:track, TestsJSON:json, Active:"TRUE", UpdatedAt:new Date().toISOString(), UpdatedBy:actor.email};
    if (rowNo) updateMappedRecord_(sh, rowNo, record); else appendMappedRecord_(sh, record);
    return {success:true, track:track, tests:tests.length, questions:questionCount, bytes:json.length, updatedAt:record.UpdatedAt};
  } finally { lock.releaseLock(); }
}

function sanitizeEnglishSemesterTests_(tests) {
  return (tests || []).map(function(test) {
    const safe = JSON.parse(JSON.stringify(test));
    (safe.questions || []).forEach(function(question) { delete question.correct; });
    return safe;
  });
}

function getEnglishSemesterTests_(data) {
  const user = auth_(data), track = String(data.track || "").toLowerCase();
  if (["student","teacher","admin"].indexOf(user.role) < 0 || ["basic","technical"].indexOf(track) < 0) {
    throw new Error("Нет доступа к семестровым контрольным.");
  }
  const courseId = track === "basic" ? "ENB" : "ENT";
  if (!hasCourseAccess_(user, courseId) && !hasCourseAccess_(user, "EN")) {
    throw new Error("Эта дисциплина не назначена вашему аккаунту.");
  }
  const sh = englishSemesterBank_(), values = sh.getDataRange().getValues(), map = headerMap_(sh);
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][map.Track] || "") !== track || String(values[i][map.Active] || "").toUpperCase() !== "TRUE") continue;
    const tests = JSON.parse(String(values[i][map.TestsJSON] || "[]"));
    const questionCount = (tests || []).reduce(function(sum, test) { return sum + ((test.questions || []).length); }, 0);
    return {success:true, track:track, tests:sanitizeEnglishSemesterTests_(tests), testCount:tests.length, questionCount:questionCount};
  }
  return {success:false, error:"Семестровые контрольные ещё не импортированы преподавателем."};
}
