/* Browser-listening practice catalogue: Course 5, Semester 2.
 * This page is practice-only. It does not save grades or create exam attempts.
 */
(function () {
  "use strict";
  if (window.EnglishListeningCatalogue) return;

  var activities = [
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
    }
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
