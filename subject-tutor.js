"use strict";

/**
 * Предметный помощник — локальный поиск по материалам, загруженным в MDK_DATA.
 * Не генерирует неподтверждённые сведения: показывает найденные фрагменты,
 * практические задания и вопросы самопроверки непосредственно из курса.
 */
window.renderSubjectTutor = function () {
    var app=document.getElementById("app"); if(!app)return;
    var db=window.MDK_DATA||{};
    var ids=Object.keys(db).filter(function(id){return db[id]&&Array.isArray(db[id].sections);});
    function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
    function norm(s){return String(s||"").toLowerCase().replace(/ё/g,"е").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/[^a-zа-я0-9]+/gi," ").trim();}
    function plain(s){var d=document.createElement("div");d.innerHTML=String(s||"");return (d.textContent||d.innerText||"").replace(/\s+/g," ").trim();}
    function terms(s){return norm(s).split(/\s+/).filter(function(t){return t.length>2&&!["что","как","для","это","при","или","над","под","про","тема","мдк","мне","можно","нужно","объясни","расскажи","пожалуйста"].includes(t);});}
    function courseName(id){return db[id].shortName||db[id].title||id;}
    function collect(){
        var out=[];
        ids.forEach(function(cid){
            var course=db[cid];
            (course.sections||[]).forEach(function(section){
                (section.topics||[]).forEach(function(topic){
                    out.push({cid:cid,course:courseName(cid),section:section.title||section.code||"",topic:topic});
                });
            });
        });
        return out;
    }
    var all=collect();
    app.innerHTML=[
      '<section class="card" style="padding:clamp(14px,2vw,24px)">',
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:space-between"><div><h1 style="margin:0 0 5px">🎓 Предметный помощник</h1><p style="margin:0;color:var(--muted)">Ищет ответы в лекциях, практических и тестах учебного портала.</p></div><span class="pill">Работает офлайн</span></div>',
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin:18px 0">',
      '<label>Дисциплина<select id="tutorCourse" style="display:block;width:100%;padding:10px;margin-top:5px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px"><option value="*">Все дисциплины</option>'+ids.map(function(id){return '<option value="'+esc(id)+'">'+esc(courseName(id))+'</option>';}).join("")+'</select></label>',
      '<label>Что нужно разобрать?<input id="tutorQuery" type="search" placeholder="Например: твёрдость, базирование, G01..." style="display:block;width:100%;padding:10px;margin-top:5px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px"></label>',
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"><button type="button" class="btn" id="tutorSearch">Найти в учебных материалах</button><button type="button" class="btn ghost" id="tutorRandom">Случайная тема для повторения</button></div>',
      '<div id="tutorNotice" role="status" style="padding:10px 12px;border-radius:9px;background:var(--card-soft);color:var(--muted);margin-bottom:12px">Выбери дисциплину и введи вопрос или ключевые слова. Я покажу, где это раскрыто в материалах курса.</div>',
      '<div id="tutorResults" style="display:grid;gap:12px"></div>',
      '<div style="margin-top:18px;padding:12px;border:1px solid var(--border);border-radius:10px;color:var(--muted);font-size:13px"><b>Как работает помощник:</b> поиск выполняется по содержимому курсов, которые уже загружены в портал. Если нужного объяснения в материалах нет, помощник сообщит об этом, а не будет придумывать ответ. Для свободного диалога с генеративной моделью требуется отдельный подключённый ИИ-сервис.</div>',
      '</section>'
    ].join("");
    var courseSelect=app.querySelector("#tutorCourse"),queryInput=app.querySelector("#tutorQuery"),results=app.querySelector("#tutorResults"),notice=app.querySelector("#tutorNotice");
    function renderCard(item,query){
        var topic=item.topic, lectures=Array.isArray(topic.lectures)?topic.lectures:[], practices=Array.isArray(topic.practicals)?topic.practicals:[], self=Array.isArray(topic.selfWork)?topic.selfWork:[], tests=Array.isArray(topic.test)?topic.test:[];
        var qterms=terms(query), lectureCards=lectures.map(function(l){
            var body=plain(l.content||l.text||""); if(!body)return "";
            var chunks=body.split(/(?<=[.!?])\s+/),ranked=chunks.map(function(t){return {t:t,s:qterms.reduce(function(n,w){return n+(norm(t).indexOf(w)>=0?1:0);},0)};}).sort(function(a,b){return b.s-a.s;});
            var selected=(qterms.length?ranked.filter(function(x){return x.s>0;}).slice(0,4):ranked.slice(0,3)).map(function(x){return x.t;});
            if(!selected.length)selected=ranked.slice(0,2).map(function(x){return x.t;});
            return '<div style="margin-top:10px"><b>'+esc(l.code||"Лекция")+' · '+esc(l.title||"Учебный материал")+'</b><p style="margin:5px 0;color:var(--text);line-height:1.55">'+esc(selected.join(" "))+'</p></div>';
        }).join("");
        var practiceHtml=practices.slice(0,3).map(function(p){return '<li><b>'+esc(p.code||"Практика")+' '+esc(p.title||"")+'</b><br>'+esc(p.goal||p.task||"")+'</li>';}).join("");
        var selfHtml=self.slice(0,3).map(function(p){return '<li><b>'+esc(p.title||p.code||"Самостоятельная работа")+'</b>: '+esc(p.task||p.description||"")+'</li>';}).join("");
        var testHtml=tests.length?'<button type="button" class="btn ghost" data-quiz="'+esc(item.cid+"|"+topic.id)+'">Проверить себя · '+tests.length+' вопрос(а)</button>':"";
        var dest="#/topic/"+encodeURIComponent(item.cid)+"/"+encodeURIComponent(topic.id);
        return '<article class="card" style="background:var(--card-soft);padding:14px"><div style="font-size:12px;color:var(--accent)">'+esc(item.course)+' · '+esc(item.section)+'</div><h2 style="margin:5px 0 8px;font-size:19px">'+esc(topic.code||"Тема")+' — '+esc(topic.title||"Без названия")+'</h2>'+lectureCards+(practiceHtml?'<h3>Практика из курса</h3><ol>'+practiceHtml+'</ol>':"")+(selfHtml?'<h3>Самостоятельная работа</h3><ol>'+selfHtml+'</ol>':"")+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><a class="btn" href="'+dest+'">Открыть тему в курсе ↗</a>'+testHtml+'</div></article>';
    }
    function search(q){
        var chosen=courseSelect.value,words=terms(q);
        if(!words.length){notice.textContent="Введи предметный вопрос или хотя бы одно ключевое слово (например: «измерение твёрдости»).";results.innerHTML="";return;}
        var found=all.filter(function(item){return chosen==="*"||item.cid===chosen;}).map(function(item){
            var topic=item.topic,content=[item.course,item.section,topic.code,topic.title].concat((topic.lectures||[]).map(function(l){return l.title+" "+plain(l.content||l.text||"");}),(topic.practicals||[]).map(function(p){return p.title+" "+p.goal+" "+p.task;}),(topic.selfWork||[]).map(function(p){return p.title+" "+p.task;})).join(" ");
            var hay=norm(content),score=words.reduce(function(n,w){return n+(hay.indexOf(w)>=0?2:0);},0);
            if(norm(topic.title).indexOf(norm(q))>=0)score+=5;
            return {item:item,score:score};
        }).filter(function(x){return x.score>0;}).sort(function(a,b){return b.score-a.score;}).slice(0,6);
        if(!found.length){notice.textContent="В выбранной дисциплине не найден фрагмент по запросу «"+q+"». Попробуй более короткий термин или переключи дисциплину. Я не буду подменять содержание курса неподтверждённым ответом.";results.innerHTML="";return;}
        notice.textContent="Найдено тем: "+found.length+". Ниже показаны выдержки из лекций и связанные задания исходного курса.";
        results.innerHTML=found.map(function(x){return renderCard(x.item,q);}).join("");
        results.querySelectorAll("[data-quiz]").forEach(function(btn){btn.onclick=function(){var p=btn.getAttribute("data-quiz").split("|"),item=all.find(function(x){return x.cid===p[0]&&String(x.topic.id)===p[1];});if(item)showQuiz(item);};});
    }
    function showQuiz(item){
        var questions=Array.isArray(item.topic.test)?item.topic.test:[];
        if(!questions.length){notice.textContent="В этой теме тестовые вопросы не добавлены.";return;}
        var q=questions[Math.floor(Math.random()*questions.length)],opts=Array.isArray(q.options)?q.options:[];
        if(!opts.length){notice.textContent="Формат вопроса в источнике не поддерживается.";return;}
        var box=document.createElement("article");box.className="card";box.style.background="var(--card-soft)";
        var title=document.createElement("h3");title.textContent="Самопроверка · "+(item.topic.code||item.topic.title);box.appendChild(title);
        var prompt=document.createElement("p");prompt.textContent=q.q||"Вопрос";box.appendChild(prompt);
        var form=document.createElement("div");form.style.display="grid";form.style.gap="7px";
        var selected=null;
        opts.forEach(function(option,index){var b=document.createElement("button");b.type="button";b.className="btn ghost";b.style.textAlign="left";b.textContent=String.fromCharCode(65+index)+". "+option;b.onclick=function(){selected=index;form.querySelectorAll("button").forEach(function(x){x.style.outline="";});b.style.outline="2px solid var(--accent)";};form.appendChild(b);});
        box.appendChild(form);
        var check=document.createElement("button");check.type="button";check.className="btn";check.style.marginTop="10px";check.textContent="Проверить ответ";box.appendChild(check);
        var feedback=document.createElement("p");feedback.setAttribute("role","status");box.appendChild(feedback);
        check.onclick=function(){if(selected===null){feedback.textContent="Сначала выбери вариант.";return;}var correct=Number(q.correct);if(selected===correct){feedback.textContent="Верно! Ответ соответствует ключу самопроверки в курсе.";feedback.style.color="var(--success,#16a34a)";}else{feedback.textContent="Пока неверно. Правильный вариант: "+(opts[correct]||"не указан в источнике")+". Вернись к лекции и попробуй ещё раз.";feedback.style.color="var(--danger,#dc2626)";}};
        results.prepend(box);box.scrollIntoView({behavior:"smooth",block:"start"});
    }
    app.querySelector("#tutorSearch").onclick=function(){search(queryInput.value.trim());};
    queryInput.addEventListener("keydown",function(e){if(e.key==="Enter")search(queryInput.value.trim());});
    app.querySelector("#tutorRandom").onclick=function(){var pool=all.filter(function(x){return courseSelect.value==="*"||x.cid===courseSelect.value;});if(!pool.length)return;var item=pool[Math.floor(Math.random()*pool.length)];queryInput.value=item.topic.title||item.topic.code;search(queryInput.value);};
    courseSelect.addEventListener("change",function(){if(queryInput.value.trim())search(queryInput.value.trim());});
};
