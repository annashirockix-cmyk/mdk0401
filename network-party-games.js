"use strict";
(function(){
  fetch("./network-party-games.full.js?v=3").then(function(r){return r.text();}).then(function(code){
    (0,eval)(code);
  }).catch(function(e){console.error("[network-party] load fail",e);});
})();
