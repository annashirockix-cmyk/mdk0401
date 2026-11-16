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


## Editorial sample review — V04 fixed answer-position template (2026-11-16)

The ten V04 pilot JSON files were inspected. A stronger positional pattern appears across all ten course-semester slots:

- Listening item 1: correct answer at option index 0.
- Listening item 2: correct answer at option index 1.
- Reading item 1: correct answer at option index 2.
- Reading item 2: correct answer at option index 3.
- The grammar single-choice item: correct answer at option index 0.
- The functional-language single-choice item: correct answer at option index 1.

This repeated six-position sequence across all ten variants is a serious answer-position leakage risk. A candidate who notices the template can gain marks without demonstrating the assessed skill. It also confirms that answer-position balancing must be checked across complete variants, not only within isolated items.

V04 also repeats the distractor defects recorded for V03: several listening and reading items contain options from the wrong semantic category (for example, time questions with location options, or technical comprehension questions with generic unrelated options). This is especially clear in C2-S1 through C5-S2.

**Required correction before any pilot can be considered release-ready:** break the fixed positional sequence by reordering options independently per item; update every corresponding correctIndex/correctIndices field; validate the resulting key against the item content; and run a bank-wide distribution check. Distractors must be rewritten as plausible same-category alternatives. Do not merely rotate the same answer sequence between variants.

The V04 JSON files were not modified. Their status remains pilot_for_editorial_review, and they must not be imported or published before correction and independent key verification.


## Editorial sample review — V05/V06 repeated answer template and distractors (2026-11-16)

The V05 and V06 JSON files were inspected across all ten course-semester slots (20 variants total). Both batches reproduce the same answer-position sequence in every slot for the first eight objective tasks:

- Listening 1: index 0.
- Listening 2: index 1.
- Reading 1: index 2.
- Reading 2: index 3.
- Grammar single-choice: index 0.
- Multiple-choice: indices 2 and 3.
- Short-text: no option index.
- Functional-language single-choice: index 1.

Thus, the fixed V04 pattern is not isolated: it persists unchanged in all 10 V05 files and all 10 V06 files. In V05, the answer choices themselves are also repeatedly arranged so the correct options occupy those same positions. This is a cross-slot leakage risk and a sign that these forms are not independent variants in their current form.

The V05 sample also contains recurring wrong-category distractors in listening and reading, especially in later Basic and Technical slots. Examples include location options in questions asking for a time or a document, and unrelated activities such as borrowing a laptop or buying a ticket in technical comprehension questions. These options are not plausible same-category alternatives.

**Required action:** treat V04–V06 as a bank-wide authoring defect, not three isolated variants. Before release, independently author/revise each task's distractors, shuffle each task's options using a stable key-remapping routine, and validate single-choice, multiple-choice and ordering keys against the resulting option arrays. A mere rotation of the same template is insufficient. Add regression tests that reject identical positional signatures repeated across all ten slots and check distributions at both variant and bank level.

The V05/V06 pilot JSON files were not changed. All remain pilot materials; no import or student release is authorised by this audit.


## V07 representative cross-course audit (2026-11-16)

Five V07 files were inspected across representative slots: C1-S1, C2-S2, C3-S1, C4-S2 and C5-S1. All five contain 10 tasks and repeat the same first-eight positional key signature seen in V04–V06: 0, 1, 2, 3, 0, [2,3], short-text, 1. The examples cover Basic English, scientific literacy, dimensional tolerances, software version control and maintenance shift handover.

The sample confirms that the fixed answer-position template extends into V07 and across both general-English and technical-professional content. The listening and reading distractor sets also continue to contain wrong-category options. Examples:
- C2-S2 Listening 1 asks when a demonstration takes place, but three of four choices are locations or unrelated time phrases.
- C3-S1 Reading 1 asks what permitted dimensional variation describes, but three choices are unrelated actions.
- C4-S2 Listening 2 asks which equipment information record is required, but three choices are generic dates/locations.
- C5-S1 Reading 1 asks what a shift handover should identify, but three choices are unrelated actions.

This five-file sample is not a full V07–V15 audit and does not establish the status of every remaining variant. It is sufficient, however, to show that the same authoring pattern is still present in V07. Continue with a complete file-by-file audit before release; do not infer that later variants are clean or defective without inspection.

No pilot JSON was changed. The findings are editorial only; no protected bank, import, Apps Script, or deployment was touched.


## V08 representative cross-course audit (2026-11-16)

Five V08 files were inspected across the five course levels/slots: C1-S2, C2-S1, C3-S2, C4-S1 and C5-S2. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1. This extends the observed fixed answer-position pattern through the inspected V08 sample.

Ordering tasks were checked separately from positional keys. In all five inspected files, each ordering task has four unique options, four unique correctOrder entries, and the correctOrder is an exact permutation of the options. The calculated correct-order option indices are [3,2,1,0] for C1-S2 and [1,3,0,2] for C2-S1, C3-S2, C4-S1 and C5-S2. No ordering-key mismatch was found in this sample.

Short-text answer validation found one concrete defect in C3-S2 V08: the prompt is “A failure to meet a specified requirement is a non-___.” Its accepted answers are conformity and non-conformity. The latter would produce the duplicated phrase “non-non-conformity” when inserted into the blank and should be removed; conformity is the appropriate accepted completion. This is a confirmed content-level answer-validation defect.

Listening audio text and keyed options were checked in all five files. The correct options matched the audio text in the inspected items. However, weak wrong-category distractors remain in four of the five files. For example, C2-S1 Listening 2 asks what students should download, while three distractors are dates/locations; C4-S1 Listening 2 asks which documents to bring, while three distractors are generic time phrases. C1-S2 has more plausible distractors in the inspected listening items.

This is a representative five-file sample, not a complete V08 audit or an audit of V09–V15. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## V09 representative cross-course audit (2026-11-16)

Five V09 files were inspected across C1-S1, C2-S2, C3-S1, C4-S2 and C5-S1. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1. The repeated answer-position template therefore remains present in the inspected V09 sample.

The keyed answers in the ten inspected listening items were checked against their embedded audioText. The correct options match the audio in this sample. Ordering tasks in all five files were checked: the correctOrder values form the expected four-step sequences using the task's options; no missing or foreign ordering elements were found.

Two short-text answer-set defects were identified:
- C2-S2: the prompt ends “is a digital ___.” acceptedAnswers contains both “footprint” and “digital footprint”. Inserting the latter creates “digital digital footprint”; remove the redundant prefixed form.
- C4-S2: the prompt ends “is a data ___.” acceptedAnswers contains both “log” and “data log”. Inserting the latter creates “data data log”; remove the redundant prefixed form.

C3-S1 accepts “non-conformity”, “nonconformity” and “defect” for “A result that does not meet a specified requirement is a ___.” The first two are spelling variants; “defect” is related but not always interchangeable with the broader quality-system term “non-conformity”. Review whether the intended construct permits this broader synonym; do not silently treat the terms as universally equivalent.

Weak wrong-category distractors remain in four of the five inspected files. Examples include location choices for questions asking what students should review or bring, and generic date phrases for questions asking for a document or an item. C1-S1's inspected listening choices are comparatively plausible and category-matched.

Written tasks in the sample include 60–100-word prompts and explicit 8-point rubrics. This sample review did not independently validate every rubric against a CEFR level or course learning outcome; that requires a separate alignment review.

This is a representative five-file sample, not a complete V09 audit or an audit of V10–V15. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## V10 representative cross-course audit (2026-11-16)

Five V10 files were inspected across C1-S2, C2-S1, C3-S2, C4-S1 and C5-S2. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1. The repeated answer-position template therefore remains present in the inspected V10 sample.

The keyed answers in all ten inspected listening items match their embedded audioText. Ordering tasks in all five files were reviewed; each correctOrder contains the four expected steps and corresponds to the task options.

Weak wrong-category distractors remain in four of the five files. Examples include location choices for a question about a required reference chart, and generic dates/locations for questions asking about an item, document or group. C1-S2 has comparatively plausible, category-matched choices in the inspected listening and reading tasks. Some V10 reading questions in C2-S1, C3-S2, C4-S1 and C5-S2 also use unrelated activity distractors (for example borrowing a laptop or buying a ticket).

Short-text accepted answers were reviewed:
- C2-S1 accepts “passenger”, “traveller” and “traveler”; these are defensible lexical variants for the sentence.
- C3-S2 accepts “capacity” and “production capacity”; both can complete the sentence in context.
- C5-S2 accepts “dependency” and “dependent item”. The latter is not an exact synonym for the abstract noun “dependency”; review whether the intended definition is of a dependency or of a dependent item before retaining both.
- No obvious duplicated-prefix completion defect like those found in V09 was identified in this sample.

Written tasks in the sample include explicit 8-point rubrics and word limits from 60 to 120 words. This was a structural check only; rubric alignment to CEFR levels and specific course outcomes remains unverified.

This is a representative five-file sample, not a complete V10 audit or an audit of V11–V15. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## V11 representative cross-course audit (2026-11-16)

Five V11 files were inspected across C1-S1, C2-S2, C3-S1, C4-S2 and C5-S1. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1. The repeated answer-position template remains present in this V11 sample.

The ten inspected listening keys match their embedded audioText. Four ordering tasks (C2-S2, C3-S1, C4-S2 and C5-S1) were checked against the described processes and their options; their sequences are coherent. C1-S1 ordering task 9 has a substantive key error: its correctOrder starts “Write the report in your own words” before “Choose a suitable topic” and “Find and check reliable sources”. The correct sequence should be topic selection, source search/check, report writing, then source listing (with source listing integrated as the final documentation step). The current key is not a valid logical workflow.

A malformed prompt was identified in C4-S2 task 8: “Check the device register and What should you say?” The leading imperative appears to be accidental text and makes the question malformed. It should be rewritten as a complete, unambiguous scenario/question before use.

C1-S1 task 7 asks for “a list of ___” and accepts “sources”, “references” and “reference”. “Reference” singular is grammatically inconsistent with the plural count phrase “a list of” only if the intended blank denotes the listed items? The expected natural completion is “sources” or “references”; remove or justify the singular form to avoid accepting an awkward answer.

Weak wrong-category distractors remain in four of five inspected files, especially C2-S2, C3-S1 and C5-S1 reading tasks, where unrelated activity choices appear for questions about information or technical concepts. C1-S1 distractors in the inspected reading tasks are more plausible and category-matched.

Written tasks have explicit word limits and 8-point rubrics (60–120 words). This structural check does not establish CEFR or outcome alignment.

This is a representative five-file sample, not a complete V11 audit or an audit of V12–V15. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## V12 representative cross-course audit (2026-11-16)

Five V12 files were inspected across C1-S2, C2-S1, C3-S2, C4-S1 and C5-S2. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1. The same answer-position template remains present in this sample.

All ten inspected listening correct indices match the facts stated in their audioText, but two prompts are not aligned with the audio:
- C3-S2 task 2 asks which resource is needed “for the drawing-revision activity”; the audio describes a CNC programme review and mentions the controller glossary, not a drawing-revision activity.
- C4-S1 task 2 asks for a “maintenance note”; the audio says students should bring the circuit diagram from the previous lesson. The answer is inferable, but the prompt's document category is inaccurate.

Ordering tasks in all five files were reviewed against their options and the described processes; no incorrect sequence was identified in this sample.

C4-S1 task 7 defines “A device that opens or closes an electrical circuit under control” and accepts both “switch” and “relay”. A relay is a controlled switching device, but “switch” is broader and may be too general for the intended technical vocabulary target. Consider narrowing the definition to the relay concept or accepting a broader class intentionally.

Weak wrong-category distractors persist in four of five files, particularly in reading items where unrelated actions or locations are used as choices. C1-S2 has a more plausible set in the inspected reading questions.

Written tasks have explicit word limits and 8-point rubrics (60–120 words). As with prior samples, this checks structure only, not CEFR or learning-outcome alignment.

This is a representative five-file sample, not a complete V12 audit or an audit of V13–V15. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.
