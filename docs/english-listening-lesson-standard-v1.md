# Listening in English lessons — Spotlight-style lesson standard

Status: instructional and technical specification for adding listening to existing English lectures. Existing lesson texts and assessment banks remain intact. This document defines the content model and a complete aviation-themed sample; it does not claim that audio files or a portal audio player have already been deployed.

## 1. Pedagogical model

Every full English lecture should include a listening section where it fits the learning outcomes. Use a staged sequence inspired by the classroom workflow in Spotlight, while writing original scripts and tasks rather than copying textbook audio or exercises.

### Standard sequence

1. **Before you listen** — introduce 5–8 key words or phrases, predict the topic from a picture/title, and clarify only the vocabulary essential for comprehension. Do not reveal the whole script.
2. **Listen for the main idea** — first play, normally without pausing. Students choose the topic, speaker roles, purpose, or the main problem.
3. **Listen for details** — second play. Students complete a form, choose facts, identify numbers, match speakers, put events in order, or mark statements True/False.
4. **Listen again / language focus** — optional third play for a short extract: notice a phrase, weak forms, numbers, spelling, instructions, or polite professional language.
5. **After listening** — pair discussion, short spoken response, role-play, or a short written maintenance/production note.
6. **Transcript and feedback** — transcript is hidden until the student submits the listening tasks (or explicitly opens it for study). Then highlight key phrases and explain distractors.

### Listening task design

- First listen: one global-understanding task, normally 1–3 items.
- Second listen: 4–6 detail items, using more than one task format across a unit.
- Optional language focus: 1–2 items.
- Include realistic distractors, but do not make the task depend on obscure background knowledge.
- Numbers, dates, measurements, part IDs and revisions must be spoken clearly and checked against the transcript.
- Avoid testing technical knowledge that has not yet been taught.
- Keep the listening level aligned with the lesson's CEFR target; gradually increase speed, length and information density.
- Provide a replay control. During a graded attempt, use a reasonable replay limit only if the teacher has enabled it; for practice, allow replay.
- Never use the transcript as the audio source displayed to students before task submission.

## 2. Recommended content model

A listening item should be represented as structured content, not embedded as a long transcript in the visible lesson HTML.

Suggested model (server/content authoring side):

```js
{
  id: "en-aviation-listen-c03-u01-l01",
  title: "A dimensional inspection briefing",
  level: "B1",
  durationSeconds: 85,
  audioAsset: "audio/en/aviation/inspection-briefing-01.mp3",
  speakers: ["technologist", "quality inspector"],
  context: "aircraft component manufacturing",
  preListening: {
    vocabulary: [
      { term: "tolerance", meaning: "permitted dimensional variation" },
      { term: "batch number", meaning: "identifier for a production batch" }
    ],
    predictionPrompt: "What information might an inspector report?"
  },
  tasks: {
    gist: [],
    detail: [],
    languageFocus: []
  },
  transcript: "SERVER_OR_AFTER_SUBMISSION_ONLY",
  answerKey: "SERVER_ONLY",
  followUp: []
}
```

The student response must not contain the transcript before the reveal condition, correct answers, scoring internals, or hidden task metadata. If the portal cannot yet enforce transcript reveal or server-side scoring for listening, release the section as teacher-led practice until those controls are implemented.

## 3. Audio production standards

- Original English scripts only; do not copy Spotlight recordings, textbook transcripts, or copyrighted audio.
- Use clear natural speech, not robotic word-by-word pronunciation.
- Start with one or two speakers; add realistic but controlled variation later.
- Use a neutral, internationally intelligible English accent initially. Add varied English accents only as a planned listening objective, not as an obstacle.
- Normal speech rate target: approximately 115–140 words per minute for A2–B1 and 130–155 for B1–B2. Adjust after classroom testing.
- Typical duration: 45–90 seconds for A2; 60–120 seconds for B1; 90–180 seconds for B2.
- Record clean speech with minimal background noise. Any aviation/industrial ambience must remain quiet and must not mask speech.
- Do not imitate real aircraft warning sounds or use a recording that could be mistaken for an operational alert.
- MP3 is suitable for the portal; retain a lossless master for editing.
- Provide a transcript, speaker labels, pronunciation notes, and an answer key for every recording.
- Audio files must be hosted as stable assets and checked for playback on desktop and mobile.

## 4. Aviation and professional pathway coverage

Listening scripts should rotate across the four specialisms while remaining understandable to all students.

| Pathway | Suggested listening situations |
|---|---|
| Technologists | material receiving, process-sheet briefing, quality inspection, non-conformity review |
| Programmers | sensor-data briefing, software test results, database validation, CNC simulation review |
| Electricians | wiring-diagram discussion, electrical inspection report, connector identification, fault handover |
| Machine-tool operators | CNC setup briefing, drawing revision check, tool measurement, first-off inspection |

Across the full course, also include shared aviation contexts: aircraft structures, maintenance documentation, airport ground operations, production traceability, quality assurance, human factors, and workplace safety. Make clear when a text describes a training scenario rather than an approved aircraft maintenance procedure.

## 5. Complete sample listening lesson

### Topic: A dimensional inspection briefing
Level: B1. Suggested audio duration: 75–90 seconds.
Professional context: aircraft component manufacturing.
Learning outcomes:
- identify the purpose of an inspection briefing;
- understand a part number, nominal dimension and measured value;
- recognise a non-conformity and the next reporting step;
- use concise phrases to report measurements.

#### Before you listen

Match the terms with their meanings:

1. nominal dimension
2. measured value
3. upper limit
4. on hold

a. temporarily stopped from moving to the next production stage
b. the specified target size
c. the highest permitted value
d. the result obtained during measurement

Prediction: What might an inspector say if a hole is larger than the permitted maximum?

#### Audio script — recording master (do not show before listening)

Speaker 1 — Technologist: Good morning. Are the inspection results ready for the actuator bracket, part AB two zero four?

Speaker 2 — Inspector: Yes. The drawing is revision C. The nominal hole diameter is twelve point zero zero millimetres. The permitted range is eleven point nine five to twelve point zero five.

Speaker 1: What value did you measure?

Speaker 2: Twelve point zero eight millimetres. The result is above the upper limit by zero point zero three millimetres.

Speaker 1: Have you recorded the result against the work order and material batch?

Speaker 2: Yes. I have entered the measurement and attached the identification label. The part is on hold.

Speaker 1: Good. Please notify the quality engineer. Do not release the component until the authorised review is complete.

Speaker 2: Understood. I will send the inspection report now.

#### First listening — main idea

Choose the best answer.

1. What are the speakers mainly discussing?
   A) A passenger boarding procedure
   B) An inspection result for an aircraft component
   C) A change to the aircraft timetable
   D) A staff training schedule

2. What is the immediate issue?
   A) The drawing is missing
   B) The material batch is unknown
   C) The measured hole is above the permitted limit
   D) The machine has no power

#### Second listening — details

3. What is the drawing revision?
   A) A
   B) B
   C) C
   D) D

4. What is the nominal hole diameter?
   A) 11.95 mm
   B) 12.00 mm
   C) 12.05 mm
   D) 12.08 mm

5. How far is the measured value above the upper limit?
   A) 0.03 mm
   B) 0.05 mm
   C) 0.08 mm
   D) 0.30 mm

6. What has the inspector attached to the part?
   A) A passenger label
   B) A new drawing
   C) An identification label
   D) A tool list

7. Who must be notified?
   A) The passenger
   B) The quality engineer
   C) The supplier's driver
   D) The receptionist

#### Language focus

8. In the phrase “Do not release the component until the authorised review is complete”, the instruction means:

   A) Send the component immediately
   B) Wait for the authorised review before release
   C) Change the measured value
   D) Repeat the production batch

9. Which phrase reports a measurement most clearly?

   A) “It is a little bit wrong.”
   B) “The hole looks strange.”
   C) “The measured diameter is 12.08 millimetres; the upper limit is 12.05.”
   D) “The component is probably fine.”

#### After listening

In pairs, take the roles of a technologist and an inspector. Report a different measurement result using the pattern:

- “The nominal dimension is …”
- “The measured value is …”
- “The permitted range is …”
- “The result is within / outside tolerance.”
- “The component is … pending review.”

Then write a two-sentence inspection note.

#### Transcript reveal and feedback

After submission, reveal the recording transcript. Ask students to underline:
- the part number;
- the drawing revision;
- the nominal dimension;
- the permitted range;
- the measured result;
- the next action.

#### Teacher key (server/teacher-only)

Pre-listening: 1-b, 2-d, 3-c, 4-a.
1 B; 2 C; 3 C; 4 B; 5 A; 6 C; 7 B; 8 B; 9 C.

## 6. Integration into existing lecture pages

Do not replace the current lecture HTML. Add a separate listening block after the relevant explanation and before the self-check or practical work.

Suggested student-facing order:
1. Lecture explanation and visual material.
2. Key vocabulary.
3. Listening block with audio player and task sequence.
4. Transcript reveal after completion.
5. Speaking/practical follow-up.
6. Existing self-check and independent work.

The audio player should:
- show title, duration and playback progress;
- support play/pause and replay;
- work on desktop and mobile;
- display no transcript before the reveal condition;
- report a useful message if the asset is unavailable;
- not autoplay;
- preserve student progress if the lesson is refreshed, where the current portal architecture supports it.

## 7. Rollout and acceptance criteria

1. Audit the lesson renderer and content schema before inserting audio markup. The current lecture content files do not yet contain an audio/listening schema, and the inspected portal source did not show an existing audio player or listening endpoint.
2. Implement a reusable listening renderer and stable asset hosting; do not place answer keys in public JavaScript.
3. Pilot 3 original recordings: one shared aviation context, one electrical context, and one CNC/technologist context.
4. Test audio playback, replay, transcript reveal, mobile layout, accessibility, and student progress.
5. Add listening to existing lectures incrementally, preserving every original lecture text and exercise.
6. For Basic English, use everyday, educational and regional/cultural contexts appropriate to the Belova-based course; do not force aviation vocabulary into beginner general-English lessons.
7. Confirm that each recording has a transcript, task key, duration, level, and source/rights record before publication.

Acceptance:
- No copied Spotlight audio or textbook scripts.
- Every listening section has a pre-listening stage, gist task, detail task, transcript and feedback.
- Transcript and answer key are not exposed prematurely.
- Existing lectures, tests and VPR remain unchanged.
- All four professional pathways receive listening material over the planned course sequence.
