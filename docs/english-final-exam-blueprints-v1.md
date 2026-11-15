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

Fifteen distinct pilot variants now exist for Course 1, Semester 1 (`v01`–`v15`). Each contains 10 tasks, two listening items, reading comprehension, objective language tasks, ordering and a teacher-reviewed writing task. Regression tests compare all prompts and listening scripts for exact repeats and require a balanced key distribution (two correct answer positions at A, B, C and D per variant). They are editorial pilots, not formally approved and not imported.

The server now validates the structure of each imported variant payload before writing it to EnglishExamVariantsBank. That validation prevents unsupported task types, missing answer keys, duplicate task IDs/prompts, invalid options, missing written rubrics, invalid duration and inconsistent maximum scores. It does not create the 150 variants or certify their academic quality. Until all release gates pass, the final-exam bank must remain unimported and the existing VPR/semester banks must remain untouched.

## Authored pilot progress — Course 1, Semester 1

Fifteen distinct Basic English pilot variants are now authored for C1-S1 (`v01`–`v15`). Each contains ten tasks (two listening, two reading, grammar, multiple choice, short text, functional communication, ordering and one written response), totals 20 points and has a 90-minute limit. Across the set, task prompts and listening scripts are distinct; objective answer positions are balanced A/B/C/D at two keyed positions each per variant. These are editorial-review pilots, not approved or imported exam forms. The remaining nine course/semester slots still need their own 15 variants each.

### Course 1, Semester 2 — pilot authoring underway

Fifteen distinct Basic English pilot variants are now drafted for C1-S2 (`v01`–`v15`). Topics include campus directions, student services, travel, town facilities, college events, weather, healthy choices, digital communication, shopping, invitations, volunteering, project exhibitions, library research, work placement and digital teamwork. Each has ten tasks, 20 points, 90 minutes, two browser-readable listening items and one written response. Regression tests validate all 15 against the protected payload schema, enforce unique prompts and listening scripts, and check balanced A/B/C/D answer positions. These remain editorial-review pilots, not imported or released.

C1-S2 is complete at 15 of 15 authored pilot variants. Across the slot, all 150 task prompts and 15 listening scripts are unique. Every variant has ten tasks, 20 points and a 90-minute limit; answer-key positions are balanced. The complete set remains marked for editorial review and has not been imported into the protected bank.

### Course 2, Semester 1 — pilot authoring underway

### Course 2, Semester 1 — complete pilot authoring

Fifteen Basic English pilots are now authored for C2-S1 (`v01`–`v15`). Topics progress from career fairs, CVs and interviews to skills portfolios, part-time work, teamwork, digital learning, environmental choices, customer service, study visits, study-life balance, everyday problem solving, course selection and workplace communication. Every variant has ten tasks, 20 points, 90 minutes, two listening items and one written response. Regression tests validate the full set against the protected payload validator, verify variant-specific task IDs, unique prompts and audio scripts, balanced A/B/C/D key positions and functional-response keys. Editorial review is still required; these variants are not imported or released.


### Course 2, Semester 2 — pilot authoring underway

Five Basic English pilot variants are drafted for C2-S2 (`v01`–`v05`). Topics include reducing plastic waste, evaluating online information, renewable energy, responsible technology use and community transport. Each form has ten tasks, 20 points, 90 minutes, two listening items and one written response. All five pass the protected payload validator; prompts and listening scripts are unique, answer positions are balanced and functional-response keys have been checked. Ten variants remain. These are editorial-review drafts, not imported or released.
