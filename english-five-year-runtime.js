/* Five-year English programme runtime additions.
 * Adds the three Course 4 / Semester 1 lessons to the existing Technical English
 * electricity unit without replacing the original textbook lectures.
 * Listening is attached by app.js through the stable lesson IDs in the catalogue.
 */
(function () {
  "use strict";
  var data = window.MDK_DATA;
  if (!data || !data.ENT || !Array.isArray(data.ENT.sections)) {
    console.error("[English 5Y] Technical English course is not available; additions skipped.");
    return;
  }
  var topic = null;
  data.ENT.sections.some(function (section) {
    return (section.topics || []).some(function (item) {
      if (item.id === "t-unit4") { topic = item; return true; }
      return false;
    });
  });
  if (!topic) {
    console.error("[English 5Y] Topic t-unit4 was not found; additions skipped.");
    return;
  }
  topic.lectures = Array.isArray(topic.lectures) ? topic.lectures : [];
  var lessons = [
    {
      code: "4.10",
      title: "Aircraft Electrical Power: Sources and Distribution",
      content: `
<h2>Learning outcomes</h2>
<p>By the end of this lesson, students can name common aircraft electrical power sources, describe a simplified distribution path, use sequence markers and distinguish a general system description from a fault report.</p>
<h3>Key vocabulary</h3>
<table><thead><tr><th>English</th><th>Russian</th></tr></thead><tbody>
<tr><td>electrical power</td><td>электрическая энергия</td></tr><tr><td>power source</td><td>источник питания</td></tr><tr><td>generator</td><td>генератор</td></tr><tr><td>battery</td><td>аккумуляторная батарея</td></tr><tr><td>busbar / bus</td><td>шина</td></tr><tr><td>distribution</td><td>распределение</td></tr><tr><td>circuit breaker</td><td>автоматический выключатель</td></tr><tr><td>load</td><td>нагрузка / потребитель</td></tr><tr><td>backup supply</td><td>резервное питание</td></tr><tr><td>supply voltage</td><td>напряжение питания</td></tr></tbody></table>
<h3>Language focus: describing a system</h3>
<p>Use the Present Simple for general functions: <em>A generator supplies electrical power. The bus distributes power to selected loads.</em> Use sequence markers: <b>first → then → after that → finally</b>.</p>
<p><b>Model:</b> First, the source provides electrical power. Then, the power is routed through the distribution system. After that, the relevant circuits supply the connected loads. Finally, the diagram identifies protective devices.</p>
<h3>Reading: A simplified training diagram</h3>
<p>A training aircraft electrical-system diagram shows a generator, a battery, a distribution bus, protective devices and several electrical loads. The generator is represented as one source of electrical power. The battery is shown as a separate source. The bus provides a common distribution point. Individual circuits lead from the distribution area to the loads.</p>
<p>This classroom diagram is not a maintenance procedure. It does not provide switching instructions, operating limits or test points. Its purpose is to help students recognise components and understand the relationship between a source, a distribution point and a load.</p>
<h3>Check your understanding</h3><ol><li>Name two sources shown in the text.</li><li>What is the function of the bus in this simplified description?</li><li>Does the training diagram provide operating instructions? Explain.</li></ol>
<h3>Practice</h3><p><b>Match:</b> source — where electrical power originates; bus — a distribution point; load — a component or system that uses power; protective device — an element that helps protect a circuit.</p>
<p><b>Complete:</b> “First, the ______ provides power. Then, power is routed to the distribution ______. The circuit supplies the connected ______.” Use <em>source, bus, load</em>.</p>
<h3>Self-check</h3><p>Answers: generator and battery; the bus is a common distribution point; no, the diagram is for vocabulary and system-description practice only. Gap-fill: source, bus, load.</p>
<h3>Independent work</h3><p>Create a bilingual glossary of 12 terms. Write a 100–120-word description of a simplified training diagram and include at least four sequence markers.</p>
<p><b>Safety note:</b> this is a language-learning simulation, not an instruction for operating, testing, repairing or modifying a real aircraft system. Real work requires approved maintenance data and authorised personnel.</p>`
    },
    {
      code: "4.11",
      title: "Wiring Diagrams, Connectors, Bonding and Grounding",
      content: `
<h2>Learning outcomes</h2>
<p>Students can identify the purpose of a wiring diagram, recognise common drawing labels, distinguish connectors from bonding and grounding references, and describe a documented connection using cautious language.</p>
<h3>Key vocabulary</h3>
<table><thead><tr><th>English</th><th>Russian</th></tr></thead><tbody>
<tr><td>wiring diagram</td><td>схема электропроводки</td></tr><tr><td>wire</td><td>провод</td></tr><tr><td>harness</td><td>жгут проводов</td></tr><tr><td>connector</td><td>разъём</td></tr><tr><td>pin</td><td>контакт разъёма</td></tr><tr><td>terminal</td><td>клемма / контактный вывод</td></tr><tr><td>bonding</td><td>электрическое соединение для уравнивания потенциалов</td></tr><tr><td>ground / earth</td><td>масса / заземление (по контексту)</td></tr><tr><td>continuity</td><td>электрическая непрерывность цепи</td></tr><tr><td>revision</td><td>редакция документа</td></tr></tbody></table>
<h3>Reading a drawing: title, symbols and references</h3>
<p>A technical drawing is more than a picture. Its title identifies the subject. A document number and revision identify the controlled issue. Labels connect the drawing to a parts list or another document. Symbols represent components and connections according to the drawing legend.</p>
<p>A connector is a physical joining component. A pin is an individual contact position. Bonding describes an electrical connection intended to maintain electrical continuity between conductive structures. A ground reference identifies a point or network according to the system documentation. These terms are related, but they are not interchangeable.</p>
<p><b>Terminology note:</b> <em>ground</em> and <em>earth</em> can vary by technical standard and context. Follow the terminology used in the specific approved document.</p>
<h3>Useful language</h3>
<ul><li>“The connector is identified as…”</li><li>“The wire is shown between… and…”</li><li>“According to the drawing legend…”</li><li>“The document revision is…”</li><li>“The available information does not identify…”</li></ul>
<h3>Check your understanding</h3><ol><li>What information does a revision field provide?</li><li>Is a connector the same thing as a pin?</li><li>Why should a reader consult the drawing legend?</li><li>Why must the term <em>ground</em> be interpreted in context?</li></ol>
<h3>Practice</h3><p><b>Choose:</b> a physical joining component — connector / revision; an individual contact position — pin / harness; a controlled issue identifier — revision / load; a grouped set of wires — harness / busbar.</p>
<p><b>Speaking:</b> In pairs, describe a fictional training drawing. Ask for the document number, revision, connector reference and legend information. Use only the teacher-provided training sheet.</p>
<h3>Self-check</h3><p>Answers: the revision identifies the controlled issue; no, a pin is an individual contact position; the legend defines symbols; the meaning of ground depends on the applicable standard and document.</p>
<h3>Independent work</h3><p>Prepare a one-page annotated explanation of a teacher-provided, non-operational training wiring diagram. Label the title block, revision, legend, connector references and ground symbol. Add a 6–8 sentence explanation in English.</p>
<p><b>Safety note:</b> do not infer a real aircraft pin-out or connection procedure from a classroom illustration.</p>`
    },
    {
      code: "4.12",
      title: "Electrical Measurements and Describing a Fault",
      content: `
<h2>Learning outcomes</h2>
<p>Students can name common electrical measurement quantities and instruments, report values with units, distinguish an observation from a suspected cause, and write a concise fault description based on supplied evidence.</p>
<h3>Key vocabulary</h3>
<table><thead><tr><th>English</th><th>Russian</th></tr></thead><tbody>
<tr><td>voltage</td><td>напряжение</td></tr><tr><td>current</td><td>сила тока</td></tr><tr><td>resistance</td><td>сопротивление</td></tr><tr><td>measurement</td><td>измерение</td></tr><tr><td>multimeter</td><td>мультиметр</td></tr><tr><td>reading</td><td>показание прибора</td></tr><tr><td>unit</td><td>единица измерения</td></tr><tr><td>nominal value</td><td>номинальное значение</td></tr><tr><td>deviation</td><td>отклонение</td></tr><tr><td>fault report</td><td>отчёт о неисправности</td></tr></tbody></table>
<h3>Language focus: reporting values and uncertainty</h3>
<ul><li>“The recorded value is 24 volts.”</li><li>“The value is outside the range stated in the exercise.”</li><li>“The observation may indicate a problem, but the cause has not been confirmed.”</li><li>“Further inspection is required by authorised personnel.”</li></ul>
<p>Use <b>was recorded / was observed / was reported</b> for passive reporting. Use <b>may, might, could</b> to express a possibility rather than a confirmed conclusion.</p>
<h3>Reading: A classroom fault report</h3>
<p><b>Fictional training case — not an aircraft maintenance record.</b> A student receives a classroom data sheet for a simulated low-voltage indication. The sheet contains a reference value, a recorded value, a unit and a time stamp. The recorded value differs from the reference range printed on the exercise sheet. The student writes that a deviation was observed. The student does not identify a failed component because the supplied information does not prove the cause.</p>
<p>A good report includes the training-case identifier, document reference, recorded value and unit, comparison with the stated reference, time of observation and a clear statement of what is not yet known. It does not recommend an unauthorised action.</p>
<h3>Check your understanding</h3><ol><li>What is the difference between a reference value and a recorded value?</li><li>Has the cause been confirmed in the fictional case?</li><li>Name four items that should appear in the report.</li></ol>
<h3>Practice</h3><p><b>Match:</b> voltage — volt (V); current — ampere (A); resistance — ohm (Ω).</p>
<p><b>Rewrite cautiously:</b> “The component is broken.” Evidence: one recorded value is outside the exercise range. Write a sentence that reports only the evidence.</p>
<p><b>Complete:</b> “The recorded ______ is 21.8 V. The value is ______ the reference range. The cause has not been ______.”</p>
<h3>Self-check</h3><p>Answers: the reference is the comparison value, while the recorded value is the measurement; no, the cause is not confirmed; include case ID, document reference, value and unit, time, comparison and uncertainty statement. Gap-fill: value; below; confirmed.</p>
<h3>Independent work</h3><p>Write a 70–90-word observation report based on a teacher-provided fictional measurement table. Include at least two values with units. Separate facts from possible explanations.</p>
<p><b>Safety note:</b> this is a classroom reporting exercise. It is not a procedure for measuring, testing or repairing real aircraft equipment.</p>`
    }
  ];
  var added = 0;
  lessons.forEach(function (lesson) {
    if (topic.lectures.some(function (item) { return String(item.code) === lesson.code; })) return;
    topic.lectures.push(lesson);
    added += 1;
  });
  console.info("[English 5Y] Course 4 / Semester 1 lessons added:", added);
})();
