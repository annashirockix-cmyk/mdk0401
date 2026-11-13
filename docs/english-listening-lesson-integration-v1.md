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
