(function (root) {
  "use strict";
  var DB_NAME = "mdk-offline-materials-v1";
  var STORE = "snapshots";
  var MAX_AGE_MS = 24 * 60 * 60 * 1000;
  var MAX_BYTES = 8 * 1024 * 1024;
  var ALLOWED_TYPES = { lecture: true, file: true, topic: true };

  function accountKey(user) {
    var email = String(user && user.email || "").trim().toLowerCase();
    var role = String(user && user.role || "").trim().toLowerCase();
    if (!email || !role || !/^(student|teacher|admin)$/.test(role)) return "";
    return role + ":" + email;
  }
  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!root.indexedDB) { reject(new Error("IndexedDB недоступен")); return; }
      var request = root.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error("Не удалось открыть офлайн-хранилище")); };
    });
  }
  function withStore(mode, callback) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode), store = tx.objectStore(STORE), result;
        try { result = callback(store); } catch (error) { try { tx.abort(); } catch (ignore) {} reject(error); return; }
        tx.oncomplete = function () { db.close(); resolve(result); };
        tx.onerror = tx.onabort = function () { db.close(); reject(tx.error || new Error("Ошибка офлайн-хранилища")); };
      });
    });
  }
  function itemKey(row) {
    var type = String(row && row.type || "").toLowerCase();
    var id = row && (row.id || row._id || row.key || row.sourceTopicId);
    var title = row && (row.title || row.name || row.filename || row.fileName || "");
    return type + ":" + String(id || title || "").trim().toLowerCase();
  }
  function readRecord(user) {
    var key = accountKey(user);
    if (!key) return Promise.resolve(null);
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readonly"), request = tx.objectStore(STORE).get(key);
        request.onsuccess = function () { resolve(request.result || null); };
        request.onerror = function () { reject(request.error || new Error("Не удалось прочитать офлайн-хранилище")); };
        tx.oncomplete = function () { db.close(); };
        tx.onerror = tx.onabort = function () { db.close(); reject(tx.error || new Error("Ошибка офлайн-хранилища")); };
      });
    });
  }
  function save(rows, user) {
    var key = accountKey(user);
    if (!key || !Array.isArray(rows)) return Promise.resolve(false);
    return readRecord(user).then(function (oldRecord) {
      var excluded = oldRecord && Array.isArray(oldRecord.excluded) ? oldRecord.excluded : [];
      var excludedMap = {};
      excluded.forEach(function (value) { excludedMap[value] = true; });
      var items = rows.filter(function (row) {
        return row && ALLOWED_TYPES[String(row.type || "").toLowerCase()] === true && !excludedMap[itemKey(row)];
      });
      var serialized;
      try { serialized = JSON.stringify(items); } catch (error) { return false; }
      if (serialized.length * 2 > MAX_BYTES) return false;
      var record = { key: key, email: String(user.email).trim().toLowerCase(),
        role: String(user.role).toLowerCase(), savedAt: Date.now(), items: items,
        excluded: excluded, bytes: serialized.length * 2 };
      return withStore("readwrite", function (store) { store.put(record); }).then(function () { return true; });
    });
  }
  function summary(user) {
    return load(user).then(function (snapshot) {
      if (!snapshot) return { items: [], bytes: 0, savedAt: 0, ageMs: null };
      var items = snapshot.items.map(function (row) {
        return { key: itemKey(row), type: String(row.type || ""),
          title: String(row.title || row.name || row.filename || row.fileName || "Материал без названия") };
      });
      return { items: items, bytes: snapshot.bytes || 0, savedAt: snapshot.savedAt, ageMs: snapshot.ageMs };
    });
  }
  function remove(user, keys) {
    if (!Array.isArray(keys) || !keys.length) return Promise.resolve(false);
    return readRecord(user).then(function (record) {
      if (!record || !Array.isArray(record.items)) return false;
      var selected = {};
      keys.forEach(function (key) { selected[String(key)] = true; });
      var excluded = Array.isArray(record.excluded) ? record.excluded.slice() : [];
      record.items = record.items.filter(function (row) {
        var key = itemKey(row);
        if (selected[key]) { if (excluded.indexOf(key) < 0) excluded.push(key); return false; }
        return true;
      });
      record.excluded = excluded;
      var serialized = JSON.stringify(record.items);
      record.bytes = serialized.length * 2;
      return withStore("readwrite", function (store) { store.put(record); }).then(function () { return true; });
    });
  }
  function load(user) {
    var key = accountKey(user);
    if (!key) return Promise.resolve(null);
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readonly"), request = tx.objectStore(STORE).get(key);
        request.onsuccess = function () {
          var record = request.result, now = Date.now();
          if (!record || record.email !== String(user.email).trim().toLowerCase() ||
              record.role !== String(user.role).toLowerCase() || !Array.isArray(record.items) ||
              !record.savedAt || now - record.savedAt > MAX_AGE_MS || record.savedAt > now + 60000) {
            resolve(null); return;
          }
          resolve({ items: record.items, savedAt: record.savedAt, ageMs: now - record.savedAt });
        };
        request.onerror = function () { reject(request.error || new Error("Не удалось прочитать офлайн-материалы")); };
        tx.oncomplete = function () { db.close(); };
        tx.onerror = tx.onabort = function () { db.close(); reject(tx.error || new Error("Ошибка офлайн-хранилища")); };
      });
    });
  }
  function clear(user) {
    var key = accountKey(user);
    if (!key) return Promise.resolve(false);
    return withStore("readwrite", function (store) { store.delete(key); }).then(function () { return true; });
  }
  function clearOtherUsers(user) {
    var keep = accountKey(user);
    if (!keep) return Promise.resolve(false);
    return withStore("readwrite", function (store) {
      var request = store.openCursor();
      request.onsuccess = function () {
        var cursor = request.result;
        if (!cursor) return;
        if (cursor.key !== keep) cursor.delete();
        cursor.continue();
      };
    }).then(function () { return true; });
  }
  root.OfflineMaterialsCache = {
    save: save, load: load, summary: summary, remove: remove, clear: clear, clearOtherUsers: clearOtherUsers,
    maxAgeMs: MAX_AGE_MS, allowedTypes: ["lecture", "file", "topic"]
  };
})(window);
