"use strict";
(function () {
  window.saveStudentData = function () {
    try {
      localStorage.setItem("mdk.state", JSON.stringify(window.state));
      if (window.state.student && window.API && window.API.saveStudent) {
        var email = (window.state.student.email || "").trim().toLowerCase();
        if (!email) return;
        var payload = {
          results: window.state.results || {},
          xp: window.state.xp || 0,
          unlockedAchievements: window.state.unlockedAchievements || [],
          activeCourseId: window.state.activeCourseId || "07.01"
        };
        window.API.saveStudent(
          email,
          window.state.student.name,
          window.state.student.group,
          JSON.stringify(payload)
        ).catch(function (err) {
          console.warn("Sync error", err);
        });
      }
    } catch (e) {
      console.error("Save error", e);
    }
  };

  if (window.API && window.API.saveStudent) {
    var _save = window.API.saveStudent.bind(window.API);
    window.API.saveStudent = function (key, name, group, payload) {
      var email = String(key || "");
      if (email.indexOf("@") === -1) {
        email =
          (window.state && window.state.student && window.state.student.email) ||
          email.split("|")[0];
      }
      return _save(email, name, group, payload);
    };
  }

  function syncJournalKeys() {
    if (!window.state || !window.state.results) return;
    var r = window.state.results;
    var hash = location.hash || "";
    var m = hash.match(/topic\/[^/]+\/(t-[0-9-]+)/);
    if (!m) return;
    var topicId = m[1];
    Object.keys(r).forEach(function (k) {
      if (k.indexOf("self_") === 0 && k.indexOf("self_t-") !== 0) {
        var jk = "self_" + topicId + "_0";
        if (!r[jk] && r[k] && typeof r[k] === "object" && r[k].grade != null) {
          r[jk] = r[k];
        }
      }
    });
  }
  setInterval(syncJournalKeys, 2000);

  var tries = 0;
  function wrapStart() {
    if (typeof window.startInlineTest !== "function") {
      if (tries++ < 20) setTimeout(wrapStart, 300);
      return;
    }
    if (window.startInlineTest.__stage2) return;
    var orig = window.startInlineTest;
    window.startInlineTest = function (topicId, selfWorkCode) {
      orig.apply(this, arguments);
      var check = setInterval(function () {
        if (!window.state || !window.state.results) return;
        var r = window.state.results;
        var legacy = selfWorkCode ? "self_" + selfWorkCode : null;
        var journal = "self_" + topicId + "_0";
        var testKey = "test_" + topicId;
        if (legacy && r[legacy] && !r[journal]) {
          r[journal] = r[legacy];
          if (window.saveStudentData) window.saveStudentData();
          clearInterval(check);
        }
        if (r[testKey] && window.saveStudentData) {
          window.saveStudentData();
          clearInterval(check);
        }
      }, 500);
      setTimeout(function () {
        clearInterval(check);
      }, 120000);
    };
    window.startInlineTest.__stage2 = true;
  }
  wrapStart();
  setTimeout(wrapStart, 1500);
  setTimeout(wrapStart, 4000);

  console.log("[stage2] email-save + journal keys active");
})();
