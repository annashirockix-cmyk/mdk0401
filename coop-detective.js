"use strict";
(function(){
  var parts=[], total=5;
  function load(i){
    if(i>=total){finish();return;}
    fetch("./cd-b64-"+i+".txt?v=4").then(function(r){return r.text();}).then(function(t){
      parts[i]=t; load(i+1);
    }).catch(function(e){console.error("[coop-detective] load",e);});
  }
  function finish(){
    try{
      var bin=atob(parts.join(""));
      var bytes=new Uint8Array(bin.length);
      for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      (0,eval)(new TextDecoder("utf-8").decode(bytes));
    }catch(e){console.error("[coop-detective] decode",e);}
  }
  load(0);
})();
