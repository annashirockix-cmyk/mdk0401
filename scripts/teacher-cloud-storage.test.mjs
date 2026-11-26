import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const api = readFileSync(new URL("../api.js", import.meta.url), "utf8");
const ui = readFileSync(new URL("../teacher-storage.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("all four teacher storage providers are registered with least-privilege app scopes", () => {
  for (const provider of ["google", "yandex", "onedrive", "dropbox"]) {
    assert.match(backend, new RegExp(provider + ":\\s*\\{"));
  }
  assert.match(backend, /drive\.file/);
  assert.match(backend, /disk\.app_folder/);
  assert.match(backend, /Files\.ReadWrite\.AppFolder/);
  assert.match(backend, /files\.content\.write/);
});

test("OAuth state is one-time, expiring and bound to the authenticated portal user", () => {
  assert.match(backend, /cloud_oauth_state:/);
  assert.match(backend, /expiresAt: Date\.now\(\) \+ 600000/);
  assert.match(backend, /props\.deleteProperty\(stateKey\)/);
  assert.match(backend, /email: user\.email, provider: key/);
});

test("storage endpoints require a teacher or administrator session", () => {
  for (const name of ["getCloudStorageStatus_", "beginCloudStorageConnection_", "disconnectCloudStorage_", "setDefaultCloudStorage_"]) {
    assert.match(backend, new RegExp("function " + name));
  }
  assert.match(backend, /auth_\(data\)/);
  assert.match(backend, /Личные хранилища доступны только преподавателям/);
});

test("provider tokens are kept server-side and are never returned by status API", () => {
  assert.match(backend, /props\.setProperty\(cloudStorageKey_\(saved\.email, saved\.provider\), JSON\.stringify\(record\)\)/);
  const status = backend.slice(backend.indexOf("function getCloudStorageStatus_"), backend.indexOf("function beginCloudStorageConnection_"));
  assert.doesNotMatch(status, /accessToken|refreshToken/);
  assert.match(status, /connected: connected/);
});

test("teacher UI and API expose connect, disconnect and default-storage actions", () => {
  for (const action of ["getCloudStorageStatus", "beginCloudStorageConnection", "disconnectCloudStorage", "setDefaultCloudStorage"]) {
    assert.ok(api.includes(action));
  }
  assert.match(ui, /data-connect/);
  assert.match(ui, /data-disconnect/);
  assert.match(ui, /data-default/);
  assert.match(html, /teacher-storage\.js/);
});
