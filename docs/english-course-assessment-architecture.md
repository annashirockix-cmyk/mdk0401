# English courses and assessment architecture

Status: design specification plus partial portal runtime implementation. The five-year English runtime, inline listening integration, Service Worker precache and regression checks are now updated in this PR. Google Sheets, Apps Script deployment and the working Basic/Technical VPR banks are not changed by this runtime stage.

## 1. Target course map

| Course | Track | Semesters | Final exam variants |
|---|---|---:|---:|
| 1 | Basic English | 1–2 | 15 per semester |
| 2 | Basic English | 1–2 | 15 per semester |
| 3 | Technical English | 1–2 | 15 per semester |
| 4 | Technical English | 1–2 | 15 per semester |
| 5 | Technical English | 1–2 | 15 per semester |

Target: 10 course-semester exams × 15 variants = 150 variants.

Do not infer the semester-to-topic allocation from the current Unit numbering. The repository does not currently contain an authoritative five-course/two-semester curriculum map. Until the approved curriculum is attached or located, topic allocation below is provisional and must not be published as a confirmed syllabus.

## 2. Five-year lecture target and provisional map

A separate working map is maintained in `docs/english-five-year-120-lecture-map-v1.md`.

- Target editorial volume: 120 lectures across 10 semesters (12 per semester).
- Existing inventory: 16 Basic + 29 Technical = 45 lectures.
- Planned additions: 32 Basic + 43 Technical = 75 new lectures.
- Courses 1–2 are Basic English; courses 3–5 are Technical English.
- The allocation is provisional and must be checked against the approved English work programme, semester hours, and the exact Belova textbook edition before it is treated as an official syllabus.
- All 75 new lectures have draft teaching materials and are connected to the five-year runtime in ENB/ENT, grouped by course and semester. The filename ranges in the Course 1 / Semester 1 Basic English batch files reflect drafting batches; lesson IDs in headings are authoritative. The full file-to-ID inventory is maintained in `docs/english-five-year-lesson-draft-index-v1.md`. All drafts still require review against the exact Belova textbook edition and approved work programme before formal approval or student publication.

## 3. Existing content inventory

### Basic English
Source: `data-english-basic.js`
- Unit 1 — About Myself (3 lectures)
- Unit 2 — Nizhnekamsk (3)
- Unit 3 — Tatarstan (3)
- Unit 4 — Ecology (3)
- Unit 6 — Additional Reading (4)
- Total: 5 topic blocks, 16 lectures.

Gap: Unit 5 is absent from the topic inventory. Unit 6 is additional reading and should not be treated automatically as a semester unit.

### Technical English
Source: `data-english-technical.js`
- Unit 1 — Materials (3 lectures)
- Unit 2 — Technical Drawing (2)
- Unit 3 — Machine Tools (3)
- Unit 4 — Electricity (2)
- Unit 5 — Electric Circuits (2)
- Unit 6 — Energy Production (2)
- Unit 7 — Electronics (3)
- Unit 8 — Communication (2)
- Unit 9 — Computers (3)
- Unit 10 — Automation (3)
- Unit 11 — Maintenance (2)
- Unit 12 — Safety (2)
- Total: 12 topic blocks, 29 lectures.

The current files provide lesson content, but the topic sequence is not mapped to five named courses and ten semesters. Before expanding the syllabus, validate the topics against the approved work programmes and the Belova textbook used for Basic English.

## 4. Lecture record contract

Every lecture should be addressable independently and linked to its course and semester.

Suggested record:
```js
{
  id: "en-c03-s01-u03-l03",
  courseId: "EN_C03",
  track: "technical",
  semester: 1,
  unitId: "t-unit3",
  title: "Computer Numerical Control (CNC)",
  order: 3,
  outcomes: [],
  keyTerms: [],
  content: "",
  examples: [],
  visuals: [],
  practice: [],
  selfCheck: [],
  answerKeyRef: "server-only"
}
```

Pedagogical minimum for a full lecture:
- measurable learning outcomes and prerequisite knowledge;
- clear explanation, not only a short abstract;
- key terms with contextual examples and Russian equivalents where useful;
- tables, diagrams, relevant photographs or technical illustrations;
- examples tied to the relevant professional context;
- guided practice and independent practice;
- self-check questions with feedback;
- sources / textbook section where applicable.

Do not fill missing lectures with generic duplicated text. Keep the current lecture HTML as source material while migrating it into structured records incrementally.

- Course 2, semester 2 lessons 1–3 are expanded in `docs/english-basic-c02-s02-lessons-01-03-enrichment-draft.md`. The original source lessons (Basic 4.1–4.3) remain unchanged; this file adds guided practice, listening scripts, formative checks and teacher keys.
- Course 2, semester 2 lessons 4–7 are expanded in `docs/english-basic-c02-s02-lessons-04-07-enrichment-draft.md`. The existing Basic 6.1–6.4 source lessons remain unchanged; enrichment adds guided reading, grammar, listening scripts, speaking/writing tasks and teacher keys.
- Course 2, semester 2 new lessons 8–12 are drafted in `docs/english-basic-c02-s02-lessons-08-12-draft.md` (passive voice; coherent paragraphs; climate/resources; science and technology; opinion essay and presentation). These are draft teaching materials connected to the ENB runtime; they remain subject to subject review and curriculum approval.

- Course 3, semester 1 lessons 6–8 (aviation industry, aircraft structure and materials) are drafted in `docs/english-technical-c03-s01-lessons-06-08-draft.md`. The existing Technical 1.1–1.3 and 2.1–2.2 lessons remain unchanged.
- Course 3, semester 1 lessons 9–12 are drafted in `docs/english-technical-c03-s01-lessons-09-12-draft.md` (manufacturing workflow and process sheets; dimensions and measurement; technical word formation and abbreviations; technical descriptions and specification tables). All examples and numerical values are explicitly classroom-only.

- Course 3, semester 2 lessons 6–8 are drafted in `docs/english-technical-c03-s02-lessons-06-08-draft.md` (CNC machine components; axes and coordinates; introductory G-code text reading). The G-code sample is comments-only and explicitly read-only, not executable.


- Course 5, semester 1 lessons 3–6 are drafted in `docs/english-technical-c05-s01-lessons-03-06-draft.md` (maintenance documentation and revision control; fault evidence and neutral reporting; troubleshooting communication and read-back; quality assurance and non-conformity reports). Each lesson includes vocabulary, reading, original listening script, comprehension, language focus, guided practice, professional-route tasks, self-check and teacher key. The package includes a semester checkpoint. All cases are fictional; scripts are text for future recording, not MP3, and the content is not an operational maintenance or inspection procedure.
- Course 4, semester 2 lessons 9–12 are drafted in `docs/english-technical-c04-s02-lessons-09-12-draft.md` (avionics overview and information exchange; programming logic, flowcharts and algorithms; sensor-data validation and diagnostic logs; cybersecurity vocabulary and safe data handling). The four lessons include original Spotlight-style listening scripts, comprehension tasks, language focus, guided practice, teacher keys and an integrated semester review. Listening scripts are text for future recording, not MP3; fictional data and conceptual explanations are not operational aircraft instructions.
- Course 3, semester 2 lessons 9–12 are drafted in `docs/english-technical-c03-s02-lessons-09-12-draft.md` (cutting tools and tool condition; tolerances, fits and surface finish; measuring instruments and first-piece inspection; workshop handover and stop-work language). Classroom values are fictional and not production criteria.

## 5. Assessment banks

Keep the three assessment purposes separate.

### 4.1 Entry diagnostic — `EnglishEntryDiagnosticBank`
- One initial school-English diagnostic for all five courses.
- Suggested format: 30 items, 30–40 minutes.
- Areas: core school grammar, everyday vocabulary, short reading, short dialogues/messages, and a brief writing response.
- No technical vocabulary that students have not yet studied.
- Objective items are graded on the server; writing is routed to teacher review.
- Diagnostic result is informational and must not lower semester grades.
- Store skill-level breakdown and recommendations; allow a later repeat diagnostic for progress comparison.

Suggested metadata: `diagnosticId`, `version`, `timeLimit`, `sections`, `items`, `scoring`, `writingReview`.
Never expose answer keys or scoring rules that reveal answers in the student payload.

### 4.2 Semester checks — `EnglishSemesterBank`
Current source: `english-assessment-data.js`.
- There are 10 Basic source tests, one for each course-year/semester pair, each with 20 items.
- Technical is currently created by mapping over Basic and changing IDs and labels. This is not valid Technical content.
- The target must contain independent items for each track; do not clone Basic questions into Technical.
- Preserve server-side storage, sanitized student payloads, attempt limits, and result persistence already provided by the existing implementation.
- Before finalizing the number of banks, reconcile the legacy 10 Basic + 10 Technical layout with the five-course map. The correct course map has ten course-semester slots; a second parallel set must only exist if the curriculum explicitly requires two distinct track-specific checks for the same slot.

Suggested item metadata: `id`, `type`, `prompt`, `options`, `correctAnswer` (server-only), `points`, `feedbackRef` (optional).
Supported task types should be deliberately limited to those the current renderer and server grader can validate.

### 4.3 Final exams — `EnglishExamVariantsBank`
- 10 exam definitions: one for each course and semester.
- 15 independently assembled variants per exam: 150 total.
- Each variant references a balanced set of tasks from the appropriate course-semester blueprint.
- Store answer keys and rubrics server-side only.
- Student API returns a sanitized variant with no correct answers, rubric internals, or hidden metadata.
- Variant selection must be recorded server-side to prevent changing variants by refreshing the page.
- Preserve the separate 2026 VPR Basic and Technical exams; do not replace or refactor them as part of this work.

Suggested metadata:
```js
{
  examId: "en_c03_s01_final",
  courseId: "EN_C03",
  track: "technical",
  semester: 1,
  durationMinutes: 90,
  maxScore: 40,
  variants: [{ variantId: "v01", blueprintId: "..." }]
}
```

## 6. Server/API boundaries

- Server owns bank contents, correct answers, scoring rules, variant assignment, attempt records, and final grades.
- Student endpoints return sanitized tasks only.
- Submission endpoints accept answers and an assessment/attempt token, not a client-calculated score.
- Server validates course access, assessment availability, attempt count, deadline, task IDs, and answer formats.
- Entry diagnostics must use a separate result namespace and must not write into the semester gradebook.
- Teacher review for writing must be role-checked and auditable.
- Do not create fake student attempts for smoke tests; use a dedicated test mode or fixture dataset.

## 7. Migration sequence

1. Obtain/confirm the approved curriculum map for courses 1–5 and semesters 1–2, including hours and the exact Belova textbook edition.
2. Review the provisional 120-lecture map in `docs/english-five-year-120-lecture-map-v1.md`; validate the allocation of all 45 existing lectures and revise it against the approved programme before publication.
3. Author and review the 75 planned new lectures (32 Basic and 43 Technical); do not treat titles in the map as completed content.
4. Build and review the entry diagnostic independently.
5. Replace the Technical semester clone with independently authored, source-aligned items.
6. Implement the course-semester exam registry and 150-variant validation.
7. Add teacher review and skill reports.
8. Test server sanitization, access control, retakes, concurrency, and persistence in a non-production test environment.
9. Only then import banks to Sheets and deploy Apps Script; keep VPR regression tests green.

## 8. Acceptance checks

- Exactly 5 course IDs and 10 course-semester slots exist.
- Exactly 10 final-exam definitions and 150 unique variant IDs exist.
- No duplicate variant IDs or cross-course task leakage.
- Technical items are independently authored and technically accurate.
- No answer keys appear in student API responses or browser source.
- Entry diagnostic does not affect grades or semester attempt counters.
- A refresh cannot change an assigned exam variant or reset an attempt.
- Existing Basic and Technical VPR load and render exactly as before.

- Course 5, semester 1 lessons 7–10 are drafted in `docs/english-technical-c05-s01-lessons-07-10-draft.md` (document revisions and configuration control; shift handover and technical correspondence; teamwork across engineering specialisms; interpreting drawings, tables and trend charts). The package includes four full lessons, five original listening scripts including an integrated checkpoint, vocabulary, reading, language focus, four-specialism tasks, self-checks, keys and a semester checkpoint. All examples and chart values are fictional classroom data; no operational aircraft instructions or real acceptance criteria are provided.

- Course 5, semester 1 lessons 11–12 are drafted in `docs/english-technical-c05-s01-lessons-11-12-draft.md` (risk assessment and safety reporting; integrated technical briefing from task to report). This closes the 12-topic semester draft map: existing lessons 1–2 plus new draft lessons 3–12. The file includes two full lessons, original listening scripts, four-specialism tasks, keys, an integrated semester checkpoint and a 20-point rubric. Risk cases are fictional and do not provide real risk ratings or safety instructions; the pack remains subject to syllabus/textbook/teaching-hours review.


## Browser-read listening

Lesson listening uses browser text-to-speech by default, matching the approach already present in the English VPR exam. The reusable `english-listening-tts.js` helper is loaded from `index.html` and exposes `window.EnglishListeningTTS.render(container, {text, lang, repeatCount, rate})`. It provides play/pause/resume/stop, replay, playback rate and available English voice selection. The helper does not contain transcripts or answer keys. Lesson renderers must keep transcript reveal separate and follow the practice-mode/exam-mode rules in `docs/english-listening-lesson-standard-v1.md`.

This is a runtime helper only. It does not automatically convert Markdown drafts into portal lessons; the lesson content schema and renderer integration remain a separate step. The working Basic and Technical VPR exams and their server-side banks are not modified.


- Course 5, semester 2 lessons 1–4 (technical presentations; structured technical reports; professional interview/oral examination; specifications, procedures and standards) are drafted in `docs/english-technical-c05-s02-lessons-01-04-draft.md`. The package contains browser-readable listening scripts, comprehension tasks, transcript-reveal guidance, teacher keys and a semester checkpoint. It is connected to the ENT runtime as draft content and is not yet formally approved.
- Course 5, semester 2 lessons 5–8 (manufacturing process review; CNC revision communication; electrical case discussion; software test reports) are drafted in `docs/english-technical-c05-s02-lessons-05-08-draft.md`. The package contains four browser-readable listening scripts, comprehension tasks, transcript-reveal guidance, teacher keys and an integrated checkpoint. It remains a draft and is not imported into the portal.
- Course 5, semester 2 lessons 9–12 are drafted in `docs/english-technical-c05-s02-lessons-09-12-draft.md`: aircraft component materials and inspection records; maintenance planning and reliability; integrated multi-speaker handover listening; and an evidence-based capstone presentation/report. The pack closes the 12-lesson draft semester and includes browser-readable scripts, comprehension tasks, transcript-reveal guidance, teacher keys and a 20-point formative rubric. All identifiers and datasets are fictional. It is connected to the ENT runtime as draft content and remains subject to syllabus/textbook/teaching-hours review.


## Browser listening lesson component

- `english-listening-lesson.js` is loaded after `english-listening-tts.js` in `index.html`. It provides `window.EnglishListeningLesson.render(container, options)` for a listening activity with browser speech, comprehension questions and transcript reveal.
- Practice mode checks lesson-level practice keys and reveals the transcript after answers are submitted.
- Assessment mode rejects client-side answer keys, submits selected indices through an optional host callback and keeps the transcript hidden until the host calls `closeAssessment()` after formal closure. Server-side grading and attempt persistence remain the host assessment engine's responsibility.
- Integration contract and usage example: `docs/english-listening-lesson-integration-v1.md`.
- Current boundary: the 75 new draft lectures are converted to runtime lecture records and the topic-page renderer mounts the matching practice listening activity by explicit `listeningId`. The listening component remains practice-only; it does not submit grades or create protected exam attempts. The existing VPR engine/banks are untouched.


## Browser listening lab — playable practice catalogue

- Added `english-listening-catalog.js` with four practice activities for Course 5, Semester 2, lessons 9–12.
- Added `english-listening-route.js` and the `#/english-listening` route.
- Added an **Аудирование** quick-access link in `english-tools.js`, shown when EN, ENB or ENT is the active course.
- The catalogue invokes `EnglishListeningLesson.render` in practice mode, so browser speech, questions, feedback and transcript reveal are available on that page.
- The four scripts are embedded as text and read by the browser; no MP3 files are required for these exercises.
- Scope: only lessons 9–12 in Course 5 Semester 2 are currently playable in this catalogue. Lessons 1–8 and the other semesters still need structured conversion.
- Practice keys are client-side and must not be reused for protected graded assessment. The catalogue does not save attempts, award grades or touch the existing VPR engine.


### Listening catalogue coverage update

The browser practice catalogue now contains eight activities for Course 5, Semester 2, lessons 5–12. It covers manufacturing process review, CNC revision communication, an electrical training case, software test reporting, materials records, reliability trends, integrated handover and the capstone review. Lessons 1–4 of this semester and all other semesters still need conversion into playable lesson records. All catalogue activities are practice-only; client-side keys are not suitable for protected assessment.


### Course 5 Semester 2 — browser audio coverage completed

All twelve lessons in the semester now have a playable browser-listening activity in `english-listening-catalog.js`. The catalogue is accessible from the English quick-access block through `#/english-listening`. It includes lesson scripts, comprehension questions and practice feedback/transcript reveal. Only this semester is fully represented in the catalogue; other semesters still need conversion. The catalogue is practice-only and does not submit or grade exam attempts.


### Course 5 listening coverage — both semesters

The browser listening catalogue now contains all 24 activities for Course 5: 12 activities in Semester 1 and 12 in Semester 2. The page groups activities by semester. Semester 1 lessons 1–2 draw on existing Technical English source lessons (materials and metal processes; technical drawing/CAD/CAM), and lessons 3–12 use the developed course drafts. Semester 2 lessons 1–12 are also represented. This is a practice catalogue, not a protected assessment: practice answer keys are client-side and no grades or attempts are saved. Other semesters remain to be converted.


### Listening catalogue expansion — Course 4

The browser practice catalogue now includes Course 4, Semester 2, lessons 9–12 in addition to all 24 activities for Course 5. The page groups activities by course and semester. Current coverage is 28 activities across three blocks: Course 4 Semester 2 (lessons 9–12), Course 5 Semester 1 (lessons 1–12) and Course 5 Semester 2 (lessons 1–12). Course 4 Semester 2 lessons 1–8 and the remaining course-semester blocks still require conversion. All catalogue activities remain practice-only.


### Course 4, Semester 2 listening completed

All twelve lessons in Course 4, Semester 2 now have browser-listening practice activities. Lessons 1–8 preserve the existing source sequence on communication, networks, computers, internet, automation, sensors and input devices; lessons 9–12 cover avionics, algorithms, sensor data and cybersecurity. The catalogue contains 36 activities across Course 4 Semester 2 and both semesters of Course 5. It remains a practice-only feature, not a protected assessment.


### Browser listening coverage — 40 activities

The practice catalogue now contains 40 activities: Course 4 Semester 1 lessons 1–4, Course 4 Semester 2 lessons 1–12, and both semesters of Course 5 (12 lessons each). The first four Course 4 Semester 1 activities cover electrical materials, current and units, circuit components, and series/parallel circuits. Course 4 Semester 1 lessons 5–12 and Courses 1–3 remain to be converted. All activities remain practice-only and do not affect grades or protected exam banks.


### Course 4, Semester 1 listening completed

All twelve lessons for Course 4, Semester 1 now have browser-listening activities. The first nine preserve the source topics in the five-year map; lessons 10–12 extend them to aviation electrical power, wiring-diagram language and evidence-based fault descriptions. Combined with Course 4 Semester 2 and both Course 5 semesters, the catalogue now contains 48 activities across four semester blocks. The catalogue remains practice-only, not a protected assessment.


### Verified catalogue coverage — 48 activities

The latest catalogue read-back confirms 48 unique activities across four complete semester blocks: Course 4 Semester 1 (12), Course 4 Semester 2 (12), Course 5 Semester 1 (12), and Course 5 Semester 2 (12). All 48 have scripts, questions and matching practice feedback. Courses 1–3 still need conversion. The catalogue remains practice-only; it does not save marks or attempts and must not be used as a protected assessment bank.


### Verified browser listening coverage — 72 activities

The latest catalogue includes 72 unique activities: Course 3 (12 + 12), Course 4 (12 + 12), Course 5 (12 + 12). Course 3 Semester 1 follows the five existing Materials/Metal Processes/Technical Drawing/CAD-CAM lessons and adds seven aviation-focused lessons. Course 3 Semester 2 follows the existing machine-tool/CNC/safety topics and adds seven detailed CNC, measurement and communication lessons. Courses 1–2 remain outstanding. The listening catalogue is practice-only and does not write grades or create protected exam attempts. Direct embedding into every lesson and browser/device playback verification remain outstanding.


### Verified browser listening coverage — 96 activities

The catalogue now includes 96 unique activities: Course 2 (12 + 12), Course 3 (12 + 12), Course 4 (12 + 12), and Course 5 (12 + 12). Course 2 listening uses accessible B1–B1+ language and follows the approved project map: social and professional communication in Semester 1; science, environment and argumentation in Semester 2. Course 1 remains to be converted. All catalogue items are practice-only and do not create exam attempts or gradebook entries. Direct lesson embedding and browser/device playback checks remain outstanding.


### Verified five-year browser listening coverage — 120 activities

The listening catalogue now contains 120 unique activities across all five courses and ten semesters (12 per semester). Course 1 is A1–A2, Course 2 B1–B1+, and Courses 3–5 are Technical English/ESP at B1+–B2 with aviation and four professional pathways represented. Each activity includes a browser-readable script and comprehension questions. This completes the catalogue coverage only; direct embedding in each of the 120 lecture pages and real-browser/device verification remain outstanding. The catalogue is practice-only and does not write grades or protected assessment attempts.


### Inline listening integration status

The topic-page renderer now mounts matching listening practice inside lecture accordions. The five-year runtime preserves the 45 existing lecture objects and adds 75 new draft lecture records (48 Basic + 72 Technical total). Every new lecture has an explicit listening ID; all 75 IDs resolve in the 120-entry catalogue. Browser speech uses Speech Synthesis. Runtime and listening files are precached by `portal-cache-v355`; the runtime URL is cache-busted to `v=2`. Automated regression coverage was added, but GitHub Actions has not yet returned a run for the current PR head, so real-browser playback/layout verification remains pending.


## Current verified implementation status — 2026-11-13

- Runtime simulation from the repository sources preserves the original 45 lectures and produces 120 total lecture records: 48 Basic and 72 Technical.
- All 75 IDs in the five-year map are present exactly once in the runtime, and each resolves to a listening activity in the 120-entry catalogue.
- The 75 new lectures are grouped into course/semester sections. Browser listening is embedded in each lecture through the existing topic renderer and Speech Synthesis component.
- A regression test was added at `scripts/english-five-year-runtime.test.mjs`; the CI workflow now syntax-checks the runtime/listening modules and runs that test.
- The Service Worker precaches the runtime and listening modules and uses `portal-cache-v355`; the runtime script URL uses `v=2`.
- This is runtime integration of draft materials, not formal curriculum approval or deployment verification. PR #125 remains open and Draft; no GitHub Actions run or status check has yet been returned for its current head.
- Semester assessment is a separate outstanding task. The existing `english-assessment-data.js` is not loaded by `index.html`; its legacy Basic tests have 20 questions each, while Technical is currently cloned from Basic. The seed helper does not supply the `correct` indices required by server validation. Do not expose/import this client-side seed as a protected graded bank until the assessment content and server-only answer-key path are corrected.


## Semester-assessment security gate — 2026-11-13

A focused review found that the legacy `english-assessment-data.js` is intentionally **not loaded** by `index.html`. It contains ten Basic tests with 20 questions each, but all 200 questions lack `correct` answer indices. Its Technical set is a direct clone of Basic. The teacher import button is therefore not rendered; importing this file would either fail server validation or, if keys were guessed, create a misleading Technical assessment.

The server validator has been strengthened before the content is rebuilt:
- exactly ten tests in the expected year/semester order;
- track-specific unique test IDs;
- exactly 20 questions per test;
- no duplicate question text or empty/duplicate options;
- every correct-answer index must be an integer within the option range;
- Basic and Technical imports are compared with the other active bank; an exact clone is rejected server-side;
- student-facing sanitization uses a strict question whitelist (`q`, `options`), so answer keys, explanations and any unexpected hidden metadata cannot reach students.

Regression tests cover valid banks, missing keys, duplicate IDs/questions/options, wrong semester order, track mismatch, removal of answer-key fields, and exact Basic/Technical clone detection. A separate guard asserts that the unreviewed legacy seed remains out of the production page while Basic/Technical are still cloned. The bank is **not ready for import**; do not publish it or claim that the 20 works are available to students until new Basic and genuinely distinct Technical questions have been authored, keyed, reviewed, imported and read back from the protected sheet.

### Current assessment authoring batch (2026-11-13)

- Added `docs/english-technical-semester-bank-draft-v1.md`: first 20 independently authored Technical English multiple-choice items, with a separate teacher key, rationales and review checklist.
- This is an authoring draft only. It is not loaded by `index.html`, not imported to Sheets and not available to students.
- The draft's Course 3 / Semester 1 placement is provisional pending the approved curriculum map. A second teacher must verify the technical terminology and all answer keys before conversion to the protected server bank.
- Progress for the provisional two-track / ten-set target: 20 of 200 Technical items drafted; Basic legacy items remain unkeyed and the old Technical clone remains blocked.
- Added `docs/english-technical-semester-bank-draft-v2.md`: second independent batch of 20 Technical English questions (electrical engineering, electronics, CAD, technical data, maintenance and documentation), with a separate teacher key and review checklist. Combined Technical draft pool: 40 items. Still review-only and not connected to the portal.
- Added `docs/english-technical-semester-bank-draft-v3.md`: third independent batch of 20 Technical English questions (sensors, feedback control, programming logic, CNC terminology, troubleshooting, avionics and traceability), with teacher key, rationales and review checklist. Combined Technical draft pool: 60 items. This is still review-only and is not connected to the portal.

- Added `docs/english-technical-semester-bank-draft-v4.md`: fourth independent batch of 20 Technical English questions (maintenance records, electrical isolation vocabulary, document revision, safety language, PLC inputs, BOM, transducers, quality non-conformance and traceability). Combined Technical draft pool: 80 items. The file includes a separate teacher key, rationales and a review checklist. It remains review-only; no import or student release is authorized.

- Added `docs/english-technical-semester-bank-draft-v5.md`: fifth independent batch of 20 Technical English questions (maintenance downtime, drawing notes, software updates, process language, graph interpretation, root-cause analysis, programming logic, fault tolerance and change records). Combined Technical draft pool: 100 items. Includes a separate teacher key, rationales and review checklist. Review-only; not imported or student-facing.
