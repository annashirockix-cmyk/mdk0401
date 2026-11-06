"use strict";
(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>window.escapeHtml?window.escapeHtml(String(s==null?"":s)):String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const isStaff=()=>!!window.state.staff&&["teacher","admin"].indexOf(String(window.state.staff.role||"").toLowerCase())>=0;
  const hasAccess=()=>!window.canAccessCourse||window.canAccessCourse("MAT");
  function shell(){const app=$("app");if(!app)return null;app.innerHTML='<a class="backlink" href="#/">← На главную</a><section class="hero"><h1>📚 Библиотека учебников PDF</h1><p>Материаловедение · учебные ресурсы курса</p></section>';const c=$("crumbs");if(c)c.textContent="Библиотека учебников";return app;}
  function records(){return ((window.customContent&&window.customContent.files)||[]).filter(x=>x.mdkId==="MAT"&&x.topicId==="__library__");}
  window.renderBookLibrary=function(){
    const app=shell();if(!app)return;
    if(!hasAccess()){app.insertAdjacentHTML("beforeend",'<section class="module">Нет доступа к библиотеке материаловедения.</section>');return;}
    if(isStaff())app.insertAdjacentHTML("beforeend",'<section class="module"><h2>Добавить учебник или методическое пособие</h2><p>Выберите PDF до 8 МБ. Для доступа студентов по ссылке установите флажок — тогда файл будет доступен любому, у кого есть ссылка.</p><input id="bookPdfFiles" type="file" accept="application/pdf,.pdf" multiple class="self-input"><label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0"><input id="bookPdfPublic" type="checkbox"> <span>Разрешить просмотр всем, у кого есть ссылка (нужно для студентов без доступа к вашему Google Drive)</span></label><button class="btn" id="bookPdfUpload">Загрузить выбранные PDF</button><p id="bookPdfStatus" aria-live="polite"></p></section>');
    const list=records();
    app.insertAdjacentHTML("beforeend",'<section class="module"><h2>Учебные материалы</h2><div id="bookPdfList">'+(list.length?list.map(x=>'<article style="padding:12px 0;border-bottom:1px solid var(--border)"><b>📄 '+esc(x.title)+'</b><p class="museum-muted">'+(x.publicLink?"Доступ по ссылке":"Доступ ограничен владельцем Google Drive")+'</p><a class="btn ghost" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">Открыть PDF</a>'+(isStaff()?'<button class="btn ghost" data-delete-book="'+esc(x.id)+'">Удалить из библиотеки</button>':'')+'</article>').join(""):'<p>Учебники пока не добавлены.</p>')+'</div></section>');
    if(isStaff()){
      $("bookPdfUpload").onclick=async function(){
        const input=$("bookPdfFiles"),files=Array.from(input.files||[]),status=$("bookPdfStatus");
        if(!files.length){status.textContent="Сначала выберите PDF-файлы.";return;}
        this.disabled=true;let done=0;
        try{
          for(const file of files){
            if(file.type!=="application/pdf"&&!/\.pdf$/i.test(file.name))throw Error(file.name+": выбран не PDF.");
            if(file.size>8*1024*1024)throw Error(file.name+": размер превышает 8 МБ.");
            status.textContent="Загрузка "+file.name+"…";
            const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));reader.onerror=()=>reject(Error("Не удалось прочитать "+file.name));reader.readAsDataURL(file);});
            const base64=dataUrl.split(",")[1]||"";
            const up=await window.API.uploadBookPdf({courseId:"MAT",name:file.name,mimeType:"application/pdf",base64:base64,shareByLink:$("bookPdfPublic").checked});
            if(!up||!up.success)throw Error(up&&up.error||"Ошибка загрузки "+file.name);
            const saved=await window.API.saveCustomContent({id:"book-"+up.fileId,mdkId:"MAT",topicId:"__library__",type:"file",title:file.name,url:up.url,fileId:up.fileId,publicLink:!!up.publicLink,mimeType:"application/pdf"});
            if(!saved||!saved.success)throw Error(saved&&saved.error||"Файл загружен в Drive, но не добавлен в каталог: "+file.name);
            done++;
          }
          await new Promise(resolve=>window.loadGlobalCustomContent(resolve));
          status.textContent="Готово: загружено "+done+" PDF.";
          window.renderBookLibrary();
        }catch(e){status.textContent=e.message;}finally{this.disabled=false;}
      };
      app.querySelectorAll("[data-delete-book]").forEach(b=>b.onclick=async()=>{if(!confirm("Удалить ссылку из библиотеки? Сам файл в Google Drive останется."))return;try{const res=await window.API.deleteCustomContent(b.dataset.deleteBook);if(!res||!res.success)throw Error(res&&res.error||"Не удалось удалить запись");await new Promise(resolve=>window.loadGlobalCustomContent(resolve));window.renderBookLibrary();}catch(e){window.showToast(e.message,"err");}});
    }
  };
  const prior=window.router;if(prior)window.router=function(){const p=(location.hash||"").replace(/^#/,"").split("/").filter(Boolean);if(p[0]==="book-library"){window.renderBookLibrary();return;}prior.apply(this,arguments);};
})();
