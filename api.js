"use strict";
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0dGPf0HOelu33KON9q6TsA-tnUUdtcuVMbViwXOtKOH6MwxJA_Y5dzlh_ocn3vKEM/exec";
function getStoredSessionToken() {
  try {
    var token = localStorage.getItem("mdk.session") || "";
    if (token) return token;
    token = sessionStorage.getItem("mdk.session") || "";
    if (token) { try { localStorage.setItem("mdk.session", token); } catch(e) {} }
    return token;
  } catch(e) { return ""; }
}
function setStoredSessionToken(token) {
  try { localStorage.setItem("mdk.session", String(token || "")); } catch(e) {}
  try { sessionStorage.removeItem("mdk.session"); } catch(e) {}
}
function clearStoredSessionToken() {
  try { localStorage.removeItem("mdk.session"); } catch(e) {}
  try { sessionStorage.removeItem("mdk.session"); } catch(e) {}
}
function fetchAPI(action, params, method, timeoutMs) {
  params = Object.assign({}, params || {}); method = method || "GET"; params.action = action;
  var url = new URL(APPS_SCRIPT_URL); url.searchParams.set("action", action); url.searchParams.set("t", String(Date.now()));
  var token = getStoredSessionToken();
  if (token) params.token = token;
  var options = {method:method,cache:"no-store",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"}};
  if (method === "POST") options.body = JSON.stringify(params);
  else Object.keys(params).forEach(function(k){if(params[k]!=null)url.searchParams.set(k,typeof params[k]==="object"?JSON.stringify(params[k]):params[k]);});
  var timeoutMs = Math.max(30000, Number(timeoutMs) || 30000), timedOut = false;
   var ctl = new AbortController(), timer = setTimeout(function(){timedOut=true;ctl.abort();},timeoutMs); options.signal=ctl.signal;
  return fetch(url.toString(),options).then(function(r){clearTimeout(timer);if(!r.ok)throw new Error("HTTP "+r.status);return r.text();})
    .then(function(raw){if(!raw||raw.trim().charAt(0)==="<")throw new Error("Сервер вернул HTML. Проверьте публикацию Google Apps Script.");
      var result;try{result=JSON.parse(raw);}catch(e){throw new Error("Сервер вернул некорректный JSON.");}
      if(result&&result.error&&/сессия|авторизац|войдите/i.test(result.error)){
        clearStoredSessionToken();
        if (typeof window.handleAuthExpired === "function") window.handleAuthExpired(result.error);
      }
      return result;})
    .catch(function(err){
       clearTimeout(timer);
       if(timedOut){
         var timeoutError=new Error("Тайм-аут: Google Apps Script не ответил за "+Math.round(timeoutMs/1000)+" сек.");
         timeoutError.name="TimeoutError";timeoutError.action=action;
         console.error("API ["+action+"] timeout",timeoutError);throw timeoutError;
       }
       var name=(err&&err.name)||"Error",message=(err&&err.message)||String(err||"неизвестная ошибка");
       var diagnostic;
       if(name==="AbortError") diagnostic="Запрос был отменён браузером или расширением (AbortError).";
       else if(name==="TypeError"||/fetch|network|cors/i.test(message)) diagnostic="Браузер не смог получить ответ от Google Apps Script. Возможны CORS, блокировка сети/расширения или проблема перенаправления Google.";
       else diagnostic=message;
       var wrapped=new Error(diagnostic+" [действие: "+action+"; тип: "+name+"; исходное сообщение: "+message+"]");
       wrapped.name=name;wrapped.cause=err;wrapped.action=action;
       console.error("API ["+action+"] request failed", {name:name,message:message,stack:err&&err.stack,url:APPS_SCRIPT_URL});
       throw wrapped;
     });
}
window.API = {
 login:function(email,password){return fetchAPI("login",{email:email,password:password},"POST").then(function(r){if(r&&r.success&&r.token)setStoredSessionToken(r.token);return r;});},
 logout:function(){clearStoredSessionToken();},
 changeCredentials:function(data){return fetchAPI("changeCredentials",data||{},"POST");},
 requestPasswordReset:function(email,note){return fetchAPI("requestPasswordReset",{email:email,note:note||""},"POST");},
 getPasswordRequests:function(){return fetchAPI("getPasswordRequests",{},"GET");},
 resolvePasswordReset:function(id,temporaryPassword){return fetchAPI("resolvePasswordReset",{id:id,temporaryPassword:temporaryPassword},"POST");},
 getPortalSettings:function(){return fetchAPI("getPortalSettings",{},"GET");},
 setGamesAccess:function(gamesByRole){return fetchAPI("setGamesAccess",{gamesByRole:gamesByRole},"POST");},
 register:function(email,password,name,group,invite){return fetchAPI("register",{email:email,password:password,name:name,group:group,invite:invite},"POST");},
 getStudents:function(){return fetchAPI("getStudents",{},"GET");},
 saveStudent:function(key,name,group,payload){var email=String(key||"").indexOf("@")>=0?String(key).trim():(window.state&&window.state.student&&window.state.student.email)||String(key||"").split("|")[0];return fetchAPI("saveStudent",{email:email,name:name,group:group,payload:payload},"POST");},
 getResults:function(filters){return fetchAPI("getResults",filters||{},"GET");},
 getPublicSubjectRatings:function(){return fetchAPI("getPublicSubjectRatings",{}, "GET");},
 getMyCourseResults:function(courseId){return fetchAPI("getMyCourseResults",{courseId:courseId||""},"GET");},
 saveGCodeProgress:function(progress){return fetchAPI("saveGCodeProgress",{progress:progress||{}}, "POST");},
 saveResult:function(data){data=Object.assign({},data||{});if(!data.courseId&&window.state)data.courseId=window.state.activeCourseId||"";return fetchAPI("saveResult",data,"POST");},
 saveTeacherResult:function(data){return fetchAPI("saveTeacherResult",data||{},"POST");},
 getCustomContent:function(){return fetchAPI("getCustomContent",{},"GET");},
 getCustomContentAccess:function(courseId,id){return fetchAPI("getCustomContentAccess",{courseId:courseId,id:id},"GET");},
 setCustomContentAccess:function(courseId,id,open){return fetchAPI("setCustomContentAccess",{courseId:courseId,id:id,open:open},"POST");},
 getTopicAccess:function(courseId,topicId){return fetchAPI("getTopicAccess",{courseId:courseId,topicId:topicId},"GET");},
 setTopicAccess:function(courseId,topicId,open){return fetchAPI("setTopicAccess",{courseId:courseId,topicId:topicId,open:open},"POST");},
 grantTestAttempts:function(courseId,testId,email,extraAttempts){return fetchAPI("grantTestAttempts",{courseId:courseId,testId:testId,email:email,extraAttempts:extraAttempts},"POST");},
 requestTestAttempts:function(courseId,testId,message){return fetchAPI("requestTestAttempts",{courseId:courseId,testId:testId,message:message||""},"POST");},
 getTestAttemptStatus:function(courseId,testId,email){return fetchAPI("getTestAttemptStatus",{courseId:courseId,testId:testId,email:email||""},"GET");},
 gradeWrittenResult:function(email,courseId,testId,grade,feedback){return fetchAPI("gradeWrittenResult",{email:email,courseId:courseId,testId:testId,grade:grade,feedback:feedback||""},"POST");},
 logProctorEvent:function(data){return fetchAPI("logProctorEvent",data||{},"POST");},
 getProctorEvents:function(courseId,email,testId){return fetchAPI("getProctorEvents",{courseId:courseId,email:email||"",testId:testId||""},"GET");},
 getAttemptAudit:function(courseId,email,testId){return fetchAPI("getAttemptAudit",{courseId:courseId,email:email||"",testId:testId||""},"GET");},
 logActivity:function(data){return fetchAPI("logActivity",data||{},"POST");},
 getActivityLog:function(courseId,email,group,offset,limit){return fetchAPI("getActivityLog",{courseId:courseId||"",email:email||"",group:group||"",offset:offset||0,limit:limit||250},"GET");},
 getTutoringLink:function(courseId){return fetchAPI("getTutoringLink",{courseId:courseId},"GET");},
 saveTutoringLink:function(courseId,data){return fetchAPI("saveTutoringLink",Object.assign({courseId:courseId},data||{}),"POST");},
 submitCustomTest:function(testId,answers,timeSpent){return fetchAPI("submitCustomTest",{testId:testId,answers:answers,timeSpent:timeSpent},"POST");},
 backupQuestionBanks:function(backupId,banks){return fetchAPI("backupQuestionBanks",{backupId:backupId,banks:banks},"POST",120000);},
 restoreQuestionBanks:function(backupId){return fetchAPI("restoreQuestionBanks",{backupId:backupId},"POST",120000);},
 importQuestionBanks:function(banks){return fetchAPI("importQuestionBanks",{banks:banks},"POST",120000);},
 getQuestionBank:function(courseId,bankId){return fetchAPI("getQuestionBank",{courseId:courseId,bankId:bankId||""},"GET");},
 getQuestionBankStats:function(){return fetchAPI("getQuestionBankStats",{},"GET",60000);},
 getEnglishVprExam:function(track){return fetchAPI("getEnglishVprExam",{track:track},"GET");},
 importEnglishSemesterTests:function(track,tests){return fetchAPI("importEnglishSemesterTests",{track:track,tests:tests},"POST",120000);},
 getEnglishSemesterTests:function(track){return fetchAPI("getEnglishSemesterTests",{track:track},"GET");},
 submitEnglishSemesterTest:function(data){return fetchAPI("submitEnglishSemesterTest",data||{},"POST",120000);},
 submitEnglishVprExam:function(data){return fetchAPI("submitEnglishVprExam",data||{},"POST",120000);},
 importEnglishVprBank:function(track,exam){return fetchAPI("importEnglishVprBank",{track:track,exam:exam},"POST",120000);},
 getBuiltInTest:function(courseId,testId,bankIds){return fetchAPI("getBuiltTest",{courseId:courseId,testId:testId,bankIds:bankIds||[]},"POST");},
 submitBuiltInTest:function(data){return fetchAPI("submitBuiltTest",data||{},"POST");},
 getFinalExam:function(courseId){return fetchAPI("getFinalExam",{courseId:courseId},"POST");},
 submitFinalExam:function(data){return fetchAPI("submitFinalExam",data||{},"POST");},
 getGameAnswer:function(gameId,categoryIndex,questionIndex){return fetchAPI("getGameAnswer",{gameId:gameId,categoryIndex:categoryIndex,questionIndex:questionIndex},"POST");},
 saveCustomContent:function(data){return fetchAPI("saveCustomContent",data||{},"POST");},
 deleteCustomContent:function(id){return fetchAPI("deleteCustomContent",{id:id},"POST");},
 setTeacherCourses:function(email,courses){return fetchAPI("setTeacherCourses",{email:email,courses:courses},"POST");},
setUserRole:function(email,role){return fetchAPI("setUserRole",{email:email,role:role},"POST");},
 adminCreateUser:function(data){return fetchAPI("adminCreateUser",data||{},"POST");},
 adminDeleteUser:function(email){return fetchAPI("adminDeleteUser",{email:email},"POST");},
 setStudentCourses:function(email,courses){return fetchAPI("setStudentCourses",{email:email,courses:courses},"POST");},
 createInvite:function(data){return fetchAPI("createInvite",data||{},"POST");},
 getInvites:function(){return fetchAPI("getInvites",{},"GET");},
 deactivateInvite:function(code){return fetchAPI("deactivateInvite",{code:code},"POST");},
 getSchedule:function(){return fetchAPI("getSchedule",{},"GET");},
 saveSchedule:function(data){return fetchAPI("saveSchedule",{schedule:JSON.stringify(data)},"POST");},
 createAssignment:function(data){return fetchAPI("createAssignment",data||{},"POST");},
 getAssignments:function(){return fetchAPI("getAssignments",{},"GET");},
 submitAssignment:function(assignmentId,answer){return fetchAPI("submitAssignment",{assignmentId:assignmentId,answer:answer},"POST");},
 gradeAssignment:function(submissionId,grade,feedback){return fetchAPI("gradeAssignment",{submissionId:submissionId,grade:grade,feedback:feedback||""},"POST");},
 getNotifications:function(){return fetchAPI("getNotifications",{},"GET");},
 markNotificationRead:function(id){return fetchAPI("markNotificationRead",{id:id},"POST");},
 markAllNotificationsRead:function(){return fetchAPI("markAllNotificationsRead",{},"POST");},
 createGameRoom:function(data){return fetchAPI("createGameRoom",data||{},"POST");},
 joinGameRoom:function(data){return fetchAPI("joinGameRoom",data||{},"POST");},
 getGameRoom:function(code){return fetchAPI("getGameRoom",{code:code},"GET");},
 updateGameRoom:function(code,state){return fetchAPI("updateGameRoom",{code:code,state:state},"POST");},
 sendGameAction:function(data){return fetchAPI("sendGameAction",data||{},"POST");},
 getGameActions:function(code,after){return fetchAPI("getGameActions",{code:code,after:after||0},"GET");},
 leaveGameRoom:function(code){return fetchAPI("leaveGameRoom",{code:code},"POST");}
};
