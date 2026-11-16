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
