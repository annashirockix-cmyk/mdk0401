"use strict";

/*
 * Production authentication must always be validated by Google Apps Script.
 * The API client already allows at least 30 seconds for a request. A shorter
 * wrapper timeout used to trigger a local demo login that returned success
 * without a server session token, disabling protected content and exams.
 */
(function () {
  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        var error = new Error("Сервер авторизации не ответил за " + Math.round(ms / 1000) + " сек. Проверьте соединение с Google Apps Script.");
        error.name = "TimeoutError";
        reject(error);
      }, ms);

      Promise.resolve(promise).then(function (value) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(value);
      }, function (error) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  function wrapAPI() {
    if (!window.API || typeof window.API.login !== "function" || window.API.__serverAuthTimeoutWrapped) return;
    var originalLogin = window.API.login.bind(window.API);

    window.API.login = function (email, password) {
      // api.js uses a minimum 30-second network timeout; leave a small margin.
      // Never fabricate a successful login or bypass server-side authorization.
      return withTimeout(originalLogin(email, password), 35000);
    };

    window.API.__serverAuthTimeoutWrapped = true;
  }

  wrapAPI();
  document.addEventListener("DOMContentLoaded", wrapAPI);
  setTimeout(wrapAPI, 300);
  setTimeout(wrapAPI, 1000);
})();
