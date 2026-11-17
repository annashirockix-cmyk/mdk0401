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

## Change-control limitation

No pilot JSON source file was changed in this pass. The combined registry `docs/english-final-exam-registry-v1-pilot.json` was requested from the PR branch, but the GitHub file-content endpoint returned an empty payload (blob SHA `ac9d7a8005b182eb1b1d0c90006e540973794193`). Therefore its corresponding embedded exam entries could not be inspected or safely synchronized.

Changing the individual source JSON files without updating and verifying the combined registry would create a known source/registry parity risk. The nine corrections are therefore recorded as confirmed blockers, not silently patched in only one representation.

## Next required work

1. Retrieve the combined registry through a supported route and locate the C02-S02 V05–V08 entries.
2. Check all answer keys in the remaining V05–V08 files against their source passages/scripts; the nine defects above do not imply the other 391 tasks are error-free.
3. Apply the nine key corrections to both source JSON files and the combined registry in one controlled change.
4. Run JSON/schema checks, source-to-registry parity checks, and PR CI.

No production bank, protected Google Sheet, Apps Script deployment, or production deployment was touched.
