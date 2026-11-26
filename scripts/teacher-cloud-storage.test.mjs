import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const gs=fs.readFileSync(new URL("../Code.gs",import.meta.url),"utf8");
const api=fs.readFileSync(new URL("../api.js",import.meta.url),"utf8");
const page=fs.readFileSync(new URL("../teacher-storage.js",import.meta.url),"utf8");
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
