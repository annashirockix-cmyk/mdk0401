import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts", "gas-read-load-test.mjs");

function runLoadTest(env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "", stderr = "";
    child.stdout.setEncoding("utf8").on("data", chunk => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", chunk => { stderr += chunk; });
    child.once("error", reject);
    child.once("close", code => resolve({ code, stdout, stderr }));
  });
}

test("read-only load runner exercises 40 concurrent virtual students against a local stub", async t => {
  const seen = [];
  let active = 0, maxActive = 0;
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    active++;
    maxActive = Math.max(maxActive, active);
    seen.push({ method: req.method, action: url.searchParams.get("action"), token: url.searchParams.get("token") });
    setTimeout(() => {
      active--;
      res.writeHead(200, { "content-type": "application/json", "connection": "close" });
      res.end(JSON.stringify({ success: true, data: [] }));
    }, 8);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  t.after(() => new Promise(resolve => server.close(resolve)));

  const tokens = Array.from({ length: 40 }, (_, i) => "dedicated-test-token-" + i);
  const result = await runLoadTest({
    GAS_WEB_APP_URL: `http://127.0.0.1:${port}/exec`,
    GAS_ALLOW_LOCAL_HTTP_TEST: "1",
    GAS_TEST_TOKENS: tokens.join(","),
    GAS_COURSE_ID: "07.01",
    GAS_TEST_ID: "load-test-fixture",
    GAS_CONCURRENCY: "40",
    GAS_REQUEST_TIMEOUT_MS: "10000"
  });

  assert.equal(result.code, 0, result.stderr + result.stdout);
  assert.equal(seen.length, 120, "40 students should make 3 read requests each");
  assert.equal(new Set(seen.map(x => x.token)).size, 40, "each virtual student should use a distinct token");
  assert.ok(seen.every(x => x.method === "GET"));
  assert.deepEqual([...new Set(seen.map(x => x.action))].sort(),
    ["getCustomContent", "getMyCourseResults", "getTestAttemptStatus"].sort());
  assert.ok(maxActive > 1, "requests should overlap to create concurrent load");
  assert.ok(result.stdout.includes("Virtual students: 40"));
  assert.ok(result.stdout.includes("Failures: 0"));
});

test("load runner rejects plain HTTP unless explicitly limited to localhost", async () => {
  const result = await runLoadTest({
    GAS_WEB_APP_URL: "http://example.com/exec",
    GAS_TEST_TOKENS: "fixture-token",
    GAS_COURSE_ID: "07.01",
    GAS_TEST_ID: "load-test-fixture"
  });
  assert.equal(result.code, 2);
  assert.match(result.stderr, /HTTPS Apps Script \/exec URL/);
});
