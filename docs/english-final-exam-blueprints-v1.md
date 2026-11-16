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


## V13 representative cross-course audit (2026-11-16)

Five V13 files were inspected across C1-S1, C2-S2, C3-S1, C4-S2 and C5-S1. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1.

A critical listening key error was found in C1-S1 task 2. The audio says the bus leaves at 08:15 and asks students to arrive ten minutes earlier (08:05). The prompt asks when students should arrive, but the keyed option is “At eight fifteen exactly” (index 1). The correct answer is “At eight oh five” (index 3). This is a substantive answer-key error, not merely a weak distractor.

A logical ordering defect was found in C1-S1 task 9. Its correctOrder places “Listen to the safety briefing” before “Arrive at the college entrance”. Arrival should precede the safety briefing, followed by the guided observation and return to the bus. The sequence key therefore needs correction.

A malformed prompt was found in C4-S2 task 8: “Please check the measurement method What should you say?” The initial imperative is stray text and makes the question unclear.

A prompt/audio mismatch was found in C5-S1 task 2. It asks which “reliability-analysis summary” students should bring, while the audio calls it a “one-page status summary” and describes technical briefing assessment, not a reliability-analysis exercise. The keyed answer is present in the audio, but the prompt's topic label is inaccurate.

The other eight inspected listening answers match their audioText. Ordering tasks in C1-S2, C2-S2, C3-S1, C4-S2 and C5-S1 were reviewed; no additional sequence-key defect was found in those items.

Short-text answers reviewed include “batch/lot” for a group of material produced or processed together; both are acceptable in this context. Weak wrong-category distractors remain in four of five files, especially unrelated activities in reading comprehension choices. C1-S1 reading distractors are comparatively plausible.

Written tasks have explicit word limits and 8-point rubrics (60–120 words); CEFR and learning-outcome alignment remains unverified.

This is a representative five-file sample, not a complete V13 audit or an audit of V14–V15. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## V14 representative cross-course audit (2026-11-16)

Five V14 files were inspected across C1-S2, C2-S1, C3-S2, C4-S1 and C5-S2. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1.

All ten listening keys match the information in their audioText. The five ordering keys were checked and form coherent sequences; no answer-key error was identified in the reviewed ordering tasks.

A malformed/contaminated task stem was found in C1-S2 task 9. The prompt field contains a semicolon-separated list of action phrases (“Read the placement information; Plan the journey; Meet the workplace supervisor; Follow the first-day instructions”) rather than a clear instruction such as “Put the stages of preparing for a work placement in the correct order.” The options and correctOrder themselves are coherent.

Weak wrong-category distractors persist in four of five files, particularly in reading tasks where three choices are unrelated activities or locations rather than plausible misunderstandings of the text. C1-S2 has more contextually relevant distractors.

Short-text alternatives reviewed were generally defensible in context: “supervisor/mentor” is broad but acceptable for a workplace guide; “choice/decision” both fit a decision made after comparing possibilities; “analogue/analog” are spelling variants. Technical vocabulary targets should still be checked against the intended course glossary.

Written tasks contain explicit word limits and 8-point analytic rubrics. This structural check does not establish CEFR level or alignment to the official learning outcomes.

This is a representative five-file sample, not a complete V14 audit. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## V15 representative cross-course audit (2026-11-16)

Five V15 files were inspected across C1-S1, C2-S2, C3-S1, C4-S2 and C5-S1. Each contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1.

A safety-critical ordering/key problem was found in C1-S1 task 9. The keyed sequence begins by asking the instructor to check the circuit before the student has connected components or checked the connections, then places switching off the supply last. That is not a coherent sequence for circuit assembly/checking and could teach an unsafe order. The item must be rewritten around an explicit safe workflow and aligned with the accompanying lab instructions; do not simply rearrange the current four phrases without clarifying whether the task concerns initial assembly, fault correction, or final inspection. The listening text itself correctly says not to connect the power supply until the instructor checks the circuit.

A malformed prompt was found in C4-S2 task 8: “The cause has not yet What should you say?” The stem is truncated/concatenated and needs rewriting as a complete situational question.

All ten listening keys match their audioText. The five ordering tasks were reviewed; apart from the safety/workflow defect in C1-S1, the sequences in C2-S2, C3-S1, C4-S2 and C5-S1 are coherent.

Weak wrong-category distractors remain in four of five files, particularly in reading tasks where three options are unrelated activities or locations. C1-S1 has more plausible reading distractors.

Short-text answers are mostly defensible, but C2-S2 accepts both “procedure” and “process” for a series of actions or instructions. These overlap but are not always interchangeable in technical usage; narrow the prompt or define the intended term. C1-S1 accepts “lead/wire” for a connecting lead, which is acceptable at this level.

Written tasks have word limits and 8-point rubrics. CEFR calibration and mapping to official learning outcomes have not been checked.

This is a representative five-file sample, not a complete V15 audit. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


### V14 additional sample check (C1-S1, C2-S2, C3-S1, C4-S2, C5-S1)

A second, disjoint V14 sample was checked after the first five-file review above. All five files contain 10 tasks and repeat the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1.

Two incorrect listening keys were found in C1-S1:
- Task 1 asks whom the student should ask for at reception. The audio names Ms Patel, but the key points to Mr Green. The correct option is the second option (index 1).
- Task 2 asks what to do if delayed. The audio says to telephone reception, but the key points to “Send no message”. The correct option is “Telephone reception” (index 2).

C1-S1 task 9 also has an incoherent order: it starts with reviewing completed tasks before reporting to reception and receiving the supervisor's instructions. The sequence should be rewritten to represent the actual work-placement timeline, including completing work before reviewing and recording it.

C4-S2 task 8 has a malformed stem: “Could we confirm the unit's What is the best response?” It must be rewritten as a complete situational prompt.

All reviewed listening keys in C2-S2, C3-S1, C4-S2 and C5-S1 otherwise match their audioText. The other four ordering tasks were coherent. Weak wrong-category distractors remain in the reviewed set, especially in reading tasks with unrelated places or activities. Short-text targets and written rubrics were structurally present; CEFR calibration and official learning-outcome alignment were not assessed.

This is a second representative sample, not a complete V14 audit. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


### V15 additional sample check (C1-S2, C2-S1, C3-S2, C4-S1, C5-S2)

A second, disjoint V15 sample was checked. Each file contains 10 tasks and repeats the same first-eight positional key signature: 0, 1, 2, 3, 0, [2,3], short-text, 1. All ten listening answer keys in this sample match the facts stated in their audioText.

C2-S1 task 2 has a prompt/audio mismatch: the question asks which technical reference is required for a maintenance-planning meeting, but the audio is about a college work-placement briefing and asks students to bring workplace-supervisor contact details and a placement agreement. The keyed option “A copy of the placement agreement” is supported by the audio, but the stem belongs to a different context and must be rewritten.

C1-S2 task 9 contains a malformed ordering prompt: it is a semicolon-separated list of stages (“Agree the presentation topic; Divide the sections; Prepare and upload slides; Rehearse the presentation”) rather than an instruction to order them. The option set and correctOrder are coherent; rewrite the prompt as a clear imperative.

C4-S1 task 7 is awkwardly constructed: “A controlled record showing the current version of a document is a revision ___.” It accepts “record” and “revision record”; the latter produces the redundant phrase “revision revision record”. Remove the redundant accepted answer or rewrite the stem.

C3-S2 task 7 accepts “proposal” and “recommendation” as interchangeable answers. They overlap, but a proposal is a suggested plan/solution while a recommendation is advice about the preferred option; tighten the definition or accept only the intended term. C5-S2 similarly accepts “summary” and “synthesis”; related concepts, but not exact equivalents in all technical-writing contexts.

Weak wrong-category distractors remain in four of five files, especially in reading tasks with unrelated activities or locations. Written tasks include word limits and 8-point rubrics; CEFR calibration and official learning-outcome alignment remain unverified.

This is a second representative V15 sample, not a complete V15 audit. No pilot JSON was changed. No protected banks, imports, Apps Script, or deployment were touched.


## Consolidated defect register and remediation order (2026-11-16)

This register consolidates only defects explicitly observed in the representative samples recorded above and in the V04–V11 reviews. It is not a declaration that all 150 variants have been fully audited. Where an exact JSON task ID was not preserved in the review notes, the course/semester/variant slot and task number are given instead of guessing an ID.

### P0 — safety and incorrect answer keys

| Variant / task | Confirmed finding | Required action |
|---|---|---|
| V14, C1-S1, task 1 | Audio names Ms Patel for reception; answer key points to Mr Green. | Set the key to the Ms Patel option; re-run key/audio validation. |
| V14, C1-S1, task 2 | Audio instructs a delayed student to telephone reception; key points to “Send no message”. | Set the key to “Telephone reception”; re-run key/audio validation. |
| V15, C1-S1, task 9 | Keyed circuit-work sequence is unsafe/incoherent: instructor check precedes component connection/checking, while power-off is placed last. | Rewrite the task against an explicitly defined safe workflow and lab procedure; subject-matter review required before release. |
| V11, C1-S1, task 9 | Report-writing sequence begins with writing before topic selection and source work. | Correct the sequence to topic → sources → report → source list, or rewrite the task if another process is intended. |

### P1 — malformed prompts and prompt/audio mismatches

| Variant / task | Confirmed finding | Required action |
|---|---|---|
| V12, C3-S2, task 2 | Prompt asks for a resource for a drawing-revision activity; audio describes CNC programme review and controller glossary. | Align the prompt with the audio or replace the audio and choices as a complete item. |
| V12, C4-S1, task 2 | Prompt asks for a maintenance note; audio asks students to bring a circuit diagram from the previous lesson. | Align the prompt with the audio. |
| V13, C4-S2, task 8 | Prompt contains unrelated/concatenated text: “Check the device register and What should you say?” | Rewrite as one complete situational question. |
| V13, C5-S1, task 2 | Prompt refers to reliability analysis; audio describes a technical briefing and one-page status summary. | Rewrite the prompt to match the actual source-summary exercise. |
| V14, C4-S2, task 8 | Truncated/concatenated prompt: “Could we confirm the unit's What is the best response?” | Rewrite as a complete situational prompt. |
| V15, C4-S2, task 8 | Truncated/concatenated prompt: “The cause has not yet What should you say?” | Restore the missing situation and question; verify that the answer options fit. |
| V15, C2-S1, task 2 | Prompt asks for a technical reference at a maintenance-planning meeting, while audio is a work-placement briefing. The keyed placement-agreement answer is in the audio, but the stem belongs to another context. | Rewrite the stem to ask what students must bring to the placement briefing. |
| V11, C4-S2, task 8 | Prompt contains malformed wording: “Check the device register and What should you say?” | Rewrite as a complete, contextually consistent question. |
| V14, C1-S2, task 9 | Prompt field contains a semicolon-separated list of stages rather than an ordering instruction. | Replace with a clear imperative such as “Put the stages … in the correct order.” |
| V15, C1-S2, task 9 | Prompt field is a semicolon-separated list of stages rather than an ordering instruction. | Replace with a clear ordering instruction. |

### P2 — ordering, vocabulary acceptance and answer ambiguity

| Variant / task | Confirmed finding | Required action |
|---|---|---|
| V14, C1-S1, task 9 | Sequence reviews completed tasks before arrival and supervisor instructions. | Rewrite to reflect arrival → instructions → work → review/record. |
| V08, C3-S2, short-text task | Accepts both “conformity” and “non-conformity” after the fixed prefix “non-”, producing “non-non-conformity” for one answer. | Remove the prefixed duplicate and test rendered completion. |
| V09, C2-S2, short-text task | “digital footprint” is accepted after the fixed prefix “digital”, producing a duplicated word. | Remove the redundant full phrase or rewrite the stem. |
| V09, C4-S2, short-text task | “data log” is accepted after the fixed prefix “data”, producing a duplicated word. | Remove the redundant full phrase or rewrite the stem. |
| V09, C3-S1, short-text task | “defect” is accepted alongside “non-conformity”; these are not always equivalent. | Narrow the definition or remove the non-equivalent answer. |
| V10, C5-S2, short-text task | “dependency” and “dependent item” are accepted as equivalents although their meanings differ. | Define the target term precisely and accept only defensible equivalents. |
| V11, C1-S1, short-text task | “reference” is accepted in a phrase requiring a plural list of sources; singular form is awkward. | Adjust accepted forms or the sentence frame. |
| V12, C4-S1, task 7 | Definition of a device that opens/closes a circuit accepts “switch” and “relay”; “switch” is too broad if relay is the intended term. | Narrow the definition or explicitly test the broader category. |
| V13, C2-S2, short-text task | “procedure” and “process” are accepted for a series of actions/instructions; not always interchangeable. | Clarify the intended concept and accepted answer set. |
| V15, C4-S1, task 7 | “revision record” accepted after the fixed prefix “revision”, creating “revision revision record”. | Remove the redundant accepted answer or change the stem. |
| V15, C3-S2, task 7 | “proposal” and “recommendation” treated as interchangeable. | Tighten the definition or accept only the intended term. |
| V15, C5-S2, task 7 | “summary” and “synthesis” treated as interchangeable. | Clarify the intended technical-writing concept. |

### P3 — distractor quality and assessment validity

- Weak wrong-category distractors were observed repeatedly in V05–V15 samples, commonly three unrelated places or activities beside one plausible answer. This makes several reading/listening questions solvable by eliminating absurd choices rather than demonstrating comprehension.
- Replace these with distractors from the same semantic category, plausible confusions, details mentioned elsewhere in the text/audio, or common learner errors. Each distractor must remain unambiguously incorrect.
- Written tasks in reviewed samples generally have word limits and 8-point rubrics. Their structural presence is confirmed; CEFR calibration, construct validity and mapping to approved learning outcomes are not yet established.
- Across reviewed samples V04–V15, the first eight objective/short-text slots repeatedly show the same positional key signature: single-choice indices 0, 1, 2, 3, 0; multiple-choice indices [2,3]; short-text; single-choice index 1. This is evidence of authored positional regularity in the inspected files, not proof that runtime answer shuffling is broken. The delivery engine must be tested independently across courses, subjects, units, attempts and reloads, with displayed options and scoring verified together.

### Recommended remediation sequence

1. **Freeze release/import of affected pilot variants** until P0 safety and key defects are corrected and independently checked.
2. Correct all P0 answer keys and safety-sensitive ordering tasks; add automated tests that compare keyed answers with the source text/audio where feasible, plus mandatory subject review for safety sequences.
3. Repair P1 malformed prompts and prompt/audio mismatches; add schema/content lint rules for incomplete stems, duplicated phrases and semicolon-only ordering prompts.
4. Repair P2 accepted-answer sets and test completed sentence rendering, not just raw answer strings.
5. Replace weak distractors and review written rubrics against CEFR descriptors and the approved programme outcomes.
6. Run a separate runtime shuffle regression suite. Do not infer shuffle failure from static source ordering alone.
7. Only after these checks, update pilot JSON in a separately reviewed change and rerun the complete validation suite.

### Coverage and confidence

The register is a consolidated list of known findings, not an exhaustive inventory of all 150 pilot variants. V05–V06 were checked across all 20 files; V07–V15 were sampled rather than exhaustively audited (with additional disjoint samples for V14 and V15); V04 findings are based on the earlier recorded review. Some V08–V11 exact task identifiers were not retained in the notes and are intentionally represented by slot/task description rather than fabricated IDs. No pilot JSON, protected question bank, Google Sheet, Apps Script, import endpoint or deployment was modified by this register.


## V04 full-slot audit addendum (all 10 course/semester slots)

All ten V04 pilot files were inspected (100 tasks total), covering both Basic courses and all three Technical courses across both semesters. Each file has 10 tasks. The first-eight positional answer signature remains 0, 1, 2, 3, 0, [2,3], short-text, 1.

The 20 listening answer keys reviewed in this pass match the facts in their respective audioText, with one prompt/audio mismatch:
- C5-S2 task 2 asks which two records should be reviewed “during the handover”, but the audio describes a classroom fault-analysis exercise and says students should bring the event log and maintenance-history extract. The keyed answer itself is supported; rewrite the stem to refer to the class/exercise, not a handover.

Malformed ordering prompts:
- C1-S2 task 9 contains four semicolon-separated actions as the prompt instead of an instruction to order them.
- C2-S1 task 9 has the same defect: a semicolon-separated list of stages is used as the prompt.
In both cases, the options and correctOrder are coherent; rewrite the prompt as a clear imperative.

Short-text completion defects caused by duplicated fixed prefixes:
- C4-S1 task 7 begins “...the kilowatt-___” but accepts “kilowatt-hour” and “kwh” in addition to “hour”. The full phrase answer duplicates the prefix; “kwh” does not complete the sentence correctly. Keep only defensible completions such as “hour”, or rewrite the stem to accept the abbreviation/full term.
- C4-S2 task 7 begins “...a programmable logic ___” but also accepts “programmable logic controller”, which duplicates the printed words. Keep “controller” or change the stem.

The other reviewed short-text alternatives were generally contextually defensible. The ordering sequences in the other eight files were coherent on this structural review. Written tasks all include word limits and 8-point rubrics; this pass did not establish CEFR calibration or alignment with approved learning outcomes.

No pilot JSON was modified. No protected question banks, Google Sheets, Apps Script, imports or deployment were touched.


## V07 full-slot audit (all 10 course/semester slots)

All ten V07 files were inspected (100 tasks total). Each contains 10 tasks. The first-eight positional key signature is unchanged: 0, 1, 2, 3, 0, [2,3], short-text, 1. The 20 listening keys in the reviewed files match their audioText, except for one prompt/audio mismatch:
- C4-S2 task 2 asks which equipment-information record is required for a label review, but the audio is about software version records and asks students to bring a sample change log. The keyed answer (“The sample change log”) is supported by the audio; rewrite the stem to match the software-version lesson.

Ordering-prompt/content defects:
- C1-S2 task 9 uses a semicolon-separated list of actions as the prompt instead of an instruction to put them in order.
- C3-S2 task 9 includes “Arrange the stages in a logical sequence” as one of the sortable options. This is an instruction/meta-action, not a process stage; replace it with a genuine process step or remove/rebuild the item.
The other eight ordering sequences reviewed were coherent.

Short-text acceptance defects:
- C4-S2 task 7 begins “...a change ___” but accepts both “log” and “change log”; the latter creates “change change log”. Remove the redundant full phrase.
- C4-S1 task 7 asks for an equipment's “rated ___” but accepts “voltage”, “current” and “rating”. Voltage and current are different possible ratings; without a specified nameplate field the item is ambiguous, and “rating” does not complete the intended concept precisely. Specify the target (e.g. rated voltage) and narrow the accepted answer.

Other reviewed short-text alternatives were contextually plausible. All ten written tasks have word limits and 8-point rubrics; CEFR calibration and mapping to approved learning outcomes were not assessed in this pass. No pilot JSON was changed; no protected banks, imports, Google Sheets, Apps Script or deployment were touched.


## V08 full-slot audit (all 10 course/semester slots)

All ten V08 files were inspected (100 tasks total). Each contains 10 tasks. The recurring first-eight answer-position signature remains 0, 1, 2, 3, 0, [2,3], short-text, 1. The 20 listening keys reviewed match the audio facts, but two prompts do not match their audio:
- C4-S2 task 2 asks for “safety-symbol reference material”, while the audio is about a PLC input-output table and says to bring the controller reference sheet. The keyed answer is supported, but the prompt is from the wrong topic.
- C5-S2 task 2 asks for a “condition-monitoring summary” for a risk review, while the audio describes a quality-improvement presentation and requests a sample defect summary. Rewrite the prompt to match the actual context.

Malformed ordering prompt:
- C1-S2 task 9 consists of four semicolon-separated actions (“Write a clear subject line; Check the recipient's address; ...”) rather than an instruction to order them. The options and correctOrder are coherent; rewrite the prompt as a direct ordering instruction.

Short-text completion defects:
- C2-S2 task 7 begins “...its energy ___” but accepts “energy consumption”, duplicating the fixed word “energy”. Retain “consumption” or change the stem.
- C3-S2 task 7 begins “non-___” but accepts “non-conformity”, producing “non-non-conformity”. Retain the completion “conformity” only, with any spelling variants that complete the stem correctly.
- C5-S1 task 7 begins “non-___” but accepts “non-conformance” and “nonconformance”, both of which repeat the prefix. Retain “conformance” (and only appropriate completion variants).

The remaining reviewed ordering sequences and short-text completions were structurally coherent. The two-option multiple-choice keys inspected were valid and supported by their options; however, several distractor sets remain conspicuously weak or implausible, consistent with the cross-version P3 finding. Written tasks have explicit word limits and 8-point rubrics; CEFR calibration and approved learning-outcome alignment were not established by this audit.

No pilot JSON was modified. No protected question banks, Google Sheets, Apps Script, imports or deployment were touched.


## V09 full-slot audit (all 10 course/semester slots)

All ten V09 files were inspected (100 tasks total). Each contains 10 tasks. The recurring first-eight answer-position signature remains 0, 1, 2, 3, 0, [2,3], short-text, 1. All 20 listening keys reviewed match the stated audio facts.

Malformed ordering prompt:
- C1-S2 task 9 uses four semicolon-separated actions as the prompt instead of asking the learner to put them in order. Its options and correctOrder are coherent; rewrite the prompt as a direct instruction.

Short-text completion defects:
- C2-S2 task 7 begins “...a digital ___” but accepts “digital footprint”, duplicating the fixed word “digital”. Keep “footprint” or change the stem.
- C4-S2 task 7 begins “...a data ___” but accepts “data log”, duplicating the fixed word “data”. Keep “log” or change the stem.
- C4-S1 task 7 begins “...a specification ___” but accepts “specification sheet”, duplicating “specification”. Keep “sheet” or change the stem.
- C3-S1 task 7 accepts “defect” as an alternative to “non-conformity”. These terms are related but not interchangeable in every quality-management context; narrow the accepted answer or explicitly define the intended scope.

The other reviewed short-text completions and ordering sequences were structurally coherent. The two-answer multiple-choice keys inspected were valid and supported by the options. However, several distractors are implausible or from unrelated categories, consistent with the cross-version P3 finding. Written tasks have word limits and 8-point rubrics; CEFR calibration and mapping to approved learning outcomes were not assessed.

No pilot JSON was modified. No protected question banks, Google Sheets, Apps Script, imports or deployment were touched.


## V10 full-slot audit (all 10 course/semester slots)

All ten V10 files were inspected (100 tasks total). Each contains 10 tasks. The recurring first-eight answer-position signature remains 0, 1, 2, 3, 0, [2,3], short-text, 1. All 20 listening keys reviewed match the stated audio facts.

Malformed ordering prompt:
- C1-S2 task 9 consists of a semicolon-separated list of actions rather than an instruction to order them. The options and correctOrder are coherent; rewrite the prompt as a direct instruction.

Short-text completion and equivalence defects:
- C4-S2 task 7 begins “...an audit ___” but accepts “audit trail”, duplicating the fixed word “audit”. Keep “trail” or change the stem.
- C5-S1 task 7 begins “...a document ___” but accepts “document register”, duplicating the fixed word “document”. Keep “register” or change the stem.
- C5-S2 task 7 accepts “dependency” and “dependent item” as alternatives. These are related but not equivalent grammatical/technical forms in this sentence; narrow the accepted answer to “dependency” or explicitly rewrite the stem to support the alternative.

The other reviewed short-text alternatives were contextually defensible. The two-answer multiple-choice keys inspected were valid and supported by their options. Written tasks have explicit word limits and 8-point rubrics; CEFR calibration and approved learning-outcome mapping were not assessed.

No pilot JSON was modified. No protected question banks, Google Sheets, Apps Script, imports or deployment were touched.


## V11 — полный аудит варианта по всем 10 слотам (100 заданий)

Проверены все 10 файлов V11: C1-S1, C1-S2, C2-S1, C2-S2, C3-S1, C3-S2, C4-S1, C4-S2, C5-S1 и C5-S2. В каждом файле по 10 заданий с одинаковой структурой: 5 single-choice, 1 multiple-choice, 1 short-text, 1 single-choice functional-language, 1 ordering и 1 written. Структурная полнота подтверждена; это не заменяет проверку соответствия утверждённым результатам обучения и уровням CEFR.

Новые и подтверждённые дефекты V11:
- **C1-S1, task 4 (Reading 2): неверный ключ.** Вопрос спрашивает, как Надя использует информацию из книг; текст говорит, что она проверяет факты и пишет своими словами (option 2 / index 1), но ключ установлен на «She copies every paragraph» (index 3). Критическая ошибка оценивания.
- **C1-S1, task 9 (ordering): неверная последовательность.** Ключ предлагает сначала написать отчёт, затем выбрать тему и найти источники. Логичный порядок: выбрать тему → найти и проверить источники → написать отчёт своими словами → перечислить использованные источники. Этот дефект также присутствовал в ранее проверенной выборке V11.
- **C1-S2, task 9 (ordering): prompt оформлен как список действий через точки с запятой, а не как инструкция.** Кроме того, ключ ставит safety briefing перед согласованием задания. Для этого сценария сначала следует согласовать задание, затем пройти инструктаж, выполнить работу и отчитаться координатору.
- **C4-S2, task 8 (functional language): malformed prompt** — «Check the device register and What should you say?». Формулировка склеивает начало варианта ответа с вопросом; нужно заменить на самостоятельную ситуацию/вопрос. Ранее этот шаблон уже отмечался в выборке V11.
- **C4-S1, task 7 (short text): дублирование фиксированного фрагмента.** Prompt заканчивается «a data ___», а среди принимаемых ответов есть «data sheet», что даёт «a data data sheet». Оставить только «sheet» (либо изменить prompt, если требуется полный термин).
- **C1-S1, task 7 (short text):** для фразы «a list of ___» вариант `reference` в единственном числе грамматически не подходит; оставить `sources` и `references` либо переформулировать задание под единственное число.

Проверки ключей:
- Оба listening-ключа во всех 10 слотах соответствуют фактам в аудиотекстах; несовпадений не обнаружено.
- Все 10 multiple-choice заданий имеют по два уникальных индекса в диапазоне options; выбранные ответы содержательно поддержаны заданием.
- Все ordering-ключи являются перестановками вариантов; кроме перечисленных выше смысловых/инструкционных дефектов, остальные последовательности выглядят согласованными с описанными процессами.
- В остальных short-text заданиях явного дублирования фиксированного префикса или существенной неэквивалентности принятых ответов в этой проверке не выявлено.
- Все 10 written-заданий содержат явные диапазоны объёма (60–120 слов в зависимости от слота) и рубрики по 8 баллов.

Качество дистракторов остаётся отдельным системным замечанием: в ряде заданий отвлекающие варианты принадлежат очевидно посторонним категориям (например, unrelated laptop/relative/ticket или library/sports-hall distractors), что снижает диагностическую ценность. CEFR, покрытие всех утверждённых результатов обучения и реальная работа перемешивания вариантов этим аудитом не проверялись.


## V12 — полный аудит варианта по всем 10 слотам (100 заданий)

Проверены все 10 файлов V12 по всем пяти курсам и двум семестрам. Во всех файлах по 10 заданий, структура единообразна: 5 single-choice, 1 multiple-choice, 1 short-text, 1 functional-language, 1 ordering и 1 written. Все 10 multiple-choice заданий содержат по два уникальных допустимых индекса, а все ordering-ключи технически являются перестановками вариантов. Все written-задания содержат диапазон слов и рубрику на 8 баллов.

Дефекты и замечания V12:
- **C1-S1, task 1 (listening): неверный ключ.** В аудио проект должен быть завершён by next Tuesday; ключ указывает At the end of the month. Правильный ответ — option 3 / index 2. Это критическая ошибка оценивания.
- **C1-S1, task 9 (ordering): неверная последовательность.** Ключ начинается с Review the finished design, затем только формулирует цель проекта и распределяет задачи. Следует сначала согласовать цель → распределить задачи и сроки → подготовить и проверить работу → оценить готовый результат.
- **C1-S2, task 9 (ordering): malformed prompt.** Вместо инструкции дан перечень действий через точки с запятой. Ключевая последовательность в целом правдоподобна, но prompt необходимо заменить на явную инструкцию, например «Put the exhibition preparation stages in a logical order».
- **C3-S1, task 7 (short text): дублирование фиксированного фрагмента.** Prompt заканчивается «the subject ___», а один из принимаемых ответов — «subject line», что образует «the subject subject line». Оставить `line` либо изменить prompt.
- **C3-S2, task 2 (listening): несоответствие вопроса аудио.** Prompt спрашивает о ресурсе для drawing-revision activity, тогда как аудио описывает разбор CNC programme и controller glossary. Ключ «The controller glossary» подтверждается аудио, но контекст вопроса неверен; это совпадает с ранее отмеченным дефектом выборки V12.
- **C4-S1, task 2 (listening): несоответствие вопроса аудио.** Prompt спрашивает maintenance note, тогда как аудио говорит о circuit diagram from the previous lesson. Ключ по аудио верен, но предмет вопроса сформулирован неверно; дефект также присутствовал в прежней выборке V12.
- **C4-S1, task 7 (short text): неоднозначное определение.** Формулировка «A device that opens or closes an electrical circuit under control» допускает общее `switch`, но целевая тема — relay; оба ответа приняты. Уточнить, что речь о coil and contacts / electrically operated switching device, если требуется именно relay.
- **C5-S1, task 2 (listening): несоответствие контекста.** Prompt называет aircraft task review и «two maintenance records», но аудио описывает занятие по configuration management, просит configuration list и model-reference sheet. Ключевые документы совпадают с аудио, однако вопрос следует привести в соответствие с ним.

Оба listening-ключа по остальным слотам и другие ключи V12 согласуются с аудиотекстами/материалом. В short-text заданиях, кроме C3-S1 и C4-S1, явных ошибок префикса или грубо неэквивалентных синонимов не выявлено. Повторяется слабость дистракторов: в нескольких заданиях неверные ответы относятся к явно посторонним категориям (например, laptop/relative/ticket, library/town centre/bus station), поэтому сложность ниже желаемой. Проверка CEFR, утверждённых результатов обучения и реального перемешивания ответов не проводилась.


## V13 — полный аудит варианта по всем 10 слотам (100 заданий)

Проверены все 10 файлов V13. Во всех слотах по 10 заданий с ожидаемой структурой; все 10 multiple-choice заданий имеют два уникальных допустимых ключа, все ordering-ключи технически являются перестановками, все written-задания содержат диапазон слов и рубрику на 8 баллов.

Дефекты и замечания V13:
- **C1-S1, task 2 (listening): неверный ключ.** Автобус отправляется в 08:15, прибыть нужно на 10 минут раньше — в 08:05. Ключ указывает «At eight fifteen exactly» (index 1); правильный вариант — «At eight oh five» (index 3). Критическая ошибка оценивания.
- **C1-S1, task 9 (ordering): небезопасная/неверная последовательность.** Ключ ставит инструктаж по безопасности до прибытия к входу колледжа. Для описанного посещения последовательность должна быть: прибыть к входу → пройти инструктаж → наблюдать демонстрацию с сопровождающим → вернуться к автобусу. Нельзя оставлять инструктаж до прибытия группы.
- **C1-S2, task 9 (ordering): malformed prompt.** В поле prompt записан перечень действий через точки с запятой, а не команда на упорядочивание. Ключ по смыслу разумен; prompt нужно заменить явной инструкцией.
- **C3-S2, task 2 (listening): несоответствие вопроса аудио.** Вопрос просит принести process-capability data sheet, а аудио говорит об illustrated toolpath sheet. Ключ совпадает с аудио, но термин в вопросе неверен.
- **C4-S2, task 8 (functional language): malformed prompt.** «Please check the measurement method What should you say?» — склейка фрагмента ответа и вопроса; требуется самостоятельная ситуация/вопрос. Этот дефект ранее отмечен в выборке V13.
- **C5-S1, task 2 (listening): несоответствие контекста.** Вопрос называет reliability-analysis summary, а аудио — technical briefing assessment и one-page status summary. Ответный документ совпадает с аудио, но вопрос следует переписать.

Проверка остальных listening-ключей не выявила дополнительных ошибок: они подтверждаются аудиотекстами. Short-text ответы в целом соответствуют пропускам; `batch/lot` для партии материала допустимы в данном контексте. Остальные ordering-последовательности выглядят логичными. В нескольких заданиях дистракторы явно посторонние (например, laptop/relative/ticket, library/town centre/bus station), что снижает качество проверки. CEFR, покрытие утверждённых результатов обучения и реальное перемешивание ответов не проверялись.


## V01 — полный аудит варианта по всем 10 слотам (100 заданий)

Проверены все 10 файлов V01 по слотам C1-S1…C5-S2. Каждый файл содержит 10 заданий с ожидаемой структурой (5 single-choice, multiple-choice, short-text, functional-language, ordering, written). Во всех 10 multiple-choice заданиях указаны два уникальных корректных индекса; ordering-ключи являются перестановками всех четырёх вариантов; written-задания содержат диапазон объёма и рубрику на 8 баллов.

Выявленные дефекты и замечания:
- **C1-S2, task 9 (ordering): malformed prompt.** Поле prompt содержит только перечень действий через точки с запятой («Find the place on the map; Choose the correct street; …»), а не инструкцию упорядочить этапы. Ключ по смыслу логичен; исправить именно формулировку задания.
- **C2-S1, task 9 (ordering): malformed prompt.** Аналогично, в prompt перечислены этапы («Identify your skills; Prepare a short CV; …») без команды на упорядочивание. Ключ по смыслу логичен; заменить prompt на ясную инструкцию.
- **C5-S1, task 7 (short text): дублирование фиксированного фрагмента.** Prompt заканчивается «a work ___», а один из acceptedAnswers — «work package», что приводит к «a work work package». Оставить `package` или переписать prompt под полный термин.
- **C1-S1, task 7 (short text):** открывающая кавычка в примере предложения не закрыта. Это редакторская ошибка, не меняющая предполагаемый ответ.
- **C2-S1, task 2 (listening):** вопрос сформулирован как «Which two things should students prepare», а формат задания single-choice; ключевой вариант содержит оба требуемых элемента (short CV + two questions). Содержательно ответ подтверждён аудио, но для согласования формата лучше переформулировать «Which preparation is required?» либо изменить тип задания на multiple-choice, если элементы должны выбираться отдельно.

Оба listening-ключа в каждом из 10 слотов соответствуют аудиотекстам. Проверенные reading-ключи поддерживаются текстами; явных ошибок оценивания не обнаружено. Short-text ответы в целом подходят к пропускам, за исключением указанного дублирования. Остальные ordering-последовательности логичны. Дистракторы в ряде заданий заметно проще правильных вариантов или относятся к далёким категориям; CEFR, покрытие утверждённых результатов обучения и фактическая работа перемешивания ответов этим аудитом не проверялись.


## V02 — полный аудит варианта по всем 10 слотам (100 заданий)

Проверены все 10 файлов V02. В каждом файле по 10 заданий с ожидаемой структурой; все multiple-choice задания имеют по два уникальных допустимых ключа; все ordering-ключи являются перестановками вариантов; все written-задания содержат диапазон слов и рубрику на 8 баллов.

Выявленные дефекты и замечания:
- **C1-S2, task 9 (ordering): malformed prompt.** В prompt перечислены действия через точки с запятой («Show your student card; Complete the borrowing form; …»), но нет инструкции упорядочить их. Ключ по смыслу логичен; исправить формулировку.
- **C2-S1, task 9 (ordering): malformed prompt.** В prompt только список действий («Choose the role; List relevant experience; …»), без команды на упорядочивание. Ключ по смыслу логичен; добавить явную инструкцию.
- **C3-S1, task 2 (listening): несогласованность вопроса и типа ответа.** Вопрос спрашивает «What two types of dimensions will be explained?», но задание single-choice, а один вариант объединяет два ответа — «Overall dimensions and hole spacing». Аудио подтверждает оба термина, однако формат задания следует согласовать: изменить вопрос на «Which two types… are mentioned together?» либо сделать multiple-choice.
- **C3-S1, task 7 (short text): дублирование фиксированного фрагмента.** Prompt заканчивается «a revision ___», а acceptedAnswers содержит «revision number», что образует «a revision revision number». Оставить `number` либо изменить prompt.
- **C4-S2, task 7 (short text): дублирование фиксированного фрагмента.** Prompt заканчивается «a storage ___», а acceptedAnswers содержит «storage device», что образует «a storage storage device». Оставить `device` либо изменить prompt.
- **C5-S1, task 7 (short text): грамматическое несоответствие числа.** Prompt «an acceptance ___» требует единственного числа; acceptedAnswers содержит `criteria` (множественное). Оставить `criterion` или изменить prompt на множественное число.

Оба listening-ключа во всех 10 слотах подтверждаются аудиотекстами. Проверенные reading-ключи и функциональные ответы поддержаны текстами/ситуациями; дополнительных неверных ключей не обнаружено. Другие short-text ответы подходят к пропускам. В нескольких заданиях дистракторы остаются слишком очевидными или относятся к далёким категориям; CEFR, покрытие утверждённых результатов обучения и реальное перемешивание ответов не проверялись.


## V03 — полный аудит варианта по всем 10 слотам (100 заданий)

Проверены все 10 файлов V03. В каждом файле по 10 заданий ожидаемой структуры; все multiple-choice задания имеют по два уникальных допустимых индекса; все ordering-ключи являются перестановками четырёх вариантов; все written-задания содержат диапазон объёма и рубрику на 8 баллов.

Выявленные дефекты и замечания:
- **C1-S1, task 9 (ordering): неверная последовательность.** Ключ предлагает выбрать книгу → показать студенческий билет → отнести книгу к стойке → получить книгу и срок возврата. Практически правильный порядок: выбрать книгу → отнести её к библиотечной стойке → показать билет/оформить выдачу → получить книгу и срок возврата. Ключ следует переставить с учётом реального процесса выдачи.
- **C1-S2, task 9 (ordering): malformed prompt.** Вместо команды на упорядочивание дан перечень действий через точки с запятой («Check the timetable; Buy the correct ticket; …»). Ключ логичен; исправить формулировку.
- **C2-S1, task 9 (ordering): malformed prompt.** В prompt перечислены этапы интервью через точки с запятой, но нет инструкции их упорядочить. Ключ по смыслу логичен; добавить явную команду.
- **C5-S1, task 2 (listening): несоответствие вопроса аудио.** Вопрос просит принести quality-inspection worksheet, тогда как аудио говорит о case-study worksheet. Ключ совпадает с аудио, но контекст вопроса неверен.
- **C5-S2, task 2 (listening): несоответствие контекста и формата.** Вопрос спрашивает о двух документах для maintenance handover, тогда как аудио описывает integrated report review и называет sample inspection record + trend chart. Ключевая пара подтверждается аудио, но prompt не соответствует событию; кроме того, два документа объединены в один вариант single-choice. Переписать вопрос или использовать multiple-choice.

Оба listening-ключа в остальных заданиях подтверждаются аудиотекстами. Проверенные reading-ключи и функциональные ответы поддерживаются текстами/ситуациями; существенных ошибок оценивания не выявлено. Short-text ответы в целом согласованы с пропусками. В отдельных заданиях дистракторы очевидны и принадлежат посторонним категориям. CEFR, покрытие утверждённых результатов обучения и фактическое перемешивание ответов не проверялись.
