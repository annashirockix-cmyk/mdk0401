"use strict";

window.MDK_DATA = window.MDK_DATA || {};

(function () {
  function lec(code, title, content) { return { code, title, content }; }
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
                <h3>1. Условные предложения (Conditionals)</h3>
                <table style="width:100%; border-collapse:collapse; margin:10px 0; font-size:14px;">
                  <tr style="background:var(--card-soft);"><th style="border:1px solid var(--border); padding:5px;">Тип</th><th style="border:1px solid var(--border); padding:5px;">Формула</th><th style="border:1px solid var(--border); padding:5px;">Пример</th></tr>
                  <tr><td style="border:1px solid var(--border); padding:5px;">Тип I (Реальное)</td><td style="border:1px solid var(--border); padding:5px;">If + Present Simple, will + V1</td><td style="border:1px solid var(--border); padding:5px;">If machine parts are oiled, they will not rust.</td></tr>
                  <tr><td style="border:1px solid var(--border); padding:5px;">Тип II (Маловероятное)</td><td style="border:1px solid var(--border); padding:5px;">If + Past Simple, would + V1</td><td style="border:1px solid var(--border); padding:5px;">If I had time, I would help you.</td></tr>
                  <tr><td style="border:1px solid var(--border); padding:5px;">Тип III (Нереальное)</td><td style="border:1px solid var(--border); padding:5px;">If + Past Perfect, would have + V3</td><td style="border:1px solid var(--border); padding:5px;">If they had checked the drawing, they would have avoided the mistake.</td></tr>
                </table>
                <h3>2. Согласование времен (Sequence of Tenses)</h3>
                <p>Если сказуемое главного предложения стоит в прошедшем времени, то в придаточном время сдвигается на шаг назад (Present → Past, Past → Past Perfect, Future → Future in the Past).</p>
                <h3>3. Косвенная речь (Reported Speech)</h3>
                <p>При переводе вопросов в косвенную речь порядок слов становится прямым. Общие вопросы вводятся союзом <i>if</i> или <i>whether</i>, специальные — вопросительным словом.</p>
              `),
              lec("4.2", "Reading: Environmental Protection", `
                <h3>Text: Ecology</h3>
                <p>About two hundred years ago man lived in harmony with nature because industry was not so much developed. Today the situation is quite different: the contradictions between man and nature are dramatic. The intensive development of science, industry and chemistry during the last century resulted in the global pollution of the environment.</p>
                <p>Now many parts of the world are overcrowded. Rapid growth of population increases the pollution of the environment greatly. People living in big cities suffer from smog. Factories, electric power stations, the chemical industry and heavy industry throw out into atmosphere billions tons of dust and harmful substances. Much of this waste is carried by winds for great distances. The destruction of the ozone layer could lead our planet to a global catastrophe.</p>
                <p>In recent years the pollution problems have received great publicity. People all over the world are worried about what is happening to the environment. Newspapers and magazines write about water, air and land pollution. The protection of nature is becoming a political program of every country. The Earth is our home that's why we must take care of it and keep it clean for ourselves and for the next generations.</p>
              `),
              lec("4.3", "Reading Practice: The Speed Limit", `
                <h3>Text: The Speed Limit</h3>
                <p>Before the World War II the speed of aircraft was far below the speed of sound. Today we have supersonic aircraft. Radio waves propagate at the velocity of light. Could we perhaps create "superlight" telegraphy to send signals at velocities greater than the velocity of light? No, that is an impossible thing to do. Since the experiment disproves the absolute nature of time, we conclude that signal transmission cannot be instantaneous. The velocity of transmission from one point of space to another can't be infinite, in other words, can't be greater than some ultimate value, the latter being called the speed limit. This speed limit concurs with the light velocity.</p>
                <p>Indeed, according to the principles of the relativity of motion the laws of nature will be the same for all the laboratories moving relatively to each other. The affirmation that no velocity can be greater than the given limit is also the law of Nature and, therefore, the value of the speed limit should be exactly similar in different laboratories. The light velocity is known to possess the same qualities. Thus, the speed of light is not merely the speed of propagation of a natural phenomenon. It plays the important part of being the top velocity. The discovery of the existence of the top velocity in the Universe is one of the greatest triumphs of human genius and of the experimental capacity of the mankind.</p>
                <p>In the 19th century physicists were unable to perceive that a top speed existed and that its existence could be proved. Moreover, if they had stumbled upon it by chance in their experiments, they wouldn't have been sure that it was a law of nature and not merely the effect of their limited experimental capacity.</p>
                <p>To assume that technological development will enable us to attain velocities greater than the velocity of light is just as ridiculous as to suggest that the absence of points on the Earth's surface more than 20 thousand kilometers apart is not a geographical law, but the upshot of our limited knowledge, and to hope that some day, when geography makes further advances, we will be able to find points on the Earth that are still farther apart.</p>
                <p>Light velocity is sure to play such an exceptional part in nature exactly because it is the top velocity for the propagation of anything. Light either outstrips all other phenomena, or, at the outside, arrives simultaneously with them.</p>
                <p>If the Sun should split in two and form two stars, the motion of the Earth would, naturally, suffer a change as well. The 19th century physicists, who didn't know that the top velocity existed in nature, would certainly assume that the Earth changed its motion instantly after the Sun split in two. Yet it would have taken light all of eight minutes to cover the distance from the split Sun to the Earth. The change in the Earth's rotary motion would begin eight minutes after the Sun split up. Until that moment, the Earth would continue to move as if the Sun had not split. Anything that may occur with or on the Sun will not affect the Earth or its motion until eight minutes later.</p>
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
                <h3>The History of Physics</h3>
                <p>The most advanced science at present and the one which seems to give the most light on the structure of the world is physics. It is useful to have some idea of not only what the up-to-date development of physics is but also how we came to think in that way and how the whole of modern physics is connected with its history. In fact, the history of this science begins with Galileo. Galileo introduced the fundamental concepts and principles which were enough for physics until the present century. Galileo introduced the two principles that made mathematical physics possible: the law of inertia and the parallelogram law. The law of inertia, now familiar as Newton's first law of motion made it possible to calculate the motions of matter by means of the laws of dynamics alone.</p>
                <p>Technically the principle of inertia meant that casual laws of physics should be stated in terms of acceleration, i.e. a change of velocity in amount or direction or both which was found in Newton's law of gravitation. From the law of inertia it followed that the causal laws of dynamics must be differential equations of the second order, though this form of statement could not be made until Newton and Leibniz had developed the infinitesimal calculus. The basic idea of dynamics, the equations of motion, the ideas of momentum, of inertia, of mass and of acceleration were applied by Newton to large bodies like the Earth and the Moon to explain the structure and the motion of the Universe.</p>
                <p>From Newton to the end of the nineteenth century, the progress of physics involved no basically new principles. The first revolutionary novelty was Planck's introduction of the quantum constant \(h\) to explain the structure and behaviour of atoms in the year 1900. Another departure from Newtonian principles followed in 1905, when Einstein published his special theory of relativity, which was primarily a geometrical theory of gravitation showing that the universe is expanding.</p>
                <p>In fact, when modern science was growing up from the time of Galileo to the time of Newton, all the sciences were very much joined together. A single man could do absolutely first-class research in pure mathematics, in physics, in chemistry and even in biology. Towards the end of that time the sciences were beginning to separate and after that they continued to separate more and more. Just at this moment we can see a great convergence of all sciences. Physics is increasingly penetrating all the other parts of science and this is evident in the names of the new hybrid subjects. We have long had physical chemistry; now we have chemical physics. A biologist cannot do without knowledge of modern physics while a physicist must know something of biology, as he may find, that a great deal of his work will be concerned with biophysics. The mathematical aspect of physics is also becoming much more evident especially now that we are having a growing symbiosis between physics and mathematics in computational physics. Our job in physics is to see things simply, to understand a great many complicated phenomena in a unified way, in terms of a few simple principles. You cannot predict what will happen in future, but you have to be ready to meet it.</p>
              `),
              lec("6.2", "The Revolution in Physics", `
                <h3>The Revolution in Physics</h3>
                <p>Nineteenth-century physics was a majestic achievement of the human mind. To many who were working in science this achievement seems to be moving towards a certain completion of the picture of the operation of natural forces on the secure basis of the mechanics of Galileo and Newton. However, this picture was shattered at the very outset of the XXth century and was to be replaced by another one. The revolution in physics broke out unexpectedly. In November 1895 the general direction of world research was sharply changed by an accidental and altogether unforeseen discovery.</p>
                <p>Konrad fon Rontgen (1845-1923), then the professor of physics had bought a new cathode-ray discharge tube with the object of studying its inner mechanism. Within a week he had found that something was happening outside the tube: something was escaping that had properties never before imagined in Nature. That something made fluorescent screen shine in the dark and could fog photographic plates through black paper. These astonishing photographs showed coins in purses and bones in the hand. He didn't know what that something was, so he called it "X-rays". This scientific discovery was a top press news all over the world. It was the subject of innumerable music-hall jokes and within a few weeks almost every physicist of repute was repeating the experiment for himself and demonstrating it to admirable audience.</p>
                <p>The immediate value of X-rays was great, particularly to medicine, however, their importance was much greater to the whole of physics and natural knowledge, for the discovery of X-rays provided the key not only to one, but to many branches of physics. This discovery was followed by a number of unexpected discoveries like that of radioactivity in 1896, of the structure of crystals in 1912, of the neutron in 1932, of nuclear fission in 1938, and of mesons between 1936 and 1947. This revolutionary development includes great theoretical achievements of synthesis like Plank's quantum theory in 1900, Einstein's special relativity theory in 1905 and his general theory in 1916, the Rutherford-Bohr atom in 1913 and the new quantum theory in 1925.</p>
                <p>The period from 1895 to 1916 might be called the first phase of the revolution in physics, the so-called heroic, or in a different aspect, the amateur stage of modern physics. In it new worlds were being explored, new ideas created, mainly with the technical and intellectual means of the old XIXth century science. It was still a period primarily of individual achievement: of the Curies and Rutherford, of Plank and Einstein, of the Braggs and Bohr. Physical science, particularly physics itself, still belonged to the university laboratory, it had few links with industry, apparatuses were cheap and simple, it was still in the "sealing-wax-and-string" stage.</p>
              `),
              lec("6.3", "Automation", `
                <h3>Automation</h3>
                <p>We now use the term automation for specific techniques combined to operate automatically in a complete system. These techniques are possible because of electronic devices, most of which have come into use in the last thirty years. They include program, action, sensing or feedback, decision, and control elements as components of a complete system.</p>
                <p>The program elements determine what the system does and the step-by-step manner in which it works to produce the desired result. A program is step-by-step sequence that breaks a task into its individual parts. Some steps in an industrial automation program direct other parts of the system when and how to carry out their jobs. The action elements are those which do the actual work. They may carry or convey materials to specific places at specific times or they may perform operations on the materials. The term mechanical handling device is also used for the action elements.</p>
                <p>Perhaps the most important part of an automated system is sensing or feedback. Sensing devices automatically check on parts of the manufacturing process such as the thickness of a sheet of steel or paper. This is called feedback because the instruments return or feed back this information to the central system control.</p>
                <p>The decision element is used to compare what is going on in the system with what should be going on, it receives information from the sensing devices and makes decisions necessary to maintain the system correctly. If some action is necessary the decision element can give instructions or commands to the system.</p>
                <p>The control element consists of devices to carry out the commands of the decision element. There may be many kinds of devices: valves that open or close, switches that control the flow of electricity, or regulators that change the voltage in various machines; they make the necessary corrections or adjustments to keep the system in conformity with its program.</p>
                <p>An industrial engineer working with automated system is part of a team. Many components of the system, such as the computers, are electronic devices so electronic engineers and technicians are also involved. Many of the industries in which automation has proved particularly suitable - chemicals, papermaking, metal processing - involve chemical processes, so there may be chemical engineers at work too. An industrial engineer with expertise in all these fields may become a systems engineer for automation projects thereby coordinating the activities of all the members of the team.</p>
              `),
              lec("6.4", "Environmental Pollution", `
                <h3>Environmental Pollution</h3>
                <p>Once came into being from inorganic environment, the living matter has deeply altered the lifeless Earth, step by step changing the composition of the atmosphere, the sea, and the upper layers of the solid crust both on land and under the ocean. Since then, were one to find out a single object to evolution it would be the perpetuation of life. Though there are more than 100 chemical elements in the Periodic Table, only four prove to be essential for the biosphere; they are hydrogen, carbon, nitrogen and oxygen. Ecologists define the biosphere to be the part of the world where life can exist and the point of interaction of these four elements. While the elements mentioned above go wonderfully with much of the chemistry life, the definition turns out to be a little too limited, ignoring as it does, the role of sulphur and phosphorus.</p>
                <p>Consequently, it is a fact that most of the problems of the environmental disturbance arise from the extraordinary reactivity of these six elements, with the first four actually building protein molecule, sulphur being the fastening in protein, and phosphorus supplying high-energy bond which is known to be universal fuel for biochemical work within the cells.</p>
                <p>If the biosphere continues in running order biologically important materials must undergo cyclic changes so that after utilization they are put back at the expense of some solar energy into a form in which they can be reused. So far nature itself saw to the whole arrangement go on smoothly and all the cycles be governed by complex mechanisms that were fitted together and held the whole in balance. Yet during the few last decades the man's intervention into the natural cycling of the living matter has been going on an unprecedented scale and at an unprecedented rate. Never before has nature been treated in such a drastic and often irreversible way, with both immediate consequences and ultimate incineration, not even vaguely foreseeable. For too little do we know for certain about the way nature has been self-regulating for millions of years since life began and too many variables are involved, to be able to foresee the final aftermath of our rapid technological development on the biosphere as the home of life.</p>
                <p>Thus, what is now recognized as a threat to our environment is caused first of all by disturbances either in natural cycles of the six essentials, or in the energy cycle of the biosphere, energy being the driving force of all life processes.</p>
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
