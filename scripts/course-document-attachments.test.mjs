import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const api = readFileSync(new URL("../api.js", import.meta.url), "utf8");
const editor = readFileSync(new URL("../course-admin.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");

test("course documents are uploaded only by an editor and stored in a private Drive folder", () => {
  const start = backend.indexOf("function courseFileFolder_()");
  const end = backend.indexOf("function saveCustomContent_(data)", start);
  assert.ok(start >= 0 && end > start);
  const source = backend.slice(start, end);
  assert.match(source, /editor_\(data, courseId\)/);
  assert.match(source, /COURSE_DOCUMENT_FOLDER_ID/);
  assert.match(source, /DriveApp\.createFolder/);
  assert.match(source, /createFile\(Utilities\.newBlob\(bytes, mime, safeName\)\)/);
  assert.match(source, /setDescription/);
  assert.match(source, /folder\.setSharing\(DriveApp\.Access\.PRIVATE, DriveApp\.Permission\.NONE\)/, "the Drive folder must be explicitly private");
  assert.match(source, /3500000/);
  assert.match(source, /application\/pdf/);
  assert.match(source, /application\/msword/);
  assert.match(source, /openxmlformats-officedocument\.wordprocessingml\.document/);
  assert.match(source, /%PDF-/);
  assert.match(source, /PK/);
  assert.match(source, /namedExtension\.toLowerCase\(\) !== extension/);
});

test("document retrieval is bound to the exact course-content record and access switch", () => {
  const start = backend.indexOf("function getCourseFile_(data)");
  const end = backend.indexOf("function saveCustomContent_(data)", start);
  assert.ok(start >= 0 && end > start);
  const source = backend.slice(start, end);
  assert.match(source, /const user = auth_\(data\)/);
  assert.match(source, /String\(rows\[i\]\[0\] \|\| ""\) === itemId/);
  assert.match(source, /hasCourseAccess_\(user, courseId\)/);
  assert.match(source, /customContentIsOpen_\(courseId, itemId/);
  assert.match(source, /String\(payload\.fileRef \|\| ""\) !== fileRef/);
  assert.match(source, /DriveApp\.getFileById/);
  assert.match(source, /Utilities\.base64Encode/);
});

test("deleting a file material removes its Drive file before deleting the content record", () => {
  const start = backend.indexOf("function deleteCustomContent_(data)");
  const end = backend.indexOf("/* ---------- Administrator:", start);
  const source = backend.slice(start, end);
  const trash = source.indexOf("setTrashed(true)");
  const remove = source.indexOf("sheet.deleteRow");
  assert.ok(trash >= 0 && remove > trash);
  assert.match(source, /Запись материала сохранена/);
});

test("client exposes the upload and authenticated download endpoints", () => {
  assert.match(backend, /case "uploadcoursefile": result = uploadCourseFile_\(data\)/);
  assert.match(backend, /case "getcoursefile": result = getCourseFile_\(data\)/);
  assert.match(api, /uploadCourseFile:function/);
  assert.match(api, /getCourseFile:function/);
});

test("teacher editor accepts only small PDF and Word documents and lists topic files", () => {
  assert.match(editor, /accept=".pdf,.doc,.docx"/);
  assert.match(editor, /file\.size>3500000/);
  assert.match(editor, /uploadCourseFile\(courseSel\.value,topicId,title,file\.name,dataUrl\)/);
  assert.match(editor, /delete-course-file/);
});

test("student topic view downloads protected documents through the API, not a public Drive URL", () => {
  assert.match(app, /window\.API\.getCourseFile\(fileItem\.id, fileItem\.fileRef\)/);
  assert.match(app, /URL\.createObjectURL/);
  assert.match(app, /noopener noreferrer/);
  assert.doesNotMatch(app, /href="\$\{f\.fileUrl\}"/);
});
