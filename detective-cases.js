"use strict";
(function(){
  fetch("./detective-cases.full.js?v=3").then(function(r){return r.text();}).then(function(code){
    (0,eval)(code);
  }).catch(function(e){console.error("[detective] load fail",e);});
})();
