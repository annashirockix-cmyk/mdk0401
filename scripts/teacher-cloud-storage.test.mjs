import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const gs=fs.readFileSync(new URL("../Code.gs",import.meta.url),"utf8");
const api=fs.readFileSync(new URL("../api.js",import.meta.url),"utf8");
const page=fs.readFileSync(new URL("../teacher-storage.js",import.meta.url),"utf8");
const courseAdmin=fs.readFileSync(new URL("../course-admin.js",import.meta.url),"utf8");
const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("teacher cloud storage supports four allowlisted providers and app-folder scopes",()=>{
 for(const key of ["google","yandex","onedrive","dropbox"])assert.match(gs,new RegExp(key+": \\{ name:"));
 assert.match(gs,/drive\.file/);assert.match(gs,/disk\.app_folder/);assert.match(gs,/Files\.ReadWrite\.AppFolder/);assert.match(gs,/files\.content\.write/);
});
test("cloud OAuth requires a teacher session and short-lived one-time state",()=>{
 assert.match(gs,/auth_\(data\)[\s\S]*?Подключать личные хранилища могут только преподаватели/);
 assert.match(gs,/TEACHER_CLOUD_STATE_/);assert.match(gs,/10 \* 60 \* 1000/);assert.match(gs,/props\.deleteProperty\(stateKey\)/);
});
test("cloud tokens stay server-side and are never returned by status API",()=>{
 assert.match(gs,/TEACHER_CLOUD_TOKEN_/);assert.match(gs,/connected: !!\(token && token\.refreshToken\)/);
 assert.doesNotMatch(gs,/return \{[^}]*accessToken/);
});
test("teacher storage page and API are wired into the portal",()=>{
 assert.match(api,/getTeacherCloudStorage/);assert.match(api,/beginTeacherCloudOAuth/);assert.match(api,/disconnectTeacherCloudStorage/);
 assert.match(html,/teacher-storage\.js/);assert.match(html,/teacher-storage\.css/);assert.match(html,/#\/teacher-storage/);
 assert.match(page,/Google Drive/);assert.match(page,/Яндекс Диск/);assert.match(page,/OneDrive/);assert.match(page,/Dropbox/);
});

test("OAuth redirect URI reaches Apps Script callback and provider is resolved from one-time state",()=>{
 assert.ok(gs.includes('return url + (url.indexOf("?") >= 0 ? "&" : "?") + "action=cloudOAuthCallback"'));
 assert.match(gs,/providerKey = String\(savedState\.provider \|\| ""\)\.toLowerCase\(\)/);
 assert.doesNotMatch(gs,/const providerKey = String\(params\.provider/);
});

test("course attachments support connected teacher clouds with server-side token refresh",()=>{
 assert.match(gs,/function teacherCloudAccessToken_\(email, providerKey\)/);
 assert.match(gs,/grant_type: "refresh_token"/);
 assert.match(gs,/function teacherCloudUploadFile_\(providerKey, ownerEmail, bytes, mime, originalName\)/);
 for(const endpoint of ["www.googleapis.com/upload/drive/v3/files","cloud-api.yandex.net/v1/disk/resources/upload","graph.microsoft.com/v1.0/me/drive/special/approot","content.dropboxapi.com/2/files/upload"])assert.ok(gs.includes(endpoint));
 assert.match(gs,/function teacherCloudDownloadFile_\(providerKey, ownerEmail, encodedKey\)/);
 assert.match(gs,/cloudfile:\(google\|yandex\|onedrive\|dropbox\)/);
});
test("cloud attachments are owned by the uploader and access-checked before student downloads",()=>{
 assert.match(gs,/cloudOwnerEmail/);
 assert.match(gs,/email_\(record\[6\] \|\| ""\)/);
 assert.match(gs,/customContentIsOpen_\(courseId, itemId, String\(record\[2\] \|\| ""\), "file"\)/);
 assert.match(gs,/Сначала удалите или перенесите все учебные файлы/);
});
test("course editor exposes connected personal drives for both topic and lecture attachments",()=>{
 assert.match(api,/uploadCourseFile:function\(courseId,topicId,title,fileName,dataUrl,lectureId,storageProvider\)/);
 assert.match(page,/getTeacherCloudStorage/);
 assert.match(courseAdmin,/courseFileStorage/);
 assert.match(courseAdmin,/uploadCourseFile\(courseSel\.value,topicId,file\.name,file\.name,dataUrl,lectureId,storageSel/);
});

test("cloud files are removed with their material and prevent unsafe disconnect",()=>{
 assert.match(gs,/teacherCloudDeleteFile_\(cloudMatch\[1\], email_\(values\[i\]\[6\] \|\| ""\), cloudMatch\[2\]\)/);
 assert.match(gs,/Сначала удалите или перенесите все учебные файлы/);
});
test("teacher cloud setup explains callback URL and attachment scope",()=>{
 assert.match(fs.readFileSync(new URL("../TEACHER_CLOUD_STORAGE_SETUP.md",import.meta.url),"utf8"),/action=cloudOAuthCallback/);
 assert.match(fs.readFileSync(new URL("../TEACHER_CLOUD_STORAGE_SETUP.md",import.meta.url),"utf8"),/Тексты лекций, тесты, карточки/);
});
