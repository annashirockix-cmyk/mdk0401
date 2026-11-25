"use strict";

window.MDK_DATA = window.MDK_DATA || {};

(function () {
  function splitTeacherSections(content) {
    var student = String(content || "");
    var teacher = [];
    var headingPattern = /<h([1-6])\b[^>]*>[\s\S]*?<\/h\\1>/gi;
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

  window.MDK_DATA["basic"] = {
    id: "basic",
    shortName: "Basic English",
    title: "English (СПО, по учебнику Н.М. Беловой)",
    module: "General English · Based on N.M. Belova's textbook",
    sections: [
      {
        code: "UNIT 1",
        title: "About Myself. Phonetics and Grammar Basics",
        topics: [
          topic("b-unit1", "Unit 1", "About Myself",
            [
              lec("1.1", "Phonetics and Pronunciation", `
<h3>Цель и результаты обучения</h3>
<p>Цель занятия — освоить базовые особенности английского произношения и научиться пользоваться фонетической транскрипцией. После занятия студент сможет различать несколько важных пар звуков, находить ударный слог и читать знакомые слова по транскрипции.</p>
<h3>1. Буква и звук — не одно и то же</h3>
<p>В английском языке 26 букв, но значительно больше отдельных звуков. Одна буква может передавать разные звуки, а один звук может записываться разными буквосочетаниями. Поэтому произношение нельзя надёжно определить только по написанию: используйте словарь с транскрипцией и аудиопримером.</p>
<p>Фонетическая запись обычно заключается в квадратные скобки [ ] или косые скобки / /. В учебных словарях встречаются оба способа. Ниже используется широкая IPA-транскрипция; произношение может немного различаться в британском и американском вариантах.</p>
<table style="width:100%;border-collapse:collapse">
<tr><th>Слово</th><th>Транскрипция</th><th>Значение</th></tr>
<tr><td>ship</td><td>/ʃɪp/</td><td>корабль</td></tr>
<tr><td>sheep</td><td>/ʃiːp/</td><td>овца</td></tr>
<tr><td>live</td><td>/lɪv/</td><td>жить</td></tr>
<tr><td>leave</td><td>/liːv/</td><td>уходить, оставлять</td></tr>
<tr><td>full</td><td>/fʊl/</td><td>полный</td></tr>
<tr><td>fool</td><td>/fuːl/</td><td>глупец</td></tr>
</table>
<p>Долгота гласного обозначается знаком /ː/. Важно не просто тянуть звук, а сохранять правильное качество гласного: /ɪ/ и /iː/ — разные фонемы, и замена одной другой может изменить значение слова.</p>
<h3>2. Важные гласные и согласные</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>Звук</th><th>Пример</th><th>Подсказка</th></tr>
<tr><td>/ɪ/ — /iː/</td><td>ship — sheep</td><td>Краткий /ɪ/ не превращайте в русский «и»; /iː/ произносится дольше и напряжённее.</td></tr>
<tr><td>/ʊ/ — /uː/</td><td>full — fool</td><td>Следите и за качеством, и за длительностью.</td></tr>
<tr><td>/æ/</td><td>cat, bag</td><td>Челюсть открыта шире, чем для русского «э».</td></tr>
<tr><td>/ʌ/</td><td>cup, bus</td><td>Краткий центральный гласный, не заменяйте его автоматически русским «а».</td></tr>
<tr><td>/θ/</td><td>think, three</td><td>Кончик языка слегка между зубами; голос не включается.</td></tr>
<tr><td>/ð/</td><td>this, they</td><td>Положение языка похоже, но голос включён.</td></tr>
<tr><td>/w/</td><td>we, work</td><td>Губы округлены; не заменяйте звук русским /в/.</td></tr>
<tr><td>/ŋ/</td><td>sing, working</td><td>Заднеязычный носовой звук; после него не добавляйте отдельный /g/ в sing.</td></tr>
</table>
<h3>3. Ударение и ритм</h3>
<p>В многосложном слове один слог обычно выделяется сильнее: <b>TA</b>ble /ˈteɪ.bəl/, a<b>BOUT</b> /əˈbaʊt/. Знак /ˈ/ передаёт основное ударение. В английской фразе смысловые слова обычно звучат заметнее, а служебные слова часто редуцируются: <i>I can DO it.</i> В нейтральном произношении can может звучать как /kən/, но под ударением — /kæn/.</p>
<p>Интонация помогает показать тип высказывания и отношение говорящего. Вопросы с вопросительным словом часто имеют нисходящую интонацию: <i>Where do you study?</i> В простом вопросе yes/no часто встречается восходящая интонация: <i>Do you study English?</i> Это общие модели, а не жёсткие правила для каждой ситуации.</p>
<h3>4. Практика произношения</h3>
<p><b>Задание A.</b> Прочитайте пары вслух и объясните, какой звук различается: ship/sheep; live/leave; full/fool; thin/then; vest/west.</p>
<p><b>Задание B.</b> Найдите ударный слог: table, about, engineer, information, laboratory. Сверьте транскрипцию со словарём.</p>
<p><b>Задание C.</b> Прочитайте фразы, выделяя смысловое слово: I study ENGLISH. / I study English at COLLEGE. / I study English every WEEK.</p>
<p><b>Задание D.</b> Запишите транскрипцию пяти знакомых слов по словарю и отметьте основной ударный слог.</p>
<h3>5. Самопроверка и ключ преподавателя</h3>
<ol>
<li>Сколько букв в английском алфавите? — 26.</li>
<li>Что обозначает знак /ː/? — Долготу гласного.</li>
<li>Чем отличаются /θ/ и /ð/? — При /ð/ голосовые связки вибрируют, при /θ/ — нет.</li>
<li>В каком слове звук /iː/: ship или sheep? — sheep.</li>
<li>Какой звук в начале слова work? — /w/.</li>
</ol>
<p><b>Самостоятельная работа:</b> выберите 8 слов из текущего учебного текста, найдите их транскрипцию и аудиопроизношение в словаре, отметьте ударение и подготовьте чтение вслух. Не записывайте русскими буквами точную транскрипцию: используйте IPA и аудиообразец.</p>
`),
              lec("1.2", "Grammar: Pronouns, Verbs, Modals", `
<h3>Цель и результаты обучения</h3>
<p>Цель занятия — научиться выбирать местоимения по их функции в предложении, различать основные значения глаголов be, have и do и использовать модальные глаголы в простых ситуациях учёбы и повседневной жизни.</p>
<h3>1. Личные и объектные местоимения</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>Подлежащее</th><th>Объектная форма</th><th>Пример</th></tr>
<tr><td>I</td><td>me</td><td>She helps me.</td></tr><tr><td>you</td><td>you</td><td>I know you.</td></tr><tr><td>he</td><td>him</td><td>We see him.</td></tr><tr><td>she</td><td>her</td><td>They call her.</td></tr><tr><td>it</td><td>it</td><td>I use it.</td></tr><tr><td>we</td><td>us</td><td>The teacher helps us.</td></tr><tr><td>they</td><td>them</td><td>I meet them.</td></tr>
</table>
<p>Форма подлежащего стоит перед сказуемым: <i>They study English.</i> Объектная форма обычно стоит после глагола или предлога: <i>The teacher speaks to them.</i> Не говорите <i>Me am a student</i>: правильно <i>I am a student</i>.</p>
<h3>2. Притяжательные и возвратные формы</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>Подлежащее</th><th>Перед существительным</th><th>Самостоятельная форма</th><th>Возвратная форма</th></tr>
<tr><td>I</td><td>my</td><td>mine</td><td>myself</td></tr><tr><td>you</td><td>your</td><td>yours</td><td>yourself</td></tr><tr><td>he</td><td>his</td><td>his</td><td>himself</td></tr><tr><td>she</td><td>her</td><td>hers</td><td>herself</td></tr><tr><td>it</td><td>its</td><td>обычно не используется отдельно</td><td>itself</td></tr><tr><td>we</td><td>our</td><td>ours</td><td>ourselves</td></tr><tr><td>they</td><td>their</td><td>theirs</td><td>themselves</td></tr>
</table>
<p>Сравните: <i>This is my notebook.</i> — Это моя тетрадь. <i>This notebook is mine.</i> — Эта тетрадь моя. Притяжательное местоимение перед существительным не заменяет артикль: говорим <i>my book</i>, а не <i>the my book</i>.</p>
<h3>3. Глаголы be, have и do</h3>
<p><b>Be</b> связывает подлежащее с характеристикой, профессией, местом или состоянием: <i>I am a student. The workshop is large. They are ready.</i> Формы настоящего времени: I am; he/she/it is; you/we/they are. Вопрос строится перестановкой: <i>Are you ready?</i> Отрицание: <i>She is not late.</i></p>
<p><b>Have</b> выражает обладание и входит в устойчивые конструкции: <i>We have a lesson. She has a timetable. I have to study.</i> В Present Simple у he/she/it используется has. В конструкции have to выражается необходимость: <i>I have to submit the task.</i></p>
<p><b>Do</b> — смысловой глагол в выражениях <i>do homework</i>, <i>do an exercise</i>; вспомогательный глагол для вопросов и отрицаний в Present Simple: <i>Do you study? He does not work here.</i> После does смысловой глагол остаётся в начальной форме: <i>Does she study?</i>, не <i>Does she studies?</i></p>
<h3>4. Модальные глаголы</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>Форма</th><th>Основное значение</th><th>Пример</th></tr>
<tr><td>can / can't</td><td>умение, возможность</td><td>I can read technical texts.</td></tr>
<tr><td>may</td><td>разрешение или вероятность</td><td>May I ask a question?</td></tr>
<tr><td>must</td><td>сильная обязанность, правило</td><td>Students must follow the safety rules.</td></tr>
<tr><td>have to</td><td>необходимость, часто внешнее требование</td><td>We have to wear the required PPE.</td></tr>
<tr><td>should</td><td>совет, рекомендация</td><td>You should check the instructions.</td></tr>
<tr><td>need to</td><td>необходимость</td><td>You need to save the file.</td></tr>
<tr><td>mustn't</td><td>запрет</td><td>You mustn't use a damaged cable.</td></tr>
<tr><td>don't have to</td><td>отсутствие необходимости</td><td>You don't have to print the file.</td></tr>
</table>
<p>Важно: <i>mustn't</i> означает «нельзя», а <i>don't have to</i> — «не обязательно». После can, may, must и should используется глагол без to: <i>She can speak English.</i> Исключение — конструкции <i>have to</i> и <i>need to</i>.</p>
<h3>5. Практика</h3>
<p><b>Задание A. Выберите местоимение.</b> 1) The teacher helps (we/us). 2) This is (my/mine) dictionary. 3) The blue folder is (their/theirs). 4) Anna and I — (we/us) study together.</p>
<p><b>Задание B. Исправьте ошибки.</b> 1) He are a student. 2) Does she works here? 3) This is the my book. 4) They can to read the text.</p>
<p><b>Задание C. Выберите значение.</b> 1) You mustn't enter this area. 2) You don't have to come early. 3) You should revise the words. Объясните разницу между запретом, отсутствием необходимости и советом.</p>
<p><b>Задание D. Составьте 6 предложений о своей учёбе: два с be, одно с have, одно с do, два с модальными глаголами.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol>
<li>Объектная форма от we — us.</li><li>Перед существительным используется my; самостоятельно — mine.</li><li>Правильно: He is a student.</li><li>Правильно: Does she work here?</li><li>Правильно: This is my book.</li><li>Правильно: They can read the text.</li><li>mustn't — запрет; don't have to — нет необходимости; should — совет.</li>
</ol>
<p><b>Самостоятельная работа:</b> составьте личную памятку из 10 предложений о колледже, используя не менее четырёх типов местоимений, be/have/do и три модальных значения. Подчеркните местоимения и обведите модальные конструкции.</p>
`),
              lec("1.3", "Reading: Speak about yourself", `
<h3>Цель и результаты обучения</h3>
<p>Цель занятия — научиться представлять себя на английском в учебной и профессиональной среде, выбирать релевантную информацию и строить связный рассказ. Личные сведения добровольны: студент может использовать вымышленный профиль и не обязан сообщать семейное положение, адрес, возраст или другие частные данные.</p>
<h3>1. Reading: A College Student</h3>
<p><b>Read the text.</b></p>
<p>My name is Alex, and I am a first-year college student. I study engineering and attend English classes twice a week. My college timetable includes general subjects and practical modules. I enjoy learning how machines and technical systems work. I usually prepare for classes in the evening and make short vocabulary notes. When I do not understand an instruction, I ask the teacher to explain it. In the future, I would like to work in an engineering team and continue developing my professional skills.</p>
<p>At weekends, I sometimes meet friends, read, listen to music or go for a walk. I also try to find time for rest. Learning a profession takes effort, but clear goals and regular practice help me make progress.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Пример</th></tr>
<tr><td>first-year student</td><td>студент первого курса</td><td>I am a first-year student.</td></tr>
<tr><td>timetable</td><td>расписание</td><td>My timetable changes every term.</td></tr>
<tr><td>practical module</td><td>практический модуль</td><td>We have a practical module today.</td></tr>
<tr><td>professional skills</td><td>профессиональные навыки</td><td>I want to develop my professional skills.</td></tr>
<tr><td>to prepare for</td><td>готовиться к</td><td>I prepare for my English class.</td></tr>
<tr><td>to make progress</td><td>делать успехи</td><td>Regular practice helps me make progress.</td></tr>
<tr><td>in the future</td><td>в будущем</td><td>In the future, I would like to work in a team.</td></tr>
</table>
<h3>3. Language focus: a short personal introduction</h3>
<p>Для рассказа о себе удобно использовать несколько смысловых блоков:</p>
<ol>
<li><b>Basic information:</b> My name is… / I am a student at…</li>
<li><b>Studies:</b> I study… / My course includes… / I am interested in…</li>
<li><b>Skills and interests:</b> I can… / I enjoy… / I am learning to…</li>
<li><b>Plans:</b> I would like to… / My goal is to…</li>
</ol>
<p>Present Simple описывает факты и регулярные действия: <i>I study engineering. I attend classes twice a week.</i> Конструкция <i>would like to + verb</i> выражает вежливое желание или план: <i>I would like to improve my English.</i> Не используйте <i>I am used to spend</i> для значения «я обычно провожу»: скажите <i>I usually spend…</i> или <i>I am used to spending…</i> (я привык проводить…).</p>
<h3>4. Reading comprehension</h3>
<ol>
<li>What does Alex study?</li><li>How often does Alex attend English classes?</li><li>When does Alex usually prepare for classes?</li><li>What does Alex do when an instruction is unclear?</li><li>Name two activities Alex sometimes does at weekends.</li><li>What would Alex like to do in the future?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. True or False.</b> 1) Alex is a first-year student. 2) Alex studies medicine. 3) Alex makes vocabulary notes. 4) Alex never asks questions. 5) Alex wants to develop professional skills.</p>
<p><b>Задание B. Заполните пропуски:</b> 1) I ___ a college student. 2) I ___ engineering. 3) I usually ___ for classes in the evening. 4) I would like ___ improve my English.</p>
<p><b>Задание C. Соберите рассказ из четырёх частей:</b> information about studies; interests; current skills; future plans. Используйте связки <i>also, because, usually, in the future</i>.</p>
<p><b>Задание D. Speaking:</b> подготовьте рассказ на 60–90 секунд. Можно использовать своё имя и безопасные сведения или вымышленный профиль. Не требуется сообщать адрес, семейное положение, доход или иные частные данные.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol>
<li>Alex studies engineering.</li><li>Twice a week.</li><li>In the evening.</li><li>Alex asks the teacher to explain it.</li><li>Any two: meets friends, reads, listens to music, goes for a walk.</li><li>Alex would like to work in an engineering team and develop professional skills.</li>
<li>True / False / True / False / True.</li>
<li>am; study; prepare; to.</li>
</ol>
<p><b>Критерии устного ответа (8 баллов):</b> содержание и последовательность — 0–2; уместная лексика — 0–2; грамматическая понятность — 0–2; произношение и темп, позволяющие понять сообщение, — 0–2. Акцент сам по себе не снижает оценку, если речь понятна.</p>
<p><b>Самостоятельная работа:</b> напишите профиль на 80–100 слов по четырём блокам. Выделите пять глаголов в Present Simple и две конструкции для выражения планов.</p>
`)
            ],
            [], // Practicals
            [], // SelfWork
            [
              tq("This computer is ...", ["me", "my", "mine"]),
              tq("You can ask ... teacher about it.", ["our", "ours", "ourselves"]),
              tq("Can you see ... through the window?", ["something", "anything", "nothing"]),
              tq("You will ... learn the poem.", ["must", "have to", "can"]),
              tq("Nobody ... heard about this writer.", ["haven't", "have", "has"]),
              tq("I don't believe he is ... cruel.", ["what", "so", "that"]),
              tq("He had read the article ... yesterday evening.", ["must", "had", "by"])
            ],
            [
              { code: "W 1.1", title: "Grammar Exercises: Pronouns & Verbs", task: "1. Are you in the library? I'd like to join ... .\n2. The professor is at the University. You can meet ... .\n3. Your test is on the desk. Take ... .\n4. We can't make a conclusion. Can you help ... ?\n5. Are they still analyzing the data? May I speak to ... ?\n6. The secretary may be late. Tell ... the time, please.\n7. The assistant is at the laboratory. Ask ... to come, please.\n8. The researchers are to arrive at 12. Meet ... in the hall.\n\nInsert possessive pronouns:\n1. My friends and I live in a little village. There are many old houses in ... village.\n2. You take chemistry at University. Are there many students at ... faculty?\n3. Joe teaches at school. Does he like ... job?\n4. I have got a family. I spend every weekend with ... family.\n5. Your parents live in Moscow. Do they have ... own flat?" },
              { code: "W 1.2", title: "Translation Practice (Unit 1)", task: "Translate the following sentences into English:\n1. Я работаю распространителем в иностранной торговой компании.\n2. Мне нравится моя работа, хотя я занят целый день.\n3. Изучать иностранный язык очень важно.\n4. Высшее образование необходимо каждому руководителю.\n5. Я собираюсь поменять работу в следующем году.\n6. Я надеюсь, что через несколько лет получу диплом инженера.\n7. Без сомнения, будущее человека во многом зависит от его здоровья.\n8. Активный отдых - лучшее средство для того, чтобы поддерживать хорошую физическую форму." }
            ]
          )
        ]
      },
            {
        code: "UNIT 2",
        title: "The Town I Live In",
        topics: [
          topic("b-unit2", "Unit 2", "Nizhnekamsk",
            [
              lec("2.1", "Grammar: Word Formation & Chain of Definitions", `
<h3>Цель и результаты обучения</h3>
<p>На занятии изучаются основные модели словообразования и длинные именные группы. После занятия студент сможет определить часть речи по распространённым суффиксам, распознать отрицательное значение некоторых приставок, выделить главное слово в цепочке существительных и перевести словосочетание с учётом контекста.</p>
<h3>1. Словообразование: основа, приставка и суффикс</h3>
<p>Слово может состоять из основы и дополнительных морфем. Приставка обычно меняет значение слова, суффикс часто меняет часть речи или оттенок значения. Это полезная подсказка, но не абсолютное правило: значение незнакомого слова всегда проверяйте по контексту и словарю.</p>
<table style="width:100%;border-collapse:collapse">
<tr><th>Модель</th><th>Примеры</th><th>Значение / функция</th></tr>
<tr><td>-er / -or</td><td>teach → teacher; operate → operator</td><td>человек, выполняющий действие</td></tr>
<tr><td>-ment</td><td>develop → development</td><td>процесс или результат</td></tr>
<tr><td>-tion / -sion</td><td>inform → information; decide → decision</td><td>действие, процесс или понятие</td></tr>
<tr><td>-ness</td><td>kind → kindness</td><td>качество или состояние</td></tr>
<tr><td>-ity</td><td>active → activity</td><td>свойство или состояние</td></tr>
<tr><td>-ful / -less</td><td>use → useful / useless</td><td>наличие / отсутствие признака</td></tr>
<tr><td>-able / -ible</td><td>read → readable; access → accessible</td><td>возможность или пригодность</td></tr>
<tr><td>un- / in- / im- / il- / ir-</td><td>clear → unclear; correct → incorrect; possible → impossible</td><td>отрицание или противоположное значение</td></tr>
</table>
<p>Не добавляйте приставку механически: например, не каждое слово образует отрицание с un-. Проверяйте готовую форму: <i>unusual, incorrect, impossible, illegal, irregular</i>.</p>
<h3>2. Семейства слов</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>Глагол</th><th>Существительное</th><th>Прилагательное</th><th>Пример</th></tr>
<tr><td>educate</td><td>education</td><td>educational</td><td>education system</td></tr>
<tr><td>employ</td><td>employment</td><td>employed</td><td>employment record</td></tr>
<tr><td>measure</td><td>measurement</td><td>measurable</td><td>measurement result</td></tr>
<tr><td>inform</td><td>information</td><td>informative</td><td>information source</td></tr>
<tr><td>develop</td><td>development</td><td>developed</td><td>professional development</td></tr>
</table>
<p>Окончание помогает предположить часть речи: -tion/-ment часто образуют существительные, -al/-ful/-able — прилагательные, -ly — многие наречия. Но есть исключения: <i>friendly</i> — прилагательное, а не наречие.</p>
<h3>3. Цепочки существительных (noun compounds)</h3>
<p>В английском несколько существительных могут стоять рядом без предлога: <i>college library card</i>, <i>machine tool operator</i>, <i>student progress report</i>. Обычно последнее слово является главным, а предыдущие уточняют его. Определите главное слово, затем двигайтесь слева направо, задавая вопрос «какой? для чего? чей?». Перевод не всегда дословный: учитывайте устойчивые сочетания и контекст.</p>
<table style="width:100%;border-collapse:collapse">
<tr><th>Сочетание</th><th>Главное слово</th><th>Возможный перевод</th></tr>
<tr><td>college library card</td><td>card</td><td>карта читателя библиотеки колледжа</td></tr>
<tr><td>machine tool operator</td><td>operator</td><td>оператор станка</td></tr>
<tr><td>student progress report</td><td>report</td><td>отчёт об успеваемости студента</td></tr>
<tr><td>computer safety rules</td><td>rules</td><td>правила безопасности при работе с компьютером</td></tr>
</table>
<h3>4. Порядок слов в предложении</h3>
<p>Базовая нейтральная модель: <b>Subject + Verb + Object + Place + Time</b>: <i>Students study English in the classroom every Monday.</i> Вопросы и отрицания в Present Simple требуют do/does, если в предложении нет be или другого вспомогательного глагола: <i>Does the lesson start at nine?</i> / <i>The lesson does not start at ten.</i></p>
<p>Прилагательное обычно стоит перед существительным: <i>a new computer</i>. Наречия частотности обычно стоят перед смысловым глаголом, но после be: <i>We usually study here.</i> / <i>She is always punctual.</i></p>
<h3>5. Практика</h3>
<p><b>Задание A. Определите часть речи:</b> development, useful, operator, impossible, carefully, information.</p>
<p><b>Задание B. Образуйте слово:</b> 1) educate → noun; 2) measure → noun; 3) correct → negative adjective; 4) use → adjective meaning “can be used”; 5) employ → noun.</p>
<p><b>Задание C. Найдите главное слово и переведите:</b> college timetable; workshop safety rules; machine tool operator; student information form.</p>
<p><b>Задание D. Исправьте порядок слов:</b> 1) English every week students study. 2) usually is she on time. 3) Does he studies at college?</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol>
<li>development — существительное; useful — прилагательное; operator — существительное; impossible — прилагательное; carefully — наречие; information — существительное.</li>
<li>education; measurement; incorrect; usable; employment.</li>
<li>Главные слова: timetable; rules; operator; form. Переводы: расписание колледжа; правила безопасности мастерской; оператор станка; анкета/форма с информацией о студенте.</li>
<li>Students study English every week. She is usually on time. Does he study at college?</li>
</ol>
<p><b>Самостоятельная работа:</b> составьте 8 слов из семейств educate, employ, measure, inform и develop; затем разберите 5 именных цепочек из учебного текста, выделив главное слово и предложив контекстный перевод.</p>
`),
              lec("2.2", "Reading: Nizhnekamsk", `
<h3>Цель и результаты обучения</h3>
<p>Цель занятия — описывать город или населённый пункт, рассказывать о его расположении, инфраструктуре и значимых местах. Студент научится извлекать основную и детальную информацию из короткого текста и задавать уточняющие вопросы о маршруте и городских объектах.</p>
<h3>1. Reading: A City in Tatarstan</h3>
<p><b>Read the text.</b></p>
<p>Nizhnekamsk is a city in the Republic of Tatarstan, in the Volga region of Russia. It is situated near the Kama River and is known for its industrial enterprises, including petrochemical and tyre production. The city has residential areas, educational institutions, shops, sports facilities and public spaces. People use buses and other local transport to travel between neighbourhoods. The city is also connected with the wider region by road and rail routes.</p>
<p>Like many industrial cities, Nizhnekamsk combines places of work and study with areas for everyday life and recreation. Residents may visit parks, cultural venues and sports centres. When describing a city, it is useful to name its location, main activities, transport links and public facilities. Specific opening hours, routes and current statistics should be checked using up-to-date local information.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>be situated / be located</td><td>располагаться</td><td>The city is situated near a river.</td></tr>
<tr><td>industrial enterprise</td><td>промышленное предприятие</td><td>The region has several industrial enterprises.</td></tr>
<tr><td>residential area</td><td>жилой район</td><td>There is a park in the residential area.</td></tr>
<tr><td>public facility</td><td>общественный объект / учреждение</td><td>A library is a public facility.</td></tr>
<tr><td>transport link</td><td>транспортное сообщение</td><td>The town has good transport links.</td></tr>
<tr><td>recreation</td><td>отдых</td><td>The park is a place for recreation.</td></tr>
<tr><td>neighbourhood</td><td>район, соседство</td><td>My college is in another neighbourhood.</td></tr>
</table>
<h3>3. Language focus: describing places</h3>
<p>Для расположения используйте <i>in, near, on, to the north/south of</i>: <i>The city is in Tatarstan. It is near the Kama River.</i> Для наличия объектов используйте <i>there is</i> с единственным числом и неисчисляемыми существительными, <i>there are</i> — с множественным: <i>There is a railway station. There are several parks.</i></p>
<p>Чтобы описать назначение, используйте <i>is used for</i> или <i>people go there to…</i>: <i>A sports centre is used for training. People go there to exercise.</i> Для сравнения: <i>larger than, more convenient than, less crowded than</i>.</p>
<h3>4. Reading comprehension</h3>
<ol>
<li>In which republic is Nizhnekamsk situated?</li><li>Which river is mentioned?</li><li>Name two industrial activities mentioned in the text.</li><li>What kinds of public places are available in the city?</li><li>Why should current routes and opening hours be checked?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Выберите форму:</b> 1) There (is/are) several parks. 2) The city (is/are) near the river. 3) There (is/are) a railway station.</p>
<p><b>Задание B. Дополните предложения:</b> 1) My college is situated… 2) There are… near my home. 3) People go to the library to… 4) The main transport links are…</p>
<p><b>Задание C. Составьте маршрут:</b> спросите, как пройти от колледжа до библиотеки или остановки. Используйте <i>Excuse me, how can I get to…? Go straight ahead. Turn left/right. It is opposite/next to…</i></p>
<p><b>Задание D. Speaking:</b> подготовьте описание своего города или района на 8–10 предложений. Можно выбрать любой населённый пункт, а не только место проживания.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol>
<li>The Republic of Tatarstan.</li><li>The Kama River.</li><li>Petrochemical and tyre production.</li><li>Educational institutions, shops, sports facilities, parks and cultural venues.</li><li>Because routes and opening hours can change.</li><li>Задание A: are; is; is.</li></ol>
<p><b>Самостоятельная работа:</b> создайте мини-гид из 100–120 слов: location, transport, education, public facilities, recreation. Если используете конкретные сведения о городе, проверьте их по актуальному официальному источнику и укажите дату проверки.</p>
`),
              lec("2.3", "Reading Practice: A Machine Should Work", `
<h3>Цель и результаты обучения</h3>
<p>Цель занятия — понять роль автоматизации в производстве и научиться описывать взаимодействие человека, оборудования и управляющей системы. Студент освоит лексику по теме, извлечёт основную информацию из текста и объяснит преимущества и ограничения автоматизации.</p>
<h3>1. Reading: A Machine Should Work, a Person Should Think</h3>
<p><b>Read the adapted text.</b></p>
<p>Automation is the use of control systems and technology to perform tasks with limited continuous human intervention. In manufacturing, automated equipment may move materials, carry out repeated operations, collect measurements and report process information. A robot is only one possible part of an automated production system; sensors, controllers, actuators, software, machine tools and safety devices may also be involved.</p>
<p>A simple automated system can be described through several functions. A <b>programme</b> defines the intended sequence. <b>Sensors</b> collect information about the process. A <b>controller</b> compares the available information with the required conditions and sends commands. <b>Actuators</b> or other output devices carry out the commands. A feedback signal can help the controller respond when the measured condition differs from the target.</p>
<p>Automation can improve repeatability, productivity and working conditions, especially when tasks are repetitive or expose people to hazardous environments. However, automated systems still require planning, monitoring, maintenance by authorised personnel and clear procedures. People design processes, interpret information, respond to unexpected situations and make decisions that require judgement. The purpose is not simply to remove people from production, but to use technology responsibly and support human work.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>automation</td><td>автоматизация</td><td>Automation can improve repeatability.</td></tr>
<tr><td>control system</td><td>система управления</td><td>The control system receives sensor data.</td></tr>
<tr><td>sensor</td><td>датчик</td><td>A sensor measures a process variable.</td></tr>
<tr><td>controller</td><td>контроллер, устройство управления</td><td>The controller compares the value with a target.</td></tr>
<tr><td>actuator</td><td>исполнительный механизм</td><td>An actuator changes the system state.</td></tr>
<tr><td>feedback</td><td>обратная связь</td><td>Feedback provides information about the result.</td></tr>
<tr><td>repeatability</td><td>повторяемость</td><td>The process has good repeatability.</td></tr>
<tr><td>human intervention</td><td>вмешательство человека</td><td>The system requires human intervention in unusual cases.</td></tr>
<tr><td>hazardous environment</td><td>опасная среда</td><td>Robots may work in a hazardous environment.</td></tr>
</table>
<h3>3. How a basic control loop works</h3>
<ol>
<li>A sensor measures a process variable.</li>
<li>The controller receives the measured value.</li>
<li>The controller compares it with the target or setpoint.</li>
<li>The controller sends a command to an output device.</li>
<li>The system changes, and a new measurement may be taken.</li>
</ol>
<p>Это упрощённая учебная модель. Реальные системы могут иметь несколько датчиков, контроллеров, режимов и независимых защитных функций. Не используйте эту схему как инструкцию по настройке оборудования.</p>
<h3>4. Language focus: describing processes</h3>
<p>Для последовательности используйте <i>first, then, next, after that, finally</i>. Для описания функций — <i>is used to, is responsible for, receives, compares, sends</i>. Для пассивного залога: <i>The value is measured by a sensor. A command is sent to the actuator.</i></p>
<p>Сравните: <i>The sensor measures the temperature.</i> (активный залог, важен исполнитель) и <i>The temperature is measured by a sensor.</i> (пассивный залог, важен объект измерения).</p>
<h3>5. Reading comprehension</h3>
<ol>
<li>What is automation?</li><li>Name four elements that may be part of an automated system.</li><li>What does a sensor do?</li><li>What does the controller compare?</li><li>Name two possible benefits of automation.</li><li>Why do automated systems still need people?</li></ol>
<h3>6. Практика</h3>
<p><b>Задание A. Соотнесите термин и функцию:</b> sensor; controller; actuator; programme. Функции: defines a sequence; measures a condition; compares information and sends commands; carries out a command.</p>
<p><b>Задание B. Поставьте этапы в порядок:</b> controller compares the value; sensor measures the process; actuator receives a command; a new value is measured.</p>
<p><b>Задание C. Выберите правильную форму:</b> 1) The data (is/are) collected by sensors. 2) The controller (compare/compares) the value with a target. 3) A command (is sent/sends) to the output device.</p>
<p><b>Задание D. Обсуждение:</b> назовите две задачи, которые целесообразно автоматизировать, и две ситуации, где необходим контроль человека. Обоснуйте мнение словами <i>because, however, therefore</i>.</p>
<h3>7. Самопроверка и ключ преподавателя</h3>
<ol>
<li>Automation uses technology/control systems to perform tasks with limited continuous human intervention.</li><li>Possible answers: sensors, controllers, actuators, software, machine tools, safety devices.</li><li>A sensor collects/measures information about a condition.</li><li>The measured value with a target or required condition.</li><li>Repeatability, productivity, improved working conditions, reduced exposure to hazards.</li><li>People plan, monitor, interpret information and respond to unexpected situations.</li><li>Задание A: programme — defines a sequence; sensor — measures; controller — compares and sends commands; actuator — carries out a command.</li><li>Задание B: sensor measures → controller compares → actuator receives command → new value is measured.</li><li>Задание C: are; compares; is sent.</li></ol>
<p><b>Самостоятельная работа:</b> напишите 100–120 слов о простой автоматизированной системе. Назовите её назначение, два входных сигнала или измеряемых параметра, функцию контроллера и возможную роль оператора. Не описывайте настройки или запуск реального оборудования.</p>
`)
            ],
            [],
            [],
            [
              tq("Nizhnekamsk is located on the river...", ["Volga", "Kama", "Oka"]),
              tq("The architectural symbol of Nizhnekamsk is...", ["The Kremlin", "The Mosque", "The Cathedral"]),
              tq("The biggest industrial enterprises are...", ["car and tyre plants", "petrochemical and tyre plants", "food and textile plants"]),
              tq("What is exported to other countries?", ["cars", "useful goods", "oil"]),
              tq("The town has a widely developed...", ["infrastructure", "agriculture", "tourism"])
            ],
            [
              { code: "W 2.1", title: "Translate noun chains", task: "Translate the following noun chains into Russian:\n1. internal combustion engine\n2. the temperature limit determination\n3. the modern house ventilation facilities\n4. the Moscow region newspaper\n5. essential research program\n6. National Oil and Gas Research Institute\n7. wooden house advantages\n8. nineteenth century physics achievements\n9. new digital computer effectiveness\n10. modern sport car average velocity\n11. computer software possibilities" },
              { code: "W 2.2", title: "Translation Practice (Unit 2)", task: "Translate the following sentences into English:\n1. Кремль – архитектурный символ Москвы. Это очень старое красивое сооружение.\n2. Тольятти – развитый экономический центр. Самое большое промышленное предприятие здесь – это автомобильный завод.\n3. Казань – крупный центр образования. Казанскому университету уже 200 лет.\n4. В новых городах обычно очень хорошо развита инфраструктура.\n5. Лондон расположен на берегу реки Темзы.\n6. Крупнейший аэропорт Парижа – Орли – расположен в нескольких километрах от города.\n7. Рим – самый старый город в Европе." },
              { code: "W 2.3", title: "Reading: A Machine Should Work", task: "Answer the following questions based on the text 'A Machine Should Work, a Man Think':\n1. What is the difference between generations of robots?\n2. What does the flexible production complex consist of?\n3. Can you imagine the robot of the future?\n4. What fantastic stories have you read about robots?\n5. Explain the title of the text." }
            ]
          )
        ]
      },
            {
        code: "UNIT 3",
        title: "Tatarstan. Non-Finite Forms of the Verb",
        topics: [
          topic("b-unit3", "Unit 3", "Tatarstan",
            [
              lec("3.1", "Grammar: Participles, Gerunds, Infinitives", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится распознавать формы на -ing и третью форму глагола, различать Participle I, Participle II, gerund и infinitive в типичных конструкциях, а также выбирать форму после распространённых глаголов и предлогов.</p>
<h3>1. Participle I: форма на -ing</h3>
<p>Participle I образуется добавлением -ing: <i>work → working; write → writing; run → running</i>. Он может описывать действие, происходящее одновременно с другим действием, или характеризовать предмет/человека:</p>
<ul><li><i>The student reading the text is my groupmate.</i> — Студент, читающий текст, — мой одногруппник.</li><li><i>Walking to college, I listened to an English podcast.</i> — Идя в колледж, я слушал подкаст.</li></ul>
<p>Форма -ing сама по себе не означает только настоящее время. Сравните: <i>a working machine</i> (работающая машина) и <i>Working in pairs helps students practise speaking.</i> (Работа в парах помогает студентам практиковать речь.)</p>
<h3>2. Participle II: третья форма глагола</h3>
<p>Participle II — третья форма глагола: правильные глаголы обычно имеют окончание -ed (<i>check — checked</i>), неправильные нужно запоминать (<i>write — written; make — made; see — seen</i>). Эта форма часто используется в пассивном залоге и как определение:</p>
<ul><li><i>The checked documents are on the desk.</i> — Проверенные документы лежат на столе.</li><li><i>The results were obtained yesterday.</i> — Результаты были получены вчера.</li></ul>
<h3>3. Gerund: герундий</h3>
<p>Герундий имеет форму -ing и функционирует как существительное. Он может быть подлежащим, дополнением или частью конструкции после предлога:</p>
<ul><li><i>Reading improves vocabulary.</i> — Чтение расширяет словарный запас.</li><li><i>She enjoys learning languages.</i> — Ей нравится изучать языки.</li><li><i>Thank you for helping me.</i> — Спасибо за помощь.</li></ul>
<p>После предлогов обычно используется форма -ing: <i>before starting, after reading, interested in learning</i>. Не путайте герундий с Participle I: форма одинакова, но функция в предложении различается.</p>
<h3>4. Infinitive: инфинитив</h3>
<p>Инфинитив с to часто выражает цель или следует после определённых глаголов: <i>I want to improve my English. We use a dictionary to check a word.</i> После модальных глаголов can, must, should используется инфинитив без to: <i>Students can use the glossary.</i></p>
<table style="width:100%;border-collapse:collapse">
<tr><th>Часто + -ing</th><th>Часто + to-infinitive</th><th>Возможны обе формы</th></tr>
<tr><td>enjoy, avoid, finish, suggest</td><td>want, decide, hope, plan, need</td><td>like, love, start, begin</td></tr>
</table>
<p>Некоторые глаголы меняют значение: <i>remember doing</i> — помнить уже совершённое действие; <i>remember to do</i> — не забыть выполнить действие. <i>Stop doing</i> — прекратить действие; <i>stop to do</i> — остановиться, чтобы выполнить другое действие.</p>
<h3>5. Практика</h3>
<p><b>Задание A. Определите функцию формы -ing:</b> 1) Reading is useful. 2) The student reading the notice is new. 3) She enjoys reading. 4) Before leaving, close the window.</p>
<p><b>Задание B. Выберите форму:</b> 1) We decided (to start/starting) early. 2) He avoids (to make/making) the same mistake. 3) Thank you for (to explain/explaining) the rule. 4) They can (to use/use) the dictionary.</p>
<p><b>Задание C. Вставьте Participle II:</b> 1) The documents (check) yesterday are ready. 2) The information (write) on the board is important. 3) The results were (send) by email.</p>
<p><b>Задание D. Составьте четыре предложения: одно с gerund в роли подлежащего, одно после предлога, одно с to-infinitive цели и одно с Participle II.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>1) gerund/подлежащее; 2) Participle I/определение; 3) gerund/дополнение после enjoy; 4) gerund после предлога before.</li><li>to start; making; explaining; use.</li><li>checked; written; sent.</li></ol>
<p><b>Самостоятельная работа:</b> найдите в коротком английском тексте по два примера -ing и Participle II. Для каждого укажите его функцию и переведите всё предложение, а не только отдельную форму.</p>
`),
              lec("3.2", "Reading: Tatarstan", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится извлекать географическую, культурную и экономическую информацию из обзорного текста о регионе, описывать местоположение и отрасли экономики, использовать Present Simple и сравнительные конструкции. Текст не предназначен для заучивания изменяющихся статистических показателей.</p>
<h3>1. Reading: Tatarstan — a Region of Russia</h3>
<p><b>Read the adapted text.</b></p>
<p>The Republic of Tatarstan is a federal subject of the Russian Federation in the Volga region. Its capital is Kazan. The republic has a varied landscape with rivers, forests, agricultural areas and cities. Russian and Tatar are widely used in public life, and both have official status in the republic.</p>
<p>Tatarstan has a diversified economy. Important sectors include oil production and refining, petrochemicals, mechanical engineering, vehicle manufacturing, agriculture, information technology and services. Industrial and educational centres are connected by road and rail networks. Kazan is known for its universities, cultural institutions and historical architecture, while other cities have their own industrial and educational profiles.</p>
<p>Regional facts can change. When preparing a current report, check population figures, economic rankings and other statistics in recent official sources. In this lesson, focus on the language used to describe a region and compare its features.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>federal subject</td><td>субъект федерации</td><td>Tatarstan is a federal subject of Russia.</td></tr>
<tr><td>capital</td><td>столица</td><td>Kazan is the capital of the republic.</td></tr>
<tr><td>landscape</td><td>ландшафт</td><td>The region has a varied landscape.</td></tr>
<tr><td>natural resources</td><td>природные ресурсы</td><td>Natural resources influence some industries.</td></tr>
<tr><td>petrochemicals</td><td>нефтехимия</td><td>Petrochemicals are an important sector.</td></tr>
<tr><td>mechanical engineering</td><td>машиностроение</td><td>Mechanical engineering requires technical skills.</td></tr>
<tr><td>agriculture</td><td>сельское хозяйство</td><td>Agriculture is important in many regions.</td></tr>
<tr><td>infrastructure</td><td>инфраструктура</td><td>Transport is part of regional infrastructure.</td></tr>
</table>
<h3>3. Language focus: location and comparison</h3>
<p>Местоположение: <i>in the Volga region; near a river; to the east of; in the north-west of</i>. Для описания наличия объектов используйте <i>there is/there are</i>. Для сравнения: короткие прилагательные + -er (<i>larger, smaller</i>), длинные прилагательные с <i>more/less</i> (<i>more developed, less crowded</i>). После сравнительной формы часто используется <i>than</i>.</p>
<p>Для осторожных утверждений используйте <i>one of the important sectors, is known for, includes, may be associated with</i>. Не используйте абсолютные формулировки вроде “the best” без критерия и подтверждающих данных.</p>
<h3>4. Reading comprehension</h3>
<ol><li>Where is Tatarstan situated?</li><li>What is its capital?</li><li>Name three sectors of its economy.</li><li>Which languages have official status in the republic?</li><li>Why should current statistics be checked in recent sources?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Заполните пропуски:</b> 1) Kazan is the ___ of Tatarstan. 2) Oil refining and petrochemicals are important ___ . 3) Roads and railways are part of the transport ___ .</p>
<p><b>Задание B. Выберите форму:</b> 1) Kazan is (larger/more large) than a small town. 2) This region is (more diverse/diverser) in its economic activities. 3) The republic has (many/much) industrial centres.</p>
<p><b>Задание C. Сделайте краткое сравнение двух регионов или городов по трём критериям: location, industry, education. Используйте at least two comparative forms.</p>
<p><b>Задание D. Speaking:</b> представьте регион за 60 секунд. Назовите расположение, два экономических сектора и один культурный или образовательный объект.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>In the Volga region of Russia.</li><li>Kazan.</li><li>Any three: oil production/refining, petrochemicals, mechanical engineering, vehicle manufacturing, agriculture, IT, services.</li><li>Russian and Tatar.</li><li>Because figures and rankings change over time.</li><li>capital; sectors; infrastructure.</li><li>larger; more diverse; many.</li></ol>
<p><b>Самостоятельная работа:</b> подготовьте текст 100–120 слов о выбранном регионе. Используйте три проверенных факта, два сравнительных предложения и пять слов из словаря. Укажите источник и дату проверки фактов.</p>
`),
              lec("3.3", "Reading Practice: Dealing with People", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать текст о профессиональном взаимодействии, выделять главную мысль и аргументы, использовать лексику для общения в команде, вежливо выражать несогласие и уточнять задачу. Утверждения о «процентах успеха» без надёжного источника не используются как научный факт.</p>
<h3>1. Reading: Working with People</h3>
<p><b>Read the adapted text.</b></p>
<p>Technical knowledge is important in engineering, but successful work also depends on communication. Engineers often work in teams that include designers, technicians, operators, programmers, managers and quality specialists. Team members need to explain ideas clearly, listen to other viewpoints and share information accurately.</p>
<p>Good communication does not mean that everyone always agrees. A team may discuss several solutions, compare evidence and identify risks before making a decision. When an instruction is unclear, a professional asks for clarification rather than guessing. When a colleague makes a mistake, it is more useful to describe the problem respectfully and focus on the next step than to blame the person.</p>
<p>People also have different communication styles. Some prefer a short written summary; others need a diagram or a spoken explanation. A clear message identifies the topic, gives the necessary details and states what action or response is required. These skills help a team coordinate work and prevent misunderstandings.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>team member</td><td>участник команды</td><td>Each team member has a role.</td></tr>
<tr><td>viewpoint</td><td>точка зрения</td><td>Listen to another viewpoint.</td></tr>
<tr><td>evidence</td><td>фактические данные, доказательства</td><td>Compare the options using evidence.</td></tr>
<tr><td>clarification</td><td>уточнение</td><td>Ask for clarification if a step is unclear.</td></tr>
<tr><td>misunderstanding</td><td>недопонимание</td><td>A clear message can prevent misunderstanding.</td></tr>
<tr><td>respectfully</td><td>уважительно</td><td>Disagree respectfully.</td></tr>
<tr><td>to coordinate</td><td>координировать</td><td>Team members coordinate their tasks.</td></tr>
</table>
<h3>3. Functional English: professional communication</h3>
<p>Чтобы уточнить: <i>Could you clarify the last point, please? What do you mean by…? Could you show me an example?</i></p>
<p>Чтобы выразить мнение: <i>In my view…; I think this option may be more suitable because…</i></p>
<p>Чтобы вежливо не согласиться: <i>I see your point, but the data suggest…; Could we consider another option?</i></p>
<p>Чтобы подтвердить задачу: <i>Let me check that I understood correctly. You would like me to…</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>Why is communication important in engineering teams?</li><li>Name three types of specialists who may work together.</li><li>What should a person do if an instruction is unclear?</li><li>How can a team compare different solutions?</li><li>What should a clear message include?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите ситуацию и фразу:</b> попросить пример; уточнить задание; вежливо не согласиться; подтвердить понимание. Используйте четыре фразы из раздела 3.</p>
<p><b>Задание B. Выберите наиболее профессиональный ответ:</b> 1) “That is a stupid idea.” 2) “I see your point, but could we compare the evidence first?” 3) “I will ignore your suggestion.”</p>
<p><b>Задание C. Ролевая ситуация:</b> один студент предлагает решение учебной задачи, второй задаёт уточняющий вопрос, третий кратко подводит итог и фиксирует следующий шаг. Каждый должен использовать одну фразу для согласия или несогласия.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Because teams need to explain ideas, listen, share information and coordinate tasks.</li><li>Any three: designers, technicians, operators, programmers, managers, quality specialists.</li><li>Ask for clarification rather than guess.</li><li>Compare evidence and risks.</li><li>The topic, necessary details and required action/response.</li><li>Задание B: вариант 2.</li></ol>
<p><b>Самостоятельная работа:</b> напишите диалог из 10–12 реплик о распределении задач в проектной группе. Включите просьбу об уточнении, аргументированное мнение, вежливое несогласие и итоговое подтверждение договорённости.</p>
`)
            ],
            [],
            [],
            [
              tq("Tatarstan is situated in the middle part of...", ["the Volga basin", "the Dnieper basin", "the Ural mountains"]),
              tq("The population is about...", ["1 million", "4 million", "10 million"]),
              tq("The state languages are...", ["Russian and English", "Tatar and Russian", "Tatar and English"]),
              tq("The main branches of industry are...", ["oil extracting and chemical production", "agriculture", "tourism"]),
              tq("The capital of the republic is...", ["Nizhnekamsk", "Kazan", "Yelabuga"])
            ],
            [
              { code: "W 3.1", title: "Translation Practice (Unit 3)", task: "Translate the following sentences into English:\n1. Флаг Франции состоит из трех вертикальных полос: белой, красной и голубой.\n2. Столица Италии – Рим, исторический и культурный центр Европы.\n3. Государственные языки Канады – английский и французский.\n4. Швейцария расположена в центре Европы.\n5. Климат Гренландии очень суровый: лето прохладное, зима очень холодная.\n6. Антарктида богата природными ресурсами.\n7. Основная отрасль промышленности Японии – высокотехнологичное машиностроение.\n8. Основная продукция сельского хозяйства Индии – чай и рис.\n9. Нефтедобыча – основа промышленности стран Ближнего Востока.\n10. Самые крупные промышленные центры Великобритании – Ливерпуль и Манчестер." },
              { code: "W 3.2", title: "Essay: Dealing with People", task: "Write down a short essay (10-12 sentences) on the topic 'Dealing with People'. Why is it important for an engineer to have communication skills?" }
            ]
          )
        ]
      },
            {
        code: "UNIT 4",
        title: "Environmental Protection",
        topics: [
          topic("b-unit4", "Unit 4", "Ecology",
            [
              lec("4.1", "Grammar: Conditionals & Reported Speech", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится различать основные типы условных предложений и передавать высказывания, вопросы и инструкции в косвенной речи. Особое внимание уделяется смыслу конструкции и выбору времени, а не механическому сдвигу форм.</p>
<h3>1. Conditionals — условные предложения</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>Тип</th><th>Форма</th><th>Значение</th><th>Пример</th></tr>
<tr><td>Zero</td><td>If + Present, Present</td><td>общий факт, закономерность</td><td>If water reaches 100°C at standard pressure, it boils.</td></tr>
<tr><td>First</td><td>If + Present, will + V1</td><td>реальное возможное будущее</td><td>If the team checks the file, it will find the latest version.</td></tr>
<tr><td>Second</td><td>If + Past, would + V1</td><td>воображаемая или маловероятная ситуация</td><td>If I had more time, I would revise the report.</td></tr>
<tr><td>Third</td><td>If + Past Perfect, would have + V3</td><td>нереальное прошлое, сожаление/альтернативный результат</td><td>If they had checked the units, they would have avoided the error.</td></tr>
</table>
<p>В First Conditional обычно не ставят will сразу после if: <i>If it rains, we will stay inside.</i> Во Second Conditional форма <i>were</i> возможна со всеми лицами в более формальном стиле: <i>If I were the team leader…</i> В Third Conditional обе части относятся к воображаемому прошлому.</p>
<h3>2. Reported Speech — косвенная речь</h3>
<p>Косвенная речь передаёт содержание слов другого человека. Если вводный глагол стоит в прошедшем времени, форма часто сдвигается назад, если точка отсчёта изменилась:</p>
<table style="width:100%;border-collapse:collapse">
<tr><th>Прямая речь</th><th>Косвенная речь</th></tr>
<tr><td>“I am ready.”</td><td>She said (that) she was ready.</td></tr>
<tr><td>“We checked the file.”</td><td>They said they had checked the file.</td></tr>
<tr><td>“I will call you.”</td><td>He said he would call me.</td></tr>
<tr><td>“I can help.”</td><td>She said she could help.</td></tr>
</table>
<p>Сдвиг времени не обязателен, если факт остаётся верным или говорящий сохраняет исходную точку отсчёта: <i>The teacher said that water boils at 100°C at standard pressure.</i></p>
<h3>3. Косвенные вопросы и инструкции</h3>
<p>В косвенном вопросе используется прямой порядок слов: <i>“Where is the lab?” → He asked where the lab was.</i> Общий вопрос вводится if/whether: <i>“Are you ready?” → She asked if we were ready.</i> Не используйте do/does/did в косвенном вопросе.</p>
<p>Просьбы и инструкции часто передаются конструкцией <i>ask/tell + object + (not) to + verb</i>: <i>“Please check the date.” → The teacher asked us to check the date.</i> / <i>“Do not open the file.” → He told us not to open the file.</i></p>
<h3>4. Практика</h3>
<p><b>Задание A. Выберите тип:</b> 1) If metal gets hot, it expands. 2) If I finish early, I will call you. 3) If I knew the answer, I would tell you. 4) If they had saved the file, they would not have lost it.</p>
<p><b>Задание B. Поставьте глагол в нужную форму:</b> 1) If the bus (be) late, we (wait) inside. 2) If I (have) a new laptop, I (install) the programme. 3) If the team (check) the drawing, it (notice) the error.</p>
<p><b>Задание C. Передайте косвенно:</b> 1) “The results are ready,” she said. 2) “Where is the timetable?” he asked. 3) “Do not touch the equipment,” the instructor said.</p>
<h3>5. Самопроверка и ключ преподавателя</h3>
<ol><li>Zero; First; Second; Third.</li><li>is / will wait; had / would install; had checked / would have noticed.</li><li>She said that the results were ready. He asked where the timetable was. The instructor told us not to touch the equipment.</li></ol>
<p><b>Самостоятельная работа:</b> придумайте по одному примеру каждого типа условного предложения на тему учёбы и безопасности; затем запишите короткий диалог из четырёх реплик и передайте две реплики в косвенной речи.</p>
`),
              lec("4.2", "Reading: Environmental Protection", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать текст о воздействии человека на окружающую среду, различать причины и последствия, использовать лексику по теме экологии и формулировать предложения по снижению воздействия на окружающую среду.</p>
<h3>1. Reading: Environmental Challenges</h3>
<p>Human activities affect air, water, soil and ecosystems. Transport, energy production, agriculture, construction and industry can create emissions, waste and pressure on natural resources. The scale and type of impact depend on technology, local conditions, regulation and everyday choices.</p>
<p>Air pollution may be caused by particles and gases released by vehicles, heating systems and industrial processes. Water quality can be affected by untreated wastewater, agricultural runoff and accidental releases. Waste creates additional problems when materials are not reused, recycled or safely managed. Some pollutants remain in the environment for a long time and can move through food chains.</p>
<p>Environmental protection includes prevention, monitoring, efficient use of resources, treatment of emissions and waste, restoration of damaged areas and public information. No single measure solves every problem. Decisions should be based on reliable measurements and an understanding of possible consequences. Individuals, businesses and public authorities all have roles to play.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>emission</td><td>выброс</td><td>Vehicle emissions can affect air quality.</td></tr>
<tr><td>particle</td><td>частица</td><td>Fine particles can remain in the air.</td></tr>
<tr><td>wastewater</td><td>сточные воды</td><td>Wastewater must be treated appropriately.</td></tr>
<tr><td>runoff</td><td>поверхностный сток</td><td>Agricultural runoff may carry nutrients into rivers.</td></tr>
<tr><td>ecosystem</td><td>экосистема</td><td>An ecosystem includes living organisms and their environment.</td></tr>
<tr><td>renewable resource</td><td>возобновляемый ресурс</td><td>Some energy sources are renewable.</td></tr>
<tr><td>to reduce / prevent</td><td>сокращать / предотвращать</td><td>Better planning can reduce waste.</td></tr>
<tr><td>monitoring</td><td>мониторинг, наблюдение</td><td>Monitoring helps identify changes.</td></tr>
</table>
<h3>3. Language focus: cause, effect and solutions</h3>
<p>Причина: <i>because, due to, as a result of</i>. Следствие: <i>therefore, as a result, this can lead to</i>. Предложение: <i>One possible measure is…; The impact could be reduced by…</i></p>
<p>Пассивный залог часто используется в научных и общественных текстах: <i>Wastewater is treated before discharge. Air quality is monitored by local authorities.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>Name four areas of the environment mentioned in the text.</li><li>Give two possible sources of air pollution.</li><li>How can water quality be affected?</li><li>Why can waste be a long-term problem?</li><li>Why should decisions be based on reliable measurements?</li><li>Name three groups that have a role in environmental protection.</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите причину и возможное следствие:</b> untreated wastewater; excessive material use; vehicle emissions; poor waste sorting. Используйте понятия water quality, resource use, air quality, recycling.</p>
<p><b>Задание B. Дополните связками:</b> 1) The factory installed filters. ___, some emissions were reduced. 2) The river was polluted ___ untreated wastewater. 3) Waste should be sorted; ___, useful materials can be recovered.</p>
<p><b>Задание C. Предложите три меры для колледжа: saving energy, reducing paper use, sorting waste, responsible transport. Для каждой объясните ожидаемый эффект.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Air, water, soil and ecosystems.</li><li>Vehicles, heating systems or industrial processes.</li><li>Untreated wastewater, agricultural runoff or accidental releases.</li><li>Some materials/pollutants remain for a long time and may affect ecosystems.</li><li>To understand the real scale and possible consequences of the impact.</li><li>Individuals, businesses and public authorities.</li><li>Задание B: As a result; due to; therefore/as a result.</li></ol>
<p><b>Самостоятельная работа:</b> напишите 100–120 слов о конкретной экологической проблеме. Структура: проблема → причины → последствия → две реалистичные меры. Не приводите статистику без проверенного источника.</p>
`),
              lec("4.3", "Reading Practice: The Speed Limit", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать научно-популярный текст о предельной скорости передачи информации, извлекать основные положения, объяснять причинно-следственные связи и использовать лексику для описания скорости, расстояния и времени.</p>
<h3>1. Reading: The Speed of Light as a Limit</h3>
<p>In everyday life, speeds can be compared with the speed of a car, a train or an aircraft. In modern physics, the speed of light in a vacuum is approximately 300,000 kilometres per second. According to the theory of special relativity, this speed is a fundamental limit for the transfer of information and causal influence. An object with mass cannot be accelerated to the speed of light in a vacuum.</p>
<p>This does not mean that every object moves at the same speed. Light travels at the same speed in a vacuum for all inertial observers, while measured distances and time intervals depend on the observer's motion. These ideas are described by special relativity. The theory is supported by many experiments and is used in modern physics and technologies such as satellite navigation, where very accurate timing is essential.</p>
<p>The Sun is about 150 million kilometres from the Earth. Sunlight takes a little over eight minutes to reach us. If the Sun changed in a way that affected the light reaching Earth, we would not observe that change immediately; the information would travel at the speed of light. This example helps explain why physical effects cannot be treated as instantaneous over large distances.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>speed</td><td>скорость</td><td>The speed of light in a vacuum is very high.</td></tr>
<tr><td>distance</td><td>расстояние</td><td>The distance is measured in kilometres.</td></tr>
<tr><td>vacuum</td><td>вакуум</td><td>Light travels through a vacuum.</td></tr>
<tr><td>to transfer information</td><td>передавать информацию</td><td>A signal transfers information.</td></tr>
<tr><td>causal influence</td><td>причинное воздействие</td><td>Relativity limits the speed of causal influence.</td></tr>
<tr><td>observer</td><td>наблюдатель</td><td>Different observers may measure different time intervals.</td></tr>
<tr><td>approximately</td><td>приблизительно</td><td>The distance is approximately 150 million kilometres.</td></tr>
<tr><td>instantaneous</td><td>мгновенный</td><td>Information is not transferred instantaneously.</td></tr>
</table>
<h3>3. Language focus: quantities and cautious statements</h3>
<p>Для приблизительных величин используйте <i>about, approximately, roughly, a little over</i>. Для сравнения: <i>faster than, slower than, as fast as</i>. Для осторожных научных утверждений: <i>according to, the theory predicts, experiments support, approximately</i>.</p>
<p>Не путайте скорость и ускорение: <i>speed</i> — быстрота движения; <i>acceleration</i> — изменение скорости по величине или направлению. Скорость обычно выражается в m/s или km/h.</p>
<h3>4. Reading comprehension</h3>
<ol><li>What is the approximate speed of light in a vacuum?</li><li>What does special relativity identify as a fundamental limit?</li><li>Can an object with mass reach the speed of light in a vacuum?</li><li>How long does sunlight take to reach Earth?</li><li>Why is satellite navigation mentioned?</li><li>What does the word “approximately” tell the reader?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Выберите правильное слово:</b> 1) speed / distance is measured in kilometres per second. 2) Acceleration / observer describes a change in velocity. 3) Light travels in a vacuum / timetable.</p>
<p><b>Задание B. Передайте смысл с помощью приблизительных выражений:</b> “The distance is 150 million kilometres.” Используйте about или approximately.</p>
<p><b>Задание C. Обсудите:</b> почему сообщение с большого расстояния нельзя получить мгновенно? Используйте слова signal, distance, speed, information.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Approximately 300,000 kilometres per second.</li><li>The speed of light in a vacuum for information transfer and causal influence.</li><li>No.</li><li>A little over eight minutes.</li><li>Because accurate timing is important in satellite navigation.</li><li>It indicates that the value is not exact.</li><li>Задание A: speed; acceleration; vacuum.</li></ol>
<p><b>Самостоятельная работа:</b> подготовьте краткое объяснение на 80–100 слов о разнице между speed и acceleration. Включите два примера с единицами измерения и используйте приблизительные выражения.</p>
`)
            ],
            [],
            [],
            [
              tq("The main reason for ecological problems is...", ["intensive development of industry", "natural disasters", "animal migration"]),
              tq("People living in big cities suffer from...", ["smog", "clean air", "noise"]),
              tq("What throws out harmful substances into the atmosphere?", ["Trees", "Factories and power stations", "Rivers"]),
              tq("The destruction of the ozone layer could lead to...", ["global catastrophe", "economic growth", "new discoveries"]),
              tq("The Earth is our home, that's why we must...", ["conquer it", "take care of it", "ignore it"])
            ],
            [
              { code: "W 4.1", title: "Translation Practice (Unit 4)", task: "Translate the following sentences into English using Conditionals:\n1. Если бы у меня было больше времени, я бы прочитал эту книгу.\n2. Если вы нагреете металл, он расширится.\n3. Если бы они проверили чертеж, они бы избежали ошибки.\n4. Если мы понизим температуру, жидкость может превратиться в лед.\n5. Если бы я выиграл соревнования, меня отправили бы за границу. (Had I won...)\n6. Если увидишь родителей, тебе следует спросить у них совета." },
              { code: "W 4.2", title: "Reading: Answer the questions", task: "Answer the following questions based on the text 'The Speed Limit':\n1. Guess the meaning of the following words: radio waves, signal transmission, speed limit, to concur with, uniform, natural phenomenon.\n2. Finish the sentences: 1. Before the World War II... 2. Today we have... 3. According to the principles of the relativity... 4. It plays the important part...\n3. Write out of the text the key words and word combinations." },
              { code: "W 4.3", title: "Essay: Ecology", task: "Write a short essay (10-12 sentences) about the ecological problems in your city or region. What can people do to protect the environment? Use the vocabulary from the text." }
            ]
          )
        ]
      },
            {
        code: "UNIT 6",
        title: "Additional Materials for Reading",
        topics: [
          topic("b-unit6", "Unit 6", "Additional Reading",
            [
              lec("6.1", "The History of Physics", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать обзорный текст об истории физики, выстраивать последовательность научных идей и использовать лексику для описания исследований, открытий и доказательств. Материал даёт языковую основу и не заменяет отдельный курс истории науки.</p>
<h3>1. Reading: From Classical Mechanics to Modern Physics</h3>
<p>People have studied nature since ancient times. A major change in the development of physics took place in the early modern period, when researchers increasingly used experiments and mathematical descriptions to explain motion and natural phenomena. Galileo Galilei made important contributions to the study of motion and helped develop methods based on observation and experiment.</p>
<p>Isaac Newton formulated laws of motion and the law of universal gravitation. Together with the development of calculus by Newton and Leibniz, these ideas provided powerful tools for describing the motion of objects, from falling bodies to planets. Classical mechanics remains useful for many everyday and engineering problems.</p>
<p>At the beginning of the twentieth century, new experiments and questions led to major developments. In 1900, Max Planck introduced the quantum hypothesis in his work on thermal radiation. In 1905, Albert Einstein published his special theory of relativity, which describes space, time and motion at high speeds. His general theory of relativity, published in its final form in 1915, describes gravity in terms of the geometry of spacetime. These theories do not make classical physics useless; they extend our understanding to situations where classical models are insufficient.</p>
<p>Modern science is interdisciplinary. Physics contributes to materials science, chemistry, electronics, medicine, computing and engineering. Researchers combine theoretical models, experiments, measurement and data analysis. A scientific explanation must be open to testing and revision when new evidence becomes available.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>research</td><td>исследование</td><td>Research requires reliable evidence.</td></tr>
<tr><td>observation</td><td>наблюдение</td><td>The observation led to a new question.</td></tr>
<tr><td>experiment</td><td>эксперимент</td><td>The experiment tested the hypothesis.</td></tr>
<tr><td>motion</td><td>движение</td><td>Classical mechanics describes motion.</td></tr>
<tr><td>gravitation</td><td>тяготение</td><td>Newton studied universal gravitation.</td></tr>
<tr><td>quantum</td><td>квантовый</td><td>Quantum theory describes microscopic systems.</td></tr>
<tr><td>spacetime</td><td>пространство-время</td><td>General relativity describes gravity through spacetime geometry.</td></tr>
<tr><td>evidence</td><td>доказательства, данные</td><td>New evidence may change a model.</td></tr>
<tr><td>interdisciplinary</td><td>междисциплинарный</td><td>Modern research is often interdisciplinary.</td></tr>
</table>
<h3>3. Language focus: describing historical development</h3>
<p>Для хронологии используйте <i>first, later, in the early twentieth century, afterwards, eventually</i>. Для вклада учёного: <i>contributed to, developed, proposed, formulated, published</i>. Past Simple описывает завершённые исторические события: <i>Newton formulated the laws of motion.</i> Present Simple используется для общепринятых фактов: <i>Classical mechanics remains useful.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>Which methods became increasingly important in the development of modern physics?</li><li>What did Newton formulate?</li><li>What did Planck introduce in 1900?</li><li>What does special relativity describe?</li><li>How does general relativity describe gravity?</li><li>Why does new evidence matter?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A.</b> Соотнесите: Galileo; Newton; Planck; Einstein. Варианты: laws of motion and gravitation; important studies of motion and experimental method; quantum hypothesis; special and general relativity.</p>
<p><b>Задание B.</b> Поставьте глаголы в Past Simple: 1) Newton (formulate) the laws of motion. 2) Planck (introduce) the quantum hypothesis. 3) Einstein (publish) his special theory in 1905.</p>
<p><b>Задание C.</b> Составьте временную шкалу из четырёх этапов, используя first, later, in 1900, in 1905.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Observation, experiment and mathematical description.</li><li>Laws of motion and universal gravitation.</li><li>The quantum hypothesis.</li><li>Space, time and motion at high speeds.</li><li>Through the geometry of spacetime.</li><li>Scientific explanations must be tested and revised when necessary.</li><li>Соответствие: Galileo — study of motion/experimental method; Newton — laws; Planck — quantum hypothesis; Einstein — relativity.</li><li>formulated; introduced; published.</li></ol>
<p><b>Самостоятельная работа:</b> напишите 100–120 слов о развитии одной научной идеи. Используйте минимум пять слов из словаря и отделяйте проверенные факты от собственных оценок.</p>
`),
              lec("6.2", "The Revolution in Physics", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится извлекать факты из текста об открытии рентгеновского излучения и последующих изменениях в физике, описывать научное открытие и объяснять связь между наблюдением, экспериментом и практическим применением.</p>
<h3>1. Reading: An Unexpected Discovery</h3>
<p>In 1895, the German physicist Wilhelm Conrad Röntgen was studying electrical discharge in a vacuum tube. He noticed that a fluorescent screen nearby began to glow even though it was not directly exposed to visible light from the tube. Further experiments showed that an unknown type of radiation could pass through some materials and produce images on photographic plates. Röntgen called it X-radiation because its nature was not yet known.</p>
<p>X-rays soon became important in medicine because they made it possible to examine the inside of the human body without surgery. They also became a subject of scientific research. The discovery encouraged further investigations into atomic structure and radiation. In 1896, Henri Becquerel discovered natural radioactivity, and Marie and Pierre Curie later made major contributions to the study of radioactive substances.</p>
<p>The development of physics in the twentieth century involved both experimental discoveries and new theories. Scientists studied atoms, nuclei, elementary particles and the structure of matter. New instruments and international research teams made it possible to investigate phenomena that earlier generations could not observe directly. Scientific progress often develops through a combination of unexpected observations, careful experiments, discussion and improved models.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>vacuum tube</td><td>вакуумная трубка</td><td>Röntgen studied a vacuum tube.</td></tr>
<tr><td>fluorescent screen</td><td>флуоресцентный экран</td><td>The screen began to glow.</td></tr>
<tr><td>radiation</td><td>излучение</td><td>X-radiation can pass through some materials.</td></tr>
<tr><td>photographic plate</td><td>фотопластинка</td><td>The image was recorded on a photographic plate.</td></tr>
<tr><td>radioactivity</td><td>радиоактивность</td><td>Becquerel discovered natural radioactivity.</td></tr>
<tr><td>evidence</td><td>свидетельство, данные</td><td>Further experiments provided evidence.</td></tr>
<tr><td>to investigate</td><td>исследовать</td><td>Scientists investigated the new radiation.</td></tr>
<tr><td>application</td><td>применение</td><td>X-rays have medical applications.</td></tr>
</table>
<h3>3. Language focus: describing discoveries</h3>
<p>Для описания открытия используйте Past Simple: <i>noticed, observed, tested, discovered, named, developed</i>. Для результата эксперимента: <i>The screen began to glow. The image was recorded on a plate.</i> Пассивный залог удобен, когда важен результат, а не исполнитель: <i>The radiation was detected.</i></p>
<h3>4. Reading comprehension</h3>
<ol><li>What was Röntgen studying in 1895?</li><li>What did he notice near the tube?</li><li>Why did he use the name X-radiation?</li><li>Why were X-rays important in medicine?</li><li>Who discovered natural radioactivity in 1896?</li><li>What factors contribute to scientific progress?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Выберите правильный глагол:</b> Röntgen (noticed / notices) a glowing screen in 1895. The new radiation (was called / called) X-radiation. Further experiments (provided / provide) evidence.</p>
<p><b>Задание B. Расположите этапы:</b> unexpected observation; further experiment; explanation or name; practical application.</p>
<p><b>Задание C. Обсуждение:</b> почему неожиданное наблюдение ещё не является готовым научным объяснением? Используйте evidence, experiment, result, theory.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>An electrical discharge in a vacuum tube.</li><li>A fluorescent screen nearby began to glow.</li><li>Because its nature was unknown at the time.</li><li>They made it possible to examine the inside of the body without surgery.</li><li>Henri Becquerel.</li><li>Observation, experiments, discussion, instruments and improved models.</li><li>noticed; was called; provided.</li><li>Observation → further experiment → explanation/name → application (the real history may be iterative).</li></ol>
<p><b>Самостоятельная работа:</b> подготовьте короткую презентацию на 1–2 минуты об одном научном открытии. Укажите исходную проблему, наблюдение, проверку и практическое применение.</p>
`),
              lec("6.3", "Automation", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится описывать простую автоматизированную систему, различать датчик, контроллер и исполнительное устройство, объяснять роль обратной связи и использовать пассивный залог и лексику последовательности.</p>
<h3>1. Reading: Elements of an Automated System</h3>
<p>Automation combines machines, control equipment and software to perform tasks with limited continuous human intervention. In manufacturing, automation can support material handling, measurement, assembly, packaging and process monitoring. The design of a system depends on the task, required accuracy, safety requirements and operating environment.</p>
<p>A simplified automated system has several functional elements. The programme or control logic defines the intended sequence. Sensors measure process variables such as position, temperature or pressure. A controller receives information and compares it with a target or a set of conditions. Output devices and actuators carry out commands, for example by moving a mechanism or changing a valve position. Feedback provides information about the result and may help the controller adjust the process.</p>
<p>Automation can improve consistency and reduce exposure to repetitive or hazardous tasks. However, it does not remove the need for people. Engineers and technicians plan, test and maintain systems; operators monitor the process and follow approved procedures; specialists investigate unusual results. Automated equipment must be used only by trained and authorised personnel.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>control logic</td><td>логика управления</td><td>Control logic defines the sequence.</td></tr>
<tr><td>process variable</td><td>технологический параметр</td><td>Temperature is a process variable.</td></tr>
<tr><td>setpoint</td><td>заданное значение</td><td>The controller compares the value with the setpoint.</td></tr>
<tr><td>actuator</td><td>исполнительный механизм</td><td>An actuator carries out a command.</td></tr>
<tr><td>feedback</td><td>обратная связь</td><td>Feedback reports the result.</td></tr>
<tr><td>consistency</td><td>стабильность, согласованность результата</td><td>Automation can improve consistency.</td></tr>
<tr><td>authorised personnel</td><td>уполномоченный персонал</td><td>Only authorised personnel operate the equipment.</td></tr>
</table>
<h3>3. Language focus: passive voice and sequence</h3>
<p>Для описания процесса используйте <i>first, then, after that, finally</i>. Пассивный залог помогает сосредоточиться на операции: <i>The value is measured by a sensor. The signal is sent to the controller. The command is carried out by an actuator.</i></p>
<p>Сравните <i>The sensor measures the temperature</i> и <i>The temperature is measured by the sensor</i>. В первом случае важен датчик, во втором — измеряемая величина.</p>
<h3>4. Reading comprehension</h3>
<ol><li>What does automation combine?</li><li>Name three process variables.</li><li>What does the controller compare?</li><li>What is the function of an actuator?</li><li>How can feedback be used?</li><li>Why do automated systems still require trained people?</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите:</b> sensor — measures a variable; controller — compares data and issues commands; actuator — carries out a command; programme — defines the sequence.</p>
<p><b>Задание B. Поставьте в порядок:</b> sensor measures a variable; controller compares it with a setpoint; command is sent; actuator carries out the command; feedback is received.</p>
<p><b>Задание C. Преобразуйте в пассивный залог:</b> 1) A sensor measures the temperature. 2) The controller sends a signal. 3) An actuator carries out the command.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>Machines, control equipment and software.</li><li>Position, temperature, pressure (other valid examples accepted).</li><li>The measured information with a target or required condition.</li><li>It carries out a command or produces a physical action.</li><li>It provides information about the result and may support adjustment.</li><li>People plan, monitor, test, maintain and respond to unusual conditions.</li><li>Порядок: sensor → controller → command → actuator → feedback.</li><li>The temperature is measured by a sensor. A signal is sent by the controller. The command is carried out by an actuator.</li></ol>
<p><b>Самостоятельная работа:</b> нарисуйте блок-схему простой учебной системы и подпишите на английском programme, sensor, controller, actuator, feedback. Напишите 6–8 предложений, описывающих её работу. Не добавляйте параметры настройки реального оборудования.</p>
`),
              lec("6.4", "Environmental Pollution", `
<h3>Цель и результаты обучения</h3>
<p>Студент научится понимать основные термины, связанные с биосферой, загрязнением и природными циклами, извлекать главную информацию из научно-популярного текста и описывать экологическую проблему с помощью причинно-следственных связей.</p>
<h3>1. Reading: The Biosphere and Human Impact</h3>
<p>The biosphere is the part of the Earth where life exists. It includes living organisms and the environments in which they interact: the lower atmosphere, water and parts of the land. Life depends on the movement of matter and the flow of energy. Water, carbon, nitrogen and other elements move through natural cycles between organisms, soil, water and the atmosphere.</p>
<p>Human activities can change these cycles. Burning fossil fuels adds carbon dioxide and other substances to the atmosphere. Agriculture can affect soil and water through fertilisers, pesticides and land-use changes. Industrial processes and transport may release pollutants if emissions are not properly controlled. Excessive waste and habitat destruction can also put pressure on ecosystems.</p>
<p>Environmental systems are complex. The effect of a pollutant depends on its chemical properties, amount, location, exposure and the sensitivity of organisms. Scientists use measurements and long-term monitoring to understand changes. Environmental protection may include reducing emissions, treating wastewater, using resources efficiently, restoring habitats and improving waste management.</p>
<h3>2. Vocabulary</h3>
<table style="width:100%;border-collapse:collapse">
<tr><th>English</th><th>Перевод</th><th>Example</th></tr>
<tr><td>biosphere</td><td>биосфера</td><td>The biosphere includes all regions where life exists.</td></tr>
<tr><td>natural cycle</td><td>природный цикл</td><td>Carbon moves through a natural cycle.</td></tr>
<tr><td>fossil fuel</td><td>ископаемое топливо</td><td>Oil and coal are fossil fuels.</td></tr>
<tr><td>greenhouse gas</td><td>парниковый газ</td><td>Carbon dioxide is a greenhouse gas.</td></tr>
<tr><td>habitat</td><td>среда обитания</td><td>Pollution can damage a habitat.</td></tr>
<tr><td>exposure</td><td>воздействие, контакт</td><td>Exposure depends on dose and duration.</td></tr>
<tr><td>monitoring</td><td>мониторинг</td><td>Long-term monitoring shows changes.</td></tr>
<tr><td>wastewater treatment</td><td>очистка сточных вод</td><td>Wastewater treatment helps protect rivers.</td></tr>
</table>
<h3>3. Language focus: cause and consequence</h3>
<p>Причина: <i>because, due to, as a result of</i>. Следствие: <i>therefore, consequently, this may lead to</i>. Важно различать установленную причинную связь и предположение: используйте <i>may, can, is associated with</i>, если данных недостаточно для категоричного вывода.</p>
<h3>4. Reading comprehension</h3>
<ol><li>What is the biosphere?</li><li>Name three parts of the Earth included in the biosphere.</li><li>How can burning fossil fuels affect the atmosphere?</li><li>Name two ways agriculture can affect the environment.</li><li>Why does the effect of a pollutant depend on several factors?</li><li>Name three environmental protection measures.</li></ol>
<h3>5. Практика</h3>
<p><b>Задание A. Соотнесите термин и определение:</b> biosphere; habitat; exposure; monitoring; wastewater treatment.</p>
<p><b>Задание B. Завершите причинно-следственные предложения:</b> 1) If wastewater is not treated, … 2) If more materials are reused, … 3) Excessive emissions may lead to …</p>
<p><b>Задание C. Прочитайте высказывания и отметьте, где нужна осторожная формулировка:</b> “This activity always destroys every ecosystem.” / “This activity may affect local water quality, depending on the substances and their concentration.” Объясните выбор.</p>
<h3>6. Самопроверка и ключ преподавателя</h3>
<ol><li>The part of Earth where life exists and interacts with its environment.</li><li>Lower atmosphere, water and parts of land/soil.</li><li>It adds carbon dioxide and other substances to the atmosphere.</li><li>Fertilisers, pesticides and land-use changes can affect soil and water.</li><li>Because chemical properties, amount, location, exposure and organism sensitivity differ.</li><li>Reduce emissions, treat wastewater, use resources efficiently, restore habitats, improve waste management.</li><li>Задание C: второе утверждение научно осторожнее и учитывает условия.</li></ol>
<p><b>Самостоятельная работа:</b> напишите 100–120 слов о воздействии одного вида деятельности на окружающую среду. Разделите причины, возможные последствия и меры снижения воздействия. Статистику используйте только с указанием проверенного источника.</p>
`)
            ],
            [],
            [],
            [
              tq("Physics begins with...", ["Galileo", "Newton", "Einstein"]),
              tq("The first revolutionary novelty was...", ["Planck's quantum constant", "Einstein's relativity", "Rutherford's atom"]),
              tq("X-rays were discovered by...", ["Rontgen", "Curie", "Bohr"]),
              tq("The term automation includes...", ["program, action, sensing, decision, control", "only computers", "only robots"]),
              tq("Only four chemical elements are essential for the biosphere: hydrogen, carbon, nitrogen and...", ["oxygen", "sulphur", "phosphorus"])
            ],
            [
              { code: "W 6.1", title: "Reading: The History of Physics", task: "Answer the questions based on the text:\n1. Who introduced the law of inertia?\n2. What did Newton apply to large bodies?\n3. When did Planck introduce the quantum constant?\n4. Why is physics penetrating other sciences?" },
              { code: "W 6.2", title: "Reading: The Revolution in Physics", task: "Answer the questions based on the text:\n1. Who discovered X-rays and when?\n2. What did the photographs show?\n3. What discoveries followed the discovery of X-rays?\n4. What was the first phase of the revolution called?" },
              { code: "W 6.3", title: "Reading: Automation", task: "Answer the questions based on the text:\n1. What are the main components of an automated system?\n2. What is feedback used for?\n3. What does the decision element do?\n4. Why is an industrial engineer part of a team?" },
              { code: "W 6.4", title: "Reading: Environmental Pollution", task: "Answer the questions based on the text:\n1. What is the biosphere?\n2. What are the four essential elements for the biosphere?\n3. What causes environmental disturbance?\n4. What is the threat to our environment caused by?" },
              { code: "W 6.5", title: "Essay: A Good Job", task: "Read the text 'A good job' from the speaking section of your textbook. Write a short retelling of it (10-12 sentences) using indirect speech." },
              { code: "W 6.6", title: "Dialogue: Looking for a job", task: "Make up your own dialogue based on the 'Looking for a job' text. Use the conversational formulas from the text." }
            ]
          )
        ]
      }
    ],
    videos: [], passports: [], safety: [], formatting: {},
    
    flashcards: {
      basic: [
        { front: "ability", back: "способность" }, { front: "achieve", back: "достигать" },
        { front: "advantage", back: "преимущество" }, { front: "advice", back: "совет" },
        { front: "affect", back: "влиять" }, { front: "allow", back: "разрешать" },
        { front: "ancient", back: "древний" }, { front: "apply", back: "применять" },
        { front: "available", back: "доступный" }, { front: "average", back: "средний" },
        { front: "behavior", back: "поведение" }, { front: "benefit", back: "польза" },
        { front: "career", back: "карьера" }, { front: "challenge", back: "вызов" }
      ],
      crossword: [
        { word: "ABILITY", clue: "The power or skill to do something" },
        { word: "CAREER", clue: "A profession or job you do for a long time" },
        { word: "FUTURE", clue: "Time that has not come yet" },
        { word: "GOAL", clue: "Something you want to achieve" },
        { word: "LANGUAGE", clue: "English, Russian, French — all are ..." },
        { word: "RESULT", clue: "The final outcome of an action" }
      ]
    }
  };
})();
