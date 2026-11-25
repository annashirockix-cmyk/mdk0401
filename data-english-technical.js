"use strict";

window.MDK_DATA = window.MDK_DATA || {};

(function () {
  function splitTeacherSections(content) {
    var student = String(content || "");
    var teacher = [];
    var headingPattern = /<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/gi;
    var headings = [], match;
    while ((match = headingPattern.exec(student))) {
      var plain = match[0].replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").toLowerCase();
      headings.push({ start: match.index, end: headingPattern.lastIndex, html: match[0], plain: plain,
        isKey: /ключ преподавателя|teacher key|answer key|ответы для преподавателя/.test(plain) });
    }
    var edits = [];
    headings.forEach(function (heading, index) {
      if (!heading.isKey) return;
      var end = index + 1 < headings.length ? headings[index + 1].start : student.length;
      var section = student.slice(heading.start, end);
      teacher.push(section);
      if (/самопроверка/.test(heading.plain)) {
        var visible = section.replace(heading.html, function (html) {
          return html.replace(/ключ преподавателя|teacher key|answer key|ответы для преподавателя/gi, "")
            .replace(/\s+и(?=\s*<\/h)/i, "").replace(/\s+<\/h/i, "</h");
        });
        visible = visible.replace(/(<li\b[^>]*>)([\s\S]*?)(<\/li>)/gi, function (full, open, body, close) {
          var answerAt = body.search(/\s+[—–-]\s+/);
          return answerAt >= 0 ? open + body.slice(0, answerAt).trim() + close : full;
        });
        edits.push({ start: heading.start, end: end, text: visible });
      } else {
        edits.push({ start: heading.start, end: end, text: "" });
      }
    });
    edits.sort(function (a, b) { return b.start - a.start; }).forEach(function (edit) {
      student = student.slice(0, edit.start) + edit.text + student.slice(edit.end);
    });
    return { student: student, teacher: teacher.join("\n") };
  }
  function lec(code, title, content) {
    var split = splitTeacherSections(content);
    return { code: code, title: title, content: split.student, teacherContent: split.teacher };
  }
  function prac(code, title, goal, task, variants) { return { code, title, goal, task, variants: variants || [] }; }
  function selfwork(code, title, task) { return { code, title, task }; }
  function tq(q, options) { return { q: q, options: options }; }
  function topic(id, code, title, lectures, practicals, selfWork, test, writing) {
    return { id, code, title, lectures, practicals, selfWork, test, writing };
  }

  window.MDK_DATA["technical"] = {
    id: "technical",
    shortName: "Technical English",
    title: "Technical English (ESP, Mechanics & Electronics)",
    module: "English for Specific Purposes · Mechanics & Electronics",
    sections: [
      {
        code: "UNIT 1",
        title: "Materials and Metal Processes",
        topics: [
          topic("t-unit1", "Unit 1", "Materials",
            [
              lec("1.1", "Materials in Mechanical Engineering", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится называть основные группы материалов, описывать их свойства и объяснять, почему выбор материала зависит от назначения детали и условий эксплуатации. Материал вводит базовую лексику механики и авиационного производства без назначения конкретной марки материала для реальной детали.</p>
<h3>1. Reading: Materials in Mechanical Engineering</h3>
<p>Engineers select materials according to the function of a component and the conditions in which it will be used. Important properties include strength, hardness, toughness, density, corrosion resistance, thermal conductivity and electrical conductivity. No material is best for every application: a choice is always a balance of requirements, cost, manufacturing methods and service conditions.</p>
<p>Common engineering material groups include metals, polymers, ceramics and composites. Metals are often divided into ferrous and non-ferrous groups. Ferrous metals contain iron as a main element; steels and cast irons are important examples. Steel is an iron-based alloy in which carbon and other elements influence properties. Non-ferrous metals include aluminium, copper, titanium, zinc and their alloys.</p>
<p>Polymers include plastics and elastomers. PVC is used in some cable insulation applications, while rubber-like elastomers can deform and recover their shape. Ceramics are often hard and heat-resistant, but many are brittle. Composite materials combine two or more constituents to obtain a combination of properties; fibre-reinforced composites are used in some aircraft structures. The exact material and its suitability must be confirmed from approved specifications and engineering documentation.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>strength</td><td>прочность</td><td>The component requires sufficient strength.</td></tr>
<tr><td>hardness</td><td>твёрдость</td><td>Hardness is one material property.</td></tr>
<tr><td>toughness</td><td>вязкость, сопротивление разрушению</td><td>Toughness describes resistance to fracture.</td></tr>
<tr><td>density</td><td>плотность</td><td>Aluminium alloys have relatively low density.</td></tr>
<tr><td>corrosion resistance</td><td>коррозионная стойкость</td><td>Corrosion resistance matters in some environments.</td></tr>
<tr><td>alloy</td><td>сплав</td><td>Steel is an iron-based alloy.</td></tr>
<tr><td>polymer</td><td>полимер</td><td>Many plastics are polymers.</td></tr>
<tr><td>ceramic</td><td>керамика</td><td>Some ceramics resist high temperatures.</td></tr>
<tr><td>composite</td><td>композиционный материал</td><td>A composite combines different constituents.</td></tr>
</table>
<h3>3. Language focus: describing properties</h3>
<p>Используйте <i>is/are + adjective</i>: <i>Aluminium is lightweight. Ceramics are often hard and brittle.</i> Для осторожного обобщения подходят <i>often, usually, may, can</i>. Сравнение: <i>lighter than, harder than, more corrosion-resistant than</i>. Конструкция <i>is used for</i> описывает применение: <i>PVC is used for some types of cable insulation.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What factors influence material selection?</li><li>Name four groups of engineering materials.</li><li>What is an alloy?</li><li>How are ferrous and non-ferrous metals different?</li><li>Why are composites used in some engineering applications?</li><li>Where should the final material specification be checked?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите свойство и объяснение:</b> strength; density; hardness; corrosion resistance. Варианты: resistance to surface indentation; mass per unit volume; ability to resist applied load; ability to resist chemical/environmental attack.</p>
<p><b>Задание B. Дополните:</b> 1) Steel is an iron-based ___. 2) Plastics are examples of ___. 3) A material made from two or more constituents is a ___. 4) A material that can resist fracture has good ___.</p>
<p><b>Задание C. Сравните два учебных материала по двум свойствам. Используйте lighter than, harder than, more flexible than и осторожные формулировки.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Function, loads, environment, manufacturing method, cost and specification requirements.</li><li>Metals, polymers, ceramics and composites.</li><li>A material made by combining an element with one or more other elements, at least one of them metallic.</li><li>Ferrous metals have iron as a main element; non-ferrous metals do not.</li><li>They can combine properties of different constituents.</li><li>In the approved specification and engineering documentation.</li><li>Задание A: hardness; density; strength; corrosion resistance.</li><li>alloy; polymers; composite; toughness.</li></ol>
<p><b>Самостоятельная работа:</b> выберите материал из учебного текста и подготовьте карточку из 80–100 слов: material group, two properties, one possible application and one limitation. Не назначайте материал для реального авиационного компонента без спецификации.</p>
`),
              lec("1.2", "Metal Processes: Casting, Drawing, Forging", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится описывать литьё, волочение и ковку, называть основные этапы процессов и различать их назначение. Технологические параметры и допустимость конкретного процесса определяются производственной документацией, а не этим языковым учебным материалом.</p>
<h3>1. Reading: Three Metal-forming Processes</h3>
<p><b>Casting</b> produces a part by pouring or otherwise introducing molten material into a mould and allowing it to solidify. The mould cavity defines the shape. Casting can produce complex geometries, but the process requires suitable materials, mould design and quality controls. Possible defects include porosity, shrinkage cavities and incomplete filling.</p>
<p><b>Drawing</b> is a forming process in which material is pulled through a die to reduce its cross-section or produce a required profile. Wire drawing produces wire; bar and tube drawing produce other long products. The process changes dimensions and may affect the material's properties.</p>
<p><b>Forging</b> shapes metal through compressive forces applied by a hammer, press or other forging equipment. It can produce strong components with suitable grain flow, depending on material and process design. Forging may be carried out hot or cold; the correct method depends on the material, geometry and manufacturing requirements.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>mould</td><td>форма для литья</td><td>The molten material enters the mould.</td></tr>
<tr><td>cavity</td><td>полость</td><td>The mould cavity defines the shape.</td></tr>
<tr><td>to solidify</td><td>затвердевать</td><td>The material solidifies in the mould.</td></tr>
<tr><td>die</td><td>волока / матрица (по процессу)</td><td>The material passes through a die.</td></tr>
<tr><td>cross-section</td><td>поперечное сечение</td><td>The process changes the cross-section.</td></tr>
<tr><td>compressive force</td><td>сжимающее усилие</td><td>Forging uses compressive force.</td></tr>
<tr><td>hammer / press</td><td>молот / пресс</td><td>A press can apply a controlled force.</td></tr>
<tr><td>defect</td><td>дефект</td><td>Inspection may identify a casting defect.</td></tr>
</table>
<h3>3. Process language</h3>
<p>Для описания этапов используйте <i>first, next, then, after that, finally</i>. Пассивный залог часто встречается в технологическом описании: <i>The material is poured into a mould. The wire is pulled through a die. The metal is shaped by compressive force.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What defines the shape of a cast part?</li><li>What happens to material during drawing?</li><li>What type of force is used in forging?</li><li>Name one possible casting defect.</li><li>Why must process selection follow approved documentation?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Определите процесс:</b> 1) molten material enters a mould; 2) material is pulled through a die; 3) metal is shaped by compressive force.</p>
<p><b>Задание B. Вставьте слово:</b> mould, die, solidify, compressive, defect. 1) The material must ___ before the part is removed. 2) Drawing uses a ___. 3) Forging applies a ___ force. 4) Porosity is a possible casting ___.</p>
<p><b>Задание C. Опишите один процесс в пяти предложениях, используя пассивный залог и маркеры последовательности.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>The mould cavity.</li><li>It is pulled through a die and its cross-section is changed.</li><li>Compressive force.</li><li>Porosity, shrinkage cavity or incomplete filling.</li><li>Because material, geometry, quality and safety requirements vary.</li><li>Casting; drawing; forging.</li><li>solidify; die; compressive; defect.</li></ol>
<p><b>Самостоятельная работа:</b> подготовьте сравнительную таблицу casting / drawing / forging: input material, basic principle, typical product form, one advantage and one limitation.</p>
`),
              lec("1.3", "Metal Processes: Rolling, Extrusion, Sheet forming", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится описывать прокатку, экструзию и формование листового материала, сравнивать процессы и использовать лексику для объяснения формы заготовки и результата обработки.</p>
<h3>1. Reading: Rolling, Extrusion and Sheet Forming</h3>
<p><b>Rolling</b> is a forming process in which material passes between rotating rolls. The rolls apply pressure and change the thickness or cross-section. Hot rolling is performed above a material-specific temperature range that allows significant plastic deformation; cold rolling is performed at a lower temperature and can improve dimensional accuracy and surface finish, while also changing the material's mechanical properties.</p>
<p><b>Extrusion</b> forces material through a die opening to produce a long product with a defined cross-section. It is used with metals and polymers and, in specialised processes, with other materials. The shape of the die determines the profile of the extruded product. Examples include rods, tubes, profiles and some plastic sections.</p>
<p><b>Sheet forming</b> changes the shape of sheet material through operations such as bending, drawing and stamping. A punch and die may be used to form a component. The choice of process depends on material properties, thickness, geometry, required accuracy and production volume.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>roll</td><td>валок</td><td>The material passes between two rolls.</td></tr>
<tr><td>thickness</td><td>толщина</td><td>Rolling can reduce thickness.</td></tr>
<tr><td>extrusion</td><td>экструзия</td><td>Extrusion produces a constant profile.</td></tr>
<tr><td>die opening</td><td>отверстие матрицы</td><td>The die opening defines the profile.</td></tr>
<tr><td>sheet metal</td><td>листовой металл</td><td>Sheet metal can be bent or stamped.</td></tr>
<tr><td>punch</td><td>пуансон</td><td>A punch applies force to the sheet.</td></tr>
<tr><td>stamping</td><td>штамповка</td><td>Stamping can form repeated components.</td></tr>
<tr><td>production volume</td><td>объём производства</td><td>Production volume influences process choice.</td></tr>
</table>
<h3>3. Comparing processes</h3>
<p>Используйте <i>whereas, while, unlike, both, however</i>: <i>Rolling passes material between rolls, whereas extrusion pushes material through a die. Both processes can produce long products; however, the cross-section is formed in different ways.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What do rolls do during rolling?</li><li>What determines the profile of an extruded product?</li><li>Name two sheet-forming operations.</li><li>What factors influence process selection?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Выберите процесс:</b> 1) material passes between rotating rolls; 2) material is forced through a die opening; 3) a sheet is shaped by a punch and die.</p>
<p><b>Задание B. Дополните сравнение:</b> Rolling uses rolls, whereas extrusion uses a ___. Both processes change the material's ___. Sheet forming is used for working with thin or flat ___.</p>
<p><b>Задание C. Напишите 5–6 предложений, сравнивая два процесса по принципу действия и форме готового изделия.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>They apply pressure and change thickness or cross-section.</li><li>The shape of the die opening.</li><li>Bending, drawing or stamping.</li><li>Material properties, thickness, geometry, accuracy and production volume.</li><li>Rolling; extrusion; sheet forming.</li><li>die; cross-section/shape; sheet metal.</li></ol>
<p><b>Самостоятельная работа:</b> составьте глоссарий из 10 терминов по теме формообразования и опишите на английском один процесс, используя не менее четырёх слов из глоссария.</p>
`)
            ],
            [], // Practicals
            [], // SelfWork
            [
              tq("Which material is lightweight and corrosion-resistant?", ["Aluminium", "Cast iron", "Steel", "Ceramic"]),
              tq("'Ductility' means the ability to", ["be drawn into wire", "break easily", "resist heat", "conduct electricity"]),
              tq("Cast iron is ___ than steel.", ["more brittle", "stronger", "lighter", "softer"]),
              tq("An alloy of iron and carbon is called", ["steel", "aluminium", "copper", "brass"]),
              tq("What process uses a die to create wires?", ["Drawing", "Casting", "Forging", "Rolling"]),
              tq("Which process requires heating metal and shaping it with a press?", ["Forging", "Drawing", "Extrusion", "Rolling"])
            ],
            [
              { code: "W 1.1", title: "Match words with definitions", task: "Match the words with their definitions:\n1 alloy\na a type of plastic used for insulation\n2 steel\nb a combination of different metals\n3 PVC\nc an alloy formed by mixing iron and carbon\n4 concrete\nd an alloy formed by mixing copper and zinc\n5 brass\ne metals containing iron\n6 ferrous materials\nf a composite material used to build houses\n7 ceramic\ng a metal not suitable as structural material\n8 iron\nh a good insulator but brittle" },
              { code: "W 1.2", title: "Answer the questions", task: "Answer the questions based on the text 'Materials':\n1 What is the basic classification of metals?\n2 What are the characteristics of iron?\n3 Why are alloys created?\n4 Which materials are good insulators?\n5 Is steel an alloy? Which metal does it contain?" },
              { code: "W 1.3", title: "Put the words in the correct order", task: "Put the words in the correct order to make complete sentences:\n1 taking their forms / fluid substances / into moulds / solidify\n2 drawing / room temperature / is done at\n3 not essential / heat / is / in the drawing process\n4 in the past / using / forging / a hammer / was done\n5 can be / brittle materials / extrusion / done / with\n6 many / is used / everyday objects / sheet forming / to make" },
              { code: "W 1.4", title: "Summary", task: "Write a summary of the texts following the flow chart:\n- Write about the importance in engineering of having a specific knowledge of materials.\n- List the materials and the main groups used in mechanics.\n- Tell the difference between ferrous and non-ferrous metals.\n- Say what an alloy is and why it is used.\n- Write a list of non-ferrous metals and alloys." }
            ]
          )
        ]
      },
            {
        code: "UNIT 2",
        title: "Technical Drawing",
        topics: [
          topic("t-unit2", "Unit 2", "Technical Drawing",
            [
              lec("2.1", "Technical Drawing and Tools", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать назначение технического чертежа, распознавать основные элементы чертёжной документации и описывать инструменты для ручного черчения. Размеры, допуски и обозначения следует читать по применимому стандарту и утверждённой документации.</p>
<h3>1. Reading: What Is a Technical Drawing?</h3>
<p>A technical drawing communicates information about a component or assembly. It may show the shape, dimensions, material, surface requirements, tolerances, symbols and notes needed for manufacture or inspection. Unlike an artistic picture, a technical drawing follows agreed conventions so that different specialists can interpret it consistently.</p>
<p>Drawings may include several views, sections and detail views. A title block usually identifies the drawing, part, scale, revision and other document information. Dimensions must be read with their units and relevant tolerances. A drawing should always be checked for its revision status before it is used for a task.</p>
<p>Traditional manual drafting uses tools such as a ruler, compass, set square, protractor, drawing board and pencils of different grades. Modern technical work often uses CAD software, but the basic principles of accuracy, clear lines, correct dimensions and document control remain important.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>technical drawing</td><td>технический чертёж</td><td>The drawing describes the component.</td></tr>
<tr><td>dimension</td><td>размер</td><td>Check the dimension and its unit.</td></tr>
<tr><td>tolerance</td><td>допуск</td><td>The tolerance defines permitted variation.</td></tr>
<tr><td>scale</td><td>масштаб</td><td>The scale is shown in the title block.</td></tr>
<tr><td>section view</td><td>разрез</td><td>A section view shows internal features.</td></tr>
<tr><td>detail view</td><td>выносной элемент</td><td>A detail view enlarges a small feature.</td></tr>
<tr><td>title block</td><td>основная надпись</td><td>The title block identifies the drawing.</td></tr>
<tr><td>revision</td><td>редакция документа</td><td>Use the approved revision.</td></tr>
<tr><td>protractor</td><td>транспортир</td><td>A protractor measures an angle.</td></tr>
</table>
<h3>3. Language focus: describing a drawing</h3>
<p>Для указания элементов используйте <i>shows, contains, indicates, is marked, is dimensioned</i>. Для положения: <i>above, below, next to, in the centre, on the left/right</i>. Пример: <i>The front view shows the overall shape. The hole diameter is indicated in the detail view.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What information can a technical drawing communicate?</li><li>What is the purpose of a section view?</li><li>Which information may appear in the title block?</li><li>Why should the revision status be checked?</li><li>Name four tools used in manual drafting.</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите инструмент и назначение:</b> ruler; compass; protractor; set square. Варианты: draw circles/arcs; measure or draw straight lines; measure angles; draw perpendicular or standard angles.</p>
<p><b>Задание B. Заполните:</b> 1) A ___ view shows internal features. 2) The drawing ___ identifies its current issue. 3) A ___ defines permitted variation.</p>
<p><b>Задание C. Опишите воображаемый простой чертёж: назовите три вида/элемента, один размер, единицу и сведения из основной надписи. Не придумывайте допуски для реальной детали.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Shape, dimensions, material, tolerances, surface requirements, symbols and notes.</li><li>It shows internal features as if the object were cut.</li><li>Drawing/part identification, scale, revision and other document data.</li><li>To avoid using obsolete or unapproved information.</li><li>Ruler, compass, set square, protractor, pencils/drawing board.</li><li>Задание A: ruler—straight lines; compass—circles/arcs; protractor—angles; set square—perpendicular/standard angles.</li><li>section; revision; tolerance.</li></ol>
<p><b>Самостоятельная работа:</b> подготовьте описание учебного чертежа на 80–100 слов. Укажите вид, размеры, единицы, основную надпись и статус редакции.</p>
`),
              lec("2.2", "CAD/CAM Systems", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится объяснять различие между CAD и CAM, описывать типичный цифровой процесс от модели до производственной документации и использовать лексику для обсуждения изменений, проверки и передачи данных.</p>
<h3>1. Reading: CAD and CAM in Product Development</h3>
<p>Computer-aided design (CAD) software helps engineers create, modify and analyse digital models and drawings. A model may represent the geometry of a part or an assembly. Depending on the software and the available data, designers can inspect dimensions, check how components fit together and prepare drawings or other technical information.</p>
<p>Computer-aided manufacturing (CAM) uses digital product and process information to plan or support manufacturing operations. In a typical workflow, a designer prepares a model, the relevant data are reviewed, and manufacturing instructions are created for the selected equipment and process. The resulting programme and setup information must be checked by qualified personnel against approved requirements before use.</p>
<p>CAD and CAM can be linked, but they are not the same thing. CAD focuses on design information; CAM focuses on manufacturing planning and instructions. A digital model does not automatically guarantee a correct product. Data quality, material selection, tool information, machine capability, revision control and inspection remain important. Engineers use digital systems to improve communication and reduce some errors, not to remove the need for verification.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>computer-aided design (CAD)</td><td>система автоматизированного проектирования</td><td>CAD is used to create digital models.</td></tr>
<tr><td>computer-aided manufacturing (CAM)</td><td>автоматизированная подготовка производства</td><td>CAM supports manufacturing planning.</td></tr>
<tr><td>digital model</td><td>цифровая модель</td><td>The digital model represents the part.</td></tr>
<tr><td>assembly</td><td>сборка, узел</td><td>The assembly contains several components.</td></tr>
<tr><td>workflow</td><td>рабочий процесс</td><td>The workflow includes review and approval.</td></tr>
<tr><td>manufacturing instruction</td><td>производственная инструкция</td><td>The instruction must match the approved revision.</td></tr>
<tr><td>revision control</td><td>контроль редакций</td><td>Revision control prevents obsolete data from being used.</td></tr>
<tr><td>verification</td><td>проверка, подтверждение</td><td>Verification is required before release.</td></tr>
</table>
<h3>3. Language focus: purpose and sequence</h3>
<p>Цель выражается через <i>is used to + verb</i>: <i>CAD is used to create digital models.</i> Последовательность: <i>first, next, after that, before, once, finally</i>. Для различения понятий используйте <i>whereas/while</i>: <i>CAD focuses on design, whereas CAM supports manufacturing planning.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What does CAD help engineers create?</li><li>What does CAM support?</li><li>Why must manufacturing instructions be checked?</li><li>Does a digital model guarantee a correct product? Explain.</li><li>What is revision control used for?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Определите CAD или CAM:</b> 1) creating a 3D model; 2) planning manufacturing operations; 3) preparing a drawing from a model; 4) creating a manufacturing programme for a selected process.</p>
<p><b>Задание B. Дополните:</b> CAD is used to ___ digital models. CAM supports the planning of ___. Before use, manufacturing instructions must be ___ by qualified personnel.</p>
<p><b>Задание C. Опишите рабочий процесс из пяти этапов, используя first, next, after that, before and finally.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Digital models and drawings.</li><li>Manufacturing planning and instructions.</li><li>To confirm accuracy, suitability, equipment capability and revision status.</li><li>No; data, process and inspection checks are still required.</li><li>To identify and control current document/data versions.</li><li>Задание A: CAD; CAM; CAD; CAM.</li><li>create; manufacturing operations; checked/verified.</li></ol>
<p><b>Самостоятельная работа:</b> напишите 100–120 слов о роли CAD/CAM в разработке детали. Обязательно включите различие CAD/CAM, последовательность этапов и необходимость проверки версии документа.</p>
`)
            ],
            [],
            [],
            [
              tq("Technical drawing is needed to...", ["make a scale of the product", "practise pens, rulers and stencils", "let the manufacturer understand the requirements"]),
              tq("The drafter needs...", ["some paper and a pencil", "a wide range of technical instruments", "the final product"]),
              tq("Paper is chosen considering...", ["what sort of drawing the drafter is going to make", "the pencils he/she is going to use", "the drafter's preference"]),
              tq("Pencils are graded according to...", ["hardness", "hardness and colour", "hardness and point"]),
              tq("A technical pen...", ["makes regular lines", "maintains the same line width", "draws lines of the same length"]),
              tq("CAD helps designers...", ["to draw, modify and correct designs", "to build prototypes", "to manufacture parts"])
            ],
            [
              { code: "W 2.1", title: "Complete the text about CAD/CAM", task: "Complete the text with the words: creation, advantages, boards, drawings, software, defects, faster, instructions, traditional, reduce, modification, electronically.\n\nDrawing (1) ______ and manual drawing are not always precise and rapid: (2) ______ design is usually slow, especially in its revision and (3) ______. For this reason manufacturing firms have replaced manual drawing with computer-aided design (CAD)... This computer technology assists the designer in the (4) ______, modification and analysis... Nowadays computer (5) ______ can easily provide a three-dimensional drawing... CAD is much (6) ______ and more accurate... designs can be quickly modified, reproduced and transmitted (7) ______. Computer simulated analysis... helps experts find problems and (8) ______... the CAD system can generate the detailed (9) ______ needed to start product manufacturing... CAM offers significant (10) ______... it gives (11) ______ to the computer regarding machine operations. Thanks to CAD/CAM systems it is possible to eliminate operator errors and (12) ______ manufacturing costs." },
              { code: "W 2.2", title: "Match sentences with endings", task: "Match each sentence with its ending:\n1 CAD helps designers\na seen from any angle and are easily manipulated.\n2 By using a CAD technology\nb to draw, modify and correct designs.\n3 Unlike manual drawing, CAD\nc the design into computer language.\n4 CAD allows us to save\nd defects can be easily found.\n5 CAD designs can be\ne provides three-dimensional drawings.\n6 CAM is the use of computer software\nf time and money.\n7 The CAM system turns\ng minimise errors and manufacturing costs.\n8 CAD/CAM systems\nh to control machine tools in the manufacturing process." }
            ]
          )
        ]
      },
      {
        code: "UNIT 3",
        title: "Machine Tools",
        topics: [
          topic("t-unit3", "Unit 3", "Machine Tools",
            [
              lec("3.1", "Turning, Shaping and Drilling", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится различать токарную, строгальную и сверлильную обработку, называть основные части станка и описывать назначение операции на английском языке. Занятие посвящено чтению и терминологии; оно не является инструкцией по настройке, наладке или эксплуатации станка.</p>
<h3>1. Reading: Turning, Shaping and Drilling</h3>
<p><b>Turning</b> is a machining process commonly performed on a lathe. The workpiece rotates while a cutting tool removes material. Turning is often used to produce cylindrical surfaces. Different operations may create external surfaces, internal bores, grooves or faces, depending on the machine, tooling and approved process plan.</p>
<p><b>Shaping</b> is a machining process in which a single-point cutting tool moves back and forth across a workpiece to produce a flat or shaped surface. A shaper is a reciprocating machine tool. The exact motion and feed arrangement depend on the machine design.</p>
<p><b>Drilling</b> produces a round hole using a rotating drill. Drilling machines may also support related hole-making operations with suitable tools. The required hole size, position, tolerance and finish are defined by the drawing and process documentation.</p>
<p>Machine tools can be manually controlled, mechanically automated or controlled by a computer. CNC technology allows programmed movements to be repeated with accuracy when the programme, machine, tooling and workholding are correctly verified. The presence of CNC does not remove the need for trained personnel and safety checks.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>lathe</td><td>токарный станок</td><td>A lathe is commonly used for turning.</td></tr>
<tr><td>workpiece</td><td>заготовка, обрабатываемая деталь</td><td>The workpiece rotates during turning.</td></tr>
<tr><td>cutting tool</td><td>режущий инструмент</td><td>The cutting tool removes material.</td></tr>
<tr><td>spindle</td><td>шпиндель</td><td>The spindle holds or drives a component, depending on the machine.</td></tr>
<tr><td>carriage</td><td>суппорт</td><td>The carriage supports and moves the tool assembly on a lathe.</td></tr>
<tr><td>shaper</td><td>строгальный станок</td><td>A shaper can produce flat surfaces.</td></tr>
<tr><td>drill</td><td>сверло</td><td>A drill produces a round hole.</td></tr>
<tr><td>bore</td><td>отверстие / растачивать</td><td>The bore is checked against the drawing.</td></tr>
<tr><td>machining operation</td><td>операция механической обработки</td><td>Turning is a machining operation.</td></tr>
</table>
<h3>3. Language focus: describing machine functions</h3>
<p>Используйте <i>is used to + verb</i>: <i>A lathe is used to produce cylindrical surfaces.</i> Для процесса: <i>while, during, by</i>: <i>The workpiece rotates while the tool removes material.</i> Для пассивного залога: <i>A hole is produced by drilling.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What rotates during conventional turning?</li><li>What does a cutting tool do?</li><li>What type of movement is associated with a shaper?</li><li>Which tool is used for drilling?</li><li>Why does CNC still require trained personnel?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите процесс и описание:</b> turning; shaping; drilling. Описания: a round hole is produced by a rotating drill; a rotating workpiece is machined by a cutting tool; a reciprocating tool produces a surface.</p>
<p><b>Задание B. Выберите правильное слово:</b> 1) The (workpiece/cutting tool) rotates during conventional turning. 2) A (drill/lathe) produces a round hole. 3) A shaper uses a (reciprocating/chemical) movement.</p>
<p><b>Задание C. Опишите разницу между turning and drilling в 4–5 предложениях.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>The workpiece.</li><li>It removes material from the workpiece.</li><li>Back-and-forth/reciprocating movement.</li><li>A drill.</li><li>Because programmes, equipment, tooling and workholding must be verified and safety procedures followed.</li><li>Turning — rotating workpiece; shaping — reciprocating tool; drilling — round hole with a rotating drill.</li><li>workpiece; drill; reciprocating.</li></ol>
<p><b>Самостоятельная работа:</b> составьте словарную карточку для пяти деталей токарного станка и напишите 80–100 слов о назначении turning, shaping и drilling. Не включайте режимы резания или последовательность реальной наладки.</p>
`),
              lec("3.2", "Milling, Grinding, Pressing and Band Sawing", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится описывать фрезерование, шлифование, прессование и ленточное пиление, различать движение инструмента и заготовки и использовать лексику для сравнения операций. Любые реальные операции выполняются только обученным персоналом по локальным инструкциям и оценке рисков.</p>
<h3>1. Reading: Milling, Grinding, Pressing and Band Sawing</h3>
<p><b>Milling</b> removes material with a rotating multi-edge cutter. The workpiece and tool move relative to each other according to the machine design and selected operation. Milling can produce flat surfaces, slots, pockets and complex profiles.</p>
<p><b>Grinding</b> uses an abrasive wheel or another abrasive tool to remove small amounts of material and improve surface quality or dimensional accuracy. Grinding requires appropriate equipment, wheel condition checks and protective measures defined by the relevant procedure.</p>
<p>A <b>press</b> applies force to form, cut or join material, depending on the tooling and process. Press equipment can create serious hazards, including crushing and trapping points. Safeguards and operating controls must be designed, checked and used according to approved requirements; a general textbook description is not an operating instruction.</p>
<p>A <b>band saw</b> uses a continuous toothed blade moving around wheels. It can cut metal, wood and other materials with suitable equipment and blades. The machine design, blade type, guarding and workholding determine the permitted application.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>milling machine</td><td>фрезерный станок</td><td>A milling machine uses a rotating cutter.</td></tr>
<tr><td>cutter</td><td>фреза, режущий инструмент</td><td>The cutter has several cutting edges.</td></tr>
<tr><td>abrasive wheel</td><td>абразивный круг</td><td>Grinding may use an abrasive wheel.</td></tr>
<tr><td>surface finish</td><td>качество поверхности</td><td>Grinding can improve surface finish.</td></tr>
<tr><td>press</td><td>пресс</td><td>A press applies force to a workpiece.</td></tr>
<tr><td>guard</td><td>ограждение</td><td>A machine guard helps prevent access to hazards.</td></tr>
<tr><td>band saw</td><td>ленточнопильный станок</td><td>A band saw uses a continuous blade.</td></tr>
<tr><td>workholding</td><td>закрепление заготовки</td><td>Workholding must be suitable for the task.</td></tr>
<tr><td>hazard</td><td>опасность, опасный фактор</td><td>Moving parts can present a hazard.</td></tr>
</table>
<h3>3. Language focus: comparing processes</h3>
<p>Для сравнения используйте <i>whereas, while, unlike, both, however</i>: <i>Milling uses a rotating cutter, whereas grinding uses an abrasive tool. Both processes remove material; however, their purposes and results may differ.</i> Для описания назначения: <i>is designed to, is used for, can be used to</i>.</p>
<h3>4. Reading comprehension</h3>
<ol><li>What type of cutter is used in milling?</li><li>What is one purpose of grinding?</li><li>What hazards can be associated with press equipment?</li><li>What does a band saw use?</li><li>Why are general descriptions not enough to operate a machine?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Определите операцию:</b> 1) a rotating multi-edge cutter removes material; 2) an abrasive tool improves surface quality; 3) a press applies force; 4) a continuous toothed blade cuts material.</p>
<p><b>Задание B. Завершите предложения:</b> 1) A milling cutter has several cutting ___. 2) Grinding may improve surface ___. 3) A machine ___ helps prevent access to hazardous moving parts. 4) A band saw has a continuous ___.</p>
<p><b>Задание C. Сравните две операции по инструменту, назначению и потенциальным опасностям. Используйте whereas и both.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>A rotating multi-edge cutter.</li><li>To remove small amounts of material and improve surface quality/accuracy.</li><li>Crushing and trapping points.</li><li>A continuous toothed blade.</li><li>Because actual equipment, guarding, material and procedure vary; trained personnel must follow approved instructions.</li><li>Milling; grinding; pressing; band sawing.</li><li>edges; finish; guard; blade.</li></ol>
<p><b>Самостоятельная работа:</b> подготовьте сравнительную таблицу четырёх операций: tool, purpose, typical result, one hazard to be controlled. Используйте только общие учебные описания, не давайте инструкций по работе на конкретном станке.</p>
`),
              lec("3.3", "Computer Numerical Control (CNC)", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится объяснять назначение ЧПУ, различать CAD, CAM и CNC на базовом уровне, читать учебные обозначения G-code и описывать роль проверки программы. Все фрагменты кода в этом занятии являются иллюстрациями для чтения и не предназначены для запуска на станке.</p>
<h3>1. Reading: What Is CNC?</h3>
<p>Computer Numerical Control (CNC) is a method of controlling machine-tool movements and functions using a computer programme. A CNC system can repeat a planned sequence of movements and support the production of components with complex shapes and controlled dimensions. The actual result depends on the machine, control system, tooling, workholding, material and verified programme.</p>
<p>A typical digital workflow may begin with a design model. CAD software is used to create or modify the model. CAM software can help prepare manufacturing data and generate a programme for a selected machine. A qualified programmer reviews the data, and the programme must be checked using the approved process before any production use. The operator follows the applicable setup and safety documentation.</p>
<p>CNC programmes often contain blocks of information. A block may include a sequence number, a preparatory function, coordinates, feed or spindle-related commands and comments. The exact meaning and behaviour depend on the controller and machine configuration. The same code should never be assumed to behave identically on every machine.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>computer numerical control (CNC)</td><td>числовое программное управление</td><td>CNC controls machine functions by a programme.</td></tr>
<tr><td>machine tool</td><td>металлорежущий станок</td><td>A CNC machine tool follows verified instructions.</td></tr>
<tr><td>programme block</td><td>кадр программы</td><td>A programme block contains coded information.</td></tr>
<tr><td>coordinate</td><td>координата</td><td>A coordinate identifies a position.</td></tr>
<tr><td>feed rate</td><td>подача</td><td>Feed rate is one type of programme information.</td></tr>
<tr><td>spindle speed</td><td>частота вращения шпинделя</td><td>Spindle speed depends on the process and machine.</td></tr>
<tr><td>controller</td><td>система ЧПУ / контроллер</td><td>The controller interprets programme instructions.</td></tr>
<tr><td>simulation</td><td>моделирование</td><td>Simulation can help review a programme.</td></tr>
<tr><td>verification</td><td>проверка, подтверждение</td><td>Programme verification is required before use.</td></tr>
</table>
<h3>3. Reading a simplified programme block</h3>
<p>Example for language analysis only:</p>
<pre>N10 G01 X20.0 Y5.0 F100 ; illustrative linear-move block</pre>
<p>In a general introductory explanation, N10 is a sequence number, G01 is commonly associated with a linear interpolation command, X and Y are coordinate words, and F is commonly used for feed information. The example omits essential machine-specific context and is not a complete or safe programme. Do not enter it into a controller or use it to operate equipment.</p>
<h3>4. Language focus: explaining code cautiously</h3>
<p>Используйте <i>indicates, represents, is commonly used for, may contain</i>: <i>The X word indicates a coordinate value. The F word is commonly used for feed information.</i> Слово <i>commonly</i> важно: детали зависят от системы управления и настроек конкретной машины.</p>
<h3>5. Reading comprehension</h3>
<ol><li>What does CNC stand for?</li><li>What is the role of a CNC programme?</li><li>What may CAD and CAM contribute to the workflow?</li><li>What information can a programme block contain?</li><li>Why must the programme be checked for the specific machine?</li></ol>
<h3>6. Практика</h3>
<p><b>Задание A. Расшифруйте сокращения:</b> CAD, CAM, CNC.</p>
<p><b>Задание B. Найдите элементы в учебном примере:</b> sequence number; preparatory function; coordinate words; feed word. Объясните, почему этот пример нельзя запускать на станке.</p>
<p><b>Задание C. Расположите этапы в логическом порядке:</b> create or review a design model; prepare manufacturing data; review and verify the programme; follow approved machine documentation.</p>
<h3>7. Самопроверка и ключ преподавателя</h3>
<ol><li>Computer Numerical Control.</li><li>It provides coded instructions for machine movements/functions.</li><li>CAD creates/modifies a design model; CAM supports manufacturing planning and programme generation.</li><li>Sequence number, functions, coordinates, feed/spindle-related words and comments.</li><li>Controller, machine configuration and process requirements may differ.</li><li>CAD — Computer-Aided Design; CAM — Computer-Aided Manufacturing; CNC — Computer Numerical Control.</li><li>N10; G01; X20.0 and Y5.0; F100. It is incomplete and lacks machine-specific context and verification.</li><li>Design model → manufacturing data → programme review/verification → approved documentation.</li></ol>
<p><b>Самостоятельная работа:</b> составьте мини-глоссарий из 10 терминов CNC и напишите 80–100 слов о цифровом процессе от CAD-модели до проверенной производственной программы. Не составляйте и не запускайте реальный управляющий код.</p>
`)
            ],
            [],
            [],
            [
              tq("A lathe rotates the", ["workpiece", "tool", "spindle only", "bed"]),
              tq("A milling machine uses", ["rotary cutters", "a single point tool", "a drill bit only", "a grinding wheel"]),
              tq("CNC stands for", ["Computer Numerical Control", "Central Numerical Center", "Common Numerical Control", "Complex NC"]),
              tq("A drill creates", ["holes", "threads", "flat surfaces", "grooves"]),
              tq("Grinding is used for", ["finishing", "roughing", "drilling", "turning"]),
              tq("The tailstock is part of a", ["lathe", "milling machine", "drill", "grinder"])
            ],
            [
              { code: "W 3.1", title: "Match the processes", task: "Read the texts again and write the correct processes that produce the objects listed below:\n1 wires - ______\n2 pasta - ______\n3 sheet - ______\n4 bricks - ______\n5 tubes - ______\n6 rods and bars - ______\n7 golden leaves - ______\n8 machine parts - ______\n9 concrete - ______" },
              { code: "W 3.2", title: "True or False", task: "Read the texts again and decide if the following sentences are true (T) or false (F):\n1 Turning machines remove excess metal from the external diameter and enlarge and finish a hole.\n2 Shapers can only be vertical.\n3 Drilling machines use a twist drill to make circular holes.\n4 Milling machines can only be manually operated.\n5 Grinding machines remove excessive material from parts.\n6 Band saws use a band of metal with teeth to cut various parts.\n7 Presses are not dangerous if operated by both hands." },
              { code: "W 3.3", title: "Put sentences in correct order", task: "Read the text about CNC and put the sentences in the correct order:\na The planned machine operations are translated into a set of instructions.\nb These instructions are translated into a CAM program.\nc The program contains a set of commands for the machine.\nd It is calculated where to cut and tools and materials are selected.\ne The computer checks all the operations made by the machine tools.\nf Programmers view the part in its three-dimensional computer aided design." }
            ]
          )
        ]
      },
            {
        code: "UNIT 4",
        title: "What is Electricity?",
        topics: [
          topic("t-unit4", "Unit 4", "Electricity",
            [
              lec("4.1", "Atoms, Conductors, Semiconductors, Insulators", `
                <p>All substances, solids, liquids or gases, are composed of one or more of the chemical elements. Each element is composed of identical atoms. Each atom is composed of a small central nucleus consisting of protons and neutrons around which orbit shells of electrons. These electrons are very much smaller than protons and neutrons. The electrons in the outermost shell are called valence electrons and the electrical properties of the substance depend on the number of these electrons. Neutrons have no electric charge, but protons have a positive charge while electrons have a negative charge. In some substances, usually metals, the valence electrons are free to move from one atom to another and this is what constitutes an electric current.</p>
                <p><b>Conductors:</b> Electricity needs a material which allows a current to pass through easily, which offers little <i>resistance</i> to the flow and is full of free electrons. This material is called a conductor and can be in the form of a bar, tube or sheet. The most commonly used <i>conductors</i> are wires, available in many sizes and thicknesses. They are coated with insulating materials such as plastic.</p>
                <p><b>Semiconductors:</b> Semiconductors such as silicon and germanium are used in transistors and their conductivity is halfway in between a conductor and an <i>insulator</i>. Small quantities of other substances, called impurities, are introduced in the material to <i>increase</i> the conductivity.</p>
                <p><b>Insulators:</b> A material which contains very <i>few</i> free electrons is called an insulator. Glass, rubber, dry wood and <i>plastic</i> resist the flow of electric charge, and as such they are good insulating materials.</p>
              `),
              lec("4.2", "Types of Current and Units", `
                <p>There are two types of current: Direct current (DC) and Alternating current (AC).</p>
                <p>Direct current is a continuous flow of electrons in one direction and it never changes its direction until the power is stopped or switched off.</p>
                <p>Alternating current constantly changes its direction because of the way it is generated. The term 'frequency' is used to indicate how many times the current changes its direction in one second. Alternating current has a great advantage over direct current because it can be transmitted over very long distances through small wires, by making energy high voltage and low current.</p>
                <p>There are several quantities that are important when we are talking about electric current. Volts (V) - so named after the Italian physicist Alessandro Volta - measure the difference of electric potential between two points on a conducting wire. Amperes (A) measure the amount of current flowing through a conductor, that is to say the number of electrons passing a point in a conductor in one second. Coulomb (C) measure the quantity of charge transferred in one second by a steady current of one ampere. Power is the rate at which work is performed and it is measured in watts (W). A Kilowatt (kW), which is equal to one thousand watts, is used to measure the amount of used or available energy. The amount of electrical energy consumed in one hour at the constant rate of one kilowatt is called kilowatt-hour.</p>
              `)
            ],
            [],
            [],
            [
              tq("A flow of electrons moving inside a conductor creates an electric current.", ["True", "False"]),
              tq("A generator is used to move the charges.", ["True", "False"]),
              tq("Electrons can easily pass through any material.", ["True", "False"]),
              tq("Conductors are coated with insulators.", ["True", "False"]),
              tq("Impurities are introduced to increase conductivity.", ["True", "False"]),
              tq("Insulating materials resist the flow of electrons.", ["True", "False"])
            ],
            [
              { code: "W 4.1", title: "Complete the sentences", task: "Complete the sentences with the missing information:\n1 Elements make up ______.\n2 Identical atoms ______.\n3 Atoms consist of ______ and ______.\n4 Inside ______ there are ______ and ______, while outside ______.\n5 Shells ______.\n6 Valence electrons ______.\n7 Neutrons do not have ______.\n8 Electricity is generated when ______." },
              { code: "W 4.2", title: "True or False", task: "Decide if the statements are true (T) or false (F), then correct the false ones:\n1 A flow of electrons moving inside a conductor creates an electric current.\n2 A generator is used to move the charges.\n3 Electrons can easily pass through any material.\n4 Any material is a good conductor.\n5 Conductors are coated with insulators.\n6 The presence of free electrons affects the conductivity of materials.\n7 Impurities are introduced to increase conductivity.\n8 Insulating materials resist the flow of electrons." },
              { code: "W 4.3", title: "Complete the table", task: "Complete the table with the missing information:\n1. Unit of measurement: ______. What does it measure? The number of electrons passing a given point in a conductor in one second.\n2. Unit of measurement: ______. What does it measure? The quantity of electricity transferred by a steady current of one ampere.\n3. Unit of measurement: ______. What does it measure? The amount of electric energy used.\n4. Unit of measurement: ______. What does it measure? The difference of potential between two points on a conductor.\n5. Unit of measurement: ______. What does it measure? Rate at which work is done." }
            ]
          )
        ]
      },
      {
        code: "UNIT 5",
        title: "Electric Circuits",
        topics: [
          topic("t-unit5", "Unit 5", "Electric Circuits",
            [
              lec("5.1", "Circuit Components", `
                <p>An electric circuit or network is a pathway through which the electric current can flow. A simple circuit consists of a power source, two conducting wires, each one attached to a terminal of the source and a device through which electricity can flow. This device is called a load and it's attached to the wires. If all the parts are properly connected, the current flows and the lamp lights up. This kind of circuit is called 'closed'.</p>
                <p>On the contrary, if the wires are disconnected the circuit is called 'open' or 'broken'. The circuit can be opened and closed by a device called a switch.</p>
                <p>Loads can turn electrical energy into a more useful form. Some examples are: light bulbs, which change electrical energy into light energy; electric motors, which change electrical energy into mechanical energy; speakers, which change energy into sound.</p>
                <p>The source provides the electrical energy used by the load. It can be a storage battery or a generator. The switch interrupts the current delivered to the load by the source and allows us to control the flow.</p>
                <p>When an abnormally high amount of current passes through a network, you get a short circuit. This may occur when there is a drop in the resistance or a broken insulation. In order to prevent short circuits, it is best to use fuses, which melt when too much current flows through them, interrupting in this way the circuit.</p>
              `),
              lec("5.2", "Series and Parallel Circuits", `
                <p>The <i>components</i> of a circuit can be wired in two different ways: series or parallel. If components are arranged one after another to form a single <i>path</i> between the terminals and the components, the circuit is known as a series circuit. In this type of circuit, the <i>current</i> flows from the negative terminal to the <i>positive</i> terminal, passing through all the other components of the circuit. This means that the <i>amount</i> of energy passing through all the components in the series is the same. The main disadvantage of a series circuit is that when a single component in the path <i>burns out</i>, the entire circuit stops operating (e.g. Christmas tree lights).</p>
                <p>A parallel circuit consists of several paths connecting the different components. Each separate path is called a <i>branch</i> of the circuit. Current from the source divides and flows through the different branches. Unlike series circuits, if one of the components in the parallel circuit burns out, the other paths <i>continue</i> to operate. Parallel circuits are commonly used to connect <i>appliances</i> at home, so that each socket can function independently. For example, you don't have to <i>turn on</i> the light in your room for the TV socket to work.</p>
                <p>A fuse can be added to an electric circuit to protect it from the effects of undue power. This safety device, which is made of a heat-sensitive alloy, is connected in series with the circuit it has to protect. If an excessive amount of current flows through the circuit, the alloy will liquefy and open the circuit. A circuit breaker is fundamental in a house to protect circuits against overloading, overheating and short circuits. The advantage of a circuit breaker is that it can be reset after the overloading by replacing the fuse. A professional electrician should always provide his customers with a map of the electric circuit in the house so that it will be easier to work on it in case of faults.</p>
              `)
            ],
            [],
            [],
            [
              tq("A device which interrupts the circuit is a...", ["load", "switch", "source", "fuse"]),
              tq("A circuit in which wires are disconnected is...", ["closed", "broken", "short", "parallel"]),
              tq("A device which provides power is a...", ["load", "switch", "source", "fuse"]),
              tq("A complete circuit with no breaks is a...", ["closed circuit", "broken circuit", "short circuit", "series circuit"]),
              tq("A device which consumes electric power is a...", ["load", "switch", "source", "fuse"]),
              tq("A protective device is a...", ["load", "switch", "source", "fuse"])
            ],
            [
              { code: "W 5.1", title: "Match definitions", task: "Match the words with their definitions:\n1 load\na a device which interrupts the circuit\n2 switch\nb a circuit in which wires are disconnected\n3 source\nc a device which provides power\n4 fuse\nd a complete circuit with no breaks at all\n5 closed circuit\ne a device which consumes electric power\n6 broken circuit\nf a protective device" },
              { code: "W 5.2", title: "Answer the questions", task: "Answer the following questions:\n1 What does a simple circuit consist of?\n2 What happens to the lamp in a closed circuit?\n3 Can you name some examples of loads?\n4 What is a generator?\n5 What is the function of a switch?\n6 When does a short circuit occur?\n7 What can we use to prevent short circuits?\n8 How does a fuse work?" },
              { code: "W 5.3", title: "Find synonyms", task: "Read the text and find synonyms for the words below:\n1 excessive: ______\n2 reacting to high temperatures: ______\n3 to melt: ______\n4 loading up: ______\n5 adjusted: ______\n6 clients: ______" }
            ]
          )
        ]
      },
            {
        code: "UNIT 6",
        title: "How Energy is Produced",
        topics: [
          topic("t-unit6", "Unit 6", "Energy Production",
            [
              lec("6.1", "Conventional Power Plants", `
                <p><b>Nuclear power plants:</b> About 10% of the world's electric power is produced by nuclear power plants. Nuclear power requires little fuel and causes much less air pollution than other power plants, but it can cause severe health and environmental problems when accidents occur, with a consequent release of radioactive material. This type of energy is produced by the splitting of atoms of uranium, which releases heat. This process - called fission - produces large amounts of steam, which is used to turn the blades of turbines thus creating energy. The main problems with nuclear power are linked to the location of the power plants, as people are not willing to have these plants near their homes, and the disposal of waste material, which stays radioactive for centuries.</p>
                <p><b>Thermoelectric power plants:</b> They provide about 2/3 of the world's electricity. These plants burn fossil fuels, such as coal, oil or natural gas, which are all non-renewable resources. This means that in the future there will be a limited supply of these resources. The main advantage of thermoelectric power plants is that they are reliable and can meet the demand in peak periods. Electricity is generated by heating water in a boiler to create steam, which is then pressurised and used to turn the blades of giant turbines that produce electricity. These power plants cause environmental pollution because of the combustion of fossil fuels which release carbon dioxide.</p>
                <p><b>Hydroelectric power plants:</b> The energy produced by water can be captured and turned into electricity. The use of a dam on a river allows hydroelectric power plants to store water in an artificial lake, or reservoir. When released, the force of the water spins the blades of giant turbines, which are connected to a generator producing energy. Hydropower is one of the most important renewable energy resources, because it is reliable, efficient and does not pollute the air. Although it has high initial costs, it is cheap to operate. Unfortunately, it has a great impact on the environment, as humans, animals and plants may lose their natural habitats.</p>
              `),
              lec("6.2", "Alternative Power Sources", `
                <p><b>Solar Energy:</b> Sunlight can be directly converted into electricity by solar cells made of silicon. When light strikes the cells, a part of it is absorbed by the semiconductor material. The energy of the absorbed light knocks electrons loose, allowing them to flow freely and produce electricity. The process of converting light (photons) into electricity (voltage) is known as the photo-voltaic process (PV). Solar cells are usually combined into panels and grouped into arrays. Even if the initial costs can be high, the PV system provides an independent, reliable electrical power source. It can produce energy for more than 15 years and its routine maintenance is simple and cheap.</p>
                <p><b>Wind Energy:</b> Wind energy is one of the cheapest renewable technologies available today. The wind turns the blades of giant turbines, producing in this way kinetic energy which is then converted into mechanical power and electricity by a generator. The main disadvantage of wind energy is that there are few suitable wind sites where it is possible to have a constant production of electricity.</p>
                <p><b>Tidal Energy:</b> This alternative power source, which is typically used in coastal areas, turns the potential energy of tides into electricity. Tidal power generators use rising and falling tides in much the same manner as hydroelectric power plants. Large underwater turbines are placed in areas with high tidal movements and are designed to capture the kinetic energy of rising and falling tides. The turbines are driven by the power of the sea both when the tide comes in and when it goes out. The problem with tidal power is that only massive increases in tides can produce energy and there are very few places where this occurs. Moreover, the aquatic ecosystem and the shoreline can be damaged by the changes in the tidal flow.</p>
                <p><b>Geothermal Energy:</b> In the past, people used hot springs for bathing, cooking and heating. Geothermal energy is based on the fact that the Earth is hotter below the surface. The hot water which is stored in the Earth can be brought to the surface and used to drive turbines to produce electricity or it can be piped through houses as heat. This energy is cheap and has a low impact on the environment, but there are few sites where it can be extracted at low cost.</p>
                <p><b>Biomass Energy:</b> Biomass is a renewable energy source deriving from plant material and animal waste. When it is burnt, it releases its chemical energy as heat. Biomass fuels include forest residues (such as dead trees, branches and tree stumps), straw, manure and even municipal solid waste. Biomass energy is a natural process, it is carbon neutral and has low initial costs. It used to be the main source of heating at home in the past and it continues to be highly exploited in the developing world. The main disadvantage of biomass is that it has a smaller potential than other energy sources and requires excellent maintenance skills.</p>
              `)
            ],
            [],
            [],
            [
              tq("Which power plant produces energy by splitting atoms?", ["Nuclear", "Thermoelectric", "Hydroelectric"]),
              tq("Which power plant burns coal, oil or gas?", ["Nuclear", "Thermoelectric", "Hydroelectric"]),
              tq("Which power plant uses a dam?", ["Nuclear", "Thermoelectric", "Hydroelectric"]),
              tq("Which alternative source converts light into electricity?", ["Solar", "Wind", "Tidal"]),
              tq("Which alternative source uses blades turned by air?", ["Solar", "Wind", "Tidal"]),
              tq("Which alternative source uses rising and falling water?", ["Solar", "Wind", "Tidal"])
            ],
            [
              { code: "W 6.1", title: "True or False", task: "Decide if the following sentences are true (T) or false (F), then correct the false ones:\n1 Nuclear power plants do not produce air pollution at all.\n2 Accidents in nuclear power plants can have terrible consequences for the environment.\n3 Nuclear power plants produce biodegradable waste material.\n4 Thermoelectric power is generated by the combustion of renewable resources.\n5 Thermoelectric power plants are environmentally friendly.\n6 Dams are built on rivers to store water.\n7 The water released from the reservoir flows through the generator.\n8 The only disadvantage of hydropower is its high initial cost." },
              { code: "W 6.2", title: "Match words with definitions", task: "Match the words with their definitions:\n1 array\na a spot where hot water comes up naturally from the ground\n2 kinetic\nb unwanted material left after using\n3 tide\nc a group of things arranged in a particular way\n4 hot spring\nd waste material from animals used as fertiliser\n5 to pipe\ne the process of keeping something in good condition by regularly checking it\n6 manure\nf produced by motion\n7 waste\ng to send a liquid or a gas through a tube\n8 maintenance\nh the regular change in the level of the sea caused by gravitational attraction of the moon and the sun" },
              { code: "W 6.3", title: "Complete the table", task: "Complete the table with missing information about energy types:\nType of energy | How it works | Advantages | Disadvantages\n______ | high initial costs\nWind energy | ______ | ______ | ______\nTidal energy | ______ | ______ | It is a natural process because it exploits the potential energy of tides." }
            ]
          )
        ]
      },
      {
        code: "UNIT 7",
        title: "What is Electronics?",
        topics: [
          topic("t-unit7", "Unit 7", "Electronics",
            [
              lec("7.1", "Main Inventions in Electronics", `
                <p>Electronics is the branch of science which controls electricity in order to convey a signal using semiconductor materials. These signals represent numbers, letters, sounds, pictures, computer instructions or other information. Radio systems were developed to read and understand these signals and in 1920 radio broadcasting started, making it possible for electromagnetic waves to travel long distances. More sophisticated devices were needed during the Second World War and the invention of radar (Radio Detection and Ranging) represented a further step in electronics, making it possible to determine the altitude, direction and speed of moving and fixed objects.</p>
                <p>The invention of television in the 1920s was one of the most revolutionary and popular inventions in history and it showed the importance of electronics in certain branches of industry. For the first time in history it became possible to transmit images and sound over wire circuits.</p>
                <p>The first computer appeared in 1946. This machine, which could solve a wide range of computing problems, was built over a period of three years by a team of American scientists working at the University of Pennsylvania. It was a huge machine weighing almost 50 tons.</p>
                <p>The first transistor was assembled in 1957 by a team of scientists working at the Bell Laboratories in the U.S.A, and it was a real coming of age in the science of electronics because it replaced the use of valves. Transistors are very small, easy to handle, cheap, and they use little power. The silicon chip - which followed the transistor in the 1960s - can contain up to several thousand transistors packed and interconnected in layers beneath the surface. It is really tiny (usually less than one centimetre square and about half a millimetre thick) and it has paved the way to microelectronics.</p>
                <p>Electronics has influenced and improved the way information is stored, processed and distributed. Social and personal life has been deeply affected by these inventions and many financial, business, medical, education and political routines have been speeded up.</p>
              `),
              lec("7.2", "Electronic Circuits", `
                <p>A conventional electronic circuit is made of separate components attached to a base called a printed circuit board (PCB). Before being finalised and manufactured, the electronic circuit must be tested many times on an experimentation board called a breadboard. It consists of a perforated block of plastic with several spring clips connected by copper wires. It doesn't require soldering as its components can be pushed straight into the holes, so it is easy to change connections and replace pieces. It is generally used to create temporary prototypes and experiment with circuit design.</p>
                <p>The integrated circuit, also known as a chip, is one of the most important inventions of the 20th century. Integrated circuits are used in almost all electronic equipment today, for example watches, calculators and microprocessors. It consists of millions of transistors and other electronic components combined to form a complex set on a thin slice of silicon or other semiconductor material. Chips are becoming tinier and tinier and they are produced in large quantities so that costs are reduced. Since signals have to travel a short distance, they work faster, consume less power and generate less heat. They are also more reliable given the limited amount of connections which could fail.</p>
                <p>The microprocessor is the heart of any normal computer: it is a logic integrated circuit chip which can carry out a sequence of operations when it receives instructions from different input devices. As it doesn't contain a large memory, it can't work alone but needs to be supported by other integrated circuits to be connected with peripherals. Most microprocessors are found inside computers and are called the CPU (Central Processing Unit). In order to work properly, the microprocessor needs to receive instructions from a memory chip. These instructions are then decoded, executed and elaborated so as to get the results available. The most sophisticated microprocessors can contain up to 10 million transistors and run 300 million cycles per second. It means that the computer can perform about a billion instructions every second. As technology continues to evolve, microprocessors are becoming tinier and tinier.</p>
              `),
              lec("7.3", "Mobile Phones", `
                <p>A cellular phone (or mobile phone) is designed to give the user freedom of <i>movement</i> while using a telephone. It uses <i>radio</i> signals to communicate between the phone and the <i>base station</i>. The server area is divided into smaller areas called cells and an antenna is placed within each cell and connected by telephone <i>lines</i>. These lines connect cellular phones to one another: a computer selects the antenna closest to the telephone when a call is made. If the phone moves to one serving <i>cell</i> to another, the radio signal is transferred to the actual cell without interrupting the conversation.</p>
                <p>The circuit board is the heart of the system. A chip translates the outgoing and incoming <i>signals</i> from analogue to digital and back from digital to analogue. The <i>microprocessor</i> handles all the functions for the keyboard, the display and the loudspeakers, and it controls the signal to the base station. Other <i>flash</i> memory chips provide storage for the operating system.</p>
                <p>A cellular phone is not only a phone but it provides an incredible amount of functions: store information; use a calculator; send and receive <i>messages</i>; surf the Internet; play simple games; play music, take <i>photos</i> and videos.</p>
              `)
            ],
            [],
            [],
            [
              tq("Electronics uses...", ["semiconductor materials", "only metals", "wood"]),
              tq("The first computer appeared in...", ["1946", "1920", "1957"]),
              tq("The first transistor replaced...", ["valves", "chips", "computers"]),
              tq("A printed circuit board is called...", ["PCB", "CPU", "RAM"]),
              tq("A chip is also called...", ["integrated circuit", "transistor", "valve"]),
              tq("The brain of a computer is the...", ["microprocessor", "chip", "PCB"])
            ],
            [
              { code: "W 7.1", title: "Complete the table", task: "Complete the table with missing information:\nInvention | Year | Function\n______ | ______ | read and understand electronic signals\nRadar | 1920s | ______\nTelevision | 1920s | ______\nFirst computer | ______ | ______\nTransistor | ______ | ______" },
              { code: "W 7.2", title: "Answer questions", task: "Answer the questions based on the text 'Electronic Circuits':\n1 What is a conventional circuit made of?\n2 What does PCB stand for?\n3 What is a breadboard?\n4 What does a chip consist of?\n5 What is a chip made out of?\n6 What are the advantages of chips compared to conventional electronic circuits?\n7 What is a microprocessor?\n8 How many instructions can computers perform?" },
              { code: "W 7.3", title: "Match definitions", task: "Match the words with their definitions:\n1 prototype\na to convert an electrical signal into another code\n2 perforated\nb the act of joining metallic parts\n3 soldering\nc an original model used to test a circuit or a product\n4 to fail\nd to perform ineffectively\n5 peripheral\ne having a series of holes\n6 to decode\nf an auxiliary device that works with a computer" },
              { code: "W 7.4", title: "True or False", task: "Decide if the statements are true (T) or false (F):\n1 Mobile phones use radio signals to communicate.\n2 The server area is divided into smaller areas called stations.\n3 An antenna is placed every two or three cells.\n4 Communication with a mobile within a cell is independent from the base station.\n5 There are interruptions when you move to one cell to another.\n6 The antenna is the heart of the system.\n7 The signal must be translated.\n8 The flash memory handles all the functions.\n9 Loudspeakers are controlled by the microprocessor.\n10 You can text and send emails with your mobile phone." }
            ]
          )
        ]
      },
            {
        code: "UNIT 8",
        title: "Communication",
        topics: [
          topic("t-unit8", "Unit 8", "Communication",
            [
              lec("8.1", "Means of Transmission", `
                <p><b>Ground transmission:</b> Wires provide a cheap and effective means of communication that was predominant in the past. Wires, which are made out of copper and insulated with plastic, can be single or twisted, and they are used mainly in telephone and computer networks. Coaxial cables consist of an inner conductor insulated with plastic and surrounded by a woven copper shield. They are used in television and radio as these cables can support about 60 channels. The inner copper cable is insulated to protect the wires from bending and crushing and to reduce the noises. Optical fibres are used in place of simple copper wires to carry larger amounts of information. They consist of strands of pure glass as thin as a human hair. Signals travel along fibres with less loss and without any electromagnetic interference. As they permit transmission over longer distances and at a higher speed, they are used in communication systems, in some medical instruments and in a wide variety of sensing devices.</p>
                <p><b>Air transmission:</b> Antennas were invented to capture radio signals and convert them into electrical signals through the receiver. They can also receive electrical signals from the transmitter and convert them into radio signals. These electric devices, which provide information at a cheap rate, are essential to all equipment that uses radio. They are used in systems such as radio and television broadcasting, radar, mobile phones, and satellite communications, for which they are in form of dishes. Satellites are machines launched into space to move around Earth or another celestial body. A communications satellite is basically a station which receives signals in a given frequency and then retransmits them at a different frequency to avoid interference problems. The first satellite was launched by the Soviet Union in 1957. There are different types of satellites: low-orbit satellites, which travel at about 300 km from the Earth and observe the planet, providing accurate information about agriculture, pollution and weather forecasting; medium-altitude satellites, which travel at about 9000-18000 km from the Earth and are used in telecommunications.</p>
              `),
              lec("8.2", "Networks and Topologies", `
                <p>A network is a group of computers linked together. It consists of at least two computers joined by cables on the same desk or same office, but it can also mean thousands of computers across the world. The users of a network can share hardware (scanner, printer, fax machine, etc.), access data in other people's computers and run other programs stored in the network although not installed on their own computer.</p>
                <p>A network consists of: nodes (different computers and devices); a connecting medium (cables or a wireless connection); routers (special computers enabled to send messages); switches (devices which help to select a specific path to follow).</p>
                <p>Networks can be connected in different ways according to the area they cover. A LAN (Local Area Network) is generally located in a limited space, such as a building or a campus. On the contrary, a WAN (Wide Area Network) operates in a larger area and it can reach most of the world, so it could be described as a collection of LANs all over the world. The exchange of information in a network is controlled by communications protocols, which define the formats and rules that computers must follow when talking to one another. Well-known communications protocols are Ethernet, which is a family of protocols used in LANs, and the Internet Protocol Suite, which is used in any computer network.</p>
                <p><b>Network topologies:</b></p>
                <p><b>Bus network:</b> In a bus network all nodes are connected to a common medium, called backbone, as it happens with Christmas lights. Information sent along the pathway travels until the destination is reached. This kind of topology is generally used only for small networks, as it isn't able to connect a large number of computers. The main advantage offered by this topology is that if a computer or device doesn't work, it doesn't affect the others.</p>
                <p><b>Star network:</b> In a star network all nodes are connected to a special central node called the hub. Once it has received a signal, the hub passes it to all the other nodes until it reaches the destination computer. This means that all the computers and devices are joined together. This topology is commonly used in businesses because it can grant rapidity and safety in exchanging data. Thanks to this topology, data is always up-to-date and if a computer doesn't work, it doesn't affect the others. The only disadvantage to it is that if the hub goes down, the whole network doesn't work.</p>
                <p><b>Ring network:</b> In a ring network each node is connected to its left in a circle. There is no central hub that holds all the data, and communication is sent in one direction around the ring through the use of a token. As it requires fewer cables, this topology is less expensive. Nonetheless, because it provides only one pathway among the nodes, a single node failure may isolate all the devices attached to the ring.</p>
                <p><b>Star bus topology:</b> Star bus topology is the most common network topology used today. It combines elements of star and bus topologies to create a more effective network. Computers in a specific area are connected to hubs creating a star, then each hub is connected together along the network backbone. The main advantage of this type of topology is that it can be more easily expanded over time than a bus or a star. On the other hand, this topology is more difficult to configure than the others and if the backbone line breaks, the whole network goes down.</p>
              `)
            ],
            [],
            [],
            [
              tq("Which cable supports about 60 channels?", ["Coaxial", "Optical fibre", "Simple wire"]),
              tq("Which cable uses pure glass?", ["Coaxial", "Optical fibre", "Simple wire"]),
              tq("Which is used for long-distance transmission in space?", ["Antennas", "Satellites", "Cables"]),
              tq("A LAN covers...", ["a limited space", "the whole world", "a country"]),
              tq("A WAN covers...", ["a limited space", "a large area/world", "a room"]),
              tq("In which topology is there a central hub?", ["Bus", "Star", "Ring"])
            ],
            [
              { code: "W 8.1", title: "Answer questions (Networks)", task: "Answer the following questions based on the text 'Networks':\n1 What does a network consist of?\n2 What is a router?\n3 What is a LAN?\n4 What is a WAN?\n5 What is the function of communications protocols?\n6 What is Ethernet used for?\n7 What are the advantages of using a network?\n8 What are the disadvantages of using a network?" },
              { code: "W 8.2", title: "Complete the table (Topologies)", task: "Complete the table with missing information:\nTopology | Connection | Use | Advantages | Disadvantages\n______ | ______ | small networks | ______ | ______\n______ | Each node is connected to the central hub | ______ | ______ | ______\nring | ______ | ______ | ______ | ______" },
              { code: "W 8.3", title: "True or False", task: "Decide if the statements are true (T) or false (F):\n1 The topology chosen depends only on the location of computers.\n2 All topologies use many cables and are very expensive.\n3 In a bus topology all the buses are connected one after the other.\n4 In a bus topology a server controls the flow of data.\n5 In a star network data is always updated.\n6 The hub doesn't connect printers and other devices in a star topology.\n7 In the ring topology each node is connected to the hub.\n8 In the ring topology if the hub doesn't work, the network goes down.\n9 Star bus topology combines elements of bus and ring topologies.\n10 In a star bus topology a backbone line failure affects the whole network." }
            ]
          )
        ]
      },
      {
        code: "UNIT 9",
        title: "Computer Technology",
        topics: [
          topic("t-unit9", "Unit 9", "Computers",
            [
              lec("9.1", "Hardware and Software", `
                <p>A computer is an electronic device that performs high-speed mathematical or logical operations and executes instructions in a program. Its main functions are to accept and process data to produce results, store information and programs and show results. The main characteristics of these powerful machines are: speed, as they can execute billions of operations per second; high reliability in the elaboration and delivery of data; storage of huge amounts of information.</p>
                <p>A computer consists of hardware and software. The word hardware refers to all the components you can physically see such as the CPU (Central Processing Unit), the internal memory system, the mass storage system, the peripherals (input and output devices) and the connecting system. Software, instead, comprises all the computer programs and related data that provide the instructions for a computer to work properly.</p>
                <p>The CPU is the brains of your computer and consists of ALU (Arithmetic Logic Unit), which carries out the instructions of a program to perform arithmetical and logical operations, and CU (Control Unit), which controls the system and coordinates all the operations. In order to memorise input and output data, there is an internal memory that can be distinguished into volatile and non-volatile. Volatile memory is memory that loses its contents when the computer or hardware device is off. Computer RAM (Random Access Memory) is a good example of volatile memory. It is the main memory of the computer where all data can be stored as long as the machine is on. On the contrary, a non-volatile memory contains information, data and programs that cannot be modified, or can be modified only very slowly and with difficulty. Computer ROM (Read Only Memory), for example, contains essential and permanent information and software which allow the computer to work properly. Memory storage devices are available in different options, sizes and capacities. These devices are extremely useful; they can be rewritten and offer incredible storage capacity, up to 256 GB. They can be magnetic (hard disks), optical (CDs and DVDs) or solid (flash memory cards).</p>
              `),
              lec("9.2", "USB Flash Drives and Types of Computers", `
                <p>A USB flash drive is a flash memory data storage device integrated with a USB (Universal Serial Bus) interface. USB flash drives are removable and rewritable, and they're small enough to be carried in a <i>pocket</i>. These portable drives are faster, have thousands of times more capacity, and are more durable and reliable than CD-ROMs because of their lack of <i>moving</i> parts. Unlike most removable drives, a USB drive does not require rebooting after it's attached, they are very robust and use very little power. They just need to be <i>plugged</i> into a USB port to work and they're compatible with any modern <i>operating system</i> such as Linux, Mac OS X and Windows. A flash drive consists of a small printed circuit <i>board</i> carrying the circuit elements and a USB connector, insulated electrically and protected inside a plastic <i>case</i>. The drive is often used as a <i>backup</i> medium to save data, because it is very user-friendly and it can be carried <i>off-site</i> for safety despite being large enough for several backups. Moreover, flash drives are cheaper and less fragile than many other backup systems. Its only <i>disadvantage</i> is that it can be easily lost because of its size and it's easy for people without a right to data to take illicit backups. Some specially manufactured flash drives are provided with a metal or rubber case designed to be waterproof and almost unbreakable. It's been tested that these flash drives can retain their memory even after being submerged in <i>water</i> put in a washing machine and run over with a car.</p>
                <p><b>Types of computers:</b> When you go to a computer shop, you can find computers for any use, size or capability. 1 <b>Desktop:</b> this is a personal computer intended for regular use at a single location. It's designed to sit on your desk, and as such it consists of a monitor and a tower with extra drives inside. 2 <b>Laptop:</b> this is a portable computer, which integrates all the usual components of a desktop computer into a single unit. Smaller versions of laptops are known as notebooks. It is useful for people who do not have a fixed place to work at. They are lighter and handier than desktop computers, but they also tend to be more expensive. They require an expensive battery that needs to be recharged quite often. 3 <b>Netbook:</b> this is a portable computer, with limited capabilities as compared to standard laptops. It is smaller and lighter, but it also has less processing power than a full-sized laptop. It is useful for people who don't have a fixed place to work at or for those who travel, but still need to surf the Net. They use a battery which needs to be recharged often. 4 <b>Palmtop:</b> this is a small portable computer designed to have large amounts of information close to hand. They are provided with light long-lasting batteries and special operating systems. They don't require any keyboard but use special pens or touch screens to enter data and access information. 5 <b>Mainframe:</b> this is a very large and expensive computer capable of supporting thousands of users at the same time. For this reason, it is used in businesses and it's the centre of computer networks. These super computers, which are usually as big as a large refrigerator, are the most powerful and expensive ones and they're used for jobs which require enormous amounts of calculations, such as weather forecasting, engineering design and economic data processing.</p>
              `),
              lec("9.3", "The Internet", `
                <p>The Internet is a worldwide information system consisting of countless networks and computers, which allow millions of people to share information and data. Thanks to the Internet it is now possible for people all over the world to communicate with one another in a fast and cheap way.</p>
                <p>The Internet was first invented in the 1960s in the USA by the Department of Defence as an internal project to link computers. The Department wanted an extremely safe way of sending messages in case of nuclear attack. It was a British physicist, Sir Timothy Berners-Lee, who used it to make information available to everyone and created the most important media of the 21st century. In 1980 while working at CERN in Geneva - the largest particle physics laboratory in the world - he first thought of using hypertext to share and update information among researchers. Then in 1989-90 he produced a plan to link hypertext to the Internet to create the World Wide Web. He designed and built the first site browser and editor, as well as the first web server called httpd (Hypertext Trader Protocol Deamon). Hypertext are the words or chains of words in a text we can click on to be linked to new sites whose content is related to the words.</p>
                <p>But how does this global system work? It is a network of people and information linked together by telephone lines which are connected to computers. The applications are based on a client/server relationship, in which your computer is the client and a remote computer is the server. All you need to join this system is a computer, a normal telephone line, a modem and an account with an Internet Service Provider (ISP), a company that provides access to the Internet. A user buys a subscription to a service provider, which gives him/her an identifying username, a password and an email address. With a computer and a modem, the user can connect to the service provider's computer which gives access to many services, such as WWW (world wide web), emails and FTP (file transfer protocol).</p>
              `)
            ],
            [],
            [],
            [
              tq("The CPU consists of ALU and...", ["CU", "RAM", "ROM"]),
              tq("Which memory loses its contents when the computer is off?", ["RAM", "ROM", "Hard disk"]),
              tq("Which memory contains essential and permanent information?", ["RAM", "ROM", "Hard disk"]),
              tq("A USB flash drive is...", ["removable", "built-in", "not rewritable"]),
              tq("Which computer is the most powerful and expensive?", ["Mainframe", "Laptop", "Palmtop"]),
              tq("Who created the World Wide Web?", ["Timothy Berners-Lee", "Bill Gates", "Steve Jobs"])
            ],
            [
              { code: "W 9.1", title: "Complete the table (Components)", task: "Complete the table with missing information:\nComponent (acronym) | Full name / Description | Functions and properties\nhardware | ______ | ______\nsoftware | ______ | ______\nCPU | ______ | ______\nALU | ______ | ______\nCU | ______ | ______\nRAM | ______ | ______\nROM | ______ | ______" },
              { code: "W 9.2", title: "Answer questions (Computers)", task: "Answer the questions based on the text 'Types of computers':\n1 What does a desktop computer consist of?\n2 Are desktop computers designed to be carried around?\n3 Who are laptops useful for?\n4 What is the difference between a netbook and a laptop?\n5 How can you access or enter information on a palmtop?\n6 What are mainframes used for?" },
              { code: "W 9.3", title: "Complete sentences (Internet)", task: "Complete the sentences with the missing information:\n1 The Internet allows people to ______.\n2 In the 1960s, the Internet was used ______.\n3 Thanks to Sir Timothy Berners-Lee ______.\n4 He created the World Wide Web by linking ______.\n5 All you need to access the Internet is ______.\n6 The ISP is ______." }
            ]
          )
        ]
      },
      {
        code: "UNIT 10",
        title: "Automation and Robotics",
        topics: [
          topic("t-unit10", "Unit 10", "Automation",
            [
              lec("10.1", "Automation and Robotics", `
                <p>Mechanisation refers to the process of providing human beings with machinery capable of assisting them with the muscular requirements of work. A further development of mechanisation is represented by automation, which implies the use of control systems and information technologies to reduce the need for both physical and mental work to produce goods.</p>
                <p>Automation has had a great impact on industries over the last century, changing the world economy from industrial jobs to service jobs. In manufacturing, where the process began, automation has meant that the desired results can be obtained through a series of instructions made automatically by the system, which define the actions to be done. Automated manufacturing grants higher consistency and quality, while reducing lead times and handling. It also improves work flow and increases the morale of workers when a good implementation of the automation is made.</p>
                <p>However, the purpose of automation cannot be seen only in terms of a reduction of cost and time; there are several more aspects to be taken into consideration. For example, while it is true that automation offers a higher precision in the manufacturing process, it is also true that it requires skilled workers who can make repairs and manage the machinery.</p>
                <p><b>Robotics:</b> Robotics is a special branch of automation in which the automated machines have certain human features and are used to replace human workers in factory operations. Robots are computer-controlled mechanical devices that are programmed to move, manipulate objects and interact with the environment. Nowadays more and more sophisticated robots are being built to serve various practical purposes, for example in houses, businesses, in the army and for medical appliances for disabled people.</p>
              `),
              lec("10.2", "Sensors", `
                <p>Almost every industrial automated process requires the use of sensors and transducers, which are very advanced devices capable of measuring and sensing the environment and translating physical information (e.g. variations of light, pressure, temperature and position) into electrical signals. The sensor picks up the information to be measured and the transducer converts it into electrical signals that can be directly processed by the control unit of a system.</p>
                <p>Because of the industrial and scientific importance of measuring, sensors are widely used in a variety of fields, such as medicine, engineering, robotics, biology and manufacturing. Traditional machines have difficulty measuring small differences in product size, so sensors can be particularly useful as they can discriminate down to 0,00013 millimetres. They can also detect temperature, humidity and pressure, acquire data and alter the manufacturing process. Sensors are also vital components of advanced machines, such as robots.</p>
                <p>There are two types of sensors: analogue and digital. Analogue sensors operate with data represented by measured voltages or quantities, while digital ones have numeric or digital outputs which can be directly transmitted to computers.</p>
                <p>The sensors usually employed in manufacturing are classified as mechanical, electrical, magnetic and thermal, but they can also be acoustic, chemical, optical and radiation sensors. Moreover, according to their method of sensing, they can be tactile or visual. Tactile sensors are sensitive to touch, force or pressure and they are used to measure and register the interaction between a contact surface and the environment. These sensors are used in innumerable everyday objects, such as lift buttons and lamps which turn on and off by touching the base. Visual sensors, instead, sense the presence, shape and movement of an object optically. They are becoming more and more important in surveillance systems, environment and disaster monitoring and military applications.</p>
              `),
              lec("10.3", "The Optical Mouse", `
                <p>A common example of the application of sensors to everyday objects is the computer mouse. The mechanical mouse has a ball which rotates and translates the <i>motion</i> of our hand into signals that the computer can use.</p>
                <p>Developed in late 1999, the optical mouse is an advanced computer pointing device that uses a light-emitting diode (LED), an <i>optical</i> sensor and a digital signal processor (DSP) in place of the traditional mouse ball and electromechanical transducer. The optical mouse actually uses a tiny <i>camera</i> to take thousands of pictures at a rate of more than 1,000 images per <i>second</i>.</p>
                <p>Optical mice can work on many surfaces without a mouse pad, thanks to an LED that bounces light off the surface it is on onto an optical sensor. The sensor sends each image to a digital signal <i>processor</i> which examines how the patterns have moved since the previous image, determining how far the mouse has moved. The computer then moves the cursor on the screen based on the coordinates received from the mouse. This happens hundreds of times each second, making the cursor appear to move very <i>smoothly</i>.</p>
                <p>The best surfaces reflect but some others, for example a blank sheet of white <i>paper</i>, do not allow the sensor and DSP to work properly because the details are too small to be detected. In addition to LEDs, a recent innovation are laser-based optical mice that detect more surface details compared to LED technology. This results in the ability to use a mouse on almost any surface and to <i>increase</i> the resolution of the image.</p>
              `)
            ],
            [],
            [],
            [
              tq("Mechanisation uses machinery to assist with...", ["muscular requirements", "mental work", "both"]),
              tq("Automation reduces the need for...", ["physical work", "mental work", "both physical and mental work"]),
              tq("What is the main advantage of automation?", ["higher consistency and quality", "unemployment", "high costs"]),
              tq("Sensors translate physical information into...", ["electrical signals", "mechanical signals", "light signals"]),
              tq("Which sensors are sensitive to touch?", ["Tactile", "Visual", "Acoustic"]),
              tq("The optical mouse uses...", ["LED and sensor", "a ball", "a wheel"])
            ],
            [
              { code: "W 10.1", title: "Match words with definitions", task: "Match the words with their definitions:\n1 manufacturing\na the time between the design of a product and its production\n2 information technologies\nb the amount of confidence that a group of people have\n3 goods\nc a set of tasks performed to complete a procedure\n4 service jobs\nd the process of packing and distributing goods\n5 skilled\ne the industry in which machinery is used to produce goods\n6 morale\nf the development and application of computer systems\n7 unemployment\ng having the knowledge and the ability to do something well\n8 lead times\nh things that are made to be sold\n9 handling\ni jobs in transports, communications, hospitals, energy industry, etc.\n10 work flow\nj the state of not having a job" },
              { code: "W 10.2", title: "Answer questions (Sensors)", task: "Answer the questions based on the text 'Sensors':\n1 What does computer-aided technologies mean?\n2 Which software does CAx include?\n3 What are the current limits of CAx?\n4 Can you name two applications of automation technologies?\n5 How does a homotic house differ from a traditional house?\n6 What are robots used for?" },
              { code: "W 10.3", title: "Match sentences (Mouse)", task: "Match each sentence with its ending:\n1 A mechanical mouse\na the optical mouse was developed.\n2 There are no sensors\nb provide high-resolution images.\n3 In late 1999\nc can reflect light in the same way.\n4 An optical mouse\nd in a mechanical mouse.\n5 A DPS\ne has got a scroll ball mechanism inside.\n6 Not all surfaces\nf uses a light-emitting diode, an optical sensor and a DSP.\n7 Laser-based optical mice\ng is a processor for digital signals." }
            ]
          )
        ]
      },
      {
        code: "UNIT 11",
        title: "Technical Assistance and Maintenance",
        topics: [
          topic("t-unit11", "Unit 11", "Maintenance",
            [
              lec("11.1", "Types of Maintenance", `
                <p>Any machine and device must be controlled regularly in order to avoid the risk of damage or breakdown of single parts due to long usage. Sometimes, if a proper maintenance is not done, a fault could occur, with negative consequences on the production process and on the workers' safety. The primary goal of maintenance is to avoid or mitigate the consequences of failure of equipment. This includes performing routine actions to keep the device in working order and prevent the failure before it actually occurs (preventive maintenance), or fixing equipment after breakdown (corrective maintenance).</p>
                <p>Preventive maintenance is designed to preserve and restore equipment reliability by replacing worn components before they actually fail. It includes maintenance activities such as partial or complete overhauls at specified periods, oil changes and lubrication. The ideal preventive maintenance is a combination of technical, administrative and managerial actions to prevent all equipment failure. If carried out properly, preventive maintenance can extend the life of the equipment.</p>
                <p>Corrective maintenance, sometimes simply called 'repair', is carried out to get equipment working again. It aims at restoring the functionality of a machine so that it can continue to perform its work. This type of maintenance can be very expensive because sometimes equipment needs to be replaced, with substantial costs for the company.</p>
                <p>Generally, maintenance is scheduled according to: the original equipment manufacturer's recommendations; codes and legislation within a country; consultancy advice; previous maintenance; most important measured values and performance indications.</p>
              `),
              lec("11.2", "Auto Maintenance", `
                <p>Cars are not just a luxury item to purchase one day and forget about until something happens. A properly maintained car not only lasts longer, but it is also less likely to break down unexpectedly.</p>
                <p>Auto maintenance describes the act of inspecting or testing the condition of car subsystems (e.g.: engine, brakes, radiator, etc.) and replacing parts and fluids. Thanks to regular maintenance it is possible to ensure the safety, reliability and comfort of a car, while during preventive maintenance, a number of parts are replaced to avoid major damage or for safety reasons.</p>
                <p>Car maintenance is usually scheduled according to different factors, such as the year or model of the car, its driving condition and driver behaviour. When scheduling auto maintenance, car manufacturers recommend keeping in mind some factors that may affect the functionality of car subsystems. Some of these factors are: the number of trips and the distance travelled every day; the exposure to particular climate conditions (extreme hot or cold); long-distance cruising and whether the car has to tow a trailer or other heavy loads.</p>
                <p>Common car maintenance tasks include: car wash; check or replace the engine oil and oil filters; inspect or replace windshield wipers; inspect tyre pressure and wear; check wheel alignment; check, clean or replace battery terminals; inspect or replace brake pads and fluids; inspect or replace air filter; lubricate locks and hinges; check all lights; inspect or replace spark plugs; tighten chassis bolts.</p>
                <p>Some tasks that have equivalent service intervals can be combined into one single service known as a tune-up. In modern cars, where electronics control most of the car's functions, the traditional tune-up has been replaced by incorporated software that takes care of the engine by constantly checking thousands of sensor signals. Completed maintenance services are then recorded in a service book which is very useful for keeping track of the car service history.</p>
              `)
            ],
            [],
            [],
            [
              tq("Preventive maintenance is done...", ["before a failure occurs", "after a breakdown", "only when the machine stops"]),
              tq("Corrective maintenance is...", ["repair", "prevention", "inspection"]),
              tq("What can be replaced during preventive maintenance?", ["worn components", "the whole machine", "nothing"]),
              tq("Car maintenance includes checking...", ["engine oil", "only tyres", "only brakes"]),
              tq("A tune-up is a combination of...", ["tasks with equivalent service intervals", "only electrical tasks", "only mechanical tasks"]),
              tq("Where are maintenance services recorded?", ["In a service book", "In a notebook", "In a file"])
            ],
            [
              { code: "W 11.1", title: "Match words with definitions", task: "Match the words with their definitions:\n1 fault\na damaged and in poor condition as a result of much use\n2 to mitigate\nb a set of rules about how something must be done\n3 to fix\nc expert advice within a particular field\n4 overhaul\nd applying a greasy substance to reduce friction\n5 worn\ne a break or other defect in a piece of machinery\n6 lubrication\nf to do the necessary work to repair something that doesn't work properly\n7 code\ng to make something less severe or unpleasant\n8 consultancy\nh a careful examination of a machinery or system that must be repaired" },
              { code: "W 11.2", title: "True or False", task: "Take the quiz and check your answers:\n1 Auto maintenance doesn't entail replacing fluids. True/False\n2 It is not possible to do preventive maintenance to cars. True/False\n3 Car maintenance must be scheduled keeping in mind different factors. True/False\n4 The distance travelled every day doesn't affect the functionality of a car. True/False\n5 If a car is exposed to extreme weather conditions it must be checked more often. True/False\n6 It is not possible to replace windshield wipers. True/False\n7 Brake fluid lasts forever. True/False\n8 Car maintenance tasks should never be combined in one single service. True/False" },
              { code: "W 11.3", title: "Answer questions (Maintenance)", task: "Answer the questions based on the text:\n1 Why is maintenance important?\n2 What are the main types of maintenance?\n3 What is the function of preventive maintenance?\n4 Which activities does it include?\n5 What is maintenance called if it occurs after a failure?\n6 Why can corrective maintenance be expensive?" }
            ]
          )
        ]
      },
      {
        code: "UNIT 12",
        title: "Health and Safety at Work",
        topics: [
          topic("t-unit12", "Unit 12", "Safety",
            [
              lec("12.1", "Health and Safety Regulations", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать общие обязанности работодателя и работника в области охраны труда, различать hazard и risk, извлекать информацию из текста о правилах безопасности и использовать английские формулировки для сообщения об опасности. Конкретные правовые требования определяются законодательством страны и локальными документами организации.</p>
<h3>1. Reading: Health and Safety at Work</h3>
<p>Health and safety at work aims to prevent injuries and ill health. A <b>hazard</b> is something that can cause harm, such as moving machinery, electricity, chemicals, noise or a slippery floor. A <b>risk</b> describes the likelihood and possible severity of harm in a particular situation.</p>
<p>Employers and organisations are generally responsible for providing a safe working environment, suitable equipment, information, instruction and training, and for assessing and controlling workplace risks. Workers are expected to follow approved procedures, use equipment only when trained and authorised, report hazards and cooperate with safety arrangements. The exact duties and legal wording depend on the applicable national law.</p>
<p>The United Kingdom has the Health and Safety at Work etc. Act 1974. It is a UK law and should not be treated as the law of every country. In other countries, different laws and regulatory systems apply. A student should identify the jurisdiction and consult current official sources before making a legal statement.</p>
<p>Risk control may include eliminating a hazard, substituting a safer method or material, using engineering controls, applying administrative procedures and providing appropriate personal protective equipment (PPE). PPE is important, but it should not be treated as the only safety measure. The required controls depend on a risk assessment and approved instructions.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>health and safety</td><td>охрана труда и безопасность</td><td>Health and safety rules protect people.</td></tr>
<tr><td>hazard</td><td>опасный фактор</td><td>Moving parts may be a hazard.</td></tr>
<tr><td>risk</td><td>риск</td><td>Risk depends on likelihood and severity.</td></tr>
<tr><td>risk assessment</td><td>оценка риска</td><td>A risk assessment identifies suitable controls.</td></tr>
<tr><td>control measure</td><td>мера контроля риска</td><td>A guard is one possible control measure.</td></tr>
<tr><td>employer / employee</td><td>работодатель / работник</td><td>Employers and employees have safety duties.</td></tr>
<tr><td>regulation</td><td>нормативное требование</td><td>Regulations vary between countries.</td></tr>
<tr><td>personal protective equipment (PPE)</td><td>средства индивидуальной защиты</td><td>PPE must be suitable for the task.</td></tr>
<tr><td>authorised</td><td>допущенный, уполномоченный</td><td>Only authorised staff may perform the task.</td></tr>
</table>
<h3>3. Language focus: obligation and prohibition</h3>
<p><i>must / have to</i> выражают обязанность: <i>Workers must follow the approved procedure.</i> <i>must not / mustn't</i> выражает запрет: <i>Students must not use equipment without permission.</i> <i>should</i> часто используется для рекомендации. Для сообщения об опасности: <i>I have noticed a hazard. The guard appears to be damaged. Could you ask the responsible person to check it?</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What is the difference between a hazard and a risk?</li><li>Name three possible workplace hazards.</li><li>What are employers generally expected to provide?</li><li>What are workers expected to do?</li><li>Why must legal statements identify the country?</li><li>Why is PPE not the only safety measure?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Hazard or risk?</b> 1) exposed moving parts; 2) likelihood of a hand injury during a task; 3) a wet floor; 4) possible severity of a fall.</p>
<p><b>Задание B. Выберите модальную форму:</b> 1) Students (must/might) follow the instructor's safety rules. 2) You (mustn't/don't have to) remove a guard. 3) You (should/can't) report a damaged cable.</p>
<p><b>Задание C. Составьте короткое сообщение о замеченном опасном факторе: что наблюдается, где, кому сообщить и какая информация пока не подтверждена.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Hazard is a source of potential harm; risk concerns likelihood and severity.</li><li>Moving machinery, electricity, chemicals, noise, slippery floors (any three).</li><li>A safe environment, suitable equipment, information, instruction, training and risk controls.</li><li>Follow procedures, use equipment only when trained/authorised, report hazards and cooperate.</li><li>Because legal systems and duties differ by jurisdiction.</li><li>Because controls must be selected from risk assessment; PPE does not remove the hazard by itself.</li><li>Задание A: hazard; risk; hazard; risk.</li><li>must; mustn't; should.</li></ol>
<p><b>Самостоятельная работа:</b> составьте таблицу из пяти hazards, возможного harm и одной меры контроля. Используйте учебные сценарии; не заменяйте таблицей локальную оценку риска.</p>
`),
              lec("12.2", "Safety Rules and Equipment", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать лексику по теме средств защиты, ограждений, безопасного поведения и сообщения об инцидентах. Важно не заучивать универсальные советы вне контекста: выбор PPE и порядок действий определяются оценкой риска, документацией и инструктажем для конкретного оборудования.</p>
<h3>1. Reading: Safety Rules and Protective Equipment</h3>
<p>Before a workshop activity, students must receive an appropriate briefing and understand the local rules. Equipment may be used only by trained and authorised people. A person who does not understand an instruction should stop and ask the instructor for clarification rather than guess.</p>
<p>Machine guards and other protective devices are designed to prevent access to hazardous moving parts or reduce exposure to danger. They must not be removed, bypassed or ignored. If a guard or safety device appears damaged or unavailable, the condition must be reported and the equipment must not be used until the responsible person has dealt with the issue under the approved procedure.</p>
<p>Personal protective equipment (PPE) may include safety glasses, hearing protection, safety footwear, protective clothing, face shields or respiratory protection. The correct choice depends on the task and risk assessment. Gloves are suitable for some handling tasks but can create an entanglement hazard near rotating machinery; therefore, students must never assume that gloves are always appropriate. The local risk assessment and instructor's directions determine what is required.</p>
<p>Good housekeeping keeps walkways clear and reduces slips, trips and falls. Tools and materials should be stored in their designated places. Cleaning, adjustment, maintenance and isolation of equipment must follow the approved procedure and be performed only by authorised personnel. In an emergency, follow the site's alarm, evacuation and reporting arrangements. Use firefighting equipment only if trained, it is safe to do so and the local emergency procedure permits it.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>machine guard</td><td>ограждение станка</td><td>A machine guard protects access to moving parts.</td></tr>
<tr><td>safety device</td><td>защитное устройство</td><td>Report a damaged safety device.</td></tr>
<tr><td>entanglement</td><td>затягивание / захват вращающимися частями</td><td>Loose clothing may create an entanglement hazard.</td></tr>
<tr><td>hearing protection</td><td>защита слуха</td><td>Hearing protection is selected after risk assessment.</td></tr>
<tr><td>face shield</td><td>защитный щиток</td><td>A face shield may protect against flying particles.</td></tr>
<tr><td>respiratory protection</td><td>средства защиты органов дыхания</td><td>Respiratory protection depends on the exposure.</td></tr>
<tr><td>housekeeping</td><td>поддержание порядка на рабочем месте</td><td>Good housekeeping keeps walkways clear.</td></tr>
<tr><td>evacuation</td><td>эвакуация</td><td>Follow the evacuation route.</td></tr>
<tr><td>incident report</td><td>сообщение об инциденте</td><td>Complete an incident report as instructed.</td></tr>
</table>
<h3>3. Language focus: clear safety messages</h3>
<p>Короткие и конкретные сообщения лучше расплывчатых фраз:</p>
<ul><li><i>The machine guard appears to be damaged.</i> — Ограждение станка, похоже, повреждено.</li><li><i>I have stopped the student activity and informed the instructor.</i> — Учебная деятельность остановлена, преподаватель уведомлён.</li><li><i>I am not authorised to inspect or repair this equipment.</i> — У меня нет допуска к осмотру или ремонту этого оборудования.</li><li><i>Could you confirm the required PPE for this task?</i> — Не могли бы вы уточнить необходимые СИЗ для этой задачи?</li></ul>
<h3>4. Reading comprehension</h3>
<ol><li>Who may use workshop equipment?</li><li>What should happen if a guard appears damaged?</li><li>Why are gloves not always appropriate near rotating machinery?</li><li>Who determines the required PPE?</li><li>Who may isolate or maintain equipment?</li><li>When may a person use firefighting equipment?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Выберите корректное сообщение:</b> 1) “The guard is damaged. I will remove it.” 2) “The guard appears to be damaged. I will report it to the instructor.” 3) “The guard is not important.”</p>
<p><b>Задание B. Соотнесите PPE и общую функцию:</b> safety glasses; hearing protection; safety footwear; respiratory protection. Варианты: reduce exposure to harmful airborne substances; protect eyes; reduce exposure to hazardous noise; protect feet from specified workplace hazards.</p>
<p><b>Задание C. Ролевая ситуация:</b> студент замечает повреждённое ограждение. Он сообщает только наблюдаемые факты, преподаватель уточняет место и статус, третий студент записывает сообщение. Не разыгрывайте ремонт, снятие ограждения или запуск оборудования.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Trained and authorised people.</li><li>Report it; do not use the equipment until the responsible person has dealt with it under the approved procedure.</li><li>They may become caught in rotating parts.</li><li>The task-specific risk assessment and approved local instructions.</li><li>Authorised personnel only.</li><li>Only if trained, it is safe and the local emergency procedure permits it.</li><li>Задание A: вариант 2.</li><li>Safety glasses—eyes; hearing protection—noise; safety footwear—feet; respiratory protection—airborne substances.</li></ol>
<p><b>Самостоятельная работа:</b> напишите диалог из 8–10 реплик, в котором студент уточняет необходимые СИЗ и сообщает о замеченном дефекте защитного устройства. Используйте must, must not, should и could you.</p>
`)
            ],
            [],
            [],
            [
              tq("What is a hazard?", ["A source of potential harm", "The likelihood and severity of harm", "A record of completed training"]),
              tq("What does risk describe?", ["The likelihood and possible severity of harm", "A type of personal protective equipment", "A machine guard"]),
              tq("Why must legal safety statements identify the country?", ["Legal duties and regulatory systems differ by jurisdiction", "The same law applies worldwide", "Workshop rules are identical in every country"]),
              tq("Who may use workshop equipment?", ["People who are trained and authorised", "Any visitor", "Anyone who has read a short notice"]),
              tq("What should happen if a machine guard appears damaged?", ["Report it and do not use the equipment until the responsible person has dealt with it", "Remove the guard and continue", "Ignore it if the machine still runs"]),
              tq("Why may gloves be unsuitable near rotating machinery?", ["They can create an entanglement hazard", "They always reduce grip", "They replace machine guards"])
            ],
            [
              { code: "W 12.1", title: "Match words with definitions", task: "Match the words with their definitions:\n1 precautionary measure\na a responsibility or task that you have to do as part of your job\n2 carelessness\nb to deal effectively with a difficult situation\n3 welfare\nc the buildings and land occupied by a business\n4 duty\nd poor attention to an activity, which results in harm or errors\n5 premises\ne action taken in order to prevent something dangerous from happening\n6 to cope with\nf the health, comfort and well-being of a person or group" },
              { code: "W 12.2", title: "True or False (Workshop Safety Language)", task: "Decide if the following statements are true (T) or false (F), then correct the false ones. Follow the college's approved workshop and emergency procedures; this exercise is not an operating instruction:\n1 Use workshop equipment only when trained, authorised and instructed.\n2 Keep walkways clear and report hazards to the responsible person.\n3 Any student may isolate, clean or repair equipment without permission.\n4 Wear the PPE specified by the task risk assessment and local instructions.\n5 Sunglasses always provide the eye protection required for workshop tasks.\n6 Damaged tools and safety devices must be reported.\n7 Ask the instructor or responsible person when an instruction is unclear.\n8 In a fire emergency, follow the site alarm and evacuation arrangements.\n9 Collect personal belongings before leaving the workshop during an evacuation.\n10 First aid should be provided by people trained and designated under the site arrangements." },
              { code: "W 12.3", title: "Reading a Local Emergency Plan", task: "Use the college-approved emergency information supplied by the instructor. Do not create a universal fire-response sequence. Find and record: (1) how an alarm is raised; (2) the designated evacuation route and assembly point; (3) how to report a person who may be missing; (4) who is responsible for contacting emergency services; (5) which response actions are reserved for trained and authorised people. For each answer, identify the relevant heading or instruction in the supplied local plan. Do not practise rescue, firefighting, equipment isolation or other emergency interventions as part of this language exercise. Local emergency arrangements and instructor directions take priority." }
            ]
          )
        ]
      }
    ],
    videos: [], passports: [
        { title: "Flash on English for Mechanics, Electronics and Technical Assistance (PDF)", description: "Учебное пособие по техническому английскому языку.", file: "Flash_on_English_for_Mechanics.pdf" }
    ], safety: [], formatting: {},
    
    flashcards: {
      technical: [
        { front: "lathe", back: "токарный станок" }, { front: "milling machine", back: "фрезерный станок" },
        { front: "spindle", back: "шпиндель" }, { front: "chuck", back: "патрон" },
        { front: "tool post", back: "резцедержатель" }, { front: "tailstock", back: "задняя бабка" },
        { front: "carriage", back: "суппорт" }, { front: "feed", back: "подача" },
        { front: "workpiece", back: "заготовка" }, { front: "tolerance", back: "допуск" },
        { front: "accuracy", back: "точность" }, { front: "micrometer", back: "микрометр" },
        { front: "calliper", back: "штангенциркуль" }, { front: "drill", back: "сверло" },
        { front: "thread", back: "резьба" }, { front: "hardness", back: "твёрдость" },
        { front: "strength", back: "прочность" }, { front: "alloy", back: "сплав" },
        { front: "steel", back: "сталь" }, { front: "cast iron", back: "чугун" },
        { front: "aluminium", back: "алюминий" }, { front: "copper", back: "медь" },
        { front: "CNC", back: "ЧПУ" }, { front: "controller", back: "контроллер" },
        { front: "sensor", back: "датчик" }, { front: "motor", back: "двигатель" },
        { front: "voltage", back: "напряжение" }, { front: "current", back: "ток" },
        { front: "resistance", back: "сопротивление" }, { front: "circuit", back: "цепь" }
      ],
      crossword: [
        { word: "LATHE", clue: "Machine tool that rotates the workpiece" },
        { word: "SPINDLE", clue: "Rotating part of the machine tool" },
        { word: "CHUCK", clue: "Device that holds the workpiece on a lathe" },
        { word: "MILLING", clue: "Machining with rotary cutters" },
        { word: "TOLERANCE", clue: "Allowed deviation from nominal size" },
        { word: "MICROMETER", clue: "Precise measuring instrument (0.01 mm)" },
        { word: "DRILL", clue: "Tool that makes holes" },
        { word: "THREAD", clue: "Cut on a bolt or nut" },
        { word: "COOLANT", clue: "Liquid that cools the cutting zone" },
        { word: "SAFETY", clue: "___ glasses, ___ shoes, ___ rules" }
      ]
    }
  };
})();
