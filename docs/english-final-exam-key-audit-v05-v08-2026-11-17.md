# English final exam key audit — variants V05–V08

Date: 2026-11-17  
Branch: `feature/english-course-assessment-architecture`  
PR: #125

## Scope

Reviewed the 40 pilot JSON files for variants V05–V08 across all ten slots:
C01-S01, C01-S02, C02-S01, C02-S02, C03-S01, C03-S02, C04-S01, C04-S02, C05-S01, C05-S02.

All 40 files were retrievable and parsed as JSON; each contained 10 tasks. This is a structural/file-integrity check, not a claim that every answer in all 400 tasks has received full subject-matter validation.

## Confirmed answer-key defects

The following defects were manually checked against the reading passages or listening scripts and their answer options.

| File / task ID | Current key (0-based) | Correct option (0-based) | Finding |
|---|---:|---:|---|
| `c02-s02-v05` / `c2s2v05_r01` | 2 | 1 | The passage says the bus timetable did not match lesson times. |
| `c02-s02-v05` / `c2s2v05_r02` | 3 | 2 | Safety assessments must be completed before the council decides. |
| `c02-s02-v06` / `c2s2v06_r01` | 2 | 1 | Readings were taken at the same time to make the comparison fair. |
| `c02-s02-v06` / `c2s2v06_r02` | 3 | 1 | The study showed a local pattern but could not prove traffic was the only cause. |
| `c02-s02-v07` / `c2s2v07_l02` | 1 | 0 | The listening script says the librarian will show students how to find the original study. |
| `c02-s02-v07` / `c2s2v07_r01` | 2 | 1 | The social media post had no reference to a scientific study. |
| `c02-s02-v07` / `c2s2v07_r02` | 3 | 1 | The note says an image alone is not evidence and broad claims need reliable research. |
| `c02-s02-v08` / `c2s2v08_r01` | 2 | 1 | The audit identified computer rooms remaining fully lit after the last lesson. |
| `c02-s02-v08` / `c2s2v08_r02` | 3 | 1 | The team introduced a closing checklist for the final group. |

All indices above are zero-based, matching the JSON `correctIndex` convention.

## Corrections applied and synchronized

The combined registry was retrieved by blob SHA after the path-based file endpoint returned an empty payload. The nine corrections were applied to the four source JSON files and to the corresponding embedded tasks in `docs/english-final-exam-registry-v1-pilot.json`.

A follow-up read verified all nine IDs: each source `correctIndex` equals the expected answer index, exactly one matching registry task exists for each ID, and the registry value equals the source value. Result: **9/9 source-to-registry parity checks passed**.

The changes were made only on the PR feature branch. No production bank, protected Google Sheet, Apps Script deployment, or production deployment was touched.

## Structural validation of the 40-file slice

All 40 V05–V08 files across the ten slots were re-read after the corrections and parsed successfully. Each has exactly 10 tasks, 20 total points, and the expected type distribution: 6 single-choice, 1 multiple-choice, 1 short-text, 1 ordering, and 1 written task. The nine corrected keys were also rechecked against the combined registry: 9/9 pass.

This structural pass does not constitute a full semantic review of all 400 tasks. The remaining single-choice keys, multiple-choice keys, short-text accepted answers, ordering keys, and written rubrics still need content-level review.

## Follow-up: C02-S02 V05–V08 option-position balance and semantic spot-check

The first CI run on the pre-follow-up HEAD failed two assertions in `scripts/english-semester-assessment.test.mjs`: the C02-S02 variants no longer met the required single-choice answer-position distribution after the nine content corrections. This was a test-detected balance issue, not evidence that the corrected reading answers were wrong.

The option order was adjusted without changing the correct answer text. Source JSON and the embedded registry variants were updated together for:
- V05: `c2s2v05_f01` moved to option D.
- V06: `c2s2v06_r01` moved to option C; `c2s2v06_f01` moved to option D.
- V07: `c2s2v07_g01` moved to option C; `c2s2v07_f01` moved to option D.
- V08: `c2s2v08_r01` moved to option C; `c2s2v08_f01` moved to option D.

Post-update checks confirm each of V05–V08 has the expected single-choice key-position distribution `[2, 2, 1, 1]`; all four source payloads match their embedded registry variants exactly (4/4 parity). The required multiple-choice key pair remains `[2, 3]`.

A content-level review was completed for all multiple-choice, short-text, ordering, and written tasks in the ten V05 files (40 tasks), and the same 40-task slice in V06. The C02-S02 V06–V08 non-single-choice tasks (12 additional tasks) were also checked. Two further defects were found and corrected: (1) C01-S01 V05 ordering `c1s1v05_o01` placed room preparation before inviting students; the corrected order is discuss ideas → choose date/place → invite students → prepare the room. (2) C02-S01 V06 multiple-choice `c2s1v06_m01` incorrectly marked “Ignoring instructions” as a professional habit; the key is now [0, 2], “Asking when a task is unclear” and “Arriving on time”. Both source JSON files and their embedded registry variants were updated. Other reviewed distractor sets, accepted answers, sequences, and rubrics did not show further defects in these slices. This remains a partial semantic review, not a full review of every task in all 40 V05–V08 files.

The CI run #3002 completed successfully on the option-balance correction commit (`56849ee`). A later run #3004 was triggered for the subsequent content correction and was still in progress at the time of this update. The latest HEAD must be checked again before declaring CI green.

## Remaining validation

1. Continue semantic review of the single-choice items and remaining tasks in the 40 V05–V08 files; the 11 confirmed key/ordering corrections and the reviewed 92 non-single-choice tasks do not imply all 400 tasks are error-free.
2. Recheck CI run #3002 on the latest HEAD and address any remaining failures.
3. Continue the next variant slice only after the V05–V08 checks are complete.
