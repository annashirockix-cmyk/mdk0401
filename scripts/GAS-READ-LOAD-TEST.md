# Read-only Apps Script concurrency smoke test

This script measures read latency for the deployed Google Apps Script API with up to 100 concurrent student sessions. It is **read-only**: it does not submit tests, change grades, create attempts, or edit materials.

## Before running

1. Deploy the current `Code.gs` and `EnglishVPR-Sheets.gs` files as a new Apps Script web-app version.
2. Use the deployed `/exec` URL, not the editor `/dev` URL.
3. Create or use dedicated test-student accounts with access to the selected course.
4. Obtain their current session tokens from the test browser sessions. Never put tokens in this repository, a screenshot, or a shared log.

## Windows PowerShell

```powershell
$env:GAS_WEB_APP_URL = "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
$env:GAS_TEST_TOKENS = "TEST_TOKEN_1,TEST_TOKEN_2"
$env:GAS_COURSE_ID = "07.01"
$env:GAS_TEST_ID = "test_0701_01"
$env:GAS_CONCURRENCY = "40"
# Optional: include the protected English VPR read endpoint for students with English access.
$env:GAS_ENGLISH_TRACK = "technical"

node scripts/gas-read-load-test.mjs

Remove-Item Env:GAS_WEB_APP_URL, Env:GAS_TEST_TOKENS, Env:GAS_COURSE_ID, Env:GAS_TEST_ID, Env:GAS_CONCURRENCY, Env:GAS_ENGLISH_TRACK
```

Set `GAS_TEST_TOKENS` to a comma-separated list of session tokens. The script cycles through them. For a realistic 40-student run, use 40 distinct test-student tokens; with one token, the test stresses the API using one account and is not a full multi-account simulation.

## What it measures

Each virtual student sequentially calls:

- `getMyCourseResults`
- `getCustomContent`
- `getTestAttemptStatus`
- optionally `getEnglishVprExam` for `basic` or `technical`

The report includes success counts and p50/p95/maximum latency per action. Any failed request makes the process exit with code 1.

This is a backend read-load smoke test, not a write/submit stress test and not a substitute for monitoring the real student experience. Do not use real student tokens or accounts.
