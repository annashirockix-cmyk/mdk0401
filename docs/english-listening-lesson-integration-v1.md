# Browser listening lesson integration v1

## What is now loaded

`index.html` loads these scripts in order:
1. `english-listening-tts.js` — browser speech synthesis, voice/rate selection, pause/resume/stop and repeat.
2. `english-listening-lesson.js` — reusable listening activity UI.

The VPR engine remains separate and is not modified by this addition.

## Public API

```js
var activity = window.EnglishListeningLesson.render(container, {
  mode: "practice",              // "practice" or "assessment"
  script: "Recording script...", // English text read by the browser
  lang: "en-GB",
  repeatCount: 2,
  rate: 0.88,
  questions: [
    {
      prompt: "What is the briefing about?",
      options: ["A process review", "A travel announcement"],
      answerIndex: 0,             // practice mode only
      explanation: "The speaker reviews a process record."
    }
  ]
});
```

The method returns:
- `getAnswers()` — selected option indices;
- `closeAssessment()` — reveals the transcript only after the caller has formally closed the assessment;
- `destroy()` — stops speech and clears the component.

## Practice mode

- Browser reads the recording script; default repeat count is two.
- Student answers all listening questions.
- Submit checks the supplied practice keys and reveals the transcript.
- Practice answer keys may be included in the lesson data only when they are not used as protected graded assessment keys.

## Assessment mode

- Do **not** pass `answerIndex` or `explanation` to the browser. The component rejects assessment question objects containing either field.
- Submit collects the selected indices and calls optional `onSubmit({answers, questionCount})`.
- The host assessment engine must send the attempt to the protected server-side grading workflow and must not trust client-side scoring.
- The transcript stays hidden after submission. The host must call `closeAssessment()` only after the server confirms the attempt is formally closed.
- The module does not itself save attempts, calculate grades, alter the gradebook or provide proctoring. Those remain the responsibility of the existing assessment system.

## Example integration in a lesson renderer

```js
var mount = document.getElementById("lessonListening");
var activity = window.EnglishListeningLesson.render(mount, {
  mode: "practice",
  script: lesson.listening.script,
  lang: "en-GB",
  repeatCount: 2,
  questions: lesson.listening.questions
});

// When the lesson view is removed:
activity.destroy();
```

For an assessment, build a separate question payload without keys and connect `onSubmit` to the existing protected assessment API. Do not call `closeAssessment()` until the server has confirmed closure.

## Current integration boundary

The browser player and activity component are now loaded by the portal. They are reusable building blocks; the Markdown lesson drafts are not yet converted into portal lesson records, and no lesson catalogue/renderer route has been connected to these drafts. A future integration must map each lesson's listening script and questions into this schema, keep transcripts/keys out of graded client payloads, and use the existing server-side assessment flow. Do not modify the working Basic/Technical VPR bank or its submit/grading functions as part of that work.


## Course 5 Semester 2 practice catalogue

- `english-listening-catalog.js` contains four browser-readable practice activities for lessons 9–12.
- `english-listening-route.js` provides the `#/english-listening` route and intercepts the route before the generic fallback router.
- `english-tools.js` adds an **Аудирование** entry to the English quick-access block for EN, ENB and ENT courses.
- The catalogue uses the reusable listening component in **practice mode only**. It contains practice answer keys in the client bundle; therefore it must not be treated as a protected exam or graded assessment.
- The catalogue currently covers lessons 9–12 of course 5, semester 2. The other eight lessons have not yet been mapped into this playable catalogue.
- No grades or attempts are saved by this catalogue. It does not call the VPR API and does not modify the VPR bank.


## Expanded playable catalogue: lessons 5–12

The practice catalogue now includes eight lessons in Course 5, Semester 2:
- Lesson 5 — Manufacturing Process Review and Improvement.
- Lesson 6 — CNC Program Review and Revision Communication.
- Lesson 7 — Electrical System Fault-isolation Case Discussion.
- Lesson 8 — Software Test Results and Data-processing Reports.
- Lessons 9–12 — Materials records, reliability planning, integrated handover and capstone review.

Each activity has a browser-readable script, gist/detail questions and practice feedback. The catalogue still uses practice-mode answer keys in the client bundle and does not create graded attempts. Lessons 1–4 and the other semesters are not yet in the playable catalogue.


## Complete playable catalogue: Course 5, Semester 2

The browser practice catalogue now contains all twelve lessons in this semester, in lesson order (1–12). Each has a text-to-speech script and multiple-choice gist/detail questions. The browser reads the script directly; no MP3 is required. Transcript reveal and practice feedback are provided by the shared component. This is still a practice catalogue: answer keys are client-side, no grades/attempts are persisted, and it is not a protected exam.
