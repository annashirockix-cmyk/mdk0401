"use strict";

var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec";

async function fetchAPI(action, params, method) {
    params = params || {};
    method = method || "GET";
    
    var urlObj = new URL(APPS_SCRIPT_URL);
    urlObj.searchParams.append("action", action);
    urlObj.searchParams.append("t", String(Date.now()));

    var options = { 
        method: method,
        cache: "no-store", 
        redirect: 'follow',
        headers: { 
            'Content-Type': 'text/plain;charset=utf-8'
        }
    };

    if (method === "POST") {
        options.body = JSON.stringify(params);
    } else {
        for (var k in params) {
            if (params[k] !== undefined && params[k] !== null) {
                urlObj.searchParams.append(k, params[k]);
            }
        }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 120000);
    options.signal = controller.signal;

    try {
        const response = await fetch(urlObj.toString(), options);
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error("HTTP Error " + response.status + " " + response.statusText);
        }
        var text = await response.text();
        // Google Apps Script sometimes returns HTML error page instead of JSON
        if (!text || text.trim().charAt(0) === "<") {
            var msg = "Сервер вернул HTML вместо JSON (ошибка в Code.gs).";
            var m = text && text.match(/TypeError:[^<]+/);
            if (m) msg += " " + m[0].trim();
            throw new Error(msg);
        }
        try {
            return JSON.parse(text);
        } catch (parseErr) {
            throw new Error("Не удалось разобрать ответ сервера как JSON");
        }
    } catch (err) {
        clearTimeout(timeoutId);
        console.error("API Error [" + action + "]:", err);
        throw err;
    }
}

window.API = {
    login: function (user, pass) {
        var email = String(user || "").trim().toLowerCase();
        return fetchAPI("login", { email: email, password: pass }, "POST");
    },
    register: function (email, password, name, group) {
        return fetchAPI("register", { email: email, password: password, name: name, group: group }, "POST");
    },
    getStudents: function () {
        return fetchAPI("getStudents", {}, "GET");
    },
    saveStudent: function (key, name, group, payload) {
        return fetchAPI("saveStudent", { email: key.split('|')[0], name: name, group: group, payload: payload }, "POST");
    },
    getResults: function (filters) {
        return fetchAPI("getResults", filters || {}, "GET");
    },
    saveResult: function (data) {
        return fetchAPI("saveResult", data, "POST");
    },
    getSchedule: function () {
        return fetchAPI("getSchedule", {}, "GET");
    },
    saveSchedule: function (data) {
        return fetchAPI("saveSchedule", { schedule: JSON.stringify(data) }, "POST");
    },
    uploadFile: function (fileName, mimeType, fileData) {
        return fetchAPI("upload_file", { fileName: fileName, mimeType: mimeType, fileData: fileData }, "POST");
    },
    getCustomContent: function () {
        return fetchAPI("get_custom_content", {}, "GET");
    },
    saveCustomContent: function (data) {
        return fetchAPI("save_custom_content", data, "POST");
    },
    deleteCustomContent: function (id) {
        return fetchAPI("delete_custom_content", { id: id }, "POST");
    }
};
