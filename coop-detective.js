"use strict";
(function(){
  var files = ["cdgz-0.txt", "cdgz-1.txt", "cdgz-2.txt", "cdgz-3.txt", "cdgz-4.txt", "cdgz-5.txt", "cdgz-6.txt", "cdgz-7.txt"];
  var parts = [];
  function next(i){
    if(i>=files.length){
      try {
        var bin = atob(parts.join(""));
        var bytes = new Uint8Array(bin.length);
        for (var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        if (typeof DecompressionStream === "undefined") {
          console.error("[coop-detective] Browser needs DecompressionStream");
          return;
        }
        var ds = new DecompressionStream("gzip");
        var stream = new Blob([bytes]).stream().pipeThrough(ds);
        new Response(stream).text().then(function(code){ (0,eval)(code); })
          .catch(function(e){ console.error("[coop-detective] gunzip", e); });
      } catch(e) { console.error("[coop-detective] decode", e); }
      return;
    }
    fetch("./"+files[i]+"?v=7").then(function(r){
      if(!r.ok) throw new Error("HTTP "+r.status+" "+files[i]);
      return r.text();
    }).then(function(t){ parts[i]=t.trim(); next(i+1); })
      .catch(function(e){ console.error("[coop-detective] load", e); });
  }
  next(0);
})();
