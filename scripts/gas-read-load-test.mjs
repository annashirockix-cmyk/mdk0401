#!/usr/bin/env node
/**
 * Read-only Apps Script load smoke test.
 * Never submits or changes grades. Use dedicated student session tokens.
 */
import { performance } from "node:perf_hooks";

const env = process.env;
const endpoint = String(env.GAS_WEB_APP_URL || "").trim();
const tokens = String(env.GAS_TEST_TOKENS || "").split(",").map(x => x.trim()).filter(Boolean);
const courseId = String(env.GAS_COURSE_ID || "").trim();
const testId = String(env.GAS_TEST_ID || "").trim();
const englishTrack = String(env.GAS_ENGLISH_TRACK || "").trim().toLowerCase();
const concurrency = Math.max(1, Math.min(100, Number(env.GAS_CONCURRENCY || 40)));
const timeoutMs = Math.max(5000, Number(env.GAS_REQUEST_TIMEOUT_MS || 60000));

if (!endpoint || !tokens.length || !courseId || !testId) {
  console.error("Required: GAS_WEB_APP_URL, GAS_TEST_TOKENS, GAS_COURSE_ID, GAS_TEST_ID");
  process.exit(2);
}
let baseUrl;
try {
  baseUrl = new URL(endpoint);
  if (baseUrl.protocol !== "https:") throw new Error("HTTPS required");
} catch {
  console.error("GAS_WEB_APP_URL must be a valid HTTPS Apps Script /exec URL.");
  process.exit(2);
}

const actions = [
  { name: "getMyCourseResults", params: { courseId } },
  { name: "getCustomContent", params: {} },
  { name: "getTestAttemptStatus", params: { courseId, testId } }
];
if (["basic", "technical"].includes(englishTrack)) {
  actions.push({ name: "getEnglishVprExam", params: { track: englishTrack } });
}

const samples = new Map(actions.map(action => [action.name, []]));
const failures = [];
function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)];
}
async function request(action, token, params, userNumber) {
  const url = new URL(baseUrl);
  url.searchParams.delete("action");
  url.searchParams.delete("token");
  url.searchParams.delete("t");
  url.searchParams.set("action", action);
  url.searchParams.set("t", String(Date.now()));
  url.searchParams.set("token", token);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, String(value));
  }
  const started = performance.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs)
    });
    const raw = await response.text();
    if (!response.ok) throw new Error("HTTP " + response.status);
    if (!raw || raw.trim().startsWith("<")) throw new Error("Non-JSON response; check GAS deployment and access");
    let result;
    try { result = JSON.parse(raw); } catch { throw new Error("Invalid JSON response"); }
    if (result && (result.error || result.success === false)) {
      throw new Error(String(result.error || "API returned success=false"));
    }
    samples.get(action).push(performance.now() - started);
  } catch (error) {
    failures.push({ user: userNumber, action, error: String(error && error.message || error) });
  }
}
const started = performance.now();
await Promise.all(Array.from({ length: concurrency }, async (_, index) => {
  const token = tokens[index % tokens.length];
  for (const action of actions) await request(action.name, token, action.params, index + 1);
}));
const elapsed = performance.now() - started;
console.log("Apps Script read-only load test");
console.log("Virtual students:", concurrency);
console.log("Unique session tokens:", new Set(tokens).size);
console.log("Requests per student:", actions.length);
console.log("Total requests:", concurrency * actions.length);
console.log("Total elapsed (s):", (elapsed / 1000).toFixed(2));
for (const action of actions) {
  const values = samples.get(action.name);
  console.log(
    action.name + ":",
    values.length + "/" + concurrency,
    "ok | p50 " + percentile(values, 0.50).toFixed(0) + " ms | p95 " +
    percentile(values, 0.95).toFixed(0) + " ms | max " +
    (values.length ? Math.max(...values).toFixed(0) : "n/a") + " ms"
  );
}
console.log("Failures:", failures.length);
for (const failure of failures.slice(0, 20)) {
  console.log(" - user " + failure.user + " / " + failure.action + ": " + failure.error);
}
if (failures.length) process.exitCode = 1;
