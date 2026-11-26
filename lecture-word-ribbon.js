"use strict";
(function(){
  const $=id=>document.getElementById(id);
  const exec=(cmd,value)=>{if(!window.__lectureEditor)return;window.__lectureEditor.focus();document.execCommand(cmd,false,value||null);sync();};
  let editor=null,source=null,activeTab="home";
  function sync(){if(source&&editor)source.value=editor.innerHTML;}
  function button(label,title,fn,extra){return '<button type="button" class="ler-btn '+(extra||'')+'" title="'+title.replace(/"/g,"&quot;")+'">'+label+'</button>';}
  function activateTab(tab){
    activeTab=tab;
    const tabs=document.querySelectorAll(".ler-tab");
    tabs.forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle("active",on);b.setAttribute("aria-selected",on?"true":"false");});
    const panel=$("lerRibbonPanel");if(panel)panel.innerHTML=panelMarkup(tab);
    bindPanel();
  }
  function panelMarkup(tab){
    if(tab==="insert")return '<div class="ler-group"><div class="ler-controls">'+button("▦ Таблица","Вставить таблицу 3×3",()=>insertTable())+button("🔗 Ссылка","Вставить ссылку",()=>{const u=prompt("Адрес ссылки (https://…)");if(u&&/^https?:\/\//i.test(u))exec("createLink",u);})+button("▧ Изображение","Вставить изображение",()=>insertImage())+button("— Разделитель","Горизонтальная линия",()=>exec("insertHorizontalRule"))+'</div><small>Элементы</small></div><div class="ler-group"><div class="ler-controls">'+button("Заголовок","Вставить заголовок",()=>exec("formatBlock","h2"))+button("Подзаголовок","Вставить подзаголовок",()=>exec("formatBlock","h3"))+button("Цитата","Вставить цитату",()=>exec("formatBlock","blockquote"))+'</div><small>Блоки</small></div>';
    if(tab==="layout")return '<div class="ler-group"><div class="ler-controls">'+button("По левому краю","Выровнять по левому краю",()=>exec("justifyLeft"))+button("По центру","Выровнять по центру",()=>exec("justifyCenter"))+button("По ширине","Выровнять по ширине",()=>exec("justifyFull"))+button("По правому краю","Выровнять по правому краю",()=>exec("justifyRight"))+'</div><small>Выравнивание</small></div><div class="ler-group"><div class="ler-controls">'+button("↶ Отменить","Отменить",()=>exec("undo"))+button("↷ Повторить","Повторить",()=>exec("redo"))+button("Очистить формат","Убрать форматирование выделения",()=>exec("removeFormat"))+'</div><small>Правки</small></div>';
    return '<div class="ler-group"><div class="ler-controls">'+button("<b>B</b>","Полужирный",()=>exec("bold"))+button("<i>I</i>","Курсив",()=>exec("italic"))+button("<u>U</u>","Подчёркивание",()=>exec("underline"))+button("<s>S</s>","Зачёркивание",()=>exec("strikeThrough"))+button("x₂","Нижний индекс",()=>exec("subscript"))+button("x²","Верхний индекс",()=>exec("superscript"))+'</div><small>Шрифт</small></div><div class="ler-group"><div class="ler-controls"><select id="lerFont" aria-label="Шрифт"><option value="Arial">Arial</option><option value="Calibri">Calibri</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option></select><select id="lerSize" aria-label="Размер шрифта"><option value="2">10</option><option value="3" selected>12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">36</option></select><label class="ler-color" title="Цвет текста">A<input id="lerColor" type="color" value="#172033"></label><label class="ler-color mark" title="Цвет выделения">▰<input id="lerHighlight" type="color" value="#fff2a8"></label></div><small>Параметры текста</small></div><div class="ler-group"><div class="ler-controls">'+button("• Список","Маркированный список",()=>exec("insertUnorderedList"))+button("1. Список","Нумерованный список",()=>exec("insertOrderedList"))+button("Отступ −","Уменьшить отступ",()=>exec("outdent"))+button("Отступ +","Увеличить отступ",()=>exec("indent"))+'</div><small>Абзац</small></div><div class="ler-group"><div class="ler-controls">'+button("H1","Заголовок 1",()=>exec("formatBlock","h1"))+button("H2","Заголовок 2",()=>exec("formatBlock","h2"))+button("H3","Заголовок 3",()=>exec("formatBlock","h3"))+button("Обычный","Обычный текст",()=>exec("formatBlock","p"))+'</div><small>Стили</small></div>';
  }
  function insertTable(){
    const rows=Math.max(1,Math.min(12,Number(prompt("Количество строк", "3"))||3));
    const cols=Math.max(1,Math.min(8,Number(prompt("Количество столбцов","3"))||3));
    let html='<table class="lecture-content-table" style="width:100%;border-collapse:collapse" border="1"><tbody>';
    for(let r=0;r<rows;r++){html+="<tr>";for(let c=0;c<cols;c++)html+='<td style="padding:7px;min-width:50px"><br></td>';html+="</tr>";}html+="</tbody></table><p><br></p>";
    exec("insertHTML",html);
  }
  function insertImage(){
    const url=prompt("Вставьте прямую ссылку на изображение (https://…).");
    if(url&&/^https?:\/\//i.test(url)){exec("insertHTML",'<img src="'+url.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'" alt="" style="max-width:100%;height:auto">');}
  }
  function bindPanel(){
    const p=$("lerRibbonPanel");if(!p)return;
    p.querySelectorAll(".ler-btn").forEach((b,i)=>{const actions=p.__actions||[];if(actions[i])b.addEventListener("click",actions[i]);});
    const font=$("lerFont"),size=$("lerSize"),color=$("lerColor"),mark=$("lerHighlight");
    if(font)font.onchange=()=>exec("fontName",font.value);
    if(size)size.onchange=()=>exec("fontSize",size.value);
    if(color)color.oninput=()=>exec("foreColor",color.value);
    if(mark)mark.oninput=()=>exec("hiliteColor",mark.value);
    // Button actions are attached in the markup factory's delegated action list.
  }
  function insertVideo(){
    const raw=prompt("Вставьте ссылку на YouTube или прямую ссылку на MP4/WebM:");
    if(!raw)return;
    let url;try{url=new URL(raw.trim());}catch(e){alert("Проверьте адрес видео.");return;}
    if(url.protocol!=="https:"){alert("Разрешены только HTTPS-ссылки.");return;}
    let html="";
    const host=url.hostname.toLowerCase().replace(/^www\./,"");
    let id="";
    if(host==="youtu.be")id=url.pathname.slice(1).split("/")[0];
    else if(host==="youtube.com"||host==="m.youtube.com"){if(url.pathname==="/watch")id=url.searchParams.get("v")||"";else if(url.pathname.startsWith("/embed/"))id=url.pathname.split("/")[2]||"";}
    if(id&&/^[A-Za-z0-9_-]{6,20}$/.test(id))html='<figure class="lecture-video"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'" title="Видео к лекции" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><figcaption>Видео к лекции</figcaption></figure><p><br></p>';
    else if(/\.(mp4|webm|ogg)(?:$|[?#])/i.test(url.href))html='<figure class="lecture-video"><video controls preload="metadata" playsinline src="'+url.href.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'"></video><figcaption>Видео к лекции</figcaption></figure><p><br></p>';
    else{alert("Поддерживаются YouTube и прямые ссылки на MP4, WebM или OGG.");return;}
    exec("insertHTML",html);
  }
  async function recordVideo(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){alert("Запись видео доступна в современном браузере по HTTPS.");return;}
    let stream=null;
    try{
      stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:true});
      const mime=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(t=>MediaRecorder.isTypeSupported(t))||"";
      const recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});
      const chunks=[];recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
      const overlay=document.createElement("div");overlay.className="ler-recorder";overlay.innerHTML='<div class="ler-recorder-head"><b>● Идёт запись видео</b><button type="button" class="ler-btn" id="lerStopRecord">Остановить запись</button></div><video autoplay muted playsinline></video><small>Камера и микрофон используются только после вашего разрешения браузеру.</small>';
      overlay.querySelector("video").srcObject=stream;
      document.body.appendChild(overlay);
      const stop=()=>{if(recorder.state!=="inactive")recorder.stop();};
      overlay.querySelector("#lerStopRecord").onclick=stop;
      recorder.onstop=()=>{
        stream.getTracks().forEach(t=>t.stop());
        const blob=new Blob(chunks,{type:recorder.mimeType||"video/webm"});
        const url=URL.createObjectURL(blob),name="lecture-recording-"+new Date().toISOString().replace(/[:.]/g,"-")+".webm";
        const a=document.createElement("a");a.href=url;a.download=name;a.textContent="Скачать запись ("+Math.round(blob.size/1024/1024*10)/10+" МБ)";a.className="ler-record-download";
        const note=document.createElement("p");note.textContent="Сохраните файл, загрузите его в своё облачное хранилище и вставьте ссылку в лекцию через «Видео по ссылке».";
        overlay.innerHTML="";const preview=document.createElement("video");preview.controls=true;preview.playsInline=true;preview.src=url;preview.style.cssText="width:100%;max-height:300px;background:#05080d;border-radius:8px";overlay.appendChild(preview);overlay.appendChild(a);overlay.appendChild(note);
        const close=document.createElement("button");close.className="ler-btn";close.textContent="Закрыть";close.onclick=()=>{URL.revokeObjectURL(url);overlay.remove();};overlay.appendChild(close);
      };
      recorder.start(1000);
    }catch(e){if(stream)stream.getTracks().forEach(t=>t.stop());alert("Не удалось начать запись: "+(e.message||e));}
  }
  function renderPanel(tab){
    const panel=$("lerRibbonPanel");if(!panel)return;
    const actions=[];
    const add=(label,title,fn,extra)=>{actions.push(fn);return '<button type="button" class="ler-btn '+(extra||'')+'" title="'+title+'">'+label+'</button>';};
    if(tab==="insert"){
      panel.innerHTML='<div class="ler-group"><div class="ler-controls">'+add("▦ Таблица","Вставить таблицу",insertTable)+add("🔗 Ссылка","Вставить ссылку",()=>{const u=prompt("Адрес ссылки (https://…)");if(u&&/^https:\/\//i.test(u))exec("createLink",u);})+add("▧ Изображение","Вставить изображение",insertImage)+add("▶ Видео по ссылке","Вставить видео в лекцию",insertVideo)+add("● Записать видео","Записать объяснение с камеры и микрофона",recordVideo)+add("— Разделитель","Горизонтальная линия",()=>exec("insertHorizontalRule"))+'</div><small>Текст, медиа и запись</small></div><div class="ler-group"><div class="ler-controls">'+add("H2","Заголовок",()=>exec("formatBlock","h2"))+add("H3","Подзаголовок",()=>exec("formatBlock","h3"))+add("Цитата","Цитата",()=>exec("formatBlock","blockquote"))+'</div><small>Блоки</small></div>';
    } else if(tab==="layout"){
      panel.innerHTML='<div class="ler-group"><div class="ler-controls">'+add("⇤","По левому краю",()=>exec("justifyLeft"))+add("↔","По центру",()=>exec("justifyCenter"))+add("☰","По ширине",()=>exec("justifyFull"))+add("⇥","По правому краю",()=>exec("justifyRight"))+'</div><small>Выравнивание</small></div><div class="ler-group"><div class="ler-controls">'+add("↶ Отменить","Отменить",()=>exec("undo"))+add("↷ Повторить","Повторить",()=>exec("redo"))+add("Очистить формат","Очистить формат",()=>exec("removeFormat"))+'</div><small>Правки</small></div>';
    } else {
      panel.innerHTML='<div class="ler-group"><div class="ler-controls">'+add("<b>B</b>","Полужирный",()=>exec("bold"))+add("<i>I</i>","Курсив",()=>exec("italic"))+add("<u>U</u>","Подчёркивание",()=>exec("underline"))+add("<s>S</s>","Зачёркивание",()=>exec("strikeThrough"))+add("x₂","Нижний индекс",()=>exec("subscript"))+add("x²","Верхний индекс",()=>exec("superscript"))+'</div><small>Начертание</small></div><div class="ler-group"><div class="ler-controls"><select id="lerFont" aria-label="Шрифт"><option>Arial</option><option>Calibri</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option></select><select id="lerSize" aria-label="Размер шрифта"><option value="2">10</option><option value="3" selected>12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">36</option></select><label class="ler-color" title="Цвет текста">A<input id="lerColor" type="color" value="#172033"></label><label class="ler-color mark" title="Цвет выделения">▰<input id="lerHighlight" type="color" value="#fff2a8"></label></div><small>Шрифт и цвет</small></div><div class="ler-group"><div class="ler-controls">'+add("• Список","Маркированный список",()=>exec("insertUnorderedList"))+add("1. Список","Нумерованный список",()=>exec("insertOrderedList"))+add("Отступ −","Уменьшить отступ",()=>exec("outdent"))+add("Отступ +","Увеличить отступ",()=>exec("indent"))+'</div><small>Абзац</small></div><div class="ler-group"><div class="ler-controls">'+add("H1","Заголовок 1",()=>exec("formatBlock","h1"))+add("H2","Заголовок 2",()=>exec("formatBlock","h2"))+add("H3","Заголовок 3",()=>exec("formatBlock","h3"))+add("Обычный","Обычный текст",()=>exec("formatBlock","p"))+'</div><small>Стили</small></div>';
    }
    panel.__actions=actions;
    panel.querySelectorAll(".ler-btn").forEach((b,i)=>{b.addEventListener("mousedown",e=>e.preventDefault());b.addEventListener("click",actions[i]);});
    const f=$("lerFont"),z=$("lerSize"),co=$("lerColor"),hi=$("lerHighlight");
    if(f)f.onchange=()=>exec("fontName",f.value);
    if(z)z.onchange=()=>exec("fontSize",z.value);
    if(co)co.oninput=()=>exec("foreColor",co.value);
    if(hi)hi.oninput=()=>exec("hiliteColor",hi.value);
  }
  function enhance(){
    const old=$("lectureBody");if(!old||old.dataset.wordRibbon==="1")return;
    source=old;
    const nativeValue=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value");
    if(nativeValue)Object.defineProperty(source,"value",{configurable:true,get:()=>nativeValue.get.call(source),set:v=>{nativeValue.set.call(source,v);if(editor)editor.innerHTML=String(v||"");}});
    const wrap=document.createElement("section");wrap.className="lecture-word-editor";
    const ribbon=document.createElement("div");ribbon.className="ler-ribbon";
    ribbon.innerHTML='<div class="ler-titlebar"><span>Документ лекции</span><span class="ler-savehint">Форматирование сохраняется вместе с текстом</span></div><div class="ler-tabs" role="tablist"><button class="ler-tab active" data-tab="home" role="tab" aria-selected="true">Главная</button><button class="ler-tab" data-tab="insert" role="tab" aria-selected="false">Вставка</button><button class="ler-tab" data-tab="layout" role="tab" aria-selected="false">Макет и правка</button></div><div id="lerRibbonPanel" class="ler-panel"></div>';
    editor=document.createElement("div");editor.id="lectureEditor";editor.className="lecture-word-page";editor.contentEditable="true";editor.setAttribute("role","textbox");editor.setAttribute("aria-label","Текст лекции");editor.setAttribute("aria-multiline","true");editor.spellcheck=true;editor.innerHTML=old.value||"";
    Object.defineProperty(editor,"value",{configurable:true,get:()=>editor.innerHTML,set:v=>{editor.innerHTML=String(v||"");}});
    old.dataset.wordRibbon="1";old.hidden=true;old.insertAdjacentElement("afterend",wrap);wrap.appendChild(ribbon);wrap.appendChild(editor);
    window.__lectureEditor=editor;
    editor.addEventListener("input",sync);editor.addEventListener("blur",sync);
    editor.addEventListener("paste",()=>setTimeout(sync,0));
    wrap.querySelectorAll(".ler-tab").forEach(b=>b.addEventListener("click",()=>{wrap.querySelectorAll(".ler-tab").forEach(x=>{const active=x===b;x.classList.toggle("active",active);x.setAttribute("aria-selected",active?"true":"false");});renderPanel(b.dataset.tab);}));
    renderPanel("home");
    const form=old.closest("form")||old.parentElement;
    if(form)form.addEventListener("submit",sync);
  }
  const observer=new MutationObserver(()=>{if($("lectureBody"))enhance();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance);else enhance();
  window.addEventListener("hashchange",()=>setTimeout(enhance,80));
  setInterval(()=>{if($("lectureBody")&&!editor)enhance();},700);
})();
