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

## Remaining validation

1. Complete answer-key/content review for the other tasks in the 40 V05–V08 files; the nine confirmed defects do not imply the other 391 tasks are error-free.
2. Inspect CI for the latest HEAD. No workflow run was returned for the latest docs-and-source commit at the time of this check; do not treat prior successful CI as validation of the current HEAD.
3. Continue the next variant slice after the current checks are complete.
