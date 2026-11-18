import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [backend, api, editor, finalExam] = await Promise.all([
  readFile(new URL("../Code.gs", import.meta.url), "utf8"),
  readFile(new URL("../api.js", import.meta.url), "utf8"),
  readFile(new URL("../course-admin.js", import.meta.url), "utf8"),
  readFile(new URL("../final.js", import.meta.url), "utf8")
]);

test("exam files use a separate private Drive folder and sheet", () => {
  assert.match(backend, /ExamFiles: \[/);
  assert.match(backend, /"ExamFiles"/);
  assert.match(backend, /function examFiles_\(\)/);
  assert.match(backend, /function examFileFolder_\(\)/);
  assert.match(backend, /folder\.setSharing\(DriveApp\.Access\.PRIVATE,DriveApp\.Permission\.NONE\)/);
});

test("exam upload validates teacher rights, supported formats, signatures, extension and size", () => {
  assert.match(backend, /function uploadExamFile_\(data\)/);
  assert.match(backend, /actor=editor_\(data,courseId\)/);
  assert.ok(backend.includes(String.raw`application\/pdf|application\/msword`));
  assert.match(backend, /bytes\.length>3500000/);
  assert.match(backend, /starts\("%PDF-"\)/);
  assert.match(backend, /starts\("\\xD0\\xCF\\x11\\xE0"\)/);
  assert.match(backend, /starts\("PK\\x03\\x04"\)/);
  assert.match(backend, /Расширение имени файла не соответствует/);
});

test("exam file retrieval is limited to enrolled students or authorized course staff", () => {
  assert.match(backend, /function getExamFile_\(data\)/);
  assert.match(backend, /hasCourseAccess_\(user,courseId\)/);
  assert.match(backend, /editor_\(data,courseId\)/);
  assert.match(backend, /function deleteExamFile_\(data\)/);
  assert.match(backend, /function getQuestionBank_\(data\)[\s\S]*attachments:examFileList_\(courseId,bankId\)/);
  assert.match(backend, /attachments:examFileList_\(courseId,""\)/);
});

test("teacher editor exposes upload, list, download and delete controls for each exam bank", () => {
  assert.match(editor, /id="examFilesPanel"/);
  assert.match(editor, /id="examFileInput"/);
  assert.match(editor, /function drawExamFiles\(files\)/);
  assert.match(editor, /function uploadExamFile\(\)/);
  assert.match(editor, /window\.API\.uploadExamFile/);
  assert.match(editor, /window\.API\.deleteExamFile/);
  assert.match(editor, /window\.API\.getExamFile/);
});

test("student final exam displays and downloads only the attachments returned by the protected exam endpoint", () => {
  assert.match(api, /uploadExamFile:function/);
  assert.match(api, /getExamFile:function/);
  assert.match(api, /deleteExamFile:function/);
  assert.match(finalExam, /serverExam\.attachments/);
  assert.match(finalExam, /window\.API\.getExamFile\(file\.id,serverExam\.examId\)/);
  assert.match(finalExam, /Материалы к экзамену/);
});
