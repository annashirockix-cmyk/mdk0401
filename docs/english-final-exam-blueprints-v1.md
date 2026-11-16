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


## Cross-variant audit — позиция правильного ответа и серверное перемешивание

Проверена одна и та же контрольная ячейка C1-S1 во всех 15 вариантах V01–V15 (15 файлов, 150 заданий). Во всех 15 файлах исходные позиции single-choice ключей повторяются буквально: task 1 → index 0, task 2 → index 1, task 3 → index 2, task 4 → index 3, task 5 → index 0, task 8 → index 1; multiple-choice task 6 → indices [2,3]. Это означает, что **сами pilot JSON не обеспечивают разнообразия позиции правильного ответа между вариантами**. Считать это доказательством отсутствия перемешивания в работающем экзамене нельзя: JSON являются исходными шаблонами, а фактическое перемешивание реализовано на сервере.

Проверен код выдачи экзаменов:
- `Code.gs`, `shuffleEnglishFinalExamTasks_`: для каждого задания создаётся случайная перестановка индексов options (Fisher–Yates); при случайном совпадении с исходным порядком первые два элемента меняются местами. Сервер сохраняет карту `display-index → canonical-index` в приватном снимке попытки.
- `startEnglishFinalExam_`: студенту возвращаются очищенные от ключей задания с перемешанными options; исходные задания и карта остаются в серверном `AttemptJSON`. `submitEnglishFinalExam_` переводит выбранный отображаемый индекс обратно в исходный перед сверкой с `correctIndex` / `correctIndices`.
- `resumeEnglishFinalExam_` и `englishFinalExamDisplayTasks_` восстанавливают ту же перестановку для уже начатой попытки, а не перемешивают варианты повторно. Это правильно: ответ не должен менять значение после обновления страницы.
- `EnglishVPR-Sheets.gs`, `englishVprPrepareAttempt_` / `startEnglishVprExam_`: перемешиваются варианты выбора, matching и gap; соответствующие карты используются при серверной проверке. При повторном открытии активной попытки возвращается сохранённый `displayExam`.
- Общие серверные функции `safeBuiltInQuestion_` и `safeFinalExamQuestion_` также содержат серверное перемешивание вариантов и сохраняют карты соответствия для поддерживаемых типов заданий.

Вывод: исходные позиции в шаблонах повторяются, но проверенные серверные пути реализуют перемешивание отдельно для каждой новой попытки и сохраняют стабильный порядок при восстановлении попытки. По чтению кода подтверждена реализация; **фактический браузерный интеграционный тест на нескольких новых попытках для всех типов заданий ещё не выполнен**. Не менялись pilot JSON, банки, таблицы или Apps Script.


### Проверка существующего тестового покрытия перемешивания

В `scripts/assessment-option-shuffle.test.mjs` обнаружены целевые автоматические тесты; файл входит в команду `npm test` из `package.json`. Они проверяют:
- сохранение и серверное восстановление соответствия индексов для generic protected question bank;
- перемешивание choice / matching / gap в VPR и перенос ключа на новую позицию;
- отдельную перестановку для custom tests, built-in exams и final exams;
- перемешивание single-choice, multiple-choice и ordering в English final-exam варианте, обратное преобразование индексов при оценивании и сохранение того же порядка при resume;
- запрет фиксированного исходного порядка для вариантов с несколькими ответами, включая true/false;
- вызов общей функции перемешивания в практических экзаменационных рендерах `exam_0201.js`, `exam_0202.js`, `exam_0401.js`, `exam_0701.js`;
- сохранение правильного ответа при локальной тренировочной перестановке.

Это подтверждает, что тесты на перемешивание уже предусмотрены в репозитории и что общий механизм охватывает несколько путей оценивания.

#### Фактический результат GitHub Actions (2026-11-16)

Для HEAD `416328a1ea5dde3a5bdabc9cf6ec340a25df17a9` найден завершённый запуск workflow **Portal syntax checks** (run `43894735424`): итог `success`, все шаги job `syntax` завершились успешно. В workflow действительно выполняется `node --test scripts/assessment-option-shuffle.test.mjs`, а не только синтаксическая проверка.

По логам этого запуска:
- `assessment-option-shuffle.test.mjs`: **25 tests, 25 pass, 0 fail**;
- `english-semester-assessment.test.mjs`: **42 pass, 0 fail**;
- `english-technical-draft-bank.test.mjs`: **3 pass, 0 fail**;
- `english-basic-semester-draft.test.mjs`: **4 pass, 0 fail**;
- браузерный English final-exam audit завершился сообщением **passed**; проверены сброс введённых ответов перед отправкой, запрос повторной попытки и одобрение преподавателем;
- все шаги workflow, включая остальные syntax / regression / browser audits, завершились с `success`.

Это закрывает прежнюю неопределённость по запуску тестов: для указанного HEAD тесты перемешивания и браузерный аудит прошли в CI. Ограничение остаётся: browser audit проверяет перечисленные пользовательские сценарии, но не является полным E2E-перебором всех типов заданий и большого числа независимых попыток.


### Cross-variant audit — C1-S2 (V01–V15)

Проверены все 15 пилотных файлов слота C1-S2, по 10 заданий в каждом (150 заданий). Форматы заданий во всех вариантах согласованы по позициям. Все 15 вариантов содержат разные формулировки/содержательные вопросы, но позиции ключей в первых восьми заданиях полностью совпадают:
- single-choice task 1 → index 0; task 2 → index 1; task 3 → index 2; task 4 → index 3; task 5 → index 0; task 8 → index 1;
- multiple-choice task 6 → indices [2,3].
- task 7 — short-text, task 9 — ordering, task 10 — written; они не имеют индексного ключа options.

Это подтверждает повторяемость позиционного шаблона не только в C1-S1, но и в C1-S2. Следовательно, межвариантная балансировка исходных ключей в этих двух проверенных слотах отсутствует; полагаться следует на runtime-перемешивание, которое отдельно проверено серверными тестами. В task 9 всех C1-S2 вариантов формулировка по-прежнему представляет собой перечисление действий через точку с запятой, а не явную инструкцию к упорядочиванию; требуется редакторская правка prompt. Все письменные задания C1-S2 имеют диапазон 60–80 слов и вес 8 баллов. Этот этап — структурная/позиционная проверка, не полная экспертная верификация listening/reading ключей и CEFR.


### Cross-variant audit — C2-S1 (V01–V15)

Проверены все 15 файлов C2-S1 (150 заданий). Во всех вариантах одинаковая структура типов заданий по десяти позициям, но все 15 формулировок на каждой позиции различаются. При этом позиции ключей в заданиях выбора повторяются без исключений:
- single-choice task 1 → index 0; task 2 → index 1; task 3 → index 2; task 4 → index 3; task 5 → index 0; task 8 → index 1;
- multiple-choice task 6 → indices [2,3].
- tasks 7, 9, 10 — short-text, ordering, written соответственно.

Найдена дополнительная проблема соответствия формата: в C2-S1 V01 task 2 формулировка спрашивает **“Which two things…”**, но тип задания — single-choice и предусмотрен один `correctIndex`. Нужно заменить формулировку на вопрос об одном элементе либо перевести задание в multiple-choice и определить два ключа. В task 9 всех 15 вариантов prompt состоит из самих действий, разделённых точкой с запятой, без явной команды “Put the steps in the correct order” (или эквивалентной инструкции); исправить формулировку, не меняя сами проверенные последовательности без отдельной содержательной проверки. Письменные задания имеют диапазон 60–80 слов и вес 8 баллов.

Повтор фиксированных позиций ключей в C2-S1 подтверждает ту же закономерность, что уже обнаружена в C1-S1 и C1-S2: статические pilot JSON не балансируют позиции правильных ответов между вариантами. Runtime-перемешивание покрыто отдельными CI-тестами; это не устраняет необходимость редакторской проверки заданий и содержательной проверки самих ключей.


### Cross-variant audit — C2-S2 (V01–V15)

Проверены все 15 вариантов C2-S2 (150 заданий). Структура типов заданий одинакова во всех вариантах; формулировки каждой из десяти позиций различаются между вариантами. Позиции ключей выбора во всех 15 вариантах совпадают:
- single-choice task 1 → index 0; task 2 → index 1; task 3 → index 2; task 4 → index 3; task 5 → index 0; task 8 → index 1;
- multiple-choice task 6 → indices [2,3].
- tasks 7, 9, 10 — short-text, ordering, written.

В отличие от C1-S2 и C2-S1, формулировка task 9 в C2-S2 содержит явную инструкцию упорядочить этапы; по структурному признаку этот prompt оформлен корректно. Письменные задания C2-S2 имеют диапазон 80–100 слов и вес 8 баллов. Межвариантная позиционная предсказуемость остаётся системной: в трёх проверенных слотах подряд ключи первых восьми заданий стоят в одних и тех же индексах. Проверка этого слота пока ограничена структурой и позициями ключей; это не полная содержательная верификация аудио, чтения, дистракторов и CEFR.


### Cross-variant audit — C3-S1 (V01–V15)

Проверены все 15 файлов C3-S1 (150 заданий). Типы заданий и их расположение совпадают во всех вариантах; все 15 формулировок на каждой позиции уникальны. Позиции ключей при этом неизменны во всех вариантах:
- single-choice task 1 → index 0; task 2 → index 1; task 3 → index 2; task 4 → index 3; task 5 → index 0; task 8 → index 1;
- multiple-choice task 6 → indices [2,3].
- tasks 7, 9, 10 — short-text, ordering, written.

Task 9 во всех вариантах содержит явную инструкцию упорядочить этапы; по формату prompt выглядит корректно. Письменные задания имеют диапазон 80–100 слов и вес 8 баллов. Это четвёртый последовательно проверенный слот, где исходные позиции ключей первых восьми заданий полностью повторяются от V01 до V15. Следовательно, балансировка позиций в самих pilot JSON отсутствует и должна обеспечиваться runtime-перемешиванием. Содержательная проверка аудио/reading-ключей, качества distractors и CEFR остаётся отдельным незакрытым этапом.


### Cross-variant audit — remaining slots C3-S2, C4-S1, C4-S2, C5-S1, C5-S2 (V01–V15)

Проверены все 75 файлов пяти оставшихся слотов (750 заданий). Для каждого слота проверены 15 вариантов, десять позиций заданий, типы, уникальность формулировок и распределение индексов ключей.

| Slot | Task 1 | Task 2 | Task 3 | Task 4 | Task 5 | Task 6 (multi) | Task 8 |
|---|---:|---:|---:|---:|---:|---|---:|
| C3-S2 | 0 | 1 | 2 | 3 | 0 | [2,3] | 1 |
| C4-S1 | 0 | 1 | 2 | 3 | 0 | [2,3] | 1 |
| C4-S2 | 0 | 1 | 2 | 3 | 0 | [2,3] | 1 |
| C5-S1 | 0 | 1 | 2 | 3 | 0 | [2,3] | 1 |
| C5-S2 | 0 | 1 | 2 | 3 | 0 | [2,3] | 1 |

Во всех пяти слотах типы заданий на каждой позиции совпадают между V01–V15; формулировки заданий на каждой позиции различаются во всех 15 вариантах. Task 9 во всех пяти слотах содержит явную инструкцию упорядочить этапы. Письменные задания содержательно различаются и имеют 8 баллов; длина — 80–100 слов в C3-S2, C4-S1, C4-S2, C5-S1; 100–120 слов в C5-S2.

#### Итог позиционного аудита всех десяти слотов

Теперь проверены все 10 course/semester slots × 15 вариантов × 10 заданий = **150 файлов / 1 500 заданий**. Во всех десяти слотах позиции ключей первых восьми заданий идентичны между V01 и V15: single-choice 1→0, 2→1, 3→2, 4→3, 5→0, 8→1; multiple-choice 6→[2,3]. Позиции заданий 7 (short-text), 9 (ordering), 10 (written) не являются индексными ключами выбора.

Вывод: содержательные формулировки пилотных заданий варьируются, но статические ключи в вариантах не сбалансированы по позициям. Обнаруженное не означает, что студент видит неизменный порядок: серверное runtime-перемешивание отдельно прошло CI-тесты (см. выше). Тем не менее исходный шаблон ключей делает пилотные файлы предсказуемыми при просмотре/экспорте и не должен использоваться как самостоятельный механизм защиты от угадывания.

#### Редакторская проверка, выявленная на этапах аудита

- C1-S2: task 9 во всех 15 вариантах — список действий вместо явной команды упорядочить.
- C2-S1: task 9 во всех 15 вариантах — список действий без явной инструкции; C2-S1 V01 task 2 просит выбрать два элемента, но имеет single-choice тип и один ключ.
- C2-S2, C3-S1, C3-S2, C4-S1, C4-S2, C5-S1, C5-S2: task 9 содержит явную инструкцию упорядочить этапы.
- C1-S1: позиционный повтор ключей уже был выявлен ранее; требуется сохранять отдельный список содержательных дефектов этого слота.
- Проверка структуры и ключевых позиций не заменяет построчную верификацию аудио, чтения, ответов, distractors, технической точности и CEFR.

**Граница аудита:** завершена структурная/позиционная проверка всех 150 файлов. Это не означает, что все 1 500 заданий прошли полную содержательную и языковую экспертизу. Следующий этап — целевая сверка ключей по аудиоскриптам и текстам, затем проверка technical accuracy и CEFR; пилотные JSON и production banks на этом этапе не менялись.


### Targeted listening-key review — C3-S2 V01–V15

Проверены 30 listening items (tasks 1–2) по их prompt, options, correctIndex и полному audioText.

Подтверждённые несоответствия:
- V12 task 2: вопрос спрашивает ресурс для drawing-revision activity, но аудио описывает review of a CNC programme; ключ “The controller glossary” соответствует аудио, однако вопрос относится к другой теме.
- V13 task 2: вопрос спрашивает process-capability data sheet, но аудио описывает toolpath terminology и просит принести illustrated toolpath sheet; ключ соответствует аудио, формулировка вопроса — нет.
- V15 task 2: вопрос во множественном числе спрашивает “Which source materials”, аудио называет issue description и evidence table, но единственный ключ указывает только evidence table. Нужно либо спрашивать об одном конкретном документе, либо проверять оба источника.

Качество distractors: в нескольких вариантах (особенно V03–V15) task 1 предлагает к вопросу о времени ответы вроде “At the college library / At the town centre / At the bus station”; task 2 с вопросами о документах/материалах предлагает “On Friday / Next month / After the event”. Эти варианты грамматически или семантически не сопоставимы с вопросом и делают ответ очевидным. Это не ошибки ключа, но существенный дефект качества теста.

В V02 task 2 вопрос просит назвать два типа команд, но single-choice ключ оформлен как один составной вариант с двумя типами команд. Технически ответ выбирается один; формулировку можно уточнить как “Which two command types will be compared as a pair?” либо сделать настоящий multiple-choice с двумя отдельными ключами. В V05 task 2 аналогичная конструкция с двумя документами в одном варианте ответа.

Другие просмотренные ключи C3-S2 V01–V15 по этим 30 заданиям согласуются с аудиоскриптами. Проверка ограничена listening tasks 1–2 и не распространяется на остальные задания этих вариантов.


### Targeted listening-key review — C4-S1 V01–V15

Проверены 30 listening items (tasks 1–2), включая текст аудио, формулировки вопросов, варианты и ключи.

Подтверждённое несоответствие:
- V12 task 2: вопрос спрашивает “Which maintenance note is required…”, но аудио говорит, что нужно принести circuit diagram from the previous lesson. Ключ “The circuit diagram from the previous lesson” соответствует аудио, но не вопросу. Следует изменить prompt на вопрос о circuit diagram либо привести аудио и ключ к maintenance note.

Качество distractors — системная проблема: начиная с V02 task 1, вопросы о времени часто имеют варианты “At the college library / At the town centre / At the bus station”; task 2 с вопросами о документе/содержимом предлагает “On Friday / Next month / After the event”. Это ответы другого семантического типа, а не правдоподобные альтернативы. Нужна замена на сопоставимые даты/время или документы/понятия.

V08 task 2 спрашивает о двух документах, но оба документа объединены в один составной вариант single-choice. Это технически допустимо как выбор одной пары, однако формулировку следует уточнить (“Which pair of documents…?”) или использовать настоящий multiple-choice.

Остальные ключи C4-S1 V01–V15 по этим 30 заданиям согласуются с аудиоскриптами. Проверка охватывает только tasks 1–2 и не является полной экспертизой всего экзамена.


### Targeted listening-key review — C4-S2 V01–V15

Проверены 30 listening items (tasks 1–2) с сопоставлением prompt, вариантов, ключей и аудиоскриптов.

Подтверждённые несоответствия контекста:
- V07 task 2: prompt спрашивает “Which equipment information record is required for the label review?”, тогда как аудио посвящено software version records и sample change log. Ключ “The sample change log” верен по аудио, но вопрос о другой теме.
- V08 task 2: prompt спрашивает “Which safety-symbol reference material…?”, аудио описывает PLC input-output table и controller reference sheet. Ключ совпадает с аудио, но формулировка вопроса неверна.

Качество distractors: V03–V10 task 1 часто предлагают места (library / town centre / bus station) как ответы на вопросы о времени; task 2 часто предлагает даты/время (“On Friday / Next month / After the event”) в вопросах о документе. В V11–V15 distractors семантически ближе, но часть вариантов (“personal notebook / laboratory coat / printed timetable”) всё ещё слишком очевидна. Нужно создавать альтернативы из того же тематического класса.

V05 task 2 просит материалы во множественном числе, а два документа даны одной составной опцией single-choice. Это можно оставить как выбор пары, но prompt должен прямо спрашивать “Which pair of materials…?”. Остальные проверенные ключи C4-S2 V01–V15 соответствуют аудиоскриптам. Проверены только listening tasks 1–2.


### Targeted listening-key review — C5-S1 V01–V15

Проверены 30 listening items (tasks 1–2) по аудиоскриптам и ключам.

Подтверждённые несоответствия:
- V03 task 2: prompt спрашивает “Which quality-inspection worksheet…?”, но аудио говорит о diagnostic evidence и case-study worksheet. Ключ соответствует аудио, вопрос — нет.
- V13 task 2: prompt спрашивает “Which reliability-analysis summary…?”, но аудио описывает short technical briefings и one-page status summary. Ключ “A one-page status summary” соответствует аудио, но вопрос не соответствует теме.

Качество distractors: в V02–V15 повторяется шаблон, при котором вопросы о времени получают варианты-места, а вопросы о документах — “On Friday / Next month / After the event”. Они не являются правдоподобными ответами того же класса. Требуется редактура distractors для всего набора.

В V06, V07, V08, V09, V10 и V12 prompt формулирует вопрос о нескольких записях/документах, а ключ представлен одной составной опцией, содержащей пару. Как и в других слотах, это можно реализовать как single-choice выбора пары, но вопрос должен явно спрашивать “Which pair of records/documents…?”; иначе следует использовать multiple-choice с двумя ключами.

Остальные проверенные ключи C5-S1 V01–V15 соответствуют аудиоскриптам. Проверены только listening tasks 1–2.


### Targeted listening-key review — C5-S2 V01–V15

Проверены 30 listening items (tasks 1–2), включая соответствие формулировок аудиоскриптам.

Подтверждённые несоответствия:
- V03 task 2: вопрос спрашивает документы для maintenance handover, но аудио относится к integrated report review и называет inspection record + trend chart.
- V04 task 2: вопрос спрашивает записи для handover, но аудио описывает fault-analysis case и называет event log + maintenance history extract.
- V08 task 2: вопрос спрашивает condition-monitoring summary для risk review, но аудио посвящено quality-improvement presentation и sample defect summary.

В этих случаях выбранный ключ по смыслу соответствует названному в аудио документу, но prompt спрашивает о другом занятии/контексте. Исправить prompt либо аудиоскрипт; ключ не менять автоматически.

Качество distractors: в V03–V15 task 1 варианты места (library / town centre / bus station) используются как отвлекающие ответы на вопрос о времени; task 2 предлагает даты/время (“On Friday / Next month / After the event”) вместо сопоставимых документов. Это делает выбор слишком лёгким. Нужны содержательно правдоподобные альтернативы.

V03, V04, V06, V07, V11, V13, V14 и V15 task 2 формулируют запрос о нескольких документах/источниках, а ключ дан как одна составная опция-пара/набор. Single-choice может быть допустим, если вопрос явно спрашивает “Which pair/set of documents…?”; иначе следует изменить формат на multiple-choice и задать отдельные ключи. V10 task 2 также имеет несопоставимые distractors, хотя вопрос и ответ по аудио согласованы.

Остальные ключи C5-S2 V01–V15 по tasks 1–2 соответствуют аудиоскриптам. Проверены только listening tasks 1–2.


### Targeted reading-key review — C3-S2 V01–V15

Проверены 30 reading items (tasks 3–4): passage, question, options и correctIndex.

По проверенным 30 заданиям ключи соответствуют содержанию текстов; явной ошибки correctIndex не выявлено. Вопросы преимущественно проверяют конкретные факты/выводы из текста и техническую лексику.

Обнаружен серьёзный дефект distractors: начиная с V03 и далее в большинстве заданий повторяются варианты, не относящиеся к тексту и даже к предметной области (например, “To borrow a laptop / To meet a relative / To buy a ticket” для вопросов о токарной обработке, режущем инструменте, workholding, качестве и CNC; в task 4 — “At the sports centre / In the computer room / At the bus station” для вопросов о технической документации). Они позволяют угадывать правильный ответ без чтения и резко снижают диагностическую ценность заданий.

Необходимо заменить отвлекающие ответы на грамматически параллельные и предметно правдоподобные альтернативы, сохраняя единственный доказуемый ключ. В этой проверке ключи не редактировались.


### Targeted reading-key review — C4-S1 V01–V15

Проверены 30 reading items (tasks 3–4): тексты, вопросы, варианты ответов и correctIndex.

Все 30 проверенных ключей соответствуют содержанию reading passages; явной ошибки correctIndex не обнаружено. Тексты по темам circuit theory, measurement, components, energy use, fault reporting, transformers, labels, sensors, relays, fault categories и signals; вопросы опираются на прямые факты из passage.

Критический дефект distractors повторяется: начиная с V02, в заданиях task 3 встречаются варианты “To borrow a laptop / To meet a relative / To buy a ticket”, не связанные с электроникой и содержанием текста. В task 4 повторяются ответы-места “At the sports centre / In the computer room / At the bus station” даже для вопросов о единицах измерения, отчётах, технической документации и неисправностях. Эти distractors делают задания угадываемыми без чтения и не проверяют понимание.

Требуется заменить их на грамматически параллельные, предметно близкие и правдоподобные альтернативы, сохраняя один однозначно подтверждаемый ключ. В рамках этой проверки ключи не изменялись.


### Targeted reading-key review — C4-S2 V01–V15

Проверены 30 reading items (tasks 3–4): passage, question, options и correctIndex.

По всем 30 заданиям ключи соответствуют содержанию текстов; явной ошибки correctIndex не обнаружено. Темы охватывают communication systems, computer systems, automation, PLCs, technical reporting, network protocols, change logs, data logs, cybersecurity, IIoT, digital twins, predictive maintenance, ground-support equipment и incident reports.

При этом начиная с V03 в большинстве заданий повторяются нерелевантные distractors: “To borrow a laptop / To meet a relative / To buy a ticket” в вопросах о технических системах и “At the sports centre / In the computer room / At the bus station” в вопросах о документации, протоколах и производственных процессах. Эти варианты не являются правдоподобными альтернативами и позволяют отвечать без чтения.

Нужна замена distractors на параллельные по грамматической форме и тематически близкие варианты, например альтернативные функции контроллера, элементы документации, причины/следствия или характеристики оборудования. Ключи в этой проверке не менялись.


### Targeted reading-key review — C5-S1 and C5-S2 V01–V15

Проверены 60 reading items (tasks 3–4) по двум слотам: C5-S1 и C5-S2, все 15 вариантов каждого слота.

**C5-S1:** ключи всех 30 проверенных заданий соответствуют passage. Темы: maintenance planning, inspection findings, diagnostics, manual applicability, revision control, aircraft configuration, shift handover, non-conformance, reliability analysis, controlled publications, configuration identification, technical briefings, service notices и supplier evaluation.

**C5-S2:** ключи всех 30 проверенных заданий соответствуют passage. Темы: handover, risk records, integrated reports, fault analysis, document release, replacement proposals, procurement, inspection checklists, maintenance records, manufacturing dependencies, audits, equipment integration, proposals и technical summaries.

**Дефект distractors в C5-S2 V03–V15 устранён (2026-11-16):** в task 3 и task 4 заменены посторонние варианты на тематически и грамматически параллельные альтернативы, относящиеся к техническим отчётам, расследованию неисправностей, документ-контролю, качеству и интеграции. Правильные ответы оставлены на прежних позициях (task 3 — C, task 4 — D), поэтому ключи и баланс ответов не менялись. Изменения синхронизированы в общем реестре. Отдельный аналогичный дефект в C5-S1 V02–V15 остаётся следующим пунктом аудита.

Рекомендация для всех C5 reading items: заменить эти шаблонные distractors на варианты того же семантического класса, что и ключ (альтернативные записи/документы, функции, причины, действия или технические параметры), не меняя проверенные правильные ответы. В рамках этой проверки содержимое пилотных JSON не изменялось.


### Targeted reading-key review — C3-S1 V01–V15

Проверены 30 reading items (tasks 3–4). Все 30 ключей соответствуют passage; явной ошибки correctIndex не выявлено. Темы охватывают материалы, чертежи, parts lists, workshop safety, incoming inspection, illustrated parts catalogues, tolerances, identification plates, quality reports, measuring instruments, maintenance roles, professional email, material certificates, technical notices и traceability.

В V02–V15 task 3 повторяются три нерелевантных distractors “To borrow a laptop / To meet a relative / To buy a ticket”; в task 4 — “At the sports centre / In the computer room / At the bus station”. Они не соответствуют ни технической тематике, ни грамматической форме ключа. В V01 альтернативы в основном предметно близкие и правдоподобные. Требуется заменить шаблонные distractors в V02–V15 на технически сопоставимые варианты; правильные ключи по проверенным заданиям сохраняются.


### Targeted reading-key review — C1-S1 V01–V15

Проверены 30 reading items (tasks 3–4) во всех 15 вариантах.

Подтверждены две ошибки ключей:
- **V11 task 4:** passage говорит, что Nadia проверяет факты и пишет отчёт своими словами. Правильный ответ — “She checks facts and writes in her own words” (index 1), но `correctIndex` указывает на “She copies every paragraph” (index 3).
- **V12 task 3:** текст говорит, что группа распределяет три задачи между названными студентами. Правильный ответ — “They assign tasks to named students” (index 1), но ключ указывает “Everyone does the same task” (index 2).

Остальные 28 ключей в проверенных reading items соответствуют текстам. Отдельно: V10 task 4 правильный ответ — “When an instruction is unclear” (index 1), но distractor “Only at the end of the course” сформулирован как заведомо неверный и не очень правдоподобный; его стоит заменить.

Для V01–V10 и V12–V15 distractors в основном предметно сопоставимы и не повторяют массовый посторонний шаблон, встреченный в более поздних слотах. При редактуре необходимо исправить только подтверждённые ключи и улучшить слабые варианты, не менять содержание без проверки.


### Targeted reading-key review — C1-S2 V01–V15

Проверены 30 reading items (tasks 3–4) во всех 15 вариантах. Все 30 ключей соответствуют текстам; явных ошибок correctIndex не выявлено.

V01–V10 используют преимущественно правдоподобные тематические distractors. В V11–V15 обнаружен тот же шаблон нерелевантных вариантов, что и в старших слотах: “To borrow a laptop / To meet a relative / To buy a ticket” в task 3 и “At the sports centre / In the computer room / At the bus station” в task 4. Их нужно заменить на предметно и грамматически сопоставимые варианты. Проверенные правильные ключи сохраняются.


### Targeted reading-key review — C2-S1 V01–V15

Проверены 30 reading items (tasks 3–4) во всех 15 вариантах. Все 30 ключей соответствуют passage; явных ошибок correctIndex не выявлено.

В V02–V15 почти повсеместно в task 3 используются посторонние варианты “To borrow a laptop / To meet a relative / To buy a ticket”, а в task 4 — “At the sports centre / In the computer room / At the bus station”. Они не соответствуют тематике текстов о трудоустройстве, учёбе, цифровых материалах, аэропортах и профессиональной коммуникации. V01 в целом имеет более правдоподобные distractors. Требуется заменить шаблонные варианты V02–V15 на сопоставимые по смыслу и грамматической форме, не меняя проверенные ключи.


### Targeted reading-key review — C2-S2 V01–V15

Проверены 30 reading items (tasks 3–4) во всех 15 вариантах. Все 30 ключей соответствуют текстам; явных ошибок correctIndex не выявлено.

V01–V02 имеют в целом тематически сопоставимые distractors. В V03–V15 task 3 систематически включает нерелевантные варианты “To borrow a laptop / To meet a relative / To buy a ticket”, а task 4 — “At the sports centre / In the computer room / At the bus station”. Это резко снижает сложность угадывания и не позволяет достоверно оценить понимание текстов о renewable energy, cyber safety, transport, environmental monitoring, audits, recycling и digital systems.

Рекомендуется заменить повторяющиеся отвлекающие ответы на правдоподобные варианты из той же тематической категории, сохранив подтверждённые ключи. В рамках этой проверки пилотные JSON не изменялись.


### Cross-slot short-text answer audit — task 7 (V01–V15)

Проведена проверка prompt и acceptedAnswers для task 7 в десяти слотах, 150 заданий.

Подтверждены повторяющиеся дефекты:
- **C1-S1 V11:** prompt “a list of ___” принимает “reference” (единственное число), тогда как ожидаемое значение — plural “sources/references”; singular form грамматически не подходит в данном контексте.
- **C2-S2 V08:** prompt “The amount of energy used by a building is its energy ___” принимает и “consumption”, и полную фразу “energy consumption”; вторая форма дублирует уже напечатанную часть prompt.
- **C2-S2 V09:** “a digital ___” принимает “digital footprint” — повторяет слово digital из prompt.
- **C3-S1 V02:** “a revision ___” принимает “revision number”; повторяется слово revision.
- **C3-S1 V06:** “its part ___” принимает “part number”; повторяется part.
- **C3-S1 V12:** “the subject ___” принимает “subject line”; повторяется subject.
- **C3-S2 V08:** “a non-___” принимает “non-conformity”; повторяется приставка non-.
- **C4-S1 V04:** “kilowatt-___” принимает “kilowatt-hour”; повторяется уже напечатанное kilowatt-.
- **C4-S1 V09:** “a specification ___” принимает “specification sheet”; повторяется specification.
- **C4-S1 V11:** “a data ___” принимает “data sheet”; повторяется data.
- **C4-S1 V15:** “a revision ___” принимает “revision record”; повторяется revision.
- **C4-S2 V02:** “a storage ___” принимает “storage device”; повторяется storage.
- **C4-S2 V04:** “programmable logic ___” принимает “programmable logic controller”; повторяется вся часть prompt.
- **C4-S2 V07:** “a change ___” принимает “change log”; повторяется change.
- **C4-S2 V09:** “a data ___” принимает “data log”; повторяется data.
- **C4-S2 V10:** “an audit ___” принимает “audit trail”; повторяется audit.
- **C5-S1 V01:** “a work ___” принимает “work package”; повторяется work.
- **C5-S1 V02:** “an acceptance ___” принимает “criteria” (plural), хотя prompt требует singular noun.
- **C5-S1 V08:** “non-___” принимает “non-conformance”; повторяется non-.
- **C5-S1 V10:** “a document ___” принимает “document register”; повторяется document.
- **C5-S2 V10:** принимает “dependency” и “dependent item” как эквивалентные, хотя это разные грамматические формы и значения.
- **C5-S2 V15:** принимает “summary” и “synthesis” как взаимозаменяемые; в данном prompt это не гарантированные синонимы.

Дополнительные случаи, уже зафиксированные в пофайловых аудитах: C1-S1 V05 “a work ___” → “work package”; C1-S1 V11 reference singular; C2-S2 V08/V09; C3-S1 V02/V06/V12; C3-S2 V08; C4-S1 V04/V09/V11/V15; C4-S2 V02/V04/V07/V09/V10; C5-S1 V01/V02/V08/V10.

#### Правило исправления

Для всех short-text заданий: acceptedAnswers должны содержать только ответ, который вставляется в пропуск, без повторения слов/частей, уже присутствующих в prompt. Варианты ответа должны совпадать по части речи, числу и смыслу с грамматической конструкцией. Полные фразы нельзя принимать как эквивалент отдельного пропущенного слова. Неоднозначные пары (например, dependency/dependent item; summary/synthesis) следует разделять или переписывать prompt.

Пилотные JSON на этом этапе не менялись.


## Consolidated correction queue — audit checkpoint 2026-11-16

### Confirmed correction classes

| Priority | Area | Confirmed issue | Scope / action |
|---|---|---|---|
| P0 | Reading answer key | C1-S1 V11 task 4 and V12 task 3 have incorrect correctIndex | Correct these two keys after revalidating exact JSON paths |
| P1 | Listening | Prompt and recording refer to different technical context in the cases listed in the listening audit | Rewrite prompt or replace recording/transcript as a matched pair; do not change key based on prompt alone |
| P1 | Listening | Multi-document / multi-item prompts are represented by one composite single-choice option | Explicitly ask for a pair/set or convert to multiple-choice with two separately keyed answers |
| P1 | Ordering | C1-S1 V03, V11–V15 and multiple C1-S2/C2-S1 ordering prompts have incorrect, unsafe or malformed sequencing/instructions | Rebuild ordering instructions and key from the real operational procedure; electrical/mechanical safety order requires subject review |
| P1 | Short text | acceptedAnswers repeat words already present in the gap prompt or accept full phrase instead of the missing segment | Normalize answer to the exact gap; align grammar, number and part of speech |
| P1 | Short text | Non-equivalent answers are treated as synonyms (C5-S2 V10, V15 and other cases recorded above) | Split the accepted set or rewrite the prompt to define one unambiguous target |
| P2 | Reading distractors | Reused off-topic distractors (laptop/relative/ticket; sports centre/computer room/bus station) | Replace with plausible, parallel alternatives in the same semantic category; retain validated keys |
| P2 | Listening distractors | Option category mismatch (time vs place, document vs date/time) | Replace with plausible alternatives of the same answer type |
| P2 | Reading distractors | Generic obviously false alternatives weaken assessment | Review all options for plausibility, grammatical parallelism and CEFR fit |
| P2 | Written | Word-count/rubric/technical correctness and CEFR alignment not yet fully cross-validated | Audit each prompt and rubric against intended learning outcomes |

### CI checkpoint

Для PR HEAD `4c8ff4e164be2574b72999d049009b79eac269a0` workflow **Portal syntax checks** (run `43903626593`, job `133426503545`) завершился с `success`. Все 22 основных шага job завершены успешно, включая:
- answer-key isolation;
- five-year English runtime and listening modules;
- English final-exam real-browser audit;
- workbook A4/PDF, course-constructor round-trip и certificate A4 landscape audits.

В логах тестовых команд `assessment-option-shuffle.test.mjs`, `english-semester-assessment.test.mjs`, `english-technical-draft-bank.test.mjs` и `english-basic-semester-draft.test.mjs` видны `# fail 0`. Это подтверждает зелёный CI для указанного HEAD, но не означает, что содержательные ошибки в пилотных JSON исправлены: данный этап по-прежнему является аудитом, а не редактурой банков.

### Boundary

На этом checkpoint пилотные JSON, закрытые банки вопросов, Google Sheets и Apps Script не изменялись. Исправления данных следует выполнять отдельным контролируемым пакетом с повторной проверкой всех вариантов и ключей.


### Targeted answer-key review — tasks 5–6, C1-S2 and C2-S1

Проверены 60 items (15 вариантов × tasks 5–6 × 2 слота).

**C1-S2:** все 30 ключей корректны. В single-choice tasks 5 грамматические формы и контекст соответствуют выбранным ответам. В multiple-choice tasks 6 оба отмеченных варианта соответствуют инструкции “Choose TWO”.

**C2-S1:** выявлена одна дополнительная ошибка ключа:
- **V06 task 6:** prompt — “Choose TWO professional habits that help a new employee.” Отмечены индексы [2,3], то есть “Arriving on time” и “Ignoring instructions”. Второй вариант неверен; корректные ответы — “Asking when a task is unclear” (index 0) и “Arriving on time” (index 2). Исправить `correctIndices` на [0,2].

Остальные 29 ключей C2-S1 tasks 5–6 корректны.

**Качество distractors:** в C1-S2 и C2-S1 повторяется заметная доля заведомо абсурдных альтернатив (пароли, чужие личные данные, несвязанные покупки/предметы, очевидно опасное поведение). Они делают часть multiple-choice items слишком лёгкими и снижают диагностическую ценность. Рекомендуется заменить их на plausible distractors, которые описывают реальные, но менее подходящие действия/грамматические формы, сохраняя однозначность ключей.

Пилотные JSON не менялись; найденная ошибка добавлена в очередь исправлений.


### Targeted answer-key review — tasks 5–6, remaining seven slots

Объём проверки: 7 слотов × 15 вариантов × 2 задания = 210 items.

Проверены все варианты C2-S2, C3-S1, C3-S2, C4-S1, C4-S2, C5-S1 и C5-S2 (105 пар заданий, 210 items).

**Ключи:** в просмотренных заданиях 5 и 6 выбранные индексы соответствуют грамматике, контексту и инструкции “Choose TWO”. Новых ошибок answer key в этих семи слотах не выявлено. Это точечная проверка заданий 5–6, а не подтверждение качества остальных заданий варианта.

**Системная проблема distractors:**
- В task 5 single-choice во многих вариантах неверные формы настолько явно неграмматичны, что ответ можно выбрать без понимания целевой конструкции. Примеры: “will improve yesterday”, “might improve last year”, “is identifying yesterday”, “are transfer”. Встречаются также варианты с несогласованием числа/формы глагола и искусственными временными маркерами.
- В task 6 multiple-choice часто используются варианты из заведомо чужой предметной области (например, хвостовая бабка/резец в заданиях по электротехнике или сетям; кафе, личные предпочтения, расписание автобуса в вопросах о технической документации). Это не конкурентные distractors и позволяет угадывать по тематической очевидности.
- В отдельных вопросах есть более содержательные альтернативы, но общий шаблон «два релевантных ответа + два очевидно нерелевантных» повторяется во всех проверенных слотах.

**Рекомендации:** для task 5 создавать грамматически правдоподобные альтернативы, которые отражают типичные ошибки (время, залог, согласование, инфинитив/герундий, предлог), сохраняя только один правильный ответ. Для task 6 подбирать альтернативы из той же предметной области и той же семантической категории, которые были бы правдоподобны для недостаточно подготовленного студента, но однозначно не отвечали бы на вопрос. Не использовать абсурдные/посторонние варианты как основной способ сделать ответ неверным.

Пилотные JSON и защищённые банки не изменялись; это документальный аудит.


### Ordering task 9 — first full-slot review

Проверены задания 9 в слотах C1-S1, C1-S2, C2-S1, C2-S2, C3-S1, C3-S2, C4-S1, C4-S2 и C5-S1 (варианты, попавшие в текущий пакет чтения). Проверка включает формулировку, набор пунктов и сохранённый correctOrder. Ниже фиксируются только подтверждённые дефекты и случаи неоднозначности; остальные последовательности в просмотренных примерах не следует автоматически считать универсально единственно возможными без контекстной проверки.

**Подтверждённые дефекты ключа / содержания:**
- **C1-S1 V11:** порядок начинается с “Write the report in your own words”, до выбора темы и проверки источников. Последовательность некорректна.
- **C1-S1 V12:** “Review the finished design” стоит первым, до согласования цели и назначения задач. Последовательность некорректна.
- **C1-S1 V13:** “Listen to the safety briefing” стоит перед “Arrive at the college entrance”; последовательность нарушает контекст визита.
- **C1-S1 V14:** “Review the tasks completed” стоит первым, до регистрации на месте и получения инструкций. Последовательность некорректна.
- **C1-S1 V15:** цепочка “Ask the instructor to check the circuit” → “Follow the diagram to connect components” → “Switch off the supply before making changes” → “Check that the connections are secure” небезопасна и логически неверна: проверка преподавателем предшествует сборке, а отключение питания сформулировано как действие уже после соединения. Нужен предметный пересмотр и проверка специалистом; не считать предложенный здесь альтернативный порядок утверждённой процедурой.
- **C1-S2 V01–V15:** в поле prompt записаны сами четыре шага через точку с запятой, а не инструкция к упорядочиванию. Пункты повторяют те же шаги в options; задание структурно сформировано неверно и фактически раскрывает содержание ответа в формулировке.
- **C1-S2 V11:** в ключе сначала стоит “Receive the safety briefing”, затем “Agree the volunteer task”. Для типового сценария сначала определяется/согласуется задача и роли, затем проводится соответствующий инструктаж перед началом деятельности; текущая последовательность требует пересмотра с учётом конкретного сценария.

**Общая проблема качества:** многие задания описывают процесс как будто существует только один обязательный порядок, хотя несколько шагов могут быть параллельными или переставляться в зависимости от локальной процедуры. Формулировка должна задавать конкретный сценарий и критерий (например, “before starting the task”, “according to the document-control procedure”), иначе multiple valid orders may exist.

**Безопасность:** любые ordering items, связанные с электричеством, подключением цепей, станками, авиационным обслуживанием, блокировкой/изоляцией энергии или допуском к работе, должны быть сверены с утверждённой локальной инструкцией и профильным специалистом. Аудит английского языка не заменяет техническую экспертизу.

Пилотные JSON не менялись. Исправления ключей и prompt не вносились; зафиксирована очередь дефектов для отдельного согласованного пакета.


### Ordering task 9 — C5-S2 completion and structural cross-check

Проверены все 15 вариантов C5-S2 и варианты C5-S1 V01–V05 (20 дополнительных заданий task 9). В этих заданиях новых однозначно неверных ключей не выявлено: сохранённые последовательности в целом согласуются с формулировками процессов. Это не является подтверждением соответствия техническим регламентам.

**Случаи для дополнительной предметной верификации:**
- **C5-S2 V01 (maintenance handover):** последовательность начинается с краткого описания выполненной работы, затем фиксируются открытые задачи и вопросы, требующие подтверждения, после чего проводится briefing incoming team. В зависимости от формы handover и срочности нерешённых вопросов порядок перечисления может различаться; prompt не задаёт конкретный регламент.
- **C5-S2 V09 (aviation maintenance records):** последовательность идентификации компонента, проверки task reference/supporting data, фиксации статуса и обеспечения traceability выглядит логичной как документальная схема, но не заменяет проверку по применимым авиационным требованиям и утверждённым процедурам.

**Дополнительно подтверждённые структурные дефекты:**
- **C3-S2 V07:** в options включён пункт “Arrange the stages in a logical sequence”, то есть сама инструкция к заданию ошибочно представлена как один из упорядочиваемых этапов. Пункт необходимо заменить реальным этапом процесса; затем заново проверить correctOrder.
- **C2-S1 V01–V04:** поле prompt содержит четыре шага, разделённые точками с запятой, вместо инструкции на упорядочивание. Эти же шаги повторяются в options. Структурный дефект раскрывает весь набор действий в условии и не проверяет навык последовательности. Переписать prompt как явную инструкцию, не меняя набор шагов без отдельной проверки ключа.

**Итог этого пакета:** C5-S2 (15/15) и C5-S1 V01–V05 просмотрены; новых подтверждённых ошибок ключа не добавлено. Аудит ordering task 9 в целом ещё не закрыт: остаются ранее отмеченные дефекты C1-S1, C1-S2, C2-S1, C3-S2 и необходимость предметной проверки технических последовательностей.

Пилотные JSON, закрытые банки вопросов, Google Sheets и Apps Script не изменялись.


### Written task 10 — C5-S1 and C5-S2 rubric audit

Проверены письменные задания V01–V15 в C5-S1 и C5-S2 (30 заданий). Во всех 30 случаях используется одна и та же четырёхчастная рубрика на 8 баллов: выполнение задания/содержание (0–2), организация (0–2), грамматика (0–2), техническая лексика/орфография/пунктуация (0–2). Максимум и распределение баллов единообразны, но рубрика недостаточно операционализирована для разных предметных задач.

**Подтверждённые замечания:**
- **Общая проблема всех 30 заданий:** критерий “task completion and relevant content” не перечисляет обязательные элементы конкретного ответа и не устанавливает, как оценивать пропуск одного или нескольких элементов. Не выделены точность технических утверждений, корректное разграничение наблюдения/гипотезы/вывода, использование доказательств и корректное обозначение неопределённости там, где это прямо требуется prompt.
- **C5-S1 V03, V08, V09, V11, V15 и C5-S2 V02–V15:** задания прямо требуют анализа, работы с evidence, limitations, cause, conformity, risk или recommendation, но критерий содержания остаётся общим. Нельзя надёжно отличить поверхностный ответ от технически корректного только по опубликованной формулировке рубрики.
- **C5-S1 V06–V10:** рубрика не содержит фразы “Minor errors are acceptable if meaning remains clear”, присутствующей в C5-S1 V01–V05 и V11–V15, а также во всех проверенных C5-S2 V01–V15. Это текстовая непоследовательность, хотя распределение баллов одинаково.
- **Различная длина ответов:** C5-S1 V01–V10 требуют 80–100 слов, V11–V15 — 100–120 слов; C5-S2 V01–V15 — 100–120 слов. Это само по себе допустимо, но критерии не объясняют, как оценивать существенное несоблюдение объёма.

**Рекомендация:** сохранить общий каркас из четырёх критериев, но для каждого задания добавить короткий список обязательных содержательных элементов и уровни 0/1/2 с проверяемыми дескрипторами. В критерии технической точности отдельно учитывать unsupported claims и опасные/неподтверждённые рекомендации; в языковом критерии оценивать понятность и точность формулировок, а не наказывать за мелкие ошибки, не мешающие смыслу. Для C5-S1 V06–V10 унифицировать оговорку о допустимых языковых ошибках. Установить единое правило обработки word limit.

Это аудит качества рубрик, не оценка ответов студентов. Пилотные JSON, банки вопросов, Google Sheets и Apps Script не изменялись.


### Written task 10 — C4-S1 and C4-S2 rubric audit

Проверены task 10 во всех 15 вариантах C4-S1 и C4-S2 (ещё 30 письменных заданий; суммарно с ранее проверенным C5-S1/C5-S2 — 60 заданий).

**Подтверждённые замечания:**
- **Все 60 заданий C4-S1, C4-S2, C5-S1 и C5-S2:** содержательный критерий остаётся общим и не перечисляет обязательные элементы ответа. Для тем электрических измерений, трансформаторов, датчиков, PLC, цифровых двойников, predictive maintenance, non-conformance и авиационных записей это оставляет оценивание технической точности и полноты на усмотрение проверяющего.
- **C4-S2 V11–V15:** рубрика переформулирована как “content and task completion”, “organisation and linking” и т. п., в отличие от V01–V10, где используются “task completion and relevant content” и “clear organisation and logical linking”. Смысл близок, но формулировки и критерии не унифицированы; в V11–V15 также отсутствует явная оговорка о допустимости небольших ошибок при сохранении смысла.
- **C4-S1 V01–V15 и C4-S2 V01–V15:** одинаковое распределение 2+2+2+2 балла применяется к существенно разным коммуникативным действиям (сравнение, объяснение, описание неисправности, техническая рекомендация). Не задано, какие содержательные элементы соответствуют 0, 1 или 2 баллам.

**Рекомендация:** создать единый стандарт рубрики и шаблон задания: (1) обязательные пункты содержания из prompt; (2) дескрипторы 0/1/2 по полноте и технической корректности; (3) отдельный критерий доказательности/обоснования там, где он запрошен; (4) единая оговорка о незначительных языковых ошибках; (5) правило оценки объёма ответа. Для safety-related тем нельзя присуждать максимальный балл ответу, содержащему небезопасное или необоснованное действие, даже если английский язык корректен.

Ошибки в конкретных ключах здесь не проверялись: task 10 оценивается по рубрике. Это аудит конструкции критериев, не автоматическая проверка фактических ответов студентов. Пилотные JSON, банки вопросов, Google Sheets и Apps Script не изменялись.


### Written task 10 — C3-S1 and C3-S2 rubric audit

Проверены все 15 вариантов C3-S1 и C3-S2 (ещё 30 заданий; суммарно проверены 90 письменных заданий в C3-S1/S2, C4-S1/S2 и C5-S1/S2).

**Подтверждённые замечания:**
- **C3-S1 V01–V15 и C3-S2 V01–V15:** применяется единая общая рубрика 2+2+2+2 без критериев полноты конкретного ответа и без уровневых дескрипторов. Это особенно заметно в заданиях на выбор материала, чтение размеров, допуски, измерительный инструмент, CNC-программу, процессную способность и техническую рекомендацию: нельзя определить, какие именно элементы обязательны для 2 баллов за содержание.
- **C3-S1 V14:** prompt просит написать notice об изменении аудитории, времени, затронутой группе и действиях студентов. При этом последняя часть рубрики требует “accurate technical vocabulary”. Это не соответствует коммуникативной задаче обычного организационного объявления; критерий следует заменить на уместную лексику и ясность инструкции.
- **C3-S2 V02 и V09:** prompt специально ограничивает ответ концептуальным объяснением и запрещает машинно-специфические operating instructions. Рубрика не содержит отдельного критерия соблюдения этого ограничения или безопасности содержания.
- **C3-S2 V06, V08, V15:** задания требуют safety communication, точного non-conformity reporting и доказательного problem-solving, но рубрика не выделяет безопасность, сохранение исходных данных и отделение подтверждённых фактов от предположений как проверяемые критерии.

**Рекомендация:** критерий лексики должен соответствовать жанру (техническая терминология для технического отчёта, уместная профессиональная/нейтральная лексика для notice/email). В заданиях с явными ограничениями добавить критерий соблюдения prompt и безопасности. Для каждого задания определить конкретные обязательные смысловые пункты и дескрипторы 0/1/2; общий каркас рубрики можно сохранить.

Пилотные JSON, банки вопросов, Google Sheets и Apps Script не изменялись.


## Written-task rubric audit — C1/C2 completion (2026-11-16)

The remaining 60 written Task 10 prompts were inspected in C1-S1, C1-S2, C2-S1 and C2-S2 (15 variants per slot). Together with the previously inspected C3-S1, C3-S2, C4-S1, C4-S2, C5-S1 and C5-S2 sets, this completes the prompt/rubric audit of all 150 written Task 10 variants.

**C2-S1 (15/15) and C2-S2 (15/15):** every variant uses the same generic 8-point rubric with four 0–2 criteria. The prompts range from CV/interview preparation and teamwork to online-source reliability, environmental proposals, scientific claims, air-quality investigation and research-data presentation. The rubric does not define task-specific required content, evidence quality, accuracy of claims, treatment of limitations or source reliability. This is a rubric-design weakness; it does not by itself establish that any individual response key or prompt is incorrect.

**C1-S1 (15/15):** variants 8, 9 and 15 address workshop/laboratory safety, safe equipment use and a low-voltage training circuit. Their generic criteria do not explicitly assess safety-critical correctness or whether the response avoids unsafe advice. Variant 9 also specifies “tools and measurement vocabulary” although the prompt asks about safely using a simple tool or piece of equipment; the vocabulary criterion should be aligned with the actual task. Variants 11–15 likewise cover research, teamwork, aviation-workshop visits, placement and electrical safety but retain generic criteria that do not identify required elements or factual/safety constraints.

**C1-S2 (15/15):** all variants use the same generic 8-point rubric despite covering directions, borrowing equipment, transport, public services, events, weather, food/allergies, email, consumer rights, volunteering, exhibitions, source evaluation, work placement and presentations. The rubric does not explicitly assess task-specific accuracy (for example, allergy-information checks, reporting a faulty product, reliable referencing, or required email/presentation components).

**Cross-set conclusion:** the 150 written tasks have now all been inspected for prompt/rubric alignment. The recurring 2+2+2+2 rubric is too broad to ensure consistent marking across materially different tasks. A revised rubric should retain a clear point ceiling but define task-specific content requirements and observable 0/1/2 descriptors; add technical/factual accuracy and safety/evidence criteria where relevant; align vocabulary criteria to the prompt; and state how word-count deviations affect scoring. Language accuracy should remain distinct from subject-matter correctness. Safety-critical or specialist technical criteria require review by an appropriately qualified subject-matter expert.

This audit records findings only. No pilot JSON, answer key, protected bank, Google Sheet or Apps Script was changed. All 150 variants remain pilot materials pending editorial and subject-matter review, formal approval and controlled acceptance testing.


## Ordering-task audit — C1/C2 completion (2026-11-16)

The remaining Task 9 ordering items were inspected in C2-S1, C2-S2, C1-S1 and C1-S2 (15 variants per slot). Findings below distinguish clear prompt/key defects from sequences that need context or qualified subject-matter review.

**C2-S1:** V01-V04 prompts list four actions separated by semicolons but do not explicitly instruct the learner to arrange them. The same actions are repeated in the options. This is a prompt-format defect, even where the intended key appears plausible. V05-V15 explicitly ask learners to put stages in a sensible/logical order; no unequivocally incorrect key was established in this pass. V06 (part-time work) and V11 (study visit) may admit alternative practical sequences depending on context, so the prompt should define the scenario more precisely if a single unique order is required.

**C2-S2:** all 15 prompts explicitly request a logical order. The reviewed keys are broadly plausible. These items concern environmental choices, online evidence, renewable energy, security messages, transport, air quality, scientific claims, energy saving, digital footprints, recycling, consumer choices, climate adaptation, research data, community activity and change communication. Some stages may overlap in real projects, but no clear key reversal was established from the prompt alone. For tasks involving scientific evidence or environmental/engineering decisions, specialist review should confirm that the proposed sequence is pedagogically and factually sound.

**C1-S1:** V01-V10 have explicit ordering instructions and generally plausible keys. V08 (safe workshop task) should be reviewed by a workshop safety specialist: the relationship between checking the work area and putting on required PPE may depend on local entry rules and the specific hazard assessment. V09 (measurement) should be checked against the actual measuring instrument and its required preparation/zeroing/calibration; the current sequence moves directly from switching on and selecting a unit to measurement. V11-V15 contain clear key problems: V11 starts by writing the report before choosing a topic and finding/checking sources; V12 reviews a finished design before agreeing the goal, allocating tasks and preparing/checking the work; V13 places the safety briefing before arrival at the entrance; V14 reviews completed work before reporting to reception and receiving supervisor instructions; V15 places instructor checking before the circuit is connected, then places switching off the supply before changes after the connection and security check. V15 is safety-critical and must not be “corrected” by inventing a generic wiring procedure; replace it with a scenario aligned to the institution's approved isolation and supervision procedure and have a qualified electrical instructor approve it.

**C1-S2:** V01-V15 prompts are malformed as instructions: each prompt is simply four semicolon-separated actions, without saying that the learner must put them in order. The options repeat the same actions. Rewrite every prompt as an explicit instruction (for example, “Put the steps in the correct order”) and avoid duplicating the ordered list in the prompt. V01-V10 and V12-V15 have generally plausible intended sequences, but the current presentation weakens the task construct. V11 places “Receive the safety briefing” before “Agree the volunteer task”; this may be appropriate in some supervised settings but is not a universal order, so specify when the task is agreed and who authorizes it. V07 (allergy information) should be checked to ensure that the sequence does not imply that selecting a meal before informing staff is safe for a person with an allergy; require staff confirmation of allergen suitability before the meal is selected/served.

**Cross-set conclusion for this stage:** the four newly inspected sets contain clear prompt-format defects in C2-S1 V01-V04 and C1-S2 V01-V15, plus clear sequence/key errors in C1-S1 V11-V15. Safety-related sequences C1-S1 V08/V09/V15 and C1-S2 V07/V11 require qualified review and should not be treated as approved operational instructions. C2-S2 had no unequivocally incorrect key identified in this pass. No pilot JSON, answer key, protected bank, Google Sheet or Apps Script was changed.


## Аудит аудирования: C1-S1, C1-S2, C2-S1, C2-S2 (задания 1–2)

Проверены задания 1–2 и встроенные аудиотексты во всех 60 вариантах четырёх наборов (15 вариантов на набор). Сверялись формулировка вопроса, аудиотекст, варианты ответа и индекс ключа.

### Подтверждённые ошибки ключей — C1-S1

- V12, задание 1: аудио требует завершить проект к следующему вторнику; ключ 0 выбирает «At the end of the month». Правильный вариант — «By next Tuesday», индекс 2.
- V13, задание 2: автобус отправляется в 08:15, прибыть нужно за десять минут до отправления. Ключ 1 («At eight fifteen exactly») неверен; правильный вариант — «At eight oh five», индекс 3.
- V14, задание 1: в аудио студенту велено спросить на ресепшене Ms Patel. Ключ 0 («Mr Green») неверен; правильный вариант — «Ms Patel», индекс 1.
- V14, задание 2: при задержке нужно позвонить на ресепшен. Ключ 1 («Send no message») неверен; правильный вариант — «Telephone reception», индекс 2.

Остальные проверенные задания 1–2 C1-S1 (V01–V11, V15) согласуются с аудиотекстами по ключам.

### Несовпадение вопроса и аудио — C2-S1

- V15, задание 2: вопрос спрашивает о техническом справочнике для совещания по планированию обслуживания, тогда как аудио описывает вводный инструктаж перед практикой и просит принести копию соглашения о практике. Ключ 1 соответствует аудиотексту, но не формулировке вопроса. Требуется согласовать вопрос и аудио; простая смена ключа проблему не решит.

### Качество дистракторов и формулировок

- В C2-S1 V01 задание 2 спрашивает о двух вещах («Which two things»), но реализовано как один выбор пары. Это можно оставить как single-choice только при условии, что все варианты представляют сопоставимые пары; желательно явно сформулировать вопрос как выбор пары.
- В C2-S1 и C2-S2 часто встречаются отвлекающие варианты вроде «On Friday», «Next month», «After the event» в вопросах о документах, материалах, действиях и предметах. Они не параллельны правильному ответу ни грамматически, ни по смысловой категории и делают ответ угадываемым без понимания аудио.
- В C1-S2 V15 задание 1 правильный вариант относится к теме безопасного использования цифрового оборудования, а три других варианта — названия мест. Дистракторы тематически несопоставимы.
- В остальных проверенных заданиях C1-S2 и C2-S2 ключи соответствуют аудиотекстам; иных однозначных ошибок ключа в этой выборке не установлено.

### Рекомендации

1. Исправить четыре ключа C1-S1 V12/V13/V14 и согласовать вопрос/аудио C2-S1 V15.
2. Переработать дистракторы: все четыре варианта должны отвечать на вопрос в одной грамматической форме и принадлежать одной смысловой категории (время, место, документ, действие, причина и т. п.).
3. Для вопросов с множественным требуемым содержанием использовать явное «Which pair/set…?» с равноценными парами либо отдельный формат множественного выбора с несколькими ключами.
4. Не менять ключи только ради стилистического улучшения: сначала сверять их с аудиотекстом и формулировкой задания.

**Граница аудита:** проверены только задания 1–2 указанных 60 вариантов. Пилотные JSON, ключи, банки, Google Sheets и Apps Script не изменялись; замечания зафиксированы в аудиторском документе.


## Аудит аудирования: C3-S1 (задания 1–2)

Проверены задания 1–2 и аудиотексты во всех 15 вариантах C3-S1. В этой выборке однозначных расхождений между ключами и аудиотекстами не обнаружено: выбранные ответы подтверждаются записью.

### Замечания к качеству заданий

- В большинстве заданий 2 варианты ответа не соответствуют типу вопроса: например, на вопрос о документе, материале, месте или действии предлагаются временные маркеры «On Friday», «Next month», «After the event». Это делает дистракторы неравноценными и снижает диагностическую ценность аудирования.
- V11, задание 2: формулировка спрашивает о подготовительном материале перед «technical lesson», тогда как аудио — об отраслевой встрече с приглашённым представителем авиационной организации. В записи нужно подготовить один вопрос о навыках для начальной должности. Ключ «One question about entry-level skills» по смыслу верен, но формулировку вопроса необходимо привести в соответствие с контекстом встречи.
- V13, задание 2: вопрос просит назвать несколько реквизитов сертификата, а ответ оформлен одной составной опцией. Такой формат допустим только если все дистракторы также являются сопоставимыми наборами реквизитов; текущие временные дистракторы этому не отвечают.
- V10, задание 1 и V02, задание 2 также проверяют несколько элементов одним вариантом-перечнем. Следует сохранить single-choice только при наличии четырёх равноценных перечней.

### Рекомендации

1. Сохранить проверенные ключи, так как в просмотренной выборке они подтверждаются аудиотекстами.
2. Переписать дистракторы в единой категории: время к вопросу о времени, место к месту, документ к документу, действия к действиям, перечни объектов к перечням объектов.
3. Исправить формулировку C3-S1 V11 задания 2, чтобы она описывала отраслевую встречу, а не технический урок.
4. Для составных ответов использовать четыре параллельных набора элементов либо настоящий множественный выбор.

**Граница аудита:** проверены только задания 1–2 пятнадцати вариантов C3-S1. Пилотные JSON, ключи, банки, Google Sheets и Apps Script не изменялись.


## Аудит задания 8: все 10 наборов, 150 вариантов

Проверено задание 8 во всех 150 пилотных вариантах C1-S1…C5-S2: соответствие ситуации вопросу, корректность ключа, естественность и правдоподобие дистракторов.

### Подтверждённые дефекты

- **C4-S2 V11–V15 — повреждённые формулировки.** Вопросы выглядят как склейка обрывка правильного ответа с общей фразой «What should you say?» / «What is the best response?»: V11 «Check the device register and What should you say?», V12 «Could we update the model What is the best response?», V13 «Please check the measurement method What should you say?», V14 «Could we confirm the unit's What is the best response?», V15 «The cause has not yet What should you say?». Эти пять заданий нельзя считать валидными в текущем виде; вопрос необходимо восстановить по задуманной коммуникативной ситуации и сверить с вариантами.
- **C1-S1 V08 и V10 — дублирование:** оба задания описывают непонимание инструкции по безопасности и предлагают один и тот же правильный ответ о повторном объяснении.
- **C5-S1 V06–V10 — шаблонные дистракторы:** повторяется набор «I will guess and continue» / «The detail is not important» / «I will copy an unrelated record». Повторяемость и явная абсурдность снижают качество проверки.
- Во многих наборах (особенно C1-S1, C1-S2, C2-S1, C3-S1, C3-S2 и C4-S1) неверные варианты заведомо неграмматичны, грубы, нелогичны или явно небезопасны. Это делает выбор правильного ответа слишком лёгким и не проверяет различение нескольких реалистичных реплик.

### Результаты проверки ключей

- Во всех заданиях, где формулировка была полноценной, правильный вариант с индексом 1 соответствует описанной ситуации.
- Для C4-S2 V11–V15 индекс 1 нельзя считать окончательно подтверждённым: вопрос повреждён и требует восстановления.
- В этой выборке не выявлено иных однозначных ошибок индекса правильного ответа.

### Рекомендации

1. Восстановить C4-S2 V11–V15, не подменяя вопрос случайной общей фразой; проверить семантическое соответствие вопроса и правильной реплики.
2. Заменить дублирование C1-S1 V08/V10 одной из ситуаций на самостоятельный коммуникативный сценарий.
3. Переписать дистракторы так, чтобы они были грамматически правильными, близкими по длине и правдоподобными для данной ситуации, но содержали конкретную коммуникативную ошибку (неверная степень вежливости, неполный запрос, неуместное уточнение, неверная процедура).
4. Исключить заведомо небезопасные советы в качестве очевидных «неправильных» ответов, если цель — проверить профессиональную коммуникацию, а не распознавание грубой опасности.
5. Убрать повторяющиеся универсальные дистракторы и обеспечить вариативность ситуаций и формулировок между вариантами.

**Граница аудита:** проверено только задание 8 во всех 150 вариантах. Пилотные JSON, ключи, банки, Google Sheets и Apps Script не изменялись.

## Targeted remediation — functional task 8 (2026-11-16)

The previously recorded task-8 defects were corrected in the individual pilot JSON files:

- **C4-S2 V11–V15:** replaced the malformed prompt fragments with complete questions about checking device/network records, verifying model updates, validating measurements, confirming unit service status and reporting an unconfirmed fault. The answer options now address the same technical decision as each prompt; the intended keys were retained with updated indices where the options were reordered.
- **C1-S1 V10:** replaced the near-duplicate safety-instruction clarification item with a distinct scenario about identifying the emergency-stop control before a machine is started. The key now points to asking the instructor before starting.
- **C5-S1 V06–V10:** replaced the repeated generic distractors with context-specific alternatives about task applicability, incomplete handover, inspection discrepancies, evidence-based fault comparison and document revision control. Correct options were repositioned across the five items.

The eleven individual pilot files were updated and committed. This is a targeted correction of the task-8 findings only; it does not approve the remaining tasks or rubrics in these variants. The combined 150-variant registry was synchronized with these eleven changes; all eleven task-8 records were compared against their individual pilot files and matched. The full 150-variant editorial review remains a release gate. No protected bank, Google Sheet or Apps Script was changed.

## Targeted remediation — ordering tasks (2026-11-16)

The ordering-task findings from the C1-S1, C1-S2 and C2-S1 sample audit were addressed in the individual pilot files and synchronized to the combined registry:

- **C1-S1 V11–V14:** corrected the keyed sequence so topic selection and source checking precede report writing; project goals and task allocation precede preparation and design review; arrival precedes the safety briefing and guided visit; and reception/supervisor instructions precede work review and daily logging.
- **C1-S1 V15:** replaced the unsafe, internally contradictory circuit sequence with a communication/reporting scenario for a supervised low-voltage training session. It assesses stopping and alerting the instructor, describing the observation, waiting for direction and recording the event. It gives no wiring or repair procedure.
- **C1-S2 V01–V15:** rewrote all fifteen prompts as explicit ordering instructions. V07 now requires the learner to tell staff about an allergy and verify allergen information before choosing a suitable meal. V11 now states that the coordinator has confirmed the volunteer task before the safety briefing and activity.
- **C2-S1 V01–V04:** rewrote the four career/job-application prompts as explicit ordering instructions; their existing step sequences were retained.

The 24 individual pilot records were updated. Their corresponding task-9 records were synchronized into the combined 150-variant registry. The previously identified C1-S1 V08/V09 specialist-review flags remain open; this remediation does not approve operational safety or measurement sequences. No protected bank, Google Sheet or Apps Script was changed.

### Answer-position regression correction — C5-S1 V06/V08/V09/V10

The first CI run after task-8 remediation detected that the new correct-option indices changed the required per-variant A/B/C/D balance in four C5-S1 variants. The intended answer text was preserved. In V06, V08 and V10, one grammar item's options were reordered and its key index updated; in V09, the functional-response correct option was repositioned and the grammar item's original position restored. The four affected task records were synchronized in the combined registry. A direct audit of all 15 C5-S1 variants then confirmed A=2, B=2, C=2, D=2 in every variant, with the individual task-5/task-8 records matching the registry. This correction addresses the automated regression; it does not certify the grammatical distractors as editorially approved.

### Follow-up regression correction — C1-S1 and C4-S2

The next CI pass exposed the same answer-position balance constraint in C1-S1 V10 and C4-S2 V11, V13, V14 and V15 after the functional-item keys were repositioned. In each affected variant, an existing single-choice item was reordered without changing its correct answer text, restoring the required A=2, B=2, C=2, D=2 distribution. The affected records were synchronized in the combined registry and directly compared with their individual pilot files. The C5-S1 V06 prompt was also aligned with the regression test's approved task-applicability wording. The direct check confirms balanced positions in all six affected variants and matching registry records; the subsequent GitHub Actions run #2537 (commit `c558c15a901f7218efea0bcbba5422dc6a2ee590`) completed successfully, including the English assessment regression tests and real-browser A4/PDF, constructor, certificate and English final-exam audits.

## Written-task rubric remediation — C1-S1 V01–V15 (2026-11-16)

All 15 written-task rubrics in C1-S1 were rewritten to define task-specific content requirements and observable marking criteria, then synchronized into the combined registry:

- V01–V07: criteria now match the requested personal introduction, college-day description, vocabulary-learning methods, classmate email, after-class activity, group study and college project.
- V08–V10: safety-related criteria explicitly assess the requested rules/PPE, safe-use explanation, workshop preparation and clarification of unclear instructions. The rubric for V09 no longer requires measurement vocabulary that the prompt does not request.
- V11–V14: criteria now assess research/source recording, teamwork and deadline communication, safe workshop-visit behaviour, and first-day work-placement communication/logging.
- V15: criteria explicitly assess instructor-approved information, supervision, reporting damaged equipment and avoiding unapproved connection/repair instructions.

Each rubric retains an 8-point ceiling with four 0–2 criteria. Language accuracy is assessed separately from factual/safety correctness. The 15 individual records and their registry entries were updated; this is a first completed rubric group, not approval of the remaining 135 written tasks or the full exam set. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C1-S2 V01–V15 (2026-11-16)

All 15 written-task rubrics in C1-S2 were rewritten and synchronized into the combined registry. The criteria now explicitly assess the requested route/directions, equipment borrowing, transport comparison, town service, event report, weather contingency, allergy-aware food choice, tutor email, consumer complaint, invitation, volunteering, exhibition project, source evaluation, work-placement preparation and team presentation. V07 specifically requires staff confirmation of allergen suitability; V09 distinguishes checking an item from reporting a fault; V13 assesses source reliability and reference recording. Each rubric retains four 0–2 criteria (8 points total), separating content, task-specific communication, language and vocabulary/mechanics. All 15 individual rubric records match the registry. This completes two of the ten written-rubric groups; the remaining 120 written tasks still require the same review. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C2-S1 V01–V15 (2026-11-16)

All 15 written-task rubrics in C2-S1 were rewritten and synchronized to the combined registry. They now assess the actual task requirements for career-fair introductions, evidence-backed CV skills, interview preparation, post-college route comparisons, skills portfolios, part-time applications, team projects, digital-file organisation, waste reduction, visitor assistance, study-visit enquiries, study/rest planning, lost-property reports, optional-course comparisons and supervisor introductions. Digital-file handling includes sensible protection of study materials; workplace and visitor tasks assess polite, appropriate communication. Each rubric retains four 0–2 criteria (8 points total) and separates content, communication, language and vocabulary/mechanics. This completes three of the ten written-rubric groups; 105 written tasks remain to be reviewed. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C2-S2 V01–V15 (2026-11-16)

All 15 written-task rubrics in C2-S2 were rewritten and synchronized into the combined registry. Criteria now explicitly address plastic-waste arguments, source reliability, renewable-energy comparisons, online privacy, transport proposals, local air-quality investigation, scientific-claim checking, college energy saving, digital footprints, recycling plans, responsible purchasing, heat-resilient public spaces, research-data presentation, safe volunteering and digital-system rollout. The rubrics specify task-relevant evidence, limitations, practical steps or evaluation measures instead of relying on generic content/grammar wording. Each retains four 0–2 criteria (8 points total). This completes four of the ten written-rubric groups; 90 written tasks remain. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C3-S1 V01–V15 (2026-11-16)

All 15 C3-S1 technical-writing rubrics were rewritten and synchronized with the combined registry. Criteria now match material selection against drawing/service conditions, dimension reading and revision control, assembly drawings/parts lists, workshop induction, inventory discrepancies, illustrated-parts identification, tolerances and inspection records, labels/symbols, non-conformity reporting, measuring-tool selection, maintenance-role communication, technical emails, material certificates, notices and component traceability. Safety and quality-related rubrics assess evidence-based reporting and prohibit changing original results or making unauthorised alterations. Each rubric retains four 0–2 criteria (8 points total). This completes five of the ten written-rubric groups; 75 written tasks remain. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C3-S2 V01–V15 (2026-11-16)

All 15 C3-S2 technical-writing rubrics were rewritten and synchronized to the combined registry. The criteria now address lathe components, CNC block/G00/G01 concepts, turning/milling/drilling comparisons, cutting-tool identification, workholding/datums, workshop safety reporting, process planning, non-conformity records, CNC revision/machine references, production-delay notices, drawing revision control, controller documentation, conceptual toolpaths, process capability and evidence-based problem solving. CNC-related criteria explicitly remain conceptual and do not ask students to produce machine-specific operating instructions. Quality rubrics preserve original measurement data and distinguish evidence from assumptions. Each rubric retains four 0–2 criteria (8 points total). This completes six of the ten written-rubric groups; 60 written tasks remain. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C4-S1 V01–V15 (2026-11-16)

All 15 C4-S1 electrical/electronics writing rubrics were rewritten and synchronized into the combined registry. Criteria now address series/parallel circuit concepts, measurement records and test points, component functions and documentation, power/energy comparisons, factual fault reports, transformer nameplates, equipment labels and warnings, symptom-versus-cause reporting, power-supply specifications, cable identification, sensor data sheets, relay contact arrangements, fault descriptions, analogue/digital signals and revision-controlled project reviews. Safety-sensitive rubrics require checking approved documentation and distinguishing observations from unconfirmed causes; they do not provide live electrical work instructions. Each retains four 0–2 criteria (8 points total). This completes seven of the ten written-rubric groups; 45 written tasks remain. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C4-S2 V01–V15 (2026-11-16)

All 15 C4-S2 systems/automation writing rubrics were rewritten and synchronized with the combined registry. Criteria now assess communication-system stages, computer-system roles, sensor/controller/actuator relationships, PLC model and I/O documentation, data summaries, protocol/version functions, software-version reporting, PLC signal references, data-log timestamps/units, control-system security, industrial-IoT data paths, digital twins, condition monitoring, ground-support equipment status records and incident reporting. Security and incident criteria explicitly discourage credential sharing, bypassing controls and presenting unconfirmed causes as facts. Each rubric retains four 0–2 criteria (8 points total). This completes eight of the ten written-rubric groups; 30 written tasks remain. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C5-S1 V01–V15 (2026-11-16)

All 15 C5-S1 aviation-maintenance written-task rubrics were rewritten and synchronized with the combined registry. The four 0–2 criteria now contain task-specific, observable descriptors:

- V01–V05: maintenance planning and coordination; inspection findings and acceptance criteria; diagnostic evidence versus hypotheses; technical-manual applicability; revision control and obsolete-copy prevention.
- V06–V10: aircraft identity/configuration and publication applicability; handover status versus formal records/sign-off; non-conformance reporting and corrective-action effectiveness; reliability evidence versus assumptions about common causes; controlled technical publications.
- V11–V15: non-conformance report content and finding/cause distinction; model/serial/configuration checks; concise technical briefings with explicit uncertainty; service-notice applicability and confirmation; evidence-based supplier-quality evaluation.

Each rubric retains four criteria (8 points total), with explicit 0/1/2 descriptors and language scoring that prioritises intelligibility and task-appropriate vocabulary. Safety-sensitive items assess checking approved data, recording facts and escalating uncertainty; they do not ask learners to perform or prescribe maintenance actions. The earlier 80–100 versus 100–120 word split is retained and should be assessed consistently against the stated prompt. This completed the C5-S1 portion; the final C5-S2 group was then remediated separately below. No protected bank, Google Sheet or Apps Script was changed.

## Written-task rubric remediation — C5-S2 V01–V15 (2026-11-16)

All 15 C5-S2 advanced technical-writing rubrics were rewritten and synchronized with the combined registry. The four 0–2 criteria now assess the specific demands of each task: handover accuracy and record integrity; hazard/consequence/control/review responsibility; inspection evidence and trend interpretation; intermittent-fault chronology and uncertainty; applicability/approval/distribution controls; evidence-based replacement comparisons; professional supplier clarification emails; quality-improvement results and limitations; continuity and traceability of records; cross-disciplinary dependencies; label/record discrepancy and authorised correction; audit findings linked to objective evidence; unresolved system interfaces; measurable process improvement; and synthesis of conflicting technical sources.

Each rubric retains four observable criteria (8 points total), distinguishes evidence from inference, and rewards explicit handling of uncertainty rather than unsupported recommendations. Safety-sensitive criteria assess documentation, coordination and escalation, not live maintenance procedures. This completes all ten written-rubric groups: 150/150 written task rubrics now have task-specific 0/1/2 descriptors and are synchronized with the combined registry. No protected bank, Google Sheet or Apps Script was changed.

