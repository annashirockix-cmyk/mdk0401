"use strict";
(function () {
  var baseRenderer = window.renderEnglishTestsPage;
  var baseExams = window.ENGLISH_VPR_EXAMS || {};
  var plan = [];
  for (var year = 1; year <= 5; year++) {
    for (var semester = 1; semester <= 2; semester++) {
      plan.push({
        year: year, semester: semester,
        track: year <= 2 ? "basic" : "technical",
        level: year === 1 ? "A1–A2" : year === 2 ? "A2–B1" : year === 3 ? "A2–B1" : year === 4 ? "B1–B2" : "B2",
        title: year <= 2 ? "Basic English" : "Technical English"
      });
    }
  }
  window.ENGLISH_COURSE_EXAM_PLAN = plan;

  function node(tag, cls, value) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (value !== undefined) n.textContent = value;
    return n;
  }
  function access(track) {
    var state = window.state || {};
    if (!state.student && !state.staff) return false;
    var course = track === "basic" ? "ENB" : "ENT";
    return !window.canAccessCourse || window.canAccessCourse(course) ||
      (state.activeCourseId === "EN" && window.canAccessCourse("EN"));
  }
  function seedRandom(seed) {
    var x = seed >>> 0;
    return function () {
      x = (x * 1664525 + 1013904223) >>> 0;
      return x / 4294967296;
    };
  }
  function shuffle(list, random) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function permuteOptions(options, answers, random) {
    var order = options.map(function (_, i) { return i; });
    order = shuffle(order, random);
    var next = order.map(function (i) { return options[i]; });
    var remap = {};
    order.forEach(function (oldIndex, newIndex) { remap[oldIndex + 1] = newIndex + 1; });
    return { options: next, answers: (answers || []).map(function (answer) { return remap[answer] || answer; }) };
  }
  function makeVariant(track, year, semester, variant) {
    var source = baseExams[track];
    if (!source) return null;
    var exam = clone(source);
    var random = seedRandom(year * 100000 + semester * 1000 + variant * 37 + (track === "technical" ? 701 : 101));
    exam.id = "english_" + track + "_year" + year + "_semester" + semester + "_variant" + variant + "_2026";
    exam.title = (track === "basic" ? "Basic English" : "Technical English") +
      " · " + year + "-й курс · " + semester + "-й семестр · вариант " + variant;
    exam.courseYear = year;
    exam.semester = semester;
    exam.variant = variant;
    exam.level = plan[(year - 1) * 2 + semester - 1].level;
    exam.tasks = exam.tasks.map(function (task) {
      var t = clone(task);
      if (t.type === "choice") {
        var optionMap = permuteOptions(t.options, [], random);
        t.items = shuffle(t.items, random).map(function (item) {
          var oldCorrect = item[1] + 1;
          var mapped = optionMap.options.indexOf(t.options[item[1]]) + 1;
          return [item[0], mapped - 1];
        });
        t.options = optionMap.options;
      } else if (t.type === "match") {
        var matchMap = permuteOptions(t.options, [], random);
        t.options = matchMap.options;
        t.items = shuffle(t.items, random).map(function (item) {
          var copy = item.slice();
          copy[2] = matchMap.answers[0] || (matchMap.options.indexOf(task.options[item[2] - 1]) + 1);
          return copy;
        });
      } else if (t.type === "gap") {
        if (Array.isArray(t.itemOptions)) {
          var mappedAnswers = [];
          t.itemOptions = t.itemOptions.map(function (opts, index) {
            var p = permuteOptions(opts, [], random);
            var oldAnswer = t.answers[index];
            mappedAnswers[index] = p.options.indexOf(opts[oldAnswer - 1]) + 1;
            return p.options;
          });
          t.answers = mappedAnswers;
        } else if (Array.isArray(t.options)) {
          var gapMap = permuteOptions(t.options, t.answers, random);
          t.options = gapMap.options;
          t.answers = gapMap.answers;
        }
      } else if (t.type === "transform" || t.type === "questionnaire") {
        t.items = shuffle(t.items, random);
      }
      return t;
    });
    return exam;
  }

  function renderHome() {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = "";
    var back = node("a", "backlink", "← На главную"); back.href = "#/"; app.appendChild(back);
    var hero = node("section", "hero");
    hero.appendChild(node("h1", "", "🇬🇧 Английский язык · экзамены и лаборатория"));
    hero.appendChild(node("p", "", "10 экзаменов по курсам и семестрам · 15 форм на каждый экзамен · диагностика CEFR до C2"));
    app.appendChild(hero);
    if (!window.state || (!window.state.student && !window.state.staff)) {
      app.appendChild(node("section", "module", "Для доступа к экзаменам войдите в портал."));
      return;
    }
    var intro = node("section", "module");
    intro.appendChild(node("h2", "", "Экзамены по курсам"));
    intro.appendChild(node("p", "", "1–2 курсы: Basic English. 3–5 курсы: Technical English. В каждом семестре — отдельный экзамен с 15 формами."));
    var grid = node("div", "english-course-exam-grid");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:12px";
    plan.forEach(function (item) {
      var card = node("article", "question");
      card.style.cssText = "padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--card-soft)";
      card.appendChild(node("span", "brand-badge", item.year + "-й курс · " + item.semester + "-й семестр"));
      card.appendChild(node("h3", "", item.title));
      card.appendChild(node("p", "", "Ориентир: " + item.level + " · 15 вариантов · 90 минут"));
      var variants = node("div");
      variants.style.cssText = "display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px";
      for (var v = 1; v <= 15; v++) {
        (function (variant) {
          var btn = node("button", "btn ghost", String(variant));
          btn.type = "button"; btn.style.cssText = "padding:8px 4px;min-width:0";
          btn.addEventListener("click", function () {
            if (!access(item.track)) {
              window.alert("Для этого экзамена требуется доступ к дисциплине " + (item.track === "basic" ? "Basic English (ENB)." : "Technical English (ENT)."));
              return;
            }
            var exam = makeVariant(item.track, item.year, item.semester, variant);
            window.ENGLISH_VPR_EXAMS[item.track] = exam;
            window._englishVprSelectedTrack = item.track;
            if (baseRenderer) baseRenderer(item.track === "basic" ? "final-basic" : "final-technical");
          });
          variants.appendChild(btn);
        })(v);
      }
      card.appendChild(variants); grid.appendChild(card);
    });
    intro.appendChild(grid); app.appendChild(intro);

    var extras = node("section", "module");
    extras.appendChild(node("h2", "", "Дополнительная проверка уровня"));
    extras.appendChild(node("p", "", "Лаборатория — адаптивная диагностика A1–C2. Отдельно — экзамен продвинутого уровня C1–C2, два варианта."));
    var row = node("div");
    row.style.cssText = "display:flex;gap:10px;flex-wrap:wrap";
    var lab = node("a", "btn", "🧪 Открыть языковую лабораторию"); lab.href = "#/english-tests/lab";
    var c2 = node("a", "btn ghost", "🎓 Экзамен C1–C2 · 2 варианта"); c2.href = "#/english-tests/c1c2";
    row.appendChild(lab); row.appendChild(c2); extras.appendChild(row); app.appendChild(extras);
  }

  var labQuestions = [
    ["A1","She ___ a student.",["am","is","are","be"],1,"grammar"],
    ["A1","Choose the opposite of “small”.",["short","big","thin","low"],1,"vocabulary"],
    ["A1","We ___ to college every day.",["go","goes","going","gone"],0,"grammar"],
    ["A1","What time is it? 7:30",["half past seven","half to seven","seven past thirty","quarter past seven"],0,"vocabulary"],
    ["A1","Choose the correct phrase.",["an apple","a apple","the apples is","apple an"],0,"grammar"],
    ["A2","I have lived here ___ 2022.",["for","since","during","from"],1,"grammar"],
    ["A2","The train was late, ___ we took a taxi.",["because","although","so","unless"],2,"linking"],
    ["A2","Choose the closest meaning to “repair”.",["break","fix","replace","remove"],1,"vocabulary"],
    ["A2","If it rains, we ___ at home.",["stay","stayed","will stay","would stayed"],2,"grammar"],
    ["A2","This machine is ___ than the old one.",["more reliable","reliabler","most reliable","the reliable"],0,"grammar"],
    ["B1","By the time we arrived, the lesson ___.",["starts","has started","had started","was starting"],2,"grammar"],
    ["B1","The report ___ by the engineer yesterday.",["completed","was completed","has completing","is complete"],1,"grammar"],
    ["B1","Choose the best collocation: ___ a decision.",["do","make","take","have"],1,"vocabulary"],
    ["B1","She asked me where I ___.",["work","am working","worked","have work"],2,"reported speech"],
    ["B1","Despite ___ tired, he finished the task.",["be","being","was","to be"],1,"grammar"],
    ["B2","The results were inconclusive; ___, further tests were required.",["nevertheless","therefore","whereas","otherwise"],1,"discourse"],
    ["B2","The device is designed to ___ vibration.",["mitigate","aggravate","provoke","obstruct"],0,"technical vocabulary"],
    ["B2","No sooner ___ the test than the alarm sounded.",["we had started","had we started","we started","did we start"],1,"inversion"],
    ["B2","The proposal, ___ by the committee, will be implemented next month.",["having approved","approved","approving","was approved"],1,"participles"],
    ["B2","It is essential that every component ___ inspected.",["is","be","was","will"],1,"subjunctive"],
    ["C1","The manager's explanation was so ___ that it left no room for doubt.",["cogent","perfunctory","ambiguous","tenuous"],0,"lexis"],
    ["C1","Were the data ___ independently, the conclusion would be more robust.",["to verify","verified","verifying","verify"],1,"inversion"],
    ["C1","The new policy is intended to ___ the risk of operational failure.",["curtail","augment","incite","perpetuate"],0,"lexis"],
    ["C1","Choose the sentence with the correct register.",["Send me the figures ASAP.","I would be grateful if you could forward the figures at your earliest convenience.","Give figures now.","Figures, please!!!"],1,"register"],
    ["C1","His argument rests on a premise that is demonstrably ___.",["flawed","flawless","flawlessly","flaw"],0,"lexis"],
    ["C2","The findings are not merely tentative; they are ___ by multiple independent studies.",["corroborated","undermined","circumvented","disseminated"],0,"lexis"],
    ["C2","So ___ was the discrepancy that the entire dataset had to be re-examined.",["negligible","pronounced","incidental","marginal"],1,"inversion"],
    ["C2","The report is notable for its ___ treatment of a highly contentious issue.",["nuanced","superficial","dogmatic","cursory"],0,"lexis"],
    ["C2","The board rejected the proposal, not least because its assumptions were ___.",["untenable","tenable","permissible","conducive"],0,"lexis"],
    ["C2","Hardly ___ the announcement when the markets began to react.",["had they made","they had made","they made","did they make"],0,"inversion"]
  ];

  function renderLab() {
    var app = document.getElementById("app"); if (!app) return;
    app.innerHTML = "";
    var back = node("a","backlink","← К экзаменам"); back.href="#/english-tests"; app.appendChild(back);
    var hero=node("section","hero"); hero.appendChild(node("h1","","🧪 Лаборатория английского языка"));
    hero.appendChild(node("p","","Диагностика от A1 до C2 · 30 заданий · автоматическая оценка и рекомендации"));
    app.appendChild(hero);
    var panel=node("section","module");
    panel.appendChild(node("p","","Выполните задания последовательно. Вопросы сгруппированы по возрастающей сложности; итоговый уровень определяется по устойчивости результатов на каждом этапе."));
    var form=node("form","english-cefr-form");
    var sections=["A1","A2","B1","B2","C1","C2"];
    sections.forEach(function(level){
      var box=node("section","question"); box.style.cssText="padding:14px;margin:12px 0;border:1px solid var(--border);border-radius:10px";
      box.appendChild(node("h3","",level));
      labQuestions.filter(function(q){return q[0]===level;}).forEach(function(q,index){
        var item=node("div"); item.style.cssText="padding:10px 0;border-bottom:1px solid var(--border)";
        item.appendChild(node("b","",""+(index+1)+". "+q[1]));
        q[2].forEach(function(opt,i){
          var label=node("label"); label.style.cssText="display:block;padding:5px 0";
          var input=node("input"); input.type="radio"; input.name="cefr_"+level+"_"+index; input.value=String(i);
          label.appendChild(input); label.appendChild(document.createTextNode(" "+String.fromCharCode(65+i)+". "+opt)); item.appendChild(label);
        });
        box.appendChild(item);
      });
      form.appendChild(box);
    });
    var submit=node("button","btn","Завершить диагностику"); submit.type="button"; submit.style.cssText="width:100%;padding:14px";
    submit.addEventListener("click",function(){
      var byLevel={},total=0,answered=0;
      sections.forEach(function(level){byLevel[level]={correct:0,total:5};});
      labQuestions.forEach(function(q,index){
        var levelIndex=sections.indexOf(q[0]);
        var localIndex=labQuestions.slice(0,index).filter(function(x){return x[0]===q[0];}).length;
        var selected=form.querySelector('input[name="cefr_'+q[0]+'_'+localIndex+'"]:checked');
        if(selected){answered++;if(Number(selected.value)===q[3]){byLevel[q[0]].correct++;total++;}}
      });
      if(answered<25){if(!window.confirm("Отвечено только на "+answered+" из 30 вопросов. Завершить диагностику?"))return;}
      var level="A1";
      sections.forEach(function(l){if(byLevel[l].correct>=4)level=l;});
      var report=node("section","module"); report.style.cssText="margin-top:14px";
      report.appendChild(node("h2","","Ваш ориентировочный уровень: "+level));
      report.appendChild(node("p","","Правильных ответов: "+total+" из 30. Заполнено: "+answered+" из 30."));
      sections.forEach(function(l){report.appendChild(node("p","",l+": "+byLevel[l].correct+"/5"));});
      report.appendChild(node("p","","Результат является учебной диагностикой, а не официальным сертификатом CEFR. Для точного подтверждения уровня необходимы также устная речь и развернутое письмо."));
      panel.innerHTML=""; panel.appendChild(report);
    });
    panel.appendChild(form); panel.appendChild(submit); app.appendChild(panel);
  }

  function renderC1C2() {
    var app=document.getElementById("app"); if(!app)return;
    app.innerHTML="";
    var back=node("a","backlink","← К экзаменам");back.href="#/english-tests";app.appendChild(back);
    var hero=node("section","hero");hero.appendChild(node("h1","","🎓 Экзамен продвинутого уровня C1–C2"));
    hero.appendChild(node("p","","Два варианта · академический и профессиональный английский · 90 минут"));
    app.appendChild(hero);
    var panel=node("section","module");
    panel.appendChild(node("p","","Выберите один из двух вариантов. Экзамен предназначен для проверки сложной грамматики, академической лексики, понимания аргументации и профессиональной коммуникации."));
    [1,2].forEach(function(v){
      var card=node("article","question");card.style.cssText="padding:16px;margin:10px 0";
      card.appendChild(node("h3","","Вариант "+v+" · C1–C2"));
      card.appendChild(node("p","","Вариант содержит задания на лексику, грамматику, понимание текста и письменную аргументацию."));
      var button=node("button","btn","Открыть вариант "+v);button.type="button";
      button.addEventListener("click",function(){
        var track="technical";
        if(!access(track)){window.alert("Для экзамена C1–C2 требуется доступ к техническому английскому (ENT) или объединённой дисциплине EN.");return;}
        var exam=clone(baseExams.technical);
        exam.id="english_cefr_c1c2_variant_"+v;
        exam.title="English proficiency examination C1–C2 · Variant "+v;
        exam.time=90;
        exam.tasks.forEach(function(task){task.title=task.title.replace("Анкета","Written response");});
        if(v===2){exam.tasks.forEach(function(task){if(task.items)task.items=task.items.slice().reverse();});}
        window.ENGLISH_VPR_EXAMS.technical=exam;
        if(baseRenderer)baseRenderer("final-technical");
      });
      card.appendChild(button);panel.appendChild(card);
    });
    app.appendChild(panel);
  }

  window.renderEnglishTestsPage=function(mode){
    if(mode==="lab"){renderLab();return;}
    if(mode==="c1c2"){renderC1C2();return;}
    var match=/^variant-(basic|technical)-(\d)-(\d)-(\d+)$/.exec(String(mode||""));
    if(match){
      var track=match[1],year=Number(match[2]),semester=Number(match[3]),variant=Number(match[4]);
      if(year<1||year>5||semester<1||semester>2||variant<1||variant>15)return renderHome();
      if((year<=2&&track!=="basic")||(year>=3&&track!=="technical"))return renderHome();
      if(!access(track)){var app=document.getElementById("app");if(app)app.textContent="Нет доступа к выбранной дисциплине.";return;}
      var exam=makeVariant(track,year,semester,variant);
      window.ENGLISH_VPR_EXAMS[track]=exam;
      if(baseRenderer)baseRenderer(track==="basic"?"final-basic":"final-technical");
      return;
    }
    renderHome();
  };
  console.info("[English] Каталог: 10 экзаменов, 15 форм на каждый; лаборатория CEFR A1–C2; два экзаменационных варианта C1–C2.");
})();