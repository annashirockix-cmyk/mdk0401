"use strict";
(function(){
  function node(tag,text){var n=document.createElement(tag);if(text!=null)n.textContent=String(text);return n;}
  function esc(v){return String(v==null?"":v);}
  var designs={
    classic:{label:"Классический бордовый",accent:"#9b3d32",deep:"#64251f",soft:"#f7ece8",line:"#b77a70"},
    navy:{label:"Академический синий",accent:"#28577d",deep:"#17324d",soft:"#eaf1f7",line:"#7898b4"},
    emerald:{label:"Изумрудный",accent:"#26715c",deep:"#174638",soft:"#eaf4ef",line:"#76a893"},
    violet:{label:"Лавандовый",accent:"#66518d",deep:"#40315f",soft:"#f1edf8",line:"#9b8bb9"}
  };
  var backgrounds={
    white:{label:"Чистый белый",css:"#ffffff"},
    parchment:{label:"Светлый пергамент",css:"linear-gradient(135deg,#fffdf7 0%,#f5edda 100%)"},
    blueprint:{label:"Инженерный чертёж",css:"linear-gradient(135deg,#f4f8fc 0%,#e5eef7 100%)"},
    pearl:{label:"Жемчужный",css:"linear-gradient(135deg,#fff 0%,#edf0f5 100%)"},
    image1:{label:"Фон сертификата №1",image:"./assets/certificates/backgrounds/1.png"},
    image2:{label:"Фон сертификата №2",image:"./assets/certificates/backgrounds/2.png"},
    image3:{label:"Фон сертификата №3",image:"./assets/certificates/backgrounds/3.png"},
    image4:{label:"Фон сертификата №4",image:"./assets/certificates/backgrounds/4.png"},
    image5:{label:"Фон сертификата №5",image:"./assets/certificates/backgrounds/5.png"},
    image6:{label:"Фон сертификата №6",image:"./assets/certificates/backgrounds/6.png"}
  };
  function preferenceKey(){var email=window.state&&window.state.student&&window.state.student.email||"guest";return "mdk.certificate.design.v1."+String(email).toLowerCase();}
  function readPrefs(){try{return JSON.parse(localStorage.getItem(preferenceKey())||"{}");}catch(e){return {};}}
  function addStyles(){
    if(document.getElementById("certificateSupplementStyles"))return;
    var s=node("style");
    s.id="certificateSupplementStyles";
    s.textContent=`
      .certificate-choice{max-width:900px;margin:14px auto;padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--card)}
      .certificate-choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}
      .certificate-choice-preview{height:96px;margin:12px 0;border:1px solid #cbd5e1;border-radius:10px;background-size:cover;background-position:center;display:grid;place-items:center;color:#334155;font-weight:800;text-shadow:0 1px 2px #fff;padding:12px;text-align:center}
      .certificate-choice label{display:flex;flex-direction:column;gap:6px;font-weight:600;font-size:13px}
      .certificate-choice select{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--card-soft);color:var(--text)}
      .certificate-supplement{max-width:900px;margin:22px auto;padding:30px;background:#fff;color:#172033;border:3px double #315b7d;border-radius:4px;page-break-before:always;break-before:page;box-sizing:border-box}
      .certificate-supplement .cs-kicker{font-size:11px;letter-spacing:2px;font-weight:800;text-align:center}
      .certificate-supplement h2{text-align:center;margin:10px 0 4px;font-size:25px}
      .certificate-supplement .cs-meta{text-align:center;margin:5px 0}
      .certificate-supplement .cs-summary{margin:18px 0;padding:14px;border-radius:8px;text-align:center;font-weight:700}
      .certificate-supplement table{width:100%;border-collapse:collapse;font-size:13px}
      .certificate-supplement th,.certificate-supplement td{padding:9px 8px;border-bottom:1px solid #d6e0e9;text-align:left;vertical-align:top}
      .certificate-supplement th{font-size:11px;text-transform:uppercase;letter-spacing:.4px}
      .certificate-supplement .cs-note{font-size:11px;color:#526176;margin-top:18px}
      #printable-cert[data-design="classic"],.certificate-supplement[data-design="classic"]{border-color:#9b3d32!important}
      #printable-cert[data-design="navy"],.certificate-supplement[data-design="navy"]{border-color:#28577d!important}
      #printable-cert[data-design="emerald"],.certificate-supplement[data-design="emerald"]{border-color:#26715c!important}
      #printable-cert[data-design="violet"],.certificate-supplement[data-design="violet"]{border-color:#66518d!important}
      #printable-cert[data-design] h1,#printable-cert[data-design] h3{color:var(--cert-accent)!important}
      .certificate-supplement[data-design] h2,.certificate-supplement[data-design] .cs-kicker{color:var(--cert-deep)!important}
      .certificate-supplement[data-design] .cs-summary{background:var(--cert-soft)!important}
      .certificate-supplement[data-design] th{border-bottom:2px solid var(--cert-accent)!important;color:var(--cert-deep)}
      #printable-cert[data-bg="parchment"],.certificate-supplement[data-bg="parchment"]{background:linear-gradient(135deg,#fffdf7 0%,#f5edda 100%)!important}
      #printable-cert[data-bg="blueprint"],.certificate-supplement[data-bg="blueprint"]{background:linear-gradient(135deg,#f4f8fc 0%,#e5eef7 100%)!important}
      #printable-cert[data-bg="pearl"],.certificate-supplement[data-bg="pearl"]{background:linear-gradient(135deg,#fff 0%,#edf0f5 100%)!important}
      #printable-cert[data-bg="white"],.certificate-supplement[data-bg="white"]{background:#fff!important}
      #printable-cert[data-bg^="image"],.certificate-supplement[data-bg^="image"]{background-image:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)),var(--cert-bg-image)!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;}
      @media(max-width:600px){.certificate-supplement{padding:16px}.certificate-supplement table{font-size:11px}}
      @media print{
        @page{size:A4 portrait;margin:14mm}
        body{background:#fff!important}
        .certificate-choice,.no-print,.backlink{display:none!important}
        #printable-cert,.certificate-supplement{width:100%;max-width:none;margin:0 auto;border-radius:0!important;box-shadow:none!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
        #printable-cert{min-height:245mm;display:flex;flex-direction:column;justify-content:center;break-after:page;page-break-after:always}
        .certificate-supplement{min-height:245mm;break-before:page;page-break-before:always}
        .certificate-supplement table{font-size:10pt}
      }`;
    document.head.appendChild(s);
  }
  function applyDesign(design,bg){
    design=designs[design]?design:"classic";bg=backgrounds[bg]?bg:"white";
    var d=designs[design],cert=document.getElementById("printable-cert"),supp=document.querySelector(".certificate-supplement");
    [cert,supp].forEach(function(x){if(!x)return;x.dataset.design=design;x.dataset.bg=bg;x.style.setProperty("--cert-accent",d.accent);x.style.setProperty("--cert-deep",d.deep);x.style.setProperty("--cert-soft",d.soft);x.style.setProperty("--cert-bg-image",backgrounds[bg].image?"url(\""+backgrounds[bg].image+"\")":"none");});
    var key=preferenceKey();try{localStorage.setItem(key,JSON.stringify({design:design,bg:bg}));}catch(e){}
  }
  function makeChoicePanel(){
    var prefs=readPrefs(),panel=node("section");panel.className="certificate-choice no-print";
    var h=node("h3","🎨 Настройте внешний вид сертификата");h.style.marginTop="0";panel.appendChild(h);
    var grid=node("div");grid.className="certificate-choice-grid";
    var dl=node("label","Стиль оформления"),ds=node("select");ds.id="certificateDesign";
    Object.keys(designs).forEach(function(k){var o=node("option",designs[k].label);o.value=k;ds.appendChild(o);});
    ds.value=designs[prefs.design]?prefs.design:"classic";dl.appendChild(ds);
    var bl=node("label","Фон документа"),bs=node("select");bs.id="certificateBackground";
    Object.keys(backgrounds).forEach(function(k){var o=node("option",backgrounds[k].label);o.value=k;bs.appendChild(o);});
    bs.value=backgrounds[prefs.bg]?prefs.bg:"white";bl.appendChild(bs);
    grid.appendChild(dl);grid.appendChild(bl);panel.appendChild(grid);
    var preview=node("div","Предпросмотр фона сертификата");preview.className="certificate-choice-preview";panel.appendChild(preview);
    var hint=node("p","Выбор сохраняется в этом браузере. При печати выберите «Сохранить как PDF» и включите печать фоновой графики, если хотите сохранить цветной фон.");
    hint.style.cssText="font-size:12px;color:var(--muted);margin-bottom:0";panel.appendChild(hint);
    function update(){applyDesign(ds.value,bs.value);var selected=backgrounds[bs.value]||backgrounds.white;preview.style.background=selected.css||"#fff";if(selected.image)preview.style.backgroundImage='linear-gradient(rgba(255,255,255,.76),rgba(255,255,255,.76)),url("'+selected.image+'")';preview.textContent=selected.label;}
    update();ds.addEventListener("change",update);bs.addEventListener("change",update);
    return panel;
  }
  function addCell(row,value,tag){row.appendChild(node(tag||"td",value));}
  function renderStages(box,results,assignments,courseId){
    var testRows=(results||[]).filter(function(r){return Number(r.grade)>=3;}).map(function(r){return {
      kind:"Контроль знаний",title:r.testTitle||r.testId||"Учебный тест",grade:r.grade,
      percent:r.percent==null?"—":r.percent+"%",date:r.finishedAt||""
    };});
    var practicalRows=[];
    (assignments||[]).forEach(function(t){
      if(String(t.courseId||"")!==String(courseId))return;
      var sub=t.submission;
      if(sub&&sub.status==="reviewed"&&Number(sub.grade)>=3)practicalRows.push({
        kind:"Практическая работа",title:t.title||t.topic||"Задание",grade:sub.grade,
        percent:"—",date:sub.submittedAt||""
      });
    });
    var rows=testRows.concat(practicalRows);
    var summary=node("div");summary.className="cs-summary";
    summary.textContent="Успешно пройдено этапов: "+rows.length+" · Тестов: "+testRows.length+" · Практических работ: "+practicalRows.length;
    box.appendChild(summary);
    if(!rows.length){box.appendChild(node("p","Пока нет подтверждённых этапов с положительной оценкой по выбранной дисциплине. После проверки работ приложение обновится."));return;}
    var table=node("table"),head=node("thead"),hr=node("tr");
    ["№","Этап обучения","Вид работы","Оценка","Результат","Дата"].forEach(function(v){addCell(hr,v,"th");});
    head.appendChild(hr);table.appendChild(head);
    var body=node("tbody");
    rows.forEach(function(r,i){
      var tr=node("tr");
      [i+1,r.title,r.kind,r.grade,r.percent,r.date?new Date(r.date).toLocaleDateString("ru-RU"):"—"].forEach(function(v){addCell(tr,v);});
      body.appendChild(tr);
    });
    table.appendChild(body);box.appendChild(table);
  }
  var base=window.renderCertificatePage;
  if(typeof base!=="function")return;
  window.renderCertificatePage=function(){
    base.apply(this,arguments);
    var app=document.getElementById("app");
    if(!app||!window.state||!window.state.student)return;
    addStyles();
    var cert=document.getElementById("printable-cert");
    var panel=makeChoicePanel();
    var printButton=app.querySelector(".no-print button");
    var printWrap=printButton&&printButton.parentNode;
    if(printWrap&&printWrap.parentNode)printWrap.parentNode.insertBefore(panel,printWrap.nextSibling);
    else app.insertBefore(panel,app.firstChild);
    var prefs=readPrefs();applyDesign(prefs.design||"classic",prefs.bg||"white");
    var courseId=window.state.activeCourseId||"07.01";
    var course=(window.MDK_DATA&&window.MDK_DATA[courseId])||{};
    var box=node("section");box.className="certificate-supplement";
    box.appendChild(node("div","ПРИЛОЖЕНИЕ К СЕРТИФИКАТУ")).className="cs-kicker";
    box.appendChild(node("h2","Перечень успешно пройденных этапов"));
    box.appendChild(node("p","Обучающийся: "+(window.state.student.name||""))).className="cs-meta";
    box.appendChild(node("p","Дисциплина: "+(course.title||courseId))).className="cs-meta";
    var status=node("p","Загружаем подтверждённые результаты…");status.className="cs-summary";box.appendChild(status);
    var tableWrap=node("div");box.appendChild(tableWrap);
    var note=node("p","В приложение включены только результаты, подтверждённые учебным порталом: тесты с оценкой не ниже 3 и проверенные практические работы с положительной оценкой. Незавершённые и ожидающие проверки задания не учитываются.");note.className="cs-note";box.appendChild(note);
    app.appendChild(box);
    if(printButton){printButton.disabled=true;printButton.textContent="Загружаем приложение…";}
    function enablePrint(){if(printButton){printButton.disabled=false;printButton.textContent="🖨 Распечатать сертификат и приложение";}}
    function error(message){status.textContent="Не удалось загрузить приложение";tableWrap.textContent=message;enablePrint();}
    if(window.API&&typeof window.API.getMyCourseResults==="function"){
      Promise.all([window.API.getMyCourseResults(courseId),window.API.getAssignments?window.API.getAssignments():Promise.resolve({success:true,assignments:[]})])
      .then(function(data){
        if(!data[0]||!data[0].success)throw new Error(data[0]&&data[0].error||"Сервер не подтвердил получение результатов.");
        status.remove();renderStages(tableWrap,data[0].results||[],data[1]&&data[1].success?data[1].assignments||[]:[],courseId);enablePrint();
      }).catch(function(e){error(e.message||"Проверьте подключение и повторите попытку.");});
    }else{error("Источник результатов недоступен. Приложение не заполнено демонстрационными данными.");}
    if(cert)cert.setAttribute("aria-label","Сертификат об освоении программы");
  };
})();
