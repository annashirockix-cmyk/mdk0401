# PR #125 — release-gate status (2026-11-16)

## Verified on the current head

- Head: `745942a3c1525bf3b68ed24f4433ba7e5d332834`.
- GitHub Actions run `43947026282`: **success**, all 25 job steps passed. This includes syntax/contract checks, assessment answer-key isolation, five-year English runtime, workbook PDF/A4, course-constructor round-trip, certificate print, and the real-browser English final-exam audit.
- PR #125 remains open and Draft. It has 247 changed files, no submitted PR reviews, no issue comments, and no inline review threads.
- English final-exam attempt creation shuffles each option array server-side, stores the option-index map with the attempt, restores the same order on resume, and maps submitted positions back to the protected key. Regression tests cover this mapping. The browser never receives teacher keys or rubrics.
- The teacher written-review queue, scoring/feedback save, student result retrieval, and student-visible feedback are implemented and covered by automated/browser tests.
- No Google Sheet, protected bank, Apps Script deployment, production import, merge, or release was performed.

## Content packages that exist but are not approved for release

### Semester banks

- Basic English: a 200-item independently authored draft pool exists in ten batches. It is not mapped to the four Basic course-semester slots and is not approved against the exact Belova textbook edition or the authoritative work programme.
- Technical English: a 200-item draft pool exists in ten batches. Structural checks and key-position balance pass, but it is not approved against the six Technical course-semester slots, the official programme, or the active protected VPR variants.
- Both tracks still need a complete semantic overlap review against each other, the protected VPR banks and current lesson/practice banks. Exact-stem checks alone are not enough.
- Technical terminology flags still requiring a qualified specialist include Q48 (machine/coordinate convention), Q62 (electrical isolation), Q74 (use of “shall” in a specification), and Q194 (aviation “approved data”).

### Final-exam pilot

- The pilot registry contains 150 variants across ten course-semester slots, 15 per slot, with 1,500 tasks total. Each variant is structurally complete and marked `pilot_for_editorial_review`; the server intentionally rejects pilot status for import.
- The full 150-variant content review is not complete. Sample audits found recurring weak wrong-category distractors, and some answer-key or wording defects. Examples still requiring source-and-registry correction and independent key verification include:
  - Targeted corrections now committed and synchronized between the individual pilot JSON and combined registry: C1-S1 V13 Listening 2 (08:05 key); C1-S1 V14 Listening 1 (Ms Patel), Listening 2 (telephone reception), and the work-placement sequence; C2-S1 V15 Listening 2 (document-focused prompt and plausible document distractors); C3-S2 V15 (proposal-only definition/key); C5-S2 V15 (synthesis-only definition/key).
  - A regression test now verifies the corrected keys, wording, source/registry equality and continued pilot-only status. The remaining 150-variant review is still required; this targeted pass is not full editorial approval.
- Some earlier audit notes are stale because the corresponding pilot files have since been corrected (for example C4-S2 V13/V14 malformed prompts, C5-S1 V13 prompt mismatch, C1-S1 V15 safety-ordering prompt, and several V15 short-answer alternatives). Reconcile the audit narrative with the current source JSON before final sign-off.
- The combined registry and individual pilot JSON files must be updated together. Do not correct only an individual file and leave the registry inconsistent.

## Required release gates

1. Obtain the approved five-year English work programme, contact hours, learning outcomes and exact Belova textbook edition; map Basic and Technical items to the correct course-semester slots.
2. Complete a full item-by-item English-methodologist review and qualified technical/aviation/electrical review; verify answer keys, accepted short answers, distractors, CEFR/difficulty targets, and duplicates against protected VPR and practice banks.
3. Finish the 150-variant pilot review, correct every confirmed defect in both individual JSON and combined registry, and run full registry consistency/answer-key tests.
4. Complete an independent review/sign-off; do not treat structural CI as subject approval.
5. Test the approved payload in a non-production spreadsheet, read it back, verify server-only keys/rubrics and student sanitization, then run student and teacher end-to-end acceptance tests.
6. Only after explicit approval, perform a controlled production import and post-import verification. This remains outside the current work and has not been performed.
7. Obtain PR review/approval. Keep PR Draft until content and release gates are closed.

## Decision

**Code/runtime CI is green; educational content approval and controlled bank release are not complete.** The PR is not production-ready solely because CI passed.


## Final CI verification after targeted corrections

- Latest code/test head: `f43affca229a009f7024d75da1cf055b56e2a95e`.
- GitHub Actions run `43948534307`: **success**, all 25 steps passed, including the English runtime regression suite and real-browser English final-exam audit.
- The answer-position balance regression caught an intermediate imbalance when corrected answer indices were first changed. The correction was refined by moving the correct option text into the existing balanced key position; source files and combined registry were synchronized, and the latest full CI passed.
- PR remains Draft. Content approval, official curriculum/textbook alignment, full editorial review, protected-bank comparison and controlled test/production import gates remain open.


## Full pilot-source synchronization and option-quality remediation — 2026-11-16

- Rebuilt the combined registry's `variantJSON` entries from all 150 individual source JSON files (the GitHub PR file patches were used as the authoritative branch snapshots). The full-source parity regression now checks all 150 files rather than a handful of examples.
- The complete registry audit identified 64 tasks with duplicate answer options, concentrated in C2-S1 and C2-S2. Replaced the duplicate choices with distinct, context-related distractors in both individual source files and the combined registry.
- The audit also found generic unrelated reading distractors repeated across 85 variants in the combined registry. The individual source files contained authored, topic-matched alternatives; those source variants have now been synchronized into the registry. No generic fallback distractors remain in the Reading 1/2 tasks.
- C5-S1 V01–V15: corrected passage/key mismatches in reading tasks across all 15 variants. The correct response is now in the keyed position, while the A/B/C/D distribution remains unchanged. Regression checks verify both reading answers for all 15 variants and source/registry parity.
- Re-audit after corrections: 150 variants; 1,500 tasks; expected task-type totals (900 single-choice, 150 multiple-choice, 150 short-text, 150 ordering, 150 written); zero duplicate options; zero known generic reading distractors; all 150 variants retain single-choice key-position distribution 2/2/1/1.
- The registry remains `pilot_for_editorial_review`. These are content corrections and automated structural checks, not external methodologist approval or curriculum sign-off.


## Актуальное состояние после полного структурного аудита — 2026-11-16 (последнее обновление)

- Проверен полный набор из 150 вариантов / 1 500 заданий. В каждом варианте: 6 single-choice, 1 multiple-choice, 1 short-text, 1 ordering и 1 written task.
- Во всех вариантах распределение ключей single-choice сохранено как 2/2/1/1 по позициям A/B/C/D; исправления не ухудшили баланс.
- Все 300 заданий Reading 1/2 повторно проверены на точные дубликаты вариантов и известные нерелевантные шаблонные distractors: обнаружено 0 заданий с повторяющимися опциями и 0 заданий с известными generic distractors.
- Исправлены passage/key mismatches C5-S1 V01–V15. Ключи теперь указывают на ответ, подтверждаемый соответствующим текстом; регрессионный тест проверяет оба reading задания во всех 15 вариантах.
- C1-S2 V11–V15 проверены повторно: отвлекающие варианты относятся к теме текста; индивидуальные JSON и combined registry согласованы.
- Автоматический тест полного реестра проверяет 150 исходных JSON против variantJSON общего реестра, уникальность ID, состав заданий, индексы ключей, допустимость ordering permutations, наличие short-text answers и письменных рубрик, а также отсутствие дубликатов опций.
- Исправлена ошибка в шаблоне регулярного выражения теста идентификатора варианта; тест теперь действительно проверяет формат EN-Cx-Sy-Vnn.
- Последний PR HEAD: 356079c9a8a2673e3a7ec60b966b10c04588dd37. GitHub Actions run 43952263443: SUCCESS, все 25 шагов завершились успешно.
- Более ранний run 43952208724 завершился неуспешно на промежуточном состоянии, когда source JSON и combined registry ещё не были синхронизированы. Ошибка выявила расхождение C5-S1 V14; после синхронизации source/registry и уточнения тестов актуальный HEAD прошёл полный CI.
- Эти результаты закрывают структурные проверки и известные точечные дефекты, но не заменяют методическую экспертизу всего содержания. Не подтверждены соответствие утверждённой программе и точному изданию Белова, корректность всех технических утверждений и CEFR-уровней.
- PR #125 остаётся Draft. Нет независимого review approval. Защищённые VPR-банки не изменялись; тестовый или production import, Apps Script deploy, merge не выполнялись.


## Targeted final-exam editorial pass V05–V15 — 2026-11-17

- Reviewed the ten individual pilot JSON files for each variant V05 through V15: 110 variants / 1,100 tasks. This first-pass review focused on task structure, prompt/option fit, distractor category and plausibility, accepted short answers, written-task rubrics and obvious wording defects. It is not a complete second-methodologist review of every assessment decision.
- V05: no blocking defect identified in this pass.
- Corrected 17 listening distractor sets where options did not belong to the semantic category asked for by the prompt:
  - C2-S1 V06;
  - C2-S1 and C2-S2 V07, V08, V09, V10, V11, V12 and V13;
  - C2-S2 V14 and V15.
- Corrected one additional wording defect in C2-S1 V14: changed the distractor pronoun to agree with the male subject.
- For every correction, updated the individual source JSON and the corresponding `variantJSON` in the combined registry in the same branch. The intended correct option remained in its existing keyed position; no answer-key index was changed.
- The revised distractors now match the question type (e.g. actions against actions, documents against documents, locations against locations, timetables against timetables) and remain plausible enough to test comprehension rather than simple category elimination.
- Latest reviewed branch HEAD at the time of this note: `e23c69d685b4826fd3335a7c2fd756646d88d283`. GitHub Actions run `44032712663` / #2943 was in progress at last check; automated English runtime and browser exam checks had passed, with Playwright/Chromium and subsequent browser audits still running.
- Remaining work: complete the run on the final head; perform a focused answer-key/audio-text verification for the amended variants; continue the full editorial review of V01–V15, including all 150 listening scripts, reading passages, objective keys, short-text acceptance sets and written rubrics; obtain independent English-methodologist and technical subject-matter approval. The 110-variant first pass does not certify CEFR level, factual currency, programme alignment or release suitability.
- No protected Google Sheet, active VPR bank, Apps Script deployment, production import, merge or student publication was performed.


## Follow-up editorial pass — Technical pool and final-exam listening V01–V04 (2026-11-17)

### Technical English 200-item draft pool
- Continued the cross-batch semantic recurrence screen and corrected three repeated narrow assessment targets:
  - Q109 now tests measurement uncertainty rather than repeating Q11's definition of instrument calibration.
  - Q122 now tests rework rather than repeating Q78's meaning of non-conformance / out-of-specification.
  - Q132 now tests why a superseded revision may be retained as historical evidence, rather than repeating Q19's check of the current approved revision.
- Correct-answer positions were preserved (Q109 A, Q122 A, Q132 C), and teacher-key rationales were updated. The audit is recorded in docs/english-technical-semester-bank-audit-v1.md §4F.
- These are authoring-draft changes only; they do not modify protected VPR data or student-facing content.

### Final-exam listening prompts V01–V04
- Reviewed the two listening prompts and their option categories in the 40 individual pilot variants V01–V04 across all 10 course/semester slots.
- Found and corrected four distractor sets where options did not match the question's semantic category:
  - C2-S1 V02 Listening 2: document choices replaced temporal phrases;
  - C2-S1 V03 Listening 2: duration choices replaced unrelated time references;
  - C2-S1 V04 Listening 2: location choices replaced temporal phrases;
  - C2-S2 V03 Listening 2: document choices replaced temporal phrases.
- The correct answers remain at index 1 in all four tasks. Individual source JSON files and the combined registry were synchronized; a read-back check confirmed exact option parity for all four amended task IDs.
- This was a focused listening/distractor pass, not a complete review of every reading, grammar, multiple-choice, ordering, short-text or written task in V01–V04. V16–V20 and the full content review remain outstanding.
- PR remains Draft; no protected bank, Google Sheets, Apps Script deployment, production import, merge or student publication was performed.


### Reading answer-key verification in V01–V04 (2026-11-17)
- Reviewed both reading questions and their keys in all 40 V01–V04 variants across the 10 course/semester slots.
- Found three answer-key mismatches in Course 2: C2-S1 V03 Reading 2, C2-S1 V04 Reading 2 and C2-S2 V04 Reading 2. In each case the original key pointed to a distractor rather than the passage-supported answer.
- Reordered the options so the passage-supported answer occupies the existing balanced key position D in all three variants; no answer-position distribution changed. Updated the individual JSON files and combined registry.
- Added a targeted regression test in scripts/english-semester-assessment.test.mjs to assert the three passage-supported answers and their parity between source JSON and registry.
- This closes the focused reading-key pass for V01–V04; it does not constitute a full expert review of every task or a CEFR/programme approval.

- The first CI run after correcting the semantic keys (#2972 on the intermediate HEAD) correctly failed the per-variant answer-position balance check because the initial correction changed key indices without moving the options. The final correction reorders the options while keeping the valid answer at index D; read-back now confirms [2, 2, 2, 2] across the keyed single- and multiple-choice answers for each of the three variants, with source/registry parity. A CI run on the final corrected HEAD is still required.
