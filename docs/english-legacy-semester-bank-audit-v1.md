# Legacy English semester-bank separation audit v1

Date: 2026-11-15  
Scope: `english-assessment-data.js`, the ten Technical draft batches, and the protected-bank import boundary.

## Findings

1. The legacy Basic dataset contains 10 tests and 200 questions.
2. The legacy Technical dataset was generated with `window.SEMESTER_TESTS.basic.map(...)`. A normalized comparison confirmed that **all 200 of 200 Technical question stems were identical to Basic**. Only test IDs and labels differed. This was not a genuinely separate ESP assessment bank.
3. The legacy Basic dataset also repeats 12 stems across tests: one generic “Which sentence is correct?” prompt and eleven questions in test 10 that repeat earlier items. The cloned Technical data inherited the same repeats.
4. The legacy Basic questions have no server-side answer-key field in this client data file. They must not be treated as the authoritative protected assessment bank.
5. A separate Technical authoring pool exists in `docs/english-technical-semester-bank-draft-v1.md` through `v10.md`: 200 questions, 20 per batch, four options per question, teacher-key rows, and balanced key positions (50 each for A/B/C/D). A structural parse found no duplicate substantive stems in that draft pool.
6. The Technical draft documents explicitly require subject-specialist and English-methodologist review. They are not approved for student release or protected-bank import.

## Containment change

The client-side legacy Technical array is now empty instead of cloning Basic. Basic remains unchanged. The 200 Technical draft items remain authoring material only; their answer keys are not moved into browser-delivered code and no protected Google Sheet is modified. The server import validator now normalizes whitespace, rejects repeated question stems across all ten tests in one track, and rejects identical substantive stems between the Basic and Technical banks.

## Release gates

- Review Technical draft items for terminology, difficulty, ESP balance and alignment with the approved five-year work programme.
- Review Basic legacy repeats and create a separately keyed Basic assessment bank.
- Compare the Technical draft against the protected Technical VPR and all current practice/lesson tests.
- Convert only approved material to the server-side schema, import to the protected sheet, read it back, verify answer-key sanitization, and run regression tests.

## Important limitation

This audit is a structural/content-duplication check, not an expert approval of English correctness, CEFR level, vocational curriculum alignment, or operational terminology.
