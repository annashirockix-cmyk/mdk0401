"use strict";
(function(){
  var files = ['network-party-part0.js', 'network-party-part1.js', 'network-party-part2.js'];
  var parts = [];
  function next(i){
    if(i>=files.length){
      try { (0,eval)(parts.join("")); }
      catch(e){ console.error("[network-party] eval", e); }
      return;
    }
    fetch("./"+files[i]+"?v=6").then(function(r){
      if(!r.ok) throw new Error("HTTP "+r.status+" "+files[i]);
      return r.text();
    }).then(function(t){
      parts[i]=t; next(i+1);
    }).catch(function(e){
      console.error("[network-party] load", e);
    });
  }
  next(0);
})();
