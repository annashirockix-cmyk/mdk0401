# Technical English 200-item draft pool — audit v1

**Status:** structural audit completed; subject and curriculum approval outstanding. This document does not authorize student release or import into the protected Google Sheets bank.

## 1. Structural audit

- 200 questions are present in ten batches of 20, numbered 1–200.
- Every question has four options (A–D) and a corresponding teacher-key row.
- The answer text originally designated as correct was preserved for all 200 items while answer choices were reordered.
- Correct-answer positions are now balanced: 50 A, 50 B, 50 C and 50 D across the pool.
- Each individual 20-question batch contains exactly five correct answers in each position.
- No exact duplicate substantive question stems were found by the text-normalization check. Generic prompts such as “Choose the correct sentence” are not treated as substantive stems.
- Automated regression coverage is added in `scripts/english-technical-draft-bank.test.mjs` and included in `.github/workflows/portal-syntax.yml`. GitHub Actions run #43947026282 passed on code head 745942a3c1525bf3b68ed24f4433ba7e5d332834 on 2026-11-16, including the English runtime and browser exam audits. Subsequent documentation-only commits require their own CI result.

## 2. Answer-key distribution before and after correction

| Position | Before | After |
|---|---:|---:|
| A | 165 | 50 |
| B | 31 | 50 |
| C | 4 | 50 |
| D | 0 | 50 |
| **Total** | **200** | **200** |

The original correct option text was checked against the newly keyed option for every question: 200/200 matched.

## 3. Preliminary VPR comparison

The protected Technical VPR seed in `EnglishVPR-Sheets.gs` uses an integrated seven-task format: listening dialogue, reading matching, text reconstruction, vocabulary gap-fill, word formation, grammar transformations and a written questionnaire. Its technical contexts include workshop preparation, workpieces, CNC machining, cutting tools, measuring instruments and safety vocabulary.

The 200-item draft pool intentionally shares the broad vocational domain (engineering, manufacturing, CNC, measurement, maintenance, aviation and technical communication). This is not itself evidence of duplicated questions. A complete semantic item-by-item comparison against the active protected VPR bank and its variants is still outstanding; this preliminary review must not be presented as a certified no-duplicates result.

## 4. Subject-review flags

The following items were re-opened against the current ten draft files on 2026-11-16. This is an editorial consistency check, not expert or curriculum approval:

- Q48: the stem says “typically” and the keyed option is the spindle/tool axis. Keep the machine- and coordinate-convention caveat; confirm it against the equipment and teaching reference used by the college.
- Q62: the keyed meaning of “to isolate a circuit” is to disconnect it from its energy source. It is a vocabulary interpretation item, not a work instruction; have the electrical subject specialist confirm the wording.
- Q74: “shall” is keyed as a mandatory requirement in a technical specification. The convention depends on the applicable standard/document, so retain this as a terminology review point.
- Q77: the keyed form is “has received”. Both coordinated subjects (“operator” and “supervisor”) are singular; the nearest-subject agreement rule also yields the singular form. Confirm the explanation against the course grammar reference.
- Q127: the current stem is “The drawing and the accompanying notes ___ the revised connector type”; the key is “specify” (B), correctly agreeing with the plural compound subject. The earlier audit note incorrectly described this item as a “neither…nor” construction and is withdrawn.
- Q133 and Q156: the current keys are “were collected” (B) and “are available” (A). Both items consistently treat “data” as plural; the earlier singular/plural consistency flag is resolved for these two items. Confirm that plural “data” matches the course style guide.
- Q144: the keyed value, 7.5 bar, is below the stated maximum of 8 bar. This is a reading-comprehension calculation, not an operating recommendation.
- Q173: the key “until” completes a sentence describing an equipment-status condition. Keep it framed as a language-comprehension item, not as an independent maintenance instruction.
- Q194: the phrase “approved data” is aviation-maintenance terminology. A qualified aviation subject specialist must confirm its interpretation and alignment with the approved programme before release.

## 5. Remaining release gates## 4A. Editorial near-duplicate review (2026-11-15)

A manual content-level pass identified three repeated concepts that were not exact duplicate stems and therefore were not caught by the normalized-stem check:

- Q70 and Q126 both tested the definition/purpose of a bill of materials (BOM). Q126 has been replaced with a purchase-requisition purpose item.
- Q92 and Q137 both tested the purpose of root-cause analysis. Q137 has been replaced with the purpose of corrective action after a non-conformity investigation.
- Q98 and Q149 both tested the meaning of obsolete documentation. Q149 has been replaced with the meaning of a controlled copy.

These edits retain the four-option format and the existing answer-key positions. They reduce repeated content but do not constitute a full semantic review of every question pair. Basic–Technical cross-track semantic comparison and protected VPR variant comparison remain outstanding.



1. Complete semantic duplicate review against the active Basic and Technical VPR banks, including any variants stored in Sheets.
2. Review difficulty, CEFR/ESP progression, distractor quality and distribution across technologists, programmers, electricians, machine operators and aviation contexts.
3. Have an English methodologist and relevant subject specialists approve every item and key.
4. Map the items to the approved five-year work programme and semester outcomes.
5. Convert only approved items to the protected server-side schema; keep answer keys out of browser-delivered files.
6. Import to the protected sheet, read the data back, verify sanitization and run the assessment regression tests before student release.

## 6. Current boundary

This is a 200-item authoring pool, not yet ten approved semester assessments. A separate 200-item Basic authoring pool exists, but it is not mapped to the four Basic course-semester slots or approved as a semester bank. No new semester questions have been imported or published to students.


## 4B. Basic–Technical exact-stem screen (2026-11-16)

A second structural screen parsed all 200 Basic and all 200 Technical draft questions, including the two different Technical markdown formats used in Questions 1–60 and 61–200.

- 400 question stems were recovered across the two tracks.
- No exact normalized stem collision was found within either pool or between Basic and Technical.
- Every recovered question had a corresponding teacher-key row. This supplements, but does not replace, the individual structural checks above.
- This is an exact-stem screen only. It cannot rule out semantic overlap, repeated grammar targets, shared vocabulary, similar distractors, or overlap with protected VPR variants in Google Sheets.
- The existing Technical near-duplicate corrections (BOM, root-cause analysis, obsolete documentation) remain in place. A full semantic comparison against the protected VPR variants still requires access to the current protected bank contents and a task-by-task review.

The five-year map and final-exam blueprint files exist in the repository, but both explicitly remain provisional pending the approved work programme, semester hours and exact Belova textbook edition. No authoritative curriculum file was found in the repository tree during this pass.


## Clarification to electrical-safety vocabulary item Q62 — 2026-11-17

- Reworded Q62 to make clear that it tests the vocabulary meaning of *to isolate a circuit*, not the steps of a complete safe-isolation procedure.
- The keyed meaning remains “separate the circuit from its energy supply”.
- The teacher-key rationale now explicitly states that this definition is not a substitute for the approved isolation procedure and verification by authorised personnel.
- This wording correction reduces the risk of students treating a one-line vocabulary definition as practical electrical-safety instruction. An electrical subject specialist must still validate the term against the college's approved teaching reference before release.
