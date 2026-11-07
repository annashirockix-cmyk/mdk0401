"use strict";
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec";
function fetchAPI(action, params, method) {
  params = Object.assign({}, params || {}); method = method || "GET"; params.action = action;
  var url = new URL(APPS_SCRIPT_URL); url.searchParams.set("action", action); url.searchParams.set("t", String(Date.now()));
  var token = ""; try { token = sessionStorage.getItem("mdk.session") || ""; } catch(e) {}
  if (token) params.token = token;
  var options = {method:method,cache:"no-store",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"}};
  if (method === "POST") options.body = JSON.stringify(params);
  else Object.keys(params).forEach(function(k){if(params[k]!=null)url.searchParams.set(k,typeof params[k]==="object"?JSON.stringify(params[k]):params[k]);});
  var ctl = new AbortController(), timer = setTimeout(function(){ctl.abort();},30000); options.signal=ctl.signal;
  return fetch(url.toString(),options).then(function(r){clearTimeout(timer);if(!r.ok)throw new Error("HTTP "+r.status);return r.text();})
    .then(function(raw){if(!raw||raw.trim().charAt(0)==="<")throw new Error("Сервер вернул HTML. Проверьте публикацию Google Apps Script.");
      var result;try{result=JSON.parse(raw);}catch(e){throw new Error("Сервер вернул некорректный JSON.");}
      if(result&&result.error&&/сессия|авторизац|войдите/i.test(result.error)){try{sessionStorage.removeItem("mdk.session");}catch(e){}}
      return result;})
    .catch(function(err){clearTimeout(timer);console.error("API ["+action+"]",err);throw err;});
}
window.API = {
 login:function(email,password){return fetchAPI("login",{email:email,password:password},"POST").then(function(r){if(r&&r.success&&r.token){try{sessionStorage.setItem("mdk.session",r.token);}catch(e){}}return r;});},
 logout:function(){try{sessionStorage.removeItem("mdk.session");}catch(e){}},
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
 getCustomContent:function(){return fetchAPI("getCustomContent",{},"GET");},
 submitCustomTest:function(testId,answers,timeSpent){return fetchAPI("submitCustomTest",{testId:testId,answers:answers,timeSpent:timeSpent},"POST");},
 uploadBookPdf:function(data){return fetchAPI("uploadBookPdf",data||{},"POST");},
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
