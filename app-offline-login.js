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
    return { success: true, name: demo.name, group: demo.group, role: demo.role };
  }

  function wrapAPI() {
    if (!window.API || !window.API.login || window.API.__offlineWrapped) return;
    var original = window.API.login.bind(window.API);
    window.API.login = function (user, pass) {
      return original(user, pass).catch(function (err) {
        var local = tryLocal(user, pass);
        if (local) {
          console.warn("API недоступен — локальный демо-вход", err && err.message);
          return local;
        }
        throw err;
      }).then(function (res) {
        if (res && res.success) return res;
        var local = tryLocal(user, pass);
        if (local) {
          console.warn("API отказ — локальный демо-вход");
          return local;
        }
        return res;
      });
    };
    window.API.__offlineWrapped = true;
  }

  wrapAPI();
  document.addEventListener("DOMContentLoaded", wrapAPI);
  setTimeout(wrapAPI, 500);
  setTimeout(wrapAPI, 2000);
})();
