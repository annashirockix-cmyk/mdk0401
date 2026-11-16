# English final-exam blueprint matrix v1

**Status:** authoring specification; provisional until checked against the approved English work programmes, actual semester hours and the exact Belova textbook edition. This file is not an imported question bank and does not authorize student access.

## Purpose and scope

The target remains 10 course/semester slots × 15 variants = 150 variants. Courses 1–2 use Basic English; Courses 3–5 use Technical English. Each slot has its own blueprint so a random variant cannot drift into another course's level or professional content.

The blueprint matrix is deliberately separate from the existing 2026 Basic/Technical VPR and from the 10 semester controls. Do not copy a VPR paper and relabel it as a final exam.

## Provisional slot blueprints

| Slot | Track / level target | Core language and communication | Reading, listening and applied context |
|---|---|---|---|
| C1-S1 | Basic · A1–A2 | Personal information, classroom instructions, pronouns, be/have, Present Simple, questions, articles, plural nouns, time and dates | Short college dialogues, student profiles, timetables, forms and simple notices |
| C1-S2 | Basic · A2 | College and town vocabulary, directions, services, Present Continuous, Past Simple, countable/uncountable nouns, polite requests | Directions dialogue, college facilities, everyday service situations, short notes and informal messages |
| C2-S1 | Basic · A2–B1 | Future forms, comparatives, modal verbs, work and study vocabulary, CV language, requests and clarification | Career choices, education, transport and travel; listening for purpose and key details; short practical email |
| C2-S2 | Basic · B1 | Wider tense control, conditionals, passive voice, reported information, linking devices, expressing opinions and supporting reasons | Science, ecology, digital literacy and social issues; compare sources, identify claims, write a structured opinion |
| C3-S1 | Technical · A2–B1 | Materials, properties, dimensions, technical drawing, instructions, units, descriptions and basic technical email | Aviation-industry overview, workshop orientation, materials and component records, technical notices and short briefings |
| C3-S2 | Technical · B1 | Machine tools, machining operations, CNC vocabulary, sequence and condition, imperatives, safety language and quality terminology | CNC/workpiece/tooling texts, machine setup dialogue, safety procedure comprehension and non-operational process descriptions |
| C4-S1 | Technical · B1 | Electricity, circuits, energy, electronics, cause/effect, comparison, measurement and fault description | Circuit diagrams and component descriptions, energy systems, measurement records and troubleshooting conversations |
| C4-S2 | Technical · B1–B2 | Communication systems, computers, automation, PLCs, data, software instructions, passive constructions and technical reporting | Control systems, sensor/actuator texts, digital records, system descriptions, maintenance messages and interpreting tables |
| C5-S1 | Technical · B1–B2 | Maintenance, inspection, diagnostics, fault reports, technical documentation, revision control and cautious conclusions | Aviation maintenance scenarios, inspection records, non-routine findings, maintenance planning and evidence-based reporting |
| C5-S2 | Technical · B2 target | Integrated technical vocabulary, precise instructions, formal correspondence, summarising, risk language, quality and professional interaction | Integrated aviation/manufacturing/electrical/CNC scenarios, handover briefings, technical reports and multi-source reading/listening |

The level labels are targets for authoring and must be calibrated against actual contact hours and student entry levels. They are not claims of formal CEFR certification.

## Recommended assessment mix

Use a consistent family of task types supported by the portal's current renderer and server grader:

- single-choice: one correct option;
- multiple-choice: more than one correct option;
- ordering: arrange steps or events;
- short-text: exact accepted variants, including legitimate spelling/punctuation variants;
- written: a response assessed by a teacher against a private rubric.

A balanced paper should sample listening, reading, vocabulary in context, grammar in context, functional/professional communication and writing. Listening must use a complete script attached to the task and browser speech synthesis; do not require an external audio file or network request during an offline lesson.

For Technical English, use authentic-feeling but self-contained contexts from aviation, materials, technical drawing, machine tools/CNC, electrical systems, electronics, automation, maintenance, inspection and safety. Assess English comprehension and communication, not specialist calculations or unapproved operating instructions.

## Editorial pass — first variants in eight slots (2026-11-16)

The first variant in C2-S1, C2-S2, C3-S1, C3-S2, C4-S1, C4-S2, C5-S1 and C5-S2 was revised after a sample review found distractors unrelated to the question category (for example, a place or a date offered as an answer to a question about a document or duration). The affected listening and reading choices were replaced with plausible same-category alternatives. In C2-S1 Listening 2, the prompt was also narrowed to ask for both preparation requirements, because the source passage names both a short CV and two questions about training.

A regression test checks these eight first variants for the identified generic distractor patterns. A second pass also corrected Listening/Reading distractors in V02 for C2-S2, C3-S2, C4-S2 and C5-S2. The combined pilot registry was synchronised with all 48 corrected task records, and a consistency check found no difference between those individual pilot files and the registry. This is a targeted correction, not evidence that all 150 variants have received full editorial approval. The remaining variants still require a complete content review, including answer validity, distractor plausibility, level, semantic repetition and alignment with the approved curriculum.

## Variant authoring rules

1. Each slot has 15 variants with globally unique IDs: EN_C0n_Sn_V01 through V15.
2. Every variant must contain its own complete task array. Empty placeholders, repeated copies with only changed IDs, and variants that differ only by answer order are not acceptable as separate authored forms.
3. No duplicate task IDs or duplicate substantive prompts inside one variant.
4. Do not repeat a reading passage or listening script inside the same variant. Across the 15 forms, rotate source passages and contexts rather than changing only names.
5. Every objective task has a single unambiguous key. Distractors must be grammatically and contextually plausible but not defensibly correct.
6. Multiple-choice keys must contain unique valid option indices. Ordering keys must contain every option exactly once.
7. Short-text tasks must list all accepted equivalent answers. Do not rely on one exact string where spelling variants are legitimate.
8. Every written task has a teacher-only rubric with explicit criteria and a point ceiling. Rubric text must never reach the student payload.
9. Option positions should be balanced across each variant and across the 15-variant slot. Never change the correct answer while shuffling options.
10. Keep teacher keys, accepted answers, written rubrics and rationales server-side. Student responses contain task prompts and choices only.
11. Compare new items with existing lectures, semester banks, VPR tasks and all earlier final-exam forms. A different ID does not make a duplicate item new.
12. Run both structural checks and a human subject/editorial review before importing any batch.

## Release gates

- [ ] Approved course/semester curriculum and hours checked.
- [ ] Exact Belova textbook edition checked for Basic English scope.
- [ ] 15 fully authored variants exist for each of the 10 slots.
- [ ] All 150 variants pass schema, scoring, duplicate and answer-key checks.
- [ ] Technical subject-matter review completed.
- [ ] Listening scripts and speech-synthesis behaviour tested offline.
- [ ] Teacher keys/rubrics verified to remain server-side.
- [ ] Import tested in a non-production spreadsheet.
- [ ] Student and teacher end-to-end attempts tested before publication.

## Current implementation boundary

The authoring package now contains **150 pilot variants across all ten course-semester slots** (15 per slot), with 10 tasks, 20 points and a 90-minute limit per variant. Each variant includes two listening questions, reading comprehension, objective language tasks, ordering and one written response with a teacher-only rubric.

Automated checks cover the combined 150-variant registry, all 1,500 task IDs and prompts, payload schema, answer-key validity, score totals, balanced objective answer positions and the requirement that every variant remain marked `pilot_for_editorial_review`. The package is structurally complete; this does not certify subject accuracy, CEFR level, curriculum alignment or formal assessment suitability.

The server validates each payload before import, and deliberately rejects pilot status. The package remains outside the protected Google Sheets bank and is not student-visible. Subject-matter/editorial review, formal approval, controlled administrator import and post-import acceptance testing are still required. Existing VPR and semester banks remain untouched.

## Authored pilot progress — all ten slots drafted

The planned final-exam set is complete at the content-authoring stage: **150 variants across 10 course/semester slots** (15 variants per slot). Each variant contains 10 tasks, a 20-point maximum, a 90-minute limit, two browser-readable listening tasks and one teacher-reviewed written response. Regression tests validate the payload against the server validator, enforce unique task IDs and prompts, check unique listening scripts, balance objective answer positions A/B/C/D (two of each per variant), and verify selected multi-select and functional-response keys.

| Slot | Track | Status | Coverage |
|---|---|---:|---|
| C1-S1 | Basic English | 15/15 | College routines, campus, classroom and introductory workshop communication |
| C1-S2 | Basic English | 15/15 | Directions, transport, town services, events, weather, food, digital communication and everyday plans |
| C2-S1 | Basic English | 15/15 | Career preparation, CVs, interviews, study choices, teamwork and workplace communication |
| C2-S2 | Basic English | 15/15 | Environment, digital literacy, energy, transport, research and volunteering |
| C3-S1 | Technical English | 15/15 | Materials, dimensions, drawings, components, tolerances, inspection and measurement |
| C3-S2 | Technical English | 15/15 | CNC, machining, tools, workholding, process planning, quality and production |
| C4-S1 | Technical English | 15/15 | Electrical and electronic systems, measurement, sensors, relays, fault reporting and documentation |
| C4-S2 | Technical English | 15/15 | Computer and communication systems, automation, PLCs, industrial networks, IoT and aviation ground support |
| C5-S1 | Technical English | 15/15 | Maintenance planning, inspection, diagnostics, controlled technical publications, traceability and airworthiness |
| C5-S2 | Technical English | 15/15 | Maintenance handover, risk, fault analysis, document control, quality audits and integrated reporting |

**Editorial/release status:** these are pilot materials, not approved assessment instruments. No pilot has been imported into the protected Google Sheet or released to students. Subject-matter review, formal editorial approval, controlled import and a post-import acceptance run are still outstanding.


## Editorial sample review — V02 distractor quality (2026-11-16)

A further sample review opened the actual JSON for V02 in all ten course-semester slots. Listening scripts, task IDs and answer-key fields were present in the inspected files. The multiple-choice tasks in several files still contain distractors that are too obviously unrelated to the assessed concept, so the presence of four options and a valid key must not be treated as evidence of assessment quality.

Examples requiring revision:
- C3-S1 V02 asks which details should be checked on a technical drawing, but two distractors concern a paper-clip colour and an unrelated website.
- C3-S2 V02 asks about CNC command meanings, but one distractor describes G01 as a material grade rather than testing a plausible command/address misconception.
- C4-S1 V02 asks about an electrical measurement record, but two distractors concern an instrument-case colour and an unrelated appointment time.

The C1 and C2 V02 samples reviewed had more relevant distractors in their multiple-choice tasks; this is a sample observation, not blanket approval of those variants. The remaining V02 samples also require review of the complete task set, including grammar, short-text accepted answers, ordering keys, listening comprehension and written rubrics.

**Action required before release:** revise weak distractors so they test realistic misconceptions within the same semantic category; then recheck the correct-index arrays after editing. Do not import or publish the affected variants until this editorial pass and the wider 150-variant review are complete. No pilot JSON or protected bank was changed in this audit step.


## Editorial sample review — V03 option plausibility and key-position pattern (2026-11-16)

The ten V03 pilot JSON files (one per course-semester slot) were inspected. All ten contain ten tasks and the expected task families, but the review found a repeated distractor-quality issue:

- Several listening items use generic location/time distractors that do not answer the question type (for example, a question asking when an event starts offers locations such as a college library, town centre or bus station).
- Several reading-comprehension items use generic distractors unrelated to the passage or question (for example, a question about why a technical procedure is needed offers “borrow a laptop”, “meet a relative” and “buy a ticket”).
- This is visible in multiple slots, including C2-S1, C2-S2 and several Technical English slots. Such distractors do not test comprehension and make elimination trivial.
- In the ten inspected V03 files, the first listening item has its keyed answer at option index 0 and the second listening item at index 1 in every slot. This is not evidence of incorrect keys, but it is a repeated positional pattern that can become predictable across a large bank.

**Required editorial correction:** rewrite distractors to be plausible answers of the same semantic type as the stem (times against times, locations against locations, documents against documents, technical functions against technical functions). Then redistribute correct options across positions without changing the intended answer. Run automated checks for answer-position balance per variant and across the full pool, and manually verify each key after shuffling.

The V03 pilot JSON files were not edited in this review step. They remain pilot_for_editorial_review; do not import or publish until the distractors and key-position patterns are corrected and rechecked. This finding is a sample-based editorial audit, not approval or rejection of every task in each file.
