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

Five distinct pilot variants now exist for Course 1, Semester 1: `docs/english-final-exam-c01-s01-v01-pilot.json` through `docs/english-final-exam-c01-s01-v05-pilot.json`. Each contains 10 tasks, a listening script, reading comprehension, objective language tasks, ordering and a teacher-reviewed writing task. Regression tests compare their prompts and listening scripts for exact repeats. They are editorial pilots, not a complete 15-variant slot and not imported.

The server now validates the structure of each imported variant payload before writing it to EnglishExamVariantsBank. That validation prevents unsupported task types, missing answer keys, duplicate task IDs/prompts, invalid options, missing written rubrics, invalid duration and inconsistent maximum scores. It does not create the 150 variants or certify their academic quality. Until all release gates pass, the final-exam bank must remain unimported and the existing VPR/semester banks must remain untouched.
