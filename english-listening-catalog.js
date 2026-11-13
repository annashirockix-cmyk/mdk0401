/* Browser-listening practice catalogue: Course 5, Semester 2.
 * This page is practice-only. It does not save grades or create exam attempts.
 */
(function () {
  "use strict";
  if (window.EnglishListeningCatalogue) return;

  var activities = [
    {
      id: "en-c05-s02-l01",
      title: "Lesson 1 — Delivering a Technical Presentation",
      level: "B2",
      script: "Good morning, everyone. The purpose of this briefing is to present the results of the fictional Aviation Training Data Review, reference ATD-08. Our audience includes colleagues from four specialisms, so I will explain the terms that may be unfamiliar. The scope is limited to four classroom documents: a sample process sheet, a data dictionary, a wiring-diagram glossary and a CNC drawing extract. We identified an inconsistent term, one missing identifier and two records with incomplete units. The review did not include physical equipment, live production data, aircraft maintenance or operational testing. I will begin by explaining the sources, then present the findings and limitations. After that, I will hand over to the programmer for the data-label example.",
      questions: [
        { prompt: "What is the speaker doing?", options: ["Giving a passenger announcement", "Opening a technical briefing about a fictional information-pack review", "Explaining how to repair an aircraft", "Giving instructions for operating a CNC machine"], answerIndex: 1, explanation: "The speaker opens a briefing about a fictional classroom review." },
        { prompt: "What is the scope?", options: ["A physical inspection of an aircraft", "A production release decision", "A review of four classroom documents", "A live electrical test"], answerIndex: 2, explanation: "The scope is limited to four classroom documents." },
        { prompt: "What is the project reference?", options: ["ATD-08", "ATD-80", "ADB-08", "ATD-18"], answerIndex: 0, explanation: "The project reference is ATD-08." },
        { prompt: "How many classroom documents are included?", options: ["Two", "Three", "Four", "Eight"], answerIndex: 2, explanation: "The briefing lists four classroom documents." },
        { prompt: "Which issue is mentioned?", options: ["A missing passenger record", "An inconsistent term", "A damaged aircraft component", "An unapproved machine setting"], answerIndex: 1, explanation: "One inconsistent term was identified." },
        { prompt: "What is explicitly excluded?", options: ["A review of document labels", "A review of classroom sources", "Physical equipment, live production data, maintenance and operational testing", "A handover to the programmer"], answerIndex: 2, explanation: "The speaker explicitly excludes real equipment and operational activity." }
      ]
    },
    {
      id: "en-c05-s02-l02",
      title: "Lesson 2 — Writing a Structured Technical Report",
      level: "B2",
      script: "Could we review the draft report before it is submitted? The objective and scope are clear, but the source document reference is missing. Please add the reference to the sample data dictionary. I also noticed that the results section says the information system is unreliable. The review only identified one missing label and one inconsistent term in a five-row classroom sample. That evidence does not support a general statement about system reliability. Please separate the observation from the interpretation, describe the sample limitation and list the two items that require clarification. The conclusion should state only what the review established. The document owner can then confirm the preferred labels and update the report history.",
      questions: [
        { prompt: "What are the speakers reviewing?", options: ["A draft classroom technical report", "A real aircraft release certificate", "A staff timetable", "A passenger announcement"], answerIndex: 0, explanation: "They are reviewing a draft classroom report." },
        { prompt: "What is the main problem?", options: ["The report has no title and no pictures", "It makes a conclusion that is broader than the evidence", "It contains too many appendices", "It is written in the wrong language"], answerIndex: 1, explanation: "The claim about system reliability exceeds the small sample evidence." },
        { prompt: "Which reference is missing?", options: ["The source document reference", "The student group number", "The room number", "The printer model"], answerIndex: 0, explanation: "The source document reference is missing." },
        { prompt: "What should be separated?", options: ["The title and date", "The observation and interpretation", "The author and reader", "The table and appendix"], answerIndex: 1, explanation: "The writer should separate the observed finding from its interpretation." },
        { prompt: "What should the writer add?", options: ["An unsupported cause", "A list of passenger names", "The limitations of the review", "A production approval"], answerIndex: 2, explanation: "The report must explain the sample limitation." }
      ]
    },
    {
      id: "en-c05-s02-l03",
      title: "Lesson 3 — Professional Interview and Oral Examination Skills",
      level: "B2",
      script: "Examiner: Why is revision control important in a technical environment? Candidate: Revision control helps a team identify the version of a document being used. It reduces confusion when information is updated. Examiner: Can you give an example? Candidate: Yes. In a fictional classroom case, a drawing extract showed revision C, while a related process sheet referred to revision B. The difference was recorded as an open question. Examiner: Does that prove that one document is incorrect? Candidate: Not by itself. We would need to check the controlled document register and confirm which revision applies to the task. The cause of the mismatch has not been established. Examiner: What would you do next? Candidate: I would record the two references, avoid making an unsupported choice and ask the responsible document owner to confirm the current version. I would then update the handover with the confirmed information.",
      questions: [
        { prompt: "What is the situation?", options: ["A candidate is answering an oral technical question", "A pilot is speaking to passengers", "An operator is starting a production cycle", "A student is ordering lunch"], answerIndex: 0, explanation: "The recording is an examiner-candidate exchange." },
        { prompt: "What is the candidate's main strength?", options: ["The candidate guesses quickly", "The candidate structures the answer and identifies a limitation", "The candidate avoids every question", "The candidate changes the subject"], answerIndex: 1, explanation: "The candidate explains the concept and states what remains unconfirmed." },
        { prompt: "What topic is the examiner asking about?", options: ["Revision control", "Staff holidays", "Aircraft seating", "Food safety"], answerIndex: 0, explanation: "The examiner asks about revision control." },
        { prompt: "What example does the candidate use?", options: ["A fictional mismatch between two document revisions", "A real aircraft repair", "A passenger complaint", "A personal travel story"], answerIndex: 0, explanation: "The candidate describes a fictional revision mismatch." },
        { prompt: "What does the candidate say is not established?", options: ["The document title", "The cause of the mismatch", "The candidate's name", "The classroom number"], answerIndex: 1, explanation: "The cause of the mismatch has not been established." },
        { prompt: "What does the candidate recommend?", options: ["Guess which revision is correct", "Delete the older file", "Record both references and ask the document owner to confirm the current version", "Use either file without checking"], answerIndex: 2, explanation: "The candidate recommends checking the controlled register and confirming the current version." }
      ]
    },
    {
      id: "en-c05-s02-l04",
      title: "Lesson 4 — Reading Specifications, Procedures and Standards",
      level: "B2",
      script: "Student: I found a document extract for our technical report. It is called Training Specification TS-17, revision B. Can I use it as the source? Teacher: First, check its scope and status. The extract says that it is a classroom language exercise. Student: So it can help us practise document vocabulary, but it is not an operational specification? Teacher: Correct. Also, do not assume that revision B is the current controlled version. The exercise only identifies the revision printed on this extract. Student: Should I write that limitation in the report? Teacher: Yes. State that the source is a classroom extract and that its current applicability has not been confirmed. If a real task requires a controlled document, the responsible person must verify the approved source. Student: Understood. I will cite TS-17, revision B, as the supplied classroom extract and keep the limitation clear.",
      questions: [
        { prompt: "What are the speakers discussing?", options: ["Whether a fictional document extract is applicable to a classroom task", "How to repair an aircraft", "How to change a live electrical system", "Which machine should be operated"], answerIndex: 0, explanation: "They discuss the use and limitations of a classroom document extract." },
        { prompt: "What is the main concern?", options: ["The document's title is too long", "The scope and revision need to be checked", "The classroom is too noisy", "The report needs a photograph"], answerIndex: 1, explanation: "The student must verify scope and controlled revision." },
        { prompt: "What is the document reference?", options: ["TS-17", "ST-71", "TS-71", "T5-17"], answerIndex: 0, explanation: "The document is identified as TS-17." },
        { prompt: "Which revision appears in the classroom extract?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "The printed revision is B." },
        { prompt: "What does the student need to confirm?", options: ["The document's applicability and current controlled revision", "The colour of the cover", "The author's personal opinion", "The number of pages only"], answerIndex: 0, explanation: "The student must confirm applicability and current controlled status." },
        { prompt: "What should the student do if the source cannot be confirmed?", options: ["Treat the extract as approved", "Guess the current revision", "State the limitation and ask the responsible person to verify the approved source", "Use it for a real maintenance task"], answerIndex: 2, explanation: "The source must remain identified as an unconfirmed classroom extract." }
      ]
    },
    {
      id: "en-c05-s02-l05",
      title: "Lesson 5 — Manufacturing Process Review and Improvement",
      level: "B2",
      script: "The process-document review covered eight fictional training records. The material-identification stage was documented in all eight records, although one source reference needs clarification. Two records use different terms for the same process stage. The handover section contains three records without an identified action owner. This is an observation about the sample; it does not establish why the fields are missing or whether the same issue exists elsewhere. We recommend that the document owner review the handover template and confirm how action ownership should be recorded. Any wider process change would require a separate review by the responsible team.",
      questions: [
        { prompt: "What is the speaker reporting?", options: ["A fictional process-document review", "A confirmed aircraft production defect", "A machine operating procedure", "A passenger service issue"], answerIndex: 0, explanation: "The speaker reviews fictional training records." },
        { prompt: "What is the main finding?", options: ["Every record is incomplete", "Three handover records do not identify an action owner", "The process has been officially approved", "The team changed a real production parameter"], answerIndex: 1, explanation: "Three handover records lack an action owner." },
        { prompt: "How many training records were reviewed?", options: ["Three", "Six", "Eight", "Eighteen"], answerIndex: 2, explanation: "The speaker says eight fictional records were reviewed." },
        { prompt: "How many handover records lack an action owner?", options: ["One", "Two", "Three", "Eight"], answerIndex: 2, explanation: "Three records have no identified action owner." }
      ]
    },
    {
      id: "en-c05-s02-l06",
      title: "Lesson 6 — CNC Program Review and Revision Communication",
      level: "B2",
      script: "I have compared the two files in the CNC training package. Both use the training ID CNC-TR-04, but their names and header revisions need to be read together. File B includes the letter B in its name and shows revision B in the header. However, the change note only says ‘label updated’, and the approval status is not stated. I have recorded the file names, header information and the missing status field in the review note. I have not selected either file for equipment use. The document owner must confirm the intended classroom version and update the change record.",
      questions: [
        { prompt: "What is the discussion about?", options: ["A revision mismatch in a fictional CNC training file", "A real machine setup instruction", "A passenger information display", "A material delivery"], answerIndex: 0, explanation: "The speaker compares two versions in a training package." },
        { prompt: "What is the reviewer asked to do?", options: ["Select a file and start production", "Record the discrepancy and request clarification", "Delete the change history", "Rewrite the program without review"], answerIndex: 1, explanation: "The reviewer records the mismatch and asks the document owner to clarify." },
        { prompt: "What is the training file ID?", options: ["CNC-TR-04", "CNC-TR-40", "CNC-TB-04", "CN-TR-14"], answerIndex: 0, explanation: "Both files use CNC-TR-04." },
        { prompt: "What does the file name and header of File B show?", options: ["Revision A", "Revision B", "Revision C", "No identifier"], answerIndex: 1, explanation: "File B shows revision B in its name and header." }
      ]
    },
    {
      id: "en-c05-s02-l07",
      title: "Lesson 7 — Electrical System Fault-isolation Case Discussion",
      level: "B2",
      script: "Let us review training case ELEC-CASE-12. The report describes an indicator that was not visible in one classroom observation and was visible in a later observation. We have two observation notes and a simplified training diagram. However, the test conditions are not fully described, the diagram's applicability has not been confirmed and there is no complete measurement record. We therefore cannot identify a confirmed cause or make a statement about the condition of a real electrical system. The next step in this language exercise is to list the missing information and refer the case to the responsible instructor. Our summary must distinguish the reported symptom from any possible explanation.",
      questions: [
        { prompt: "What is the team discussing?", options: ["A fictional electrical training case", "A confirmed aircraft defect", "A real maintenance task", "A CNC production schedule"], answerIndex: 0, explanation: "The case is explicitly a classroom training scenario." },
        { prompt: "What is the main conclusion?", options: ["A component must be replaced", "The cause is confirmed", "The evidence is incomplete and the case needs review", "The diagram can be ignored"], answerIndex: 2, explanation: "Missing test conditions and measurement records prevent a conclusion." },
        { prompt: "What is the training reference?", options: ["ELEC-CASE-12", "ELEC-CASE-21", "EL-CASE-12", "ELEC-12"], answerIndex: 0, explanation: "The case reference is ELEC-CASE-12." },
        { prompt: "What evidence is supplied?", options: ["Two observation notes and a simplified training diagram", "A complete certified test report", "A signed maintenance release", "A live measurement from an aircraft"], answerIndex: 0, explanation: "The speaker identifies two notes and a simplified diagram." }
      ]
    },
    {
      id: "en-c05-s02-l08",
      title: "Lesson 8 — Software Test Results and Data-processing Reports",
      level: "B2",
      script: "This is the summary of the fictional software test set for build EDU-5. Five test cases were reviewed in the classroom environment. SW-01 and SW-04 passed. SW-02 failed because the required unit field was missing from the sample record. SW-03 generated a warning because a duplicate record ID was detected. SW-05 failed because its label mapping differed from the supplied sample dictionary. The summary identifies the observed results, but it does not establish the underlying cause of either failed test. The next step is to preserve the test references, review the input data and confirm the expected mapping with the data owner. No conclusion about real aircraft equipment can be drawn from this exercise.",
      questions: [
        { prompt: "What is being presented?", options: ["A fictional software test summary", "A live aircraft system diagnosis", "A CNC machining instruction", "A passenger boarding announcement"], answerIndex: 0, explanation: "The speaker introduces a fictional software test set." },
        { prompt: "What is the main message?", options: ["All tests passed", "Two test cases need review and one warning concerns a duplicate ID", "The software has been approved for aircraft use", "The test environment was not recorded"], answerIndex: 1, explanation: "SW-02 and SW-05 failed; SW-03 generated a duplicate-ID warning." },
        { prompt: "How many test cases are listed?", options: ["Three", "Four", "Five", "Eight"], answerIndex: 2, explanation: "Five test cases were reviewed." },
        { prompt: "Which test has a missing unit field?", options: ["SW-01", "SW-02", "SW-03", "SW-04"], answerIndex: 1, explanation: "SW-02 failed because its unit field was missing." }
      ]
    },
    {
      id: "en-c05-s02-l09",
      title: "Lesson 9 — Aircraft Component Materials and Inspection Records",
      level: "B2–B2+",
      script: "This is a review of four fictional component material records. Each record has a sample ID, a material family and a lot reference. MAT-21 and MAT-24 show certificate references and complete sample fields. MAT-22 has no certificate reference entered, so its source documentation needs clarification. MAT-23 includes a certificate reference, but the inspection scope field is incomplete. These observations describe the records only. They do not establish the physical condition or acceptance status of any real component. The next step is to refer both documentation gaps to the document owner and confirm the required supporting evidence.",
      questions: [
        { prompt: "What is the speaker reviewing?", options: ["A fictional materials register", "A real aircraft repair", "A passenger manifest", "A CNC operating sequence"], answerIndex: 0, explanation: "The speaker explicitly introduces four fictional material records." },
        { prompt: "What is the main documentation issue?", options: ["Every sample lacks a lot reference", "One certificate reference is missing and another inspection scope is incomplete", "All material families are identical", "The register has been approved for production"], answerIndex: 1, explanation: "MAT-22 lacks a certificate reference; MAT-23 has an incomplete inspection-scope field." },
        { prompt: "Which sample has no certificate reference entered?", options: ["MAT-21", "MAT-22", "MAT-23", "MAT-24"], answerIndex: 1, explanation: "The speaker identifies MAT-22." },
        { prompt: "What does a missing certificate reference prove?", options: ["The material is defective", "The material is acceptable", "It identifies a documentation gap that needs review", "It confirms corrosion"], answerIndex: 2, explanation: "A missing field is a record gap, not a conclusion about physical condition." }
      ]
    },
    {
      id: "en-c05-s02-l10",
      title: "Lesson 10 — Maintenance Planning, Reliability and Service Records",
      level: "B2–B2+",
      script: "This monthly training summary covers four fictional reporting periods. The simulated operating hours increase from one hundred and twenty in January to two hundred and ten in April. Recorded events are three in January, three in February, four in March and four in April. The event count therefore rises slightly across the sample, but the table alone does not explain why. Before interpreting the pattern, the team should check how events were defined, whether reporting practices changed and whether the data covers the same population. This classroom example does not establish a reliability rate or justify a maintenance interval change. The proposed next step is to review the data definitions and the reporting context.",
      questions: [
        { prompt: "What is the briefing about?", options: ["A fictional monthly reliability summary", "A confirmed aircraft defect", "A maintenance procedure", "A material certificate"], answerIndex: 0, explanation: "It is a classroom summary of simulated reporting periods." },
        { prompt: "What is the speaker's main point?", options: ["Event counts rose, but the data needs context", "The system has failed", "The maintenance interval must be changed", "The records can be deleted"], answerIndex: 0, explanation: "The speaker cautions against interpreting counts without context." },
        { prompt: "How many simulated operating hours are shown for April?", options: ["120", "150", "180", "210"], answerIndex: 3, explanation: "April shows 210 simulated operating hours." },
        { prompt: "How many events were recorded in March?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "March has four recorded events." }
      ]
    },
    {
      id: "en-c05-s02-l11",
      title: "Lesson 11 — Integrated Listening: Technical Briefings and Handover",
      level: "B2+",
      script: "Coordinator: Welcome to the training-project handover. We have four open review items. I will confirm the status and the next action for each one. Technologist: For materials record MAT-22, the lot reference is present, but the certificate source has not been entered. The document owner needs to confirm the reference. This is a record gap, not a material-condition conclusion. CNC instructor: The CNC training file has a revision note that does not explain the change clearly. The training coordinator will clarify the version label before the teaching pack is updated. No equipment-use decision is part of this exercise. Electrical instructor: Case ELEC-CASE-12 remains open because the supplied observations do not include a complete evidence set. The instructor will list the missing information. We have not identified a cause. Programmer: Test SW-02 failed the classroom validation because its unit field is missing. The data team will review the validation rule and the sample input. The current report does not explain why the field was absent. Coordinator: Thank you. The receiving team should preserve the four references, check each action owner and record the next update. Please keep confirmed facts separate from possible explanations.",
      questions: [
        { prompt: "What is the purpose of the meeting?", options: ["To hand over four open classroom review items", "To approve aircraft maintenance", "To issue a production release", "To cancel all documentation"], answerIndex: 0, explanation: "The coordinator describes a training-project handover." },
        { prompt: "How many items remain open?", options: ["One", "Two", "Three", "Four"], answerIndex: 3, explanation: "Four records are discussed and remain open for review." },
        { prompt: "Who is asked to confirm the MAT-22 source reference?", options: ["The document owner", "The passenger service team", "The CNC operator", "The data analyst"], answerIndex: 0, explanation: "The technologist assigns this follow-up to the document owner." },
        { prompt: "What is unclear in the CNC training file?", options: ["The revision note", "The material family", "The operating hours", "The test date"], answerIndex: 0, explanation: "The revision note does not explain the change clearly." },
        { prompt: "What is the issue with SW-02?", options: ["The unit field is missing", "The file is deleted", "The test passed", "The sample has no ID"], answerIndex: 0, explanation: "The programmer reports a missing unit field." }
      ]
    },
    {
      id: "en-c05-s02-l12",
      title: "Lesson 12 — Capstone Case: Presenting an Engineering Solution",
      level: "B2+",
      script: "Today’s project review covers four fictional records. First, materials record MAT-22 includes a lot reference, but the certificate source has not been entered. The document owner will confirm the reference. Second, CNC training file CNC-TR-04 is labelled revision B, but the change note does not explain the update and the approval status is not stated. The training coordinator will clarify the document history. Third, electrical case ELEC-CASE-12 contains two classroom observations, but the complete measurement record and test conditions are missing. No cause can be established. The instructor will list the missing information. Finally, software test SW-02 failed its simulated validation because the required unit field was absent. The data team will review the sample input and validation rule. The project presentation must distinguish these confirmed observations from open questions and must not make claims about real aircraft equipment.",
      questions: [
        { prompt: "What is the team's objective?", options: ["To approve a real aircraft for service", "To review a fictional documentation package and assign follow-up actions", "To change a CNC program", "To diagnose an electrical fault"], answerIndex: 1, explanation: "The meeting reviews fictional records and allocates follow-up." },
        { prompt: "How many records are discussed?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "Materials, CNC, electrical and software records are discussed." },
        { prompt: "Which record needs a certificate source reference?", options: ["MAT-22", "CNC-TR-04", "ELEC-CASE-12", "SW-02"], answerIndex: 0, explanation: "MAT-22 has no certificate source entered." },
        { prompt: "Why is no electrical cause stated?", options: ["The diagram is too colourful", "The complete measurement record and test conditions are missing", "The software test passed", "The material family is unknown"], answerIndex: 1, explanation: "The case lacks the measurement record and test conditions needed to establish a cause." },
        { prompt: "What should the final presentation include?", options: ["Unsupported conclusions", "Confirmed facts, limitations, owners and follow-up actions", "A real maintenance procedure", "Invented missing values"], answerIndex: 1, explanation: "The capstone requires evidence-based reporting and explicit limitations." }
      ]
    },
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = String(text);
    return n;
  }
  function esc(s) {
    return window.escapeHtml ? window.escapeHtml(String(s == null ? "" : s)) :
      String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; });
  }
  function render() {
    var app = document.getElementById("app");
    if (!app) return;
    var courseId = String(window.state && window.state.activeCourseId || "");
    if (!window.state || (!window.state.student && !window.state.staff) ||
        (window.canAccessCourse && !window.canAccessCourse(courseId))) {
      app.innerHTML = '<section class="module">Войдите в портал и выберите доступный курс английского языка.</section>';
      return;
    }
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a>' +
      '<section class="hero"><h1>English Listening Lab</h1><p>Курс 5 · Семестр 2 · браузерное озвучивание</p></section>' +
      '<section class="module"><p>Выберите аудирование. Браузер прочитает английский текст вслух. В тренировочном режиме после ответа доступны проверка и расшифровка. Это учебные упражнения, не экзаменационные попытки.</p></section>';
    activities.forEach(function (activity) {
      var card = el("section", "module");
      card.appendChild(el("h2", "", activity.title));
      card.appendChild(el("p", "museum-muted", "Уровень: " + activity.level));
      var mount = el("div", "english-listening-mount");
      card.appendChild(mount);
      app.appendChild(card);
      window.EnglishListeningLesson.render(mount, {
        mode: "practice",
        script: activity.script,
        lang: "en-GB",
        repeatCount: 2,
        rate: 0.88,
        questions: activity.questions
      });
    });
  }

  window.EnglishListeningCatalogue = { render: render, count: activities.length };
})();
