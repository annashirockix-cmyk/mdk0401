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
| 178 | Repeated the same “Would you mind opening the window?” request-response situation as Q39. | Replaced with a request for directions to a submission desk and a matching response. |


## Cross-source comparison

- Exact normalized question-stem comparison against the 27 existing Basic practice items found no exact matches.
- Exact normalized text comparison against the Basic VPR source strings found no exact matches.
- This is only an exact-string screen. It does not establish that all passages, topics, grammar targets, or distractors are semantically distinct; a human reviewer should still check content overlap.
- The existing Basic VPR remains unchanged.

## Basic–Technical cross-track and Technical internal overlap review (2026-11-15)

- Compared the 200 Basic question stems with the 200 Technical question stems using the two Technical draft formats (numbered heading format for Questions 1–60 and bold numbered format for Questions 61–200).
- Two cross-track matches use the generic instruction stem “Choose the correct sentence.” They are not duplicate tasks: Basic Q27 tests present-simple agreement (“She doesn't like…”); Technical Q91 tests the present-perfect passive (“The equipment has been tested…”), and Technical Q103 tests “each” with singular agreement (“Each component has…”).
- A substantive repeat was found within Technical English: Q84 and Q124 both tested the drawing note “Do not scale”. Technical Q124 has now been replaced with a scale-reading question (1:2 means the drawing is half the real component size); its teacher key and rationale were updated.
- This is a stem-and-task review, not a full semantic proof that no topic, passage, vocabulary item or grammar target overlaps. Some shared language structures across Basic and Technical are intentional; the Technical track must still prioritise professional contexts and progression.
- The two “Choose the correct sentence” matches are not evidence of identical answer options or identical tested content. No cross-track item was merged or deleted.

## Answer-position balance

After shuffling answer options while preserving the intended correct answer, the 200-item draft has this key distribution: A — 49, B — 51, C — 49, D — 51. The test now checks that each letter remains between 49 and 51.

## Course-semester allocation gate

The five-course architecture defines ten semester slots overall: four Basic slots (Courses 1–2) and six Technical slots (Courses 3–5). The ten Basic markdown files are drafting batches, not ten approved semester mappings. The 200 Basic items remain a question pool until an approved course/semester blueprint and the exact Belova edition are available. Do not import all 200 as ten Basic semester tests by filename order.

A Library search for an approved English work programme and the exact Belova textbook edition did not surface a matching source. This search result is not proof that the documents do not exist; it means semester mapping and textbook alignment remain unverified.

## Safety and release gates

1. Do not use the old 200-item client seed as the server bank.
2. The independent 200-item Basic draft pool now exists in ten authoring batches. It still needs mapping to the four Basic course-semester slots, verification against the approved programme and exact Belova edition, and review by a second English methodologist of every key and distractor.
3. Verify progression by course and semester against the actual five-year work programme.
4. Compare approved items with VPR, Technical and lesson-practice banks.
5. Import only the approved structured set through the teacher/admin route. Keep answer keys server-side and verify sanitized student responses after import.

## Limitation

This is a source and editorial review, not an independent second-methodologist sign-off. It is not a certification of CEFR level, textbook alignment, factual currency, or methodological suitability.


## Recomputed answer-position distribution and batch warning — 2026-11-17

A fresh count of the teacher-key tables in all ten current Basic draft files (20 questions per file) recovered 200/200 keys and the following pool-wide distribution:

| Position | Current count |
|---|---:|
| A | 50 |
| B | 50 |
| C | 49 |
| D | 51 |
| **Total** | **200** |

This corrects the earlier tally in this document (A 49, B 51, C 49, D 51), which is stale relative to the current source files. The overall pool remains balanced within the intended 49–51 range.

The authoring batches are **not individually balanced exam forms**. For example, draft v1 has A 5 / B 0 / C 0 / D 15; v2 has A 6 / B 1 / C 5 / D 8. Other batches also vary. This is acceptable only while the files remain authoring batches and the approved semester banks are built from a cross-batch allocation. Do not use a single 20-question draft file as a student test or assign sequential 20-item batches directly to semester assessments. When the four Basic semester slots are finally mapped, rebalance correct-answer positions within each slot and recheck after option shuffling.


## Semantic near-duplicate screen — 2026-11-17

A focused cross-batch review identified two pairs that repeated almost the same sentence frame and target more closely than is useful for a 200-item authoring pool:

- Q4 and Q121 both tested **interested in + gerund** in near-identical “learning foreign languages” contexts. Q121 has been replaced with **proud of + noun** (“The students were proud of their team's success”), retaining key position B.
- Q29 and Q81 both asked the learner to complete almost the same indirect question about the location of the nearest bus stop. Q81 has been replaced with an indirect yes/no question about the library opening on Saturdays (“Do you know whether the library is open…”), retaining key position A.

The two revised source files retain four options and their existing answer-key positions. This is a targeted remediation of two high-confidence near-duplicates, not a claim that all 200 questions have been fully semantically de-duplicated. A complete review of grammar-target frequency, reading-topic overlap, distractor reuse and cross-track/protected-bank similarity remains open.
