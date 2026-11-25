import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");

function makeSheet(headers) {
  const rows = [headers.slice()];
  return {
    rows,
    getLastColumn() { return rows[0].length; },
    getLastRow() { return rows.length; },
    getDataRange() { return { getValues: () => rows.map(row => row.slice()) }; },
    getRange(row, column, rowCount = 1, columnCount = 1) {
      return {
        getValues() {
          return Array.from({ length: rowCount }, (_, r) =>
            Array.from({ length: columnCount }, (_, c) => rows[row - 1 + r]?.[column - 1 + c] ?? ""));
        },
        setValues(values) {
          values.forEach((line, r) => {
            while (rows.length <= row - 1 + r) rows.push(new Array(headers.length).fill(""));
            line.forEach((value, c) => { rows[row - 1 + r][column - 1 + c] = value; });
          });
        }
      };
    },
    appendRow(row) { rows.push(row.slice()); }
  };
}

function createRuntime() {
  const sheet = makeSheet(["Id","CourseId","BankId","DriveFileId","FileName","MimeType","Size","Status","UploadedBy","CreatedAt"]);
  const files = new Map(), properties = new Map(), cache = new Map();
  let uuid = 0, fileNo = 0, folderPrivate = false;
  const folder = {
    getId: () => "exam-folder",
    getSharingAccess: () => folderPrivate ? "PRIVATE" : "ANYONE",
    setSharing(access, permission) { folderPrivate = access === "PRIVATE" && permission === "NONE"; },
    createFile(blob) {
      const id = "exam-drive-" + (++fileNo);
      const file = {
        getId: () => id,
        getName: () => blob.name,
        getBlob: () => blob,
        getSharingAccess: () => "PRIVATE", isTrashed: () => !!file.trashed,
        getParents: () => ({hasNext: () => true, next: () => folder}),
        setTrashed(value) { if (value) file.trashed = true; },
        trashed: false
      };
      files.set(id, file);
      return file;
    }
  };
  const sandbox = {
    console,
    Utilities: {
      getUuid: () => "exam-record-" + (++uuid),
      base64Decode: value => Array.from(Buffer.from(value, "base64")),
      base64Encode: value => Buffer.from(value).toString("base64"),
      newBlob: (bytes, mime, name) => ({
        name, bytes: Array.from(bytes),
        getBytes() { return this.bytes; },
        getContentType() { return mime; }
      })
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: key => properties.get(key) || null,
        setProperty: (key, value) => properties.set(key, value)
      })
    },
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key) || null, remove: key => cache.delete(key) }) },
    DriveApp: {
      Access: { PRIVATE: "PRIVATE" }, Permission: { NONE: "NONE" },
      createFolder: () => folder,
      getFolderById: () => folder,
      getFileById: id => {
        const file = files.get(id);
        if (!file || file.trashed) throw new Error("Файл не найден");
        return file;
      }
    }
  };
  vm.createContext(sandbox);
  new vm.Script(backend, { filename: "Code.gs" }).runInContext(sandbox);
  const users = {
    student: { email: "student@example.test", role: "student", courses: "07.01" },
    outsider: { email: "outsider@example.test", role: "student", courses: "MAT" },
    teacher: { email: "teacher@example.test", role: "teacher", courses: "07.01" },
    otherTeacher: { email: "other@example.test", role: "teacher", courses: "MAT" },
    admin: { email: "admin@example.test", role: "admin", courses: "" }
  };
  sandbox.auth_ = data => {
    const user = users[data?.token];
    if (!user) throw new Error("Требуется авторизация.");
    return user;
  };
  sandbox.editor_ = (data, courseId) => {
    const user = sandbox.auth_(data);
    if (user.role !== "admin" && !(user.role === "teacher" && user.courses.split(",").includes(courseId))) {
      throw new Error("У вас нет прав редактировать эту дисциплину.");
    }
    return user;
  };
  sandbox.hasCourseAccess_ = (user, courseId) =>
    user.role === "admin" || user.courses.split(",").includes(courseId);
  sandbox.examFiles_ = () => sheet;
  return { sandbox, sheet, files, cache, get folderPrivate() { return folderPrivate; } };
}

test("exam attachments enforce upload validation, private storage, course access and teacher-only deletion", () => {
  const r = createRuntime(), api = r.sandbox;
  const pdfBytes = Buffer.from("%PDF-1.4\\nExam guide\\n%%EOF");
  const pdf = pdfBytes.toString("base64");
  const payload = {
    courseId: "07.01", bankId: "exam_primary", fileName: "guide",
    dataUrl: "data:application/pdf;base64," + pdf
  };

  assert.throws(() => api.uploadExamFile_({ ...payload, token: "student" }), /прав|редактировать/);
  assert.throws(() => api.uploadExamFile_({ ...payload, token: "teacher", bankId: "public" }), /экзаменационным банкам/);
  assert.throws(() => api.uploadExamFile_({
    ...payload, token: "teacher", dataUrl: "data:application/pdf;base64," + Buffer.from("not a PDF").toString("base64")
  }), /не соответствует/);
  assert.throws(() => api.uploadExamFile_({
    ...payload, token: "teacher", fileName: "wrong.docx"
  }), /Расширение/);

  const uploaded = api.uploadExamFile_({ ...payload, token: "teacher" });
  assert.equal(uploaded.success, true);
  assert.equal(uploaded.fileName, "guide.pdf");
  assert.equal(r.folderPrivate, true, "the Drive folder must be private");
  assert.equal(r.sheet.rows[1][7], "active");

  r.cache.set("finalExam:active-exam", JSON.stringify({email:"student@example.test",courseId:"07.01",startedAt:Date.now()-1000,durationSeconds:3600}));
  const studentDownload = api.getExamFile_({ token: "student", attachmentId: uploaded.id, examId:"active-exam" });
  assert.equal(studentDownload.fileName, "guide.pdf");
  assert.equal(studentDownload.mimeType, "application/pdf");
  assert.equal(Buffer.from(studentDownload.data, "base64").toString(), pdfBytes.toString());
  assert.throws(() => api.getExamFile_({ token: "outsider", attachmentId: uploaded.id, examId:"active-exam" }), /доступа/);
  assert.throws(() => api.getExamFile_({ token: "student", attachmentId: uploaded.id }), /доступа/);
  r.cache.set("finalExam:expired-exam", JSON.stringify({email:"student@example.test",courseId:"07.01",startedAt:Date.now()-4000*1000,durationSeconds:3600}));
  assert.throws(() => api.getExamFile_({ token: "student", attachmentId: uploaded.id, examId:"expired-exam" }), /Время экзамена истекло/);
  assert.equal(r.cache.has("finalExam:expired-exam"), false, "expired attempt must be removed from cache");
  r.cache.set("finalExam:other-exam", JSON.stringify({email:"outsider@example.test",courseId:"07.01",startedAt:Date.now()-1000,durationSeconds:3600}));
  assert.throws(() => api.getExamFile_({ token: "student", attachmentId: uploaded.id, examId:"other-exam" }), /не относится/);
  assert.throws(() => api.getExamFile_({ token: "otherTeacher", attachmentId: uploaded.id }), /прав|доступ/);
  assert.throws(() => api.deleteExamFile_({ token: "student", courseId: "07.01", attachmentId: uploaded.id }), /прав|редактировать/);

  assert.equal(api.deleteExamFile_({ token: "teacher", courseId: "07.01", attachmentId: uploaded.id }).success, true);
  assert.equal(r.sheet.rows[1][7], "deleted");
  assert.throws(() => api.getExamFile_({ token: "student", attachmentId: uploaded.id, examId:"active-exam" }), /не найден/);
  assert.throws(() => api.deleteExamFile_({ token: "teacher", courseId: "07.01", attachmentId: uploaded.id }), /не найден/);
});
