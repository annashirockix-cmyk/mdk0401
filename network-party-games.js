"use strict";
(function(){
  var files = ["npgz-0.txt", "npgz-1.txt", "npgz-2.txt", "npgz-3.txt", "npgz-4.txt", "npgz-5.txt", "npgz-6.txt"];
  var parts = [];
  function next(i){
    if(i>=files.length){
      try {
        var bin = atob(parts.join(""));
        var bytes = new Uint8Array(bin.length);
        for (var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        if (typeof DecompressionStream === "undefined") {
          console.error("[network-party] Browser needs DecompressionStream");
          return;
        }
        var ds = new DecompressionStream("gzip");
        var stream = new Blob([bytes]).stream().pipeThrough(ds);
        new Response(stream).text().then(function(code){ (0,eval)(code); })
          .catch(function(e){ console.error("[network-party] gunzip", e); });
      } catch(e) { console.error("[network-party] decode", e); }
      return;
    }
    fetch("./"+files[i]+"?v=7").then(function(r){
      if(!r.ok) throw new Error("HTTP "+r.status+" "+files[i]);
      return r.text();
    }).then(function(t){ parts[i]=t.trim(); next(i+1); })
      .catch(function(e){ console.error("[network-party] load", e); });
  }
  next(0);
})();
