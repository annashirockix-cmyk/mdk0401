import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const gs=fs.readFileSync(new URL("../Code.gs",import.meta.url),"utf8");
const api=fs.readFileSync(new URL("../api.js",import.meta.url),"utf8");
const page=fs.readFileSync(new URL("../teacher-storage.js",import.meta.url),"utf8");
const courseAdmin=fs.readFileSync(new URL("../course-admin.js",import.meta.url),"utf8");
const app=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");
const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const setup=fs.readFileSync(new URL("../TEACHER_CLOUD_STORAGE_SETUP.md",import.meta.url),"utf8");
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

test("cloud token refresh uses a user-scoped lock to avoid nesting the content sheet script lock",()=>{
 assert.match(gs,/LockService\.getUserLock\(\)/);
 assert.match(gs,/const readableName = String\(originalName \|\| "material"\)/);
});

test("Google Drive stores teacher uploads in a dedicated app-created portal folder",()=>{
 assert.match(gs,/function teacherCloudGoogleFolder_\(ownerEmail\)/);
 assert.match(gs,/name: "Учебный портал", mimeType: "application\/vnd\.google-apps\.folder"/);
 assert.match(gs,/parents: \[folderId\]/);
 assert.match(gs,/teacherCloudTokenKey_\(ownerEmail, "google"\) \+ "_FOLDER"/);
});

test("teacher can export an isolated backup of authored course content to a connected cloud",()=>{
 assert.match(gs,/function backupTeacherMaterials_\(data\)/);
 assert.match(gs,/const tokenKey = teacherCloudTokenKey_\(user\.email, provider\.key\)/);
 assert.match(gs,/owner !== user\.email \|\| !courseId \|\| !hasCourseAccess_\(user, courseId\)/);
 assert.match(gs,/format: "mdk0401-teacher-materials-backup", formatVersion: 1/);
 assert.match(gs,/teacherCloudUploadFile_\(provider\.key, user\.email, blob\.getBytes\(\), "application\/json", fileName\)/);
 assert.match(gs,/TeacherCloudBackups: \["BackupId", "OwnerEmail", "Provider"/);
 assert.match(gs,/Данные студентов, оценки, попытки и личные сведения не включены/);
 assert.match(gs,/Самодостаточная копия авторских записей CourseContent и бинарных вложений PDF, DOC и DOCX/);
 assert.match(api,/backupTeacherMaterials:function\(provider\)/);
 assert.match(page,/data-backup/);
 assert.match(page,/Создать резервную копию/);
});
test("backup history is private to the signed-in teacher",()=>{
 assert.match(gs,/backupRows = backupSheet\.getDataRange\(\)\.getValues\(\)\.slice\(1\)\.filter\(function\(row\) \{ return email_\(row\[1\] \|\| ""\) === user\.email; \}\)/);
 assert.match(gs,/backupRows\.slice\(0, 12\)/);
});

test("teacher cloud backup API exports only owned accessible course content and stores a private history",()=>{
 assert.match(gs,/TeacherCloudBackups: \["BackupId", "OwnerEmail", "Provider"/);
 assert.match(gs,/function backupTeacherMaterials_\(data\)/);
 assert.match(gs,/owner !== user\.email \|\| !courseId \|\| !hasCourseAccess_\(user, courseId\)/);
 assert.match(gs,/format: "mdk0401-teacher-materials-backup", formatVersion: 1/);
 assert.match(gs,/teacherCloudUploadFile_\(provider\.key, user\.email, blob\.getBytes\(\), "application\/json", fileName\)/);
 assert.match(gs,/backupRows = backupSheet\.getDataRange\(\)\.getValues\(\)\.slice\(1\)\.filter\(function\(row\) \{ return email_\(row\[1\] \|\| ""\) === user\.email; \}\)/);
 assert.match(gs,/Данные студентов, оценки, попытки и личные сведения не включены/);
 assert.match(gs,/contentBase64: Utilities\.base64Encode\(bytes\)/);
 assert.match(api,/backupTeacherMaterials:function\(provider\)/);
 assert.match(page,/data-backup/);
 assert.match(page,/Создать резервную копию/);
});
test("teacher cloud backup controls refresh cached storage assets",()=>{
 assert.match(html,/teacher-storage\.js\?v=4/);
 assert.match(html,/teacher-storage\.css\?v=4/);
 assert.match(html,/service-worker\.js\?v=447/);
 assert.match(fs.readFileSync(new URL("../service-worker.js",import.meta.url),"utf8"),/portal-cache-v447/);
});

test("teacher cloud backups embed verified PDF, DOC and DOCX attachments in the archive",()=>{
 assert.match(gs,/function teacherBackupAttachment_\(row, payload, courseId\)/);
 assert.match(gs,/contentBase64: Utilities\.base64Encode\(bytes\)/);
 assert.match(gs,/attachmentBytes > 8000000/);
 assert.match(gs,/attachmentCount: attachmentCount, attachmentBytes: attachmentBytes/);
 assert.match(gs,/Самодостаточная копия авторских записей CourseContent и бинарных вложений PDF, DOC и DOCX/);
 assert.match(gs,/Восстановление из архива выполняется отдельно/);
 assert.match(page,/В копию входят авторские материалы и вложенные PDF, DOC и DOCX/);
 assert.match(page,/r\.attachmentCount/);
});

test("teacher cloud backup uses stored MIME when cloud provider returns generic content type",()=>{
 assert.match(gs,/let mime = String\(blob\.getContentType\(\) \|\| ""\)\.toLowerCase\(\)/);
 assert.match(gs,/if \(allowedMimes\.indexOf\(mime\) < 0\) mime = String\(payload\.mimeType \|\| ""\)\.toLowerCase\(\)/);
});

test("teacher can preview and safely restore a self-contained backup with fresh IDs",()=>{
 assert.match(gs,/function teacherLoadBackupForRestore_/);
 assert.match(gs,/function previewTeacherRestore_/);
 assert.match(gs,/function restoreTeacherMaterials_/);
 assert.match(gs,/formatVersion\) !== 1/);
 assert.match(gs,/idMap\[String\(item\.id\)\] = Utilities\.getUuid\(\)/);
 assert.match(gs,/Восстановление отменено; созданные записи и файлы очищены/);
 assert.match(api,/previewTeacherRestore:function\(backupId\)/);
 assert.match(api,/restoreTeacherMaterials:function\(backupId\)/);
 assert.match(page,/data-restore/);
 assert.match(page,/Существующие записи не перезаписываются/);
});
test("restored attachments are validated and stored privately in portal Drive",()=>{
 assert.match(gs,/contentBase64/);
 assert.match(gs,/attachmentBytes > 8000000/);
 assert.match(gs,/assertPortalPrivateFile_\(file, courseFileFolder_\(\)/);
 assert.match(gs,/payload\.fileRef = "coursefile:"/);
 assert.match(gs,/teacherCloudDownloadFile_\(provider\.key, user\.email, match\[2\]\)/);
});
test("teacher storage restore UI uses refreshed cached assets",()=>{
 assert.match(html,/teacher-storage\.js\?v=4/);
 assert.match(html,/teacher-storage\.css\?v=4/);
 assert.match(html,/service-worker\.js\?v=447/);
 assert.match(fs.readFileSync(new URL("../service-worker.js",import.meta.url),"utf8"),/portal-cache-v447/);
});

test("large lecture videos upload in private chunks and stream through access-checked chunk reads",()=>{
 assert.match(gs,/function startCourseVideoUpload_\(/);
 assert.match(gs,/function uploadCourseVideoChunk_\(/);
 assert.match(gs,/function finishCourseVideoUpload_\(/);
 assert.match(gs,/function getCourseVideoChunk_\(/);
 assert.match(gs,/150 \* 1024 \* 1024/);
 assert.match(gs,/PortalVideoUpload\|/);
 assert.match(gs,/assertPortalPrivateFolder_/);
 assert.match(gs,/customContentIsOpen_\(courseId, itemId, String\(record\[2\] \|\| ""\), "file"\)/);
 assert.match(api,/startCourseVideoUpload:function/);
 assert.match(api,/uploadCourseVideoChunk:function/);
 assert.match(api,/getCourseVideoChunk:function/);
 assert.ok(courseAdmin.includes("video/mp4"));
 assert.ok(courseAdmin.includes("uploadCourseVideoChunk"));
 assert.match(app,/getCourseVideoChunk/);
 assert.match(app,/createElement\("video"\)/);
});

test("lecture attachment UI and setup docs distinguish cloud documents from portal-hosted videos",()=>{
 assert.match(courseAdmin,/личный диск для видео пока не поддерживается/);
 assert.match(courseAdmin,/Хранилище для документов к темам и лекциям/);
 assert.match(setup,/Видео MP4, WEBM и MOV \(до 150 МБ\) пока загружаются частями в закрытое хранилище Google Drive портала/);
 assert.match(setup,/Восстановление доступно через кнопку «Проверить и восстановить»/);
});
