/* Browser-readable listening activities for English lessons.
 * Practice mode may include answerIndex/explanation.
 * Assessment mode must receive questions WITHOUT answerIndex or explanations;
 * call closeAssessment() only after the assessment has been formally closed.
 */
(function () {
  "use strict";
  if (window.EnglishListeningLesson) return;

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = String(text);
    return el;
  }

  function render(container, options) {
    options = options || {};
    if (!container) throw new Error("Listening lesson container is required.");
    var script = String(options.script || "").trim();
    var questions = Array.isArray(options.questions) ? options.questions : [];
    var mode = options.mode === "assessment" ? "assessment" : "practice";
    if (!script) throw new Error("Listening script is required.");
    if (!questions.length) throw new Error("At least one listening question is required.");
    if (mode === "assessment" && questions.some(function (q) {
      return Object.prototype.hasOwnProperty.call(q, "answerIndex") ||
        Object.prototype.hasOwnProperty.call(q, "explanation");
    })) {
      throw new Error("Assessment questions must not contain client-side answer keys.");
    }

    var closed = false;
    var submitted = false;
    var speech = null;
    container.innerHTML = "";
    container.classList.add("english-listening-lesson");

    var intro = node("p", "museum-muted", mode === "assessment"
      ? "Прослушайте текст и ответьте на вопросы. Расшифровка будет доступна после закрытия работы."
      : "Сначала прослушайте текст, затем выполните задания. Расшифровка откроется после отправки ответов.");
    container.appendChild(intro);

    var audio = node("section", "module");
    audio.appendChild(node("h3", "", "Listening"));
    var audioControls = node("div", "english-listening-player");
    audio.appendChild(audioControls);
    container.appendChild(audio);

    if (window.EnglishListeningTTS && typeof window.EnglishListeningTTS.render === "function") {
      speech = window.EnglishListeningTTS.render(audioControls, {
        text: script,
        lang: options.lang || "en-GB",
        repeatCount: options.repeatCount || 2,
        rate: options.rate || 0.88
      });
    } else {
      audioControls.appendChild(node("p", "museum-muted", "Озвучивание недоступно. Проверьте, подключён ли модуль английского аудирования."));
    }

    var questionBox = node("section", "module");
    questionBox.appendChild(node("h3", "", "Check your understanding"));
    var form = node("form", "english-listening-questions");
    questions.forEach(function (q, index) {
      var field = node("fieldset", "english-listening-question");
      field.style.cssText = "border:0;border-bottom:1px solid var(--border);padding:12px 0;margin:0";
      var legend = node("legend", "", (index + 1) + ". " + String(q.prompt || ""));
      legend.style.cssText = "font-weight:700;margin-bottom:8px";
      field.appendChild(legend);
      (q.options || []).forEach(function (option, optionIndex) {
        var label = node("label", "");
        label.style.cssText = "display:flex;gap:8px;align-items:flex-start;margin:7px 0";
        var input = node("input");
        input.type = "radio";
        input.name = "english-listening-q-" + index;
        input.value = String(optionIndex);
        input.required = true;
        label.appendChild(input);
        label.appendChild(node("span", "", option));
        field.appendChild(label);
      });
      form.appendChild(field);
    });
    var submit = node("button", "btn", mode === "assessment" ? "Отправить ответы" : "Проверить ответы");
    submit.type = "submit";
    form.appendChild(submit);
    questionBox.appendChild(form);
    var feedback = node("div", "english-listening-feedback");
    feedback.setAttribute("aria-live", "polite");
    questionBox.appendChild(feedback);
    container.appendChild(questionBox);

    var transcriptDetails = node("details", "english-listening-transcript");
    transcriptDetails.hidden = true;
    var summary = node("summary", "", "Transcript — открыть расшифровку");
    transcriptDetails.appendChild(summary);
    transcriptDetails.appendChild(node("p", "", script));
    container.appendChild(transcriptDetails);

    function revealTranscript() {
      transcriptDetails.hidden = false;
      transcriptDetails.open = false;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (submitted || closed) return;
      var selected = questions.map(function (q, index) {
        var checked = form.querySelector('input[name="english-listening-q-' + index + '"]:checked');
        return checked ? Number(checked.value) : null;
      });
      if (selected.some(function (value) { return value === null; })) {
        feedback.textContent = "Ответьте на каждый вопрос перед отправкой.";
        return;
      }
      submitted = true;
      Array.prototype.forEach.call(form.querySelectorAll("input"), function (input) { input.disabled = true; });
      submit.disabled = true;
      if (mode === "practice") {
        var correct = 0;
        questions.forEach(function (q, index) {
          var hasKey = Number.isInteger(Number(q.answerIndex));
          var ok = hasKey && selected[index] === Number(q.answerIndex);
          if (ok) correct += 1;
          var row = form.querySelector('input[name="english-listening-q-' + index + '"][value="' + selected[index] + '"]');
          if (row) {
            var label = row.closest("label");
            if (label) label.appendChild(node("strong", "english-listening-result", ok ? " — Correct" : " — Review"));
          }
          if (q.explanation) feedback.appendChild(node("p", "museum-muted", (index + 1) + ". " + q.explanation));
        });
        feedback.insertBefore(node("p", "", "Результат: " + correct + " из " + questions.length + "."), feedback.firstChild);
        revealTranscript();
      } else {
        feedback.textContent = "Ответы зафиксированы в этом окне. Для сохранения и проверки передайте их экзаменационному модулю.";
        if (typeof options.onSubmit === "function") {
          options.onSubmit({ answers: selected.slice(), questionCount: questions.length });
        }
      }
    });

    return {
      closeAssessment: function () {
        if (mode !== "assessment") return false;
        closed = true;
        revealTranscript();
        return true;
      },
      getAnswers: function () {
        return questions.map(function (q, index) {
          var checked = form.querySelector('input[name="english-listening-q-' + index + '"]:checked');
          return checked ? Number(checked.value) : null;
        });
      },
      destroy: function () {
        if (speech && typeof speech.destroy === "function") speech.destroy();
        container.innerHTML = "";
      }
    };
  }

  window.EnglishListeningLesson = { render: render };
})();
