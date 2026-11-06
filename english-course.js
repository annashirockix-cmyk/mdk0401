"use strict";
(function(){
  var basic=window.MDK_DATA&&window.MDK_DATA.basic;
  var technical=window.MDK_DATA&&window.MDK_DATA.technical;
  if(!basic||!technical){console.error("[English] Не загружены исходные модули Basic/Technical English.");return;}
  function tagSections(sections,track){
    return (sections||[]).map(function(section){
      var copy=Object.assign({},section);
      copy.sourceTrack=track;
      copy.code=(track==="basic"?"BASIC":"TECHNICAL")+" · "+String(section.code||"");
      copy.topics=(section.topics||[]).map(function(topic){return Object.assign({},topic,{sourceTrack:track});});
      return copy;
    });
  }
  window.MDK_DATA.ENB={
    id:"ENB",shortName:"Английский — базовый",title:"Базовый английский",module:"Basic English · учебный курс СПО",sections:tagSections(basic.sections,"basic"),videos:[],passports:[],safety:[],formatting:{},flashcards:{basic:(basic.flashcards&&basic.flashcards.basic)||[],technical:[],crossword:{basic:(basic.flashcards&&basic.flashcards.crossword)||[],technical:[]}},sourceTrack:"basic"
  };
  window.MDK_DATA.ENT={
    id:"ENT",shortName:"Английский — технический",title:"Технический английский",module:"Technical English · учебный курс СПО",sections:tagSections(technical.sections,"technical"),videos:[],passports:[],safety:[],formatting:{},flashcards:{basic:[],technical:(technical.flashcards&&technical.flashcards.technical)||[],crossword:{basic:[],technical:(technical.flashcards&&technical.flashcards.crossword)||[]}},sourceTrack:"technical"
  };
  window.MDK_DATA.EN={
    id:"EN",shortName:"Английский язык",
    title:"Английский язык — базовый и технический",
    module:"Basic English + Technical English · учебный курс СПО",
    sections:tagSections(basic.sections,"basic").concat(tagSections(technical.sections,"technical")),
    videos:[],passports:[],safety:[],formatting:{},
    flashcards:{
      basic:(basic.flashcards&&basic.flashcards.basic)||[],
      technical:(technical.flashcards&&technical.flashcards.technical)||[],
      crossword:{basic:(basic.flashcards&&basic.flashcards.crossword)||[],technical:(technical.flashcards&&technical.flashcards.crossword)||[]}
    },
    sourceModules:{basic:"Basic English",technical:"Technical English"}
  };
  window.ENGLISH_TRACKS={
    basic:{title:"Базовый английский",shortTitle:"Basic English",sections:basic.sections,flashcards:window.MDK_DATA.EN.flashcards.basic},
    technical:{title:"Технический английский",shortTitle:"Technical English",sections:technical.sections,flashcards:window.MDK_DATA.EN.flashcards.technical}
  };
  console.info("[English] Перенесены исходные разделы:",basic.sections.length,"Basic +",technical.sections.length,"Technical.");
})();