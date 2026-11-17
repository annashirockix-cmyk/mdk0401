# English final exam V10 editorial and key audit — 2026-11-17

## Scope and structural validation

Reviewed all ten V10 source variants across C01-S01, C01-S02, C02-S01, C02-S02, C03-S01, C03-S02, C04-S01, C04-S02, C05-S01 and C05-S02.

- 10/10 JSON files parse successfully.
- Every variant contains 10 tasks and totals 20 points.
- Every variant has the expected composition: 6 single-choice, 1 multiple-choice, 1 short-text, 1 ordering and 1 written task.
- All ten variants have single-choice answer-position distribution [2, 2, 1, 1].
- Source-to-registry parity: 10/10 pass after corrections.

## Content review

All 60 single-choice and 40 non-single-choice tasks were reviewed. Four single-choice key defects were identified and corrected:

1. C02-S01 `c2s1v10_l02`: the listening script says students must wear their college identification badges, not student timetables.
2. C02-S01 `c2s1v10_r02`: the passage says the assistant repeated and clarified the information calmly, not that she asked the passenger to wait until the flight arrived.
3. C02-S02 `c2s2v10_r01`: the passage attributes the mixed results to students being unsure which materials belonged in each bin, not to missing plastic-sorting signs.
4. C02-S02 `c2s2v10_r02`: the next review compares contamination levels before and after the changes, not the annual amount of plastic collected.

The corrected answer texts were retained while option positions were rebalanced. C02-S01 V10 and C02-S02 V10 both retain the required [2, 2, 1, 1] single-choice key distribution. Source JSON and embedded registry variants were updated together.

## Remaining checks

- Verify CI for the latest HEAD; no green CI claim is made until a workflow run for that exact commit completes.
- Continue with V11.
