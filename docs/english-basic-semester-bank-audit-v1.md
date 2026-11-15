# Basic English semester-bank audit v1

Date: 2026-11-15  
Scope: legacy Basic semester seed, independent Basic authoring drafts v1–v10, practical Basic seed, Basic VPR source text, and protected import validator.

## Legacy seed findings

- The old client-side Basic seed has 10 tests and 200 questions.
- All 200 questions are missing a `correct` answer index. The server import validator correctly rejects this seed because each question must carry a valid answer key.
- Twelve repeated stems occur across the ten tests. The duplicates are listed below.
- The old seed is not a valid protected assessment source and must not be imported as-is.

| Duplicate question | First occurrence | Repeated occurrence |
|---|---|---|
| Which sentence is correct? | b_sem1 Q17 | b_sem2 Q11 |
| A micrometer is used for: | b_sem7 Q13 | b_sem10 Q9 |
| G00 means: | b_sem8 Q1 | b_sem10 Q10 |
| M03 turns the spindle: | b_sem8 Q3 | b_sem10 Q11 |
| G54 is: | b_sem8 Q7 | b_sem10 Q12 |
| 'Sensor' means: | b_sem9 Q2 | b_sem10 Q13 |
| A CPU is: | b_sem9 Q7 | b_sem10 Q14 |
| A LAN is a: | b_sem9 Q16 | b_sem10 Q15 |
| In case of accident, press the: | b_sem8 Q19 | b_sem10 Q16 |
| You … wear safety glasses in the workshop. | b_sem8 Q15 | b_sem10 Q17 |
| The results of the experiment … discussed yesterday. | b_sem5 Q15 | b_sem10 Q18 |
| If I had time, I … help you. | b_sem4 Q8 | b_sem10 Q20 |

## New authoring drafts

- Draft v1: questions 1–20.
- Draft v2: questions 21–40.
- Draft v3: questions 41–60.
- Draft v4: questions 61–80.
- Draft v5: questions 81–100.
- Draft v6: questions 101–120.
- Draft v7: questions 121–140.
- Draft v8: questions 141–160.
- Draft v9: questions 161–180.
- Draft v10: questions 181–200.
- Each draft contains four answer options per question and a separate teacher key with rationale.
- The drafts are original authoring material, not yet checked against the exact Belova edition or the approved work programme. They are not imported or student-visible.
- Structural checks across all 200 questions found no repeated question stems, missing keys, missing key options, or incorrect option counts.

## Content review findings (editorial pass)

The following items were revised after checking for more than one plausible answer or avoidable repetition:

| Question | Finding | Revision |
|---:|---|---|
| 47 | Reported-speech context did not make the intended backshift explicit. | Clarified that the task asks for the standard backshifted report of a statement made yesterday. |
| 64 | Neither…nor agreement can vary in usage. | Replaced the construction with the unambiguous compound subject “Tom and his friends”. |
| 101 | “Neither of the two…” can attract singular or plural agreement in some usage. | Simplified to “Neither explanation…”. |
| 117 | The mandative subjunctive after “suggested that” varies by dialect/register. | Recast with “should” so the tested form is unambiguous. |
| 118 | Repeated the same “Would you mind…?” function as Q39. | Replaced with a polite request about sending a timetable and a matching response. |
| 124 | “This week” alone did not prove that the time period was unfinished. | Added “It is only Wednesday”. |
| 142 | Duration leading up to a past event needed a clearer time anchor. | Added explicit 10:00 and 10:20 reference times. |
| 163 | Past perfect continuous needed a clearer continuing-duration context. | Added “for two weeks” and “was still taking it”. |
| 164 | Repeated the handwashing example used in Q44. | Replaced with a workshop helmet instruction. |
| 99 | Repeated the vocabulary target “reliable” from Q5. | Replaced it with “effective” from the reading passage. |
| 180 | Neither…nor agreement was potentially dialect-sensitive. | Replaced with a plural compound subject. |

## Cross-source comparison

- Exact normalized question-stem comparison against the 27 existing Basic practice items found no exact matches.
- Exact normalized text comparison against the Basic VPR source strings found no exact matches.
- This is only an exact-string screen. It does not establish that all passages, topics, grammar targets, or distractors are semantically distinct; a human reviewer should still check content overlap.
- The existing Basic VPR remains unchanged.

## Answer-position balance

After shuffling answer options while preserving the intended correct answer, the 200-item draft has this key distribution: A — 49, B — 51, C — 49, D — 51. The test now checks that each letter remains between 49 and 51.

## Safety and release gates

1. Do not use the old 200-item client seed as the server bank.
2. Complete the independent Basic question set and have a second English methodologist review the keys and distractors.
3. Verify progression by course and semester against the actual five-year work programme.
4. Compare approved items with VPR, Technical and lesson-practice banks.
5. Import only the approved structured set through the teacher/admin route. Keep answer keys server-side and verify sanitized student responses after import.

## Limitation

This is a source and editorial review, not an independent second-methodologist sign-off. It is not a certification of CEFR level, textbook alignment, factual currency, or methodological suitability.
