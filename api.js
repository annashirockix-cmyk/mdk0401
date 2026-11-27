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
 register:function(email,password,surname,firstName,group,invite){return fetchAPI("register",{email:email,password:password,surname:surname,firstName:firstName,group:group,invite:invite},"POST");},
 getStudents:function(){return fetchAPI("getStudents",{},"GET");},
 saveStudent:function(key,name,group,payload){var email=String(key||"").indexOf("@")>=0?String(key).trim():(window.state&&window.state.student&&window.state.student.email)||String(key||"").split("|")[0];return fetchAPI("saveStudent",{email:email,name:name,group:group,payload:payload},"POST");},
 getResults:function(filters){return fetchAPI("getResults",filters||{},"GET");},
 getPublicSubjectRatings:function(){return fetchAPI("getPublicSubjectRatings",{}, "GET");},
 getMyCourseResults:function(courseId){return fetchAPI("getMyCourseResults",{courseId:courseId||""},"GET");},
 saveGCodeProgress:function(progress){return fetchAPI("saveGCodeProgress",{progress:progress||{}}, "POST");},
 saveResult:function(data){data=Object.assign({},data||{});if(!data.courseId&&window.state)data.courseId=window.state.activeCourseId||"";return fetchAPI("saveResult",data,"POST");},
 saveTeacherResult:function(data){return fetchAPI("saveTeacherResult",data||{},"POST");},
 saveManualGrade:function(data){return fetchAPI("saveManualGrade",data||{},"POST");},
 getCustomContent:function(){return fetchAPI("getCustomContent",{},"GET");},
 importEnglishTeacherMaterials:function(materials){return fetchAPI("importEnglishTeacherMaterials",{materials:materials||[]},"POST",120000);},
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
 getCustomTest:function(testId,courseId){return fetchAPI("getCustomTest",{testId:testId,courseId:courseId||""},"POST");},
 submitCustomTest:function(data){return fetchAPI("submitCustomTest",data||{},"POST");},
 backupQuestionBanks:function(backupId,banks){return fetchAPI("backupQuestionBanks",{backupId:backupId,banks:banks},"POST",120000);},
 restoreQuestionBanks:function(backupId){return fetchAPI("restoreQuestionBanks",{backupId:backupId},"POST",120000);},
 importQuestionBanks:function(banks){return fetchAPI("importQuestionBanks",{banks:banks},"POST",120000);},
 getQuestionBank:function(courseId,bankId){return fetchAPI("getQuestionBank",{courseId:courseId,bankId:bankId||""},"GET");},
 saveQuestionBank:function(courseId,bankId,questions){return fetchAPI("saveQuestionBank",{courseId:courseId,bankId:bankId,questions:questions||[]},"POST",120000);},
 getQuestionBankStats:function(){return fetchAPI("getQuestionBankStats",{},"GET",60000);},
 getEnglishVprExam:function(track){return fetchAPI("getEnglishVprExam",{track:track},"GET");},
 startEnglishVprExam:function(track){return fetchAPI("startEnglishVprExam",{track:track},"POST");},
 saveEnglishVprExamDraft:function(track,attemptId,answers){return fetchAPI("saveEnglishVprExamDraft",{track:track,attemptId:attemptId,answers:answers},"POST",30000);},
 importEnglishSemesterTests:function(track,tests){return fetchAPI("importEnglishSemesterTests",{track:track,tests:tests},"POST",120000);},
 importEnglishExamVariants:function(exams){return fetchAPI("importEnglishExamVariants",{exams:exams},"POST",120000);},
  startEnglishFinalExam:function(courseNo,semester){return fetchAPI("startEnglishFinalExam",{courseNo:courseNo,semester:semester},"POST",30000);},
  resumeEnglishFinalExam:function(attemptId){return fetchAPI("resumeEnglishFinalExam",{attemptId:attemptId},"POST",30000);},
  saveEnglishFinalExamResponses:function(attemptId,responses){return fetchAPI("saveEnglishFinalExamResponses",{attemptId:attemptId,responses:responses},"POST",30000);},
  submitEnglishFinalExam:function(attemptId,responses){return fetchAPI("submitEnglishFinalExam",{attemptId:attemptId,responses:responses||{}}, "POST",30000);},
  getEnglishFinalExamReviews:function(){return fetchAPI("getEnglishFinalExamReviews",{},"POST",30000);},
  gradeEnglishFinalExamWritten:function(attemptId,grades){return fetchAPI("gradeEnglishFinalExamWritten",{attemptId:attemptId,grades:grades},"POST",30000);},
 getEnglishSemesterTests:function(track){return fetchAPI("getEnglishSemesterTests",{track:track},"GET");},
 startEnglishSemesterTest:function(data){return fetchAPI("startEnglishSemesterTest",data||{},"POST");},
 submitEnglishSemesterTest:function(data){return fetchAPI("submitEnglishSemesterTest",data||{},"POST",120000);},
 submitEnglishVprExam:function(data){return fetchAPI("submitEnglishVprExam",data||{},"POST",120000);},
 gradeEnglishVprWrittenPart:function(data){return fetchAPI("gradeEnglishVprWrittenPart",data||{},"POST",120000);},
 importEnglishVprBank:function(track){return fetchAPI("importEnglishVprBank",{track:track},"POST",120000);},
 getBuiltInTest:function(courseId,testId,bankIds){return fetchAPI("getBuiltTest",{courseId:courseId,testId:testId,bankIds:bankIds||[]},"POST");},
 submitBuiltInTest:function(data){return fetchAPI("submitBuiltTest",data||{},"POST");},
 getFinalExam:function(courseId){return fetchAPI("getFinalExam",{courseId:courseId},"POST");},
 submitFinalExam:function(data){return fetchAPI("submitFinalExam",data||{},"POST");},
 getGameAnswer:function(gameId,categoryIndex,questionIndex){return fetchAPI("getGameAnswer",{gameId:gameId,categoryIndex:categoryIndex,questionIndex:questionIndex},"POST");},
 uploadTestImage:function(courseId,dataUrl,name){return fetchAPI("uploadTestImage",{courseId:courseId,dataUrl:dataUrl,name:name||"question-image.jpg"},"POST",60000);},
 uploadExamFile:function(courseId,bankId,fileName,dataUrl){return fetchAPI("uploadExamFile",{courseId:courseId,bankId:bankId,fileName:fileName,dataUrl:dataUrl},"POST",60000);},
 getExamFile:function(attachmentId,examId){return fetchAPI("getExamFile",{attachmentId:attachmentId,examId:examId||""},"POST",60000);},
 deleteExamFile:function(courseId,attachmentId){return fetchAPI("deleteExamFile",{courseId:courseId,attachmentId:attachmentId},"POST",60000);},
 uploadCourseFile:function(courseId,topicId,title,fileName,dataUrl,lectureId,storageProvider){return fetchAPI("uploadCourseFile",{courseId:courseId,topicId:topicId,title:title,fileName:fileName,dataUrl:dataUrl,lectureId:lectureId||"",storageProvider:storageProvider||"portal"},"POST",60000);},
 getCourseVideoUploadStatus:function(uploadId){return fetchAPI("getCourseVideoUploadStatus",{uploadId:uploadId},"POST",60000);},
 startCourseVideoUpload:function(data){return fetchAPI("startCourseVideoUpload",data||{},"POST",60000);},
 uploadCourseVideoChunk:function(uploadId,index,chunkBase64){return fetchAPI("uploadCourseVideoChunk",{uploadId:uploadId,index:index,chunkBase64:chunkBase64},"POST",60000);},
 finishCourseVideoUpload:function(uploadId){return fetchAPI("finishCourseVideoUpload",{uploadId:uploadId},"POST",120000);},
 getCourseVideoChunk:function(itemId,fileRef,index){return fetchAPI("getCourseVideoChunk",{itemId:itemId,fileRef:fileRef,index:index},"POST",60000);},
 getCourseFile:function(itemId,fileRef){return fetchAPI("getCourseFile",{itemId:itemId,fileRef:fileRef},"POST",60000);},
 getTeacherCloudStorage:function(){return fetchAPI("getTeacherCloudStorage",{},"GET");},
 backupTeacherMaterials:function(provider){return fetchAPI("backupTeacherMaterials",{provider:provider},"POST",120000);},
 previewTeacherRestore:function(backupId){return fetchAPI("previewTeacherRestore",{backupId:backupId},"POST",120000);},
 restoreTeacherMaterials:function(backupId){return fetchAPI("restoreTeacherMaterials",{backupId:backupId},"POST",180000);},
 beginTeacherCloudOAuth:function(provider){return fetchAPI("beginTeacherCloudOAuth",{provider:provider},"POST");},
 disconnectTeacherCloudStorage:function(provider){return fetchAPI("disconnectTeacherCloudStorage",{provider:provider},"POST");},
 getWebinars:function(){return fetchAPI("getWebinars",{},"GET");},
 createWebinar:function(data){return fetchAPI("createWebinar",data||{},"POST");},
 joinWebinar:function(id){return fetchAPI("joinWebinar",{webinarId:id},"POST");},
 webinarAttendance:function(id,event){return fetchAPI("webinarAttendance",{webinarId:id,event:event},"POST");},
 saveCustomContent:function(data){return fetchAPI("saveCustomContent",data||{},"POST");},
 deleteCustomContent:function(id,courseId){return fetchAPI("deleteCustomContent",{id:id,courseId:courseId||""},"POST");},
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
 uploadAssignmentAttachment:function(assignmentId,fileName,dataUrl){return fetchAPI("uploadAssignmentAttachment",{assignmentId:assignmentId,fileName:fileName,dataUrl:dataUrl},"POST",60000);},
 getAssignmentAttachment:function(attachmentId){return fetchAPI("getAssignmentAttachment",{attachmentId:attachmentId},"POST",60000);},
 discardAssignmentAttachments:function(attachmentIds){return fetchAPI("discardAssignmentAttachments",{attachmentIds:Array.isArray(attachmentIds)?attachmentIds:[]},"POST",60000);},
 submitAssignment:function(assignmentId,answer,attachmentIds){return fetchAPI("submitAssignment",{assignmentId:assignmentId,answer:answer,attachmentIds:attachmentIds||[]},"POST");},
 gradeAssignment:function(submissionId,grade,feedback,regrade){return fetchAPI("gradeAssignment",{submissionId:submissionId,grade:grade,feedback:feedback||"",regrade:regrade===true},"POST");},
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
