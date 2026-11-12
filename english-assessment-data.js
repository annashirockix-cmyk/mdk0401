/* ============================================================
   МДК — semester-tests.js
   Семестровые контрольные (10 шт) + итоговые экзамены (5 × 2 варианта)
   Подключать ПОСЛЕ data-basic.js и data-technical.js
   ============================================================ */
"use strict";

(function () {
  function tq(q, options) { return { q: q, options: options }; }

  window.SEMESTER_TESTS = window.SEMESTER_TESTS || {};
  window.FINAL_EXAMS    = window.FINAL_EXAMS    || {};

  /* ============================================================
     БАЗОВЫЙ КУРС (Basic English)
     ============================================================ */
  window.SEMESTER_TESTS.basic = [
    /* 1 курс · 1 семестр — Unit 1: About Myself */
    { id: "b_sem1", title: "Контрольная работа №1", subtitle: "1 курс, 1 семестр · Unit 1", year: 1, semester: 1, time: 45, questions: [
      tq("Which word has the long vowel [i:]?", ["list", "least", "fill", "rich"]),
      tq("Which word has the sound [θ]?", ["that", "think", "this", "those"]),
      tq("The letter 's' is pronounced [z] after…", ["voiceless consonants", "voiced consonants and vowels", "silent letters", "only at the beginning"]),
      tq("This computer is …", ["me", "my", "mine", "myself"]),
      tq("You can ask … teacher about it.", ["our", "ours", "ourselves", "us"]),
      tq("Can you see … through the window?", ["something", "anything", "nothing", "everything"]),
      tq("She did the work …", ["her", "hers", "herself", "she"]),
      tq("He … a first-year student.", ["am", "is", "are", "be"]),
      tq("I … a lot of free time every day.", ["have", "has", "am", "is"]),
      tq("… you go to school every day?", ["Do", "Does", "Is", "Are"]),
      tq("You will … learn the poem.", ["must", "have to", "can", "may"]),
      tq("He … speak English very well.", ["can", "must", "has to", "is"]),
      tq("… I use your phone?", ["May", "Must", "Should", "Ought"]),
      tq("This book is … than that one.", ["interesting", "more interesting", "most interesting", "the most interesting"]),
      tq("Mathematics is the … subject.", ["important", "more important", "most important", "importanter"]),
      tq("'To be born' means …", ["родиться", "умереть", "учиться", "работать"]),
      tq("Which sentence is correct?", ["I not work now.", "I do not work now.", "I am not work now.", "I no work now."]),
      tq("Nobody … heard about this writer.", ["haven't", "have", "has", "didn't"]),
      tq("I don't believe he is … cruel.", ["what", "so", "that", "such"]),
      tq("'To make a career' means …", ["делать карьеру", "получать образование", "сдавать экзамен", "работать менеджером"])
    ]},
    /* 1 курс · 2 семестр — Unit 2: Town I Live In */
    { id: "b_sem2", title: "Контрольная работа №2", subtitle: "1 курс, 2 семестр · Unit 2", year: 1, semester: 2, time: 45, questions: [
      tq("Form an adjective from 'industry':", ["industrial", "industrious", "industry", "industrially"]),
      tq("Form a noun from 'develop':", ["development", "developer", "developed", "developing"]),
      tq("Negative adjective from 'possible':", ["unpossible", "impossible", "inpossible", "dispossible"]),
      tq("Translate: 'state border security system'", ["система безопасности государственной границы", "безопасность государственной границы", "государственная граница системы", "система государственной границы"]),
      tq("Translate: 'remote control system'", ["система дистанционного управления", "дистанционное управление системой", "управление дистанционной системой", "система управления дистанционно"]),
      tq("Nizhnekamsk … on the left bank of the Kama.", ["is located", "locates", "is locating", "has located"]),
      tq("The plant … goods to other countries now.", ["exports", "is exporting", "exported", "has exported"]),
      tq("We … this town last year.", ["visit", "visited", "have visited", "are visiting"]),
      tq("I … never … to Kazan.", ["have / been", "has / been", "am / being", "was / be"]),
      tq("They … their work by 5 yesterday.", ["finish", "finished", "had finished", "have finished"]),
      tq("Which sentence is correct?", ["The plant is large and modern.", "Is the plant large and modern.", "Large and modern the plant is.", "The plant large is and modern."]),
      tq("Where … Nizhnekamsk located?", ["is", "are", "do", "does"]),
      tq("'Architectural symbol' means …", ["архитектурный символ", "архитектурный стиль", "строительный объект", "памятник"]),
      tq("'Infrastructure' means …", ["инфраструктура", "строительство", "промышленность", "транспорт"]),
      tq("'To be located' means …", ["быть расположенным", "быть построенным", "быть разрушенным", "быть известным"]),
      tq("The biggest industrial enterprises … the petrochemical and tyre plants.", ["is", "are", "was", "has"]),
      tq("A lot of useful goods … here.", ["produced", "are produced", "is produced", "produces"]),
      tq("Students … higher education at universities.", ["receive", "receives", "is receiving", "are receiving"]),
      tq("You can spend your days off … the nature.", ["enjoying", "enjoy", "enjoyed", "to enjoy"]),
      tq("'Magnificent nature' means …", ["великолепная природа", "дикая природа", "живописный пейзаж", "природные ресурсы"])
    ]},
    /* 2 курс · 3 семестр — Unit 3: Tatarstan. Infinitive & Gerund */
    { id: "b_sem3", title: "Контрольная работа №3", subtitle: "2 курс, 1 семестр · Unit 3", year: 2, semester: 1, time: 45, questions: [
      tq("I want … a doctor.", ["to be", "being", "be", "been"]),
      tq("He enjoys … technical books.", ["to read", "reading", "read", "reads"]),
      tq("She decided … the university.", ["entering", "to enter", "enter", "entered"]),
      tq("… English is very important for engineers.", ["To know", "Knowing", "Know", "Knew"]),
      tq("They finished … the experiment.", ["to do", "doing", "do", "did"]),
      tq("We hope … the exam successfully.", ["passing", "to pass", "pass", "passed"]),
      tq("He is interested in … new technologies.", ["to learn", "learning", "learn", "learned"]),
      tq("It is important … foreign languages.", ["to study", "studying", "study", "studied"]),
      tq("'Population' means …", ["население", "популяция", "поколение", "популярность"]),
      tq("'State language' means …", ["государственный язык", "иностранный язык", "родной язык", "официальный язык"]),
      tq("'Natural resources' means …", ["природные ресурсы", "искусственные материалы", "полезные ископаемые", "энергоресурсы"]),
      tq("'Sovereignty' means …", ["суверенитет", "независимость", "государство", "республика"]),
      tq("'International cooperation' means …", ["международное сотрудничество", "международные отношения", "внешняя политика", "международная торговля"]),
      tq("The main branches of industry in Tatarstan are …", ["oil and gas extracting, motorcar constructing, chemical production", "agriculture and tourism", "light industry", "food production"]),
      tq("The capital of Tatarstan is …", ["Kazan", "Nizhnekamsk", "Naberezhny Chelny", "Yelabuga"]),
      tq("Tatarstan is situated in the middle part of …", ["the Volga basin", "the Ural mountains", "the Black Sea", "the Caspian Sea"]),
      tq("The population of Tatarstan is about …", ["4 million", "10 million", "1 million", "7 million"]),
      tq("The state languages are …", ["Tatar and Russian", "Tatar and English", "Russian and English", "Tatar only"]),
      tq("The flag of Tatarstan consists of … stripes.", ["three horizontal", "two vertical", "four horizontal", "three vertical"]),
      tq("We know gravity … on every particle of a body.", ["to act", "acting", "act", "acted"])
    ]},
    /* 2 курс · 4 семестр — Participles, Conditionals I */
    { id: "b_sem4", title: "Контрольная работа №4", subtitle: "2 курс, 2 семестр · Unit 3–4", year: 2, semester: 2, time: 45, questions: [
      tq("Participle I is formed by adding:", ["-ed", "-ing", "-en", "-ly"]),
      tq("Participle II is:", ["the 1st form", "the 2nd form", "the 3rd form", "the -ing form"]),
      tq("The … boy is my brother.", ["playing", "played", "play", "plays"]),
      tq("The results … depended on the methods used.", ["obtaining", "obtained", "obtain", "to obtain"]),
      tq("… the experiment, he showed all details.", ["Describe", "Describing", "Described", "To describe"]),
      tq("If machine parts are oiled, they … not rust.", ["will", "would", "would have", "are"]),
      tq("If we lower the temperature, the liquid … turn into ice.", ["can", "could", "would have", "had"]),
      tq("If I had time, I … help you.", ["will", "would", "would have", "am"]),
      tq("If they had checked the drawing, they … the mistake.", ["would avoid", "would have avoided", "will avoid", "avoid"]),
      tq("The … of the ozone layer could lead to a catastrophe.", ["destruct", "destruction", "destructive", "destroy"]),
      tq("'Pollution' means …", ["загрязнение", "очистка", "разрушение", "защита"]),
      tq("'Environment' means …", ["окружающая среда", "природа", "экология", "погода"]),
      tq("'Global catastrophe' means …", ["глобальная катастрофа", "мировая война", "природный катаклизм", "климатическое изменение"]),
      tq("'Ozone layer' means …", ["озоновый слой", "атмосфера", "стратосфера", "воздушная оболочка"]),
      tq("Factories … dust into the atmosphere.", ["throw out", "throw in", "throw up", "throw off"]),
      tq("About two hundred years ago man … in harmony with nature.", ["lived", "lives", "is living", "has lived"]),
      tq("Today the contradictions between man and nature … dramatic.", ["is", "are", "was", "has"]),
      tq("Rapid growth of population … pollution.", ["increase", "increases", "is increasing", "have increased"]),
      tq("The protection of nature … a political program of every country.", ["become", "is becoming", "has become", "became"]),
      tq("We must take care … the Earth.", ["of", "on", "in", "about"])
    ]},
    /* 3 курс · 5 семестр — Conditionals II–III, Reported speech */
    { id: "b_sem5", title: "Контрольная работа №5", subtitle: "3 курс, 1 семестр · Unit 4", year: 3, semester: 1, time: 45, questions: [
      tq("He said: 'I live in Kazan.' → He said that he … in Kazan.", ["lives", "lived", "is living", "has lived"]),
      tq("She said: 'I have seen this film.' → She said she … that film.", ["has seen", "had seen", "saw", "sees"]),
      tq("He asked: 'Are you a student?' → He asked … I was a student.", ["that", "if", "what", "which"]),
      tq("They asked: 'When will the lesson be over?' → They asked when the lesson … over.", ["will be", "would be", "is", "was"]),
      tq("The teacher said: 'Open your books.' → The teacher told us … our books.", ["open", "opening", "to open", "opened"]),
      tq("The Earth … round the Sun.", ["go", "goes", "is going", "gone"]),
      tq("If I had more time, I … the book.", ["would read", "will read", "read", "would have read"]),
      tq("If they had started earlier, they … the train.", ["would catch", "would have caught", "caught", "catch"]),
      tq("But for the lack of time we … one more experiment.", ["will carry out", "would carry out", "would have carried out", "carry out"]),
      tq("'A global catastrophe' is a catastrophe that affects …", ["a whole planet", "one country", "a small region", "one city"]),
      tq("'Smog' is a mixture of …", ["smoke and fog", "water and air", "dust and rain", "smoke and snow"]),
      tq("'Ozone layer' protects the Earth from …", ["ultraviolet radiation", "meteorites", "solar wind", "magnetic storms"]),
      tq("Which sentence is in Passive Voice?", ["They built the house.", "The house was built.", "They are building the house.", "The house is big."]),
      tq("The book … published in 2015.", ["is", "was", "were", "are"]),
      tq("The results of the experiment … discussed yesterday.", ["were", "was", "is", "are"]),
      tq("The new device … in mass production now.", ["has been put", "has put", "is putting", "put"]),
      tq("The instrument … carefully before use.", ["must be checked", "must check", "must checking", "must to check"]),
      tq("The letter … by the manager tomorrow.", ["will be written", "will write", "writes", "wrote"]),
      tq("An engineer … to know English.", ["is expected", "expects", "is expecting", "expected"]),
      tq("'Environmental protection' means …", ["защита окружающей среды", "охрана труда", "защита природы", "экологическая безопасность"])
    ]},
    /* 3 курс · 6 семестр — Passive, Grammar Reference */
    { id: "b_sem6", title: "Контрольная работа №6", subtitle: "3 курс, 2 семестр · Unit 5", year: 3, semester: 2, time: 45, questions: [
      tq("The letter … yesterday.", ["was sent", "is sent", "were sent", "sent"]),
      tq("A new school … in our street next year.", ["will be built", "will build", "builds", "is built"]),
      tq("The problem … by the engineers now.", ["is being solved", "is solving", "solves", "solved"]),
      tq("The work … by 5 o'clock yesterday.", ["had been done", "has been done", "was doing", "did"]),
      tq("The students … a test at the moment.", ["are writing", "is writing", "write", "writes"]),
      tq("Form a noun from 'inform':", ["information", "informer", "informed", "informing"]),
      tq("Form an adjective from 'effect':", ["effective", "effect", "effectively", "effectiveness"]),
      tq("Prefix 'un-' + 'important' =", ["unimportant", "inimportant", "imimportant", "disimportant"]),
      tq("Prefix 'dis-' + 'connect' =", ["disconnect", "unconnect", "inconnect", "misconnect"]),
      tq("Noun from 'apply':", ["application", "applier", "applied", "applying"]),
      tq("Verb 'to be' + Participle II forms:", ["Active Voice", "Passive Voice", "Future", "Conditional"]),
      tq("'By the end of the year' is used with:", ["Future Perfect", "Future Simple", "Present Perfect", "Past Simple"]),
      tq("'For two hours' is used with:", ["Perfect Progressive", "Simple", "Perfect", "Passive"]),
      tq("Choose the correct form: He … since morning.", ["has been reading", "has read", "reads", "is reading"]),
      tq("Choose the correct form: She … already … the task.", ["has / finished", "have / finished", "is / finishing", "had / finish"]),
      tq("A lot of useful goods … at this plant.", ["are produced", "produces", "is produced", "produced"]),
      tq("The plant … in 1967.", ["was built", "built", "is built", "has built"]),
      tq("The results … on the methods used.", ["depend", "depends", "is depending", "have depended"]),
      tq("The unit of measure in metric system … a kilogram.", ["is", "are", "was", "were"]),
      tq("This device … to control the temperature.", ["is used", "uses", "used", "using"])
    ]},
    /* 4 курс · 7 семестр — Technical: Materials, Tools, Measurements */
    { id: "b_sem7", title: "Контрольная работа №7", subtitle: "4 курс, 1 семестр · Technical English", year: 4, semester: 1, time: 45, questions: [
      tq("Which material is lightweight and corrosion-resistant?", ["Aluminium", "Cast iron", "Steel", "Ceramic"]),
      tq("'Ductility' means the ability to:", ["be drawn into wire", "break easily", "resist heat", "conduct electricity"]),
      tq("Cast iron is … than steel.", ["more brittle", "stronger", "lighter", "softer"]),
      tq("An alloy of iron and carbon is called:", ["steel", "aluminium", "copper", "brass"]),
      tq("'Hardness' is the ability to:", ["resist indentation", "bend without breaking", "conduct heat", "stretch"]),
      tq("Carbon fibre is:", ["strong and light", "heavy and brittle", "soft and cheap", "transparent"]),
      tq("A lathe rotates the:", ["workpiece", "tool", "spindle only", "bed"]),
      tq("A milling machine uses:", ["rotary cutters", "a single point tool", "a drill bit only", "a grinding wheel"]),
      tq("CNC stands for:", ["Computer Numerical Control", "Central Numerical Center", "Common Numerical Control", "Complex NC"]),
      tq("A drill creates:", ["holes", "threads", "flat surfaces", "grooves"]),
      tq("Grinding is used for:", ["finishing", "roughing", "drilling", "turning"]),
      tq("The tailstock is part of a:", ["lathe", "milling machine", "drill", "grinder"]),
      tq("A micrometer is used for:", ["precise outer dimensions", "holes", "angles", "roughness"]),
      tq("Accuracy means how close a measurement is to:", ["the true value", "another measurement", "the nominal size", "zero"]),
      tq("Ø50 ±0.05 mm means the diameter is between:", ["49.95 and 50.05", "49.5 and 50.5", "50 and 51", "49 and 51"]),
      tq("A calliper is used for:", ["outer/inner dimensions", "only depth", "only angles", "only threads"]),
      tq("'Tolerance' is the allowed:", ["deviation", "increase", "decrease", "error"]),
      tq("A dial indicator measures:", ["runout", "temperature", "hardness", "roughness"]),
      tq("'Workpiece' means:", ["заготовка", "деталь", "инструмент", "станок"]),
      tq("'Spindle' means:", ["шпиндель", "патрон", "суппорт", "станина"])
    ]},
    /* 4 курс · 8 семестр — CNC, Manufacturing, Safety */
    { id: "b_sem8", title: "Контрольная работа №8", subtitle: "4 курс, 2 семестр · CNC & Manufacturing", year: 4, semester: 2, time: 45, questions: [
      tq("G00 means:", ["rapid positioning", "linear interpolation", "circular interpolation", "work offset"]),
      tq("G01 is:", ["linear interpolation", "rapid", "circular CW", "circular CCW"]),
      tq("M03 turns the spindle:", ["clockwise", "counterclockwise", "off", "slowly"]),
      tq("G90 means:", ["absolute positioning", "incremental", "metric", "inch"]),
      tq("M30 is:", ["end of program", "spindle on", "coolant on", "tool change"]),
      tq("G21 means:", ["metric units", "inch units", "work offset", "cutter comp"]),
      tq("G54 is:", ["work coordinate system", "tool length comp", "spindle speed", "plane selection"]),
      tq("M08 is:", ["coolant ON", "coolant OFF", "tool change", "spindle stop"]),
      tq("CAD means:", ["Computer-Aided Design", "Computer-Aided Drafting", "Computer-Aided Drawing", "Computer-Aided Development"]),
      tq("Facing is done on a:", ["lathe", "mill", "drill", "grinder"]),
      tq("Tapping is used to make a:", ["thread", "hole", "groove", "slot"]),
      tq("Inspection is done:", ["after machining", "before design", "during CAD", "after shipping"]),
      tq("CAM is used to:", ["prepare the CNC program", "make drawings only", "inspect parts", "ship products"]),
      tq("Milling is done on a:", ["milling machine", "lathe", "drill press", "grinder"]),
      tq("You … wear safety glasses in the workshop.", ["must", "might", "can", "could"]),
      tq("You … leave the chuck key in the chuck.", ["must not", "should", "can", "may"]),
      tq("Chips must be removed:", ["with a brush or hook", "by hand", "with a cloth", "by mouth"]),
      tq("PPE stands for:", ["Personal Protective Equipment", "Public Protection Equipment", "Personal Practice Equipment", "Professional Protective Engineering"]),
      tq("In case of accident, press the:", ["emergency stop", "start button", "reset button", "coolant button"]),
      tq("Loose clothing is dangerous near:", ["rotating parts", "tools on the bench", "the floor", "the light"])
    ]},
    /* 5 курс · 9 семестр — Automation, Electronics, Computer */
    { id: "b_sem9", title: "Контрольная работа №9", subtitle: "5 курс, 1 семестр · Automation", year: 5, semester: 1, time: 45, questions: [
      tq("'Automation' means:", ["автоматизация", "механизация", "роботизация", "компьютеризация"]),
      tq("'Sensor' means:", ["датчик", "сенсор", "прибор", "устройство"]),
      tq("A device that converts physical information into electrical signals is a:", ["transducer", "sensor", "controller", "actuator"]),
      tq("'Feedback' in an automated system is:", ["обратная связь", "подача", "сигнал", "управление"]),
      tq("The 'decision element' of an automated system:", ["compares what is going on with what should be", "carries materials", "performs work", "supplies power"]),
      tq("'Domotics' means:", ["building automation", "robotics", "electronics", "computing"]),
      tq("A CPU is:", ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Common Processing Unit"]),
      tq("RAM is:", ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Random Active Memory"]),
      tq("ROM is:", ["Read-Only Memory", "Random-Only Memory", "Rapid-Only Memory", "Read-Out Memory"]),
      tq("'Hardware' refers to:", ["physical components", "software", "programs", "data"]),
      tq("'Software' refers to:", ["programs and data", "physical parts", "CPU only", "RAM only"]),
      tq("The Internet was invented in the:", ["1960s", "1980s", "1990s", "2000s"]),
      tq("WWW stands for:", ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"]),
      tq("ISP stands for:", ["Internet Service Provider", "Internet System Provider", "Information Service Provider", "Internal Service Program"]),
      tq("A USB flash drive is a:", ["portable storage device", "printer", "monitor", "keyboard"]),
      tq("A LAN is a:", ["Local Area Network", "Large Area Network", "Long Area Network", "Logical Area Network"]),
      tq("A WAN is a:", ["Wide Area Network", "Wireless Area Network", "World Area Network", "Wide Access Network"]),
      tq("Ethernet is a family of:", ["communication protocols", "computers", "cables", "monitors"]),
      tq("TCP/IP is a:", ["set of communication protocols", "type of cable", "type of monitor", "type of keyboard"]),
      tq("A router is a device that:", ["sends messages between networks", "prints documents", "displays information", "stores data"])
    ]},
    /* 5 курс · 10 семестр — Итоговое повторение */
    { id: "b_sem10", title: "Контрольная работа №10 (итоговая)", subtitle: "5 курс, 2 семестр · Итоговое повторение", year: 5, semester: 2, time: 45, questions: [
      tq("Physics begins with:", ["Galileo", "Newton", "Einstein", "Planck"]),
      tq("The first revolutionary novelty in physics was:", ["Planck's quantum constant", "Einstein's relativity", "Rutherford's atom", "Bohr's model"]),
      tq("X-rays were discovered by:", ["Rontgen", "Curie", "Bohr", "Einstein"]),
      tq("The term automation includes:", ["program, action, sensing, decision, control", "only computers", "only robots", "only sensors"]),
      tq("Only four chemical elements are essential for the biosphere:", ["hydrogen, carbon, nitrogen, oxygen", "sulphur, phosphorus, iron, zinc", "carbon, oxygen, iron, calcium", "hydrogen, oxygen, nitrogen, chlorine"]),
      tq("'To be located' means:", ["быть расположенным", "быть построенным", "быть разрушенным", "быть известным"]),
      tq("'To make a career' means:", ["делать карьеру", "получать образование", "сдавать экзамен", "работать менеджером"]),
      tq("'Environmental protection' means:", ["защита окружающей среды", "охрана труда", "защита природы", "экологическая безопасность"]),
      tq("A micrometer is used for:", ["precise outer dimensions", "holes", "angles", "roughness"]),
      tq("G00 means:", ["rapid positioning", "linear interpolation", "circular interpolation", "work offset"]),
      tq("M03 turns the spindle:", ["clockwise", "counterclockwise", "off", "slowly"]),
      tq("G54 is:", ["work coordinate system", "tool length comp", "spindle speed", "plane selection"]),
      tq("'Sensor' means:", ["датчик", "сенсор", "прибор", "устройство"]),
      tq("A CPU is:", ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Common Processing Unit"]),
      tq("A LAN is a:", ["Local Area Network", "Large Area Network", "Long Area Network", "Logical Area Network"]),
      tq("In case of accident, press the:", ["emergency stop", "start button", "reset button", "coolant button"]),
      tq("You … wear safety glasses in the workshop.", ["must", "might", "can", "could"]),
      tq("The results of the experiment … discussed yesterday.", ["were", "was", "is", "are"]),
      tq("He said he … that film.", ["had seen", "has seen", "saw", "sees"]),
      tq("If I had time, I … help you.", ["would", "will", "would have", "am"])
    ]}
  ];

  // Старые итоговые экзамены удалены: используются два новых VPR-формата из english-vpr-exams.js.
  window.FINAL_EXAMS.basic = [];

  /* ============================================================
     TECHNICAL COURSE — те же 10 семестровых и 5 итоговых,
     но с упором на техническую лексику. (Структурно дублирует basic.)
     ============================================================ */
  window.SEMESTER_TESTS.technical = window.SEMESTER_TESTS.basic.map(t => ({
    ...t,
    id: "t_" + t.id,
    title: t.title.replace("Контрольная работа", "Контрольная работа (Technical)"),
    subtitle: t.subtitle.replace("Unit", "Technical · Unit")
  }));

  window.FINAL_EXAMS.technical = [];

  console.log("[English assessment] Loaded semester tests; legacy final exams removed. VPR Basic/Technical loaded separately.");
})();
