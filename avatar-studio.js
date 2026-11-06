"use strict";
(function(){
  var emojis=["👩‍🔧","🧑‍💻","👩‍🚀","🦊","🐼","🐱","🐉","🤖","🦾","⚙️","🚀","🧠","🎮","🦉","🐺","🦋"];
  function node(tag,text){var n=document.createElement(tag);if(text!=null)n.textContent=text;return n;}
  function renderAvatar(el){
    if(!el)return;
    var st=window.state||{};
    el.innerHTML="";
    if(st.avatar){var img=document.createElement("img");img.src=st.avatar;img.alt="Аватар";img.style.cssText="width:100%;height:100%;object-fit:cover";el.appendChild(img);}
    else el.textContent=st.avatarEmoji||"👩‍🔧";
    el.style.border=st.avatarEffect==="gold"?"4px solid #f4c95d":st.avatarEffect==="pixel"?"4px dashed var(--accent)":"4px solid var(--accent)";
    el.style.boxShadow=st.avatarEffect==="neon"?"0 0 0 4px var(--card),0 0 22px var(--accent)":"none";
  }
  var oldChip=window.renderUserChip;
  if(oldChip)window.renderUserChip=function(){oldChip.apply(this,arguments);renderAvatar(document.getElementById("userChipAvatar"));};
  var oldProfile=window.renderProfilePage;
  if(oldProfile)window.renderProfilePage=function(){
    oldProfile.apply(this,arguments);
    if(!window.state||!window.state.student)return;
    var app=document.getElementById("app");if(!app||app.querySelector("#avatarStudio"))return;
    var box=node("section");box.id="avatarStudio";box.className="module";box.style.cssText="margin-top:18px;padding:20px";
    var h=node("h3","🎨 Мастерская аватара");box.appendChild(h);
    var p=node("p","Выбери образ или загрузи своё изображение. Картинка хранится в профиле на этом устройстве и синхронизируется вместе с учебными данными.");p.style.color="var(--muted)";box.appendChild(p);
    var preview=node("div");preview.style.cssText="width:92px;height:92px;margin:8px auto 14px;border-radius:50%;overflow:hidden;background:var(--card-soft);display:flex;align-items:center;justify-content:center;font-size:48px";renderAvatar(preview);box.appendChild(preview);
    var grid=node("div");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(42px,1fr));gap:7px";
    emojis.forEach(function(emoji){var b=node("button",emoji);b.type="button";b.title="Выбрать "+emoji;b.style.cssText="font-size:24px;padding:7px;background:var(--card-soft)";b.onclick=function(){window.state.avatar=null;window.state.avatarEmoji=emoji;renderAvatar(preview);renderAvatar(document.getElementById("userChipAvatar"));};grid.appendChild(b);});box.appendChild(grid);
    var upload=document.createElement("input");upload.type="file";upload.accept="image/png,image/jpeg,image/webp";upload.style.cssText="display:block;width:100%;margin:14px 0";upload.onchange=function(){var file=upload.files&&upload.files[0];if(!file)return;if(file.size>800*1024){alert("Файл слишком большой. Выбери изображение до 800 КБ.");upload.value="";return;}var objectUrl=URL.createObjectURL(file),image=new Image();image.onload=function(){URL.revokeObjectURL(objectUrl);var side=128,canvas=document.createElement("canvas");canvas.width=side;canvas.height=side;var ctx=canvas.getContext("2d"),crop=Math.min(image.width,image.height),sx=(image.width-crop)/2,sy=(image.height-crop)/2;ctx.fillStyle="#ffffff";ctx.fillRect(0,0,side,side);ctx.drawImage(image,sx,sy,crop,crop,0,0,side,side);var data=canvas.toDataURL("image/jpeg",0.68);if(data.length>38000)data=canvas.toDataURL("image/jpeg",0.5);if(data.length>45000){alert("Не удалось сжать изображение до безопасного размера. Выбери другое фото.");return;}window.state.avatar=data;window.state.avatarEmoji="";renderAvatar(preview);renderAvatar(document.getElementById("userChipAvatar"));};image.onerror=function(){URL.revokeObjectURL(objectUrl);alert("Не удалось открыть изображение.");};image.src=objectUrl;};box.appendChild(upload);
    var effects=node("div");effects.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0";
    [["neon","Неон"],["gold","Золото"],["pixel","Пиксель"],["plain","Классика"]].forEach(function(pair){var b=node("button",pair[1]);b.type="button";b.onclick=function(){window.state.avatarEffect=pair[0];renderAvatar(preview);renderAvatar(document.getElementById("userChipAvatar"));};effects.appendChild(b);});box.appendChild(effects);
    var save=node("button","Сохранить аватар");save.className="btn primary";save.onclick=function(){if(window.saveStudentData)window.saveStudentData();if(window.showToast)window.showToast("Аватар сохранён в профиле","ok");};box.appendChild(save);
    app.appendChild(box);
  };
})();
