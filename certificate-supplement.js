"use strict";
(function(){
  function el(tag,text){var n=document.createElement(tag);if(text!=null)n.textContent=text;return n;}
  var base=window.renderCertificatePage;
  if(typeof base!=="function")return;
  window.renderCertificatePage=function(){
    base.apply(this,arguments);
    var app=document.getElementById("app");if(!app||!window.state||!window.state.student)return;
    var courseId=window.state.activeCourseId||"07.01";
    var course=(window.MDK_DATA&&window.MDK_DATA[courseId])||{};
    var box=el("section");box.className="module certificate-supplement";box.style.cssText="max-width:900px;margin:22px auto;padding:26px;background:#fff;color:#172033;border:2px solid #315b7d;border-radius:10px;page-break-before:always;break-before:page";
    var kicker=el("div","ПРИЛОЖЕНИЕ К СЕРТИФИКАТУ");kicker.style.cssText="font-size:12px;letter-spacing:2px;color:#315b7d;font-weight:800;text-align:center";box.appendChild(kicker);
    var title=el("h2","Результаты освоения программы");title.style.cssText="text-align:center;color:#17324d;margin:10px 0 4px";box.appendChild(title);
    var student=el("p","Обучающийся: "+(window.state.student.name||""));student.style.textAlign="center";box.appendChild(student);
    var courseName=el("p","Дисциплина: "+(course.title||courseId));courseName.style.textAlign="center";box.appendChild(courseName);
    var summary=el("div","Загружаем сохранённые результаты…");summary.style.cssText="margin:18px 0;padding:14px;background:#edf3f8;border-radius:8px;text-align:center";box.appendChild(summary);
    var tableWrap=el("div");box.appendChild(tableWrap);
    var note=el("p","В приложение включаются только результаты, сохранённые в учебном портале. Незавершённые и неоценённые работы не влияют на средний балл.");note.style.cssText="font-size:11px;color:#526176;margin-top:16px";box.appendChild(note);
    app.appendChild(box);
    var printButton=app.querySelector(".no-print button");
    if(printButton){printButton.disabled=true;printButton.textContent="Загружаем приложение к сертификату…";}
    function enablePrint(){if(printButton){printButton.disabled=false;printButton.textContent="🖨 Распечатать сертификат и приложение";}}
    function renderError(message){summary.textContent="Данные приложения не загружены";tableWrap.innerHTML="";var warning=el("p",message);warning.style.cssText="padding:14px;background:#fff4e5;border-left:4px solid #d97706;color:#7c3f08;border-radius:6px";tableWrap.appendChild(warning);if(printButton){printButton.disabled=false;printButton.textContent="🖨 Распечатать сертификат без приложения";}}
    function render(data){
      var rows=(data&&data.results)||[],stats=(data&&data.summary)||{};
      summary.textContent="Завершено работ: "+(stats.completed!=null?stats.completed:rows.length)+" · Оценено: "+(stats.graded||0)+" · Средний балл: "+(stats.averageGrade||0)+" · Средний результат: "+(stats.averagePercent||0)+"%";
      tableWrap.innerHTML="";
      if(!rows.length){tableWrap.appendChild(el("p","По этой дисциплине пока нет сохранённых оценённых работ."));enablePrint();return;}
      var table=el("table");table.style.cssText="width:100%;border-collapse:collapse;font-size:13px";
      var head=el("thead"),hr=el("tr");["№","Учебная работа","Оценка","Результат","Дата"].forEach(function(x){var th=el("th",x);th.style.cssText="text-align:left;padding:9px;border-bottom:2px solid #315b7d";hr.appendChild(th);});head.appendChild(hr);table.appendChild(head);
      var body=el("tbody");rows.forEach(function(r,i){var tr=el("tr");[String(i+1),r.testTitle||r.testId||"Работа",r.grade>0?String(r.grade):"—",r.percent!=null?String(r.percent)+"%":"—",r.finishedAt?String(r.finishedAt).slice(0,10):"—"].forEach(function(v){var td=el("td",v);td.style.cssText="padding:8px;border-bottom:1px solid #d6e0e9";tr.appendChild(td);});body.appendChild(tr);});table.appendChild(body);tableWrap.appendChild(table);enablePrint();
    }
    if(window.API&&typeof API.getMyCourseResults==="function"){
      API.getMyCourseResults(courseId).then(function(res){if(res&&res.success)render(res);else renderError("Сервер не подтвердил получение результатов. Приложение не сформировано.");}).catch(function(){renderError("Не удалось загрузить результаты с сервера. Проверьте подключение и повторите попытку; сертификат можно распечатать отдельно.");});
    }else{
      var fallback=Object.keys(window.state.results||{}).map(function(k){var v=window.state.results[k];return typeof v==="object"&&v.grade!=null?{testId:k,testTitle:v.testTitle||k,grade:Number(v.grade)||0,percent:Number(v.percent)||0,finishedAt:v.finishedAt||""}:null;}).filter(Boolean);
      render({results:fallback,summary:{completed:fallback.length,graded:fallback.filter(function(x){return x.grade>0;}).length,averageGrade:0,averagePercent:0}});
    }
  };
})();
