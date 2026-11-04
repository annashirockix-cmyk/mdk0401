"use strict";
(function () {
  var DEMO = {
    "student_n@portal.ru": { password: "123456", name: "Тестовый Студент", group: "ТМ-4-3", role: "student" },
    "anna.sh@portal.ru": { password: "teacher123", name: "Широких Анна Анатольевна", group: "Преподаватель", role: "teacher" },
    "teacher@portal.ru": { password: "teacher123", name: "Преподаватель", group: "Преподаватель", role: "teacher" }
  };

  function tryLocal(email, pass) {
    var demo = DEMO[String(email || "").trim().toLowerCase()];
    if (!demo || demo.password !== pass) return null;
    return { success: true, name: demo.name, group: demo.group, role: demo.role, email: String(email || "").trim().toLowerCase() };
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error("Таймаут API " + ms + "мс"));
      }, ms);
      promise.then(function (v) {
        if (done) return;
        done = true;
        clearTimeout(t);
        resolve(v);
      }, function (e) {
        if (done) return;
        done = true;
        clearTimeout(t);
        reject(e);
      });
    });
  }

  function wrapAPI() {
    if (!window.API || !window.API.login || window.API.__offlineWrapped) return;
    var original = window.API.login.bind(window.API);
    window.API.login = function (user, pass) {
      var local = tryLocal(user, pass);
      return withTimeout(original(user, pass), 6000).then(function (res) {
        if (res && res.success) return res;
        if (local) {
          console.warn("API отказ — локальный демо-вход");
          return local;
        }
        return res;
      }).catch(function (err) {
        if (local) {
          console.warn("API недоступен — локальный демо-вход:", err && err.message);
          return local;
        }
        throw err;
      });
    };
    window.API.__offlineWrapped = true;
  }

  wrapAPI();
  document.addEventListener("DOMContentLoaded", wrapAPI);
  setTimeout(wrapAPI, 300);
  setTimeout(wrapAPI, 1000);
  setTimeout(wrapAPI, 3000);
})();
