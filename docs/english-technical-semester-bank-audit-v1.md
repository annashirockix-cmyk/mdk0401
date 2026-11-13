# Technical English 200-item draft pool — audit v1

**Status:** structural audit completed; subject and curriculum approval outstanding. This document does not authorize student release or import into the protected Google Sheets bank.

## 1. Structural audit

- 200 questions are present in ten batches of 20, numbered 1–200.
- Every question has four options (A–D) and a corresponding teacher-key row.
- The answer text originally designated as correct was preserved for all 200 items while answer choices were reordered.
- Correct-answer positions are now balanced: 50 A, 50 B, 50 C and 50 D across the pool.
- Each individual 20-question batch contains exactly five correct answers in each position.
- No exact duplicate substantive question stems were found by the text-normalization check. Generic prompts such as “Choose the correct sentence” are not treated as substantive stems.
- Automated regression coverage is added in `scripts/english-technical-draft-bank.test.mjs` and included in `.github/workflows/portal-syntax.yml`. The workflow has not yet reported a run for the current PR head; do not describe CI as passing until GitHub reports it.

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

The following items need particular attention during expert review:

- Q48: Z-axis conventions depend on the machine and coordinate convention; confirm the local teaching reference.
- Q62: electrical isolation wording is a vocabulary interpretation item, not a work instruction.
- Q74: “shall” as a mandatory requirement depends on the applicable standard/document convention.
- Q77: agreement with “neither…nor” can vary by construction and style reference.
- Q127: same neither…nor agreement issue; review against the selected grammar reference.
- Q133 and Q156: singular/plural treatment of “data” must follow the course style guide.
- Q144 and Q173: make sure the examples remain reading-comprehension items, not operational instructions.
- Q194: aviation maintenance wording must be checked against the approved programme and specialist terminology.

## 5. Remaining release gates

1. Complete semantic duplicate review against the active Basic and Technical VPR banks, including any variants stored in Sheets.
2. Review difficulty, CEFR/ESP progression, distractor quality and distribution across technologists, programmers, electricians, machine operators and aviation contexts.
3. Have an English methodologist and relevant subject specialists approve every item and key.
4. Map the items to the approved five-year work programme and semester outcomes.
5. Convert only approved items to the protected server-side schema; keep answer keys out of browser-delivered files.
6. Import to the protected sheet, read the data back, verify sanitization and run the assessment regression tests before student release.

## 6. Current boundary

This is a 200-item authoring pool, not yet ten approved semester assessments. No Basic semester bank has been authored from this work, and no new semester questions have been imported or published to students.
