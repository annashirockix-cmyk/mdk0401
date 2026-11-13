# English courses and assessment architecture

Status: design specification only. This document does not change the current portal runtime, Google Sheets, Apps Script deployment, or the working Basic/Technical VPR exams.

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
- The 75 planned lectures are not yet authored or imported. All 12 first-semester Basic English lesson drafts are in three files: `docs/english-basic-c01-s01-lessons-01-03-draft.md` contains lessons l04–l06; `docs/english-basic-c01-s01-lessons-04-06-draft.md` contains l07–l09; `docs/english-basic-c01-s01-lessons-07-09-draft.md` contains l10–l12. The filename ranges reflect drafting batches, while the lesson IDs are authoritative. The first three new semester-two lessons (l04–l06) are in `docs/english-basic-c01-s02-lessons-04-06-draft.md`. Course 2, semester 1 lessons l04–l06, l07–l09 and l10–l12 are in `docs/english-basic-c02-s01-lessons-04-06-draft.md`, `docs/english-basic-c02-s01-lessons-07-09-draft.md` and `docs/english-basic-c02-s01-lessons-10-12-draft.md` respectively. The first three new lessons for Course 1, semester 2 (l04–l06) are in `docs/english-basic-c01-s02-lessons-04-06-draft.md`. All drafts require review against the Belova textbook and approved work programme. All drafts require review against the Belova textbook and the approved work programme. The map and drafts do not change runtime or the current VPR exams.

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
- Course 2, semester 2 new lessons 8–12 are drafted in `docs/english-basic-c02-s02-lessons-08-12-draft.md` (passive voice; coherent paragraphs; climate/resources; science and technology; opinion essay and presentation). These are draft teaching materials, not yet imported into the portal.

- Course 3, semester 1 lessons 6–8 (aviation industry, aircraft structure and materials) are drafted in `docs/english-technical-c03-s01-lessons-06-08-draft.md`. The existing Technical 1.1–1.3 and 2.1–2.2 lessons remain unchanged.
- Course 3, semester 1 lessons 9–12 are drafted in `docs/english-technical-c03-s01-lessons-09-12-draft.md` (manufacturing workflow and process sheets; dimensions and measurement; technical word formation and abbreviations; technical descriptions and specification tables). All examples and numerical values are explicitly classroom-only.

- Course 3, semester 2 lessons 6–8 are drafted in `docs/english-technical-c03-s02-lessons-06-08-draft.md` (CNC machine components; axes and coordinates; introductory G-code text reading). The G-code sample is comments-only and explicitly read-only, not executable.

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
