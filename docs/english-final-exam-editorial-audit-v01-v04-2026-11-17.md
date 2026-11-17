# English final-exam editorial audit — V01–V04 (2026-11-17)

## Scope

Reviewed the first four pilot variants in each of these five course-semester slots:

- C1-S1
- C1-S2
- C2-S1
- C2-S2
- C3-S1

Total: 20 variants / 200 tasks. The individual source JSON files were read from the PR head. This pass combines a structural contract check across all 20 files with focused content review; it is not a full second-methodologist approval.

## Structural results

All 20 variants passed the following local checks:

- 10 tasks per variant.
- Task mix: 6 single-choice, 1 multiple-choice, 1 short-text, 1 ordering and 1 written task.
- 20 points per variant.
- Single-choice and multiple-choice answer indices are within the available option arrays.
- No exact duplicate answer options within the checked tasks.
- Every written task has a rubric.

No structural blocker was found in this 20-variant sample.

## Focused content review

### C1-S1 — V01–V04

Reviewed both listening questions against their audio texts, both reading answers against the passages, grammar keys, vocabulary responses, functional-language choices, ordering tasks and writing prompts/rubrics.

No new blocking content defect was identified in this sample.

### C1-S2 — V01–V04

Reviewed directions, college services, equipment borrowing, travel and town-service contexts. The checked answer keys are supported by their audio texts/passages; the ordering tasks are coherent and the writing rubrics reflect their prompts.

No new blocking content defect was identified in this sample.

### C3-S1 — V01–V04

Reviewed materials terminology, drawing interpretation, dimensions, revision control, parts lists and workshop induction. The reviewed keys are supported by the task texts. Technical statements remain language-assessment contexts and should still be checked against the college's approved subject references before release.

No new blocking content defect was identified in this sample.

## Editorial clarity notes

Two single-choice listening prompts are grammatically understandable but could be more explicit because the correct option contains a pair of details:

- C2-S1 V01, task `c2s1v01_l02`: “Which two things should students prepare for the career fair?” Suggested wording: “Which pair of items should students prepare for the career fair?”
- C3-S1 V02, task `c3s1v02_l02`: “What two types of dimensions will be explained?” Suggested wording: “Which pair of dimension types will be explained?”

These are low-severity prompt-clarity improvements, not answer-key defects: each has one option containing the requested pair. No source JSON or combined registry was changed in this pass, so source/registry parity is unaffected.

## Remaining limitations

- This sample does not complete the review of V05–V15 or V16–V20.
- C2-S1 and C2-S2 content still require a full item-by-item manual review beyond the structural checks.
- The 20-variant sample does not establish CEFR level, approved programme alignment, exact Belova textbook alignment, or specialist approval.
- The combined pilot registry remains pilot-only; no protected bank, Google Sheets, Apps Script, production import, deployment, merge or student publication was performed.

## Decision

The 20 checked variants are structurally consistent at the local file level. The two wording notes should be resolved when the source JSON and combined registry can be updated together. This audit is not release approval.
