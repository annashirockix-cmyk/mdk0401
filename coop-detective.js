"use strict";
(function(){
  var files = ['coop-detective-part0.js', 'coop-detective-part1.js', 'coop-detective-part2.js', 'coop-detective-part3.js'];
  var parts = [];
  function next(i){
    if(i>=files.length){
      try { (0,eval)(parts.join("")); }
      catch(e){ console.error("[coop-detective] eval", e); }
      return;
    }
    fetch("./"+files[i]+"?v=6").then(function(r){
      if(!r.ok) throw new Error("HTTP "+r.status+" "+files[i]);
      return r.text();
    }).then(function(t){
      parts[i]=t; next(i+1);
    }).catch(function(e){
      console.error("[coop-detective] load", e);
    });
  }
  next(0);
})();
