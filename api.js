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
 register:function(email,password,name,group){return fetchAPI("register",{email:email,password:password,name:name,group:group},"POST");},
 getStudents:function(){return fetchAPI("getStudents",{},"GET");},
 saveStudent:function(key,name,group,payload){return fetchAPI("saveStudent",{email:String(key||"").split("|")[0],name:name,group:group,payload:payload},"POST");},
 getResults:function(filters){return fetchAPI("getResults",filters||{},"GET");},
 saveResult:function(data){return fetchAPI("saveResult",data||{},"POST");},
 getCustomContent:function(){return fetchAPI("getCustomContent",{},"GET");},
 saveCustomContent:function(data){return fetchAPI("saveCustomContent",data||{},"POST");},
 deleteCustomContent:function(id){return fetchAPI("deleteCustomContent",{id:id},"POST");},
 setTeacherCourses:function(email,courses){return fetchAPI("setTeacherCourses",{email:email,courses:courses},"POST");},
setUserRole:function(email,role){return fetchAPI("setUserRole",{email:email,role:role},"POST");},
 adminCreateUser:function(data){return fetchAPI("adminCreateUser",data||{},"POST");},
 adminDeleteUser:function(email){return fetchAPI("adminDeleteUser",{email:email},"POST");},
 getSchedule:function(){return fetchAPI("getSchedule",{},"GET");},
 saveSchedule:function(data){return fetchAPI("saveSchedule",{schedule:JSON.stringify(data)},"POST");}
};
