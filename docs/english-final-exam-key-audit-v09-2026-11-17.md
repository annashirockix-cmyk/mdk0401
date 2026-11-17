# English final exam V09 editorial and key audit — 2026-11-17

## Scope and structural checks

Reviewed all ten V09 source variants across C01-S01, C01-S02, C02-S01, C02-S02, C03-S01, C03-S02, C04-S01, C04-S02, C05-S01 and C05-S02.

- 10/10 files parse as JSON.
- 10 tasks and 20 points per variant.
- Expected composition in every variant: 6 single-choice, 1 multiple-choice, 1 short-text, 1 ordering and 1 written task.
- Single-choice answer-position distribution is [2, 2, 1, 1] in all ten variants.
- Source-to-registry parity: 10/10 pass after corrections.

## Content review

All 60 single-choice and 40 non-single-choice tasks were reviewed for V09. Four key defects were found and corrected:

1. C02-S01 `c2s1v09_r02`: the passage says clear signs and reminders near the exits helped students return reusable cups; the key incorrectly pointed to a prize draw. Correct answer: “Signs and reminders near the exits”.
2. C02-S02 `c2s2v09_l02`: the announcement asks students to review public profile settings; the key incorrectly pointed to saved passwords. Correct answer: “Their public profile settings”.
3. C02-S02 `c2s2v09_r01`: the passage says Oleg removed an old post containing a private timetable; the key incorrectly pointed to a photograph showing his student card number. Correct answer: “An old post containing a private timetable”.
4. C02-S02 `c2s2v09_r02`: the passage says deleting a post does not guarantee every copy has disappeared; the key incorrectly said it guarantees no one can save it. Correct answer: “Deleting a post does not guarantee that every copy has disappeared”.

The source JSON files and embedded registry variants were updated together. Option positions were then rebalanced without changing the corrected answer texts. Both C02-S1 V09 and C02-S2 V09 now have the required single-choice distribution [2, 2, 1, 1].

## Remaining checks

- Confirm CI for the latest HEAD; no claim of a green CI result is made until the latest run completes.
- Continue with V10 after the V09 CI result and any required follow-up.
