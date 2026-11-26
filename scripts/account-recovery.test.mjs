import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { test } from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const account = read("account.js");
const api = read("api.js");
const gas = read("Code.gs");

function loadAccountRoute() {
  const app = { innerHTML: "" };
  const overlay = { style: { display: "flex" } };
  const elements = {
    app,
    loginOverlay: overlay,
    resetRequestForm: { onsubmit: null, reset() {} },
    resetRequestSubmit: { disabled: false },
    resetRequestEmail: { value: "student@example.edu" },
    resetRequestNote: { value: "Не помню пароль" },
    resetRequestStatus: { textContent: "" },
  };
  const document = {
    getElementById(id) { return elements[id] || null; },
    querySelector() { return null; },
    addEventListener() {},
  };
  let baseRouterCalls = 0;
  const window = {
    state: { student: null, staff: null },
    API: { requestPasswordReset: async () => ({ success: true, message: "Запрос принят." }) },
    router() { baseRouterCalls += 1; },
  };
  const context = {
    window,
    document,
    location: { hash: "#/login-help" },
    localStorage: { setItem() {} },
    setTimeout() {},
    console,
    Promise,
  };
  vm.runInNewContext(account, context, { filename: "account.js" });
  return { app, overlay, elements, window, get baseRouterCalls() { return baseRouterCalls; } };
}

test("password recovery route is public and bypasses the authenticated main router", () => {
  const harness = loadAccountRoute();
  harness.window.router();

  assert.equal(harness.baseRouterCalls, 0);
  assert.equal(harness.overlay.style.display, "none");
  assert.match(harness.app.innerHTML, /Восстановление доступа/);
  assert.match(harness.app.innerHTML, /resetRequestForm/);
});

test("password recovery form sends the email and note through the API", async () => {
  const harness = loadAccountRoute();
  let submitted;
  harness.window.API.requestPasswordReset = async (email, note) => {
    submitted = { email, note };
    return { success: true, message: "Запрос принят." };
  };
  harness.window.router();

  let prevented = false;
  await harness.elements.resetRequestForm.onsubmit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.deepEqual(submitted, {
    email: "student@example.edu",
    note: "Не помню пароль",
  });
  assert.equal(harness.elements.resetRequestStatus.textContent, "Запрос принят.");
});

test("login screen exposes recovery and API action names match server routes", () => {
  assert.match(account, /forgotPasswordLink/);
  assert.match(account, /location\.hash\s*=\s*["']#\/login-help["']/);
  assert.match(api, /requestPasswordReset:function\(email,note\)/);
  assert.match(api, /getPasswordRequests:function\(\)/);
  assert.match(api, /resolvePasswordReset:function\(id,temporaryPassword\)/);
  for (const action of ["requestpasswordreset", "getpasswordrequests", "resolvepasswordreset"]) {
    assert.match(gas, new RegExp('case "' + action + '"'));
  }
});

test("recovery requests do not disclose whether an email is registered", () => {
  assert.match(gas, /Не раскрываем наличие аккаунта/);
  assert.match(gas, /Если учётная запись существует, запрос отправлен администратору/);
  assert.match(gas, /function getPasswordRequests_\(data\)\s*\{\s*admin_\(data\)/);
  assert.match(gas, /function resolvePasswordReset_\(data\)\s*\{\s*const actor = admin_\(data\)/);
});

test("password recovery prevents duplicate submissions while the request is in flight", async () => {
  const harness = loadAccountRoute();
  let resolveRequest;
  let calls = 0;
  harness.window.API.requestPasswordReset = () => {
    calls += 1;
    return new Promise(resolve => { resolveRequest = resolve; });
  };
  harness.window.router();
  let prevented = 0;
  const event = { preventDefault() { prevented += 1; } };
  const first = harness.elements.resetRequestForm.onsubmit(event);
  assert.equal(harness.elements.resetRequestSubmit.disabled, true);
  const second = await harness.elements.resetRequestForm.onsubmit(event);
  assert.equal(second, undefined);
  assert.equal(calls, 1);
  assert.equal(prevented, 2);
  resolveRequest({ success: true, message: "Запрос принят." });
  await first;
  assert.equal(harness.elements.resetRequestSubmit.disabled, false);
  assert.equal(harness.elements.resetRequestStatus.textContent, "Запрос принят.");
});
