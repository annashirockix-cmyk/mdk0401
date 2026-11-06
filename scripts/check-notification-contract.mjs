import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const api = readFileSync(new URL("../api.js", import.meta.url), "utf8");
const backend = readFileSync(new URL("../Code.gs", import.meta.url), "utf8");

const requiredIds = [
  "notificationWrap", "notificationBell", "notificationBadge",
  "notificationPopover", "notificationMarkAll", "notificationRefresh",
  "notificationClose", "notificationStatusFilter", "notificationCourseFilter",
  "notificationPrefsBtn", "notificationPrefs", "notificationPrefsList",
  "notificationItems"
];

for (const id of requiredIds) {
  const matches = html.match(new RegExp('\\bid="' + id + '"', "g")) || [];
  assert.equal(matches.length, 1, `Expected exactly one #${id}, found ${matches.length}`);
}

assert.match(app, /window\.setupNotificationCenter\s*=\s*function/);
assert.match(app, /notificationStatusFilter\s*===\s*"unread"/);
assert.match(app, /notificationCourseFilter\s*!==\s*"all"/);
assert.match(app, /mdk\.notificationPrefs\.v1\./);
assert.match(api, /markAllNotificationsRead\s*:\s*function/);
assert.match(backend, /case\s+"markallnotificationsread"\s*:\s*result\s*=\s*markAllNotificationsRead_\(data\)/);
assert.match(backend, /function\s+markAllNotificationsRead_\s*\(data\)/);
assert.match(backend, /email_\(vals\[i\]\[m\.RecipientEmail\]\)\s*===\s*user\.email\s*&&\s*!vals\[i\]\[m\.ReadAt\]/);

console.log(`Notification contract OK: ${requiredIds.length} unique UI IDs and frontend/backend actions verified.`);

// Teacher analytics dashboard regression checks.
const reports = readFileSync(new URL("../reports.js", import.meta.url), "utf8");
assert(reports.includes("window.API.getAssignments()"), "reports load assignment data");
assert(reports.includes("Активность по заданиям"), "reports show assignment activity panel");
assert(reports.includes("Индивидуальные задания учитываются"), "individual assignments are not misattributed to groups");
assert(reports.includes("не персональная отметка о задолженности"), "no-response counts are not labeled as individual debt");
