import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");

function createRuntime() {
  const contentRows = [], files = new Map(), properties = new Map();
  let fileNo = 0, privateFolder = false, published = false;
  const folder = {
    getId: () => "course-folder",
    setSharing(access, permission) { privateFolder = access === "PRIVATE" && permission === "NONE"; },
    createFile(blob) {
      const id = "course-drive-" + (++fileNo);
      const file = {
        getId: () => id, getName: () => blob.name, getBlob: () => blob,
        setDescription() {}, setTrashed(value) { if (value) file.trashed = true; },
        trashed: false
      };
      files.set(id, file);
      return file;
    }
  };
  const sandbox = {
    console,
    Utilities: {
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
        setProperty: (key, value) => properties.set(key, value),
        deleteProperty: key => properties.delete(key)
      })
    },
    DriveApp: {
      Access: { PRIVATE: "PRIVATE" }, Permission: { NONE: "NONE" },
      createFolder: () => folder, getFolderById: () => folder,
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
    teacher: { email: "teacher@example.test", role: "teacher", courses: "07.01" },
    student: { email: "student@example.test", role: "student", courses: "07.01" },
    outsider: { email: "outsider@example.test", role: "student", courses: "MAT" }
  };
  sandbox.auth_ = data => {
    const user = users[data?.token];
    if (!user) throw new Error("Требуется авторизация.");
    return user;
  };
  sandbox.editor_ = (data, courseId) => {
    const user = sandbox.auth_(data);
    if (user.role !== "teacher" || !user.courses.split(",").includes(courseId)) {
      throw new Error("У вас нет прав редактировать эту дисциплину.");
    }
    return user;
  };
  sandbox.hasCourseAccess_ = (user, courseId) => user.courses.split(",").includes(courseId);
  sandbox.customContentIsOpen_ = () => published;
  sandbox.content_ = () => ({
    getDataRange: () => ({ getValues: () => [[], ...contentRows.map(row => row.slice())] })
  });
  sandbox.saveCustomContent_ = data => {
    const id = "course-content-1";
    contentRows.push([id, data.mdkId, data.topicId, data.type, data.title, JSON.stringify({
      fileRef: data.fileRef, fileName: data.fileName, mimeType: data.mimeType, size: data.size
    })]);
    return { success: true, id };
  };
  return { sandbox, files, get privateFolder() { return privateFolder; }, set published(value) { published = value; } };
}

test("course attachments require an editor, private storage and a published course-content reference for students", () => {
  const r = createRuntime(), api = r.sandbox;
  const bytes = Buffer.from("%PDF-1.4\\nLecture handout\\n%%EOF");
  const pdf = bytes.toString("base64");
  const payload = {
    courseId: "07.01", topicId: "topic-1", title: "Памятка",
    fileName: "lecture", dataUrl: "data:application/pdf;base64," + pdf
  };

  assert.throws(() => api.uploadCourseFile_({ ...payload, token: "student" }), /прав|редактировать/);
  assert.throws(() => api.uploadCourseFile_({
    ...payload, token: "teacher", dataUrl: "data:application/pdf;base64," + Buffer.from("not PDF").toString("base64")
  }), /не похоже на PDF/);
  assert.throws(() => api.uploadCourseFile_({ ...payload, token: "teacher", fileName: "wrong.docx" }), /расширение/i);

  const uploaded = api.uploadCourseFile_({ ...payload, token: "teacher" });
  assert.equal(uploaded.success, true);
  assert.equal(uploaded.fileName, "lecture.pdf");
  assert.equal(r.privateFolder, true, "the Drive folder must be private");

  const request = { token: "student", itemId: uploaded.id, fileRef: "coursefile:" + [...r.files.keys()][0] };
  assert.throws(() => api.getCourseFile_(request), /закрыт преподавателем/);
  r.published = true;
  const downloaded = api.getCourseFile_(request);
  assert.equal(downloaded.fileName, "lecture.pdf");
  assert.equal(downloaded.mimeType, "application/pdf");
  assert.equal(Buffer.from(downloaded.data, "base64").toString(), bytes.toString());
  assert.throws(() => api.getCourseFile_({ ...request, token: "outsider" }), /доступа/);
  assert.throws(() => api.getCourseFile_({ ...request, fileRef: "coursefile:someone-elses-id" }), /не совпадает/);
});
