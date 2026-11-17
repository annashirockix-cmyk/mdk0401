# English final exam V11 editorial and key audit — 2026-11-17

## Scope and structural validation

Reviewed all ten V11 source variants across C01-S01, C01-S02, C02-S01, C02-S02, C03-S01, C03-S02, C04-S01, C04-S02, C05-S01 and C05-S02.

- 10/10 JSON files parse successfully.
- Every variant contains 10 tasks and totals 20 points.
- Every variant has the expected composition: 6 single-choice, 1 multiple-choice, 1 short-text, 1 ordering and 1 written task.
- All ten variants have single-choice answer-position distribution [2, 2, 1, 1].
- Source-to-registry parity: 10/10 pass after corrections.

## Content review and corrections

Reviewed all 100 tasks (60 single-choice and 40 other task types). Four confirmed single-choice key errors were corrected:

1. C01-S01 `c1s1v11_r02`: Nadia checks facts and writes the report in her own words; she does not copy every paragraph.
2. C02-S01 `c2s1v11_r02`: Daria contacted the host college to ask for safety information in English.
3. C02-S02 `c2s2v11_r01`: Marina compared repair options and expected battery life, not screen size and camera quality.
4. C02-S02 `c2s2v11_r02`: she chose the more expensive model because she expected to use it for several years and wanted easier repairs.

Correct answer text was retained while options were repositioned to preserve the required [2, 2, 1, 1] key distribution. Source JSON and registry variants were updated together.

One ordering-task prompt in C01-S02 was clarified: it no longer says the coordinator has already confirmed the task while also asking students to place that confirmation step in the sequence.

## CI finding requiring separate follow-up

The latest observed CI run (#3027, for the earlier V10 HEAD) failed in the full syntax/test job on two pre-existing checks outside V11:
- Basic English Course 2 Semester 1 pilot answer distribution: actual A/B/C/D = 2/3/2/1, expected 2/2/2/2.
- Final-exam registry balance: EN-C2-S1-V07 had single-choice distribution [2, 3, 1, 0], expected [2, 2, 1, 1].

Both failures traced to the same C2-S1 V07 key-position imbalance. The reading answer in `c2s1v07_r02` was moved to option index 3 without changing its answer text. The single-choice distribution is now [2, 2, 1, 1], and the combined single-/multiple-choice A/B/C/D distribution is [2, 2, 2, 2]. The source JSON and registry were updated together. A fresh CI run is still required to verify the repair and all V11 changes; no green CI claim is made for the current HEAD.
